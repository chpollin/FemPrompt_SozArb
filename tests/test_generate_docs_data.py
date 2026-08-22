"""Tests for the published Evidence Companion data generator."""

import importlib.util
import json
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "generate_docs_data",
    ROOT / "src" / "publish" / "generate_docs_data.py",
)
docs_data = importlib.util.module_from_spec(spec)
sys.modules["generate_docs_data"] = docs_data
spec.loader.exec_module(docs_data)


def test_resolve_case_preserving_filename_returns_disk_spelling(tmp_path: Path) -> None:
    actual = "Data Feminism for AI.md"
    (tmp_path / actual).write_text("content", encoding="utf-8")

    resolved = docs_data.resolve_case_preserving_filename(
        tmp_path,
        "Data feminism for AI.md",
    )

    assert resolved == actual


def test_resolve_case_preserving_filename_rejects_ambiguous_match(
    tmp_path: Path,
    monkeypatch,
) -> None:
    monkeypatch.setattr(docs_data.os, "listdir", lambda _directory: ["Paper.md", "paper.md"])

    assert docs_data.resolve_case_preserving_filename(tmp_path, "PAPER.md") is None


def test_published_knowledge_doc_paths_match_exact_disk_names() -> None:
    payload = json.loads((ROOT / "docs" / "data" / "research_vault_v2.json").read_text(encoding="utf-8"))
    paper_dir = ROOT / "docs" / "vault" / "Papers"
    available = set(docs_data.os.listdir(paper_dir))
    mismatches = []

    for paper in payload["papers"]:
        knowledge_doc = paper.get("knowledge_doc")
        if not knowledge_doc:
            continue
        filename = Path(knowledge_doc).name
        if filename not in available:
            mismatches.append(f"{paper['id']}: {filename}")

    assert mismatches == []


def test_explicit_knowledge_bindings_match_verified_sources() -> None:
    bindings = json.loads(
        (ROOT / "docs" / "data" / "knowledge_doc_bindings.json").read_text(encoding="utf-8")
    )["bindings"]
    manifest = json.loads(
        (ROOT / "docs" / "data" / "fulltext_manifest.json").read_text(encoding="utf-8")
    )
    available = set(docs_data.os.listdir(ROOT / "docs" / "vault" / "Papers"))

    for paper_id, binding in bindings.items():
        assert binding["identity_basis"] == "verified_fulltext_manifest"
        assert manifest[paper_id].get("reason") not in {"ambiguous", "title_mismatch"}
        assert manifest[paper_id]["source_file"] == binding["source_file"]
        assert Path(binding["knowledge_doc"]).name in available


def test_parse_llm_row_rejects_unbound_duplicate_title(tmp_path: Path, monkeypatch) -> None:
    filename = "Intersectionality in Artificial Intelligence- Framing Concerns and Recommendations for Action.md"
    (tmp_path / filename).write_text(
        "---\nsource_file: Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.md\n---\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(docs_data, "VAULT_PAPERS_DIR", str(tmp_path))
    metadata = {"BLOCKED": {"Title": "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action"}}

    paper = docs_data.parse_llm_row(
        {"Zotero_Key": "BLOCKED"},
        metadata,
        {"BLOCKED": {"src": "none", "reason": "title_mismatch"}},
        {
            "VERIFIED": {
                "knowledge_doc": f"vault/Papers/{filename}",
                "source_file": "Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.md",
            }
        },
    )

    assert paper["knowledge_doc"] is None


def test_parse_llm_row_accepts_matching_verified_source(tmp_path: Path, monkeypatch) -> None:
    title = "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action"
    filename = docs_data.safe_title(title) + ".md"
    source_file = "Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.md"
    (tmp_path / filename).write_text(
        f"---\nsource_file: {source_file}\n---\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(docs_data, "VAULT_PAPERS_DIR", str(tmp_path))

    paper = docs_data.parse_llm_row(
        {"Zotero_Key": "VERIFIED"},
        {"VERIFIED": {"Title": title}},
        {"VERIFIED": {"src": "clean", "source_file": source_file}},
        {
            "VERIFIED": {
                "knowledge_doc": f"vault/Papers/{filename}",
                "source_file": source_file,
            }
        },
    )

    assert paper["knowledge_doc"] == f"vault/Papers/{filename}"
    assert paper["knowledge_coverage"] == "linked"
    assert paper["work_id"] == f"source:{source_file}"
    assert paper["identity_basis"] == "verified_fulltext"


def test_work_identity_prefers_normalized_doi() -> None:
    work_id, basis = docs_data.derive_work_identity(
        "P1",
        "https://doi.org/10.1234/Example.",
        {"src": "clean", "source_file": "Example.md"},
    )

    assert work_id == "doi:10.1234/example"
    assert basis == "doi"


def test_published_coverage_and_work_counts_are_internally_consistent() -> None:
    payload = json.loads(
        (ROOT / "docs" / "data" / "research_vault_v2.json").read_text(
            encoding="utf-8"
        )
    )
    papers = payload["papers"]
    meta = payload["meta"]

    assert meta["unique_works"] == len({paper["work_id"] for paper in papers})
    assert meta["knowledge_linked_records"] == sum(
        paper["knowledge_coverage"] == "linked" for paper in papers
    )
    assert meta["distinct_knowledge_docs"] == len(
        {paper["knowledge_doc"] for paper in papers if paper["knowledge_doc"]}
    )
    assert sum(meta["knowledge_coverage"].values()) == len(papers)
    assert meta["source_fingerprint"].startswith("sha256:")
    assert "generated" not in meta


def test_atomic_write_preserves_previous_file_when_serialization_fails(
    tmp_path: Path,
    monkeypatch,
) -> None:
    target = tmp_path / "payload.json"
    target.write_text('{"stable": true}\n', encoding="utf-8")

    def fail_dump(*_args, **_kwargs) -> None:
        raise RuntimeError("synthetic serialization failure")

    monkeypatch.setattr(docs_data.json, "dump", fail_dump)
    with pytest.raises(RuntimeError, match="synthetic"):
        docs_data.write_json_atomic(target, {"replacement": True})

    assert target.read_text(encoding="utf-8") == '{"stable": true}\n'
    assert list(tmp_path.glob(".payload.json.*.tmp")) == []


def test_prune_unreferenced_knowledge_docs_keeps_only_published_links(
    tmp_path: Path,
) -> None:
    kept = tmp_path / "Kept.md"
    removed = tmp_path / "Removed.md"
    ignored = tmp_path / "README.txt"
    kept.write_text("kept", encoding="utf-8")
    removed.write_text("removed", encoding="utf-8")
    ignored.write_text("ignored", encoding="utf-8")

    pruned = docs_data.prune_unreferenced_knowledge_docs(
        tmp_path,
        [{"knowledge_doc": "vault/Papers/Kept.md"}, {"knowledge_doc": None}],
    )

    assert pruned == [removed]
    assert kept.exists()
    assert not removed.exists()
    assert ignored.exists()


def test_full_publication_is_byte_deterministic(tmp_path: Path) -> None:
    first = tmp_path / "first.json"
    second = tmp_path / "second.json"

    docs_data.main(["--output", str(first)])
    docs_data.main(["--output", str(second)])

    assert first.read_bytes() == second.read_bytes()
