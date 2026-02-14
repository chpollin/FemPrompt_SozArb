# Literature Review: AI Literacy & Bias in Social Work

## Projektziel

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** (Gender, Race, Intersektionalitaet) im Kontext Sozialer Arbeit. Teil des Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz" (Universitaet Graz, 2025-2026).

**Primaeres Ziel:** Konzeptuelle Grundlage fuer eine Benchmark ("Fair Bench") fuer die Soziale Arbeit, die systematisch ueberprueft, wie LLMs auf Bias-bezogene Begriffe reagieren. Der Review identifiziert die relevanten Begriffe, Konzepte und Diskurspositionen, bevor sie in Testszenarien ueberfuehrt werden koennen.

**Sekundaeres Ziel:** Methodische Innovation dokumentieren -- LLM-gestuetzter Literature Review im Praxistest, dokumentiert in einem Paper fuer Forum Wissenschaft.

**Arbeitsdefinition feministischer AI Literacies:** Diversitaetssensible, intersektionale und Bias-erkennende Faehigkeiten, die Fachkraefte der Sozialen Arbeit im Umgang mit generativer KI benoetigen, mit Fokus auf Prompting, kritische Output-Bewertung und Kontext-/Anwendungssensitivitaet.

---

## Forschungsfragen

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

| Kriterium | Messbar |
|-----------|---------|
| Literature Review abgeschlossen | 326 Papers thematisch kategorisiert |
| Paper eingereicht | Deadline 4. Mai 2026 |
| Assessment-Daten vorhanden | Human + Agent Assessment komplett |

### Should-Have

| Kriterium | Messbar |
|-----------|---------|
| Benchmark-Metriken berechnet | Cohen's Kappa, Konfusionsmatrix |
| Obsidian Vault nutzbar | Vernetzte Wissensbasis |
| LLM-Summaries generiert | Strukturierte Zusammenfassungen |

### Nice-to-Have

| Kriterium | Messbar |
|-----------|---------|
| Wissensbasis fuer Prompting-Leitfaden | Qualitativ |
| Reproduzierbarer Workflow | Pipeline dokumentiert |

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

### Ebene 1: Inhaltlich (Literature Review)

**Frage:** Was sagt die Forschung zu LLM-Bias und feministischer AI Literacy?

**Output:**
- Thematisch kategorisierte Literatur (326 Papers)
- 249 destillierte Knowledge Documents
- Obsidian Vault (in Umsetzung)
- Konzeptuelle Grundlage fuer Fair Bench

### Ebene 2: Methodisch (Praxistest)

**Frage:** Welche epistemische Infrastruktur braucht ein LLM-gestuetzter Literature Review?

**Output:**
- Dualer Bewertungspfad (Human + LLM, parallel)
- Paper fuer Forum Wissenschaft (Deadline 4. Mai 2026)
- Dokumentierter, reproduzierbarer Workflow im Repository

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

**Dimensionen der Asymmetrie:**

| Dimension | Beschreibung | Repo-Artefakt |
|-----------|--------------|---------------|
| Technologisch | Undurchsichtigkeit von Modellverhalten und Selektionslogik | Multi-Provider-Strategie, `deep-research/` |
| Verantwortung | Forscher:innen koennen Rechenschaft ablegen, LLMs nicht | Dualer Bewertungspfad, Expert:innen-Pfad als Referenz |
| Oekonomisch | Zugang zu Frontier-Modellen ist kostenpflichtig und ungleich verteilt | Kosten-Dokumentation ($8.73 gesamt) |
| Kompetenz | Prompt-Qualitaet bestimmt Ergebnisqualitaet | Prompt-Governance (siehe `prompts/CHANGELOG.md`) |
| Ethisch | Datenfluss in proprietaere Systeme, oekologische Kosten | -- |

**Zentrale These:** Die Verantwortungsasymmetrie bindet die anderen Dimensionen. Ohne zurechenbare Verantwortung gibt es keine Instanz, die Intransparenz, Zugangsbedingungen und Kompetenzunterschiede methodisch bearbeiten kann.

### Epistemische Infrastruktur

Epistemische Infrastruktur bezeichnet die Gesamtheit derjenigen Verfahren, Dokumentationsstrukturen, institutionellen Regelungen und Community-Praktiken, die sicherstellen, dass LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben.

**Vier Ebenen:**

| Ebene | Beschreibung | Projekt-Umsetzung |
|-------|--------------|-------------------|
| Workflow | Dualer Bewertungspfad, deterministische Verarbeitungsstufen | 3-Stage SKE, paralleles Assessment |
| Research Integrity | Dokumentation, nachvollziehbare Designentscheidungen | Repository, Prompt-Changelog, PAPER_VS_REPO.md |
| Institutionell | KI-Richtlinien | Noch nicht vorhanden |
| Community | Peer-Review-Praktiken, die Workflows einschliessen | Paper-Forderung |

**Arbeitsformel:** "Nicht das Modell wird verlaesslich, sondern der Forschungsprozess wird auditierbar: Epistemische Infrastruktur transformiert LLM-Einsatz von situativer Unterstuetzung zu nachvollziehbarer, verantwortbarer Wissensproduktion."

Detaillierte Operationalisierung: `knowledge/05-epistemic-infrastructure.md`

### Kuenstliche epistemische Autoritaeten (Hauswald 2025)

Rico Hauswald argumentiert, dass epistemische Deferenz nicht an Ueberzeugungen oder kommunikative Intentionen gebunden sein muss. Entscheidend ist, ob die Outputs eines Systems als zuverlaessige Wahrheitsindikatoren fungieren. Das erlaubt es, LLM-Beitraege als epistemisch relevant zu behandeln, ohne dem System menschliches Verstehen zuzuschreiben.

Hauswald beschreibt eine justifikatorische Esoterik: nicht der Inhalt, sondern die Begruendung bleibt unzugaenglich. Trainingsdaten, Modellarchitekturen und Selektionslogiken werden nicht offengelegt.

**Ergaenzung (Ferrario/Facchini/Termine 2024):** Selbst empirisch nachweisbare Ueberlegenheit eines KI-Systems begruendet keine epistemische Autoritaet, weil Autoritaet epistemische Tugenden und normative Ansprechbarkeit voraussetzt, die Maschinen nicht besitzen.

### Konfabulation (nicht Halluzination)

Konfabulation bezeichnet die Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen durch ein LLM, ohne dass eine interne Instanz den Wahrheitsgehalt gegen eine externe Referenz prueft. Der Begriff ist der klinischen Psychologie entlehnt (Wiggins/Bunin 2023).

**Begruendung der Terminologie:**
- Halluzination setzt Wahrnehmungsstoerung bei vorhandenem Bewusstsein voraus (bei LLMs nicht gegeben)
- Konfabulation beschreibt den Erzeugungsmechanismus praeziset (kohaerente Narrative ohne Taeuschungsabsicht)
- Sui et al. (2024): Konfabulierte LLM-Outputs weisen hoehere Narrativitaet und semantische Kohaerenz auf als veridikale Outputs

**Konsequenz fuer die Pipeline:** Die 3-Stage SKE adressiert Konfabulationsrisiko durch deterministische Stufe 2 (kein LLM, keine Konfabulation moeglich) und Verifikation in Stufe 3 (Pruefauftrag gegen Original).

### Sycophancy (Prompt-Konformitaet)

Empirisch belegte Tendenz von LLMs, den Vorannahmen eines Prompts uebermaeessig zuzustimmen. Malmqvist (2024) dokumentiert Error Introduction Rates von bis zu 40% bei suggestiven Anfragen.

**Relevanz fuer das Projekt:** Wenn der Assessment-Prompt Kategorien wie "feministisch" oder "intersektional" betont, koennte das Modell diese Kategorien grosszuegiger zuweisen. Qualitaet des LLM-Beitrags haengt damit nicht nur von der Modell-Kompetenz ab, sondern auch von der Prompt-Gestaltung.

**Massnahmen im Projekt:** Negative Constraints in Prompts, Calibration Items, Prompt-Versionierung (siehe `prompts/CHANGELOG.md`, `knowledge/05-epistemic-infrastructure.md`)

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
- **Konfabulationsrisiko:** Architekturbedingte Erzeugung plausibler, aber ungesicherter Aussagen (adressiert durch 3-Stage SKE)
- **Sycophancy-Risiko:** Prompt-induzierte Ueberattribuierung (adressiert durch Negative Constraints, Calibration Items)
- **Paywall-Bias:** Systematische Unterrepraesentation kostenpflichtiger Literatur im Korpus (79% Beschaffungsrate, Rest hinter Paywalls)
- **Ressourcenasymmetrie:** Gruppen, die Bias und Ungleichheit untersuchen, verfuegen haeufig ueber geringere Ressourcen fuer den Aufbau epistemischer Infrastruktur
- **Abhaengigkeit von proprietaeren Systemen**

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Wert |
|--------|------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen (inkl. Leerzeichen, inkl. Fussnoten) |
| Fussnoten | max. 15, keine Literaturliste |
| Titel | Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews |
| Untertitel | Workflow-Design zwischen Large Language Models und Expert:innenwissen |
| Wissensdokument | v12 (strukturell geschaerft) |
| Paper-Text | Entwurf liegt vor |
| Abgleich Paper vs. Repo | `knowledge/05-paper-repo-abgleich.md` |

---

## Glossar (Kernbegriffe)

| Begriff | Definition |
|---------|------------|
| Epistemische Asymmetrie | Arbeitsteilung, in der beteiligte Instanzen auf grundsaetzlich verschiedene Weise Wissen verarbeiten |
| Epistemische Infrastruktur | Verfahren, Dokumentationsstrukturen, Regelungen, die LLM-Beitraege ueberpruefbar machen |
| Konfabulation | Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen durch LLMs |
| Sycophancy | Tendenz von LLMs, Prompt-Vorannahmen uebermaeessig zuzustimmen |
| Jagged Frontier | Ungleichmaessige Kompetenzverteilung von KI-Systemen (Mollick) |
| Structured Knowledge Extraction (SKE) | 3-stufige Verarbeitung von Volltexten zu Wissensdokumenten |
| Dualer Bewertungspfad | Parallele Anordnung von Expert:innen- und LLM-Pfad |
| Verantwortungsasymmetrie | Verantwortung bleibt bei Forscher:innen, obwohl LLMs epistemisch relevante Beitraege liefern |
| Deep Research | Agentenbasierte LLM-Systeme fuer iterative Recherche und zitierte Synthese |
| Wissensdokument | Strukturierte Zusammenfassung einer Studie mit Metadaten, Kernbefunden, Kategorien und Confidence-Score |

---

*Aktualisiert: 2026-02-14*
