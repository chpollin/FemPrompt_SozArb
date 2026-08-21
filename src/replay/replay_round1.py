#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Retrospective round-1 replay (R2 / TP3).

Re-pairs the raw assessment CSVs by Zotero_Key (never by sequential ID; the
2026-03-27 merge bug that paired on sequential ID made every pre-fix figure
wrong), rebuilds the retrospective PRISMA FlowModel from the actual files, and
recomputes the human-vs-LLM agreement (full matrix plus the content-only
subset). A self-test asserts the decision matrix, decision kappa, and the ten
per-category kappas reproduce the canonical generated/benchmark-results/
agreement_metrics.json exactly; on mismatch it prints deltas and exits non-zero.

Normalization mirrors src/assess/merge_assessments.py and the kappa mirrors
src/assess/calculate_agreement.py (round-4), so the replay reproduces the
canonical numbers by a human-checked path instead of trusting the merged CSV.

Run from the repo root:
    python src/replay/replay_round1.py
"""

import csv
import io
import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

# Repo root is two levels up from this file (src/replay/).
REPO = Path(__file__).resolve().parents[2]
ASSESS = REPO / "assessment"
BENCH = REPO / "generated" / "benchmark-results"
OUT_DIR = BENCH / "replay"
CANONICAL = BENCH / "agreement_metrics.json"

# Ten categories, canonical order (assessment/categories.yaml).
CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet",
    "Feministisch", "Fairness",
]

# Human sheet spells the diversity column differently from the LLM export.
HUMAN_DIVERSITY_COLS = ["Diversitaet / Intersektionalität", "Diversitaet / Intersektionalitaet"]

# Controlled exclusion-reason vocabulary (categories.yaml exclusion_reasons /
# docs/js/prisma-import.js REASON_VOCAB). Canonical codes use underscores; the
# Excel writes them with spaces, normalized below.
REASON_VOCAB = ["Duplicate", "Not_relevant_topic", "Wrong_publication_type", "No_full_text", "Language"]

# Workflow criteria a one-paper-at-a-time LLM cannot see; separated out for the
# content-only subset (plan.md V, TP3 step 2).
WORKFLOW_REASONS = {"Duplicate", "No_full_text", "Wrong_publication_type"}

# Four assessment conditions for the secondary 2x2 contrast (plan.md V1).
CONDITIONS = ["haiku", "haiku_kd", "sonnet", "sonnet_kd"]

EPS = 1e-9


def _force_utf8_stdout():
    """Windows consoles default to cp1252; the report carries non-ASCII."""
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


def normalize_value(value):
    """Ja/Nein normalization, byte-for-byte from merge_assessments.py."""
    if not value:
        return ""
    v = str(value).strip().lower()
    if v in ["ja", "yes", "1", "true", "x"]:
        return "Ja"
    if v in ["nein", "no", "0", "false", ""]:
        return "Nein"
    return value


def normalize_decision(value):
    """Decision normalization, byte-for-byte from merge_assessments.py."""
    if not value:
        return ""
    v = str(value).strip().lower()
    if v in ["include", "included", "yes", "1"]:
        return "Include"
    if v in ["exclude", "excluded", "no", "0"]:
        return "Exclude"
    if v in ["unclear", "maybe", "?"]:
        return "Unclear"
    return value


def normalize_reason(raw):
    """Map an exclusion-reason string to its controlled code.

    Mirrors docs/js/prisma-import.js normalizeReason: collapse whitespace and
    slashes to underscore, case-fold, match the vocabulary. Returns (code,
    known); unknown values are returned verbatim so they can be surfaced.
    """
    t = (raw or "").strip()
    if not t:
        return None, True
    norm = "_".join(t.replace("/", " ").split()).lower()
    for code in REASON_VOCAB:
        if code.lower() == norm:
            return code, True
    return t, False


def cohens_kappa(y_true, y_pred):
    """Cohen's kappa, byte-for-byte from calculate_agreement.py (round-4)."""
    if len(y_true) != len(y_pred) or len(y_true) == 0:
        return 0.0
    agreements = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    po = agreements / len(y_true)
    labels = set(y_true) | set(y_pred)
    pe = 0.0
    for label in labels:
        p_true = sum(1 for t in y_true if t == label) / len(y_true)
        p_pred = sum(1 for p in y_pred if p == label) / len(y_pred)
        pe += p_true * p_pred
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0
    return round((po - pe) / (1 - pe), 4)


def confusion_matrix(y_true, y_pred, labels):
    """3x3 confusion as {true_pred: count}, from calculate_agreement.py."""
    matrix = {}
    for t in labels:
        for p in labels:
            matrix[f"{t}_{p}"] = sum(1 for a, b in zip(y_true, y_pred) if a == t and b == p)
    return matrix


def read_csv(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def load_assessment(path):
    """Zotero_Key -> {categories(normalized), decision(normalized), reason(raw)}.

    Pairing key is ALWAYS Zotero_Key, never the sequential ID column.
    """
    data = {}
    for row in read_csv(path):
        pid = (row.get("Zotero_Key") or row.get("zotero_key") or "").strip()
        if not pid:
            continue
        cats = {}
        for cat in CATEGORIES:
            val = row.get(cat, "")
            if not val and cat == "Diversitaet":
                for alt in HUMAN_DIVERSITY_COLS:
                    val = row.get(alt, "")
                    if val:
                        break
            cats[cat] = normalize_value(val)
        data[pid] = {
            "cats": cats,
            "decision": normalize_decision(row.get("Decision", "")),
            "reason": row.get("Exclusion_Reason", ""),
        }
    return data


def load_papers_full(path):
    data = {}
    for row in read_csv(path):
        pid = (row.get("Zotero_Key") or "").strip()
        if not pid:
            continue
        data[pid] = {"is_duplicate": row.get("Is_Duplicate", ""), "has_ha": row.get("Has_HA", "")}
    return data


def two_by_two(pairs):
    """2x2 decision metrics over Include/Exclude pairs (Byrt et al. 1993).

    pairs: list of (human_decision, llm_decision). Pairs with any non-binary
    decision (e.g. Unclear) are dropped from the 2x2 and counted separately.
    """
    binary = [(h, l) for h, l in pairs if h in ("Include", "Exclude") and l in ("Include", "Exclude")]
    n = len(binary)
    dropped = len(pairs) - n
    a = sum(1 for h, l in binary if h == "Include" and l == "Include")
    b = sum(1 for h, l in binary if h == "Include" and l == "Exclude")
    c = sum(1 for h, l in binary if h == "Exclude" and l == "Include")
    d = sum(1 for h, l in binary if h == "Exclude" and l == "Exclude")
    if n == 0:
        return {"n": 0, "dropped_non_binary": dropped}
    po = (a + d) / n
    r1, r2, c1, c2 = a + b, c + d, a + c, b + d
    pe = (r1 * c1 + r2 * c2) / (n * n)
    kappa = 1.0 if (pe == 1.0 and po == 1.0) else (0.0 if pe == 1.0 else (po - pe) / (1 - pe))
    po_max = (min(r1, c1) + min(r2, c2)) / n
    kappa_max = 0.0 if pe == 1.0 else (po_max - pe) / (1 - pe)
    return {
        "n": n,
        "dropped_non_binary": dropped,
        "cells": {
            "Include_Include": a, "Include_Exclude": b,
            "Exclude_Include": c, "Exclude_Exclude": d,
        },
        "human_include": r1, "human_exclude": r2,
        "llm_include": c1, "llm_exclude": c2,
        "human_include_rate": round(r1 / n, 6),
        "llm_include_rate": round(c1 / n, 6),
        "po": round(po, 6),
        "kappa": round(kappa, 6),
        "pabak": round(2 * po - 1, 6),
        "kappa_max": round(kappa_max, 6),
        "prevalence_index": round(abs(a - d) / n, 6),
        "bias_index": round(abs(b - c) / n, 6),
    }


def per_category(human, llm, keys):
    """Per-category kappa/po/n over the given paired keys (both values present)."""
    out = {}
    for cat in CATEGORIES:
        pairs = [(human[k]["cats"][cat], llm[k]["cats"][cat]) for k in keys
                 if human[k]["cats"][cat] and llm[k]["cats"][cat]]
        hv = [p[0] for p in pairs]
        lv = [p[1] for p in pairs]
        if pairs:
            agree = sum(1 for a, b in pairs if a == b) / len(pairs)
            out[cat] = {
                "n": len(pairs),
                "kappa": cohens_kappa(hv, lv),
                "agreement": round(agree, 6),
                "human_yes_count": sum(1 for v in hv if v == "Ja"),
                "llm_yes_count": sum(1 for v in lv if v == "Ja"),
            }
        else:
            out[cat] = {"n": 0, "kappa": None, "agreement": None}
    return out


def decision_block(human, llm, keys):
    """Canonical 3-label decision matrix/kappa plus the 2x2 decomposition."""
    hd = [human[k]["decision"] for k in keys]
    ld = [llm[k]["decision"] for k in keys]
    cm = confusion_matrix(hd, ld, ["Include", "Exclude", "Unclear"])
    agree = sum(1 for a, b in zip(hd, ld) if a == b) / len(keys) if keys else 0.0
    return {
        "n": len(keys),
        "confusion_matrix": cm,
        "overall_agreement": round(agree, 6),
        "cohens_kappa": cohens_kappa(hd, ld),
        "two_by_two": two_by_two(list(zip(hd, ld))),
    }


def build_flow_model(human, llm, papers, provenance):
    human_keys, llm_keys, corpus_keys = set(human), set(llm), set(papers)
    paired = human_keys & llm_keys
    human_only = human_keys - llm_keys
    llm_only = llm_keys - human_keys
    union = human_keys | llm_keys

    dup_yes = sum(1 for v in papers.values() if v["is_duplicate"] == "Yes")
    has_ha_yes = sum(1 for v in papers.values() if v["has_ha"] == "Yes")

    human_incl = sum(1 for v in human.values() if v["decision"] == "Include")
    human_excl = sum(1 for v in human.values() if v["decision"] == "Exclude")
    llm_incl = sum(1 for v in llm.values() if v["decision"] == "Include")
    llm_excl = sum(1 for v in llm.values() if v["decision"] == "Exclude")

    # Exclusion-reason breakdown over human Excludes, controlled vs out-of-vocab.
    controlled = Counter()
    out_of_vocab = Counter()
    empty_reason = 0
    for v in human.values():
        if v["decision"] != "Exclude":
            continue
        code, known = normalize_reason(v["reason"])
        if code is None:
            empty_reason += 1
        elif known:
            controlled[code] += 1
        else:
            out_of_vocab[code] += 1

    # Resolved known issue: stray Has_HA flag on 2YS85B49 in papers_full, a key
    # absent from the human CSV; papers_full Has_HA=Yes overcounts human
    # decisions on the corpus by exactly this one row.
    stray = "2YS85B49"
    assert stray in papers, f"{stray} expected in papers_full"
    assert papers[stray]["has_ha"] == "Yes", f"{stray} expected Has_HA=Yes"
    assert stray not in human_keys, f"{stray} expected absent from human CSV"
    human_on_corpus = len(paired)
    assert has_ha_yes == human_on_corpus + 1, (
        f"Has_HA=Yes ({has_ha_yes}) should be paired ({human_on_corpus}) + 1 stray"
    )

    return {
        "provenance": provenance,
        "identification": {
            "source_file": "assessment/papers_full.csv",
            "identified_records": len(corpus_keys),
            "duplicates_flagged": dup_yes,
            "records_after_dedup": len(corpus_keys) - dup_yes,
        },
        "denominators": {
            "note": ("The benchmark meta counts the UNION of the two assessment "
                     "tracks, not the corpus. Corpus (papers_full) and union differ."),
            "corpus_papers_full": len(corpus_keys),
            "union_of_tracks": len(union),
            "paired_both_tracks": len(paired),
            "human_track_total": len(human_keys),
            "llm_track_total": len(llm_keys),
            "human_only": len(human_only),
            "llm_only": len(llm_only),
        },
        "screening_tracks": {
            "human": {
                "screened": len(human_keys),
                "in_corpus": len(human_keys & corpus_keys),
                "human_only_outside_corpus": len(human_keys - corpus_keys),
            },
            "llm_10k": {"screened": len(llm_keys)},
        },
        "human_decisions": {"include": human_incl, "exclude": human_excl, "total": len(human_keys)},
        "human_exclusion_reasons": {
            "controlled_vocabulary": dict(sorted(controlled.items())),
            "out_of_vocabulary": dict(sorted(out_of_vocab.items())),
            "empty_on_exclude": empty_reason,
            "workflow_criteria": sorted(WORKFLOW_REASONS),
        },
        "llm_decisions": {"include": llm_incl, "exclude": llm_excl, "total": len(llm_keys)},
        "included_per_track": {"human": human_incl, "llm_10k": llm_incl},
        "known_resolved_issue": {
            "key": stray,
            "description": ("Stray Has_HA flag in papers_full.csv; the key is absent "
                            "from the human CSV, so there is no missing human decision. "
                            "papers_full Has_HA=Yes overcounts corpus human decisions by 1."),
            "has_ha_in_papers_full": papers[stray]["has_ha"],
            "present_in_human_csv": False,
            "has_ha_yes_count": has_ha_yes,
            "human_decisions_on_corpus": human_on_corpus,
        },
    }, paired


def content_only_keys(human, keys):
    """Paired keys minus human Excludes whose reason is a workflow criterion."""
    kept = []
    removed_reasons = Counter()
    for k in sorted(keys):
        v = human[k]
        if v["decision"] == "Exclude":
            code, known = normalize_reason(v["reason"])
            if known and code in WORKFLOW_REASONS:
                removed_reasons[code] += 1
                continue
        kept.append(k)
    return kept, removed_reasons


def run_self_test(full_decision, full_categories):
    """Compare the replay against the canonical JSON; exact within EPS."""
    canon = json.loads(CANONICAL.read_text(encoding="utf-8"))
    deltas = []

    canon_cm = canon["decision"]["confusion_matrix"]
    for key in set(canon_cm) | set(full_decision["confusion_matrix"]):
        cv, rv = canon_cm.get(key), full_decision["confusion_matrix"].get(key)
        if cv != rv:
            deltas.append(f"confusion[{key}]: replay={rv} canonical={cv}")

    ck = canon["decision"]["cohens_kappa"]
    if abs(full_decision["cohens_kappa"] - ck) > EPS:
        deltas.append(f"decision kappa: replay={full_decision['cohens_kappa']} canonical={ck}")

    for cat in CATEGORIES:
        cc = canon["categories"][cat]
        rc = full_categories[cat]
        if rc["n"] != cc["n"]:
            deltas.append(f"category[{cat}].n: replay={rc['n']} canonical={cc['n']}")
        if rc["kappa"] is None or abs(rc["kappa"] - cc["kappa"]) > EPS:
            deltas.append(f"category[{cat}].kappa: replay={rc['kappa']} canonical={cc['kappa']}")

    return deltas


def build_condition_contrast(human, provenance):
    """Secondary 2x2 contrast: each condition vs human, full and content-only."""
    conditions = {}
    for cond in CONDITIONS:
        path = ASSESS / f"llm_assessment_{cond}.csv"
        if not path.exists():
            conditions[cond] = {"error": "file not found"}
            continue
        llm = load_assessment(path)
        paired = sorted(set(human) & set(llm))
        content_keys, removed = content_only_keys(human, paired)
        full_pairs = [(human[k]["decision"], llm[k]["decision"]) for k in paired]
        co_pairs = [(human[k]["decision"], llm[k]["decision"]) for k in content_keys]
        conditions[cond] = {
            "paired_n": len(paired),
            "full": two_by_two(full_pairs),
            "content_only": two_by_two(co_pairs),
            "content_only_removed_workflow_pairs": dict(sorted(removed.items())),
        }

    def best_by(kind):
        scored = [(c, d[kind]["kappa"]) for c, d in conditions.items()
                  if isinstance(d, dict) and kind in d and d[kind].get("n")]
        return max(scored, key=lambda x: x[1])[0] if scored else None

    return {
        "provenance": provenance,
        "note": ("plan.md V1: the Sonnet+KD advantage is expected to flip under "
                 "content-only. Reported mechanically by kappa; no narrative."),
        "best_condition_by_kappa_full": best_by("full"),
        "best_condition_by_kappa_content_only": best_by("content_only"),
        "conditions": conditions,
    }


def main():
    _force_utf8_stdout()

    human_path = ASSESS / "human_assessment.csv"
    llm_path = ASSESS / "llm_assessment_10k.csv"
    papers_path = ASSESS / "papers_full.csv"

    provenance = {
        "script": "src/replay/replay_round1.py",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "pairing_key": "Zotero_Key",
        "input_files": {
            "human": "assessment/human_assessment.csv",
            "llm_10k": "assessment/llm_assessment_10k.csv",
            "papers_full": "assessment/papers_full.csv",
            "canonical_selftest": "generated/benchmark-results/agreement_metrics.json",
        },
    }

    human = load_assessment(human_path)
    llm = load_assessment(llm_path)
    papers = load_papers_full(papers_path)

    flow_model, paired = build_flow_model(human, llm, papers, provenance)
    paired_sorted = sorted(paired)

    # Full agreement (self-test target).
    full_decision = decision_block(human, llm, paired_sorted)
    full_categories = per_category(human, llm, paired_sorted)

    # Content-only subset.
    co_keys, removed = content_only_keys(human, paired_sorted)
    co_decision = decision_block(human, llm, co_keys)
    co_categories = per_category(human, llm, co_keys)

    # Self-test before writing any artifact.
    deltas = run_self_test(full_decision, full_categories)
    if deltas:
        print("SELF-TEST FAILED: replay does not match agreement_metrics.json")
        for d in deltas:
            print("  DELTA", d)
        sys.exit(1)

    condition_contrast = build_condition_contrast(human, provenance)

    agreement_replay = {
        "provenance": provenance,
        "paired_n": len(paired_sorted),
        "full": {
            "decision": full_decision,
            "per_category": full_categories,
        },
        "content_only": {
            "removed_workflow_pairs": dict(sorted(removed.items())),
            "n": len(co_keys),
            "decision": co_decision,
            "per_category": co_categories,
        },
        "condition_contrast": condition_contrast,
        "self_test": {
            "passed": True,
            "canonical_source": "generated/benchmark-results/agreement_metrics.json",
            "tolerance": EPS,
            "checked": ["decision_confusion_matrix", "decision_cohens_kappa", "ten_per_category_kappas"],
        },
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "flow_model.json").write_text(
        json.dumps(flow_model, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "agreement_replay.json").write_text(
        json.dumps(agreement_replay, indent=2, ensure_ascii=False), encoding="utf-8")

    # Console summary.
    print("=" * 68)
    print("R2 / TP3 retrospective replay")
    print("=" * 68)
    print(f"Pairing key: Zotero_Key | paired both tracks: {len(paired_sorted)}")
    ident = flow_model["identification"]
    print(f"Identified: {ident['identified_records']} | duplicates flagged: "
          f"{ident['duplicates_flagged']} | after dedup: {ident['records_after_dedup']}")
    den = flow_model["denominators"]
    print(f"Corpus: {den['corpus_papers_full']} | union of tracks: {den['union_of_tracks']} "
          f"| human-only: {den['human_only']} | llm-only: {den['llm_only']}")
    print(f"Human decisions: Include {flow_model['human_decisions']['include']}, "
          f"Exclude {flow_model['human_decisions']['exclude']}")
    print(f"LLM decisions:   Include {flow_model['llm_decisions']['include']}, "
          f"Exclude {flow_model['llm_decisions']['exclude']}")
    reasons = flow_model["human_exclusion_reasons"]
    print(f"Human exclusion reasons (controlled): {reasons['controlled_vocabulary']}")
    if reasons["out_of_vocabulary"]:
        print(f"  OUT-OF-VOCABULARY (surfaced): {reasons['out_of_vocabulary']}")
    print(f"Resolved known issue: {flow_model['known_resolved_issue']['key']} "
          f"(Has_HA=Yes count {flow_model['known_resolved_issue']['has_ha_yes_count']} = "
          f"paired {len(paired_sorted)} + 1 stray)")
    fd = full_decision
    print("-" * 68)
    print(f"FULL     n={fd['n']} po={fd['overall_agreement']} kappa={fd['cohens_kappa']} "
          f"PABAK={fd['two_by_two']['pabak']} kappa_max={fd['two_by_two']['kappa_max']} "
          f"PI={fd['two_by_two']['prevalence_index']} BI={fd['two_by_two']['bias_index']}")
    cd = co_decision
    print(f"CONTENT  n={cd['n']} po={cd['overall_agreement']} kappa={cd['cohens_kappa']} "
          f"PABAK={cd['two_by_two']['pabak']} kappa_max={cd['two_by_two']['kappa_max']} "
          f"PI={cd['two_by_two']['prevalence_index']} BI={cd['two_by_two']['bias_index']} "
          f"(removed {dict(sorted(removed.items()))})")
    print(f"  human include-rate full {fd['two_by_two']['human_include_rate']} -> "
          f"content {cd['two_by_two']['human_include_rate']}; "
          f"llm full {fd['two_by_two']['llm_include_rate']} -> content {cd['two_by_two']['llm_include_rate']}")
    cc = condition_contrast
    print("-" * 68)
    print(f"Condition best by kappa: full={cc['best_condition_by_kappa_full']} "
          f"content-only={cc['best_condition_by_kappa_content_only']}")
    for cond in CONDITIONS:
        d = cc["conditions"][cond]
        if "full" in d and d["full"].get("n"):
            print(f"  {cond:<10} full kappa={d['full']['kappa']} po={d['full']['po']} | "
                  f"content kappa={d['content_only']['kappa']} po={d['content_only']['po']}")
    print("-" * 68)
    print(f"Wrote {OUT_DIR / 'flow_model.json'}")
    print(f"Wrote {OUT_DIR / 'agreement_replay.json'}")
    print("PASS: replay reproduces agreement_metrics.json (decision matrix, decision kappa, ten per-category kappas) within 1e-9")


if __name__ == "__main__":
    main()
