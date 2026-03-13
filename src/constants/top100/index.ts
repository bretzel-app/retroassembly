import type { PlatformName } from '#@/constants/platform.ts'
import data from './data.json'

export interface Top100Entry {
  name: string
  originalName: string
  rank: number
}

export const top100Data: Partial<Record<PlatformName, Top100Entry[]>> = data
