import { and, count, desc, eq, inArray, isNotNull, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '#@/constants/platform.ts'
import { favoriteTable, romTable, statusEnum, top100RankTable } from '#@/databases/schema.ts'

type GetRomsReturning = Awaited<ReturnType<typeof getRoms>>
export type Roms = GetRomsReturning['roms']
export type Rom = Roms[number]
export type RomsPagination = GetRomsReturning['pagination']

interface GetRomsParams {
  direction?: 'asc' | 'desc'
  favorite?: boolean
  id?: string
  orderBy?: 'added' | 'name' | 'released' | 'top100'
  page?: number
  pageSize?: number
  platform?: PlatformName
}

export async function getRoms({
  direction = 'asc',
  favorite = false,
  id,
  orderBy = 'name',
  page = 1,
  pageSize = 100,
  platform,
}: GetRomsParams = {}) {
  const { currentUser, db, preference } = getContext().var

  const { library } = db

  const conditions = [eq(romTable.userId, currentUser.id), eq(romTable.status, 1)]
  if (id) {
    conditions.push(eq(romTable.id, id))
  }
  if (platform) {
    conditions.push(eq(romTable.platform, platform))
  } else {
    conditions.push(inArray(romTable.platform, preference.ui.platforms))
  }
  const where = and(...conditions)

  const offset = (page - 1) * pageSize

  const favoriteJoinCondition = and(
    eq(favoriteTable.romId, romTable.id),
    eq(favoriteTable.userId, currentUser.id),
    eq(favoriteTable.status, statusEnum.normal),
  )

  // Normalize gameName to match top100 data format:
  // 1. Strip parenthetical tags like (USA), (Rev 1), etc.
  // 2. Lowercase and strip punctuation: : - ' ! . & → space/and
  // 3. Handle "Name, The" → "The Name" format
  const strippedParens = sql`CASE WHEN INSTR(${romTable.gameName}, '(') > 0 THEN TRIM(SUBSTR(${romTable.gameName}, 1, INSTR(${romTable.gameName}, '(') - 1)) ELSE ${romTable.gameName} END`
  const cleaned = sql`TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(${strippedParens}), ':', ' '), '-', ' '), '''', ''), '!', ''), '.', ''), '&', 'and'), '  ', ' '), '  ', ' '))`
  const normalizedGameName = sql`CASE WHEN ${cleaned} LIKE '%, the %' THEN 'the ' || TRIM(SUBSTR(${cleaned}, 1, INSTR(${cleaned}, ', the ') - 1)) || ' ' || TRIM(SUBSTR(${cleaned}, INSTR(${cleaned}, ', the ') + 6)) WHEN ${cleaned} LIKE '%, the' THEN 'the ' || TRIM(SUBSTR(${cleaned}, 1, INSTR(${cleaned}, ', the') - 1)) ELSE ${cleaned} END`

  const top100JoinCondition = and(
    eq(top100RankTable.platform, romTable.platform),
    sql`${top100RankTable.normalizedName} = ${normalizedGameName}`,
  )

  const baseQuery = library
    .select({
      isFavorite: sql<boolean>`CASE WHEN ${favoriteTable.id} IS NOT NULL THEN 1 ELSE 0 END`,
      rom: romTable,
      top100Rank: top100RankTable.rank,
    })
    .from(romTable)
    .leftJoin(favoriteTable, favoriteJoinCondition)
    .leftJoin(top100RankTable, top100JoinCondition)

  const favoriteWhere = favorite ? and(where, isNotNull(favoriteTable.id)) : where

  let columns: any[]
  if (orderBy === 'top100') {
    // Ranked games first (by rank ASC), then unranked (by name)
    columns = [sql`${top100RankTable.rank} IS NULL`, top100RankTable.rank, sql`LOWER(${romTable.fileName})`]
  } else {
    const columnMap = {
      added: romTable.createdAt,
      name: sql`LOWER(${romTable.fileName})`,
      released: romTable.gameReleaseDate,
    }
    const column = columnMap[orderBy]
    columns = [sql`${column} IS NULL`, direction === 'desc' ? desc(column) : column]
    if (orderBy !== 'name') {
      columns.push(columnMap.name)
    }
  }

  const romsRaw = await baseQuery
    .orderBy(...columns)
    .where(favoriteWhere)
    .offset(offset)
    .limit(pageSize)

  const roms = romsRaw.map(({ isFavorite, rom, top100Rank }) =>
    Object.assign(rom, { isFavorite: Boolean(isFavorite), top100Rank: top100Rank ?? null }),
  )

  const [{ total }] = await library
    .select({ total: count() })
    .from(romTable)
    .leftJoin(favoriteTable, favoriteJoinCondition)
    .where(favoriteWhere)

  return { pagination: { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }, roms }
}
