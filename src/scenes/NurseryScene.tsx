import { useRef, useState } from 'react'
import { InteractiveObject } from '../components/InteractiveObject'
import { PipCharacter } from '../components/PipCharacter'
import { DreamDeliveryMap } from '../components/DreamDeliveryMap'
import { StorybookModal } from '../components/StorybookModal'
import { DreamCatcherModal } from '../components/DreamCatcherModal'
import type { PipState } from '../data/story'
import { portfolioProjects } from '../data/portfolio'

interface NurserySceneProps {
  activated: Set<string>
  pipState: PipState
  onActivate: (objectId: string) => void
  onPipClick: () => void
  onMoonEasterEgg: () => void
  isLullabyPlaying: boolean
  onToggleLullaby: () => void
  onCatchDream?: () => void
}

export function NurseryScene({
  activated,
  pipState,
  onActivate,
  onPipClick,
  onMoonEasterEgg,
  isLullabyPlaying,
  onToggleLullaby,
  onCatchDream,
}: NurserySceneProps) {
  const moonClicksRef = useRef<number[]>([])
  const [isDeliveryMapOpen, setIsDeliveryMapOpen] = useState(false)
  const [isStorybookOpen, setIsStorybookOpen] = useState(false)
  const storybookTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [isDreamCatcherOpen, setIsDreamCatcherOpen] = useState(false)
  const dreamCatcherTriggerRef = useRef<HTMLButtonElement | null>(null)

  const handleMoonClick = () => {
    const now = Date.now()
    const recent = moonClicksRef.current.filter((t) => now - t < 3500)
    recent.push(now)
    moonClicksRef.current = recent
    if (recent.length >= 5) {
      moonClicksRef.current = []
      onMoonEasterEgg()
    }
  }

  return (
    <section className="story-scene nursery-scene" id="nursery" data-story-scene aria-labelledby="nursery-title">
      <div className="nursery-scene__heading scene-copy">
        <p className="eyebrow">A room full of almost-secrets</p>
        <h2 id="nursery-title">Take your time.<br /><em>Look around.</em></h2>
        <p>Little things have a way of keeping little stories.</p>
      </div>
      <div className={`nursery-stage ${activated.has('lamp') ? 'is-lit' : ''} ${activated.has('window') ? 'window-awake' : ''} ${activated.has('tinyDoor') ? 'door-open' : ''}`}>
        <div className="nursery-stage__wallpaper" aria-hidden="true" />
        <div className="nursery-stage__floor" aria-hidden="true" />
        <div className="nursery-stage__moon" aria-hidden="true" />
        <InteractiveObject
          name="Moon window"
          hint="Look outside at the moon."
          activated={activated.has('window')}
          onActivate={() => {
            handleMoonClick()
            onActivate('window')
          }}
          className="room-object--window"
          asDiv
        >
          <span className="object-art object-art--window">
            <button
              type="button"
              className="object-art__moon"
              aria-label="Moon"
              onClick={(e) => {
                e.stopPropagation()
                handleMoonClick()
                onActivate('window')
              }}
            />
            <span className="object-art__star" aria-hidden="true" />
          </span>
        </InteractiveObject>
        <InteractiveObject name="Bedside lantern" hint="Turn on a little warmth." activated={activated.has('lamp')} onActivate={() => onActivate('lamp')} className="room-object--lamp">
          <picture>
            <source srcSet="/assets/pip_dream_lantern.webp" type="image/webp" />
            <img className="object-art__lantern" src="/assets/pip_dream_lantern.png" alt="" width={1024} height={914} loading="lazy" />
          </picture>
        </InteractiveObject>
        <InteractiveObject name="Story shelf" hint="Find the page that slipped loose." activated={activated.has('bookshelf')} onActivate={() => onActivate('bookshelf')} className="room-object--bookshelf">
          <span className="object-art object-art--bookshelf"><i /><i /><i /><span /><i /><i /><b className="object-art__page" /></span>
        </InteractiveObject>
        <InteractiveObject name="Lullaby box" hint="Turn the key on Pip's music box." activated={activated.has('musicBox')} onActivate={() => onActivate('musicBox')} className="room-object--musicbox">
          <picture>
            <source srcSet="/assets/pip_lullaby_box.webp" type="image/webp" />
            <img className="object-art__musicbox" src="/assets/pip_lullaby_box.png" alt="" width={1024} height={924} loading="lazy" />
          </picture>
        </InteractiveObject>
        <InteractiveObject name="A very small door" hint="Open the door to a tiny hidden room." activated={activated.has('tinyDoor')} onActivate={() => onActivate('tinyDoor')} className="room-object--door">
          <span className="object-art object-art--door">
            <span className="object-art__door-moon" /><span className="object-art__knob" />
            <span className="object-art__miniature" aria-hidden="true"><i /><b /></span>
          </span>
        </InteractiveObject>
        <InteractiveObject name="Sleepy lamb" hint="Check whether the little toy is dreaming." activated={activated.has('sleepyToy')} onActivate={() => onActivate('sleepyToy')} className="room-object--toy">
          <span className="object-art object-art--toy"><span className="object-art__lamb-face" /><span className="object-art__lamb-ear" /></span>
        </InteractiveObject>
        <InteractiveObject name="Floating star" hint="Tap the star and see where it drifts." activated={activated.has('floatingStar')} onActivate={() => onActivate('floatingStar')} className="room-object--star">
          <span className="object-art object-art--star" aria-hidden="true">✦</span>
        </InteractiveObject>
        <PipCharacter
          state={pipState}
          onClick={onPipClick}
          image="/assets/pip_portrait.png"
          imageAlt="Pip peeking out from a little cloud in the nursery."
          className="nursery-stage__pip"
          label="Ask Pip what it has found"
        />
        <span className="nursery-stage__doorway-glimpse" aria-live="polite">A very small room, still fast asleep.</span>
      </div>
      <section className="portfolio-showcase" aria-labelledby="portfolio-title">
        <div className="portfolio-showcase__intro">
          <p className="eyebrow">Selected bedtime commissions</p>
          <h3 id="portfolio-title">Work Pip <em>shows</em></h3>
          <p>Small projects for softer nights, made with a little moonlight and a lot of patience.</p>
        </div>
        <div className="portfolio-grid">
          {portfolioProjects.map((project) => (
            <article className={`portfolio-card portfolio-card--${project.accent}`} key={project.title}>
              <div className="portfolio-card__topline"><span>{project.number}</span><span>{project.category}</span></div>
              <div className="portfolio-card__symbol" aria-hidden="true">{project.symbol}</div>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {project.title === 'The Lullaby Lab' && (
                <button
                  type="button"
                  className={`lullaby-play-button ${isLullabyPlaying ? 'is-playing' : ''}`}
                  onClick={onToggleLullaby}
                  aria-pressed={isLullabyPlaying}
                  aria-label={isLullabyPlaying ? 'Stop the lullaby melody' : 'Play a music box lullaby from The Lullaby Lab'}
                >
                  <span className="lullaby-play-button__icon" aria-hidden="true">{isLullabyPlaying ? '■' : '▶'}</span>
                  <span>{isLullabyPlaying ? 'Stop lullaby' : 'Play lullaby'}</span>
                </button>
              )}
              {project.title === 'Dream Delivery Routes' && (
                <button
                  type="button"
                  className={`lullaby-play-button ${isDeliveryMapOpen ? 'is-playing' : ''}`}
                  onClick={() => setIsDeliveryMapOpen((prev) => !prev)}
                  aria-expanded={isDeliveryMapOpen}
                  aria-label={isDeliveryMapOpen ? 'Close the dream delivery flight map' : 'Open the interactive dream delivery flight map'}
                >
                  <span className="lullaby-play-button__icon" aria-hidden="true">{isDeliveryMapOpen ? '▲' : '🗺️'}</span>
                  <span>{isDeliveryMapOpen ? 'Close map' : 'Open map'}</span>
                </button>
              )}
              {project.title === 'Bedtime Storybook' && (
                <button
                  ref={storybookTriggerRef}
                  type="button"
                  className="lullaby-play-button"
                  onClick={() => setIsStorybookOpen(true)}
                  aria-haspopup="dialog"
                  aria-label="Read the interactive Bedtime Storybook"
                >
                  <span className="lullaby-play-button__icon" aria-hidden="true">📖</span>
                  <span>Read story</span>
                </button>
              )}
              {project.title === 'Dream Catcher' && (
                <button
                  ref={dreamCatcherTriggerRef}
                  type="button"
                  className="lullaby-play-button"
                  onClick={() => setIsDreamCatcherOpen(true)}
                  aria-haspopup="dialog"
                  aria-label="Play the Dream Catcher mini-game"
                >
                  <span className="lullaby-play-button__icon" aria-hidden="true">★</span>
                  <span>Play game</span>
                </button>
              )}
              <span className="portfolio-card__note">{project.note}</span>
            </article>
          ))}
        </div>
        {isDeliveryMapOpen && (
          <DreamDeliveryMap onClose={() => setIsDeliveryMapOpen(false)} />
        )}
        <StorybookModal
          isOpen={isStorybookOpen}
          onClose={() => setIsStorybookOpen(false)}
          returnFocusRef={storybookTriggerRef}
        />
        <DreamCatcherModal
          isOpen={isDreamCatcherOpen}
          onClose={() => setIsDreamCatcherOpen(false)}
          returnFocusRef={dreamCatcherTriggerRef}
          onCatch={onCatchDream}
        />
      </section>
    </section>
  )
}
