import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from '../../../hooks/use-router.ts'
import { GameListFormDialog } from '../../components/game-list-form-dialog.tsx'
import { DeleteGameListDialog } from './delete-game-list-dialog.tsx'

interface GameListMenuProps {
  gameList: { description: null | string; id: string; name: string }
}

export function GameListMenu({ gameList }: Readonly<GameListMenuProps>) {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton aria-label={t('common.options')} title={t('common.options')} variant='ghost'>
            <span className='icon-[mdi--more-vert] text-lg' />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => setEditDialogOpen(true)}>
            <span className='icon-[mdi--playlist-edit]' />
            {t('gameList.editList')}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color='red' onClick={() => setDeleteDialogOpen(true)}>
            <span className='icon-[mdi--delete]' />
            {t('gameList.deleteList')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <GameListFormDialog
        gameList={gameList}
        onOpenChange={setEditDialogOpen}
        onSuccess={reload}
        open={editDialogOpen}
      />
      <DeleteGameListDialog gameList={gameList} onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} />
    </>
  )
}
