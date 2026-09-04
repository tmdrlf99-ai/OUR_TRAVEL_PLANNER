MY TRAVEL PLANNER v6.0.32 — CUSTOM APP ICON

적용 내용
- 선택한 민트색 귀여운 여행가방 아이콘을 실제 앱 아이콘으로 적용
- Android/PWA: 192px, 512px
- Android maskable: 512px 안전영역 버전
- iPhone/iPad 홈 화면: 180px
- 브라우저 탭 favicon: 32px + favicon.ico
- Service Worker 캐시 버전을 v6.0.32로 갱신하여 기존 설치본도 새 아이콘을 다시 받도록 처리

업로드
이 ZIP의 파일/폴더 전체를 기존 프로젝트에 덮어쓰면 됩니다.
특히 아래 항목이 추가/변경되었습니다.
- icons/
- favicon.ico
- index.html
- manifest.webmanifest
- sw.js

주의
이미 홈 화면에 설치된 PWA는 OS가 기존 아이콘을 잠시 캐시할 수 있습니다.
배포 후 기존 앱을 삭제하고 다시 설치하면 새 아이콘이 가장 확실하게 표시됩니다.
