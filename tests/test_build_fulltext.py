"""Raw-text resolution of the full-text builder: the first-author-year fallback must
refuse an ambiguous match instead of attaching the first conversion it finds. The
publisher also preserves the previous complete build when a new run fails."""

import importlib.util
import json
import os
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "build_fulltext", ROOT / "src" / "publish" / "build_fulltext.py"
)
bf = importlib.util.module_from_spec(spec)
sys.modules["build_fulltext"] = bf
spec.loader.exec_module(bf)


def _paper(
    author_year: str, kd: str | None = None, title: str = "Pilot study"
) -> dict[str, object]:
    return {"id": "X", "author_year": author_year, "knowledge_doc": kd, "title": title}


def _real_paper(paper_id: str) -> dict[str, object]:
    papers = json.loads(bf.DATA_IN.read_text(encoding="utf-8"))["papers"]
    return next(paper for paper in papers if paper["id"] == paper_id)


@pytest.mark.skipif(os.name != "nt", reason="Windows extended path regression")
def test_long_checkout_retains_embedded_identity_and_manifest_input(
    tmp_path, monkeypatch
):
    from src.file_hashing import canonical_file_bytes, filesystem_path
    from src.publish import build_project

    original = next((ROOT / "docs/vault/Papers").glob("Feministische Netzpolitik*.md"))
    metadata = bf.embedded_source_metadata(original)
    assert metadata.get("title")
    repo = tmp_path / "portable-completion-20260921"
    target = repo / "docs/vault/Papers" / original.name
    while len(str(target)) <= 260:
        repo = repo / "portable-completion-20260921"
        target = repo / "docs/vault/Papers" / original.name
    filesystem_path(target.parent).mkdir(parents=True)
    filesystem_path(target).write_bytes(canonical_file_bytes(original))
    assert bf.embedded_source_metadata(target) == metadata
    monkeypatch.setattr(build_project, "OUTPUTS", ())
    monkeypatch.setattr(build_project, "OUTPUT_DIRS", ())
    assert build_project.snapshot(repo)["inputs"] == {
        target.relative_to(repo).as_posix(): build_project.file_hash(original)
    }
    from src.analysis.knowledge_coverage import build_knowledge_coverage
    from src.publish import build_screening_index

    paper = _real_paper("NUVZI357")
    paper["knowledge_doc"] = target.relative_to(repo / "docs").as_posix()
    data = repo / "docs/data"
    data.mkdir()
    projection = data / "research_vault_v2.json"
    projection.write_text(json.dumps({"papers": [paper]}), encoding="utf-8")
    registry = {"record_index": {paper["id"]: {"work_id": paper["work_id"]}}}
    coverage = build_knowledge_coverage(repo, registry, set())
    assert coverage["counts"]["linked_records"] == 1
    assert coverage["broken_document_links"] == []
    monkeypatch.setattr(build_screening_index, "ROOT", repo)
    monkeypatch.setattr(build_screening_index, "DOCS", repo / "docs")
    monkeypatch.setattr(build_screening_index, "DATA_IN", projection)
    output = data / "fulltext_index.json"
    monkeypatch.setattr(build_screening_index, "INDEX_OUT", output)
    assert build_screening_index.main() == 0
    indexed = json.loads(output.read_text(encoding="utf-8"))["papers"][paper["id"]]
    assert indexed["src"] == "kd"
    assert indexed["x"] == build_screening_index.to_plain(
        canonical_file_bytes(original).decode("utf-8")
    )


@pytest.mark.parametrize("paper_id", ["FTJM5R8N", "4KMMPA6A"])
def test_legacy_match_cannot_borrow_another_registered_work_or_version(paper_id):
    paper = _real_paper(paper_id)
    clean_idx = {bf.norm(path.stem): path.name for path in bf.CLEAN_DIR.glob("*.md")}
    raw_idx = {bf.norm(path.stem): path.name for path in bf.RAW_DIR.glob("*.md")}
    assert bf.resolve_docling(paper, clean_idx, raw_idx) == (None, "mismatch")


def test_exact_governed_version_retains_its_reading_source():
    paper = _real_paper("978AV9KZ")
    path, label = bf.resolve_docling(paper, {}, {})
    assert path == bf.CLEAN_DIR / "FTJM5R8N.md"
    assert label == "clean"


def test_incorrect_survey_title_cannot_match_a_foreign_registered_title():
    paper = _real_paper("SHJQQTI6")
    paper["title"] = (
        "A Survey on Intersectional Fairness in Machine Learning: Opportunities and Challenges"
    )
    source = bf.RAW_DIR / "Gohar_2023_Survey.md"
    assert bf.verified_source(paper, source, "raw") == (None, "mismatch")


def test_curated_source_binding_bootstraps_without_a_displayed_knowledge_document(
    tmp_path, monkeypatch
):
    data = tmp_path / "docs/data"
    data.mkdir(parents=True)
    clean = tmp_path / "clean"
    clean.mkdir()
    source = clean / "Pilot_2026_study.md"
    source.write_text("# Pilot study\n\nStudy text.\n", encoding="utf-8")
    (data / "knowledge_doc_bindings.json").write_text(
        json.dumps({"bindings": {"X": {"source_file": source.name}}}), encoding="utf-8"
    )
    monkeypatch.setattr(bf, "ROOT", tmp_path)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean)
    assert bf.resolve_docling(_paper("Pilot 2026"), {}, {}) == (source, "clean")
    source.write_text(
        "# Unrelated publication about a different question\n", encoding="utf-8"
    )
    assert bf.resolve_docling(_paper("Pilot 2026"), {}, {}) == (None, "mismatch")


@pytest.mark.parametrize("paper_id", ["3GB9B4IJ", "2YS85B49", "BCBWSU3Z"])
def test_corrected_debnath_year_rejects_stale_candidate_version(paper_id):
    paper = _real_paper(paper_id)
    paper.update(year=2025, author_year="A. Debnath (2025)")
    clean_idx = {bf.norm(path.stem): path.name for path in bf.CLEAN_DIR.glob("*.md")}
    raw_idx = {bf.norm(path.stem): path.name for path in bf.RAW_DIR.glob("*.md")}

    assert bf.resolve_docling(paper, clean_idx, raw_idx) == (None, "mismatch")


def test_unique_fallback_resolves(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir = tmp_path / "clean"
    clean_dir.mkdir()
    (clean_dir / "Pilot2026study.md").write_text(
        "# Pilot 2026 study\n", encoding="utf-8"
    )
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    clean_idx = {
        bf.norm("pilot2026study"): "Pilot2026study.md",
        bf.norm("other2025"): "Other2025.md",
    }
    path, src = bf.resolve_docling(
        _paper("Pilot et al. (2026)", title="Pilot 2026 study"), clean_idx, {}
    )
    assert src == "clean"
    assert path.name == "Pilot2026study.md"


def test_ambiguous_fallback_is_refused(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir = tmp_path / "clean"
    clean_dir.mkdir()
    for filename in ("Pilot2026study.md", "Pilot2026other.md"):
        (clean_dir / filename).write_text("# Pilot study\n", encoding="utf-8")
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    clean_idx = {
        bf.norm("pilot2026study"): "Pilot2026study.md",
        bf.norm("pilot2026other"): "Pilot2026other.md",
    }
    path, src = bf.resolve_docling(_paper("Pilot et al. (2026)"), clean_idx, {})
    assert path is None
    assert src == "ambiguous"


def test_normalised_filename_collision_retains_both_real_source_variants(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    real_paper = _real_paper("BHXDU7VM")
    real_source = ROOT / str(real_paper["source_binding"]["source_path"])
    clean_dir = tmp_path / "clean"
    clean_dir.mkdir()
    first = clean_dir / "Chatterji_2025_How_People_Use_ChatGPT.md"
    second = clean_dir / "Chatterji-2025-How-People-Use-ChatGPT.md"
    for target in (first, second):
        target.write_bytes(real_source.read_bytes())
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    paper = {
        "id": "collision-fixture",
        "title": real_paper["title"],
        "author_year": real_paper["author_year"],
        "authors": real_paper["authors"],
        "year": real_paper["year"],
    }

    clean_idx = bf.filename_index(list(clean_dir.glob("*.md")))
    path, source = bf.resolve_docling(paper, clean_idx, {}, {}, {})

    assert clean_idx[bf.norm(first.stem)] == tuple(sorted((first.name, second.name)))
    assert (path, source) == (None, "ambiguous")


def test_ambiguous_clean_does_not_fall_through_to_raw(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir = tmp_path / "clean"
    raw_dir = tmp_path / "raw"
    clean_dir.mkdir()
    raw_dir.mkdir()
    for filename in ("a.md", "b.md"):
        (clean_dir / filename).write_text("# Pilot study\n", encoding="utf-8")
    (raw_dir / "c.md").write_text("# Pilot study\n", encoding="utf-8")
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)
    clean_idx = {bf.norm("pilot2026a"): "a.md", bf.norm("pilot2026b"): "b.md"}
    raw_idx = {bf.norm("pilot2026c"): "c.md"}
    path, src = bf.resolve_docling(_paper("Pilot et al. (2026)"), clean_idx, raw_idx)
    assert (path, src) == (None, "ambiguous")


def test_same_author_year_is_resolved_by_unique_exact_title(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir = tmp_path / "generated" / "markdown_clean"
    clean_dir.mkdir(parents=True)
    exact = clean_dir / "Pilot_2026_Target.md"
    exact.write_text(
        "# Target framework for accountable AI\n\nPaper body.\n", encoding="utf-8"
    )
    related = clean_dir / "Pilot_2026_Related.md"
    related.write_text("# Accountable AI\n\nRelated body.\n", encoding="utf-8")
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    clean_idx = {
        bf.norm("pilot2026target"): exact.name,
        bf.norm("pilot2026related"): related.name,
    }

    path, src = bf.resolve_docling(
        _paper("Pilot (2026)", title="Target framework for accountable AI"),
        clean_idx,
        {},
    )

    assert path == exact
    assert src == "clean"


def test_same_author_year_with_equally_plausible_titles_stays_ambiguous(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir = tmp_path / "generated" / "markdown_clean"
    clean_dir.mkdir(parents=True)
    first = clean_dir / "Pilot_2026_First.md"
    second = clean_dir / "Pilot_2026_Second.md"
    first.write_text("# Accountable AI framework\n", encoding="utf-8")
    second.write_text("# Accountable AI framework\n", encoding="utf-8")
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    clean_idx = {
        bf.norm("pilot2026first"): first.name,
        bf.norm("pilot2026second"): second.name,
    }

    path, src = bf.resolve_docling(
        _paper("Pilot (2026)", title="Accountable AI framework"), clean_idx, {}
    )

    assert path is None
    assert src == "ambiguous"


def test_no_match_stays_none() -> None:
    path, src = bf.resolve_docling(
        _paper("Nobody (1999)"), {bf.norm("pilot2026"): "p.md"}, {}
    )
    assert (path, src) == (None, None)


def test_short_key_never_fallback_matches() -> None:
    # a key of five characters or fewer is too unspecific for the prefix join
    path, src = bf.resolve_docling(
        _paper("X (2024)"), {bf.norm("x2024paper"): "p.md"}, {}
    )
    assert (path, src) == (None, None)


def test_explicit_source_with_foreign_title_is_refused(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    docs = tmp_path / "docs"
    clean_dir = tmp_path / "generated" / "markdown_clean"
    raw_dir = tmp_path / "generated" / "markdown"
    (docs / "vault" / "Papers").mkdir(parents=True)
    clean_dir.mkdir(parents=True)
    raw_dir.mkdir(parents=True)
    knowledge_doc = docs / "vault" / "Papers" / "Expected.md"
    knowledge_doc.write_text(
        "## Full Text\n\n---\ntitle: Foreign article\nsource_file: Foreign.md\n---\n",
        encoding="utf-8",
    )
    (clean_dir / "Foreign.md").write_text(
        "## Foreign article\n\nUnrelated body.\n", encoding="utf-8"
    )
    monkeypatch.setattr(bf, "DOCS", docs)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)

    path, src = bf.resolve_docling(
        _paper("Expected (2024)", "vault/Papers/Expected.md", "Expected article"),
        {},
        {},
    )

    assert path is None
    assert src == "mismatch"


def test_generic_headings_are_not_title_candidates(tmp_path: Path) -> None:
    source = tmp_path / "Target.md"
    source.write_text(
        "## OPEN ACCESS\n\n"
        "## *CORRESPONDENCE\n\n"
        "## CITATION\n\n"
        "## COPYRIGHT\n\n"
        "## Target framework for accountable AI\n",
        encoding="utf-8",
    )

    assert bf.source_titles(source) == ["Target framework for accountable AI"]


def test_identical_title_with_doi_author_and_year_conflicts_is_refused() -> None:
    paper = _real_paper("JZ4P8V8S")
    knowledge_doc = bf.DOCS / str(paper["knowledge_doc_candidate"]["path"])
    metadata = bf.embedded_source_metadata(knowledge_doc)
    source = bf.CLEAN_DIR / str(metadata["source_file"])

    assert set(bf.identity_conflicts(paper, source, metadata)) == {
        "doi",
        "year",
        "author",
    }
    assert bf.verified_source(paper, source, "clean", metadata) == (None, "mismatch")


def test_filename_does_not_override_a_different_substantive_title() -> None:
    paper = _real_paper("4LY3SA4E")
    knowledge_doc = bf.DOCS / str(paper["knowledge_doc_candidate"]["path"])
    metadata = bf.embedded_source_metadata(knowledge_doc)
    source = bf.CLEAN_DIR / str(metadata["source_file"])

    assert bf.titles_match(str(paper["title"]), [bf.filename_title(source)])
    assert not bf.titles_corroborate(str(paper["title"]), bf.source_titles(source))
    assert bf.verified_source(paper, source, "clean", metadata) == (None, "mismatch")


def test_corrected_publication_title_matches_verified_source() -> None:
    paper = _real_paper("T8R8RKX9")
    knowledge_doc = bf.DOCS / str(paper["knowledge_doc"])
    metadata = bf.embedded_source_metadata(knowledge_doc)
    source = bf.CLEAN_DIR / str(metadata["source_file"])

    assert bf.titles_match(str(paper["title"]), bf.source_titles(source))
    assert bf.titles_corroborate(str(paper["title"]), bf.source_titles(source))
    assert bf.verified_source(paper, source, "clean", metadata) == (source, "clean")


def test_rejected_knowledge_candidate_can_supply_verified_xiyx5hjs_source() -> None:
    paper = _real_paper("XIYX5HJS").copy()
    # Reproduce the preparation pass before the current full-text manifest exists.
    candidate = paper.get("knowledge_doc") or paper["knowledge_doc_candidate"]["path"]
    paper["knowledge_doc"] = None
    paper["knowledge_doc_candidate"] = {"path": candidate}
    clean_idx = {bf.norm(path.stem): path.name for path in bf.CLEAN_DIR.glob("*.md")}
    raw_idx = {bf.norm(path.stem): path.name for path in bf.RAW_DIR.glob("*.md")}

    path, source = bf.resolve_docling(paper, clean_idx, raw_idx)

    assert source == "clean"
    assert path is not None
    assert path.name == (
        "Ricaurte Quijano_2024_Towards_Substantive_Equality_in_Artificial.md"
    )


@pytest.mark.parametrize("paper_id", ["WTLVG29I", "AXEIVEW3"])
def test_foreign_rejected_candidate_cannot_supply_source(paper_id: str) -> None:
    paper = _real_paper(paper_id).copy()
    paper["knowledge_doc"] = None

    assert bf.resolve_docling(paper, {}, {}) == (None, "mismatch")


def test_embedded_source_rejects_parent_path(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    docs = tmp_path / "docs"
    candidate = docs / "vault" / "Candidate.md"
    candidate.parent.mkdir(parents=True)
    candidate.write_text(
        "## Full Text\n\n---\nsource_file: ../Foreign.md\n---\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(bf, "DOCS", docs)
    paper = _paper("Pilot (2026)")
    paper["knowledge_doc_candidate"] = {"path": "vault/Candidate.md"}

    with pytest.raises(ValueError, match="local source file"):
        bf.resolve_docling(paper, {}, {})


@pytest.mark.parametrize(
    ("paper_id", "source"),
    [
        ("P4YQIKJX", "clean"),
        ("A2P8MXMY", "clean"),
        ("BHXDU7VM", "clean"),
        ("QUV5DQH3", "clean"),
        ("3ZNMTJ5B", "raw"),
        ("8MRNK6FX", "raw"),
        ("SSF5Q33W", "raw"),
        ("EQV4DNQR", "raw"),
        ("J5EF9W6M", "raw"),
        ("NSI6S5QE", "clean"),
        ("VSZM7CT6", "clean"),
        ("7FEFMCBZ", "clean"),
        ("R7V99ERA", "clean"),
        ("4ZL5Q48E", "clean"),
        ("J7V3AAQT", "clean"),
        ("8NG4ZEWE", "clean"),
    ],
)
def test_curated_source_repairs_resolve_exact_records(
    paper_id: str, source: str
) -> None:
    path, label = bf.curated_source(_real_paper(paper_id))

    assert path is not None and path.exists()
    assert label == source


def test_same_title_does_not_bridge_different_un_women_work() -> None:
    paper = _real_paper("5T55I5Z7")
    source = (
        bf.CLEAN_DIR / "UN Women_2024_Artificial_Intelligence_and_gender_equality.md"
    )

    assert bf.identity_conflicts(paper, source) == []
    assert paper["year"] == 2020
    assert "5T55I5Z7" not in bf.CURATED_SOURCE_OVERRIDES


@pytest.mark.parametrize("paper_id", ["KI9GRGHB", "ZQHP5G35", "LR8Z3YHP"])
def test_batch_a_unresolved_records_remain_fail_closed(paper_id: str) -> None:
    paper = _real_paper(paper_id)
    clean_idx = {bf.norm(path.stem): path.name for path in bf.CLEAN_DIR.glob("*.md")}
    raw_idx = {bf.norm(path.stem): path.name for path in bf.RAW_DIR.glob("*.md")}

    assert paper_id not in bf.CURATED_SOURCE_OVERRIDES
    assert bf.resolve_docling(paper, clean_idx, raw_idx) == (None, None)


@pytest.mark.parametrize("paper_id", ["5T55I5Z7", "XG7RFFC7"])
def test_batch_c_conflicts_remain_unbound(paper_id: str) -> None:
    paper = _real_paper(paper_id)
    clean_idx = {bf.norm(path.stem): path.name for path in bf.CLEAN_DIR.glob("*.md")}
    raw_idx = {bf.norm(path.stem): path.name for path in bf.RAW_DIR.glob("*.md")}

    assert paper_id not in bf.CURATED_SOURCE_OVERRIDES
    assert bf.resolve_docling(paper, clean_idx, raw_idx) == (None, None)


def test_truncated_source_title_with_shared_content_words_is_accepted(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    docs = tmp_path / "docs"
    clean_dir = tmp_path / "generated" / "markdown_clean"
    raw_dir = tmp_path / "generated" / "markdown"
    (docs / "vault" / "Papers").mkdir(parents=True)
    clean_dir.mkdir(parents=True)
    raw_dir.mkdir(parents=True)
    knowledge_doc = docs / "vault" / "Papers" / "Expected.md"
    knowledge_doc.write_text(
        "## Full Text\n\n---\nsource_file: Pilot_2026_Responsible_AI_framework.md\n---\n",
        encoding="utf-8",
    )
    source = clean_dir / "Pilot_2026_Responsible_AI_framework.md"
    source.write_text(
        "## Responsible AI framework for social innovation\n\nBody.\n", encoding="utf-8"
    )
    monkeypatch.setattr(bf, "DOCS", docs)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)

    path, src = bf.resolve_docling(
        _paper(
            "Pilot (2026)",
            "vault/Papers/Expected.md",
            "A responsible AI framework for social innovation and public services",
        ),
        {},
        {},
    )

    assert path == source
    assert src == "clean"


def test_same_author_year_with_another_title_is_refused(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    docs = tmp_path / "docs"
    clean_dir = tmp_path / "generated" / "markdown_clean"
    raw_dir = tmp_path / "generated" / "markdown"
    (docs / "vault" / "Papers").mkdir(parents=True)
    clean_dir.mkdir(parents=True)
    raw_dir.mkdir(parents=True)
    knowledge_doc = docs / "vault" / "Papers" / "Expected.md"
    knowledge_doc.write_text(
        "## Full Text\n\n---\nsource_file: Pilot_2026_AI_for_decision_support.md\n---\n",
        encoding="utf-8",
    )
    (clean_dir / "Pilot_2026_AI_for_decision_support.md").write_text(
        "## AI for decision support in public administration\n\nBody.\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(bf, "DOCS", docs)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)

    path, src = bf.resolve_docling(
        _paper(
            "Pilot (2026)",
            "vault/Papers/Expected.md",
            "Classification systems in social work diagnosis",
        ),
        {},
        {},
    )

    assert path is None
    assert src == "mismatch"


def test_real_ulnicane_titles_do_not_cross_match() -> None:
    wrong = (
        ROOT
        / "generated"
        / "markdown_clean"
        / "Ulnicane_2024_Artificial_Intelligence_and_Intersectionality.md"
    )

    assert not bf.titles_match(
        "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action",
        bf.source_titles(wrong),
    )


def test_explicit_mismatch_can_fall_back_to_one_verified_same_author_source(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    docs = tmp_path / "docs"
    clean_dir = tmp_path / "generated" / "markdown_clean"
    raw_dir = tmp_path / "generated" / "markdown"
    (docs / "vault").mkdir(parents=True)
    clean_dir.mkdir(parents=True)
    raw_dir.mkdir(parents=True)
    knowledge_doc = docs / "vault" / "Expected.md"
    knowledge_doc.write_text(
        "---\nsource_file: Pilot_2026_Wrong.md\n---\n", encoding="utf-8"
    )
    wrong = clean_dir / "Pilot_2026_Wrong.md"
    wrong.write_text("# Another paper about AI\n", encoding="utf-8")
    correct = clean_dir / "Pilot_2026_Correct.md"
    correct.write_text("# Accountable AI in social services\n", encoding="utf-8")
    monkeypatch.setattr(bf, "DOCS", docs)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)
    clean_idx = {
        bf.norm("Pilot_2026_Wrong"): wrong.name,
        bf.norm("Pilot_2026_Correct"): correct.name,
    }

    path, src = bf.resolve_docling(
        _paper(
            "Pilot (2026)", "vault/Expected.md", "Accountable AI in social services"
        ),
        clean_idx,
        {},
    )

    assert path == correct
    assert src == "clean"


def _configure_build(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> tuple[Path, Path, Path]:
    docs = tmp_path / "docs"
    clean_dir = tmp_path / "generated" / "markdown_clean"
    raw_dir = tmp_path / "generated" / "markdown"
    out_dir = docs / "data" / "fulltext"
    manifest = docs / "data" / "fulltext_manifest.json"
    data_in = docs / "data" / "research_vault_v2.json"
    clean_dir.mkdir(parents=True)
    raw_dir.mkdir(parents=True)
    out_dir.mkdir(parents=True)
    monkeypatch.setattr(bf, "ROOT", tmp_path)
    monkeypatch.setattr(bf, "DOCS", docs)
    monkeypatch.setattr(bf, "DATA_IN", data_in)
    monkeypatch.setattr(bf, "CLEAN_DIR", clean_dir)
    monkeypatch.setattr(bf, "RAW_DIR", raw_dir)
    monkeypatch.setattr(bf, "OUT_DIR", out_dir)
    monkeypatch.setattr(bf, "MANIFEST", manifest)
    return clean_dir, out_dir, manifest


def test_main_publishes_assets_and_manifest_as_one_build(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir, out_dir, manifest = _configure_build(tmp_path, monkeypatch)
    (bf.DATA_IN).write_text(
        json.dumps(
            {
                "papers": [
                    {
                        "id": "X",
                        "title": "Fresh",
                        "author_year": "Pilot (2026)",
                        "work_id": "work:test",
                        "version_id": "version:test",
                        "version_type": "version_of_record",
                        "preferred_version_id": "version:test",
                        "is_preferred_version": True,
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    (clean_dir / "Pilot_2026_Study.md").write_text(
        "# Fresh\n\nBody\n", encoding="utf-8"
    )
    (out_dir / "OLD.md").write_text("old", encoding="utf-8")
    manifest.write_text('{"OLD":{"src":"clean"}}', encoding="utf-8")

    assert bf.main() == 0
    assert sorted(path.name for path in out_dir.glob("*.md")) == ["X.md"]
    published = json.loads(manifest.read_text(encoding="utf-8"))["X"]
    assert published["src"] == "clean"
    assert published["work_id"] == "work:test"
    assert published["version_id"] == "version:test"


def test_main_loads_fresh_resolution_context_once_per_invocation(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    papers = [_real_paper(paper_id) for paper_id in ("ZLMLP53P", "T8R8RKX9")]
    registry = json.loads(
        (ROOT / "corpus/work_version_registry.json").read_text(encoding="utf-8")
    )
    knowledge_bindings = json.loads(
        (ROOT / "docs/data/knowledge_doc_bindings.json").read_text(encoding="utf-8")
    )
    _configure_build(tmp_path, monkeypatch)
    bf.DATA_IN.write_text(
        json.dumps({"papers": papers}),
        encoding="utf-8",
    )
    corpus = tmp_path / "corpus"
    corpus.mkdir()
    registry_path = corpus / "work_version_registry.json"
    bindings_path = tmp_path / "docs/data/knowledge_doc_bindings.json"
    observed: list[tuple[bool, bool]] = []
    loads = 0
    real_loader = bf.load_resolution_context

    def count_loads() -> tuple[dict[str, object], dict[str, object]]:
        nonlocal loads
        loads += 1
        return real_loader()

    def capture_context(
        paper: dict[str, object],
        clean_idx: dict[str, tuple[str, ...]],
        raw_idx: dict[str, tuple[str, ...]],
        registry: dict[str, object],
        knowledge_bindings: dict[str, object],
    ) -> tuple[None, None]:
        paper_id = paper["id"]
        observed.append(
            (
                paper_id in registry.get("record_index", {}),
                paper_id in knowledge_bindings,
            )
        )
        return None, None

    monkeypatch.setattr(bf, "load_resolution_context", count_loads)
    monkeypatch.setattr(bf, "resolve_docling", capture_context)
    registry_path.write_text(json.dumps(registry), encoding="utf-8")
    bindings_path.write_text(json.dumps(knowledge_bindings), encoding="utf-8")
    assert bf.main() == 0

    registry_path.write_text(json.dumps({"record_index": {}}), encoding="utf-8")
    bindings_path.write_text(json.dumps({"bindings": {}}), encoding="utf-8")
    assert bf.main() == 0

    assert loads == 2
    assert observed == [(True, True), (True, True), (False, False), (False, False)]


def test_main_preserves_previous_build_when_generation_fails(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    clean_dir, out_dir, manifest = _configure_build(tmp_path, monkeypatch)
    bf.DATA_IN.write_text(
        json.dumps(
            {"papers": [{"id": "X", "title": "Fresh", "author_year": "Pilot (2026)"}]}
        ),
        encoding="utf-8",
    )
    (clean_dir / "Pilot_2026_Study.md").write_text(
        "# Fresh\n\nBody\n", encoding="utf-8"
    )
    old_body = "previous complete body\n"
    old_manifest = '{"OLD":{"src":"clean","chars":23}}'
    (out_dir / "OLD.md").write_text(old_body, encoding="utf-8")
    manifest.write_text(old_manifest, encoding="utf-8")

    def fail_clean(_text: str) -> str:
        raise RuntimeError("injected failure")

    monkeypatch.setattr(bf, "clean", fail_clean)

    with pytest.raises(RuntimeError, match="injected failure"):
        bf.main()

    assert (out_dir / "OLD.md").read_text(encoding="utf-8") == old_body
    assert sorted(path.name for path in out_dir.glob("*.md")) == ["OLD.md"]
    assert manifest.read_text(encoding="utf-8") == old_manifest


@pytest.mark.parametrize("failure_target", ["assets", "manifest"])
def test_publish_rollback_restores_previous_complete_build(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, failure_target: str
) -> None:
    out_dir = tmp_path / "docs" / "data" / "fulltext"
    manifest = tmp_path / "docs" / "data" / "fulltext_manifest.json"
    stage_root = tmp_path / "stage"
    stage_assets = stage_root / "fulltext"
    stage_manifest = stage_root / "fulltext_manifest.json"
    out_dir.mkdir(parents=True)
    stage_assets.mkdir(parents=True)
    (out_dir / "OLD.md").write_text("old\n", encoding="utf-8")
    manifest.write_text('{"OLD":{"src":"clean"}}', encoding="utf-8")
    (stage_assets / "NEW.md").write_text("new\n", encoding="utf-8")
    stage_manifest.write_text('{"NEW":{"src":"clean"}}', encoding="utf-8")
    monkeypatch.setattr(bf, "OUT_DIR", out_dir)
    monkeypatch.setattr(bf, "MANIFEST", manifest)
    original_replace = Path.replace

    def injected_replace(source: Path, target: Path) -> Path:
        if failure_target == "assets" and source == stage_assets:
            raise OSError("injected asset install failure")
        if failure_target == "manifest" and source == stage_manifest:
            raise OSError("injected manifest install failure")
        return original_replace(source, target)

    monkeypatch.setattr(Path, "replace", injected_replace)

    with pytest.raises(OSError, match="injected"):
        bf._publish_staged(stage_assets, stage_manifest)

    assert (out_dir / "OLD.md").read_text(encoding="utf-8") == "old\n"
    assert not (out_dir / "NEW.md").exists()
    assert manifest.read_text(encoding="utf-8") == '{"OLD":{"src":"clean"}}'
