# HANDOFF — local Claude Code session: Blender 4K renders of the six inserts

**You are a fresh Claude Code session running on the owner's local machine.**
This document is your complete brief; assume no other context. The remote
(cloud) session that wrote this had no GPU and no Blender — that's why the
work moves to this machine.

## Mission

Port the six motion-graphics inserts (`GREGG_MOTION_GRAPHICS/02_INSERTS/INS_01…06`)
to **Blender** and render them at **3840×2160 (4K), 29.97 fps (30000/1001)**, with
**exact frame counts** (230 / 214 / 611 / 367 / 188 / 464), crisp edges (the owner
explicitly wants to be rid of visible anti-alias softness), and a richer
physically-lit look than the browser WebGL masters. Full architecture, per-scene
notes, and render settings live in **`00_ADMIN/BLENDER_RENDER_ROADMAP.md`** —
read that file first; this handoff only adds what a local session needs.

## Machine prerequisites (verify before starting; ask the owner if missing)

- **Blender 4.x** on PATH (`blender --version`). EEVEE Next needs a real GPU —
  this machine should have one (that's why the job is here).
- **ffmpeg / ffprobe** on PATH.
- **Node 18+** and **Playwright** with Chromium (`npx playwright install chromium`
  if needed) — used only for Stage A (dumping the baked animation from the pages).
- A static server at the **repo root**: `python3 -m http.server 8741` (or
  `npx serve -l 8741`). ES-module import maps require http://, not file://.

## What already exists (don't rebuild)

- **Deterministic clock contract**: every insert exposes `window.INSERT` =
  `{ fps: 30000/1001, frames, width, height, seek(frame), scene, camera,
  fadeFrames, ready }`. `seek(f)` is a pure function — same f, same picture.
  See `02_INSERTS/shared/insert-contract.md` and `insert-kit.js`.
- `00_ADMIN/render_insert.mjs` — the raster (screenshot) render harness. Use it
  as the reference for driving pages with Playwright and for the
  ffprobe frame-count gate. `?w=3840&h=2160` renders any insert at 4K.
- `00_ADMIN/svg_export.mjs` — walks `INSERT.scene` after each `seek()` and
  serialises it. **Stage A's dumper is a sibling of this file** — same page
  driving, but emit world matrices + material state as JSON instead of SVG.
- `00_ADMIN/BLENDER_RENDER_ROADMAP.md` — the full plan you are executing:
  Stage A (dump JSON) → B (bpy importer builds .blend) → C (text/chrome
  composited as transparent PNG overlay, NOT modelled) → D (render + encode + gate).
- INS_01 was just reanimated to the "produced" look (chapter chrome, projection
  plane, two-stage fold 0→90° in plane → leaves plane → 120° in space). Its
  1080p/4K HTML renders are the visual reference: `05_RENDERS/review/INS_01_v2_master.mp4`
  and `INS_01_4k_master.mp4` (rebuild via `render_insert.mjs` if not present).

## Ground rules (unchanged from the project)

- **Never commit to `main`.** Work on a feature branch, open a draft PR.
- Geometry is **computed, never eyeballed** — rebuild the polyhedra in `bpy`
  from the same formulas as `insert-kit.js` (TO = 24 signed perms of (0,1,2)·k;
  RD = 8 cube corners + 6 axis points; parametric truncation u/3). Every
  1:√2:√3 relationship must be exact by construction.
- **Exact frame counts, first/last frame pure black** (fade is baked into the
  dumped opacity), so the renders drop into the same edit windows.
- Inserts are silent; audio is never touched.
- Palette/fonts: `GF_SCENE.dark` colors (`#6f9bc4` face-blue struts, `#c9a24b`
  gold, `#db684d` terracotta, near-black bg); text chrome stays Space Mono /
  Hanken Grotesk via the overlay pass (Stage C), never Blender text objects.
- Gitignore `.blend`s and render outputs; commit scripts + JSON dumps
  (see the roadmap's file-layout section — create `06_BLENDER/`).

## Suggested execution order

1. Read `BLENDER_RENDER_ROADMAP.md` end-to-end. Verify prerequisites.
2. **Stage A**: write `00_ADMIN/scene_dump.mjs`, dump INS_01 →
   `06_BLENDER/dumps/INS_01.json`. (Add stable `mesh.name` tags to insert
   pages where objects are anonymous — small additive edits.)
3. **Stage B**: `06_BLENDER/build_blend.py` + `lib/geometry.py`; build
   `INS_01.blend`; spot-render 3 frames; compare against
   `INS_01_v2_master.mp4` frames for framing/motion fidelity (camera
   Y-up→Z-up conversion is the classic failure — roadmap has the fix).
4. **Stage C**: chrome overlay pass (transparent PNG sequence from the page
   with the WebGL canvas hidden), composite over the Blender frames.
5. **Stage D**: full INS_01 4K render → encode → **gate 230 frames** →
   show the owner for the look sign-off (it's a re-look; needs approval).
6. Only after sign-off: roll INS_02→06 (motion is baked; per-scene work is
   materials/lights only), batch render, gate all counts, encode masters.
7. Commit scripts + dumps on the branch, push, draft PR.

## Open decisions — ask the owner (AskUserQuestion) before Stage D

- **EEVEE Next vs Cycles** (recommend EEVEE Next; GPU-dependent).
- **Color look**: Standard (matches current masters) vs AgX (richer).
- **Richness dial**: flat-lit like current, or soft shadows + AO + subtle
  DoF/bloom (the INS_01 reference already has light shading — match at least that).
- **Supersample**: for the "no anti-alias softness" goal, render 7680×4320 and
  downscale to 4K vs high TAA samples at native 4K (recommend supersample if
  the GPU/VRAM allows; jaggy-free AND sharp).

## Acceptance checklist (per insert)

- [ ] ffprobe frames == 230/214/611/367/188/464 (exact, script-gated)
- [ ] fps == 30000/1001; resolution == 3840×2160
- [ ] first + last frame pure black
- [ ] motion/camera matches the HTML master beat-for-beat (baked, so any
      drift is an importer bug — fix, don't hand-tune)
- [ ] chrome text pin-sharp, correct fonts, correct fade timing
- [ ] owner has signed off on the look (once, on INS_01)
