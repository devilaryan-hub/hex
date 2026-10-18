import { scenes, type SceneId } from '../data/story'

interface SceneNavigationProps {
  activeScene: SceneId
  onSelect: (scene: SceneId) => void
}

export function SceneNavigation({ activeScene, onSelect }: SceneNavigationProps) {
  const activeIndex = scenes.findIndex((scene) => scene.id === activeScene)
  const current = scenes[activeIndex] ?? scenes[0]

  return (
    <>
      <nav className="scene-nav scene-nav--desktop" aria-label="Story chapters">
        <p className="scene-nav__count">{String(activeIndex + 1).padStart(2, '0')} <span>/</span> 06</p>
        <ol>
          {scenes.map((scene, index) => (
            <li key={scene.id}>
              <button
                className={scene.id === activeScene ? 'is-current' : ''}
                type="button"
                onClick={() => onSelect(scene.id)}
                aria-current={scene.id === activeScene ? 'step' : undefined}
                aria-label={`Go to chapter ${index + 1}: ${scene.label}`}
              >
                <span className="scene-nav__mark" aria-hidden="true" />
                <span className="scene-nav__label">{scene.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="scene-nav--mobile">
        <label className="visually-hidden" htmlFor="chapter-select">Choose a story chapter</label>
        <select id="chapter-select" value={current.id} onChange={(event) => onSelect(event.target.value as SceneId)}>
          {scenes.map((scene, index) => (
            <option value={scene.id} key={scene.id}>{String(index + 1).padStart(2, '0')} · {scene.label}</option>
          ))}
        </select>
      </div>
    </>
  )
}
