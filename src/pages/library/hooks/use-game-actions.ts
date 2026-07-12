import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { libraryModeEnum } from '#@/databases/schema.ts'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'

export function useGameActions() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { currentUser } = useGlobalLoaderData()
  let pageType: 'gameList' | 'history' | 'library' = 'library'
  if (pathname === '/library/history') {
    pageType = 'history'
  } else if (pathname.startsWith('/library/lists/')) {
    pageType = 'gameList'
  }

  const isSharedLibrary = currentUser?.libraryMode === libraryModeEnum.shared

  const actionsMap = {
    gameList: [
      {
        confirmDescription: '',
        icon: 'icon-[mdi--playlist-remove]',
        name: 'removeFromList',
        text: t('gameList.removeFromList'),
        type: 'game_lists',
      },
      {
        confirmDescription: '',
        icon: 'icon-[mdi--checkbox-multiple-marked]',
        name: 'select',
        text: t('common.select'),
        type: '',
      },
      {
        color: 'red',
        confirmDescription: t('dialog.confirmDeleteRomsMessage'),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('game.deleteRom'),
        type: 'roms',
      },
    ],
    history: [
      {
        color: 'red',
        confirmDescription: t('dialog.confirmDeleteHistoryMessage'),
        icon: 'icon-[mdi--delete]',
        name: 'delete',
        text: t('game.deleteFromHistory'),
        type: 'launch_records',
      },
    ],
    library: isSharedLibrary
      ? []
      : [
          {
            confirmDescription: '',
            icon: 'icon-[mdi--checkbox-multiple-marked]',
            name: 'select',
            text: t('common.select'),
            type: '',
          },
          {
            color: 'red',
            confirmDescription: t('dialog.confirmDeleteRomsMessage'),
            icon: 'icon-[mdi--delete]',
            name: 'delete',
            text: t('game.deleteRom'),
            type: 'roms',
          },
        ],
  } as const

  const actions = actionsMap[pageType]
  return { actions, pageType }
}
