import { getContext } from 'hono/context-storage'
import { gameListTable } from '#@/databases/schema.ts'

export async function createGameList({ description, name }: { description?: string; name: string }) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const [result] = await library
    .insert(gameListTable)
    .values({
      description: description || null,
      name,
      userId: currentUser.id,
    })
    .returning()

  return result
}
