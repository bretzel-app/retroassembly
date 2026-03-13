import type { CoreOption } from './types.d.ts'

export const pcsxRearmedOptions: CoreOption[] = [
  {
    defaultOption: 'auto',
    name: 'pcsx_rearmed_region',
    options: ['auto', 'NTSC', 'PAL'],
    title: 'Region',
  },
  {
    defaultOption: 'disabled',
    name: 'pcsx_rearmed_frameskip',
    options: ['disabled', '1', '2', '3'],
    title: 'Frameskip',
  },
]
