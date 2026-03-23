import { describe, expect, it } from 'vitest'
import { mockRuntimeSession } from '../../src/adapters/mock/mockWorldState'
import {
  buildRuntimeAwareLibraryShell,
  resolveLibraryFocusRoomId,
} from '../../src/library/data/libraryRuntimeAdapter'

describe('library runtime adapter', () => {
  it('focuses the alarm board when abnormalities are active', () => {
    expect(resolveLibraryFocusRoomId(mockRuntimeSession)).toBe('alarm-board')
  })

  it('maps the current runtime session into monitor cards and room activity', () => {
    const shell = buildRuntimeAwareLibraryShell(mockRuntimeSession, {
      openTaskCount: 1,
      source: 'mock',
    })

    expect(shell.runtimeCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Transport Source', value: 'Mock Feed' }),
        expect.objectContaining({ label: 'Route Status', value: 'rerouting' }),
        expect.objectContaining({ label: 'Reserve State', value: 'low' }),
        expect.objectContaining({ label: 'Tool Locker', value: 'blocked' }),
      ]),
    )

    expect(shell.statusRail).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Current worker', value: 'Reviewer' }),
        expect.objectContaining({ label: 'Watch state', value: '3 active' }),
      ]),
    )

    expect(shell.rooms.find((room) => room.id === 'alarm-board')?.activity).toContain(
      'Bridge Alpha unavailable',
    )
  })
})
