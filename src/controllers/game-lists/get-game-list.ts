import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { gameListTable, statusEnum } from '#@/databases/schema.ts'

export async function getGameList(id: string) {
  const { currentUser, db } = getContext().var
  const { library } = db

  const [gameList] = await library
    .select()
    .from(gameListTable)
    .where(
      and(
        eq(gameListTable.id, id),
        eq(gameListTable.userId, currentUser.id),
        eq(gameListTable.status, statusEnum.normal),
      ),
    )

  return gameList
}

export type GameList = NonNullable<Awaited<ReturnType<typeof getGameList>>>
