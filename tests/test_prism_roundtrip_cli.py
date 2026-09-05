"""The governed CLI explicitly opts into PRISM writing and preserves its packet."""

from pathlib import Path
import subprocess


REPO = Path(__file__).resolve().parents[1]


def test_governed_roundtrip_after_default_read_mode(tmp_path: Path) -> None:
    run = "tests/review-cases/agent-runs/residual-source-8ng4zewe-20260826/run.json"
    packet = REPO / Path(run).parent / "tracks/ar1-coding.json"
    original = packet.read_bytes()
    projection, output = tmp_path / "projection.json", tmp_path / "track.json"
    commands = [
        ["build-prism-track.mjs", run, "ar1", str(projection), "2026-09-05T00:00:00.000Z"],
        ["roundtrip-prism-track.mjs", run, "ar1", str(projection), str(output)],
        ["validate-prism-track.mjs", run, "ar1", str(output)],
    ]
    for script, *args in commands:
        result = subprocess.run(
            ["node", str(REPO / "tests/review-cases" / script), *args],
            cwd=REPO, capture_output=True, text=True, encoding="utf-8", timeout=30,
        )
        assert result.returncode == 0, result.stdout + result.stderr
    assert packet.read_bytes() == original
