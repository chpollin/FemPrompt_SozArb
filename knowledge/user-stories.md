# User Stories - FemPrompt Knowledge Explorer

**Projekt:** FemPrompt Literature Review
**Erstellt:** 2026-02-02
**Status:** Draft

---

## Forschungsziele

Das FemPrompt-Projekt verfolgt folgende übergeordnete Ziele:

1. **Wissensproduktion:** Systematische Erfassung des Forschungsstands zu feministischen AI Literacies in der Sozialen Arbeit
2. **Methodenentwicklung:** Dokumentation und Evaluation eines Human-LLM-Co-Intelligence-Workflows
3. **Wissenstransfer:** Bereitstellung der Ergebnisse für Forschung, Praxis und Lehre
4. **Transparenz:** Offenlegung des gesamten Prozesses (Open Science)

---

## User Personas

### Persona 1: Dr. Maria Forscherin
**Rolle:** Wissenschaftlerin (Soziale Arbeit / Gender Studies)
**Kontext:** Arbeitet an eigenem Forschungsprojekt zu KI und Sozialarbeit
**Technische Kompetenz:** Mittel (nutzt Zotero, kennt keine Programmierung)
**Ziele:**
- Relevante Literatur für eigenes Projekt finden
- Forschungslücken identifizieren
- Methodische Ansätze verstehen
**Frustrationen:**
- Zu viele irrelevante Suchergebnisse
- Schwer, interdisziplinäre Verbindungen zu sehen
- Keine Zeit, 300 Abstracts zu lesen

### Persona 2: Thomas Praktiker
**Rolle:** Sozialarbeiter in der Jugendhilfe
**Kontext:** Möchte KI-Tools reflektiert in der Praxis einsetzen
**Technische Kompetenz:** Niedrig (nutzt Standard-Office-Tools)
**Ziele:**
- Praxisrelevante Erkenntnisse finden
- Ethische Fragen verstehen
- Konkrete Handlungsempfehlungen
**Frustrationen:**
- Wissenschaftliche Sprache zu abstrakt
- Keine Zeit für lange Texte
- Will "bottom line" wissen

### Persona 3: Lisa Studierende
**Rolle:** Master-Studierende (Soziale Arbeit)
**Kontext:** Schreibt Masterarbeit zu algorithmischer Diskriminierung
**Technische Kompetenz:** Mittel-Hoch (digital native)
**Ziele:**
- Überblick über Forschungsfeld bekommen
- Zentrale Autor:innen identifizieren
- Theoretische Konzepte verstehen
**Frustrationen:**
- Überwältigt von Literaturmenge
- Unsicher, was "wichtig" ist
- Braucht Struktur und Orientierung

### Persona 4: Prof. Ahmed Lehrender
**Rolle:** Professor für Sozialarbeitswissenschaft
**Kontext:** Entwickelt Seminar zu "Digitalisierung in der Sozialen Arbeit"
**Technische Kompetenz:** Mittel
**Ziele:**
- Aktuelle Literatur für Seminare finden
- Thematische Cluster für Sitzungen
- Exemplarische Papers für Studierende
**Frustrationen:**
- Literatur schnell veraltet
- Schwer, Balance zwischen Theorie und Praxis zu finden
- Braucht kuratierte Auswahl

### Persona 5: Dr. Chen Methodikerin
**Rolle:** Forscherin mit Fokus auf Forschungsmethoden
**Kontext:** Interessiert sich für Human-LLM-Vergleich als Methode
**Technische Kompetenz:** Hoch
**Ziele:**
- Benchmark-Ergebnisse verstehen
- Methodik für eigene Projekte adaptieren
- Disagreement-Fälle analysieren
**Frustrationen:**
- Fehlende Transparenz über LLM-Entscheidungen
- Keine Reproduzierbarkeit
- Black-Box-Charakter von KI

---

## User Stories

### Epic 1: Literatur Entdecken

#### US-1.1: Schnelle Orientierung
**Als** Dr. Maria Forscherin
**möchte ich** auf einen Blick sehen, wie viele Papers zu welchen Themen existieren
**damit** ich einschätzen kann, ob das Review für mein Projekt relevant ist

**Akzeptanzkriterien:**
- [ ] Dashboard zeigt Gesamtzahl der Papers
- [ ] Verteilung nach Kategorien sichtbar (Technik vs. Sozial)
- [ ] Include/Exclude-Ratio erkennbar
- [ ] Thematische Cluster visualisiert

#### US-1.2: Thematische Suche
**Als** Lisa Studierende
**möchte ich** nach Begriffen wie "Intersektionalität" oder "Bias" suchen
**damit** ich relevante Papers für mein spezifisches Thema finde

**Akzeptanzkriterien:**
- [ ] Volltextsuche über Titel, Abstract, Konzepte
- [ ] Fuzzy-Matching für Tippfehler
- [ ] Highlighting der Suchbegriffe in Ergebnissen
- [ ] Anzahl der Treffer pro Kategorie

#### US-1.3: Filter nach Kategorien
**Als** Prof. Ahmed Lehrender
**möchte ich** Papers nach den 10 Assessment-Kategorien filtern
**damit** ich gezielt Papers für bestimmte Seminar-Themen finde

**Akzeptanzkriterien:**
- [ ] Filter für alle 10 Kategorien (AI_Literacies, Gender, etc.)
- [ ] Multi-Select möglich (z.B. "Feministisch UND Soziale_Arbeit")
- [ ] Filter kombinierbar mit Suche
- [ ] Schnelle Ergebnisaktualisierung

#### US-1.4: Ähnliche Papers finden
**Als** Dr. Maria Forscherin
**möchte ich** zu einem interessanten Paper ähnliche Papers sehen
**damit** ich verwandte Literatur systematisch erfasse

**Akzeptanzkriterien:**
- [ ] "Ähnliche Papers"-Sektion bei jedem Paper
- [ ] Ähnlichkeit basiert auf gemeinsamen Konzepten
- [ ] Max. 5 Vorschläge, nach Relevanz sortiert
- [ ] Erklärung, warum ähnlich (gemeinsame Tags)

---

### Epic 2: Literatur Verstehen

#### US-2.1: Schnelle Zusammenfassung
**Als** Thomas Praktiker
**möchte ich** zu jedem Paper eine verständliche Zusammenfassung lesen
**damit** ich ohne Volltext-Lektüre entscheiden kann, ob es relevant ist

**Akzeptanzkriterien:**
- [ ] LLM-generierte Zusammenfassung (max. 200 Wörter)
- [ ] Strukturiert: Ziel, Methode, Ergebnis, Relevanz für Praxis
- [ ] Lesbarkeit: Keine Fachsprache oder erklärt
- [ ] Kennzeichnung als "KI-generiert"

#### US-2.2: Konzept-Erklärungen
**Als** Lisa Studierende
**möchte ich** zu zentralen Konzepten (z.B. "Intersektionalität") Erklärungen sehen
**damit** ich die theoretischen Grundlagen verstehe

**Akzeptanzkriterien:**
- [ ] Konzept-Glossar mit Definitionen
- [ ] Verlinkung zu Papers, die Konzept behandeln
- [ ] Häufigkeit des Konzepts im Corpus
- [ ] Verwandte Konzepte (Synonym-Mapping)

#### US-2.3: Paper-Detail-Ansicht
**Als** Dr. Maria Forscherin
**möchte ich** alle verfügbaren Informationen zu einem Paper auf einer Seite sehen
**damit** ich entscheiden kann, ob ich den Volltext lesen will

**Akzeptanzkriterien:**
- [ ] Vollständige Metadaten (Autor, Jahr, Journal, DOI)
- [ ] Abstract (original)
- [ ] LLM-Zusammenfassung (falls vorhanden)
- [ ] Assessment-Ergebnis (Human + LLM mit Kategorien)
- [ ] Extrahierte Konzepte als Tags
- [ ] Link zu Volltext (DOI, PDF falls verfügbar)

#### US-2.4: Vergleich Human vs. LLM
**Als** Dr. Chen Methodikerin
**möchte ich** sehen, wo Human- und LLM-Assessment unterschiedlich bewertet haben
**damit** ich die Stärken und Schwächen des LLM-Ansatzes verstehe

**Akzeptanzkriterien:**
- [ ] Disagreement-Cases hervorgehoben
- [ ] Kategorie-by-Kategorie Vergleich
- [ ] LLM-Reasoning sichtbar
- [ ] Filter auf "nur Disagreements"

---

### Epic 3: Wissen Explorieren

#### US-3.1: Konzept-Netzwerk
**Als** Lisa Studierende
**möchte ich** die Verbindungen zwischen Konzepten als Netzwerk sehen
**damit** ich verstehe, wie Themen zusammenhängen

**Akzeptanzkriterien:**
- [ ] Interaktive Netzwerk-Visualisierung
- [ ] Knoten = Konzepte, Kanten = Co-Occurence in Papers
- [ ] Klick auf Konzept zeigt zugehörige Papers
- [ ] Zoom und Pan
- [ ] Farbcodierung nach Themencluster

#### US-3.2: Zeitliche Entwicklung
**Als** Prof. Ahmed Lehrender
**möchte ich** sehen, wie sich Forschungsthemen über Zeit entwickelt haben
**damit** ich Trends und neue Entwicklungen identifiziere

**Akzeptanzkriterien:**
- [ ] Timeline-Visualisierung nach Publikationsjahr
- [ ] Thematische Filter auf Timeline
- [ ] Kumulative Ansicht (wie wächst Forschungsfeld?)
- [ ] Export als Grafik für Präsentationen

#### US-3.3: Autor:innen-Netzwerk
**Als** Dr. Maria Forscherin
**möchte ich** sehen, welche Autor:innen zentral im Forschungsfeld sind
**damit** ich weiß, wessen Arbeit ich verfolgen sollte

**Akzeptanzkriterien:**
- [ ] Liste der häufigsten Autor:innen
- [ ] Anzahl Papers pro Autor:in
- [ ] Ko-Autorschafts-Netzwerk
- [ ] Filter nach Kategorie (z.B. "Top-Autor:innen zu Gender")

#### US-3.4: Thematische Cluster
**Als** Prof. Ahmed Lehrender
**möchte ich** Papers nach thematischen Clustern gruppiert sehen
**damit** ich Seminar-Sitzungen strukturieren kann

**Akzeptanzkriterien:**
- [ ] Automatisch generierte Cluster (basierend auf Konzepten)
- [ ] Cluster-Labels (z.B. "Algorithmische Diskriminierung")
- [ ] Anzahl Papers pro Cluster
- [ ] Repräsentative Papers pro Cluster

---

### Epic 4: Wissen Exportieren

#### US-4.1: Literaturliste exportieren
**Als** Lisa Studierende
**möchte ich** meine gefilterte Auswahl als Literaturliste exportieren
**damit** ich sie in meine Arbeit übernehmen kann

**Akzeptanzkriterien:**
- [ ] Export als CSV
- [ ] Export als BibTeX
- [ ] Export als RIS (für Zotero)
- [ ] Nur gefilterte Papers exportieren

#### US-4.2: Zusammenfassungen exportieren
**Als** Thomas Praktiker
**möchte ich** die LLM-Zusammenfassungen als Dokument exportieren
**damit** ich sie offline lesen kann

**Akzeptanzkriterien:**
- [ ] Export als PDF
- [ ] Export als Markdown
- [ ] Auswahl: Nur Include-Papers
- [ ] Gruppierung nach Thema

#### US-4.3: Netzwerk-Grafik exportieren
**Als** Prof. Ahmed Lehrender
**möchte ich** die Konzept-Visualisierung als Bild exportieren
**damit** ich sie in Präsentationen nutzen kann

**Akzeptanzkriterien:**
- [ ] Export als PNG (hohe Auflösung)
- [ ] Export als SVG (für Bearbeitung)
- [ ] Aktueller Filter-Zustand wird exportiert

---

### Epic 5: Methodik Verstehen

#### US-5.1: Prozess-Dokumentation
**Als** Dr. Chen Methodikerin
**möchte ich** den gesamten Workflow nachvollziehen können
**damit** ich die Methodik für meine Forschung adaptieren kann

**Akzeptanzkriterien:**
- [ ] PRISMA-Flowchart interaktiv
- [ ] Schritt-für-Schritt-Dokumentation
- [ ] Code/Prompts verfügbar (Open Source)
- [ ] Kostenübersicht (API-Kosten)

#### US-5.2: Benchmark-Ergebnisse
**Als** Dr. Chen Methodikerin
**möchte ich** die Human-LLM-Übereinstimmung im Detail sehen
**damit** ich die Validität des LLM-Assessments einschätzen kann

**Akzeptanzkriterien:**
- [ ] Cohen's Kappa gesamt und pro Kategorie
- [ ] Konfusionsmatrix (interaktiv)
- [ ] Disagreement-Fälle mit Erklärung
- [ ] Download der Rohdaten (CSV)

#### US-5.3: Kategorie-Definitionen
**Als** jede:r Nutzer:in
**möchte ich** verstehen, was die 10 Kategorien bedeuten
**damit** ich die Bewertungen interpretieren kann

**Akzeptanzkriterien:**
- [ ] Definitionen prominent sichtbar
- [ ] Beispiele für Ja/Nein
- [ ] Link zu categories.yaml
- [ ] Inklusions-Logik erklärt

---

### Epic 6: Kollaboration

#### US-6.1: Paper annotieren (Future)
**Als** Dr. Maria Forscherin
**möchte ich** eigene Notizen zu Papers hinzufügen
**damit** ich meine Gedanken festhalte

**Akzeptanzkriterien:**
- [ ] Notiz-Feld pro Paper
- [ ] Nur für eingeloggte Nutzer:innen
- [ ] Export der Annotationen
- [ ] Private vs. öffentliche Notizen

#### US-6.2: Paper vorschlagen (Future)
**Als** Prof. Ahmed Lehrender
**möchte ich** fehlende Papers vorschlagen
**damit** das Review vollständiger wird

**Akzeptanzkriterien:**
- [ ] "Paper vorschlagen"-Button
- [ ] Formular: DOI, Begründung
- [ ] Review durch Team
- [ ] Feedback an Vorschlagende:n

---

## Priorisierung (MoSCoW)

### Must Have (für Launch)
- US-1.1: Schnelle Orientierung (Dashboard)
- US-1.2: Thematische Suche
- US-1.3: Filter nach Kategorien
- US-2.1: Schnelle Zusammenfassung
- US-2.3: Paper-Detail-Ansicht
- US-4.1: Literaturliste exportieren
- US-5.3: Kategorie-Definitionen

### Should Have (für v1.0)
- US-2.2: Konzept-Erklärungen
- US-2.4: Vergleich Human vs. LLM
- US-3.1: Konzept-Netzwerk
- US-3.4: Thematische Cluster
- US-4.2: Zusammenfassungen exportieren
- US-5.1: Prozess-Dokumentation
- US-5.2: Benchmark-Ergebnisse

### Could Have (für v1.x)
- US-1.4: Ähnliche Papers finden
- US-3.2: Zeitliche Entwicklung
- US-3.3: Autor:innen-Netzwerk
- US-4.3: Netzwerk-Grafik exportieren

### Won't Have (für dieses Projekt)
- US-6.1: Paper annotieren
- US-6.2: Paper vorschlagen

---

## Technische Implikationen

### Existierende Infrastruktur (SozArb Web Viewer)
- Static Site (GitHub Pages ready)
- vis-network für Graphen
- Chart.js für Dashboards
- Fuse.js für Suche
- Design System dokumentiert (DESIGN.md)

### Erweiterungen für FemPrompt
1. **Kategorie-Filter:** 10 neue Kategorien (statt 5 Dimensionen)
2. **Human-LLM-Vergleich:** Neue Datenfelder, Disagreement-Highlighting
3. **Benchmark-Sektion:** Neue Tab mit Metriken und Visualisierungen
4. **Konzept-Glossar:** Neue Datenstruktur für Definitionen
5. **Methodik-Sektion:** Integration der knowledge/ Dokumentation

### Daten-Requirements
- `research_vault.json` mit erweitertem Schema
- `benchmark_results.json` mit Metriken
- `concepts.json` mit Glossar
- `graph_data.json` mit Konzept-Netzwerk

---

## Verbindung zu anderen Dokumenten

- [[plan.md]]: Projektplan (Phase 4 hinzufügen)
- [[Forum Wissenschaft Paper - Arbeitsplan]]: Paper-Kontext
- [[Human-LLM Assessment Benchmark]]: Benchmark-Spezifikation
- [[DESIGN.md]]: Design System für Web Interface

---

*Version 1.0 | Erstellt: 2026-02-02*
