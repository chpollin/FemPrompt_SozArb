---
type: knowledge
created: 2025-01-27
tags: [social-ai, python, github, technical-implementation, automation]
status: reviewed
confidence: high
aliases: [Technische Implementierung, Technical Workflow]
---
# Technisch

## Summary

Die technische Implementierung des Literature Review Workflows basiert auf einer automatisierten Python-Pipeline mit Master-Orchestrierung und fünf aktiven Verarbeitungsstufen. Die Architektur nutzt multiple APIs (Semantic Scholar, CrossRef, ArXiv, Unpaywall) für Datenakquisition, Docling für Dokumentenkonversion und **Gemini 2.5 Flash** für KI-gestützte Analyse. Die Infrastruktur implementiert Checkpoint-Recovery, parallele Verarbeitung und Quality-Assurance-Mechanismen.

Das System verwendet hierarchische PDF-Akquisition mit Zotero-Integration, die eine Erfolgsrate von über 80% erreicht. Die Konversion zu Markdown erfolgt mit **MD5 Hash-basierter** Duplikaterkennung. Ein fünfstufiger Zusammenfassungsprozess generiert strukturierte Synthesen. Die Obsidian Knowledge Base-Generierung reduziert durch intelligente Konzeptextraktion 302 initiale auf 35 finale Konzepte (88% Noise-Reduktion). Ein Master-Orchestrator koordiniert alle Komponenten mit Resume-Funktionalität und flexibler Stage-Kontrolle.

## Core Concepts

### Repository-Architektur und Orchestrierung

Das GitHub-Repository FemPrompt_SozArb implementiert eine hierarchische Verzeichnisstruktur mit zentraler Pipeline-Orchestrierung. Der Master-Controller **run_pipeline.py** koordiniert fünf Verarbeitungsstufen durch ein Event-Driven-Architecture-Pattern. Die Pipeline unterstützt vollautomatische Ausführung, selektive Stage-Aktivierung und Checkpoint-basierte Wiederaufnahme nach Unterbrechungen.

Die Konfiguration erfolgt über pipeline_config.yaml mit Parametern für API-Limits, Timeouts, Parallelisierung und Quality-Thresholds. Ein JSON-basiertes Status-Tracking in .pipeline_status.json protokolliert Fortschritt, Fehler und Metriken jeder Stage. Die Architektur trennt strikt Input (Zotero-Export, PDFs), Processing (Markdown-Konversion, Summaries) und Output (Obsidian Vault). Diese Modularität ermöglicht unabhängige Entwicklung und Testing einzelner Komponenten.

### Aktive Pipeline-Komponenten

**getPDF_intelligent.py** (nicht die Legacy-Version getPDF.py) implementiert hierarchische PDF-Akquisition mit acht Fallback-Strategien. Primär extrahiert das System Zotero-Attachments aus lokalem Storage. Bei fehlenden Dateien aktivieren sequenziell: DOI-Resolution über CrossRef, ArXiv-ID-Extraktion, Semantic Scholar API für Open-Access-Versionen, Unpaywall-Integration, BASE Academic Search, verlagsspezifische Parser und HTML-Meta-Tag-Analyse. Die Zotero-Storage-Detection erfolgt automatisch über Betriebssystem-spezifische Pfade. Detailliertes Logging dokumentiert Erfolge und Fehler in acquisition_log.json und missing_pdfs.csv.

**pdf-to-md-converter.py** nutzt Docling für strukturerhaltende PDF-zu-Markdown-Transformation. **MD5-Hashing** verhindert Duplikatverarbeitung über alle Pipeline-Stufen. Metadaten werden in JSON persistiert für Unterbrechungs-Resilienz. Die Konfiguration optimiert für akademische Texte mit Beibehaltung von Strukturelementen, Tabellen und Zitationen. Docling ersetzt vollständig PyPDF2 für verbesserte Konversionsqualität.

**summarize-documents.py** implementiert einen fünfstufigen iterativen Refinement-Workflow mit **Gemini 2.5 Flash**. Stage 1 extrahiert akademische Kernelemente. Stage 2 generiert strukturierte 500-Wort-Synthesen. Stage 3 validiert Konsistenz und Vollständigkeit. Stage 4 produziert bereinigte Zusammenfassungen. Stage 5 extrahiert YAML-formatierte Metadaten. Rate-Limiting mit konfigurierbaren Delays verhindert API-Throttling. Die Verarbeitungszeit beträgt 120±15 Sekunden pro Dokument.

**generate_obsidian_vault_improved.py** transformiert den Dokumentenkorpus in eine navigierbare Obsidian Knowledge Base. Die Konzeptextraktion nutzt Pattern-basierte Erkennung mit Normalisierung und Deduplizierung. Ein Synonym-Mapping-Dictionary mit 182 Einträgen konsolidiert Varianten zu kanonischen Formen. Die Reduktion von 302 auf 35 Konzepte erfolgt durch intersektionale Konsolidierung, Fragment-Elimination und Frequency-Thresholds. Das System generiert Papers-Verzeichnis (33 Dokumente), Concepts-Verzeichnis (35 Konzepte in 2 Kategorien) und MASTER_MOC.md als Navigationsindex.

**test_vault_quality.py** implementiert systematische Vault-Validierung mit quantifizierbaren Metriken. Konzept-Uniqueness prüft auf Duplikate mit Zielwert über 95%. Metadata-Completeness verifiziert Frontmatter-Vollständigkeit. Link-Integrity analysiert Cross-References. Das Scoring-System erreicht konsistent 85/100 Punkte.

### API-Integration und Konfiguration

Die Multi-API-Architektur koordiniert Zugriffe auf heterogene Datenquellen mit adaptivem Rate-Limiting. Semantic Scholar limitiert auf 100 Requests pro 5 Minuten ohne API-Key. CrossRef operiert unbeschränkt mit empfohlenem Email-Header. ArXiv und Unpaywall implementieren moderate Request-Raten.

**Gemini 2.5 Flash**-Parameter optimieren für Balance zwischen Qualität und Kosten: temperature 0.3 für Konsistenz, maxOutputTokens 2048 für Ausführlichkeit, topP 0.8 und topK 40 für kontrollierte Kreativität. Die API-URL referenziert explizit v1beta/models/gemini-2.5-flash. Environment-Variables speichern API-Keys sicher. Die pipeline_config.yaml zentralisiert alle Konfigurationsparameter.

### Abhängigkeiten und Installation

Das System erfordert Python 3.8+ mit folgenden Kernbibliotheken: requests für HTTP-Kommunikation, PyYAML für Konfiguration, BeautifulSoup4 für HTML-Parsing, google-generativeai für Gemini-Integration und Docling für PDF-Konversion. PyPDF2 wird nicht mehr aktiv genutzt, bleibt aber als Fallback-Dependency. Optional: pyzotero für erweiterte Zotero-API-Integration.

Die Installation erfolgt über requirements.txt mit gepinnten Versionen für Reproduzierbarkeit. Docling erfordert zusätzliche System-Dependencies für optimale PDF-Verarbeitung. Die Pipeline läuft auf Windows, macOS und Linux mit identischer Funktionalität.

## Synthesis

### Automatisierung und Performance

Die vollautomatisierte Pipeline reduziert manuelle Intervention auf initialen Zotero-Export. Die Verarbeitungszeit für 30 Dokumente beträgt durchschnittlich 90 Minuten: PDF-Akquisition 5 Minuten, Konversion 15 Minuten, KI-Analyse 60 Minuten, Vault-Generierung unter 1 Minute, Qualitätstest 10 Sekunden. Die hierarchische PDF-Akquisition mit getPDF_intelligent.py maximiert Erfolgsraten bei minimalen API-Calls. Checkpoint-Recovery ermöglicht unterbrechungsfreie Langzeit-Runs.

### Datenqualität und Knowledge Base

Die Multi-Stage-Verarbeitung mit Validierung sichert Datenintegrität. MD5-Duplikaterkennung verhindert redundante Verarbeitung effizient. Die Konzept-Normalisierung reduziert Noise um 88% (von 302 auf 35 Konzepte). Die finale Obsidian Knowledge Base enthält 33 Papers, 35 Konzepte in 2 Kategorien (14 Bias Types, 21 Mitigation Strategies) und ermöglicht explorative Navigation ohne Dead Ends durch bidirektionale Verlinkung.

### Reproduzierbarkeit und Wartung

Git-Versionierung aller aktiven Skripte und Konfigurationen sichert Reproduzierbarkeit. Legacy-Komponenten wie getPDF.py bleiben im Repository für historische Referenz, sind aber nicht Teil der aktiven Pipeline. Die modulare Architektur mit klaren Interfaces erleichtert Komponenten-Updates. JSON-basierte Status-Persistierung ermöglicht Analyse historischer Runs. Die externe Konfiguration über YAML vermeidet Code-Modifikationen für verschiedene Projekte.
## Sources

- GitHub Repository: https://github.com/chpollin/FemPrompt_SozArb
- Docling Documentation: https://github.com/DS4SD/docling
- Semantic Scholar API: https://api.semanticscholar.org/api-docs/
- Gemini API Documentation: https://ai.google.dev/gemini-api/docs
## Related

- [[Konzept]] - Konzeptuelle Grundlagen
- [[Qualität]] - Qualitätssicherung
- [[PRISMA]] - Systematische Review-Methodik
- [[Literature Review Hub - Workflow]] - Übergeordnete Dokumentation