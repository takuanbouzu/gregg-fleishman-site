#!/usr/bin/env bash
# Build the full client delivery package into 07_DELIVERY/.
# Produces: 6 ProRes 422 HQ masters, the graphics-only string-out, and the
# burned-in-timecode review version. Everything is reproducible from the
# committed insert sources (02_INSERTS/) + the source video.
#
# Run from GREGG_MOTION_GRAPHICS/:  bash 00_ADMIN/build_delivery.sh
# Prereqs: ffmpeg, node + Playwright, the source video at 01_SOURCE/video/,
#          a static server at the repo ROOT on :8741 (python3 -m http.server 8741).
set -euo pipefail
cd "$(dirname "$0")/.."

# Delivery resolution (default Full HD). The inserts are vector, so any size is
# crisp; labels auto-scale via insert-kit's UI factor. Override: RES_W/RES_H env.
RES_W=${RES_W:-1920}
RES_H=${RES_H:-1080}
BASE="http://localhost:8741/GREGG_MOTION_GRAPHICS/02_INSERTS"
D=07_DELIVERY
P=$D/masters_prores
FONT=$(fc-list | grep -i "DejaVuSansMono-Bold" | head -1 | cut -d: -f1)
mkdir -p "$P" "$D/graphics_stringout" "$D/review_timecode"

# 1. ProRes 422 HQ masters (frame-exact) — one per insert, at RES_W×RES_H.
for i in 01 02 03 04 05 06; do
  node 00_ADMIN/render_insert.mjs "$BASE/INS_$i/insert.html?w=$RES_W&h=$RES_H" "$P" --name "INS_$i" --prores
done

# 2. Graphics-only string-out: six masters back-to-back, 0.5 s black slugs between.
ffmpeg -y -f lavfi -t 0.5 -i color=c=black:s=${RES_W}x${RES_H}:r=30000/1001 \
  -i "$P/INS_01_master.mov" -i "$P/INS_02_master.mov" -i "$P/INS_03_master.mov" \
  -i "$P/INS_04_master.mov" -i "$P/INS_05_master.mov" -i "$P/INS_06_master.mov" \
  -filter_complex "[0:v]setsar=1,split=5[b1][b2][b3][b4][b5];\
[1:v]setsar=1[a1];[2:v]setsar=1[a2];[3:v]setsar=1[a3];[4:v]setsar=1[a4];[5:v]setsar=1[a5];[6:v]setsar=1[a6];\
[a1][b1][a2][b2][a3][b3][a4][b4][a5][b5][a6]concat=n=11:v=1:a=0[out]" \
  -map "[out]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -movflags +faststart \
  "$D/graphics_stringout/GRAPHICS_STRINGOUT.mp4"

# 3. Burned-in-timecode review version (needs the review cut built first).
if [ ! -f 05_RENDERS/review/REVIEW_CUT.mp4 ]; then
  bash 00_ADMIN/build_review_cut.sh
fi
ffmpeg -y -i 05_RENDERS/review/REVIEW_CUT.mp4 \
  -vf "drawtext=fontfile=$FONT:timecode='00\:00\:00\:00':rate=30000/1001:fontcolor=white:fontsize=20:box=1:boxcolor=black@0.6:boxborderw=6:x=w-tw-14:y=14" \
  -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart \
  "$D/review_timecode/REVIEW_TIMECODE.mp4"

echo "--- delivery built into $D/ ---"
ls -la "$P" "$D/graphics_stringout" "$D/review_timecode"
