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

Die Synthese erfolgt durch Python-gestützte Dokumentenverarbeitung und Obsidian-Wissensgraph-Generierung. PDFs werden via Docling zu Markdown konvertiert, durch Gemini in fünf Stufen zusammengefasst und als vernetzte Konzepte organisiert. Die Pipeline ist vollständig dokumentiert und reproduzierbar im GitHub-Repository FemPrompt_SozArb.

## Scope und Grenzen

Das Projekt liefert einen systematischen Literature Review zu Bias in LLMs mit Fokus auf Soziale Arbeit. Es dokumentiert einen methodischen Workflow für LLM-gestützte Reviews mit feministischer Perspektive. Es schafft eine strukturierte Wissensbasis für die Entwicklung praktischer Handlungsempfehlungen.

Das Projekt liefert keine empirische Validierung von Prompting-Strategien. Es beantwortet nicht durch eigene Experimente, ob spezifische Formulierungen Bias verstärken oder reduzieren. Es bietet keinen fertigen Prompting-Leitfaden, sondern die evidenzbasierte Grundlage für dessen Entwicklung. Die Übertragbarkeit von Forschungsbefunden auf konkrete Praxissituationen muss in nachgelagerten Schritten geprüft werden.

Die methodischen Grenzen umfassen die Zirkularität der LLM-gestützten LLM-Kritik, die Opazität der verwendeten Modelle, die potenzielle Reproduktion sprachlicher und geografischer Bias durch englischsprachige Modelle und die Abhängigkeit von proprietären Systemen. Diese Limitationen werden transparent dokumentiert und reflektiert, können aber nicht vollständig eliminiert werden.

## Status

### Infrastruktur

Die technische Infrastruktur ist vollständig entwickelt und getestet. Der Master-Orchestrator run_pipeline.py koordiniert alle fünf Verarbeitungsstufen mit Checkpoint-Recovery und Stage-Selection. Die pipeline_config.yaml definiert alle operationalen Parameter. Das Skript getPDF_intelligent.py implementiert hierarchische PDF-Akquisition mit acht Fallback-Strategien. Das Skript pdf-to-md-converter.py nutzt Docling für strukturerhaltende Konversion. Das Skript summarize-documents.py führt fünfstufige Gemini-Analyse durch. Das Skript generate_obsidian_vault_improved.py generiert navigierbare Obsidian-Vaults mit Konzeptextraktion. Das Skript test_vault_quality.py validiert Vault-Qualität systematisch.

Die Assessment-Infrastruktur verbindet Zotero mit Excel-basierten Bewertungen. Das Skript zotero_to_excel.py extrahiert direkt via Zotero API. Das Skript excel_to_ris.py führt Bewertungen zurück in RIS-Format. Die Roundtrip-Validierung durch test_assessment_workflow.py sichert Datenintegrität. Alle Python-Abhängigkeiten außer google-generativeai sind installiert. Die requirements.txt muss aktualisiert werden.

### Datensammlung

Die Multi-Modell-Recherche wurde durchgeführt. Vier KI-Modelle produzierten modellspezifische Bibliographien. Die RIS-Standardisierung lieferte vier Dateien im to-Zotero Verzeichnis. Der Zotero-Import konsolidierte siebenundsechzig Einträge in modellspezifischen Collections. Der Export als zotero_vereinfacht.json und zotero_vollstaendig.json ist abgeschlossen. Die Zotero-Sammlungen-Struktur dokumentiert die Herkunft jeder Quelle.

Das Assessment-Template assessment.xlsx wurde generiert. Der Bewertungsstatus dieser Excel-Datei ist unklar. Die Include/Exclude-Entscheidungen müssen durch Expert-Review abgeschlossen werden. Die PRISMA-Flow-Dokumentation erfordert finale Zahlen nach Assessment-Abschluss.

### Pipeline-Execution

Die Pipeline-Execution für den aktuellen Korpus steht aus. Das analysis/pdfs Verzeichnis existiert nicht und enthält keine PDFs. Das analysis/markdown_papers Verzeichnis existiert nicht. Keine aktuellen Markdown-Konversionen wurden durchgeführt. Das analysis/summaries_final Verzeichnis enthält zehn Legacy-Summaries vom August 2025 für ein früheres Korpus. Keine aktuellen Gemini-Summaries für die siebenundsechzig Einträge liegen vor.

Der Obsidian-Vault FemPrompt_Vault wurde nicht für den aktuellen Korpus generiert. Das Verzeichnis existiert nicht im Repository. Legacy-Daten in summaries_final zeigen, dass die Pipeline früher erfolgreich lief. Die Quality-Scores in vault_test_report.json beziehen sich auf frühere Läufe. Die aktuelle Dokumentation in knowledge/ ersetzt die alten fragmentierten Docs.

### Nächste Schritte

Die Voraussetzungen für Pipeline-Execution sind geschaffen. Die Environment-Variable GEMINI_API_KEY muss gesetzt werden. Das Paket google-generativeai muss installiert werden. Die assessment.xlsx muss durch Experten-Review finalisiert werden. Nach Assessment-Abschluss erfolgt die vollständige Pipeline-Execution durch Ausführung von run_pipeline.py. Die generierten Summaries und der Obsidian-Vault bilden die Basis für die Wissenssynthese und späteren Prompting-Leitfaden.
