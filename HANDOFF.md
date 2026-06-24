# Merge record — 2026-06-24

Snapshot of where the site sits after the June 2026 batch of work. `main` is the
GitHub Pages deploy branch; the live site at
`https://takuanbouzu.github.io/gregg-fleishman-site/` serves whatever `main` points at.

**State: all work merged. `main` is at `5e34b17` and there is nothing pending or stranded.**

### Sessions → PRs → main

All four PRs are **merged and closed**. The three June 24 sessions map as follows:

| Session | PR | Squash commit on `main` | Merged (UTC) |
|---|---|---|---|
| 2D graphics accuracy | [#4](https://github.com/takuanbouzu/gregg-fleishman-site/pull/4) — Lost Triangle motion graphic; fix inaccurate 2D construction | `5e34b17` | 05:25:45 |
| THE CUBE background rendering bug | [#2](https://github.com/takuanbouzu/gregg-fleishman-site/pull/2) — remove dead bloom code, add CLAUDE.md (gold-bg bug already fixed in `c942cdc`) | `9208a76` | 05:25:18 |
| Gregg's site feedback | [#3](https://github.com/takuanbouzu/gregg-fleishman-site/pull/3) — rotate construction square 45° so its diagonal aligns with the rhombus long axis | `b6a22e6` | 05:24:22 |
| _(earlier, 06-23)_ asset upload | [#1](https://github.com/takuanbouzu/gregg-fleishman-site/pull/1) — Add files via upload | `ed49dd5` | — |

They merged in dependency order (#3 → #2 → #4, each stacked on the last), producing a
clean linear tip at `5e34b17`.

### What this batch added to `main` (vs. the prior tip `c87a2a7`)

- New canonical 2D construction — `lost-triangle.html` with computed `1 : √2 : √3`
  geometry; `construction.html`'s 2D tab now embeds it (that file shrank ~960 lines).
- Vendored React 18.3.1 UMD + pre-transpiled bundle under `assets/lost-triangle/`
  and `assets/vendor/react-18.3.1/`.
- THE CUBE cleanup in `explore.html` — dead bloom post-processing removed, explicit
  sRGB color space added.
- Docs — `CLAUDE.md` and this `HANDOFF.md`.

Net since `c87a2a7`: 12 files changed, +5,261 / −1,004.

### Loose ends
- Per-session branches (`claude/lucid-wozniak-btvk47`, `claude/wonderful-gauss-rdeptx`,
  `claude/youthful-shannon-uhai7q`) were squash-merged and removed. Only `main` and
  `claude/fervent-mendel-hb7kk9` remain on the remote; the latter is identical to `main`.
- Browser visual QA for PR #4 (§6 below) was the one outstanding item at merge time.

---

# Handoff — Lost Triangle motion graphic + accurate 2D construction

Branch: `claude/lucid-wozniak-btvk47` · Draft PR: **#4**
(`https://github.com/takuanbouzu/gregg-fleishman-site/pull/4`)

This branch replaces the mathematically-inaccurate "2D Construction" graphic on
`construction.html` with a faithful implementation of the Claude Design project
**`Lost Triangle.dc.html`** ("Motion graphic mathematics explanation").

You're picking this up to (a) do the browser visual QA that couldn't be done in
the remote/headless environment, and (b) optionally take on the follow-ups at the
bottom. Everything below is the full context.

---

## 1. Why this change exists

The old `construction.html` → **2D Construction** tab drew the `1 : √2 : √3`
figure from hand-placed SVG coordinates. The numbers didn't hold:

- the "unit square" was `287 × 243` px — **not square**;
- the three construction circles had radii `185 : 195 : 193` (near-equal)
  instead of `R = 1 : √2 : √3` (≈ `185 : 262 : 320`);
- the blue / white / √3 triangles were eyeballed.

So none of the defining relationships were actually true. The replacement design
computes its geometry instead of eyeballing it (see §4), so it's exact.

---

## 2. What changed (file inventory)

### New — the motion graphic
- `lost-triangle.html` — standalone page. Loads React + the design and mounts it
  full-bleed under the site nav. `?embed=1` hides the nav (used by the iframe).
- `assets/lost-triangle/animations.js` — **generated**. The `Stage` / `Sprite` /
  `Easing` runtime; registers globals on `window`. Transpiled from `animations.jsx`.
- `assets/lost-triangle/lost-triangle-video.js` — **generated**. The 9 scenes;
  registers `window.LostTriangleVideo` (landscape 1920×1080) and
  `window.LostTriangleVideoPortrait` (portrait 1080×1920). Transpiled from
  `LostTriangleVideo.jsx`.
- `assets/lost-triangle/animations.jsx`, `assets/lost-triangle/LostTriangleVideo.jsx`
  — **source of truth** (the Claude Design handoff source). Edit these, not the `.js`.
- `assets/lost-triangle/README.md` — provenance + how to regenerate.

### New — vendored runtime (pulled from npm; CDNs are egress-blocked in the cloud env)
- `assets/vendor/react-18.3.1/react.production.min.js`
- `assets/vendor/react-18.3.1/react-dom.production.min.js`

### Modified
- `construction.html` — the **2D Construction** tab body is now a single
  `<iframe id="c2d-frame" src="lost-triangle.html?embed=1">` (replacing the old
  approximate `#c2d-art` SVG + its GSAP build IIFE). The **3D Construction** and
  **Fleishman Sequence** tabs were removed entirely (markup, their Three.js
  module scripts, the `fs` boot timer, and dead CSS) because those animations
  were also mathematically inaccurate. Only two tabs remain: **2D Construction**
  (the exact embed) and **Cluster Structures** (untouched, still Three.js + GSAP).

---

## 3. How it runs (architecture)

It's plain static HTML — no build step, no bundler, no server. Load order in
`lost-triangle.html`:

1. `react.production.min.js` → sets global `window.React`
2. `react-dom.production.min.js` → sets `window.ReactDOM` (incl. `createRoot`)
3. `animations.js` → defines `Stage`, `Sprite`, `useTime`, `Easing`, … on `window`
4. `lost-triangle-video.js` → defines `window.LostTriangleVideo` (+ Portrait)
5. inline mount script → `ReactDOM.createRoot(#lt-root).render(<LostTriangleVideo/>)`,
   with a short poller in case scripts are still evaluating.

The `Stage` component (in `animations.js`) provides auto-scaling to the viewport,
the scrubber/playback bar, and keyboard controls (space, ←/→, 0). The video is
73.5 s, 9 scenes, `loop={false}`, `autoplay={true}`, and persists the playhead in
`localStorage` (`losttri_landscape` / `losttri_portrait`).

`construction.html` embeds the page via iframe, so React is fully isolated from
that page's Three.js modules — no global collisions. The tab switcher dispatches a
`resize` event when you switch tabs, which the `Stage` listens for to re-measure.

Why pre-transpiled instead of in-browser Babel: the original `.dc.html` ran JSX
through `@babel/standalone` (~3 MB). Transpiling ahead of time means the page ships
only ~140 KB of React. No Babel at runtime.

---

## 4. Why the geometry is exact (don't "fix" it)

In `LostTriangleVideo.jsx`, `planar(L)` builds the figure from one edge length `U`:

```
A  = [AX, AY]                          // unit-square corner (right angle here)
B  = [AX + U, AY]                      // edge = 1
Cc = [AX + U, AY - U]                  // unit square
D  = [AX, AY - U]
F  = Cc + perpOut * U                  // step ONE unit perpendicular to AC
// |A→Cc| = U·√2 (face diagonal);  |A→F| = U·√3 (space diagonal)
// triangle A-Cc-F is the Lost Triangle: legs √2 and 1, hypotenuse √3, right angle at Cc
```

Construction circles use `r2 = U*Math.SQRT2`, `r3 = U*Math.sqrt(3)`. Everything is
derived, so the relationships are true by construction. If a reviewer flags the
figure as "off," it's a rendering/scaling issue, not a math error.

---

## 5. Run / preview locally

Any static server from the repo root:

```bash
python3 -m http.server 8000
# then open:
#   http://localhost:8000/lost-triangle.html
#   http://localhost:8000/lost-triangle.html?embed=1     (nav hidden)
#   http://localhost:8000/construction.html              (→ 2D Construction tab)
```

Vercel previews already built green on the PR:
- `https://gregg-fleishman-site-ubtv-git-claude-lucid-woznia-0a0c54-zenbu1.vercel.app/lost-triangle.html`
- same host → `/construction.html`

---

## 6. Verification status

**Done (headless, in the cloud env):**
- `node --check` passes on both generated `.js` files.
- jsdom render of the real `lost-triangle.html` (resolving its actual `<script src>`
  paths): React + `Stage`/`Sprite`/`Easing` register, `LostTriangleVideo` mounts,
  the loading fallback clears, real scene `<svg>` renders — **zero runtime errors**.
- `construction.html` script tags balanced; no dangling `c2d-*` references.
- Both Vercel preview deployments built **Ready**; PR check is green.

**NOT done — please do this (the reason for the handoff):**
- [ ] Open `lost-triangle.html` in a real browser. Watch all 9 scenes play; confirm
      the square reads square, circles read `1 : √2 : √3`, labels (`1`, `√2`, `√3`,
      angles `45° / 35.26° / 54.74°`) are placed correctly and legible.
- [ ] Resize to a narrow/portrait viewport — confirm the portrait layout
      (`LostTriangleVideoPortrait`, 1080×1920) is selected and readable. NOTE: the
      page currently always mounts the **landscape** component (see follow-up A).
- [ ] Open `construction.html`, confirm the **2D Construction** tab shows the
      embedded graphic, that switching to 3D/Sequence/Cluster and back still works,
      and that the iframe sizes correctly on mobile.
- [ ] Check fonts load (Cormorant / Spectral / JetBrains Mono via Google Fonts) and
      light/dark theme toggle still looks right around the iframe.

---

## 7. Follow-ups / open decisions (optional)

**A. Portrait on mobile.** `lost-triangle.html` hardcodes `LostTriangleVideo`
(landscape). The design also exports `LostTriangleVideoPortrait`. Consider choosing
by viewport at mount, e.g.:

```js
var portrait = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
var Comp = portrait ? window.LostTriangleVideoPortrait : window.LostTriangleVideo;
ReactDOM.createRoot(el).render(React.createElement(Comp));
```

(Re-evaluate on orientation change if you want it live — the `Stage` already
re-scales, but the component choice is made once at mount.)

**B. Navigation.** The new page isn't in the global nav. Its own nav link is marked
`active` on "The Lost Triangle" (which points to `mathematics.html`). Decide whether
`lost-triangle.html` should get a real nav entry, be linked from `mathematics.html`,
or stay reachable only via the construction tab.

**C. `mathematics.html` / `lost-triangle-motion.html`.** There are pre-existing
pages covering the same topic. Worth a pass to cross-link or de-duplicate, but out
of scope for this branch.

**D. Regenerating the bundles.** If you edit the `.jsx`, re-transpile (preset-react,
`compact:false`) — see `assets/lost-triangle/README.md`. React was vendored via
`npm pack react@18.3.1 react-dom@18.3.1` (registry.npmjs.org is reachable even where
CDNs aren't).

---

## 8. Reference material (not in the repo)

The original Claude Design export ("Motion graphic mathematics explanation") also
contained: `Lost Triangle.html` (a 744 KB self-contained bundle of the same thing),
`Lost Triangle Mobile.dc.html`, `support.js` (the `dc-runtime` that we intentionally
did **not** ship — the page mounts React directly instead), and per-scene screenshots.
The two `.jsx` files in `assets/lost-triangle/` are the complete source we built from;
you don't need the rest.

> You can delete this `HANDOFF.md` before merging to `main` — it's a working note for
> the branch, not site content.
