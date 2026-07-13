# Open Questions — resolve before polished rendering

1. **[RESOLVED] INS_03 square derivation** — moot. The transcript shows Gregg
   is naming the three space-fillers during INS_03's window, not deriving a
   square. The square/√2/√3 lesson is at 05:51–06:37, outside all six windows.
   See `NARRATIVE_CORRECTION.md`.
2. **[NEEDS SIGN-OFF] Corrected per-insert content** — the handoff storyboard's
   teaching goals don't match the audio. The transcript-derived content
   (`cue_sheet.csv`, `NARRATIVE_CORRECTION.md`) supersedes it. Confirm before
   modeling.
3. **[RESOLVED] Render target** — HTML/Canvas via the site's existing engine.
   Blender was ruled out (CPU-only headless render in this sandbox is not worth
   pursuing); After Effects can't run here at all. Building on the site's
   existing Lost-Triangle/geometry engines — fast, previewable, and every one
   of the six topics already exists as a computed scene.
4. **Stray black blips (4:10, 4:18, 9:35)** — keep black, or add graphics?
   Assumed edit artifacts.
5. **INS_04 / INS_06 durations** — masters should use the measured out-points
   (2:33.453 / 3:17.464), ~0.1 s longer than the handoff CSV.
