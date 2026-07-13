# Vertor Pod Interactive v1

A self-contained interactive 3D study generated from the actual NURBS edges and nested block structure of `vertor pod whole unit.3dm`.

## Included interactions

- Orbit, zoom, and gentle auto-rotation
- Assembled, exploded, and construction-geometry modes
- Independent assembly, panel, extension, axis-reference, and cube-frame visibility
- Perspective, top, front, and right camera presets
- Clickable parts with layer, group, block path, topology, and envelope details
- Responsive desktop and mobile layout

## Run locally

```bash
pnpm install
pnpm dev
```

## Rebuild the model dataset

The extraction script reads the source 3DM without modifying it:

```bash
PYTHONPATH=/path/to/rhino3dm python3 scripts/extract_3dm.py \
  --source "/path/to/vertor pod whole unit.3dm"
```

This regenerates `src/modelData.ts` with 233 expanded solid instances.

## Build

```bash
pnpm build
```

The Claude package includes a fully inlined standalone HTML file. The editable source builds to `dist/` with the command above.

## Important status

This represents Gregg Fleishman's current unpublished exploration. “Vertor Pod” is a working title derived from the source filename and layer names, not a confirmed public title.
