import { describe, expect, it } from 'vitest'
import { loadProtocols } from '../../src/runtime/systems/protocolStore'
import {
  getActorVariantTint,
  getActorVariantChromeLabel,
  resolveStoredActorVariantPreference,
} from '../../src/runtime/systems/actorVariantChrome'

describe('lobster actor variant', () => {
  it('ships a lobster-flavored default actor variant in the runtime manifest', () => {
    const protocols = loadProtocols()
    const actor = protocols.sceneArt.actor

    expect(actor?.defaultVariantId).toBe('lobster-claw')
    expect(actor?.variants?.map((variant) => variant.id)).toContain('lobster-claw')

    const lobsterVariant = actor?.variants?.find((variant) => variant.id === 'lobster-claw')
    expect(lobsterVariant?.label).toBe('Lobster-Claw')
    expect(lobsterVariant?.modes.some((mode) => mode.mode === 'moving')).toBe(true)
    expect(lobsterVariant?.modes.some((mode) => mode.mode === 'working')).toBe(true)
    expect(lobsterVariant?.modes.every((mode) => mode.path.includes('/assets/generated/actors/lobster-claw-v1/'))).toBe(true)
  })

  it('renders a short lobster label for the actor skin toggle', () => {
    expect(getActorVariantChromeLabel('Lobster-Claw', 'en')).toBe('lobster·claw')
    expect(getActorVariantChromeLabel('Lobster-Claw', 'zh')).toBe('龙虾·爪')
  })

  it('migrates the previous capy default toward the new lobster default without overriding explicit choices', () => {
    expect(resolveStoredActorVariantPreference('capy-claw-emoji', 'lobster-claw')).toBe('lobster-claw')
    expect(resolveStoredActorVariantPreference('cat-claw-emoji', 'lobster-claw')).toBe('cat-claw-emoji')
    expect(resolveStoredActorVariantPreference(null, 'lobster-claw')).toBe('lobster-claw')
  })

  it('does not rely on tint-only fallback once the lobster art pack exists', () => {
    expect(getActorVariantTint('lobster-claw')).toBe(null)
  })
})
