import { describe, expect, it } from 'vitest'
import {
  getFurnitureSpriteSpec,
  getWorkerSpriteSpec,
} from '../../src/game/scenes/prefabs/pixelSpriteCatalog'

describe('pixel sprite catalog', () => {
  it('covers the first-pass office furniture that should read without labels', () => {
    expect(getFurnitureSpriteSpec('task-board')).toMatchObject({
      size: { width: 64, height: 48 },
      frames: ['idle', 'busy'],
    })
    expect(getFurnitureSpriteSpec('meeting-whiteboard')).toMatchObject({
      size: { width: 48, height: 32 },
      frames: ['idle', 'active'],
    })
    expect(getFurnitureSpriteSpec('boss-whiteboard')).toMatchObject({
      size: { width: 48, height: 32 },
      frames: ['idle', 'active'],
    })
    expect(getFurnitureSpriteSpec('finance-safe')).toMatchObject({
      size: { width: 32, height: 32 },
      frames: ['healthy', 'warning'],
    })
    expect(getFurnitureSpriteSpec('tool-locker')).toMatchObject({
      size: { width: 32, height: 48 },
      frames: ['closed', 'open'],
    })
  })

  it('defines distinct worker sprite sheets for dispatcher, executor, and auditor', () => {
    expect(getWorkerSpriteSpec('dispatcher')).toMatchObject({
      size: { width: 24, height: 32 },
      frames: ['idle', 'moving', 'reporting'],
    })
    expect(getWorkerSpriteSpec('executor')).toMatchObject({
      size: { width: 24, height: 32 },
      frames: ['idle', 'moving', 'reporting'],
    })
    expect(getWorkerSpriteSpec('auditor')).toMatchObject({
      size: { width: 24, height: 32 },
      frames: ['idle', 'moving', 'reporting'],
    })
  })
})
