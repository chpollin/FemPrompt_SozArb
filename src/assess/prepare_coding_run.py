"""Prepare the manifest of an analysis-coding run from the run template.

The manifest binds codebook, prompts, baseline commit, Work-Version assignments
and the hashes of the reading sources before any track starts. Track agents
never edit it; the orchestrator completes it after the run.

A work that already carries productive agent coding is admitted only with
``--recode`` and only when that coding is under an older codebook. The manifest
then binds each existing record by active annotation and canonical hash in
``recode_of`` (ADR-046).

    python -m src.assess.prepare_coding_run <run-id> <purpose> <paper-id> [...] [--recode]
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from src.assess.artifact_verification import record_hash
from src.assess.screening_lifecycle import active_codebook_version, recode_refusal

ROOT = Path(__file__).resolve().parents[2]
RUNS = ROOT / "tests" / "review-cases" / "agent-runs"
CODEBOOK = "assessment/categories.yaml"
TARGET = "docs/data/screening/ar2.json"
REVIEWER_PROMPT = ("prompts/prism-agent-reviewer-v1.4.md", "1.4")
REVIEW_PROMPT = ("prompts/prism-ai-agent-review-v0.4.md", "0.4")
ENVIRONMENT = {
    "harness": "Claude Code subagent",
    "provider": "Anthropic",
    "model": "opus",
    "model_id": "claude-opus-5-5",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def codebook_version() -> str:
    for line in (ROOT / CODEBOOK).read_text(encoding="utf-8").splitlines():
        if line.startswith("# Version:"):
            return line.split(":", 1)[1].split()[0]
    raise SystemExit("codebook version line not found")


def _version(value: str) -> tuple[int, ...]:
    return tuple(int(part) for part in value.split("."))


def recode_binding(paper_id: str, record_ids: list[str], productive: dict, codebook: str, recode: bool) -> dict | None:
    """Bind the existing productive records of a work, or refuse a work already coded."""
    existing = {rid: productive[rid] for rid in record_ids if rid in productive}
    if not existing:
        return None
    if not recode:
        raise SystemExit(f"{paper_id}: already has productive agent coding, use --recode for an older codebook")
    binding = {}
    for rid, record in sorted(existing.items()):
        refusal = recode_refusal(record)
        if refusal:
            raise SystemExit(f"{rid}: cannot be recoded, {refusal}")
        if _version(active_codebook_version(record)) >= _version(codebook):
            raise SystemExit(f"{rid}: already coded under codebook {active_codebook_version(record)}")
        binding[rid] = {
            "annotation_id": record["active_annotation_id"],
            "record_sha256": record_hash(record).removeprefix("sha256:"),
        }
    return binding


def paper_entry(paper_id: str, registry: dict, works: dict, productive: dict | None = None, recode: bool = False) -> dict:
    binding = registry["record_index"].get(paper_id)
    if not binding:
        raise SystemExit(f"{paper_id}: no registry binding")
    work = works.get(binding["work_id"])
    if not work or work.get("effective_decision") != "Include" or work.get("integrity_hold"):
        raise SystemExit(f"{paper_id}: not an effective Include without hold")
    preferred = work["preferred_version_id"]
    # Coding reads the preferred Version only; another Version's text would bind the wrong source.
    if binding["version_id"] != preferred:
        raise SystemExit(f"{paper_id}: record is not the preferred Version")
    source = ROOT / "docs" / "data" / "fulltext" / f"{paper_id}.md"
    if not source.exists():
        raise SystemExit(f"{paper_id}: no reading text, run npm run build first")
    version = next(
        (v for w in registry["works"] if w["work_id"] == binding["work_id"] for v in w["versions"] if v["version_id"] == preferred),
        {},
    )
    rel = source.relative_to(ROOT).as_posix()
    digest = sha256(source)
    record_ids = sorted(
        rid for rid in work["record_ids"] if registry["record_index"].get(rid, {}).get("version_id") == preferred
    )
    recode_of = recode_binding(paper_id, record_ids, productive or {}, codebook_version(), recode)
    entry = {
        "paper_id": paper_id,
        "title": work["title"],
        "work_id": binding["work_id"],
        "version_id": preferred,
        "version_type": version.get("version_type", "unknown"),
        "preferred_version_id": preferred,
        "selected_version_is_preferred": True,
        # Records of another Version keep their own source identity and never inherit this coding.
        "record_ids": record_ids,
        "human_coverage": work.get("decision_authority") == "legacy_human",
        "ai_agent_review_coverage": recode_of is not None,
        "source": {"path": rel, "sha256": digest, "version_id": preferred},
    }
    if recode_of is not None:
        entry["recode_of"] = recode_of
    return entry


def build(run_id: str, purpose: str, paper_ids: list[str], recode: bool = False) -> dict:
    registry = json.loads((ROOT / "corpus" / "work_version_registry.json").read_text(encoding="utf-8"))
    package = json.loads((ROOT / "generated" / "completion" / "completion-package.json").read_text(encoding="utf-8"))
    works = {w["work_id"]: w for w in package["works"]}
    template = json.loads((RUNS / "run-template.json").read_text(encoding="utf-8"))
    run = json.loads(json.dumps(template).replace("replace-me", run_id))
    productive = json.loads((ROOT / TARGET).read_text(encoding="utf-8"))["decisions"]
    papers = [paper_entry(pid, registry, works, productive, recode) for pid in paper_ids]
    base = f"tests/review-cases/agent-runs/{run_id}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    run["codebook"] = {"path": CODEBOOK, "version": codebook_version(), "sha256": sha256(ROOT / CODEBOOK)}
    run["prompt"] = {"path": REVIEWER_PROMPT[0], "version": REVIEWER_PROMPT[1], "sha256": sha256(ROOT / REVIEWER_PROMPT[0])}
    run["baseline"] = {"commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()}
    run["assignment"] = {"complete": True, "papers": papers}
    run["isolation"]["model_diversity"] = "same_model"
    run["timestamps"]["created_at"] = now
    run["execution"]["purpose"] = purpose
    run["execution"]["protocol_basis"] = "knowledge/update-protocol.md#Agent-assisted completion"
    assignments = [
        {"paper_id": p["paper_id"], "version_id": p["version_id"], "source_path": p["source"]["path"], "source_sha256": p["source"]["sha256"]}
        for p in papers
    ]
    for track in run["tracks"]:
        track["execution_environment"] = dict(ENVIRONMENT)
        track["paper_ids"] = [p["paper_id"] for p in papers]
        track["source_assignments"] = copy.deepcopy(assignments)
    activity = run["provenance"]["activities"][0]
    activity["id"] = f"{run_id}:ai-agent-review"
    activity["run_id"] = run_id
    activity["prompt"] = {"path": REVIEW_PROMPT[0], "version": REVIEW_PROMPT[1], "sha256": sha256(ROOT / REVIEW_PROMPT[0])}
    activity["model"] = {"provider": ENVIRONMENT["provider"], "model": ENVIRONMENT["model"], "immutable_model_id": ENVIRONMENT["model_id"]}
    activity["execution_environment"] = dict(ENVIRONMENT)
    run["integration"] = {"status": "not_integrated", "reason": "Prepared run. Integration follows a fully resolved AI Agent Review."}
    assert base in json.dumps(run)
    return run


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("run_id")
    parser.add_argument("purpose")
    parser.add_argument("paper_ids", nargs="+")
    parser.add_argument("--recode", action="store_true", help="recode works coded under an older codebook")
    args = parser.parse_args()
    folder = RUNS / args.run_id
    if (folder / "run.json").exists():
        raise SystemExit(f"{folder / 'run.json'} exists, a prepared manifest is never overwritten")
    run = build(args.run_id, args.purpose, args.paper_ids, args.recode)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "run.json").write_text(json.dumps(run, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(folder / "run.json")


if __name__ == "__main__":
    main()
