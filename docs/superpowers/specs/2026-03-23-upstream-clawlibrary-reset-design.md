# Upstream ClawLibrary Reset Design

## Goal

Make the upstream `ClawLibrary` game the default `Clawworld` experience so we can iterate from a coherent original game instead of continuing the current hybrid shell.

## Decision

Adopt the upstream `ClawLibrary` app structure as the primary runtime:

- upstream `index.html` becomes the main page shell
- upstream `main.ts` becomes the main app entry
- upstream Phaser runtime, data protocols, and UI logic become the default experience
- our existing custom `LibraryShellApp` and `OfficeWorldApp` stop being the primary product path

## Scope

This reset only aims to restore the upstream game as the baseline.

In scope:

- move the app back to the upstream game structure
- vendor the missing upstream assets and protocol/runtime files
- make the upstream game work in local dev and GitHub Pages

Out of scope for this pass:

- re-injecting all of our custom runtime/task semantics into the upstream UI
- preserving the current hybrid shell as the main public experience
- redesigning the upstream UI

## Rationale

The current hybrid version mixes upstream scene/art assumptions with a custom React shell and custom room/runtime mapping. That created a product that is visually incomplete, structurally split, and harder to reason about than either source. Resetting to the upstream game gives us a stable product baseline and a cleaner place to add our own logic later.

## Migration Shape

1. Copy the upstream game structure into this repo.
2. Point the project entry to the upstream game.
3. Preserve our current work as legacy/reference code instead of deleting it immediately.
4. Verify local and Pages deployment.
5. Resume iteration by adding our logic into upstream seams instead of around it.
