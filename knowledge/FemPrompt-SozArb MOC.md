---
type: concept
created: 2025-01-28
tags: [feminist-ai, literature-review, workflow, social-ai, methodology]
status: reviewed
---

# FemPrompt-SozArb MOC

## Summary
Systematischer Workflow zur KI-gestützten Literaturanalyse über feministische Digital/AI Literacies und diversitätsreflektierendes Prompting. Das Projekt untersucht die Ko-Konstitution von Diskriminierungsformen in KI-Systemen und reflektiert kritisch die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien. Die Methodik kombiniert Multi-Modell-KI-Recherche (Gemini, Claude, GPT, Perplexity) mit Expert-in-the-Loop-Validierung in einem dreiphasigen PRISMA-konformen Prozess.

## Theoretischer Rahmen

### Kernkonzepte
- [[Konzept|Workflow-Konzept]] - Epistemologische Grundlagen und Phasenmodell
- [[Bias in KI-Systemen für die Sozialarbeit|Bias in KI-Systemen]] - Theoretische Einbettung
- [[FAIR-SW-Bench. Framework zur Bias-Evaluierung in KI gestützter Sozialarbeit|FAIR-SW-Bench]] - Evaluierungsframework

### Feministische Theorie
- **Situiertes Wissen (Haraway)** - Kontextualität aller Erkenntnisse
- **Intersektionalität (Crenshaw)** - Mehrdimensionale Diskriminierungsanalyse
- **Response-Ability** - Ver-Antwortungs-Fähigkeit statt Erklärbarkeit

## Methodologie & Standards

### Workflow-Dokumentation
- [[Dokumentation KI-gestützte Literaturanalyse|Hauptdokumentation]] - Systematische Projektdokumentation
- [[Konzept|Workflow-Konzept]] - Theoretische und methodische Fundierung
- [[Standards|Workflow-Standards]] - Methodische Standards und Referenzen

### Qualitätssicherung
- [[Qualität|Workflow-Qualität]] - Dreistufige Qualitätskriterien
- [[PRISMA|Workflow-PRISMA]] - PRISMA 2020 Implementation
- [[Standards#Alternative Review-Standards|Alternative Review-Standards]] - JBI, Cochrane, ENTREQ

### Review-Phasen
- **Phase 1-3**: Deep Research (im Hauptworkflow)
- **Phase 4**: EXTRACT - Strukturierte Datenextraktion
- **Phase 5**: ASSESS - Differenzierte Qualitätsbewertung  
- **Phase 6**: DIAGRAM - Flow-Diagramm Visualisierung
- **Phase 7**: REPORT - PRISMA-konforme Berichterstattung

## Technische Implementierung

### Python-Pipeline
- [[Technisch|Workflow-Technisch]] - Vollständige technische Dokumentation
- [[Technisch#Python-Pipeline Komponenten|Pipeline-Komponenten]]:
  - getPDF.py - Multi-Strategie PDF-Akquisition
  - pdf-to-md-converter.py - Docling-basierte Konversion
  - summarize-documents.py - Fünfstufige Analyse
  - md-to-process-corpus.py - Korpusanalyse

### API-Konfigurationen
- [[Technisch#API-Konfigurationen|Gemini 2.5 Flash]] - Kostenoptimierte Parameter
- [[Technisch#API-Konfigurationen|Zotero API]] - Gruppen-basierte Kollaboration
- [[Technisch#API-Konfigurationen|PDF-Download]] - Thread-Safe Processing

### Repository-Struktur
- **GitHub**: [FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb)
- **Verzeichnisse**: /analysis/, /markdown_papers/, /all_pdf/, /to-Zotero/
- **Datenformate**: RIS, JSON, YAML, Markdown

## Datensammlung & Analyse

### Bibliographische Erfassung
- [[Dokumentation KI-gestützte Literaturanalyse#3. Datensammlung (Status)|67 initiale Einträge]] - Aus Deep Research
- **Zotero-Sammlungen** - Modellspezifische Organisation
- **RIS-Standardisierung** - Strukturierte Metadaten

### Multi-Modell-Strategie
- **Gemini** - 3 Einträge
- **Claude** - 15 Einträge
- **GPT** - 6 Einträge
- **Perplexity** - 10 Einträge

### Analysekategorien
- Intersektionale Fairness in KI-Systemen
- Feminist AI Frameworks
- Digitale Kompetenzen und Empowerment
- Prompt Engineering für Bias-Mitigation
- Trainingsdaten und Geschlechtergerechtigkeit

## Prompt-Engineering

### Deep-Research-Framework
- [[Standards#Prompt-Templates für Deep Research|Parametrischer Prompt-Baukasten]] - 5-Komponenten-Struktur
- [[Standards#Prompt-Templates für Deep Research|RIS-Konvertierungs-Prompt]] - Standardisierung
- [[Standards#Prompt-Templates für Deep Research|Zusammenfassungs-Prompt]] - Gemini-optimiert

### Prompt-Komponenten
1. **ROLLE** - Expertenperspektive definieren
2. **AUFGABE** - Output-Typ spezifizieren
3. **KONTEXT** - Forschungsziele einbetten
4. **ANALYSESCHRITTE** - Methodischen Ablauf strukturieren
5. **OUTPUT-FORMAT** - Ergebnisdarstellung standardisieren

## Qualitätskriterien

### Validierungsebenen
- [[Qualität#Bibliographische Validierungskriterien|Bibliographische Validierung]] - DOI, ORCID, Journal-Verifikation
- [[Qualität#Methodische Rigorositätsbewertung|Methodische Rigorosität]] - Studientypspezifische Bewertung
- [[Qualität#KI-Output-Validierung|KI-Output-Validierung]] - Halluzinationserkennung

### Bewertungsmatrix
- **Relevanz-Score** - 5-stufige Skala
- **Qualitätskategorien** - Hoch/Mittel/Niedrig
- **Einschlussentscheidung** - Kriterienbasiert
- **Confidence-Level** - Transparente Unsicherheitsdokumentation

## Herausforderungen & Reflexion

### Methodische Limitationen
- [[Dokumentation KI-gestützte Literaturanalyse#6. Methodische Herausforderungen|KI-spezifische Limitationen]] - Halluzinationen, Sycophancy
- **Paywall-Problematik** - Zugangsbeschränkungen
- **Format-Heterogenität** - Standardisierungsherausforderungen

### Epistemologische Innovation
- [[Konzept#Epistemologische Innovation|Feministische Transformation]] - Kontext über Abstraktion
- **Multi-Perspektivität** - Partielle statt objektive Wahrheit
- **Expert-in-the-Loop** - Aktive Wissensproduktion

## Projektstatus & Zeitplanung

### Abgeschlossene Komponenten
- Technische Infrastruktur implementiert (Januar 2025)
- Prompt-Templates entwickelt und getestet
- Initiale Literatursammlung (67 Einträge) aus Deep Research
- Zotero-Integration vorbereitet (4 modellspezifische Sammlungen)
- GitHub-Repository strukturiert

### Ausstehende Arbeiten & Zeitrahmen
- **Woche 1-2**: Systematische PDF-Akquisition (8 Strategien implementiert)
- **Woche 3**: Markdown-Konversion via Docling durchführen
- **Woche 4-5**: Dokumentzusammenfassungen mit Gemini 2.5 Flash generieren
- **Woche 6-7**: PRISMA-konforme Analyse (Phasen 4-7)
- **Woche 8-10**: Synthese der Erkenntnisse und Narrative-Entwicklung
- **Woche 11-12**: Publikationsvorbereitung und Dissemination

### Erfolgskriterien & Metriken
- **Quantitativ**: Mindestens 50 hochwertige Publikationen final eingeschlossen
- **Qualitativ**: Cohen's Kappa > 0.60 bei Expertenbewertung
- **Methodisch**: PRISMA 2020 Compliance vollständig dokumentiert
- **Impact**: Publikation in peer-reviewed Journal (Q1/Q2)

## Publikationsziele & Output

### Geplante Publikationen
- **Hauptartikel**: "Feminist AI Literacies and the Paradox of Diversity-Sensitive Prompting"
  - Zieljournal: *AI & Society* oder *Big Data & Society*
  - Einreichung: Q2 2025

- **Methodenpaper**: "Multi-Model Deep Research: A PRISMA-Compliant Workflow for AI-Assisted Literature Reviews"
  - Zieljournal: *Journal of Information Science* oder *Research Synthesis Methods*
  - Einreichung: Q3 2025

### Disseminationsstrategie
- Open-Access-Publikation der finalen Bibliographie
- GitHub-Repository als methodische Ressource
- Workshop-Entwicklung für Prompt-Engineering-Training
- Integration in Lehrveranstaltungen zu Digital Humanities

## Verwandte Projekte

### SocialAI Integration
- [[SocialAI MOC|SocialAI Projekt]] - Übergeordnetes Bias-Forschungsprojekt
- [[Projects/SocialAI/FAIRSWBench/FAIR-SW-Bench. Framework zur Bias-Evaluierung in KI gestützter Sozialarbeit|FAIR-SW-Bench]] - Komplementäres Framework

### Promptotyping Synergie
- [[Promptotyping MOC|Promptotyping]] - Methodologische Verbindungen
- [[Projects/Promptotyping/Knowledge/Knowledge-Quarry|Knowledge-Quarry]] - Wissensextraktion

---
**Navigation**: [[HOME|Home]] | [[SocialAI MOC|SocialAI]] | [[Promptotyping MOC|Promptotyping]] | [[Applied-GenerativeAI MOC|Applied AI]]