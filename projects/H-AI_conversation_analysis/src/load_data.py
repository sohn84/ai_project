# -*- coding: utf-8 -*-
"""
AI 챗봇 대화 로그 CSV/Excel 로더.
멀티라인 답변 필드를 안전하게 처리한다.
"""
import csv
from pathlib import Path

import pandas as pd


def _normalize_df(df: pd.DataFrame) -> pd.DataFrame:
    """공통 컬럼 정규화 (날짜, 답변순서, 문자열 컬럼)."""
    df = df.copy()
    if "날짜" in df.columns:
        df["날짜"] = pd.to_datetime(df["날짜"], errors="coerce")
    if "답변순서" in df.columns:
        df["답변순서"] = pd.to_numeric(df["답변순서"], errors="coerce").fillna(0).astype(int)
    for col in ["질문", "답변", "분류", "카테고리", "평가결과", "오답사유"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
    return df


def load_chat_log(csv_path: str) -> pd.DataFrame:
    """
    여행사 AI 챗봇 대화 로그 CSV를 로드한다.
    질문/답변 필드에 줄바꿈·쉼표가 포함되어 있어 표준 CSV 규칙(큰따옴표 이스케이프)으로 파싱한다.
    """
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"파일 없음: {csv_path}")

    with open(path, "r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        header = [c.strip() for c in next(reader)]
        rows = list(reader)

    n_cols = len(header)
    # 열 수가 다른 행만 정규화 (대부분 12열로 정상 파싱됨)
    normalized = []
    for row in rows:
        if len(row) == n_cols:
            normalized.append(row)
        elif len(row) > n_cols:
            normalized.append(row[:n_cols])
        else:
            normalized.append(row + [""] * (n_cols - len(row)))

    df = pd.DataFrame(normalized, columns=header)
    return _normalize_df(df)


def load_chat_log_excel(excel_path: str) -> pd.DataFrame:
    """엑셀(.xlsx, .xls) 대화 로그를 로드한다. 컬럼명은 첫 행 사용."""
    path = Path(excel_path)
    if not path.exists():
        raise FileNotFoundError(f"파일 없음: {excel_path}")
    suffix = path.suffix.lower()
    if suffix == ".xlsx" or suffix == ".xls":
        df = pd.read_excel(path, engine="openpyxl" if suffix == ".xlsx" else None)
    else:
        raise ValueError(f"지원하지 않는 엑셀 확장자: {suffix}")
    df.columns = [str(c).strip() for c in df.columns]
    return _normalize_df(df)


def load_chat_log_any(file_path: str) -> pd.DataFrame:
    """파일 확장자에 따라 CSV 또는 Excel을 로드한다."""
    path = Path(file_path)
    suffix = path.suffix.lower()
    if suffix in (".xlsx", ".xls"):
        return load_chat_log_excel(file_path)
    return load_chat_log(file_path)
