# Codex Websearch 2026 protocol

## Objective

The search identifies literature published from 1 January through 24 August 2026 that contributes to the review of generative AI, prompting, gender, bias, inequality, diversity, fairness, and social work or adjacent human services. It extends the identification evidence without changing the publication window of the conducted second review round.

## Search lanes

Three operationally separate Codex subagents execute complementary searches.

| Lane | Scope |
|---|---|
| A | Generative AI and LLMs in social work, social-work education, social care, child welfare, clinical social work, mental health, and human services |
| B | Gender, feminist and intersectional AI research, bias, fairness, diversity, critical AI literacy, and professional education with substantive domain relevance |
| C | Prompt engineering, prompt-based bias detection and mitigation, persona and role prompting, fairness instructions, and evaluations of effectiveness or trade-offs in socially consequential settings |

Each lane records its exact queries, searched sources, complete candidate set, exclusions, duplicate checks, and saturation statement. Searches prioritise publisher and proceedings pages, DOI registries, bibliographic databases, institutional repositories, and stable preprint records. Secondary discovery sources can identify candidates but cannot establish final bibliographic metadata.

## Date rule

The selected Version of every top-level candidate must have a documented date from 2026-01-01 through 2026-08-24. A Work with a 2025 Preprint and a 2026 Accepted Manuscript or Version of Record qualifies through the 2026 Version. The complete earlier Version chain remains attached to that Work. A journal issue year does not replace a documented online-publication date; both dates remain recorded when they differ.

## Eligibility rule

Tier A requires evidence for both review dimensions.

- The technical dimension covers generative AI, LLMs, prompting, AI literacy, or another directly relevant AI system.
- The social dimension covers social work, gender, bias or inequality, fairness, diversity, feminist or intersectional analysis, or a closely related human-services context.

Tier A also requires a stable bibliographic identity and a direct contribution to at least one literature-analysis question. Tier B retains records with an unresolved scope, transferred domain relevance, uncertain publication status, or unavailable decisive text. Exclusions remain in the lane record with a concrete reason. Tier labels support identification prioritisation and carry no PRISM inclusion authority.

## Bibliographic and Work-Version model

Every candidate records:

- title and ordered authors
- publication and Version dates
- publication type, venue, volume, issue, pages, and identifiers
- Preprint, Accepted Manuscript, proceedings, and Version-of-Record relations
- item-specific peer-review evidence where available
- access, licence, landing page, and full-text location
- duplicate status against the curated corpus and all earlier round-two packages
- primary-source URLs supporting the metadata

Publication stage and peer-review status remain separate. A journal label does not establish item-specific peer review. Missing evidence is represented as `not_established`. Preprints remain explicitly `not_peer_reviewed`.

## Deduplication

The search compares candidates against:

- `corpus/work_version_registry.json`
- `corpus/zotero_export.json`
- `generated/round2-intake-package.json`
- `generated/contextual-update-2026-08-24-intake-package.json`
- all lane files under `contextual-update-2026-08-24/`
- all other lanes in this directory

Matching uses DOI, arXiv and proceedings identifiers, normalised title, ordered authors, and explicit Version relations. A newly found publication expression of an existing Work becomes a new Version. It does not become a duplicate Work.

## Outputs and authority

The final builder deduplicates Tier-A records and writes a JSON package, a Zotero RIS file, and a bibliographic audit inside this directory. Every output record remains in lifecycle state `identified` and screening state `identified_not_screened`. Zotero curation establishes the curated metadata layer. Full-text preparation, Docling review, Work-Version binding, governed agent screening, AI Agent Review, and domain-expert verification follow afterward.

