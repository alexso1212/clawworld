export default function App() {
  return (
    <main className="app-shell">
      <header className="office-banner">Clawworld</header>
      <section
        aria-label="Clawworld scene host"
        className="scene-host"
        data-testid="scene-host"
      />
      <section
        aria-label="Clawworld overlay root"
        className="overlay-root"
        data-testid="overlay-root"
      />
    </main>
  )
}
