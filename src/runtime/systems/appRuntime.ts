type LocationLike = {
  hostname: string
  protocol: string
  search: string
}

type StaticMockOptions = {
  isDev?: boolean
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

function normalizeBasePath(basePath: string | undefined) {
  if (!basePath || basePath === '/') {
    return ''
  }

  return `/${basePath.replace(/^\/+|\/+$/g, '')}`
}

export function resolveAppAssetPath(path: string, basePath = import.meta.env.BASE_URL) {
  if (!path) {
    return path
  }

  if (/^(?:https?:)?\/\//.test(path)) {
    return path
  }

  if (path.startsWith('/')) {
    return `${normalizeBasePath(basePath)}${path}`
  }

  return `${normalizeBasePath(basePath)}/${path.replace(/^\/+/, '')}`
}

export function isLocalHost(hostname: string) {
  return LOCAL_HOSTS.has(hostname)
}

export function shouldUseStaticMockData(
  locationLike: LocationLike,
  { isDev = import.meta.env.DEV }: StaticMockOptions = {},
) {
  const params = new URLSearchParams(locationLike.search)

  if (params.get('mock') === '1') {
    return true
  }

  if (params.get('live') === '1') {
    return false
  }

  if (locationLike.protocol === 'file:') {
    return true
  }

  if (!isDev) {
    return true
  }

  return !isLocalHost(locationLike.hostname)
}
