# Revised evaluation sources

This revision supplies the previously missing primary evidence and preserves the initial source manifest. [The manifest](manifest.json) fixes all input paths, byte hashes, identities and rendering operations. Each case packet E01–E06 lists its full reading scope. [Human reference forms](../human-v2/README.md) now point to this revision. Held-out analyses have not run.

| Case | Completed source work |
|---|---|
| E01 | Original PDF matches the historical acquisition digest. Table 13 and all table-bearing pages are supplied as full-page images, including the spanning cells of Table 12. |
| E02 | The recovered PDF is the version of record with matching DOI, title and journal imprint. This evaluation input now uses the already registered preferred version, with a fresh text extraction and every PDF page rendered. The older manuscript is preserved and is not mixed with the new source. |
| E03 | Original PDF matches the historical digest. Formula-, figure- and table-bearing pages including the appendix are supplied. |
| E04 | Official Europe PMC article XML and media archive recovered. The archive contains the full supplement with three appendices. Every supplement page is rendered, and displayed equation images are supplied. The existing Table 9 text matches all cells in official XML after normalization. |
| E05 | Malmö University's repository supplies a PDF byte-identical to the historical original. Its page 13 restores image Table 3 together with the command/label context. |
| E06 | Full publisher PDF is retained for checking the existing reading text. |

E04's publisher PDF could not be downloaded locally. Its official structured article, existing bound text and article media provide the main-text comparison basis. XML internal image aliases differ from media filenames, so an unresolved inline symbol must be checked explicitly instead of inferred. This is recorded in the packet. Availability and identity checks do not establish study validity, numerical reproduction or human acceptance.

## Preservation and reconstruction

Primary PDFs, XML, archives, text derivatives and page renders live under the repository's ignored `generated/local-source-preservation/paper-evaluation/`. They survive this session but do not travel with Git. The manifest and these instructions are tracked. Do not publish these working materials. Rights remain source-specific and are recorded per case.

On another machine, retrieve each primary source from its manifest URL, verify its digest, and stop on a mismatch rather than substituting a new version silently. The E04 media endpoint returns a ZIP containing `12911_2025_3118_MOESM1_ESM.zip`; inside it, retain `supplementary-information.pdf`, its TeX source and bibliography. Preserve original leaf names, reject traversal and ambiguous duplicate names. Outer ZIP packaging may change on retrieval, so any new receipt must also verify the extracted supplement's frozen digest.

Render each listed page from its corresponding verified PDF with the recorded PyMuPDF version, `page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)`, saved as PNG. PDF page numbers in the manifest are one-based. E02's reading derivative joins `<!-- PDF PAGE n -->` and `page.get_text(sort=True)` for each page, without mixing manuscript content. The PDF/page images are authoritative for tables and layout. Displayed E04 equations come from original `Article_Equ1.gif` to `Article_Equ3.gif` files, saved to RGB PNG at native size for tool compatibility, with source hashes retained.

Verify every restored path and hash before distributing the same inputs to producers and human reviewers. Changing a representation or source creates a new input revision. The old source-QC report records the initial defects; this revision supplies the corresponding evidence. No productive PRISM annotation, source-binding rule or manuscript claim was modified.

## Abgeschlossene technische Prüfung

Der [technische Quellenreview](review.md) prüft die eingefrorene lokale Revision. Der Status im Manifest beschreibt den Erstellungszeitpunkt vor diesem Review und bleibt für dessen Hashbindung unverändert. Menschliche Quellenabnahme und fachliche Vollständigkeitsprüfung bleiben offen.
