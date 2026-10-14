---
title: ADR-0003 sh-classic 통합 기준과 충돌 판정
created: 2026-10-13
status: accepted
---

# ADR-0003: sh-web-editor + sh-messenger 를 기준으로 클래식 UI 를 통합한다

## 상태

Accepted (2026-10-13). 기준 프로젝트는 사용자가 지정했고, 개별 충돌은 아래 근거로 에이전트가 판정했다.
판정을 바꾸려면 `tokens/` 와 DESIGN.md 를 고치고 이 문서에 날짜와 이유를 덧붙인다.

## 맥락

12개 프로젝트를 조사했다(remote-assist, sh-web-editor, sh-messenger, sh-compositor, file-converter, sh-econsent,
sh-form-designer, pdf-editor(-live), dicom-studio, sh-dicom-studio, sh-ip-scanner). 형태 언어(직각·1px·12px·베벨·
점선 포커스)는 모두 같았지만 accent, 기본 스킨, 탭·메뉴·체크 표현, 크기 몇 가지가 달랐다.
사용자 지시 (2026-10-13): "가장 근접한 게 sh-web-editor 랑 sh-messenger 야. 나머지들도 거의 그 두 개를 차용했어.
기준을 잡을 때 그 두 개를 가지고 진행해줘."

## 결정

| 항목 | 결정 | 출처·근거 |
|---|---|---|
| 중립 팔레트 | text `#1f2329` · border-strong `#8a919e` · sunken `#f5f6f8` · hover `#eef0f3` | sh-messenger. 5개 프로젝트가 이미 수렴 |
| accent | `#2f6fed` (hover `#255fd1`, pressed `#1f4fb0`, subtle `#e9f0ff`) | sh-messenger. sh-web-editor 는 accent 가 없음 |
| `#3b74f2` (compositor·pdf 브랜드) | `brand-compositor` 테마로 분리. 흰 글자 대비 4.23 이라 `#336ef1` 로 보정 | 대비 검사 |
| 크롬 기본 스킨 | **gray** (DEXT5 회색 스킨 실측) | 2026-10-13 사용자 결정 "회색으로 변경" - econsent·form-designer·pdf 가 수렴한 톤. 파랑은 `skin-blue` 테마 |
| 베벨 버튼 | `#fff` 에서 `#e6e6e6` 로, 테두리 `#b5b5b5`, hover 흰 면 + `#2a8dd4`, 눌림 `#d6d9df` | sh-web-editor 실측 + messenger 눌림 |
| 글꼴 | 돋움 우선. Avalonia/Skia 는 맑은 고딕 우선인 `font.family.ui-skia` | 두 기준 모두 돋움. form-designer 렌더 깨짐 사례는 별도 토큰으로 수용 |
| 타입 스케일 | 11 · 12 · 13 · 14 · 16, 굵기 400/600/700, 줄 높이 1.2/1.3/1.45 | sh-messenger |
| 간격 | 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 48 | messenger 4px 그리드 + 촘촘한 2·6 |
| 툴바 구분선 | 1px 단선, 흰 하이라이트 없음 | sh-web-editor 2026-09-08 재실측 |
| 메뉴 항목 hover | 스킨 `toolbar-face` 면 | sh-web-editor 실측. messenger 의 accent 채움은 쓰지 않음 |
| 메뉴바 높이 | 22 | compositor·econsent·pdf 수렴값. web-editor 29 는 에디터 전용 배치 |
| 탭 | 24 고정, 선택해도 크기·굵기 불변, 밑줄 없음 | 2026-10-01 사용자 피드백("커지는 탭이 어색하다") |
| 체크박스 | 13px 흰 상자 + 진한 ✓ | form-designer 최신 결정. accent 채움은 쓰지 않음 |
| 대화상자 | 제목 띠 28 · 13px bold · 끌기 이동, 덮개 검정 15%, 그림자 3/3/6 | 띠 높이 messenger, 덮개 web-editor, 13px 는 크롬 상한 14 안의 중간값 |
| 상태 줄 | 22, 그라데이션, 오목 칸 11px | web-editor 23 / compositor 22 중 다른 크롬 높이와 짝이 맞는 22 |
| 스크롤바 | 12 | sh-messenger |
| 트리 행 | 19 | 두 DESIGN.md 의 문구 (econsent 코드의 20 은 문서와 어긋난 값) |
| 그림자 | raised 2/2/4 18%, dialog 3/3/6 22%, page 2/2/0 35% | messenger·web-editor 공통 |
| 모션 | 이동 애니메이션 없음, hover 색 전환만 100ms | compositor·pdf 0ms + messenger fast |
| 다크 | `dark` 테마로만 보존. 기본은 라이트 | messenger 만 다크가 있었음. 대비 보정: accent `#3c71df`, border-strong `#7a808b` |
| 변형 | 스킨 12종, pacsplus, brand-compositor, touch, dark | 각 프로젝트 고유값을 베이스 밖으로 |

대비 보정: `danger-subtle` 을 `#fdecec` 에서 `#fef2f2` 로 옅게 했다. danger 글자와의 대비가 4.31 이라 4.5 에 못 미쳤다.

## 근거

- 두 기준 프로젝트가 다른 프로젝트들의 원천이었다. 조사 결과 compositor·econsent·pdf 의 값은 거의 전부 이 둘에서 왔다.
- 두 기준이 서로 다른 값을 가진 항목은 더 최근의 명시적 사용자 피드백을 우선했다(탭·체크·트리).
- 두 기준 모두 값이 없는 항목(메뉴바 높이 등)은 나머지 프로젝트가 수렴한 값을 썼다.

## 결과

- 기존 프로젝트를 이 레퍼런스로 옮기면 accent(`#3b74f2` 쓰던 앱), 기본 스킨(blue 쓰던 web-editor·compositor), 탭 굵기, 체크 채움이 눈에 띄게 바뀐다.
  그대로 두고 싶으면 `brand-compositor`·`skin-blue` 테마를 고른다.
- 사용자가 다르게 원하는 항목이 있으면 이 표의 한 줄을 바꾸고 빌드하면 모든 플랫폼에 반영된다.
