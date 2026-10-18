import { useEffect, useState } from 'react'
import { defaultWishAdapter, type DreamWish, type WishStorageAdapter } from '../utils/wishStorage'

interface DreamGuestbookProps {
  adapter?: WishStorageAdapter
}

export function DreamGuestbook({ adapter = defaultWishAdapter }: DreamGuestbookProps) {
  const [wishes, setWishes] = useState<DreamWish[]>([])
  const [inputText, setInputText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadWishes = async () => {
      const result = await adapter.getWishes()
      setWishes(result)
    }
    void loadWishes()
  }, [adapter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await adapter.addWish(trimmed)
      const refreshed = await adapter.getWishes()
      setWishes(refreshed)
      setInputText('')
    } finally {
      setSubmitting(false)
    }
  }

  // Generate subtle varied rotation for sticky notes based on string hash
  const getNoteRotation = (id: string) => {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i)
    const angles = [-2, 1.5, -1, 2, -1.5, 1]
    return angles[Math.abs(hash) % angles.length]
  }

  return (
    <div className="dream-guestbook" aria-labelledby="guestbook-heading">
      <div className="dream-guestbook__header">
        <div className="dream-guestbook__title-group">
          <p className="eyebrow">Midnight Bulletin</p>
          <h3 id="guestbook-heading" className="dream-guestbook__title">
            Leave a dream wish for Pip
          </h3>
          <p className="dream-guestbook__desc">
            Whisper a gentle thought into the quiet sky before you rest.
          </p>
        </div>
        <span className="dream-guestbook__local-badge" title="Saved locally in your browser">
          Wishes on this device
        </span>
      </div>

      <form className="dream-guestbook__form" onSubmit={handleSubmit}>
        <div className="dream-guestbook__input-wrapper">
          <input
            type="text"
            className="dream-guestbook__input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. May the breeze carry soft dreams..."
            maxLength={80}
            aria-label="Your dream wish for Pip (up to 80 characters)"
          />
          <span className="dream-guestbook__char-counter" aria-hidden="true">
            {inputText.length}/80
          </span>
        </div>
        <button
          type="submit"
          className="story-link story-link--primary dream-guestbook__send-btn"
          disabled={!inputText.trim() || submitting}
          aria-label="Pin dream wish"
        >
          Send wish ✦
        </button>
      </form>

      <div
        className="dream-guestbook__board"
        role="region"
        aria-label="Dream wishes wall"
      >
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="dream-guestbook__note"
            style={{ transform: `rotate(${getNoteRotation(wish.id)}deg)` }}
          >
            <span className="dream-guestbook__pin" aria-hidden="true">
              ✦
            </span>
            <p className="dream-guestbook__note-text">{wish.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
