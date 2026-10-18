export const scenes = [
  { id: 'arrival', label: 'The arrival', shortLabel: 'Arrival' },
  { id: 'meet-pip', label: 'Meet Pip', shortLabel: 'Meet Pip' },
  { id: 'nursery', label: 'The nursery', shortLabel: 'Nursery' },
  { id: 'dream', label: 'A little dream', shortLabel: 'Dream' },
  { id: 'secret', label: 'The secret', shortLabel: 'The secret' },
  { id: 'ending', label: 'Goodnight', shortLabel: 'Goodnight' },
] as const

export type SceneId = (typeof scenes)[number]['id']
export type PipState = 'idle' | 'curious' | 'happy' | 'surprised' | 'sleepy' | 'dreaming'
