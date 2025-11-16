---
type: knowledge
created: 2025-01-31
updated: 2025-11-07
tags: [prisma, workflow, deep-research, assessment, synthesis, systematic-review]
status: active
---

# Methodik und Prozess

Dieses Dokument integriert methodische Grundlagen (PRISMA 2020, Qualitätsbewertung, alternative Review-Standards) mit der operationalen Prozessdurchführung (Multi-Modell-Recherche, Assessment, Pipeline-Execution, Wissenssynthese).

---

## PRISMA 2020 Framework

Der Workflow folgt den PRISMA 2020 Standards für systematische Reviews. Die 27-Item-Checkliste strukturiert Identifikation, Screening, Eligibility-Assessment und finale Inklusion. Das PRISMA-Flow-Diagramm dokumentiert den Selektionsprozess mit Quantifizierung jeder Phase und expliziter Benennung von Ausschlussgründen. Die Transparenz aller Entscheidungen ermöglicht externe Validierung und kritische Evaluation.

Die Identifikationsphase nutzt KI-gestützte Deep Research statt traditioneller Datenbanksuchen. Vier Modelle (ChatGPT Research Mode, Claude Research, Gemini Deep Think, Perplexity Deep Research) generieren bibliographische Empfehlungen basierend auf parametrischen Prompts. Die 326 konsolidierten Einträge aus beiden Projekten (FemPrompt und SozArb) werden in Zotero-Group-Libraries organisiert und nach Modellherkunft aufgeschlüsselt dokumentiert. Duplikate zwischen Modellen werden identifiziert und entfernt. Diese Abweichung von Standard-Datenbanksuchen wird explizit benannt und begründet.

Das Screening erfolgt in zwei Stufen. Title-Abstract-Screening filtert nach Relevanzkriterien mit dokumentierten Ausschlussgründen. Volltext-Assessment prüft gegen definierte Einschlusskriterien mit kategorisierten Ausschlussgründen wie Wrong Population, Wrong Intervention, Wrong Outcome, Wrong Study Design, No Full Text. Die Excel-basierte Dokumentation erfasst Entscheidungen mit Begründungen und Confidence-Level.

Die Berichterstattung erweitert PRISMA um KI-spezifische Elemente. Die verwendeten Modelle werden mit Versionen spezifiziert. Die Prompt-Templates werden vollständig dokumentiert. Die Multi-Modell-Strategie wird methodisch begründet. Die Validierungsansätze für KI-Outputs werden beschrieben. Diese Erweiterungen adressieren die Besonderheiten algorithmischer Recherche unter Beibehaltung der PRISMA-Kernprinzipien.

---

## Multi-Modell-Recherche (Prozess)

Der Workflow beginnt mit paralleler Literaturidentifikation durch vier KI-Modelle. ChatGPT, Claude, Gemini und Perplexity erhalten identische parametrische Prompts mit strukturierten Komponenten. Die Rolle definiert die Expertenperspektive als Literature Review Spezialist für feministische KI-Forschung in Sozialer Arbeit. Die Aufgabe spezifiziert die Erstellung einer annotierten Bibliographie mit strukturierten Metadaten.

Der Kontext bettet Forschungsziele ein durch Fokus auf Bias-Mechanismen, Intersektionalität und Prompting-Strategien. Der zeitliche Scope priorisiert Publikationen der letzten fünf Jahre mit Einschluss seminal works. Der geografische Fokus bleibt international mit Beachtung nicht-westlicher Perspektiven. Die Analyseschritte strukturieren den Prozess durch Identifikation von zwanzig bis dreißig hochrelevanten Publikationen, Priorisierung peer-reviewed Journals und interdisziplinäre Perspektiven.

Das Output-Format standardisiert Ergebnisse mit vollständigen bibliographischen Angaben im APA 7 Format, einhundertfünfzig bis zweihundert Wörter strukturierte Zusammenfassung, Relevanz-Score mit Begründung, methodischer Ansatz, Kernbefunde, theoretische Verortung und Verbindungen zu anderen Quellen. Diese Strukturierung ermöglicht direkte Vergleichbarkeit zwischen Modell-Outputs.

Die parallele Ausführung erfolgt manuell durch Copy-Paste des identischen Prompts in vier verschiedene Deep Research-Interfaces (ChatGPT Research Mode, Claude Research, Gemini Deep Think, Perplexity Deep Research). Die Ergebnisse werden in Zotero-Collections mit Präfix "_DEEPRESEARCH" organisiert, nicht als Dateisystem-Verzeichnisse im Git-Repository. Die modellspezifische Organisation erhält die Zuordnung für spätere Divergenz-Analyse. Jedes Modell produziert typischerweise zwischen drei und fünfzehn Empfehlungen abhängig von Trainingsdaten und Ausgabelängen-Limitationen.

---

## RIS-Standardisierung (Prozess)

Die heterogenen Modell-Outputs werden in bibliographisches RIS-Format konvertiert. RIS ermöglicht standardisierten Import in Referenzmanagement-Software wie Zotero. Die Konversion erfolgt durch erneute KI-Nutzung mit spezialisierten Prompts. Die Modelle werden aufgefordert, ihre eigenen Outputs in strukturierte RIS-Tags zu transformieren.

Die RIS-Konvertierungs-Prompts fordern Beibehaltung aller Metadaten und Ergänzung fehlender Standardfelder. Die Tags umfassen TY für Dokumenttyp, AU für Autoren, TI für Titel, JO für Journal, VL für Volume, IS für Issue, SP und EP für Seitenangaben, PY für Publikationsjahr, DO für DOI, AB für Abstract und KW für Keywords. Die Validierung prüft DOI-Format gegen CrossRef-Muster. Unsichere Angaben werden mit N1-Note-Tag markiert.

Die RIS-Konversion erfolgt temporär via Claude-Projekt-Prompt "to-Zotero" für direkten Zotero-Import, nicht als permanente Dateisystem-Artefakte. Die Standardisierung ermöglicht aggregierte Verarbeitung im nächsten Schritt. Der konsolidierte Export aus Zotero erfolgt als zotero_vereinfacht.json (326 Einträge für FemPrompt und SozArb).

---

## Zotero-Integration (Prozess)

Die RIS-Dateien werden sequenziell in Zotero importiert. Jeder Import wird einer modellspezifischen Collection zugeordnet. Die Collections claude_deep_research, gemini_deep_research, openai_deep_research und perplexity_deep_research organisieren Einträge nach Herkunft. Diese Organisation erhält Provenienz-Information für spätere Analyse modellspezifischer Präferenzen.

Nach Import erfolgt manuelle Qualitätskontrolle. Die Duplikaterkennung identifiziert identische Publikationen über verschiedene Modelle. Zotero's Duplicate Detection nutzt Title-Matching und DOI-Vergleich. Duplikate werden zusammengeführt unter Erhalt der Modell-Tags. Die Metadaten-Korrektur ergänzt fehlende Informationen wie Autoren-ORCID, vollständige Journal-Namen oder korrekte Publikationsdaten.

Die PDF-Attachment-Phase versucht automatische Downloads über Zotero's Browser-Integration und Connector. Fehlende PDFs werden manuell beschafft oder für spätere automatisierte Akquisition markiert. Die Zotero-Bibliothek wird als zotero_vereinfacht.json exportiert für Pipeline-Input. Dieser Export enthält essenzielle Felder wie key, itemType, title, creators, date, DOI, url und abstractNote ohne vollständige Attachment-Metadaten.

---

## Qualitätsbewertung (Methodik)

Die Qualitätsbewertung operiert auf drei Ebenen. Bibliographische Validierung prüft die Existenz und Korrektheit von Publikationen durch DOI-Validierung über CrossRef API, Autoren-Disambiguierung via ORCID, Journal-Verifikation gegen DOAJ und Beall's List, sowie Abgleich mit Verlags-Websites. Duplikaterkennung erfolgt durch exakte Titel-Matches, Fuzzy-Matching mit Levenshtein-Distanz, DOI-Vergleich und Abstrakt-Ähnlichkeit über Cosine-Similarity.

Die methodische Rigorosität wird studientypspezifisch bewertet. Empirische Studien werden evaluiert nach Stichprobengröße und Repräsentativität, Methodentransparenz und Reproduzierbarkeit, statistischer Power und Effektstärken, sowie Limitations-Diskussion. Theoretische Arbeiten werden bewertet nach konzeptueller Klarheit, Argumentationslogik, Integration bestehender Literatur und Innovation. Policy-Dokumente unterliegen Kriterien wie Datenquellen, Interessenkonflikte, Stakeholder-Repräsentation und Implementierbarkeit.

Die KI-Output-Validierung adressiert modellspezifische Limitationen. Halluzinationserkennung erfolgt durch Validierung aller Zitate gegen Originaltexte, Abgleich statistischer Angaben mit Primärquellen, Identifikation chronologischer Inkonsistenzen und Markierung nicht-existenter Autoren oder Journals. Sycophancy-Mitigation nutzt neutrale Prompt-Formulierungen ohne Leading Questions, explizite Aufforderung zu kritischer Analyse und Vergleich der Outputs verschiedener Modelle.

Das Bewertungsschema kombiniert quantitative und qualitative Dimensionen. Die fünfstufige Relevanzbewertung reicht von zentral relevant über teilweise relevant bis irrelevant. Die Qualitätskategorisierung erfolgt dreistufig in hoch, mittel und niedrig mit spezifischen Kriterien für jede Stufe. Die Einschlussentscheidung basiert auf kombinierter Bewertung mit Schwellenwerten für Relevanz und Qualität. Unsicherheiten werden durch Confidence-Level dokumentiert und triggern Second-Review oder Diskussion.

---

## PRISMA-Assessment (Prozess)

Die konsolidierte Bibliothek durchläuft strukturiertes PRISMA-konformes Screening. Das Excel-Template wird durch zotero_to_excel.py generiert via direktem Zotero-API-Zugriff oder aus exportiertem JSON. Jede Zeile repräsentiert eine Publikation mit Spalten für bibliographische Basisdaten und Bewertungsfelder.

Die Relevanz-Bewertung erfolgt auf fünfstufiger Skala. Stufe fünf markiert zentral relevante und unverzichtbare Publikationen. Stufe vier kennzeichnet relevante Beiträge mit wichtigen Aspekten. Stufe drei erfasst teilweise Relevanz mit Randaspekten. Stufe zwei notiert marginale Relevanz mit minimalen Bezügen. Stufe eins identifiziert irrelevante oder off-topic Einträge. Die Bewertung bezieht sich explizit auf die definierte Forschungsfrage.

Die Qualitäts-Kategorisierung differenziert zwischen hoch für methodische Exzellenz, mittel für solide Arbeit mit kleineren Schwächen und niedrig für erhebliche methodische Mängel. Die studientypspezifischen Kriterien nutzen RoB 2 für RCTs, CASP für qualitative Studien und MMAT für Mixed-Methods. Die Einschlussentscheidung kombiniert Relevanz und Qualität mit Schwellenwert Relevanz größergleich drei und Qualität größergleich mittel.

Die Ausschlussgründe werden standardisiert codiert. Wrong Population markiert Studien außerhalb Sozialarbeit oder verwandter Felder. Wrong Intervention identifiziert Arbeiten ohne LLM-Fokus. Wrong Outcome kennzeichnet fehlende Bias- oder Prompting-Analyse. Wrong Study Design erfasst methodisch ungeeignete Arbeiten. No Full Text notiert mangelnden Zugang. Die Notes-Spalte ermöglicht qualitative Begründungen und Kontextinformationen.

---

## Alternative Review-Standards (Methodik)

Neben PRISMA integriert der Workflow komplementäre Frameworks. Das JBI Manual for Evidence Synthesis unterstützt elf Review-Typen mit pluralistischer Evidenzauffassung und pragmatischem Ethos. Die Integration erfolgt primär durch JBI Critical Appraisal Tools für studientypspezifische Qualitätsbewertung. Dreizehn Checklisten decken Analytical Cross Sectional, Case Control, Case Reports, Cohort Studies, Diagnostic Test Accuracy, Economic Evaluations, Prevalence Studies, Qualitative Research, Quasi-Experimental, RCTs, Systematic Reviews und Text and Opinion ab.

Das Cochrane Handbook Version 6.5 fokussiert auf Gesundheitsinterventionen mit rigorosen methodischen Anforderungen. Relevant sind das RoB 2 Tool für randomisierte kontrollierte Studien mit Bewertung von fünf Bias-Domänen und ROBINS-I für nicht-randomisierte Interventionsstudien mit sieben Bias-Domänen. Die aktuelle Version enthält Erweiterungen zu Netzwerk-Meta-Analysen, Equity-Überlegungen und komplexen Interventionen.

ENTREQ definiert Standards für qualitative Evidenzsynthesen mit einundzwanzig Items für transparente Berichterstattung. Die Anforderungen an Reflexivität und theoretische Positionierung ergänzen PRISMA für qualitative Studien. Das MMAT Version 2018 bewertet Mixed-Methods-Studien mit fünf studientypspezifischen Kriterien für qualitative Studien, randomisierte kontrollierte Studien, nicht-randomisierte Studien, quantitative deskriptive Studien und Mixed-Methods-Designs.

Die Auswahl der Standards erfolgt pragmatisch nach Forschungsfrage und Evidenztyp. PRISMA bildet das Reporting-Backbone, während JBI und Cochrane methodische Tiefe für spezifische Studientypen liefern. ENTREQ ergänzt für qualitative Synthesen. Die Standards sind komplementär nutzbar und werden als YAML-Strukturen in Obsidian-Templates implementiert für programmatische Auswertung.

---

## Assessment-Workflow (Methodik)

Das Assessment erfolgt in einem strukturierten Excel-basierten Workflow mit PRISMA-konformen Kategorien. Die Zotero-Integration ermöglicht bidirektionale Datenflüsse zwischen bibliographischer Verwaltung und Bewertung. Python-Skripte konvertieren zwischen RIS-Format und Excel-Templates. Die zotero_to_excel.py nutzt die Zotero API für direkten Export. Die excel_to_ris.py führt Bewertungen zurück in bibliographische Metadaten.

Das Excel-Template enthält strukturierte Bewertungsspalten. Relevance_Score auf fünfstufiger Skala von zentral bis irrelevant. Quality auf dreistufiger Kategorisierung in hoch, mittel, niedrig. Decision als binäre Einschlussentscheidung mit Optionen Include, Exclude, Unclear. Exclusion_Reason mit standardisierten Codes für verschiedene Ausschlussgründe. Notes für qualitative Begründungen und Kontextinformationen. Confidence_Level zur Markierung von Unsicherheiten.

Die Bewertung erfolgt durch Expert-in-the-Loop-Validierung. Jede Quelle wird einzeln gegen definierte Kriterien geprüft. Die Entscheidungen werden mit Begründungen versehen. Unsicherheiten werden explizit dokumentiert statt verschleiert. Bei Confidence-Level niedrig oder mittel erfolgt Second-Review oder Diskussion. Die systematische Dokumentation aller Bewertungen ermöglicht spätere Analyse von Entscheidungsmustern und potentiellen Bias.

Die PRISMA-Tag-Enrichment erfolgt nach Abschluss der Bewertung. Der excel_to_ris.py führt Assessments zurück in RIS-Metadaten. Include/Exclude/Unclear-Tags werden als Custom Fields ergänzt. Die Ausschlussgründe werden strukturiert erfasst. Die angereicherten RIS-Dateien können zurück in Zotero importiert werden. Dies schließt den Kreis zwischen bibliographischer Verwaltung und systematischer Bewertung.

---

## Pipeline-Execution (Prozess)

Die technische Verarbeitung beginnt mit PDF-Akquisition durch getPDF_intelligent.py. Das Skript liest zotero_vereinfacht.json und iteriert über alle Einträge mit Include-Decision. Die hierarchische Strategie prüft zuerst lokale Zotero-Attachments, dann DOI-basierte Downloads, ArXiv-Links, Semantic Scholar, Unpaywall, BASE und verlagsspezifische Parser. Die erfolgreichen Downloads landen in analysis/pdfs mit Logging in acquisition_log.json.

Die PDF-zu-Markdown-Konversion erfolgt durch pdf-to-md-converter.py mit Docling. Jedes PDF wird in strukturiertes Markdown transformiert unter Beibehaltung von Überschriften, Listen, Tabellen und Zitationen. Die MD5-Hashes verhindern Duplikat-Verarbeitung bei Pipeline-Reruns. Die Ausgabe-Dateien in analysis/markdown_papers folgen normalisierten Namenskonventionen. Die Metadaten in conversion_metadata.json dokumentieren Erfolge und Fehler.

Die Markdown-Qualitätsvalidierung durch validate_markdown_quality.py erfolgt vor der teuren KI-Verarbeitung. Das Tool detektiert GLYPH-Platzhalter, misst Unicode-Fehler-Dichte und berechnet Text-zu-Rauschen-Verhältnisse. Korrupte Dateien werden identifiziert und von der Verarbeitung ausgeschlossen. Diese Pre-Processing-Validierung verhindert verschwendete API-Kosten auf unbrauchbaren Eingaben.

Die KI-gestützte Zusammenfassung durch summarize_documents_enhanced.py (v2.0) verarbeitet validierte Markdown-Dateien mit Multi-Pass-Analyse. Der intelligente Chunking-Algorithmus gewährleistet hundertprozentige Dokumentenabdeckung. Die Cross-Validation identifiziert Inkonsistenzen zwischen Summary und Quelltext. Die Quality-Scores bewerten Accuracy, Completeness, Structure und Actionability. Die Stakeholder-spezifischen Implikationen adressieren Social Workers, Organizations, Policymakers und Researchers. Die Limitations-Sektion dokumentiert offene Fragen.

Die generierten Summaries landen in analysis/summaries_final als summary_[normalized_title].md. Die YAML-Frontmatter enthält Felder wie keywords, methods, theories, sample_size, geographic_scope und temporal_scope. Der Markdown-Body präsentiert die bereinigte Zusammenfassung. Die batch_metadata.json aggregiert Verarbeitungsmetriken wie Gesamtzeit, Erfolgsrate und Fehlertypen. Das Rate-Limiting mit zehn Sekunden Delay zwischen Requests verhindert API-Throttling.

---

## Datenextraktion (Methodik)

Die strukturierte Datenextraktion nutzt standardisierte Templates in Obsidian. Bibliographische Basisdaten umfassen Autoren mit Affiliationen, Publikationsjahr und Typ, Journal oder Konferenz, DOI und alternative Identifier. Diese Metadaten werden automatisch aus RIS-Importen übernommen und manuell validiert. Die YAML-Frontmatter speichert strukturierte Informationen für programmatische Verarbeitung.

Inhaltliche Kernelemente erfassen die wissenschaftliche Substanz. Die Forschungsfrage oder Zielsetzung wird explizit formuliert. Der theoretische Rahmen und Kernkonzepte werden identifiziert. Das methodische Design inkludiert Ansatz, Sample und Instrumente. Die Hauptergebnisse werden in standardisierter Form erfasst. Schlussfolgerungen und Implikationen werden extrahiert. Diese Strukturierung ermöglicht spätere thematische Synthese.

Kontextuelle Faktoren erfassen Rahmenbedingungen. Der geografische und kulturelle Kontext wird dokumentiert. Der zeitliche Rahmen der Datenerhebung wird notiert. Förderung und potentielle Interessenkonflikte werden erfasst. Limitationen laut Autoren werden übernommen. Diese Kontextualisierung ist zentral für die Interpretation der Befunde unter Perspektive des situierten Wissens.

Die Extraktion erfolgt durch Enhanced Summarization Pipeline v2.0 kombiniert mit automatischer Quality-Validation. Claude Haiku 4.5 generiert strukturierte Synthesen mit automatischer Metadaten-Extraktion und Quality-Scores. Die Cross-Validation detektiert Halluzinationen und Inkonsistenzen. Die bidirektionale Integration von Multi-Pass-Analyse und Quality-Metrics optimiert Effizienz unter Beibehaltung von Qualität. Aktuelle Ergebnisse (SozArb, 47 Papers): durchschnittliche Quality-Score von 76.1/100 mit 45% excellent-rated Summaries.

---

## Wissenssynthese (Methodik + Prozess)

Die Synthese erfolgt durch vernetzte Wissensstrukturen in Obsidian. Die Vault-Organisation vermeidet Fragmentierung durch kohärente Narrative statt atomisierter Fakten. Papers werden mit Concepts verlinkt, Concepts untereinander vernetzt. Die Struktur des Knowledge Graphs reflektiert thematische Zusammenhänge und ermöglicht explorative Navigation.

### Wissensgraph-Generierung (Prozess)

Die Obsidian-Vault-Generierung durch generate_obsidian_vault_improved.py transformiert lineare Summaries in vernetzte Wissensstrukturen. Die Konzeptextraktion scannt alle Summary-Dateien nach Bias-Terminologie und Mitigation-Strategien. Die Pattern-basierte Erkennung identifiziert mehrere hundert Kandidaten-Konzepte. Die Normalisierung konsolidiert Varianten durch Synonym-Mapping-Dictionary.

Die Deduplizierung nutzt Fuzzy-Matching für Schreibvarianten und eliminiert Fragmente. Die Frequenz-basierten Filter entfernen Noise mit weniger als zwei Vorkommen. Die Frequency-Caps limitieren überrepräsentierte generische Begriffe. Die intersektionale Konsolidierung prüft Eigenständigkeit spezifischer Konzepte versus Subsumption unter übergeordnete Kategorien. Die finale Menge umfasst typischerweise dreißig bis vierzig hochwertige Konzepte.

Die Kategorisierung ordnet Konzepte in Bias Types und Mitigation Strategies. Jedes Konzept erhält eine Markdown-Datei im Concepts-Verzeichnis mit Definition, Kontext, Backlinks zu allen relevanten Papers und weiterführenden Links. Die Papers werden im Papers-Verzeichnis mit Frontmatter-Metadaten, Zusammenfassung und Forward-Links zu diskutierten Konzepten gespeichert. Die bidirektionale Verlinkung ermöglicht Navigation in beide Richtungen.

Das MASTER_MOC.md fungiert als Navigationsindex mit kategorisierten Listen aller Papers und Concepts. Die Struktur vermeidet isolierte Knoten durch vollständige Vernetzung. Die Markdown-Syntax folgt Obsidian-Konventionen mit Wiki-Style-Links in doppelten eckigen Klammern. Die Organisation ermöglicht explorative Navigation ohne Dead Ends und visuelle Graph-Darstellung in Obsidian's Graph View.

### Konzeptextraktion (Methodik)

Die Konzeptextraktion nutzt Pattern-basierte Erkennung mit Normalisierung und Deduplizierung. Ein Synonym-Mapping-Dictionary mit hundertachtzig Einträgen konsolidiert Varianten zu kanonischen Formen. Die Reduktion erfolgt durch Frequenz-Thresholds, Fragment-Elimination und intersektionale Konsolidierung. Das System kategorisiert Konzepte in Bias Types und Mitigation Strategies.

Die finale Synthese aggregiert Haupterkenntnisse über individuelle Studien hinweg. Konvergente Befunde werden identifiziert und dokumentiert. Divergente Ergebnisse werden nicht harmonisiert, sondern als Evidenz für Komplexität interpretiert. Forschungslücken werden durch systematischen Vergleich zwischen Suchstrategie und tatsächlichen Funden identifiziert. Die Synthese balanciert systematische Aggregation mit interpretativer Tiefe.

---

## Qualitätssicherung (Prozess)

Die finale Validierung erfolgt durch test_vault_quality.py mit systematischen Checks. Die Konzept-Uniqueness prüft auf Duplikate durch normalisierte Namensvergleiche. Die Metadata-Completeness verifiziert YAML-Frontmatter-Vollständigkeit für alle Dateien. Die Link-Integrity analysiert alle Obsidian-Links auf Existenz der Zieldateien. Die bidirektionale Verlinkung wird durch Kreuz-Verifikation geprüft.

Das Scoring-System aggregiert Einzelmetriken zu Gesamtbewertung. Die Uniqueness-Rate sollte über fünfundneunzig Prozent liegen. Die Metadata-Completeness-Rate zielt auf hundert Prozent. Die Link-Integrity toleriert unter zehn broken Links bei typischen Korpusgrößen. Der Output erfolgt als farbcodierter Konsolenreport mit Warnungen für problematische Bereiche.

Die Vault-Iteration nutzt Qualitätsfeedback für Verbesserungen. Bei niedrigen Uniqueness-Scores wird das Synonym-Mapping erweitert. Bei Metadata-Incompleteness werden Extraktions-Prompts präzisiert. Bei Link-Integrity-Problemen wird die Konzept-Matching-Logik angepasst. Die iterative Verfeinerung über mehrere Pipeline-Läufe optimiert Vault-Qualität ohne manuelle Intervention in jedem Einzelfall.

---

*Dokumentenversion: 1.1 (Enhanced Pipeline v2.0 Integration)*
*Erstellt: 2025-01-31*
*Letzte Aktualisierung: 2025-11-16*
*Autor: AI-gestützter systematischer Literaturreview*
