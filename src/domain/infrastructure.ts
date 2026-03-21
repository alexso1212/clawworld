import type {
  BudgetReserve,
  InfrastructureRoute,
  ReserveState,
  RouteType,
  ToolLocker,
  ToolLockerState,
  RouteStatus,
} from './types'

export type { ReserveState, RouteType, RouteStatus, ToolLockerState }

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
