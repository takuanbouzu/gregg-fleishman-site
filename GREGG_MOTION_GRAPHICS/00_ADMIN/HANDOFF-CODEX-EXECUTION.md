# Handoff — build the six inserts (Phases 3–7)

For: whoever picks up execution next (Codex or otherwise).
From: Claude, on `claude/gregg-motion-graphics-mediaprep` (PR #54, draft, not part of the Pages site).
State as of this handoff: **media-prep + content mapping done. Nothing has been animated yet.**

Read in this order before touching anything: this file → `FULL_LESSON_CONCEPT.md`
(the creative spine — arc, motif system, plant/payoff structure; its §4 continuity
requirements and §8 execution deltas are binding) → `NARRATIVE_CORRECTION.md` →
`cue_sheet.csv` → `../storyboard.html` (open it in a browser — it's the visual reference,
built in the site's real design system) → `media_probe.md` → `black_frame_intervals.csv`.

---

## 1. What's already decided (don't re-litigate)

- **Render path: HTML/Canvas**, driven by the site's existing vendored Three.js r160 +
  GSAP, reusing the site's *already-computed* geometry engines. Not Blender (ruled out —
  CPU-only headless render in the prior sandbox wasn't worth pursuing), not After Effects
  (can't run on Linux at all).
- **Content: transcript-grounded, not the original Studio Zenbu brief.** The brief's
  storyboard (`handoff_original/README.md`) was written without the transcript and
  describes the wrong lesson for all six windows — see `NARRATIVE_CORRECTION.md` for the
  full diff. `cue_sheet.csv` is the corrected, authoritative content spec. Build to it,
  not to the archived brief.
- **Source properties**: 848×448 HEVC, 29.970 fps (30000/1001), 770.737 s, AAC audio —
  confirmed in `media_probe.md`. The archived brief says 640×360/H.264; that's wrong,
  ignore it.
- **Timing**: `black_frame_intervals.csv` has the frame-accurate authoritative windows
  (ffmpeg `blackdetect`, cross-checked against PyAV). `cue_sheet.csv`'s `start_frame`/
  `end_frame` columns already use these corrected numbers.
- **Stray blips** (4:10, 4:18, 9:35): default assumption is **leave them black, build no
  graphics for them** — they read as edit artifacts, not intentional pauses. This is
  still nominally open (`open_questions.md` #4) but shouldn't block the six primary
  inserts; flag it back rather than guessing if it turns out to matter.
- **Everything renders as true 3D, not flat 2D diagrams.** All six inserts are real
  WebGL scenes with a perspective camera, depth, and (ideally) a slow orbit/parallax
  drift — matching how every geometry page on this site already presents solids. This
  applies even to shots that could be faked as a flat drawing: INS_01's 45°/120° strut
  join is two 3D struts hinging in space with a ground grid under them, not a 2D line
  diagram; INS_05's corner-truncation is a real solid getting its corners cut away in
  3D, not a 2D cross-section animation. If a shot looks like an SVG/canvas illustration
  rather than something you could orbit around, it's wrong — rebuild it as a scene.

## 2. What still needs a human yes before final render

The six-insert content mapping below has **not been explicitly signed off by Yuto/Gregg**
in writing — it's Claude's transcript-grounded read, presented for review in
`storyboard.html`. Build the **blocking animatic** (Phase 3 — low-fidelity, correct
timing and content, rough geometry) freely; treat that as the review artifact. Get an
explicit yes before spending time on Phase 5–6 polish. If the reply changes any mapping,
that's a `cue_sheet.csv` edit, not a re-architecture.

## 3. The six inserts

All quotes are verbatim from `01_SOURCE/transcripts/full_transcript.txt`. Full detail —
per-insert transcript, proposed beats, caption text — is in
`01_SOURCE/transcripts/INS_0*.md` and `cue_sheet.csv`; this table is the map, not the
territory. **The six are chapters of one lesson, not isolated fills** — arc roles,
the shared motif system (one persistent world, √-ladder palette, recurring gold arc,
from-black/to-black), and the plant/payoff links to Gregg's on-camera demos are
specified in `FULL_LESSON_CONCEPT.md` §4–5 and are binding on the build.

| # | Window (source tc) | Frames (29.97fps) | Dur | Gregg says | Build this | Nearest existing site scene(s) to re-stage |
|---|---|---|---|---|---|---|
| 01 | 1:00.69–1:08.37 | 1819–2049 | 230f / 7.67s | "you have a 45 degree angle, and we bring those two things together, the resulting angle is 120 degrees" | **3D scene**, not a 2D diagram: two solid struts in space, each end-cut at 45°, hinge together on a ground grid while an orbiting camera holds a 3/4 view; a gold arc sweeps open to 120° with a live angle-value label. | New — small scene. Nearest ref for the 45° arc treatment: the angle-arc/label pattern in `truncated-octahedron.html`'s legend (`--geo-angle` gold arcs + label sprites), and its camera/orbit rig. |
| 02 | 1:15.38–1:22.52 | 2259–2473 | 214f / 7.14s | "primarily truncated octahedrons, which is new for me. I've spent 10 years working with the rhombic dodecahedron" | Truncated octahedron rotates in; rhombic dodecahedron fades in beside it, labeled "10 years". | `truncated-octahedron.html` (hero solid) + `rhombic-dodecahedron.html` (companion solid) — both already computed, r160 ESM. |
| 03 | 1:52.15–2:12.53 | 3361–3972 | 611f / 20.39s | "there's only three things that fill space infinitely on their own. One is a cube. One is a rhombic dodecahedron, which is like two cubes in a 3D checkerboard. And the other is a truncated octahedron" | The three space-fillers appear one at a time: cube; rhombic dodeca built explicitly as two cubes in a checkerboard; truncated octahedron. Each shown tiling/packing. **Math-checked** (see `NARRATIVE_CORRECTION.md`): these are exactly the three of Fedorov's five parallelohedra that have cubic symmetry — Gregg's "three" is precise, not a simplification. If a caption states the count, keep it scoped ("three" as spoken); don't caption it as the only three space-fillers in all of geometry. | `rhombic-system.html` (checkerboard framing) + `truncated-octahedron.html`'s 14-neighbour BCC packing animation (already built — literally this shot). |
| 04 | 2:21.21–2:33.45 | 4232–4599 | 367f / 12.24s | "we have the Platonic solids... But I focus only on the cubic family within these Platonic solids" | Five Platonic solids in a row; three dim out, leaving the cubic family (tetrahedron, octahedron, cube) lit. | `explore.html`'s characteristic-tetrahedra assembly (The Cube tab) — has the tetrahedron/octahedron/cube family already built with fat-line edges. |
| 05 | 2:38.49–2:44.77 | 4750–4938 | 188f / 6.27s | "those things translate into the Archimedean solids when you cut off all of their points" | A cube (or octahedron) has its corners sliced away live, resolving into a truncated (Archimedean) solid. | `truncated-octahedron.html` is literally the end-state of this cut — its procedural-geometry build (24 signed permutations, computed from one edge length) is the source of truth for the truncation math; animate the corner-cut as a new lead-in to that existing solid. |
| 06 | 3:01.98–3:17.46 | 5454–5918 | 464f / 15.48s | "the rhombic dodecahedron, this cubic checkerboard network. And lately the truncated octahedron. Both of them fill space with small parts" | Rhombic dodeca network and truncated octahedron packing side by side, both tiling out from small repeated parts — a recap composite of 02/03. | Same packing animation as #03, recomposed as a two-up. |

**Runtime total: 69.20 s / 2,074 frames across the six primaries**, at 29.970 fps.

Every one of the six ideas above is geometry the site has **already computed exactly**
(1 : √2 : √3 edge/face-diagonal/space-diagonal, procedural vertex construction — never
eyeballed coordinates). This is re-staging and re-timing existing scenes to Gregg's exact
words, not modeling from scratch. Where a shot needs something genuinely new (the 45°→120°
hinge in #01, the live corner-truncation in #05), build it the same way: computed from one
edge length, not hand-tuned coordinates.

## 4. Technical build pattern

Follow the site's established conventions (`CLAUDE.md` in the repo root — read it) so
these inserts look and behave like the rest of the site, not like a bolt-on:

- Three.js r160 ESM via the vendored import map (`assets/vendor/three-0.160.0/`), or GSAP
  (`assets/vendor/gsap-3.12.5/`) for timeline choreography — whichever an existing scene
  already uses. No CDN, no npm, nothing un-vendored.
- Colors from `GF_SCENE.dark` (`assets/gf-scene.js`) — `--geo-unit` (edge/axis),
  `--geo-face` (√2/edge-diagonal), `--geo-space` (√3/space-diagonal), `--geo-tri` (root
  triangle), `--geo-angle` (angle measures, gold). These six inserts are exactly the kind
  of content those tokens exist for.
- `renderer.outputColorSpace = THREE.SRGBColorSpace`, `renderer.toneMapping =
  THREE.NoToneMapping` — site convention, avoids the historical color-space bugs noted in
  `CLAUDE.md`'s Common Pitfalls.
- **Ground grid + labeled X/Y/Z axes** on every spatial scene, **beginner-friendly
  annotations** on every operation shown — both are hard requirements carried over from
  the original brief (`handoff_original/CLAUDE.md` rules 7–8) and still apply.
- **Perspective camera + orbit/parallax, every insert.** Use `THREE.PerspectiveCamera`
  (not orthographic, not a 2D canvas context) and give the camera a slow autorotate or
  drift like the deep-dive pages already do (`rhombic-dodecahedron.html`'s `az/el/rad`
  eased-lerp pattern is the reference). A viewer should read depth and be able to
  imagine walking around the object — that's the whole reason this project reuses the
  site's 3D engines instead of hand-drawing flat explainer graphics.
- Each insert's timeline must be driven by a **deterministic clock**, not wall-clock time
  — i.e. `renderScene(frameIndex)` / `stage.seek(t)` rather than `requestAnimationFrame`
  reading `Date.now()`. This is what makes frame-accurate capture possible (§5) and is
  exactly the pattern `assets/lost-triangle/animations.jsx`'s `Stage`/`useTime` already
  uses — copy that approach rather than inventing a new one.

### Where to put the work
```
GREGG_MOTION_GRAPHICS/
├── 02_INSERTS/                  # NEW — create this
│   ├── INS_01/
│   │   ├── insert.html          # standalone page, self-contained, deterministic clock
│   │   ├── insert.jsx           # if React/Stage-pattern; transpile per repo convention
│   │   └── notes.md             # what changed vs. the table above, any VERIFY_WITH_YUTO_GREGG flags
│   ├── INS_02/ … INS_06/  (same shape)
│   └── shared/                  # cross-insert helpers (axis/grid utility, label sprites,
│                                 # the deterministic-clock harness) if more than one insert needs them
├── 00_ADMIN/render_manifest.md  # NEW — one row per insert: frame range, fps, source HTML path, render date, checksum
```
Keep each insert's **source HTML/JS as the primary deliverable** — that's what "editable"
means here (brief rule 9). The rendered video is a derived artifact, reproducible from
the source the same way `01_SOURCE/clips` etc. are reproducible from
`00_ADMIN/extract_media.py`.

## 5. Rendering exact-duration masters — BUILT AND PROVEN

The render path is no longer a plan; it's working code, validated end-to-end
(see `render_manifest.md`, PIPELINE_TEST row — `EXACT ✓`, 60/60 frames,
2.002000 s, pure-black endpoints, real-3D mid-frame):

1. Implement the page against the deterministic-clock contract:
   **`02_INSERTS/shared/insert-contract.md`** (`window.INSERT` with pure
   `seek(frame)`, `preserveDrawingBuffer`, 848×448, black first/last frames).
   Working reference implementation: `02_INSERTS/_pipeline_test/insert.html`
   (a computed truncated octahedron on the ground grid — copy its skeleton).
2. Serve the repo root (`python3 -m http.server 8741`) and run
   **`00_ADMIN/render_insert.mjs`**: it steps the clock frame-by-frame via
   Playwright, screenshots each frame, encodes with
   `ffmpeg -framerate 30000/1001` (`--prores` → ProRes 422 HQ; default H.264
   crf16 for review), then **gates on ffprobe**: any page error or frame-count
   mismatch exits non-zero. A master without `EXACT ✓` does not ship.
3. Frame counts per insert: 230 / 214 / 611 / 367 / 188 / 464
   (`black_frame_intervals.csv`), resolution 848×448 to match the source
   encode (`media_probe.md`).
4. **Do not touch the source audio.** These are silent visual inserts; the
   narration underneath is untouched master audio, out of scope here.
5. Every render appends a row to `00_ADMIN/render_manifest.md` — same spirit
   as `extract_media.py` being the reproducible record for Phase 0–1.

## 6. Verification before calling an insert done

- **Rendered as a real 3D perspective scene** — depth and parallax visible on camera
  drift/orbit, not a flat 2D/orthographic illustration. If you can't tell the camera
  moved between the first and last frame, that's a fail — reject and rebuild.
- Frame count matches the table in §3 exactly.
- No proprietary font files added — the site's Google Fonts links (Hanken Grotesk / Space
  Mono / Syne / Cormorant Garamond, per page) cover everything; if a new face is genuinely
  needed, record the name + fallback in `notes.md`, don't vendor a font file.
- Ground grid + axes present and labeled on spatial scenes; captions/annotations legible
  at the insert's native resolution.
- Colors pulled from `GF_SCENE.dark`, not hardcoded hex.
- Screenshot review of first/mid/last frame — no popping, no unintended black frames.
- Anything uncertain about the underlying geometry gets `VERIFY_WITH_YUTO_GREGG` in
  `notes.md` and `open_questions.md` — do not silently guess at geometry, per the original
  brief's rule 2 (still binding).

## 7. Branch discipline

Everything lands on `claude/gregg-motion-graphics-mediaprep` (PR #54), which is separate
from the Pages-deployed site work on `claude/lost-triangle-animation-math-vudrm9` (PR
#52). Don't cross-pollinate — this tree is explicitly **not part of the GitHub Pages
deploy** (see the top-level `GREGG_MOTION_GRAPHICS/README.md`).
