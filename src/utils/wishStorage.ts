export interface DreamWish {
  id: string
  text: string
  timestamp: number
}

export interface WishStorageAdapter {
  getWishes(): Promise<DreamWish[]> | DreamWish[]
  addWish(text: string): Promise<DreamWish> | DreamWish
}

const GUESTBOOK_STORAGE_KEY = 'pip_dream_wishes_v1'

const SEED_WISHES: DreamWish[] = [
  {
    id: 'seed-1',
    text: 'May the stars stay polite tonight',
    timestamp: 1,
  },
  {
    id: 'seed-2',
    text: 'A warm glass of milk for Pip',
    timestamp: 2,
  },
  {
    id: 'seed-3',
    text: 'Soft pillows for everyone awake',
    timestamp: 3,
  },
]

export class LocalStorageWishAdapter implements WishStorageAdapter {
  getWishes(): DreamWish[] {
    try {
      const raw = localStorage.getItem(GUESTBOOK_STORAGE_KEY)
      if (!raw) return SEED_WISHES
      const parsed = JSON.parse(raw) as DreamWish[]
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_WISHES
    } catch {
      return SEED_WISHES
    }
  }

  addWish(text: string): DreamWish {
    const current = this.getWishes()
    const newWish: DreamWish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: text.slice(0, 80).trim(),
      timestamp: Date.now(),
    }
    const updated = [newWish, ...current].slice(0, 20)
    try {
      localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore in private browsing
    }
    return newWish
  }
}

export const defaultWishAdapter = new LocalStorageWishAdapter()
