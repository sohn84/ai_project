# -*- coding: utf-8 -*-
"""
Rasa Conversation Review 개념 + 고객 심리 관점 입체 분석.

- 세션 단위 리뷰: 턴 수, 오답 건수, 의도(카테고리) 전환, 재질문·반복 패턴
- 태그 제안: needs-further-analysis, out-of-scope, fallback-pattern, high-frustration 등 (규칙 기반)
- 고객 심리/행동 지표: 좌절(오답 연속·재질문), 이탈(오답 후 짧은 세션), 기대-불일치(카테고리별 오답 심각도)
- 숨은 리스크 요약: 전체 오답률이 낮아도 세션·심리 지표에서 드러나는 문제점 강조
"""
import re
from collections import Counter, defaultdict
from typing import Any

import pandas as pd

# 부정/불만 (문맥·좌절 추론용)
NEGATIVE_PATTERNS = [
    "불만", "화남", "짜증", "답답", "이해못", "못 알아", "안돼", "잘못", "틀렸",
    "오류", "에러", "불친절", "쓸모없", "다시", "뭔소리", "엉뚱", "고객센터", "1577",
]
# 긴급·불안 (고객 심리 추론)
URGENCY_ANXIETY = [
    "급해", "빨리", "당장", "오늘", "내일", "취소", "환불", "변경", "가능한지",
    "되나요", "될까", "확인", "알려주", "바꿔", "해주세요", "부탁",
]
# 혼란·모호 (의도 불명)
CONFUSION_AMBIGUOUS = [
    "그거", "그게", "위에", "아까", "말한", "그런", "어떻게", "뭔지", "뭐예요",
]

SAMPLE_MAX = 400


def _truncate(t: str, max_len: int) -> str:
    if pd.isna(t):
        return ""
    s = str(t).strip()
    return s[:max_len] + ("…" if len(s) > max_len else "")


def _has_any(text: str, patterns: list[str]) -> bool:
    if pd.isna(text):
        return False
    t = str(text)
    return any(p in t for p in patterns)


def run_conversation_review_analysis(df: pd.DataFrame) -> dict[str, Any]:
    """
    세션ID 기준으로 Conversation Review 스타일 + 고객 심리 지표를 산출한다.
    세션ID가 없으면 기본 지표만 반환.
    """
    total_turns = len(df)
    has_session = "세션ID" in df.columns
    df = df.copy()
    df["오답"] = df["평가결과"].astype(str).str.strip().str.contains("오답", na=False)
    df["질문_부정"] = df["질문"].map(lambda x: _has_any(x, NEGATIVE_PATTERNS))
    df["질문_긴급"] = df["질문"].map(lambda x: _has_any(x, URGENCY_ANXIETY))
    df["질문_혼란"] = df["질문"].map(lambda x: _has_any(x, CONFUSION_AMBIGUOUS))
    df["카테고리_정규"] = df["카테고리"].fillna("미분류").astype(str).str.strip()

    result: dict[str, Any] = {
        "분석_개요": {
            "개념": "Rasa Conversation Review + 고객 심리 관점. 세션·플로우·태그 제안으로 '잘 보이는 수치' 뒤 숨은 리스크를 드러냅니다.",
            "세션_분석_가능": has_session,
        },
        "고객_심리_지표": _customer_psychology_metrics(df, total_turns, has_session),
        "세션_리뷰_지표": {},
        "태그_제안_요약": [],
        "숨은_리스크_요약": [],
    }

    if not has_session:
        result["세션_리뷰_지표"] = {"이유": "세션ID 없음", "메시지": "세션 단위 분석은 세션ID 컬럼이 있을 때만 산출됩니다."}
        result["숨은_리스크_요약"] = _hidden_risk_without_session(df, total_turns)
        return result

    # 세션 내 순서
    if "답변순서" in df.columns:
        df = df.sort_values(["세션ID", "답변순서"])
    else:
        df = df.sort_values(["세션ID", "날짜"])

    sessions = df.groupby("세션ID", sort=False)
    n_sessions = len(sessions)

    # 1) 세션 리뷰 지표 (Rasa 스타일)
    session_metrics = []
    tag_suggestions: dict[str, list[dict]] = defaultdict(list)
    high_frustration_sessions = []
    intent_shift_sessions = []
    fallback_like_sessions = []

    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        turn_count = len(grp)
        wrong_count = grp["오답"].sum()
        wrong_indices = grp.index[grp["오답"]].tolist()
        first_negative = grp.iloc[0]["질문_부정"] if len(grp) else False

        # 의도(카테고리) 전환: 세션 내 서로 다른 카테고리 수
        cats = grp["카테고리_정규"].dropna().astype(str)
        n_categories = cats.nunique()
        category_shift = n_categories > 1

        # 짧은 질문(10자 이하) + 오답 → fallback 패턴 후보
        short_q_wrong = 0
        for i, row in grp.iterrows():
            q = str(row.get("질문", ""))
            if len(q.strip()) <= 10 and row["오답"]:
                short_q_wrong += 1
        fallback_like = short_q_wrong > 0

        session_metrics.append({
            "세션ID": str(sid)[:36],
            "메시지_수": int(turn_count),
            "오답_수": int(wrong_count),
            "첫턴_부정": bool(first_negative),
            "카테고리_전환": bool(category_shift),
            "카테고리_수": int(n_categories),
        })

        # 태그 제안 수집 (샘플만)
        if wrong_count >= 2 and len(high_frustration_sessions) < 10:
            high_frustration_sessions.append({
                "세션ID": str(sid)[:36],
                "오답_수": int(wrong_count),
                "메시지_수": int(turn_count),
                "첫_질문": _truncate(grp.iloc[0]["질문"], 80),
            })
        if category_shift and wrong_count >= 1 and len(intent_shift_sessions) < 10:
            intent_shift_sessions.append({
                "세션ID": str(sid)[:36],
                "카테고리_수": int(n_categories),
                "오답_수": int(wrong_count),
            })
        if fallback_like and len(fallback_like_sessions) < 10:
            for idx in grp.index[grp["오답"]][:1]:
                row = grp.loc[idx]
                q = str(row.get("질문", ""))
                if len(q.strip()) <= 10:
                    fallback_like_sessions.append({
                        "세션ID": str(sid)[:36],
                        "짧은_질문": _truncate(q, 30),
                        "오답사유": _truncate(row.get("오답사유"), 100),
                    })
                    break

    # 태그 제안 요약 (Rasa 스타일: needs-further-analysis, out-of-scope 등)
    n_high_frust = sum(1 for s in session_metrics if s["오답_수"] >= 2)
    n_first_neg = sum(1 for s in session_metrics if s["첫턴_부정"])
    n_intent_shift = sum(1 for s in session_metrics if s["카테고리_전환"] and s["오답_수"] >= 1)

    result["태그_제안_요약"] = [
        {"태그_후보": "high-frustration", "의미": "세션 내 오답 2회 이상", "세션_수": n_high_frust, "비고": "재질문·좌절 가능성"},
        {"태그_후보": "first-turn-negative", "의미": "첫 턴부터 부정 표현", "세션_수": n_first_neg, "비고": "화풀이/선입견 가능성"},
        {"태그_후보": "intent-shift-with-wrong", "의미": "의도 전환 후 오답 발생", "세션_수": n_intent_shift, "비고": "라우팅/스코프 이슈 후보"},
        {"태그_후보": "fallback-pattern", "의미": "짧은 질문(10자 이하)+오답", "샘플_세션_수": len(fallback_like_sessions), "비고": "의도 파악 한계"},
    ]
    result["세션_리뷰_지표"] = {
        "총_세션_수": n_sessions,
        "총_턴_수": int(df.groupby("세션ID").size().sum()),
        "평균_세션당_턴수": round(float(df.groupby("세션ID").size().mean()), 2),
        "오답_1회이상_세션_수": sum(1 for s in session_metrics if s["오답_수"] >= 1),
        "오답_2회이상_세션_수": n_high_frust,
        "첫턴_부정_세션_수": n_first_neg,
        "의도_전환_후_오답_세션_수": n_intent_shift,
        "세션_샘플_상위20": session_metrics[:20],
        "high_frustration_샘플": high_frustration_sessions[:5],
        "intent_shift_샘플": intent_shift_sessions[:5],
        "fallback_pattern_샘플": fallback_like_sessions[:5],
    }

    # 2) 고객 심리 지표 (세션 있음)
    result["고객_심리_지표"] = _customer_psychology_metrics(df, total_turns, True)

    # 3) 숨은 리스크 요약
    result["숨은_리스크_요약"] = _hidden_risk_summary(
        df, n_sessions, session_metrics, total_turns
    )

    return result


def _customer_psychology_metrics(df: pd.DataFrame, total: int, has_session: bool) -> dict[str, Any]:
    """고객 심리/행동 프록시 지표."""
    wrong = df["오답"].sum()
    wrong_pct = round(100.0 * wrong / total, 2) if total else 0

    # 턴 단위: 긴급/불안·혼란 질문 비중
    urgency_cnt = df["질문_긴급"].sum()
    confusion_cnt = df["질문_혼란"].sum()
    neg_in_question = df["질문_부정"].sum()

    # 오답 턴 중 긴급/혼란/부정 비중 (고객이 불안한 상태에서 오답 경험)
    wrong_df = df[df["오답"]]
    wrong_urgency = wrong_df["질문_긴급"].sum() if len(wrong_df) else 0
    wrong_confusion = wrong_df["질문_혼란"].sum() if len(wrong_df) else 0
    wrong_neg = wrong_df["질문_부정"].sum() if len(wrong_df) else 0
    n_wrong = len(wrong_df)

    return {
        "전체_턴_수": total,
        "오답_건수": int(wrong),
        "오답률_퍼센트": wrong_pct,
        "질문_내_긴급_불안_키워드_건수": int(urgency_cnt),
        "질문_내_혼란_모호_키워드_건수": int(confusion_cnt),
        "질문_내_부정_키워드_건수": int(neg_in_question),
        "오답_턴_중_긴급_질문_비율": round(100.0 * wrong_urgency / n_wrong, 2) if n_wrong else 0,
        "오답_턴_중_혼란_질문_비율": round(100.0 * wrong_confusion / n_wrong, 2) if n_wrong else 0,
        "오답_턴_중_부정_질문_비율": round(100.0 * wrong_neg / n_wrong, 2) if n_wrong else 0,
        "해석": {
            "긴급_불안": "급해·빨리·취소·확인 등 — 고객이 불안/긴급한 상태에서 질문한 비중.",
            "혼란_모호": "그거·위에·아까·어떻게 등 — 의도가 불명확해 잘못 라우팅되기 쉬운 질문.",
            "오답_턴_중_비율": "오답이 났던 턴에서 긴급/혼란/부정이 있으면, 같은 대화에서 고객 심리 악화 가능성이 높음.",
        },
        "세션_기반_보강": has_session,
    }


def _hidden_risk_without_session(df: pd.DataFrame, total: int) -> list[dict]:
    """세션 없을 때 턴 단위만으로 숨은 리스크 문장."""
    wrong = df["오답"].sum()
    wrong_pct = round(100.0 * wrong / total, 2) if total else 0
    risks = []
    if wrong_pct < 10 and wrong > 0:
        risks.append({
            "유형": "낮은_오답률_주의",
            "내용": f"전체 오답률은 {wrong_pct}%로 낮게 보이지만, 오답 {int(wrong)}건이 존재합니다. 카테고리별·오답사유별로 집중 검토하면 특정 유형에서 반복 실패가 숨어 있을 수 있습니다.",
        })
    wrong_df = df[df["오답"]]
    if len(wrong_df) > 0:
        urgency_in_wrong = wrong_df["질문"].map(lambda x: _has_any(x, URGENCY_ANXIETY)).sum()
        if urgency_in_wrong > len(wrong_df) * 0.2:
            risks.append({
                "유형": "긴급_상황_오답",
                "내용": f"오답이 난 턴 중 약 {round(100*urgency_in_wrong/len(wrong_df), 0)}%에서 '급해·취소·확인' 등 긴급/불안 키워드가 있습니다. 긴급한 고객이 잘못된 답을 받을 경우 이탈·불만이 커질 수 있습니다.",
            })
    return risks


def _hidden_risk_summary(
    df: pd.DataFrame,
    n_sessions: int,
    session_metrics: list[dict],
    total_turns: int,
) -> list[dict]:
    """세션·고객 심리 지표를 묶어 '숨은 리스크' 문장으로 요약."""
    risks = []
    wrong_total = df["오답"].sum()
    wrong_pct = round(100.0 * wrong_total / total_turns, 2) if total_turns else 0

    # 1) 오답률이 낮아 보여도
    if wrong_pct < 10 and wrong_total > 0:
        risks.append({
            "유형": "표면_오답률_낮음",
            "내용": f"전체 오답률은 {wrong_pct}%로 낮게 보이지만, Conversation Review 관점에서는 '오답이 난 세션 수'와 '같은 세션 내 반복 오답'이 더 중요할 수 있습니다. 한 번 오답으로 불만이 난 고객이 재질문 후 또 오답을 받으면 이탈 가능성이 큽니다.",
        })

    # 2) 세션 내 반복 오답
    n_high_frust = sum(1 for s in session_metrics if s["오답_수"] >= 2)
    if n_high_frust > 0:
        pct_sessions = round(100.0 * n_high_frust / n_sessions, 2)
        risks.append({
            "유형": "세션_내_반복_오답",
            "내용": f"총 {n_sessions}개 세션 중 {n_high_frust}개({pct_sessions}%)에서 오답이 2회 이상 발생했습니다. 같은 대화 안에서 고객이 여러 번 잘못된 답을 경험한 경우로, 좌절·이탈 리스크가 높습니다. 'high-frustration' 태그로 추적 권장.",
        })

    # 3) 의도 전환 + 오답
    n_shift = sum(1 for s in session_metrics if s["카테고리_전환"] and s["오답_수"] >= 1)
    if n_shift > 0:
        risks.append({
            "유형": "의도_전환_후_오답",
            "내용": f"세션 중 카테고리(의도)가 바뀐 뒤 오답이 난 세션이 {n_shift}건 있습니다. 상품 추천 → 예약 조회처럼 주제가 바뀌는 순간 잘못된 라우팅이나 스코프 한계가 있을 수 있습니다. 'intent-shift-with-wrong' 태그로 검토 권장.",
        })

    # 4) 첫 턴부터 부정
    n_first_neg = sum(1 for s in session_metrics if s["첫턴_부정"])
    if n_first_neg > 0:
        risks.append({
            "유형": "첫_턴_부정",
            "내용": f"세션 첫 질문부터 부정/불만 표현이 포함된 대화가 {n_first_neg}건 있습니다. 이미 불만을 가진 고객이 챗봇을 사용한 경우로, 답변 품질에 더 예민할 수 있습니다.",
        })

    # 5) 고객 심리
    wrong_df = df[df["오답"]]
    if len(wrong_df) > 0:
        urgency_in_wrong = wrong_df["질문"].map(lambda x: _has_any(x, URGENCY_ANXIETY)).sum()
        if urgency_in_wrong > len(wrong_df) * 0.15:
            risks.append({
                "유형": "긴급_상황_오답",
                "내용": "오답이 발생한 턴 중 상당 비율에서 '급해·취소·확인' 등 긴급/불안 키워드가 발견됩니다. 긴급한 고객이 잘못된 답을 받으면 불만과 이탈이 커질 수 있으므로, 해당 유형 질문에 대한 우선 보강을 권장합니다.",
            })

    return risks
