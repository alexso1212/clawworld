import type { ClawworldRuntimeSession } from '../../adapters/openclaw/types'
import type {
  OpenClawAccessEvent,
  OpenClawResourceTelemetry,
  OpenClawSnapshot,
  ResourcePartitionId,
  ResourceTelemetryStatus,
} from '../../core/types'

const RESOURCE_BY_ROOM = {
  reception: 'document',
  dispatch: 'gateway',
  requirements: 'schedule',
  decomposition: 'skills',
  execution: 'agent',
  review: 'log',
  memory: 'memory',
} as const satisfies Record<ClawworldRuntimeSession['currentRoomId'], ResourcePartitionId>

function shiftedIso(iso: string, offsetMinutes: number) {
  return new Date(new Date(iso).getTime() + offsetMinutes * 60_000).toISOString()
}

function cloneResource(resource: OpenClawResourceTelemetry): OpenClawResourceTelemetry {
  return {
    ...resource,
    items: resource.items?.map((item) => ({
      ...item,
      stats: item.stats?.map((stat) => ({ ...stat })),
    })),
  }
}

function patchResource(
  resources: OpenClawResourceTelemetry[],
  resourceId: ResourcePartitionId,
  patch: Partial<OpenClawResourceTelemetry>,
) {
  return resources.map((resource) =>
    resource.id === resourceId
      ? {
          ...resource,
          ...patch,
        }
      : resource,
  )
}

function makeEvent(
  generatedAt: string,
  resourceId: ResourcePartitionId,
  label: string,
  detail: string,
  source: string,
  status: ResourceTelemetryStatus,
  offsetMinutes: number,
): OpenClawAccessEvent {
  return {
    id: `${resourceId}-${offsetMinutes}-${detail.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    resourceId,
    label,
    occurredAt: shiftedIso(generatedAt, offsetMinutes),
    detail,
    status,
    source,
  }
}

export function applyClawworldDemoSnapshot(
  baseSnapshot: OpenClawSnapshot,
  session: ClawworldRuntimeSession,
): OpenClawSnapshot {
  const currentResourceId = RESOURCE_BY_ROOM[session.currentRoomId] ?? 'agent'
  const primaryTool = session.tools[0]
  const hasRouteAlert = session.route.status !== 'healthy'
  const hasReserveAlert = session.reserve.state !== 'healthy'
  const hasToolAlert = primaryTool ? primaryTool.state !== 'ready' : false
  const hasAbnormalities = session.abnormalities.length > 0
  const primaryAbnormality = session.abnormality?.triageCard

  let resources = baseSnapshot.resources.map(cloneResource)

  resources = patchResource(resources, 'gateway', {
    status: hasRouteAlert || hasToolAlert ? 'alert' : 'active',
    summary: `${session.route.label} · ${session.route.status}`,
    detail: `${session.route.label} is ${session.route.status}${primaryTool ? ` · ${primaryTool.label} ${primaryTool.state}` : ''}`,
    source: 'clawworld/infrastructure-route',
    lastAccessAt: shiftedIso(baseSnapshot.generatedAt, -7),
  })

  resources = patchResource(resources, 'alarm', {
    status: hasAbnormalities ? 'alert' : 'idle',
    summary: hasAbnormalities
      ? `${session.abnormalities.length} active clawworld blockers`
      : 'alarm clear',
    detail: hasAbnormalities
      ? session.abnormalities.map((abnormality) => abnormality.triageCard.title).join(' · ')
      : 'No active clawworld blockers',
    source: 'clawworld/diagnostics',
    lastAccessAt: hasAbnormalities ? shiftedIso(baseSnapshot.generatedAt, -2) : baseSnapshot.generatedAt,
  })

  resources = patchResource(resources, 'agent', {
    status: 'active',
    summary: `${session.title} · ${session.currentRoomLabel}`,
    detail: `${session.currentWorkerLabel} holding ${session.currentRoomLabel}`,
    source: 'clawworld/runtime-session',
    lastAccessAt: shiftedIso(baseSnapshot.generatedAt, -3),
  })

  resources = patchResource(resources, 'break_room', {
    status: hasReserveAlert ? 'alert' : 'active',
    summary: `reserve ${session.reserve.state} · route ${session.route.status}`,
    detail: `Reserve ${session.reserve.state}${primaryTool ? ` · ${primaryTool.label} ${primaryTool.state}` : ''}`,
    source: 'clawworld/health-watch',
    lastAccessAt: shiftedIso(baseSnapshot.generatedAt, -5),
  })

  resources = patchResource(resources, currentResourceId, {
    status: 'active',
    summary: `${session.title} · ${session.currentRoomLabel}`,
    detail: `${session.currentWorkerLabel} working ${session.currentRoomLabel.toLowerCase()}`,
    source: 'clawworld/task-world',
    lastAccessAt: shiftedIso(baseSnapshot.generatedAt, -1),
  })

  const focusResourceId = hasAbnormalities ? 'alarm' : currentResourceId
  const focusLabel = resources.find((resource) => resource.id === focusResourceId)?.label ?? focusResourceId

  const recentEvents: OpenClawAccessEvent[] = [
    makeEvent(
      baseSnapshot.generatedAt,
      'agent',
      'Run Dock',
      `${session.currentWorkerLabel} is carrying ${session.title} through ${session.currentRoomLabel}`,
      'clawworld/runtime-session',
      'active',
      -3,
    ),
    makeEvent(
      baseSnapshot.generatedAt,
      'gateway',
      'Interface Gateway',
      `${session.route.label} ${session.route.status}${primaryTool ? ` · ${primaryTool.label} ${primaryTool.state}` : ''}`,
      'clawworld/infrastructure-route',
      hasRouteAlert || hasToolAlert ? 'alert' : 'active',
      -2,
    ),
  ]

  if (hasReserveAlert) {
    recentEvents.push(
      makeEvent(
        baseSnapshot.generatedAt,
        'break_room',
        'Break Room',
        `Reserve ${session.reserve.state} is shaping route choices`,
        'clawworld/health-watch',
        'alert',
        -1,
      ),
    )
  }

  if (primaryAbnormality) {
    recentEvents.push(
      makeEvent(
        baseSnapshot.generatedAt,
        'alarm',
        'Alert Deck',
        `${primaryAbnormality.title} · ${primaryAbnormality.impact}`,
        'clawworld/diagnostics',
        'alert',
        0,
      ),
    )
  }

  return {
    ...baseSnapshot,
    resources,
    recentEvents: recentEvents.sort(
      (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
    ),
    focus: {
      resourceId: focusResourceId,
      label: focusLabel,
      occurredAt: hasAbnormalities ? shiftedIso(baseSnapshot.generatedAt, 0) : shiftedIso(baseSnapshot.generatedAt, -1),
      detail: hasAbnormalities
        ? `${primaryAbnormality?.impact ?? 'triage required'}`
        : `${session.title} · ${session.currentWorkerLabel} in ${session.currentRoomLabel}`,
      reason: hasAbnormalities
        ? 'clawworld abnormality triage'
        : 'clawworld task follow',
    },
  }
}
