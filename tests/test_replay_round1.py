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
