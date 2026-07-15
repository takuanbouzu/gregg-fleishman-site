#!/usr/bin/env bash
# Encode the two node-annotation masters (24 fps).
set -euo pipefail
cd "$(dirname "$0")"

gate () {  # gate <dir> <pattern-count> <name>
  local n
  n=$(ls $1 2>/dev/null | wc -l)
  if [ "$n" -ne "$2" ]; then echo "gate FAILED for $3: $n != $2" >&2; exit 1; fi
}

if [ -d renders_A ]; then
  gate "renders_A/f_*.png" 269 "Version A"
  ffmpeg -y -framerate 24 -i renders_A/f_%04d.png \
    -vf "fade=t=in:st=0:d=0.4,fade=t=out:st=10.7,format=yuv420p" \
    -c:v libx264 -crf 19 -preset slow -movflags +faststart \
    node_annotation_A_hero.mp4
  echo "A encoded: $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 node_annotation_A_hero.mp4) frames"
fi

if [ -d frames_B ]; then
  gate "frames_B/f_*.png" 170 "Version B"
  ffmpeg -y -framerate 24 -i frames_B/f_%04d.png \
    -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" \
    -c:v libx264 -crf 19 -preset slow -movflags +faststart \
    node_annotation_B_quad.mp4
  echo "B encoded: $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 node_annotation_B_quad.mp4) frames"
fi
