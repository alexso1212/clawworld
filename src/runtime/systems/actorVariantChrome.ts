import type { ActorVariantDef, ActorVisualDef, ActorVisualMode } from '../../core/types'
import type { UiLocale } from '../../ui/locale'

export const LEGACY_DEFAULT_ACTOR_VARIANT_ID = 'capy-claw-emoji'
export const LOBSTER_ACTOR_VARIANT_ID = 'lobster-claw'
export const LOBSTER_ACTOR_VARIANT_LABEL = 'Lobster-Claw'
const LOBSTER_SHEET_ROOT = '/assets/generated/actors/lobster-claw-v1/sheets'

function cloneVariant(variant: ActorVariantDef): ActorVariantDef {
  return {
    ...variant,
    modes: variant.modes.map((mode) => ({
      ...mode,
      stateIds: mode.stateIds ? [...mode.stateIds] : undefined,
    })),
  }
}

function createLobsterMode(
  id: string,
  mode: ActorVisualMode['mode'],
  frameCount: number,
  fps: number,
  stateIds?: ActorVisualMode['stateIds'],
): ActorVisualMode {
  return {
    mode,
    stateIds,
    textureKey: `lobster-claw-${id}-sheet`,
    path: `${LOBSTER_SHEET_ROOT}/${id}-spritesheet.png`,
    kind: 'spritesheet',
    frameWidth: 128,
    frameHeight: 128,
    frameCount,
    animation: {
      fps,
      repeat: -1,
    },
  }
}

function createLobsterVariant(): ActorVariantDef {
  return {
    id: LOBSTER_ACTOR_VARIANT_ID,
    label: LOBSTER_ACTOR_VARIANT_LABEL,
    modes: [
      createLobsterMode('stand_back', 'idle', 12, 6, ['idle']),
      createLobsterMode('stand_front', 'idle', 12, 6, ['idle']),
      createLobsterMode('rest', 'idle', 10, 6, ['idle']),
      createLobsterMode('sleep', 'idle', 10, 6, ['resting']),
      createLobsterMode('coffee', 'idle', 12, 6, ['resting']),
      createLobsterMode('lie_flat', 'idle', 10, 6, ['error']),
      createLobsterMode('walk', 'moving', 12, 7),
      createLobsterMode('work', 'working', 12, 6, ['writing', 'executing']),
      createLobsterMode('read', 'working', 12, 6, ['cataloging', 'documenting']),
      createLobsterMode('idea', 'working', 12, 6, ['monitoring', 'researching']),
      createLobsterMode('repair', 'working', 12, 6, ['syncing']),
      createLobsterMode('error', 'working', 12, 6, ['error']),
      createLobsterMode('coffee', 'working', 12, 6, ['resting']),
    ],
  }
}

export function ensureLobsterActorVariant(actor: ActorVisualDef | undefined): ActorVisualDef | undefined {
  if (!actor) {
    return actor
  }

  const variants = Array.isArray(actor.variants) ? actor.variants.map(cloneVariant) : []
  const nonLobsterVariants = variants.filter((variant) => variant.id !== LOBSTER_ACTOR_VARIANT_ID)

  return {
    ...actor,
    variants: [createLobsterVariant(), ...nonLobsterVariants],
    defaultVariantId: LOBSTER_ACTOR_VARIANT_ID,
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

export function getActorVariantTint(_variantId: string | null | undefined) {
  return null
}
