# GREGG_MOTION_GRAPHICS

Production tree for the six black-screen motion-graphics inserts in
`gregg 1.publer.com.mp4`. Full editorial brief: see the original handoff pack
(`README.md`, `CLAUDE.md`, storyboard) supplied by Studio Zenbu.

## What's done (Phases 0–1, media-prep)
- `00_ADMIN/media_probe.md` — authoritative source properties.
- `00_ADMIN/black_frame_intervals.csv` — **frame-accurate** insert windows,
  measured (PyAV + ffmpeg blackdetect), superseding the handoff CSV by ~0.1 s
  on INS_04/06 and adding two extra stray blips.
- `01_SOURCE/clips|audio|stills/` — handled review clips (±5 s), transcription
  WAVs, and pre-black stills for all six inserts.
- `00_ADMIN/extract_media.py` — reproducible driver (needs ffmpeg + the master).
- `00_ADMIN/cue_sheet.csv`, `01_SOURCE/transcripts/INS_0*.md` — scaffolds.

## What's blocked here (see STATUS.md)
Transcription (no Whisper weights + network), and the render phases (After
Effects can't run on Linux; Blender is installable but CPU-only). The master
video is git-ignored — re-drop it at `01_SOURCE/video/` and run
`python3 00_ADMIN/extract_media.py` to reproduce all derived media.

## Not the website
This tree lives on branch `claude/gregg-motion-graphics-mediaprep` and is
**not** part of the `gregg-fleishman-site` GitHub Pages deploy.
