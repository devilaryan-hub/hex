export const objectStories: Record<string, { state: 'curious' | 'happy' | 'surprised' | 'sleepy'; message: string; soundId: 'lamp' | 'window' | 'bookshelf' | 'musicBox' | 'tinyDoor' | 'sleepyToy' | 'floatingStar' }> = {
  lamp: {
    state: 'happy',
    message: 'The little lamp warms the room. The shadows grow soft around the edges.',
    soundId: 'lamp',
  },
  window: {
    state: 'curious',
    message: 'Beyond the moon-shaped glass, one shy star comes out to look.',
    soundId: 'window',
  },
  bookshelf: {
    state: 'surprised',
    message: 'A page slips loose: it is a map of a place Pip has only visited in dreams.',
    soundId: 'bookshelf',
  },
  musicBox: {
    state: 'curious',
    message: 'The music box winds softly, playing a gentle bedtime lullaby.',
    soundId: 'musicBox',
  },
  tinyDoor: {
    state: 'surprised',
    message: 'Behind the tiny door, a smaller nursery is still fast asleep.',
    soundId: 'tinyDoor',
  },
  sleepyToy: {
    state: 'sleepy',
    message: 'The little lamb is already dreaming. Pip tries not to wake it.',
    soundId: 'sleepyToy',
  },
  floatingStar: {
    state: 'happy',
    message: 'The star drifts a little closer, then follows you with its warm light.',
    soundId: 'floatingStar',
  },
}

export const pipReactions = [
  { state: 'curious' as const, message: 'Pip looks up, as if it has been expecting you.' },
  { state: 'happy' as const, message: 'A tiny wave. Pip is glad you came by.' },
  { state: 'surprised' as const, message: 'Pip blinks twice, then remembers you.' },
]
