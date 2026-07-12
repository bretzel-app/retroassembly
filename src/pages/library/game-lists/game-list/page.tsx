import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '#@/pages/routes/library-game-list.tsx'
import { GameListMain } from '../../components/game-list-main.tsx'
import LibraryLayout from '../../components/library-layout/library-layout.tsx'
import { PageStats } from '../../components/page-stats.tsx'
import { GameListMenu } from './components/game-list-menu.tsx'

export default function GameListPage() {
  const { t } = useTranslation()
  const { gameList, pagination, roms } = useLoaderData<typeof loader>()
  const gameLabel = t('common.game', { count: pagination.total })

  if (pagination.current > 1 && roms.length === 0) {
    return <>{t('error.notFoundCode')}</>
  }

  return (
    <LibraryLayout>
      <GameListMain>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-5xl font-semibold'>{gameList.name}</h1>
            <GameListMenu gameList={gameList} />
          </div>
          {gameList.description ? (
            <div className='max-w-2xl whitespace-pre-line text-(--gray-11)'>{gameList.description}</div>
          ) : null}
        </div>
        <PageStats>
          <span className='icon-[mdi--format-list-bulleted-square] text-(--color-text)' />
          <Trans
            components={{
              1: <span className='font-semibold text-(--accent-9)' />,
            }}
            i18nKey='stats.gameListGames'
            values={{
              game: gameLabel,
              gameCount: pagination.total,
            }}
          />
        </PageStats>
      </GameListMain>
    </LibraryLayout>
  )
}
