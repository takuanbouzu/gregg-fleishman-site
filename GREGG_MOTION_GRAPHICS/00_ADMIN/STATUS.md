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

## Phase 2 — Transcript + cue mapping ⏳ BLOCKED (this environment)
Cue-sheet + transcript scaffolds exist (`cue_sheet.csv`,
`01_SOURCE/transcripts/INS_0*.md`) but the **audio is not yet transcribed** —
this sandbox has no Whisper model weights and the network blocks the CDNs that
host them. Options: (a) transcribe on a machine with Whisper / an API using the
extracted WAVs; (b) widen the network allowlist; (c) run Claude Code locally.

## Phases 3–7 — NOT STARTED
Blocked on transcription (Phase 2) and on renderer availability:
- After Effects **cannot** run in this Linux sandbox (proprietary Win/Mac).
- Blender is apt-installable here but **CPU-only** (no GPU) — slow.
- The site's existing HTML/Canvas Lost-Triangle engine is a viable alt renderer.

## Next recommended action
Transcribe the six WAVs (outside this env) and fill `cue_sheet.csv`, then
approve the INS_03 square-derivation geometry before any polished animation.
