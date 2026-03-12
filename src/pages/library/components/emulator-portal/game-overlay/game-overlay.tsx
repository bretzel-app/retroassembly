import { debounce } from 'es-toolkit'
import { useEffect } from 'react'
import { useGamepadMapping } from '#@/pages/library/hooks/use-gamepad-mapping.ts'
import { useKeyboardMapping } from '#@/pages/library/hooks/use-keyboard-mapping.ts'
import { getKeyNameFromCode } from '#@/pages/library/utils/keyboard.ts'
import { Gamepad } from '#@/utils/client/gamepad.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { GameOverlayContent } from './game-overlay-content.tsx'
import { GameOverlayController } from './game-overlay-controller.tsx'
import { GameOverlayVirtualGamepad } from './game-overlay-virtual-gamepad.tsx'

export function GameOverlay() {
  const keyboardMapping = useKeyboardMapping()
  const gamepadMapping = useGamepadMapping()
  const { toggle } = useGameOverlay()

  useEffect(() => {
    async function handleKeydown(event: KeyboardEvent) {
      if (getKeyNameFromCode(event.code) === keyboardMapping.$pause) {
        event.preventDefault()
        await toggle()
      }
    }
    document.body.addEventListener('keydown', handleKeydown)
    return () => document.body.removeEventListener('keydown', handleKeydown)
  }, [toggle, keyboardMapping.$pause])

  useEffect(
    () =>
      Gamepad.onPress(
        debounce(async (event) => {
          const pauseButtons = gamepadMapping.$pause?.split(',') ?? []
          if (pauseButtons.length === 0) {
            return
          }
          const { buttons } = event.gamepad
          const allPressed = pauseButtons.every((code) => buttons[Number(code)]?.pressed)
          if (allPressed) {
            await toggle()
          }
        }, 100),
      ),
    [gamepadMapping, toggle],
  )

  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden text-white *:pointer-events-auto *:absolute *:inset-0'>
      <GameOverlayController />
      <GameOverlayVirtualGamepad />
      <GameOverlayContent />
    </div>
  )
}
