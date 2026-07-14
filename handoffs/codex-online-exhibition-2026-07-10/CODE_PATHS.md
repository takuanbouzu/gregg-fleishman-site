# Code Path Manifest

## Files Created by This Pass

- `online-exhibition.html`
  - Main standalone online exhibition / review-edition wireframe.
- `handoffs/codex-online-exhibition-2026-07-10/README_HANDOFF.md`
  - Claude Code handoff summary.
- `handoffs/codex-online-exhibition-2026-07-10/ASSET_LOG.md`
  - Local asset and reference log.
- `handoffs/codex-online-exhibition-2026-07-10/CODE_PATHS.md`
  - This manifest.

## Files Intentionally Not Edited

- `index.html`
  - Suggested future link location, but not changed in this pass.
- `truncated-octahedron.html`
  - Already modified before this pass by separate GLB/assembly work.
- `assets/models/rhombi-pod.glb`
  - Already untracked before this pass by separate GLB/assembly work.
- `HANDOFF-CODEX-TERMINAL.md`
  - Already untracked before this pass, documenting separate truncated-octahedron work.

## Primary Local Preview

```bash
cd "/Users/yuto/Library/CloudStorage/Dropbox/Zenbu.OS/gregg-fleishman-site"
python3 -m http.server 8766 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8766/online-exhibition.html
```

## Implementation Notes

- The page is self-contained: all page-specific CSS and JavaScript live inside `online-exhibition.html`.
- It relies on existing shared site files for tokens and nav behavior.
- The preview console uses iframes pointed at existing static pages.
- On mobile, the hero iframe is hidden and replaced with `assets/drawings/fleishman-sequence-poster.png` for performance.
- The page uses fixed responsive breakpoints rather than viewport-scaled typography.

