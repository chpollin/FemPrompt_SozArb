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


def test_corpus_admits_unassessed_zotero_records_without_negative_ratings():
    metadata = docs_data.corpus_metadata()
    original = docs_data.read_csv(docs_data.INPUT_LLM)
    rows = docs_data.corpus_assessment_rows(metadata, original)
    keys = {
        item["key"]
        for item in json.loads(docs_data.INPUT_ZOTERO.read_text(encoding="utf-8"))
    }
    assert {row["Zotero_Key"] for row in rows} == keys
    assert rows[: len(original)] == original
    new_rows = rows[len(original) :]
    assert new_rows
    for row in new_rows:
        paper = docs_data.parse_llm_row(row, metadata)
        assert paper["title"]
        assert paper["llm"]["assessment_status"] == "unassessed"
        assert paper["llm"]["decision"] == ""
        assert set(paper["llm"]["all_categories"].values()) == {None}
        assert paper["human"] is None


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
    monkeypatch.setattr(
        Path,
        "iterdir",
        lambda directory: iter([directory / "Paper.md", directory / "paper.md"]),
    )

    assert docs_data.resolve_case_preserving_filename(tmp_path, "PAPER.md") is None


def test_published_knowledge_doc_paths_match_exact_disk_names() -> None:
    payload = json.loads(
        (ROOT / "docs" / "data" / "research_vault_v2.json").read_text(encoding="utf-8")
    )
    paper_dir = ROOT / "docs" / "vault" / "Papers"
    available = {path.name for path in paper_dir.iterdir()}
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
        (ROOT / "docs" / "data" / "knowledge_doc_bindings.json").read_text(
            encoding="utf-8"
        )
    )["bindings"]
    manifest = json.loads(
        (ROOT / "docs" / "data" / "fulltext_manifest.json").read_text(encoding="utf-8")
    )
    available = {path.name for path in (ROOT / "docs" / "vault" / "Papers").iterdir()}

    for paper_id, binding in bindings.items():
        assert binding["identity_basis"] == "verified_fulltext_manifest"
        assert manifest[paper_id].get("reason") not in {"ambiguous", "title_mismatch"}
        assert manifest[paper_id]["source_file"] == binding["source_file"]
        assert Path(binding["knowledge_doc"]).name in available


def test_parse_llm_row_rejects_unbound_duplicate_title(
    tmp_path: Path, monkeypatch
) -> None:
    filename = "Intersectionality in Artificial Intelligence- Framing Concerns and Recommendations for Action.md"
    (tmp_path / filename).write_text(
        "---\nsource_file: Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.md\n---\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(docs_data, "VAULT_PAPERS_DIR", str(tmp_path))
    metadata = {
        "BLOCKED": {
            "Title": "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action"
        }
    }

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


def test_parse_llm_row_accepts_matching_verified_source(
    tmp_path: Path, monkeypatch
) -> None:
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


def test_real_mismatched_legacy_documents_fail_closed() -> None:
    metadata = docs_data.corpus_metadata()
    manifest = json.loads(
        (ROOT / "docs/data/fulltext_manifest.json").read_text(encoding="utf-8")
    )
    bindings = json.loads(
        (ROOT / "docs/data/knowledge_doc_bindings.json").read_text(encoding="utf-8")
    )["bindings"]
    registry = json.loads(
        (ROOT / "corpus/work_version_registry.json").read_text(encoding="utf-8")
    )

    for key in ("WTLVG29I", "AXEIVEW3"):
        paper = docs_data.parse_llm_row(
            {"Zotero_Key": key}, metadata, manifest, bindings, registry
        )
        assert paper["knowledge_doc"] is None
        assert (
            "embedded_source_file_mismatch"
            in paper["knowledge_doc_candidate"]["reasons"]
        )


def test_real_verified_legacy_document_keeps_its_link() -> None:
    paper = docs_data.parse_llm_row(
        {"Zotero_Key": "I78CL6R5"},
        docs_data.corpus_metadata(),
        json.loads(
            (ROOT / "docs/data/fulltext_manifest.json").read_text(encoding="utf-8")
        ),
        json.loads(
            (ROOT / "docs/data/knowledge_doc_bindings.json").read_text(encoding="utf-8")
        )["bindings"],
        json.loads(
            (ROOT / "corpus/work_version_registry.json").read_text(encoding="utf-8")
        ),
    )

    assert paper["knowledge_doc"]
    assert "knowledge_doc_candidate" not in paper


def test_conflicting_nested_source_files_fail_closed(
    tmp_path: Path, monkeypatch
) -> None:
    title = "Conflicting source identity"
    filename = docs_data.safe_title(title) + ".md"
    (tmp_path / filename).write_text(
        "---\ntitle: shell\n---\n## Full Text\n---\n"
        "source_file: First.md\nsource_file: Second.md\n---\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(docs_data, "VAULT_PAPERS_DIR", tmp_path)

    paper = docs_data.parse_llm_row(
        {"Zotero_Key": "CONFLICT"},
        {"CONFLICT": {"Title": title}},
        {"CONFLICT": {"src": "clean", "source_file": "First.md"}},
    )

    assert paper["knowledge_doc"] is None
    assert (
        "embedded_source_file_ambiguous" in paper["knowledge_doc_candidate"]["reasons"]
    )


def test_rejected_candidate_survives_repeated_pruning(tmp_path: Path) -> None:
    linked = tmp_path / "Linked.md"
    candidate = tmp_path / "Rejected.md"
    stale = tmp_path / "Stale.md"
    for path in (linked, candidate, stale):
        path.write_text(path.stem, encoding="utf-8")
    papers = [
        {"knowledge_doc": "vault/Papers/Linked.md"},
        {
            "knowledge_doc": None,
            "knowledge_doc_candidate": {
                "path": "vault/Papers/Rejected.md",
                "reasons": ["embedded_source_file_mismatch"],
            },
        },
    ]

    first = docs_data.prune_unreferenced_knowledge_docs(tmp_path, papers)
    second = docs_data.prune_unreferenced_knowledge_docs(tmp_path, papers)

    assert first == [stale]
    assert second == []
    assert candidate.read_text(encoding="utf-8") == "Rejected"
    assert papers[1]["knowledge_doc"] is None


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
        (ROOT / "docs" / "data" / "research_vault_v2.json").read_text(encoding="utf-8")
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


def test_published_records_and_fulltext_manifest_share_exact_version_identity() -> None:
    payload = json.loads(
        (ROOT / "docs" / "data" / "research_vault_v2.json").read_text(encoding="utf-8")
    )
    manifest = json.loads(
        (ROOT / "docs" / "data" / "fulltext_manifest.json").read_text(encoding="utf-8")
    )
    contract = json.loads(
        (ROOT / "docs" / "data" / "work_version_contract.json").read_text(
            encoding="utf-8"
        )
    )
    allowed_types = {item["key"] for item in contract["version_types"]}

    for paper in payload["papers"]:
        source = manifest[paper["id"]]
        assert paper["work_id"].startswith("work:")
        assert paper["version_id"].startswith("version:")
        assert paper["version_type"] in allowed_types
        assert paper["preferred_version_id"].startswith("version:")
        assert paper["latest_version_id"].startswith("version:")
        assert source["work_id"] == paper["work_id"]
        binding = paper.get("source_binding")
        if binding:
            from src.analysis.work_versions import source_binding_for_record

            registry = json.loads(
                (ROOT / "corpus/work_version_registry.json").read_text(encoding="utf-8")
            )
            assert binding == source_binding_for_record(registry, paper["id"], ROOT)
            assert source["version_id"] == binding["source_version_id"]
            assert source["version_type"] == binding["source_version_type"]
            assert source["bibliographic_version_id"] == paper["version_id"]
        else:
            assert source["version_id"] == paper["version_id"]
        assert source["preferred_version_id"] == paper["preferred_version_id"]


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


def test_preparatory_projection_bootstraps_without_a_generated_source_manifest(
    tmp_path, monkeypatch
):
    target = tmp_path / "corpus.json"
    monkeypatch.setattr(
        docs_data, "INPUT_FULLTEXT_MANIFEST", tmp_path / "not-yet-built.json"
    )
    docs_data.main(["--prepare-fulltext", "--output", str(target)])
    data = json.loads(target.read_text(encoding="utf-8"))
    assert data["meta"]["fulltext_projection_state"] == "preparation"
    assert len(data["papers"]) == data["meta"]["total_papers"] > 0
    assert all(paper["work_id"].startswith("work:") for paper in data["papers"])
    with pytest.raises(FileNotFoundError):
        docs_data.main(["--output", str(target)])


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
