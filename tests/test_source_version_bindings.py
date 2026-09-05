"""A reviewed manuscript is an exact source, not a replacement bibliography."""
from copy import deepcopy
import json

import pytest

from src.analysis.build_work_version_registry import apply_source_bindings, build_registry, REPO
from src.analysis.work_versions import load_contract, normalise_arxiv, source_binding_for_record, validate_registry
from src.assess.artifact_verification import artifact_hash, record_hash, validated_reviews, reviewed_screening_projection
from src.publish import build_fulltext, generate_docs_data, generate_literature_landscape


def source_fixture(tmp_path):
    (tmp_path / "corpus").mkdir()
    (tmp_path / "source.md").write_text("# Example work\nAccepted Manuscript\nthis paper explores AI fairness and social work education.\n", encoding="utf-8")
    vor = {"version_id": "version:vor", "title": "Example work", "version_type": "version_of_record", "version_date": "2022", "identifiers": {"doi": ["10.1/example"], "zotero_key": ["P1"]}, "peer_review_status": "peer_reviewed", "peer_review_basis": "source_metadata", "integrity_status": "current", "relations": []}
    registry = {"schema": "femprompt-work-version-registry/0.1", "works": [{"work_id": "work:one", "versions": [vor], "preferred_version_id": "version:vor", "latest_version_id": "version:vor"}], "record_index": {"P1": {"work_id": "work:one", "version_id": "version:vor"}}, "identifier_index": {"doi:10.1/example": {"work_id": "work:one", "version_id": "version:vor"}}, "ambiguous_identifiers": {}}
    binding = {"record_id": "P1", "work_id": "work:one", "bibliographic_version_id": "version:vor", "source_version_id": "version:am", "source_version_type": "accepted_manuscript", "preferred_version_id": "version:vor", "is_preferred_version": False, "source_path": "source.md", "source_sha256": artifact_hash(tmp_path, "source.md")}
    am = {**deepcopy(vor), "version_id": "version:am", "version_type": "accepted_manuscript", "version_date": "2021", "identifiers": {"url": ["https://repository.test/manuscript"]}, "relations": [{"type": "isVersionOf", "target_version_id": "version:vor"}]}
    entry = {"binding": binding, "version": am, "bibliographic_identity": {"title": "Example work", "doi": "10.1/example"}, "agent_id": "agent", "model": "test", "reviewed_at": "2026-09-05T12:00:00Z", "reason": "The repository cover explicitly identifies this manuscript of this published work.", "evidence": [{"source_path": "source.md", "sha256": binding["source_sha256"], "locator": "cover", "quote": "Accepted Manuscript"}]}
    manifest = {"schema": "femprompt-source-version-bindings/0.1", "records": {"P1": entry}}
    (tmp_path / "corpus/source_version_bindings.json").write_text(json.dumps(manifest), encoding="utf-8")
    return registry, manifest, binding


def registered_source(tmp_path):
    registry, manifest, binding = source_fixture(tmp_path)
    apply_source_bindings(tmp_path, registry, load_contract())
    (tmp_path / "corpus/work_version_registry.json").write_text(json.dumps(registry), encoding="utf-8")
    return registry, binding


def test_screening_queue_accepts_bound_manuscript_and_rejects_wrong_served_version(tmp_path):
    from src.analysis.build_agent_screening_queue import build_queue

    registry, binding = registered_source(tmp_path)
    data = tmp_path / "docs/data"
    (data / "fulltext").mkdir(parents=True)
    (data / "fulltext/P1.md").write_bytes((tmp_path / "source.md").read_bytes())
    paper = {"id": "P1", "work_id": "work:one", "version_id": "version:vor",
             "preferred_version_id": "version:vor", "is_preferred_version": True,
             "title": "Example work", "author_year": "Author 2022", "source_binding": binding}
    (data / "research_vault_v2.json").write_text(json.dumps({"papers": [paper]}), encoding="utf-8")
    source = {"P1": {"src": "clean", "chars": 100, "version_id": "version:am", "work_id": "work:one"}}
    (data / "fulltext_manifest.json").write_text(json.dumps(source), encoding="utf-8")
    queue = build_queue(tmp_path)
    assert queue["counts"]["ready_works"] == 1
    assert queue["queue"][0]["selected_version_id"] == "version:am"
    assert queue["queue"][0]["preferred_version_id"] == "version:vor"
    assert not queue["queue"][0]["selected_version_is_preferred"]
    assert "sha256:" + queue["sources"]["work_version_registry_sha256"] == artifact_hash(tmp_path, "corpus/work_version_registry.json")
    source["P1"]["version_id"] = "version:vor"
    (data / "fulltext_manifest.json").write_text(json.dumps(source), encoding="utf-8")
    assert build_queue(tmp_path)["counts"]["ready_works"] == 0
    assert "paper_source_version_mismatch" in build_queue(tmp_path)["queue"][0]["blockers"]


@pytest.mark.parametrize("schema", ["0.1", "0.2"])
def test_manuscript_addition_preserves_record_and_preferred_bibliography(tmp_path, schema):
    registry, manifest, binding = source_fixture(tmp_path)
    manifest["schema"] = "femprompt-source-version-bindings/" + schema
    write_source_manifest(tmp_path, manifest)
    before = deepcopy(registry["record_index"])
    apply_source_bindings(tmp_path, registry, load_contract())
    validate_registry(registry, load_contract())
    assert registry["record_index"] == before
    assert registry["works"][0]["preferred_version_id"] == "version:vor"
    assert registry["identifier_index"]["doi:10.1/example"]["version_id"] == "version:vor"
    assert registry["identifier_index"]["url:https://repository.test/manuscript"]["version_id"] == "version:am"
    assert source_binding_for_record(registry, "P1", tmp_path) == binding
    (tmp_path / "source.md").write_text("Changed source", encoding="utf-8")
    with pytest.raises(ValueError, match="stale source binding"):
        source_binding_for_record(registry, "P1", tmp_path)


@pytest.mark.parametrize("problem", ["foreign_work", "wrong_bibliography", "doi_on_manuscript", "uncorrected_identity", "bad_quote", "naive_timestamp", "invalid_timestamp"])
def test_source_manifest_rejects_conflicting_identity_or_evidence(tmp_path, problem):
    registry, manifest, _ = source_fixture(tmp_path)
    entry = manifest["records"]["P1"]
    if problem == "foreign_work":
        entry["binding"]["work_id"] = "work:foreign"
    elif problem == "wrong_bibliography":
        entry["binding"]["bibliographic_version_id"] = "version:foreign"
    elif problem == "doi_on_manuscript":
        entry["version"]["identifiers"]["doi"] = ["10.1/example"]
    elif problem == "uncorrected_identity":
        entry["bibliographic_identity"]["doi"] = "10.1/wrong"
    elif problem == "naive_timestamp":
        entry["reviewed_at"] = "2026-09-05T12:00:00"
    elif problem == "invalid_timestamp":
        entry["reviewed_at"] = "someday"
    else:
        entry["evidence"][0]["quote"] = "Invented declaration"
    (tmp_path / "corpus/source_version_bindings.json").write_text(json.dumps(manifest), encoding="utf-8")
    with pytest.raises(ValueError):
        apply_source_bindings(tmp_path, registry, load_contract())


def existing_source_fixture(tmp_path, *, arxiv=True):
    registry, _, binding = source_fixture(tmp_path)
    version = registry["works"][0]["versions"][0]
    doi = "10.48550/arxiv.2305.12345" if arxiv else "10.1234/example"
    version["identifiers"] = {"doi": [doi], "zotero_key": ["P1"]}
    version["version_type"] = "preprint" if arxiv else "version_of_record"
    if arxiv:
        version["identifiers"]["url"] = ["https://arxiv.org/abs/2305.12345v2"]
        version["landing_url"] = "https://arxiv.org/abs/2305.12345v2"
    registry["identifier_index"] = {"doi:" + doi: deepcopy(registry["record_index"]["P1"])}
    version_identity = {"title": "Example work", **({"arxiv": "2305.12345v2"} if arxiv else {"doi": doi})}
    quote = "Example work\narXiv:2305.12345v2 [cs.AI]" if arxiv else "Example work\nDOI: 10.1234/example"
    (tmp_path / "source.md").write_text(quote + "\nReviewed original full text.\n", encoding="utf-8")
    binding.update(source_version_id="version:vor", source_version_type=version["version_type"],
                   is_preferred_version=True, source_sha256=artifact_hash(tmp_path, "source.md"))
    entry = {"binding_mode": "existing_version", "binding": binding,
             "bibliographic_identity": {"title": "Example work", "doi": doi},
             "version_identity": version_identity, "agent_id": "source-qc-agent", "model": "test",
             "reviewed_at": "2026-09-05T12:00:00Z", "reason": "Title and exact version checked in the primary source.",
             "evidence": [{"source_path": "source.md", "sha256": binding["source_sha256"], "locator": "title and identifier on first page", "quote": quote}]}
    manifest = {"schema": "femprompt-source-version-bindings/0.2", "records": {"P1": entry}}
    write_source_manifest(tmp_path, manifest)
    return registry, manifest, binding


def write_source_manifest(repo, manifest):
    (repo / "corpus/source_version_bindings.json").write_text(json.dumps(manifest), encoding="utf-8")


@pytest.mark.parametrize("arxiv", [True, False])
def test_existing_source_binding_changes_only_source_index(tmp_path, arxiv):
    registry, manifest, binding = existing_source_fixture(tmp_path, arxiv=arxiv)
    before = deepcopy(registry)
    inputs = apply_source_bindings(tmp_path, registry, load_contract())
    validate_registry(registry, load_contract())
    assert {key: value for key, value in registry.items() if key != "source_index"} == before
    expected = {**binding, "binding_mode": "existing_version",
                "bibliographic_identity": manifest["records"]["P1"]["bibliographic_identity"],
                "version_identity": manifest["records"]["P1"]["version_identity"]}
    assert source_binding_for_record(registry, "P1", tmp_path) == expected
    assert set(inputs) == {tmp_path / "corpus/source_version_bindings.json", tmp_path / "source.md"}
    # Repeat the overlay without adding versions, aliases, relations or provenance
    # to the already registered version object.
    once = deepcopy(registry)
    apply_source_bindings(tmp_path, registry, load_contract())
    assert registry == once


@pytest.mark.parametrize("registered_location", ["arxiv_id", "pdf_url"])
def test_existing_arxiv_binding_accepts_exact_identifier_without_doi(tmp_path, registered_location):
    registry, manifest, _ = existing_source_fixture(tmp_path)
    version = registry["works"][0]["versions"][0]
    version["identifiers"] = ({"arxiv": ["2305.12345v2"]} if registered_location == "arxiv_id"
                              else {"url": ["https://arxiv.org/pdf/2305.12345v2.pdf"]})
    version.pop("landing_url")
    manifest["records"]["P1"]["bibliographic_identity"] = {"title": "Example work", "arxiv": "2305.12345v2"}
    write_source_manifest(tmp_path, manifest)
    apply_source_bindings(tmp_path, registry, load_contract())
    assert source_binding_for_record(registry, "P1", tmp_path)["version_identity"]["arxiv"] == "2305.12345v2"


@pytest.mark.parametrize("problem", [
    "old_manifest", "unknown_mode", "new_version_metadata", "extra_entry_metadata", "extra_binding_metadata", "extra_identity_metadata",
    "foreign_work", "foreign_bibliography", "foreign_version", "same_work_other_version", "wrong_type", "wrong_preferred", "wrong_preferred_flag",
    "wrong_title", "wrong_doi", "no_identity", "wrong_revision", "foreign_arxiv", "unpinned_arxiv", "arxiv_doi_only",
    "registry_unpinned", "registry_conflicting_revisions", "registry_conflicting_arxiv_id", "registry_malformed_arxiv", "registry_malformed_url",
    "missing_agent", "missing_model", "naive_timestamp", "bad_timestamp", "missing_reason",
    "stale_source", "stale_evidence", "missing_locator", "missing_evidence", "invented_quote", "missing_title_quote", "missing_revision_quote",
    "other_source_only", "unpinned_evidence_url", "wrong_evidence_revision", "malformed_evidence_url", "versionless_doi_url",
])
def test_existing_binding_rejects_identity_drift_and_unreviewed_sources(tmp_path, problem):
    registry, manifest, binding = existing_source_fixture(tmp_path)
    entry = manifest["records"]["P1"]
    version = registry["works"][0]["versions"][0]
    if problem == "old_manifest":
        manifest["schema"] = "femprompt-source-version-bindings/0.1"
    elif problem == "unknown_mode":
        entry["binding_mode"] = "trust_source"
    elif problem == "new_version_metadata":
        entry["version"] = deepcopy(version)
    elif problem == "extra_entry_metadata":
        entry["version_date"] = "2026"
    elif problem == "extra_binding_metadata":
        binding["identifiers"] = {"arxiv": ["2305.12345v2"]}
    elif problem == "extra_identity_metadata":
        entry["version_identity"]["version_type"] = "version_of_record"
    elif problem == "foreign_work":
        binding["work_id"] = "work:foreign"
    elif problem == "foreign_bibliography":
        binding["bibliographic_version_id"] = "version:foreign"
    elif problem == "foreign_version":
        binding["source_version_id"] = "version:foreign"
    elif problem == "same_work_other_version":
        other = deepcopy(version)
        other.update(version_id="version:other", version_date="2021", identifiers={"arxiv": ["2305.12345v1"]})
        registry["works"][0]["versions"].append(other)
        binding.update(source_version_id="version:other", is_preferred_version=False)
    elif problem == "wrong_type":
        binding["source_version_type"] = "version_of_record"
    elif problem == "wrong_preferred":
        binding["preferred_version_id"] = "version:wrong"
    elif problem == "wrong_preferred_flag":
        binding["is_preferred_version"] = False
    elif problem == "wrong_title":
        entry["version_identity"]["title"] = "Different work"
    elif problem == "wrong_doi":
        entry["bibliographic_identity"]["doi"] = "10.1234/wrong"
    elif problem == "no_identity":
        entry.pop("version_identity")
    elif problem == "wrong_revision":
        entry["version_identity"]["arxiv"] = "2305.12345v1"
    elif problem == "foreign_arxiv":
        entry["version_identity"]["arxiv"] = "2305.99999v2"
    elif problem == "unpinned_arxiv":
        entry["version_identity"]["arxiv"] = "2305.12345"
    elif problem == "arxiv_doi_only":
        entry["version_identity"] = deepcopy(entry["bibliographic_identity"])
    elif problem == "registry_unpinned":
        version["identifiers"]["url"] = ["https://arxiv.org/abs/2305.12345"]
        version["landing_url"] = "https://arxiv.org/abs/2305.12345"
    elif problem == "registry_conflicting_revisions":
        version["fulltext_url"] = "https://arxiv.org/pdf/2305.12345v3"
    elif problem == "registry_conflicting_arxiv_id":
        version["identifiers"]["arxiv"] = ["2305.99999v2"]
    elif problem == "registry_malformed_arxiv":
        version["identifiers"]["arxiv"] = ["2305.12345vX"]
    elif problem == "registry_malformed_url":
        version["fulltext_url"] = "https://arxiv.org/pdf/2305.12345v2?revision=v3"
    elif problem in {"missing_agent", "missing_model", "missing_reason"}:
        entry[{"missing_agent": "agent_id", "missing_model": "model", "missing_reason": "reason"}[problem]] = " "
    elif problem == "naive_timestamp":
        entry["reviewed_at"] = "2026-09-05T12:00:00"
    elif problem == "bad_timestamp":
        entry["reviewed_at"] = "someday"
    elif problem == "stale_source":
        (tmp_path / "source.md").write_text("Different source", encoding="utf-8")
    elif problem == "stale_evidence":
        entry["evidence"][0]["sha256"] = "sha256:" + "0" * 64
    elif problem == "missing_locator":
        entry["evidence"][0]["locator"] = " "
    elif problem == "missing_evidence":
        entry["evidence"] = []
    elif problem == "invented_quote":
        entry["evidence"][0]["quote"] = "Invented quotation"
    elif problem == "missing_title_quote":
        entry["evidence"][0]["quote"] = "arXiv:2305.12345v2"
    elif problem == "missing_revision_quote":
        entry["evidence"][0]["quote"] = "Example work"
    elif problem == "other_source_only":
        (tmp_path / "other.md").write_bytes((tmp_path / "source.md").read_bytes())
        entry["evidence"][0]["source_path"] = "other.md"
    elif problem == "unpinned_evidence_url":
        entry["evidence"][0]["source_url"] = "https://arxiv.org/abs/2305.12345"
    elif problem == "wrong_evidence_revision":
        entry["evidence"][0]["source_url"] = "https://arxiv.org/abs/2305.12345v1"
    elif problem == "malformed_evidence_url":
        entry["evidence"][0]["source_url"] = "https://arxiv.org/abs/2305.12345v2?revision=v3"
    elif problem == "versionless_doi_url":
        entry["evidence"][0]["source_url"] = "https://doi.org/10.48550/arxiv.2305.12345"
    write_source_manifest(tmp_path, manifest)
    original_versions = deepcopy(registry["works"])
    with pytest.raises(ValueError):
        apply_source_bindings(tmp_path, registry, load_contract())
    assert registry["works"] == original_versions
    assert not registry.get("source_index"), "a rejected binding must not become active"


@pytest.mark.parametrize("drift", ["revision", "source_hash", "bibliographic_title", "source_version", "missing_mode", "missing_identity"])
def test_existing_binding_consumer_rechecks_exact_identity_and_hash(tmp_path, drift):
    registry, _, _ = existing_source_fixture(tmp_path)
    apply_source_bindings(tmp_path, registry, load_contract())
    if drift == "revision":
        registry["source_index"]["P1"]["version_identity"]["arxiv"] = "2305.12345v1"
    elif drift == "source_hash":
        (tmp_path / "source.md").write_text("changed", encoding="utf-8")
    elif drift == "bibliographic_title":
        registry["works"][0]["versions"][0]["title"] = "Changed bibliography"
    elif drift == "source_version":
        registry["source_index"]["P1"]["source_version_id"] = "version:foreign"
    elif drift == "missing_mode":
        registry["source_index"]["P1"].pop("binding_mode")
    else:
        registry["source_index"]["P1"].pop("version_identity")
    with pytest.raises(ValueError):
        source_binding_for_record(registry, "P1", tmp_path)


@pytest.mark.parametrize("raw,expected", [
    ("arXiv:2305.12345v2", "2305.12345v2"),
    ("https://arxiv.org/pdf/2305.12345v2.pdf", "2305.12345v2"),
    ("https://arxiv.org/abs/2305.12345v2", "2305.12345v2"),
    ("https://arxiv.org/html/2305.12345v2", "2305.12345v2"),
    ("https://arxiv.org/abs/hep-th/9901001v2", "hep-th/9901001v2"),
    ("https://arxiv.org/html/2305.12345v2/image.png", ""),
    ("10.48550/arXiv.2305.12345", "2305.12345"),
    ("hep-th/9901001v2", "hep-th/9901001v2"),
    ("2305.12345v0", ""), ("2305.12345v02", ""),
    ("https://other.test/abs/2305.12345v2", ""),
    ("https://arxiv.org/abs/2305.12345v2?revision=v3", ""),
])
def test_arxiv_identifier_parser_preserves_exact_revision(raw, expected):
    assert normalise_arxiv(raw) == expected


def correction_fixture(tmp_path):
    registry, binding = registered_source(tmp_path)
    original = {"work_id": "doi:10.1/example", "categories": {"AI_Literacies": 2, "Soziale_Arbeit": 2, "Fairness": 2}, "decision": "Include", "analysis": {"fields": {"AN_Notes": "Original"}}, "lifecycle": {"state": "ai-agent-reviewed"}, "evidence": {key: [{"source_layer": "paper", "actor": "original-agent", "term": "This paper explores AI fairness and social work education.", "snippet": "this paper explores AI fairness and social work education."}] for key in ("AI_Literacies", "Soziale_Arbeit", "Fairness")}}
    (tmp_path / "records.json").write_text(json.dumps({"decisions": {"P1": original}}), encoding="utf-8")
    changes = [{"path": "/categories/Fairness", "before": 2, "after": 1, "reason": "Subordinate fairness reference."}]
    changes.extend({"path": f"/evidence/{key}/0/term", "before": passage[0]["term"], "after": passage[0]["snippet"], "reason": "Exact manuscript capitalization."} for key, passage in original["evidence"].items())
    correction = {"paper_id": "P1", "base_artifact": "records.json#/decisions/P1", "base_sha256": record_hash(original), "agent_id": "corrector", "model": "test", "corrected_at": "2026-09-05T11:00:00Z", "source_binding": binding, "changes": changes}
    data = {"schema": "femprompt-screening-corrections/0.2", "corrections": {"P1": correction}}
    (tmp_path / "corrections.json").write_text(json.dumps(data), encoding="utf-8")
    receipt = {"artifact": "corrections.json#/corrections/P1", "sha256": record_hash(correction), "result": "accepted", "review_type": "ai-source-review", "agent_id": "reviewer", "model": "test", "reviewed_at": "2026-09-05T12:00:00Z", "findings": "Identity and all positive quotation evidence checked against the exact manuscript.", "canonical_binding": {"paper_id": "P1", **registry["record_index"]["P1"]}, "source_binding": binding, "evidence": [{"source_path": "source.md", "sha256": binding["source_sha256"], "work_id": "work:one", "version_id": "version:am", "locator": "body", "quote": "this paper explores AI fairness and social work education."}]}
    ledger = {"schema": "femprompt-artifact-verification/0.1", "reviews": [receipt]}
    return original, correction, data, ledger


def test_source_correction_keeps_history_and_binds_exact_version(tmp_path):
    original, correction, _, ledger = correction_fixture(tmp_path)
    original_copy = deepcopy(original)
    projected, receipt, _ = reviewed_screening_projection(tmp_path, correction["base_artifact"], original, validated_reviews(tmp_path, ledger))
    assert original == original_copy
    assert projected["lifecycle"] == original["lifecycle"]
    assert projected["decision"] == "Include"
    assert projected["categories"]["Fairness"] == 1
    assert projected["evidence"]["Soziale_Arbeit"][0]["actor"] == "original-agent"
    assert receipt["canonical_binding"]["version_id"] == "version:vor"
    assert receipt["source_binding"]["source_version_id"] == "version:am"


def test_one_session_can_reject_original_and_accept_its_exact_correction(tmp_path):
    original, correction, _, ledger = correction_fixture(tmp_path)
    negative = deepcopy(ledger["reviews"][0])
    negative.update(artifact=correction["base_artifact"], sha256=record_hash(original), result="changes_requested")
    ledger["reviews"].insert(0, negative)
    projected, receipt, _ = reviewed_screening_projection(tmp_path, correction["base_artifact"], original, validated_reviews(tmp_path, ledger))
    assert receipt["result"] == "accepted"
    assert projected["categories"]["Fairness"] == 1
    negative["agent_id"] = "different-reviewer"
    with pytest.raises(ValueError, match="Conflicting screening family reviews"):
        reviewed_screening_projection(tmp_path, correction["base_artifact"], original, validated_reviews(tmp_path, ledger))


@pytest.mark.parametrize("path,after", [("/decision", "Exclude"), ("/lifecycle/state", "verified"), ("/evidence/Fairness/0/actor", "person"), ("/categories/Soziale_Arbeit", 1), ("/evidence/Fairness/0/snippet", "invented quote")])
def test_source_correction_rejects_unauthorized_paths_and_invented_quotes(tmp_path, path, after):
    _, correction, data, ledger = correction_fixture(tmp_path)
    correction["changes"].append({"path": path, "before": "unused", "after": after, "reason": "test"})
    (tmp_path / "corrections.json").write_text(json.dumps(data), encoding="utf-8")
    ledger["reviews"][0]["sha256"] = record_hash(correction)
    with pytest.raises(ValueError):
        validated_reviews(tmp_path, ledger)


def test_source_correction_cannot_change_derived_decision(tmp_path):
    original, correction, data, ledger = correction_fixture(tmp_path)
    original["categories"]["Soziale_Arbeit"] = 1
    correction["base_sha256"] = record_hash(original)
    (tmp_path / "records.json").write_text(json.dumps({"decisions": {"P1": original}}), encoding="utf-8")
    (tmp_path / "corrections.json").write_text(json.dumps(data), encoding="utf-8")
    ledger["reviews"][0]["sha256"] = record_hash(correction)
    with pytest.raises(ValueError, match="derived screening decision"):
        validated_reviews(tmp_path, ledger)


def test_source_receipt_cannot_relabel_another_version(tmp_path):
    _, _, _, ledger = correction_fixture(tmp_path)
    ledger["reviews"][0]["source_binding"] = {**ledger["reviews"][0]["source_binding"], "source_version_id": "version:vor"}
    with pytest.raises(ValueError, match="source binding differs"):
        validated_reviews(tmp_path, ledger)


def test_publisher_projects_manuscript_evidence_without_relabelling_bibliography(tmp_path):
    original, correction, _, ledger = correction_fixture(tmp_path)
    projected, receipt, _ = reviewed_screening_projection(tmp_path, correction["base_artifact"], original, validated_reviews(tmp_path, ledger))
    # Reuse the real complete analysis vocabulary; this test exercises identity,
    # not scholarly category selection in the synthetic manuscript.
    productive = json.loads((REPO / "docs/data/screening/ar2.json").read_text(encoding="utf-8"))
    projected["analysis"] = deepcopy(productive["decisions"]["VSZM7CT6"]["analysis"])
    projected["text_source"] = "raw"
    registry = json.loads((tmp_path / "corpus/work_version_registry.json").read_text(encoding="utf-8"))
    paper = {"id": "P1", "title": "Example work", "doi": "10.1/example", **generate_docs_data.work_version_projection("P1", registry)}
    schema = json.loads((REPO / "docs/data/analysis_fields.json").read_text(encoding="utf-8"))
    result = generate_literature_landscape._validate_and_transform_record("P1", projected, paper, schema, frozenset(projected["categories"]), receipt, repo=tmp_path)
    assert result["version_id"] == result["bibliographic_version_id"] == "version:vor"
    assert result["source_version_id"] == "version:am"
    assert all(passage["version_id"] == "version:am" and passage["source_path"] == "source.md" for category in result["categories"] for passage in category["evidence"])
    projected["evidence"]["Fairness"][0]["version_id"] = "version:foreign"
    with pytest.raises(ValueError, match="recorded version identity differs"):
        generate_literature_landscape._validate_and_transform_record("P1", projected, paper, schema, frozenset(projected["categories"]), receipt, repo=tmp_path)


def test_fulltext_uses_bound_manuscript_with_separate_bibliography(tmp_path, monkeypatch):
    registry, binding = registered_source(tmp_path)
    projection = generate_docs_data.work_version_projection("P1", registry)
    paper = {"id": "P1", "title": "Example work", "doi": "10.1/example", **projection}
    monkeypatch.setattr(build_fulltext, "ROOT", tmp_path)
    path, _ = build_fulltext.resolve_docling(paper, {}, {})
    assert path == tmp_path / "source.md"
    identity = build_fulltext.source_identity(paper)
    assert identity["version_id"] == "version:am"
    assert identity["bibliographic_version_id"] == "version:vor"
    assert identity["is_preferred_version"] is False
    with pytest.raises(ValueError, match="missing the governed source binding"):
        build_fulltext.resolve_docling({**paper, "source_binding": None}, {}, {})
    paper["source_binding"] = {**binding, "source_path": "different.md"}
    with pytest.raises(ValueError, match="differs from canonical registry"):
        build_fulltext.resolve_docling(paper, {}, {})


def test_metadata_identity_correction_suppresses_same_title_old_knowledge_doc(tmp_path, monkeypatch):
    (tmp_path / "Example work.md").write_text("Old synthetic summary of a different DOI", encoding="utf-8")
    monkeypatch.setattr(generate_docs_data, "VAULT_PAPERS_DIR", tmp_path)
    meta = {"Title": "Example work", "DOI": "10.1/correct", "_metadata_correction": {"changes": [{"field": "DOI", "before": "10.1/wrong", "after": "10.1/correct"}]}}
    paper = generate_docs_data.parse_llm_row({"Zotero_Key": "P1"}, {"P1": meta}, {"P1": {"src": "raw", "source_file": "new-source.md"}})
    assert paper["knowledge_doc"] is None
    assert paper["knowledge_coverage"] == "fulltext_ready"
    assert paper["knowledge_doc_invalidation"]["reason"] == "bibliographic_identity_corrected"


def test_production_bindings_keep_vor_and_historical_source_holds():
    registry = build_registry(REPO)
    for key in ("VSZM7CT6", "EXRF5629"):
        binding = registry["source_index"][key]
        assert registry["record_index"][key]["version_id"] == binding["bibliographic_version_id"]
        assert binding["source_version_id"] != binding["bibliographic_version_id"]
        assert binding["source_version_type"] == "accepted_manuscript"
    assert len([work for work in registry["works"] if work.get("source_hold")]) == 2
