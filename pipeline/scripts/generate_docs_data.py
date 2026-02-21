"""
generate_docs_data.py

Generates docs/data/research_vault_v2.json and docs/data/graph_data.json
from the 10K benchmark assessment results.

Input files:
  benchmark/data/llm_assessment_10k.csv
  benchmark/data/human_assessment.csv
  benchmark/results/disagreements.csv
  benchmark/results/agreement_metrics.json
  corpus/papers_metadata.csv

Output files:
  docs/data/research_vault_v2.json
  docs/data/graph_data.json

Usage:
  PYTHONIOENCODING=utf-8 python pipeline/scripts/generate_docs_data.py
"""

import csv
import json
import os
import sys
from datetime import date
from collections import defaultdict

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender",
    "Diversitaet", "Feministisch", "Fairness"
]

INPUT_LLM = os.path.join(REPO_ROOT, "benchmark", "data", "llm_assessment_10k.csv")
INPUT_HUMAN = os.path.join(REPO_ROOT, "benchmark", "data", "human_assessment.csv")
INPUT_DISAGREEMENTS = os.path.join(REPO_ROOT, "benchmark", "results", "disagreements.csv")
INPUT_METRICS = os.path.join(REPO_ROOT, "benchmark", "results", "agreement_metrics.json")
INPUT_METADATA = os.path.join(REPO_ROOT, "corpus", "papers_metadata.csv")

OUTPUT_VAULT = os.path.join(REPO_ROOT, "docs", "data", "research_vault_v2.json")
OUTPUT_GRAPH = os.path.join(REPO_ROOT, "docs", "data", "graph_data.json")


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

    try:
        confidence = float(row.get("LLM_Confidence", 0) or 0)
    except (ValueError, TypeError):
        confidence = 0.0

    year_raw = meta.get("Year", "") or row.get("Year", "")
    try:
        year = int(float(year_raw)) if year_raw else None
    except (ValueError, TypeError):
        year = None

    return {
        "id": key,
        "title": meta.get("Title") or row.get("Title", ""),
        "author_year": row.get("Author_Year", ""),
        "authors": meta.get("Authors", ""),
        "year": year,
        "doi": meta.get("DOI", "") or "",
        "url": meta.get("URL", "") or "",
        "abstract": (meta.get("Abstract", "") or "")[:500],
        "item_type": (meta.get("Item_Type", "") or "").lower(),
        "journal": meta.get("Journal", "") or "",
        "llm": {
            "decision": row.get("Decision", ""),
            "confidence": round(confidence, 3),
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


def compute_confusion_matrix(papers):
    """Compute 2x2 confusion matrix for papers with human assessment."""
    matrix = {
        "Include_Include": 0,
        "Include_Exclude": 0,
        "Exclude_Include": 0,
        "Exclude_Exclude": 0,
        "Other": 0,
    }
    for p in papers:
        if not p["benchmark"]["has_human"]:
            continue
        h = p["human"]["decision"]
        l = p["llm"]["decision"]
        # Skip papers without actual decisions (empty string = not yet assessed)
        if not h or not l:
            continue
        # Normalize: map Unclear -> Exclude for matrix
        h_norm = "Include" if h == "Include" else "Exclude"
        l_norm = "Include" if l == "Include" else "Exclude"
        key = f"{h_norm}_{l_norm}"
        if key in matrix:
            matrix[key] += 1
        else:
            matrix["Other"] += 1
    return matrix


def compute_category_graph(papers):
    """Compute category co-occurrence network for vis-network."""
    # Count co-occurrences among LLM-positive categories
    co_occur = defaultdict(int)
    cat_counts = defaultdict(int)

    for p in papers:
        pos_cats = p["llm"]["categories"]
        for cat in pos_cats:
            cat_counts[cat] += 1
        # pairwise co-occurrence
        for i, c1 in enumerate(pos_cats):
            for c2 in pos_cats[i + 1:]:
                pair = tuple(sorted([c1, c2]))
                co_occur[pair] += 1

    # Build nodes with kappa info placeholder (filled from metrics)
    nodes = []
    for i, cat in enumerate(CATEGORIES):
        nodes.append({
            "id": i,
            "label": cat.replace("_", " "),
            "category": cat,
            "size": cat_counts.get(cat, 0),
            "value": cat_counts.get(cat, 1),  # vis-network uses value for size
        })

    # Build edges (only co-occurrences >= 2)
    edges = []
    edge_id = 0
    for (c1, c2), weight in co_occur.items():
        if weight < 2:
            continue
        i1 = CATEGORIES.index(c1)
        i2 = CATEGORIES.index(c2)
        edges.append({
            "id": edge_id,
            "from": i1,
            "to": i2,
            "value": weight,
            "title": f"{c1} + {c2}: {weight} Papers",
        })
        edge_id += 1

    return {"nodes": nodes, "edges": edges}


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

    # Build kappa lookup dict for graph coloring
    kappa_lookup = {cat: kappa_by_category.get(cat, {}).get("kappa", 0) for cat in CATEGORIES}

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

    # Compute confusion matrix
    confusion = compute_confusion_matrix(papers)
    print(f"  Confusion matrix: {confusion}")

    # Compute category graph
    graph_data = compute_category_graph(papers)

    # Add kappa coloring to graph nodes
    for node in graph_data["nodes"]:
        cat = node["category"]
        kappa = kappa_lookup.get(cat, 0)
        node["kappa"] = round(kappa, 4)
        # Color: green (positive kappa) to red (negative kappa)
        if kappa > 0.05:
            node["color"] = "#10b981"  # green
        elif kappa > 0:
            node["color"] = "#84cc16"  # lime
        elif kappa > -0.05:
            node["color"] = "#f59e0b"  # amber
        else:
            node["color"] = "#ef4444"  # red

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
            "benchmark_papers": papers_with_decision,
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

    print(f"Writing {OUTPUT_GRAPH}...")
    with open(OUTPUT_GRAPH, "w", encoding="utf-8") as f:
        json.dump(graph_data, f, ensure_ascii=False, indent=2)
    graph_size_kb = os.path.getsize(OUTPUT_GRAPH) / 1024
    print(f"  Done: {graph_size_kb:.0f} KB ({len(graph_data['nodes'])} nodes, {len(graph_data['edges'])} edges)")

    print("\nDone.")


if __name__ == "__main__":
    main()
