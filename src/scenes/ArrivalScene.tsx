import { StarField } from '../components/StarField'

export function ArrivalScene({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="story-scene arrival-scene" id="arrival" data-story-scene aria-labelledby="arrival-title">
      <StarField />
      <div className="arrival-scene__horizon" aria-hidden="true">
        <div className="arrival-scene__distant-house">
          <div className="arrival-scene__window"><span className="arrival-scene__window-moon" /><span className="arrival-scene__window-figure" /></div>
          <div className="arrival-scene__roof" />
        </div>
        <div className="arrival-scene__hill arrival-scene__hill--far" />
        <div className="arrival-scene__hill arrival-scene__hill--near" />
        <span className="arrival-scene__path" />
      </div>
      <div className="arrival-scene__copy scene-copy">
        <p className="eyebrow"><span className="eyebrow__spark" aria-hidden="true" /> A story for the almost-sleeping</p>
        <h1 id="arrival-title">Somewhere between<br /><em>sleep and starlight...</em></h1>
        <p className="arrival-scene__support">A little world is waiting to be discovered.</p>
        <button className="story-link story-link--primary" type="button" onClick={onEnter}>
          <span>Enter the nursery</span><span className="story-link__rule" aria-hidden="true" />
        </button>
        <p className="arrival-scene__hint">Or let the night carry you down</p>
      </div>
      <p className="scene-caption arrival-scene__caption">01 <span>—</span> The midnight arrival</p>
    </section>
  )
}
