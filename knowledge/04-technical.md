# Technische Dokumentation

Pipeline Version: 2.3
Letzte Aktualisierung: 2026-02-02

---

## System-Anforderungen

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python-Pakete

```bash
pip install -r requirements.txt

# Kern-Pakete:
pip install anthropic>=0.68.0       # Claude API
pip install pandas openpyxl         # Excel
pip install pyzotero>=1.5.0         # Zotero API
pip install docling>=2.60.0         # PDF-Konversion
pip install python-dotenv>=1.0.0    # Environment
```

### Umgebungsvariablen

```bash
# .env Datei (empfohlen):
ANTHROPIC_API_KEY=sk-ant-your-key
ZOTERO_API_KEY=your-zotero-key
```

---

## Pipeline-Architektur

### Automatische Ausfuehrung

```bash
python run_pipeline.py                  # Komplette Pipeline
python run_pipeline.py --resume         # Nach Unterbrechung fortsetzen
python run_pipeline.py --stages acquire_pdfs,summarize
python run_pipeline.py --dry-run        # Vorschau
```

### Manuelle Ausfuehrung (5 Stufen)

```bash
python analysis/getPDF_intelligent.py                  # 1: PDF-Akquise
python analysis/pdf-to-md-converter.py                 # 2: Markdown-Konversion
python analysis/validate_markdown_quality.py           # 2b: Qualitaetspruefung
python analysis/summarize_documents_enhanced.py        # 3: Summarisierung
python analysis/generate_obsidian_vault_improved.py    # 4: Vault-Generierung
python analysis/test_vault_quality.py                  # 5: Qualitaets-Validierung
```

---

## Script-Referenz

### Assessment

| Script | Funktion |
|--------|----------|
| assessment-llm/assess_papers.py | LLM-basiertes PRISMA-Assessment |
| assessment/create_thematic_assessment.py | Excel fuer manuelles Assessment |
| benchmark/scripts/run_llm_assessment.py | Benchmark-Assessment (10 Kategorien) |

### PDF-Akquise

| Script | Funktion |
|--------|----------|
| analysis/getPDF_intelligent.py | Hierarchische PDF-Akquise (8 Fallbacks) |

**Fallback-Strategien:**
1. Zotero Attachments (lokal)
2. DOI via CrossRef
3. ArXiv
4. Unpaywall (Open Access)
5. Semantic Scholar
6. BASE
7. Publisher-Parser
8. URL-Suche

**Usage:**
```bash
python analysis/getPDF_intelligent.py \
  --input assessment.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include
```

### Konversion & Validierung

| Script | Funktion |
|--------|----------|
| analysis/pdf-to-md-converter.py | PDF zu Markdown (Docling) |
| analysis/validate_markdown_quality.py | Qualitaetspruefung |

**Validierungs-Schwellwerte:**
- GLYPH-Platzhalter: max 50
- Unicode-Fehler: max 5%
- Text-Rausch-Verhaeltnis: min 30%

### Summarisierung

| Script | Version | Kosten | Zeit |
|--------|---------|--------|------|
| summarize_documents_enhanced.py | v2.0 | $0.042/Paper | 90s |
| summarize-documents.py | v1.0 | $0.03/Paper | 60s |

**v2.0 Features:**
- Multi-Pass-Analyse (100% Abdeckung)
- Cross-Validierung
- Quality-Scores (0-100)
- Practical Implications (stakeholder-spezifisch)
- Limitations & Open Questions

### Vault-Generierung

| Script | Funktion |
|--------|----------|
| generate_obsidian_vault_improved.py | Wissensgraph erstellen |
| integrate_summaries_direct.py | Summaries einbetten |
| create_bidirectional_concept_links.py | Bidirektionale Links |
| test_vault_quality.py | Qualitaets-Validierung |

---

## Verzeichnisstruktur

```
FemPrompt_SozArb/
  run_pipeline.py              # Master-Orchestrator
  pipeline_config.yaml         # Konfiguration
  .env                         # API Keys

  analysis/                    # Kern-Pipeline
    getPDF_intelligent.py
    pdf-to-md-converter.py
    validate_markdown_quality.py
    summarize_documents_enhanced.py
    generate_obsidian_vault_improved.py
    pdfs/                      # Downloaded PDFs
    markdown_papers/           # Konvertierte Dokumente
    summaries_final/           # AI Summaries

  assessment-llm/              # LLM-Assessment (SozArb)
    assess_papers.py
    prompt_template.md
    output/

  benchmark/                   # Human-LLM Benchmark (FemPrompt)
    config/categories.yaml
    scripts/
    data/

  FemPrompt_Vault/             # Obsidian Vault (FemPrompt)
  SozArb_Research_Vault/       # Obsidian Vault (SozArb)

  knowledge/                   # Dokumentation
  docs/                        # Web Viewer
```

---

## Fehlerbehandlung

### HTTP 429 (Rate Limit)

```python
# In summarize-documents.py:
time.sleep(5)  # Erhoehen von 2 auf 5
```

### NaN URL in getPDF_intelligent.py

Bereits gefixt mit Type-Checking:
```python
if not url or not isinstance(url, str):
    url = ''
```

### Zotero API 403

- Workaround: CSV-Export fuer manuellen Import
- Alternative: Scripts lokal ausfuehren

---

## Performance

### LLM-Assessment (SozArb Run 5)

| Metrik | Wert |
|--------|------|
| Papers | 325 |
| Dauer | 24 min |
| Kosten | $0.58 |
| Erfolgsrate | 100% |

### Enhanced Summarization (v2.0)

| Metrik | Wert |
|--------|------|
| Papers | 47 |
| Dauer | ~100 min |
| Kosten | $2.00 |
| Quality-Score | 76.1/100 |

### Benchmark-Assessment (FemPrompt V2)

| Metrik | Wert |
|--------|------|
| Papers | 50 |
| Inkonsistenzen | 6% |
| Kosten | $0.21 |

---

## API-Kosten

| Operation | Kosten |
|-----------|--------|
| LLM-Assessment | ~$0.002/Paper |
| Summarization v1.0 | ~$0.03/Paper |
| Summarization v2.0 | ~$0.04/Paper |
| PDF-Akquise | $0 |
| Markdown-Konversion | $0 |
| Vault-Generierung | $0 |

**Modell:** Claude Haiku 4.5 ($1/MTok Input, $5/MTok Output)

---

## Konfiguration

### categories.yaml (Benchmark)

```yaml
categories:
  # Technik (4)
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige

  # Sozial (6)
  - Soziale_Arbeit
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness

decision:
  include_criteria: >
    (Technik) AND (Sozial) -> Include
```

### pipeline_config.yaml

```yaml
stages:
  - acquire_pdfs
  - convert_pdfs
  - validate_markdown
  - summarize
  - generate_vault

model: claude-3-5-haiku-20241022
delay_between_calls: 2
```

---

*Konsolidiert aus: TECHNICAL.md, operational-guides.md*
*Version: 1.0 (2026-02-02)*
