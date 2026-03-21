import type { Abnormality } from '../domain/types'

type AbnormalityRegisterProps = {
  abnormalities: Abnormality[]
  onClose: () => void
}

export function AbnormalityRegister({
  abnormalities,
  onClose,
}: AbnormalityRegisterProps) {
  return (
    <aside className="drawer-shell">
      <header className="drawer-header">
        <div>
          <h2>Abnormality Register</h2>
          <p>Main desk register</p>
        </div>
        <button className="drawer-close" onClick={onClose} type="button">
          Close
        </button>
      </header>

      <ul className="register-list">
        {abnormalities.map((abnormality) => (
          <li className="task-card" key={abnormality.id}>
            <strong>{abnormality.triageCard.title}</strong>
            <span>{abnormality.triageCard.impact}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
