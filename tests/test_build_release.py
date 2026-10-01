import io
import json
import os
import zipfile
from pathlib import Path

import pytest

from src.publish import build_downloads, build_release

ROOT = Path(__file__).resolve().parents[1]


def test_release_excludes_raw_tracks_and_local_sources():
    files = build_release.build_files(ROOT)
    assert "index.html" in files
    assert not any(
        name.startswith(("data/screening/", "data/fulltext/", "vault/"))
        for name in files
    )
    assert "data/fulltext_manifest.json" not in files
    assert "data/assertions_working.json" not in files
    assert "data/promptotyping_v2.json" not in files
    assert "prisma.html" not in files
    public = json.loads(files["data/public_release.json"])
    assert all(
        "llm" not in paper and "human" not in paper for paper in public["papers"]
    )
    assert all(len(paper["work_id"]) > 5 for paper in public["papers"])


def test_download_and_site_have_identical_research_data():
    files = build_release.build_files(ROOT)
    with zipfile.ZipFile(io.BytesIO(files["downloads/research-data.zip"])) as archive:
        for name in ("public_release", "assertion_index", "literature_landscape"):
            assert archive.read(name + ".json") == files["data/" + name + ".json"]
        assert not any(
            "fulltext" in name or "screening/ar2" in name for name in archive.namelist()
        )
        assert all(len(name) < 100 for name in archive.namelist())


def test_deterministic_archives_do_not_embed_mtimes():
    assert build_release.zip_bytes(
        {"b": b"two", "a": b"one"}
    ) == build_release.zip_bytes({"a": b"one", "b": b"two"})


def test_unexpected_file_in_existing_release_is_not_silently_retained(tmp_path):
    (tmp_path / "unreviewed.json").write_text("private", encoding="utf-8")
    with pytest.raises(ValueError, match="Unexpected"):
        build_release.write_files(tmp_path, {"index.html": b"safe"})
    assert not (tmp_path / "index.html").exists()


def test_release_check_is_read_only(tmp_path):
    build_release.write_files(tmp_path, {"index.html": b"old"})
    with pytest.raises(ValueError, match="Stale"):
        build_release.write_files(tmp_path, {"index.html": b"new"}, check=True)
    assert (tmp_path / "index.html").read_bytes() == b"old"


def test_working_archive_uses_same_canonical_document_inventory():
    corpus = json.loads(
        (ROOT / "docs/data/research_vault_v2.json").read_text(encoding="utf-8")
    )
    withheld = build_downloads.withheld_documents(corpus["papers"])
    shipped = [
        p for p in corpus["papers"]
        if p.get("knowledge_doc") and p["knowledge_doc"] not in withheld
    ]
    with zipfile.ZipFile(io.BytesIO(build_downloads.build(ROOT))) as archive:
        notes = [name for name in archive.namelist() if name.startswith("Papers/")]
        assert len(notes) == len({p["knowledge_doc"] for p in shipped})
        index = json.loads(archive.read("record-index.json"))
        assert len(index) == len(shipped)
        open_ids = {
            p["id"] for p in corpus["papers"]
            if not build_downloads.has_expert_decision(p)
        }
        assert open_ids and not open_ids & {entry["record_id"] for entry in index}


def test_working_archive_withholds_documents_of_open_records(tmp_path):
    papers = tmp_path / "docs" / "vault" / "Papers"
    papers.mkdir(parents=True)
    for name in ("decided", "open", "shared"):
        (papers / f"{name}.md").write_text(
            f"---\nllm_decision: Include\n---\n{name}", encoding="utf-8"
        )
    decided = {"benchmark": {"has_human": True}, "human": {"decision": "Include"}}
    undecided = {"benchmark": {"has_human": False}, "human": None}

    def record(record_id, doc, state):
        return {
            "id": record_id, "work_id": f"work:{record_id}",
            "version_id": f"version:{record_id}",
            "knowledge_doc": f"vault/Papers/{doc}.md", **state,
        }

    payload = {"papers": [
        record("A", "decided", decided),
        record("B", "open", undecided),
        record("C", "shared", decided),
        record("D", "shared", undecided),
        record("E", "decided", {"benchmark": {"has_human": True}, "human": {"decision": "Unclear"}}),
    ]}
    data = tmp_path / "docs" / "data"
    data.mkdir()
    (data / "research_vault_v2.json").write_text(json.dumps(payload), encoding="utf-8")

    with zipfile.ZipFile(io.BytesIO(build_downloads.build(tmp_path))) as archive:
        notes = sorted(n for n in archive.namelist() if n.startswith("Papers/"))
        index = json.loads(archive.read("record-index.json"))
    # E has no Include or Exclude, so the document it shares with A is withheld too.
    assert notes == []
    assert index == []
    payload["papers"].pop()
    (data / "research_vault_v2.json").write_text(json.dumps(payload), encoding="utf-8")
    with zipfile.ZipFile(io.BytesIO(build_downloads.build(tmp_path))) as archive:
        assert sorted(n for n in archive.namelist() if n.startswith("Papers/")) == ["Papers/A.md"]
        assert [e["record_id"] for e in json.loads(archive.read("record-index.json"))] == ["A"]


def test_working_archive_reads_long_linked_document_paths(tmp_path):
    papers = tmp_path / "docs" / "vault" / "Papers"
    papers.mkdir(parents=True)
    filename = f"{'long-title-' * 18}document.md"
    document = str((papers / filename).resolve())
    if os.name == "nt":
        document = f"\\\\?\\{document}"
    with Path(document).open("w", encoding="utf-8") as output:
        output.write("source-bound content")
    payload = {
        "papers": [
            {
                "id": "LONG",
                "work_id": "work:long",
                "version_id": "version:long",
                "knowledge_doc": f"vault/Papers/{filename}",
                "benchmark": {"has_human": True},
                "human": {"decision": "Exclude"},
            }
        ]
    }
    data = tmp_path / "docs" / "data"
    data.mkdir()
    (data / "research_vault_v2.json").write_text(json.dumps(payload), encoding="utf-8")

    with zipfile.ZipFile(io.BytesIO(build_downloads.build(tmp_path))) as archive:
        assert archive.read("Papers/LONG.md") == b"source-bound content"
