#!/usr/bin/env python3
"""Independent self-test for the R4 replay.

Re-derives the decision confusion matrix and Cohen's kappa from the same raw
CSVs by its own arithmetic, then compares against the canonical benchmark
generated/benchmark-results/agreement_metrics.json. Reports red or green.

Verification principle (journal Session 17): the self-test must not import the
logic it checks. This file therefore shares NO code with replay_flow.py; the
normalisation and kappa are re-stated here on purpose. Two independent
implementations that agree are the stronger claim.

Exit code 0 on full agreement (green), non-zero on any mismatch (red).

Usage:
    python src/assess/replay_selftest.py
"""

import csv
import json
import sys
from pathlib import Path


TOL = 1e-3  # canonical figures are rounded to 4 decimals; this tolerance is safe.


def _decision(raw):
    v = (raw or "").strip().lower()
    if v in ("include", "included", "yes", "1"):
        return "Include"
    if v in ("exclude", "excluded", "no", "0"):
        return "Exclude"
    if v in ("unclear", "maybe", "?"):
        return "Unclear"
    return v.capitalize() if v else ""


def _read_decisions(path):
    """Zotero_Key -> normalised Decision, from a raw assessment CSV."""
    out = {}
    with open(path, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = (row.get("Zotero_Key") or "").strip()
            if key:
                out[key] = _decision(row.get("Decision", ""))
    return out


def _kappa(pairs):
    """Cohen's kappa computed independently from replay_flow's implementation."""
    n = len(pairs)
    if n == 0:
        return 0.0
    observed = sum(1 for h, a in pairs if h == a) / n
    labels = {h for h, _ in pairs} | {a for _, a in pairs}
    expected = 0.0
    for lab in labels:
        ph = sum(1 for h, _ in pairs if h == lab) / n
        pa = sum(1 for _, a in pairs if a == lab) / n
        expected += ph * pa
    if expected >= 1.0:
        return 1.0 if observed >= 1.0 else 0.0
    return (observed - expected) / (1 - expected)


def main():
    root = Path(__file__).resolve().parent.parent.parent
    human_path = root / "assessment" / "human_assessment.csv"
    llm_path = root / "assessment" / "llm_assessment_10k.csv"
    canonical_path = root / "generated" / "benchmark-results" / "agreement_metrics.json"

    human = _read_decisions(human_path)
    llm = _read_decisions(llm_path)
    with open(canonical_path, "r", encoding="utf-8") as f:
        canonical = json.load(f)

    paired = sorted(set(human) & set(llm))
    pairs = [(human[k], llm[k]) for k in paired]

    # Independent confusion tally: count each (human, agent) cell directly.
    cells = {}
    for h, a in pairs:
        cells[f"{h}_{a}"] = cells.get(f"{h}_{a}", 0) + 1

    n = len(pairs)
    observed_agreement = sum(1 for h, a in pairs if h == a) / n if n else 0.0
    computed_kappa = _kappa(pairs)

    ref_dec = canonical["decision"]
    ref_cm = ref_dec["confusion_matrix"]

    checks = []

    def record(name, expected, actual, ok):
        checks.append((name, expected, actual, ok))

    record("paired n", ref_dec["n"], n, ref_dec["n"] == n)
    record("overall_agreement", ref_dec["overall_agreement"], round(observed_agreement, 4),
           abs(ref_dec["overall_agreement"] - observed_agreement) < TOL)
    record("cohens_kappa", ref_dec["cohens_kappa"], round(computed_kappa, 4),
           abs(ref_dec["cohens_kappa"] - computed_kappa) < TOL)

    for cell in ["Include_Include", "Include_Exclude", "Exclude_Include", "Exclude_Exclude"]:
        exp = ref_cm.get(cell, 0)
        act = cells.get(cell, 0)
        record(f"cm {cell}", exp, act, exp == act)

    # Independent per-category kappa cross-check against the canonical figures.
    for cat, ref in canonical["categories"].items():
        if ref.get("kappa") is None:
            continue
        pairs_cat = _read_category_pairs(human_path, llm_path, cat, set(paired))
        k_cat = _kappa(pairs_cat)
        record(f"cat kappa {cat}", ref["kappa"], round(k_cat, 4),
               abs(ref["kappa"] - k_cat) < TOL)

    all_ok = all(ok for _, _, _, ok in checks)

    print("=" * 64)
    print("R4 REPLAY SELF-TEST (independent re-derivation vs canonical)")
    print("=" * 64)
    print(f"{'check':<28}{'expected':>14}{'actual':>14}   verdict")
    print("-" * 70)
    for name, expected, actual, ok in checks:
        print(f"{name:<28}{str(expected):>14}{str(actual):>14}   {'GREEN' if ok else 'RED'}")
    print("-" * 70)
    print("VERDICT:", "GREEN (reproduction matches canonical benchmark)" if all_ok
          else "RED (reproduction diverged from canonical benchmark)")

    sys.exit(0 if all_ok else 1)


def _norm_cat(v):
    # Empty stays empty so blank human cells drop from category pairs; the
    # per-category n then matches the canonical merge, which counts only rows
    # a human actually filled.
    v = (v or "").strip().lower()
    if not v:
        return ""
    if v in ("ja", "yes", "1", "true", "x"):
        return "Ja"
    if v in ("nein", "no", "0", "false"):
        return "Nein"
    return v


def _read_category_pairs(human_path, llm_path, cat, paired_keys):
    """(human, agent) category-value pairs for a category, over the paired keys.
    Resolves the human-CSV Diversitaet header variant independently."""
    def read(path):
        vals = {}
        with open(path, "r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                key = (row.get("Zotero_Key") or "").strip()
                if not key:
                    continue
                raw = row.get(cat, "")
                if not raw and cat == "Diversitaet":
                    raw = row.get("Diversitaet / Intersektionalität", "")
                vals[key] = _norm_cat(raw)
        return vals

    h = read(human_path)
    a = read(llm_path)
    pairs = []
    for k in paired_keys:
        hv, av = h.get(k, ""), a.get(k, "")
        if hv and av:
            pairs.append((hv, av))
    return pairs


if __name__ == "__main__":
    main()
