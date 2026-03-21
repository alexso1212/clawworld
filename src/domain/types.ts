export type CoreRoomId =
  | 'reception'
  | 'dispatch'
  | 'requirements'
  | 'decomposition'
  | 'execution'
  | 'review'
  | 'memory'

export type RoomStatus = 'idle' | 'active' | 'blocked' | 'complete'

export type TaskRoom = {
  id: CoreRoomId | string
  label: string
  status: RoomStatus
  isCore: boolean
}

export type TaskWorldStatus = 'queued' | 'active' | 'blocked' | 'complete'

export type TaskWorld = {
  id: string
  title: string
  rooms: TaskRoom[]
  status: TaskWorldStatus
}

export type ReserveState = 'healthy' | 'tightening' | 'low' | 'exhausted'

export type RouteType = 'official' | 'bridge' | 'relay'
export type RouteStatus = 'healthy' | 'rerouting' | 'blocked' | 'offline'

export type BudgetReserve = {
  id: string
  label: string
  balanceRatio: number
  state: ReserveState
}

export type InfrastructureRoute = {
  id: string
  label: string
  type: RouteType
  status: RouteStatus
}

export type ToolLockerState = 'ready' | 'retrieving' | 'blocked' | 'error'

export type ToolLocker = {
  id: string
  label: string
  toolIds: string[]
  state: ToolLockerState
}

export type SignalSeverity = 'stable' | 'warning' | 'critical'

export type InfrastructureSignal = {
  severity: SignalSeverity
  room: string
  label: string
}

export type TriageCard = {
  code: string
  objectId: string
  title: string
  whatHappened: string
  impact: string
  firstCheck: string
}

export type Abnormality = {
  id: string
  marker: '!'
  triageCard: TriageCard
}
