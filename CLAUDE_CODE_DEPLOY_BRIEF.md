# DEPLOY BRIEF — Gregg Fleishman Legacy Portal
### For Claude Code, run from the repo root. Read this entire file before doing anything.

You are working on a **live, deployed site**. `main` auto-publishes to GitHub Pages (`takuanbouzu.github.io/gregg-fleishman-site/`) on every merge. Your job is to bring the site to its highest polished state **on a branch**, open a PR, and **stop**. You do not merge. A human (Yuto) merges, and only after one human decision (the theme) and one human validation (Gregg's voice) are resolved. Those gates are spelled out in §GATES below and they are not optional.

This is not a rebuild. The site is already good. This is **de-smoothing and finishing** — making it stop reading as AI-made, and fixing the concrete issues listed below.

---

## OPERATING RULES (read first, obey throughout)

1. **Never commit to `main`.** All work on a branch. Open a draft PR. The repo's own `CLAUDE.md` states this; it is a hard rule.
2. **Start in plan mode.** Investigate read-only, produce a written plan, and present it before editing a single file. Do not touch disk until the plan is reviewed.
3. **No build step exists.** This is vendored static HTML/CSS/JS. Do not add npm, bundlers, frameworks, or a `package.json`. Do not "modernize" the stack. Edit the files that are there.
4. **Vendored libs are off-limits.** `assets/vendor/three-*`, `assets/vendor/react-*`, `assets/vendor/gsap-*`, and everything under `vector-pod/` are not yours to edit (vector-pod is compiled from a separate repo). Any "light"/"dark" grep hits inside them are 3D lighting or build artifacts — false positives. Leave them.
5. **Preserve the geometry's exactness.** Every `1 : √2 : √3` relationship in the animations is *computed from a geometric unit*, not eyeballed. Do not "simplify" or hardcode coordinates. The repo has a recorded history of rejecting an eyeballed 45° patch in favor of exact geometry — do not reintroduce that mistake.
6. **Math notation is Gregg's.** Display angles as **35.25° / 54.75°** (his rounding — the doubling stays clean: 2×54.75 = 109.5). If you add a precise-value affordance, put the exact `arctan` values (35.2644° / 54.7356°) behind a hover/toggle. Never silently "correct" his numbers.
7. **Verify by serving over HTTP, never `file://`.** `python3 -m http.server 8000`, then load `http://localhost:8000/`. ES-module import maps fail under `file://`; a blank 3D page means you opened a file path, not the server.
8. **When unsure, stop and ask.** Especially at the two GATES. Do not guess at a human decision to keep momentum.

---

## GATES — the two things you must NOT decide autonomously

### GATE 1 — THEME (blocking, human decides)
The site is currently **dark-only** (void `#070a0b`, parchment `#e5e0d4`, desert gold `#c9a24b`, terracotta √3 `#db684d`, blue √2 `#6f9bc4`). The owner is undecided between keeping dark and moving to a light/paper treatment, and that decision belongs to Gregg's eye, not yours.

- **Do NOT change the palette, theme, or `gf-tokens.css` color values.**
- **Do NOT re-introduce a theme toggle under any circumstances.** A runtime toggle across WebGL contexts is the exact thing that caused a prior cream/gold render bug; it was deliberately removed. Whatever theme is chosen will be **hard-committed at build time, single-theme, no switch.**
- Treat the current dark palette as fixed for this pass. If theme work is wanted later, it's a separate branch after a human decision.

### GATE 2 — VOICE (human-validated, do not invent)
A copy rewrite into Gregg's real first-person voice is provided in `GREGG_voice_rewrite_PATCH.md` (in the repo root). Apply **exactly that copy** — every line is traceable to Gregg's actual Math/About pages. Do **not** write new copy in his voice from scratch; that's how invented quotes happen. If the patch file is not present, **skip all copy changes and say so in the PR** — do not improvise his words.

---

## THE WORK — what to actually do (in this order)

### Phase 0 · Investigate & plan (read-only)
- Map the repo. Confirm the page list, the shared assets (`gf-tokens.css`, `gf-nav.js`, `gf-scene.js`, `gf-theme.js`), and the two nav systems (outer site nav vs. geometry exhibit nav) documented in `CLAUDE.md`.
- Read `CLAUDE.md`, `README.md`, `HANDOFF.md`, `HANDOFF-light-theme-removal.md` in full — they encode decisions already made; honor them.
- Produce a written plan of the edits below, with the exact files and the diff intent for each. **Present it. Wait for go-ahead before Phase 1.**

### Phase 1 · Create the branch
git checkout main && git pull origin main && git checkout -b polish/deploy
All subsequent work on `polish/deploy`. Commit incrementally with clear messages.

### Phase 2 · Voice (GATE 2 — apply the patch verbatim)
- Apply the copy from `GREGG_voice_rewrite_PATCH.md` to `index.html` and `about.html` exactly as specified. These are copy-only edits — same HTML structure, same classes.
- Commit: `Rewrite index + about copy in Gregg's voice`.

### Phase 3 · Kill the literal AI tells (safe, do autonomously)
1. **The stray magenta fallback triangle.** In `mathematics.html` the loading-state `<svg>` uses `stroke="#ff3ccf"` (hot pink) — a leftover from the Claude Design export. It flashes before React mounts and is not in the palette. Change it to the terracotta token (`#db684d` / `var(--geo-space)`). Check every page's fallback/loading SVG for the same stray pink and fix all of them.
2. **The generic fade-up-stagger cover entrance.** `index.html` uses `@keyframes coverIn { ... translateY(16px) }` with staged `animation-delay` (`.04s … .38s`). This is the default "premium" motion every AI/Framer build ships and it's off-brand against this site's own *drawn-line* motion language. Replace it with an entrance consistent with the site's drafting aesthetic: either a quiet **line-draw / construction reveal** of the hero rule and title, or a calm near-linear fade with **no vertical translate and no staggered cascade**. Keep `prefers-reduced-motion` fully honored (static, no motion). Do not add a heavy animation library — CSS or the existing GSAP only.
3. **Uniform photo dimming.** `about.html` (and portfolio) apply a blanket `filter:brightness(.9)` to every image. Blanket global treatment reads as automated. Remove the global filter; if any single image genuinely needs toning, do it per-image, not site-wide.
4. **Display-font drift.** Confirm the display typeface is consistent. `index.html` loads Syne; the geometry pages load Hanken Grotesk via `--font-display`. Pick the intended display face and make the `--font-display` token + the per-page font links agree, so the cover and the system pages don't show two different display faces. If unsure which is canonical, **flag it in the PR rather than guessing** — lean toward what's used on the most pages.

### Phase 4 · Make the "instrument" real (the de-smoothing that matters most)
The design system *names* itself an engineering instrument (cool void, mono micro-labels, hairline chrome, sharp corners) but the monospace is currently used **decoratively** — as eyebrow/kicker labels — not as **measurement**. Push it from decoration into function on the geometry pages, where it earns the "instrument" claim:
- Where geometry is shown, add **live, computed readouts** in the mono face: the angles (35.25°, 54.75°, 90°), the edge ratios (1 : √2 : √3), coordinate annotations on the vertices. These should read as *calibrated*, not styled.
- On the scrubbable animation pages, surface a **timecode / playhead readout** in mono.
- Keep it quiet and precise — tick-mark energy, not chartjunk. The goal: the mono stops being a "techy accent" and starts carrying data, which is what makes it feel made by a person who measures things.
- **Constraint:** do not alter the underlying geometric computation to do this — read the values that already exist and display them. If a value isn't already computed, compute it from the same geometric unit the figure uses; do not eyeball.

### Phase 5 · Break the evenness (one peak, not a flat line)
AI design betrays itself through perfect uniformity — every section the same padding, the same rhythm, the same 8/10. Give the site **one emotional peak**: the **Lost Triangle reveal** (the moment the triangle's `120°` / the construction lands). Over-invest there — more space, more scale, more weight, a genuine "here it is" beat — and let the quieter pages stay quiet by comparison. Do not make every page louder; make *one* page unmistakably the climax. Use the existing motion + type system; no new dependencies.

### Phase 6 · Cleanup the repo's own listed debt (safe, do autonomously)
From `HANDOFF.md` §5 "Known follow-ups" and `CLAUDE.md`:
- **Orphaned deep-dive pages** not linked from any nav (`fleishman-sequence.html`, `cluster-structures.html`, the `lost-triangle-construction*` pages, `cube-diagonals.html`, etc.): confirm each is intentionally URL-only and either (a) is reachable/consistent or (b) flag any that are dead or broken. Do not delete pages — flag for human call.
- **Duplicate Three.js vendors** (`three-0.160.0/` ESM + `three-r128/` minified both ship). Do **not** migrate r128 pages in this pass (risky, separate effort) — just **document** the duplication in the PR as a known follow-up. Don't silently remove a vendor a page depends on.
- Confirm nav consistency across all pages (outer nav "Geometry → index.html"; geometry nav order identical everywhere) per `CLAUDE.md`'s "Two Navigation Systems".

### Phase 7 · Accessibility & performance pass (safe, do autonomously)
- Verify `prefers-reduced-motion` gives a complete static state on every animated page (the construction should be *fully drawn*, not blank, when motion is off).
- Confirm every image has meaningful `alt` text; every interactive control is keyboard-reachable with a visible focus state.
- Confirm WebGL pages show their graceful "WebGL unavailable" message path intact.
- Confirm the geometry colors meet WCAG AA contrast against the ground; if any label color is too low-contrast on the dark ground, note it (don't change the palette — GATE 1 — but flag it).

### Phase 8 · Verify, then open the PR (do NOT merge)
- Serve over HTTP and load **every** page. Confirm: no console errors, no blank 3D scenes, no magenta flash, dark scenes render dark, animations build and scrub, reduced-motion static states are complete, mobile (≤560px) layouts hold.
- Run a final grep to confirm no theme-toggle remnants or stray pink:
  grep -rn "gfThemeToggle\|data-theme=\"light\"\|GF_SCENE.light\|gf-themechange\|#ff3ccf" *.html assets/*.js assets/*.css
  (vendor/ and vector-pod/ excluded) → should be empty.
- Commit, push the branch, open a **draft PR** into `main` with the summary template below.
- **STOP. Do not merge. Hand back to Yuto.**

---

## THE PR SUMMARY (fill this in when you open it)

## Polish pass — Gregg Fleishman Legacy Portal

### Done autonomously (safe)
- Voice: applied GREGG_voice_rewrite_PATCH.md to index + about [or: SKIPPED — patch not present]
- Killed AI tells: magenta fallback → terracotta; replaced fade-up-stagger cover entrance with [drawn reveal / flat fade]; removed blanket photo brightness filter; unified display font
- Instrument: added live mono readouts (angles, ratios, coords, timecode) on geometry pages
- Peak: over-built the Lost Triangle reveal as the site's one climax
- A11y/perf: reduced-motion static states verified; alt text / focus states confirmed
- Repo debt: nav consistency confirmed; [list anything flagged]

### NOT done — needs human decision (GATES)
- THEME (Gate 1): left dark as-is. Light/paper treatment awaits Gregg's call. No toggle reintroduced.
- VOICE (Gate 2): copy applied verbatim from patch; Gregg should confirm the About pull-quote reads as his.

### Flagged for human (did not change)
- [duplicate Three.js vendors / any orphaned-broken page / any low-contrast label / font canonical-choice]

### Verification
- Served over http://localhost:8000, all pages loaded, no console errors, grep clean.

**Do not merge until: (1) Gregg has seen the voice, (2) the theme decision is made.**

---

## WHY THE GATES EXIST (so you don't rationalize past them)

This site is one architect's legacy — his name, his fifty years, his words. The two things you must not decide alone are precisely the two things that make it *his*: how it looks (his eye) and how it sounds (his voice). Everything else on this list — the magenta bug, the generic motion, the decorative mono, the flat evenness — is craft you can fix confidently. But shipping a theme he hasn't chosen, or words he hasn't blessed, to a live site, is the one failure that can't be undone quietly. Do the craft. Hold the gates. Open the PR. Let the human merge.
