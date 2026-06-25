// GENERATED — do not edit by hand.
// Transpiled (Babel preset-react, classic runtime) from the JSX source.
// Source of truth: animations.jsx / LostTriangleVideo.jsx. See README.md.
// LostTriangleVideo.jsx
// Motion graphic: the Sundial construction that reveals the Lost Triangle.
// Faithful to the reference video: fixed camera, small construction, cumulative
// build-up, simple italic serif titles, formula at bottom.
// Layout-aware: 1920×1080 (landscape) or 1080×1920 (portrait).

const R3 = Math.sqrt(3),
  R2 = Math.SQRT2;

// ── palette ───────────────────────────────────────────────────────────────────
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
// Three-rod accent system matching the reference video
const BLUE = '#29b6f6'; // ground plane, axes, diagonal
const RED = '#ef5350'; // vertical rise
const GOLD = '#f5a623'; // sundial hypotenuse, lost triangle
const SERIF = "'Spectral', Georgia, serif";
const DISP = "'Cormorant', Georgia, serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ── helpers ───────────────────────────────────────────────────────────────────
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
function sub(lt, start, dur) {
  const E = window.Easing ? window.Easing.easeInOutCubic : t => t;
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

// ── layout context ────────────────────────────────────────────────────────────
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

// ── SVG primitives ────────────────────────────────────────────────────────────
function Stroke({
  d,
  p = 1,
  stroke = C.ink,
  w = 2,
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
  p = 1,
  stroke = C.ink,
  w = 2,
  opacity = 1,
  dash
}) {
  return /*#__PURE__*/React.createElement(Stroke, {
    d: seg(a, b),
    p: p,
    stroke: stroke,
    w: w,
    opacity: opacity,
    dashArr: dash ? '0.08 0.04' : undefined
  });
}
function Poly({
  pts,
  fill,
  opacity = 1
}) {
  return /*#__PURE__*/React.createElement("polygon", {
    points: ptStr(pts),
    fill: fill,
    fillOpacity: opacity,
    stroke: "none"
  });
}
function Dot({
  at,
  r = 4,
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
  s = 16,
  stroke = C.dim,
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
    strokeWidth: 1.4,
    opacity: opacity
  });
}
function AngleMark({
  v,
  p,
  q,
  r = 32,
  color = C.dim,
  label,
  p0 = 1,
  labelOff = 22,
  size = 16
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
    w: 1.6
  }), label && p0 > 0.6 && /*#__PURE__*/React.createElement("text", {
    x: lp[0],
    y: lp[1],
    fill: color,
    fontFamily: MONO,
    fontSize: size,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: cl((p0 - 0.6) / 0.4, 0, 1)
  }, label));
}
function LenLabel({
  a,
  b,
  text,
  color = C.ink,
  off = 20,
  size = 18,
  opacity = 1,
  radical
}) {
  const m = mul2(add2(a, b), 0.5);
  const u = norm(sub2(b, a));
  const perp = [u[1], -u[0]];
  const pos = add2(m, mul2(perp, off));
  const label = radical ? '√' + radical : text;
  return /*#__PURE__*/React.createElement("text", {
    x: pos[0],
    y: pos[1],
    fill: color,
    fontFamily: SERIF,
    fontSize: size,
    fontStyle: "italic",
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: opacity
  }, label);
}

// ── 3D projector (fixed tilt −0.50 rad, Y = up, ground in XZ plane) ──────────
// Geometry: O(0,0,0) A(1,0,0) B(0,0,1) F(1,0,1) T(1,√2,1) P2(−1,√2,1)
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

// Fixed camera — same angle every chapter, no orbit.
const ROT_Y = 0.25;
function cam(L) {
  return L.orient === 'portrait' ? {
    ox: 540,
    oy: 1000,
    sc: 140
  } : {
    ox: 820,
    oy: 510,
    sc: 160
  };
}

// Ground grid: large enough to fill the frame edge-to-edge.
// Very faint teal lines to evoke the reference's "infinite plane" look.
function GroundGrid({
  ox,
  oy,
  sc,
  opacity = 1
}) {
  const P = (x, z) => project([x, 0, z], ROT_Y, sc, ox, oy);
  const lines = [];
  for (let i = -3; i <= 5; i++) {
    const a = P(i, -3),
      b = P(i, 5);
    const c = P(-3, i),
      d = P(5, i);
    lines.push(/*#__PURE__*/React.createElement("line", {
      key: 'x' + i,
      x1: a[0],
      y1: a[1],
      x2: b[0],
      y2: b[1],
      stroke: BLUE,
      strokeWidth: 0.7,
      opacity: 0.12
    }), /*#__PURE__*/React.createElement("line", {
      key: 'z' + i,
      x1: c[0],
      y1: c[1],
      x2: d[0],
      y2: d[1],
      stroke: BLUE,
      strokeWidth: 0.7,
      opacity: 0.12
    }));
  }
  // Coordinate axes — slightly brighter
  const ax0 = P(-3, 0),
    ax1 = P(5, 0);
  const az0 = P(0, -3),
    az1 = P(0, 5);
  lines.push(/*#__PURE__*/React.createElement("line", {
    key: "axX",
    x1: ax0[0],
    y1: ax0[1],
    x2: ax1[0],
    y2: ax1[1],
    stroke: BLUE,
    strokeWidth: 1.2,
    opacity: 0.30
  }), /*#__PURE__*/React.createElement("line", {
    key: "axZ",
    x1: az0[0],
    y1: az0[1],
    x2: az1[0],
    y2: az1[1],
    stroke: BLUE,
    strokeWidth: 1.2,
    opacity: 0.30
  }));
  return /*#__PURE__*/React.createElement("g", {
    opacity: opacity
  }, lines);
}

// Simple chapter title: "N. The Name" italic serif, small, top-left, accent color
function ChTitle({
  n,
  title,
  color,
  lt
}) {
  const L = useL();
  const isP = L.orient === 'portrait';
  const x = isP ? 55 : 48;
  const y = isP ? 90 : 60;
  const fs = isP ? 38 : 32;
  const op = cl(lt / 0.5, 0, 1);
  return /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    fill: color,
    fontFamily: SERIF,
    fontSize: fs,
    fontStyle: "italic",
    fontWeight: 500,
    opacity: op
  }, n + '. ' + title);
}

// Bottom-center text block (formula / explanation)
function BottomText({
  lines,
  lt,
  startAt = 0
}) {
  const L = useL();
  const isP = L.orient === 'portrait';
  const cx = L.vw / 2;
  const baseY = isP ? L.vh - 200 : L.vh - 130;
  const fs = isP ? 30 : 26;
  return /*#__PURE__*/React.createElement("g", null, lines.map((line, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: cx,
    y: baseY + i * (fs + 10),
    fill: line.color || C.ink,
    fontFamily: line.mono ? MONO : SERIF,
    fontSize: line.size || fs,
    fontStyle: line.italic ? 'italic' : 'normal',
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: cl((lt - startAt - i * 0.7) / 0.8, 0, 1)
  }, line.text)));
}

// ══ CONSTRUCTION LAYERS ══════════════════════════════════════════════════════
// Each chapter renders ALL prior elements (full opacity) + its own (animating in).
// This matches the reference video's cumulative build.

// Ch I elements: the ground square O-A-F-B
function LayerPlane({
  ox,
  oy,
  sc,
  p = 1,
  dim = false
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    A = P(1, 0, 0),
    B = P(0, 0, 1),
    F = P(1, 0, 1);
  const op = dim ? 0.35 : 1;
  return /*#__PURE__*/React.createElement("g", {
    opacity: op
  }, /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: A,
    p: p,
    stroke: BLUE,
    w: 1.8
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: F,
    p: p,
    stroke: BLUE,
    w: 1.8
  }), /*#__PURE__*/React.createElement(Line, {
    a: F,
    b: B,
    p: p,
    stroke: BLUE,
    w: 1.8
  }), /*#__PURE__*/React.createElement(Line, {
    a: B,
    b: O,
    p: p,
    stroke: BLUE,
    w: 1.8
  }));
}

// Ch II elements: diagonal O-F (dashed blue) + √2 label
function LayerDiagonal({
  ox,
  oy,
  sc,
  p = 1,
  dim = false
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    F = P(1, 0, 1);
  const op = dim ? 0.35 : 1;
  return /*#__PURE__*/React.createElement("g", {
    opacity: op
  }, /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: F,
    p: p,
    stroke: BLUE,
    w: 2,
    dash: true
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: F,
    radical: "2",
    color: BLUE,
    off: -22,
    size: 17,
    opacity: cl(p * 2 - 1, 0, 1)
  }));
}

// Unit length labels on the ground (shown from Ch II onward)
function LayerGroundLabels({
  ox,
  oy,
  sc,
  p = 1
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    A = P(1, 0, 0),
    B = P(0, 0, 1);
  const op = cl(p, 0, 1);
  return /*#__PURE__*/React.createElement("g", {
    opacity: op
  }, /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: A,
    text: "1",
    color: C.ink,
    off: 16,
    size: 16,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: B,
    text: "1",
    color: C.ink,
    off: -16,
    size: 16,
    opacity: 1
  }), /*#__PURE__*/React.createElement(Dot, {
    at: O,
    r: 4,
    fill: BLUE
  }), /*#__PURE__*/React.createElement(Dot, {
    at: P(1, 0, 0),
    r: 3,
    fill: BLUE,
    opacity: 0.7
  }), /*#__PURE__*/React.createElement(Dot, {
    at: P(1, 0, 1),
    r: 3,
    fill: BLUE,
    opacity: 0.7
  }), /*#__PURE__*/React.createElement(Dot, {
    at: P(0, 0, 1),
    r: 3,
    fill: BLUE,
    opacity: 0.7
  }));
}

// Ch III elements: vertical post F-T (red) + √2 label
function LayerRise({
  ox,
  oy,
  sc,
  p = 1,
  dim = false
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const F = P(1, 0, 1),
    T = P(1, R2, 1);
  const op = dim ? 0.5 : 1;
  return /*#__PURE__*/React.createElement("g", {
    opacity: op
  }, /*#__PURE__*/React.createElement(Line, {
    a: F,
    b: T,
    p: p,
    stroke: RED,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Dot, {
    at: T,
    r: 4,
    fill: GOLD,
    opacity: cl(p * 2 - 1, 0, 1)
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: F,
    b: T,
    radical: "2",
    color: RED,
    off: 20,
    size: 17,
    opacity: cl(p * 2 - 1, 0, 1)
  }), /*#__PURE__*/React.createElement("text", {
    x: T[0] + 12,
    y: T[1] - 4,
    fill: GOLD,
    fontFamily: SERIF,
    fontSize: 16,
    fontStyle: "italic",
    opacity: cl(p * 2 - 1, 0, 1)
  }, "T"));
}

// Ch IV elements: sundial line O-T (gold) + "2" label
function LayerSundial({
  ox,
  oy,
  sc,
  p = 1,
  dim = false
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    T = P(1, R2, 1);
  const op = dim ? 0.5 : 1;
  return /*#__PURE__*/React.createElement("g", {
    opacity: op
  }, /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: T,
    p: p,
    stroke: GOLD,
    w: 2.4
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: T,
    text: "2",
    color: GOLD,
    off: -22,
    size: 18,
    opacity: cl(p * 2 - 1, 0, 1)
  }));
}

// Ch V elements: Lost Triangle O-A-T highlighted
// OA=1 (blue), AT=√3 (magenta), OT=2 is already the sundial (gold).
function LayerTriangle({
  ox,
  oy,
  sc,
  p = 1
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    A = P(1, 0, 0),
    T = P(1, R2, 1);
  const fill_op = cl((p - 0.3) / 0.7, 0, 1) * 0.12;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Poly, {
    pts: [O, A, T],
    fill: GOLD,
    opacity: fill_op
  }), /*#__PURE__*/React.createElement(Line, {
    a: A,
    b: T,
    p: p,
    stroke: C.mag,
    w: 2.4
  }), /*#__PURE__*/React.createElement(RightAngle, {
    v: A,
    p: O,
    q: T,
    s: 14,
    stroke: C.dim,
    opacity: cl(p * 2 - 1, 0, 1)
  }), /*#__PURE__*/React.createElement(LenLabel, {
    a: A,
    b: T,
    radical: "3",
    color: C.mag,
    off: 22,
    size: 17,
    opacity: cl(p * 2 - 1, 0, 1)
  }));
}

// Ch VI elements: mirror point P2 and line O-P2
function LayerMirror({
  ox,
  oy,
  sc,
  p = 1
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    P2 = P(-1, R2, 1);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Line, {
    a: O,
    b: P2,
    p: p,
    stroke: C.mag,
    w: 2.4
  }), /*#__PURE__*/React.createElement(Dot, {
    at: P2,
    r: 4,
    fill: C.mag,
    opacity: cl(p * 2 - 1, 0, 1)
  }), /*#__PURE__*/React.createElement("text", {
    x: P2[0],
    y: P2[1] - 12,
    fill: C.mag,
    fontFamily: SERIF,
    fontSize: 16,
    fontStyle: "italic",
    textAnchor: "middle",
    opacity: cl(p * 2 - 1, 0, 1)
  }, "P₂"), /*#__PURE__*/React.createElement(LenLabel, {
    a: O,
    b: P2,
    text: "2",
    color: C.mag,
    off: 22,
    size: 18,
    opacity: cl(p * 2 - 1, 0, 1)
  }));
}

// Ch VII: 120° angle arc between OP1 and OP2
function LayerAngle120({
  ox,
  oy,
  sc,
  p = 1
}) {
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const O = P(0, 0, 0),
    T = P(1, R2, 1),
    P2 = P(-1, R2, 1);
  return /*#__PURE__*/React.createElement(AngleMark, {
    v: O,
    p: T,
    q: P2,
    r: 28,
    color: RED,
    label: "120°",
    p0: p,
    labelOff: 20,
    size: 15
  });
}

// ════ SCENE 0 — TITLE CARD ═══════════════════════════════════════════════════
function SceneTitle0({
  lt
}) {
  const L = useL();
  const inP = cl(lt / 1.2, 0, 1);
  const cx = L.vw / 2,
    cy = L.vh / 2;
  const isP = L.orient === 'portrait';
  return /*#__PURE__*/React.createElement("g", {
    opacity: inP
  }, /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy - 30,
    fill: BLUE,
    fontFamily: SERIF,
    fontSize: isP ? 46 : 40,
    fontStyle: "italic",
    fontWeight: 500,
    textAnchor: "middle"
  }, "A New Geometric Expression"), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 20,
    fill: C.dim,
    fontFamily: SERIF,
    fontSize: isP ? 28 : 24,
    fontStyle: "italic",
    textAnchor: "middle"
  }, "by Gregg Fleishman"));
}

// ════ CHAPTER I — THE PLANE ══════════════════════════════════════════════════
function ScenePlane({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const gridIn = sub(lt, 0.4, 2.0);
  const sqIn = sub(lt, 2.2, 2.6);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "I",
    title: "The Plane",
    color: BLUE,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: gridIn
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: sqIn
  }));
}

// ════ CHAPTER II — THE 45° DIAGONAL ══════════════════════════════════════════
function SceneDiagonal({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const diagIn = sub(lt, 0.8, 2.4);
  const labsIn = sub(lt, 3.0, 1.4);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "II",
    title: "The 45° Diagonal",
    color: BLUE,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: diagIn
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: labsIn
  }));
}

// ════ CHAPTER III — THE RISE ══════════════════════════════════════════════════
function SceneRise({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const riseIn = sub(lt, 0.6, 2.4);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "III",
    title: "The Rise",
    color: RED,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: riseIn
  }));
}

// ════ CHAPTER IV — THE SUNDIAL LINE ══════════════════════════════════════════
function SceneSundial({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const sunIn = sub(lt, 0.6, 2.6);
  const fmlIn = sub(lt, 3.8, 1.2);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "IV",
    title: "The Sundial Line",
    color: GOLD,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: sunIn
  }), /*#__PURE__*/React.createElement(BottomText, {
    lt: lt,
    startAt: 3.8,
    lines: [{
      text: '√((√2)² + (√2)²)  =  √4  =  2',
      color: GOLD,
      italic: true,
      size: 28
    }]
  }));
}

// ════ CHAPTER V — THE LOST TRIANGLE ══════════════════════════════════════════
function SceneLostTriangle({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const triIn = sub(lt, 0.6, 3.0);
  const captIn = sub(lt, 4.0, 1.4);
  const isP = L.orient === 'portrait';
  const cx = L.vw / 2;
  const captY = isP ? L.vh - 180 : L.vh - 120;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "V",
    title: "The Lost Triangle",
    color: GOLD,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: triIn
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: captY,
    fill: GOLD,
    fontFamily: SERIF,
    fontSize: isP ? 30 : 26,
    fontStyle: "italic",
    textAnchor: "middle",
    opacity: captIn
  }, "The Lost Triangle : sides  1,  √3,  2"));
}

// ════ CHAPTER VI — THE MIRROR SUNDIAL ════════════════════════════════════════
function SceneMirror({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const mirIn = sub(lt, 0.6, 3.0);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "VI",
    title: "The Mirror Sundial",
    color: BLUE,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: mirIn
  }));
}

// ════ CHAPTER VII — THE 120° REVELATION ══════════════════════════════════════
function SceneRevelation({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const arcIn = sub(lt, 0.6, 2.0);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "VII",
    title: "The 120° Revelation",
    color: RED,
    lt: lt
  }), /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerGroundLabels, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerAngle120, {
    ox: ox,
    oy: oy,
    sc: sc,
    p: arcIn
  }), /*#__PURE__*/React.createElement(BottomText, {
    lt: lt,
    startAt: 3.0,
    lines: [{
      text: '120°  =  Interior angle of a hexagon',
      color: GOLD,
      italic: true,
      size: 26
    }, {
      text: 'Building block of the truncated octahedron',
      color: C.ink,
      italic: false,
      size: 22
    }, {
      text: 'This is what the Lost Triangle does.',
      color: BLUE,
      italic: true,
      size: 22
    }]
  }));
}

// ════ PROOF TRANSITION ═══════════════════════════════════════════════════════
// Full construction in background (dimmed). Two vector labels appear on the
// hypotenuse endpoints T and P₂, then magnitude proofs build at the bottom.
function SceneProofVectors({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const P = (x, y, z) => project([x, y, z], ROT_Y, sc, ox, oy);
  const T3 = P(1, R2, 1),
    P23 = P(-1, R2, 1);
  const isP = L.orient === 'portrait';
  const fs = isP ? 20 : 17;
  const vecIn = cl(lt / 0.8, 0, 1);
  const lbl1 = cl((lt - 0.6) / 0.6, 0, 1);
  const lbl2 = cl((lt - 1.2) / 0.6, 0, 1);
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "∴",
    title: "The Dihedral Proof",
    color: C.violet,
    lt: lt
  }), /*#__PURE__*/React.createElement("g", {
    opacity: 0.35
  }, /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerAngle120, {
    ox: ox,
    oy: oy,
    sc: sc
  })), /*#__PURE__*/React.createElement("g", {
    opacity: vecIn
  }, /*#__PURE__*/React.createElement("text", {
    x: T3[0] + 14,
    y: T3[1] - 14,
    fill: GOLD,
    fontFamily: MONO,
    fontSize: fs,
    opacity: lbl1
  }, "OP₁ = (1, √2, 1)"), /*#__PURE__*/React.createElement("text", {
    x: P23[0] - 14,
    y: P23[1] - 14,
    fill: C.mag,
    fontFamily: MONO,
    fontSize: fs,
    textAnchor: "end",
    opacity: lbl2
  }, "OP₂ = (−1, √2, 1)"), /*#__PURE__*/React.createElement(Dot, {
    at: T3,
    r: 5,
    fill: GOLD,
    opacity: lbl1
  }), /*#__PURE__*/React.createElement(Dot, {
    at: P23,
    r: 5,
    fill: C.mag,
    opacity: lbl2
  })), /*#__PURE__*/React.createElement(BottomText, {
    lt: lt,
    startAt: 2.2,
    lines: [{
      text: '|OP₁|  =  √(1² + (√2)² + 1²)  =  √4  =  2',
      color: GOLD,
      mono: true,
      size: isP ? 22 : 20
    }, {
      text: '|OP₂|  =  √(1² + (√2)² + 1²)  =  √4  =  2',
      color: C.mag,
      mono: true,
      size: isP ? 22 : 20
    }]
  }));
}

// ════ PROOF 2 — DOT PRODUCT ══════════════════════════════════════════════════
function SceneProofDotProduct({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const isP = L.orient === 'portrait';
  const cx = L.vw / 2;
  const fs = isP ? 22 : 20;
  const baseY = isP ? L.vh - 310 : L.vh - 195;
  const rows = [{
    text: 'OP₁ · OP₂',
    color: C.ink,
    t0: 0.5
  }, {
    text: '= (1)(−1)  +  (√2)(√2)  +  (1)(1)',
    color: C.dim,
    t0: 1.6
  }, {
    text: '=  −1  +  2  +  1',
    color: C.dim,
    t0: 2.7
  }, {
    text: '= 2',
    color: GOLD,
    t0: 3.6
  }];
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "∴",
    title: "The Dihedral Proof",
    color: C.violet,
    lt: lt
  }), /*#__PURE__*/React.createElement("g", {
    opacity: 0.25
  }, /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerAngle120, {
    ox: ox,
    oy: oy,
    sc: sc
  })), rows.map((row, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: cx,
    y: baseY + i * (fs + 12),
    fill: row.color,
    fontFamily: MONO,
    fontSize: fs,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: cl((lt - row.t0) / 0.8, 0, 1)
  }, row.text)));
}

// ════ PROOF 3 — THE ANGLE ════════════════════════════════════════════════════
function SceneProofAngle({
  lt
}) {
  const L = useL();
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const isP = L.orient === 'portrait';
  const cx = L.vw / 2;
  const fs = isP ? 24 : 22;
  const baseY = isP ? L.vh - 320 : L.vh - 200;
  const rows = [{
    text: 'cos θ  =  OP₁·OP₂ / (|OP₁|·|OP₂|)',
    color: C.ink,
    t0: 0.4
  }, {
    text: '      =  2 / (2 × 2)  =  ½',
    color: C.dim,
    t0: 1.5
  }, {
    text: 'θ  =  60°',
    color: GOLD,
    t0: 2.5
  }, {
    text: 'dihedral angle  =  120°',
    color: RED,
    t0: 3.4
  }];
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ChTitle, {
    n: "∴",
    title: "The Dihedral Proof",
    color: C.violet,
    lt: lt
  }), /*#__PURE__*/React.createElement("g", {
    opacity: 0.25
  }, /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 1
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerAngle120, {
    ox: ox,
    oy: oy,
    sc: sc
  })), rows.map((row, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: cx,
    y: baseY + i * (fs + 16),
    fill: row.color,
    fontFamily: MONO,
    fontSize: fs,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: cl((lt - row.t0) / 0.8, 0, 1)
  }, row.text)));
}

// ════ CLOSING CARD ════════════════════════════════════════════════════════════
function SceneEnd({
  lt
}) {
  const L = useL();
  const inP = cl(lt / 1.5, 0, 1);
  const {
    ox,
    oy,
    sc
  } = cam(L);
  const cx = L.vw / 2,
    cy = L.vh / 2;
  const isP = L.orient === 'portrait';
  const tagY = isP ? cy + 240 : cy + 180;
  return /*#__PURE__*/React.createElement("g", {
    opacity: inP
  }, /*#__PURE__*/React.createElement(GroundGrid, {
    ox: ox,
    oy: oy,
    sc: sc,
    opacity: 0.5
  }), /*#__PURE__*/React.createElement(LayerPlane, {
    ox: ox,
    oy: oy,
    sc: sc,
    dim: true
  }), /*#__PURE__*/React.createElement(LayerDiagonal, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerRise, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerSundial, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerTriangle, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerMirror, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement(LayerAngle120, {
    ox: ox,
    oy: oy,
    sc: sc
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: tagY,
    fill: C.ink,
    fontFamily: SERIF,
    fontSize: isP ? 26 : 22,
    fontStyle: "italic",
    textAnchor: "middle"
  }, "The Lost Triangle defines the Fleishman joint's 120° dihedral angle."), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: tagY + (isP ? 44 : 36),
    fill: C.dim,
    fontFamily: SERIF,
    fontSize: isP ? 20 : 17,
    fontStyle: "italic",
    textAnchor: "middle"
  }, "gregg fleishman"));
}
const SCENES = [{
  c: SceneTitle0,
  start: 0.0,
  end: 10.0
}, {
  c: ScenePlane,
  start: 10.0,
  end: 20.0
}, {
  c: SceneDiagonal,
  start: 20.0,
  end: 30.0
}, {
  c: SceneRise,
  start: 30.0,
  end: 40.0
}, {
  c: SceneSundial,
  start: 40.0,
  end: 52.0
}, {
  c: SceneLostTriangle,
  start: 52.0,
  end: 63.0
}, {
  c: SceneMirror,
  start: 63.0,
  end: 74.0
}, {
  c: SceneRevelation,
  start: 74.0,
  end: 88.0
}, {
  c: SceneProofVectors,
  start: 88.0,
  end: 102.0
}, {
  c: SceneProofDotProduct,
  start: 102.0,
  end: 116.0
}, {
  c: SceneProofAngle,
  start: 116.0,
  end: 130.0
}, {
  c: SceneEnd,
  start: 130.0,
  end: 140.0
}];
const DURATION = 140.0;
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
const CHAPTERS = [{
  i: 1,
  label: 'PLANE',
  color: BLUE
}, {
  i: 2,
  label: 'DIAGONAL',
  color: BLUE
}, {
  i: 3,
  label: 'RISE',
  color: RED
}, {
  i: 4,
  label: 'SUNDIAL',
  color: GOLD
}, {
  i: 5,
  label: 'TRIANGLE',
  color: GOLD
}, {
  i: 6,
  label: 'MIRROR',
  color: BLUE
}, {
  i: 7,
  label: '120°',
  color: RED
}, {
  i: 8,
  label: 'PROOF',
  color: C.violet
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
    const active = sceneIdx === ch.i;
    const seen = sceneIdx > ch.i;
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
        width: 6,
        height: 6,
        borderRadius: 3,
        background: active ? ch.color : 'rgba(255,255,255,0.25)',
        boxShadow: active ? '0 0 8px ' + ch.color : 'none',
        transition: 'all 220ms'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: portrait ? 11 : 13,
        letterSpacing: '0.16em',
        color: active ? ch.color : C.dim,
        whiteSpace: 'nowrap',
        transition: 'color 220ms'
      }
    }, ch.label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 1.5,
        borderRadius: 1,
        background: active ? ch.color : 'transparent',
        transition: 'background 220ms'
      }
    }));
  }));
}
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
    if (forcedOrient) return;
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
    }, "loading…");
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