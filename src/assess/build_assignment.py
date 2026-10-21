"""Split the open PRISM papers between the two human reviewers.

A paper is open when PRISM's ``isDone`` is false for every reviewer: it has no
decision of the consolidated expert assessment (``paper.human`` Include or
Exclude) and no record or verification in a human reviewer file below
``docs/data/screening/``. Open papers fall into two strata, those with a record
in a productive agent track and those without any assessment. Within each
stratum the papers alternate between the reviewers in corpus order, so both
receive a balanced share of each kind.

A rerun never reassigns a paper that already has an entry, keeps the entries of
papers that have since become done, and assigns only papers that are open and
not yet assigned. Each stratum of new papers starts with the reviewer who
currently holds fewer assignments. An entry changes only through an explicit
``--move``, which the operator requests to rebalance the workload.

Run: python -X utf8 -m src.assess.build_assignment [--date YYYY-MM-DD]
     [--move FROM TO COUNT]
"""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
SCHEMA = "femprompt-prisma-assignment/1.0"
REVIEWER_SCHEMA_PREFIX = "femprompt-prisma-reviewer/"
ASSIGNMENT_FILE = "assignment.json"
# The labels are what the published pages show, so they name a role, not a person:
# Review A and B split the open papers, Review C holds the small technical list.
# The keys stay as stored identifiers of the reviewer files, their records and the
# assignee links, so renaming them would orphan saved work in the reviewers' clones.
REVIEWERS = (
    {"key": "sabine", "label": "Review A"},
    {"key": "susi", "label": "Review B"},
    {"key": "chrisi", "label": "Review C"},
)
SPLIT_KEYS = ("sabine", "susi")
RULE = (
    "Every paper that is open in PRISM (no decision of the consolidated expert "
    "assessment, no own record, no own verification) is assigned to one reviewer. "
    "Open papers are split into papers with an agent record and unassessed papers; "
    "within each group they alternate between the reviewers in corpus order. "
    "A rerun only adds newly open papers; an existing entry changes only when the "
    "operator moves open papers from one reviewer to another."
)
DECIDED = ("Include", "Exclude")


def _json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def screening_state(screening_dir: Path) -> tuple[set[str], set[str]]:
    """Return (paper ids with human work, paper ids with an agent record)."""
    human: set[str] = set()
    agent: set[str] = set()
    for path in sorted(screening_dir.glob("*.json")):
        if path.name == ASSIGNMENT_FILE:
            continue
        data = _json(path)
        if not str(data.get("schema", "")).startswith(REVIEWER_SCHEMA_PREFIX):
            continue
        decisions = data.get("decisions") or {}
        if data.get("actor") == "agent":
            agent.update(decisions)
            continue
        human.update(decisions)
        human.update(
            entry["paper_id"]
            for entry in data.get("verifications") or []
            if isinstance(entry, dict) and entry.get("paper_id") is not None
        )
    return human, agent


def _representative(group: list[dict], agent: set[str]) -> dict:
    return min(
        group,
        key=lambda p: (
            not bool(p.get("is_preferred_version", True)),
            not bool(p.get("doi")),
            not bool(p.get("abstract")),
            p["id"] not in agent,
        ),
    )


def open_papers(papers: list[dict], human: set[str], agent: set[str]) -> list[tuple[str, str]]:
    """Open papers in corpus order as (paper id, kind), kind 'agent' or 'unassessed'."""
    by_work: dict[str, list[dict]] = {}
    for paper in papers:
        wid = paper.get("work_id") or paper["id"]
        by_work.setdefault(wid, []).append(paper)
    representatives: set[str] = set()
    for group in by_work.values():
        if any((p.get("human") or {}).get("decision") in DECIDED or p["id"] in human for p in group):
            continue
        rep = _representative(group, agent)
        representatives.add(rep["id"])
    result = []
    for paper in papers:
        pid = paper["id"]
        if pid not in representatives:
            continue
        result.append((pid, "agent" if pid in agent else "unassessed"))
    return result


def assign(
    existing: dict[str, str], candidates: list[tuple[str, str]], keys: list[str]
) -> dict[str, str]:
    """New entries for unassigned candidates, alternating within each kind."""
    load = {key: 0 for key in keys}
    for key in existing.values():
        if key in load:
            load[key] += 1
    added: dict[str, str] = {}
    for kind in ("agent", "unassessed"):
        stratum = [pid for pid, k in candidates if k == kind and pid not in existing]
        if not stratum:
            continue
        # fewest assignments first; ties follow the declared reviewer order
        start = min(range(len(keys)), key=lambda i: (load[keys[i]], i))
        for offset, pid in enumerate(stratum):
            key = keys[(start + offset) % len(keys)]
            added[pid] = key
            load[key] += 1
    return added


def move(
    assignments: dict[str, str], candidates: list[tuple[str, str]], source: str, target: str, count: int
) -> list[str]:
    """Reassign the last ``count`` still open papers of ``source`` in corpus order.

    Only open papers move, so no reviewer loses a paper she has already worked on,
    and taking them from the end keeps the start of the source list unchanged.
    """
    open_ids = [pid for pid, _ in candidates]
    movable = [pid for pid in open_ids if assignments.get(pid) == source]
    if count < 1 or count > len(movable):
        raise ValueError(f"cannot move {count} open papers from {source!r}, it holds {len(movable)}")
    moved = movable[-count:]
    for pid in moved:
        assignments[pid] = target
    return moved


def build(repo: Path, today: str) -> tuple[dict, dict[str, str]]:
    """Return the assignment document and the entries added by this run."""
    papers = _json(repo / "docs/data/research_vault_v2.json")["papers"]
    screening_dir = repo / "docs/data/screening"
    target = screening_dir / ASSIGNMENT_FILE
    previous = _json(target) if target.exists() else None
    if previous is not None and previous.get("schema") != SCHEMA:
        raise ValueError(f"{target}: unexpected schema {previous.get('schema')!r}")
    existing = dict((previous or {}).get("assignments") or {})
    allowed = {reviewer["key"] for reviewer in REVIEWERS}
    unknown = sorted({key for key in existing.values() if key not in allowed})
    if unknown:
        raise ValueError(f"{target}: assignments name unknown reviewers {unknown}")
    human, agent = screening_state(screening_dir)
    added = assign(existing, open_papers(papers, human, agent), list(SPLIT_KEYS))
    merged = {**existing, **added}
    position = {paper["id"]: index for index, paper in enumerate(papers)}
    ordered = sorted(merged, key=lambda pid: (pid not in position, position.get(pid, 0)))
    document = {
        "schema": SCHEMA,
        "reviewers": [dict(reviewer) for reviewer in REVIEWERS],
        "assigned_on": (previous or {}).get("assigned_on") or today,
        "rule": RULE,
        "assignments": {pid: merged[pid] for pid in ordered},
    }
    updated_on = (previous or {}).get("updated_on")
    if previous is not None and added:
        updated_on = today
    if updated_on:
        document["updated_on"] = updated_on
    return document, added


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--move", nargs=3, metavar=("FROM", "TO", "COUNT"))
    args = parser.parse_args(argv)
    document, added = build(REPO, args.date)
    target = REPO / "docs/data/screening" / ASSIGNMENT_FILE
    if args.move:
        source, to, count = args.move[0], args.move[1], int(args.move[2])
        if source not in SPLIT_KEYS or to not in SPLIT_KEYS or source == to:
            raise SystemExit(f"--move needs two different reviewers of {SPLIT_KEYS}")
        papers = _json(REPO / "docs/data/research_vault_v2.json")["papers"]
        human, agent = screening_state(REPO / "docs/data/screening")
        moved = move(document["assignments"], open_papers(papers, human, agent), source, to, count)
        document["updated_on"] = args.date
        print(f"moved {len(moved)} open papers from {source} to {to}: {', '.join(moved)}")
    text = json.dumps(document, ensure_ascii=False, indent=2) + "\n"
    if not target.exists() or target.read_text(encoding="utf-8") != text:
        target.write_text(text, encoding="utf-8", newline="\n")
    counts: dict[str, int] = {}
    for key in added.values():
        counts[key] = counts.get(key, 0) + 1
    print(f"{target.relative_to(REPO).as_posix()}: {len(added)} new assignments {counts}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
