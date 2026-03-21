import Phaser from 'phaser'

export class TaskRoomPrefab {
  private readonly scene: Phaser.Scene
  private readonly x: number
  private readonly y: number
  private readonly label: string

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
  ) {
    this.scene = scene
    this.x = x
    this.y = y
    this.label = label
  }

  draw() {
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x1f3a62, 1)
    graphics.fillRoundedRect(this.x, this.y, 210, 112, 18)
    graphics.fillStyle(0x2d578d, 1)
    graphics.fillRoundedRect(this.x + 18, this.y + 20, 166, 18, 8)

    this.scene.add.text(this.x + 18, this.y + 54, this.label, {
      color: '#dcecff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '18px',
      fontStyle: '700',
      wordWrap: { width: 170 },
    })
  }
}
