# Scripts-Übersicht

Zentrale Dokumentation aller Python-Scripts im Projekt.

**Stand:** 2026-02-03 (nach Validierung und Post-Processing)

---

## Verzeichnisstruktur

```
FemPrompt_SozArb/
├── pipeline/scripts/       # Aktive Pipeline-Scripts
├── pipeline/tools/         # Browser-Tools (HTML)
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

**Status:** 232/234 PDFs konvertiert, validiert und bereinigt

| Script | Beschreibung | Status | Dependencies |
|--------|--------------|--------|--------------|
| `download_zotero_pdfs.py` | PDFs von Zotero Group herunterladen | ✅ Getestet | pyzotero |
| `convert_to_markdown.py` | PDF→Markdown mit Qualitätsmetriken | ✅ Getestet | docling |
| `validate_markdown.py` | Basis-Validierung (GLYPH, Unicode) | ✅ Getestet | - |
| `validate_markdown_enhanced.py` | **Multi-Layer Validierung mit PDF-Vergleich** | ✅ Getestet | pdfplumber |
| `postprocess_markdown.py` | **Konservative Artefakt-Bereinigung** | ✅ Getestet | - |
| `summarize_documents.py` | LLM-Summarisierung | Ausstehend | anthropic |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend | - |
| `utils.py` | Hilfsfunktionen (Hash, Sanitize, JSON, Windows-Encoding) | ✅ Aktiv | - |

### Neue Scripts (2026-02-03)

#### `validate_markdown_enhanced.py`

Multi-Layer Validierungssystem:
- **Layer 1**: Syntaktisch (GLYPH, Unicode, Dateigröße)
- **Layer 2**: Strukturell (PDF-Zeichenvergleich, Tabellen-Zählung)
- **Layer 3**: Semantisch (LLM-Stichproben, optional)
- **Layer 4**: Manual Review Queue

```bash
python pipeline/scripts/validate_markdown_enhanced.py \
  --md-dir pipeline/markdown \
  --pdf-dir pipeline/pdfs \
  --output-dir pipeline/validation_reports
```

**Output:** JSON, CSV, Markdown Reports + Manual Review Queue

#### `postprocess_markdown.py`

Konservative Bereinigung von Konvertierungsartefakten:
- Silbentrennungen zusammenfügen
- Verwaiste Seitenzahlen entfernen
- Wiederholte Journal-Header entfernen (>10x + Pattern-Match)
- Übermäßige Leerzeilen normalisieren

```bash
python pipeline/scripts/postprocess_markdown.py \
  --input-dir pipeline/markdown \
  --output-dir pipeline/markdown_clean
```

**Wichtig:** All-Caps-Entfernung ist DEAKTIVIERT (zu riskant für strukturierte Dokumente)

---

## Pipeline Tools (`pipeline/tools/`)

**Zweck:** Browser-basierte Werkzeuge für Human-in-the-Loop

| Tool | Beschreibung | Technologie |
|------|--------------|-------------|
| `markdown_reviewer.html` | PDF/Markdown Vergleichs-Tool für manuelle Review | HTML/JS |

### `markdown_reviewer.html`

Öffnen mit Live Server in VS Code.

**Features:**
- PDF und gerendertes Markdown nebeneinander
- Dateiliste mit Status-Indikatoren
- PASS/WARN/FAIL Buttons + Keyboard (1/2/3)
- Filter: Alle / Offen / Warn
- Fortschrittsanzeige im Header
- Export als JSON
- LocalStorage-Persistenz

**Keyboard-Shortcuts:**
- `←` `→` Navigation
- `1` PASS | `2` WARN | `3` FAIL
- `L` Liste ein/ausblenden

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

---

## Empfohlener Workflow

### 1. PDFs herunterladen
```bash
python pipeline/scripts/download_zotero_pdfs.py --output pipeline/pdfs/
```

### 2. Markdown konvertieren
```bash
python pipeline/scripts/convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/
```

### 3. Validierung (Enhanced)
```bash
python pipeline/scripts/validate_markdown_enhanced.py \
  --md-dir pipeline/markdown \
  --pdf-dir pipeline/pdfs \
  --output-dir pipeline/validation_reports
```

### 4. Post-Processing
```bash
python pipeline/scripts/postprocess_markdown.py \
  --input-dir pipeline/markdown \
  --output-dir pipeline/markdown_clean
```

### 5. Human Review (optional)
```bash
# Öffne mit Live Server in VS Code:
pipeline/tools/markdown_reviewer.html
```

### 6. Zusammenfassen
```bash
python pipeline/scripts/summarize_documents.py \
  --input pipeline/markdown_clean/ \
  --output pipeline/summaries/
```

### 7. Vault generieren
```bash
python pipeline/scripts/generate_vault.py \
  --input pipeline/summaries/ \
  --output vault/
```

---

## Abhängigkeiten

```
pyzotero>=1.5.0      # Zotero API
anthropic>=0.68.0    # Claude API
docling>=2.60.0      # PDF→Markdown
pdfplumber>=0.10.0   # PDF-Analyse für Validierung (NEU)
pandas               # Datenverarbeitung
pyyaml               # Konfiguration
python-dotenv>=1.0.0 # Environment
```

---

## Aktueller Pipeline-Status

| Phase | Status | Ergebnis |
|-------|--------|----------|
| PDF-Download | ✅ Abgeschlossen | 234 PDFs |
| Markdown-Konvertierung | ✅ Abgeschlossen | 232/234 (99.1%) |
| Validierung (Enhanced) | ✅ Abgeschlossen | 136 PASS, 96 WARNING, 0 FAIL |
| Post-Processing | ✅ Abgeschlossen | 107k Zeichen bereinigt |
| Human Review Tool | ✅ Erstellt | Browser-Tool verfügbar |
| LLM-Summarisierung | ⏳ Ausstehend | Nächster Schritt |
| Vault-Generierung | ⏳ Ausstehend | - |

### Fehlgeschlagene Konvertierungen (2)
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf`
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf`

---

*Letzte Aktualisierung: 2026-02-03*
