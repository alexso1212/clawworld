import { describe, expect, it } from 'vitest'
import { dedupeSkillItems, describeSkillRoots, resolveSkillRoots } from '../../scripts/openclaw-skill-roots.mjs'

describe('openclaw skill roots', () => {
  it('includes codex and agents skill installs alongside openclaw roots', () => {
    const roots = resolveSkillRoots({
      homeDir: '/Users/alex',
      openclawHome: '/Users/alex/.openclaw',
      workspaceRoot: '/Users/alex/.openclaw/workspace',
      codexHome: '/Users/alex/.codex',
    })

    expect(roots).toEqual([
      '/Users/alex/.openclaw/workspace',
      '/Users/alex/.openclaw/skills',
      '/Users/alex/.codex/skills',
      '/Users/alex/.agents/skills',
    ])
  })

  it('surfaces a human-readable source label that mentions every skill root family', () => {
    const description = describeSkillRoots([
      '/Users/alex/.openclaw/workspace',
      '/Users/alex/.openclaw/skills',
      '/Users/alex/.codex/skills',
      '/Users/alex/.agents/skills',
    ], {
      homeDir: '/Users/alex',
      openclawHome: '/Users/alex/.openclaw',
      workspaceRoot: '/Users/alex/.openclaw/workspace',
      codexHome: '/Users/alex/.codex',
    })

    expect(description).toContain('workspace/**/* SKILL.md')
    expect(description).toContain('.openclaw/skills')
    expect(description).toContain('.codex/skills')
    expect(description).toContain('.agents/skills')
  })

  it('dedupes duplicate skill names while keeping the most relevant install root', () => {
    const deduped = dedupeSkillItems(
      [
        { title: 'agent-browser', path: '.openclaw/skills/agent-browser', updatedAt: '2026-03-20T00:00:00.000Z' },
        { title: 'agent-browser', path: '/Users/alex/.agents/skills/agent-browser', updatedAt: '2026-03-19T00:00:00.000Z' },
        { title: 'brainstorming', path: '.openclaw/skills/brainstorming', updatedAt: '2026-03-20T00:00:00.000Z' },
        { title: 'brainstorming', path: '/Users/alex/.codex/skills/brainstorming', updatedAt: '2026-03-18T00:00:00.000Z' },
      ],
      [
        '/Users/alex/.agents/skills',
        '/Users/alex/.codex/skills',
        '/Users/alex/.openclaw/skills',
      ],
    )

    expect(deduped).toEqual([
      { title: 'agent-browser', path: '/Users/alex/.agents/skills/agent-browser', updatedAt: '2026-03-19T00:00:00.000Z' },
      { title: 'brainstorming', path: '/Users/alex/.codex/skills/brainstorming', updatedAt: '2026-03-18T00:00:00.000Z' },
    ])
  })
})
