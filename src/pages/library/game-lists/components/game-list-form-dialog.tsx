import { Button, Dialog, Text, TextArea, TextField } from '@radix-ui/themes'
import type { SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'

interface GameListFormDialogProps {
  gameList?: { description: null | string; id: string; name: string }
  onOpenChange: (open: boolean) => void
  onSuccess?: (gameList: { id: string; name: string }) => Promise<void> | void
  open: boolean
}

export function GameListFormDialog({ gameList, onOpenChange, onSuccess, open }: Readonly<GameListFormDialogProps>) {
  const { t } = useTranslation()

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: gameList ? 'game_lists/:listId' : 'game_lists', method: gameList ? 'patch' : 'post' },
    async (_key, { arg }: { arg: { description: string; name: string } }) =>
      await parseResponse(
        gameList
          ? client.game_lists[':listId'].$patch({ json: arg, param: { listId: gameList.id } })
          : client.game_lists.$post({ json: arg }),
      ),
  )

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')?.toString().trim() || ''
    const description = formData.get('description')?.toString() || ''
    if (!name) {
      return
    }

    const result = await trigger({ description, name })
    onOpenChange(false)
    if (result) {
      await onSuccess?.(result)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!isMutating) {
      onOpenChange(nextOpen)
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>
          <div className='flex items-center gap-2'>
            <span className={gameList ? 'icon-[mdi--playlist-edit]' : 'icon-[mdi--playlist-plus]'} />
            {gameList ? t('gameList.editList') : t('gameList.createList')}
          </div>
        </Dialog.Title>
        <Dialog.Description size='2'>{t('gameList.formDescription')}</Dialog.Description>
        <form onSubmit={handleSubmit}>
          <div className='my-4 flex flex-col gap-4'>
            <label className='flex flex-col gap-1'>
              <Text size='2' weight='medium'>
                {t('gameList.listName')}
              </Text>
              <TextField.Root
                autoFocus
                defaultValue={gameList?.name}
                maxLength={100}
                name='name'
                placeholder={t('gameList.listNamePlaceholder')}
                required
              />
            </label>
            <label className='flex flex-col gap-1'>
              <Text size='2' weight='medium'>
                {t('common.description')} {t('common.optional')}
              </Text>
              <TextArea defaultValue={gameList?.description ?? ''} maxLength={4000} name='description' />
            </label>
          </div>
          <div className='flex justify-end gap-3'>
            <Dialog.Close>
              <Button disabled={isMutating} variant='soft'>
                <span className='icon-[mdi--close]' />
                {t('common.cancel')}
              </Button>
            </Dialog.Close>
            <Button loading={isMutating} type='submit'>
              <span className='icon-[mdi--check]' />
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
