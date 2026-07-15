# Handoff B — quad split-view version (engineering drawing sheet).
#
# Same model + annotation rules as Handoff A; only the framing changes:
# a 2x2 grid of synced viewports — TOP / FRONT / LEFT orthographic (true
# projections, static) + one PERSPECTIVE pane on a slow turntable
# (pivot Z: -25° at f0 -> +65° at f169). Assembly timeline at 24 fps:
#   P1 present + settle f1-20 · P2 travels in f26-54 -> annotate P1·P2 (120°)
#   P3 travels in f60-88 -> annotate P1·P3 (120°) + P2·P3 (90°)
#   Spacer/hub seats f96-116 · hold to f169.
# Numeric labels render in the PERSPECTIVE pane only (hidden for ortho cams);
# arcs + dashed guide circles render in ALL panes and foreshorten honestly.
#
# Run:  python3 nodeB_quad.py [f0 f1]     (resumable; renders 4 PNGs per frame)
# Then: python3 nodeB_quad.py --composite (tiles 2x2 + captions -> frames_B/)
#       ./encode_quad.sh                  (encode master)

import bpy, math, os, sys
import numpy as np
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from node_tripod_common import (TripodScene, seg, ease, ease_out_quint, clamp01,
                                glow_mat, set_glow, new_mesh_obj, set_polyline_tube,
                                look_at, C_GOLD, C_DIVIDER, BG, STRUT_REACH)

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = 170
PANE = (640, 420)                      # per-pane render size
SCALE = 0.926 / 26.0                   # maker's blend units -> our part scale

# ---------------------------------------------------------------- composite
def composite(frames=range(FRAMES)):
    from PIL import Image, ImageDraw, ImageFont
    W, H = PANE
    DIV = 3
    out_w, out_h = W * 2 + DIV, H * 2 + DIV
    os.makedirs(os.path.join(HERE, 'frames_B'), exist_ok=True)
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    div_rgb = tuple(int(C_DIVIDER.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    gold_rgb = tuple(int(C_GOLD.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    chip_rgb = (16, 18, 21)
    panes = ['top', 'front', 'left', 'persp']
    caps = {'top': 'TOP · XY', 'front': 'FRONT · XZ', 'left': 'LEFT · YZ',
            'persp': 'PERSPECTIVE'}
    pos = {'top': (0, 0), 'front': (W + DIV, 0),
           'left': (0, H + DIV), 'persp': (W + DIV, H + DIV)}
    for f in frames:
        outp = os.path.join(HERE, 'frames_B', f'f_{f:04d}.png')
        if os.path.exists(outp):
            continue
        canvas = Image.new('RGB', (out_w, out_h), div_rgb)
        for p in panes:
            img = Image.open(os.path.join(HERE, 'renders_B', f'{p}_{f:04d}.png')).convert('RGB')
            canvas.paste(img, pos[p])
        d = ImageDraw.Draw(canvas)
        for p in panes:
            x, y = pos[p]
            t = caps[p]
            tw = d.textlength(t, font=font)
            d.rectangle([x + 10, y + 10, x + 10 + tw + 14, y + 34], fill=chip_rgb)
            d.text((x + 17, y + 14), t, fill=gold_rgb, font=font)
        canvas.save(outp)
        if f % 24 == 0:
            print('composited', f, flush=True)
    print('composite done')

if __name__ == '__main__' and '--composite' in sys.argv:
    composite()
    sys.exit(0)

# ---------------------------------------------------------------- scene
scene = TripodScene(res=PANE, samples=20, fps=24)
sc = scene.sc

# travel paths: faint dashed line along each strut's axis
m_path = {}
paths = {}
for nm in ('P1', 'P2', 'P3'):
    m = glow_mat('path_' + nm, '#8a93a0', 0.9, alpha=0.0)
    ob = new_mesh_obj('path_' + nm, m)
    ray = scene.rays[nm]
    pts = []
    L0, L1, dash = 0.10, 1.55, 0.055
    t = L0
    segs = []
    while t < L1:
        segs.append((ray * t, ray * min(t + dash * 0.55, L1)))
        t += dash
    # build dashed tube
    vs, fs = [], []
    k = 0
    for (p0, p1) in segs:
        d = p1 - p0
        Ld = np.linalg.norm(d)
        if Ld < 1e-9: continue
        d = d / Ld
        up = np.array([0, 0, 1.]) if abs(d[2]) < 0.95 else np.array([1, 0, 0.])
        uu = np.cross(d, up); uu /= np.linalg.norm(uu)
        vv = np.cross(d, uu)
        r = 0.0028
        for p in (p0, p1):
            for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                vs.append(tuple(p + uu * su * r + vv * sv * r))
        fs += [(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5),
               (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
               (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)]
        k += 8
    ob.data.from_pydata(vs, [], fs)
    m_path[nm] = m
    paths[nm] = ob

# ---------------------------------------------------------------- cameras
def ortho_cam(name, loc, up):
    cd = bpy.data.cameras.new(name); cd.type = 'ORTHO'
    cd.ortho_scale = 82 * SCALE          # ≈ 2.92
    ob = bpy.data.objects.new(name, cd)
    bpy.context.collection.objects.link(ob)
    frm = Vector(loc)
    d = -frm.normalized()
    q = d.to_track_quat('-Z', 'Y' if up == 'Y' else 'Z')
    ob.location = frm
    ob.rotation_euler = q.to_euler()
    return ob

cam_top = ortho_cam('cam_top', (0, 0, 90 * SCALE * 39), 'Y')   # dist irrelevant for ortho
cam_top.location = (0, 0, 3.2)
cam_front = ortho_cam('cam_front', (0, -3.2, 0), 'Z')
cam_left = ortho_cam('cam_left', (-3.2, 0, 0), 'Z')

pivot = bpy.data.objects.new('persp_pivot', None)
bpy.context.collection.objects.link(pivot)
cd = bpy.data.cameras.new('cam_persp'); cd.lens = 42
cam_persp = bpy.data.objects.new('cam_persp', cd)
bpy.context.collection.objects.link(cam_persp)
cam_persp.parent = pivot
p0 = Vector((60 * SCALE, -64 * SCALE, 42 * SCALE))
look_at(cam_persp, tuple(p0), (0, 0, 0))

CAMS = {'top': cam_top, 'front': cam_front, 'left': cam_left, 'persp': cam_persp}

# ---------------------------------------------------------------- timeline
ANN = [  # (pair, circle0, sweep0, label0)  -- 15f circle, 26f sweep, 10f label
    ('AB', 56, 70, 97),
    ('AC', 92, 106, 133),
    ('BC', 120, 134, 161),
]

def pose(f):
    scene.set_grid(0.55 * ease(seg(f, 1, 14)))

    # struts: P1 settles, P2/P3 travel in along their own axes
    t1 = (1 - ease_out_quint(seg(f, 1, 20))) * 0.12
    scene.pose_strut('P1', ease(seg(f, 1, 12)), travel=t1)
    t2 = (1 - ease_out_quint(seg(f, 26, 54))) * 0.62
    scene.pose_strut('P2', ease(seg(f, 26, 36)), travel=t2)
    t3 = (1 - ease_out_quint(seg(f, 60, 88))) * 0.62
    scene.pose_strut('P3', ease(seg(f, 60, 70)), travel=t3)

    # travel paths: visible while their strut approaches
    set_glow(m_path['P1'], alpha=0.35 * ease(seg(f, 1, 8)) * (1 - ease(seg(f, 20, 30))))
    set_glow(m_path['P2'], alpha=0.35 * ease(seg(f, 24, 30)) * (1 - ease(seg(f, 54, 64))))
    set_glow(m_path['P3'], alpha=0.35 * ease(seg(f, 58, 64)) * (1 - ease(seg(f, 88, 98))))
    for nm in paths:
        paths[nm].hide_render = False

    # spacer/hub seats last
    hub_u = ease(seg(f, 96, 116))
    scene.pose_hub(0.9 * hub_u, scale=0.6 + 0.4 * hub_u)

    # 45°-cut beat right after P2 seats (labels persp-only via label list)
    cut_a = ease(seg(f, 55, 62)) * (1 - ease(seg(f, 76, 84)))
    scene.pose_cut_beat(cut_a, cam_persp)

    # annotations (labels billboard to the PERSPECTIVE camera)
    for name, c0, s0, l0 in ANN:
        circle_a = ease(seg(f, c0, c0 + 12))
        sweep = ease(seg(f, s0, s0 + 25))
        label_a = ease(seg(f, l0, l0 + 9))
        scene.pose_annotation(name, circle_a, sweep, label_a, cam_persp, dim=1.0)

    # perspective turntable: -25° -> +65° over the clip
    pivot.rotation_euler = (0, 0, math.radians(-25 + 90 * (f / (FRAMES - 1))))

LABELS = [scene.ann[n]['lbl'] for n in ('AB', 'AC', 'BC')] + [scene.cut_lbl]
for lb in LABELS:                       # panes are small — labels need to be bigger
    lb.scale = (1.55, 1.55, 1.55)

def render_frame(f, outdir):
    pose(f)
    for pane, cam in CAMS.items():
        fp = os.path.join(outdir, f'{pane}_{f:04d}.png')
        if os.path.exists(fp):
            continue
        # numeric labels only in the perspective pane
        lbl_hidden_state = {}
        for lb in LABELS:
            lbl_hidden_state[lb] = lb.hide_render
            if pane != 'persp':
                lb.hide_render = True
        sc.camera = cam
        sc.render.filepath = fp
        bpy.ops.render.render(write_still=True)
        for lb, st in lbl_hidden_state.items():
            lb.hide_render = st

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    outdir = os.path.join(HERE, 'renders_B')
    os.makedirs(outdir, exist_ok=True)
    if '--stills' in sys.argv:
        for f in (12, 40, 66, 84, 110, 140, 165):
            render_frame(f, outdir)
            print('still', f, flush=True)
        composite([12, 40, 66, 84, 110, 140, 165])
    else:
        f0 = int(args[0]) if args else 0
        f1 = int(args[1]) if len(args) > 1 else FRAMES - 1
        for f in range(f0, f1 + 1):
            render_frame(f, outdir)
            print('frame', f, 'done', flush=True)
