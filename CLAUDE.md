# CLAUDE.md - sh-design-system 작업 가이드

이 파일은 **세션이 바뀌어도 맥락을 즉시 복구**하기 위한 진입점이다. Claude Code는 세션 시작 시
이 파일을 자동으로 읽는다. (도구 중립 절대 규칙은 `AGENTS.md`.)

> [project-seed](https://github.com/coolmarvel/project-seed) 에서 2026-10-13 에 생성됨.

## 세션 시작 부팅 프로토콜 (매 세션 첫 작업 전에 반드시 수행)

새 세션에서 작업을 시작하면, **코드를 건드리기 전에** 순서대로:

1. `docs/session-log.md` 읽기 - 마지막으로 무엇을 했고 지금 어디쯤인지 (**진행 이력 SSOT**)
2. `docs/todo.md` 읽기 - 남은 일 (P1~P4)
3. 최근 `docs/plans/*.md` 1개 읽기 - 진행 중 기능의 설계 의도
4. 사용자 피드백 확인: 루트 `feedback/` 폴더(또는 루트에 놓인 `image*.png`)의 스크린샷·메모 = **미처리 피드백**. 반영 후 `docs/feedback-archive/YYYY-MM-DD-<주제>/` 로 옮긴다.
5. `git status` 에 모르는 변경이 있으면 session-log 와 대조 - 다른 세션의 흔적일 수 있다. 출처 불명이면 사용자에게 확인.

## 변경 후 자동 규칙 (사용자가 매번 요청하지 않아도 수행)

1. 코드를 바꾸면 **같은 턴에** `docs/session-log.md`(최상단 블록 추가)·`docs/todo.md`
   (+릴리스급이면 `docs/changelog.md`)를 갱신한다. 문서 규칙은 `docs/writing-guide.md`.
2. 검증을 통과하기 전에는 커밋 메시지 작성/산출물 전달을 하지 않는다:
   `npm run build && npm run verify` (prettier 검사 + dist·DESIGN.md 동기화·CSS 변수·대비 검사). UI(쇼케이스·부품 CSS)를 바꿨으면
   `npm run showcase:up` 후 http://localhost:8083 을 Playwright 로 데스크톱(1440)·모바일(390) 두 크기에서 확인한다.
3. 버전을 판단해 올린다 (아래 "버전 정책").
4. 산출물 전달: 도커 쇼케이스 http://localhost:8083 을 띄워 둔다 + GitHub(main)에 푸시. 소비 프로젝트는 `npx -y github:coolmarvel/sh-design-system init` 으로 가져간다.

## 버전 정책 (semver `MAJOR.MINOR.PATCH`)

**MINOR 승격은 사용자만 선언한다.** 에이전트가 판단해서 올리지 않는다.

- **PATCH**: 기본값. 다듬는 중인 기능의 수정 하나 반영할 때마다 +1.
- **MINOR**: 사용자가 "이 기능은 더 수정할 게 없다, 넘어가자"라고 선언한 그 시점에만.
- **MAJOR**: 대규모 재설계/호환 깨짐. 사용자와 상의.

## 커밋 컨벤션

Conventional Commits - `<type>: <한국어 제목>` + 리스트형 본문. 메시지 끝에 `Co-Authored-By` 트레일러.
**검증 통과 후 에이전트가 커밋·푸시한다** (사용자 위임 2026-08-06). 파일을 지정해 stage 하고, git identity 는 전역 설정을 그대로 쓴다.

type: `feat` `fix` `refactor` `chore` `docs` `style` `test` `perf` `ci` `build` `revert` `init` `remove` `rename` `hotfix`

## 협업 규칙

- **진행 이력의 SSOT 는 `docs/session-log.md`**: git history 가 아니다 (커밋이 성긴 단위라서).
- 세션이 끊겨도 이어서 작업할 수 있게 **모든 진행 사항을 `docs/` 에 파일로 기록**한다.
- 설계 논쟁이 생기면 `docs/brief.md`(왜/무엇 SSOT)로 돌아와 판정한다. 브리프 밖 기능은 스코프 확인 먼저.
- `.env` 는 직접 수정하지 않는다. `.env.example` 수정 또는 사용자에게 요청 (훅이 차단함).
- 규칙이 미확정이면 이 파일에 `<!-- TODO -->` 로 남기고, 확정되는 순간 채운다.

## 이 프로젝트가 뭔가

이성현의 모든 프로젝트가 같은 **클래식 UI(sh-classic)** 를 따르게 하는 디자인 시스템 레퍼런스 저장소다. oh-my-design(omd)
브랜드 레퍼런스와 같은 형식의 `references/sh-classic/DESIGN.md`(AI 가 읽는 계약)와, DTCG 토큰 SSOT 에서 생성한 13개 플랫폼
토큰 파일(CSS·SCSS·LESS·JS·Tailwind 3/4·DTCG·WPF·Avalonia·iOS·Android·Compose·Flutter), 웹용 부품 CSS, 쇼케이스를 담는다.
기준은 sh-web-editor(DEXT5 실측 크롬, 기본 회색 스킨) + sh-messenger(중립 팔레트) - `docs/adr/0003-classic-consolidation.md`. 제품 앱은 여기 없다.

## 문서 인덱스 (docs/)

| 파일 | 용도 |
|---|---|
| `docs/writing-guide.md` | **문서 지배 규칙** (SSOT·frontmatter·코드 1:1 대조). 문서 쓰기 전 필독 |
| `docs/brief.md` | 프로젝트 **왜/무엇 SSOT**: 킥오프 산출물 |
| `docs/session-log.md` | 세션별 진행 이력. **"언제 무슨 일" SSOT** (최신이 위) |
| `docs/todo.md` | 미해결·향후 작업만 (P1~P4). 완료분은 session-log 로 |
| `docs/changelog.md` | 릴리스 단위 사람용 요약 |
| `docs/adr/*.md` | 구조적 결정 기록 - 왜 이렇게 했는가 (`NNNN-kebab.md`) |
| `docs/plans/*.md` | 앞으로 만들 것 - 기능 단위 구현 계획 (역할 구분은 `plans/README.md`) |
| `docs/guides/*.md` | 현재 구현된 동작·코드 위치 (기능별) |
| `docs/feedback-archive/` | 처리 완료한 사용자 피드백 보관소 |

## 자주 쓰는 명령

```bash
npm install
npm run build            # tokens -> dist/ 전체 + DESIGN.md 머리말(tokens·themes) 재생성
npm run verify           # lint(prettier) + check(dist 신선도·DESIGN.md 동기화·CSS 변수 참조·대비)
npm run format           # prettier 로 build/ showcase/ tokens/ 정리
npm run showcase:up      # 도커 nginx -> http://localhost:8083  (끄기: showcase:down)
npm run deploy:site      # 공개 쇼케이스 https://sh-design-system.vercel.app (vercel.json 이 showcase·dist·references·components 를 site/ 로 모은다)
node bin/sh-ds.mjs list  # 설치 명령 로컬 시험 (init --platform css --dir <폴더>)
```

## 코드 지도 (수정 시 어디를 보나)

| 경로 | 역할 |
|---|---|
| `tokens/base/*.json` | **값의 SSOT** (DTCG). color · gradient · typography · size(+space·radius·border) · effect(shadow·motion) |
| `tokens/themes/*.json` | 베이스와 다른 값만. `skin-*`(DEXT5 12종) · `pacsplus` · `brand-compositor` · `touch` · `dark` |
| `tokens/contrast.json` | 모든 테마에서 강제하는 글자/바탕 대비 쌍 |
| `build/build.mjs` | Style Dictionary 설정. 플랫폼 목록 `platforms()` |
| `build/formats/` | 커스텀 출력: `xaml.mjs`(WPF·Avalonia) · `tailwind.mjs`(v3 프리셋·v4 @theme) · `dtcg.mjs` |
| `build/omd.mjs` | DESIGN.md 머리말 `tokens:`·`themes:` 재작성 |
| `build/check.mjs` | 검증 (파일을 고치지 않음) |
| `references/sh-classic/DESIGN.md` | **계약 문서**: 본문은 사람이, 머리말 값은 빌드가 |
| `components/css/sh-classic.css` | 웹 부품 CSS (DESIGN.md 4절 구현, `--sh-*` 만 사용) |
| `showcase/` | 쇼케이스(index.html · showcase.css · app.js) - omd 빌더처럼 색·타이포·간격·부품·지침 + 내보내기 탭 |
| `bin/sh-ds.mjs` | 소비 프로젝트 설치 명령 (의존성 없음) |
| `dist/` | **생성물, 커밋함.** 손으로 고치지 않는다 |

새 토큰 추가 = 1) `tokens/base/*.json` 에 `$value`+`$description` 2) 필요하면 테마 파일 3) DESIGN.md 본문에 역할 서술
4) 쓰는 부품이면 `components/css/sh-classic.css` + 쇼케이스 5) `npm run build && npm run verify`.
새 플랫폼 추가 = `build/build.mjs` 의 `platforms()` 항목 + (내장 포맷이 없으면) `build/formats/` 에 포맷 + README·ADR 갱신.
값 판정 바꾸기 = `docs/adr/0003-classic-consolidation.md` 표에 날짜와 이유를 남긴다.

어기면 재발하는 함정:
- `dist/`·DESIGN.md 머리말을 손으로 고치면 다음 빌드에서 사라지고 `verify` 가 실패한다.
- 대비를 깨는 색은 `check` 가 막는다. 브랜드색을 그대로 넣고 싶어도 흰 글자 4.5:1 을 넘기는 음영으로 보정한다.
- 문서·주석·UI 문구에 em-dash, 유니코드 화살표, 이모지 같은 특수기호를 쓰지 않는다 (DESIGN.md 10절, writing-guide 작성 원칙 8). 쇼케이스 문구도 마찬가지.

## 디자인 시스템 (oh-my-design)

이 저장소 자체가 디자인 레퍼런스다. 계약 = `references/sh-classic/DESIGN.md` (omd 0.1 형식, 16절).
쇼케이스와 부품 CSS 를 바꿀 때도 이 계약을 따른다. 계약과 구현이 어긋나면 계약을 먼저 고치고 ADR-0003 에 이유를 남긴다.
omd 스킬은 소비 프로젝트에서 쓴다 (`/omd:apply`·`/omd:slop-audit` 가 `.claude/data/references/sh-classic/` 을 레퍼런스로 읽음).

## 하네스 (Harness Engineering)

지시문이 아니라 시스템으로 제약한다. 도입 근거: `docs/adr/0001-harness-engineering.md`.

| 축 | 내용 |
|---|---|
| Hooks (`scripts/hooks/`) | `env-guard.sh`(.env 편집 차단) · `git-add-guard.sh`(`git add -A/.`·.env staging 차단) · `format.sh`(PostToolUse, build/showcase/tokens 의 js·css·html·json 을 prettier) |
| Settings (`.claude/settings.json`) | `disableRemoteControl: true` + `remoteControlAtStartup: false` + `autoUploadSessions: false` - Claude Code **Remote Control**(로컬 세션을 claude.ai/code 에 동기화) 차단. 대화 내용이 웹에 남지 않게 한다. 세션 중 `/rc` 가 켜져 있으면 끊는다 |
| Commands (`.claude/commands/`) | `/review-security` · `/deploy-check` |
| MCP (`.mcp.json`) | `context7`(라이브러리 문서) · `playwright`(쇼케이스 QA) |
| Skills | 없음 - omd 번들은 소비 프로젝트에 설치한다 |
