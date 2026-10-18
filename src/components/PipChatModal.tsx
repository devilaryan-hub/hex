import { useEffect, useRef, useState } from 'react'
import type { PipState } from '../data/story'

interface PipChatModalProps {
  isOpen: boolean
  onClose: () => void
  onPipStateChange?: (state: PipState) => void
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

interface Message {
  id: string
  sender: 'user' | 'pip'
  text: string
}

interface TopicConfig {
  keywords: string[]
  state: PipState
  replies: string[]
}

const TOPICS: TopicConfig[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon'],
    state: 'happy',
    replies: [
      'Oh! Hello there, human friend! *giggles* Pip was just smoothing out a cloud.',
      'Hi! Did you bring any starry dreams with you tonight?',
      "Hello! *waves tiny hands* It's so quiet and cozy in here, isn't it?",
    ],
  },
  {
    keywords: ['dream', 'nightmare', 'sleep', 'rest'],
    state: 'curious',
    replies: [
      'Dreams are like soft folded paper boats. Pip makes sure they never sink!',
      'Pip tucks gentle dreams behind warm pillows so bad dreams cannot find them.',
      'If you close your eyes, Pip can spin you a dream about floating on warm milk.',
    ],
  },
  {
    keywords: ['lullaby', 'music', 'song', 'box', 'melody', 'sing'],
    state: 'happy',
    replies: [
      '♪ Tink-tank-tink! *sways happily* Music boxes are the clockwork of sleepy hours.',
      'Pip tries to hum, but mostly it sounds like a kettle boiling softly. Do you like it?',
      'Our Lullaby Lab has eight gentle notes. Even the spiders in the corner fall asleep!',
    ],
  },
  {
    keywords: ['star', 'twinkle', 'shine', 'glow', 'sky'],
    state: 'curious',
    replies: [
      'Stars are warm if you hold them very gently with both mittens!',
      'Pip found a floating star earlier! Did you spot where it was hiding in the room?',
      "Pip likes to polish the stars so they don't get dusty before midnight.",
    ],
  },
  {
    keywords: ['name', 'who are you', 'call you'],
    state: 'curious',
    replies: [
      'Pip! Just Pip. Junior Dream Engineer at your service! *curtsies clumsily and nearly drops nightcap*',
      'I am Pip! A very little skull baby with a starry nightcap and a pink bow.',
      "My name is Pip! It's short because long words make me sleepy.",
    ],
  },
  {
    keywords: ['job', 'work', 'engineer', 'build', 'maker', 'do you do'],
    state: 'happy',
    replies: [
      "I build the dreams you fall asleep inside! It's very delicate work with needle and moonlight.",
      'Pip inspects all the midnight rooftops and tests the lullaby frequencies!',
      'Mainly, Pip makes sure the dark stays friendly and soft like velvet.',
    ],
  },
  {
    keywords: ['nightlight', 'lamp', 'light', 'lantern', 'candle'],
    state: 'happy',
    replies: [
      'The bedside lamp keeps away the prickly shadows. Pip keeps it warm.',
      'A little amber light makes any dark room feel like a cozy blanket.',
      "Pip's eye sockets have tiny pinpricks of light—built-in nightlights!",
    ],
  },
  {
    keywords: ['scared', 'afraid', 'fear', 'dark', 'spooky', 'shadow'],
    state: 'sleepy',
    replies: [
      "Don't worry! The dark isn't empty—it's just full of dreams waiting to be opened.",
      '*pats your shoulder softly* Pip is right here. Nothing scary is allowed in the nursery.',
      'Shadows are just soft shapes playing hide-and-seek. Pip promised to guard the door.',
    ],
  },
  {
    keywords: ['sleepy', 'tired', 'yawn', 'exhausted', 'bed', 'nap'],
    state: 'sleepy',
    replies: [
      '*yaaaaawn* Oh no, now Pip is yawning too! Let us get cozy.',
      'Heavy eyelids mean the dream delivery flight is arriving soon. Rest your eyes!',
      'Pip recommends pulling the quilt up to your chin and listening to the music box.',
    ],
  },
  {
    keywords: ['goodnight', 'bye', 'good night', 'farewell', 'see you'],
    state: 'sleepy',
    replies: [
      'Goodnight, kind wanderer. May your pillows be cool and your dreams sweet.',
      'Night-night! Pip will watch over the nursery until morning light.',
      'Sleep tight! *blows a tiny star kiss into the air* See you in the quiet hours.',
    ],
  },
  {
    keywords: ['color', 'favourite', 'favorite', 'hue', 'shade'],
    state: 'happy',
    replies: [
      'Soft amber and midnight blue! And the pink of my nightcap bow, of course!',
      "Cream like warm milk and gold like lantern glows! What's yours?",
      'Midnight lavender! It feels like the color of an almost-asleep whisper.',
    ],
  },
  {
    keywords: ['joke', 'funny', 'laugh', 'humor', 'giggle'],
    state: 'happy',
    replies: [
      'Why did the little star go to school? To get a little brighter! *giggles uncontrollably*',
      'What does Pip sleep on? A skull-illow! *snorts softly* That was silly, was it not?',
      'How do clouds pay for their dreams? With rain-checks! *giggles*',
    ],
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'grateful'],
    state: 'happy',
    replies: [
      "Aww, you're so welcome! *hugs knees* Pip loves having gentle company.",
      'Pip is the one who thanks you for visiting the midnight nursery!',
      "Pip's little heart is all warm now! Thank you for being kind.",
    ],
  },
  {
    keywords: ['cloud', 'fluffy', 'float'],
    state: 'curious',
    replies: [
      'Clouds are super fluffy, but if you sit on one, you sink right into the middle! *giggles*',
      'Pip collects little puffy clouds to use as daytime cushions.',
      'Sometimes a cloud tastes like cold vanilla steam. Pip checked once!',
    ],
  },
  {
    keywords: ['skull', 'bone', 'skeleton', 'head'],
    state: 'happy',
    replies: [
      'My skull is very round and smooth! Like a sleepy polished moon.',
      'People think skulls are spooky, but Pip is 100% cuddle-friendly!',
      "It's nice and sturdy for bumping into doorframes when Pip is clumsy.",
    ],
  },
  {
    keywords: ['toy', 'lamb', 'doll', 'bear', 'plush'],
    state: 'sleepy',
    replies: [
      'The sleepy toy lamb has been dreaming for three hours straight! Shh...',
      'Pip always tucks the plushies in before turning down the lantern.',
      'Toys have their own secret nursery meetings when everyone is asleep.',
    ],
  },
  {
    keywords: ['chimney', 'roof', 'rooftop', 'fly', 'flight'],
    state: 'curious',
    replies: [
      'Flying over the chimneys is breezy! You can smell cinnamon and smoke from fireplaces.',
      "Pip's delivery route has 18 rooftops. Number three has a very sleepy cat!",
      'Make sure to duck when flying under the old telephone wires!',
    ],
  },
  {
    keywords: ['secret', 'hidden', 'easter egg', 'mystery'],
    state: 'curious',
    replies: [
      'Ooh, a secret? Pip loves secrets! Tap on things in the nursery... especially the moon!',
      'There is a tiny star hidden somewhere where nobody looks...',
      '*whispers* If you tap the nursery moon five times, it plays a hidden lullaby!',
    ],
  },
  {
    keywords: ['...', 'quiet', 'silent', 'shh', 'nothing'],
    state: 'curious',
    replies: [
      'Pip hates long silences! *taps fingers rhythmically* Tell me a bedtime story?',
      'Is someone there? *peeks out from nightcap* Pip was getting lonely!',
      'Pip prefers soft whispers to silence. Even a quiet hum is lovely.',
    ],
  },
  {
    keywords: ['cookie', 'milk', 'tea', 'snack', 'eat', 'hungry', 'food'],
    state: 'happy',
    replies: [
      "Warm honey tea and oat biscuits are Pip's favorite midnight snack!",
      'A sip of warm milk before sleep makes dreams fifty percent fluffier.',
      'Pip tried to bake a moon-cookie once, but it drifted out the window! *giggles*',
    ],
  },
]

const FALLBACK_REPLIES = [
  "*tilts skull curiously* Pip hasn't heard about that yet, but it sounds like a lovely bedtime thought!",
  '*yawns softly and blinks* Tell Pip more! Pip is listening with both big eye sockets.',
  '*giggles* You speak such interesting human words! Tell Pip about your favorite dream.',
]

export function PipChatModal({
  isOpen,
  onClose,
  onPipStateChange,
  returnFocusRef,
}: PipChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'pip',
      text: "Hi! *waves nightcap* I'm Pip. Ask me about dreams, stars, lullabies, or tell me anything!",
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastIndexPerTopicRef = useRef<Map<number, number>>(new Map())
  const lastFallbackIndexRef = useRef(-1)

  // Scroll to bottom of message log
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, messages, isTyping])

  // Escape key & focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose, returnFocusRef])

  if (!isOpen) return null

  const matchReply = (rawInput: string): { text: string; state: PipState } => {
    const text = rawInput.toLowerCase().trim()

    // Find matching topic
    for (let topicIdx = 0; topicIdx < TOPICS.length; topicIdx++) {
      const topic = TOPICS[topicIdx]
      const matches = topic.keywords.some((kw) => text.includes(kw))
      if (matches) {
        const prevIdx = lastIndexPerTopicRef.current.get(topicIdx) ?? -1
        let nextIdx = Math.floor(Math.random() * topic.replies.length)
        if (nextIdx === prevIdx && topic.replies.length > 1) {
          nextIdx = (nextIdx + 1) % topic.replies.length
        }
        lastIndexPerTopicRef.current.set(topicIdx, nextIdx)
        return { text: topic.replies[nextIdx], state: topic.state }
      }
    }

    // Fallback
    let nextFallback = Math.floor(Math.random() * FALLBACK_REPLIES.length)
    if (nextFallback === lastFallbackIndexRef.current && FALLBACK_REPLIES.length > 1) {
      nextFallback = (nextFallback + 1) % FALLBACK_REPLIES.length
    }
    lastFallbackIndexRef.current = nextFallback
    return { text: FALLBACK_REPLIES[nextFallback], state: 'curious' }
  }

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    // ~500ms typing indicator
    setTimeout(() => {
      const match = matchReply(trimmed)
      const pipMsg: Message = {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: match.text,
      }
      setMessages((prev) => [...prev, pipMsg])
      setIsTyping(false)
      onPipStateChange?.(match.state)
    }, 520)
  }

  return (
    <div className="pip-chat-overlay" onClick={onClose} role="presentation">
      <div
        className="pip-chat-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pip-chat-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pip-chat__header">
          <div className="pip-chat__title-area">
            <span className="pip-chat__avatar" aria-hidden="true">
              💀✨
            </span>
            <div>
              <h3 id="pip-chat-title" className="pip-chat__title">
                Talk to Pip
              </h3>
              <p className="pip-chat__status">● Always listening in the quiet hours</p>
            </div>
          </div>
          <button
            type="button"
            className="pip-chat__close-btn"
            onClick={onClose}
            aria-label="Close Talk to Pip chat"
          >
            ✕
          </button>
        </div>

        <div className="pip-chat__messages" role="log" aria-live="polite" aria-atomic="false">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`pip-chat__bubble pip-chat__bubble--${msg.sender}`}
            >
              <span className="pip-chat__sender-label" aria-hidden="true">
                {msg.sender === 'pip' ? 'Pip' : 'You'}
              </span>
              <p className="pip-chat__bubble-text">{msg.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="pip-chat__bubble pip-chat__bubble--pip pip-chat__typing" aria-label="Pip is thinking">
              <span className="pip-chat__sender-label" aria-hidden="true">
                Pip
              </span>
              <span className="pip-chat__dots" aria-hidden="true">
                ✦ ✦ ✦
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="pip-chat__input-row" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            className="pip-chat__input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Whisper something to Pip..."
            maxLength={140}
            aria-label="Message to Pip"
          />
          <button
            type="submit"
            className="story-link pip-chat__send-btn"
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message to Pip"
          >
            Send ↗
          </button>
        </form>
      </div>
    </div>
  )
}
