type WhiteboardTask = {
  id: string
  title: string
  owner: string
  status: string
}

type WhiteboardDrawerProps = {
  title: string
  subtitle: string
  tasks: WhiteboardTask[]
  onClose: () => void
}

export function WhiteboardDrawer({
  title,
  subtitle,
  tasks,
  onClose,
}: WhiteboardDrawerProps) {
  return (
    <aside className="drawer-shell">
      <header className="drawer-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button className="drawer-close" onClick={onClose} type="button">
          Close
        </button>
      </header>

      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-card" key={task.id}>
            <strong>{task.title}</strong>
            <span>
              {task.owner} · {task.status}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
