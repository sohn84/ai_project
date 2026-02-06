#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
엑셀/CSV 업로드 → 분석 순차 실행 → HTML 레포트 표시 (간단 웹 UI)
"""
import sys
import tempfile
from pathlib import Path

# 프로젝트 루트
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from flask import Flask, request, render_template_string, redirect, url_for

from src.load_data import load_chat_log_any
from run_analysis import run_from_df
from src.report_html import build_html

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024  # 200MB

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls"}


def allowed_file(filename: str) -> bool:
    return Path(filename).suffix.lower().lstrip(".") in ALLOWED_EXTENSIONS


INDEX_HTML = """<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>대화 로그 분석</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; margin: 0; padding: 20px; background: #1a1a2e; color: #eee; min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.5rem; color: #4361ee; margin-bottom: 8px; }
    .sub { color: #94a3b8; font-size: 0.9rem; margin-bottom: 24px; }
    .card { background: #16213e; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px solid #2d3748; }
    .card h2 { font-size: 1.1rem; margin: 0 0 16px 0; color: #a5b4fc; }
    input[type="file"] { display: block; margin: 12px 0; color: #94a3b8; }
    button { background: #4361ee; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    button:hover { background: #3a56d4; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .progress { margin: 16px 0; color: #94a3b8; font-size: 0.95rem; }
    .error { background: #7f1d1d; color: #fecaca; padding: 12px; border-radius: 8px; margin: 12px 0; }
    .report-wrap { margin-top: 24px; border-radius: 12px; overflow: hidden; border: 1px solid #2d3748; background: #0f172a; }
    .report-wrap iframe { display: block; width: 100%; height: 85vh; min-height: 600px; border: none; background: #fff; }
    .back { margin-top: 16px; }
    .back a { color: #60a5fa; text-decoration: none; }
    .back a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>여행사 AI 챗봇 대화 로그 분석</h1>
    <p class="sub">CSV 또는 Excel(.xlsx, .xls) 파일을 업로드하면 분석을 순차 실행하고 레포트를 생성합니다.</p>

    <div class="card">
      <h2>파일 업로드</h2>
      <form id="uploadForm" action="{{ url_for('analyze') }}" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept=".csv,.xlsx,.xls" required />
        <button type="submit" id="btnSubmit">분석 실행</button>
      </form>
      <p class="progress" id="progress" style="display:none;">파일 처리 및 분석 중… (데이터 양에 따라 1~2분 소요될 수 있습니다)</p>
    </div>

    {% if error %}
    <div class="error">{{ error }}</div>
    {% endif %}

    {% if report_html %}
    <div class="card">
      <h2>분석 레포트</h2>
      <div class="back"><a href="{{ url_for('index') }}">← 다시 업로드</a></div>
      <div class="report-wrap">
        <iframe id="reportFrame" title="분석 레포트" srcdoc="{{ report_html | safe }}"></iframe>
      </div>
    </div>
    {% endif %}
  </div>
  <script>
    document.getElementById('uploadForm')?.addEventListener('submit', function() {
      var btn = document.getElementById('btnSubmit');
      var progress = document.getElementById('progress');
      if (btn && progress) { btn.disabled = true; progress.style.display = 'block'; }
    });
  </script>
</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(INDEX_HTML, error=None, report_html=None)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return render_template_string(INDEX_HTML, error="파일이 없습니다.", report_html=None)
    f = request.files["file"]
    if not f or f.filename == "":
        return render_template_string(INDEX_HTML, error="파일을 선택해 주세요.", report_html=None)
    if not allowed_file(f.filename):
        return render_template_string(
            INDEX_HTML,
            error="허용 확장자: .csv, .xlsx, .xls",
            report_html=None,
        )
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(f.filename).suffix) as tmp:
            f.save(tmp.name)
            path = tmp.name
        try:
            df = load_chat_log_any(path)
        finally:
            Path(path).unlink(missing_ok=True)
        if df is None or len(df) == 0:
            return render_template_string(INDEX_HTML, error="데이터가 비어 있거나 로드에 실패했습니다.", report_html=None)
        report = run_from_df(df)
        report_html = build_html(report)
        # iframe srcdoc 속성용 이스케이프: & " 만 (작은따옴표로 속성 감쌈)
        report_html_escaped = report_html.replace("&", "&amp;").replace('"', "&quot;")
        return render_template_string(INDEX_HTML, error=None, report_html=report_html_escaped)
    except Exception as e:
        return render_template_string(
            INDEX_HTML,
            error=f"분석 중 오류: {str(e)}",
            report_html=None,
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000, debug=True)
