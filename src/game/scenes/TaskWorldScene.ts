import Phaser from 'phaser'
import type { ClawworldRuntimeSession } from '../../adapters/openclaw/types'
import type { SceneBridge } from '../engine/sceneBridge'
import { TaskRoomPrefab } from './prefabs/TaskRoomPrefab'
import { WorkerPrefab } from './prefabs/WorkerPrefab'

type WorkerTrack = {
  id: string
  label: string
  prefab: WorkerPrefab
  targetX: number
  targetY: number
  startAtMs: number
  speedPerSecond: number
  locationId: string
  arrived: boolean
}

export class TaskWorldScene extends Phaser.Scene {
  private readonly bridge: SceneBridge
  private readonly runtimeSession: ClawworldRuntimeSession
  private workers: WorkerTrack[] = []
  private elapsedMs = 0
  private deliveryVisible = false
  private deliverySlip?: Phaser.GameObjects.Text

  constructor(bridge: SceneBridge, runtimeSession: ClawworldRuntimeSession) {
    super('task-world')
    this.bridge = bridge
    this.runtimeSession = runtimeSession
  }

  create() {
    this.drawBackdrop()
    this.drawWarRoomTrim()
    this.drawDeliveryTube()

    const slots = [
      { x: 110, y: 160 },
      { x: 390, y: 160 },
      { x: 670, y: 160 },
      { x: 950, y: 160 },
      { x: 210, y: 418 },
      { x: 530, y: 418 },
      { x: 850, y: 418 },
    ]

    this.runtimeSession.taskWorld.rooms.forEach((room, index) => {
      const slot = slots[index]
      new TaskRoomPrefab(this, slot.x, slot.y, room.label).draw()
    })

    this.drawCenterTable()
    this.drawCableRuns()
    this.drawProjectProps()

    this.deliverySlip = this.add.text(880, 128, `Delivered: ${this.runtimeSession.title}`, {
      color: '#4c3818',
      fontFamily: 'IBM Plex Mono, IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '16px',
      fontStyle: '700',
      backgroundColor: '#f2d37a',
      padding: { left: 10, right: 10, top: 6, bottom: 6 },
    })
    this.deliverySlip.setVisible(false)

    this.workers = [
      {
        id: 'amane',
        label: 'Amane',
        prefab: new WorkerPrefab(this, { id: 'amane', label: 'Amane', x: 148, y: 646 }),
        targetX: 484,
        targetY: 310,
        startAtMs: 0,
        speedPerSecond: 180,
        locationId: 'dispatch',
        arrived: false,
      },
      {
        id: 'executor',
        label: 'Executor',
        prefab: new WorkerPrefab(this, { id: 'executor', label: 'Executor', x: 290, y: 646 }),
        targetX: 304,
        targetY: 560,
        startAtMs: this.runtimeSession.tools[0]?.state === 'blocked' ? 1100 : 700,
        speedPerSecond: this.runtimeSession.route.status === 'rerouting' ? 165 : 210,
        locationId: 'execution',
        arrived: false,
      },
      {
        id: 'reviewer',
        label: 'Reviewer',
        prefab: new WorkerPrefab(this, { id: 'reviewer', label: 'Reviewer', x: 434, y: 646 }),
        targetX: 626,
        targetY: 560,
        startAtMs: 1400,
        speedPerSecond: 210,
        locationId: 'review',
        arrived: false,
      },
    ]

    this.publishSnapshot()

    this.bridge.setAdvanceHandler((ms) => {
      this.step(ms)
    })
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.bridge.resetAdvanceHandler()
    })
  }

  update(_time: number, delta: number) {
    this.step(delta)
  }

  private drawBackdrop() {
    this.cameras.main.setBackgroundColor('#e8dec9')

    const graphics = this.add.graphics()
    graphics.fillStyle(0xf2eadb, 1)
    graphics.fillRoundedRect(26, 22, 1228, 676, 12)
    graphics.fillStyle(0xe5d4b7, 0.85)
    graphics.fillRoundedRect(48, 48, 1184, 628, 10)
    graphics.fillStyle(0xfff8ea, 1)
    graphics.fillRoundedRect(76, 96, 1128, 544, 8)
    graphics.fillStyle(0xebdeca, 1)
    graphics.fillRect(90, 110, 1100, 500)
    graphics.lineStyle(1, 0xdfceb3, 0.55)
    for (let x = 90; x <= 1180; x += 40) {
      graphics.lineBetween(x, 110, x, 610)
    }
    for (let y = 110; y <= 610; y += 40) {
      graphics.lineBetween(90, y, 1190, y)
    }
  }

  private drawWarRoomTrim() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xd4be97, 0.95)
    graphics.fillRoundedRect(96, 116, 1096, 14, 2)
    graphics.fillRoundedRect(96, 596, 1096, 14, 2)
    graphics.fillRoundedRect(96, 130, 16, 466, 2)
    graphics.fillRoundedRect(1176, 130, 16, 466, 2)

    graphics.fillStyle(0xf7ecd4, 1)
    graphics.fillRoundedRect(116, 132, 22, 22, 2)
    graphics.fillRoundedRect(1150, 132, 22, 22, 2)
    graphics.fillRoundedRect(116, 570, 22, 22, 2)
    graphics.fillRoundedRect(1150, 570, 22, 22, 2)
  }

  private drawDeliveryTube() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xceb388, 1)
    graphics.fillRoundedRect(828, 88, 280, 12, 2)
    graphics.fillRoundedRect(1084, 88, 12, 92, 2)
    graphics.fillRoundedRect(1030, 170, 66, 12, 2)
    graphics.fillStyle(0xf4c34f, 1)
    graphics.fillRoundedRect(1048, 166, 30, 20, 2)
  }

  private drawCenterTable() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xd5b58f, 0.4)
    graphics.fillRoundedRect(470, 332, 340, 18, 2)
    graphics.fillStyle(0xe7d4bb, 1)
    graphics.fillRoundedRect(492, 238, 296, 108, 4)
    graphics.fillStyle(0xfff5e6, 1)
    graphics.fillRoundedRect(520, 254, 240, 76, 3)
    graphics.fillStyle(0xd0643f, 1)
    graphics.fillRoundedRect(550, 272, 54, 8, 1)
    graphics.fillRoundedRect(614, 272, 46, 8, 1)
    graphics.fillRoundedRect(570, 292, 120, 6, 1)
    graphics.fillRoundedRect(694, 286, 22, 18, 1)
    graphics.fillStyle(0x89b481, 1)
    graphics.fillRoundedRect(512, 232, 18, 18, 2)
    graphics.fillRoundedRect(748, 232, 18, 18, 2)
  }

  private drawCableRuns() {
    const graphics = this.add.graphics()
    graphics.lineStyle(6, 0xcb7f55, 0.38)
    graphics.lineBetween(220, 472, 468, 472)
    graphics.lineBetween(468, 472, 468, 538)
    graphics.lineBetween(468, 538, 740, 538)
    graphics.lineBetween(740, 538, 740, 476)
    graphics.lineBetween(740, 476, 956, 476)

    graphics.lineStyle(4, 0xf4c34f, 0.45)
    graphics.lineBetween(238, 486, 446, 486)
    graphics.lineBetween(446, 486, 446, 548)
    graphics.lineBetween(446, 548, 918, 548)
  }

  private drawProjectProps() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0x89b481, 1)
    graphics.fillRoundedRect(120, 546, 18, 22, 2)
    graphics.fillRoundedRect(1134, 518, 18, 24, 2)
    graphics.fillRoundedRect(1100, 214, 14, 18, 2)

    graphics.fillStyle(0xd4a46c, 1)
    graphics.fillRoundedRect(116, 568, 24, 8, 2)
    graphics.fillRoundedRect(1130, 542, 24, 8, 2)
    graphics.fillRoundedRect(1096, 232, 22, 8, 2)

    graphics.fillStyle(0xf7e7ca, 1)
    graphics.fillRoundedRect(172, 606, 32, 6, 1)
    graphics.fillRoundedRect(220, 606, 32, 6, 1)
    graphics.fillRoundedRect(268, 606, 32, 6, 1)

    graphics.fillStyle(0xd0643f, 0.2)
    graphics.fillRoundedRect(118, 268, 200, 10, 2)
    graphics.fillRoundedRect(954, 268, 198, 10, 2)
    graphics.fillRoundedRect(214, 528, 214, 10, 2)
    graphics.fillRoundedRect(854, 528, 214, 10, 2)
  }

  private step(delta: number) {
    this.elapsedMs += delta

    let snapshotChanged = false
    for (const worker of this.workers) {
      if (this.elapsedMs < worker.startAtMs) {
        continue
      }

      if (!worker.arrived) {
        worker.prefab.setMode('moving')
        const arrived = worker.prefab.moveToward(
          worker.targetX,
          worker.targetY,
          delta,
          worker.speedPerSecond,
        )

        snapshotChanged = true
        if (arrived) {
          worker.arrived = true
          worker.prefab.setMode(worker.id === 'reviewer' ? 'reporting' : 'working')
        }
      }
    }

    if (!this.deliveryVisible && this.workers.every((worker) => worker.arrived)) {
      this.deliveryVisible = true
      this.deliverySlip?.setVisible(true)
      snapshotChanged = true
    }

    if (snapshotChanged) {
      this.publishSnapshot()
    }
  }

  private publishSnapshot() {
    this.bridge.setSnapshot({
      scene: 'task-world',
      title: this.runtimeSession.title,
      rooms: this.runtimeSession.taskWorld.rooms.map((room) => room.label),
      portals: ['return-main-office'],
      markers: [
        { id: 'task-world-title', label: this.runtimeSession.title, x: 15, y: 9, variant: 'title' },
        {
          id: 'return-main-office',
          label: 'Return to Main Office',
          x: 84,
          y: 10,
          variant: 'surface',
          interactive: true,
        },
        { id: 'task-room-reception', label: 'Reception', x: 18, y: 28, variant: 'room' },
        { id: 'task-room-dispatch', label: 'Amane Desk', x: 40, y: 28, variant: 'room' },
        {
          id: 'task-room-requirements',
          label: 'Requirements Room',
          x: 61,
          y: 28,
          variant: 'room',
        },
        { id: 'task-room-planning', label: 'Planning Room', x: 83, y: 28, variant: 'room' },
        {
          id: 'task-room-execution',
          label: 'Execution Workshop',
          x: 27,
          y: 63,
          variant: 'room',
        },
        {
          id: 'task-room-review',
          label: 'Review Checkpoint',
          x: 55,
          y: 63,
          variant: 'room',
        },
        { id: 'task-room-memory', label: 'Memory Archive', x: 80, y: 63, variant: 'room' },
        ...(this.deliveryVisible
          ? [
              {
                id: 'delivery-note',
                label: `Delivered: ${this.runtimeSession.title}`,
                x: 82,
                y: 20,
                variant: 'delivery' as const,
              },
            ]
          : []),
      ],
    })
  }
}
