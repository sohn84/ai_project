# -*- coding: utf-8 -*-
"""
1. 고객 질문 유형·키워드별 건수·비중 분석
- 카테고리 2뎁스(1뎁=카테고리, 2뎁=분류) + 2뎁별 샘플 5건(질문·답변)
- 분류별 집계 시 '하나투어' 제외 (회사명 언급은 자연스러우므로 분류로 산정하지 않음)
"""
import re
from collections import Counter, defaultdict
from typing import Any

import pandas as pd

# 분류에서 제외할 태그 (회사명 등)
CLASSIFICATION_EXCLUDE_TAGS = {"하나투어"}

# 분류(2뎁) → 1뎁 카테고리 고정 매핑. 같은 2뎁이 여러 1뎁에 중복되지 않도록 함.
# (원본 데이터는 행마다 카테고리+분류가 달라 동일 분류가 기타문의·상품 추천 등에 겹칠 수 있음.)
# 새 분류가 생기면 여기 추가하고, 1뎁은 질문_유형_분석.카테고리별에 있는 값과 맞추면 됨.
CLASSIFICATION_TO_1DEPTH = {
    "상품추천": "상품 추천",
    "상품비교/설명": "상품 비교",
    "여행지추천": "여행지 추천",
    "일정추천": "여행 일정",
    "일반": "기타문의",
    "국내항공사": "항공 서비스/규정",
    "해외항공사": "항공 서비스/규정",
    "국가정보": "여행 서류/비자/준비물",
    "날씨정보": "날씨",
    "식사장소정보": "기타문의",
    "환율정보": "환율",
    "동영상정보": "기타문의",
}

# 여행사 도메인 키워드 (질문에서 빈도 집계용)
QUESTION_KEYWORDS = [
    "상품", "추천", "예약", "취소", "변경", "결제", "환불", "출발", "도쿄", "오키나와",
    "제주", "동남아", "다낭", "베트남", "일본", "유럽", "패키지", "자유여행", "항공",
    "호텔", "가격", "일정", "비자", "환율", "날씨", "맛집", "관광지", "일정표", "계약서",
    "예약확정", "예약대기", "발권", "무이자", "할부", "이벤트", "할인", "마일리지",
    "고객센터", "문의", "재결제", "예약번호", "상품비교", "비교", "요약",
]

SAMPLE_ANSWER_MAX_LEN = 400


def _normalize_category(s: str) -> str:
    if pd.isna(s) or str(s).strip() in ("", "nan"):
        return "미분류"
    return str(s).strip()


def _parse_classification(s: str) -> list[str]:
    """분류 필드 예: ['상품추천'] 또는 "['하나투어', '일정추천']" """
    if pd.isna(s) or str(s).strip() in ("", "nan", "[]"):
        return []
    s = str(s).strip()
    if s.startswith("["):
        inner = re.sub(r"^\[|\]$|'|\"", "", s)
        return [x.strip() for x in inner.split(",") if x.strip()]
    return [s]


def _truncate(t: str, max_len: int) -> str:
    if pd.isna(t):
        return ""
    s = str(t).strip()
    return s[:max_len] + ("…" if len(s) > max_len else "")


def analyze_question_types(df: pd.DataFrame) -> dict[str, Any]:
    """
    질문 유형(카테고리·분류) 및 키워드별 건수·비중을 계산한다.
    - 분류별: '하나투어' 태그 제외
    - 카테고리_2뎁스: 1뎁=카테고리, 2뎁=분류별 건수·비중·샘플 5건(질문·답변)
    """
    total = len(df)
    df = df.copy()
    df["카테고리_정규"] = df["카테고리"].map(_normalize_category)

    # 1) 카테고리별 (기존)
    cat_counts = df["카테고리_정규"].value_counts()
    category_stats = [
        {"카테고리": cat, "건수": int(cnt), "비중(%)": round(100.0 * cnt / total, 2)}
        for cat, cnt in cat_counts.items()
    ]

    # 2) 분류별 – 하나투어 제외
    all_tags: list[str] = []
    for v in df["분류"].dropna():
        for tag in _parse_classification(str(v)):
            if tag and tag not in CLASSIFICATION_EXCLUDE_TAGS:
                all_tags.append(tag)
    tag_counts = Counter(all_tags)
    classification_stats = [
        {"분류": k, "건수": v, "비중(%)": round(100.0 * v / total, 2)}
        for k, v in tag_counts.most_common()
    ]

    # 3) 카테고리 2뎁스: 분류(2뎁)는 고정 매핑으로 하나의 1뎁에만 속하도록 함. (같은 2뎁이 기타문의·상품 추천 등에 중복되지 않음)
    rows_for_2depth: list[tuple[str, str, int]] = []  # (canonical_1뎁, 분류, idx)
    for idx, row in df.iterrows():
        row_cat = row["카테고리_정규"]
        for tag in _parse_classification(str(row.get("분류", ""))):
            if tag and tag not in CLASSIFICATION_EXCLUDE_TAGS:
                canonical_1 = CLASSIFICATION_TO_1DEPTH.get(tag, row_cat)
                rows_for_2depth.append((canonical_1, tag, idx))
    # (1뎁, 분류)별 건수 및 해당 idx 수집
    group_idx: dict[tuple[str, str], list[int]] = defaultdict(list)
    for cat, cls, idx in rows_for_2depth:
        group_idx[(cat, cls)].append(idx)
    # 1뎁별로 묶어서 2뎁 목록 + 샘플 5건
    by_1depth: dict[str, list[dict]] = defaultdict(list)
    for (cat, cls), indices in group_idx.items():
        cnt = len(indices)
        sample_indices = indices[:5]
        samples = []
        for i in sample_indices:
            r = df.iloc[i]
            samples.append({
                "질문": _truncate(r.get("질문"), 200),
                "답변": _truncate(r.get("답변"), SAMPLE_ANSWER_MAX_LEN),
            })
        by_1depth[cat].append({
            "분류": cls,
            "건수": cnt,
            "비중(%)": round(100.0 * cnt / total, 2),
            "샘플": samples,
        })
    # 1뎁 순서: 매핑으로 등장한 1뎁을 건수 합 기준 내림차순, 그 다음 cat_counts 순으로 나머지
    depth1_ordered: list[str] = []
    seen = set()
    for cat in sorted(by_1depth.keys(), key=lambda c: -sum(x["건수"] for x in by_1depth[c])):
        if cat not in seen:
            depth1_ordered.append(cat)
            seen.add(cat)
    for cat in cat_counts.index:
        if cat not in seen:
            depth1_ordered.append(cat)
            seen.add(cat)
    # 1뎁별 건수·비중: 2뎁이 있으면 2뎁 합산, 없으면 원본 카테고리별 건수 사용
    cat_counts_dict = cat_counts.to_dict()
    category_2depth = []
    for cat in depth1_ordered:
        items = by_1depth.get(cat, [])
        for it in items:
            it["비중(%)"] = round(100.0 * it["건수"] / total, 2)
        items.sort(key=lambda x: -x["건수"])
        if items:
            depth1_cnt = sum(x["건수"] for x in items)
        else:
            depth1_cnt = int(cat_counts_dict.get(cat, 0))
        depth1_pct = round(100.0 * depth1_cnt / total, 2)
        category_2depth.append({
            "1뎁_카테고리": cat,
            "1뎁_건수": depth1_cnt,
            "1뎁_비중(%)": depth1_pct,
            "2뎁_목록": items,
        })

    # 4) 키워드별 (질문 텍스트)
    question_text = " ".join(df["질문"].fillna("").astype(str))
    keyword_counts = {}
    for kw in QUESTION_KEYWORDS:
        c = len(re.findall(re.escape(kw), question_text))
        if c > 0:
            keyword_counts[kw] = c
    sorted_kw = sorted(keyword_counts.items(), key=lambda x: -x[1])
    keyword_stats = [
        {"키워드": k, "출현건수": v, "비중(%)": round(100.0 * v / total, 2)}
        for k, v in sorted_kw[:50]
    ]

    # 5) 예약 상담 관련 안내: 현재 카테고리/분류에 '예약 상담' 단일 항목 없음
    has_예약상담_cat = any("예약" in c and "상담" in c for c in cat_counts.index)
    has_예약상담_cls = any("예약" in t and "상담" in t for t in tag_counts.keys())
    예약_관련_카테고리 = [c for c in cat_counts.index if "예약" in c]

    return {
        "총_건수": total,
        "카테고리별": category_stats,
        "분류별": classification_stats,
        "카테고리_2뎁스": category_2depth,
        "키워드별": keyword_stats,
        "예약_상담_안내": {
            "예약_상담_카테고리_존재": bool(has_예약상담_cat or has_예약상담_cls),
            "예약_관련_카테고리_목록": 예약_관련_카테고리,
            "안내": "현재 카테고리·분류 체계에는 '예약 상담'(예약 완료 후 예약 데이터 기반 상담)이 별도 항목으로 없습니다. 예약조회/확정·예약변경·취소 등은 존재합니다. 예약 건 기반 맞춤 답변을 구분하려면 카테고리/분류 체계에 '예약 상담' 또는 유사 2뎁스 추가를 권장합니다.",
        },
    }
