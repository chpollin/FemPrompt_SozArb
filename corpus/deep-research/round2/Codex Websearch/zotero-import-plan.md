# Zotero import plan

## Current state

The 2026 package is ready for a later desktop import into the editable Zotero group library `FemPrompt_SozArb`, group ID `6080294`. Zotero was left unchanged. The committed Zotero export contains none of the selected package records.

The package contains records already seen in earlier search artifacts. `codex-websearch-2026-zotero-import.ris` is the single import source for the 2026 subset. Earlier RIS packages must not be imported for their overlapping 2026 records. Source acquisition and representation QC have already prepared a subset outside Zotero. Their exact candidate and Version provenance is retained in the source-readiness ledger and must be reconciled after the curated re-export.

## Deferred desktop import

1. Export or sync the current `FemPrompt_SozArb` library before import.
2. Select the `FemPrompt_SozArb` group library in Zotero.
3. Import `codex-websearch-2026-zotero-import.ris` into a new collection named `Codex Websearch 2026`.
4. Confirm that every imported record carries the tags `Codex Websearch`, `2026`, and `Tier A candidate`.
5. Check the imported count against `codex-websearch-2026-package.json > counts.import_ready`.
6. Resolve Zotero duplicate suggestions by Work identity. Retain distinct Preprint, Accepted Manuscript, proceedings, and Version-of-Record expressions as related Versions.
7. Check title, ordered authors, publication date, publication type, venue, DOI, URL, and access status against `bibliographic-audit.json` and the primary-source URLs in the package.
8. Export the curated group library to `corpus/zotero_export.json` and rebuild the Work-Version registry, intake state, source queue, and frontend data.
9. Bind each prepared source-readiness record to its new Work and exact Version. A locally acquired Preprint remains a Preprint even when the bibliographically preferred record is a Version of Record.

## Metadata interpretation

`not_established` is an explicit evidence state. It does not mean that an article was not peer reviewed. It means that the searched primary sources did not expose item-specific evidence. A missing DOI can be legitimate for proceedings or other stable records when a proceedings identifier or repository identifier is present.

Records without a located full text remain bibliographically importable. They stay blocked from Paper-based PRISM screening until a lawful full text or an explicitly permitted source basis has been acquired and reviewed.
