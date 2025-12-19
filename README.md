# 바이브코딩 AI 프로젝트

바이브코딩 학습 과정에서 개발한 다양한 AI 프로젝트들을 모아놓은 모노레포입니다.

## 프로젝트 구조

```
ai_project/
├── projects/           # 모든 프로젝트
├── docs/              # 공통 문서
└── shared/            # 공통 라이브러리 및 유틸리티
```

## 프로젝트 목록

### 1. [Travel Expense](./projects/travel-expense/)
- **설명**: 여행 경비 관리 애플리케이션
- **기술**: Next.js 16, TypeScript, Supabase
- **포트**: 3000

### 2. [Chat App](./projects/chat-app/)
- **설명**: OpenAI ChatKit 기반 채팅 애플리케이션
- **기술**: Next.js 15, React 19, OpenAI ChatKit
- **포트**: 3001

### 3. [BA Requirements Generator](./projects/ba-requirements-generator/)
- **설명**: 비즈니스 분석 요구사항 생성 도구
- **기술**: HTML, CSS, JavaScript (Vanilla)
- **타입**: 정적 웹 애플리케이션

### 4. [AI Video Studio Admin](./projects/ai-video-studio-admin/)
- **설명**: 이미지 4장을 AI로 분석해 8초 썸네일 영상을 자동 생성하는 사내 어드민 도구
- **기술**: Next.js 16, TypeScript, GPT-4 Vision, Luma Dream Machine, Supabase
- **포트**: 3002
- **주요 기능**: 이미지 분석, 프롬프트 자동 생성, AI 영상 생성

## 시작하기

각 프로젝트는 독립적으로 실행됩니다. 원하는 프로젝트 디렉토리로 이동하여 해당 README를 참고하세요.

```bash
# 예시: Travel Expense 프로젝트 실행
cd projects/travel-expense
npm install
npm run dev
```

## 개발 환경

- **Node.js**: 18.x 이상 권장
- **Package Manager**: npm
- **Git**: 버전 관리

## 문서

프로젝트 공통 문서는 [docs/](./docs/) 디렉토리를 참조하세요.

### 주요 문서
- [바이브코딩 가이드라인](./docs/VIBE_CODING_GUIDE.md) - AI 코딩 세션을 위한 종합 가이드
- [코딩 컨벤션](./docs/CONVENTIONS.md) - 코드 스타일 가이드
- [개발 환경 설정](./docs/SETUP.md) - 초기 설정 방법
- [기술 스택](./docs/TECH_STACK.md) - 사용 기술 목록

## 프로젝트 추가하기

새로운 프로젝트는 `projects/` 디렉토리 아래에 추가합니다:

```bash
cd projects
mkdir my-new-project
cd my-new-project
# 프로젝트 설정...
```

프로젝트를 추가한 후:
1. 프로젝트 디렉토리에 `README.md` 작성
2. 이 파일의 "프로젝트 목록"에 추가

## 라이선스

개인 학습 프로젝트입니다.
