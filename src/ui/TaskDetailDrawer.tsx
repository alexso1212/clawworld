type TaskDetail = {
  id: string
  title: string
  stage: string
  route: string
  tools: string[]
  blocker: string
}

type TaskDetailDrawerProps = {
  title: string
  task: TaskDetail
  onClose: () => void
}

export function TaskDetailDrawer({
  title,
  task,
  onClose,
}: TaskDetailDrawerProps) {
  return (
    <aside className="drawer-shell">
      <header className="drawer-header">
        <div>
          <h2>{title}</h2>
          <p>{task.title}</p>
        </div>
        <button className="drawer-close" onClick={onClose} type="button">
          Close
        </button>
      </header>

      <article className="detail-card">
        <dl className="detail-grid">
          <div>
            <dt>Current Stage</dt>
            <dd>{task.stage}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{task.route}</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>{task.tools.join(', ')}</dd>
          </div>
          <div>
            <dt>Blocker</dt>
            <dd>{task.blocker}</dd>
          </div>
        </dl>
      </article>
    </aside>
  )
}
