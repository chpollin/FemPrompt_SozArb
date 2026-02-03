# Scripts-Übersicht

Zentrale Dokumentation aller Python-Scripts im Projekt.

**Stand:** 2026-02-03 (nach vollständiger PDF→Markdown Konvertierung)

---

## Verzeichnisstruktur

```
FemPrompt_SozArb/
├── pipeline/scripts/       # Aktive Pipeline-Scripts
├── benchmark/scripts/      # Benchmark Human vs. Agent
├── assessment/             # Assessment-Workflows
├── assessment-llm/         # LLM-Assessment (Legacy)
├── corpus/                 # Korpus-Vorbereitung
├── analysis/               # Legacy-Scripts
└── run_pipeline.py         # Master-Orchestrator
```

---

## Pipeline Scripts (`pipeline/scripts/`)

**Zweck:** Hauptworkflow PDF → Markdown → Summary → Vault

**Status:** 232/234 PDFs erfolgreich konvertiert (99.1%)

| Script | Beschreibung | Status | Dependencies |
|--------|--------------|--------|--------------|
| `download_zotero_pdfs.py` | PDFs von Zotero Group herunterladen | ✅ Getestet | pyzotero |
| `convert_to_markdown.py` | PDF→Markdown mit Qualitätsmetriken | ✅ Getestet | docling |
| `validate_markdown.py` | Artefakt-Erkennung (GLYPH, Unicode) | ✅ Getestet | - |
| `summarize_documents.py` | LLM-Summarisierung | Ausstehend | anthropic |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend | - |
| `acquire_pdfs.py` | Alternative PDF-Akquise (Unpaywall etc.) | Legacy | requests |
| `utils.py` | Hilfsfunktionen (Hash, Sanitize, JSON) | ✅ Aktiv | - |

---

## Benchmark Scripts (`benchmark/scripts/`)

**Zweck:** Vergleich Human Expert vs. LLM Assessment

| Script | Beschreibung | Dependencies |
|--------|--------------|--------------|
| `run_llm_assessment.py` | LLM-Assessment durchführen | anthropic |
| `merge_assessments.py` | Human + Agent zusammenführen | pandas |
| `calculate_agreement.py` | Cohen's Kappa berechnen | - |
| `analyze_disagreements.py` | Divergenz-Analyse | pandas |
| `run_phase2_pipeline.py` | Pipeline-Orchestrierung | - |

---

## Assessment Scripts (`assessment/`)

**Zweck:** Assessment-Daten verwalten

| Script | Beschreibung |
|--------|--------------|
| `zotero_to_excel.py` | Zotero-Export nach Excel |
| `excel_to_zotero_tags.py` | Excel-Assessment zurück zu Zotero-Tags |
| `create_thematic_assessment.py` | Thematisches Assessment erstellen |
| `fill_assessment_demo.py` | Demo-Daten für Assessment |
| `agent/run_assessment.py` | Agent-Assessment Runner |

---

## Assessment-LLM Scripts (`assessment-llm/`)

**Zweck:** LLM-basiertes PRISMA Assessment (ursprüngliches System)

| Script | Beschreibung |
|--------|--------------|
| `assess_papers.py` | Papers bewerten |
| `analyze_results.py` | Ergebnisse analysieren |
| `write_llm_tags_to_zotero.py` | Tags nach Zotero schreiben |
| `write_llm_tags_to_zotero_simple.py` | Vereinfachte Version |

---

## Corpus Scripts (`corpus/`)

| Script | Beschreibung |
|--------|--------------|
| `extract_metadata.py` | Metadaten aus Zotero-JSON extrahieren |

---

## Master-Orchestrator

| Script | Beschreibung |
|--------|--------------|
| `run_pipeline.py` | Komplette Pipeline orchestrieren |

---

## Empfohlener Workflow

### 1. Korpus vorbereiten
```bash
python corpus/extract_metadata.py --input corpus/zotero_export.json --output corpus/papers_metadata.csv
```

### 2. PDFs herunterladen
```bash
python pipeline/scripts/download_zotero_pdfs.py --output pipeline/pdfs/
```

### 3. Markdown konvertieren
```bash
python pipeline/scripts/convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/
```

### 4. Qualität validieren
```bash
python pipeline/scripts/validate_markdown.py --input pipeline/markdown/
```

### 5. Zusammenfassen
```bash
python pipeline/scripts/summarize_documents.py --input pipeline/markdown/ --output pipeline/summaries/
```

### 6. Vault generieren
```bash
python pipeline/scripts/generate_vault.py --input pipeline/summaries/ --output vault/
```

### 7. Benchmark (optional)
```bash
python benchmark/scripts/run_llm_assessment.py --input corpus/papers_metadata.csv --output benchmark/data/llm_assessment.csv
python benchmark/scripts/calculate_agreement.py --input benchmark/data/merged_comparison.csv
```

---

## Abhängigkeiten

```
pyzotero      # Zotero API
anthropic     # Claude API
docling       # PDF→Markdown (aktiv genutzt)
pandas        # Datenverarbeitung
PyMuPDF       # PDF-Verarbeitung (Legacy, nur für Validierung)
pyyaml        # Konfiguration
```

---

## Aktueller Pipeline-Status

| Phase | Status | Ergebnis |
|-------|--------|----------|
| PDF-Download | ✅ Abgeschlossen | 234 PDFs (von 306 Zotero-Items) |
| Markdown-Konvertierung | ✅ Abgeschlossen | 232/234 erfolgreich (99.1%) |
| Qualitäts-Validierung | 🔄 In Arbeit | Durchschnitt 95.7/100 |
| LLM-Summarisierung | ⏳ Ausstehend | - |
| Vault-Generierung | ⏳ Ausstehend | - |

### Fehlgeschlagene Konvertierungen (2)
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf`
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf`

---

*Letzte Aktualisierung: 2026-02-03*
