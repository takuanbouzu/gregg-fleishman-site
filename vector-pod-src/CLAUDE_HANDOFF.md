# Vertor Pod Interactive — Claude Handoff

## Start here

Open `Vertor_Pod_Interactive_v1.html` to use the completed interactive. It is a single self-contained file: Three.js, React, styling, and the complete 233-part edge dataset are all embedded. It does not require a server or internet connection.

## Project status

- Gregg Fleishman's current unpublished geometric exploration
- “Vertor Pod” is a provisional working title derived from the Rhino filename/layers
- Original Rhino source was not altered
- Desktop and mobile layouts tested
- TypeScript build and ESLint pass

## Main capabilities

- Assembled, exploded, and construction-geometry modes
- 233 individually represented solid instances
- Toggleable assembly, panels, hidden extension, axis references, and cube frame
- Perspective, top, front, and right camera views
- Orbit, zoom, auto-rotation, and clickable part inspection
- Source layer, group, block path, topology, and envelope metadata

## Editable source

The `source/` folder contains the React + Three.js project. Key files:

- `src/App.tsx` — interaction, Three.js scene, and interface
- `src/index.css` — complete visual system and responsive layout
- `src/modelData.ts` — generated 233-part geometry dataset
- `scripts/extract_3dm.py` — reusable Rhino 3DM edge extractor
- `package.json` / `pnpm-lock.yaml` — build dependencies

Run locally:

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

## Source-model note

The original 61 MB `vertor pod whole unit.3dm` is intentionally not duplicated in this ZIP. The complete web-ready geometry is already embedded in `src/modelData.ts` and the standalone HTML. If re-extracting geometry is necessary, place the original model back at:

`03_MASTER_CONTEXT/3dm/vertor pod whole unit.3dm`

relative to the Gregg Fleishman Legacy Project structure, or pass any location explicitly:

```bash
python3 scripts/extract_3dm.py --source "/path/to/vertor pod whole unit.3dm"
```

The checked-in `src/modelData.ts` is already complete; re-extraction is unnecessary for ordinary design or interaction changes.

## Recommended instructions for Claude

Use the fuller prompt in `OPTIMIZED_CLAUDE_PROMPT.md` at the package root.

