# ClawLibrary Shell Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Clawworld office shell with a first-phase static ClawLibrary-style library shell while keeping the current office/task-world logic in the repository for later integration.

**Architecture:** Add a new library-focused data/scene/UI slice under `src/library`, render it as the default app experience, and keep the current office-world code behind a preserved mode boundary. Use static protocol-like fake data now so the future telemetry adapter can slot in without redesigning the shell.

**Tech Stack:** React 19, TypeScript, Phaser 3, Vite, Zustand, Vitest, Testing Library

---

## File Structure

- Create: `src/library/data/libraryShellProtocol.ts`
- Create: `src/library/data/libraryShellManifest.ts`
- Create: `src/library/scene/LibraryScene.ts`
- Create: `src/library/scene/LibraryScenePrefab.ts`
- Create: `src/library/ui/LibraryInfoPanel.tsx`
- Create: `src/library/ui/LibraryStatusRail.tsx`
- Create: `tests/library/libraryShellManifest.test.ts`
- Create: `tests/ui/LibraryShell.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/game/engine/createGame.ts`
- Modify: `src/game/GameShell.tsx`
- Modify: `src/styles/theme.css`
- Optional follow-up modify: `tests/ui/AppShell.test.tsx`

## Chunk 1: Static Protocol And Tests

### Task 1: Define the library-shell protocol types

**Files:**
- Create: `src/library/data/libraryShellProtocol.ts`

- [ ] **Step 1: Write the failing type-oriented manifest test**

Add assertions in `tests/library/libraryShellManifest.test.ts` that expect:
- 10+ rooms
- stable ids for `document-archive`, `runtime-monitor`, and `queue-hub`
- a default selected room id

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/library/libraryShellManifest.test.ts`
Expected: FAIL because the library manifest module does not exist yet

- [ ] **Step 3: Add protocol types**

Define focused types for:
- room records
- asset summary records
- runtime cards
- actor route points
- library shell snapshot

- [ ] **Step 4: Run test to confirm module wiring still fails on missing data**

Run: `npm test -- tests/library/libraryShellManifest.test.ts`
Expected: FAIL on missing manifest exports, not missing type module

- [ ] **Step 5: Commit**

```bash
git add src/library/data/libraryShellProtocol.ts tests/library/libraryShellManifest.test.ts
git commit -m "test: scaffold library shell protocol"
```

### Task 2: Implement the static library manifest

**Files:**
- Create: `src/library/data/libraryShellManifest.ts`
- Test: `tests/library/libraryShellManifest.test.ts`

- [ ] **Step 1: Expand the failing test with concrete expectations**

Assert:
- room count is at least 10
- `runtime-monitor` has monitor-style cards
- `queue-hub` has active route data
- actor route arrays are non-empty

- [ ] **Step 2: Run test to verify the new assertions fail**

Run: `npm test -- tests/library/libraryShellManifest.test.ts`
Expected: FAIL on missing manifest values

- [ ] **Step 3: Implement the minimal manifest**

Create a protocol-like static manifest with:
- room metadata
- selected-room default
- fake asset summaries
- fake runtime monitor cards
- fake moving actor paths

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/library/libraryShellManifest.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/library/data/libraryShellManifest.ts tests/library/libraryShellManifest.test.ts
git commit -m "feat: add static library shell manifest"
```

## Chunk 2: Default Library UI

### Task 3: Add a default library-shell app render test

**Files:**
- Create: `tests/ui/LibraryShell.test.tsx`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Write the failing render test**

Assert the default app renders:
- `ClawLibrary` brand text
- a scene host
- a persistent room detail panel
- runtime monitor/status text aligned to the library shell

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: FAIL because the app still renders the office shell

- [ ] **Step 3: Add minimal library-shell state and UI composition**

Refactor `src/app/App.tsx` to:
- use the new static manifest
- track selected room state locally
- render library scene host and side panel

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/App.tsx tests/ui/LibraryShell.test.tsx
git commit -m "feat: switch app default to library shell"
```

### Task 4: Build the room detail panel and status rail

**Files:**
- Create: `src/library/ui/LibraryInfoPanel.tsx`
- Create: `src/library/ui/LibraryStatusRail.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Write test expectations for room details**

Extend `tests/ui/LibraryShell.test.tsx` to assert:
- selected room title
- asset summary rows
- runtime monitor cards
- route/status rail text

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: FAIL on missing panel or status content

- [ ] **Step 3: Implement the panel and rail**

Add:
- room detail card
- asset summary list
- runtime monitor card stack
- status rail with route and alarm summaries

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/library/ui/LibraryInfoPanel.tsx src/library/ui/LibraryStatusRail.tsx src/app/App.tsx src/styles/theme.css tests/ui/LibraryShell.test.tsx
git commit -m "feat: add library shell information panels"
```

## Chunk 3: Phaser Library Scene

### Task 5: Add a library scene implementation with clickable rooms

**Files:**
- Create: `src/library/scene/LibraryScene.ts`
- Create: `src/library/scene/LibraryScenePrefab.ts`
- Modify: `src/game/engine/createGame.ts`
- Modify: `src/game/GameShell.tsx`

- [ ] **Step 1: Write a manifest-to-scene bridge test or snapshot test**

Add assertions that room ids from the manifest are exposed as interactive markers in the library scene snapshot.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/library/libraryShellManifest.test.ts tests/ui/LibraryShell.test.tsx`
Expected: FAIL because the library scene is not wired into the game shell

- [ ] **Step 3: Implement the scene**

Add a Phaser scene that:
- draws a museum/archive-style floorplan
- creates interactive markers from the room manifest
- publishes a snapshot through the existing scene bridge
- supports selected-room updates

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/library/libraryShellManifest.test.ts tests/ui/LibraryShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/library/scene/LibraryScene.ts src/library/scene/LibraryScenePrefab.ts src/game/engine/createGame.ts src/game/GameShell.tsx tests/library/libraryShellManifest.test.ts tests/ui/LibraryShell.test.tsx
git commit -m "feat: add library shell phaser scene"
```

### Task 6: Add deterministic actor motion

**Files:**
- Modify: `src/library/scene/LibraryScene.ts`
- Optionally modify: `src/library/data/libraryShellManifest.ts`

- [ ] **Step 1: Add a failing assertion around living-scene behavior**

Use the existing `advanceTime` snapshot pattern to verify at least one actor marker position changes after advancing time.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: FAIL because markers are static

- [ ] **Step 3: Implement deterministic motion**

Move one or two actors along manifest route points using the existing scene bridge advance loop.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/LibraryShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/library/scene/LibraryScene.ts src/library/data/libraryShellManifest.ts tests/ui/LibraryShell.test.tsx
git commit -m "feat: animate library shell actors"
```

## Chunk 4: Final Styling And Regression Coverage

### Task 7: Rework theme styling for the new shell

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Add assertions that old office copy no longer drives the default shell**

Update `tests/ui/AppShell.test.tsx` or replace it so the default render expects the library shell brand and panel framing instead of office overlay copy.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/AppShell.test.tsx tests/ui/LibraryShell.test.tsx`
Expected: FAIL on outdated copy or layout expectations

- [ ] **Step 3: Implement the visual restyle**

Update the theme to:
- frame the page as a pixel museum dashboard
- style the right-side info panel and status rail
- tone down office-specific chrome

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/ui/AppShell.test.tsx tests/ui/LibraryShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.css tests/ui/AppShell.test.tsx tests/ui/LibraryShell.test.tsx
git commit -m "style: restyle default shell as clawlibrary-inspired archive"
```

### Task 8: Verify build and regression baseline

**Files:**
- Modify as needed from previous tasks

- [ ] **Step 1: Run focused unit tests**

Run: `npm test -- tests/library/libraryShellManifest.test.ts tests/ui/LibraryShell.test.tsx tests/ui/AppShell.test.tsx`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: PASS except for any already-known unrelated failures that predate the shell work

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Note any pre-existing failures**

Document any unrelated failures, especially the existing pixel atlas test gap if it still remains unresolved.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: land phase-one clawlibrary shell"
```

Plan complete and saved to `docs/superpowers/plans/2026-03-23-clawlibrary-shell.md`. Ready to execute?
