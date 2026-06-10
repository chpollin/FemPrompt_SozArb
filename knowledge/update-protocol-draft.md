---
title: "Update Protocol Draft: Literature Update Round 2 (Pre-Registration)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, conformance-audit, verification-empirical-core, data, specification, prisma-methodology]
---

This document is the pre-registration protocol draft for the second literature round (TP5 / Stage B2 of [[plan]]). It exists because the first round had no pre-specified protocol: PRISMA-trAIce item M1 and PRISMA 2020 item 24 are the one gap of the conducted review that cannot be repaired retrospectively ([[conformance-audit]], "No pre-registered protocol"). This protocol closes that gap prospectively. It is committed, in finalized form, before the first round 2 search runs; any change after the first search run is recorded as a dated amendment in this document, never as a silent edit.

The protocol describes the workflow and how large language models are used within it. It makes no efficiency or cost-benefit claims; cost and token figures, where they appear in the disclosure, are factual record.

## 1. Objectives

1. Update the existing corpus (326 papers, first round) with literature published since the round 1 search execution, using the same identification instrument: parallel deep research queries with an identical prompt across systems, followed by deduplication, dual assessment, and human-binding screening.
2. Conduct the round under full PRISMA 2020 plus PRISMA-trAIce conformance by construction: pre-specified protocol (this document), executed prompts committed verbatim with run metadata, enforced controlled vocabulary at capture, per-record reviewer identity, separate AI and human decision tracks, generated flow and disclosure artifacts.
3. Capture the TP4 analysis fields (prompt techniques discussed, bias types addressed, intervention or mitigation type, evidence type, population; see [[plan]] TP4) at screening time, so the round 2 corpus can carry the analysis of how prompt engineering must adapt for social work, gender, and bias contexts.
4. Produce the data for the two-round comparison: round 1 is rendered retrospectively with named gaps (Stage R), round 2 demonstrates the same record machinery under prospective conformance.

## 2. Eligibility criteria

Eligibility is defined by `benchmark/config/categories.yaml`, version 1.2 (version stated in the file header, line 2), and is used unchanged: the ten binary categories, the inclusion logic (at least one technology dimension AND at least one social dimension), and the controlled exclusion vocabulary are not restated here; the YAML file is the single source of truth.

The TP4 schema extension adds capture fields for the analysis question. These are descriptive coding fields, not eligibility criteria. If merging the extension into `categories.yaml` bumps the file version, the eligibility-relevant content (categories, inclusion logic, exclusion vocabulary) remains identical to v1.2; any change to eligibility-relevant content would be a protocol amendment.

Additional time restriction for this round: only records published in or after October 2025 enter screening (see section 4 for the cutoff derivation). Records published earlier are out of scope for round 2 because round 1 covered them; if a search returns earlier records, they are removed at deduplication or excluded with the existing vocabulary, not silently dropped.

## 3. Information sources

The same deep research systems as round 1, named as the repository documents them (`prompts/deep-research-template.md`, "Manuelles Copy-Paste in 4 Deep Research Interfaces (ChatGPT, Claude, Gemini, Perplexity)"; `knowledge/methods-and-pipeline.md`, Phase 1; RIS artifacts `deep-research/restored/Claude.ris`, `Gemini.ris`, `OpenAI.ris`, `Perplexity.ris`):

| Lane | System | Status |
|---|---|---|
| L1 | ChatGPT (OpenAI) Deep Research | as round 1 |
| L2 | Claude (Anthropic) Deep Research | as round 1 |
| L3 | Gemini (Google) Deep Research | as round 1 |
| L4 | Perplexity Deep Research | as round 1 |
| L5 | Claude Code web research lane | optional, new in round 2 |

L5 is an optional fifth lane: a Claude Code session with web search tools executes the identical prompt agentically and writes its raw output to a file. It is documented exactly like the other lanes (executed prompt verbatim, provider and model version, run date, raw output committed at run time) and its results carry their own Source_Tool value so the lane stays separable in every analysis. Whether L5 runs is a human decision recorded before the first search.

Manual identification remains permitted, as in round 1, and is recorded with Source_Tool Manual.

For every lane, the round 1 provenance lesson applies ([[conformance-audit]], "What the infrastructure must record from the start", second point): the executed prompt verbatim, the provider and model version, the run date, and the raw output are stored as files in the repository at run time, under `deep-research/round2/`. The RIS conversion of raw outputs is itself documented and committed this round (round 1 left it unreproducible, `knowledge/paper-integrity.md` section 3.8); the RIS conversion prompt of `prompts/deep-research-template.md` section 2 is the starting point.

## 4. Search strategy

### 4.1 The prompt

Round 2 uses the same prompt as round 1, with exactly one added sentence (the time restriction). The full paste-ready text per lane is Appendix A; the identical text is used for all lanes, as in round 1.

Provenance caveat, stated openly: the repository carries two accounts of the round 1 prompt. `deep-research/literature-review-prompt.md` presents a two-part prompt (KONTEXT block with the research question, plus a generic analysis prompt with `[Topic]` replaced by the research question) as the prompt that generated the round 1 outputs. `prompts/CHANGELOG.md` and [[conformance-audit]] record that the exactly instantiated round 1 prompt was never committed and is genuinely lost, with only the parametric template restored from Git history. This protocol uses the text of `deep-research/literature-review-prompt.md` as the documented round 1 prompt, because it is the only complete, instantiable prompt text in the repository and is already the referenced basis for the paper. The claim this protocol makes is therefore "round 2 uses the documented round 1 prompt", not "round 2 uses the verbatim executed round 1 prompt"; the latter is unprovable for round 1 by the repository's own audit. Resolving the status of `deep-research/literature-review-prompt.md` is an open item for the protocol finalization.

### 4.2 The round 1 cutoff and the time restriction sentence

The round 1 search execution date was not recorded at run time. The repository bounds it to October 2025: the prompt existed and was deleted in October 2025 (`prompts/CHANGELOG.md`, Aenderungsprotokoll row "Okt 2025"); the restored template's source commit `0a98f49` (`knowledge/Operativ.md`) is dated 31.10.2025 (`prompts/deep-research-template.md`, header); the corpus built from the searches was assessed by the 5D track on 2025-11-02 (`assessment/llm-5d/README.md`). The cutoff is therefore set to October 2025, and the restriction includes the cutoff month itself ("in or after October 2025"), deliberately overlapping the round 1 search period; overlap duplicates are removed by the pre-specified deduplication step, which is cheaper than risking a coverage gap. If a precise execution date emerges from sources outside the repository, the cutoff is corrected by amendment before the first run.

The single added sentence, appended at the end of the prompt:

> Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1.

No other wording of the round 1 prompt is changed. Appendix A flags every deviation inline.

### 4.3 Execution rules

One run per lane, all runs inside one declared execution window. A technically failed run may be retried; every attempt is logged with timestamp in the run record. Repeated runs for result comparison are not part of this protocol (round 1's claim of non-reproducible repeated queries was never auditable, `knowledge/paper-integrity.md` section 4) and would require an amendment. Results are imported into Zotero collections with the established prefix convention and provenance preserved; `corpus/source_tool_mapping.json` is regenerated to cover the new records.

### 4.4 Deduplication

Deduplication against the existing 326-paper corpus and within the new batch happens as a separate identification-phase step, before screening, by Zotero key, DOI, and title matching. Round 1 handled duplicates inside screening (67 of 161 human exclusions were Duplicate, computed in [[conformance-audit]] from `benchmark/data/human_assessment.csv`), which inflated the screening divergence cell (50 of the 108 LLM-include/human-exclude pairs were duplicates, [[verification-empirical-core]]). Pre-specifying deduplication before screening removes that artifact class for round 2. The deduplication result (removed records with match reason) is committed as part of the flow data.

## 5. Screening procedure

Capture stays where it works ([[plan]], Zielbild point 2): the reviewing colleagues record categories and decisions in the established Excel format, the column shape of `benchmark/data/human_assessment.csv` (ID, Zotero_Key, bibliographic fields, Source_Tool, Abstract, the ten category columns, Studientyp, Decision, Exclusion_Reason, Notes), extended for round 2 by:

1. the TP4 schema extension fields (frozen per [[plan]] TP4 before screening starts), and
2. a reviewer column carrying neutral reviewer ids (R1, R2), closing the round 1 gap of per-record reviewer identity ([[conformance-audit]], "Per-record reviewer identity absent").

The Excel template enforces the controlled vocabulary at input time (dropdown validation for Decision, Exclusion_Reason, category values, and the TP4 fields): values like Other or empty reason cells, which round 1 admitted ([[conformance-audit]], vocabulary findings), are impossible by construction.

The completed Excel imports into PRISM over the P3 bridge ([[plan]] Stage A P3): idempotent re-import, import report (added, changed, skipped), validation of vocabulary, category completeness, duplicate Zotero keys, and the TP4 fields. Violations are a visible import report, never silent acceptance.

Downstream of the import, the more precise PRISMA steps happen in PRISM: machine-extracted evidence enters as a clearly labelled separate provenance class, human verification of evidence on samples, recording of the text source actually read (raw, knowledge document, abstract), reconciliation of divergent human decisions on the Daten und Repo surface with the consensus decision and process recorded (PRISMA-trAIce M8), and generation of flow, agreement, checklist, and disclosure artifacts from the data.

The dual track runs as in round 1: the offline LLM assessment processes the new batch with the versioned 10K assessment prompt (v2.1, `benchmark/scripts/run_llm_assessment.py`, governed by `prompts/CHANGELOG.md`) and recorded parameters. Decoding parameters are set explicitly and recorded this round; round 1 left temperature and top-p as unrecorded API defaults ([[conformance-audit]], "Prompt and parameter record incomplete"). The human decision is the binding record; the LLM track is advisory and kept separate. An interactive agent screening lane (as in Stage R3) may run as a third track under its own pre-specified sub-protocol.

## 6. Pre-specified metrics

All agreement reporting for round 2 is fixed in advance, taking the round 1 verification ([[verification-empirical-core]]) as binding precedent. For the human-LLM decision comparison:

1. Raw confusion matrix cells (both-include, human-include/LLM-exclude, LLM-include/human-exclude, both-exclude), reported before any coefficient.
2. Observed agreement po, Cohen's kappa, PABAK, and kappa-max, reported together as one decomposition; no single coefficient is reported alone.
3. Prevalence index and bias index as the quantitative form of marginal divergence.
4. Per-category kappas over the ten categories.
5. The content-only analysis, pre-specified this time instead of post hoc: pairs whose human exclusion reason is Duplicate, No full text, or Wrong publication type (workflow criteria a one-paper-at-a-time LLM cannot see) are separated out, and the full set of metrics 1 to 4 is reported for the content-only subset alongside the full matrix. With deduplication moved before screening (section 4.4), the Duplicate stratum should be near empty in round 2; its size is itself a reported check on the deduplication step.

Round 1 baseline values for comparison are taken exclusively from [[verification-empirical-core]]: matrix 100/34/108/49, kappa 0.056, PABAK 0.024, kappa-max 0.508, bias index 0.254; content-only (n = 199) kappa 0.194 with include rates 68.3 versus 67.3 percent. No error-rate language: divergence quantities are divergence against a consolidated human annotation, not error, and round 1 has no inter-human baseline.

If both reviewers screen a shared subset (or the full batch) independently, inter-human agreement (same decomposition: cells, po, kappa, PABAK, kappa-max) is computed from the reviewer column; this supplies the inter-human baseline round 1 lacks. Whether the colleagues screen the full batch or a split is an open decision ([[plan]], Open items) and must be fixed before screening starts; the metric set itself does not change either way.

All metrics are computed by committed scripts (`benchmark/scripts/`, extended by the TP3 content-only computation), never by hand; every published number traces to script output.

## 7. Roles

Neutral ids; no personal names in committed files.

| Id | Role |
|---|---|
| R1 | Reviewing colleague, human track, binding decisions |
| R2 | Reviewing colleague, human track, binding decisions; second coder on the shared subset |
| OP | Technical operator: runs searches, pipeline, LLM track, imports; does not screen |
| LLM | Offline 10K assessment track, advisory |
| AG | Optional interactive agent screening track, advisory |

The mapping of ids to persons is kept outside the repository. The human decision is the binding record in every case.

## 8. Committed before the first search runs

The pre-registration is complete when the following are in the repository, in this order, before any round 2 search executes:

1. This protocol, finalized (open items of section 10 resolved, status no longer draft), as `knowledge/update-protocol.md`.
2. The exact paste-ready prompt texts per lane (Appendix A) as a versioned prompt file under `prompts/`, with a `prompts/CHANGELOG.md` entry for the round 2 prompt version.
3. `benchmark/config/categories.yaml` in the version in force, with the TP4 capture-field extension merged and frozen, eligibility content unchanged from v1.2.
4. The Excel capture template with the TP4 fields, the reviewer column, and enforced vocabulary (dropdown validation), as the file the colleagues will actually use.
5. The P3 bridge import validation extended to the TP4 fields and the reviewer column.
6. The 10K assessment prompt version and the run configuration with explicitly set decoding parameters.
7. The metrics pre-specification as committed, runnable scripts, including the content-only computation.
8. The deduplication procedure (script or documented manual procedure with output format).
9. The disclosure skeleton declaring the intended AI use of the round (identification lanes, LLM track, optional agent track), closing PRISMA-trAIce M1 prospectively.
10. The decision record: L5 yes or no, full-batch versus split screening, and the role assignment of section 7.

After the first search run, this list is frozen; changes happen only as dated amendments below.

## 9. Amendments

None yet. Format: date, what changed, why, which runs were affected.

## 10. Open items before finalization

1. Status of `deep-research/literature-review-prompt.md` versus the lost-prompt record in `prompts/CHANGELOG.md` and [[conformance-audit]] (section 4.1): human decision on how the provenance is described in the final protocol.
2. Round 1 cutoff precision (section 4.2): confirm October 2025 or correct by amendment if a precise execution date exists outside the repository.
3. TP4 schema extension not yet frozen ([[plan]] TP4); items 3 to 5 of section 8 depend on it. Plan ordering says the freeze must precede the B2 screening start; this protocol requires it before the first search so the pre-registration is complete in one commit state. Confirm or relax that stricter ordering.
4. Full-batch versus split screening for R1 and R2 (affects the inter-human baseline, section 6).
5. Decision on running L5 (Claude Code web research lane), with model version recording if yes.

## Appendix A: Paste-ready prompts per lane

The prompt text is identical for all lanes, as in round 1 ("Identischer Prompt fuer alle 4 Modelle", `prompts/deep-research-template.md`). Source text: `deep-research/literature-review-prompt.md` (KONTEXT block plus analysis prompt). Hard line wraps of the source file are unwrapped for pasting; wording is unchanged. The structured deviations from the round 1 text are exactly the ones flagged in A.1.

### A.1 Annotated master prompt (deviations flagged inline)

```
KONTEXT [DEVIATION: in the source file, KONTEXT is a markdown heading that labels the research-question block; it is not part of the quoted prompt text, and whether the literal label line was pasted in round 1 is undocumented; it is kept here as the block label]

Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?

You are an expert in systematic scientific literature analysis. You conduct comprehensive research, summarise relevant sources accurately, critically evaluate their quality and cite them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic 'Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?' from 2023-2025, especially from peer-reviewed sources. [DEVIATION: the source file shows the placeholder '[Topic]' and instructs that it is replaced by the research question; the full research question is inserted verbatim here because no shorter round 1 substitution text is documented]
2. Create a concise summary (max. 150 words) for each source, accurately presenting the central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low), justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral, precise, academic style. Structure of the answer:

1. APA citation
2. Concise summary of the key statements
3. Critical quality assessment including explicit justification

Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1. [DEVIATION: this sentence is the single time restriction added for round 2, required by this protocol, section 4.2]
```

The paste-ready blocks below are this text with the three [DEVIATION] markers removed and nothing else changed.

### A.2 Lane L1: ChatGPT (OpenAI) Deep Research

```
KONTEXT

Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?

You are an expert in systematic scientific literature analysis. You conduct comprehensive research, summarise relevant sources accurately, critically evaluate their quality and cite them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic 'Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?' from 2023-2025, especially from peer-reviewed sources.
2. Create a concise summary (max. 150 words) for each source, accurately presenting the central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low), justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral, precise, academic style. Structure of the answer:

1. APA citation
2. Concise summary of the key statements
3. Critical quality assessment including explicit justification

Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1.
```

### A.3 Lane L2: Claude (Anthropic) Deep Research

Identical text to A.2. Paste as is.

### A.4 Lane L3: Gemini (Google) Deep Research

Identical text to A.2. Paste as is.

### A.5 Lane L4: Perplexity Deep Research

Identical text to A.2. Paste as is.

### A.6 Lane L5: Claude Code web research lane (optional)

Identical prompt text to A.2. [DEVIATION: the execution environment differs from round 1; this lane is an agentic Claude Code session with web search tools instead of a deep research product interface; the prompt wording is unchanged]. The lane is documented like the others: executed prompt verbatim, model version, run date, raw output written to `deep-research/round2/raw/ClaudeCode_deep-research.md` and committed at run time.

*Updated: 2026-06-09*
