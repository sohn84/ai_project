# -*- coding: utf-8 -*-
"""
2. 불만/부정 키워드 분석 및 원인 분류 (AI 답변 불만 vs 기타 불만/화풀이)
- 원인 유형별 샘플 5건(질문·답변) 포함
- 오답사유 텍스트에서 빈도 높은 구문 추출 (어떤 RAG 보강이 필요한지 판단 참고)
- 오답 판단 근거 서술
"""
import re
from collections import Counter, defaultdict
from typing import Any

import pandas as pd

NEGATIVE_QUESTION_KEYWORDS = [
    "불만", "화남", "짜증", "답답", "이해못", "이해 못", "못 알아", "못알아",
    "엉뚱", "엉뚱한", "말도안돼", "말도 안돼", "뭐냐", "뭔소리", "다른 얘기",
    "안돼", "안 되", "잘못", "틀렸", "오류", "에러", "오답", "재접속", "다시",
    "불친절", "친절", "도움안됨", "도움 안됨", "쓸모없", "쓸모 없",
]

AI_REFERENCE_KEYWORDS = [
    "챗봇", "봇", "AI", "인공지능", "답변", "응답", "말씀하신", "말한", "이해를 못",
    "제대로 못", "제대로 안", "못 찾", "찾을 수 없", "알려주지", "안 알려",
]

PATTERNS_AI_FAILURE = [
    r"질문에 대한 직접적인 답변을 제공하지",
    r"질문에 대한 직접적인 답변이 없",
    r"질문과 관련이 없",
    r"질문과 관련된 정보가 아닌",
    r"질문의 의도를 파악",
    r"적합한 상품은 찾을 수 없었습니다",
    r"답변을 거부한",
    r"직접적인 답변을 시도하지",
    r"구체적인 정보가 제공되지 않",
    r"정보만 제공하고",
    r"일반적인 설명만 제공",
]

PATTERNS_OTHER_OR_VENTING = [
    r"고객센터",
    r"1577",
    r"전화",
    r"연락",
    r"예약.*취소",
    r"결제.*환불",
    r"항공사|호텔|상품",
]

# 오답 시 AI 답변 트래킹: "죄송합니다" 등으로 시작하는 답변 (사과형 응답)
ANSWER_APOLOGY_STARTERS = ("죄송합니다", "죄송해요", "죄송합니다만", "죄송하지만", "죄송")


def _answer_starts_apology(text: str) -> bool:
    if pd.isna(text):
        return False
    s = str(text).strip()
    return any(s.startswith(prefix) for prefix in ANSWER_APOLOGY_STARTERS)


# 오답 판단 근거 (리포트에 포함)
오답_판단_근거_서술 = (
    "본 분석에서의 '오답' 건수는 원시 데이터(CSV)의 **'평가결과'** 컬럼 값이 '오답'으로 기록된 건수를 "
    "집계한 것입니다. 즉, 정답/오답 여부는 데이터를 생성·제공한 측(평가 주체)의 기준에 따라 이미 레이블된 결과를 "
    "그대로 사용합니다. 평가 방식(수동 검수, 자동 규칙, 외주 검수 등)과 세부 기준은 원시 데이터 제공처에 따르며, "
    "비중이 낮게 나오는 것은 해당 기간·표본 내에서 '오답'으로 판정된 대화가 상대적으로 적었다는 의미입니다."
)

SAMPLE_ANSWER_MAX_LEN = 400


def _has_negative(text: str) -> bool:
    if pd.isna(text):
        return False
    return any(p in str(text) for p in NEGATIVE_QUESTION_KEYWORDS)


def _match_patterns(text: str, patterns: list[str]) -> list[str]:
    if pd.isna(text):
        return []
    t = str(text)
    return [p for p in patterns if re.search(p, t)]


def _truncate(t: str, max_len: int) -> str:
    if pd.isna(t):
        return ""
    s = str(t).strip()
    return s[:max_len] + ("…" if len(s) > max_len else "")


def _extract_frequent_phrases(texts: list[str], min_len: int = 5, max_len: int = 25, top_n: int = 25) -> list[dict]:
    """오답사유 문장에서 자주 반복되는 구문(5~25자) 빈도 추출."""
    segment_counts: Counter = Counter()
    for t in texts:
        if not t or len(str(t).strip()) < min_len:
            continue
        s = str(t).strip()
        for length in range(min_len, min(max_len + 1, len(s) + 1)):
            for i in range(0, len(s) - length + 1):
                seg = s[i : i + length]
                if seg.strip():
                    segment_counts[seg] += 1
    return [
        {"구문": seg, "출현횟수": cnt}
        for seg, cnt in segment_counts.most_common(top_n)
    ]


def analyze_negative(df: pd.DataFrame) -> dict[str, Any]:
    """
    불만/부정 키워드와 원인(AI 답변 불만 vs 기타/화풀이) 분석.
    - 원인 유형별 질문·답변 샘플 5건
    - 오답사유 빈도 구문
    - 오답 판단 근거
    """
    total = len(df)
    wrong = df[df["평가결과"].astype(str).str.strip().str.contains("오답", na=False)].copy()
    n_wrong = len(wrong)

    # 1) 질문에서 부정 키워드 출현 건수
    neg_in_question = []
    for kw in NEGATIVE_QUESTION_KEYWORDS:
        cnt = df["질문"].fillna("").astype(str).str.contains(re.escape(kw), case=False, regex=True).sum()
        if cnt > 0:
            neg_in_question.append({"키워드": kw, "건수": int(cnt), "비중(%)": round(100.0 * cnt / total, 2)})
    neg_in_question.sort(key=lambda x: -x["건수"])

    # 2) 오답 원인 분류 + 유형별 샘플 5건(질문·답변)
    ai_failure_indices: list[int] = []
    other_venting_indices: list[int] = []
    unclear_indices: list[int] = []
    reason_texts_ai: list[str] = []
    reason_texts_other: list[str] = []
    reason_texts_unclear: list[str] = []

    for idx, row in wrong.iterrows():
        reason = str(row.get("오답사유", ""))
        if not reason or reason in ("nan", ""):
            unclear_indices.append(idx)
            reason_texts_unclear.append(reason)
            continue
        matched_ai = _match_patterns(reason, PATTERNS_AI_FAILURE)
        matched_other = _match_patterns(reason, PATTERNS_OTHER_OR_VENTING)
        if matched_ai and not matched_other:
            ai_failure_indices.append(idx)
            reason_texts_ai.append(reason)
        elif matched_other or "고객센터" in reason or "1577" in reason:
            other_venting_indices.append(idx)
            reason_texts_other.append(reason)
        else:
            unclear_indices.append(idx)
            reason_texts_unclear.append(reason)

    def sample_5(df: pd.DataFrame, indices: list) -> list[dict]:
        out = []
        for i in indices[:5]:
            if i not in df.index:
                continue
            r = df.loc[i]
            out.append({
                "질문": _truncate(r.get("질문"), 200),
                "답변": _truncate(r.get("답변"), SAMPLE_ANSWER_MAX_LEN),
            })
        return out

    cause_summary = [
        {
            "원인_유형": "AI 답변 품질/직접 답변 부재",
            "건수": len(ai_failure_indices),
            "비중(오답대비%)": round(100.0 * len(ai_failure_indices) / n_wrong, 2) if n_wrong else 0,
            "샘플_5건": sample_5(df, ai_failure_indices),
        },
        {
            "원인_유형": "기타/고객센터 연락 등(챗봇 외 불만 가능)",
            "건수": len(other_venting_indices),
            "비중(오답대비%)": round(100.0 * len(other_venting_indices) / n_wrong, 2) if n_wrong else 0,
            "샘플_5건": sample_5(df, other_venting_indices),
        },
        {
            "원인_유형": "기타/불명확",
            "건수": len(unclear_indices),
            "비중(오답대비%)": round(100.0 * len(unclear_indices) / n_wrong, 2) if n_wrong else 0,
            "샘플_5건": sample_5(df, unclear_indices),
        },
    ]

    # 오답사유 텍스트 샘플 (기존 호환)
    reason_samples = {
        "ai_failure": [s[:200] for s in reason_texts_ai[:5]],
        "other_venting": [s[:200] for s in reason_texts_other[:5]],
        "unclear": [s[:200] for s in reason_texts_unclear[:5]],
    }

    # 3) 오답사유 빈도 구문 (RAG 보강 판단 참고)
    all_reasons = reason_texts_ai + reason_texts_other + reason_texts_unclear
    오답사유_빈도_구문 = _extract_frequent_phrases(all_reasons, min_len=6, max_len=22, top_n=20)

    # 4) 오답 건 중 AI 답변이 "죄송합니다" 등으로 시작하는 건 트래킹
    wrong_answer_col = wrong["답변"].fillna("").astype(str)
    apology_start_indices = [idx for idx in wrong.index if _answer_starts_apology(wrong_answer_col.loc[idx])]
    n_apology_start = len(apology_start_indices)
    오답_중_답변_죄송_시작 = {
        "건수": n_apology_start,
        "비중(오답대비%)": round(100.0 * n_apology_start / n_wrong, 2) if n_wrong else 0,
        "설명": "오답으로 판정된 턴 중 AI 답변이 '죄송합니다/죄송해요/죄송합니다만/죄송하지만' 등으로 시작하는 건수. 사과형 응답이 많으면 직접 답 대신 사과만 반복되는 패턴 점검 참고.",
        "샘플_5건": sample_5(df, apology_start_indices),
    }

    # 5) 카테고리별 오답 + 샘플 5건
    wrong_by_cat = wrong["카테고리"].fillna("미분류").astype(str).str.strip()
    cat_to_indices: dict[str, list] = defaultdict(list)
    for idx in wrong.index:
        cat = str(wrong.loc[idx, "카테고리"] or "미분류").strip()
        cat_to_indices[cat].append(idx)
    wrong_by_category = []
    for cat, cnt in wrong_by_cat.value_counts().items():
        samples = sample_5(df, cat_to_indices.get(cat, [])[:5])
        wrong_by_category.append({
            "카테고리": cat,
            "오답_건수": int(cnt),
            "비중(오답대비%)": round(100.0 * cnt / n_wrong, 2) if n_wrong else 0,
            "샘플_5건": samples,
        })

    return {
        "총_건수": total,
        "오답_건수": n_wrong,
        "오답률(%)": round(100.0 * n_wrong / total, 2) if total else 0,
        "오답_판단_근거": 오답_판단_근거_서술,
        "질문_내_부정키워드_건수": neg_in_question,
        "오답_원인_분류": cause_summary,
        "오답_원인_샘플": reason_samples,
        "오답사유_빈도_구문": 오답사유_빈도_구문,
        "오답_중_답변_죄송_시작": 오답_중_답변_죄송_시작,
        "카테고리별_오답": wrong_by_category,
    }
