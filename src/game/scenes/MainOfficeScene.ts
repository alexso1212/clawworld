import Phaser from 'phaser'
import type { ClawworldRuntimeSession } from '../../adapters/openclaw/types'
import type { SceneBridge } from '../engine/sceneBridge'
import { OfficePrefab } from './prefabs/OfficePrefab'
import { WorkerPrefab } from './prefabs/WorkerPrefab'

export class MainOfficeScene extends Phaser.Scene {
  private readonly bridge: SceneBridge
  private readonly runtimeSession: ClawworldRuntimeSession

  constructor(bridge: SceneBridge, runtimeSession: ClawworldRuntimeSession) {
    super('main-office')
    this.bridge = bridge
    this.runtimeSession = runtimeSession
  }

  create() {
    const office = new OfficePrefab(this)
    const snapshot = office.build()
    void [
      new WorkerPrefab(this, { id: 'amane-office', label: 'Amane', x: 470, y: 340, color: 0xf4c34f }),
      new WorkerPrefab(this, { id: 'executor-office', label: 'Executor', x: 912, y: 448, color: 0x5e98c7 }),
      new WorkerPrefab(this, { id: 'reviewer-office', label: 'Reviewer', x: 996, y: 448, color: 0xc3835f }),
    ]

    this.bridge.setSnapshot({
      ...snapshot,
      markers: [
        ...snapshot.markers,
        { id: 'signal-finance', label: this.runtimeSession.signals[0].label, x: 22, y: 75, variant: 'surface' },
        { id: 'signal-route', label: this.runtimeSession.signals[1].label, x: 73, y: 75, variant: 'surface' },
        { id: 'signal-tool', label: this.runtimeSession.signals[2].label, x: 82, y: 68, variant: 'surface' },
        {
          id: 'abnormality-register',
          label: 'Abnormality Desk',
          x: 83,
          y: 62,
          variant: 'surface',
          interactive: true,
        },
        {
          id: 'abnormality-finance-low',
          label: this.runtimeSession.abnormalities[0]?.marker ?? '!',
          x: 28,
          y: 74,
          variant: 'delivery',
          interactive: true,
        },
        {
          id: 'abnormality-bridge-down',
          label: this.runtimeSession.abnormalities[1]?.marker ?? '!',
          x: 78,
          y: 74,
          variant: 'delivery',
          interactive: true,
        },
        {
          id: 'abnormality-tool-locker-blocked',
          label: this.runtimeSession.abnormalities[2]?.marker ?? '!',
          x: 88,
          y: 68,
          variant: 'delivery',
          interactive: true,
        },
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
