# knowledge/ folder analysis report

erstellt: 2025-12-03
zweck: vollständige analyse der dokumentationsstruktur zur identifikation von redundanzen und optimierungspotenzial

---

## executive summary

der knowledge/ ordner enthält 12 markdown-dateien mit insgesamt 6.003 zeilen dokumentation. die analyse identifiziert erhebliche redundanzen zwischen complete-guide.md (374 zeilen) und readme.md (root, verschoben), sowie veraltete informationen in status.md (540 zeilen, letztes update 2025-11-16).

hauptbefunde: 3 dateien sind veraltet (status.md, journal.md, project-overview.md), 2 dateien haben überlappende inhalte (complete-guide.md mit quickstart.md + technical.md), 4 dateien sind essentiell und gut gepflegt, gesamtpotenzial zur reduktion ca. 40% (2.400 zeilen).

---

## 1. datei-für-datei analyse

### 1.1 readme.md (88 zeilen)

funktion: dokumentations-index und navigations-hub

inhalt: übersichtstabellen (core, research, specialized documentation), projekt-status-übersicht (femprompt, sozarb), schnelleinstieg-links, letzte aktualisierung

bewertung: essentiell. klar strukturiert, aktuell (2025-12-03, version 2.4), erfüllt funktion als index perfekt, keine redundanzen.

empfehlung: behalten

---

### 1.2 status.md (540 zeilen)

funktion: aktueller projektstatus und nächste schritte

inhalt: detaillierter status beider projekte (femprompt, sozarb), pipeline-fortschritt, enhanced summarization pipeline v2.0 beschreibung, bidirectional concept linking, markdown quality validation tool, feminist analysis framework design, cost & performance estimates, next steps

bewertung: teilweise veraltet. letztes update 2025-11-16 (vor 17 tagen), enthält veraltete "next steps" (viele abgeschlossen), sehr detailliert (540 zeilen) aber große teile sind historisch, überschneidung mit journal.md (entwicklungshistorie).

redundanzen: enhanced pipeline beschreibung auch in technical.md und journal.md, projekt-status auch in readme.md und project-overview.md, pipeline-stufen auch in complete-guide.md, quickstart.md, technical.md

empfehlung: drastisch kürzen. entfernen: historische details (nach journal.md), technische details (nach technical.md). behalten: nur aktueller status (2-3 wochen relevant). ziel: 100-150 zeilen statt 540.

---

### 1.3 quickstart.md (320 zeilen)

funktion: schnelleinstieg für neue nutzer (10 minuten)

inhalt: installation (dependencies, api keys), quick run examples (5 szenarien), 7-step workflow (kompakt), performance estimates, common commands, troubleshooting, key innovations

bewertung: gut strukturiert. aktuell (2025-11-16, version 2.1), klar auf einsteiger ausgerichtet, gute balance zwischen kürze und vollständigkeit, aktuelle zahlen (75 summaries, 76.1/100 quality).

redundanzen: installation auch in complete-guide.md und technical.md, 7-step workflow auch in complete-guide.md und methodology.md, performance estimates auch in status.md und technical.md

empfehlung: behalten, aber verweise nutzen. installation-sektion auf 5 zeilen kürzen mit verweis auf technical.md, workflow auf übersicht reduzieren, details in technical.md.

---

### 1.4 complete-guide.md (374 zeilen)

funktion: vollständiger pipeline-guide (ehemaliges root/readme.md)

inhalt: projekt-übersicht, quick start, 7-step workflow (ausführlich), key features, project structure, documentation links, current status

bewertung: redundant. entstand durch verschiebung des alten root-readme, 80% überschneidung mit quickstart.md, 70% überschneidung mit technical.md, 50% überschneidung mit readme.md, keine einzigartigen inhalte.

redundanzen: quick start identisch zu quickstart.md, 7-step workflow auch in quickstart.md und methodology.md, project structure auch in technical.md, documentation links auch in readme.md, current status auch in status.md

empfehlung: löschen. alle inhalte sind in anderen dateien besser organisiert, quickstart.md ist die bessere einstiegs-datei, technical.md ist die bessere referenz.

---

### 1.5 technical.md (1.339 zeilen)

funktion: vollständige technische referenz

inhalt: system overview, requirements, pipeline architecture (5 stages), pre-pipeline workflow, stage-by-stage documentation, llm-based assessment, enhanced summarization pipeline v2.0, markdown quality validation, vault generation, web viewer export, api reference, error handling, testing & validation

bewertung: essentiell. aktuell (2025-11-16), sehr detailliert (1.339 zeilen), technisch präzise, enthält code-beispiele, vollständige api-dokumentation.

redundanzen: pipeline architecture auch in complete-guide.md und quickstart.md, requirements auch in quickstart.md, enhanced pipeline auch in status.md und journal.md

empfehlung: behalten als zentrale technische referenz. leichte kürzung möglich durch entfernung von beispiel-output (code-blöcke sind gut). potenziell 200 zeilen reduktion möglich.

---

### 1.6 methodology.md (168 zeilen)

funktion: prisma 2020 framework und methodische grundlagen

inhalt: prisma 2020 framework, multi-modell-recherche (prozess), ris-standardisierung (prozess), zotero-integration (prozess), qualitätsbewertung (methodik), prisma-assessment (prozess), alternative review-standards (jbi, cochrane, entreq, mmat), assessment-workflow (methodik)

bewertung: einzigartig und relevant. fokus auf wissenschaftliche methodik, keine technische implementierung (abgrenzung zu technical.md), prisma-spezifisch, gut strukturiert.

redundanzen: multi-modell-recherche auch teilweise in complete-guide.md und operational-guides.md, assessment-workflow auch in technical.md (technischer)

empfehlung: behalten. klare methodische perspektive, wichtig für wissenschaftliche validierung.

---

### 1.7 project-overview.md (99 zeilen)

funktion: forschungsfragen, ziele, scope (deutsch)

inhalt: forschungsfrage, zielsetzung, theoretischer rahmen (haraway, crenshaw), methodischer ansatz, scope und grenzen, status (infrastruktur, datensammlung, pipeline-execution)

bewertung: teilweise veraltet. status-sektion veraltet (letzte erwähnung: 2025-11-16, aber details stimmen nicht mehr), theoretischer rahmen duplikat zu theoretical-framework.md, methodischer ansatz duplikat zu methodology.md.

redundanzen: theoretischer rahmen vollständig in theoretical-framework.md (292 zeilen), methodischer ansatz vollständig in methodology.md (168 zeilen), status veraltet und in status.md ausführlicher

empfehlung: stark kürzen oder in andere dateien integrieren. forschungsfrage + zielsetzung nach readme.md integrieren, theoretischer rahmen verweis auf theoretical-framework.md, methodischer ansatz verweis auf methodology.md, status-sektion komplett entfernen (veraltet). ziel: 40 zeilen statt 99.

---

### 1.8 theoretical-framework.md (292 zeilen)

funktion: feministische epistemologie (deutsch)

inhalt: situiertes wissen (haraway), intersektionalität (crenshaw), response-ability (haraway), llm-ontologie und alignment-forschung (shanahan, summerfield, chen, anthropic), epistemologische implikationen, feministische operationalisierung in der pipeline

bewertung: einzigartig und hochwertig. sehr gut geschrieben, verbindet theorie mit technischer praxis, aktuelle forschung integriert (2024-2025), keine redundanzen.

empfehlung: behalten. kernstück der theoretischen fundierung, einzige datei mit dieser tiefe.

---

### 1.9 operational-guides.md (139 zeilen)

funktion: prompts, benchmarks, git-workflow

inhalt: prompt-templates (deep research, ris-konvertierung, dokumenten-zusammenfassung), benchmarks und schwellenwerte (inklusionsraten, inter-rater-reliabilität)

bewertung: teilweise veraltet. enhanced pipeline v2.0 erwähnt, aber legacy v1.0 prompt noch enthalten, benchmarks gut dokumentiert, git-workflow im dateinamen erwähnt aber nicht im inhalt.

redundanzen: prompt-templates teilweise in technical.md dokumentiert, enhanced pipeline results auch in status.md und journal.md

empfehlung: aktualisieren und umbenennen. entfernen: legacy v1.0 prompt. hinzufügen: git-workflow-sektion (falls relevant) oder dateinamen ändern. benchmarks sind wertvoll, behalten.

---

### 1.10 journal.md (1.802 zeilen)

funktion: entwicklungschronologie, entscheidungen, learnings

inhalt: detaillierte session-logs seit 2025-11-16, enhanced summarization pipeline v2.0 entwicklung, markdown quality validation tool entwicklung, full pipeline execution logs, quality results, technical decisions, cost analysis

bewertung: historisches archiv (zu detailliert). 1.802 zeilen (größte datei), sehr detailliert (zu detailliert für referenz), wichtig für transparenz aber schwer nutzbar, überschneidung mit status.md (aktuelle events).

redundanzen: enhanced pipeline beschreibung auch in status.md und technical.md, quality results auch in status.md, cost analysis auch in status.md und technical.md

empfehlung: archivieren oder drastisch kürzen. option a: verschieben nach knowledge/archive/journal.md (historisch wertvoll, aber nicht aktiv genutzt). option b: auf highlights reduzieren (200 zeilen: nur major decisions und learnings).

---

### 1.11 assessment-llm.md (169 zeilen)

funktion: llm-based prisma assessment system

inhalt: quick start, what it does, assessment schema, output, performance (run 5 results), rate limiting, error handling & auto-repair, quality checks, files, next steps

bewertung: gut strukturiert (ehemals assessment-llm/readme.md). aktuell verschoben von assessment-llm/, spezifisch für llm-assessment, standalone-dokumentation für ein modul, keine kritischen redundanzen.

redundanzen: performance results auch in status.md (aber hier detaillierter)

empfehlung: behalten. wertvoll als modul-dokumentation, gut abgegrenzt.

---

### 1.12 obsidian-web-publishing.md (673 zeilen - nach user-edit 593 zeilen)

funktion: web viewer strategy & implementation

inhalt: executive summary, strategische begründung, technische implementierung (vanilla js), web viewer features, data export system, local development, deployment, implementierungsstatus, file structure, design system, launch checklist, risk mitigation, cost-benefit analysis

bewertung: gut strukturiert. aktuell (nach user-edit auf 593 zeilen), strategische + technische perspektive, gut organisiert.

redundanzen: file structure auch in technical.md (aber unterschiedliche perspektive: web viewer vs. pipeline)

empfehlung: behalten. einzige dokumentation für web viewer, strategisch wichtig.

---

## 2. redundanz-matrix

inhalt verteilt über dateien (primärquelle in klammern):

installation: quickstart (primär), complete-guide, technical
7-step workflow: quickstart (primär), complete-guide (primär), technical, methodology
pipeline architecture: status, quickstart, complete-guide, technical (primär)
enhanced pipeline v2.0: status (primär), technical (primär), operational-guides, journal (primär)
performance estimates: status, quickstart, complete-guide, technical (primär), journal
project status: readme, status (primär), complete-guide, project-overview
prisma methodik: methodology (primär)
theoretischer rahmen: project-overview, theoretical-framework (primär)
prompt templates: operational-guides (primär)
quality results: status, journal (primär), assessment-llm

---

## 3. verbindungen zwischen dateien

### 3.1 hierarchische struktur (ist-zustand)

readme.md (index) verweist auf quickstart.md (erste schritte), complete-guide.md (vollständige übersicht, redundant), technical.md (technische tiefe), status.md (aktueller stand), journal.md (entwicklungshistorie)

research context (deutsch): project-overview.md (forschungsfragen), theoretical-framework.md (feministische epistemologie), methodology.md (prisma framework), operational-guides.md (prompts & benchmarks)

specialized: assessment-llm.md (llm assessment modul), obsidian-web-publishing.md (web viewer strategie)

### 3.2 informationsfluss (wer verweist auf wen?)

readme.md verweist auf alle anderen, quickstart.md verweist auf technical.md (für details), complete-guide.md verweist auf readme.md (deprecated loop, problem), status.md verweist auf technical.md und project-overview.md und methodology.md, technical.md referenziert methodology.md (wissenschaftliche grundlage), project-overview.md referenziert theoretical-framework.md und methodology.md

problem: complete-guide.md verweist zurück auf readme.md, zirkuläre referenz.

---

## 4. identifizierte probleme

### 4.1 redundanzen (kritisch)

complete-guide.md vs. quickstart.md + technical.md: 80% überschneidung mit quickstart.md, 70% überschneidung mit technical.md, keine einzigartigen inhalte. lösung: complete-guide.md löschen.

status.md vs. journal.md: status.md hat 540 zeilen mit vielen historischen details, journal.md hat 1.802 zeilen session-logs, überschneidung: enhanced pipeline v2.0 beschreibung (200+ zeilen). lösung: status.md auf aktuellen status reduzieren (100 zeilen), journal.md archivieren.

project-overview.md vs. theoretical-framework.md + methodology.md: theoretischer rahmen hat 20 zeilen in project-overview und 292 zeilen in theoretical-framework, methodischer ansatz hat 15 zeilen in project-overview und 168 zeilen in methodology. lösung: project-overview.md auf 40 zeilen kürzen, verweise nutzen.

### 4.2 veraltete informationen

status.md (letztes update: 2025-11-16, vor 17 tagen): "next steps" sind teilweise erledigt, "current focus" ist nicht mehr aktuell. lösung: aktualisieren auf 2025-12-03.

project-overview.md (status-sektion veraltet): "75 summaries (alle vom nov 16)" stimmt, aber status-sektion enthält veraltete todos. lösung: status-sektion entfernen (ist in status.md).

operational-guides.md (legacy v1.0 prompt noch enthalten): enhanced pipeline v2.0 erwähnt, aber alter prompt dokumentiert. lösung: legacy-prompt entfernen.

### 4.3 fehlende inhalte

operational-guides.md - git-workflow fehlt: dateiname verspricht "git-workflow", aber inhalt fehlt. lösung: git-workflow hinzufügen oder dateinamen ändern zu prompts-and-benchmarks.md.

---

## 5. empfohlene maßnahmen

### 5.1 sofort (kritisch)

löschen: complete-guide.md (374 zeilen). vollständig redundant, alle inhalte in quickstart.md und technical.md besser organisiert. ersparnis: 374 zeilen.

drastisch kürzen: status.md (540 nach 150 zeilen). entfernen: historische details (nach journal.md), technische details (nach technical.md). behalten: nur aktueller status (2-3 wochen relevant). ersparnis: 390 zeilen.

aktualisieren: status.md. datum: 2025-11-16 nach 2025-12-03, next steps: überprüfen und aktualisieren. aufwand: 10 minuten.

### 5.2 kurzfristig (diese woche)

archivieren: journal.md (1.802 zeilen nach knowledge/archive/). verschieben nach knowledge/archive/journal-2025-11.md, historisch wertvoll aber nicht aktiv genutzt, neues journal.md: nur aktuelle session (letzte 2 wochen), 200 zeilen max. ersparnis: 1.600 zeilen im hauptordner.

kürzen: project-overview.md (99 nach 40 zeilen). forschungsfrage + zielsetzung behalten (30 zeilen), theoretischer rahmen: verweis auf theoretical-framework.md, methodischer ansatz: verweis auf methodology.md, status-sektion: komplett entfernen. ersparnis: 59 zeilen.

aktualisieren: operational-guides.md. entfernen: legacy v1.0 prompt, hinzufügen: git-workflow-sektion (falls relevant), oder: umbenennen zu prompts-and-benchmarks.md. aufwand: 20 minuten.

### 5.3 optional (langfristig)

leichte kürzung: technical.md (1.339 nach 1.150 zeilen). entfernen: redundante beispiel-outputs, code-blöcke sind gut, aber manche outputs können verlinkt werden. ersparnis: 200 zeilen.

verweise nutzen: quickstart.md. installation-sektion auf 5 zeilen kürzen mit verweis auf technical.md, workflow auf übersicht reduzieren, details in technical.md. ersparnis: 50 zeilen.

---

## 6. zusammenfassung

### 6.1 behalten (8 dateien)

readme.md: 88 zeilen, perfekter index
quickstart.md: 320 zeilen, beste einstiegs-datei
technical.md: 1.339 zeilen, zentrale technische referenz
methodology.md: 168 zeilen, einzigartige wissenschaftliche perspektive
theoretical-framework.md: 292 zeilen, kernstück der theoretischen fundierung
assessment-llm.md: 169 zeilen, modul-spezifische dokumentation
obsidian-web-publishing.md: 673 zeilen, einzige web viewer dokumentation
operational-guides.md: 139 zeilen, wertvolle prompts & benchmarks

summe: 3.188 zeilen

### 6.2 kürzen/aktualisieren (2 dateien)

status.md: vorher 540, nachher 150, reduktion -390 zeilen (-72%)
project-overview.md: vorher 99, nachher 40, reduktion -59 zeilen (-60%)

summe einsparung: 449 zeilen

### 6.3 löschen (1 datei)

complete-guide.md: 374 zeilen, 100% redundant

summe einsparung: 374 zeilen

### 6.4 archivieren (1 datei)

journal.md: 1.802 zeilen nach knowledge/archive/journal-2025-11.md

summe reduktion im hauptordner: 1.802 zeilen (neue datei: 200 zeilen)

### 6.5 gesamtbilanz

aktuell: 6.003 zeilen (100%)
nach bereinigung: 3.615 zeilen (60%)
reduktion: 2.388 zeilen (40%)

---

## 7. prioritätenliste

stufe 1 sofort (10 minuten): complete-guide.md löschen (-374 zeilen), status.md aktualisieren (datum + next steps)

stufe 2 diese woche (1 stunde): status.md drastisch kürzen (540 nach 150 zeilen), project-overview.md kürzen (99 nach 40 zeilen), journal.md archivieren (nach archive/), operational-guides.md aktualisieren (legacy-prompt entfernen)

stufe 3 optional (2 stunden): technical.md leicht kürzen (1.339 nach 1.150 zeilen), quickstart.md verweise optimieren (320 nach 270 zeilen)

---

## 8. finale empfehlung

sofortmaßnahme: complete-guide.md löschen + status.md aktualisieren (10 minuten)

diese woche: stufe 2 komplett durchführen (1 stunde aufwand, 2.388 zeilen reduktion)

resultat: klarere struktur (11 statt 12 dateien im hauptordner), weniger redundanz (40% weniger zeilen), aktuellere information (status.md, project-overview.md), bessere wartbarkeit (kürzere dateien, klare verantwortlichkeiten)

nächster schritt: user-feedback einholen, dann stufe 1 + 2 umsetzen.
