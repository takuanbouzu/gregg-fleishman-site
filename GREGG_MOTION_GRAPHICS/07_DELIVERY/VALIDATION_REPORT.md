# Validation report

All checks run on the delivered masters (2026-07-13). The render harness
(`00_ADMIN/render_insert.mjs`) gates on frame count and exits non-zero on any
mismatch or page error, so a master that shipped passed the count check by
construction; the values below are the ffprobe read-back.

## Frame count + duration (target = window length at 30000/1001)

| Insert | Frames (measured / target) | Duration (s) | Resolution | Result |
|---|---|---|---|---|
| INS_01 | 230 / 230 | 7.674333 | 848×448 | ✅ EXACT |
| INS_02 | 214 / 214 | 7.140467 | 848×448 | ✅ EXACT |
| INS_03 | 611 / 611 | 20.387033 | 848×448 | ✅ EXACT |
| INS_04 | 367 / 367 | 12.245567 | 848×448 | ✅ EXACT |
| INS_05 | 188 / 188 | 6.272933 | 848×448 | ✅ EXACT |
| INS_06 | 464 / 464 | 15.482133 | 848×448 | ✅ EXACT |

Frame targets are `duration_frames` from `00_ADMIN/black_frame_intervals.csv`
(ffmpeg `blackdetect`, cross-checked against PyAV).

## Clean edges (no flash/black errors)

First and last frame of every master measured **pure black (max luma 0)** —
verified programmatically across all six. Inserts cut cleanly into and out of
the black windows.

## Full review cut

- Duration **770.736633 s** — identical to the source video to the microsecond.
- Audio stream **copied** (AAC), not re-encoded — bit-identical to Gregg's
  master narration.
- Inserts land in their measured windows; on-camera passages (incl. the
  diamond/√-ladder lesson at 5:51) and the three stray blips are untouched.

## Format compliance vs. brief

| Brief requirement | Status |
|---|---|
| Exact 29.97 fps (30000/1001) durations | ✅ all six |
| Audio continuous / untouched | ✅ stream-copied |
| No accidental black/flash frames, no interpolation | ✅ endpoints black, per-frame render |
| First/last frames transition cleanly | ✅ pure-black endpoints |
| Ground grid + labeled orientation on spatial scenes | ✅ every insert |
| Beginner annotations on operations | ✅ captions + measure labels |
| Deliverables editable (not a flattened movie only) | ✅ HTML/JS sources committed |
| No proprietary font files packaged | ✅ webfonts loaded at render; system fallbacks |
| Real 3D (perspective + parallax), not flat diagrams | ✅ PerspectiveCamera + orbit every insert |

## Reproducibility

Every deliverable regenerates from committed HTML sources + the source video
via `build_review_cut.sh` / `build_delivery.sh`. Renders are deterministic
(pure `seek(frame)` clock, no wall-clock/RNG) → identical frames on re-run.
