import type { LibraryStatusItem } from '../data/libraryShellProtocol'

type LibraryStatusRailProps = {
  items: LibraryStatusItem[]
}

export function LibraryStatusRail({ items }: LibraryStatusRailProps) {
  return (
    <section aria-label="Library status rail" className="library-status-rail">
      {items.map((item) => (
        <article className="library-status-pill" key={item.id}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}
