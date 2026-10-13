---
title: ADR-0002 저장소 형태·토큰 스택
created: 2026-10-13
status: accepted
---

# ADR-0002: omd 호환 DESIGN.md + DTCG 토큰 SSOT + Style Dictionary 다중 플랫폼 생성

## 상태

Accepted (2026-10-13 킥오프 위저드에서 사용자 확정)

## 맥락

이성현의 데스크톱·웹 프로젝트(sh-messenger, sh-compositor, sh-econsent, sh-form-designer, sh-web-editor,
remote-assist, pdf-editor(-live), file-converter …)는 모두 "클래식 UI"를 지향하지만 프로젝트마다 DESIGN.md
와 토큰을 따로 정해 결과가 제각각이다. 스택도 Electron/React(CSS), 바닐라 TS, WPF, Avalonia 로 섞여 있다.
oh-my-design(omd)의 브랜드 레퍼런스처럼 **"내 레퍼런스"** 하나를 두고 모든 프로젝트가 그것을 불러 쓰게 한다.

## 결정

| 항목 | 결정 |
|---|---|
| 유형 | 디자인 시스템 레퍼런스 저장소 — 새 프로젝트가 불러 씀 |
| 계약 문서 | `references/sh-classic/DESIGN.md` — omd 0.1 레퍼런스 형식(YAML 머리말 + 16절 본문) |
| 토큰 SSOT | `tokens/base/*.json` — W3C DTCG 형식(`$type`/`$value`). 변형은 `tokens/themes/<이름>.json` 덮어쓰기 |
| 생성기 | Style Dictionary **5.5.5** (npm, 정확 버전 고정) + 커스텀 포맷(WPF·Avalonia XAML, Tailwind 프리셋, omd 머리말) |
| 출력 | `dist/<테마>/` 에 CSS 변수 · SCSS · LESS · JS/TS/JSON · Tailwind · WPF · Avalonia · iOS Swift · Android XML · Compose · Flutter |
| 미리보기 | `showcase/` 정적 HTML(프레임워크 없음) — 도커 nginx 로 `http://localhost:8083` |
| DB | 없음 — 파일 기반 |
| 디자인 방향 | 베이스 = 기존 프로젝트들의 클래식 UI 를 통합한 `sh-classic`. 외부 브랜드 베이스 없음 |
| 패키지 매니저 | npm |

`dist/` 는 커밋한다 — 소비 프로젝트가 빌드 없이 GitHub 에서 파일을 가져가게 하기 위함이다. 대신 `npm run check`
가 "tokens 로 다시 빌드한 결과 = 커밋된 dist" 를 강제한다.

## 근거

- **omd 형식 유지**: 소비 프로젝트에는 이미 omd 스킬(`/omd:apply`·`/omd:slop-audit` 등)이 깔린다. 같은 형식이면
  `DESIGN.md` 를 복사하는 것만으로 그 스킬들이 sh-classic 을 기준으로 동작한다.
- **DTCG + Style Dictionary**: 위저드 후보는 Style Dictionary / 자체 TS 생성기 / Terrazzo.
  Style Dictionary 는 CSS·SCSS·JS·iOS·Android·Compose·Flutter 를 내장하고 포맷 등록 API 로 XAML 을 붙일 수
  있어 "새 플랫폼 = 포맷 하나 추가"라는 확장 요구를 그대로 만족한다. 자체 생성기는 플랫폼마다 출력기를 손으로
  짜야 하고, Terrazzo 는 XAML 지원과 플러그인 생태계가 작다.
- **v5 사용**: 위저드에서는 "v4"로 제시했지만 2026-10 현재 최신 메이저는 v5 이고 DTCG 사용 API 가 같다.
  공개 2주가 지난 5.5.5 로 고정했다.
- **DESIGN.md 머리말 자동 생성**: 머리말의 `tokens:`·`themes:` 는 빌드가 다시 쓴다. 본문만 사람이 쓴다.
  손으로 값을 두 곳에 적던 것이 기존 프로젝트들이 어긋난 원인이었다.
- **정적 쇼케이스**: 부품의 모든 상태를 브라우저로 확인하는 데 프레임워크가 필요 없다. 생성된
  `dist/classic/css/tokens.css` 를 그대로 써서 "웹 소비자" 역할도 검증한다.

## 결과

- 좋음: 토큰 한 곳 수정 → `npm run build` 한 번으로 모든 플랫폼 파일과 DESIGN.md 값이 갱신된다.
- 좋음: 새 플랫폼(예: Qt QSS, WinUI) 추가는 `build/formats/` 에 포맷 하나.
- 비용: 모바일 출력은 그라데이션·그림자를 내보내지 않는다(네이티브 리소스 대응 없음). 계약은 DESIGN.md 를 따른다.
- 비용: XAML 은 토큰(리소스)만 준다. 부품 스타일(ControlTheme·Style)은 각 프로젝트가 DESIGN.md 계약대로 만든다.
