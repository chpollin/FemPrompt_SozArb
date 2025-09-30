# Systematische Dokumentation: KI-gestützte Literaturanalyse zu feministischen Digital- und KI-Kompetenzen (Work in Progress)

## 1. Projektübersicht

### 1.1 Forschungskontext
Das Projekt entwickelt einen systematischen Workflow zur Untersuchung der Forschungsfrage: "Wie können feministische Digital/AI Literacies und diversitätsreflektierendes Prompting dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?"
### 1.2 Methodischer Ansatz
Der Workflow kombiniert KI-gestützte Literaturrecherche mit systematischer Literaturverwaltung. Vier KI-Modelle (Gemini, Claude, GPT, Perplexity) werden parallel mit identischen parametrisierten Prompts eingesetzt. Die Ergebnisse werden in das standardisierte RIS-Format konvertiert und in Zotero zur manuellen Validierung importiert.
### 1.3 Projektstand
Das Repository befindet sich in aktiver Entwicklung. Die technische Infrastruktur ist implementiert, die systematische Analyse der gesammelten Literatur steht noch aus.
## 2. Workflow-Architektur

### 2.1 Geplanter fünfstufiger Hauptprozess

**Stufe 1: Parametrischer Deep-Research-Prompt**
Ein strukturierter Prompt-Baukasten wurde entwickelt mit fünf Komponenten:
- Rolle: Definition einer Expertenperspektive für die KI
- Aufgabe: Spezifikation des zu erstellenden Dokumenttyps
- Kontext: Einbettung der strategischen Forschungsziele
- Analyseschritte: Vorgabe eines methodischen Arbeitsablaufs
- Output-Format: Strukturvorgaben für die Ergebnisdarstellung

**Stufe 2: Multi-KI-Modell-Ausführung**
Die parallele Ausführung in vier KI-Systemen soll modellspezifische Verzerrungen minimieren und die Literaturabdeckung maximieren. Jedes Modell erhält identische Prompts zur Gewährleistung der Vergleichbarkeit.

**Stufe 3: RIS-Format-Standardisierung**
Ein System-Prompt zur Konvertierung der KI-Outputs in das Research Information Systems Format wurde entwickelt. Die Struktur umfasst bibliographische Metadaten, KI-generierte Zusammenfassungen und Qualitätsbewertungen.

**Stufe 4: Zotero-Integration**
Die technische Anbindung an Zotero ist vorbereitet. Vier modellspezifische Sammlungen wurden angelegt für die strukturierte Organisation der Literatur.

**Stufe 5: Expert-in-the-Loop-Validierung**
Der Validierungsprozess ist konzipiert für Relevanzbewertung, Duplikaterkennung und thematische Strukturierung durch Fachwissenschaftler.
### 2.2 Implementierte technische Komponenten

**PDF-Akquisitionssystem (getPDF.py)**
Ein automatisiertes System mit acht Extraktionsstrategien wurde entwickelt:
- Direkte PDF-URL-Erkennung
- ArXiv-spezifisches Pattern-Matching
- Semantic Scholar API-Integration
- CrossRef API-Anbindung
- Verlagsspezifische Module für Sage und ACM
- BASE Academic Search-Integration
- HTML-Meta-Tag-Parsing

Das System nutzt Thread-Safe Processing mit konfigurierbaren Parametern für Timeouts, Retry-Versuche und Dateigrößenlimits.

**PDF-zu-Markdown-Konverter (pdf-to-md-converter.py)**
Die Implementierung nutzt Docling für die Dokumentenkonversion. Ein Hash-basiertes System verhindert redundante Konversionen. Metadaten zur Konversion werden in JSON gespeichert.

**Dokumenten-Zusammenfassungssystem (summarize-documents.py)**
Ein mehrstufiger Verarbeitungsprozess mit Gemini 2.5 Flash wurde implementiert:
1. Akademische Analyse des Dokuments
2. Strukturierte Synthese in Standardformat
3. Kritische Validierung der Inhalte
4. Generierung einer bereinigten Zusammenfassung
5. Extraktion strukturierter Metadaten

Die Kostenoptimierung erfolgt durch Deaktivierung des Thinking-Modus bei gleichzeitiger Qualitätssicherung durch den mehrstufigen Prozess.

**Corpus-Analyse-Tool (md-to-process-corpus.py)**
Eine Komponente zur systematischen Analyse des Textkorpus mittels LangExtract wurde vorbereitet, ist jedoch noch nicht in die Hauptdokumentation integriert.
## 3. Datensammlung (Status)

### 3.1 Bibliographische Erfassung
Das Repository enthält 67 bibliographische Einträge in der Datei zotero_vereinfacht.json. Die Einträge stammen aus der initialen KI-gestützten Recherche und umfassen:
- Journalartikel aus peer-reviewten Publikationen
- Konferenzbeiträge führender Fachkonferenzen
- Institutionelle Reports und Policy-Dokumente
- Monographien und Buchkapitel
### 3.2 Zotero-Sammlungsstruktur
Vier modellspezifische Sammlungen wurden angelegt:
- Gemini-deep-research-bibliography-1 (3 Einträge)
- OpenAI-deep-research-bibliography-1 (6 Einträge)
- perplexity-deep-research-bibliography-1 (10 Einträge)
- claude-deep-research-bibliography (15 Einträge)
### 3.3 RIS-Export-Dateien
Vorbereitete RIS-Dateien für den Zotero-Import liegen im Verzeichnis to-Zotero/ vor. Die Dateien enthalten strukturierte bibliographische Daten mit Abstracts und Qualitätsbewertungen.

## 4. Theoretischer Rahmen

### 4.1 Prompt-Engineering-Konzepte

**Strukturierte Prompts**
Die Verwendung von Markdown-formatierten Prompts ermöglicht klare Strukturierung und verbesserte Verarbeitung durch KI-Modelle.

**Chain of Thought versus Reasoning**
Die Unterscheidung zwischen oberflächlicher Schritt-für-Schritt-Darstellung und tatsächlichem logischen Denken wird als kritisch für die Prompt-Gestaltung identifiziert.

**Modellspezifisches Prompting**
Die Erkenntnis, dass verschiedene KI-Modelle unterschiedliche "Charaktere" haben und entsprechend angepasste Prompts benötigen.

### 4.2 Feministische Theorie-Integration

**Situiertes Wissen (Donna Haraway)**
Das Konzept, dass alles Wissen aus spezifischen Kontexten entsteht, bildet die Grundlage für die kritische Bewertung von KI-generierten Inhalten.

**Intersektionalität (Kimberlé Crenshaw)**
Der Ansatz, multiple und sich überschneidende Diskriminierungsformen zu analysieren, leitet die thematische Fokussierung der Literatursuche.

**Response-Ability**
Das Konzept der Ver-Antwortungs-Fähigkeit als Alternative zur reinen Erklärbarkeit von KI-Systemen.

## 5. Technische Infrastruktur

### 5.1 Konfigurationsparameter

**PDF-Download-Konfiguration:**
- max_workers: 3 (parallele Downloads)
- timeout: 15 Sekunden
- retry_attempts: 2
- delay_between_requests: 0.5 Sekunden
- min_pdf_size: 1024 Bytes
- max_pdf_size: 50 MB

**Gemini API-Konfiguration:**
- Modell: gemini-2.5-flash
- temperature: 0.3
- maxOutputTokens: 2048
- topP: 0.8
- topK: 40
- thinkingBudget: 0 (Kostenoptimierung)

**Zotero API-Anbindung:**
- Bibliothekstyp: group
- Gruppen-ID: 6080294
- Gruppenname: FemPrompt_SozArb
### 5.2 Verzeichnisstruktur
```
/analysis/ - Verarbeitungsskripte und Metadaten
/markdown_papers/ - Konvertierte Dokumente (zu erstellen)
/all_pdf/ - PDF-Downloads (zu befüllen)
/to-Zotero/ - RIS-Import-Dateien
/summaries_final/ - Zusammenfassungen (zu generieren)
/deep-research/ - KI-Modell-spezifische Outputs
```
### 5.3 Datenformate
- **RIS**: Bibliographische Metadaten
- **JSON**: Konfiguration und Zwischenspeicherung
- **YAML**: Strukturierte Dokumentmetadaten
- **Markdown**: Dokumentinhalte und Zusammenfassungen
## 6. Methodische Herausforderungen

### 6.1 KI-spezifische Limitationen

**Halluzinationen**
Die Tendenz von KI-Modellen, plausible aber falsche Informationen zu generieren, erfordert sorgfältige Validierung aller bibliographischen Angaben.

**Sycophancy**
Die Neigung der Modelle, Nutzerwünsche zu bestätigen statt objektive Analysen zu liefern, muss durch kritische Prompt-Gestaltung adressiert werden.

**Knowledge Cutoffs**
Die unterschiedlichen Trainingsdatengrenzen der Modelle beeinflussen die Aktualität der gefundenen Literatur.

### 6.2 Technische Herausforderungen

**Paywall-Problematik**
Viele wissenschaftliche Publikationen sind nicht frei zugänglich. Das System kann URLs identifizieren, aber nicht alle PDFs herunterladen.

**Format-Heterogenität**
Unterschiedliche Publikationsformate und Metadatenstandards erschweren die automatisierte Verarbeitung.

**API-Limitierungen**
Rate-Limits und Kostenbeschränkungen erfordern optimierte Anfrage-Strategien.

## 7. Geplante Analyseschritte

### 7.1 PRISMA 2020 Systematic Review
Ein detaillierter Assistent-Prompt für die Phasen 4-7 des PRISMA-Prozesses wurde vorbereitet:

**Phase 4: Datenextraktion (EXTRACT)**
Strukturierte Erfassung von Studientitel, Autoren, Methodik, Population, Interventionen und Ergebnissen.

**Phase 5: Qualitätsbewertung (ASSESS)**
Kriterienbasierte Bewertung nach Dokumenttyp mit Fokus auf methodische Rigorosität und Transparenz.

**Phase 6: Flow-Diagramm (DIAGRAM)**
Visualisierung des Literaturauswahlprozesses mit numerischer Validierung.

**Phase 7: Berichterstattung (REPORT)**
PRISMA-konforme Dokumentation aller Analyseschritte.
### 7.2 Thematische Analyse
Geplante Analysekategorien:
- Intersektionale Fairness in KI-Systemen
- Feminist AI Frameworks
- Digitale Kompetenzen und Empowerment
- Prompt Engineering für Bias-Mitigation
- Trainingsdaten und Geschlechtergerechtigkeit
## 8. Erwartete Erkenntnisse

### 8.1 Literaturlandschaft
Die vorläufige Durchsicht der gesammelten Quellen deutet auf folgende Schwerpunkte:
- Dominanz englischsprachiger Publikationen
- Konzentration auf technische und konzeptuelle Arbeiten
- Begrenzte empirische Langzeitstudien
- Wachsendes Interesse an praktischen Anwendungen
### 8.2 Methodische Ansätze
Die identifizierten Publikationen zeigen verschiedene methodische Zugänge:
- Theoretisch-konzeptuelle Arbeiten
- Empirische Bias-Studien
- Design-orientierte Forschung
- Policy-Analysen und Rahmenwerke
### 8.3 Geografische und kulturelle Perspektiven
Erste Beobachtungen zeigen eine Dominanz westlicher Perspektiven mit begrenzter Integration nicht-westlicher und dekolonialer Ansätze.
## 9. Projektstatus und nächste Schritte

### 9.1 Abgeschlossene Komponenten
- Technische Infrastruktur vollständig implementiert
- Prompt-Templates entwickelt und getestet
- Initiale Literatursammlung durchgeführt
- Zotero-Integration vorbereitet
### 9.2 Ausstehende Arbeiten
- Systematische Anwendung der PDF-Akquisition
- Durchführung der Markdown-Konversion
- Generierung der Dokumentzusammenfassungen
- PRISMA-konforme Analyse
- Synthese der Erkenntnisse
### 9.3 Zeitplan
Das Projekt befindet sich in der Vorbereitungsphase. Die systematische Analyse und Synthese der gesammelten Literatur ist der nächste Hauptschritt.
## 10. Vorläufige Beobachtungen

### 10.1 Zur Methodik
Die Kombination mehrerer KI-Modelle zeigt unterschiedliche Stärken in der Literaturidentifikation. Die Notwendigkeit manueller Validierung bleibt zentral für die Qualitätssicherung.
### 10.2 Zur Literatur
Die identifizierten Quellen zeigen eine Entwicklung von theoretischen Grundlagen zu praktischen Anwendungen feministischer KI-Ansätze.
### 10.3 Zu technischen Aspekten
Die Automatisierung stößt bei proprietären Publikationen an Grenzen. Hybrid-Ansätze aus automatisierter und manueller Bearbeitung erweisen sich als notwendig.
## 11. Dokumentation und Transparenz

### 11.1 Versionskontrolle
Das Projekt nutzt Git für die Versionsverwaltung aller Skripte und Metadaten. Ein .gitignore verhindert die Versionierung von PDFs und generierten Markdown-Dateien.
### 11.2 Reproduzierbarkeit
Alle Prompt-Templates, Konfigurationen und Skripte sind dokumentiert, um die Reproduzierbarkeit des Workflows zu gewährleisten.
### 11.3 Datenschutz
Das System arbeitet ausschließlich mit öffentlich zugänglichen oder legitim erworbenen wissenschaftlichen Publikationen.
## 12. Ausblick

Das Projekt zielt darauf ab, einen reproduzierbaren und erweiterbaren Workflow für KI-gestützte systematische Literaturanalysen zu etablieren. Die Integration feministischer Perspektiven soll dabei nicht nur als Analysekategorie, sondern als grundlegendes methodisches Prinzip dienen. Die vollständige Implementierung und Analyse wird zeigen, inwieweit der entwickelte Ansatz zur Beantwortung der Forschungsfrage beitragen kann.

---

**Tags:** #SocialAI #LiteratureReview #Prompting 

**Related Notes:**
- [[Bias in KI-Systemen für die Sozialarbeit]]
- [[LLM & Prompting]]
- [[FAIR-SW-Bench. Framework zur Bias-Evaluierung in KI gestützter Sozialarbeit]]

**GitHub Repository:** [FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb)