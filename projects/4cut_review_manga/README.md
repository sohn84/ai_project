# 4cut Review Manga

여행 리뷰를 4컷 만화로 자동 변환하는 AI 서비스

---

## 🎯 프로젝트 개요

하나투어 패키지 이용자들이 여행 리뷰를 작성하면, Google Gemini AI가 자동으로 4컷 만화를 생성해주는 서비스입니다.

### 핵심 기능
- **콘티 생성**: Gemini 2.0 Flash로 리뷰 기반 4컷 만화 콘티 자동 생성
- **이미지 생성**: Gemini Imagen 3로 4컷 만화 이미지 1장 생성
- **어드민 시스템**: 콘티 프롬프트 커스터마이징 및 단계별 생성 제어

---

## 🛠 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript (정적 웹)
- **AI API**:
  - Google Gemini 2.0 Flash Experimental (콘티 생성)
  - Google Imagen 3 (이미지 생성)
- **포트**: 8001

---

## 📦 설치 및 실행

### 1. API 키 설정

1. `config.js` 파일을 열어 `.env.local`의 `GOOGLE_AI_API_KEY` 값을 복사합니다:

```javascript
const CONFIG = {
  GOOGLE_AI_API_KEY: 'YOUR_API_KEY_HERE', // .env.local에서 복사
  // ...
};
```

2. `.gitignore`에 `config.js`가 포함되어 있는지 확인 (API 키 노출 방지)

### 2. 실행

브라우저에서 `admin.html` 파일을 엽니다:

```bash
# VSCode Live Server 사용 (권장)
# 또는 직접 파일 열기
start admin.html
```

---

## 📖 사용 방법

### 어드민 페이지 (admin.html)

1. **1단계: 콘티 시스템 프롬프트 설정**
   - 콘티 생성 방식을 제어하는 프롬프트 입력
   - 기본값이 제공되며, 수정 가능

2. **2단계: 리뷰 입력**
   - 여행 리뷰 텍스트 입력 (500자 이내)
   - [콘티 생성] 버튼 클릭

3. **3단계: 콘티 확인**
   - Gemini가 생성한 4컷 콘티 JSON 확인
   - 필요 시 수정 가능
   - [4컷 만화 생성] 버튼 클릭

4. **4단계: 4컷 만화 결과**
   - Gemini Imagen이 생성한 4컷 만화 이미지 확인
   - [다운로드] 버튼으로 PNG 저장

---

## 🎨 4컷 만화 생성 프로세스

```
사용자 리뷰 입력
    ↓
Gemini 2.0 Flash (콘티 생성)
    → JSON 형식으로 4컷 장면 + 대사 생성
    ↓
Gemini Imagen 3 (이미지 생성)
    → 2x2 그리드 4컷 만화 1장 생성
    ↓
다운로드 가능한 PNG 이미지
```

---

## 📁 파일 구조

```
4cut_review_manga/
├── admin.html          # 어드민 페이지 (메인)
├── style.css           # 공통 스타일
├── api.js              # Gemini API 헬퍼 함수
├── config.js           # API 키 설정 (git 제외)
├── .env.local          # 환경 변수 (git 제외)
├── .env.example        # 환경 변수 템플릿
├── .gitignore          # git 제외 파일 목록
├── PRODUCT_SPEC.md     # 제품 스펙 문서
└── README.md           # 이 파일
```

---

## ⚠️ 주의사항

### 보안
- `config.js`는 절대 git에 커밋하지 마세요 (API 키 노출 위험)
- `.gitignore`에 `config.js`가 포함되어 있는지 확인하세요
- 프로덕션 배포 시 Vercel Functions 등으로 API 키를 서버에서 관리하세요

### API 사용량
- Gemini API는 무료 티어 한도가 있습니다
- 이미지 생성은 시간이 소요될 수 있습니다 (최대 1분)

---

## 🚀 향후 계획

- [ ] 다양한 만화 스타일 선택 (웹툰, 일본 만화 등)
- [ ] 사용자 업로드 사진을 만화에 반영
- [ ] SNS 직접 공유 기능
- [ ] Supabase 연동 (리뷰 저장)
- [ ] 사용자용 리뷰 입력 페이지 (`index.html`)

---

## 📄 라이선스

이 프로젝트는 바이브코딩 AI 프로젝트 모노레포의 일부입니다.

---

## 🔗 관련 문서

- [PRODUCT_SPEC.md](PRODUCT_SPEC.md) - 상세 제품 스펙
- [루트 README.md](../../README.md) - 모노레포 전체 가이드
- [CLAUDE.md](../../CLAUDE.md) - 코딩 컨벤션

---

**Made with ❤️ by Vibe Coding**
