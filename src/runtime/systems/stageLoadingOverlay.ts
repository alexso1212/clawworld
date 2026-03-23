type StageLoadingElements = {
  root: HTMLElement
  label: HTMLElement | null
  detail: HTMLElement | null
  progress: HTMLElement | null
}

export const STAGE_LOADING_PROGRESS_EVENT = 'clawlibrary:stage-loading-progress'
export const STAGE_READY_EVENT = 'clawlibrary:stage-ready'

type StageLoadingState = {
  label: string
  detail?: string
  progress?: number | null
}

function clampProgress(progress: number) {
  return Math.max(0, Math.min(1, progress))
}

function formatProgress(progress: number) {
  return `${Math.round(clampProgress(progress) * 100)}% ready`
}

function resolveElements(doc: Document): StageLoadingElements | null {
  const root = doc.getElementById('stage-loading')
  if (!(root instanceof HTMLElement)) {
    return null
  }

  return {
    root,
    label: doc.getElementById('stage-loading-label'),
    detail: doc.getElementById('stage-loading-detail'),
    progress: doc.getElementById('stage-loading-progress'),
  }
}

export function createStageLoadingOverlay(doc: Document = document) {
  const elements = resolveElements(doc)

  return {
    show({ label, detail = '', progress = null }: StageLoadingState) {
      if (!elements) {
        return
      }

      elements.root.classList.remove('hidden')
      elements.root.setAttribute('aria-hidden', 'false')
      elements.root.setAttribute('aria-busy', 'true')

      if (elements.label) {
        elements.label.textContent = label
      }

      if (elements.detail) {
        elements.detail.textContent = detail
      }

      if (elements.progress) {
        elements.progress.textContent = typeof progress === 'number' ? formatProgress(progress) : ''
      }
    },

    hide() {
      if (!elements) {
        return
      }

      elements.root.classList.add('hidden')
      elements.root.setAttribute('aria-hidden', 'true')
      elements.root.setAttribute('aria-busy', 'false')
    },
  }
}
