import Phaser from 'phaser'
import { getFurnitureSpriteSpec } from './pixelSpriteCatalog'
import { ensurePixelSpriteTextures } from './pixelTextureFactory'

type TaskRoomStyle = {
  shell: number
  shellShadow: number
  accent: number
  surface: number
}

function resolveRoomStyle(label: string): TaskRoomStyle {
  switch (label) {
    case 'Reception':
      return { shell: 0xf0e2c6, shellShadow: 0xd7c1a0, accent: 0xd98b4e, surface: 0xfff6e7 }
    case 'Amane Desk':
      return { shell: 0xe7dbc7, shellShadow: 0xcdb79a, accent: 0x2d3d50, surface: 0xf7f0e4 }
    case 'Requirements Room':
      return { shell: 0xe4d7b8, shellShadow: 0xcbba90, accent: 0x89b481, surface: 0xf8f0dd }
    case 'Planning Room':
      return { shell: 0xe8d6c9, shellShadow: 0xcfae9b, accent: 0xd0643f, surface: 0xfff4e5 }
    case 'Execution Workshop':
      return { shell: 0xdad6c7, shellShadow: 0xbcb39e, accent: 0x243142, surface: 0xf5eee0 }
    case 'Review Checkpoint':
      return { shell: 0xe5dccf, shellShadow: 0xcbb89f, accent: 0xb44432, surface: 0xf8efe3 }
    case 'Memory Archive':
      return { shell: 0xe7d7bb, shellShadow: 0xc9ae7d, accent: 0xa68d57, surface: 0xf8f1e3 }
    default:
      return { shell: 0xeadcc8, shellShadow: 0xcdb89a, accent: 0x2a7b74, surface: 0xfff7ed }
  }
}

export class TaskRoomPrefab {
  private readonly scene: Phaser.Scene
  private readonly x: number
  private readonly y: number
  private readonly label: string

  constructor(scene: Phaser.Scene, x: number, y: number, label: string) {
    this.scene = scene
    this.x = x
    this.y = y
    this.label = label
  }

  draw() {
    ensurePixelSpriteTextures(this.scene)
    const style = resolveRoomStyle(this.label)
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(style.shellShadow, 0.45)
    graphics.fillRect(this.x + 10, this.y + 96, 214, 18)
    graphics.fillStyle(style.shell, 1)
    graphics.fillRect(this.x, this.y, 214, 108)
    graphics.fillStyle(style.surface, 1)
    graphics.fillRect(this.x + 12, this.y + 14, 190, 82)
    graphics.fillStyle(style.accent, 0.9)
    graphics.fillRect(this.x + 18, this.y + 18, 70, 10)
    graphics.fillRect(this.x + 126, this.y + 18, 58, 10)
    graphics.fillStyle(0xfff8ec, 0.75)
    graphics.fillRect(this.x + 18, this.y + 28, 12, 2)
    graphics.fillRect(this.x + 34, this.y + 28, 20, 2)
    graphics.fillStyle(style.shellShadow, 0.25)
    graphics.fillRect(this.x + 18, this.y + 86, 170, 4)

    switch (this.label) {
      case 'Reception':
        this.drawReception(graphics, style)
        break
      case 'Amane Desk':
        this.drawAmaneDesk(graphics, style)
        break
      case 'Requirements Room':
        this.drawRequirements(graphics, style)
        break
      case 'Planning Room':
        this.drawPlanning(graphics, style)
        break
      case 'Execution Workshop':
        this.drawExecution(graphics, style)
        break
      case 'Review Checkpoint':
        this.drawReview(graphics, style)
        break
      case 'Memory Archive':
        this.drawMemory(graphics, style)
        break
      default:
        break
    }
  }

  private drawReception(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 0.8)
    graphics.fillRect(this.x + 34, this.y + 48, 112, 22)
    graphics.fillStyle(0xfff3cc, 1)
    graphics.fillRect(this.x + 154, this.y + 44, 26, 30)
    graphics.fillStyle(0xf2b874, 1)
    graphics.fillRect(this.x + 44, this.y + 34, 18, 12)
    graphics.fillRect(this.x + 68, this.y + 34, 14, 12)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRect(this.x + 160, this.y + 38, 14, 4)
  }

  private drawAmaneDesk(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 1)
    graphics.fillRect(this.x + 30, this.y + 42, 52, 32)
    graphics.fillRect(this.x + 88, this.y + 42, 52, 32)
    graphics.fillStyle(0x98d5e8, 1)
    graphics.fillRect(this.x + 34, this.y + 30, 20, 10)
    graphics.fillRect(this.x + 92, this.y + 30, 20, 10)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRect(this.x + 154, this.y + 50, 18, 20)
    graphics.fillStyle(0xf7e7ca, 1)
    graphics.fillRect(this.x + 146, this.y + 30, 22, 12)
    graphics.fillStyle(0xfff8ec, 1)
    graphics.fillRect(this.x + 149, this.y + 33, 8, 2)
  }

  private drawRequirements(_graphics: Phaser.GameObjects.Graphics, _style: TaskRoomStyle) {
    this.placeFurniture('requirements-desk', 'processing', this.x + 108, this.y + 84, 4)
  }

  private drawPlanning(_graphics: Phaser.GameObjects.Graphics, _style: TaskRoomStyle) {
    this.placeFurniture('planning-table', 'projecting', this.x + 106, this.y + 82, 3)
  }

  private drawExecution(_graphics: Phaser.GameObjects.Graphics, _style: TaskRoomStyle) {
    this.placeFurniture('execution-workbench', 'active', this.x + 108, this.y + 96, 2)
  }

  private drawReview(graphics: Phaser.GameObjects.Graphics, _style: TaskRoomStyle) {
    this.placeFurniture('review-pedestal', 'fail', this.x + 162, this.y + 78, 2)
    graphics.fillStyle(0xcbb89f, 1)
    graphics.fillRect(this.x + 54, this.y + 72, 68, 8)
  }

  private drawMemory(graphics: Phaser.GameObjects.Graphics, _style: TaskRoomStyle) {
    graphics.fillStyle(0xa68d57, 1)
    graphics.fillRect(this.x + 28, this.y + 34, 14, 44)
    graphics.fillRect(this.x + 48, this.y + 34, 14, 44)
    graphics.fillRect(this.x + 68, this.y + 34, 14, 44)
    graphics.fillRect(this.x + 88, this.y + 34, 14, 44)
    this.placeFurniture('memory-archive', 'storing', this.x + 156, this.y + 84, 2)
  }

  private placeFurniture(
    id:
      | 'requirements-desk'
      | 'planning-table'
      | 'execution-workbench'
      | 'review-pedestal'
      | 'memory-archive',
    frame: string,
    x: number,
    y: number,
    scale: number,
  ) {
    const spec = getFurnitureSpriteSpec(id)
    const sprite = this.scene.add.image(x, y, `${spec.key}-${frame}`)
    sprite.setOrigin(0.5, 1)
    sprite.setScale(scale)
    sprite.setDepth(y)
  }
}
