import Phaser from 'phaser'
import type { SceneBridge } from './sceneBridge'
import { MainOfficeScene } from '../scenes/MainOfficeScene'

export function createGame(host: HTMLDivElement, bridge: SceneBridge) {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent: host,
    backgroundColor: '#08111f',
    width: 1280,
    height: 720,
    antialias: false,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [new MainOfficeScene(bridge)],
  })
}
