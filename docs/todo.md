---
title: TODO
created: 2026-10-13
updated: 2026-10-15
domain: development
---

# TODO (미해결·향후 작업만, 완료분은 session-log 로)

우선순위: **P1** 다음 릴리스에서 다뤄야 함 · **P2** 가까운 로드맵 · **P3** 품질 · **P4** 아이디어.

## P1 - 다음 릴리스에서 다뤄야 함

- [ ] 실제 프로젝트 하나(웹)에 `sh-ds init --platform css` 적용해 계약과 어긋나는 부품 찾기 (docs/plans/0001-mvp.md 마일스톤 2)

## P2 - 가까운 로드맵

- [ ] WPF·Avalonia 부품 스타일 레퍼런스(`components/wpf`, `components/avalonia`) - 지금은 토큰만
- [ ] project-seed 위저드 디자인 단계에 sh-classic 선택지 추가 (발사대 유지보수 모드에서 사용자 요청 시)
- [ ] ADR-0003 판정 중 사용자 확인이 필요한 항목 재확인: 대화상자 제목 13px, 스크롤바 12px

## P3 - 품질

- [ ] 테마 토큰의 배열 값이 베이스 배열과 칸 단위로 합쳐짐(pacsplus 글꼴에서 발견). 배열은 통째로 덮어쓰게 빌드 병합 규칙 수정 (`build/build.mjs`)
- [ ] 쇼케이스 도커가 WSL 에 없으면 `showcase:up` 이 실패. 정적 서버 대안을 스크립트로 (`package.json`)
- [ ] dark 테마에서 종이(`sh-paper`)도 어둡게 그려짐 - 문서 스테이지 종이는 항상 흰색이어야 하는지 결정

## P4 - 아이디어

- [ ] 쇼케이스에 "프로젝트 미리보기" - 테마를 고르면 실제 앱 골격 여러 개(편집기·목록·서명)를 나란히
- [ ] 출력 포맷 추가: Qt QSS, WinUI, Figma Variables
