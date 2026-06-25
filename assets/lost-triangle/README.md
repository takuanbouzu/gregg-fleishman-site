# Lost Triangle — motion graphic

The animated construction shown on `lost-triangle.html` (and, via
`construction.html`, inside its full-bleed iframe with `?embed=1`).

## Files

- **`lost-triangle-animation.js`** — the animation. A single self-contained
  React component (`window.LostTriangleAnimation`) built with plain
  `React.createElement`. **There is no JSX and no build step — this file is the
  source of truth. Edit it directly.**
- **`lost-triangle-animation.source.dc.html`** — provenance only. The original
  Claude Design (claude.ai/design) export this component was ported from. Not
  loaded by the site; kept so the port can be checked against the original.

## What it is

An 88-second, 7-chapter SVG build of the Lost Triangle and the 120° dihedral
angle of the Fleishman joint:

```
I.   The Plane            — unit-square floor + axes
II.  The 45° Diagonal     — unit square, √2 diagonal, 45° arc
III. The Rise             — lift √2 straight up
IV.  The Sundial Line     — floor √2 + rise √2 → length 2
V.   The Lost Triangle    — sides 1, √3, 2 (30–60–90, seen edge-on)
VI.  The Mirror Sundial   — mirrored twin line P₂
VII. The 120° Revelation  — cos θ = ½ → 60°, supplement 120°, then a 360° spin
```

The figure is **computed from one geometric unit** (`this.GU` and the points in
`this.P`), so every `1 : √2 : √3` relationship is exact by construction. Don't
"correct" coordinates to eyeballed values — change the unit/derivation instead.

## How it's loaded

`lost-triangle.html` loads the vendored React 18.3.1 UMD globals, then this
file, then mounts:

```
react.production.min.js → react-dom.production.min.js
  → lost-triangle-animation.js   (defines window.LostTriangleAnimation)
  → ReactDOM.createRoot(#lt-root).render(<LostTriangleAnimation autoplay />)
```

`?embed=1` (or `html.lt-embed`) hides the site nav so the page can be framed
inside `construction.html`. The component renders a single 1920×1080 stage that
scales to fit its mount box (it letterboxes on portrait, exactly as the original
export does). The playhead is persisted to `localStorage` under `lt_t`.

## Porting notes

The original ran on Claude Design's `DCLogic` base class plus a `{{ }}` HTML
template (`support.js`). The port replaces both: `DCLogic` → `React.Component`,
and the template → the `render()` method (same markup, rebuilt with
`React.createElement`; `fit()` measures the mount box instead of the raw
viewport so it seats correctly below the fixed nav). All scene-drawing math
(`proj` / `seg` / `dot` / `lab` / `txt` / `arc` / `renderVals`) is copied
unchanged from the export.
