import type { OpenClawSessionPayload } from './types'

export type OpenClawGatewaySessionEntry = {
  key: string
  kind: 'direct' | 'group'
  displayName?: string
  channel?: string
  subject?: string
  groupChannel?: string
  updatedAt: number
  sessionId: string
  systemSent?: boolean
  abortedLastRun?: boolean
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  totalTokensFresh?: boolean
  remainingTokens?: number | null
  percentUsed?: number | null
  modelProvider?: string
  model?: string
  contextTokens?: number
}

export type OpenClawGatewaySessionsList = {
  ts: number
  path: string
  count: number
  defaults: {
    modelProvider?: string
    model?: string
    contextTokens?: number
  }
  sessions: OpenClawGatewaySessionEntry[]
}

export type ClawworldBoardTask = {
  id: string
  title: string
  owner: string
  status: string
}

export type ClawworldGatewayFeed = {
  boardTasks: ClawworldBoardTask[]
  primaryPayload: OpenClawSessionPayload | null
}
