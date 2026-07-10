# HANDOFF — Truncated Octahedron Deep-Dive (July 2026)

This document hands off the work done on `truncated-octahedron.html` and its
related Vector Pod / Vector House / Rhomi Pod threads, for an agent picking up
in parallel. A second session was working concurrently:
**https://claude.ai/code/session_01RQo5t2Y25tiuo51WpCRZMw** — check that
session's own history for whatever track it covered; this doc only speaks to
the work below.

**Branch:** `claude/lost-triangle-animation-math-vudrm9` (PR #52, draft)
**Latest commit:** `a7f91af` — tree is clean, fully pushed.
**Live preview:** https://gregg-fleishman-site-ubtv-git-claude-lost-triangl-6d15d6-zenbu1.vercel.app/truncated-octahedron.html
(one of four Vercel projects that auto-deploy this PR; all four are green as of the latest push)

---

## 1. What was built

### 1a. Geometry discovery (earlier in the session)
Analyzed `Rhombic_dodeca.glb` (one of Gregg's Rhino exports) and found it is
actually a **truncated octahedron** — 8 hexagonal faces on the cube's corner
`(1,1,1)/√3` directions, 6 square faces on the cube-axis `(1,0,0)` directions.
A rhombic dodecahedron would have 12 rhombic faces on the edge `(1,1,0)/√2`
directions instead; this solid has zero. Confirmed via three independent
methods (hull face-normal directions, panel aspect-ratio PCA, canonical-view
rendering).

It shares its 8 corner-hexagon panels 1:1 (part-scale ×41.97) with the Vector
Pod — "same parts, two space-filling variations."

### 1b. Vector Pod app (`vector-pod-src/`, compiled to `vector-pod/`)
- Renamed the mislabeled "Rhombic dodeca" toggle to **"Truncated octahedron"**
  throughout (`truncatedOctahedron.ts`, was `rhombicDodeca.ts`; all identifiers
  in `App.tsx` renamed to match).
- The app already implements the full reference feature set described in
  `VERTOR_POD_README.md` (uploaded by the user, see §3): Assembled/Exploded/
  Geometry modes with a separation slider, Assembly/Panels/Extension/Axis-
  reference/Cube-frame/Truncated-octahedron visibility toggles, Perspective/
  Top/Front/Right camera presets, and a clickable part inspector. No feature
  gap was found — the reference screenshot the user liked ("I like this UI
  more") turned out to be this same app.
- Rebuild workflow: `cd vector-pod-src && pnpm install && pnpm build`, then
  copy `dist/index.html` + `dist/assets/index-*.{js,css}` into `../vector-pod/`
  (filenames are content-hashed — delete the old ones first). `vite.config.ts`
  has `base: './'` for the `/vector-pod/` subpath. Verify with
  `grep -ci vertor dist/assets/*.js` = 0 (historical typo, must not regress).

### 1c. Rhomi Pod + Vector House models
- `assets/models/rhomi-pod.glb` — tessellated from Gregg's
  `Single_Rhomi_Pod_STEP.stp` via OCCT (`cadquery-ocp`). Plain glTF, no
  compression.
- `assets/models/vector-house.glb` — replaced with a material-rich glass-panel
  version (`260710_Vectorhouse.glb`), re-optimized with gltf-transform
  (`EXT_meshopt_compression`, `EXT_texture_webp`, `KHR_materials_transmission`
  et al. — **requires `MeshoptDecoder`** at load time, see §2).
- Both are wired into `mathematics-preview.html#pod` via
  `assets/lost-triangle/rhomi-pod-scene.js` and `vector-house-scene.js`
  (r160 ESM, `GLTFLoader` + `OrbitControls`, follow that file's pattern for
  any new model viewer).

### 1d. `truncated-octahedron.html` — the new deep-dive page
Full-bleed Three.js r160 ESM page (nav active = "The Cube"). Two-part thesis,
per explicit owner direction:
1. **Space-filling leads** — "the keyword Gregg kept saying is space-filling
   geometries" — the page opens with Kelvin's cell / BCC packing, not with the
   Lost Triangle math.
2. **The angles are the crux** — three gold arcs (45° / 35.26° / 54.74° =
   arctan√2) sweep open between the 1/√2/√3 direction spokes, and the actual
   1:√2:√3 right triangle is drawn inside the cell so its own two acute angles
   visibly *are* two of those arcs.

Geometry is **computed, not loaded** — the truncated octahedron is built from
the 24 signed permutations of `(0,1,2)` so every ratio is exact by
construction (site convention: never eyeball geometry).

**The "Mode" stepper — walking from math to Gregg's built form** (added after
the user said "bring in the framing system... give it the ability to toggle
between the geometry and then ending at Gregg's structures"):
- `01 The cell` → `02 Packing` → `03 The Pod` → `04 The House`
- Stages 0/1 are the procedural cell (with/without the 14-neighbour BCC
  packing). Stages 2/3 lazy-load `rhomi-pod.glb` / `vector-house.glb` and
  crossfade the procedural math out as the built model fades in.
- Each stage **auto-frames the camera** to whatever's on screen
  (`frameNow()` computes a bounding-sphere-based distance) while preserving
  the user's current orbit angle — "aligned to this," per the request.

**Chrome — the "marriage of both UIs"** (user: "I like what's happening in
both, I think the marriage of the two would be beautiful", referencing the
Vector Pod app's instrument-panel look): the page was restyled from a plain
glass-panel legend into:
- Breadcrumb + big title (top-left, no box — floats directly on the canvas)
- **Mode** panel (numbered vertical stepper, left) — same visual language as
  the Vector Pod's own left-side mode selector
- **Geometry Layers** panel (right) — real eye-toggle rows (Squares, Hexagons,
  Angles, Lost Triangle, Cube frame, Rhombic dodeca), not just a static legend
- Bottom **view-dock** — Perspective/Top/Front/Right camera presets +
  Rotate/Replay/Pause, matching the Vector Pod's own dock

**Content grounding** (user shared three analysis docs mid-session, see §3,
and asked to "revise plan" accordingly):
- The Vector House DXF analysis showed it's a **pure 45°/√2 fold system**
  (module M=66√2, every z-height n×√2, layers literally named `45`/`90` in
  Gregg's Rhino file) — **distinct** from the Pod's corner-hexagon/√3
  relationship. The page's direction table and "House" stage label were
  corrected to say this explicitly (it is the edge/√2 sibling, "not the corner
  hexagons") rather than implying it shares the Pod's story.
- User then shared photos of two physical books Gregg handed them — Peter
  Pearce's *Structure in Nature Is a Strategy for Design* and Robert Williams'
  *Natural Structure* — saying Gregg is "picking up where they left off."
  Both are real, citable antecedents for exactly this material (the 23
  Andreini space-filling systems, the rhombic-dodecahedron/truncated-
  octahedron dual pair). Added a short "The lineage" paragraph to `#note`
  crediting both by name. **User confirmed via AskUserQuestion before this was
  added** — it's a content/attribution decision, not a pure bug fix.

---

## 2. Real bugs found and fixed (all via headless Playwright screenshot review — see §4)

1. **`#wrap` was `100vh` while sitting *below* the sticky 56px `#gfnav` in
   normal flow** — this silently clipped the bottom 56px of every
   bottom-anchored panel off-screen. This is the same pattern used on sibling
   pages (`rhombic-dodecahedron.html` etc.) and may affect them too if they
   ever stack enough bottom content to notice — **not fixed there, only on
   this page**. Fix here: `height:calc(100vh - 56px)` (with the `dvh`
   equivalent).
2. **`#formula`/`#note` used a fixed `vh`-fraction `max-height` guess** that
   could overlap the Mode/Geometry-Layers panels above them on short
   viewports (reproduced exactly at 1024×768, a common laptop-landscape
   size). Replaced with a JS `layoutColumns()` function that measures the
   real rendered bottom of the panel above and sets `top` from that,
   +`bottom:66px` fixed, letting the browser compute height and
   `overflow-y:auto` handle any genuine overflow. A `.scroll-fade` mask class
   is toggled on when `scrollHeight > clientHeight`, so any remaining overflow
   reads as "scroll for more," not a hard-cut sentence.
3. **iPhone portrait (SE/14 at 320-390×568-664) had the title paragraph
   overlapping the 3D geometry's own direction-label sprites**, which sit well
   above the polyhedron itself. Three-part fix, all gated on
   `shortPortrait = innerWidth<600 && innerHeight<720`:
   - Hid the second sentence of the title `<p>` (wrapped in `.p-more`) below
     600px width — it's redundant once you see the numbered Mode panel.
   - Increased `defaultRad` (camera distance) further for `shortPortrait`
     (22 vs the normal <600px value of 17) so the whole scene shrinks clear
     of the text.
   - Set `target.y = 1.5` for `shortPortrait` so the camera looks slightly
     *above* world-origin, pushing the whole object+labels cluster lower on
     screen (this is what actually cleared the collision — shrinking alone
     wasn't enough since the object's screen-space vertical center doesn't
     move on its own).
   - `frameNow()` (used when jumping to the Pod/House stages) got the same
     `shortPortrait` margin multiplier (1.55× vs the normal 1.15×) — it was
     computing its own framing distance independent of the above and would
     otherwise render built models large enough to run behind the Mode/dock
     panels.
4. Verified across **1440×900, 820×1024, 768×1024, 1024×768 (landscape
   laptop), iPhone SE / 14 / 14 Pro Max portrait** (real Playwright device
   descriptors, not just raw viewport sizes) — no h-scroll, no console errors,
   no remaining overlap at any of them.

---

## 3. Reference material the user supplied mid-session (all already acted on above)

- `VERTOR_POD_README.md`, `Vertor_Pod_3DM_Analysis_v1.md` — confirm the real
  layer structure of `vertor pod whole unit.3dm` (233 solid instances: 207
  visible + 26 on a hidden "extension" layer; `axis ref` = 52 lines; `single
  cube frame` = 12 objects) and the app's intended full feature set. Units are
  **unset** in the source 3DM — a real risk flagged in that doc if anyone
  re-exports from it (25.4× inch/mm scale error), not yet addressed anywhere.
- `VectorHouse_DXF_Analysis_v1.md` — confirms Vector House is pure 45°/√2 (see
  §1d). Also notes open questions Gregg hasn't confirmed yet: whether the file
  units are inches, the significance of the "88" and non-sequential U-block
  numbers, and what the single `DECK`-layer entity is. Worth asking Gregg
  directly if this thread continues.
- Photos of Peter Pearce's *Structure in Nature Is a Strategy for Design* and
  Robert Williams' *Natural Structure* — the credited lineage (§1d). If this
  thread continues, the same books likely have more directly-relevant pages
  (dual space-filling tables, the 23 Andreini systems) worth photographing if
  Gregg has more to say about which specific pages he means.

---

## 4. Verification tooling (scratchpad, not committed)

All headless checks used Playwright against a local `python3 -m http.server`
on the repo root. Scripts lived in the session scratchpad
(`/tmp/claude-0/.../scratchpad/`) and are **not** part of the repo — recreate
similar scripts if you need to re-verify:
- `check-iphone.mjs` — uses Playwright's real `devices['iPhone SE']` /
  `'iPhone 14'` / `'iPhone 14 Pro Max'` descriptors (correct DPR/UA/touch),
  screenshots the cell stage and the Pod stage, checks `hscroll`, console
  errors, and panel bounding-box overlap.
- `check-tablet.mjs` — 1440×900, 820×1024, 768×1024, 1024×768.
- `verify-stages2.mjs` — walks all four Mode stages + toggles a couple of
  Geometry Layers rows + a view-dock preset, checks `#statustext`/`#sourcetext`
  wiring.
- Chromium only (no WebKit available in this environment) launched with
  `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist` for headless
  WebGL.

---

## 5. Known follow-ups (not done — out of this session's scope)

- The `#wrap: 100vh` vs sticky-nav-height bug (§2.1) likely exists on other
  r128/r160 deep-dive pages that use the same `#wrap{height:100vh}` pattern
  (`rhombic-dodecahedron.html`, `cube-diagonals.html`, etc.) — only fixed here
  because this page was the one being actively verified. Worth a sweep if
  those pages ever grow enough bottom-anchored content to expose it.
- Units-unset risk in `vertor pod whole unit.3dm` (§3) is flagged but not
  fixed — it's a source-file issue for Gregg to resolve in Rhino, not
  something to silently "correct" downstream.
- The Vector House DXF's open questions (§3) — inches confirmation, the "88"
  factor, `DECK` layer — need Gregg, not more analysis.
- No new models were requested by name; if this thread continues with more of
  Gregg's built structures as additional Mode stages, the pattern in
  `loadModel()`/`frameNow()` in `truncated-octahedron.html` generalizes
  directly (add an entry to the `STAGES` array with `{id, label, source, glb,
  gold}`).

---

## 6. Verification done this session
- `git status` clean, `a7f91af` pushed to `origin/claude/lost-triangle-animation-math-vudrm9`.
- All four Vercel preview deployments green as of the latest push.
- No conflict markers; no broken links introduced (`vector-pod/index.html`,
  `rhombic-system.html` cross-links from `#note` both resolve).
