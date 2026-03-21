import { useEffect, useRef, useState } from 'react'
import {
  createSceneBridge,
  type SceneMarker,
  type SceneSnapshot,
} from './engine/sceneBridge'
import { OnWallDisplay } from '../ui/OnWallDisplay'

declare global {
  interface Window {
    render_game_to_text?: () => string
    advanceTime?: (ms: number) => void
  }
}

function describeSnapshot(snapshot: SceneSnapshot) {
  return JSON.stringify({
    scene: snapshot.scene,
    title: snapshot.title,
    rooms: snapshot.rooms,
    portals: snapshot.portals,
    markers: snapshot.markers.map((marker) => ({
      label: marker.label,
      variant: marker.variant,
      x: Number(marker.x.toFixed(2)),
      y: Number(marker.y.toFixed(2)),
    })),
    coordinateSystem: 'origin top-left; x grows right; y grows down',
  })
}

function MarkerTag({ marker }: { marker: SceneMarker }) {
  if (marker.interactive) {
    return (
      <button
        className={`scene-marker scene-marker--${marker.variant}`}
        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        type="button"
        onClick={() => marker.onSelect?.(marker.id)}
      >
        {marker.label}
      </button>
    )
  }

  return (
    <div
      className={`scene-marker scene-marker--${marker.variant}`}
      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
    >
      {marker.label}
    </div>
  )
}

type GameShellProps = {
  onMarkerSelect?: (markerId: string) => void
  sceneView: 'main-office' | 'task-world'
}

export function GameShell({ onMarkerSelect, sceneView }: GameShellProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [bridge] = useState(() => createSceneBridge())
  const [snapshot, setSnapshot] = useState<SceneSnapshot>(() => bridge.getSnapshot())

  useEffect(() => bridge.subscribe(setSnapshot), [bridge])

  useEffect(() => {
    window.render_game_to_text = () => describeSnapshot(snapshot)
    window.advanceTime = (ms: number) => bridge.advance(ms)

    return () => {
      delete window.render_game_to_text
      delete window.advanceTime
    }
  }, [bridge, snapshot])

  useEffect(() => {
    if (import.meta.env.MODE === 'test' || !hostRef.current) {
      return
    }

    let disposed = false
    let destroyGame: (() => void) | undefined

    void (async () => {
      const { createGame } = await import('./engine/createGame')

      if (disposed || !hostRef.current) {
        return
      }

      const game = createGame(hostRef.current, bridge, sceneView)
      destroyGame = () => {
        game.destroy(true)
      }
    })()

    return () => {
      disposed = true
      bridge.resetAdvanceHandler()
      destroyGame?.()
    }
  }, [bridge, sceneView])

  return (
    <section
      aria-label="Clawworld scene host"
      className="scene-host"
      data-testid="scene-host"
    >
      <div className="scene-canvas" ref={hostRef} />
      {sceneView === 'main-office' ? (
        <OnWallDisplay
          items={[
            { label: 'Open tasks', value: '03' },
            { label: 'Budget state', value: 'Stable' },
            { label: 'Bridge line', value: 'Healthy' },
          ]}
        />
      ) : null}
      <div className="scene-placards">
        {snapshot.markers.map((marker) => (
          <MarkerTag
            key={marker.id}
            marker={{
              ...marker,
              onSelect: onMarkerSelect,
            }}
          />
        ))}
      </div>
    </section>
  )
}
