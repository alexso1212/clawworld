import Phaser from 'phaser'
import { mockInfrastructureState } from '../../adapters/mock/mockWorldState'
import { createTaskWorld } from '../../domain/taskWorld'
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
  private world = createTaskWorld({
    id: 'website-refresh',
    title: 'Website Refresh',
  })
  private workers: WorkerTrack[] = []
  private elapsedMs = 0
  private deliveryVisible = false
  private deliverySlip?: Phaser.GameObjects.Text

  constructor(bridge: SceneBridge) {
    super('task-world')
    this.bridge = bridge
  }

  create() {
    this.cameras.main.setBackgroundColor('#091222')

    const graphics = this.add.graphics()
    graphics.fillStyle(0x0d182b, 1)
    graphics.fillRoundedRect(26, 22, 1228, 676, 32)
    graphics.fillStyle(0x142540, 1)
    graphics.fillRoundedRect(56, 84, 1168, 586, 30)

    this.add.text(86, 60, 'Task World: Website Refresh', {
      color: '#e7f1ff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '24px',
      fontStyle: '700',
    })

    this.add.text(886, 92, 'Delivery Rail', {
      color: '#9fe7ff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '16px',
      fontStyle: '700',
    })

    const slots = [
      { x: 110, y: 150 },
      { x: 390, y: 150 },
      { x: 670, y: 150 },
      { x: 950, y: 150 },
      { x: 210, y: 410 },
      { x: 530, y: 410 },
      { x: 850, y: 410 },
    ]

    this.world.rooms.forEach((room, index) => {
      const slot = slots[index]
      new TaskRoomPrefab(this, slot.x, slot.y, room.label).draw()
    })

    this.deliverySlip = this.add.text(880, 128, 'Delivered: Website Refresh', {
      color: '#f8fdff',
      fontFamily: 'IBM Plex Sans, PingFang SC, sans-serif',
      fontSize: '18px',
      fontStyle: '700',
      backgroundColor: '#e7a34a',
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
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
        startAtMs: mockInfrastructureState.toolLocker.state === 'blocked' ? 1100 : 700,
        speedPerSecond: mockInfrastructureState.route.status === 'rerouting' ? 165 : 210,
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
      title: 'Website Refresh',
      rooms: this.world.rooms.map((room) => room.label),
      portals: ['return-main-office'],
      markers: [
        { id: 'task-world-title', label: 'Website Refresh', x: 15, y: 9, variant: 'title' },
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
        ...this.workers.map((worker) => worker.prefab.toMarker()),
        ...(this.deliveryVisible
          ? [
              {
                id: 'delivery-note',
                label: 'Delivered: Website Refresh',
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
