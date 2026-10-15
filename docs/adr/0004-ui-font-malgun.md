---
title: ADR-0004 UI 글꼴을 맑은 고딕 우선으로
created: 2026-10-15
status: accepted
---

# ADR-0004: UI 글꼴을 맑은 고딕 우선으로

## 상태

Accepted (2026-10-15, 사용자 결정 "원천도 바꾸기")

## 맥락

`font.family.ui` 가 돋움 우선이었다(ADR-0003 글꼴 행). 돋움에는 굵은 글꼴이 없어 Windows 가 굵게를 흉내 낸다. sh-video-editor 피드백
(2026-10-15)에서 12px 굵은 글자(대화상자 제목, 트랙 이름 A1·V1, 패널 머리)가 번져 보였다. 사용자는 한컴 한글의 UI(맑은 고딕, 실제 굵은
글꼴)를 기준으로 "클래식하면서도 선명한" 모양을 원했다. Avalonia/Skia 쪽은 같은 이유로 이미 `ui-skia` 를 맑은 고딕 우선으로 따로 두었다
(2026-10-01).

## 결정

- `font.family.ui` 를 `'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans CJK KR', 'Noto Sans KR', sans-serif` 로 바꾼다. 돋움은 뒤쪽
  예비로도 남기지 않는다: 맑은 고딕은 Windows Vista 이후 모든 Windows 에 있어 돋움까지 내려갈 일이 없고, 남겨 두면 맑은 고딕을 지운
  환경에서만 번지는 굵게가 되살아난다.
- `font.family.ui-skia` 는 이름을 쓰는 소비 프로젝트가 있어 지우지 않고 같은 값으로 둔다.
- `font.family.content`(굴림)는 그대로 둔다. 문서 본문 글꼴이고 크롬 굵게에는 쓰지 않는다.
- `pacsplus` 테마의 UI 글꼴(굴림)은 그대로 둔다. PACSPLUS 뷰어를 실측해 흉내 내는 테마라 원본의 글꼴이 곧 정체성이다.
- 부품 CSS 루트에 `font-synthesis: none` 을 넣지 않는다. 굴림 본문의 사용자 굵게가 사라지기 때문이다. 대신 DESIGN.md 3절에 "UI 글꼴은 실제
  굵은 글꼴이 있는 것만" 규칙을 둔다.

## 근거

- 맑은 고딕은 Regular·Bold·Semilight 를 갖춰 600·700 이 실제 굵은 글꼴로 그려진다. ClearType 힌팅이 12px 에 맞춰져 있다.
- 대안 1: 소비 프로젝트마다 `ui-skia` 로 덮어쓰기. 프로젝트마다 같은 수정이 반복되고 새 프로젝트는 번지는 기본값을 물려받는다.
- 대안 2: 맑은 고딕 우선 테마를 하나 더 두기. 기본값이 여전히 번지고 테마 조합이 늘어난다.

## 결과

- 모든 플랫폼 토큰(13종)과 스킨이 다시 생성된다. 소비 프로젝트는 `update` 로 받으면 UI 글자가 맑은 고딕이 된다.
- 돋움 특유의 촘촘한 폭보다 글자 폭이 조금 넓다. 12px·24px 컨트롤 높이 안에는 들어간다.
- 리눅스·macOS 는 이전과 같이 Apple SD Gothic Neo·Noto Sans 로 내려간다.
