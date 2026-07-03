/* Lost Triangle — The Fleishman Sequence (Proof)
   Converted from the design handoff "260702_Lost Triangle Proof.dc.html"
   to a plain React class (no build step). Eight chapters: three different
   pivot constructions (45°, 30°, 35.26°) that all close the same 1 : √2 : √3
   triangle, then the shared √3 diagonal, the cube's chamber wall, the
   tetrahedral double-angle, and the rhombic-dodecahedron blossom.
   Defines window.LostTriangleProof, mounted by mathematics.html. */
(function () {
  'use strict';
  var cr = React.createElement;

  class LostTriangleProof extends React.Component {
    constructor(props){
      super(props);
      this.KEY = 'lt_proof_t';
      this.END = 66;
      this.CHT = [0, 3, 11, 19, 27, 36, 47, 56];
      this.CHN = ['0 · Three Beginnings', 'I · Begin at 45°', 'II · Begin at 30°', 'III · Begin at 35.26°', 'IV · One Triangle', 'V · The Cube’s Chamber', 'VI · The Double', 'VII · The Blossom'];
      this.CHC = ['#F0EDE8', '#D8BE8F', '#D8BE8F', '#D8BE8F', '#6FE3B4', '#7FB2E6', '#D8BE8F', '#F05BB5'];
      // projection constants (the shared room)
      this.S = 92; this.cx = 960; this.cy = 612;
      this.el = 26 * Math.PI / 180;
      this.az0 = -32 * Math.PI / 180;
      this.u = 1.5; // world units per length-1
      // length+act palette
      this.C = {
        one: '#4A90D9', oneT: '#7FB2E6', oneL: '#A9CDEE',      // length 1 — cyan
        two: '#C8A96E', twoT: '#D8BE8F', twoL: '#E3D0AC',      // length √2 + angle + brand — gold
        three: '#3CCB8E', threeT: '#6FE3B4', threeL: '#A9E8CC',// length √3 — green
        rod: '#F0EDE8', white: '#F0EDE8',                       // length 2 / primary text
        act: '#E0349E', actT: '#F05BB5', actL: '#F58FCF',       // the act — magenta
        mute: '#8A8480'
      };
      // cube (scenes V–VII), half-edge = 1 unit
      this.cubeV = [];
      for (var sx = -1; sx <= 1; sx += 2) for (var sy = -1; sy <= 1; sy += 2) for (var sz = -1; sz <= 1; sz += 2) this.cubeV.push([sx, sy, sz]);
      this.cubeE = [];
      for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) {
        var a = this.cubeV[i], b = this.cubeV[j];
        if (Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]) === 2) this.cubeE.push([a, b]);
      }
      // 24 chamber-wall triangles: (centre, face-centre, face-vertex)
      this.flags = [];
      var axes = [0, 1, 2];
      axes.forEach((ax) => { [-1, 1].forEach((s) => {
        var fc = [0, 0, 0]; fc[ax] = s;
        var o1 = axes.filter((aa) => aa !== ax);
        [-1, 1].forEach((b1) => { [-1, 1].forEach((b2) => {
          var v = [0, 0, 0]; v[ax] = s; v[o1[0]] = b1; v[o1[1]] = b2;
          this.flags.push({ fc: fc, v: v });
        }); });
      }); });
      // rhombic-dodecahedron faces: [apexA, cubeVert+, apexB, cubeVert-]
      this.rdFaces = [];
      for (var a2 = 0; a2 < 3; a2++) for (var b2 = a2 + 1; b2 < 3; b2++)
        [-1, 1].forEach((sa) => { [-1, 1].forEach((sb) => {
          var c = 3 - a2 - b2;
          var apA = [0,0,0]; apA[a2] = sa;
          var apB = [0,0,0]; apB[b2] = sb;
          var vP = [0,0,0]; vP[a2]=sa; vP[b2]=sb; vP[c]=1;
          var vN = [0,0,0]; vN[a2]=sa; vN[b2]=sb; vN[c]=-1;
          this.rdFaces.push({ apA: apA, apB: apB, vP: vP, vN: vN });
        }); });
      this.state = { t: 0, playing: false, vw: (typeof window !== 'undefined' ? window.innerWidth : 1280) };
      this._containerRef = (el) => { this.container = el; if (el) this.fit(); };
      this._stageRef = (el) => { this.stage = el; if (el) this.fit(); };
    }

    componentDidMount() {
      var saved = parseFloat(localStorage.getItem(this.KEY));
      if (!isNaN(saved) && saved > 0 && saved < this.END) this.setState({ t: saved });
      else if (this.props.autoplay !== false) this.setState({ playing: true });
      this._fit = () => this.fit();
      window.addEventListener('resize', this._fit);
      this.fit();
      this._key = (e) => {
        if (e.key === 'ArrowRight') this.nextCh();
        else if (e.key === 'ArrowLeft') this.prevCh();
        else if (e.key === ' ') { e.preventDefault(); this.toggle(); }
        else if (e.key === 'Escape') this.setState({ t: 0, playing: true });
      };
      window.addEventListener('keydown', this._key);
      this._last = performance.now();
      var loop = (now) => {
        var dt = (now - this._last) / 1000;
        this._last = now;
        if (this.state.playing) {
          var nt = this.state.t + dt;
          if (nt >= this.END) { nt = this.END; this.setState({ t: nt, playing: false }); }
          else this.setState({ t: nt });
          if (Math.floor(nt * 4) !== this._sv) {
            this._sv = Math.floor(nt * 4);
            localStorage.setItem(this.KEY, nt.toFixed(2));
          }
        }
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }

    componentWillUnmount() {
      cancelAnimationFrame(this._raf);
      window.removeEventListener('resize', this._fit);
      window.removeEventListener('keydown', this._key);
    }

    fit() {
      if (this.state.vw !== window.innerWidth) this.setState({ vw: window.innerWidth });
      if (!this.container || !this.stage) return;
      var w = this.container.clientWidth || window.innerWidth;
      var h = this.container.clientHeight || window.innerHeight;
      var s = Math.min(w / 1920, h / 1080);
      this.stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
    }

    sm(t, a, b) { if (b <= a) return t >= b ? 1 : 0; let e = (t - a) / (b - a); e = e < 0 ? 0 : e > 1 ? 1 : e; return e * e * (3 - 2 * e); }
    fio(t, a, b, c, d) { return this.sm(t, a, b) * (1 - this.sm(t, c, d)); }

    proj(p) {
      const a = this._az, ce = Math.cos(a), se = Math.sin(a), el = this._el;
      const xa = p[0] * ce - p[1] * se;
      const ya = p[0] * se + p[1] * ce;
      const zb = ya * Math.sin(el) + p[2] * Math.cos(el);
      return [this.cx + xa * this.S, this.cy - zb * this.S];
    }
    lerpP(A, B, k) { return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; }
    lerpP3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }

    seg(p0, p1, prog, color, w, o) {
      o = o || {}; if (prog <= 0) return null;
      const A = this.proj(p0), B0 = this.proj(p1), B = this.lerpP(A, B0, prog);
      return cr('line', { key: 's' + (this._k++), x1: A[0], y1: A[1], x2: B[0], y2: B[1],
        stroke: color, strokeWidth: w, strokeLinecap: 'round', strokeDasharray: o.dash, opacity: o.op == null ? 1 : o.op,
        filter: o.glow === false ? undefined : 'url(#ltproofg)' });
    }
    dot(p, rad, color, op) { if (op <= 0) return null; const P = this.proj(p);
      return cr('circle', { key: 'c' + (this._k++), cx: P[0], cy: P[1], r: rad, fill: color, opacity: op, filter: 'url(#ltproofg)' }); }
    lab(p, txt, color, op, o) { o = o || {}; if (op <= 0) return null; const P = this.proj(p);
      return cr('text', { key: 'l' + (this._k++), x: P[0] + (o.dx || 0), y: P[1] + (o.dy || 0), fill: color, opacity: op,
        fontSize: o.size || 30, fontFamily: "'Cormorant Garamond',serif", fontStyle: o.italic ? 'italic' : 'normal', fontWeight: o.w || 600,
        textAnchor: o.anchor || 'middle', filter: 'url(#ltproofg)' }, txt); }
    txt(x, y, s, color, op, o) { o = o || {}; if (op <= 0) return null;
      return cr('text', { key: 'x' + (this._k++), x, y, fill: color, opacity: op, fontSize: o.size || 34,
        fontFamily: o.face || "'Cormorant Garamond',serif", fontStyle: o.italic ? 'italic' : 'normal', fontWeight: o.w || 500,
        textAnchor: o.anchor || 'middle', filter: o.glow ? 'url(#ltproofg)' : undefined, letterSpacing: o.ls || 0 }, s); }
    poly(pts3, fill, op, o) { o = o || {}; if (op <= 0) return null;
      const pts = pts3.map((p) => this.proj(p));
      return cr('polygon', { key: 'p' + (this._k++), points: pts.map((p) => p[0] + ',' + p[1]).join(' '),
        fill: fill, opacity: op, stroke: o.stroke || 'none', strokeWidth: o.sw || 0 }); }
    arc(O3, A3, B3, rad, prog, color, op, o) { o = o || {}; if (prog <= 0 || op <= 0) return null;
      const O = this.proj(O3), A = this.proj(A3), B = this.proj(B3);
      let aA = Math.atan2(A[1] - O[1], A[0] - O[0]), aB = Math.atan2(B[1] - O[1], B[0] - O[0]);
      let d = aB - aA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const aE = aA + d * prog;
      const x0 = O[0] + rad * Math.cos(aA), y0 = O[1] + rad * Math.sin(aA);
      const x1 = O[0] + rad * Math.cos(aE), y1 = O[1] + rad * Math.sin(aE);
      return cr('path', { key: 'a' + (this._k++), d: `M${x0} ${y0} A${rad} ${rad} 0 0 ${d > 0 ? 1 : 0} ${x1} ${y1}`,
        stroke: color, strokeWidth: o.sw || 2.4, fill: 'none', strokeDasharray: o.dash || '5 6', opacity: op, filter: 'url(#ltproofg)', strokeLinecap: 'round' }); }

    curCI() { let ci = 0; for (let i = 0; i < this.CHT.length; i++) { if (this.state.t >= this.CHT[i] - 0.001) ci = i; } return ci; }
    seekCh(i) { i = Math.max(0, Math.min(this.CHT.length - 1, i)); this.setState({ t: this.CHT[i] + 0.02, playing: true }); localStorage.setItem(this.KEY, this.CHT[i].toFixed(2)); }
    nextCh() { this.seekCh(this.curCI() + 1); }
    prevCh() { this.seekCh(this.curCI() - 1); }
    toggle() { if (this.state.t >= this.END) this.setState({ t: 0, playing: true }); else this.setState((s) => ({ playing: !s.playing })); }
    onSeek(e) { const v = parseFloat(e.target.value) / 1000 * this.END; this.setState({ t: v, playing: false }); localStorage.setItem(this.KEY, v.toFixed(2)); }

    buildScene() {
      const t = this.state.t, C = this.C, u = this.u;
      const V = (x, y, z) => [x * u, y * u, z * u];
      const r2 = Math.SQRT2;
      const k = []; this._k = 0;
      const push = (e) => { if (e) k.push(e); };

      // ── camera: locked until the polyhedra, then one slow orbit + tilt ──
      this._az = this.az0 - (t > 36 ? 1.35 * Math.PI * this.sm(t, 36.5, 64) : 0);
      this._el = this.el + (t > 36 ? this.sm(t, 36.5, 50) * (7 * Math.PI / 180) : 0);

      // defs (single glow filter)
      push(cr('defs', { key: 'd' },
        cr('filter', { id: 'ltproofg', x: '-60%', y: '-60%', width: '220%', height: '220%' },
          cr('feGaussianBlur', { stdDeviation: 2.4, result: 'b' }),
          cr('feMerge', null,
            cr('feMergeNode', { in: 'b' }),
            cr('feMergeNode', { in: 'SourceGraphic' })))));

      // faint ground grid (present through the constructional scenes)
      const gOp = this.fio(t, 0.4, 3, 34.5, 36) * 0.10;
      if (gOp > 0) { for (let i = -4; i <= 4; i++) {
        let A = this.proj(V(i, -4, 0)), B = this.proj(V(i, 4, 0));
        push(cr('line', { key: 'gx' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.one, strokeWidth: 1, opacity: gOp }));
        A = this.proj(V(-4, i, 0)); B = this.proj(V(4, i, 0));
        push(cr('line', { key: 'gy' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.one, strokeWidth: 1, opacity: gOp }));
      } }

      // ══ SCENE 0 · Three Beginnings (0–3) ══════════════════════════════

      // ══ SCENE 1 · Begin at 45° — √2·√2·2 (3–11) ═══════════════════════
      const O1 = V(-.5, -.5, 0), A1 = V(.5, -.5, 0), B1 = V(.5, .5, 0), Cc1 = V(-.5, .5, 0), T1 = V(.5, .5, r2);
      const s1 = this.fio(t, 3.3, 4.1, 10.4, 11.2);
      if (s1 > 0) {
        // unit square — cyan (length 1)
        push(this.seg(O1, A1, this.sm(t, 3.6, 4.2), C.one, 2, { op: s1 }));
        push(this.seg(A1, B1, this.sm(t, 4.0, 4.6), C.one, 2, { op: s1 }));
        push(this.seg(B1, Cc1, this.sm(t, 4.4, 5.0), C.one, 2, { op: s1 }));
        push(this.seg(Cc1, O1, this.sm(t, 4.8, 5.4), C.one, 2, { op: s1 }));
        push(this.lab(this.lerpP3(O1, A1, .5), '1', C.oneL, this.sm(t, 5.0, 5.5) * s1, { dy: 26, size: 26, italic: true }));
        // √2 floor diagonal — gold
        push(this.seg(O1, B1, this.sm(t, 5.5, 6.4), C.two, 2.6, { op: s1 }));
        push(this.lab(this.lerpP3(O1, B1, .55), '√2', C.twoL, this.sm(t, 6.3, 6.9) * s1, { dy: 24, size: 28, italic: true }));
        // √2 riser — gold (stands from B)
        const rp = this.sm(t, 6.6, 7.6);
        push(this.seg(B1, this.lerpP3(B1, T1, 1), rp, C.two, 2.6, { op: s1 }));
        push(this.lab(this.lerpP3(B1, T1, .5), '√2', C.twoL, this.sm(t, 7.4, 8.0) * s1, { dx: 26, size: 28, italic: true }));
        // the rod O→T (length 2) sweeps up via magenta act-arc
        const sw = this.sm(t, 7.8, 9.0);
        push(this.arc(O1, B1, T1, 46, sw, C.act, s1 * .9, { dash: '4 7', sw: 2.8 }));
        push(this.seg(O1, T1, sw, C.rod, 3.2, { op: s1 }));
        push(this.dot(T1, 4.6, C.rod, this.sm(t, 8.8, 9.3) * s1));
        push(this.lab(this.lerpP3(O1, T1, .5), '2', C.white, this.sm(t, 8.6, 9.2) * s1, { dx: -20, dy: -6, size: 30, italic: true }));
        // 45° gold angle at O
        push(this.arc(O1, B1, T1, 66, this.sm(t, 9.0, 9.6), C.two, this.sm(t, 9.0, 9.6) * s1));
        push(this.lab(this.lerpP3(O1, T1, .30), '45°', C.twoL, this.sm(t, 9.5, 10.0) * s1, { dy: 22, dx: 20, size: 22, italic: true }));
        // the standing Lost Triangle A–B–T  (1 : √2 : √3)
        const lt = this.sm(t, 9.4, 10.2) * s1;
        push(this.poly([A1, B1, T1], `rgba(60,203,142,${lt * .30})`, 1));
        push(this.seg(A1, T1, this.sm(t, 9.4, 10.1), C.three, 2.6, { op: s1 })); // √3 brace
        push(this.lab(this.lerpP3(A1, T1, .5), '√3', C.threeL, this.sm(t, 10.0, 10.5) * s1, { dx: 22, size: 28, italic: true }));
      }
      push(this.txt(960, 928, 'Floor √2, rise √2 → the length-2 rod stands at 45° — and the Lost Triangle closes', C.twoT, this.fio(t, 6.0, 6.8, 10.4, 11.1), { size: 32, italic: true }));

      // ══ SCENE 2 · Begin at 30° — 1·√3·2 (11–19) ═══════════════════════
      const O2 = V(-r2/2, -.5, 0), M2 = V(r2/2, -.5, 0), N2 = V(r2/2, .5, 0), Np = V(r2/2, .5, 1);
      const s2 = this.fio(t, 11.3, 12.1, 18.4, 19.2);
      if (s2 > 0) {
        // flat Lost Triangle: √2 (gold) + 1 (cyan) → √3 (green)
        push(this.seg(O2, M2, this.sm(t, 11.6, 12.5), C.two, 2.6, { op: s2 }));
        push(this.lab(this.lerpP3(O2, M2, .5), '√2', C.twoL, this.sm(t, 12.3, 12.9) * s2, { dy: 26, size: 28, italic: true }));
        push(this.seg(M2, N2, this.sm(t, 12.7, 13.5), C.one, 2, { op: s2 }));
        push(this.lab(this.lerpP3(M2, N2, .5), '1', C.oneL, this.sm(t, 13.3, 13.9) * s2, { dx: 22, size: 26, italic: true }));
        const ltp = this.sm(t, 13.6, 14.5);
        push(this.poly([O2, M2, N2], `rgba(60,203,142,${ltp * s2 * .28})`, 1));
        push(this.seg(O2, N2, ltp, C.three, 2.6, { op: s2 }));
        push(this.lab(this.lerpP3(O2, N2, .5), '√3', C.threeL, this.sm(t, 14.3, 14.9) * s2, { dy: -14, dx: -6, size: 28, italic: true }));
        // cyan riser of 1
        const rp = this.sm(t, 14.8, 15.7);
        push(this.seg(N2, this.lerpP3(N2, Np, 1), rp, C.one, 2.4, { op: s2 }));
        push(this.lab(this.lerpP3(N2, Np, .5), '1', C.oneL, this.sm(t, 15.5, 16.1) * s2, { dx: 22, size: 26, italic: true }));
        // rod lifts to 30° — magenta sweep, white length-2 rod
        const sw = this.sm(t, 15.9, 17.2);
        push(this.arc(O2, N2, Np, 46, sw, C.act, s2 * .9, { dash: '4 7', sw: 2.8 }));
        push(this.seg(O2, Np, sw, C.rod, 3.2, { op: s2 }));
        push(this.dot(Np, 4.6, C.rod, this.sm(t, 17.0, 17.5) * s2));
        push(this.lab(this.lerpP3(O2, Np, .5), '2', C.white, this.sm(t, 16.8, 17.4) * s2, { dy: -16, size: 30, italic: true }));
        push(this.arc(O2, N2, Np, 70, this.sm(t, 17.2, 17.8), C.two, this.sm(t, 17.2, 17.8) * s2));
        push(this.lab(this.lerpP3(O2, Np, .32), '30°', C.twoL, this.sm(t, 17.7, 18.2) * s2, { dy: 20, dx: 22, size: 22, italic: true }));
      }
      push(this.txt(960, 928, 'The Lost Triangle lies flat; a riser of 1 lifts the rod to 30° — over the triangle that made it', C.twoT, this.fio(t, 14.0, 14.8, 18.4, 19.1), { size: 31, italic: true }));

      // ══ SCENE 3 · Begin at 35.26° — the box’s own angle (19–27) ═══════
      const O3 = V(-.5, -.5, -.5), P3 = V(.5, .5, -.5), Q3 = V(.5, .5, .5);
      const s3 = this.fio(t, 19.3, 20.1, 26.4, 27.2);
      if (s3 > 0) {
        // unit box wireframe (faint)
        const boxOp = this.sm(t, 19.5, 21.0) * s3 * .5;
        this.cubeE.forEach((e, i) => { const A = this.proj(V(e[0][0]/2, e[0][1]/2, e[0][2]/2)), B = this.proj(V(e[1][0]/2, e[1][1]/2, e[1][2]/2));
          push(cr('line', { key: 'bx' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(240,237,232,.5)', strokeWidth: 1.2, opacity: boxOp, filter: 'url(#ltproofg)' })); });
        // Lost Triangle standing in the face: √2 base diag (gold) + 1 up edge (cyan) + √3 space diag (green)
        push(this.seg(O3, P3, this.sm(t, 21.2, 22.1), C.two, 2.6, { op: s3 }));
        push(this.lab(this.lerpP3(O3, P3, .5), '√2', C.twoL, this.sm(t, 21.9, 22.5) * s3, { dy: 26, size: 27, italic: true }));
        push(this.seg(P3, Q3, this.sm(t, 22.3, 23.1), C.one, 2.2, { op: s3 }));
        push(this.lab(this.lerpP3(P3, Q3, .5), '1', C.oneL, this.sm(t, 22.9, 23.5) * s3, { dx: 22, size: 26, italic: true }));
        const ltp = this.sm(t, 23.3, 24.4);
        push(this.poly([O3, P3, Q3], `rgba(60,203,142,${ltp * s3 * .30})`, 1));
        // the rod rises as the box’s space diagonal (√3, green) via magenta sweep
        const sw = this.sm(t, 23.6, 25.0);
        push(this.arc(O3, P3, Q3, 44, sw, C.act, s3 * .85, { dash: '4 7', sw: 2.8 }));
        push(this.seg(O3, Q3, ltp, C.three, 3.0, { op: s3 }));
        push(this.dot(Q3, 4.6, C.rod, this.sm(t, 24.6, 25.1) * s3));
        push(this.lab(this.lerpP3(O3, Q3, .5), '√3', C.threeL, this.sm(t, 24.4, 25.0) * s3, { dx: -22, dy: -4, size: 28, italic: true }));
        // 35.26° / 54.74° gold
        push(this.arc(O3, P3, Q3, 62, this.sm(t, 25.0, 25.6), C.two, this.sm(t, 25.0, 25.6) * s3));
        push(this.lab(this.lerpP3(O3, Q3, .30), '35.26°', C.twoL, this.sm(t, 25.5, 26.0) * s3, { dy: 20, dx: 30, size: 21, italic: true }));
        push(this.arc(Q3, O3, P3, 40, this.sm(t, 25.6, 26.2), C.two, this.sm(t, 25.6, 26.2) * s3));
        push(this.lab(this.lerpP3(Q3, P3, .28), '54.74°', C.twoL, this.sm(t, 26.0, 26.5) * s3, { dx: -18, dy: 6, size: 19, italic: true }));
      }
      push(this.txt(960, 928, 'The cube’s space diagonal meets its face at 35.26° — edge 1, face-diagonal √2, space-diagonal √3', C.twoT, this.fio(t, 22.0, 22.8, 26.4, 27.1), { size: 30, italic: true }));

      // ══ SCENE 4 · One Triangle — the shared √3 diagonal, fanned in real 3D (27–36) ══
      const s4 = this.fio(t, 27.3, 28.4, 35.0, 36.0);
      if (s4 > 0) {
        const pulse = 0.72 + 0.28 * Math.sin(t * 2.4);
        const O4 = [-1.1, -1.1, -1.1], T4 = [1.1, 1.1, 1.1];
        const fans = [
          { foot: [1.1, 1.1, -1.1], tag: 'rise z', t0: 28.0 },
          { foot: [1.1, -1.1, 1.1], tag: 'rise y', t0: 28.5 },
          { foot: [-1.1, 1.1, 1.1], tag: 'rise x', t0: 29.0 }
        ];
        // faint cube corner — grounds the fan in real space
        const boxOp = this.sm(t, 27.6, 29) * s4 * .35;
        this.cubeE.forEach((e, i) => {
          const A = this.proj([e[0][0] * 1.1, e[0][1] * 1.1, e[0][2] * 1.1]), B = this.proj([e[1][0] * 1.1, e[1][1] * 1.1, e[1][2] * 1.1]);
          push(cr('line', { key: 'l4box' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(240,237,232,.4)', strokeWidth: 1, opacity: boxOp, filter: 'url(#ltproofg)' }));
        });
        fans.forEach((f, i) => {
          const app = this.sm(t, f.t0, f.t0 + 1.0) * s4;
          if (app <= 0) return;
          const dp = this.sm(t, f.t0, f.t0 + 0.7);
          const rp = this.sm(t, f.t0 + 0.5, f.t0 + 1.3);
          push(this.poly([O4, f.foot, T4], `rgba(60,203,142,${app * pulse * .20})`, 1));
          push(this.seg(O4, f.foot, dp, C.two, 2.8, { op: app }));   // √2 leg — gold
          push(this.seg(f.foot, T4, rp, C.one, 2.4, { op: app }));   // 1 leg — cyan
          push(this.dot(f.foot, 4, C.two, app));
          push(this.lab(this.lerpP3(O4, f.foot, .5), '√2', C.twoL, app, { size: 22, italic: true, dy: -12 }));
          push(this.lab(this.lerpP3(f.foot, T4, .5), '1', C.oneL, app, { size: 22, italic: true, dx: 18 }));
          push(this.lab(f.foot, f.tag, C.mute, app, { size: 18, italic: true, dy: 22, dx: i === 1 ? -34 : 0 }));
        });
        const hyp = this.sm(t, 30.0, 31.2) * s4;
        push(this.seg(O4, T4, hyp, C.three, 3.2, { op: s4 }));
        push(this.dot(O4, 5, C.rod, s4 * this.sm(t, 27.6, 28.2)));
        push(this.dot(T4, 5, C.rod, hyp));
        push(this.lab(this.lerpP3(O4, T4, .5), '√3', C.threeL, hyp, { size: 26, italic: true, dx: -26 }));
        push(this.txt(960, 300, 'Whichever angle you begin with, you arrive at the same triangle.', C.white, this.sm(t, 31.4, 32.6) * s4, { size: 42, italic: true, glow: true }));
        push(this.txt(960, 352, '1 : √2 : √3 — one shared √3 diagonal, three ways in', C.threeT, this.sm(t, 32.4, 33.4) * s4, { size: 28, italic: true, glow: true }));
        push(this.txt(960, 900, 'That is the proof.', C.mute, this.sm(t, 33.6, 34.6) * s4, { size: 30, italic: true, ls: 2 }));
      }

      // ══ Cube / polyhedra scenes share these projected helpers ═════════
      const cubeScale = (p) => V(p[0], p[1], p[2]);

      // ══ SCENE 5 · The Cube’s Chamber Wall (36–47) ═════════════════════
      const s5 = this.fio(t, 36.3, 37.6, 46.2, 47.2);
      if (s5 > 0) {
        // cube edges fade in
        const eOp = this.sm(t, 36.6, 38.2) * s5;
        this.cubeE.forEach((e, i) => { const A = this.proj(cubeScale(e[0])), B = this.proj(cubeScale(e[1]));
          push(cr('line', { key: 'ce' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(240,237,232,.42)', strokeWidth: 1.3, opacity: eOp, filter: 'url(#ltproofg)' })); });
        // one hero chamber triangle labelled 1 · √2 · √3
        const heroF = this.flags[2];
        const O = V(0,0,0), Fc = V(heroF.fc[0], heroF.fc[1], heroF.fc[2]), Vt = V(heroF.v[0], heroF.v[1], heroF.v[2]);
        const hp = this.sm(t, 37.8, 39.2) * s5;
        push(this.poly([O, Fc, Vt], `rgba(60,203,142,${hp * .22})`, 1));
        push(this.seg(O, Fc, this.sm(t, 38.0, 38.8), C.one, 2.4, { op: s5 }));
        push(this.seg(Fc, Vt, this.sm(t, 38.4, 39.2), C.two, 2.4, { op: s5 }));
        push(this.seg(O, Vt, this.sm(t, 38.8, 39.7), C.three, 2.6, { op: s5 }));
        push(this.lab(this.lerpP3(O, Fc, .5), '1', C.oneL, this.sm(t, 39.2, 39.8) * s5, { size: 26, italic: true, dy: -10 }));
        push(this.lab(this.lerpP3(Fc, Vt, .5), '√2', C.twoL, this.sm(t, 39.6, 40.2) * s5, { size: 26, italic: true, dx: 20 }));
        push(this.lab(this.lerpP3(O, Vt, .55), '√3', C.threeL, this.sm(t, 40.0, 40.6) * s5, { size: 26, italic: true, dx: 18, dy: 4 }));
        // 24 chamber walls fan through in waves
        this.flags.forEach((f, i) => {
          const app = this.sm(t, 40.6 + i * 0.18, 41.4 + i * 0.18) * s5;
          if (app <= 0) return;
          const Fc2 = V(f.fc[0], f.fc[1], f.fc[2]), Vt2 = V(f.v[0], f.v[1], f.v[2]);
          push(this.poly([O, Fc2, Vt2], `rgba(60,203,142,${app * .12})`, 1, { stroke: `rgba(127,178,230,${app * .5})`, sw: 1 }));
        });
        push(this.txt(960, 928, 'Centre→face 1, face→vertex √2, centre→vertex √3 — the Lost Triangle is the cube’s chamber wall', C.oneT, this.fio(t, 38.6, 39.6, 46.2, 47.0), { size: 30, italic: true }));
      }
      // chip — 24 × (1·√2·√3)
      const chip5 = this.fio(t, 42.5, 43.5, 46.2, 47.2);
      if (chip5 > 0) push(cr('g', { key: 'chip5', opacity: chip5 },
        cr('rect', { x: 1636, y: 1000, width: 256, height: 60, rx: 12, fill: 'rgba(74,144,217,.08)', stroke: 'rgba(74,144,217,.4)', strokeWidth: 2 }),
        cr('text', { x: 1764, y: 1024, textAnchor: 'middle', fontSize: '15px', fontFamily: "'Space Mono',monospace", fill: '#7FB2E6', letterSpacing: '.06em' }, '24 × (1 · √2 · √3)'),
        cr('text', { x: 1764, y: 1046, textAnchor: 'middle', fontSize: '11px', fontFamily: "'Space Grotesk',sans-serif", fill: 'rgba(240,237,232,.6)', letterSpacing: '.04em' }, 'walls of the 48 chambers')));

      // ══ SCENE 6 · The Double (47–56) ══════════════════════════════════
      const s6 = this.fio(t, 47.3, 48.4, 55.2, 56.2);
      if (s6 > 0) {
        // dim cube
        this.cubeE.forEach((e, i) => { const A = this.proj(cubeScale(e[0])), B = this.proj(cubeScale(e[1]));
          push(cr('line', { key: 'c6e' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(240,237,232,.16)', strokeWidth: 1.1, opacity: s6, filter: 'url(#ltproofg)' })); });
        const ctr = V(0,0,0);
        const d1a = V(1,1,1), d1b = V(-1,-1,-1), d2a = V(1,1,-1), d2b = V(-1,-1,1);
        const dp1 = this.sm(t, 48.0, 49.2), dp2 = this.sm(t, 48.8, 50.0);
        push(this.seg(d1b, ctr, dp1, C.rod, 2.6, { op: s6 })); push(this.seg(ctr, d1a, dp1, C.rod, 2.6, { op: s6 }));
        push(this.seg(d2b, ctr, dp2, C.rod, 2.6, { op: s6 })); push(this.seg(ctr, d2a, dp2, C.rod, 2.6, { op: s6 }));
        push(this.dot(ctr, 4.2, C.two, this.sm(t, 49.6, 50.2) * s6));
        // 70.53° then 109.47° gold arcs
        push(this.arc(ctr, d1a, d2a, 92, this.sm(t, 50.2, 51.4), C.two, this.sm(t, 50.2, 51.4) * s6, { sw: 3.0 }));
        push(this.lab(this.lerpP3(ctr, this.lerpP3(d1a, d2a, .5), .62), '70.53°', C.twoL, this.sm(t, 51.2, 51.9) * s6, { size: 26, italic: true }));
        push(this.arc(ctr, d1a, d2b, 126, this.sm(t, 51.8, 53.2), C.two, this.sm(t, 51.8, 53.2) * s6, { sw: 3.0 }));
        push(this.lab(this.lerpP3(ctr, this.lerpP3(d1a, d2b, .5), .78), '109.47°', C.twoL, this.sm(t, 53.0, 53.7) * s6, { size: 26, italic: true }));
        // math tie
        const mOp = this.fio(t, 50.6, 51.6, 55.0, 55.8), mx = 86;
        push(this.txt(mx, 762, '2 × 35.26° = 70.53°', C.twoT, mOp, { size: 32, italic: true, anchor: 'start' }));
        push(this.txt(mx, 812, '2 × 54.74° = 109.47°', C.twoT, mOp, { size: 32, italic: true, anchor: 'start' }));
        push(this.txt(mx, 862, 'the tetrahedral angles — arccos(±1/3)', C.white, mOp, { size: 27, italic: true, anchor: 'start' }));
        push(this.txt(960, 928, 'Two space diagonals cross; double the Lost Triangle’s corners → the tetrahedral angles', C.twoT, this.fio(t, 49.2, 50.0, 55.2, 56.0), { size: 30, italic: true }));
      }

      // ══ SCENE 7 · The Blossom — Rhombic Dodecahedron (56–66) ══════════
      const s7 = this.fio(t, 56.3, 57.6, 63.4, 64.4);
      if (s7 > 0) {
        const grow = this.sm(t, 57.2, 60.0);
        const ap = (arr) => V(arr[0]*(1+grow), arr[1]*(1+grow), arr[2]*(1+grow));
        // dim cube shrinking into the solid
        const cubeFade = (1 - grow) * s7 * .5;
        if (cubeFade > 0.02) this.cubeE.forEach((e, i) => { const A = this.proj(cubeScale(e[0])), B = this.proj(cubeScale(e[1]));
          push(cr('line', { key: 'c7e' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: 'rgba(240,237,232,.4)', strokeWidth: 1.1, opacity: cubeFade, filter: 'url(#ltproofg)' })); });
        // 12 rhombic faces
        this.rdFaces.forEach((f, i) => {
          const apA = ap(f.apA), apB = ap(f.apB), vP = V(f.vP[0], f.vP[1], f.vP[2]), vN = V(f.vN[0], f.vN[1], f.vN[2]);
          const app = this.sm(t, 57.4 + i * 0.12, 58.6 + i * 0.12) * s7;
          if (app <= 0) return;
          push(this.poly([apA, vP, apB, vN], `rgba(224,52,158,${app * .05})`, 1, { stroke: `rgba(60,203,142,${app * .5})`, sw: 1.4 }));
        });
        // highlight one face → four Lost Triangles
        const hf = this.rdFaces[6];
        const HapA = ap(hf.apA), HapB = ap(hf.apB), HvP = V(hf.vP[0], hf.vP[1], hf.vP[2]), HvN = V(hf.vN[0], hf.vN[1], hf.vN[2]);
        const hlOp = this.fio(t, 60.4, 61.4, 63.2, 64.2);
        if (hlOp > 0) {
          const pulse = 0.7 + 0.3 * Math.sin(t * 2.6);
          const Mid = this.lerpP3(HapA, HapB, .5);
          // four LTs
          [[HapA, HvP], [HvP, HapB], [HapB, HvN], [HvN, HapA]].forEach((pr) => {
            push(this.poly([Mid, pr[0], pr[1]], `rgba(60,203,142,${hlOp * pulse * .22})`, 1));
          });
          // diagonals √2 : 1
          push(this.seg(HapA, HapB, 1, C.two, 2.4, { op: hlOp }));   // long diagonal (√2 family) gold
          push(this.seg(HvP, HvN, 1, C.one, 2.2, { op: hlOp }));      // short diagonal (1 family) cyan
          // edges √3
          [[HapA, HvP], [HvP, HapB], [HapB, HvN], [HvN, HapA]].forEach((pr) =>
            push(this.seg(pr[0], pr[1], 1, C.three, 2.2, { op: hlOp })));
          push(this.lab(Mid, '4 × (1 · √2 · √3)', C.threeT, this.sm(t, 61.6, 62.4) * hlOp, { size: 25, italic: true, dy: -50 }));
        }
        push(this.txt(960, 928, 'The cube blossoms into the rhombic dodecahedron — four Lost Triangles on every face', C.actT, this.fio(t, 58.6, 59.6, 63.2, 64.2), { size: 31, italic: true }));
      }
      // finale statements
      push(this.txt(960, 300, 'End where you began.', C.white, this.fio(t, 63.4, 64.4, 65.6, 66.5), { size: 46, italic: true, glow: true }));
      push(this.txt(960, 352, 'gregg fleishman', 'rgba(138,132,128,.85)', this.fio(t, 64.4, 65.2, 65.8, 66.5), { size: 26, italic: true }));

      return cr('svg', { viewBox: '0 0 1920 1080', width: '100%', height: '100%', style: { position: 'absolute', inset: 0, display: 'block' } }, k);
    }

    render() {
      const t = this.state.t, ci = this.curCI();
      const scene = this.buildScene();
      const ctaOp = this.sm(t, 64.5, 66);
      const mm = Math.floor(t / 60), ss = Math.floor(t % 60);
      const chapterGlow = (function (hex) { var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return 'rgba(' + r + ',' + g + ',' + b + ',.3)'; })(this.CHC[ci]);
      const navScale = this.state.vw < 420 ? 0.78 : (this.state.vw < 640 ? 0.88 : 1);
      const playIcon = this.state.playing ? '❚❚' : '►';
      const tlabel = mm + ':' + String(ss).padStart(2, '0') + ' / 1:06';

      return cr('div', { ref: this._containerRef, style: { position: 'relative', width: '100%', height: '100vh', background: '#0B0B0B', overflow: 'hidden' } },
        cr('div', { ref: this._stageRef, style: { position: 'absolute', left: '50%', top: '50%', width: '1920px', height: '1080px', transformOrigin: 'center center' } },
          // Ambient background
          cr('div', { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)' } }),

          // Chapter title — top left
          cr('div', { style: { position: 'absolute', left: '72px', top: '158px', pointerEvents: 'none' } },
            cr('div', { style: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '52px', letterSpacing: '-0.01em', color: this.CHC[ci], opacity: this.sm(t, this.CHT[ci], this.CHT[ci] + 0.7), transition: 'color .5s ease', textShadow: '0 0 40px ' + chapterGlow } }, this.CHN[ci]),
            cr('div', { style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '15px', letterSpacing: '.30em', textTransform: 'uppercase', color: 'rgba(138,132,128,.7)', marginTop: '14px', opacity: this.sm(t, this.CHT[ci], this.CHT[ci] + 0.7) } }, 'The Fleishman Sequence')
          ),

          // SVG scene
          scene,

          // CTA panel — fades in at end
          cr('div', { style: { position: 'absolute', left: '50%', bottom: '262px', transform: 'translateX(-50%)', opacity: ctaOp, transition: 'opacity 1.4s ease', textAlign: 'center', pointerEvents: ctaOp > 0.1 ? 'auto' : 'none', whiteSpace: 'nowrap' } },
            cr('div', { style: { fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#8A8480', marginBottom: '22px' } }, 'You end where you began'),
            cr('div', { style: { display: 'inline-block', fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase', color: '#C8A96E', textDecoration: 'none', border: '1px solid rgba(200,169,110,.45)', borderRadius: '3px', padding: '16px 44px', background: 'rgba(200,169,110,.06)', animation: 'lt3b-pulse-glow 3s ease-in-out infinite' } }, 'Three beginnings · One triangle'),
            cr('div', { style: { marginTop: '20px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(138,132,128,.5)' } }, 'Gregg Fleishman · 1 : √2 : √3')
          )
        ),

        // Playback bar
        cr('div', { style: { position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%) scale(' + navScale + ')', transformOrigin: 'bottom center', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 18px', borderRadius: '14px', background: 'rgba(18,18,18,.66)', backdropFilter: 'blur(10px)', border: '1px solid rgba(240,237,232,.07)', boxShadow: '0 8px 30px rgba(0,0,0,.5)', fontFamily: "'Space Grotesk', sans-serif", maxWidth: '96vw', zIndex: 10 } },
          cr('button', { onClick: () => this.prevCh(), title: 'previous chapter', style: { width: '36px', height: '36px', border: 'none', borderRadius: '10px', background: 'rgba(240,237,232,.06)', color: '#F0EDE8', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '‹'),
          cr('button', { onClick: () => this.toggle(), title: 'play / pause', style: { width: '40px', height: '40px', border: 'none', borderRadius: '10px', background: 'rgba(200,169,110,.16)', color: '#F0EDE8', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, playIcon),
          cr('button', { onClick: () => this.nextCh(), title: 'next chapter', style: { width: '36px', height: '36px', border: 'none', borderRadius: '10px', background: 'rgba(240,237,232,.06)', color: '#F0EDE8', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '›'),
          cr('input', { className: 'lt-scrub', type: 'range', min: '0', max: '1000', value: Math.round(t / this.END * 1000), onChange: (e) => this.onSeek(e), style: { width: '300px' } }),
          cr('span', { style: { fontSize: '11px', color: '#8A8480', letterSpacing: '.14em', textTransform: 'uppercase', minWidth: '188px', textAlign: 'left', whiteSpace: 'nowrap' } }, this.CHN[ci]),
          cr('span', { style: { fontSize: '11px', color: 'rgba(138,132,128,.5)', letterSpacing: '.10em', minWidth: '64px', textAlign: 'right', whiteSpace: 'nowrap', fontFamily: "'Space Mono', monospace" } }, tlabel)
        )
      );
    }
  }

  window.LostTriangleProof = LostTriangleProof;
})();
