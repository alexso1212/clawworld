import { mapOpenClawSession } from '../openclaw/openclawAdapter'
import type { OpenClawSessionPayload } from '../openclaw/types'

export const mockOpenClawSession: OpenClawSessionPayload = {
  id: 'website-refresh',
  title: 'Website Refresh',
  phase: 'review',
  worker: 'reviewer',
  route: 'bridge',
  tools: ['memory'],
  abnormality: 'bridge-down',
  reserveState: 'low',
  routeStatus: 'rerouting',
  toolState: 'blocked',
}

export const mockRuntimeSession = mapOpenClawSession(mockOpenClawSession)

export const mockInfrastructureState = {
  reserve: mockRuntimeSession.reserve,
  route: mockRuntimeSession.route,
  toolLocker: mockRuntimeSession.tools[0],
  signals: mockRuntimeSession.signals,
}

export const mockAbnormalities = mockRuntimeSession.abnormalities
