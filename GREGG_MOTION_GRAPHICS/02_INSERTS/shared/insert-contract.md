# The insert contract — deterministic clock API

Every insert page (`02_INSERTS/INS_0N/insert.html`) must expose exactly this
object so `00_ADMIN/render_insert.mjs` can drive it frame-by-frame:

```js
window.INSERT = {
  fps: 30000 / 1001,        // exact NTSC rate — never 29.97 the float literal
  frames: <int>,            // duration_frames from black_frame_intervals.csv
  width: 848, height: 448,  // must match the source encode (media_probe.md)
  ready: <Promise>,         // resolves when assets are loaded and frame 0 is drawn
  seek(frame) {             // int in [0, frames) — pure function of frame number
    // compute t = frame * 1001 / 30000 seconds, pose EVERYTHING from t,
    // then renderer.render(scene, camera) synchronously before returning.
  },
};
```

Rules:

- **`seek` must be pure**: the same frame number always produces the identical
  image. No `Date.now()`, no `requestAnimationFrame` state, no incremental
  physics. Pose from `t`, don't step toward it.
- **Render synchronously inside `seek`** and create the renderer with
  `preserveDrawingBuffer: true`, so the screenshot taken right after `seek`
  returns is guaranteed to be that frame.
- Frame 0 and frame `frames-1` must both be **pure black** (`#000`) — the
  windows are black; first/last frames must transition cleanly.
- Real 3D per the handoff: `PerspectiveCamera`, ground grid, visible parallax.
- Colors from `GF_SCENE.dark` (`<script src="../../../assets/gf-scene.js">`),
  Three.js from the vendored import map
  (`../../../assets/vendor/three-0.160.0/three.module.js`).

Proven by `_pipeline_test/insert.html` + `render_insert.mjs` — see
`00_ADMIN/render_manifest.md` for the validation run.
