# Handoff A — hero angle-annotation sequence (single orthographic camera tour).
#
# Timeline (24 fps, ~11.2 s = 269 frames), per the handoff:
#   intro (vertex + rays) 1.2 s, then per pair: guide-circle 0.6 / arc sweep 1.4
#   / label 0.5 / hold 0.5, pairs in order A·B (120°) -> B·C (90°) -> C·A (120°),
#   end hold 1 s. Camera: orthographic; opens at Home (azim 75 / elev 55), glides
#   to each pair's face-on view as its arc sweeps. 45°-cut causal beat before
#   the first 120° arc.
#
# Run:  python3 nodeA_hero.py [f0 f1]   (resumable)  |  --stills for QC beats

import bpy, math, os, sys
import numpy as np
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from node_tripod_common import (TripodScene, seg, ease, clamp01, billboard,
                                look_at, glow_mat, set_glow, new_text, C_GREY)

FRAMES = 269
CAM_DIST = 4.0

scene = TripodScene(res=(1536, 960), samples=24, fps=24)
sc, cam = scene.sc, scene.cam
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 2.7

# pair order for A: A·B (120) -> B·C (90) -> C·A (120)
ORDER = [('AB', 29), ('BC', 101), ('AC', 173)]   # window start frames (72f each)

# camera waypoints (azim, elev) — handoff §3; matplotlib convention
VIEWS = {'home': (75, 55), 'AB': (0, 80), 'BC': (30, 35), 'AC': (90, 20)}

def cam_pos(azim, elev):
    a, e = math.radians(azim), math.radians(elev)
    return np.array([math.cos(e) * math.cos(a),
                     math.cos(e) * math.sin(a),
                     math.sin(e)]) * CAM_DIST

# choreography: home -> AB -> BC -> AC -> home
CAM_KEYS = [(0, 'home'), (29, 'home'), (70, 'AB'), (101, 'AB'), (140, 'BC'),
            (173, 'BC'), (212, 'AC'), (244, 'AC'), (268, 'home')]

def cam_state(f):
    for i in range(len(CAM_KEYS) - 1):
        f0, v0 = CAM_KEYS[i]; f1, v1 = CAM_KEYS[i + 1]
        if f <= f1:
            u = ease(seg(f, f0, f1))
            a0, e0 = VIEWS[v0]; a1, e1 = VIEWS[v1]
            return a0 + (a1 - a0) * u, e0 + (e1 - e0) * u
    return VIEWS['home']

# chrome
m_dim = glow_mat('chrome', C_GREY, 1.4, alpha=0.0)
header = new_text('header', 'CONNECTION RULE / 01', m_dim, size=0.052, align='LEFT')
header.parent = cam; header.location = Vector((-1.26, 0.72, -1.6))
sub = new_text('sub', 'NODE — THREE STRUTS, 120° / 90° / 120°', m_dim, size=0.032, align='LEFT')
sub.parent = cam; sub.location = Vector((-1.26, 0.655, -1.6))

def pose(f):
    azim, elev = cam_state(f)
    look_at(cam, tuple(cam_pos(azim, elev)), (0, 0, 0))
    cam.data.ortho_scale = 2.7 - 0.22 * ease(seg(f, 29, 240))

    intro = ease(seg(f, 2, 26))
    scene.set_grid(0.6 * intro)
    set_glow(m_dim, alpha=0.8 * intro)
    for i, nm in enumerate(('P1', 'P2', 'P3')):
        scene.pose_strut(nm, ease(seg(f, 2 + i * 5, 20 + i * 5)))
    scene.pose_hub(0.9 * intro)

    # 45°-cut causal beat, before the first arc completes
    cut_a = ease(seg(f, 30, 42)) * (1 - ease(seg(f, 60, 72)))
    scene.pose_cut_beat(cut_a, cam)

    # annotation windows: circle 0.6s(15f) -> sweep 1.4s(33f) -> label 0.5s(12f) -> hold
    for name, w0 in ORDER:
        circle_a = ease(seg(f, w0, w0 + 14))
        sweep = ease(seg(f, w0 + 15, w0 + 48))
        label_a = ease(seg(f, w0 + 49, w0 + 61))
        # keep finished annotations visible, slightly dimmed
        done = f > w0 + 71
        dim = 0.65 if done else 1.0
        scene.pose_annotation(name, circle_a, sweep, label_a, cam, dim=dim)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if '--stills' in sys.argv:
        outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'stills_A')
        os.makedirs(outdir, exist_ok=True)
        for f in (10, 36, 60, 90, 130, 165, 205, 240, 262):
            pose(f)
            sc.render.filepath = os.path.join(outdir, f'A_{f:04d}.png')
            bpy.ops.render.render(write_still=True)
            print('still', f, flush=True)
    else:
        f0 = int(args[0]) if args else 0
        f1 = int(args[1]) if len(args) > 1 else FRAMES - 1
        outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'renders_A')
        os.makedirs(outdir, exist_ok=True)
        for f in range(f0, f1 + 1):
            fp = os.path.join(outdir, f'f_{f:04d}.png')
            if os.path.exists(fp):
                continue
            pose(f)
            sc.render.filepath = fp
            bpy.ops.render.render(write_still=True)
            print('frame', f, 'done', flush=True)
