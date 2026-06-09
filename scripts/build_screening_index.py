#!/usr/bin/env python3
"""Build the corpus full-text search index for the PRISMA screening tool (v4, FR-12).

The screening view searches across the corpus. To keep that instant (no 236 lazy
fetches per query) this script pre-extracts plain searchable text per paper into one
compact JSON the tool loads once.

Source of the searchable text, in order:
  1. the served knowledge document (docs/<knowledge_doc>, i.e. vault/Papers/<title>.md),
     which holds the abstract plus the distilled knowledge document (Kernbefund,
     Methodik, Hauptargumente, Kategorie-Evidenz). This is already published, so the
     index publishes nothing new.
  2. the abstract from research_vault_v2.json, for papers without a knowledge_doc.

It deliberately does NOT read pipeline/markdown_clean/ (the raw copyrighted full
texts): those are not served and must not be published. Swapping the reading/search
source to the raw local full text is a separate, copyright-gated step.

Output: docs/data/fulltext_index.json
  { "meta": {...}, "papers": { "<id>": { "t": title, "ay": author_year,
    "kd": knowledge_doc, "src": "kd"|"abstract"|"none", "n": chars, "x": lowered_text } } }

Run: python scripts/build_screening_index.py
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
DATA_IN = DOCS / "data" / "research_vault_v2.json"
INDEX_OUT = DOCS / "data" / "fulltext_index.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
# embedded yaml blocks (the note repeats a frontmatter inside "## Full Text")
EMBEDDED_YAML_RE = re.compile(r"\n---\s*\n(?:[^\n]*:[^\n]*\n|\s*\n|- [^\n]*\n)+?---\s*\n")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)\|([^\]]+)\]\]")
WIKILINK2_RE = re.compile(r"\[\[([^\]]+)\]\]")
MDLINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")
HEADING_RE = re.compile(r"^#{1,6}\s+", re.MULTILINE)
LIST_RE = re.compile(r"^\s*[-*]\s+", re.MULTILINE)
EMPH_RE = re.compile(r"[*_`>]+")
WS_RE = re.compile(r"\s+")


def to_plain(md: str) -> str:
    """Strip Markdown / frontmatter / wikilinks down to lowercased searchable text."""
    md = FRONTMATTER_RE.sub("", md, count=1)
    md = EMBEDDED_YAML_RE.sub("\n", md)
    md = HTML_COMMENT_RE.sub(" ", md)
    md = WIKILINK_RE.sub(r"\2", md)
    md = WIKILINK2_RE.sub(r"\1", md)
    md = MDLINK_RE.sub(r"\1", md)
    md = HEADING_RE.sub("", md)
    md = LIST_RE.sub("", md)
    md = EMPH_RE.sub("", md)
    md = WS_RE.sub(" ", md)
    return md.strip().lower()


def main() -> int:
    if not DATA_IN.exists():
        print(f"ERROR: {DATA_IN} not found", file=sys.stderr)
        return 1
    data = json.loads(DATA_IN.read_text(encoding="utf-8"))
    papers = data.get("papers", [])

    out = {}
    n_kd = n_abs = n_none = 0
    total_chars = 0
    for p in papers:
        pid = p.get("id")
        if not pid:
            continue
        kd = p.get("knowledge_doc") or ""
        text = ""
        src = "none"
        if kd:
            fp = DOCS / kd
            if fp.exists():
                text = to_plain(fp.read_text(encoding="utf-8", errors="replace"))
                src = "kd"
                n_kd += 1
        if not text:
            abs_ = (p.get("abstract") or "").strip()
            if abs_:
                text = WS_RE.sub(" ", abs_).lower()
                src = "abstract"
                n_abs += 1
            else:
                n_none += 1
        total_chars += len(text)
        out[pid] = {
            "t": p.get("title") or "",
            "ay": p.get("author_year") or "",
            "kd": kd,
            "src": src,
            "n": len(text),
            "x": text,
        }

    payload = {
        "meta": {
            "generated_by": "scripts/build_screening_index.py",
            "n_papers": len(out),
            "n_with_knowledge_doc": n_kd,
            "n_abstract_only": n_abs,
            "n_no_text": n_none,
            "total_chars": total_chars,
            "note": "Searchable text from served knowledge docs + abstracts only; raw full texts are NOT published.",
        },
        "papers": out,
    }
    INDEX_OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    size_kb = INDEX_OUT.stat().st_size / 1024
    print(f"Wrote {INDEX_OUT.relative_to(ROOT)}")
    print(f"  papers: {len(out)}  (kd={n_kd}, abstract={n_abs}, none={n_none})")
    print(f"  searchable chars: {total_chars:,}")
    print(f"  index size: {size_kb:.0f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
