import { PipCharacter } from '../components/PipCharacter'
import type { PipState } from '../data/story'
import { pipProfile } from '../data/portfolio'

interface MeetPipSceneProps {
  pipState: PipState
  onPipClick: () => void
}

export function MeetPipScene({ pipState, onPipClick }: MeetPipSceneProps) {
  return (
    <section className="story-scene meet-scene" id="meet-pip" data-story-scene aria-labelledby="meet-title">
      <div className="meet-scene__copy scene-copy">
        <p className="eyebrow">A tiny resident of the night</p>
        <h2 id="meet-title">Oh. There<br />you are, <em>Pip.</em></h2>
        <p className="meet-scene__body">Small as a lullaby, with a pocketful of moonlight and one eye on the stars.</p>
        <p className="meet-scene__instruction">Pip is a little shy. Say hello, if you like.</p>
        <div className="pip-profile" aria-label="Pip profile">
          <p className="pip-profile__role"><span>{pipProfile.role}</span> <i aria-hidden="true">·</i> {pipProfile.studio}</p>
          <p className="pip-profile__tagline">“{pipProfile.tagline}”</p>
          <p className="pip-profile__bio">{pipProfile.description}</p>
          <ul className="pip-profile__traits" aria-label="Pip's personality traits">
            {pipProfile.personality.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
        </div>
      </div>
      <figure className="meet-scene__figure">
        <div className="meet-scene__frame">
          <span className="meet-scene__frame-star" aria-hidden="true">✦</span>
          <PipCharacter
            state={pipState}
            onClick={onPipClick}
            image="/assets/pip_portrait.png"
            imageAlt="Pip, a baby-like storybook character wearing a starry nightcap and holding a warm lantern, seated on a little cloud."
            className="meet-scene__portrait"
            label="Say hello to Pip"
          />
        </div>
        <figcaption><span>Resident dreamer</span><span>Est. just before midnight</span></figcaption>
      </figure>
      <span className="meet-scene__thread" aria-hidden="true" />
      <p className="scene-caption">02 <span>—</span> Meet Pip</p>
    </section>
  )
}
