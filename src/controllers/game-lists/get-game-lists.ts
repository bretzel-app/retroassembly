import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { gameListItemTable, gameListTable, romTable, statusEnum } from '#@/databases/schema.ts'

type GetGameListsReturning = Awaited<ReturnType<typeof getGameLists>>
export type GameListWithItems = GetGameListsReturning[number]

export async function getGameLists({ romId }: { romId?: string } = {}) {
  const { currentUser, db, effectiveLibraryUserId } = getContext().var
  const { library } = db

  const gameLists = await library
    .select()
    .from(gameListTable)
    .where(and(eq(gameListTable.userId, currentUser.id), eq(gameListTable.status, statusEnum.normal)))
    .orderBy(desc(gameListTable.createdAt))

  if (gameLists.length === 0) {
    return []
  }

  const listIds = gameLists.map(({ id }) => id)
  const items = await library
    .select({
      listId: gameListItemTable.listId,
      rom: {
        fileName: romTable.fileName,
        gameBoxartFileIds: romTable.gameBoxartFileIds,
        id: romTable.id,
        platform: romTable.platform,
      },
    })
    .from(gameListItemTable)
    .innerJoin(
      romTable,
      and(
        eq(romTable.id, gameListItemTable.romId),
        eq(romTable.userId, effectiveLibraryUserId),
        eq(romTable.status, statusEnum.normal),
      ),
    )
    .where(and(inArray(gameListItemTable.listId, listIds), eq(gameListItemTable.status, statusEnum.normal)))
    .orderBy(asc(gameListItemTable.sortOrder), asc(gameListItemTable.createdAt))

  return gameLists.map((gameList) => {
    const listItems = items.filter((item) => item.listId === gameList.id)
    return {
      ...gameList,
      containsRom: romId ? listItems.some((item) => item.rom.id === romId) : false,
      itemCount: listItems.length,
      previewRoms: listItems.slice(0, 4).map((item) => item.rom),
    }
  })
}
