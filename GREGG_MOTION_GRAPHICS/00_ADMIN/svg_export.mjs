#!/usr/bin/env node
// Export an insert page to an After-Effects-ready VECTOR (SVG) frame sequence.
//
//   node svg_export.mjs <insert-url> <out-dir> [--name INS_XX]
//
// Instead of rasterizing pixels (render_insert.mjs), this drives the same
// deterministic window.INSERT clock and, after each seek(), PROJECTS the live
// Three.js scene graph through the camera to 2-D and serialises it as an SVG:
// every LineSegments → <line>, every Mesh triangle → <polygon>, every Line →
// <path>, and every .svgtxt DOM label → real <text>. The result is fully
// resolution-independent — import the folder into After Effects as a sequence,
// enable "Continuously Rasterize", and it stays sharp at any comp resolution.
//
// Caveat: SVG has no depth buffer. Filled (semi-transparent) faces are sorted
// back-to-front (painter's order) and drawn under the wireframe; overlapping
// translucent faces can occasionally sort a hair off. Pure-wireframe frames are
// exact. See 00_ADMIN/AE_VECTOR_HANDOFF.md.
//
// Requires: static server at the repo root, Playwright (pre-installed), `zip`.

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
let url = args[0], outDir = args[1];
if (!url || !outDir) {
  console.error('usage: node svg_export.mjs <insert-url> <out-dir> [--name INS_XX]');
  process.exit(2);
}
const name = args.includes('--name') ? args[args.indexOf('--name') + 1] : 'insert';
// Author the vectors at a clean 16:9 design box so label proportions match HD.
if (!/[?&]w=/.test(url)) url += (url.includes('?') ? '&' : '?') + 'w=1920&h=1080';

const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')
  .catch(async () => (await import('playwright')));

const svgDir = join(outDir, `${name}_svg`);
rmSync(svgDir, { recursive: true, force: true });
mkdirSync(svgDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.INSERT && window.INSERT.ready);
await page.evaluate(() => window.INSERT.ready);
const meta = await page.evaluate(() => ({
  frames: window.INSERT.frames, width: window.INSERT.width, height: window.INSERT.height,
}));
await page.setViewportSize({ width: meta.width, height: meta.height });
console.log(`${name}: ${meta.frames} vector frames, ${meta.width}x${meta.height} design box`);

// The in-page serialiser — walks INSERT.scene, projects through INSERT.camera.
const serialiser = (frame) => {
  const S = window.INSERT.scene, cam = window.INSERT.camera;
  const W = window.INSERT.width, H = window.INSERT.height, ff = window.INSERT.fadeFrames || 10;
  const vm = cam.matrixWorldInverse.elements, pm = cam.projectionMatrix.elements;
  const mul = (e, x, y, z, w) => [
    e[0]*x + e[4]*y + e[8]*z + e[12]*w, e[1]*x + e[5]*y + e[9]*z + e[13]*w,
    e[2]*x + e[6]*y + e[10]*z + e[14]*w, e[3]*x + e[7]*y + e[11]*z + e[15]*w];
  const faces = [], strokes = [];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  function walk(obj) {
    if (obj.visible === false) return;
    const g = obj.geometry, m = obj.material;
    if (g && m && g.attributes && g.attributes.position) {
      const mw = obj.matrixWorld.elements, arr = g.attributes.position.array;
      const n = g.attributes.position.count, op = m.opacity === undefined ? 1 : m.opacity;
      if (op > 0.008) {
        const col = m.color ? ('#' + m.color.getHexString()) : '#e5e0d4';
        const wp = i => {
          const w = mul(mw, arr[i*3], arr[i*3+1], arr[i*3+2], 1);
          const v = mul(vm, w[0], w[1], w[2], 1);
          const c = mul(pm, v[0], v[1], v[2], v[3]);
          return { x: (c[0]/c[3]*0.5 + 0.5)*W, y: (-c[1]/c[3]*0.5 + 0.5)*H, w: c[3], vz: v[2] };
        };
        if (obj.isMesh) {
          const idx = g.index ? g.index.array : null, cnt = idx ? idx.length : n;
          for (let t = 0; t + 2 < cnt; t += 3) {
            const a = wp(idx ? idx[t] : t), b = wp(idx ? idx[t+1] : t+1), c = wp(idx ? idx[t+2] : t+2);
            if (a.w <= 0 || b.w <= 0 || c.w <= 0) continue;
            faces.push({ z: (a.vz + b.vz + c.vz) / 3, s:
              `<polygon points="${a.x.toFixed(2)},${a.y.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)} ${c.x.toFixed(2)},${c.y.toFixed(2)}" fill="${col}" fill-opacity="${op.toFixed(3)}"/>` });
          }
        } else if (obj.isLineSegments) {
          const stroke = m.vertexColors ? '#1b211f' : col, sw = m.vertexColors ? 1 : 1.4;
          for (let i = 0; i + 1 < n; i += 2) {
            const a = wp(i), b = wp(i + 1);
            if (a.w <= 0 || b.w <= 0) continue;
            strokes.push(`<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${stroke}" stroke-opacity="${op.toFixed(3)}" stroke-width="${sw}"/>`);
          }
        } else if (obj.isLine) {
          let d = '';
          for (let i = 0; i < n; i++) { const a = wp(i); if (a.w <= 0) { d = ''; break; } d += (d ? ' L' : 'M') + a.x.toFixed(2) + ' ' + a.y.toFixed(2); }
          if (d) strokes.push(`<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${op.toFixed(3)}" stroke-width="1.4" stroke-linejoin="round"/>`);
        }
      }
    }
    for (const ch of obj.children) walk(ch);
  }
  walk(S);
  faces.sort((p, q) => p.z - q.z);  // farthest first (view z is negative in front)

  const texts = [];
  for (const el of document.querySelectorAll('.svgtxt')) {
    const cs = getComputedStyle(el), op = parseFloat(cs.opacity);
    if (op < 0.01) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    const fs = parseFloat(cs.fontSize);
    const blw = parseFloat(cs.borderLeftWidth) || 0, pl = parseFloat(cs.paddingLeft) || 0;
    let anchor = el.dataset.svgAnchor || 'start', x;
    if (blw > 0) {
      anchor = 'start'; x = r.left + blw + pl;
      texts.push(`<rect x="${r.left.toFixed(1)}" y="${r.top.toFixed(1)}" width="${blw.toFixed(1)}" height="${r.height.toFixed(1)}" fill="${cs.borderLeftColor}" fill-opacity="${op.toFixed(3)}"/>`);
    } else x = anchor === 'middle' ? r.left + r.width / 2 : r.left;
    const by = r.top + r.height / 2 + fs * 0.34;  // approx vertical-centre baseline
    let txt = el.textContent;
    if (cs.textTransform === 'uppercase') txt = txt.toUpperCase();
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing);
    texts.push(`<text x="${x.toFixed(1)}" y="${by.toFixed(1)}" fill="${cs.color}" fill-opacity="${op.toFixed(3)}" font-family="${esc(cs.fontFamily)}" font-size="${fs.toFixed(1)}" font-weight="${cs.fontWeight}" letter-spacing="${ls}" text-anchor="${anchor}">${esc(txt)}</text>`);
  }

  const fade = Math.min(1, frame / ff, (window.INSERT.frames - 1 - frame) / ff);
  const overlay = 1 - fade;
  const fadeRect = overlay > 0.001
    ? `<rect width="${W}" height="${H}" fill="#000" fill-opacity="${overlay.toFixed(3)}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + `<rect width="${W}" height="${H}" fill="#000000"/>`
    + faces.map(f => f.s).join('') + strokes.join('') + texts.join('') + fadeRect + `</svg>`;
};

for (let f = 0; f < meta.frames; f++) {
  await page.evaluate(n => window.INSERT.seek(n), f);
  const svg = await page.evaluate(serialiser, f);
  writeFileSync(join(svgDir, `${name}_${String(f).padStart(4, '0')}.svg`), svg);
  if (f % 50 === 0 || f === meta.frames - 1) process.stdout.write(`  frame ${f + 1}/${meta.frames}\r`);
}
console.log();
await browser.close();
if (errors.length) { console.error('PAGE ERRORS:', errors); process.exit(1); }

const zipPath = join(outDir, `${name}_vector_svg.zip`);
rmSync(zipPath, { force: true });
execFileSync('zip', ['-jrq', zipPath, svgDir]);
const bytes = statSync(zipPath).size, count = readdirSync(svgDir).length;
console.log(`wrote ${count} SVGs → ${zipPath} (${(bytes/1e6).toFixed(1)} MB)`);
console.log('EXACT ✓ ' + count + ' frames (expected ' + meta.frames + ')');
if (count !== meta.frames) { console.error('FRAME COUNT MISMATCH'); process.exit(1); }
