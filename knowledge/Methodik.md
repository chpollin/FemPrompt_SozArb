---
type: knowledge
created: 2025-01-31
tags: [prisma, quality-criteria, assessment, systematic-review]
status: active
---

# Methodik

## PRISMA 2020 Framework

Der Workflow folgt den PRISMA 2020 Standards für systematische Reviews. Die 27-Item-Checkliste strukturiert Identifikation, Screening, Eligibility-Assessment und finale Inklusion. Das PRISMA-Flow-Diagramm dokumentiert den Selektionsprozess mit Quantifizierung jeder Phase und expliziter Benennung von Ausschlussgründen. Die Transparenz aller Entscheidungen ermöglicht externe Validierung und kritische Evaluation.

Die Identifikationsphase nutzt KI-gestützte Deep Research statt traditioneller Datenbanksuchen. Vier Modelle generieren bibliographische Empfehlungen basierend auf parametrischen Prompts. Die 67 initialen Einträge werden nach Modellherkunft aufgeschlüsselt dokumentiert. Duplikate zwischen Modellen werden identifiziert und entfernt. Diese Abweichung von Standard-Datenbanksuchen wird explizit benannt und begründet.

Das Screening erfolgt in zwei Stufen. Title-Abstract-Screening filtert nach Relevanzkriterien mit dokumentierten Ausschlussgründen. Volltext-Assessment prüft gegen definierte Einschlusskriterien mit kategorisierten Ausschlussgründen wie Wrong Population, Wrong Intervention, Wrong Outcome, Wrong Study Design, No Full Text. Die Excel-basierte Dokumentation erfasst Entscheidungen mit Begründungen und Confidence-Level.

Die Berichterstattung erweitert PRISMA um KI-spezifische Elemente. Die verwendeten Modelle werden mit Versionen spezifiziert. Die Prompt-Templates werden vollständig dokumentiert. Die Multi-Modell-Strategie wird methodisch begründet. Die Validierungsansätze für KI-Outputs werden beschrieben. Diese Erweiterungen adressieren die Besonderheiten algorithmischer Recherche unter Beibehaltung der PRISMA-Kernprinzipien.

## Qualitätsbewertung

Die Qualitätsbewertung operiert auf drei Ebenen. Bibliographische Validierung prüft die Existenz und Korrektheit von Publikationen durch DOI-Validierung über CrossRef API, Autoren-Disambiguierung via ORCID, Journal-Verifikation gegen DOAJ und Beall's List, sowie Abgleich mit Verlags-Websites. Duplikaterkennung erfolgt durch exakte Titel-Matches, Fuzzy-Matching mit Levenshtein-Distanz, DOI-Vergleich und Abstrakt-Ähnlichkeit über Cosine-Similarity.

Die methodische Rigorosität wird studientypspezifisch bewertet. Empirische Studien werden evaluiert nach Stichprobengröße und Repräsentativität, Methodentransparenz und Reproduzierbarkeit, statistischer Power und Effektstärken, sowie Limitations-Diskussion. Theoretische Arbeiten werden bewertet nach konzeptueller Klarheit, Argumentationslogik, Integration bestehender Literatur und Innovation. Policy-Dokumente unterliegen Kriterien wie Datenquellen, Interessenkonflikte, Stakeholder-Repräsentation und Implementierbarkeit.

Die KI-Output-Validierung adressiert modellspezifische Limitationen. Halluzinationserkennung erfolgt durch Validierung aller Zitate gegen Originaltexte, Abgleich statistischer Angaben mit Primärquellen, Identifikation chronologischer Inkonsistenzen und Markierung nicht-existenter Autoren oder Journals. Sycophancy-Mitigation nutzt neutrale Prompt-Formulierungen ohne Leading Questions, explizite Aufforderung zu kritischer Analyse und Vergleich der Outputs verschiedener Modelle.

Das Bewertungsschema kombiniert quantitative und qualitative Dimensionen. Die fünfstufige Relevanzbewertung reicht von zentral relevant über teilweise relevant bis irrelevant. Die Qualitätskategorisierung erfolgt dreistufig in hoch, mittel und niedrig mit spezifischen Kriterien für jede Stufe. Die Einschlussentscheidung basiert auf kombinierter Bewertung mit Schwellenwerten für Relevanz und Qualität. Unsicherheiten werden durch Confidence-Level dokumentiert und triggern Second-Review oder Diskussion.

## Alternative Review-Standards

Neben PRISMA integriert der Workflow komplementäre Frameworks. Das JBI Manual for Evidence Synthesis unterstützt elf Review-Typen mit pluralistischer Evidenzauffassung und pragmatischem Ethos. Die Integration erfolgt primär durch JBI Critical Appraisal Tools für studientypspezifische Qualitätsbewertung. Dreizehn Checklisten decken Analytical Cross Sectional, Case Control, Case Reports, Cohort Studies, Diagnostic Test Accuracy, Economic Evaluations, Prevalence Studies, Qualitative Research, Quasi-Experimental, RCTs, Systematic Reviews und Text and Opinion ab.

Das Cochrane Handbook Version 6.5 fokussiert auf Gesundheitsinterventionen mit rigorosen methodischen Anforderungen. Relevant sind das RoB 2 Tool für randomisierte kontrollierte Studien mit Bewertung von fünf Bias-Domänen und ROBINS-I für nicht-randomisierte Interventionsstudien mit sieben Bias-Domänen. Die aktuelle Version enthält Erweiterungen zu Netzwerk-Meta-Analysen, Equity-Überlegungen und komplexen Interventionen.

ENTREQ definiert Standards für qualitative Evidenzsynthesen mit einundzwanzig Items für transparente Berichterstattung. Die Anforderungen an Reflexivität und theoretische Positionierung ergänzen PRISMA für qualitative Studien. Das MMAT Version 2018 bewertet Mixed-Methods-Studien mit fünf studientypspezifischen Kriterien für qualitative Studien, randomisierte kontrollierte Studien, nicht-randomisierte Studien, quantitative deskriptive Studien und Mixed-Methods-Designs.

Die Auswahl der Standards erfolgt pragmatisch nach Forschungsfrage und Evidenztyp. PRISMA bildet das Reporting-Backbone, während JBI und Cochrane methodische Tiefe für spezifische Studientypen liefern. ENTREQ ergänzt für qualitative Synthesen. Die Standards sind komplementär nutzbar und werden als YAML-Strukturen in Obsidian-Templates implementiert für programmatische Auswertung.

## Assessment-Workflow

Das Assessment erfolgt in einem strukturierten Excel-basierten Workflow mit PRISMA-konformen Kategorien. Die Zotero-Integration ermöglicht bidirektionale Datenflüsse zwischen bibliographischer Verwaltung und Bewertung. Python-Skripte konvertieren zwischen RIS-Format und Excel-Templates. Die zotero_to_excel.py nutzt die Zotero API für direkten Export. Die excel_to_ris.py führt Bewertungen zurück in bibliographische Metadaten.

Das Excel-Template enthält strukturierte Bewertungsspalten. Relevance_Score auf fünfstufiger Skala von zentral bis irrelevant. Quality auf dreistufiger Kategorisierung in hoch, mittel, niedrig. Decision als binäre Einschlussentscheidung mit Optionen Include, Exclude, Unclear. Exclusion_Reason mit standardisierten Codes für verschiedene Ausschlussgründe. Notes für qualitative Begründungen und Kontextinformationen. Confidence_Level zur Markierung von Unsicherheiten.

Die Bewertung erfolgt durch Expert-in-the-Loop-Validierung. Jede Quelle wird einzeln gegen definierte Kriterien geprüft. Die Entscheidungen werden mit Begründungen versehen. Unsicherheiten werden explizit dokumentiert statt verschleiert. Bei Confidence-Level niedrig oder mittel erfolgt Second-Review oder Diskussion. Die systematische Dokumentation aller Bewertungen ermöglicht spätere Analyse von Entscheidungsmustern und potentiellen Bias.

Die PRISMA-Tag-Enrichment erfolgt nach Abschluss der Bewertung. Der excel_to_ris.py führt Assessments zurück in RIS-Metadaten. Include/Exclude/Unclear-Tags werden als Custom Fields ergänzt. Die Ausschlussgründe werden strukturiert erfasst. Die angereicherten RIS-Dateien können zurück in Zotero importiert werden. Dies schließt den Kreis zwischen bibliographischer Verwaltung und systematischer Bewertung.

## Datenextraktion

Die strukturierte Datenextraktion nutzt standardisierte Templates in Obsidian. Bibliographische Basisdaten umfassen Autoren mit Affiliationen, Publikationsjahr und Typ, Journal oder Konferenz, DOI und alternative Identifier. Diese Metadaten werden automatisch aus RIS-Importen übernommen und manuell validiert. Die YAML-Frontmatter speichert strukturierte Informationen für programmatische Verarbeitung.

Inhaltliche Kernelemente erfassen die wissenschaftliche Substanz. Die Forschungsfrage oder Zielsetzung wird explizit formuliert. Der theoretische Rahmen und Kernkonzepte werden identifiziert. Das methodische Design inkludiert Ansatz, Sample und Instrumente. Die Hauptergebnisse werden in standardisierter Form erfasst. Schlussfolgerungen und Implikationen werden extrahiert. Diese Strukturierung ermöglicht spätere thematische Synthese.

Kontextuelle Faktoren erfassen Rahmenbedingungen. Der geografische und kulturelle Kontext wird dokumentiert. Der zeitliche Rahmen der Datenerhebung wird notiert. Förderung und potentielle Interessenkonflikte werden erfasst. Limitationen laut Autoren werden übernommen. Diese Kontextualisierung ist zentral für die Interpretation der Befunde unter Perspektive des situierten Wissens.

Die Extraktion erfolgt durch fünfstufige KI-gestützte Zusammenfassung kombiniert mit manueller Validierung. Claude Haiku 4.5 generiert strukturierte Synthesen mit automatischer Metadaten-Extraktion. Die menschliche Validierung prüft Korrektheit, ergänzt fehlende Elemente und korrigiert Fehler. Die bidirektionale Integration von automatisierter und manueller Arbeit optimiert Effizienz unter Beibehaltung von Qualität.

## Wissenssynthese

Die Synthese erfolgt durch vernetzte Wissensstrukturen in Obsidian. Die Vault-Organisation vermeidet Fragmentierung durch kohärente Narrative statt atomisierter Fakten. Papers werden mit Concepts verlinkt, Concepts untereinander vernetzt. Die Struktur des Knowledge Graphs reflektiert thematische Zusammenhänge und ermöglicht explorative Navigation.

Die Konzeptextraktion nutzt Pattern-basierte Erkennung mit Normalisierung und Deduplizierung. Ein Synonym-Mapping-Dictionary mit hundertachtzig Einträgen konsolidiert Varianten zu kanonischen Formen. Die Reduktion erfolgt durch Frequenz-Thresholds, Fragment-Elimination und intersektionale Konsolidierung. Das System kategorisiert Konzepte in Bias Types und Mitigation Strategies.

Die finale Synthese aggregiert Haupterkenntnisse über individuelle Studien hinweg. Konvergente Befunde werden identifiziert und dokumentiert. Divergente Ergebnisse werden nicht harmonisiert, sondern als Evidenz für Komplexität interpretiert. Forschungslücken werden durch systematischen Vergleich zwischen Suchstrategie und tatsächlichen Funden identifiziert. Die Synthese balanciert systematische Aggregation mit interpretativer Tiefe.
