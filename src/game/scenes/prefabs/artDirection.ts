import type { SceneMarker } from '../../engine/sceneBridge'

export type WorkerRole = 'dispatcher' | 'executor' | 'auditor'

export type WorkerArchetype = {
  role: WorkerRole
  accessories: string[]
  palette: {
    outline: number
    rim: number
    skin: number
    hair: number
    shirt: number
    accent: number
    prop: number
    propHighlight: number
  }
}

export type InteractiveHotspot = {
  shape: 'rect'
  width: number
  height: number
}

const DEFAULT_WORKER: WorkerArchetype = {
  role: 'executor',
  accessories: ['lanyard', 'briefcase'],
  palette: {
    outline: 0x443526,
    rim: 0xfff7e7,
    skin: 0xf3dfc8,
    hair: 0x5a4534,
    shirt: 0xe8ecee,
    accent: 0xc95d39,
    prop: 0x4f6873,
    propHighlight: 0xaacfd8,
  },
}

const HOTSPOTS: Record<string, InteractiveHotspot> = {
  'portal-website-refresh': { shape: 'rect', width: 220, height: 112 },
  'meeting-whiteboard': { shape: 'rect', width: 148, height: 88 },
  'boss-whiteboard': { shape: 'rect', width: 126, height: 78 },
  'signal-finance': { shape: 'rect', width: 74, height: 54 },
  'signal-route': { shape: 'rect', width: 86, height: 54 },
  'signal-tool': { shape: 'rect', width: 88, height: 64 },
  'abnormality-register': { shape: 'rect', width: 92, height: 56 },
  'return-main-office': { shape: 'rect', width: 168, height: 42 },
}

export function resolveWorkerArchetype(id: string): WorkerArchetype {
  const normalized = id.toLowerCase()

  if (normalized.includes('amane')) {
    return {
      role: 'dispatcher',
      accessories: ['headset', 'clipboard'],
      palette: {
        outline: 0x3f3124,
        rim: 0xfff7df,
        skin: 0xf5dfc8,
        hair: 0x233248,
        shirt: 0x7fb4da,
        accent: 0x243142,
        prop: 0xe6d39a,
        propHighlight: 0xfff4cf,
      },
    }
  }

  if (normalized.includes('review')) {
    return {
      role: 'auditor',
      accessories: ['glasses', 'mug'],
      palette: {
        outline: 0x442d21,
        rim: 0xfff0dc,
        skin: 0xf3d8bf,
        hair: 0x4b3528,
        shirt: 0xb78567,
        accent: 0xf2c763,
        prop: 0xefe6d6,
        propHighlight: 0xffffff,
      },
    }
  }

  return DEFAULT_WORKER
}

export function resolveInteractiveHotspot(id: string): InteractiveHotspot {
  if (id.startsWith('task-room-')) {
    return { shape: 'rect', width: 216, height: 112 }
  }

  return HOTSPOTS[id] ?? { shape: 'rect', width: 52, height: 40 }
}

export function withInteractiveHotspot(
  marker: SceneMarker,
  sceneWidth: number,
  sceneHeight: number,
): SceneMarker {
  const hotspot = resolveInteractiveHotspot(marker.id)

  return {
    ...marker,
    interactive: true,
    labelMode: 'hover',
    width: Number(((hotspot.width / sceneWidth) * 100).toFixed(2)),
    height: Number(((hotspot.height / sceneHeight) * 100).toFixed(2)),
  }
}
