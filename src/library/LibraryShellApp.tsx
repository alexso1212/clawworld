import { useEffect, useState } from 'react'
import { GameShell } from '../game/GameShell'
import {
  buildLibrarySceneSnapshot,
  getLibraryAsset,
} from './data/libraryShellManifest'
import { buildRuntimeAwareLibraryShell } from './data/libraryRuntimeAdapter'
import { LibraryInfoPanel } from './ui/LibraryInfoPanel'
import { LibraryStatusRail } from './ui/LibraryStatusRail'
import { useClawworldStore } from '../state/clawworldStore'
import { selectBoardTasks, selectRuntimeSession } from '../state/selectors'

export function LibraryShellApp() {
  const runtimeSession = useClawworldStore(selectRuntimeSession)
  const boardTasks = useClawworldStore(selectBoardTasks)
  const source = useClawworldStore((state) => state.source)
  const shell = buildRuntimeAwareLibraryShell(runtimeSession, {
    openTaskCount: boardTasks.length,
    source,
  })
  const [selectedRoomId, setSelectedRoomId] = useState(shell.focusRoomId)
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(
    shell.manifest.rooms.find((room) => room.id === shell.focusRoomId)?.assets[0]?.id,
  )
  const room = shell.manifest.rooms.find((entry) => entry.id === selectedRoomId) ?? shell.manifest.rooms[0]
  const asset = getLibraryAsset(selectedRoomId, selectedAssetId)
  const snapshot = buildLibrarySceneSnapshot(selectedRoomId)

  useEffect(() => {
    setSelectedRoomId(shell.focusRoomId)
  }, [shell.focusRoomId])

  useEffect(() => {
    setSelectedAssetId(room.assets[0]?.id)
  }, [room])

  return (
    <main className="library-shell">
      <header className="library-banner">
        <div>
          <p className="library-banner__eyebrow">OpenClaw Living Archive</p>
          <h1>{shell.manifest.brand}</h1>
        </div>
        <p className="library-banner__subtitle">{shell.manifest.subtitle}</p>
      </header>

      <section className="library-layout">
        <GameShell
          sceneView="library-shell"
          snapshotSeed={snapshot}
          onMarkerSelect={(markerId) => {
            if (markerId.startsWith('room-')) {
              setSelectedRoomId(markerId.slice(5))
            }
          }}
        />
        <LibraryInfoPanel
          room={room}
          selectedAsset={asset}
          runtimeCards={shell.runtimeCards}
          onAssetSelect={setSelectedAssetId}
        />
      </section>

      <LibraryStatusRail items={shell.statusRail} />
    </main>
  )
}
