---
title: "RIS Conversion: Round 1 Reconstruction and Round 2 Procedure"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [paper-integrity, update-protocol-draft, conformance-audit]
---

This document closes paper-integrity item 3.8 (RIS conversion not reproducible) by documenting what is known about the round 1 conversion and binding round 2 to a reproducible procedure.

## Round 1: what happened, what survives

The deep research outputs of round 1 were converted to RIS "mit Hilfe eines LLMs" (submitted paper, section Identifikation und Import) and imported into Zotero, with the systems' generated summaries carried along as metadata. What survives in the repository: four restored RIS files in `deep-research/restored/` and the structure template `ris-template.md`. What does not survive: the conversion prompt as executed, the model and version used, and the raw pre-conversion outputs for all but the restored set. The step is therefore documented as performed but not reproducible; this is one of the named acquisition gaps in [[conformance-audit]] and in the retrospective record, and the submitted paper's wording (conversion happened, by an LLM) is accurate but unverifiable in detail.

## Round 2: binding procedure

Per the execution rules of [[update-protocol-draft]], each lane's conversion in round 2 is documented at run time:

1. The raw deep research output is committed unaltered (one file per lane and run) before any conversion.
2. The conversion prompt is committed verbatim alongside, with model name and version and run date recorded in the lane's run record.
3. The conversion output (RIS) is committed next to its input, named so input, prompt, and output pair up.
4. A spot-check compares a sample of converted entries against the raw output (fields: author, year, title, DOI or URL, source-tool attribution); the spot-check result goes into the run record.
5. Zotero import happens only from committed RIS files.

Conversion prompt for round 2 (template, instantiate per lane):

```
Convert the following deep research output into RIS format. One record per
referenced publication. Map: authors to AU (one per line), year to PY, title
to TI, journal or venue to JO, DOI to DO, URL to UR. Put the deep research
system's summary or recommendation text for the entry into N1, prefixed with
the lane id. Use TY JOUR for journal articles, TY CHAP for book chapters,
TY BOOK for books, TY CONF for conference papers, TY GEN otherwise. Do not
invent values: omit any field not present in the source text. Output only
the RIS records, no commentary.
```

Any deviation from this template at run time is flagged in the run record, mirroring the [DEVIATION] convention of the protocol appendix.

*Updated: 2026-06-09*
