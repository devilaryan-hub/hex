import { useCallback, useEffect, useRef, useState } from 'react'
import { audioFiles, type AudioNarrationId, type AudioPipReactionId, type AudioSfxId } from '../data/audio'
import type { SceneId } from '../data/story'

type AudioPreferences = {
  muted: boolean
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  narrationVolume: number
}

type AmbientPlayer = {
  sceneId: SceneId
  element: HTMLAudioElement
}

const STORAGE_KEY = 'pip-audio-preferences-v2'
const DEFAULT_PREFERENCES: AudioPreferences = {
  muted: false,
  masterVolume: 0.78,
  musicVolume: 0.72,
  sfxVolume: 0.78,
  narrationVolume: 0.86,
}

function readPreferences(): AudioPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<AudioPreferences>
    return { ...DEFAULT_PREFERENCES, ...stored, muted: stored.muted ?? DEFAULT_PREFERENCES.muted }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

export const hasAudioTracks = true

export function useAudioManager() {
  const [preferences, setPreferences] = useState<AudioPreferences>(readPreferences)
  const [unlocked, setUnlocked] = useState(false)
  const preferencesRef = useRef(preferences)
  const unlockedRef = useRef(unlocked)
  const ambientRef = useRef<AmbientPlayer | null>(null)
  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const sfxPlayers = useRef(new Map<string, HTMLAudioElement>())
  const fadeTimers = useRef(new Set<number>())

  useEffect(() => {
    preferencesRef.current = preferences
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // Storage can be unavailable in private browsing; playback still works.
    }
  }, [preferences])

  useEffect(() => {
    unlockedRef.current = unlocked
  }, [unlocked])

  const effectiveVolume = useCallback((kind: 'music' | 'sfx' | 'narration') => {
    const current = preferencesRef.current
    const category = kind === 'music' ? current.musicVolume : kind === 'sfx' ? current.sfxVolume : current.narrationVolume
    return current.masterVolume * category
  }, [])

  const clearFades = useCallback(() => {
    fadeTimers.current.forEach((timer) => window.clearInterval(timer))
    fadeTimers.current.clear()
  }, [])

  const fade = useCallback((player: HTMLAudioElement, target: number, duration: number, onDone?: () => void) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || duration <= 0) {
      player.volume = target
      onDone?.()
      return
    }
    const startedAt = performance.now()
    const initial = player.volume
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration)
      player.volume = initial + (target - initial) * progress
      if (progress >= 1) {
        window.clearInterval(timer)
        fadeTimers.current.delete(timer)
        onDone?.()
      }
    }, 40)
    fadeTimers.current.add(timer)
  }, [])

  const unlockAudio = useCallback(() => {
    unlockedRef.current = true
    setUnlocked(true)
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    if (!muted) unlockAudio()
    setPreferences((current) => ({ ...current, muted }))
    if (muted) {
      ambientRef.current?.element.pause()
      narrationRef.current?.pause()
      sfxPlayers.current.forEach((player) => player.pause())
    }
  }, [unlockAudio])

  const setMasterVolume = useCallback((value: number) => setPreferences((current) => ({ ...current, masterVolume: clamp(value) })), [])
  const setMusicVolume = useCallback((value: number) => setPreferences((current) => ({ ...current, musicVolume: clamp(value) })), [])
  const setSfxVolume = useCallback((value: number) => setPreferences((current) => ({ ...current, sfxVolume: clamp(value) })), [])
  const setNarrationVolume = useCallback((value: number) => setPreferences((current) => ({ ...current, narrationVolume: clamp(value) })), [])

  const playAmbient = useCallback((sceneId: SceneId) => {
    const source = audioFiles.ambient[sceneId]
    if (!source || preferencesRef.current.muted || !unlockedRef.current) return false
    const current = ambientRef.current
    if (current?.sceneId === sceneId) {
      current.element.volume = effectiveVolume('music')
      void current.element.play().catch(() => undefined)
      return true
    }

    const next = new Audio(source)
    next.loop = true
    next.preload = 'none'
    next.volume = 0
    ambientRef.current = { sceneId, element: next }
    void next.play().catch(() => undefined)
    fade(next, effectiveVolume('music'), 1050)

    if (current) {
      const previous = current.element
      fade(previous, 0, 1050, () => {
        previous.pause()
        previous.removeAttribute('src')
        previous.load()
      })
    }
    return true
  }, [effectiveVolume, fade])

  const stopAmbient = useCallback(() => {
    const current = ambientRef.current
    if (!current) return
    fade(current.element, 0, 450, () => {
      current.element.pause()
      current.element.removeAttribute('src')
      current.element.load()
    })
    ambientRef.current = null
  }, [fade])

  const playOneShot = useCallback((source: string, key: string, kind: 'sfx' | 'narration') => {
    if (!source || preferencesRef.current.muted || !unlockedRef.current) return false
    if (kind === 'narration') {
      narrationRef.current?.pause()
      const player = new Audio(source)
      player.preload = 'none'
      player.volume = effectiveVolume('narration')
      narrationRef.current = player
      player.addEventListener('ended', () => {
        if (narrationRef.current === player) narrationRef.current = null
      }, { once: true })
      void player.play().catch(() => undefined)
      return true
    }

    const existing = sfxPlayers.current.get(key)
    const player = existing ?? new Audio(source)
    player.preload = 'none'
    player.currentTime = 0
    player.volume = effectiveVolume('sfx')
    sfxPlayers.current.set(key, player)
    void player.play().catch(() => undefined)
    return true
  }, [effectiveVolume])

  const playInteraction = useCallback((soundId: AudioSfxId) => playOneShot(audioFiles.sfx[soundId], `sfx:${soundId}`, 'sfx'), [playOneShot])
  const playPipReaction = useCallback((reactionId: AudioPipReactionId) => playOneShot(audioFiles.pip[reactionId], `pip:${reactionId}`, 'sfx'), [playOneShot])
  const playSpecial = useCallback((soundId: keyof typeof audioFiles.special) => playOneShot(audioFiles.special[soundId], `special:${soundId}`, 'sfx'), [playOneShot])
  const playNarration = useCallback((narrationId: AudioNarrationId) => playOneShot(audioFiles.narration[narrationId], `narration:${narrationId}`, 'narration'), [playOneShot])

  const stopAll = useCallback(() => {
    stopAmbient()
    narrationRef.current?.pause()
    narrationRef.current = null
    sfxPlayers.current.forEach((player) => player.pause())
    clearFades()
  }, [clearFades, stopAmbient])

  useEffect(() => {
    const current = ambientRef.current
    if (current && !preferences.muted) current.element.volume = effectiveVolume('music')
    if (narrationRef.current) narrationRef.current.volume = effectiveVolume('narration')
    sfxPlayers.current.forEach((player) => { player.volume = effectiveVolume('sfx') })
  }, [effectiveVolume, preferences.masterVolume, preferences.musicVolume, preferences.narrationVolume, preferences.sfxVolume])

  useEffect(() => () => {
    clearFades()
    ambientRef.current?.element.pause()
    narrationRef.current?.pause()
    sfxPlayers.current.forEach((player) => {
      player.pause()
      player.removeAttribute('src')
      player.load()
    })
    ambientRef.current = null
    narrationRef.current = null
    sfxPlayers.current.clear()
  }, [clearFades])

  return {
    ...preferences,
    volume: preferences.masterVolume,
    setMuted,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    setNarrationVolume,
    unlockAudio,
    unlocked,
    playAmbient,
    stopAmbient,
    crossfadeAmbient: playAmbient,
    playInteraction,
    playPipReaction,
    playSpecial,
    playNarration,
    stopAll,
    hasAudioTracks,
  }
}
