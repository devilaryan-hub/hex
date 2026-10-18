import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  createdAt: number
}

const COLORS = ['#F2BD78', '#FFF3DF', '#A5A0C8'] // amber, cream, lavender
const DURATION = 700 // ms
const MAX_PARTICLES = 40

export function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    // Disable on touch-only devices (e.g. mobile phones without a fine pointer)
    const isTouchOnly =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(any-pointer: fine)').matches

    if (isTouchOnly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const particles: Particle[] = []
    let lastX = 0
    let lastY = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const addSparkle = (clientX: number, clientY: number, pointerType?: string) => {
      if (pointerType === 'touch') return

      const dist = Math.hypot(clientX - lastX, clientY - lastY)
      if (dist < 3) return

      lastX = clientX
      lastY = clientY

      const count = Math.min(2, Math.max(1, Math.floor(dist / 12)))
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift()
        }

        particles.push({
          x: clientX + (Math.random() - 0.5) * 12,
          y: clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.9,
          vy: 0.8 + Math.random() * 1.0, // drift down
          size: 8 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          createdAt: performance.now(),
        })
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      addSparkle(e.clientX, e.clientY, e.pointerType)
    }

    const handleMouseMove = (e: MouseEvent) => {
      addSparkle(e.clientX, e.clientY, 'mouse')
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        particles.length = 0
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const render = (now: number) => {
      if (document.visibilityState === 'hidden') {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        const elapsed = now - p.createdAt

        if (elapsed >= DURATION) {
          particles.splice(i, 1)
          continue
        }

        const progress = elapsed / DURATION
        const alpha = Math.max(0, 1 - progress)
        const currentSize = Math.max(1, p.size * (1 - progress * 0.75))

        p.x += p.vx
        p.y += p.vy

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6

        // 4-pointed star sparkle with fuller curve
        ctx.beginPath()
        ctx.moveTo(p.x, p.y - currentSize)
        ctx.quadraticCurveTo(p.x + currentSize * 0.15, p.y - currentSize * 0.15, p.x + currentSize, p.y)
        ctx.quadraticCurveTo(p.x + currentSize * 0.15, p.y + currentSize * 0.15, p.x, p.y + currentSize)
        ctx.quadraticCurveTo(p.x - currentSize * 0.15, p.y + currentSize * 0.15, p.x - currentSize, p.y)
        ctx.quadraticCurveTo(p.x - currentSize * 0.15, p.y - currentSize * 0.15, p.x, p.y - currentSize)
        ctx.closePath()
        ctx.fill()

        // Center glowing core
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(0.5, currentSize * 0.22), 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="sparkle-trail-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
