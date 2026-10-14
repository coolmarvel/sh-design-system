---
title: 소비 프로젝트에서 sh-classic 쓰기
created: 2026-10-13
updated: 2026-10-13
domain: usage
---

# 소비 프로젝트에서 sh-classic 쓰기

## 개요

다른 프로젝트가 이 레퍼런스를 가져가 같은 클래식 UI 를 만드는 방법이다. 설치 명령은 `bin/sh-ds.mjs`.

## 설치

```bash
npx -y github:coolmarvel/sh-design-system init --platform <플랫폼[,플랫폼]> [--theme <테마>] [--dir .]
npx -y github:coolmarvel/sh-design-system update     # sh-ds.json 구성 그대로 새 버전 반영
npx -y github:coolmarvel/sh-design-system list       # 테마·플랫폼 목록
```

결과: 루트 `DESIGN.md`(없을 때만 생성, 이후 프로젝트 소유), `.claude/data/references/sh-classic/DESIGN.md`(원본, 매번 갱신),
`design-tokens/<플랫폼>/`, `sh-ds.json`.

## 플랫폼별 연결

| 스택 | 플랫폼 | 연결 |
|---|---|---|
| 웹·Electron (CSS) | `css` | `tokens.css` 다음에 `sh-classic.css`(부품) 로드, 최상위에 `class="sh-root"` |
| Tailwind v4 | `tailwind4` | `@import "tailwindcss"; @import "./design-tokens/tailwind4/theme.css";` -> `bg-canvas`, `border-border-strong` ... |
| Tailwind v3 | `tailwind3` + `css` | `presets: [require('./design-tokens/tailwind3/preset.cjs')]` + tokens.css 로드 |
| SCSS / LESS | `scss` / `less` | `@use 'design-tokens/scss/tokens'` / `@import` |
| JS/TS (MUI 테마 등) | `js` | `import * as sh from './design-tokens/js/tokens.js'` (타입 `tokens.d.ts`) |
| WPF | `wpf` | `App.xaml` 의 `MergedDictionaries` 에 `ShTokens.xaml`. 브러시는 `{StaticResource ShColorAccentBrush}` |
| Avalonia | `avalonia` | `App.axaml` `<ResourceInclude Source="avares://앱/design-tokens/avalonia/ShTokens.axaml"/>`. 글꼴은 `ShFontFamilyUiSkia` |
| iOS / Android / Compose / Flutter | `ios` · `android` · `compose` · `flutter` | 색·치수·글꼴 이름만. 그라데이션·그림자는 DESIGN.md 계약대로 직접 |
| 기타 토큰 도구 | `dtcg` | W3C DTCG JSON (Tokens Studio·Terrazzo 등) |

XAML 키 규칙: `Sh` + 토큰 경로 PascalCase. 색은 `ShColorX`(Color) + `ShColorXBrush`, 그라데이션은 `ShGradientXBrush`,
치수는 `Double`. WPF·Avalonia 부품 스타일(ControlTheme)은 DESIGN.md 4절을 보고 각 프로젝트가 만든다.

## 에이전트에게 지시하기

> DESIGN.md(sh-classic)를 따라 UI 를 만들어. 색·크기는 design-tokens 의 값만 쓰고, 부품은 DESIGN.md 4절 계약대로.
> 프로젝트 전용 규칙은 루트 DESIGN.md 아래쪽에 덧붙이고, 원본 레퍼런스는 고치지 마.

## 관련 코드

- `bin/sh-ds.mjs` - 설치·갱신
- `components/css/sh-classic.css` - 웹 부품
