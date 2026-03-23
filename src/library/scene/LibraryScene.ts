import Phaser from 'phaser'
import type { SceneBridge } from '../../game/engine/sceneBridge'
import {
  getLibraryActorVisuals,
  buildLibrarySceneSnapshot,
  getLibrarySceneArtLayers,
  getLibraryShellManifest,
} from '../data/libraryShellManifest'
import { LibraryScenePrefab } from './LibraryScenePrefab'

type LiveActorPose = 'idle' | 'moving' | 'working'

type LiveActor = {
  id: string
  label: string
  variantId: string
  speed: number
  targetIndex: number
  x: number
  y: number
  sprite: Phaser.GameObjects.Sprite
  shadow: Phaser.GameObjects.Ellipse
  waypoints: { x: number; y: number; holdMs?: number; pose?: 'idle' | 'working' }[]
  holdRemainingMs: number
  pose: LiveActorPose
}

export class LibraryScene extends Phaser.Scene {
  private readonly bridge: SceneBridge
  private readonly selectedRoomId: string
  private readonly actorVisuals = getLibraryActorVisuals()
  private actors: LiveActor[] = []

  constructor(bridge: SceneBridge, selectedRoomId: string) {
    super('library-shell')
    this.bridge = bridge
    this.selectedRoomId = selectedRoomId
  }

  preload() {
    const { floor, objects } = getLibrarySceneArtLayers()

    this.load.image(floor.textureKey, floor.path)
    this.load.image(objects.textureKey, objects.path)
    this.actorVisuals.variants.forEach((variant) => {
      ;[variant.idle, variant.walk, variant.working].forEach((visual) => {
        this.load.spritesheet(visual.textureKey, visual.path, {
          frameWidth: visual.frameWidth,
          frameHeight: visual.frameHeight,
        })
      })
    })
  }

  create() {
    const manifest = getLibraryShellManifest()
    const actorAssignments = new Map(
      this.actorVisuals.assignments.map((assignment) => [assignment.actorId, assignment.variantId]),
    )
    const prefab = new LibraryScenePrefab(this)
    prefab.build(this.selectedRoomId)
    this.ensureActorAnimations()

    this.actors = manifest.actors.map((route) => {
      const start = route.waypoints[0] ?? { x: 0, y: 0 }
      const variantId = actorAssignments.get(route.id) ?? this.actorVisuals.defaultVariantId
      const variant =
        this.actorVisuals.variants.find((entry) => entry.id === variantId) ?? this.actorVisuals.variants[0]
      const initialPose: LiveActorPose =
        start.holdMs && start.holdMs > 0 ? (start.pose ?? 'idle') : 'moving'
      const shadow = this.add.ellipse(
        start.x,
        start.y + this.actorVisuals.shadow.offsetY,
        this.actorVisuals.shadow.width,
        this.actorVisuals.shadow.height,
        0x000000,
        this.actorVisuals.shadow.alpha,
      )
      shadow.setDepth(start.y - 2)
      const sprite = this.add.sprite(
        start.x + this.actorVisuals.anchorOffset.x,
        start.y + this.actorVisuals.anchorOffset.y,
        this.textureKeyForPose(variant.id, initialPose),
      )
      sprite.setDisplaySize(this.actorVisuals.displaySize.width, this.actorVisuals.displaySize.height)
      sprite.setDepth(start.y + 6)
      sprite.play(this.animationKeyForVariant(variant.id, initialPose))

      return {
        id: route.id,
        label: route.label,
        variantId: variant.id,
        speed: route.speed,
        targetIndex: route.waypoints.length > 1 ? 1 : 0,
        x: start.x,
        y: start.y,
        sprite,
        shadow,
        waypoints: route.waypoints,
        holdRemainingMs: start.holdMs ?? 0,
        pose: initialPose,
      }
    })

    this.bridge.setSnapshot(
      buildLibrarySceneSnapshot(
        this.selectedRoomId,
        this.actors.map((actor) => ({
          id: actor.id,
          label: actor.label,
          x: actor.x,
          y: actor.y,
        })),
      ),
    )

    this.bridge.setAdvanceHandler((ms) => {
      this.step(ms)
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.bridge.resetAdvanceHandler()
    })
  }

  update(_time: number, delta: number) {
    this.step(delta)
  }

  private step(delta: number) {
    let changed = false

    for (const actor of this.actors) {
      if (actor.holdRemainingMs > 0) {
        actor.holdRemainingMs = Math.max(0, actor.holdRemainingMs - delta)
        if (actor.holdRemainingMs === 0) {
          this.setActorPose(actor, 'moving')
        }
        this.syncActorDisplay(actor)
        continue
      }

      const target = actor.waypoints[actor.targetIndex]
      if (!target) {
        actor.targetIndex = 0
        continue
      }

      const dx = target.x - actor.x
      const dy = target.y - actor.y
      const distance = Math.hypot(dx, dy)

      if (distance < 0.001) {
        this.enterWaypointPose(actor, target)
        continue
      }

      const step = (actor.speed * delta) / 1000
      if (step >= distance) {
        actor.x = target.x
        actor.y = target.y
        this.enterWaypointPose(actor, target)
      } else {
        actor.x += (dx / distance) * step
        actor.y += (dy / distance) * step
        this.setActorPose(actor, 'moving')
      }

      if (Math.abs(dx) > 0.01) {
        actor.sprite.setFlipX(dx < 0)
      }
      this.syncActorDisplay(actor)
      changed = true
    }

    if (changed) {
      this.bridge.setSnapshot(
        buildLibrarySceneSnapshot(
          this.selectedRoomId,
          this.actors.map((actor) => ({
            id: actor.id,
            label: actor.label,
            x: actor.x,
            y: actor.y,
          })),
        ),
      )
    }
  }

  private ensureActorAnimations() {
    this.actorVisuals.variants.forEach((variant) => {
      ;([
        ['idle', variant.idle],
        ['moving', variant.walk],
        ['working', variant.working],
      ] as const).forEach(([pose, visual]) => {
        const key = this.animationKeyForVariant(variant.id, pose)
        if (this.anims.exists(key)) {
          return
        }

        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(visual.textureKey, {
            start: 0,
            end: visual.frameCount - 1,
          }),
          frameRate: 6,
          repeat: -1,
        })
      })
    })
  }

  private enterWaypointPose(
    actor: LiveActor,
    waypoint: { holdMs?: number; pose?: 'idle' | 'working' },
  ) {
    actor.targetIndex = (actor.targetIndex + 1) % actor.waypoints.length
    actor.holdRemainingMs = waypoint.holdMs ?? 0
    this.setActorPose(actor, actor.holdRemainingMs > 0 ? (waypoint.pose ?? 'idle') : 'moving')
    this.syncActorDisplay(actor)
  }

  private setActorPose(actor: LiveActor, pose: LiveActorPose) {
    if (actor.pose === pose) {
      return
    }

    actor.pose = pose
    actor.sprite.play(this.animationKeyForVariant(actor.variantId, pose))
  }

  private textureKeyForPose(variantId: string, pose: LiveActorPose) {
    const variant =
      this.actorVisuals.variants.find((entry) => entry.id === variantId) ?? this.actorVisuals.variants[0]

    if (pose === 'idle') {
      return variant.idle.textureKey
    }

    if (pose === 'working') {
      return variant.working.textureKey
    }

    return variant.walk.textureKey
  }

  private syncActorDisplay(actor: LiveActor) {
    actor.shadow.setPosition(actor.x, actor.y + this.actorVisuals.shadow.offsetY)
    actor.shadow.setDepth(actor.y - 2)
    actor.sprite.setPosition(
      actor.x + this.actorVisuals.anchorOffset.x,
      actor.y + this.actorVisuals.anchorOffset.y,
    )
    actor.sprite.setDepth(actor.y + 6)
  }

  private animationKeyForVariant(variantId: string, pose: LiveActorPose) {
    return `library-actor-${variantId}-${pose}`
  }
}
