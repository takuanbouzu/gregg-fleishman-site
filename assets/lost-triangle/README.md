# Lost Triangle motion graphic

Faithful implementation of the Claude Design project **"Motion graphic
mathematics explanation"** (`Lost Triangle.dc.html`) — an animated, layout-aware
explainer of Gregg Fleishman's *Lost Triangle*, the right triangle with edges
**1 : √2 : √3** (since 1² + √2² = √3²; interior angles 90°, 54.7356°, 35.2644°).

It plays nine scenes: the unit square → the √2 face diagonal → the √3 space
diagonal (the Lost Triangle) → the unit cube → reflection into a
rhombic-dodecahedron facet → the dihedral-angle payoff → the root sequence →
per-triangle Pythagorean proofs → end card.

## Files

- `animations.js` — the `Stage` / `Sprite` / `Easing` runtime (registers globals
  on `window`). Transpiled from `animations.jsx`.
- `lost-triangle-video.js` — the scenes themselves; registers
  `window.LostTriangleVideo` (landscape, 1920×1080) and
  `window.LostTriangleVideoPortrait` (1080×1920). Transpiled from
  `LostTriangleVideo.jsx`.

Both are **generated** — edit the `.jsx` source and re-transpile, don't hand-edit.

## Where it runs

- `/lost-triangle.html` — standalone page (site nav + full-bleed stage).
  `?embed=1` hides the nav so the page can be framed inside another.
- `/construction.html` → **2D Construction** tab embeds
  `lost-triangle.html?embed=1`, replacing the earlier hand-placed (and
  mathematically approximate) SVG construction with this exact one.

## Chapter rail (the "marriage")

`ChapterRail` (in `LostTriangleVideo.jsx`, replacing the old progress dots) is the
seam between the two design languages: the site's mono-uppercase, gold-underline
navigation idiom carrying the motion graphic's own palette, living inside its
coordinate space. Each chapter — `1 · √2 · √3 · CUBE · RHOMBIC · DIHEDRAL ·
SEQUENCE · PROOFS` — seeks the single timeline via `useTimeline().setTime`. So the
removed **3D Construction** (→ CUBE) and **Fleishman Sequence** (→ SEQUENCE) tabs
return as accurate chapters of one continuous animation. The `Stage` playback bar
was retinted to match (gold progress, JetBrains Mono, `#08080c` chrome).

## Geometry is exact

The construction is computed, not eyeballed: `planar()` builds the unit square
from a single edge length `U`, takes the diagonal as `U·√2`, and offsets one
unit perpendicular to reach `U·√3`, so every `1 : √2 : √3` relationship holds by
construction.

## Runtime

Vendored React 18.3.1 UMD (`assets/vendor/react-18.3.1/`), pulled from npm.
No in-browser Babel — the JSX is transpiled ahead of time. To regenerate:

```js
// node, with @babel/standalone available
const Babel = require('@babel/standalone');
const fs = require('fs');
for (const [src, out] of [
  ['animations.jsx', 'animations.js'],
  ['LostTriangleVideo.jsx', 'lost-triangle-video.js'],
]) {
  const code = Babel.transform(fs.readFileSync(src, 'utf8'),
    { presets: ['react'], compact: false }).code;
  fs.writeFileSync(out, code);
}
```
