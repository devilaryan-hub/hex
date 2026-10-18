import { useEffect, useRef, useState } from 'react'
import { PipCharacter } from '../components/PipCharacter'
import { StarField } from '../components/StarField'
import type { PipState } from '../data/story'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface DreamSceneProps {
  pipState: PipState
  onPipClick: () => void
}

export function DreamScene({ pipState, onPipClick }: DreamSceneProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const nightlightRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(false)

  // Nightlight cursor tracking
  useEffect(() => {
    const scene = sceneRef.current
    const nightlight = nightlightRef.current
    if (!scene || !nightlight) return

    if (reducedMotion) {
      nightlight.style.removeProperty('--nightlight-x')
      nightlight.style.removeProperty('--nightlight-y')
      return
    }

    let moveRaf = 0
    let driftRaf = 0
    let targetX = scene.clientWidth / 2
    let targetY = scene.clientHeight / 2
    let isTouch = false
    let lastTouchTime = 0

    // Set initial position at center
    nightlight.style.setProperty('--nightlight-x', `${targetX}px`)
    nightlight.style.setProperty('--nightlight-y', `${targetY}px`)

    const updateNightlight = () => {
      nightlight.style.setProperty('--nightlight-x', `${targetX}px`)
      nightlight.style.setProperty('--nightlight-y', `${targetY}px`)
      moveRaf = 0
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = scene.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top

      if (e.pointerType === 'touch') {
        isTouch = true
        lastTouchTime = performance.now()
      }

      if (!moveRaf) {
        moveRaf = requestAnimationFrame(updateNightlight)
      }
    }

    // Touch idle drift
    const startDrift = () => {
      const now = performance.now()
      if (isTouch && now - lastTouchTime > 1200) {
        const cx = scene.clientWidth / 2
        const cy = scene.clientHeight / 2
        const driftX = cx + Math.sin(now * 0.0008) * (scene.clientWidth * 0.28)
        const driftY = cy + Math.cos(now * 0.0006) * (scene.clientHeight * 0.22)
        nightlight.style.setProperty('--nightlight-x', `${driftX}px`)
        nightlight.style.setProperty('--nightlight-y', `${driftY}px`)
      }
      driftRaf = requestAnimationFrame(startDrift)
    }

    scene.addEventListener('pointermove', handlePointerMove, { passive: true })
    driftRaf = requestAnimationFrame(startDrift)

    return () => {
      scene.removeEventListener('pointermove', handlePointerMove)
      if (moveRaf) cancelAnimationFrame(moveRaf)
      if (driftRaf) cancelAnimationFrame(driftRaf)
    }
  }, [reducedMotion])

  // Parallax and entrance reveal
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const layers = Array.from(scene.querySelectorAll<HTMLElement>('[data-parallax]'))
    const motionScale = window.matchMedia('(max-width: 760px)').matches ? 0.45 : 1
    let inView = false
    let frame = 0

    const update = () => {
      if (!inView || frame) return
      frame = window.requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect()
        const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / Math.max(window.innerHeight, rect.height)
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.parallax || 0)
          layer.style.setProperty('--parallax-y', `${progress * depth * 90 * motionScale}px`)
        })
        frame = 0
      })
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) {
        setRevealed(true)
        update()
      }
    }, { rootMargin: '10% 0px' })
    observer.observe(scene)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  return (
    <section className={`story-scene dream-scene${revealed ? ' is-revealed' : ''}`} id="dream" data-story-scene aria-labelledby="dream-title" ref={sceneRef}>
      <StarField className="dream-scene__stars" />

      {/* Nightlight reveal overlay */}
      <div className="dream-nightlight-layer" ref={nightlightRef} aria-hidden="true">
        <span className="dream-secret-whisper whisper-1">a dream was here</span>
        <span className="dream-secret-whisper whisper-2">tucked into starlight</span>
        <span className="dream-secret-whisper whisper-3">listen softly</span>
        <span className="dream-secret-creature creature-moth">ʚïɞ</span>
        <span className="dream-secret-creature creature-bunny">₍ᐢ. .ᐢ₎</span>
        <span className="dream-secret-creature creature-firefly">✦</span>
        <span className="dream-secret-star star-1">✧</span>
        <span className="dream-secret-star star-2">★</span>
        <span className="dream-secret-star star-3">✦</span>
      </div>

      <div className="dream-scene__landscape" aria-hidden="true">
        <span className="dream-scene__moon" data-parallax="0.25" />
        <span className="dream-scene__island dream-scene__island--far" data-parallax="0.12" />
        <span className="dream-scene__island dream-scene__island--near" data-parallax="0.34" />
        <span className="dream-scene__flower dream-scene__flower--one" data-parallax="0.42"><i /><i /><i /><i /><b /></span>
        <span className="dream-scene__flower dream-scene__flower--two" data-parallax="0.18"><i /><i /><i /><i /><b /></span>
        <span className="dream-scene__path" data-parallax="0.5" />
      </div>
      <div className="dream-scene__copy scene-copy">
        <p className="eyebrow">A dream, held very gently</p>
        <h2 id="dream-title">The room lets go.<br /><em>The moon stays.</em></h2>
        <p>One quiet piece at a time, the nursery floats into a place Pip has only seen with its eyes closed.</p>
        <p className="dream-scene__verse">A little cloud for a pillow.<br />A little moon for the road home.</p>
      </div>
      <figure className="dream-scene__figure">
        <PipCharacter
          state={pipState === 'idle' ? 'dreaming' : pipState}
          onClick={onPipClick}
          image="/assets/pip_avatar_cloud.png"
          imageAlt="Pip asleep on a soft cloud, surrounded by small stars and a sleepy crescent moon."
          className="dream-scene__pip"
          label="Gently wake Pip in the dream"
        />
        <figcaption>Somewhere soft to land</figcaption>
      </figure>
      <p className="scene-caption">04 <span>—</span> A little dream</p>
    </section>
  )
}
