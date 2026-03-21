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
- Created a browser-viewable blueprint wall at `public/blueprints/index.html`
- Added three SVG construction sheets for the main office, meeting room, and support corridor
- Rebuilt the main office toward a warmer pixel-office lobby layout with chunkier furniture silhouettes
- Removed most always-on environment labels from the main hall so the room reads as a scene instead of a diagram
- Kept only core interaction cues visible in the main hall: task board, whiteboards, and infrastructure warnings
- Restyled the remaining placards into squarer “sticky note” markers and removed the old wall-feed overlay
- Tightened the outer shell into a smaller arcade-style plaque + framed scene window instead of a full-width web dashboard
- Shortened the default hint copy so the shell reads more like a game prompt and less like documentation
- Removed the redundant in-scene “Main Office” marker from the runtime snapshot
- Added more lived-in lobby props and trim so the main office reads more like a staffed lounge instead of a schematic floorplan

TODO:
- Push the main office further toward a true pixel-lobby feel with more prop detail and less schematic spacing
- Add selective hover/focus labels so more interaction text can stay hidden until needed
- Commission the three concept images from Gemini before visual refactor work starts
- Expand live session hydration beyond the current session-list heuristic layer
- Add richer task-world details for real sessions (preview, phase inference, per-task drilldown)
- Reduce Phaser bundle size by splitting heavier scene code
