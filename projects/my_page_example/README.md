# 예약조회 페이지 (My Page Example)

Figma Make에서 생성된 예약조회 페이지 예제 프로젝트입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS v4** - 스타일링
- **Lucide React** - 아이콘

## 기능

- 고객 정보 표시 (이름, 등급)
- 포인트/쿠폰 정보 (할인쿠폰, 상품권, 기프트카드, 마일리지)
- 예약 내역 타임라인 (항공, 호텔, 패키지, 티켓)
- 하단 네비게이션 메뉴

## 실행 방법

```bash
# 프로젝트 디렉토리로 이동
cd projects/my_page_example

# 의존성 설치
npm install

# 개발 서버 실행 (포트 3003)
npm run dev
```

## 스크립트

- `npm run dev` - 개발 서버 실행 (포트 3003)
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기

## 포트

- 개발 서버: **3003**

## 프로젝트 구조

```
my_page_example/
├── src/
│   ├── app/
│   │   └── App.tsx          # 메인 애플리케이션 컴포넌트
│   ├── styles/
│   │   ├── index.css        # 스타일 엔트리 포인트
│   │   ├── tailwind.css     # Tailwind 설정
│   │   └── theme.css        # 테마 변수
│   ├── main.tsx             # React 엔트리 포인트
│   └── vite-env.d.ts        # Vite 타입 정의
├── index.html               # HTML 템플릿
├── package.json             # 의존성 및 스크립트
├── vite.config.ts           # Vite 설정
├── tsconfig.json            # TypeScript 설정
└── postcss.config.mjs       # PostCSS 설정
```

## 원본 소스

- Figma Make: [예약조회 페이지 만들기](https://www.figma.com/make/3C3pgtHxCCrFqB1iPI0VpG)
