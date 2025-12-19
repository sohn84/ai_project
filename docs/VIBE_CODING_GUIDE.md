# 바이브코딩 가이드라인

이 문서는 AI 코딩 세션(바이브코딩)에서 `ai_project` 모노레포를 올바르게 이해하고 활용하기 위한 종합 가이드입니다.

## 목차

1. [바이브코딩 워크플로우](#바이브코딩-워크플로우)
2. [프로젝트 구조 개요](#프로젝트-구조-개요)
3. [현재 프로젝트 목록](#현재-프로젝트-목록)
4. [새 프로젝트 생성 가이드](#새-프로젝트-생성-가이드)
5. [기존 프로젝트 수정 가이드](#기존-프로젝트-수정-가이드)
6. [공통 리소스 활용](#공통-리소스-활용)
7. [문서 업데이트 규칙](#문서-업데이트-규칙)
8. [바이브코딩 체크리스트](#바이브코딩-체크리스트)
9. [모범 사례](#모범-사례)
10. [템플릿](#템플릿)
11. [문제 해결](#문제-해결)
12. [참고 문서](#참고-문서)

---

## 바이브코딩 워크플로우

### 핵심 원칙

> **"개발 전에 기획, 기획 전에 검증"**

코드를 작성하기 전에 무엇을 만들지 명확히 정의하고, UI/UX를 시각화하여 방향성을 확인합니다.

### 표준 워크플로우 (4단계)

```
1단계: 프로젝트 초기 설정
   ↓
2단계: PRODUCT_SPEC 작성 (MVP 확인)
   ↓
3단계: 목업 제작 (UI/UX 시각화)
   ↓
4단계: 개발 진행
```

### 1단계: 프로젝트 초기 설정

#### 목적
- 프로젝트 기본 구조 생성
- 기술 스택 결정
- 개발 환경 준비

#### 체크리스트

**프로젝트 생성**
```bash
cd projects
npx create-next-app@latest project-name  # Next.js
# 또는
mkdir project-name  # 정적 프로젝트
```

**초기화 옵션 (Next.js):**
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: 필요에 따라
- App Router: Yes
- Import alias: Yes (@/*)

**포트 할당 규칙:**
- **3000-3099**: Next.js/React 프로젝트
  - 3000: travel-expense
  - 3001: chat-app
  - 3002: ai-video-studio-admin
  - 3003-3099: 새 프로젝트용 예약
- **8000-8099**: 정적 웹 프로젝트
  - 8000: ba-requirements-generator
  - 8001-8099: 새 정적 프로젝트용 예약
- **4000-4099**: 백엔드 API 서버 (필요 시)

**포트 설정 (Next.js):**
```json
// package.json
{
  "scripts": {
    "dev": "next dev -p 3003"
  }
}
```

**기본 README.md 작성:**
```markdown
# [프로젝트 이름]

## 설명
[간단한 설명]

## 기술 스택
- [기술 나열]

## 시작하기
\`\`\`bash
npm install
npm run dev
\`\`\`

## 포트
- 개발: [포트 번호]
```

**문서 업데이트:**
- [ ] 루트 `README.md`의 프로젝트 목록에 추가
- [ ] `docs/TECH_STACK.md` 업데이트 (새 기술 사용 시)
- [ ] `docs/SETUP.md` 업데이트 (포트 및 설정)
- [ ] 이 문서(`VIBE_CODING_GUIDE.md`)의 프로젝트 목록 테이블 업데이트

#### 산출물
- ✅ 프로젝트 폴더 생성
- ✅ 기본 README.md
- ✅ 포트 할당 완료
- ✅ 관련 문서 업데이트 완료

---

### 2단계: PRODUCT_SPEC 작성

#### 목적
- 프로덕트 아이디어를 구체화
- 요구사항 명확히 정의
- 개발 방향 합의

#### 진행 방법: 프로덕트 기획 인터뷰 (9단계)

1. **Step 0**: 초기 아이디어 듣기
2. **Step 1**: 배경 이해하기
3. **Step 2**: 문제 정의하기
4. **Step 3**: 타겟 사용자 파악하기
5. **Step 4**: 목적과 목표 설정하기
6. **Step 5**: 솔루션 구체화하기
7. **Step 6**: 핵심 기능 정의하기
8. **Step 7**: 비즈니스 모델 설계하기
9. **Step 8**: 실행 계획 수립하기

각 단계에서 3-5개의 핵심 질문을 하고, 답변을 들은 후 요약하며 다음 단계로 진행합니다.

#### PRODUCT_SPEC.md 구조

필수 섹션:
1. 배경 & 문제
2. 목적 & 목표
3. 타겟 사용자
4. 솔루션
5. 핵심 기능
6. 비즈니스 모델
7. 기술 스택
8. 실행 계획
9. 다음 단계 (Action Items)
10. 성공 기준

상세 템플릿은 [템플릿](#템플릿) 섹션 참조

#### 체크리스트

- [ ] 프로덕트 기획 인터뷰 완료
- [ ] `PRODUCT_SPEC.md` 파일 생성 (프로젝트 폴더 내)
- [ ] 핵심 내용 검증
  - 문제 정의 명확한가?
  - 타겟 사용자 구체적인가?
  - 사용자 여정 7단계 이하로 단순한가?
  - MVP 기능이 명확한가?
  - 성공 기준이 측정 가능한가?
- [ ] 팀/클라이언트 리뷰 (해당 시)

#### 산출물
- ✅ `PRODUCT_SPEC.md` 파일
- ✅ 명확한 요구사항
- ✅ 사용자 여정 정의
- ✅ 기술 스택 결정
- ✅ 주차별 개발 계획

---

### 3단계: 목업 제작

#### 목적
- UI/UX 사전 시각화
- 사용자 플로우 검증
- 개발 전 디자인 확정
- 개발 시 명확한 레퍼런스 제공

#### 목업 제작 방법

**옵션 1: HTML/CSS 프로토타입 (추천) ⭐**

장점:
- 실제 개발 코드의 기반
- 클릭 가능한 인터랙티브 프로토타입
- Tailwind CSS로 빠른 스타일링
- 반응형 테스트 가능

방법:
```bash
# 프로젝트 내에서 정적 UI만 먼저 구현
cd projects/[project-name]

# 각 페이지 UI만 만들기 (기능 없음)
# app/page.tsx - 정적 UI
# app/create/page.tsx - 정적 UI
```

**옵션 2: 와이어프레임 문서**

장점:
- 빠른 작성
- 구조 집중

방법:
```markdown
# MOCKUP.md 파일 생성

## 1. 홈 페이지
┌─────────────────────────────┐
│  프로젝트 타이틀            │
├─────────────────────────────┤
│  [+ 새로 만들기]            │
├─────────────────────────────┤
│  📂 내 작업물               │
│  ├ 항목1                   │
│  ├ 항목2                   │
└─────────────────────────────┘
```

**옵션 3: 디자인 툴**

도구: Figma, Excalidraw, Sketch

장점:
- 시각적으로 정교함
- 디자이너와 협업 용이

단점:
- 시간이 더 걸림
- 코드로 변환 필요

#### 체크리스트

- [ ] 목업 방법 선택
- [ ] 모든 화면 목업 제작 (사용자 여정 각 단계)
- [ ] 스타일 가이드 정의
  - 색상 팔레트
  - 폰트 (제목, 본문)
  - 간격, 버튼, 카드 스타일
- [ ] 반응형 고려 (필요 시)
- [ ] 사용자 플로우 검증
- [ ] 목업 리뷰 및 승인

#### 산출물
- ✅ 클릭 가능한 프로토타입 또는
- ✅ `MOCKUP.md` 파일 또는
- ✅ Figma/Sketch 파일

---

### 4단계: 개발 진행

#### 목적
- 목업을 실제 동작하는 코드로 구현
- PRODUCT_SPEC의 기능 구현
- 테스트 및 배포

#### 개발 순서

**환경 설정:**
```bash
# API 키 발급
# - OpenAI API (필요 시)
# - Supabase 프로젝트 생성
# - 기타 서비스 API 키

# .env.local 파일 생성
```

**주차별 개발 (PRODUCT_SPEC 참조):**

- **Week 1**: 기본 UI 구조
  - 목업을 실제 컴포넌트로 변환
  - 라우팅 설정
  - 기본 레이아웃

- **Week 2**: 핵심 기능 구현
  - API 연동
  - 데이터 처리 로직
  - 상태 관리

- **Week 3**: 추가 기능 & 통합
  - 남은 기능 구현
  - 전체 플로우 연결
  - 에러 처리

- **Week 4**: 테스트 & 배포
  - 기능 테스트
  - 버그 수정
  - 배포 준비

#### 체크리스트

- [ ] 환경 설정 완료
- [ ] Week 1: 모든 페이지 라우팅, 기본 UI
- [ ] Week 2: 핵심 기능 동작, API 연동
- [ ] Week 3: 전체 플로우 연결, 에러 처리
- [ ] Week 4: 테스트 통과, 버그 수정, 배포
- [ ] 문서 업데이트 (README, `.env.example`)

#### 산출물
- ✅ 동작하는 애플리케이션
- ✅ 테스트 완료
- ✅ 배포 완료
- ✅ 문서 최신화

---

### 프로젝트 크기별 가이드

| 프로젝트 크기 | 워크플로우 | 예시 | 기간 |
|--------------|-----------|------|------|
| **대형** (신규 서비스) | 1→2→3→4 전체 | 새로운 SaaS, 복잡한 AI 기능, 10+ 페이지 | 4-8주 |
| **중형** (주요 기능 추가) | 1→2(간략)→3→4 | 기존 프로젝트에 주요 기능, 3-5 페이지 | 2-4주 |
| **소형** (버그 수정, 작은 기능) | 바로 4 (개발) | 버그 수정, UI 개선, 1-2 페이지 | 1-5일 |
| **실험** (기술 검증) | 4 → (검증 후) → 2→3→4 | 새로운 AI 모델 테스트, POC | 1-3일 + 2-4주 |

---

## 프로젝트 구조 개요

```
ai_project/
├── projects/           # 모든 개별 프로젝트
│   ├── travel-expense/
│   ├── chat-app/
│   ├── ai-video-studio-admin/
│   └── ba-requirements-generator/
├── docs/              # 공통 문서
│   ├── VIBE_CODING_GUIDE.md (이 문서)
│   ├── CONVENTIONS.md
│   ├── SETUP.md
│   └── TECH_STACK.md
├── shared/            # 공통 라이브러리 및 유틸리티
│   ├── components/
│   ├── types/
│   └── utils/
└── README.md          # 프로젝트 루트 문서
```

### 디렉토리 역할

- **`projects/`**: 모든 독립 프로젝트를 포함. 각 프로젝트는 자체 README와 설정을 가짐
- **`docs/`**: 프로젝트 전체에 적용되는 공통 문서
- **`shared/`**: 여러 프로젝트에서 재사용 가능한 공통 코드

---

## 현재 프로젝트 목록

| 프로젝트 | 기술 스택 | 포트 | 설명 |
|---------|----------|------|------|
| **travel-expense** | Next.js 16, TypeScript, Supabase | 3000 | 여행 경비 관리 애플리케이션 |
| **chat-app** | Next.js 15, React 19, OpenAI ChatKit | 3001 | AI 채팅 애플리케이션 |
| **ai-video-studio-admin** | Next.js 16, TypeScript, GPT-4 Vision, Luma | 3002 | AI 썸네일 영상 자동 제작 도구 |
| **ba-requirements-generator** | HTML, CSS, Vanilla JS | 8000 | BA 요구사항 생성 도구 (정적) |

---

## 새 프로젝트 생성 가이드

### Vanilla JS 프로젝트

간단한 정적 웹 애플리케이션, 의존성 없는 도구

```bash
cd projects
mkdir my-new-project
cd my-new-project
touch index.html styles.css script.js README.md
```

### 필수 파일

#### `.env.example` (환경 변수 사용 시)
```bash
# API Keys
NEXT_PUBLIC_API_URL=
API_SECRET_KEY=

# Database
DATABASE_URL=
```

---

## 기존 프로젝트 수정 가이드

### 1. 프로젝트 탐색

작업 전 다음을 확인:

```bash
# 프로젝트 구조 확인
cd projects/[project-name]
ls -la

# README 읽기
cat README.md

# package.json 확인 (Next.js 프로젝트)
cat package.json
```

### 2. 수정 전 확인사항

- [ ] 프로젝트의 기술 스택 확인 (`package.json`, `README.md`)
- [ ] 기존 코드 스타일 파악 (`docs/CONVENTIONS.md` 참조)
- [ ] 환경 변수 요구사항 확인 (`.env.example`)
- [ ] 의존성 설치 상태 확인 (`node_modules` 존재 여부)

### 3. 의존성 관리

#### 새 패키지 추가
```bash
cd projects/[project-name]
npm install [package-name]
```

#### 의존성 업데이트
```bash
npm update
# 또는 특정 패키지만
npm update [package-name]
```

#### 의존성 문제 해결
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 4. 개발 서버 실행

```bash
# Next.js 프로젝트
cd projects/[project-name]
npm run dev

# 정적 프로젝트
cd projects/[project-name]
npx http-server -p 8000
# 또는 브라우저에서 index.html 직접 열기
```

---

## 공통 리소스 활용

### shared/ 디렉토리 구조

```
shared/
├── components/     # 재사용 가능한 React 컴포넌트
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

### 공통 컴포넌트 사용

```typescript
// projects/my-project/src/app/page.tsx
import { Button } from '@/shared/components/Button';
import { formatDate } from '@/shared/utils/date';
import type { User } from '@/shared/types/user';

export default function Page() {
  return <Button>Click me</Button>;
}
```

### 공통 타입 정의

`shared/types/`에 공통 타입을 정의하여 여러 프로젝트에서 재사용:

```typescript
// shared/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// shared/types/api.ts
export interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

### 공통 유틸리티

`shared/utils/`에 재사용 가능한 함수 작성:

```typescript
// shared/utils/date.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR');
}

// shared/utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 문서 업데이트 규칙

### 언제 문서를 업데이트해야 하나?

| 변경 사항 | 업데이트할 문서 |
|----------|---------------|
| 새 프로젝트 추가 | `README.md` (루트), 새 프로젝트의 `README.md`, 이 문서의 프로젝트 목록 |
| 새 기술 스택 도입 | `docs/TECH_STACK.md` |
| 코딩 컨벤션 변경 | `docs/CONVENTIONS.md` |
| 설정 방법 변경 | `docs/SETUP.md` |
| 공통 컴포넌트 추가 | `shared/` 내 해당 README (필요 시 생성) |

### README.md 업데이트 체크리스트

#### 루트 README.md
- [ ] 프로젝트 목록에 새 프로젝트 추가
- [ ] 프로젝트 설명, 기술 스택, 포트 정보 정확히 기재
- [ ] 링크가 올바른지 확인 (`./projects/[project-name]/`)

#### 프로젝트별 README.md
- [ ] 프로젝트 설명이 명확한지 확인
- [ ] 설치 및 실행 방법이 정확한지 확인
- [ ] 환경 변수 요구사항 문서화
- [ ] 주요 기능 나열

### TECH_STACK.md 업데이트

새로운 기술을 도입할 때:

```markdown
### N. [프로젝트 이름]

#### Frontend
- **[기술 이름]** - [설명]

#### Backend (해당 시)
- **[기술 이름]** - [설명]

#### 배포
- **[플랫폼]** - [설명]
```

---

## 바이브코딩 체크리스트

### 작업 시작 전

- [ ] 작업할 프로젝트 위치 확인 (`projects/[project-name]`)
- [ ] 프로젝트 README.md 읽기
- [ ] 기존 코드 스타일 확인 (`docs/CONVENTIONS.md`)
- [ ] 필요한 환경 변수 확인 (`.env.example`)
- [ ] 의존성 설치 확인 (`npm install` 실행 여부)

### 새 프로젝트 생성 시

- [ ] 워크플로우 선택 (대/중/소형)
- [ ] 1단계: 프로젝트 초기 설정
- [ ] 2단계: PRODUCT_SPEC 작성 (대/중형)
- [ ] 3단계: 목업 제작 (대/중형)
- [ ] 4단계: 개발 진행

### 기존 프로젝트 수정 시

- [ ] 프로젝트 구조 파악
- [ ] 코딩 컨벤션 준수
- [ ] 기존 패턴 유지
- [ ] 공통 컴포넌트 재사용 고려 (`shared/`)
- [ ] 타입 안전성 유지 (TypeScript 프로젝트)

### 작업 완료 후

- [ ] 개발 서버에서 정상 작동 확인
- [ ] 빌드 성공 확인 (`npm run build`)
- [ ] 관련 문서 업데이트
- [ ] 환경 변수 변경 시 `.env.example` 업데이트
- [ ] 코드 포맷팅 확인 (Prettier/ESLint)

### 커밋 전

- [ ] 변경 사항 검토
- [ ] 불필요한 파일 제외 (`.gitignore` 확인)
- [ ] 커밋 메시지 작성 (`docs/CONVENTIONS.md` 참조)
- [ ] 관련 문서가 모두 업데이트되었는지 확인

---

## 모범 사례

### 1. 프로젝트 독립성 유지

각 프로젝트는 독립적으로 실행 가능해야 합니다:
- 자체 `package.json` 및 의존성
- 자체 환경 변수 설정
- 명확한 README.md

### 2. 공통 코드 재사용

중복 코드를 발견하면 `shared/`로 이동:
```bash
# 예: 여러 프로젝트에서 사용하는 유틸리티
mv projects/project-a/utils/formatDate.ts shared/utils/
```

### 3. 일관된 명명 규칙

- **프로젝트 폴더**: kebab-case (`my-new-project`)
- **컴포넌트 파일**: PascalCase (`UserProfile.tsx`)
- **유틸리티 파일**: camelCase (`formatDate.ts`)

### 4. 환경 변수 관리

- `.env.local`은 절대 커밋하지 않기
- `.env.example`로 템플릿 제공
- 민감한 정보는 환경 변수로만 관리

### 5. 문서 최신화

코드 변경과 함께 문서도 즉시 업데이트:
- 새 기능 추가 → README 업데이트
- 새 기술 도입 → TECH_STACK 업데이트
- 컨벤션 변경 → CONVENTIONS 업데이트

---

## 템플릿

### PRODUCT_SPEC.md 템플릿

```markdown
# [프로젝트명] - Product Specification

## 1. 배경 & 문제
### 현재 상황
[설명]

### 핵심 문제
> "[한 문장으로 문제 정의]"

### 해결 기회
[설명]

---

## 2. 목적 & 목표
### 비전 (1년)
[설명]

### 미션
> "[한 문장으로 미션]"

### 3개월 목표
1. [목표 1]
2. [목표 2]
3. [목표 3]

### 핵심 KPI
- 💰 [지표 1]
- 📈 [지표 2]
- 👥 [지표 3]

---

## 3. 타겟 사용자
### 페르소나: [이름] ([나이])
- 직급: [설명]
- 업무: [설명]
- 과제: [설명]
- 능력: [설명]
- 환경: [설명]
- 절실함: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)

---

## 4. 솔루션
### 한 줄 설명
> "[한 줄로 설명]"

### 핵심 차별점
1. [차별점 1]
2. [차별점 2]
3. [차별점 3]

---

## 5. 핵심 기능
### 사용자 여정
1. [단계 1]
2. [단계 2]
3. [단계 3]
...

### MVP 필수 기능
1. ✅ [기능 1]
2. ✅ [기능 2]
3. ✅ [기능 3]

### 향후 추가
- [기능 A]
- [기능 B]

---

## 6. 비즈니스 모델
[비용 구조, ROI 등]

---

## 7. 기술 스택
### 프론트엔드
- [기술]

### 백엔드
- [기술]

### AI & API
- [기술]

### 배포
- [플랫폼]

---

## 8. 실행 계획
### 개발 일정
- Week 1: [할 일]
- Week 2: [할 일]
- Week 3: [할 일]
- Week 4: [할 일]

### 주요 리스크 & 대응
| 리스크 | 대응 전략 |
|--------|-----------|
| [리스크 1] | [대응 1] |
| [리스크 2] | [대응 2] |

---

## 9. 다음 단계 (Action Items)
### 즉시 (이번 주)
- [ ] [할 일 1]
- [ ] [할 일 2]

### Week 1
- [ ] [할 일 1]
- [ ] [할 일 2]

---

## 10. 성공 기준
### MVP 성공 (1개월)
- [ ] [기준 1]
- [ ] [기준 2]

### 파일럿 성공 (3개월)
- [ ] [기준 1]
- [ ] [기준 2]

### 전사 확대 (6개월)
- [ ] [기준 1]
- [ ] [기준 2]
```

---

## 문제 해결

### 포트 충돌

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### 의존성 문제

```bash
# 캐시 정리 및 재설치
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Next.js 빌드 오류

```bash
# .next 캐시 삭제
rm -rf .next
npm run dev
```

### 타입 오류 (TypeScript)

```bash
# 타입 체크
npx tsc --noEmit

# 타입 정의 재설치
rm -rf node_modules/@types
npm install
```

---

## 참고 문서

### 내부 문서
- [코딩 컨벤션](./CONVENTIONS.md) - 코드 스타일 가이드
- [개발 환경 설정](./SETUP.md) - 초기 설정 방법
- [기술 스택](./TECH_STACK.md) - 사용 기술 목록
- [루트 README](../README.md) - 프로젝트 개요

### 외부 리소스

**Next.js**
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)

**TypeScript**
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs)

**Supabase**
- [Supabase 공식 문서](https://supabase.com/docs)

**Vercel**
- [Vercel 배포 가이드](https://vercel.com/docs)

---

## AI에게 워크플로우 요청하기

세션 시작 시 명시적으로 요청:

```
"새 프로젝트를 시작합니다.
바이브코딩 워크플로우를 따라 진행해주세요."
```

특정 단계부터:

```
"바이브코딩 워크플로우 2단계를 시작해주세요.
PRODUCT_SPEC 작성을 위한 프로덕트 기획 인터뷰를 진행합시다."
```

체크리스트 확인:

```
"1단계 체크리스트를 확인해주세요.
완료되지 않은 항목이 있나요?"
```

---

**준비되셨나요? 바이브코딩을 시작하세요! 🚀**
