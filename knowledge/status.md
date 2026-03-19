# Status (2026-03-19)

## Aktueller Fokus: Evidence Companion finalisieren (M12)

M1-M11 abgeschlossen. M11 (Promptotyping) archiviert -- Richtungswechsel zu Evidence Companion.
Naechste Schritte: Wissensnetz-View, Bewertungsvergleich-Tab, Merge zu main.

---

## Meilenstein-Plan (bis 4. Mai 2026)

### M1: Knowledge-Konsolidierung -- ABGESCHLOSSEN

- [x] Dateien umbenannt (Nummern-Praefixe entfernt)
- [x] Redundanzen eliminiert (PAPER_VS_REPO.md, WORKFLOW.md, index.md)
- [x] CLAUDE.md korrigiert
- [x] Alle Querverweise aktualisiert
- Commit: `ff558e2`

### M2: Epistemische Infrastruktur als Leitkonzept -- ABGESCHLOSSEN

- [x] Epistemische Infrastruktur als Leitkonzept etabliert
- [x] Theoretischer Rahmen dokumentiert (project.md)
- Commit: `d7d4557`

### M3: Deep-Research-Prompts restaurieren -- ABGESCHLOSSEN

- [x] Prompt-Template aus Git-History (`knowledge/Operativ.md`) in `prompts/deep-research-template.md` wiederherstellen
- [x] Rekonstruierte Parametrisierung dokumentieren (was bekannt, was verloren)
- Commit: (siehe Git-Log)

### M4: Korpus-Bereinigung (326 vs 305) -- ABGESCHLOSSEN

- [x] HA-CSV mit aktuellem Zotero-Export abgleichen (292 gemeinsam, 34 nur Zotero, 13 nur HA)
- [x] Duplikate markieren (95 gesamt: 76 Titel-basiert in Zotero + 60 in HA, Ueberlappung)
- [x] `papers_full.csv` generiert (326 Zeilen, Has_HA-Spalte fuer Mapping)
- [x] Generator-Script: `benchmark/scripts/generate_papers_csv.py`
- Benchmark-Basis: 326 Papers, Schnittmenge mit HA fuer Kappa-Berechnung
- Commit: (siehe Git-Log)

### M5: 10K LLM Assessment ausfuehren -- ABGESCHLOSSEN

- [x] `assessment_prompt.md` mit Code synchronisieren (3 Inkonsistenzen behoben: Rolle, KI_Sonstige, negative Constraints)
- [x] Beispiele fuer alle 10 Kategorien in `categories.yaml` ergaenzt (v1.2)
- [x] Assessment ausgefuehrt: 326/326 Papers, ~$1.44, Haiku 4.5
- [x] Ergebnis: `benchmark/data/llm_assessment_10k.csv` (232 Include, 94 Exclude)
- Commit: (siehe Git-Log)

### M6: Teilmengen-Benchmark ausfuehren -- ABGESCHLOSSEN

- [x] Human Assessment CSV exportiert (`benchmark/data/human_assessment.csv`, 304 Papers, 210 mit Decision)
- [x] `merge_assessments.py` ausgefuehrt: 304 Papers mit beiden Assessments, 22 LLM-only
- [x] `calculate_agreement.py` ausgefuehrt: Cohen's Kappa berechnet
- [x] `analyze_disagreements.py` ausgefuehrt: 111 Disagreements identifiziert
- [x] Ergebnisse in `benchmark/results/` dokumentiert
- Commit: `07c4ac6`

**Kernergebnisse (primaere Metriken: Konfusionsmatrix + Basisraten):**

| Metrik | Wert | Interpretation |
|--------|------|----------------|
| Papers mit beiden Assessments | 210 (mit Decision) | Benchmark-Basis |
| **LLM Include-Rate** | **68 % (143/210)** | vs. Human 42 % |
| **Human Include-Rate** | **42 % (88/210)** | Differenz: 26 Prozentpunkte |
| Disagreements gesamt | 111 | 78 LLM-Include/Human-Exclude |
| Cohen's Kappa (Vergleichsanker) | 0,035 | Eingeschraenkte Aussagekraft (Prevalence-Bias-Paradox) |

**Konfusionsmatrix:**

```
                    LLM Include    LLM Exclude
Human Include           65              23
Human Exclude           78              34
```

**Kategoriespezifische Divergenz (Basisraten + Kappa als Vergleichswert):**

| Kategorie | Human Ja | LLM Ja | Differenz | Richtung | Kappa |
|-----------|----------|--------|-----------|----------|-------|
| Gender | 63,2 % | 36,2 % | -27pp | LLM unterschaetzt | -0,098 |
| Fairness | 52,5 % | 73,5 % | +21pp | LLM ueberschaetzt | -0,163 |
| Soziale_Arbeit | 24,4 % | 7,3 % | -17pp | LLM unterschaetzt | -0,083 |
| KI_Sonstige | 66,3 % | 47,2 % | -19pp | LLM unterschaetzt | +0,048 |
| Feministisch | 22,2 % | 29,6 % | +7pp | Aehnlich | +0,075 |
| Bias_Ungleichheit | 79,8 % | 76,7 % | -3pp | Aehnlich | -0,097 |
| Diversitaet | -- | -- | -- | -- | +0,024 |
| Prompting | -- | -- | -- | -- | -0,066 |
| AI_Literacies | -- | -- | -- | -- | -0,018 |
| Generative_KI | -- | -- | -- | -- | -0,004 |

**Interpretation:** Die Konfusionsmatrix zeigt das asymmetrische Divergenzmuster: 78 Faelle LLM-Include/Human-Exclude gegenueber nur 23 in umgekehrter Richtung. Die Basisraten-Differenz (26 Prozentpunkte) verweist auf fundamental verschiedene Operationsweisen. Cohen's Kappa (0,035) ist primaer ein Artefakt des Prevalence-Bias-Paradoxes (Byrt et al. 1993): Bei stark unterschiedlichen Basisraten kollabiert Kappa, unabhaengig von der Bewertungsqualitaet. Die inhaltliche Analyse stuetzt sich daher auf Konfusionsmatrix, Basisraten und die qualitative Disagreement-Analyse.

**Prevalence-Bias-Analyse (Byrt et al. 1993, Feinstein & Cicchetti 1990):**

Cohen's Kappa ist durch den Prevalence-Bias-Paradox eingeschraenkt: Bei 26 Prozentpunkten Basisraten-Differenz (LLM 68% vs. Human 42% Include) kollabiert Kappa auf 0,035. Der Wert reflektiert primaer die Schwellenwert-Differenz, nicht die inhaltliche Uebereinstimmung. Die Referenzliteratur (Woelfle, Hanegraaf, Sandner) verwendet Kappa fuer Human-Human-Vergleiche, wo Basisraten aehnlich sind. Fuer Human-LLM-Vergleiche mit systematischer Basisraten-Divergenz ist Kappa als primaerer Indikator irrefuehrend. Primaere Metriken sind daher Konfusionsmatrix und Basisraten.

**Divergenz-Muster (qualitative Analyse, 111 Disagreements):**

| Muster | Anteil | Beispiel |
|--------|--------|----------|
| Semantische Expansion | 81% (90 Faelle) | van Toorn et al. (2024): LLM weist "Fairness = Ja" zu, obwohl algorithmische Fairness-Metriken nicht thematisiert werden. LLM expandiert "Fairness" auf alle Gleichbehandlungsfragen. |
| Keyword-Inklusion | 11% (12 Faelle) | Meilvang & Dahler (2024): LLM vergibt 5 positive Kategorien basierend auf thematischer Oberflaechenstruktur. Expert:innen schliessen aus: Kontext ist Verwaltungsinformatik, nicht sozialarbeiterische Praxis. |
| Implizite Feldzugehoerigkeit | 8% (9 Faelle) | Pinski & Benlian (2024): Expert:innen klassifizieren "Gender = Ja", weil AI Literacy Frameworks historisch genderblind konstruiert sind. LLM liest "Gender" an expliziten Begriffsmarken fest. |

**Epistemische Marker:** LLM-Unterstuetzung ist am hoechsten, wo Kategorien durch explizite Fachterminologie abgegrenzt sind ("Feministisch", kappa = +0,075); am niedrigsten, wo semantische Expansion verhindert werden muss ("Fairness", kappa = -0,163) oder implizites Feldwissen erforderlich ist ("Gender", kappa = -0,098).

### M7: Benchmark-Ergebnisse dokumentieren -- ABGESCHLOSSEN

- [x] Benchmark-Metriken dokumentiert (Konfusionsmatrix, Basisraten, Kategorie-Kappas)
- [x] Divergenz-Analyse: 3 Muster mit konkreten Beispielen
- [x] Jagged-Frontier-Konzept (Mollick) integriert
- Commit: (siehe Git-Log)

### M9 (Nice-to-Have): Vault + GitHub Pages

- [x] Statische GitHub-Pages-Seite fuer Wissensexploration -- **UMGESETZT**
  - `docs/` SPA rebuilt: 4-Tab-Layout (Papers, Benchmark, Dashboard, Graph)
  - Daten-Pipeline: `pipeline/scripts/generate_docs_data.py` -> `docs/data/research_vault_v2.json`
  - Bugfix: Observable Plot durch Chart.js ersetzt (Commit `d22a22f`)
  - Logging verbessert: kompaktes grouped init summary, Filter/Tab/Benchmark state (Commit `1f3092b`)
  - Commits: `5d8bd36`, `d22a22f`, `1f3092b`
  - GitHub Pages aktiviert: https://chpollin.github.io/FemPrompt_SozArb/
- [x] Visualisierungen umgebaut: epistemisches Framing (Commit `bb258f6`)
  - Divergenz-Scatter (Bug-Fix: Achsen 0-100%, Diagonale korrekt)
  - Slope Chart ersetzt Radar (10 Linien, Steigung = epistemische Divergenz)
  - Overlap-Treemap (additives Framing, Klick filtert Papers-Tab)
  - Coverage Map (LLM=326 vs. Human=210)
- [x] Vault-Building (Obsidian): `pipeline/scripts/generate_vault.py` mit Assessment-Integration
  - 249 Papers, 205 mit Assessment-Daten (LLM + Human), 79 Concept Notes
  - YAML-Frontmatter: llm_decision, human_decision, llm_categories, human_categories, agreement
  - ZIP fuer Download: `docs/downloads/vault.zip`
- Abhaengigkeit: M6 (Assessment-Daten) -- erledigt

### M10: Research-Promptotyping-Interface v1 -- ERSETZT DURCH M11

- [x] v1: 5-Schritte-Dashboard (Trichter, Prozess-Diagramme, Statistiken) -- `bb147c0`
- Erkenntnis: Dashboard *beschreibt* den Prozess, macht ihn aber nicht *navigierbar*
- Ersetzt durch M11 (Promptotyping v2)

### M11: Promptotyping v2 -- UMGESETZT

- [x] Konzeptdokument: `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` (Promptotyping als epistemische Praxis)
- [x] Phase 1: Vault v2 Generator (`scripts/generate_vault_v2.py`, ~1660 Zeilen)
  - LLM-basierte Konzept-Extraktion: 249 Papers -> 136 konsolidierte Konzepte (Freq >= 2)
  - LLM-basierte Divergenz-Klassifikation: 111 Faelle -> 3 Muster (81% Semantisch, 11% Keyword, 8% Implizit)
  - 5-Strategie-Titel-Matching: 237/249 (vs. 226/249 in v1)
  - 4 Vault-Dokumenttypen: Papers (248), Concepts (136), Pipeline (5), Divergenzen (111)
  - LLM-Caching in `.vault_cache/` (reproduzierbar ohne erneute API-Calls)
  - LLM-Kosten: ~$1 (Haiku 4.5)
- [x] Phase 2: Datengenerator (`scripts/generate_promptotyping_data_v2.py`, ~580 Zeilen)
  - Reine Datentransformation (kein LLM)
  - Output: `docs/data/promptotyping_v2.json` (1.0 MB)
  - 249 Paper-Journeys, 136 Konzept-Nodes, 79 Co-Occurrence-Edges, 111 Divergenzen
  - **v2.1:** Featured Papers (3 handverlesen), Konzept-Cluster (Technik/Sozial/Bridge), Pattern-Distribution in Meta
- [x] Phase 3: Web-Interface (5 Views, Neubau)
  - View 0: **Landing** -- Leitfrage, 3 Kennzahlen, 3 Featured Papers als Einstiegspunkte
  - View 1: Pipeline-Durchlicht (D3 Sankey) -- 326 Papers durch 5 Stufen, Stufen-Detail mit Stance-Sektionen
  - View 2: Paper Journey -- Featured-Picks + Suche, horizontale Timeline mit Stance-Indicators, 3-Sektionen-Detail
  - View 3: Konzept-Explorer (D3 Force Graph) -- Cluster-Farben (Technik/Sozial/Bridge), Divergenz-Ring-Overlay, Legende
  - View 4: Divergenz-Navigator -- Exemplarische Faelle, Narrative Cards mit Justification, enriched Detail mit Knowledge-Summary
  - Cross-View-Navigation: Konzept-Klick -> Explorer, Paper-Klick -> Journey, Divergenz -> Journey
- [x] **Epistemische Haltungen durchgehend:** Jede Detail-Ansicht hat Stance-Sektionen (blau=Ergebnis, gruen=Prozess, orange=Grenze)
- [x] Design: CSS-Variablen aus `research.css`, `pt-*` Namespace, responsive (768px Breakpoint)
- [x] CDN-Dependencies: D3 v7.9.0, d3-sankey v0.12.3, Chart.js 4.4.0, FontAwesome 6.5.1
- [x] Vault ZIP: `docs/downloads/vault.zip` (1.1 MB, 505 Dateien)
- Branch: `FemPrompt_SozArb_promptotyping-interface`, Commits: `3476437` (v2), `963c08d` (v2.1)
- **Status: ARCHIVIERT** -- Promptotyping-Interface wird nicht weiterentwickelt. Ersetzt durch M12 (Evidence Companion).
- Erkenntnis: Promptotyping ging ueber das Paper-Versprechen hinaus. Das Paper referenziert eine "publizierte Wissensumgebung" -- das ist das Research Dashboard, nicht Promptotyping.

### M12: Evidence Companion -- IN ARBEIT

Komplettes Redesign des Research-Frontends (`docs/index.html`) als akademische Begleitpublikation zum Paper.

**Entscheidung (2026-03-19):** Promptotyping-Interface entfernen. Ein einziges Frontend: Evidence Companion.

- [x] Phase A: Redesign (Typographie, Farben, Layout)
  - IBM Plex Serif fuer Headings, Inter fuer Body (16px)
  - Weisser Header statt dunkler Block, Autoren-Zeile
  - Einleitungstext statt KPI-Stats-Bar
  - Spektrum-Farbsystem: 10 Kategorien als genderneutrale Farbskala
  - Kategorien gruppiert als "Gegenstand" (4 KI-Kategorien) und "Perspektive" (6 Sozial-Kategorien)
- [x] Phase B: Tabelle statt Cards
  - Sortierbare Tabelle mit 7 Spalten (Titel, Autor, Jahr, LLM, Human, Status, Kategorien)
  - Farbcodierte Kategorie-Punkte (Spektrum-Farben identisch in Chips und Tabelle)
  - Pagination (50 pro Seite)
  - Default-Sortierung: Include zuerst
- [x] Phase C: Detail-Panel
  - Seitenpanel (slide-in von rechts) statt Modal
  - Assessment-Vergleich (LLM vs. Expert:innen) side-by-side mit Spektrum-Farben
  - DOI-Link, Quell-URL, Knowledge-Doc-Download
  - Prev/Next Navigation
  - LLM-Begruendung sichtbar
- [x] Phase D: Bereinigung
  - LLM-Confidence komplett entfernt (keine valide Metrik)
  - Dashboard-Tab (6 Charts) entfernt
  - Network-Graph-Tab entfernt
  - vis-network und D3 CDN-Imports entfernt
  - Datengenerator erweitert: 300 Papers (249 full + 51 thin), DOI/URL, Knowledge-Sektionen
- [ ] Phase E: Wissensnetz-View (geplant)
  - Konzept-Graph (136 Nodes) als dritter Tab
  - Ego-Netzwerk-Pattern: Klick auf Konzept zeigt Nachbarn + Papers
  - Inspiriert von Cosma (cosma.arthurperret.fr)
- [ ] Phase F: Bewertungsvergleich-Tab (geplant)
  - Konfusionsmatrix, Slope Chart, Divergenz-Tabelle
  - Aus bestehendem features.js Code
- [ ] Merge zu main

Commits: `1d54c46` (Redesign), `895d791` (Detail-Panel), `a7703e4` (Confidence entfernt)

---

## Untersuchungsergebnisse (2026-02-18)

### 21 fehlende Papers: Temporale Divergenz

Die HA-CSV wurde aus einem aelteren Zotero-Snapshot generiert. Seitdem hat sich die Bibliothek in beide Richtungen veraendert:

| | Anzahl |
|---|---|
| In beiden vorhanden | 292 |
| Nur in Zotero (neu hinzugefuegt) | 34 |
| Nur in HA (spaeter geloescht) | 13 |
| Netto-Differenz | 21 |

**Muster:** 30 der 34 Zotero-only-Papers haben keine Collection-Zugehoerigkeit (Bulk-Import nach HA-Erstellung). 6 der 34 sind Duplikate von Papers, die bereits in HA unter anderem Key existieren.

**Empfehlung:** HA mit aktuellem Zotero-Export neu synchronisieren, bestehende Bewertungen ueber DOI/Titel-Matching uebernehmen.

### Deep-Research-Prompts: Teilweise rekonstruierbar

**Gefunden:**
- Parametrisches Prompt-Template (5-Komponenten-Struktur: Rolle, Aufgabe, Kontext, Analyseschritte, Output-Format) in Git-History (`knowledge/Operativ.md`, Commit `0a98f49`)
- 3 von 4 Raw-Outputs (Claude, Gemini, Perplexity) in `deep-research/restored/`
- Alle 4 RIS-Dateien
- Meiste Placeholder-Werte rekonstruierbar

**Verloren:**
- Der exakt instanziierte Prompt-Text (wie er in die 4 Modelle eingefuegt wurde)
- Einige Placeholder-Werte (Autorenliste, spezifische Kompetenzen, Region)
- OpenAI/ChatGPT Raw-Output (war nur als binaere PDF committed)

**Status:** Template rekonstruiert (`prompts/deep-research-template.md`), instanziierter Prompt nicht persistent gespeichert.

### 10K Assessment-Prompt: Funktionsbereit

**Staerken:**
- Alle 10 Kategorien stimmen exakt mit Knowledge-Doc-Frontmatter ueberein
- Negative Constraints gegen Sycophancy implementiert
- Inklusions-Logik korrekt (TECHNIK_OK AND SOZIAL_OK)
- Neutrale Rollen-Beschreibung

**Schwaechen:**
- `assessment_prompt.md` (Doku) veraltet vs. tatsaechlicher Code-Prompt
- Keine Calibration Items implementiert (empfohlen, nicht Blocker)
- Keine Retry-Logik fuer API-Fehler
- 4 von 10 Kategorien ohne Positiv/Negativ-Beispiele

**Urteil:** Kann so ausgefuehrt werden. Doku-Sync und optionale Calibration Items sind empfohlen.

---

## Assessment

**Ein Korpus (326 Papers), zwei Assessment-Tracks:**

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | 210/326 mit Decision |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig (325/325) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | **Fertig (326/326)** |

### Human Assessment

| Aspekt | Stand |
|--------|-------|
| Papers in CSV | 305 (292 auch in aktuellem Zotero, 13 nur in HA) |
| Decisions getroffen | 210/326 mit Decision |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Bearbeiter | Susi Sackl-Sharif (aktiv), Sabine Klinger (spaeter) |

### LLM Assessment (5 Dimensionen - abgeschlossen)

| Aspekt | Stand |
|--------|-------|
| Papers bewertet | 325/325 (100% Erfolgsrate) |
| Ergebnis | 222 Include, 83 Exclude, 20 Unclear |
| Kosten | $1.15 |
| Output | `assessment/llm-5d/output/assessment_llm.xlsx` |

### LLM Assessment (10 Kategorien - abgeschlossen)

| Aspekt | Stand |
|--------|-------|
| Script | `benchmark/scripts/run_llm_assessment.py` |
| Prompt-Status | Code-Prompt und Doku synchronisiert (v2.1) |
| Tatsaechliche Kosten | $1.44 |
| Status | **Fertig** -- 326/326 Papers, 232 Include, 94 Exclude |
| Output | `benchmark/data/llm_assessment_10k.csv` |

---

## Pipeline

### PDF-Akquise und Konvertierung (Fertig)

| Phase | Ergebnis |
|-------|----------|
| PDFs gesamt | 257/326 (78.8%) |
| Markdown-Konversion | 252/257 (98.1%) |
| Markdown bereinigt | 232/252 (markdown_clean/) |
| Fehlgeschlagen | 5 (korrupte PDFs) |
| Dubletten entfernt | 9 |
| Quality-Score (Durchschnitt) | 93.1/100 |

### Post-Processing (Fertig)

| Operation | Anzahl |
|-----------|--------|
| Silbentrennungen korrigiert | 230 |
| Seitenzahlen entfernt | 341 |
| Header-Wiederholungen entfernt | 2,263 |
| Zeichen insgesamt entfernt | 107,545 |

### Knowledge Distillation (Fertig + Verifiziert)

| Aspekt | Stand |
|--------|-------|
| Verarbeitete Dokumente | 249/252 (98.8%) |
| Verifizierte Qualitaet | 242/249 perfekt (97.2%) |
| API-Kosten | ~$7 (gesamt) |
| Output | `pipeline/knowledge/distilled/` |

---

---

## Offene Punkte

- [x] Dubletten bereinigen (9 entfernt)
- [x] Seiten-Alignment im Review-Tool implementieren
- [x] 32 fehlende PDFs integriert
- [x] Knowledge Distillation (249 Dokumente)
- [x] Knowledge-Doc Verifikation (97.2% perfekt)
- [x] Repository-Bereinigung (analysis/, pipeline/summaries/, Redundanzen)
- [x] Knowledge-Base konsolidieren (Dateien umbenannt, Redundanzen eliminiert)
- [x] 21 fehlende Papers untersucht (temporale Divergenz, 6 Duplikate identifiziert)
- [x] Deep-Research-Prompts untersucht (Template in Git-History, instanziierter Prompt verloren)
- [x] 10K Assessment-Prompt geprueft und synchronisiert (3 Inkonsistenzen behoben, v2.1)
- [x] Deep-Research-Prompt-Template im Repo wiederhergestellt (`prompts/deep-research-template.md`)
- [x] Korpus-CSV generiert (`benchmark/data/papers_full.csv`, 326 Zeilen, Is_Duplicate + Has_HA Flags)
- [x] 10K LLM Assessment ausgefuehrt (326/326, $1.44, `benchmark/data/llm_assessment_10k.csv`)
- [x] Assessment-Ordner restrukturiert (`assessment/human/`, `assessment/llm-5d/`, Altdateien in `benchmark/` bereinigt)
- [x] **Google Sheets Export** (Human Assessment CSV, 304 Papers, 210 mit Decision)
- [x] Teilmengen-Benchmark ausgefuehrt (merge + kappa + disagreements, κ = 0,035)
- [x] Vault-Building (Obsidian) mit Assessment-Integration + GitHub Pages aktiviert

---

## Selektions-Audit

### Provider-Verteilung (aus `human_assessment.csv`, 305 Papers)

| Provider | Papers | Anteil (DR) | DOI verfuegbar |
|----------|--------|-------------|----------------|
| Perplexity | 75 | 29.5% | 22 (29%) |
| Claude | 63 | 24.8% | 37 (59%) |
| ChatGPT | 62 | 24.4% | 42 (68%) |
| Gemini | 54 | 21.3% | 22 (41%) |
| **Deep Research gesamt** | **254** | **100%** | **123 (48%)** |
| Manual (ergaenzend) | 50 | -- | 40 (80%) |
| **Gesamt** | **305** | -- | **163 (53%)** |

**Befund DOI-Verfuegbarkeit:** Manuelle Recherche liefert deutlich hoehere DOI-Raten (80%) als Deep Research (48%). Perplexity hat die niedrigste DOI-Rate (29%), was auf mehr graue Literatur hindeutet.

### Publikationstypen

| Typ | Anzahl | Anteil |
|-----|--------|--------|
| journalArticle | 182 | 59.7% |
| report | 60 | 19.7% |
| conferencePaper | 42 | 13.8% |
| bookSection | 9 | 3.0% |
| book | 6 | 2.0% |
| webpage | 4 | 1.3% |
| thesis | 1 | 0.3% |

### Overlap-Analyse (aus RIS-Dateien, 34 Papers)

Die RIS-Dateien in `deep-research/restored/` decken 34 von 254 Deep-Research-Papers ab (13.4%). Fuer diese Stichprobe:

| Metrik | Wert |
|--------|------|
| Total unique Papers in RIS | 32 |
| Davon nur von 1 Provider gefunden | 30 (93.8%) |
| Davon von 2+ Providern gefunden | 2 (6.2%) |
| **Overlap-Rate** | **6.2%** |

**Einschraenkung:** Diese Zahlen gelten nur fuer die 34 Papers der ersten RIS-Runde. Eine Gesamt-Overlap-Analyse auf Korpus-Ebene ist mit den vorhandenen Daten nicht moeglich, da `human_assessment.csv` jedes Paper nur einem einzigen Provider zuordnet.

### Missingness-Indikatoren

| Indikator | Wert |
|-----------|------|
| PDF-Beschaffungsrate | 257/326 (79%) |
| Nicht beschaffbar | 69/326 (21%) -- primaer Paywall |
| Markdown-Konversionsrate | 252/257 (98%) |
| Knowledge-Doc-Rate | 249/252 (99%) |
| **Gesamte Verlustrate** (Zotero -> Knowledge Doc) | 77/326 (23.6%) |

### Ausstehend

- [ ] OA-Analyse: Open-Access-Status der 326 Papers via Unpaywall-API (DOI-basiert, daher nur fuer 53% moeglich)
- [ ] Gesamt-Overlap: Nicht berechenbar mit vorhandenen Daten (s.o.)

---

## Fehlgeschlagene PDF-Konvertierungen (5)

1. `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
2. `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
3. `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
4. `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
5. `Workers_2025_Generative.pdf` - Not valid

---

*Aktualisiert: 2026-03-19*
