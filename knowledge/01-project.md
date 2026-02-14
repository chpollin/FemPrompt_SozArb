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

### Response-Ability (Haraway)

Verantwortung bedeutet die Faehigkeit zu antworten und Beziehungen zu pflegen.

**Operationalisierung:**
- Expert-in-the-Loop-Validierung an kritischen Entscheidungspunkten
- Explizite Begruendungen fuer Einschluss/Ausschluss-Entscheidungen
- Transparente Dokumentation methodischer Grenzen

---

## Methodische Grenzen

- Zirkularitaet der LLM-gestuetzten LLM-Kritik
- Opazitaet der verwendeten Modelle
- Potenzielle Reproduktion sprachlicher/geografischer Bias
- Abhaengigkeit von proprietaeren Systemen

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Wert |
|--------|------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen (inkl. Leerzeichen, inkl. Fussnoten) |
| Fussnoten | max. 15, keine Literaturliste |
| Titel | Deep-Research-gestuetzte Literature Reviews im Praxistest |
| Untertitel | Epistemische Asymmetrien und Qualitaetssicherung zwischen Large Language Models und Expert:innenwissen |
| Wissensdokument | v12 (strukturell geschaerft) |
| Paper-Text | Entwurf liegt vor |
| Abgleich Paper vs. Repo | `knowledge/05-paper-repo-abgleich.md` |

---

*Aktualisiert: 2026-02-14*
