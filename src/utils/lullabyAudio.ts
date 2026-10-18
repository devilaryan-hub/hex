// 8-note music-box melody using sine and triangle oscillators with quick exponential decay
const LULLABY_NOTES = [
  523.25, // C5
  659.25, // E5
  783.99, // G5
  1046.50, // C6
  987.77, // B5
  783.99, // G5
  880.00, // A5
  783.99, // G5
]

const NOTE_INTERVAL = 0.42 // seconds between note attacks
const NOTE_DECAY = 0.65 // seconds decay duration

class LullabyAudioController {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isPlaying = false
  private stopTimer: number | null = null
  private onEndCallback: (() => void) | null = null

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  public play(options: {
    muted: boolean
    masterVolume: number
    volume: number
    onEnd?: () => void
  }): void {
    this.stop()

    this.isPlaying = true
    this.onEndCallback = options.onEnd ?? null

    const ctx = this.getContext()
    const now = ctx.currentTime

    // Master gain node for overall volume & mute control
    const effectiveVol = options.muted ? 0 : Math.max(0, Math.min(1, options.masterVolume * options.volume))
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(effectiveVol, now)
    masterGain.connect(ctx.destination)
    this.masterGain = masterGain

    LULLABY_NOTES.forEach((freq, index) => {
      const noteStart = now + index * NOTE_INTERVAL

      // Sine oscillator (warm fundamental tone)
      const sine = ctx.createOscillator()
      sine.type = 'sine'
      sine.frequency.setValueAtTime(freq, noteStart)

      // Triangle oscillator (gentle music-box harmonics)
      const tri = ctx.createOscillator()
      tri.type = 'triangle'
      tri.frequency.setValueAtTime(freq, noteStart)

      // Note gain with quick attack and exponential decay
      const noteGain = ctx.createGain()
      noteGain.gain.setValueAtTime(0.0001, noteStart)
      noteGain.gain.linearRampToValueAtTime(0.35, noteStart + 0.015)
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + NOTE_DECAY)

      sine.connect(noteGain)
      tri.connect(noteGain)
      noteGain.connect(masterGain)

      sine.start(noteStart)
      tri.start(noteStart)
      sine.stop(noteStart + NOTE_DECAY)
      tri.stop(noteStart + NOTE_DECAY)
    })

    const totalDurationMs = (LULLABY_NOTES.length * NOTE_INTERVAL + 0.3) * 1000
    this.stopTimer = window.setTimeout(() => {
      this.stop()
    }, totalDurationMs)
  }

  public stop(): void {
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer)
      this.stopTimer = null
    }

    if (this.masterGain && this.ctx && this.ctx.state === 'running') {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05)
      } catch {
        // ignore
      }
    }

    const wasPlaying = this.isPlaying
    this.isPlaying = false

    if (wasPlaying && this.onEndCallback) {
      const cb = this.onEndCallback
      this.onEndCallback = null
      cb()
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }
}

export const lullabyPlayer = new LullabyAudioController()
