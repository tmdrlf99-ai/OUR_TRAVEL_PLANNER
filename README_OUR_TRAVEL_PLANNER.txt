OUR TRAVEL PLANNER v1.0.0

목적
- 기존 MY TRAVEL PLANNER와 동일한 UI/기능
- 여자친구와 함께 갔던 여행 + 앞으로 함께 갈 여행 전용
- 개인 여행 데이터와 완전히 분리

데이터 분리 방식
- 같은 Supabase 프로젝트 안에 별도 커플 전용 테이블 4개 사용
  couple_travel_trips
  couple_travel_events
  couple_travel_budgets
  couple_travel_places
- 브라우저 로컬 저장소 키도 couple_*로 별도 분리
- 개인용 MY TRAVEL PLANNER 데이터와 섞이지 않음

브랜딩
- MY TRAVEL PLANNER → OUR TRAVEL PLANNER
- 설치 앱 이름도 OUR TRAVEL PLANNER
- 기존 민트 여행가방 앱 아이콘 유지
- 해외지도 초기 화면은 동북아시아 중심 유지

배포 방법
1. GitHub에 새 저장소를 하나 생성
   권장 이름: our-travel-planner
2. 이 ZIP의 전체 파일을 새 저장소에 업로드
3. Vercel에서 해당 새 GitHub 저장소를 Import
4. 기존 개인용과 동일한 환경변수 설정
   - SUPABASE_URL
   - SUPABASE_PUBLISHABLE_KEY 또는 SUPABASE_SECRET_KEY
   - 사이트 비밀번호 관련 환경변수
5. 배포 완료 후 생성된 별도 Vercel 주소를 사용

주의
- 기존 MY TRAVEL PLANNER 저장소에는 이 파일을 덮어쓰지 마세요.
- 반드시 '새 저장소'와 '새 Vercel 프로젝트'로 배포해야 개인용과 커플용 링크가 분리됩니다.
