---
title: 세션 로그
created: 2026-10-13
updated: 2026-10-15
domain: development
---

# 세션 로그 (최신이 위)

이 파일이 **"언제 무슨 일이 있었나"의 SSOT**다. 세션마다 최상단에 블록 추가.

블록 형식: `## YYYY-MM-DD - 제목` 아래에 **요청/피드백, 수정, 검증, 다음** 순서로 간결하게.

## 2026-10-15 - UI 글꼴을 맑은 고딕 우선으로 v0.1.2

- **요청**: sh-video-editor 피드백. 12px 굵은 글자(대화상자 제목, 트랙 이름 A1·V1, 패널 머리)가 번져 보인다. 한컴 한글처럼
  클래식하면서 선명하게. 원천(이 저장소)도 바꾸기로 사용자가 확인함.
- **원인**: `font.family.ui` 의 첫 글꼴 돋움은 굵은 글꼴이 없어 Windows 가 굵게를 흉내 낸다.
- **수정**: `tokens/base/typography.json` 의 ui 를 맑은 고딕 우선으로(돋움 제거), ui-skia 는 같은 값으로 호환 유지. pacsplus 테마는
  굴림 그대로 두되 목록을 6개로 맞춰 베이스 꼬리가 섞이던 것(`sans-serif, 'Noto Sans CJK KR', ...`)을 없앰. content(굴림)·mono 그대로.
  부품 CSS 루트에 `font-synthesis: none` 은 넣지 않음(굴림 본문의 사용자 굵게가 사라짐), 대신 DESIGN.md 3절 규칙. ADR-0004 신규,
  ADR-0003 글꼴 행에 대체 표시. DESIGN.md 1·3절, README, 쇼케이스 타이포그래피 안내 문장. `npm run build` 로 17개 테마 13개 플랫폼 재생성.
- **검증**: `npm run build && npm run verify` 통과(대비 포함). 도커가 이 WSL 에 없어 같은 폴더를 `python3 -m http.server 8083` 으로 띄우고
  Playwright 1440·390 에서 타이포그래피·탭·메뉴·대화상자 전후 비교: 굵은 제목이 맑은 고딕 Bold 로, 390 가로 넘침 없음. 리눅스라 ClearType 은
  재현하지 못함. 소비 경로 `npx -y github:coolmarvel/sh-design-system@main` 를 빈 폴더에서 시험.
- **다음**: sh-video-editor 에서 `update` 로 받아 편집기 덮어쓰기 제거. 다른 소비 앱(SH Compositor 등)도 다음 갱신 때 반영.

## 2026-10-14 - 특수기호 정리 v0.1.1

- **요청**: em-dash 같은 특수기호가 들어간 문장이 AI 티가 난다. 전부 사람 글처럼 고치자.
- **수정**: 소스 전체(문서·주석·토큰 $description·콘솔 문구)에서 em-dash, en-dash, 유니코드 화살표, 줄임표, 원문자, 박스 선,
  제목 이모지, 콘솔 체크 기호를 걷어냈다. 구분은 하이픈이나 콜론, 흐름은 `->`, 글꼴 폴백 같은 열거는 쉼표로 풀어 썼다.
  UI 글리프(메뉴 체크 ✓, 닫기 ✕, 하위 메뉴 ▸)와 가운뎃점·×는 유지. XAML 주석의 `--` 회피 문자를 `- -` 로 변경.
  writing-guide 작성 원칙 8(특수기호 금지) 추가, DESIGN.md 10절 문구 규칙 보강. `npm run build` 로 dist 전체 재생성.
- **검증**: `npm run build && npm run verify` 통과. dist 안에 em-dash·화살표·줄임표 0건, XAML 주석에 `--` 0건.
  쇼케이스는 버튼 라벨 줄임표 한 곳만 바뀌어 Playwright 재확인은 생략.
- **다음**: project-seed 템플릿도 같은 규칙으로 정리해 새 프로젝트가 같은 문체를 물려받게.

## 2026-10-13 - 킥오프 완료: sh-classic v0.1.0

- **요청**: oh-my-design 의 기업 레퍼런스처럼 "내 레퍼런스"를 만들고 싶다. 프로젝트마다 클래식 UI 가 제각각이라 omd 처럼
  정리. 기준은 sh-web-editor + sh-messenger (나머지는 이 둘을 차용). omd 빌더 내보내기(DESIGN.md · Tailwind v4 · CSS 변수 ·
  DTCG JSON)와 색·타이포·간격·부품·지침 구성 스크린샷 4장 첨부(확인 후 삭제). 공개 범위 public.
- **결정**: omd 호환 DESIGN.md + DTCG 토큰 SSOT + Style Dictionary 5.5.5 -> 13개 플랫폼, 쇼케이스 도커 8083 (ADR-0002).
  통합 판정표 (ADR-0003): accent `#2f6fed`, 기본 스킨 gray(사용자 결정, 파랑은 skin-blue), 탭 굵기 불변, 흰 상자 체크, 메뉴 hover toolbar-face 등.
- **수정**: tokens(베이스 5파일 + 테마 16), build(빌드·포맷·omd·check), DESIGN.md 16절, components/css/sh-classic.css,
  showcase(omd 빌더형, 클래식 앱 모양), bin/sh-ds.mjs, README, 문서 일체.
- **검증**: `npm run verify` 통과(prettier + dist 신선도 + DESIGN.md 동기화 + CSS 변수 참조 + 17개 테마 대비).
  대비 검사가 잡은 4건 보정(danger-subtle, brand accent, dark accent·border-strong). Playwright 1440·390 두 크기 확인,
  모바일 가로 넘침 없음. 설치 명령 임시 폴더 시험 통과.
- **추가 결정**: 기본 크롬 스킨을 회색으로 변경(사용자), 파랑은 `skin-blue` 테마. GitHub `coolmarvel/sh-design-system` 공개 저장소 생성·푸시.
  `npx -y github:coolmarvel/sh-design-system init --platform css,avalonia` 를 빈 폴더에서 실행해 설치 확인.
- **다음**: 실제 프로젝트 하나에 `sh-ds init` 적용해 어긋남 찾기.
