import type { PointerEvent } from 'react'
import type { PipState } from '../data/story'

interface PipCharacterProps {
  state: PipState
  onClick: () => void
  image: string
  imageAlt: string
  className?: string
  label?: string
}

export function PipCharacter({ state, onClick, image, imageAlt, className = '', label = 'Ask Pip to look your way' }: PipCharacterProps) {
  const lookTowardPointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--gaze-x', `${horizontal * 4}px`)
    event.currentTarget.style.setProperty('--gaze-y', `${vertical * 3}px`)
  }

  const resetGaze = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--gaze-x', '0px')
    event.currentTarget.style.setProperty('--gaze-y', '0px')
  }

  return (
    <button
      className={`pip-character pip-character--${state} ${className}`}
      type="button"
      onClick={onClick}
      onPointerMove={lookTowardPointer}
      onPointerLeave={resetGaze}
      aria-label={label}
      title={label}
    >
      <img src={image} alt={imageAlt} loading="lazy" draggable="false" />
      <span className="pip-character__blink pip-character__blink--left" aria-hidden="true" />
      <span className="pip-character__blink pip-character__blink--right" aria-hidden="true" />
      <span className="pip-character__hint" aria-hidden="true">say hello</span>
    </button>
  )
}
