---
title: Workflow
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: de
version: "0.1"
created: 2026-07-18
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
related: [INDEX, methods, plan, update-protocol, research-vault-plan, distillate-check-plan, analysis-fields-pilot, journal]
---

# Gesamt-Workflow von der Identifikation zur research-vault

Dieses Dokument beschreibt den gelaufenen Workflow des Reviews als eine Kette, von der Literatur-Identifikation über Akquise, Distillation, Dual Assessment und Screening bis zum Aufbau der `research-vault/`. Zielleserin ist eine Projektkollegin, die den Workflow verstehen, an den Artefakten prüfen und im Folgepaper als Methode beschreiben können muss. Es ist die verbindende Übersicht mit Verweisen; die Tiefe je Stufe liegt in den Einzeldokumenten, methodische Begründung in [[methods]], Steuerung in [[plan]], Präregistrierung der zweiten Runde in [[update-protocol]], Genese in [[journal]]. Konkrete Zählstände stehen nicht hier, sie leben in den Daten (`generated/benchmark-results/`, `docs/data/`), im Evidence Companion (https://chpollin.github.io/FemPrompt_SozArb/) und in datierten Momentaufnahmen wie `research-vault/waitlist.md`; fixe Laufdaten abgeschlossener Läufe sind davon ausgenommen.

Zwei Wissensorte rahmen die Kette. `knowledge/` trägt das Steuerungswissen über die Arbeit, `research-vault/` das Gegenstandswissen darüber, was die Literatur zur Forschungsfrage sagt, mit Belegkette und Prüfstatus ([[research-vault-plan]]). Der Grundsatz des ganzen Workflows ist die Verantwortungsasymmetrie, jede maschinelle Stufe ist advisory, bindend entscheidet an definierten Punkten allein der Mensch.

## Die Kette im Überblick

| Stufe | Zeitraum | Werkzeug | Bindende menschliche Stufe |
|---|---|---|---|
| 1 Identifikation Runde 1 | Oktober 2025 | vier Deep-Research-Systeme, manuelle Suche, Zotero | Zotero-Pflege |
| 2 Akquise und Textkonversion | ab November 2025 | `src/acquire/`, Docling | Markdown-Review |
| 3 Distillation (SKE) | ab November 2025 | `src/distill/distill_knowledge.py` | keine, Output advisory |
| 4 Dual Assessment und Benchmark | bis März 2026 | Excel/Google Sheets, `src/assess/` | Expert-Track (bindend) |
| 5 PRISM und Evidence Companion | Februar bis Juli 2026 | `docs/` (Vanilla JS, GitHub Pages) | PRISM-Screening |
| 6 Präregistrierung und Analysefeld-Freeze | Juni bis Juli 2026 | [[update-protocol]], `assessment/categories.yaml` | Operator-Freeze und Amendments |
| 7 Identifikation Runde 2 | ab 2026-07-17 | Lanes L1 bis L3 und L5, Zotero | Zotero-Pflege, PRISM-Screening (offen) |
| 8 Distillat-Audit | 2026-07-17 bis 2026-07-18 | `src/assess/evidence_audit.py`, `waitlist_resolution.py` | Stufe-3-Verifikation (offen) |
| 9 research-vault | ab 2026-07-17 | `src/publish/build_research_vault.py`, `check_claims.py` | Stufe-3-Verifikation, `verified`-Status (offen) |

## Stufe 1, Identifikation Runde 1

Anstelle klassischer Datenbanksuchen liefen vier Deep-Research-Systeme (ChatGPT, Claude, Gemini, Perplexity) mit identischem Prompt, ergänzt um eine begrenzte manuelle Suche; die Abweichung von PRISMA-üblichen Datenbanksuchen ist in [[methods]] begründet und offengelegt. Die Ausführung lag beim Operator, die Ergebnisse wurden per LLM nach RIS konvertiert und in modellspezifische Zotero-Sammlungen importiert.

- Artefakte (committed): `corpus/deep-research/*.ris`, `prompts/deep-research-template.md`, `prompts/CHANGELOG.md`, `corpus/zotero_export.json`, `corpus/papers_metadata.csv`, `corpus/source_tool_mapping.json`.
- Benannte Lücken: der exakt instanziierte Runde-1-Prompt wurde zur Laufzeit nicht committet und ist verloren, nur das parametrische Template ist aus der Git-Historie restauriert; die RIS-Konversion ist dokumentiert, aber nicht reproduzierbar; ein präregistriertes Protokoll fehlte (PRISMA-trAIce M1). Alle drei Lücken sind in [[conformance-map]] benannt, nicht versteckt.
- Bindende menschliche Stufe: die Zotero-Pflege, also Import, Dublettenprüfung, Metadatenkorrektur und PDF-Anhänge in der Gruppenbibliothek.

## Stufe 2, Akquise und Textkonversion

PDF-Akquise über vier Fallback-Strategien (Zotero, DOI, Unpaywall, ArXiv), Konversion nach Markdown mit Docling, vierschichtige Validierung, konservatives Post-Processing. Details und die dokumentierten Konversionsfehler in [[methods]].

- Skripte: `src/acquire/download_zotero_pdfs.py`, `acquire_pdfs.py`, `convert_to_markdown.py`, `validate_markdown_enhanced.py`, `postprocess_markdown.py`.
- Artefakte: `generated/markdown_clean/` ist committed und ist die kanonische Volltextbasis aller späteren Prüfungen; PDFs (`generated/pdfs/`) und Validierungsreports bleiben lokal (gitignored).
- Bindende menschliche Stufe: das Markdown-Review im Dual-Pane-Tool `src/distill/markdown_reviewer.html` (PASS, WARN, FAIL).
- Bekannter Fehlermodus, in Stufe 8 maschinell nachgewiesen: einzelne Volltext-Dateien enthalten ein fremdes Paper (Acquisition-Fehler), registriert in `research-vault/waitlist.md`.

## Stufe 3, Distillation (Structured Knowledge Extraction)

Dreistufige Extraktion der Volltexte in Wissensdokumente. Stufe eins extrahiert und klassifiziert per LLM (Markdown zu JSON), Stufe zwei formatiert deterministisch ohne LLM, Stufe drei verifiziert per LLM gegen das Original und schreibt einen Confidence Score. Motivation ist Context Rot, die Begriffe sind im Glossar von [[INDEX]] definiert.

- Skript: `src/distill/distill_knowledge.py`; Artefakte committed unter `generated/distilled/` samt `_stage1_json/` und `_verification/`.
- Die Kategorie-Booleans im Stage-1-JSON sind die autoritative Kategoriezuordnung der Distillate, nicht der Markdown.
- Die Distillate sind maschineller Rohstoff und bleiben advisory; ihre Evidenzqualität wurde erst in Stufe 8 systematisch geprüft.

## Stufe 4, Dual Assessment und Benchmark

Das methodische Kernstück, zwei unabhängige, parallele Tracks über denselben zehn Kategorien (`assessment/categories.yaml`, zwei Dimensionen Technik und Sozial). Der Expert-Track (Reviewerinnen aus Sozialer Arbeit, Gender- und Technikforschung, erfasst im etablierten Tabellen-Workflow) ist epistemisch bindend; der LLM-Track (5D-System explorativ, 10K-System als Benchmark-Basis) ist advisory und lief ohne Kenntnis der menschlichen Urteile. Der Vergleich wird als Divergenz berichtet, nie als Fehlerrate, weil Runde 1 keine Inter-Human-Baseline hat.

- Artefakte: `assessment/human_assessment.csv` (bindender Track), `assessment/llm_assessment_*.csv`, `assessment/merged_*.csv`, archivierter 5D-Track unter `assessment/llm-5d/`; Ergebnisse in `generated/benchmark-results/` und `docs/data/`, gerendert im Evidence Companion.
- Skripte: `src/assess/generate_papers_csv.py`, `run_llm_assessment.py`, `merge_assessments.py` (Paarung strikt über Zotero_Key, nach dem am 2026-03-27 behobenen Merge-Bug), `calculate_agreement.py`, `analyze_disagreements.py`.
- Entscheidung mit Datum: primäre Metriken sind Konfusionsmatrix und Basisraten, Kappa nur als Vergleichsanker (2026-02-22, [[journal]]).

## Stufe 5, PRISM als bindende Screening-Oberfläche

PRISM (`docs/prisma.html`, nicht zu verwechseln mit dem Standard PRISMA) ist das evidenzgestützte Screening-Werkzeug, in dem gelesen, gesucht, je Kategorie ein Beleg gepinnt und die Entscheidung abgeleitet wird. Der Weg dorthin, mit Datum:

- ADR-019 (2026-06-29), PRISM ist die bindende Screening-Oberfläche, die Excel bleibt Eintritts-Seam über die Import-Brücke (P3).
- ADR-020/021 (2026-06-30), ein Arbeits-Workspace, Reviewer-Identität über den Git-Commit-Autor, deterministisch serialisierte Entscheidungsdateien.
- ADR-022/023 (2026-06-30), die fehlerhafte maschinelle Kategorie-Evidenz entfernt, begründungspflichtiger Override zu Include (RAISE P3).
- ADR-024 (2026-07-01), dreistufige Kategorien (nein/teilweise/ja) mit abgeleiteter Dreiwege-Entscheidung Include/Unclear/Exclude.
- Volltext lokal (2026-07-01), `src/publish/build_fulltext.py` baut die Leseschicht `docs/data/fulltext/` aus `generated/markdown_clean/`; sie ist gitignored, weil urheberrechtlich geschützt, öffentlich fällt das Tool auf Wissensdokument und Abstract zurück.

Die menschliche Entscheidung in PRISM ist der bindende Record, jede KI-Beteiligung ist als solche ausgewiesen (Beleg-Provenienz `origin`, KI-Vorschlag eingeklappt). Der Retro-Durchlauf der Runde-1-Daten durch PRISM (Stage R) und der Runde-2-Durchgang (Stage B) sind in [[plan]] gesteuert; die Konformanzlage je PRISMA- und trAIce-Item in [[conformance-map]].

## Stufe 6, Präregistrierung Runde 2 und Analysefeld-Freeze

Weil Runde 1 kein vorab festgelegtes Protokoll hatte, wurde die zweite Runde prospektiv präregistriert. [[update-protocol]] bindet Suchfenster, Lanes, Prompt, Dedup-Verfahren, Screening-Prozedur, Metriken und Rollen (neutrale Ids R1, R2, OP, LLM, AG), committed vor dem ersten Lauf; Änderungen danach nur als datierte Amendments.

Parallel wurde die Analysefrage operationalisiert (TP4 in [[plan]]). Die Kette mit Datum:

1. Analysefeld-Design mit Sub-Fragen SQ1 bis SQ3 und geschlossenen Vokabularen in [[update-protocol]], Abschnitte A bis F.
2. Advisory LLM-Pilot an einer stratifizierten Stichprobe bereits eingeschlossener Paper, Füllraten und Ambiguitäten in [[analysis-fields-pilot]] (2026-07-17).
3. Operator-Klarstellung des Studienziels und Freeze (2026-07-17), die Analysefelder stehen als `analysis_fields`-Block in `assessment/categories.yaml` v1.3, inklusive des neuen Feldes `AN_Prompting_Role`; der Eligibility-Inhalt blieb unverändert v1.2. Die Pilot-Revisionen sind in Abschnitt B.1 des Protokolls eingefroren.
4. Die fünf §10-Offenpunkte der Präregistrierung wurden am 2026-07-17 per datiertem Amendment beantwortet, dokumentiert in `corpus/deep-research/round2/LAUFPROTOKOLL.md` (Prompt-Provenienz, Fenster Juli 2025 bis Juni 2026, Freeze vor Screening-Start statt vor erster Suche, Full-Batch-Screening, L5 ja).

## Stufe 7, Identifikation Runde 2

Ausführung ab 2026-07-17, protokolliert je Lane in `corpus/deep-research/round2/LAUFPROTOKOLL.md`, Rohausgaben unverändert unter `round2/raw/`, RIS-Dateien daneben committed, die Gemini-Prosa-Konversion mit verbatim committetem Konversions-Prompt und Spot-Check.

- L1 ChatGPT, L2 Claude, L3 Gemini liefen; L4 Perplexity entfällt in Runde 2 (Operator-Amendment 2026-07-17, kein Zugang mehr); L5 Claude Code Web-Research lief als dokumentierte Zusatz-Lane.
- Dedup lief präregistriert vor dem Screening, per DOI und normalisiertem Titel gegen den Bestandskorpus und innerhalb der Runde, kein Match gegen Runde 1.
- Zotero-Import L1 bis L3 ist erledigt (Operator, 2026-07-17), `corpus/source_tool_mapping.json` regeneriert; der Import der L5-RIS steht aus.
- Ein beratender LLM-Screening-Durchgang über die distinkten Runde-2-Kandidaten liegt in `assessment/round2-screening-advisory.md` (2026-07-17, Ergebnisverteilung dort). Er ist advisory; die bindende Entscheidung trifft der menschliche Durchgang in PRISM, der noch aussteht.

## Stufe 8, Distillat-Audit gegen die Fehlerklasse Paraphrase statt Zitat

Vorbedingung der research-vault-Migration ([[distillate-check-plan]]). Geprüft wird, ob als Zitat ausgewiesene Kategorie-Evidenz der Distillate zeichengenau im committeten Volltext steht.

1. Stufe 1, deterministische Vorprüfung (2026-07-17), `src/assess/evidence_audit.py`, Befundklassen OK, P, F, D, G.
2. Stufe 2, adversariale Maschinenprüfung der harten Kandidaten, advisory (2026-07-17).
3. Stufe 1b, deterministische Nachprüfung (2026-07-18), `src/assess/waitlist_resolution.py`, artefakt-toleranter kontiguierlich-wörtlicher Re-Match, der die D-Klasse vollständig auflöste und einen großen Teil der F-Kandidaten als Matcher- oder Docling-Artefakte belegte.
4. Stufe 3, die bindende menschliche Verifikation der verbleibenden F-, G- und U-Fälle, steht aus; die Reihenfolge nach Schärfe ist in `research-vault/waitlist.md` festgelegt.

Die Prüfreports (`generated/distilled/_evidence_audit/`) sind gitignored und liegen lokal; die deterministischen Stufen sind aus den committeten Inputs regenerierbar, die advisory Stufe-2-Urteile als LLM-Urteile nicht. Nebenbefund eines Shingle-Jaccard-Scans über die Volltexte: Quellendubletten-Gruppen und die in Stufe 2 genannten Acquisition-Fehler.

## Stufe 9, research-vault

Der Top-Level-Ordner `research-vault/` trägt das Gegenstandswissen nach dem fünfstufigen Grounded-Vault-Modell mit strenger Abwärts-Referenz, Quelle, Repräsentation, Distillat, Claim, Deliverable ([[research-vault-plan]], Regeln in `research-vault/README.md`). Entscheidung mit Datum (Operator, 2026-07-17): `generated/distilled/` bleibt Pipeline-Output, `research-vault/` ist die kuratierte Belegketten-Quelle; Migration ist kein Kopieren, sondern die verankernde Prüfung gegen den Ursprung.

- Skelett und erste Migrationswelle 2026-07-17, Umbau nach Stufe 1b am 2026-07-18 mit `src/publish/build_research_vault.py`; jedes migrierte Distillat trägt `audit`, `audit-stage1b` und `reference` im Frontmatter, je Quelle ein CSL-JSON-Record in `references/`.
- Claims-Ebene `20_claims/` mit Topic Maps und atomaren Claims auf Kernbefund-Anker, deterministisch geprüft mit `src/publish/check_claims.py`; widersprüchliche Beleglagen tragen `contested`.
- `_sources/` und `00_representation/` sind gitignored und existieren nie im öffentlichen Repo (Lizenz- und Push-Sperre); tote Anker auf diese Ebenen sind erwartete Folge der Sperre, kein Integritätsfehler.
- Statusleiter: `grounded` und `validated` setzen Maschinenprüfungen, `verified` setzt allein die menschliche Fachperson. Die migrierten Distillate tragen `migrated`, weil die Ankerschicht `00_representation/` noch nicht gebaut ist.
- Nicht Migriertes ist in `research-vault/waitlist.md` mit Befundklasse und Grund registriert (datierte Momentaufnahme der Verteilung dort) und wartet auf die Stufe-3-Verifikation.

## Die bindenden menschlichen Stufen im Workflow

1. **Zotero-Pflege** (Stufen 1 und 7). Import aus committeten RIS-Dateien, Dubletten-Merge mit dokumentiertem Match-Grund, Metadatenkorrektur. Der Dubletten-Merge der Runde-2- und Vault-Befunde ist Operator-seitig offen.
2. **Expert-Track und PRISM-Screening** (Stufen 4, 5, 7). Die menschliche Entscheidung ist der bindende Record des Reviews; der LLM-Track ist in jeder Runde advisory. Für Runde 2 steht der menschliche Durchgang aus.
3. **Stufe-3-Verifikation** (Stufen 8 und 9). Nur die menschliche Prüfung entscheidet über die verbleibenden F-, G- und U-Fälle der Warteliste und setzt in der research-vault den Status `verified`.
4. **Operator-Gates.** Freeze der Analysefelder, Präregistrierungs-Amendments, Migrationsfreigaben und der Merge nach `main` sind datierte menschliche Entscheidungen, festgehalten als ADRs in [[specification]], als Amendments in [[update-protocol]] und im `LAUFPROTOKOLL.md`.

## Was committed ist und was lokal bleibt

| Artefakt | Ort | Status |
|---|---|---|
| RIS, Zotero-Export, Provenienz-Mapping | `corpus/` | committed |
| Volltexte konvertiert | `generated/markdown_clean/` | committed |
| PDFs, Validierungsreports, Audit-Reports | `generated/pdfs/`, `generated/validation_reports*/`, `generated/distilled/_evidence_audit/` | lokal, gitignored |
| Distillate (Pipeline-Output) | `generated/distilled/` samt `_stage1_json/`, `_verification/` | committed |
| Assessment-Daten beider Tracks | `assessment/` | committed |
| Benchmark-Ergebnisse, Companion-Daten | `generated/benchmark-results/`, `docs/data/` | committed |
| PRISM-Leseschicht Volltext | `docs/data/fulltext/` | lokal, gitignored |
| research-vault, prüfbare Ebenen | `research-vault/references/`, `10_distillates/`, `20_claims/`, `30_deliverable/` | committed |
| research-vault, geschützte Ebenen | `research-vault/_sources/`, `00_representation/` | lokal, gitignored, nie gepusht |

## Benannte Lücken und offene Schritte (Stichtag 2026-07-18)

Retrospektiv unreparierbar und offen benannt: kein präregistriertes Runde-1-Protokoll (M1), der verlorene instanziierte Runde-1-Prompt, die nicht reproduzierbare Runde-1-RIS-Konversion, keine Inter-Human-Baseline in Runde 1. Offen im Vorwärtsgang: Zotero-Import der L5-RIS mit Mapping-Nachzug, der bindende menschliche Runde-2-Screening-Durchgang, die Stufe-3-Verifikation der Warteliste, der Zotero-Dubletten-Merge, die `00_representation/`-Ankerschicht für den `grounded`-Status, und die Ratifikation der simulierten Stakeholder-Entscheidungen ([[plan]], Simulated decisions).

## Related

- [[INDEX]], Glossar und Leseordnung
- [[methods]], die methodische Tiefe der Stufen 1 bis 4
- [[plan]], Stages A, R, B, C und die Teilprojekte
- [[update-protocol]], Präregistrierung und Analysefelder
- [[conformance-map]], Konformanzlage je Standard-Item
- [[research-vault-plan]] und [[distillate-check-plan]], Bauplan und Prüfplan der Stufen 8 und 9
- [[coding-concept]], der Entwurf für die qualitative Codierung über den eingeschlossenen Papern
