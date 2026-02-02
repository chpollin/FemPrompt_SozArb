# FemPrompt Projektplan

**Projekt:** Deep-Research-gestützte Literature Reviews im Praxistest
**Publikation:** Forum Wissenschaft 2/2026
**Deadline:** 4. Mai 2026
**Status:** Thematisches Assessment läuft

---

## Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FEMPROMPT PROJEKTPLAN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: Assessment      →  PHASE 2: Pipeline      →  PHASE 3: Paper       │
│  ┌───────────────────┐       ┌───────────────────┐     ┌───────────────────┐│
│  │ Human-Assessment  │       │ PDF-Akquise       │     │ Textbausteine     ││
│  │ LLM-Assessment    │       │ Markdown-Konv.    │     │ Ergebnisse        ││
│  │ Benchmark         │       │ Summarisierung    │     │ Finalisierung     ││
│  └───────────────────┘       │ Vault-Generierung │     └───────────────────┘│
│                              └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Assessment & Benchmark

### 1.1 Human-Assessment abschließen

**Akteure:** Susi Sackl-Sharif, Sabine Klinger
**Werkzeug:** Google Sheets
**Umfang:** 303 Papers

**Schritte:**
1. Bewertung aller 303 Papers nach 10-Kategorie-Schema
2. Inter-Rater-Diskussion bei Uneinigkeit
3. Export als CSV → `benchmark/data/human_assessment.csv`

**Schema (10 binäre Kategorien):**

| Technik | Sozial |
|---------|--------|
| AI_Literacies | Soziale_Arbeit |
| Generative_KI | Bias_Ungleichheit |
| Prompting | Gender |
| KI_Sonstige | Diversitaet |
| | Feministisch |
| | Fairness |

**Inklusions-Logik:**
```
(AI_Literacies OR Generative_KI OR Prompting)
AND
(Soziale_Arbeit OR Bias_Ungleichheit OR Gender OR Diversitaet OR Feministisch OR Fairness)
→ Include
```

### 1.2 LLM-Assessment durchführen

**Akteur:** Christopher (technisch)
**Modell:** Claude Haiku 4.5
**Geschätzte Kosten:** ~$0.60

**Schritte:**
1. `benchmark/config/categories.yaml` finalisieren (nach Human-Assessment)
2. Assessment-Prompt generieren aus YAML
3. LLM-Assessment ausführen:
   ```bash
   python benchmark/scripts/run_llm_assessment.py \
     --input data/femprompt_papers.csv \
     --config benchmark/config/categories.yaml \
     --output benchmark/data/llm_assessment.csv
   ```

**Zu entwickeln:**
- [ ] `benchmark/scripts/run_llm_assessment.py`
- [ ] `benchmark/prompts/assessment_prompt.md`

### 1.3 Benchmark-Analyse

**Schritte:**
1. Daten zusammenführen:
   ```bash
   python benchmark/scripts/merge_assessments.py \
     --human benchmark/data/human_assessment.csv \
     --llm benchmark/data/llm_assessment.csv \
     --output benchmark/data/merged_comparison.csv
   ```

2. Metriken berechnen:
   ```bash
   python benchmark/scripts/calculate_agreement.py \
     --input benchmark/data/merged_comparison.csv \
     --output benchmark/results/agreement_metrics.json
   ```

3. Disagreements analysieren:
   ```bash
   python benchmark/scripts/analyze_disagreements.py \
     --input benchmark/data/merged_comparison.csv \
     --output benchmark/results/disagreement_cases.csv
   ```

**Zu entwickeln:**
- [ ] `benchmark/scripts/merge_assessments.py`
- [ ] `benchmark/scripts/calculate_agreement.py`
- [ ] `benchmark/scripts/analyze_disagreements.py`

**Erwartete Outputs:**
- `agreement_metrics.json` - Kappa, Agreement pro Kategorie
- `disagreement_cases.csv` - 5-10 annotierte Fälle für Paper
- `figures/` - Konfusionsmatrix, Barplots

---

## Phase 2: Pipeline-Ausführung

### 2.1 PDF-Akquise

**Bestand:**

| Quelle | Anzahl |
|--------|--------|
| Zotero downloadbar | 294 |
| Lokal vorhanden | 97 |
| Zu laden | ~197 |

**Schritte:**
1. Include-Liste aus Human-Assessment extrahieren
2. PDFs von Zotero laden:
   ```bash
   python analysis/getPDF_intelligent.py \
     --source zotero \
     --filter-decision Include \
     --output analysis/pdfs/
   ```
3. Fehlende PDFs via DOI/Unpaywall/Crossref nachbeschaffen
4. Ergebnis: `missing_pdfs.csv` für manuelle Nacharbeit

**Geschätzte Erfolgsrate:** 85-90%

### 2.2 Markdown-Konversion

**Schritte:**
1. PDFs zu Markdown konvertieren:
   ```bash
   python analysis/convert_pdf_to_markdown.py \
     --input analysis/pdfs/ \
     --output analysis/markdown_papers/
   ```

**Tool:** PyMuPDF oder pdfplumber

### 2.3 LLM-Summarisierung

**Modell:** Claude Haiku 4.5 (oder Sonnet für höhere Qualität)
**Geschätzte Kosten:** ~$5-8 (bei ~200 Include-Papers)

**Schritte:**
1. Enhanced Summaries generieren:
   ```bash
   python analysis/summarize_papers.py \
     --input analysis/markdown_papers/ \
     --output analysis/summaries/ \
     --model claude-3-5-haiku
   ```

**Output pro Paper:**
- Strukturierte Zusammenfassung
- Extrahierte Konzepte (mit Frequenz)
- Methodische Einordnung
- Qualitätsscore

### 2.4 Obsidian Vault-Generierung

**Schritte:**
1. Vault generieren:
   ```bash
   python analysis/generate_obsidian_vault_improved.py \
     --summaries analysis/summaries/ \
     --output FemPrompt_Vault/
   ```

**Struktur:**
```
FemPrompt_Vault/
├── Papers/           # 200+ Paper-Notizen
├── Concepts/         # ~100 Konzept-Notizen
├── MOCs/             # Thematische Übersichten
└── Templates/        # Wiederverwendbare Vorlagen
```

---

## Phase 3: Paper-Entwicklung

### 3.1 Textbausteine (parallel zu Phase 1-2 möglich)

**Gliederung (18.000 Zeichen gesamt):**

| Abschnitt | Zeichen | Inhalt |
|-----------|---------|--------|
| 1. Einleitung | ~2.500 | KI in Wissenschaft, Deep Research, Forschungsfrage |
| 2. Kontext | ~2.000 | Feministische AI Literacies, Elisabeth-List-Fellowship |
| 3. Methodik | ~4.000 | 3-Phasen-Workflow, Deep Research, Parallele Bewertung |
| 4. Ergebnisse | ~5.000 | Quantitativer Vergleich, Divergenzen, Asymmetrien |
| 5. Diskussion | ~3.000 | Co-Intelligence, Grenzen, Abhängigkeiten |
| 6. Fazit | ~1.500 | Empfehlungen, offene Fragen |

**Format:** Wissenschaftlich-journalistisch, Fußnoten (kein Literaturverzeichnis)

### 3.2 Ergebnisse einarbeiten

Nach Pipeline-Abschluss:
1. Benchmark-Metriken einfügen (Kappa, Agreement)
2. Disagreement-Beispiele auswählen und annotieren
3. Vault-Statistiken (Paper-Anzahl, Konzept-Cluster)
4. Visualisierungen erstellen

### 3.3 Finalisierung

1. Auf 18.000 Zeichen kürzen
2. Fußnoten formatieren
3. Co-Autor:innen-Review (Susi, Sabine, Christian)
4. Einreichung Forum Wissenschaft

---

## Abhängigkeiten & Kritischer Pfad

```
Human-Assessment ──┬──→ LLM-Assessment ──→ Benchmark-Analyse ──┐
                   │                                           │
                   └──→ PDF-Akquise ──→ Markdown ──→ Summaries │
                                                      │        │
                                                      ↓        ↓
                                                    Vault   Paper
```

**Blocker:** Human-Assessment muss abgeschlossen sein, bevor:
- LLM-Assessment starten kann (braucht finalisiertes Schema)
- PDF-Akquise auf Include-Papers gefiltert werden kann

---

## Zu entwickelnde Scripts

| Script | Zweck | Priorität |
|--------|-------|-----------|
| `benchmark/scripts/run_llm_assessment.py` | LLM-Assessment mit YAML-Schema | Hoch |
| `benchmark/scripts/merge_assessments.py` | Human + LLM zusammenführen | Hoch |
| `benchmark/scripts/calculate_agreement.py` | Cohen's Kappa, Metriken | Hoch |
| `benchmark/scripts/analyze_disagreements.py` | Qualitative Analyse | Mittel |
| `benchmark/prompts/assessment_prompt.md` | Prompt für LLM-Assessment | Hoch |

---

## Team-Zuständigkeiten

| Person | Aufgaben |
|--------|----------|
| **Susi Sackl-Sharif** | Human-Assessment, Kategoriendefinition, Paper-Review |
| **Sabine Klinger** | Human-Assessment, Inter-Rater-Diskussion |
| **Christopher Pollin** | Technische Umsetzung, Pipeline, Benchmark-Scripts |
| **Christina** | Zotero-Kuratierung, Metadaten, PDF-Links |
| **Christian Steiner** | Paper-Review |

---

## Kosten-Schätzung

| Komponente | Geschätzte Kosten |
|------------|-------------------|
| LLM-Assessment (303 Papers) | ~$0.60 |
| Summarisierung (~200 Papers) | ~$5-8 |
| Vault-Generierung | ~$1-2 |
| **Gesamt** | **~$8-12** |

---

## Verifikation

Nach jeder Phase:

**Phase 1:**
- [ ] `human_assessment.csv` enthält 303 bewertete Papers
- [ ] `llm_assessment.csv` hat identisches Schema
- [ ] `agreement_metrics.json` zeigt plausible Kappa-Werte

**Phase 2:**
- [ ] PDFs in `analysis/pdfs/` (Zielgröße: ~200)
- [ ] Markdown in `analysis/markdown_papers/`
- [ ] Summaries in `analysis/summaries/` mit Qualitätsscore >75

**Phase 3:**
- [ ] Paper hat 18.000 ± 500 Zeichen
- [ ] Alle Visualisierungen eingebunden
- [ ] Co-Autor:innen haben reviewt

---

## Nächste Aktion

**Sofort (Christopher):**
1. Benchmark-Scripts entwickeln (`run_llm_assessment.py`, `merge_assessments.py`, `calculate_agreement.py`)
2. Assessment-Prompt Template erstellen

**Wartend (auf Human-Assessment):**
3. LLM-Assessment ausführen
4. Benchmark-Analyse durchführen
5. Pipeline für Include-Papers starten

---

*Version 1.0 | Erstellt: 2026-02-02 | Autor: Christopher Pollin*
