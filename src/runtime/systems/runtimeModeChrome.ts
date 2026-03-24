import type { OpenClawSnapshot } from '../../core/types'
import type { UiLocale } from '../../ui/locale'

type RuntimeModeChromeParams = {
  locale: UiLocale
  useStaticMockData: boolean
  forceMock: boolean
  snapshotMode: OpenClawSnapshot['mode'] | null | undefined
}

export function describeRuntimeModeChrome(params: RuntimeModeChromeParams) {
  const { locale, useStaticMockData, forceMock, snapshotMode } = params

  if (forceMock) {
    return locale === 'zh'
      ? {
          stamp: '强制 MOCK',
          subtitle: '当前被锁定为本地 mock 预览，不会读取真实 OpenClaw 数据。',
        }
      : {
          stamp: 'FORCED MOCK',
          subtitle: 'Local mock preview is forced, so real OpenClaw data is disabled.',
        }
  }

  if (useStaticMockData || snapshotMode === 'mock') {
    return locale === 'zh'
      ? {
          stamp: '静态 MOCK',
          subtitle: '当前是静态演示快照；本地运行才能读取真实 OpenClaw 数据。',
        }
      : {
          stamp: 'STATIC MOCK',
          subtitle: 'Hosted demo snapshot. Run locally to read real OpenClaw data.',
        }
  }

  return locale === 'zh'
    ? {
        stamp: '本地 LIVE',
        subtitle: '正在读取本地 OpenClaw snapshot 与资源详情接口。',
      }
    : {
        stamp: 'LIVE LOCAL',
        subtitle: 'Reading local OpenClaw snapshot and resource detail endpoints.',
      }
}
