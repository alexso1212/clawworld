import { createAbnormality } from '../../domain/diagnostics'
import {
  createReserve,
  createRoute,
  createToolLocker,
  deriveBudgetSignal,
  deriveRouteSignal,
  deriveToolSignal,
} from '../../domain/infrastructure'
import { CORE_ROOMS, createTaskWorld } from '../../domain/taskWorld'
import type { CoreRoomId, TaskRoom } from '../../domain/types'
import type {
  ClawworldRuntimeSession,
  OpenClawAbnormalityCode,
  OpenClawSessionPayload,
  OpenClawWorkerId,
} from './types'

const reserveRatioByState = {
  healthy: 0.82,
  tightening: 0.45,
  low: 0.2,
  exhausted: 0,
} as const

const workerLabelById: Record<OpenClawWorkerId, string> = {
  amane: 'Amane',
  executor: 'Executor',
  reviewer: 'Reviewer',
  'memory-curator': 'Memory Curator',
}

const routeLabelByType = {
  official: 'Official Route',
  bridge: 'Bridge Route',
  relay: 'Relay Route',
} as const

const roomLabelById = Object.fromEntries(
  CORE_ROOMS.map((room) => [room.id, room.label]),
) as Record<CoreRoomId, string>

function deriveRouteStatus(payload: OpenClawSessionPayload) {
  if (payload.routeStatus) {
    return payload.routeStatus
  }

  if (payload.route === 'bridge' && payload.abnormality === 'bridge-down') {
    return 'rerouting'
  }

  return 'healthy'
}

function deriveToolState(payload: OpenClawSessionPayload) {
  if (payload.toolState) {
    return payload.toolState
  }

  if (payload.abnormality === 'tool-locker-blocked') {
    return 'blocked'
  }

  return 'ready'
}

function deriveAbnormalityCodes(
  payload: OpenClawSessionPayload,
): Exclude<OpenClawAbnormalityCode, null>[] {
  const codes = new Set<Exclude<OpenClawAbnormalityCode, null>>()

  if (payload.abnormality) {
    codes.add(payload.abnormality)
  }

  if (payload.reserveState !== 'healthy') {
    codes.add('finance-low')
  }

  if (deriveRouteStatus(payload) !== 'healthy') {
    codes.add('bridge-down')
  }

  if (deriveToolState(payload) !== 'ready') {
    codes.add('tool-locker-blocked')
  }

  return [...codes]
}

function mapTaskRooms(currentRoomId: CoreRoomId): TaskRoom[] {
  const currentIndex = CORE_ROOMS.findIndex((room) => room.id === currentRoomId)

  return CORE_ROOMS.map((room, index) => ({
    ...room,
    status:
      index < currentIndex
        ? 'complete'
        : index === currentIndex
          ? 'active'
          : 'idle',
  }))
}

export function mapOpenClawSession(
  payload: OpenClawSessionPayload,
): ClawworldRuntimeSession {
  const routeStatus = deriveRouteStatus(payload)
  const toolState = deriveToolState(payload)
  const reserve = createReserve({
    id: `${payload.route}-budget`,
    label: `${routeLabelByType[payload.route]} Budget`,
    balanceRatio: reserveRatioByState[payload.reserveState],
  })
  const route = createRoute({
    id: `${payload.route}-route`,
    label: routeLabelByType[payload.route],
    type: payload.route,
    status: routeStatus,
  })
  const tools = payload.tools.map((toolId) =>
    createToolLocker({
      id: `${toolId}-locker`,
      label: `${toolId === 'memory' ? 'Memory' : toolId} Locker`,
      toolIds: [toolId],
      state: toolState,
    }),
  )
  const abnormalities = deriveAbnormalityCodes(payload).map((code) =>
    createAbnormality(code),
  )
  const taskWorld = createTaskWorld({
    id: payload.id,
    title: payload.title ?? 'Untitled Session',
  })
  taskWorld.status = payload.phase === 'memory' ? 'complete' : 'active'
  taskWorld.rooms = mapTaskRooms(payload.phase)

  return {
    sessionId: payload.id,
    title: payload.title ?? 'Untitled Session',
    currentRoomId: payload.phase,
    currentRoomLabel: roomLabelById[payload.phase],
    currentWorkerId: payload.worker,
    currentWorkerLabel: workerLabelById[payload.worker],
    route,
    tools,
    reserve,
    signals: [
      deriveBudgetSignal(payload.reserveState),
      deriveRouteSignal(route.status),
      deriveToolSignal(toolState),
    ],
    abnormality: abnormalities[0] ?? null,
    abnormalities,
    taskWorld,
    completedNotes:
      payload.phase === 'review' || payload.phase === 'memory'
        ? [`Delivered: ${payload.title ?? 'Untitled Session'}`]
        : [],
  }
}
