# -*- coding: utf-8 -*-
"""
답변-질문 맥락 분석
- 이전 턴의 답변이 다음 턴 질문에 미치는 영향 분석
- 고객 행동 패턴 (6개) + 챗봇 맥락 활용 평가 (4개)
"""
from collections import defaultdict
from typing import Any

import pandas as pd


# 재질문 패턴
REQUESTION_PATTERNS = [
    "다시", "또", "그럼", "그렇다면", "그게", "그거",
    "위에", "아까", "말한", "설명", "알려주", "말씀"
]

# 참조 표현 패턴
REFERENCE_PATTERNS = [
    "그거", "그게", "아까", "위에", "말씀", "말한",
    "이거", "저거", "그것", "이것", "저것"
]

# 불충분 답변 패턴
INSUFFICIENT_PATTERNS = [
    "죄송", "확인", "문의", "알 수 없", "제공 어려",
    "죄송합니다만", "어렵습니다", "불가능", "확인 필요"
]

# 구체화 키워드
DETAIL_KEYWORDS = ["언제", "어디", "얼마", "몇", "어떻게", "무엇", "누구"]


def _has_pattern(text: str, patterns: list[str]) -> bool:
    """텍스트에 패턴이 포함되어 있는지 확인"""
    if pd.isna(text):
        return False
    t = str(text)
    return any(p in t for p in patterns)


def _extract_keywords(text: str, min_len: int = 2) -> set:
    """텍스트에서 키워드 추출 (간단한 버전)"""
    if pd.isna(text):
        return set()
    words = str(text).split()
    return {w for w in words if len(w) >= min_len}


def _analyze_answer_completeness(df: pd.DataFrame) -> dict[str, Any]:
    """1. 답변 완결성 분석"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    re_question_after_wrong = 0
    same_category_repeat = 0
    re_question_after_insufficient = 0
    samples = []
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        
        for i in range(len(grp) - 1):
            prev_wrong = grp.iloc[i]["오답"]
            prev_answer = str(grp.iloc[i].get("답변", ""))
            next_question = str(grp.iloc[i + 1].get("질문", ""))
            
            # 오답 후 재질문
            if prev_wrong and _has_pattern(next_question, REQUESTION_PATTERNS):
                re_question_after_wrong += 1
                if len(samples) < 5:
                    samples.append({
                        "패턴": "오답_후_재질문",
                        "세션ID": str(sid)[:20],
                        "이전_답변": prev_answer[:50],
                        "다음_질문": next_question[:50]
                    })
            
            # 불충분 답변 후 재질문
            is_insufficient = _has_pattern(prev_answer, INSUFFICIENT_PATTERNS)
            if is_insufficient and _has_pattern(next_question, REQUESTION_PATTERNS):
                re_question_after_insufficient += 1
        
        # 같은 카테고리 반복
        if "카테고리" in grp.columns:
            category_counts = grp["카테고리"].value_counts()
            if (category_counts > 1).any():
                same_category_repeat += 1
    
    total_sessions = len(sessions)
    
    return {
        "분석_가능": True,
        "오답_후_재질문_건수": re_question_after_wrong,
        "같은_카테고리_반복_세션": same_category_repeat,
        "불충분_답변_후_재질문": re_question_after_insufficient,
        "샘플": samples[:5]
    }


def _analyze_keyword_association(df: pd.DataFrame) -> dict[str, Any]:
    """2. 답변-질문 키워드 연관성"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    keyword_match_count = 0
    total_pairs = 0
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        
        for i in range(len(grp) - 1):
            prev_answer_kw = _extract_keywords(grp.iloc[i].get("답변", ""))
            next_question_kw = _extract_keywords(grp.iloc[i + 1].get("질문", ""))
            
            if prev_answer_kw and next_question_kw:
                overlap = prev_answer_kw & next_question_kw
                if len(overlap) >= 1:
                    keyword_match_count += 1
                total_pairs += 1
    
    match_rate = round(100.0 * keyword_match_count / total_pairs, 2) if total_pairs > 0 else 0
    
    return {
        "분석_가능": True,
        "키워드_연관_건수": keyword_match_count,
        "총_턴_쌍_수": total_pairs,
        "키워드_연관_비율": match_rate
    }


def _analyze_category_flow(df: pd.DataFrame) -> dict[str, Any]:
    """3. 카테고리 연속성 및 전환"""
    if "세션ID" not in df.columns or "카테고리" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    continuity_count = 0
    switch_after_wrong = 0
    total_pairs = 0
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        
        for i in range(len(grp) - 1):
            prev_cat = str(grp.iloc[i].get("카테고리", ""))
            next_cat = str(grp.iloc[i + 1].get("카테고리", ""))
            prev_wrong = grp.iloc[i]["오답"]
            
            if prev_cat and next_cat:
                total_pairs += 1
                
                # 카테고리 연속성
                if prev_cat == next_cat:
                    continuity_count += 1
                
                # 오답 후 카테고리 전환
                if prev_wrong and prev_cat != next_cat:
                    switch_after_wrong += 1
    
    continuity_rate = round(100.0 * continuity_count / total_pairs, 2) if total_pairs > 0 else 0
    
    return {
        "분석_가능": True,
        "카테고리_연속_건수": continuity_count,
        "카테고리_연속_비율": continuity_rate,
        "오답_후_전환_건수": switch_after_wrong
    }


def _analyze_context_dependency(df: pd.DataFrame) -> dict[str, Any]:
    """4. 맥락 의존도 분석 (고객 관점)"""
    if "질문" not in df.columns:
        return {"분석_가능": False}
    
    reference_count = df["질문"].apply(lambda x: _has_pattern(x, REFERENCE_PATTERNS)).sum()
    short_question_count = df["질문"].apply(lambda x: len(str(x).strip()) <= 5).sum()
    total_questions = len(df)
    
    reference_rate = round(100.0 * reference_count / total_questions, 2) if total_questions > 0 else 0
    short_rate = round(100.0 * short_question_count / total_questions, 2) if total_questions > 0 else 0
    
    return {
        "분석_가능": True,
        "참조_표현_사용_건수": int(reference_count),
        "참조_표현_비율": reference_rate,
        "짧은_질문_건수": int(short_question_count),
        "짧은_질문_비율": short_rate
    }


def _analyze_information_accumulation(df: pd.DataFrame) -> dict[str, Any]:
    """5. 정보 누적 분석"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    accumulation_sessions = 0
    repetition_sessions = 0
    
    for sid, grp in sessions:
        if len(grp) < 2:
            continue
        
        grp = grp.reset_index(drop=True)
        
        # 세션 내 모든 키워드 수집
        all_keywords = []
        for idx in range(len(grp)):
            q_kw = _extract_keywords(grp.iloc[idx].get("질문", ""))
            all_keywords.append(q_kw)
        
        # 누적 vs 반복 판단
        unique_by_turn = [len(set().union(*all_keywords[:i+1])) for i in range(len(all_keywords))]
        
        if len(unique_by_turn) >= 2:
            growth_rate = (unique_by_turn[-1] - unique_by_turn[0]) / max(unique_by_turn[0], 1)
            
            if growth_rate > 0.5:  # 50% 이상 증가
                accumulation_sessions += 1
            elif growth_rate < 0.2:  # 20% 미만 증가
                repetition_sessions += 1
    
    total_multi_turn = sum(1 for _, grp in sessions if len(grp) >= 2)
    
    return {
        "분석_가능": True,
        "누적형_세션": accumulation_sessions,
        "반복형_세션": repetition_sessions,
        "총_멀티턴_세션": total_multi_turn
    }


def _analyze_conversation_depth(df: pd.DataFrame) -> dict[str, Any]:
    """6. 대화 깊이 분석"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    depth_increase_sessions = 0
    shallow_loop_sessions = 0
    
    for sid, grp in sessions:
        if len(grp) < 2:
            continue
        
        grp = grp.reset_index(drop=True)
        
        # 질문 길이 변화
        lengths = [len(str(q).strip()) for q in grp["질문"]]
        if lengths[-1] > lengths[0] * 1.2:  # 마지막 질문이 첫 질문보다 20% 이상 길면
            depth_increase_sessions += 1
        
        # 구체화 키워드 증가
        detail_counts = [_has_pattern(str(q), DETAIL_KEYWORDS) for q in grp["질문"]]
        if sum(detail_counts[len(detail_counts)//2:]) > sum(detail_counts[:len(detail_counts)//2]):
            depth_increase_sessions += 1
        
        # Shallow Loop: 같은 수준의 짧은 질문 반복
        if all(l < 10 for l in lengths) and len(set(lengths)) <= 2:
            shallow_loop_sessions += 1
    
    total_multi_turn = sum(1 for _, grp in sessions if len(grp) >= 2)
    
    return {
        "분석_가능": True,
        "대화_깊이_증가_세션": depth_increase_sessions,
        "얕은_반복_세션": shallow_loop_sessions,
        "총_멀티턴_세션": total_multi_turn
    }


def _analyze_context_aware_quality(df: pd.DataFrame) -> dict[str, Any]:
    """7. 맥락 활용 답변 품질 (챗봇 평가)"""
    if "질문" not in df.columns or "평가결과" not in df.columns:
        return {"분석_가능": False}
    
    df = df.copy()
    df["맥락_의존"] = df["질문"].apply(lambda x: _has_pattern(x, REFERENCE_PATTERNS))
    df["정답"] = ~df["평가결과"].astype(str).str.contains("오답", na=False)
    
    # 맥락 의존 질문 정답률
    context_questions = df[df["맥락_의존"]]
    normal_questions = df[~df["맥락_의존"]]
    
    context_accuracy = round(100.0 * context_questions["정답"].mean(), 2) if len(context_questions) > 0 else 0
    normal_accuracy = round(100.0 * normal_questions["정답"].mean(), 2) if len(normal_questions) > 0 else 0
    
    # 세션 내 턴 번호별 정답률
    if "세션ID" in df.columns:
        df["턴_번호"] = df.groupby("세션ID").cumcount() + 1
        turn_accuracy = df.groupby("턴_번호")["정답"].mean().head(10).to_dict()
        turn_accuracy = {int(k): round(100.0 * v, 2) for k, v in turn_accuracy.items()}
    else:
        turn_accuracy = {}
    
    return {
        "분석_가능": True,
        "맥락_의존_질문_수": len(context_questions),
        "맥락_의존_정답률": context_accuracy,
        "일반_질문_정답률": normal_accuracy,
        "정답률_차이": round(context_accuracy - normal_accuracy, 2),
        "턴별_정답률": turn_accuracy
    }


def _analyze_context_miss(df: pd.DataFrame) -> dict[str, Any]:
    """8. 맥락 누락 오답 감지 (챗봇 평가)"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    context_miss_count = 0
    context_dependent_wrong = 0
    total_context_questions = 0
    samples = []
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        
        for i in range(len(grp) - 1):
            next_question = str(grp.iloc[i + 1].get("질문", ""))
            next_wrong = grp.iloc[i + 1]["오답"]
            
            # 다음 질문이 참조 표현을 포함
            if _has_pattern(next_question, REFERENCE_PATTERNS):
                total_context_questions += 1
                
                if next_wrong:
                    context_miss_count += 1
                    context_dependent_wrong += 1
                    
                    if len(samples) < 5:
                        samples.append({
                            "세션ID": str(sid)[:20],
                            "이전_답변": str(grp.iloc[i].get("답변", ""))[:50],
                            "참조_질문": next_question[:50],
                            "결과": "오답"
                        })
    
    miss_rate = round(100.0 * context_miss_count / total_context_questions, 2) if total_context_questions > 0 else 0
    
    return {
        "분석_가능": True,
        "맥락_누락_오답_건수": context_miss_count,
        "맥락_의존_질문_총수": total_context_questions,
        "맥락_누락_오답_비율": miss_rate,
        "샘플": samples[:5]
    }


def _analyze_answer_consistency(df: pd.DataFrame) -> dict[str, Any]:
    """9. 세션 내 답변 일관성 (챗봇 평가)"""
    if "세션ID" not in df.columns or "카테고리" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    inconsistency_count = 0
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        category_groups = grp.groupby("카테고리")
        
        for category, cat_grp in category_groups:
            if len(cat_grp) >= 2:
                # 같은 카테고리에서 정답↔오답 전환
                results = cat_grp["오답"].tolist()
                
                for j in range(len(results) - 1):
                    if results[j] != results[j + 1]:
                        inconsistency_count += 1
                        break
    
    return {
        "분석_가능": True,
        "일관성_부족_세션": inconsistency_count
    }


def _analyze_context_chain_success(df: pd.DataFrame) -> dict[str, Any]:
    """10. 맥락 연결 성공률 (챗봇 평가)"""
    if "세션ID" not in df.columns:
        return {"분석_가능": False}
    
    df = df.sort_values(["세션ID", "답변순서"] if "답변순서" in df.columns else ["세션ID", "날짜"])
    sessions = df.groupby("세션ID", sort=False)
    
    chain_success = 0
    chain_fail = 0
    samples = []
    
    for sid, grp in sessions:
        grp = grp.reset_index(drop=True)
        
        for i in range(len(grp) - 1):
            prev_answer_kw = _extract_keywords(grp.iloc[i].get("답변", ""))
            next_question_kw = _extract_keywords(grp.iloc[i + 1].get("질문", ""))
            overlap = prev_answer_kw & next_question_kw
            
            if overlap:  # 키워드 연결이 있음
                next_correct = not grp.iloc[i + 1]["오답"]
                
                if next_correct:
                    chain_success += 1
                else:
                    chain_fail += 1
                    
                    if len(samples) < 5:
                        samples.append({
                            "세션ID": str(sid)[:20],
                            "겹친_키워드": list(overlap)[:3],
                            "다음_질문": str(grp.iloc[i + 1].get("질문", ""))[:50],
                            "결과": "오답"
                        })
    
    total_chain = chain_success + chain_fail
    success_rate = round(100.0 * chain_success / total_chain, 2) if total_chain > 0 else 0
    
    return {
        "분석_가능": True,
        "맥락_연결_성공": chain_success,
        "맥락_연결_실패": chain_fail,
        "맥락_연결_성공률": success_rate,
        "샘플": samples[:5]
    }


def analyze_answer_question_context(df: pd.DataFrame) -> dict[str, Any]:
    """
    이전 턴 답변 → 다음 턴 질문 맥락 분석.
    고객 행동 패턴 (6개) + 챗봇 맥락 활용 평가 (4개)
    """
    if "세션ID" not in df.columns:
        return {
            "답변_질문_맥락_분석_가능": False,
            "이유": "세션ID 컬럼 없음"
        }
    
    # 오답 컬럼 추가
    df = df.copy()
    df["오답"] = df["평가결과"].astype(str).str.strip().str.contains("오답", na=False)
    
    # 고객 행동 패턴 (6개)
    customer_patterns = {
        "답변_완결성": _analyze_answer_completeness(df),
        "키워드_연관성": _analyze_keyword_association(df),
        "카테고리_흐름": _analyze_category_flow(df),
        "맥락_의존도": _analyze_context_dependency(df),
        "정보_누적": _analyze_information_accumulation(df),
        "대화_깊이": _analyze_conversation_depth(df)
    }
    
    # 챗봇 평가 (4개)
    chatbot_evaluation = {
        "맥락_활용_답변_품질": _analyze_context_aware_quality(df),
        "맥락_누락_오답": _analyze_context_miss(df),
        "세션_내_일관성": _analyze_answer_consistency(df),
        "맥락_연결_성공률": _analyze_context_chain_success(df)
    }
    
    return {
        "답변_질문_맥락_분석_가능": True,
        "고객_행동_패턴": customer_patterns,
        "챗봇_맥락_활용_평가": chatbot_evaluation,
        "요약": {
            "설명": "이전 답변이 다음 질문에 미치는 영향을 고객 관점(6개)과 챗봇 평가(4개)로 분석",
            "고객_관점": "재질문, 키워드 연관성, 맥락 의존도 등",
            "챗봇_평가": "맥락 활용 정답률, 맥락 누락 오답, 연결 성공률 등"
        }
    }
