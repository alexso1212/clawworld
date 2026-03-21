import Phaser from 'phaser'
import {
  getAllFurnitureSpriteSpecs,
  getAllWorkerSpriteSpecs,
  type FurnitureSpriteId,
  type PixelSpriteSpec,
  type WorkerSpriteId,
} from './pixelSpriteCatalog'

const WORKER_ROLES = ['dispatcher', 'executor', 'auditor'] as const satisfies WorkerSpriteId[]
const FURNITURE_KEYS = [
  'task-board',
  'meeting-whiteboard',
  'boss-whiteboard',
  'desk-cluster',
  'archive-cabinet',
  'tea-bar',
  'finance-safe',
  'tool-locker',
  'requirements-desk',
  'planning-table',
  'execution-workbench',
  'review-pedestal',
  'memory-archive',
] as const satisfies FurnitureSpriteId[]

type PixelPainter = {
  block: (x: number, y: number, width: number, height: number, color: string) => void
  dot: (x: number, y: number, color: string) => void
}

export function ensurePixelSpriteTextures(scene: Phaser.Scene) {
  for (const role of WORKER_ROLES) {
    const spec = getAllWorkerSpriteSpecs()[role]
    for (const frame of spec.frames) {
      const textureKey = `${spec.key}-${frame}`
      ensureTexture(scene, textureKey, spec.size.width, spec.size.height, (painter) => {
        drawWorkerSprite(painter, role, frame)
      })
    }
  }

  for (const key of FURNITURE_KEYS) {
    const spec = getAllFurnitureSpriteSpecs()[key]
    for (const frame of spec.frames) {
      const textureKey = `${spec.key}-${frame}`
      ensureTexture(scene, textureKey, spec.size.width, spec.size.height, (painter) => {
        drawFurnitureSprite(painter, key, frame, spec)
      })
    }
  }
}

function ensureTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (painter: PixelPainter) => void,
) {
  if (scene.textures.exists(key)) {
    return
  }

  const texture = scene.textures.createCanvas(key, width, height)
  if (!texture) {
    return
  }
  const context = texture.context
  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, width, height)

  const painter: PixelPainter = {
    block(x, y, blockWidth, blockHeight, color) {
      context.fillStyle = color
      context.fillRect(x, y, blockWidth, blockHeight)
    },
    dot(x, y, color) {
      context.fillStyle = color
      context.fillRect(x, y, 1, 1)
    },
  }

  draw(painter)
  texture.refresh()
}

function drawWorkerSprite(painter: PixelPainter, role: WorkerSpriteId, frame: string) {
  const skin = '#f3dbc3'
  const outline = '#433123'
  const rim = '#fff6e7'
  const moving = frame === 'moving'
  const reporting = frame === 'reporting'
  const lean = moving ? 1 : 0
  const stride = moving ? 1 : 0

  painter.block(6 + lean, 3, 12, 10, outline)
  painter.block(7 + lean, 4, 10, 8, skin)
  painter.block(6 + lean, 3, 12, 3, role === 'dispatcher' ? '#233248' : role === 'auditor' ? '#4b3528' : '#5a4534')
  painter.block(17 + lean, 4, 1, 7, rim)

  const shirt =
    role === 'dispatcher' ? '#7fb4da' : role === 'auditor' ? '#b7a6a0' : '#8aaea8'
  painter.block(6 + lean, 14, 12, 9, outline)
  painter.block(7 + lean, 15, 10, 7, shirt)
  painter.block(10 + lean, 23, 2, 7, outline)
  painter.block(13 + lean, 23, 2, 7, outline)
  painter.block(10 + lean - stride, 23, 2, 7, outline)
  painter.block(14 + lean + stride, 23, 2, 7, outline)

  if (role === 'dispatcher') {
    painter.block(5 + lean, 5, 1, 5, '#243142')
    painter.block(4 + lean, 6, 1, 3, '#243142')
    painter.block(10 + lean, 16, 3, 6, '#243142')
    painter.block(18 + lean, 17, 4, 7, '#e9d59d')
    painter.block(19 + lean, 18, 2, 5, '#fff4cf')
    painter.block(19 + lean, 16, 1, 1, '#243142')
  } else if (role === 'auditor') {
    painter.block(8 + lean, 7, 3, 1, outline)
    painter.block(12 + lean, 7, 3, 1, outline)
    painter.dot(11 + lean, 7, outline)
    painter.block(10 + lean, 15, 3, 6, '#f2c763')
    painter.block(18 + lean, 18, 3, 5, '#efe6d6')
    painter.block(20 + lean, 19, 1, 2, '#b78567')
  } else {
    painter.block(11 + lean, 15, 2, 7, '#d0643f')
    painter.block(10 + lean, 22, 4, 2, '#d0643f')
    painter.block(7 + lean, 16, 1, 4, skin)
    painter.block(17 + lean, 17, 5, 6, '#4f6873')
    painter.block(18 + lean, 18, 3, 4, '#aacfd8')
    painter.dot(20 + lean, 19, '#fff5df')
  }

  if (reporting) {
    painter.block(10 + lean, 0, 2, 5, '#d0643f')
    painter.block(10 + lean, 0, 2, 1, '#f7d48b')
  }
}

function drawFurnitureSprite(
  painter: PixelPainter,
  key: FurnitureSpriteId,
  frame: string,
  spec: PixelSpriteSpec,
) {
  switch (key) {
    case 'task-board':
      painter.block(2, 6, 60, 38, '#8a643f')
      painter.block(5, 9, 54, 32, '#ffefbf')
      painter.block(4, 44, 6, 4, '#6a5741')
      painter.block(54, 44, 6, 4, '#6a5741')
      paintNotes(painter, frame === 'busy')
      break
    case 'meeting-whiteboard':
      painter.block(6, 5, 36, 20, '#fafdff')
      painter.block(4, 3, 40, 24, '#9cb7b5')
      painter.block(18, 27, 8, 4, '#d5e3de')
      painter.block(20, 31, 4, 1, '#c3d6d4')
      painter.block(9, 13, 18, 2, '#d0643f')
      painter.block(28, 13, 8, 2, '#2a7b74')
      if (frame === 'active') {
        painter.block(32, 9, 2, 8, '#f2c763')
      }
      break
    case 'boss-whiteboard':
      painter.block(5, 5, 38, 22, '#8d6748')
      painter.block(8, 8, 32, 16, '#fffaf1')
      painter.block(8, 27, 4, 5, '#8d6748')
      painter.block(36, 27, 4, 5, '#8d6748')
      painter.block(13, 12, 7, 2, '#f2c763')
      painter.block(22, 12, 5, 2, '#f2c763')
      painter.block(16, 17, 14, 2, '#c87046')
      if (frame === 'active') {
        painter.block(35, 9, 3, 8, '#243142')
      }
      break
    case 'desk-cluster':
      painter.block(4, 10, 40, 16, '#eadcc8')
      painter.block(8, 4, 12, 7, '#98d5e8')
      painter.block(24, 4, 12, 7, '#98d5e8')
      painter.block(12, 26, 8, 5, '#f2b874')
      painter.block(28, 26, 8, 5, '#f2b874')
      if (frame === 'busy') {
        painter.block(10, 6, 8, 3, '#c9fbff')
        painter.block(26, 6, 8, 3, '#c9fbff')
      }
      break
    case 'archive-cabinet':
      painter.block(6, 2, 20, 44, '#7b8b6b')
      for (let y = 6; y <= 34; y += 10) {
        painter.block(9, y, 14, 7, '#92a180')
        painter.block(10, y + 1, 3, 2, '#f5f0de')
        painter.block(18, y + 2, 3, 2, '#d1b47f')
      }
      if (frame === 'open') {
        painter.block(24, 24, 6, 8, '#92a180')
      }
      break
    case 'tea-bar':
      painter.block(4, 16, 40, 12, '#f2e7d5')
      painter.block(6, 13, 12, 3, '#d7bea0')
      painter.block(26, 8, 8, 8, '#243142')
      painter.block(35, 10, 4, 6, '#89b481')
      painter.block(10, 8, 6, 6, '#fff7ed')
      if (frame === 'steaming') {
        painter.dot(12, 6, '#fffdf7')
        painter.dot(14, 4, '#fffdf7')
        painter.dot(16, 6, '#fffdf7')
      }
      break
    case 'finance-safe':
      painter.block(5, 6, 22, 22, '#243142')
      painter.block(8, 10, 16, 14, '#314659')
      painter.block(10, 14, 6, 6, '#f4c34f')
      painter.block(18, 14, 3, 3, '#d9b650')
      painter.block(22, 8, 4, 4, frame === 'warning' ? '#d0643f' : '#89b481')
      break
    case 'tool-locker':
      painter.block(6, 2, 20, 42, '#51778b')
      painter.block(8, 6, 16, 8, '#6a8ea0')
      painter.block(8, 17, 16, 8, '#6a8ea0')
      painter.block(8, 28, 16, 8, '#6a8ea0')
      painter.block(4, 8, 2, 8, '#d7caa7')
      if (frame === 'open') {
        painter.block(24, 18, 6, 12, '#6a8ea0')
      }
      break
    case 'requirements-desk':
      painter.block(4, 16, 24, 12, '#7e5c3d')
      painter.block(6, 9, 8, 7, '#fff6df')
      painter.block(14, 11, 8, 7, '#fff6df')
      painter.block(22, 8, 5, 8, '#89b481')
      if (frame === 'processing') {
        painter.dot(17, 7, '#d0643f')
      }
      break
    case 'planning-table':
      painter.block(8, 10, 32, 16, '#7b5d44')
      painter.block(18, 8, 12, 12, frame === 'projecting' ? '#f4c34f' : '#d9c9ab')
      painter.block(20, 12, 8, 4, '#fff6df')
      break
    case 'execution-workbench':
      painter.block(6, 18, 36, 16, '#4d5661')
      painter.block(6, 16, 36, 2, '#f2c763')
      painter.block(12, 8, 12, 8, '#98d5e8')
      painter.block(28, 9, 8, 7, '#d0643f')
      painter.block(36, 12, 4, 10, '#7d8892')
      if (frame === 'active') {
        painter.dot(30, 6, '#f8f1d0')
        painter.dot(32, 4, '#f8f1d0')
      }
      break
    case 'review-pedestal':
      painter.block(10, 14, 12, 14, '#9da5af')
      painter.block(7, 9, 18, 7, '#eef3f1')
      painter.block(9, 11, 14, 3, reviewColor(frame))
      break
    case 'memory-archive':
      painter.block(10, 20, 12, 8, '#ad7a49')
      painter.block(9, 6, 14, 16, '#49566a')
      painter.block(10, 7, 12, 14, frame === 'storing' ? '#b699ff' : '#74698d')
      painter.block(12, 10, 8, 8, frame === 'storing' ? '#e7deff' : '#978caa')
      break
    default:
      painter.block(0, 0, spec.size.width, spec.size.height, '#d0643f')
      break
  }
}

function paintNotes(painter: PixelPainter, busy: boolean) {
  const notes = [
    { x: 9, y: 14, color: '#f6ce62' },
    { x: 18, y: 16, color: '#f0a167' },
    { x: 28, y: 13, color: '#d0643f' },
    { x: 40, y: 16, color: '#8bc7be' },
    { x: 48, y: 20, color: '#fff7ed' },
  ]

  for (const note of notes) {
    painter.block(note.x, note.y, 6, 6, note.color)
  }

  if (busy) {
    painter.dot(42, 10, '#fff7ed')
    painter.dot(50, 11, '#fff7ed')
    painter.dot(53, 13, '#fff7ed')
  }
}

function reviewColor(frame: string) {
  if (frame === 'pass') {
    return '#89b481'
  }
  if (frame === 'fail') {
    return '#d0643f'
  }
  return '#f2c763'
}
