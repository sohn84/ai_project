# -*- coding: utf-8 -*-
"""
3. RAG·프롬프트·피드백 루프 개선 사항 도출
- Py에서는 규칙 기반 요약만 생성. 구체적 RAG/프롬프트 개선안은
  분석 JSON 생성 후, 채팅에서 LLM 종합 분석을 요청해 '개선_권고_상세'에 반영하는 것을 권장.
"""
from typing import Any

# LLM 검토 안내 (리포트·README에 사용)
개선_권고_LLM_검토_안내 = (
    "아래 '개선_권고'는 분석 결과를 바탕으로 한 자동 생성 요약입니다. "
    "**구체적인 RAG 강화 항목·프롬프트 수정안**은 Py 로직으로 생성하지 않으며, "
    "분석 JSON(analysis_report.json)이 생성된 뒤, 채팅에서 '이 JSON 기반으로 RAG·프롬프트 구체 개선안을 LLM으로 종합 분석해 달라'고 요청한 후, "
    "생성된 내용을 JSON의 **'개선_권고_상세'** 항목에 수동으로 붙여넣는 방식을 권장합니다. "
    "JSON 구조는 '개선_권고_상세' 아래에 rag_강화_상세, 프롬프트_튜닝_상세, 피드백_루프_상세 등으로 넣으면 HTML 보고서에서 함께 노출할 수 있습니다."
)


def build_recommendations(
    question_types: dict[str, Any],
    negative_analysis: dict[str, Any],
    context_intent: dict[str, Any] = None,
) -> dict[str, Any]:
    """
    분석 결과를 바탕으로 RAG/프롬프트/피드백 루프 **요약**만 구조화.
    구체 개선안은 LLM 검토 후 '개선_권고_상세'에 반영.
    """
    rec = {
        "개선_권고_LLM_검토_안내": 개선_권고_LLM_검토_안내,
        "rag_강화": [],
        "프롬프트_튜닝": [],
        "피드백_루프": [],
        "우선순위_요약": [],
        "개선_권고_상세": None,  # LLM·담당자 검토 후 채팅에서 요청해 JSON에 수동 반영
    }

    # 오답 원인·카테고리 기반으로 "어디를 우선 보강할지"만 짧게
    causes = negative_analysis.get("오답_원인_분류") or []
    wrong_by_cat = negative_analysis.get("카테고리별_오답") or []
    ai_fail = next((x for x in causes if "AI 답변 품질" in str(x.get("원인_유형", ""))), None)

    if ai_fail and ai_fail.get("건수", 0) > 0:
        rec["프롬프트_튜닝"].append({
            "항목": "직접 답변 우선",
            "설명": "오답 사유에 '직접적인 답변 부재' 비중이 높음. 질문에 대해 먼저 한 문장으로 답한 뒤 보조 설명을 이어가도록 규칙 추가 권장.",
        })
    # 오답 많은 카테고리 상위 3개만 언급 (일반적 권고 대신)
    for w in wrong_by_cat[:3]:
        cat = w.get("카테고리", "")
        cnt = w.get("오답_건수", 0)
        if cnt >= 30:
            rec["rag_강화"].append({
                "대상": cat,
                "건수": cnt,
                "권고": f"해당 유형 오답 {cnt}건. 오답사유·샘플 5건을 참고해 어떤 문서/프롬프트가 부족한지 구체화 후 RAG·few-shot 보강.",
            })

    rec["피드백_루프"].append({
        "항목": "오답 로그 수집·유형 태깅",
        "설명": "평가결과=오답, 오답사유, 질문/답변을 주기 수집 후 본 파이프라인에 투입. 오답사유를 유형별 태그로 정리해 RAG/프롬프트 우선순위에 반영.",
    })
    
    # 답변-질문 맥락 분석 기반 권고 추가
    if context_intent:
        aq_context = context_intent.get("답변_질문_맥락_분석") or {}
        chatbot_eval = aq_context.get("챗봇_맥락_활용_평가") or {}
        
        # 맥락 활용 답변 품질
        context_quality = chatbot_eval.get("맥락_활용_답변_품질") or {}
        if context_quality.get("분석_가능"):
            accuracy_diff = context_quality.get("정답률_차이", 0)
            if accuracy_diff < -5:  # 맥락 의존 질문 정답률이 5% 이상 낮음
                rec["rag_강화"].append({
                    "항목": "멀티턴 맥락 포함",
                    "설명": f"맥락 의존 질문 정답률({context_quality.get('맥락_의존_정답률', 0)}%)이 일반 질문({context_quality.get('일반_질문_정답률', 0)}%)보다 {abs(accuracy_diff):.1f}%p 낮음. RAG 검색 시 이전 1~2턴의 질문-답변을 컨텍스트로 포함 필요.",
                })
                rec["프롬프트_튜닝"].append({
                    "항목": "이전 대화 맥락 명시",
                    "설명": "프롬프트에 '이전 대화' 섹션 추가하여 세션 맥락 제공",
                })
        
        # 맥락 누락 오답
        context_miss = chatbot_eval.get("맥락_누락_오답") or {}
        if context_miss.get("분석_가능"):
            miss_rate = context_miss.get("맥락_누락_오답_비율", 0)
            if miss_rate > 20:
                rec["프롬프트_튜닝"].append({
                    "항목": "참조 표현 처리",
                    "우선순위": "높음",
                    "설명": f"맥락 누락 오답 {context_miss.get('맥락_누락_오답_건수', 0):,}건 ({miss_rate}%). '그거', '아까' 등 참조 표현이 있는 질문에 대해 이전 대화를 프롬프트에 포함하도록 개선.",
                })
        
        # 맥락 연결 성공률
        chain_success = chatbot_eval.get("맥락_연결_성공률") or {}
        if chain_success.get("분석_가능"):
            success_rate = chain_success.get("맥락_연결_성공률", 0)
            if success_rate < 60:
                rec["프롬프트_튜닝"].append({
                    "항목": "대화 흐름 이해",
                    "설명": f"키워드 연결 성공률 {success_rate}%. 이전 답변의 키워드를 다음 질문이 참조할 때 정답률 향상 필요. 프롬프트에 '이전 답변과 연결하여' 지시 추가.",
                })
        
        # 일관성
        consistency = chatbot_eval.get("세션_내_일관성") or {}
        if consistency.get("분석_가능"):
            inconsistency = consistency.get("일관성_부족_세션", 0)
            if inconsistency > 50:
                rec["프롬프트_튜닝"].append({
                    "항목": "세션 일관성 유지",
                    "설명": f"일관성 부족 세션 {inconsistency:,}건. 같은 카테고리 질문에 정답↔오답 전환 발생. 세션 맥락을 유지하도록 프롬프트 개선.",
                })
    
    rec["우선순위_요약"].append("오답 원인별·카테고리별 샘플 5건과 오답사유 빈도 구문을 보고, 부족한 지식/답변 규칙을 특정한 뒤 RAG·프롬프트를 구체적으로 보강하세요.")
    
    # 맥락 분석 기반 우선순위 추가
    if context_intent:
        aq_context = context_intent.get("답변_질문_맥락_분석") or {}
        if aq_context.get("답변_질문_맥락_분석_가능"):
            rec["우선순위_요약"].append("멀티턴 대화: 맥락 의존 질문의 정답률이 낮다면 RAG 검색 시 이전 턴을 포함하고, 프롬프트에 세션 맥락을 명시하세요.")
    
    rec["우선순위_요약"].append("구체적 개선안(RAG 문서 목록, 프롬프트 문구 등)은 분석 JSON 생성 후 LLM 종합 분석을 요청해 '개선_권고_상세'에 반영하는 것을 권장합니다.")

    return rec
