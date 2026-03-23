import type { SceneMarkerVariant, SceneSnapshot } from '../../game/engine/sceneBridge'
import mapLogicJson from './upstream/map.logic.json'
import assetManifestJson from './upstream/asset.manifest.json'
import sceneArtManifestJson from './upstream/scene-art.manifest.json'
import workOutputProtocolJson from './upstream/work-output.protocol.json'
import type {
  LibraryActorRoute,
  LibraryRoom,
  LibrarySceneAnchor,
  LibraryShellManifest,
} from './libraryShellProtocol'

type UpstreamMapLogic = {
  meta: {
    baseResolution: {
      width: number
      height: number
    }
  }
  rooms: Array<{
    id: string
    bounds: [number, number, number, number]
  }>
  workZones: Array<{
    id: string
    anchor: {
      x: number
      y: number
    }
  }>
}

type UpstreamAssetManifest = {
  assets: Array<{
    roomId: string
  }>
}

type UpstreamWorkOutputProtocol = {
  outputCategories: Array<{
    id: string
    sampleContents: string[]
  }>
}

type UpstreamSceneArtManifest = {
  globalLayers: Array<{
    id: string
    renderLayer: string
    textureKey: string
    path: string
    anchor: {
      x: number
      y: number
    }
    displaySize: {
      width: number
      height: number
    }
  }>
  actor: {
    displaySize: {
      width: number
      height: number
    }
    anchorOffset?: {
      x: number
      y: number
    }
    shadow?: {
      width: number
      height: number
      offsetY: number
      alpha: number
    }
    defaultVariantId: string
    variants: Array<{
      id: string
      label: string
      modes: Array<{
        mode: string
        textureKey: string
        path: string
        frameWidth?: number
        frameHeight?: number
        frameCount?: number
      }>
    }>
  }
}

export type LibraryActorWalkVisual = {
  textureKey: string
  path: string
  frameWidth: number
  frameHeight: number
  frameCount: number
}

export type LibraryActorPoseVisual = LibraryActorWalkVisual

export type LibraryActorVariantVisual = {
  id: string
  label: string
  idle: LibraryActorPoseVisual
  walk: LibraryActorWalkVisual
  working: LibraryActorPoseVisual
}

export type LibraryActorVisuals = {
  displaySize: {
    width: number
    height: number
  }
  anchorOffset: {
    x: number
    y: number
  }
  shadow: {
    width: number
    height: number
    offsetY: number
    alpha: number
  }
  defaultVariantId: string
  assignments: Array<{
    actorId: string
    variantId: string
  }>
  variants: LibraryActorVariantVisual[]
}

const UPSTREAM_MAP = mapLogicJson as unknown as UpstreamMapLogic
const UPSTREAM_ASSET_MANIFEST = assetManifestJson as unknown as UpstreamAssetManifest
const UPSTREAM_SCENE_ART = sceneArtManifestJson as unknown as UpstreamSceneArtManifest
const UPSTREAM_WORK_OUTPUT = workOutputProtocolJson as unknown as UpstreamWorkOutputProtocol

export const LIBRARY_SCENE_WIDTH = UPSTREAM_MAP.meta.baseResolution.width
export const LIBRARY_SCENE_HEIGHT = UPSTREAM_MAP.meta.baseResolution.height

const SOURCE_ROOM_BY_LIBRARY_ROOM: Record<string, string> = {
  'document-archive': 'document',
  'image-atelier': 'images',
  'memory-vault': 'memory',
  'skill-forge': 'skills',
  'interface-gateway': 'gateway',
  'code-lab': 'agent',
  scheduler: 'schedule',
  'alarm-board': 'alarm',
  'runtime-monitor': 'log',
  'queue-hub': 'task_queues',
  'break-room': 'break_room',
}

const UPSTREAM_ROOM_BY_ID = new Map(UPSTREAM_MAP.rooms.map((room) => [room.id, room]))
const UPSTREAM_WORK_ZONE_BY_ID = new Map(UPSTREAM_MAP.workZones.map((zone) => [zone.id, zone]))
const UPSTREAM_OUTPUT_BY_ID = new Map(
  UPSTREAM_WORK_OUTPUT.outputCategories.map((category) => [category.id, category]),
)
const UPSTREAM_ASSET_COUNT_BY_ROOM = UPSTREAM_ASSET_MANIFEST.assets.reduce((counts, asset) => {
  counts.set(asset.roomId, (counts.get(asset.roomId) ?? 0) + 1)
  return counts
}, new Map<string, number>())

function remapUpstreamPublicPath(path: string) {
  return path.replace('/assets/', '/clawlibrary/assets/')
}

function toPercent(value: number, total: number) {
  return Number(((value / total) * 100).toFixed(2))
}

function toPaddedCount(value: number) {
  return String(value).padStart(2, '0')
}

function deriveSceneAnchor(sourceRoomId: string, fallback: LibrarySceneAnchor): LibrarySceneAnchor {
  const room = UPSTREAM_ROOM_BY_ID.get(sourceRoomId)
  if (!room) {
    return fallback
  }

  const [x, y, width, height] = room.bounds
  return {
    x: toPercent(x + width / 2, LIBRARY_SCENE_WIDTH),
    y: toPercent(y + height / 2, LIBRARY_SCENE_HEIGHT),
    width: toPercent(width, LIBRARY_SCENE_WIDTH),
    height: toPercent(height, LIBRARY_SCENE_HEIGHT),
  }
}

function deriveOutputs(sourceRoomId: string, fallback: string[]) {
  const category = UPSTREAM_OUTPUT_BY_ID.get(sourceRoomId)
  if (!category) {
    return fallback
  }

  return category.sampleContents
}

function applyUpstreamTopology(room: LibraryRoom): LibraryRoom {
  const sourceRoomId = SOURCE_ROOM_BY_LIBRARY_ROOM[room.id]
  if (!sourceRoomId) {
    return room
  }

  const sourceAssetCount = UPSTREAM_ASSET_COUNT_BY_ROOM.get(sourceRoomId)
  return {
    ...room,
    sourceRoomId,
    anchor: deriveSceneAnchor(sourceRoomId, room.anchor),
    assetSummaries:
      sourceAssetCount == null
        ? room.assetSummaries
        : room.assetSummaries.map((summary, index) =>
            index === 0 ? { ...summary, value: toPaddedCount(sourceAssetCount) } : summary,
          ),
    outputs: deriveOutputs(sourceRoomId, room.outputs),
  }
}

function stopsFromZones(
  stops: Array<{
    zoneId: string
    holdMs?: number
    pose?: 'idle' | 'working'
  }>,
) {
  return stops.flatMap((stop) => {
    const zone = UPSTREAM_WORK_ZONE_BY_ID.get(stop.zoneId)
    return zone
      ? [{ x: zone.anchor.x, y: zone.anchor.y, holdMs: stop.holdMs, pose: stop.pose }]
      : []
  })
}

export function getLibrarySceneArtLayers() {
  const floor =
    UPSTREAM_SCENE_ART.globalLayers.find((layer) => layer.id === 'default-floor-2026-03-09') ??
    UPSTREAM_SCENE_ART.globalLayers[0]
  const objects =
    UPSTREAM_SCENE_ART.globalLayers.find((layer) => layer.id === 'default-objects-2026-03-09') ??
    UPSTREAM_SCENE_ART.globalLayers[1]

  return {
    floor: {
      ...floor,
      path: remapUpstreamPublicPath(floor.path),
    },
    objects: {
      ...objects,
      path: remapUpstreamPublicPath(objects.path),
    },
  }
}

function getActorWalkMode(variant: UpstreamSceneArtManifest['actor']['variants'][number]) {
  return variant.modes.find((mode) => mode.mode === 'moving')
}

function getActorIdleMode(variant: UpstreamSceneArtManifest['actor']['variants'][number]) {
  return (
    variant.modes.find(
      (mode) => mode.mode === 'idle' && mode.textureKey.includes('stand-front'),
    ) ??
    variant.modes.find(
      (mode) => mode.mode === 'idle' && mode.textureKey.includes('stand_front'),
    ) ??
    variant.modes.find((mode) => mode.mode === 'idle')
  )
}

function getActorWorkingMode(variant: UpstreamSceneArtManifest['actor']['variants'][number]) {
  return (
    variant.modes.find(
      (mode) => mode.mode === 'working' && mode.textureKey.includes('-work-sheet'),
    ) ??
    variant.modes.find((mode) => mode.mode === 'working')
  )
}

export function getLibraryActorVisuals(): LibraryActorVisuals {
  return {
    displaySize: UPSTREAM_SCENE_ART.actor.displaySize,
    anchorOffset: UPSTREAM_SCENE_ART.actor.anchorOffset ?? { x: 0, y: 0 },
    shadow: UPSTREAM_SCENE_ART.actor.shadow ?? {
      width: 44,
      height: 14,
      offsetY: 16,
      alpha: 0.24,
    },
    defaultVariantId: UPSTREAM_SCENE_ART.actor.defaultVariantId,
    assignments: [
      { actorId: 'archivist', variantId: 'capy-claw-emoji' },
      { actorId: 'courier', variantId: 'cat-claw-emoji' },
    ],
    variants: UPSTREAM_SCENE_ART.actor.variants.flatMap((variant) => {
      const walk = getActorWalkMode(variant)
      const idle = getActorIdleMode(variant)
      const working = getActorWorkingMode(variant)
      if (
        !walk ||
        !idle ||
        !working ||
        idle.frameWidth == null ||
        idle.frameHeight == null ||
        idle.frameCount == null ||
        walk.frameWidth == null ||
        walk.frameHeight == null ||
        walk.frameCount == null ||
        working.frameWidth == null ||
        working.frameHeight == null ||
        working.frameCount == null
      ) {
        return []
      }

      return [
        {
          id: variant.id,
          label: variant.label,
          idle: {
            textureKey: idle.textureKey,
            path: remapUpstreamPublicPath(idle.path),
            frameWidth: idle.frameWidth,
            frameHeight: idle.frameHeight,
            frameCount: idle.frameCount,
          },
          walk: {
            textureKey: walk.textureKey,
            path: remapUpstreamPublicPath(walk.path),
            frameWidth: walk.frameWidth,
            frameHeight: walk.frameHeight,
            frameCount: walk.frameCount,
          },
          working: {
            textureKey: working.textureKey,
            path: remapUpstreamPublicPath(working.path),
            frameWidth: working.frameWidth,
            frameHeight: working.frameHeight,
            frameCount: working.frameCount,
          },
        },
      ]
    }),
  }
}

const BASE_ROOM_VARIANTS: LibraryRoom[] = [
  {
    id: 'document-archive',
    label: 'Document Archive',
    category: 'Records',
    accent: '#c97745',
    description: 'Contracts, specs, and planning packets shelved into a warm paper vault.',
    anchor: { x: 11.5, y: 21, width: 16, height: 16 },
    assetSummaries: [
      { label: 'Indexed assets', value: '128' },
      { label: 'Open packets', value: '06' },
      { label: 'Fresh imports', value: '14' },
    ],
    assets: [
      {
        id: 'archive-website-refresh-spec',
        label: 'Website Refresh Spec',
        type: 'spec packet',
        status: 'indexed',
        previewTitle: 'Website Refresh Specification',
        previewBody: 'Requirement binders, delivery notes, and final markup references are filed together for quick lookup.',
        metadata: ['12 pages', 'revised today', 'linked to queue hub'],
      },
      {
        id: 'archive-prompt-ledger',
        label: 'Prompt Ledger',
        type: 'prompt book',
        status: 'warm',
        previewTitle: 'Prompt Ledger',
        previewBody: 'A stitched ledger of reusable prompt fragments, failed variants, and approved production prompts.',
        metadata: ['33 fragments', '7 approved', '2 under watch'],
      },
    ],
    activity: 'Archivist is re-shelving requirement packets from the queue hub.',
    outputs: ['Spec binders', 'Archived prompts'],
  },
  {
    id: 'image-atelier',
    label: 'Image Atelier',
    category: 'Visuals',
    accent: '#d39b47',
    description: 'Frames, posters, and sprite references staged for visual iteration.',
    anchor: { x: 31.5, y: 21, width: 16, height: 16 },
    assetSummaries: [
      { label: 'Boards on wall', value: '42' },
      { label: 'Render queues', value: '03' },
      { label: 'Approved sets', value: '11' },
    ],
    assets: [
      {
        id: 'atelier-lobby-sprite-sheet',
        label: 'Lobby Sprite Sheet',
        type: 'sprite atlas',
        status: 'previewing',
        previewTitle: 'Lobby Sprite Atlas',
        previewBody: 'Board shows furniture silhouettes, warm wood trims, and hallway props lined up for export.',
        metadata: ['64x64 grid', 'palette locked', 'awaiting atlas cut'],
      },
      {
        id: 'atelier-poster-wall',
        label: 'Poster Wall',
        type: 'poster proof',
        status: 'approved',
        previewTitle: 'Poster Proof Wall',
        previewBody: 'A gallery rail of comparison posters for room signage, runtime banners, and title cards.',
        metadata: ['11 proofs', '3 finalists', 'museum series'],
      },
    ],
    activity: 'Scene art sheets are pinned for comparison and export.',
    outputs: ['Sprite drafts', 'Poster proofs'],
  },
  {
    id: 'memory-vault',
    label: 'Memory Vault',
    category: 'Context',
    accent: '#8a8dcb',
    description: 'Long-term context jars and retrieval shelves glow behind glass.',
    anchor: { x: 51.5, y: 21, width: 16, height: 16 },
    assetSummaries: [
      { label: 'Memory jars', value: '51' },
      { label: 'Recall threads', value: '09' },
      { label: 'Pinned links', value: '17' },
    ],
    assets: [
      {
        id: 'vault-room-map-recall',
        label: 'Room Map Recall',
        type: 'memory shard',
        status: 'active',
        previewTitle: 'Room Map Recall',
        previewBody: 'A glowing recall shard ties room ids, anchor points, and past routing traces into one view.',
        metadata: ['17 anchors', '4 hot routes', 'telemetry-ready'],
      },
      {
        id: 'vault-queue-history',
        label: 'Queue History',
        type: 'trace spool',
        status: 'settled',
        previewTitle: 'Queue History Spool',
        previewBody: 'Queue history threads are wound into a spool for later replay and anomaly comparison.',
        metadata: ['6 replays', '2 anomalies', 'last synced 3m ago'],
      },
    ],
    activity: 'Vault attendants are reconciling fresh memory extracts.',
    outputs: ['Memory shards', 'Recall traces'],
  },
  {
    id: 'skill-forge',
    label: 'Skill Forge',
    category: 'Automation',
    accent: '#8e6fd1',
    description: 'Reusable skills and workshop templates are forged into deployable tools.',
    anchor: { x: 71.5, y: 21, width: 16, height: 16 },
    assetSummaries: [
      { label: 'Installed skills', value: '23' },
      { label: 'Forge benches', value: '04' },
      { label: 'Queued upgrades', value: '02' },
    ],
    assets: [
      {
        id: 'forge-review-skill-kit',
        label: 'Review Skill Kit',
        type: 'skill mold',
        status: 'forging',
        previewTitle: 'Review Skill Kit',
        previewBody: 'A semi-finished skill mold for review loops, comment triage, and patch verification.',
        metadata: ['3 commands', '1 review loop', 'awaiting polish'],
      },
      {
        id: 'forge-telemetry-adapter',
        label: 'Telemetry Adapter',
        type: 'workflow mold',
        status: 'queued',
        previewTitle: 'Telemetry Adapter Mold',
        previewBody: 'The forge bench is preparing a reusable adapter shell for live OpenClaw museum telemetry.',
        metadata: ['phase two', 'adapter layer', 'mapped to gateway'],
      },
    ],
    activity: 'The forge is cooling a fresh set of workflow skills.',
    outputs: ['Skill kits', 'Workflow molds'],
  },
  {
    id: 'interface-gateway',
    label: 'Interface Gateway',
    category: 'Transport',
    accent: '#3e8c8d',
    description: 'Bridges, terminals, and transport relays funnel activity into the map.',
    anchor: { x: 16.5, y: 50, width: 18, height: 16 },
    assetSummaries: [
      { label: 'Bridge links', value: '08' },
      { label: 'Warm routes', value: '05' },
      { label: 'Handshakes', value: '31' },
    ],
    assets: [
      {
        id: 'gateway-bridge-chart',
        label: 'Bridge Chart',
        type: 'route map',
        status: 'live',
        previewTitle: 'Interface Bridge Chart',
        previewBody: 'Current bridge paths fan out from the gateway into runtime, queue, and code rooms.',
        metadata: ['8 routes', 'healthy drift', '1 fallback lane'],
      },
      {
        id: 'gateway-session-handshake',
        label: 'Session Handshake Log',
        type: 'terminal sheet',
        status: 'warm',
        previewTitle: 'Session Handshake Log',
        previewBody: 'Recent handshakes are stamped onto a long terminal tape for audit and routing replay.',
        metadata: ['31 stamps', '0 dropped', 'updated 30s ago'],
      },
    ],
    activity: 'Gateway relays are redirecting a healthy set of interface calls.',
    outputs: ['Live bridge links', 'Session handoffs'],
  },
  {
    id: 'code-lab',
    label: 'Code Lab',
    category: 'Builds',
    accent: '#457bc9',
    description: 'Code benches, compile terminals, and patch trays line the worktables.',
    anchor: { x: 39, y: 50, width: 18, height: 16 },
    assetSummaries: [
      { label: 'Open patches', value: '07' },
      { label: 'Builds staged', value: '03' },
      { label: 'Review stacks', value: '12' },
    ],
    assets: [
      {
        id: 'lab-shell-branch',
        label: 'Shell Branch',
        type: 'patch bundle',
        status: 'open',
        previewTitle: 'ClawLibrary Shell Branch',
        previewBody: 'Patch trays show the current shell migration split across layout, scene, and styling slices.',
        metadata: ['12 files', 'build green', 'awaiting full atlas pass'],
      },
      {
        id: 'lab-route-heatmap',
        label: 'Route Pressure Map',
        type: 'debug chart',
        status: 'watch',
        previewTitle: 'Route Pressure Map',
        previewBody: 'A code lab overlay marks queue bottlenecks and busy corridors between gateway, monitor, and hub.',
        metadata: ['2 hot spots', 'queue bottlenecks', 'sampled from mock feed'],
      },
    ],
    activity: 'Patch trays are circulating between edit, build, and review.',
    outputs: ['Build artifacts', 'Patch bundles'],
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    category: 'Timing',
    accent: '#9b7846',
    description: 'Automation cards and recurring runs are pinned onto a timing console.',
    anchor: { x: 61.5, y: 50, width: 16, height: 16 },
    assetSummaries: [
      { label: 'Active runs', value: '05' },
      { label: 'Paused cards', value: '02' },
      { label: 'Morning slots', value: '09' },
    ],
    assets: [
      {
        id: 'scheduler-morning-board',
        label: 'Morning Board',
        type: 'timing sheet',
        status: 'active',
        previewTitle: 'Morning Automation Board',
        previewBody: 'Recurring runs are stacked into a clockboard with active, paused, and review-needed slots.',
        metadata: ['9 slots', '5 active', '2 paused'],
      },
      {
        id: 'scheduler-run-ledger',
        label: 'Run Ledger',
        type: 'ledger strip',
        status: 'ready',
        previewTitle: 'Run Ledger',
        previewBody: 'A slim strip tracks the next automation windows and the rooms they will wake up.',
        metadata: ['next in 17m', 'queue hub', 'memory vault'],
      },
    ],
    activity: 'The scheduler is pacing morning automations through the queue.',
    outputs: ['Automation cards', 'Timing sheets'],
  },
  {
    id: 'alarm-board',
    label: 'Alarm Board',
    category: 'Alerts',
    accent: '#bb5648',
    description: 'Warnings, abnormality lanterns, and route alarms are clustered here.',
    anchor: { x: 80.5, y: 50, width: 12, height: 16 },
    assetSummaries: [
      { label: 'Watch beacons', value: '03' },
      { label: 'Muted alarms', value: '01' },
      { label: 'Escalations', value: '02' },
    ],
    assets: [
      {
        id: 'alarm-watch-slip',
        label: 'Watch Slip',
        type: 'alert note',
        status: 'watch',
        previewTitle: 'Watch Slip',
        previewBody: 'A pinned warning note highlights queue pressure and bridge drift before they escalate.',
        metadata: ['priority amber', 'queue linked', 'relay linked'],
      },
      {
        id: 'alarm-escalation-lantern',
        label: 'Escalation Lantern',
        type: 'signal lamp',
        status: 'armed',
        previewTitle: 'Escalation Lantern',
        previewBody: 'A red lantern sits ready to light if queue pressure crosses the next threshold.',
        metadata: ['armed', 'manual snooze', 'triage path ready'],
      },
    ],
    activity: 'The board is watching queue pressure and relay health.',
    outputs: ['Alert slips', 'Escalation notes'],
  },
  {
    id: 'runtime-monitor',
    label: 'Runtime Monitor',
    category: 'Live',
    accent: '#2f8b64',
    description: 'A central monitor ring tracks live room traffic, queue flow, and active tools.',
    anchor: { x: 49.5, y: 73, width: 24, height: 18 },
    assetSummaries: [
      { label: 'Indexed assets', value: '412' },
      { label: 'Live sessions', value: '09' },
      { label: 'Hot rooms', value: '04' },
    ],
    assets: [
      {
        id: 'runtime-glass-overview',
        label: 'Glass Overview',
        type: 'monitor pane',
        status: 'live',
        previewTitle: 'Glass Overview',
        previewBody: 'The central monitor glass projects all room heat, actor patrols, and queue movement into one field.',
        metadata: ['9 live sessions', '4 hot rooms', 'updated live'],
      },
      {
        id: 'runtime-room-traffic',
        label: 'Room Traffic Strip',
        type: 'traffic strip',
        status: 'watch',
        previewTitle: 'Room Traffic Strip',
        previewBody: 'A glowing strip shows gateway-to-lab traffic spikes, queue turns, and archive load changes.',
        metadata: ['gateway spike', 'archive warm', 'queue moderate'],
      },
    ],
    activity: 'Monitor glass is showing active routes across archive, gateway, and lab.',
    outputs: ['Runtime traces', 'Activity summaries'],
  },
  {
    id: 'queue-hub',
    label: 'Queue Hub',
    category: 'Flow',
    accent: '#d05c3f',
    description: 'Incoming work packets arrive here before they split toward rooms.',
    anchor: { x: 26, y: 78, width: 18, height: 12 },
    assetSummaries: [
      { label: 'Ready packets', value: '18' },
      { label: 'Priority runs', value: '04' },
      { label: 'Deferred jobs', value: '02' },
    ],
    assets: [
      {
        id: 'queue-priority-rack',
        label: 'Priority Rack',
        type: 'packet rack',
        status: 'busy',
        previewTitle: 'Priority Packet Rack',
        previewBody: 'Priority work packets are stacked by urgency before they split toward archive, lab, and atelier.',
        metadata: ['4 urgent', '18 ready', '2 deferred'],
      },
      {
        id: 'queue-routing-tags',
        label: 'Routing Tags',
        type: 'dispatch tags',
        status: 'ready',
        previewTitle: 'Routing Tags',
        previewBody: 'Color-coded routing tags mark which room each packet should reach next.',
        metadata: ['amber to archive', 'blue to lab', 'teal to gateway'],
      },
    ],
    activity: 'Packets are being sorted for archive, lab, and atelier routes.',
    outputs: ['Work packets', 'Dispatch tags'],
  },
  {
    id: 'break-room',
    label: 'Break Room',
    category: 'Reset',
    accent: '#7f9e62',
    description: 'A soft corner where actors cool off between patrol loops.',
    anchor: { x: 76, y: 78, width: 16, height: 12 },
    assetSummaries: [
      { label: 'Occupied seats', value: '02' },
      { label: 'Warm drinks', value: '06' },
      { label: 'Idle cycles', value: '14m' },
    ],
    assets: [
      {
        id: 'break-loop-log',
        label: 'Loop Log',
        type: 'cooldown strip',
        status: 'idle',
        previewTitle: 'Cooldown Loop Log',
        previewBody: 'A narrow strip records how long each actor spent cooling off before rejoining patrol routes.',
        metadata: ['14m idle', '2 occupied seats', 'next route soon'],
      },
      {
        id: 'break-drink-tokens',
        label: 'Drink Tokens',
        type: 'comfort token',
        status: 'stocked',
        previewTitle: 'Drink Token Tray',
        previewBody: 'Tiny stamped tokens track warm drinks and small pauses between route cycles.',
        metadata: ['6 stocked', 'rest corner', 'non-critical'],
      },
    ],
    activity: 'A courier pauses here before looping back to the queue.',
    outputs: ['Cooldown windows', 'Idle spans'],
  },
]

const ROOM_VARIANTS: LibraryRoom[] = BASE_ROOM_VARIANTS.map(applyUpstreamTopology)

const ACTOR_ROUTES: LibraryActorRoute[] = [
  {
    id: 'archivist',
    label: 'Archivist',
    accent: 0xe4c16f,
    speed: 96,
    waypoints: stopsFromZones([
      { zoneId: 'memory', holdMs: 900, pose: 'idle' },
      { zoneId: 'document', holdMs: 1200, pose: 'working' },
      { zoneId: 'skills', holdMs: 950, pose: 'working' },
      { zoneId: 'gateway', holdMs: 700, pose: 'idle' },
    ]),
  },
  {
    id: 'courier',
    label: 'Courier',
    accent: 0x72b9cd,
    speed: 112,
    waypoints: stopsFromZones([
      { zoneId: 'images', holdMs: 650, pose: 'idle' },
      { zoneId: 'alarm', holdMs: 900, pose: 'working' },
      { zoneId: 'schedule', holdMs: 850, pose: 'working' },
      { zoneId: 'log', holdMs: 750, pose: 'working' },
      { zoneId: 'break_room', holdMs: 1800, pose: 'idle' },
      { zoneId: 'agent', holdMs: 800, pose: 'working' },
      { zoneId: 'gateway', holdMs: 600, pose: 'idle' },
    ]),
  },
]

const MANIFEST: LibraryShellManifest = {
  brand: 'ClawLibrary',
  subtitle: 'Living pixel archive for OpenClaw assets and runtime activity',
  defaultRoomId: 'runtime-monitor',
  rooms: ROOM_VARIANTS,
  runtimeCards: [
    {
      id: 'relay-health',
      label: 'Relay Health',
      value: 'Stable',
      detail: 'Bridge handshakes are flowing through the interface gateway.',
      tone: 'live',
    },
    {
      id: 'queue-pressure',
      label: 'Queue Pressure',
      value: 'Moderate',
      detail: 'Queue hub has four priority packets waiting for routing.',
      tone: 'watch',
    },
    {
      id: 'memory-sync',
      label: 'Memory Sync',
      value: 'Settled',
      detail: 'Vault recall passes are caught up with the latest run.',
      tone: 'idle',
    },
  ],
  statusRail: [
    { id: 'asset-count', label: 'Indexed asset rooms', value: '11' },
    { id: 'active-route', label: 'Live patrols', value: '02 active' },
    { id: 'watch-state', label: 'Alarm board', value: '1 watch flag' },
    { id: 'preview-state', label: 'Preview trays', value: 'Ready' },
  ],
  actors: ACTOR_ROUTES,
}

export function getLibraryShellManifest() {
  return MANIFEST
}

export function getLibraryRoom(roomId = MANIFEST.defaultRoomId) {
  return MANIFEST.rooms.find((room) => room.id === roomId) ?? MANIFEST.rooms[0]
}

export function getLibraryAsset(roomId = MANIFEST.defaultRoomId, assetId?: string) {
  const room = getLibraryRoom(roomId)
  return room.assets.find((asset) => asset.id === assetId) ?? room.assets[0]
}

export function buildLibrarySceneSnapshot(
  selectedRoomId = MANIFEST.defaultRoomId,
  actorPositions = MANIFEST.actors.map((actor) => ({
    id: actor.id,
    label: actor.label,
    x: actor.waypoints[0]?.x ?? 0,
    y: actor.waypoints[0]?.y ?? 0,
  })),
): SceneSnapshot {
  return {
    scene: 'library-shell',
    title: MANIFEST.brand,
    rooms: MANIFEST.rooms.map((room) => room.label),
    portals: [],
    markers: [
      ...MANIFEST.rooms.map((room) => ({
        id: `room-${room.id}`,
        label: room.label,
        x: room.anchor.x,
        y: room.anchor.y,
        width: room.anchor.width,
        height: room.anchor.height,
        variant: (room.id === selectedRoomId ? 'surface' : 'room') as SceneMarkerVariant,
        interactive: true,
        labelMode: 'hover' as const,
      })),
      ...actorPositions.map((actor) => ({
        id: `actor-${actor.id}`,
        label: actor.label,
        x: toPercent(actor.x, LIBRARY_SCENE_WIDTH),
        y: toPercent(actor.y, LIBRARY_SCENE_HEIGHT),
        variant: 'worker' as const,
      })),
    ],
  }
}
