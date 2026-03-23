export const clawlibraryConfig: {
  openclaw: {
    home: string
    workspace: string
  }
  server: {
    host: string
    port: number
  }
  ui: {
    defaultLocale: 'en' | 'zh'
    showDebugToggle: boolean
    defaultDebugVisible: boolean
    showInfoToggle: boolean
    defaultInfoPanelVisible: boolean
    showThemeToggle: boolean
  }
  actor: {
    defaultVariantId: string
  }
  telemetry: {
    pollMs: number
  }
}
