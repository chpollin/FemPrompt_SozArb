"""Raw-text resolution of the full-text builder: the first-author-year fallback must
refuse an ambiguous match instead of attaching the first conversion it finds."""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build_fulltext", ROOT / "src" / "publish" / "build_fulltext.py")
bf = importlib.util.module_from_spec(spec)
sys.modules["build_fulltext"] = bf
spec.loader.exec_module(bf)


def _paper(author_year, kd=None):
    return {"id": "X", "author_year": author_year, "knowledge_doc": kd}


def test_unique_fallback_resolves():
    clean_idx = {bf.norm("pilot2026study"): "Pilot2026study.md", bf.norm("other2025"): "Other2025.md"}
    path, src = bf.resolve_docling(_paper("Pilot et al. (2026)"), clean_idx, {})
    assert src == "clean"
    assert path.name == "Pilot2026study.md"


def test_ambiguous_fallback_is_refused():
    clean_idx = {bf.norm("pilot2026study"): "Pilot2026study.md", bf.norm("pilot2026other"): "Pilot2026other.md"}
    path, src = bf.resolve_docling(_paper("Pilot et al. (2026)"), clean_idx, {})
    assert path is None
    assert src == "ambiguous"


def test_ambiguous_clean_does_not_fall_through_to_raw():
    clean_idx = {bf.norm("pilot2026a"): "a.md", bf.norm("pilot2026b"): "b.md"}
    raw_idx = {bf.norm("pilot2026c"): "c.md"}
    path, src = bf.resolve_docling(_paper("Pilot et al. (2026)"), clean_idx, raw_idx)
    assert (path, src) == (None, "ambiguous")


def test_no_match_stays_none():
    path, src = bf.resolve_docling(_paper("Nobody (1999)"), {bf.norm("pilot2026"): "p.md"}, {})
    assert (path, src) == (None, None)


def test_short_key_never_fallback_matches():
    # a key of five characters or fewer is too unspecific for the prefix join
    path, src = bf.resolve_docling(_paper("X (2024)"), {bf.norm("x2024paper"): "p.md"}, {})
    assert (path, src) == (None, None)
