# sh-design-system

이성현의 **클래식 UI/UX 디자인 시스템 레퍼런스 — `sh-classic`**.
[oh-my-design](https://oh-my-design.kr) 의 브랜드 레퍼런스(Toss·당근·Upbit …)와 같은 형식으로, AI 에이전트가 읽고
그대로 따르는 `DESIGN.md` 와 모든 플랫폼용 토큰 파일, 눈으로 확인하는 쇼케이스를 한 곳에 모았다.

돋움 12px · 반경 0 · 1px 선 · 흰→회색 베벨 버튼 · 회색 메뉴바/도구모음/상태바 · 안쪽 점선 포커스 · 촘촘한 표와 연결선 트리.

## 무엇이 들어 있나

| 경로 | 내용 |
|---|---|
| `references/sh-classic/DESIGN.md` | **계약 문서** — omd 0.1 형식. 머리말 값은 빌드가 생성, 본문은 규칙 |
| `tokens/base/*.json` | **값의 SSOT** — W3C DTCG 형식 토큰 |
| `tokens/themes/*.json` | 변형 — 베이스와 다른 값만 덮어쓴다 (스킨·터치 밀도 등) |
| `dist/<테마>/<플랫폼>/` | 생성 결과 — css · scss · less · js(+d.ts, json) · tailwind · wpf · avalonia · ios · android · compose · flutter |
| `showcase/` | 모든 부품·상태를 보여 주는 정적 페이지 |
| `bin/sh-ds.mjs` | 소비 프로젝트 설치·갱신 명령 |

## 다른 프로젝트에서 쓰기

```bash
# 프로젝트 루트에서 — 스택에 맞는 플랫폼을 고른다
npx -y github:coolmarvel/sh-design-system init --platform css            # 웹·Electron
npx -y github:coolmarvel/sh-design-system init --platform wpf            # WPF
npx -y github:coolmarvel/sh-design-system init --platform avalonia      # Avalonia
npx -y github:coolmarvel/sh-design-system init --platform css --theme <테마>
npx -y github:coolmarvel/sh-design-system update                        # 레퍼런스 새 버전 반영
npx -y github:coolmarvel/sh-design-system list                          # 테마·플랫폼 목록
```

- 루트 `DESIGN.md` 가 생기고 이후 **프로젝트 소유**가 된다. 프로젝트 전용 규칙은 여기에 덧붙인다.
- 원본은 `.claude/data/references/sh-classic/DESIGN.md` 에 그대로 남아 omd 스킬(`/omd:apply` 등)이 레퍼런스로 쓴다.
- 토큰은 `design-tokens/<플랫폼>/` 에 복사된다. 생성 파일이므로 직접 고치지 않는다.

에이전트에게는 이렇게 지시하면 된다: *"DESIGN.md(sh-classic)를 따라 UI 를 만들어. 색·크기는 design-tokens 의 값만 써."*

## 이 저장소를 고칠 때

```bash
npm install
npm run build          # tokens → dist/ + DESIGN.md 머리말 갱신
npm run verify         # prettier 검사 + dist·DESIGN.md·CSS 변수·대비 검증
npm run showcase:up    # http://localhost:8083 (도커) — 끄기: npm run showcase:down
```

값을 바꾸려면 `tokens/` 만 고치고 빌드한다. `dist/` 와 DESIGN.md 머리말을 손으로 고치면 `verify` 가 실패한다.
새 플랫폼은 `build/build.mjs` 의 `platforms()` 에 항목 하나와 필요하면 `build/formats/` 에 포맷 하나를 더한다.

---

© 2026 이성현 (SeongHyun Lee). All rights reserved. — `LICENSE`
