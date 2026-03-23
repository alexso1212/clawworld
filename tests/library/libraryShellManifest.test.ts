import { describe, expect, it } from 'vitest'
import {
  getLibraryActorVisuals,
  buildLibrarySceneSnapshot,
  getLibrarySceneArtLayers,
  getLibraryShellManifest,
  resolveLibraryAssetPath,
} from '../../src/library/data/libraryShellManifest'

describe('library shell manifest', () => {
  it('defines a stable clawlibrary-style room set', () => {
    const manifest = getLibraryShellManifest()

    expect(manifest.brand).toBe('ClawLibrary')
    expect(manifest.defaultRoomId).toBe('runtime-monitor')
    expect(manifest.rooms.length).toBeGreaterThanOrEqual(10)
    expect(manifest.rooms.map((room) => room.id)).toEqual(
      expect.arrayContaining(['document-archive', 'runtime-monitor', 'queue-hub']),
    )
    expect(manifest.rooms.find((room) => room.id === 'runtime-monitor')?.assets.length).toBeGreaterThan(
      0,
    )
  })

  it('maps key shell rooms onto vendored clawlibrary topology', () => {
    const manifest = getLibraryShellManifest()
    const memoryVault = manifest.rooms.find((room) => room.id === 'memory-vault')
    const runtimeMonitor = manifest.rooms.find((room) => room.id === 'runtime-monitor')
    const breakRoom = manifest.rooms.find((room) => room.id === 'break-room')

    expect(memoryVault?.sourceRoomId).toBe('memory')
    expect(memoryVault?.anchor.x).toBeCloseTo(15.63, 1)
    expect(memoryVault?.anchor.y).toBeCloseTo(28.7, 1)

    expect(runtimeMonitor?.sourceRoomId).toBe('log')
    expect(runtimeMonitor?.anchor.x).toBeCloseTo(74.74, 1)
    expect(runtimeMonitor?.anchor.y).toBeCloseTo(36.11, 1)

    expect(breakRoom?.sourceRoomId).toBe('break_room')
    expect(breakRoom?.anchor.x).toBeCloseTo(81.25, 1)
    expect(breakRoom?.anchor.y).toBeCloseTo(78.7, 1)
  })

  it('builds a scene snapshot with interactive room markers', () => {
    const snapshot = buildLibrarySceneSnapshot()

    expect(snapshot.scene).toBe('library-shell')
    expect(snapshot.markers.length).toBeGreaterThanOrEqual(10)
    expect(snapshot.markers.find((marker) => marker.id === 'room-runtime-monitor')).toMatchObject({
      interactive: true,
      label: 'Runtime Monitor',
    })
  })

  it('surfaces vendored clawlibrary scene art layers', () => {
    const layers = getLibrarySceneArtLayers()

    expect(layers.floor.path).toBe('/clawlibrary/assets/packs/default/2026-03-09/scene-floor.png')
    expect(layers.objects.path).toBe('/clawlibrary/assets/packs/default/2026-03-09/scene-objects.png')
    expect(layers.floor.displaySize).toEqual({ width: 1920, height: 1072 })
  })

  it('prefixes vendored clawlibrary assets with the deployment base path', () => {
    expect(resolveLibraryAssetPath('/assets/packs/default/2026-03-09/scene-floor.png', '/clawworld/')).toBe(
      '/clawworld/clawlibrary/assets/packs/default/2026-03-09/scene-floor.png',
    )
    expect(
      resolveLibraryAssetPath(
        '/assets/generated/actors/capy-claw-emoji-v2/sheets/walk-spritesheet.png',
        '/clawworld/',
      ),
    ).toBe('/clawworld/clawlibrary/assets/generated/actors/capy-claw-emoji-v2/sheets/walk-spritesheet.png')
  })

  it('surfaces vendored actor sprite-sheet variants for library patrol actors', () => {
    const actorVisuals = getLibraryActorVisuals()

    expect(actorVisuals.displaySize).toEqual({ width: 118, height: 118 })
    expect(actorVisuals.shadow).toEqual({ width: 57, height: 21, offsetY: 24, alpha: 0.28 })
    expect(actorVisuals.defaultVariantId).toBe('capy-claw-emoji')
    expect(actorVisuals.assignments).toEqual([
      { actorId: 'archivist', variantId: 'capy-claw-emoji' },
      { actorId: 'courier', variantId: 'cat-claw-emoji' },
    ])
    expect(actorVisuals.variants.map((variant) => variant.id)).toEqual(
      expect.arrayContaining(['capy-claw-emoji', 'cat-claw-emoji']),
    )

    const capyWalk = actorVisuals.variants.find((variant) => variant.id === 'capy-claw-emoji')?.walk
    const capyIdle = actorVisuals.variants.find((variant) => variant.id === 'capy-claw-emoji')?.idle
    const capyWorking = actorVisuals.variants.find((variant) => variant.id === 'capy-claw-emoji')?.working
    const catWalk = actorVisuals.variants.find((variant) => variant.id === 'cat-claw-emoji')?.walk
    const catIdle = actorVisuals.variants.find((variant) => variant.id === 'cat-claw-emoji')?.idle
    const catWorking = actorVisuals.variants.find((variant) => variant.id === 'cat-claw-emoji')?.working

    expect(capyWalk).toMatchObject({
      textureKey: 'capy-claw-walk-sheet',
      path: '/clawlibrary/assets/generated/actors/capy-claw-emoji-v2/sheets/walk-spritesheet.png',
      frameWidth: 128,
      frameHeight: 128,
      frameCount: 43,
    })
    expect(capyIdle).toMatchObject({
      textureKey: 'capy-claw-stand-front-sheet',
      path: '/clawlibrary/assets/generated/actors/capy-claw-emoji-v2/sheets/stand_front-spritesheet.png',
      frameCount: 37,
    })
    expect(capyWorking).toMatchObject({
      textureKey: 'capy-claw-work-sheet',
      path: '/clawlibrary/assets/generated/actors/capy-claw-emoji-v2/sheets/work-spritesheet.png',
      frameCount: 31,
    })
    expect(catWalk).toMatchObject({
      textureKey: 'cat-claw-walk-sheet',
      path: '/clawlibrary/assets/generated/actors/cat-claw-emoji-v1/sheets/walk-spritesheet.png',
      frameWidth: 128,
      frameHeight: 128,
      frameCount: 13,
    })
    expect(catIdle).toMatchObject({
      textureKey: 'cat-claw-stand-front-sheet',
      path: '/clawlibrary/assets/generated/actors/cat-claw-emoji-v1/sheets/stand_front-spritesheet.png',
      frameCount: 36,
    })
    expect(catWorking).toMatchObject({
      textureKey: 'cat-claw-work-sheet',
      path: '/clawlibrary/assets/generated/actors/cat-claw-emoji-v1/sheets/work-spritesheet.png',
      frameCount: 24,
    })
  })

  it('defines actor patrol stops with hold times and poses', () => {
    const manifest = getLibraryShellManifest()
    const archivist = manifest.actors.find((actor) => actor.id === 'archivist')
    const courier = manifest.actors.find((actor) => actor.id === 'courier')

    expect(archivist?.waypoints.some((waypoint) => waypoint.holdMs && waypoint.holdMs > 0)).toBe(true)
    expect(archivist?.waypoints.some((waypoint) => waypoint.pose === 'working')).toBe(true)
    expect(courier?.waypoints.some((waypoint) => waypoint.pose === 'idle')).toBe(true)
    expect(courier?.waypoints.find((waypoint) => waypoint.pose === 'idle' && waypoint.holdMs === 1800)).toBeDefined()
  })
})
