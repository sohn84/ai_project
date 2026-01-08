---
name: deploying-nextjs
description: Deploy Next.js applications to Vercel using CLI or GitHub integration. Use when user asks to deploy, mentions Vercel, or discusses deployment process.
allowed-tools: Read, Bash
---

# Next.js Vercel 배포 가이드

이 가이드는 Next.js 애플리케이션을 Vercel에 배포하는 방법을 설명합니다.

## 배포 방법

### 방법 1: Vercel CLI를 이용한 배포 (권장)

#### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2단계: Vercel 로그인
```bash
vercel login
```
이메일 또는 GitHub 계정으로 로그인합니다.

#### 3단계: 프로젝트 디렉토리에서 배포
```bash
cd projects/[your-project]
vercel
```

첫 배포 시 몇 가지 질문에 답변:
- **Set up and deploy?** → Yes
- **Which scope?** → 계정 선택
- **Link to existing project?** → No (신규 프로젝트)
- **Project name?** → 프로젝트명 입력
- **Directory?** → `./` (현재 디렉토리)
- **Override settings?** → No (기본값 사용)

#### 4단계: 프로덕션 배포
```bash
vercel --prod
```

### 방법 2: GitHub 연동 자동 배포

#### 1단계: GitHub에 코드 푸시
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2단계: Vercel 대시보드에서 연동
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **New Project** 클릭
3. **Import Git Repository** 선택
4. GitHub 저장소 선택
5. 프로젝트 설정 확인
6. **Deploy** 클릭

#### 3단계: 자동 배포 확인
- `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
- 다른 브랜치에 푸시하면 미리보기 배포 생성

---

## 환경 변수 설정

### Vercel Dashboard에서 설정
1. 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 변수 추가:
   - **Key**: 환경 변수 이름 (예: `NEXT_PUBLIC_API_URL`)
   - **Value**: 실제 값
   - **Environment**: Production, Preview, Development 선택

### 예시
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key
```

### CLI로 환경 변수 추가
```bash
vercel env add NEXT_PUBLIC_API_URL
```

---

## 도메인 설정

### Vercel 제공 도메인
기본적으로 `your-project.vercel.app` 도메인이 제공됩니다.

### 커스텀 도메인 추가
1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Domains**
3. **Add** 클릭
4. 도메인 입력 (예: `myapp.com`)
5. DNS 설정 안내에 따라 도메인 등록 업체에서 설정

---

## 배포 확인

### 배포 상태 확인
```bash
vercel ls
```

### 배포 로그 확인
```bash
vercel logs [deployment-url]
```

### 배포 취소 (롤백)
```bash
vercel rollback
```

---

## 주의사항

### 보안
- `.env.local` 파일은 **절대 GitHub에 커밋하지 않기**
- Vercel Dashboard에서만 환경 변수 설정
- API 키, 데이터베이스 연결 문자열 등은 환경 변수로 관리

### 빌드 설정
Vercel은 자동으로 Next.js 프로젝트를 감지하고 최적화된 빌드를 수행합니다.

**기본 빌드 명령어:**
```bash
npm run build
```

**커스텀 빌드 명령어 (필요 시):**
Vercel Dashboard → Settings → General → Build & Development Settings

### 성능 최적화
- Vercel은 자동으로 이미지 최적화, CDN 배포, 서버리스 함수 등을 제공
- Edge Network를 통해 전 세계 빠른 응답 속도 보장

---

## 문제 해결

### 빌드 실패
1. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```
2. 빌드 로그 확인:
   ```bash
   vercel logs
   ```
3. 환경 변수 확인: Vercel Dashboard에서 설정 확인

### 환경 변수 미적용
- Vercel Dashboard에서 환경 변수 재배포 필요
- 환경 변수 추가 후 **Redeploy** 클릭

### 도메인 연결 실패
- DNS 전파에 최대 48시간 소요될 수 있음
- DNS 설정이 올바른지 확인

---

## 유용한 명령어

```bash
# Vercel 프로젝트 정보
vercel inspect

# 로컬 개발 서버 (Vercel 환경 시뮬레이션)
vercel dev

# 프로젝트 제거
vercel remove [project-name]

# 도움말
vercel help
```

---

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

---

**배포가 완료되면 팀원들과 URL을 공유하세요! 🚀**
