#!/usr/bin/env python3
"""Audit a fresh source-acquisition run against the recorded baseline.

The script pipeline compares immutable identifiers and hashes from an earlier
acquisition manifest with a dated retry. It records local acquisition and
conversion evidence without promoting either to source review or scholarly
verification.

Usage:
    python -m src.acquire.audit_source_reacquisition \
      --baseline-manifest BASELINE.json --retry-manifest RETRY.json \
      --readiness READINESS.json --conversion-report CONVERSION.json \
      --output AUDIT.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def _read_json(path: Path) -> Any:
    if not path.is_file():
        raise FileNotFoundError(f"required input is missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256_path(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    temporary.replace(path)


def _conversion_index(
    report: dict[str, Any] | None,
    markdown_directory: Path | None,
) -> dict[str, dict[str, Any]]:
    if not report or not markdown_directory:
        return {}
    converted: dict[str, dict[str, Any]] = {}
    for item in report.get("files") or []:
        if item.get("status") != "converted":
            continue
        markdown_path = markdown_directory / str(item["output"])
        if not markdown_path.is_file():
            raise FileNotFoundError(
                f"converted Markdown recorded but missing: {markdown_path}"
            )
        converted[str(item["input"])] = {
            "status": "converted_not_source_reviewed",
            "markdown_path": markdown_path.as_posix(),
            "markdown_sha256": _sha256_path(markdown_path),
            "quality_score": item.get("quality_score"),
            "quality_issues": item.get("quality_issues") or [],
        }
    return converted


def build_audit(
    baseline: dict[str, Any],
    retry: dict[str, Any],
    readiness: dict[str, Any],
    *,
    conversion_report: dict[str, Any] | None = None,
    markdown_directory: Path | None = None,
) -> dict[str, Any]:
    """Build per-candidate acquisition evidence and remaining blockers."""
    baseline_by_id = {
        record["candidate_id"]: record for record in baseline.get("records") or []
    }
    retry_by_id = {
        record["candidate_id"]: record for record in retry.get("records") or []
    }
    conversion_by_pdf = _conversion_index(conversion_report, markdown_directory)
    records: list[dict[str, Any]] = []

    for ready in readiness.get("records") or []:
        candidate_id = ready["candidate_id"]
        old = baseline_by_id.get(candidate_id)
        new = retry_by_id.get(candidate_id)
        evidence: dict[str, Any] = {
            "baseline_pdf_sha256": old.get("sha256") if old else None,
            "retry_pdf_sha256": new.get("sha256") if new else None,
            "retry_status": new.get("status") if new else "not_eligible",
            "retry_attempts": new.get("attempts") if new else [],
        }
        blocker: str | None
        if new and new.get("status") in {"downloaded", "already_available"}:
            evidence["local_pdf_name"] = new.get("local_pdf_name")
            evidence["bytes"] = new.get("bytes")
            evidence["container_validation"] = new.get("validation")
            if old and old.get("sha256") == new.get("sha256"):
                outcome = "exact_recorded_source_recovered"
                blocker = None
            else:
                outcome = "changed_source_bytes_recovered"
                conversion = conversion_by_pdf.get(str(new.get("local_pdf_name")))
                evidence["conversion"] = conversion
                blocker = (
                    "new_conversion_requires_source_qc"
                    if conversion
                    else "changed_source_requires_conversion_and_source_qc"
                )
        elif new:
            outcome = "retrieval_failed"
            blocker = "alternative_lawful_source_or_operator_download_required"
        else:
            outcome = "no_download_eligible_source"
            blocker = "lawful_fulltext_source_required"

        records.append(
            {
                "candidate_id": candidate_id,
                "doi": ready.get("doi"),
                "title": ready.get("title"),
                "outcome": outcome,
                "evidence": evidence,
                "remaining_blocker": blocker,
                "authority": {
                    "local_acquisition": outcome
                    in {
                        "exact_recorded_source_recovered",
                        "changed_source_bytes_recovered",
                    },
                    "conversion": bool(evidence.get("conversion")),
                    "ai_source_review": False,
                    "human_verification": False,
                },
            }
        )

    outcomes: dict[str, int] = {}
    for record in records:
        outcome = record["outcome"]
        outcomes[outcome] = outcomes.get(outcome, 0) + 1
    return {
        "schema": "femprompt-source-reacquisition-audit/0.1",
        "generated_at": datetime.now(UTC).isoformat(),
        "scope": "local acquisition and conversion evidence only",
        "counts": {"candidates": len(records), "outcomes": outcomes},
        "records": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline-manifest", type=Path, required=True)
    parser.add_argument("--retry-manifest", type=Path, required=True)
    parser.add_argument("--readiness", type=Path, required=True)
    parser.add_argument("--conversion-report", type=Path)
    parser.add_argument("--markdown-directory", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if bool(args.conversion_report) != bool(args.markdown_directory):
        parser.error(
            "--conversion-report and --markdown-directory must be supplied together"
        )
    payload = build_audit(
        _read_json(args.baseline_manifest),
        _read_json(args.retry_manifest),
        _read_json(args.readiness),
        conversion_report=(
            _read_json(args.conversion_report) if args.conversion_report else None
        ),
        markdown_directory=args.markdown_directory,
    )
    _atomic_write_json(args.output, payload)
    print(f"OK: wrote {len(payload['records'])} records to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
