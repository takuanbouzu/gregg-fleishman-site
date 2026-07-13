# Handoff — build your own version of the six inserts (Codex)

You're being asked to produce an **independent creative take** on the same six
motion-graphics inserts, from the same constraints. Claude built one version
(shipped in `02_INSERTS/` + `07_DELIVERY/`); treat it as a **reference for the
constraints, not a template to copy**. Diverge on staging, motion, camera,
and composition — the hard requirements below are the only things you must
match exactly (they're what make the masters slot into the video).

Work in a sibling tree so the two versions sit side by side:
`GREGG_MOTION_GRAPHICS/02_INSERTS_codex/INS_0N/insert.html`. Render into
`05_RENDERS/codex/`. Don't overwrite Claude's files.

---

## 1. Everything you need, by path

Read these (all committed under `GREGG_MOTION_GRAPHICS/`):

| What | Path |
|---|---|
| **Source video** (re-drop here first; git-ignored) | `01_SOURCE/video/gregg 1.publer.com.mp4` |
| **Full transcript** (verbatim) | `01_SOURCE/transcripts/full_transcript.txt` |
| **Per-insert transcript + keywords** | `01_SOURCE/transcripts/INS_0N.md` |
| **Authoritative window timing** (frame-exact) | `00_ADMIN/black_frame_intervals.csv` |
| **Content spec** (what each insert teaches) | `00_ADMIN/cue_sheet.csv` |
| **Creative spine** (arc, motifs, plant→payoff) | `00_ADMIN/FULL_LESSON_CONCEPT.md` |
| **Why the content is what it is** | `00_ADMIN/NARRATIVE_CORRECTION.md` |
| **Source media properties** | `00_ADMIN/media_probe.md` |
| **Claude's build spec** (the contract, verbatim) | `00_ADMIN/HANDOFF-CODEX-EXECUTION.md` |
| **Claude's reference implementation** (study, don't copy) | `02_INSERTS/INS_0N/insert.html`, `02_INSERTS/shared/insert-kit.js` |
| **The site's geometry engines to draw from** | repo root: `truncated-octahedron.html`, `rhombic-dodecahedron.html`, `explore.html`, `rhombic-system.html`, `assets/lost-triangle/` |
| **Vendored Three.js r160** | `assets/vendor/three-0.160.0/three.module.js` |
| **Design tokens / palette** | `assets/gf-tokens.css`, `assets/gf-scene.js` (`GF_SCENE.dark`) |

## 2. Hard requirements (must match — these are non-negotiable)

- **Resolution 848×448, fps exactly 30000/1001.** Match `media_probe.md`.
- **Frame counts, per insert, exact:** INS_01 230 · INS_02 214 · INS_03 611 ·
  INS_04 367 · INS_05 188 · INS_06 464 (from `black_frame_intervals.csv`).
- **First and last frame pure black** (`max luma 0`) — clean cut into/out of
  the black windows, no flash frames.
- **The deterministic-clock contract:** expose `window.INSERT` with a pure
  `seek(frame)` (no wall-clock, no RNG, no accumulated state),
  `preserveDrawingBuffer:true`, and `ready`. Full spec:
  `02_INSERTS/shared/insert-contract.md`. This is what lets the shared
  renderer (`00_ADMIN/render_insert.mjs`) capture you frame-exact — reuse it
  as-is; point it at your page.
- **Real 3D:** `THREE.PerspectiveCamera`, visible depth/parallax, ground grid
  + labeled orientation. Not flat 2D diagrams.
- **Audio untouched, geometry computed** (never eyeball coordinates), **no
  proprietary font files.** Same brief rules Claude worked under
  (`00_ADMIN/handoff_original/CLAUDE.md`).

## 3. The content, per insert (match the teaching; own the execution)

Quotes are verbatim; the "must convey" is the fixed teaching point. How you
stage it is yours.

- **INS_01** — *"you have a 45 degree angle, and we bring those two things
  together, the resulting angle is 120 degrees."* Convey: two 45° cuts join
  to 120°, and it's a 3D fold (flat, two 45°s make 90°; the 120° needs the
  join to leave the plane).
- **INS_02** — *"primarily truncated octahedrons, which is new for me. I've
  spent 10 years working with the rhombic dodecahedron."* Convey: the two
  solids, the new one vs. the long-familiar one.
- **INS_03** (hero, 20 s) — *"there's only three things that fill space
  infinitely on their own. One is a cube. One is a rhombic dodecahedron,
  which is like two cubes in a 3D checkerboard. And the other is a truncated
  octahedron."* Convey: the three cubic space-fillers, RD built explicitly as
  two interpenetrating cube lattices, each shown tiling.
- **INS_04** — *"we have the Platonic solids… But I focus only on the cubic
  family."* Convey: five Platonic solids → keep tetra/octa/cube.
- **INS_05** — *"those things translate into the Archimedean solids when you
  cut off all of their points."* Convey: truncate an octahedron's corners →
  the TO. The end state must equal the true truncated octahedron.
- **INS_06** — *"the rhombic dodecahedron… And lately the truncated
  octahedron. Both of them fill space with small parts."* Convey: both
  networks packing space, recap.

## 4. Math facts (verified — safe to rely on, don't re-derive)

- Truncated octahedron = the 24 signed permutations of (0, ±1, ±2)·k. All 36
  edges are ⟨1,1,0⟩ face-diagonal directions, **exactly 45°** to the cube
  axes; adjacent edges meet at **exactly 120°** (cos = −½).
- Faces: 8 hexagons on the ⟨1,1,1⟩ (√3) corner directions, 6 squares on the
  ⟨1,0,0⟩ (1) axes. The three direction families are the 1 : √2 : √3 ladder.
- √2² + 1² = 3 — the ladder closes onto the cube's space diagonal
  (arctan √2 = 54.74°): the "Lost Triangle."
- "Only three space-fillers": correct **within the cubic-symmetry family** —
  cube, RD, TO are the three cubic-symmetry parallelohedra of Fedorov's five.
  Don't caption it as the only three in all geometry. See
  `NARRATIVE_CORRECTION.md`.
- Parametric corner-truncation for INS_05: cut each octahedron vertex back by
  `u/3` along its edges; `u=1` lands on the TO exactly. (Claude's
  `insert-kit.js::truncationWirePositions` is one implementation — reimplement
  your way.)

## 5. Render + validate (reuse Claude's harness)

```bash
# from the repo root
python3 -m http.server 8741 &
node GREGG_MOTION_GRAPHICS/00_ADMIN/render_insert.mjs \
  "http://localhost:8741/GREGG_MOTION_GRAPHICS/02_INSERTS_codex/INS_03/insert.html" \
  GREGG_MOTION_GRAPHICS/05_RENDERS/codex --name INS_03 --prores
```

The harness gates on frame count (exits non-zero on mismatch/page error). Then
build a review cut by pointing a copy of `build_review_cut.sh` at
`05_RENDERS/codex/`. A master isn't done until it reports `EXACT ✓` and its
endpoints measure black.

## 6. Deliver alongside, don't replace

Put your version in `02_INSERTS_codex/` + `05_RENDERS/codex/`, write a short
`05_RENDERS/codex/NOTES.md` on your creative choices, and open your own PR.
The point is a genuine A/B: same math, same windows, two directors.
