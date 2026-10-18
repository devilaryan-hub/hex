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

    // Disable on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return
    }

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

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return

      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      if (dist < 4) return

      lastX = e.clientX
      lastY = e.clientY

      const count = Math.min(2, Math.max(1, Math.floor(dist / 14)))
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift()
        }

        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 0.6 + Math.random() * 0.8, // drift down
          size: 4 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          createdAt: performance.now(),
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    const render = (now: number) => {
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
        const currentSize = Math.max(0.5, p.size * (1 - progress * 0.75))

        p.x += p.vx
        p.y += p.vy

        // 4-pointed star sparkle
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.moveTo(p.x, p.y - currentSize)
        ctx.quadraticCurveTo(p.x, p.y, p.x + currentSize, p.y)
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + currentSize)
        ctx.quadraticCurveTo(p.x, p.y, p.x - currentSize, p.y)
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - currentSize)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
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
