/* ============================================================================
   The Lost Triangle — motion graphic (1 : √2 : √3)

   Ported verbatim from the Claude Design export
   `lost-triangle-animation.source.dc.html` (88-second, 7-chapter SVG build of
   the Lost Triangle and its 120° Fleishman-joint revelation).

   The original ran on Claude Design's `DCLogic` runtime + a `{{ }}` template.
   Here it is a plain React component on this repo's vendored React 18.3.1
   (UMD global `window.React`). It uses `React.createElement` throughout — there
   is NO JSX and therefore NO build step: THIS FILE IS THE SOURCE OF TRUTH.
   Edit it directly.

   The scene-drawing math (proj / seg / dot / lab / txt / arc / renderVals) is
   copied unchanged from the export — every 1 : √2 : √3 relationship is computed
   from one geometric unit, so don't "correct" it to eyeballed coordinates.

   Exposes: window.LostTriangleAnimation  (a React component class)
   ============================================================================ */
(function (global) {
  "use strict";
  var React = global.React;
  if (!React) return;
  var h = React.createElement;

  var STAGE_W = 1920, STAGE_H = 1080;

  function LostTriangleAnimation(props) {
    React.Component.call(this, props);
    this.END = 88;
    this.S = 92; this.cx = 960; this.cy = 600; this.el = 26 * Math.PI / 180; this.GU = 1.6;
    this.az0 = -32 * Math.PI / 180;
    // GF geometry role-colors — bone (unit), blue (face √2), magenta (space √3 /
    // Lost Triangle), gold (angle/chrome).
    this.C = {
      grid: '#4A90D9', axis: '#4A90D9', cyan: '#4A90D9', red: '#E0349E',
      gold: '#C8A96E', white: '#F0EDE8', green: '#3CCB8E',
      titleCyan: '#7FB2E6', titleRed: '#F05BB5', titleGold: '#D8BE8F',
      labelCyan: '#A9CDEE', labelRed: '#F58FCF', labelGold: '#E3D0AC',
      magenta: '#E0349E', titleMag: '#F05BB5', labelMag: '#F58FCF'
    };
    // 3D points (z up). GU scales the unit.
    var g = this.GU, r2 = Math.sqrt(2);
    this.P = {
      O: [0, 0, 0],
      U: [g, 0, 0],            // unit leg corner (base "1")
      Dg: [g, g, 0],           // diagonal end (1,1,0)
      T: [g, g, r2 * g],       // P1 apex (1,1,sqrt2)
      MU: [-g, 0, 0],
      MDg: [-g, g, 0],
      P2: [-g, g, r2 * g]
    };
    // grid lines (z=0)
    this.grid = []; var N = 5;
    for (var i = -N; i <= N; i++) { this.grid.push([[i, -N, 0], [i, N, 0]]); this.grid.push([[-N, i, 0], [N, i, 0]]); }
    // ground rotation circle (final)
    this.circle = []; var R = 3.4;
    for (var k = 0; k <= 64; k++) { var a = 2 * Math.PI * k / 64; this.circle.push([R * Math.cos(a), R * Math.sin(a), 0]); }
    this.state = { t: 0, playing: false };

    this.screenRef = this.screenRef.bind(this);
    this.fit = this.fit.bind(this);
  }
  LostTriangleAnimation.prototype = Object.create(React.Component.prototype);
  LostTriangleAnimation.prototype.constructor = LostTriangleAnimation;

  var proto = LostTriangleAnimation.prototype;

  proto.componentDidMount = function () {
    var saved = parseFloat(localStorage.getItem('lt_t'));
    if (!isNaN(saved) && saved > 0 && saved < this.END) this.setState({ t: saved });
    else if (this.props.autoplay) this.setState({ playing: true });
    this.fit();
    this._fit = this.fit;
    window.addEventListener('resize', this._fit);
    if (typeof ResizeObserver !== 'undefined' && this.screen) {
      this._ro = new ResizeObserver(this._fit);
      this._ro.observe(this.screen);
    }
    this._last = performance.now();
    var self = this;
    var loop = function (now) {
      var dt = (now - self._last) / 1000; self._last = now;
      if (self.state.playing) {
        var nt = self.state.t + dt;
        if (nt >= self.END) { nt = self.END; self.setState({ t: nt, playing: false }); }
        else self.setState({ t: nt });
        if (Math.floor(nt * 4) !== self._sv) { self._sv = Math.floor(nt * 4); localStorage.setItem('lt_t', nt.toFixed(2)); }
      }
      self._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  };
  proto.componentWillUnmount = function () {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._fit);
    if (this._ro) this._ro.disconnect();
  };

  proto.screenRef = function (el) { this.screen = el; if (el) this.fit(); };

  // Scale the 1920×1080 stage to fit its mount box (the page seats this below a
  // fixed nav, so measure the container, not the raw viewport).
  proto.fit = function () {
    if (!this.stage) return;
    var box = this.screen || (this.stage.parentNode);
    if (!box) return;
    var w = box.clientWidth, ht = box.clientHeight;
    if (!w || !ht) return;
    var s = Math.min(w / STAGE_W, ht / STAGE_H);
    this.stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  };

  // ---- helpers (verbatim from the export) ----
  proto.sm = function (t, a, b) { if (b <= a) return t >= b ? 1 : 0; var e = (t - a) / (b - a); e = e < 0 ? 0 : e > 1 ? 1 : e; return e * e * (3 - 2 * e); };
  proto.fio = function (t, a, b, c, d) { return this.sm(t, a, b) * (1 - this.sm(t, c, d)); };
  proto.proj = function (p) {
    var a = this._az, ce = Math.cos(a), se = Math.sin(a);
    var xa = p[0] * ce - p[1] * se, ya = p[0] * se + p[1] * ce, za = p[2];
    var zb = ya * Math.sin(this.el) + za * Math.cos(this.el);
    return [this.cx + xa * this.S, this.cy - zb * this.S];
  };
  proto.lerpP = function (A, B, k) { return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; };
  proto.seg = function (p0, p1, prog, color, w, o) {
    o = o || {}; var key = 's' + (this._k++); if (prog <= 0) return null;
    var A = this.proj(p0), B0 = this.proj(p1); var B = this.lerpP(A, B0, prog);
    return h('line', { key: key, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: color, strokeWidth: w, strokeLinecap: 'round',
      strokeDasharray: o.dash, opacity: o.op == null ? 1 : o.op, filter: o.glow === false ? undefined : 'url(#g)' });
  };
  proto.dot = function (p, rad, color, op) {
    var key = 'c' + (this._k++); if (op <= 0) return null; var P = this.proj(p);
    return h('circle', { key: key, cx: P[0], cy: P[1], r: rad, fill: color, opacity: op, filter: 'url(#g)' });
  };
  proto.lab = function (p, txt, color, op, o) {
    o = o || {}; var key = 'l' + (this._k++); if (op <= 0) return null; var P = this.proj(p);
    return h('text', { key: key, x: P[0] + (o.dx || 0), y: P[1] + (o.dy || 0), fill: color, opacity: op, fontSize: o.size || 30,
      fontFamily: "'Cormorant Garamond',serif", fontStyle: o.italic ? 'italic' : 'normal', fontWeight: o.w || 600, textAnchor: o.anchor || 'middle', filter: 'url(#g)' }, txt);
  };
  proto.txt = function (x, y, s, color, op, o) {
    o = o || {}; var key = 'x' + (this._k++); if (op <= 0) return null;
    return h('text', { key: key, x: x, y: y, fill: color, opacity: op, fontSize: o.size || 34,
      fontFamily: o.face || "'Cormorant Garamond',serif", fontStyle: o.italic ? 'italic' : 'normal', fontWeight: o.w || 500, textAnchor: o.anchor || 'middle', filter: o.glow ? 'url(#g)' : undefined, letterSpacing: o.ls || 0 }, s);
  };
  proto.arc = function (O3, A3, B3, rad, prog, color, op) {
    var key = 'a' + (this._k++); if (prog <= 0 || op <= 0) return null;
    var O = this.proj(O3), A = this.proj(A3), B = this.proj(B3);
    var aA = Math.atan2(A[1] - O[1], A[0] - O[0]), aB = Math.atan2(B[1] - O[1], B[0] - O[0]);
    var d = aB - aA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; var aE = aA + d * prog;
    var x0 = O[0] + rad * Math.cos(aA), y0 = O[1] + rad * Math.sin(aA), x1 = O[0] + rad * Math.cos(aE), y1 = O[1] + rad * Math.sin(aE);
    return h('path', { key: key, d: 'M' + x0 + ' ' + y0 + ' A' + rad + ' ' + rad + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + x1 + ' ' + y1, stroke: color, strokeWidth: 2.4, fill: 'none', strokeDasharray: '5 6', opacity: op, filter: 'url(#g)', strokeLinecap: 'round' });
  };
  // 3D midpoint helper
  proto.lerpP3 = function (a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };

  proto.renderVals = function () {
    var t = this.state.t, C = this.C, P = this.P, k = []; this._k = 0;
    var self = this;
    // azimuth: fixed until final rotation, then 360 sweep
    var ROT0 = 72, ROT1 = 84;
    this._az = this.az0 + (t > ROT0 ? 2 * Math.PI * this.sm(t, ROT0, ROT1) : 0);
    var push = function (e) { if (e) k.push(e); };

    // defs (glow)
    push(h('defs', { key: 'd' },
      h('filter', { id: 'g', x: '-60%', y: '-60%', width: '220%', height: '220%' },
        h('feGaussianBlur', { stdDeviation: 2.4, result: 'b' }),
        h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })))));

    // GRID
    var gOp = this.sm(t, 0.5, 4) * 0.12;
    this.grid.forEach(function (s, i) {
      push(h('line', Object.assign({ key: 'gr' + i },
        (function () { var A = self.proj(s[0]), B = self.proj(s[1]); return { x1: A[0], y1: A[1], x2: B[0], y2: B[1] }; })(),
        { stroke: C.grid, strokeWidth: 1, opacity: gOp })));
    });
    // rotation ground circle (final)
    var cOp = this.fio(t, 72.5, 73.5, 85.5, 87) * 0.5;
    if (cOp > 0) {
      var pts = this.circle.map(function (p) { return self.proj(p); });
      push(h('polyline', { key: 'circ', points: pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' '), fill: 'none', stroke: C.green, strokeWidth: 1.5, strokeDasharray: '4 9', opacity: cOp }));
    }

    // AXES (chapter I)
    push(h('g', { key: 'ax' },
      this.seg([-5, 0, 0], [5, 0, 0], this.sm(t, 4, 6.2), C.axis, 1.6, { glow: true, op: 0.40 }),
      this.seg([0, -5, 0], [0, 5, 0], this.sm(t, 5.4, 7.6), C.axis, 1.6, { glow: true, op: 0.40 }),
      this.dot(P.O, 3.5, C.axis, this.sm(t, 5.8, 6.6) * 0.6)));

    // filled Lost Triangle (O–T–Dg), revealed at the end (sits behind the strut lines)
    { var fop = this.sm(t, 63.5, 65.2) * 0.34; if (fop > 0) { var Os = this.proj(P.O), Ts = this.proj(P.T), Ds = this.proj(P.Dg);
      push(h('polygon', { key: 'fillTri', points: Os[0] + ',' + Os[1] + ' ' + Ts[0] + ',' + Ts[1] + ' ' + Ds[0] + ',' + Ds[1], fill: 'rgba(60,203,142,' + (fop * 0.8) + ')', stroke: 'none' })); } }

    // ===== II. 45° diagonal — the unit square =====
    var B = [0, this.GU, 0];
    // solid square edges
    push(this.seg(P.O, P.U, this.sm(t, 8.4, 9.2), C.cyan, 1.8, { glow: true }));
    push(this.seg(P.U, P.Dg, this.sm(t, 9.0, 9.8), C.cyan, 1.8, { glow: true }));
    push(this.seg(P.Dg, B, this.sm(t, 9.6, 10.4), C.cyan, 1.8, { glow: true }));
    push(this.seg(B, P.O, this.sm(t, 10.2, 11.0), C.cyan, 1.8, { glow: true }));
    // corner dots
    { var dop = this.sm(t, 10.6, 11.2); push(this.dot(P.O, 3.6, C.cyan, dop)); push(this.dot(P.U, 3.6, C.cyan, dop)); push(this.dot(P.Dg, 3.6, C.cyan, dop)); push(this.dot(B, 3.6, C.cyan, dop)); }
    // side labels — matched to blue edge color
    { var o1 = this.sm(t, 10.8, 11.4); push(this.lab(this.lerpP3(B, P.Dg, 0.5), '1', C.labelCyan, o1, { dy: -14, size: 27, italic: true })); push(this.lab(this.lerpP3(P.O, P.U, 0.5), '1', C.labelCyan, o1, { dy: 24, size: 27, italic: true })); }
    // dashed √2 diagonal
    push(this.seg(P.O, P.Dg, this.sm(t, 11.4, 12.9), C.cyan, 2.6, { dash: '10 9', glow: true }));
    push(this.lab(this.lerpP3(P.O, P.Dg, 0.6), '√2', C.labelCyan, this.sm(t, 12.9, 13.5), { dy: 26, dx: 8, size: 30, italic: true }));
    // clean 45° arc
    push(this.arc(P.O, P.U, P.Dg, 40, this.sm(t, 13.3, 14.0), C.cyan, this.sm(t, 13.3, 14.0) * 0.85));
    push(this.lab(this.lerpP3(P.O, P.Dg, 0.17), '45°', C.labelCyan, this.sm(t, 14.0, 14.5), { dy: 18, dx: 6, size: 21, italic: true }));

    // ===== III. The Rise =====
    { var rStart = 18.1, rEnd = 19.0, rp = this.sm(t, rStart, rEnd), tip = this.lerpP3(P.Dg, P.T, rp);
      push(this.seg(P.Dg, P.T, rp, C.magenta, 11, { glow: false, op: 0.22 }));
      push(this.seg(P.Dg, P.T, rp, C.magenta, 3.4, { glow: false }));
      push(this.dot(tip, 4.6, C.magenta, this.sm(t, rStart, rStart + 0.25)));
      push(this.lab(this.lerpP3(P.Dg, P.T, 0.5), '√2', C.labelMag, this.sm(t, rStart + 0.7 * (rEnd - rStart), rEnd), { dx: 26, size: 30, italic: true })); }

    // ===== IV. Sundial line =====
    push(this.seg(P.O, P.T, this.sm(t, 27.6, 29.5), C.gold, 3.4, { glow: true }));
    push(this.dot(P.T, 5, C.gold, this.sm(t, 29.4, 30)));
    push(this.lab(P.T, 'T', C.titleGold, this.sm(t, 29.6, 30.2), { dx: 26, dy: -10, size: 34 }));
    push(this.lab(this.lerpP3(P.O, P.T, 0.5), '2', C.labelGold, this.sm(t, 28.4, 29.6), { dx: -22, size: 34, w: 600 }));
    push(this.txt(960, 886, 'Floor diagonal √2  +  rise √2  →  the sundial line', C.white, this.fio(t, 30, 31, 38, 38.8), { size: 36, italic: true }));
    push(this.txt(960, 922, 'length = √((√2)² + (√2)²) = √4 = 2', C.labelGold, this.fio(t, 31, 32, 38, 38.8), { size: 32, italic: true }));

    // ===== V. Lost Triangle =====
    push(this.seg(P.O, P.U, this.sm(t, 38.6, 39.7), C.cyan, 3, { glow: true }));
    push(this.seg(P.U, P.T, this.sm(t, 40, 41.5), C.magenta, 2.4, { dash: '7 7' }));
    { var o = this.sm(t, 41.5, 42.1); push(this.lab(this.lerpP3(P.O, P.U, 0.5), '1', C.labelCyan, o, { dy: 26, size: 28 })); push(this.lab(this.lerpP3(P.U, P.T, 0.55), '√3', C.labelMag, o, { dx: 26, size: 30, italic: true })); }
    push(this.txt(960, 886, 'The Lost Triangle:  sides  1,  √3,  2', C.titleGold, this.fio(t, 42.5, 43.5, 49, 49.8), { size: 40, italic: true }));
    push(this.txt(960, 922, 'a 30–60–90 right triangle, seen edge-on', C.white, this.fio(t, 43.5, 44.3, 49, 49.8), { size: 30, italic: true }));

    // ===== VI. Mirror Sundial =====
    push(this.seg(P.O, P.MDg, this.sm(t, 49.6, 50.8), C.cyan, 2.6, { glow: true }));
    push(this.seg(P.MDg, P.P2, this.sm(t, 51, 52.4), C.magenta, 3, { glow: true }));
    push(this.seg(P.O, P.P2, this.sm(t, 52.6, 54.2), C.magenta, 3.4, { glow: true }));
    push(this.dot(P.P2, 5, C.magenta, this.sm(t, 54, 54.6)));
    push(this.lab(P.P2, 'P₂', C.titleMag, this.sm(t, 54.2, 54.8), { dx: -14, dy: -22, size: 34, italic: true }));
    push(this.lab(this.lerpP3(P.O, P.P2, 0.5), '2', C.labelMag, this.sm(t, 52.8, 54), { dx: -22, size: 32, w: 600 }));

    // ===== VII. 120° Revelation (the discovery) =====
    { var Os2 = this.proj(P.O), Ts2 = this.proj(P.T), Ps = this.proj(P.P2);
      var aA = Math.atan2(Ts2[1] - Os2[1], Ts2[0] - Os2[0]), aB = Math.atan2(Ps[1] - Os2[1], Ps[0] - Os2[0]);
      var dd = aB - aA; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
      var prog = this.sm(t, 60, 61.8), aE = aA + dd * prog, vis = this.fio(t, 60, 61.6, 86, 87.5), rW = 128, sweep = dd > 0 ? 1 : 0;
      if (vis > 0) {
        var wx0 = Os2[0] + rW * Math.cos(aA), wy0 = Os2[1] + rW * Math.sin(aA), wx1 = Os2[0] + rW * Math.cos(aE), wy1 = Os2[1] + rW * Math.sin(aE);
        push(h('path', { key: 'wedge', d: 'M' + Os2[0] + ' ' + Os2[1] + ' L' + wx0 + ' ' + wy0 + ' A' + rW + ' ' + rW + ' 0 0 ' + sweep + ' ' + wx1 + ' ' + wy1 + ' Z', fill: 'rgba(224,52,158,0.14)', stroke: 'none', opacity: vis }));
        push(h('path', { key: 'warc', d: 'M' + wx0 + ' ' + wy0 + ' A' + rW + ' ' + rW + ' 0 0 ' + sweep + ' ' + wx1 + ' ' + wy1, fill: 'none', stroke: C.red, strokeWidth: 3.6, opacity: vis, filter: 'url(#g)', strokeLinecap: 'round' }));
      }
      var fr = this.sm(t, 61.5, 63.6); if (fr > 0 && fr < 1) { push(h('circle', { key: 'flash', cx: Os2[0], cy: Os2[1], r: 26 + fr * 250, fill: 'none', stroke: C.red, strokeWidth: 4 * (1 - fr), opacity: (1 - fr) * 0.85, filter: 'url(#g)' })); }
      var am = (aA + aE) / 2, lp = [Os2[0] + (rW + 62) * Math.cos(am), Os2[1] + (rW + 62) * Math.sin(am)];
      var appear = this.sm(t, 61.8, 62.7), sc = (0.55 + 0.45 * appear) * (1 + 0.05 * Math.sin(t * 3.2)), lop = this.fio(t, 61.8, 62.5, 86, 87.5);
      if (lop > 0) {
        push(h('circle', { key: 'glow120', cx: lp[0], cy: lp[1] - 18, r: 70, fill: C.red, opacity: lop * 0.18, filter: 'url(#g)' }));
        push(h('text', { key: 't120', x: lp[0], y: lp[1], fill: C.titleRed, opacity: lop, fontSize: 72, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", textAnchor: 'middle', filter: 'url(#g)', transform: 'translate(' + lp[0] + ' ' + lp[1] + ') scale(' + sc + ') translate(' + (-lp[0]) + ' ' + (-lp[1]) + ')' }, '120°'));
      }
    }
    // right-angle marker at the rise foot (Dg)
    { var rop = this.sm(t, 64, 65.4); if (rop > 0) { var D = this.proj(P.Dg), Tp = this.proj(P.T), Up = this.proj(P.U);
      var v1 = [Tp[0] - D[0], Tp[1] - D[1]], v2 = [Up[0] - D[0], Up[1] - D[1]];
      var n1 = Math.hypot(v1[0], v1[1]) || 1, n2 = Math.hypot(v2[0], v2[1]) || 1, ss2 = 15;
      var ra = [D[0] + v1[0] / n1 * ss2, D[1] + v1[1] / n1 * ss2], rb = [D[0] + v2[0] / n2 * ss2, D[1] + v2[1] / n2 * ss2], rc = [ra[0] + v2[0] / n2 * ss2, ra[1] + v2[1] / n2 * ss2];
      push(h('path', { key: 'rang', d: 'M ' + ra[0] + ' ' + ra[1] + ' L ' + rc[0] + ' ' + rc[1] + ' L ' + rb[0] + ' ' + rb[1], fill: 'none', stroke: 'rgba(60,203,142,.65)', strokeWidth: 2, opacity: rop })); } }

    // math block (bottom-left)
    var mOp = this.fio(t, 63, 64.4, 71, 71.8); var mx = 86;
    push(this.txt(mx, 742, 'OP₁ = (1, 1, √2),   |OP₁| = 2', C.white, mOp, { size: 34, italic: true, anchor: 'start' }));
    push(this.txt(mx, 798, 'OP₂ = (−1, 1, √2),   |OP₂| = 2   (mirror)', C.white, mOp, { size: 34, italic: true, anchor: 'start' }));
    push(this.txt(mx, 854, 'cos θ = (−1 + 1 + 2) / 4 = 1/2   ⟹   θ = 60°', C.white, mOp, { size: 34, italic: true, anchor: 'start' }));
    push(this.txt(mx, 912, 'supplement:  180° − 60° = 120°   (hexagon corner)', C.titleRed, mOp, { size: 34, italic: true, anchor: 'start', w: 600 }));

    // ===== Final statements =====
    push(this.txt(960, 882, 'The Lost Triangle defines the Fleishman joint’s 120° dihedral angle.', C.white, this.sm(t, 75, 76.4), { size: 46, italic: true, glow: true }));
    push(this.txt(960, 922, 'gregg fleishman', 'rgba(138,132,128,.85)', this.sm(t, 77, 78), { size: 30, italic: true }));

    // ===== Beginner captions (one per chapter) =====
    push(this.txt(960, 914, 'A flat floor of unit squares — each cell is 1 × 1', C.white, this.fio(t, 3.2, 4.2, 7.2, 7.9), { size: 34, italic: true }));
    push(this.txt(960, 914, 'A unit square’s diagonal is √2   (since 1² + 1² = 2)', C.white, this.fio(t, 15, 15.8, 17.3, 18), { size: 34, italic: true }));
    push(this.txt(960, 914, 'Now rise straight up by √2 — the same length as the diagonal', C.white, this.fio(t, 21.5, 22.3, 26.3, 27), { size: 34, italic: true }));
    push(this.txt(960, 914, 'Mirror the sundial across the upright plane — a twin line, length 2', C.white, this.fio(t, 55, 55.8, 58.4, 59), { size: 34, italic: true }));

    // TITLE (top-left) — Syne display, color-coded per chapter
    var chapters = [[0, 'I. The Plane', C.titleCyan], [8, 'II. The 45° Diagonal', C.titleCyan], [18, 'III. The Rise', C.titleRed],
      [27, 'IV. The Sundial Line', C.titleGold], [38, 'V. The Lost Triangle', C.titleGold], [49, 'VI. The Mirror Sundial', C.titleCyan], [59, 'VII. The 120° Revelation', C.titleRed]];
    var act = chapters[0]; for (var ci = 0; ci < chapters.length; ci++) { if (t >= chapters[ci][0]) act = chapters[ci]; }
    push(this.txt(72, 158, act[1], act[2], this.sm(t, act[0], act[0] + 0.7), { size: 52, anchor: 'start', glow: true, w: 800, face: "'Syne',sans-serif", ls: -1 }));

    // Callout box — bottom right, fades in during the 120° revelation
    var bop = this.fio(t, 70, 72, 86, 87.5);
    if (bop > 0) {
      push(h('g', { key: 'callout', opacity: bop },
        h('rect', { x: 1650, y: 1000, width: 240, height: 60, rx: 12, fill: 'rgba(224,52,158,.08)', stroke: 'rgba(224,52,158,.4)', strokeWidth: 2 }),
        h('text', { x: 1770, y: 1018, textAnchor: 'middle', fontSize: '13px', fontFamily: "'Space Mono',monospace", fill: '#E0349E', letterSpacing: '.08em' }, '120° DIHEDRAL'),
        h('text', { x: 1770, y: 1045, textAnchor: 'middle', fontSize: '11px', fontFamily: "'Space Grotesk',sans-serif", fill: 'rgba(240,237,232,.65)', letterSpacing: '.04em' }, 'Hexagon corner angle')
      ));
    }

    var scene = h('svg', { viewBox: '0 0 1920 1080', width: '100%', height: '100%', style: { position: 'absolute', inset: 0, display: 'block' } }, k);

    var ctaOp = this.sm(t, 84.5, 87);
    var mm = Math.floor(t / 60), sss = Math.floor(t % 60), dm = Math.floor(this.END / 60), ds = Math.floor(this.END % 60);
    return {
      scene: scene,
      playIcon: this.state.playing ? '❚❚' : '►',
      toggle: function () { if (self.state.t >= self.END) self.setState({ t: 0, playing: true }); else self.setState(function (s) { return { playing: !s.playing }; }); },
      restart: function () { self.setState({ t: 0, playing: true }); },
      onSeek: function (e) { var v = parseFloat(e.target.value) / 1000 * self.END; self.setState({ t: v, playing: false }); localStorage.setItem('lt_t', v.toFixed(2)); },
      scrubVal: Math.round(t / this.END * 1000),
      tlabel: mm + ':' + String(sss).padStart(2, '0'),
      durlabel: dm + ':' + String(ds).padStart(2, '0'),
      uiOpacity: 1 - this.sm(t, 85, 87) * 0.82,
      ctaOp: ctaOp,
      ctaPointer: ctaOp > 0.1 ? 'auto' : 'none'
    };
  };

  // The `<x-dc>` template, rebuilt with React.createElement.
  proto.render = function () {
    var self = this;
    var v = this.renderVals();
    return h('div', { 'data-screen-label': 'Lost Triangle', ref: this.screenRef,
      style: { position: 'absolute', inset: 0, background: '#0B0B0B', overflow: 'hidden' } },
      h('div', { ref: function (el) { self.stage = el; if (el) self.fit(); },
        style: { position: 'absolute', left: '50%', top: '50%', width: STAGE_W + 'px', height: STAGE_H + 'px', transform: 'translate(-50%,-50%)', transformOrigin: 'center center' } },
        h('div', { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)' } }),
        v.scene,
        h('div', { style: { position: 'absolute', left: '50%', bottom: '270px', transform: 'translateX(-50%)', opacity: v.ctaOp, transition: 'opacity 1.4s ease', textAlign: 'center', pointerEvents: v.ctaPointer, whiteSpace: 'nowrap' } },
          h('div', { style: { fontFamily: "'Cormorant Garamond',serif", fontSize: '18px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#8A8480', marginBottom: '22px' } }, 'The triangle becomes the joint'),
          h('a', { href: 'explore.html', style: { display: 'inline-block', fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: '#C8A96E', textDecoration: 'none', border: '1px solid rgba(200,169,110,.45)', borderRadius: '3px', padding: '16px 44px', background: 'rgba(200,169,110,.06)', animation: 'pulse-glow 3s ease-in-out infinite', transition: 'background .3s,border-color .3s' } }, 'Explore the Cube Model →'),
          h('div', { style: { marginTop: '20px', fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(138,132,128,.5)' } }, 'Six parts · The whole of space')
        ),
        h('div', { style: { position: 'absolute', left: '50%', bottom: '34px', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '18px', padding: '11px 20px', borderRadius: '14px', background: 'rgba(18,18,18,.66)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(240,237,232,.07)', boxShadow: '0 8px 30px rgba(0,0,0,.5)', opacity: v.uiOpacity, transition: 'opacity .8s', fontFamily: "'Space Grotesk',sans-serif" } },
          h('button', { onClick: v.toggle, style: { width: '40px', height: '40px', border: 'none', borderRadius: '10px', background: 'rgba(200,169,110,.16)', color: '#F0EDE8', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, v.playIcon),
          h('button', { onClick: v.restart, style: { width: '36px', height: '36px', border: 'none', borderRadius: '10px', background: 'rgba(240,237,232,.06)', color: '#8A8480', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '↻'),
          h('span', { style: { fontSize: '12px', color: '#8A8480', fontVariantNumeric: 'tabular-nums', minWidth: '40px', textAlign: 'right', letterSpacing: '0.04em' } }, v.tlabel),
          h('input', { className: 'lt-scrub', type: 'range', min: 0, max: 1000, value: v.scrubVal, onChange: v.onSeek, style: { width: '360px' } }),
          h('span', { style: { fontSize: '12px', color: '#8A8480', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' } }, v.durlabel)
        )
      )
    );
  };

  global.LostTriangleAnimation = LostTriangleAnimation;
})(typeof window !== 'undefined' ? window : this);
