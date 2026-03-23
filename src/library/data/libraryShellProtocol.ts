export type LibraryAssetSummary = {
  label: string
  value: string
}

export type LibraryAssetRecord = {
  id: string
  label: string
  type: string
  status: string
  previewTitle: string
  previewBody: string
  metadata: string[]
}

export type LibraryRuntimeCardTone = 'live' | 'watch' | 'idle'

export type LibraryRuntimeCard = {
  id: string
  label: string
  value: string
  detail: string
  tone: LibraryRuntimeCardTone
}

export type LibraryStatusItem = {
  id: string
  label: string
  value: string
}

export type LibrarySceneAnchor = {
  x: number
  y: number
  width: number
  height: number
}

export type LibraryRoom = {
  id: string
  sourceRoomId?: string
  label: string
  category: string
  accent: string
  description: string
  anchor: LibrarySceneAnchor
  assetSummaries: LibraryAssetSummary[]
  assets: LibraryAssetRecord[]
  activity: string
  outputs: string[]
}

export type LibraryActorWaypoint = {
  x: number
  y: number
  holdMs?: number
  pose?: 'idle' | 'working'
}

export type LibraryActorRoute = {
  id: string
  label: string
  accent: number
  speed: number
  waypoints: LibraryActorWaypoint[]
}

export type LibraryShellManifest = {
  brand: string
  subtitle: string
  defaultRoomId: string
  rooms: LibraryRoom[]
  runtimeCards: LibraryRuntimeCard[]
  statusRail: LibraryStatusItem[]
  actors: LibraryActorRoute[]
}
