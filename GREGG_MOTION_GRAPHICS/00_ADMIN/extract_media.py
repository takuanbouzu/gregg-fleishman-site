#!/usr/bin/env python3
"""Phase-1 media extraction. Requires ffmpeg on PATH and the source master at
01_SOURCE/video/gregg 1.publer.com.mp4. Regenerates clips/, audio/, stills/.
Black-frame windows below are the authoritative ffmpeg-blackdetect measurements."""
import subprocess, os
SRC = "01_SOURCE/video/gregg 1.publer.com.mp4"
HANDLE = 5.0
INSERTS = [  # id, in_s, out_s
    ("INS_01", 60.694, 68.368), ("INS_02", 75.375, 82.516),
    ("INS_03",112.145,132.532), ("INS_04",141.208,153.453),
    ("INS_05",158.492,164.765), ("INS_06",181.982,197.464)]
def run(*a): subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y",*a],check=True)
for iid,a,b in INSERTS:
    ss=max(0,a-HANDLE); dur=(b-a)+2*HANDLE
    run("-ss",f"{ss:.3f}","-i",SRC,"-t",f"{dur:.3f}","-c:v","libx264","-crf","18",
        "-preset","veryfast","-c:a","aac","-b:a","192k",f"01_SOURCE/clips/{iid}_handles.mp4")
    run("-ss",f"{ss:.3f}","-i",SRC,"-t",f"{dur:.3f}","-vn","-ac","1","-ar","16000",
        "-c:a","pcm_s16le",f"01_SOURCE/audio/{iid}_handles.wav")
    run("-ss",f"{max(0,a-0.4):.3f}","-i",SRC,"-frames:v","1",f"01_SOURCE/stills/{iid}_pre-black.png")
    print(iid,"done")
# recheck black frames:
#   ffmpeg -i SRC -vf blackdetect=d=0.4:pix_th=0.10 -an -f null -
