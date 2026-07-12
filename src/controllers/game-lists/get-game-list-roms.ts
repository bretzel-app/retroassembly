import { and, asc, count, desc, eq, isNotNull, sql } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { favoriteTable, gameListItemTable, romTable, statusEnum } from '#@/databases/schema.ts'

interface GetGameListRomsParams {
  direction?: 'asc' | 'desc'
  favorite?: boolean
  listId: string
  orderBy?: 'added' | 'list' | 'name' | 'released'
  page?: number
  pageSize?: number
}

export async function getGameListRoms({
  direction = 'asc',
  favorite = false,
  listId,
  orderBy = 'list',
  page = 1,
  pageSize = 100,
}: GetGameListRomsParams) {
  const { currentUser, db, effectiveLibraryUserId } = getContext().var
  const { library } = db

  const itemJoinCondition = and(
    eq(gameListItemTable.romId, romTable.id),
    eq(gameListItemTable.listId, listId),
    eq(gameListItemTable.userId, currentUser.id),
    eq(gameListItemTable.status, statusEnum.normal),
  )

  const favoriteJoinCondition = and(
    eq(favoriteTable.romId, romTable.id),
    eq(favoriteTable.userId, currentUser.id),
    eq(favoriteTable.status, statusEnum.normal),
  )

  const conditions = [eq(romTable.userId, effectiveLibraryUserId), eq(romTable.status, statusEnum.normal)]
  if (favorite) {
    conditions.push(isNotNull(favoriteTable.id))
  }
  const where = and(...conditions)

  const offset = (page - 1) * pageSize

  let columns: any[]
  if (orderBy === 'list') {
    columns = [asc(gameListItemTable.sortOrder), asc(gameListItemTable.createdAt), sql`LOWER(${romTable.fileName})`]
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

  const romsRaw = await library
    .select({
      isFavorite: sql<boolean>`CASE WHEN ${favoriteTable.id} IS NOT NULL THEN 1 ELSE 0 END`,
      rom: romTable,
    })
    .from(romTable)
    .innerJoin(gameListItemTable, itemJoinCondition)
    .leftJoin(favoriteTable, favoriteJoinCondition)
    .orderBy(...columns)
    .where(where)
    .offset(offset)
    .limit(pageSize)

  const roms = romsRaw.map(({ isFavorite, rom }) => Object.assign(rom, { isFavorite, top100Rank: null }))

  const [{ total }] = await library
    .select({ total: count() })
    .from(romTable)
    .innerJoin(gameListItemTable, itemJoinCondition)
    .leftJoin(favoriteTable, favoriteJoinCondition)
    .where(where)

  return { pagination: { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }, roms }
}
