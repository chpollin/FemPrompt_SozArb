# Phase 2 Pipeline - PDF Acquisition to Summarization

**Status:** Prototyp implementiert und getestet
**Datum:** 2026-02-02

---

## Uebersicht

Phase 2 verbindet drei Verarbeitungsschritte:

```
LLM Assessment (Include) -> PDF-Akquise -> Markdown-Konversion -> LLM-Summarisierung
```

## Komponenten

### 1. PDF-Akquise (`analysis/getPDF_intelligent.py`)

Hierarchische Fallback-Strategie:
1. Zotero Attachment (lokal)
2. Metadata URL/DOI
3. Unpaywall (Open Access)
4. ArXiv

### 2. Markdown-Konversion (`analysis/pdf-to-md-converter.py`)

- Verwendet Docling fuer hochwertige PDF-Konversion
- Behaelt Struktur (Ueberschriften, Tabellen)
- Fuegt Metadaten-Header hinzu

### 3. LLM-Summarisierung (`analysis/summarize_documents_enhanced.py`)

- Multi-Pass-Analyse fuer vollstaendige Abdeckung
- Cross-Validierung gegen Original
- Qualitaets-Score (0-100)
- Strukturierte Ausgabe mit Konzepten

## Usage

### Vollstaendige Pipeline (3 Papers testen)

```bash
python benchmark/scripts/run_phase2_pipeline.py \
  --input benchmark/data/llm_assessment_50_v2.csv \
  --limit 3
```

### Nur PDF-Akquise

```bash
python benchmark/scripts/run_phase2_pipeline.py \
  --input benchmark/data/llm_assessment_50_v2.csv \
  --limit 5 \
  --skip-markdown \
  --skip-summary
```

### Mit existierenden PDFs (Markdown + Summary)

```bash
python benchmark/scripts/run_phase2_pipeline.py \
  --input benchmark/data/llm_assessment_50_v2.csv \
  --limit 5 \
  --skip-pdf
```

## Test-Ergebnisse (2026-02-02)

### PDF-Akquise Test

| Metrik | Wert |
|--------|------|
| Papers getestet | 3 |
| PDFs gefunden | 0 |
| Grund | Keine lokalen Attachments, Unpaywall keine OA-Version |

**Empfehlung:** PDFs manuell ueber institutionellen Zugang beschaffen und in `benchmark/data/phase2_test/pdfs/` ablegen.

### DOIs der Test-Papers

| Paper | DOI |
|-------|-----|
| Lanzetta et al. (2024) | 10.5281/ZENODO.11525357 |
| Marjanovic et al. (2022) | 10.1080/0960085X.2021.1934130 |
| Perron et al. (2023) | 10.1086/726021 |

## Kosten-Schaetzung

| Phase | Kosten pro Paper |
|-------|------------------|
| LLM Assessment | ~$0.004 |
| PDF-Akquise | $0 (oder Unpaywall-Quota) |
| Markdown-Konversion | $0 (lokal) |
| Summarisierung | ~$0.03-0.04 |
| **Gesamt** | **~$0.04** |

Fuer 200 Include-Papers: ~$8

## Dateien

```
benchmark/
  scripts/
    run_phase2_pipeline.py    # Orchestrierungs-Script
  data/
    llm_assessment_50_v2.csv  # Input (V2 Assessment)
    phase2_test/              # Test-Output
      acquisition_input.json
      missing_pdfs.csv
      pipeline_stats.json
      pdfs/                   # PDF Output
      markdown/               # Markdown Output
      summaries/              # Summary Output
```

## Naechste Schritte

1. **PDFs beschaffen:** Manuell oder ueber institutionellen Proxy
2. **Vollstaendiger Test:** 5-10 Papers durch gesamte Pipeline
3. **Qualitaets-Evaluation:** Summaries pruefen
4. **Skalierung:** Alle Include-Papers verarbeiten

---

*Dokumentiert: 2026-02-02*
