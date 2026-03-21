import Phaser from 'phaser'
import type { SceneMarker } from '../../engine/sceneBridge'
import { resolveWorkerArchetype } from './artDirection'

type WorkerMode = 'idle' | 'moving' | 'working' | 'reporting'

type WorkerPrefabOptions = {
  id: string
  label: string
  x: number
  y: number
  color?: number
}

const SCENE_WIDTH = 1280
const SCENE_HEIGHT = 720

export class WorkerPrefab {
  private readonly id: string
  private readonly label: string
  private readonly sprite: Phaser.GameObjects.Graphics
  private readonly shadow: Phaser.GameObjects.Ellipse
  private readonly overrideColor?: number
  private x: number
  private y: number
  private facing: 1 | -1 = 1
  private mode: WorkerMode = 'idle'

  constructor(scene: Phaser.Scene, options: WorkerPrefabOptions) {
    this.id = options.id
    this.label = options.label
    this.overrideColor = options.color
    this.x = options.x
    this.y = options.y

    this.shadow = scene.add.ellipse(options.x, options.y + 21, 30, 10, 0x4a3d2d, 0.18)
    this.sprite = scene.add.graphics()
    this.redraw()
  }

  setMode(mode: WorkerMode) {
    this.mode = mode
    this.redraw()
  }

  moveToward(targetX: number, targetY: number, deltaMs: number, speedPerSecond = 150) {
    const dx = targetX - this.x
    const dy = targetY - this.y
    const distance = Math.hypot(dx, dy)

    if (Math.abs(dx) > 0.25) {
      this.facing = dx >= 0 ? 1 : -1
    }

    if (distance < 0.001) {
      this.setPosition(targetX, targetY)
      return true
    }

    const step = (speedPerSecond * deltaMs) / 1000
    if (step >= distance) {
      this.setPosition(targetX, targetY)
      return true
    }

    this.setPosition(this.x + (dx / distance) * step, this.y + (dy / distance) * step)
    return false
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.shadow.setPosition(x, y + 21)
    this.redraw()
  }

  toMarker(): SceneMarker {
    return {
      id: `worker-${this.id}`,
      label: this.label,
      x: (this.x / SCENE_WIDTH) * 100,
      y: (this.y / SCENE_HEIGHT) * 100,
      variant: this.mode === 'reporting' ? 'delivery' : 'worker',
    }
  }

  private redraw() {
    const archetype = resolveWorkerArchetype(this.id)
    const palette = {
      ...archetype.palette,
      shirt:
        this.mode === 'moving'
          ? lighten(archetype.palette.shirt, 0.12)
          : this.overrideColor ?? archetype.palette.shirt,
      accent:
        this.mode === 'reporting'
          ? lighten(archetype.palette.accent, 0.12)
          : archetype.palette.accent,
      prop:
        this.mode === 'reporting'
          ? lighten(archetype.palette.prop, 0.1)
          : archetype.palette.prop,
    }

    const g = this.sprite
    g.clear()

    const lift = this.mode === 'moving' ? -2 : this.mode === 'reporting' ? -1 : 0
    const lean = this.mode === 'moving' ? this.facing * 2 : 0
    const stride = this.mode === 'moving' ? 1 : 0
    const baseX = Math.round(this.x) - 14
    const baseY = Math.round(this.y) - 31 + lift
    const pixel = (ox: number, oy: number, width: number, height: number, color: number, alpha = 1) => {
      g.fillStyle(color, alpha)
      g.fillRect(baseX + ox, baseY + oy, width, height)
    }

    this.shadow.setAlpha(this.mode === 'moving' ? 0.14 : 0.18)

    pixel(8 + lean, 0, 16, 14, palette.outline)
    pixel(9 + lean, 1, 14, 12, palette.skin)
    pixel(8 + lean, 0, 16, 4, palette.hair)
    pixel(8 + lean, 4, 2, 4, palette.hair)
    pixel(22 + lean, 4, 2, 4, palette.hair)
    pixel(21 + lean, 2, 2, 8, palette.rim, 0.72)

    pixel(7 + lean, 15, 18, 14, palette.outline)
    pixel(8 + lean, 16, 16, 12, palette.shirt)
    pixel(11 + lean, 29, 4, 8, palette.outline)
    pixel(18 + lean, 29, 4, 8, palette.outline)
    pixel(12 + lean - stride, 29, 2, 8, palette.outline)
    pixel(19 + lean + stride, 29, 2, 8, palette.outline)
    pixel(12 + lean, 16, 2, 10, palette.skin)
    pixel(19 + lean, 16, 2, 10, palette.skin)
    pixel(8 + lean, 16, 2, 10, palette.shirt)
    pixel(22 + lean, 16, 2, 10, palette.shirt)
    pixel(9 + lean, 16, 14, 1, palette.rim, 0.65)

    switch (archetype.role) {
      case 'dispatcher':
        pixel(7 + lean, 3, 2, 6, palette.accent)
        pixel(6 + lean, 4, 1, 4, palette.accent)
        pixel(14 + lean, 18, 4, 9, palette.accent)
        this.drawClipboard(pixel, baseX, baseY, lean)
        break
      case 'auditor':
        pixel(11 + lean, 6, 4, 2, palette.outline)
        pixel(17 + lean, 6, 4, 2, palette.outline)
        pixel(15 + lean, 7, 2, 1, palette.outline)
        pixel(12 + lean, 18, 8, 4, palette.accent)
        this.drawMug(pixel, baseX, baseY, lean)
        break
      default:
        pixel(15 + lean, 17, 2, 11, palette.accent)
        pixel(14 + lean, 28, 4, 3, palette.accent)
        pixel(10 + lean, 17, 1, 5, palette.skin)
        pixel(21 + lean, 17, 1, 5, palette.skin)
        this.drawBriefcase(pixel, baseX, baseY, lean)
        break
    }

    if (this.mode === 'reporting') {
      pixel(18 + lean, -8, 3, 8, palette.accent)
      pixel(18 + lean, -11, 3, 3, palette.accent)
    }
  }

  private drawClipboard(
    pixel: (ox: number, oy: number, width: number, height: number, color: number, alpha?: number) => void,
    _baseX: number,
    _baseY: number,
    lean: number,
  ) {
    const handX = this.facing === 1 ? 23 : 1
    pixel(handX + lean, 20, 6, 10, 0xe3d09a)
    pixel(handX + lean + 1, 21, 4, 8, 0xfff6d6)
    pixel(handX + lean + 2, 18, 2, 2, 0x243142)
  }

  private drawBriefcase(
    pixel: (ox: number, oy: number, width: number, height: number, color: number, alpha?: number) => void,
    _baseX: number,
    _baseY: number,
    lean: number,
  ) {
    const caseX = this.facing === 1 ? 23 : 1
    pixel(caseX + lean, 22, 8, 8, 0x4f6873)
    pixel(caseX + lean + 1, 20, 4, 2, 0xaacfd8)
    pixel(caseX + lean + 5, 23, 2, 1, 0xe8ecee)
  }

  private drawMug(
    pixel: (ox: number, oy: number, width: number, height: number, color: number, alpha?: number) => void,
    _baseX: number,
    _baseY: number,
    lean: number,
  ) {
    const mugX = this.facing === 1 ? 23 : 2
    pixel(mugX + lean, 21, 6, 7, 0xefe6d6)
    pixel(mugX + lean + 5, 23, 2, 3, 0xb78567)
    pixel(mugX + lean + 1, 22, 3, 1, 0xffffff)
  }
}

function lighten(color: number, amount: number) {
  const r = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const b = color & 0xff

  const nextChannel = (channel: number) => Math.min(255, Math.round(channel + (255 - channel) * amount))

  return (nextChannel(r) << 16) | (nextChannel(g) << 8) | nextChannel(b)
}
