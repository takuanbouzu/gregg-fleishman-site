# STATUS

## Phase 0 — Repository setup ✅
Production tree created under `GREGG_MOTION_GRAPHICS/`. Source copied to
`01_SOURCE/video/` (git-ignored — 30 MB master; re-drop it there to reproduce).

## Phase 1 — Media verification ✅
- `ffprobe` probe → `00_ADMIN/media_probe.md` + `ffprobe.json`.
- Black frames measured twice (PyAV + ffmpeg blackdetect) →
  authoritative `00_ADMIN/black_frame_intervals.csv` (frame-accurate).
- Six handled review clips (±5 s), H.264 → `01_SOURCE/clips/`.
- Six mono 16 kHz WAVs (for transcription) → `01_SOURCE/audio/`.
- Six pre-black stills → `01_SOURCE/stills/`.
- Reproducible driver: `00_ADMIN/extract_media.py`.

## Phase 2 — Transcript + cue mapping ✅ (transcript supplied)
Transcript supplied by Yuto (`01_SOURCE/transcripts/full_transcript.txt`).
Mapped each black window to Gregg's actual words → `cue_sheet.csv` +
per-insert transcripts. **Major finding:** the handoff storyboard's teaching
goals do NOT match the audio — see `NARRATIVE_CORRECTION.md`. Corrected
per-insert content needs sign-off before modeling.

## Phases 3–7 — NOT STARTED
Blocked on sign-off of the corrected per-insert content (Phase 2 finding):
- After Effects **cannot** run in this Linux sandbox (proprietary Win/Mac).
- Blender ruled out — CPU-only headless render here isn't worth pursuing.
- **Render target decided:** the site's existing HTML/Canvas Lost-Triangle
  engine. Every one of the six topics already exists as a computed scene.

## Phase 3–7 execution handoff ✅
Written up as `00_ADMIN/HANDOFF-CODEX-EXECUTION.md` — the per-insert build spec
(exact frame ranges, quotes, which existing site scenes to re-stage, render/
capture method for exact-duration masters, verification checklist) for
whoever executes next.

## Full-lesson concept ✅ (needs sign-off)
`00_ADMIN/FULL_LESSON_CONCEPT.md` — revises the six inserts from isolated
fills into chapters of ONE lesson ("The Slim Book"). Maps the complete arc
including Gregg's on-camera demos (the diamond/√-ladder lesson at 5:51, the
caterpillar 45°→120° payoff at 11:38), verifies the math backbone numerically
(all TO struts at exactly 45° to the axes; adjacent struts meet at exactly
120°; √2²+1²=3), and defines the binding motif system (one world, √-ladder
palette, gold arc, from-black/to-black, plant→payoff links). Timing unchanged.

## Render path ✅ BUILT AND PROVEN
`00_ADMIN/render_insert.mjs` + the deterministic-clock contract
(`02_INSERTS/shared/insert-contract.md`) + reference implementation
(`02_INSERTS/_pipeline_test/insert.html`). Validated end-to-end: 60-frame
test master at exactly 30000/1001 fps, 848×448, `EXACT ✓` frame-count gate,
pure-black endpoints, real-3D perspective mid-frame. See `render_manifest.md`.

## Phase 3 — Blocking animatic ✅ RENDERED (sign-off received 2026-07-13)
Yuto signed off the concept + six mappings. All six insert scenes built
against the contract (`02_INSERTS/INS_01..06/insert.html`, shared
`insert-kit.js` — computed TO/RD/cube geometry, parametric truncation,
√-ladder palette, gold arcs, DOM captions, deterministic clocks) and all six
masters rendered **EXACT ✓** at 30000/1001, 848×448, pure-black endpoints:
230 / 214 / 611 / 367 / 188 / 464 frames. Review masters committed at
`05_RENDERS/review/` (~16 MB); full log in `render_manifest.md`.

## Animatic approved ✅ · Review cut built ✅ (2026-07-13)
Yuto approved the six masters ("these look great"). Full review cut built via
`00_ADMIN/build_review_cut.sh`: the six inserts composited into their exact
windows over the source, **audio stream-copied untouched**, duration
identical to the source (770.7366 s). Verified: inserts land in-window,
on-camera passages and the stray blips untouched. The cut itself (126 MB) is
NOT committed — over GitHub's file limit; rebuild with the script (needs the
git-ignored source master re-dropped at `01_SOURCE/video/`).

## Phase 7 — Client delivery package ✅ (2026-07-13)
Both branches (#52, #54) merged to `main`; this delivery work continues on a
fresh branch off `main`. Full package assembled in `07_DELIVERY/`:
- Six **ProRes 422 HQ** frame-exact finals (`masters_prores/`, rebuild-only).
- **Graphics-only string-out** (`graphics_stringout/`, committed, 12 MB) —
  six inserts back-to-back with black slugs, 71.70 s.
- **Burned-in-timecode** review version (`review_timecode/`, rebuild-only).
- `07_DELIVERY/README.md` (delivery index) + `VALIDATION_REPORT.md`
  (all EXACT, endpoints black, review cut = source duration, brief-compliance
  table). Reproducible via `00_ADMIN/build_delivery.sh`.

## Codex A/B handoff ✅
`00_ADMIN/HANDOFF-CODEX-BUILD-YOUR-OWN.md` — a self-contained brief for Codex
to build an INDEPENDENT version (own staging/motion) against the same hard
constraints, into `02_INSERTS_codex/` + `05_RENDERS/codex/`, reusing the same
render harness. All source material pathed; math facts pre-verified.

## Project status: COMPLETE (Phases 0–7)
Nothing outstanding. Optional future work if requested: the standalone "Slim
Book" recut for the site's Animation section (concept §7), and Codex's
parallel A/B version.
