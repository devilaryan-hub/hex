import { useCallback, useEffect, useRef, useState } from 'react'
import type { PipState } from '../data/story'

export function usePipState() {
  const [pipState, setPipState] = useState<PipState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const react = useCallback((next: PipState, duration = 2100) => {
    if (timer.current) clearTimeout(timer.current)
    setPipState(next)
    if (next !== 'idle' && next !== 'dreaming' && next !== 'sleepy') {
      timer.current = setTimeout(() => setPipState('idle'), duration)
    }
  }, [])

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setPipState('idle')
  }, [])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  return { pipState, react, reset }
}
