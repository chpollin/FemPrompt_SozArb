# Vergleich: Paper vs. Repository

Kurzfassung des Abgleichs zwischen Paper-Text und Repository-Stand. Fuer den detaillierten Satz-fuer-Satz-Abgleich des fertigen Paper-Texts siehe [knowledge/05-paper-repo-abgleich.md](knowledge/05-paper-repo-abgleich.md).

Dieses Dokument enthaelt den frueheren v8-Abgleich, aktualisiert am 2026-02-14 mit den Ergebnissen der Paper-Repo-Synthese.

---

## Phase 1 -- Identifikation und Import

| Behauptung (Paper v8) | Repository-Befund | Status |
|---|---|---|
| Vier Deep-Research-Modelle (Gemini, Claude, ChatGPT, Perplexity) | 4 RIS-Dateien in Git-History (wiederhergestellt in `deep-research/restored/`), 3 Raw-Outputs | BELEGT |
| Identische kontextparametrisierte Prompts | Prompt-Templates existieren nicht im Repository. Methodendokumentation beschreibt sie, aber die Dateien wurden im Oktober 2025 geloescht. Wiederherstellung aus Git-History moeglich, aber aktuell nicht vorhanden. | NICHT BELEGT |
| "Alle Papers im Korpus stammen aus diesen vier Quellen. Es gab keine ergaenzende manuelle Recherche." | FALSCH. `human_assessment.csv` zeigt: 254 DeepResearch (Perplexity 75, Claude 63, ChatGPT 62, Gemini 54) + 50 Manual + 1 leer = 305. Die 50 "Manual"-Papers kamen nicht aus Deep Research. | WIDERLEGT |
| Ueberschneidung zwischen Anbietern war "deutlich geringer als erwartet" | Aus den RIS-Dateien (34 Papers): 30 unikat, 2 Overlap (6% Ueberschneidung). Aber: Die RIS-Dateien decken nur 34 von 254 Deep-Research-Papers ab. Die restlichen 220 kamen aus weiteren Deep-Research-Runden, deren RIS nie committiert wurde. Ueber die Gesamt-Divergenz kann keine belastbare Aussage gemacht werden. | TEILWEISE BELEGT (nur fuer 34/254) |
| RIS-Export in Zotero-Bibliothek | Zotero-Export mit 326 Papers existiert. Collection-Mapping zeigt 4 identifizierte DR-Collections + 25 thematische Collections. | BELEGT |
| "Studienassistentin fuehrte Ergebnisse in Zotero zusammen" | Nicht dokumentiert im Repository. Kein Commit-Log oder Changelog zu Zotero-Kuration. | NICHT VERIFIZIERBAR |
| Anbieter-Divergenz als epistemisches Infrastruktur-Argument | Die Source_Tool-Verteilung (Perplexity 75, Claude 63, ChatGPT 62, Gemini 54) zeigt ungleiche Beitraege, aber keine Analyse der Ueberschneidungen auf Korpus-Ebene. Es existiert kein Script oder Bericht, der die tatsaechliche Divergenz quantifiziert. | BEHAUPTET, NICHT QUANTIFIZIERT |

### Kritischer Befund Phase 1

Die Behauptung "keine ergaenzende manuelle Recherche" widerspricht den Daten. 50 von 305 Papers (16.4%) sind als "Manual" markiert. Das Paper muss dies korrigieren oder erklaeren.

---

## Phase 2 -- Bewertung

| Behauptung (Paper v8) | Repository-Befund | Status |
|---|---|---|
| Zwei parallele Pfade, beide auf PRISMA-Grundlage | Zwei Assessment-Systeme existieren, aber mit unterschiedlichen Schemata: 5D (ordinal 0-3, fertig) und 10K (binaer, nicht ausgefuehrt). PRISMA wird in beiden konzeptuell referenziert. | TEILWEISE BELEGT |
| "Parallele unabhaengige Bewertung" | Zeitlich sequentiell, nicht parallel. 5D-Assessment: November 2025. 10K-Schema: Februar 2026. Human Assessment: laufend seit ca. Dezember 2025. | UNGENAU |
| Expert:innen-Pfad (Sackl-Sharif, Klinger) bewerten nach PRISMA | `human_assessment.csv` existiert mit 305 Papers. Stand: 171/305 mit Decision (55 Include, 102 Exclude, 14 Unclear, 134 leer). Nur 115/305 haben Kategorien befuellt. Assessment ist **nicht abgeschlossen**. | IM GANGE |
| LLM-gestuetzter Pfad mit mehrdimensionalen Relevanz-Scores | 5D-Assessment (assessment-llm/): 325/325 fertig. 5 ordinale Dimensionen (AI_Komp, Vulnerable, Bias, Praxis, Prof). | BELEGT |
| Binaeres Kategorien-System fuer Abgleich mit menschlicher Bewertung | 10K-System (benchmark/scripts/run_llm_assessment.py): Code existiert, nur auf 50 Papers getestet, nicht auf vollem Korpus ausgefuehrt. Wartet auf Abschluss des Human Assessments. | CODE BEREIT, NICHT AUSGEFUEHRT |
| 7 Expert:innen-Entscheidungstypen (Konfabulation, Digitalisierungsliteratur, Buchkapitel, Duplikate, Qualitaet vs. Thema, KI-Definitionsabgrenzung, interpretatives Mitdenken) | NICHT IM REPOSITORY DOKUMENTIERT. Es gibt 7 Exclusion Reasons in human_assessment.csv (Duplicate: 60, Not relevant topic: 24, Wrong publication type: 10, Other: 3, No full text: 2, ...), aber keine Taxonomie der Expert:innen-Entscheidungstypen, wie im Paper beschrieben. | NICHT BELEGT |
| Abweichungen zwischen beiden Pfaden qualitativ reflektiert | Kein Dokument im Repository, das Abweichungen analysiert. `benchmark/scripts/analyze_disagreements.py` existiert als Code, wurde aber nie ausgefuehrt. | NICHT VORHANDEN |
| "Dasselbe Kriterien-Framework, zwei unabhaengige Wege" | 5D und 10K verwenden UNTERSCHIEDLICHE Frameworks. 5D: 5 Dimensionen (0-3). 10K: 10 Kategorien (Ja/Nein). Nur 10K ist mit dem Human-Schema vergleichbar. | UNGENAU |

### Kritischer Befund Phase 2

Das Paper beschreibt den dualen Pfad als methodisches Kernstueck, aber:
- Das 10K-System, das fuer den Vergleich mit dem Human-Assessment noetig ist, wurde nie auf dem vollen Korpus ausgefuehrt.
- Die 7 Expert:innen-Entscheidungstypen sind eine analytische Kategorisierung, die nirgends im Repository belegt ist (kein Log, keine Annotation, keine strukturierte Dokumentation).
- Das Human Assessment ist bei 56% Completion (171/305 Decisions).

---

## Zwischen Phase 2 und 3 -- Korpusaufbereitung

| Behauptung (Paper v8) | Repository-Befund | Status |
|---|---|---|
| Hierarchische Fallback-Strategie fuer PDF-Akquise | `pipeline/scripts/acquire_pdfs.py` existiert. 257/326 PDFs (78.8%) akquiriert. | BELEGT |
| Docling konvertiert PDFs zu Markdown | `pipeline/scripts/convert_to_markdown.py` verwendet Docling (>=2.60.0). 252/257 konvertiert (98.1%). | BELEGT |
| Visuelles Validierungs-Tool (Browser-Tool) | `pipeline/tools/markdown_reviewer.html` (667 Zeilen). Side-by-side PDF-Images/Markdown, PASS/WARN/FAIL Buttons, Keyboard-Shortcuts, JSON-Export. | BELEGT |
| PDF-zu-Markdown-Konversion als epistemische Designentscheidung | Konzeptuell im Wissensdokument beschrieben, nicht explizit im Repository reflektiert. Die Konversion passiert, aber ohne dokumentierte Reflexion ueber epistemische Implikationen. | TECHNISCH BELEGT, REFLEXION FEHLT |

---

## Phase 3 -- Synthese

| Behauptung (Paper v8) | Repository-Befund | Status |
|---|---|---|
| Knowledge Distillation dreistufig | `pipeline/scripts/distill_knowledge.py`: Stage 1 = LLM-Extraktion, Stage 2 = deterministisches Template-Rendering (kein LLM), Stage 3 = LLM-Verifikation. | BELEGT |
| Stufe 2 deterministisch, keine Konfabulation moeglich | Korrekt. `stage2_format_markdown()` enthaelt keinen API-Call, nur lokale String-Formatierung. | BELEGT |
| Confidence-Score: Completeness 40%, Correctness 40%, Categories 20% | Zeile 276 in distill_knowledge.py bestaetigt exakt diese Formel. Schwellenwert < 75 = needs_correction. | BELEGT |
| 249 Knowledge-Dokumente erzeugt, 97.2% fehlerfrei | 249 .md-Dateien in `pipeline/knowledge/distilled/`. 242/249 perfekt laut Verifikation. | BELEGT |
| Obsidian Vault mit Papers, Concepts, MOCs, Synthesis | `vault/` enthaelt nur Skelett: README.md + 5 leere MOC-Placeholder. Keine Papers/, keine Concepts/, keine Synthesis/. | NICHT IMPLEMENTIERT |
| Bidirektionaler MCP-Kanal | Null Implementierung. Kein MCP-Server, keine Config, kein Code. Einzige Erwaehnung: der Workflow-Text selbst. | NICHT IMPLEMENTIERT |
| "Ueberführung in Wissensstrukturen ist selbst eine interpretative Leistung" | `generate_vault.py` (813 Zeilen) existiert als Code mit Konzeptextraktion, Synonym-Mapping, Frequenz-Analyse. Wurde nie mit Assessment-Daten ausgefuehrt. | CODE BEREIT, NICHT AUSGEFUEHRT |

---

## Kernbegriffe und theoretischer Rahmen

| Begriff (Paper v8) | Repository-Befund | Status |
|---|---|---|
| Epistemische Asymmetrie (Leitbegriff) | Kommt in 24 Pipeline-Dokumenten vor, aber nur als Thema der REZENSIERTEN LITERATUR (Sharma, Santos, Himmelreich, etc.). Nicht als Projekt-eigener theoretischer Rahmen dokumentiert. | NUR ALS LITERATUR-THEMA |
| Hauswald (2025a, 2025b) als theoretische Grundlage | NULL Treffer im gesamten Repository. Weder in knowledge/, noch in docs/, noch in der Workflow-Paper-Datei. | NICHT IM REPOSITORY |
| Konfabulation (statt Halluzination) | Kommt in der Workflow-Paper-Datei vor, aber in keinem anderen Projektdokument. Keine Knowledge-Docs verwenden den Begriff. Kein dokumentiertes Beispiel eines konfabulierten Papers im Repository. | NUR IM PAPER-ENTWURF |
| Co-Intelligence (Mollick 2024) | Referenziert in der Workflow-Paper-Datei und im Arbeitsplan. Nicht in Kern-Projektdokumentation (knowledge/01-project.md verwendet Haraway, Crenshaw). | IM PAPER-ENTWURF |
| Epistemische Infrastruktur | Konzeptuell im Wissensdokument beschrieben. Kein Repository-Artefakt dokumentiert diesen Begriff oder diese Perspektive. | NUR IM WISSENSDOKUMENT |
| Deep Research (Definition mit Konfabulations-Hinweis) | Deep Research wird in der Methodendokumentation beschrieben, aber ohne den Konfabulations-Hinweis. Die im Wissensdokument verwendete Definition ("komplexe Fragestellungen autonom zu loesen und zu 'konfabulieren'") existiert nirgends im Repository. | DEFINITION NUR IM WISSENSDOKUMENT |

---

## Zahlen und Groessenordnungen

| Behauptung (Paper v8) | Repository-Befund | Korrekt? |
|---|---|---|
| Korpus: 326 Papers | `zotero_export.json`: 326 Eintraege | JA |
| Human Assessment: 303 Papers | `human_assessment.csv`: 305 Zeilen (304 Papers + Header). `03-status.md` sagt 303. | LEICHTE DISKREPANZ (303 vs. 304) |
| 254 DeepResearch + 49 Human 1 Collection | `human_assessment.csv` Source_Tool: 254 DR (75+63+62+54) + 50 Manual. | NAHEZU KORREKT (49 vs. 50) |
| 5D Assessment: 325/325, 100% Erfolgsrate | `assessment-llm/output/assessment_llm.xlsx` mit 325 Zeilen. | JA |
| Kosten 5D: $0.58 | Dokumentiert in `02-methodology.md`, nicht unabhaengig verifizierbar. | DOKUMENTIERT |
| Knowledge Docs: 249, 97.2% fehlerfrei | 249 .md-Dateien, 242/249 perfekt. | JA |
| PDF-Akquise: 257/326 (78.8%) | Dokumentiert in `03-status.md`. | JA |
| Markdown-Konversion: 252/257 (98.1%) | Dokumentiert in `03-status.md`. | JA |

---

## Behauptungen ohne Repository-Entsprechung (Stand vor 2026-02-14)

Diese Elemente des Papers existierten bis zum 14.02.2026 ausschliesslich im Paper-Entwurf. Status nach Einarbeitung:

| Element | Alter Status | Neuer Status (2026-02-14) | Artefakt |
|---|---|---|---|
| **Epistemische Asymmetrie als Leitbegriff** | Nicht im Repo | **Eingearbeitet** | `knowledge/01-project.md` (Theoretischer Rahmen), `knowledge/06-epistemic-infrastructure.md` |
| **Hauswald-Theorie** | Null Treffer | **Eingearbeitet** | `knowledge/01-project.md` (Abschnitt "Kuenstliche epistemische Autoritaeten") |
| **Konfabulation als Begriff** | Nur im Paper-Entwurf | **Eingearbeitet** | `knowledge/01-project.md` (Glossar + Abschnitt), `knowledge/02-methodology.md`, `knowledge/04-technical.md` |
| **Sycophancy als Bias-Kanal** | Nicht adressiert | **Eingearbeitet** | `knowledge/01-project.md`, `knowledge/06-epistemic-infrastructure.md` (Massnahmen) |
| **Epistemische Infrastruktur** | Nur im Paper | **Eingearbeitet** | `knowledge/06-epistemic-infrastructure.md` (Mapping-Tabelle) |
| **Verantwortungsasymmetrie** | Rein konzeptuell | **Eingearbeitet** | `knowledge/01-project.md`, `knowledge/06-epistemic-infrastructure.md` |
| **7 Expert:innen-Entscheidungstypen** | Nicht dokumentiert | **Teilweise** | 3 Typen als Tabelle in `knowledge/02-methodology.md` |
| **Konfabulations-Beispiel** (konkreter Fall) | Nicht dokumentiert | **Dokumentiert** | `knowledge/04-technical.md` (Konfabulations-Dokumentation) |
| **Anbieter-Divergenz als quantifizierter Befund** | Kein Script/Report | **Ausstehend** | Provider-Verteilung in `knowledge/06-epistemic-infrastructure.md`, Overlap-Analyse noch noetig |
| **Instabilitaets-Befund** | Keine Dokumentation | Unveraendert | -- |
| **MCP-Integration** | Null Implementierung | Unveraendert | -- |

---

## Behauptungen mit starker Repository-Stuetzung

Diese Elemente sind praezise durch Repository-Artefakte belegt:

1. **3-Stage Knowledge Distillation** -- exakt wie beschrieben implementiert
2. **Deterministische Stufe 2** -- verifiziert, kein API-Call
3. **Confidence-Formel** -- Zeile 276, exakt 40/40/20
4. **Docling-Konversion** -- vollstaendig implementiert
5. **Visuelles Validierungs-Tool** -- 667-Zeilen HTML-Tool
6. **5D-Assessment-Ergebnisse** -- 325/325 fertig
7. **Dual-Assessment-Architektur** -- zwei Systeme existieren
8. **PRISMA-Adaption** -- konzeptuell in beiden Pfaden referenziert
9. **Zotero-Integration** -- 326-Paper-Bibliothek, Collection-Struktur

---

## Fazit

### Was das Repository gut stuetzt

Das Paper beschreibt den **technischen Workflow** (Phase 1 Import, Korpusaufbereitung, Knowledge Distillation) praezise und korrekt. Die 3-Stage-Pipeline, die Docling-Konversion, das Validierungs-Tool und das 5D-Assessment sind exakt so implementiert, wie beschrieben. Die Zahlen stimmen. Die technische Infrastruktur ist solide.

### Was nach Einarbeitung (2026-02-14) nun abgedeckt ist

Der **theoretische Ueberbau** (epistemische Asymmetrie, Hauswald, Konfabulation, Sycophancy, epistemische Infrastruktur, Verantwortungsasymmetrie) ist seit dem 14.02.2026 in der Projektdokumentation verankert:
- `knowledge/01-project.md` -- Leitkonzepte, Glossar, theoretischer Rahmen
- `knowledge/02-methodology.md` -- SKE-Begruendung, dualer Pfad, Zirkularitaet
- `knowledge/04-technical.md` -- Verifikations-Praezisierung, Konfabulations-Dokumentation
- `knowledge/06-epistemic-infrastructure.md` -- Mapping-Tabelle, Sycophancy-Massnahmen, Selektions-Audit

### Was das Repository immer noch nicht stuetzt

| Luecke | Prioritaet | Naechster Schritt |
|---|---|---|
| Anbieter-Divergenz als quantifizierter Befund | Hoch | Overlap-Analyse aus `papers_metadata.csv` |
| Instabilitaets-Befund (zeitliche Variation) | Mittel | Nicht dokumentierbar (Runs nicht gespeichert) |
| MCP-Integration | Niedrig | Aus Paper gestrichen oder als Ausblick |

### Drei konkrete Probleme, die vor Einreichung geloest werden muessen

**1. "Keine manuelle Recherche" ist falsch.** 50 von 305 Papers (16.4%) sind als "Manual" markiert. Das Paper korrigiert dies bereits: "Ergaenzt durch eine begrenzte Zahl manuell identifizierter Studien" (`knowledge/02-methodology.md`).

**2. Das 10K-Assessment wurde nie auf dem vollen Korpus ausgefuehrt.** Der duale Pfad, der als methodisches Kernstueck beschrieben wird, ist unvollstaendig. Das 10K-System existiert nur als Code und als 50-Paper-Test. Sycophancy-Mitigation muss vor dem naechsten Lauf in den Prompt eingebaut werden.

**3. Das Human Assessment ist nicht abgeschlossen.** 134/305 Papers ohne Decision, nur 115/305 mit Kategorien. Blockiert den Benchmark.

### Was das Paper vom Repo lernen sollte (Korrekturen)

| Paper-Behauptung | Repo-Befund | Empfehlung |
|---|---|---|
| "Gesamtkosten unter zehn Dollar" | $8.73 dokumentiert | Praezisere Angabe verwenden |
| 5D-Assessment nicht erwaehnt | 325/325 fertig, 100% Erfolgsrate | Im Paper erwaehnen (Machbarkeitsbeleg) |
| Confidence-Formel nicht im Detail | 40/40/20, Schwellwert < 75 | Operationalisierung staerkt Paper-Argument |
| Benchmark-Testlauf nicht erwaehnt | v1->v2: 20%->6% Inkonsistenzen | Konkretes Sycophancy-Beispiel fuer Paper |

---

*Erstellt: 2026-02-14*
