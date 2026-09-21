"""Tests for the canonical Work-Version registry and selection contract."""

from __future__ import annotations

import json
from copy import deepcopy

import pytest

from src.analysis.build_work_version_registry import (
    REPO,
    _acl_publisher_identity_evidence,
    _version_from_zotero,
    build_registry,
)
from src.analysis.work_versions import (
    load_contract,
    select_version_ids,
    validate_registry,
)
from src.assess.artifact_verification import artifact_hash


def _version(
    version_id: str,
    version_type: str,
    version_date: str,
    integrity_status: str = "current",
) -> dict[str, object]:
    return {
        "version_id": version_id,
        "version_type": version_type,
        "version_date": version_date,
        "integrity_status": integrity_status,
        "peer_review_status": "not_established",
        "peer_review_basis": "unknown",
        "relations": [],
    }


def test_preferred_version_uses_stage_while_latest_uses_date() -> None:
    contract = load_contract()
    versions = [
        _version("version:preprint", "preprint", "2026-03-01"),
        _version("version:record", "version_of_record", "2025-12-01"),
    ]

    latest, preferred = select_version_ids(versions, contract)

    assert latest == "version:preprint"
    assert preferred == "version:record"


def test_retracted_version_is_not_preferred() -> None:
    contract = load_contract()
    versions = [
        _version(
            "version:retracted",
            "enhanced_version_of_record",
            "2026-03-01",
            "retracted",
        ),
        _version("version:accepted", "accepted_manuscript", "2025-12-01"),
    ]

    latest, preferred = select_version_ids(versions, contract)

    assert latest == "version:retracted"
    assert preferred == "version:accepted"


def test_committed_registry_covers_zotero_and_round2_inputs() -> None:
    registry = build_registry(REPO)

    keys = {
        item["key"]
        for item in json.loads(
            (REPO / "corpus/zotero_export.json").read_text(encoding="utf-8")
        )
    }
    assert registry["counts"]["zotero_records"] == len(keys)
    assert registry["counts"]["round2_candidates"] == 24
    assert set(registry["record_index"]) == keys
    assert len(registry["candidate_index"]) == 24
    assert all(work["preferred_version_id"] for work in registry["works"])


def test_published_acl_conference_record_does_not_remain_unknown():
    items = json.loads((REPO / "corpus/zotero_export.json").read_text(encoding="utf-8"))
    record = next(item for item in items if item["key"] == "QI7MDZU4")
    version = _version_from_zotero(record)
    assert version["version_type"] == "version_of_record"
    assert version["peer_review_status"] == "not_established"


def _publisher_evidence_fixture(tmp_path):
    record_id = "P1"
    evidence_dir = (
        tmp_path / "corpus/source-acquisition/acl-publisher-bindings-2026-09-21"
    )
    evidence_dir.mkdir(parents=True)
    acquisition_dir = tmp_path / "generated/source-acquisition/codex-websearch-2026"
    acquisition_dir.mkdir(parents=True)
    markdown_path = acquisition_dir / "source.md"
    markdown_path.write_text("Example work\nComplete article text.\n", encoding="utf-8")
    markdown_reference = markdown_path.relative_to(tmp_path).as_posix()
    markdown_hash = artifact_hash(tmp_path, markdown_reference)
    doi = "10.18653/v1/2026.acl-long.1"
    pdf_url = "https://aclanthology.org/2026.acl-long.1.pdf"
    pdf_hash = "a" * 64
    page_path = evidence_dir / f"{record_id}.metadata.txt"
    page_path.write_text(
        '<meta name="citation_title" content="Example work">\n'
        f'<meta name="citation_doi" content="{doi}">\n'
        f'<meta name="citation_pdf_url" content="{pdf_url}">\n',
        encoding="utf-8",
    )
    (acquisition_dir / "acquisition-manifest.json").write_text(
        json.dumps(
            {"records": [{"doi": doi, "source_url": pdf_url, "sha256": pdf_hash}]}
        ),
        encoding="utf-8",
    )
    (acquisition_dir / "source-readiness.json").write_text(
        json.dumps(
            {
                "records": [
                    {
                        "doi": doi,
                        "screening_markdown_file": markdown_reference,
                        "screening_markdown_sha256": markdown_hash.removeprefix(
                            "sha256:"
                        ),
                        "local_representation": {
                            "source_sha256": pdf_hash,
                            "markdown_file": markdown_reference,
                            "markdown_sha256": markdown_hash.removeprefix("sha256:"),
                        },
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    evidence_path = evidence_dir / f"{record_id}.json"
    evidence = {
        "record_id": record_id,
        "landing_page_url": "https://aclanthology.org/2026.acl-long.1/",
        "captured_page_path": page_path.relative_to(tmp_path).as_posix(),
        "captured_page_sha256": artifact_hash(
            tmp_path, page_path.relative_to(tmp_path).as_posix()
        ),
        "raw_page_capture": {
            "url": "https://aclanthology.org/2026.acl-long.1/",
            "local_path": (evidence_dir / f"{record_id}.html")
            .relative_to(tmp_path)
            .as_posix(),
            "sha256": "sha256:" + "c" * 64,
        },
        "acquisition_pdf": {"sha256": "sha256:" + pdf_hash},
        "publisher_pdf_download_verification": {
            "url": pdf_url,
            "sha256": "sha256:" + pdf_hash,
        },
        "readiness_markdown": {
            "path": markdown_reference,
            "sha256": markdown_hash,
        },
    }
    evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
    reference = {
        "path": evidence_path.relative_to(tmp_path).as_posix(),
        "sha256": artifact_hash(
            tmp_path, evidence_path.relative_to(tmp_path).as_posix()
        ),
    }
    binding = {"source_path": markdown_reference, "source_sha256": markdown_hash}
    identity = {"title": "Example work", "doi": doi}
    return reference, binding, identity, evidence, page_path, evidence_path


def test_acl_publisher_identity_gate_uses_html_and_offline_provenance(tmp_path):
    reference, binding, identity, _, _, _ = _publisher_evidence_fixture(tmp_path)

    quote, inputs = _acl_publisher_identity_evidence(
        tmp_path, "P1", reference, binding, identity
    )

    assert quote == "Example work 10.18653/v1/2026.acl-long.1"
    assert len(inputs) == 4


def test_current_acl_publisher_bindings_pass_the_offline_identity_gate():
    registry = build_registry(REPO)

    for record_id in (
        "QI7MDZU4",
        "WK8IJUXQ",
        "XPWCK65R",
        "STQU6H42",
        "T57U8T2K",
    ):
        binding = registry["source_index"][record_id]
        assert binding["source_version_type"] == "version_of_record"
        assert (
            binding["source_version_id"]
            == registry["record_index"][record_id]["version_id"]
        )


@pytest.mark.parametrize("drift", ["doi", "pdf_hash", "html", "markdown"])
def test_acl_publisher_identity_gate_rejects_provenance_drift(tmp_path, drift):
    reference, binding, identity, evidence, page_path, evidence_path = (
        _publisher_evidence_fixture(tmp_path)
    )
    if drift == "doi":
        page_path.write_text(
            page_path.read_text(encoding="utf-8").replace(
                identity["doi"], "10.18653/v1/2026.acl-long.2"
            ),
            encoding="utf-8",
        )
        evidence["captured_page_sha256"] = artifact_hash(
            tmp_path, page_path.relative_to(tmp_path).as_posix()
        )
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        reference["sha256"] = artifact_hash(
            tmp_path, evidence_path.relative_to(tmp_path).as_posix()
        )
    elif drift == "pdf_hash":
        evidence["acquisition_pdf"]["sha256"] = "sha256:" + "b" * 64
        evidence_path.write_text(json.dumps(evidence), encoding="utf-8")
        reference["sha256"] = artifact_hash(
            tmp_path, evidence_path.relative_to(tmp_path).as_posix()
        )
    elif drift == "html":
        page_path.write_text(
            page_path.read_text(encoding="utf-8") + "<!-- drift -->\n",
            encoding="utf-8",
        )
    else:
        (tmp_path / binding["source_path"]).write_text(
            "Changed article text.\n", encoding="utf-8"
        )

    with pytest.raises(ValueError):
        _acl_publisher_identity_evidence(tmp_path, "P1", reference, binding, identity)


def test_historical_and_live_source_aliases_keep_the_exact_bibliographic_version():
    registry = build_registry(REPO)
    historical, live = "EXRF5629", "JBZ398FC"
    assert registry["record_index"][historical] == registry["record_index"][live]
    original = registry["source_index"][historical]
    alias = registry["source_index"][live]
    assert alias == {**original, "record_id": live}


def test_registry_validation_rejects_unknown_version_type() -> None:
    registry = build_registry(REPO)
    broken = deepcopy(registry)
    broken["works"][0]["versions"][0]["version_type"] = "invented"

    with pytest.raises(ValueError, match="unknown version_type"):
        validate_registry(broken, load_contract())


def test_version_relations_resolve_within_one_work() -> None:
    registry = build_registry(REPO)
    all_version_ids: list[str] = []
    related_multi_version_works = 0

    for work in registry["works"]:
        versions = work["versions"]
        version_ids = {version["version_id"] for version in versions}
        all_version_ids.extend(version_ids)
        if len(versions) > 1 and any(version["relations"] for version in versions):
            related_multi_version_works += 1
        for version in versions:
            for relation in version["relations"]:
                assert relation["target_version_id"] in version_ids
                assert relation["target_version_id"] != version["version_id"]

    assert len(all_version_ids) == len(set(all_version_ids))
    assert related_multi_version_works > 0


def test_registry_keeps_preprint_and_version_of_record_as_distinct_versions() -> None:
    registry = build_registry(REPO)
    version_type_sets = [
        {version["version_type"] for version in work["versions"]}
        for work in registry["works"]
    ]

    assert any(
        "preprint" in version_types and "version_of_record" in version_types
        for version_types in version_type_sets
    )
