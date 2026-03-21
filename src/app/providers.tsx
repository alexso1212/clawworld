import { useEffect, type ReactNode } from 'react'
import {
  OPENCLAW_SESSION_EVENT,
  OPENCLAW_USE_MOCK_EVENT,
} from '../adapters/openclaw/browserBridge'
import type { OpenClawSessionPayload } from '../adapters/openclaw/types'
import { useClawworldStore } from '../state/clawworldStore'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const hydrateFromOpenClaw = useClawworldStore((state) => state.hydrateFromOpenClaw)
  const useMockSession = useClawworldStore((state) => state.useMockSession)

  useEffect(() => {
    const bootstrapSession = window.__CLAWWORLD_BOOT_SESSION__
    if (bootstrapSession) {
      hydrateFromOpenClaw(bootstrapSession)
    }

    const handleSession = (event: Event) => {
      const payload = (event as CustomEvent<OpenClawSessionPayload>).detail
      if (payload) {
        hydrateFromOpenClaw(payload)
      }
    }

    const handleUseMock = () => {
      useMockSession()
    }

    window.addEventListener(OPENCLAW_SESSION_EVENT, handleSession as EventListener)
    window.addEventListener(OPENCLAW_USE_MOCK_EVENT, handleUseMock)

    return () => {
      window.removeEventListener(OPENCLAW_SESSION_EVENT, handleSession as EventListener)
      window.removeEventListener(OPENCLAW_USE_MOCK_EVENT, handleUseMock)
    }
  }, [hydrateFromOpenClaw, useMockSession])

  return children
}
