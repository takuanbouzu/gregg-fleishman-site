# 06_BLENDER — Blender-native builds

**Three deliverables live here** (all headless Cycles via the `bpy` pip module,
all using Gregg's real `NODE PARTS/45` plate from `rhombi-pod.glb`):

1. **INS_01 fold revision** (`ins01_node_fold.py`) — two node instances snap
   together at 90° in the plane and fold about their real shared edge to the
   built 120° condition.
2. **Handoff A — hero angle-annotation** (`nodeA_hero.py` + `node_tripod_common.py`)
   — the canonical three-strut node (P1/P2/P3 along ⟨110⟩, true angles
   120°/90°/120°, non-coplanar): dashed guide circle → arc sweep with tip dot →
   bisector label, per pair, with an orthographic camera touring home → face-on
   views and the 45°-cut causal beat. 269 f @ 24 fps. Encode: `encode_tripod.sh`.
3. **Handoff B — quad split-view** (`nodeB_quad.py`) — same model + annotation
   rules, assembly timeline (struts travel in along their axes with dashed
   travel paths, spacer/hub seats last), rendered through four synced cameras
   (TOP/FRONT/LEFT ortho + orbiting perspective; numeric labels perspective-only)
   and composited into a 2×2 drawing sheet. 170 f @ 24 fps.
   `python3 nodeB_quad.py` renders panes → `--composite` tiles them →
   `encode_tripod.sh` encodes.

The handoffs' reference files (`node_animated.blend`, `node_quad.blend`) were
not reachable from this environment (Dropbox blocked); the builds follow the
handoffs' explicit canonical vectors/cameras/timelines, with the real plate
geometry from the repo's own GLB.

**Rendered masters (committed):**
- `node_annotation_A_hero.mp4` — 269 frames, exact, 1536×960 @ 24 fps
- `node_annotation_B_quad.mp4` — 170 frames, exact, 1282×842 @ 24 fps

Both gated by `encode_tripod.sh` against their target frame counts before
being written.

First scene modeled **and rendered natively in Blender** (headless Cycles via the
`bpy` pip module — no browser/WebGL in the pipeline). This directory follows the
layout planned in `00_ADMIN/BLENDER_RENDER_ROADMAP.md`, but the first production
here is the **INS_01 revision**, rebuilt to the owner's animation-revision brief:
replace the generic rectangular struts with **Gregg's actual node geometry**.

## Contents

| file | what it is |
|---|---|
| `node_part_45.obj` | Gregg's real 45° node part, extracted verbatim from `assets/models/rhombi-pod.glb` (his `Single Rhomi Pod STEP` Rhino model → layer `NODE PARTS/45`, instance `Mesh_48`). Proportions untouched. |
| `extract_node_part.py` | Reproducible extraction (GLB → meshopt decode → dequantize → OBJ). |
| `ins01_node_fold.py` | The whole scene: geometry, materials, lights, annotations, camera, 720-frame animation, per-frame Cycles render loop (resumable — existing PNGs are skipped). |
| `encode_master.sh` | PNG sequence → H.264 master at exactly 30000/1001 fps, with the frame-count gate and encode-time fades. |
| `renders/`, `stills/` | Output (gitignored, rebuildable). |

## The measured facts the animation is built on

All from `rhombi-pod.glb`, none eyeballed:

- Every `NODE PARTS/45` centerline runs along a **cube face diagonal** — 45° to
  the axes (that is what the Rhino layer name "45" means).
- Two parts mated **in one plane** have centerlines at **exactly 90°** (45°+45°).
- The **built condition** (instances `Mesh_48` / `Mesh_51` in the pod) has the
  centerlines at **exactly 120°** — cos = −½ between face diagonals of adjacent
  cube faces — touching along **one shared edge** across the plank width (0.192).
- Rotating the built pair by **exactly 90° about that shared edge** lays Node_B
  flat into Node_A's plane (verified numerically to ~1e-4, the int16
  quantization noise of the GLB). So the 90°→120° fold is a single rotation
  about the **real connection edge** — no invented pivot.
- Node_B is a **linked duplicate** of Node_A (same mesh datablock); its final
  pose is the measured rigid transform between the two pod instances
  (congruence residual ~1e-4). Both object origins sit on the rotation axis.

Sequence (24.0 s, 720 frames): separated parts → real centerlines + the two 45°
annotations (measured against the shared-edge direction) → Node_B slides in
along its own axis, decelerating into an exact snap (edge flash + registration
ring) → 90° hold → slow fold about the shared edge with a faint ghost of the
flat pose and a live angle readout → lands in the true built pose at 120°.
There is no 180° step anywhere in the sequence.

## Rebuild

```bash
pip install bpy numpy               # Blender 4/5 as a Python module
python3 ins01_node_fold.py          # ~24 s/frame on CPU Cycles at 1080p; resumable
./encode_master.sh                  # gates 720 frames, encodes the master
python3 ins01_node_fold.py --stills # 9 QC keyframes only
```

For a 4K/GPU pass on the local machine, raise `RES`/`SAMPLES` in
`ins01_node_fold.py` — the scene itself needs no other change (see
`00_ADMIN/HANDOFF-LOCAL-BLENDER-SESSION.md`).
