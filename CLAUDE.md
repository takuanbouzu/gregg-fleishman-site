# Gregg Fleishman Site — CLAUDE.md

Interactive geometry exhibit for artist Gregg Fleishman. Static multi-page site; no build step. Deploys to GitHub Pages from the `main` branch via `.nojekyll`.

Live URL: `https://takuanbouzu.github.io/gregg-fleishman-site/`
Repo: `takuanbouzu/gregg-fleishman-site`

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
│   ├── lost-triangle-engine.js # Pure Canvas 2D renderer for lost-triangle-motion.html
│   ├── lost-triangle/         # React motion graphic (see "Lost Triangle Motion Graphic")
│   │   ├── animations.jsx     # SOURCE: Stage/Sprite/Easing runtime
│   │   ├── animations.js      # GENERATED from animations.jsx (do not hand-edit)
│   │   ├── LostTriangleVideo.jsx   # SOURCE: the 9 scenes
│   │   ├── lost-triangle-video.js  # GENERATED from LostTriangleVideo.jsx
│   │   └── README.md          # Provenance + how to re-transpile
│   ├── arch/                  # Architecture photography (6 JPGs)
│   ├── drawings/              # Artwork images (6 PNGs)
│   ├── handsketch.jpg         # Sketch reference
│   └── vendor/
│       ├── three-0.160.0/     # Three.js r160 ESM + addons (most WebGL pages)
│       ├── three-r128/        # Three.js r128 minified (older deep-dive pages)
│       ├── react-18.3.1/      # React + ReactDOM UMD (lost-triangle.html only)
│       └── gsap-3.12.5/       # GSAP 3.12.5 (animation timelines)
├── vector-pod/                # Compiled Vite/Vue app (separate sub-project)
│   ├── index.html
│   └── assets/
├── index.html                 # Landing page (outer site hub)
├── explore.html               # THE CUBE — main interactive (4 tabs)
├── mathematics.html           # The Lost Triangle narrative
├── construction.html          # Construction — 2 tabs (2D embed + Cluster Structures)
├── lost-triangle.html         # React motion graphic, full-bleed (embedded by construction.html)
├── dorman-luke.html           # Research: Dorman-Luke unfolding
├── rhombic-system.html        # Rhombic dodecahedron system
├── about.html                 # About Gregg Fleishman
├── portfolio.html             # Work / portfolio gallery
├── store.html                 # Store (placeholder, products disabled)
├── contact.html               # Contact
├── HANDOFF.md                 # Working note for the motion-graphic branch (not site content)
└── [deep-dive pages]          # Sub-pages not in nav (see below)
```

---

## Two Navigation Systems

### Outer Site Nav (index, about, portfolio, store, contact)
```
About · Work · [Geometry → index.html] · Store · Contact
```
- `index.html` uses "Geometry" linking to itself (the hub)
- Other outer pages use "The Math" → `mathematics.html` as their geometry entry point

### Geometry Exhibit Nav (explore, mathematics, construction, research, rhombic-system)
```
[brand] Gregg Fleishman · The Cube · The Lost Triangle · Construction · Research · Rhombic System · Vector Pod
```
- Present on all geometry pages via shared `<nav id="gfnav">`
- `gf-nav.js` auto-enhances this nav with a responsive hamburger at ≤820px

### Orphaned Deep-Dive Pages
These are accessible by URL only — not linked from any nav:
- `lost-triangle.html` — React motion graphic; standalone page, also embedded by `construction.html` via `?embed=1` (active nav → The Lost Triangle). See "Lost Triangle Motion Graphic".
- `fleishman-sequence.html` — cinematic sequence (active nav → Construction)
- `cluster-structures.html` — also a tab inside `explore.html` and `construction.html` (active nav → Construction)
- `lost-triangle-construction.html` — older 2D animated construction, Canvas 2D (active nav → Construction)
- `lost-triangle-construction-3d.html` — older 3D construction proof, Three.js r160 (active nav → Construction)
- `cube-diagonals.html` — cube diagonal deep-dive (active nav → The Lost Triangle)
- `rhombic-dodecahedron.html` — rhombic dodecahedron (active nav → Rhombic System)
- `fleishman-vector-system.html` — vector system (active nav → The Cube)
- `vector-house.html` — vector house form (active nav → Rhombic System)
- `lost-triangle-motion.html` — looping Canvas 2D animation, embedded as iframe cover in `index.html`

---

## Theming System

The site is **dark-only by design** (`gf-tokens.css` overrides any light-theme switch).

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

Light mode is neutered: `:root[data-theme="light"]{ color-scheme:dark; }` — the toggle is kept in the markup but has no visual effect.

### `assets/gf-theme.js`
- Reads/writes `localStorage` key `gf-theme`
- Sets `data-theme` on `<html>`
- Exposes `window.gfTheme.get()`, `.set()`, `.toggle()`

### `assets/gf-scene.js`
- Exposes `window.GF_SCENE` with `light` and `dark` palette objects
- Each palette: `bg[]`, `ink`, `unit`, `face`, `space`, `tri`, `angle`, `halo`
- Colors are CSS hex strings; `THREE.Color` parses them directly
- `GF_SCENE.active()` returns the current palette; `GF_SCENE.onChange(cb)` fires on theme toggle

**Important:** WebGL scenes hardcode `const SC = GF_SCENE.dark` — do NOT use `GF_SCENE.active()` in renderer setup. Using `.active()` caused the mustard/gold background bug (when a user had light mode stored, `SC.bg` became the cream palette and was used as the WebGL clear color).

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

**explore.html** — 4 tabs, each its own `<script type="module">`:
1. **The Cube** — characteristic tetrahedra assembly; fat lines (Line2/LineMaterial); OrbitControls; GSAP timeline
2. **Cluster Structures** — GSAP animation sequence
3. **Vector System** — tiled cube frame with assembly pattern
4. **Vector Pod** — iframe to `vector-pod/index.html`

**construction.html** — **2 tabs** (the earlier 3D Construction and Fleishman Sequence tabs were removed as mathematically inaccurate):
1. **2D Construction** — a single `<iframe src="lost-triangle.html?embed=1">` (the exact React motion graphic). Switching tabs dispatches a `resize` event so the embedded `Stage` re-measures.
2. **Cluster Structures** — Three.js r160 (importmap) + GSAP timeline.

### Three.js r128 (older deep-dive pages)
`cube-diagonals.html`, `dorman-luke.html`, `rhombic-dodecahedron.html`, `rhombic-system.html`, `fleishman-vector-system.html`, `vector-house.html` load Three.js r128 via `<script src="assets/vendor/three-r128/three.min.js">`. These use the global `THREE` object (not ESM).

### Canvas 2D
`lost-triangle-motion.html` and `lost-triangle-construction.html` use `assets/lost-triangle-engine.js` — a pure Canvas 2D renderer with manual isometric/dihedral projection. No dependencies.

---

## Lost Triangle Motion Graphic (React)

`lost-triangle.html` is the one React page on the site. It renders the exact `1 : √2 : √3` construction as a 9-scene, ~73.5 s animated explainer (unit square → √2 face diagonal → √3 space diagonal → cube → rhombic facet → dihedral payoff → root sequence → Pythagorean proofs → end card).

**Stack & load order** (all vendored, no CDN, no in-browser Babel):
1. `assets/vendor/react-18.3.1/react.production.min.js` → `window.React`
2. `assets/vendor/react-18.3.1/react-dom.production.min.js` → `window.ReactDOM`
3. `assets/lost-triangle/animations.js` → registers `Stage` / `Sprite` / `Easing` / `useTime` on `window`
4. `assets/lost-triangle/lost-triangle-video.js` → registers `window.LostTriangleVideo` (1920×1080) and `window.LostTriangleVideoPortrait` (1080×1920)
5. inline script → `ReactDOM.createRoot(#lt-root).render(<LostTriangleVideo/>)`, with a short poller in case scripts are still evaluating.

**Source of truth**: the `.jsx` files (`animations.jsx`, `LostTriangleVideo.jsx`). The `.js` files are **transpiled output — never hand-edit them**. To regenerate, run Babel `preset-react` (`compact:false`) over the `.jsx`; see `assets/lost-triangle/README.md`.

**Key facts**:
- Geometry is **computed, not eyeballed** — `planar()` derives every length from one edge `U` (`U·√2`, `U·√3`), so all relationships hold by construction. A figure that looks "off" is a scaling/render issue, not a math error. Don't "fix" the geometry.
- `?embed=1` (or `html.lt-embed`) hides the site nav so the page can be framed inside `construction.html`.
- The `Stage` auto-scales to the viewport, owns the scrubber/playback bar + keyboard controls (space, ←/→, 0), and persists the playhead in `localStorage` (`losttri_landscape` / `losttri_portrait`).
- Currently always mounts the **landscape** component; portrait selection by viewport is an open follow-up (see `HANDOFF.md`).

---

## `explore.html` Specifics

The most complex page — four scenes in one file.

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

**Fat lines (Line2/LineMaterial)**: The Cube draws its edges with `Line2` + `LineMaterial`. A fat line's screen-space width is computed from `material.resolution`; if that resolution is degenerate (e.g. the initial `W=1,H=1` before layout), the line quad blows up to **fill the whole viewport** — which on the gold-colored angle-arc material reads as a full-screen mustard field. Every animate loop guards `if (W>1 && H>1)` before rendering, and the one-time init draw guards likewise. Keep `lineMats.forEach(m => m.resolution.set(W,H))` in `resize()` so widths stay correct on orientation change.

**No `preserveDrawingBuffer`**: The WebGL renderers must NOT be created with `preserveDrawingBuffer:true`. Nothing reads the buffer back (no `toDataURL`/screenshot — the `cover`/`clean` modes only hide DOM chrome via CSS, and the index cover uses `lost-triangle-motion.html`). With it enabled, a single glitched frame (e.g. a degenerate-resolution fat line) **persists** instead of being cleared next frame — this was the cause of the sticky gold field on mobile — and it adds a per-frame buffer copy that worsens jank.

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

1. **Gold background on WebGL pages**: Caused by using `GF_SCENE.active()` for the clear color when a user has light mode in localStorage. Always use `GF_SCENE.dark` directly.

2. **Color space**: Three.js r160 stores colors in linear space internally. Always set `renderer.outputColorSpace = THREE.SRGBColorSpace` explicitly to avoid ambiguity.

3. **Fog color**: Pass a `THREE.Color` object or the `.bg` hex string from `GF_SCENE.dark` — not a CSS variable that might not resolve at module-parse time.

4. **Mobile menu**: `gf-nav.js` is idempotent — safe to include on any page with `<nav id="gfnav">`. It builds the `#gf-mobilemenu` at runtime.

5. **No build step**: Editing JS in `vector-pod/` does nothing — that sub-app is pre-compiled. Its source lives in a separate repository.

6. **Sticky gold field on The Cube (mobile)**: A fat-line `LineMaterial` rendered with degenerate `resolution` fills the viewport gold; `preserveDrawingBuffer:true` then made that frame stick. Fix = never create renderers with `preserveDrawingBuffer`, and never draw before the stage has real dimensions (`W>1 && H>1`). See "explore.html Specifics".

7. **Generated motion-graphic bundles**: `assets/lost-triangle/animations.js` and `lost-triangle-video.js` are transpiled from the sibling `.jsx` files — edit the `.jsx` and re-transpile (Babel `preset-react`), never the `.js`. See `assets/lost-triangle/README.md`.
