import { PipCharacter } from '../components/PipCharacter'
import type { PipState } from '../data/story'

interface SecretSceneProps {
  discovered: boolean
  pipState: PipState
  onPipClick: () => void
  onReveal: () => void
}

export function SecretScene({ discovered, pipState, onPipClick, onReveal }: SecretSceneProps) {
  return (
    <section className={`story-scene secret-scene ${discovered ? 'is-discovered' : ''}`} id="secret" data-story-scene aria-labelledby="secret-title">
      <div className="secret-scene__quiet" aria-hidden="true" />
      <div className="secret-scene__copy scene-copy">
        <p className="eyebrow">A light kept safe</p>
        <h2 id="secret-title">There is one<br />more thing, <em>here.</em></h2>
        <p>Look where Pip's light keeps falling.</p>
      </div>
      <div className="secret-scene__discovery">
        <span className="secret-scene__orbit secret-scene__orbit--one" aria-hidden="true" />
        <span className="secret-scene__orbit secret-scene__orbit--two" aria-hidden="true" />
        <button
          className="secret-star"
          type="button"
          onClick={onReveal}
          aria-label={discovered ? 'The little star Pip was protecting' : 'Find the little star Pip is protecting'}
          aria-pressed={discovered}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 5 61 38 95 50 61 62 50 95 39 62 5 50 39 38Z" /></svg>
          <span className="secret-star__core" />
        </button>
        <p className="secret-scene__clue">{discovered ? 'Pip kept this one just for you.' : 'A single star, a little brighter than the rest. Touch to keep it company.'}</p>
        {discovered && (
          <>
            <p className="secret-scene__reveal" role="status" aria-live="polite">Even the smallest light can make the darkest night feel like home.</p>
            <PipCharacter
              state={pipState}
              onClick={onPipClick}
              image="/assets/pip_portrait.png"
              imageAlt="Pip quietly keeps a little glowing star close."
              className="secret-scene__pip"
              label="Share the little star with Pip"
            />
          </>
        )}
      </div>
      <p className="scene-caption">05 <span>—</span> The secret</p>
    </section>
  )
}
