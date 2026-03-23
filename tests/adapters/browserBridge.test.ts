import { afterEach, describe, expect, it } from 'vitest'
import { shouldUseGatewayTransport } from '../../src/adapters/openclaw/browserBridge'

describe('shouldUseGatewayTransport', () => {
  afterEach(() => {
    delete window.__CLAWWORLD_ENABLE_GATEWAY__
  })

  it('allows gateway transport on localhost when explicitly requested', () => {
    const locationLike = new URL('http://127.0.0.1:4173/?transport=gateway')

    expect(shouldUseGatewayTransport(locationLike)).toBe(true)
  })

  it('disables query-driven gateway transport on deployed non-local hosts', () => {
    const locationLike = new URL('https://clawworld-demo.vercel.app/?transport=gateway')

    expect(shouldUseGatewayTransport(locationLike)).toBe(false)
  })

  it('still honors the explicit global override on deployed hosts', () => {
    window.__CLAWWORLD_ENABLE_GATEWAY__ = true
    const locationLike = new URL('https://clawworld-demo.vercel.app/?transport=gateway')

    expect(shouldUseGatewayTransport(locationLike)).toBe(true)
  })
})
