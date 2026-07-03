# HANDOFF — Branch Consolidation & Site Cleanup (June 2026)

This document records the consolidation pass that made `main` the single
source of truth and trimmed back-end weight. It supersedes earlier HANDOFF
notes carried in from feature branches.

---

## 1. What was done

### Goal
"Pull all the latest builds, make `main` truly main, and clean up the site to
be efficient / light on the back end." Decisions confirmed with the owner:
**fold in all branches**, **delete merged-only branches**, **safe cleanup**.

### Result
All outstanding feature branches were folded into one consolidated line on top
of **Official V2** (`official-v2-working`, PR #9), which was the newest and most
complete branch. Official V2 is the **canonical spine** — where two branches
disagreed, V2's decision was kept.

Consolidated branch: `claude/loving-sagan-08r0vp` → opened/updated as a PR into
`main`.

---

## 2. Branches and how each was handled

| Branch | Status before | Action |
|---|---|---|
| `official-v2-working` (PR #9) | newest, strict superset of `main` (+4) | **Base / canonical spine** — fast-forwarded onto it |
| `claude/affectionate-bohr-mozto3` | 3 commits, all already in V2 | Absorbed by V2 (no-op) |
| `claude/youthful-shannon-uhai7q` | dead-bloom cleanup + CLAUDE.md | Merged; content already present, no net change |
| `claude/wonderful-gauss-rdeptx` | eyeballed 45° construction patch | Merged but **V2 kept** — V2 replaced this with *exact* geometry (commit "Fix unit square geometry"). The eyeballed patch was deliberately superseded. |
| `claude/fervent-mendel-hb7kk9` | HANDOFF.md note | Merged |
| `claude/lucid-wozniak-btvk47` | original Lost Triangle motion-graphic work | Merged; V2 already evolved from it |
| `claude/mobile-animation-sizing-ozf74t` | mobile-friendly animation tweaks | Merged |
| `claude/dazzling-galileo-dfi8wz` | **deletes** `construction.html`, strips Construction nav, adds 3.7 MB `.3dm` | Merged with **V2 kept** for `construction.html` (modify/delete conflict resolved in favor of keeping the page). Its nav simplification was adopted site-wide. The 3.7 MB binary was removed (see §4). |

### Branches that were already fully merged (safe to delete)
- `Vector-House-Design-System` — 0 commits ahead of `main`
- `takuanbouzu-patch-1` — 0 commits ahead of `main`
- plus every `claude/*` branch above, once this PR merges

---

## 3. Key resolution: the nav architecture fork

Two branches pulled the site in opposite directions:

- **V2 direction:** keep `construction.html`, keep `mathematics.html` as a nav
  entry, multi-stage sidebar.
- **galileo direction:** drop `construction.html` from nav, route **"The Lost
  Triangle" → `lost-triangle.html`** (the animated motion graphic), with
  `mathematics.html` as the readable no-JS fallback.

Folding both together initially left an **incoherent nav** — every page used
galileo's scheme except `construction.html`, which still showed an orphan
"Construction" tab and pointed Lost Triangle at `mathematics.html`.

**Resolution (canonical, now consistent across all HTML pages):**
- Geometry nav bar: `Gregg Fleishman · The Lost Triangle · Animation · The Cube · Research · Rhombic System`
- `lost-triangle.html` is the canonical animated Lost Triangle page.
- `mathematics.html` is the readable fallback, linked from prose/no-JS notices
  (index hero, fallback messages) — intentionally, not from the nav bar.
- `construction.html` is retained as an **orphaned deep-dive** (reachable by URL,
  active nav context = The Lost Triangle), matching the pattern documented in
  `CLAUDE.md` for other deep-dive pages.

---

## 4. Back-end / efficiency cleanup (safe — no visual or behavior change)

- **Removed** `assets/sources/GREG_TRIANGLE_BASE_DRAWING.3dm` (**3.7 MB** CAD
  source). It was not referenced by any HTML/JS/CSS — pure deployed-site dead
  weight. The earlier grep hit was a false positive (an unrelated internal
  string `"vertor pod whole unit.3dm"` inside the compiled vector-pod bundle).
  If the CAD source needs version control, keep it in a separate repo or Git LFS
  rather than the Pages-deployed tree.
- Tracked files dropped from ~10 MB to **~6.5 MB**.

### Deliberately kept
- `assets/sources/lost-triangle-starting-lines.svg` (2 KB) — small, useful
  source reference.
- `assets/lost-triangle/*.jsx` (~64 KB) — editable dev-sources for the compiled
  `animations.js` / `lost-triangle-video.js`. Not fetched at runtime, so they
  add no page weight; keeping them preserves the source of truth.

---

## 5. Known follow-ups (not done — out of "safe cleanup" scope)

- **Duplicate Three.js vendors:** `three-0.160.0/` (1.3 MB ESM) and
  `three-r128/` (592 KB minified) both ship. The r128 pages
  (`cube-diagonals`, `dorman-luke`, `rhombic-dodecahedron`, `rhombic-system`,
  `fleishman-vector-system`, `vector-house`) use the global `THREE`; migrating
  them to r160 would let r128 be dropped, but that is a real refactor with
  visual-regression risk. Left as-is.
- `vector-pod/assets/index-DaQgZgkb.js` (1.9 MB) is a pre-compiled Vite bundle
  whose source lives in a separate repo (per `CLAUDE.md`). Not editable here.

---

## 6. Verification done
- No conflict markers remain in any tracked file.
- No page links to a non-existent target; `construction.html` is intentionally
  unlinked (deep-dive).
- All geometry nav bars resolved to the same canonical scheme.
