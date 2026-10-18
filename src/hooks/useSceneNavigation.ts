import { useCallback, useEffect, useState } from 'react'
import { scenes, type SceneId } from '../data/story'
import { useReducedMotion } from './useReducedMotion'

export function useSceneNavigation() {
  const [activeScene, setActiveScene] = useState<SceneId>(() => {
    const hash = typeof window === 'undefined' ? '' : window.location.hash.slice(1)
    return scenes.find((scene) => scene.id === hash)?.id ?? 'arrival'
  })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-story-scene]'))
    const initialScene = document.getElementById(window.location.hash.slice(1))
    let initialFrame = 0
    if (initialScene?.matches('[data-story-scene]')) {
      initialFrame = window.requestAnimationFrame(() => initialScene.scrollIntoView({ behavior: 'auto', block: 'start' }))
    }
    if (!nodes.length || !('IntersectionObserver' in window)) {
      return () => { if (initialFrame) window.cancelAnimationFrame(initialFrame) }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveScene(visible.target.id as SceneId)
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-12% 0px -16% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => {
      observer.disconnect()
      if (initialFrame) window.cancelAnimationFrame(initialFrame)
    }
  }, [])

  const goToScene = useCallback(
    (sceneId: SceneId) => {
      const scene = document.getElementById(sceneId)
      if (!scene) return
      setActiveScene(sceneId)
      window.history.replaceState(null, '', `#${sceneId}`)
      scene.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    },
    [reducedMotion],
  )

  return { activeScene, goToScene }
}
