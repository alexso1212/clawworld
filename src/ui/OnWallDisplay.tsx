export type OnWallDisplayItem = {
  label: string
  value: string
}

type OnWallDisplayProps = {
  items: OnWallDisplayItem[]
}

export function OnWallDisplay({ items }: OnWallDisplayProps) {
  return (
    <section aria-label="Office wall display" className="on-wall-display">
      <h2>Office Wall Display</h2>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <span>{item.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
