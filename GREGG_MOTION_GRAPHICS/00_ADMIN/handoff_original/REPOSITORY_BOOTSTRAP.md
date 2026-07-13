# Repository Bootstrap

Place this handoff folder beside the source file, or copy the source into:

```text
GREGG_MOTION_GRAPHICS/01_SOURCE/video/gregg 1.publer.com.mp4
```

Do not rename the source until the media probe and checksums are recorded.

Suggested initial commands:

```bash
ffprobe -hide_banner -v error \
  -show_format -show_streams \
  -of json \
  "01_SOURCE/video/gregg 1.publer.com.mp4" \
  > "00_ADMIN/ffprobe.json"
```

Extract a handled clip around an interval:

```bash
ffmpeg -ss 00:00:55.694 -i "01_SOURCE/video/gregg 1.publer.com.mp4" \
  -t 17.674 -c:v libx264 -crf 18 -c:a aac -b:a 192k \
  "01_SOURCE/clips/INS_01_handles.mp4"
```

Extract transcription audio:

```bash
ffmpeg -i "01_SOURCE/clips/INS_01_handles.mp4" \
  -vn -ac 1 -ar 48000 -c:a pcm_s16le \
  "01_SOURCE/audio/INS_01_handles.wav"
```

Use actual probe results and frame boundaries when generating production assets. The interval CSV is the editorial reference, but every output should also record integer frame in/out values.
