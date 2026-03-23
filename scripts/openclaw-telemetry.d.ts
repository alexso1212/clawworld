export type OpenClawSnapshotCache = {
  generatedAt: string
  mode: string
  resources: Array<{
    id: string
    items?: unknown[]
    [key: string]: unknown
  }>
  [key: string]: unknown
}

export function createOpenClawSnapshot(options?: {
  mock?: boolean
  includeItems?: boolean
  itemResourceIds?: string[] | null
  includeExcerpt?: boolean
}): Promise<OpenClawSnapshotCache>

export function findSnapshotResource(
  snapshot: OpenClawSnapshotCache,
  resourceId: string,
): OpenClawSnapshotCache['resources'][number] | null

export function resolveOpenClawPath(pathValue: string): string | null
