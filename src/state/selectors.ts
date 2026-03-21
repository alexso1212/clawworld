import type { OnWallDisplayItem } from '../ui/OnWallDisplay'
import type { ClawworldRuntimeSession } from '../adapters/openclaw/types'
import type { ClawworldStoreState } from './clawworldStore'

export const selectRuntimeSession = (state: ClawworldStoreState) => state.session

export function deriveBoardTasks(session: ClawworldRuntimeSession) {
  return [
    {
      id: session.sessionId,
      title: session.title,
      owner: session.currentWorkerLabel,
      status: session.currentRoomLabel,
    },
  ]
}

export function derivePrivateTask(session: ClawworldRuntimeSession) {
  return {
    id: session.sessionId,
    title: session.title,
    stage: session.currentRoomLabel,
    route: `${session.route.label} · ${session.route.status}`,
    tools: session.tools.map((tool) => tool.label),
    blocker:
      session.abnormality?.triageCard.impact ?? 'No active blockers. Office flow is stable.',
  }
}

export const deriveCompletedNotes = (session: ClawworldRuntimeSession) =>
  session.completedNotes

export const deriveAbnormalities = (session: ClawworldRuntimeSession) =>
  session.abnormalities

export function deriveWallDisplayItems(
  session: ClawworldRuntimeSession,
): OnWallDisplayItem[] {
  return [
    { label: 'Open tasks', value: String(deriveBoardTasks(session).length).padStart(2, '0') },
    { label: 'Budget state', value: session.reserve.state },
    { label: 'Bridge line', value: session.route.status },
  ]
}
