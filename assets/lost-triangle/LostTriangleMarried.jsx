// LostTriangleMarried.jsx
// "Married" edition — the Clean version's refined full-canvas geometry as the
// hero, with the Hybrid version's editorial storytelling brought back as an
// elegant lower-third: numbered kicker · Syne headline · Cormorant prose ·
// a framed inset of Gregg Fleishman's original drawing for each chapter.
// Palette: near-black bg · off-white lines · magenta accent · steel blue · gold.

const R3c = Math.sqrt(3), R2c = Math.SQRT2;
const clc = (v, a, b) => Math.max(a, Math.min(b, v));

const Cc = {
  bg:    '#0C0B0A',
  ink:   '#E8E5E0',
  dim:   '#4E4C49',
  faint: '#1C1B19',
  line:  '#2E2C2A',
  border:'#2A2A2A',
  acc:   '#FF00CC',
  blue:  '#5B90C8',
  gold:  '#C8A96E',
};

const DISPc  = "'Syne', sans-serif";
const SERIFc = "'Cormorant Garamond', serif";
const MONOc  = "'Space Grotesk', sans-serif";
const IMGc   = n => `assets/lost-triangle/married/${n}`;

function subc(lt, start, dur, ease) {
  const E = (window.Easing && ease) ? ease
    : (window.Easing ? window.Easing.easeInOutCubic : t => t);
  return E(clc((lt - start) / dur, 0, 1));
}
const lerpc  = (a, b, t) => a + (b - a) * t;
const polarc = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const ptStrc = pts => pts.map(p => p.join(',')).join(' ');
const sub2c  = (a, b) => [a[0]-b[0], a[1]-b[1]];
const add2c  = (a, b) => [a[0]+b[0], a[1]+b[1]];
const mul2c  = (a, s) => [a[0]*s, a[1]*s];
const len2c  = a => Math.hypot(a[0], a[1]);
const normc  = a => { const l = len2c(a)||1; return [a[0]/l, a[1]/l]; };
function arcPathc(cx, cy, r, a0, a1) {
  const [sx,sy] = polarc(cx,cy,r,a0), [ex,ey] = polarc(cx,cy,r,a1);
  return `M${sx} ${sy} A${r} ${r} 0 ${Math.abs(a1-a0)>Math.PI?1:0} ${a1>a0?1:0} ${ex} ${ey}`;
}

const LayoutContextC = React.createContext(null);
const useLC = () => React.useContext(LayoutContextC);

function makeLayoutC(orient, cover) {
  if (orient === 'portrait') {
    return { orient, vw:1080, vh:1920, GX:540, GY:820, U:210, dotsTop:60, stripY:1360, cover:!!cover };
  }
  return { orient:'landscape', vw:1920, vh:1080, GX:960, GY:516, U:230, dotsTop:42, stripY:856, cover:!!cover };
}

// ── primitives ─────────────────────────────────────────────────────────────
function StrokeC({ d, p=1, stroke=Cc.ink, w=2.2, opacity=1, dashArr, cap='round' }) {
  if (clc(p,0,1) <= 0) return null;
  return (
    <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap={cap}
      strokeLinejoin="round" opacity={opacity} pathLength="1"
      strokeDasharray={dashArr||'1 1'} strokeDashoffset={dashArr ? 0 : (1-p)} />
  );
}
const segc = (a, b) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
function LineC({ a, b, p, ...r }) { return <StrokeC d={segc(a,b)} p={p} {...r} />; }
function PolyC({ pts, fill, opacity=1 }) {
  return <polygon points={ptStrc(pts)} fill={fill} fillOpacity={opacity} strokeLinejoin="round" />;
}
function DotC({ at, r=4.5, fill=Cc.ink, opacity=1 }) {
  return <circle cx={at[0]} cy={at[1]} r={r} fill={fill} opacity={opacity} />;
}
function RightAngleC({ v, p, q, s=14, opacity=1 }) {
  const dp = normc(sub2c(p,v)), dq = normc(sub2c(q,v));
  const a = add2c(v, mul2c(dp,s)), b = add2c(a, mul2c(dq,s)), cc = add2c(v, mul2c(dq,s));
  return (
    <g opacity={opacity}>
      <polyline points={ptStrc([a,b,cc])} fill="none" stroke={Cc.dim}
        strokeWidth={1.1} strokeLinejoin="miter" />
    </g>
  );
}
function AngleMarkC({ v, p, q, r, color, label, p0, size=13, labelOff=20 }) {
  if (!p0) return null;
  const dp = normc(sub2c(p,v)), dq = normc(sub2c(q,v));
  const a0 = Math.atan2(dp[1],dp[0]), a1 = Math.atan2(dq[1],dq[0]);
  const mid = (a0+a1)/2;
  const lx = v[0]+(r+labelOff)*Math.cos(mid), ly = v[1]+(r+labelOff)*Math.sin(mid);
  return (
    <g opacity={p0}>
      <StrokeC d={arcPathc(v[0],v[1],r,a0,a1)} p={1} stroke={color} w={1.1} opacity={.6} />
      <text x={lx} y={ly} fill={color} fontFamily={MONOc} fontSize={size}
        textAnchor="middle" dominantBaseline="middle">{label}</text>
    </g>
  );
}
function LenLabelC({ a, b, text, radical, color, off=0, size=18, opacity=1 }) {
  const mid = mul2c(add2c(a,b),.5);
  const perp = normc([-(b[1]-a[1]), b[0]-a[0]]);
  const x = mid[0]+perp[0]*off, y = mid[1]+perp[1]*off;
  return radical
    ? <text x={x} y={y} fill={color} fontFamily={SERIFc} fontSize={size}
        textAnchor="middle" dominantBaseline="middle" opacity={opacity}>√{radical}</text>
    : <text x={x} y={y} fill={color} fontFamily={MONOc} fontSize={size}
        textAnchor="middle" dominantBaseline="middle" opacity={opacity}>{text}</text>;
}
function RadicalC({ x, y, n, color, size=22, opacity=1 }) {
  return <text x={x} y={y} fill={color} fontFamily={SERIFc} fontSize={size}
    textAnchor="middle" opacity={opacity}>√{n}</text>;
}

// ── 3D ─────────────────────────────────────────────────────────────────────
function project3c([x,y,z], ry, sc, ox, oy) {
  const cY=Math.cos(ry), sY=Math.sin(ry);
  const X=x*cY+z*sY, Z=-x*sY+z*cY;
  const tilt=-.38, ct=Math.cos(tilt), st=Math.sin(tilt);
  return [ox+X*sc, oy-(y*ct-Z*st)*sc];
}
const CVc = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
const CEc = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];

// ═══ EDITORIAL LOWER-THIRD ══════════════════════════════════════════════════
// The Hybrid version's storytelling, distilled to a single elegant strip that
// sits beneath the Clean geometry without competing with it.
function EditorialStripC({ ed, lt }) {
  const L = useLC();
  // Cover mode (ambient hero background) drops the editorial lower-third —
  // it would collide with the page's own foreground content.
  if (L.cover) return null;
  const isP = L.orient === 'portrait';
  const Y = L.stripY;
  const aP = subc(lt, .35, .9);
  const pP = subc(lt, .95, 1.0);
  const rP = subc(lt, 1.35, 1.1);
  if (aP <= 0) return null;

  if (isP) {
    // portrait — stacked at the bottom
    const x = 72;
    return (
      <g>
        <line x1={x} y1={Y-30} x2={L.vw-72} y2={Y-30} stroke={Cc.border} strokeWidth={1} opacity={aP*.8} />
        <line x1={x} y1={Y+2} x2={x} y2={Y+30} stroke={Cc.gold} strokeWidth={2.5} opacity={aP} />
        <text x={x+14} y={Y+22} fill={Cc.gold} fontFamily={MONOc} fontSize={11}
          style={{ letterSpacing:'.22em' }} opacity={aP}>{ed.kicker}</text>
        {ed.head.map((l,i) => (
          <text key={i} x={x} y={Y+72+i*48} fill={Cc.ink} fontFamily={DISPc} fontWeight={800}
            fontSize={42} style={{ letterSpacing:'-.03em' }} opacity={aP}>{l}</text>
        ))}
        {ed.prose.map((l,i) => (
          <text key={i} x={x} y={Y+72+ed.head.length*48+22+i*30} fill={Cc.dim}
            fontFamily={SERIFc} fontStyle="italic" fontWeight={300} fontSize={23}
            style={{ letterSpacing:'.01em' }} opacity={pP}>{l}</text>
        ))}
      </g>
    );
  }

  // landscape — editorial lower-third pinned bottom-left, below the geometry
  // (geometry occupies roughly y:160–680; RefPlate sits bottom-right as DOM)
  const x = 80;
  const proseLines = ed.prose.length;
  const proseH = proseLines * 32;
  const headH = ed.head.length * 44;
  const bottomPad = 64;
  const proseY = L.vh - bottomPad - proseH + 32;   // first prose baseline
  const headY  = proseY - 26 - headH + 44;          // first headline baseline
  const topY   = headY - 42;                        // kicker baseline
  return (
    <g>
      {/* kicker */}
      <line x1={x} y1={topY-14} x2={x} y2={topY+4} stroke={Cc.gold} strokeWidth={2.5} opacity={aP} />
      <text x={x+15} y={topY} fill={Cc.gold} fontFamily={MONOc} fontSize={11}
        style={{ letterSpacing:'.24em' }} opacity={aP}>{ed.kicker}</text>
      {/* headline */}
      {ed.head.map((l,i) => (
        <text key={i} x={x} y={headY+i*44} fill={Cc.ink} fontFamily={DISPc} fontWeight={800}
          fontSize={40} style={{ letterSpacing:'-.035em' }} opacity={aP}>{l}</text>
      ))}
      {/* prose */}
      {ed.prose.map((l,i) => (
        <text key={i} x={x} y={proseY+i*32} fill={Cc.dim} fontFamily={SERIFc}
          fontStyle="italic" fontWeight={300} fontSize={23} style={{ letterSpacing:'.01em' }}
          opacity={pP}>{l}</text>
      ))}
    </g>
  );
}

// ── Reference plate — Gregg's actual construction drawings, bottom-right ─────
// Rendered as a DOM overlay (not SVG) so the full-resolution drawing always
// loads cleanly and shows real detail, on a warm paper card.
function RefPlateC() {
  const t = window.useTime ? window.useTime() : 0;
  const sc = SCENES_C.find(s => s.ed && s.ed.ref && t >= s.start && t < s.end);
  if (!sc) return null;
  const lt = t - sc.start;
  const dur = sc.end - sc.start;
  const inP = clc(lt / 0.9, 0, 1);
  const outP = lt > dur - 1 ? clc((dur - lt) / 1, 0, 1) : 1;
  const op = inP * outP;
  return (
    <div style={{ position:'absolute', right:60, bottom:60, width:372,
      opacity:op, transition:'opacity .25s', pointerEvents:'none' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'flex-end',
        gap:10, marginBottom:9 }}>
        <span style={{ fontFamily:DISPc, fontWeight:700, fontSize:11, letterSpacing:'.04em',
          color:Cc.gold }}>GREGG FLEISHMAN</span>
        <span style={{ fontFamily:MONOc, fontSize:9, letterSpacing:'.18em',
          color:Cc.dim }}>ORIGINAL CONSTRUCTION</span>
      </div>
      <div style={{ background:'#F5F2EB', padding:16, border:'1px solid '+Cc.border,
        boxShadow:'0 14px 48px rgba(0,0,0,.55)' }}>
        <img src={IMGc(sc.ed.ref)} alt="" style={{ width:'100%', display:'block' }} />
      </div>
    </div>
  );
}

// ═══ INTRO ════════════════════════════════════════════════════════════════════
function SceneIntroC({ lt }) {
  const L = useLC();
  const { vw, vh } = L;
  const isP = L.orient === 'portrait';
  const ts = isP ? 92 : 116;
  const imgP = subc(lt,0,1.6);
  const ttP = subc(lt,.6,1.2);
  const spP = subc(lt,1.5,.9);
  const outP = lt > 3.4 ? clc(1-(lt-3.4)/.7,0,1) : 1;
  return (
    <g opacity={outP}>
      <image xlinkHref={IMGc('gf-artwork-bronze.png')}
        x={vw*.20} y={vh*.04} width={vw*.60} height={vh*.92}
        preserveAspectRatio="xMidYMid meet" opacity={imgP*.30} />
      {/* In cover mode (ambient hero background — see index.html) the title
          card is dropped: it would collide with the page's own headline
          sitting on top of the iframe. The artwork fade still plays. */}
      {!L.cover && <>
        <rect x={0} y={vh*.38} width={vw} height={vh*.26} fill="rgba(12,11,10,.74)" opacity={ttP} />
        <text x={vw/2} y={vh*.49} fill={Cc.ink} fontFamily={DISPc} fontWeight={800}
          fontSize={ts} textAnchor="middle" style={{ letterSpacing:'-.05em' }} opacity={ttP}>
          The Lost Triangle
        </text>
        <text x={vw/2} y={vh*.49+ts*.70} fill={Cc.gold} fontFamily={MONOc}
          fontSize={isP?12:13} textAnchor="middle"
          style={{ letterSpacing:'.30em' }} opacity={spP}>
          THE FLEISHMAN SEQUENCE
        </text>
        <text x={vw/2} y={vh*.49+ts*.70+34} fill={Cc.dim} fontFamily={SERIFc}
          fontStyle="italic" fontWeight={300} fontSize={isP?20:25}
          textAnchor="middle" opacity={spP}>
          1 · √2 · √3
        </text>
      </>}
    </g>
  );
}

// ═══ SCENE 1 — ROOT SPIRAL ════════════════════════════════════════════════════
function spiralPtsC(N, S, cx, cy, sa) {
  let px = cx+S*Math.cos(sa), py = cy+S*Math.sin(sa);
  const pts = [[px,py]];
  for (let k=1; k<=N; k++) {
    const dx=px-cx, dy=py-cy, r=Math.sqrt(dx*dx+dy*dy);
    const perpX=-dy/r, perpY=dx/r;
    px += S*perpX; py += S*perpY;
    pts.push([px,py]);
  }
  return pts;
}

function SceneSpiralC({ lt }) {
  const L  = useLC();
  const isP = L.orient === 'portrait';
  const S  = isP ? 104 : 116;
  const N  = 9;
  const SA = Math.PI * .08;
  const Ocx = L.GX + (isP ? 0 : -40);
  const Ocy = L.GY + (isP ? 20 : 24);
  const pts = React.useMemo(() => spiralPtsC(N, S, Ocx, Ocy, SA), [Ocx, Ocy, S]);
  const O   = [Ocx, Ocy];

  return (
    <g>
      {Array.from({ length:N }, (_,k) => {
        const tp = subc(lt, .6+k*.62, .7);
        if (tp <= 0 || !pts[k+1]) return null;
        const isLost=k===1, isUnit=k===0;
        return (
          <g key={k}>
            <PolyC pts={[O,pts[k],pts[k+1]]}
              fill={isLost?Cc.acc:isUnit?Cc.blue:Cc.faint}
              opacity={(isLost?.22:isUnit?.12:.03)*tp} />
            <LineC a={O} b={pts[k]} p={tp} stroke={isLost?Cc.acc:isUnit?Cc.blue:Cc.dim}
              w={isLost?2.6:1.2} opacity={isLost?1:isUnit?.60:.22} />
            <LineC a={O} b={pts[k+1]} p={tp} stroke={isLost?Cc.acc:isUnit?Cc.blue:Cc.dim}
              w={isLost?2.8:1.2} opacity={isLost?1:isUnit?.50:.18} />
            <LineC a={pts[k]} b={pts[k+1]} p={tp}
              stroke={isLost?Cc.acc:isUnit?Cc.blue:Cc.dim}
              w={isLost?2.8:isUnit?1.8:1.1} opacity={isLost?1:isUnit?.65:.22} />
          </g>
        );
      })}
      {[1,2,3,4,5].map(k => {
        const tp = subc(lt, 7.2+(k-1)*.44, 1.2,
          window.Easing && window.Easing.easeInOutSine);
        if (tp <= 0) return null;
        const r = S*Math.sqrt(k);
        return (
          <StrokeC key={k} d={arcPathc(Ocx, Ocy, r, SA-.12, SA+Math.PI*1.38*tp)}
            p={1} stroke={k===2?Cc.acc:Cc.line} w={k===2?1.6:.9}
            opacity={k===2?.38:.14} dashArr={k===2 ? undefined : '0.025 0.022'} />
        );
      })}
      {[1,2,3].map(k => {
        const tp = subc(lt, .6+(k-1)*.62+.36, .5);
        if (tp <= 0 || !pts[k]) return null;
        const dn = normc(sub2c(pts[k],O));
        const lp = add2c(pts[k], mul2c(dn,44));
        return (
          <RadicalC key={k} x={lp[0]} y={lp[1]} n={String(k+1)}
            color={k===2?Cc.acc:k===1?Cc.blue:Cc.dim} size={24} opacity={tp} />
        );
      })}
      <DotC at={O} r={5} fill={Cc.ink} opacity={subc(lt,.6,.5)} />
      {(() => {
        const op = subc(lt, 4.6, .9);
        if (op <= 0 || !pts[2]) return null;
        const cc2 = [(O[0]+pts[1][0]+pts[2][0])/3, (O[1]+pts[1][1]+pts[2][1])/3];
        return (
          <g opacity={op}>
            <text x={cc2[0]+16} y={cc2[1]-10} fill={Cc.acc} fontFamily={DISPc}
              fontSize={isP?20:22} fontWeight={600} fontStyle="italic">The Lost Triangle</text>
            <text x={cc2[0]+16} y={cc2[1]+14} fill={Cc.dim} fontFamily={MONOc}
              fontSize={11} style={{ letterSpacing:'.14em' }}>1 · √2 · √3</text>
          </g>
        );
      })()}
    </g>
  );
}

// ═══ SCENE 2 — TRIANGLE CONSTRUCTION (faithful to Gregg's drawing) ═══════════
// Three equal circles (r = √2⁄2): circle 1 circumscribes the unit square;
// circle 2 is centred on the square's lower-right corner; circle 3 sits one
// unit further right. The Lost Triangle's apex rides the top of circle 2 and
// its base is a chord of circle 3 — the big magenta triangle pointing right.
function SceneTriangleC({ lt }) {
  const L = useLC();
  const isP = L.orient === 'portrait';
  const rho = R2c/2;                       // √2⁄2  — shared circle radius
  const sc  = isP ? 232 : 300;             // unit length in px
  const Sx  = L.GX - 1.25*sc;              // square top-left x (figure centred)
  const Sy  = L.GY - 0.75*sc;              // square top-left y
  const Pt  = (ux,uy) => [Sx+ux*sc, Sy+uy*sc];

  // square + centres
  const TL=Pt(0,0), TR=Pt(1,0), BR=Pt(1,1), BL=Pt(0,1), M=Pt(.5,.5);
  const c1=M, c2=Pt(1,1), c3=Pt(2,1), rC=rho*sc;

  // magenta equilateral (side √2): apex on circle 2, base a chord of circle 3
  const Atop = Pt(1, 1-rho);               // apex — top of circle 2
  const F    = c3;                         // foot of the altitude = circle-3 centre
  const Rr   = Pt(2.4082, 0.4226);         // upper-right base vertex (on circle 3)
  const Bb   = Pt(1.5918, 1.5774);         // lower base vertex (on circle 3)

  // blue rhombic face — a true 1:√2 rhombic-dodecahedron face, not a square
  // diamond: top vertex IS the triangle's apex (attached, no gap), left vertex
  // is the square's own corner, right vertex is F — the same point where the
  // magenta triangle's altitude lands (per Gregg's drawing)
  const bTop=Atop, bR=F, bBot=Pt(1,1+rho), bL=BL;

  const ease  = window.Easing && window.Easing.easeInOutSine;
  const sqP    = subc(lt,0.6,1.0,ease);    // unit square
  const c1P    = subc(lt,1.5,0.9);         // circumcircle
  const diagP  = subc(lt,2.3,0.9,ease);    // diagonals
  const whiteP = subc(lt,3.0,0.8);         // white quadrant
  const c2P    = subc(lt,3.7,0.9);         // circle 2
  const swingP = subc(lt,4.5,0.9,ease);    // apex located
  const triP   = subc(lt,5.3,1.1);         // the magenta triangle
  const c3P    = subc(lt,6.3,1.0);         // circle 3 (the missing one)
  const blueP  = subc(lt,7.1,1.0,ease);    // rhombic face
  const labP   = subc(lt,7.9,0.9);

  return (
    <g>
      {/* circle 1 — circumcircle of the square */}
      <circle cx={c1[0]} cy={c1[1]} r={rC} fill="none" stroke="#FFFFFF"
        strokeWidth={1.4} opacity={.50*c1P} />
      {/* unit square */}
      <StrokeC d={`M${TL[0]},${TL[1]} L${TR[0]},${TR[1]} L${BR[0]},${BR[1]} L${BL[0]},${BL[1]} Z`}
        p={sqP} stroke="#FFFFFF" w={1.6} opacity={.78} />
      {/* diagonals */}
      <LineC a={TL} b={BR} p={diagP} stroke="#FFFFFF" w={1.2} opacity={.5} />
      <LineC a={TR} b={BL} p={diagP} stroke="#FFFFFF" w={1.2} opacity={.5} />
      {/* white quadrant — a construction step only; dissolves once the blue
          rhombic face takes over, so the two never coexist as separate shapes */}
      <PolyC pts={[BL,BR,M]} fill="#FFFFFF" opacity={.92*whiteP*(1-blueP)} />
      {/* circle 2 — centred on the square's lower-right corner */}
      <circle cx={c2[0]} cy={c2[1]} r={rC} fill="none" stroke="#FFFFFF"
        strokeWidth={1.2} opacity={.42*c2P} />
      {/* blue rhombic face */}
      <PolyC pts={[bTop,bR,bBot,bL]} fill={Cc.blue} opacity={.55*blueP} />
      <StrokeC d={`M${bTop[0]},${bTop[1]} L${bR[0]},${bR[1]} L${bBot[0]},${bBot[1]} L${bL[0]},${bL[1]} Z`}
        p={blueP} stroke="#FFFFFF" w={1.4} opacity={.6} />
      {blueP>.55 && (
        <text x={bBot[0]+10} y={bBot[1]+18} fill={Cc.blue} fontFamily={MONOc} fontSize={11}
          opacity={clc((blueP-.55)/.45,0,1)} style={{letterSpacing:'.04em'}}>rhombic face</text>
      )}
      {/* circle 3 — locates the magenta base (the circle that was missing) */}
      <circle cx={c3[0]} cy={c3[1]} r={rC} fill="none" stroke={Cc.acc}
        strokeWidth={1.3} opacity={.55*c3P} strokeDasharray="5 6" />
      {/* swing arc + apex marker */}
      <circle cx={Atop[0]} cy={Atop[1]} r={4} fill={Cc.acc} opacity={swingP} />
      {/* the Lost Triangle — big magenta, pointing right */}
      <PolyC pts={[Atop,Rr,Bb]} fill={Cc.acc} opacity={.80*triP} />
      <LineC a={Atop} b={Rr} p={triP} stroke="#FFFFFF" w={2.4} />
      <LineC a={Rr}   b={Bb} p={triP} stroke="#FFFFFF" w={2.4} />
      <LineC a={Bb}   b={Atop} p={triP} stroke="#FFFFFF" w={2.4} />
      <LineC a={Atop} b={F}  p={triP} stroke="#FFFFFF" w={1.1} opacity={.65} />
      <RightAngleC v={F} p={Atop} q={Rr} opacity={triP} s={12} />
      <DotC at={c3} r={3} fill={Cc.acc} opacity={c3P} />
      {/* length labels */}
      <LenLabelC a={TR} b={BR} text="1" color={Cc.ink} off={22} size={18} opacity={labP} />
      <LenLabelC a={TL} b={BR} radical="2" color={Cc.blue} off={-22} size={20} opacity={labP} />
      <LenLabelC a={Atop} b={Rr} radical="3" color={Cc.acc} off={-24} size={24} opacity={labP} />
    </g>
  );
}

// ═══ SCENE 3 — CUBE ══════════════════════════════════════════════════════════
function SceneCubeC({ lt }) {
  const L  = useLC();
  const { GX, GY } = L;
  const isP = L.orient === 'portrait';
  const scale = isP ? 205 : 240;
  const ox = GX, oy = GY + (isP ? 10 : 16);
  const t  = window.useTime ? window.useTime() : 0;
  const rotY = 0.44 + t * .011;
  const P = v => project3c(v, rotY, scale, ox, oy);
  const tR=P([1,0,0]), tU=P([0,0,0]), tD=P([1,1,1]);
  const cubeP=subc(lt,1.0,2.0);
  const triP =subc(lt,.4,.9);
  const fillP=subc(lt,3.6,.9);
  const labP =subc(lt,3.4,1.0);
  const mU=mul2c(add2c(tR,tU),.5), mF=mul2c(add2c(tR,tD),.5), mS=mul2c(add2c(tU,tD),.5);
  return (
    <g>
      {CEc.map((e,i) => {
        const a=P(CVc[e[0]]), b=P(CVc[e[1]]);
        return <LineC key={i} a={a} b={b} p={clc(cubeP*CEc.length-i,0,1)} stroke={Cc.dim} w={1.3} opacity={.55} />;
      })}
      <PolyC pts={[tR,tU,tD]} fill={Cc.acc} opacity={.16*fillP} />
      <LineC a={tR} b={tU} p={triP} stroke={Cc.ink} w={2.6} />
      <LineC a={tR} b={tD} p={triP} stroke={Cc.blue} w={2.8} />
      <LineC a={tU} b={tD} p={triP} stroke={Cc.acc} w={3.2} />
      <RightAngleC v={tR} p={tU} q={tD} opacity={triP} s={13} />
      <DotC at={tR} r={4} fill={Cc.ink} opacity={triP} />
      <DotC at={tU} r={4} fill={Cc.ink} opacity={triP} />
      <DotC at={tD} r={4} fill={Cc.acc} opacity={triP} />
      <text x={mU[0]} y={mU[1]-20} fill={Cc.ink} fontFamily={MONOc} fontSize={19}
        textAnchor="middle" opacity={labP}>1</text>
      <RadicalC x={mF[0]+40} y={mF[1]+14} n="2" color={Cc.blue} size={22} opacity={labP} />
      <RadicalC x={mS[0]-42} y={mS[1]-8} n="3" color={Cc.acc} size={26} opacity={labP} />
    </g>
  );
}

// ═══ SCENE 4 — REFLECTED INTO FORM ═══════════════════════════════════════════
const RD_Cc = [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]];
const RD_Oc = [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]];

function rdProjC([x,y,z], ry, sc, ox, oy) {
  const cY=Math.cos(ry), sY=Math.sin(ry);
  const X=x*cY+z*sY, Z=-x*sY+z*cY;
  const tilt=-.46, ct=Math.cos(tilt), st=Math.sin(tilt);
  return [ox+X*sc, oy-(y*ct-Z*st)*sc];
}

function RDMiniC({ cx, cy, sc, p }) {
  const t  = window.useTime ? window.useTime() : 0;
  const ry = .6 + t * .22;
  const s  = sc * .44;
  const PC = RD_Cc.map(v => rdProjC(v, ry, s, cx, cy));
  const PO = RD_Oc.map(v => rdProjC(v, ry, s, cx, cy));
  const edges = [];
  RD_Oc.forEach((o,oi) => RD_Cc.forEach((c,ci) => {
    const ax = o[0]!==0 ? 0 : o[1]!==0 ? 1 : 2;
    if (Math.sign(o[ax]) === Math.sign(c[ax])) edges.push([PO[oi], PC[ci]]);
  }));
  return (
    <g>
      {edges.map((e,i) => (
        <LineC key={i} a={e[0]} b={e[1]} p={clc(p*1.4,0,1)} stroke={Cc.blue} w={1.3} opacity={.70} />
      ))}
      {PO.map((v,i) => <DotC key={i} at={v} r={2.4} fill={Cc.acc} opacity={p} />)}
    </g>
  );
}

function SceneReflectC({ lt }) {
  const L = useLC();
  const { GX, GY } = L;
  const isP = L.orient === 'portrait';
  const pW  = isP ? 280 : 330;
  const pH  = isP ? 360 : 384;
  const gap = isP ? 20 : 32;
  const totalW = 3*pW + 2*gap;
  const px0 = GX - totalW/2;
  const pXi = i => px0 + i*(pW+gap);
  const pY0 = GY - pH*.5 - (isP ? 50 : 0);
  const cY  = pY0 + pH*.44;
  const S   = pW * .22;
  const labY = pY0 + pH + 38;
  const p1=subc(lt,1.2,1.0), p2=subc(lt,4.2,1.0), p3=subc(lt,7.2,1.0);
  const Tv = {
    O:[pXi(0)+pW*.42, cY+S*.30],
    T:[pXi(0)+pW*.42, cY-S*.82],
    R:[pXi(0)+pW*.74, cY+S*.30],
  };
  const rS=S*.86, rCX=pXi(1)+pW*.5;
  const Rh = {
    top:[rCX,cY-rS], bot:[rCX,cY+rS], L:[rCX-rS*R2c,cY], R:[rCX+rS*R2c,cY],
  };
  return (
    <g>
      <g opacity={p1}>
        <PolyC pts={[Tv.O,Tv.T,Tv.R]} fill={Cc.acc} opacity={.20} />
        <LineC a={Tv.O} b={Tv.T} p={1} stroke={Cc.ink} w={2.0} />
        <LineC a={Tv.O} b={Tv.R} p={1} stroke={Cc.ink} w={2.0} />
        <LineC a={Tv.T} b={Tv.R} p={1} stroke={Cc.acc} w={2.6} />
        <RightAngleC v={Tv.O} p={Tv.T} q={Tv.R} opacity={1} s={10} />
        <text x={pXi(0)+pW*.5} y={labY} fill={Cc.dim} fontFamily={MONOc}
          fontSize={isP?11:12} textAnchor="middle" style={{letterSpacing:'.08em'}}>ONE TRIANGLE</text>
      </g>
      <g opacity={p2}>
        <PolyC pts={[Rh.top,Rh.R,Rh.bot,Rh.L]} fill={Cc.acc} opacity={.14} />
        <LineC a={Rh.top} b={Rh.R}   p={1} stroke={Cc.acc} w={2.0} />
        <LineC a={Rh.R}   b={Rh.bot} p={1} stroke={Cc.acc} w={2.0} />
        <LineC a={Rh.bot} b={Rh.L}   p={1} stroke={Cc.acc} w={2.0} />
        <LineC a={Rh.L}   b={Rh.top} p={1} stroke={Cc.acc} w={2.0} />
        <LineC a={Rh.top} b={Rh.bot} p={1} stroke={Cc.dim} w={.8} opacity={.28} dashArr="0.04 0.03" />
        <LineC a={Rh.L}   b={Rh.R}   p={1} stroke={Cc.dim} w={.8} opacity={.28} dashArr="0.04 0.03" />
        <DotC at={[rCX,cY]} r={3} fill={Cc.dim} opacity={p2} />
        <text x={rCX} y={labY} fill={Cc.dim} fontFamily={MONOc}
          fontSize={isP?11:12} textAnchor="middle" style={{letterSpacing:'.08em'}}>RHOMBIC FACE</text>
      </g>
      <g opacity={p3}>
        <RDMiniC cx={pXi(2)+pW*.5} cy={cY} sc={S*1.8} p={p3} />
        <text x={pXi(2)+pW*.5} y={labY} fill={Cc.dim} fontFamily={MONOc}
          fontSize={isP?11:12} textAnchor="middle" style={{letterSpacing:'.08em'}}>DODECAHEDRON</text>
      </g>
    </g>
  );
}

// ═══ SCENE 5 — DIHEDRAL ANGLES ════════════════════════════════════════════════
function WireC({ verts, edges, ry=.55, sc, cx, cy }) {
  const P = v => {
    const [x,y,z]=v;
    const cY2=Math.cos(ry), sY2=Math.sin(ry);
    const X=x*cY2+z*sY2, Z=-x*sY2+z*cY2;
    const tilt=-.38, ct=Math.cos(tilt), st=Math.sin(tilt);
    return [cx+X*sc, cy-(y*ct-Z*st)*sc];
  };
  return (
    <g>
      {edges.map((e,i) => {
        const a=P(verts[e[0]]), b=P(verts[e[1]]);
        return <LineC key={i} a={a} b={b} p={1} stroke={Cc.ink} w={1.1} opacity={.50} />;
      })}
    </g>
  );
}
const CUBE_WC  = { verts:CVc.map(v => v.map(x => x*2-1)), edges:CEc };
const TETRA_WC = { verts:[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]], edges:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]] };
const OCTA_WC  = { verts:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]], edges:[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]] };

function SceneAnglesC({ lt }) {
  const L = useLC();
  const { GX, GY } = L;
  const isP = L.orient === 'portrait';
  const cW  = isP ? 214 : 262;
  const cH  = isP ? 270 : 320;
  const gap = isP ? 14 : 26;
  const totalW = 4*cW + 3*gap;
  const cX0 = GX - totalW/2;
  const cXi = i => cX0 + i*(cW+gap);
  const icCX = i => cXi(i)+cW*.5;
  const cY0 = GY - cH*.5 - (isP ? 30 : 0);
  const icCY = cY0+cH*.40;
  const icS  = cW*.36;
  const labY1 = cY0+cH-40;
  const labY2 = cY0+cH-12;
  const p = [subc(lt,1.2,.9),subc(lt,2.4,.9),subc(lt,3.6,.9),subc(lt,4.8,.9)];
  const cards = [
    { l:'CUBE',        a:'90°',     wire:CUBE_WC,  rd:false },
    { l:'TETRAHEDRON', a:'70.53°',  wire:TETRA_WC, rd:false },
    { l:'OCTAHEDRON',  a:'109.47°', wire:OCTA_WC,  rd:false },
    { l:'RHOMBIC',     a:'120°',    wire:null,      rd:true  },
  ];
  return (
    <g>
      {cards.map(({ l,a,wire,rd },i) => (
        <g key={i} opacity={p[i]}>
          {rd
            ? <RDMiniC cx={icCX(i)} cy={icCY} sc={icS*.88} p={p[i]} />
            : <WireC {...wire} ry={.55} sc={icS*.36} cx={icCX(i)} cy={icCY} />
          }
          <text x={icCX(i)} y={labY1} fill={Cc.dim} fontFamily={MONOc}
            fontSize={isP?10:11} textAnchor="middle" style={{letterSpacing:'.10em'}}>{l}</text>
          <text x={icCX(i)} y={labY2} fill={Cc.ink} fontFamily={SERIFc}
            fontStyle="italic" fontSize={isP?28:34} textAnchor="middle">{a}</text>
        </g>
      ))}
    </g>
  );
}

// ═══ CLOSE ════════════════════════════════════════════════════════════════════
function SceneCloseC({ lt }) {
  const L = useLC();
  const { vw, vh } = L;
  const isP = L.orient === 'portrait';
  const ts = isP ? 92 : 116;
  const imgP = subc(lt,0,1.6);
  const txP = subc(lt,.5,1.4);
  const spP = subc(lt,1.3,.9);
  return (
    <g>
      <image xlinkHref={IMGc('gf-emblem-gold.png')}
        x={vw*.28} y={vh*.06} width={vw*.44} height={vh*.88}
        preserveAspectRatio="xMidYMid meet" opacity={imgP*.24} />
      {/* Cover mode drops the title card — see the matching note in
          SceneIntroC. */}
      {!L.cover && <>
        <rect x={0} y={vh*.38} width={vw} height={vh*.26} fill="rgba(12,11,10,.72)" opacity={txP} />
        <text x={vw/2} y={vh*.46} fill={Cc.ink} fontFamily={DISPc} fontWeight={800}
          fontSize={ts} textAnchor="middle" style={{ letterSpacing:'-.04em' }} opacity={txP}>
          The Lost Triangle
        </text>
        <text x={vw/2} y={vh*.46+ts*.74} fill={Cc.gold} fontFamily={SERIFc}
          fontStyle="italic" fontWeight={300} fontSize={isP?28:36}
          textAnchor="middle" opacity={spP}>
          1 · √2 · √3
        </text>
        <text x={vw/2} y={vh*.46+ts*.74+52} fill={Cc.dim} fontFamily={MONOc}
          fontSize={isP?11:13} textAnchor="middle"
          style={{ letterSpacing:'.28em' }} opacity={spP}>
          THE FLEISHMAN SEQUENCE
        </text>
      </>}
    </g>
  );
}

// ── Scene schedule (with editorial content) ─────────────────────────────────
const SCENES_C = [
  { c:SceneIntroC,    start:0,  end:4,  ed:null },
  { c:SceneSpiralC,   start:4,  end:18, ed:{
      kicker:'ONE · THE SEQUENCE', head:['The Fleishman Sequence'],
      prose:['A new root-triangle sequence — the spiral','of square roots, carried forward into','three dimensions.'],
      ref:'gf-root-construction.png' } },
  { c:SceneTriangleC, start:18, end:32, ed:{
      kicker:'TWO · THE TRIANGLE', head:['It fits where','nothing else does.'],
      prose:['Between the right angle of the square and the','sixty degrees of the equilateral lies a gap —','and exactly one triangle that fills it.'],
      ref:'gf-lost-triangle.png' } },
  { c:SceneCubeC,     start:32, end:44, ed:{
      kicker:'THREE · THE CUBE', head:['Hidden in a unit cube'],
      prose:['The triangle was never invented. It was','always there — inside the most ordinary','solid we know: the unit cube.'],
      ref:'gf-artwork-bronze.png' } },
  { c:SceneReflectC,  start:44, end:58, ed:{
      kicker:'FOUR · THE SOLID', head:['Reflected into form.'],
      prose:['Reflect the triangle twice and its legs trace','a rhombus. Twelve of those rhombi close into','one solid — the rhombic dodecahedron.'],
      ref:'gf-emblem-gold.png' } },
  { c:SceneAnglesC,   start:58, end:70, ed:{
      kicker:'FIVE · THE KEY', head:['It unlocks every angle.'],
      prose:['A dihedral angle is the angle between two','faces of a solid. Every cubic polyhedron','derives its angles from the Lost Triangle.'],
      ref:'gf-fleishman-poster.png' } },
  { c:SceneCloseC,    start:70, end:78, ed:null },
];
const DURATION_C = 78;

function ProgressDotsC() {
  const L = useLC();
  const t = window.useTime ? window.useTime() : 0;
  const main = SCENES_C.slice(1,6);
  const active = main.findIndex(s => t >= s.start && t < s.end);
  return (
    <div style={{ position:'absolute', left:0, right:0, top:L.dotsTop,
      display:'flex', justifyContent:'center', gap:10 }}>
      {main.map((_,i) => (
        <div key={i} style={{
          width:i===active?20:6, height:6, borderRadius:3,
          background:i===active?'rgba(232,229,224,.75)':'rgba(255,255,255,.10)',
          transition:'all 260ms',
        }} />
      ))}
    </div>
  );
}

function SceneLayerC() {
  const L = useLC();
  const { Sprite } = window;
  return (
    <svg viewBox={`0 0 ${L.vw} ${L.vh}`} width={L.vw} height={L.vh}
      style={{ position:'absolute', inset:0 }}>
      {SCENES_C.map((s,i) => (
        <Sprite key={i} start={s.start} end={s.end}>
          {({ localTime }) => (
            <g>
              <s.c lt={localTime} />
              {s.ed && <EditorialStripC ed={s.ed} lt={localTime} />}
            </g>
          )}
        </Sprite>
      ))}
    </svg>
  );
}

// controls=false is "cover" mode — used as a pointer-inert ambient hero
// background (see index.html): no playback bar, no progress dots, no
// reference-plate inset, and the piece loops forever instead of stopping
// on the close scene.
function VideoBodyC({ orient, controls = true, loop = false }) {
  const [ready, setReady] = React.useState(!!(window.Stage && window.Sprite));
  React.useEffect(() => {
    if (ready) return;
    const id = setInterval(() => {
      if (window.Stage && window.Sprite) { setReady(true); clearInterval(id); }
    }, 30);
    return () => clearInterval(id);
  }, [ready]);
  if (!ready) {
    return (
      <div style={{ position:'absolute', inset:0, background:Cc.bg, display:'flex',
        alignItems:'center', justifyContent:'center',
        color:Cc.dim, fontFamily:MONOc, fontSize:'14px', letterSpacing:'.1em' }}>
        loading…
      </div>
    );
  }
  const L = makeLayoutC(orient, !controls);
  const { Stage } = window;
  return (
    <LayoutContextC.Provider value={L}>
      <Stage width={L.vw} height={L.vh} duration={DURATION_C} background={Cc.bg}
        persistKey="animstage-married" loop={loop} autoplay={true} controls={controls}>
        <SceneLayerC />
        {controls && <RefPlateC />}
        {controls && <ProgressDotsC />}
      </Stage>
    </LayoutContextC.Provider>
  );
}

function LostTriangleMarried(props) { return <VideoBodyC orient="landscape" {...props} />; }
function LostTriangleMarriedPortrait(props) { return <VideoBodyC orient="portrait" {...props} />; }

window.LostTriangleMarried = LostTriangleMarried;
window.LostTriangleMarriedPortrait = LostTriangleMarriedPortrait;
if (typeof module !== 'undefined') module.exports = { LostTriangleMarried, LostTriangleMarriedPortrait };
