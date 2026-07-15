# Shared scene for the node angle-annotation piece (Handoffs A + B).
#
# Canonical geometry (handoff, confirmed against the maker's node_animated.blend):
# three plate struts share a vertex at the origin, each along a cube
# face-diagonal <110> direction, each lying in a coordinate plane:
#   P1 = ( 1,-1, 0)/sqrt2   (XY plane)
#   P2 = (-1, 0, 1)/sqrt2   (XZ plane)
#   P3 = (-1, 0,-1)/sqrt2   (XZ plane)
# true angles: P1.P2 = 120, P1.P3 = 120, P2.P3 = 90 (non-coplanar, sum 330).
#
# The strut is the REAL part: node_part_45.obj (extracted from rhombi-pod.glb,
# Gregg's Single Rhomi Pod Rhino model) — flat plate, 45° mitre at the vertex
# end (local origin), hooked head at the far end, body along (-1,-1,0)/sqrt2.
#
# Annotation rules (handoff §6.5): per pair, a faint DASHED full guide circle
# (construction: declares the plane + center) then a SOLID bright arc anchored
# at the vertex sweeping ray->ray in the pair's plane with a moving tip dot,
# then a billboarded degree label on the bisector at R*1.5. No leader lines.
# Circles/arcs are 3D geometry and foreshorten with the camera; only text
# billboards.

import bpy, math, os
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
S2 = math.sqrt(0.5)

P1 = np.array([S2, -S2, 0.])
P2 = np.array([-S2, 0., S2])
P3 = np.array([-S2, 0., -S2])
A_DIR = np.array([-S2, -S2, 0.])      # part's local body direction

# palette (b) — production render palette from the handoff
BG = '#0b0c0e'
C_GREEN = '#7E9A76'; C_BLUE = '#6F86A6'; C_RED = '#7A3B3B'
C_OUTLINE = '#D8DDE2'; C_GOLD = '#D8B24A'; C_GREY = '#9AA0A6'
C_DIVIDER = '#282d34'

R_ARC = 0.38                 # guide-circle / arc radius (handoff ratios, our scale)
R_LABEL = R_ARC * 1.5
TUBE_R = 0.0075
STRUT_REACH = 0.926          # body extent from the vertex

def hexc(h, mul=1.0):
    h = h.lstrip('#')
    return tuple(((int(h[i:i + 2], 16) / 255) ** 2.2) * mul for i in (0, 2, 4))

def clamp01(x): return max(0.0, min(1.0, x))
def seg(f, a, b): return clamp01((f - a) / max(1e-9, (b - a)))
def ease(u): return u * u * (3 - 2 * u)
def ease_out_quint(u): return 1 - (1 - u) ** 5

# strut placement matrices (mitre edge AT the vertex; each plate in its plane)
ROT1 = Matrix.Rotation(math.radians(90), 4, 'Z')                      # -> P1, XY plane
ROT2 = Matrix.Rotation(math.radians(90), 4, 'Y') @ Matrix.Rotation(math.radians(90), 4, 'X')  # -> P2, XZ
ROT3 = Matrix.Rotation(math.radians(90), 4, 'X')                      # -> P3, XZ
VERTEX_GAP = 0.012           # tiny outward slide so the three mitres don't z-fight

def glow_mat(name, col, strength=2.2, alpha=1.0):
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

def member_mat(name, col):
    """translucent diagram fill with a touch of self-emission (flat, even)"""
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*hexc(col), 1)
    bsdf.inputs['Roughness'].default_value = 0.85
    bsdf.inputs['Alpha'].default_value = 0.0        # animated (fade-in)
    bsdf.inputs['Emission Color'].default_value = (*hexc(col), 1)
    bsdf.inputs['Emission Strength'].default_value = 0.10
    return m

def set_member_alpha(m, a):
    m.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value = clamp01(a)

def new_mesh_obj(name, mat, coll=None, parent=None):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    (coll or bpy.context.collection).objects.link(ob)
    ob.data.materials.append(mat)
    ob.visible_shadow = False
    if parent: ob.parent = parent
    return ob

def set_polyline_tube(ob, pts, r):
    """chain of square-section segments through pts"""
    ob.data.clear_geometry()
    if len(pts) < 2: return
    vs, fs = [], []
    k = 0
    for i in range(len(pts) - 1):
        p0, p1 = np.asarray(pts[i], float), np.asarray(pts[i + 1], float)
        d = p1 - p0; L = np.linalg.norm(d)
        if L < 1e-9: continue
        d /= L
        up = np.array([0, 0, 1.]) if abs(d[2]) < 0.95 else np.array([1, 0, 0.])
        u = np.cross(d, up); u /= np.linalg.norm(u)
        v = np.cross(d, u)
        for p in (p0, p1):
            for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                vs.append(tuple(p + u * su * r + v * sv * r))
        fs += [(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5),
               (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
               (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)]
        k += 8
    ob.data.from_pydata(vs, [], fs)

def pair_basis(u, v):
    """e1, e2 spanning the pair's plane (handoff formula)"""
    e1 = np.asarray(u, float) / np.linalg.norm(u)
    n = np.cross(e1, np.asarray(v, float)); n /= np.linalg.norm(n)
    e2 = np.cross(n, e1)
    return e1, e2

def arc_points(u, v, radius, sweep_frac, n=40):
    e1, e2 = pair_basis(u, v)
    ang = math.acos(max(-1, min(1, float(np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))))))
    return [radius * (math.cos(t) * e1 + math.sin(t) * e2)
            for t in np.linspace(0, ang * sweep_frac, n)], ang

def bisector(u, v):
    pts, ang = arc_points(u, v, 1.0, 0.5, n=2)
    return pts[-1] / np.linalg.norm(pts[-1])

def dashed_circle(ob, u, v, radius, r_tube=0.0035, dashes=36):
    """full dashed guide circle in the pair's plane"""
    e1, e2 = pair_basis(u, v)
    ob.data.clear_geometry()
    vs, fs = [], []
    k = 0
    for i in range(dashes):
        t0 = 2 * math.pi * i / dashes
        t1 = t0 + 2 * math.pi / dashes * 0.55
        p0 = radius * (math.cos(t0) * e1 + math.sin(t0) * e2)
        p1 = radius * (math.cos(t1) * e1 + math.sin(t1) * e2)
        d = p1 - p0; L = np.linalg.norm(d); d /= L
        up = np.array([0, 0, 1.]) if abs(d[2]) < 0.95 else np.array([1, 0, 0.])
        uu = np.cross(d, up); uu /= np.linalg.norm(uu)
        vv = np.cross(d, uu)
        for p in (p0, p1):
            for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                vs.append(tuple(p + uu * su * r_tube + vv * sv * r_tube))
        fs += [(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5),
               (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
               (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)]
        k += 8
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

def billboard(ob, pos, cam):
    ob.location = Vector(pos)
    ob.rotation_euler = cam.rotation_euler

def look_at(ob, frm, to):
    ob.location = Vector(frm)
    ob.rotation_euler = (Vector(to) - Vector(frm)).to_track_quat('-Z', 'Y').to_euler()


class TripodScene:
    """the shared model + annotation kit; version scripts drive pose(f)"""

    PAIRS = [  # (name, u, v, degrees)
        ('AB', P1, P2, 120),
        ('AC', P1, P3, 120),
        ('BC', P2, P3, 90),
    ]

    def __init__(self, res=(1536, 960), samples=24, fps=24, freestyle=True):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        sc = bpy.context.scene
        self.sc = sc
        sc.render.engine = 'CYCLES'
        sc.cycles.samples = samples
        sc.cycles.use_denoising = True
        sc.cycles.max_bounces = 4
        sc.render.resolution_x, sc.render.resolution_y = res
        sc.render.fps = fps; sc.render.fps_base = 1
        sc.view_settings.view_transform = 'Standard'
        sc.render.film_transparent = False

        world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
        wb = world.node_tree.nodes['Background']
        wb.inputs[0].default_value = (*hexc(BG), 1); wb.inputs[1].default_value = 1.0

        for name, loc, rot, size, power, col in (
                ('key', (2.0, -2.2, 2.6), (-40, 28, 0), 5.0, 420, (1, 1, 1)),
                ('fill', (-2.6, -1.2, 1.8), (-35, -44, 0), 6.0, 200, (0.85, 0.9, 1)),
                ('top', (0.3, 0.6, 3.2), (10, 4, 0), 6.0, 260, (1, 1, 1))):
            li = bpy.data.lights.new(name, 'AREA')
            li.size = size; li.energy = power; li.color = col
            ob = bpy.data.objects.new(name, li)
            ob.location = loc; ob.rotation_euler = tuple(math.radians(a) for a in rot)
            bpy.context.collection.objects.link(ob)

        # collection for the model only (freestyle outlines apply here)
        self.model_coll = bpy.data.collections.new('MODEL')
        sc.collection.children.link(self.model_coll)

        # ---- struts: three linked duplicates of the REAL part
        bpy.ops.wm.obj_import(filepath=os.path.join(HERE, 'node_part_45.obj'),
                              forward_axis='Y', up_axis='Z')
        base = bpy.context.selected_objects[0]
        # local coords: staged (origin = mitre edge, body along A_DIR)
        RS = np.array([[0., 0, 1], [0, 1, 0], [-1, 0, 0]])
        C0 = np.array([0.016333, 1.169001, -0.511741])
        S4 = Matrix(((RS[0][0], RS[0][1], RS[0][2], float(-(RS @ C0)[0])),
                     (RS[1][0], RS[1][1], RS[1][2], float(-(RS @ C0)[1])),
                     (RS[2][0], RS[2][1], RS[2][2], float(-(RS @ C0)[2])),
                     (0, 0, 0, 1)))
        base.data.transform(S4 @ base.matrix_world)
        base.matrix_world = Matrix.Identity(4)
        for c in list(base.users_collection):
            c.objects.unlink(base)
        self.model_coll.objects.link(base)

        self.mats = {'P1': member_mat('m1', C_GREEN),
                     'P2': member_mat('m2', C_BLUE),
                     'P3': member_mat('m3', C_RED)}
        base.name = 'Strut_P1'
        base.data.materials.clear(); base.data.materials.append(self.mats['P1'])
        self.struts = {'P1': base}
        for nm, rot, mat in (('P2', ROT2, 'P2'), ('P3', ROT3, 'P3')):
            ob = bpy.data.objects.new('Strut_' + nm, base.data)
            self.model_coll.objects.link(ob)
            ob.material_slots[0].link = 'OBJECT'
            ob.material_slots[0].material = self.mats[mat]
            self.struts[nm] = ob
        self.rots = {'P1': ROT1, 'P2': ROT2, 'P3': ROT3}
        self.rays = {'P1': P1, 'P2': P2, 'P3': P3}

        # ---- hub (the node) — the maker's Spacer stand-in
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.062, segments=32, ring_count=16)
        hub = bpy.context.active_object
        for c in list(hub.users_collection):
            c.objects.unlink(hub)
        self.model_coll.objects.link(hub)
        hub.name = 'Node_hub'
        bpy.ops.object.shade_smooth()
        self.mats['hub'] = member_mat('mhub', C_GREY)
        hub.data.materials.clear(); hub.data.materials.append(self.mats['hub'])
        self.hub = hub

        # ---- floor grid (faint, receding)
        self.m_grid = glow_mat('grid', '#1d242c', 0.9, alpha=0.0)
        gridob = new_mesh_obj('grid', self.m_grid)
        vs, fs = [], []
        k = 0
        r, step, w, gz = 1.8, 0.225, 0.0018, -1.05
        n = int(round(2 * r / step))
        for i in range(n + 1):
            c = -r + i * step
            for (x0, y0, x1, y1) in ((c, -r, c, r), (-r, c, r, c)):
                u = np.array([x1 - x0, y1 - y0, 0.])
                L = np.linalg.norm(u); u /= L
                p = np.cross(u, [0, 0, 1.])
                a = np.array([x0, y0, gz])
                for q in (a - p * w, a + u * L - p * w, a + u * L + p * w, a + p * w):
                    vs.append(tuple(q))
                fs.append((k, k + 1, k + 2, k + 3)); k += 4
        gridob.data.from_pydata(vs, [], fs)

        # ---- annotation kit: per pair a guide circle, arc, tip, label
        self.ann = {}
        for name, u, v, deg in self.PAIRS:
            mg = glow_mat('guide_' + name, C_GOLD, 1.1, alpha=0.0)
            ma = glow_mat('arc_' + name, C_GOLD, 3.0, alpha=0.0)
            ml = glow_mat('lblm_' + name, C_GOLD, 3.0, alpha=0.0)
            circ = new_mesh_obj('circle_' + name, mg)
            dashed_circle(circ, u, v, R_ARC)
            arc = new_mesh_obj('arc_' + name, ma)
            tip = new_mesh_obj('tip_' + name, ma)
            lbl = new_text('lbl_' + name, f'{deg}°', ml, size=0.105)
            self.ann[name] = dict(u=u, v=v, deg=deg, circ=circ, arc=arc,
                                  tip=tip, lbl=lbl, mg=mg, ma=ma, ml=ml)

        # 45°-cut causal beat: ticks along the two mitre edges + label
        self.m_cut = glow_mat('cut', C_GOLD, 2.6, alpha=0.0)
        self.cut_ticks = new_mesh_obj('cut_ticks', self.m_cut)
        self.cut_lbl = new_text('cut_lbl', '45° + 45° CUT', self.m_cut, size=0.058)

        if freestyle:
            sc.render.use_freestyle = True
            sc.render.line_thickness_mode = 'ABSOLUTE'
            vl = sc.view_layers[0]
            vl.use_freestyle = True
            fs_ = vl.freestyle_settings
            for stray in list(fs_.linesets):     # enabling freestyle auto-adds a
                fs_.linesets.remove(stray)       # styleless 'LineSet' that breaks
            ls = fs_.linesets.new('outline')     # headless interpretation
            ls.select_silhouette = True; ls.select_border = True
            ls.select_crease = True; ls.select_edge_mark = False
            ls.select_by_collection = True
            ls.collection = self.model_coll
            ls.collection_negation = 'INCLUSIVE'
            if ls.linestyle is None:      # headless bpy creates no default style
                ls.linestyle = bpy.data.linestyles.new('outline_style')
            lst = ls.linestyle
            lst.color = hexc(C_OUTLINE, 1.0)
            lst.thickness = 1.3
            lst.alpha = 0.9

        self.cam = bpy.data.objects.new('cam', bpy.data.cameras.new('c'))
        bpy.context.collection.objects.link(self.cam)
        sc.camera = self.cam

    # ---------- per-frame drivers ------------------------------------------
    def strut_matrix(self, nm, travel=0.0):
        """travel = extra outward offset along the ray (0 = seated)"""
        off = Vector(self.rays[nm] * (VERTEX_GAP + travel))
        return Matrix.Translation(off) @ self.rots[nm]

    def pose_strut(self, nm, alpha, travel=0.0):
        self.struts[nm].matrix_world = self.strut_matrix(nm, travel)
        set_member_alpha(self.mats[nm], alpha)
        self.struts[nm].hide_render = alpha < 0.02

    def pose_annotation(self, name, circle_a, sweep, label_a, cam, dim=1.0):
        a = self.ann[name]
        set_glow(a['mg'], alpha=circle_a * 0.55 * dim)
        a['circ'].hide_render = circle_a < 0.02
        if sweep > 0.001:
            pts, ang = arc_points(a['u'], a['v'], R_ARC, sweep)
            set_polyline_tube(a['arc'], pts, TUBE_R)
            a['arc'].hide_render = False
            # moving tip dot
            tipp = pts[-1]
            self._set_dot(a['tip'], tipp, 0.014)
            a['tip'].hide_render = not (0.001 < sweep < 0.999)
        else:
            a['arc'].hide_render = True; a['tip'].hide_render = True
        set_glow(a['ma'], alpha=(0.95 if sweep > 0.001 else 0.0) * dim)
        set_glow(a['ml'], alpha=label_a * dim)
        if label_a > 0.02:
            b = bisector(a['u'], a['v'])
            billboard(a['lbl'], b * R_LABEL, cam)
            a['lbl'].hide_render = False
        else:
            a['lbl'].hide_render = True

    def _set_dot(self, ob, p, r):
        ob.data.clear_geometry()
        vs, fs = [], []
        N = 10
        for i in range(N):
            a0 = 2 * math.pi * i / N; a1 = 2 * math.pi * (i + 1) / N
            vs += [tuple(p + np.array([math.cos(a0), math.sin(a0), 0]) * r),
                   tuple(p + np.array([math.cos(a1), math.sin(a1), 0]) * r),
                   tuple(p + np.array([0, 0, 1.]) * r), tuple(p - np.array([0, 0, 1.]) * r)]
        k = 0
        for i in range(N):
            fs += [(k, k + 1, k + 2), (k + 1, k, k + 3)]
            k += 4
        ob.data.from_pydata(vs, [], fs)

    def pose_cut_beat(self, alpha, cam):
        """gold ticks tracing the two 45° mitre edges of P1/P2 + label"""
        set_glow(self.m_cut, alpha=alpha)
        if alpha < 0.02:
            self.cut_ticks.hide_render = True; self.cut_lbl.hide_render = True
            return
        self.cut_ticks.hide_render = False; self.cut_lbl.hide_render = False
        pts = []
        segs = []
        for nm in ('P1', 'P2'):
            M = np.array(self.strut_matrix(nm))
            e0 = M[:3, :3] @ np.array([-0.10, 0, 0]) + M[:3, 3]
            e1 = M[:3, :3] @ np.array([0.10, 0, 0]) + M[:3, 3]
            segs.append((e0, e1))
        # two separate ticks in one mesh
        self.cut_ticks.data.clear_geometry()
        vs, fs = [], []
        k = 0
        for (p0, p1) in segs:
            d = p1 - p0; L = np.linalg.norm(d); d /= L
            up = np.array([0, 0, 1.]) if abs(d[2]) < 0.95 else np.array([1, 0, 0.])
            uu = np.cross(d, up); uu /= np.linalg.norm(uu)
            vv = np.cross(d, uu)
            r = 0.006
            for p in (p0, p1):
                for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                    vs.append(tuple(p + uu * su * r + vv * sv * r))
            fs += [(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5),
                   (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
                   (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)]
            k += 8
        self.cut_ticks.data.from_pydata(vs, [], fs)
        billboard(self.cut_lbl, np.array([0.02, -0.30, 0.30]), cam)

    def pose_hub(self, alpha, scale=1.0):
        set_member_alpha(self.mats['hub'], alpha)
        self.hub.hide_render = alpha < 0.02
        self.hub.scale = (scale, scale, scale)

    def set_grid(self, alpha):
        set_glow(self.m_grid, alpha=alpha)
