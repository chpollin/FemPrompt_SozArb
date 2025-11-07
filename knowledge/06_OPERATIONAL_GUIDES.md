---
type: knowledge
created: 2025-01-31
tags: [prompts, git-workflow, benchmarks, operational-reference]
status: active
---

# Operativ

## Prompt-Templates

### Deep Research Basis-Template

Das parametrische Template strukturiert KI-Anfragen durch fünf Komponenten. Die Rolle definiert die Expertenperspektive, die Aufgabe spezifiziert den Output-Typ, der Kontext bettet Forschungsziele ein, Analyseschritte strukturieren den Prozess, das Output-Format standardisiert Ergebnisse.

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

### RIS-Konvertierung

Der Konvertierungs-Prompt transformiert heterogene Modell-Outputs in standardisiertes bibliographisches Format. Die Validierung prüft DOI-Format gegen CrossRef-Muster. Unsichere Angaben werden explizit markiert.

```markdown
Konvertiere die folgenden bibliographischen Angaben in das RIS-Format.
Behalte alle Metadaten bei und ergänze fehlende Standardfelder.
Nutze TY, AU, TI, JO, VL, IS, SP, EP, PY, DO, AB, KW Tags.
Validiere DOIs gegen CrossRef-Format.
Markiere unsichere Angaben mit N1 - Note.
```

### Dokumenten-Zusammenfassung

Der fünfstufige Gemini-Prompt extrahiert akademische Kernelemente, generiert strukturierte Synthesen, validiert Konsistenz, produziert bereinigte Zusammenfassungen und extrahiert YAML-Metadaten.

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

## Benchmarks und Schwellenwerte

### Inklusionsraten nach Review-Phase

Die erwarteten Durchlaufquoten orientieren sich an systematischen Reviews in verwandten Feldern. Initial Search Results bilden die Baseline mit hundert Prozent. Nach Duplikat-Entfernung verbleiben siebzig bis fünfundachtzig Prozent. Nach Title-Screening verbleiben zwanzig bis fünfzig Prozent. Nach Abstract-Screening verbleiben fünf bis vierzig Prozent abhängig vom Thema. Nach Volltext-Assessment erreichen zwei bis fünfzehn Prozent finale Inklusion.

Atypische Raten unter zwei Prozent oder über vierzig Prozent finale Inklusion erfordern Dokumentation und Reflexion der Suchstrategie. Zu niedrige Raten indizieren übermäßig breite initiale Suche oder zu restriktive Kriterien. Zu hohe Raten signalisieren potentiell zu enge Suchstrategie mit Risiko systematischer Ausschlüsse.

### Inter-Rater-Reliabilität

Cohen's Kappa misst die Übereinstimmung zwischen Reviewern unter Korrektur für Zufallsübereinstimmung. Die Interpretation folgt etablierten Schwellenwerten. Kappa unter null Komma zwanzig indiziert schwache Übereinstimmung. Kappa zwischen null Komma einundzwanzig und null Komma vierzig zeigt faire Übereinstimmung. Kappa zwischen null Komma einundvierzig und null Komma sechzig markiert moderate Übereinstimmung. Kappa zwischen null Komma einundsechzig und null Komma achtzig kennzeichnet substanzielle Übereinstimmung. Kappa über null Komma achtzig erreicht fast perfekte Übereinstimmung.

Der Mindeststandard für Literature Reviews liegt bei Kappa größer null Komma sechzig. Bei Werten unter diesem Schwellenwert müssen Einschlusskriterien präzisiert und Pilottests wiederholt werden. Die Dokumentation der IRR-Werte in der Methodensektion demonstriert Rigorosität.

### Graue Literatur

Die Identifikation grauer Literatur umfasst institutionelle Repositorien, Regierungsberichte, NGO-Publikationen, Dissertationen, Preprints, Konferenz-Proceedings, Working Papers und Policy Briefs. Die Qualitätskriterien bewerten institutionelle Affiliation der Autoren, transparente Methodik, Peer-Review-Prozess wenn vorhanden, Zitationshäufigkeit sowie Aktualität und Relevanz.

Die Integration in Reviews erfolgt durch separate Kennzeichnung in Evidenztabellen, Sensitivitätsanalyse mit und ohne graue Literatur, explizite Diskussion des Einflusses und gewichtete Berücksichtigung in der Synthese. Die transparente Handhabung grauer Literatur vermeidet Publication Bias.

## Git-Workflow

### Repository-Struktur

Die gitignore-Konfiguration schließt Binärdateien wie PDF, DOCX und XLSX von der Versionskontrolle aus. Generierte Dateien in all_pdf, markdown_papers und summaries_final werden ignoriert. Temporäre Dateien wie TMP, CACHE und DS_Store bleiben ausgeschlossen. Sensible Daten in config/api_keys.json und config/credentials.yaml sind geschützt.

Versionierte Dateien werden explizit inkludiert durch Negation. Templates in templates/*.md werden getrackt. Analyseskripte in analysis/*.py unterliegen Versionskontrolle. Konfigurationsparameter in config/parameters.yaml sind versioniert. Diese selektive Versionierung balanciert Reproduzierbarkeit mit Datenschutz.

### Commit-Strategie

Die atomare Commit-Struktur ordnet jede Review-Phase einem Commit zu. Phase-Abschlüsse werden sofort committed. Die Commit-Messages folgen konventionellen Strukturen mit Typ, Scope und Beschreibung. Die Branch-Struktur differenziert zwischen main für stabile Releases, develop für aktive Entwicklung und feature/* für experimentelle Änderungen.

Die Tag-Nutzung markiert Meilensteine. Version v1.0-protocol dokumentiert abgeschlossene Protokollentwicklung. Version v2.0-screening-complete kennzeichnet finalisiertes Screening. Version v3.0-synthesis markiert abgeschlossene Wissenssynthese. Diese semantische Versionierung ermöglicht Rollback zu definierten Zuständen.

### Kollaborationsworkflow

Die Pull-Request-Strategie erfordert Reviews vor Merges in main. Feature-Branches werden durch beschreibende Namen identifiziert. Die Merge-Strategie nutzt Squash-Merges für saubere Historie. Konflikte werden durch explizite Kommunikation aufgelöst.

Die Issue-Tracking-Integration verlinkt Commits zu Issues. Automatische Schließung erfolgt durch Keywords in Commit-Messages. Die Milestone-Nutzung gruppiert Issues nach Review-Phasen. Dieses strukturierte Projektmanagement skaliert für Teams.

## Ressourcen und Registrierungen

### Zentrale Plattformen

Das EQUATOR Network unter www.equator-network.org sammelt über fünfhundert Reporting-Guidelines für verschiedene Studientypen in Gesundheitsforschung. Die Campbell Collaboration unter www.campbellcollaboration.org spezialisiert auf Systematic Reviews in Sozialwissenschaften, Bildung und Kriminaljustiz mit methodischen Ressourcen und Training.

PROSPERO unter www.crd.york.ac.uk/prospero dient als internationale Datenbank für Systematic Review Protokolle. Die Registrierung erhöht Transparenz und vermeidet Duplikation. Die Registrierungsnummer wird in Publikationen angegeben. Das Open Science Framework unter osf.io ermöglicht Präregistrierung für alle Review-Typen mit Versionskontrolle, Kollaboration und DOI für Protokolle.

### Qualitätsinstrumente

Die JBI Critical Appraisal Tools umfassen dreizehn studientypspezifische Checklisten. Analytical Cross Sectional, Case Control, Case Reports, Case Series, Cohort Studies, Diagnostic Test Accuracy, Economic Evaluations, Prevalence Studies, Qualitative Research, Quasi-Experimental, RCTs, Systematic Reviews und Text and Opinion werden abgedeckt.

CASP bietet acht verschiedene Checklisten. Systematic Reviews, RCTs, Cohort Studies, Case Control Studies, Economic Evaluations, Diagnostic Studies, Qualitative Studies und Clinical Prediction Rules sind verfügbar. Die Instrumente sind frei zugänglich und international etabliert.
