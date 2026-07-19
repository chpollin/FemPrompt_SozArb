#!/usr/bin/env python3
"""R4 replay: retrospective PRISMA FlowModel plus decomposed benchmark.

Rebuilds the retrospective flow from the raw assessment CSVs, pairs the human
and LLM screening tracks on Zotero_Key, and computes the decomposed agreement
metrics (full decision matrix, content-only subset, per-category). Emits a
machine-readable JSON report and a human-readable summary.

Method and schema: knowledge/methods.md (Replay verification).
Run instructions and human verification checklist: src/assess/README_replay.md.

This is the CORE path. The self-test path (src/assess/replay_selftest.py) must
NOT import from here; the two paths verify each other by staying independent.

Usage:
    python src/assess/replay_flow.py
    python src/assess/replay_flow.py --out generated/benchmark-results/replay_flow.json
"""

import argparse
import csv
import json
from collections import Counter
from pathlib import Path


CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet",
    "Feministisch", "Fairness",
]

# Human exclusion reasons a one-paper-at-a-time LLM cannot see; used to carve
# the content-only subset. Spelled as they appear in human_assessment.csv, not
# as the underscore codes in categories.yaml.
WORKFLOW_EXCLUSIONS = {"Duplicate", "No full text", "Wrong publication type"}

DECISION_LABELS = ["Include", "Exclude", "Unclear"]

# The key whose stray Has_HA flag in papers_full.csv is not a missing human
# decision (Session 17 resolution). The replay reproduces this, never reopens it.
STRAY_HA_KEY = "2YS85B49"


def normalize_category(value):
    # An empty cell stays empty and is dropped from category pairs; only an
    # explicit negative maps to Nein. This matches merge_assessments.normalize_value,
    # where the empty-input guard returns "" before the Nein mapping, so the
    # per-category n excludes rows a human left blank (excluded papers).
    if not value:
        return ""
    v = str(value).strip().lower()
    if v in ("ja", "yes", "1", "true", "x"):
        return "Ja"
    if v in ("nein", "no", "0", "false"):
        return "Nein"
    return value


def normalize_decision(value):
    if not value:
        return ""
    v = str(value).strip().lower()
    if v in ("include", "included", "yes", "1"):
        return "Include"
    if v in ("exclude", "excluded", "no", "0"):
        return "Exclude"
    if v in ("unclear", "maybe", "?"):
        return "Unclear"
    return value


def category_value(row, cat):
    """Read a category cell, resolving the human-CSV Diversitaet header variant."""
    val = row.get(cat, "")
    if not val and cat == "Diversitaet":
        val = row.get("Diversitaet / Intersektionalität", "") or row.get(
            "Diversitaet / Intersektionalitaet", ""
        )
    return normalize_category(val)


def load_by_key(path):
    """Load a CSV keyed by Zotero_Key. Later duplicate keys overwrite; the loader
    reports the raw row count so a caller can detect key collisions."""
    with open(path, "r", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    by_key = {}
    for row in rows:
        key = (row.get("Zotero_Key") or row.get("zotero_key") or "").strip()
        if key:
            by_key[key] = row
    return by_key, len(rows)


def kappa(labels_a, labels_b):
    """Cohen's kappa over two aligned label lists."""
    n = len(labels_a)
    if n == 0:
        return 0.0
    po = sum(1 for a, b in zip(labels_a, labels_b) if a == b) / n
    labels = set(labels_a) | set(labels_b)
    pe = sum((labels_a.count(l) / n) * (labels_b.count(l) / n) for l in labels)
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0
    return (po - pe) / (1 - pe)


def decision_metrics(pairs):
    """Full decomposed decision metrics for a list of (human, agent) pairs."""
    n = len(pairs)
    human = [p[0] for p in pairs]
    agent = [p[1] for p in pairs]

    matrix = {}
    for h in DECISION_LABELS:
        for a in DECISION_LABELS:
            matrix[f"{h}_{a}"] = sum(1 for x, y in pairs if x == h and y == a)

    po = sum(1 for x, y in pairs if x == y) / n if n else 0.0
    k = kappa(human, agent)

    # Two-label auxiliary indices are defined for the Include/Exclude case; the
    # decision set here carries no Unclear, so the 2x2 view is exact.
    present = [lab for lab in DECISION_LABELS
               if any(x == lab for x in human) or any(y == lab for y in agent)]
    two_label = len(present) <= 2
    pabak = 2 * po - 1 if two_label else None

    kmax = None
    bias_index = None
    if two_label and n:
        # kappa max under fixed marginals for a 2x2 table.
        p1 = human.count(present[0]) / n if present else 0.0
        q1 = agent.count(present[0]) / n if present else 0.0
        po_max = min(p1, q1) + min(1 - p1, 1 - q1)
        pe = p1 * q1 + (1 - p1) * (1 - q1)
        kmax = (po_max - pe) / (1 - pe) if pe != 1.0 else None
        # bias index: |b - c| / n over the off-diagonal cells.
        b_cell = matrix.get(f"{present[0]}_{present[1]}", 0) if len(present) > 1 else 0
        c_cell = matrix.get(f"{present[1]}_{present[0]}", 0) if len(present) > 1 else 0
        bias_index = abs(b_cell - c_cell) / n

    return {
        "n": n,
        "overall_agreement": round(po, 4),
        "cohens_kappa": round(k, 4),
        "pabak": round(pabak, 4) if pabak is not None else None,
        "kappa_max": round(kmax, 4) if kmax is not None else None,
        "kappa_over_kappa_max": round(k / kmax, 4) if kmax not in (None, 0) else None,
        "bias_index": round(bias_index, 4) if bias_index is not None else None,
        "confusion_matrix": matrix,
    }


def build_flow(human, llm, papers):
    """The retrospective FlowModel counts (PRISMA phases, trAIce AI/human split)."""
    human_keys = set(human)
    llm_keys = set(llm)
    corpus_keys = set(papers)

    paired = human_keys & llm_keys
    human_only = human_keys - llm_keys
    llm_only = llm_keys - human_keys

    dup_corpus = [k for k in papers if papers[k].get("Is_Duplicate", "").strip() == "Yes"]
    dup_human = [k for k in human
                 if human[k].get("Exclusion_Reason", "").strip() == "Duplicate"]

    human_exclusion_reasons = Counter(
        human[k].get("Exclusion_Reason", "").strip() or "(none)"
        for k in human if normalize_decision(human[k].get("Decision", "")) == "Exclude"
    )

    return {
        "identification": {
            "corpus_records": len(corpus_keys),
            "by_item_type": dict(Counter(
                papers[k].get("Item_Type", "").strip() or "(unknown)" for k in papers
            )),
        },
        "duplicates": {
            "flagged_in_corpus": len(dup_corpus),
            "human_marked_duplicate": len(dup_human),
        },
        "screening": {
            "human_track": len(human_keys),
            "llm_track": len(llm_keys),
            "paired": len(paired),
            "human_only": len(human_only),
            "llm_only_no_human_decision": len(llm_only),
        },
        "excluded_human_with_reasons": dict(human_exclusion_reasons),
        "included": {
            "human_binding": sum(
                1 for k in human
                if normalize_decision(human[k].get("Decision", "")) == "Include"
            ),
            "llm_advisory": sum(
                1 for k in llm
                if normalize_decision(llm[k].get("Decision", "")) == "Include"
            ),
        },
    }


def check_stray_ha(human, llm, papers):
    """Reproduce the 2YS85B49 resolution as a guard, not a reopened discrepancy."""
    row = papers.get(STRAY_HA_KEY, {})
    return {
        "key": STRAY_HA_KEY,
        "in_corpus": STRAY_HA_KEY in papers,
        "in_llm_track": STRAY_HA_KEY in llm,
        "in_human_track": STRAY_HA_KEY in human,
        "papers_full_has_ha": row.get("Has_HA", "").strip(),
        "resolved_as_stray_flag": (
            STRAY_HA_KEY in papers
            and STRAY_HA_KEY in llm
            and STRAY_HA_KEY not in human
            and row.get("Has_HA", "").strip() == "Yes"
        ),
    }


def category_metrics(human, llm, paired_keys):
    out = {}
    for cat in CATEGORIES:
        pairs = []
        for k in paired_keys:
            hv = category_value(human[k], cat)
            av = category_value(llm[k], cat)
            if hv and av:
                pairs.append((hv, av))
        if not pairs:
            out[cat] = {"n": 0, "agreement": None, "kappa": None}
            continue
        n = len(pairs)
        agree = sum(1 for a, b in pairs if a == b) / n
        out[cat] = {
            "n": n,
            "agreement": round(agree, 4),
            "kappa": round(kappa([p[0] for p in pairs], [p[1] for p in pairs]), 4),
            "human_yes_rate": round(sum(1 for p in pairs if p[0] == "Ja") / n, 4),
            "agent_yes_rate": round(sum(1 for p in pairs if p[1] == "Ja") / n, 4),
        }
    return out


def main():
    project_root = Path(__file__).resolve().parent.parent.parent
    ap = argparse.ArgumentParser(description="R4 replay: FlowModel plus benchmark")
    ap.add_argument("--human", default=str(project_root / "assessment" / "human_assessment.csv"))
    ap.add_argument("--llm", default=str(project_root / "assessment" / "llm_assessment_10k.csv"))
    ap.add_argument("--papers", default=str(project_root / "assessment" / "papers_full.csv"))
    ap.add_argument("--out", default=str(project_root / "generated" / "benchmark-results" / "replay_flow.json"))
    args = ap.parse_args()

    human, human_rows = load_by_key(args.human)
    llm, llm_rows = load_by_key(args.llm)
    papers, papers_rows = load_by_key(args.papers)

    paired_keys = sorted(set(human) & set(llm))

    # Decision pairs on the paired set.
    full_pairs = [
        (normalize_decision(human[k].get("Decision", "")),
         normalize_decision(llm[k].get("Decision", "")))
        for k in paired_keys
    ]

    content_keys = [
        k for k in paired_keys
        if human[k].get("Exclusion_Reason", "").strip() not in WORKFLOW_EXCLUSIONS
    ]
    content_pairs = [
        (normalize_decision(human[k].get("Decision", "")),
         normalize_decision(llm[k].get("Decision", "")))
        for k in content_keys
    ]

    # Data-hygiene surface: exclusion values outside the controlled vocabulary.
    known_reasons = WORKFLOW_EXCLUSIONS | {"Not relevant topic", "Language", "(none)", ""}
    oov = sorted({
        human[k].get("Exclusion_Reason", "").strip()
        for k in human
        if human[k].get("Exclusion_Reason", "").strip()
        and human[k].get("Exclusion_Reason", "").strip() not in known_reasons
    })

    report = {
        "inputs": {
            "human_assessment": str(Path(args.human).name),
            "llm_assessment": str(Path(args.llm).name),
            "papers_full": str(Path(args.papers).name),
            "raw_row_counts": {
                "human": human_rows, "llm": llm_rows, "papers_full": papers_rows,
            },
        },
        "flow": build_flow(human, llm, papers),
        "stray_ha_resolution": check_stray_ha(human, llm, papers),
        "decision_full": decision_metrics(full_pairs),
        "decision_content_only": {
            "workflow_exclusions_removed": sorted(WORKFLOW_EXCLUSIONS),
            **decision_metrics(content_pairs),
        },
        "categories": category_metrics(human, llm, paired_keys),
        "data_hygiene": {"out_of_vocabulary_exclusion_reasons": oov},
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    _print_summary(report, out_path)


def _print_summary(report, out_path):
    flow = report["flow"]
    full = report["decision_full"]
    content = report["decision_content_only"]
    stray = report["stray_ha_resolution"]

    print("=" * 64)
    print("R4 REPLAY: retrospective FlowModel + decomposed benchmark")
    print("=" * 64)
    print("\nIdentification")
    print(f"  corpus records:            {flow['identification']['corpus_records']}")
    print(f"  duplicates flagged:        {flow['duplicates']['flagged_in_corpus']}")
    print(f"  human-marked duplicates:   {flow['duplicates']['human_marked_duplicate']}")
    print("\nScreening (AI / human split)")
    s = flow["screening"]
    print(f"  human track:               {s['human_track']}")
    print(f"  llm track:                 {s['llm_track']}")
    print(f"  paired (benchmark set):    {s['paired']}")
    print(f"  human-only:                {s['human_only']}")
    print(f"  llm-only (no human dec.):  {s['llm_only_no_human_decision']}")
    print("\nIncluded")
    print(f"  human binding:             {flow['included']['human_binding']}")
    print(f"  llm advisory:              {flow['included']['llm_advisory']}")

    print("\nDecision agreement (full paired set)")
    print(f"  n={full['n']}  po={full['overall_agreement']}  kappa={full['cohens_kappa']}"
          f"  PABAK={full['pabak']}  kappa_max={full['kappa_max']}  bias={full['bias_index']}")
    cm = full["confusion_matrix"]
    print("  confusion (human\\agent):   "
          f"II={cm['Include_Include']} IE={cm['Include_Exclude']} "
          f"EI={cm['Exclude_Include']} EE={cm['Exclude_Exclude']}")

    print("\nDecision agreement (content-only subset)")
    print(f"  workflow exclusions removed: {content['workflow_exclusions_removed']}")
    print(f"  n={content['n']}  po={content['overall_agreement']}  kappa={content['cohens_kappa']}")

    print("\n2YS85B49 resolution")
    print(f"  in corpus={stray['in_corpus']}  in_llm={stray['in_llm_track']}"
          f"  in_human={stray['in_human_track']}  papers_full Has_HA={stray['papers_full_has_ha']!r}")
    print(f"  resolved as stray flag (no missing human decision): {stray['resolved_as_stray_flag']}")

    oov = report["data_hygiene"]["out_of_vocabulary_exclusion_reasons"]
    if oov:
        print(f"\nData hygiene: out-of-vocabulary exclusion reasons: {oov}")

    print(f"\nReport written: {out_path}")


if __name__ == "__main__":
    main()
