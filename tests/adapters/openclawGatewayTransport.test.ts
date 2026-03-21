import { fetchGatewaySessionsList } from '../../src/adapters/openclaw/gatewayTransport'
import type { OpenClawGatewaySessionsList } from '../../src/adapters/openclaw/gatewayTypes'

test('fetches gateway sessions from the local relay endpoint', async () => {
  const snapshot: OpenClawGatewaySessionsList = {
    ts: 1,
    path: '(multiple)',
    count: 1,
    defaults: {
      modelProvider: 'codex-cli',
      model: 'gpt-5.4',
      contextTokens: 272000,
    },
    sessions: [],
  }

  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }),
  )

  const result = await fetchGatewaySessionsList('/api/openclaw/sessions', fetchMock)

  expect(fetchMock).toHaveBeenCalledWith('/api/openclaw/sessions', {
    headers: { accept: 'application/json' },
  })
  expect(result).toEqual(snapshot)
})
