import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { gameListTable, statusEnum } from '#@/databases/schema.ts'

export async function updateGameList(id: string, { description, name }: { description?: string; name?: string }) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const [result] = await library
    .update(gameListTable)
    .set({
      ...(description === undefined ? {} : { description: description || null }),
      ...(name === undefined ? {} : { name }),
    })
    .where(
      and(
        eq(gameListTable.id, id),
        eq(gameListTable.userId, currentUser.id),
        eq(gameListTable.status, statusEnum.normal),
      ),
    )
    .returning()

  return result
}
