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
│   ├── lost-triangle-engine.js # Pure Canvas 2D renderer for Lost Triangle
│   ├── arch/                  # Architecture photography (6 JPGs)
│   ├── drawings/              # Artwork images (6 PNGs)
│   ├── handsketch.jpg         # Sketch reference
│   └── vendor/
│       ├── three-0.160.0/     # Three.js r160 ESM + addons (used by most pages)
│       ├── three-r128/        # Three.js r128 minified (older deep-dive pages)
│       └── gsap-3.12.5/       # GSAP 3.12.5 (animation timelines)
├── vector-pod/                # Compiled Vite/Vue app (separate sub-project)
│   ├── index.html
│   └── assets/
├── index.html                 # Landing page (outer site hub)
├── explore.html               # THE CUBE — main interactive (4 tabs)
├── mathematics.html           # The Lost Triangle narrative
├── construction.html          # Construction sequences (3 sub-pages linked inline)
├── dorman-luke.html           # Research: Dorman-Luke unfolding
├── rhombic-system.html        # Rhombic dodecahedron system
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
- `fleishman-sequence.html` — cinematic sequence (active nav → Construction)
- `cluster-structures.html` — now a tab inside `explore.html` (active nav → Construction)
- `lost-triangle-construction.html` — 2D animated construction (active nav → Construction)
- `lost-triangle-construction-3d.html` — 3D construction proof (active nav → Construction)
- `cube-diagonals.html` — cube diagonal deep-dive (active nav → The Lost Triangle)
- `rhombic-dodecahedron.html` — rhombic dodecahedron (active nav → Rhombic System)
- `fleishman-vector-system.html` — vector system (active nav → The Cube)
- `vector-house.html` — vector house form (active nav → Rhombic System)
- `lost-triangle-motion.html` — looping canvas animation, embedded as iframe in `index.html`

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

**construction.html** — 3 scenes with GSAP timelines: Fleishman Sequence, Lost Triangle Construction, Lost Triangle 3D.

### Three.js r128 (older deep-dive pages)
`cube-diagonals.html`, `dorman-luke.html`, `rhombic-dodecahedron.html`, `rhombic-system.html`, `fleishman-vector-system.html`, `vector-house.html` load Three.js r128 via `<script src="assets/vendor/three-r128/three.min.js">`. These use the global `THREE` object (not ESM).

### Canvas 2D
`lost-triangle-motion.html` and `lost-triangle-construction.html` use `assets/lost-triangle-engine.js` — a pure Canvas 2D renderer with manual isometric/dihedral projection. No dependencies.

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
