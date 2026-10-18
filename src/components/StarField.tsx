import type { CSSProperties } from 'react'

const stars = [
  [5, 16, 1], [11, 71, 2], [18, 34, 1], [24, 83, 1], [31, 12, 2],
  [38, 59, 1], [44, 26, 1], [51, 91, 2], [57, 42, 1], [63, 17, 1],
  [68, 74, 2], [74, 31, 1], [81, 85, 1], [87, 22, 2], [93, 57, 1],
  [97, 11, 1], [15, 48, 1], [78, 50, 1],
] as const

export function StarField({ className = '' }: { className?: string }) {
  return (
    <div className={`star-field ${className}`} aria-hidden="true">
      {stars.map(([x, y, size], index) => (
        <span
          className="star-field__star"
          key={`${x}-${y}`}
          style={{ left: `${x}%`, top: `${y}%`, width: `${size + 1}px`, height: `${size + 1}px`, '--star-delay': `${(index % 6) * -0.7}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}
