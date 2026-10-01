"""Bounded, deterministic file-name stems derived from titles.

A clone root of about 100 characters plus a repository-relative path must stay
below the Windows 260-character limit without core.longpaths. Title-derived
stems are therefore capped, and a truncated stem carries a short hash of the
full stem so that titles sharing a long prefix cannot collide.
"""

import hashlib
import re

MAX_STEM_LENGTH = 72
HASH_LENGTH = 6
# Truncation backs off to a word boundary only within this many characters, so
# a title without spaces near the cut still keeps most of its readable prefix.
WORD_BOUNDARY_WINDOW = 20

_UNSAFE = re.compile(r'[<>:"/\\|?*\n\r]')


def safe_title(title: str) -> str:
    """Replace characters Windows forbids in file names, untruncated."""
    return _UNSAFE.sub("-", title).strip(". ")


def bounded_stem(text: str, max_length: int = MAX_STEM_LENGTH) -> str:
    """Return ``text`` unchanged when short enough, else a truncated stem with hash.

    The hash covers the case-folded full text, so the result is stable across
    runs and matches case-insensitive lookups on Windows and macOS.
    """
    if len(text) <= max_length:
        return text
    digest = hashlib.sha256(text.casefold().encode("utf-8")).hexdigest()[:HASH_LENGTH]
    limit = max_length - HASH_LENGTH - 1
    head = text[:limit]
    if text[limit] not in " _":
        boundary = max(head.rfind(" "), head.rfind("_"))
        if boundary >= limit - WORD_BOUNDARY_WINDOW:
            head = head[:boundary]
    head = head.rstrip(" .-_,;")
    return f"{head}-{digest}"


def bounded_title_stem(title: str, max_length: int = MAX_STEM_LENGTH) -> str:
    """Filesystem-safe, bounded file-name stem for a paper title."""
    return bounded_stem(safe_title(title), max_length)
