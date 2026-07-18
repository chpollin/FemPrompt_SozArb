---
title: Coding Concept (Draft)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: de
version: "0.1"
created: 2026-07-18
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
related: [update-protocol, analysis-fields-pilot, plan, workflow, data]
---

# Codierungskonzept für die qualitative Auswertung (Entwurf)

Dieses Dokument ist ein Entwurf, keine Setzung. Es beschreibt, wie die qualitative Codierung der eingeschlossenen Literatur über den eingefrorenen Analysefeldern laufen soll, und dient der Operatorin und der Projektkollegin als Entscheidungsgrundlage. Verbindlich codieren Menschen; jeder maschinelle Beitrag bleibt advisory, konsistent mit der Verantwortungsasymmetrie des Projekts. Offene Entscheidungen sind im Text als markierte Fragen (E1 bis E8) geführt und am Ende gesammelt; nichts davon ist entschieden, bevor die dort genannte Instanz es entschieden hat.

Grundlage sind die am 2026-07-17 eingefrorenen Analysefelder (`assessment/categories.yaml` v1.3, `analysis_fields`-Block, inklusive `AN_Prompting_Role`), die Codierregeln in [[update-protocol]] Abschnitte B, B.1 und C, und die Pilot-Befunde aus [[analysis-fields-pilot]]. Eine Änderung an Felddefinitionen oder Vokabularen nach Codierstart wäre ein datiertes Amendment der Präregistrierung, keine stille Anpassung.

## 1. Gegenstand und Codiereinheit

Codiert werden ausschließlich Paper mit bindender menschlicher Entscheidung Include (Codierregel 1); ausgeschlossene Paper erhalten keine Analysecodes. Der Analysekorpus ist die Include-Menge aus Runde 1 plus das, was der Runde-2-Durchgang hinzufügt; ob die Runde-1-Includes retro-codiert werden, ist die simulierte, noch nicht ratifizierte Entscheidung 4 aus [[plan]] (gestaffelt, Update-Batch zuerst).

Die Codiereinheit ist das Paper je Analysefeld. Jedes Feld erhält je Paper genau einen Wert oder eine semikolonseparierte Werteliste aus dem geschlossenen Vokabular; eine feinere Segmentierung des Textes in codierte Passagen ist für die Auswertungsebenen der Präregistrierung (Frequenzen, Kookkurrenzen, qualitative Synthese über SQ1 bis SQ3) nicht erforderlich und würde den Excel-Workflow sprengen. Die Begründungseinheit ist davon getrennt die Textstelle. Wo eine Codierentscheidung strittig oder tragend ist, wird die stützende Stelle festgehalten, als Verbatim-Zitat oder präziser Verweis in `AN_Notes`, beziehungsweise als gepinnter Beleg, wo in PRISM gearbeitet wird. Für SQ3 verlangt das Protokoll ohnehin, explizite Adaptations-Aussagen verbatim über `AN_Notes` zu sammeln.

**E8 (offen).** Braucht das Verbatim-Sammeln für SQ3 eine Fundstellen-Konvention (Abschnitts- oder Seitenangabe neben dem Zitat), damit die spätere Synthese die Stellen wiederfindet, oder genügt das reine Zitat in `AN_Notes`?

## 2. Codiergrundlage, Volltext gegen Distillat

Codiert wird vom tiefsten verfügbaren Text, und die tatsächlich gelesene Basis wird je Paper in `AN_Coding_Basis` festgehalten (`Fulltext`, `Knowledge_Doc`, `Abstract`; Codierregel 2). Der Volltext ist die Codiergrundlage der Wahl, wo er in `generated/markdown_clean/` beziehungsweise über die lokale PRISM-Leseschicht vorliegt. Zwei Felder hängen daran besonders, `AN_Harm_Types` ist nur bei `AN_Coding_Basis = Fulltext` verpflichtend (Freeze-Beschluss B.1 Punkt 3), und der Pilot fand auch `AN_Prompt_Techniques` aus schwächeren Textbasen oft nicht auflösbar.

Die research-vault-Distillate sind Arbeitsgrundlage, nicht Codiergrundlage. Sie taugen als Einstieg, zur Orientierung, zum schnellen Auffinden von Belegstellen, weil ihre Zitat-Ansprüche gegen den Volltext geprüft sind (dokumentierte Belegkette, `audit`-Frontmatter). Drei Einschränkungen begründen die Trennung:

1. Das 2x2-Experiment des Projekts zeigte, dass Wissensdokumente das Framing der Distillation vererben und den Inclusion Bias verstärken; eine Codierung, die nur das Distillat liest, erbt diese Verzerrung.
2. Die Distillate in `generated/distilled/`, die noch auf der Warteliste stehen, sind ungeprüft; ihre Kategorie-Evidenz kann Paraphrase mit Zitatanspruch enthalten (die Fehlerklasse aus [[distillate-check-plan]]).
3. Auch migrierte research-vault-Distillate tragen `status: migrated`, nicht `verified`; die bindende menschliche Bestätigung der Belegkette steht aus.

Wo kein Volltext existiert, ist das Distillat oder der Abstract die ehrlich dokumentierte Basis, genau dafür gibt es `AN_Coding_Basis`.

**E2 (offen).** Gilt für die verbindliche Codierung eine Vorrangregel der Form, Distillat als `Knowledge_Doc`-Basis nur dann, wenn es die geprüfte research-vault-Fassung ist, oder ist jedes Pipeline-Distillat aus `generated/distilled/` zulässig? Der Entwurf empfiehlt die engere Lesart, weil nur die research-vault-Fassung eine geprüfte Belegkette trägt.

## 3. Vorgehen je Analysefeld

Empfohlene Codierreihenfolge je Paper, zuerst `AN_Prompting_Role`, weil es festlegt, in welcher Rolle Prompting im Paper überhaupt figuriert, dann die übrigen Felder. Die Feldregeln aus [[update-protocol]] Abschnitt C und B.1, hier operativ zusammengefasst:

| Feld | Regelkern |
|---|---|
| `AN_Prompting_Role` (multi) | In welcher Rolle Prompting vorkommt (empfohlene Praxis, Forschungsinstrument, Kritikgegenstand, Lerninhalt), unabhängig davon, ob eine Technikfamilie codierbar ist |
| `AN_Prompt_Techniques` (multi) | Nur bei benannter oder erkennbar beschriebener konkreter Technik; `None` ist bei `Prompting: Ja` legitim (B.1 Punkt 2); die konkrete Strategie hinter `General_Guidance` verbatim nach `AN_Notes` |
| `AN_Bias_Axes` (multi) | Eine Achse nur, wenn das Paper Bias entlang ihrer analysiert, nicht bei bloßer demografischer Nennung; `Intersectional` verlangt mindestens zwei Achsen in ihrer Wechselwirkung |
| `AN_Harm_Types` (multi, optional) | Nur benannte oder demonstrierte Mechanismen, gegen die Gallegos-Definitionen gematcht; verpflichtend nur bei Volltext-Basis |
| `AN_Mitigation_Stage` (multi) | Wo die Mitigation tatsächlich eingreift, nicht wo sie eingreifen könnte |
| `AN_Mitigation_Status` (single) | Die höchste erreichte Stufe (Evaluated über Demonstrated über Proposed) |
| `AN_Population` (multi) | Das adressierte Setting, nicht das spekulativ erwähnte; `Education_Professional` eng, nur berufliche oder hochschulische AI-Literacy-Kontexte (B.1 Punkt 5) |
| `AN_Coding_Basis` (single) | Die tatsächlich gelesene tiefste Textbasis |
| `AN_Notes` (frei) | Begründungen, Verbatim-Strategien und -Aussagen, Nicht-Entscheidbarkeit |

Übergreifend gelten die Codierregeln 1 bis 5 aus dem Protokoll, insbesondere, keine leere Zelle (jedes Feld hat `None`, eine leere Zelle ist ein Validierungsfehler an der Import-Brücke), und codiert wird, was das Paper tut, nicht was es zitiert. Für `Studientyp` Literaturreview oder Konzept gilt die Review-Sonderregel (B.1 Punkt 4), das vom Review synthetisierte Technik-, Harm- und Mitigations-Inventar ist als Gegenstand des Reviews codierbar; nur beiläufige Zitation bleibt ausgeschlossen.

## 4. Umgang mit Unclear-Fällen

Zwei Ebenen sind zu trennen.

Screening-Unclear. Ein Paper mit abgeleiteter Entscheidung Unclear (dreistufige Kategorien, ADR-024) wird nicht codiert. Es erhält Analysecodes erst, wenn der bindende menschliche Durchgang es zu Include auflöst, gegebenenfalls über den begründungspflichtigen Override (ADR-023). Eine vorläufige Codierung von Unclear-Papern schafft nur Werte, die bei Exclude wieder gelöscht werden müssten.

Feld-Unclear. `None` bedeutet, das Paper behandelt den Gegenstand des Feldes wirklich nicht. Ist ein Feld aus der verfügbaren Textbasis nicht entscheidbar, wird nicht `None` gesetzt, sondern die Nicht-Entscheidbarkeit in `AN_Notes` festgehalten, mit Feldname (Codierregel 2). Der Entwurf empfiehlt dafür eine knappe Konvention, je nicht entscheidbarem Feld eine Zeile der Form `Feldname: nicht entscheidbar aus <Basis>` in `AN_Notes`, damit die Fälle maschinell auszählbar bleiben und die Füllraten interpretierbar werden, wie es der Pilot für `AN_Prompt_Techniques` vorgemacht hat.

Ambiguitäten werden gesammelt, nicht still entschieden. Die Ambiguitätenliste des Piloten (A1 bis A7) wird beim echten Codieren fortgeschrieben; wiederkehrende Ambiguität an einem Feld ist das Signal für eine Definitionsschärfung per Amendment.

**E3 (offen).** Reicht die `AN_Notes`-Konvention für Nicht-Entscheidbarkeit, oder soll ein eigener Code (etwa `Undecidable`) in die Vokabulare? Letzteres wäre sauberer auszählbar, ist aber eine Vokabular-Änderung am eingefrorenen v1.3 und damit ein datiertes Amendment.

**E7 (offen).** Der Pilot arbeitete mit der Faustregel, ein Feld zu revidieren, wenn Codiererinnen bei mehr als rund einem Viertel der Paper Ambiguität anmelden. Soll diese Schwelle für die Hauptcodierung verbindlich übernommen werden, und wer stellt sie fest?

## 5. Doppelcodierung und Konsensverfahren

Die Aufstellung ist die simulierte, noch nicht ratifizierte Entscheidung 5 aus [[plan]], eine menschliche Codiererin je Paper, dazu der advisory LLM-Track, dazu eine doppelt codierte Human-Human-Überlappungsstichprobe. Der Entwurf übernimmt sie als Arbeitshypothese, weil volle Doppelcodierung für zwei ausgelastete Wissenschaftlerinnen unrealistisch ist und die Überlappungsstichprobe die fehlende Inter-Human-Baseline zu begrenzten Kosten schließt.

Konkretes Verfahren im Entwurf:

1. Aufteilung der zu codierenden Paper zwischen R1 und R2; eine vorab festgelegte, stratifizierte Überlappungsmenge codieren beide unabhängig, ohne Kenntnis der jeweils anderen Codierung.
2. Übereinstimmung auf der Überlappungsmenge wird je Feld berichtet, mit derselben Dekompositions-Rahmung wie im Screening (beobachtete Übereinstimmung vor Koeffizienten, nie als Fehlerrate einer Codiererin; bei Multi-Select-Feldern Übereinstimmung je Code). Berechnung durch committete Skripte, nie von Hand.
3. Divergente Codes werden in einer Konsenssitzung aufgelöst, analog zur Reconciliation divergenter Screening-Entscheidungen ([[plan]] B3, PRISMA-trAIce M8); festgehalten werden der Konsenswert, der Weg dorthin und das Datum. Der Konsenswert ersetzt die Einzelcodes im Analysedatensatz, die Einzelcodes bleiben als Rohdaten erhalten.
4. Nicht auflösbare Divergenz ist ein Befund, kein Versagen; sie wird als solche dokumentiert und geht in die Ambiguitätenliste ein.

**E1 (offen).** Ratifikation der Aufstellung durch die beiden Codiererinnen, einschließlich der Frage, wer welchen Teilkorpus übernimmt und ob die Retro-Codierung der Runde-1-Includes (Entscheidung 4) mitläuft oder nach dem Update-Batch folgt.

**E5 (offen).** Größe und Stratifizierung der Überlappungsstichprobe (Kandidaten-Strata analog zum Pilot, Prompting Ja/Nein und Textbasis) und der endgültige Berichts-Satz der Übereinstimmungsmaße je Feld.

**E6 (offen).** Läuft ein advisory LLM-Codier-Track über dieselben Felder mit? Er würde das Dual-Track-Design auf die Analyseebene ausdehnen und bräuchte, wie im Protokoll benannt, ein eigenes vorab festgelegtes Sub-Protokoll (Modellversion, Prompt, Parameter, committed vor dem Lauf). Ohne Protokoll läuft er nicht.

## 6. Dokumentationsform der Codierentscheidungen

Erfassungsort ist die etablierte Excel im Spaltenschema von `assessment/human_assessment.csv`, erweitert um die `AN_`-Spalten nach `Notes` ([[update-protocol]] Abschnitt D), mit `Legend`-Sheet, Dropdown-Validierung für Single-Select-Felder und Semikolon-Listen für Multi-Select-Felder. Die Durchsetzung der geschlossenen Vokabulare geschieht an der P3-Import-Brücke (Split, Trim, Match gegen die Liste, Leerzellen-Prüfung für Includes, sichtbarer Import-Report, nie stille Annahme); `categories.yaml` v1.3 ist die eine Quelle, aus der Template, Brücke und Werkzeug lesen.

Der dokumentierte Bestand je Codierentscheidung:

- der Feldwert selbst, vokabular-validiert in der committeten CSV,
- die Textbasis in `AN_Coding_Basis`,
- Begründungen, Verbatim-Material und Nicht-Entscheidbarkeit in `AN_Notes`,
- bei Konsensfällen der Konsens-Record aus Abschnitt 5,
- wo in PRISM gearbeitet wird, die gepinnten Belege mit Herkunft (`origin`) als Evidenzanker.

**E4 (offen).** Wird die Analysecodierung ausschließlich in der Excel erfasst, oder soll PRISM die `AN_`-Felder als Erfassungsoberfläche bekommen? Die Präregistrierung erwartet Vokabular-Durchsetzung zur Erfassungszeit; gebaut ist sie bisher an der Import-Brücke, eine PRISM-Erfassung der Analysefelder wäre ein eigenes Tool-Arbeitspaket ([[specification]]).

## 7. Offene Entscheidungen, gesammelt

| Id | Frage | Entscheidet |
|---|---|---|
| E1 | Ratifikation der Codier-Aufstellung (Split, Retro-Codierung) | R1, R2, Operator |
| E2 | Distillat-Basis nur in research-vault-geprüfter Fassung? | Operator mit R1, R2 |
| E3 | Nicht-Entscheidbarkeit per `AN_Notes`-Konvention oder eigener Code (Amendment) | Operator |
| E4 | Erfassungsort Excel allein oder PRISM-Erweiterung | Operator, Tool-Backlog |
| E5 | Überlappungsgröße, Strata, Übereinstimmungs-Berichtssatz | R1, R2, Operator |
| E6 | Advisory LLM-Codier-Track mit eigenem Sub-Protokoll | Operator |
| E7 | Verbindliche Ambiguitätsschwelle für Definitionsrevisionen | R1, R2, Operator |
| E8 | Fundstellen-Konvention für SQ3-Verbatims | R1, R2 |

## Related

- [[update-protocol]], Analysefeld-Design, Codierregeln, Freeze B.1
- [[analysis-fields-pilot]], Füllraten, Ambiguitäten, Revisionsvorschläge
- [[plan]], simulierte Entscheidungen 4 und 5, Stage B3
- [[workflow]], die Stelle der Codierung in der Gesamtkette
- [[data]], Datensubstrat und Schema
