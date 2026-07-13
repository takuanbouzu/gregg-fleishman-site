# CLAUDE.md — Gregg Fleishman Motion Graphics

## Mission
Build a production-ready, editable motion-graphics insert package for the six black-screen sections in `gregg 1.publer.com.mp4`.

Gregg's original voice is the master narration. The visuals must teach the Lost Triangle, Gregg's drawn sequence, the square derivation, and the transition from 2D into 3D to viewers with no prior mathematics background.

Read `README.md` completely before changing or generating project files.

## Non-negotiable rules
1. Do not invent or silently “complete” uncertain geometry.
2. Mark uncertainty as `VERIFY_WITH_YUTO_GREGG` in `00_ADMIN/open_questions.md` and the cue sheet.
3. Do not begin polished rendering until a voice-synchronized blocking animatic is approved.
4. Preserve source audio unchanged.
5. Every final insert must match its documented source duration at 29.97 fps.
6. The square must be visibly derived through operations; it must not simply appear as an overlay.
7. All spatial scenes require a ground grid and labeled X/Y/Z axes.
8. All important operations require beginner-friendly annotations.
9. Keep deliverables editable. Never provide only a flattened final movie.
10. Do not package proprietary font files. Record font names and fallback choices instead.

## Working style
Work in small, reviewable phases. At the end of each phase:
- update `00_ADMIN/STATUS.md`;
- list files created or changed;
- record assumptions;
- record unresolved geometry;
- provide the exact next recommended action.

Do not overwrite approved work. Version meaningful outputs using:
`GF_MG_<asset>_v###_YYYYMMDD.ext`

## Required phases
### Phase 0 — Repository setup
Create the directory structure specified in `README.md`. Confirm that the source video exists. Do not move or transcode the only source copy.

### Phase 1 — Media verification
Use `ffprobe` and `ffmpeg` to:
- verify resolution, frame rate, audio format, and duration;
- confirm the six black-screen intervals;
- extract handled review clips with five seconds before and after each interval;
- extract WAV audio for transcription/alignment;
- generate contact sheets or representative frames.

Write results to:
- `00_ADMIN/media_probe.md`
- `01_SOURCE/clips/`
- `01_SOURCE/audio/`
- `01_SOURCE/stills/`

### Phase 2 — Transcript and cue mapping
Create phrase-level transcripts around each insert. Map spoken verbs and nouns to proposed visual actions.

Outputs:
- `01_SOURCE/transcripts/INS_01.md` through `INS_06.md`
- `00_ADMIN/cue_sheet.csv`
- `00_ADMIN/open_questions.md`

Use the exact status `VERIFY_WITH_YUTO_GREGG` when meaning is uncertain.

### Phase 3 — Storyboard and blocking animatic
Before Blender polish, create:
- an insert-by-insert storyboard;
- a frame-accurate shot list;
- a low-fidelity animatic using simple lines, labels, grid, axes, and Gregg's audio;
- a full source-video review cut with the blocking inserts placed into the black sections.

The animatic must prove:
- speech synchronization;
- square derivation comprehension;
- readable pacing at normal speed;
- clean transitions into and out of live footage.

### Phase 4 — Reusable Blender system
Create a shared procedural toolkit for:
- grid and axes;
- line drawing;
- triangle reveal;
- duplication, mirroring, and alignment;
- rotation about an edge;
- edge/face/vertex highlights;
- boundary tracing;
- square reveal;
- camera orbit;
- annotation anchors and render layers.

Keep geometry and annotations separable. Prefer parameters and reusable functions over duplicated keyframes.

### Phase 5 — Style system
Produce one style frame and one motion test before completing all inserts.
Document:
- typography and fallbacks;
- line weights;
- annotation hierarchy;
- grid density;
- camera lens and movement conventions;
- color-management settings;
- easing and hold timing.

### Phase 6 — Final insert production
Complete the six inserts using the approved system. Export review, full-frame master, alpha where useful, geometry-only, annotation-only where feasible, and first/last frame stills.

### Phase 7 — Editorial package and validation
Create:
- six exact-duration insert masters;
- full review cut;
- graphics-only string-out;
- burned-in timecode review;
- render manifest;
- source-project inventory;
- final validation report.

## Validation gates
Do not advance when any gate fails.

### Gate A — Meaning
- Every major motion maps to Gregg's speech.
- Uncertain geometry is flagged.
- The square is derived, not asserted.

### Gate B — Comprehension
- A novice can identify the starting triangle.
- A novice can follow the sequence.
- Captions explain mathematical terms in plain language.
- Labels remain readable at 640×360.

### Gate C — Editorial fit
- Exact 29.97 fps durations.
- Audio remains continuous.
- No accidental black frames, flash frames, or interpolation.
- First and last frames transition cleanly.

### Gate D — Editability
- Blender source files open without missing dependencies.
- Text and annotations can be revised separately.
- Render layers are named and documented.
- No output depends on an undocumented local absolute path.

## Decision protocol
When the source or transcript does not establish the geometry:
1. stop that specific operation;
2. create the clearest possible annotated blocking alternatives;
3. label alternatives A/B/C;
4. add a concise question to `open_questions.md`;
5. continue only on independent tasks.

## Preferred tools
- `ffprobe` / `ffmpeg` for media analysis and extraction
- Blender Python for procedural geometry and camera animation
- After Effects or AE JSX only for annotation/compositing workflows that remain editable
- Python for cue sheets, frame/timecode conversion, manifests, and validation

Do not assume After Effects is available on the execution machine. Build the geometry pipeline so it can be reviewed from Blender-rendered previews independently.
