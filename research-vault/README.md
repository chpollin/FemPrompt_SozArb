---
title: Research Vault
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Grounded Vault
  url: https://github.com/DigitalHumanitiesCraft/grounded-vault
status: active
language: en
version: "0.6"
created: 2026-07-17
updated: 2026-08-23
---

# Research Vault

This folder carries the review's subject knowledge and the evidence chains used by the literature report and the paper. Its active production model follows the canonical Grounded Vault layer chain. Its check vocabulary is a project profile: AI-based source review is named AI Agent Review and deterministic validation remains separate from maturity status.

```text
00_sources → 10_markdown → 20_distillates → 30_assertions → 40_output
```

Each layer references only the layer immediately below it. Output chapters cite Assertions, Assertions cite identified distillate statements, and distillate statements cite a Markdown block, a verified publication quotation, or a deterministic data computation.

## Current migration state

The canonical chain is being introduced without rewriting the legacy evidence record.

| Location | Role | Current use |
|---|---|---|
| `10_distillates/` | legacy migrated distillates | read-only migration source |
| `20_claims/` | legacy Claims and Topic Maps | read-only Assertion candidate source |
| `references/` | bibliographic records | shared source registry, converted to canonical CSL arrays as records enter the new chain |
| `20_distillates/` | canonical single-source statements | active |
| `30_assertions/` | canonical atomic Assertions and topic maps | active |
| `40_output/literature-report/` | literature synthesis | active working output |
| `40_output/paper/paper.md` | method and research paper | canonical manuscript draft |

The legacy `status: grounded` records only the former link check. It does not establish canonical Grounded Vault validation, AI Agent Review, or domain-expert verification. Legacy files remain unchanged until their content has been migrated through the current chain.

## Output separation

The literature report and paper are sibling outputs over one Assertion layer.

- The literature report primarily uses Assertions about findings in the reviewed literature.
- The paper reuses relevant literature Assertions and adds Assertions about the review method, PRISM, reproducible data results, provenance boundaries, and limitations.
- An Assertion is stored once and may support both outputs.
- `40_output/paper/paper.md` is the single current manuscript. Method and result passages acquire Assertion links and higher validation states in place as their evidence becomes available.

## Public boundary

Working and `ai-agent-reviewed` material remains internal. Public projections may use only records, Assertions, and chapters that have completed domain-expert verification and publication approval. The status ladder is `grounded → ai-agent-reviewed → verified → publication-approved`. For Markdown artifacts, deterministic validation is recorded as `checked.validation`; PRISM JSON records use the richer `checks` array. Neither form creates a scholarly authority state.

## Validation

`python -m src.publish.validate_research_vault` checks the active project profile: frontmatter, check dates, status discipline, publication references, statement IDs, adjacent-layer anchors, and the rule that an artifact cannot carry a higher status than its supporting layer. `python -m src.publish.check_claims` remains the compatibility check for the legacy Claim layer. Scaffold and manuscript chapters may remain `grounded` with an empty Assertion list; reviewed chapters may not.

## Rights boundary

Third-party originals and full-text Markdown remain local unless an individual source licence permits publication. Publication distillates may use short quotations whose identity was checked at intake. Bibliographic metadata, original prose, Assertions, and output chapters may be committed.
