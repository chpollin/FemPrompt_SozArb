---
type: knowledge
created: 2025-01-27
tags: [prisma, systematic-review, methodology, literature-review, reporting-standards]
status: reviewed
confidence: high
aliases: [PRISMA Methodik, PRISMA 2020]
---

# Workflow-PRISMA

## Summary

Die PRISMA 2020 Methodologie strukturiert den systematischen Review-Prozess in vier operative Phasen: Datenextraktion (EXTRACT), Qualitätsbewertung (ASSESS), Flow-Diagramm-Erstellung (DIAGRAM) und standardisierte Berichterstattung (REPORT). Diese Phasen (4-7) bauen auf den vorgelagerten Phasen 1-3 (Suchstrategie, Identifikation und Screening) auf, die im Deep Research Prozess implementiert sind. Die Adaptation für KI-gestützte Reviews erweitert die klassischen PRISMA-Kriterien um spezifische Validierungspunkte für algorithmische Recherche.

Das Framework operationalisiert Transparenz durch vollständige Dokumentation aller Entscheidungen, von Einschlusskriterien über Qualitätsbewertung bis zu Ausschlussgründen. Die Integration in den Obsidian-Workflow ermöglicht dynamische Aktualisierung der PRISMA-Dokumentation während des Review-Prozesses. Die Visualisierung im Flow-Diagramm macht den Selektionsprozess nachvollziehbar und identifiziert potentielle Bias-Quellen.

Die Berichterstattung folgt der 27-Item-Checkliste mit spezifischen Erweiterungen für KI-gestützte Methoden. Dies inkludiert Dokumentation der verwendeten Modelle, Prompt-Templates und Validierungsstrategien. Die explizite Benennung von Limitationen der KI-Recherche sichert wissenschaftliche Integrität.

## Core Concepts

### Phase 4: EXTRACT - Strukturierte Datenextraktion

Das Extraktionsprotokoll definiert standardisierte Datenfelder für konsistente Erfassung. Bibliographische Basisdaten umfassen Autoren mit Affiliationen, Publikationsjahr und -typ, Journal oder Konferenz, DOI und alternative Identifier. Diese Metadaten werden automatisch aus RIS-Importen übernommen und manuell validiert.

Inhaltliche Kernelemente strukturieren die wissenschaftliche Substanz. Forschungsfrage oder Zielsetzung wird explizit formuliert. Theoretischer Rahmen und Kernkonzepte werden identifiziert. Methodisches Design inkludiert Ansatz, Sample und Instrumente. Hauptergebnisse werden in standardisierter Form erfasst. Schlussfolgerungen und Implikationen werden extrahiert.

Kontextuelle Faktoren erfassen Rahmenbedingungen. Geografischer und kultureller Kontext wird dokumentiert. Zeitlicher Rahmen der Datenerhebung wird notiert. Förderung und potentielle Interessenkonflikte werden erfasst. Limitationen laut Autoren werden übernommen.

Die Extraktion erfolgt in strukturierten Templates in Obsidian. Jede Publikation erhält eine standardisierte Markdown-Datei. YAML-Frontmatter speichert strukturierte Metadaten. Der Haupttext dokumentiert narrative Zusammenfassungen. Links verknüpfen verwandte Publikationen und Konzepte.

### Phase 5: ASSESS - Differenzierte Qualitätsbewertung

Die Qualitätsbewertung adaptiert etablierte Frameworks für verschiedene Studientypen. Quantitative Studien werden mit dem Cochrane Risk of Bias Tool evaluiert. Randomisierung und Allocation Concealment werden geprüft. Blinding von Teilnehmern und Outcome-Assessment wird bewertet. Vollständigkeit der Outcome-Daten wird analysiert. Selektives Reporting wird identifiziert.

Qualitative Studien nutzen CASP-Kriterien (Critical Appraisal Skills Programme). Klarheit der Forschungsfrage wird bewertet. Angemessenheit der qualitativen Methodologie wird geprüft. Rigorosität der Datenerhebung wird analysiert. Reflexivität der Forschenden wird evaluiert. Ethische Überlegungen werden berücksichtigt.

Mixed-Methods-Studien werden mit dem MMAT (Mixed Methods Appraisal Tool) bewertet. Integration qualitativer und quantitativer Komponenten wird bewertet. Methodologische Kohärenz wird analysiert. Angemessenheit der Integration wird geprüft.

Die Bewertung generiert aggregierte Qualitätsscores. Einzelkriterien werden auf Skalen bewertet. Gesamtscores werden berechnet aber kontextualisiert. Qualitative Narrative ergänzen quantitative Bewertungen. Unsicherheiten werden explizit dokumentiert.

### Phase 6: DIAGRAM - Visualisierung des Selektionsprozesses

Das PRISMA-Flow-Diagramm dokumentiert den vollständigen Selektionspfad mit 67 initialen Einträgen aus dem Deep Research Prozess. Die Identifikationsphase quantifiziert initiale Treffer. Datenbank-Suchen werden nach Quelle aufgeschlüsselt (67 aus Deep Research). Weitere Quellen werden separat ausgewiesen. Duplikate werden identifiziert und entfernt.

Die Screening-Phase dokumentiert Title-Abstract-Review. Anzahl gescreenter Records wird angegeben. Ausschlüsse mit Gründen werden quantifiziert. Verbleibende Artikel für Volltext-Assessment werden gezählt.

Das Eligibility-Assessment erfasst Volltext-Prüfungen. Anzahl beurteilter Volltexte wird dokumentiert. Ausschlussgründe werden kategorisiert: Wrong Population, Wrong Intervention, Wrong Outcome, Wrong Study Design, No Full Text, Other. Jede Kategorie wird quantifiziert.

Die finale Inklusion zeigt eingeschlossene Studien. Aufteilung nach Studientyp wird visualisiert. Verwendung in qualitativer vs. quantitativer Synthese wird unterschieden.

### Phase 7: REPORT - Standardisierte Berichterstattung

Die PRISMA 2020 Checkliste strukturiert die Berichterstattung in 27 Items. Title identifiziert den Bericht als systematischen Review. Abstract bietet strukturierte Zusammenfassung. Introduction etabliert Rationale und Objectives. Methods dokumentiert alle methodischen Entscheidungen.

KI-spezifische Erweiterungen ergänzen Standard-Items. Verwendete KI-Modelle werden spezifiziert mit Versionen. Prompt-Templates werden vollständig dokumentiert. Multi-Modell-Strategien werden begründet. Validierungsansätze für KI-Outputs werden beschrieben.

Die Results-Sektion präsentiert Ergebnisse strukturiert. Study Selection wird durch Flow-Diagramm visualisiert. Study Characteristics werden tabellarisch zusammengefasst. Risk of Bias wird grafisch dargestellt. Results of Individual Studies werden narrativ synthetisiert.

Discussion interpretiert Findings im Kontext. Summary of Evidence aggregiert Haupterkenntnisse. Limitations werden explizit benannt. Conclusions vermeiden Überinterpretation.

## Synthesis

### PRISMA als Qualitätsstandard

PRISMA 2020 etabliert internationale Standards für systematische Reviews. Die strukturierte Methodik erhöht Transparenz und Reproduzierbarkeit. Die Standardisierung ermöglicht Vergleichbarkeit zwischen Reviews. Die explizite Dokumentation aller Entscheidungen reduziert Bias.

Die Adaptation für KI-gestützte Reviews erweitert die Standards unter Beibehaltung der Kernprinzipien. Kernprinzipien bleiben erhalten während neue Herausforderungen adressiert werden. Die Integration technologischer Innovation respektiert methodologische Rigorosität.

### Integration in den Workflow

Die PRISMA-Phasen sind systematisch in den dreiphasigen Workflow integriert. Deep Research ersetzt traditionelle Datenbanksuchen als Identifikationsquelle. Zotero-Validierung implementiert Screening und Eligibility-Assessment. Obsidian-Synthese operationalisiert Datenextraktion und Qualitätsbewertung.

Die Verwendung von Markdown und YAML ermöglicht programmatische Generierung von PRISMA-Elementen. Flow-Diagramme werden aus strukturierten Daten automatisch erstellt. Checklisten werden durch Templates systematisch abgearbeitet.

### Methodologische Reflexion

PRISMA 2020 wurde primär für traditionelle Reviews entwickelt. Die Adaptation für KI-gestützte Methoden erfordert kritische Reflexion. Die Transparenz von Algorithmen unterscheidet sich von menschlichen Entscheidungen. Die Dokumentation muss beide Aspekte integrieren.

Die Standardisierung durch PRISMA kann Innovation einschränken. Der Workflow balanciert Compliance mit methodischer Weiterentwicklung. Abweichungen vom Standard werden begründet und dokumentiert.

## Sources

Page, M. J., McKenzie, J. E., Bossuyt, P. M., et al. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. *BMJ*, 372, n71. https://doi.org/10.1136/bmj.n71

PRISMA. (2020). PRISMA 2020 Checklist. Retrieved from http://www.prisma-statement.org/PRISMAStatement/Checklist

Moher, D., Liberati, A., Tetzlaff, J., Altman, D. G., & PRISMA Group. (2009). Preferred reporting items for systematic reviews and meta-analyses: The PRISMA statement. *PLoS Medicine*, 6(7), e1000097.

## Related

- [[Qualität]] - Qualitätskriterien die PRISMA operationalisieren
- [[Konzept]] - Konzeptuelle Einbettung von PRISMA
- [[Technisch]] - Technische Implementierung der PRISMA-Phasen
- [[Methodische Qualitätskriterien für SocialAI Literature Review]] - Spezifische Adaptationen