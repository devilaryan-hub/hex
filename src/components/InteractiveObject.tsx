import type { KeyboardEvent, ReactNode } from 'react'

interface InteractiveObjectProps {
  name: string
  hint: string
  activated: boolean
  onActivate: () => void
  className: string
  children: ReactNode
  asDiv?: boolean
}

export function InteractiveObject({ name, hint, activated, onActivate, className, children, asDiv = false }: InteractiveObjectProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onActivate()
    }
  }

  if (asDiv) {
    return (
      <div
        className={`room-object ${className} ${activated ? 'is-activated' : ''}`}
        onClick={onActivate}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={activated}
        aria-label={`${name}. ${hint}`}
        title={hint}
      >
        <span className="room-object__art">{children}</span>
        <span className="room-object__name">{name}</span>
        <span className="room-object__hint">{activated ? 'seen' : 'touch to explore'}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`room-object ${className} ${activated ? 'is-activated' : ''}`}
      onClick={onActivate}
      aria-pressed={activated}
      aria-label={`${name}. ${hint}`}
      title={hint}
    >
      <span className="room-object__art" aria-hidden="true">{children}</span>
      <span className="room-object__name">{name}</span>
      <span className="room-object__hint">{activated ? 'seen' : 'touch to explore'}</span>
    </button>
  )
}
