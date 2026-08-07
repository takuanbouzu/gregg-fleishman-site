# INS_01 revision — "The fold makes 120°" — built and rendered NATIVELY in Blender.
#
# Replaces the rejected generic-strut animation with Gregg Fleishman's actual
# node geometry: one of the "NODE PARTS/45" solids from his `Single Rhomi Pod
# STEP` Rhino model (via assets/models/rhombi-pod.glb, extracted to
# node_part_45.obj by extract_node_part.py — proportions untouched).
#
# Everything is exact by construction, measured from the source model:
#   * every 45-part centerline runs along a cube FACE DIAGONAL (45° to the axes)
#   * two parts mated in one plane meet at exactly 90°  (45° + 45°)
#   * the built condition (Mesh_48 vs Mesh_51 in the pod) has the centerlines
#     at exactly 120°, touching along one shared edge across the plank width
#   * rotating the built pair by exactly 90° about that shared edge lays the
#     second part flat into the first part's plane — so the 90° -> 120° fold is
#     ONE rotation about the REAL connection edge (verified to 1e-4 units)
#
# Node_B is a linked duplicate of Node_A (same mesh datablock); its final pose
# is the measured rigid transform between the two instances in the pod
# (congruence residual 1e-4 = int16 quantization noise). Both objects' origins
# sit ON the rotation axis (the world origin is the hinge point; the fold is a
# pure rotation about the world X axis, which is the shared edge).
#
# Run (after `pip install bpy numpy`):
#   python3 ins01_node_fold.py                 # render all 720 frames -> renders/
#   python3 ins01_node_fold.py 0 719           # explicit frame range (resumable;
#                                              #   existing PNGs are skipped)
#   python3 ins01_node_fold.py --stills        # QC keyframes -> stills/
# Encode (exact 30000/1001 fps, fade in/out at encode time):
#   see encode_master.sh

import bpy, math, os, sys
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OBJ = os.path.join(HERE, 'node_part_45.obj')

FRAMES = 720                      # 24.024 s @ 30000/1001
RES = (1920, 1080)
SAMPLES = 36

# ---------------------------------------------------------------- exact data
# (pod coordinates, measured from rhombi-pod.glb)
C0 = np.array([0.016333, 1.169001, -0.511741])       # shared-edge (hinge) point
R0 = np.array([[0., 1, 0], [1, 0, 0], [0, 0, -1]])   # Node_A -> Node_B rotation
T0 = np.array([-1.149016813489074, 1.148884061884747, -1.0312921609196155])

# staging: pod -> world.  world X = the shared edge, world origin = hinge point,
# fold plane horizontal, Node_B folds UP (+Z).
RS = np.array([[0., 0, 1], [0, 1, 0], [-1, 0, 0]])

SQ2 = math.sqrt(0.5)
A_DIR = np.array([-SQ2, -SQ2, 0.])   # Node_A body direction (staged, exact)
B_FLAT = np.array([SQ2, -SQ2, 0.])   # Node_B body direction, flat state
EDGE_NEG = np.array([-1., 0, 0])     # shared-edge direction at Node_A's head
SLIDE = 0.42                         # start separation along B_FLAT

# palette (assets/gf-tokens.css)
BG = (0.0065, 0.0085, 0.0105)
COL_A = '#6f9bc4'      # face-diagonal blue
COL_B = '#db684d'      # space/terracotta
COL_GOLD = '#c9a24b'   # angle gold
COL_TX = '#e5e0d4'     # parchment

def hexc(h, mul=1.0):
    h = h.lstrip('#')
    return tuple(((int(h[i:i + 2], 16) / 255) ** 2.2) * mul for i in (0, 2, 4))

# ---------------------------------------------------------------- easing
def clamp01(x): return max(0.0, min(1.0, x))
def seg(f, a, b): return clamp01((f - a) / max(1e-9, (b - a)))
def ease(u): return u * u * (3 - 2 * u)
def ease_io_quint(u):
    return 16 * u ** 5 if u < 0.5 else 1 - ((-2 * u + 2) ** 5) / 2
def ease_out_quint(u): return 1 - (1 - u) ** 5

# ---------------------------------------------------------------- scene build
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 6
sc.render.resolution_x, sc.render.resolution_y = RES
sc.render.fps = 30000; sc.render.fps_base = 1001
sc.view_settings.view_transform = 'Standard'

world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
wbg = world.node_tree.nodes['Background']
wbg.inputs[0].default_value = (*BG, 1); wbg.inputs[1].default_value = 1.0

def area_light(name, loc, rot, size, power, color=(1, 1, 1)):
    li = bpy.data.lights.new(name, 'AREA')
    li.size = size; li.energy = power; li.color = color
    ob = bpy.data.objects.new(name, li)
    ob.location = loc; ob.rotation_euler = rot
    bpy.context.collection.objects.link(ob)
    return ob

area_light('key',  (2.4, -2.8, 3.0), (math.radians(-38), math.radians(30), 0), 4.0, 900)
area_light('fill', (-3.0, -1.6, 2.0), (math.radians(-35), math.radians(-46), 0), 6.0, 230, (0.82, 0.88, 1.0))
area_light('rim',  (0.6, 3.0, 2.2), (math.radians(55), math.radians(8), 0), 3.0, 380, (1.0, 0.95, 0.86))

cam_d = bpy.data.cameras.new('cam'); cam_d.angle = math.radians(36)
cam = bpy.data.objects.new('cam', cam_d)
bpy.context.collection.objects.link(cam); sc.camera = cam

def look_at(ob, frm, to):
    ob.location = Vector(frm)
    ob.rotation_euler = (Vector(to) - Vector(frm)).to_track_quat('-Z', 'Y').to_euler()

# ---- materials -------------------------------------------------------------
def plank_mat(name, col):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*hexc(col), 1)
    bsdf.inputs['Roughness'].default_value = 0.55
    bev = nt.nodes.new('ShaderNodeBevel'); bev.samples = 4
    bev.inputs['Radius'].default_value = 0.004
    nt.links.new(bev.outputs['Normal'], bsdf.inputs['Normal'])
    return m

def glow_mat(name, col, strength=2.2, alpha=1.0):
    """emission/transparent mix; per-frame alpha + strength via set_glow"""
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    mix = nt.nodes.new('ShaderNodeMixShader')
    tra = nt.nodes.new('ShaderNodeBsdfTransparent')
    emi = nt.nodes.new('ShaderNodeEmission')
    emi.inputs['Color'].default_value = (*hexc(col), 1)
    emi.inputs['Strength'].default_value = strength
    nt.links.new(tra.outputs[0], mix.inputs[1])
    nt.links.new(emi.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    mix.inputs['Fac'].default_value = alpha
    return m

def set_glow(m, alpha=None, strength=None):
    nt = m.node_tree
    mix = next(n for n in nt.nodes if n.type == 'MIX_SHADER')
    emi = next(n for n in nt.nodes if n.type == 'EMISSION')
    if alpha is not None: mix.inputs['Fac'].default_value = clamp01(alpha)
    if strength is not None: emi.inputs['Strength'].default_value = strength

MAT_A = plank_mat('plankA', COL_A)
MAT_B = plank_mat('plankB', COL_B)
MAT_GHOST = glow_mat('ghost', COL_B, strength=0.55, alpha=0.0)

# ---- the node part (one shared mesh datablock -> true linked duplicates) ---
bpy.ops.wm.obj_import(filepath=OBJ, forward_axis='Y', up_axis='Z')
part = bpy.context.selected_objects[0]
part.name = 'Node_A'
# bake staging into the mesh: local coords = staged coords, origin = hinge point
S4 = Matrix(((RS[0][0], RS[0][1], RS[0][2], float(-(RS @ C0)[0])),
             (RS[1][0], RS[1][1], RS[1][2], float(-(RS @ C0)[1])),
             (RS[2][0], RS[2][1], RS[2][2], float(-(RS @ C0)[2])),
             (0, 0, 0, 1)))
part.data.transform(S4 @ part.matrix_world)
part.matrix_world = Matrix.Identity(4)
part.data.materials.clear(); part.data.materials.append(MAT_A)

node_a = part
node_b = bpy.data.objects.new('Node_B', part.data)      # linked duplicate
bpy.context.collection.objects.link(node_b)
node_ghost = bpy.data.objects.new('Node_B_ghost', part.data)
bpy.context.collection.objects.link(node_ghost)
node_ghost.visible_shadow = False

for ob, mat in ((node_b, MAT_B), (node_ghost, MAT_GHOST)):
    ob.material_slots[0].link = 'OBJECT'
    ob.material_slots[0].material = mat

# Node_B final pose in staged space: Q = S ∘ [R0|T0] ∘ S⁻¹
M_pod = Matrix(((R0[0][0], R0[0][1], R0[0][2], T0[0]),
                (R0[1][0], R0[1][1], R0[1][2], T0[1]),
                (R0[2][0], R0[2][1], R0[2][2], T0[2]),
                (0, 0, 0, 1)))
Q = S4 @ M_pod @ S4.inverted()
# the pose must carry the part's head-edge direction onto the world X axis
# (the shared edge) — the fold axis is real geometry, not an eyeballed line
_qx = Q.to_3x3() @ Vector((1, 0, 0))
assert min((_qx - Vector((1, 0, 0))).length, (_qx + Vector((1, 0, 0))).length) < 1e-6

def b_matrix(psi_deg, slide=0.0):
    """Node_B pose: fold angle psi (90 = flat, 0 = built) about the world X
    axis — the real shared edge through the origin — plus the approach slide."""
    M = Matrix.Rotation(math.radians(psi_deg), 4, 'X') @ Q
    if slide:
        M = Matrix.Translation(Vector(B_FLAT * slide)) @ M
    return M

# ---- annotation helpers -----------------------------------------------------
def new_mesh_obj(name, mat, parent=None):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    if parent: ob.parent = parent
    return ob

def set_tube(ob, p0, p1, r):
    """thin square-section tube from p0 to p1"""
    p0, p1 = np.array(p0, float), np.array(p1, float)
    d = p1 - p0; L = np.linalg.norm(d)
    ob.data.clear_geometry()
    if L < 1e-9:
        return
    d /= L
    up = np.array([0, 0, 1.]) if abs(d[2]) < 0.95 else np.array([1, 0, 0.])
    u = np.cross(d, up); u /= np.linalg.norm(u)
    v = np.cross(d, u)
    vs = []
    for p in (p0, p1):
        for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            vs.append(tuple(p + u * su * r + v * sv * r))
    fs = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    ob.data.from_pydata(vs, [], fs)

def slerp_dir(d0, d1, t):
    d0 = np.asarray(d0, float); d0 = d0 / np.linalg.norm(d0)
    d1 = np.asarray(d1, float); d1 = d1 / np.linalg.norm(d1)
    ang = math.acos(max(-1, min(1, float(d0 @ d1)))) * t
    n = np.cross(d0, d1); nl = np.linalg.norm(n)
    if nl < 1e-12: return d0
    n /= nl
    return (d0 * math.cos(ang) + np.cross(n, d0) * math.sin(ang)
            + n * float(n @ d0) * (1 - math.cos(ang)))

def set_arc(ob, apex, d0, d1, radius, sweep=1.0, width=0.011):
    """flat ribbon arc from direction d0 to d1 around apex, partial by sweep"""
    apex = np.asarray(apex, float)
    ob.data.clear_geometry()
    N = 28
    vs, fs = [], []
    for i in range(N + 1):
        d = slerp_dir(d0, d1, sweep * i / N)
        for r in (radius - width, radius + width):
            vs.append(tuple(apex + d * r))
    for i in range(N):
        a = 2 * i
        fs.append((a, a + 1, a + 3, a + 2))
    ob.data.from_pydata(vs, [], fs)

def new_text(name, body, mat, size=0.075, align='CENTER'):
    cu = bpy.data.curves.new(name, 'FONT')
    cu.body = body; cu.size = size
    cu.align_x = align; cu.align_y = 'CENTER'
    ob = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    return ob

def billboard(ob, pos):
    ob.location = Vector(pos)
    ob.rotation_euler = cam.rotation_euler

# ---- static dressing --------------------------------------------------------
MAT_GRID = glow_mat('grid', '#22303c', 0.9, alpha=0.0)
MAT_AXIS = glow_mat('axis', '#4a5866', 1.4, alpha=0.0)
MAT_GOLD = glow_mat('gold', COL_GOLD, 2.4, alpha=0.0)       # centerlines + 45° arcs/labels
MAT_MAIN = glow_mat('main', COL_GOLD, 2.4, alpha=0.0)       # live angle arc + readout
MAT_EDGE = glow_mat('edgeflash', '#ffe6a8', 4.5, alpha=0.0)
MAT_RING = glow_mat('ring', COL_GOLD, 3.2, alpha=0.0)
MAT_LBLA = glow_mat('lblA', COL_A, 2.0, alpha=0.0)
MAT_LBLB = glow_mat('lblB', COL_B, 2.0, alpha=0.0)
MAT_CAP = glow_mat('cap', COL_TX, 1.6, alpha=0.0)
MAT_DIM = glow_mat('dim', '#8a93a0', 1.3, alpha=0.0)

GZ = -0.06
grid = new_mesh_obj('grid', MAT_GRID)
def build_grid():
    vs, fs = [], []
    r, step, w = 1.6, 0.2, 0.0022
    k = 0
    n = int(round(2 * r / step))
    for i in range(n + 1):
        c = -r + i * step
        for (x0, y0, x1, y1) in ((c, -r, c, r), (-r, c, r, c)):
            u = np.array([x1 - x0, y1 - y0, 0.])
            L = np.linalg.norm(u); u /= L
            p = np.cross(u, [0, 0, 1.])
            a = np.array([x0, y0, GZ])
            for q in (a - p * w, a + u * L - p * w, a + u * L + p * w, a + p * w):
                vs.append(tuple(q))
            fs.append((k, k + 1, k + 2, k + 3)); k += 4
    grid.data.from_pydata(vs, [], fs)
build_grid()

axis_lbls = []
AX0 = np.array([-1.42, -1.42, GZ])
for dname, d in (('X', (1, 0, 0)), ('Y', (0, 1, 0)), ('Z', (0, 0, 1))):
    t = new_mesh_obj('ax' + dname, MAT_AXIS)
    set_tube(t, AX0, AX0 + np.array(d, float) * 0.34, 0.004)
    lbl = new_text('axl' + dname, dname, MAT_DIM, size=0.055)
    axis_lbls.append((lbl, AX0 + np.array(d, float) * 0.42))

# centerlines + 45° arcs live in the part's LOCAL space and are parented to the
# nodes, so the same real feature lines render on both instances and travel
# with Node_B automatically. (local A_DIR = the centerline; local -X = the
# head's shared-edge direction; the pose maps them onto Node_B's true features)
CL_LIFT = np.array([0., 0., 0.022])
CL_LEN = 0.93          # exact body extent from the hinge (measured: 0.926)
line_a = new_mesh_obj('cl_A', MAT_GOLD, parent=node_a)
line_b = new_mesh_obj('cl_B', MAT_GOLD, parent=node_b)
arc45a = new_mesh_obj('arc45_A', MAT_GOLD, parent=node_a)
arc45b = new_mesh_obj('arc45_B', MAT_GOLD, parent=node_b)
edge_a = new_mesh_obj('edge_A', MAT_GOLD, parent=node_a)   # edge-direction reference leg
edge_b = new_mesh_obj('edge_B', MAT_GOLD, parent=node_b)

# main live angle arc (world; apex = the hinge point = origin)
arc_main = new_mesh_obj('arc_main', MAT_MAIN)

# hinge edge highlight + registration ring (the real shared edge is 0.192 long)
hinge_edge = new_mesh_obj('hinge_edge', MAT_EDGE)
set_tube(hinge_edge, (-0.096, 0, 0), (0.096, 0, 0), 0.0065)
ring = new_mesh_obj('ring', MAT_RING)
def build_ring():
    vs, fs = [], []
    N, R, r = 40, 0.05, 0.0045
    for i in range(N):
        a = 2 * math.pi * i / N
        c = np.array([0., R * math.cos(a), R * math.sin(a)])
        cr = c / np.linalg.norm(c)
        for j in range(4):
            b = 2 * math.pi * j / 4
            vs.append(tuple(c + np.array([1., 0, 0]) * r * math.cos(b) + cr * r * math.sin(b)))
    for i in range(N):
        for j in range(4):
            a0 = i * 4 + j; a1 = i * 4 + (j + 1) % 4
            b0 = ((i + 1) % N) * 4 + j; b1 = ((i + 1) % N) * 4 + (j + 1) % 4
            fs.append((a0, a1, b1, b0))
    ring.data.from_pydata(vs, [], fs)
build_ring()

# texts
txt_45a = new_text('t45a', '45°', MAT_GOLD, size=0.085)
txt_45b = new_text('t45b', '45°', MAT_GOLD, size=0.085)
txt_ang = new_text('tang', '90°', MAT_MAIN, size=0.15)
txt_na = new_text('tna', 'NODE A', MAT_LBLA, size=0.062)
txt_nb = new_text('tnb', 'NODE B', MAT_LBLB, size=0.062)

# camera-anchored chrome (eyebrow + caption)
def cam_text(name, body, mat, size, off, align):
    ob = new_text(name, body, mat, size=size, align=align)
    ob.parent = cam
    ob.location = Vector(off)
    return ob
eyebrow = cam_text('eyebrow', 'MEASURED JOINT — NODE PART / 45', MAT_DIM, 0.020, (-0.42, 0.225, -1.55), 'LEFT')
caption = cam_text('caption', '', MAT_CAP, 0.030, (0.0, -0.220, -1.55), 'CENTER')

# ---------------------------------------------------------------- the pose fn
CAPTIONS = [
    (18, 195, 'One node part, duplicated — each head carries the 45° cut'),
    (205, 330, 'The heads register on the shared edge'),
    (338, 410, 'In the plane, two 45° cuts meet at 90°'),
    (418, 598, 'Folding about the shared edge…'),
    (604, 719, '45° + 45°, folded — the joint resolves at 120°'),
]

ARC45_MID = slerp_dir(EDGE_NEG, A_DIR, 0.5)

def pose(f):
    # ---------- timeline scalars
    intro = ease(seg(f, 6, 40))
    lbl_nodes = seg(f, 30, 70) * (1 - seg(f, 560, 600))
    cl_grow = ease(seg(f, 85, 130))
    a45 = ease(seg(f, 135, 180))
    slide_u = ease_out_quint(seg(f, 205, 300))
    slide = SLIDE * (1 - slide_u)
    flash = math.exp(-((f - 302) / 9.0) ** 2) if f >= 296 else 0.0
    ring_u = seg(f, 300, 322)
    main_sweep = ease(seg(f, 335, 366))
    fold_u = ease(seg(f, 415, 585))
    psi = 90.0 * (1 - fold_u)
    ghost_a = max(0.0, (seg(f, 415, 430) - seg(f, 552, 592))) * 0.16
    final_pump = 1 + 1.1 * ease(seg(f, 604, 632))

    # ---------- node poses
    node_b.matrix_world = b_matrix(psi, slide)
    node_ghost.matrix_world = b_matrix(90.0, 0.0)
    node_ghost.hide_render = ghost_a <= 0.002
    set_glow(MAT_GHOST, alpha=ghost_a)

    # ---------- centerlines + 45° arcs (local space, both instances)
    p0 = CL_LIFT.copy()
    p1 = A_DIR * (CL_LEN * cl_grow) + CL_LIFT
    for ln in (line_a, line_b):
        set_tube(ln, p0, p1, 0.0045)
        ln.hide_render = cl_grow < 0.02
    for ar in (arc45a, arc45b):
        set_arc(ar, (0, 0, 0.02), EDGE_NEG, A_DIR, 0.34, sweep=a45)
        ar.hide_render = a45 < 0.02
    for eg in (edge_a, edge_b):
        set_tube(eg, np.array([-0.02, 0, 0.022]), np.array([-0.46 * a45, 0, 0.022]), 0.003)
        eg.hide_render = a45 < 0.02
    gold_a = a45 * intro
    if f >= 205:
        gold_a *= 1 - 0.6 * seg(f, 205, 245)          # dim once the action starts
    gold_a *= 1 - 0.6 * seg(f, 640, 690)              # recede for the finale
    set_glow(MAT_GOLD, alpha=max(cl_grow * 0.9 * intro if f < 205 else 0.0, gold_a))

    # ---------- main live angle arc between the two body directions
    b_now = np.array(node_b.matrix_world.to_3x3() @ Vector(A_DIR))
    b_now /= np.linalg.norm(b_now)
    if main_sweep > 0.01:
        arc_main.hide_render = False
        set_arc(arc_main, (0, 0, 0), A_DIR, b_now, 0.46, sweep=main_sweep, width=0.013)
    else:
        arc_main.hide_render = True
    set_glow(MAT_MAIN, alpha=main_sweep * intro, strength=2.4 * final_pump)

    # ---------- hinge edge flash + registration ring at the snap
    hinge_edge.hide_render = flash < 0.02
    set_glow(MAT_EDGE, alpha=flash)
    if 0.0 < ring_u < 1.0:
        ring.hide_render = False
        s = 0.6 + 1.5 * ring_u
        ring.scale = (s, s, s)
        set_glow(MAT_RING, alpha=(1 - ring_u) * 0.9)
    else:
        ring.hide_render = True

    # ---------- camera (three-quarter; gentle drift, lifts with the fold)
    cam_u = ease(seg(f, 0, 300))
    lift = ease(seg(f, 430, 600))
    frm = (np.array([0.62, -3.55, 1.92]) * (1 - cam_u) + np.array([0.46, -3.62, 1.98]) * cam_u
           + np.array([0.95, 0.62, 0.50]) * lift)          # orbit + rise so the fold reads in depth
    to = np.array([0.02, -0.52, 0.08]) + np.array([0.08, 0.16, 0.30]) * lift
    look_at(cam, tuple(frm), tuple(to))

    # ---------- texts (billboards; after the camera is posed)
    pa = ARC45_MID * 0.46 + np.array([0, 0, 0.06])
    billboard(txt_45a, pa)
    bm = node_b.matrix_world
    pb_local = Vector(ARC45_MID * 0.46 + np.array([0, 0, 0.02]))
    billboard(txt_45b, np.array(bm @ pb_local) + np.array([0, 0, 0.04]))
    txt_45a.hide_render = txt_45b.hide_render = a45 < 0.02 or f > 430

    ang = math.degrees(math.acos(max(-1, min(1, float(A_DIR @ b_now)))))
    txt_ang.data.body = f'{ang:.0f}°'
    billboard(txt_ang, slerp_dir(A_DIR, b_now, 0.5) * 0.62 + np.array([0, 0, 0.03]))
    txt_ang.hide_render = main_sweep < 0.25

    billboard(txt_na, A_DIR * 1.16 + np.array([0, 0, 0.14]))
    billboard(txt_nb, np.array(bm @ Vector(A_DIR * 1.16)) + np.array([0, 0, 0.14]))
    set_glow(MAT_LBLA, alpha=lbl_nodes); set_glow(MAT_LBLB, alpha=lbl_nodes)
    txt_na.hide_render = txt_nb.hide_render = lbl_nodes < 0.02

    # captions
    cap, ca = '', 0.0
    for (f0, f1, s) in CAPTIONS:
        if f0 <= f <= f1:
            cap = s
            ca = seg(f, f0, f0 + 18) * (1 - seg(f, f1 - 12, f1))
    caption.data.body = cap
    set_glow(MAT_CAP, alpha=ca * 0.95)
    set_glow(MAT_DIM, alpha=0.8 * intro)

    for lbl, p in axis_lbls:
        billboard(lbl, p)
    set_glow(MAT_GRID, alpha=0.75 * intro)
    set_glow(MAT_AXIS, alpha=0.9 * intro)

# ---------------------------------------------------------------- render loop
def render_range(f0, f1, outdir):
    os.makedirs(outdir, exist_ok=True)
    for f in range(f0, f1 + 1):
        fp = os.path.join(outdir, f'f_{f:04d}.png')
        if os.path.exists(fp):
            continue
        pose(f)
        sc.render.filepath = fp
        bpy.ops.render.render(write_still=True)
        print('frame', f, 'done', flush=True)

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if '--stills' in sys.argv:
        outdir = os.path.join(HERE, 'stills')
        os.makedirs(outdir, exist_ok=True)
        for f in (20, 120, 190, 260, 310, 350, 470, 540, 650):
            pose(f)
            sc.render.filepath = os.path.join(outdir, f'still_{f:04d}.png')
            bpy.ops.render.render(write_still=True)
            print('still', f, flush=True)
    else:
        f0 = int(args[0]) if len(args) > 0 else 0
        f1 = int(args[1]) if len(args) > 1 else FRAMES - 1
        render_range(f0, f1, os.path.join(HERE, 'renders'))
