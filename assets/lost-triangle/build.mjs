// Transpile the Lost Triangle JSX sources to browser JS (JSX -> React.createElement).
// Dev-only: requires `npm install --no-save @babel/standalone`. Outputs are committed.
// Classic runtime on purpose: the page loads React as a UMD global (no bundler).
import babel from '@babel/standalone';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const outDir = process.env.OUT_DIR || dir;
const HEADER = [
  '// GENERATED — do not edit by hand.',
  '// Transpiled (Babel preset-react, classic runtime) from the JSX source.',
  '// Source of truth: animations.jsx / LostTriangleVideoClean.jsx. See README.md.',
  '',
].join('\n');
for (const [src, out] of [['animations.jsx','animations.js'], ['LostTriangleVideoClean.jsx','lost-triangle-video.js'], ['LostTriangleMarried.jsx','lost-triangle-married.js']]) {
  const code = fs.readFileSync(path.join(dir, src), 'utf8');
  const res = babel.transform(code, { presets: [['react', { runtime: 'classic' }]], compact: false });
  fs.writeFileSync(path.join(outDir, out), HEADER + res.code);
  console.log(`${src} -> ${out} (${res.code.length} bytes, createElement x${(res.code.match(/createElement/g)||[]).length})`);
}
