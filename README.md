# Gregg Fleishman — The Lost Triangle

An interactive web exhibit of architect **Gregg Fleishman's** geometric system: the
"Lost Triangle" (`1 : √2 : √3`), the rhombic dodecahedron, the FCC lattice that packs
space, and the furniture and architecture that grow out of them.

Static HTML — no build step. The animated pages use **Three.js** (ES modules) + **GSAP**;
the rest is plain SVG/Canvas. Every page shares one **dark-only** design system (the light
theme was removed — the instrument is dark by design).

## Pages

| Page | What it is |
|---|---|
| `index.html` | **The landing hub** — cover page with the Lost Triangle motion-graphic hero |
| `explore.html` | **The Cube** — the main interactive 3D instrument (tabbed: Cube · Cluster Structures · Vector System · Vector Pod) |
| `lost-triangle.html` | **The Lost Triangle** — the canonical animated motion graphic (`1 : √2 : √3`) |
| `mathematics.html` | **The Lost Triangle (narrative)** — the readable long-form companion, with an expandable symmetry theory note |
| `fleishman-sequence.html` | A ~44s cinematic build: the plan Lost Triangle stands up into the cube, the rhombic cell, and space-filling |
| `cluster-structures.html` | A ~62s continuation: the RHOMBICUBE, two viewing axes, the truncation, and a gold-jewel close |
| `cube-diagonals.html` · `rhombic-dodecahedron.html` · `dorman-luke.html` | 3D deep-dives into individual constructions |
| `lost-triangle-construction.html` · `lost-triangle-construction-3d.html` | Animated step-by-step constructions (plan → space) |

## Design system

Three shared assets in `assets/` drive everything:

- **`gf-tokens.css`** — the canonical dark tokens (ground, type, the geometry colour roles).
- **`gf-theme.js`** — an inert dark-only stub (sets `theme-color`, exposes a no-op
  `window.gfTheme` API for backward compatibility). Loaded synchronously in `<head>`.
- **`gf-scene.js`** — the single dark **geometry palette for the WebGL pages**, so the 3D
  scenes and page chrome share one set of colours.

The animated "movie" pages share one architecture: a single scrubbable GSAP timeline, fat
lines (`Line2`) drawn on via the render loop (seek-exact), a gimbal-free camera rig, and a
dashed "motion-guide" language that expresses each geometric movement. Add `?clean=1` to any
movie URL to hide all chrome for clean video capture.

## Run locally

No dependencies — serve the folder over HTTP (ES-module import maps need `http://`, not
`file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Dependencies

All runtime libraries are **vendored** under `assets/vendor/` — Three.js r160 (ESM) + its
`lines` addons for the movies, Three.js r128 for the older deep-dives, and GSAP 3.12.5. No CDN
is needed at runtime, so the exhibit keeps working even if a CDN changes or drops a version.
The only external load is the web fonts (Google Fonts), which degrade gracefully to system
fallbacks. The movie pages also show a graceful message if WebGL is unavailable, and a
`.nojekyll` file keeps GitHub Pages from touching the static files.

## Credits

Original drawings, artworks, and the underlying geometric work are by **Gregg Fleishman**.
Exhibit site by White Cube Society.
