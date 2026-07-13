# Handoff — build the six inserts (Phases 3–7)

For: whoever picks up execution next (Codex or otherwise).
From: Claude, on `claude/gregg-motion-graphics-mediaprep` (PR #54, draft, not part of the Pages site).
State as of this handoff: **media-prep + content mapping done. Nothing has been animated yet.**

Read in this order before touching anything: this file → `NARRATIVE_CORRECTION.md` →
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
territory.

| # | Window (source tc) | Frames (29.97fps) | Dur | Gregg says | Build this | Nearest existing site scene(s) to re-stage |
|---|---|---|---|---|---|---|
| 01 | 1:00.69–1:08.37 | 1819–2049 | 230f / 7.67s | "you have a 45 degree angle, and we bring those two things together, the resulting angle is 120 degrees" | Two struts, each cut at 45°, hinge together; arc sweeps open to 120°. | New — small scene. Nearest ref for the 45° arc treatment: the angle-arc/label pattern in `truncated-octahedron.html`'s legend (`--geo-angle` gold arcs + label sprites). |
| 02 | 1:15.38–1:22.52 | 2259–2473 | 214f / 7.14s | "primarily truncated octahedrons, which is new for me. I've spent 10 years working with the rhombic dodecahedron" | Truncated octahedron rotates in; rhombic dodecahedron fades in beside it, labeled "10 years". | `truncated-octahedron.html` (hero solid) + `rhombic-dodecahedron.html` (companion solid) — both already computed, r160 ESM. |
| 03 | 1:52.15–2:12.53 | 3361–3972 | 611f / 20.39s | "there's only three things that fill space infinitely on their own. One is a cube. One is a rhombic dodecahedron, which is like two cubes in a 3D checkerboard. And the other is a truncated octahedron" | The three space-fillers appear one at a time: cube; rhombic dodeca built explicitly as two cubes in a checkerboard; truncated octahedron. Each shown tiling/packing. | `rhombic-system.html` (checkerboard framing) + `truncated-octahedron.html`'s 14-neighbour BCC packing animation (already built — literally this shot). |
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

## 5. Rendering exact-duration masters

The deterministic-clock pattern in §4 makes this mechanical:

1. Serve the insert locally (`python3 -m http.server`, matches the rest of the repo).
2. Drive it with a headless browser (Playwright is already available in this environment
   — see the repo's other verification scripts for the pattern) stepping the deterministic
   clock frame-by-frame at `1/29.97s` per step, screenshotting each frame to PNG.
3. `ffmpeg -framerate 30000/1001 -i frame_%05d.png ... INS_0N_master.mov` (ProRes 4444 if
   the insert needs alpha to composite over anything; otherwise ProRes 422 / high-bitrate
   H.264 is fine for a review-cut master).
4. **Frame count must exactly equal** the `duration_frames` column in
   `black_frame_intervals.csv` (230 / 214 / 611 / 367 / 188 / 464) — no off-by-one, no
   interpolation, clean first/last frame (brief rule: "No accidental black frames, flash
   frames, or interpolation. First and last frames transition cleanly.").
5. **Do not touch the source audio.** These are silent visual inserts that slot into the
   already-black video sections; the narration audio underneath is untouched master audio
   and is out of scope for this package.
6. Record the render in `00_ADMIN/render_manifest.md` (source path, frame count, fps,
   render date) — same spirit as `extract_media.py` being the reproducible record for
   Phase 0–1.

## 6. Verification before calling an insert done

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
