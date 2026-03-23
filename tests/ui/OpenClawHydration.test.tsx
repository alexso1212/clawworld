import { render, screen, waitFor } from '@testing-library/react'
import App from '../../src/App'
import { dispatchOpenClawSession } from '../../src/adapters/openclaw/browserBridge'
import type { OpenClawSessionPayload } from '../../src/adapters/openclaw/types'
import { AppProviders } from '../../src/app/providers'

test('hydrates the office wall display from incoming OpenClaw session events', async () => {
  window.history.replaceState({}, '', '/?mode=office')

  render(
    <AppProviders>
      <App />
    </AppProviders>,
  )

  const wallDisplay = screen.getByLabelText('Office wall display')
  expect(wallDisplay).toHaveTextContent('Budget state')
  expect(wallDisplay).toHaveTextContent('low')
  expect(wallDisplay).toHaveTextContent('rerouting')

  const payload: OpenClawSessionPayload = {
    id: 'release-cutover',
    title: 'Release Cutover',
    phase: 'execution',
    worker: 'executor',
    route: 'official',
    tools: ['memory'],
    abnormality: null,
    reserveState: 'healthy',
    routeStatus: 'healthy',
    toolState: 'ready',
  }

  dispatchOpenClawSession(payload)

  await waitFor(() => {
    expect(wallDisplay).toHaveTextContent('Budget state')
    expect(wallDisplay).toHaveTextContent('healthy')
    expect(wallDisplay).not.toHaveTextContent('rerouting')
    expect(wallDisplay).not.toHaveTextContent('low')
  })

  window.history.replaceState({}, '', '/')
})
