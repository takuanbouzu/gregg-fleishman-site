# Optimized Claude Instruction Prompt

You are continuing the **Vertor Pod Interactive**, an interactive 3D study built from Gregg Fleishman’s latest unpublished geometric exploration.

## Objective for this session

Review the supplied package, preserve what is already working, and implement the following requested improvement:

**[INSERT YOUR REQUEST HERE]**

Proceed autonomously on safe, in-scope work. Do not stop for routine permission. Ask only before deleting source material, publishing externally, changing access permissions, or making a public factual claim that requires Gregg’s confirmation.

## Read first

1. `README_FIRST.md`
2. `documentation/Vertor_Pod_3DM_Analysis_v1.md`
3. `documentation/WORK_RECORD.md`
4. `source/src/App.tsx`
5. `source/src/index.css`

Treat the existing standalone interactive and `source/src/modelData.ts` as the current source of truth for the web experience.

## Non-negotiable constraints

- This design is **current and unpublished**. Do not describe it as an existing website project, historical Pod, or confirmed public product.
- “Vertor Pod” / “Vector Pod” is a **provisional working title** until Gregg confirms the name and spelling.
- Preserve the actual extracted geometry. Do not replace it with a generic sphere, polyhedron, procedural approximation, or invented part system.
- `source/src/modelData.ts` contains the complete web-ready representation of **233 solid instances**: 207 visible and 26 on the optional extension layer.
- Preserve part identity and metadata: layer, group, nested block path, topology counts, dimensions, and click selection.
- Model units are unset in the original 3DM. Do not state that dimensions are inches as fact; label them “model units” unless confirmed.
- Keep the extension off by default unless explicitly asked to change the preferred configuration.
- Maintain the calm, precise, gallery-quality visual language. Avoid generic dashboard styling, decorative gradients, excessive rounded cards, or unnecessary UI clutter.
- Keep desktop and mobile layouts functional.
- Do not modify or claim to modify the original Rhino model unless the `.3dm` is supplied and that work is explicitly requested.

## Technical contract

- Framework: React + TypeScript + Three.js + Vite.
- Primary implementation: `source/src/App.tsx`.
- Styling: `source/src/index.css`.
- Geometry dataset: `source/src/modelData.ts`.
- The completed handoff must include a portable standalone HTML file with no external script or stylesheet dependency.
- Ordinary interface changes do not require rerunning the Rhino extractor.
- If geometry must be re-extracted and the 3DM is available, use:

```bash
python3 source/scripts/extract_3dm.py \
  --source "/path/to/vertor pod whole unit.3dm"
```

Do not hand-edit the encoded geometry payload unless the task specifically requires a controlled data transformation.

## Verification requirements

Before handing back work:

1. Run `pnpm install --frozen-lockfile` from `source/` when dependencies are not installed.
2. Run `pnpm lint`.
3. Run `pnpm build`.
4. Test assembled, exploded, and geometry modes.
5. Test layer toggles, extension visibility, camera presets, auto-rotation, and click-to-inspect.
6. Check one desktop viewport and one narrow/mobile viewport.
7. Confirm the browser console has no current errors.
8. Preserve or regenerate the portable standalone HTML.
9. Update `documentation/WORK_RECORD.md` with sources, changes, decisions, verification, open questions, and the next action.

## Evidence language

Use these labels when interpreting the design:

- **Observed** — directly present in the source geometry or files.
- **User-confirmed** — stated by Yuto or Gregg.
- **Inferred** — supported by evidence but not confirmed.
- **Recommendation** — a proposed next step.
- **Open question** — requires Yuto or Gregg.

Never promote an inference into a public fact merely because it creates a cleaner story.

## Definition of done

The requested improvement is complete, existing interactions still work, geometry fidelity and unpublished status are preserved, build and lint pass, desktop/mobile behavior is checked, the standalone output is current, and the work record clearly explains what changed.

