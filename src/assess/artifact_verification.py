"""Validate attributed AI source-review receipts without granting human authority.

A receipt records a scholarly reading by a named AI agent. This module only
checks its integrity, identity and completeness; passing it is not a new review.
Text hashes use UTF-8 with LF endings; JSON-pointer hashes use canonical JSON.
"""
from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any

SCHEMA = "femprompt-artifact-verification/0.1"
POLICY_PATH = "config/publication_policy.json"
LEDGER_PATH = "generated/verification/ai-source-reviews.json"


class ValidatedReviews(dict[str, dict[str, Any]]):
    """Accepted receipts with retained latest outcomes for revocation checks."""

    def __init__(self, accepted: dict, latest: dict):
        super().__init__(accepted)
        self.latest = latest


def record_hash(record: Any) -> str:
    text = json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()


def safe_path(repo: Path, reference: str) -> Path:
    if not isinstance(reference, str) or not reference or "\\" in reference:
        raise ValueError("Expected a nonempty repository-relative POSIX path")
    path = (repo / reference).resolve()
    if Path(reference).is_absolute() or not path.is_relative_to(repo.resolve()):
        raise ValueError(f"Reference escapes repository: {reference}")
    return path


def artifact_hash(repo: Path, reference: str) -> str:
    filename, separator, pointer = reference.partition("#")
    path = safe_path(repo, filename)
    if separator:
        if not pointer.startswith("/"):
            raise ValueError(f"Invalid JSON pointer: {reference}")
        value = json.loads(path.read_text(encoding="utf-8"))
        for token in pointer[1:].split("/"):
            token = token.replace("~1", "/").replace("~0", "~")
            value = value[int(token)] if isinstance(value, list) else value[token]
        return record_hash(value)
    data = path.read_bytes()
    if path.suffix.lower() in {".md", ".json", ".yaml", ".yml", ".csv", ".txt", ".ris"}:
        data = data.replace(b"\r\n", b"\n")
    return "sha256:" + hashlib.sha256(data).hexdigest()


def _json_value(repo: Path, reference: str) -> Any:
    filename, separator, pointer = reference.partition("#")
    value = json.loads(safe_path(repo, filename).read_text(encoding="utf-8"))
    if separator:
        if not pointer.startswith("/"):
            raise ValueError(f"Invalid JSON pointer: {reference}")
        for token in pointer[1:].split("/"):
            token = token.replace("~1", "/").replace("~0", "~")
            value = value[int(token)] if isinstance(value, list) else value[token]
    return value


def screening_correction(repo: Path, receipt: dict, decision: dict, artifact: str) -> tuple[dict, dict]:
    """Apply an attributed analysis correction to a projection, never to history."""
    filename, _, pointer = receipt["artifact"].partition("#")
    data = json.loads(safe_path(repo, filename).read_text(encoding="utf-8"))
    if data.get("schema") != "femprompt-screening-corrections/0.1" or not pointer.startswith("/corrections/"):
        raise ValueError("Unsupported screening correction artifact")
    paper_id = pointer.removeprefix("/corrections/").replace("~1", "/").replace("~0", "~")
    correction = data["corrections"][paper_id]
    expected_pointer = "/decisions/" + paper_id.replace("~", "~0").replace("/", "~1")
    if artifact.partition("#")[2] != expected_pointer or correction.get("paper_id") != paper_id or correction.get("base_artifact") != artifact or correction.get("base_sha256") != record_hash(decision):
        raise ValueError(f"Stale or mismatched screening correction: {paper_id}")
    if artifact_hash(repo, receipt["artifact"]) != receipt["sha256"]:
        raise ValueError(f"Stale screening correction receipt: {paper_id}")
    for field in ("agent_id", "model", "corrected_at"):
        if not isinstance(correction.get(field), str) or not correction[field].strip():
            raise ValueError(f"Correction lacks {field}")
    corrected_at = datetime.fromisoformat(correction["corrected_at"].replace("Z", "+00:00"))
    reviewed_at = datetime.fromisoformat(receipt["reviewed_at"].replace("Z", "+00:00"))
    if corrected_at.tzinfo is None or reviewed_at.tzinfo is None or corrected_at > reviewed_at:
        raise ValueError("Correction must have a timezone and precede its review")
    changes = correction.get("changes")
    if not isinstance(changes, list) or not changes:
        raise ValueError("Correction has no field changes")
    projected = deepcopy(decision)
    paths = set()
    for change in changes:
        path = change.get("path", "")
        tokens = path.split("/")
        if len(tokens) != 4 or tokens[:3] != ["", "analysis", "fields"] or not tokens[3].startswith("AN_") or path in paths:
            raise ValueError(f"Unsupported or repeated AI correction path: {path}")
        fields = projected.get("analysis", {}).get("fields", {})
        if tokens[3] not in fields or fields[tokens[3]] != change.get("before") or "after" not in change or not change.get("reason"):
            raise ValueError(f"Correction does not match original analysis: {path}")
        fields[tokens[3]] = deepcopy(change["after"])
        paths.add(path)
    return projected, correction


def reviewed_screening_projection(repo: Path, artifact: str, decision: dict, reviews: dict) -> tuple[dict, dict | None, dict | None]:
    """Use the latest family outcome; a revocation cannot revive older coding."""
    latest = getattr(reviews, "latest", reviews)
    candidates = [latest[artifact]] if artifact in latest else []
    paper_id = artifact.partition("#")[2].removeprefix("/decisions/").replace("~1", "/").replace("~0", "~")
    for receipt in latest.values():
        if "#/corrections/" not in receipt["artifact"]:
            continue
        # Negative receipts remain meaningful after an obsolete correction file
        # is removed. Prefer their recorded target over mutable artifact bytes.
        if receipt.get("result") != "accepted":
            if receipt.get("base_artifact"):
                if receipt["base_artifact"] == artifact:
                    candidates.append(receipt)
                continue
            binding = receipt.get("canonical_binding")
            if isinstance(binding, dict) and binding.get("paper_id"):
                if binding["paper_id"] == paper_id:
                    candidates.append(receipt)
                continue
        try:
            correction = _json_value(repo, receipt["artifact"])
        except (FileNotFoundError, KeyError, IndexError, json.JSONDecodeError):
            if receipt.get("result") == "accepted":
                raise
            # Older receipts may not carry a separate binding. The correction
            # pointer still names its record; losing the file cannot un-revoke it.
            pointer_id = receipt["artifact"].partition("#")[2].removeprefix("/corrections/").replace("~1", "/").replace("~0", "~")
            if pointer_id == paper_id:
                candidates.append(receipt)
            continue
        if isinstance(correction, dict) and correction.get("base_artifact") == artifact:
            candidates.append(receipt)
    if not candidates:
        return decision, None, None
    times = [datetime.fromisoformat(item["reviewed_at"].replace("Z", "+00:00")) for item in candidates]
    newest_at = max(times)
    newest = [item for item, at in zip(candidates, times) if at == newest_at]
    if len({record_hash(item) for item in newest}) > 1:
        raise ValueError(f"Conflicting screening family reviews at the same time: {artifact}")
    receipt = newest[0]
    if receipt.get("result") != "accepted":
        return decision, None, None
    if "#/corrections/" in receipt["artifact"]:
        projected, correction = screening_correction(repo, receipt, decision, artifact)
        return projected, receipt, correction
    if receipt.get("sha256") != record_hash(decision):
        raise ValueError(f"Stale AI verification receipt: {artifact}")
    return decision, receipt, None


def load_publication_policy(repo: Path) -> dict[str, Any]:
    policy = json.loads(safe_path(repo, POLICY_PATH).read_text(encoding="utf-8"))
    if policy.get("schema") != "femprompt-publication-policy/0.1":
        raise ValueError("Unsupported publication policy")
    states = policy.get("allowed_states")
    if not isinstance(states, list) or not states or set(states) - {
        "ai-agent-reviewed", "verified", "publication-approved"
    }:
        raise ValueError("Invalid publication states")
    return policy


def validated_reviews(repo: Path, ledger: dict[str, Any]) -> ValidatedReviews:
    """Return current accepted receipts; any later negative review withholds them.

All entries need real attribution. Only accepted entries are eligible for
publication, and their artifacts and source bytes must still match. Negative
outcomes can describe obsolete artifacts without blocking an unrelated release.
"""
    if ledger.get("schema") != SCHEMA or not isinstance(ledger.get("reviews"), list):
        raise ValueError("Unsupported AI source-review ledger")
    latest: dict[str, tuple[datetime, dict[str, Any]]] = {}
    for receipt in ledger["reviews"]:
        if not isinstance(receipt, dict):
            raise ValueError("Review must be an object")
        for field in ("artifact", "sha256", "agent_id", "model", "reviewed_at", "findings"):
            if not isinstance(receipt.get(field), str) or not receipt[field].strip():
                raise ValueError(f"Review lacks {field}")
        if receipt.get("review_type") != "ai-source-review":
            raise ValueError("Receipt is not an AI source review")
        if receipt.get("result") not in {"accepted", "changes_requested", "unverifiable"}:
            raise ValueError("Unsupported AI review result")
        at = datetime.fromisoformat(receipt["reviewed_at"].replace("Z", "+00:00"))
        if at.tzinfo is None:
            raise ValueError("Review timestamp needs a timezone")
        artifact = receipt["artifact"]
        safe_path(repo, artifact.partition("#")[0])
        prior = latest.get(artifact)
        if prior is not None and at == prior[0] and receipt != prior[1]:
            raise ValueError(f"Conflicting reviews at the same time: {artifact}")
        if prior is None or at >= prior[0]:
            latest[artifact] = (at, receipt)
    accepted = {}
    registry_path = repo / "corpus/work_version_registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8")) if registry_path.is_file() else None
    identities = {
        (work["work_id"], version["version_id"])
        for work in (registry or {}).get("works", []) for version in work.get("versions", [])
    }
    for artifact, (_, receipt) in latest.items():
        if receipt["result"] != "accepted":
            continue
        if artifact_hash(repo, artifact) != receipt["sha256"]:
            raise ValueError(f"Stale AI review: {artifact}")
        if "#/corrections/" in artifact:
            correction = _json_value(repo, artifact)
            base_artifact = correction.get("base_artifact", "")
            base = _json_value(repo, base_artifact)
            screening_correction(repo, receipt, base, base_artifact)
        binding = receipt.get("canonical_binding")
        if binding is not None:
            paper_id = binding.get("paper_id") if isinstance(binding, dict) else None
            canonical = (registry or {}).get("record_index", {}).get(paper_id)
            if not canonical or any(binding.get(key) != canonical.get(key) for key in ("work_id", "version_id")):
                raise ValueError(f"AI review binding does not match the canonical registry: {artifact}")
            pointer = artifact.partition("#")[2]
            expected = "/decisions/" + paper_id.replace("~", "~0").replace("/", "~1")
            if pointer not in {expected, expected.replace("/decisions/", "/corrections/", 1)}:
                raise ValueError(f"AI review binding targets a different screening record: {artifact}")
        evidence = receipt.get("evidence")
        if not isinstance(evidence, list) or not evidence:
            raise ValueError(f"Accepted review lacks source evidence: {artifact}")
        for source in evidence:
            if not isinstance(source, dict):
                raise ValueError(f"Malformed source evidence: {artifact}")
            for field in ("source_path", "sha256", "work_id", "version_id", "locator"):
                if not isinstance(source.get(field), str) or not source[field].strip():
                    raise ValueError(f"Source evidence lacks {field}: {artifact}")
            if not source["work_id"].startswith("work:") or not source["version_id"].startswith("version:"):
                raise ValueError(f"Evidence lacks canonical Work-Version identity: {artifact}")
            if registry is not None and (source["work_id"], source["version_id"]) not in identities:
                raise ValueError(f"AI review evidence does not resolve in the canonical registry: {artifact}")
            if artifact_hash(repo, source["source_path"]) != source["sha256"]:
                raise ValueError(f"Stale source in AI review: {source['source_path']}")
            if source.get("quote"):
                body = safe_path(repo, source["source_path"]).read_text(encoding="utf-8")
                if " ".join(source["quote"].split()) not in " ".join(body.split()):
                    raise ValueError(f"Review quotation does not resolve: {artifact}")
        if binding and not any(all(source[key] == binding[key] for key in ("work_id", "version_id")) for source in evidence):
            raise ValueError(f"AI review binding has no matching source evidence: {artifact}")
        accepted[artifact] = receipt
    return ValidatedReviews(accepted, {artifact: receipt for artifact, (_, receipt) in latest.items()})


def load_reviews(repo: Path) -> dict[str, dict[str, Any]]:
    path = safe_path(repo, LEDGER_PATH)
    if not path.is_file():
        return {}
    return validated_reviews(repo, json.loads(path.read_text(encoding="utf-8")))
