# Media Probe — `gregg 1.publer.com.mp4`

Authoritative source properties (from `ffprobe`, full JSON in `ffprobe.json`).

| Property | Value |
|---|---|
| Container | MP4 (ISO 14496-14) |
| Duration | **770.737 s** (12:50.74) |
| Overall bitrate | ~321 kbps |
| Video codec | **HEVC / H.265** (`hvc1`) |
| Resolution | **848 × 448** |
| Frame rate | **29.970 fps** (30000/1001) |
| Total video frames | 23,099 |
| Audio codec | **AAC** (`mp4a`) |
| Audio | stereo, 44.1 kHz |

## Notes vs. the original handoff spec
The handoff `README.md` described the source as 640×360 / H.264. The delivered
file is **848×448 / HEVC** — a different encode of the **same cut**: the six
black-screen **in-points match to the millisecond**, which is conclusive. Work
to the properties above, not the README's.

## Black-frame verification
Measured two independent ways — PyAV per-frame luma, then `ffmpeg blackdetect`
(`d=0.4:pix_th=0.10`, the authoritative pass). See
`black_frame_intervals.csv`. The six primary windows confirm the handoff to
within ~0.1 s, with two refinements:
- **INS_04** ends ~0.13 s later than the handoff CSV (out 02:33.453, not .320).
- **INS_06** ends ~0.10 s later (out 03:17.464, not .364).
- **Three** stray sub-second black blips exist (4:10, 4:18, 9:35), not one.
  Treat all three as probable edit artifacts pending editorial review.

Primary motion-graphics runtime (authoritative): **69.20 s** across 6 inserts.
