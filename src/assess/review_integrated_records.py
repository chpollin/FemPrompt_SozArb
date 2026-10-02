"""Write AI source-review receipts for records an agent run integrated into PRISM.

For every record in ``integration.new_record_ids`` and ``recoded_record_ids`` of
the given runs the reviewing agent compares the current productive record with
the run's product and final AI Agent Review coding, resolves every evidence
snippet in the tracked reading source, checks the Work-Version identity against
the registry and confirms the lifecycle stops at ai-agent-reviewed. A recoded
record must also supersede its bound pre-run record (read from ``--base-ref``)
under ADR-046 and keep its history as an exact prefix. A record passes only if every check holds;
otherwise the receipt says changes_requested and names the failed checks.

The receipt attests these comparisons by the named agent. It grants no human
verification and does not re-read the full text for substantive adequacy.

    python -m src.assess.review_integrated_records OUTPUT RUN_DIR [RUN_DIR ...]
"""
from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from src.analysis.work_versions import source_binding_for_record
from src.assess.artifact_verification import SCHEMA, artifact_hash, record_hash

REPO = Path(__file__).resolve().parents[2]
REGISTRY = "corpus/work_version_registry.json"
MANIFEST = "docs/data/fulltext_manifest.json"
LEVEL = {"nein": 0, "teilweise": 1, "ja": 2}
AUTHORITY = (
    "Acceptance is an attributed AI source-review receipt for this exact current record; "
    "deterministic validation and later domain-expert verification are separate."
)
SCOPE = (
    "Exact comparison of the current productive record with the run product and the frozen "
    "AI Agent Review final coding, whitespace-normalised resolution of every evidence term and "
    "snippet in the tracked reading source, Work-Version identity against the registry record "
    "index and lifecycle state. No new blinded coding, no full-text reassessment of the coding "
    "and no human verification or publication approval."
)


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")


def load(path: str) -> dict:
    return json.loads((REPO / path).read_text(encoding="utf-8"))


def normalised(text: str) -> tuple[str, list[int]]:
    """Collapse whitespace and keep each output character's original offset."""
    chars, offsets, gap = [], [], False
    for index, char in enumerate(text):
        if char.isspace():
            gap = bool(chars)
            continue
        if gap:
            chars.append(" ")
            offsets.append(index)
            gap = False
        chars.append(char)
        offsets.append(index)
    return "".join(chars), offsets


def expected_record(final: dict, paper: dict) -> dict:
    """Mirror buildPrismRecord in tests/review-cases/build-prism-track.mjs."""
    evidence = {
        category: [
            {"term": quote.strip()[:80], "snippet": quote.strip()[:260],
             "paper_id": paper["paper_id"], "work_id": paper["work_id"], "version_id": paper["version_id"]}
            for quote in quotes
        ]
        for category, quotes in final["evidence"].items() if quotes
    }
    expected = {
        "categories": {key: LEVEL[value] for key, value in final["categories"].items() if LEVEL[value] > 0},
        "decision": final["decision"],
        "reason": final["reason"] if final["decision"] == "Exclude" else None,
        "evidence": evidence,
    }
    if final["decision"] == "Include":
        fields = {key: value for key, value in final["analysis"].items() if key != "undecidable"}
        expected["analysis"] = {"fields": fields, "undecidable": final["analysis"].get("undecidable", {})}
    return expected


def actual_record(record: dict) -> dict:
    keys = ("term", "snippet", "paper_id", "work_id", "version_id")
    actual = {
        "categories": record.get("categories"),
        "decision": record.get("decision"),
        "reason": record.get("reason"),
        "evidence": {
            category: [{key: item.get(key) for key in keys} for item in items]
            for category, items in record.get("evidence", {}).items()
        },
    }
    if "analysis" in record:
        actual["analysis"] = {key: record["analysis"].get(key) for key in ("fields", "undecidable")}
    return actual


def recode_failures(record_id: str, record: dict, paper: dict, run: dict, base: dict) -> list[str]:
    """ADR-046: the recode supersedes the bound record and keeps it as an exact history prefix."""
    failures = []
    binding = (paper.get("recode_of") or {}).get(record_id)
    previous = base.get("decisions", {}).get(record_id)
    if not binding or previous is None:
        return ["the recode has no recode_of binding or no pre-run record to supersede"]
    if record_hash(previous) != "sha256:" + binding["record_sha256"].removeprefix("sha256:"):
        failures.append("the pre-run record hash differs from the run's recode_of binding")
    annotations = record.get("annotations", [])
    active = annotations[-1] if annotations else {}
    if (active.get("annotation_type") != "ai_agent_recode" or record.get("active_annotation_id") != active.get("annotation_id")
            or active.get("supersedes") != binding["annotation_id"]
            or previous.get("active_annotation_id") != binding["annotation_id"]
            or active.get("supersedes_record_sha256") != record_hash(previous)
            or active.get("codebook_version") != run["codebook"]["version"]):
        failures.append("the active annotation is not an ai_agent_recode superseding the bound annotation and record hash")
    events = record.get("lifecycle", {}).get("events", [])
    previous_events = previous.get("lifecycle", {}).get("events", [])
    if (annotations[:-1] != previous.get("annotations")
            or record.get("lifecycle", {}).get("baseline") != previous.get("lifecycle", {}).get("baseline")
            or events[:len(previous_events)] != previous_events
            or record.get("checks", [])[:len(previous.get("checks", []))] != previous.get("checks", [])):
        failures.append("earlier annotations, baseline, events or checks are not preserved as an exact prefix")
    reviewer = next(item["actor_id"] for item in run["provenance"]["activities"] if item["type"] == "ai_agent_review")
    recode_events = [event for event in events[len(previous_events):] if event.get("event_type") == "ai_agent_recode"]
    if (len(recode_events) != 1 or recode_events[0].get("annotation_id") != active.get("annotation_id")
            or recode_events[0].get("result") != "accepted"
            or (recode_events[0].get("from"), recode_events[0].get("to")) != ("ai-agent-reviewed", "ai-agent-reviewed")
            or recode_events[0].get("actor_ids") != [reviewer]):
        failures.append("the ai_agent_recode lifecycle event is missing or misattributed")
    return failures


def review_record(record_id: str, run_dir: str, run: dict, product: dict, review: dict,
                  current: dict, registry: dict, manifest: dict, started: str, base: dict) -> dict:
    paper = next(item for item in run["assignment"]["papers"] if record_id in item["record_ids"])
    record = current["decisions"].get(record_id)
    canonical = registry["record_index"].get(record_id, {})
    binding = source_binding_for_record(registry, record_id, REPO)
    if binding:
        source_path, source_version = binding["source_path"], binding["source_version_id"]
    else:
        source_path = "generated/markdown_clean/" + manifest.get(record_id, {}).get("source_file", "")
        source_version = canonical.get("version_id")
    failures, notes = [], []

    if record is None:
        failures.append("the record is absent from the productive file")
        record = {}
    if record != product["decisions"].get(record_id):
        failures.append(f"the productive record differs from {run_dir}/product-v0.5.json")
    final = review["records"][paper["paper_id"]]["final_coding"]
    if actual_record(record) != expected_record(final, paper):
        failures.append("categories, decision, reason, evidence or analysis differ from the final AI Agent Review coding")
    active = next((item for item in record.get("annotations", [])
                   if item.get("annotation_id") == record.get("active_annotation_id")), {})
    body = active.get("body", {})
    if any(body.get(key) != record.get(key) for key in ("categories", "decision", "reason", "evidence", "analysis")):
        failures.append("the active annotation body differs from the projected record")

    if not canonical:
        failures.append("the record has no entry in the registry record index")
    elif (record.get("work_id"), record.get("version_id")) != (canonical["work_id"], canonical["version_id"]):
        failures.append(
            f"record identity {record.get('work_id')} / {record.get('version_id')} differs from the registry "
            f"record index {canonical['work_id']} / {canonical['version_id']}"
            + (f" (record copied from representative {paper['paper_id']})" if paper["paper_id"] != record_id else "")
        )
    items = [(category, item) for category, values in record.get("evidence", {}).items() for item in values]
    if any((item.get("work_id"), item.get("version_id")) != (record.get("work_id"), record.get("version_id")) for _, item in items):
        failures.append("evidence items carry another Work-Version identity than the record")

    path = REPO / source_path
    evidence = []
    if not path.is_file() or source_path.endswith("/"):
        failures.append(f"the tracked reading source {source_path} is missing")
    else:
        text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
        body_text, offsets = normalised(text)
        source_hash = artifact_hash(REPO, source_path)
        unresolved = 0
        for category, item in items:
            positions = [body_text.find(" ".join(item.get(field, "").split())) for field in ("term", "snippet")]
            if min(positions) < 0 or not item.get("snippet", "").strip():
                unresolved += 1
                continue
            if any(entry.get("category") == category for entry in evidence):
                continue
            line = text.count("\n", 0, offsets[positions[1]]) + 1
            entry = {"source_path": source_path, "sha256": source_hash,
                     "work_id": canonical.get("work_id", record.get("work_id")), "version_id": source_version,
                     "category": category, "locator": f"line {line}", "quote": item["snippet"]}
            evidence.append(entry)
        if unresolved:
            failures.append(f"{unresolved} of {len(items)} evidence term/snippet pairs do not resolve in {source_path}")
        else:
            notes.append(f"all {len(items)} evidence terms and snippets resolve in {source_path}")

    lifecycle = record.get("lifecycle", {})
    if record_id in run["integration"].get("recoded_record_ids", []):
        failures.extend(recode_failures(record_id, record, paper, run, base))
    targets = {event.get("to") for event in lifecycle.get("events", [])}
    if lifecycle.get("state") != "ai-agent-reviewed" or targets & {"verified", "publication-approved"}:
        failures.append(f"lifecycle state {lifecycle.get('state')!r} or its events go beyond ai-agent-reviewed")

    recode = (" The active annotation is an ai_agent_recode superseding the bound pre-run annotation and record hash; "
              "earlier annotations, baseline, events and checks are preserved as an exact prefix; the accepted "
              "ai_agent_recode event is attributed to the run's AI Agent Review actor."
              if record_id in run["integration"].get("recoded_record_ids", []) else "")
    alias = f" Alias of {paper['paper_id']}, sharing its final coding." if paper["paper_id"] != record_id else ""
    if failures:
        findings = "Changes requested: " + "; ".join(failures) + "." + alias
        result = "changes_requested"
    else:
        findings = (
            f"The current productive record equals {run_dir}/product-v0.5.json and the final coding of "
            f"{paper['paper_id']} in ai-agent-review.json (categories, decision, reason, evidence and analysis); "
            f"the active annotation body matches; {'; '.join(notes)}; the Work-Version identity equals the registry "
            "record index; the lifecycle state is ai-agent-reviewed without human verification or publication "
            "approval." + recode + alias
        )
        result = "accepted"
    receipt = {
        "review_type": "ai-source-review",
        "agent_id": ARGS.agent_id,
        "actor_type": "ai_agent",
        "model": ARGS.model,
        "provider": ARGS.provider,
        "model_id": ARGS.model_id,
        "review_started_at": started,
        "reviewed_at": now(),
        "result": result,
        "authority": AUTHORITY,
        "artifact": f"{ARGS.target}#/decisions/{record_id}",
        "sha256": record_hash(record),
        "canonical_binding": {"paper_id": record_id, **canonical},
    }
    if binding:
        receipt["source_binding"] = binding
    reference = f"{REGISTRY}#/record_index/{record_id}"
    receipt.update({
        "binding_reference": reference,
        "binding_sha256": artifact_hash(REPO, reference) if canonical else None,
        "findings": findings,
        "review_scope": SCOPE,
        "evidence": evidence,
    })
    return receipt


def main() -> None:
    started = now()
    registry, manifest, current = load(REGISTRY), load(MANIFEST), load(ARGS.target)
    # The pre-run productive file is the recode base; the working tree already holds the merge.
    base = json.loads(subprocess.run(["git", "show", f"{ARGS.base_ref}:{ARGS.target}"], cwd=REPO, check=True,
                                     capture_output=True).stdout.decode("utf-8"))
    reviews, inputs, scope, runs = [], [], [], []
    for run_dir in ARGS.runs:
        run_dir = run_dir.rstrip("/")
        run = load(f"{run_dir}/run.json")
        product, review = load(f"{run_dir}/product-v0.5.json"), load(f"{run_dir}/ai-agent-review.json")
        if run["integration"]["target"] != ARGS.target:
            raise ValueError(f"{run_dir} integrated into {run['integration']['target']}")
        runs.append(run["run_id"])
        for name in ("run.json", "product-v0.5.json", "ai-agent-review.json"):
            inputs.append({"path": f"{run_dir}/{name}", "sha256": artifact_hash(REPO, f"{run_dir}/{name}")})
        integration = run["integration"]
        for record_id in [*integration["new_record_ids"], *integration.get("recoded_record_ids", [])]:
            reviews.append(review_record(record_id, run_dir, run, product, review, current, registry, manifest, started, base))
            scope.append(record_id)
    for path in (ARGS.target, REGISTRY, MANIFEST):
        inputs.append({"path": path, "sha256": artifact_hash(REPO, path)})
    rejected = [item["artifact"].rsplit("/", 1)[1] for item in reviews if item["result"] != "accepted"]
    batch = {
        "schema": SCHEMA,
        "reviews": reviews,
        "projected_record_review_activity": {
            "id": ARGS.activity_id,
            "type": "ai_source_projected_record_review",
            "actor_id": ARGS.agent_id,
            "actor_type": "ai_agent",
            "model": ARGS.model,
            "provider": ARGS.provider,
            "model_id": ARGS.model_id,
            "started_at": started,
            "completed_at": now(),
            "runs": runs,
            "input_artifacts": inputs,
            "scope": scope,
            "result": "accepted" if not rejected else "changes_requested_for_some",
            "changes_requested_record_ids": rejected,
            "checks": SCOPE,
        },
    }
    output = REPO / ARGS.output
    output.write_text(json.dumps(batch, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"{len(reviews)} receipts, {len(reviews) - len(rejected)} accepted, changes requested: {rejected or 'none'}")


parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("output", help="repository-relative batch path under generated/verification/")
parser.add_argument("runs", nargs="+", help="repository-relative run directories")
parser.add_argument("--target", default="docs/data/screening/ar2.json")
parser.add_argument("--base-ref", default="HEAD", help="git revision holding the pre-run productive file")
parser.add_argument("--agent-id", required=True)
parser.add_argument("--model", required=True)
parser.add_argument("--provider", required=True)
parser.add_argument("--model-id", required=True)
parser.add_argument("--activity-id", required=True)

if __name__ == "__main__":
    ARGS = parser.parse_args()
    main()
