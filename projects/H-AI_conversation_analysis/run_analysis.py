#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
여행사 AI 챗봇 대화 로그 분석 실행 스크립트.
- 질문 유형/키워드별 건수·비중
- 불만·부정 키워드 및 원인 분류
- RAG·프롬프트·피드백 루프 개선 권고
"""
import json
import sys
from pathlib import Path

import pandas as pd

# 프로젝트 루트 기준
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from src.load_data import load_chat_log, load_chat_log_any
from src.analysis_question_types import analyze_question_types
from src.analysis_negative import analyze_negative
from src.analysis_context_intent import run_context_and_intent_analysis
from src.analysis_conversation_review import run_conversation_review_analysis
from src.recommendations import build_recommendations
from src.report_html import save_html_report


DEFAULT_CSV = ROOT / "20260205_26033건.csv"
OUTPUT_JSON = ROOT / "analysis_report.json"
OUTPUT_SUMMARY = ROOT / "analysis_summary.txt"
OUTPUT_HTML = ROOT / "analysis_report.html"


def _truncate_lists(obj, max_items=50):
        if isinstance(obj, list) and len(obj) > max_items:
            return obj[:max_items] + [f"... (총 {len(obj)}건, 상위 {max_items}건만 저장)"]
        if isinstance(obj, dict):
            return {k: _truncate_lists(v, max_items) for k, v in obj.items()}
        if isinstance(obj, list):
            return [_truncate_lists(i, max_items) for i in obj]
        return obj


def run_from_df(df: pd.DataFrame) -> dict:
    """DataFrame을 받아 분석만 수행하고 report dict를 반환한다. (저장 없음)"""
    question_types = analyze_question_types(df)
    negative_analysis = analyze_negative(df)
    context_intent = run_context_and_intent_analysis(df)
    conversation_review = run_conversation_review_analysis(df)
    recommendations = build_recommendations(question_types, negative_analysis)
    report = {
        "질문_유형_분석": question_types,
        "불만_부정_분석": negative_analysis,
        "문맥_의도_분석": context_intent,
        "대화_리뷰_분석": conversation_review,
        "개선_권고": recommendations,
    }
    return _truncate_lists(report)


def run(csv_path: str | Path | None = None) -> dict:
    csv_path = csv_path or DEFAULT_CSV
    csv_path = Path(csv_path)
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV 파일을 찾을 수 없습니다: {csv_path}")

    print("데이터 로딩 중...")
    df = load_chat_log_any(str(csv_path))
    print(f"로드 완료: {len(df):,}건")

    print("1) 질문 유형·키워드 분석...")
    question_types = analyze_question_types(df)

    print("2) 불만/부정 키워드·원인 분석...")
    negative_analysis = analyze_negative(df)

    print("3) 문맥·의도 분석 (세션별 연속 턴, 의도 클러스터링)...")
    context_intent = run_context_and_intent_analysis(df)

    print("4) Conversation Review + 고객 심리 입체 분석...")
    conversation_review = run_conversation_review_analysis(df)

    print("5) RAG·프롬프트·피드백 루프 권고 생성...")
    recommendations = build_recommendations(question_types, negative_analysis)

    report = {
        "질문_유형_분석": question_types,
        "불만_부정_분석": negative_analysis,
        "문맥_의도_분석": context_intent,
        "대화_리뷰_분석": conversation_review,
        "개선_권고": recommendations,
    }

    # 기존 JSON에 개선_권고_상세(LLM 반영분)가 있으면 유지
    if OUTPUT_JSON.exists():
        try:
            with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
                existing = json.load(f)
            existing_detail = (existing.get("개선_권고") or {}).get("개선_권고_상세")
            if existing_detail is not None and (not isinstance(existing_detail, dict) or existing_detail):
                report["개선_권고"]["개선_권고_상세"] = existing_detail
        except Exception:
            pass
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(_truncate_lists(report), f, ensure_ascii=False, indent=2)

    # HTML 보고서 (비개발자용)
    save_html_report(report, OUTPUT_HTML)

    # 요약 텍스트
    lines = [
        "=" * 60,
        "여행사 AI 챗봇 대화 로그 분석 요약",
        "=" * 60,
        "",
        "[1] 질문 유형 (카테고리별 상위 10)",
        "-" * 40,
    ]
    for c in question_types.get("카테고리별", [])[:10]:
        lines.append(f"  {c.get('카테고리')}: {c.get('건수')}건 ({c.get('비중(%)')}%)")
    lines.extend([
        "",
        "[2] 키워드별 출현 (상위 15)",
        "-" * 40,
    ])
    for k in question_types.get("키워드별", [])[:15]:
        lines.append(f"  {k.get('키워드')}: {k.get('출현건수')}건 ({k.get('비중(%)')}%)")
    lines.extend([
        "",
        "[3] 오답 현황",
        "-" * 40,
        f"  총 건수: {negative_analysis.get('총_건수')}",
        f"  오답 건수: {negative_analysis.get('오답_건수')}",
        f"  오답률: {negative_analysis.get('오답률(%)')}%",
        "",
        "오답 원인 분류",
    ])
    for x in negative_analysis.get("오답_원인_분류", []):
        lines.append(f"  - {x.get('원인_유형')}: {x.get('건수')}건 ({x.get('비중(오답대비%)')}%)")
    lines.extend([
        "",
        "카테고리별 오답 (상위 5)",
    ])
    for w in negative_analysis.get("카테고리별_오답", [])[:5]:
        lines.append(f"  - {w.get('카테고리')}: {w.get('오답_건수')}건 ({w.get('비중(오답대비%)')}%)")
    # 문맥·의도 요약
    ctx = context_intent.get("세션_문맥_분석", {})
    if ctx.get("세션_분석_가능"):
        lines.extend([
            "",
            "[4] 문맥 분석 (세션 단위)",
            "-" * 40,
            f"  오답 직후 불만(다음 턴에서 부정 표현): {ctx.get('오답_직후_불만_건수', 0)} 세션",
            f"  첫 턴부터 부정: {ctx.get('첫턴_부정_건수', 0)} 세션",
            f"  평균 세션당 턴 수: {ctx.get('평균_세션당_턴수', 0)}",
        ])
    intent = context_intent.get("의도_클러스터링", {})
    if intent.get("의도_클러스터링_가능"):
        lines.append(f"  의도 클러스터: {intent.get('클러스터_수', 0)}개 (텍스트 유사도 기반)")
    # Conversation Review + 숨은 리스크
    cr = conversation_review
    lines.extend(["", "[5] 대화 리뷰 (Conversation Review + 고객 심리)", "-" * 40])
    if cr.get("세션_리뷰_지표") and cr["세션_리뷰_지표"].get("총_세션_수") is not None:
        sr = cr["세션_리뷰_지표"]
        lines.append(f"  총 세션: {sr.get('총_세션_수', 0):,} | 오답 1회 이상 세션: {sr.get('오답_1회이상_세션_수', 0):,} | 오답 2회 이상(좌절): {sr.get('오답_2회이상_세션_수', 0):,}")
    psych = cr.get("고객_심리_지표", {})
    lines.append(f"  오답 턴 중 긴급/불안 질문 비율: {psych.get('오답_턴_중_긴급_질문_비율', 0)}% | 혼란/모호: {psych.get('오답_턴_중_혼란_질문_비율', 0)}%")
    for r in cr.get("숨은_리스크_요약", [])[:5]:
        lines.append(f"  [리스크] {r.get('유형')}: {r.get('내용', '')[:70]}…")
    lines.extend([
        "",
        "[6] 개선 권고 요약",
        "-" * 40,
    ])
    for s in recommendations.get("우선순위_요약", []):
        lines.append(f"  • {s}")
    lines.append("")
    lines.append(f"상세 리포트: {OUTPUT_JSON}")
    lines.append(f"HTML 보고서: {OUTPUT_HTML} (브라우저에서 열어보기)")
    summary_text = "\n".join(lines)

    with open(OUTPUT_SUMMARY, "w", encoding="utf-8") as f:
        f.write(summary_text)

    print(f"\n결과 저장: {OUTPUT_JSON}, {OUTPUT_SUMMARY}, {OUTPUT_HTML}")
    print("\n" + summary_text)
    return report


if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else None
    run(csv_file)
