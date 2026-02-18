# Methodik: PRISMA 2020 und Assessment

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

**Hinweis:** Die Deep-Research-Prompts wurden im Oktober 2025 aus dem Repository geloescht. Wiederherstellung aus Git-History vor Einreichung erforderlich (siehe `knowledge/paper-integrity.md`, Abschnitt 3.1).

---

## Human Assessment (10 binaere Kategorien)

### Forschungsfrage

> Inwiefern kommen die Themen oder die Verknuepfung der Bereiche feministische AI Literacies, generative KI / Prompting und Soziale Arbeit in wissenschaftlicher Literatur vor?

### 10 Binaere Kategorien

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

### Inklusions-Logik

Ein Paper wird eingeschlossen, wenn beide Bedingungen erfuellt sind:

1. **Mindestens eine Technik-Dimension:** AI_Literacies ODER Generative_KI ODER Prompting ODER KI_Sonstige
2. **Mindestens eine Sozial-Dimension:** Soziale_Arbeit ODER Bias_Ungleichheit ODER Gender ODER Diversitaet ODER Feministisch ODER Fairness

**Wichtig:** KI_Sonstige wurde in v1.1 zur Inklusions-Logik hinzugefuegt, da algorithmische Systeme im Sozialbereich (z.B. Risikobewertung in der Jugendhilfe) hochrelevant sind.

### Exclusion Reasons

| Code | Beschreibung |
|------|--------------|
| Duplicate | Identische Publikation aus anderem Source_Tool |
| Not_relevant_topic | Thematisch nicht passend |
| Wrong_publication_type | Ungeeigneter Publikationstyp |
| No_full_text | Kein Volltext verfuegbar |
| Language | Sprache nicht zugaenglich |

### Studientypen

- Empirisch
- Experimentell
- Theoretisch
- Konzept
- Literaturreview
- Unclear

---

## Dualer Bewertungspfad: Konzept und Umsetzung

### Epistemische Begruendung

Der duale Bewertungspfad ist das methodische Kernstueck des Workflows. Die Entscheidung fuer den Parallelmodus (nicht sequentiell) ist bewusst: Eine sequentielle Anordnung haette den LLM-Pfad auf eine vorbereitende Funktion begrenzt. Der Parallelmodus ermoeglicht den systematischen Vergleich und macht sichtbar, wo die epistemischen Beitraege konvergieren und wo sie divergieren.

**Dual** bezieht sich auf zwei Merkmale zugleich:
1. Zwei unabhaengige Bewertungsinstanzen (Expert:innen und LLM)
2. Zwei verschiedene epistemische Grundlagen der Bewertung

Beide Pfade arbeiten auf Grundlage der PRISMA-Richtlinien: identische Kriterien bei verschiedenen epistemischen Grundlagen. Die Trennung schuetzt die Expert:innen davor, dass LLM-Ergebnisse ihre eigene Bewertung beeinflussen.

### Expert:innen-Pfad (epistemisch verbindlich)

Wissenschaftler:innen aus der Sozialarbeitsforschung, der Gender- und Diversitaetsforschung sowie der Technikforschung bewerten jede Studie nach 10 binaeren Kategorien. Dieser Pfad ist der epistemisch verbindliche Referenzpfad, weil Verantwortung und Rechenschaftsfaehigkeit nur hier liegen.

**Asymmetrie-Beispiele aus dem Paper:**

| Entscheidungstyp | Beschreibung | Warum LLM das nicht kann |
|---|---|---|
| KI-Definitionsabgrenzung | Undefinierte vs. regelbasierte vs. generative KI | Expert:innen erschliessen aus Kontext, welche KI-Form gemeint ist |
| Interpretatives Mitdenken | "Diversitaet" selten als Begriff, "Intersektionalitaet" haeufiger, "Fairness" mitgemeint | Verwandte Konzepte kontextabhaengig mitzufuehren setzt Feldkenntnis voraus |
| Implizite theoretische Zugehoerigkeit | Paper zu "algorithmic fairness" ohne den Begriff "feministisch", aber mit intersektionalen Gerechtigkeitskategorien | LLM operiert auf Ebene expliziter Muster, Expertin auf Ebene impliziter Zugehoerigkeit |

### LLM-Pfad (zwei Assessment-Systeme)

Der Workflow verwendet zwei LLM-Assessment-Systeme fuer unterschiedliche Aufgaben:

| System | Schema | Skala | Zweck | Status |
|--------|--------|-------|-------|--------|
| **5D** | 5 Relevanz-Dimensionen | Ordinal (0-3) | Exploratives Screening und Priorisierung | Fertig (325/325) |
| **10K** | 10 binaere Kategorien | Ja/Nein | Benchmark gegen Human-Assessment (Cohen's Kappa) | **Fertig (326/326, $1.44, 232 Include, 94 Exclude)** |

**Warum zwei Systeme?** Das 5D-System wurde zuerst entwickelt, um das Korpus parametrisch zu screenen und Relevanz-Cluster zu identifizieren. Das 10K-System wurde spaeter eingefuehrt, als das Human-Assessment-Schema feststand (10 binaere Kategorien). Nur das 10K-System ist direkt mit dem Human-Assessment vergleichbar -- es verwendet das identische Schema. Das 5D-System ist ein eigenstaendiges Screening-Instrument, das andere Fragen beantwortet (Wie relevant ist ein Paper auf 5 Dimensionen?) als das 10K-System (Behandelt ein Paper Kategorie X ja oder nein?).

**Wichtig:** Die beiden Systeme sind **nicht direkt vergleichbar**, da sie unterschiedliche Skalen und unterschiedliche Dimensionen verwenden. Der Benchmark (Cohen's Kappa) basiert ausschliesslich auf dem 10K-System.

---

## LLM Assessment (5 Dimensionen)

Automatisiertes 5-dimensionales Scoring-System:

### Relevanz-Dimensionen (0-3 Skala)

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| AI_Komp | Keine Erwaehnung | Oberflaechlich | Substantiell | Framework-Entwicklung |
| Vulnerable | Keine Erwaehnung | Erwaehnt | Fokus | Intersektional |
| Bias | Keine Erwaehnung | Erwaehnt | Analysiert | Bias-Detection-Studie |
| Praxis | Rein theoretisch | Konzepte | Anwendung | Evaluiertes Tool |
| Prof | Kein Kontext | Allgemein | Human Services | Soziale Arbeit |

### Performance

- 325 Papers in 24 Minuten
- 100% Erfolgsrate
- Kosten: $1.15 (Claude Haiku 4.5)

---

## Multi-Modell-Recherche (Prozess)

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

---

## RIS-Standardisierung

Heterogene Modell-Outputs werden in RIS-Format konvertiert.

**Standard-Felder:** Dokumenttyp (TY), Autoren (AU), Titel (TI), Journal (JO), Volume (VL), Issue (IS), Seiten (SP/EP), Jahr (PY), DOI (DO), Abstract (AB), Keywords (KW)

**Qualitaetssicherung:**
- DOI-Validierung gegen CrossRef-Muster
- Unsichere Angaben mit N1-Note markiert
- Temporaere Konversion via Claude-Projekt

---

## Zotero-Integration

### Import

- Sequenzieller Import der RIS-Dateien
- Modellspezifische Collections (claude_, gemini_, openai_, perplexity_)
- Provenienz-Information bleibt erhalten

### Qualitaetskontrolle

- Duplikaterkennung via Title-Matching und DOI-Vergleich
- Metadaten-Korrektur (ORCID, Journal-Namen)
- PDF-Attachment via Browser-Integration

### Export

- `corpus/zotero_export.json` fuer Pipeline-Input
- Felder: key, itemType, title, creators, date, DOI, url, abstractNote
- `corpus/papers_metadata.csv` fuer Metadaten-Analyse
- `corpus/source_tool_mapping.json` fuer Provenienz-Tracking

---

## Qualitaetsbewertung

### Bibliographische Validierung

- DOI-Validierung ueber CrossRef API
- Autoren-Disambiguierung via ORCID
- Journal-Verifikation gegen DOAJ und Beall's List

### Methodische Rigorositaet

**Empirische Studien:**
- Stichprobengroesse und Repraesentativitaet
- Methodentransparenz und Reproduzierbarkeit
- Statistische Power und Effektstaerken

**Theoretische Arbeiten:**
- Konzeptuelle Klarheit
- Argumentationslogik
- Integration bestehender Literatur

### KI-Output-Validierung

- **Konfabulationserkennung** durch Zitat-Validierung. Terminologie: "Konfabulation" statt "Halluzination", da Halluzination eine Wahrnehmungsstoerung bei vorhandenem Bewusstsein voraussetzt, die bei LLMs nicht vorliegt. Konfabulation beschreibt den Erzeugungsmechanismus praeziser: kohaerente Narrative ohne Taeuschungsabsicht (vgl. Hatem et al. 2023, Sui et al. 2024)
- **Sycophancy-Mitigation** durch negative Constraints in Prompts, Calibration Items und Prompt-Versionierung (Details: `knowledge/epistemic-framework.md`)
- Vergleich der Outputs verschiedener Modelle

### Structured Knowledge Extraction (SKE)

Die dreistufige Verarbeitung von Volltexten zu Wissensdokumenten wechselt bewusst zwischen probabilistischen und deterministischen Stufen:

| Stufe | Typ | Funktion | Konfabulationsrisiko |
|---|---|---|---|
| 1. Extract & Classify | Probabilistisch (LLM) | JSON-Extraktion aus Volltext | Vorhanden |
| 2. Format | Deterministisch (lokal) | Template-Rendering, kein LLM-Call | Null |
| 3. Verify | Probabilistisch mit Pruefauftrag | Verifikation gegen Originaltext | Reduziert (Pruefrole) |

**Epistemische Begruendung:** Die deterministische Stufe 2 unterbricht die probabilistische Kette und stellt sicher, dass die Formatierung reproduzierbar und nicht von statistischen Schwankungen abhaengig ist. Die Verifikation in Stufe 3 nutzt die Asymmetrie zwischen Erzeugung und Pruefung: Die Pruefung bereits erzeugter Ergebnisse ist systematisch einfacher als die Erzeugung neuer korrekter Ergebnisse.

**Was "verifiziert" bedeutet:** Confidence-Score = Completeness (40%) + Correctness (40%) + Category Validation (20%). Score < 75 markiert `needs_correction`. Details: `knowledge/epistemic-framework.md`

---

## Alternative Review-Standards

| Standard | Fokus | Anwendung |
|----------|-------|-----------|
| JBI Manual | Pluralistische Evidenz | 13 Checklisten fuer verschiedene Studientypen |
| Cochrane 6.5 | Gesundheitsinterventionen | RoB 2, ROBINS-I |
| ENTREQ | Qualitative Synthesen | 21 Items fuer Reflexivitaet |
| MMAT | Mixed-Methods | 5 studientypspezifische Kriterien |

---

## Human-LLM Benchmark (Parallel Human-AI Assessment)

Fuer das Forum Wissenschaft Paper wird ein Vergleich zwischen Human- und LLM-Assessment durchgefuehrt. Das Design adaptiert den Benchmarking-Ansatz von Woelfle et al. (2024).

### Referenzliteratur

| Studie | Befund | Relevanz |
|--------|--------|----------|
| Woelfle et al. (2024) | Human IRR: κ = 0.29–0.84 (komplexitaetsabhaengig) | Methodische Vorlage |
| Hanegraaf et al. (2024) | Human IRR in SLRs: κ = 0.77–0.88 | Benchmark-Werte |
| Sandner et al. (2025) | Human-LLM κ ≈ 0.52 ≈ Human-Human κ | Hypothese: LLM weicht nicht staerker ab als Menschen |

**Erwartungshorizont:**
- Human-Human (Susi vs. Sabine): κ ≈ 0.5–0.8 (kategorienabhaengig)
- Human-LLM: κ ≈ 0.3–0.7 (keyword-nahe Kategorien hoeher)

Detaillierte Dokumentation: `knowledge/paper/Referenzliteratur-Benchmark-Design.md`

### Metriken

- **Cohen's Kappa:** Inter-Rater-Reliabilitaet (zufallskorrigiert)
- **Agreement pro Kategorie:** Wo stimmen Human/LLM ueberein?
- **Disagreement-Analyse:** Qualitative Untersuchung der Abweichungen
- **Konfusionsmatrix:** Human × LLM (Include/Exclude)

### Benchmark-Scripts

Scripts in `benchmark/scripts/`:

| Script | Funktion | Status |
|--------|----------|--------|
| `generate_papers_csv.py` | Zotero JSON -> papers_full.csv | Fertig |
| `run_llm_assessment.py` | LLM-Assessment mit YAML-Schema | Fertig (326/326, $1.44) |
| `merge_assessments.py` | Human + LLM zusammenfuehren | Fertig (304 Papers, 210 mit Decision) |
| `calculate_agreement.py` | Cohen's Kappa berechnen | Fertig (Decision κ = 0,035) |
| `analyze_disagreements.py` | Qualitative Analyse | Fertig (111 Disagreements) |

Konfiguration: `benchmark/config/categories.yaml` (10 Kategorien, synchron mit Human-Assessment)

### Benchmark-Pipeline (Datenfluss)

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

### Ergebnis-Uebersicht

| Metrik | V1 (50 Papers) | V2 (50 Papers) | Volllauf v2.1 (326 Papers) |
|--------|----------------|----------------|---------------------------|
| Inkonsistenzen | 20% | 6% | -- |
| Feministisch erkannt | 0 | 8 | 48 (29,6 %) |
| Include | -- | -- | 232 (71.2%) |
| Exclude | -- | -- | 94 (28.8%) |

**Volllauf:** `benchmark/data/llm_assessment_10k.csv` (326/326, $1.44, Prompt v2.1)

### Benchmark-Ergebnisse (Abgeschlossen)

| Metrik | Wert | Interpretation |
|--------|------|----------------|
| Benchmark-Basis | 210 Papers (mit beiden Assessments + Decision) | -- |
| Decision: Gesamtuebereinstimmung | 47,1 % | -- |
| Decision: Cohen's Kappa | 0,035 | "slight" |
| Mittlere Kategorie-Uebereinstimmung | 53,8 % | -- |
| LLM Include-Rate | 71,2 % | vs. Human 42 % |
| Disagreements | 111 (davon 78 LLM-Include/Human-Exclude) | -- |

**Interpretation:** Der Kappa-Wert quantifiziert die epistemische Asymmetrie: LLM und Expert:innen operieren auf verschiedenen Wissensbasen. Die Divergenz ist methodisch informationshaltig -- sie zeigt, wo keyword-basierte Musterkennung und disziplinaeres Kontextwissen auseinanderfallen. Beste Kategorie: Feministisch (κ = +0,075). Schlechteste: Fairness (κ = -0,163). Vollstaendige Ergebnisse: `benchmark/results/agreement_metrics.json`.

---

## Referenzen

- Woelfle, T., et al. (2024). Benchmarking Human–AI collaboration for common evidence appraisal tools. *Journal of Clinical Epidemiology*, 175, 111533.
- Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing. *BMJ Open*, 14, e076912.
- Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening. Konferenzpraesentation (OSSYM).

---

## End-to-End-Workflow (Uebersicht)

Alle Pipeline-Scripts liegen in `pipeline/scripts/`, sind unabhaengige CLI-Tools (`argparse`) und kommunizieren ueber das Dateisystem. Gemeinsame Funktionen stellt `utils.py` bereit, Konfiguration laedt `config/defaults.yaml`.

| Phase | Script / Tool | Input -> Output | Status |
|---|---|---|---|
| 1. Identifikation | Deep Research (4 Modelle) + manuell | -> `corpus/zotero_export.json` (326 Papers) | Fertig |
| 2. PDF-Akquise | `acquire_pdfs.py` | `zotero_export.json` -> `pipeline/pdfs/` (257) | Fertig |
| 3. Konversion | `convert_to_markdown.py` | `pipeline/pdfs/` -> `pipeline/markdown/` (252) | Fertig |
| 4. Post-Processing | `postprocess_markdown.py` | `pipeline/markdown/` -> `pipeline/markdown_clean/` | Fertig |
| 5. Human Review | `markdown_reviewer.html` | Stichprobe ~10% (25/252 geprueft) | Fertig |
| 6. Knowledge Distillation | `distill_knowledge.py` | `pipeline/markdown/` -> `pipeline/knowledge/distilled/` (249) | Fertig |
| 7. Qualitaetspruefung | `verify_knowledge_quality.py` | 242/249 perfekt (97.2%) | Fertig |
| 8. Assessment (dual) | Human (Google Sheets) + LLM 10K | 210 Papers mit beiden Assessments | Fertig |
| 9. Benchmark | `merge_assessments.py` + `calculate_agreement.py` | Decision κ = 0,035, 111 Disagreements | Fertig |
| 10. Vault | `generate_vault.py` | `pipeline/knowledge/distilled/` -> `vault/` | Wartet |

Detaillierte technische Dokumentation: `knowledge/technical.md`

---

## Zirkularitaet als Feldbedingung

LLMs werden eingesetzt, um Literatur ueber den Einsatz von LLMs zu untersuchen. Feministische AI Literacies sind zugleich Gegenstand des Reviews und Voraussetzung des Workflows. Die Qualitaet des Prompts, der die Deep-Research-Abfrage steuert, haengt von Kompetenzen ab, die im Review selbst erst untersucht werden.

Diese Zirkularitaet ist nicht aufloesbar und wird nicht als methodischer Mangel, sondern als Bedingung des Feldes behandelt. Die Dokumentation dieser Abhaengigkeit im Workflow und im Repository ist die epistemische Infrastruktur, die an die Stelle einer nicht erreichbaren Neutralitaet tritt.

---

*Aktualisiert: 2026-02-18*
