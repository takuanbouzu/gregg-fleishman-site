# HANDOFF — Remove the light theme (dark-only simplification)

**Status: ✅ DONE (June 2026).** The light theme was fully removed and the geometry nav was
restructured in the same pass (see below). Verified: no `data-theme`/`gfThemeToggle`/
`gf-themechange` remnants; all pages serve HTTP 200 with the nav intact and no toggle button.
This section is kept as a record; the spec below documents what was done.
**Branch:** `claude/remove-light-theme` (do NOT work on `main` — Pages deploys from it).

**Also done in this pass (nav restructure):** the geometry nav now follows the learning
journey **scroll → animation → model**:
`Gregg Fleishman · The Lost Triangle (→ mathematics.html) · Animation (→ lost-triangle.html) · The Cube (→ explore.html) · Research · Rhombic System`,
identical across geometry pages. Outer nav unified to "Geometry → index.html". See
`CLAUDE.md` → "Two Navigation Systems" for the canonical reference.

## Goal (owner's words)
> "Get rid of the light theme, it seems to cause glitches. Bring in some simplicity but keep it Gregg Fleishman."

The site is already **dark-only by intent**, but the light theme was only *neutered*, not removed — the toggle button, the localStorage flip, a full light WebGL palette, and ~13 `onChange(reload)` listeners are all still live. That half-state is the likely glitch source (e.g. a stored `gf-theme=light` makes WebGL clear-colors go cream/gold). Fully remove it; keep the dark "Gregg Fleishman" look (the void-black + parchment + desert-gold tokens) exactly as-is.

## Keep the aesthetic — do NOT touch
- `assets/gf-tokens.css` dark `:root` values (`--bg`, `--tx`, `--accent`, all `--geo-*`). These ARE the Gregg Fleishman look.
- The `GF_SCENE.dark` palette values.
- Any vendor files: `assets/vendor/three-*`, `vector-pod/**` (grep matches there are "light" = 3D lighting, false positives).

## Scope (exact)

### 1. Toggle button — remove from all 20 pages
Identical 4-line block (`id="gfThemeToggle"`), e.g. `explore.html:419-422`, `index.html:183-186`:
```html
  <button class="gf-toggle" id="gfThemeToggle" type="button" aria-label="Switch to light mode">
    <svg class="i-moon" ...>...</svg>
    <svg class="i-sun" ...>...</svg>
  </button>
```
Pages: about, cluster-structures, construction, contact, cube-diagonals, dorman-luke, explore, fleishman-sequence, fleishman-vector-system, index, lost-triangle, lost-triangle-construction, lost-triangle-construction-3d, lost-triangle-motion, mathematics, portfolio, rhombic-dodecahedron, rhombic-system, store, vector-house. (Confirm each block is byte-identical first; remove the whole `<button>…</button>`.)

### 2. `assets/gf-theme.js` — gut to a dark-only stub
Currently: reads/writes `localStorage['gf-theme']`, flips `data-theme`, wires the toggle, fires `gf-themechange`. Replace with a tiny file that just sets `theme-color` meta to dark and exposes a **no-op back-compat API** so callers don't crash:
```js
window.gfTheme = { get: function(){ return 'dark'; }, set: function(){ return 'dark'; }, toggle: function(){ return 'dark'; } };
```
Keep the `<script src="assets/gf-theme.js">` includes in place (avoids editing 20 heads); just make the file inert. Optionally `localStorage.removeItem('gf-theme')` once to clear stale state.

### 3. `assets/gf-scene.js` — drop the light palette
- Delete the entire `light: { … }` object.
- Make `name()` always return `'dark'` and `active()` always return `this.dark` (keeps the 8 `GF_SCENE.active()` callers working — see below; do NOT delete `.dark`).
- `onChange` can become a no-op (the `gf-themechange` event will never fire again). `reload` can stay or go.

### 4. `assets/gf-tokens.css` — remove light remnants
- Line ~74: `:root[data-theme="light"]{ color-scheme:dark; }` and its comment block (~72).
- Lines ~149-168: the `.gf-toggle`, `.gf-toggle:hover`, `.gf-toggle svg`, `.i-sun`, `.i-moon` rules (button is gone).
- Line ~217: the `html.gf-nav-ready #gfnav .gf-toggle{…}` nav rule.
- Header comment line ~11 mentioning light mode.

### 5. Dead `GF_SCENE.onChange(GF_SCENE.reload)` calls — remove
Now inert (event never fires). Single-line removals in: cluster-structures:159, cube-diagonals:150, dorman-luke:347-349 (a function form), explore:660 & 1243, fleishman-sequence:137, fleishman-vector-system:212, lost-triangle-construction-3d:99, rhombic-dodecahedron:104, rhombic-system:92, vector-house:77.

### 6. `index.html` — remove the iframe theme-driver (lines ~222-242)
The `<script>` that syncs the hero iframe's `gfTheme` and listens to `gf-themechange`. With no toggle it's dead — delete the whole block.

### `GF_SCENE.active()` callers (leave working via step 3)
cluster-structures:152, fleishman-sequence:130, dorman-luke:346/351, lost-triangle-construction-3d:96, rhombic-dodecahedron:103, vector-house:76, rhombic-system:91. These keep working because `active()` returns `.dark`. (Optional polish: rewrite each to `GF_SCENE.dark` per the CLAUDE.md convention, but it's not required.)

## Recommended order
Shared files first (2,3,4) → then per-page (1,5,6) → verify. Doing shared first means each page edit is verified against the final palette.

## Verify
- `python3 -m http.server 8000`, open every page; confirm dark, no toggle, no console errors, WebGL scenes render in dark (no cream/gold background).
- `grep -rn "gfThemeToggle\|data-theme=\"light\"\|GF_SCENE.light\|gf-themechange" *.html assets/*.js assets/*.css` → should be empty (vendor/vector-pod excluded).
- Clear `localStorage` and hard-reload to confirm no stale-light glitch.

## Also note
- `CLAUDE.md` and `README.md` were updated this session (commands section, dark-only wording, stale-page fixes) and are committed on this branch. After this work, update the theming sections of both to say "light theme fully removed" (drop the "neutered/kept-for-parity" language).
- Open a **draft PR** into `main`; don't push to `main` directly.
