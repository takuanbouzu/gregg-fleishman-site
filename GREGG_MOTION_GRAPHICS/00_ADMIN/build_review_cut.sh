#!/usr/bin/env bash
# Build the full review cut: the six insert masters composited into the black
# windows of the source video. The source AUDIO is stream-copied — untouched.
# Windows are the authoritative in/out points from black_frame_intervals.csv.
#
# Run from GREGG_MOTION_GRAPHICS/:  bash 00_ADMIN/build_review_cut.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="01_SOURCE/video/gregg 1.publer.com.mp4"
R="05_RENDERS/review"
OUT="$R/REVIEW_CUT.mp4"

# insert  start(s)   end(s)     (start = in_frame·1001/30000, end = start + duration)
# INS_01  60.694     68.368
# INS_02  75.375     82.516
# INS_03  112.145    132.532
# INS_04  141.208    153.453
# INS_05  158.492    164.765
# INS_06  181.982    197.464

ffmpeg -y -i "$SRC" \
  -i "$R/INS_01_master.mp4" -i "$R/INS_02_master.mp4" -i "$R/INS_03_master.mp4" \
  -i "$R/INS_04_master.mp4" -i "$R/INS_05_master.mp4" -i "$R/INS_06_master.mp4" \
  -filter_complex "\
[1:v]setpts=PTS-STARTPTS+60.694/TB[i1];[0:v][i1]overlay=eof_action=pass:enable='between(t,60.694,68.363)'[v1];\
[2:v]setpts=PTS-STARTPTS+75.375/TB[i2];[v1][i2]overlay=eof_action=pass:enable='between(t,75.375,82.511)'[v2];\
[3:v]setpts=PTS-STARTPTS+112.145/TB[i3];[v2][i3]overlay=eof_action=pass:enable='between(t,112.145,132.527)'[v3];\
[4:v]setpts=PTS-STARTPTS+141.208/TB[i4];[v3][i4]overlay=eof_action=pass:enable='between(t,141.208,153.448)'[v4];\
[5:v]setpts=PTS-STARTPTS+158.492/TB[i5];[v4][i5]overlay=eof_action=pass:enable='between(t,158.492,164.760)'[v5];\
[6:v]setpts=PTS-STARTPTS+181.982/TB[i6];[v5][i6]overlay=eof_action=pass:enable='between(t,181.982,197.459)'[v6]" \
  -map "[v6]" -map 0:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p \
  -c:a copy -movflags +faststart "$OUT"

echo "---"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$OUT"
echo "review cut written to $OUT"
