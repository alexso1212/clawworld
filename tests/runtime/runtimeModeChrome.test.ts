import { describe, expect, it } from 'vitest'
import { describeRuntimeModeChrome } from '../../src/runtime/systems/runtimeModeChrome'

describe('runtime mode chrome', () => {
  it('labels hosted demo sessions as static mock mode', () => {
    expect(
      describeRuntimeModeChrome({
        locale: 'en',
        useStaticMockData: true,
        forceMock: false,
        snapshotMode: 'mock',
      }),
    ).toEqual({
      stamp: 'STATIC MOCK',
      subtitle: 'Hosted demo snapshot. Run locally to read real OpenClaw data.',
    })
  })

  it('labels local live sessions as live local mode', () => {
    expect(
      describeRuntimeModeChrome({
        locale: 'en',
        useStaticMockData: false,
        forceMock: false,
        snapshotMode: 'live',
      }),
    ).toEqual({
      stamp: 'LIVE LOCAL',
      subtitle: 'Reading local OpenClaw snapshot and resource detail endpoints.',
    })
  })

  it('surfaces forced mock mode even on local dev', () => {
    expect(
      describeRuntimeModeChrome({
        locale: 'zh',
        useStaticMockData: false,
        forceMock: true,
        snapshotMode: 'mock',
      }),
    ).toEqual({
      stamp: '强制 MOCK',
      subtitle: '当前被锁定为本地 mock 预览，不会读取真实 OpenClaw 数据。',
    })
  })
})
