# codebook-v14-pilot-10-20261001 · ar1

- Akteur: agent (Claude Code subagent, Modell claude-opus-5-5)
- Zuweisung: G53MCF3W, KNQYFQ6B, WLV8L8PM, PQC9G5EU, VFD9ENG6, YN9JAREI, 6IU5JG5Y, LGYFN6JK, H59BNSX8, 3B87U5LN
- Coding-Paket: ar1-coding.json (femprompt-prisma-coding-packet/0.2, Codebuch 1.4)
- Quellenbasis: docs/data/fulltext/<ID>.md laut Laufmanifest, jeweils vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 10 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| G53MCF3W | Volltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting (t), Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness (t) | Interviewstudie, nicht-binäre Gruppe als eigene Analysekategorie |
| KNQYFQ6B | Volltext | provisional | Include | Generative_KI, Prompting, KI_Sonstige (t), Bias_Ungleichheit, Gender, Fairness (t) | Jahr und DOI fehlen im Text; Prompt-Mitigation evaluiert |
| WLV8L8PM | Volltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness (t) | Jahr und DOI fehlen im Text |
| PQC9G5EU | Volltext | provisional | Include | AI_Literacies (t), KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (t) | Buchkapitel, Jahr und DOI fehlen im Text |
| VFD9ENG6 | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender (t), Diversitaet (t), Feministisch (t), Fairness | Preprint ohne Jahr und DOI im Text |
| YN9JAREI | Volltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness | Publikationstyp Grenzfall, als wissenschaftliche Graue Literatur zugelassen |
| 6IU5JG5Y | Volltext | verified | Include | AI_Literacies (t), KI_Sonstige, Soziale_Arbeit (t), Bias_Ungleichheit, Gender (t), Diversitaet, Feministisch, Fairness | |
| LGYFN6JK | Volltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting (t), Soziale_Arbeit, Bias_Ungleichheit (t), Diversitaet (t) | eingeladener Kommentar, zulässig |
| H59BNSX8 | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet (t), Fairness (t) | Autorname Lal/Lai im Text uneinheitlich |
| 3B87U5LN | Volltext | verified | Include | AI_Literacies (t), Generative_KI, Soziale_Arbeit, Bias_Ungleichheit (t), Diversitaet (t) | Soziale_Arbeit = ja als Auslegung, siehe unten |

(t) = teilweise, sonst ja.

## Abweichungen und Blocker

- Regelquellen · Versionswiderspruch · `knowledge/update-protocol.md` nennt in „Eligibility“ und „Analysis coding“ Codebuch 1.3 als gültig, beschreibt unter „Proposed codebook amendment v1.4“ die Änderung als nicht übernommen und nennt für die Tracks Paketschema 0.1. `assessment/categories.yaml` führt dagegen v1.4 mit Übernahmevermerk vom 2026-10-01, Prompt v1.3 und Laufmanifest binden Codebuch 1.4 und Paket 0.2. Der Track folgt der manifestgebundenen Fassung 1.4 ohne Ersatzregel · Klärung: Protokolltext an die Übernahme von v1.4 angleichen.
- Regelquellen · Ausschlussgründe · categories.yaml führt `Consolidated_expert_exclusion`, Protokoll und Validator nicht · ohne Folgen für diesen Track, da kein Exclude.
- YN9JAREI · Publikationstyp · Leitfaden einer Hochschule im BMWK-Transferprojekt mit benannter Autorschaft, Zitiervorschlag und verlinkten Quellen, Belege überwiegend Presse und eigene illustrative Bildversuche · Operator-Bestätigung, ob solche Praxisleitfäden als belegte Graue Literatur gelten.
- KNQYFQ6B, WLV8L8PM, PQC9G5EU, VFD9ENG6 · Metadatenlücke · Jahr und DOI fehlen in der konvertierten Paper-Ebene, Titel und Autor:innen stimmen · vorläufige Codierung, Abgleich mit Zotero-Metadaten.

## Codierregeln mit Auslegungsbedarf

- Prompting · G53MCF3W, WLV8L8PM · Prompts als variierte Stimuli (gegenderte bzw. heteronormative Formulierungen) untersuchen den Einfluss der Eingabe, ohne Prompt-Strategien zu behandeln; beide auf teilweise gesetzt, Rolle Research_Instrument, Technik None.
- Soziale_Arbeit · 3B87U5LN · Psychosoziale Unterstützung für Menschen mit psychischen Belastungen ohne Nennung Sozialer Arbeit; als Zielgruppe Sozialer Arbeit auf ja gesetzt, was die Entscheidung Include trägt. Bei Lesart „nur direkter SA-Bezug“ wäre der Record Unclear.
- AN_Harm_Types · VFD9ENG6, 6IU5JG5Y, H59BNSX8 · Allokative Disparitäten ohne eigene Einordnung als unmittelbar oder mittelbar; Indirect_Discrimination nur dort vergeben, wo der Text ein Proxy- oder Disparate-Impact-Kriterium nennt (80-Prozent-Regel, invalide Korrelationen, Netzwerknähe), sonst unvergeben.
- AN_Harm_Types · 3B87U5LN · Ungleiche Reichweite bei technikaffiner Stichprobe als Exclusionary_Norms nach Anker MA3LBJS6, Bias-Achsen trotzdem None, weil digitale Kompetenz keine soziale Achse ist; Spannung zu AN_Bias_Definition Not_Applicable bleibt bestehen.
- AN_Mitigation_Status · 6IU5JG5Y · Experten-Workshop prüfte Umsetzbarkeit der Empfehlungen, nicht deren Wirkung; Proposed statt Evaluated.
- AN_Mitigation_Status · YN9JAREI, H59BNSX8 · Informelle Anwendung ohne Prüfung (Bildprompt-Varianten, Fallstudienmethode in eigener Lehre) als Demonstrated.
- AN_Bias_Axes · G53MCF3W, WLV8L8PM · Nicht-binäre und trans Personen sowie queere Sprache als Sexual_Orientation_Identity; queerer Slang zusätzlich als Language_Culture, weil der Text ihn als Minderheitensprachform behandelt.
- AN_Bias_Axes · YN9JAREI · Women of Color nur als zitiertes Pressebeispiel, daher kein Intersectional; die übrigen Achsen stammen aus den eigenen Bildversuchen des Leitfadens.
- AN_Theory_Reference · YN9JAREI, LGYFN6JK, H59BNSX8 · Knappe Rahmungen (Gender Data Gap und feministische KI, antirassistisches Forschungsframework, kritische Theorie und Critical Race Theory) als Yes gewertet; Grenzfälle.
- AN_Gender_Understanding · VFD9ENG6 · Binary_Categorical mit Intersectional kombiniert; das Codebuch schließt die Kombination nicht aus, nennt sie aber auch nicht als zulässig.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja (PASS coding packet: ar1, 10 records)
