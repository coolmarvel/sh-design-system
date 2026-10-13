// 토큰 빌드 — tokens/base/*.json (+ tokens/themes/<테마>.json 덮어쓰기) → dist/<테마>/<플랫폼>/…
// 새 플랫폼 추가 = platforms() 에 항목 하나 + (필요하면) build/formats/ 에 포맷 하나.
import StyleDictionary from 'style-dictionary';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { wpfFormat, avaloniaFormat } from './formats/xaml.mjs';
import { tailwindFormat, tailwindV4Format } from './formats/tailwind.mjs';
import { dtcgFormat } from './formats/dtcg.mjs';
import { writeOmdFrontmatter } from './omd.mjs';

const BASE_THEME = 'classic';
const OUT = process.env.SH_OUT ?? 'dist'; // check 가 임시 폴더로 빌드해 dist 와 비교한다
const themes = [
  BASE_THEME,
  ...readdirSync('tokens/themes')
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, '')),
];

// gradient → CSS linear-gradient
StyleDictionary.registerTransform({
  name: 'sh/gradient/css',
  type: 'value',
  transitive: true,
  filter: (t) => (t.$type ?? t.type) === 'gradient',
  transform: (t) => {
    const stops = (t.$value ?? t.value).map((s) => `${s.color} ${Math.round(s.position * 100)}%`);
    return `linear-gradient(to bottom, ${stops.join(', ')})`;
  },
});
// 모바일 플랫폼 — 클래식 데스크톱 기준 단위 px 를 1:1 로 dp/pt 로 옮긴다. 글자 크기는 sp.
// 글꼴은 목록의 첫 이름만(모바일엔 대체 목록 문법이 없다) 따옴표 문자열로.
const typeOf = (t) => t.$type ?? t.type;
const n = (t) => parseFloat(String(t.$value ?? t.value));
const isFontSize = (t) => t.path[0] === 'font' && t.path[1] === 'size';
const firstFamily = (t) => {
  const v = t.$value ?? t.value;
  return (Array.isArray(v) ? v[0] : String(v).split(',')[0]).trim();
};
const mobile = {
  swift: { dim: (t) => `CGFloat(${n(t)})`, num: (t) => `CGFloat(${n(t)})`, font: (t) => `"${firstFamily(t)}"` },
  android: { dim: (t) => `${n(t)}${isFontSize(t) ? 'sp' : 'dp'}`, num: (t) => `${n(t)}`, font: (t) => firstFamily(t) },
  compose: {
    dim: (t) => `${n(t)}.${isFontSize(t) ? 'sp' : 'dp'}`,
    num: (t) => `${n(t)}f`,
    font: (t) => `"${firstFamily(t)}"`,
  },
  flutter: { dim: (t) => `${n(t).toFixed(1)}`, num: (t) => `${n(t).toFixed(1)}`, font: (t) => `"${firstFamily(t)}"` },
};
for (const [lang, f] of Object.entries(mobile)) {
  StyleDictionary.registerTransform({
    name: `sh/${lang}/dimension`,
    type: 'value',
    transitive: true,
    filter: (t) => typeOf(t) === 'dimension',
    transform: f.dim,
  });
  StyleDictionary.registerTransform({
    name: `sh/${lang}/number`,
    type: 'value',
    transitive: true,
    filter: (t) => ['number', 'fontWeight', 'duration'].includes(typeOf(t)),
    transform: f.num,
  });
  StyleDictionary.registerTransform({
    name: `sh/${lang}/font`,
    type: 'value',
    transitive: true,
    filter: (t) => typeOf(t) === 'fontFamily',
    transform: f.font,
  });
}
const mob = (lang) => [`sh/${lang}/dimension`, `sh/${lang}/number`, `sh/${lang}/font`];

for (const f of [wpfFormat, avaloniaFormat, tailwindFormat, tailwindV4Format, dtcgFormat])
  StyleDictionary.registerFormat(f);

const cssTransforms = [
  'attribute/cti',
  'name/kebab',
  'fontFamily/css',
  'shadow/css/shorthand',
  'color/css',
  'sh/gradient/css',
];
// 모바일 출력은 그라데이션·그림자·선 스타일을 뺀다 (네이티브 리소스 대응이 없다 — DESIGN.md 계약을 따른다)
const noGradient = (t) =>
  !['gradient', 'shadow', 'strokeStyle', 'cubicBezier', 'transition'].includes(t.$type ?? t.type);

const platforms = (dir) => ({
  css: {
    transforms: cssTransforms,
    prefix: 'sh',
    buildPath: `${dir}/css/`,
    files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: false } }],
  },
  scss: {
    transforms: cssTransforms,
    prefix: 'sh',
    buildPath: `${dir}/scss/`,
    files: [{ destination: '_tokens.scss', format: 'scss/variables' }],
  },
  less: {
    transforms: cssTransforms,
    prefix: 'sh',
    buildPath: `${dir}/less/`,
    files: [{ destination: 'tokens.less', format: 'less/variables' }],
  },
  js: {
    transforms: ['attribute/cti', 'name/camel', 'fontFamily/css', 'shadow/css/shorthand', 'sh/gradient/css'],
    buildPath: `${dir}/js/`,
    files: [
      { destination: 'tokens.js', format: 'javascript/es6' },
      { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      { destination: 'tokens.json', format: 'json/nested' },
    ],
  },
  tailwind3: {
    transforms: ['attribute/cti', 'name/kebab'],
    buildPath: `${dir}/tailwind3/`,
    files: [{ destination: 'preset.cjs', format: 'tailwind/preset' }],
  },
  tailwind4: {
    transforms: cssTransforms,
    buildPath: `${dir}/tailwind4/`,
    files: [{ destination: 'theme.css', format: 'tailwind/v4' }],
  },
  dtcg: {
    transforms: ['attribute/cti', 'name/kebab'],
    buildPath: `${dir}/dtcg/`,
    files: [{ destination: 'tokens.json', format: 'json/dtcg' }],
  },
  wpf: {
    transforms: ['attribute/cti', 'name/pascal'],
    buildPath: `${dir}/wpf/`,
    files: [{ destination: 'ShTokens.xaml', format: 'xaml/wpf' }],
  },
  avalonia: {
    transforms: ['attribute/cti', 'name/pascal'],
    buildPath: `${dir}/avalonia/`,
    files: [{ destination: 'ShTokens.axaml', format: 'xaml/avalonia' }],
  },
  ios: {
    transforms: ['attribute/cti', 'name/camel', 'color/UIColorSwift', ...mob('swift')],
    buildPath: `${dir}/ios/`,
    files: [
      {
        destination: 'ShTokens.swift',
        format: 'ios-swift/enum.swift',
        options: { className: 'ShTokens' },
        filter: noGradient,
      },
    ],
  },
  android: {
    transforms: ['attribute/cti', 'name/snake', 'color/hex8android', ...mob('android')],
    buildPath: `${dir}/android/`,
    files: [{ destination: 'sh_tokens.xml', format: 'android/resources', filter: noGradient }],
  },
  compose: {
    transforms: ['attribute/cti', 'name/camel', 'color/composeColor', ...mob('compose')],
    buildPath: `${dir}/compose/`,
    files: [
      {
        destination: 'ShTokens.kt',
        format: 'compose/object',
        options: { className: 'ShTokens', packageName: 'sh.design' },
        filter: noGradient,
      },
    ],
  },
  flutter: {
    transforms: ['attribute/cti', 'name/camel', 'color/hex8flutter', ...mob('flutter')],
    buildPath: `${dir}/flutter/`,
    files: [
      {
        destination: 'sh_tokens.dart',
        format: 'flutter/class.dart',
        options: { className: 'ShTokens' },
        filter: noGradient,
      },
    ],
  },
});

// 폴더 자체는 남기고 내용만 비운다 — 도커 bind mount 가 지워진 폴더를 계속 가리키지 않게
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) rmSync(`${OUT}/${f}`, { recursive: true, force: true });
for (const theme of themes) {
  const sd = new StyleDictionary({
    include: ['tokens/base/**/*.json'],
    source: theme === BASE_THEME ? [] : [`tokens/themes/${theme}.json`],
    usesDtcg: true,
    log: { verbosity: process.env.SH_VERBOSE ? 'verbose' : 'default', warnings: 'error' },
    platforms: platforms(`${OUT}/${theme}`),
  });
  await sd.buildAllPlatforms();
}
// 쇼케이스 테마 선택기가 읽는 목록
const themeList = themes.map((id) => ({
  id,
  description:
    id === BASE_THEME
      ? '베이스 — sh-classic'
      : (JSON.parse(readFileSync(`tokens/themes/${id}.json`, 'utf8')).$description ?? ''),
}));
writeFileSync(`${OUT}/themes.json`, JSON.stringify(themeList, null, 2) + '\n');
if (OUT === 'dist') await writeOmdFrontmatter();
console.log(`빌드 완료: ${themes.join(', ')}`);
