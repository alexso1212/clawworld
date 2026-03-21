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
- Commissioned Gemini Ultra for a dedicated task-world art-direction brief and saved it as `docs/2026-03-22-task-world-art-direction.md`
- Commissioned Gemini Ultra for a dedicated sprite-and-object direction brief and saved it as `docs/2026-03-22-sprite-direction.md`
- Wrote the formal AI art pipeline in `docs/2026-03-22-ai-art-pipeline.md`, locking Gemini Ultra as art director and Nano Banana as optional single-image asset support rather than the core game-production engine
- Rebuilt the task world from a dark dashboard into a warmer project war-room layout with room-specific props
- Removed worker name placards from the task-world runtime snapshot so the scene reads more like a room and less like a personnel chart
- Switched office and task-world labels to hotspot-style hover/click reveals instead of always-on text
- Upgraded worker sprites from simple head/body blocks to clearer office-character silhouettes with shadow, role-specific props, and stronger pixel-like outlines
- Expanded whiteboard, task-board, and room hotspots into object-sized invisible hit areas so furniture can be clicked directly instead of relying on pin-sized placards
- Reworked the main-office boards, finance/tool area, and task-room furniture into more recognizable pixel-office silhouettes instead of rounded dashboard cards

TODO:
- Route the next major art-direction pass through Gemini Ultra before reworking the task world or any new scene
- Push the main office further toward a true pixel-lobby feel with richer shading and less washed-out negative space
- Replace the current vector-built props with real sprite sheets / atlas pieces once the silhouettes are locked
- Push more functions into object affordances so even the remaining hover outlines can get subtler
- Commission the three concept images from Gemini before visual refactor work starts
- Expand live session hydration beyond the current session-list heuristic layer
- Add richer task-world details for real sessions (preview, phase inference, per-task drilldown)
- Reduce Phaser bundle size by splitting heavier scene code
