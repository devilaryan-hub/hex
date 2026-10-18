import type { ReactNode } from 'react'

interface InteractiveObjectProps {
  name: string
  hint: string
  activated: boolean
  onActivate: () => void
  className: string
  children: ReactNode
}

export function InteractiveObject({ name, hint, activated, onActivate, className, children }: InteractiveObjectProps) {
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
