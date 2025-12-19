# AI Video Studio Admin

AI 기반 동영상 제작 및 관리를 위한 관리자 플랫폼입니다.

## 📋 프로젝트 개요

AI Video Studio Admin은 인공지능을 활용하여 동영상을 생성하고 관리할 수 있는 웹 기반 관리자 도구입니다. 직관적인 인터페이스를 통해 동영상 콘텐츠를 효율적으로 제작하고 관리할 수 있습니다.

## 🚀 주요 기능

### 1. 동영상 생성
- AI 기반 자동 동영상 제작
- 템플릿 기반 빠른 생성
- 커스터마이징 옵션

### 2. 편집 관리
- 직관적인 타임라인 편집
- 텍스트, 이미지, 음악 추가
- 실시간 미리보기

### 3. 콘텐츠 관리
- 동영상 라이브러리
- 메타데이터 관리
- 태그 및 카테고리 분류
- 검색 및 필터링

### 4. 사용자 관리
- 권한 기반 접근 제어
- 팀 협업 기능
- 활동 로그 추적

## 🛠 기술 스택

- **Framework**: Next.js 16.0.10
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: CSS3 (커스텀)

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18.x 이상
- npm

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3002](http://localhost:3002)를 열어 확인하세요.

> 이 프로젝트는 포트 3002에서 실행됩니다.

### 빌드

```bash
npm run build
npm start
```

### 린트

```bash
npm run lint
```

## 📁 프로젝트 구조

```
ai-video-studio-admin/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일
├── public/                # 정적 파일
├── next.config.ts         # Next.js 설정
├── tsconfig.json          # TypeScript 설정
└── package.json           # 프로젝트 의존성
```

## 🎨 디자인 컨셉

- **미니멀리즘**: 깔끔하고 직관적인 UI/UX
- **반응형**: 모바일, 태블릿, 데스크톱 지원
- **접근성**: WCAG 가이드라인 준수
- **다크 모드**: 추후 지원 예정

## 🔧 환경 변수

프로젝트에서 사용하는 환경 변수를 `.env.local` 파일에 설정하세요:

```bash
# API 설정 (예시)
NEXT_PUBLIC_API_URL=https://api.example.com

# AI 서비스 키 (예시)
AI_SERVICE_API_KEY=your_api_key_here
```

## 📝 개발 로드맵

### Phase 1: 기본 구조 (현재)
- [x] 프로젝트 초기 설정
- [x] 기본 레이아웃 구성
- [ ] 인증 시스템 구현

### Phase 2: 핵심 기능
- [ ] 동영상 업로드 및 관리
- [ ] AI 기반 동영상 생성 API 연동
- [ ] 편집 인터페이스 개발

### Phase 3: 고급 기능
- [ ] 실시간 협업 기능
- [ ] 템플릿 마켓플레이스
- [ ] 분석 및 리포트

## 🤝 기여 방법

이 프로젝트는 바이브코딩 학습 프로젝트입니다. 개선 사항이나 버그 리포트는 환영합니다!

## 📄 라이선스

개인 학습 프로젝트입니다.

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
