import { Button } from '@radix-ui/themes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import type { loader } from '#@/pages/routes/library-game-lists.tsx'
import LibraryLayout from '../components/library-layout/library-layout.tsx'
import { PageBreadcrumb } from '../components/page-breadcrumb.tsx'
import { PageStats } from '../components/page-stats.tsx'
import { useRouter } from '../hooks/use-router.ts'
import { GameListCard } from './components/game-list-card.tsx'
import { GameListFormDialog } from './components/game-list-form-dialog.tsx'

export default function GameListsPage() {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const { gameLists } = useLoaderData<typeof loader>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const listLabel = t('gameList.list', { count: gameLists.length })

  return (
    <LibraryLayout>
      <PageBreadcrumb />
      <div className='flex min-h-full w-full flex-col gap-5 p-4'>
        <div className='relative flex flex-col justify-between gap-4 pt-4 lg:flex-row lg:px-4'>
          <h1 className='text-5xl font-semibold'>{t('nav.lists')}</h1>
          <div className='flex flex-col justify-end gap-4'>
            <div className='flex justify-end'>
              <Button onClick={() => setCreateDialogOpen(true)} variant='soft'>
                <span className='icon-[mdi--playlist-plus]' />
                {t('gameList.createList')}
              </Button>
            </div>
            <PageStats>
              <span className='icon-[mdi--format-list-bulleted-square] text-(--color-text)' />
              <Trans
                components={{
                  1: <span className='font-semibold text-(--accent-9)' />,
                }}
                i18nKey='stats.totalGameLists'
                values={{
                  list: listLabel,
                  listCount: gameLists.length,
                }}
              />
            </PageStats>
          </div>
        </div>

        <div className='border border-transparent border-t-(--gray-6) pt-4'>
          {gameLists.length ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {gameLists.map((gameList) => (
                <GameListCard gameList={gameList} key={gameList.id} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-2 py-16 text-sm lg:text-xl'>
              <span className='icon-[mdi--format-list-bulleted-square] size-32 text-zinc-300' />
              <div className='text-(--gray-11)'>{t('empty.gameListsDescription')}</div>
            </div>
          )}
        </div>
      </div>
      <GameListFormDialog onOpenChange={setCreateDialogOpen} onSuccess={reload} open={createDialogOpen} />
    </LibraryLayout>
  )
}
