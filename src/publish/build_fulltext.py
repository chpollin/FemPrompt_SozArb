#!/usr/bin/env python3
"""Build per-paper full-text assets for the PRISM reading pane.

Each paper's Docling conversion (generated/markdown_clean, fallback generated/markdown)
is cleaned and written to docs/data/fulltext/{id}.md, keyed by Zotero id, so the reading
pane fetches it lazily as the human "Volltext" layer. A manifest records which papers have
full text and via which source, so the papers without an acquired PDF are named, not
silently empty.

Why here and not in the vault generator: the served knowledge docs carry an empty
"## Full Text" placeholder; the real Docling text was never injected. This fills the gap
from the canonical conversion without touching the distillation, which stays the AI layer.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
DATA_IN = DOCS / "data" / "research_vault_v2.json"
CLEAN_DIR = ROOT / "generated" / "markdown_clean"
RAW_DIR = ROOT / "generated" / "markdown"
OUT_DIR = DOCS / "data" / "fulltext"
MANIFEST = DOCS / "data" / "fulltext_manifest.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
# Docling emits GLYPH<..> runs where a PDF's embedded font could not be decoded;
# the served docs carry the HTML-escaped form GLYPH&lt;..&gt;, and math-symbol pages
# leak the GLYPH(cmap:XXXX) parenthesis form (e.g. a formula-heavy algorithm block).
GLYPH_RE = re.compile(r"GLYPH&lt;[^&]*&gt;|GLYPH<[^>]*>|GLYPH\([^)]*\)")
HSPACE_RE = re.compile(r"[ \t]{2,}")
BLANKS_RE = re.compile(r"\n{3,}")


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (s or "").lower())


def drop_running_headers(text: str) -> str:
    """Drop a page running-head that Docling leaks as its own short line on every page.

    Heuristic: a stripped line of at most six characters that recurs five or more
    times identically is a header artifact (e.g. '2SHQ'), not prose; prose almost
    never repeats an identical short line that often. Headings (starting '#') are
    exempt. The ceiling is deliberately tight to avoid eating real short content.
    """
    lines = text.split("\n")
    stripped = [ln.strip() for ln in lines]
    counts = Counter(s for s in stripped if s)
    def is_header(s: str) -> bool:
        return bool(s) and len(s) <= 6 and counts[s] >= 5 and not s.startswith("#")
    return "\n".join(ln for ln, s in zip(lines, stripped) if not is_header(s))


def embedded_source_file(served_md: Path):
    """The served knowledge doc carries the distillation frontmatter with source_file."""
    try:
        md = served_md.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None
    i = md.find("## Full Text")
    seg = md[i:] if i != -1 else md
    m = re.search(r"^source_file:\s*(.+?)\s*$", seg, re.MULTILINE)
    return m.group(1).strip().strip('"') if m else None


def author_year_key(paper: dict) -> str:
    """First-author lastname plus year, e.g. 'chatterji2025', for the fallback join."""
    ay = (paper.get("author_year") or "").strip()
    if not ay:
        return ""
    year = re.search(r"(?:19|20)\d{2}", ay)
    last = re.split(r"[\s,]", ay)[0]
    return norm(last) + (year.group(0) if year else "")


def clean(text: str) -> str:
    text = FRONTMATTER_RE.sub("", text, count=1)
    text = HTML_COMMENT_RE.sub("", text)
    text = GLYPH_RE.sub("", text)
    text = HSPACE_RE.sub(" ", text)  # collapse the whitespace runs a stripped GLYPH leaves behind
    text = drop_running_headers(text)
    text = BLANKS_RE.sub("\n\n", text)
    return text.strip() + "\n"


def resolve_docling(paper, clean_idx, raw_idx):
    """Cascade: exact source_file from the knowledge doc, then first-author-year prefix."""
    kd = paper.get("knowledge_doc")
    if kd:
        sf = embedded_source_file(DOCS / kd)
        if sf:
            if (CLEAN_DIR / sf).exists():
                return CLEAN_DIR / sf, "clean"
            if (RAW_DIR / sf).exists():
                return RAW_DIR / sf, "raw"
    key = author_year_key(paper)
    if len(key) > 5:
        for idx, base, label in ((clean_idx, CLEAN_DIR, "clean"), (raw_idx, RAW_DIR, "raw")):
            for stem_norm, fn in idx.items():
                if stem_norm.startswith(key):
                    return base / fn, label
    return None, None


def main() -> int:
    if not DATA_IN.exists():
        print(f"ERROR: {DATA_IN} not found", file=sys.stderr)
        return 1
    papers = json.loads(DATA_IN.read_text(encoding="utf-8")).get("papers", [])
    clean_idx = {norm(p.name[:-3]): p.name for p in CLEAN_DIR.glob("*.md")}
    raw_idx = {norm(p.name[:-3]): p.name for p in RAW_DIR.glob("*.md")}

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.md"):
        old.unlink()

    manifest = {}
    n_clean = n_raw = n_none = 0
    glyph_files = []
    for p in papers:
        pid = p.get("id")
        if not pid:
            continue
        path, src = resolve_docling(p, clean_idx, raw_idx)
        if not path:
            manifest[pid] = {"src": "none", "chars": 0}
            n_none += 1
            continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        if GLYPH_RE.search(raw):
            glyph_files.append(path.name)
        body = clean(raw)
        (OUT_DIR / f"{pid}.md").write_text(body, encoding="utf-8")
        manifest[pid] = {"src": src, "chars": len(body), "source_file": path.name}
        n_clean += src == "clean"
        n_raw += src == "raw"

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"papers: {len(papers)}")
    print(f"  full text from markdown_clean: {n_clean}")
    print(f"  full text from markdown (raw):  {n_raw}")
    print(f"  no full text (abstract-only):   {n_none}")
    print(f"  GLYPH-affected source files:    {len(glyph_files)}")
    print(f"wrote {n_clean + n_raw} files to {OUT_DIR.relative_to(ROOT)} plus manifest")
    return 0


if __name__ == "__main__":
    sys.exit(main())
