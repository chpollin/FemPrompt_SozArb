# Workflow: LLM-gestuetzter Literature Review

Systematischer Review zu AI Literacy und LLM-Bias im Kontext Sozialer Arbeit. 326 Papers aus Zotero werden ueber eine mehrstufige Pipeline zu strukturierten Wissensdokumenten verarbeitet und mit einem dualen Assessment-System bewertet.

---

## Pipeline

Alle Scripts liegen in `pipeline/scripts/`, sind unabhaengige CLI-Tools (`argparse`) und kommunizieren ausschliesslich ueber das Dateisystem. Es gibt keine zentrale Orchestrierung -- jeder Schritt wird manuell ausgeloest. Gemeinsame Funktionen (API-Client, Logging, Retry-Logik) stellt `utils.py` bereit, Konfiguration laedt `config/defaults.yaml`.

### Schritt 1: PDF-Akquise

```
corpus/zotero_export.json (326 Papers) --> acquire_pdfs.py --> pipeline/pdfs/ (257 PDFs)
```

Hierarchische Fallback-Strategie: Zotero-Attachment, DOI-Aufloesung, Unpaywall, ArXiv. Validierung ueber Header-Check und Dateigroesse. 79% Erfolgsrate, Rest hinter Paywalls oder nicht verfuegbar.

### Schritt 2: Markdown-Konversion

```
pipeline/pdfs/ (257) --> convert_to_markdown.py --> pipeline/markdown/ (252)
```

Docling-basierte Konversion mit Seiten-Markern (`<!-- PAGE N -->`). Quality-Scoring (0-100) pro Dokument. 5 PDFs scheitern an korrupten Formaten. Output enthaelt YAML-Metadaten-Header.

### Schritt 3: Post-Processing (optional)

```
pipeline/markdown/ --> postprocess_markdown.py --> pipeline/markdown_clean/
```

Konservative Bereinigung: Silbentrennungen, verwaiste Seitenzahlen, wiederholte Journal-Header (>10x). All-Caps-Entfernung bewusst deaktiviert (Risiko bei strukturierten Dokumenten).

### Schritt 4: Human Review (optional)

```
pipeline/markdown/ + pipeline/pdfs/ --> markdown_reviewer.html (Browser-Tool)
```

Seiten-Alignment: PDF-Bild neben zugehoerigem Markdown-Block. PASS/WARN/FAIL-Bewertung, Export als JSON. Stichprobe: 25/252 geprueft (80% PASS, 16% WARN, 4% FAIL).

### Schritt 5: Knowledge Distillation (3-Stage)

```
pipeline/markdown/ (252) --> distill_knowledge.py --> pipeline/knowledge/distilled/ (249)
```

| Stage | Methode | Funktion |
|-------|---------|----------|
| 1. Extract & Classify | LLM (Haiku 4.5) | JSON-Extraktion: Metadaten, Kernbefund, 3 Argumente, 10 Kategorien mit Evidenzzitaten |
| 2. Format | Lokal (kein LLM) | Deterministisches Template-Rendering: YAML-Frontmatter, Obsidian-Sektionen, Wikilinks |
| 3. Verify | LLM (Haiku 4.5) | Pruefung gegen Original: Completeness (40%), Correctness (40%), Category Validation (20%) |

Confidence-Score (0-100) wird in Stage 3 berechnet. Schwellwert: < 75 markiert `needs_correction`. Korrekturen werden geloggt, nicht automatisch angewendet. Kosten: ~$0.028/Paper, gesamt ~$7.

**Output-Format (Knowledge Document):**

```yaml
---
title: "Paper-Titel"
authors: ["Autor1", "Autor2"]
year: 2024
type: journalArticle
language: en
categories:
  - AI_Literacies
  - Bias_Ungleichheit
confidence: 87
source_file: paper.md
---
```

Sektionen: Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz (Subsektionen pro Kategorie), Assessment-Relevanz, Schluesselreferenzen (`[[Autor_Jahr]]`).

### Schritt 6: Qualitaetspruefung (optional)

```
pipeline/knowledge/distilled/ --> verify_knowledge_quality.py --> Report
```

11 regelbasierte Checks: YAML-Parsing, Pflichtfelder, Sektionsvollstaendigkeit, Keyword-Overlap (>= 25% als Halluzinationsschutz), Metadaten-Matching gegen Original. Ergebnis: 242/249 perfekt (97.2%), 7 mit PDF-Upstream-Problemen.

### Schritt 7: Vault-Generierung

```
pipeline/knowledge/distilled/ + corpus/zotero_export.json --> generate_vault.py --> vault/
```

Konzept-Extraktion (Bias-Typen, Mitigationsstrategien) mit Synonym-Normalisierung (200+ Mappings), Frequenzfilter (>= 2 Nennungen). Output: Paper-Notes, Concept-Notes, MOCs, MASTER_MOC mit Mermaid-Diagramm. Status: Code fertig, wartet auf Benchmark-Daten.

---

## Assessment

Ein Korpus, zwei unabhaengige LLM-Assessment-Tracks plus Human-Assessment:

### 5D-System (Relevanz-Screening) -- fertig

| Dimension | Misst | Skala |
|-----------|-------|-------|
| AI_Komp | Behandlungstiefe AI/LLM-Kompetenzen | 0-3 |
| Vulnerable | Adressierung benachteiligter Gruppen | 0-3 |
| Bias | Algorithmische Verzerrungen | 0-3 |
| Praxis | Implementierbare Komponenten | 0-3 |
| Prof | Professioneller Kontext Soziale Arbeit | 0-3 |

Script: `assessment-llm/assess_papers.py`, Prompt: `assessment-llm/prompt_template.md`. 325/325 Papers bewertet, 100% Erfolgsrate, $1.15 Kosten. Ergebnis: 222 Include, 83 Exclude, 20 Unclear.

### 10K-System (Benchmark-Assessment) -- code-ready, nicht ausgefuehrt

10 binaere Kategorien (Ja/Nein), identisch mit Human-Schema:

- **Technik (4):** AI_Literacies, Generative_KI, Prompting, KI_Sonstige
- **Sozial (6):** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Inklusions-Logik:** (Technik >= 1) UND (Sozial >= 1) = Include

Script: `benchmark/scripts/run_llm_assessment.py`, Schema: `benchmark/config/categories.yaml`. Testlauf (50 Papers, v2): 6% Inkonsistenzen. v1.1 hat KI_Sonstige zur Inklusions-Logik ergaenzt (algorithmische Systeme in der Jugendhilfe).

### Human-Assessment -- in Arbeit

Google Sheets, Bewerterinnen: Susi Sackl-Sharif und Sabine Klinger. Gleiches 10-Kategorien-Schema. Status: laufend, kein Fertigstellungstermin. Blockiert den Benchmark.

---

## Benchmark-Pipeline

Vergleicht Human- und LLM-Assessment (10K-Schema) ueber Cohen's Kappa. Alle Scripts fertig implementiert:

```
run_llm_assessment.py --> llm_assessment.csv
                                                \
                                                 --> merge_assessments.py --> merged_comparison.csv
                                                /                                      |
Human-Assessment (Google Sheets Export) --> human_assessment.csv            +-----------+-----------+
                                                                           |                       |
                                                                  calculate_agreement.py   analyze_disagreements.py
                                                                           |                       |
                                                                  agreement_metrics.json   disagreement_cases.csv
                                                                  (Cohen's Kappa)          (Severity-Ranking)
```

Erwartete Kappa-Werte: Human-Human 0.5-0.8, Human-LLM 0.3-0.7 (Referenz: Woelfle et al. 2024, Hanegraaf et al. 2024).

---

## Datenbestand

| Stufe | Input | Output | Erfolgsrate |
|-------|-------|--------|-------------|
| Zotero-Export | 326 Papers | `corpus/zotero_export.json` | 100% |
| PDF-Akquise | 326 | 257 PDFs | 79% |
| Markdown-Konversion | 257 | 252 Markdown | 98% |
| Knowledge Distillation | 252 | 249 Knowledge Docs | 99% |
| Qualitaetsverifikation | 249 | 242 perfekt | 97% |
| LLM-Assessment (5D) | 325 | 325 bewertet | 100% |
| LLM-Assessment (10K) | -- | -- | ausstehend |
| Human-Assessment | -- | -- | laufend |

API-Kosten gesamt: ~$8.73 (Knowledge Distillation ~$7, 5D-Assessment ~$1.15, Validierung ~$0.58).

---

## Offene Schritte

1. Human-Assessment abschliessen (Blocker)
2. LLM-Assessment (10K) auf vollem Korpus ausfuehren
3. Benchmark-Metriken berechnen (Cohen's Kappa)
4. Vault-Generierung mit Benchmark-Daten
5. Paper schreiben: Forum Wissenschaft 2/2026, Deadline 4. Mai 2026, 18.000 Zeichen

---

## Verzeichnisstruktur

Detaillierte Verzeichnisstruktur: [knowledge/04-technical.md](knowledge/04-technical.md)

---

## Weitere Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [knowledge/06-epistemic-infrastructure.md](knowledge/06-epistemic-infrastructure.md) | Mapping: Asymmetrie -> Risiko -> Massnahme -> Artefakt |
| [prompts/CHANGELOG.md](prompts/CHANGELOG.md) | Versionierte Prompts und Sycophancy-Mitigation |
| [PAPER_VS_REPO.md](PAPER_VS_REPO.md) | Paper-vs-Repository-Abgleich |

---

*Aktualisiert: 2026-02-14*
