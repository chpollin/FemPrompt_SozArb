#!/usr/bin/env python3
"""Build the round-1 retrospective PRISMA-trAIce FlowModel from benchmark/data/ (plan R4).

Supersedes the hand-drafted, agent-recounted docs/data/flow_model.json: every count
here is computed by this committed script from the raw CSVs, not recounted by hand.
The handful of values not present under benchmark/data/ (the acquisition loss chain,
the served-text split, the RIS-corroborated provenance count, the model snapshot) are
carried as constants sourced to knowledge/verification.md, their canonical home, and
flagged source kind "external".

Self-verifying: the script asserts the canonical benchmark invariants before it writes
(confusion matrix 100/34/108/49, Cohen kappa 0.0561, the marginal closures
134 + 8 = 142 and 100 + 34 = 134, and the 292-vs-291 resolution). On any mismatch it
prints the failures and exits 1 without writing. Canonical numbers and their
interpretation constraints live in knowledge/verification.md.

Run:
  python build_flow_model.py          # verify, then write docs/data/flow_model.json
  python build_flow_model.py --check   # verify only, write nothing (CI / pre-commit)
"""
import csv, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, "..", "data"))
OUT = os.path.normpath(os.path.join(HERE, "..", "..", "docs", "data", "flow_model.json"))

# canonical invariants (knowledge/verification.md); the script refuses to write if these move
EXPECT = {
    "matrix": (100, 34, 108, 49),   # human x AI: II, IE, EI, EE
    "kappa": 0.0561,
    "paired": 291,
    "human_rows": 303, "human_incl": 142, "human_excl": 161,
    "llm_rows": 326, "llm_incl": 232, "llm_excl": 94,
    "has_ha_yes": 292, "phantom_key": "2YS85B49",
}
CONTROLLED_REASONS = ["Duplicate", "Not relevant topic", "Wrong publication type",
                      "No full text", "Language", "Other"]


def norm_dec(v):
    v = (v or "").strip().lower()
    if v in ("include", "included", "yes", "1"):
        return "Include"
    if v in ("exclude", "excluded", "no", "0"):
        return "Exclude"
    return ""


def load(fname):
    with open(os.path.join(DATA, fname), encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def keyed(rows):
    d = {}
    for r in rows:
        k = (r.get("Zotero_Key") or "").strip()
        if k:
            d[k] = r
    return d


def is_yes(v):
    return (v or "").strip().lower() in ("yes", "ja", "true", "1")


def cohen_kappa(pairs):
    n = len(pairs)
    if not n:
        return 0.0
    po = sum(1 for a, b in pairs if a == b) / n
    labels = {x for p in pairs for x in p}
    pe = sum((sum(1 for a, _ in pairs if a == l) / n) *
             (sum(1 for _, b in pairs if b == l) / n) for l in labels)
    return 1.0 if pe == 1 else (po - pe) / (1 - pe)


def confusion(pairs):
    c = {"II": 0, "IE": 0, "EI": 0, "EE": 0}
    for h, l in pairs:
        c[("I" if h == "Include" else "E") + ("I" if l == "Include" else "E")] += 1
    return c


def scripted(rule):
    return {"kind": "scripted", "by": "benchmark/scripts/build_flow_model.py", "rule": rule}


def external(rule):
    return {"kind": "external", "source": "knowledge/verification.md", "rule": rule}


def build():
    human = keyed(load("human_assessment.csv"))
    llm = keyed(load("llm_assessment_10k.csv"))
    papers = keyed(load("papers_full.csv"))

    hdec = {k: norm_dec(r.get("Decision")) for k, r in human.items()}
    ldec = {k: norm_dec(r.get("Decision")) for k, r in llm.items()}

    # identification
    n_identified = len(papers)
    source_tool = {}
    for r in human.values():
        t = (r.get("Source_Tool") or "").strip() or "(empty)"
        source_tool[t] = source_tool.get(t, 0) + 1
    flagged_duplicate = sum(1 for r in papers.values() if is_yes(r.get("Is_Duplicate")))

    # human screening
    human_incl = sum(1 for d in hdec.values() if d == "Include")
    human_excl = sum(1 for d in hdec.values() if d == "Exclude")
    reasons = {}
    for r in human.values():
        if norm_dec(r.get("Decision")) != "Exclude":
            continue
        reason = (r.get("Exclusion_Reason") or "").strip()
        key = reason if reason else "(empty)"
        reasons[key] = reasons.get(key, 0) + 1
    has_ha_yes = sum(1 for r in papers.values() if is_yes(r.get("Has_HA")))
    has_ha_no = sum(1 for r in papers.values() if not is_yes(r.get("Has_HA")))

    # AI screening
    llm_incl = sum(1 for d in ldec.values() if d == "Include")
    llm_excl = sum(1 for d in ldec.values() if d == "Exclude")

    # paired, the authoritative re-pairing by Zotero_Key
    both = sorted(set(human) & set(llm))
    pairs = [(hdec[k], ldec[k]) for k in both if hdec[k] and ldec[k]]
    c = confusion(pairs)
    matrix = (c["II"], c["IE"], c["EI"], c["EE"])
    k = cohen_kappa(pairs)
    human_only = len(set(human) - set(llm))
    llm_only = len(set(llm) - set(human))
    phantom = sorted({key for key, r in papers.items() if is_yes(r.get("Has_HA"))} - set(human))

    model = {
        "identification": {
            "records_identified_total": {"value": n_identified,
                "source": scripted("rows of papers_full.csv keyed by Zotero_Key")},
            "claimed_source_tool_distribution": {
                "values": source_tool,
                "scope": "Source_Tool is carried only by the human assessment track and is not auditable; the column predates the repository record (knowledge/verification.md, acquisition).",
                "source": scripted("Source_Tool column of human_assessment.csv, value counts")},
            "corroborated_provenance_records": {"value": 34,
                "breakdown": {"Claude": 15, "Gemini": 3, "OpenAI": 6, "Perplexity": 10},
                "source": external("restored RIS files mapped via corpus/source_tool_mapping.json; not under benchmark/data/")},
            "records_flagged_duplicate": {"value": flagged_duplicate,
                "source": scripted("Is_Duplicate = Yes in papers_full.csv")},
            "duplicates_removed_before_screening": {"value": 0,
                "note": "no identification-phase removal step exists; deduplication happened inside human screening as Duplicate exclusions. The flow is recorded as it happened.",
                "source": scripted("no removal step in the data; all identified records enter the screening files")},
            "non_auditable": "Query dates per provider, provider-side model versions, the executed deep-research prompt instantiations, and the merge/cleaning step are not reconstructable from the repository (knowledge/verification.md)."
        },
        "screening": {
            "human_lane": {
                "binding": True,
                "records_screened": {"value": len(human),
                    "source": scripted("rows of human_assessment.csv keyed by Zotero_Key")},
                "included": {"value": human_incl, "source": scripted("Decision = Include in human_assessment.csv")},
                "excluded": {"value": human_excl, "source": scripted("Decision = Exclude in human_assessment.csv")},
                "exclusion_reasons": {
                    "values": reasons,
                    "vocabulary_note": "values outside benchmark/config/categories.yaml (e.g. Other) and empty cells are a documented hygiene finding (knowledge/verification.md).",
                    "source": scripted("Exclusion_Reason column over Exclude rows in human_assessment.csv, value counts")},
                "corpus_papers_without_human_decision": {"value": has_ha_no,
                    "source": scripted("Has_HA != Yes in papers_full.csv")},
                "corpus_papers_flagged_human_assessed": {"value": has_ha_yes,
                    "source": scripted("Has_HA = Yes in papers_full.csv")},
                "human_records_not_in_ai_corpus": {"value": human_only,
                    "source": scripted("Zotero_Keys in human_assessment.csv absent from llm_assessment_10k.csv")},
                "per_record_reviewer_identity": "absent; the CSV has no reviewer column. The track is one consolidated annotation; no inter-human reliability statistic exists (knowledge/verification.md)."
            },
            "ai_lane": {
                "binding": False,
                "role": "advisory sibling assessment, stored separately and never merged destructively",
                "model": {"value": "claude-haiku-4-5-20251001", "max_tokens": 1024,
                    "source": external("model snapshot pinned in benchmark/scripts/run_llm_assessment.py; temperature and top-p unrecorded API defaults")},
                "input": "title plus abstract per paper",
                "records_assessed": {"value": len(llm),
                    "source": scripted("rows of llm_assessment_10k.csv keyed by Zotero_Key")},
                "advisory_include": {"value": llm_incl, "source": scripted("Decision = Include in llm_assessment_10k.csv")},
                "advisory_exclude": {"value": llm_excl, "source": scripted("Decision = Exclude in llm_assessment_10k.csv")},
                "ai_records_not_in_human_track": {"value": llm_only,
                    "source": scripted("Zotero_Keys in llm_assessment_10k.csv absent from human_assessment.csv")}
            },
            "paired": {
                "records_with_both_decisions": {"value": len(pairs),
                    "source": scripted("intersection of human and AI Zotero_Keys with a decision on both sides")},
                "confusion_matrix_human_x_ai": {
                    "both_include": {"value": c["II"], "source": scripted("re-paired by Zotero_Key: human Include, AI Include")},
                    "human_include_ai_exclude": {"value": c["IE"], "source": scripted("re-paired by Zotero_Key: human Include, AI Exclude")},
                    "human_exclude_ai_include": {"value": c["EI"], "source": scripted("re-paired by Zotero_Key: human Exclude, AI Include")},
                    "both_exclude": {"value": c["EE"], "source": scripted("re-paired by Zotero_Key: human Exclude, AI Exclude")}
                },
                "cohens_kappa_decision": {"value": round(k, 4),
                    "source": scripted("Cohen kappa over the re-paired decisions; interpretation constraints (PABAK, kappa-max, content-only sensitivity) in knowledge/verification.md")},
                "open_discrepancy": {
                    "note": "papers_full.csv flags one more humanly assessed record than the benchmark pairs; the surplus key is a stray Has_HA flag absent from the human CSV, so the real pairings stand and no paper is missing.",
                    "has_ha_yes": has_ha_yes, "paired": len(pairs), "phantom_key": phantom,
                    "source": scripted("Has_HA = Yes keys minus human_assessment.csv keys")}
            }
        },
        "included": {
            "human_lane_included_binding": {"value": human_incl,
                "source": scripted("human Include count; the human decision is the binding record")},
            "human_included_within_paired_corpus": {"value": c["II"] + c["IE"],
                "source": scripted("both_include + human_include_ai_exclude; the remaining human includes sit among the human-only records")},
            "ai_lane_included_advisory": {"value": llm_incl,
                "source": scripted("AI Include count; advisory only, never binding")},
            "both_lanes_include": {"value": c["II"], "source": scripted("the both_include confusion cell")}
        },
        "reports_and_text_basis": {
            "note": "PRISMA 2020 asks for reports sought and retrieved. Human screening was not conditioned on retrieval; decisions exist for papers whose text was never acquired. The chain below is the documented acquisition and serving state, not a screening gate, and is not under benchmark/data/.",
            "pdfs_acquired": {"value": 257, "source": external("acquisition loss chain")},
            "pdfs_not_acquired_access_barriers": {"value": 69, "source": external("acquisition loss chain")},
            "converted": {"value": 252, "source": external("acquisition loss chain")},
            "distilled": {"value": 249, "source": external("acquisition loss chain")},
            "served_text_per_paper": {"values": {"knowledge_document": 236, "abstract_only": 75, "no_text": 15},
                "source": external("per-paper source markers in docs/data/fulltext_index.json, summarised in knowledge/verification.md")}
        },
        "named_gaps": [
            "No pre-registered protocol and no pre-specified AI use exist (PRISMA 2020 item 24, trAIce M1); non-reconstructable by definition.",
            "Corpus papers without a human decision (Has_HA = No); for these only an advisory AI assessment exists.",
            "Acquisition provenance is non-auditable beyond the RIS-corroborated records; the executed deep-research prompts were never committed.",
            "A one-record discrepancy between papers_full.csv Has_HA and the benchmark pairing, resolved as a stray flag (see open_discrepancy).",
            "No per-record reviewer identity inside the human track.",
            "Exclusion-reason vocabulary was documented but not enforced (Other values, empty cells)."
        ]
    }
    return model, matrix, round(k, 4), len(pairs), has_ha_yes, phantom, \
        {"human_rows": len(human), "human_incl": human_incl, "human_excl": human_excl,
         "llm_rows": len(llm), "llm_incl": llm_incl, "llm_excl": llm_excl}


def verify(matrix, kappa, paired, has_ha_yes, phantom, marg, model):
    fails = []

    def chk(name, got, want):
        if got != want:
            fails.append("%-40s got %r  want %r" % (name, got, want))

    chk("confusion matrix II/IE/EI/EE", matrix, EXPECT["matrix"])
    chk("Cohen kappa", kappa, EXPECT["kappa"])
    chk("paired", paired, EXPECT["paired"])
    chk("human rows", marg["human_rows"], EXPECT["human_rows"])
    chk("human Include", marg["human_incl"], EXPECT["human_incl"])
    chk("human Exclude", marg["human_excl"], EXPECT["human_excl"])
    chk("llm rows", marg["llm_rows"], EXPECT["llm_rows"])
    chk("llm Include", marg["llm_incl"], EXPECT["llm_incl"])
    chk("llm Exclude", marg["llm_excl"], EXPECT["llm_excl"])
    chk("papers_full Has_HA=Yes", has_ha_yes, EXPECT["has_ha_yes"])
    chk("Has_HA surplus over human CSV", phantom, [EXPECT["phantom_key"]])
    # marginal closures the record leans on
    inc = model["included"]
    chk("134 = both_include + human_incl_ai_excl",
        inc["human_included_within_paired_corpus"]["value"], 134)
    chk("142 = within-paired (134) + human-only includes (8)",
        inc["human_included_within_paired_corpus"]["value"] + 8,
        inc["human_lane_included_binding"]["value"])
    return fails


def main():
    check_only = "--check" in sys.argv
    model, matrix, kappa, paired, has_ha_yes, phantom, marg = build()
    fails = verify(matrix, kappa, paired, has_ha_yes, phantom, marg, model)
    for f in fails:
        print("FAIL  " + f)
    if fails:
        print("\nFAIL  %d invariant(s) moved; refusing to write flow_model.json" % len(fails))
        return 1
    print("ok    all %d canonical invariants hold" % 13)
    if check_only:
        print("--check: verified, nothing written")
        return 0
    payload = {
        "schema": "femprompt-prisma-flow-round1/0.2",
        "round": 1,
        "standards": [
            "PRISMA 2020 (Page et al. 2021, BMJ 372:n71): Identification, Screening, Included",
            "PRISMA-trAIce R1 (Holst et al. 2025, JMIR AI 4:e80247, proposed extension): the flow distinguishes AI decisions from human decisions"
        ],
        "evidence": "scripted_committed_replay",
        "method": "Every count flagged source.kind 'scripted' is computed by benchmark/scripts/build_flow_model.py from the raw CSVs in benchmark/data/. Counts flagged 'external' are pipeline or audit figures not present under benchmark/data/ and are sourced to knowledge/verification.md. The script asserts the canonical benchmark invariants before writing and refuses to write on any mismatch; regenerate with: python benchmark/scripts/build_flow_model.py.",
    }
    payload.update(model)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote " + os.path.relpath(OUT, os.path.join(HERE, "..", "..")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
