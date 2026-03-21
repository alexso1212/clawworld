import { useState } from 'react'
import { GameShell } from '../game/GameShell'
import { useClawworldStore } from '../state/clawworldStore'
import {
  deriveAbnormalities,
  deriveCompletedNotes,
  derivePrivateTask,
  deriveWallDisplayItems,
  selectBoardTasks,
  selectRuntimeSession,
} from '../state/selectors'
import { AbnormalityRegister } from '../ui/AbnormalityRegister'
import { TaskDetailDrawer } from '../ui/TaskDetailDrawer'
import { TriageCard } from '../ui/TriageCard'
import { WhiteboardDrawer } from '../ui/WhiteboardDrawer'

type SurfaceId = 'meeting-whiteboard' | 'boss-whiteboard' | null
type SceneView = 'main-office' | 'task-world'
type ActivePanelId =
  | SurfaceId
  | 'abnormality-register'
  | 'abnormality-finance-low'
  | 'abnormality-bridge-down'
  | 'abnormality-tool-locker-blocked'
  | null

export default function App() {
  const [activePanel, setActivePanel] = useState<ActivePanelId>(null)
  const [sceneView, setSceneView] = useState<SceneView>('main-office')
  const runtimeSession = useClawworldStore(selectRuntimeSession)
  const publicTasks = useClawworldStore(selectBoardTasks)
  const privateTask = derivePrivateTask(runtimeSession)
  const completedNotes = deriveCompletedNotes(runtimeSession)
  const abnormalityList = deriveAbnormalities(runtimeSession)
  const wallDisplayItems = deriveWallDisplayItems(runtimeSession, publicTasks.length)

  const activeAbnormality =
    activePanel && activePanel.startsWith('abnormality-') && activePanel !== 'abnormality-register'
      ? abnormalityList.find((item) => `abnormality-${item.id}` === activePanel) ?? null
      : null

  const handleMarkerSelect = (surfaceId: string) => {
    if (surfaceId === 'meeting-whiteboard' || surfaceId === 'boss-whiteboard') {
      setActivePanel(surfaceId)
      return
    }

    if (surfaceId === 'portal-website-refresh') {
      setActivePanel(null)
      setSceneView('task-world')
      return
    }

    if (surfaceId === 'return-main-office') {
      setActivePanel(null)
      setSceneView('main-office')
      return
    }

    if (
      surfaceId === 'abnormality-register' ||
      surfaceId === 'abnormality-finance-low' ||
      surfaceId === 'abnormality-bridge-down' ||
      surfaceId === 'abnormality-tool-locker-blocked'
    ) {
      setActivePanel(surfaceId)
    }
  }

  return (
    <main className="app-shell">
      <header className="office-banner">Clawworld</header>
      <GameShell
        displayItems={wallDisplayItems}
        onMarkerSelect={handleMarkerSelect}
        runtimeSession={runtimeSession}
        sceneView={sceneView}
      />
      <section
        aria-label="Clawworld overlay root"
        className={`overlay-root${activePanel ? ' overlay-root--active' : ''}`}
        data-testid="overlay-root"
      >
        {activePanel === 'meeting-whiteboard' ? (
          <WhiteboardDrawer
            title="Team Task Board"
            subtitle="Meeting Room Whiteboard"
            tasks={publicTasks}
            completedNotes={completedNotes}
            onClose={() => setActivePanel(null)}
          />
        ) : null}

        {activePanel === 'boss-whiteboard' ? (
          <TaskDetailDrawer
            title="Boss Office Whiteboard"
            task={privateTask}
            onClose={() => setActivePanel(null)}
          />
        ) : null}

        {activePanel === 'abnormality-register' ? (
          <AbnormalityRegister
            abnormalities={abnormalityList}
            onClose={() => setActivePanel(null)}
          />
        ) : null}

        {activeAbnormality ? (
          <TriageCard
            card={activeAbnormality.triageCard}
            onClose={() => setActivePanel(null)}
          />
        ) : null}

        {!activePanel ? (
          <p className="overlay-placeholder">
            {sceneView === 'main-office'
              ? 'Walk up to a whiteboard in the office to inspect task flow.'
              : 'Task world open. Follow the fixed rooms to watch the assignment move.'}
          </p>
        ) : null}
      </section>
    </main>
  )
}
