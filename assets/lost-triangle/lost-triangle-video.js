// GENERATED — do not edit by hand.
// Transpiled (Babel preset-react) from the Claude Design handoff source
// "Motion graphic mathematics explanation" (Lost Triangle.dc.html).
// Source of truth: animations.jsx / LostTriangleVideo.jsx. See README.md.
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// LostTriangleVideo.jsx
// Motion graphic explaining the mathematics of Gregg Fleishman's
// "The Lost Triangle" / Fleishman Sequence poster.
// The Lost Triangle = right triangle with edges 1, √2, √3
//   (since 1² + √2² = √3²), interior angles 90°, 54.7356°, 35.2644°.
// Layout-aware: renders at 1920×1080 (landscape) or 1080×1920 (portrait).
// Mounted by "Lost Triangle.dc.html" / "Lost Triangle Mobile.dc.html".

const R3 = Math.sqrt(3),
  R2 = Math.SQRT2;

// ── palette (blend of the dark reference + the printed poster) ───────────────
const C = {
  bg: '#08080c',
  ink: '#f2f2ee',
  dim: '#6f7079',
  faint: '#34343c',
  blue: '#4f9cf9',
  mag: '#ff3ccf',
  violet: '#a06bff',
  gold: '#f6a82a',
  slate: '#8ba2bd'
};
const SERIF = "'Spectral', Georgia, serif";
const DISP = "'Cormorant', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ── helpers ──────────────────────────────────────────────────────────────────
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
function sub(lt, start, dur, ease) {
  const E = window.Easing && ease ? ease : window.Easing ? window.Easing.easeInOutCubic : t => t;
  return E(cl((lt - start) / dur, 0, 1));
}
const lerp = (a, b, t) => a + (b - a) * t;
const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const ptStr = pts => pts.map(p => p.join(',')).join(' ');
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul2 = (a, s) => [a[0] * s, a[1] * s];
const len2 = a => Math.hypot(a[0], a[1]);
const norm = a => {
  const l = len2(a) || 1;
  return [a[0] / l, a[1] / l];
};
function arcPath(cx, cy, r, a0, a1) {
  const [sx, sy] = polar(cx, cy, r, a0);
  const [ex, ey] = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${sx} ${sy} A${r} ${r} 0 ${large} ${sweep} ${ex} ${ey}`;
}

// ── layout context ───────────────────────────────────────────────────────────
const LayoutContext = React.createContext(null);
const useL = () => React.useContext(LayoutContext);
function makeLayout(orient) {
  if (orient === 'portrait') {
    return {
      orient,
      vw: 1080,
      vh: 1920,
      U: 300,
      AX: 360,
      AY: 1230,
      title: {
        x: 70,
        y: 150,
        size: 46,
        kicker: 16
      },
      r3name: {
        x: 540,
        y: 1430,
        anchor: 'middle'
      },
      cube: {
        ox: 540,
        oy: 1000,
        scale: 470,
        legendX: 540,
        legendY: 1500,
        legendRow: true
      },
      rho: {
        ox: 540,
        oy: 860,
        s: 210,
        dodec: [540, 1040],
        labelX: 540,
        labelY: 1480
      },
      dih: {
        textX: 540,
        textY: 470,
        w1: [540, 800],
        w2: [540, 1380],
        dwArm: 150
      },
      res: {
        tris: [[270, 620], [540, 620], [810, 620]],
        triScale: 130,
        end: [540, 1180]
      },
      dotsBottom: 70
    };
  }
  return {
    orient: 'landscape',
    vw: 1920,
    vh: 1080,
    U: 218,
    AX: 690,
    AY: 812,
    title: {
      x: 150,
      y: 150,
      size: 52,
      kicker: 18
    },
    r3name: {
      x: 1230,
      y: 470,
      anchor: 'start'
    },
    cube: {
      ox: 980,
      oy: 540,
      scale: 430,
      legendX: 1380,
      legendY: 430,
      legendRow: false
    },
    rho: {
      ox: 720,
      oy: 540,
      s: 150,
      dodec: [980, 540],
      labelX: 720,
      labelY: 740
    },
    dih: {
      textX: 960,
      textY: 300,
      w1: [640, 620],
      w2: [1280, 620],
      dwArm: 150
    },
    res: {
      tris: [[560, 470], [960, 470], [1360, 470]],
      triScale: 130,
      end: [960, 760]
    },
    dotsBottom: 34
  };
}
function planar(L) {
  const {
    U,
    AX,
    AY
  } = L;
  const A = [AX, AY],
    B = [AX + U, AY],
    Cc = [AX + U, AY - U],
    D = [AX, AY - U];
  const acDir = norm(sub2(Cc, A));
  const perpOut = [acDir[1], -acDir[0]];
  const F = add2(Cc, mul2(perpOut, U));
  return {
    A,
    B,
    Cc,
    D,
    F
  };
}

// ── primitive SVG components ─────────────────────────────────────────────────
function Stroke({
  d,
  p = 1,
  stroke = C.ink,
  w = 2.4,
  opacity = 1,
  dashArr,
  cap = 'round'
}) {
  const prog = cl(p, 0, 1);
  if (prog <= 0) return null;
  return /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: stroke,
    strokeWidth: w,
    strokeLinecap: cap,
    strokeLinejoin: "round",
    opacity: opacity,
    pathLength: "1",
    strokeDasharray: dashArr || '1 1',
    strokeDashoffset: dashArr ? 0 : 1 - prog
  });
}
const seg = (a, b) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
function Line({
  a,
  b,
  p,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Stroke, _extends({
    d: seg(a, b),
    p: p
  }, rest));
}
function Poly({
  pts,
  fill,
  opacity = 1,
  stroke = 'none',
  w = 0
}) {
  return /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(pts),
    fill: fill,
    fillOpacity: opacity,
    stroke: stroke,
    strokeWidth: w,
    strokeLinejoin: "round"
  });
}
function Dot({
  at,
  r = 5,
  fill = C.ink,
  opacity = 1
}) {
  return /*#__PURE__*/React.createElement("circle", {
    cx: at[0],
    cy: at[1],
    r: r,
    fill: fill,
    opacity: opacity
  });
}
function RightAngle({
  v,
  p,
  q,
  s = 22,
  stroke = C.ink,
  opacity = 1
}) {
  const u1 = norm(sub2(p, v)),
    u2 = norm(sub2(q, v));
  const a = add2(v, mul2(u1, s));
  const c = add2(v, mul2(u2, s));
  const b = add2(a, mul2(u2, s));
  return /*#__PURE__*/React.createElement("path", {
    d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`,
    fill: "none",
    stroke: stroke,
    strokeWidth: 1.6,
    opacity: opacity
  });
}
function AngleMark({
  v,
  p,
  q,
  r = 40,
  color = C.ink,
  label,
  p0 = 1,
  labelOff = 26,
  size = 22
}) {
  let a1 = Math.atan2(p[1] - v[1], p[0] - v[0]);
  let a2 = Math.atan2(q[1] - v[1], q[0] - v[0]);
  let d = a2 - a1;
  while (d <= -Math.PI) d += 2 * Math.PI;
  while (d > Math.PI) d -= 2 * Math.PI;
  const mid = a1 + d / 2;
  const lp = polar(v[0], v[1], r + labelOff, mid);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Stroke, {
    d: arcPath(v[0], v[1], r, a1, a1 + d),
    p: p0,
    stroke: color,
    w: 2
  }), label && p0 > 0.7 && /*#__PURE__*/React.createElement("text", {
    x: lp[0],
    y: lp[1],
    fill: color,
    fontFamily: MONO,
    fontSize: size,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: cl((p0 - 0.7) / 0.3, 0, 1)
  }, label));
}
function Radical({
  x,
  y,
  n,
  color = C.ink,
  size = 40,
  opacity = 1,
  weight = 600,
  italic = true
}) {
  const digitW = size * 0.55;
  return /*#__PURE__*/React.createElement("g", {
    opacity: opacity
  }, /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    fill: color,
    fontFamily: SERIF,
    fontSize: size,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: weight,
    textAnchor: "middle",
    dominantBaseline: "middle",
    style: {
      letterSpacing: '0.01em'
    }
  }, '\u221A' + n), /*#__PURE__*/React.createElement("line", {
    x1: x + size * 0.02,
    y1: y - size * 0.42,
    x2: x + digitW + size * 0.18,
    y2: y - size * 0.42,
    stroke: color,
    strokeWidth: Math.max(1.4, size * 0.045)
  }));
}
function LenLabel({
  a,
  b,
  text,
  color = C.ink,
  off = 26,
  size = 30,
  opacity = 1,
  radical
}) {
  const m = mul2(add2(a, b), 0.5);
  const u = norm(sub2(b, a));
  const perp = [u[1], -u[0]];
  const pos = add2(m, mul2(perp, off));
  if (radical) return /*#__PURE__*/React.createElement(Radical, {
    x: pos[0],
    y: pos[1],
    n: radical,
    color: color,
    size: size,
    opacity: opacity
  });
  return /*#__PURE__*/React.createElement("text", {
    x: pos[0],
    y: pos[1],
    fill: color,
    fontFamily: MONO,
    fontSize: size,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: opacity
  }, text);
}
function SceneTitle({
  lt,
  kicker,
  title
}) {
  const L = useL();
  const inP = cl(lt / 0.6, 0, 1);
  return /*#__PURE__*/React.createElement("g", {
    opacity: inP,
    transform: `translate(${L.title.x}, ${L.title.y})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    y1: -34,
    x2: 42,
    y2: -34,
    stroke: C.violet,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.violet,
    fontFamily: MONO,
    fontSize: L.title.kicker,
    style: {
      letterSpacing: '0.28em'
    }
  }, kicker), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: L.title.size,
    fill: C.ink,
    fontFamily: DISP,
    fontSize: L.title.size,
    fontWeight: 600
  }, title));
}

// ════ SCENE 1 — the unit ════════════════════════════════════════════════════
function SceneUnit({
  lt
}) {
  const L = useL();
  const {
    A,
    B,
    Cc,
    D
  } = planar(L);
  const sq = sub(lt, 0.6, 1.8);
  const lab = sub(lt, 2.4, 0.8);
  const diag = sub(lt, 3.6, 1.4);
  const grid = sub(lt, 2.0, 1.2);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "ROOT TRIANGLE SEQUENCE",
    title: "Begin with the unit"
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, B, Cc, D],
    fill: C.blue,
    opacity: 0.05 * grid
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: B,
    p: sq
  }), /*#__PURE__*/React.createElement(Line, {
    a: B,
    b: Cc,
    p: sq
  }), /*#__PURE__*/React.createElement(Line, {
    a: Cc,
    b: D,
    p: sq
  }), /*#__PURE__*/React.createElement(Line, {
    a: D,
    b: A,
    p: sq
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: A,
    p: B,
    q: D,
    opacity: sq,
    s: 20,
    stroke: C.dim
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: A,
    b: B,
    text: "1",
    color: C.ink,
    off: 34,
    size: 34,
    opacity: lab
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: Cc,
    b: B,
    text: "1",
    color: C.dim,
    off: -34,
    size: 30,
    opacity: lab
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: Cc,
    p: diag,
    stroke: C.slate,
    w: 2,
    dashArr: diag > 0 ? '6 7' : undefined
  }));
}

// ════ SCENE 2 — √2 ═══════════════════════════════════════════════════════════
function SceneRoot2({
  lt
}) {
  const L = useL();
  const {
    A,
    B,
    Cc,
    D
  } = planar(L);
  const {
    AX,
    AY,
    U
  } = L;
  const fill = sub(lt, 0.3, 1.0);
  const diag = sub(lt, 0.4, 1.3);
  const arc = sub(lt, 2.0, 1.6, window.Easing.easeInOutSine);
  const lab = sub(lt, 2.6, 0.8);
  const ang = sub(lt, 3.4, 0.9);
  const r2 = U * R2;
  const baseEnd = [AX + r2, AY];
  const a0 = 0,
    a1 = Math.atan2(Cc[1] - AY, Cc[0] - AX);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "FIRST ROOT",
    title: "The square's diagonal = \u221A2"
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, B, Cc, D],
    fill: C.blue,
    opacity: 0.05
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: B,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: B,
    b: Cc,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: Cc,
    b: D,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: D,
    b: A,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, B, Cc],
    fill: C.blue,
    opacity: 0.32 * fill
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: Cc,
    p: diag,
    stroke: C.blue,
    w: 3.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: B,
    p: fill,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(Line, {
    a: B,
    b: Cc,
    p: fill,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: B,
    p: A,
    q: Cc,
    opacity: fill,
    stroke: C.ink
  }), /*#__PURE__*/React.createElement(Stroke, {
    d: arcPath(AX, AY, r2, a0, a0 + (a1 - a0) * arc),
    p: 1,
    stroke: C.violet,
    w: 2.2,
    dashArr: "0.04 0.03"
  }), arc > 0.05 && /*#__PURE__*/React.createElement(Dot, {
    at: polar(AX, AY, r2, a0 + (a1 - a0) * arc),
    r: 4,
    fill: C.violet
  }), arc > 0.6 && /*#__PURE__*/React.createElement("text", {
    x: baseEnd[0] + 14,
    y: baseEnd[1] + 6,
    fill: C.violet,
    fontFamily: MONO,
    fontSize: 20,
    opacity: cl((arc - 0.6) / 0.4, 0, 1)
  }, "R = 1.4142"), /*#__PURE__*/React.createElement(LenLabel, {
    a: A,
    b: Cc,
    radical: "2",
    color: C.blue,
    off: -30,
    size: 42,
    opacity: lab
  }), /*#__PURE__*/React.createElement(AngleMark, {
    v: A,
    p: B,
    q: Cc,
    r: 46,
    color: C.blue,
    label: "45\xB0",
    p0: ang,
    size: 20
  }));
}

// ════ SCENE 3 — √3 : THE LOST TRIANGLE ═══════════════════════════════════════
function SceneRoot3({
  lt
}) {
  const L = useL();
  const {
    A,
    B,
    Cc,
    D,
    F
  } = planar(L);
  const {
    AX,
    AY,
    U
  } = L;
  const perp = sub(lt, 0.5, 1.1);
  const fill = sub(lt, 1.6, 1.2);
  const hyp = sub(lt, 1.7, 1.3);
  const arc = sub(lt, 3.2, 1.6, window.Easing.easeInOutSine);
  const lab = sub(lt, 3.0, 0.9);
  const angR = sub(lt, 4.4, 0.7);
  const angA = sub(lt, 5.0, 0.7);
  const angF = sub(lt, 5.5, 0.7);
  const name = sub(lt, 6.4, 1.0);
  const edgeLabs = sub(lt, 6.8, 1.0);
  const r3 = U * R3;
  const a0 = 0,
    a1 = Math.atan2(F[1] - AY, F[0] - AX);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "THE LOST TRIANGLE",
    title: "One unit higher = \u221A3"
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, B, Cc, D],
    fill: C.blue,
    opacity: 0.045
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: B,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: B,
    b: Cc,
    p: 1,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: Cc,
    b: D,
    p: 1,
    stroke: C.faint,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: D,
    b: A,
    p: 1,
    stroke: C.faint,
    w: 2
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, B, Cc],
    fill: C.blue,
    opacity: 0.10
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: Cc,
    p: 1,
    stroke: C.blue,
    w: 2.4,
    opacity: 0.8
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [A, Cc, F],
    fill: C.mag,
    opacity: 0.34 * fill
  }), /*#__PURE__*/React.createElement(Line, {
    a: Cc,
    b: F,
    p: perp,
    stroke: C.ink,
    w: 2.8
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: F,
    p: hyp,
    stroke: C.mag,
    w: 3.6
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: Cc,
    p: A,
    q: F,
    opacity: angR,
    stroke: C.ink,
    s: 20
  }), /*#__PURE__*/React.createElement(Stroke, {
    d: arcPath(AX, AY, r3, a0, a0 + (a1 - a0) * arc),
    p: 1,
    stroke: C.violet,
    w: 2.2
  }), arc > 0.05 && /*#__PURE__*/React.createElement(Dot, {
    at: polar(AX, AY, r3, a0 + (a1 - a0) * arc),
    r: 4,
    fill: C.violet
  }), arc > 0.5 && /*#__PURE__*/React.createElement("text", {
    x: AX + r3 + 14,
    y: AY + 6,
    fill: C.violet,
    fontFamily: MONO,
    fontSize: 20,
    opacity: cl((arc - 0.5) / 0.5, 0, 1)
  }, "R = 1.7321"), /*#__PURE__*/React.createElement(LenLabel, {
    a: A,
    b: F,
    radical: "3",
    color: C.mag,
    off: -34,
    size: 46,
    opacity: lab
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: Cc,
    b: F,
    text: "1",
    color: C.ink,
    off: 26,
    size: 30,
    opacity: edgeLabs
  }), /*#__PURE__*/React.createElement(Radical, {
    x: A[0] + 0.5 * U + 58,
    y: A[1] - 0.5 * U - 6,
    n: "2",
    color: C.slate,
    size: 30,
    opacity: edgeLabs
  }), /*#__PURE__*/React.createElement(AngleMark, {
    v: A,
    p: Cc,
    q: F,
    r: 64,
    color: C.mag,
    label: "35.26\xB0",
    p0: angA,
    size: 19,
    labelOff: 26
  }), /*#__PURE__*/React.createElement(AngleMark, {
    v: F,
    p: A,
    q: Cc,
    r: 30,
    color: C.mag,
    label: "54.74\xB0",
    p0: angF,
    size: 19,
    labelOff: 42
  }), name > 0 && /*#__PURE__*/React.createElement("g", {
    opacity: name,
    transform: `translate(${L.r3name.x}, ${L.r3name.y})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.mag,
    fontFamily: DISP,
    fontSize: 58,
    fontWeight: 600,
    textAnchor: L.r3name.anchor
  }, "The Lost Triangle"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 46,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 21,
    textAnchor: L.r3name.anchor,
    style: {
      letterSpacing: '0.22em'
    }
  }, "1   \xB7   \u221A2   \xB7   \u221A3"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 100,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 23,
    textAnchor: L.r3name.anchor,
    opacity: edgeLabs
  }, "a right triangle, since 1\xB2 + \u221A2\xB2 = \u221A3\xB2")));
}

// ════ SCENE 4 — the unit cube ════════════════════════════════════════════════
function project([x, y, z], rotY, scale, ox, oy) {
  x -= 0.5;
  y -= 0.5;
  z -= 0.5;
  const cyA = Math.cos(rotY),
    syA = Math.sin(rotY);
  let X = x * cyA + z * syA,
    Z = -x * syA + z * cyA;
  const tilt = -0.50,
    ct = Math.cos(tilt),
    st = Math.sin(tilt);
  let Y = y * ct - Z * st;
  return [ox + X * scale, oy - Y * scale];
}
const CUBE_V = [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]];
const CUBE_E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
function SceneCube({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    scale,
    legendX,
    legendY,
    legendRow
  } = L.cube;
  const {
    A,
    Cc,
    F
  } = planar(L); // the 2D Lost Triangle (matches end of Scene 3)
  // morph parameter: 0 = flat 2D triangle, 1 = seated inside the projected cube
  const m = sub(lt, 0.5, 2.6, window.Easing.easeInOutCubic);
  const rotY = 0.5 + Math.max(0, lt - 3.2) * 0.16; // hold orientation through the morph, then rotate
  const P = v => project(v, rotY, scale, ox, oy);
  // cube-corner screen targets for the three shared vertices
  const tRight = P([1, 0, 0]); // right-angle corner  (B)
  const tUnit = P([0, 0, 0]); // end of the unit edge (A)
  const tDiag = P([1, 1, 1]); // far corner / space-diagonal end (D)
  // point-to-point: each 2D vertex travels to its cube corner
  const vRight = [lerp(Cc[0], tRight[0], m), lerp(Cc[1], tRight[1], m)];
  const vUnit = [lerp(F[0], tUnit[0], m), lerp(F[1], tUnit[1], m)];
  const vDiag = [lerp(A[0], tDiag[0], m), lerp(A[1], tDiag[1], m)];
  const midU = [lerp(vRight[0], vUnit[0], 0.5), lerp(vRight[1], vUnit[1], 0.5)];
  const mid2 = [lerp(vRight[0], vDiag[0], 0.5), lerp(vRight[1], vDiag[1], 0.5)];
  const mid3 = [lerp(vUnit[0], vDiag[0], 0.5), lerp(vUnit[1], vDiag[1], 0.5)];
  const cubeDraw = sub(lt, 2.4, 1.8); // cube wireframe assembles as the triangle seats
  const fill = sub(lt, 4.2, 1.0);
  const dotsP = sub(lt, 0.0, 0.6);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "THREE DIMENSIONS",
    title: "It lives inside a unit cube"
  }), CUBE_E.map((e, i) => {
    const a = P(CUBE_V[e[0]]),
      b = P(CUBE_V[e[1]]);
    const ep = cl(cubeDraw * CUBE_E.length - i, 0, 1);
    return /*#__PURE__*/React.createElement(Line, {
      key: i,
      a: a,
      b: b,
      p: ep,
      stroke: C.dim,
      w: 1.8,
      opacity: 0.92
    });
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [vRight, vUnit, vDiag],
    fill: C.mag,
    opacity: 0.30
  }), /*#__PURE__*/React.createElement(Line, {
    a: vRight,
    b: vUnit,
    p: 1,
    stroke: C.ink,
    w: 3.4
  }), "   ", /*#__PURE__*/React.createElement(Line, {
    a: vRight,
    b: vDiag,
    p: 1,
    stroke: C.blue,
    w: 3.4
  }), "   ", /*#__PURE__*/React.createElement(Line, {
    a: vUnit,
    b: vDiag,
    p: 1,
    stroke: C.mag,
    w: 4
  }), "     ", /*#__PURE__*/React.createElement(RightAngle, {
    v: vRight,
    p: vUnit,
    q: vDiag,
    opacity: 1,
    stroke: C.ink,
    s: 15
  }), /*#__PURE__*/React.createElement("text", {
    x: midU[0],
    y: midU[1] - 16,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 26,
    textAnchor: "middle",
    dominantBaseline: "middle"
  }, "1"), /*#__PURE__*/React.createElement(Radical, {
    x: mid2[0] + 34,
    y: mid2[1] + 8,
    n: "2",
    color: C.blue,
    size: 30
  }), /*#__PURE__*/React.createElement(Radical, {
    x: mid3[0] - 36,
    y: mid3[1],
    n: "3",
    color: C.mag,
    size: 34
  }), /*#__PURE__*/React.createElement(Dot, {
    at: vRight,
    r: 5,
    fill: C.ink,
    opacity: dotsP
  }), /*#__PURE__*/React.createElement(Dot, {
    at: vUnit,
    r: 5,
    fill: C.ink,
    opacity: dotsP
  }), /*#__PURE__*/React.createElement(Dot, {
    at: vDiag,
    r: 5,
    fill: C.ink,
    opacity: dotsP
  }), fill > 0 && !legendRow && /*#__PURE__*/React.createElement("g", {
    opacity: fill,
    transform: `translate(${legendX}, ${legendY})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    style: {
      letterSpacing: '0.14em'
    }
  }, "EDGE"), /*#__PURE__*/React.createElement("text", {
    x: 215,
    y: 3,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 30,
    textAnchor: "middle"
  }, "1"), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    y1: 22,
    x2: 250,
    y2: 22,
    stroke: C.faint,
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 56,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    style: {
      letterSpacing: '0.14em'
    }
  }, "FACE DIAGONAL"), /*#__PURE__*/React.createElement(Radical, {
    x: 215,
    y: 56,
    n: "2",
    color: C.blue,
    size: 30
  }), /*#__PURE__*/React.createElement("line", {
    x1: 0,
    y1: 78,
    x2: 250,
    y2: 78,
    stroke: C.faint,
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 112,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    style: {
      letterSpacing: '0.14em'
    }
  }, "SPACE DIAGONAL"), /*#__PURE__*/React.createElement(Radical, {
    x: 215,
    y: 112,
    n: "3",
    color: C.mag,
    size: 30
  })), fill > 0 && legendRow && /*#__PURE__*/React.createElement("g", {
    opacity: fill,
    transform: `translate(${legendX}, ${legendY})`
  }, /*#__PURE__*/React.createElement("text", {
    x: -300,
    y: 0,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.1em'
    }
  }, "EDGE"), /*#__PURE__*/React.createElement("text", {
    x: -300,
    y: 40,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 32,
    textAnchor: "middle"
  }, "1"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.1em'
    }
  }, "FACE DIAG."), /*#__PURE__*/React.createElement(Radical, {
    x: 0,
    y: 42,
    n: "2",
    color: C.blue,
    size: 32
  }), /*#__PURE__*/React.createElement("text", {
    x: 300,
    y: 0,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 16,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.1em'
    }
  }, "SPACE DIAG."), /*#__PURE__*/React.createElement(Radical, {
    x: 300,
    y: 42,
    n: "3",
    color: C.mag,
    size: 32
  })));
}

// ════ SCENE 5 — reflect twice → rhombic-dodecahedron facet ═══════════════════
function SceneRhombus({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    s,
    dodec,
    labelX,
    labelY
  } = L.rho;
  const O = [ox, oy],
    Px = [ox + R2 * s, oy],
    Py = [ox, oy - s],
    Py2 = [ox, oy + s],
    Px2 = [ox - R2 * s, oy];
  const base = sub(lt, 0.3, 0.9);
  const refl1 = sub(lt, 1.2, 1.1);
  const refl2 = sub(lt, 2.6, 1.1);
  const dodecP = sub(lt, 4.6, 1.4);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "REFLECT TWICE",
    title: "The Lost Triangle becomes a facet"
  }), dodecP < 0.5 && /*#__PURE__*/React.createElement("g", {
    opacity: 1 - dodecP * 2
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: [O, Px, Py],
    fill: C.mag,
    opacity: 0.34 * base
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Px,
    p: base,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Py,
    p: base,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(Line, {
    a: Px,
    b: Py,
    p: base,
    stroke: C.mag,
    w: 3.2
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: O,
    p: Px,
    q: Py,
    opacity: base,
    stroke: C.ink,
    s: 18
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [O, Px, Py2],
    fill: C.mag,
    opacity: 0.24 * refl1
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Py2,
    p: refl1,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(Line, {
    a: Px,
    b: Py2,
    p: refl1,
    stroke: C.mag,
    w: 3.2
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [O, Px2, Py],
    fill: C.mag,
    opacity: 0.24 * refl2
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [O, Px2, Py2],
    fill: C.mag,
    opacity: 0.18 * refl2
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Px2,
    p: refl2,
    stroke: C.ink,
    w: 2.6
  }), /*#__PURE__*/React.createElement(Line, {
    a: Px2,
    b: Py,
    p: refl2,
    stroke: C.mag,
    w: 3.2
  }), /*#__PURE__*/React.createElement(Line, {
    a: Px2,
    b: Py2,
    p: refl2,
    stroke: C.mag,
    w: 3.2
  }), refl2 > 0.6 && /*#__PURE__*/React.createElement("text", {
    x: ox,
    y: oy + s + 46,
    fill: C.violet,
    fontFamily: MONO,
    fontSize: 20,
    textAnchor: "middle",
    opacity: cl((refl2 - 0.6) / 0.4, 0, 1),
    style: {
      letterSpacing: '0.06em'
    }
  }, "diagonals in ratio 1 : \u221A2")), dodecP > 0 && /*#__PURE__*/React.createElement("g", {
    opacity: cl(dodecP * 2, 0, 1)
  }, /*#__PURE__*/React.createElement(RhombicDodec, {
    p: dodecP,
    cx: dodec[0],
    cy: dodec[1],
    labelX: labelX,
    labelY: labelY
  })));
}
const RD_CUBE = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
const RD_OCTA = [[2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2]];
function rdProject([x, y, z], rotY, scale, ox, oy) {
  const cyA = Math.cos(rotY),
    syA = Math.sin(rotY);
  let X = x * cyA + z * syA,
    Z = -x * syA + z * cyA;
  const tilt = -0.46,
    ct = Math.cos(tilt),
    st = Math.sin(tilt);
  let Y = y * ct - Z * st;
  return [ox + X * scale, oy - Y * scale];
}
function RhombicDodec({
  p,
  cx,
  cy,
  labelX,
  labelY
}) {
  const L = useL();
  const t = window.useTime ? window.useTime() : 0;
  const rotY = 0.6 + t * 0.22;
  const scale = 118;
  const PC = RD_CUBE.map(v => rdProject(v, rotY, scale, cx, cy));
  const PO = RD_OCTA.map(v => rdProject(v, rotY, scale, cx, cy));
  const edges = [];
  RD_OCTA.forEach((o, oi) => {
    RD_CUBE.forEach((c, ci) => {
      const axis = o[0] !== 0 ? 0 : o[1] !== 0 ? 1 : 2;
      if (Math.sign(o[axis]) === Math.sign(c[axis])) edges.push([PO[oi], PC[ci]]);
    });
  });
  const portrait = L.orient === 'portrait';
  return /*#__PURE__*/React.createElement("g", null, edges.map((e, i) => /*#__PURE__*/React.createElement(Line, {
    key: i,
    a: e[0],
    b: e[1],
    p: cl(p * 1.5, 0, 1),
    stroke: C.gold,
    w: 1.8,
    opacity: 0.9
  })), PO.map((v, i) => /*#__PURE__*/React.createElement(Dot, {
    key: 'o' + i,
    at: v,
    r: 4,
    fill: C.gold,
    opacity: p
  })), PC.map((v, i) => /*#__PURE__*/React.createElement(Dot, {
    key: 'c' + i,
    at: v,
    r: 3,
    fill: C.slate,
    opacity: p
  })), p > 0.5 && /*#__PURE__*/React.createElement("g", {
    opacity: cl((p - 0.5) / 0.5, 0, 1),
    transform: `translate(${labelX}, ${labelY})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.gold,
    fontFamily: DISP,
    fontSize: 34,
    fontWeight: 600,
    textAnchor: portrait ? 'middle' : 'start'
  }, "Rhombic Dodecahedron"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 34,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 17,
    textAnchor: portrait ? 'middle' : 'start',
    style: {
      letterSpacing: '0.06em'
    }
  }, "12 facets \xB7 long axis \u2192 octahedron"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 58,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 17,
    textAnchor: portrait ? 'middle' : 'start',
    style: {
      letterSpacing: '0.06em'
    }
  }, "\xB7 short axis \u2192 cube")));
}

// ════ SCENE 6 — dihedral-angle payoff ════════════════════════════════════════
function DihedralWedge({
  cx,
  cy,
  deg,
  p,
  color,
  label,
  arm = 150
}) {
  const half = deg / 2 * Math.PI / 180;
  const top = [cx, cy - 120];
  const left = polar(cx, cy, arm, Math.PI / 2 + half);
  const right = polar(cx, cy, arm, Math.PI / 2 - half);
  const depth = 46;
  return /*#__PURE__*/React.createElement("g", {
    opacity: p
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: [top, [cx, cy], left, [left[0] - depth, left[1] - depth]],
    fill: color,
    opacity: 0.18
  }), /*#__PURE__*/React.createElement(Poly, {
    pts: [top, [cx, cy], right, [right[0] + depth, right[1] - depth]],
    fill: color,
    opacity: 0.28
  }), /*#__PURE__*/React.createElement(Line, {
    a: top,
    b: [cx, cy],
    p: 1,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: [cx, cy],
    b: left,
    p: 1,
    stroke: C.ink,
    w: 2.2
  }), /*#__PURE__*/React.createElement(Line, {
    a: [cx, cy],
    b: right,
    p: 1,
    stroke: C.ink,
    w: 2.2
  }), /*#__PURE__*/React.createElement(Stroke, {
    d: arcPath(cx, cy, 50, Math.PI / 2 - half, Math.PI / 2 + half),
    p: 1,
    stroke: color,
    w: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 84,
    fill: color,
    fontFamily: MONO,
    fontSize: 26,
    textAnchor: "middle"
  }, deg, "\xB0"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 116,
    fill: C.dim,
    fontFamily: MONO,
    fontSize: 17,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.08em'
    }
  }, label));
}
function SceneDihedral({
  lt
}) {
  const L = useL();
  const {
    textX,
    textY,
    w1,
    w2,
    dwArm
  } = L.dih;
  const intro = sub(lt, 0.2, 0.9);
  const a1 = sub(lt, 1.4, 0.8);
  const w1p = sub(lt, 2.2, 0.9);
  const a2 = sub(lt, 3.0, 0.8);
  const w2p = sub(lt, 3.8, 0.9);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "WHY IT MATTERS",
    title: "Its angles are the dihedral angles"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: intro,
    transform: `translate(${textX}, ${textY})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 30,
    textAnchor: "middle"
  }, "The two acute angles, doubled, give the"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 40,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: 30,
    textAnchor: "middle"
  }, "dihedral angles of the cubic polyhedra.")), /*#__PURE__*/React.createElement("g", {
    opacity: a1,
    transform: `translate(${w1[0]}, ${w1[1] - 150})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.mag,
    fontFamily: MONO,
    fontSize: 22,
    textAnchor: "middle"
  }, "54.74\xB0 \xD7 2")), /*#__PURE__*/React.createElement(DihedralWedge, {
    cx: w1[0],
    cy: w1[1],
    deg: 109.47,
    p: w1p,
    color: C.mag,
    label: "OCTAHEDRON",
    arm: dwArm
  }), /*#__PURE__*/React.createElement("g", {
    opacity: a2,
    transform: `translate(${w2[0]}, ${w2[1] - 150})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.gold,
    fontFamily: MONO,
    fontSize: 22,
    textAnchor: "middle"
  }, "35.26\xB0 \xD7 2")), /*#__PURE__*/React.createElement(DihedralWedge, {
    cx: w2[0],
    cy: w2[1],
    deg: 70.53,
    p: w2p,
    color: C.gold,
    label: "TETRAHEDRON",
    arm: dwArm
  }));
}

// ════ SCENE 7 — the sequence resolves + end card ═════════════════════════════
function MiniTri({
  cx,
  cy,
  kind,
  p,
  accent,
  scale = 130
}) {
  let pts, ang;
  if (kind === '45') {
    pts = [[cx - scale * 0.6, cy + scale * 0.5], [cx + scale * 0.6, cy + scale * 0.5], [cx + scale * 0.6, cy - scale * 0.5]];
    ang = '45°';
  } else if (kind === 'lost') {
    pts = [[cx - scale * 0.55, cy + scale * 0.5], [cx + scale * 0.6, cy + scale * 0.5], [cx + scale * 0.6, cy - scale * 0.35]];
    ang = '54.7°';
  } else {
    pts = [[cx - scale * 0.6, cy + scale * 0.5], [cx + scale * 0.6, cy + scale * 0.5], [cx, cy - scale * 0.55]];
    ang = '60°';
  }
  return /*#__PURE__*/React.createElement("g", {
    opacity: p
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: pts,
    fill: accent,
    opacity: 0.30
  }), /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(pts),
    fill: "none",
    stroke: accent,
    strokeWidth: 2.6,
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + scale * 0.5 + 40,
    fill: accent,
    fontFamily: MONO,
    fontSize: 22,
    textAnchor: "middle"
  }, ang));
}
function SceneResolve({
  lt
}) {
  const L = useL();
  const {
    tris,
    triScale,
    end
  } = L.res;
  const t1 = sub(lt, 0.3, 0.7);
  const t2 = sub(lt, 1.0, 0.7);
  const t3 = sub(lt, 1.7, 0.7);
  const arrow = sub(lt, 2.4, 0.8);
  const [c1, c2, c3] = tris;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(SceneTitle, {
    lt: lt,
    kicker: "THE SEQUENCE",
    title: "Fitting between square and triangle"
  }), /*#__PURE__*/React.createElement(MiniTri, {
    cx: c1[0],
    cy: c1[1],
    kind: "45",
    p: t1,
    accent: C.blue,
    scale: triScale
  }), /*#__PURE__*/React.createElement(MiniTri, {
    cx: c2[0],
    cy: c2[1],
    kind: "lost",
    p: t2,
    accent: C.mag,
    scale: triScale
  }), /*#__PURE__*/React.createElement(MiniTri, {
    cx: c3[0],
    cy: c3[1],
    kind: "60",
    p: t3,
    accent: C.gold,
    scale: triScale
  }), /*#__PURE__*/React.createElement(Radical, {
    x: c1[0] + 2,
    y: c1[1] + 16,
    n: "2",
    color: C.blue,
    size: 26,
    opacity: t1
  }), /*#__PURE__*/React.createElement(Radical, {
    x: c2[0] + 26,
    y: c2[1] + 10,
    n: "3",
    color: C.mag,
    size: 26,
    opacity: t2
  }), arrow > 0 && L.orient === 'landscape' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Line, {
    a: [c1[0] + 140, c1[1]],
    b: [c2[0] - 140, c2[1]],
    p: arrow,
    stroke: C.dim,
    w: 2
  }), /*#__PURE__*/React.createElement(Line, {
    a: [c2[0] + 140, c2[1]],
    b: [c3[0] - 140, c3[1]],
    p: arrow,
    stroke: C.dim,
    w: 2
  })));
}

// ── scheduler ────────────────────────────────────────────────────────────────
// ════ SCENE 8 — animated proofs for each of the three triangles ══════════════
const st = (p, s, d) => window.Easing.easeInOutCubic(cl((p - s) / d, 0, 1));
function AreaLabel({
  pts,
  text,
  color,
  opacity,
  size = 26
}) {
  const c = pts.reduce((m, v) => [m[0] + v[0], m[1] + v[1]], [0, 0]);
  const cc = [c[0] / pts.length, c[1] / pts.length];
  return /*#__PURE__*/React.createElement("text", {
    x: cc[0],
    y: cc[1],
    fill: color,
    fontFamily: MONO,
    fontSize: size,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: opacity
  }, text);
}
function PythagProof({
  cx,
  cy,
  a,
  b,
  u,
  accent,
  areaA,
  areaB,
  areaC,
  eq,
  legBRad,
  p
}) {
  const O = [cx - 0.15 * u, cy + 0.5 * u];
  const P = [O[0] + a * u, O[1]];
  const Q = [O[0], O[1] - b * u];
  const sa = [O, P, [P[0], P[1] + a * u], [O[0], O[1] + a * u]];
  const sb = [O, Q, [Q[0] - b * u, Q[1]], [O[0] - b * u, O[1]]];
  const d = sub2(Q, P),
    dl = len2(d),
    dn = norm(d);
  let n = [dn[1], -dn[0]];
  const mid = mul2(add2(P, Q), 0.5),
    toO = sub2(O, mid);
  if (n[0] * toO[0] + n[1] * toO[1] > 0) n = [-n[0], -n[1]];
  const sc = [P, Q, add2(Q, mul2(n, dl)), add2(P, mul2(n, dl))];
  const tri = st(p, 0, 0.16),
    qa = st(p, 0.18, 0.15),
    qb = st(p, 0.34, 0.15),
    qc = st(p, 0.5, 0.18),
    eqP = st(p, 0.74, 0.22);
  const el = cl((tri - 0.6) / 0.4, 0, 1);
  const eqY = O[1] + a * u + 52;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Poly, {
    pts: [O, P, Q],
    fill: accent,
    opacity: 0.32 * tri
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: P,
    p: tri,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Q,
    p: tri,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: P,
    b: Q,
    p: tri,
    stroke: accent,
    w: 3.2
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: O,
    p: P,
    q: Q,
    opacity: tri,
    stroke: C.ink,
    s: 15
  }), el > 0 && /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: P,
    text: "1",
    color: C.dim,
    off: 16,
    size: 18,
    opacity: el
  }), el > 0 && (legBRad ? /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: Q,
    radical: legBRad,
    color: C.dim,
    off: -16,
    size: 22,
    opacity: el
  }) : /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: Q,
    text: "1",
    color: C.dim,
    off: -16,
    size: 18,
    opacity: el
  })), /*#__PURE__*/React.createElement("g", {
    opacity: qa
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: sa,
    fill: C.slate,
    opacity: 0.14
  }), /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(sa),
    fill: "none",
    stroke: C.slate,
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement(AreaLabel, {
    pts: sa,
    text: areaA,
    color: C.slate,
    opacity: cl((qa - 0.5) / 0.5, 0, 1)
  })), /*#__PURE__*/React.createElement("g", {
    opacity: qb
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: sb,
    fill: C.slate,
    opacity: 0.14
  }), /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(sb),
    fill: "none",
    stroke: C.slate,
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement(AreaLabel, {
    pts: sb,
    text: areaB,
    color: C.slate,
    opacity: cl((qb - 0.5) / 0.5, 0, 1)
  })), /*#__PURE__*/React.createElement("g", {
    opacity: qc
  }, /*#__PURE__*/React.createElement(Poly, {
    pts: sc,
    fill: accent,
    opacity: 0.18
  }), /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(sc),
    fill: "none",
    stroke: accent,
    strokeWidth: 1.8
  }), /*#__PURE__*/React.createElement(AreaLabel, {
    pts: sc,
    text: areaC,
    color: accent,
    opacity: cl((qc - 0.5) / 0.5, 0, 1),
    size: 30
  })), eqP > 0 && /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: eqY,
    fill: accent,
    fontFamily: MONO,
    fontSize: 24,
    textAnchor: "middle",
    opacity: eqP
  }, eq));
}
function EquilProof({
  cx,
  cy,
  u,
  accent,
  p
}) {
  const by = cy + R3 * u / 2;
  const BL = [cx - u, by],
    BR = [cx + u, by],
    T = [cx, by - R3 * u],
    M = [cx, by];
  const tri = st(p, 0, 0.2),
    alt = st(p, 0.26, 0.2),
    ang = st(p, 0.48, 0.2),
    eqP = st(p, 0.72, 0.24);
  const el = cl((tri - 0.6) / 0.4, 0, 1),
    al = cl((alt - 0.6) / 0.4, 0, 1);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Poly, {
    pts: [BL, BR, T],
    fill: accent,
    opacity: 0.30 * tri
  }), /*#__PURE__*/React.createElement(Line, {
    a: BL,
    b: BR,
    p: tri,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: BR,
    b: T,
    p: tri,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: T,
    b: BL,
    p: tri,
    stroke: C.ink,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Line, {
    a: T,
    b: M,
    p: alt,
    stroke: accent,
    w: 2.6,
    dashArr: alt > 0 ? '0.05 0.04' : undefined
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: M,
    p: BR,
    q: T,
    opacity: alt,
    stroke: C.ink,
    s: 13
  }), /*#__PURE__*/React.createElement(AngleMark, {
    v: BL,
    p: BR,
    q: T,
    r: 34,
    color: accent,
    label: "60\xB0",
    p0: ang,
    size: 17,
    labelOff: 22
  }), /*#__PURE__*/React.createElement(AngleMark, {
    v: BR,
    p: T,
    q: BL,
    r: 34,
    color: accent,
    label: "60\xB0",
    p0: ang,
    size: 17,
    labelOff: 22
  }), el > 0 && /*#__PURE__*/React.createElement(LenLabel, {
    a: BL,
    b: T,
    text: "2",
    color: C.dim,
    off: -22,
    size: 22,
    opacity: el
  }), el > 0 && /*#__PURE__*/React.createElement(LenLabel, {
    a: BR,
    b: T,
    text: "2",
    color: C.dim,
    off: 22,
    size: 22,
    opacity: el
  }), al > 0 && /*#__PURE__*/React.createElement(LenLabel, {
    a: M,
    b: BR,
    text: "1",
    color: C.dim,
    off: 20,
    size: 18,
    opacity: al
  }), al > 0 && /*#__PURE__*/React.createElement(Radical, {
    x: (T[0] + M[0]) / 2 - 28,
    y: (T[1] + M[1]) / 2,
    n: "3",
    color: accent,
    size: 28,
    opacity: al
  }), eqP > 0 && /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: by + 58,
    fill: accent,
    fontFamily: MONO,
    fontSize: 23,
    textAnchor: "middle",
    opacity: eqP
  }, "2\xB2 \u2212 1\xB2 = 3   \u2192   h = \u221A3"));
}
function SceneProofs({
  lt
}) {
  const L = useL();
  const cx = L.vw / 2,
    cy = L.vh / 2;
  const u = L.orient === 'portrait' ? 150 : 125;
  const slots = [0.4, 5.0, 9.6],
    dur = 4.2;
  const env = s => {
    const a = cl((lt - s) / 0.4, 0, 1);
    const bb = 1 - cl((lt - (s + dur + 0.2)) / 0.4, 0, 1);
    return cl(Math.min(a, bb), 0, 1);
  };
  const titles = ['45° — half a unit square', '√3 — one square plus two', '60° — the equilateral altitude'];
  const idx = lt < slots[1] ? 0 : lt < slots[2] ? 1 : 2;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    opacity: cl(lt / 0.5, 0, 1),
    transform: `translate(${L.title.x}, ${L.title.y})`
  }, /*#__PURE__*/React.createElement("line", {
    x1: 0,
    y1: -34,
    x2: 42,
    y2: -34,
    stroke: C.violet,
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.violet,
    fontFamily: MONO,
    fontSize: L.title.kicker,
    style: {
      letterSpacing: '0.28em'
    }
  }, "A PROOF FOR EACH"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: L.title.size,
    fill: C.ink,
    fontFamily: DISP,
    fontSize: L.title.size,
    fontWeight: 600
  }, titles[idx])), /*#__PURE__*/React.createElement("g", {
    opacity: env(slots[0])
  }, /*#__PURE__*/React.createElement(PythagProof, {
    cx: cx,
    cy: cy,
    a: 1,
    b: 1,
    u: u,
    accent: C.blue,
    areaA: "1",
    areaB: "1",
    areaC: "2",
    eq: "1 + 1 = 2   \u2192   \u221A2",
    p: cl((lt - slots[0]) / dur, 0, 1)
  })), /*#__PURE__*/React.createElement("g", {
    opacity: env(slots[1])
  }, /*#__PURE__*/React.createElement(PythagProof, {
    cx: cx,
    cy: cy,
    a: 1,
    b: R2,
    u: u,
    accent: C.mag,
    areaA: "1",
    areaB: "2",
    areaC: "3",
    legBRad: "2",
    eq: "1 + 2 = 3   \u2192   \u221A3",
    p: cl((lt - slots[1]) / dur, 0, 1)
  })), /*#__PURE__*/React.createElement("g", {
    opacity: env(slots[2])
  }, /*#__PURE__*/React.createElement(EquilProof, {
    cx: cx,
    cy: cy,
    u: u,
    accent: C.gold,
    p: cl((lt - slots[2]) / dur, 0, 1)
  })));
}
function SceneEnd({
  lt
}) {
  const L = useL();
  const cx = L.vw / 2,
    cy = L.vh / 2;
  const u = 120;
  const tri = sub(lt, 0.2, 1.0);
  const txt = sub(lt, 0.8, 1.0);
  const O = [cx - 0.7 * u, cy - 0.35 * u],
    P = [O[0] + R2 * u, O[1]],
    Q = [O[0], O[1] - u];
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Poly, {
    pts: [O, P, Q],
    fill: C.mag,
    opacity: 0.26 * tri
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: P,
    p: tri,
    stroke: C.ink,
    w: 2.2
  }), /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: Q,
    p: tri,
    stroke: C.ink,
    w: 2.2
  }), /*#__PURE__*/React.createElement(Line, {
    a: P,
    b: Q,
    p: tri,
    stroke: C.mag,
    w: 3
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: O,
    p: P,
    q: Q,
    opacity: tri,
    stroke: C.ink,
    s: 16
  }), /*#__PURE__*/React.createElement("g", {
    opacity: txt,
    transform: `translate(${cx}, ${cy + 1.5 * u})`
  }, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 0,
    fill: C.mag,
    fontFamily: DISP,
    fontSize: 64,
    fontWeight: 600,
    textAnchor: "middle"
  }, "The Lost Triangle"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 46,
    fill: C.ink,
    fontFamily: MONO,
    fontSize: 24,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.34em'
    }
  }, "1   \xB7   \u221A2   \xB7   \u221A3"), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: 88,
    fill: C.dim,
    fontFamily: SERIF,
    fontSize: 20,
    textAnchor: "middle",
    style: {
      letterSpacing: '0.16em'
    }
  }, "THE FLEISHMAN SEQUENCE")));
}
const SCENES = [{
  c: SceneUnit,
  start: 0.0,
  end: 6.0
}, {
  c: SceneRoot2,
  start: 6.0,
  end: 13.5
}, {
  c: SceneRoot3,
  start: 13.5,
  end: 24.5
}, {
  c: SceneCube,
  start: 24.5,
  end: 34.0
}, {
  c: SceneRhombus,
  start: 34.0,
  end: 42.5
}, {
  c: SceneDihedral,
  start: 42.5,
  end: 48.0
}, {
  c: SceneResolve,
  start: 48.0,
  end: 54.0
}, {
  c: SceneProofs,
  start: 54.0,
  end: 68.5
}, {
  c: SceneEnd,
  start: 68.5,
  end: 73.5
}];
const DURATION = 73.5;
function SceneLayer() {
  const L = useL();
  const {
    Sprite
  } = window;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${L.vw} ${L.vh}`,
    width: L.vw,
    height: L.vh,
    style: {
      position: 'absolute',
      inset: 0
    }
  }, SCENES.map((s, i) => /*#__PURE__*/React.createElement(Sprite, {
    key: i,
    start: s.start,
    end: s.end
  }, ({
    localTime
  }) => /*#__PURE__*/React.createElement(s.c, {
    lt: localTime
  }))));
}
// ── Chapter rail ──────────────────────────────────────────────────────────────
// The "marriage" of the two design languages: the site's mono-uppercase,
// gold-underline navigation idiom, carrying the motion graphic's own palette and
// living inside its coordinate space. Each chapter seeks the single timeline —
// so CUBE (the old 3D-construction tab) and SEQUENCE (the old Fleishman-sequence
// tab) return as accurate chapters of one continuous animation.
const CHAPTERS = [{
  i: 0,
  label: '1',
  color: C.ink
}, {
  i: 1,
  label: '√2',
  color: C.blue
}, {
  i: 2,
  label: '√3',
  color: C.mag
}, {
  i: 3,
  label: 'CUBE',
  color: C.slate
}, {
  i: 4,
  label: 'RHOMBIC',
  color: C.gold
}, {
  i: 5,
  label: 'DIHEDRAL',
  color: C.violet
}, {
  i: 6,
  label: 'SEQUENCE',
  color: C.blue
}, {
  i: 7,
  label: 'PROOFS',
  color: C.slate
}];
function ChapterRail() {
  const L = useL();
  const tl = window.useTimeline ? window.useTimeline() : {
    time: 0
  };
  const t = tl.time || 0;
  const sceneIdx = SCENES.findIndex(s => t >= s.start && t < s.end);
  const portrait = L.orient === 'portrait';
  const seek = i => {
    if (tl.setTime) tl.setTime(SCENES[i].start + 0.01);
    if (tl.setPlaying) tl.setPlaying(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: L.dotsBottom,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: portrait ? '12px 16px' : '10px 26px',
      padding: '0 28px',
      fontFamily: MONO
    }
  }, CHAPTERS.map(ch => {
    const active = sceneIdx === ch.i || ch.i === 7 && sceneIdx === 8;
    const seen = sceneIdx >= ch.i;
    return /*#__PURE__*/React.createElement("div", {
      key: ch.i,
      onClick: () => seek(ch.i),
      role: "button",
      tabIndex: 0,
      "aria-label": 'Jump to ' + ch.label,
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          seek(ch.i);
        }
      },
      style: {
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        paddingBottom: 8,
        opacity: active ? 1 : seen ? 0.6 : 0.34,
        transition: 'opacity 220ms'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 4,
        background: active ? ch.color : 'rgba(255,255,255,0.30)',
        boxShadow: active ? '0 0 10px ' + ch.color : 'none',
        transition: 'all 220ms'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: portrait ? 13 : 15,
        letterSpacing: '0.18em',
        color: active ? C.ink : C.dim,
        whiteSpace: 'nowrap',
        transition: 'color 220ms'
      }
    }, ch.label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        borderRadius: 2,
        background: active ? ch.color : 'transparent',
        transition: 'background 220ms'
      }
    }));
  }));
}
// Pick a layout from the viewport: portrait (1080\u00d71920) when the frame is
// taller than it is wide \u2014 e.g. a phone \u2014 else landscape (1920\u00d71080). Keeps the
// motion graphic from rendering tiny on mobile.
function pickOrient() {
  if (typeof window === 'undefined') return 'landscape';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}
function VideoBody({
  orient: forcedOrient
}) {
  const [ready, setReady] = React.useState(!!(window.Stage && window.Sprite));
  const [autoOrient, setAutoOrient] = React.useState(() => forcedOrient || pickOrient());
  React.useEffect(() => {
    if (ready) return;
    const id = setInterval(() => {
      if (window.Stage && window.Sprite) {
        setReady(true);
        clearInterval(id);
      }
    }, 30);
    return () => clearInterval(id);
  }, [ready]);
  React.useEffect(() => {
    if (forcedOrient) return; // caller pinned the orientation
    const onResize = () => setAutoOrient(pickOrient());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [forcedOrient]);
  if (!ready) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.dim,
        fontFamily: MONO
      }
    }, "loading\u2026");
  }
  const orient = forcedOrient || autoOrient;
  const L = makeLayout(orient);
  const {
    Stage
  } = window;
  return /*#__PURE__*/React.createElement(LayoutContext.Provider, {
    value: L
  }, /*#__PURE__*/React.createElement(Stage, {
    key: orient,
    width: L.vw,
    height: L.vh,
    duration: DURATION,
    background: C.bg,
    loop: false,
    autoplay: true,
    controls: false,
    persistKey: 'losttri_' + orient
  }, /*#__PURE__*/React.createElement(SceneLayer, null), /*#__PURE__*/React.createElement(ChapterRail, null)));
}
function LostTriangleVideo() {
  return /*#__PURE__*/React.createElement(VideoBody, null);
}
function LostTriangleVideoPortrait() {
  return /*#__PURE__*/React.createElement(VideoBody, {
    orient: "portrait"
  });
}
window.LostTriangleVideo = LostTriangleVideo;
window.LostTriangleVideoPortrait = LostTriangleVideoPortrait;
if (typeof module !== 'undefined') module.exports = {
  LostTriangleVideo,
  LostTriangleVideoPortrait
};