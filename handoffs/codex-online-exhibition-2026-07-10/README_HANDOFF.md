# Claude Code Handoff: Online Exhibition Wireframe

Date: 2026-07-10

Repo:
`/Users/yuto/Library/CloudStorage/Dropbox/Zenbu.OS/gregg-fleishman-site`

Primary file:
`online-exhibition.html`

Local preview:
`http://127.0.0.1:8766/online-exhibition.html`

## User Goal

Yuto wants a dedicated interactive website / online exhibition for Gregg Fleishman as a review-submission output. This should live beside the existing wholesome Gregg site rather than replace it. The page should feel warmer, more human, and more contemporary than the colder instrument-panel direction, while still honoring the mathematical precision of the Lost Triangle work.

## What Codex Added

Created `online-exhibition.html`, a standalone static HTML page with:

- A warm review-edition hero using the existing Fleishman Sequence animation as an ambient background.
- A six-room visitor route: proof, animation, cube, Vector Pod, space-filling system, archive/person context.
- An interactive preview console that swaps iframe modules using existing local pages.
- A visual direction section using architecture and drawing assets.
- Archive module placeholders for proof artifacts, storyboards, and built work.
- A next-build checklist focused on spine selection, captions, Gregg voice notes, and mobile testing.

The page uses existing repo conventions:

- Static HTML only, no build step.
- Existing shared CSS tokens from `assets/gf-tokens.css`.
- Existing shared nav enhancer `assets/gf-nav.js`.
- Existing dark-only site environment.
- Vendored/local pages and assets only.

## Verification Completed

Local server was started with:

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Response check passed:

```text
HTTP/1.0 200 OK
Content-type: text/html
Content-Length: 27340
```

Reference check:

```text
checked 38 references
missing none
```

## Important Worktree Context

Before this handoff, the repo already had unrelated uncommitted work:

```text
 M truncated-octahedron.html
?? HANDOFF-CODEX-TERMINAL.md
?? assets/models/rhombi-pod.glb
```

Those items are from the separate truncated-octahedron / Rhombi Pod GLB branch work. Do not treat them as part of this online-exhibition pass unless Yuto explicitly asks to continue that work.

This handoff package intentionally focuses on `online-exhibition.html`.

## Suggested Next Moves

1. Open `online-exhibition.html` locally and judge the pacing by eye on desktop and mobile.
2. Decide whether to link the page from `index.html`. Codex attempted to add a homepage link, but path handling failed in the patch tool, so `index.html` remains untouched.
3. Replace placeholder copy with Gregg voice notes and real artifact captions.
4. Choose the final opening spine:
   - `fleishman-sequence-drawings.html`
   - `lost-triangle.html`
   - another motion cut Yuto prefers
5. If the page becomes public-facing, consider adding it to the repo README page table and the desired nav system.

