# Codex Terminal Handoff

Date: 2026-07-10

## Current State

Repo:
`/Users/yuto/Library/CloudStorage/Dropbox/Zenbu.OS/gregg-fleishman-site`

Main Zenbu folder:
`/Users/yuto/Library/CloudStorage/Dropbox/00_Zenbu.OS`

Note: this working clone is currently outside the main Zenbu folder. If Terminal
Codex is launched from the main folder, first `cd` into the repo path above
before continuing this specific Gregg Fleishman site task.

Branch:
`continue-truncated-octahedron-reveal`

Tracking:
`origin/claude/lost-triangle-animation-math-vudrm9`

Working tree:

```text
 M truncated-octahedron.html
?? HANDOFF-CODEX-TERMINAL.md
?? assets/models/rhombi-pod.glb
```

The untracked GLB is intentional and required.

## User Intent

Continue the Claude/Codex work on:

`truncated-octahedron.html`

The goal is for the built model stages to feel like living architectural diagrams:

- Vector Pod / Pod: wireframe first, then panels/materials turn on.
- Vector House: same language, not a hard cut.
- Motion should feel polished, truthful, and restrained.
- Do not fake a many-part explosion if the GLB does not actually contain many separable parts.

The user referenced this Claude branch/screenshot as an additional source of truth:

`origin/claude/step-file-assembly-toggle-giwk9d`

That branch added a richer `assets/models/rhombi-pod.glb` and a Rhombi Pod assembly viewer in `explore.html`.

## Important Asset Finding

There are two similarly named Pod assets:

- `assets/models/rhomi-pod.glb`
  - Existing asset on this branch.
  - About 2.8 MB.
  - GLB node structure: 3 nodes, 2 meshes, 3004 primitives.
  - Too merged for a convincing part-by-part assembly reveal.

- `assets/models/rhombi-pod.glb`
  - Restored from `origin/claude/step-file-assembly-toggle-giwk9d`.
  - About 1.9 MB.
  - GLB node structure: 82 nodes, 74 meshes, 3012 primitives.
  - Has preserved groups like `Source`, `NODE PARTS`, `90`, `45`, `Panels`.
  - This is now used for the Pod stage in `truncated-octahedron.html`.

Do not delete `rhombi-pod.glb`; add it if committing.

## Implemented Changes

In `truncated-octahedron.html`:

- The Pod stage now points to:
  `assets/models/rhombi-pod.glb`

- The source label now says:
  `rhombi-pod.glb · 65 Rhino CAD parts, grouped by assembly layer`

- Added reveal helpers:
  - `sceneTime()`
  - `materialList()`
  - `setMaterialOpacity()`
  - `prepareBuiltModel()`
  - `updateBuiltModelReveal()`

- Built GLB stages now animate as:
  1. model loads hidden
  2. feature-edge wireframe appears
  3. mesh bodies lightly assemble inward from radial offsets
  4. panels/materials fade on

- Reference/source curves in the grouped Pod GLB are hidden on load.

- Replay resets the active GLB reveal timing.

## Verification Already Run

Local server:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Page:

`http://127.0.0.1:8765/truncated-octahedron.html`

Automated Chromium checks passed:

- Desktop: Cell, Pod, House stage switches.
- Pod and House GLBs load.
- No runtime errors.
- No model-load errors.
- Mobile viewport: no horizontal overflow.

Temporary screenshots from the verification pass:

```text
/private/tmp/truncated-pod-wire.png
/private/tmp/truncated-pod-panels.png
/private/tmp/truncated-pod.png
/private/tmp/truncated-house.png
/private/tmp/truncated-pod-mobile.png
```

Observed warnings were non-blocking Three/WebGL warnings:

- `THREE.Color: Alpha component of rgba(...) will be ignored.`
- WebGL `ReadPixels` performance warning from screenshots.

## Suggested Next Moves

1. Open the local page and judge the feel by eye.
2. Consider whether the Pod should expose layer toggles like the `explore.html` branch:
   - Hex panels
   - Nodes 90
   - Nodes 45
   - Ref curves
3. Consider whether the House stage should keep wireframe edges slightly more subtle than Pod.
4. If ready, add both changed files:

```bash
git add truncated-octahedron.html assets/models/rhombi-pod.glb
```

5. Then commit on this feature branch. Do not commit directly to `main`.

## Useful Branch References

Current working branch:

```bash
cd "/Users/yuto/Library/CloudStorage/Dropbox/Zenbu.OS/gregg-fleishman-site"
git switch continue-truncated-octahedron-reveal
```

Assembly-toggle reference branch:

```bash
git show origin/claude/step-file-assembly-toggle-giwk9d:explore.html
```

Grouped asset source:

```bash
git restore --source=origin/claude/step-file-assembly-toggle-giwk9d -- assets/models/rhombi-pod.glb
```
