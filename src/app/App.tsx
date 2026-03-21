import { useState } from 'react'
import { GameShell } from '../game/GameShell'
import { TaskDetailDrawer } from '../ui/TaskDetailDrawer'
import { WhiteboardDrawer } from '../ui/WhiteboardDrawer'

type SurfaceId = 'meeting-whiteboard' | 'boss-whiteboard' | null

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
  const [activeSurface, setActiveSurface] = useState<SurfaceId>(null)

  const handleSurfaceSelect = (surfaceId: string) => {
    if (surfaceId === 'meeting-whiteboard' || surfaceId === 'boss-whiteboard') {
      setActiveSurface(surfaceId)
    }
  }

  return (
    <main className="app-shell">
      <header className="office-banner">Clawworld</header>
      <GameShell onSurfaceSelect={handleSurfaceSelect} />
      <section
        aria-label="Clawworld overlay root"
        className={`overlay-root${activeSurface ? ' overlay-root--active' : ''}`}
        data-testid="overlay-root"
      >
        {activeSurface === 'meeting-whiteboard' ? (
          <WhiteboardDrawer
            title="Team Task Board"
            subtitle="Meeting Room Whiteboard"
            tasks={publicTasks}
            onClose={() => setActiveSurface(null)}
          />
        ) : null}

        {activeSurface === 'boss-whiteboard' ? (
          <TaskDetailDrawer
            title="Boss Office Whiteboard"
            task={privateTask}
            onClose={() => setActiveSurface(null)}
          />
        ) : null}

        {!activeSurface ? (
          <p className="overlay-placeholder">
            Walk up to a whiteboard in the office to inspect task flow.
          </p>
        ) : null}
      </section>
    </main>
  )
}
