#!/usr/bin/env python3
"""Project Codex source Markdown onto registry records without mutating either.

The projection uses a unique DOI or a unique normalized title to identify the
Work and Zotero record. Exact publication-Version compatibility is assessed
separately and never inferred from Work identity alone.

Usage:
    python -m src.acquire.project_codex_source_bindings \
      --readiness source-readiness.json --registry work_version_registry.json \
      --output source-bindings.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import unicodedata
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def _read_json(path: Path) -> Any:
    if not path.is_file():
        raise FileNotFoundError(f"required input is missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def _normalise_title(value: str) -> str:
    text = unicodedata.normalize("NFKD", value).casefold()
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text).split())


def _zotero_keys_for_version(version: dict[str, Any]) -> list[str]:
    return sorted(set((version.get("identifiers") or {}).get("zotero_key") or []))


def _markdown_evidence(source: dict[str, Any], repo: Path | None) -> dict[str, Any]:
    representation = source.get("local_representation") or {}
    recorded_hash = source.get("screening_markdown_sha256") or representation.get(
        "markdown_sha256"
    )
    recorded_path = source.get("screening_markdown_file") or representation.get(
        "markdown_file"
    )
    evidence = {
        "markdown_file": recorded_path,
        "markdown_sha256": recorded_hash,
        "markdown_hash_check": "not_run",
    }
    if not repo or not recorded_path:
        return evidence
    path = repo / str(recorded_path)
    if not path.is_file():
        evidence["markdown_hash_check"] = "file_missing"
        return evidence
    actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    evidence["actual_markdown_sha256"] = actual_hash
    evidence["markdown_hash_check"] = (
        "match" if actual_hash == recorded_hash else "mismatch"
    )
    return evidence


def _version_assessment(
    local_version: dict[str, Any], registry_version: dict[str, Any]
) -> tuple[str, str]:
    local_type = str(local_version.get("version_type") or "not_established")
    registry_type = str(registry_version.get("version_type") or "unknown")
    if local_type == "not_established":
        return (
            "work_bound_source_version_not_established",
            "local acquisition record does not establish the publication Version",
        )
    if registry_type == "unknown":
        return (
            "work_bound_registry_version_not_established",
            "registry record does not establish the publication Version",
        )
    if local_type != registry_type:
        return (
            "work_bound_version_conflict",
            f"local source is {local_type}, registry version is {registry_type}",
        )
    local_date = local_version.get("date")
    registry_date = registry_version.get("version_date")
    if (
        local_date
        and registry_date
        and not str(registry_date).startswith(str(local_date))
    ):
        return (
            "work_bound_version_date_conflict",
            f"local source date is {local_date}, registry version date is {registry_date}",
        )
    return (
        "work_and_version_bound",
        "publication-Version type and available date evidence agree",
    )


def build_bindings(
    readiness: dict[str, Any], registry: dict[str, Any], *, repo: Path | None = None
) -> dict[str, Any]:
    """Return candidate-to-registry bindings for locally represented sources."""
    works = registry.get("works") or []
    works_by_id = {work["work_id"]: work for work in works}
    titles: dict[str, list[str]] = {}
    for work in works:
        titles.setdefault(_normalise_title(work["canonical_title"]), []).append(
            work["work_id"]
        )
    identifier_index = registry.get("identifier_index") or {}
    records: list[dict[str, Any]] = []

    for source in readiness.get("records") or []:
        representation = source.get("local_representation")
        if not representation:
            continue
        markdown_evidence = _markdown_evidence(source, repo)
        doi = str(source.get("doi") or "").strip().casefold()
        identifier_hit = identifier_index.get(f"doi:{doi}") if doi else None
        if identifier_hit:
            work_id = identifier_hit["work_id"]
            version_id = identifier_hit["version_id"]
            basis = "unique_doi"
        else:
            title_hits = titles.get(
                _normalise_title(str(source.get("title") or "")), []
            )
            if len(title_hits) != 1:
                records.append(
                    {
                        "candidate_id": source["candidate_id"],
                        "doi": source.get("doi"),
                        "title": source.get("title"),
                        "binding_status": "unbound",
                        "binding_basis": "no_unique_doi_or_title_match",
                        **markdown_evidence,
                    }
                )
                continue
            work_id = title_hits[0]
            work = works_by_id[work_id]
            version_id = work["preferred_version_id"]
            basis = "unique_normalized_title"

        work = works_by_id[work_id]
        registry_version = next(
            version
            for version in work["versions"]
            if version["version_id"] == version_id
        )
        status, reason = _version_assessment(
            source.get("local_source_version") or {}, registry_version
        )
        records.append(
            {
                "candidate_id": source["candidate_id"],
                "doi": source.get("doi"),
                "title": source.get("title"),
                "binding_status": status,
                "binding_basis": basis,
                "binding_reason": reason,
                "work_id": work_id,
                "version_id": version_id,
                "zotero_keys": _zotero_keys_for_version(registry_version),
                "registry_version_type": registry_version.get("version_type"),
                "registry_version_date": registry_version.get("version_date"),
                "local_source_version": source.get("local_source_version"),
                "source_format": representation.get("format"),
                "source_sha256": representation.get("source_sha256"),
                **markdown_evidence,
                "screening_source_ready": source.get("screening_source_ready"),
            }
        )

    statuses: dict[str, int] = {}
    for record in records:
        status = record["binding_status"]
        statuses[status] = statuses.get(status, 0) + 1
    return {
        "schema": "femprompt-codex-source-bindings/0.1",
        "generated_at": datetime.now(UTC).isoformat(),
        "scope": "read-only binding projection; no registry or PRISM mutation",
        "counts": {"local_representations": len(records), "statuses": statuses},
        "records": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--readiness", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--repo", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = build_bindings(
        _read_json(args.readiness),
        _read_json(args.registry),
        repo=args.repo,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(f"{args.output.suffix}.tmp")
    temporary.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    temporary.replace(args.output)
    print(f"OK: wrote {len(payload['records'])} bindings to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
