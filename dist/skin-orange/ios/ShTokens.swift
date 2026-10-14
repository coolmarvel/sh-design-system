
//
// ShTokens.swift
//

// Do not edit directly, this file was auto-generated.


import UIKit

public enum ShTokens {
    public static let borderFocusOffset = CGFloat(-3) /** 포커스 점선을 안쪽 3px 에 */
    public static let borderWidth = CGFloat(1) /** 모든 선은 1px */
    public static let colorAccent = UIColor(red: 0.184, green: 0.435, blue: 0.929, alpha: 1) /** 주 동작·선택·포커스에만. 배지·성공에 재사용 금지 (sh-messenger) */
    public static let colorAccentHover = UIColor(red: 0.145, green: 0.373, blue: 0.820, alpha: 1)
    public static let colorAccentPressed = UIColor(red: 0.122, green: 0.310, blue: 0.690, alpha: 1) /** 주 버튼 테두리·눌림 */
    public static let colorAccentSubtle = UIColor(red: 0.914, green: 0.941, blue: 1.000, alpha: 1) /** 선택 행·선택 라벨·켜진 세그먼트 면 (진한 글자 유지) */
    public static let colorAccentSubtleHover = UIColor(red: 0.859, green: 0.902, blue: 0.988, alpha: 1)
    public static let colorBorder = UIColor(red: 0.890, green: 0.898, blue: 0.918, alpha: 1) /** 안쪽 헤어라인 */
    public static let colorBorderStrong = UIColor(red: 0.541, green: 0.569, blue: 0.620, alpha: 1) /** 입력·메뉴 판·체크 상자 테두리 (비텍스트 대비 3:1) */
    public static let colorCanvas = UIColor(red: 1.000, green: 1.000, blue: 1.000, alpha: 1) /** 흰 면 - 입력·표·대화상자·활성 탭 */
    public static let colorChromeFrame = UIColor(red: 1.000, green: 0.647, blue: 0.184, alpha: 1) /** 바깥 1px 테두리·패널 구분선 */
    public static let colorChromeMenubarBottom = UIColor(red: 1.000, green: 0.733, blue: 0.314, alpha: 1)
    public static let colorChromeMenubarTop = UIColor(red: 1.000, green: 0.910, blue: 0.741, alpha: 1)
    public static let colorChromePressed = UIColor(red: 1.000, green: 0.776, blue: 0.475, alpha: 1) /** 켜진 도구 버튼·열린 드롭다운 면 아래 */
    public static let colorChromePressedLight = UIColor(red: 1.000, green: 0.965, blue: 0.918, alpha: 1)
    public static let colorChromeSeparator = UIColor(red: 1.000, green: 0.702, blue: 0.310, alpha: 1) /** 툴바 세로 구분선 1px 단선 */
    public static let colorChromeStatusFace = UIColor(red: 0.984, green: 0.914, blue: 0.800, alpha: 1) /** 상태 줄 면 - 파란 스킨에서도 회색 */
    public static let colorChromeStatusLight = UIColor(red: 0.992, green: 0.961, blue: 0.906, alpha: 1)
    public static let colorChromeStatusTop = UIColor(red: 1.000, green: 0.749, blue: 0.420, alpha: 1)
    public static let colorChromeTabActive = UIColor(red: 1.000, green: 0.831, blue: 0.616, alpha: 1)
    public static let colorChromeTabDivider = UIColor(red: 1.000, green: 0.647, blue: 0.184, alpha: 1)
    public static let colorChromeToolbarEdge = UIColor(red: 1.000, green: 0.647, blue: 0.184, alpha: 1) /** 눌린·켜진 도구 버튼 테두리 */
    public static let colorChromeToolbarFace = UIColor(red: 1.000, green: 0.808, blue: 0.537, alpha: 1) /** 툴바 면·메뉴 항목 hover */
    public static let colorChromeToolbarHairline = UIColor(red: 1.000, green: 0.706, blue: 0.322, alpha: 1) /** 툴바 줄 사이 1px */
    public static let colorChromeToolbarLight = UIColor(red: 1.000, green: 0.969, blue: 0.914, alpha: 1)
    public static let colorChromeToolbarRow2Bottom = UIColor(red: 1.000, green: 0.800, blue: 0.522, alpha: 1)
    public static let colorControlBorder = UIColor(red: 0.710, green: 0.710, blue: 0.710, alpha: 1) /** 베벨 버튼 테두리 */
    public static let colorControlBottom = UIColor(red: 0.902, green: 0.902, blue: 0.902, alpha: 1) /** 베벨 버튼 면 아래 */
    public static let colorControlPressed = UIColor(red: 0.839, green: 0.851, blue: 0.875, alpha: 1) /** 눌린 베벨 버튼 - 오목한 단색 */
    public static let colorControlTop = UIColor(red: 1.000, green: 1.000, blue: 1.000, alpha: 1) /** 베벨 버튼 면 위 (Money Forward·DEXT5 계열) */
    public static let colorDanger = UIColor(red: 0.831, green: 0.184, blue: 0.216, alpha: 1) /** 삭제·오류·닫기 hover */
    public static let colorDangerBorder = UIColor(red: 0.945, green: 0.663, blue: 0.678, alpha: 1) /** 삭제류 외곽선 버튼 테두리 */
    public static let colorDangerSubtle = UIColor(red: 0.996, green: 0.949, blue: 0.949, alpha: 1)
    public static let colorGrid = UIColor(red: 0.831, green: 0.831, blue: 0.831, alpha: 1) /** 표 격자선 */
    public static let colorHover = UIColor(red: 0.933, green: 0.941, blue: 0.953, alpha: 1) /** 목록·표·트리 라벨 hover 면 */
    public static let colorHoverEdge = UIColor(red: 0.165, green: 0.553, blue: 0.831, alpha: 1) /** 베벨·도구 버튼·입력 hover 테두리 - 크롬의 유일한 채도 (DEXT5 실측, sh-web-editor) */
    public static let colorLink = UIColor(red: 0.114, green: 0.373, blue: 0.839, alpha: 1) /** UI 링크. 편집 콘텐츠 안 링크는 브라우저 기본 파랑 */
    public static let colorOnAccent = UIColor(red: 1.000, green: 1.000, blue: 1.000, alpha: 1)
    public static let colorScrim = UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 0.14901960784313725) /** 대화상자 덮개 - 검정 15% */
    public static let colorStageCheckerA = UIColor(red: 0.227, green: 0.239, blue: 0.271, alpha: 1) /** 투명 표시 체커 */
    public static let colorStageCheckerB = UIColor(red: 0.165, green: 0.173, blue: 0.196, alpha: 1)
    public static let colorStageDocument = UIColor(red: 0.541, green: 0.561, blue: 0.596, alpha: 1) /** 종이 문서 편집 바탕 */
    public static let colorStageImage = UIColor(red: 0.118, green: 0.125, blue: 0.145, alpha: 1) /** 이미지·영상을 보는 어두운 바탕 */
    public static let colorStageViewer = UIColor(red: 0.353, green: 0.369, blue: 0.400, alpha: 1) /** 작성·열람 뷰어 바탕 */
    public static let colorSuccess = UIColor(red: 0.082, green: 0.502, blue: 0.239, alpha: 1)
    public static let colorSuccessSubtle = UIColor(red: 0.906, green: 0.961, blue: 0.925, alpha: 1)
    public static let colorSunken = UIColor(red: 0.961, green: 0.965, blue: 0.973, alpha: 1) /** 앱 바탕·사이드바·비활성 컨트롤 면 */
    public static let colorText = UIColor(red: 0.122, green: 0.137, blue: 0.161, alpha: 1) /** 본문·라벨·포커스 점선 (라이트에 순검정 금지) */
    public static let colorTextDisabled = UIColor(red: 0.635, green: 0.659, blue: 0.702, alpha: 1)
    public static let colorTextMuted = UIColor(red: 0.431, green: 0.463, blue: 0.514, alpha: 1)
    public static let colorTextSecondary = UIColor(red: 0.361, green: 0.388, blue: 0.439, alpha: 1)
    public static let colorTreeBox = UIColor(red: 0.482, green: 0.518, blue: 0.565, alpha: 1) /** [+]/[-] 상자 테두리 */
    public static let colorTreeLine = UIColor(red: 0.604, green: 0.627, blue: 0.659, alpha: 1) /** 연결선 점선 */
    public static let colorWarning = UIColor(red: 0.541, green: 0.353, blue: 0.000, alpha: 1)
    public static let colorWarningSubtle = UIColor(red: 1.000, green: 0.957, blue: 0.839, alpha: 1) /** 툴팁 면·경고 띠 */
    public static let fontFamilyContent = "굴림" /** 편집기 본문 콘텐츠 (sh-web-editor) */
    public static let fontFamilyMono = "Cascadia Mono"
    public static let fontFamilyUi = "돋움" /** UI 기본 - 돋움 12px 정체성 */
    public static let fontFamilyUiSkia = "Malgun Gothic" /** Avalonia/Skia 렌더러 - 돋움 비트맵이 비정수 크기·합성 굵게에서 깨진다 (2026-10-01) */
    public static let fontLineHeightDense = CGFloat(1.3)
    public static let fontLineHeightNormal = CGFloat(1.45)
    public static let fontLineHeightTight = CGFloat(1.2)
    public static let fontSizeBody = CGFloat(12) /** 본문·라벨·버튼·메뉴 - 기본 */
    public static let fontSizeCaption = CGFloat(11) /** 상태 칸·단축키·툴팁·배지 */
    public static let fontSizeEmphasis = CGFloat(13) /** 대화상자 제목·섹션 강조 */
    public static let fontSizeHeading = CGFloat(16) /** 문서·랜딩 제목 - 크롬에는 쓰지 않는다 */
    public static let fontSizeTitle = CGFloat(14) /** 화면 제목 (크롬 글자 상한) */
    public static let fontWeightBold = CGFloat(700) /** 제목·legend - 상한 */
    public static let fontWeightRegular = CGFloat(400)
    public static let fontWeightSemibold = CGFloat(600) /** 버튼 라벨 */
    public static let motionDurationFast = CGFloat(100) /** hover 색 전환에만 */
    public static let motionDurationNone = CGFloat(0) /** 이동·크기 애니메이션 없음 - 기본 */
    public static let radiusNone = CGFloat(0) /** 모든 컨트롤·패널·대화상자·메뉴 */
    public static let radiusRound = CGFloat(9999) /** 상태 점·dirty 점에만 */
    public static let sizeCheckbox = CGFloat(13)
    public static let sizeControlLg = CGFloat(28) /** 로그인 등 큰 입력 */
    public static let sizeControlMd = CGFloat(24) /** 버튼·입력·콤보 기본 */
    public static let sizeControlSm = CGFloat(22) /** 작은 버튼·세그먼트·아이콘 버튼 */
    public static let sizeDialogButtonMin = CGFloat(72)
    public static let sizeDialogTitle = CGFloat(28)
    public static let sizeIcon = CGFloat(16)
    public static let sizeMenuItem = CGFloat(22)
    public static let sizeMenuMinWidth = CGFloat(180)
    public static let sizeMenubar = CGFloat(22)
    public static let sizePanelTitle = CGFloat(22)
    public static let sizeRow = CGFloat(22) /** 목록·표 행 */
    public static let sizeScrollbar = CGFloat(12) /** sh-messenger */
    public static let sizeSplitter = CGFloat(5)
    public static let sizeStatusPane = CGFloat(16)
    public static let sizeStatusbar = CGFloat(22)
    public static let sizeTab = CGFloat(24) /** 활성·비활성 같은 높이 */
    public static let sizeTableHeader = CGFloat(24)
    public static let sizeTitlebar = CGFloat(28) /** 프레임리스 앱 타이틀바 */
    public static let sizeToolButton = CGFloat(24)
    public static let sizeToolbar = CGFloat(30)
    public static let sizeTreeBox = CGFloat(9)
    public static let sizeTreeIndent = CGFloat(16)
    public static let sizeTreeRow = CGFloat(19)
    public static let sizeWindowButton = CGFloat(40) /** 타이틀바 창 버튼 폭 */
    public static let space0 = CGFloat(0)
    public static let space12 = CGFloat(12)
    public static let space16 = CGFloat(16)
    public static let space2 = CGFloat(2)
    public static let space20 = CGFloat(20)
    public static let space24 = CGFloat(24)
    public static let space32 = CGFloat(32)
    public static let space4 = CGFloat(4)
    public static let space48 = CGFloat(48)
    public static let space6 = CGFloat(6)
    public static let space8 = CGFloat(8)
}