# Clawworld Sprite Pass 01: Production Manifest

This manifest outlines the 12 essential assets required to transition from code-rectangles to a sprite-first visual system. All assets must use a unified "Warm Office" palette (creams, ambers, deep woods, and soft teals).

## I. Character Sprites (Entity Layer)

1.  **`char-amane-dispatcher`**
    *   **Size:** 24x32 px
    *   **States:** `idle`, `talk` (mouth movement), `wave` (on-hover)
    *   **Silhouette:** Upright posture, high ponytail, simple vest over a collared shirt.
    *   **Palette:** Peach skin tones, navy-blue vest, warm white shirt.
    *   **Replaces UI Label:** "Amane / Dispatcher"

2.  **`char-executor-worker`**
    *   **Size:** 24x32 px
    *   **States:** `idle`, `walk` (4-frame loop), `interact` (leaning forward)
    *   **Silhouette:** Slightly hunched, rolled-up sleeves, carrying a digital tablet.
    *   **Palette:** Earthy brown trousers, muted teal shirt, safety-orange accent on tablet.
    *   **Replaces UI Label:** "Executor"

3.  **`char-auditor-reviewer`**
    *   **Size:** 24x32 px
    *   **States:** `idle`, `adjust-glasses` (shimmer frame), `peer` (leaning in)
    *   **Silhouette:** Sharp, rectangular profile, stiff blazer, holding a physical clipboard.
    *   **Palette:** Charcoal grey suit, lime-green tie, pale grey hair.
    *   **Replaces UI Label:** "Auditor / Reviewer"

## II. Main-Office Furniture (Static/Interactive Layer)

4.  **`prop-task-board`**
    *   **Size:** 64x48 px
    *   **States:** `static`, `active` (notes fluttering/glowing)
    *   **Silhouette:** A wide corkboard on a wheeled metal frame, cluttered with overlapping papers.
    *   **Palette:** Rich cork-oak brown, neon pink and yellow sticky-note accents.
    *   **Replaces UI Label:** "Task Board"

5.  **`prop-desk-cluster`**
    *   **Size:** 48x32 px
    *   **States:** `idle`, `busy` (monitor screens flickering)
    *   **Silhouette:** L-shaped desk arrangement with low partitions and coffee mugs.
    *   **Palette:** Light birch wood grain, matte black monitor backs.
    *   **Replaces UI Label:** "Open Desk Cluster"

6.  **`prop-archive-cabinet`**
    *   **Size:** 32x48 px
    *   **States:** `closed`, `open` (drawer extended)
    *   **Silhouette:** Tall, 4-drawer vertical filing cabinet with small label slots.
    *   **Palette:** Industrial olive-drab or sage green, brass-colored handles.
    *   **Replaces UI Label:** "Archive Cabinet"

7.  **`prop-tea-bar`**
    *   **Size:** 48x32 px
    *   **States:** `idle`, `steaming` (rising vapor particles)
    *   **Silhouette:** Countertop with a round kettle, stacked ceramic mugs, and a small spider-plant.
    *   **Palette:** Warm cream countertop, terracotta plant pot, soft white steam.
    *   **Replaces UI Label:** "Tea Bar"

## III. Task-World Furniture (Functional Layer)

8.  **`node-requirements-desk`**
    *   **Size:** 32x32 px
    *   **States:** `idle`, `processing` (papers shuffling)
    *   **Silhouette:** Low, sturdy table piled high with messy scrolls and blueprints.
    *   **Palette:** Cream-white paper, dark mahogany wood.
    *   **Replaces UI Label:** "Requirements Room"

9.  **`node-planning-table`**
    *   **Size:** 48x32 px
    *   **States:** `idle`, `projecting` (amber light beam)
    *   **Silhouette:** Round conference table with a central glass lens.
    *   **Palette:** Deep walnut wood, glowing amber/gold light.
    *   **Replaces UI Label:** "Planning Room"

10. **`node-execution-workbench`**
    *   **Size:** 48x48 px
    *   **States:** `idle`, `vibrating` (shake effect)
    *   **Silhouette:** Heavy-duty metal workbench with a mounted vice and hanging wrenches.
    *   **Palette:** Cast-iron grey, safety-yellow striped edges.
    *   **Replaces UI Label:** "Execution Workshop"

11. **`node-review-pedestal`**
    *   **Size:** 32x32 px
    *   **States:** `neutral`, `pass` (green light), `fail` (red light)
    *   **Silhouette:** A sleek, modern pedestal with a large circular scanner glass.
    *   **Palette:** Brushed aluminum, translucent status-light ring.
    *   **Replaces UI Label:** "Review Checkpoint"

12. **`node-memory-archive`**
    *   **Size:** 32x32 px
    *   **States:** `empty`, `storing` (lavender core pulse)
    *   **Silhouette:** A glass vacuum-tube canister standing on a copper base.
    *   **Palette:** Dark indigo glass, soft lavender internal glow.
    *   **Replaces UI Label:** "Memory Archive"

## Phaser-First Production Notes

*   **Atlas Format:** Export all frames into a single `props_v01.png` using JSON Hash format.
*   **Padding:** Use a strict 2px extrusion/padding between sprites to prevent sub-pixel bleeding.
*   **Anchor Points:** Set all origins to `(0.5, 1.0)` (bottom-center) for consistent Y-sorting.
*   **Naming Convention:** Use `key_state_frame` (e.g., `char-amane-dispatcher_walk_0`).
*   **Scale:** Assets are designed for 1:1 pixel ratio; disable `antialias` in Phaser config.
*   **Layering:** Character `depth` must be calculated as `y` coordinate for correct "object-first" occlusion.
*   **Animation:** Standardize all loops to 4 frames at 8fps for consistent "chunky" movement.
*   **Collisions:** Define physics bodies as the bottom 25% of the sprite height to allow characters to "walk behind" furniture.
