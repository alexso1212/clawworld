import {
  createReserve,
  createRoute,
  createToolLocker,
  deriveBudgetSignal,
  deriveRouteSignal,
  deriveToolSignal,
} from '../../domain/infrastructure'
import { createAbnormality } from '../../domain/diagnostics'

const reserve = createReserve({
  id: 'official-budget',
  label: 'Official Budget',
  balanceRatio: 0.22,
})

const route = createRoute({
  id: 'bridge-alpha',
  label: 'Bridge Alpha',
  type: 'bridge',
  status: 'rerouting',
})

const toolLocker = createToolLocker({
  id: 'memory-locker',
  label: 'Memory Locker',
  toolIds: ['memory'],
  state: 'blocked',
})

export const mockInfrastructureState = {
  reserve,
  route,
  toolLocker,
  signals: [
    deriveBudgetSignal(reserve.state),
    deriveRouteSignal(route.status),
    deriveToolSignal(toolLocker.state),
  ],
}

export const mockAbnormalities = [
  createAbnormality('finance-low'),
  createAbnormality('bridge-down'),
  createAbnormality('tool-locker-blocked'),
]
