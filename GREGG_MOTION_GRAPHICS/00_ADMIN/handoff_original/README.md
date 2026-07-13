# Gregg Fleishman Motion Graphics — Claude Code Handoff

## Final goal
Produce a clean, stylish, mathematically legible set of motion-graphics inserts that can be edited directly into the supplied source video wherever the picture turns black. Gregg's original voice remains the narration. The graphics should make his geometric operations understandable to a first-time viewer with no prior knowledge of his work, mathematics, geometry, or trigonometry.

The finished package must be modular and editable—not a single flattened movie only. It should include rendered inserts, transparent overlay passes where useful, source scenes, timing references, and a clearly organized project structure.

## Source media
- File: `gregg 1.publer.com.mp4`
- Resolution: 640 × 360
- Frame rate: 29.97 fps (`30000/1001`)
- Audio: AAC, 44.1 kHz, stereo
- Source duration: approximately 12:50.86

## Verified black-screen insertion windows
The six primary black sections were measured directly from the source video.

| Insert | Source in | Source out | Duration |
|---|---:|---:|---:|
| 01 | 00:01:00.694 | 00:01:08.368 | 7.674 s |
| 02 | 00:01:15.375 | 00:01:22.516 | 7.141 s |
| 03 | 00:01:52.145 | 00:02:12.532 | 20.387 s |
| 04 | 00:02:21.208 | 00:02:33.320 | 12.112 s |
| 05 | 00:02:38.492 | 00:02:44.765 | 6.273 s |
| 06 | 00:03:01.982 | 00:03:17.364 | 15.382 s |

Total primary motion-graphics runtime: **68.969 seconds**.

A separate brief black event occurs around 00:04:10.283–00:04:10.884. Treat it as a possible dropped-frame/edit artifact unless editorial review confirms it should contain graphics.

---

# 1. Editorial intent

The inserts should feel as though Gregg's spoken thoughts become visible when the live image disappears. They are not generic interstitials and should not compete with his voice. Each motion, label, highlight, and camera move must answer one of four questions:

1. What shape or rule is Gregg referring to?
2. What operation is happening now?
3. What changes as a result?
4. Why does the change matter to the larger system?

The visual style should be calm, exact, architectural, and museum-like: clean geometry, restrained typography, strong hierarchy, generous pauses, and no decorative motion without explanatory value.

## Audience
Assume the viewer:
- has never encountered Gregg Fleishman's work;
- does not know the Lost Triangle;
- may not know terms such as vertex, plane, axis, or dihedral angle;
- should still understand the basic transformation sequence on first viewing.

Use correct mathematical terms, but pair each with plain language. Example:

> **Dihedral angle** — the angle created when two flat faces meet along a shared edge.

---

# 2. Narrative spine

Across the six inserts, the audience should learn one continuous story:

1. **Starting unit:** identify the Lost Triangle.
2. **Drawing rule:** show the sequence Gregg draws rather than only its finished outline.
3. **Square derivation:** demonstrate how the Lost Triangle and its sequence reveal or construct a square.
4. **Spatialization:** move the flat construction into three dimensions.
5. **Correspondence:** show which edges, faces, and repeated units relate to one another.
6. **Recap:** restate the complete progression from triangle → sequence → square → three-dimensional order.

Do not introduce a final form before showing the operations that produce it.

---

# 3. Required visual system

## 3.1 World reference
Every spatial scene must include a legible reference system:
- ground-plane grid;
- X, Y, and Z axes;
- labeled origin when useful;
- clear indication of the active drawing plane;
- consistent world scale across inserts.

The grid should be subtle but visible. It is an orientation aid, not a visual texture.

## 3.2 Dimensional states
Use a consistent convention:
- **2D construction:** geometry lies flat on the XY ground plane;
- **active edge:** brighter/thicker line or controlled accent treatment;
- **construction geometry:** lighter or partially transparent;
- **result geometry:** full opacity and strongest hierarchy;
- **3D transition:** a face lifts or rotates around a visibly highlighted hinge edge;
- **camera orbit:** only after the viewer understands the flat starting condition.

## 3.3 Annotation system
Required annotation types:
- step numbers;
- object names;
- vertex/edge/face labels where meaningful;
- direction arrows;
- motion paths;
- angle arcs and values;
- short plain-language captions;
- highlighted outer boundary when the square emerges;
- “before / operation / result” states;
- optional inset diagrams for dense moments.

Keep labels attached to geometry and avoid crossing leader lines. All essential labels must remain readable at 640 × 360 delivery size.

## 3.4 Camera language
Use the camera to clarify dimensionality, not to create spectacle.

Preferred shots:
- straight-on or near-orthographic view for drawing steps;
- clean axonometric view for dimensional explanation;
- slow 10–30° orbit to reveal depth;
- brief dolly or reframing when a local operation needs emphasis;
- still hold after each important result.

Avoid fast spins, deep depth of field, lens distortion, excessive easing, and continuous camera motion while the viewer is trying to read labels.

---

# 4. Voice-driven animation rules

Gregg's original voice is the master timing track.

For every spoken operation:
- highlight the subject just before or as he names it;
- begin the motion on the operative verb: draw, turn, fold, rotate, repeat, connect, or make;
- land the motion when he completes the thought;
- reveal a numerical label only when he says the corresponding number;
- hold the result long enough to read before moving to the next idea.

Do not animate ahead of the narration. When Gregg speaks faster than a novice can process, simplify the number of simultaneous visual events rather than accelerating every operation.

## Required alignment artifact
Create a cue sheet for every insert with these fields:
- source timecode;
- exact transcript phrase;
- spoken keyword;
- visual action;
- animation start frame;
- animation end frame;
- label/caption;
- hold duration;
- unresolved interpretation notes.

Any geometric interpretation not explicitly supported by the source must be marked `VERIFY_WITH_YUTO/GREGG` rather than silently invented.

---

# 5. Insert-by-insert storyboard

## Insert 01 — Establish the Lost Triangle
**Source:** 00:01:00.694–00:01:08.368  
**Duration:** 7.674 s

### Teaching goal
Introduce the Lost Triangle as the base geometric unit and establish the visual coordinate system.

### Suggested sequence
1. Fade up ground grid and X/Y/Z axes.
2. Draw the Lost Triangle on the XY plane in Gregg's actual drawing order.
3. Mark its vertices and highlight the completed boundary.
4. Add concise title: **The Lost Triangle**.
5. Make a very slight camera shift/orbit to establish that the drawing exists in a 3D world, while keeping it flat.

### Beginner caption
> This triangle is the starting unit of Gregg's system.

### End state
Lost Triangle centered on grid, fully legible, ready to be reused in Insert 02.

---

## Insert 02 — Explain the drawn sequence
**Source:** 00:01:15.375–00:01:22.516  
**Duration:** 7.141 s

### Teaching goal
Show that Gregg's geometry is generated by a repeatable sequence of operations, not by presenting a mysterious finished diagram.

### Suggested sequence
1. Re-establish the triangle in the same position and scale as Insert 01.
2. Animate Gregg's line sequence one stroke at a time.
3. Number the operations in the order spoken.
4. Use arrows to indicate direction or rotation.
5. Ghost previous steps while keeping the current step dominant.

### Beginner caption
> Gregg builds the larger shape by repeating a simple drawing rule.

### End state
The first recognizable construction sequence is visible without yet over-emphasizing the final form.

---

## Insert 03 — Derive the square
**Source:** 00:01:52.145–00:02:12.532  
**Duration:** 20.387 s

### Teaching goal
This is the central explanatory insert. Explicitly show how the Lost Triangle and Gregg's sequence derive, reveal, or organize the square.

### Required sequence
1. Start with the Lost Triangle on the XY grid.
2. Re-run or continue the relevant drawn sequence.
3. Duplicate, rotate, mirror, or align units only according to Gregg's explanation.
4. Show each placement separately; do not jump to the completed arrangement.
5. Keep construction lines visible but subdued.
6. Trace the resulting outer boundary.
7. Resolve that boundary into a clearly highlighted square.
8. Dim secondary geometry so the square is unmistakable.
9. Explain in plain language what produced it.
10. If supported by the narration, begin the transition toward three dimensions near the end of the insert.

### Required captions
Use wording equivalent to:
- **Step 1 — Begin with the Lost Triangle**
- **Step 2 — Repeat Gregg's sequence**
- **Step 3 — Follow the outer boundary**
- **Result — A square emerges from the construction**

### Critical constraint
Do not imply that the square is a conventional arbitrary overlay. Its relationship to the sequence must be visually demonstrated. If the exact derivation is unclear, create an annotated blocking preview and flag it for verification before final rendering.

### End state
Square emphasized; originating triangles and construction remain faintly visible; spatial transition is prepared.

---

## Insert 04 — Move from a flat drawing into space
**Source:** 00:02:21.208–00:02:33.320  
**Duration:** 12.112 s

### Teaching goal
Make the shift from two-dimensional construction to three-dimensional geometry explicit and intuitive.

### Suggested sequence
1. Begin with the completed 2D construction on the XY plane.
2. Highlight the edge that will act as a hinge.
3. Label it: **shared edge / hinge**.
4. Rotate or fold the connected face upward around that edge.
5. Show an angle arc during the movement.
6. Introduce the term **dihedral angle** with a plain-language definition if it matches the narration.
7. Orbit the camera slowly after the fold lands.
8. Retain grid and axes to show the movement away from the original plane.

### Beginner caption
> A flat drawing becomes spatial when one face rotates around a shared edge.

### End state
Clear axonometric view of the spatial relationship, held long enough to understand depth.

---

## Insert 05 — Show matching parts and correspondence
**Source:** 00:02:38.492–00:02:44.765  
**Duration:** 6.273 s

### Teaching goal
Clarify which edges, faces, or repeated units Gregg is comparing when he says that parts are the same, related, aligned, or corresponding.

### Suggested sequence
1. Hold the 3D model from Insert 04.
2. Highlight the first referenced element.
3. Highlight its corresponding element with the same visual treatment.
4. Add a thin connecting guide or paired labels.
5. Briefly rotate or isolate the geometry if overlap makes the relationship unclear.

### Beginner caption
> These two parts play the same role in the construction.

### End state
Corresponding elements remain highlighted as a matched pair.

---

## Insert 06 — Full process recap
**Source:** 00:03:01.982–00:03:17.364  
**Duration:** 15.382 s

### Teaching goal
Consolidate the entire lesson so a first-time viewer leaves with a coherent mental model.

### Suggested sequence
1. Return briefly to the isolated Lost Triangle.
2. Show the drawing sequence in compressed but readable form.
3. Reveal the square.
4. Highlight the hinge/shared edge.
5. Lift or fold into 3D.
6. Orbit to show the final spatial relationship.
7. Display a simple four-stage progression:
   - Lost Triangle
   - Repeated sequence
   - Derived square
   - Three-dimensional form
8. Hold on the finished state before returning to source footage.

### Beginner caption
> A simple triangle becomes a rule, the rule reveals a square, and the square becomes spatial.

### End state
Clean hero view with minimal labels; transition smoothly back to live action.

---

# 6. Reusable motion-graphics toolkit

Build the project around reusable procedural functions or scene modules rather than manually keyframing every insert independently.

Suggested modules:
- `show_grid()`
- `show_axes()`
- `show_origin()`
- `draw_segment()`
- `reveal_triangle()`
- `duplicate_shape()`
- `mirror_shape()`
- `rotate_about_edge()`
- `highlight_vertex()`
- `highlight_edge()`
- `highlight_face()`
- `show_angle_arc()`
- `trace_boundary()`
- `reveal_square()`
- `lift_into_3d()`
- `orbit_camera()`
- `dim_secondary_geometry()`
- `add_step_label()`
- `add_plain_language_caption()`
- `hold_for_readability()`

Parameters should include start frame, end frame, object IDs, label text, and easing profile.

---

# 7. Production architecture

## Recommended application split

### Blender
Use for:
- mathematically accurate base geometry;
- ground grid and XYZ axes;
- shape duplication and transformation;
- edge-based folding/rotation;
- camera animation;
- object IDs and render passes;
- geometry-only preview renders.

### After Effects
Use for:
- typography;
- subtitles and captions;
- arrows and callouts;
- step numbers;
- angle labels;
- editorial transitions;
- compositing with Gregg's source video;
- final timing refinements against speech.

Claude Code may generate Blender Python and AE JSX/helper scripts, but all outputs must remain editable through the normal Blender and After Effects interfaces.

## Alternative
If the entire system is built in Blender, keep annotations as separate collections/render layers so text and labels can still be revised without rerendering all geometry.

---

# 8. Deliverables

## For each insert
- editable Blender file;
- editable After Effects composition or documented annotation setup;
- H.264 review preview with source audio;
- ProRes 4444 render with alpha when graphics are intended as overlays;
- ProRes 422 HQ or equivalent full-frame insert when graphics replace black picture completely;
- geometry-only render;
- annotation-only render where feasible;
- first and last frame stills;
- cue sheet aligned to Gregg's exact voice;
- list of unresolved geometric questions.

## Final editorial package
- six insert masters at exact verified durations;
- one full source-video review cut with inserts placed into the black sections;
- one graphics-only string-out;
- one version with burned-in timecode and insert IDs;
- source project files;
- fonts referenced by name only—do not package restricted font files;
- render manifest with codec, frame rate, resolution, alpha status, and version number.

## Resolution strategy
The source is 640 × 360, but build the graphics master at **1920 × 1080, 29.97 fps**, preserving a center-safe layout that downscales cleanly. Deliver 1920 × 1080 masters plus source-resolution review files if requested.

---

# 9. File structure

```text
GREGG_MOTION_GRAPHICS/
├── 00_ADMIN/
│   ├── README.md
│   ├── cue_sheet.csv
│   ├── black_frame_intervals.csv
│   └── open_questions.md
├── 01_SOURCE/
│   ├── video/
│   ├── audio/
│   └── transcripts/
├── 02_GEOMETRY/
│   ├── reference/
│   ├── imports/
│   └── approved/
├── 03_BLENDER/
│   ├── shared_system/
│   └── inserts/
│       ├── INS_01/
│       ├── INS_02/
│       ├── INS_03/
│       ├── INS_04/
│       ├── INS_05/
│       └── INS_06/
├── 04_AFTER_EFFECTS/
├── 05_RENDERS/
│   ├── previews/
│   ├── alpha/
│   ├── full_frame/
│   └── stills/
├── 06_EDIT/
│   ├── review_cut/
│   └── graphics_stringout/
└── 99_ARCHIVE/
```

## Naming convention
```text
GF_MG_INS##_descriptor_v###_YYYYMMDD.ext
```

Example:
```text
GF_MG_INS03_square_derivation_v003_20260712.mov
```

---

# 10. Claude Code execution order

1. Ingest the source video and preserve its original audio unchanged.
2. Extract the six verified blackout regions with at least five seconds of audio handles before and after each.
3. Produce exact transcripts for those windows plus their surrounding context.
4. Build a phrase-to-operation cue sheet.
5. Identify all geometric ambiguities and flag them before final modeling.
6. Create a low-fidelity animatic using basic line geometry, grid, axes, captions, and Gregg's voice.
7. Review the square derivation first; it is the conceptual dependency for later inserts.
8. Build the reusable Blender scene toolkit.
9. Produce one approved style frame and one approved motion test.
10. Complete all six inserts.
11. Composite them into a full review cut.
12. Export editable source files and final masters.

Do not begin polished rendering before the low-fidelity animatic proves that every operation matches Gregg's speech and remains understandable at normal playback speed.

---

# 11. Quality-control checklist

## Meaning
- Does every motion correspond to something Gregg says?
- Is the square visibly derived rather than merely shown?
- Is the difference between flat and spatial geometry obvious?
- Are uncertain interpretations flagged instead of invented?

## Comprehension
- Can a non-mathematical viewer identify the starting shape?
- Can they describe the operation after one viewing?
- Are captions written in plain language?
- Is each result held long enough to read?

## Visual consistency
- Are grid, axes, labels, line weights, and camera behavior consistent?
- Do inserts connect visually from one to the next?
- Are labels readable after downscaling to 640 × 360?
- Is movement restrained and purposeful?

## Editorial compatibility
- Does every insert match its exact source duration?
- Are first and last frames designed for clean transitions?
- Is source audio untouched and synchronized?
- Are alpha and full-frame versions clearly identified?
- Can an editor replace or trim an insert without rebuilding the system?

## Technical
- Frame rate: 29.97 fps throughout.
- No accidental frame interpolation.
- Correct color-management documentation.
- No clipped labels or unsafe margins.
- All external assets linked or collected.
- No restricted font files packaged.

---

# 12. Definition of done

The project is complete when an editor can open the final package, place each insert at its documented timecode, and obtain a clean full-length video in which:

- Gregg's voice remains continuous;
- the black frames are replaced by polished teaching graphics;
- the Lost Triangle, sequence, square derivation, and transition into 3D are understandable to a novice;
- every insert is editable and reusable for future Gregg Fleishman videos;
- the graphics feel like one coherent visual system rather than six unrelated animations.
