# Render manifest

One row per rendered master. The pipeline: an insert page implementing the
deterministic-clock contract (`02_INSERTS/shared/insert-contract.md`) is
driven frame-by-frame by `00_ADMIN/render_insert.mjs` (Playwright screenshot
per frame → ffmpeg encode at exactly 30000/1001 → ffprobe frame-count gate).

Usage (server at repo root):

```bash
python3 -m http.server 8741 &
node GREGG_MOTION_GRAPHICS/00_ADMIN/render_insert.mjs \
  "http://localhost:8741/GREGG_MOTION_GRAPHICS/02_INSERTS/INS_01/insert.html" \
  05_RENDERS/ --name INS_01 --prores
```

`--prores` → ProRes 422 HQ `.mov`; omit for H.264 crf16 `.mp4` (review cuts).
The script exits non-zero on any page error or frame-count mismatch — a
master that doesn't say `EXACT ✓` does not ship.

| name | source page | frames | fps | size | codec | result | date |
|---|---|---|---|---|---|---|---|
| PIPELINE_TEST | `02_INSERTS/_pipeline_test/insert.html` | 60 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 60/60 frames, 2.002000 s; frames 0 & 59 verified pure black (max luma 0); mid-frame verified real-3D perspective render | 2026-07-13 |
| INS_01 | `02_INSERTS/INS_01/insert.html` | 230 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 7.674333 s; endpoints pure black; spot-checked | 2026-07-13 |
| INS_02 | `02_INSERTS/INS_02/insert.html` | 214 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 7.140467 s; endpoints pure black; spot-checked | 2026-07-13 |
| INS_03 | `02_INSERTS/INS_03/insert.html` | 611 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 20.387033 s; endpoints pure black; spot-checked | 2026-07-13 |
| INS_04 | `02_INSERTS/INS_04/insert.html` | 367 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 12.245567 s; endpoints pure black; spot-checked | 2026-07-13 |
| INS_05 | `02_INSERTS/INS_05/insert.html` | 188 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 6.272933 s; endpoints pure black; spot-checked | 2026-07-13 |
| INS_06 | `02_INSERTS/INS_06/insert.html` | 464 | 30000/1001 | 848×448 | h264 crf16 | **EXACT ✓** — 15.482133 s; endpoints pure black; spot-checked | 2026-07-13 |

The six blocking-animatic review masters live in `05_RENDERS/review/` (committed,
~16 MB). Re-render any of them with the usage command above; `--prores` for
finals once the animatic passes review.

Note: the pipeline-test's first validation run (pre-`insert-kit.js`) had a
vertex-generation bug — only 16 of the TO's 24 vertices (missing the
negative-first-coordinate half). Caught during the kit build; all six inserts
and the rewritten test use `insert-kit.js`'s correct 24-vertex construction.
The pipeline mechanics that run validated (frame stepping, encode, count gate)
were unaffected.
