"""Merge a validated AI-agent-reviewed product into a productive PRISM track.

The merge is append-only at decision level. Existing records must either be
absent or byte-equivalent after JSON normalization. Per-record lifecycle and
PROV-O-compatible provenance remain the authority for later expert verification.
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
except ModuleNotFoundError:
    sys.path.insert(0, str(REPO_ROOT))
    from src.assess import screening_lifecycle


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


def merge_documents(
    base: dict[str, Any],
    product: dict[str, Any],
    *,
    product_path: Path,
) -> dict[str, Any]:
    """Return an idempotent merge after validating both lifecycle documents."""
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
    for paper_id, record in product["decisions"].items():
        existing = merged_decisions.get(paper_id)
        if existing is not None and not _same(existing, record):
            raise ValueError(f"Refusing to overwrite divergent record {paper_id}")
        if existing is None:
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
