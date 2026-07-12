import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { gameListItemTable, gameListTable, statusEnum } from '#@/databases/schema.ts'

export async function deleteGameList(id: string) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const [result] = await library
    .update(gameListTable)
    .set({ status: statusEnum.deleted })
    .where(
      and(
        eq(gameListTable.id, id),
        eq(gameListTable.userId, currentUser.id),
        eq(gameListTable.status, statusEnum.normal),
      ),
    )
    .returning()

  if (result) {
    await library
      .update(gameListItemTable)
      .set({ status: statusEnum.deleted })
      .where(
        and(
          eq(gameListItemTable.listId, id),
          eq(gameListItemTable.userId, currentUser.id),
          eq(gameListItemTable.status, statusEnum.normal),
        ),
      )
  }

  return result
}
