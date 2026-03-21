import type { TriageCard } from './types'

export function createTriageCard(card: TriageCard): TriageCard {
  return { ...card }
}
