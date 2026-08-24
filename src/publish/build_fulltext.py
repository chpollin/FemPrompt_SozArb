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

import html
import json
import re
import shutil
import sys
import unicodedata
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
DATA_IN = DOCS / "data" / "research_vault_v2.json"
CLEAN_DIR = ROOT / "generated" / "markdown_clean"
RAW_DIR = ROOT / "generated" / "markdown"
OUT_DIR = DOCS / "data" / "fulltext"
MANIFEST = DOCS / "data" / "fulltext_manifest.json"


def source_identity(paper: dict[str, object]) -> dict[str, object]:
    """Return the exact work-version binding for a served Paper source."""
    return {
        key: paper[key]
        for key in (
            "work_id",
            "version_id",
            "version_type",
            "preferred_version_id",
            "is_preferred_version",
        )
        if paper.get(key) is not None
    }

# Curated identity repairs for conversions that the generic author/year cascade
# cannot resolve.  Each entry names an exact Paper record, the real conversion,
# and a title passage that must occur in that conversion.  The resolver still
# rejects DOI conflicts and fails if a committed override disappears.
CURATED_SOURCE_OVERRIDES = {
    "P4YQIKJX": {
        "source": "clean",
        "file": "P4YQIKJX.md",
        "title_evidence": "Ethics & AI: A systematic review on ethical concerns and related strategies for designing with AI in healthcare",
    },
    "A2P8MXMY": {
        "source": "clean",
        "file": "A2P8MXMY.md",
        "title_evidence": "Algorithmic Justice in Child Protection: Statistical Fairness, Social Justice and the Implications for Practice",
    },
    "BHXDU7VM": {
        "source": "clean",
        "file": "BHXDU7VM.md",
        "title_evidence": "How People Use ChatGPT",
    },
    "QUV5DQH3": {
        "source": "clean",
        "file": "QUV5DQH3.md",
        "title_evidence": "When Good Algorithms Go Sexist: Why and How to Advance AI Gender Equity",
    },
    "FTJM5R8N": {
        "source": "clean",
        "file": "FTJM5R8N.md",
        "title_evidence": "Defeating Nondeterminism in LLM Inference",
    },
    "3ZNMTJ5B": {
        "source": "raw",
        "file": "Feminist_AI_n.d._Academy.md",
        "title_evidence": "feminist AI | ACADEMY",
    },
    "8MRNK6FX": {
        "source": "raw",
        "file": "Unknown_2024_Research.md",
        "title_evidence": "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work",
    },
    "SSF5Q33W": {
        "source": "raw",
        "file": "Unknown_2024_Research.md",
        "title_evidence": "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work",
    },
    "4KMMPA6A": {
        "source": "clean",
        "file": "Gengler_2024_Faires_KI-Prompting_–_Ein_Leitfaden_für.md",
        "title_evidence": "Faires KI-Prompting Ein Leitfaden für Unternehmen",
    },
    "EQV4DNQR": {
        "source": "raw",
        "file": "UNESCO_2024_Bias_against_women_and_girls_in_large_language.md",
        "title_evidence": "Challenging systematic prejudices: an Investigation into Gender Bias in Large Language Models",
    },
    "J5EF9W6M": {
        "source": "raw",
        "file": "Project_2024_Intersectionality.md",
        "title_evidence": "AI & Intersectionality A Toolkit for Fairness & Inclusion",
    },
    "NSI6S5QE": {
        "source": "clean",
        "file": "NASW_ASWB_CSWE_CSWA_2017_Standards_for_Technology_in_Social_Work_Practice.md",
        "title_evidence": "Standards for Technology in Social Work Practice",
    },
    # OA batch A: exact Paper records whose acquired PDFs have no knowledge-doc
    # source_file to drive the normal resolver cascade.
    "VSZM7CT6": {
        "source": "clean",
        "file": "VSZM7CT6.md",
        "title_evidence": "Problematising Artificial Intelligence in Social Work Education: Challenges, Issues and Possibilities",
    },
    "7FEFMCBZ": {
        "source": "clean",
        "file": "7FEFMCBZ.md",
        "title_evidence": "How Child Welfare Workers Reduce Racial Disparities in Algorithmic Decisions",
    },
    "R7V99ERA": {
        "source": "clean",
        "file": "R7V99ERA.md",
        "title_evidence": "Examining risks of racial biases in NLP tools for child protective services",
    },
    "4ZL5Q48E": {
        "source": "clean",
        "file": "4ZL5Q48E.md",
        "title_evidence": "Algorithmic management in a work context",
    },
    "J7V3AAQT": {
        "source": "clean",
        "file": "J7V3AAQT.md",
        "title_evidence": "A chatbot for mental health support: exploring the impact of Emohaa on reducing mental distress in China",
    },
}

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


def embedded_source_metadata(served_md: Path) -> dict[str, object]:
    """Return the source identity embedded below a knowledge doc's full-text marker."""
    try:
        md = served_md.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return {}
    i = md.find("## Full Text")
    seg = md[i:] if i != -1 else md
    metadata: dict[str, object] = {}
    for field in ("source_file", "title"):
        match = re.search(rf"^{field}:\s*(.+?)\s*$", seg, re.MULTILINE)
        if match:
            metadata[field] = match.group(1).strip().strip('"')
    authors = re.search(r"^authors:\s*(.+?)\s*$", seg, re.MULTILINE)
    if authors:
        try:
            value = json.loads(authors.group(1))
        except json.JSONDecodeError:
            value = []
        if isinstance(value, list) and all(isinstance(author, str) for author in value):
            metadata["authors"] = value
    year = re.search(r"^year:\s*(\d{4})\s*$", seg, re.MULTILINE)
    if year:
        metadata["year"] = int(year.group(1))
    return metadata


def embedded_source_file(served_md: Path) -> str | None:
    """Return the conversion filename embedded in a served knowledge doc."""
    source_file = embedded_source_metadata(served_md).get("source_file")
    return source_file if isinstance(source_file, str) else None


GENERIC_HEADINGS = {
    "abstract",
    "acknowledgements",
    "article",
    "articleinfo",
    "citation",
    "contents",
    "copyright",
    "correspondence",
    "forum",
    "introduction",
    "keywords",
    "openaccess",
    "originalpaper",
    "researcharticle",
    "viewpoint",
}


def substantive_heading(value: str) -> str | None:
    """Discard document-type labels while retaining a title after such a prefix."""
    value = html.unescape(value).strip()
    prefixed = re.match(
        r"^(?:research[- ]?article|original paper|article|viewpoint|forum)\s*"
        r"(?:[:\-–—]\s*)?(.+)$",
        value,
        re.IGNORECASE,
    )
    if prefixed:
        value = prefixed.group(1).strip()
    if not value or norm(value) in GENERIC_HEADINGS:
        return None
    if re.match(r"^\d+(?:\.\d+)*\s+", value):
        return None
    return value


def source_titles(path: Path) -> list[str]:
    """Return substantive title candidates from the document's compact title block."""
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []
    candidates: list[str] = []
    frontmatter = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if frontmatter:
        title = re.search(
            r'^title:\s*["\']?(.+?)["\']?\s*$', frontmatter.group(1), re.MULTILINE
        )
        if title:
            candidates.append(title.group(1).strip())
    early_lines = text.splitlines()[:120]
    headings = [
        heading
        for line in early_lines
        if (match := re.match(r"^#{1,2}\s+(.+?)\s*$", line))
        if (heading := substantive_heading(match.group(1)))
    ]
    candidates.extend(headings[:5])
    return candidates


def filename_title(path: Path) -> str:
    """Return a filename-derived title hint, which never proves identity by itself."""
    value = path.stem.replace("_", " ")
    return re.sub(r"^.*?\b(?:19|20)\d{2}\b\s*", "", value, count=1)


TITLE_STOPWORDS = {
    "and",
    "are",
    "das",
    "der",
    "die",
    "ein",
    "eine",
    "for",
    "from",
    "how",
    "ist",
    "mit",
    "the",
    "und",
    "von",
    "was",
    "what",
    "why",
    "with",
    "zum",
    "zur",
}


def title_tokens(value: str) -> set[str]:
    """Return stable content tokens for truncated or typographically noisy titles."""
    ascii_value = (
        unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    )
    return {
        token
        for token in re.findall(r"[a-z0-9]+", ascii_value.lower())
        if len(token) > 2 and not token.isdigit() and token not in TITLE_STOPWORDS
    }


def titles_match(expected: str, candidates: list[str]) -> bool:
    """Require a strong title match before attaching a conversion to a paper."""
    expected_norm = norm(expected)
    expected_tokens = title_tokens(expected)
    if not expected_norm:
        return False
    for candidate in candidates:
        candidate_norm = norm(candidate)
        if not candidate_norm:
            continue
        shorter = min(len(expected_norm), len(candidate_norm))
        longer = max(len(expected_norm), len(candidate_norm))
        if expected_norm == candidate_norm:
            return True
        if (
            shorter >= 20
            and shorter / longer >= 0.72
            and (expected_norm in candidate_norm or candidate_norm in expected_norm)
        ):
            return True
        if SequenceMatcher(None, expected_norm, candidate_norm).ratio() >= 0.86:
            return True
        candidate_tokens = title_tokens(candidate)
        overlap = len(expected_tokens & candidate_tokens)
        shorter_token_count = min(len(expected_tokens), len(candidate_tokens))
        if shorter_token_count:
            candidate_containment = overlap / len(candidate_tokens)
            expected_coverage = overlap / len(expected_tokens)
            # Docling filenames and early headings are often truncated. Three shared
            # content words are enough only when they also cover at least half of the
            # expected title. This rejects a shorter related title that merely reorders
            # the expected paper's generic subject words.
            if (
                overlap >= 4
                and candidate_containment >= 0.75
                and expected_coverage >= 0.35
            ) or (
                overlap >= 2
                and candidate_containment >= 0.75
                and expected_coverage >= 0.5
            ):
                return True
    return False


def titles_corroborate(expected: str, candidates: list[str]) -> bool:
    """Require topical support before a filename may confirm a renamed publication."""
    expected_tokens = title_tokens(expected)
    return any(
        len(expected_tokens & title_tokens(candidate)) >= 2 for candidate in candidates
    )


def title_similarity(expected: str, candidates: list[str]) -> float:
    """Rank plausible same-author/year sources without weakening the match gate."""
    expected_norm = norm(expected)
    expected_tokens = title_tokens(expected)
    best = 0.0
    for candidate in candidates:
        candidate_norm = norm(candidate)
        if not candidate_norm:
            continue
        if expected_norm == candidate_norm:
            return 1.0
        sequence = SequenceMatcher(None, expected_norm, candidate_norm).ratio()
        candidate_tokens = title_tokens(candidate)
        overlap = len(expected_tokens & candidate_tokens)
        token_f1 = (
            2 * overlap / (len(expected_tokens) + len(candidate_tokens))
            if expected_tokens and candidate_tokens
            else 0.0
        )
        best = max(best, sequence, token_f1)
    return best


DOI_RE = re.compile(
    r"(?:\bdoi\s*:|https?://doi\.org/)\s*[\"']?"
    r"(10\.\d{4,9}/[^\s<>\"']+)",
    re.IGNORECASE,
)


def source_dois(path: Path) -> set[str]:
    """Extract DOI identifiers from the compact publication metadata block."""
    try:
        title_block = "\n".join(
            path.read_text(encoding="utf-8", errors="replace").splitlines()[:120]
        )
    except OSError:
        return set()
    return {
        match.group(1).lower().rstrip(".,;:)")
        for match in DOI_RE.finditer(html.unescape(title_block))
    }


def first_author_surname(authors: object) -> str:
    """Return a normalized first-author surname from corpus-style author metadata."""
    if not isinstance(authors, str) or not authors.strip():
        return ""
    return norm(authors.split(";", 1)[0].split(",", 1)[0])


def identity_conflicts(
    paper: dict[str, object], path: Path, metadata: dict[str, object] | None = None
) -> list[str]:
    """Return hard DOI, first-author, and year conflicts for a proposed source."""
    conflicts: list[str] = []
    expected_doi = str(paper.get("doi") or "").lower().strip()
    dois = source_dois(path)
    if (
        expected_doi
        and dois
        and not any(
            expected_doi == doi
            or expected_doi.startswith(doi)
            or doi.startswith(expected_doi)
            for doi in dois
        )
    ):
        conflicts.append("doi")

    metadata = metadata or {}
    expected_year = paper.get("year")
    source_year = metadata.get("year")
    if isinstance(expected_year, int) and isinstance(source_year, int):
        if expected_year != source_year:
            conflicts.append("year")

    expected_author = first_author_surname(paper.get("authors"))
    source_authors = metadata.get("authors")
    if expected_author and isinstance(source_authors, list) and source_authors:
        source_author = source_authors[0]
        if isinstance(source_author, str) and expected_author not in norm(
            source_author
        ):
            conflicts.append("author")
    return conflicts


def verified_source(
    paper: dict[str, object],
    path: Path,
    label: str,
    metadata: dict[str, object] | None = None,
) -> tuple[Path | None, str]:
    """Fail closed on identity conflicts or an unsupported filename-only match."""
    conflicts = identity_conflicts(paper, path, metadata)
    if "doi" in conflicts:
        return None, "mismatch"
    expected = str(paper.get("title") or "")
    document_titles = source_titles(path)
    metadata_title = (metadata or {}).get("title")
    corroborated_metadata = isinstance(metadata_title, str) and titles_match(
        metadata_title, document_titles
    )
    verified_titles = document_titles.copy()
    if corroborated_metadata:
        verified_titles.insert(0, metadata_title)
    if titles_match(expected, verified_titles):
        return path, label
    if (
        not {"author", "year"} & set(conflicts)
        and titles_match(expected, [filename_title(path)])
        and titles_corroborate(expected, document_titles)
    ):
        return path, label
    return None, "mismatch"


def author_year_key(paper: dict[str, object]) -> str:
    """First-author lastname plus year, e.g. 'chatterji2025', for the fallback join."""
    ay = (paper.get("author_year") or "").strip()
    if not ay:
        return ""
    year = re.search(r"(?:19|20)\d{2}", ay)
    last = re.split(r"[\s,]", ay)[0]
    return norm(last) + (year.group(0) if year else "")


def curated_source(paper: dict[str, object]) -> tuple[Path | None, str | None]:
    """Resolve a recorded identity repair while retaining deterministic guards."""
    paper_id = str(paper.get("id") or "")
    override = CURATED_SOURCE_OVERRIDES.get(paper_id)
    if override is None:
        return None, None
    label = override["source"]
    base = CLEAN_DIR if label == "clean" else RAW_DIR
    path = base / override["file"]
    if not path.exists():
        raise FileNotFoundError(f"curated full-text source is missing: {path}")

    evidence = override["title_evidence"]
    expected = str(paper.get("title") or "")
    expected_norm = norm(expected)
    evidence_norm = norm(evidence)
    if not (
        titles_match(expected, [evidence])
        or evidence_norm in expected_norm
        or expected_norm in evidence_norm
    ):
        raise ValueError(f"curated title evidence no longer matches Paper {paper_id}")
    source_text = html.unescape(path.read_text(encoding="utf-8", errors="replace"))
    if evidence_norm not in norm(source_text):
        raise ValueError(f"curated title evidence is absent from source {path}")
    if identity_conflicts(paper, path):
        raise ValueError(f"curated source conflicts with Paper identity {paper_id}")
    return path, label


def clean(text: str) -> str:
    text = FRONTMATTER_RE.sub("", text, count=1)
    text = HTML_COMMENT_RE.sub("", text)
    text = GLYPH_RE.sub("", text)
    text = HSPACE_RE.sub(
        " ", text
    )  # collapse the whitespace runs a stripped GLYPH leaves behind
    text = drop_running_headers(text)
    text = BLANKS_RE.sub("\n\n", text)
    return text.strip() + "\n"


def resolve_docling(
    paper: dict[str, object], clean_idx: dict[str, str], raw_idx: dict[str, str]
) -> tuple[Path | None, str | None]:
    """Cascade: exact source_file from the knowledge doc, then first-author-year prefix."""
    override_path, override_label = curated_source(paper)
    if override_path is not None:
        return override_path, override_label
    kd = paper.get("knowledge_doc")
    explicit_mismatch = False
    rejected: set[tuple[str, str]] = set()
    if isinstance(kd, str) and kd:
        metadata = embedded_source_metadata(DOCS / kd)
        sf = metadata.get("source_file")
        if not isinstance(sf, str):
            sf = None
        if sf:
            if (CLEAN_DIR / sf).exists():
                resolved = verified_source(
                    paper, CLEAN_DIR / sf, "clean", metadata=metadata
                )
                if resolved[0]:
                    return resolved
                explicit_mismatch = True
                rejected.add(("clean", sf))
            if (RAW_DIR / sf).exists():
                resolved = verified_source(
                    paper, RAW_DIR / sf, "raw", metadata=metadata
                )
                if resolved[0]:
                    return resolved
                explicit_mismatch = True
                rejected.add(("raw", sf))
    key = author_year_key(paper)
    if len(key) > 5:
        for idx, base, label in (
            (clean_idx, CLEAN_DIR, "clean"),
            (raw_idx, RAW_DIR, "raw"),
        ):
            hits = sorted(
                fn
                for stem_norm, fn in idx.items()
                if stem_norm.startswith(key) and (label, fn) not in rejected
            )
            if len(hits) == 1:
                resolved = verified_source(paper, base / hits[0], label)
                if resolved[0]:
                    return resolved
                explicit_mismatch = True
            if len(hits) > 1:
                expected = str(paper.get("title") or "")
                ranked: list[tuple[float, str]] = []
                for filename in hits:
                    path = base / filename
                    resolved = verified_source(paper, path, label)
                    if resolved[0]:
                        candidates = source_titles(path) + [filename_title(path)]
                        ranked.append(
                            (title_similarity(expected, candidates), filename)
                        )
                    else:
                        explicit_mismatch = True
                ranked.sort()
                if not ranked:
                    continue
                if len(ranked) == 1:
                    return base / ranked[0][1], label
                if len(ranked) > 1 and ranked[-1][0] - ranked[-2][0] >= 0.05:
                    return base / ranked[-1][1], label
                # Equally plausible conversions remain unsafe. Attaching the first would
                # silently transfer evidence between publications from the same year.
                return None, "ambiguous"
    return (None, "mismatch") if explicit_mismatch else (None, None)


def _publish_staged(stage_assets: Path, stage_manifest: Path) -> None:
    """Replace assets and manifest together, restoring the previous build on failure."""
    backup_assets = stage_assets.parent / "previous-fulltext"
    backup_manifest = stage_assets.parent / "previous-fulltext-manifest.json"
    had_assets = OUT_DIR.exists()
    had_manifest = MANIFEST.exists()
    moved_assets = installed_assets = moved_manifest = installed_manifest = False
    try:
        if had_assets:
            OUT_DIR.replace(backup_assets)
            moved_assets = True
        stage_assets.replace(OUT_DIR)
        installed_assets = True
        if had_manifest:
            MANIFEST.replace(backup_manifest)
            moved_manifest = True
        stage_manifest.replace(MANIFEST)
        installed_manifest = True
    except Exception:
        if installed_assets and OUT_DIR.exists():
            shutil.rmtree(OUT_DIR)
        if moved_assets and backup_assets.exists():
            backup_assets.replace(OUT_DIR)
        if installed_manifest and MANIFEST.exists():
            MANIFEST.unlink()
        if moved_manifest and backup_manifest.exists():
            backup_manifest.replace(MANIFEST)
        raise


def main() -> int:
    if not DATA_IN.exists():
        print(f"ERROR: {DATA_IN} not found", file=sys.stderr)
        return 1
    papers = json.loads(DATA_IN.read_text(encoding="utf-8")).get("papers", [])
    clean_idx = {norm(p.name[:-3]): p.name for p in CLEAN_DIR.glob("*.md")}
    raw_idx = {norm(p.name[:-3]): p.name for p in RAW_DIR.glob("*.md")}

    OUT_DIR.parent.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, object]] = {}
    n_clean = n_raw = n_none = n_ambiguous = n_mismatch = 0
    glyph_files: list[str] = []
    with TemporaryDirectory(prefix=".fulltext-stage-", dir=OUT_DIR.parent) as temp_dir:
        stage_root = Path(temp_dir)
        stage_assets = stage_root / "fulltext"
        stage_assets.mkdir()
        stage_manifest = stage_root / "fulltext_manifest.json"
        for paper in papers:
            pid = paper.get("id")
            if not isinstance(pid, str) or not pid:
                continue
            path, src = resolve_docling(paper, clean_idx, raw_idx)
            if not path:
                manifest[pid] = {
                    "src": "none",
                    "chars": 0,
                    **source_identity(paper),
                }
                if src == "ambiguous":
                    manifest[pid]["reason"] = "ambiguous"
                    n_ambiguous += 1
                elif src == "mismatch":
                    manifest[pid]["reason"] = "title_mismatch"
                    n_mismatch += 1
                n_none += 1
                continue
            raw = path.read_text(encoding="utf-8", errors="replace")
            if GLYPH_RE.search(raw):
                glyph_files.append(path.name)
            body = clean(raw)
            (stage_assets / f"{pid}.md").write_text(
                body, encoding="utf-8", newline="\n"
            )
            manifest[pid] = {
                "src": src,
                "chars": len(body),
                "source_file": path.name,
                **source_identity(paper),
            }
            n_clean += src == "clean"
            n_raw += src == "raw"
        stage_manifest.write_text(
            json.dumps(manifest, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
            newline="\n",
        )
        _publish_staged(stage_assets, stage_manifest)
    print(f"papers: {len(papers)}")
    print(f"  full text from markdown_clean: {n_clean}")
    print(f"  full text from markdown (raw):  {n_raw}")
    print(f"  no full text (abstract-only):   {n_none}")
    print(f"  of which ambiguous fallback:    {n_ambiguous}")
    print(f"  of which title mismatch:        {n_mismatch}")
    print(f"  GLYPH-affected source files:    {len(glyph_files)}")
    print(f"wrote {n_clean + n_raw} files to {OUT_DIR.relative_to(ROOT)} plus manifest")
    return 0


if __name__ == "__main__":
    sys.exit(main())
