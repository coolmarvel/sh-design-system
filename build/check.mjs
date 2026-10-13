// 검증 — 파일을 고치지 않고 어긋남만 잡는다. 실패하면 exit 1.
// 1) dist/ 가 tokens/ 로 다시 빌드한 결과와 같은가  2) DESIGN.md 머리말이 토큰과 같은가
// 3) 쇼케이스·DESIGN.md 가 존재하지 않는 CSS 변수를 쓰지 않는가  4) 대비(WCAG) 최소 기준
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const errors = [];
const walk = (d) =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

// 1) dist 신선도
const tmp = mkdtempSync(join(tmpdir(), 'shds-'));
execFileSync(process.execPath, ['build/build.mjs'], { env: { ...process.env, SH_OUT: tmp }, stdio: 'pipe' });
const fresh = walk(tmp)
  .map((f) => relative(tmp, f))
  .sort();
const cur = existsSync('dist')
  ? walk('dist')
      .map((f) => relative('dist', f))
      .sort()
  : [];
for (const f of new Set([...fresh, ...cur])) {
  const a = existsSync(join(tmp, f)) ? readFileSync(join(tmp, f), 'utf8') : null;
  const b = existsSync(join('dist', f)) ? readFileSync(join('dist', f), 'utf8') : null;
  if (a !== b) errors.push(`dist/${f} 가 토큰과 어긋남 — npm run build`);
}

// 2) DESIGN.md 머리말
process.env.SH_OUT = tmp;
const { renderFrontmatter, DESIGN_MD } = await import('./omd.mjs');
const md = readFileSync(DESIGN_MD, 'utf8');
if (renderFrontmatter(md) !== md) errors.push(`${DESIGN_MD} 머리말이 토큰과 어긋남 — npm run build`);

// 3) CSS 변수 참조
const defined = new Set(
  [...readFileSync(join(tmp, 'classic/css/tokens.css'), 'utf8').matchAll(/(--sh-[\w-]+)\s*:/g)].map((m) => m[1]),
);
const users = [
  DESIGN_MD,
  ...['showcase', 'components'].filter(existsSync).flatMap((d) => walk(d).filter((f) => /\.(html|css|js)$/.test(f))),
];
for (const f of users) {
  const src = readFileSync(f, 'utf8');
  const localDefs = new Set([...src.matchAll(/(--sh-[\w-]+)\s*:/g)].map((m) => m[1]));
  for (const m of src.matchAll(/var\((--sh-[\w-]+)/g))
    if (!defined.has(m[1]) && !localDefs.has(m[1])) errors.push(`${f}: 정의되지 않은 ${m[1]}`);
  for (const m of src.matchAll(/`(--sh-[\w-]+)`/g)) if (!defined.has(m[1])) errors.push(`${f}: 정의되지 않은 ${m[1]}`);
}

// 4) 대비 — tokens/contrast.json 의 [글자, 바탕, 최소비] 쌍을 모든 테마에서 확인
const lum = (hex) => {
  const h = hex.replace('#', '').slice(0, 6);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
if (existsSync('tokens/contrast.json')) {
  const pairs = JSON.parse(readFileSync('tokens/contrast.json', 'utf8')).pairs;
  for (const theme of readdirSync(tmp).filter((f) => !f.endsWith('.json'))) {
    const c = JSON.parse(readFileSync(join(tmp, theme, 'js/tokens.json'), 'utf8')).color;
    for (const [fg, bg, min] of pairs) {
      const get = (k) => k.split('.').reduce((o, p) => o?.[p], c);
      const [f, b] = [get(fg), get(bg)];
      if (typeof f !== 'string' || typeof b !== 'string') {
        errors.push(`contrast.json: 없는 색 ${typeof f === 'string' ? bg : fg}`);
        continue;
      }
      const r = ratio(f, b);
      if (r < min) errors.push(`[${theme}] 대비 부족 color.${fg} / color.${bg} = ${r.toFixed(2)} < ${min}`);
    }
  }
}

rmSync(tmp, { recursive: true, force: true });
if (errors.length) {
  console.error('✗ check 실패\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('✓ check 통과 — dist·DESIGN.md·CSS 변수·대비 모두 일치');
