import {
  classifyReserveState,
  createRoute,
  createToolLocker,
} from '../../src/domain/infrastructure'

test('budget reserves tighten as office cash burns down', () => {
  expect(classifyReserveState(0.8)).toBe('healthy')
  expect(classifyReserveState(0.45)).toBe('tightening')
  expect(classifyReserveState(0.2)).toBe('low')
  expect(classifyReserveState(0)).toBe('exhausted')
})

test('routes and tool lockers keep office infrastructure readable', () => {
  const route = createRoute({
    id: 'bridge-alpha',
    label: 'Bridge Alpha',
    type: 'bridge',
    status: 'rerouting',
  })
  const locker = createToolLocker({
    id: 'memory-locker',
    label: 'Memory Locker',
    toolIds: ['memory'],
    state: 'blocked',
  })

  expect(route.type).toBe('bridge')
  expect(route.status).toBe('rerouting')
  expect(locker.state).toBe('blocked')
})
