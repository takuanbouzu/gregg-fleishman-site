# After Effects — vector (SVG) frame sequences

An alternative to the raster masters: each insert exported as a **resolution-independent SVG frame sequence**. Import into After Effects, turn on *Continuously Rasterize*, and the graphics stay razor-sharp at **any** comp resolution — 1080p, 4K, 8K — with no re-render from us.

This is possible because the inserts are pure **line-art + flat fills** (no textures, no raster shading). Every frame is the live 3-D scene *projected through the camera to 2-D SVG*: wireframes → `<line>`, faces → `<polygon>`, labels → real `<text>`.

## What you get

- `INS_0N_vector_svg.zip` — one zip per insert, containing `INS_0N_0000.svg … INS_0N_NNNN.svg`, one file per frame, exact same frame count as the raster master (INS_03 = 611).
- The design box is authored at **1920×1080** (viewBox `0 0 1920 1080`), but that's just the coordinate space — Continuously Rasterize renders it crisp at whatever your comp is.

## Import into After Effects

1. **File → Import → File…**, select the **first** SVG in a scene folder (`INS_03_0000.svg`).
2. Check **“SVG Sequence”** (or “Importername Sequence”) in the import dialog, and set the frame rate to **29.97 (30000/1001)** to match the masters. Import.
3. Drop the footage on a comp. On that layer, enable **Continuously Rasterize** (the ✷ sun/star switch in the timeline). Now scaling the comp up keeps the vectors sharp.
4. The insert's first and last frames are pure black, so it cuts into the black windows exactly like the raster master — same in/out points from the manifest.

> If AE rasterizes the SVGs on import (older versions), you can instead run them through **Overlord** or **File → Import** as an *Illustrator* sequence — but modern AE (2020+) imports SVG sequences natively and Continuously Rasterize is the only switch you need.

## The one honest caveat — transparent-face sorting

SVG has no depth buffer. Filled, semi-transparent faces (the faint blue/terracotta cell fills) are drawn back-to-front by their view-space depth (painter's order) and sit *under* the bright wireframe. On the vast majority of frames this is indistinguishable from the WebGL master. On a frame where two translucent faces cross at a shallow angle, the fill *can* sort a hair differently. **Pure-wireframe inserts (INS_01) are exact.** The face-heavy ones (INS_03, INS_06) are the ones to spot-check.

If any frame's fill sorts wrong, it's fixable per-face — flag the timecode and we'll adjust.

## Text / fonts

Labels are emitted as live SVG `<text>` in the site fonts (Space Mono, Hanken Grotesk). AE will substitute a system font if those aren't installed on your machine — install the Google Fonts (Hanken Grotesk, Space Mono) for an exact match, or we can **outline the text to paths** on export (add `--outline-text`, once implemented) so fonts are irrelevant. Say which you prefer.

## Regenerate / do the other five

```bash
# from the repo root, with a static server running (python3 -m http.server 8741)
node GREGG_MOTION_GRAPHICS/00_ADMIN/svg_export.mjs \
  "http://localhost:8741/GREGG_MOTION_GRAPHICS/02_INSERTS/INS_03/insert.html" \
  GREGG_MOTION_GRAPHICS/05_RENDERS/vector --name INS_03
```
Swap `INS_03` for any of `INS_01 … INS_06`. Output: `05_RENDERS/vector/INS_0N_vector_svg.zip` + the loose `INS_0N_svg/` folder.
