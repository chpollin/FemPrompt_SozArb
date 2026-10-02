"""Merge a validated AI-agent-reviewed product into a productive PRISM track.

The merge is append-only at decision level. Existing records must either be
absent or byte-equivalent after JSON normalization. The one exception is a recode
(ADR-046): a product record whose last annotation is an ``ai_agent_recode`` may
replace the existing record when the run manifest binds the record's exact hash,
the recode supersedes its active annotation and its history is an exact prefix
of the product record. Per-record lifecycle and PROV-O-compatible provenance
remain the authority for later expert verification.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]

try:
    from src.assess import screening_lifecycle
    from src.assess.artifact_verification import record_hash
except ModuleNotFoundError:
    sys.path.insert(0, str(REPO_ROOT))
    from src.assess import screening_lifecycle
    from src.assess.artifact_verification import record_hash


def _read_json(path: Path) -> dict[str, Any]:
    document = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(document, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return document


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _repo_reference(path: Path) -> str:
    absolute = path.resolve()
    try:
        return absolute.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return absolute.as_posix()


def _same(left: Any, right: Any) -> bool:
    return json.dumps(
        left, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ) == json.dumps(right, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _is_recode(record: dict[str, Any]) -> bool:
    annotations = record.get("annotations") or []
    return bool(annotations) and (
        annotations[-1].get("annotation_type") == "ai_agent_recode"
        and annotations[-1].get("annotation_id") == record.get("active_annotation_id")
    )


def _recode_bindings(
    product: dict[str, Any], run_manifest: dict[str, Any] | None
) -> dict[str, dict[str, Any]]:
    """Map each record ID to the recode binding its run manifest declares."""
    if run_manifest is None:
        reference = str(product.get("review_context", {}).get("run_manifest") or "")
        path = Path(reference)
        if not reference or not (path if path.is_absolute() else REPO_ROOT / path).is_file():
            return {}
        run_manifest = _read_json(path if path.is_absolute() else REPO_ROOT / path)
    if run_manifest.get("run_id") != product["review_context"]["run_id"]:
        raise ValueError("Run manifest and product name different runs")
    bindings: dict[str, dict[str, Any]] = {}
    for paper in run_manifest.get("assignment", {}).get("papers", []):
        for record_id, binding in (paper.get("recode_of") or {}).items():
            bindings[record_id] = binding
    return bindings


def _require_recode(
    paper_id: str,
    existing: dict[str, Any],
    record: dict[str, Any],
    binding: dict[str, Any] | None,
) -> None:
    refusal = screening_lifecycle.recode_refusal(existing)
    if refusal:
        raise ValueError(f"Refusing to recode {paper_id}: {refusal}")
    if not isinstance(binding, dict):
        raise ValueError(f"Refusing to recode {paper_id}: the run manifest binds no recode")
    recode = record["annotations"][-1]
    if recode.get("supersedes") != existing.get("active_annotation_id") or binding.get(
        "annotation_id"
    ) != existing.get("active_annotation_id"):
        raise ValueError(
            f"Refusing to recode {paper_id}: it does not supersede the active annotation"
        )
    existing_events = existing.get("lifecycle", {}).get("events", [])
    if not (
        _same(record["annotations"][:-1], existing.get("annotations"))
        and _same(record["lifecycle"]["baseline"], existing["lifecycle"]["baseline"])
        and _same(record["lifecycle"]["events"][: len(existing_events)], existing_events)
        and _same(record["checks"][: len(existing.get("checks", []))], existing.get("checks", []))
    ):
        raise ValueError(
            f"Refusing to recode {paper_id}: the product does not extend the exact record history"
        )
    current_hash = record_hash(existing)
    if f"sha256:{binding.get('record_sha256')}" != current_hash or recode.get(
        "supersedes_record_sha256"
    ) != current_hash:
        raise ValueError(
            f"Refusing to recode {paper_id}: the bound record hash differs from the productive record"
        )


def merge_documents(
    base: dict[str, Any],
    product: dict[str, Any],
    *,
    product_path: Path,
    run_manifest: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return an idempotent merge after validating both lifecycle documents.

    ``run_manifest`` defaults to the manifest the product's review context names.
    """
    screening_lifecycle.require_valid_document(base)
    screening_lifecycle.require_valid_document(product)
    if base.get("schema") != screening_lifecycle.SCHEMA_V05:
        raise ValueError("Base track must use screening schema 0.5")
    if product.get("schema") != screening_lifecycle.SCHEMA_V05:
        raise ValueError("Product must use screening schema 0.5")
    if base.get("reviewer") != product.get("reviewer"):
        raise ValueError("Base and product reviewer IDs differ")
    context = product.get("review_context")
    if not isinstance(context, dict) or not str(context.get("run_id") or "").strip():
        raise ValueError("Product review_context.run_id is required")

    merged = copy.deepcopy(base)
    merged_decisions = merged.setdefault("decisions", {})
    recoded = sorted(
        paper_id for paper_id, record in product["decisions"].items() if _is_recode(record)
    )
    bindings = _recode_bindings(product, run_manifest) if recoded else {}
    for paper_id, record in product["decisions"].items():
        existing = merged_decisions.get(paper_id)
        if existing is None:
            if paper_id in recoded:
                raise ValueError(f"Refusing to recode absent record {paper_id}")
            merged_decisions[paper_id] = copy.deepcopy(record)
        elif not _same(existing, record):
            if paper_id not in recoded:
                raise ValueError(f"Refusing to overwrite divergent record {paper_id}")
            _require_recode(paper_id, existing, record, bindings.get(paper_id))
            merged_decisions[paper_id] = copy.deepcopy(record)
    merged["decisions"] = dict(sorted(merged_decisions.items()))
    merged["updated"] = max(
        str(base.get("updated") or ""), str(product.get("updated") or "")
    )
    merged["status"] = "ai-agent-reviewed"

    work_assignments = context.get("work_assignments", [])
    review_entry = {
        "run_id": context["run_id"],
        "state": "ai-agent-reviewed",
        "product": {
            "path": _repo_reference(product_path),
            "sha256": _sha256(product_path),
        },
        "review": {
            "path": context.get("review_path"),
            "sha256": context.get("review_sha256"),
        },
        "work_ids": sorted(
            {
                assignment["work_id"]
                for assignment in work_assignments
                if isinstance(assignment, dict) and assignment.get("work_id")
            }
        ),
        "record_ids": sorted(product["decisions"]),
    }
    if recoded:
        review_entry["recoded_record_ids"] = recoded
    review_runs = [
        entry
        for entry in merged.get("review_runs", [])
        if isinstance(entry, dict) and entry.get("run_id") != context["run_id"]
    ]
    review_runs.append(review_entry)
    merged["review_runs"] = sorted(review_runs, key=lambda entry: entry["run_id"])
    screening_lifecycle.require_valid_document(merged)
    return merged


def _write_atomic(path: Path, document: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    temporary.replace(path)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base", type=Path)
    parser.add_argument("product", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args(argv)

    base = _read_json(args.base)
    product = _read_json(args.product)
    merged = merge_documents(base, product, product_path=args.product)
    if args.check:
        if not args.output.is_file() or not _same(_read_json(args.output), merged):
            raise ValueError(f"Merged output is stale: {args.output}")
        print(f"OK: merge is current: {args.output}")
        return 0
    _write_atomic(args.output, merged)
    print(
        f"OK: merged {len(product['decisions'])} records into {args.output}; "
        f"productive total {len(merged['decisions'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
