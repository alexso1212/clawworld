export type SceneMarkerVariant = 'title' | 'room' | 'surface' | 'worker' | 'delivery'

export type SceneMarker = {
  id: string
  label: string
  x: number
  y: number
  variant: SceneMarkerVariant
  interactive?: boolean
  onSelect?: (id: string) => void
}

export type SceneSnapshot = {
  scene: string
  title: string
  rooms: string[]
  portals: string[]
  markers: SceneMarker[]
}

type Listener = (snapshot: SceneSnapshot) => void
type AdvanceHandler = (ms: number) => void

const EMPTY_SNAPSHOT: SceneSnapshot = {
  scene: 'boot',
  title: 'Clawworld',
  rooms: [],
  portals: [],
  markers: [],
}

export function createSceneBridge() {
  let snapshot = EMPTY_SNAPSHOT
  let advanceHandler: AdvanceHandler = () => {}
  const listeners = new Set<Listener>()

  return {
    getSnapshot() {
      return snapshot
    },
    setSnapshot(nextSnapshot: SceneSnapshot) {
      snapshot = nextSnapshot
      listeners.forEach((listener) => listener(snapshot))
    },
    subscribe(listener: Listener) {
      listeners.add(listener)
      listener(snapshot)

      return () => {
        listeners.delete(listener)
      }
    },
    setAdvanceHandler(handler: AdvanceHandler) {
      advanceHandler = handler
    },
    resetAdvanceHandler() {
      advanceHandler = () => {}
    },
    advance(ms: number) {
      advanceHandler(ms)
    },
  }
}

export type SceneBridge = ReturnType<typeof createSceneBridge>
