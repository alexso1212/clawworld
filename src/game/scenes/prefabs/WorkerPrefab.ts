import Phaser from 'phaser'
import type { SceneMarker } from '../../engine/sceneBridge'

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
  private readonly body: Phaser.GameObjects.Arc
  private readonly caption: Phaser.GameObjects.Text
  private x: number
  private y: number
  private mode: WorkerMode = 'idle'

  constructor(scene: Phaser.Scene, options: WorkerPrefabOptions) {
    this.id = options.id
    this.label = options.label
    this.x = options.x
    this.y = options.y

    this.body = scene.add.circle(options.x, options.y, 14, options.color ?? 0x8fe0ff, 0.95)
    this.body.setStrokeStyle(2, 0xe9f6ff, 0.85)
    this.caption = scene.add.text(options.x - 28, options.y - 34, options.label, {
      color: '#dcecff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '16px',
      fontStyle: '700',
    })
  }

  setMode(mode: WorkerMode) {
    this.mode = mode
    this.body.setFillStyle(mode === 'moving' ? 0xffd36b : mode === 'reporting' ? 0xa6ffbf : 0x8fe0ff)
  }

  moveToward(targetX: number, targetY: number, deltaMs: number, speedPerSecond = 150) {
    const dx = targetX - this.x
    const dy = targetY - this.y
    const distance = Math.hypot(dx, dy)

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
    this.body.setPosition(x, y)
    this.caption.setPosition(x - this.caption.width / 2, y - 34)
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
}
