import { and, eq, max } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { gameListItemTable, statusEnum } from '#@/databases/schema.ts'
import { getGameList } from './get-game-list.ts'

export async function addRomToGameList({ listId, romId }: { listId: string; romId: string }) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const gameList = await getGameList(listId)
  if (!gameList) {
    throw new HTTPException(404, { message: 'List not found' })
  }

  const [existing] = await library
    .select()
    .from(gameListItemTable)
    .where(
      and(
        eq(gameListItemTable.listId, listId),
        eq(gameListItemTable.romId, romId),
        eq(gameListItemTable.userId, currentUser.id),
      ),
    )

  if (existing && existing.status === statusEnum.normal) {
    return existing
  }

  const [{ maxSortOrder }] = await library
    .select({ maxSortOrder: max(gameListItemTable.sortOrder) })
    .from(gameListItemTable)
    .where(and(eq(gameListItemTable.listId, listId), eq(gameListItemTable.status, statusEnum.normal)))
  const sortOrder = (maxSortOrder ?? 0) + 1

  if (existing) {
    const [result] = await library
      .update(gameListItemTable)
      .set({ sortOrder, status: statusEnum.normal })
      .where(eq(gameListItemTable.id, existing.id))
      .returning()
    return result
  }

  const [result] = await library
    .insert(gameListItemTable)
    .values({
      listId,
      romId,
      sortOrder,
      userId: currentUser.id,
    })
    .returning()

  return result
}
