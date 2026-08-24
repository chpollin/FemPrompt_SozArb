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

import argparse
import csv
import hashlib
import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any, Mapping, Sequence

from src.analysis.work_versions import load_registry, lookup_by_record

REPO_ROOT = Path(__file__).resolve().parents[2]

INPUT_LLM = REPO_ROOT / "assessment" / "llm_assessment_10k.csv"
INPUT_HUMAN = REPO_ROOT / "assessment" / "human_assessment.csv"
INPUT_DISAGREEMENTS = REPO_ROOT / "generated" / "benchmark-results" / "disagreements.csv"
INPUT_METRICS = REPO_ROOT / "generated" / "benchmark-results" / "agreement_metrics.json"
INPUT_METADATA = REPO_ROOT / "corpus" / "papers_metadata.csv"
INPUT_FULLTEXT_MANIFEST = REPO_ROOT / "docs" / "data" / "fulltext_manifest.json"
INPUT_KNOWLEDGE_BINDINGS = REPO_ROOT / "docs" / "data" / "knowledge_doc_bindings.json"
INPUT_CATEGORY_SCHEMA = REPO_ROOT / "docs" / "data" / "category_schema.json"
INPUT_WORK_VERSION_CONTRACT = REPO_ROOT / "docs" / "data" / "work_version_contract.json"
INPUT_WORK_VERSION_REGISTRY = REPO_ROOT / "corpus" / "work_version_registry.json"

OUTPUT_VAULT = REPO_ROOT / "docs" / "data" / "research_vault_v2.json"

VAULT_PAPERS_DIR = REPO_ROOT / "docs" / "vault" / "Papers"

with INPUT_CATEGORY_SCHEMA.open(encoding="utf-8") as category_file:
    CATEGORY_SCHEMA = json.load(category_file)
CATEGORIES = [item["key"] for item in CATEGORY_SCHEMA["categories"]]


def safe_title(title: str) -> str:
    """Convert title to safe filename, matching generate_vault_v2.py logic."""
    return re.sub(r'[<>:"/\\|?*\n\r]', '-', title).strip('. ')


def resolve_case_preserving_filename(directory: str | Path, filename: str) -> str | None:
    """Return the on-disk filename for a unique case-insensitive match."""
    directory = Path(directory)
    if not directory.is_dir():
        return None

    matches = [entry for entry in os.listdir(directory) if entry.casefold() == filename.casefold()]
    if len(matches) != 1:
        return None
    return matches[0]


def knowledge_doc_identity_allowed(manifest_entry: Mapping[str, Any]) -> bool:
    """Reject a document link when the fulltext gate found an identity conflict."""
    return manifest_entry.get("reason") not in {"ambiguous", "title_mismatch"}


def normalize_doi(value: object) -> str:
    """Return the stable DOI payload without resolver or ``doi:`` prefixes."""
    doi = str(value or "").strip().lower()
    doi = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", doi)
    doi = re.sub(r"^doi:\s*", "", doi)
    return doi.rstrip("/., ")


def derive_work_identity(
    key: str,
    doi: object,
    manifest_entry: Mapping[str, Any],
) -> tuple[str, str]:
    """Derive a stable work identifier from the strongest available evidence."""
    normalized_doi = normalize_doi(doi)
    if normalized_doi:
        return f"doi:{normalized_doi}", "doi"
    source_file = manifest_entry.get("source_file")
    if source_file and knowledge_doc_identity_allowed(manifest_entry):
        return f"source:{source_file}", "verified_fulltext"
    return f"record:{key}", "record"


def work_version_projection(
    key: str,
    registry: Mapping[str, Any] | None,
) -> dict[str, Any] | None:
    """Return the exact version and its work context for one corpus record."""
    if registry is None:
        return None
    resolved = lookup_by_record(dict(registry), key)
    if resolved is None:
        raise ValueError(f"{key}: absent from the canonical Work-Version registry")
    work, version = resolved
    return {
        "work_id": work["work_id"],
        "identity_basis": "work_version_registry",
        "version_id": version["version_id"],
        "version_type": version["version_type"],
        "version_date": version.get("version_date", ""),
        "peer_review_status": version["peer_review_status"],
        "peer_review_basis": version["peer_review_basis"],
        "integrity_status": version["integrity_status"],
        "preferred_version_id": work["preferred_version_id"],
        "latest_version_id": work["latest_version_id"],
        "is_preferred_version": version["version_id"]
        == work["preferred_version_id"],
        "work_versions": [
            {
                "version_id": item["version_id"],
                "version_type": item["version_type"],
                "version_date": item.get("version_date", ""),
                "identifiers": item.get("identifiers", {}),
                "peer_review_status": item["peer_review_status"],
                "peer_review_basis": item["peer_review_basis"],
                "integrity_status": item["integrity_status"],
                "access_status": item.get("access_status", "unknown"),
                "landing_url": item.get("landing_url", ""),
                "fulltext_url": item.get("fulltext_url", ""),
                "relations": item.get("relations", []),
                "is_preferred": item["version_id"] == work["preferred_version_id"],
                "is_latest": item["version_id"] == work["latest_version_id"],
            }
            for item in work["versions"]
        ],
    }


def knowledge_coverage(
    knowledge_doc: str | None,
    manifest_entry: Mapping[str, Any],
) -> str:
    """Classify why a record does or does not expose a knowledge document."""
    if knowledge_doc:
        return "linked"
    if manifest_entry.get("reason") in {"ambiguous", "title_mismatch"}:
        return "identity_unresolved"
    if manifest_entry.get("source_file") and manifest_entry.get("src") in {"clean", "raw"}:
        return "fulltext_ready"
    return "source_missing"


def source_fingerprint(paths: Sequence[str | Path]) -> str:
    """Hash every canonical input so unchanged sources produce identical JSON."""
    digest = hashlib.sha256()
    for filepath in sorted((Path(path) for path in paths), key=lambda path: path.as_posix()):
        digest.update(filepath.relative_to(REPO_ROOT).as_posix().encode("utf-8"))
        with filepath.open("rb") as source:
            for chunk in iter(lambda: source.read(1024 * 1024), b""):
                digest.update(chunk)
    return f"sha256:{digest.hexdigest()}"


def write_json_atomic(filepath: str | Path, payload: Mapping[str, Any]) -> None:
    """Replace the generated JSON only after the complete payload is written."""
    target = Path(filepath)
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(
            "w",
            encoding="utf-8",
            newline="\n",
            dir=target.parent,
            prefix=f".{target.name}.",
            suffix=".tmp",
            delete=False,
        ) as output:
            temporary = Path(output.name)
            json.dump(payload, output, ensure_ascii=False, indent=2)
            output.write("\n")
        os.replace(temporary, target)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()


def prune_unreferenced_knowledge_docs(
    directory: str | Path,
    papers: Sequence[Mapping[str, Any]],
) -> list[Path]:
    """Remove published paper pages that no current record references."""
    paper_directory = Path(directory)
    referenced = {
        Path(str(paper["knowledge_doc"])).name
        for paper in papers
        if paper.get("knowledge_doc")
    }
    removed = [
        path
        for path in sorted(paper_directory.glob("*.md"))
        if path.name not in referenced
    ]
    for path in removed:
        path.unlink()
    return removed


def read_csv(filepath: str | Path) -> list[dict[str, str]]:
    """Read a CSV file and return list of dicts."""
    rows = []
    with Path(filepath).open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def ja_nein_to_bool(val: object) -> bool | None:
    """Convert 'Ja'/'Nein' or '1'/'0' to boolean. Empty/None -> None."""
    if val is None:
        return None
    v = str(val).strip()
    if v in ("Ja", "1", "True", "true", "yes", "Yes"):
        return True
    if v in ("Nein", "0", "False", "false", "no", "No"):
        return False
    return None  # blank or unknown


def parse_llm_row(
    row: Mapping[str, str],
    metadata_by_key: Mapping[str, Mapping[str, str]],
    fulltext_manifest: Mapping[str, Mapping[str, Any]] | None = None,
    knowledge_bindings: Mapping[str, Mapping[str, Any]] | None = None,
    work_version_registry: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
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

    # Check if vault knowledge doc exists.
    title = meta.get("Title") or row.get("Title", "")
    knowledge_doc = None
    manifest_entry = (fulltext_manifest or {}).get(key, {})
    if title:
        expected_filename = safe_title(title) + ".md"
        binding = (knowledge_bindings or {}).get(key)
        governed_filenames = {
            Path(item["knowledge_doc"]).name.casefold()
            for item in (knowledge_bindings or {}).values()
        }
        if binding:
            bound_filename = Path(binding["knowledge_doc"]).name
            vault_filename = resolve_case_preserving_filename(VAULT_PAPERS_DIR, bound_filename)
            if manifest_entry.get("source_file") != binding.get("source_file"):
                vault_filename = None
        elif expected_filename.casefold() in governed_filenames:
            vault_filename = None
        else:
            vault_filename = resolve_case_preserving_filename(VAULT_PAPERS_DIR, expected_filename)
        if vault_filename and (not binding or knowledge_doc_identity_allowed(manifest_entry)):
            knowledge_doc = f"vault/Papers/{vault_filename}"

    doi = meta.get("DOI", "") or ""
    legacy_work_id, legacy_identity_basis = derive_work_identity(
        key, doi, manifest_entry
    )
    version_projection = work_version_projection(key, work_version_registry)
    work_id = (
        version_projection["work_id"] if version_projection else legacy_work_id
    )
    identity_basis = (
        version_projection["identity_basis"]
        if version_projection
        else legacy_identity_basis
    )

    return {
        "id": key,
        "title": title,
        "author_year": row.get("Author_Year", ""),
        "authors": meta.get("Authors", ""),
        "year": year,
        "doi": doi,
        "url": meta.get("URL", "") or "",
        "abstract": (meta.get("Abstract", "") or "")[:500],
        "item_type": (meta.get("Item_Type", "") or "").lower(),
        "journal": meta.get("Journal", "") or "",
        "knowledge_doc": knowledge_doc,
        "knowledge_coverage": knowledge_coverage(knowledge_doc, manifest_entry),
        "work_id": work_id,
        "identity_basis": identity_basis,
        "legacy_work_id": legacy_work_id,
        "legacy_identity_basis": legacy_identity_basis,
        "version_id": version_projection["version_id"] if version_projection else None,
        "version_type": (
            version_projection["version_type"] if version_projection else "unknown"
        ),
        "version_date": version_projection["version_date"] if version_projection else "",
        "peer_review_status": (
            version_projection["peer_review_status"]
            if version_projection
            else "not_established"
        ),
        "peer_review_basis": (
            version_projection["peer_review_basis"]
            if version_projection
            else "unknown"
        ),
        "integrity_status": (
            version_projection["integrity_status"]
            if version_projection
            else "unknown"
        ),
        "preferred_version_id": (
            version_projection["preferred_version_id"] if version_projection else None
        ),
        "latest_version_id": (
            version_projection["latest_version_id"] if version_projection else None
        ),
        "is_preferred_version": (
            version_projection["is_preferred_version"] if version_projection else True
        ),
        "work_versions": (
            version_projection["work_versions"] if version_projection else []
        ),
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


def load_human_assessment(filepath: str | Path) -> dict[str, dict[str, Any]]:
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


def load_disagreements(filepath: str | Path) -> dict[str, dict[str, Any]]:
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


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Publish the Evidence Companion data set.")
    parser.add_argument(
        "--output",
        type=Path,
        default=OUTPUT_VAULT,
        help="JSON target (default: docs/data/research_vault_v2.json)",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> None:
    args = parse_args(argv)
    print("Loading input files...")

    # Load metadata (for abstract, DOI, etc.)
    metadata_rows = read_csv(INPUT_METADATA)
    metadata_by_key = {r["Zotero_Key"].strip(): r for r in metadata_rows if r.get("Zotero_Key")}
    print(f"  Metadata: {len(metadata_by_key)} papers")

    with INPUT_FULLTEXT_MANIFEST.open(encoding="utf-8") as f:
        fulltext_manifest = json.load(f)
    print(f"  Fulltext manifest: {len(fulltext_manifest)} records")

    with INPUT_KNOWLEDGE_BINDINGS.open(encoding="utf-8") as f:
        knowledge_bindings = json.load(f)["bindings"]
    print(f"  Explicit knowledge bindings: {len(knowledge_bindings)} records")

    work_version_registry = load_registry(INPUT_WORK_VERSION_REGISTRY)
    print(
        "  Work-Version registry: "
        f"{work_version_registry['counts']['works']} works / "
        f"{work_version_registry['counts']['versions']} versions"
    )

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
    with INPUT_METRICS.open(encoding="utf-8") as f:
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
        paper = parse_llm_row(
            row,
            metadata_by_key,
            fulltext_manifest,
            knowledge_bindings,
            work_version_registry,
        )

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

    papers_by_id = {paper["id"]: paper for paper in papers}
    for pid, dis_info in disagreements.items():
        key = llm_id_to_key.get(pid)
        paper = papers_by_id.get(key)
        if paper is None:
            continue
        paper["benchmark"]["disagreement_type"] = dis_info["disagreement_type"]
        paper["benchmark"]["severity"] = dis_info["severity"]
        paper["benchmark"]["affected_categories"] = dis_info["affected_categories"]

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
    coverage_counts = {
        status: sum(1 for paper in papers if paper["knowledge_coverage"] == status)
        for status in (
            "linked",
            "fulltext_ready",
            "identity_unresolved",
            "source_missing",
        )
    }
    distinct_knowledge_docs = len(
        {paper["knowledge_doc"] for paper in papers if paper["knowledge_doc"]}
    )
    source_files = [
        INPUT_LLM,
        INPUT_HUMAN,
        INPUT_DISAGREEMENTS,
        INPUT_METRICS,
        INPUT_METADATA,
        INPUT_FULLTEXT_MANIFEST,
        INPUT_KNOWLEDGE_BINDINGS,
        INPUT_CATEGORY_SCHEMA,
        INPUT_WORK_VERSION_CONTRACT,
        INPUT_WORK_VERSION_REGISTRY,
    ]

    # Build output JSON
    output = {
        "meta": {
            "source_fingerprint": source_fingerprint(source_files),
            "total_papers": len(papers),
            "unique_works": len({paper["work_id"] for paper in papers}),
            "knowledge_linked_records": coverage_counts["linked"],
            "distinct_knowledge_docs": distinct_knowledge_docs,
            "knowledge_coverage": coverage_counts,
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

    print(f"\nWriting {args.output}...")
    write_json_atomic(args.output, output)
    size_kb = args.output.stat().st_size / 1024
    print(f"  Done: {size_kb:.0f} KB")

    if args.output.resolve() == OUTPUT_VAULT.resolve():
        removed = prune_unreferenced_knowledge_docs(VAULT_PAPERS_DIR, papers)
        print(f"  Pruned unreferenced knowledge documents: {len(removed)}")

    print("\nDone.")


if __name__ == "__main__":
    main()
