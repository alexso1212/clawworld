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

TODO:
- Connect the browser event bridge to a real OpenClaw/Hivemind transport instead of manual dispatch
- Expand live session hydration beyond the single-session MVP shape
- Reduce Phaser bundle size by splitting heavier scene code
