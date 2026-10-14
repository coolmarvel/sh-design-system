// references/sh-classic/DESIGN.md 의 YAML 머리말 중 `tokens:` 와 `themes:` 를 dist 결과로 다시 쓴다.
// 본문(계약)은 사람이 쓰고, 값은 tokens/*.json 이 SSOT - 머리말 값을 손으로 고치지 않는다.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { parseDocument } from 'yaml';

export const DESIGN_MD = 'references/sh-classic/DESIGN.md';

const flat = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flat(v, [...prefix, k]) : [[[...prefix, k].join('-'), v]],
  );

const load = (theme) => JSON.parse(readFileSync(`${process.env.SH_OUT ?? 'dist'}/${theme}/js/tokens.json`, 'utf8'));

export function omdTokens(t) {
  const group = (k) => (t[k] ? Object.fromEntries(flat(t[k])) : undefined);
  return {
    source: 'tokens/base/*.json (sh-design-system SSOT) - npm run build 가 생성',
    colors: group('color'),
    gradients: group('gradient'),
    typography: group('font'),
    spacing: group('space'),
    sizes: group('size'),
    rounded: group('radius'),
    borders: group('border'),
    shadows: group('shadow'),
    motion: group('motion'),
  };
}

// 테마는 베이스와 값이 다른 토큰만 적는다.
export function themeDiffs() {
  const base = Object.fromEntries(flat(load('classic')));
  const themes = readdirSync('tokens/themes')
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -5));
  return Object.fromEntries(
    themes.map((th) => {
      const raw = JSON.parse(readFileSync(`tokens/themes/${th}.json`, 'utf8'));
      const diff = Object.fromEntries(flat(load(th)).filter(([k, v]) => base[k] !== v));
      return [th, { description: raw.$description ?? '', tokens: diff }];
    }),
  );
}

export function renderFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${DESIGN_MD}: YAML 머리말이 없다`);
  const doc = parseDocument(m[1]);
  const tokens = Object.fromEntries(Object.entries(omdTokens(load('classic'))).filter(([, v]) => v !== undefined));
  doc.set('tokens', tokens);
  doc.set('themes', themeDiffs());
  const yaml = doc.toString({ lineWidth: 0 });
  return `---\n${yaml}---\n` + src.slice(m[0].length);
}

export async function writeOmdFrontmatter() {
  const src = readFileSync(DESIGN_MD, 'utf8');
  writeFileSync(DESIGN_MD, renderFrontmatter(src));
}
