# AI Project - Claude 작업 가이드

이 문서는 Claude가 바이브코딩 AI 프로젝트에서 작업할 때 항상 따라야 할 규칙과 가이드라인입니다.

## 1. 프로젝트 개요

**바이브코딩 AI 프로젝트 모노레포**
- 4개의 독립적인 AI 프로젝트를 포함하는 모노레포
- 각 프로젝트는 독립적으로 실행 가능
- `projects/` 디렉토리에 모든 프로젝트 위치
- `docs/` 디렉토리에 공통 문서
- `shared/` 디렉토리에 공통 컴포넌트 및 유틸리티

### 프로젝트 목록

| 프로젝트 | 포트 | 기술 스택 | 위치 |
|---------|------|----------|------|
| **travel-expense** | 3000 | Next.js 16, TypeScript, Supabase | `projects/travel-expense` |
| **chat-app** | 3001 | Next.js 15, React 19, OpenAI ChatKit | `projects/chat-app` |
| **ai-video-studio-admin** | 3002 | Next.js 16, TypeScript, GPT-4 Vision, Luma | `projects/ai-video-studio-admin` |
| **ba-requirements-generator** | 8000 | HTML, CSS, Vanilla JavaScript (정적) | `projects/ba-requirements-generator` |

---

## 2. 코딩 컨벤션

### 파일 및 폴더 명명 규칙

#### 컴포넌트 파일 (React)
- **PascalCase** 사용
- 예: `UserProfile.tsx`, `Button.tsx`, `LoginForm.tsx`

#### 유틸리티 및 헬퍼 파일
- **camelCase** 사용
- 예: `formatDate.ts`, `apiHelpers.ts`, `validation.ts`

#### 페이지 파일 (Next.js App Router)
- **kebab-case** 또는 **소문자** 사용
- 예: `page.tsx`, `layout.tsx`, `about-us/page.tsx`

#### 폴더명
- **kebab-case** 사용
- 예: `user-profile/`, `api-routes/`, `shared-components/`

#### 상수 파일
- **UPPER_SNAKE_CASE** 파일명 또는 변수명
- 예: `API_ENDPOINTS.ts`, `CONFIG.ts`
- 변수 예: `const MAX_RETRY_COUNT = 3;`

---

### JavaScript/TypeScript 코드 스타일

#### 변수 선언
```typescript
// ✅ 좋은 예
const userName = 'John';
let count = 0;

// ❌ 나쁜 예
var userName = 'John'; // var 사용 금지
```

#### 함수 선언
```typescript
// ✅ 화살표 함수 (권장)
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ✅ 일반 함수 (필요시)
function processData(data: Data): ProcessedData {
  // 처리 로직
  return processedData;
}
```

#### 타입 정의 (TypeScript)
```typescript
// ✅ Interface 사용 (객체 구조 정의)
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type 사용 (복잡한 타입, 유니온)
type Status = 'pending' | 'approved' | 'rejected';
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

#### Import 순서
```typescript
// 1. 외부 라이브러리
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/supabase-js';

// 2. 내부 라이브러리 (@로 시작)
import { Button } from '@/components/Button';
import { formatDate } from '@/utils/date';

// 3. 상대 경로 import
import { UserProfile } from './UserProfile';
import styles from './styles.module.css';
```

---

### React 컴포넌트 구조

```typescript
// ✅ 권장 구조
import React from 'react';
import { ComponentProps } from './types';

// Props 인터페이스
interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

// 컴포넌트
export const UserCard: React.FC<UserCardProps> = ({ name, email, onEdit }) => {
  // Hooks
  const [isEditing, setIsEditing] = useState(false);

  // Event handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  // Render
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};
```

#### Props 전달
```typescript
// ✅ 명시적 Props
<Button text="Submit" onClick={handleSubmit} variant="primary" />

// ✅ Spread 연산자 (필요시)
const buttonProps = { text: 'Submit', onClick: handleSubmit };
<Button {...buttonProps} />
```

---

### CSS 및 스타일링

#### 클래스명 (BEM 스타일)
```css
/* Block */
.user-card { }

/* Element */
.user-card__title { }
.user-card__description { }

/* Modifier */
.user-card--highlighted { }
.user-card__title--large { }
```

#### CSS Modules (Next.js)
```typescript
import styles from './UserCard.module.css';

<div className={styles.userCard}>
  <h2 className={styles.title}>...</h2>
</div>
```

---

### Git 커밋 메시지

#### 형식
```
<type>: <subject>

<body> (선택사항)
```

#### Type 종류
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `docs`: 문서 수정
- `test`: 테스트 코드
- `chore`: 빌드, 설정 파일 수정

#### 예시
```bash
feat: add user authentication with Supabase

fix: resolve infinite loop in useEffect

refactor: extract API calls to separate service file

docs: update README with deployment instructions
```

---

### 주석 작성

#### JSDoc 주석 (함수, 클래스)
```typescript
/**
 * 사용자 정보를 가져옵니다.
 * @param userId - 사용자 ID
 * @returns 사용자 정보 객체
 * @throws {Error} 사용자를 찾을 수 없을 때
 */
async function getUser(userId: string): Promise<User> {
  // 구현
}
```

#### 인라인 주석
```typescript
// ✅ 좋은 예: 복잡한 로직 설명
// 사용자가 관리자이고, 활성 상태일 때만 접근 허용
if (user.role === 'admin' && user.isActive) {
  // ...
}

// ❌ 나쁜 예: 불필요한 주석
// count를 1 증가시킴
count++;
```

---

### 환경 변수

#### 명명 규칙
```bash
# Next.js 클라이언트 노출 변수
NEXT_PUBLIC_API_URL=https://api.example.com

# 서버 전용 변수
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### 사용
```typescript
// 클라이언트
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 서버
const dbUrl = process.env.DATABASE_URL;
```

---

### 에러 처리

```typescript
// ✅ Try-catch 사용
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Data fetch failed');
}

// ✅ 에러 타입 체크
if (error instanceof ApiError) {
  // API 에러 처리
} else {
  // 일반 에러 처리
}
```

---

### 성능 최적화

#### React Hooks
```typescript
// ✅ useMemo: 비용이 큰 계산
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(input);
}, [input]);

// ✅ useCallback: 함수 메모이제이션
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

---

### 테스트

#### 파일 명명
```
Button.tsx
Button.test.tsx  # 유닛 테스트
Button.spec.tsx  # 통합 테스트
```

#### 기본 구조
```typescript
describe('Button Component', () => {
  it('renders with correct text', () => {
    // 테스트 코드
  });

  it('calls onClick when clicked', () => {
    // 테스트 코드
  });
});
```

---

## 3. 프로젝트 작업 규칙

### 프로젝트 개발 워크플로우 (필수)

모든 프로젝트는 다음 순서로 진행합니다:

```
1. 스펙 정의 (PRODUCT_SPEC.md)
   ↓
2. 목업 제작 (HTML/CSS 프로토타입 또는 와이어프레임)
   ↓
3. 검토 및 수정
   ↓
4. 개발 진행
```

#### 1단계: 스펙 정의
- **프로젝트 기획 인터뷰** (9단계) 진행
- `PRODUCT_SPEC.md` 작성
- 요구사항, 사용자 여정, 기술 스택 명확화
- **스킬 사용**: `/project-planning` 스킬 활용

#### 2단계: 목업 제작 (필수)
- **목적**: 개발 전 UI/UX 시각화 및 검증
- **방법**:
  - **HTML/CSS 프로토타입** (권장): 정적 UI만 먼저 구현
  - **와이어프레임 문서**: `MOCKUP.md` 작성
  - **Figma**: 디자인 툴 사용
- **산출물**: 클릭 가능한 프로토타입 또는 와이어프레임
- **중요**: 목업 없이 바로 개발 시작하지 않기

#### 3단계: 검토 및 수정
- 목업을 보고 사용자 플로우 검증
- 디자인 및 기능 피드백 반영
- 필요시 PRODUCT_SPEC 수정

#### 4단계: 개발 진행
- 목업을 기반으로 기능 구현
- 이미 UI가 확정되어 있어 개발 속도 향상

---

### 새 프로젝트 생성 시

#### 포트 할당 규칙
- **3000-3099**: Next.js/React 프로젝트
  - 3000: travel-expense
  - 3001: chat-app
  - 3002: ai-video-studio-admin
  - **3003부터**: 새 프로젝트 할당
- **8000-8099**: 정적 웹 프로젝트
  - 8000: ba-requirements-generator
  - **8001부터**: 새 정적 프로젝트 할당
- **4000-4099**: 백엔드 API 서버 (필요 시)

#### 필수 파일
1. **README.md**: 프로젝트 설명, 기술 스택, 실행 방법
2. **.env.example**: 환경 변수 템플릿 (실제 값 제외)
3. **package.json**: 의존성 및 스크립트 (Next.js 프로젝트)

#### 필수 문서 업데이트
- [ ] 루트 `README.md`의 프로젝트 목록에 추가
- [ ] `docs/TECH_STACK.md` 업데이트 (새 기술 사용 시)
- [ ] `docs/SETUP.md` 업데이트 (포트 및 설정 방법)

---

### 기존 프로젝트 수정 시

#### 작업 전 체크리스트
1. **프로젝트 README.md 먼저 읽기**
   - 기술 스택 확인
   - 실행 방법 확인
   - 환경 변수 요구사항 확인

2. **기존 코드 스타일 유지**
   - 기존 파일의 명명 규칙 따르기
   - 기존 컴포넌트 구조 패턴 따르기

3. **공통 컴포넌트 재사용 고려**
   - `shared/components/` 확인
   - 중복 코드 발견 시 공통화 제안

---

### 기술 스택 규칙

#### Next.js 프로젝트
- **TypeScript 사용 필수**
- App Router 사용 (Next.js 13+)
- 환경 변수는 `.env.local` 사용
- `.env.local`은 **절대 커밋하지 않기**
- `.env.example`로 템플릿 제공

#### 환경 변수 관리
```bash
# ✅ 좋은 예
# .env.example
NEXT_PUBLIC_API_URL=
DATABASE_URL=

# .env.local (git에서 제외)
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

#### Supabase 사용 프로젝트
- 환경 변수는 반드시 `.env.local`에 저장
- Row Level Security (RLS) 정책 확인
- 클라이언트는 `@supabase/supabase-js` 사용

---

## 4. 문서 업데이트 규칙

### 언제 문서를 업데이트해야 하나?

| 변경 사항 | 업데이트할 문서 |
|----------|---------------|
| 새 프로젝트 추가 | 루트 `README.md`, 새 프로젝트 `README.md` |
| 새 기술 스택 도입 | `docs/TECH_STACK.md` |
| 포트 변경 | `docs/SETUP.md` |
| 환경 변수 추가 | 프로젝트 `.env.example` |
| 공통 컴포넌트 추가 | `shared/` 내 README (필요 시) |

---

## 5. 공통 리소스 활용

### shared/ 디렉토리 구조
```
shared/
├── components/     # 재사용 가능한 React 컴포넌트
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

### 사용 예시
```typescript
// 공통 컴포넌트 사용
import { Button } from '@/shared/components/Button';

// 공통 타입 사용
import type { User } from '@/shared/types/user';

// 공통 유틸리티 사용
import { formatDate } from '@/shared/utils/date';
```

---

## 6. 모범 사례

### 프로젝트 독립성 유지
- 각 프로젝트는 독립적으로 실행 가능해야 함
- 자체 `package.json` 및 의존성
- 자체 환경 변수 설정
- 명확한 `README.md`

### 중복 코드 재사용
- 여러 프로젝트에서 사용하는 코드는 `shared/`로 이동
- 컴포넌트, 유틸리티, 타입 정의 등

### 환경 변수 보안
- `.env.local`은 **절대 git에 커밋하지 않기**
- `.gitignore`에 반드시 포함
- `.env.example`로 템플릿 제공
- API 키, DB 연결 문자열 등 민감 정보 보호

---

## 7. 참고 문서

프로젝트의 상세 가이드는 다음 문서를 참조하세요:

- **`docs/SETUP.md`**: 개발 환경 설정 방법
- **`docs/TECH_STACK.md`**: 사용 기술 스택 상세 정보
- **`docs/VIBE_CODING_GUIDE.md`**: 바이브코딩 워크플로우 (프로젝트 기획, PRODUCT_SPEC 작성)

---

## 8. 작업 체크리스트

### 코드 작성 시
- [ ] 코딩 컨벤션 준수 (파일명, 변수명, 함수 구조)
- [ ] TypeScript 타입 정의
- [ ] 에러 처리 추가
- [ ] 주석 작성 (복잡한 로직)

### 커밋 전
- [ ] 코드 포맷팅 확인 (Prettier/ESLint)
- [ ] 불필요한 파일 제외 (`.gitignore` 확인)
- [ ] 커밋 메시지 형식 준수 (`feat:`, `fix:`, etc.)
- [ ] 환경 변수 파일 커밋하지 않았는지 확인

### 새 프로젝트 추가 시
- [ ] 포트 할당 (3003+, 8001+, 4000+)
- [ ] README.md 작성
- [ ] .env.example 생성
- [ ] 루트 README.md 업데이트
- [ ] docs/TECH_STACK.md 업데이트 (새 기술 시)

---

**이 가이드를 따라 일관성 있고 유지보수하기 쉬운 코드를 작성하세요! 🚀**
