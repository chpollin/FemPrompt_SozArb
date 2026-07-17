#!/usr/bin/env python3
"""Stage 1 of the distillate check plan (knowledge/distillate-check-plan.md).

Deterministic pre-screen of the category evidence in generated/distilled/ against
the fulltext in generated/markdown_clean/. Reads the authoritative category
assignment from generated/distilled/_stage1_json/ (category_evidence keys are the
flagged categories, in the same order as the ### Evidenz N entries in the markdown).

Per evidence entry it emits:
  - quote_present (splits class P: paraphrase-only)
  - anchor_match  (splits class F: quote not resolvable in the paper fulltext)
  - quote_hash    (feeds class D: identical quote text across categories/papers)

It sets no final findings. It writes a machine-readable report plus a human
summary. It changes no distillate. Class D and G verdicts and the P-coverage
judgement are the adversarial Stage 2, done by the reviewing LLM, not here.

Run: python src/assess/evidence_audit.py
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DISTILLED = REPO / "generated" / "distilled"
STAGE1 = DISTILLED / "_stage1_json"
CLEAN = REPO / "generated" / "markdown_clean"
OUT = DISTILLED / "_evidence_audit"

# Quote delimiters that mark a verbatim span in the evidence prose. The corpus
# uses straight single quotes almost exclusively, a few straight doubles, and
# occasional typographic pairs.
DOUBLE_OPEN = "“"
DOUBLE_CLOSE = "”"
SINGLE_OPEN = "‘"
SINGLE_CLOSE = "’"

MIN_QUOTE_LEN = 4  # a span shorter than this is noise, not a checkable anchor


def norm(s: str) -> str:
    """Normalize for character-exact substring matching per plan section 3.2:
    unify quote glyphs and apostrophes, collapse whitespace and line breaks,
    fold to a comparable form. Case is preserved (anchors are case-exact)."""
    s = unicodedata.normalize("NFKC", s)
    for ch in (DOUBLE_OPEN, DOUBLE_CLOSE, '"'):
        s = s.replace(ch, '"')
    for ch in (SINGLE_OPEN, SINGLE_CLOSE, "ʼ", "`"):
        s = s.replace(ch, "'")
    s = s.replace("­", "")  # soft hyphen
    for ch in ("–", "—", "―", "‐", "‑", "‒"):  # dash variants to plain hyphen
        s = s.replace(ch, "-")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def norm_loose(s: str) -> str:
    """A second, looser normalization for the anchor match: join docling
    line-break hyphenation and drop hyphens and stray edge punctuation, so a
    genuine verbatim span is not counted F over a typographic artifact. The
    strict norm() result is what the report records; this only rescues a match."""
    s = norm(s)
    s = re.sub(r"-\s*", "", s)
    return s.strip(" ,.;:")


def extract_quotes(text: str) -> tuple[list[str], bool]:
    """Extract verbatim spans from one evidence value.

    Returns (quotes, ambiguous). Doubles are paired unambiguously. Single quotes
    are paired left-to-right, which reproduces how the evidence was written; an
    odd count of single quotes (an apostrophe caught in the pairing) sets the
    ambiguous flag so Stage 2 can look at it.
    """
    quotes: list[str] = []
    ambiguous = False

    # Typographic and straight double quotes first, they are unambiguous.
    for m in re.finditer(r'[“"]([^“”"]{%d,}?)[”"]' % MIN_QUOTE_LEN, text):
        quotes.append(m.group(1).strip())

    # Typographic single-quote pairs, unambiguous.
    for m in re.finditer(r"‘([^‘’]{%d,}?)’" % MIN_QUOTE_LEN, text):
        quotes.append(m.group(1).strip())

    # Straight single quotes: pair left-to-right.
    positions = [i for i, c in enumerate(text) if c == "'"]
    if len(positions) % 2 == 1:
        ambiguous = True
    for a, b in zip(positions[0::2], positions[1::2]):
        span = text[a + 1 : b].strip()
        if len(span) >= MIN_QUOTE_LEN:
            quotes.append(span)

    # Deduplicate while preserving order.
    seen = set()
    out = []
    for q in quotes:
        if q and q not in seen:
            seen.add(q)
            out.append(q)
    return out, ambiguous


def clean_heading_title(path: Path) -> str:
    txt = path.read_text(encoding="utf-8", errors="replace")
    for m in re.finditer(r"^#{1,3}\s+(.+)$", txt, re.M):
        h = m.group(1).strip()
        if len(h) > 15 and "JOURNAL" not in h.upper():
            return h
    return ""


def title_key(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def build_clean_index() -> tuple[dict[str, Path], dict[str, list[Path]]]:
    by_base: dict[str, Path] = {}
    by_title: dict[str, list[Path]] = {}
    for f in sorted(CLEAN.glob("*.md")):
        by_base[f.name] = f
        tk = title_key(clean_heading_title(f))
        if tk:
            by_title.setdefault(tk, []).append(f)
    return by_base, by_title


def resolve_fulltext(stem: str, meta_title: str, by_base, by_title) -> tuple[Path | None, str]:
    """Resolve a distillate to its markdown_clean fulltext.

    Strategy cascade: exact filename, then normalized-title equality, then
    title containment. Returns (path, strategy) or (None, reason)."""
    cand = by_base.get(stem + ".md")
    if cand:
        return cand, "exact-filename"
    tk = title_key(meta_title)
    if not tk or meta_title.strip().lower() in ("nicht angegeben", "unknown", ""):
        return None, "no-usable-title"
    if tk in by_title and len(by_title[tk]) == 1:
        return by_title[tk][0], "title-exact"
    if tk in by_title:
        return by_title[tk][0], "title-exact-ambiguous"
    hits = [p for k, paths in by_title.items() for p in paths if (tk in k or k in tk)]
    if len(hits) == 1:
        return hits[0], "title-contains"
    if hits:
        return hits[0], "title-contains-ambiguous"
    return None, "unresolved"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    by_base, by_title = build_clean_index()

    fulltext_cache: dict[Path, str] = {}

    loose_cache: dict[Path, str] = {}

    def norm_fulltext(path: Path) -> str:
        if path not in fulltext_cache:
            fulltext_cache[path] = norm(path.read_text(encoding="utf-8"))
        return fulltext_cache[path]

    def loose_fulltext(path: Path) -> str:
        if path not in loose_cache:
            loose_cache[path] = norm_loose(path.read_text(encoding="utf-8"))
        return loose_cache[path]

    rows: list[dict] = []
    hash_index: dict[str, list[tuple[str, str, int]]] = {}
    file_summ: list[dict] = []

    for jf in sorted(STAGE1.glob("*.json")):
        stem = jf.stem
        try:
            j = json.loads(jf.read_text(encoding="utf-8", errors="replace"))
        except Exception as e:  # malformed JSON is itself a finding
            file_summ.append({"paper": stem, "status": "json-error", "detail": str(e)})
            continue

        meta_title = (j.get("metadata") or {}).get("title", "") or ""
        cats = j.get("categories") or {}
        flagged = [k for k, v in cats.items() if v]
        cat_ev = j.get("category_evidence") or {}

        ftpath, strategy = resolve_fulltext(stem, meta_title, by_base, by_title)
        fulltext = norm_fulltext(ftpath) if ftpath else None
        fulltext_loose = loose_fulltext(ftpath) if ftpath else None

        # Entries with an evidence value but not among the flagged categories are
        # a finding per plan section 2 (evidence for a category not flagged).
        for cat in cat_ev:
            if cat not in flagged:
                rows.append({
                    "paper": stem, "category": cat, "evidence_index": "",
                    "flagged": False, "quote_present": "", "anchor_match": "",
                    "quote": "", "quote_hash": "", "fulltext_strategy": strategy,
                    "note": "evidence-under-unflagged-category",
                })

        for idx, (cat, val) in enumerate(cat_ev.items(), start=1):
            quotes, ambiguous = extract_quotes(val)
            if not quotes:
                rows.append({
                    "paper": stem, "category": cat, "evidence_index": idx,
                    "flagged": cat in flagged,
                    "quote_present": False, "anchor_match": "",
                    "quote": "", "quote_hash": "",
                    "fulltext_strategy": strategy,
                    "note": "P:paraphrase-only" + ("; ambiguous-single-quotes" if ambiguous else ""),
                })
                continue

            for q in quotes:
                nq = norm(q)
                h = hashlib.sha1(nq.encode("utf-8")).hexdigest()[:12]
                if fulltext is None:
                    match = None
                    note = "unresolved-fulltext:" + strategy
                elif nq in fulltext:
                    match = True
                    note = ""
                elif norm_loose(q) in fulltext_loose:
                    match = True
                    note = "match-loose:typographic-artifact"
                else:
                    match = False
                    note = "F-candidate:quote-not-in-fulltext"
                if ambiguous:
                    note = (note + "; ambiguous-single-quotes").strip("; ")
                hash_index.setdefault(h, []).append((stem, cat, idx))
                rows.append({
                    "paper": stem, "category": cat, "evidence_index": idx,
                    "flagged": cat in flagged,
                    "quote_present": True,
                    "anchor_match": ("" if match is None else match),
                    "quote": q, "quote_hash": h,
                    "fulltext_strategy": strategy,
                    "note": note,
                })

        file_summ.append({
            "paper": stem, "status": "ok",
            "flagged_categories": flagged,
            "n_evidence": len(cat_ev),
            "fulltext": ftpath.name if ftpath else None,
            "fulltext_strategy": strategy,
        })

    # Class D: same normalized quote under more than one distinct category (any paper).
    dup_hashes = {}
    for h, occ in hash_index.items():
        distinct_cats = {(p, c) for p, c, _ in occ}
        cats_only = {c for _, c, _ in occ}
        # cross-category within or across papers, and cross-paper duplication
        if len(occ) > 1 and (len(cats_only) > 1 or len({p for p, _, _ in occ}) > 1):
            dup_hashes[h] = occ
    for r in rows:
        if r.get("quote_hash") in dup_hashes:
            r["note"] = (r["note"] + "; D-candidate:duplicate-quote").strip("; ")

    # Write machine-readable CSV and JSON.
    fields = ["paper", "category", "evidence_index", "flagged", "quote_present",
              "anchor_match", "quote_hash", "fulltext_strategy", "note", "quote"]
    with (OUT / "stage1_report.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in fields})

    (OUT / "stage1_report.json").write_text(
        json.dumps({"rows": rows, "files": file_summ,
                    "duplicate_hashes": {h: occ for h, occ in dup_hashes.items()}},
                   ensure_ascii=False, indent=2), encoding="utf-8")

    # Counts.
    n_entries = sum(1 for r in rows if r.get("evidence_index") != "")
    p_only = [r for r in rows if r.get("quote_present") is False and r.get("evidence_index") != ""]
    f_cand = [r for r in rows if r.get("anchor_match") is False]
    unresolved = [r for r in rows if isinstance(r.get("note"), str) and r["note"].startswith("unresolved-fulltext")]
    d_cand = [r for r in rows if "D-candidate" in str(r.get("note", ""))]
    unflagged = [r for r in rows if r.get("note") == "evidence-under-unflagged-category"]
    ok = [r for r in rows if r.get("anchor_match") is True]

    lines = []
    lines.append("# Stage 1 deterministic pre-screen, evidence audit")
    lines.append("")
    lines.append("Ausgabe des Prüfscripts src/assess/evidence_audit.py nach knowledge/distillate-check-plan.md, Stufe 1. Kandidaten, keine endgültigen Befunde.")
    lines.append("")
    lines.append("## Zählung")
    lines.append("")
    lines.append(f"- Distillate mit category_evidence gelesen: {len(file_summ)}")
    lines.append(f"- Evidenz-Einträge geprüft: {n_entries}")
    lines.append(f"- OK (Zitat im Volltext aufgelöst): {len(ok)} Zitat-Treffer")
    lines.append(f"- P (Paraphrase-only, kein Wörtlichzitat): {len(p_only)} Einträge")
    lines.append(f"- F-Kandidaten (Zitat nicht im Volltext auflösbar): {len(f_cand)} Zitate")
    lines.append(f"- D-Kandidaten (Zitat über Kategorien/Papers dupliziert): {len(d_cand)} Zeilen")
    lines.append(f"- Zitate ohne auflösbaren Volltext (Zuordnung offen, nicht F): {len(unresolved)}")
    lines.append(f"- Evidenz unter nicht geflaggter Kategorie: {len(unflagged)}")
    lines.append("")
    lines.append("## F-Kandidaten (Zitat als solches ausgewiesen, im Volltext nicht gefunden)")
    lines.append("")
    for r in f_cand[:200]:
        lines.append(f"- {r['paper']} / {r['category']} / Evidenz {r['evidence_index']}: \"{r['quote'][:120]}\"")
    lines.append("")
    lines.append("## Distillate ohne auflösbaren Volltext (Anker-Prüfung nicht möglich)")
    lines.append("")
    seen_files = sorted({r["paper"] for r in unresolved})
    for p in seen_files:
        f = next((x for x in file_summ if x["paper"] == p), {})
        lines.append(f"- {p}  (strategy: {f.get('fulltext_strategy')})")
    (OUT / "stage1_summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"entries={n_entries} P={len(p_only)} F={len(f_cand)} D={len(d_cand)} "
          f"unresolved={len(unresolved)} unflagged={len(unflagged)} OK_quotes={len(ok)}")


if __name__ == "__main__":
    main()
