import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { gameListItemTable, statusEnum } from '#@/databases/schema.ts'

export async function removeRomFromGameList({ listId, romId }: { listId: string; romId: string }) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const result = await library
    .update(gameListItemTable)
    .set({ status: statusEnum.deleted })
    .where(
      and(
        eq(gameListItemTable.listId, listId),
        eq(gameListItemTable.romId, romId),
        eq(gameListItemTable.userId, currentUser.id),
        eq(gameListItemTable.status, statusEnum.normal),
      ),
    )
    .returning()

  return result
}
