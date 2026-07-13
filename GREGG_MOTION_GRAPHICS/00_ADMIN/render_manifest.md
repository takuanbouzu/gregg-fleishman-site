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

Pending (render after content sign-off): INS_01 (230f) · INS_02 (214f) ·
INS_03 (611f) · INS_04 (367f) · INS_05 (188f) · INS_06 (464f).
