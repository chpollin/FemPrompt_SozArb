---
type: knowledge
created: 2025-01-27
tags: [methodology-standards, review-guidelines, prompt-templates, workflow-reference]
status: reviewed
confidence: high
aliases: [Methodische Standards, Review Standards, Workflow Referenz]
---

# Workflow-Standards

## Summary

Dieses Dokument ergänzt die vier Workflow-Hauptdokumente um methodische Standards, alternative Review-Frameworks und operative Details. Neben dem primär verwendeten PRISMA 2020 Standard werden das JBI Manual for Evidence Synthesis und das Cochrane Handbook als komplementäre Referenzen dokumentiert. Die Zeitplanung basiert auf empirischen Richtwerten für akademische Literature Reviews mit typischen Bearbeitungszeiten von 14-26 Wochen für den Gesamtprozess.

Das Framework integriert 13 verschiedene Qualitätsinstrumente für unterschiedliche Studientypen, von RCTs über qualitative Studien bis zu Mixed-Methods-Designs. Die Dokumentation konkreter Prompt-Templates ermöglicht die Reproduktion der KI-gestützten Recherche. Operative Details wie Inklusionsraten, Übereinstimmungsmaße und Software-Empfehlungen konkretisieren die praktische Durchführung.

Die bidirektionale Integration zwischen Python-Pipeline und Obsidian-Vault wird durch standardisierte Datenformate und Git-basierte Versionskontrolle realisiert. Die parallele Verarbeitung von Expertenbewertung und automatisierter Analyse optimiert die Ressourcennutzung bei gleichzeitiger Qualitätssicherung.

## Core Concepts

### Alternative Review-Standards

**JBI Manual for Evidence Synthesis (2024)**
Das Joanna Briggs Institute Framework unterstützt 11 Review-Typen: Systematic Reviews, Scoping Reviews, Qualitative Reviews, Mixed Methods Reviews, Umbrella Reviews, Text and Opinion Reviews, Prevalence and Incidence Reviews, Etiology and Risk Reviews, Diagnostic Test Accuracy Reviews, Prognostic Reviews und Economic Evaluations. JBI zeichnet sich durch pluralistische Evidenzauffassung und pragmatischen Ethos aus. Die Integration in den Workflow erfolgt primär bei der Qualitätsbewertung durch JBI Critical Appraisal Tools.

**Cochrane Handbook Version 6.5 (2024)**
Der Cochrane Standard fokussiert auf Gesundheitsinterventionen mit rigorosen methodischen Anforderungen. Die aktuelle Version enthält Erweiterungen zu Netzwerk-Meta-Analysen, Equity-Überlegungen, komplexen Interventionen und narrativer Synthese. Im Workflow relevant für die Anwendung von RoB 2 (Risk of Bias Tool für RCTs) und ROBINS-I (für nicht-randomisierte Interventionsstudien).

**ENTREQ für qualitative Evidenzsynthesen**
Enhancing Transparency in Reporting the synthesis of Qualitative research definiert 21 Items für die transparente Berichterstattung qualitativer Synthesen. Ergänzt PRISMA für qualitative Studien mit spezifischen Anforderungen an Reflexivität und theoretische Positionierung.

**PRISMA-ScR für Scoping Reviews**
Adaptation des PRISMA-Standards für Scoping Reviews, die breitere Forschungsfragen adressieren und explorativen Charakter haben. Reduzierte Anforderungen an formale Qualitätsbewertung bei erhöhtem Fokus auf Mapping der Evidenzlandschaft.

### Erweiterte Qualitätsinstrumente

**Studiendesign-spezifische Tools:**

RoB 2 (Cochrane, 2019) für randomisierte kontrollierte Studien evaluiert fünf Domänen: Randomisierungsprozess, Abweichungen von intendierten Interventionen, fehlende Outcome-Daten, Outcome-Messung und Selektionsberichterstattung. Jede Domäne wird als low risk, some concerns oder high risk bewertet.

ROBINS-I für nicht-randomisierte Interventionsstudien prüft sieben Bias-Domänen: Confounding, Selektion der Teilnehmer, Klassifikation der Interventionen, Abweichungen von intendierten Interventionen, fehlende Daten, Outcome-Messung und Selektionsberichterstattung.

MMAT (Mixed Methods Appraisal Tool) Version 2018 bewertet fünf Studientypen mit je fünf Kriterien: qualitative Studien, randomisierte kontrollierte Studien, nicht-randomisierte Studien, quantitative deskriptive Studien und Mixed-Methods-Studien.

JBI Critical Appraisal Tools umfassen 13 studientypspezifische Checklisten: Analytical Cross Sectional, Case Control, Case Reports, Case Series, Cohort Studies, Diagnostic Test Accuracy, Economic Evaluations, Prevalence Studies, Qualitative Research, Quasi-Experimental, RCTs, Systematic Reviews und Text and Opinion.

CASP (Critical Appraisal Skills Programme) bietet 8 verschiedene Checklisten für Systematic Reviews, RCTs, Cohort Studies, Case Control Studies, Economic Evaluations, Diagnostic Studies, Qualitative Studies und Clinical Prediction Rules.

### Zeitplanung und Ressourcen

**Standardzeitrahmen für Literature Review (Einzelperson):**

Protokollentwicklung (Wochen 1-3): Forschungsfrage präzisieren, Suchstrategie entwickeln, Ein-/Ausschlusskriterien definieren, PROSPERO-Registrierung vorbereiten.

Suche und Screening (Wochen 4-8): Datenbanksuchen durchführen, Duplikate entfernen, Title-Abstract-Screening, Volltext-Beschaffung, Eligibility-Assessment.

Datenextraktion (Wochen 9-12): Extraktionstemplate entwickeln, Pilotextraktion, vollständige Datenextraktion, Qualitätsbewertung durchführen.

Synthese (Wochen 13-16): Datenanalyse, thematische Gruppierung, Meta-Analyse (wenn anwendbar), Evidenztabellen erstellen.

Schreiben (Wochen 17-20): PRISMA-konforme Berichterstattung, Flow-Diagramm finalisieren, Diskussion und Schlussfolgerungen, interne Revision.

Finalisierung (Wochen 21-22): Externe Begutachtung, finale Überarbeitung, Submission-Vorbereitung.

**Beschleunigte Variante mit KI-Unterstützung:**
Reduktion auf 10-14 Wochen durch parallele Prozesse und automatisierte Extraktion. Kritische Pfade bleiben manuelle Validierung und Synthese.

### Prompt-Templates für Deep Research

**Basis-Template mit fünf Komponenten:**

```markdown
# ROLLE
Du bist ein systematischer Literature Review Experte mit Spezialisierung auf [FACHGEBIET]. 
Deine Expertise umfasst [SPEZIFISCHE KOMPETENZEN].

# AUFGABE
Erstelle eine comprehensive bibliographische Recherche zum Thema: "[FORSCHUNGSFRAGE]"
Output-Typ: Annotierte Bibliographie mit strukturierten Metadaten

# KONTEXT
Forschungsziel: [ZIEL]
Theoretischer Rahmen: [THEORIEN]
Zeitlicher Scope: [ZEITRAHMEN]
Geografischer Fokus: [REGION]
Sprachen: [SPRACHEN]

# ANALYSESCHRITTE
1. Identifiziere 20-30 hochrelevante Publikationen
2. Priorisiere peer-reviewed Journals und aktuelle Konferenzbeiträge
3. Inkludiere Schlüsselautoren: [AUTORENLISTE]
4. Berücksichtige interdisziplinäre Perspektiven aus: [DISZIPLINEN]
5. Strukturiere nach thematischen Clustern

# OUTPUT-FORMAT
Für jede Quelle:
- Vollständige bibliographische Angaben (APA 7)
- 150-200 Wörter strukturierte Zusammenfassung
- Relevanz-Score (1-5) mit Begründung
- Methodischer Ansatz
- Kernbefunde
- Theoretische Verortung
- Verbindungen zu anderen Quellen
```

**RIS-Konvertierungs-Prompt:**

```markdown
Konvertiere die folgenden bibliographischen Angaben in das RIS-Format.
Behalte alle Metadaten bei und ergänze fehlende Standardfelder.
Nutze TY, AU, TI, JO, VL, IS, SP, EP, PY, DO, AB, KW Tags.
Validiere DOIs gegen CrossRef-Format.
Markiere unsichere Angaben mit N1 - Note.
```

**Zusammenfassungs-Prompt für Gemini:**

```markdown
Analysiere das folgende akademische Dokument in fünf Schritten:

1. AKADEMISCHE ANALYSE
- Identifiziere Forschungsfrage und Hypothesen
- Extrahiere methodisches Vorgehen
- Liste Hauptergebnisse
- Notiere theoretischen Rahmen

2. STRUKTURIERTE SYNTHESE
Erstelle eine 200-Wort-Zusammenfassung mit:
- Kontext und Relevanz
- Methodik und Sample
- Kernbefunde
- Implikationen

3. KRITISCHE VALIDIERUNG
- Prüfe interne Konsistenz
- Identifiziere Limitationen
- Bewerte Generalisierbarkeit

4. BEREINIGTE ZUSAMMENFASSUNG
Erstelle finale 150-Wort-Version für Datenbank

5. METADATEN-EXTRAKTION
Format als YAML:
- keywords: []
- methods: []
- theories: []
- sample_size: 
- geographic_scope:
- temporal_scope:
```

### Operative Metriken

**Inklusionsraten nach Review-Phase:**

Initial Search Results: 100% (Baseline)
Nach Duplikat-Entfernung: 70-85% verbleiben
Nach Title-Screening: 20-50% verbleiben
Nach Abstract-Screening: 5-40% verbleiben (stark themenabhängig)
Nach Volltext-Assessment: 2-15% finale Inklusion

Atypische Raten (<2% oder >40% finale Inklusion) erfordern Dokumentation und Reflexion der Suchstrategie.

**Inter-Rater-Reliabilität:**

Cohen's Kappa Interpretation:
- κ < 0.20: schwache Übereinstimmung
- κ = 0.21-0.40: faire Übereinstimmung  
- κ = 0.41-0.60: moderate Übereinstimmung
- κ = 0.61-0.80: substanzielle Übereinstimmung
- κ > 0.80: fast perfekte Übereinstimmung

Mindeststandard für Literature Reviews: κ > 0.60
Bei κ < 0.60: Kriterien präzisieren und erneut testen

### Graue Literatur Management

**Identifikation grauer Literatur:**
Institutionelle Repositorien, Regierungsberichte, NGO-Publikationen, Dissertationen, Preprints, Konferenz-Proceedings, Working Papers, Policy Briefs.

**Qualitätskriterien für graue Literatur:**
Institutionelle Affiliation der Autoren, transparente Methodik, Peer-Review-Prozess (wenn vorhanden), Zitationshäufigkeit, Aktualität und Relevanz.

**Integration in Review:**
Separate Kennzeichnung in Evidenztabellen, Sensitivitätsanalyse mit/ohne graue Literatur, explizite Diskussion des Einflusses, gewichtete Berücksichtigung in Synthese.

## Synthesis

### Integration der Standards

Die verschiedenen Review-Standards (PRISMA, JBI, Cochrane, ENTREQ) sind komplementär nutzbar. PRISMA bildet das Reporting-Backbone, während JBI und Cochrane methodische Tiefe für spezifische Studientypen liefern. ENTREQ ergänzt für qualitative Synthesen. Die Auswahl erfolgt pragmatisch nach Forschungsfrage und Evidenztyp.

Der KI-gestützte Workflow operationalisiert diese Standards durch automatisierte Checklisten in Obsidian-Templates. Die Qualitätsinstrumente werden als YAML-Strukturen implementiert, die programmatisch ausgewertet werden können. Dies ermöglicht Dashboard-Visualisierungen des Review-Fortschritts.

### Bidirektionale Datenintegration

Der Datenfluss zwischen Python-Pipeline und Obsidian erfolgt bidirektional. Python generiert initiale Markdown-Dateien mit strukturierten Metadaten. Obsidian-Bearbeitungen werden via Git getrackt. Python-Skripte können Obsidian-Änderungen parsen und aggregieren. Dies ermöglicht iterative Verfeinerung.

Die Parallelverarbeitung von Expertenbewertung (via Excel-Export aus Zotero) und automatisierter Python-Analyse läuft asynchron. Confluence-Punkte sind definiert: nach Initial-Screening, nach Qualitätsbewertung, vor finaler Synthese. Dies optimiert Ressourcennutzung bei Einzelarbeit.

### Git-Workflow für Versionskontrolle

**.gitignore Struktur:**
```
# Binärdateien
*.pdf
*.docx
*.xlsx

# Generierte Dateien
/all_pdf/
/markdown_papers/
/summaries_final/

# Temporäre Dateien
*.tmp
*.cache
.DS_Store

# Sensible Daten
config/api_keys.json
config/credentials.yaml

# Versionierte Dateien
!templates/*.md
!analysis/*.py
!config/parameters.yaml
```

Commit-Strategie: Atomare Commits für jede Review-Phase. Branch-Struktur: main (stabil), develop (Arbeit), feature/* (Experimente). Tags für Meilensteine: v1.0-protocol, v2.0-screening-complete, v3.0-synthesis.

### Ressourcen und Registrierungen

**EQUATOR Network** (www.equator-network.org): Zentrale Sammlung von Reporting-Guidelines für Gesundheitsforschung. Enthält 500+ Guidelines für verschiedene Studientypen.

**Campbell Collaboration** (www.campbellcollaboration.org): Spezialisiert auf systematic Reviews in Sozialwissenschaften, Bildung und Kriminaljustiz. Bietet methodische Ressourcen und Training.

**PROSPERO** (www.crd.york.ac.uk/prospero): Internationale Datenbank für Systematic Review Protokolle. Registrierung erhöht Transparenz und vermeidet Duplikation. Registrierungsnummer in Publikation angeben.

**Open Science Framework** (osf.io): Präregistrierung für alle Review-Typen möglich. Ermöglicht Versionskontrolle und Kollaboration. DOI für Protokolle verfügbar.

## Sources

Page, M. J., McKenzie, J. E., Bossuyt, P. M., et al. (2021). The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. *BMJ*, 372, n71.

Aromataris, E., Lockwood, C., Porritt, K., Pilla, B., Jordan, Z. (eds). (2024). *JBI Manual for Evidence Synthesis*. JBI.

Higgins, J. P. T., Thomas, J., Chandler, J., et al. (eds). (2024). *Cochrane Handbook for Systematic Reviews of Interventions version 6.5*. Cochrane.

Tong, A., Flemming, K., McInnes, E., Oliver, S., & Craig, J. (2012). Enhancing transparency in reporting the synthesis of qualitative research: ENTREQ. *BMC Medical Research Methodology*, 12(1), 181.

## Related

- [[Konzept]] - Theoretischer Rahmen
- [[Technisch]] - Technische Implementierung
- [[Qualität]] - Qualitätssicherung
- [[PRISMA]] - PRISMA-Implementierung
- [[Methodische Qualitätskriterien für SocialAI Literature Review]] - Ursprungsdokument