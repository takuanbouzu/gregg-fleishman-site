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
6. **[RESOLVED] "Only three space-fillers" — is Gregg's INS_03/06 claim
   mathematically accurate?** Checked against Wolfram MathWorld
   (`Parallelohedron.html`, `Space-FillingPolyhedron.html`): there are exactly
   **five** primary parallelohedra overall (Fedorov, 1885) — cube, hexagonal
   prism, rhombic dodecahedron, elongated dodecahedron, truncated octahedron.
   Gregg's "three" is correct **for the cubic-symmetry family specifically**
   — cube, rhombic dodecahedron, and truncated octahedron are exactly the
   three of the five with cubic/octahedral symmetry; the other two
   (hexagonal prism, elongated dodecahedron) belong to a hexagonal symmetry
   family and fall outside the scope he states elsewhere ("I focus only on
   the cubic family"). **No script/content change needed** — his statement is
   precise once read in that scope. Don't "correct" it during modeling.
