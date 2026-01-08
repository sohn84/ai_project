# 코딩 컨벤션

바이브코딩 AI 프로젝트의 코딩 스타일 가이드입니다.

## 일반 규칙

### 파일 및 폴더 명명

- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **유틸리티/헬퍼**: camelCase (예: `formatDate.ts`)
- **폴더**: kebab-case (예: `user-profile/`)
- **상수**: UPPER_SNAKE_CASE (예: `API_KEY`)

### 들여쓰기
- 스페이스 2칸 사용
- 탭 문자 사용 금지

## JavaScript/TypeScript

### 변수 선언
```typescript
// Good
const userName = 'John';
let count = 0;

// Bad
var userName = 'John';  // var 사용 금지
```

### 함수 선언
```typescript
// 화살표 함수 사용 (권장)
const getUserData = (userId: string) => {
  // ...
};

// 일반 함수도 허용
function getUserData(userId: string) {
  // ...
}
```

### 타입 정의
```typescript
// 인터페이스 사용 (객체 타입)
interface User {
  id: string;
  name: string;
  email: string;
}

// 타입 별칭 사용 (유니온, 유틸리티 타입)
type Status = 'pending' | 'approved' | 'rejected';
```

### Import 순서
```typescript
// 1. React 관련
import { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import axios from 'axios';

// 3. 내부 컴포넌트
import { Button } from '@/components/Button';

// 4. 유틸리티
import { formatDate } from '@/utils/date';

// 5. 타입
import type { User } from '@/types';

// 6. 스타일
import styles from './styles.module.css';
```

## React

### 컴포넌트 구조
```typescript
// 1. Import 문

// 2. 타입 정의
interface Props {
  title: string;
  onSubmit: () => void;
}

// 3. 컴포넌트 정의
export default function MyComponent({ title, onSubmit }: Props) {
  // 4. Hooks
  const [value, setValue] = useState('');

  // 5. 핸들러 함수
  const handleClick = () => {
    // ...
  };

  // 6. useEffect
  useEffect(() => {
    // ...
  }, []);

  // 7. 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Props 전달
```typescript
// Good - 구조 분해
function UserCard({ name, email }: UserCardProps) {
  return <div>{name}</div>;
}

// Bad - props 객체 직접 사용
function UserCard(props: UserCardProps) {
  return <div>{props.name}</div>;
}
```

## CSS

### 클래스 명명 (BEM 스타일)
```css
/* Block */
.user-card { }

/* Element */
.user-card__title { }
.user-card__description { }

/* Modifier */
.user-card--highlighted { }
```

### CSS Modules
```typescript
import styles from './UserCard.module.css';

<div className={styles.userCard}>
  <h2 className={styles.title}>Title</h2>
</div>
```

## Git 커밋 메시지

### 형식
```
<type>: <subject>

<body>
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (동작 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정, 패키지 등

### 예시
```
feat: Add user authentication

- Implement login/logout functionality
- Add JWT token management
- Create auth context provider
```

## 주석

### 함수 주석 (JSDoc)
```typescript
/**
 * 사용자 데이터를 가져옵니다.
 * @param userId - 사용자 ID
 * @returns 사용자 정보 객체
 */
async function getUserData(userId: string): Promise<User> {
  // ...
}
```

### 인라인 주석
```typescript
// Good - 복잡한 로직 설명
const discountedPrice = price * 0.9; // 10% 할인 적용

// Bad - 명확한 코드에 불필요한 주석
const sum = a + b; // a와 b를 더함
```

## 환경 변수

### 명명 규칙
```bash
# Next.js 클라이언트 사이드
NEXT_PUBLIC_API_URL=https://api.example.com

# 서버 사이드만
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret123
```

### 사용
```typescript
// 클라이언트 사이드
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 서버 사이드 (API 라우트, getServerSideProps 등)
const dbUrl = process.env.DATABASE_URL;
```

## 에러 처리

### Try-Catch
```typescript
async function fetchData() {
  try {
    const response = await api.getData();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // 또는 적절한 에러 처리
  }
}
```

### React 에러 바운더리
```typescript
// 중요한 컴포넌트는 에러 바운더리로 감싸기
<ErrorBoundary fallback={<ErrorPage />}>
  <MyComponent />
</ErrorBoundary>
```

## 성능 최적화

### React.memo 사용
```typescript
// 불필요한 리렌더링 방지
const MemoizedComponent = React.memo(MyComponent);
```

### useMemo, useCallback
```typescript
// 무거운 계산
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 함수 메모이제이션
const handleClick = useCallback(() => {
  // ...
}, [dependency]);
```

## 테스트

### 파일 명명
- 테스트 파일: `ComponentName.test.tsx`
- 테스트 유틸: `test-utils.ts`

### 기본 구조
```typescript
describe('UserCard', () => {
  it('renders user name correctly', () => {
    // Arrange
    const user = { name: 'John Doe' };

    // Act
    render(<UserCard user={user} />);

    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```
