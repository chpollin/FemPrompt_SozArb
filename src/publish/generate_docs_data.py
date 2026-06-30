"""
generate_docs_data.py

Generates docs/data/research_vault_v2.json from the 10K benchmark assessment results.

Input files:
  assessment/llm_assessment_10k.csv
  assessment/human_assessment.csv
  generated/benchmark-results/disagreements.csv
  generated/benchmark-results/agreement_metrics.json
  corpus/papers_metadata.csv

Output files:
  docs/data/research_vault_v2.json

Usage:
  PYTHONIOENCODING=utf-8 python src/publish/generate_docs_data.py
"""

import csv
import json
import os
import re
import sys
from datetime import date

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender",
    "Diversitaet", "Feministisch", "Fairness"
]

INPUT_LLM = os.path.join(REPO_ROOT, "assessment", "llm_assessment_10k.csv")
INPUT_HUMAN = os.path.join(REPO_ROOT, "assessment", "human_assessment.csv")
INPUT_DISAGREEMENTS = os.path.join(REPO_ROOT, "generated", "benchmark-results", "disagreements.csv")
INPUT_METRICS = os.path.join(REPO_ROOT, "generated", "benchmark-results", "agreement_metrics.json")
INPUT_METADATA = os.path.join(REPO_ROOT, "corpus", "papers_metadata.csv")

OUTPUT_VAULT = os.path.join(REPO_ROOT, "docs", "data", "research_vault_v2.json")

VAULT_PAPERS_DIR = os.path.join(REPO_ROOT, "docs", "vault", "Papers")


def safe_title(title):
    """Convert title to safe filename, matching generate_vault_v2.py logic."""
    return re.sub(r'[<>:"/\\|?*\n\r]', '-', title).strip('. ')


def read_csv(filepath):
    """Read a CSV file and return list of dicts."""
    rows = []
    with open(filepath, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def ja_nein_to_bool(val):
    """Convert 'Ja'/'Nein' or '1'/'0' to boolean. Empty/None -> None."""
    if val is None:
        return None
    v = str(val).strip()
    if v in ("Ja", "1", "True", "true", "yes", "Yes"):
        return True
    if v in ("Nein", "0", "False", "false", "no", "No"):
        return False
    return None  # blank or unknown


def parse_llm_row(row, metadata_by_key):
    """Parse one LLM assessment row into paper dict."""
    key = row.get("Zotero_Key", "").strip()
    meta = metadata_by_key.get(key, {})

    all_cats = {}
    positive_cats = []
    for cat in CATEGORIES:
        val = ja_nein_to_bool(row.get(cat))
        all_cats[cat] = 1 if val else 0
        if val:
            positive_cats.append(cat)

    year_raw = meta.get("Year", "") or row.get("Year", "")
    try:
        year = int(float(year_raw)) if year_raw else None
    except (ValueError, TypeError):
        year = None

    # Check if vault knowledge doc exists
    title = meta.get("Title") or row.get("Title", "")
    knowledge_doc = None
    if title and os.path.isdir(VAULT_PAPERS_DIR):
        vault_filename = safe_title(title) + ".md"
        vault_path = os.path.join(VAULT_PAPERS_DIR, vault_filename)
        if os.path.isfile(vault_path):
            knowledge_doc = f"vault/Papers/{vault_filename}"

    return {
        "id": key,
        "title": title,
        "author_year": row.get("Author_Year", ""),
        "authors": meta.get("Authors", ""),
        "year": year,
        "doi": meta.get("DOI", "") or "",
        "url": meta.get("URL", "") or "",
        "abstract": (meta.get("Abstract", "") or "")[:500],
        "item_type": (meta.get("Item_Type", "") or "").lower(),
        "journal": meta.get("Journal", "") or "",
        "knowledge_doc": knowledge_doc,
        "llm": {
            "decision": row.get("Decision", ""),
            "categories": positive_cats,
            "all_categories": all_cats,
            "reasoning": (row.get("LLM_Reasoning", "") or "")[:300],
        },
        "human": None,  # filled in next pass
        "benchmark": {
            "has_human": False,
            "agreement": None,
            "disagreement_type": None,
            "severity": None,
            "affected_categories": [],
        },
    }


def load_human_assessment(filepath):
    """Return dict: Zotero_Key -> human assessment dict."""
    rows = read_csv(filepath)
    result = {}
    for row in rows:
        key = row.get("Zotero_Key", "").strip()
        if not key:
            continue

        decision = row.get("Decision", "").strip()
        all_cats = {}
        positive_cats = []
        for cat in CATEGORIES:
            val = ja_nein_to_bool(row.get(cat))
            all_cats[cat] = 1 if val else 0
            if val:
                positive_cats.append(cat)

        result[key] = {
            "decision": decision,
            "categories": positive_cats,
            "all_categories": all_cats,
        }
    return result


def load_disagreements(filepath):
    """Return dict: paper_id (as int) -> disagreement info."""
    rows = read_csv(filepath)
    result = {}
    for row in rows:
        pid = row.get("paper_id", "").strip()
        if not pid:
            continue
        affected_raw = row.get("affected_categories", "")
        affected = [c.strip() for c in affected_raw.split(",") if c.strip()] if affected_raw else []

        severity_raw = row.get("severity", "")
        try:
            severity_int = int(severity_raw)
            severity = "high" if severity_int >= 3 else ("medium" if severity_int == 2 else "low")
        except (ValueError, TypeError):
            severity = severity_raw.lower() if severity_raw else "unknown"

        result[pid] = {
            "disagreement_type": row.get("disagreement_type", ""),
            "severity": severity,
            "affected_categories": affected,
        }
    return result


def main():
    print("Loading input files...")

    # Load metadata (for abstract, DOI, etc.)
    metadata_rows = read_csv(INPUT_METADATA)
    metadata_by_key = {r["Zotero_Key"].strip(): r for r in metadata_rows if r.get("Zotero_Key")}
    print(f"  Metadata: {len(metadata_by_key)} papers")

    # Load LLM assessment
    llm_rows = read_csv(INPUT_LLM)
    print(f"  LLM assessment: {len(llm_rows)} rows")

    # Load human assessment
    human_by_key = load_human_assessment(INPUT_HUMAN)
    print(f"  Human assessment: {len(human_by_key)} papers (keyed)")

    # Load disagreements
    disagreements = load_disagreements(INPUT_DISAGREEMENTS)
    print(f"  Disagreements: {len(disagreements)} entries")

    # Load agreement metrics
    with open(INPUT_METRICS, encoding="utf-8") as f:
        metrics = json.load(f)

    # Build kappa_by_category from metrics
    kappa_by_category = {}
    for cat, data in metrics.get("categories", {}).items():
        kappa_by_category[cat] = {
            "kappa": round(data["kappa"], 4),
            "agreement_pct": round(data["agreement"] * 100, 1),
            "n": data["n"],
            "human_yes_rate": round(data["human_yes_rate"] * 100, 1),
            "agent_yes_rate": round(data["agent_yes_rate"] * 100, 1),
        }

    print("\nBuilding paper records...")
    papers = []

    for row in llm_rows:
        key = row.get("Zotero_Key", "").strip()
        paper = parse_llm_row(row, metadata_by_key)

        # Attach human assessment if available
        if key in human_by_key:
            h = human_by_key[key]
            paper["human"] = h
            paper["benchmark"]["has_human"] = True

            # Compute agreement
            llm_dec = paper["llm"]["decision"]
            human_dec = h["decision"]

            if llm_dec and human_dec:
                paper["benchmark"]["agreement"] = (llm_dec == human_dec)

        papers.append(paper)

    # Attach disagreement info (by row index from disagreements CSV, which uses paper_id = ID column from llm CSV)
    # The disagreements CSV uses paper_id matching llm assessment ID (1-based)
    # Build a lookup by Zotero_Key via the LLM CSV index
    llm_id_to_key = {}
    for row in llm_rows:
        pid = row.get("ID", "").strip()
        key = row.get("Zotero_Key", "").strip()
        if pid and key:
            llm_id_to_key[pid] = key

    for pid, dis_info in disagreements.items():
        key = llm_id_to_key.get(pid)
        if not key:
            continue
        # Find the paper in our list
        for p in papers:
            if p["id"] == key:
                p["benchmark"]["disagreement_type"] = dis_info["disagreement_type"]
                p["benchmark"]["severity"] = dis_info["severity"]
                p["benchmark"]["affected_categories"] = dis_info["affected_categories"]
                break

    print(f"  Total papers: {len(papers)}")
    papers_with_human = sum(1 for p in papers if p["benchmark"]["has_human"])
    papers_with_decision = sum(
        1 for p in papers
        if p["benchmark"]["has_human"] and p["human"]["decision"] and p["llm"]["decision"]
    )
    disagreement_count = sum(
        1 for p in papers
        if p["benchmark"]["has_human"]
        and p["benchmark"]["agreement"] is False
    )
    print(f"  Papers with human assessment: {papers_with_human}")
    print(f"  Papers with both decisions: {papers_with_decision}")
    print(f"  Disagreements: {disagreement_count}")

    # Use canonical confusion matrix from agreement_metrics.json
    canonical_cm = metrics["decision"]["confusion_matrix"]
    confusion = {
        "Include_Include": canonical_cm["Include_Include"],
        "Include_Exclude": canonical_cm["Include_Exclude"],
        "Exclude_Include": canonical_cm["Exclude_Include"],
        "Exclude_Exclude": canonical_cm["Exclude_Exclude"],
    }
    print(f"  Confusion matrix (canonical): {confusion}")

    # LLM include/exclude stats
    llm_include = sum(1 for p in papers if p["llm"]["decision"] == "Include")
    llm_exclude = sum(1 for p in papers if p["llm"]["decision"] == "Exclude")
    human_include = sum(1 for p in papers if p["human"] and p["human"]["decision"] == "Include")
    human_total = sum(1 for p in papers if p["human"] and p["human"]["decision"] in ("Include", "Exclude"))

    # Build output JSON
    output = {
        "meta": {
            "generated": date.today().isoformat(),
            "total_papers": len(papers),
            "papers_with_human": papers_with_human,
            "benchmark_papers": metrics["decision"]["n"],
            "kappa_overall": metrics["decision"]["cohens_kappa"],
            "kappa_interpretation": metrics["decision"]["kappa_interpretation"],
            "llm_include_rate": round(llm_include / len(papers) * 100, 1) if papers else 0,
            "llm_include_count": llm_include,
            "llm_exclude_count": llm_exclude,
            "human_include_rate": round(human_include / human_total * 100, 1) if human_total else 0,
            "human_include_count": human_include,
            "human_total_with_decision": human_total,
            "disagreement_count": disagreement_count,
            "confusion_matrix": confusion,
        },
        "kappa_by_category": kappa_by_category,
        "papers": papers,
    }

    # Write output files
    os.makedirs(os.path.dirname(OUTPUT_VAULT), exist_ok=True)

    print(f"\nWriting {OUTPUT_VAULT}...")
    with open(OUTPUT_VAULT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(OUTPUT_VAULT) / 1024
    print(f"  Done: {size_kb:.0f} KB")

    print("\nDone.")


if __name__ == "__main__":
    main()
