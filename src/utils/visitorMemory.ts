export interface VisitorMemory {
  firstVisitTime: number
  visitCount: number
  discoveredItems: string[]
}

const MEMORY_KEY = 'pip_visitor_memory'

export function getVisitorMemory(): VisitorMemory | null {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    if (!raw) return null
    return JSON.parse(raw) as VisitorMemory
  } catch {
    return null
  }
}

export function saveVisitorMemory(memory: VisitorMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
  } catch {
    // Ignore in private browsing mode
  }
}

export function recordVisit(): { isReturnVisit: boolean; visitCount: number; greeting: string } {
  const existing = getVisitorMemory()
  if (!existing) {
    const newMemory: VisitorMemory = {
      firstVisitTime: Date.now(),
      visitCount: 1,
      discoveredItems: [],
    }
    saveVisitorMemory(newMemory)
    return { isReturnVisit: false, visitCount: 1, greeting: '' }
  }

  const updatedCount = existing.visitCount + 1
  const updatedMemory: VisitorMemory = {
    ...existing,
    visitCount: updatedCount,
  }
  saveVisitorMemory(updatedMemory)

  let greeting = 'Welcome back! Pip kept the lamp on for you.'
  if (updatedCount >= 5) {
    greeting = 'A true friend of the midnight nursery. Pip has saved your favorite dreams.'
  } else if (updatedCount >= 3) {
    greeting = 'Pip remembers you! The stars seemed brighter when you returned.'
  }

  return { isReturnVisit: true, visitCount: updatedCount, greeting }
}

export function recordDiscoveredItem(itemId: string): void {
  const existing = getVisitorMemory()
  if (!existing) return
  if (!existing.discoveredItems.includes(itemId)) {
    existing.discoveredItems.push(itemId)
    saveVisitorMemory(existing)
  }
}
