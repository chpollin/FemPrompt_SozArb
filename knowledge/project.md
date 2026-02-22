# Literature Review: AI Literacy & Bias in Social Work

## Projektziel

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** (Gender, Race, Intersektionalitaet) im Kontext Sozialer Arbeit. Teil des Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz" (Universitaet Graz, 2025-2026).

**Primaeres Ziel (Paper, Forum Wissenschaft):** Epistemische Infrastruktur fuer LLM-gestuetzte Literature Reviews beschreiben und operationalisieren -- am Beispiel eines systematischen Reviews zu feministischer AI Literacy und LLM-Bias in der Sozialen Arbeit. Kernfrage: Welche Verfahren, Dokumentationsstrukturen und Workflow-Entscheidungen sind noetig, damit LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben?

**Sekundaeres Ziel (Grundlage):** Konzeptuelle Basis fuer eine Benchmark ("Fair Bench") fuer die Soziale Arbeit schaffen. Der Review identifiziert relevante Begriffe, Konzepte und Diskurspositionen, die in Testszenarien ueberfuehrt werden koennen.

**Arbeitsdefinition feministischer AI Literacies:** Diversitaetssensible, intersektionale und Bias-erkennende Faehigkeiten, die Fachkraefte der Sozialen Arbeit im Umgang mit generativer KI benoetigen, mit Fokus auf Prompting, kritische Output-Bewertung und Kontext-/Anwendungssensitivitaet.

---

## Forschungsfragen

### Paper (Hauptfrage)

Welche epistemische Infrastruktur braucht ein LLM-gestuetzter Literature Review, um der Asymmetrie zwischen maschineller Musterkennung und fachlicher Urteilskraft methodisch gerecht zu werden?

### Review (Inhaltliche Fragen, nachgelagert)

1. Wie manifestiert sich Bias in Frontier-LLMs kontextabhaengig?
2. Welche Prompt-Strategien ermoeglichen diskriminierungssensible KI-Nutzung?
3. Wie koennen Sozialarbeitende AI-Literacy entwickeln, die der Systemkomplexitaet gerecht wird?

---

## Zielgruppe

| Zielgruppe | Nutzen |
|------------|--------|
| Forscher:innen (Soziale Arbeit + KI) | Strukturierte Literaturuebersicht, Forschungsluecken |
| Praktiker:innen (Soziale Arbeit) | Evidenzbasis fuer LLM-Nutzung in der Praxis |
| Lehrende (AI Literacy) | Kursmaterial, Konzepte, Fallbeispiele |

**Paper-Zielgruppe (Forum Wissenschaft):** Wissenschaftler:innen mit wenig KI-Vorwissen

---

## Erfolgskriterien

### Must-Have (Minimum)

| Kriterium | Messbar | Status |
|-----------|---------|--------|
| Paper eingereicht | Deadline 4. Mai 2026 | Ausstehend |
| Epistemische Infrastruktur dokumentiert | Repository auditierbar, Prompts versioniert | Umgesetzt |
| Dualer Bewertungspfad ausgefuehrt | Human + LLM Assessment komplett | Abgeschlossen |
| Benchmark-Metriken berechnet | Konfusionsmatrix, Basisraten, Disagreement-Analyse (Kappa als Vergleichsanker) | Abgeschlossen (Details: `status.md`) |

### Should-Have

| Kriterium | Messbar | Status |
|-----------|---------|--------|
| 249 Knowledge Documents | Strukturierte Volltext-Extraktion | Abgeschlossen (97.2% verifiziert) |
| Disagreement-Analyse | 111 Faelle kategorisiert | Abgeschlossen |
| Obsidian Vault | Vernetzte Wissensbasis | Erledigt (249 Papers, 205 mit Assessment-Daten) |

### Nice-to-Have

| Kriterium | Messbar | Status |
|-----------|---------|--------|
| GitHub Pages | Statische Dokumentationsseite | Erledigt (https://chpollin.github.io/FemPrompt_SozArb/) |
| OA-Analyse | Open-Access-Rate des Korpus | Ausstehend |

---

## Nicht-Ziele

| Was NICHT Teil des Projekts ist | Warum |
|---------------------------------|-------|
| Fertiger Prompting-Leitfaden | Kommt in nachgelagerter Phase |
| Empirische Validierung von Prompting-Strategien | Ausserhalb Scope |
| Tool fuer Endnutzer:innen | Fokus ist Forschung, nicht Produkt |
| Vollstaendige Automatisierung | Expert-in-the-Loop bleibt zentral |
| Training eigener Modelle | Nutzung bestehender Frontier-LLMs |

---

## Zwei Ebenen des Projekts

### Ebene 2: Methodisch -- KERNBEITRAG DES PAPERS

**Frage:** Welche epistemische Infrastruktur braucht ein LLM-gestuetzter Literature Review, um der Asymmetrie zwischen maschineller Musterkennung und fachlicher Urteilskraft methodisch gerecht zu werden?

**Output:**
- Konzept der epistemischen Infrastruktur (vier Ebenen: Workflow, Research Integrity, Institutionell, Community)
- Dualer Bewertungspfad als Operationalisierung (Human + LLM, parallel, unabhaengig)
- Benchmark-Ergebnisse als Illustration: Divergenz ist messbar und informationshaltig (Ergebnisse: siehe `status.md`)
- Paper fuer Forum Wissenschaft (Deadline 4. Mai 2026)
- Dokumentierter, reproduzierbarer Workflow im Repository (github.com/chpollin/FemPrompt_SozArb)

### Ebene 1: Inhaltlich (Literature Review -- Anwendungsfall)

**Frage:** Was sagt die Forschung zu LLM-Bias und feministischer AI Literacy?

**Output:**
- Thematisch kategorisierter Korpus (326 Papers, 10 binaere Kategorien)
- 249 destillierte Knowledge Documents (Volltext-Extraktion, 3-Stage SKE)
- Obsidian Vault (in Umsetzung)
- Konzeptuelle Grundlage fuer Fair Bench (nachgelagerte Phase)

---

## Korpus

| Aspekt | Wert |
|--------|------|
| Papers gesamt | 326 (Zotero Group 6080294) |
| Herkunft | 254 Deep Research (4 Modelle) + 50 manuell identifiziert + 22 nur in Zotero |
| Deep Research Modelle | Gemini, Claude, ChatGPT, Perplexity |
| DR-Verteilung | Perplexity 75, Claude 63, ChatGPT 62, Gemini 54 |
| Fokus | Feministische AI Literacies, generative KI, Prompting, Soziale Arbeit |
| Sprachen | Englisch, Deutsch |
| Zeitraum | 2017-2025 |

---

## Team

| Person | Rolle |
|--------|-------|
| Christopher Pollin | Technische Infrastruktur, Pipeline |
| Susi Sackl-Sharif | Human-Assessment, Forschungsleitung |
| Sabine Klinger | Human-Assessment |
| Christina | Zotero-Kuratierung, Metadaten |
| Christian Steiner | Paper-Review |

---

## Theoretischer Rahmen

### Epistemische Asymmetrie (Leitbegriff des Papers)

Epistemische Asymmetrie beschreibt eine Arbeitsteilung, in der die beteiligten Instanzen auf grundsaetzlich verschiedene Weise Wissen verarbeiten, wobei keine Seite die epistemischen Beitraege der anderen vollstaendig bewerten kann. LLMs verarbeiten grosse Textmengen und erkennen Muster ueber Hunderte von Texten. Expert:innen bewerten die epistemische Qualitaet von Quellen und erkennen Nuancen, die nur mit Feldkenntnis sichtbar werden.

Die Asymmetrie ist wechselseitig und kontextabhaengig. Sie laesst sich mit gegenwaertigen Systemen nicht aufloesen, sondern nur durch Workflow-Design produktiv bearbeiten (Mollick: Co-Intelligence).

**Zentrale These:** Die Verantwortungsasymmetrie bindet die anderen Dimensionen. Ohne zurechenbare Verantwortung gibt es keine Instanz, die Intransparenz, Zugangsbedingungen und Kompetenzunterschiede methodisch bearbeiten kann.

#### Mapping-Tabelle: Asymmetrie -> Risiko -> Massnahme -> Artefakt

| Asymmetrie-Dimension | Risiko | Infrastruktur-Massnahme | Pruefbares Artefakt | Status |
|---|---|---|---|---|
| **Intransparenz** (justifikatorische Esoterik) | Unueberpruefbare Selektion durch Deep-Research-Modelle | Multi-Provider-Strategie (4 Modelle) + Selektions-Logging | `corpus/source_tool_mapping.json`, `deep-research/restored/` | Teilweise (Logging vorhanden, Audit ausstehend) |
| **Ungesicherte LLM-Outputs** | LLMs koennen faktuell ungesicherte Aussagen erzeugen | 3-Stage SKE mit deterministischer Stufe 2 + Verifikation Stufe 3 | `pipeline/knowledge/_verification/`, Confidence-Scores in Frontmatter | Umgesetzt |
| **Sycophancy** | Prompt-induzierte Ueberattribuierung von Kategorien | Negative Constraints in Prompts, Calibration Items, Prompt-Versionierung | `prompts/CHANGELOG.md`, negative Constraints in `benchmark/scripts/run_llm_assessment.py` | Umgesetzt (v2.1: 5 negative Constraints, neutrale Rolle, Restriktivitaetsregel) |
| **Paywall-Bias** | Systematische Unterrepraesentation kostenpflichtiger Literatur | Hierarchische Beschaffungsstrategie + OA-Disclosure | PRISMA Flow-Diagramm, Beschaffungsrate (257/326 = 79%) | Teilweise (Rate dokumentiert, OA-Analyse ausstehend) |
| **Prompt-Kompetenz** | Ergebnisabhaengigkeit von Prompt-Qualitaet | Prompt-Governance: Versionierung, Review, Dokumentation | `prompts/CHANGELOG.md`, `prompts/deep-research-template.md` | Umgesetzt (5 Prompts versioniert, Deep-Research-Template restauriert) |
| **Verantwortungsasymmetrie** | Keine zurechenbare Instanz auf LLM-Seite | Expert:innen-Pfad als epistemisch verbindlicher Referenzpfad | Human Assessment (Google Sheets), auditierbare Bewertungsdaten | Umgesetzt (Assessment laufend) |
| **Anbieter-Divergenz** | Verschiedene Modelle liefern verschiedene Evidenzbasen | Multi-Provider-Vergleich, Overlap-Analyse | `corpus/papers_metadata.csv` (Source_Tool-Spalte), Provider-Statistiken | Teilweise (Verteilung dokumentiert, Overlap-Analyse ausstehend) |
| **Ressourcenasymmetrie** | Ungleich verteilter Zugang zu Frontier-Modellen und Infrastruktur | Kosten-Transparenz, Open-Source-Pipeline wo moeglich | Kosten-Dokumentation ($10.17 gesamt), Docling (Open Source) | Dokumentiert |

### Epistemische Infrastruktur

Epistemische Infrastruktur bezeichnet die Gesamtheit derjenigen Verfahren, Dokumentationsstrukturen, institutionellen Regelungen und Community-Praktiken, die sicherstellen, dass LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben.

**Arbeitsformel:** "Nicht das Modell wird verlaesslich, sondern der Forschungsprozess wird auditierbar: Epistemische Infrastruktur transformiert LLM-Einsatz von situativer Unterstuetzung zu nachvollziehbarer, verantwortbarer Wissensproduktion."

**Vier Ebenen:**

| Ebene | Beschreibung | Projekt-Umsetzung |
|-------|--------------|-------------------|
| Workflow | Dualer Bewertungspfad, deterministische Verarbeitungsstufen | 3-Stage SKE, paralleles Assessment |
| Research Integrity | Dokumentation, nachvollziehbare Designentscheidungen | Repository, Prompt-Changelog, paper-integrity.md |
| Institutionell | KI-Richtlinien | Noch nicht vorhanden |
| Community | Peer-Review-Praktiken, die Workflows einschliessen | Paper-Forderung |

#### Designprinzip: Wer entscheidet wo was, und warum?

**Phase 1: Identifikation (Deep Research)**

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Welche Literatur wird gefunden? | 4 LLM-Modelle | Automatisierte Suche ueber Disziplinen | RIS-Dateien, Zotero-Collections |
| Welche Literatur wird ergaenzt? | Studienassistentin + Forschende | Manuelle Recherche schliesst Luecken | 50 Manual-Papers in `papers_metadata.csv` |
| Welche Duplikate werden entfernt? | Studienassistentin | Metadaten-Abgleich (DOI, Titel) | Zotero-Duplikaterkennung |

**Phase 2: Bewertung (Dual Assessment)**

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Include/Exclude (verbindlich) | Expert:innen (Sackl-Sharif, Klinger) | Feldkenntnis, interpretative Urteilskraft | Google Sheets, `human_assessment.csv` |
| Include/Exclude (explorativ) | LLM (Haiku 4.5) | Skalierbarkeit, Muster-Erkennung | `assessment_llm.xlsx` (5D), 10K-Output |
| Kategorie-Zuordnung | Beide (parallel, unabhaengig) | Vergleich ermoeglicht Divergenz-Analyse | Konfusionsmatrix, Basisraten, Disagreement-Analyse |

**Phase 3: Synthese (SKE)**

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Extraktion (Stufe 1) | LLM (probabilistisch) | Skalierung ueber 249 Dokumente | `_stage1_json/` |
| Formatierung (Stufe 2) | Deterministische Software | Reproduzierbarkeit, keine LLM-Beteiligung | `_stage2_draft/` |
| Verifikation (Stufe 3) | LLM (probabilistisch mit Pruefauftrag) | Pruefung gegen Original-Volltext | `_verification/`, Confidence-Score |
| Eskalation bei niedrigem Confidence | Software-Regel (< 75) | Schwellenwert-basierte Weiterleitung | `needs_correction`-Markierung |

### Kuenstliche epistemische Autoritaeten (Hauswald 2025)

Rico Hauswald argumentiert, dass epistemische Deferenz nicht an Ueberzeugungen oder kommunikative Intentionen gebunden sein muss. Entscheidend ist, ob die Outputs eines Systems als zuverlaessige Wahrheitsindikatoren fungieren. Das erlaubt es, LLM-Beitraege als epistemisch relevant zu behandeln, ohne dem System menschliches Verstehen zuzuschreiben.

Hauswald beschreibt eine justifikatorische Esoterik: nicht der Inhalt, sondern die Begruendung bleibt unzugaenglich. Trainingsdaten, Modellarchitekturen und Selektionslogiken werden nicht offengelegt.

**Ergaenzung (Ferrario/Facchini/Termine 2024):** Selbst empirisch nachweisbare Ueberlegenheit eines KI-Systems begruendet keine epistemische Autoritaet, weil Autoritaet epistemische Tugenden und normative Ansprechbarkeit voraussetzt, die Maschinen nicht besitzen.

### LLMs als "Exotic Mind-Like Entities" (Shanahan 2024)

Shanahan (2024, *Strange New Minds*) praegt den Begriff "Exotic Mind-Like Entities" fuer Frontier-LLMs: Systeme, die anders als Menschen operieren, auch wenn ihr Verhalten oft menschenaehnlich erscheint. LLMs "lack the means to exercise concepts" wie Verstehen oder Glauben "in anything like the way we do" (S. 71) -- sie produzieren statistisch wahrscheinliche Fortsetzungen durch Next-Token-Prediction mit emergenten, kognitionsaehnlichen Mustern. Wenn Praktizierende diesen Systemen Einsicht in Klient:innensituationen zuschreiben, uebersehen sie, dass LLMs ohne das Weltverstaendnis oder die kritische Reflexionsfaehigkeit operieren, die professionelle Sozialarbeit erfordert.

Drei Aspekte sind fuer das Projekt relevant:
1. **Emergente Capabilities** ohne explizites Training (In-Context Learning, Domainuebertragung)
2. **Alignment-Spannungen** zwischen Constitutional AI ("helpful, harmless, honest") und professionsspezifischen Werten der Sozialen Arbeit
3. **Persona-Effekte** (Chen et al. 2025): Konsistente Charaktereigenschaften, die sich durch Finetuning verschieben und unvorhersehbare Cross-Trait-Effekte erzeugen

### Sycophancy (Prompt-Konformitaet)

Empirisch belegte Tendenz von LLMs, den Vorannahmen eines Prompts uebermaeessig zuzustimmen. Malmqvist (2024) dokumentiert Error Introduction Rates von bis zu 40% bei suggestiven Anfragen.

**Relevanz fuer das Projekt:** Wenn der Assessment-Prompt Kategorien wie "feministisch" oder "intersektional" betont, koennte das Modell diese Kategorien grosszuegiger zuweisen. Qualitaet des LLM-Beitrags haengt damit nicht nur von der Modell-Kompetenz ab, sondern auch von der Prompt-Gestaltung.

**Massnahmen im Projekt:**

1. **Negative Constraints** (in Assessment-Prompts, v2.1):
   - "Klassifiziere nur als 'Feministisch', wenn der Text explizit feministische Theorie, Methoden oder Perspektiven verwendet ODER sich auf feministische Autor:innen bezieht. Implizite Naehe zu Gender-Themen reicht nicht."
   - "Bei Unsicherheit: 'Nein' statt 'Ja'. Im Zweifel fuer den restriktiveren Wert."
   - "Vergib nicht mehr als 3-4 Kategorien pro Paper, es sei denn, der Text adressiert tatsaechlich mehr."

2. **Calibration Items:** 3-5 Papers mit bekannter korrekter Klassifikation als Kontrollgruppe:

   | Paper (Beispiel) | Erwartete Klassifikation | Prueft |
   |---|---|---|
   | Rein technisches ML-Paper ohne Sozialbezug | Alle Sozial-Kategorien = Nein | False-Positive-Rate |
   | Explizit feministisches Paper | Feministisch = Ja | True-Positive-Rate |
   | Fairness-Paper ohne Gender-Bezug | Feministisch = Nein, Fairness = Ja | Trennschaerfe |

3. **Prompt-Versionierung:** Jede Aenderung in `prompts/CHANGELOG.md` dokumentiert mit Versionsnummer, Datum, Aenderung, Begruendung und Auswirkung.

### Situiertes Wissen (Haraway)

Alle Erkenntnisse entstehen aus spezifischen sozialen, kulturellen und materiellen Kontexten. Objektivitaet bedeutet explizite Positionierung, nicht "View from Nowhere".

**Operationalisierung:**
- Multi-Modell-Strategie: 4 LLMs mit unterschiedlichen Trainingsdaten
- Divergenz zwischen Modellen wird dokumentiert, nicht harmonisiert
- Eigene Positionierung (feministisch, sozialarbeitswissenschaftlich) transparent

### Intersektionalitaet (Crenshaw)

Unterdrueckung erfolgt nicht entlang einzelner Achsen (Gender, Race), sondern durch deren wechselseitige Konstitution.

**Operationalisierung:**
- Mehrdimensionale Kategorisierungsschemata (10 binaere Kategorien)
- Prompt-Templates fokussieren auf intersektionale Perspektiven
- Konzeptextraktion behaelt intersektionale Spezifitaet bei

### Response-Ability (Haraway) / Verantwortungsasymmetrie

Verantwortung bedeutet die Faehigkeit zu antworten und Beziehungen zu pflegen. Im Kontext des dualen Bewertungspfads: Die Verantwortung fuer alle Ergebnisse bleibt bei den Forscher:innen, auch wenn LLMs epistemisch relevante Beitraege liefern.

**Operationalisierung:**
- Expert-in-the-Loop-Validierung an kritischen Entscheidungspunkten
- Explizite Begruendungen fuer Einschluss/Ausschluss-Entscheidungen
- Transparente Dokumentation methodischer Grenzen
- Expert:innen-Pfad als epistemisch verbindlicher Referenzpfad

---

## Methodische Grenzen

- **Zirkularitaet:** LLMs werden eingesetzt, um Literatur ueber den Einsatz von LLMs zu untersuchen. Diese Zirkularitaet ist kein Defekt, sondern eine Bedingung des Feldes -- es gibt keinen externen Standpunkt, von dem aus feministische AI Literacies untersucht werden koennten, ohne selbst auf AI Literacies angewiesen zu sein
- **Justifikatorische Esoterik (Hauswald):** Trainingsdaten, Modellarchitekturen und Selektionslogiken werden nicht offengelegt. Nicht der Inhalt, sondern die Begruendung bleibt unzugaenglich
- **Ungesicherte LLM-Outputs:** LLMs koennen faktuell ungesicherte Aussagen erzeugen (adressiert durch 3-Stage SKE mit deterministischer Stufe 2 und Verifikation)
- **Sycophancy-Risiko:** Prompt-induzierte Ueberattribuierung (adressiert durch Negative Constraints, Calibration Items)
- **Paywall-Bias:** Systematische Unterrepraesentation kostenpflichtiger Literatur im Korpus (79% Beschaffungsrate, Rest hinter Paywalls)
- **Ressourcenasymmetrie:** Gruppen, die Bias und Ungleichheit untersuchen, verfuegen haeufig ueber geringere Ressourcen fuer den Aufbau epistemischer Infrastruktur
- **Abhaengigkeit von proprietaeren Systemen**

---

## Glossar (Kernbegriffe)

| Begriff | Definition |
|---------|------------|
| Epistemische Asymmetrie | Arbeitsteilung, in der beteiligte Instanzen auf grundsaetzlich verschiedene Weise Wissen verarbeiten |
| Epistemische Infrastruktur | Verfahren, Dokumentationsstrukturen, Regelungen, die LLM-Beitraege ueberpruefbar machen |
| Sycophancy | Tendenz von LLMs, Prompt-Vorannahmen uebermaeessig zuzustimmen |
| Jagged Frontier | Ungleichmaessige Kompetenzverteilung von KI-Systemen (Mollick) |
| Structured Knowledge Extraction (SKE) | 3-stufige Verarbeitung von Volltexten zu Wissensdokumenten |
| Dualer Bewertungspfad | Parallele Anordnung von Expert:innen- und LLM-Pfad |
| Verantwortungsasymmetrie | Verantwortung bleibt bei Forscher:innen, obwohl LLMs epistemisch relevante Beitraege liefern |
| Deep Research | Agentenbasierte LLM-Systeme fuer iterative Recherche und zitierte Synthese |
| Wissensdokument | Strukturierte Zusammenfassung einer Studie mit Metadaten, Kernbefunden, Kategorien und Confidence-Score |

---

## Offene Punkte (Theorie/Rahmung)

- [ ] OA-Analyse durchfuehren (Unpaywall-API)
- [ ] Overlap-Analyse auf vollem Korpus (ueber `papers_metadata.csv`, nicht nur RIS)
- [ ] Eskalationsregel fuer Expert:innen-Review formalisieren
- [ ] Institutional-Level: KI-Richtlinien-Bezug dokumentieren

---

*Aktualisiert: 2026-02-21*
