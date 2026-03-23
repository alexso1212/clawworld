import { describe, expect, it } from 'vitest'
import { getRuntimeAmbientActorDefs } from '../../src/runtime/systems/runtimeActorManifest'

describe('runtime actor manifest', () => {
  it('defines multiple ambient patrol actors for the default game scene', () => {
    const actors = getRuntimeAmbientActorDefs()

    expect(actors.length).toBeGreaterThanOrEqual(3)
    expect(new Set(actors.map((actor) => actor.id)).size).toBe(actors.length)
    expect(actors.every((actor) => actor.speed > 0)).toBe(true)
    expect(actors.every((actor) => actor.stops.length >= 3)).toBe(true)
    expect(actors.some((actor) => actor.stops.some((stop) => stop.zoneId === 'break_room'))).toBe(true)
    expect(actors.some((actor) => actor.stops.some((stop) => stop.zoneId === 'alarm'))).toBe(true)
  })
})
