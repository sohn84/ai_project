# 바이브코딩 종합 가이드라인 (Vibe Coding Guide)

이 문서는 AI 코딩 세션(바이브코딩)에서 프로젝트를 효율적으로 진행하기 위한 핵심 규칙과 워크플로우를 정의합니다. AI는 이 가이드를 준수하여 토큰을 절약하고 정확한 코드를 작성해야 합니다.

---

## 1. 핵심 워크플로우 (4단계)

> **원칙: "개발 전에 기획, 기획 전에 검증"**

1.  **초기 설정**: 프로젝트 폴더 생성 및 기술 스택 결정.
2.  **PRODUCT_SPEC 작성**: MVP 요구사항 정의 ([템플릿](./templates/PRODUCT_SPEC_TEMPLATE.md)).
3.  **목업 제작**: UI/UX 시각화 (HTML/CSS 프로토타입 추천).
4.  **개발 진행**: 주차별 계획에 따른 구현 및 테스트.

---

## 2. 기술 표준 및 규정

### 포트 할당 규칙
- **3000-3099**: Next.js / React 프로젝트
- **8000-8099**: 정적 웹 프로젝트 (Vanilla JS)
- **4000-4099**: 백엔드 API 서버

### 명명 규칙 (Naming Convention)
- **프로젝트 폴더**: `kebab-case` (예: `ai-comparison`)
- **컴포넌트 파일**: `PascalCase` (예: `UserProfile.tsx`)
- **유틸리티/함수**: `camelCase` (예: `formatDate.ts`)

### 환경 변수 관리
- `.env.local`은 절대 커밋하지 않음.
- `.env.example`을 반드시 생성하여 필요한 변수 목록 제공.

---

## 3. MCP(Model Context Protocol) 연동 규칙

MCP 서버(예: 하나투어 MCP)와 연동 시 다음 규칙을 엄격히 준수합니다.

### 데이터 형식 제약
- **날짜**: 반드시 `YYYYMMDD` 형식 사용 (예: `20260115`).
- **언어**: 도시/국가명은 반드시 **한글**로 입력 (예: `도쿄`, `일본`).
- **항공**: 서울(SEL) 출발 왕복 여정만 지원.

### 일관성 유지 (Function Calling)
다음 세 곳의 함수명과 파라미터명은 MCP 스펙과 **100% 일치**해야 합니다.
1. `mcpClient.ts`: API 래퍼 함수.
2. `geminiClient.ts`: `toolDeclarations`의 `name` 및 `properties`.
3. `UI Components`: `executeMcpFunction` 내의 `switch-case`.

### 시스템 프롬프트 필수 포함 사항
- 도구별 필수 파라미터 목록.
- 파라미터 형식 제약 (날짜 형식, 한글 필수 등).
- 도시-국가 매핑 테이블 (영문 입력 시 한글 변환용).

---

## 4. 공통 리소스 활용 (`shared/`)

중복 코드를 방지하기 위해 다음 디렉토리를 적극 활용합니다.
- `shared/components/`: 재사용 가능한 UI 컴포넌트.
- `shared/types/`: 공통 TypeScript 인터페이스.
- `shared/utils/`: 날짜 변환, 유효성 검사 등 공통 유틸리티.

---

## 5. 바이브코딩 체크리스트

### 작업 시작 전
- [ ] 작업 위치 확인 (`projects/[project-name]`).
- [ ] 기술 스택 및 기존 코드 스타일 파악.
- [ ] 필요한 환경 변수 확인 (`.env.example`).

### 개발 중
- [ ] MCP 연동 시 함수명/파라미터명 일관성 확인.
- [ ] 타입 안전성 유지 (TypeScript).
- [ ] 에러 핸들링 및 로딩 상태 구현.

### 작업 완료 후
- [ ] 빌드 성공 확인 (`npm run build`).
- [ ] 관련 문서(README, 가이드 등) 최신화.
- [ ] 환경 변수 변경 시 `.env.example` 업데이트.

---

## 6. 문서 업데이트 규칙

| 변경 사항 | 업데이트 대상 |
| :--- | :--- |
| 새 프로젝트 추가 | 루트 `README.md` 프로젝트 목록 |
| 새 기술 도입 | `docs/TECH_STACK.md` |
| 코딩 규칙 변경 | `docs/CONVENTIONS.md` |
| 설정 방법 변경 | `docs/SETUP.md` |

---

**참고**: 상세 프로젝트 목록은 루트 [README.md](../README.md)를 참조하세요.
