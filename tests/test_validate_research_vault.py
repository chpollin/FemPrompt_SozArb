"""Tests for the project-specific Grounded Vault profile."""

from __future__ import annotations

from pathlib import Path

from src.publish.validate_research_vault import validate_vault

ROOT = Path(__file__).resolve().parents[1]


def test_review_receipt_cannot_claim_a_future_review(monkeypatch) -> None:
    import json
    from datetime import datetime, timedelta
    from src.publish import validate_research_vault as validation

    report = validation.ValidationReport()
    document = validation._parse_document(
        ROOT
        / "research-vault/20_distillates/publications/bhxdu7vm-how-people-use-chatgpt.md",
        ROOT / "research-vault",
        report,
    )
    assert document is not None
    receipt = json.loads(
        (ROOT / document.metadata["source-review"]["path"]).read_text(encoding="utf-8")
    )
    recorded = datetime.fromisoformat(receipt["reviewed_at"].replace("Z", "+00:00"))

    class EarlierClock(datetime):
        @classmethod
        def now(cls, tz=None):
            return recorded - timedelta(seconds=1)

    monkeypatch.setattr(validation, "datetime", EarlierClock)
    validation._check_source_review(document, report)
    assert any(
        "invalid or non-independent source review" in error for error in report.errors
    )


def test_source_review_is_invalidated_when_reviewed_text_changes() -> None:
    from src.publish.validate_research_vault import (
        ValidationReport,
        _parse_document,
        _check_source_review,
    )

    report = ValidationReport()
    document = _parse_document(
        ROOT
        / "research-vault/20_distillates/publications/bhxdu7vm-how-people-use-chatgpt.md",
        ROOT / "research-vault",
        report,
    )
    assert document is not None
    _check_source_review(document, report)
    assert report.errors == []
    document.body += "\nChanged conclusion.\n"
    _check_source_review(document, report)
    assert any(
        "document content or source identity changed" in error
        for error in report.errors
    )


def test_source_review_is_invalidated_when_bound_source_changes() -> None:
    from src.publish.validate_research_vault import (
        ValidationReport,
        _parse_document,
        _check_source_review,
    )

    report = ValidationReport()
    document = _parse_document(
        ROOT
        / "research-vault/20_distillates/publications/bhxdu7vm-how-people-use-chatgpt.md",
        ROOT / "research-vault",
        report,
    )
    assert document is not None
    document.metadata["source-representation"]["path"] = "README.md"
    _check_source_review(document, report)
    assert any(
        "document content or source identity changed" in error
        for error in report.errors
    )


def test_new_preparation_review_requires_immutable_receipt() -> None:
    from src.publish.validate_research_vault import (
        ValidationReport,
        _parse_document,
        _check_distillate,
    )

    report = ValidationReport()
    document = _parse_document(
        ROOT
        / "research-vault/20_distillates/publications/bhxdu7vm-how-people-use-chatgpt.md",
        ROOT / "research-vault",
        report,
    )
    assert document is not None
    del document.metadata["source-review"]
    del document.metadata["prepared-by"]
    _check_distillate(document, {document.metadata["reference"]}, {}, {}, report)
    assert any("source review is invalid" in error for error in report.errors)


def test_source_review_receipt_hash_cannot_be_replaced() -> None:
    from src.publish.validate_research_vault import (
        ValidationReport,
        _parse_document,
        _check_source_review,
    )

    report = ValidationReport()
    document = _parse_document(
        ROOT
        / "research-vault/20_distillates/publications/bhxdu7vm-how-people-use-chatgpt.md",
        ROOT / "research-vault",
        report,
    )
    assert document is not None
    document.metadata["source-review"]["path"] = (
        "corpus/knowledge-reviews/2026-09-21/4ZL5Q48E-initial.json"
    )
    _check_source_review(document, report)
    assert any("source review receipt hash changed" in error for error in report.errors)


def _write(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value.strip() + "\n", encoding="utf-8")


def _fixture(tmp_path: Path) -> Path:
    vault = tmp_path / "research-vault"
    _write(
        vault / "references" / "source.json",
        '[{"id": "source-1", "type": "article-journal"}]',
    )
    _write(
        vault / "20_distillates" / "publications" / "source.md",
        """
---
type: distillate
source-type: publication
reference: source-1
record-id: TEST1
work-id: work:test
version-id: version:test
version-type: version_of_record
topics: ['[[Topic]]']
status: ai-agent-reviewed
checked:
  quote: 2026-08-23
  validation: 2026-08-23
  ai-agent-review: 2026-08-23
created: 2026-08-23
updated: 2026-08-23
---
# Distillate

## Core statements

- The source reports a result. ^s1
  > "A result." (source)
""",
    )
    _write(
        vault / "30_assertions" / "result.md",
        """
---
type: assertion
topics: ['[[Topic]]']
status: ai-agent-reviewed
checked:
  validation: 2026-08-23
  ai-agent-review: 2026-08-23
grounding:
  - '[[20_distillates/publications/source#^s1]]'
contested-with: []
created: 2026-08-23
updated: 2026-08-23
---
# Result
""",
    )
    _write(
        vault / "40_output" / "report" / "chapter.md",
        """
---
type: chapter
stage: working
status: ai-agent-reviewed
checked:
  validation: 2026-08-23
  ai-agent-review: 2026-08-23
assertions:
  - '[[30_assertions/result]]'
posits: 0
created: 2026-08-23
updated: 2026-08-23
---
# Chapter
""",
    )
    return vault


def test_current_research_vault_profile_is_valid() -> None:
    report = validate_vault(ROOT / "research-vault")

    assert report.errors == []


def test_self_declared_reviewed_chain_without_receipt_is_rejected(
    tmp_path: Path,
) -> None:
    report = validate_vault(_fixture(tmp_path))

    assert any("source review is invalid" in error for error in report.errors)


def test_historical_authority_does_not_cover_changed_document(tmp_path, monkeypatch):
    import shutil
    from src.publish import validate_research_vault as validation

    reference = "research-vault/20_distillates/publications/ahn-2025-ai-literacy-for-social-work.md"
    baseline = "corpus/knowledge-reviews/historical-authority-baseline.json"
    for name in (reference, baseline):
        target = tmp_path / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / name, target)
    monkeypatch.setattr(validation, "REPO_ROOT", tmp_path)
    path = tmp_path / reference
    report = validation.ValidationReport()
    document = validation._parse_document(path, tmp_path / "research-vault", report)
    assert validation._unchanged_historical_review(document)
    path.write_text(
        path.read_text(encoding="utf-8") + "\nChanged claim.\n", encoding="utf-8"
    )
    document = validation._parse_document(path, tmp_path / "research-vault", report)
    assert not validation._unchanged_historical_review(document)
    validation._check_distillate(
        document, {document.metadata["reference"]}, {}, {}, report
    )
    assert any("source review is invalid" in error for error in report.errors)


def test_unreviewed_preparation_records_actor_and_exact_source(tmp_path: Path) -> None:
    vault = _fixture(tmp_path)
    distillate = vault / "20_distillates" / "publications" / "source.md"
    content = distillate.read_text(encoding="utf-8")
    content = content.replace("status: ai-agent-reviewed", "status: preparation")
    content = content.replace(
        "checked:\n  quote: 2026-08-23\n  validation: 2026-08-23\n  ai-agent-review: 2026-08-23",
        """checked:
  quote: 2026-08-23
prepared-by:
  agent-id: /root/test
  model: test-model
source-representation:
  path: source.md
  sha256: sha256:test
  version-id: version:source
  version-type: accepted_manuscript""",
    )
    distillate.write_text(content, encoding="utf-8")
    (vault / "30_assertions" / "result.md").unlink()
    (vault / "40_output" / "report" / "chapter.md").unlink()

    report = validate_vault(vault)

    assert report.errors == []


def test_preparation_does_not_imply_ai_agent_review(tmp_path: Path) -> None:
    vault = _fixture(tmp_path)
    distillate = vault / "20_distillates" / "publications" / "source.md"
    distillate.write_text(
        distillate.read_text(encoding="utf-8")
        .replace("status: ai-agent-reviewed", "status: preparation")
        .replace(
            "checked:\n  quote: 2026-08-23\n  validation: 2026-08-23\n  ai-agent-review: 2026-08-23",
            """checked:
  quote: 2026-08-23
prepared-by:
  agent-id: /root/test
  model: test-model
source-representation:
  path: source.md
  sha256: sha256:test
  version-id: version:source
  version-type: accepted_manuscript""",
        ),
        encoding="utf-8",
    )
    report = validate_vault(vault)

    assert any("status exceeds grounding" in error for error in report.errors)


def test_verified_status_requires_an_artifact_local_verification_date(
    tmp_path: Path,
) -> None:
    vault = _fixture(tmp_path)
    assertion = vault / "30_assertions" / "result.md"
    assertion.write_text(
        assertion.read_text(encoding="utf-8").replace(
            "status: ai-agent-reviewed", "status: verified"
        ),
        encoding="utf-8",
    )

    report = validate_vault(vault)

    assert any("requires checked.verification" in error for error in report.errors)


def test_status_cannot_exceed_the_supporting_layer(tmp_path: Path) -> None:
    vault = _fixture(tmp_path)
    chapter = vault / "40_output" / "report" / "chapter.md"
    chapter.write_text(
        chapter.read_text(encoding="utf-8")
        .replace("status: ai-agent-reviewed", "status: verified")
        .replace(
            "  ai-agent-review: 2026-08-23",
            "  ai-agent-review: 2026-08-23\n  verification: 2026-08-23",
        ),
        encoding="utf-8",
    )

    report = validate_vault(vault)

    assert any("status exceeds assertion" in error for error in report.errors)
