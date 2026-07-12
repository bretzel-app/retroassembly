import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router'
import type { GameListWithItems } from '#@/controllers/game-lists/get-game-lists.ts'
import { routes } from '#@/pages/routes.ts'
import { NavigatableLink } from '../../components/navigatable-link.tsx'
import { GameListCardCover } from './game-list-card-cover.tsx'

interface GameListCardProps {
  gameList: Pick<GameListWithItems, 'description' | 'id' | 'itemCount' | 'name' | 'previewRoms'>
}

export function GameListCard({ gameList }: Readonly<GameListCardProps>) {
  const { t } = useTranslation()
  const gameLabel = t('common.game', { count: gameList.itemCount })

  return (
    <NavigatableLink
      className='flex flex-col gap-3 rounded-lg border border-(--gray-4) p-4 transition-colors hover:border-(--accent-7) hover:bg-(--accent-2)'
      to={generatePath(routes.libraryGameList, { listId: gameList.id })}
    >
      <div className='grid aspect-2/1 grid-cols-4 items-end gap-2'>
        {gameList.previewRoms.length ? (
          gameList.previewRoms.map((rom) => <GameListCardCover key={rom.id} rom={rom} />)
        ) : (
          <div className='col-span-4 flex size-full items-center justify-center'>
            <span className='icon-[mdi--format-list-bulleted-square] size-16 text-(--gray-6)' />
          </div>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <div className='truncate text-lg font-semibold'>{gameList.name}</div>
        {gameList.description ? (
          <div className='line-clamp-2 text-sm text-(--gray-11)'>{gameList.description}</div>
        ) : null}
        <div className='text-sm text-(--gray-11)'>
          {gameList.itemCount} {gameLabel}
        </div>
      </div>
    </NavigatableLink>
  )
}
