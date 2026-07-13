# The Slim Book — full concept for the complete math lesson

Status: **concept, for sign-off.** Revises the six-insert plan from a set of
isolated fills into chapters of ONE lesson. Changes nothing about timing —
the six windows in `black_frame_intervals.csv` are untouched — it adds the
narrative spine, the motif system, and the plant/payoff structure that makes
the six inserts read as a single piece of teaching.

Companion docs: `HANDOFF-CODEX-EXECUTION.md` (build spec) · `cue_sheet.csv`
(timing) · `NARRATIVE_CORRECTION.md` (why the content is what it is) ·
`../storyboard.html` (visual review).

---

## 1. The lesson in one sentence

> Cut two pieces at 45° — the angle of the square's diagonal — bring them
> together in space, and you get 120° — the angle of the hexagon; that one
> fold generates every shape Gregg builds, and the ladder that climbs from
> the flat world to the spatial one is **1 : √2 : √3 — the Lost Triangle**.

Gregg opens the video: *"Geometry… it's always been a very slim book."* The
whole lesson is one page of that book, read six ways.

## 2. The complete lesson map

The six black windows all fall between 1:00 and 3:17 — but the lesson keeps
going **on camera** afterward. Gregg physically demonstrates in plywood what
the inserts state in pure geometry. This is the full arc:

| Time | Where | What Gregg teaches | Role in the arc |
|---|---|---|---|
| 0:50–1:08 | **INS_01** | 45° + 45° → 120° | **The Rule** — state it abstractly |
| 1:15–1:22 | **INS_02** | truncated octahedron (new) vs 10 yrs of rhombic dodecahedron | **The Protagonists** |
| 1:52–2:12 | **INS_03** | only three things fill space alone: cube, RD (two cubes in 3D checkerboard), TO | **The Family** |
| 2:21–2:33 | **INS_04** | Platonic solids → he keeps only the cubic family (tet, octa, cube) | **The Lineage** |
| 2:38–2:44 | **INS_05** | cut off all their points → Archimedean solids | **The Operation** |
| 3:01–3:17 | **INS_06** | RD network + TO — both fill space with small parts | **The Purpose** |
| 5:30–7:15 | on camera | **the diamond lesson**: unit square → √2 diagonal → rotate → √3 → rotate → equilateral triangle; the in-between diamond "is the key to three-dimensional cubic geometry… the corner-to-corner diagonal through a cube" | **The Proof** — the Lost Triangle, in Gregg's own hands |
| 7:46–9:05 | on camera | six identical plates → tetra/octa space frame, "coincident with the rhombic dodecahedron" | Payoff of CH2/CH3 (RD side) |
| 10:53–11:50 | on camera | the caterpillar: squares hitting corner-to-corner at 45° — *"these two pieces meeting at 45° leave a resulting angle of 120°, and that's what makes the hexagonal space"* | **Payoff of CH1** — the Rule, in plywood |
| 11:55–12:32 | on camera | the node: octahedron + tetrahedron, "the basic structure of space filling" | Payoff of CH3/CH6 |

**The design consequence:** the inserts come *first* in the video and the
physical demos come *after*. So the inserts are the **foreshadowing** and
Gregg's hands are the **proof**. Everything the inserts plant — the 45° cut,
the gold 120° arc, the √-ladder colors, the checkerboard — pays off later
when he picks up the actual plywood. We teach it in light; he proves it in
wood.

## 3. The math backbone (verified numerically — see commit)

These are not loose associations; each link is exact, checked against the
computed truncated-octahedron geometry (vertices = permutations of (0,±1,±2)):

1. **45° is the square's angle.** The diagonal of a unit square meets its
   side at 45° — the 1 : 1 : √2 triangle. Every "45° cut" in Gregg's system
   is a face-diagonal cut.
2. **Every strut in the system runs at exactly 45° to the cube's axes.**
   All 36 edges of the truncated octahedron point along ⟨1,1,0⟩ face-diagonal
   directions — angle to the nearest axis: **45.00°**, by construction.
3. **Any two adjacent struts meet at exactly 120°.** Adjacent hexagon edges,
   e.g. (1,−1,0) and (0,1,−1): cos θ = −½ → **120.00°**. This is Gregg's rule
   — *two 45° pieces → 120°* — realized literally in the solid. And note it
   is only true **in 3D**: in a flat plane two 45° cuts close to 90°; the
   120° emerges because the join folds out of plane (vertex figure
   90° + 120° + 120° = 330° < 360°). This is the deep reason the inserts must
   be 3D scenes, not diagrams.
4. **120° is the hexagon.** The hexagonal faces sit on the cube's ⟨1,1,1⟩
   corner directions — the **√3** family; the squares sit on the ⟨1,0,0⟩ axes
   — the **1** family; the edges on ⟨1,1,0⟩ — the **√2** family. One solid,
   all three rungs of the ladder.
5. **The ladder is the Lost Triangle.** √2² + 1² = 3, so the diagonal ladder
   1 → √2 → √3 that Gregg draws in the diamond lesson (5:51) *is* the
   corner-to-corner diagonal of the cube (rising at arctan √2 = 54.74°) —
   exactly the site's thesis, in his own words: *"the key to
   three-dimensional cubic geometry."*
6. **The family is complete and correctly counted.** Cube, rhombic
   dodecahedron, truncated octahedron are exactly the three of Fedorov's five
   parallelohedra with cubic symmetry (see `NARRATIVE_CORRECTION.md`, math
   check). The RD puts its *faces* on the √2 directions; the TO puts its
   *edges* there — two variations on the same three direction families.

## 4. One world, six windows — the production concept

**A single continuous 3D world.** All six inserts take place in one
persistent dark void (the site's `--bg` near-black) with one ground grid and
one lighting setup. There are no cuts inside or between inserts conceptually
— each insert is the **camera arriving at a new station** of the same world,
the way `truncated-octahedron.html`'s stage stepper already works. The video
returns to Gregg between windows; when it comes back to black, we've moved to
the next station.

**Motif system** (the connective tissue — this is what makes six fills read
as one lesson):

- **The √-ladder palette, worn consistently.** Every length/direction is
  colored by its family, matching the site's tokens exactly: **1** / axis =
  `--geo-unit` bone · **√2** / face-diagonal = `--geo-face` blue · **√3** /
  space-diagonal = `--geo-space` terracotta · every **angle measure** =
  `--geo-angle` gold. When Gregg later draws the diamond at 5:51, the
  audience has already absorbed this color code — his marker lines land on
  primed eyes.
- **The gold arc is a recurring character.** It sweeps the 45° end-cuts and
  the 120° join in CH1; reappears at the truncation planes in CH5; measures
  the hexagon in CH6. Same weight, same easing, every time — the arc *is*
  the lesson's voice.
- **From black, to black.** Each insert's first and last frames are pure
  black (already a hard delivery rule); elevate it to a motif — geometry
  condenses out of the void, teaches, and dissolves back. The void is the
  "slim book"; each window is one page lighting up.
- **The ground grid + axes** persist in every station (brief rule 7),
  drawn in `--tx-faint`, with the three axis labels colored by family (the
  x/y/z axes are the "1" family — bone).
- **The camera is the only editor.** Slow perspective drift/orbit always-on
  (the 3D mandate in the handoff); between-station moves happen off screen
  during Gregg's on-camera passages.

**Plant → payoff table** (what each insert must visibly plant, and where it
pays off on camera — build these correspondences deliberately):

| Insert plants | Pays off on camera at |
|---|---|
| CH1: two struts, 45° cuts, gold 120° arc | 11:38 — caterpillar: "that's what makes the hexagonal space" |
| CH2: TO + RD side by side, "10 years" | 7:46 — the space frame "coincident with the rhombic dodecahedron" |
| CH3: cube / two-cube checkerboard / TO packing | 12:03 — octa+tetra node, "basic structure of space filling" |
| CH4–CH5: cubic family → truncation | 10:53 — "the same truncated octahedron assembly" chairs |
| CH6: both networks tiling from small parts | the entire studio tour — everything he builds IS the tiling |
| all: the √-ladder color code | 5:51 — the diamond lesson, drawn by hand |

## 5. The chapters (revised insert descriptions)

Timing, frames, and quotes are unchanged from `cue_sheet.csv` /
`HANDOFF-CODEX-EXECUTION.md` §3. What's revised: each insert now carries its
arc role and motif duties.

- **CH1 · The Rule (INS_01, 230f).** Out of black: two solid struts condense
  in the void above the grid. Gold arcs sweep their 45° end-cuts. They glide
  together — and visibly fold **out of plane** as they join (the 3D-only
  truth from §3.3) — the gold arc opens to 120°. Hold: the join alone,
  quiet. *Strut orientations must be taken from two adjacent hexagon edges
  of the computed TO so every angle is exact by construction.*
- **CH2 · The Protagonists (INS_02, 214f).** The 120° join from CH1 remains
  on screen a beat, then multiplies — struts propagate into the full
  truncated octahedron wire, faces glaze in (squares bone, hexagons
  terracotta). The rhombic dodecahedron fades up beside it in blue-family
  wire, labeled `10 years`. Two solids, one slow shared orbit.
- **CH3 · The Family (INS_03, 611f — the long one, 20.4s).** Three
  movements, one per space-filler, timed to his enumeration: (i) the cube,
  alone, then tiling; (ii) the RD *built* as two interpenetrating cube
  checkerboards (his exact image), then tiling; (iii) the TO arriving with
  its 14-neighbour BCC packing (already built on the site — re-stage it).
  Gold arc cameo: the cube corner's 90°.
- **CH4 · The Lineage (INS_04, 367f).** Five Platonic solids in a row on the
  grid; the dodecahedron and icosahedron dim to `--tx-faint` ghosts; the
  tetrahedron, octahedron, cube advance and re-light. Labels in Space Mono.
- **CH5 · The Operation (INS_05, 188f).** The octahedron from CH4 center
  stage; gold cut-planes appear at its six vertices (each plane ⊥ a cube
  axis) and slice — corners fall away, hexagons bloom from the triangles,
  the truncated octahedron resolves. The cut is computed, not staged: the
  end state must equal the procedural TO exactly.
- **CH6 · The Purpose (INS_06, 464f).** Two-up finale: RD network tiling out
  on the left, TO packing on the right, both growing from a single small
  part at the center of each half. They fill their halves as the camera
  pulls back; the √-ladder legend (1 · √2 · √3 in family colors) appears
  once, small, bottom center — the only time the code is stated explicitly.
  Fade to black; the video returns to Gregg.

## 6. The seventh chapter — the diamond (not a black window)

The lesson's climax, the diamond/√-ladder construction at **5:51–6:37**,
happens on camera and gets **no insert**. Build the chapter anyway, as a
stretch deliverable after the six masters:

- The site already animates this exact construction (`lost-triangle.html`
  scenes: Root Spiral / Triangle Construction; and
  `lost-triangle-construction.html`) — it's a re-stage, not new work.
- Two uses: (a) if the edit ever changes and a window opens over the diamond
  lesson, the insert is ready; (b) it completes the set for §7.
- Do **not** place it into the current cut — the master audio and picture
  there are Gregg's hands, which is the best possible version of this scene.

## 7. Optional extension — "The Slim Book," standalone

With CH1–CH6 + the diamond chapter, the full lesson exists as ~90s of
finished 3D animation. Recut as a standalone captioned film (no narration —
the source audio stays untouched, per the brief), it becomes a complete
"Gregg's math lesson" piece for the site's Animation section, sitting
naturally beside `lost-triangle.html`. Zero additional scene-building — an
edit + captions pass only. **Decision needed, post-sign-off; not in scope
for the six masters.**

## 8. What this changes for execution

- Nothing in timing, frame counts, or the per-window content mapping.
- Adds binding continuity requirements (§4): one world, persistent grid,
  √-ladder palette, recurring gold arc, from-black/to-black, camera-as-editor.
- CH1/CH5 gain a correctness requirement: derive strut orientations and cut
  planes from the computed TO, so 45°/120° are exact, never staged.
- Build order recommendation: CH1 → CH2 → CH6 → CH3 → CH5 → CH4 (rule and
  finale first — they define the motif system everything else reuses).
- The blocking animatic (Phase 3) should present all six chapters **in
  sequence with Gregg's intervening audio** so the plant/payoff rhythm is
  reviewable — that's the artifact to sign off.
