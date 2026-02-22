---
title: "Pipeline: Konversion"
type: pipeline
stage: 2
tags: [pipeline, konversion]
---

# Stufe 2: Konversion (PDF -> Markdown)

## Methode

**Docling** (IBM) fuer PDF-zu-Markdown-Konversion. Deterministischer Prozess.

PDF-Akquisition: 4 Fallback-Strategien (Zotero-Attachment, DOI-Resolver, Unpaywall API, ArXiv).

## Ergebnis

| Schritt | Anzahl |
|---------|--------|
| Zotero-Eintraege | 326 |
| PDFs akquiriert | 257 |
| Markdown konvertiert | 252 |
| Konversions-Fehler | 5 |
| Fehlende PDFs | 69 |

## Konfiguration

- `pipeline/scripts/acquire_pdfs.py`
- Docling mit Standard-Einstellungen
- Retry-Logik fuer fehlgeschlagene Downloads

## Limitationen

- 69 Papers ohne PDF (Open-Access-Verfuegbarkeit)
- Tabellen und Abbildungen gehen bei Konversion verloren
- Fussnoten werden oft falsch zugeordnet
- Layout-komplexe Papers (Multi-Column) produzieren Artefakte
