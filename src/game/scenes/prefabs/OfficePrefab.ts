import Phaser from 'phaser'
import type { SceneSnapshot } from '../../engine/sceneBridge'

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
    this.drawBackdrop()
    this.drawHallShell()
    this.drawCentralLounge()
    this.drawMeetingWing()
    this.drawBossOffice()
    this.drawDeskField()
    this.drawTaskBoard()
    this.drawTeaBar()
    this.drawSupportHall()
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
        { id: 'title-main-office', label: 'Main Office', x: 8, y: 10, variant: 'title' },
        {
          id: 'meeting-whiteboard',
          label: 'Meeting Room Whiteboard',
          x: 68,
          y: 18,
          variant: 'surface',
          interactive: true,
        },
        {
          id: 'boss-whiteboard',
          label: 'Boss Office Whiteboard',
          x: 84,
          y: 17,
          variant: 'surface',
          interactive: true,
        },
        {
          id: 'portal-website-refresh',
          label: 'Task Board',
          x: 19,
          y: 57,
          variant: 'surface',
          interactive: true,
        },
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

  private drawCentralLounge() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xf2ddcc, 1)
    graphics.fillRoundedRect(382, 236, 328, 208, 4)
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
    graphics.lineStyle(3, 0x2a7b74, 0.85)
    graphics.strokeRoundedRect(748, 180, 214, 148, 4)

    graphics.fillStyle(0xfafdff, 1)
    graphics.fillRoundedRect(782, 208, 128, 64, 2)
    graphics.lineStyle(4, 0xd0643f, 0.92)
    graphics.lineBetween(798, 240, 878, 240)
    graphics.lineBetween(882, 240, 904, 224)
    graphics.lineStyle(3, 0xc8b14f, 0.9)
    graphics.strokeRoundedRect(894, 210, 28, 24, 2)
    graphics.strokeRoundedRect(902, 244, 28, 24, 2)
  }

  private drawBossOffice() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xefe6d4, 1)
    graphics.fillRoundedRect(974, 182, 150, 136, 4)
    graphics.fillStyle(0xffffff, 1)
    graphics.fillRoundedRect(1014, 218, 82, 46, 2)
    graphics.fillStyle(0x243142, 0.92)
    graphics.fillRoundedRect(1000, 274, 112, 14, 2)
  }

  private drawDeskField() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xd8ebe7, 0.85)
    graphics.fillRoundedRect(828, 360, 276, 160, 4)

    const deskColor = 0xeadcc8
    const chairColor = 0xf2b874
    const monitorColor = 0x98d5e8
    const startX = 860
    const startY = 394

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const x = startX + column * 78
        const y = startY + row * 58
        graphics.fillStyle(deskColor, 1)
        graphics.fillRoundedRect(x, y, 58, 26, 2)
        graphics.fillStyle(monitorColor, 1)
        graphics.fillRoundedRect(x + 10, y - 14, 38, 16, 2)
        graphics.fillStyle(chairColor, 0.88)
        graphics.fillRoundedRect(x + 16, y + 32, 22, 12, 2)
      }
    }

    graphics.fillStyle(0xfff7ed, 1)
    graphics.fillCircle(1048, 390, 10)
    graphics.fillCircle(919, 506, 10)
  }

  private drawTaskBoard() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xffefbf, 0.95)
    graphics.fillRoundedRect(140, 462, 246, 120, 3)
    graphics.fillStyle(0xf6ce62, 1)
    graphics.fillRoundedRect(170, 506, 34, 26, 2)
    graphics.fillStyle(0xf0a167, 1)
    graphics.fillRoundedRect(214, 506, 34, 26, 2)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRoundedRect(258, 506, 34, 26, 2)
  }

  private drawTeaBar() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xeedec8, 1)
    graphics.fillRoundedRect(456, 496, 232, 98, 3)
    graphics.fillStyle(0xd7bea0, 1)
    graphics.fillRoundedRect(492, 536, 164, 18, 2)
    graphics.fillStyle(0xfff7ed, 1)
    graphics.fillCircle(524, 528, 12)
    graphics.fillStyle(0x243142, 0.9)
    graphics.fillRoundedRect(628, 516, 22, 34, 2)
  }

  private drawSupportHall() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0xe9dcc6, 1)
    graphics.fillRoundedRect(736, 534, 334, 92, 3)
    graphics.fillStyle(0xf1c96f, 0.46)
    graphics.fillRoundedRect(760, 566, 286, 26, 2)
    graphics.fillStyle(0xf4ecdf, 1)
    graphics.fillRoundedRect(778, 492, 68, 38, 2)
    graphics.fillStyle(0x50a864, 1)
    graphics.fillCircle(834, 510, 6)
    graphics.fillStyle(0xdbefe8, 1)
    graphics.fillRoundedRect(872, 484, 108, 46, 2)
    graphics.fillStyle(0x18293a, 1)
    graphics.fillRoundedRect(998, 474, 38, 62, 2)
    graphics.fillStyle(0x50a864, 1)
    graphics.fillCircle(1010, 492, 4)
    graphics.fillStyle(0xf4c34f, 1)
    graphics.fillCircle(1022, 492, 4)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillCircle(1034, 492, 4)
  }

  private drawMountedDisplay() {
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x1d2430, 1)
    graphics.fillRoundedRect(676, 92, 206, 72, 3)
    graphics.lineStyle(2, 0x8ad4e1, 0.75)
    graphics.strokeRoundedRect(676, 92, 206, 72, 3)
    graphics.lineBetween(706, 124, 832, 124)
    graphics.lineBetween(706, 140, 784, 140)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillCircle(860, 118, 6)
  }

  private drawAmbientStrip() {
    this.pulseBar = this.scene.add.rectangle(640, 104, 1020, 5, 0xd0643f, 0.22)
    this.pulseBar.setOrigin(0.5, 0.5)
  }
}
