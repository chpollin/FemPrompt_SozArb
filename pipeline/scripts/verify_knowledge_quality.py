#!/usr/bin/env python3
"""
Knowledge Document Quality Verification Script

Systematically verifies ALL 249 knowledge documents against the 252 original
markdown documents. Checks YAML frontmatter, title/author/year matching,
content fidelity via keyword overlap, category completeness, and structural
completeness.

Usage:
    python verify_knowledge_quality.py
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge" / "distilled"
MARKDOWN_DIR = Path(__file__).parent.parent / "markdown"

REQUIRED_FRONTMATTER_FIELDS = {"title", "authors", "year", "type"}
REQUIRED_CATEGORIES = {
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet",
    "Feministisch", "Fairness"
}
# Sections we expect in a knowledge doc (German headings used in the template)
REQUIRED_SECTIONS = {"Kernbefund", "Hauptargumente", "Kategorie-Evidenz", "Assessment-Relevanz"}
# Some docs use slightly different heading names; we accept alternates
SECTION_ALIASES = {
    "Kernbefund": ["Kernbefund", "Kernaussage", "Kernaussagen"],
    "Hauptargumente": ["Hauptargumente", "Argumente", "Hauptargument"],
    "Kategorie-Evidenz": ["Kategorie-Evidenz", "Kategorien", "Kategorie"],
    "Assessment-Relevanz": ["Assessment-Relevanz", "Bewertung", "Assessment"],
}

# Threshold: minimum keyword overlap ratio to consider content faithful
CONTENT_FIDELITY_THRESHOLD = 0.25  # 25% of knowledge-doc keywords should appear in original
# Minimum length (chars) for a knowledge doc to not be considered "near-empty"
MIN_CONTENT_LENGTH = 300

# ---------------------------------------------------------------------------
# YAML Frontmatter Parser (simple, no external deps)
# ---------------------------------------------------------------------------

def parse_yaml_frontmatter(text):
    """Parse YAML frontmatter from markdown text. Returns (dict, body) or (None, text)."""
    text = text.lstrip("\ufeff")  # strip BOM
    if not text.startswith("---"):
        return None, text

    end = text.find("---", 3)
    if end == -1:
        return None, text

    yaml_block = text[3:end].strip()
    body = text[end + 3:].strip()

    data = {}
    current_key = None
    current_list = None

    for line in yaml_block.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        # List continuation
        if stripped.startswith("- ") and current_key and current_list is not None:
            val = stripped[2:].strip().strip('"').strip("'")
            current_list.append(val)
            data[current_key] = current_list
            continue

        # Key: value
        m = re.match(r'^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)', stripped)
        if m:
            key = m.group(1)
            val = m.group(2).strip()

            if not val:
                # Could be start of a list
                current_key = key
                current_list = []
                data[key] = current_list
                continue

            # Inline list: ["a", "b"]
            if val.startswith("[") and val.endswith("]"):
                items = val[1:-1]
                parsed = [x.strip().strip('"').strip("'") for x in items.split(",") if x.strip()]
                data[key] = parsed
                current_key = key
                current_list = None
            else:
                val = val.strip('"').strip("'")
                # Try numeric
                try:
                    val = int(val)
                except ValueError:
                    pass
                data[key] = val
                current_key = key
                current_list = None
        else:
            current_key = None
            current_list = None

    return data, body


# ---------------------------------------------------------------------------
# Keyword extraction (simple)
# ---------------------------------------------------------------------------

def extract_keywords(text, min_len=4):
    """Extract meaningful words from text for fuzzy content comparison."""
    # Remove markdown syntax
    text = re.sub(r'[#*_\[\]\(\){}|`>]', ' ', text)
    text = re.sub(r'https?://\S+', '', text)
    # Tokenize
    words = re.findall(r'[A-Za-zÄÖÜäöüß]{%d,}' % min_len, text.lower())
    # Remove very common stopwords (DE + EN)
    stopwords = {
        "dass", "eine", "einem", "einen", "einer", "eines", "dies", "diese", "dieser",
        "dieses", "wird", "werden", "wurde", "wurden", "sind", "sein", "seine", "seiner",
        "haben", "hatte", "hatten", "nicht", "auch", "oder", "aber", "nach", "noch",
        "über", "unter", "zwischen", "durch", "mehr", "andere", "anderen", "anderer",
        "kann", "können", "könnte", "muss", "müssen", "soll", "sollen", "sollte",
        "with", "that", "this", "from", "have", "been", "were", "they", "their",
        "which", "when", "what", "there", "these", "those", "than", "then", "them",
        "into", "some", "such", "only", "other", "also", "about", "more", "most",
        "will", "would", "could", "should", "each", "make", "like", "many", "well",
        "based", "using", "used", "however", "within", "between", "through",
        "including", "particularly", "sowie", "dabei", "daher", "damit", "dazu",
        "bereits", "allerdings", "insbesondere", "beispielsweise", "verschiedene",
        "verschiedenen", "verschiedener", "page", "journal",
    }
    return [w for w in words if w not in stopwords]


def keyword_overlap(knowledge_keywords, original_keywords):
    """Compute ratio of knowledge keywords found in original."""
    if not knowledge_keywords:
        return 0.0
    orig_set = set(original_keywords)
    found = sum(1 for kw in knowledge_keywords if kw in orig_set)
    return found / len(knowledge_keywords)


# ---------------------------------------------------------------------------
# Matching helpers
# ---------------------------------------------------------------------------

def normalize_for_match(s):
    """Normalize a string for fuzzy matching."""
    if not isinstance(s, str):
        return ""
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9äöüß\s]', '', s)
    s = re.sub(r'\s+', ' ', s)
    return s


def title_in_original(title, original_text):
    """Check if the title (or substantial part) appears in the original."""
    norm_title = normalize_for_match(title)
    norm_orig = normalize_for_match(original_text[:5000])  # check first portion

    if not norm_title:
        return False

    # Try full title
    if norm_title in norm_orig:
        return True

    # Try significant words from title (at least 60% must appear)
    title_words = [w for w in norm_title.split() if len(w) >= 4]
    if not title_words:
        return True  # very short title, can't verify
    found = sum(1 for w in title_words if w in norm_orig)
    return (found / len(title_words)) >= 0.6


def authors_in_original(authors, original_text):
    """Check if authors appear in the original markdown."""
    if not authors:
        return False
    if isinstance(authors, str):
        authors = [authors]

    norm_orig = normalize_for_match(original_text[:5000])
    found = 0
    for author in authors:
        # Use last name (typically most unique)
        parts = author.strip().split()
        if not parts:
            continue
        last_name = parts[-1].lower()
        # Also check first part (sometimes last name is first in citation style)
        first_part = parts[0].lower()
        if last_name in norm_orig or first_part in norm_orig:
            found += 1

    return found > 0  # at least one author must be found


def year_in_original(year, original_text, filename):
    """Check if year appears in original or in the filename."""
    year_str = str(year)
    if year_str in original_text[:5000]:
        return True
    if year_str in filename:
        return True
    return False


# ---------------------------------------------------------------------------
# Section detection
# ---------------------------------------------------------------------------

def find_sections(body):
    """Find which section headings are present in the knowledge doc body."""
    headings = re.findall(r'^#+\s+(.+)', body, re.MULTILINE)
    heading_texts = [h.strip() for h in headings]
    return heading_texts


def check_required_sections(body):
    """Check which required sections are present. Returns (present, missing)."""
    headings = find_sections(body)
    heading_lower = [h.lower() for h in headings]

    present = []
    missing = []
    for section, aliases in SECTION_ALIASES.items():
        found = False
        for alias in aliases:
            if any(alias.lower() in h for h in heading_lower):
                found = True
                break
        if found:
            present.append(section)
        else:
            missing.append(section)

    return present, missing


# ---------------------------------------------------------------------------
# Category check
# ---------------------------------------------------------------------------

def check_categories(frontmatter, body):
    """
    Check if all 10 binary categories are addressed.
    They should either be in the frontmatter categories list or have a
    dedicated subsection under Kategorie-Evidenz (even if the category is
    absent from the paper, the doc should note that).

    Returns (present_categories, addressed_in_body, missing_categories).
    """
    fm_categories = set()
    if "categories" in frontmatter:
        cats = frontmatter["categories"]
        if isinstance(cats, list):
            fm_categories = set(cats)
        elif isinstance(cats, str):
            fm_categories = {cats}

    # Categories mentioned in body headings (### subsections)
    body_categories = set()
    for cat in REQUIRED_CATEGORIES:
        if re.search(r'###\s+' + re.escape(cat), body):
            body_categories.add(cat)

    # A category is "addressed" if it's either listed in frontmatter OR has a subsection
    addressed = fm_categories | body_categories

    # Missing = categories not addressed at all
    missing = REQUIRED_CATEGORIES - addressed

    return fm_categories, body_categories, missing


# ---------------------------------------------------------------------------
# Main verification
# ---------------------------------------------------------------------------

def verify_all():
    """Run all verification checks on all knowledge documents."""

    # Gather file lists
    knowledge_files = sorted([f for f in KNOWLEDGE_DIR.iterdir() if f.suffix == ".md"])
    markdown_files = sorted([f for f in MARKDOWN_DIR.iterdir() if f.suffix == ".md"])

    knowledge_names = {f.name for f in knowledge_files}
    markdown_names = {f.name for f in markdown_files}

    print("=" * 80)
    print("KNOWLEDGE DOCUMENT QUALITY VERIFICATION REPORT")
    print("=" * 80)
    print()
    print(f"Knowledge documents (distilled):  {len(knowledge_files)}")
    print(f"Original markdowns (from PDFs):   {len(markdown_files)}")
    print()

    # -----------------------------------------------------------------------
    # 1. Find docs in markdown/ but NOT in knowledge/distilled/
    # -----------------------------------------------------------------------
    missing_from_knowledge = sorted(markdown_names - knowledge_names)
    print("-" * 80)
    print(f"MISSING FROM KNOWLEDGE (in markdown/ but not in distilled/): {len(missing_from_knowledge)}")
    print("-" * 80)
    for name in missing_from_knowledge:
        # Try to figure out why - check if there's a similar name
        possible = [k for k in knowledge_names if name[:20].lower() in k.lower()]
        reason = ""
        if possible:
            reason = f"  -> Possible match: {possible[0]}"
        else:
            # Check file size
            fpath = MARKDOWN_DIR / name
            try:
                size = fpath.stat().st_size
                if size < 200:
                    reason = f"  -> Original is very small ({size} bytes), may have been skipped"
                else:
                    reason = f"  -> Original size: {size} bytes, no obvious match found"
            except Exception:
                reason = "  -> Could not determine reason"
        print(f"  {name}{reason}")
    print()

    # Also: knowledge docs with no matching original
    orphan_knowledge = sorted(knowledge_names - markdown_names)
    if orphan_knowledge:
        print(f"ORPHAN KNOWLEDGE (in distilled/ but not in markdown/): {len(orphan_knowledge)}")
        for name in orphan_knowledge:
            print(f"  {name}")
        print()

    # -----------------------------------------------------------------------
    # 2. Verify each knowledge document
    # -----------------------------------------------------------------------
    issues = defaultdict(list)  # issue_type -> [(filename, detail)]
    doc_issues = defaultdict(list)  # filename -> [issues]
    perfect_count = 0
    checked = 0

    for kf in knowledge_files:
        filename = kf.name
        problems = []

        try:
            content = kf.read_text(encoding="utf-8")
        except Exception as e:
            problems.append(("read_error", f"Cannot read file: {e}"))
            doc_issues[filename] = problems
            issues["read_error"].append((filename, str(e)))
            checked += 1
            continue

        # --- Parse frontmatter ---
        frontmatter, body = parse_yaml_frontmatter(content)

        if frontmatter is None:
            problems.append(("broken_yaml", "No valid YAML frontmatter found"))
            issues["broken_yaml"].append((filename, "Missing or broken frontmatter"))
        else:
            # Check required fields
            missing_fields = REQUIRED_FRONTMATTER_FIELDS - set(frontmatter.keys())
            if missing_fields:
                detail = f"Missing fields: {', '.join(sorted(missing_fields))}"
                problems.append(("missing_frontmatter_fields", detail))
                issues["missing_frontmatter_fields"].append((filename, detail))

        # --- Content length check ---
        if len(body) < MIN_CONTENT_LENGTH:
            problems.append(("near_empty", f"Body length only {len(body)} chars"))
            issues["near_empty"].append((filename, f"{len(body)} chars"))

        # --- Structural completeness ---
        present_sections, missing_sections = check_required_sections(body)
        if missing_sections:
            detail = f"Missing: {', '.join(missing_sections)}"
            problems.append(("missing_sections", detail))
            issues["missing_sections"].append((filename, detail))

        # --- Category completeness ---
        if frontmatter:
            fm_cats, body_cats, missing_cats = check_categories(frontmatter, body)
            # We only flag if categories that ARE listed in frontmatter don't have body evidence
            # AND if some categories are completely unaddressed
            fm_cats_without_evidence = fm_cats - body_cats
            if fm_cats_without_evidence and len(fm_cats_without_evidence) > 3:
                detail = f"Listed in frontmatter but no body subsection: {', '.join(sorted(fm_cats_without_evidence))}"
                problems.append(("categories_no_evidence", detail))
                issues["categories_no_evidence"].append((filename, detail))

        # --- Compare against original ---
        original_path = MARKDOWN_DIR / filename
        has_original = original_path.exists()

        if has_original and frontmatter:
            try:
                original_text = original_path.read_text(encoding="utf-8")
            except Exception:
                original_text = ""

            if original_text:
                # Title match
                title = frontmatter.get("title", "")
                if title and not title_in_original(title, original_text):
                    problems.append(("title_mismatch", f"Title '{title[:60]}...' not found in original"))
                    issues["title_mismatch"].append((filename, title[:80]))

                # Author match
                authors = frontmatter.get("authors", [])
                if authors and not authors_in_original(authors, original_text):
                    author_str = ", ".join(authors) if isinstance(authors, list) else str(authors)
                    problems.append(("author_mismatch", f"Authors '{author_str[:60]}' not in original"))
                    issues["author_mismatch"].append((filename, author_str[:80]))

                # Year match
                year = frontmatter.get("year", "")
                if year and not year_in_original(year, original_text, filename):
                    problems.append(("year_mismatch", f"Year {year} not found in original or filename"))
                    issues["year_mismatch"].append((filename, str(year)))

                # Content fidelity (keyword overlap)
                knowledge_kw = extract_keywords(body)
                original_kw = extract_keywords(original_text)
                overlap = keyword_overlap(knowledge_kw, original_kw)
                if overlap < CONTENT_FIDELITY_THRESHOLD:
                    detail = f"Keyword overlap: {overlap:.1%} (threshold: {CONTENT_FIDELITY_THRESHOLD:.0%})"
                    problems.append(("low_content_fidelity", detail))
                    issues["low_content_fidelity"].append((filename, f"{overlap:.1%}"))

        elif not has_original and frontmatter:
            problems.append(("no_original", "No matching original markdown found"))
            issues["no_original"].append((filename, ""))

        # --- Record results ---
        if problems:
            doc_issues[filename] = problems
        else:
            perfect_count += 1
        checked += 1

    # -----------------------------------------------------------------------
    # 3. Print detailed results
    # -----------------------------------------------------------------------
    print("=" * 80)
    print("ISSUE SUMMARY BY TYPE")
    print("=" * 80)
    print()

    issue_order = [
        ("broken_yaml", "Broken/Missing YAML Frontmatter"),
        ("missing_frontmatter_fields", "Missing Required Frontmatter Fields"),
        ("near_empty", "Near-Empty Documents"),
        ("missing_sections", "Missing Required Sections"),
        ("title_mismatch", "Title Mismatch with Original"),
        ("author_mismatch", "Author Mismatch with Original"),
        ("year_mismatch", "Year Mismatch with Original"),
        ("low_content_fidelity", "Low Content Fidelity (Potential Hallucination)"),
        ("categories_no_evidence", "Categories Listed Without Body Evidence"),
        ("no_original", "No Matching Original Markdown"),
        ("read_error", "File Read Error"),
    ]

    total_issues = 0
    for issue_key, issue_label in issue_order:
        items = issues.get(issue_key, [])
        if items:
            total_issues += len(items)
            print(f"--- {issue_label}: {len(items)} ---")
            for fname, detail in sorted(items):
                print(f"  {fname}")
                if detail:
                    print(f"    {detail}")
            print()

    # -----------------------------------------------------------------------
    # 4. Documents with multiple issues
    # -----------------------------------------------------------------------
    multi_issue_docs = {f: p for f, p in doc_issues.items() if len(p) >= 2}
    if multi_issue_docs:
        print("=" * 80)
        print(f"DOCUMENTS WITH MULTIPLE ISSUES ({len(multi_issue_docs)})")
        print("=" * 80)
        for fname in sorted(multi_issue_docs.keys()):
            probs = multi_issue_docs[fname]
            print(f"\n  {fname} ({len(probs)} issues):")
            for issue_type, detail in probs:
                print(f"    [{issue_type}] {detail}")
        print()

    # -----------------------------------------------------------------------
    # 5. Overall summary
    # -----------------------------------------------------------------------
    docs_with_issues = len(doc_issues)
    quality_pct = (perfect_count / checked * 100) if checked > 0 else 0

    print("=" * 80)
    print("OVERALL SUMMARY")
    print("=" * 80)
    print(f"  Total knowledge docs checked:     {checked}")
    print(f"  Perfect docs (all checks pass):   {perfect_count}  ({perfect_count/checked*100:.1f}%)")
    print(f"  Docs with issues:                 {docs_with_issues}  ({docs_with_issues/checked*100:.1f}%)")
    print(f"  Total individual issues found:    {total_issues}")
    print(f"  Missing from knowledge:           {len(missing_from_knowledge)}")
    if orphan_knowledge:
        print(f"  Orphan knowledge (no original):   {len(orphan_knowledge)}")
    print(f"  Overall quality:                  {quality_pct:.1f}%")
    print()

    # Breakdown
    print("  Issue breakdown:")
    for issue_key, issue_label in issue_order:
        count = len(issues.get(issue_key, []))
        if count > 0:
            print(f"    {issue_label}: {count}")

    print()
    print("=" * 80)
    print("VERIFICATION COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    verify_all()
