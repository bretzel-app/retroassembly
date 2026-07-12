import { useLoaderData } from 'react-router'
import type { loader } from '#@/pages/routes/library-game-list.tsx'

export function useGameList() {
  const { gameList } = useLoaderData<typeof loader>() ?? {}
  return gameList
}
