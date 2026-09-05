"""Portable fingerprints for newly generated build inputs.

Only known text formats normalize CRLF to LF. Binary and unknown formats remain
byte-exact. This does not redefine historical acquisition or review hashes.
"""

import hashlib
from pathlib import Path


TEXT_SUFFIXES = frozenset({
    ".md", ".markdown", ".txt", ".rst", ".json", ".jsonl", ".yaml", ".yml",
    ".csv", ".tsv", ".ris", ".bib", ".tex", ".xml", ".html", ".htm", ".svg",
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".css", ".scss",
    ".toml", ".ini", ".cfg", ".sh", ".ps1", ".psm1", ".sql", ".ipynb",
})
TEXT_FILENAMES = frozenset({".gitattributes", ".gitignore", ".editorconfig", "Makefile", "LICENSE"})


def canonical_file_bytes(path: Path) -> bytes:
    data = path.read_bytes()
    if path.suffix.lower() in TEXT_SUFFIXES or path.name in TEXT_FILENAMES:
        return data.replace(b"\r\n", b"\n")
    return data


def file_sha256(path: Path) -> str:
    """Return a bare hexadecimal SHA-256 for canonical build-input bytes."""
    return hashlib.sha256(canonical_file_bytes(path)).hexdigest()
