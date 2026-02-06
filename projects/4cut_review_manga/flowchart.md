# 4cut Review Manga - 프로세스 흐름도

## 전체 프로세스 플로우

```mermaid
flowchart TD
    Start([시작: 어드민 페이지 접속<br/>admin.html]) --> MangaType[만화 종류 선택<br/>• 여행 만화 기-승-전-결<br/>• 일상 만화 상황-전개-클라이맥스-마무리]
    
    MangaType --> Step1[1단계: 콘티 시스템 프롬프트 설정<br/>• 선택한 만화 종류에 따라 템플릿 자동 로드<br/>• 수동 수정 가능]
    
    Step1 --> Step2[2단계: 리뷰 입력<br/>• 여행 리뷰 텍스트 입력 500자 이내<br/>• 콘티 생성 버튼 클릭]
    
    Step2 -->|콘티 생성| API1[Gemini 2.0 Flash API 호출<br/>generateContiWithGemini<br/>• 시스템 프롬프트 + 리뷰 텍스트 전송<br/>• JSON 형식 콘티 응답 요청]
    
    API1 -->|성공| ContiProcess[콘티 데이터 처리<br/>• JSON 파싱<br/>• normalizeConti - 데이터 정규화<br/>• 한국어 키 → 표준 키 변환]
    
    API1 -->|실패| Error1[에러 처리<br/>• 콘티 생성 실패 시<br/>에러 메시지 표시]
    
    ContiProcess --> Step3[3단계: 콘티 확인<br/>• 생성된 콘티 JSON 표시<br/>• 수정 가능 텍스트 영역<br/>• 4컷 만화 생성 버튼 활성화]
    
    Step3 -->|4컷 만화 생성| StyleExtract[스타일 가이드 추출<br/>extractStyleGuide<br/>• 시스템 프롬프트에서 스타일 가이드 섹션 추출<br/>• 한국어 → 영문 변환<br/>그림체, 색상, 분위기]
    
    StyleExtract --> ImagePrompt[이미지 생성 프롬프트 생성<br/>• 콘티 데이터 4컷 + 스타일 가이드 결합<br/>• 2x2 그리드 레이아웃 지시<br/>• 각 컷의 장소, 그림묘사, 대사 포함]
    
    ImagePrompt --> API2[Gemini 3 Pro Image API 호출<br/>generateMangaImageWithGemini<br/>• 이미지 생성 프롬프트 전송<br/>• Base64 인코딩된 PNG 이미지 응답]
    
    API2 -->|성공| Step4[4단계: 4컷 만화 결과<br/>• 생성된 이미지 표시<br/>• 다운로드 버튼 활성화]
    
    API2 -->|실패| Error2[에러 처리<br/>• 이미지 생성 실패 시<br/>플레이스홀더 이미지 표시]
    
    Step4 -->|다운로드| Download[다운로드<br/>downloadImage<br/>• PNG 파일로 저장<br/>• 파일명: 4cut-manga-YYYYMMDD.png]
    
    Step2 -.->|언제든지 초기화| Reset[초기화 버튼<br/>• 모든 입력값 리셋<br/>• 만화 종류를 여행 만화로 복원<br/>• 모든 단계 초기화]
    
    Reset -.->|초기화 후| MangaType
    
    style Start fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    style Download fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    style MangaType fill:#fff2cc,stroke:#d6b656,stroke-width:2px
    style Step1 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style Step2 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style Step3 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style Step4 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style API1 fill:#f8cecc,stroke:#b85450,stroke-width:2px
    style API2 fill:#f8cecc,stroke:#b85450,stroke-width:2px
    style ContiProcess fill:#e1d5e7,stroke:#9673a6,stroke-width:2px
    style StyleExtract fill:#e1d5e7,stroke:#9673a6,stroke-width:2px
    style ImagePrompt fill:#e1d5e7,stroke:#9673a6,stroke-width:2px
    style Error1 fill:#f8cecc,stroke:#b85450,stroke-width:2px,stroke-dasharray: 5 5
    style Error2 fill:#f8cecc,stroke:#b85450,stroke-width:2px,stroke-dasharray: 5 5
    style Reset fill:#ffe6cc,stroke:#d79b00,stroke-width:2px,stroke-dasharray: 5 5
```

## 주요 단계 설명

### 1. 초기 설정
- **만화 종류 선택**: 여행 만화 또는 일상 만화 선택
- **시스템 프롬프트 설정**: 선택한 만화 종류에 따라 템플릿 자동 로드

### 2. 콘티 생성 프로세스
- **리뷰 입력**: 사용자가 여행 리뷰 텍스트 입력 (500자 이내)
- **API 호출**: Gemini 2.0 Flash로 콘티 생성
- **데이터 처리**: JSON 파싱 및 정규화 (한국어 키 → 표준 키 변환)
- **콘티 확인**: 생성된 콘티 JSON 표시 및 수정 가능

### 3. 이미지 생성 프로세스
- **스타일 가이드 추출**: 시스템 프롬프트에서 스타일 정보 추출 및 영문 변환
- **프롬프트 생성**: 콘티 데이터와 스타일 가이드 결합
- **API 호출**: Gemini 3 Pro Image로 4컷 만화 이미지 생성
- **결과 표시**: 생성된 이미지 미리보기 및 다운로드

### 4. 에러 처리
- **콘티 생성 실패**: 에러 메시지 표시
- **이미지 생성 실패**: 플레이스홀더 이미지 표시

### 5. 초기화 기능
- 언제든지 모든 단계를 초기화하여 처음부터 다시 시작 가능

## 색상 범례

- 🟢 **초록색**: 시작/종료 단계
- 🟡 **노란색**: 사용자 입력/선택
- 🔵 **파란색**: 단계별 프로세스
- 🔴 **빨간색**: API 호출
- 🟣 **보라색**: 데이터 처리
- 🟠 **주황색**: 옵션/에러 처리 (점선)

## API 함수

- `generateContiWithGemini()`: 콘티 생성
- `normalizeConti()`: 콘티 데이터 정규화
- `extractStyleGuide()`: 스타일 가이드 추출
- `generateMangaImageWithGemini()`: 이미지 생성
- `downloadImage()`: 이미지 다운로드
