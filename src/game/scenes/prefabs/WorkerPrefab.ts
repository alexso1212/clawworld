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
  private readonly baseColor: number
  private readonly shadow: Phaser.GameObjects.Ellipse
  private readonly head: Phaser.GameObjects.Arc
  private readonly hair: Phaser.GameObjects.Rectangle
  private readonly body: Phaser.GameObjects.Rectangle
  private readonly tie: Phaser.GameObjects.Rectangle
  private readonly legs: Phaser.GameObjects.Rectangle
  private readonly briefcase: Phaser.GameObjects.Rectangle
  private x: number
  private y: number
  private mode: WorkerMode = 'idle'

  constructor(scene: Phaser.Scene, options: WorkerPrefabOptions) {
    this.id = options.id
    this.label = options.label
    this.baseColor = options.color ?? 0x5e98c7
    this.x = options.x
    this.y = options.y

    this.shadow = scene.add.ellipse(options.x, options.y + 22, 24, 8, 0x6e5d45, 0.22)
    this.head = scene.add.circle(options.x, options.y - 10, 8, 0xfbf2e7, 0.95)
    this.head.setStrokeStyle(1.5, 0x243142, 0.9)
    this.hair = scene.add.rectangle(options.x, options.y - 14, 14, 5, 0x243142, 0.92)
    this.body = scene.add.rectangle(options.x, options.y + 8, 18, 24, this.baseColor, 0.96)
    this.body.setStrokeStyle(1.5, 0x243142, 0.75)
    this.tie = scene.add.rectangle(options.x, options.y + 8, 4, 15, 0xf6ce62, 0.98)
    this.legs = scene.add.rectangle(options.x, options.y + 25, 12, 8, 0x243142, 0.92)
    this.briefcase = scene.add.rectangle(options.x + 12, options.y + 12, 8, 10, 0xd0643f, 0.96)
    this.briefcase.setStrokeStyle(1, 0x243142, 0.6)
  }

  setMode(mode: WorkerMode) {
    this.mode = mode
    this.body.setFillStyle(mode === 'moving' ? 0xffd36b : mode === 'reporting' ? 0xa6ffbf : this.baseColor)
    this.tie.setFillStyle(mode === 'moving' ? 0xd0643f : 0xf6ce62)
    this.briefcase.setFillStyle(mode === 'reporting' ? 0xf4c34f : 0xd0643f)
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
    this.shadow.setPosition(x, y + 22)
    this.head.setPosition(x, y - 10)
    this.hair.setPosition(x, y - 14)
    this.body.setPosition(x, y + 8)
    this.tie.setPosition(x, y + 8)
    this.legs.setPosition(x, y + 25)
    this.briefcase.setPosition(x + 12, y + 12)
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
