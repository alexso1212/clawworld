# Upstream ClawLibrary Reset Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current hybrid app with the upstream ClawLibrary game as the default runtime and deployment target.

**Architecture:** Vendor the upstream ClawLibrary app structure into this repo and make it the active entrypoint. Keep prior custom shell code in place as legacy/reference but remove it from the main runtime path.

**Tech Stack:** Vite, TypeScript, Phaser, GitHub Pages

---

## Chunk 1: Document And Prepare

### Task 1: Record the approved reset direction

**Files:**
- Create: `docs/superpowers/specs/2026-03-23-upstream-clawlibrary-reset-design.md`
- Create: `docs/superpowers/plans/2026-03-23-upstream-clawlibrary-reset.md`

- [ ] **Step 1: Write the approved reset spec**

Summarize that upstream ClawLibrary becomes the default app and the current hybrid shell becomes legacy/reference.

- [ ] **Step 2: Save the implementation plan**

Capture the migration tasks below so the reset stays structured.

## Chunk 2: Vendor Upstream Runtime

### Task 2: Copy the upstream app structure into this repo

**Files:**
- Modify/Create: `index.html`
- Modify/Create: `clawlibrary.config.json`
- Modify/Create: `src/main.ts`
- Create/Modify: `src/core/**`
- Create/Modify: `src/data/**`
- Create/Modify: `src/runtime/**`
- Create/Modify: `src/ui/**`
- Create/Modify: `scripts/clawlibrary-config.mjs`
- Create/Modify: `scripts/openclaw-telemetry.mjs`
- Create/Modify: `public/assets/**`

- [ ] **Step 1: Copy upstream HTML shell and entry modules**

Bring over upstream `index.html`, `src/main.ts`, and runtime-support folders.

- [ ] **Step 2: Copy upstream assets and protocol data**

Bring over the full upstream asset set and protocol JSON files so the original game can render completely.

- [ ] **Step 3: Preserve current custom code as non-default**

Do not delete our current `src/library/**`, `src/app/**`, and related integration code yet, but ensure it is no longer the default runtime path.

## Chunk 3: Rewire Build And Runtime

### Task 3: Make the upstream game build inside this repo

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`
- Modify: `tsconfig*.json` as needed

- [ ] **Step 1: Update Vite config for non-React default entry**

Keep the needed server/API behavior, but remove assumptions that the app entry must be React.

- [ ] **Step 2: Keep GitHub Pages compatibility**

Ensure the base path logic still works for `/clawworld/`.

- [ ] **Step 3: Keep necessary OpenClaw dev endpoints**

Retain or port the upstream snapshot/resource/preview/open endpoints needed by the original game.

## Chunk 4: Verify And Redeploy

### Task 4: Prove the reset works

**Files:**
- Test: local runtime via browser
- Test: `npm run build`
- Test: `npm test` where still applicable

- [ ] **Step 1: Run targeted tests**

Run the test suites that still apply after the reset and adjust any entrypoint tests that now target the upstream app.

- [ ] **Step 2: Build with GitHub Pages base path**

Run `VITE_BASE_PATH=/clawworld/ npm run build`.

- [ ] **Step 3: Check the built app in a browser**

Open the generated app locally under a `/clawworld/` path and verify the original game renders.

- [ ] **Step 4: Push and wait for GitHub Pages**

Deploy the reset and verify the public page loads the upstream game instead of the hybrid shell.
