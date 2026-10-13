#!/usr/bin/env node
// sh-ds — 소비 프로젝트에 sh-classic 레퍼런스를 설치·갱신한다. 의존성 없음(node 내장만).
//
//   npx -y github:coolmarvel/sh-design-system init --platform css,wpf [--theme classic] [--dir .]
//   npx -y github:coolmarvel/sh-design-system update        # sh-ds.json 에 적힌 구성 그대로 다시 복사
//   npx -y github:coolmarvel/sh-design-system list          # 테마·플랫폼 목록
//
// 설치 결과 (소비 프로젝트 기준):
//   DESIGN.md                                   ← references/sh-classic/DESIGN.md (프로젝트 계약의 출발점)
//   .claude/data/references/sh-classic/DESIGN.md ← omd 스킬이 레퍼런스로 찾는 위치 (원본 그대로, 수정 금지)
//   design-tokens/<플랫폼>/…                    ← dist/<테마>/<플랫폼>/… (css 는 부품 CSS sh-classic.css 포함)
//   sh-ds.json                                  ← 설치 구성·버전 기록 (update 가 읽음)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const themes = JSON.parse(readFileSync(join(ROOT, 'dist/themes.json'), 'utf8')).map((t) => t.id);
const platforms = readdirSync(join(ROOT, 'dist/classic'));

const args = process.argv.slice(2);
const cmd = args[0] ?? 'help';
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};

function install({ dir, theme, platforms: want, keepDesign }) {
  if (!themes.includes(theme)) throw new Error(`없는 테마: ${theme} (가능: ${themes.join(', ')})`);
  for (const p of want) if (!platforms.includes(p)) throw new Error(`없는 플랫폼: ${p} (가능: ${platforms.join(', ')})`);
  const ref = join(ROOT, 'references/sh-classic/DESIGN.md');
  const omdRef = join(dir, '.claude/data/references/sh-classic');
  mkdirSync(omdRef, { recursive: true });
  copyFileSync(ref, join(omdRef, 'DESIGN.md'));
  const design = join(dir, 'DESIGN.md');
  if (keepDesign && existsSync(design)) console.log('· DESIGN.md 는 프로젝트 소유 — 덮어쓰지 않음 (레퍼런스 원본은 .claude/data/references/sh-classic/)');
  else {
    copyFileSync(ref, design);
    console.log('· DESIGN.md 생성 (sh-classic 원본 복사 — 이제 프로젝트 소유)');
  }
  for (const p of want) {
    cpSync(join(ROOT, 'dist', theme, p), join(dir, 'design-tokens', p), { recursive: true });
    console.log(`· design-tokens/${p}/ ← dist/${theme}/${p}/`);
  }
  if (want.includes('css')) {
    copyFileSync(join(ROOT, 'components/css/sh-classic.css'), join(dir, 'design-tokens/css/sh-classic.css'));
    console.log('· design-tokens/css/sh-classic.css ← 부품 CSS (tokens.css 다음에 로드)');
  }
  writeFileSync(
    join(dir, 'sh-ds.json'),
    JSON.stringify({ reference: 'sh-classic', version: pkg.version, theme, platforms: want }, null, 2) + '\n',
  );
  console.log(`✓ sh-design-system ${pkg.version} (테마 ${theme}) 설치 완료 → ${dir}`);
}

try {
  if (cmd === 'init') {
    const want = (opt('platform', '') || '').split(',').filter(Boolean);
    if (!want.length) throw new Error(`--platform 이 필요하다 (예: css 또는 wpf,avalonia). 가능: ${platforms.join(', ')}`);
    install({ dir: resolve(opt('dir', '.')), theme: opt('theme', 'classic'), platforms: want, keepDesign: true });
  } else if (cmd === 'update') {
    const dir = resolve(opt('dir', '.'));
    const conf = JSON.parse(readFileSync(join(dir, 'sh-ds.json'), 'utf8'));
    install({ dir, theme: conf.theme, platforms: conf.platforms, keepDesign: true });
  } else if (cmd === 'list') {
    console.log(`테마: ${themes.join(', ')}\n플랫폼: ${platforms.join(', ')}`);
  } else {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 14).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  }
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
