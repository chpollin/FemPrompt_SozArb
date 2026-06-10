---
title: "Simulation Ledger: Simulated Stakeholder Decisions Pending Ratification"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, analysis-design, update-protocol-draft, user-stories]
---

**Every decision in this document is SIMULATED.** The project decided on 2026-06-09 not to block on external feedback: stakeholder decisions are simulated from a realistic perspective, explicitly marked, and ratified, revised, or dropped at the next real contact (the 1 July 2026 meeting, or earlier written feedback). A simulated decision licenses *work*, never an *outward claim*: nothing decided here may appear in a publication, record, or report as a stakeholder decision until ratified. This is the programme's standing simulation rule (Gesamtplan, Querschnitt).

Simulated perspectives, grounded in the documented project roles ([[user-stories]]): the review lead (senior researcher, digitalization and AI in social work, methodologically careful, owns the review design), the second reviewing expert (education, gender and societal transformation, qualitative methods background), both working in the established Excel environment under real time constraints. The simulation deliberately weights coding burden and workflow continuity high, because the one already-falsified usage assumption in this project (screening inside the tool) failed exactly on those two dimensions.

## 1. TP4 decisions (analysis-design.md, section 6)

| # | Decision | Simulated outcome | Simulated rationale |
|---|---|---|---|
| 1 | Sub-question set | SQ1 to SQ3 confirmed; the gap map (SQ3) is a deliverable of both the follow-up paper and the Fair Bench preparation | The gap map is the bridge between review and benchmark work; producing it once for two uses matches the programme economy |
| 2 | Field set and AN_Harm_Types | Seven fields confirmed; `AN_Harm_Types` kept as optional | Harm mapping is the highest-burden field; reviewers code it where the paper makes it easy, skip it otherwise; SQ2 survives at reduced resolution |
| 3 | Encoding | Semicolon multi-select (proposed primary) | Roughly thirty extra binary columns would make the working sheet unusable for the people who actually live in it; validation happens at the import bridge anyway |
| 4 | Retro-coding scope | Staged: update batch first; retro-coding of the first round's included papers in a second pass after the pilot has stabilized the definitions | Full retro-coding up front doubles the workload before the field definitions are proven; staging keeps the paper's gap map completable without blocking the update |
| 5 | Coding setup | Single human coder per paper, plus the advisory LLM track, plus a double-coded human-human overlap sample | Full dual coding is unrealistic for two busy academics; the overlap sample closes the project's known missing inter-human baseline (verification-empirical-core, limitations) at bounded cost; the LLM track extends the project's signature dual-track design to the analysis layer and gets its own pre-specified protocol section |
| 6 | Vocabulary details | `Role_Persona` promotion kept. `AN_Population` boundary rules added: `General_Social_Work` is exclusive (never combined with a specific field code); psychosocial settings code `Mental_Health`, somatic-care settings code `Health_Care`. `Intersectional` is coded additively (constituent axes are coded alongside it). `Other_Axis` stays | Resolves the three vague-field findings from the TP4 verification; the additive intersectionality rule preserves per-axis frequencies for SQ2 |
| 7 | Pilot parameters | Stratified pilot on a small sample of already-included papers (strata: text availability, Prompting yes/no); a field definition is revised when coders flag ambiguity on more than roughly a quarter of papers or cannot code the field from the available text on most | Concrete enough to run, loose enough to revise; exact thresholds are a ratification item |
| 8 | Studientyp reuse | Confirmed: existing column, vocabulary-enforced, no duplicate | No argument against it surfaced in simulation |

Consequence licensed by these simulated decisions: the TP4 schema can be treated as provisionally frozen for build purposes (bridge vocabularies, protocol references, paper methods frame). The *real* freeze, which licenses the B2 screening start, happens only at ratification.

## 2. TP5 / update-protocol decisions (update-protocol-draft.md, open issues)

| Decision | Simulated outcome | Simulated rationale |
|---|---|---|
| Screening split | The two reviewers split the new batch, with a double-screened overlap sample; the overlap yields the first inter-human agreement figures of the project | Workload-realistic; directly addresses the named baseline gap |
| Claude Code lane L5 | Runs, as a documented fifth lane (verbatim prompt, model version, run date, raw output committed) | The rehearsal runs demonstrated the lane works; an extra documented lane strengthens the multi-system design and costs little |
| Prompt provenance wording | The protocol cites `deep-research/literature-review-prompt.md` as the documented template, exactly as the submitted Forum paper does in its footnote, with the loss of the instantiated round 1 prompt stated as a known gap | Settled by the submitted paper's own citation practice (paper-integrity, note on 3.1) |
| Reviewer identifiers | Neutral ids, renamed `reviewer-1` / `reviewer-2` repo-wide (avoids the R1 collision with the trAIce item id and the plan phase) | Privacy-clean, PRISMA-sufficient, collision-free |
| Unclear decisions at import | Imported as report items, not as decisions; they stay visible in the import report until resolved in Excel | The schema keeps two-valued decisions; Unclear is a work state, not an outcome |

## 3. User-story validation (user-stories.md)

Simulated validation session over the stories in [[user-stories]], from the two reviewer perspectives plus the review lead. Every verdict below is simulated; the real resolving event stays the validation session with the named users.

| Story | Simulated verdict | Note |
|---|---|---|
| Read and move through the full text fast | Confirmed in substance, role corrected | The heavy reader of paper texts in PRISM is the review lead and technical lead during reconciliation; the reviewing experts read in their own environment first |
| Search the text for the words that matter | Confirmed (same role correction) | Search-and-jump matches how evidence is actually located |
| Pin a found word as evidence for a category | Revised: pinning is primarily a reconciliation and lead activity, not a per-decision duty of the reviewing experts | Mandatory per-decision pinning would re-import the falsified in-tool screening model through the back door |
| Screen without AI anchoring (v3, superseded) | Confirmed as superseded | Blind mode stays meaningful only for the in-tool path nobody asked for |
| See where I diverge from the AI | Confirmed, moved surface accepted | Divergence inspection is wanted, after own decisions exist |
| Record an exclusion with a reason | Confirmed, lives in Excel | The enforced vocabulary arrives via the import bridge report |
| Watch the PRISMA picture build live | Confirmed for the review lead | |
| Run a literature update on a fresh batch | Confirmed for the technical lead | |
| Generate a PRISMA-conformant record | Confirmed | |
| Produce the AI-disclosure text automatically | Confirmed | |
| Verify trAIce conformance (external reviewer) | Confirmed, unvalidatable until a real external reader uses it | Stays an assumption with observation point |
| Share a session with a colleague | Dropped for round 2 | The Excel-plus-bridge path replaces session hand-off between reviewers; retained as background for foreign reuse (TP7) |
| Look up what a category means | Confirmed | Wanted in Excel too: the Legend sheet mirrors the definitions |
| Understand a checklist item | Confirmed for the technical lead | |

## 4. Ratification protocol

At the 1 July 2026 meeting (or earlier written feedback), walk this ledger top to bottom; per row record: ratified / revised (how) / dropped. Update the source documents (`analysis-design.md`, `update-protocol-draft.md`, `user-stories.md`) and remove the simulation marker from each decision as it resolves. The ledger itself stays in the repo as provenance of which decisions were, for a time, simulated.

*Updated: 2026-06-09*
