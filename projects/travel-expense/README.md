# Travel Expense

여행 경비를 관리하는 Next.js 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Database**: Supabase
- **UI**: React 19

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 배포

배포 관련 정보는 [DEPLOY_NEXT.md](./DEPLOY_NEXT.md)를 참조하세요.
