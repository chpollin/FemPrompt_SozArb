"""Build the local working projection of all Assertions for the argument map.

Unlike the released Assertion index, this file includes draft Assertions
(`grounded` and every other status) so the working Companion can show the whole
Assertion layer locally. It is written to a git-ignored path and is never part
of the GitHub Pages site or the result site; the argument map falls back to the
released index where the file is absent. Release state is read from the
released index itself, so this projection never decides publication.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
if __package__ in (None, ""):
    sys.path.insert(0, str(REPO_ROOT))

from src.publish.assertion_labels import DEFAULT_LABELS, current_label, load_labels
from src.publish.build_assertion_index import DEFAULT_OUTPUT as DEFAULT_RELEASED, _document, _section
from src.publish.validate_research_vault import WIKILINK

DEFAULT_VAULT = REPO_ROOT / "research-vault"
DEFAULT_PAPERS = REPO_ROOT / "docs/data/promptotyping_v2.json"
DEFAULT_OUTPUT = REPO_ROOT / "docs/data/assertions_working.json"
SCHEMA = "femprompt-assertion-working/0.1"
QUESTIONS = ("SQ1", "SQ2", "SQ3", "SQ4", "SQ5")


def _links(value: Any) -> list[re.Match[str]]:
    values = value if isinstance(value, list) else []
    return [match for item in values if (match := WIKILINK.fullmatch(str(item)))]


def _work(distillate, papers: dict[str, dict[str, Any]]) -> dict[str, str]:
    record_id = str(distillate.metadata.get("record-id") or "")
    paper = papers.get(record_id, {})
    heading = re.search(r"^# (.+)$", distillate.body, re.M)
    return {
        "record_id": record_id,
        "work_id": str(paper.get("work_id") or distillate.metadata.get("work-id") or ""),
        "title": str(paper.get("title") or (heading.group(1).strip() if heading else record_id)),
        "author_year": str(paper.get("author_year") or ""),
    }


def build_map(
    vault: Path = DEFAULT_VAULT,
    papers_path: Path = DEFAULT_PAPERS,
    released_path: Path = DEFAULT_RELEASED,
    labels_path: Path = DEFAULT_LABELS,
) -> dict[str, Any]:
    labels = load_labels(labels_path)
    papers = {
        str(paper["id"]): paper
        for paper in json.loads(papers_path.read_text(encoding="utf-8")).get("papers", [])
    }
    released_index = json.loads(released_path.read_text(encoding="utf-8")) if released_path.is_file() else {}
    released = {item.get("assertion_ref") for item in released_index.get("assertions", [])}
    docs = {
        doc.key: doc
        for folder in ("20_distillates", "30_assertions")
        for path in sorted((vault / folder).rglob("*.md"))
        for doc in [_document(path, vault)]
    }
    assertions = {key: doc for key, doc in docs.items() if doc.metadata.get("type") == "assertion"}

    # contested-with is meant to be symmetric; a one-sided entry still marks both
    # Assertions, so the map never hides a conflict recorded on only one side.
    contested: dict[str, set[str]] = {key: set() for key in assertions}
    for key, doc in assertions.items():
        for link in _links(doc.metadata.get("contested-with")):
            other = link.group(1)
            if other in assertions and other != key:
                contested[key].add(other)
                contested[other].add(key)

    def short(key: str) -> str:
        return key.rsplit("/", 1)[-1]

    items = []
    for key, doc in assertions.items():
        works: dict[str, dict[str, str]] = {}
        for link in _links(doc.metadata.get("grounding")):
            distillate = docs.get(link.group(1))
            if distillate is None or distillate.metadata.get("type") != "distillate":
                continue
            work = _work(distillate, papers)
            works.setdefault(work["record_id"], work)
        heading = re.search(r"^# (.+)$", doc.body, re.M)
        statement = _section(doc.body, "Statement")
        items.append({
            "id": short(key),
            "ref": key,
            "title": heading.group(1).strip() if heading else statement,
            "statement": statement,
            "label": current_label(labels, short(key), statement),
            "status": str(doc.metadata.get("status") or ""),
            "released": key in released,
            "research_questions": sorted(
                {str(value) for value in doc.metadata.get("research-questions") or []} & set(QUESTIONS)
            ),
            "contested_with": sorted(short(other) for other in contested[key]),
            "works": sorted(works.values(), key=lambda work: (work["author_year"], work["record_id"])),
        })
    items.sort(key=lambda item: item["id"])
    return {"schema": SCHEMA, "assertions": items}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--papers", type=Path, default=DEFAULT_PAPERS)
    parser.add_argument("--released", type=Path, default=DEFAULT_RELEASED)
    parser.add_argument("--labels", type=Path, default=DEFAULT_LABELS)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args(argv)
    payload = build_map(args.vault, args.papers, args.released, args.labels)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Assertion map: {len(payload['assertions'])} assertions (local working file)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
