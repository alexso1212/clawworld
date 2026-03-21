import { CORE_ROOMS, createTaskWorld } from '../../src/domain/taskWorld'

test('task worlds always include the seven core rooms', () => {
  const world = createTaskWorld({ id: 'task-1', title: 'Landing page' })

  expect(CORE_ROOMS).toHaveLength(7)
  expect(world.rooms.map((room) => room.id)).toEqual([
    'reception',
    'dispatch',
    'requirements',
    'decomposition',
    'execution',
    'review',
    'memory',
  ])
})
