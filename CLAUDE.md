# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Interactive geometry exhibit for artist Gregg Fleishman. Static multi-page site; no build step. Deploys to GitHub Pages from the `main` branch via `.nojekyll`.

Live URL: `https://takuanbouzu.github.io/gregg-fleishman-site/`
Repo: `takuanbouzu/gregg-fleishman-site`

---

## Commands

There is **no build, lint, or test tooling** — it's vendored static HTML/CSS/JS. Do not look for `package.json`, npm scripts, or a test runner; there are none.

**Run locally** (ES-module import maps require `http://`, not `file://`):
```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```
(`.claude/launch.json` defines the same server on port 8080.)

**Regenerate the Lost Triangle bundles** after editing `assets/lost-triangle/*.jsx` (the `.js` files are transpiled output — never hand-edit them). Run from `assets/lost-triangle/` with `@babel/standalone` available:
```js
const Babel = require('@babel/standalone');
const fs = require('fs');
for (const [src, out] of [['animations.jsx','animations.js'], ['LostTriangleVideo.jsx','lost-triangle-video.js']]) {
  fs.writeFileSync(out, Babel.transform(fs.readFileSync(src,'utf8'), { presets:['react'], compact:false }).code);
}
```

**URL params** (chrome-hiding toggles on the animated pages): `?embed=1` hides the site nav (for iframing — used by `construction.html`), `?cover=1` hides all UI chrome (used by the `index.html` hero iframe), `?clean=1` hides all chrome for clean video capture on the movie pages.

---

## Key Rules

- **Never commit directly to `main`** — GitHub Pages deploys from it. All work goes on a feature branch; open a draft PR.
- No build step. Edit HTML/CSS/JS files directly.
- All Three.js and GSAP are **vendored** under `assets/vendor/` — no CDN, no npm.

---

## Directory Structure

```
gregg-fleishman-site/
├── assets/
│   ├── gf-tokens.css          # Design system CSS variables (dark-only)
│   ├── gf-theme.js            # Light/dark theme toggle (localStorage)
│   ├── gf-nav.js              # Responsive hamburger nav enhancer
│   ├── gf-scene.js            # WebGL palette helper (shared geometry colors)
│   ├── lost-triangle-engine.js # Pure Canvas 2D renderer for Lost Triangle (legacy motion page)
│   ├── lost-triangle/         # React motion graphic (see lost-triangle.html)
│   │   ├── animations.jsx     # Source of truth — Stage/Sprite/Easing runtime
│   │   ├── animations.js      # GENERATED (transpiled) — do not edit by hand
│   │   ├── LostTriangleVideoClean.jsx # Source of truth — the 7 "Clean" scenes (landscape + portrait)
│   │   ├── lost-triangle-video.js # GENERATED (transpiled) — do not edit by hand
│   │   ├── build.mjs          # Transpiles the .jsx → .js (node build.mjs)
│   │   └── README.md          # Provenance + how to regenerate the .js bundles
│   ├── arch/                  # Architecture photography (6 JPGs)
│   ├── drawings/              # Artwork images (6 PNGs)
│   ├── handsketch.jpg         # Sketch reference
│   └── vendor/
│       ├── three-0.160.0/     # Three.js r160 ESM + addons (used by most pages)
│       ├── three-r128/        # Three.js r128 minified (older deep-dive pages)
│       ├── react-18.3.1/      # React + ReactDOM UMD (powers lost-triangle.html)
│       └── gsap-3.12.5/       # GSAP 3.12.5 (animation timelines)
├── vector-pod/                # Compiled Vite/Vue app (separate sub-project)
│   ├── index.html
│   └── assets/
├── index.html                 # Landing page (outer site hub)
├── explore.html               # THE CUBE — main interactive (5 tabs, 1 hidden — see below)
├── mathematics.html           # The Lost Triangle narrative
├── construction.html          # Full-bleed iframe → lost-triangle.html?embed=1 (Cluster Structures tab removed)
├── lost-triangle.html         # React motion graphic (1:√2:√3); ?embed=1 hides nav for iframe use
├── dorman-luke.html           # Research: Dorman-Luke unfolding
├── rhombic-system.html        # Rhombic dodecahedron system; no longer a top-nav item — reachable via the
│                               # explore.html "Rhombic System" tab (iframe, ?embed=1) or by direct URL
├── about.html                 # About Gregg Fleishman
├── portfolio.html             # Work / portfolio gallery
├── store.html                 # Store (placeholder, products disabled)
├── contact.html               # Contact
└── [deep-dive pages]          # Sub-pages not in nav (see below)
```

---

## Two Navigation Systems

### Outer Site Nav (index, about, portfolio, store, contact)
```
About · Work · Geometry · Store · Contact
```
- All outer pages use **"Geometry" → `index.html`** (the hub). `index.html` marks it active. (Previously inconsistent: index linked to itself while the others used "The Math" → `mathematics.html`; unified June 2026.)

### Geometry Exhibit Nav (all geometry pages)
```
[brand] Gregg Fleishman · The Lost Triangle · Animation · The Cube · Research
```
- Present on all 15 geometry pages via shared `<nav id="gfnav">`, identical order everywhere.
- `gf-nav.js` auto-enhances this nav with a responsive hamburger at ≤820px.
- **Order encodes the intended learning journey: scroll → animation → model.**
  - **"The Lost Triangle" → `mathematics.html`** — the long-form narrative **scroll** (the entry point of the journey).
  - **"Animation" → `lost-triangle.html`** — the accurate React motion graphic.
  - **"The Cube" → `explore.html`** — the interactive 3D model.
- There is no longer a "Construction" nav item; `construction.html` is an orphaned deep-dive (active context = Animation).
- There is no longer a top-nav "Vector Pod" item (removed July 2026) — it was redundant with the "Vector Pod" tab already inside `explore.html`'s tab bar. `vector-pod/index.html` is still reachable via that tab, and via the "Vector Pod" link in `index.html`'s own content index.
- There is no longer a top-nav "Rhombic System" item (removed July 2026) — it's now folded into `explore.html` as a "Rhombic System" tab (iframe of `rhombic-system.html?embed=1`), same pattern as the "Vector Pod" tab. `rhombic-system.html` still exists standalone and marks "The Cube" active in its own nav (it no longer has a nav item of its own).

### Orphaned Deep-Dive Pages
These are accessible by URL only — not linked from any nav:
- `fleishman-sequence.html` — cinematic sequence (active nav → Animation)
- `cluster-structures.html` — a tab inside `explore.html`, currently **hidden** from the tab bar (active nav → The Cube)
- `lost-triangle-construction.html` — 2D animated construction (active nav → Animation)
- `lost-triangle-construction-3d.html` — 3D construction proof (active nav → Animation)
- `cube-diagonals.html` — cube diagonal deep-dive (active nav → The Lost Triangle)
- `rhombic-system.html` — rhombic dodecahedron system, now a tab inside `explore.html` (active nav → The Cube)
- `rhombic-dodecahedron.html` — rhombic dodecahedron (active nav → The Cube)
- `fleishman-vector-system.html` — vector system (active nav → The Cube)
- `vector-house.html` — vector house form (active nav → The Cube)
- `lost-triangle-motion.html` — looping canvas animation (active nav → Animation), embedded as iframe in `index.html`

---

## Theming System

The site is **dark-only**. The light theme was **fully removed** (June 2026): no toggle button, no `data-theme` switching, no `[data-theme="light"]` CSS rules anywhere, and `gf-theme.js` is now an inert dark-only stub. The dark tokens below are the entire palette.

### `assets/gf-tokens.css`
Single source of truth for CSS custom properties. Drop-in replacement on all 17+ pages.

Key variables:
- `--bg: #070a0b` — the void (near-black)
- `--tx: #e5e0d4` — parchment text
- `--accent: #c9a24b` — desert gold (UI chrome, active states)
- `--geo-unit: #e5e0d4` — edge = 1
- `--geo-face: #6f9bc4` — face diagonal √2 (blue)
- `--geo-space: #db684d` — space diagonal √3 / Lost Triangle (terracotta)
- `--geo-tri: #77a485` — root triangle fill (green)
- `--geo-angle: #c9a24b` — angle measures (gold)

### `assets/gf-theme.js`
- Inert dark-only compatibility stub. Sets `<meta name="theme-color">` to the dark value and clears any stale `localStorage['gf-theme']`.
- Exposes a no-op back-compat API — `window.gfTheme.get()/.set()/.toggle()` all return `'dark'` — so any leftover caller can't crash. Still loaded (via `<script>`) on every page; safe to keep.

### `assets/gf-scene.js`
- Exposes `window.GF_SCENE` with a **single `dark` palette** object: `bg[]`, `ink`, `unit`, `face`, `space`, `tri`, `angle`, `halo`.
- Colors are CSS hex strings; `THREE.Color` parses them directly.
- `GF_SCENE.active()` and `GF_SCENE.name()` always return the dark palette / `'dark'` (the light palette was removed). `GF_SCENE.onChange()` is a no-op (the `gf-themechange` event no longer fires).

**Note:** new WebGL pages should still read `const SC = GF_SCENE.dark` (or `.active()` — both return dark now). The historical mustard/gold background bug (caused by `.active()` returning a stored light palette) can no longer occur, since there is no light palette.

---

## WebGL Pages

### Three.js r160 ESM (modern pages)
Most pages use an `<script type="importmap">` pointing to `assets/vendor/three-0.160.0/`.

**Renderer setup convention** (follow this pattern in new pages):
```javascript
const SC = GF_SCENE.dark;  // always .dark, never .active()
const BGc = new THREE.Color(SC.bg[1] || '#0B0B0B');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(BGc, 1);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
```

**explore.html** — 5 tabs (1 currently hidden from the tab bar), each its own `<script type="module">` or iframe:
1. **The Cube** — characteristic tetrahedra assembly; fat lines (Line2/LineMaterial); OrbitControls; GSAP timeline
2. **Cluster Structures** — GSAP animation sequence. **Hidden as of July 2026** — the `<button data-tab="cs">` is commented out of the tab bar, but the `#scene-cs` markup/script and the `'cs'` entry in the tab-switcher's `scenes` array are untouched, so restoring it is a one-line uncomment.
3. **Vector System** — tiled cube frame with assembly pattern
4. **Rhombic System** — iframe to `rhombic-system.html?embed=1` (added July 2026, replacing its former top-nav slot)
5. **Vector Pod** — iframe to `vector-pod/index.html`

**construction.html** — no tab bar; full-bleed `<iframe src="lost-triangle.html?embed=1">` filling the space below the nav. The Cluster Structures tab (Three.js r160 + GSAP) was removed; its standalone page `cluster-structures.html` still exists by URL but is no longer linked from the nav.

(The earlier 3D Construction and Fleishman Sequence tabs were removed in PR #4 — their standalone pages `lost-triangle-construction-3d.html` and `fleishman-sequence.html` still exist by URL but are not in the nav.)

### React — Lost Triangle motion graphic (`lost-triangle.html`)
`lost-triangle.html` mounts a React app from vendored React 18.3.1 UMD (`assets/vendor/react-18.3.1/`). The JSX is **pre-transpiled** to plain JS — no in-browser Babel. Load order: `react` → `react-dom` → `animations.js` (defines `Stage`/`Sprite`/`Easing`/`useTime` on `window`) → `lost-triangle-video.js` (defines `window.LostTriangleVideoClean` + `LostTriangleVideoCleanPortrait`) → inline mount into `#lt-root`.

This is the **"Clean" build** — a faithful port of the Claude Design file `Lost Triangle Clean.dc.html` (pure full-canvas animation, no side panels). 7 scenes: Intro · Root Spiral · Triangle Construction · Cube · Reflected into Form · Dihedral Angles · Close (75s). Palette magenta `#FF00CC` / steel blue / gold on near-black; fonts Syne · Cormorant Garamond · Space Grotesk.

- **Edit the `.jsx`, not the `.js`** — the `.js` bundles are generated from `animations.jsx` / `LostTriangleVideoClean.jsx`. Re-transpile with `cd assets/lost-triangle && npm install --no-save @babel/standalone && node build.mjs` (see `assets/lost-triangle/README.md`).
- The figure geometry is **computed** from one edge length, so every `1 : √2 : √3` relationship is exact by construction — don't "correct" it to eyeballed coordinates.
- `?embed=1` hides the site nav so the page can be framed inside `construction.html`.
- The mount picks the layout by viewport aspect ratio — `LostTriangleVideoCleanPortrait` (1080×1920) on portrait, `LostTriangleVideoClean` (1920×1080) otherwise. Both share one Stage `persistKey` (`animstage-clean`), so the playhead carries across an orientation flip automatically.

### Three.js r128 (older deep-dive pages)
`cube-diagonals.html`, `dorman-luke.html`, `rhombic-dodecahedron.html`, `rhombic-system.html`, `fleishman-vector-system.html`, `vector-house.html` load Three.js r128 via `<script src="assets/vendor/three-r128/three.min.js">`. These use the global `THREE` object (not ESM).

### Canvas 2D
`lost-triangle-motion.html` and `lost-triangle-construction.html` use `assets/lost-triangle-engine.js` — a pure Canvas 2D renderer with manual isometric/dihedral projection. No dependencies.

---

## `explore.html` Specifics

The most complex page — five scenes in one file (one hidden from the tab bar, two of the five are iframes).

**Tab switching**: `activate(id)` at the bottom of the file shows/hides `.con-scene` divs via `display:block/none`. The animate loop for each scene guards on `sceneCubeEl.style.display === 'none'` to pause when hidden.

**Color palette loading sequence**:
```javascript
const SC = GF_SCENE.dark;  // synchronous — gf-scene.js loaded before this module
const BGc = new THREE.Color(SC.bg[1]);
const COL = { bg: BGc.getHex(), bone: ..., gold: ..., ... };
renderer.setClearColor(COL.bg, 1);
scene.fog = new THREE.Fog(COL.bg, 4.2, 11.5);
```

**Known state**: `buildComposers()` (bloom post-processing) was removed as dead code — it was defined but never called. The render loop uses direct `renderer.render(scene, camera)`.

---

## Cover Hero (index.html)

`index.html` embeds `lost-triangle-motion.html?cover=1` as a fixed, pointer-inert iframe background. The `?cover=1` param (or `html.gf-cover` class) hides all UI chrome inside the embedded page. A scrim gradient provides text legibility over the animation.

---

## Asset References

| Path | Contents |
|------|----------|
| `assets/arch/` | 6 architecture photos (node, otic, satellite, skyportal, solarstage, temple) |
| `assets/drawings/` | artwork-bronze.png, artwork-gold.png, fleishman-sequence-poster.png, lost-triangle-color.png, lost-triangle-template.png, root-sequence.png |
| `assets/handsketch.jpg` | Handsketch reference |

OG/Twitter meta image URLs use the full GitHub Pages URL — update these if the repo is renamed.

---

## Common Pitfalls

1. **Gold background on WebGL pages** (historical, now impossible): was caused by `GF_SCENE.active()` returning a stored light palette for the clear color. The light palette is gone, so `.active()` and `.dark` both return dark. Still prefer `GF_SCENE.dark` for clarity in new code.

2. **Color space**: Three.js r160 stores colors in linear space internally. Always set `renderer.outputColorSpace = THREE.SRGBColorSpace` explicitly to avoid ambiguity.

3. **Fog color**: Pass a `THREE.Color` object or the `.bg` hex string from `GF_SCENE.dark` — not a CSS variable that might not resolve at module-parse time.

4. **Mobile menu**: `gf-nav.js` is idempotent — safe to include on any page with `<nav id="gfnav">`. It builds the `#gf-mobilemenu` at runtime.

5. **No build step**: Editing JS in `vector-pod/` does nothing — that sub-app is pre-compiled. Its source lives in a separate repository.
