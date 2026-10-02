"""Orchestrator steps of an analysis-coding run after its agents have finished.

    python -m src.assess.complete_coding_run tracks <run-id> --started-at <utc>
    python -m src.assess.complete_coding_run review <run-id> --started-at <utc> [--flag ID=reason ...]
    python -m src.assess.complete_coding_run integrate <run-id>

`tracks` copies each track's packet and report from its working folder into the
run folder and transfers it through the production PRISM functions. `review`
validates the AI Agent Review, computes the track agreement, draws the spot-check
sample and completes the manifest. `integrate` merges the reviewed product
append-only into the productive agent track; a record the manifest binds in
`recode_of` is replaced by its recode, which keeps the earlier annotation as history. Every step refuses to continue on a
failed validator, so a blocked record never reaches productive data.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RUNS = "tests/review-cases/agent-runs"
WORK = "tmp/agent-runs"
TARGET = "docs/data/screening/ar2.json"
SPOT_FIELDS = [
    "AN_Task",
    "AN_Gender_Definition",
    "AN_Bias_Definition",
    "AN_Gender_Understanding",
    "AN_Theory_Reference",
    "AN_Bias_Axes",
    "AN_Harm_Types",
]


def now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256(rel: str) -> str:
    return hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()


def mtime(rel: str) -> str:
    return datetime.fromtimestamp((ROOT / rel).stat().st_mtime, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def copy_lf(source: str, target: str) -> None:
    # The repository checks text out with LF, so a hash over agent-written CRLF bytes would break in every clone.
    (ROOT / target).write_bytes((ROOT / source).read_bytes().replace(b"\r\n", b"\n"))


def run_cmd(*args: str) -> str:
    result = subprocess.run(list(args), cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        raise SystemExit(f"failed: {' '.join(args)}\n{result.stdout}\n{result.stderr}")
    return result.stdout


def load(run_id: str) -> tuple[str, dict]:
    path = f"{RUNS}/{run_id}/run.json"
    return path, json.loads((ROOT / path).read_text(encoding="utf-8"))


def save(path: str, run: dict) -> None:
    (ROOT / path).write_text(json.dumps(run, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    run_cmd("node", "tests/review-cases/validate-run-contract.mjs", path)


def created(rel: str) -> str:
    # On Windows st_ctime is the creation time of the track's working folder, the closest record of its start.
    return datetime.fromtimestamp((ROOT / rel).stat().st_ctime, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def tracks(run_id: str, started_at: str | None) -> None:
    manifest, run = load(run_id)
    base = f"{RUNS}/{run_id}"
    (ROOT / base / "tracks").mkdir(exist_ok=True)
    (ROOT / base / "reports").mkdir(exist_ok=True)
    records = 0
    for track in run["tracks"]:
        key = track["reviewer_id"]
        packet, report = track["coding_packet"], track["report"]
        source_packet = f"{WORK}/{run_id}/{key}/{key}-coding.json"
        copy_lf(source_packet, packet)
        copy_lf(f"{WORK}/{run_id}/{key}/{key}.md", report)
        run_cmd("node", "tests/review-cases/validate-coding-packet.mjs", manifest, key, packet)
        projection = f"{base}/tracks/{key}-projection.json"
        run_cmd("node", "tests/review-cases/build-prism-track.mjs", manifest, key, projection)
        run_cmd("node", "tests/review-cases/roundtrip-prism-track.mjs", manifest, key, projection, track["output"]["path"])
        run_cmd("node", "tests/review-cases/validate-prism-track.mjs", manifest, key, track["output"]["path"])
        track.update(
            coding_packet_sha256=sha256(packet),
            report_sha256=sha256(report),
            started_at=started_at or created(f"{WORK}/{run_id}/{key}"),
            completed_at=mtime(source_packet),
        )
        track["output"]["sha256"] = sha256(track["output"]["path"])
        records += len(track["paper_ids"])
    for output in run["outputs"]:
        if output["kind"] == "agent_track":
            output["sha256"] = sha256(output["path"])
    execution = run["execution"]
    execution["coding_packet_validation"].update(command=execution["coding_packet_validation"]["command"], result="pass", records=records)
    execution["frontend_roundtrip"].update(
        command=f"node tests/review-cases/roundtrip-prism-track.mjs {manifest} <reviewer-id> {base}/tracks/<reviewer-id>-projection.json {base}/tracks/<reviewer-id>.json",
        result="pass",
        records=records,
        transfer_actor="agent",
    )
    started_at = min(t["started_at"] for t in run["tracks"])
    run["status"] = "running"
    run["lifecycle"]["state"] = "running"
    run["timestamps"]["started_at"] = started_at
    run["lifecycle"]["events"] = [
        {
            "event_id": f"{run_id}:started",
            "event_type": "run_started",
            "from": "prepared",
            "to": "running",
            "activity_id": f"{run_id}:source-coding",
            "at": started_at,
            "actor_ids": [t["actor_id"] for t in run["tracks"]],
        }
    ]
    save(manifest, run)
    print(f"{run_id}: tracks transferred, {records} records")


def spot_check(run_id: str, base: str, flags: dict[str, str]) -> dict:
    agreement = json.loads((ROOT / base / "track-agreement.json").read_text(encoding="utf-8"))
    packets = {
        key: json.loads((ROOT / base / "tracks" / f"{key}-coding.json").read_text(encoding="utf-8"))["decisions"]
        for key in ("ar1", "ar2")
    }
    agreeing, differing = [], []
    for paper_id in sorted(packets["ar1"]):
        left, right = packets["ar1"][paper_id], packets["ar2"].get(paper_id, {})
        if left.get("decision") != "Include" or right.get("decision") != "Include":
            continue
        fields = set(left.get("analysis", {})) | set(right.get("analysis", {}))
        fields -= {"AN_Notes", "undecidable"}
        same = all(_norm(left["analysis"].get(f)) == _norm(right["analysis"].get(f)) for f in fields)
        (agreeing if same else differing).append(paper_id)
    total = len(agreeing) + len(differing)
    size = min(total, max(5, math.ceil(0.15 * total)))
    seed = int(run_id.rsplit("-", 1)[-1]) + int(run_id.split("-")[3])
    rng = random.Random(seed)
    half = min(len(agreeing), math.ceil(size / 2))
    drawn = rng.sample(agreeing, half)
    drawn += rng.sample(differing, min(len(differing), size - half))
    if len(drawn) < size:
        rest = sorted(set(agreeing) - set(drawn))
        drawn += rng.sample(rest, min(len(rest), size - len(drawn)))
    return {
        "schema": "femprompt-spot-check-sample/0.1",
        "run_id": run_id,
        "status": "proposed",
        "seed": seed,
        "rule": "max(5, ceil(15 percent of the run)) works, half drawn from works whose tracks agreed on every analysis field and the rest from works with at least one analysis-field difference, using Python random.Random(seed).sample on the sorted IDs, plus every work an agent or the AI Agent Review flagged for a domain-expert decision",
        "agreeing_works": agreeing,
        "disagreeing_works": differing,
        "drawn": sorted(drawn),
        "flagged_additions": sorted(set(flags) - set(drawn)),
        "fields": SPOT_FIELDS,
        "flag_reasons": flags,
        "track_agreement_sha256": hashlib.sha256(json.dumps(agreement, sort_keys=True).encode()).hexdigest(),
    }


def _norm(value):
    return sorted(value) if isinstance(value, list) else value


def review(run_id: str, started_at: str, flags: dict[str, str]) -> None:
    manifest, run = load(run_id)
    base = f"{RUNS}/{run_id}"
    review_path = f"{base}/ai-agent-review.json"
    review_report = f"{base}/reports/ai-agent-review.md"
    copy_lf(review_path, review_path)
    copy_lf(review_report, review_report)
    run_cmd("node", "tests/review-cases/validate-ai-agent-review.mjs", manifest, review_path)
    agreement = f"{base}/track-agreement.json"
    run_cmd("python", "-m", "src.assess.agent_track_diagnostics", base, "--output", agreement)
    # The diagnostics hash binds the file bytes, so Windows line endings would break it on checkout.
    text = (ROOT / agreement).read_text(encoding="utf-8")
    (ROOT / agreement).write_text(text.replace("\r\n", "\n"), encoding="utf-8", newline="\n")
    sample = spot_check(run_id, base, flags)
    (ROOT / base / "spot-check-sample.json").write_text(
        json.dumps(sample, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n"
    )
    completed = mtime(review_path)
    activity = run["provenance"]["activities"][0]
    activity.update(
        status="completed",
        started_at=started_at,
        completed_at=completed,
        outputs=[
            {"kind": "ai_agent_review", "path": review_path, "sha256": sha256(review_path)},
            {"kind": "ai_agent_review_report", "path": review_report, "sha256": sha256(review_report)},
        ],
    )
    for output in run["outputs"]:
        if output["kind"] == "ai_agent_review":
            output["sha256"] = sha256(review_path)
    run["execution"]["track_agreement"] = {
        "command": f"python -m src.assess.agent_track_diagnostics {base} --output {agreement}",
        "path": agreement,
        "sha256": sha256(agreement),
        "label": "workflow_diagnostic_not_accuracy",
    }
    run["status"] = "completed"
    run["lifecycle"]["state"] = "completed"
    run["timestamps"]["completed_at"] = completed
    run["lifecycle"]["events"].append(
        {
            "event_id": f"{run_id}:completed",
            "event_type": "run_completed_after_ai_agent_review_without_integration",
            "from": "running",
            "to": "completed",
            "activity_id": f"{run_id}:ai-agent-review",
            "at": completed,
            "actor_ids": [f"{run_id}-ai-agent-review"],
        }
    )
    save(manifest, run)
    print(f"{run_id}: review accepted by validator, sample {sample['drawn']} + {sample['flagged_additions']}")


def integrate(run_id: str) -> None:
    manifest, run = load(run_id)
    base = f"{RUNS}/{run_id}"
    stamp = now()
    v04, v05 = f"{base}/product-v0.4.json", f"{base}/product-v0.5.json"
    run_cmd("node", "tests/review-cases/build-ai-agent-product.mjs", manifest, f"{base}/ai-agent-review.json", v04, stamp)
    run_cmd("python", "-m", "src.assess.screening_lifecycle", "migrate", v04, v05, "--base", TARGET, "--checked-at", stamp)
    before = json.loads((ROOT / TARGET).read_text(encoding="utf-8"))
    base_commit = run_cmd("git", "rev-parse", "HEAD").strip()
    base_hash = sha256(TARGET)
    merge = f"python -m src.assess.merge_ai_agent_product {TARGET} {v05} {TARGET}"
    run_cmd(*merge.split())
    after = json.loads((ROOT / TARGET).read_text(encoding="utf-8"))
    product = json.loads((ROOT / v05).read_text(encoding="utf-8"))
    new_ids = sorted(set(product["decisions"]) - set(before["decisions"]))
    recoded_ids = sorted(k for k in product["decisions"] if k in before["decisions"] and before["decisions"][k] != after["decisions"][k])
    run["integration"] = {
        "status": "integrated",
        "method": "append_only_validated_product_merge",
        "target": TARGET,
        "integrated_at": stamp,
        "base_commit": base_commit,
        "base_sha256": f"sha256:{base_hash}",
        "preexisting_record_count": len(before["decisions"]),
        "preexisting_records_preserved": all(
            after["decisions"].get(k) == v for k, v in before["decisions"].items() if k not in recoded_ids
        ),
        "new_record_ids": new_ids,
        "recoded_record_ids": recoded_ids,
        "resulting_sha256_at_merge": f"sha256:{sha256(TARGET)}",
        "merge_command": merge,
        "id": f"{run_id}:deterministic-integration",
        "actor_id": "orchestrator",
    }
    event = run["lifecycle"]["events"][-1]
    event["event_type"] = "run_completed_after_review_and_integration"
    event["activity_id"] = f"{run_id}:deterministic-integration"
    save(manifest, run)
    print(f"{run_id}: integrated {len(new_ids)} new and {len(recoded_ids)} recoded records")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("step", choices=["tracks", "review", "integrate"])
    parser.add_argument("run_id")
    parser.add_argument("--started-at")
    parser.add_argument("--flag", action="append", default=[], help="ID=reason for a domain-expert decision")
    args = parser.parse_args()
    if args.step == "tracks":
        tracks(args.run_id, args.started_at)
    elif args.step == "review":
        flags = dict(item.split("=", 1) for item in args.flag)
        review(args.run_id, args.started_at or now(), flags)
    else:
        integrate(args.run_id)


if __name__ == "__main__":
    main()
