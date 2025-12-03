# knowledge base map of content

zentrale navigation für die femprompt & sozarb pipeline dokumentation

letzte aktualisierung: 2025-12-03

---

## einstieg

neu im projekt: [quickstart.md](quickstart.md)
installation, erste schritte, beispiele für neue nutzer. 10-minuten-setup mit allen wichtigen befehlen.

aktueller status: [status.md](status.md)
wo steht das projekt, was ist erreicht, nächste schritte. zeigt pipeline-fortschritt für beide projekte (femprompt, sozarb).

vollständige analyse: [analysis-report.md](analysis-report.md)
detaillierte analyse der dokumentationsstruktur, identifikation von redundanzen, optimierungsempfehlungen.

---

## technische dokumentation

technische referenz: [technical.md](technical.md)
komplette technische dokumentation. system requirements, pipeline architecture (5 stages), api reference, error handling, testing. zentrale referenz für entwickler.

llm assessment: [assessment-llm.md](assessment-llm.md)
llm-based prisma assessment system. automatisierte bewertung von 325 papers mit claude haiku 4.5, 5-dimensionale relevanz-scores, 100% erfolgsrate.

web viewer: [obsidian-web-publishing.md](obsidian-web-publishing.md)
web viewer strategie und implementierung. vanilla javascript ansatz, github pages deployment, design system, interaktive visualisierung.

vollständiger guide: [complete-guide.md](complete-guide.md)
vollständiger pipeline-guide mit allen features (warnung: redundant, siehe analysis-report.md für details).

---

## forschungskontext (deutsch)

projekt-übersicht: [project-overview.md](project-overview.md)
forschungsfragen, zielsetzung, scope und grenzen. deutsche perspektive auf das gesamtprojekt.

theoretischer rahmen: [theoretical-framework.md](theoretical-framework.md)
feministische epistemologie. situiertes wissen (haraway), intersektionalität (crenshaw), response-ability, llm-ontologie und alignment-forschung.

methodik: [methodology.md](methodology.md)
prisma 2020 framework, multi-modell-recherche, qualitätsbewertung, alternative review-standards (jbi, cochrane, entreq, mmat).

operative anleitungen: [operational-guides.md](operational-guides.md)
prompt-templates, benchmarks und schwellenwerte, inter-rater-reliabilität.

---

## entwicklungshistorie

entwicklungs-journal: [journal.md](journal.md)
chronologische dokumentation aller entwicklungsschritte, technische entscheidungen, learnings. session-logs seit 2025-11-16 mit enhanced pipeline v2.0 entwicklung.

---

## dokument-funktionen

quickstart.md: schnelleinstieg (10 minuten), installation, quick run examples, 7-step workflow kompakt, troubleshooting

technical.md: zentrale technische referenz, system overview, requirements, pipeline architecture, stage-by-stage dokumentation, api reference

status.md: aktueller projektstatus, pipeline-fortschritt beide projekte, enhanced summarization pipeline v2.0, cost & performance estimates, next steps

methodology.md: prisma 2020 framework, multi-modell-recherche prozess, ris-standardisierung, zotero-integration, qualitätsbewertung

theoretical-framework.md: feministische epistemologie, situiertes wissen, intersektionalität, response-ability, llm-ontologie, epistemologische implikationen

project-overview.md: forschungsfrage, zielsetzung, theoretischer rahmen überblick, methodischer ansatz, scope und grenzen

operational-guides.md: prompt-templates (deep research, ris-konvertierung, dokumenten-zusammenfassung), benchmarks und schwellenwerte

assessment-llm.md: llm assessment system, assessment schema, performance results, error handling & auto-repair, quality checks

obsidian-web-publishing.md: web viewer strategie, technische implementierung vanilla js, web viewer features, data export system, deployment

journal.md: entwicklungschronologie, detaillierte session-logs, enhanced summarization pipeline v2.0 entwicklung, quality results, cost analysis

complete-guide.md: vollständiger pipeline-guide (warnung: 100% redundant zu quickstart.md + technical.md, siehe analysis-report.md)

analysis-report.md: dokumentationsstruktur-analyse, redundanzen identifikation, 40% einsparungspotenzial, priorisierte maßnahmenempfehlungen

---

## informationsfluss

einstieg → quickstart.md → technical.md (für details)
forschung → project-overview.md → theoretical-framework.md (theorie) + methodology.md (methodik)
entwicklung → journal.md (historie) → status.md (aktuell)
module → assessment-llm.md (llm assessment) + obsidian-web-publishing.md (web viewer)
optimierung → analysis-report.md (redundanzen, empfehlungen)

---

## projekte

femprompt (326 papers): feminist ai literacies and bias mitigation. status: pipeline komplett, obsidian vault generiert. zotero group library 6080294.

sozarb (325 papers): ai literacy in social work for vulnerable populations. status: enhanced summaries v2.0 komplett (75 summaries, 76.1/100 avg quality). zotero group library 6284300. pipeline: assessment komplett (222 include), pdfs (47), markdown, enhanced summaries v2.0 (75), vault integration ausstehend.

---

version: 2.5 (map of content structure)
