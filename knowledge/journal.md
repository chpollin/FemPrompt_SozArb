---
title: Journal
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: de
version: "0.2"
created: 2026-02-18
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
related: [INDEX, plan, specification, design]
---

# Arbeitsjournal

Dies ist die Prozessschicht des Projekts. Sie hält das Warum und die Sackgassen fest, die Git nicht erfasst, alte Zustände, verworfene Richtungen und Entscheidungen, die spätere Sitzungen wieder umgestoßen haben, bleiben lesbar. Es ist keine vollständige Sitzungschronik; die einzelnen Commits und Datei-für-Datei-Diffs leben in der Git-Historie, hier steht die nachvollziehbare Genese der Entscheidungen und Sackgassen. Zahlen werden qualitativ benannt; sie leben in den Daten und im Evidence Companion, nicht in diesem Journal.

---

## PRISM and the epistemic infrastructure (2026)

### 2026-07-18: Analyse-Codier-Panel gebaut (FR-14, ADR-026), Screening-Record byte-identisch

- **Ziel:** Das inline Analyse-Panel für die qualitative Codierung nach FR-14 und ADR-026 umsetzen, die `AN_`-Felder aus `assessment/categories.yaml` v1.3 als geschlossene Auswahl direkt in der Bewertungsspalte, sichtbar nur bei bindender Entscheidung Include, ohne den Screening-Record anzutasten.
- **Verlauf:** Test-first, elf Tests nach Section K (Include-Sichtbarkeit, geschlossenes Vokabular, Nicht-entscheidbar als `AN_Notes`-Zeile, Reviewer-Datei-Determinismus und Abwärtskompatibilität, byte-identischer Record, Export-Spaltenreihenfolge), dann implementiert bis grün. Die statische App liest das YAML nicht, darum ein committeter Generator `src/publish/build_analysis_fields.py` nach dem Muster von `build_screening_index.py`, der aus dem eingefrorenen `analysis_fields`-Block `docs/data/analysis_fields.json` emittiert, die eine Quelle für das Panel, keine handgepflegte Zweitliste im JS. Im Tool ein Vokabular-Loader (parallel zum Fulltext-Manifest, headless über `window.__ANALYSIS_FIELDS__` injiziert), `sanitizeAnalysis` als Durchsetzungspunkt (kein Wert außerhalb v1.3 überlebt Erfassung, Import oder Export; Multi-Felder sortiert und dedupliziert), `setAnalysis` schreibt die Codes in ein `analysis`-Unterobjekt neben den Record, `analysisNotes` faltet je nicht-entscheidbarem Feld eine `Feld: nicht entscheidbar aus <Basis>`-Zeile in `AN_Notes` (kein neuer Vokabular-Code, update-protocol C), `harmTypesHint` als weicher Hinweis bei Fulltext-Basis (B.1 Punkt 3, nie harte Sperre). Panel-Render `analysisPanelHtml` in `assessLockedHtml` unter dem Entscheidungsblock, nur auf Include, verdrahtet über `attachAnalysisPanel`. Export `analysisCsv` im `human_assessment.csv`-Spaltenschema, `AN_`-Spalten nach Notes in der update-protocol-D-Reihenfolge (AN_Prompting_Role nach AN_Population, B.1 Punkt 7), Multi-Select semikolonsepariert; als eigener Button im Daten-Panel, das Decision-Log-CSV unberührt.
- **Ergebnis:** Harness 91/91 PRISM (von 78), 15/15 Companion. Der `git diff` von `prisma.js` ist rein additiv, keine bestehende Funktion geändert, damit ist die harte Grenze strukturell erfüllt, eine Sitzung ohne Analysefeld erzeugt exakt dieselbe Reviewer-Datei wie vor dem Change (test-belegt, `reviewerFileText` führt bei fehlendem `analysis`-Key keinen Key ein). specification.md FR-14 und ADR-026 auf den Umsetzungsstand gezogen.
- **Offen:** E1, E5, E7 bleiben mit den Codiererinnen offen (Codier-Aufstellung, Überlappungsstichprobe, Ambiguitätsschwelle). Der Excel-Rückfluss über die P3-Brücke liest heute nur die Screening-Spalten; die `AN_`-Spalten des Analyse-Exports wieder einzulesen ist nicht Teil von FR-14 und bleibt offen, falls Bestände außerhalb des Tools codiert werden.
- **Dead Ends:** Das Vokabular im JS zu spiegeln wäre der kürzere Weg gewesen, hätte aber eine zweite Wahrheitsquelle neben `categories.yaml` geschaffen, die nach dem nächsten Amendment driftet; der committete Generator hält die eine Quelle. Die AN-Codes in den bindenden Record zu schreiben statt in ein eigenes `analysis`-Unterobjekt hätte die byte-identische Grenze gebrochen, sobald ein Include codiert wird; das Unterobjekt hält Screening und Analyse getrennt.
- **Korrektur (unabhängige Verifikation, gleicher Tag):** Drei Befunde test-first behoben. (1) Datenverlust im Überarbeiten-Zyklus, `editRecord` rehydrierte `analysis` nicht und `commit` schrieb den Record ohne den Key, ein Überarbeiten plus erneutes Erfassen löschte still alle AN-Codes; jetzt trägt `work.analysis` die Codes durch den Zyklus, ein Re-Commit als Include erhält sie, ein Wechsel weg von Include verwirft sie bewusst (Codierregel 1, test-belegt). (2) `Studientyp` war im Panel nicht erfassbar, obwohl v1.3 die Spalte für Include verpflichtend macht, der Export schrieb sie immer leer; jetzt als geschlossene Einfachauswahl aus `study_types` derselben JSON-Quelle im Panel, durch `sanitizeAnalysis` mit gleicher Strenge validiert, ohne Nicht-entscheidbar-Toggle (Unclear ist im Vokabular) und in den Export durchgereicht. (3) `AN_EXPORT_ORDER` war eine hartcodierte Zweitliste neben `anFieldNames()`, ein künftiges YAML-Feld wäre still aus dem Export gefallen; jetzt leitet `anExportOrder()` die Export-Feldmenge aus dem geladenen Vokabular ab und wendet nur die Umordnungsregel an (AN_Prompting_Role nach AN_Population, B.1 Punkt 7), ein Test bindet die Export- an die Panel-Feldmenge. Harness 94/94 PRISM, 15/15 Companion.

### 2026-07-17: Distillat-Prüflauf nach distillate-check-plan, Stufen 1 und 2 gelaufen

- **Ziel:** Den Distillat-Bestand `generated/distilled/` auf die Fehlerklasse Modell-Paraphrase statt Zitat prüfen, deterministische Vorprüfung und adversariale Maschinenprüfung nach [[distillate-check-plan]], ohne ein Distillat zu verändern.
- **Verlauf:** Prüfscript `src/assess/evidence_audit.py` geschrieben. Es liest je Distillat die Kategorie-Evidenz aus dem Stage-1-JSON, wo die geflaggten Kategorien und der Evidenztext liegen, extrahiert die in Anführungszeichen gesetzten Wörtlichteile und matcht sie zeichengenau gegen den Volltext in `generated/markdown_clean/`. Zuordnung Distillat zu Volltext über eine Kaskade aus exaktem Dateinamen und Titel. Autoritative Kategoriezuordnung sind die Booleans im Stage-1-JSON. Ausgabe je Eintrag Zitat vorhanden, Match, Zitat-Hash zur Duplikaterkennung. Report unter `generated/distilled/_evidence_audit/`, dieser Pfad ist neu gitignoriert. Stufe 2 las alle F- und G-Kandidaten und eine P-Stichprobe gegen Volltext und Kategoriedefinition in `assessment/categories.yaml`, advisory.
- **Ergebnis:** Zählungen im Report, `AUDIT-SUMMARY.md` und `stage1_report.json` im Audit-Ordner, hier keine Fixwerte. Kern der Befunde: die Kategorie-Evidenz mischt verankerte Wörtlichzitate mit Modell-Paraphrase in Anführungszeichen; ein großer Teil der als Zitat ausgewiesenen Spans löst sich zeichengenau nicht auf, teils echte Confabulation, teils Matcher- und docling-Artefakt. Der scharfe ADR-018-Defekt, identischer Screening-Blurb unter den meisten Kategorien, tritt in dieser Generation nicht auf; die Duplikate sind generische Kurzphrasen. Vier klare Polaritätsfehler, in denen die Evidenz die zugeordnete Kategorie selbst verneint. Eigener Verdacht auf fehlassoziierte Metadaten bei den Kurznamen-Distillaten, deren Titel nicht zum Dateinamen passt und deren Volltext nicht auflösbar ist.
- **Offen:** Stufe 3, die bindende menschliche Verifikation, bleibt beim Operator. An sie gehen alle F-, D- und G-Fälle, die P-Stichprobe und die Distillate ohne auflösbaren Volltext. Migrationskonsequenz nach Plan Abschnitt 6, nur Klasse-OK-Einträge dürfen als verankerte Zitate nach `research-vault/10_distillates/` wandern, P-Einträge als eigene Prosa ohne Ankeranspruch, F-, D- und G-Einträge nicht.
- **Dead Ends:** Gerade einfache Anführungszeichen als Zitat-Delimiter kollidieren mit Apostrophen, eine perfekte Zitatextraktion ist damit nicht deterministisch erreichbar; die Vorprüfung bleibt bewusst überinklusiv auf F und reicht die Entscheidung an Stufe 2 und den Menschen weiter. Ein naiver Polaritäts-Scan über Verneinungswörter übertrifft massiv, weil "lack of diversity" oder "Fehlen von Fairness" die Kategorie stützen statt ihr zu widersprechen; erst der enge Scan auf Verneinung des Kategorien-Fokus selbst isolierte die echten G-Fälle.

### 2026-07-17: M3-Entscheide eingearbeitet, research-vault-Verhältnis geklärt, Plandateien nach knowledge/

- **Ziel:** Die über die Forschungsleitstelle freigegebenen M3-Entscheide im Repo verankern, die zwei Plandokumente an ihren Wissensort ziehen und den offenen externen Rechercheschritt festhalten.
- **Entscheid research-vault zu generated/distilled (Operator, 2026-07-17).** Das Verhältnis ist entschieden, beide Bestände bleiben. `generated/distilled/` bleibt Pipeline-Output, der maschinell erzeugte Rohstoff aus der Distillation-Pipeline. Der geplante `research-vault/` wird die kuratierte Quelle für Belegketten, in der jede Kernaussage über die Ankerschicht `00_representation/` an ihre zeichengenaue Fundstelle gebunden ist. Die Migration eines `generated/distilled/`-Distillats in `research-vault/10_distillates/` ist damit kein Kopieren, sondern die verankernde Prüfung gegen den Ursprung, deren Prüfplan in [[distillate-check-plan]] liegt. Der Aufbau des `research-vault/` folgt [[research-vault-plan]] und bleibt Operator-gated.
- **Verlauf:** `research-vault-plan.md` und `distillate-check-plan.md` von `corpus/deep-research/` nach `knowledge/` verschoben, weil beide Steuerungswissen über die Arbeit tragen, nicht Deep-Research-Ausbeute. Beide waren untracked, daher normales Verschieben statt `git mv`. Die wechselseitigen Verweise der zwei Dateien sind dateiort-relativ und bleiben korrekt, da beide gemeinsam wandern; alle übrigen Pfadzeiger sind repo-root-relativ. `literature-review-prompt-round2.md` blieb bewusst in `corpus/deep-research/`. Beide Dokumente in [[INDEX]] registriert, in der Dokumententabelle, im `related`-Frontmatter und als eigener Lesepfad.
- **Offen, externer Deep-Research-Durchgang.** Die zweite Deep-Research-Runde nach `corpus/deep-research/literature-review-prompt-round2.md` bleibt offen und wird durch den Operator ausgeführt, nicht durch die Leitstelle. Ihre Vorbedingungen sind die Präregistrierungs-Offenpunkte in [[update-protocol#10. Open items before finalization]], die vor dem ersten Round-2-Lauf aufgelöst sein müssen und hier nur referenziert, nicht beantwortet werden.
- **Ergebnis:** Zwei Dateien verschoben, [[INDEX]] und dieses Journal aktualisiert. Working Tree, nichts committet, keine Branch-Operation. Die Ordner `_sources/` und `00_representation/` nicht angefasst.

### 2026-07-17: research-vault-Skelett gebaut, erste Migrationswelle nach der Audit-Vorbedingung

- **Ziel:** Den Top-Level-Ordner `research-vault/` nach [[research-vault-plan]] anlegen und die vom Evidence-Audit als unauffällig ausgewiesenen Distillate in die Belegkette überführen, ohne die geschützten Ebenen anzufassen.
- **Verlauf:** Committed Ebenen `references/`, `10_distillates/`, `20_claims/`, `30_deliverable/` angelegt, dazu `README.md` mit Ebenenregeln, Statusleiter, Tote-Anker-Regel und Glossar. Die gitignorten Ebenen `_sources/` und `00_representation/` wurden nicht angelegt, sie tragen geschütztes Material und stehen jetzt in der `.gitignore` gesperrt, nach dem schon geltenden Muster für `docs/data/fulltext/`. Die Migrationsentscheidung folgt der Präregistrierungs-Vorbedingung. Aus `generated/distilled/_evidence_audit/stage1_report.json` je Distillat die Befundklassen aggregiert, die vier G-Fälle aus `stage2_verdicts.json` ergänzt, die Distillate ohne auflösbaren Volltext als Migrationssperre geführt. Ein Distillat migriert nur ohne F-, D- und G-Befund. Die migrierten Dokumente tragen neuen Frontmatter mit `layer`, `source_distillate`, `audit` und `status: migrated`, je Migrat ein CSL-JSON-Referenz-Record in `references/`.
- **Ergebnis:** Skelett steht, eine erste Migrationswelle unauffälliger Distillate in `10_distillates/`, je Migrat ein Referenz-Record. Die nicht migrierten F-, D-, G- und U-Distillate sind in `research-vault/waitlist.md` mit Befundklassen und Verweis auf die Stufe-3-Verifikation registriert, die Verteilungszahlen leben dort als Momentaufnahme, nicht im INDEX oder in Hub-Texten. [[INDEX]] auf den Umsetzungsstand aktualisiert. Working Tree, nichts committet.
- **Offen:** Der Status `grounded` ist bewusst nicht gesetzt. Er setzt eine reale `00_representation/`-Ankerschicht und eine gelaufene Ankerauflösung voraus, beides steht aus und läuft nur lokal mit den Volltexten. Die migrierten Distillate übernehmen vorerst ihre Kategorie-Evidenz aus dem Pipeline-Output unverändert, die verankernde Prüfung jeder Evidenz gegen `00_representation/` ist der nächste Schritt. `20_claims/` und `30_deliverable/` sind leer angelegt, die Claim-Bildung über die Distillate hinweg folgt später. Die 49 als `P-pending` migrierten Distillate warten auf die menschliche P-Einstufung, die entscheidet, ob ihre P-Evidenz als eigene Prosa ohne Ankeranspruch bleibt.
- **Dead Ends:** Die adversariale Stufe 2 lieferte keine vollständige Pro-Distillat-G-Klassifikation, nur vier benannte Fälle plus Stichproben. Die G-Sperre stützt sich daher auf diese vier exakt, nicht auf einen flächigen G-Scan, das bleibt eine bekannte Lücke für die menschliche Prüfung. Der G-Fall Tun trägt im Dateinamen einen en-dash, die Stufe-2-Notiz einen Hyphen; die Zuordnung lief über Präfix-Match, sonst wäre die Sperre am Zeichen vorbeigelaufen.

### 2026-07-01 (Session 29): Volltext lokal verdrahtet, Kategorien dreistufig, Q1/Q2 als Hauptfragen

- **Ziel:** Den echten Docling-Volltext im PRISM-Lesebereich sichtbar machen, die Kategorien von binär auf dreistufig heben, und die vier in dieser Sitzung gesetzten Entscheidungen durch Tool und Doku ziehen.
- **Verlauf:** Zuerst der Befund, dass die servierten Wissensdokumente unter `## Full Text` leer sind und der Lesebereich nur einen Stumpf zeigte, während die echten Volltexte ungenutzt in `generated/markdown_clean/` lagen. Ein neuer Generator `build_fulltext.py` löst jedes Paper über `source_file` (Fallback Autor-Jahr) auf, bereinigt (Frontmatter, Bildkommentare, GLYPH-Artefakte) und schreibt `docs/data/fulltext/{id}.md` plus Manifest; 283 von 326 Papern tragen Volltext. Die Leseansicht lädt ihn als Volltext-Ebene, das Destillat bleibt KI-Extraktion (ADR-025). Der Copyright-Hinweis im Index-Builder ist bindend: die Volltexte sind gitignored und werden nie öffentlich, der öffentliche Suchindex bleibt destillatbasiert. Vier Entscheidungen gesetzt: dreistufige Kategorien (nein/teilweise/ja auf Exclude/Unclear/Include, ADR-024), Q1/Q2 als gleichrangige Hauptfragen, Volltext nur lokal, Umsetzung nach Liste. Das Tool umgebaut, der Chip zykelt drei Zustände, `deriveDecision` dreiwertig, die bisher tote Unclear-Entscheidung trägt jetzt die Teildeckung, der reason-gated Override (ADR-023) hebt Exclude oder Unclear zu Include. Dazu die Bestandsannotationen sichtbar (Seed-Kategorien, Mensch/KI-Divergenz-Badge) und die aufgeschobene UI-Politur (veraltete Kommentare, aria-label an den Suchfeldern, doppelter Chip-Tooltip aufgelöst, Such-Entprellung, CSS-Banner entdekoriert). project.md, specification.md, data.md, methods.md und plan.md auf die vier Entscheidungen gezogen.
- **Ergebnis:** Harness 76/76 (vier neue Tests für Teilweise/Unclear und den Chip-Vertrag) plus 15/15 Companion, grün nach jedem Batch. Alles im Working Tree, nichts committet.
- **Dead Ends:** Den Volltext in die servierten Wissensdokumente einzubetten wäre der naive Weg gewesen, hätte aber rund 23 MB Copyright-Material in das committete `docs/` gezogen; separat-fetch mit gitignore ist die richtige Grenze. Die Kategorie-Evidenz-Zitate im Text zu verankern scheitert an der Datenlage (deutsche KI-Paraphrasen über englischem Text), darum als Referenzliste statt In-Text-Markierung.

### 2026-06-30 (Session 28): die offenen Fragen selbst recherchiert und entschieden, O2 aufgelöst

- **Ziel:** Statt die operatorpflichtigen Funde und O2 zurückzudelegieren, jede Frage selbst am Standard (Repo und Web) und am Vault ausarbeiten, begründet entscheiden und die Konsequenzen umsetzen.
- **Verlauf:** O2 am Primärstandard geerdet, RAISE P1 (Synthesist ultimativ verantwortlich), P2 (menschliche Entscheidung bindend, Regel beratend) und P3 (jede übersteuerte regelbasierte Beurteilung transparent dokumentieren), bestätigt per Websuche und [[standards]]. Daraus folgt zwingend der begründungspflichtige Override zu Include: `finalDecisionOf` symmetrisch, ein Override-Block mit Pflicht-Begründung, `override_reason` im Record, in der gesperrten Ansicht gezeigt und beim Überarbeiten rehydriert, ADR-023. Die fünf vermeintlichen Lösch-Funde aufgelöst, nicht blind gelöscht: der 5D-Track ist real unter `assessment/llm-5d/` archiviert, und beide READMEs dokumentieren seine vier Skripte unter `assessment/llm-5d/scripts/`; der Restrukturierungs-Sweep hatte sie fälschlich in den aktiven `src/assess/`-Baum gezogen (genau die Quelle der Audit-Verwirrung), also zurückverschoben, importsicher, ohne eine Doku-Zeile zu ändern. `acquire_pdfs.py` bleibt, weil `methods.md` es bereits als Teil der Vier-Strategien-Akquise für Runde 2 führt; der All-Caps-Block bleibt (bewusst aufbewahrt). Nur `summarize_documents.py` gelöscht, verwaist, ohne Artefakt, im Widerspruch zur dokumentierten Pipeline. `gotoNextOpen` bewusst unverändert, mit Kommentar, weil textlose Paper erreichbar bleiben müssen, um als No full text ausgeschlossen zu werden.
- **Ergebnis:** Drei Commits (5D-Archiv wiederhergestellt plus Waise gelöscht; O2 implementiert; Journal). Harness 72/72, ein DOM-Smoke bestätigt den ganzen Override-Flow. Damit sind alle offenen operatorpflichtigen Punkte und O2 aufgelöst.
- **Dead Ends:** Den 5D-Track zu löschen war die naheliegende, falsche Lesart des Audits; er ist ein archivierter Reproducer, die richtige Operation war Wiederherstellung der dokumentierten Struktur, nicht Entfernung. Eine starre AND-Regel als O2-Antwort scheidet aus, sie widerspricht dem bindenden-Menschen-Prinzip des Projekts und RAISE direkt.

### 2026-06-30 (Session 27): Audit-Workflow über Frontend und Pipeline, entscheidungsfreie Funde umgesetzt

- **Ziel:** Frontend und Datenverarbeitung geerdet verbessern, ohne Arbeit zu erfinden; den entscheidungsfreien Teil sofort umsetzen, die operatorpflichtigen Funde vorlegen statt eigenmächtig ganze Skripte zu löschen.
- **Verlauf:** Ein Acht-Wege-Audit-Workflow (lesende Auditoren je Subsystem, jeder Fund adversarisch verifiziert) lieferte 17 bestätigte Funde, 21 low, 2 vom Verify verworfen, darunter ein vermeintlicher f-string-Crash in compare_conditions.py, der valides Python ist (Fill-Zeichen `:` mit Linksausrichtung). Umgesetzt in vier Commits: (C1) Companion-Korrektheit, Divergenzen über die stabile paper_id statt Titel plus author_year matchen, weil distinct Paper mit gleichem author_year unter last-write-wins zu doppelten Karten und Datenverlust kollabierten, Status-Sortierung repariert (order['false'] ist 0, und 0 || 2 versenkte die Divergenzen ans Ende), tote Schreibzugriffe entfernt; (C2) tote kappa/meta-Fläche im prisma-data-Shim und veraltete benchmark/-Pfade plus tote Felder in der Import-Bridge; (C3) toter Generatorcode, build_machine_evidence und machine_evidence.json nach ADR-022, compute_category_graph und graph_data.json (vis-network, von keinem JS gelesen), die ensure_*-Funktionen in utils, beide Waisen-JSONs git-entfernt; (C4) zwei echte Pipeline-Bugs (ungültige Haiku-Snapshot-ID, fehlgeleiteter Sonnet-Kostenschlüssel) und der behaviorale Stale-Path-Sweep über Defaults, Fehlermeldung und src/assess/README.
- **Ergebnis:** Vier Commits auf dem Branch, Harness durchgehend 69/69, Companion- und Python-Syntax geprüft. Die fünf operatorpflichtigen Funde (ganze archivierte Skripte oder Alternativpfade löschen) und der gotoNextOpen-Screenable-Guard bleiben als Entscheidung offen, ebenso O2.
- **Dead Ends:** Den rein dekorativen Docstring-Pfad-Sweep über rund zehn weitere Dateien bewusst zurückgestellt, reine Copy-paste-Beispiele ohne Funktionswirkung; jede Datei dafür einzeln zu lesen ist Fehlkalibrierung, benannt statt still abgeschnitten. utils.get_default_config strukturell nicht angetastet (Fallback-Config), nur die Stale-Strings korrigiert.

### 2026-06-30 (Session 26): Cut 3 bis O4 gebaut, der zweite Agentenlauf eingearbeitet

- **Ziel:** Die im Redesign entscheidungsfreien Schnitte umsetzen und den zweiten, am laufenden Tool geführten Browser-Agentenlauf einarbeiten, bis zu einem stabilen Commit und Push auf dem Branch.
- **Verlauf:** Der Agent hatte einen Build eine Position hinter HEAD geprüft, weshalb sein O1-Blocker den schon entfernten Stand beschreibt; das wurde gegen die Git-Historie und einen grep verifiziert und nicht erneut behoben. Gebaut wurden Cut 3 (aria-pressed auf Kategorie- und Ausschlussgrund-Chips, der Slug und die Definition aus dem zugänglichen Chip-Namen heraus in Tooltip und title, Textäquivalent zum farbcodierten Statuspunkt, Pin-Menü als Dialog mit Fokuswechsel, Escape und Tab-Falle, Fokus-Wiederherstellung auf den Paper-Titel nach Paperwechsel, sichtbare Fokus-Ringe auf Suchfeldern und Bedienelementen, Tastatur-Tooltips, abgedunkelte Muted-Tokens für Kontrast), O4 in Teilen (Einstieg auf dem ersten lesbaren Paper statt auf der Boilerplate, prominenter Hinweis bei textlosen Papern), und der Polish-Sweep (Umlaute toolweit zurückgebaut, der Doppelbindestrich-Platzhalter im Untertitel auf einen Mittelpunkt über alle Companion-Seiten, Reviewer-Schlüssel in der Fortschrittsleiste gelabelt). Der einzige neue Agentenbefund im Zwischenbericht, der aufgeblähte zugängliche Chip-Name, ist Teil von Cut 3. Der Abschlussbericht meldete zusätzlich einen Datenverlust beim Überarbeiten, editRecord löschte die erfasste Entscheidung und setzte den Arbeitszustand leer; das ist behoben, editRecord rehydriert jetzt Kategorien, Belege, Grund und Override und lässt den Record bis zum Neu-Commit unangetastet, sodass ein abgebrochenes Überarbeiten nichts verliert. Der veraltete `benchmark/`-Pfad in der generierten Disclosure ist auf `generated/benchmark-results/` korrigiert.
- **Ergebnis:** Die Schnitte 1 bis 4, 6 und die Warn-und-Einstieg-Hälfte von 7 sind auf dem Branch, der Harness blieb grün und ist um eine Sektion erweitert (Section I), ein Render-Smoke bestätigte Init, Panel und Fokusziele ohne Wurf. Offen bleibt allein O2, das Einschlusslogik-Modell, als Operatorentscheidung. Branch committet und gepusht, der Merge nach `main` bleibt die Menschenentscheidung.
- **Dead Ends:** Der vom Agenten gemeldete Header-Statusüberlauf wurde nicht gefixt, weder Header noch Statusleiste tragen eine Höhen- oder Overflow-Begrenzung, das war ein Capture-Artefakt seiner Screenshot-Engine. Der gemeldete tote KI-Extraktion-Schalter wurde nicht als Bug behandelt, der Toggle ist korrekt ausgeblendet, wenn kein KI-Layer existiert; ein positiver Abwesenheitshinweis wurde als Rauschen verworfen.

### 2026-06-30 (Session 25): Stand gesichtet, Stage R begonnen mit der R1-Konformanzkarte

- **Ziel:** Nach dem Umzug den Stand sichten, das offene Werk priorisieren, und vor einem Rechnerwechsel die Arbeit mit echtem Vorlauf sichern statt nur zu pushen.
- **Verlauf:** Die Sichtung ergab, dass Restructure und Doc-Konsolidierung (P6) im Wesentlichen stehen und der eigentliche offene Kern Stage R ist, der erste Durchlauf der Reviewdaten durch PRISM. Als sofort machbarer Stage-R-Schritt wurde R1, das Datenvollständigkeits-Audit, ausgearbeitet: eine Konformanzkarte, die jedes PRISMA-2020-Item und alle 17 trAIce-Items plus RAISE auf ihre Quelle im Repo oder auf eine benannte Lücke abbildet. Geerdet an den realen Items aus [[standards]] und den echten Pfaden nach dem Umzug, Status reconstructable, partial, gap oder N/A, ohne Zahlen, weil die der R2-Replay liefert. Quer verlinkt aus [[INDEX]], [[standards]], [[plan]] und CLAUDE.md.
- **Ergebnis:** [[conformance-map]] als R1-Deliverable, das Done-Kriterium erfüllt (jedes Item zeigt auf Daten oder eine benannte Lücke). Die zentrale retrospektiv unreparierbare Lücke, das fehlende vorab registrierte Runde-1-Protokoll (M1), ist benannt, nicht versteckt; die meta-analytischen PRISMA-Items (Risk of Bias, Effektmaße, Synthese, Certainty) sind als N/A für diesen Reviewtyp markiert. Branch committet und gepusht vor dem Rechnerwechsel; der Merge nach `main` bleibt die offene Menschenentscheidung (P0).
- **Dead Ends:** Den Auftrag "bis zu einem Commit" mit Datumspflege und Journaleintrag zu füllen, wurde zugunsten eines echten Stage-R-Deliverables verworfen; R1 ist reine Daten- und Synthesearbeit, jetzt machbar, ohne auf Stakeholder oder einen LLM-Lauf zu warten. Die machine-readable JSON-Emission wurde nicht vorgebaut, sie wird in R4 aus der Karte abgeleitet, sonst entstünde eine verwaiste Datei (YAGNI).

### 2026-06-30 (Session 24): the folder restructure executed, code into src/, generated artifacts into generated/

- **Ziel:** Carry out the planned restructure so the folders mirror the input-to-output logic, with all runnable code in one place.
- **Verlauf:** A first workflow ground out and adversarially verified the migration before a single file moved. The critic earned its keep, catching traps a naive move would have shipped broken: three acquire scripts that imported the shared utils only through their own auto-added directory and needed an explicit path bootstrap; the utils root-semantics flip, where the same `parent.parent` returned `pipeline/` at the old depth but the real repo root at the new one, so the compensating `.parent` in the callers had to be dropped; `generate_docs_data.py`, which is depth-invariant between the old and new homes and therefore a deliberate non-edit; a pre-existing `.env` path that climbed above the repo root; and three colliding READMEs. The move then ran in six commit-sized steps, data first so the corrected scripts could run against real inputs, then utils alone, then acquire and distill, assess, and publish, each gated by an import smoke and the test harness. The publish step regenerated the Companion data from the new layout. A second workflow rewrote the documentation paths across CLAUDE.md, the knowledge docs, and the readmes in parallel, one agent per file group.
- **Ergebnis:** Code lives under `src/` by stage (`acquire`, `distill`, `assess`, `publish`), generated artifacts under `generated/`, the assessment inputs unified, deep-research folded into `corpus/`. `docs/` stays fixed because GitHub Pages serves it. The harness stayed green through every step and the full regeneration runs from `src/`. The migration plan document, transient by design, was removed once executed.
- **Dead Ends:** The critic's own spec mis-stated one depth fix (the distill `.env` line, which actually needed no change at equal depth) and one documentation agent mis-mapped the served `docs/vault/Papers` to `generated/vault/Papers`; both were caught by verifying every edit against the real file and a final repo-wide path grep, not by trusting the plan.

### 2026-06-30 (Session 23): the distillate matcher deduplicated at the root, folder restructure planned

- **Ziel:** Make every corpus paper carry exactly one correct distillate, at the pipeline level rather than by hand, and work out how the folders could mirror the project's input-to-output logic.
- **Verlauf:** The distillate-to-Zotero matcher bound several distillates to one key without ever noticing the collision, so the companion data carried duplicate ids, wrong-content copies (a MirrorStories file holding the word2vec paper, a Mosene file holding Haraway), and genuine mis-binds where two different papers were merged onto one key. Two earlier classifications, a search agent's and a hand bash check, both proved unreliable and contradicted each other; the authoritative source turned out to be the production matcher itself, run and inverted to expose its real collisions and non-matches. The fix resolves collisions to one canonical distillate per key, chosen by how well the distillate's own title covers the key title, rejects a distillate that reached a key only through the loose fuzzy fallback, and has the generators skip every excluded stem instead of emitting it as a stray. The restructure question was answered with a worked migration proposal ([[restructure-plan]]), code into one `src/` tree, source against generated made legible, gated behind this repair and left unexecuted.
- **Ergebnis:** The regenerated companion data carries one entry per paper with no duplicate ids and the wrong-content copies gone, the concept graph preserved through a fallback, and the test harness green. The matcher fix is the durable root-cause repair; a full vault regeneration is deferred to an environment that still holds the local LLM concept cache.
- **Dead Ends:** Character-level similarity (`SequenceMatcher`) as the canonical-selection metric was wrong, it rewards incidental letter overlap and kept a K-12 education paper over the discrimination paper that actually matched the key; token overlap of the key's content words fixed it. The first instinct to hand-delete a list of files was abandoned, a blind delete would have destroyed real papers caught in mis-binds (a K-12 paper merged under a discrimination key); the repair belongs in the matcher, not in a deletion list.

### 2026-06-30 (Session 22): repo cleanup, journal condensed, the unverified audit layer removed

- **Ziel:** Declutter the repository and remove the AI-generated audit layer that was never human-verified.
- **Verlauf:** The dead v1 generation was deleted (two superseded generators, the non-Papers `docs/vault/` tree, `docs/DESIGN.md`). The journal was condensed to convention-conformant compact entries grouped by phase, the verbatim genesis giving way to its substance while git holds the literal trail. Above all the verification layer was removed entirely, the `knowledge/verification.md` audit document, the audit JSONs (conformance map, flow model) with their generator, and the self-test scripts. The reason is epistemic, the figures were AI-generated and never checked by a human, and a markdown audit that certifies itself as recomputed is a false authority, exactly the circularity the project criticizes. Every reference and restated number across the docs and the paper strand was repointed to the data and the Evidence Companion.
- **Ergebnis:** The numbers now live only in the data (`benchmark/results/`, `docs/data/`) and the Evidence Companion that renders them; no markdown carries them. Open, whether the published Companion should keep showing the unverified figures at all.
- **Dead Ends:** A first attempt to move the genesis into a separate `journal-archive.md` was rejected, one file with compact entries beats a second file plus cross-links and matches the convention. A one-line-per-session compaction that dropped the dead-ends was rejected too, because it destroys the process-memory, the dead-ends and the genesis, that defines a journal.

### 2026-06-29 (Session 21): Companion URL-state, a lean central store, citable views

- **Ziel:** Make a Companion view a shareable, citable link without rearchitecting the working views.
- **Verlauf:** A minimal `EC.store` (get/set/subscribe) now holds the navigational state, active view, corpus filters, selected paper, and one subscriber mirrors it into the location hash; only non-default keys reach the URL, view and paper changes are history steps while filter churn replaces in place. An adversarial three-lens audit caught several restore defects (wrong index space, unvalidated `cat=`/`sort=`/`paper=` keys, spurious history entries), each fixed under a regression test verified red first.
- **Ergebnis:** Citable URL-state stands; the full typed event-bus rearchitecture stays the residual, deliberately not built.
- **Dead Ends:** The full event-bus-plus-partitioned-state rebuild was weighed and rejected as over-engineering on working, tested code; the lean URL-state-plus-store middle path was chosen because the real driver is citable views, not pattern completeness (YAGNI).

### 2026-06-29 (Session 20): docs/ frontend refactor, shared EC helpers, security, const/let

- **Ziel:** Consolidate the Companion frontend, close security and stream-robustness gaps, and migrate off `var`.
- **Verlauf:** Duplicate helpers collapsed onto `window.EC`, per-render listeners became delegated handlers, `href` is validated against `^https?:` to block `javascript:` injection, and the chat stream gained an AbortController, timeout, stop control and coalesced re-render. Volatile numbers on the content pages were removed outright (operator's call) rather than data-bound, pointing to the Kategorien-Explorer; a conservative const/let codemod ran with an independent verification pass.
- **Ergebnis:** A jsdom smoke harness joined `npm test`; the cross-view coordination was still a shared-object-with-getters, the central-store move noted as the next separate piece (Session 21).
- **Dead Ends:** The smoke tests missed two chat-stream regressions, an error banner wiped by a re-render and an aborted partial answer losing its citations, both caught only by the adversarial multi-agent audit afterwards, which is why a regression test was left behind.

### 2026-06-29 (Session 19): ADR-019, PRISM the binding screening gate

- **Ziel:** Resolve whether PRISM or the colleagues' Excel is the binding screening record, and what conformance round one can claim.
- **Verlauf:** Two audits found the documentation encoded the opposite of intent, round one cast as a read-only seeded case study with no conformance claim and Excel as the capture path, while the requirements and data model (the `ScreeningRecord`) were built the other way. The operator ratified one direction through ADR-019: PRISM is the binding gate, Excel only an entry and migration seam, and "everything goes through PRISMA" holds retroactively, so the review counts complete only once all data has passed through PRISM. A gate-plus-named-gaps stance replaced no-conformance-for-round-one; the unrepairable items (the absent pre-registered protocol above all) stay named as permanent limits.
- **Ergebnis:** ADR-019 propagated across [[specification]], [[plan]], [[methods]], the paper draft and the READMEs; branch unpushed, per-story verdicts stay simulated until the stakeholder meeting. A follow-up dead-reference sweep repointed the paper's provenance citations.
- **Dead Ends:** ADR-019 explicitly supersedes ADR-001's seeded-case-study framing and the simulated Excel-capture path, and withdraws the "in-tool screening partially falsified" reading, which had rested on a single unexecuted usage assumption, not an observed test.

### 2026-06-29 (Session 18): refactor completeness, R4/P1/R1 deliverables, the no-self-description rule

- **Ziel:** Close the residue the first knowledge-base refactor missed and ship four scoped follow-ons.
- **Verlauf:** A second audit folded the remaining scheduling framing, `lane` usages, volatile prose numbers and stale pointers into the refactor; ADR-018, the export/import round-trip tests (P1), and a repointed R1 conformance record landed one commit each. The trAIce checklist was corrected to its real item count, the recurring wrong number was the non-optional count mislabelled as the total.
- **Ergebnis:** Twelve knowledge docs; the no-self-description rule established globally and in the convention.
- **Dead Ends:** The convention had previously prescribed the opposite, a "Negative Selbstdefinition" section, now reversed. `reuse-setup.md` was removed because it documented a never-executed, self-admittedly buggy reuse path; the intent stays in [[plan]] Stage C3 until reuse is actually run.

### 2026-06-21 (Session 17): R2 replay, the benchmark figures reproduced, the pairing discrepancy reconciled

- **Ziel:** Reproduce by running code what an earlier check could only hand-count, and close the one open pairing discrepancy.
- **Verlauf:** A re-pairing script reran the benchmark figures from the raw CSVs and reconciled the surplus pairing key as a stray metadata flag, not a missing human decision, so the real pairings stood. (That replay apparatus was later removed in Session 22 as unverified AI output; the raw assessment data remains.)
- **Ergebnis:** At the time the benchmark figures were reproducible by execution; the numbers were not changed.
- **Dead Ends:** The self-test deliberately did not import the diagnostic script it guarded, since a recompute reusing the logic it checks proves nothing; two independent implementations agreeing is the stronger statement.

### 2026-06-21 (Session 16): M3 built, the reading column enforces the human/AI layer separation

- **Ziel:** Close in code the contamination path the previous review session found, not just mark it.
- **Verlauf:** `splitDocLayers` separates the served document into a paper layer and a machine-extraction layer, cutting at the first `## Kernbefund`, verified clean on every served document; the reading column gained a Volltext / KI-Extraktion toggle with a non-verbatim band. A pin now carries an `origin` bound to the read layer, only a paper-layer pin sets the binding category, so AI-sourced text can never flip the derived human decision (ADR-016).
- **Ergebnis:** ADR-003 (human binding, AI advisory) is now realized at the evidence level; harness green, spec/data/plan synced.
- **Dead Ends:** Origin reflects the source layer of the text, not who clicked; a human pinning from the AI extraction still produces an `origin: ai` Beleg, which keeps machine output from being laundered into a clean human Beleg.

### 2026-06-21 (Session 15): review session, the reading column fuses two epistemic layers, M3 reframed

- **Ziel:** Verify what the reading column actually renders, and give an honest verdict on distance to the overall goal.
- **Verlauf:** Verification against every served knowledge doc showed each is one document silently concatenating a verbatim paper layer and an AI-extraction layer, no toggle, no boundary, so a Beleg lifted from the AI section still rendered as a clean human pin. M3 was reframed from "load Kategorie-Evidenz as AI Belege" to "split the reading column, mark the boundary, bind Beleg-Herkunft to the layer".
- **Ergebnis:** The load-bearing foundation is reached (three surfaces, harness green, provenance plumbing), the overall goal clearly not; the methodologically hardest part lies ahead, an enforced human/AI separation, the unbuilt synthesis surface, a scriptable replay, and no real screening pass yet.

### 2026-06-21 (Session 14): two milestones, per-Beleg provenance and the import bridge under test

- **Ziel:** Build per-Beleg provenance (KI2) and bring the Excel-to-PRISM import bridge under the test harness.
- **Verlauf:** Each Beleg now records its `origin` as first-class stored data with a neutral Mensch/KI marker (legacy Belege default to human); the import bridge's full data-hygiene validation, committed but never loaded by the harness, is now locked against crafted CSV fixtures.
- **Ergebnis:** The provenance plumbing the synthesis surface (KI1) needs is ready; harness green, spec/data/plan synced.
- **Dead Ends:** The marker is verified by deterministic render assertion, not screenshot, because the shared Chrome window makes pixel checks unreliable (a Session 13 learning carried forward).

### 2026-06-21 (Session 13): verified runnable, then synthesis over comparison, surfaces removed, consolidated to main

- **Ziel:** Take the built-but-unverified tool to verified-runnable, then act on the operator's direction changes.
- **Verlauf:** The never-run suite was brought green headless and all three surfaces clicked through; then three operator-driven reversals reshaped the tool, the Git surface left it (versioning happens in the GitHub Desktop working copy outside the tool), and the whole human-AI comparison apparatus was removed under a new leitmotif, synthesis not comparison. Design was unified onto the Companion and the feature branch fast-forwarded into main.
- **Ergebnis:** Tool verified and consolidated on main; the divergence finding stays the property of the paper and Companion, not the screening UI.
- **Dead Ends:** Comparison was the organising idea of the prior tool (blind/reveal, confusion matrix, kappa display, divergence filter, reconciliation table), all removed; the pure functions `computeMatrix`/`cohenKappa`/`kappaLabel` were kept only because the disclosure line and the tests still use them, their fate tied to whether the trAIce disclosure kappa/matrix line stays. A plain `git commit` in the shared report repo swept a foreign staged file into the commit, use a pathspec there.

### 2026-06-09 (Session 12b, Abend): Gesamtumsetzungs-Welle und Solo-Abschluss

- **Ziel:** In einer Parallel-Welle die offenen Teilprodukte (Import-Brücke, Testfundament, Retro-Record, Analysen, Paper-Outline) gleichzeitig vorantreiben.
- **Verlauf:** Viele Agenten (Schreiber plus adversariale Verifizierer) arbeiteten konfliktfrei im selben Working Tree, weil jede Datei genau einen Besitzer hatte und README/plan einem finalen Konsolidierer gehörten. Solo danach entstanden das Simulations-Ledger, die RIS-Konversion und der ergebnisgeführte Paper-Draft; der Paper-Integritäts-Abgleich der eingereichten Forum-Fassung brachte einen neuen Befund (LLM-Pfad-Input-Basis), den der Autor bewusst nicht an die Redaktion korrigiert, sondern im Folgepaper präzisiert.
- **Ergebnis:** Teilprodukte stehen; simulierte Stakeholder-Entscheidungen als ratifizierbar markiert.
- **Dead Ends:** Der TP4-Analysedesign-Schreibvorgang wurde vom Subagenten-Schreib-Guard blockiert, weil der Dateiname "analysis" enthält; der Orchestrator schrieb den wörtlichen Agenten-Inhalt selbst. Schreib-Guards treffen Dateinamen, nicht Inhalte.

### 2026-06-09 (Session 12): PRISM v4, evidence-grounded screening tool

- **Ziel:** Rebuild the screening tool around how the reviewing colleagues actually worked, reading the text and grounding each category in concrete words found in it (ADR-012).
- **Verlauf:** Seven surfaces collapsed to three, the human-AI divergence apparatus moved out of the working view into a report layer, and the Screening view became three panes (corpus search, formatted document with in-text highlight, categories with pinned Belege deriving Include/Exclude); the reviewer schema bumped to 0.2 with an evidence map, backward compatible. A finding important for the joint evaluation, the served documents are the distilled knowledge docs, not raw full text.
- **Ergebnis:** The whole read/search/pin mechanic is built over the already-published knowledge documents; harness passes, spec docs noted for sync.
- **Dead Ends:** Serving the raw Docling full texts was declined, they are copyrighted and paywalled and publishing them to the public Pages site is outward-facing and hard to reverse; the text source is a single pluggable seam (`fetchPaperText`) so swapping in read-local-only full text stays a one-function change, gated on a copyright decision.

---

## Promptotyping, Evidence Companion, benchmark (February to April 2026)

### 2026-04-01 (Session 11): 2x2 information-basis experiment, paper integrity check

- **Ziel:** Test whether feeding knowledge documents instead of abstracts improves LLM assessment, and check the paper against the repo.
- **Verlauf:** A 2x2 design (information basis x model) on the benchmark papers showed more context improves category-specific recognition but amplifies the inclusion bias across all conditions, while Haiku is overwhelmed by the richer context; the figures live in the data and the Evidence Companion. The paper check found one factual error (LLM input is Title plus Abstract, not the knowledge documents), one deviation, and a set of unverifiable Phase-1 claims with no audit trail.
- **Ergebnis:** The divergence is not an information deficit, the structural inclusion bias persists even with full-text extractions; this strengthens the central argument that reliability needs process design, not better models or more data.

### 2026-04-01 (Session 10): repository audit, English translation, Haiku vs Sonnet

- **Ziel:** Reconcile every paper claim against the actual repository state and translate the documentation to English.
- **Verlauf:** The audit found and fixed stale uncommitted merge-bug data, a wrong provider name, unbacked causal claims and inconsistent terminology; the paper falsely claimed Stage 1 splits the document into semantic sections, the code processes the full text whole, corrected for the author. Running the assessment with the stronger model showed it does not close the gap but shifts it, separating "Feministisch" from "Gender" by following the definition literally.
- **Ergebnis:** Divergence is structural, not performance-based, a more capable model shifts the pattern rather than closing it; the Gender definition ("explicit gender focus") is an operationalization gap, not a model-quality issue, made visible by the infrastructure.

### 2026-03-27 (Session 9): Human Assessment abgeschlossen, Merge-Bug behoben

- **Ziel:** Das Human Assessment abschließen und den Benchmark auf eine korrekte Paarung stellen.
- **Verlauf:** Das Google-Spreadsheet wurde mit Korrekturen importiert (Unclear aufgelöst, fehlende Decisions ergänzt); dabei fiel ein kritischer Merge-Bug auf, `merge_assessments.py` paarte Human und LLM per sequentieller ID statt Zotero_Key, sodass alle bisherigen Benchmark-Ergebnisse auf falschen Paarungen beruhten. Nach dem Fix auf Zotero_Key wurde der Benchmark komplett neu berechnet und die Divergenz-Klassifikation mit dem stärkeren Modell differenzierter neu erstellt; die Zahlen leben in den Daten und im Evidence Companion.
- **Ergebnis:** Korrekt gepaarter Benchmark steht, JSON-Daten und Wissensdokumente regeneriert.
- **Dead Ends:** Die alten Zahlen sahen inhaltlich plausibel aus, weil die Marginalverteilungen korrekt blieben und nur die Zellwerte Zufall waren; negative Kategorie-Kappas waren das Warnsignal für das fehlerhafte Matching. Ein Merge per instabilem Identifier produziert plausibel aussehende, völlig falsche Ergebnisse.

### 2026-03-24 (Session 8): Kategorien-Explorer, Wissensnetz-Redesign, Methoden-Seite

- **Ziel:** Den statischen Bewertungsvergleich durch ein exploratives Werkzeug ersetzen und das Wissensnetz neu layouten.
- **Verlauf:** Der Dashboard-View (Callout, Slope Chart, Kappa) wich einem interaktiven Kategorien-Explorer, der pro Kategorie Rate-Vergleich, konkrete Divergenz-Papers und häufige Konzepte zeigt; das Wissensnetz bekam ein cluster-separierendes Layout mit Divergenz-Modus. Die Navigation wurde über alle Seiten vereinheitlicht.
- **Ergebnis:** Exploration statt Bericht, eine Dimension wählen und konkrete Evidenz sehen statt scrollen.
- **Dead Ends:** Das cluster-separierende Force-Layout funktioniert nur, wenn die Cluster-Force dominant und die Link-Force schwach ist, sonst zieht die Link-Force alles in einen Blob zurück. Ein fünfter View wurde verworfen, die ungenutzten Datenfelder gehören in bestehende Views integriert.

### 2026-03-24 (Session 6): Wissens-Chat, Panel-Optimierung, Quellenleiste

- **Ziel:** Einen verifizierbaren Q&A-Chat über den Forschungskorpus als vierten Tab bauen.
- **Verlauf:** Ein Gemini-Flash-Chat mit RAG-lite (Keyword-Suche über Korpus und Konzepte, SSE-Streaming, API-Key lokal im Browser) bekam eine klickbare Quellenleiste, die zitierte Papers erkennt und zum Korpus-Tab samt Detail-Panel navigiert, der epistemische Kreislauf von Antwort über Quelle zur LLM-Begründung und zurück. Das Side Panel wurde verkleinert und die Tabelle bei offenem Panel gezielt um Spalten reduziert statt pauschal komprimiert.
- **Ergebnis:** Ein verifizierbares epistemisches Werkzeug statt einer Black Box; RAG-lite reicht für diesen Korpus, kein Embedding-Retrieval nötig.

### 2026-03-24 (Session 6b-7): UI Polish, Navigation, Tooltips, Merge

- **Ziel:** Den Chat mit Inline-Zitationen veredeln, die Navigation abflachen und nach main mergen.
- **Verlauf:** Gemini-Antworten werden post-processed, Autor-(Jahr)-Muster werden klickbare Links zum Korpus, die Referenzliste zeigt nur tatsächlich zitierte Papers; das Dropdown wich direkten View-Buttons, About und Hilfe wurden echte Unterseiten, und die Stats-Bar bekam datengetriebene Tooltips (Barcharts, Pipeline-Verlust). Merge nach main und GitHub-Pages-Deployment.
- **Ergebnis:** Verifizierbarer Chat statt Black-Box-Chat; Navigation flach gehalten, für vier Views sind direkte Buttons besser als ein Dropdown.

### 2026-03-19 (Session 5): Evidence Companion, Richtungswechsel

- **Ziel:** Frontend, Paper-Versprechen und Repository abgleichen und das Frontend auf das einlösen, was das Paper verspricht.
- **Verlauf:** Der Abgleich ergab, dass das Paper eine Wissensumgebung zum Explorieren, Vergleichen und Nachvollziehen referenziert, also einen Evidence Browser, keinen Pipeline-Explorer; `docs/index.html` wurde komplett neu als akademische Begleitpublikation gebaut (IBM Plex Serif, sortierbare Tabelle, Seitenpanel, genderneutrales Spektrum-Farbsystem). Die pseudoquantitative LLM-Confidence wurde aus Interface, Daten und Generator entfernt.
- **Ergebnis:** Ein einziges Frontend als "Evidence Companion"; das Interface löst genau das Paper-Versprechen ein, nicht mehr.
- **Dead Ends:** Das Promptotyping-Interface wird nicht weiterentwickelt, es ging über das Paper-Versprechen hinaus (Pipeline-Sankey, Konzept-Force-Graph sind interessant, aber nicht das, was Reviewer:innen brauchen). Die Blau/Warm-Farbcodierung (Technik/Sozial) wurde verworfen, sie reproduziert Gender-Stereotype, inakzeptabel für ein feministisches Projekt; Farbsysteme sind politisch.

### 2026-02-22 (Session 4): Promptotyping v2.1, Epistemische Tiefe

- **Ziel:** Aus dem Daten-Explorer ein epistemisches Werkzeug machen, das navigierbar zeigt, was mit Wissen in der Pipeline passiert.
- **Verlauf:** Eine kritische Evaluation von v2 fand fünf Probleme, allen voran dekorativ statt strukturell verwendete epistemische Haltungen; v2.1 macht `.stance-section`-Divs mit farbigen Rändern zum Kern-Pattern in jeder Detailansicht, ergänzt drei handverlesene Featured Papers als narrative Anker und färbt den Konzept-Graphen nach Cluster.
- **Ergebnis:** Die Haltung bestimmt jetzt die Informationsarchitektur, nicht die Farbgebung.
- **Dead Ends:** Die dekorativen drei farbigen Punkte als Banner aus v2 wurden verworfen, was ohne Funktionsverlust weglassbar ist, ist Dekoration. Die Cluster-Verteilung (fast nur Bridge und Sozial) überraschte, ist aber ein Ergebnis, kein Problem, der Korpus ist tatsächlich interdisziplinär.

### 2026-02-22 (Session 3): Promptotyping v2, vom Dashboard zum Forschungsartefakt

- **Ziel:** Ein Interface bauen, das den Forschungsprozess zum Forschungsgegenstand macht, nicht ihn nur beschreibt.
- **Verlauf:** Vault v2 entstand mit LLM-basierter Konzept-Extraktion, Divergenz-Klassifikation und einer Fünf-Strategie-Titel-Kaskade; darauf vier Views (Pipeline-Sankey, Paper Journey, Konzept-Explorer, Divergenz-Navigator) als Vanilla-JS-IIFE ohne Build-Tool. Die Divergenz-Muster-Verteilung überraschte, der LLM expandiert Bedeutung weit stärker als theoretisch vermutet, das Kernphänomen der epistemischen Asymmetrie.
- **Ergebnis:** Forschungsartefakt statt Dashboard; die drei Paper-Muster sind empirisch bestätigt, ihre Gewichtung weicht aber von der Theorie ab.
- **Dead Ends:** Promptotyping v1 wurde gebaut und sofort verworfen, ein Fünf-Schritte-Dashboard zeigt Zahlen, kein Wissen; es blieb nur Ausgangspunkt für v2. Das naive Titel-Matching aus v1 verlor zu viele Papers, ein einzelnes Signal scheitert an der Vielfalt realer Daten, nötig ist eine Kaskade unabhängiger Signale.

### 2026-02-22 (Session 2): Kappa-Revision und Workflow-Analyse

- **Ziel:** Klären, ob Cohen's Kappa der primäre Indikator für den Human-LLM-Vergleich sein kann.
- **Verlauf:** Eine umfassende Workflow-Analyse identifizierte das niedrige Kappa als Prevalence-Bias-Artefakt (Byrt et al. 1993), bei großer Basisraten-Differenz kollabiert Kappa unabhängig von der Bewertungsqualität.
- **Ergebnis:** Primäre Metriken sind Konfusionsmatrix plus Basisraten, Kappa bleibt nur als Vergleichsanker; die Werte leben in den Daten.
- **Dead Ends:** Kappa als primärer Human-LLM-Indikator wurde verworfen, die Referenzliteratur verwendet es für Human-Human-Vergleiche mit ähnlichen Basisraten, für asymmetrische Vergleiche ist es irreführend.

### 2026-02-21 (Session 1): Knowledge-Konsolidierung Phase 2

- **Ziel:** Redundanz aus `knowledge/` entfernen und jede Information an genau einen kanonischen Ort binden.
- **Verlauf:** Redundante Dateien wurden gelöscht und verwandte Dokumente zusammengeführt (epistemic-framework in project, methodology und technical in methods-and-pipeline); Redundanzregeln mit expliziter Zuweisung etabliert.
- **Ergebnis:** Kanonische Orte definiert; in MEMORY.md festgehalten, damit die Regel Session-Wechsel überlebt.
- **Dead Ends:** Redundanz in Dokumentation ist Gift, dieselbe Information an drei Stellen divergiert innerhalb weniger Sessions; Redundanzregeln brauchen explizite Zuweisung, nicht guten Willen.

### 2026-02-18 (Sessions): Paper v0.4, SPA-Rebuild, Visualisierungen

- **Ziel:** Den Research Vault als SPA neu bauen und die Visualisierungen epistemisch reframen.
- **Verlauf:** Die SPA wurde mit Vier-Tab-Layout neu gebaut und epistemische Visualisierungen (Divergenz-Scatter, Slope Chart, Overlap-Treemap, Coverage Map) ergänzt; Paper v0.4 ausformuliert und `knowledge/` konsolidiert.
- **Ergebnis:** Visualisierungen mit epistemischer Funktion, ein Slope Chart zeigt die Divergenz selbst, die Steigung ist die Aussage.
- **Dead Ends:** Observable Plot wurde durch Chart.js ersetzt, es braucht ESM-Imports, die auf `file://` und einfachen Hosts brechen; Chart.js via CDN läuft überall. Ein Confusion-Matrix-Bug (fehlende Guard-Clause für Papers ohne Human-Assessment) zeigte sich erst beim größeren Korpus, nicht bei der kleineren Testmenge.

---

## Wiederkehrende Muster

Bewährte Praxis aus den Sessions, verdichtet.

### Was zuverlässig hilft

- **Mehrstrategie-Matching:** Nie auf ein einzelnes Signal (Titel, DOI, Autor) verlassen, immer eine Kaskade mit Fallbacks.
- **LLM-Caching:** API-Ergebnisse sofort als JSON cachen, erlaubt Regeneration ohne erneute Calls.
- **Redundanzregeln:** Jede Information hat genau einen kanonischen Ort, andere Stellen referenzieren statt duplizieren.
- **Vanilla JS plus CDN:** Für statische Seiten kein Build-Tool, D3 und Chart.js per CDN im IIFE-Pattern; die Komplexität liegt in den Daten.
- **Verifikation per jsdom-Harness, nicht Screenshot:** Im geteilten Browser sind Pixel-Klicks unzuverlässig, Element-Referenzen und Test-Hooks sind auflösungsunabhängig.
- **Zahlen gehören in die Daten, nicht ins Markdown:** Eine Zahl im .md driftet, sobald sich etwas ändert, und eine KI-generierte Zahl, die kein Mensch geprüft hat, als Audit auszugeben ist eine falsche Autorität.
- **Simulierte Entscheidungen brauchen ein Ledger:** als simuliert markiert, mit Begründung und definiertem Ratifikationspunkt; sie lizenzieren Arbeit, nie Außenaussagen.

### Was immer wieder schiefgeht

- **Windows-Pfade:** MAX_PATH, die `nul`-Datei (reservierter Gerätename), CP1252 statt UTF-8.
- **Datenqualität externer Quellen:** Zotero-Titel mit HTML, nicht normalisierte Autorennamen, fehlende Jahreszahlen.
- **Kappa-Interpretation:** Für asymmetrische Human-LLM-Vergleiche mit verschiedenen Basisraten ist Cohen's Kappa irreführend, es ist für symmetrische Vergleiche entwickelt.
- **Merge per instabilem Identifier:** Eine Paarung per sequentieller ID statt stabilem Schlüssel produziert plausibel aussehende, völlig falsche Ergebnisse, gegen die Rohdaten prüfen, bevor man "korrigiert".
- **Schreib-Guards und blockierende Dialoge:** Subagenten-Guards treffen Dateinamen, nicht Inhalte; `confirm()`/`alert()`-Pfade nicht in Browser-Automatisierung klicken.

## 2026-07-17 Analysefeld-Freeze und Runde-2-Screening (advisory)

Analysefelder eingefroren (categories.yaml v1.3, analysis_fields-Block mit neuem AN_Prompting_Role nach Operator-Klarstellung des Studienziels; Eligibility unverändert v1.2). Alle fünf §10-Präregistrierungspunkte per Amendment beantwortet. Beratender LLM-Screening-Durchgang über die 24 distinkten Runde-2-Kandidaten (vier Screening-Agenten, deterministischer Konsistenz-Check, ein adversarialer Prüfagent), Ergebnis 14 Include, 9 Unclear, 1 Exclude in assessment/round2-screening-advisory.md. Keine Konfabulation, eine Include-zu-Unclear-Korrektur. Verbindliche Entscheidung bleibt der menschliche PRISM-Track. Offen, Zotero-Import der L5-RIS und Mapping-Nachzug, Stufe-3-Sichtung der 192 Warteliste-Distillate.

## 2026-07-18 research-vault Ausbau, Stufe 1b und Claims-Ebene

Deterministische Stufe 1b über den gesamten Distillat-Bestand (src/assess/waitlist_resolution.py, Report lokal in generated/distilled/_evidence_audit/): artefakt-toleranter, kontiguierlich-wörtlicher Re-Match aller Stufe-1-Befunde gegen die committeten Volltexte, mit Extraktions-Fix für Apostroph-Paarung und zwei Zitierpraxis-Ausnahmen (editorische Klammern, markierte Ellipsen mit Segment-Ordnung und Abstandsschranke). Ergebnis: die D-Klasse vollständig aufgelöst, ein großer Teil der F-Kandidaten als Matcher- oder docling-Artefakte belegt, vier advisory Stufe-2-F-hart-Urteile deterministisch widerlegt (Zitate stehen wörtlich im Volltext). Vault-Umbau mit src/publish/build_research_vault.py: 45 Distillate mit dokumentierter Belegkette migriert, 8 de-migriert (7 ohne auflösbaren Volltext aus der ersten Welle, 1 Quellendublette), 2 Migrationskandidaten als maschinell belegte Quellendubletten zurückgehalten; jedes Vault-Distillat trägt jetzt audit, audit-stage1b und reference. Shingle-Jaccard-Scan über die Volltexte fand die Quellendubletten-Gruppen und zwei Acquisition-Fehler (Volltext-Datei enthält fremdes Paper, Kutscher_2023 und Ghosal_2024). Claims-Ebene aufgebaut, fünf Topic Maps und zwölf Claims auf Kernbefund-Anker, grounded per deterministischer Ankerprüfung (src/publish/check_claims.py), ein contested Claim (CoT-Debiasing, Kaneko gegen Kamruzzaman). Warteliste neu geschrieben nach Befundklassen mit Auflösungsgründen. Offen: Stufe-3-Sichtung der offenen F-, G- und U-Fälle, Zotero-Dubletten-Merge Operator-seitig, 00_representation/-Ankerschicht für den grounded-Status der Distillate, 30_deliverable leer bis Claims-Basis breiter.

## 2026-07-18 Workflow-Dokumentation und Codierungskonzept-Entwurf (M6)

Zwei Wissensbausteine in knowledge/ ergänzt und im INDEX registriert. workflow.md beschreibt den gelaufenen Gesamt-Workflow als Kette in neun Stufen, Identifikation Runde 1 bis research-vault, je Stufe Werkzeug, Artefaktorte (committed gegen lokal), datierte Entscheidungen und die bindenden menschlichen Stufen (Zotero-Pflege, Expert-Track/PRISM-Screening, Stufe-3-Verifikation, Operator-Gates); verbindende Übersicht mit Verweisen, ersetzt kein Einzeldokument, Zählstände nur als Verweis oder Stichtagsangabe. coding-concept.md ist der als Entwurf markierte Codierungskonzept-Entwurf über den eingefrorenen Analysefeldern (categories.yaml v1.3 samt AN_Prompting_Role und B.1-Revisionen), Codiereinheit Paper je Feld mit Textstelle als Begründungseinheit, Volltext als Codiergrundlage gegen research-vault-Distillate als Arbeitsgrundlage, Unclear-Behandlung auf Screening- und Feldebene, Doppelcodierung per Überlappungsstichprobe mit Konsensverfahren analog B3, Dokumentation in Excel plus P3-Brücke; acht offene Entscheidungen als markierte Fragen E1 bis E8 mit Entscheidungsinstanz, nichts gesetzt. Offen: Ratifikation der E-Fragen durch Operatorin und Codiererinnen.

## 2026-07-18 Codierungs-Entscheide, PRISM-Analyse-Panel beauftragt

Operator-Entscheide zum Codierungskonzept unter dem Leitprinzip niedriger Aufwand für die Codiererinnen. Erfassung der Analysecodierung im PRISM-Tool statt der Excel-Route (E4, festgehalten als ADR-026 und FR-14 in specification.md), Nicht-Entscheidbarkeit als Erfassung je Feld im Tool statt Vokabular-Amendment (E3, categories.yaml v1.3 bleibt eingefroren), Distillat-Basis nur in der research-vault-geprüften Fassung (E2), Fundstellen-Konvention durch Pin-Fundstellen aufgelöst (E8); advisory LLM-Codier-Track zurückgestellt (E6). coding-concept.md auf v0.2, Fragenkatalog auf E1/E5/E7 für die Abstimmung mit der Projektkollegin eingedampft. Bau des Analyse-Panels als Leitstellen-Lane beauftragt (ein Implementierungs-Agent, Leitstellen-Verifikation mit Diff, Test-Nachlauf und Browser-Smoke-Test; Screening-Pfad byte-identisch); das Panel muss vor Codierstart stehen. Dead End der Konzeptrunde: der Werkzeug-Split Excel plus Import-Brücke plus PRISM hätte drei Orte für einen Arbeitsschritt erzeugt, obwohl das Tool Lesen, Suchen, Pinnen und Persistenz bereits trägt.
