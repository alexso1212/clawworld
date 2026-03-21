import type { TaskRoom, TaskWorld } from './types'

export const CORE_ROOMS = [
  { id: 'reception', label: 'Reception', status: 'idle', isCore: true },
  { id: 'dispatch', label: 'Amane Desk', status: 'idle', isCore: true },
  {
    id: 'requirements',
    label: 'Requirements Room',
    status: 'idle',
    isCore: true,
  },
  {
    id: 'decomposition',
    label: 'Planning Room',
    status: 'idle',
    isCore: true,
  },
  {
    id: 'execution',
    label: 'Execution Workshop',
    status: 'idle',
    isCore: true,
  },
  {
    id: 'review',
    label: 'Review Checkpoint',
    status: 'idle',
    isCore: true,
  },
  { id: 'memory', label: 'Memory Archive', status: 'idle', isCore: true },
] as const satisfies readonly TaskRoom[]

type CreateTaskWorldInput = {
  id: string
  title: string
  extraRooms?: TaskRoom[]
}

export function createTaskWorld({
  id,
  title,
  extraRooms = [],
}: CreateTaskWorldInput): TaskWorld {
  return {
    id,
    title,
    status: 'queued',
    rooms: [
      ...CORE_ROOMS.map((room) => ({ ...room })),
      ...extraRooms.map((room) => ({ ...room })),
    ],
  }
}
