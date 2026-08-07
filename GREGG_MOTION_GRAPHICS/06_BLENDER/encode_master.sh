#!/usr/bin/env bash
# Encode the Blender PNG sequence into the review master.
# Exact 30000/1001 fps; fade in/out applied at encode time so the PNGs stay clean.
set -euo pipefail
cd "$(dirname "$0")"

FRAMES=720
N=$(ls renders/f_*.png 2>/dev/null | wc -l)
if [ "$N" -ne "$FRAMES" ]; then
  echo "frame-count gate FAILED: have $N, want $FRAMES" >&2
  exit 1
fi

ffmpeg -y -framerate 30000/1001 -i renders/f_%04d.png \
  -vf "fade=t=in:st=0:d=0.60,fade=t=out:st=23.30:d=0.70,format=yuv420p" \
  -c:v libx264 -crf 19 -preset slow -movflags +faststart \
  INS_01_node_fold_master.mp4

GOT=$(ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames -of csv=p=0 INS_01_node_fold_master.mp4)
if [ "$GOT" = "$FRAMES" ]; then
  echo "EXACT ✓  $GOT frames @ 30000/1001"
else
  echo "frame-count gate FAILED after encode: $GOT != $FRAMES" >&2
  exit 1
fi
