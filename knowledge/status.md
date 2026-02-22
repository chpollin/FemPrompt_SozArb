# Status (2026-02-18)

## Aktueller Fokus: Paper fertigstellen (M8)

M1-M7 abgeschlossen. Paper v0.4: 17.975 Zeichen (Limit: 18.000). Alle Abschnitte ausgeschrieben -- Jagged-Frontier-Konzept, qualitative Disagreement-Beispiele, didaktische Einschuebe fuer Nicht-KI-Zielgruppe. Naechster Schritt: Review-Runde mit Co-Autor:innen (Susi, Sabine, Christian).

---

## Meilenstein-Plan (bis 4. Mai 2026)

### M1: Knowledge-Konsolidierung -- ABGESCHLOSSEN

- [x] Dateien umbenannt (Nummern-Praefixe entfernt)
- [x] Redundanzen eliminiert (PAPER_VS_REPO.md, WORKFLOW.md, index.md)
- [x] CLAUDE.md korrigiert
- [x] Alle Querverweise aktualisiert
- Commit: `ff558e2`

### M2: Paper im Repo -- ABGESCHLOSSEN

- [x] `knowledge/paper/paper-draft.md` als Single Source of Truth
- [x] Epistemische Infrastruktur als Leitkonzept
- [x] 7 Abschnitte, 13 Fussnoten, Platzhalter fuer Ergebnisse
- Commit: `d7d4557`

### M3: Deep-Research-Prompts restaurieren -- ABGESCHLOSSEN

- [x] Prompt-Template aus Git-History (`knowledge/Operativ.md`) in `prompts/deep-research-template.md` wiederherstellen
- [x] Rekonstruierte Parametrisierung dokumentieren (was bekannt, was verloren)
- [x] Paper-Behauptung korrigieren ("im Repository dokumentiert" -> ehrliche Formulierung)
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

**Interpretation:** Die Konfusionsmatrix zeigt das asymmetrische Divergenzmuster: 78 Faelle LLM-Include/Human-Exclude gegenueber nur 23 in umgekehrter Richtung. Die Basisraten-Differenz (26 Prozentpunkte) verweist auf fundamental verschiedene Operationsweisen. Cohen's Kappa (0,035) ist primaer ein Artefakt des Prevalence-Bias-Paradoxes (Byrt et al. 1993): Bei stark unterschiedlichen Basisraten kollabiert Kappa, unabhaengig von der Bewertungsqualitaet. Die inhaltliche Analyse stuetzt sich daher auf Konfusionsmatrix, Basisraten und die qualitative Disagreement-Analyse. Details: `ANALYSIS_SESSION_2026-02-22.md`, Abschnitt 2.

### M7: Ergebnisse ins Paper einarbeiten -- ABGESCHLOSSEN

- [x] Benchmark-Metriken in Abschnitt 5 einfuegen
- [x] Divergenz-Analyse schreiben (3 Muster mit konkreten Paper-Beispielen)
- [x] Epistemische Marker beschreiben
- [x] Jagged-Frontier-Konzept (Mollick) in Abschnitt 2 integriert
- [x] Didaktische Einschuebe fuer Nicht-KI-Zielgruppe
- [x] Zeichenzaehlung: 17.975 Zeichen (Limit 18.000, Differenz +25)
- Commit: (diese Session)

### M8: Paper finalisieren + einreichen

- [ ] Review-Runde mit Co-Autor:innen
- [ ] Auf 18.000 Zeichen bringen
- [ ] Fussnoten finalisieren (max. 15)
- [ ] Einreichung 4. Mai 2026
- Abhaengigkeit: M7

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

**Konsequenz fuer Paper:** Die Behauptung "im Repository dokumentiert" muss korrigiert werden. Ehrliche Formulierung: Template rekonstruiert, instanziierter Prompt nicht persistent gespeichert.

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

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen (inkl. Leerzeichen, inkl. Fussnoten) |
| Fokus | Epistemische Infrastruktur fuer LLM-gestuetzte Literature Reviews |
| **Paper-Datei** | **`knowledge/paper/paper-draft.md`** (Single Source of Truth) |
| Leitkonzept | Epistemische Asymmetrie + Epistemische Infrastruktur |
| Abgleich Paper vs. Repo | `knowledge/paper-integrity.md` |

**Hinweis:** Das Paper wird ausschliesslich im Repo iteriert. Google Docs ist nicht mehr relevant.

---

## Offene Punkte

- [x] Dubletten bereinigen (9 entfernt)
- [x] Seiten-Alignment im Review-Tool implementieren
- [x] 32 fehlende PDFs integriert
- [x] Knowledge Distillation (249 Dokumente)
- [x] Knowledge-Doc Verifikation (97.2% perfekt)
- [x] Repository-Bereinigung (analysis/, pipeline/summaries/, Redundanzen)
- [x] Paper-Entwurf schreiben (Wissensdokument v12 + Text)
- [x] Abgleich Paper vs. Repository (paper-integrity.md)
- [x] Knowledge-Base konsolidieren (Dateien umbenannt, Redundanzen eliminiert)
- [x] Paper im Repo einrichten (paper-draft.md als Single Source of Truth)
- [x] 21 fehlende Papers untersucht (temporale Divergenz, 6 Duplikate identifiziert)
- [x] Deep-Research-Prompts untersucht (Template in Git-History, instanziierter Prompt verloren)
- [x] 10K Assessment-Prompt geprueft und synchronisiert (3 Inkonsistenzen behoben, v2.1)
- [x] Deep-Research-Prompt-Template im Repo wiederhergestellt (`prompts/deep-research-template.md`)
- [x] Korpus-CSV generiert (`benchmark/data/papers_full.csv`, 326 Zeilen, Is_Duplicate + Has_HA Flags)
- [x] 10K LLM Assessment ausgefuehrt (326/326, $1.44, `benchmark/data/llm_assessment_10k.csv`)
- [x] Assessment-Ordner restrukturiert (`assessment/human/`, `assessment/llm-5d/`, Altdateien in `benchmark/` bereinigt)
- [x] **Google Sheets Export** (Human Assessment CSV, 304 Papers, 210 mit Decision)
- [x] Teilmengen-Benchmark ausgefuehrt (merge + kappa + disagreements, κ = 0,035)
- [x] Benchmark-Ergebnisse ins Paper eingearbeitet (Abschnitt 5 befuellt)
- [x] Paper ausschreiben: v0.4, 17.975 Zeichen, alle Abschnitte fertig
- [ ] Review-Runde mit Co-Autor:innen (Susi, Sabine, Christian Steiner)
- [x] Vault-Building (Obsidian) mit Assessment-Integration + GitHub Pages aktiviert
- [ ] Paper einreichen (Deadline 4. Mai 2026)

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

*Aktualisiert: 2026-02-22*
