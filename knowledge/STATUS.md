# project status

last updated: 2026-02-02
branch: main

---

## current state

das femprompt-projekt befindet sich in der thematischen assessment-phase. susi sackl-sharif und sabine klinger bewerten 303 papers nach neuem binärem schema.

---

## femprompt (303 papers) - AKTUELL AKTIV

focus: feminist ai literacies, generative ki, prompting und soziale arbeit

forschungsfrage: inwiefern kommen die themen oder die verknüpfung der bereiche feministische ai literacies, generative ki / prompting und soziale arbeit in wissenschaftlicher literatur vor?

zotero: group library 6080294

### aktueller stand (2026-02-02)

thematisches assessment: IN BEARBEITUNG
- 303 papers exportiert (254 deepresearch + 49 human 1 collection)
- neues binäres schema mit 14 spalten (ja/nein)
- google spreadsheet: https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/
- bearbeiter: susi sackl-sharif, sabine klinger
- christina ergänzt metadaten + pdfs in zotero

### pdf-bestand in zotero (2026-02-02)

**zotero group 6080294 enthält 296 pdf-attachments:**
| typ | anzahl | beschreibung |
|-----|--------|--------------|
| imported_file | 294 | direkt herunterladbar via API |
| imported_url | 1 | url-referenz |
| linked_url | 1 | externe verlinkung |

**lokaler bestand:**
| verzeichnis | pdfs | größe |
|-------------|------|-------|
| analysis/pdfs/ | 95 | 241 MB |
| analysis/pdfs_socialai/ | 65 | 146 MB |
| analysis/pdfs_sozarb/ | 65 | 144 MB |

**nächster schritt:** 294 PDFs von Zotero herunterladen mit `getPDF_intelligent.py --source zotero`

### thematisches assessment-schema

**technik-dimensionen (ja/nein):**
- AI_Literacies, Generative_KI, Prompting, KI_Sonstige

**sozial-dimensionen (ja/nein):**
- Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**inklusions-logik:**
(AI_Literacies OR Generative_KI OR Prompting) AND (Soziale_Arbeit OR Bias_Ungleichheit OR Gender OR Diversitaet OR Feministisch OR Fairness) → Include

### legacy vault (aus früherer pipeline)

vault: femprompt_vault/ mit 16 paper-notizen, 2 concept-notizen
top-konzepte: intersectionality (107x erwähnt), feminist ai (21x), bias mitigation (19x)

---

## sozarb (325 papers) - PAUSIERT

focus: ai literacy in social work for vulnerable populations

zotero: group library 6284300 (socialai-litreview-curated)

### pipeline-fortschritt (stand november 2025)

assessment: komplett (325/325 papers, 100% erfolgsrate)
- 222 include, 83 exclude, 20 unclear
- llm-based mit claude haiku 4.5, cost: $0.58

enhanced summarization v2.0: komplett (75 summaries)
- quality: 76.1/100 durchschnitt
- cost: $3.15

vault: sozarb_research_vault/ (266 papers, 144 concepts, 13 mocs)

web viewer: docs/ (nicht deployed)

---

## nächste schritte

### femprompt (priorität 1)

1. **PDFs von Zotero holen** - 294 PDFs verfügbar, 95 lokal vorhanden → ~200 neue PDFs laden
2. susi & sabine: thematisches assessment im google spreadsheet abschließen
3. christina: metadaten + pdf-links in zotero ergänzen
4. nach assessment: neuer export mit aktualisierten daten
5. pipeline: pdf acquisition → markdown → summaries → vault

### sozarb (pausiert)

- weitere 147 papers summarisieren ($6.17)
- web viewer deployment zu github pages

---

## kosten & performance

### femprompt (aktuell)
- thematisches assessment: $0 (manuell durch team)
- geschätzt nach assessment: ~$10-15 für pipeline

### sozarb (historisch)
- llm assessment: $0.58
- enhanced summarization: $3.15
- total spent: $3.73

---

## team

- christopher pollin: technische infrastruktur, pipeline
- susi sackl-sharif: thematisches assessment, forschungsleitung
- sabine klinger: thematisches assessment
- christina: zotero-kuratierung, metadaten

---

## dokumentation

knowledge/ folder:
- map-of-content.md: navigation
- methodology.md: prisma + thematisches schema
- technical.md: pipeline-referenz
- journal.md: entwicklungshistorie

---

version: 4.1 (pdf-bestand dokumentiert)
