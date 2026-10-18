import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface StorybookModalProps {
  isOpen: boolean
  onClose: () => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

interface PageData {
  title: string
  text: string
  illustration: 'spark' | 'breeze' | 'pip' | 'rooftop' | 'lantern'
}

const PAGES: PageData[] = [
  {
    title: 'The Little Spark',
    text: 'Once, a speck of amber light fell from a starry sky. It was smaller than a whisper, but it wanted to see where the night went when dreams arrived.',
    illustration: 'spark',
  },
  {
    title: 'The Wide Night',
    text: 'The shadows were tall and deep. "Are you afraid?" asked a passing breeze. "No," whispered the spark. "The dark is only a velvet blanket waiting for a bedtime story."',
    illustration: 'breeze',
  },
  {
    title: 'A Friend on a Cloud',
    text: 'High above the sleepy chimneys, it found Pip resting upon a soft cloud. Pip had lost a tiny dream. "Here," said the spark, lighting up the road ahead.',
    illustration: 'pip',
  },
  {
    title: 'The Lost Dream',
    text: 'Together they searched between the rooftops until they found the dream tucked behind a sleepy chimney. It glowed warmly when they touched it, singing a quiet song.',
    illustration: 'rooftop',
  },
  {
    title: 'Safe Asleep',
    text: '"You were brave," Pip whispered, placing the spark safely into the bedside lantern. The room grew warm, and the whole world drifted off to sleep.',
    illustration: 'lantern',
  },
]

export function StorybookModal({ isOpen, onClose, returnFocusRef }: StorybookModalProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const modalRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const reducedMotion = useReducedMotion()

  // Handle keyboard events: Escape, ArrowLeft, ArrowRight, and focus trap
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

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentPage((prev) => {
          if (prev < PAGES.length - 1) {
            setDirection('next')
            return prev + 1
          }
          return prev
        })
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentPage((prev) => {
          if (prev > 0) {
            setDirection('prev')
            return prev - 1
          }
          return prev
        })
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

  if (!isOpen) return null

  const page = PAGES[currentPage]

  const nextPage = () => {
    if (currentPage < PAGES.length - 1) {
      setDirection('next')
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection('prev')
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff < -45) {
      nextPage()
    } else if (diff > 45) {
      prevPage()
    }
  }

  return (
    <div className="storybook-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="storybook-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="storybook-modal-title"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="storybook-modal__topbar">
          <span className="storybook-modal__page-count" aria-live="polite">
            {currentPage + 1} / {PAGES.length}
          </span>
          <button
            type="button"
            className="storybook-modal__close-btn"
            onClick={onClose}
            aria-label="Close storybook"
          >
            ✕ Close
          </button>
        </div>

        <div className={`storybook-modal__book ${reducedMotion ? 'reduced-motion' : ''}`}>
          <div className={`storybook-modal__page flip-${direction}`} key={currentPage}>
            {/* SVG Illustration */}
            <div className="storybook-modal__illustration" aria-hidden="true">
              <svg viewBox="0 0 240 130" className="storybook-modal__svg">
                <rect width="240" height="130" fill="#171C35" rx="6" />
                {page.illustration === 'spark' && (
                  <>
                    <path d="M 0 130 Q 120 70 240 130 Z" fill="#252C50" />
                    <circle cx="190" cy="30" r="14" fill="#F2BD78" />
                    <circle cx="186" cy="28" r="12" fill="#171C35" />
                    <circle cx="120" cy="75" r="8" fill="#FFF3DF" filter="drop-shadow(0 0 6px #F2BD78)" />
                    <path d="M 120 62 L 120 88 M 107 75 L 133 75" stroke="#F2BD78" strokeWidth="1.5" />
                  </>
                )}
                {page.illustration === 'breeze' && (
                  <>
                    <path d="M 20 40 Q 80 20 150 45 T 220 30" fill="none" stroke="#797BA8" strokeWidth="2" strokeDasharray="6 4" />
                    <path d="M 30 75 Q 90 55 160 80 T 210 65" fill="none" stroke="#A5A0C8" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="120" cy="65" r="7" fill="#F2BD78" filter="drop-shadow(0 0 8px #F2BD78)" />
                  </>
                )}
                {page.illustration === 'pip' && (
                  <>
                    <path d="M 70 100 Q 120 60 170 100 Z" fill="#252C50" />
                    <circle cx="120" cy="65" r="18" fill="#FFF3DF" />
                    <circle cx="114" cy="63" r="2.5" fill="#101426" />
                    <circle cx="126" cy="63" r="2.5" fill="#101426" />
                    <circle cx="85" cy="55" r="6" fill="#F2BD78" filter="drop-shadow(0 0 6px #F2BD78)" />
                  </>
                )}
                {page.illustration === 'rooftop' && (
                  <>
                    <polygon points="20,130 70,80 120,130" fill="#252C50" />
                    <polygon points="110,130 160,70 210,130" fill="#1C223F" />
                    <rect x="175" y="55" width="14" height="25" fill="#252C50" />
                    <circle cx="182" cy="45" r="7" fill="#F2BD78" filter="drop-shadow(0 0 6px #FFF3DF)" />
                  </>
                )}
                {page.illustration === 'lantern' && (
                  <>
                    <rect x="95" y="45" width="50" height="60" fill="#252C50" rx="6" stroke="#F2BD78" strokeWidth="2" />
                    <circle cx="120" cy="75" r="14" fill="#F2BD78" opacity="0.8" filter="drop-shadow(0 0 10px #F2BD78)" />
                    <circle cx="120" cy="75" r="6" fill="#FFF3DF" />
                    <path d="M 105 45 Q 120 25 135 45" fill="none" stroke="#F2BD78" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>

            <h3 id="storybook-modal-title" className="storybook-modal__page-title">
              {page.title}
            </h3>
            <p className="storybook-modal__page-text">{page.text}</p>
          </div>
        </div>

        <div className="storybook-modal__controls">
          <button
            type="button"
            className="story-link storybook-modal__nav-btn"
            onClick={prevPage}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            ◀ Previous
          </button>
          <span className="storybook-modal__hint" aria-hidden="true">Use ← / → keys or swipe</span>
          <button
            type="button"
            className="story-link storybook-modal__nav-btn"
            onClick={nextPage}
            disabled={currentPage === PAGES.length - 1}
            aria-label="Next page"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  )
}
