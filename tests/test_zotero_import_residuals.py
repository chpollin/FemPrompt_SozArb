"""Tests for the residual import packages and the owner checklist. No network, no key."""

import json
from pathlib import Path

import pytest

from src.acquire import zotero_import_residuals as zir
from src.acquire.zotero_group_reconcile import DEFAULT_RIS, ReconcileError, load_ris
from src.analysis.build_round2_intake import parse_ris

LEADING = (
    "TY  - JOUR\nTI  - Data Feminism for AI\nPY  - 2024\nDO  - https://doi.org/10.1000/ABC\nER  - \n\n"
    "TY  - JOUR\nTI  - Prompting and Power\nPY  - 2025\nER  - \n\n"
    "TY  - JOUR\nTI  - Guardrails in Practice\nPY  - 2026\nDO  - 10.1000/GUARD\nER  - \n"
)


def _write(path: Path, text: str) -> Path:
    path.write_text(text, encoding="utf-8")
    return path


def _export(path: Path, items=()) -> Path:
    path.write_text(json.dumps(list(items)), encoding="utf-8")
    return path


def _run(tmp_path, following: dict[str, str], out: str = "out", leading: str = LEADING):
    leading_path = _write(tmp_path / "leading.ris", leading)
    paths = [_write(tmp_path / name, text) for name, text in following.items()]
    code = zir.main(["--date", "2026-09-20", "--out", str(tmp_path / out),
                     "--leading", str(leading_path), "--export", str(_export(tmp_path / "export.json")),
                     "--following", *[str(path) for path in paths]])
    return code, tmp_path / out


def test_split_records_follows_the_parser_and_keeps_every_block_verbatim(tmp_path):
    path = _write(tmp_path / "sample.ris",
                  "TY  - JOUR\nTI  - Toward Agency-Centered\n      AI Literacy\nPY  - 2025\nER  - \n\n"
                  "ER  - \n\n"
                  "TY  - GEN\nTI  - A record without a closing tag\nPY  - 2024\n")
    blocks = zir.split_records(path)
    assert len(blocks) == len(parse_ris(path)) == 2
    assert blocks[0] == "TY  - JOUR\nTI  - Toward Agency-Centered\n      AI Literacy\nPY  - 2025\nER  - "
    assert blocks[1].startswith("TY  - GEN\n") and blocks[1].endswith("ER  - ")


def test_a_record_covered_by_an_earlier_package_is_dropped_and_appears_exactly_once(tmp_path):
    code, out = _run(tmp_path, {
        # The first record repeats the leading one under another DOI notation,
        # the second is new, the third repeats the leading title and year.
        "first.ris": ("TY  - JOUR\nTI  - Data feminism for AI!\nPY  - 2024\nDO  - doi:10.1000/abc\nER  - \n\n"
                      "TY  - JOUR\nTI  - Refusal Bias\nPY  - 2026\nDO  - 10.1000/REFUSE\nER  - \n\n"
                      "TY  - JOUR\nTI  - Prompting and Power\nPY  - 2025\nER  - \n"),
        # Both records are already carried, the second one by the first package.
        "second.ris": ("TY  - JOUR\nTI  - Guardrails in Practice\nPY  - 2026\nDO  - 10.1000/guard\nER  - \n\n"
                       "TY  - JOUR\nTI  - Refusal Bias\nPY  - 2026\nDO  - 10.1000/refuse\nER  - \n"),
    })
    assert code == 0
    residuals = sorted(path.name for path in out.glob("*.ris"))
    assert residuals == ["first-residual.ris"]

    kept = load_ris(out / "first-residual.ris", "residual")["records"]
    assert [record["title"] for record in kept] == ["Refusal Bias"]

    checklist = (out / "import-checklist.md").read_text(encoding="utf-8")
    assert "| 1 | leading.ris#1 (doi) |" in checklist
    assert "| 3 | leading.ris#2 (title_year) |" in checklist
    assert "| 2 | first.ris#2 (doi) |" in checklist
    assert "none, fully covered" in checklist


def test_a_different_publication_version_stays_in_the_residual_file(tmp_path):
    code, out = _run(tmp_path, {
        # Same title under another year, and same title and year under another DOI.
        "versions.ris": ("TY  - JOUR\nTI  - Data Feminism for AI\nPY  - 2023\n"
                         "DO  - 10.48550/arXiv.2301.00001\nER  - \n\n"
                         "TY  - JOUR\nTI  - Guardrails in Practice\nPY  - 2026\n"
                         "DO  - 10.48550/arXiv.2601.00002\nER  - \n"),
    })
    assert code == 0
    kept = load_ris(out / "versions-residual.ris", "residual")["records"]
    assert [record["year"] for record in kept] == ["2023", "2026"]

    checklist = (out / "import-checklist.md").read_text(encoding="utf-8")
    relations = checklist.split("## Version relations to curate")[1].split("## Expected")[0]
    assert "same title under a different or missing year" in relations
    assert "same title and year under a different DOI" in relations
    assert "leading.ris#1" in relations and "leading.ris#3" in relations
    assert "Retain distinct Preprint, Accepted Manuscript, proceedings, and Version-of-Record" in checklist


def test_an_existing_output_directory_is_never_overwritten(tmp_path):
    following = {"first.ris": "TY  - JOUR\nTI  - Refusal Bias\nPY  - 2026\nER  - \n"}
    assert _run(tmp_path, following)[0] == 0
    before = {path.name: path.read_bytes() for path in (tmp_path / "out").iterdir()}
    assert _run(tmp_path, following)[0] == 1
    assert {path.name: path.read_bytes() for path in (tmp_path / "out").iterdir()} == before
    with pytest.raises(ReconcileError, match="existing directory"):
        zir.write_outputs({"packages": []}, {}, "text", tmp_path / "out")


def test_the_leading_package_is_never_modified(tmp_path):
    source = DEFAULT_RIS[0]
    before = source.read_bytes()
    assert zir.main(["--date", "2026-09-20", "--out", str(tmp_path / "real")]) == 0
    assert source.read_bytes() == before
    assert not (tmp_path / "real" / source.name).exists()
    assert "post(" not in Path(zir.__file__).read_text(encoding="utf-8")


def test_the_repository_packages_yield_an_import_without_a_second_occurrence(tmp_path):
    from src.acquire.zotero_group_reconcile import _index, match_record

    assert zir.main(["--date", "2026-09-20", "--out", str(tmp_path / "real")]) == 0
    files = [DEFAULT_RIS[0]] + sorted((tmp_path / "real").glob("*.ris"))
    bound, titles = [], []
    for path in files:
        loaded = load_ris(path, "import")
        index = _index(bound)
        for record in loaded["records"]:
            decision = match_record(record, index)
            assert not decision["matches"], (path.name, record["title"])
            titles.append(record["title"])
        bound += [{**record, "key": f"{path.name}#{record['index']}"} for record in loaded["records"]]
    assert len(titles) > len(load_ris(DEFAULT_RIS[0], "import")["records"])

    checklist = (tmp_path / "real" / "import-checklist.md").read_text(encoding="utf-8")
    for source in (*DEFAULT_RIS, *zir.DEFAULT_LANE_RIS):
        assert source.relative_to(zir.REPO).as_posix() in checklist


def test_the_checklist_carries_the_outstanding_metadata_corrections(tmp_path):
    assert zir.main(["--date", "2026-09-20", "--out", str(tmp_path / "real")]) == 0
    checklist = (tmp_path / "real" / "import-checklist.md").read_text(encoding="utf-8")
    section = checklist.split("## Outstanding metadata corrections")[1]
    audit = json.loads(zir.AUDIT_PATH.read_text(encoding="utf-8"))["records"]
    pending = [record for record in audit if record["pending_zotero_corrections"]]
    assert pending
    for record in pending:
        assert record["candidate_id"] in section

    with pytest.raises(ReconcileError, match="cannot be read"):
        zir.metadata_corrections({"records": []}, {"items": []}, tmp_path / "missing.json")


def test_the_date_is_required_and_the_clock_is_never_read(tmp_path):
    with pytest.raises(SystemExit):
        zir.main(["--out", str(tmp_path / "x")])
    with pytest.raises(SystemExit):
        zir.main(["--date", "today", "--out", str(tmp_path / "x")])
    source = Path(zir.__file__).read_text(encoding="utf-8")
    assert "datetime" not in source and "time." not in source


def test_the_leading_package_must_not_repeat_among_the_following_packages(tmp_path, capsys):
    leading = _write(tmp_path / "leading.ris", LEADING)
    code = zir.main(["--date", "2026-09-20", "--out", str(tmp_path / "out"), "--leading", str(leading),
                     "--export", str(_export(tmp_path / "export.json")), "--following", str(leading)])
    assert code == 1
    assert "must not appear" in capsys.readouterr().err
    assert not (tmp_path / "out").exists()
