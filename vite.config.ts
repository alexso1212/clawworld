/// <reference types="vitest/config" />
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const execFileAsync = promisify(execFile)
const openClawSessionsPath = '/api/openclaw/sessions'

function openClawGatewayRelay() {
  const handle = async (req: { url?: string; method?: string }, res: {
    statusCode: number
    setHeader: (name: string, value: string) => void
    end: (body?: string) => void
  }, next: () => void) => {
    if (req.method !== 'GET' || req.url !== openClawSessionsPath) {
      next()
      return
    }

    try {
      const { stdout } = await execFileAsync('openclaw', [
        'gateway',
        'call',
        'sessions.list',
        '--params',
        '{}',
        '--json',
      ])

      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(stdout)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.statusCode = 503
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ error: 'openclaw relay unavailable', detail: message }))
    }
  }

  return {
    name: 'clawworld-openclaw-gateway-relay',
    configureServer(server: { middlewares: { use: (fn: typeof handle) => void } }) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server: { middlewares: { use: (fn: typeof handle) => void } }) {
      server.middlewares.use(handle)
    },
  }
}

export default defineConfig({
  plugins: [react(), openClawGatewayRelay()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})
