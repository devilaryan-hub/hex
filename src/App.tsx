import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioControls } from './components/AudioControls'
import { SceneNavigation } from './components/SceneNavigation'
import { scenes, type SceneId } from './data/story'
import { objectStories, pipReactions } from './data/interactions'
import type { AudioNarrationId } from './data/audio'
import { useAudioManager } from './hooks/useAudioManager'
import { usePipState } from './hooks/usePipState'
import { useSceneNavigation } from './hooks/useSceneNavigation'
import { ArrivalScene } from './scenes/ArrivalScene'
import { DreamScene } from './scenes/DreamScene'
import { EndingScene } from './scenes/EndingScene'
import { MeetPipScene } from './scenes/MeetPipScene'
import { NurseryScene } from './scenes/NurseryScene'
import { SecretScene } from './scenes/SecretScene'
import { SparkleTrail } from './components/SparkleTrail'
import { lullabyPlayer } from './utils/lullabyAudio'
import { recordVisit, recordDiscoveredItem } from './utils/visitorMemory'

const sceneNarration: Partial<Record<SceneId, AudioNarrationId>> = {
  arrival: 'arrival',
  'meet-pip': 'meet-pip',
  dream: 'dream',
  ending: 'goodnight',
}

const DREAMS_STORAGE_KEY = 'pip-dreams-delivered-count'

function getInitialInteractionCount(): number {
  try {
    const saved = localStorage.getItem(DREAMS_STORAGE_KEY)
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && parsed >= 0) return parsed
    }
  } catch {
    // localStorage unavailable
  }
  return 0
}

export default function App() {
  const { activeScene, goToScene } = useSceneNavigation()
  const { pipState, react: reactPip, reset: resetPip } = usePipState()
  const [interactionCount, setInteractionCount] = useState<number>(getInitialInteractionCount)

  const incrementInteractionCount = useCallback(() => {
    setInteractionCount((prev) => {
      const next = prev + 1
      try {
        localStorage.setItem(DREAMS_STORAGE_KEY, String(next))
      } catch {
        // localStorage write error ignored
      }
      return next
    })
  }, [])
  const {
    muted,
    masterVolume,
    musicVolume,
    sfxVolume,
    narrationVolume,
    setMuted,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    setNarrationVolume,
    unlockAudio,
    unlocked,
    playAmbient,
    playInteraction,
    playPipReaction,
    playSpecial,
    playNarration,
    stopAll,
    hasAudioTracks,
  } = useAudioManager()
  const [activatedObjects, setActivatedObjects] = useState<Set<string>>(() => new Set())
  const [discoveredSecret, setDiscoveredSecret] = useState(false)
  const [storyWhisper, setStoryWhisper] = useState('')
  const [playedNarrations, setPlayedNarrations] = useState<Set<AudioNarrationId>>(() => new Set())
  const [isLullabyPlaying, setIsLullabyPlaying] = useState(false)

  const playLullaby = useCallback(() => {
    unlockAudio()
    setIsLullabyPlaying(true)
    lullabyPlayer.play({
      muted,
      masterVolume,
      volume: sfxVolume,
      onEnd: () => setIsLullabyPlaying(false),
    })
  }, [masterVolume, muted, sfxVolume, unlockAudio])

  const stopLullaby = useCallback(() => {
    lullabyPlayer.stop()
    setIsLullabyPlaying(false)
  }, [])

  const toggleLullaby = useCallback(() => {
    if (isLullabyPlaying) {
      stopLullaby()
    } else {
      playLullaby()
    }
  }, [isLullabyPlaying, playLullaby, stopLullaby])
  const pipReactionIndex = useRef(0)
  const lastInteractionAt = useRef(0)
  const skipNextNarration = useRef<AudioNarrationId | null>(null)
  const active = scenes.find((scene) => scene.id === activeScene) ?? scenes[0]
  const activeIndex = scenes.findIndex((scene) => scene.id === active.id)

  useEffect(() => {
    playAmbient(activeScene)
  }, [activeScene, muted, unlocked, playAmbient])

  useEffect(() => {
    const visit = recordVisit()
    if (visit.isReturnVisit && visit.greeting) {
      setStoryWhisper(visit.greeting)
    }
  }, [])

  useEffect(() => {
    const narrationId = sceneNarration[activeScene]
    if (!narrationId || muted || !unlocked || playedNarrations.has(narrationId)) return
    if (skipNextNarration.current === narrationId) {
      skipNextNarration.current = null
      return
    }
    const timer = window.setTimeout(() => {
      if (playNarration(narrationId)) {
        setPlayedNarrations((current) => new Set(current).add(narrationId))
        if (narrationId === 'goodnight') playSpecial('goodnightChime')
      }
    }, 420)
    return () => window.clearTimeout(timer)
  }, [activeScene, muted, playedNarrations, playNarration, playSpecial, unlocked])

  const navigateToScene = useCallback((sceneId: SceneId) => {
    setStoryWhisper('')
    goToScene(sceneId)
  }, [goToScene])

  const handlePipClick = useCallback(() => {
    unlockAudio()
    const now = Date.now()
    if (now - lastInteractionAt.current < 420) return
    lastInteractionAt.current = now
    incrementInteractionCount()
    const reaction = pipReactions[pipReactionIndex.current % pipReactions.length]
    const shouldPlayCue = pipReactionIndex.current % 3 === 0
    pipReactionIndex.current += 1
    reactPip(reaction.state)
    setStoryWhisper(reaction.message)
    if (shouldPlayCue) playPipReaction(reaction.state)
  }, [incrementInteractionCount, playPipReaction, reactPip, unlockAudio])

  const handleObjectActivate = useCallback((objectId: string) => {
    unlockAudio()
    const now = Date.now()
    if (now - lastInteractionAt.current < 420) return
    lastInteractionAt.current = now
    incrementInteractionCount()
    setActivatedObjects((previous) => new Set(previous).add(objectId))
    recordDiscoveredItem(objectId)
    const story = objectStories[objectId]
    if (!story) return
    reactPip(story.state)
    setStoryWhisper(story.message)
    if (objectId === 'musicBox') {
      playLullaby()
    } else {
      playInteraction(story.soundId)
    }
  }, [incrementInteractionCount, playInteraction, playLullaby, reactPip, unlockAudio])

  const handleMoonEasterEgg = useCallback(() => {
    unlockAudio()
    incrementInteractionCount()
    reactPip('happy', 3800)
    setStoryWhisper('The moon hums a quiet, hidden lullaby into the night.')
    playInteraction('musicBox')
  }, [incrementInteractionCount, playInteraction, reactPip, unlockAudio])

  const handleCatchDream = useCallback(() => {
    playInteraction('floatingStar')
  }, [playInteraction])

  const revealSecret = useCallback(() => {
    unlockAudio()
    setDiscoveredSecret(true)
    recordDiscoveredItem('secretStar')
    reactPip('happy', 3000)
    setStoryWhisper('Pip tucks the tiny star safely under its heart.')
    playSpecial('secretReveal')
    if (playNarration('secret')) setPlayedNarrations((current) => new Set(current).add('secret'))
  }, [playNarration, playSpecial, reactPip, unlockAudio])

  const enterNursery = useCallback(() => {
    unlockAudio()
    reactPip('curious', 2800)
    setStoryWhisper('A little face appears in the window. Someone noticed you.')
    if (playNarration('arrival')) setPlayedNarrations((current) => new Set(current).add('arrival'))
    skipNextNarration.current = 'meet-pip'
    goToScene('meet-pip')
  }, [goToScene, playNarration, reactPip, unlockAudio])

  const revisitNursery = useCallback(() => {
    unlockAudio()
    reactPip('curious')
    setStoryWhisper('The lamp is still warm. There is more to find.')
    goToScene('nursery')
  }, [goToScene, reactPip, unlockAudio])

  const replay = useCallback(() => {
    stopAll()
    stopLullaby()
    setActivatedObjects(new Set())
    setDiscoveredSecret(false)
    setStoryWhisper('')
    setPlayedNarrations(new Set())
    pipReactionIndex.current = 0
    lastInteractionAt.current = 0
    skipNextNarration.current = null
    resetPip()
    setMuted(true)
    goToScene('arrival')
  }, [goToScene, resetPip, setMuted, stopAll, stopLullaby])

  return (
    <div className="storybook-shell">
      <SparkleTrail />
      <a className="skip-link" href="#arrival">Skip to the story</a>
      <header className="site-header">
        <button className="site-mark" type="button" onClick={() => navigateToScene('arrival')} aria-label="Return to the beginning of Pip's story">
          <span className="site-mark__crescent" aria-hidden="true"><i /></span>
          <span className="site-mark__words"><strong>Pip</strong><span>The Midnight Nursery</span></span>
        </button>
        <p className="site-header__chapter"><span>Now turning</span> {String(activeIndex + 1).padStart(2, '0')} <i aria-hidden="true">/</i> 06 <b aria-hidden="true">·</b> {active.label}</p>
        <AudioControls
          muted={muted}
          setMuted={setMuted}
          masterVolume={masterVolume}
          setMasterVolume={setMasterVolume}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          narrationVolume={narrationVolume}
          setNarrationVolume={setNarrationVolume}
          hasAudioTracks={hasAudioTracks}
        />
      </header>

      <SceneNavigation activeScene={activeScene} onSelect={navigateToScene} />

      <main id="main-content">
        <ArrivalScene onEnter={enterNursery} />
        <MeetPipScene pipState={pipState} onPipClick={handlePipClick} />
        <NurseryScene
          activated={activatedObjects}
          pipState={pipState}
          onActivate={handleObjectActivate}
          onPipClick={handlePipClick}
          onMoonEasterEgg={handleMoonEasterEgg}
          isLullabyPlaying={isLullabyPlaying}
          onToggleLullaby={toggleLullaby}
          onCatchDream={handleCatchDream}
        />
        <DreamScene pipState={pipState} onPipClick={handlePipClick} />
        <SecretScene discovered={discoveredSecret} pipState={pipState} onPipClick={handlePipClick} onReveal={revealSecret} />
        <EndingScene pipState={pipState === 'idle' ? 'sleepy' : pipState} onPipClick={handlePipClick} onRevisit={revisitNursery} onReplay={replay} />
      </main>

      <div className="story-whisper story-whisper--global" aria-live="polite" role="status">{storyWhisper}</div>
      <aside className="retro-marquee" aria-label="Nursery bulletin">
        <div className="retro-marquee__track">
          <span>Welcome to Pip&apos;s Midnight Nursery! ✦ Please sign no one&apos;s dreams without permission ✦ Best viewed with sleepy eyes ✦ &nbsp;</span>
          <span>Welcome to Pip&apos;s Midnight Nursery! ✦ Please sign no one&apos;s dreams without permission ✦ Best viewed with sleepy eyes ✦ &nbsp;</span>
        </div>
      </aside>
      <footer className="site-footer">
        <div className="site-footer__main">
          <span>Made for the quiet hours.</span>
          <div className="retro-odometer" aria-label={`Dreams delivered: ${interactionCount}`}>
            <span className="retro-odometer__label">Dreams delivered:</span>
            <span className="retro-odometer__counter" aria-hidden="true">
              {String(interactionCount).padStart(5, '0').split('').map((digit, i) => (
                <span key={i} className="retro-odometer__digit">{digit}</span>
              ))}
            </span>
          </div>
          <span>Goodnight, for now.</span>
        </div>
        <div className="site-footer__credits">
          <p>Official art: haX.baby Pip Creator Asset Pack</p>
          <p>Audio generated with ElevenLabs</p>
          <p>Built with React, TypeScript and Vite</p>
          <p>Code written with AI coding tools (Claude and Antigravity)</p>
        </div>
      </footer>
    </div>
  )
}
