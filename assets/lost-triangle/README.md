# Lost Triangle motion graphic

Faithful implementation of the Claude Design project file **`Lost Triangle Clean.dc.html`**
— the "Clean" pure-animation cut: full-canvas, no side panels, no reference images. An
animated, layout-aware explainer of Gregg Fleishman's *Lost Triangle*, the right triangle
with edges **1 : √2 : √3** (since 1² + √2² = √3²; interior angles 90°, 54.74°, 35.26°).

It plays seven scenes over 75s: **Intro → Root Spiral → Triangle Construction → Cube →
Reflected into Form** (one triangle · rhombic face · dodecahedron) **→ Dihedral Angles**
(cube 90° · tetrahedron 70.53° · octahedron 109.47° · rhombic 120°) **→ Close**.

Palette: near-black `#0C0B0A` ground · off-white `#E8E5E0` scaffold · bright magenta
`#FF00CC` (the Lost Triangle, matching Gregg's drawings) · steel blue `#5B90C8` (√2 leg /
rhombic kite) · gold `#C8A96E` (angle labels + close title). Type: **Syne** (display) ·
**Cormorant Garamond** (radicals/italics) · **Space Grotesk** (labels).

## Files

- `animations.js` — the `Stage` / `Sprite` / `Easing` / `useTime` runtime (registers globals
  on `window`). Transpiled from `animations.jsx`.
- `lost-triangle-video.js` — the scenes themselves; registers
  `window.LostTriangleVideoClean` (landscape, 1920×1080) and
  `window.LostTriangleVideoCleanPortrait` (1080×1920). Transpiled from
  `LostTriangleVideoClean.jsx`.

Both `.js` files are **generated** — edit the `.jsx` source and re-transpile, never hand-edit.

## Where it runs

- `/lost-triangle.html` — standalone page (site nav + full-bleed stage). The mount picks the
  landscape or portrait component by viewport aspect ratio; both share one Stage `persistKey`
  (`animstage-clean`), so the playhead carries across an orientation flip. `?embed=1` hides
  the nav so the page can be framed inside another.
- `/construction.html` embeds `lost-triangle.html?embed=1` as a full-bleed iframe.

A simple **progress-dots** strip (the five core scenes) sits at the bottom of the canvas; the
`Stage` playback bar (from `animations.js`) provides scrub/play/seek.

## Geometry is exact

The construction is computed, not eyeballed — the unit square, its √2 diagonal, and the √3
offset are all derived from one edge length, so every `1 : √2 : √3` relationship holds by
construction. Don't "correct" it to hand-placed coordinates.

## Runtime / regenerate

Vendored React 18.3.1 UMD (`assets/vendor/react-18.3.1/`). No in-browser Babel — the JSX is
transpiled ahead of time. To regenerate the `.js` bundles:

```bash
cd assets/lost-triangle
npm install --no-save @babel/standalone   # dev-only; node_modules is gitignored
node build.mjs                            # animations.jsx + LostTriangleVideoClean.jsx → .js
```
