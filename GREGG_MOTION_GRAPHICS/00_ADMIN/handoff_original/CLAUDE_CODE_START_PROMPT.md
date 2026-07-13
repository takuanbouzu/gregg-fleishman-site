# Claude Code Start Prompt

You are working inside the Gregg Fleishman motion-graphics handoff repository.

First read, in this order:
1. `CLAUDE.md`
2. `README.md`
3. `black_frame_intervals.csv`
4. `cue_sheet_template.csv`

The end goal is a clean, stylish, editable set of motion-graphics inserts that an editor can place directly into the black sections of `gregg 1.publer.com.mp4`. Gregg's source voice must remain continuous and drive every geometric action.

Begin only with Phases 0–2:
- create the production directory structure;
- inspect the source with `ffprobe`;
- verify the six black-screen intervals;
- extract handled clips, audio, and representative stills;
- make phrase-level transcripts for each interval and nearby context;
- populate the cue sheet with proposed visual actions;
- record all uncertainty as `VERIFY_WITH_YUTO_GREGG`.

Do not build polished animations yet. Do not infer missing geometry. Do not jump directly to a final form.

At the end of this first pass, create:
- `00_ADMIN/STATUS.md`
- `00_ADMIN/media_probe.md`
- `00_ADMIN/cue_sheet.csv`
- `00_ADMIN/open_questions.md`
- `01_SOURCE/transcripts/INS_01.md` through `INS_06.md`
- a concise proposal for the blocking animatic.

The visual system must ultimately include:
- a ground-plane grid;
- labeled X, Y, and Z axes;
- the Lost Triangle drawn in sequence;
- an explicit step-by-step derivation of the square;
- a clear transition from 2D construction into 3D form;
- restrained camera orbit used only to clarify depth;
- extensive plain-language annotations suitable for a total beginner.
