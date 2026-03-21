import { createTriageCard } from '../../src/domain/diagnostics'

test('triage card exposes what happened, impact, and where to check first', () => {
  const card = createTriageCard({
    code: 'bridge-down',
    objectId: 'bridge-alpha',
    title: 'Bridge Alpha unavailable',
    whatHappened: 'Internal bridge route is unavailable',
    impact: 'Execution desk rerouted to the public line',
    firstCheck: 'Inspect bridge service health',
  })

  expect(card).toMatchObject({
    whatHappened: expect.any(String),
    impact: expect.any(String),
    firstCheck: expect.any(String),
  })
})
