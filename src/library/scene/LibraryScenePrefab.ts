import Phaser from 'phaser'
import {
  buildLibrarySceneSnapshot,
  getLibrarySceneArtLayers,
  getLibraryShellManifest,
  LIBRARY_SCENE_HEIGHT,
  LIBRARY_SCENE_WIDTH,
} from '../data/libraryShellManifest'

export class LibraryScenePrefab {
  private readonly scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  build(selectedRoomId: string) {
    const manifest = getLibraryShellManifest()
    const sceneArt = getLibrarySceneArtLayers()

    this.scene.cameras.main.setBackgroundColor('#191514')

    if (this.scene.textures.exists(sceneArt.floor.textureKey)) {
      const floor = this.scene.add.image(sceneArt.floor.anchor.x, sceneArt.floor.anchor.y, sceneArt.floor.textureKey)
      floor.setDisplaySize(sceneArt.floor.displaySize.width, sceneArt.floor.displaySize.height)
      floor.setDepth(0)
      floor.setAlpha(0.96)
    }

    const graphics = this.scene.add.graphics()
    graphics.fillGradientStyle(0x1a1614, 0x1a1614, 0x231d1a, 0x231d1a, 1)
    graphics.fillRect(0, 0, LIBRARY_SCENE_WIDTH, LIBRARY_SCENE_HEIGHT)
    graphics.fillStyle(0x302722, 1)
    graphics.fillRoundedRect(44, 32, LIBRARY_SCENE_WIDTH - 88, LIBRARY_SCENE_HEIGHT - 64, 28)
    graphics.fillStyle(0x1f1917, 1)
    graphics.fillRoundedRect(76, 68, LIBRARY_SCENE_WIDTH - 152, LIBRARY_SCENE_HEIGHT - 136, 24)
    graphics.lineStyle(2, 0x705740, 0.38)
    graphics.strokeRoundedRect(76, 68, LIBRARY_SCENE_WIDTH - 152, LIBRARY_SCENE_HEIGHT - 136, 24)

    graphics.fillStyle(0x2a2320, 1)
    graphics.fillRoundedRect(110, 102, LIBRARY_SCENE_WIDTH - 220, LIBRARY_SCENE_HEIGHT - 204, 26)
    graphics.fillStyle(0x161210, 1)
    graphics.fillRoundedRect(138, 132, LIBRARY_SCENE_WIDTH - 276, LIBRARY_SCENE_HEIGHT - 264, 28)

    for (const room of manifest.rooms) {
      const x = (room.anchor.x / 100) * LIBRARY_SCENE_WIDTH
      const y = (room.anchor.y / 100) * LIBRARY_SCENE_HEIGHT
      const width = (room.anchor.width / 100) * LIBRARY_SCENE_WIDTH
      const height = (room.anchor.height / 100) * LIBRARY_SCENE_HEIGHT
      const fill = Number.parseInt(room.accent.replace('#', ''), 16)
      const selected = room.id === selectedRoomId

      graphics.fillStyle(0xf6ead1, 0.08)
      graphics.fillRoundedRect(x - width / 2 + 8, y - height / 2 + height - 4, width - 16, 10, 4)

      graphics.fillStyle(fill, selected ? 0.38 : 0.22)
      graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 12)
      graphics.lineStyle(2, fill, selected ? 0.95 : 0.58)
      graphics.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 12)

      const sign = this.scene.add.text(x - width / 2 + 16, y - height / 2 + 16, room.label, {
        color: '#f7ecd4',
        fontFamily: 'IBM Plex Mono, IBM Plex Sans, PingFang SC, sans-serif',
        fontSize: '18px',
        fontStyle: '700',
      })
      sign.setAlpha(selected ? 1 : 0.82)
      sign.setDepth(4)

      const category = this.scene.add.text(x - width / 2 + 16, y - height / 2 + 44, room.category, {
        color: '#d6c6aa',
        fontFamily: 'IBM Plex Mono, IBM Plex Sans, PingFang SC, sans-serif',
        fontSize: '13px',
      })
      category.setAlpha(0.9)
      category.setDepth(4)
    }

    if (this.scene.textures.exists(sceneArt.objects.textureKey)) {
      const objects = this.scene.add.image(
        sceneArt.objects.anchor.x,
        sceneArt.objects.anchor.y,
        sceneArt.objects.textureKey,
      )
      objects.setDisplaySize(sceneArt.objects.displaySize.width, sceneArt.objects.displaySize.height)
      objects.setDepth(3)
      objects.setAlpha(0.94)
    }

    const stageTitle = this.scene.add.text(148, 110, 'LIVING PIXEL ARCHIVE', {
      color: '#f6ead1',
      fontFamily: 'IBM Plex Mono, IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '20px',
      fontStyle: '700',
      letterSpacing: 2,
    })
    stageTitle.setDepth(5)

    return buildLibrarySceneSnapshot(selectedRoomId)
  }
}
