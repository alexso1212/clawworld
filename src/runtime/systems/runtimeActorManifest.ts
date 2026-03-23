import type { ResourcePartitionId } from '../../core/types'

export type RuntimeAmbientActorStop = {
  zoneId: ResourcePartitionId
  holdMs?: number
  pose?: 'idle' | 'working'
}

export type RuntimeAmbientActorDef = {
  id: string
  label: string
  speed: number
  stops: RuntimeAmbientActorStop[]
}

const AMBIENT_ACTORS: RuntimeAmbientActorDef[] = [
  {
    id: 'archive-runner',
    label: 'Archive Runner',
    speed: 94,
    stops: [
      { zoneId: 'memory', holdMs: 800, pose: 'idle' },
      { zoneId: 'document', holdMs: 1100, pose: 'working' },
      { zoneId: 'skills', holdMs: 950, pose: 'working' },
      { zoneId: 'break_room', holdMs: 1600, pose: 'idle' },
    ],
  },
  {
    id: 'queue-runner',
    label: 'Queue Runner',
    speed: 112,
    stops: [
      { zoneId: 'task_queues', holdMs: 780, pose: 'working' },
      { zoneId: 'gateway', holdMs: 640, pose: 'idle' },
      { zoneId: 'agent', holdMs: 820, pose: 'working' },
      { zoneId: 'schedule', holdMs: 860, pose: 'working' },
      { zoneId: 'break_room', holdMs: 1500, pose: 'idle' },
    ],
  },
  {
    id: 'alert-runner',
    label: 'Alert Runner',
    speed: 104,
    stops: [
      { zoneId: 'alarm', holdMs: 900, pose: 'working' },
      { zoneId: 'log', holdMs: 820, pose: 'working' },
      { zoneId: 'images', holdMs: 700, pose: 'idle' },
      { zoneId: 'gateway', holdMs: 620, pose: 'idle' },
    ],
  },
]

export function getRuntimeAmbientActorDefs() {
  return AMBIENT_ACTORS.map((actor) => ({
    ...actor,
    stops: actor.stops.map((stop) => ({ ...stop })),
  }))
}
