import { getContext } from 'hono/context-storage'
import { getGameLists } from '#@/controllers/game-lists/get-game-lists.ts'
import { getLibraryLoaderData } from '#@/utils/server/loader-data.ts'
import GameListsPage from '../library/game-lists/page.tsx'

export async function loader() {
  const { t } = getContext().var
  const gameLists = await getGameLists()
  return await getLibraryLoaderData({ gameLists, title: t('nav.lists') })
}

export default function LibraryGameListsRoute() {
  return <GameListsPage />
}
