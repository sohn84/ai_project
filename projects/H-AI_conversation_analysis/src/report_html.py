# -*- coding: utf-8 -*-
"""
분석 결과(JSON 또는 dict)를 비개발자가 보기 쉬운 HTML 보고서로 변환한다.
"""
import json
from pathlib import Path
from typing import Any


def _bar_cell(pct: float, max_pct: float = 100.0) -> str:
    width = min(100, max(0, (pct / max_pct) * 100)) if max_pct else 0
    return f'<span class="bar" style="width:{width}%"></span>'


def _table(rows: list[dict], columns: list[tuple[str, str]], title: str = "") -> str:
    """rows: list of dict, columns: [(key, header_label), ...]"""
    head = "".join(f"<th>{h}</th>" for _, h in columns)
    trs = []
    for r in rows:
        cells = []
        for k, _ in columns:
            val = r.get(k, "")
            if isinstance(val, list):
                val = ", ".join(str(x) for x in val[:10])
            cells.append(f"<td>{val}</td>")
        trs.append("<tr>" + "".join(cells) + "</tr>")
    tbl = f"<table><thead><tr>{head}</tr></thead><tbody>" + "".join(trs) + "</tbody></table>"
    if title:
        return f"<h3>{title}</h3>" + tbl
    return tbl


def build_html(report: dict[str, Any]) -> str:
    """분석 리포트 dict를 HTML 문자열로 변환한다."""
    q = report.get("질문_유형_분석") or {}
    neg = report.get("불만_부정_분석") or {}
    ctx_intent = report.get("문맥_의도_분석") or {}
    rec = report.get("개선_권고") or {}

    total = q.get("총_건수", 0)
    n_wrong = neg.get("오답_건수", 0)
    wrong_pct = neg.get("오답률(%)", 0)

    html_parts = ["""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>여행사 AI 챗봇 대화 로그 분석 보고서</title>
<style>
* { box-sizing: border-box; }
body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; margin: 0; padding: 24px; background: #f5f5f5; color: #222; line-height: 1.6; }
.report { max-width: 960px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
h1 { font-size: 1.75rem; color: #1a1a2e; border-bottom: 3px solid #4361ee; padding-bottom: 12px; margin-top: 0; }
h2 { font-size: 1.25rem; color: #2d3748; margin-top: 32px; margin-bottom: 16px; }
h3 { font-size: 1.05rem; color: #4a5568; margin-top: 20px; margin-bottom: 10px; }
.summary-cards { display: flex; flex-wrap: wrap; gap: 16px; margin: 20px 0; }
.card { background: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%); color: #fff; padding: 20px; border-radius: 10px; min-width: 140px; }
.card.warn { background: linear-gradient(135deg, #e85d04 0%, #dc2f02 100%); }
.card.ok { background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%); }
.card strong { display: block; font-size: 1.5rem; margin-bottom: 4px; }
.card span { font-size: 0.9rem; opacity: .95; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.95rem; }
th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
th { background: #f8fafc; color: #475569; font-weight: 600; }
tr:hover { background: #f8fafc; }
.bar-cell { position: relative; }
.bar { position: absolute; left: 0; top: 0; bottom: 0; background: #4361ee; opacity: 0.2; border-radius: 2px; }
ul.recommend { list-style: none; padding: 0; margin: 0; }
ul.recommend li { padding: 12px 16px; margin: 8px 0; background: #f0f4ff; border-left: 4px solid #4361ee; border-radius: 0 8px 8px 0; }
.sample-box { background: #f8fafc; padding: 12px; border-radius: 8px; margin: 8px 0; font-size: 0.9rem; color: #475569; }
.sample-box strong { color: #1e293b; }
details { margin: 8px 0; border: 1px solid #e2e8f0; border-radius: 8px; }
details summary { padding: 10px 12px; cursor: pointer; font-weight: 600; background: #f8fafc; }
details[open] summary { border-bottom: 1px solid #e2e8f0; }
.depth2-table { margin-left: 12px; }
.note-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin: 12px 0; border-radius: 0 8px 8px 0; }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b; }
</style>
</head>
<body>
<div class="report">
<h1>여행사 AI 챗봇 대화 로그 분석 보고서</h1>
<p>고객 대화·AI 답변 이력을 바탕으로 한 질문 유형, 불만/부정 키워드, 오답 원인 및 개선 권고 요약입니다.</p>
"""]

    # 요약 카드
    html_parts.append('<div class="summary-cards">')
    html_parts.append(f'<div class="card"><strong>{total:,}</strong><span>총 대화 건수</span></div>')
    html_parts.append(f'<div class="card ok"><strong>{total - n_wrong:,}</strong><span>정답 건수</span></div>')
    html_parts.append(f'<div class="card warn"><strong>{n_wrong:,}</strong><span>오답 건수</span></div>')
    html_parts.append(f'<div class="card"><strong>{wrong_pct}%</strong><span>오답률</span></div>')
    html_parts.append('</div>')

    # 1. 질문 유형 (2뎁스: 1뎁=카테고리, 2뎁=분류, 클릭 시 샘플 5건)
    html_parts.append("<h2>1. 고객 질문 유형</h2>")
    cat_2depth = q.get("카테고리_2뎁스", [])
    if cat_2depth:
        html_parts.append("<h3>카테고리 2뎁스 (1뎁별 건수·비중, 2뎁 항목 클릭 시 고객 질의·AI 답변 샘플 5건)</h3>")
        for item in cat_2depth:
            if not isinstance(item, dict):
                continue
            one = item.get("1뎁_카테고리", "")
            one_cnt = item.get("1뎁_건수", 0)
            one_pct = item.get("1뎁_비중(%)", 0)
            two_list = item.get("2뎁_목록", [])
            html_parts.append(f"<p><strong>1뎁: {one}</strong> (건수: {one_cnt:,}건, 비중: {one_pct}%)</p>")
            if two_list:
                html_parts.append('<table class="depth2-table"><thead><tr><th>2뎁 분류</th><th>건수</th><th>비중</th><th>샘플 보기</th></tr></thead><tbody>')
                for two in two_list[:15]:
                    if not isinstance(two, dict):
                        continue
                    samples = two.get("샘플", [])
                    sample_html = ""
                    if samples:
                        sample_html = "<details><summary>샘플 5건 보기</summary>"
                        for i, s in enumerate(samples[:5], 1):
                            qq = s.get("질문", "") if isinstance(s, dict) else ""
                            aa = s.get("답변", "") if isinstance(s, dict) else ""
                            sample_html += f'<div class="sample-box"><strong>[{i}] 질문:</strong> {qq}<br><strong>답변:</strong> {aa}</div>'
                        sample_html += "</details>"
                    html_parts.append(f"<tr><td>{two.get('분류','')}</td><td>{two.get('건수',0):,}</td><td>{two.get('비중(%)',0)}%</td><td>{sample_html}</td></tr>")
                html_parts.append("</tbody></table>")
            else:
                html_parts.append('<p class="note-box">2뎁 분류 매핑 없음 (해당 카테고리 건수·비중만 표시)</p>')
    cat_rows = q.get("카테고리별", [])
    if cat_rows and not cat_2depth:
        rows_html = []
        for r in cat_rows:
            if not isinstance(r, dict):
                continue
            pct = r.get("비중(%)", 0)
            bar = _bar_cell(pct, 20)
            rows_html.append(f"<tr><td>{r.get('카테고리','')}</td><td>{r.get('건수',0):,}</td><td>{pct}%</td><td class=\"bar-cell\">{bar}</td></tr>")
        html_parts.append("""<h3>카테고리별 건수·비중</h3>
<table><thead><tr><th>카테고리</th><th>건수</th><th>비중</th><th></th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")
    # 예약 상담 안내
    ex_guide = q.get("예약_상담_안내", {})
    if isinstance(ex_guide, dict):
        html_parts.append("<h3>예약 상담 카테고리 안내</h3>")
        html_parts.append(f'<div class="note-box"><p>{ex_guide.get("안내", "")}</p>')
        if ex_guide.get("예약_관련_카테고리_목록"):
            lst = ex_guide.get("예약_관련_카테고리_목록", [])
        html_parts.append(f"<p>현재 예약 관련 카테고리: {', '.join(lst)}</p>")
        html_parts.append("</div>")

    cls_rows = q.get("분류별", [])
    if cls_rows:
        rows_html = []
        for r in cls_rows[:15]:
            if not isinstance(r, dict):
                continue
            pct = r.get("비중(%)", 0)
            bar = _bar_cell(pct, 60)
            rows_html.append(f"<tr><td>{r.get('분류','')}</td><td>{r.get('건수',0):,}</td><td>{pct}%</td><td class=\"bar-cell\">{bar}</td></tr>")
        html_parts.append("""<h3>분류별 건수·비중 (상위 15)</h3>
<table><thead><tr><th>분류</th><th>건수</th><th>비중</th><th></th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")

    kw_rows = q.get("키워드별", [])
    if kw_rows:
        rows_html = []
        for r in kw_rows[:25]:
            if not isinstance(r, dict):
                continue
            cnt = r.get("출현건수", r.get("건수", 0))
            pct = r.get("비중(%)", 0)
            bar = _bar_cell(pct, 35)
            rows_html.append(f"<tr><td>{r.get('키워드','')}</td><td>{cnt:,}</td><td>{pct}%</td><td class=\"bar-cell\">{bar}</td></tr>")
        html_parts.append("""<h3>키워드별 출현 (상위 25)</h3>
<table><thead><tr><th>키워드</th><th>출현 건수</th><th>비중</th><th></th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")

    # 2. 불만/부정 분석 (오답 판단 근거, 원인별 샘플 5건, 오답사유 빈도 구문)
    html_parts.append("<h2>2. 불만·부정 키워드 및 오답 분석</h2>")
    if neg.get("오답_판단_근거"):
        html_parts.append("<h3>오답 판단 근거</h3>")
        html_parts.append(f'<div class="note-box"><p>{neg.get("오답_판단_근거", "").replace("**", "")}</p></div>')
    neg_kw = neg.get("질문_내_부정키워드_건수", [])
    if neg_kw:
        rows_html = []
        for r in neg_kw:
            if not isinstance(r, dict):
                continue
            rows_html.append(f"<tr><td>{r.get('키워드','')}</td><td>{r.get('건수',0):,}</td><td>{r.get('비중(%)',0)}%</td></tr>")
        html_parts.append("""<h3>질문에 포함된 부정·불만 키워드</h3>
<table><thead><tr><th>키워드</th><th>건수</th><th>비중</th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")

    cause_rows = neg.get("오답_원인_분류", [])
    if cause_rows:
        html_parts.append("<h3>오답 원인 분류 (클릭 시 해당 원인별 질문·답변 샘플 5건)</h3>")
        rows_html = []
        for r in cause_rows:
            if not isinstance(r, dict):
                continue
            pct = r.get("비중(오답대비%)", 0)
            bar = _bar_cell(pct, 50)
            samples_5 = r.get("샘플_5건", [])
            cell = f"<td>{r.get('원인_유형','')}</td><td>{r.get('건수',0):,}</td><td>{pct}%</td><td class=\"bar-cell\">{bar}</td>"
            if samples_5:
                detail = "<details><summary>샘플 5건 보기</summary>"
                for i, s in enumerate(samples_5[:5], 1):
                    qq = s.get("질문", "") if isinstance(s, dict) else ""
                    aa = s.get("답변", "") if isinstance(s, dict) else ""
                    detail += f'<div class="sample-box"><strong>[{i}] 질문:</strong> {qq}<br><strong>답변:</strong> {aa}</div>'
                detail += "</details>"
                rows_html.append(f"<tr>{cell}<td>{detail}</td></tr>")
            else:
                rows_html.append(f"<tr>{cell}<td></td></tr>")
        html_parts.append("""<table><thead><tr><th>원인 유형</th><th>건수</th><th>비중(오답 대비)</th><th></th><th>샘플</th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")

    wrong_cat = neg.get("카테고리별_오답", [])
    if wrong_cat:
        html_parts.append("<h3>카테고리별 오답 (클릭 시 샘플 5건)</h3>")
        rows_html = []
        for r in wrong_cat[:10]:
            if not isinstance(r, dict):
                continue
            samples_5 = r.get("샘플_5건", [])
            cell = f"<td>{r.get('카테고리','')}</td><td>{r.get('오답_건수',0):,}</td><td>{r.get('비중(오답대비%)',0)}%</td>"
            if samples_5:
                detail = "<details><summary>샘플 5건 보기</summary>"
                for i, s in enumerate(samples_5[:5], 1):
                    qq = s.get("질문", "") if isinstance(s, dict) else ""
                    aa = s.get("답변", "") if isinstance(s, dict) else ""
                    detail += f'<div class="sample-box"><strong>[{i}] 질문:</strong> {qq}<br><strong>답변:</strong> {aa}</div>'
                detail += "</details>"
                rows_html.append(f"<tr>{cell}<td>{detail}</td></tr>")
            else:
                rows_html.append(f"<tr>{cell}<td></td></tr>")
        html_parts.append("""<table><thead><tr><th>카테고리</th><th>오답 건수</th><th>비중</th><th>샘플</th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")
    freq_phrases = neg.get("오답사유_빈도_구문", [])
    if freq_phrases:
        html_parts.append("<h3>오답사유에서 자주 나오는 구문 (RAG 보강 참고)</h3>")
        html_parts.append("<p>오답 사유 텍스트에서 반복된 구문입니다. 어떤 지식/답변이 부족한지 판단 시 참고하세요.</p>")
        rows = []
        for x in freq_phrases[:20]:
            if isinstance(x, dict):
                rows.append(f"<tr><td>{x.get('구문','')}</td><td>{x.get('출현횟수',0)}</td></tr>")
        html_parts.append("""<table><thead><tr><th>구문</th><th>출현 횟수</th></tr></thead><tbody>""" + "".join(rows) + "</tbody></table>")
    # 오답 시 AI 답변이 '죄송합니다'로 시작하는 건 트래킹
    apology_track = neg.get("오답_중_답변_죄송_시작") or {}
    if apology_track and isinstance(apology_track, dict):
        cnt = apology_track.get("건수", 0)
        pct = apology_track.get("비중(오답대비%)", 0)
        html_parts.append("<h3>오답 시 AI 답변 중 '죄송합니다'로 시작하는 건</h3>")
        html_parts.append(f"<p>오답으로 판정된 턴 중 AI 답변이 <strong>죄송합니다/죄송해요/죄송합니다만/죄송하지만</strong> 등으로 시작하는 건: <strong>{cnt:,}건</strong> (오답 대비 {pct}%). 직접 답 대신 사과만 반복되는 패턴 점검 시 참고하세요.</p>")
        samples_apology = apology_track.get("샘플_5건", [])
        if samples_apology:
            html_parts.append("<details><summary>샘플 5건 보기</summary>")
            for i, s in enumerate(samples_apology[:5], 1):
                if isinstance(s, dict):
                    html_parts.append(f'<div class="sample-box"><strong>[{i}] 질문:</strong> {s.get("질문","")}<br><strong>답변:</strong> {s.get("답변","")}</div>')
            html_parts.append("</details>")

    samples = neg.get("오답_원인_샘플") or {}
    if samples:
        html_parts.append("<h3>오답 사유 샘플</h3>")
        labels = {"ai_failure": "AI 답변 품질/직접 답변 부재", "other_venting": "기타·고객센터 연락 등", "unclear": "기타/불명확"}
        for key, label in labels.items():
            arr = samples.get(key) or []
            if arr:
                html_parts.append(f'<p><strong>{label}</strong></p>')
                for s in arr[:3]:
                    if isinstance(s, str):
                        html_parts.append(f'<div class="sample-box">{s}</div>')

    # 3. 문맥·의도 분석 (세션 연속 턴, 의도 클러스터)
    html_parts.append("<h2>3. 문맥·의도 기반 분석</h2>")
    html_parts.append("<p>키워드 단순 집계를 보완해, <strong>세션 단위 연속 턴</strong>과 <strong>질문 텍스트 유사도 기반 의도 그룹</strong>을 반영했습니다.</p>")
    session_ctx = ctx_intent.get("세션_문맥_분석") or {}
    if session_ctx.get("세션_분석_가능"):
        html_parts.append("<h3>세션 문맥 (연속 대화 기준)</h3>")
        html_parts.append(f"<p>총 세션 수: <strong>{session_ctx.get('총_세션_수', 0):,}</strong> | ")
        html_parts.append(f"평균 세션당 턴 수: <strong>{session_ctx.get('평균_세션당_턴수', 0)}</strong></p>")
        html_parts.append("""<table><thead><tr><th>지표</th><th>건수(세션 수)</th><th>의미</th></tr></thead><tbody>""")
        html_parts.append(f"<tr><td>오답 직후 불만</td><td>{session_ctx.get('오답_직후_불만_건수', 0):,}</td><td>AI가 오답 준 직후 다음 턴에서 부정 표현 → AI 답변 불만 가능성 높음</td></tr>")
        html_parts.append(f"<tr><td>첫 턴부터 부정</td><td>{session_ctx.get('첫턴_부정_건수', 0):,}</td><td>세션 첫 질문부터 부정 표현 → 화풀이/선입견 가능성</td></tr>")
        html_parts.append("</tbody></table>")
        for sample in session_ctx.get("오답_직후_불만_샘플", [])[:3]:
            if isinstance(sample, dict):
                html_parts.append('<div class="sample-box">')
                html_parts.append(f"<strong>오답 질문:</strong> {sample.get('오답_질문', '')} …<br>")
                html_parts.append(f"<strong>직후 질문:</strong> {sample.get('직후_질문', '')} …")
                html_parts.append("</div>")
    else:
        html_parts.append(f"<p>세션 분석: {session_ctx.get('이유', '해당 없음')}</p>")
    intent_cl = ctx_intent.get("의도_클러스터링") or {}
    if intent_cl.get("의도_클러스터링_가능"):
        html_parts.append("<h3>의도 클러스터 (텍스트 유사도 기반)</h3>")
        html_parts.append(f"<p>질문 문장 유사도(TF-IDF·글자 n-gram)로 묶은 <strong>{intent_cl.get('클러스터_수', 0)}개</strong> 그룹 (분석 질문 수: {intent_cl.get('분석_질문_수', 0):,}건). 키워드 목록 없이 데이터에서 도출된 의도 유형입니다.</p>")
        rows_html = []
        for r in intent_cl.get("의도_클러스터_요약", [])[:12]:
            if not isinstance(r, dict):
                continue
            kw = r.get("대표_키워드", [])
            kw_str = ", ".join(str(x) for x in kw[:8]) if isinstance(kw, list) else str(kw)
            samples = r.get("질문_샘플", [])
            sample_str = " | ".join(str(s)[:40] for s in samples) if isinstance(samples, list) else ""
            rows_html.append(f"<tr><td>{r.get('클러스터','')}</td><td>{r.get('건수',0):,}</td><td>{r.get('비중(%)',0)}%</td><td>{kw_str}</td><td>{sample_str}</td></tr>")
        html_parts.append("""<table><thead><tr><th>그룹</th><th>건수</th><th>비중</th><th>대표 키워드</th><th>질문 샘플</th></tr></thead><tbody>""")
        html_parts.append("".join(rows_html))
        html_parts.append("</tbody></table>")
    else:
        html_parts.append(f"<p>의도 클러스터: {intent_cl.get('이유', '해당 없음')}</p>")
    
    # 3-1. 답변-질문 맥락 분석 (이전 답변이 다음 질문에 미치는 영향)
    aq_context = ctx_intent.get("답변_질문_맥락_분석") or {}
    if aq_context.get("답변_질문_맥락_분석_가능"):
        html_parts.append("<h3>답변-질문 맥락 분석 (이전 답변 → 다음 질문 영향)</h3>")
        html_parts.append("<p>챗봇이 멀티턴 맥락을 얼마나 잘 활용하는지 평가합니다.</p>")
        
        # A. 고객 행동 패턴
        customer_patterns = aq_context.get("고객_행동_패턴") or {}
        html_parts.append("<h4>A. 고객 행동 패턴</h4>")
        
        # 답변 완결성
        completeness = customer_patterns.get("답변_완결성") or {}
        if completeness.get("분석_가능"):
            html_parts.append("""<table><thead><tr><th>지표</th><th>건수</th><th>의미</th></tr></thead><tbody>""")
            html_parts.append(f"<tr><td>오답 후 재질문</td><td>{completeness.get('오답_후_재질문_건수', 0):,}</td><td>오답 직후 재질문 키워드 출현</td></tr>")
            html_parts.append(f"<tr><td>같은 카테고리 반복 세션</td><td>{completeness.get('같은_카테고리_반복_세션', 0):,}</td><td>불충분 답변으로 같은 주제 재질문</td></tr>")
            html_parts.append(f"<tr><td>불충분 답변 후 재질문</td><td>{completeness.get('불충분_답변_후_재질문', 0):,}</td><td>사과/확인 답변 후 재질문</td></tr>")
            html_parts.append("</tbody></table>")
        
        # 키워드 연관성
        keyword_assoc = customer_patterns.get("키워드_연관성") or {}
        if keyword_assoc.get("분석_가능"):
            html_parts.append(f"<p><strong>키워드 연관성:</strong> 이전 답변 키워드가 다음 질문에 포함된 비율 <strong>{keyword_assoc.get('키워드_연관_비율', 0)}%</strong></p>")
        
        # 맥락 의존도
        context_dep = customer_patterns.get("맥락_의존도") or {}
        if context_dep.get("분석_가능"):
            html_parts.append(f"<p><strong>맥락 의존도:</strong> 참조 표현 사용 <strong>{context_dep.get('참조_표현_비율', 0)}%</strong> ('그거', '아까' 등)</p>")
        
        # B. 챗봇 맥락 활용 평가 ⭐
        chatbot_eval = aq_context.get("챗봇_맥락_활용_평가") or {}
        html_parts.append("<h4>B. 챗봇 맥락 활용 평가 ⭐</h4>")
        html_parts.append("<p>챗봇이 멀티턴 대화에서 이전 맥락을 얼마나 잘 이해하고 활용하는지 평가합니다.</p>")
        
        # 맥락 활용 답변 품질
        context_quality = chatbot_eval.get("맥락_활용_답변_품질") or {}
        if context_quality.get("분석_가능"):
            html_parts.append("""<table><thead><tr><th>지표</th><th>값</th><th>의미</th></tr></thead><tbody>""")
            html_parts.append(f"<tr><td>맥락 의존 질문 정답률</td><td><strong>{context_quality.get('맥락_의존_정답률', 0)}%</strong></td><td>vs 일반 질문 {context_quality.get('일반_질문_정답률', 0)}% (차이: {context_quality.get('정답률_차이', 0):+.1f}%)</td></tr>")
            html_parts.append(f"<tr><td>맥락 의존 질문 수</td><td>{context_quality.get('맥락_의존_질문_수', 0):,}건</td><td>참조 표현이 있는 질문</td></tr>")
            html_parts.append("</tbody></table>")
        
        # 맥락 누락 오답
        context_miss = chatbot_eval.get("맥락_누락_오답") or {}
        if context_miss.get("분석_가능"):
            html_parts.append(f"<p><strong>맥락 누락 오답:</strong> {context_miss.get('맥락_누락_오답_건수', 0):,}건 ({context_miss.get('맥락_누락_오답_비율', 0)}%) - 참조 표현 질문에서 오답</p>")
            for sample in context_miss.get("샘플", [])[:2]:
                if isinstance(sample, dict):
                    html_parts.append('<div class="sample-box">')
                    html_parts.append(f"<strong>이전 답변:</strong> {sample.get('이전_답변', '')}…<br>")
                    html_parts.append(f"<strong>참조 질문:</strong> {sample.get('참조_질문', '')}… → 오답")
                    html_parts.append("</div>")
        
        # 맥락 연결 성공률
        chain_success = chatbot_eval.get("맥락_연결_성공률") or {}
        if chain_success.get("분석_가능"):
            html_parts.append(f"<p><strong>맥락 연결 성공률:</strong> {chain_success.get('맥락_연결_성공률', 0)}% (키워드 연결 시 정답 비율)</p>")
            html_parts.append(f"<p style='font-size:0.9em;color:#888;'>성공 {chain_success.get('맥락_연결_성공', 0):,}건 / 실패 {chain_success.get('맥락_연결_실패', 0):,}건</p>")
        
        # 일관성
        consistency = chatbot_eval.get("세션_내_일관성") or {}
        if consistency.get("분석_가능"):
            html_parts.append(f"<p><strong>세션 내 일관성 부족:</strong> {consistency.get('일관성_부족_세션', 0):,} 세션 (같은 카테고리에 정답↔오답 전환)</p>")
        
        # 권고사항
        html_parts.append('<div class="recommendation-box">')
        html_parts.append("<strong>📌 개선 권고</strong><ul>")
        
        # 조건부 권고
        if context_quality.get("정답률_차이", 0) < -5:
            html_parts.append("<li>맥락 의존 질문 정답률이 일반 질문보다 낮음 → RAG 검색 시 이전 1~2턴 포함</li>")
        
        if context_miss.get("맥락_누락_오답_비율", 0) > 20:
            html_parts.append(f"<li>맥락 누락 오답 {context_miss.get('맥락_누락_오답_건수', 0):,}건 → 프롬프트에 세션 맥락 명시</li>")
        
        if chain_success.get("맥락_연결_성공률", 0) < 60:
            html_parts.append("<li>맥락 연결 성공률이 낮음 → 대화 흐름 이해 개선 필요</li>")
        
        if consistency.get("일관성_부족_세션", 0) > 50:
            html_parts.append("<li>일관성 부족 세션 다수 → 세션 맥락 유지 강화</li>")
        
        html_parts.append("</ul></div>")

    # 4. 대화 리뷰 (Conversation Review + 고객 심리, 숨은 리스크)
    cr = report.get("대화_리뷰_분석") or {}
    if cr:
        html_parts.append("<h2>4. 대화 리뷰 (Conversation Review + 고객 심리)</h2>")
        html_parts.append("<p>Rasa Conversation Review 개념을 적용해, <strong>세션 단위 플로우·태그 제안</strong>과 <strong>고객 심리(긴급/혼란/좌절)</strong> 관점으로 입체 분석했습니다. 표면 오답률이 낮아도 세션 내 반복 오답·의도 전환 후 오답 등 <strong>숨은 리스크</strong>를 강조합니다.</p>")
        # 고객 심리 지표
        psych = cr.get("고객_심리_지표") or {}
        if psych:
            html_parts.append("<h3>고객 심리·행동 지표</h3>")
            html_parts.append("""<table><thead><tr><th>지표</th><th>값</th><th>의미</th></tr></thead><tbody>""")
            html_parts.append(f"<tr><td>오답 턴 중 긴급/불안 질문 비율</td><td>{psych.get('오답_턴_중_긴급_질문_비율', 0)}%</td><td>급해·취소·확인 등 — 긴급한 고객이 오답을 받은 비중</td></tr>")
            html_parts.append(f"<tr><td>오답 턴 중 혼란/모호 질문 비율</td><td>{psych.get('오답_턴_중_혼란_질문_비율', 0)}%</td><td>그거·위에·어떻게 등 — 의도 불명확로 잘못 라우팅되기 쉬운 질문</td></tr>")
            html_parts.append(f"<tr><td>오답 턴 중 부정 표현 비율</td><td>{psych.get('오답_턴_중_부정_질문_비율', 0)}%</td><td>이미 불만이 있는 상태에서 오답 경험</td></tr>")
            html_parts.append("</tbody></table>")
        # 세션 리뷰 (세션ID 있을 때)
        sr = cr.get("세션_리뷰_지표") or {}
        if sr.get("총_세션_수") is not None:
            html_parts.append("<h3>세션 리뷰 지표 (Rasa 스타일)</h3>")
            html_parts.append(f"<p>총 세션 <strong>{sr.get('총_세션_수', 0):,}</strong> | 오답 1회 이상 세션 <strong>{sr.get('오답_1회이상_세션_수', 0):,}</strong> | 오답 2회 이상(좌절 가능성) <strong>{sr.get('오답_2회이상_세션_수', 0):,}</strong> | 첫 턴 부정 <strong>{sr.get('첫턴_부정_세션_수', 0):,}</strong> | 의도 전환 후 오답 <strong>{sr.get('의도_전환_후_오답_세션_수', 0):,}</strong></p>")
            html_parts.append("<h4>태그 제안 요약 (검토 대상 필터링용)</h4>")
            html_parts.append("""<table><thead><tr><th>태그 후보</th><th>의미</th><th>세션 수</th><th>비고</th></tr></thead><tbody>""")
            for t in cr.get("태그_제안_요약", []):
                cnt = t.get("세션_수", t.get("샘플_세션_수", 0))
                html_parts.append(f"<tr><td>{t.get('태그_후보','')}</td><td>{t.get('의미','')}</td><td>{cnt}</td><td>{t.get('비고','')}</td></tr>")
            html_parts.append("</tbody></table>")
        elif sr.get("이유"):
            html_parts.append(f"<p>세션 리뷰: {sr.get('이유')} — {sr.get('메시지', '')}</p>")
        # 숨은 리스크 요약
        risks = cr.get("숨은_리스크_요약") or []
        if risks:
            html_parts.append("<h3>숨은 리스크 요약 (잘 보여도 주의할 점)</h3>")
            html_parts.append("<ul class=\"recommend\">")
            for r in risks:
                if isinstance(r, dict):
                    html_parts.append(f"<li><strong>{r.get('유형','')}</strong><br>{r.get('내용','')}</li>")
            html_parts.append("</ul>")

    # 5. 개선 권고 (LLM 검토 안내 + 상세는 JSON 수동 반영)
    html_parts.append("<h2>5. 개선 권고 (RAG·프롬프트·피드백 루프)</h2>")
    if rec.get("개선_권고_LLM_검토_안내"):
        html_parts.append(f'<div class="note-box"><p>{rec.get("개선_권고_LLM_검토_안내", "")}</p></div>')
    if rec.get("개선_권고_상세"):
        html_parts.append("<h3>개선 권고 상세 (LLM·담당자 검토 반영)</h3>")
        detail = rec.get("개선_권고_상세")
        if isinstance(detail, dict):
            # RAG 강화 상세: 대상, 우선순위, 구체_내용
            rag_detail = detail.get("rag_강화_상세") or []
            if rag_detail:
                html_parts.append("<h4>RAG 강화 상세</h4><ul class=\"recommend\">")
                for item in rag_detail:
                    if isinstance(item, dict):
                        target = item.get("대상", "")
                        prio = item.get("우선순위", "")
                        body = item.get("구체_내용", item.get("권고", ""))
                        head = f"{target}"
                        if prio != "" and prio is not None:
                            head += f" (우선순위 {prio})"
                        html_parts.append(f"<li><strong>{head}</strong><br>{body}</li>")
                    else:
                        html_parts.append(f"<li>{item}</li>")
                html_parts.append("</ul>")
            # 프롬프트 튜닝 상세: 항목, 구체_문구_예시, 설명
            prompt_detail = detail.get("프롬프트_튜닝_상세") or []
            if prompt_detail:
                html_parts.append("<h4>프롬프트 튜닝 상세</h4><ul class=\"recommend\">")
                for item in prompt_detail:
                    if isinstance(item, dict):
                        title = item.get("항목", "")
                        example = item.get("구체_문구_예시", "")
                        desc = item.get("설명", "")
                        block = desc
                        if example:
                            block = f"<span class=\"sample-box\" style=\"display:block;margin:6px 0;\">{example}</span>{desc}"
                        html_parts.append(f"<li><strong>{title}</strong><br>{block}</li>")
                    else:
                        html_parts.append(f"<li>{item}</li>")
                html_parts.append("</ul>")
            # 피드백 루프 상세: 항목, 설명
            feedback_detail = detail.get("피드백_루프_상세") or []
            if feedback_detail:
                html_parts.append("<h4>피드백 루프 상세</h4><ul class=\"recommend\">")
                for item in feedback_detail:
                    if isinstance(item, dict):
                        title = item.get("항목", "")
                        desc = item.get("설명", "")
                        html_parts.append(f"<li><strong>{title}</strong><br>{desc}</li>")
                    else:
                        html_parts.append(f"<li>{item}</li>")
                html_parts.append("</ul>")
            # 그 외 키가 있으면 기존 방식으로 표시
            for k, v in detail.items():
                if k in ("rag_강화_상세", "프롬프트_튜닝_상세", "피드백_루프_상세"):
                    continue
                if isinstance(v, list):
                    html_parts.append(f"<h4>{k}</h4><ul class=\"recommend\">")
                    for item in v:
                        if isinstance(item, dict):
                            html_parts.append(f"<li><strong>{item.get('항목', item.get('대상', ''))}</strong><br>{item.get('설명', item.get('권고', item.get('구체_내용', '')))}</li>")
                        else:
                            html_parts.append(f"<li>{item}</li>")
                    html_parts.append("</ul>")
                elif isinstance(v, str):
                    html_parts.append(f"<h4>{k}</h4><p>{v}</p>")
        else:
            html_parts.append(f"<p>{detail}</p>")
    priority = rec.get("우선순위_요약", [])
    if priority:
        html_parts.append("<h3>우선순위 요약</h3><ul class=\"recommend\">")
        for s in priority:
            html_parts.append(f"<li>{s}</li>")
        html_parts.append("</ul>")

    rag = rec.get("rag_강화", [])
    if rag:
        html_parts.append("<h3>RAG 강화</h3><ul class=\"recommend\">")
        for r in rag:
            if isinstance(r, dict):
                target = r.get("대상", r.get("키워드_예시", ""))
                if isinstance(target, list):
                    target = "고빈도 키워드: " + ", ".join(str(x) for x in target[:10])
                html_parts.append(f"<li><strong>{target}</strong><br>{r.get('권고','')}</li>")
            else:
                html_parts.append(f"<li>{r}</li>")
        html_parts.append("</ul>")

    prompt = rec.get("프롬프트_튜닝", [])
    if prompt:
        html_parts.append("<h3>프롬프트 튜닝</h3><ul class=\"recommend\">")
        for r in prompt:
            if isinstance(r, dict):
                html_parts.append(f"<li><strong>{r.get('항목','')}</strong><br>{r.get('설명','')}</li>")
            else:
                html_parts.append(f"<li>{r}</li>")
        html_parts.append("</ul>")

    feedback = rec.get("피드백_루프", [])
    if feedback:
        html_parts.append("<h3>피드백 루프</h3><ul class=\"recommend\">")
        for r in feedback:
            if isinstance(r, dict):
                html_parts.append(f"<li><strong>{r.get('항목','')}</strong><br>{r.get('설명','')}</li>")
            else:
                html_parts.append(f"<li>{r}</li>")
        html_parts.append("</ul>")

    html_parts.append('<div class="footer">본 보고서는 분석 스크립트에서 자동 생성되었습니다. 상세 수치는 analysis_report.json에서 확인할 수 있습니다.</div>')
    html_parts.append("</div></body></html>")
    return "\n".join(html_parts)


def report_from_json(json_path: str | Path) -> str:
    """JSON 파일 경로를 받아 HTML 보고서 문자열을 반환한다."""
    path = Path(json_path)
    with open(path, "r", encoding="utf-8") as f:
        report = json.load(f)
    return build_html(report)


def save_html_report(report: dict[str, Any], output_path: str | Path) -> Path:
    """리포트 dict를 HTML 파일로 저장한다."""
    path = Path(output_path)
    html = build_html(report)
    path.write_text(html, encoding="utf-8")
    return path


if __name__ == "__main__":
    import sys
    json_file = sys.argv[1] if len(sys.argv) > 1 else "analysis_report.json"
    out_file = sys.argv[2] if len(sys.argv) > 2 else Path(json_file).with_suffix(".html")
    html = report_from_json(json_file)
    Path(out_file).write_text(html, encoding="utf-8")
    print(f"생성됨: {out_file}")
