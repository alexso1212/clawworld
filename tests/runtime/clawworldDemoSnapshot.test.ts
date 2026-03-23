import { describe, expect, it } from 'vitest'
import type { OpenClawSnapshot, OpenClawResourceTelemetry, ResourcePartitionId } from '../../src/core/types'
import { mockRuntimeSession } from '../../src/adapters/mock/mockWorldState'
import { applyClawworldDemoSnapshot } from '../../src/runtime/systems/clawworldDemoSnapshot'

function resource(resourceId: ResourcePartitionId): OpenClawResourceTelemetry {
  return {
    id: resourceId,
    label: resourceId,
    status: 'idle',
    itemCount: 1,
    lastAccessAt: '2026-03-23T14:00:00.000Z',
    summary: `summary-${resourceId}`,
    detail: `detail-${resourceId}`,
    source: `source-${resourceId}`,
    items: [],
  }
}

describe('clawworld demo snapshot adapter', () => {
  it('maps clawworld route, alert, worker, and reserve signals into the game telemetry rooms', () => {
    const baseSnapshot: OpenClawSnapshot = {
      mode: 'mock',
      generatedAt: '2026-03-23T14:08:00.000Z',
      resources: [
        resource('gateway'),
        resource('alarm'),
        resource('agent'),
        resource('break_room'),
        resource('log'),
        resource('memory'),
      ],
      recentEvents: [],
      focus: {
        resourceId: 'break_room',
        label: 'break_room',
        occurredAt: null,
        detail: 'idle',
        reason: 'idle',
      },
    }

    const adapted = applyClawworldDemoSnapshot(baseSnapshot, mockRuntimeSession)
    const gateway = adapted.resources.find((entry) => entry.id === 'gateway')
    const alarm = adapted.resources.find((entry) => entry.id === 'alarm')
    const agent = adapted.resources.find((entry) => entry.id === 'agent')
    const breakRoom = adapted.resources.find((entry) => entry.id === 'break_room')

    expect(gateway?.status).toBe('alert')
    expect(gateway?.detail).toContain(mockRuntimeSession.route.label)
    expect(gateway?.detail).toContain(mockRuntimeSession.route.status)

    expect(alarm?.status).toBe('alert')
    expect(alarm?.detail).toContain(mockRuntimeSession.abnormalities[0]?.triageCard.title ?? '')

    expect(agent?.status).toBe('active')
    expect(agent?.detail).toContain(mockRuntimeSession.currentWorkerLabel)
    expect(agent?.detail).toContain(mockRuntimeSession.currentRoomLabel)

    expect(breakRoom?.detail).toContain(mockRuntimeSession.reserve.state)
    expect(breakRoom?.detail).toContain(mockRuntimeSession.tools[0]?.state ?? '')

    expect(adapted.focus.resourceId).toBe('alarm')
    expect(adapted.recentEvents.some((event) => event.resourceId === 'alarm')).toBe(true)
    expect(adapted.recentEvents.some((event) => event.resourceId === 'agent')).toBe(true)
  })
})
