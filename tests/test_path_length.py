"""Tracked paths must leave room for a deep Windows clone root (260-character limit)."""

import subprocess
from pathlib import Path

import pytest

from src.file_naming import MAX_STEM_LENGTH, bounded_stem, bounded_title_stem

ROOT = Path(__file__).resolve().parents[1]
# A clone root of up to 139 characters plus this limit stays below 260.
MAX_TRACKED_PATH = 120


def test_tracked_paths_stay_within_limit() -> None:
    result = subprocess.run(
        ["git", "-c", "core.quotepath=off", "ls-files", "-z"],
        cwd=ROOT,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        pytest.skip("not a Git checkout")
    paths = [p for p in result.stdout.decode("utf-8").split("\0") if p]
    too_long = sorted((len(p), p) for p in paths if len(p) > MAX_TRACKED_PATH)
    assert not too_long, "\n".join(f"{n} {p}" for n, p in too_long)


def test_bounded_stem_is_deterministic_and_bounded() -> None:
    title = "Voll (dia)logisch: " + "ein sehr langer Untertitel " * 6
    stem = bounded_title_stem(title)
    assert len(stem) <= MAX_STEM_LENGTH
    assert stem == bounded_title_stem(title)
    assert ":" not in stem
    assert bounded_title_stem("Short: title") == "Short- title"


def test_bounded_stem_separates_shared_prefixes_case_insensitively() -> None:
    prefix = "A" * 80
    first, second = bounded_stem(prefix + " one"), bounded_stem(prefix + " two")
    assert first != second
    assert bounded_stem(prefix.lower() + " one").casefold() == first.casefold()
