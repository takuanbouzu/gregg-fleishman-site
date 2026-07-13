#!/usr/bin/env node
// Render an insert page to an exact-frame-count master.
//
//   node render_insert.mjs <insert-url> <out-dir> [--name INS_XX] [--prores]
//
// Drives the page's window.INSERT deterministic clock (see
// 02_INSERTS/shared/insert-contract.md) frame by frame with Playwright,
// screenshots each frame, then encodes at exactly 30000/1001 fps with ffmpeg
// and verifies the packaged frame count matches INSERT.frames.
//
// Requires: a local static server at the repo root (python3 -m http.server),
// ffmpeg/ffprobe on PATH, Playwright (pre-installed in this environment).

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const url = args[0], outDir = args[1];
if (!url || !outDir) {
  console.error('usage: node render_insert.mjs <insert-url> <out-dir> [--name INS_XX] [--prores]');
  process.exit(2);
}
const name = args.includes('--name') ? args[args.indexOf('--name') + 1] : 'insert';
const prores = args.includes('--prores');

const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')
  .catch(async () => (await import('playwright')));

const framesDir = join(outDir, `${name}_frames`);
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.INSERT && window.INSERT.ready);
await page.evaluate(() => window.INSERT.ready);
const meta = await page.evaluate(() => ({
  fps: window.INSERT.fps, frames: window.INSERT.frames,
  width: window.INSERT.width, height: window.INSERT.height,
}));
await page.setViewportSize({ width: meta.width, height: meta.height });
console.log(`${name}: ${meta.frames} frames @ 30000/1001 fps, ${meta.width}x${meta.height}`);

for (let f = 0; f < meta.frames; f++) {
  await page.evaluate(n => window.INSERT.seek(n), f);
  await page.screenshot({ path: join(framesDir, `frame_${String(f).padStart(5, '0')}.png`) });
  if (f % 50 === 0 || f === meta.frames - 1) process.stdout.write(`  frame ${f + 1}/${meta.frames}\r`);
}
console.log();
await browser.close();
if (errors.length) { console.error('PAGE ERRORS:', errors); process.exit(1); }

const out = join(outDir, prores ? `${name}_master.mov` : `${name}_master.mp4`);
const codec = prores
  ? ['-c:v', 'prores_ks', '-profile:v', '3', '-pix_fmt', 'yuv422p10le']
  : ['-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p'];
execFileSync('ffmpeg', ['-y', '-framerate', '30000/1001',
  '-i', join(framesDir, 'frame_%05d.png'), ...codec, out], { stdio: 'inherit' });

const nb = execFileSync('ffprobe', ['-v', 'error', '-count_frames',
  '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames',
  '-of', 'csv=p=0', out]).toString().trim();
const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries',
  'format=duration', '-of', 'csv=p=0', out]).toString().trim();
console.log(`encoded: ${out}\nframes in file: ${nb} (expected ${meta.frames}) — duration ${dur}s`);
if (Number(nb) !== meta.frames) { console.error('FRAME COUNT MISMATCH'); process.exit(1); }
console.log('EXACT ✓');
