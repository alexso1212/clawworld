import {
  getAllFurnitureSpriteSpecs,
  getAllWorkerSpriteSpecs,
  type PixelSpriteSpec,
} from './pixelSpriteCatalog'

export const PIXEL_ATLAS_KEY = 'clawworld-first-pass-atlas'

export type PixelAtlasEntry = {
  atlasKey: string
  frameKey: string
  spriteKey: string
  frame: string
  width: number
  height: number
  x: number
  y: number
}

const ATLAS_ROW_WIDTH = 256

function collectSpriteSpecs() {
  return [
    ...Object.values(getAllWorkerSpriteSpecs()),
    ...Object.values(getAllFurnitureSpriteSpecs()),
  ]
}

function expandFrames(spec: PixelSpriteSpec) {
  return spec.frames.map((frame) => ({
    spriteKey: spec.key,
    frame,
    width: spec.size.width,
    height: spec.size.height,
  }))
}

const PIXEL_ATLAS_ENTRIES: PixelAtlasEntry[] = collectSpriteSpecs()
  .flatMap(expandFrames)
  .reduce<PixelAtlasEntry[]>((entries, item) => {
    const previous = entries.at(-1)
    const nextX =
      previous && previous.x + previous.width + item.width <= ATLAS_ROW_WIDTH
        ? previous.x + previous.width
        : 0
    const nextY =
      previous == null
        ? 0
        : nextX === 0
          ? previous.y + previous.height
          : previous.y

    entries.push({
      atlasKey: PIXEL_ATLAS_KEY,
      frameKey: `${item.spriteKey}:${item.frame}`,
      spriteKey: item.spriteKey,
      frame: item.frame,
      width: item.width,
      height: item.height,
      x: nextX,
      y: nextY,
    })

    return entries
  }, [])

export function buildPixelAtlasEntries() {
  return PIXEL_ATLAS_ENTRIES
}

export function getPixelAtlasEntry(spriteKey: string, frame: string) {
  return PIXEL_ATLAS_ENTRIES.find(
    (entry) => entry.spriteKey === spriteKey && entry.frame === frame,
  )
}
