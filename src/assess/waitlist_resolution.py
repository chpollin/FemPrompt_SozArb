#!/usr/bin/env python3
"""Stage 1b of the distillate check plan: deterministic resolution pass over the
waitlist (research-vault/waitlist.md) and the migrated cohort.

Machine-verifiable re-check of the stage-1 findings (generated/distilled/
_evidence_audit/stage1_report.json) against the committed fulltexts in
generated/markdown_clean/. It decides ONLY what a deterministic check can
decide:

  - F candidates that were matcher or docling artifacts (citation brackets,
    ligature codes, nested quotes, apostrophe pairing, punctuation tokens)
    are re-matched with an extended but still verbatim-contiguous matcher.
    A rescue requires the full quote text as one contiguous character
    sequence in the fulltext (case- and punctuation-insensitive at most).
    Two bounded exceptions follow standard citation practice: an editorial
    insertion in square brackets inside the quote is not a verbatim claim and
    is stripped before matching, and an ellipsis marker (...) splits the quote
    into segments that must each match verbatim, in source order, within a
    small gap (one passage). Unmarked elisions, cross-passage compositions,
    and altered quote ends stay unresolved by construction and human-gated.
  - D candidates resolve when every occurrence of the duplicated quote is
    verbatim in its own paper's fulltext and the full evidence entries that
    share it are not identical across categories of one paper (a shared short
    phrase, not a fabricated per-category structure).
  - G findings are never machine-resolved; the stage-2 G list blocks migration.
  - Distillates without an exact-filename fulltext get a content-based
    identity check: their extracted quotes are searched across all fulltexts.
    A unique fulltext containing all quotes resolves the identity; a fulltext
    already owned by another distillate marks the file as a duplicate.

Quote extraction v2 fixes the apostrophe-pairing artifact of stage 1:
a straight single quote only opens a span at a word boundary and only closes
one before whitespace/punctuation, so "GPT-2's" or "models'" no longer split
spans. v2 adds no new extraction patterns, so it finds equal or fewer spans
than stage 1, each more reliable.

Output: generated/distilled/_evidence_audit/stage1b_resolution.json (gitignored,
regenerable). The script changes no distillate and writes nothing else. The
migration itself is a separate reviewed step.

Run: python src/assess/waitlist_resolution.py
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DISTILLED = REPO / "generated" / "distilled"
STAGE1 = DISTILLED / "_stage1_json"
CLEAN = REPO / "generated" / "markdown_clean"
AUDIT = DISTILLED / "_evidence_audit"
VAULT = REPO / "research-vault"

MIN_QUOTE_LEN = 4
# Content-identity: all quotes must match and carry enough signal.
IDENTITY_MIN_QUOTES = 2
IDENTITY_MIN_SINGLE_LEN = 40

# Stage-2 G findings (advisory list, blocks migration until human stage 3).
G_BLOCKED = {
    ("Chiu_2024_What_are_artificial_intelligence_literacy_and", "Gender"),
    ("Weber_2023_Messung_von_AI_Literacy_–_Empirische_Evidenz_und", "Gender"),
    ("Tun_2025_Trust_in_artificial_intelligence–based_clinical", "Bias_Ungleichheit"),
    ("Xu_2023_Transparency_enhances_positive_perceptions_of", "Diversitaet"),
}

# docling ligature escape codes seen in markdown_clean.
LIGATURES = {
    "/uniFB00": "ff", "/uniFB01": "fi", "/uniFB02": "fl",
    "/uniFB03": "ffi", "/uniFB04": "ffl",
}


def norm(s: str) -> str:
    """Strict normalization, identical in spirit to stage 1 (evidence_audit.py)."""
    s = unicodedata.normalize("NFKC", s)
    for code, rep in LIGATURES.items():
        s = s.replace(code, rep)
    for ch in ("“", "”", '"'):
        s = s.replace(ch, '"')
    for ch in ("‘", "’", "ʼ", "`"):
        s = s.replace(ch, "'")
    s = s.replace("­", "")
    for ch in ("–", "—", "―", "‐", "‑", "‒"):
        s = s.replace(ch, "-")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def skeleton(s: str) -> str:
    """Case-folded alphanumeric skeleton. A match still requires the whole
    quote as one contiguous sequence; only casing and punctuation give way."""
    s = norm(s)
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9äöüß]+", "", s.lower())


CITE_BRACKET = re.compile(r"\[[\d,;\s\-–]{1,20}\]")
CITE_BRACKET_AY = re.compile(r"\[[A-Z][A-Za-z.\s]{0,40},?\s*\d{4}[a-z]?(?:\s*;[^\]]{0,80})?\]")
CITE_PAREN = re.compile(r"\((?:see\s+|cf\.\s+|e\.g\.,?\s+|vgl\.\s+)?[A-Z][^()]{0,80}\d{4}[a-z]?(?:[;,][^()]{0,80})?\)")


def strip_citations(s: str) -> str:
    s = CITE_BRACKET.sub(" ", s)
    s = CITE_BRACKET_AY.sub(" ", s)
    s = CITE_PAREN.sub(" ", s)
    return s


def extract_quotes_v2(text: str) -> list[str]:
    """Verbatim spans from one evidence value, apostrophe-aware.

    Doubles and typographic single pairs as in stage 1. Straight singles only
    delimit at word boundaries, so apostrophes inside or at the end of words
    (GPT-2's, models', don't) no longer produce artifact spans.
    """
    quotes: list[str] = []
    for m in re.finditer(r'[“"]([^“”"]{%d,}?)[”"]' % MIN_QUOTE_LEN, text):
        quotes.append(m.group(1).strip())
    for m in re.finditer(r"‘([^‘’]{%d,}?)’" % MIN_QUOTE_LEN, text):
        quotes.append(m.group(1).strip())

    opens, closes = [], []
    for i, c in enumerate(text):
        if c != "'":
            continue
        prev = text[i - 1] if i > 0 else " "
        nxt = text[i + 1] if i + 1 < len(text) else " "
        if (not prev.isalnum()) and (nxt.isalnum() or nxt in "\"'"):
            opens.append(i)
        elif prev.isalnum() or prev in ".!?\"')]":
            if not nxt.isalnum():
                closes.append(i)
    used_close = set()
    for a in opens:
        b = next((c for c in closes if c > a and c not in used_close), None)
        if b is None:
            continue
        # do not jump across another opening quote
        if any(a < o < b for o in opens):
            continue
        used_close.add(b)
        span = text[a + 1:b].strip()
        if len(span) >= MIN_QUOTE_LEN:
            quotes.append(span)

    seen, out = set(), []
    for q in quotes:
        if q and q not in seen:
            seen.add(q)
            out.append(q)
    return out


class Fulltext:
    def __init__(self, path: Path):
        self.path = path
        raw = path.read_text(encoding="utf-8", errors="replace")
        self.norm = norm(raw)
        self.skel = skeleton(raw)
        self.skel_nocite = skeleton(strip_citations(norm(raw)))


ELLIPSIS = re.compile(r"(?:\.\s?\.\s?\.|…|\[\.\.\.\]|\[…\])")
EDITORIAL = re.compile(r"\[[^\[\]\d][^\[\]]{0,40}\]")  # [Learning], [the AFST] as non-verbatim inserts
ELLIPSIS_MAX_GAP = 600  # skeleton chars, roughly one passage
ELLIPSIS_MIN_SEG = 12   # a shorter segment carries no anchor signal


def _contiguous(q: str, ft: Fulltext) -> str | None:
    nq = norm(q)
    if nq and nq in ft.norm:
        return "norm"
    sq = skeleton(q)
    if len(sq) >= MIN_QUOTE_LEN:
        if sq in ft.skel:
            return "skeleton"
        if sq in ft.skel_nocite:
            return "skeleton-nocite"
        sq2 = skeleton(strip_citations(nq))
        if len(sq2) >= MIN_QUOTE_LEN and (sq2 in ft.skel or sq2 in ft.skel_nocite):
            return "skeleton-cite-stripped"
    return None


def match_quote(q: str, ft: Fulltext) -> str | None:
    """Return the rescue tier that resolves the quote, or None."""
    tier = _contiguous(q, ft)
    if tier:
        return tier
    # Editorial square-bracket insertions are by convention not verbatim claims.
    q2 = EDITORIAL.sub(" ", q)
    if q2 != q:
        tier = _contiguous(q2, ft)
        if tier:
            return tier + "+editorial-bracket"
        q = q2
    # Marked ellipsis: every segment verbatim, in order, within one passage.
    if ELLIPSIS.search(q):
        segs = [s for s in (x.strip(" ,;") for x in ELLIPSIS.split(q))
                if len(skeleton(s)) >= ELLIPSIS_MIN_SEG]
        if len(segs) >= 2:
            pos = -1
            gaps = []
            for s in segs:
                sk = skeleton(strip_citations(norm(s)))
                j = ft.skel_nocite.find(sk, pos + 1)
                if j < 0:
                    return None
                if pos >= 0:
                    gaps.append(j - pos)
                pos = j + len(sk)
            if all(g <= ELLIPSIS_MAX_GAP for g in gaps):
                return f"ellipsis-segments(maxgap={max(gaps) if gaps else 0})"
    return None


def title_key(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def main() -> None:
    fulltexts: dict[str, Fulltext] = {}
    for f in sorted(CLEAN.glob("*.md")):
        fulltexts[f.stem] = Fulltext(f)

    papers: dict[str, dict] = {}
    for jf in sorted(STAGE1.glob("*.json")):
        try:
            papers[jf.stem] = json.loads(jf.read_text(encoding="utf-8", errors="replace"))
        except Exception as e:
            papers[jf.stem] = {"_json_error": str(e)}

    migrated = {p.stem for p in (VAULT / "10_distillates").glob("*.md")}

    # First pass: per-paper evidence classification against the assigned fulltext.
    results: dict[str, dict] = {}
    quote_index: dict[str, list[tuple[str, str, int, str]]] = {}  # skel -> [(paper, cat, idx, quote)]

    for stem, j in papers.items():
        r: dict = {"paper": stem, "was_migrated": stem in migrated}
        results[stem] = r
        if "_json_error" in j:
            r["verdict"] = "WAIT"
            r["reasons"] = ["stage1-json-error"]
            continue
        meta = j.get("metadata") or {}
        r["title"] = meta.get("title", "") or ""
        cats = j.get("categories") or {}
        r["flagged"] = [k for k, v in cats.items() if v]
        ev = j.get("category_evidence") or {}
        r["evidence"] = []
        ft = fulltexts.get(stem)
        r["fulltext"] = stem if ft else None
        r["identity"] = "exact-filename" if ft else "unresolved"
        for idx, (cat, val) in enumerate(ev.items(), start=1):
            quotes = extract_quotes_v2(val)
            entry = {"cat": cat, "idx": idx, "n_quotes": len(quotes), "quotes": []}
            for q in quotes:
                tier = match_quote(q, ft) if ft else None
                entry["quotes"].append({"q": q, "match": tier})
                quote_index.setdefault(skeleton(q), []).append((stem, cat, idx, q))
            entry["cls"] = ("P" if not quotes else
                            ("OK" if ft and all(x["match"] for x in entry["quotes"])
                             else ("F" if ft else "U")))
            r["evidence"].append(entry)

    # Identity pass for papers without an exact-filename fulltext.
    owned = {stem for stem in papers if stem in fulltexts}
    for stem, r in results.items():
        if r.get("fulltext") or "evidence" not in r:
            continue
        all_q = [x["q"] for e in r["evidence"] for x in e["quotes"]]
        candidates: dict[str, int] = {}
        for ftstem, ft in fulltexts.items():
            hits = sum(1 for q in all_q if match_quote(q, ft))
            if all_q and hits == len(all_q):
                candidates[ftstem] = hits
        strong = (len(all_q) >= IDENTITY_MIN_QUOTES or
                  (len(all_q) == 1 and len(all_q[0]) >= IDENTITY_MIN_SINGLE_LEN))
        if len(candidates) == 1 and strong:
            ftstem = next(iter(candidates))
            r["identity"] = "content-resolved:" + ftstem
            r["fulltext"] = ftstem
            if ftstem in owned:
                r["duplicate_of"] = ftstem
            ft = fulltexts[ftstem]
            for e in r["evidence"]:
                for x in e["quotes"]:
                    x["match"] = match_quote(x["q"], ft)
                e["cls"] = ("P" if not e["quotes"] else
                            ("OK" if all(x["match"] for x in e["quotes"]) else "F"))
        else:
            # bibliographic fallback: title equality with a fulltext heading
            tk = title_key(r.get("title", ""))
            heads = {}
            for ftstem, ft in fulltexts.items():
                m = re.search(r"^#{1,3}\s+(.{15,})$", ft.path.read_text(encoding="utf-8", errors="replace"), re.M)
                if m:
                    heads.setdefault(title_key(m.group(1)), []).append(ftstem)
            if tk and tk in heads and len(heads[tk]) == 1:
                ftstem = heads[tk][0]
                r["identity"] = "title-resolved:" + ftstem
                r["fulltext"] = ftstem
                if ftstem in owned:
                    r["duplicate_of"] = ftstem
                ft = fulltexts[ftstem]
                for e in r["evidence"]:
                    for x in e["quotes"]:
                        x["match"] = match_quote(x["q"], ft)
                    e["cls"] = ("P" if not e["quotes"] else
                                ("OK" if all(x["match"] for x in e["quotes"]) else "F"))

    # Duplicate-quote (D) assessment on the v2 extraction.
    dup_flags: dict[tuple[str, str, int], str] = {}
    for skel, occ in quote_index.items():
        if len(occ) < 2:
            continue
        papers_involved = {p for p, _, _, _ in occ}
        cats_involved = {(p, c) for p, c, _, _ in occ}
        if len(cats_involved) < 2:
            continue
        # within-paper cross-category: identical full evidence values are the
        # fabricated-structure candidate; anything else is a shared phrase.
        hard = False
        for p in papers_involved:
            cats_p = [c for pp, c, _, _ in occ if pp == p]
            if len(set(cats_p)) > 1:
                ev = (papers[p].get("category_evidence") or {})
                vals = [norm(ev.get(c, "")) for c in set(cats_p)]
                if len(set(vals)) == 1:
                    hard = True
        # every occurrence must resolve in its own fulltext
        unresolved_occ = []
        for p, c, i, q in occ:
            ftstem = results[p].get("fulltext")
            ft = fulltexts.get(ftstem) if ftstem else None
            if not ft or not match_quote(q, ft):
                unresolved_occ.append((p, c, i))
        for p, c, i, _ in occ:
            if hard:
                dup_flags[(p, c, i)] = "D-hard"
            elif (p, c, i) in [(a, b, k) for a, b, k in unresolved_occ]:
                dup_flags[(p, c, i)] = "D-unresolved"
            else:
                dup_flags[(p, c, i)] = "D-resolved"

    # Verdicts.
    for stem, r in results.items():
        if "evidence" not in r:
            continue
        reasons = []
        for cat in [c for (p, c) in G_BLOCKED if p == stem]:
            reasons.append(f"G:{cat}")
        if not r.get("fulltext"):
            reasons.append("U:kein-volltext")
        for e in r["evidence"]:
            key = None
            for x in e["quotes"]:
                k = (stem, e["cat"], e["idx"])
                if k in dup_flags:
                    key = dup_flags[k]
            if key == "D-hard":
                reasons.append(f"D-hard:{e['cat']}")
            if e["cls"] == "F":
                bad = [x["q"][:80] for x in e["quotes"] if not x["match"]]
                reasons.append(f"F:{e['cat']}#{e['idx']}:" + " | ".join(bad))
        if r.get("duplicate_of"):
            r["verdict"] = "DUPLICATE"
        elif reasons:
            r["verdict"] = "WAIT"
        else:
            r["verdict"] = "MIGRATE"
        r["reasons"] = reasons
        r["rescues"] = sorted({x["match"] for e in r["evidence"] for x in e["quotes"]
                               if x["match"] and x["match"] != "norm"})

    AUDIT.mkdir(parents=True, exist_ok=True)
    out = AUDIT / "stage1b_resolution.json"
    out.write_text(json.dumps({
        "note": "Stage 1b deterministic resolution pass, src/assess/waitlist_resolution.py. "
                "Rescues are contiguous verbatim matches under extended normalization; "
                "elisions and composed quotes stay unresolved by construction.",
        "results": results,
    }, ensure_ascii=False, indent=1), encoding="utf-8")

    # Console summary.
    from collections import Counter
    verd = Counter(r.get("verdict") for r in results.values())
    print("verdicts:", dict(verd))
    mig_now = [s for s, r in results.items() if r.get("verdict") == "MIGRATE"]
    print("MIGRATE and not yet in vault:", len([s for s in mig_now if s not in migrated]))
    print("in vault but NOT MIGRATE:", [s for s, r in results.items()
                                        if r["was_migrated"] and r.get("verdict") != "MIGRATE"])

    # Acceptance suite. Ground truth is the raw fulltext, checked by hand
    # against the extracted context (session 2026-07-18), not the advisory
    # stage-2 verdicts: EDPS, Lin, Moreau, Ruiz were called F-hart in stage 2
    # but their quotes sit verbatim in the fulltext (nested quotes, sentence-
    # case, dropped punctuation, citation brackets blocked the stage-1 match).
    ft_ok = lambda p, c, i: next((e for e in results[p]["evidence"]
                                  if e["cat"] == c and e["idx"] == i), None)
    expect_resolved = [
        ("Rodriguez_2024_Introducing_Generative_Artificial_Intelligence", "Bias_Ungleichheit", 6),
        ("Articulate_2025_How_to_Create_Inclusive_AI_Images_A_Guide_to", "Generative_KI", 2),
        ("Navigli_2023_Biases_in_large_language_models_Origins,", "Generative_KI", 2),
        ("Jarke_2025_Datafied_ageing_futures_Regimes_of_anticipation", "Feministisch", 6),
        ("European Data Protection Supervisor_2023_Explainable_Artificial_Intelligence", "Fairness", 4),
        ("Lin_2022_Artificial_Intelligence_in_a_Structurally_Unjust", "Fairness", 6),
        ("Moreau_2024_Failing_our_youngest_On_the_biases,_pitfalls,_and", "Fairness", 6),
        ("Ruiz_2024_AI_Literacy_A_Framework_to_Understand,_Evaluate,", "Bias_Ungleichheit", 5),
        ("Kawakami_2022_Improving_human-AI_partnerships_in_child_welfare", "AI_Literacies", 1),
    ]
    expect_open = [
        ("Ahmed_2024_Feminist_perspectives_on_AI_Ethical", "Soziale_Arbeit", 3),
        ("Xu_2023_Transparency_enhances_positive_perceptions_of", "KI_Sonstige", 2),
        ("He_2024_On_the_steerability_of_large_language_models", "Fairness", 6),
    ]
    for p, c, i in expect_resolved:
        e = ft_ok(p, c, i)
        status = e and e["cls"] in ("OK", "P")
        print(("PASS" if status else "FAIL"), "resolved-expected", p, c, i,
              "" if not e else e["cls"])
    for p, c, i in expect_open:
        e = ft_ok(p, c, i)
        status = e and e["cls"] == "F"
        print(("PASS" if status else "FAIL"), "open-expected", p, c, i,
              "" if not e else e["cls"])


if __name__ == "__main__":
    main()
