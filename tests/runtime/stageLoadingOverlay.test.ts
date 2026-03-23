import { beforeEach, describe, expect, it } from 'vitest'
import { createStageLoadingOverlay } from '../../src/runtime/systems/stageLoadingOverlay'

describe('stage loading overlay', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="stage-loading" aria-hidden="false">
        <div id="stage-loading-label"></div>
        <div id="stage-loading-detail"></div>
        <div id="stage-loading-progress"></div>
      </div>
    `
  })

  it('shows loading copy and progress until the stage is ready', () => {
    const overlay = createStageLoadingOverlay(document)

    overlay.show({
      label: 'Loading archive',
      detail: 'Pulling scene art from the hosted pack.',
      progress: 0.42,
    })

    expect(document.getElementById('stage-loading')?.classList.contains('hidden')).toBe(false)
    expect(document.getElementById('stage-loading')?.getAttribute('aria-hidden')).toBe('false')
    expect(document.getElementById('stage-loading-label')?.textContent).toBe('Loading archive')
    expect(document.getElementById('stage-loading-detail')?.textContent).toBe(
      'Pulling scene art from the hosted pack.',
    )
    expect(document.getElementById('stage-loading-progress')?.textContent).toBe('42% ready')

    overlay.hide()

    expect(document.getElementById('stage-loading')?.classList.contains('hidden')).toBe(true)
    expect(document.getElementById('stage-loading')?.getAttribute('aria-hidden')).toBe('true')
  })
})
