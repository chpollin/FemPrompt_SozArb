# Projekt: FemPrompt & SozArb

## Forschungsfrage

Frontier-LLMs wie ChatGPT, Claude und Gemini veraendern die berufliche Praxis in der Sozialen Arbeit. Diese Werkzeuge werden zur Informationssuche, Problemloesung und Dokumentation eingesetzt, ihre interne Komplexitaet und potenzielle Bias-Reproduktion bleiben jedoch weitgehend unverstanden.

**Zentrale Frage:** Wie kann ein systematisches Literature Review die Evidenzbasis fuer diskriminierungssensibles Prompting in der Sozialen Arbeit schaffen?

Das Projekt fokussiert auf:
- Identifikation von Bias-Typen in LLMs
- Mitigation-Strategien durch Prompting
- Methodische Ansaetze zur Sichtbarmachung intersektionaler Diskriminierungsformen

---

## Zielsetzung

Das Projekt leistet systematische Vorarbeit fuer einen evidenzbasierten Prompting-Leitfaden:

1. **Forschungslage strukturieren:** Bias in LLMs fuer Soziale Arbeit aufbereiten
2. **Prozess dokumentieren:** LLM-gestuetzter Review mit feministischer Perspektive
3. **Wissensbasis schaffen:** Grundlage fuer praktische Handlungsempfehlungen

**Scope:** Literature Review als Grundlage. Der eigentliche Prompting-Leitfaden wird in einer nachgelagerten Phase entwickelt.

---

## Zwei Projekte

### FemPrompt (303 Papers)
- **Fokus:** Feministische AI Literacies, generative KI, Prompting in Sozialer Arbeit
- **Zotero:** Group 6080294
- **Status:** Thematisches Assessment laeuft (Susi, Sabine)

### SozArb (325 Papers)
- **Fokus:** AI Literacy fuer vulnerable Populationen
- **Zotero:** Group 6284300
- **Status:** Pausiert (222 Include, 75 Enhanced Summaries)

---

## Team

| Person | Rolle |
|--------|-------|
| Christopher Pollin | Technische Infrastruktur, Pipeline |
| Susi Sackl-Sharif | Thematisches Assessment, Forschungsleitung |
| Sabine Klinger | Thematisches Assessment |
| Christina | Zotero-Kuratierung, Metadaten |
| Christian Steiner | Paper-Review |

---

## Theoretischer Rahmen

### Situiertes Wissen (Haraway)

Alle Erkenntnisse entstehen aus spezifischen sozialen, kulturellen und materiellen Kontexten. Objektivitaet bedeutet explizite Positionierung, nicht "View from Nowhere".

**Operationalisierung im Workflow:**
- Multi-Modell-Strategie: 4 LLMs (Claude, Gemini, ChatGPT, Perplexity) mit unterschiedlichen Trainingsdaten
- Divergenz zwischen Modellen wird dokumentiert, nicht harmonisiert
- Eigene Positionierung (feministisch, sozialarbeitswissenschaftlich) wird transparent gemacht

### Intersektionalitaet (Crenshaw)

Unterdrueckung erfolgt nicht entlang einzelner Achsen (Gender, Race), sondern durch deren wechselseitige Konstitution. Eine schwarze Frau erlebt nicht additiv Sexismus plus Rassismus, sondern eine spezifische Form von Diskriminierung an deren Schnittstelle.

**Operationalisierung im Workflow:**
- Mehrdimensionale Kategorisierungsschemata (10 binaere Kategorien)
- Prompt-Templates fokussieren auf intersektionale Perspektiven
- Konzeptextraktion behaelt intersektionale Spezifitaet bei

### Response-Ability (Haraway)

Verantwortung bedeutet die Faehigkeit zu antworten und Beziehungen zu pflegen, nicht nur Fehler zuzuordnen.

**Operationalisierung im Workflow:**
- Expert-in-the-Loop-Validierung an kritischen Entscheidungspunkten
- Explizite Begruendungen fuer Einschluss/Ausschluss-Entscheidungen
- Transparente Dokumentation methodischer Grenzen

---

## LLM-Ontologie und Alignment

### Exotic Mind-Like Entities (Shanahan 2024)

LLMs sind weder klassische Maschinen noch Minds. Diese ontologische Unsicherheit erfordert neue analytische Kategorien. Bias kann nicht als simple Input-Output-Relation verstanden werden.

### Strange New Minds (Summerfield 2025)

Emergente kognitive Phaenomene entstehen ohne explizites Training. Was in Training-Daten nicht vorhanden war, kann durch kombinatorische Effekte reproduziert werden. Bias-Mitigation muss mit Unvorhersehbarkeit rechnen.

### Persona-Vektoren (Chen et al. 2025)

Messbare Traits (Sycophancy, Halluzinationsneigung) sind im Aktivationsraum lokalisierbar. Diese koennen durch Finetuning unbeabsichtigt verschoben werden.

**Implikation:** Neben expliziten Vorurteilen existieren strukturelle Modell-Charakteristika, die Alignment-Konflikte mit professionellen Werten der Sozialarbeit erzeugen koennen.

---

## Bias als emergentes Multi-Level-Phaenomen

Bias ist nicht nur Daten-Artefakt, sondern emergentes Phaenomen aus:

1. **Architektur-Ebene:** Transformer-Design, Attention-Mechanismen
2. **Training-Ebene:** Daten, Objectives, Curriculum
3. **Alignment-Ebene:** RLHF, Constitutional AI, Persona-Vektoren
4. **Nutzungs-Ebene:** Prompt-Formulierung, Kontext, Interaktionsmuster

Response-Ability bedeutet: Verantwortung fuer Modellwahl, Prompt-Design, kritische Validierung.

---

## Scope und Grenzen

**Was das Projekt liefert:**
- Systematischer Literature Review zu Bias in LLMs
- Methodischer Workflow fuer LLM-gestuetzte Reviews
- Strukturierte Wissensbasis fuer Handlungsempfehlungen

**Was das Projekt nicht liefert:**
- Empirische Validierung von Prompting-Strategien
- Fertiger Prompting-Leitfaden
- Uebertragbarkeit auf konkrete Praxissituationen (nachgelagert)

**Methodische Grenzen:**
- Zirkularitaet der LLM-gestuetzten LLM-Kritik
- Opazitaet der verwendeten Modelle
- Potenzielle Reproduktion sprachlicher/geografischer Bias
- Abhaengigkeit von proprietaeren Systemen

---

*Konsolidiert aus: project-overview.md, theoretical-framework.md*
*Version: 1.0 (2026-02-02)*
