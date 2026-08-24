"""Tests for the project-specific Grounded Vault profile."""

from __future__ import annotations

from pathlib import Path

from src.publish.validate_research_vault import validate_vault


ROOT = Path(__file__).resolve().parents[1]


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


def test_complete_ai_agent_reviewed_chain_is_valid(tmp_path: Path) -> None:
    report = validate_vault(_fixture(tmp_path))

    assert report.errors == []


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
