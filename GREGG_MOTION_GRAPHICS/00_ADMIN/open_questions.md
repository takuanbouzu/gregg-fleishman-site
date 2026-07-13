# Open Questions — resolve before polished rendering

1. **[RESOLVED] INS_03 square derivation** — moot. The transcript shows Gregg
   is naming the three space-fillers during INS_03's window, not deriving a
   square. The square/√2/√3 lesson is at 05:51–06:37, outside all six windows.
   See `NARRATIVE_CORRECTION.md`.
2. **[NEEDS SIGN-OFF] Corrected per-insert content** — the handoff storyboard's
   teaching goals don't match the audio. The transcript-derived content
   (`cue_sheet.csv`, `NARRATIVE_CORRECTION.md`) supersedes it. Confirm before
   modeling.
3. **[DECISION] Render target** — After Effects can't run in the automated env.
   Choose: (a) Blender headless (CPU-only here), (b) HTML/Canvas via the site's
   existing engine (fast, previewable, screen-record to ProRes on your machine),
   or (c) both — HTML block for approval, port to Blender.
4. **Stray black blips (4:10, 4:18, 9:35)** — keep black, or add graphics?
   Assumed edit artifacts.
5. **INS_04 / INS_06 durations** — masters should use the measured out-points
   (2:33.453 / 3:17.464), ~0.1 s longer than the handoff CSV.
