import { useTranslation } from 'react-i18next'
import type { Rom } from '#@/controllers/roms/get-roms.ts'

interface DownloadButtonProps {
  rom: Rom
}

export function DownloadButton({ rom }: Readonly<DownloadButtonProps>) {
  const { t } = useTranslation()

  return (
    <a
      aria-label={t('game.download')}
      className='flex rounded-full bg-(--color-background) p-1.5 ring-1 ring-(--gray-4) hover:bg-(--accent-3) hover:ring-(--accent-3)'
      download
      href={`/api/v1/roms/${rom.id}/content?download=1`}
      title={t('game.download')}
    >
      <span className='icon-[mdi--download] text-lg text-(--accent-9)' />
    </a>
  )
}
