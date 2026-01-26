# AI 상품 비교 브리핑

AI가 여행 조건에 맞는 상품을 분석하고 비교해주는 브릿지 페이지입니다.

## 기술 스택

- **프레임워크**: React 18 + Vite
- **스타일링**: Tailwind CSS 4
- **언어**: TypeScript
- **아이콘**: Lucide React

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3003)
npm run dev

# 빌드
npm run build

# 빌드 프리뷰
npm run preview
```

## 프로젝트 구조

```
src/
├── app/
│   ├── App.tsx                    # 메인 앱 컴포넌트
│   └── components/
│       ├── TravelSelector.tsx     # 여행 동반자/테마 선택 탭
│       ├── AIBriefing.tsx         # AI 분석 브리핑
│       ├── ProductComparison.tsx  # 상품 비교 테이블
│       └── AIConcierge.tsx        # AI 컨시어지 채팅
├── imports/
│   ├── Reception.tsx              # 컨시어지 아이콘
│   └── svg-paths.ts               # SVG 경로 데이터
├── styles/
│   ├── index.css                  # 스타일 진입점
│   ├── fonts.css                  # 폰트 설정
│   ├── tailwind.css               # Tailwind 설정
│   └── theme.css                  # 테마 변수
└── main.tsx                       # 앱 진입점
```

## 주요 기능

### 1. 여행 조건 선택
- **여행 동반자**: 아이 동반, 부모님 효도, 커플·친구, 가성비 중시
- **여행 테마**: 휴양·힐링, 액티비티, 문화·관광, 맛집 투어

### 2. AI 브리핑
- 선택한 조건에 따라 맞춤 분석 제공
- 각 상품(A/B/C)별 추천 이유 설명

### 3. 상품 비교 테이블
- 가격, 브랜드, 일정, 호텔 등급, 쇼핑 횟수, 평점 비교
- 상품명 툴팁으로 상세 정보 확인

### 4. AI 컨시어지 채팅
- 추천 질문 버튼으로 빠른 질문
- 자유 텍스트 입력으로 상세 질문 가능
- 채팅 삭제 기능

## 포트

- 개발 서버: `3003`

## 원본

Figma Make에서 생성된 프로토타입 기반
