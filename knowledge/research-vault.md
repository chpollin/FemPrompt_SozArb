---
title: Research Vault
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.7"
created: 2026-07-18
updated: 2026-09-21
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code
topics: ["[[Grounded Vault]]", "[[Systematic Review]]", "[[Context Engineering]]"]
related: [methods, data, governance, verification, testing, plan, standards]
---

# Research Vault

The Research Vault carries the subject knowledge of the review in one continuous evidence chain. It connects sources, prepared full text, distilled knowledge documents, Assertions and publishable outputs. The literature report and the paper are separate outputs over the same Assertion layer.

## Layer model

```text
00_sources → 10_markdown → 20_distillates → 30_assertions → 40_output
```

Every layer references the layer directly below it. This restriction makes it checkable which transformation step produced a statement and where a correction has to start.

| Layer | Content | Reference target |
|---|---|---|
| `00_sources/` | bibliographically identified original sources and local full texts | stable Work identity and exact publication Version from the registry |
| `10_markdown/` | reviewed Markdown representation of the full text | original source |
| `20_distillates/` | source-specific, structured knowledge reduction | `record-id`, `work-id`, `version-id`, `version-type` and identified Markdown blocks or checked publication quotations |
| `30_assertions/` | atomic statements that can be supported across sources | identified distillate statements |
| `40_output/` | literature report, paper and further syntheses | Assertions |

The older folders `10_distillates/` and `20_claims/` remain as read-only migration sources. `generated/distilled/` and the linked working collection under `generated/vault/Papers/` have likewise received no collective review and form no active Assertion layer. New artifacts use the current chain and the term Assertion.

## Source and rights boundary

The result build takes over no complete third-party sources and no part of the historical working collection. Local PDF binaries and already versioned working representations are separate holdings, and exclusion from `build/site/` makes neither existing repository files nor their Git history private. The result data contain bibliographic metadata, the project's own prose, checked short quotations and their source provenance. Origin, access and source-specific rights stay documented separately.

The source status is settled before annotation. A Paper can be recorded as bound, convertible, ambiguous, unavailable or rights-restricted. Only a reviewed Paper layer may form the evidence basis of a productive annotation.

## Distilled knowledge documents

A distilled knowledge document reduces a full text to the structures relevant to the research questions. It holds metadata, research question, method, central findings, arguments, category relation and identified evidence passages. The reduction serves context engineering because it shrinks the working context and keeps the route back to the source.

Generation comprises four controlled operations.

1. An extraction prompt produces a structured representation of the Paper content and marks uncertainty.
2. A formatting step transfers the extraction into the canonical Markdown schema.
3. A source-grounded AI Agent Review checks evidence coverage, polarity, identity and the separation of quotation and paraphrase.
4. For the final scholarly verification, a domain expert checks the statements and their interpretation. The explicitly labelled preliminary AI-reviewed result release can already take place at step 3 when the artifact-specific review receipts satisfy the [release rule](../config/publication_policy.json).

Prompt version, LLM, input text, output path and review result belong to the provenance of a distillation. In PRISM an LLM-Wissensdestillat remains a reference layer of its own. It does not satisfy the Paper-evidence gate of the screening annotation.

A publication preparation records both the bibliographic Version and the hash-bound source representation. An Accepted Manuscript may therefore support a document whose citation identifies the Version of Record. The publisher checks this relationship against the canonical source binding and exposes the preparation status in PRISM. Historical document recoveries retain their unreviewed authority and bind the existing document to its verified reading source. The recovery manifest declares its text-hash contract. Its canonical form normalises CRLF to LF, preserves previous byte-exact hashes as migration evidence and grants no additional review authority.

A newly reviewed preparation carries a `source-review` reference to an immutable receipt under `corpus/knowledge-reviews/`. The receipt identifies a separate reviewing agent, its actual review time and findings, the reviewed document and the source hash. Integration checks preserve the reviewed body and source metadata while allowing the recorded review state to advance. The validator rejects changed content, changed sources, altered receipts and future review timestamps. Earlier negative receipts remain available beside a later accepted revision. The [historical authority baseline](../corpus/knowledge-reviews/historical-authority-baseline.json) preserves only the exact unchanged documents that carried review authority before this contract. Any change to those documents requires a current receipt, and the baseline grants no new source review.

The literature-readiness inventory also joins recorded conversion checks by exact source path and hash. Readable text without such a check remains an explicit fidelity gap. A failed conversion check records the missing formulas, tables or figures and remains separate from the knowledge-document review.

A knowledge-document review has artifact-local authority. It does not accept an earlier screening decision, resolve a Work-level hold, establish the fidelity of uninspected source figures or grant domain-expert verification.

## Assertions

An Assertion states exactly one scholarly relevant proposition. It points to one or more identified statements in the distillates. Several sources can support, qualify or contradict an Assertion.

An Assertion carries at least the following information.

- stable Assertion ID and precise wording of the statement
- references to the supporting distillate statements
- thematic assignment and relation to the research questions
- marking of contradicting or qualifying evidence
- review status with dated activity and responsible actor
- intended output, for instance literature report, paper or both

Report Assertions and paper Assertions form one body of knowledge. The field for the intended output controls which Assertions are used in which text. Methodological statements of the paper can additionally point to project artifacts such as ADRs, run manifests, tests and replay outputs.

## Status and checks

| Status | Meaning | Authorised activity |
|---|---|---|
| `preparation` | Attributed source-specific LLM draft with checked quotations and an exact source binding, awaiting separate review | source reading and distillate preparation |
| `grounded` | All required references to the layer below resolve | deterministic anchor and schema check |
| `ai-agent-reviewed` | An AI agent has checked statement and evidence chain against the assigned sources | source-grounded AI Agent Review |
| `verified` | A domain expert has confirmed evidence and scholarly interpretation | person-attributed verification |
| `publication-approved` | The verified artifact is released for a specific public projection | person-attributed publication approval |

Deterministic validation appears under `checked.validation`. It checks schema, anchors, references and status rules. The status of a source does not propagate automatically. An output chapter can be verified only after the Assertions it uses have been verified and the interpretation of the chapter has received its own scholarly check.

## Literature report and paper

`40_output/literature-report/` contains the scholarly synthesis of the included literature. The chapters lead through Assertions to the distillates and on to the Paper text. The report is the detailed presentation of the literature knowledge.

`40_output/paper/paper.md` is the canonical manuscript. Its methods part additionally draws on the documented project artifacts. The preliminary results part uses the currently active, AI-reviewed Assertion subset and names its coverage and authority limits. The full corpus analysis and the scholarly verified synthesis remain the goal. An earlier file `paper/draft.md` was integrated into this manuscript, and Git preserves its history.

## Analysis over the knowledge structure

The quantitative analysis uses structured annotations and Assertion metadata. These include categories, co-occurrences, evidence types, populations, practice fields, methods and gaps. Every number is produced by an executable script over the canonical data.

The qualitative analysis synthesises Assertions along the research questions on prompting techniques, bias axes and mitigation approaches, and domain-specific requirements. Topic modelling can serve as exploratory orientation over full texts, distillates, annotations, keywords and Vault relations. The scholarly interpretation of the topics takes place against the evidence-bound knowledge structure.

## Current implementation state

The active folder structure, a reviewed partial holding and the project-specific validator are in place. The following table opens up the active evidence chain, and the generated completion package holds current quantities and review states. A distillate can support several Assertions, and an Assertion can rest on several distillates.

| Active distillate | Supported Assertion |
|---|---|
| [Ahn et al. (2025), AI literacy for social work](../research-vault/20_distillates/publications/ahn-2025-ai-literacy-for-social-work.md) | [Integration into existing core competencies](../research-vault/30_assertions/ahn-et-al-propose-integrating-ai-literacy-across-existing-core-competencies.md) |
| [Kaneko et al. (2024), CoT and gender bias](../research-vault/20_distillates/publications/kaneko-2024-cot-and-gender-bias.md) | [Limited reported CoT effects](../research-vault/30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations.md) and the shared Assertion on variation |
| [Kamruzzaman (2024), dual-process prompting](../research-vault/20_distillates/publications/kamruzzaman-2024-dual-process-prompting.md) | Together with Kaneko et al. (2024), [effects vary across models and bias categories](../research-vault/30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories.md) |
| [Kabra et al. (2025), reasoning-guided fine-tuning](../research-vault/20_distillates/publications/kabra-2025-reasoning-guided-fine-tuning.md) | [Transfer of reasoning traces through training](../research-vault/30_assertions/kabra-et-al-transfer-reasoning-through-fine-tuning-for-bias-mitigation.md), which describes the method and makes no general efficacy claim |

These statements carry attributed AI source reviews and no domain verification. The chat reads the [released Assertion index](../docs/data/assertion_index.json). Connections in the historical Knowledge Graph rest on category co-occurrence and do not replace an evidenced scholarly relation between statements.

Part of the intended Papers is neither actively distilled nor connected to Assertions nor ready for analysis. Separate measures apply to the working state.

| Question | Authoritative evidence |
|---|---|
| Does a linked historical knowledge document exist? | `knowledge_coverage` and the document and record figures in [research_vault_v2.json](../docs/data/research_vault_v2.json), which grant no quality release |
| Which statements may appear in the result and the chat? | [assertion_index.json](../docs/data/assertion_index.json) and its current review chain |
| Which Works carry current screening and analysis values? | [literature_landscape.json](../docs/data/literature_landscape.json), with stated denominators for Works and records |
| What is missing in the whole target corpus? | [completion package](../generated/completion/README.md), in particular `analysis_eligible`, open source reviews, identity conflicts and unbound candidates |

Current subsets can already be analysed descriptively. A completed overall synthesis presupposes complete decisions for the target corpus, sound sources and coding, reviewed Assertions for the statements actually used, and the scholarly review of the report. Excluded or withheld works must be documented and need no artificially generated synthesis Assertions.

## Canonical check paths

| Check | Command or artifact |
|---|---|
| Grounded Vault schema and adjacent references | `python -m src.publish.validate_research_vault` |
| Compatibility check of the legacy Claim layer | `python -m src.publish.check_claims` |
| Source and corpus readiness | `generated/agent-screening-queue.json` and `generated/round2-intake.json` |
| Screening lifecycle | `docs/data/screening_lifecycle_contract.json` and [[governance]] |
| Publication readiness | [[verification]] |
