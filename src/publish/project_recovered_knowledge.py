"""Project explicitly recovered historical knowledge documents for PRISM."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


def _sha256(path: Path) -> str:
    return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()


def _bibliographic_record(registry: dict[str, Any], record_id: str) -> dict[str, Any]:
    pointer = registry.get("record_index", {}).get(record_id)
    if not isinstance(pointer, dict):
        raise ValueError(f"{record_id}: recovery record is absent from the registry")
    for work in registry.get("works", []):
        if work.get("work_id") != pointer.get("work_id"):
            continue
        for version in work.get("versions", []):
            if version.get("version_id") == pointer.get("version_id"):
                return version
    raise ValueError(f"{record_id}: recovery version is absent from the registry")


def _assert_bibliographic_evidence(
    record_id: str,
    binding: dict[str, Any],
    version: dict[str, Any],
) -> None:
    evidence = binding["bibliographic_evidence"]
    if evidence.get("title") != version.get("title"):
        raise ValueError(f"{record_id}: recovery title differs from the registry")
    expected_doi = evidence.get("doi")
    if expected_doi is not None:
        dois = [
            value.lower() for value in version.get("identifiers", {}).get("doi", [])
        ]
        if expected_doi.lower() not in dois:
            raise ValueError(f"{record_id}: recovery DOI differs from the registry")
    elif str(evidence.get("year")) not in str(version.get("version_date", "")):
        raise ValueError(f"{record_id}: recovery year differs from the registry")


def project_recovered_knowledge(
    repo: Path,
    fulltext_manifest: dict[str, Any] | None,
) -> dict[str, dict[str, Any]]:
    """Copy hash-bound historical documents whose full-text manifest is available."""
    repo = repo.resolve()
    if not fulltext_manifest:
        return {}
    manifest_path = repo / "corpus/knowledge_document_recovery.json"
    registry_path = repo / "corpus/work_version_registry.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    destination = repo / "docs/vault/Papers"
    destination.mkdir(parents=True, exist_ok=True)
    projected: dict[str, dict[str, Any]] = {}
    expected_files: set[str] = set()

    for record_id, binding in sorted(manifest["bindings"].items()):
        fulltext = fulltext_manifest.get(record_id)
        if fulltext is None:
            continue
        if fulltext.get("source_file") != binding["source_file"]:
            raise ValueError(
                f"{record_id}: full-text manifest source differs from recovery binding"
            )
        source_path = repo / binding["source_path"]
        if (
            not source_path.is_file()
            or _sha256(source_path) != binding["source_sha256"]
        ):
            raise ValueError(f"{record_id}: recovery source hash differs")
        knowledge_source = repo / binding["knowledge_source_path"]
        if (
            not knowledge_source.is_file()
            or _sha256(knowledge_source) != binding["knowledge_source_sha256"]
        ):
            raise ValueError(f"{record_id}: recovered knowledge document hash differs")
        version = _bibliographic_record(registry, record_id)
        _assert_bibliographic_evidence(record_id, binding, version)

        filename = f"recovered-{record_id}.md"
        expected_files.add(filename)
        target = destination / filename
        body = knowledge_source.read_bytes()
        if not target.exists() or target.read_bytes() != body:
            target.write_bytes(body)
        projected[record_id] = {
            "knowledge_doc": f"vault/Papers/{filename}",
            "knowledge_authority": binding["authority"],
        }

    for stale in sorted(destination.glob("recovered-*.md")):
        if stale.name not in expected_files:
            stale.unlink()
    return projected
