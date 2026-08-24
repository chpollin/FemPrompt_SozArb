# Context-informed literature update, 24 August 2026

## Status and purpose

This dated search supplements the executed round-two identification lanes. It does not alter the original July 2025 to June 2026 publication window retrospectively. Records published after 30 June 2026 remain identifiable as a contextual update. Search identification does not establish inclusion: every new Work must pass Zotero curation, source preparation, PRISM eligibility screening, AI Agent Review, and later domain-expert verification under the same lifecycle as the existing corpus.

## Search design

Three Codex subagents searched in operationally separate lanes on 24 August 2026. Their commissions were bounded by the current corpus and review questions.

| Lane | Search focus | Primary contribution |
|---|---|---|
| A, social work | Generative AI and LLM use in social work, social-work education, social services, child welfare, and related human services | Direct domain coverage and Work-Version relations |
| B, feminist and inequality | Gender, feminist, intersectional, diversity, fairness, and critical AI-literacy research with substantive social-work or professional-education relevance | Inequality and professional-context coverage |
| C, prompting and bias | Prompt-based bias detection or mitigation with transfer to social work, mental health, education, employment, or other human services | Prompting evidence and Preprint-to-Version-of-Record relations |

The lane JSON files preserve the executed query patterns, source links, bibliographic evidence, duplicate checks, Tier-A and Tier-B findings, exclusions, and saturation assessments. The collaboration runtime did not expose a stable public model identifier for the already active subagents; the artifacts therefore identify the execution environment and lane, without inventing a model version.

## Sources and verification

Agents prioritised DOI landing pages, publisher and proceedings pages, Crossref, PubMed, arXiv, institutional repositories, and open full texts. Candidate identity was checked against:

- `corpus/work_version_registry.json`
- `corpus/zotero_export.json`
- `generated/round2-intake-package.json`

Bibliographic metadata are recorded at the strongest state established by a primary source. Journal or publisher status alone does not establish item-specific peer review. A documented received, revised, accepted, or proceedings-acceptance history supports `peer_reviewed`; otherwise the field remains `not_established`. Preprints remain `not_peer_reviewed`. Different expressions of one scholarly Work remain separate Versions.

## Selection rule

Tier A is the candidate import set. A record reaches Tier A when it meets both eligibility dimensions at identification level, has a stable bibliographic identity, and contributes directly to at least one literature-analysis question. Tier B retains plausible context or unresolved scope for later consultation. Tier labels are search-prioritisation decisions and are not PRISM screening decisions.

The generated supplement package deduplicates Tier-A records across lanes by DOI, stable external identifier, and normalised title. It retains every known Version, source-lane attribution, peer-review basis, access statement, and post-window flag. The RIS output is an import aid for the confirmed Zotero group library `FemPrompt_SozArb` (group ID `6080294`). Zotero import and subsequent metadata curation do not make a record part of the screened corpus.

## Downstream gate

After Zotero import, the curated library must be exported and the Work-Version registry rebuilt. Each selected Work then requires its preferred available full text, Docling conversion, Markdown review, and Work-Version binding before agent screening. Only that governed path can produce a PRISM annotation.
