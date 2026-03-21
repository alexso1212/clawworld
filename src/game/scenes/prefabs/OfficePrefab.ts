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
    this.drawDeskField()
    this.drawRooms()
    this.drawMountedDisplay()
    this.drawAmbientStrip()
    this.drawLabels()

    return {
      scene: 'main-office',
      title: 'Main Office',
      rooms: [
        'open-office',
        'meeting-room',
        'boss-office',
        'review-desk',
        'archive',
        'finance',
      ],
      portals: [],
      markers: [
        { id: 'title-main-office', label: 'Main Office', x: 8, y: 10, variant: 'title' },
        { id: 'room-open-office', label: 'Open Office', x: 18, y: 36, variant: 'room' },
        { id: 'room-meeting', label: 'Meeting Room', x: 51, y: 24, variant: 'room' },
        {
          id: 'meeting-whiteboard',
          label: 'Meeting Room Whiteboard',
          x: 48,
          y: 17,
          variant: 'surface',
          interactive: true,
        },
        { id: 'room-boss', label: 'Boss Office', x: 80, y: 24, variant: 'room' },
        {
          id: 'boss-whiteboard',
          label: 'Boss Office Whiteboard',
          x: 78,
          y: 17,
          variant: 'surface',
          interactive: true,
        },
        { id: 'room-review', label: 'Review Desk', x: 58, y: 70, variant: 'room' },
        { id: 'room-archive', label: 'Archive Room', x: 82, y: 70, variant: 'room' },
        { id: 'room-finance', label: 'Finance Room', x: 23, y: 74, variant: 'room' },
        { id: 'surface-wall-display', label: 'On-Wall Display', x: 83, y: 14, variant: 'surface' },
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
    this.scene.cameras.main.setBackgroundColor('#08111f')

    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x0e1a2f, 1)
    graphics.fillRoundedRect(26, 22, OFFICE_WIDTH - 52, OFFICE_HEIGHT - 44, 32)

    graphics.fillStyle(0x101f39, 1)
    graphics.fillRoundedRect(52, 74, OFFICE_WIDTH - 104, OFFICE_HEIGHT - 126, 28)

    graphics.lineStyle(2, 0x233d65, 0.9)
    for (let y = 118; y <= 610; y += 82) {
      graphics.lineBetween(88, y, 1192, y)
    }

    for (let x = 120; x <= 1140; x += 128) {
      graphics.lineBetween(x, 108, x, 610)
    }
  }

  private drawDeskField() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0x152b4d, 1)
    graphics.fillRoundedRect(106, 186, 408, 216, 22)

    const deskColor = 0x28466f
    const chairColor = 0x8ee9ff
    const startX = 148
    const startY = 222

    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const x = startX + column * 88
        const y = startY + row * 58
        graphics.fillStyle(deskColor, 1)
        graphics.fillRoundedRect(x, y, 54, 26, 8)
        graphics.fillStyle(chairColor, 0.7)
        graphics.fillRoundedRect(x + 16, y + 32, 22, 12, 6)
      }
    }
  }

  private drawRooms() {
    const graphics = this.scene.add.graphics()

    graphics.fillStyle(0x193155, 1)
    graphics.fillRoundedRect(550, 114, 246, 160, 18)
    graphics.fillRoundedRect(822, 114, 260, 160, 18)
    graphics.fillRoundedRect(150, 510, 280, 124, 18)
    graphics.fillRoundedRect(508, 510, 242, 124, 18)
    graphics.fillRoundedRect(792, 510, 290, 124, 18)

    graphics.fillStyle(0x274e82, 0.95)
    graphics.fillRoundedRect(572, 140, 118, 22, 8)
    graphics.fillRoundedRect(884, 142, 122, 18, 7)
    graphics.fillRoundedRect(186, 545, 136, 22, 8)
    graphics.fillRoundedRect(560, 546, 92, 18, 7)
    graphics.fillRoundedRect(842, 546, 110, 18, 7)

    graphics.fillStyle(0xf4f7fb, 1)
    graphics.fillRoundedRect(618, 134, 96, 58, 10)
    graphics.fillRoundedRect(886, 176, 126, 68, 10)
  }

  private drawMountedDisplay() {
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x0a111c, 1)
    graphics.fillRoundedRect(948, 88, 176, 76, 14)
    graphics.lineStyle(2, 0x7cd6ff, 0.7)
    graphics.strokeRoundedRect(948, 88, 176, 76, 14)
    graphics.lineBetween(970, 126, 1100, 126)
    graphics.lineBetween(970, 142, 1052, 142)
  }

  private drawAmbientStrip() {
    this.pulseBar = this.scene.add.rectangle(640, 92, 1032, 6, 0x7cd6ff, 0.5)
    this.pulseBar.setOrigin(0.5, 0.5)
  }

  private drawLabels() {
    const textStyle = {
      color: '#dcebff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '18px',
      fontStyle: '700',
    }
    const subtleStyle = {
      color: '#8ebdff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '14px',
      fontStyle: '600',
    }

    this.scene.add.text(92, 82, 'Main Office', {
      ...textStyle,
      fontSize: '24px',
    })
    this.scene.add.text(148, 166, 'Open Office', textStyle)
    this.scene.add.text(586, 206, 'Meeting Room', subtleStyle)
    this.scene.add.text(610, 144, 'Meeting Room Whiteboard', subtleStyle)
    this.scene.add.text(872, 206, 'Boss Office', subtleStyle)
    this.scene.add.text(844, 146, 'Boss Office Whiteboard', subtleStyle)
    this.scene.add.text(1016, 102, 'On-Wall Display', subtleStyle)
    this.scene.add.text(212, 580, 'Finance Room', subtleStyle)
    this.scene.add.text(560, 580, 'Review Desk', subtleStyle)
    this.scene.add.text(846, 580, 'Archive Room', subtleStyle)
  }
}
