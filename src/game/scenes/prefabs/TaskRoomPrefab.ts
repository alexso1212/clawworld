import Phaser from 'phaser'

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
    const style = resolveRoomStyle(this.label)
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(style.shellShadow, 0.45)
    graphics.fillRoundedRect(this.x + 10, this.y + 96, 214, 18, 2)
    graphics.fillStyle(style.shell, 1)
    graphics.fillRoundedRect(this.x, this.y, 214, 108, 4)
    graphics.fillStyle(style.surface, 1)
    graphics.fillRoundedRect(this.x + 12, this.y + 14, 190, 82, 2)
    graphics.fillStyle(style.accent, 0.9)
    graphics.fillRoundedRect(this.x + 18, this.y + 18, 70, 10, 1)
    graphics.fillRoundedRect(this.x + 126, this.y + 18, 58, 10, 1)

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
    graphics.fillRoundedRect(this.x + 34, this.y + 48, 112, 22, 2)
    graphics.fillStyle(0xfff3cc, 1)
    graphics.fillRoundedRect(this.x + 154, this.y + 44, 26, 30, 2)
    graphics.fillStyle(0xf2b874, 1)
    graphics.fillRoundedRect(this.x + 44, this.y + 34, 18, 12, 2)
    graphics.fillRoundedRect(this.x + 68, this.y + 34, 14, 12, 2)
  }

  private drawAmaneDesk(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 1)
    graphics.fillRoundedRect(this.x + 30, this.y + 42, 52, 32, 2)
    graphics.fillRoundedRect(this.x + 88, this.y + 42, 52, 32, 2)
    graphics.fillStyle(0x98d5e8, 1)
    graphics.fillRoundedRect(this.x + 34, this.y + 30, 20, 10, 1)
    graphics.fillRoundedRect(this.x + 92, this.y + 30, 20, 10, 1)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRoundedRect(this.x + 154, this.y + 50, 18, 20, 2)
    graphics.fillStyle(0xf7e7ca, 1)
    graphics.fillRoundedRect(this.x + 146, this.y + 30, 22, 12, 1)
  }

  private drawRequirements(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(0xc49b62, 1)
    graphics.fillRoundedRect(this.x + 34, this.y + 34, 138, 44, 2)
    graphics.fillStyle(0xfff6df, 1)
    graphics.fillRoundedRect(this.x + 42, this.y + 42, 18, 12, 1)
    graphics.fillRoundedRect(this.x + 68, this.y + 52, 16, 12, 1)
    graphics.fillRoundedRect(this.x + 92, this.y + 40, 22, 14, 1)
    graphics.fillStyle(style.accent, 1)
    graphics.fillRoundedRect(this.x + 120, this.y + 48, 30, 3, 1)
    graphics.fillRoundedRect(this.x + 120, this.y + 58, 20, 3, 1)
  }

  private drawPlanning(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(0xfffbef, 1)
    graphics.fillRoundedRect(this.x + 40, this.y + 34, 124, 44, 2)
    graphics.fillStyle(style.accent, 1)
    graphics.lineStyle(3, style.accent, 0.9)
    graphics.lineBetween(this.x + 62, this.y + 52, this.x + 112, this.y + 52)
    graphics.lineBetween(this.x + 112, this.y + 52, this.x + 142, this.y + 42)
    graphics.lineBetween(this.x + 112, this.y + 52, this.x + 144, this.y + 64)
    graphics.fillRoundedRect(this.x + 138, this.y + 36, 12, 10, 1)
    graphics.fillRoundedRect(this.x + 138, this.y + 60, 14, 10, 1)
  }

  private drawExecution(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 1)
    graphics.fillRoundedRect(this.x + 28, this.y + 42, 44, 28, 2)
    graphics.fillRoundedRect(this.x + 82, this.y + 42, 44, 28, 2)
    graphics.fillRoundedRect(this.x + 136, this.y + 42, 32, 28, 2)
    graphics.fillStyle(0x8bc7be, 1)
    graphics.fillRoundedRect(this.x + 34, this.y + 28, 28, 10, 1)
    graphics.fillRoundedRect(this.x + 88, this.y + 28, 28, 10, 1)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRoundedRect(this.x + 148, this.y + 74, 26, 4, 1)
    graphics.fillRoundedRect(this.x + 124, this.y + 76, 18, 4, 1)
  }

  private drawReview(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 1)
    graphics.fillRoundedRect(this.x + 42, this.y + 46, 92, 18, 2)
    graphics.fillStyle(0xfff7ed, 1)
    graphics.fillRoundedRect(this.x + 146, this.y + 42, 24, 24, 2)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillCircle(this.x + 166, this.y + 30, 9)
    graphics.fillStyle(0xcbb89f, 1)
    graphics.fillRoundedRect(this.x + 54, this.y + 72, 68, 8, 1)
  }

  private drawMemory(graphics: Phaser.GameObjects.Graphics, style: TaskRoomStyle) {
    graphics.fillStyle(style.accent, 1)
    graphics.fillRoundedRect(this.x + 28, this.y + 34, 14, 44, 1)
    graphics.fillRoundedRect(this.x + 48, this.y + 34, 14, 44, 1)
    graphics.fillRoundedRect(this.x + 68, this.y + 34, 14, 44, 1)
    graphics.fillRoundedRect(this.x + 88, this.y + 34, 14, 44, 1)
    graphics.fillStyle(0xf4c34f, 1)
    graphics.fillRoundedRect(this.x + 136, this.y + 30, 40, 12, 2)
    graphics.fillRoundedRect(this.x + 150, this.y + 44, 12, 30, 2)
  }
}
