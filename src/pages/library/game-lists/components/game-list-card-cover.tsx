import type { GameListWithItems } from '#@/controllers/game-lists/get-game-lists.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'

interface GameListCardCoverProps {
  rom: GameListWithItems['previewRoms'][number]
}

export function GameListCardCover({ rom }: Readonly<GameListCardCoverProps>) {
  const { data: cover } = useRomCover({ ...rom, rawGameMetadata: null })

  return (
    <div className='flex size-full items-end justify-center overflow-hidden'>
      {cover?.src ? (
        <img
          alt={rom.fileName}
          className='max-h-full max-w-full rounded object-contain'
          loading='lazy'
          src={cover.src}
        />
      ) : null}
    </div>
  )
}
