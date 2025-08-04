#!/usr/bin/env python3
"""
ie_aided_slr.py – Information-Extraction Analytics 2.0
────────────────────────────────────────────────────────
• Liest JSON-Lines mit IE-Spans  (-i / --input)
• Schreibt:
    bias_freq.csv, mitigation_freq.csv,
    bias_mitigation_matrix.csv, bias_mitigation_edges.csv
• Liefert ausführliches Logging über:
    – Dokument- und Span-Zahlen
    – Anteil unvollständiger char_interval-Daten
    – Normalisierte Stichwort-Statistiken
"""

from __future__ import annotations
import argparse, json, logging, sys
from pathlib import Path
from typing import Any

import pandas as pd

# ──────────────── Logging ────────────────
def configure_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level.upper(),
        format="%(levelname)-8s %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

log = logging.getLogger(__name__)

# ──────────────── I/O ────────────────
def read_jsonl(path: Path) -> list[dict[str, Any]]:
    """Return list of json objects (one per line)."""
    with path.open("r", encoding="utf-8", errors="replace") as fh:
        data = [json.loads(line) for line in fh if line.strip()]
    log.info("Loaded %d JSON object(s) from %s", len(data), path.resolve())
    return data

# ──────────────── Flatten & Clean ────────────────
def normalise(text: str | None) -> str:
    return (text or "").strip().lower()

def make_span_df(docs: list[dict[str, Any]]) -> pd.DataFrame:
    """Explode 'extractions' and normalise columns."""
    rows = []
    for doc in docs:
        doc_id  = doc.get("document_id", "<unknown>")
        for span in doc.get("extractions", []):
            ci = span.get("char_interval") or {}
            rows.append(
                {
                    "document_id":   doc_id,
                    "extraction_class": span.get("extraction_class"),
                    "raw_text":      span.get("extraction_text"),
                    "norm_text":     normalise(span.get("extraction_text")),
                    "start_pos":     ci.get("start_pos"),
                    "end_pos":       ci.get("end_pos"),
                    "group_index":   span.get("group_index"),
                }
            )
    df = pd.DataFrame(rows)

    # Logging zur Datenqualität
    n_total = len(df)
    n_no_ci = df["start_pos"].isna() | df["end_pos"].isna()
    log.info(
        "Spans insgesamt: %d  |  ohne/teilweise char_interval: %d (%.1f %%)",
        n_total, n_no_ci.sum(), 100 * n_no_ci.mean() if n_total else 0,
    )
    for cls in ["bias_type", "mitigation_strategy"]:
        log.info(
            "→ %s: %d einzigartige Einträge",
            cls,
            df[df["extraction_class"] == cls]["norm_text"].nunique(),
        )
    return df

# ──────────────── Statistik ────────────────
def save_counts(df: pd.DataFrame, cls: str, out: Path) -> None:
    counts = (
        df[df["extraction_class"] == cls]["norm_text"]
        .value_counts()
        .rename("count")
    )
    counts.to_csv(out, header=True)
    log.info("✓ %s (%d Zeilen)", out, len(counts))

def build_matrix(df: pd.DataFrame, out_matrix: Path, out_edges: Path) -> None:
    """Kovarianz Bias×Mitigation – Absätze via Heuristik (500 Zeichen / group_index)."""
    if df.empty:
        log.warning("Keine Spans vorhanden – Matrix übersprungen.")
        return

    df["para_id"] = (
        df.apply(
            lambda r: (r["start_pos"] or 0) // 500
            if pd.notna(r["start_pos"])
            else r["group_index"],  # Fallback
            axis=1,
        )
    )

    pivot = (
        df.pivot_table(
            index=["document_id", "para_id"],
            columns="extraction_class",
            values="norm_text",
            aggfunc=lambda x: list(x),
        )
        .dropna(subset=["bias_type", "mitigation_strategy"], how="any")
    )

    # Edge-Liste
    edges = [
        (bias, mit)
        for (_, _), row in pivot.iterrows()
        for bias in row["bias_type"]
        for mit in row["mitigation_strategy"]
    ]
    edge_df = pd.DataFrame(edges, columns=["bias_type", "mitigation_strategy"])

    if edge_df.empty:
        log.warning("Keine Bias-Mitigation-Paare gefunden – Matrix leer.")
        return

    matrix = (
        edge_df.value_counts().unstack(fill_value=0).sort_index(axis=0).sort_index(axis=1)
    )

    matrix.to_csv(out_matrix)
    edge_df.to_csv(out_edges, index=False)
    log.info("✓ %s  (shape %s)", out_matrix, matrix.shape)
    log.info("✓ %s  (%d Kanten)", out_edges, len(edge_df))

# ──────────────── CLI ────────────────
def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Analyse von Bias- und Mitigation-Spans aus data.jsonl"
    )
    p.add_argument(
        "-i", "--input", type=Path, required=True, help="Pfad zur data.jsonl"
    )
    p.add_argument(
        "-o", "--outdir", type=Path, default=Path("."), help="Zielordner für CSVs"
    )
    p.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Log-Detailgrad",
    )
    return p.parse_args()

# ──────────────── Main ────────────────
def main() -> None:
    args = parse_args()
    configure_logging(args.log_level)

    out = args.outdir
    out.mkdir(parents=True, exist_ok=True)

    spans = make_span_df(read_jsonl(args.input))

    save_counts(spans, "bias_type",        out / "bias_freq.csv")
    save_counts(spans, "mitigation_strategy", out / "mitigation_freq.csv")

    build_matrix(
        spans,
        out / "bias_mitigation_matrix.csv",
        out / "bias_mitigation_edges.csv",
    )
    log.info("✅ Fertig.")

if __name__ == "__main__":
    main()
