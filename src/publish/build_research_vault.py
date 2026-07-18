#!/usr/bin/env python3
"""Second migration wave for research-vault/10_distillates/ from the stage-1b
resolution pass (src/assess/waitlist_resolution.py, its report in
generated/distilled/_evidence_audit/stage1b_resolution.json).

What it does, in order:

1. De-migrates vault distillates whose stage-1b verdict is not MIGRATE.
   These are the no-fulltext documents of the first wave (their identity is
   not machine-resolvable against the committed sources, so the vault's own
   precondition rules them out) and the same-source doublet named in
   CURATION_DEMIGRATE.
2. Migrates every waitlisted distillate with verdict MIGRATE, minus the
   same-source doublets in CURATION_EXCLUDE (fulltext identity groups from
   the shingle-Jaccard scan, evidence recorded per entry).
3. Refreshes the frontmatter of every retained and new vault distillate with
   the stage-1b verification fields and the reference-record path, and
   recomputes audit (clean = every evidence entry carries a resolved verbatim
   quote; P-pending = paraphrase entries without anchor claim remain).
4. Writes one CSL-JSON reference record per vault distillate, enriched from
   corpus/zotero_export.json where a unique title match exists.
5. Writes research-vault/10_distillates/INDEX.md as the layer register.

The curation constants below are decisions this script executes; each carries
its machine evidence so the step stays auditable and re-runnable.

Run: python src/publish/build_research_vault.py
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DISTILLED = REPO / "generated" / "distilled"
STAGE1 = DISTILLED / "_stage1_json"
RESOLUTION = DISTILLED / "_evidence_audit" / "stage1b_resolution.json"
VAULT = REPO / "research-vault"
DIST = VAULT / "10_distillates"
REFS = VAULT / "references"
ZOTERO = REPO / "corpus" / "zotero_export.json"

TODAY = "2026-07-18"

# Same-source doublets: keep exactly one distillate per fulltext identity
# group (shingle-Jaccard J over the committed markdown_clean fulltexts,
# scan of 2026-07-18). The kept twin is named in the evidence.
CURATION_EXCLUDE = {
    "Unknown_Artificial_Intelligence_in_Social_Work_An_EPIC":
        "Quellendublette von Baker_2025_Artificial_intelligence_in_social_work_An_EPIC "
        "(Volltext-Identität J=0.997, Zotero-DOI 10.1080/0312407X.2025.2488345)",
    "Chisca_2024_Prompting_techniques_for_reducing_social_bias_in":
        "Fehlattribution: Volltext-Heading nennt Kamruzzaman und Kim als Autoren, "
        "Version desselben Werks wie das migrierte "
        "Kamruzzaman_2024_Prompting_techniques_for_reducing_social_bias_in "
        "(J=0.534, identischer Titel und Autoren im Heading, Zotero-Mehrheit Kamruzzaman/Kim)",
}
CURATION_DEMIGRATE = {
    "Goldkind_2024_The_end_of_the_world_as_we_know_it_ChatGPT_and":
        "Quellendublette von Goldkind_2023_The_End_of_the_World_as_We_Know_It_ChatGPT_and "
        "(Volltext-Identität J=0.990, gleicher DOI 10.1093/sw/swad044 in corpus/zotero_export.json)",
}

# Filename slug diverges from the source identity; the title field carries the
# machine-verified identity (fulltext heading equals the stage-1 title).
IDENTITY_NOTES = {
    "Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large":
        "Dateiname aus früher RIS-Attribution; Quelle ist laut Volltext-Heading und "
        "Metadaten-Titel 'Evaluating Gender Bias in Large Language Models via "
        "Chain-of-Thought Prompting' (Kaneko et al.)",
}

CSL_TYPE = {
    "journalArticle": "article-journal", "report": "report", "preprint": "article",
    "bookSection": "chapter", "conferencePaper": "paper-conference",
    "webpage": "webpage", "book": "book", "thesis": "thesis",
    "blogPost": "post-weblog", "document": "document", "magazineArticle": "article-magazine",
}


def title_key(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def split_author(name: str) -> dict:
    name = name.strip()
    if "," in name:
        fam, giv = name.split(",", 1)
        return {"family": fam.strip(), "given": giv.strip()}
    parts = name.rsplit(" ", 1)
    if len(parts) == 2:
        return {"family": parts[1], "given": parts[0]}
    return {"family": name, "given": ""}


def zotero_index() -> dict[str, list[dict]]:
    z = json.loads(ZOTERO.read_text(encoding="utf-8"))
    idx: dict[str, list[dict]] = {}
    for it in z:
        tk = title_key(it.get("title", ""))
        if tk:
            idx.setdefault(tk, []).append(it)
    return idx


def zotero_match(title: str, year, zidx) -> dict | None:
    tk = title_key(title)
    cands = zidx.get(tk, [])
    if not cands:
        return None
    dois = {c.get("DOI") for c in cands if c.get("DOI")}
    if len(dois) > 1:
        return None  # ambiguous bibliographic identity, leave to the operator
    def score(c):
        s = 0
        if c.get("creators"): s += 2
        if c.get("DOI"): s += 2
        if c.get("date", "").startswith(str(year)): s += 1
        if c.get("url"): s += 1
        return s
    return max(cands, key=score)


def build_reference(stem: str, meta: dict, audit: str, verification: str, zidx) -> dict:
    title = meta.get("title", "") or ""
    year = meta.get("year")
    ref: dict = {
        "id": stem,
        "type": CSL_TYPE.get(meta.get("type", ""), meta.get("type", "document") or "document"),
        "title": title,
    }
    z = zotero_match(title, year, zidx)
    if z and z.get("creators"):
        ref["author"] = [
            {"family": c.get("lastName", ""), "given": c.get("firstName", "")}
            for c in z["creators"] if c.get("creatorType") in ("author", "editor", None)
        ]
    else:
        authors = meta.get("authors") or []
        ref["author"] = [split_author(a) for a in authors if a and a.lower() != "nicht angegeben"]
    if year:
        ref["issued"] = {"date-parts": [[year]]}
    if meta.get("language"):
        ref["language"] = meta["language"]
    note = (f"Reference record for migrated distillate. Source distillate "
            f"generated/distilled/{stem}.md. audit={audit}. {verification}")
    if z:
        for src, dst in (("DOI", "DOI"), ("url", "URL"), ("publicationTitle", "container-title"),
                         ("publisher", "publisher")):
            if z.get(src):
                ref[dst] = z[src]
        note += f" Zotero key: {z.get('key')}."
    ref["note"] = note
    return ref


def read_body(stem: str) -> str:
    txt = (DISTILLED / f"{stem}.md").read_text(encoding="utf-8")
    m = re.match(r"^---\n.*?\n---\n+", txt, re.S)
    return txt[m.end():] if m else txt


def read_front(stem: str) -> dict:
    j = json.loads((STAGE1 / f"{stem}.json").read_text(encoding="utf-8", errors="replace"))
    return j.get("metadata") or {}


def yaml_str(s: str) -> str:
    return '"' + str(s).replace('\\', '\\\\').replace('"', '\\"') + '"'


def frontmatter(stem: str, meta: dict, migrated_date: str, audit: str,
                stage1_classes: str, stage1b_note: str) -> str:
    authors = meta.get("authors") or []
    lines = ["---", "layer: distillate", f"title: {yaml_str(meta.get('title',''))}",
             "authors: [" + ", ".join(yaml_str(a) for a in authors) + "]",
             f"year: {meta.get('year')}", f"type: {meta.get('type','')}",
             f"language: {meta.get('language','')}",
             f"source_distillate: {yaml_str('generated/distilled/' + stem + '.md')}",
             f"migrated: {migrated_date}", f"audit: {audit}"]
    if stage1_classes:
        lines.append(f"audit-stage1: {yaml_str(stage1_classes)}")
    lines.append(f"audit-stage1b: {yaml_str(stage1b_note)}")
    if stem in IDENTITY_NOTES:
        lines.append(f"identity-note: {yaml_str(IDENTITY_NOTES[stem])}")
    lines.append(f"reference: {yaml_str('research-vault/references/' + stem + '.json')}")
    lines += ["status: migrated", "references-to: 00_representation/", "---", ""]
    return "\n".join(lines)


def main() -> None:
    res = json.loads(RESOLUTION.read_text(encoding="utf-8"))["results"]
    zidx = zotero_index()

    # Stage-1 finding classes per stem, parsed from the committed waitlist of
    # 2026-07-17 (the pre-resolution state the verification note refers to).
    stage1_classes: dict[str, str] = {}
    wl = (VAULT / "waitlist.md")
    if wl.exists():
        current = None
        for line in wl.read_text(encoding="utf-8").splitlines():
            h = re.match(r"^### (.+)$", line)
            if h:
                current = h.group(1).strip()
            m = re.match(r"^- `generated/distilled/(.+)\.md`", line)
            if m and current:
                stage1_classes[m.group(1)] = current

    in_vault = {p.stem for p in DIST.glob("*.md")} - {"INDEX"}
    removed, added, refreshed = [], [], []

    # 1. De-migrate.
    for stem in sorted(in_vault):
        r = res.get(stem)
        why = None
        if stem in CURATION_DEMIGRATE:
            why = CURATION_DEMIGRATE[stem]
        elif r is None or r.get("verdict") != "MIGRATE":
            why = "; ".join(r.get("reasons", ["kein stage1b-Ergebnis"])) if r else "kein stage1b-Ergebnis"
        if why:
            (DIST / f"{stem}.md").unlink()
            ref = REFS / f"{stem}.json"
            if ref.exists():
                ref.unlink()
            removed.append((stem, why))
    in_vault = {p.stem for p in DIST.glob("*.md")} - {"INDEX"}

    # 2 + 3. Migrate new, refresh all.
    for stem, r in sorted(res.items()):
        if r.get("verdict") != "MIGRATE" or stem in CURATION_EXCLUDE or stem in CURATION_DEMIGRATE:
            continue
        meta = read_front(stem)
        has_p = any(e["cls"] == "P" for e in r["evidence"])
        audit = "P-pending" if has_p else "clean"
        rescues = sorted({x["match"].split("(")[0] for e in r["evidence"]
                          for x in e["quotes"] if x["match"] and x["match"] != "norm"})
        was_new = stem not in in_vault
        cls = stage1_classes.get(stem, "")
        if was_new and cls:
            note = (f"aufgelöst {TODAY}, deterministisch (src/assess/waitlist_resolution.py): "
                    f"alle Zitat-Ansprüche kontiguierlich im committeten Volltext aufgelöst"
                    + (f"; Rescue-Tiers: {', '.join(rescues)}" if rescues else ""))
        else:
            note = (f"bestätigt {TODAY}, deterministisch (src/assess/waitlist_resolution.py)"
                    + (f"; Rescue-Tiers: {', '.join(rescues)}" if rescues else ""))
        migrated_date = TODAY if was_new else "2026-07-17"
        fm = frontmatter(stem, meta, migrated_date, audit, cls if was_new else "", note)
        (DIST / f"{stem}.md").write_text(fm + read_body(stem), encoding="utf-8")
        verification = f"Stage-1b {'resolved' if was_new and cls else 'confirmed'} {TODAY}."
        ref = build_reference(stem, meta, audit, verification, zidx)
        (REFS / f"{stem}.json").write_text(json.dumps(ref, ensure_ascii=False, indent=2),
                                           encoding="utf-8")
        (added if was_new else refreshed).append(stem)

    # 5. Layer register.
    rows = []
    for p in sorted(DIST.glob("*.md"), key=lambda x: x.stem.lower()):
        if p.stem == "INDEX":
            continue
        fmtxt = p.read_text(encoding="utf-8")
        title = re.search(r'^title: "(.*)"', fmtxt, re.M)
        audit = re.search(r"^audit: (.+)$", fmtxt, re.M)
        mig = re.search(r"^migrated: (.+)$", fmtxt, re.M)
        rows.append((p.stem, title.group(1) if title else "", audit.group(1) if audit else "",
                     mig.group(1) if mig else ""))
    lines = ["---", "layer: distillate-index", 'title: "Register der Distillate"',
             f"updated: {TODAY}", "---", "", "# Register der Distillate", "",
             "Ein Distillat je Quelle, Belegkette im Frontmatter (source_distillate, "
             "audit, audit-stage1b, reference). `audit: clean` heißt, jeder Evidenz-Eintrag "
             "trägt ein im committeten Volltext aufgelöstes Wörtlichzitat; `P-pending` heißt, "
             "Paraphrase-Einträge ohne Ankeranspruch stehen noch zur menschlichen Deckungsprüfung.",
             "", "| Distillat | Titel | audit | migriert |", "|---|---|---|---|"]
    for stem, title, audit, mig in rows:
        lines.append(f"| [[{stem}]] | {title[:90]} | {audit} | {mig} |")
    (DIST / "INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"removed={len(removed)} added={len(added)} refreshed={len(refreshed)} "
          f"now_in_vault={len(rows)}")
    for s, why in removed:
        print("  DE-MIGRATED:", s, "|", why[:100])
    for s in added:
        print("  ADDED:", s)


if __name__ == "__main__":
    main()
