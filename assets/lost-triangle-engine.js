/* =============================================================================
   Lost Triangle Engine — Gregg Fleishman / Infinite Architecture
   Framework-free canvas renderer for the 1:√2:√3 root triangle and its
   cubic-family of polyhedra. No dependencies.

   Usage:
     const lt = new LostTriangle(canvasEl, {
       mode: 'loop' | 'scroll',   // 'loop' autoplays a clock; 'scroll' is driven externally
       interactive: true,         // drag to rotate the 3D solids
       captions: true,            // draw the canvas masthead / lower-third / progress
       frame: true,               // draw the keyline border
       duration: 40               // seconds for a full pass
     });
     lt.start();
     // scroll mode: lt.setProgress(0..1) on scroll
     // read lt.getScene(lt.T) -> { i, kicker, title, formula } for HTML captions
   ========================================================================== */
(function (global) {
  'use strict';

  var PAPER = '#F6F4EE';
  var INK = '#1C1A16';
  var W = 1920, H = 1080;

  function LostTriangle(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = opts.mode || 'loop';
    this.interactive = opts.interactive !== false;
    this.captions = opts.captions !== false;
    this.frame = opts.frame !== false;
    this.DUR = opts.duration || 40;

    this.T = 0;
    this.paused = false;
    this.dragRX = 0; this.dragRY = 0;
    this._vX = 0; this._vY = 0;
    this._dragging = false;
    this._interacted = false;
    this._lastCap = {};
    this._dhCand = {};
    this._wall0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // true acute angles of the Lost Triangle
    this.ALPHA = Math.atan(1 / Math.SQRT2) * 180 / Math.PI; // 35.2644°
    this.BETA = Math.atan(Math.SQRT2) * 180 / Math.PI;      // 54.7356°

    this._buildSolids();

    // cube + embedded proof triangle (raw cube coords)
    this.triRaw = [[-1, -1, -1], [1, -1, -1], [1, 1, 1]];

    this.resize();
    this._onResize = this.resize.bind(this);
    global.addEventListener('resize', this._onResize);
    if (this.interactive) this._bindDrag();
  }

  var P = LostTriangle.prototype;

  /* ---- formatting ---- */
  P._fmtAngle = function (angle) {
    var nq = Math.round(angle * 4) / 4;
    if (Math.abs(angle - nq) <= 0.15) {
      if (Number.isInteger(nq)) return nq + '\u00B0';
      return nq.toFixed(2).replace(/\.00$/, '').replace(/0$/, '') + '\u00B0';
    }
    return (Math.round(angle / 5) * 5) + '\u00B0';
  };

  /* ---- solids ---- */
  P._buildSolids = function () {
    var fa = this._fmtAngle.bind(this);
    this.solids = {
      tetra:   this._mk([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]),
      cube:    this._mk(this._expand([1, 1, 1])),
      octa:    this._mk(this._expand([1, 0, 0])),
      cubocta: this._mk(this._expand([1, 1, 0])),
      tcube:   this._mk(this._expand([Math.SQRT2 - 1, 1, 1])),
      tocta:   this._mk(this._expand([0, 1, 2])),
      rhombi:  this._mk(this._expand([1, 1, 1 + Math.SQRT2]))
    };
    // which α/β parts each solid's highlighted dihedral decomposes into
    this.dihInfo = {
      tetra: ['a', 'a'], cube: ['a', 'b'], octa: ['b', 'b'],
      cubocta: ['a', 'a', 'b'], tcube: ['a', 'a', 'b'], tocta: ['a', 'a', 'b'], rhombi: ['a', 'b', 'b']
    };
    this.parade = [
      { key: 'tetra',   name: 'Tetrahedron',    f: fa(70.5287794) + '  \u2014  2\u03B1' },
      { key: 'cube',    name: 'Cube',           f: fa(90) + '  \u2014  \u03B1 + \u03B2' },
      { key: 'octa',    name: 'Octahedron',     f: fa(109.4712206) + '  \u2014  2\u03B2' },
      { key: 'cubocta', name: 'Cuboctahedron',  f: fa(125.2643897) + '  \u2014  2\u03B1 + \u03B2' },
      { key: 'tcube',   name: 'Truncated Cube', f: fa(125.2643897) + ' \u00B7 ' + fa(90) },
      { key: 'tocta',   name: 'Trunc. Octa.',   f: fa(125.2643897) + ' \u00B7 ' + fa(109.4712206) },
      { key: 'rhombi',  name: 'Rhombicube',     f: fa(144.7356103) + ' \u00B7 ' + fa(135) + '  \u2014  26 faces' }
    ];
  };

  P._expand = function (t) {
    var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    var set = new Map();
    for (var pi = 0; pi < perms.length; pi++) {
      var p = perms[pi];
      var v = [t[p[0]], t[p[1]], t[p[2]]];
      var idx = [0, 1, 2].filter(function (i) { return Math.abs(v[i]) > 1e-9; });
      for (var m = 0; m < (1 << idx.length); m++) {
        var w = v.slice();
        for (var k = 0; k < idx.length; k++) if (m & (1 << k)) w[idx[k]] = -w[idx[k]];
        set.set(w.map(function (x) { return x.toFixed(4); }).join(','), w);
      }
    }
    return Array.from(set.values());
  };

  P._mk = function (verts) {
    var mx = 0;
    verts.forEach(function (v) { mx = Math.max(mx, Math.hypot(v[0], v[1], v[2])); });
    var V = verts.map(function (v) { return [v[0] / mx, v[1] / mx, v[2] / mx]; });
    var minD = Infinity, i, j, d;
    for (i = 0; i < V.length; i++) for (j = i + 1; j < V.length; j++) {
      d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (d < minD) minD = d;
    }
    var edges = [];
    for (i = 0; i < V.length; i++) for (j = i + 1; j < V.length; j++) {
      d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (d <= minD * 1.05) edges.push([i, j]);
    }
    return { verts: V, edges: edges, faces: this._faces(V) };
  };

  P._faces = function (V) {
    var n = V.length, faces = [], seen = new Set();
    var sub = function (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
    var cr = function (a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; };
    var dt = function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; };
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) for (var k = j + 1; k < n; k++) {
      var nrm = cr(sub(V[j], V[i]), sub(V[k], V[i]));
      var L = Math.hypot(nrm[0], nrm[1], nrm[2]); if (L < 1e-6) continue;
      nrm = [nrm[0] / L, nrm[1] / L, nrm[2] / L];
      var dd = dt(nrm, V[i]);
      var pos = false, neg = false;
      for (var m = 0; m < n; m++) { var s = dt(nrm, V[m]) - dd; if (s > 1e-3) pos = true; else if (s < -1e-3) neg = true; }
      if (pos && neg) continue;
      var on = []; for (m = 0; m < n; m++) if (Math.abs(dt(nrm, V[m]) - dd) < 1e-3) on.push(m);
      if (on.length < 3) continue;
      var key = on.slice().sort(function (a, b) { return a - b; }).join(',');
      if (seen.has(key)) continue; seen.add(key);
      var c = [0, 0, 0]; on.forEach(function (ix) { c[0] += V[ix][0]; c[1] += V[ix][1]; c[2] += V[ix][2]; });
      var cen = [c[0] / on.length, c[1] / on.length, c[2] / on.length];
      var outward = dt(nrm, cen) >= 0 ? nrm : [-nrm[0], -nrm[1], -nrm[2]];
      faces.push({ idx: on, n: outward, cen: cen });
    }
    return faces;
  };

  /* ---- projection + wire ---- */
  P._proj = function (v, ay, ax, scale, cx, cy) {
    var ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
    var x1 = v[0] * ca + v[2] * sa;
    var z1 = -v[0] * sa + v[2] * ca;
    var y2 = v[1] * cb - z1 * sb;
    var z2 = v[1] * sb + z1 * cb;
    return { x: cx + x1 * scale, y: cy - y2 * scale, z: z2 };
  };

  P._drawWire = function (verts, edges, ay, ax, scale, cx, cy, alpha, baseW) {
    var ctx = this.ctx, self = this;
    var Pp = verts.map(function (v) { return self._proj(v, ay, ax, scale, cx, cy); });
    var list = edges.map(function (e) { return { i: e[0], j: e[1], z: (Pp[e[0]].z + Pp[e[1]].z) / 2 }; })
      .sort(function (a, b) { return a.z - b.z; });
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (var n = 0; n < list.length; n++) {
      var e = list[n], front = e.z > 0;
      ctx.beginPath();
      ctx.moveTo(Pp[e.i].x, Pp[e.i].y); ctx.lineTo(Pp[e.j].x, Pp[e.j].y);
      if (front) { ctx.strokeStyle = 'rgba(28,26,22,' + alpha + ')'; ctx.lineWidth = baseW; ctx.setLineDash([]); }
      else { ctx.strokeStyle = 'rgba(28,26,22,' + (0.26 * alpha) + ')'; ctx.lineWidth = baseW * 0.8; ctx.setLineDash([3, 4]); }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  /* ---- dihedral highlight, locked to one fixed edge per solid ---- */
  P._drawDihedral = function (key, ay, ax, sc, cx, cy, alpha) {
    var S = this.solids[key], comp = this.dihInfo[key];
    if (!S || !S.faces || !comp) return;
    var ctx = this.ctx, V = S.verts, self = this;
    var A = this.ALPHA, B = this.BETA;
    var degs = comp.map(function (c) { return c === 'a' ? A : B; });
    var totalDeg = degs.reduce(function (s, x) { return s + x; }, 0);
    var sub = function (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
    var dt = function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; };
    var norm = function (a) { var L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; };

    if (!this._dhCand[key]) {
      var cand = [];
      for (var ei = 0; ei < S.edges.length; ei++) {
        var i = S.edges[ei][0], j = S.edges[ei][1];
        var fs = S.faces.filter(function (f) { return f.idx.indexOf(i) >= 0 && f.idx.indexOf(j) >= 0; });
        if (fs.length < 2) continue;
        var ang = 180 / Math.PI * Math.acos(Math.max(-1, Math.min(1, dt(fs[0].n, fs[1].n))));
        if (Math.abs((180 - ang) - totalDeg) < 2.5) cand.push({ i: i, j: j, f0: fs[0], f1: fs[1] });
      }
      this._dhCand[key] = cand;
    }
    var cands = this._dhCand[key];
    if (!cands || !cands.length) return;
    // lock to one fixed hinge edge so the angle stays put as the camera rotates
    var Hh = cands[0];

    var vi = V[Hh.i], vj = V[Hh.j];
    var M = [(vi[0] + vj[0]) / 2, (vi[1] + vj[1]) / 2, (vi[2] + vj[2]) / 2];
    var e = norm(sub(vj, vi));
    var perp = function (c) { var d = sub(c, M); var t = dt(d, e); d = [d[0] - t * e[0], d[1] - t * e[1], d[2] - t * e[2]]; return norm(d); };
    var p0 = perp(Hh.f0.cen), p1 = perp(Hh.f1.cen);
    var r = 0.36;
    var rod = function (v, axis, an) {
      var cs = Math.cos(an), sn = Math.sin(an);
      var crx = [axis[1] * v[2] - axis[2] * v[1], axis[2] * v[0] - axis[0] * v[2], axis[0] * v[1] - axis[1] * v[0]];
      var dd = dt(axis, v);
      return [v[0] * cs + crx[0] * sn + axis[0] * dd * (1 - cs), v[1] * cs + crx[1] * sn + axis[1] * dd * (1 - cs), v[2] * cs + crx[2] * sn + axis[2] * dd * (1 - cs)];
    };
    var Phi = Math.acos(Math.max(-1, Math.min(1, dt(p0, p1))));
    var dir = dt(rod(p0, e, Phi), p1) > 0.985 ? 1 : -1;
    var at = function (frac, rr) { var v = rod(p0, e, dir * Phi * frac); return self._proj([M[0] + rr * v[0], M[1] + rr * v[1], M[2] + rr * v[2]], ay, ax, sc, cx, cy); };

    ctx.save(); ctx.globalAlpha = alpha;
    var orderFace = function (f) {
      var c = f.cen, nrm = f.n;
      var ref = sub(V[f.idx[0]], c); var tt = dt(ref, nrm); ref = norm([ref[0] - tt * nrm[0], ref[1] - tt * nrm[1], ref[2] - tt * nrm[2]]);
      var bi = [nrm[1] * ref[2] - nrm[2] * ref[1], nrm[2] * ref[0] - nrm[0] * ref[2], nrm[0] * ref[1] - nrm[1] * ref[0]];
      return f.idx.slice().sort(function (a, b) {
        var da = sub(V[a], c), db = sub(V[b], c);
        return Math.atan2(dt(da, bi), dt(da, ref)) - Math.atan2(dt(db, bi), dt(db, ref));
      });
    };
    [Hh.f0, Hh.f1].forEach(function (f) {
      var pts = orderFace(f).map(function (ix) { return self._proj(V[ix], ay, ax, sc, cx, cy); });
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (var q = 1; q < pts.length; q++) ctx.lineTo(pts[q].x, pts[q].y);
      ctx.closePath(); ctx.fillStyle = 'rgba(28,26,22,0.13)'; ctx.fill();
    });
    var Pi = this._proj(vi, ay, ax, sc, cx, cy), Pj = this._proj(vj, ay, ax, sc, cx, cy);
    ctx.beginPath(); ctx.moveTo(Pi.x, Pi.y); ctx.lineTo(Pj.x, Pj.y);
    ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
    var N = 40, AP = [], s;
    for (s = 0; s <= N; s++) AP.push(at(s / N, r));
    ctx.beginPath(); ctx.moveTo(AP[0].x, AP[0].y);
    for (s = 1; s <= N; s++) ctx.lineTo(AP[s].x, AP[s].y);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    var Pm = this._proj(M, ay, ax, sc, cx, cy);
    ctx.strokeStyle = 'rgba(28,26,22,0.5)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(Pm.x, Pm.y); ctx.lineTo(AP[0].x, AP[0].y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(Pm.x, Pm.y); ctx.lineTo(AP[N].x, AP[N].y); ctx.stroke();
    var cum = 0;
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var ci = 0; ci < comp.length; ci++) {
      var mid = (cum + degs[ci] / 2) / totalDeg; cum += degs[ci];
      if (ci < comp.length - 1) {
        var f = cum / totalDeg, a0 = at(f, r * 0.84), a1 = at(f, r * 1.16);
        ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y);
        ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      }
      var lab = at(mid, r * 1.42);
      this._font('900', 30, 'Archivo');
      ctx.fillText(comp[ci] === 'a' ? '\u03B1' : '\u03B2', lab.x, lab.y);
    }
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  };

  /* ---- helpers ---- */
  P._env = function (T, s, e, f) { return Math.max(0, Math.min((T - s) / f, (e - T) / f, 1)); };
  P._ease = function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };
  P._font = function (w, size, fam) { this.ctx.font = w + ' ' + size + 'px ' + fam; };
  P._triPts = function () { var s = 320, Ax = 740, Ay = 700; return { A: [Ax, Ay], B: [Ax + Math.SQRT2 * s, Ay], C: [Ax, Ay - s] }; };
  P._seg = function (a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };

  /* ---- scene 1: triangle build ---- */
  P._drawTriBuild = function (T, alpha) {
    var ctx = this.ctx, p = this._triPts();
    var lp = this.mode === 'scroll' ? 1 : Math.min(1, (T - 0.2) / 4);
    if (lp < 0) lp = 0;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    var f1 = Math.max(0, Math.min(1, lp / 0.32)), e;
    ctx.beginPath(); ctx.moveTo(p.A[0], p.A[1]); e = this._seg(p.A, p.C, f1); ctx.lineTo(e[0], e[1]); ctx.stroke();
    var f2 = Math.max(0, Math.min(1, (lp - 0.30) / 0.32));
    if (f2 > 0) { ctx.beginPath(); ctx.moveTo(p.A[0], p.A[1]); e = this._seg(p.A, p.B, f2); ctx.lineTo(e[0], e[1]); ctx.stroke(); }
    var f3 = Math.max(0, Math.min(1, (lp - 0.60) / 0.34));
    if (f3 > 0) { ctx.beginPath(); ctx.moveTo(p.C[0], p.C[1]); e = this._seg(p.C, p.B, f3); ctx.lineTo(e[0], e[1]); ctx.stroke(); }
    var done = Math.max(0, Math.min(1, (lp - 0.86) / 0.14));
    if (done > 0) {
      ctx.save(); ctx.globalAlpha = alpha * done * 0.5;
      ctx.beginPath(); ctx.moveTo(p.A[0], p.A[1]); ctx.lineTo(p.B[0], p.B[1]); ctx.lineTo(p.C[0], p.C[1]); ctx.closePath(); ctx.clip();
      ctx.strokeStyle = INK; ctx.lineWidth = 1;
      for (var x = -200; x < 700; x += 9) { ctx.beginPath(); ctx.moveTo(p.A[0] + x, p.A[1] - 330); ctx.lineTo(p.A[0] + x + 330, p.A[1]); ctx.stroke(); }
      ctx.restore();
      ctx.globalAlpha = alpha * done; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.strokeRect(p.A[0], p.A[1] - 26, 26, 26);
      ctx.fillStyle = INK; ctx.textAlign = 'center';
      this._font('500', 34, '"IBM Plex Mono"');
      ctx.textAlign = 'end'; ctx.fillText('1', p.A[0] - 22, (p.A[1] + p.C[1]) / 2 + 10);
      ctx.textAlign = 'center'; ctx.fillText('\u221A2', (p.A[0] + p.B[0]) / 2, p.A[1] + 48);
      ctx.save(); ctx.translate((p.C[0] + p.B[0]) / 2 + 18, (p.C[1] + p.B[1]) / 2 - 14); ctx.fillText('\u221A3', 0, 0); ctx.restore();
    }
    ctx.restore();
  };

  /* ---- scene 2: cube embed ---- */
  P._drawCube = function (T, alpha) {
    var ctx = this.ctx;
    var ay = (T - 4.4) * 0.38 + 0.5 + this.dragRY, ax = 0.46 + this.dragRX;
    var cx = 960, cy = 540, sc = 300, self = this;
    ctx.save(); ctx.globalAlpha = alpha;
    var cube = this.solids.cube;
    this._drawWire(cube.verts, cube.edges, ay, ax, sc, cx, cy, 0.32, 2.4);
    var nrm = Math.sqrt(3);
    var tv = this.triRaw.map(function (v) { return [v[0] / nrm, v[1] / nrm, v[2] / nrm]; });
    var Pp = tv.map(function (v) { return self._proj(v, ay, ax, sc, cx, cy); });
    ctx.globalAlpha = alpha * 0.5; ctx.fillStyle = 'rgba(28,26,22,0.10)';
    ctx.beginPath(); ctx.moveTo(Pp[0].x, Pp[0].y); ctx.lineTo(Pp[1].x, Pp[1].y); ctx.lineTo(Pp[2].x, Pp[2].y); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = alpha; ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(Pp[0].x, Pp[0].y); ctx.lineTo(Pp[1].x, Pp[1].y); ctx.lineTo(Pp[2].x, Pp[2].y); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = 'center'; this._font('500', 30, '"IBM Plex Mono"');
    var mid = function (a, b, dx, dy) { return [(a.x + b.x) / 2 + dx, (a.y + b.y) / 2 + dy]; };
    var m;
    m = mid(Pp[0], Pp[1], 0, 34); ctx.fillText('1', m[0], m[1]);
    m = mid(Pp[1], Pp[2], 40, 6); ctx.fillText('\u221A2', m[0], m[1]);
    m = mid(Pp[0], Pp[2], -40, 6); ctx.fillText('\u221A3', m[0], m[1]);
    ctx.restore();
  };

  /* ---- scene 3: angles ---- */
  P._arc = function (cx, cy, r, a0, a1, p) { var ctx = this.ctx; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + (a1 - a0) * p); ctx.stroke(); };
  P._drawAngles = function (T, alpha) {
    var ctx = this.ctx, p = this._triPts();
    var lp = Math.min(1, Math.max(0, (T - 9.9) / 3.2));
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p.A[0], p.A[1]); ctx.lineTo(p.B[0], p.B[1]); ctx.lineTo(p.C[0], p.C[1]); ctx.closePath(); ctx.stroke();
    ctx.strokeRect(p.A[0], p.A[1] - 26, 26, 26);
    var aCA = Math.atan2(p.A[1] - p.C[1], p.A[0] - p.C[0]);
    var aCB = Math.atan2(p.B[1] - p.C[1], p.B[0] - p.C[0]);
    ctx.lineWidth = 3; ctx.strokeStyle = INK;
    this._arc(p.C[0], p.C[1], 56, aCA, aCB, this._ease(Math.min(1, lp * 1.4)));
    var aBA = Math.atan2(p.A[1] - p.B[1], p.A[0] - p.B[0]);
    var aBC = Math.atan2(p.C[1] - p.B[1], p.C[0] - p.B[0]);
    this._arc(p.B[0], p.B[1], 62, aBA, aBC, this._ease(Math.min(1, Math.max(0, (lp - 0.2) * 1.4))));
    var g = this._ease(Math.min(1, Math.max(0, (lp - 0.35) * 1.8)));
    ctx.globalAlpha = alpha * g; ctx.fillStyle = INK; ctx.textAlign = 'center';
    this._font('900', 96, 'Archivo');
    ctx.fillText('\u03B2', p.C[0] + 92, p.C[1] + 66);
    ctx.fillText('\u03B1', p.B[0] - 104, p.B[1] - 44);
    this._font('500', 34, '"IBM Plex Mono"');
    ctx.fillText(this._fmtAngle(this.BETA), p.C[0] + 96, p.C[1] + 118);
    ctx.fillText(this._fmtAngle(this.ALPHA), p.B[0] - 104, p.B[1] - 100);
    ctx.restore();
  };

  /* ---- scene 4: parade ---- */
  P._drawParade = function (T, alpha) {
    var ctx = this.ctx;
    var ay = T * 0.30 + this.dragRY, ax = 0.42 + Math.sin(T * 0.32) * 0.05 + this.dragRX;
    var cx = 960, cy = 540, sc = 300;
    var lp = (T - 14.5) / (33.8 - 14.5);
    var n = this.parade.length;
    var idx = Math.floor(lp * n); idx = Math.max(0, Math.min(n - 1, idx));
    var frac = lp * n - idx;
    var FS = 0.62;
    ctx.save();
    var blend = frac < FS ? 0 : this._ease((frac - FS) / (1 - FS));
    var a0 = 1 - blend;
    var s0 = this.solids[this.parade[idx].key];
    this._drawWire(s0.verts, s0.edges, ay, ax, sc, cx, cy, alpha * a0, idx >= 4 ? 2.0 : 2.6);
    this._drawDihedral(this.parade[idx].key, ay, ax, sc, cx, cy, alpha * a0);
    if (blend > 0 && idx < n - 1) {
      var s1 = this.solids[this.parade[idx + 1].key];
      this._drawWire(s1.verts, s1.edges, ay, ax, sc, cx, cy, alpha * blend, (idx + 1) >= 4 ? 2.0 : 2.6);
    }
    ctx.restore();
    this._paradeIdx = idx;
  };

  /* ---- scene 5: tessellation ---- */
  P._drawTess = function (T, alpha, local) {
    var ctx = this.ctx;
    var zoom = 0.55 + this._ease(Math.min(1, local / 0.7)) * 0.55;
    var a = 64 * zoom;
    var colW = Math.sqrt(3) * a, rowH = 1.5 * a, cos = 0.8660254;
    var drift = (((performance.now() - this._wall0) / 1000 * 16) % rowH);
    var top = '#E7E3D9', left = '#CFC7B7', right = '#AEA593';
    ctx.save(); ctx.globalAlpha = alpha;
    var cols = Math.ceil(W / colW) + 3, rows = Math.ceil(H / rowH) + 3;
    for (var j = -2; j < rows; j++) {
      var cy = j * rowH + drift;
      var xoff = (Math.abs(j) % 2 === 1) ? colW / 2 : 0;
      for (var i = -2; i < cols; i++) {
        var cx = i * colW + xoff;
        var Tp = [cx, cy - a], uR = [cx + cos * a, cy - 0.5 * a], lR = [cx + cos * a, cy + 0.5 * a],
            Bo = [cx, cy + a], lL = [cx - cos * a, cy + 0.5 * a], uL = [cx - cos * a, cy - 0.5 * a], Ce = [cx, cy];
        var face = function (pts, fill) {
          ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
          for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
          ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
          ctx.strokeStyle = 'rgba(28,26,22,0.5)'; ctx.lineWidth = 0.7; ctx.stroke();
        };
        face([Tp, uR, Ce, uL], top); face([uR, lR, Bo, Ce], right); face([uL, Ce, Bo, lL], left);
      }
    }
    var vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, W * 0.62);
    vg.addColorStop(0, 'rgba(246,244,238,0)'); vg.addColorStop(0.62, 'rgba(246,244,238,0)'); vg.addColorStop(1, PAPER);
    ctx.globalAlpha = alpha; ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    var sideGrad = ctx.createLinearGradient(0, 0, W, 0);
    sideGrad.addColorStop(0, PAPER); sideGrad.addColorStop(0.14, 'rgba(246,244,238,0)');
    sideGrad.addColorStop(0.86, 'rgba(246,244,238,0)'); sideGrad.addColorStop(1, PAPER);
    ctx.globalAlpha = alpha; ctx.fillStyle = sideGrad; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  };

  /* ---- scene metadata (for HTML or canvas captions) ---- */
  P.getScene = function (T) {
    if (T < 4.4) return { i: '\u2014', kicker: 'The geometry of one root triangle', title: 'The Lost Triangle', formula: '1 : \u221A2 : \u221A3' };
    if (T < 9.8) return { i: '01 / 04', kicker: 'The proof', title: 'Lives inside the cube', formula: 'edge 1 \u00B7 face-diag \u221A2 \u00B7 space-diag \u221A3' };
    if (T < 14.0) return { i: '02 / 04', kicker: 'Two angles, one architecture', title: 'Two angles do all the work', formula: '\u03B1 ' + this._fmtAngle(this.ALPHA) + '  +  \u03B2 ' + this._fmtAngle(this.BETA) + '  =  ' + this._fmtAngle(90) };
    if (T < 34.0) { var pd = this.parade[this._paradeIdx || 0]; return { i: '03 / 04', kicker: 'The cubic family', title: pd.name, formula: pd.f }; }
    return { i: '04 / 04', kicker: 'Infinitely buildable', title: 'Outward without end', formula: 'FCC lattice \u00B7 74% \u00B7 no gaps' };
  };

  /* ---- main draw ---- */
  P.draw = function () {
    var ctx = this.ctx;
    if (!this._dragging) {
      this.dragRX += this._vX; this.dragRY += this._vY;
      this.dragRX = Math.max(-1.3, Math.min(1.3, this.dragRX));
      this._vX *= 0.95; this._vY *= 0.95;
      if (Math.abs(this._vX) < 1e-4) this._vX = 0;
      if (Math.abs(this._vY) < 1e-4) this._vY = 0;
    }
    var T = this.T;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);

    var eBuild = this._env(T, 0, 5, 0.6);
    var eCube = this._env(T, 4.4, 10.4, 0.6);
    var eAng = this._env(T, 9.8, 14.6, 0.6);
    var ePar = this._env(T, 14.0, 34.6, 0.6);
    var eTess = this._env(T, 34.0, this.DUR + 0.01, 0.7);

    if (eBuild > 0) this._drawTriBuild(T, eBuild);
    if (eCube > 0) this._drawCube(T, eCube);
    if (eAng > 0) this._drawAngles(T, eAng);
    if (ePar > 0) this._drawParade(T, ePar);
    if (eTess > 0) this._drawTess(T, eTess, T - 34.0);

    if (this.frame) {
      ctx.strokeStyle = 'rgba(28,26,22,0.85)'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, W - 60, H - 60);
      ctx.lineWidth = 1; ctx.strokeRect(38, 38, W - 76, H - 76);
    }

    if (this._onScene) this._onScene(this.getScene(T), T);
  };

  /* ---- timing / loop ---- */
  P.setTime = function (T) { this.T = ((T % this.DUR) + this.DUR) % this.DUR; };
  P.setProgress = function (p) { this.T = Math.max(0, Math.min(1, p)) * this.DUR; };
  P.onScene = function (cb) { this._onScene = cb; return this; };

  P.start = function () {
    var self = this;
    this._t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    function frame() {
      if (self.mode === 'loop' && !self.paused) {
        var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        self.T = ((now - self._t0) / 1000) % self.DUR;
      }
      self.draw();
      self._raf = global.requestAnimationFrame(frame);
    }
    this._raf = global.requestAnimationFrame(frame);
    this._iv = global.setInterval(function () { if (global.document && global.document.hidden) self.draw(); }, 1000 / 30);
    return this;
  };

  P.stop = function () { global.cancelAnimationFrame(this._raf); global.clearInterval(this._iv); };
  P.togglePause = function () {
    if (this.paused) { this._t0 = (performance.now ? performance.now() : Date.now()) - this.T * 1000; this.paused = false; }
    else { this.paused = true; }
    return this.paused;
  };

  P.resize = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    this.canvas.width = W * dpr; this.canvas.height = H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  /* ---- drag to rotate ---- */
  P._bindDrag = function () {
    var st = this.canvas, self = this;
    st.style.touchAction = 'none';
    var lx = 0, ly = 0, moved = 0, downT = 0, pid = null;
    var k = 0.009;
    st.addEventListener('pointerdown', function (e) {
      self._dragging = true; self._interacted = true; lx = e.clientX; ly = e.clientY; moved = 0;
      downT = performance.now(); self._vX = 0; self._vY = 0;
      pid = e.pointerId; try { st.setPointerCapture(pid); } catch (_) {}
      if (self.onInteract) self.onInteract();
    });
    st.addEventListener('pointermove', function (e) {
      if (!self._dragging) return;
      var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      self.dragRY += dx * k; self.dragRX += dy * k;
      self.dragRX = Math.max(-1.3, Math.min(1.3, self.dragRX));
      self._vY = dx * k; self._vX = dy * k;
    });
    function up() {
      if (!self._dragging) return;
      self._dragging = false;
      try { st.releasePointerCapture(pid); } catch (_) {}
      if (self.mode === 'loop' && moved < 5 && performance.now() - downT < 300) self.togglePause();
    }
    st.addEventListener('pointerup', up);
    st.addEventListener('pointercancel', up);
  };

  global.LostTriangle = LostTriangle;
})(typeof window !== 'undefined' ? window : this);
