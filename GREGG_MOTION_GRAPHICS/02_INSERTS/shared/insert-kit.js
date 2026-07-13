// Shared kit for the six inserts — deterministic-clock plumbing, computed
// geometry (TO / RD / cube / parametric truncation), DOM labels, easing.
// Everything is a pure function of t; nothing reads the wall clock.
import * as THREE from 'three';
export { THREE };

export const clamp01 = x => Math.max(0, Math.min(1, x));
export const seg = (t, a, b) => clamp01((t - a) / (b - a));
export const ease = t => t * t * (3 - 2 * t);
export const easeOut = t => 1 - Math.pow(1 - t, 3);

const SC = window.GF_SCENE.dark;
export const COL = {
  unit: SC.unit, face: SC.face, space: SC.space, tri: SC.tri, angle: SC.angle,
  ghost: '#3a423f',
};

// ---------- stage ----------
// UI (text/label) scale — set from the render height vs the 448 design height,
// so fixed-px labels stay proportional at any resolution. Read by domLabel/caption.
let _ui = 1;
export const ui = () => _ui;

export function stage({ frames, width = 848, height = 448 }) {
  // Resolution can be overridden per-render via ?w=1920&h=1080 (defaults to the
  // 848×448 source size). The scenes are computed/vector, so any size is crisp.
  const q = new URLSearchParams(location.search);
  width = parseInt(q.get('w')) || width;
  height = parseInt(q.get('h')) || height;
  _ui = height / 448;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 1);
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
  const fadeEl = document.createElement('div');
  fadeEl.style.cssText = 'position:fixed;inset:0;background:#000;pointer-events:none;z-index:50';
  document.body.appendChild(fadeEl);
  return { renderer, scene, camera, fadeEl, frames, width, height };
}

export function expose(st, pose, { fadeFrames = 10 } = {}) {
  const { renderer, scene, camera, fadeEl, frames, width, height } = st;
  function seek(f) {
    const t = f * 1001 / 30000;
    pose(t, f);
    renderer.render(scene, camera);
    const fade = Math.min(1, f / fadeFrames, (frames - 1 - f) / fadeFrames);
    fadeEl.style.opacity = String(1 - fade);
  }
  const fonts = document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve();
  window.INSERT = {
    fps: 30000 / 1001, frames, width, height, seek,
    // scene/camera exposed for the SVG (vector) exporter — 00_ADMIN/svg_export.mjs
    // walks these after each seek(); harmless extra props for the raster harness.
    scene, camera, fadeFrames,
    ready: Promise.resolve(fonts).then(() => seek(0)),
  };
}

// Multiply a group's material opacities by f (bases recorded on first call).
export function setOp(root, f) {
  root.traverse(o => {
    if (o.material) {
      if (o.material.userData.base === undefined) {
        o.material.userData.base = o.material.opacity;
        o.material.transparent = true;
      }
      o.material.opacity = o.material.userData.base * clamp01(f);
    }
  });
  root.visible = f > 0.004;
}

export function orbit(camera, az, el, r, target = new THREE.Vector3()) {
  camera.position.set(
    target.x + r * Math.cos(el) * Math.cos(az),
    target.y + r * Math.sin(el),
    target.z + r * Math.cos(el) * Math.sin(az));
  camera.lookAt(target);
}

export function groundGrid(scene, y = -1.5, size = 10, div = 20) {
  const g = new THREE.GridHelper(size, div, 0x2a3230, 0x171d1b);
  g.position.y = y;
  g.material.transparent = true;
  scene.add(g);
  return g;
}

// ---------- computed geometry ----------
// Truncated octahedron vertices: ALL 24 signed permutations of (0, 1, 2)·k.
export function toVerts(k = 1) {
  const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  const out = [];
  for (const p of perms) for (const sa of [1,-1]) for (const sb of [1,-1]) {
    const v = p.map(c => c === 1 ? sa * k : c === 2 ? 2 * sb * k : 0);
    if (!out.some(u => Math.abs(u[0]-v[0])+Math.abs(u[1]-v[1])+Math.abs(u[2]-v[2]) < 1e-9))
      out.push(v);
  }
  return out.map(v => new THREE.Vector3(...v));
}

export function edgesByLength(pts, d, eps = 1e-6) {
  const pos = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++)
    if (Math.abs(pts[i].distanceTo(pts[j]) - d) < eps) pos.push(pts[i], pts[j]);
  return pos;
}

export function lineSegs(positions, color, opacity = 1) {
  const g = new THREE.BufferGeometry().setFromPoints(positions);
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

function sortAroundNormal(verts, n) {
  const c = verts.reduce((a, v) => a.add(v.clone()), new THREE.Vector3()).multiplyScalar(1 / verts.length);
  const u = new THREE.Vector3(1, 0, 0);
  if (Math.abs(u.dot(n) / n.length()) > 0.9) u.set(0, 1, 0);
  const b1 = new THREE.Vector3().crossVectors(n, u).normalize();
  const b2 = new THREE.Vector3().crossVectors(n, b1).normalize();
  return verts.slice().sort((p, q) => {
    const pp = p.clone().sub(c), qq = q.clone().sub(c);
    return Math.atan2(pp.dot(b2), pp.dot(b1)) - Math.atan2(qq.dot(b2), qq.dot(b1));
  });
}

export function polyMesh(verts, n, color, opacity) {
  const ring = sortAroundNormal(verts, n);
  const tris = [];
  for (let i = 1; i < ring.length - 1; i++) tris.push(ring[0], ring[i], ring[i + 1]);
  const g = new THREE.BufferGeometry().setFromPoints(tris);
  g.computeVertexNormals();
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
}

// Faces of the TO: 8 hexagons on ⟨111⟩ (v·n = 3k), 6 squares on axes (v·axis = 2k).
export function toFaces(k = 1, { hexColor = COL.space, sqColor = COL.unit, hexOp = 0.16, sqOp = 0.10 } = {}) {
  const pts = toVerts(k), group = new THREE.Group();
  for (const sx of [1,-1]) for (const sy of [1,-1]) for (const sz of [1,-1]) {
    const n = new THREE.Vector3(sx, sy, sz);
    group.add(polyMesh(pts.filter(p => Math.abs(p.dot(n) - 3 * k) < 1e-6), n, hexColor, hexOp));
  }
  for (const ax of [[1,0,0],[0,1,0],[0,0,1]]) for (const s of [1,-1]) {
    const n = new THREE.Vector3(...ax).multiplyScalar(s);
    group.add(polyMesh(pts.filter(p => Math.abs(p.dot(n) - 2 * k) < 1e-6), n, sqColor, sqOp));
  }
  return group;
}

export const toWire = (k = 1, color = COL.face, op = 1) =>
  lineSegs(edgesByLength(toVerts(k), Math.SQRT2 * k), color, op);

// Rhombic dodecahedron: 8 cube corners (±1,±1,±1)k + 6 axis points (±2,0,0)k…
export function rdVerts(k = 1) {
  const out = [];
  for (const sx of [1,-1]) for (const sy of [1,-1]) for (const sz of [1,-1])
    out.push(new THREE.Vector3(sx * k, sy * k, sz * k));
  for (const ax of [[2,0,0],[0,2,0],[0,0,2]]) for (const s of [1,-1])
    out.push(new THREE.Vector3(ax[0]*s*k, ax[1]*s*k, ax[2]*s*k));
  return out;
}
export const rdWire = (k = 1, color = COL.space, op = 1) =>
  lineSegs(edgesByLength(rdVerts(k), Math.sqrt(3) * k), color, op);

export function rdFaces(k = 1, color = COL.face, op = 0.12) {
  const pts = rdVerts(k), group = new THREE.Group();
  const ns = [];
  for (const p of [[1,1,0],[1,0,1],[0,1,1]]) for (const s1 of [1,-1]) for (const s2 of [1,-1]) {
    const v = [...p]; let first = true;
    for (let i = 0; i < 3; i++) if (v[i]) { v[i] *= first ? s1 : s2; first = false; }
    ns.push(new THREE.Vector3(...v));
  }
  for (const n of ns) {
    const face = pts.filter(v => Math.abs(v.dot(n) - 2 * k) < 1e-6);
    if (face.length === 4) group.add(polyMesh(face, n, color, op));
  }
  return group;
}

export const cubeWire = (s = 1, color = COL.unit, op = 1) => {
  const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: op }));
};

// Parametric truncation of the octahedron with verts (±3k,0,0)… u∈[0,1]:
// each vertex is cut back by u/3 along its 4 edges; u=1 lands EXACTLY on the TO.
export function truncationWirePositions(k, u) {
  const axes = [];
  for (const ax of [[3,0,0],[0,3,0],[0,0,3]]) for (const s of [1,-1])
    axes.push(new THREE.Vector3(ax[0]*s*k, ax[1]*s*k, ax[2]*s*k));
  const pos = [], s = u / 3;
  for (let i = 0; i < axes.length; i++) for (let j = i + 1; j < axes.length; j++) {
    const A = axes[i], B = axes[j];
    if (A.dot(B) < -1e-6) continue; // opposite vertices — not an edge
    pos.push(A.clone().lerp(B, s), B.clone().lerp(A, s));
  }
  if (u > 1e-4) for (const A of axes) {
    const cuts = axes.filter(B => B !== A && A.dot(B) > -1e-6)
      .map(B => A.clone().lerp(B, s));
    const ring = sortAroundNormal(cuts, A);
    for (let i = 0; i < ring.length; i++) pos.push(ring[i], ring[(i + 1) % ring.length]);
  }
  return pos;
}

// ---------- DOM labels (crisp text, screenshot-composited) ----------
export function domLabel(text, { size = 13, color = COL.unit, mono = true, tracking = '.12em', weight = 500 } = {}) {
  const el = document.createElement('div');
  el.textContent = text;
  el.className = 'svgtxt'; el.dataset.svgAnchor = 'middle';
  el.style.cssText = `position:fixed;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;
    font-family:${mono ? "'Space Mono',monospace" : "'Hanken Grotesk',sans-serif"};
    font-size:${(size * _ui).toFixed(2)}px;font-weight:${weight};letter-spacing:${tracking};color:${color};
    text-transform:uppercase;opacity:0;pointer-events:none;z-index:10`;
  document.body.appendChild(el);
  const v = new THREE.Vector3();
  return {
    el,
    at(p, camera, W, H) {
      v.copy(p).project(camera);
      el.style.left = ((v.x * 0.5 + 0.5) * W) + 'px';
      el.style.top = ((-v.y * 0.5 + 0.5) * H) + 'px';
    },
    op(o) { el.style.opacity = String(clamp01(o)); },
    set(t) { el.textContent = t; },
  };
}

export function caption(text) {
  const el = document.createElement('div');
  el.className = 'svgtxt'; el.dataset.svgAnchor = 'middle';
  el.style.cssText = `position:fixed;left:50%;bottom:${(26 * _ui).toFixed(1)}px;transform:translateX(-50%);
    font-family:'Hanken Grotesk',sans-serif;font-size:${(16 * _ui).toFixed(2)}px;font-weight:500;color:${COL.unit};
    border-left:${Math.max(2, 2 * _ui).toFixed(1)}px solid ${COL.angle};padding:${(3*_ui).toFixed(1)}px 0 ${(3*_ui).toFixed(1)}px ${(12*_ui).toFixed(1)}px;opacity:0;z-index:10;white-space:nowrap`;
  el.textContent = text;
  document.body.appendChild(el);
  return { el, op(o) { el.style.opacity = String(clamp01(o)); }, set(t) { el.textContent = t; } };
}

// Gold measurement arc between two directions, grown by g∈[0,1].
export function arc() {
  const mat = new THREE.LineBasicMaterial({ color: COL.angle, transparent: true, opacity: 1 });
  const line = new THREE.Line(new THREE.BufferGeometry(), mat);
  return {
    obj: line,
    update(center, d1, d2, radius, g) {
      const a = d1.clone().normalize(), b = d2.clone().normalize();
      const ang = Math.acos(clamp01((a.dot(b) + 1) / 2) * 2 - 1);
      const axis = new THREE.Vector3().crossVectors(a, b).normalize();
      const pts = [];
      const N = 48;
      for (let i = 0; i <= N; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(axis, ang * g * i / N);
        pts.push(center.clone().add(a.clone().applyQuaternion(q).multiplyScalar(radius)));
      }
      line.geometry.setFromPoints(pts);
      return ang * g;
    },
    op(o) { mat.opacity = o; },
  };
}
