"""Publication and provenance regressions for the active-assertion chat index."""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml

from src.assess.artifact_verification import SCHEMA as LEDGER_SCHEMA, artifact_hash
from src.publish.build_assertion_index import build_index

ROOT = Path(__file__).resolve().parents[1]
ASSERTION = "30_assertions/ahn-et-al-propose-integrating-ai-literacy-across-existing-core-competencies.md"
DISTILLATE = "20_distillates/publications/ahn-2025-ai-literacy-for-social-work.md"
REFERENCE = "references/Ahn_2025_Artificial_Intelligence_(AI)_literacy_for_social.json"
QUOTE = "we propose that AI literacy should also be integrated across existing core competencies."


def _write(path: Path, value: str | dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value) if isinstance(value, dict) else value, encoding="utf-8")


def _metadata(path: Path, **updates) -> None:
    _, front, body = path.read_text(encoding="utf-8").split("---", 2)
    meta = yaml.safe_load(front)
    meta.update(updates)
    _write(path, "---\n" + yaml.safe_dump(meta) + "---" + body)


def fixture(tmp_path: Path, state="publication-approved") -> dict:
    vault = tmp_path / "research-vault"
    for rel in (ASSERTION, DISTILLATE, REFERENCE):
        _write(vault / rel, (ROOT / "research-vault" / rel).read_text(encoding="utf-8"))
    if state == "publication-approved":
        for rel in (ASSERTION, DISTILLATE):
            checked = {key: "2026-09-05" for key in ("validation", "ai-agent-review", "verification", "publication-approval", "quote")}
            _metadata(vault / rel, status=state, checked=checked)
    _write(tmp_path / "policy.json", {"allowed_states": [state], "public_label": "Test"})
    return {"vault": vault, "registry_path": ROOT / "corpus/work_version_registry.json",
            "policy_path": tmp_path / "policy.json", "ledger_path": tmp_path / "ledger.json", "repo": tmp_path}


def _ledger(args: dict) -> dict:
    repo = args["repo"]
    source = "local/source.txt"
    _write(repo / source, QUOTE + "\nPRIVATE FULL TEXT MUST NOT BE EXPORTED")
    evidence = {"source_path": source, "sha256": artifact_hash(repo, source),
                "work_id": "work:70312fae-6975-587e-b409-06a82d50b6ce",
                "version_id": "version:7b79b88e-3857-5a65-8cfe-94478052d8ee",
                "source_url": "https://doi.org/10.1086/735187", "locator": "discussion", "quote": QUOTE}
    reviews = [{"artifact": "research-vault/" + rel,
                "sha256": artifact_hash(repo, "research-vault/" + rel),
                "result": "accepted", "review_type": "ai-source-review",
                "agent_id": "test-fixture-agent", "model": "test-fixture-model",
                "reviewed_at": "2026-09-05T09:00:00Z", "findings": "Fixture review only; not a scholarly review.",
                "evidence": [dict(evidence)]} for rel in (ASSERTION, DISTILLATE)]
    ledger = {"schema": LEDGER_SCHEMA, "reviews": reviews}
    _write(args["ledger_path"], ledger)
    return ledger


def test_current_ai_status_without_receipts_is_withheld(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    payload = build_index(**args)
    assert payload["assertions"] == []
    assert payload["meta"]["withheld_assertions"] == 1


def test_approved_chain_exports_exact_version_and_excerpt_deterministically(tmp_path):
    args = fixture(tmp_path)
    payload = build_index(**args)
    assert build_index(**args) == payload
    assertion = payload["assertions"][0]
    source = assertion["evidence"][0]
    assert source["version_id"] == "version:7b79b88e-3857-5a65-8cfe-94478052d8ee"
    assert source["quote"] == QUOTE
    assert source["locator"] == "discussion"
    assert source["source_url"] == "https://doi.org/10.1086/735187"
    assert source["statement_ref"].endswith("#^s1")


def test_active_layers_only_not_legacy_claims(tmp_path):
    args = fixture(tmp_path)
    _write(args["vault"] / "20_claims/private.md", "PRIVATE LEGACY CLAIM")
    _write(args["vault"] / "10_distillates/private.md", "PRIVATE LEGACY DISTILLATE")
    payload = json.dumps(build_index(**args))
    assert "PRIVATE" not in payload


def test_unapproved_grounding_withholds_whole_assertion(tmp_path):
    args = fixture(tmp_path)
    _metadata(args["vault"] / DISTILLATE, status="ai-agent-reviewed")
    assert build_index(**args)["assertions"] == []


@pytest.mark.parametrize("state", ["publication-approved", "ai-agent-reviewed"])
def test_current_work_source_hold_withholds_otherwise_approved_chain(tmp_path, state):
    args = fixture(tmp_path, state)
    ledger = _ledger(args) if state == "ai-agent-reviewed" else None
    _write(tmp_path / "hold-evidence.txt", "Source withdrawn or mismatched version")
    work_id = "work:70312fae-6975-587e-b409-06a82d50b6ce"
    resolution = {"schema": "femprompt-historical-resolution/0.1", "work_resolutions": {work_id: {
        "work_id": work_id, "withhold_from_current_synthesis": True, "integrity_hold": True,
        "reason": "Fixture source restriction", "agent_id": "test-agent", "model": "test-model",
        "reviewed_at": "2026-09-05T12:00:00Z",
        "evidence": [{"source_path": "hold-evidence.txt", "sha256": artifact_hash(tmp_path, "hold-evidence.txt")}]}}}
    _write(tmp_path / "generated/verification/historical-resolution-2026-09-05.json", resolution)
    payload = build_index(**args)
    assert payload["assertions"] == []
    assert payload["meta"]["withheld_assertions"] == 1


@pytest.mark.parametrize("field,value,match", [
    ("grounding", ["[[20_distillates/publications/missing#^s1]]"], "unresolved"),
    ("grounding", ["[[20_distillates/publications/ahn-2025-ai-literacy-for-social-work#^s404]]"], "statement block"),
    ("grounding", ["[[../local/source#^s1]]"], "invalid grounding"),
    ("grounding", [], "no grounding"),
    ("checked", {"validation": "2026-09-05"}, "requires checked"),
])
def test_malformed_approved_assertions_fail_closed(tmp_path, field, value, match):
    args = fixture(tmp_path)
    _metadata(args["vault"] / ASSERTION, **{field: value})
    with pytest.raises(ValueError, match=match):
        build_index(**args)


def test_distillate_with_different_version_fails_closed(tmp_path):
    args = fixture(tmp_path)
    _metadata(args["vault"] / DISTILLATE, **{"version-id": "version:wrong"})
    with pytest.raises(ValueError, match="identity differs"):
        build_index(**args)


def test_quote_must_identify_registered_source(tmp_path):
    args = fixture(tmp_path)
    path = args["vault"] / DISTILLATE
    _write(path, path.read_text(encoding="utf-8").replace("doi:10.1086/735187", "doi:10.1000/wrong"))
    with pytest.raises(ValueError, match="registered version"):
        build_index(**args)


def test_duplicate_statement_block_rejected(tmp_path):
    args = fixture(tmp_path)
    path = args["vault"] / DISTILLATE
    _write(path, path.read_text(encoding="utf-8").replace("## Open questions", "- Another statement. ^s1\n\n## Open questions"))
    with pytest.raises(ValueError, match="expected one core statement"):
        build_index(**args)


def test_attributed_ai_chain_is_public_with_provenance_without_private_fulltext(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    _ledger(args)
    payload = build_index(**args)
    assertion = payload["assertions"][0]
    assert assertion["status"] == "ai-agent-reviewed"
    assert assertion["review"]["model"] == "test-fixture-model"
    assert assertion["evidence"][0]["review"]["agent_id"] == "test-fixture-agent"
    assert "PRIVATE FULL TEXT" not in json.dumps(payload)
    assert "source_path" not in json.dumps(payload)


def test_ai_receipt_must_cover_actual_exported_quote(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    ledger = _ledger(args)
    ledger["reviews"][0]["evidence"][0]["locator"] = "unrelated section"
    _write(args["ledger_path"], ledger)
    with pytest.raises(ValueError, match="does not cover quoted evidence"):
        build_index(**args)


def test_stale_ai_review_fails_closed(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    _ledger(args)
    path = args["vault"] / ASSERTION
    _write(path, path.read_text(encoding="utf-8") + "\nChanged after review.\n")
    with pytest.raises(ValueError, match="Stale AI review"):
        build_index(**args)


def test_missing_distillate_receipt_withholds_ai_assertion(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    ledger = _ledger(args)
    ledger["reviews"] = ledger["reviews"][:1]
    _write(args["ledger_path"], ledger)
    assert build_index(**args)["assertions"] == []


def test_later_negative_ai_review_withholds_assertion(tmp_path):
    args = fixture(tmp_path, "ai-agent-reviewed")
    ledger = _ledger(args)
    ledger["reviews"].append({**ledger["reviews"][0], "reviewed_at": "2026-09-05T10:00:00Z", "result": "changes_requested"})
    _write(args["ledger_path"], ledger)
    assert build_index(**args)["assertions"] == []
