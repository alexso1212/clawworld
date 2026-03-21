import type { TriageCard as TriageCardModel } from '../domain/types'

type TriageCardProps = {
  card: TriageCardModel
  onClose: () => void
}

export function TriageCard({ card, onClose }: TriageCardProps) {
  return (
    <aside className="drawer-shell triage-card">
      <header className="drawer-header">
        <div>
          <h2>{card.title}</h2>
          <p>{card.code}</p>
        </div>
        <button className="drawer-close" onClick={onClose} type="button">
          Close
        </button>
      </header>

      <section className="detail-card">
        <h3>What happened</h3>
        <p>{card.whatHappened}</p>
        <h3>Impact</h3>
        <p>{card.impact}</p>
        <h3>Check first</h3>
        <p>{card.firstCheck}</p>
      </section>
    </aside>
  )
}
