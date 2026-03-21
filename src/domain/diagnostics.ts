import type { Abnormality, TriageCard } from './types'

export function createTriageCard(card: TriageCard): TriageCard {
  return { ...card }
}

const ABNORMALITY_LIBRARY: Record<string, TriageCard> = {
  'bridge-down': {
    code: 'bridge-down',
    objectId: 'bridge-alpha',
    title: 'Bridge Alpha unavailable',
    whatHappened: 'Internal bridge route is unavailable',
    impact: 'Execution desk reroutes to the public line and slows down',
    firstCheck: 'Inspect bridge service health',
  },
  'finance-low': {
    code: 'finance-low',
    objectId: 'finance-room',
    title: 'Office reserve is tightening',
    whatHappened: 'Model budget is running low',
    impact: 'Expensive routes may be delayed or downgraded',
    firstCheck: 'Inspect finance reserve balance',
  },
  'tool-locker-blocked': {
    code: 'tool-locker-blocked',
    objectId: 'tool-locker',
    title: 'Tool locker retrieval blocked',
    whatHappened: 'A required tool locker cannot hand out equipment',
    impact: 'Tasks needing that locker queue at the pickup point',
    firstCheck: 'Inspect tool locker state and connector health',
  },
}

export function createAbnormality(code: keyof typeof ABNORMALITY_LIBRARY): Abnormality {
  return {
    id: code,
    marker: '!',
    triageCard: createTriageCard(ABNORMALITY_LIBRARY[code]),
  }
}
