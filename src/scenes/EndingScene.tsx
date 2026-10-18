import { PipCharacter } from '../components/PipCharacter'
import { StarField } from '../components/StarField'
import { DreamGuestbook } from '../components/DreamGuestbook'
import type { PipState } from '../data/story'

interface EndingSceneProps {
  pipState: PipState
  onPipClick: () => void
  onRevisit: () => void
  onReplay: () => void
}

export function EndingScene({ pipState, onPipClick, onRevisit, onReplay }: EndingSceneProps) {
  return (
    <section className="story-scene ending-scene" id="ending" data-story-scene aria-labelledby="ending-title">
      <StarField className="ending-scene__stars" />
      <div className="ending-scene__window" aria-hidden="true"><span className="ending-scene__moon" /><span className="ending-scene__night-star ending-scene__night-star--one" /><span className="ending-scene__night-star ending-scene__night-star--two" /></div>
      <div className="ending-scene__copy scene-copy">
        <p className="eyebrow">The last page, for now</p>
        <h2 id="ending-title">And just like that,<br />the night found<br /><em>its little light.</em></h2>
        <p>Goodnight, little Pip. Goodnight, you.</p>
        <div className="ending-scene__actions">
          <button className="story-link" type="button" onClick={onRevisit}>Revisit the nursery</button>
          <button className="story-link story-link--quiet" type="button" onClick={onReplay}>Explore again</button>
        </div>
      </div>
      <figure className="ending-scene__figure">
        <PipCharacter
          state={pipState}
          onClick={onPipClick}
          image="/assets/pip_portrait.png"
          imageAlt="Pip is settled on a soft cloud, ready for a peaceful goodnight."
          className="ending-scene__pip"
          label="Say one last goodnight to Pip"
        />
        <figcaption>All tucked in</figcaption>
      </figure>
      <DreamGuestbook />
      <p className="scene-caption">06 <span>—</span> Goodnight</p>
    </section>
  )
}
