---
type: knowledge
created: 2025-01-31
tags: [workflow, deep-research, assessment, synthesis]
status: active
---

# Prozess

## Multi-Modell-Recherche

Der Workflow beginnt mit paralleler Literaturidentifikation durch vier KI-Modelle. ChatGPT, Claude, Gemini und Perplexity erhalten identische parametrische Prompts mit strukturierten Komponenten. Die Rolle definiert die Expertenperspektive als Literature Review Spezialist für feministische KI-Forschung in Sozialer Arbeit. Die Aufgabe spezifiziert die Erstellung einer annotierten Bibliographie mit strukturierten Metadaten.

Der Kontext bettet Forschungsziele ein durch Fokus auf Bias-Mechanismen, Intersektionalität und Prompting-Strategien. Der zeitliche Scope priorisiert Publikationen der letzten fünf Jahre mit Einschluss seminal works. Der geografische Fokus bleibt international mit Beachtung nicht-westlicher Perspektiven. Die Analyseschritte strukturieren den Prozess durch Identifikation von zwanzig bis dreißig hochrelevanten Publikationen, Priorisierung peer-reviewed Journals und interdisziplinäre Perspektiven.

Das Output-Format standardisiert Ergebnisse mit vollständigen bibliographischen Angaben im APA 7 Format, einhundertfünfzig bis zweihundert Wörter strukturierte Zusammenfassung, Relevanz-Score mit Begründung, methodischer Ansatz, Kernbefunde, theoretische Verortung und Verbindungen zu anderen Quellen. Diese Strukturierung ermöglicht direkte Vergleichbarkeit zwischen Modell-Outputs.

Die parallele Ausführung erfolgt manuell durch Copy-Paste des identischen Prompts in vier verschiedene Interfaces. Die Ergebnisse werden separat gespeichert in deep-research/Claude, deep-research/Gemini, deep-research/OpenAI und deep-research/Perplexity. Die modellspezifische Organisation erhält die Zuordnung für spätere Divergenz-Analyse. Jedes Modell produziert typischerweise zwischen drei und fünfzehn Empfehlungen abhängig von Trainingsdaten und Ausgabelängen-Limitationen.

## RIS-Standardisierung

Die heterogenen Modell-Outputs werden in bibliographisches RIS-Format konvertiert. RIS ermöglicht standardisierten Import in Referenzmanagement-Software wie Zotero. Die Konversion erfolgt durch erneute KI-Nutzung mit spezialisierten Prompts. Die Modelle werden aufgefordert, ihre eigenen Outputs in strukturierte RIS-Tags zu transformieren.

Die RIS-Konvertierungs-Prompts fordern Beibehaltung aller Metadaten und Ergänzung fehlender Standardfelder. Die Tags umfassen TY für Dokumenttyp, AU für Autoren, TI für Titel, JO für Journal, VL für Volume, IS für Issue, SP und EP für Seitenangaben, PY für Publikationsjahr, DO für DOI, AB für Abstract und KW für Keywords. Die Validierung prüft DOI-Format gegen CrossRef-Muster. Unsichere Angaben werden mit N1-Note-Tag markiert.

Die resultierenden RIS-Dateien werden als claude-deep-research-bibliography-1.ris, Gemini-deep-research-bibliography-1.ris, OpenAI-deep-research-bibliography-1.ris und perplexity-deep-research-bibliography-1.ris im to-Zotero-Verzeichnis gespeichert. Die Dateigröße variiert zwischen drei und vierzehn Kilobyte abhängig von Anzahl und Detailgrad der Einträge. Die Standardisierung ermöglicht aggregierte Verarbeitung im nächsten Schritt.

## Zotero-Integration

Die RIS-Dateien werden sequenziell in Zotero importiert. Jeder Import wird einer modellspezifischen Collection zugeordnet. Die Collections claude_deep_research, gemini_deep_research, openai_deep_research und perplexity_deep_research organisieren Einträge nach Herkunft. Diese Organisation erhält Provenienz-Information für spätere Analyse modellspezifischer Präferenzen.

Nach Import erfolgt manuelle Qualitätskontrolle. Die Duplikaterkennung identifiziert identische Publikationen über verschiedene Modelle. Zotero's Duplicate Detection nutzt Title-Matching und DOI-Vergleich. Duplikate werden zusammengeführt unter Erhalt der Modell-Tags. Die Metadaten-Korrektur ergänzt fehlende Informationen wie Autoren-ORCID, vollständige Journal-Namen oder korrekte Publikationsdaten.

Die PDF-Attachment-Phase versucht automatische Downloads über Zotero's Browser-Integration und Connector. Fehlende PDFs werden manuell beschafft oder für spätere automatisierte Akquisition markiert. Die Zotero-Bibliothek wird als zotero_vereinfacht.json exportiert für Pipeline-Input. Dieser Export enthält essenzielle Felder wie key, itemType, title, creators, date, DOI, url und abstractNote ohne vollständige Attachment-Metadaten.

## PRISMA-Assessment

Die konsolidierte Bibliothek durchläuft strukturiertes PRISMA-konformes Screening. Das Excel-Template wird durch zotero_to_excel.py generiert via direktem Zotero-API-Zugriff oder aus exportiertem JSON. Jede Zeile repräsentiert eine Publikation mit Spalten für bibliographische Basisdaten und Bewertungsfelder.

Die Relevanz-Bewertung erfolgt auf fünfstufiger Skala. Stufe fünf markiert zentral relevante und unverzichtbare Publikationen. Stufe vier kennzeichnet relevante Beiträge mit wichtigen Aspekten. Stufe drei erfasst teilweise Relevanz mit Randaspekten. Stufe zwei notiert marginale Relevanz mit minimalen Bezügen. Stufe eins identifiziert irrelevante oder off-topic Einträge. Die Bewertung bezieht sich explizit auf die definierte Forschungsfrage.

Die Qualitäts-Kategorisierung differenziert zwischen hoch für methodische Exzellenz, mittel für solide Arbeit mit kleineren Schwächen und niedrig für erhebliche methodische Mängel. Die studientypspezifischen Kriterien nutzen RoB 2 für RCTs, CASP für qualitative Studien und MMAT für Mixed-Methods. Die Einschlussentscheidung kombiniert Relevanz und Qualität mit Schwellenwert Relevanz größergleich drei und Qualität größergleich mittel.

Die Ausschlussgründe werden standardisiert codiert. Wrong Population markiert Studien außerhalb Sozialarbeit oder verwandter Felder. Wrong Intervention identifiziert Arbeiten ohne LLM-Fokus. Wrong Outcome kennzeichnet fehlende Bias- oder Prompting-Analyse. Wrong Study Design erfasst methodisch ungeeignete Arbeiten. No Full Text notiert mangelnden Zugang. Die Notes-Spalte ermöglicht qualitative Begründungen und Kontextinformationen.

## Pipeline-Execution

Die technische Verarbeitung beginnt mit PDF-Akquisition durch getPDF_intelligent.py. Das Skript liest zotero_vereinfacht.json und iteriert über alle Einträge mit Include-Decision. Die hierarchische Strategie prüft zuerst lokale Zotero-Attachments, dann DOI-basierte Downloads, ArXiv-Links, Semantic Scholar, Unpaywall, BASE und verlagsspezifische Parser. Die erfolgreichen Downloads landen in analysis/pdfs mit Logging in acquisition_log.json.

Die PDF-zu-Markdown-Konversion erfolgt durch pdf-to-md-converter.py mit Docling. Jedes PDF wird in strukturiertes Markdown transformiert unter Beibehaltung von Überschriften, Listen, Tabellen und Zitationen. Die MD5-Hashes verhindern Duplikat-Verarbeitung bei Pipeline-Reruns. Die Ausgabe-Dateien in analysis/markdown_papers folgen normalisierten Namenskonventionen. Die Metadaten in conversion_metadata.json dokumentieren Erfolge und Fehler.

Die KI-gestützte Zusammenfassung durch summarize-documents.py verarbeitet alle Markdown-Dateien sequenziell. Der fünfstufige Refinement-Prozess mit Claude Haiku 4.5 generiert strukturierte Synthesen. Die akademische Analyse extrahiert Forschungsfrage, Methodik, Ergebnisse und Theorie. Die strukturierte Synthese verdichtet zu fünfhundert Wörtern. Die kritische Validierung prüft Konsistenz. Die bereinigte Zusammenfassung komprimiert auf einhundertfünfzig Wörter. Die Metadaten-Extraktion generiert YAML-Frontmatter.

Die generierten Summaries landen in analysis/summaries_final als summary_[normalized_title].md. Die YAML-Frontmatter enthält Felder wie keywords, methods, theories, sample_size, geographic_scope und temporal_scope. Der Markdown-Body präsentiert die bereinigte Zusammenfassung. Die batch_metadata.json aggregiert Verarbeitungsmetriken wie Gesamtzeit, Erfolgsrate und Fehlertypen. Das Rate-Limiting mit zehn Sekunden Delay zwischen Requests verhindert API-Throttling.

## Wissensgraph-Generierung

Die Obsidian-Vault-Generierung durch generate_obsidian_vault_improved.py transformiert lineare Summaries in vernetzte Wissensstrukturen. Die Konzeptextraktion scannt alle Summary-Dateien nach Bias-Terminologie und Mitigation-Strategien. Die Pattern-basierte Erkennung identifiziert mehrere hundert Kandidaten-Konzepte. Die Normalisierung konsolidiert Varianten durch Synonym-Mapping-Dictionary.

Die Deduplizierung nutzt Fuzzy-Matching für Schreibvarianten und eliminiert Fragmente. Die Frequenz-basierten Filter entfernen Noise mit weniger als zwei Vorkommen. Die Frequency-Caps limitieren überrepräsentierte generische Begriffe. Die intersektionale Konsolidierung prüft Eigenständigkeit spezifischer Konzepte versus Subsumption unter übergeordnete Kategorien. Die finale Menge umfasst typischerweise dreißig bis vierzig hochwertige Konzepte.

Die Kategorisierung ordnet Konzepte in Bias Types und Mitigation Strategies. Jedes Konzept erhält eine Markdown-Datei im Concepts-Verzeichnis mit Definition, Kontext, Backlinks zu allen relevanten Papers und weiterführenden Links. Die Papers werden im Papers-Verzeichnis mit Frontmatter-Metadaten, Zusammenfassung und Forward-Links zu diskutierten Konzepten gespeichert. Die bidirektionale Verlinkung ermöglicht Navigation in beide Richtungen.

Das MASTER_MOC.md fungiert als Navigationsindex mit kategorisierten Listen aller Papers und Concepts. Die Struktur vermeidet isolierte Knoten durch vollständige Vernetzung. Die Markdown-Syntax folgt Obsidian-Konventionen mit Wiki-Style-Links in doppelten eckigen Klammern. Die Organisation ermöglicht explorative Navigation ohne Dead Ends und visuelle Graph-Darstellung in Obsidian's Graph View.

## Qualitätssicherung

Die finale Validierung erfolgt durch test_vault_quality.py mit systematischen Checks. Die Konzept-Uniqueness prüft auf Duplikate durch normalisierte Namensvergleiche. Die Metadata-Completeness verifiziert YAML-Frontmatter-Vollständigkeit für alle Dateien. Die Link-Integrity analysiert alle Obsidian-Links auf Existenz der Zieldateien. Die bidirektionale Verlinkung wird durch Kreuz-Verifikation geprüft.

Das Scoring-System aggregiert Einzelmetriken zu Gesamtbewertung. Die Uniqueness-Rate sollte über fünfundneunzig Prozent liegen. Die Metadata-Completeness-Rate zielt auf hundert Prozent. Die Link-Integrity toleriert unter zehn broken Links bei typischen Korpusgrößen. Der Output erfolgt als farbcodierter Konsolenreport mit Warnungen für problematische Bereiche.

Die Vault-Iteration nutzt Qualitätsfeedback für Verbesserungen. Bei niedrigen Uniqueness-Scores wird das Synonym-Mapping erweitert. Bei Metadata-Incompleteness werden Extraktions-Prompts präzisiert. Bei Link-Integrity-Problemen wird die Konzept-Matching-Logik angepasst. Die iterative Verfeinerung über mehrere Pipeline-Läufe optimiert Vault-Qualität ohne manuelle Intervention in jedem Einzelfall.
