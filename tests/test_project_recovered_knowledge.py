"""Tests for hash-bound historical knowledge-document recovery."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from src.publish.project_recovered_knowledge import project_recovered_knowledge


def _sha256(value: bytes) -> str:
    return "sha256:" + hashlib.sha256(value).hexdigest()


def _write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")


def _repo(tmp_path: Path) -> tuple[Path, dict]:
    source = b"complete source\n"
    knowledge = b"---\ntitle: Source title\n---\n\n# Historical knowledge\n"
    source_path = tmp_path / "docs/data/fulltext/RECORD.md"
    knowledge_path = tmp_path / "generated/vault/Papers/source-title.md"
    source_path.parent.mkdir(parents=True)
    knowledge_path.parent.mkdir(parents=True)
    source_path.write_bytes(source)
    knowledge_path.write_bytes(knowledge)
    authority = {
        "status": "historical_unreviewed",
        "note": "Recovered historical knowledge document without promoted review authority.",
    }
    _write_json(
        tmp_path / "corpus/knowledge_document_recovery.json",
        {
            "schema": "femprompt-knowledge-document-recovery/1.0",
            "bindings": {
                "RECORD": {
                    "source_file": "source.md",
                    "source_path": "docs/data/fulltext/RECORD.md",
                    "source_sha256": _sha256(source),
                    "knowledge_source_path": "generated/vault/Papers/source-title.md",
                    "knowledge_source_sha256": _sha256(knowledge),
                    "bibliographic_evidence": {
                        "title": "Source title",
                        "doi": "10.1234/source",
                    },
                    "identity_basis": "manifest-source-file+doi+embedded-distillate",
                    "authority": authority,
                }
            },
        },
    )
    _write_json(
        tmp_path / "corpus/work_version_registry.json",
        {
            "record_index": {
                "RECORD": {"work_id": "work:1", "version_id": "version:1"}
            },
            "works": [
                {
                    "work_id": "work:1",
                    "versions": [
                        {
                            "version_id": "version:1",
                            "title": "Source title",
                            "version_date": "2025",
                            "identifiers": {"doi": ["10.1234/source"]},
                        }
                    ],
                }
            ],
        },
    )
    return tmp_path, {"RECORD": {"source_file": "source.md"}}


def test_projects_exact_hash_bound_recovery(tmp_path):
    repo, fulltext_manifest = _repo(tmp_path)

    result = project_recovered_knowledge(repo, fulltext_manifest)

    assert result == {
        "RECORD": {
            "knowledge_doc": "vault/Papers/recovered-RECORD.md",
            "knowledge_authority": {
                "status": "historical_unreviewed",
                "note": "Recovered historical knowledge document without promoted review authority.",
            },
        }
    }
    assert (repo / "docs/vault/Papers/recovered-RECORD.md").read_bytes() == (
        repo / "generated/vault/Papers/source-title.md"
    ).read_bytes()


def test_skips_recovery_before_fulltext_manifest_exists(tmp_path):
    repo, _fulltext_manifest = _repo(tmp_path)

    assert project_recovered_knowledge(repo, {}) == {}
    assert not (repo / "docs/vault/Papers").exists()


def test_canonical_recovery_accepts_only_line_ending_changes(tmp_path):
    repo, fulltext_manifest = _repo(tmp_path)
    manifest_path = repo / "corpus/knowledge_document_recovery.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest.update(
        schema="femprompt-knowledge-document-recovery/1.1",
        hash_contract="text-crlf-to-lf",
    )
    _write_json(manifest_path, manifest)
    source = repo / "generated/vault/Papers/source-title.md"
    original = source.read_bytes()
    source.write_bytes(original.replace(b"\n", b"\r\n"))
    project_recovered_knowledge(repo, fulltext_manifest)
    assert (repo / "docs/vault/Papers/recovered-RECORD.md").read_bytes() == original
    source.write_bytes(original.replace(b"Historical", b"Altered"))
    with pytest.raises(ValueError, match="knowledge document hash differs"):
        project_recovered_knowledge(repo, fulltext_manifest)


@pytest.mark.parametrize(
    ("path", "message"),
    [
        ("docs/data/fulltext/RECORD.md", "source hash differs"),
        (
            "generated/vault/Papers/source-title.md",
            "knowledge document hash differs",
        ),
    ],
)
def test_fails_closed_when_bound_input_changes(tmp_path, path, message):
    repo, fulltext_manifest = _repo(tmp_path)
    (repo / path).write_text("changed", encoding="utf-8")

    with pytest.raises(ValueError, match=message):
        project_recovered_knowledge(repo, fulltext_manifest)


def test_fails_closed_when_manifest_source_file_changes(tmp_path):
    repo, fulltext_manifest = _repo(tmp_path)
    fulltext_manifest["RECORD"]["source_file"] = "other.md"

    with pytest.raises(ValueError, match="manifest source differs"):
        project_recovered_knowledge(repo, fulltext_manifest)


def test_current_recovery_manifest_projects_all_bound_documents():
    repo = Path(__file__).resolve().parents[1]
    manifest = json.loads(
        (repo / "docs/data/fulltext_manifest.json").read_text(encoding="utf-8")
    )

    result = project_recovered_knowledge(repo, manifest)

    expected = json.loads(
        (repo / "corpus/knowledge_document_recovery.json").read_text(encoding="utf-8")
    )["bindings"]

    assert set(result) == set(expected)
    assert all(
        value["knowledge_authority"]["status"] == "historical_unreviewed"
        for value in result.values()
    )
