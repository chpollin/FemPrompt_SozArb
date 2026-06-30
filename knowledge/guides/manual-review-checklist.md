---
title: Manual Review Checklist for PDF-to-Markdown Conversion
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.2"
created: 2026-02-06
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
related: [methods]
---

The human-in-the-loop quality check for converted Markdown documents, used with the review tool `src/distill/markdown_reviewer.html` (see [[methods]], the human review step). Fill one checklist per document.

## Document information

| Field | Value |
|---|---|
| Filename | |
| PDF source | |
| Reviewer | |
| Date | |
| Confidence score | /100 |
| Automatic status | PASS / WARNING / FAIL |

## 1. Structural integrity

Metadata: title extracted correctly (compare with the PDF), authors correct where recognizable, year correct where recognizable.

Academic structure: abstract present and complete; introduction, methods, results, and discussion recognizable where present in the original; conclusion present; references present.

Section hierarchy: headings formatted as Markdown headers, hierarchy logical (no h4 without h3), no orphan headings.

## 2. Content completeness

Text integrity: the first paragraph after the abstract is readable and coherent, the last paragraph (conclusion) is readable and complete, a sample paragraph from the middle is coherent.

No obvious gaps: no abruptly ending sentences, no recognizably missing pages, clean page transitions with no page-break artifacts.

Language quality: umlauts correct (a, o, u, ss for German texts), accents correct (e, e, n for other languages), quotation marks consistent.

## 3. Table quality

Completeness: the number of tables matches the PDF (plus or minus two tolerance), the important data tables are present.

Formatting: table headers readable, columns aligned, data complete with no missing cells, captions present where in the original.

Content: numeric values correct on a sample, no cells with "GLYPH<>" or artifacts.

## 4. Text quality

Conversion artifacts: no excessive GLYPH<> placeholders, no strange character sequences, no OCR-typical errors (l/1/I confusion).

Layout artifacts: no repeated headers or footers in the text, no page numbers in running text, no column mixing (the text does not jump between columns).

Hyphenation: line-break hyphenation resolved correctly (no "Metho-dology"), no word fragments across lines.

## 5. Special elements

Figures: marked as placeholders, figure captions present and readable, in-text references match the figure numbers.

Formulas where present: readable, variables recognizable, subscripts and superscripts correct.

Citations: in-text citations recognizable, citation format consistent, no fragmented citations.

## 6. Overall assessment

Summarize the issues per category (structure, completeness, tables, artifacts, special elements) with a count and a severity (low, medium, high).

Final verdict: PASS (usable for LLM summarization without restriction), PASS WITH ISSUES (usable with known minor defects), or FAIL (needs reconversion or manual correction).

Recommended action: none, document known issues and proceed, check tables manually, reconvert with different settings, manual editing required, or check the PDF source (quality, scan versus digital).

Free-text notes for specific observations, context, or recommendations.

## Appendix: review tool workflow

Tool: `src/distill/markdown_reviewer.html`. Start it via VS Code Live Server (right-click the file, Open with Live Server) or `npx live-server src/distill/`.

Keyboard shortcuts: `1` PASS, `2` WARN, `3` FAIL, `0` reset, the arrow keys for navigation, `L` to toggle the list, `S` to toggle sync-scroll.

Persistence: localStorage (automatic, across sessions), export to JSON (manual, the Export button), import from JSON (manual, the Import button). The export JSON carries the export timestamp, a summary counter (pass, warn, fail, pending), the total document count, and a filename-to-status map. Save exports as `generated/validation_reports/human_review_YYYY-MM-DD.json`. Claude can read the exported JSON to identify problematic documents, compute statistics, and recommend reconversion.
