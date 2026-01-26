# 기술 스택

바이브코딩 AI 프로젝트에서 사용하는 기술 스택 목록입니다.

## 공통 기술

### 언어
- **JavaScript** - 동적 타입 스크립팅 언어
- **TypeScript** - JavaScript의 정적 타입 슈퍼셋

### 버전 관리
- **Git** - 분산 버전 관리 시스템
- **GitHub** - Git 저장소 호스팅

### 패키지 관리
- **npm** - Node.js 패키지 관리자

## 프로젝트별 기술 스택

### 1. Travel Expense

#### Frontend
- **Next.js 16** - React 기반 풀스택 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성

#### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL 데이터베이스
  - 실시간 기능
  - 인증 시스템
  - RESTful API

#### 배포
- **Vercel** - Next.js 배포 플랫폼

### 2. Chat App

#### Frontend
- **Next.js 15** - React 기반 프레임워크
- **React 19** - UI 라이브러리
- **@openai/chatkit-react** - OpenAI 채팅 UI 컴포넌트

#### API
- **OpenAI API** - AI 채팅 기능

#### 개발 도구
- **ESLint** - 코드 품질 도구

### 3. AI Video Studio Admin

#### Frontend
- **Next.js 16** - React 기반 풀스택 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS (예정)

#### AI & APIs
- **GPT-4 Vision** - 이미지 분석 및 설명 생성
- **OpenAI API** - 프롬프트 자동 생성
- **Luma Dream Machine** - AI 비디오 생성
- **Runway Gen-3** - AI 비디오 생성 (대안)

#### Backend & Storage
- **Next.js API Routes** - 서버리스 API
- **Supabase** - 데이터베이스 & 스토리지
  - PostgreSQL 데이터베이스
  - Storage (이미지, 비디오 파일)

#### 배포
- **Vercel** - Next.js 배포 플랫폼

### 4. BA Requirements Generator

#### Frontend
- **HTML5** - 마크업
- **CSS3** - 스타일링
- **Vanilla JavaScript** - 로직 구현

#### 특징
- 의존성 없음
- 순수 웹 기술만 사용
- 정적 웹 애플리케이션

### 5. AI Comparison (AI 비교하기)

#### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 (Next.js 대신 사용)
- **TypeScript** - 타입 안전성
- **Tailwind CSS 4** - 유틸리티 우선 CSS

#### AI & APIs
- **Gemini API (Vertex AI)** - Function Calling, Slot Filling
- **Hanatour MCP** - 여행 상품 데이터 (항공, 호텔, 패키지)

#### 디자인
- **Figma Make** - AI 기반 프로토타입 생성

#### 배포
- **Vercel** - 정적 사이트 배포

## 개발 도구

### 디자인 도구
- **Figma** - UI/UX 디자인
- **Figma Make** - AI 기반 프로토타입 자동 생성
  - 프롬프트 기반 UI 생성
  - React 코드 변환 지원
  - MCP 연동으로 Claude와 직접 통신

### 코드 에디터
- **VS Code** (권장)
  - IntelliSense
  - 디버깅
  - Git 통합
  - 확장 프로그램 생태계

### 권장 VS Code 확장
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅
- **TypeScript and JavaScript Language Features** - 타입스크립트 지원
- **Tailwind CSS IntelliSense** - Tailwind 자동완성 (사용 시)
- **GitLens** - Git 기능 강화
- **Auto Rename Tag** - HTML/JSX 태그 자동 이름 변경
- **ES7+ React/Redux/React-Native snippets** - React 스니펫

### 브라우저 개발자 도구
- **Chrome DevTools**
- **React Developer Tools**
- **Redux DevTools** (Redux 사용 시)

## 라이브러리 & 프레임워크

### UI/UX
- **React** - 컴포넌트 기반 UI
- **Next.js** - 서버 사이드 렌더링, 라우팅
- **CSS Modules** - 스타일 캡슐화

### 상태 관리
- **React Hooks** (useState, useContext 등)
- 필요 시 Redux 또는 Zustand 추가 가능

### HTTP 클라이언트
- **Fetch API** - 기본 HTTP 요청
- **axios** - 고급 HTTP 클라이언트 (필요 시)

### 폼 처리
- 기본 React state
- **React Hook Form** (복잡한 폼 처리 시)
- **Zod** - 스키마 검증 (필요 시)

## 데이터베이스

### Supabase (PostgreSQL)
- **특징**:
  - 실시간 데이터베이스
  - 행 수준 보안 (RLS)
  - RESTful API 자동 생성
  - 실시간 구독

## 인증

### Supabase Auth
- 이메일/비밀번호
- 소셜 로그인 (Google, GitHub 등)
- JWT 토큰 기반

## API & 서비스

### OpenAI API
- GPT 모델
- 채팅 완성
- 임베딩

### Supabase
- 데이터베이스 API
- 스토리지
- 실시간 기능

### Gemini API (Vertex AI)
- Function Calling - 도구 호출
- Slot Filling - 대화형 정보 수집
- 시스템 프롬프트 기반 대화

### MCP (Model Context Protocol)
- **하나투어 MCP** - 여행 상품 검색 API
  - 항공권, 호텔, 패키지 검색
  - JSON-RPC 2.0 기반
- **Figma MCP** - Figma 디자인 연동
  - Claude와 Figma 직접 통신
  - 디자인 토큰 추출

## 배포 & 호스팅

### Vercel
- **특징**:
  - Next.js 최적화
  - 자동 배포
  - 미리보기 배포
  - 엣지 네트워크
  - 환경 변수 관리

### GitHub Pages (정적 사이트)
- BA Requirements Generator와 같은 정적 사이트 호스팅

## 버전 정보

### Node.js
- **권장**: 18.x 이상
- **최소**: 16.x

### React
- Travel Expense: 19.2.0
- Chat App: 19.0.0

### Next.js
- Travel Expense: 16.0.3
- AI Video Studio Admin: 16.0.10
- Chat App: 15.0.0

### TypeScript
- **버전**: 5.x

## 향후 고려 기술

프로젝트 확장 시 고려할 수 있는 기술들:

### 테스팅
- **Jest** - JavaScript 테스팅 프레임워크
- **React Testing Library** - React 컴포넌트 테스트
- **Playwright** - E2E 테스트

### 스타일링
- **Tailwind CSS** - 유틸리티 우선 CSS
- **styled-components** - CSS-in-JS
- **Shadcn UI** - React 컴포넌트 라이브러리

### 상태 관리
- **Redux Toolkit** - 복잡한 전역 상태
- **Zustand** - 경량 상태 관리
- **TanStack Query (React Query)** - 서버 상태 관리

### 성능 모니터링
- **Vercel Analytics** - 웹 분석
- **Sentry** - 에러 추적
- **Lighthouse** - 성능 측정

### CI/CD
- **GitHub Actions** - 자동화 워크플로우
- **Vercel CI/CD** - 자동 배포

### 문서화
- **Storybook** - 컴포넌트 문서화
- **TypeDoc** - TypeScript API 문서
