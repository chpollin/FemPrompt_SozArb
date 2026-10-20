"""Process diagnostics over the committed agent-run packages.

Compares the two operationally isolated coding packets of each run, the AI Agent
Review outcome against both packets, the later accepted immutable corrections and
the recorded blockers (knowledge/update-protocol.md, Process diagnostics).
Agreement between agent tracks diagnoses the workflow. The tracks share model
family, prompt and criteria, so their agreement estimates neither accuracy nor
inter-expert reliability. The builder of generated/completion/ calls
``build_diagnostics`` so the fingerprint and ``--check`` cover these outputs.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from src.replay.replay_round1 import CATEGORIES, cohens_kappa

RUNS = "tests/review-cases/agent-runs"
LABEL = "workflow_diagnostic_not_accuracy"
ANALYSIS_FIELDS = (
    "AN_Prompting_Role",
    "AN_Prompt_Techniques",
    "AN_Bias_Axes",
    "AN_Harm_Types",
    "AN_Mitigation_Stage",
    "AN_Mitigation_Status",
    "AN_Population",
    "AN_Task",
    "AN_Gender_Definition",
    "AN_Bias_Definition",
    "AN_Gender_Understanding",
    "AN_Theory_Reference",
    "AN_Coding_Basis",
    "Studientyp",
)
VOCABULARY = "docs/data/analysis_fields.json"
LEVELS = {0: "nein", 1: "teilweise", 2: "ja"}
UNDECIDABLE = ("<undecidable>",)
# Outcomes of ai-agent-review/0.1 and ratification-consensus/0.1 that carry a
# usable final coding. Every other outcome is reported as a review blocker.
SETTLED = {
    "agreed",
    "resolved",
    "ratified_agreement",
    "adjudicated_rr1",
    "adjudicated_rr2",
    "revised",
}


def _json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _codes(value: Any) -> tuple[str, ...] | None:
    values = value if isinstance(value, list) else [value]
    codes = {str(item).strip() for item in values if item is not None} - {""}
    return tuple(sorted(codes)) or None


def coding(record: dict | None) -> dict | None:
    """Project packet, review and consensus record shapes onto comparable values."""
    if record is None:
        return None
    raw = record.get("categories") or {}
    # PRISM serialises only non-zero numeric levels; there an absent category is nein.
    sparse = all(isinstance(value, int) for value in raw.values())
    result: dict[str, Any] = {"decision": record.get("decision")}
    for name in CATEGORIES:
        value = raw.get(name, 0 if sparse else None)
        result[name] = LEVELS.get(value, value) if isinstance(value, int) else value
    analysis = record.get("analysis") or {}
    nested = isinstance(analysis.get("fields"), dict)
    fields = analysis["fields"] if nested else analysis
    undecidable = (analysis.get("undecidable") or {}) if nested else {}
    for name in ANALYSIS_FIELDS:
        result[name] = UNDECIDABLE if name in undecidable else _codes(fields.get(name))
    return result


def productive_run_ids(repo: Path, inputs: set[str]) -> set[str]:
    """Runs whose products the productive screening tracks name as their basis."""
    ids = set()
    for path in sorted((repo / "docs/data/screening").glob("*.json")):
        data = _json(path)
        if not str(data.get("schema", "")).startswith("femprompt-prisma-reviewer/"):
            continue
        if data.get("actor") == "human":
            continue
        inputs.add(path.relative_to(repo).as_posix())
        ids.update(run["run_id"] for run in data.get("review_runs", []))
        if (data.get("ratification") or {}).get("run_id"):
            ids.add(data["ratification"]["run_id"])
    return ids


def load_run(repo: Path, run_dir: Path, inputs: set[str]) -> dict:
    """Read one run's packets and its review or consensus without interpreting them."""

    def read(path: Path) -> Any:
        inputs.add(path.relative_to(repo).as_posix())
        return _json(path)

    manifest = read(run_dir / "run.json")
    tracks = {}
    for path in sorted(run_dir.glob("tracks/*-coding.json")):
        packet = read(path)
        tracks[packet.get("reviewer") or path.stem.removesuffix("-coding")] = packet[
            "decisions"
        ]
    review = run_dir / "ai-agent-review.json"
    consensus = run_dir / "consensus-coding.json"
    outcomes = {}
    if review.is_file():
        for paper_id, record in read(review)["records"].items():
            outcomes[paper_id] = {
                "result": record["result"],
                "final": record.get("final_coding"),
                "reason": record.get("rationale"),
            }
        review_path = review
    elif consensus.is_file():
        for paper_id, record in read(consensus)["records"].items():
            outcomes[paper_id] = {
                "result": record["status"],
                "final": record.get("proposed_record"),
                "reason": record.get("evaluation_reason"),
            }
        review_path = consensus
    else:
        review_path = None
    return {
        "run_id": manifest.get("run_id", run_dir.name),
        "schema": manifest.get("schema"),
        "status": manifest.get("status"),
        "tracks": tracks,
        "outcomes": outcomes,
        "review_artifact": review_path.relative_to(repo).as_posix()
        if review_path
        else None,
    }


def _difference_row(field: str, kind: str, pairs: list[tuple[str, Any, Any]]) -> dict:
    different = sorted(ref for ref, a, b in pairs if a != b)
    row = {
        "field": field,
        "kind": kind,
        "compared_records": len(pairs),
        "identical": len(pairs) - len(different),
        "different": len(different),
        "different_record_refs": different,
        "label": LABEL,
    }
    if kind in {"decision", "category"}:
        row["cohens_kappa"] = (
            cohens_kappa([str(a) for _, a, _ in pairs], [str(b) for _, _, b in pairs])
            if pairs
            else None
        )
    else:
        disagreements = Counter(
            code for _, a, b in pairs for code in set(a or ()) ^ set(b or ())
        )
        row["code_disagreements"] = dict(sorted(disagreements.items()))
    return row


def _outcome_row(field: str, triples: list[tuple[str, Any, Any, Any]]) -> dict:
    groups: dict[str, list[str]] = {
        "kept_track_agreement": [],
        "overrode_track_agreement": [],
        "adopted_one_track": [],
        "value_from_neither_track": [],
    }
    for ref, a, b, final in triples:
        if a == b:
            groups[
                "kept_track_agreement" if final == a else "overrode_track_agreement"
            ].append(ref)
        else:
            groups[
                "adopted_one_track" if final in (a, b) else "value_from_neither_track"
            ].append(ref)
    return {
        "field": field,
        "reviewed_records": len(triples),
        **{name: len(refs) for name, refs in groups.items()},
        **{
            f"{name}_record_refs": sorted(refs)
            for name, refs in groups.items()
            if name != "kept_track_agreement"
        },
        "label": LABEL,
    }


def _correction_field(path: str) -> str:
    parts = path.strip("/").split("/")
    if parts[0] == "analysis" and len(parts) > 2:
        return parts[2]
    if parts[0] in {"categories", "evidence"} and len(parts) > 1:
        return parts[1] if parts[0] == "categories" else f"evidence:{parts[1]}"
    return parts[0]


def build_diagnostics(
    repo: Path, inputs: set[str], works: list[dict], queue: dict
) -> dict:
    """Derive the promised process diagnostics from committed run packages."""
    productive = productive_run_ids(repo, inputs)
    runs = [
        load_run(repo, path.parent, inputs)
        for path in sorted((repo / RUNS).glob("*/run.json"))
    ]
    fields = ("decision", *CATEGORIES, *ANALYSIS_FIELDS)
    pairs: dict[str, list] = defaultdict(list)
    triples: dict[str, list] = defaultdict(list)
    review_blockers: dict[str, list[dict]] = defaultdict(list)
    summaries = []
    for run in runs:
        compared = len(run["tracks"]) == 2
        integrated = run["run_id"] in productive
        summaries.append(
            {
                "run_id": run["run_id"],
                "run_schema": run["schema"],
                "run_status": run["status"],
                "coding_packets": sorted(run["tracks"]),
                "review_artifact": run["review_artifact"],
                "review_results": dict(
                    sorted(
                        Counter(o["result"] for o in run["outcomes"].values()).items()
                    )
                ),
                "integrated_into_productive_track": integrated,
                "pooled": compared and integrated,
                "not_pooled_reason": None
                if compared and integrated
                else "not_two_coding_packets"
                if not compared
                else "not_named_by_productive_track",
            }
        )
        for paper_id, outcome in sorted(run["outcomes"].items()):
            if outcome["result"] not in SETTLED:
                review_blockers[outcome["result"]].append(
                    {
                        "record_ref": f"{run['run_id']}/{paper_id}",
                        "reason": outcome["reason"],
                    }
                )
        if not (compared and integrated):
            continue
        first, second = (run["tracks"][name] for name in sorted(run["tracks"]))
        for paper_id in sorted(set(first) & set(second)):
            ref = f"{run['run_id']}/{paper_id}"
            a, b = coding(first[paper_id]), coding(second[paper_id])
            outcome = run["outcomes"].get(paper_id)
            final = (
                coding(outcome["final"])
                if outcome and outcome["result"] in SETTLED
                else None
            )
            for field in fields:
                analysis = field in ANALYSIS_FIELDS
                # Analysis coding exists only for Includes; compare it where both
                # tracks, or the review's final record, include the work.
                if not analysis or a["decision"] == b["decision"] == "Include":
                    pairs[field].append((ref, a[field], b[field]))
                if final and (not analysis or final["decision"] == "Include"):
                    triples[field].append((ref, a[field], b[field], final[field]))
    differences = [
        _difference_row(
            field,
            "decision"
            if field == "decision"
            else "category"
            if field in CATEGORIES
            else "analysis",
            pairs[field],
        )
        for field in fields
    ]
    outcomes = [_outcome_row(field, triples[field]) for field in fields]
    corrections: dict[str, set[str]] = defaultdict(set)
    for work in works:
        for row in work["agent_records"]:
            for change in (row.get("applied_ai_correction") or {}).get("changes", []):
                corrections[_correction_field(change["path"])].add(row["record_id"])
    queue_blockers: dict[str, list[str]] = defaultdict(list)
    for entry in queue.get("queue", []):
        for blocker in entry.get("blockers", []):
            queue_blockers[str(blocker)].append(entry["work_id"])
    return {
        "schema": "femprompt-agent-track-diagnostics/0.1",
        "label": LABEL,
        "interpretation": "Agreement between operationally isolated agent tracks describes the workflow. The tracks share model family, prompt and criteria; agreement is neither accuracy nor inter-expert reliability, and AI Agent Review outcomes are not human verification.",
        "comparison_scope": "Runs with exactly two coding packets that a productive screening track names as review or ratification basis are pooled. Analysis fields are compared where both tracks, or the final reviewed record, decide Include. Record references are run_id/paper_id.",
        "runs": summaries,
        "track_differences": differences,
        "ai_review_outcomes": outcomes,
        "accepted_ai_corrections": [
            {"field": field, "records": len(ids), "record_ids": sorted(ids)}
            for field, ids in sorted(corrections.items())
        ],
        "blockers": {
            "ai_review": {
                result: sorted(items, key=lambda item: item["record_ref"])
                for result, items in sorted(review_blockers.items())
            },
            "source_queue": {
                code: sorted(ids) for code, ids in sorted(queue_blockers.items())
            },
        },
        "lifecycle_states": dict(
            sorted(
                Counter(
                    row["state"] for work in works for row in work["agent_records"]
                ).items()
            )
        ),
        "coding_basis_of_eligible_works": dict(
            sorted(
                Counter(
                    "/".join(work["analysis_fields"].get("AN_Coding_Basis", []))
                    or "missing"
                    for work in works
                    if work["analysis_eligible"]
                ).items()
            )
        ),
    }


def diagnostics_rows(diagnostics: dict) -> list[dict]:
    """One flat row per field joining track differences, review outcome and corrections."""
    outcomes = {row["field"]: row for row in diagnostics["ai_review_outcomes"]}
    corrections = {
        row["field"]: row["records"] for row in diagnostics["accepted_ai_corrections"]
    }
    return [
        {
            **row,
            **{
                key: value
                for key, value in outcomes[row["field"]].items()
                if key not in {"field", "label"}
            },
            "accepted_ai_correction_records": corrections.get(row["field"], 0),
        }
        for row in diagnostics["track_differences"]
    ]


def _rate(numerator: int, denominator: int) -> float | None:
    return round(numerator / denominator, 4) if denominator else None


def track_agreement(first: dict, second: dict, multi_fields: set[str]) -> dict:
    """Agreement of two coding packets per field, for one run.

    Raw agreement is the share of compared works with identical codes, for a
    multi-value field the identical code set. Positive specific agreement per value
    is 2a / (2a + b + c), with a the works both tracks code with the value and b, c
    the works only one track codes with it (Cicchetti and Feinstein 1990). Cohen's
    kappa is reported descriptively, for single-value fields over the codes and for
    each value of a multi-value field over its presence; at pilot size its interval
    spans most of the scale, so no threshold applies. Analysis fields are compared
    on the works both tracks include. The figures describe the workflow and estimate
    neither accuracy nor inter-expert reliability.
    """
    ids = sorted(set(first) & set(second))
    pairs = {paper_id: (coding(first[paper_id]), coding(second[paper_id])) for paper_id in ids}
    both_include = [
        paper_id
        for paper_id, (a, b) in pairs.items()
        if a["decision"] == b["decision"] == "Include"
    ]
    rows = []
    for field in ("decision", *CATEGORIES, *ANALYSIS_FIELDS):
        analysis = field in ANALYSIS_FIELDS
        scope = both_include if analysis else ids
        values = [(paper_id, pairs[paper_id][0][field], pairs[paper_id][1][field]) for paper_id in scope]
        values = [item for item in values if not (analysis and item[1] is None and item[2] is None)]
        identical = [paper_id for paper_id, a, b in values if a == b]
        row = {
            "field": field,
            "kind": "analysis" if analysis else "decision" if field == "decision" else "category",
            "compared_works": len(values),
            "identical": len(identical),
            "raw_agreement": _rate(len(identical), len(values)),
            "different_paper_ids": sorted(paper_id for paper_id, a, b in values if a != b),
            "label": LABEL,
        }
        if field in multi_fields:
            codes = sorted({code for _, a, b in values for code in (a or ()) + (b or ())})
            per_value = {}
            for code in codes:
                both = sum(1 for _, a, b in values if code in (a or ()) and code in (b or ()))
                only = sum(1 for _, a, b in values if (code in (a or ())) != (code in (b or ())))
                per_value[code] = {
                    "both": both,
                    "one_track_only": only,
                    "positive_specific_agreement": _rate(2 * both, 2 * both + only),
                    "cohens_kappa_descriptive": cohens_kappa(
                        [code in (a or ()) for _, a, _ in values],
                        [code in (b or ()) for _, _, b in values],
                    )
                    if values
                    else None,
                }
            row["values"] = per_value
        else:
            row["cohens_kappa_descriptive"] = (
                cohens_kappa([str(a) for _, a, _ in values], [str(b) for _, _, b in values])
                if values
                else None
            )
        rows.append(row)
    return {
        "schema": "femprompt-track-agreement/0.1",
        "label": LABEL,
        "interpretation": "Agreement between two operationally isolated agent tracks is a workflow diagnostic. Tracks on the same model share more than tracks on different models, so agreement is neither accuracy nor inter-expert reliability. Kappa is descriptive and carries no threshold.",
        "compared_works": len(ids),
        "both_include_works": len(both_include),
        "fields": rows,
    }


def run_agreement(repo: Path, run_dir: Path) -> dict:
    """Read one run's two coding packets and the vocabulary, return their agreement."""
    packets = sorted(run_dir.glob("tracks/*-coding.json"))
    if len(packets) != 2:
        raise ValueError(f"{run_dir} needs exactly two coding packets")
    first, second = (_json(path)["decisions"] for path in packets)
    vocabulary = _json(repo / VOCABULARY)
    multi = {field["name"] for field in vocabulary["fields"] if field.get("multi")}
    result = track_agreement(first, second, multi)
    result["run_id"] = _json(run_dir / "run.json").get("run_id", run_dir.name)
    result["coding_packets"] = [path.relative_to(repo).as_posix() for path in packets]
    result["vocabulary_version"] = vocabulary.get("version")
    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Track agreement of one agent run.")
    parser.add_argument("run_dir", help="run folder under tests/review-cases/agent-runs")
    parser.add_argument("--output", help="write the JSON here instead of standard output")
    args = parser.parse_args(argv)
    repo = Path(__file__).resolve().parents[2]
    run_dir = (repo / args.run_dir).resolve()
    result = run_agreement(repo, run_dir)
    text = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        # LF bytes, so the hash a run manifest records survives a Git checkout.
        (repo / args.output).write_text(text, encoding="utf-8", newline="\n")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
