"""Tests for the dated source-reacquisition audit."""

import hashlib

from src.acquire.audit_source_reacquisition import build_audit


def test_audit_distinguishes_exact_changed_failed_and_ineligible(tmp_path) -> None:
    markdown = tmp_path / "changed.md"
    markdown.write_text("converted text\n", encoding="utf-8")
    exact_hash = "a" * 64
    changed_hash = "b" * 64
    baseline = {
        "records": [
            {"candidate_id": "exact", "sha256": exact_hash},
            {"candidate_id": "changed", "sha256": exact_hash},
            {"candidate_id": "failed", "sha256": None},
        ]
    }
    retry = {
        "records": [
            {
                "candidate_id": "exact",
                "status": "downloaded",
                "sha256": exact_hash,
                "local_pdf_name": "exact.pdf",
                "validation": "valid_pdf_container",
                "attempts": [],
            },
            {
                "candidate_id": "changed",
                "status": "downloaded",
                "sha256": changed_hash,
                "local_pdf_name": "changed.pdf",
                "validation": "valid_pdf_container",
                "attempts": [],
            },
            {
                "candidate_id": "failed",
                "status": "failed",
                "sha256": None,
                "attempts": [{"url": "https://example.org/source.pdf"}],
            },
        ]
    }
    readiness = {
        "records": [
            {"candidate_id": name, "title": name, "doi": None}
            for name in ("exact", "changed", "failed", "ineligible")
        ]
    }
    conversion = {
        "files": [
            {
                "input": "changed.pdf",
                "output": "changed.md",
                "status": "converted",
                "quality_score": 95,
                "quality_issues": [],
            }
        ]
    }

    audit = build_audit(
        baseline,
        retry,
        readiness,
        conversion_report=conversion,
        markdown_directory=tmp_path,
    )
    outcomes = {item["candidate_id"]: item for item in audit["records"]}

    assert outcomes["exact"]["outcome"] == "exact_recorded_source_recovered"
    assert outcomes["exact"]["remaining_blocker"] is None
    assert outcomes["changed"]["outcome"] == "changed_source_bytes_recovered"
    assert outcomes["changed"]["remaining_blocker"] == (
        "new_conversion_requires_source_qc"
    )
    assert (
        outcomes["changed"]["evidence"]["conversion"]["markdown_sha256"]
        == hashlib.sha256(markdown.read_bytes()).hexdigest()
    )
    assert outcomes["failed"]["outcome"] == "retrieval_failed"
    assert outcomes["ineligible"]["outcome"] == "no_download_eligible_source"
    assert not outcomes["changed"]["authority"]["ai_source_review"]
