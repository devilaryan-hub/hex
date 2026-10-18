import type { PipState, SceneId } from './story'

export const audioFiles = {
  ambient: {
    arrival: '/audio/ambient/arrival.mp3',
    'meet-pip': '/audio/ambient/meet-pip.mp3',
    nursery: '/audio/ambient/nursery.mp3',
    dream: '/audio/ambient/dream.mp3',
    secret: '/audio/ambient/secret.mp3',
    ending: '/audio/ambient/ending.mp3',
  } satisfies Record<SceneId, string>,
  sfx: {
    lamp: '/audio/sfx/lamp.mp3',
    window: '/audio/sfx/window.mp3',
    bookshelf: '/audio/sfx/bookshelf.mp3',
    musicBox: '/audio/sfx/musicbox.mp3',
    tinyDoor: '/audio/sfx/tiny-door.mp3',
    sleepyToy: '/audio/sfx/sleepy-toy.mp3',
    floatingStar: '/audio/sfx/star.mp3',
  },
  pip: {
    curious: '/audio/pip/curious.mp3',
    happy: '/audio/pip/happy.mp3',
    surprised: '/audio/pip/surprised.mp3',
    sleepy: '/audio/pip/sleepy.mp3',
    dreaming: '/audio/pip/dreaming.mp3',
    greeting: '/audio/pip/greeting.mp3',
  } satisfies Record<Exclude<PipState, 'idle'>, string> & { greeting: string },
  narration: {
    arrival: '/audio/narration/arrival.mp3',
    'meet-pip': '/audio/narration/meet-pip.mp3',
    dream: '/audio/narration/dream.mp3',
    secret: '/audio/narration/secret.mp3',
    goodnight: '/audio/narration/goodnight.mp3',
  },
  special: {
    secretReveal: '/audio/sfx/star.mp3',
    goodnightChime: '/audio/sfx/star.mp3',
  },
} as const

export type AudioNarrationId = keyof typeof audioFiles.narration
export type AudioPipReactionId = keyof typeof audioFiles.pip
export type AudioSfxId = keyof typeof audioFiles.sfx
