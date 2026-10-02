# codebook-v141-includes-03-3-20261002 · ar2

- Akteur: agent
- Zuweisung: GJF776AY, KQ5A8D6E, MS3CNU3S (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-03-3-20261002/ar2/ar2-coding.json
- Quellenbasis: docs/data/fulltext/GJF776AY.md, docs/data/fulltext/KQ5A8D6E.md, docs/data/fulltext/MS3CNU3S.md, jeweils vollständig gelesen; Codebuch assessment/categories.yaml 1.4.1; knowledge/update-protocol.md, Abschnitte Eligibility, Text preparation and source gate, Agent-assisted completion, Analysis coding
- Ergebnis: bestanden
- Verteilung: Include 3 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| GJF776AY | Volltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Feministisch ja, Gender teilweise, Diversitaet teilweise, Fairness teilweise | Theoretischer Essay, Theoriebezug intersektionaler Feminismus und Boundary Objects |
| KQ5A8D6E | Volltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Diversitaet ja, Generative_KI teilweise, Bias_Ungleichheit teilweise, Fairness teilweise | UNESCO-Rahmenwerk für Schüler:innen, als belegter Policy-Report zugelassen; Include trägt über Diversitaet ja (Inklusionsprinzip) |
| MS3CNU3S | Volltext | provisional | Include | Generative_KI ja, Bias_Ungleichheit ja, Fairness ja, Prompting teilweise, Gender teilweise, Diversitaet teilweise, Feministisch teilweise | Kein DOI im Text, Identität über Titel, Autor:innen und Daten |

## Abweichungen und Blocker

- MS3CNU3S · Metadatenlücke · Der Volltext enthält keinen DOI des Artikels selbst, Titel und Autorenliste stimmen überein · DOI-Abgleich gegen die Korpusmetadaten durch den Orchestrator
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Gender_Understanding · GJF776AY · Social_Construct nur über den Satz zu „societal definitions of race and gender“ in der Gesichtserkennung; Grenzfall zur Schwelle von 1.4.1, Alternative wäre Absent/Unclear
- AN_Gender_Understanding · MS3CNU3S · Social_Construct über die eigene Aussage, soziale Gruppen (Definition 3 nennt gender identity und sex) seien sozial konstruiert; Aussage gilt sozialen Gruppen allgemein, nicht Geschlecht allein
- AN_Bias_Axes · GJF776AY · Achsen aus ausgeführten, aber zitierten Beispielen (Buolamwini, Noble, Keyes) codiert, da die Achsenregel eigene Worked Examples zählt; Keyes-Beispiel zu trans Personen als Sexual_Orientation_Identity
- AN_Bias_Axes · MS3CNU3S · Achsen aus den Zielgruppenspalten von Tabelle 4 plus Dialektachse; Disability und Socioeconomic nur in Beispielen und Fußnote, nicht codiert
- AN_Harm_Types · MS3CNU3S · alle neun Werte aus der eigenen Taxonomie in Tabelle 1 und Definition 7 (Codebuch-Anker); Derogatory-Language-Zeile in der Konversion ohne Zeilenlabel
- AN_Mitigation_Status · MS3CNU3S · Evaluated beruht auf synthetisierten Evaluationen (Borchers et al. 2022, Pruning), keine eigene Evaluation
- AN_Task · KQ5A8D6E · Schulische Bildung als Other_Task statt Teaching_Further_Education, da dieser Wert Fachkräfte betrifft
- Gender · KQ5A8D6E · nein, da Geschlecht nur in Aufzählungen von Bias-Arten erscheint; konsistent mit AN_Gender_Definition Not_Applicable
- Feministisch · MS3CNU3S · teilweise über die eigene strukturelle Kritik an „male-as-norm“ als Machthierarchie, ohne feministischen Theorierahmen

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
