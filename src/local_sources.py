"""Local-only third-party full texts and their committed hash ledger.

Copyrighted full texts are excluded from Git (operator decision of 2026-09-29), so a
fresh clone or CI lacks them while the operator's research checkout holds them. Hash-bound
records still name these files. The ledger keeps the recorded canonical hash of every
local full text in the repository, so a machine without the texts resolves the same
hash and every committed output stays identical across both environments.

When the texts are present, the build rewrites the ledger from the files; a changed or
missing text then appears as a ledger diff instead of silently changing other outputs.
A checkout that holds only part of the ledgered texts stops the build, because it would
resolve some sources from files and others from records.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

from src.file_hashing import file_sha256, filesystem_path

LEDGER = "generated/local-fulltext-ledger.json"
# The PRISM reading copies are built from the texts and bound by recovery records.
READING_LAYER = "docs/data/fulltext/"
SCHEMA = "femprompt-local-fulltext-ledger/0.1"

# Mirrors the full-text block in .gitignore; tests/test_local_sources.py keeps both aligned.
PATTERNS = (
    "generated/markdown/",
    "generated/markdown_clean/",
    "generated/source-acquisition/**/markdown-raw/",
    "generated/source-acquisition/**/markdown-clean/",
    "generated/source-acquisition/**/markdown-repaired/",
    "generated/source-acquisition/**/html-markdown/",
    "generated/source-acquisition/**/validation-md/",
    "generated/source-acquisition/oa-batch-a/*-clean/",
    "generated/source-acquisition/oa-batch-a/*-output/",
    "generated/source-acquisition/oa-batch-a/*-input/",
    "generated/source-acquisition/oa-batch-b/markdown-input/",
    "corpus/source-acquisition/historical-resolution-2026-09-05/*-reviewed-text-snapshot.md",
    "corpus/source-acquisition/historical-resolution-2026-09-05/asseri-v1.txt",
    "corpus/source-acquisition/historical-resolution-2026-09-05/latif-v2.txt",
    "corpus/source-acquisition/historical-resolution-2026-09-05/latif-v4.txt",
    "corpus/source-acquisition/checklist-resolution-2026-09-05/hodgson-griffith-am-text.md",
    "corpus/source-acquisition/checklist-resolution-2026-09-05/trudeau-pmc-original.md",
    READING_LAYER,
)
TEXT_SUFFIXES = (".md", ".txt")
SCAN_ROOTS = ("generated", "corpus/source-acquisition", READING_LAYER)


def _regex(pattern: str) -> re.Pattern[str]:
    parts = []
    for token in re.split(r"(\*\*/|\*)", pattern.rstrip("/")):
        if token == "**/":
            parts.append(r"(?:[^/]+/)*")
        elif token == "*":
            parts.append(r"[^/]*")
        else:
            parts.append(re.escape(token))
    suffix = r"/.+" if pattern.endswith("/") else ""
    return re.compile("^" + "".join(parts) + suffix + "$")


_REGEXES = tuple(_regex(pattern) for pattern in PATTERNS)


def is_local_fulltext(relative_path: str) -> bool:
    """Return whether a repository-relative POSIX path names a local-only full text."""
    return relative_path.endswith(TEXT_SUFFIXES) and any(
        regex.match(relative_path) for regex in _REGEXES
    )


def scan(repo: Path) -> dict[str, str]:
    """Hash every local full text present in this checkout."""
    found: dict[str, str] = {}
    for root in SCAN_ROOTS:
        base = repo / root
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            relative = path.relative_to(repo).as_posix()
            if is_local_fulltext(relative) and filesystem_path(path).is_file():
                found[relative] = file_sha256(path)
    return dict(sorted(found.items()))


@lru_cache(maxsize=4)
def _ledger(repo: Path) -> dict[str, str]:
    path = repo / LEDGER
    if not path.is_file():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != SCHEMA:
        raise ValueError(f"Unsupported local full-text ledger: {LEDGER}")
    return data["files"]


def ledger(repo: Path) -> dict[str, str]:
    return _ledger(repo.resolve())


def recorded_sha256(repo: Path, relative_path: str) -> str | None:
    """Return the ledgered bare hexadecimal hash of a local full text, if recorded."""
    if not is_local_fulltext(relative_path):
        return None
    return ledger(repo).get(relative_path)


def absent_sha256(repo: Path, path: Path) -> str | None:
    """Return the recorded hash when a local full text is absent from this checkout."""
    if filesystem_path(path).is_file():
        return None
    try:
        relative = path.resolve().relative_to(repo.resolve()).as_posix()
    except ValueError:
        return None
    return recorded_sha256(repo, relative)


def available(repo: Path, path: Path) -> bool:
    """Return whether a text exists here or is a ledgered local full text."""
    return filesystem_path(path).is_file() or absent_sha256(repo, path) is not None


def read_text(repo: Path, path: Path, **kwargs) -> str | None:
    """Read a source text, or return None for an absent but ledgered local full text.

    A caller that receives None skips its content check. The caller has already
    matched the recorded hash, and a build on a machine holding the texts runs the
    check against exactly those bytes, so the committed result does not change.
    """
    if absent_sha256(repo, path):
        return None
    return filesystem_path(path).read_text(encoding="utf-8", **kwargs)


def store_state(repo: Path) -> str:
    """Classify this checkout as holding all, none or only part of the ledgered texts."""
    # The reading layer is a build output, so only source texts decide the state.
    recorded = [name for name in ledger(repo) if not name.startswith(READING_LAYER)]
    if not recorded:
        return "complete" if scan(repo) else "absent"
    present = sum(filesystem_path(repo / name).is_file() for name in recorded)
    if present == len(recorded):
        return "complete"
    return "absent" if not present else "partial"


def texts_available(repo: Path) -> bool:
    """Return True when full texts can be read; stop on a partial local store."""
    state = store_state(repo)
    if state == "partial":
        missing = [
            name
            for name in ledger(repo)
            if not name.startswith(READING_LAYER)
            and not filesystem_path(repo / name).is_file()
        ]
        raise RuntimeError(
            "Local full-text store is incomplete; restore these files or remove all "
            "ledgered full texts before building:\n" + "\n".join(missing[:20])
        )
    return state == "complete"


def write_ledger(repo: Path) -> dict[str, str]:
    """Record the present local full texts; only called when the store is complete."""
    files = scan(repo)
    payload = {
        "schema": SCHEMA,
        "authority": (
            "Canonical LF hashes of local-only third-party full texts. The texts are "
            "excluded from Git for rights reasons; this ledger grants no source review."
        ),
        "files": files,
    }
    from src.publish.generate_docs_data import write_json_atomic

    write_json_atomic(repo / LEDGER, payload)
    _ledger.cache_clear()
    return files
