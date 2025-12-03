---
type: knowledge
created: 2025-01-31
tags: [research-question, scope, literature-review, social-work]
status: active
---

# Projekt

## Forschungsfrage

Frontier-LLMs wie ChatGPT, Claude und Gemini verändern die berufliche Praxis in der Sozialen Arbeit. Diese Werkzeuge werden zur Informationssuche, Problemlösung und Dokumentation eingesetzt, ihre interne Komplexität und potenzielle Bias-Reproduktion bleiben jedoch weitgehend unverstanden. Das Projekt untersucht, welche Erkenntnisse die bisherige Forschung zu Bias-Mechanismen in LLMs liefert und welche Prompting-Strategien zur Diskriminierungsminimierung diskutiert werden.

Die zentrale Frage lautet: Wie kann ein systematisches Literature Review die Evidenzbasis für diskriminierungssensibles Prompting in der Sozialen Arbeit schaffen? Das Projekt fokussiert dabei auf die Identifikation von Bias-Typen, Mitigation-Strategien und methodischen Ansätzen zur Sichtbarmachung intersektionaler Diskriminierungsformen in KI-Systemen.

## Zielsetzung

Das Projekt leistet systematische Vorarbeit für einen evidenzbasierten Prompting-Leitfaden durch drei Komponenten. Erstens wird die Forschungslage zu Bias in LLMs für Soziale Arbeit strukturiert aufbereitet. Zweitens wird ein LLM-gestützter Review-Prozess mit feministischer Perspektive dokumentiert und transparent gemacht. Drittens entsteht eine Wissensbasis aus der praktische Handlungsempfehlungen abgeleitet werden können.

Der Fokus liegt auf dem Literature Review als Grundlage. Der eigentliche Prompting-Leitfaden für Sozialarbeiter:innen wird in einer nachgelagerten Phase aus dieser Evidenzbasis entwickelt. Das Projekt dokumentiert den Weg von der Multi-Modell-Recherche über PRISMA-konforme Bewertung bis zur strukturierten Wissenssynthese in Obsidian.

## Theoretischer Rahmen

Das Projekt operationalisiert drei feministische Konzepte in einer technischen Infrastruktur. Situiertes Wissen nach Donna Haraway manifestiert sich in der parallelen Nutzung mehrerer LLMs zur Erfassung unterschiedlicher epistemischer Perspektiven. Jedes Modell bringt spezifische Trainingsdaten und algorithmische Vorprägungen ein. Die Divergenz zwischen Modellen wird dokumentiert statt harmonisiert.

Intersektionalität nach Kimberlé Crenshaw strukturiert die Analyse durch mehrdimensionale Kategorisierungsschemata. Bias wird nicht als eindimensionales Phänomen verstanden, sondern als Verschränkung von Gender, Race, Class, Ability und weiteren Diskriminierungsachsen. Die Literaturanalyse erfasst diese Ko-Konstitution durch entsprechende Extraktionskategorien.

Response-Ability, ebenfalls von Haraway geprägt, strukturiert die Expert-in-the-Loop-Validierung als aktive Wissensproduktion statt bloßer Qualitätskontrolle. Menschliche Expertise interveniert an kritischen Entscheidungspunkten und übernimmt Verantwortung für methodische Entscheidungen. Dies unterscheidet den Ansatz von rein automatisierten Reviews.

## Methodischer Ansatz

Der Workflow kombiniert proprietäre Deep Research-Mechanismen mit etablierten akademischen Standards. Vier KI-Modelle (ChatGPT, Claude, Gemini, Perplexity) werden mit identischen parametrischen Prompts zur Literaturidentifikation eingesetzt. Die Ergebnisse werden in RIS-Format standardisiert und in Zotero konsolidiert. Dies ersetzt traditionelle Datenbanksuchen durch modellbasierte Recherche.

Die Bewertung folgt PRISMA 2020 Standards mit Expert-in-the-Loop-Integration. Jede Quelle durchläuft Relevanz- und Qualitätsbewertung anhand expliziter Kriterien. Excel-basierte Assessment-Templates ermöglichen strukturierte Dokumentation. Die Einschlussentscheidungen werden mit Begründungen versehen und sind nachvollziehbar.

Die Synthese erfolgt durch Python-gestützte Dokumentenverarbeitung und Obsidian-Wissensgraph-Generierung. PDFs werden via Docling zu Markdown konvertiert, durch Claude Haiku 4.5 in fünf Stufen zusammengefasst und als vernetzte Konzepte organisiert. Die Pipeline ist vollständig dokumentiert und reproduzierbar im GitHub-Repository FemPrompt_SozArb.

## Scope und Grenzen

Das Projekt liefert einen systematischen Literature Review zu Bias in LLMs mit Fokus auf Soziale Arbeit. Es dokumentiert einen methodischen Workflow für LLM-gestützte Reviews mit feministischer Perspektive. Es schafft eine strukturierte Wissensbasis für die Entwicklung praktischer Handlungsempfehlungen.

Das Projekt liefert keine empirische Validierung von Prompting-Strategien. Es beantwortet nicht durch eigene Experimente, ob spezifische Formulierungen Bias verstärken oder reduzieren. Es bietet keinen fertigen Prompting-Leitfaden, sondern die evidenzbasierte Grundlage für dessen Entwicklung. Die Übertragbarkeit von Forschungsbefunden auf konkrete Praxissituationen muss in nachgelagerten Schritten geprüft werden.

Die methodischen Grenzen umfassen die Zirkularität der LLM-gestützten LLM-Kritik, die Opazität der verwendeten Modelle, die potenzielle Reproduktion sprachlicher und geografischer Bias durch englischsprachige Modelle und die Abhängigkeit von proprietären Systemen. Diese Limitationen werden transparent dokumentiert und reflektiert, können aber nicht vollständig eliminiert werden.

## Status

### Infrastruktur

Die technische Infrastruktur ist vollständig entwickelt und getestet. Der Master-Orchestrator run_pipeline.py koordiniert alle fünf Verarbeitungsstufen mit Checkpoint-Recovery und Stage-Selection. Die pipeline_config.yaml definiert alle operationalen Parameter. Das Skript getPDF_intelligent.py implementiert hierarchische PDF-Akquisition mit acht Fallback-Strategien. Das Skript pdf-to-md-converter.py nutzt Docling für strukturerhaltende Konversion. Das Skript summarize-documents.py führt fünfstufige Claude Haiku 4.5-Analyse durch. Das Skript generate_obsidian_vault_improved.py generiert navigierbare Obsidian-Vaults mit Konzeptextraktion. Das Skript test_vault_quality.py validiert Vault-Qualität systematisch.

Die Assessment-Infrastruktur verbindet Zotero mit Excel-basierten Bewertungen. Das Skript zotero_to_excel.py extrahiert direkt via Zotero API. Das Skript excel_to_ris.py führt Bewertungen zurück in RIS-Format. Die Roundtrip-Validierung durch test_assessment_workflow.py sichert Datenintegrität. Alle Python-Abhängigkeiten außer google-generativeai sind installiert. Die requirements.txt muss aktualisiert werden.

### Datensammlung

Die Multi-Modell-Recherche wurde durchgeführt. Vier KI-Modelle (ChatGPT Research Mode, Claude Research, Gemini Deep Think, Perplexity Deep Research) produzierten modellspezifische Bibliographien. Die Ergebnisse wurden in Zotero "_DEEPRESEARCH"-Collections organisiert. Der konsolidierte Export umfasst 326 Einträge in zotero_vereinfacht.json für beide Projekte (FemPrompt und SozArb).

Das LLM-basierte Assessment wurde mit Claude Haiku 4.5 durchgeführt. Für SozArb wurden 325 Papers bewertet mit 100% Erfolgsrate (24 Minuten, $0.58 Kosten). Die Ergebnisse: 222 Include (68.3%), 83 Exclude (25.5%), 20 Unclear (6.2%). Das 5-dimensionale Bewertungsschema erfasst AI/LLM-Kompetenzen, Vulnerable Gruppen, Bias, praktische Implementation und professionellen Kontext auf einer 0-3 Skala.

### Pipeline-Execution

#### FemPrompt (Projekt 1 - Komplett)
Die vollständige Pipeline wurde End-to-End durchlaufen:
- PDFs: 61 Dateien in analysis/pdfs/ akquiriert
- Markdown: 26 Dateien in analysis/markdown_papers/ konvertiert
- Summaries: 10 Legacy-Summaries in analysis/summaries_final/ vorhanden
- Vault: FemPrompt_Vault/ generiert mit 16 Paper-Notizen, 2 Concept-Notizen
- Top-Konzepte: Intersectionality (107x erwähnt), Feminist AI (21x), Bias Mitigation (19x)
- Status:  Abgeschlossen, Wissensgraph verfügbar

#### SozArb (Projekt 2 - In Progress)
Die Pipeline befindet sich im erweiterten Summarization-Stadium:
- Assessment: ✅ 325/325 Papers (100% Erfolgsrate)
- PDFs: 47 Dateien in analysis/pdfs_socialai/ (von 222 Include-Papers)
  - Nur automatisch aus Zotero-Bibliothek verfügbare PDFs verarbeitet
  - Hierarchische Akquisitionsstrategie implementiert, aber nicht vollständig ausgeschöpft
- Markdown: 47 Dateien in analysis/markdown_papers_socialai/ konvertiert
  - Validation: 46 PASS, 1 FAIL (corrupted file detected and excluded)
- Summaries: ✅ 75 Enhanced Summaries v2.0 KOMPLETT (2025-11-16)
  - Quality Score: 76.1/100 durchschnittlich
  - Distribution: 21 excellent (>80), 17 good (60-79), 9 fair (<60)
  - Features: Multi-pass analysis, quality scores, cross-validation, practical implications
  - Cost: ~$2.00 actual, ~$7.50 saved through validation tool
- Vault: ⏳ Generation mit enhanced summaries ausstehend
- Status: 75 Enhanced Summaries v2.0 von 222 Include-Papers generiert

### Nächste Schritte

Für SozArb:
1. ✅ ~~PDF-Akquisition erweitern~~ - 47 Papers verfügbar
2. ✅ ~~Summarization durchführen~~ - Enhanced v2.0 KOMPLETT (75 papers, 76.1/100 avg)
3. Vault-Generierung erweitern: Integration der 75 enhanced summaries in SozArb_Research_Vault
4. Konzeptextraktion: Analyse der Frequenzen und Vernetzung aus enhanced summaries (YAML keywords)
5. Optional: PDF-Akquisition für weitere 161 Include-Papers (175 total statt 47)

Für Paper-Finalisierung:
- Aktualisierung der Zahlen in README.md (222/83/20)
- Klarstellung des Work-in-Progress-Status für SozArb im Paper
- Dokumentation der PDF-Coverage-Limitation als methodische Reflexion
