# Abgleich: Paper-Text vs. Repository

Systematischer Abgleich zwischen dem fertigen Paper-Text (Forum Wissenschaft, basierend auf Wissensdokument v12) und dem tatsaechlichen Stand im Repository. Synthetisiert aus drei Pruefungen: v8-Abgleich, v12-Abgleich und Satz-fuer-Satz-Pruefung des fertigen Texts. Der fruehere v8-Abgleich (ehemals `PAPER_VS_REPO.md` im Root) ist vollstaendig in dieses Dokument integriert.

**Grundprinzip:** Das Repository ist Ground Truth. Wo Paper und Repo sich widersprechen, muss das Paper angepasst werden.

---

## Methodik

Jede inhaltliche Aussage im Paper-Text wurde gegen Code, Daten und Dokumentation geprueft. Ergebnis in fuenf Kategorien:

| Kategorie | Bedeutung |
|---|---|
| BELEGT | Paper und Repo stimmen ueberein |
| KORRIGIERT | Paper v12 hat ein v8-Problem behoben |
| ABWEICHUNG | Paper behauptet etwas, das im Repo anders ist |
| NICHT VERIFIZIERBAR | Aussage laesst sich am Repo nicht pruefen |
| FEHLEND IM PAPER | Repo hat Relevantes, das im Paper fehlt |

---

## 1. Belegte Aussagen

### 1.1 Workflow-Architektur

| Paper-Aussage | Repo-Beleg | Status |
|---|---|---|
| 3-stufige Knowledge Distillation (LLM Extract, Deterministisch Format, LLM Verify) | `pipeline/scripts/distill_knowledge.py`: Stage 1 = `STAGE1_EXTRACT_CLASSIFY_PROMPT`, Stage 2 = Template-Rendering (kein API-Call), Stage 3 = `STAGE3_VERIFY_PROMPT` | BELEGT |
| Stufe 2 deterministisch, keine LLM-Beteiligung | `stage2_format_markdown()` enthaelt keinen API-Call, nur lokale String-Formatierung | BELEGT |
| Confidence-Score: Completeness 40%, Correctness 40%, Categories 20%, Schwelle < 75 | `distill_knowledge.py` Zeile 276 bestaetigt exakt | BELEGT |
| "Bei niedrigem Confidence-Score wird markiert, Signal an Mensch" | `needs_correction: true` bei Score < 75, Code bestaetigt | BELEGT |
| Docling fuer PDF-zu-Markdown-Konversion | `pipeline/scripts/convert_to_markdown.py` nutzt Docling (>=2.60.0) | BELEGT |
| Browser-Tool fuer visuelle Validierung (PDF links, Markdown rechts) | `pipeline/tools/markdown_reviewer.html` (667 Zeilen): Dual-Pane mit Seiten-Alignment, PASS/WARN/FAIL, Keyboard-Shortcuts | BELEGT |
| PDF-Akquise: hierarchische Fallback-Strategie (Zotero, DOI, Unpaywall, ArXiv) | `pipeline/scripts/acquire_pdfs.py`: exakt 4 Prioritaetsstufen | BELEGT |
| "Paywall-geschuetzte Literatur fehlt systematisch" | Verlustquote 69/326 (21.2%) bei PDF-Akquise | BELEGT |

### 1.2 Assessment-System

| Paper-Aussage | Repo-Beleg | Status |
|---|---|---|
| Dualer Bewertungspfad (Human parallel zu LLM) | Beide Systeme existieren als konzeptuell parallele Pfade | BELEGT |
| 10 binaere Kategorien (4 Technik + 6 Sozial) | `benchmark/config/categories.yaml` bestaetigt exakt | BELEGT |
| Inklusions-Logik: min. 1 Technik UND min. 1 Sozial | Im YAML und in `run_llm_assessment.py` implementiert | BELEGT |
| LLM-Assessment (5D): 325 Papers, 100% Erfolgsrate | `assessment-llm/output/assessment_llm.xlsx`: 325 Zeilen | BELEGT |
| Ergebnis 5D: 222 Include, 83 Exclude, 20 Unclear | Assessment-Report bestaetigt | BELEGT |
| Expert:innen-Pfad: Sackl-Sharif und Klinger | README, Status-Dokumente | BELEGT |
| PRISMA als gemeinsamer Rahmen fuer beide Pfade | Beide Assessment-Systeme referenzieren PRISMA | BELEGT |
| Benchmark ausgefuehrt (M6 komplett) | `merge_assessments.py`, `calculate_agreement.py`, `analyze_disagreements.py` ausgefuehrt, Ergebnisse in `benchmark/results/` | BELEGT |

### 1.3 Zahlen und Mengen

| Paper-Aussage | Repo-Beleg | Status |
|---|---|---|
| 326 Papers im Korpus | `corpus/zotero_export.json`: 326 Eintraege | BELEGT |
| 257 PDFs heruntergeladen | `pipeline/pdfs/`: 257 Dateien | BELEGT |
| 252 Markdown-Dateien | `pipeline/markdown/`: 252 Dateien | BELEGT |
| 5 fehlgeschlagene PDF-Konvertierungen | `knowledge/status.md` dokumentiert | BELEGT |
| 249 Knowledge Documents | `pipeline/knowledge/distilled/`: 249 Dateien | BELEGT |
| 97.2% Verifikationsqualitaet (242/249 perfekt) | 219+ Verifikations-JSONs in `pipeline/knowledge/_verification/` | BELEGT |
| "Kritische Faelle ungesicherter LLM-Outputs traten im bisherigen Durchlauf nicht auf" (Knowledge Distillation) | Verifikationsberichte zeigen keine solchen Faelle; 7 Probleme sind PDF-Upstream | BELEGT |

### 1.4 Theoretischer Rahmen

| Paper-Aussage | Repo-Beleg | Status |
|---|---|---|
| Repository unter github.com/chpollin/FemPrompt_SozArb | Existiert | BELEGT |
| Knowledge-Verzeichnis dokumentiert epistemische Entscheidungen | `knowledge/` mit 5 Dokumentationsdateien + Paper-Materialien | BELEGT |

---

## 2. Korrekturen gegenueber v8/v12

Diese Probleme wurden im fertigen Paper-Text gegenueber frueheren Versionen behoben:

| Problem (v8/v12) | Korrektur im Paper-Text | Status |
|---|---|---|
| v12 sagte "keine ergaenzende manuelle Recherche" | Paper sagt jetzt "ergaenzt durch eine begrenzte Zahl manuell identifizierter Studien" | KORRIGIERT |
| v8 bemaengelte Vault als "existent" dargestellt | Paper sagt jetzt "sollen abschliessend einfliesssen [...] Dieser Schritt befindet sich in der Umsetzung" | KORRIGIERT |
| v12 sagte "Keine ungesicherten LLM-Outputs im bisherigen Durchlauf" (absolut) | Paper sagt jetzt "Expert:innen stiessen auf Eintraege, die sich nicht verifizieren liessen" (differenzierter) | KORRIGIERT |
| v8 bemaengelte "MCP-Kanal" ohne Implementierung | Im Paper-Text nicht mehr erwaehnt | KORRIGIERT (entfernt) |

---

## 3. Abweichungen (Paper muss korrigiert werden)

### 3.1 Deep-Research-Prompts -- KORRIGIERT

**Paper sagt (aktualisiert):** "Die Prompt-Templates sind im Repository dokumentiert."

**Repo zeigt:** Das parametrische Prompt-Template wurde aus der Git-History (Commit `0a98f49`, `knowledge/Operativ.md`) restauriert und liegt in `prompts/deep-research-template.md`. Es enthaelt die 5-Komponenten-Struktur (Rolle, Aufgabe, Kontext, Analyseschritte, Output-Format), den RIS-Konvertierungs-Prompt und den Dokumenten-Zusammenfassungs-Prompt. Die meisten Placeholder-Werte wurden rekonstruiert (mit Quellenangabe und Sicherheits-Bewertung). Genuinely verloren sind: der exakt instanziierte Prompt-Text, einige Placeholder-Werte (Autorenliste, Region, spezifische Kompetenzen) und der OpenAI-Raw-Output.

**Status:** Paper-Text (Fussnoten [^7] und [^13]) und `prompts/CHANGELOG.md` wurden aktualisiert. Die Formulierung ist jetzt ehrlich: "Template dokumentiert, instanziierter Prompt rekonstruiert".

---

### 3.2 Visuelle Validierung -- UEBERTRIEBEN

**Paper sagt:** "Ein eigens gebautes Browser-Tool ermoeglicht die visuelle Ueberpruefung jeder Konversion."

**Repo zeigt:** Das Tool existiert und funktioniert. Aber laut `knowledge/methods-and-pipeline.md` wurden nur 25/252 (~10%) der Konversionen tatsaechlich geprueft (PASS 20, WARN 4, FAIL 1). "Jeder Konversion" suggeriert vollstaendige Abdeckung.

**Handlungsbedarf:** Formulierung praezisieren. Vorschlag: "ermoeglicht die visuelle Ueberpruefung der Konversionen" (ohne "jeder") oder "eine Stichprobe von rund zehn Prozent wurde visuell geprueft".

---

### 3.3 10K-System als operativer Pfad -- GELOEST (v0.4)

**Urspruengliches Problem (v12):** Nur 50-Paper-Test, nie voll ausgefuehrt.

**Aktueller Stand:** `run_llm_assessment.py` wurde auf allen 326 Papers ausgefuehrt ($1.44, Commit M5). Ergebnis: `benchmark/data/llm_assessment_10k.csv` (232 Include, 94 Exclude). Benchmark-Ergebnisse (κ = 0,035, Konfusionsmatrix, Kategorie-Kappas) liegen in `benchmark/results/agreement_metrics.json`. Paper v0.4 beschreibt diese Ergebnisse korrekt in Abschnitt 5.

**Status:** BELEGT

---

### 3.4 Befund zu nicht verifizierbaren Eintraegen -- WIDERSPRUCH ZUM WISSENSDOKUMENT

**Paper sagt:** "Im bisherigen Durchlauf stiessen die Expert:innen auf Eintraege, die sich nicht verifizieren liessen."

**Wissensdokument v12 sagt:** "Keine ungesicherten LLM-Outputs im bisherigen Durchlauf. Positiver Befund."

**Repo zeigt:** In `human_assessment.csv` gibt es genau 1 Eintrag mit "KEINE QUELLE GEFUNDEN!" (ID 1, EJEFPZGA). Keine systematische Kategorie fuer nicht verifizierbare Eintraege in den Exclusion Reasons. Die 5 dokumentierten Upstream-Probleme (Debnath, Tun, D'Ignazio, Statistics, Naescher) sind PDF-Qualitaetsprobleme, keine LLM-Fehler.

**Handlungsbedarf:** Paper-Text und Wissensdokument harmonisieren. Der Paper-Text ist vorsichtiger formuliert als das v12-Dokument, aber die Evidenz im Repo stuetzt weder eine starke Behauptung noch deren kategorische Verneinung. Empfehlung: Beim 1 dokumentierten Fall bleiben und praezise formulieren.

---

### 3.5 Korpus-Zahlen -- INKONSISTENT (intern)

Das Paper verwendet bewusst Groessenordnungen ("mehrere hundert Papers"), was korrekt ist. Aber die internen Dokumente widersprechen sich:

| Quelle | Zahl |
|---|---|
| Zotero-Export | 326 |
| LLM-Assessment (5D) | 325 (1 fehlt) |
| Human-Assessment CSV | 305 Zeilen (davon 50 Manual) |
| Status-Doc | "303 (254 DeepResearch + 49 Human 1 Collection)" |
| Human-Assessment CSV Source_Tool | 254 DR + 50 Manual + 1 leer |

**Handlungsbedarf:** Die Differenz 326 minus 305 = 21 Papers erklaeren. Status-Doc von 303 auf 305 korrigieren. 49 vs. 50 Manual klaeren.

---

### 3.6 Kappa als Leitmetrik -- METHODISCH PROBLEMATISCH

**Paper sagt (v0.4):** "Die primaere Vergleichsmetrik ist Cohen's Kappa" und "kappa = 0,035 ('slight' nach Landis & Koch)"

**Analyse (2026-02-22):** Cohen's Kappa ist durch den Prevalence-Bias-Paradox (Byrt et al. 1993, Feinstein & Cicchetti 1990) in diesem Anwendungsfall als Leitmetrik ungeeignet. Die Basisraten divergieren um 26 Prozentpunkte (LLM 68% Include vs. Human 42% Include). Bei derart unterschiedlichen Basisraten kollabiert Kappa kuenstlich -- der Wert 0,035 reflektiert primaer die Schwellenwert-Differenz, nicht die inhaltliche Uebereinstimmung.

**Handlungsbedarf:** Paper-Revision (v0.5) muss Konfusionsmatrix und Basisraten ins Zentrum ruecken, Kappa als Vergleichsanker mit Prevalence-Paradox-Erklaerung in Fussnote. Kategorie-Tabelle mit Ja-Raten und Richtung statt Kappa-Werten. Details: `knowledge/status.md` M6-Interpretation (Prevalence-Bias-Erklaerung)

---

### 3.7 Vault-Script integriert Assessment-Daten -- GELOEST

**Paper sagt:** "Beide Bewertungsstroeme sollen abschliessend in eine vernetzte Wissensrepaesentation einfliessen."

**Repo zeigt:** `generate_vault.py` liest jetzt `benchmark/data/llm_assessment_10k.csv` und `benchmark/data/human_assessment.csv`. Assessment-Daten werden ueber den Zotero-Key gematcht und ins YAML-Frontmatter geschrieben: `llm_decision`, `human_decision`, `llm_categories`, `human_categories`, `llm_confidence`, `agreement`. 205/249 Papers haben Assessment-Daten erhalten.

**Status:** BELEGT

---

### 3.8 RIS-Konversion -- NICHT REPRODUZIERBAR

**Paper sagt:** "Ein LLM konvertiert die heterogenen Outputs in RIS-Format."

**Repo zeigt:** RIS-Dateien existieren in `deep-research/restored/` (4 Dateien, untracked), aber:
- Kein Script fuer die Konversion
- Kein dokumentierter Prompt oder Prozess
- `ris-template.md` ist ein Struktur-Template, keine Anleitung

**Handlungsbedarf:** Konversionsprozess dokumentieren oder im Paper als externen Schritt kennzeichnen.

---

## 4. Nicht am Repo verifizierbar

| Aussage im Paper | Warum nicht pruefbar |
|---|---|
| "Die Ueberschneidung der Ergebnisse erwies sich als gering" | Provenienz nur fuer 36/326 Papers dokumentiert. `source_tool_mapping.json` zeigt 30/34 als Unikate, aber das deckt nur 13% des Korpus ab. Keine systematische Ueberlappungsanalyse. |
| "Manche Studien wurden nur von einem einzigen Anbieter identifiziert" | Gleiche Datenlage. Fuer 34 Papers belegbar, fuer den Rest nicht. |
| "Identische, strukturiert parametrisierte Anweisungen" | Prompts nicht im Repo (siehe 3.1). |
| Zeitliche Instabilitaet ("nicht reproduzierbare Treffer bei wiederholter Abfrage") | Kein Experiment im Repo dokumentiert. Paper markiert korrekt als Platzhalter. |
| "Studienassistentin fuehrte Ergebnisse zusammen, bereinigte Metadaten" | Kein Pruefprotokoll. Christina als "Zotero-Kuratierung" im Repo, nicht als "Studienassistentin". |
| Expert:innen-Entscheidungstypen (bibliographische Urteilskraft, KI-Abgrenzung, interpretatives Mitdenken) | Analytische Kategorisierung aus Reflexion ueber den Bewertungsprozess. Nicht als Log oder Annotation im Repo. Paper kennzeichnet korrekt als "aus der Reflexion gewonnen, nicht aus systematischer Auswertung". |
| "Qualitaet haengt wesentlich von Prompt-Gestaltung ab" | Konzeptuell plausibel, aber keine A/B-Tests oder Prompt-Varianten im Repo. |

---

## 5. Fehlend im Paper (im Repo vorhanden, potenziell nuetzlich)

### 5.1 Post-Processing

`pipeline/scripts/postprocess_markdown.py` bereinigt deterministisch: 230 Silbentrennungen, 341 Seitenzahlen, 2.263 Header-Wiederholungen, 107.545 Zeichen entfernt. Weiteres Beispiel fuer bewussten Wechsel zwischen probabilistischen und deterministischen Stufen.

### 5.2 4-Layer-Validierungssystem

`pipeline/scripts/validate_markdown_enhanced.py` prueft syntaktisch (GLYPH-Placeholder, Unicode), strukturell (Character-Ratio MD/PDF), semantisch (LLM Spot-Check optional), manuell (Review-Queue). Geht ueber das im Paper beschriebene Browser-Tool hinaus.

### 5.3 Bereinigte Markdown-Dateien

`pipeline/markdown_clean/` enthaelt 232 von 252 Dateien. 20 Dateien fielen durch die Qualitaetspruefung. Zeigt, dass der Workflow tatsaechlich selektiert.

### 5.4 Konkrete Kosten

LLM-Assessment (5D): $1.15. Knowledge Distillation: ~$7. Gesamt-Pipeline < $10. Stuetzt die oekonomische Asymmetrie-Argumentation ("fuer wenige Euro").

### 5.5 Upstream-Probleme als Befund

7 Knowledge-Dokumente mit Problemen, alle PDF-Upstream: korruptes Markdown (Debnath_2024), falsches Dokument im PDF (D'Ignazio_2024 enthielt Cabnal 2010), PDF war nur Titelseite (Naescher_2025), thematisch irrelevant (Statistics_2023). Konkreter Beleg fuer Paywall- und Qualitaetsprobleme.

### 5.6 Source-Tool-Verteilung (aus human_assessment.csv)

Perplexity 75, Claude 63, ChatGPT 62, Gemini 54, Manual 50. Zeigt ungleiche Beitraege der Anbieter, aber keine Ueberlappungsanalyse.

### 5.7 Human-Assessment-Stand

171/305 Decisions (56.3%): 55 Include, 102 Exclude, 14 Unclear, 134 offen. 115/305 (37.7%) mit Kategorien befuellt. Exclusion Reasons: 60 Duplicate, 24 Not relevant topic, 10 Wrong publication type.

---

## 6. Handlungsbedarf (priorisiert)

### Prioritaet 1 -- Vor Einreichung zwingend

| Nr. | Problem | Aktion | Betrifft |
|---|---|---|---|
| 1 | Prompts teilweise im Repo | Template restauriert (`prompts/deep-research-template.md`), instanziierte Versionen verloren. Paper-Entwurf formuliert korrekt: "Template versioniert, instanziierte Versionen verloren" | Teilweise geloest |
| 2 | "jeder Konversion" uebertrieben | Formulierung praezisieren (Stichprobe ~10%) | Paper Abschnitt 3 |
| 3 | Befund zu nicht verifizierbaren Eintraegen widerspruechlich | Paper-Text und Wissensdokument harmonisieren | Paper Abschnitt 1 + v12-Dokument |

### Prioritaet 2 -- Research Integrity

| Nr. | Problem | Aktion | Betrifft |
|---|---|---|---|
| 4 | RIS-Konversion nicht reproduzierbar | Prozess dokumentieren | Repo + Paper Abschnitt 1 |
| 5 | ~~Vault-Script integriert keine Assessment-Daten~~ | GELOEST: `generate_vault.py` erweitert, 205/249 Papers mit Assessment-Daten | ~~Paper Abschnitt 3~~ |
| 6 | Source-Tool-Mapping unvollstaendig (89% unbekannt) | Mapping vervollstaendigen aus human_assessment.csv | Repo |

### Prioritaet 3 -- Konsistenz

| Nr. | Problem | Aktion | Betrifft |
|---|---|---|---|
| 7 | Korpus-Zahlen inkonsistent (326/325/305/303) | Differenzen erklaeren, Status-Doc korrigieren | Interne Dokumente |
| ~~8~~ | ~~CLAUDE.md sagt "8 fallback strategies"~~ | GELOEST: CLAUDE.md sagt bereits korrekt "4 fallback strategies" | ~~Repo-Dokumentation~~ |
| 8 | Rolle Christina (Zotero-Kuratierung vs. Studienassistentin) | Abgleichen | Repo + Paper |

---

## 7. Theoretischer Rahmen: Repo-Verankerung

Der theoretische Ueberbau des Papers (epistemische Asymmetrie, Hauswald, Co-Intelligence, epistemische Infrastruktur) existiert ausschliesslich im Paper-Entwurf und im Wissensdokument. Kein Projektdokument im Repository verwendet diese Begriffe. Das ist an sich nicht problematisch -- ein Paper muss seinen theoretischen Rahmen nicht im Code verankern. Aber einige "Befunde", die als empirische Belege fuer die Theorie dienen, sind im Repo duenn belegt:

| "Befund" im Paper | Repo-Evidenz |
|---|---|
| Anbieter-Divergenz als strukturelles Merkmal | Nur fuer 34/326 Papers quantifizierbar |
| Expert:innen-Entscheidungstypen | Analytische Reflexion, nicht aus Repo-Daten ableitbar |
| Nicht verifizierbarer Eintrag | 1 dokumentierter Fall |
| Epistemische Asymmetrie im feministischen Feld | Konzeptuell plausibel, nicht operationalisiert |

Das Paper kennzeichnet seinen Status als "laufendes Experiment" und verwendet Zahlen nur als Groessenordnung (Leitplanken 3 und 6). Diese Rahmung schuetzt vor den meisten Problemen, solange die konkreten Abweichungen (Abschnitt 3) korrigiert werden.

---

## 8. Gesamtbewertung

### Stark gestuetzt

Der technische Workflow (Knowledge Distillation, Docling-Konversion, Validierungs-Tool, 5D-Assessment, deterministische Stufe 2) ist praezise und korrekt beschrieben. Die Zahlen stimmen. Die 3-Stage-Pipeline ist exakt so implementiert wie im Paper beschrieben. Die Confidence-Formel ist bis auf die Zeile belegbar.

### Korrigiert (v8/v12 zu Paper-Text)

Vier wichtige Probleme aus frueheren Versionen wurden behoben: manuelle Papers jetzt erwaehnt, Vault als "in Umsetzung" statt abgeschlossen, MCP-Kanal entfernt, Aussage zu nicht verifizierbaren Eintraegen differenzierter.

### Offen

Zwei Aussagen im Paper-Text stimmen nicht mit dem Repo ueberein und muessen vor Einreichung korrigiert werden: Prompts im Repo (teilweise rekonstruiert), "jeder Konversion" (uebertrieben). Assessment-Daten im Vault: GELOEST (generate_vault.py erweitert, 205/249 Papers mit Daten). Keine dieser Korrekturen erfordert groessere Umschreibungen.

### Operativer Stand (aktualisiert 2026-02-22)

10K-LLM-Assessment auf vollem Korpus abgeschlossen (326/326). Human-Assessment: 210/326 mit Decision (Benchmark-Basis). Benchmark berechnet: Konfusionsmatrix (78 LLM-Include/Human-Exclude vs. 23 umgekehrt), Basisraten (LLM 68% vs. Human 42% Include), 111 Disagreements analysiert. Cohen's Kappa (0,035) als Vergleichsanker berichtet, aber durch Prevalence-Bias-Paradox eingeschraenkt (Abschnitt 3.6). Paper v0.4 muss in v0.5 ueberarbeitet werden: Kappa runterdimmen, Konfusionsmatrix + Basisraten ins Zentrum.

---

*Aktualisiert: 2026-02-22*
