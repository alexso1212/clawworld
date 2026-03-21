Original prompt: Build Clawworld as a 2.5D simulation-management AI office world.

Completed:
- Bootstrapped Vite React TypeScript app
- Added test runner and first shell test
- Established task-world, infrastructure, and diagnostics contracts
- Built the main office standby scene with Phaser blockout and scene text hooks
- Added embedded wall display plus meeting-room and boss-office whiteboards
- Added a task-world scene with the seven fixed rooms and portal entry
- Added worker prefabs, task-world motion, and completed delivery slips
- Added finance, bridge-route, and tool-locker warning signals
- Added abnormality markers, register, and triage cards
- Added an OpenClaw browser event bridge so live session payloads can hydrate the office state
- Fixed the Zustand selector loop that was blanking the app and crashing AppShell tests
- Added a local OpenClaw relay endpoint backed by `gateway call sessions.list`
- Added an opt-in `?transport=gateway` mode that hydrates the office task board from real OpenClaw sessions
- Audited the current office scene against the target “Soul Knight lobby” feeling
- Pulled a Gemini-generated office art-direction brief and saved it into `docs/2026-03-22-office-art-direction.md`

TODO:
- Rebuild the main office scene against the new art-direction brief before adding more features
- Replace floating labels with object-first interaction cues and environmental state signals
- Commission the three concept images from Gemini before visual refactor work starts
- Expand live session hydration beyond the current session-list heuristic layer
- Add richer task-world details for real sessions (preview, phase inference, per-task drilldown)
- Reduce Phaser bundle size by splitting heavier scene code
