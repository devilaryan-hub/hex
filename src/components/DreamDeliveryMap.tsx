import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface DreamDeliveryMapProps {
  onClose: () => void
}

const STOPS = [
  { id: 1, name: 'Nursery chimney', label: 'Departure: warm wishes packed safely', progress: 0 },
  { id: 2, name: 'Attic studio', label: 'Rooftop 1: midnight painter asleep', progress: 0.16 },
  { id: 3, name: 'Cloud rest', label: 'Cloud station: gentle starry breeze', progress: 0.33 },
  { id: 4, name: 'The sleepy cat', label: 'Rooftop 3: one sleepy cat purring softly', progress: 0.5 },
  { id: 5, name: 'Clocktower ledge', label: 'Clocktower ledge: chime quieted for the night', progress: 0.67 },
  { id: 6, name: 'The quiet greenhouse', label: 'Greenhouse: sleeping roses tucked in', progress: 0.84 },
  { id: 7, name: 'Moonlit balcony', label: 'Moonlit balcony: final dream delivered', progress: 1.0 },
]

export function DreamDeliveryMap({ onClose }: DreamDeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [pipPos, setPipPos] = useState({ x: 50, y: 255 })

  const updatePosition = useCallback((progress: number) => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    const p = Math.max(0, Math.min(1, progress))
    const pt = path.getPointAtLength(p * total)
    setPipPos({ x: pt.x, y: pt.y })

    let activeIdx = 0
    for (let i = STOPS.length - 1; i >= 0; i--) {
      if (p >= STOPS[i].progress - 0.05) {
        activeIdx = i
        break
      }
    }
    setCurrentStopIndex(activeIdx)
  }, [])

  // Sync to scroll progress when visitor scrolls past map section
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const winH = window.innerHeight
        const totalDist = winH + rect.height
        const currentDist = winH - rect.top
        const progress = Math.max(0, Math.min(1, currentDist / totalDist))
        updatePosition(progress)
        rafId = 0
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updatePosition(STOPS[currentStopIndex].progress)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [currentStopIndex, updatePosition])

  const goToStop = (index: number) => {
    const target = Math.max(0, Math.min(STOPS.length - 1, index))
    setCurrentStopIndex(target)
    updatePosition(STOPS[target].progress)
  }

  const currentStop = STOPS[currentStopIndex]

  return (
    <div className="dream-map" ref={containerRef} aria-label="Dream Delivery Routes Interactive Map">
      <div className="dream-map__header">
        <div>
          <h4 className="dream-map__title">Dream Delivery Routes</h4>
          <p className="dream-map__subtitle">Rooftop flight path from nursery to the tall moon</p>
        </div>
        <button type="button" className="dream-map__close-btn" onClick={onClose} aria-label="Close delivery map">✕ Close</button>
      </div>

      <div className="dream-map__svg-wrapper">
        <svg viewBox="0 0 800 320" className="dream-map__svg" aria-hidden="true">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F2BD78" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF3DF" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background night sky elements */}
          <circle cx="740" cy="50" r="32" fill="#F2BD78" opacity="0.85" />
          <circle cx="732" cy="44" r="28" fill="#171C35" />

          {/* Clouds */}
          <path d="M 280 110 Q 300 90 330 100 Q 360 85 390 105 Q 410 125 380 135 L 290 135 Z" fill="#252C50" opacity="0.7" />
          <path d="M 520 70 Q 545 50 575 60 Q 600 45 630 65 Q 645 85 620 95 L 530 95 Z" fill="#252C50" opacity="0.6" />

          {/* Rooftops and chimneys */}
          <polygon points="30,320 80,240 130,320" fill="#171C35" stroke="#797BA8" strokeWidth="1.5" />
          <rect x="95" y="225" width="14" height="25" fill="#252C50" stroke="#797BA8" strokeWidth="1" />

          <polygon points="140,320 190,210 240,320" fill="#12182F" stroke="#797BA8" strokeWidth="1.5" />
          <rect x="155" y="195" width="12" height="25" fill="#252C50" />

          <polygon points="270,320 340,230 410,320" fill="#171C35" stroke="#797BA8" strokeWidth="1.5" />
          <rect x="375" y="215" width="16" height="25" fill="#252C50" />

          <polygon points="430,320 500,200 570,320" fill="#12182F" stroke="#797BA8" strokeWidth="1.5" />

          <rect x="525" y="140" width="35" height="180" fill="#1C2344" stroke="#797BA8" strokeWidth="1.5" />
          <polygon points="520,140 542,100 565,140" fill="#252C50" stroke="#F2BD78" strokeWidth="1" />
          <circle cx="542" cy="155" r="8" fill="#FFF3DF" opacity="0.8" />

          <path d="M 600 320 L 600 250 Q 640 220 680 250 L 680 320 Z" fill="#171C35" stroke="#A5A0C8" strokeWidth="1.5" opacity="0.8" />

          <rect x="700" y="80" width="80" height="240" fill="#12182F" stroke="#797BA8" strokeWidth="1.5" />
          <line x1="695" y1="95" x2="745" y2="95" stroke="#F2BD78" strokeWidth="2" />

          {/* Delivery Flight Path */}
          <path
            ref={pathRef}
            d="M 50 255 C 110 220, 150 170, 210 185 C 270 200, 310 120, 375 130 C 440 140, 470 90, 542 95 C 610 100, 630 190, 670 170 C 700 150, 715 80, 740 75"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            filter="url(#glow)"
          />

          {/* Stop markers */}
          {STOPS.map((stop, idx) => {
            const isPassed = idx <= currentStopIndex
            const cx = idx === 0 ? 50 : idx === 1 ? 210 : idx === 2 ? 375 : idx === 3 ? 470 : idx === 4 ? 542 : idx === 5 ? 670 : 740
            const cy = idx === 0 ? 255 : idx === 1 ? 185 : idx === 2 ? 130 : idx === 3 ? 120 : idx === 4 ? 95 : idx === 5 ? 170 : 75
            return (
              <g key={stop.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isPassed ? '7' : '5'}
                  fill={isPassed ? '#F2BD78' : '#252C50'}
                  stroke={isPassed ? '#FFF3DF' : '#797BA8'}
                  strokeWidth="2"
                />
              </g>
            )
          })}

          {/* Pip marker */}
          <g
            className="dream-map__pip-marker"
            transform={`translate(${pipPos.x}, ${pipPos.y})`}
            style={{ transition: reducedMotion ? 'none' : 'transform 120ms ease-out' }}
          >
            <circle cx="0" cy="0" r="14" fill="#F2BD78" opacity="0.35" />
            <circle cx="0" cy="0" r="9" fill="#FFF3DF" />
            <circle cx="-3" cy="-1" r="1.5" fill="#101426" />
            <circle cx="3" cy="-1" r="1.5" fill="#101426" />
            <path d="M -3 3 Q 0 5 3 3" fill="none" stroke="#101426" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Stop status & controls */}
      <div className="dream-map__footer">
        <div className="dream-map__status" aria-live="polite">
          <span className="dream-map__badge">Stop {currentStopIndex + 1} of {STOPS.length}</span>
          <strong className="dream-map__label">{currentStop.label}</strong>
        </div>

        <div className="dream-map__nav">
          <button
            type="button"
            className="story-link dream-map__nav-btn"
            onClick={() => goToStop(currentStopIndex - 1)}
            disabled={currentStopIndex === 0}
            aria-label="Previous stop"
          >
            ◀ Prev
          </button>
          <button
            type="button"
            className="story-link dream-map__nav-btn"
            onClick={() => goToStop(currentStopIndex + 1)}
            disabled={currentStopIndex === STOPS.length - 1}
            aria-label="Next stop"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  )
}
