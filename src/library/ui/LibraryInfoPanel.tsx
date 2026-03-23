import type {
  LibraryAssetRecord,
  LibraryRoom,
  LibraryRuntimeCard,
} from '../data/libraryShellProtocol'

type LibraryInfoPanelProps = {
  room: LibraryRoom
  selectedAsset: LibraryAssetRecord
  runtimeCards: LibraryRuntimeCard[]
  onAssetSelect: (assetId: string) => void
}

export function LibraryInfoPanel({
  room,
  selectedAsset,
  runtimeCards,
  onAssetSelect,
}: LibraryInfoPanelProps) {
  return (
    <aside aria-label="Library room details" className="library-panel">
      <p className="library-panel__eyebrow">{room.category}</p>
      <h2>{room.label}</h2>
      <p className="library-panel__description">{room.description}</p>

      <section className="library-panel__section">
        <h3>Asset Ledger</h3>
        <ul className="library-panel__metrics">
          {room.assetSummaries.map((summary) => (
            <li key={summary.label}>
              <span>{summary.label}</span>
              <strong>{summary.value}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="library-panel__section">
        <h3>Current Activity</h3>
        <p>{room.activity}</p>
        <ul className="library-panel__chips">
          {room.outputs.map((output) => (
            <li key={output}>{output}</li>
          ))}
        </ul>
      </section>

      <section className="library-panel__section">
        <h3>Preview Shelf</h3>
        <div className="library-asset-browser">
          <div className="library-asset-list" role="list" aria-label="Room assets">
            {room.assets.map((asset) => (
              <button
                aria-label={asset.label}
                aria-pressed={selectedAsset.id === asset.id}
                className={`library-asset-button${
                  selectedAsset.id === asset.id ? ' library-asset-button--active' : ''
                }`}
                key={asset.id}
                onClick={() => onAssetSelect(asset.id)}
                type="button"
              >
                <span>{asset.label}</span>
                <strong>{asset.status}</strong>
              </button>
            ))}
          </div>

          <article className="library-preview-card" aria-label="Asset preview">
            <p className="library-preview-card__type">
              {selectedAsset.type}
            </p>
            <h4>{selectedAsset.previewTitle}</h4>
            <p>{selectedAsset.previewBody}</p>
            <ul className="library-preview-card__meta">
              {selectedAsset.metadata.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="library-panel__section">
        <h3>Runtime Monitor</h3>
        <div className="library-runtime-grid">
          {runtimeCards.map((card) => (
            <article
              className={`library-runtime-card library-runtime-card--${card.tone}`}
              key={card.id}
            >
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>{card.detail}</span>
            </article>
          ))}
        </div>
      </section>
    </aside>
  )
}
