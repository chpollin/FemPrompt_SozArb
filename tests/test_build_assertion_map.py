"""The local argument-map projection: drafts included, release state from the index."""
from __future__ import annotations

import json
from pathlib import Path

from src.publish.build_assertion_map import build_map

ROOT = Path(__file__).resolve().parents[1]


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _distillate(vault: Path, name: str, record_id: str) -> None:
    _write(vault / f"20_distillates/publications/{name}.md",
           f"---\ntype: distillate\nrecord-id: {record_id}\nwork-id: work:{name}\nstatus: ai-agent-reviewed\n---\n\n"
           f"# Distillate {name}\n\n## Core statements\n\n- A statement. ^s1\n")


def _assertion(vault: Path, name: str, status: str, grounding: list[str], contested: list[str], questions: list[str]) -> None:
    def block(field: str, values: list[str]) -> str:
        return f"{field}:\n" + "".join(f"- '{value}'\n" for value in values) if values else f"{field}: []\n"
    _write(vault / f"30_assertions/{name}.md",
           f"---\ntype: assertion\nstatus: {status}\n"
           + block("grounding", [f"[[20_distillates/publications/{g}#^s1]]" for g in grounding])
           + block("contested-with", [f"[[30_assertions/{c}]]" for c in contested])
           + block("research-questions", questions)
           + f"---\n\n# Title {name}\n\n## Statement\n\nStatement of {name}.\n")


def _fixture(tmp_path: Path) -> dict:
    vault = tmp_path / "research-vault"
    _distillate(vault, "alpha", "REC1")
    _distillate(vault, "beta", "REC2")
    _assertion(vault, "released-one", "ai-agent-reviewed", ["alpha"], [], ["SQ3"])
    # Two groundings in the same distillate count its Work once.
    _assertion(vault, "draft-one", "grounded", ["alpha", "beta", "beta"], ["draft-two"], ["SQ1", "SQ5", "SQ9"])
    _assertion(vault, "draft-two", "grounded", ["beta"], [], [])
    _write(vault / "30_assertions/MOC-Topic.md", "---\ntype: moc\n---\n\n# MOC\n")
    papers = tmp_path / "papers.json"
    papers.write_text(json.dumps({"papers": [
        {"id": "REC1", "work_id": "work:one", "title": "Paper One", "author_year": "Alpha (2024)"},
        {"id": "REC2", "work_id": "work:two", "title": "Paper Two", "author_year": "Beta et al. (2025)"},
    ]}), encoding="utf-8")
    released = tmp_path / "assertion_index.json"
    released.write_text(json.dumps({"assertions": [{"assertion_ref": "30_assertions/released-one"}]}), encoding="utf-8")
    return {"vault": vault, "papers_path": papers, "released_path": released}


def test_drafts_and_released_assertions_with_record_mapping(tmp_path):
    payload = build_map(**_fixture(tmp_path))
    assert build_map(**_fixture(tmp_path)) == payload
    items = {item["id"]: item for item in payload["assertions"]}
    assert set(items) == {"released-one", "draft-one", "draft-two"}
    assert items["released-one"]["released"] is True
    assert items["draft-one"]["released"] is False
    assert items["draft-one"]["status"] == "grounded"
    assert items["draft-one"]["statement"] == "Statement of draft-one."
    assert items["draft-one"]["research_questions"] == ["SQ1", "SQ5"]
    assert items["draft-one"]["works"] == [
        {"record_id": "REC1", "work_id": "work:one", "title": "Paper One", "author_year": "Alpha (2024)"},
        {"record_id": "REC2", "work_id": "work:two", "title": "Paper Two", "author_year": "Beta et al. (2025)"},
    ]


def test_contested_is_symmetric_even_when_recorded_on_one_side(tmp_path):
    items = {item["id"]: item for item in build_map(**_fixture(tmp_path))["assertions"]}
    assert items["draft-one"]["contested_with"] == ["draft-two"]
    assert items["draft-two"]["contested_with"] == ["draft-one"]
    assert items["released-one"]["contested_with"] == []


def test_without_released_index_nothing_counts_as_released(tmp_path):
    args = _fixture(tmp_path)
    args["released_path"] = tmp_path / "missing.json"
    assert not any(item["released"] for item in build_map(**args)["assertions"])


def test_repository_projection_agrees_with_the_released_index():
    released = json.loads((ROOT / "docs/data/assertion_index.json").read_text(encoding="utf-8"))
    refs = {item["assertion_ref"].rsplit("/", 1)[-1] for item in released["assertions"]}
    items = build_map()["assertions"]
    assert {item["id"] for item in items if item["released"]} == refs
    assert any(item["status"] == "grounded" and not item["released"] for item in items)
    assert all(work["title"] and work["record_id"] for item in items for work in item["works"])
