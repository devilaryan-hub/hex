import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface DreamCatcherModalProps {
  isOpen: boolean
  onClose: () => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
  onCatch?: () => void
}

interface FallingDream {
  id: number
  x: number
  y: number
  speed: number
  radius: number
  type: 'star' | 'moon' | 'cloud'
  points: number
  hue: string
}

const STORAGE_KEY_BEST = 'pip_dream_catcher_best'

function getSavedBestScore(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BEST)
    return raw ? parseInt(raw, 10) || 0 : 0
  } catch {
    return 0
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_BEST, String(score))
  } catch {
    // ignore in private mode
  }
}

export function DreamCatcherModal({
  isOpen,
  onClose,
  returnFocusRef,
  onCatch,
}: DreamCatcherModalProps) {
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing')
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(getSavedBestScore)
  const [timeLeft, setTimeLeft] = useState(30)
  const reducedMotion = useReducedMotion()

  const modalRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const basketXRef = useRef(180) // 0 to 360
  const itemsRef = useRef<FallingDream[]>([])
  const nextItemIdRef = useRef(1)
  const animFrameRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const onCatchRef = useRef(onCatch)
  onCatchRef.current = onCatch

  // Reset or start a new game
  const startGame = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(30)
    basketXRef.current = 180
    itemsRef.current = []
    isPausedRef.current = false
  }, [])

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (modal) {
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      // Left / Right keys for moving basket
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        basketXRef.current = Math.max(35, basketXRef.current - 24)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        basketXRef.current = Math.min(325, basketXRef.current + 24)
        return
      }

      // Focus trap
      if (e.key === 'Tab' && modal) {
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose, returnFocusRef])

  // Handle visibility change (pause when tab hidden)
  useEffect(() => {
    const handleVisibility = () => {
      isPausedRef.current = document.visibilityState === 'hidden'
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return

    const timer = setInterval(() => {
      if (isPausedRef.current) return

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState('gameover')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, gameState])

  // Update best score on gameover
  useEffect(() => {
    if (gameState === 'gameover') {
      setBestScore((prevBest) => {
        if (score > prevBest) {
          saveBestScore(score)
          return score
        }
        return prevBest
      })
    }
  }, [gameState, score])

  // Game loop (requestAnimationFrame)
  useEffect(() => {
    if (!isOpen) return

    let lastSpawn = performance.now()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 360
    const H = 400
    const BASKET_Y = 360
    const BASKET_WIDTH = 70
    const BASKET_HEIGHT = 20

    const speedMultiplier = reducedMotion ? 0.45 : 1.0

    const render = (now: number) => {
      if (isPausedRef.current) {
        animFrameRef.current = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, W, H)

      // Draw starry night background inside canvas
      ctx.fillStyle = '#101426'
      ctx.fillRect(0, 0, W, H)

      // Background soft grid / stars
      ctx.fillStyle = 'rgba(165, 160, 200, 0.15)'
      ctx.fillRect(40, 50, 2, 2)
      ctx.fillRect(120, 90, 2, 2)
      ctx.fillRect(280, 40, 2, 2)
      ctx.fillRect(200, 160, 2, 2)
      ctx.fillRect(310, 210, 2, 2)
      ctx.fillRect(70, 280, 2, 2)

      if (gameState === 'playing') {
        // Spawn items (cap at 6 items on screen)
        if (itemsRef.current.length < 6 && now - lastSpawn > (reducedMotion ? 1200 : 700)) {
          lastSpawn = now
          const rand = Math.random()
          let type: 'star' | 'moon' | 'cloud' = 'star'
          let points = 10
          let hue = '#F2BD78'
          let radius = 10

          if (rand > 0.7) {
            type = 'moon'
            points = 20
            hue = '#FFF3DF'
            radius = 12
          } else if (rand > 0.45) {
            type = 'cloud'
            points = 15
            hue = '#A5A0C8'
            radius = 14
          }

          const baseSpeed = (1.6 + Math.random() * 1.4) * speedMultiplier

          itemsRef.current.push({
            id: nextItemIdRef.current++,
            x: 20 + Math.random() * (W - 40),
            y: -15,
            speed: baseSpeed,
            radius,
            type,
            points,
            hue,
          })
        }

        // Update items & check collisions
        const remaining: FallingDream[] = []
        const currentBasketX = basketXRef.current

        for (const item of itemsRef.current) {
          item.y += item.speed

          // Collision detection with basket
          const inYRange = item.y + item.radius >= BASKET_Y && item.y - item.radius <= BASKET_Y + BASKET_HEIGHT
          const inXRange = Math.abs(item.x - currentBasketX) <= BASKET_WIDTH / 2 + item.radius

          if (inYRange && inXRange) {
            // Caught!
            setScore((s) => s + item.points)
            onCatchRef.current?.()
            continue
          }

          // Off screen bottom
          if (item.y > H + 20) {
            continue
          }

          remaining.push(item)
        }
        itemsRef.current = remaining
      }

      // Draw falling items
      for (const item of itemsRef.current) {
        ctx.save()
        ctx.translate(item.x, item.y)

        if (item.type === 'star') {
          ctx.fillStyle = item.hue
          ctx.shadowColor = '#F2BD78'
          ctx.shadowBlur = 8
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const rot = (Math.PI / 5) * 2 * i - Math.PI / 2
            const outerX = Math.cos(rot) * item.radius
            const outerY = Math.sin(rot) * item.radius
            if (i === 0) ctx.moveTo(outerX, outerY)
            else ctx.lineTo(outerX, outerY)
            const innerRot = rot + Math.PI / 5
            ctx.lineTo(Math.cos(innerRot) * (item.radius * 0.45), Math.sin(innerRot) * (item.radius * 0.45))
          }
          ctx.closePath()
          ctx.fill()
        } else if (item.type === 'moon') {
          ctx.fillStyle = item.hue
          ctx.shadowColor = '#FFF3DF'
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2)
          ctx.fill()
          // Crescent shadow
          ctx.fillStyle = '#101426'
          ctx.beginPath()
          ctx.arc(item.radius * 0.35, -item.radius * 0.2, item.radius * 0.85, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Cloud
          ctx.fillStyle = item.hue
          ctx.shadowColor = '#A5A0C8'
          ctx.shadowBlur = 6
          ctx.beginPath()
          ctx.arc(-6, 2, 7, 0, Math.PI * 2)
          ctx.arc(3, -2, 9, 0, Math.PI * 2)
          ctx.arc(10, 3, 6, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }

      // Draw Basket / Pip's catcher
      const bx = basketXRef.current
      ctx.save()
      ctx.translate(bx, BASKET_Y)

      // Basket body
      ctx.fillStyle = '#252C50'
      ctx.strokeStyle = '#F2BD78'
      ctx.lineWidth = 2
      ctx.shadowColor = '#F2BD78'
      ctx.shadowBlur = 6

      ctx.beginPath()
      ctx.roundRect(-BASKET_WIDTH / 2, 0, BASKET_WIDTH, BASKET_HEIGHT, [0, 0, 10, 10])
      ctx.fill()
      ctx.stroke()

      // Cute Pip skull peek above basket
      ctx.fillStyle = '#FFF3DF'
      ctx.beginPath()
      ctx.arc(0, -5, 12, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      ctx.fillStyle = '#101426'
      ctx.beginPath()
      ctx.arc(-4, -6, 2, 0, Math.PI * 2)
      ctx.arc(4, -6, 2, 0, Math.PI * 2)
      ctx.fill()

      // Starry nightcap bow
      ctx.fillStyle = '#F2BD78'
      ctx.beginPath()
      ctx.arc(0, -17, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isOpen, gameState, reducedMotion])

  if (!isOpen) return null

  // Pointer dragging across canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    updateBasketFromPointer(e)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons > 0) {
      updateBasketFromPointer(e)
    }
  }

  const updateBasketFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const scaleX = 360 / rect.width
    const targetX = clientX * scaleX
    basketXRef.current = Math.max(35, Math.min(325, targetX))
  }

  const moveLeft = () => {
    basketXRef.current = Math.max(35, basketXRef.current - 35)
  }

  const moveRight = () => {
    basketXRef.current = Math.min(325, basketXRef.current + 35)
  }

  return (
    <div className="dream-catcher-overlay" onClick={onClose} role="presentation">
      <div
        className="dream-catcher-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dream-catcher-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dream-catcher__topbar">
          <div>
            <h3 id="dream-catcher-title" className="dream-catcher__title">
              ★ Dream Catcher
            </h3>
            <p className="dream-catcher__subtitle">Catch the falling dreams for Pip!</p>
          </div>
          <button
            type="button"
            className="dream-catcher__close-btn"
            onClick={onClose}
            aria-label="Close Dream Catcher mini-game"
          >
            ✕ Close
          </button>
        </div>

        <div className="dream-catcher__scoreboard">
          <div className="dream-catcher__score-box">
            <span className="dream-catcher__score-label">Time</span>
            <span className="dream-catcher__score-val" aria-live="polite">
              {timeLeft}s
            </span>
          </div>
          <div className="dream-catcher__score-box">
            <span className="dream-catcher__score-label">Score</span>
            <span className="dream-catcher__score-val" aria-live="polite">
              {score}
            </span>
          </div>
          <div className="dream-catcher__score-box">
            <span className="dream-catcher__score-label">Best</span>
            <span className="dream-catcher__score-val">{bestScore}</span>
          </div>
        </div>

        <div className="dream-catcher__canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={360}
            height={400}
            className="dream-catcher__canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            aria-label="Dream catcher interactive game area. Drag or use arrow keys / on-screen buttons to catch falling dreams."
          />

          {gameState === 'gameover' && (
            <div className="dream-catcher__gameover-overlay">
              <h4>Time&apos;s up!</h4>
              <p>
                You caught <strong>{score}</strong> dream points!
                {score >= bestScore && score > 0 ? ' ✦ New Best Score!' : ''}
              </p>
              <button
                type="button"
                className="story-link story-link--primary dream-catcher__play-again-btn"
                onClick={startGame}
              >
                Play again ↺
              </button>
            </div>
          )}
        </div>

        <div className="dream-catcher__controls">
          <button
            type="button"
            className="story-link dream-catcher__nav-btn"
            onClick={moveLeft}
            aria-label="Move catcher basket left"
          >
            ◀ Move Left
          </button>
          <span className="dream-catcher__hint" aria-hidden="true">
            Drag, Arrow keys, or Buttons
          </span>
          <button
            type="button"
            className="story-link dream-catcher__nav-btn"
            onClick={moveRight}
            aria-label="Move catcher basket right"
          >
            Move Right ▶
          </button>
        </div>
      </div>
    </div>
  )
}
