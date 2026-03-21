import { classifyReserveState } from '../../domain/infrastructure'
import { mapOpenClawSession } from './openclawAdapter'
import type { ClawworldGatewayFeed, OpenClawGatewaySessionEntry, OpenClawGatewaySessionsList } from './gatewayTypes'
import type {
  OpenClawAbnormalityCode,
  OpenClawSessionPayload,
  OpenClawWorkerId,
} from './types'

function titleCase(value: string) {
  return value
    .split(/[\s:-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function resolveTitle(entry: OpenClawGatewaySessionEntry) {
  if (entry.subject) {
    return entry.subject
  }

  if (entry.groupChannel) {
    return titleCase(entry.groupChannel.replace(/^#/, ''))
  }

  if (entry.displayName) {
    const hashLabel = entry.displayName.split('#').pop()
    if (hashLabel && hashLabel !== entry.displayName) {
      return titleCase(hashLabel)
    }

    if (!/^discord:g-|^telegram:/.test(entry.displayName)) {
      return titleCase(entry.displayName)
    }
  }

  if (entry.key === 'agent:main:main') {
    return 'Main Console'
  }

  const tail = entry.key.split(':').at(-1) ?? 'Session'
  return titleCase(tail.replace(/^#/, ''))
}

function resolveRoute(entry: OpenClawGatewaySessionEntry): OpenClawSessionPayload['route'] {
  const provider = entry.modelProvider?.toLowerCase() ?? ''

  if (provider.includes('bridge')) {
    return 'bridge'
  }

  if (provider === 'aipro' || provider === 'ollama') {
    return 'relay'
  }

  return 'official'
}

function resolveReserveState(entry: OpenClawGatewaySessionEntry): OpenClawSessionPayload['reserveState'] {
  const contextTokens = entry.contextTokens ?? 272000

  if (typeof entry.remainingTokens === 'number') {
    return classifyReserveState(entry.remainingTokens / contextTokens)
  }

  if (typeof entry.percentUsed === 'number') {
    return classifyReserveState(Math.max(0, 1 - entry.percentUsed / 100))
  }

  if (entry.totalTokensFresh === false) {
    return 'tightening'
  }

  return 'healthy'
}

function resolvePhase(
  entry: OpenClawGatewaySessionEntry,
  reserveState: OpenClawSessionPayload['reserveState'],
): OpenClawSessionPayload['phase'] {
  if (entry.key.includes(':heartbeat') || entry.systemSent && entry.key.includes('heartbeat')) {
    return 'memory'
  }

  if (entry.abortedLastRun) {
    return 'review'
  }

  if (reserveState === 'low' || reserveState === 'exhausted') {
    return 'review'
  }

  if (entry.kind === 'group') {
    return 'execution'
  }

  if (typeof entry.percentUsed === 'number' && entry.percentUsed >= 50) {
    return 'execution'
  }

  if (typeof entry.percentUsed === 'number' && entry.percentUsed >= 20) {
    return 'requirements'
  }

  return 'dispatch'
}

function resolveWorker(phase: OpenClawSessionPayload['phase']): OpenClawWorkerId {
  if (phase === 'review') {
    return 'reviewer'
  }

  if (phase === 'execution') {
    return 'executor'
  }

  if (phase === 'memory') {
    return 'memory-curator'
  }

  return 'amane'
}

function resolveToolState(entry: OpenClawGatewaySessionEntry): OpenClawSessionPayload['toolState'] {
  if (entry.abortedLastRun) {
    return 'blocked'
  }

  if (entry.totalTokensFresh === false && entry.kind === 'group') {
    return 'retrieving'
  }

  return 'ready'
}

function resolveRouteStatus(
  entry: OpenClawGatewaySessionEntry,
  route: OpenClawSessionPayload['route'],
): OpenClawSessionPayload['routeStatus'] {
  if (entry.abortedLastRun) {
    return 'blocked'
  }

  if (route === 'bridge') {
    return 'rerouting'
  }

  return 'healthy'
}

function resolveAbnormality(
  route: OpenClawSessionPayload['route'],
  routeStatus: OpenClawSessionPayload['routeStatus'],
  reserveState: OpenClawSessionPayload['reserveState'],
  toolState: OpenClawSessionPayload['toolState'],
): OpenClawAbnormalityCode {
  if (route === 'bridge' && routeStatus !== 'healthy') {
    return 'bridge-down'
  }

  if (reserveState === 'low' || reserveState === 'exhausted') {
    return 'finance-low'
  }

  if (toolState === 'blocked') {
    return 'tool-locker-blocked'
  }

  return null
}

function resolveTools(entry: OpenClawGatewaySessionEntry, route: OpenClawSessionPayload['route']) {
  const tools = ['memory']

  if (entry.kind === 'group') {
    tools.push('routing')
  }

  if (route === 'bridge') {
    tools.push('bridge')
  }

  return tools
}

function toPayload(entry: OpenClawGatewaySessionEntry): OpenClawSessionPayload {
  const route = resolveRoute(entry)
  const reserveState = resolveReserveState(entry)
  const phase = resolvePhase(entry, reserveState)
  const toolState = resolveToolState(entry)
  const routeStatus = resolveRouteStatus(entry, route)

  return {
    id: entry.sessionId,
    title: resolveTitle(entry),
    phase,
    worker: resolveWorker(phase),
    route,
    tools: resolveTools(entry, route),
    abnormality: resolveAbnormality(route, routeStatus, reserveState, toolState),
    reserveState,
    routeStatus,
    toolState,
  }
}

export function mapGatewaySessionEntryToPayload(entry: OpenClawGatewaySessionEntry) {
  return toPayload(entry)
}

export function mapGatewaySessionsFeed(
  snapshot: OpenClawGatewaySessionsList,
): ClawworldGatewayFeed {
  const taskEntries = snapshot.sessions
    .filter((entry) => !entry.key.includes(':heartbeat'))
    .sort((left, right) => right.updatedAt - left.updatedAt)

  const payloads = taskEntries.map(toPayload)
  const boardTasks = payloads.map((payload) => {
    const runtime = mapOpenClawSession(payload)

    return {
      id: runtime.sessionId,
      title: runtime.title,
      owner: runtime.currentWorkerLabel,
      status: runtime.currentRoomLabel,
    }
  })

  return {
    boardTasks,
    primaryPayload: payloads[0] ?? null,
  }
}
