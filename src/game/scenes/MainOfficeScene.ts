import Phaser from 'phaser'
import type { SceneBridge } from '../engine/sceneBridge'
import { OfficePrefab } from './prefabs/OfficePrefab'
import { WorkerPrefab } from './prefabs/WorkerPrefab'

export class MainOfficeScene extends Phaser.Scene {
  private readonly bridge: SceneBridge

  constructor(bridge: SceneBridge) {
    super('main-office')
    this.bridge = bridge
  }

  create() {
    const office = new OfficePrefab(this)
    const snapshot = office.build()
    const workers = [
      new WorkerPrefab(this, { id: 'amane-office', label: 'Amane', x: 170, y: 246 }),
      new WorkerPrefab(this, { id: 'executor-office', label: 'Executor', x: 258, y: 304 }),
      new WorkerPrefab(this, { id: 'reviewer-office', label: 'Reviewer', x: 346, y: 362 }),
    ]

    this.bridge.setSnapshot({
      ...snapshot,
      markers: [
        ...snapshot.markers,
        ...workers.map((worker) => worker.toMarker()),
      ],
    })
    this.bridge.setAdvanceHandler((ms) => {
      office.advance(ms)
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.bridge.resetAdvanceHandler()
    })
  }
}
