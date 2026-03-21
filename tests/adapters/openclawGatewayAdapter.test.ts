import { mapGatewaySessionsFeed } from '../../src/adapters/openclaw/gatewaySessionsAdapter'
import type { OpenClawGatewaySessionsList } from '../../src/adapters/openclaw/gatewayTypes'

test('maps gateway sessions into office tasks and a primary runtime payload', () => {
  const gatewaySnapshot: OpenClawGatewaySessionsList = {
    ts: 1_774_121_136_227,
    path: '(multiple)',
    count: 2,
    defaults: {
      modelProvider: 'codex-cli',
      model: 'gpt-5.4',
      contextTokens: 272000,
    },
    sessions: [
      {
        key: 'agent:main:discord:channel:1483208939771531375',
        kind: 'group',
        displayName: 'discord:1483147033555632189#task',
        channel: 'discord',
        groupChannel: '#task',
        updatedAt: 200,
        sessionId: 'bridge-session',
        systemSent: true,
        abortedLastRun: false,
        totalTokensFresh: false,
        modelProvider: 'claude-bridge',
        model: 'claude-max',
        contextTokens: 200000,
      },
      {
        key: 'agent:main:main',
        kind: 'direct',
        updatedAt: 100,
        sessionId: 'main-session',
        abortedLastRun: false,
        inputTokens: 313277,
        outputTokens: 1115,
        totalTokens: 606269,
        totalTokensFresh: true,
        modelProvider: 'codex-cli',
        model: 'gpt-5.4',
        contextTokens: 272000,
      },
    ],
  }

  const feed = mapGatewaySessionsFeed(gatewaySnapshot)

  expect(feed.boardTasks).toHaveLength(2)
  expect(feed.boardTasks[0]).toMatchObject({
    id: 'bridge-session',
    title: 'Task',
    owner: 'Executor',
    status: 'Execution Workshop',
  })
  expect(feed.primaryPayload).toMatchObject({
    id: 'bridge-session',
    title: 'Task',
    route: 'bridge',
    reserveState: 'tightening',
    routeStatus: 'rerouting',
  })
})
