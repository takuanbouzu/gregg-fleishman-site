# Blender render roadmap — all six inserts at 4K

**Goal:** render the six inserts in Blender at **3840×2160 (4K), 29.97 fps (30000/1001)**, exact frame counts, with crisp edges and a richer physically-lit look than the browser WebGL path can give — real area lighting, bevelled solids, ambient occlusion, optional depth-of-field/bloom, and 16-bit EXR/ProRes output. This is the "render even better" path.

Why Blender is the right tool for the 4K / anti-alias goal:
- **Crisp at 4K, controllable AA.** WebGL's antialiasing is a fixed MSAA the browser owns. Blender lets you dial sampling exactly (EEVEE Next TAA samples, or render 8K and downsample for zero visible softness), and gives clean geometric edges plus optional Freestyle line overlays.
- **Real materials & light.** The struts become bevelled plywood planks under soft area light with contact shadows/AO, instead of flat `MeshBasic`. That's the visible upgrade over the current masters.
- **Proper output.** Native 16-bit linear EXR or 10-bit ProRes, correct color management (Filmic/AgX or Standard), no 8-bit browser screenshot chain.

**Honest tradeoff up front:** this is a *re-look*, not the identical approved frames rendered sharper. The geometry and motion port exactly (they're pure math); the *look* (lighting, materials, shadows) is new and needs one sign-off per scene. Screen-space **text/chrome is composited**, not modelled in Blender (see Stage C).

---

## Architecture: "bake and replay"

Everything in the inserts is a **pure function of the frame number** — `window.INSERT.seek(f)` deterministically sets every object transform, visibility, material opacity, and the camera. That is the ideal case for porting: we don't re-derive anything, we *bake* it.

```
  each insert's seek(f)  ──►  scene_dump.mjs  ──►  per-frame JSON
  (Three.js, already          (Playwright,          (camera + every
   deterministic)              walks INSERT.scene)   object per frame)
                                                          │
                                                          ▼
                                    build_blend.py (bpy) rebuilds geometry,
                                    assigns materials + lights, keyframes the
                                    baked transforms/visibility  ──►  INS_0N.blend
                                                          │
                                                          ▼
                    Blender EEVEE Next @ 4K, 30000/1001  ──►  3D EXR/PNG sequence
                                                          │
              text/chrome overlay (transparent 4K PNG seq, Stage C)
                                                          │
                                                          ▼
                                     composite ──► INS_0N master (ProRes/H.264)
```

### Stage A — dump the baked animation (`00_ADMIN/scene_dump.mjs`)

We already expose `scene`, `camera`, and `fadeFrames` on `window.INSERT` (added for the SVG exporter). A dumper reuses that: load the insert, and for every frame `seek(f)` then walk the scene graph, recording each object's world transform + material state and the camera. Output one JSON per insert.

Schema (per frame):
```jsonc
{
  "fps": [30000, 1001], "frames": 230, "w": 3840, "h": 2160,
  "camera": { "pos":[x,y,z], "quat":[x,y,z,w], "fov":40, "near":0.1, "far":200 },
  "objects": [
    { "id":"sA", "kind":"strut", "matrix":[16 floats world],
      "visible":true, "opacity":1.0, "color":"#6f9bc4" },
    { "id":"plane", "kind":"plane", "matrix":[...], "opacity":0.18, ... }
    // ...one entry per renderable, keyed by a stable id we tag in each insert
  ]
}
```
Code sketch (mirrors `svg_export.mjs`, but emits transforms not SVG):
```js
const frame = await page.evaluate(f => {
  window.INSERT.seek(f);
  const cam = window.INSERT.camera;
  const objs = [];
  window.INSERT.scene.traverse(o => {
    if (!o.isMesh && !o.isLine && !o.isLineSegments) return;
    objs.push({ id:o.name||o.uuid, matrix:o.matrixWorld.elements.slice(),
      visible:o.visible, opacity:o.material?.opacity ?? 1,
      color:o.material?.color ? '#'+o.material.color.getHexString() : null });
  });
  return { camera:{ pos:cam.position.toArray(), quat:cam.quaternion.toArray(), fov:cam.fov }, objects:objs };
}, f);
```
> Tag stable `mesh.name`s in each insert (`sA`, `sB`, `plane`, `toWire`, …) so the importer can map each to the right Blender material/collection. This is a small, additive edit per insert page.

### Stage B — build the .blend (`06_BLENDER/build_blend.py`, run with `blender -b -P`)

Two ways to get geometry into Blender; do **both** where it helps:
1. **Rebuild computed geometry procedurally in `bpy`** — the truncated octahedron (24 signed perms of (0,±1,±2)), rhombic dodecahedron, cube, and the struts are a few lines of Python each, *exact by construction* (same formulas as `insert-kit.js`). Preferred for the polyhedra.
2. **Import baked meshes** for anything already a mesh (the GLB models used elsewhere) via glTF import.

Then per object: create material (Principled BSDF — steel-blue `#6f9bc4` planks, low roughness ≈0.6, metalness 0; translucent panels as a low-alpha BSDF; wireframes as emissive thin tubes or Freestyle), add a **Bevel modifier** to the struts/solids for the chamfered edge that catches light, and set the scene lighting (one key area light + soft fill + faint rim — matching the new INS_01). Finally, **apply the baked JSON as keyframes**: for each frame, set `obj.matrix_world`, `obj.hide_render`/viewport from `visible`+`opacity`, keyframe material `Alpha`/emission from `opacity`, and set the camera from `camera` (convert Three.js Y-up quaternion → Blender Z-up: rotate −90° about X on import). Insert keyframes with **CONSTANT or BEZIER interpolation**; since we bake every frame, CONSTANT is exact.

### Stage C — text & chrome overlay (composite, don't model)

The chapter header, title, "01 / 06", the "45° CUT" / angle readouts, legend, and captions are **screen-space HUD**. Cleanest path: render them as a **transparent 4K PNG sequence** straight from the existing insert page (add a `?chrome=1` mode that hides the WebGL canvas and keeps only the DOM/`.svgtxt` layer, screenshot with `omitBackground:true`), or reuse `svg_export.mjs`'s text pass. Then composite that PNG sequence **over** the Blender 3D render — in Blender's compositor (Image node → Alpha Over) or in the NLE. Fonts stay exact (Space Mono / Hanken Grotesk), no Blender text wrangling, and the 3D and text are independently editable.

### Stage D — render settings (put in the .blend + a `render.py`)

- Engine **EEVEE Next** (fast, stylized-friendly); Cycles only if you want true GI/soft shadows and can afford it.
- Resolution **3840×2160**, 100%; frame rate base **30000/1001** (set `render.fps=30000, fps_base=1001`), frame range `0..(frames-1)`.
- **Anti-alias control:** EEVEE TAA render samples 32–64 for clean edges; for *zero visible softness* render at **7680×4320 and downscale to 4K** (supersample) rather than disabling the filter (which just makes jaggies). Enable **AO** and **soft shadows**; **bloom/DoF optional** per art direction.
- Color management **Standard** (to match the current flat masters) or **AgX** (richer) — pick one and keep it across all six.
- Output 16-bit **EXR** (archival) → encode to ProRes 422 HQ / H.264 with the existing ffmpeg step; **gate on the 230/214/611/367/188/464 frame counts** exactly like `render_insert.mjs` does.
- Keep audio untouched downstream — Blender renders silent inserts; they drop into the black windows over Gregg's original audio, same as now.

---

## Per-scene notes (geometry · materials · lights)

| Insert | Frames | Geometry to build in bpy | Look notes |
|---|---|---|---|
| **INS_01** measured joint | 230 | 2 bevelled struts (box + Bevel mod), a translucent projection plane, 3-axis gnomon | plywood planks under key+fill+rim; plane = low-alpha glass; joint tilts out of plane (baked) |
| **INS_02** new vs 10-yr | 214 | truncated octahedron + rhombic dodecahedron (procedural), side by side | two solids, faint face fills + bright edge tubes; gentle key light |
| **INS_03** three space-fillers | 611 | cube · rhombic dodecahedron (two-cube checkerboard) · truncated octahedron + ghost neighbours | the hero; most objects — script the ghost lattice from the offset lists already in the insert |
| **INS_04** Platonic → cubic family | 367 | tetra · octa · cube (+ the five Platonic solids) | emphasise the cubic-family trio; consistent material across solids |
| **INS_05** corner-cut | 188 | parametric truncation of the octahedron, u:0→1 landing exactly on the TO | animate the truncation as a shape-key or per-frame rebuilt mesh from the baked verts |
| **INS_06** packing | 464 | RD honeycomb (FCC, 12 neighbours) + TO packing (BCC, 14 neighbours) + the √-ladder legend | many ghost cells — instance them; legend is chrome (Stage C) |

For INS_05's morph and INS_06's flying neighbours, the **baked per-frame transforms already encode the motion** — the importer just applies them; no need to re-solve the animation in Blender.

---

## Build options (pick one)

- **Option A — bake & replay (recommended).** Exact motion, most work is the `bpy` importer + materials/lights once. Reuses the deterministic seek we already have. ~1 reusable importer + per-scene material/light tuning.
- **Option B — animated glTF export.** Export each insert's animation to glTF and import to Blender. Rejected: our animation is a custom `seek()`, not Three.js AnimationClips, so there's nothing to export cleanly; materials/text are lost anyway.
- **Option C — full manual re-author in Blender.** Most artistic control, most labour, and the motion would drift from the approved timing. Only if you want a ground-up cinematic pass.

---

## File layout

```
06_BLENDER/
  build_blend.py        # bpy: geometry + materials + lights + keyframe the JSON
  render.py             # render settings + ffmpeg encode + frame-count gate
  lib/geometry.py       # TO / RD / cube / struts, exact (mirrors insert-kit.js)
  dumps/INS_0N.json     # baked per-frame animation (from scene_dump.mjs)
  blends/INS_0N.blend   # generated; re-buildable, so gitignore the heavy ones
  renders/INS_0N/       # EXR/PNG sequences (gitignored)
00_ADMIN/scene_dump.mjs # Stage A dumper (sibling of svg_export.mjs)
```
Commit the scripts + JSON dumps (small, text); gitignore `.blend` and render outputs (rebuildable), same policy as the existing masters.

---

## Sequencing / effort

1. **Prove it on INS_01** (smallest, just-reanimated): write `scene_dump.mjs`, dump INS_01, build the importer + strut/plane materials + lights, render 4K, composite the chrome, compare to the WebGL master. One scene end-to-end de-risks everything.
2. **Generalise the importer** — factor geometry into `lib/geometry.py`, confirm the JSON schema covers all object kinds.
3. **Roll through INS_02 → INS_06**, tuning only materials/lights per scene (motion is already baked).
4. **Batch render** all six at 4K, gate frame counts, encode, hand off.

## Open decisions for you

- **EEVEE Next vs Cycles** — EEVEE is far faster and fits the stylized flat-ish look; Cycles if you want true global illumination. Recommendation: EEVEE Next.
- **Color look** — keep **Standard** (matches current masters) or go **AgX** (richer contrast). 
- **How much "richer"** — flat-lit like the current look, or lean into soft shadows + subtle DoF + bloom for a more cinematic pass?
- **Chrome** — composite the existing HTML/SVG text over Blender (recommended, font-exact), or rebuild the HUD natively in Blender?

Tell me EEVEE-vs-Cycles + how rich you want the light, and I'll build Stage A + the INS_01 importer as the proof, then roll it across all six.
