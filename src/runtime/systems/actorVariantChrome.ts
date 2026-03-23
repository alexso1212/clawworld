import type { ActorVariantDef, ActorVisualDef } from '../../core/types'
import type { UiLocale } from '../../ui/locale'

export const LEGACY_DEFAULT_ACTOR_VARIANT_ID = 'capy-claw-emoji'
export const LOBSTER_ACTOR_VARIANT_ID = 'lobster-claw'
export const LOBSTER_ACTOR_VARIANT_LABEL = 'Lobster-Claw'

const LOBSTER_TINT = 0xff7a5c

function cloneVariant(variant: ActorVariantDef): ActorVariantDef {
  return {
    ...variant,
    modes: variant.modes.map((mode) => ({
      ...mode,
      stateIds: mode.stateIds ? [...mode.stateIds] : undefined,
    })),
  }
}

export function ensureLobsterActorVariant(actor: ActorVisualDef | undefined): ActorVisualDef | undefined {
  if (!actor) {
    return actor
  }

  const variants = Array.isArray(actor.variants) ? actor.variants.map(cloneVariant) : []
  const lobsterVariant = variants.find((variant) => variant.id === LOBSTER_ACTOR_VARIANT_ID)
  const baseVariant =
    variants.find((variant) => variant.id === LEGACY_DEFAULT_ACTOR_VARIANT_ID) ??
    variants[0] ??
    null

  if (!lobsterVariant && baseVariant) {
    variants.unshift({
      ...cloneVariant(baseVariant),
      id: LOBSTER_ACTOR_VARIANT_ID,
      label: LOBSTER_ACTOR_VARIANT_LABEL,
    })
  }

  return {
    ...actor,
    variants,
    defaultVariantId: variants.some((variant) => variant.id === LOBSTER_ACTOR_VARIANT_ID)
      ? LOBSTER_ACTOR_VARIANT_ID
      : actor.defaultVariantId,
  }
}

export function getActorVariantChromeLabel(label: string, locale: UiLocale) {
  const normalized = label.trim().toLowerCase()
  if (normalized.includes('lobster')) {
    return locale === 'zh' ? '龙虾·爪' : 'lobster·claw'
  }
  if (normalized.includes('capy')) {
    return locale === 'zh' ? '水豚·爪' : 'capy·claw'
  }
  if (normalized.includes('cat')) {
    return locale === 'zh' ? '猫咪·爪' : 'cat·claw'
  }
  return label
    .replace(/-?claw/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function resolveStoredActorVariantPreference(storedVariantId: string | null, defaultVariantId: string) {
  if (!storedVariantId || storedVariantId === LEGACY_DEFAULT_ACTOR_VARIANT_ID) {
    return defaultVariantId
  }
  return storedVariantId
}

export function getActorVariantTint(variantId: string | null | undefined) {
  if (variantId === LOBSTER_ACTOR_VARIANT_ID) {
    return LOBSTER_TINT
  }
  return null
}
