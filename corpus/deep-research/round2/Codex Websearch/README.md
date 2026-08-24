# Codex Websearch

This directory contains the deep, context-informed Codex literature search restricted to 2026 publications. It is a self-contained identification package for later Zotero import and governed PRISM screening.

## Contents

- `protocol.md`: scope, eligibility, metadata, provenance, and selection rules
- `run-manifest.json`: executed lane identities, date boundary, and output relations
- `raw/`: complete lane-level search records, including Tier A, Tier B, exclusions, queries, and source evidence
- `codex-websearch-2026-package.json`: deduplicated Tier-A candidate package
- `codex-websearch-2026-zotero-import.ris`: later Zotero import file
- `bibliographic-audit.json`: completeness, conflict, access, peer-review, date, duplicate, and Work-Version checks
- `enrichment/`: partitioned source checks for bibliographic corrections, access, and item-specific peer-review evidence
- `source-acquisition-plan.json`: rights-gated acquisition options with separate preferred-Version and acquired-Version provenance
- `source-recovery-audit.json`: targeted alternative-source audit for open full texts whose first automated endpoint failed
- `zotero-import-plan.md`: deferred desktop import and post-import verification sequence

The final package contains only records whose selected publication Version is dated between 1 January and 24 August 2026. Earlier Versions may appear inside a 2026 Work-Version chain. Tier A records remain `identified_not_screened` until the regular source and PRISM workflow is complete.

Local PDF and repository-HTML acquisition, Docling conversion, direct agent source QC, repairs, and source-readiness state live under `generated/source-acquisition/codex-websearch-2026/`. The source-readiness ledger is preparatory: even an approved local representation remains outside the canonical PRISM queue until Zotero import and re-export bind the candidate to a stable Work and exact Version.
