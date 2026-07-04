/* Lost Triangle — Chapter VIII · The Cube Angle
   Faithful port of the design handoff "Lost Triangle Chapter VIII - The Cube
   Angle.dc.html" (DCLogic/x-dc) to a plain React class, no build step.
   Defines window.LostTriangleCubeAngle, used by mathematics-preview.html.

   Gregg's alternative construction: a unit ray at azimuth 35.26° (= arctan 1/√2)
   tilted 30° up lands exactly on (√2, 1, 1), |OT| = 2 — building the 30-60-90
   triangle 1 : √3 : 2.

   CANON NAMING (locked by Yuto 2026-06-25): the Lost Triangle is 1 : √2 : √3.
   The 1 : √3 : 2 (30-60-90) this chapter constructs is the CONSTRUCTION /
   sundial triangle — a path *to* the geometry, never the namesake. The tie to
   the Lost Triangle is the *bearing*: azimuth 35.26° IS the cube's
   face-diagonal ↔ space-diagonal angle. The reference's reveal line called
   this "the Lost Triangle (1 : √3 : 2)"; that mislabel is corrected here (the
   only change from the source). */
(function () {
  'use strict';
  var cr = React.createElement;

  class LostTriangleCubeAngle extends React.Component {
    constructor(props) {
      super(props);
      this.KEY = 'ltch8_t';
      this.END = 21;
      this.CHT = [0, 2.4, 6.2, 7.6, 8.8, 10.6, 12.0, 14.0];
      this.CHN = ['Setup — the reference unit', 'Azimuth 35.26°', 'The Rise (1)', 'The Sundial (2)', 'Tilt 30°', 'Right Angle at Foot', 'The Reveal', 'The Connection'];
      // 3D projection constants — same room as the other chapters
      this.S = 92; this.cx = 960; this.cy = 600;
      this.el = 26 * Math.PI / 180;
      this.GU = 1.6;
      this.az0 = -32 * Math.PI / 180;
      this._az = this.az0;
      // Color palette — length + act canon
      this.C = {
        cyan: '#4A90D9', labelCyan: '#A9CDEE',
        gold: '#C8A96E', titleGold: '#D8BE8F', labelGold: '#E3D0AC',
        green: '#3CCB8E',
        white: '#F0EDE8',
        magenta: '#E0349E', titleMag: '#F05BB5'
      };
      // Key 3D points — O = origin hinge; Foot = (√2,1,0)·GU (azimuth 35.26°,
      // length √3); Apex = Foot + (0,0,1)·GU (length 2 from O)
      const g = this.GU, r2 = Math.sqrt(2);
      this.P = {
        O:    [0, 0, 0],
        Ux:   [g, 0, 0],
        Foot: [r2 * g, g, 0],
        Apex: [r2 * g, g, g]
      };
      // Grid lines
      this.grid = [];
      const N = 5;
      for (let i = -N; i <= N; i++) {
        this.grid.push([[i, -N, 0], [i, N, 0]]);
        this.grid.push([[-N, i, 0], [N, i, 0]]);
      }
      this.state = { t: 0, playing: false, vw: (typeof window !== 'undefined' ? window.innerWidth : 1280) };
      this._containerRef = (el) => { this.rootEl = el; };
      this._stageRef = (el) => { this.stage = el; if (el) this.fit(); };
    }

    componentDidMount() {
      const saved = parseFloat(localStorage.getItem(this.KEY));
      if (!isNaN(saved) && saved > 0 && saved < this.END) this.setState({ t: saved });
      else if (this.props.autoplay !== false) this.setState({ playing: true });
      this.fit();
      this._fit = () => this.fit();
      window.addEventListener('resize', this._fit);
      this._key = (e) => {
        if (e.key === 'ArrowRight') this.nextCh();
        else if (e.key === 'ArrowLeft') this.prevCh();
        else if (e.key === ' ') { e.preventDefault(); this.toggle(); }
        else if (e.key === 'Escape') this.setState({ t: 0, playing: true });
      };
      window.addEventListener('keydown', this._key);
      this._last = performance.now();
      const loop = (now) => {
        const dt = (now - this._last) / 1000;
        this._last = now;
        if (this.state.playing) {
          let nt = this.state.t + dt;
          if (nt >= this.END) { nt = this.END; this.setState({ t: nt, playing: false }); }
          else this.setState({ t: nt });
          if (Math.floor(nt * 4) !== this._sv) { this._sv = Math.floor(nt * 4); localStorage.setItem(this.KEY, nt.toFixed(2)); }
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
      if (!this.stage) return;
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      this.stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    }

    sm(t, a, b) { if (b <= a) return t >= b ? 1 : 0; let e = (t - a) / (b - a); e = e < 0 ? 0 : e > 1 ? 1 : e; return e * e * (3 - 2 * e); }
    fio(t, a, b, c, d) { return this.sm(t, a, b) * (1 - this.sm(t, c, d)); }

    proj(p) {
      const a = this._az, ce = Math.cos(a), se = Math.sin(a);
      const xa = p[0] * ce - p[1] * se;
      const ya = p[0] * se + p[1] * ce;
      const za = p[2];
      const zb = ya * Math.sin(this.el) + za * Math.cos(this.el);
      return [this.cx + xa * this.S, this.cy - zb * this.S];
    }
    lerpP(A, B, k) { return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; }
    lerpP3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }

    seg(p0, p1, prog, color, w, o) {
      o = o || {}; if (prog <= 0) return null;
      const A = this.proj(p0), B0 = this.proj(p1), B = this.lerpP(A, B0, prog);
      return cr('line', { key: 's' + (this._k++), x1: A[0], y1: A[1], x2: B[0], y2: B[1],
        stroke: color, strokeWidth: w, strokeLinecap: 'round', strokeDasharray: o.dash, opacity: o.op == null ? 1 : o.op,
        filter: o.glow === false ? undefined : 'url(#ltch8g)' });
    }
    dot(p, rad, color, op) { if (op <= 0) return null; const P = this.proj(p);
      return cr('circle', { key: 'c' + (this._k++), cx: P[0], cy: P[1], r: rad, fill: color, opacity: op, filter: 'url(#ltch8g)' }); }
    lab(p, txt, color, op, o) { o = o || {}; if (op <= 0) return null; const P = this.proj(p);
      return cr('text', { key: 'l' + (this._k++), x: P[0] + (o.dx || 0), y: P[1] + (o.dy || 0), fill: color, opacity: op,
        fontSize: o.size || 30, fontFamily: "'Cormorant Garamond',serif", fontStyle: o.italic === false ? 'normal' : 'italic', fontWeight: o.w || 600,
        textAnchor: o.anchor || 'middle', filter: 'url(#ltch8g)' }, txt); }
    txt(x, y, s, color, op, o) { o = o || {}; if (op <= 0) return null;
      return cr('text', { key: 'x' + (this._k++), x, y, fill: color, opacity: op, fontSize: o.size || 34,
        fontFamily: o.face || "'Cormorant Garamond',serif", fontStyle: o.italic ? 'italic' : 'normal', fontWeight: o.w || 500,
        textAnchor: o.anchor || 'middle', filter: o.glow ? 'url(#ltch8g)' : undefined, letterSpacing: o.ls || 0 }, s); }
    arc(O3, A3, B3, rad, prog, color, op) { if (prog <= 0 || op <= 0) return null;
      const O = this.proj(O3), A = this.proj(A3), B = this.proj(B3);
      let aA = Math.atan2(A[1] - O[1], A[0] - O[0]), aB = Math.atan2(B[1] - O[1], B[0] - O[0]);
      let d = aB - aA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const aE = aA + d * prog;
      const x0 = O[0] + rad * Math.cos(aA), y0 = O[1] + rad * Math.sin(aA);
      const x1 = O[0] + rad * Math.cos(aE), y1 = O[1] + rad * Math.sin(aE);
      return cr('path', { key: 'a' + (this._k++), d: `M${x0} ${y0} A${rad} ${rad} 0 0 ${d > 0 ? 1 : 0} ${x1} ${y1}`,
        stroke: color, strokeWidth: 2.4, fill: 'none', strokeDasharray: '5 6', opacity: op, filter: 'url(#ltch8g)', strokeLinecap: 'round' }); }

    curCI() { let ci = 0; for (let i = 0; i < this.CHT.length; i++) { if (this.state.t >= this.CHT[i] - 0.001) ci = i; } return ci; }
    seekCh(i) { i = Math.max(0, Math.min(this.CHT.length - 1, i)); this.setState({ t: this.CHT[i] + 0.02, playing: true }); localStorage.setItem(this.KEY, this.CHT[i].toFixed(2)); }
    nextCh() { this.seekCh(this.curCI() + 1); }
    prevCh() { this.seekCh(this.curCI() - 1); }
    toggle() { if (this.state.t >= this.END) this.setState({ t: 0, playing: true }); else this.setState((s) => ({ playing: !s.playing })); }
    onSeek(e) { const v = parseFloat(e.target.value) / 1000 * this.END; this.setState({ t: v, playing: false }); localStorage.setItem(this.KEY, v.toFixed(2)); }

    buildScene() {
      const t = this.state.t, C = this.C, P = this.P;
      const k = []; this._k = 0;
      const push = (e) => { if (e) k.push(e); };

      // Glow filter
      push(cr('defs', { key: 'd' },
        cr('filter', { id: 'ltch8g', x: '-60%', y: '-60%', width: '220%', height: '220%' },
          cr('feGaussianBlur', { stdDeviation: 2.4, result: 'b' }),
          cr('feMerge', null, cr('feMergeNode', { in: 'b' }), cr('feMergeNode', { in: 'SourceGraphic' })))));

      // Faint ground grid
      const gOp = this.sm(t, 0.2, 2) * 0.10;
      this.grid.forEach((s, i) => {
        const A = this.proj(s[0]), B = this.proj(s[1]);
        push(cr('line', { key: 'gr' + i, x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.cyan, strokeWidth: 1, opacity: gOp }));
      });

      // Dim full x/y axes for context
      push(this.seg([-5, 0, 0], [5, 0, 0], this.sm(t, 0.3, 1.6), C.cyan, 1.4, { op: 0.28 }));
      push(this.seg([0, -5, 0], [0, 5, 0], this.sm(t, 0.3, 1.6), C.cyan, 1.4, { op: 0.20 }));
      push(this.dot(P.O, 3.5, C.cyan, this.sm(t, 0.6, 1.2) * 0.6));

      // 1. Setup — the reference unit
      push(this.seg(P.O, P.Ux, this.sm(t, 1.0, 1.8), C.cyan, 2.6));
      push(this.dot(P.Ux, 3.8, C.cyan, this.sm(t, 1.7, 2.1)));
      push(this.lab(this.lerpP3(P.O, P.Ux, 0.5), '1', C.labelCyan, this.sm(t, 1.9, 2.4), { dy: 28, size: 27 }));

      // 2. Azimuth 35.26° — base O→Foot
      push(this.seg(P.O, P.Foot, this.sm(t, 2.4, 3.6), C.green, 2.8));
      push(this.dot(P.Foot, 4.2, C.green, this.sm(t, 3.5, 3.9)));
      push(this.arc(P.O, P.Ux, P.Foot, 46, this.sm(t, 3.6, 4.5), C.gold, this.sm(t, 3.6, 4.5) * 0.9));
      push(this.lab(this.lerpP3(P.O, P.Foot, 0.24), '35.26°', C.labelGold, this.sm(t, 4.3, 4.8), { dy: -20, dx: 10, size: 22 }));
      push(this.txt(this.proj(P.O)[0] + 70, this.proj(P.O)[1] + 46, '= arctan(1/√2)', C.labelGold, this.fio(t, 4.6, 5.1, 8.5, 9.2), { size: 20, anchor: 'start', face: "'Space Grotesk',sans-serif", w: 400 }));
      push(this.lab(this.lerpP3(P.O, P.Foot, 0.55), '√3', C.green, this.sm(t, 5.0, 5.6), { dx: 18, dy: 16, size: 30 }));
      push(this.txt(960, 914, "Azimuth 35.26° — the cube's face-diagonal ↔ space-diagonal angle", C.white, this.fio(t, 4.4, 5.2, 7.2, 8.0), { size: 32, italic: true }));

      // 3. The Rise — Foot→Apex, magenta while it moves, settles to cyan (length 1)
      const rStart = 6.2, rEnd = 6.9, rp = this.sm(t, rStart, rEnd);
      const tip = this.lerpP3(P.Foot, P.Apex, rp);
      const settle = this.sm(t, rEnd, rEnd + 0.5);
      push(this.seg(P.Foot, P.Apex, rp, C.magenta, 9,   { glow: false, op: 0.20 * (1 - settle) }));
      push(this.seg(P.Foot, P.Apex, rp, C.magenta, 3.2, { glow: false, op: 1 - settle }));
      push(this.seg(P.Foot, P.Apex, rp, C.cyan,    9,   { glow: false, op: 0.20 * settle }));
      push(this.seg(P.Foot, P.Apex, rp, C.cyan,    3.2, { glow: false, op: settle }));
      push(this.dot(tip, 4.2, C.magenta, this.sm(t, rStart, rStart + 0.2) * (1 - settle)));
      push(this.dot(tip, 4.2, C.cyan,    this.sm(t, rStart, rStart + 0.2) * settle));
      push(this.lab(this.lerpP3(P.Foot, P.Apex, 0.5), '1', C.labelCyan, this.sm(t, 7.0, 7.5), { dx: 26, size: 27 }));

      // 4. The Sundial — O→Apex, gold dashed (derived measure), length 2
      push(this.seg(P.O, P.Apex, this.sm(t, 7.6, 8.8), C.gold, 2.8, { dash: '10 9' }));
      push(this.dot(P.Apex, 4.6, C.white, this.sm(t, 8.7, 9.1)));
      push(this.lab(P.Apex, 'T', C.white, this.sm(t, 8.8, 9.2), { dx: 24, dy: -12, size: 30 }));
      push(this.lab(this.lerpP3(P.O, P.Apex, 0.62), '2', C.white, this.sm(t, 9.0, 9.5), { dx: -24, size: 32, w: 600, italic: false }));

      // 5. Tilt 30° — arc between base and sundial
      push(this.arc(P.O, P.Foot, P.Apex, 66, this.sm(t, 8.8, 9.8), C.gold, this.sm(t, 8.8, 9.8) * 0.9));
      push(this.lab(this.lerpP3(P.Foot, P.Apex, 0.22), '30°', C.labelGold, this.sm(t, 9.6, 10.1), { dx: 16, dy: -14, size: 22 }));
      push(this.txt(960, 914, 'Tilt 30° up', C.white, this.fio(t, 9.4, 10.1, 12.0, 12.8), { size: 32, italic: true }));

      // 6. Right angle at Foot
      const rop = this.sm(t, 10.6, 11.4);
      if (rop > 0) {
        const F = this.proj(P.Foot), Ap = this.proj(P.Apex), Op = this.proj(P.O);
        const v1 = [Ap[0] - F[0], Ap[1] - F[1]], v2 = [Op[0] - F[0], Op[1] - F[1]];
        const n1 = Math.hypot(v1[0], v1[1]) || 1, n2 = Math.hypot(v2[0], v2[1]) || 1, rm = 15;
        const ra = [F[0] + v1[0] / n1 * rm, F[1] + v1[1] / n1 * rm];
        const rb = [F[0] + v2[0] / n2 * rm, F[1] + v2[1] / n2 * rm];
        const rc = [ra[0] + v2[0] / n2 * rm, ra[1] + v2[1] / n2 * rm];
        push(cr('path', { key: 'rang', d: `M ${ra[0]} ${ra[1]} L ${rc[0]} ${rc[1]} L ${rb[0]} ${rb[1]}`, fill: 'none', stroke: 'rgba(60,203,142,.7)', strokeWidth: 2, opacity: rop }));
      }

      // 7. The Reveal — math block
      const mOp1 = this.fio(t, 12.0, 12.6, 13.4, 14.0);
      const mOp2 = this.fio(t, 12.4, 13.0, 13.6, 14.1);
      const mOp3 = this.fio(t, 12.8, 13.4, 13.8, 14.2);
      const mOp4 = this.fio(t, 13.2, 13.8, 14.0, 14.4);
      push(this.txt(86, 742, 'azimuth 35.26° = arctan(1/√2)', C.white, mOp1, { size: 32, italic: true, anchor: 'start' }));
      push(this.txt(86, 798, 'tilt 30° = arctan(1/√3)', C.white, mOp2, { size: 32, italic: true, anchor: 'start' }));
      push(this.txt(86, 854, '→ (√2, 1, 1),  |OT| = 2', C.white, mOp3, { size: 32, italic: true, anchor: 'start' }));
      // CANON FIX: the reference labelled this "the Lost Triangle (1 : √3 : 2)".
      // The 1 : √3 : 2 (30-60-90) is the construction / sundial triangle, not the
      // namesake (the Lost Triangle is 1 : √2 : √3). Corrected below.
      push(this.txt(86, 912, 'foot √3, rise 1, hyp 2  ⟹  the construction triangle (1 : √3 : 2, 30-60-90)', C.titleGold, mOp4, { size: 32, italic: true, anchor: 'start', w: 600 }));

      // 8. The Connection
      push(this.txt(960, 900, '(√2, 1, 1) is (1, 1, √2) — the same generator, a different face of the cube.', C.white, this.fio(t, 14.4, 15.4, 20.2, 21), { size: 40, italic: true, glow: true }));
      push(this.txt(960, 950, 'gregg fleishman', 'rgba(138,132,128,.85)', this.fio(t, 15.6, 16.4, 20.2, 21), { size: 26, italic: true }));

      return k;
    }

    render() {
      const t = this.state.t;
      const ci = this.curCI();
      const mm = Math.floor(t / 60), ss = Math.floor(t % 60);
      const playIcon = this.state.playing ? '❚❚' : '►';
      const chapterOp = this.sm(t, 0, 0.7);
      const btn = { width: '36px', height: '36px', border: 'none', borderRadius: '10px', background: 'rgba(240,237,232,.06)', color: '#F0EDE8', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      const btnMid = Object.assign({}, btn, { width: '40px', height: '40px', background: 'rgba(200,169,110,.16)', fontSize: '14px' });
      return cr('div', { ref: this._containerRef, style: { position: 'relative', width: '100%', height: '100vh', background: '#0B0B0B', overflow: 'hidden' } },
        cr('div', { ref: this._stageRef, style: { position: 'absolute', left: '50%', top: '50%', width: '1920px', height: '1080px', transform: 'translate(-50%,-50%)', transformOrigin: 'center center' } },
          cr('div', { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 72% 64% at 50% 44%, #16140F 0%, #0E0E0D 54%, #0B0B0B 100%)' } }),
          cr('div', { style: { position: 'absolute', left: '72px', top: '158px', pointerEvents: 'none' } },
            cr('div', { style: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '52px', letterSpacing: '-0.01em', color: '#D8BE8F', opacity: chapterOp, textShadow: '0 0 40px rgba(200,169,110,.3)' } }, 'VIII · The Cube Angle')),
          cr('svg', { viewBox: '0 0 1920 1080', width: '100%', height: '100%', style: { position: 'absolute', inset: 0, display: 'block' } }, this.buildScene()),
          cr('div', { style: { position: 'absolute', left: '964px', transform: 'translateX(-50%)', top: '990px', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 18px', borderRadius: '14px', background: 'rgba(18,18,18,.66)', backdropFilter: 'blur(10px)', border: '1px solid rgba(240,237,232,.07)', boxShadow: '0 8px 30px rgba(0,0,0,.5)', fontFamily: "'Space Grotesk', sans-serif" } },
            cr('button', { onClick: () => this.prevCh(), style: btn }, '‹'),
            cr('button', { onClick: () => this.toggle(), style: btnMid }, playIcon),
            cr('button', { onClick: () => this.nextCh(), style: btn }, '›'),
            cr('input', { className: 'lt-scrub', type: 'range', min: '0', max: '1000', value: Math.round(t / this.END * 1000), onChange: (e) => this.onSeek(e), style: { width: '300px', WebkitAppearance: 'none', appearance: 'none', height: '4px', borderRadius: '3px', background: 'rgba(240,237,232,.14)', outline: 'none' } }),
            cr('span', { style: { fontSize: '11px', color: '#8A8480', letterSpacing: '.14em', textTransform: 'uppercase', minWidth: '190px', textAlign: 'left', whiteSpace: 'nowrap' } }, this.CHN[ci]),
            cr('span', { style: { fontSize: '11px', color: 'rgba(138,132,128,.5)', letterSpacing: '.10em', minWidth: '64px', textAlign: 'right', whiteSpace: 'nowrap', fontFamily: "'Space Mono', monospace" } }, mm + ':' + String(ss).padStart(2, '0') + ' / 0:' + this.END)
          )
        )
      );
    }
  }

  window.LostTriangleCubeAngle = LostTriangleCubeAngle;
})();
