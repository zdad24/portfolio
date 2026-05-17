/**
 * Converts public/*.svg → public/*.png using @resvg/resvg-js (WASM, no system deps).
 * Run once: node scripts/gen-og.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';

const assets = [
  { src: 'public/og.svg', out: 'public/og.png', width: 1200, height: 630 },
  {
    src: 'public/apple-touch-icon.svg',
    out: 'public/apple-touch-icon.png',
    width: 180,
    height: 180,
  },
];

for (const { src, out, width, height } of assets) {
  const svg = readFileSync(src, 'utf8');
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width }, background: '#1a1510' });
  const rendered = resvg.render();
  const png = rendered.asPng();
  writeFileSync(out, png);
  console.log(`✓ ${out} (${width}×${height}, ${(png.length / 1024).toFixed(0)} KB)`);
}
