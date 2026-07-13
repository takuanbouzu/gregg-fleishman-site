# Client delivery — Gregg Fleishman math-lesson inserts

Six motion-graphics inserts that fill the black-screen sections of Gregg's
narrated studio video (`gregg 1.publer.com.mp4`). Teaching content is drawn
verbatim from Gregg's own narration; every geometry figure is computed exactly
from the 1 : √2 : √3 "Lost Triangle" ratios.

**Delivered at 1920 × 1080 (Full HD), 29.970 fps (30000/1001), over Gregg's untouched audio.**
(The inserts are computed vector/3D — sharp at any size. They were re-rendered from
848×448 to 1080p on request; re-render at any resolution with `?w=…&h=…`, below.
Note: Gregg's *source footage* is natively 848×448 and can't be sharpened — only
the graphics are resolution-independent.)

## What's in this package

| Item | Path | Format |
|---|---|---|
| **6 insert masters** (finals) | `07_DELIVERY/masters_prores/INS_0N_master.mov` | ProRes 422 HQ, frame-exact |
| **6 insert masters** (review) | `05_RENDERS/review/INS_0N_master.mp4` | H.264 crf16 |
| **Full review cut** | `05_RENDERS/review/REVIEW_CUT.mp4` | inserts in-place over source, audio untouched |
| **Review cut — preview** | `05_RENDERS/review/REVIEW_CUT_preview.mp4` | 640px, small/watchable |
| **Review cut — burned timecode** | `07_DELIVERY/review_timecode/REVIEW_TIMECODE.mp4` | TC top-right, for note-taking |
| **Graphics-only string-out** | `07_DELIVERY/graphics_stringout/GRAPHICS_STRINGOUT.mp4` | six inserts back-to-back |
| **Editable source projects** | `02_INSERTS/INS_0N/insert.html` + `02_INSERTS/shared/` | WebGL / Three.js r160 |
| **Render manifest** | `00_ADMIN/render_manifest.md` | every render, frame-count verified |
| **Validation report** | `07_DELIVERY/VALIDATION_REPORT.md` | duration/frame/black-frame checks |
| **Creative + build docs** | `00_ADMIN/FULL_LESSON_CONCEPT.md`, `HANDOFF-CODEX-EXECUTION.md` | the concept + the build spec |

## The six inserts

| # | Window (source tc) | Frames | Dur | Content |
|---|---|---|---|---|
| 01 | 1:00.69–1:08.37 | 230 | 7.67 s | 45° + 45° struts → a 120° join (the connection rule) |
| 02 | 1:15.38–1:22.52 | 214 | 7.14 s | truncated octahedron (new) beside the rhombic dodecahedron (10 yrs) |
| 03 | 1:52.15–2:12.53 | 611 | 20.39 s | the three cubic space-fillers: cube · RD (two-cube checkerboard) · TO |
| 04 | 2:21.21–2:33.45 | 367 | 12.24 s | five Platonic solids → the cubic family (tetra · octa · cube) |
| 05 | 2:38.49–2:44.77 | 188 | 6.27 s | cut the corners → an Archimedean solid |
| 06 | 3:01.98–3:17.46 | 464 | 15.48 s | both networks fill space from small repeated parts |

Total insert runtime **69.20 s** across the six windows.

## Rebuild everything from scratch

Large video binaries are **not** committed (they exceed GitHub's file limit);
they regenerate deterministically from the committed HTML sources + the source
video. Same input → identical frames.

```bash
# from the repo root
cp "gregg 1.publer.com.mp4" GREGG_MOTION_GRAPHICS/01_SOURCE/video/   # re-drop the source
python3 -m http.server 8741 &                                        # serve the repo
bash GREGG_MOTION_GRAPHICS/00_ADMIN/build_review_cut.sh              # → REVIEW_CUT.mp4
bash GREGG_MOTION_GRAPHICS/00_ADMIN/build_delivery.sh               # → the whole 07_DELIVERY/ package
```

Individual master (any insert), at any resolution via `?w=&h=`:
```bash
node GREGG_MOTION_GRAPHICS/00_ADMIN/render_insert.mjs \
  "http://localhost:8741/GREGG_MOTION_GRAPHICS/02_INSERTS/INS_03/insert.html?w=1920&h=1080" \
  GREGG_MOTION_GRAPHICS/05_RENDERS/review --name INS_03 --prores
```
`build_delivery.sh` defaults to 1920×1080; override with `RES_W=2560 RES_H=1440 bash …`.
Text labels auto-scale to the render height, so any size stays balanced.

## Notes for the editor

- **Audio is never touched.** The inserts are silent; they drop into sections
  that are already black in the source, so the narration underneath is the
  original master audio, bit-for-bit.
- **First and last frame of every insert is pure black** — they cut cleanly
  into/out of the black windows with no flash frames.
- Three stray sub-second black blips (4:10, 4:18, 9:35) are left black — they
  read as edit artifacts, not intentional pauses. Flag if you want graphics.
- No proprietary fonts are packaged; the inserts load the site's Google Fonts
  (Hanken Grotesk, Space Mono) at render time. Fallbacks are system sans/mono.
