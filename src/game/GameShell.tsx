import { useEffect, useRef, useState } from 'react'
import type { ClawworldRuntimeSession } from '../adapters/openclaw/types'
import {
  createSceneBridge,
  type SceneMarker,
  type SceneSnapshot,
} from './engine/sceneBridge'
import { OnWallDisplay, type OnWallDisplayItem } from '../ui/OnWallDisplay'

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
  const markerStyle = {
    left: `${marker.x}%`,
    top: `${marker.y}%`,
    ...(marker.width ? { width: `${marker.width}%` } : {}),
    ...(marker.height ? { height: `${marker.height}%` } : {}),
  }

  if (marker.interactive && marker.labelMode === 'hover') {
    return (
      <button
        aria-label={marker.label}
        className={`scene-marker scene-marker--${marker.variant} scene-marker--hover`}
        style={markerStyle}
        type="button"
        onClick={() => marker.onSelect?.(marker.id)}
      >
        <span className="scene-marker__tooltip">{marker.label}</span>
      </button>
    )
  }

  if (marker.interactive) {
    return (
      <button
        className={`scene-marker scene-marker--${marker.variant}`}
        style={markerStyle}
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
      style={markerStyle}
    >
      {marker.label}
    </div>
  )
}

type GameShellProps = {
  displayItems?: OnWallDisplayItem[]
  onMarkerSelect?: (markerId: string) => void
  runtimeSession?: ClawworldRuntimeSession
  sceneView: 'library-shell' | 'main-office' | 'task-world'
  snapshotSeed?: SceneSnapshot
  selectedRoomId?: string
}

export function GameShell({
  displayItems = [],
  onMarkerSelect,
  runtimeSession,
  sceneView,
  snapshotSeed,
  selectedRoomId,
}: GameShellProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [bridge] = useState(() => createSceneBridge())
  const [snapshot, setSnapshot] = useState<SceneSnapshot>(() => bridge.getSnapshot())

  useEffect(() => bridge.subscribe(setSnapshot), [bridge])

  useEffect(() => {
    if (snapshotSeed) {
      bridge.setSnapshot(snapshotSeed)
    }
  }, [bridge, snapshotSeed])

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

      const game = createGame(hostRef.current, bridge, sceneView, runtimeSession, selectedRoomId)
      destroyGame = () => {
        game.destroy(true)
      }
    })()

    return () => {
      disposed = true
      bridge.resetAdvanceHandler()
      destroyGame?.()
    }
  }, [bridge, runtimeSession, sceneView, selectedRoomId])

  return (
    <section
      aria-label="Clawworld scene host"
      className="scene-host"
      data-testid="scene-host"
    >
      <div className="scene-canvas" ref={hostRef} />
      {sceneView === 'main-office' ? (
        <OnWallDisplay items={displayItems} />
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
