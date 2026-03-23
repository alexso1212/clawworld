import { describe, expect, it } from 'vitest'
import { resolveAppAssetPath, shouldUseStaticMockData } from '../../src/runtime/systems/appRuntime'

describe('app runtime helpers', () => {
  it('prefixes upstream asset paths with the current base path', () => {
    expect(resolveAppAssetPath('/assets/packs/default/2026-03-09/scene-floor.png', '/clawworld/')).toBe(
      '/clawworld/assets/packs/default/2026-03-09/scene-floor.png',
    )
    expect(resolveAppAssetPath('/assets/generated/actors/capy-claw-emoji-v2/sheets/walk-spritesheet.png', '/')).toBe(
      '/assets/generated/actors/capy-claw-emoji-v2/sheets/walk-spritesheet.png',
    )
  })

  it('switches hosted demos onto static mock data automatically', () => {
    expect(
      shouldUseStaticMockData({
        hostname: 'alexso1212.github.io',
        protocol: 'https:',
        search: '',
      }),
    ).toBe(true)
    expect(
      shouldUseStaticMockData({
        hostname: '127.0.0.1',
        protocol: 'http:',
        search: '',
      }),
    ).toBe(false)
  })

  it('treats production static builds on localhost as mock-backed demos by default', () => {
    expect(
      shouldUseStaticMockData(
        {
          hostname: '127.0.0.1',
          protocol: 'http:',
          search: '',
        },
        {
          isDev: false,
        },
      ),
    ).toBe(true)
    expect(
      shouldUseStaticMockData(
        {
          hostname: '127.0.0.1',
          protocol: 'http:',
          search: '?live=1',
        },
        {
          isDev: false,
        },
      ),
    ).toBe(false)
  })
})
