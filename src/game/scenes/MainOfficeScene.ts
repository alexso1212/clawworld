import Phaser from 'phaser'
import type { SceneBridge } from '../engine/sceneBridge'
import { OfficePrefab } from './prefabs/OfficePrefab'

export class MainOfficeScene extends Phaser.Scene {
  private readonly bridge: SceneBridge

  constructor(bridge: SceneBridge) {
    super('main-office')
    this.bridge = bridge
  }

  create() {
    const office = new OfficePrefab(this)
    const snapshot = office.build()

    this.bridge.setSnapshot(snapshot)
    this.bridge.setAdvanceHandler((ms) => {
      office.advance(ms)
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.bridge.resetAdvanceHandler()
    })
  }
}
