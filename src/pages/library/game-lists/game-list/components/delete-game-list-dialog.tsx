import { AlertDialog, Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'
import { routes } from '#@/pages/routes.ts'

interface DeleteGameListDialogProps {
  gameList: { id: string; name: string }
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function DeleteGameListDialog({ gameList, onOpenChange, open }: Readonly<DeleteGameListDialogProps>) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'game_lists/:listId', method: 'delete', param: { listId: gameList.id } },
    () => client.game_lists[':listId'].$delete({ param: { listId: gameList.id } }),
  )

  async function handleClickConfirmDelete() {
    await trigger()
    onOpenChange(false)
    await navigate(generatePath(routes.libraryGameLists))
  }

  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>{t('gameList.deleteList')}</AlertDialog.Title>
        <AlertDialog.Description className='leading-loose! whitespace-pre-line' size='2'>
          {t('gameList.deleteListConfirm', { name: gameList.name })}
        </AlertDialog.Description>

        <div className='mt-4 flex justify-end gap-3'>
          <AlertDialog.Cancel>
            <Button disabled={isMutating}>
              <span className='icon-[mdi--close]' />
              {t('common.cancel')}
            </Button>
          </AlertDialog.Cancel>
          <Button loading={isMutating} onClick={handleClickConfirmDelete} variant='soft'>
            <span className='icon-[mdi--delete]' />
            {t('common.delete')}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
