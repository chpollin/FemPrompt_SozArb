"""Tests for the Codex Websearch 2026 source-readiness ledger."""

from src.acquire.build_codex_source_readiness import (
    REPO,
    _repair_qc_approved,
    _source_state,
    _verified_repo_file,
    build_readiness,
)


def test_source_state_requires_local_source_and_agent_qc() -> None:
    assert _source_state(None, None, None, None, None) == (
        "fulltext_access_not_available",
        False,
        "lawful_fulltext_source_required",
    )
    assert _source_state({"status": "failed"}, None, None, None, None) == (
        "automatic_acquisition_failed",
        False,
        "alternative_source_or_operator_download_required",
    )
    assert _source_state(
        {"status": "downloaded"},
        {"status": "PASS"},
        None,
        None,
        None,
    ) == ("agent_qc_pending", False, "agent_source_qc_required")


def test_source_state_uses_agent_authority_not_automatic_pass() -> None:
    assert _source_state(
        {"status": "downloaded"},
        {"status": "PASS"},
        {
            "decision": "approved_for_screening",
            "identity_match": True,
            "body_complete": True,
            "tables": {"material_loss": False},
        },
        None,
        None,
    ) == ("agent_qc_approved", True, "zotero_identity_binding_pending")


def test_source_state_blocks_unrepresentable_visual_evidence() -> None:
    visual = {
        "assessment": {
            "status": "not_representable_in_current_prism_evidence_structure"
        }
    }
    assert _source_state(
        {"status": "downloaded"},
        {"status": "WARNING"},
        {"decision": "requires_reconversion"},
        None,
        visual,
    ) == (
        "visual_evidence_support_required",
        False,
        "prism_visual_evidence_not_representable",
    )


def test_text_segment_repair_can_pass_fail_closed_gate() -> None:
    assert _repair_qc_approved(
        {
            "decision": "approved_for_screening",
            "page_markers_preserved": True,
            "repaired_markdown": "generated/example.md",
            "repaired_segments": [{"status": "verified_complete"}],
        }
    )


def test_repair_gate_checks_every_repaired_unit_type() -> None:
    assert not _repair_qc_approved(
        {
            "decision": "approved_for_screening",
            "page_markers_preserved": True,
            "repaired_markdown": "generated/example.md",
            "tables": [{"status": "verified_complete"}],
            "text_segments": [{"status": "verification_pending"}],
        }
    )


def test_recorded_hash_can_stand_for_an_intentionally_local_source(tmp_path) -> None:
    recorded_hash = "a" * 64

    assert (
        _verified_repo_file(
            tmp_path,
            "local-only/source.pdf",
            expected_sha256=recorded_hash,
            allow_missing_with_recorded_hash=True,
        )
        == recorded_hash
    )


def test_readiness_covers_package_once() -> None:
    payload = build_readiness(REPO)
    assert payload["sources"]["acquisition_manifest"]["path"] == (
        "generated/source-acquisition/codex-websearch-2026/acquisition-manifest.json"
    )

    assert payload["schema"] == "femprompt-source-readiness/0.2"
    assert payload["counts"]["candidates"] == 58
    assert payload["counts"]["validated_visual_evidence_bundles"] == 2
    assert len(payload["records"]) == 58
    assert len({record["candidate_id"] for record in payload["records"]}) == 58
    assert all(
        not record["screening_source_ready"]
        or record["canonical_queue_status"] == "pending_zotero_identity_binding"
        for record in payload["records"]
    )
    repaired = next(
        record
        for record in payload["records"]
        if record["doi"] == "10.16719/j.cnki.1671-6981.20260201"
    )
    assert repaired["source_readiness"] == "agent_qc_approved_after_repair"
    assert repaired["screening_markdown_file"].endswith(
        "markdown-repaired/7cbaa5fc7bd51c3642ad.md"
    )
    assert repaired["screening_markdown_sha256"]

    html_source = next(
        record
        for record in payload["records"]
        if record["doi"] == "10.1016/j.mcpdig.2026.100344"
    )
    assert html_source["local_representation"]["format"] == "html"
    assert html_source["local_representation"]["source_storage"] == (
        "local_only_not_committed"
    )
    assert html_source["local_representation"]["source_sha256"]
    assert html_source["local_representation"]["markdown_sha256"]
    assert html_source["local_source_version"]["version_type"] == ("version_of_record")
    assert html_source["screening_source_ready"] is True

    visual_evidence_dois = {
        "10.1080/02615479.2026.2660786",
        "10.35362/issn.1850-0013-1258",
    }
    visual_evidence_records = [
        record for record in payload["records"] if record["doi"] in visual_evidence_dois
    ]
    assert len(visual_evidence_records) == 2
    assert all(
        record["source_readiness"] == "visual_evidence_support_required"
        and not record["screening_source_ready"]
        and record["visual_evidence_manifest"]["image_count"] > 0
        for record in visual_evidence_records
    )
    assert (
        sum(
            record["visual_evidence_manifest"]["image_count"]
            for record in visual_evidence_records
        )
        == 21
    )
