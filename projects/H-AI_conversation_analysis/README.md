# 여행사 AI 챗봇 대화 로그 분석

여행사 AI 챗봇의 고객 대화·AI 답변 이력 CSV를 분석하여 **질문 유형/키워드 통계**, **불만·부정 키워드 및 원인 분류**, **RAG·프롬프트·피드백 루프 개선 권고**를 산출하는 파이프라인입니다.

## 기능 요약

1. **고객 질문 유형 분석**  
   카테고리·분류·키워드별 건수와 비중을 집계합니다. (기존 레이블 + 키워드 빈도)

2. **불만/부정 키워드 및 원인 분석**  
   질문 내 부정 키워드 빈도, 오답 원인 분류(AI 답변 불만 vs 고객센터 연락 등 챗봇 외 불만 가능성 vs 불명확)를 분석합니다.

3. **문맥·의도 기반 분석** (키워드 단순 집계 보완)  
   - **세션 문맥**: 같은 세션 내 연속 턴을 보고, “오답 직후 다음 턴에서 부정 표현” 세션 수(AI 답변 불만 가능성), “첫 턴부터 부정” 세션 수(화풀이/선입견 가능성), 세션당 턴 수 분포를 산출합니다.  
   - **의도 클러스터링**: 질문 텍스트만으로 TF-IDF(글자 n-gram) + KMeans 클러스터링을 해, 키워드 목록 없이 **데이터에서 도출된 의도 그룹**과 대표 키워드·질문 샘플을 제공합니다. (`scikit-learn` 필요)

4. **개선 권고**  
   Py에서는 규칙 기반 요약만 생성합니다. **구체적 RAG·프롬프트 개선안**은 분석 JSON 생성 후, 채팅에서 LLM 종합 분석을 요청해 `개선_권고_상세`에 반영하는 것을 권장합니다. → `docs/개선_권고_LLM_반영_가이드.md` 참고.

## 설치 및 실행

```bash
pip install -r requirements.txt
python run_analysis.py                    # 기본 CSV: 20260205_26033건.csv
python run_analysis.py /path/to/other.csv  # 다른 파일 지정
```

### 웹에서 업로드 → 분석 → 레포트 보기

CSV 또는 Excel(.xlsx, .xls) 파일을 업로드하면 분석을 순차 실행하고 HTML 레포트를 화면에 표시합니다.

```bash
python app.py
```

브라우저에서 **http://localhost:4000** 접속 후 파일을 선택하고 **분석 실행**을 누르면 됩니다. (데이터 양에 따라 1~2분 소요될 수 있음)

## 입력 CSV 형식

- **필수 컬럼**: `날짜`, `질문`, `답변`, `답변순서`, `분류`, `카테고리`, `평가결과`, `오답사유`
- `질문`/`답변` 필드에 줄바꿈·쉼표가 포함될 수 있으며, 표준 CSV(큰따옴표 이스케이프)로 파싱됩니다.

## 출력 파일

| 파일 | 설명 |
|------|------|
| `analysis_report.json` | 전체 분석 결과(질문 유형, 불만/원인, 개선 권고) |
| `analysis_report.html` | **비개발자용 HTML 보고서** (브라우저에서 열어보기) |
| `analysis_summary.txt` | 요약 텍스트 |
| `docs/IMPROVEMENT_GUIDE.md` | RAG·프롬프트·피드백 루프 상세 가이드 |

이미 생성된 JSON만 있을 때 HTML 보고서만 다시 만들려면:
`python -m src.report_html analysis_report.json` → `analysis_report.html` 생성

## 프로젝트 구조

```
H-AI_대화분석/
├── 20260205_26033건.csv   # 대화 로그 (예시)
├── run_analysis.py       # 분석 실행 진입점
├── requirements.txt
├── src/
│   ├── load_data.py           # CSV 로더
│   ├── analysis_question_types.py  # 질문 유형·키워드 분석
│   ├── analysis_negative.py       # 불만/부정·원인 분석
│   └── recommendations.py        # 개선 권고 생성
└── docs/
    └── IMPROVEMENT_GUIDE.md      # 개선 가이드
```

## 상세 가이드

RAG 강화, 프롬프트 튜닝, 피드백 루프 설계·운영 방법은 **`docs/IMPROVEMENT_GUIDE.md`**를 참고하세요.
