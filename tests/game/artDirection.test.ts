import { describe, expect, it } from 'vitest'
import {
  resolveInteractiveHotspot,
  resolveWorkerArchetype,
} from '../../src/game/scenes/prefabs/artDirection'

describe('art direction helpers', () => {
  it('maps the three office workers to distinct role silhouettes', () => {
    expect(resolveWorkerArchetype('amane')).toMatchObject({
      role: 'dispatcher',
      accessories: ['headset', 'clipboard'],
    })
    expect(resolveWorkerArchetype('executor')).toMatchObject({
      role: 'executor',
      accessories: ['lanyard', 'briefcase'],
    })
    expect(resolveWorkerArchetype('reviewer')).toMatchObject({
      role: 'auditor',
      accessories: ['glasses', 'mug'],
    })
  })

  it('gives board and support objects full-surface hit areas instead of pin-sized hotspots', () => {
    expect(resolveInteractiveHotspot('portal-website-refresh')).toMatchObject({
      shape: 'rect',
      width: 220,
      height: 112,
    })
    expect(resolveInteractiveHotspot('meeting-whiteboard')).toMatchObject({
      shape: 'rect',
      width: 148,
      height: 88,
    })
    expect(resolveInteractiveHotspot('signal-finance')).toMatchObject({
      shape: 'rect',
      width: 74,
      height: 54,
    })
  })
})
