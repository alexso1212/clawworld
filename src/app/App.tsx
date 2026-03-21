import { useState } from 'react'
import { mockAbnormalities } from '../adapters/mock/mockWorldState'
import { GameShell } from '../game/GameShell'
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

const publicTasks = [
  { id: 'task-landing', title: 'Landing page rebuild', owner: 'Execution Desk', status: 'In review' },
  { id: 'task-memory', title: 'Memory locker audit', owner: 'Archive Room', status: 'Queued' },
  { id: 'task-bridge', title: 'Bridge Alpha fallback drill', owner: 'Finance Room', status: 'Needs routing' },
]

const privateTask = {
  id: 'task-clawworld-core',
  title: 'Clawworld office shell',
  stage: 'Office standby scene',
  route: 'Official API with bridge fallback',
  tools: ['memory', 'task-board', 'phaser'],
  blocker: 'Interactive whiteboard details still being wired',
}

export default function App() {
  const [activePanel, setActivePanel] = useState<ActivePanelId>(null)
  const [sceneView, setSceneView] = useState<SceneView>('main-office')
  const [completedNotes, setCompletedNotes] = useState<string[]>([])

  const activeAbnormality =
    activePanel && activePanel.startsWith('abnormality-') && activePanel !== 'abnormality-register'
      ? mockAbnormalities.find((item) => `abnormality-${item.id}` === activePanel) ?? null
      : null

  const handleMarkerSelect = (surfaceId: string) => {
    if (surfaceId === 'meeting-whiteboard' || surfaceId === 'boss-whiteboard') {
      setActivePanel(surfaceId)
      return
    }

    if (surfaceId === 'portal-website-refresh') {
      setActivePanel(null)
      setSceneView('task-world')
      setCompletedNotes((current) =>
        current.includes('Delivered: Website Refresh')
          ? current
          : [...current, 'Delivered: Website Refresh'],
      )
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
      <GameShell onMarkerSelect={handleMarkerSelect} sceneView={sceneView} />
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
            abnormalities={mockAbnormalities}
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
