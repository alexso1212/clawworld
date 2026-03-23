# ClawLibrary Shell Design

## Goal

Use the current `Clawworld` repository as the execution base, but replace the current default office-facing frontend with a first-phase static shell inspired by `shengyu-meng/ClawLibrary`.

The first phase should feel like a living pixel archive and visual control interface for OpenClaw, while still preserving the existing Clawworld runtime adapters and scene logic for later reintegration.

## Source Direction

The design direction is based on the public `ClawLibrary` repository and README:

- 2D pixel-game-style control interface
- resource rooms such as document archive, image atelier, memory vault, skill forge, runtime monitor, queue hub, and break room
- actor movement and room routing as the primary way of showing system activity
- browsable asset-oriented interface instead of a task-board-first office shell

## Product Decision

We will not migrate to the `ClawLibrary` repository directly.

We will instead:

1. keep `Clawworld` as the codebase and future integration point
2. add a new default "library shell" frontend that reproduces the `ClawLibrary` feel as closely as practical with local code
3. preserve the current office/task-world logic behind the codebase boundary so it can be mapped back in during a later phase

This avoids mixing two different domain models too early:

- `ClawLibrary` is primarily asset-library and runtime-monitor oriented
- `Clawworld` is primarily task-flow and triage oriented

## Phase Scope

### In Scope

- a ClawLibrary-style shell as the default app experience
- a new static museum/library scene with named rooms aligned to the ClawLibrary README
- a right-side info panel and bottom status rail that feel like an asset monitor, not an office overlay
- static room metadata, fake asset summaries, fake active routes, and fake runtime activity
- scene hotspots and selection behavior for rooms
- one or more moving actors to create a "living archive" feeling
- tests for the new shell manifest and default app rendering

### Out of Scope

- live OpenClaw telemetry integration
- direct file preview or real asset browsing
- replacing the existing adapters under `src/adapters/openclaw`
- deleting the current office/task-world code
- perfect asset parity with the upstream repository

## Experience Principles

### 1. The app should read like a museum, not an office

The user should feel like they are walking through a classified pixel archive. The room list, labels, and panels should be organized around asset types and runtime access, not around workers, bosses, or whiteboards.

### 2. The default view should answer two questions

The shell should visually answer:

1. What kinds of assets exist?
2. What is OpenClaw doing with them right now?

This should be obvious before any future live integration arrives.

### 3. Existing Clawworld logic remains available but secondary

The old office/task-world implementation should stay in the repo as a later integration source. Phase one should not spend effort trying to merge task triage semantics into the new shell yet.

## Architecture

## App Structure

Introduce a top-level "experience mode" split:

- `library-shell` as the default mode
- `office-world` as the preserved current mode

The default exported app remains the same entry point, but the rendered experience changes to the library shell unless a mode override is set later.

## Frontend Composition

The new default UI should be composed from four layers:

1. `LibraryShellApp`
   Handles shell-level state such as selected room, active activity feed item, and static manifests.
2. `LibraryScene`
   Owns the Phaser scene host and scene overlay plumbing for the museum layout.
3. `LibraryScene` prefab/manifests
   Define room positions, actor routes, labels, and fake room occupancy/activity.
4. `LibraryInfoPanel`
   Renders room details, asset counts, activity summary, and route status outside the scene canvas.

## Data Model

Create a static "library protocol" layer for phase one. This is intentionally fake but shaped to be easy to swap later.

Key concepts:

- `library rooms`
- `asset groups`
- `active routes`
- `actor assignments`
- `runtime monitor cards`

This data should live in a dedicated local manifest module rather than being embedded directly inside React components or Phaser scene files.

## Visual Layout

The page should move away from the current centered office plaque shell and toward a more dashboard-museum frame:

- left or center large scene canvas
- right-side persistent information panel
- bottom strip or compact status row for route/monitor/alarm summaries
- stronger identity around archive signage, room categories, and monitor tags

The overlay placeholder pattern from the current office shell should disappear from the default mode.

## Scene Design

The new static scene should include rooms inspired by the upstream README:

- document archive
- image atelier
- memory vault
- skill forge
- interface gateway
- code lab
- scheduler
- alarm board
- runtime monitor
- queue hub
- break room

Each room should have:

- a stable id
- a readable display name
- approximate scene coordinates
- a category color/accent
- fake asset and activity stats
- a hotspot hit area large enough for direct clicking

## Actor Behavior

Phase one should include simple looping actor motion to preserve the "living" quality:

- one actor patrols across archive and queue rooms
- one actor pauses near runtime monitor and interface gateway
- movement is deterministic and local, not data-driven yet

This should be enough to suggest system activity without solving real telemetry.

## Integration Boundary for Later Phases

The future live integration should be handled through an adapter layer, not by rewriting the shell:

- current OpenClaw session payloads can later map into room activity
- current diagnostics/route/tool state can later populate runtime monitor cards
- current task-phase world can later appear as one subset of the broader library map

This means phase one should avoid hard-coding UI around fake copy that prevents real mapping later.

## Files To Add Or Reshape

### New files

- `src/library/data/libraryShellManifest.ts`
- `src/library/data/libraryShellProtocol.ts`
- `src/library/ui/LibraryInfoPanel.tsx`
- `src/library/ui/LibraryStatusRail.tsx`
- `src/library/scene/LibraryScene.ts`
- `src/library/scene/LibraryScenePrefab.ts`
- `tests/library/libraryShellManifest.test.ts`
- `tests/ui/LibraryShell.test.tsx`

### Existing files to modify

- `src/app/App.tsx`
- `src/game/GameShell.tsx` or a split equivalent if the current shell is too office-specific
- `src/game/engine/createGame.ts`
- `src/styles/theme.css`

## Risks

### Risk: visual drift from ClawLibrary

Because phase one is a local recreation, not a direct migration, the result could feel merely "inspired by" instead of clearly ClawLibrary-like.

Mitigation:

- align room vocabulary and layout hierarchy with the upstream README
- shift the shell tone from office/triage language to archive/runtime language immediately
- make the right-side panel and room list feel native to the new product framing

### Risk: current office abstractions leak into the new shell

The existing overlay and marker concepts were built for whiteboards and task routing.

Mitigation:

- keep the scene bridge, but isolate new room manifests and room detail panels under `src/library`
- avoid reusing office-specific copy or panel titles in the new default mode

### Risk: later live integration becomes awkward

If static fake data is too ad hoc, later telemetry mapping will require another rewrite.

Mitigation:

- define the fake data with protocol-like shapes from the start
- keep room state, monitor cards, and actor assignments separate from presentation

## Acceptance Criteria

- launching the app shows the library shell by default
- the shell no longer reads like an office standby scene
- at least 10 library-style rooms are visible and selectable
- clicking a room updates a persistent room detail panel
- the scene includes at least one visible moving actor
- tests cover the new manifest and the default app render
- the old Clawworld office/task-world code still exists in the repo for later integration

## Assumptions

- the user prefers speed and momentum over another approval loop
- first phase should prioritize shell fidelity and product framing over data correctness
- preserving existing Clawworld logic in-place is more valuable than direct repo migration
