import type { OpenClawGatewaySessionsList } from './gatewayTypes'

export async function fetchGatewaySessionsList(
  endpoint = '/api/openclaw/sessions',
  fetchImpl: typeof fetch = fetch,
): Promise<OpenClawGatewaySessionsList> {
  const response = await fetchImpl(endpoint, {
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`OpenClaw relay returned ${response.status}`)
  }

  return (await response.json()) as OpenClawGatewaySessionsList
}

type StartGatewayPollingOptions = {
  endpoint?: string
  intervalMs?: number
  fetchImpl?: typeof fetch
  onSnapshot: (snapshot: OpenClawGatewaySessionsList) => void
  onError?: (error: unknown) => void
}

export function startGatewayPolling({
  endpoint,
  intervalMs = 15_000,
  fetchImpl = fetch,
  onSnapshot,
  onError,
}: StartGatewayPollingOptions) {
  let cancelled = false

  const tick = async () => {
    try {
      const snapshot = await fetchGatewaySessionsList(endpoint, fetchImpl)
      if (!cancelled) {
        onSnapshot(snapshot)
      }
    } catch (error) {
      if (!cancelled) {
        onError?.(error)
      }
    }
  }

  void tick()
  const timer = window.setInterval(() => {
    void tick()
  }, intervalMs)

  return () => {
    cancelled = true
    window.clearInterval(timer)
  }
}
