"""Local-only full texts resolve identically with and without the texts present."""

import hashlib
import json
from pathlib import Path

import pytest

from src import local_sources
from src.local_sources import (
    PATTERNS,
    absent_sha256,
    is_local_fulltext,
    read_text,
    store_state,
    texts_available,
    write_ledger,
)

ROOT = Path(__file__).resolve().parents[1]


def test_patterns_match_the_gitignore_block() -> None:
    ignored = set((ROOT / ".gitignore").read_text(encoding="utf-8").splitlines())
    assert set(PATTERNS) <= ignored


@pytest.mark.parametrize(
    ("path", "local"),
    [
        ("generated/markdown/Gohar_2023_Survey.md", True),
        ("generated/markdown_clean/4ZL5Q48E.md", True),
        ("generated/source-acquisition/codex-websearch-2026/markdown-repaired/a.md", True),
        ("generated/source-acquisition/codex-websearch-2026/reacquisition-2026-09-22/markdown-clean/a.md", True),
        ("generated/source-acquisition/oa-batch-a/4zl-clean/4ZL5Q48E.md", True),
        ("corpus/source-acquisition/historical-resolution-2026-09-05/latif-v4.txt", True),
        ("docs/data/fulltext/8NG4ZEWE.md", True),
        # Source audits, manifests and licence-recorded texts stay versioned.
        ("generated/source-acquisition/oa-batch-a/4ZL5Q48E.md", False),
        ("generated/source-acquisition/codex-websearch-2026/source-readiness.json", False),
        ("corpus/source-acquisition/completion-20260921/Z9DNTBFF.identity-bound.md", False),
        ("corpus/source-acquisition/residual-resolution-2026-09-05/kabra-arxiv-v3-text.md", False),
        ("corpus/source-acquisition/historical-resolution-2026-09-05/latif-history.txt", False),
    ],
)
def test_classification(path: str, local: bool) -> None:
    assert is_local_fulltext(path) is local


def _repo(tmp_path: Path, *names: str) -> Path:
    for name in names:
        path = tmp_path / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(f"# {name}\r\n\r\nBody\r\n", encoding="utf-8", newline="")
    return tmp_path


def test_ledger_supplies_the_hash_and_skips_text_where_absent(tmp_path: Path) -> None:
    names = ("generated/markdown/A_2024_Title.md", "generated/markdown_clean/B.md")
    repo = _repo(tmp_path, *names)
    recorded = write_ledger(repo)
    assert set(recorded) == set(names)
    assert store_state(repo) == "complete" and texts_available(repo)
    source = repo / names[0]
    assert absent_sha256(repo, source) is None
    assert read_text(repo, source).startswith("# ")

    for name in names:
        (repo / name).unlink()
    assert store_state(repo) == "absent" and not texts_available(repo)
    assert absent_sha256(repo, source) == recorded[names[0]]
    assert read_text(repo, source) is None
    with pytest.raises(FileNotFoundError):
        read_text(repo, repo / "generated/markdown/unrecorded.md")


def test_partial_store_stops_the_build(tmp_path: Path) -> None:
    names = ("generated/markdown/A.md", "generated/markdown/B.md")
    repo = _repo(tmp_path, *names)
    write_ledger(repo)
    (repo / names[1]).unlink()
    with pytest.raises(RuntimeError, match="incomplete"):
        texts_available(repo)


def test_reading_copies_do_not_decide_the_store_state(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "generated/markdown/A.md", "docs/data/fulltext/X.md")
    write_ledger(repo)
    (repo / "docs/data/fulltext/X.md").unlink()
    assert store_state(repo) == "complete"


def test_committed_ledger_uses_canonical_lf_hashes(tmp_path: Path) -> None:
    repo = _repo(tmp_path, "generated/markdown/A.md")
    files = write_ledger(repo)
    data = json.loads((repo / local_sources.LEDGER).read_text(encoding="utf-8"))
    assert data["schema"] == local_sources.SCHEMA and data["files"] == files
    body = (repo / "generated/markdown/A.md").read_bytes().replace(b"\r\n", b"\n")
    assert files["generated/markdown/A.md"] == hashlib.sha256(body).hexdigest()
