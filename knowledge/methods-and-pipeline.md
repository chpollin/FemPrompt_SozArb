# Methodik und Pipeline

Dieses Dokument beschreibt **wie** der systematische Literature Review durchgefuehrt wurde -- von der methodischen Begruendung bis zur technischen Implementierung. Theoretische Grundlagen und Operationalisierung: siehe `project.md`.

---

## System-Anforderungen

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python-Pakete

Installation via `pip install -r requirements.txt`. Kern-Pakete:

| Paket | Version | Zweck |
|-------|---------|-------|
| anthropic | >=0.68.0 | Claude API |
| pandas, openpyxl | - | Excel-Verarbeitung |
| pyzotero | >=1.5.0 | Zotero API |
| docling | >=2.60.0 | PDF-Konversion |
| pdfplumber | >=0.10.0 | PDF-Analyse |
| python-dotenv | >=1.0.0 | Environment |

### Umgebungsvariablen

In `.env` Datei (nicht committen):
- `ANTHROPIC_API_KEY` - Claude API-Schluessel
- `ZOTERO_API_KEY` - Zotero API-Schluessel

---

## PRISMA 2020 Framework

Der Workflow folgt PRISMA 2020 Standards fuer systematische Reviews:
- 27-Item-Checkliste strukturiert Identifikation, Screening, Eligibility-Assessment
- Flow-Diagramm dokumentiert Selektionsprozess mit Quantifizierung jeder Phase
- Explizite Benennung von Ausschlussgruenden

### Abweichung von Standard-Datenbanksuchen

Die Identifikationsphase nutzt KI-gestuetzte Deep Research statt traditioneller Datenbanksuchen:
- 4 Modelle (ChatGPT, Claude, Gemini, Perplexity) erhalten identische kontextparametrisierte Anweisungen
- Ergaenzt durch eine begrenzte Zahl manuell identifizierter Studien (50 von 305 Papers im Human-Assessment)
- Abweichung wird explizit dokumentiert und begruendet
- Motivation: Erprobung einer neuen Technologie, nicht Aufwandsreduktion

**Hinweis:** Die Deep-Research-Prompts wurden im Oktober 2025 aus dem Repository geloescht. Wiederherstellung aus Git-History vor Einreichung erforderlich (siehe `paper-integrity.md`, Abschnitt 3.1).

---

## Phase 1: Identifikation (Deep Research + Manuelle Recherche)

### Parametrischer Prompt

Alle 4 Modelle erhalten identische Prompts mit:

1. **Rolle:** Literature Review Spezialist fuer feministische KI-Forschung
2. **Aufgabe:** Annotierte Bibliographie mit strukturierten Metadaten
3. **Kontext:** Forschungsziele, zeitlicher Scope, geografischer Fokus
4. **Analyseschritte:** 20-30 Publikationen, peer-reviewed priorisiert
5. **Output-Format:** APA 7, 150-200 Woerter Summary, Relevanz-Score

### Ausfuehrung

- Manuelles Copy-Paste in 4 Deep Research Interfaces
- Ergebnisse in Zotero-Collections mit Praefix "_DEEPRESEARCH"
- Typisch 3-15 Empfehlungen pro Modell

### RIS-Standardisierung

Heterogene Modell-Outputs werden in RIS-Format konvertiert.

**Standard-Felder:** Dokumenttyp (TY), Autoren (AU), Titel (TI), Journal (JO), Volume (VL), Issue (IS), Seiten (SP/EP), Jahr (PY), DOI (DO), Abstract (AB), Keywords (KW)

**Qualitaetssicherung:**
- DOI-Validierung gegen CrossRef-Muster
- Unsichere Angaben mit N1-Note markiert
- Temporaere Konversion via Claude-Projekt

### Zotero-Integration

**Import:** Sequenzieller Import der RIS-Dateien, modellspezifische Collections (claude_, gemini_, openai_, perplexity_), Provenienz-Information bleibt erhalten

**Qualitaetskontrolle:** Duplikaterkennung via Title-Matching und DOI-Vergleich, Metadaten-Korrektur (ORCID, Journal-Namen), PDF-Attachment via Browser-Integration

**Export:** `corpus/zotero_export.json` fuer Pipeline-Input, `corpus/papers_metadata.csv` fuer Metadaten-Analyse, `corpus/source_tool_mapping.json` fuer Provenienz-Tracking

---

## Phase 2: Assessment (Dualer Bewertungspfad)

### Epistemische Begruendung

Der duale Bewertungspfad ist das methodische Kernstueck des Workflows. Die Entscheidung fuer den Parallelmodus (nicht sequentiell) ist bewusst: Eine sequentielle Anordnung haette den LLM-Pfad auf eine vorbereitende Funktion begrenzt. Der Parallelmodus ermoeglicht den systematischen Vergleich und macht sichtbar, wo die epistemischen Beitraege konvergieren und wo sie divergieren.

**Dual** bezieht sich auf zwei Merkmale zugleich:
1. Zwei unabhaengige Bewertungsinstanzen (Expert:innen und LLM)
2. Zwei verschiedene epistemische Grundlagen der Bewertung

Beide Pfade arbeiten auf Grundlage der PRISMA-Richtlinien: identische Kriterien bei verschiedenen epistemischen Grundlagen. Die Trennung schuetzt die Expert:innen davor, dass LLM-Ergebnisse ihre eigene Bewertung beeinflussen.

### Human Assessment (10 binaere Kategorien)

**Forschungsfrage:**
> Inwiefern kommen die Themen oder die Verknuepfung der Bereiche feministische AI Literacies, generative KI / Prompting und Soziale Arbeit in wissenschaftlicher Literatur vor?

**Technik-Dimensionen (Ja/Nein):**

| Kategorie | Beschreibung |
|-----------|--------------|
| AI_Literacies | KI-Kompetenzen, kritische Reflexion, Anwendungskompetenz |
| Generative_KI | LLMs, ChatGPT, Bildgeneratoren |
| Prompting | Prompt-Engineering, Eingabegestaltung |
| KI_Sonstige | Klassisches ML, algorithmische Systeme, Predictive Analytics |

**Sozial-Dimensionen (Ja/Nein):**

| Kategorie | Beschreibung |
|-----------|--------------|
| Soziale_Arbeit | Praxis, Theorie, Ausbildung, Zielgruppen |
| Bias_Ungleichheit | Diskriminierung, algorithmischer Bias, strukturelle Benachteiligung |
| Gender | Geschlechterperspektive, Gender-Bias |
| Diversitaet | Diversitaet, Inklusion, Repraesentation |
| Feministisch | Feministische Theorie, Methodik, Perspektive (auch implizit) |
| Fairness | Algorithmische Fairness, faire ML-Systeme |

**Inklusions-Logik:** Ein Paper wird eingeschlossen, wenn **mindestens eine Technik-Dimension** UND **mindestens eine Sozial-Dimension** zutrifft. KI_Sonstige wurde in v1.1 zur Inklusions-Logik hinzugefuegt, da algorithmische Systeme im Sozialbereich hochrelevant sind.

**Exclusion Reasons:** Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language

**Studientypen:** Empirisch, Experimentell, Theoretisch, Konzept, Literaturreview, Unclear

**Konfigurationsdatei:** `benchmark/config/categories.yaml`

### Expert:innen-Pfad (epistemisch verbindlich)

Wissenschaftler:innen aus der Sozialarbeitsforschung, der Gender- und Diversitaetsforschung sowie der Technikforschung bewerten jede Studie nach 10 binaeren Kategorien. Dieser Pfad ist der epistemisch verbindliche Referenzpfad, weil Verantwortung und Rechenschaftsfaehigkeit nur hier liegen.

**Asymmetrie-Beispiele aus dem Paper:**

| Entscheidungstyp | Beschreibung | Warum LLM das nicht kann |
|---|---|---|
| KI-Definitionsabgrenzung | Undefinierte vs. regelbasierte vs. generative KI | Expert:innen erschliessen aus Kontext, welche KI-Form gemeint ist |
| Interpretatives Mitdenken | "Diversitaet" selten als Begriff, "Intersektionalitaet" haeufiger, "Fairness" mitgemeint | Verwandte Konzepte kontextabhaengig mitzufuehren setzt Feldkenntnis voraus |
| Implizite theoretische Zugehoerigkeit | Paper zu "algorithmic fairness" ohne den Begriff "feministisch", aber mit intersektionalen Gerechtigkeitskategorien | LLM operiert auf Ebene expliziter Muster, Expertin auf Ebene impliziter Zugehoerigkeit |

### LLM-Pfad (zwei Assessment-Systeme)

| System | Schema | Skala | Zweck | Status |
|--------|--------|-------|-------|--------|
| **5D** | 5 Relevanz-Dimensionen | Ordinal (0-3) | Exploratives Screening und Priorisierung | Fertig (325/325) |
| **10K** | 10 binaere Kategorien | Ja/Nein | Benchmark gegen Human-Assessment (Cohen's Kappa) | Fertig (326/326, $1.44) |

**Warum zwei Systeme?** Das 5D-System wurde zuerst entwickelt, um das Korpus parametrisch zu screenen. Das 10K-System wurde spaeter eingefuehrt, als das Human-Assessment-Schema feststand. Nur das 10K-System ist direkt mit dem Human-Assessment vergleichbar -- es verwendet das identische Schema.

#### 5D-Relevanz-Dimensionen (0-3 Skala)

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| AI_Komp | Keine Erwaehnung | Oberflaechlich | Substantiell | Framework-Entwicklung |
| Vulnerable | Keine Erwaehnung | Erwaehnt | Fokus | Intersektional |
| Bias | Keine Erwaehnung | Erwaehnt | Analysiert | Bias-Detection-Studie |
| Praxis | Rein theoretisch | Konzepte | Anwendung | Evaluiertes Tool |
| Prof | Kein Kontext | Allgemein | Human Services | Soziale Arbeit |

**Script:** `assessment/llm-5d/scripts/assess_papers.py`
**Performance:** 325 Papers in 24 Minuten, 100% Erfolgsrate, $1.15

#### 10K-Assessment (Benchmark)

**Script:** `benchmark/scripts/run_llm_assessment.py`
**Performance:** 326 Papers, $1.44, 232 Include, 94 Exclude

### Human-LLM Benchmark

Das Benchmark vergleicht Human- und LLM-Assessment und adaptiert den Ansatz von Woelfle et al. (2024).

**Referenzliteratur:**

| Studie | Befund | Relevanz |
|--------|--------|----------|
| Woelfle et al. (2024) | Human IRR: kappa = 0.29-0.84 (komplexitaetsabhaengig) | Methodische Vorlage |
| Hanegraaf et al. (2024) | Human IRR in SLRs: kappa = 0.77-0.88 | Benchmark-Werte |
| Sandner et al. (2025) | Human-LLM kappa ca. 0.52 ca. Human-Human kappa | Hypothese: LLM weicht nicht staerker ab als Menschen |

Detaillierte Dokumentation: `paper/Referenzliteratur-Benchmark-Design.md`

**Metriken:** Cohen's Kappa, Agreement pro Kategorie, Disagreement-Analyse, Konfusionsmatrix

**Benchmark-Scripts:**

| Script | Funktion |
|--------|----------|
| `benchmark/scripts/generate_papers_csv.py` | Zotero JSON -> papers_full.csv (326 Zeilen) |
| `benchmark/scripts/run_llm_assessment.py` | Benchmark-Assessment (10K, 326/326) |
| `benchmark/scripts/merge_assessments.py` | Human + LLM zusammenfuehren (304 Papers, 210 mit Decision) |
| `benchmark/scripts/calculate_agreement.py` | Cohen's Kappa berechnen |
| `benchmark/scripts/analyze_disagreements.py` | Qualitative Analyse (111 Disagreements) |

Ergebnisse: siehe `status.md`, Abschnitt M6

---

## Phase 3: Synthese (PDF -> Markdown -> Knowledge Documents)

### Pipeline-Workflow

| Schritt | Script | Input | Output | Wichtige Parameter |
|---------|--------|-------|--------|-------------------|
| 1. PDF-Download | `download_zotero_pdfs.py` | Zotero Group | `pipeline/pdfs/` | `--output` |
| 2. Markdown-Konversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | `--input`, `--output`, `--no-page-markers` |
| 3. Validierung | `validate_markdown_enhanced.py` | Markdown + PDFs | `pipeline/validation_reports/` | `--md-dir`, `--pdf-dir`, `--output-dir` |
| 4. Post-Processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | `--input-dir`, `--output-dir` |
| 5. Human Review | `markdown_reviewer.html` | Markdown + PDFs | JSON-Export | Via Live Server oeffnen |
| 6. Knowledge Distillation | `distill_knowledge.py` | Markdown | `pipeline/knowledge/distilled/` | `--input`, `--output`, `--limit` |
| 7. Vault-Building | `generate_vault.py` | Knowledge Docs | `vault/` | `--input`, `--output` |

Alle Scripts befinden sich in `pipeline/scripts/`. Vollstaendige Parameter via `--help`.

### PDF-Akquise

**Script:** `acquire_pdfs.py` -- 4 Fallback-Strategien: Zotero, DOI, Unpaywall, ArXiv

**Script:** `download_zotero_pdfs.py` -- PDFs von Zotero herunterladen

**Ergebnis:** 257/326 PDFs heruntergeladen (78.8%)

### Markdown-Konversion

**Script:** `convert_to_markdown.py` -- PDF zu Markdown mit Docling (inkl. optionale Seiten-Marker)

**Ergebnis:** 252/257 konvertiert (98.1%), 5 fehlgeschlagen (korrupte Formate), 9 Dubletten entfernt

### Validierung

**Script:** `validate_markdown_enhanced.py` -- Multi-Layer Validierungssystem:

| Layer | Pruefung | Schwellwert |
|-------|----------|-------------|
| 1. Syntaktisch | GLYPH-Placeholder, Unicode-Fehler | max 50 / max 5% |
| 2. Strukturell | Character-Ratio (MD/PDF) | min 0.7 |
| 3. Semantisch | LLM Spot-Check | Optional, 10% Sample |
| 4. Manual | Review Queue | Priorisiert nach Konfidenz |

### Post-Processing

**Script:** `postprocess_markdown.py` -- Konservative Bereinigung:

| Operation | Beschreibung | Sicherheit |
|-----------|--------------|------------|
| Hyphenation-Fix | Silbentrennungen zusammenfuegen | Sicher |
| Page Number Removal | Verwaiste Seitenzahlen entfernen | Sicher |
| Header Removal | Journal-Header (>10x + Pattern) | Konservativ |
| Newline Normalization | Max 2 Leerzeilen | Sicher |
| All-Caps Removal | **DEAKTIVIERT** | Zu riskant |

### Human Review Tool

**Tool:** `pipeline/tools/markdown_reviewer.html` -- Browser-Tool fuer Human-in-the-Loop Review

**Features:** Seiten-Ansicht (PDF + Markdown pro Seite), Split-Ansicht, PASS/WARN/FAIL Bewertung, Export/Import als JSON, LocalStorage-Persistenz

**Keyboard-Shortcuts:** `1` PASS | `2` WARN | `3` FAIL | `0` Reset | `<-` `->` Navigation | `L` Liste | `V` Ansicht

### Knowledge Distillation (3-Stage SKE)

**Script:** `distill_knowledge.py` -- Dreistufiger Workflow:

| Stage | Funktion | Input | Output | API-Call |
|-------|----------|-------|--------|----------|
| 1 | Extract & Classify | Markdown | JSON | Ja |
| 2 | Format Markdown | JSON | Markdown | Nein (lokal) |
| 3 | Verify | Markdown + Original | JSON | Ja |

**Output-Format (Markdown mit YAML-Frontmatter):**

```markdown
---
title: "Paper Titel"
authors: ["Autor1", "Autor2"]
year: 2024
type: journalArticle
categories:
  - AI_Literacies
  - Soziale_Arbeit
confidence: 95
processed: 2026-02-04
source_file: paper.md
---

# Paper Titel

## Kernbefund
[1-2 Saetze]

## Forschungsfrage
[1 Satz]

## Methodik
[Kurzbeschreibung]

## Hauptargumente
- Argument 1

## Kategorie-Evidenz
### AI_Literacies
[Evidenz-Zitat]

## Schluesselreferenzen
- [[Autor_Jahr]] - Kurztitel
```

**Wichtige Parameter:**

| Parameter | Standard | Beschreibung |
|-----------|----------|--------------|
| `--input` | `pipeline/markdown` | Input-Verzeichnis |
| `--output` | `pipeline/knowledge/distilled` | Output-Verzeichnis |
| `--limit` | - | Anzahl Dokumente begrenzen |
| `--delay` | 1.0 | Sekunden zwischen API-Calls |
| `--no-skip` | False | Bereits verarbeitete nicht ueberspringen |

---

## Qualitaetsbewertung

### Bibliographische Validierung

- DOI-Validierung ueber CrossRef API
- Autoren-Disambiguierung via ORCID
- Journal-Verifikation gegen DOAJ und Beall's List

### Methodische Rigorositaet

**Empirische Studien:** Stichprobengroesse und Repraesentativitaet, Methodentransparenz und Reproduzierbarkeit, Statistische Power und Effektstaerken

**Theoretische Arbeiten:** Konzeptuelle Klarheit, Argumentationslogik, Integration bestehender Literatur

### Alternative Review-Standards

| Standard | Fokus | Anwendung |
|----------|-------|-----------|
| JBI Manual | Pluralistische Evidenz | 13 Checklisten fuer verschiedene Studientypen |
| Cochrane 6.5 | Gesundheitsinterventionen | RoB 2, ROBINS-I |
| ENTREQ | Qualitative Synthesen | 21 Items fuer Reflexivitaet |
| MMAT | Mixed-Methods | 5 studientypspezifische Kriterien |

---

## Zirkularitaet als Feldbedingung

LLMs werden eingesetzt, um Literatur ueber den Einsatz von LLMs zu untersuchen. Feministische AI Literacies sind zugleich Gegenstand des Reviews und Voraussetzung des Workflows. Die Qualitaet des Prompts, der die Deep-Research-Abfrage steuert, haengt von Kompetenzen ab, die im Review selbst erst untersucht werden.

Diese Zirkularitaet ist nicht aufloesbar und wird nicht als methodischer Mangel, sondern als Bedingung des Feldes behandelt. Die Dokumentation dieser Abhaengigkeit im Workflow und im Repository ist die epistemische Infrastruktur, die an die Stelle einer nicht erreichbaren Neutralitaet tritt.

---

## Verzeichnisstruktur

| Verzeichnis | Inhalt | Dateien |
|-------------|--------|---------|
| `pipeline/scripts/` | Python-Scripts | download_zotero_pdfs.py, convert_to_markdown.py, validate_markdown_enhanced.py, postprocess_markdown.py, distill_knowledge.py, generate_vault.py, utils.py |
| `pipeline/tools/` | Browser-Tools | markdown_reviewer.html |
| `pipeline/pdfs/` | Heruntergeladene PDFs | 257 Dateien |
| `pipeline/markdown/` | Konvertierte Dokumente | 252 Dateien |
| `pipeline/markdown_clean/` | Post-Processed Dokumente | Bereinigt |
| `pipeline/validation_reports/` | Validierungsberichte | JSON, CSV, MD Reports |
| `pipeline/knowledge/distilled/` | Destillierte Wissensdokumente | 249 Dateien |
| `pipeline/knowledge/_stage1_json/` | Stage 1 Zwischenergebnisse | JSON |
| `pipeline/knowledge/_verification/` | Verifikationsberichte | JSON |
| `benchmark/config/` | Benchmark-Konfiguration | categories.yaml |
| `benchmark/scripts/` | Benchmark-Scripts | run_llm_assessment, merge, calculate, analyze |
| `benchmark/data/` | Assessment-Daten | human_assessment.csv, llm_assessment_10k.csv, papers_full.csv |
| `benchmark/results/` | Ergebnisse | agreement_metrics.json, disagreements.csv |
| `corpus/` | Korpus-Metadaten | zotero_export.json, papers_metadata.csv, source_tool_mapping.json |
| `deep-research/restored/` | Deep-Research-Artefakte | 4 RIS-Dateien, 3 Raw-Outputs, ris-template.md |

---

## Script-Referenz (alle Scripts)

### Pipeline Scripts (pipeline/scripts/)

| Script | Funktion | Status |
|--------|----------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Getestet |
| `acquire_pdfs.py` | PDF-Akquise mit 4 Fallback-Strategien | Getestet |
| `convert_to_markdown.py` | PDF zu Markdown mit Docling (inkl. Seiten-Marker) | Getestet |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung + PDF-Vergleich | Getestet |
| `postprocess_markdown.py` | Konservative Artefakt-Bereinigung | Getestet |
| `pdf_to_images.py` | PDF-Seiten als Bilder extrahieren (fuer Reviewer) | Getestet |
| `summarize_documents.py` | Dokument-Zusammenfassungen | Getestet |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Abgeschlossen (249 Docs) |
| `validate_knowledge_docs.py` | Knowledge-Dokument-Validierung | Getestet |
| `verify_knowledge_quality.py` | Qualitaetspruefung Knowledge Docs | Abgeschlossen |
| `validate_pipeline.py` | Pipeline-Validierung (End-to-End) | Getestet |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend |
| `generate_docs_data.py` | SPA-Daten generieren (research_vault_v2.json) | Getestet |
| `utils.py` | Zentrale Hilfsfunktionen (Logging, API, Config) | Aktiv |

### Corpus Scripts (corpus/)

| Script | Funktion |
|--------|----------|
| `extract_metadata.py` | Metadaten aus Zotero-Export extrahieren |

### Assessment Scripts

| Script | Funktion |
|--------|----------|
| `assessment/llm-5d/scripts/assess_papers.py` | LLM-basiertes PRISMA-Assessment (5D) |
| `assessment/llm-5d/scripts/write_llm_tags_to_zotero.py` | LLM-Tags in Zotero schreiben |
| `assessment/human/create_thematic_assessment.py` | Excel fuer manuelles Assessment |
| `assessment/human/excel_to_zotero_tags.py` | Excel-Tags in Zotero uebertragen |

---

## Performance & Kosten

### PDF->Markdown Pipeline (2026-02-03)

| Phase | Ergebnis | Dauer |
|-------|----------|-------|
| PDF-Download | 257/326 PDFs | ~10 min |
| Markdown-Konversion | 252/257 (98.1%) | ~45 min |
| Dubletten-Bereinigung | 9 entfernt | - |
| **Finale Dokumente** | **252 Markdown, 257 PDFs** | - |
| Post-Processing | 107k Zeichen bereinigt | ~2 min |

### Human Review (Stichprobe)

| Metrik | Wert |
|--------|------|
| Geprueft | 25/252 (~10%) |
| PASS | 20 (80%) |
| WARN | 4 (16%) |
| FAIL | 1 (4%) |

### Knowledge Distillation (Abgeschlossen)

| Metrik | Wert |
|--------|------|
| Dokumente verarbeitet | 249/252 (98.8%) |
| Verifizierte Qualitaet | 242/249 (97.2% Score >= 75) |
| Kosten (gesamt) | ~$7 |
| API-Calls pro Paper | 2 (Stage 2 lokal) |

### API-Kosten

| Operation | Kosten | Status |
|-----------|--------|--------|
| PDF-Akquise | $0 | Abgeschlossen |
| Markdown-Konversion | $0 | Abgeschlossen |
| Validierung | $0 | Abgeschlossen |
| Post-Processing | $0 | Abgeschlossen |
| 5D LLM-Assessment (325 Papers) | $1.15 | Abgeschlossen |
| Knowledge Distillation (249 Papers) | ~$7.00 | Abgeschlossen |
| 10K LLM-Assessment (326 Papers) | $1.44 | Abgeschlossen |
| **Gesamt** | **~$10.17** | |

**Modell:** Claude Haiku 4.5 ($1.00/MTok Input, $5.00/MTok Output, Preise Stand Feb 2026)

---

## Fehlerbehandlung

### Windows-Encoding

Die Funktion `setup_windows_encoding()` in `utils.py` konfiguriert UTF-8 Encoding fuer Windows-Konsolen.

### HTTP 429 (Rate Limit)

Bei Rate-Limit-Fehlern den Delay zwischen API-Calls erhoehen (Standard: 2 Sekunden, empfohlen: 5 Sekunden).

### Fehlgeschlagene Konvertierungen (5)

- `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
- `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
- `Workers_2025_Generative.pdf` - Not valid

---

## Konfabulations-Dokumentation

Im bisherigen Durchlauf lieferte Deep Research ueberpruefbare Quellen. Dokumentierte Probleme:

| Typ | Beschreibung | Quelle |
|---|---|---|
| Nicht verifizierbarer Eintrag | Ein Deep-Research-Eintrag konnte nicht verifiziert werden | Paper-Text, Abschnitt "LLM-gestuetzter Pfad" |
| PDF-Upstream-Probleme | 5 Dokumente mit korrupten/falschen PDFs (nicht auf Konfabulation zurueckgehend) | `pipeline/knowledge/_verification/` |
| Niedrige Uebereinstimmung | 2 Dokumente mit niedrigem Score bei kurzen Texten (inhaltlich korrekt) | Verifikations-Report |

**Wichtig:** Die Pipeline-Fehler (PDF-Upstream) sind keine Konfabulationen des LLMs, sondern Probleme in der Datenbeschaffung. Der einzige dokumentierte Konfabulations-Fall betrifft die Deep-Research-Phase (Identifikation), nicht die Pipeline-Verarbeitung.

---

## Bekannte Dokumentationsfehler (korrigiert)

| Datei | Fehler | Korrektur | Datum |
|---|---|---|---|
| CLAUDE.md | "8 fallback strategies" | Korrigiert auf 4 (Zotero, DOI, Unpaywall, ArXiv) | 2026-02-18 |
| 03-status.md (alt) | "303 (254 DeepResearch + 49 Human 1 Collection)" | Tatsaechlich 305 in CSV (254 DR + 50 Manual + 1 leer) | 2026-02-14 |

---

*Aktualisiert: 2026-02-21*
