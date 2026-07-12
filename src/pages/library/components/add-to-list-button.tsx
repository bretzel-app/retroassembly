import { DropdownMenu } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { client, parseResponse } from '#@/api/client.ts'
import type { Rom } from '#@/controllers/roms/get-roms.ts'
import { GameListFormDialog } from '../game-lists/components/game-list-form-dialog.tsx'

interface AddToListButtonProps {
  rom: Rom
}

export function AddToListButton({ rom }: Readonly<AddToListButtonProps>) {
  const { t } = useTranslation()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const {
    data: gameLists,
    isLoading,
    mutate,
  } = useSWR({ endpoint: 'game_lists', romId: rom.id }, () =>
    parseResponse(client.game_lists.$get({ query: { rom_id: rom.id } })),
  )

  const isInSomeList = gameLists?.some(({ containsRom }) => containsRom)

  async function handleToggle(gameList: { containsRom: boolean; id: string }) {
    if (isToggling) {
      return
    }
    setIsToggling(true)
    try {
      await (gameList.containsRom
        ? client.game_lists[':listId'].roms[':romId'].$delete({ param: { listId: gameList.id, romId: rom.id } })
        : client.game_lists[':listId'].roms.$post({ json: { romId: rom.id }, param: { listId: gameList.id } }))
      await mutate()
    } finally {
      setIsToggling(false)
    }
  }

  async function handleCreated(gameList: { id: string }) {
    await client.game_lists[':listId'].roms.$post({ json: { romId: rom.id }, param: { listId: gameList.id } })
    await mutate()
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            aria-label={t('gameList.addToList')}
            className='flex rounded-full bg-(--color-background) p-1.5 ring-1 ring-(--gray-4) hover:bg-(--accent-3) hover:ring-(--accent-3)'
            title={t('gameList.addToList')}
            type='button'
          >
            <span
              className={clsx('text-lg text-(--accent-9)', {
                'icon-[mdi--playlist-check]': isInSomeList,
                'icon-[mdi--playlist-plus]': !isInSomeList,
              })}
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>{t('gameList.addToList')}</DropdownMenu.Label>
          {isLoading ? (
            <DropdownMenu.Item disabled>
              <span className='icon-[svg-spinners--180-ring]' />
            </DropdownMenu.Item>
          ) : null}
          {gameLists?.map((gameList) => (
            <DropdownMenu.CheckboxItem
              checked={gameList.containsRom}
              key={gameList.id}
              onCheckedChange={() => handleToggle(gameList)}
              onSelect={(event) => event.preventDefault()}
            >
              {gameList.name}
            </DropdownMenu.CheckboxItem>
          ))}
          {gameLists?.length ? <DropdownMenu.Separator /> : null}
          <DropdownMenu.Item onClick={() => setCreateDialogOpen(true)}>
            <span className='icon-[mdi--playlist-plus]' />
            {t('gameList.createList')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <GameListFormDialog onOpenChange={setCreateDialogOpen} onSuccess={handleCreated} open={createDialogOpen} />
    </>
  )
}
