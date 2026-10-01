"""Tests for the retrospective replay command."""

from pathlib import Path

from src.replay import replay_round1 as replay


def test_check_only_does_not_create_replay_artifacts(
        tmp_path: Path, monkeypatch) -> None:
    output_dir = tmp_path / "replay"
    monkeypatch.setattr(replay, "OUT_DIR", output_dir)

    written = replay.write_replay_artifacts(
        {"flow": "verified"},
        {"agreement": "verified"},
        check_only=True,
    )

    assert written == []
    assert not output_dir.exists()


def test_default_mode_writes_both_replay_artifacts(
        tmp_path: Path, monkeypatch) -> None:
    output_dir = tmp_path / "replay"
    monkeypatch.setattr(replay, "OUT_DIR", output_dir)

    written = replay.write_replay_artifacts(
        {"flow": "verified"},
        {"agreement": "verified"},
    )

    assert written == [
        output_dir / "flow_model.json",
        output_dir / "agreement_replay.json",
    ]
    assert (output_dir / "flow_model.json").read_text(encoding="utf-8") == (
        '{\n  "flow": "verified"\n}')
    assert (output_dir / "agreement_replay.json").read_text(encoding="utf-8") == (
        '{\n  "agreement": "verified"\n}')


def test_uncoded_category_marker_counts_as_missing(
        tmp_path: Path, monkeypatch) -> None:
    # The expert sheet marks undecided cells with '?'; as a third label it
    # raised n and moved the per-category kappa.
    header = "Zotero_Key,Decision," + ",".join(replay.CATEGORIES)
    human = tmp_path / "human.csv"
    llm = tmp_path / "llm.csv"
    human.write_text(
        header + "\nA,Include," + ",".join(["?"] + ["Ja"] * 9)
        + "\nB,Include," + ",".join(["Ja"] * 10) + "\n", encoding="utf-8")
    llm.write_text(
        header + "\nA,Include," + ",".join(["Ja"] * 10)
        + "\nB,Include," + ",".join(["Ja"] * 10) + "\n", encoding="utf-8")

    h, l = replay.load_assessment(human), replay.load_assessment(llm)
    per_category = replay.per_category(h, l, ["A", "B"])

    assert replay.normalize_value("?") == ""
    assert per_category["AI_Literacies"]["n"] == 1
    assert per_category["Generative_KI"]["n"] == 2
