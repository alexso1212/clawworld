import type {
  Abnormality,
  BudgetReserve,
  CoreRoomId,
  InfrastructureRoute,
  InfrastructureSignal,
  ReserveState,
  RouteStatus,
  RouteType,
  TaskWorld,
  ToolLocker,
  ToolLockerState,
} from '../../domain/types'

export type OpenClawWorkerId = 'amane' | 'executor' | 'reviewer' | 'memory-curator'
export type OpenClawAbnormalityCode =
  | 'bridge-down'
  | 'finance-low'
  | 'tool-locker-blocked'
  | null

export type OpenClawSessionPayload = {
  id: string
  title?: string
  phase: CoreRoomId
  worker: OpenClawWorkerId
  route: RouteType
  tools: string[]
  abnormality: OpenClawAbnormalityCode
  reserveState: ReserveState
  routeStatus?: RouteStatus
  toolState?: ToolLockerState
}

export type ClawworldRuntimeSession = {
  sessionId: string
  title: string
  currentRoomId: CoreRoomId
  currentRoomLabel: string
  currentWorkerId: OpenClawWorkerId
  currentWorkerLabel: string
  route: InfrastructureRoute
  tools: ToolLocker[]
  reserve: BudgetReserve
  signals: InfrastructureSignal[]
  abnormality: Abnormality | null
  abnormalities: Abnormality[]
  taskWorld: TaskWorld
  completedNotes: string[]
}
