interface AudioControlsProps {
  muted: boolean
  setMuted: (muted: boolean) => void
  masterVolume: number
  setMasterVolume: (volume: number) => void
  musicVolume: number
  setMusicVolume: (volume: number) => void
  sfxVolume: number
  setSfxVolume: (volume: number) => void
  narrationVolume: number
  setNarrationVolume: (volume: number) => void
  hasAudioTracks: boolean
}

function AudioSlider({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="audio-controls__slider" htmlFor={id}>
      <span>{label}<b>{Math.round(value * 100)}%</b></span>
      <input id={id} type="range" min="0" max="1" step="0.05" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export function AudioControls({ muted, setMuted, masterVolume, setMasterVolume, musicVolume, setMusicVolume, sfxVolume, setSfxVolume, narrationVolume, setNarrationVolume, hasAudioTracks }: AudioControlsProps) {
  return (
    <details className="audio-controls">
      <summary aria-label="Open audio settings">Sound</summary>
      <div className="audio-controls__panel">
        <button
          type="button"
          className="audio-controls__toggle"
          aria-pressed={!muted}
          aria-label={`Audio preference ${muted ? 'off' : 'on'}${hasAudioTracks ? '' : '; audio is ready for the story'}`}
          onClick={() => setMuted(!muted)}
        >
          <span className={`audio-controls__lamp ${muted ? '' : 'is-on'}`} aria-hidden="true" />
          Sound {muted ? 'off' : 'on'}
        </button>
        <div className="audio-controls__sliders">
          <AudioSlider id="audio-master" label="Sound" value={masterVolume} onChange={setMasterVolume} />
          <AudioSlider id="audio-music" label="Music" value={musicVolume} onChange={setMusicVolume} />
          <AudioSlider id="audio-effects" label="Effects" value={sfxVolume} onChange={setSfxVolume} />
          <AudioSlider id="audio-narration" label="Narration" value={narrationVolume} onChange={setNarrationVolume} />
        </div>
        <p>{hasAudioTracks ? 'The first intentional click unlocks the nursery soundscape.' : 'Sound is ready for the story.'}</p>
      </div>
    </details>
  )
}
