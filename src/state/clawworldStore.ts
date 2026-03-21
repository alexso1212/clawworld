import { create } from 'zustand'
import { mockOpenClawSession } from '../adapters/mock/mockWorldState'
import { mapOpenClawSession } from '../adapters/openclaw/openclawAdapter'
import type {
  ClawworldRuntimeSession,
  OpenClawSessionPayload,
} from '../adapters/openclaw/types'

export type ClawworldStoreState = {
  source: 'mock' | 'live'
  session: ClawworldRuntimeSession
  hydrateFromOpenClaw: (payload: OpenClawSessionPayload) => void
  useMockSession: () => void
}

export const useClawworldStore = create<ClawworldStoreState>((set) => ({
  source: 'mock',
  session: mapOpenClawSession(mockOpenClawSession),
  hydrateFromOpenClaw: (payload) =>
    set({
      source: 'live',
      session: mapOpenClawSession(payload),
    }),
  useMockSession: () =>
    set({
      source: 'mock',
      session: mapOpenClawSession(mockOpenClawSession),
    }),
}))
