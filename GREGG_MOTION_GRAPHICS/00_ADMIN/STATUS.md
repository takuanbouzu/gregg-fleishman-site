# STATUS

## Phase 0 — Repository setup ✅
Production tree created under `GREGG_MOTION_GRAPHICS/`. Source copied to
`01_SOURCE/video/` (git-ignored — 30 MB master; re-drop it there to reproduce).

## Phase 1 — Media verification ✅
- `ffprobe` probe → `00_ADMIN/media_probe.md` + `ffprobe.json`.
- Black frames measured twice (PyAV + ffmpeg blackdetect) →
  authoritative `00_ADMIN/black_frame_intervals.csv` (frame-accurate).
- Six handled review clips (±5 s), H.264 → `01_SOURCE/clips/`.
- Six mono 16 kHz WAVs (for transcription) → `01_SOURCE/audio/`.
- Six pre-black stills → `01_SOURCE/stills/`.
- Reproducible driver: `00_ADMIN/extract_media.py`.

## Phase 2 — Transcript + cue mapping ✅ (transcript supplied)
Transcript supplied by Yuto (`01_SOURCE/transcripts/full_transcript.txt`).
Mapped each black window to Gregg's actual words → `cue_sheet.csv` +
per-insert transcripts. **Major finding:** the handoff storyboard's teaching
goals do NOT match the audio — see `NARRATIVE_CORRECTION.md`. Corrected
per-insert content needs sign-off before modeling.

## Phases 3–7 — NOT STARTED
Blocked on transcription (Phase 2) and on renderer availability:
- After Effects **cannot** run in this Linux sandbox (proprietary Win/Mac).
- Blender is apt-installable here but **CPU-only** (no GPU) — slow.
- The site's existing HTML/Canvas Lost-Triangle engine is a viable alt renderer.

## Next recommended action
Get sign-off on the corrected per-insert content (NARRATIVE_CORRECTION.md) and
pick a render target (open_questions #3), then build the blocking animatic.
