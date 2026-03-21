import { mapOpenClawSession } from '../../src/adapters/openclaw/openclawAdapter'

test('maps OpenClaw session state into Clawworld scene state', () => {
  const state = mapOpenClawSession({
    id: 's-1',
    title: 'Website Refresh',
    phase: 'execution',
    worker: 'executor',
    route: 'bridge',
    tools: ['memory'],
    abnormality: null,
    reserveState: 'healthy',
    routeStatus: 'healthy',
    toolState: 'ready',
  })

  expect(state.currentRoomId).toBe('execution')
  expect(state.route.type).toBe('bridge')
  expect(state.tools[0].id).toBe('memory-locker')
  expect(state.currentWorkerLabel).toBe('Executor')
  expect(state.taskWorld.rooms.find((room) => room.id === 'execution')?.status).toBe('active')
})
