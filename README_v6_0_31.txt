MY TRAVEL PLANNER v6.0.31 - PWA INSTALLABLE

핵심
- 기존 웹주소는 그대로 유지됩니다.
- 같은 웹사이트를 Windows PC / Android / iPhone 홈화면에 설치형 앱처럼 사용할 수 있습니다.
- 웹과 설치 앱은 동일한 Vercel API + Supabase 데이터를 사용합니다.
- 웹에서 추가/수정 → 설치 앱에서도 동일 데이터
- 앱에서 추가/수정 → 웹에서도 동일 데이터
- 사이트 비밀번호 1528 서버 인증 구조도 그대로 유지됩니다.

추가 파일
- manifest.webmanifest : 앱 이름/아이콘/실행방식
- sw.js               : PWA Service Worker
- pwa.js              : 설치 버튼 및 설치 처리
- offline.html        : 오프라인 안내
- icons/              : PC/모바일 앱 아이콘

설치
[Windows Edge / Chrome]
1. 웹사이트 접속
2. 화면 오른쪽 아래 '앱 설치' 클릭
3. 설치 승인
4. 바탕화면/시작메뉴에서 MY TRAVEL PLANNER 실행

[Android Chrome]
1. 웹사이트 접속
2. '앱 설치' 클릭
3. 설치 승인
4. 홈 화면 앱 아이콘으로 실행

[iPhone / iPad Safari]
1. Safari에서 웹사이트 접속
2. '앱 설치' 버튼을 누르면 안내가 표시됩니다.
3. Safari 공유 버튼
4. '홈 화면에 추가'
5. 생성된 앱 아이콘으로 실행

중요
- 설치 앱은 별도의 DB를 만들지 않습니다. 기존 Supabase를 그대로 사용합니다.
- /api/auth 및 /api/travel-data는 Service Worker가 캐시하지 않도록 처리했습니다.
- 따라서 여행 데이터와 비밀번호 인증정보가 오프라인 캐시에 저장되지 않습니다.
- 인터넷 연결이 없으면 읽기/수정 대신 오프라인 안내 화면을 표시합니다.
- 기존 Vercel 환경변수 TRAVEL_SITE_PASSWORD / TRAVEL_AUTH_SECRET은 변경하지 마세요.

배포
- 이 ZIP에서 PRIVATE_VERCEL_SETUP_DO_NOT_UPLOAD.txt는 보안을 위해 제외했습니다.
- 현재 GitHub 프로젝트에 파일 전체를 반영하면 됩니다.
- 기존 api 폴더와 config.js는 그대로 포함되어 있습니다.
- Vercel 자동배포 후 PWA 설치 기능이 활성화됩니다.

원복
- v6.0.30 파일(index.html/style.css)을 복원하고
  manifest.webmanifest, sw.js, pwa.js, offline.html, icons 폴더를 제거하면 됩니다.
