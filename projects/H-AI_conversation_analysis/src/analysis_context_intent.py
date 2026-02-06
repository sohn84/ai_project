# -*- coding: utf-8 -*-
"""
문맥·의도 기반 분석 (키워드 단순 집계 보완)
- 세션 단위: 연속 턴, 오답 직후 불만 vs 첫 턴 불만
- 질문 텍스트 기반 의도 클러스터링 (TF-IDF + KMeans)
"""
import re
from collections import defaultdict
from typing import Any

import pandas as pd

# 의도 클러스터링용 (선택 의존성)
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.cluster import KMeans
    from sklearn.preprocessing import normalize
    import numpy as np
    _SKLEARN_AVAILABLE = True
except ImportError:
    _SKLEARN_AVAILABLE = False

# 부정 표현 (문맥 분석에서 사용, analysis_negative와 동일 개념)
NEGATIVE_PATTERNS = [
    "불만", "화남", "짜증", "답답", "이해못", "이해 못", "못 알아", "안돼", "안 되",
    "잘못", "틀렸", "오류", "에러", "불친절", "쓸모없", "다시", "뭔소리", "엉뚱",
]


def _has_negative(text: str) -> bool:
    if pd.isna(text) or not str(text).strip():
        return False
    t = str(text)
    return any(p in t for p in NEGATIVE_PATTERNS)


def analyze_session_context(df: pd.DataFrame) -> dict[str, Any]:
    """
    세션(세션ID) 단위로 문맥을 보고,
    - 오답이 난 직후 다음 턴에서 부정/불만이 나온 건수 (AI 답변에 대한 불만 가능성)
    - 세션 첫 턴부터 부정/불만인 건수 (챗봇에 대한 화풀이/선입견 가능성)
    - 세션당 턴 수 분포
    """
    if "세션ID" not in df.columns:
        return {
            "세션_분석_가능": False,
            "이유": "세션ID 컬럼 없음",
            "오답_직후_불만_건수": 0,
            "첫턴_부정_건수": 0,
            "세션별_턴수_분포": [],
        }

    df = df.copy()
    df["질문_부정"] = df["질문"].map(_has_negative)
    df["오답"] = df["평가결과"].astype(str).str.strip().str.contains("오답", na=False)

    # 세션 내 순서: 세션ID + 답변순서(또는 날짜)
    if "답변순서" in df.columns:
        df = df.sort_values(["세션ID", "답변순서"])
    else:
        df = df.sort_values(["세션ID", "날짜"])

    # 세션별로 한 번 순회하며 1) 오답 직후 불만 2) 첫 턴 부정 모두 계산
    sessions = df.groupby("세션ID", sort=False)
    next_neg_after_wrong = 0
    next_neg_after_wrong_samples = []
    first_turn_negative = 0
    first_turn_negative_samples = []

    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        first = grp.iloc[0]
        if first["질문_부정"]:
            first_turn_negative += 1
            if len(first_turn_negative_samples) < 5:
                first_turn_negative_samples.append({
                    "세션ID": str(sid)[:20],
                    "첫_질문": str(first["질문"])[:100],
                })
        for i in range(len(grp) - 1):
            if grp.iloc[i]["오답"] and grp.iloc[i + 1]["질문_부정"]:
                next_neg_after_wrong += 1
                if len(next_neg_after_wrong_samples) < 5:
                    next_neg_after_wrong_samples.append({
                        "세션ID": str(sid)[:20],
                        "오답_질문": str(grp.iloc[i]["질문"])[:80],
                        "직후_질문": str(grp.iloc[i + 1]["질문"])[:80],
                    })
                break

    # 3) 세션별 턴 수 분포
    turn_counts = df.groupby("세션ID").size()
    turn_dist = turn_counts.value_counts().sort_index()
    turn_dist_list = [
        {"턴수": int(k), "세션_수": int(v), "비고": "재질문/연속 대화" if k > 1 else "1회성"}
        for k, v in turn_dist.head(15).items()
    ]

    n_sessions = len(turn_counts)
    return {
        "세션_분석_가능": True,
        "총_세션_수": n_sessions,
        "오답_직후_불만_건수": next_neg_after_wrong,
        "오답_직후_불만_샘플": next_neg_after_wrong_samples,
        "첫턴_부정_건수": first_turn_negative,
        "첫턴_부정_샘플": first_turn_negative_samples,
        "세션별_턴수_분포": turn_dist_list,
        "평균_세션당_턴수": round(float(turn_counts.mean()), 2),
        "해석": {
            "오답_직후_불만": "같은 세션에서 AI가 오답을 준 직후, 고객이 부정/불만 표현을 쓴 세션 수. AI 답변 불만 가능성이 높음.",
            "첫턴_부정": "세션 첫 질문부터 부정 표현이 있는 경우. 챗봇에 대한 화풀이나 선입견 가능성.",
        },
    }


def analyze_intent_clusters(df: pd.DataFrame, n_clusters: int = 12, max_samples: int = 5000) -> dict[str, Any]:
    """
    질문 텍스트만으로 의도 유형을 클러스터링 (TF-IDF + KMeans).
    키워드 목록에 의존하지 않고, 실제 발화 분포에서 유사 의도를 묶는다.
    """
    if not _SKLEARN_AVAILABLE:
        return {
            "의도_클러스터링_가능": False,
            "이유": "sklearn 미설치. pip install scikit-learn 후 재실행.",
        }

    questions = df["질문"].fillna("").astype(str)
    # 너무 짧은/비어 있는 질문 제외
    mask = questions.str.strip().str.len() >= 2
    q = questions[mask]
    if len(q) < n_clusters * 10:
        return {
            "의도_클러스터링_가능": False,
            "이유": f"분석 가능한 질문 수 부족 (최소 약 {n_clusters * 10}건 권장)",
        }

    # 샘플링으로 메모리/속도 조절
    if len(q) > max_samples:
        q = q.sample(n=max_samples, random_state=42)
    q_list = q.tolist()

    # 한국어: 띄어쓰기 부족 시를 대비해 글자 2~4gram으로 벡터화 (형태소 없이 의도 유사도 반영)
    vectorizer = TfidfVectorizer(
        max_features=3000,
        analyzer="char",
        ngram_range=(2, 4),
        min_df=2,
        max_df=0.92,
        sublinear_tf=True,
    )
    X = vectorizer.fit_transform(q_list)

    n_clusters = min(n_clusters, len(q_list) // 5)
    if n_clusters < 2:
        return {"의도_클러스터링_가능": False, "이유": "클러스터 수 조정 필요"}

    km = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = km.fit_predict(X)
    feature_names = vectorizer.get_feature_names_out()

    # 클러스터별 대표 키워드 (센터에서 가중치 큰 단어)
    order_centroids = km.cluster_centers_.argsort()[:, ::-1]
    clusters_info = []
    for i in range(n_clusters):
        top_indices = order_centroids[i, :15]
        top_terms = [feature_names[j] for j in top_indices if j < len(feature_names)]
        size = (labels == i).sum()
        # 해당 클러스터 질문 샘플 2개
        idx_in_q = [ii for ii, l in enumerate(labels) if l == i][:2]
        samples = [q_list[j][:60] for j in idx_in_q]
        clusters_info.append({
            "클러스터": i + 1,
            "건수": int(size),
            "비중(%)": round(100.0 * size / len(q_list), 2),
            "대표_키워드": top_terms[:10],
            "질문_샘플": samples,
        })

    # 건수 기준 정렬
    clusters_info.sort(key=lambda x: -x["건수"])

    return {
        "의도_클러스터링_가능": True,
        "분석_질문_수": len(q_list),
        "클러스터_수": n_clusters,
        "의도_클러스터_요약": clusters_info,
        "해석": "질문 텍스트 유사도(TF-IDF)로 묶은 의도 유형. 키워드 목록 없이 데이터에서 도출된 그룹입니다.",
    }


def run_context_and_intent_analysis(df: pd.DataFrame) -> dict[str, Any]:
    """문맥 분석 + 의도 클러스터링을 한 번에 실행."""
    session_result = analyze_session_context(df)
    intent_result = analyze_intent_clusters(df)
    return {
        "세션_문맥_분석": session_result,
        "의도_클러스터링": intent_result,
    }
