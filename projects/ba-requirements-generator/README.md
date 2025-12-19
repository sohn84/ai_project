# BA Requirements Generator

비즈니스 분석가(BA)를 위한 요구사항 생성 도구입니다.

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Type**: Static Web Application

## 시작하기

### 실행 방법

이 프로젝트는 정적 웹 애플리케이션이므로 별도의 빌드 과정이 필요 없습니다.

#### 방법 1: 직접 열기
`index.html` 파일을 브라우저에서 직접 열어서 사용할 수 있습니다.

#### 방법 2: 로컬 서버 사용
더 나은 개발 경험을 위해 로컬 서버를 사용할 수 있습니다:

```bash
# Python 3 사용
python -m http.server 8000

# Node.js의 http-server 사용
npx http-server -p 8000
```

브라우저에서 [http://localhost:8000](http://localhost:8000)을 열어 확인하세요.

## 파일 구조

- `index.html` - 메인 HTML 파일
- `styles.css` - 스타일시트
- `script.js` - 애플리케이션 로직

## 주요 기능

- BA 요구사항 문서 자동 생성
- 사용자 친화적인 인터페이스
