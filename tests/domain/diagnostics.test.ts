import { createAbnormality, createTriageCard } from '../../src/domain/diagnostics'

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

test('abnormality cards always include marker, impact, and first check', () => {
  const abnormality = createAbnormality('bridge-down')

  expect(abnormality.marker).toBe('!')
  expect(abnormality.triageCard.whatHappened).toBeTruthy()
  expect(abnormality.triageCard.impact).toBeTruthy()
  expect(abnormality.triageCard.firstCheck).toBeTruthy()
})
