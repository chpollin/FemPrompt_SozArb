"""Project source-bound active distillates into the published paper collection.

The helper validates the complete Research Vault before copying any file. It
publishes only active publication distillates with an exact canonical source
binding and preserves their recorded authority state without promoting it.
"""

from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path
from typing import Any

import yaml

from src.analysis.work_versions import source_binding_for_record
from src.publish.validate_research_vault import validate_vault


def _json_compatible(value: Any) -> Any:
    """Return metadata using only JSON-native values and ISO temporal strings."""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, dict):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("Active-distillate metadata keys must be strings")
        return {key: _json_compatible(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_compatible(item) for item in value]
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    raise TypeError(
        f"Unsupported active-distillate metadata value: {type(value).__name__}"
    )


def _metadata(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        raise ValueError(f"Active distillate lacks YAML frontmatter: {path}")
    value = yaml.safe_load(text.split("\n---\n", 1)[0][4:]) or {}
    if not isinstance(value, dict):
        raise ValueError(f"Active distillate frontmatter is not a mapping: {path}")
    return value


def _assert_source_binding(
    repo: Path,
    metadata: dict[str, Any],
    registry: dict[str, Any],
) -> dict[str, Any]:
    record_id = str(metadata["record-id"])
    binding = source_binding_for_record(registry, record_id, repo)
    if binding is None:
        raise ValueError(
            f"{record_id}: active distillate has no canonical source binding"
        )
    source = metadata["source-representation"]
    expected = {
        "path": binding["source_path"],
        "sha256": binding["source_sha256"],
    }
    if any(source.get(key) != value for key, value in expected.items()):
        raise ValueError(
            f"{record_id}: active distillate source representation differs from the canonical source binding"
        )
    if (
        metadata.get("work-id") != binding["work_id"]
        or metadata.get("version-id") != binding["bibliographic_version_id"]
    ):
        raise ValueError(
            f"{record_id}: active distillate crosses canonical Work-Version identity"
        )
    normalized_source = dict(source)
    for key, binding_key in (
        ("version-id", "source_version_id"),
        ("version-type", "source_version_type"),
    ):
        value = normalized_source.get(key)
        if value is None and binding["source_version_id"] == metadata["version-id"]:
            normalized_source[key] = binding[binding_key]
        elif value != binding[binding_key]:
            raise ValueError(
                f"{record_id}: active distillate source representation differs from the canonical source binding"
            )
    return normalized_source


def project_active_distillates(repo: Path) -> dict[str, dict[str, Any]]:
    """Copy source-bound publication distillates and return their record mapping."""
    repo = repo.resolve()
    vault = repo / "research-vault"
    report = validate_vault(vault)
    if report.errors:
        raise ValueError(
            "Research Vault validation failed:\n" + "\n".join(report.errors)
        )

    registry_path = repo / "corpus/work_version_registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    destination = repo / "docs/vault/Papers"
    destination.mkdir(parents=True, exist_ok=True)
    projected: dict[str, dict[str, Any]] = {}
    expected_files: set[str] = set()

    publications = vault / "20_distillates/publications"
    for source_path in sorted(publications.glob("*.md")):
        metadata = _metadata(source_path)
        source_representation = metadata.get("source-representation")
        if not isinstance(source_representation, dict):
            continue
        source_representation = _assert_source_binding(repo, metadata, registry)
        record_id = str(metadata["record-id"])
        if record_id in projected:
            raise ValueError(f"Duplicate active distillate record ID: {record_id}")
        filename = f"active-{source_path.name}"
        expected_files.add(filename)
        target = destination / filename
        body = source_path.read_bytes()
        if not target.exists() or target.read_bytes() != body:
            target.write_bytes(body)
        projected[record_id] = {
            "knowledge_doc": f"vault/Papers/{filename}",
            "knowledge_authority": {
                "status": metadata["status"],
                "prepared_by": _json_compatible(metadata.get("prepared-by")),
                "source_representation": _json_compatible(source_representation),
            },
            "work_id": metadata["work-id"],
            "version_id": metadata["version-id"],
        }

    for stale in sorted(destination.glob("active-*.md")):
        if stale.name not in expected_files:
            stale.unlink()
    return dict(sorted(projected.items()))
