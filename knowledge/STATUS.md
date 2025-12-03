# project status

last updated: 2025-12-03
branch: main

---

## current state

beide projekte im femprompt_sozarb repository sind operational mit unterschiedlichen vollständigkeitsgraden.

---

## femprompt (326 papers)

focus: feminist ai literacies and bias mitigation

status: pipeline komplett durchgelaufen, obsidian vault generiert

vault: femprompt_vault/ mit 16 paper-notizen, 2 concept-notizen

top-konzepte: intersectionality (107x erwähnt), feminist ai (21x), bias mitigation (19x)

zotero: group library 6080294

---

## sozarb (325 papers)

focus: ai literacy in social work for vulnerable populations

forschungsfrage: wie kann ein systematisches literature review die evidenzbasis für diskriminierungssensibles prompting in der sozialen arbeit schaffen

zotero: group library 6284300 (socialai-litreview-curated)

### pipeline-fortschritt

assessment: komplett (325/325 papers, 100% erfolgsrate)
- 222 include papers
- 83 exclude papers
- 20 unclear papers
- llm-based mit claude haiku 4.5
- cost: $0.58, duration: 24 minuten
- 5-dimensional relevance scoring

pdf acquisition: partiell (47 von 222 include papers)
- quelle: zotero-synced pdfs
- hierarchische akquisition implementiert aber nicht vollständig ausgeschöpft

markdown conversion: komplett für akquirierte pdfs (47 papers)
- tool: docling
- validation: 46 pass, 1 fail (corrupted file detected and excluded)
- location: analysis/markdown_papers_socialai/

enhanced summarization v2.0: komplett (75 summaries)
- papers processed: 75 enhanced summaries
- quality: 76.1/100 durchschnitt
- distribution: 45% excellent (>80), 36% good (60-79), 19% fair (<60)
- features: multi-pass analysis, quality scores, cross-validation, stakeholder-specific implications
- cost: $3.15 actual
- location: sozarb_research_vault/summaries/

vault generation: operational
- papers: 266 files (alle 325 papers mit yaml frontmatter)
- summaries: 75 enhanced v2.0
- concepts: 144 files
- mocs: 13 maps of content
- location: sozarb_research_vault/

web viewer: implementiert aber nicht deployed
- papers: 264 exported to json
- network: 896 edges
- features: search, filters, interactive visualization
- location: docs/
- status: not yet deployed to github pages

---

## nächste schritte

### sozarb kurzfristig

vault integration: enhanced summaries in paper-files einbetten

pdf acquisition: weitere 175 include papers (222 total statt 47)
- aktivierung aller 8 fallback-strategien
- erwartete coverage: 70-80%
- aufwand: 2-3 tage

enhanced summarization: weitere papers verarbeiten (147 additional)
- cost estimate: $6.17
- duration estimate: 6-7 stunden

web viewer deployment: github pages aktivierung
- aufwand: 5 minuten
- url: https://chpollin.github.io/femprompt_sozarb/

### beide projekte langfristig

documentation consolidation: complete-guide.md löschen (redundant), status.md aktualisieren, journal.md archivieren

feminist analysis extension: adaptive prompts mit 9 dimensionen für high-relevance papers

meta-synthesis: aggregierte feministische kritik-dokumente

---

## kosten & performance

### tatsächliche kosten (sozarb)

llm assessment: $0.58 (325 papers)
enhanced summarization v2.0: $3.15 (75 papers)
total spent: $3.73

### geschätzte kosten (verbleibend)

pdf acquisition: $0 (keine api costs)
markdown conversion: $0 (lokal)
summarization weitere 147 papers: $6.17
total für full corpus: ca. $9.90

---

## technische infrastruktur

pipeline orchestrator: run_pipeline.py (5 stages)

stage 1: getpdf_intelligent.py (8 fallback strategies)
stage 2: pdf-to-md-converter.py (docling)
stage 3: summarize_documents_enhanced.py (claude haiku 4.5, multi-pass)
stage 4: generate_obsidian_vault_improved.py (concept extraction)
stage 5: test_vault_quality.py (validation)

zusätzliche tools:
- validate_markdown_quality.py (corruption detection)
- integrate_summaries_direct.py (vault embedding)
- create_bidirectional_concept_links.py (concept linking)
- export_vault_to_web_data.py (web viewer json)

llm assessment: assessment-llm/assess_papers.py (100% automated)

---

## dokumentation

alle dokumentation in knowledge/ folder:
- map-of-content.md: zentrale navigation
- quickstart.md: 10-minuten-setup
- technical.md: vollständige technische referenz
- methodology.md: prisma 2020 framework
- theoretical-framework.md: feministische epistemologie
- assessment-llm.md: llm assessment system
- obsidian-web-publishing.md: web viewer strategie
- journal.md: entwicklungshistorie (zu archivieren)
- analysis-report.md: redundanz-analyse

root dokumentation:
- readme.md: projekt-übersicht
- claude.md: arbeitsregeln für claude

---

version: 3.0 (gekürzt auf aktuellen status)
