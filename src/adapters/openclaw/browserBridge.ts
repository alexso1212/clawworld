import type { OpenClawSessionPayload } from './types'

export const OPENCLAW_SESSION_EVENT = 'clawworld:session'
export const OPENCLAW_USE_MOCK_EVENT = 'clawworld:use-mock'

declare global {
  interface Window {
    __CLAWWORLD_BOOT_SESSION__?: OpenClawSessionPayload
    __CLAWWORLD_ENABLE_GATEWAY__?: boolean
  }
}

export function shouldUseGatewayTransport(locationLike = window.location) {
  if (typeof window.__CLAWWORLD_ENABLE_GATEWAY__ === 'boolean') {
    return window.__CLAWWORLD_ENABLE_GATEWAY__
  }

  const params = new URLSearchParams(locationLike.search)
  return params.get('transport') === 'gateway'
}

export function dispatchOpenClawSession(payload: OpenClawSessionPayload) {
  window.dispatchEvent(
    new CustomEvent<OpenClawSessionPayload>(OPENCLAW_SESSION_EVENT, {
      detail: payload,
    }),
  )
}

export function dispatchUseMockSession() {
  window.dispatchEvent(new CustomEvent(OPENCLAW_USE_MOCK_EVENT))
}
