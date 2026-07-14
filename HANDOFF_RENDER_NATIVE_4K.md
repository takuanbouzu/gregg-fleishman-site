# Native Blender 4K Render Handoff

Updated: 2026-07-13T21:15:00-07:00

## Status: ALL FRAMES RENDERED AND ENCODED

All six inserts hit their full frame counts and all per-insert MP4/ProRes encodes plus the
combined stringout are on disk. As of this update PID `51368` was still alive (likely
finishing validation/cleanup — the render log's last write was 9:12:52 PM, ~2.5 min prior).
Re-check with the monitor commands below; if the process has exited, the render is fully
complete and no further action is needed.

- Working directory: `C:\Users\zenbu\Dropbox\00_Zenbu.OS\01_PROJECTS\Gregg-Fleishman-Legacy\gregg-fleishman-site`
- Package: `GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K`
- Live PowerShell render PID: `51368`
- Command launched:

```powershell
.\GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\RENDER_ALL_4K.ps1 -ChunkSize 24 -Samples 16
```

## Final frame counts (all complete)

- `INS_01_V2`: 230 / 230 PNG frames rendered, MP4 and ProRes encoded.
- `INS_02`: 214 / 214 PNG frames rendered, MP4 and ProRes encoded.
- `INS_03`: 611 / 611 PNG frames rendered, MP4 and ProRes encoded.
- `INS_04`: 367 / 367 PNG frames rendered, MP4 and ProRes encoded.
- `INS_05`: 188 / 188 PNG frames rendered, MP4 and ProRes encoded.
- `INS_06`: 464 / 464 PNG frames rendered, MP4 and ProRes encoded.
- Combined stringout (`GREGG_NATIVE_REFERENCE_STRINGOUT_4K.mp4` / `_PRORES_HQ.mov`) built in `04_STRINGOUT`.
- `05_REVIEW\ALL_INSERTS_SEQUENCE_STRIPS.jpg` generated (final validation strip).

## Outstanding check

`validation_report.json` had not yet appeared in the package root as of this update — confirm
it was written once the process exits, and skim it for any flagged issues before considering
the batch fully closed out.

## Important correction already made

`INS_01_V2` was rebuilt from the approved HTML source rather than the old `INS_01.blend` scene. The corrected editable scene is:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\01_BLENDER\INS_01_V2.blend
```

The latest proof strip before production was:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\05_REVIEW\INS_01_V2_fixed_proof_strip_v6.jpg
```

The combined editable Blender stringout was rebuilt after the fix:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\01_BLENDER\GREGG_NATIVE_REFERENCE_STRINGOUT_4K.blend
```

## Monitor from terminal

```powershell
cd "C:\Users\zenbu\Dropbox\00_Zenbu.OS\01_PROJECTS\Gregg-Fleishman-Legacy\gregg-fleishman-site"

Get-Process -Id 51368 -ErrorAction SilentlyContinue

$root = "GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\02_FRAMES"
foreach ($id in "INS_01_V2","INS_02","INS_03","INS_04","INS_05","INS_06") {
  $count = (Get-ChildItem -File (Join-Path $root $id) -ErrorAction SilentlyContinue | Measure-Object).Count
  "$id $count"
}

$log = Get-ChildItem -File "GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\logs" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1
Get-Content -Tail 40 $log.FullName
```

## Resume if the process stops

The render script is resumable. It skips complete PNG chunks and continues missing frames, then re-encodes outputs:

```powershell
cd "C:\Users\zenbu\Dropbox\00_Zenbu.OS\01_PROJECTS\Gregg-Fleishman-Legacy\gregg-fleishman-site"
.\GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\RENDER_ALL_4K.ps1 -ChunkSize 24 -Samples 16
```

Do not clear `02_FRAMES` unless you intentionally want a full rerender from frame 1 again.

## Final expected outputs

Individual outputs:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\03_INSERTS\*_native_4K.mp4
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\03_INSERTS\*_native_4K_PRORES_HQ.mov
```

Combined outputs:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\04_STRINGOUT\GREGG_NATIVE_REFERENCE_STRINGOUT_4K.mp4
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\04_STRINGOUT\GREGG_NATIVE_REFERENCE_STRINGOUT_4K_PRORES_HQ.mov
```

Review strips and validation:

```text
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\05_REVIEW\ALL_INSERTS_SEQUENCE_STRIPS.jpg
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\validation_report.json
GREGG_MOTION_GRAPHICS\10_BLENDER_NATIVE_REFERENCE_4K\logs\native_4K_build_render_*.log
```
