import Phaser from 'phaser'
import type { SceneMarker } from '../../engine/sceneBridge'
import { resolveWorkerArchetype } from './artDirection'
import { getWorkerSpriteSpec } from './pixelSpriteCatalog'
import { ensurePixelSpriteTextures } from './pixelTextureFactory'

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
  private readonly sprite: Phaser.GameObjects.Image
  private readonly shadow: Phaser.GameObjects.Ellipse
  private readonly role: 'dispatcher' | 'executor' | 'auditor'
  private readonly textureBaseKey: string
  private readonly scale: number
  private x: number
  private y: number
  private mode: WorkerMode = 'idle'

  constructor(scene: Phaser.Scene, options: WorkerPrefabOptions) {
    this.id = options.id
    this.label = options.label
    this.x = options.x
    this.y = options.y

    ensurePixelSpriteTextures(scene)

    this.role = resolveWorkerArchetype(this.id).role
    this.textureBaseKey = getWorkerSpriteSpec(this.role).key
    this.scale = 2

    this.shadow = scene.add.ellipse(options.x, options.y + 20, 26, 8, 0x4a3d2d, 0.18)
    this.sprite = scene.add.image(options.x, options.y + 4, this.resolveTextureKey())
    this.sprite.setOrigin(0.5, 1)
    this.sprite.setScale(this.scale)
    this.setDepth()
  }

  setMode(mode: WorkerMode) {
    this.mode = mode
    this.sprite.setTexture(this.resolveTextureKey())
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
    this.shadow.setPosition(x, y + 20)
    this.sprite.setPosition(x, y + 4)
    this.setDepth()
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

  private resolveTextureKey() {
    const state =
      this.mode === 'moving'
        ? 'moving'
        : this.mode === 'reporting'
          ? 'reporting'
          : 'idle'

    return `${this.textureBaseKey}-${state}`
  }

  private setDepth() {
    this.shadow.setDepth(this.y - 2)
    this.sprite.setDepth(this.y + 4)
  }
}
