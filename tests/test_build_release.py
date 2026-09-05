import io
import json
from pathlib import Path
import zipfile

import pytest

from src.publish import build_release, build_downloads


ROOT = Path(__file__).resolve().parents[1]


def test_release_excludes_raw_tracks_and_local_sources():
    files = build_release.build_files(ROOT)
    assert "index.html" in files
    assert not any(name.startswith(("data/screening/", "data/fulltext/", "vault/")) for name in files)
    assert "data/fulltext_manifest.json" not in files
    assert "data/promptotyping_v2.json" not in files
    assert "prisma.html" not in files
    public = json.loads(files["data/public_release.json"])
    assert all("llm" not in paper and "human" not in paper for paper in public["papers"])
    assert all(len(paper["work_id"]) > 5 for paper in public["papers"])


def test_download_and_site_have_identical_research_data():
    files = build_release.build_files(ROOT)
    with zipfile.ZipFile(io.BytesIO(files["downloads/research-data.zip"])) as archive:
        for name in ("public_release", "assertion_index", "literature_landscape"):
            assert archive.read(name + ".json") == files["data/" + name + ".json"]
        assert not any("fulltext" in name or "screening/ar2" in name for name in archive.namelist())
        assert all(len(name) < 100 for name in archive.namelist())


def test_deterministic_archives_do_not_embed_mtimes():
    assert build_release.zip_bytes({"b": b"two", "a": b"one"}) == build_release.zip_bytes({"a": b"one", "b": b"two"})


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
    corpus = json.loads((ROOT / "docs/data/research_vault_v2.json").read_text(encoding="utf-8"))
    expected = {p["knowledge_doc"] for p in corpus["papers"] if p.get("knowledge_doc")}
    with zipfile.ZipFile(io.BytesIO(build_downloads.build(ROOT))) as archive:
        notes = [name for name in archive.namelist() if name.startswith("Papers/")]
        assert len(notes) == len(expected)
        assert len(json.loads(archive.read("record-index.json"))) == sum(bool(p.get("knowledge_doc")) for p in corpus["papers"])
