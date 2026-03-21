import { create } from 'zustand'
import { mockOpenClawSession } from '../adapters/mock/mockWorldState'
import type { ClawworldBoardTask, OpenClawGatewaySessionsList } from '../adapters/openclaw/gatewayTypes'
import { mapGatewaySessionsFeed } from '../adapters/openclaw/gatewaySessionsAdapter'
import { mapOpenClawSession } from '../adapters/openclaw/openclawAdapter'
import type {
  ClawworldRuntimeSession,
  OpenClawSessionPayload,
} from '../adapters/openclaw/types'

export type ClawworldStoreState = {
  source: 'mock' | 'live-event' | 'live-gateway'
  session: ClawworldRuntimeSession
  boardTasks: ClawworldBoardTask[]
  hydrateFromOpenClaw: (payload: OpenClawSessionPayload) => void
  hydrateFromGatewaySessions: (snapshot: OpenClawGatewaySessionsList) => void
  useMockSession: () => void
}

const mockRuntimeSession = mapOpenClawSession(mockOpenClawSession)

function createBoardTask(session: ClawworldRuntimeSession): ClawworldBoardTask {
  return {
    id: session.sessionId,
    title: session.title,
    owner: session.currentWorkerLabel,
    status: session.currentRoomLabel,
  }
}

export const useClawworldStore = create<ClawworldStoreState>((set) => ({
  source: 'mock',
  session: mockRuntimeSession,
  boardTasks: [createBoardTask(mockRuntimeSession)],
  hydrateFromOpenClaw: (payload) => {
    const session = mapOpenClawSession(payload)

    set({
      source: 'live-event',
      session,
      boardTasks: [createBoardTask(session)],
    })
  },
  hydrateFromGatewaySessions: (snapshot) => {
    const feed = mapGatewaySessionsFeed(snapshot)
    const session = feed.primaryPayload
      ? mapOpenClawSession(feed.primaryPayload)
      : mockRuntimeSession

    set({
      source: 'live-gateway',
      session,
      boardTasks: feed.boardTasks.length ? feed.boardTasks : [createBoardTask(session)],
    })
  },
  useMockSession: () =>
    set({
      source: 'mock',
      session: mockRuntimeSession,
      boardTasks: [createBoardTask(mockRuntimeSession)],
    }),
}))
