import { getContext } from 'hono/context-storage'
import { data } from 'react-router'
import { getGameListRoms } from '#@/controllers/game-lists/get-game-list-roms.ts'
import { getGameList } from '#@/controllers/game-lists/get-game-list.ts'
import { getLibraryLoaderData } from '#@/utils/server/loader-data.ts'
import { getRomsQuery } from '#@/utils/server/misc.ts'
import GameListPage from '../library/game-lists/game-list/page.tsx'
import type { Route } from './+types/library-game-list.ts'

export async function loader({ params }: Route.LoaderArgs) {
  const c = getContext()

  const gameList = params.listId ? await getGameList(params.listId) : undefined
  if (!gameList) {
    throw data(null, 404)
  }

  const { searchParams } = new URL(c.req.url)
  const sort = searchParams.get('sort')
  const orderBy = sort === 'added' || sort === 'name' || sort === 'released' ? sort : 'list'
  const { direction, favorite, page } = getRomsQuery()
  const { pagination, roms } = await getGameListRoms({
    direction,
    favorite,
    listId: gameList.id,
    orderBy,
    page,
  })

  return await getLibraryLoaderData({ gameList, pagination, roms, title: gameList.name })
}

export default function LibraryGameListRoute() {
  return <GameListPage />
}
