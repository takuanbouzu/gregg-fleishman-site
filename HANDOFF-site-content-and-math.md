# HANDOFF — Site Content, Mathematics, and Operations (July 2026)

Orientation document for an agent picking up this project cold. Three parts:
**(1)** what content the site currently shows Gregg, **(2)** the mathematics
that ties all of it together, explained plainly, **(3)** the operational
state of the repo right now.

---

## 1. What this site is

A dark-only, static exhibit site built around one idea: a cube contains a
"lost" triangle relating its own edge, face-diagonal, and space-diagonal
lengths, and that triangle's three lengths and three angles generate every
other geometric form on the site — including several of Gregg Fleishman's
real built structures (Vector Pod, Vector House).

- Live: `https://takuanbouzu.github.io/gregg-fleishman-site/`
- Repo: `takuanbouzu/gregg-fleishman-site`
- No build step for the main site — vendored static HTML/CSS/JS, deployed to
  GitHub Pages straight from `main`. Two sub-apps (below) do have their own
  build step.

---

## 2. The mathematics — plain-language version

### 2.1 The Lost Triangle

Take a unit cube (edge length 1) and look at the three fundamentally
different straight-line distances you can measure across it from one
corner:

| Path | Length | Direction (from a corner) |
|---|---|---|
| Along one edge | **1** | axis direction, e.g. `(1,0,0)` |
| Diagonally across one face | **√2** | face-diagonal direction, e.g. `(1,1,0)` |
| Corner to the opposite corner, straight through the solid | **√3** | space-diagonal direction, `(1,1,1)` |

Those three numbers — 1, √2, √3 — aren't just three unrelated
measurements. They form a right triangle: a right triangle with legs 1 and
√2 has hypotenuse exactly √3 (since 1² + (√2)² = 1 + 2 = 3 = (√3)²). That
triangle is sitting inside every cube, hiding in plain sight — everyone
knows what a cube is, almost no one notices this triangle relating its own
three characteristic lengths. The site calls it **the Lost Triangle**, and
it's the spine of the whole exhibit (`mathematics.html` walks through
deriving it; `lost-triangle.html` is the polished motion-graphic version;
`explore.html` lets you handle the 3D model directly).

### 2.2 The three angles

The same three directions also correspond to three angles, and these
recur constantly in Gregg's actual design work:

- **45°** — angle of a face diagonal from an edge (the √2 direction)
- **54.74° = arctan(√2)** — angle of the space diagonal from a face (the
  √3 direction)
- **35.26° = 90° − 54.74° = arctan(1/√2)** — the complement; also known
  outside this context as the "magic angle" in physics/NMR

Gregg arrived at these angles independently through decades of design
practice — the site's `fleishman-ground-angle.html` and
`fleishman-proof-3d.html` pages exist specifically to show two independent
routes to the same 35.25°/54.74° pair (one starting from a tilted unit
square, one parsed directly out of Gregg's own original Rhino drawing),
which is treated as a kind of proof-by-corroboration that this isn't a
coincidence.

### 2.3 Why this generates *everything else* on the site

Every direction out of a cube's center belongs to exactly one of three
families, based on how many of its coordinates are nonzero:

- **Axis family** `(1,0,0)` — ratio **1** — the cube's own faces sit here
- **Face family** `(1,1,0)` — ratio **√2**
- **Corner family** `(1,1,1)` — ratio **√3**

Every solid or structure on the site puts its own faces on one (or a
mix) of these three families:

| Form | Faces sit on… | Page(s) |
|---|---|---|
| The cube | axis family (1) | `explore.html` |
| **Rhombic dodecahedron** — 12 rhombic faces | face family (√2) | `rhombic-dodecahedron.html`, `rhombic-system.html` |
| **Truncated octahedron** — 8 hexagons + 6 squares | corner family (√3) + axis family (1) | `truncated-octahedron.html` |
| **Vector Pod** (Gregg's built rhombic-panel unit) | shares its 8 panels 1:1 with the truncated octahedron's hexagons | `vector-pod/index.html` |
| **Vector House / Vector System** | Gregg's architectural application — 45°/90° plywood-panel fold system | `vector-house.html`, `fleishman-vector-system.html` |
| **Dorman–Luke construction** | formal method relating a solid to its dual (used to explain *why* the rhombic dodecahedron looks the way it does) | `dorman-luke.html` |

One correction made this session: the file Gregg had originally labeled
`Rhombic_dodeca.glb` is geometrically **not** a rhombic dodecahedron — it's
a **truncated octahedron** (8 hexagonal faces on the corner directions, 6
square faces on the axis directions; a rhombic dodecahedron would have 12
rhombic faces on the *edge* directions instead, and this solid has none).
This was verified independently two ways: DXF/CAD analysis and direct
mesh-normal clustering on the raw geometry. The mislabeled toggle in the
Vector Pod app was renamed to "Truncated octahedron," and a new deep-dive
page (`truncated-octahedron.html`) was built to present the corrected
finding.

### 2.4 Space-filling — the deepest layer

The cube, the rhombic dodecahedron, and the truncated octahedron are the
three solids from the "cubic family" that can each **tile 3D space with
zero gaps on their own** (this is the parallelohedron / BCC-lattice-packing
story — the truncated octahedron in particular is the historically famous
"Kelvin's cell"). `truncated-octahedron.html`'s centerpiece animation shows
its 14 nearest-neighbor cells (6 across the square faces, 8 across the
hexagon faces) gliding in and clicking together to demonstrate this. The
site's framing: Gregg's structures aren't arbitrarily geometric — they're
drawing from the small, finite set of ways a cube's own internal geometry
is able to pack space, and the Lost Triangle's three lengths are *why* that
finite set exists.

---

## 3. Content currently shown to Gregg

Two separate nav systems exist. All geometry pages are dark-only (the light
theme was fully removed in June 2026).

### 3.1 Outer site (marketing/portfolio shell)

`index.html` (hub, embeds a Lost-Triangle motion graphic as a hero
background) → `about.html`, `portfolio.html`, `store.html` (products
disabled, placeholder), `contact.html`. Nav: **About · Work · Geometry ·
Store · Contact** — "Geometry" is the doorway into the exhibit below.

### 3.2 The geometry exhibit — intended learning journey

Nav order deliberately encodes **scroll → animation → model**:

1. **"The Lost Triangle" → `mathematics.html`** — the long-form scrolling
   narrative. Entry point. Ends with a live-orbitable "Vector House
   epilogue" (real scanned geometry) making the point "you end where you
   began" — theory arrives at a real building.
2. **"Animation" → `lost-triangle.html`** — a polished 7-scene React motion
   graphic (Intro → Root Spiral → Triangle Construction → Cube → Reflected
   into Form → Dihedral Angles → Close). Same content as #1, told as a
   clean visual sequence instead of a scroll.
3. **"The Cube" → `explore.html`** — the interactive 3D model. Five
   scenes/tabs: The Cube (characteristic tetrahedra assembly), Vector
   System, Rhombic System (iframe), Vector Pod (iframe), and a currently
   hidden "Cluster Structures" tab.
4. **"Research" → `dorman-luke.html`** — the formal dual-polyhedron
   construction underpinning the rhombic dodecahedron.

### 3.3 Orphaned deep-dives (real content, reachable by URL, not in top nav)

These exist because the exhibit has grown past a 4-item nav can hold
cleanly — each is linked from *somewhere* (a tab, a cross-link, or a
masthead pill) even if not from the top bar:

- `truncated-octahedron.html` — **the newest and most complete deep-dive**.
  Computed-exact truncated octahedron, the three angle arcs swept live, the
  14-neighbor space-filling packing animation, and a "Mode" stepper (The
  cell → Packing → The Pod → The House) that walks from pure geometry to
  Gregg's actual built structures — lazy-loading his real Vector Pod and
  Vector House models and revealing them wireframe-first, then solid
  ("living diagram" build-in, matching the reference Vector Pod app's
  visual language).
- `fleishman-ground-angle.html` / `fleishman-proof-3d.html` — the two
  independent proofs of the 35.25°/54.74° pair (cross-link each other).
- `cube-diagonals.html` — cube diagonal deep-dive.
- `rhombic-dodecahedron.html`, `rhombic-system.html`,
  `fleishman-vector-system.html`, `vector-house.html` — the built-structure
  side of the story.
- `fleishman-sequence.html`, `lost-triangle-construction.html`,
  `lost-triangle-construction-3d.html`, `lost-triangle-motion.html`,
  `cluster-structures.html` — earlier motion/construction pieces, still
  live, superseded in the top nav by the newer `lost-triangle.html`.

### 3.4 Vector Pod app (`vector-pod/`)

A separate React 19 + Vite + TS app (editable source in `vector-pod-src/`,
compiled output served from `vector-pod/`). Renders Gregg's real rhombic
panel unit from baked NURBS edge data, with toggle-able overlays: Squares,
Hexagons, Angles, Lost Triangle, Cube, Rhombic-dodeca, and (this session)
**Truncated octahedron** — a violet wireframe overlay proving the pod's own
8 panels are the truncated octahedron's hexagon faces at native scale.

### 3.5 Vector House drawings (new this session — not yet on any page)

Five orthographic drawings plus one exploded axonometric, computed directly
from `assets/models/vector-house.glb` (dequantize → weld → dihedral-angle
feature edges + exact plane-section cuts → SVG → PNG): `plan.png`,
`elevation-front.png`, `elevation-end.png`, `section-cross.png`,
`section-long.png`, `joint-detail-axon.png` (an exploded isometric of a
real 3–4-part joint, found by computational search, with measured dihedral
angles annotated). **These are currently orphaned reference assets** —
documented in `CLAUDE.md`'s asset table, not linked from any page. The
owner made an observation worth carrying forward: these largely
re-visualize the same vector-system parts/angles the Vector Pod app already
shows interactively in 3D — so before building a page around them, it's
worth deciding whether they add enough beyond that, or whether the payoff
is specifically the *fixed, dimensioned, printable* framing.

---

## 4. Operational state

### 4.1 Repo / branch / deploy

- Working branch: **`claude/lost-triangle-animation-math-vudrm9`**, opened
  as **draft PR #52** into `main`. Never commit directly to `main` — it
  deploys live to GitHub Pages.
- Vercel auto-builds preview deployments on every push to this branch
  (4 linked Vercel projects; status shows up as bot comments on the PR —
  routine, rarely need action beyond confirming "Ready").
- No build step for the static site — `python3 -m http.server 8000` to run
  locally (ES-module import maps require `http://`, not `file://`).
- Two sub-projects **do** have their own build:
  - `vector-pod-src/` (React 19 + Vite + TS) → `pnpm build` → copy
    `dist/index.html` + hashed `dist/assets/*` into `vector-pod/`
    (content-hashed filenames — delete the old ones first). Preserve
    `vector-pod/favicon.svg` + `icons.svg`, which the build doesn't emit.
  - `assets/lost-triangle/*.jsx` → transpiled by hand via
    `@babel/standalone` into the checked-in `*.js` bundles (`animations.js`,
    `lost-triangle-video.js`). Never hand-edit the `.js` files.

### 4.2 This session's work, roughly chronological

1. Vector Pod app: added the (initially mislabeled) rhombic-dodeca overlay,
   scaled it to the pod's native part scale, then corrected the geometry
   analysis and renamed it "Truncated octahedron" everywhere (data module,
   toggle label, App.tsx state).
2. Built `truncated-octahedron.html` from scratch: computed-exact geometry,
   angle-arc sweeps, 14-neighbor packing animation, then converted its
   renderer from the site's older Three r128 global pattern to r160 ESM,
   added the Mode stepper + wireframe-then-solid reveal system, wired in
   Gregg's real Pod/House `.glb` models, and added a violet wireframe layer
   sourced from the user-uploaded `Rhombic_dodeca.glb` (Draco-decoded to
   `assets/models/truncated-octahedron-detail.glb`).
3. Deep geometric analysis of `assets/models/vector-house.glb`
   (dequantize/weld/dihedral-edge extraction pipeline, built from scratch
   in the scratchpad, not checked into the repo) → five orthographic
   drawings, then a computationally-found exploded joint-detail axonometric
   with real measured angles.
4. **Full review pass** (explicitly requested — "total review inspection
   on all fronts"), run as parallel background audits, each followed by
   verified fixes:
   - Nav/metadata audit → found and fixed a real regression: two pages
     (`fleishman-ground-angle.html`, `fleishman-proof-3d.html`) had drifted
     to a 4-item nav missing "Animation," and were missing their OG/Twitter
     meta blocks.
   - Live-browser audit → found and fixed a `vector-pod/index.html` 404 (a
     favicon file existed on disk but nothing in `<head>` referenced it).
   - Asset/doc audit → confirmed no orphaned `.glb`s, no stale Vite build
     artifacts, no reintroduced "vertor" typo; flagged the vector-house
     drawings as orphaned (documented, not wired into a page — see §3.5).
   - Performance audit → found `mathematics.html` was eagerly fetching a
     4.5MB `vector-house.glb` on every page load regardless of scroll
     position; gated it behind an `IntersectionObserver` (first attempt
     used too generous a margin and didn't actually defer — caught by
     verification and fixed).
   - Accessibility audit → fixed a real WCAG contrast failure
     (`--tx-faint` was 3.05:1 against the background, now 4.7:1, affecting
     small captions on 13+ pages), added a missing `<h1>` on
     `mathematics.html`, labeled the shared nav landmark, and added
     keyboard-driven camera orbit (arrow keys + `+`/`-`) to all 6 pages
     that have hand-rolled mouse-drag orbit instead of Three's
     `OrbitControls` class.
   - While chasing a flagged-as-cosmetic console warning in `gf-scene.js`,
     traced it to a **real bug**: a local `hex()` color-parsing helper in
     `explore.html`, `fleishman-sequence.html`, and `cluster-structures.html`
     couldn't parse `rgba(...)` strings, so the sage-green "root triangle"
     fill color was silently `NaN` → rendered solid black on all three
     pages. Fixed the parser in all three; verified the fills now render
     the correct green.
5. All of the above is committed and pushed; PR #52 is up to date with all
   four Vercel previews Ready as of the last status check.

### 4.3 Known open items / good next steps

- **Vector House drawings** (§3.5) aren't linked from any page — decide
  whether/how to present them given the owner's "you're basically
  recreating the Vector Pod parameters into 2D drawings" observation.
- **Keyboard access** is now solid on the 6 primary hand-rolled-orbit deep
  dives, but `lost-triangle-motion.html`'s Canvas-2D drag-rotate (in
  `assets/lost-triangle-engine.js`) still has none — lower priority since
  it's a decorative/looping piece (also used as `index.html`'s hero
  background), not a primary content viewer.
- Three pre-existing pages (`fleishman-sequence-drawings.html`,
  `lost-triangle-clean-preview.html`,
  `lost-triangle-construction-triangles.html`) are linked from
  `index.html`/`mathematics-preview.html` but aren't mentioned in
  `CLAUDE.md`'s page inventory — a minor, pre-existing documentation gap,
  not a functional issue.
- A second Claude session (referenced by the user mid-session,
  `session_01RQo5t2Y25tiuo51WpCRZMw`) was working in parallel on related
  work — see `HANDOFF-truncated-octahedron-deep-dive.md` for the
  coordination notes written for it. Worth checking whether that work
  landed before starting anything that might overlap.
- `CLAUDE.md` is the canonical, actively-maintained reference for every
  convention mentioned above (nav structure, theming, WebGL setup
  patterns, baseline standards) — read it before making further changes,
  it is kept in sync with the actual repo state.
