import Phaser from 'phaser'
import type { SceneSnapshot } from '../../engine/sceneBridge'
import { withInteractiveHotspot } from './artDirection'
import { getFurnitureSpriteSpec } from './pixelSpriteCatalog'
import { ensurePixelSpriteTextures } from './pixelTextureFactory'

const OFFICE_WIDTH = 1280
const OFFICE_HEIGHT = 720

export class OfficePrefab {
  private readonly scene: Phaser.Scene
  private pulseBar?: Phaser.GameObjects.Rectangle
  private elapsedMs = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  build(): SceneSnapshot {
    ensurePixelSpriteTextures(this.scene)
    this.drawBackdrop()
    this.drawHallShell()
    this.drawLobbyTrim()
    this.drawCentralLounge()
    this.drawMeetingWing()
    this.drawBossOffice()
    this.drawDeskField()
    this.drawTaskBoard()
    this.drawTeaBar()
    this.drawSupportHall()
    this.drawLivingProps()
    this.drawMountedDisplay()
    this.drawAmbientStrip()

    return {
      scene: 'main-office',
      title: 'Main Office',
      rooms: [
        'lounge',
        'task-board',
        'meeting-room',
        'boss-office',
        'tea-bar',
        'support-hall',
        'finance',
      ],
      portals: ['portal-website-refresh'],
      markers: [
        withInteractiveHotspot(
          {
          id: 'meeting-whiteboard',
          label: 'Meeting Room Whiteboard',
          x: 68,
          y: 18,
          variant: 'surface',
          },
          OFFICE_WIDTH,
          OFFICE_HEIGHT,
        ),
        withInteractiveHotspot(
          {
          id: 'boss-whiteboard',
          label: 'Boss Office Whiteboard',
          x: 84,
          y: 17,
          variant: 'surface',
          },
          OFFICE_WIDTH,
          OFFICE_HEIGHT,
        ),
        withInteractiveHotspot(
          {
          id: 'portal-website-refresh',
          label: 'Task Board',
          x: 19,
          y: 57,
          variant: 'surface',
          },
          OFFICE_WIDTH,
          OFFICE_HEIGHT,
        ),
      ],
    }
  }

  advance(ms: number) {
    this.elapsedMs += ms

    if (!this.pulseBar) {
      return
    }

    const wave = 0.45 + (Math.sin(this.elapsedMs / 420) + 1) * 0.1
    this.pulseBar.setAlpha(wave)
  }

  private drawBackdrop() {
    this.scene.cameras.main.setBackgroundColor('#e7ddca')

    const graphics = this.scene.add.graphics()
    graphics.fillGradientStyle(0xf2eadb, 0xf2eadb, 0xe0d2bb, 0xe0d2bb, 1)
    graphics.fillRoundedRect(26, 22, OFFICE_WIDTH - 52, OFFICE_HEIGHT - 44, 12)

    graphics.fillStyle(0xfffbf4, 0.98)
    graphics.fillRoundedRect(52, 74, OFFICE_WIDTH - 104, OFFICE_HEIGHT - 126, 10)
    graphics.fillStyle(0xe6dac6, 0.9)
    graphics.fillRect(98, 116, 1094, 18)

    graphics.fillStyle(0xf2e7d1, 1)
    graphics.fillRect(94, 154, 1096, 494)
    graphics.lineStyle(1, 0xe2d4bb, 0.65)
    for (let x = 94; x <= 1188; x += 42) {
      graphics.lineBetween(x, 154, x, 648)
    }
    for (let y = 154; y <= 648; y += 42) {
      graphics.lineBetween(94, y, 1190, y)
    }
  }

  private drawHallShell() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xf7f0e2, 1)
    graphics.fillRoundedRect(100, 148, 1082, 470, 4)

    graphics.fillStyle(0xe3d0af, 0.65)
    graphics.fillRoundedRect(118, 166, 240, 148, 4)
    graphics.fillRoundedRect(884, 168, 176, 132, 4)
    graphics.fillRoundedRect(1068, 172, 100, 340, 2)

    graphics.lineStyle(4, 0xc9a667, 0.38)
    graphics.strokeRoundedRect(884, 168, 176, 132, 4)

    graphics.fillStyle(0xf1c96f, 0.26)
    graphics.fillRoundedRect(868, 534, 238, 54, 4)
  }

  private drawLobbyTrim() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xd9c6a4, 0.95)
    graphics.fillRoundedRect(130, 176, 936, 14, 2)
    graphics.fillRoundedRect(130, 604, 936, 14, 2)
    graphics.fillRoundedRect(130, 190, 14, 414, 2)
    graphics.fillRoundedRect(1052, 190, 14, 414, 2)

    graphics.fillStyle(0xf8efd8, 1)
    graphics.fillRoundedRect(146, 192, 20, 24, 2)
    graphics.fillRoundedRect(1018, 192, 20, 24, 2)
    graphics.fillRoundedRect(146, 568, 20, 24, 2)
    graphics.fillRoundedRect(1018, 568, 20, 24, 2)

    graphics.fillStyle(0xd9b17d, 0.8)
    for (let x = 170; x <= 1010; x += 84) {
      graphics.fillRoundedRect(x, 612, 34, 6, 1)
    }
  }

  private drawCentralLounge() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xf2ddcc, 1)
    graphics.fillRoundedRect(382, 236, 328, 208, 4)
    graphics.fillStyle(0xd2b699, 0.38)
    graphics.fillRoundedRect(396, 430, 296, 16, 2)
    graphics.fillStyle(0xfff3e1, 1)
    graphics.fillRoundedRect(450, 270, 192, 140, 4)
    graphics.fillStyle(0xe3b996, 1)
    graphics.fillRoundedRect(486, 316, 120, 48, 3)
    graphics.lineStyle(3, 0xd0643f, 0.55)
    graphics.strokeRoundedRect(382, 236, 328, 208, 4)

    graphics.fillStyle(0x263444, 1)
    graphics.fillRoundedRect(420, 316, 34, 70, 4)
    graphics.fillRoundedRect(638, 316, 34, 70, 4)
    graphics.fillRoundedRect(500, 244, 92, 24, 3)
    graphics.fillRoundedRect(500, 410, 92, 24, 3)

    graphics.fillStyle(0x89b481, 1)
    graphics.fillRoundedRect(394, 244, 24, 24, 4)
    graphics.fillRoundedRect(674, 244, 24, 24, 4)
    graphics.fillRoundedRect(394, 412, 24, 24, 4)
    graphics.fillRoundedRect(674, 412, 24, 24, 4)
  }

  private drawMeetingWing() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xd8ebe7, 0.9)
    graphics.fillRoundedRect(748, 180, 214, 148, 4)
    graphics.fillStyle(0x8bc7be, 0.22)
    graphics.fillRoundedRect(758, 190, 194, 128, 2)
    graphics.lineStyle(3, 0x2a7b74, 0.85)
    graphics.strokeRoundedRect(748, 180, 214, 148, 4)

    this.placeFurniture('meeting-whiteboard', 'active', 848, 302, 3)
  }

  private drawBossOffice() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xefe6d4, 1)
    graphics.fillRoundedRect(974, 182, 150, 136, 4)
    graphics.fillStyle(0xd7c5ab, 0.65)
    graphics.fillRoundedRect(986, 194, 126, 112, 2)
    this.placeFurniture('boss-whiteboard', 'active', 1049, 308, 3)
  }

  private drawDeskField() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xd8ebe7, 0.85)
    graphics.fillRoundedRect(828, 360, 276, 160, 4)
    graphics.fillStyle(0xb9d8d3, 0.3)
    graphics.fillRoundedRect(842, 374, 248, 132, 2)

    const startX = 860
    const startY = 394

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const x = startX + column * 78
        const y = startY + row * 58
        this.placeFurniture('desk-cluster', row === 0 ? 'busy' : 'idle', x + 29, y + 48, 2)
      }
    }

    graphics.fillStyle(0xfff7ed, 1)
    graphics.fillCircle(1048, 390, 10)
    graphics.fillCircle(919, 506, 10)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRoundedRect(853, 526, 44, 10, 2)
  }

  private drawTaskBoard() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xd8c29a, 0.22)
    graphics.fillRoundedRect(148, 472, 226, 106, 4)
    this.placeFurniture('task-board', 'busy', 264, 578, 3)
  }

  private drawTeaBar() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xeedec8, 1)
    graphics.fillRoundedRect(456, 496, 232, 98, 3)
    this.placeFurniture('tea-bar', 'steaming', 572, 588, 3)
  }

  private drawSupportHall() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xe9dcc6, 1)
    graphics.fillRoundedRect(736, 534, 334, 92, 3)
    graphics.fillStyle(0xf1c96f, 0.46)
    graphics.fillRoundedRect(760, 566, 286, 26, 2)
    this.placeFurniture('finance-safe', 'warning', 814, 536, 2)
    this.placeFurniture('tool-locker', 'open', 926, 576, 2)
    this.placeFurniture('archive-cabinet', 'closed', 1110, 494, 2)
  }

  private drawLivingProps() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0x89b481, 1)
    graphics.fillRoundedRect(180, 208, 18, 22, 2)
    graphics.fillRoundedRect(220, 208, 18, 22, 2)
    graphics.fillRoundedRect(1096, 560, 16, 22, 2)

    graphics.fillStyle(0xd4a46c, 1)
    graphics.fillRoundedRect(176, 228, 26, 8, 2)
    graphics.fillRoundedRect(216, 228, 26, 8, 2)
    graphics.fillRoundedRect(1092, 582, 24, 8, 2)

    graphics.fillStyle(0xf7e7ca, 0.85)
    graphics.fillRoundedRect(726, 96, 92, 10, 2)
    graphics.fillRoundedRect(738, 540, 36, 44, 2)
    graphics.fillRoundedRect(1090, 360, 44, 66, 2)

    graphics.fillStyle(0xd0643f, 0.18)
    graphics.fillRoundedRect(152, 440, 262, 12, 2)
    graphics.fillRoundedRect(452, 594, 242, 10, 2)
    graphics.fillRoundedRect(834, 528, 286, 12, 2)
  }

  private drawMountedDisplay() {
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x1d2430, 1)
    graphics.fillRect(674, 90, 212, 76)
    graphics.fillStyle(0x203449, 1)
    graphics.fillRect(682, 98, 196, 60)
    graphics.fillStyle(0x8ad4e1, 0.75)
    graphics.fillRect(708, 122, 126, 4)
    graphics.fillRect(708, 138, 80, 4)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRect(856, 114, 10, 10)
    graphics.fillStyle(0x4a5968, 1)
    graphics.fillRect(760, 166, 40, 8)
  }

  private placeFurniture(
    id:
      | 'task-board'
      | 'meeting-whiteboard'
      | 'boss-whiteboard'
      | 'desk-cluster'
      | 'archive-cabinet'
      | 'tea-bar'
      | 'finance-safe'
      | 'tool-locker',
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

  private drawAmbientStrip() {
    this.pulseBar = this.scene.add.rectangle(640, 104, 1020, 5, 0xd0643f, 0.22)
    this.pulseBar.setOrigin(0.5, 0.5)
  }
}
