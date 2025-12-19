# 개발 환경 설정 가이드

바이브코딩 AI 프로젝트의 개발 환경을 설정하는 방법입니다.

## 필수 요구사항

### 1. Node.js 설치
- **권장 버전**: Node.js 18.x 이상
- **다운로드**: [Node.js 공식 사이트](https://nodejs.org/)

설치 확인:
```bash
node --version
npm --version
```

### 2. Git 설치
- **다운로드**: [Git 공식 사이트](https://git-scm.com/)

설치 확인:
```bash
git --version
```

## 프로젝트 클론

```bash
git clone <repository-url>
cd ai_project
```

## 프로젝트별 설정

### Next.js 프로젝트

#### Travel Expense / Chat App

1. 프로젝트 디렉토리로 이동
```bash
cd projects/travel-expense  # 또는 chat-app
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정 (필요한 경우)
```bash
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 값 설정
```

4. 개발 서버 실행
```bash
npm run dev
```

#### AI Video Studio Admin

1. 프로젝트 디렉토리로 이동
```bash
cd projects/ai-video-studio-admin
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
# .env.local 파일 생성 및 편집
OPENAI_API_KEY=your_openai_api_key
LUMA_API_KEY=your_luma_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 확인
```
http://localhost:3002
```

### 정적 웹 프로젝트 (BA Requirements Generator)

1. 프로젝트 디렉토리로 이동
```bash
cd projects/ba-requirements-generator
```

2. 로컬 서버 실행 (선택사항)
```bash
# Python 사용
python -m http.server 8000

# 또는 npx 사용
npx http-server -p 8000
```

3. 브라우저에서 `index.html` 직접 열기
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

## 에디터 설정

### VS Code (추천)

권장 확장 프로그램:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense (Tailwind 사용 시)

### 설정 파일

프로젝트 루트에 `.vscode/settings.json` 파일 생성:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 포트 관리

각 프로젝트는 다른 포트에서 실행됩니다:
- Travel Expense: `3000`
- Chat App: `3001`
- AI Video Studio Admin: `3002`
- BA Requirements Generator: `8000` (로컬 서버 사용 시)

## 문제 해결

### 포트 충돌
```bash
# 포트가 이미 사용 중인 경우
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### 의존성 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 캐시 문제
```bash
# Next.js 캐시 삭제
rm -rf .next
npm run dev
```

## 추가 도구

### 데이터베이스 (Supabase)
Travel Expense 프로젝트는 Supabase를 사용합니다.
- [Supabase 시작하기](https://supabase.com/docs)
- 계정 생성 및 프로젝트 설정 필요

### API 키 관리
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.env.example` 파일로 템플릿 제공
- 민감한 정보는 환경 변수로 관리
