import { describe, expect, it } from 'vitest'
import {
  PIXEL_ATLAS_KEY,
  buildPixelAtlasEntries,
  getPixelAtlasEntry,
} from '../../src/game/scenes/prefabs/pixelAtlasManifest'

describe('pixel atlas manifest', () => {
  it('assigns all first-pass sprites to one shared atlas', () => {
    const entries = buildPixelAtlasEntries()

    expect(entries.length).toBeGreaterThan(20)
    expect(new Set(entries.map((entry) => entry.atlasKey))).toEqual(new Set([PIXEL_ATLAS_KEY]))
  })

  it('exposes stable frame names and geometry for sprite lookup', () => {
    expect(getPixelAtlasEntry('char-amane-dispatcher', 'idle')).toMatchObject({
      atlasKey: PIXEL_ATLAS_KEY,
      frameKey: 'char-amane-dispatcher:idle',
      width: 24,
      height: 32,
    })

    expect(getPixelAtlasEntry('prop-task-board', 'busy')).toMatchObject({
      atlasKey: PIXEL_ATLAS_KEY,
      frameKey: 'prop-task-board:busy',
      width: 64,
      height: 48,
    })
  })
})
