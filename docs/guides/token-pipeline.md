---
title: 토큰 빌드 파이프라인
created: 2026-10-13
updated: 2026-10-13
domain: development
---

# 토큰 빌드 파이프라인

## 개요

`tokens/` 의 DTCG JSON 한 벌에서 모든 플랫폼 파일과 DESIGN.md 머리말 값을 만든다. 값은 한 곳에서만 바꾼다.

## 동작 방식

1. `build/build.mjs` 가 테마마다 Style Dictionary 를 돌린다. 베이스(`tokens/base/**`)는 `include`, 테마 파일은 `source`
   라서 테마 값이 경고 없이 베이스를 덮는다. 그라데이션은 `{color.chrome.*}` 참조라 스킨을 바꾸면 띠 색도 따라간다.
2. 출력: `dist/<테마>/{css,scss,less,js,tailwind3,tailwind4,dtcg,wpf,avalonia,ios,android,compose,flutter}` + `dist/themes.json`.
3. 마지막에 `build/omd.mjs` 가 `references/sh-classic/DESIGN.md` 머리말의 `tokens:`(베이스)와 `themes:`(테마별 차이)를 다시 쓴다.
   `yaml` 의 Document API 를 써서 나머지 머리말의 주석·순서는 보존한다.
4. `build/check.mjs` 는 임시 폴더로 다시 빌드해 `dist/` 와 바이트 비교하고, DESIGN.md 머리말 일치, 쇼케이스·부품 CSS·DESIGN.md 의
   `--sh-*` 참조 존재, `tokens/contrast.json` 대비 쌍을 모든 테마에서 확인한다.

변환 규칙: CSS 계열은 `--sh-` 접두 kebab, 그라데이션 → `linear-gradient(to bottom, …)`, 모바일은 px 를 dp/pt 로 1:1(글자는 sp),
모바일 글꼴은 목록의 첫 이름만.

## 관련 코드

- `build/build.mjs` — 플랫폼 목록 `platforms()`, 모바일 변환
- `build/formats/xaml.mjs` · `tailwind.mjs` · `dtcg.mjs` — 커스텀 포맷
- `build/omd.mjs` — DESIGN.md 머리말
- `build/check.mjs` — 검증
