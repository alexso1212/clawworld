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
    const workers = [
      new WorkerPrefab(this, { id: 'amane-office', label: 'Amane', x: 170, y: 246 }),
      new WorkerPrefab(this, { id: 'executor-office', label: 'Executor', x: 258, y: 304 }),
      new WorkerPrefab(this, { id: 'reviewer-office', label: 'Reviewer', x: 346, y: 362 }),
    ]

    const warningStyle = {
      color: '#ffd58f',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '15px',
      fontStyle: '700',
    }

    this.add.text(184, 652, this.runtimeSession.signals[0].label, warningStyle)
    this.add.text(520, 652, this.runtimeSession.signals[1].label, warningStyle)
    this.add.text(840, 652, this.runtimeSession.signals[2].label, warningStyle)
    this.add.text(974, 138, 'Abnormality Register', warningStyle)
    this.add.text(470, 612, '!', {
      color: '#ffefcf',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '26px',
      fontStyle: '700',
    })

    this.bridge.setSnapshot({
      ...snapshot,
      markers: [
        ...snapshot.markers,
        ...workers.map((worker) => worker.toMarker()),
        { id: 'signal-finance', label: this.runtimeSession.signals[0].label, x: 23, y: 84, variant: 'surface' },
        { id: 'signal-route', label: this.runtimeSession.signals[1].label, x: 51, y: 84, variant: 'surface' },
        { id: 'signal-tool', label: this.runtimeSession.signals[2].label, x: 79, y: 84, variant: 'surface' },
        {
          id: 'abnormality-register',
          label: 'Abnormality Register',
          x: 86,
          y: 18,
          variant: 'surface',
          interactive: true,
        },
        {
          id: 'abnormality-finance-low',
          label: this.runtimeSession.abnormalities[0]?.marker ?? '!',
          x: 29,
          y: 84,
          variant: 'delivery',
          interactive: true,
        },
        {
          id: 'abnormality-bridge-down',
          label: this.runtimeSession.abnormalities[1]?.marker ?? '!',
          x: 58,
          y: 84,
          variant: 'delivery',
          interactive: true,
        },
        {
          id: 'abnormality-tool-locker-blocked',
          label: this.runtimeSession.abnormalities[2]?.marker ?? '!',
          x: 86,
          y: 84,
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
