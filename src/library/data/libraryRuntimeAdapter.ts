import type { ClawworldRuntimeSession } from '../../adapters/openclaw/types'
import type { ClawworldStoreState } from '../../state/clawworldStore'
import { getLibraryShellManifest } from './libraryShellManifest'
import type {
  LibraryAssetRecord,
  LibraryRoom,
  LibraryRuntimeCard,
  LibraryShellManifest,
  LibraryStatusItem,
} from './libraryShellProtocol'

type LibraryRuntimeOptions = {
  openTaskCount: number
  source: ClawworldStoreState['source']
}

export type RuntimeAwareLibraryShell = {
  focusRoomId: string
  rooms: LibraryRoom[]
  runtimeCards: LibraryRuntimeCard[]
  statusRail: LibraryStatusItem[]
  manifest: LibraryShellManifest
}

const ROOM_BY_PHASE = {
  reception: 'queue-hub',
  dispatch: 'queue-hub',
  requirements: 'document-archive',
  decomposition: 'skill-forge',
  execution: 'code-lab',
  review: 'runtime-monitor',
  memory: 'memory-vault',
} as const

function formatSource(source: ClawworldStoreState['source']) {
  switch (source) {
    case 'live-event':
      return 'Live Event'
    case 'live-gateway':
      return 'Gateway Feed'
    default:
      return 'Mock Feed'
  }
}

function cardToneForState(value: string): LibraryRuntimeCard['tone'] {
  if (value === 'healthy' || value === 'ready' || value === 'stable') {
    return 'live'
  }

  if (value === 'blocked' || value === 'low' || value === 'exhausted' || value === 'rerouting') {
    return 'watch'
  }

  return 'idle'
}

function patchAssetStatus(asset: LibraryAssetRecord, status: string) {
  return {
    ...asset,
    status,
  }
}

function patchRoom(
  room: LibraryRoom,
  session: ClawworldRuntimeSession,
  options: LibraryRuntimeOptions,
  focusRoomId: string,
) {
  const isFocusRoom = room.id === focusRoomId

  if (room.id === 'queue-hub') {
    return {
      ...room,
      assetSummaries: [
        { ...room.assetSummaries[0], value: String(options.openTaskCount).padStart(2, '0') },
        ...room.assetSummaries.slice(1),
      ],
      activity: `${session.currentWorkerLabel} is sorting "${session.title}" toward ${session.currentRoomLabel}.`,
    }
  }

  if (room.id === 'interface-gateway') {
    return {
      ...room,
      assets: room.assets.map((asset, index) =>
        index === 0 ? patchAssetStatus(asset, session.route.status) : asset,
      ),
      activity: `${session.route.label} is ${session.route.status} while carrying ${session.title}.`,
    }
  }

  if (room.id === 'runtime-monitor') {
    return {
      ...room,
      assetSummaries: [
        { ...room.assetSummaries[0], value: String(options.openTaskCount + 411) },
        { ...room.assetSummaries[1], value: String(options.openTaskCount).padStart(2, '0') },
        { ...room.assetSummaries[2], value: session.route.status },
      ],
      assets: room.assets.map((asset, index) =>
        index === 0 ? patchAssetStatus(asset, formatSource(options.source).toLowerCase()) : asset,
      ),
      activity: `${session.currentWorkerLabel} is watching ${session.currentRoomLabel} while ${session.route.label} stays ${session.route.status}.`,
    }
  }

  if (room.id === 'alarm-board') {
    const firstAbnormality = session.abnormalities[0]

    return {
      ...room,
      assets: room.assets.map((asset, index) =>
        index === 0 && firstAbnormality ? patchAssetStatus(asset, 'active') : asset,
      ),
      activity: firstAbnormality
        ? `${firstAbnormality.triageCard.title}. ${firstAbnormality.triageCard.impact}.`
        : 'No active abnormalities. Alarm board is quiet.',
    }
  }

  if (isFocusRoom) {
    return {
      ...room,
      activity: `${session.currentWorkerLabel} is carrying "${session.title}" through ${session.currentRoomLabel}.`,
    }
  }

  return room
}

export function resolveLibraryFocusRoomId(session: ClawworldRuntimeSession) {
  if (session.abnormalities.length > 0) {
    return 'alarm-board'
  }

  return ROOM_BY_PHASE[session.currentRoomId]
}

export function buildRuntimeAwareLibraryShell(
  session: ClawworldRuntimeSession,
  options: LibraryRuntimeOptions,
): RuntimeAwareLibraryShell {
  const base = getLibraryShellManifest()
  const focusRoomId = resolveLibraryFocusRoomId(session)

  const rooms = base.rooms.map((room) => patchRoom(room, session, options, focusRoomId))

  const runtimeCards: LibraryRuntimeCard[] = [
    {
      id: 'transport-source',
      label: 'Transport Source',
      value: formatSource(options.source),
      detail: `${session.route.label} is currently ${session.route.status}.`,
      tone: options.source === 'mock' ? 'idle' : 'live',
    },
    {
      id: 'route-status',
      label: 'Route Status',
      value: session.route.status,
      detail: `${session.route.label} is carrying ${session.title}.`,
      tone: cardToneForState(session.route.status),
    },
    {
      id: 'reserve-state',
      label: 'Reserve State',
      value: session.reserve.state,
      detail: `${session.reserve.label} backs the current room flow.`,
      tone: cardToneForState(session.reserve.state),
    },
    {
      id: 'tool-state',
      label: 'Tool Locker',
      value: session.tools[0]?.state ?? 'ready',
      detail: `${session.currentWorkerLabel} is waiting on ${session.tools[0]?.label ?? 'tool access'}.`,
      tone: cardToneForState(session.tools[0]?.state ?? 'ready'),
    },
  ]

  const statusRail: LibraryStatusItem[] = [
    { id: 'source', label: 'Source', value: formatSource(options.source) },
    { id: 'worker', label: 'Current worker', value: session.currentWorkerLabel },
    { id: 'phase', label: 'Current room', value: session.currentRoomLabel },
    {
      id: 'watch',
      label: 'Watch state',
      value: session.abnormalities.length > 0 ? `${session.abnormalities.length} active` : 'clear',
    },
  ]

  return {
    focusRoomId,
    rooms,
    runtimeCards,
    statusRail,
    manifest: {
      ...base,
      defaultRoomId: focusRoomId,
      rooms,
      runtimeCards,
      statusRail,
    },
  }
}
