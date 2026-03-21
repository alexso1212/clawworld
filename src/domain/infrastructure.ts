import type {
  BudgetReserve,
  InfrastructureRoute,
  InfrastructureSignal,
  ReserveState,
  RouteType,
  ToolLocker,
  ToolLockerState,
  RouteStatus,
  SignalSeverity,
} from './types'

export type { ReserveState, RouteType, RouteStatus, ToolLockerState }

function severityForRoute(status: RouteStatus): SignalSeverity {
  if (status === 'healthy') {
    return 'stable'
  }

  if (status === 'rerouting') {
    return 'warning'
  }

  return 'critical'
}

function severityForTool(state: ToolLockerState): SignalSeverity {
  if (state === 'ready') {
    return 'stable'
  }

  if (state === 'retrieving' || state === 'blocked') {
    return 'warning'
  }

  return 'critical'
}

type CreateRouteInput = {
  id: string
  label: string
  type: RouteType
  status?: RouteStatus
}

type CreateToolLockerInput = {
  id: string
  label: string
  toolIds: string[]
  state?: ToolLockerState
}

type CreateReserveInput = {
  id: string
  label: string
  balanceRatio: number
}

export function classifyReserveState(balanceRatio: number): ReserveState {
  if (balanceRatio <= 0) {
    return 'exhausted'
  }

  if (balanceRatio <= 0.25) {
    return 'low'
  }

  if (balanceRatio <= 0.5) {
    return 'tightening'
  }

  return 'healthy'
}

export function createReserve({
  id,
  label,
  balanceRatio,
}: CreateReserveInput): BudgetReserve {
  return {
    id,
    label,
    balanceRatio,
    state: classifyReserveState(balanceRatio),
  }
}

export function createRoute({
  id,
  label,
  type,
  status = 'healthy',
}: CreateRouteInput): InfrastructureRoute {
  return {
    id,
    label,
    type,
    status,
  }
}

export function createToolLocker({
  id,
  label,
  toolIds,
  state = 'ready',
}: CreateToolLockerInput): ToolLocker {
  return {
    id,
    label,
    toolIds,
    state,
  }
}

export function deriveBudgetSignal(state: ReserveState): InfrastructureSignal {
  return {
    severity: state === 'healthy' ? 'stable' : state === 'exhausted' ? 'critical' : 'warning',
    room: 'finance',
    label: state === 'healthy' ? 'Finance Reserve' : 'Finance Warning',
  }
}

export function deriveRouteSignal(status: RouteStatus): InfrastructureSignal {
  return {
    severity: severityForRoute(status),
    room: 'bridge-route',
    label: 'Bridge Route',
  }
}

export function deriveToolSignal(state: ToolLockerState): InfrastructureSignal {
  return {
    severity: severityForTool(state),
    room: 'tool-locker',
    label: 'Tool Locker',
  }
}
