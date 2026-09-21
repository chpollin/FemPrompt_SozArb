"""Tests for source-bound active-distillate publication."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from src.publish import project_active_distillates as projection
from src.publish.validate_research_vault import ValidationReport


def _write(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value.strip() + "\n", encoding="utf-8")


def _repo(tmp_path: Path) -> Path:
    _write(
        tmp_path / "research-vault/20_distillates/publications/source.md",
        """
---
type: distillate
record-id: TEST
work-id: work:test
version-id: version:bibliographic
status: preparation
prepared-by:
  agent-id: /root/test
  model: test-model
  prepared-at: 2026-09-21
source-representation:
  path: sources/source.md
  sha256: sha256:source
  version-id: version:source
  version-type: accepted_manuscript
---
# Source-bound distillate
""",
    )
    _write(
        tmp_path / "research-vault/20_distillates/publications/legacy.md",
        """
---
type: distillate
record-id: LEGACY
work-id: work:legacy
version-id: version:legacy
status: ai-agent-reviewed
---
# Legacy distillate without a source representation
""",
    )
    _write(tmp_path / "sources/source.md", "source")
    _write(tmp_path / "corpus/work_version_registry.json", "{}")
    return tmp_path


def _binding(*_args, **_kwargs) -> dict:
    return {
        "record_id": "TEST",
        "work_id": "work:test",
        "bibliographic_version_id": "version:bibliographic",
        "source_path": "sources/source.md",
        "source_sha256": "sha256:source",
        "source_version_id": "version:source",
        "source_version_type": "accepted_manuscript",
    }


def test_projects_only_source_bound_publication_distillates(tmp_path, monkeypatch):
    repo = _repo(tmp_path)
    monkeypatch.setattr(projection, "validate_vault", lambda _vault: ValidationReport())
    monkeypatch.setattr(projection, "source_binding_for_record", _binding)

    result = projection.project_active_distillates(repo)

    assert result == {
        "TEST": {
            "knowledge_doc": "vault/Papers/active-source.md",
            "knowledge_authority": {
                "status": "preparation",
                "prepared_by": {
                    "agent-id": "/root/test",
                    "model": "test-model",
                    "prepared-at": "2026-09-21",
                },
                "source_representation": {
                    "path": "sources/source.md",
                    "sha256": "sha256:source",
                    "version-id": "version:source",
                    "version-type": "accepted_manuscript",
                },
            },
            "work_id": "work:test",
            "version_id": "version:bibliographic",
        }
    }
    assert (
        (repo / "docs/vault/Papers/active-source.md")
        .read_text(encoding="utf-8")
        .startswith("---\n")
    )
    assert not (repo / "docs/vault/Papers/active-legacy.md").exists()


def test_validates_complete_vault_before_copying(tmp_path, monkeypatch):
    repo = _repo(tmp_path)
    monkeypatch.setattr(
        projection,
        "validate_vault",
        lambda _vault: ValidationReport(errors=["broken active vault"]),
    )

    with pytest.raises(ValueError, match="broken active vault"):
        projection.project_active_distillates(repo)

    assert not (repo / "docs/vault/Papers").exists()


def test_rejects_source_binding_drift_before_copying(tmp_path, monkeypatch):
    repo = _repo(tmp_path)
    monkeypatch.setattr(projection, "validate_vault", lambda _vault: ValidationReport())
    stale = _binding()
    stale["source_sha256"] = "sha256:different"
    monkeypatch.setattr(
        projection, "source_binding_for_record", lambda *_args, **_kwargs: stale
    )

    with pytest.raises(ValueError, match="differs from the canonical source binding"):
        projection.project_active_distillates(repo)


def test_prunes_only_stale_active_projection_files(tmp_path, monkeypatch):
    repo = _repo(tmp_path)
    papers = repo / "docs/vault/Papers"
    _write(papers / "active-stale.md", "stale")
    _write(papers / "historical.md", "historical")
    monkeypatch.setattr(projection, "validate_vault", lambda _vault: ValidationReport())
    monkeypatch.setattr(projection, "source_binding_for_record", _binding)

    projection.project_active_distillates(repo)

    assert not (papers / "active-stale.md").exists()
    assert (papers / "historical.md").exists()


def test_projection_is_byte_deterministic(tmp_path, monkeypatch):
    repo = _repo(tmp_path)
    monkeypatch.setattr(projection, "validate_vault", lambda _vault: ValidationReport())
    monkeypatch.setattr(projection, "source_binding_for_record", _binding)

    first = projection.project_active_distillates(repo)
    first_bytes = (repo / "docs/vault/Papers/active-source.md").read_bytes()
    second = projection.project_active_distillates(repo)

    assert second == first
    assert (repo / "docs/vault/Papers/active-source.md").read_bytes() == first_bytes


def test_legacy_same_version_source_is_enriched_from_canonical_binding(
    tmp_path, monkeypatch
):
    repo = _repo(tmp_path)
    distillate = repo / "research-vault/20_distillates/publications/source.md"
    content = distillate.read_text(encoding="utf-8")
    content = "\n".join(
        line
        for line in content.splitlines()
        if line.strip()
        not in {
            "version-id: version:source",
            "version-type: accepted_manuscript",
        }
    )
    distillate.write_text(content + "\n", encoding="utf-8")
    binding = _binding()
    binding["source_version_id"] = "version:bibliographic"
    monkeypatch.setattr(projection, "validate_vault", lambda _vault: ValidationReport())
    monkeypatch.setattr(
        projection, "source_binding_for_record", lambda *_args, **_kwargs: binding
    )

    result = projection.project_active_distillates(repo)

    source = result["TEST"]["knowledge_authority"]["source_representation"]
    assert source["version-id"] == "version:bibliographic"
    assert source["version-type"] == "accepted_manuscript"


def test_current_repository_projection_is_json_serializable():
    repo = Path(__file__).resolve().parents[1]

    encoded = json.dumps(projection.project_active_distillates(repo))

    assert '"prepared-at": "2026-09-21"' in encoded
