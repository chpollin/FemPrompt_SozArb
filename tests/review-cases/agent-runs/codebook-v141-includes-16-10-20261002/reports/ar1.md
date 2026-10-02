# codebook-v141-includes-16-10-20261002 · ar1

- Akteur: agent
- Zuweisung: 4GYXUS9Y, 5G2QTZYD, 6N2E242K, 79TL6HSB, 7G73H3KM, 7IVS7X63, KPSF8EZE, LGYFN6JK, X7ZGW6CN, YTDMY5W4 (Reihenfolge des Laufmanifests)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-16-10-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/ mit den Manifest-Hashes, jeweils vollständig gelesen; Regelquellen assessment/categories.yaml v1.4.1 und die im System-Prompt genannten Abschnitte von knowledge/update-protocol.md
- Ergebnis: bestanden
- Verteilung: Include 9 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4GYXUS9Y | Fulltext | verified | Include | Generative_KI ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise | Kommentar, keine DOI im Text |
| 5G2QTZYD | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch ja; AI_Literacies, Fairness teilweise | Datenherkunft der berichteten Analysen nicht dokumentiert |
| 6N2E242K | Fulltext | verified | Include | AI_Literacies ja, Soziale_Arbeit ja, Generative_KI teilweise | Bias ist kein Gegenstand, SQ4-Felder Not_Applicable |
| 79TL6HSB | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit ja; Bias_Ungleichheit teilweise | IRB-Nummer als Platzhalter gedruckt |
| 7G73H3KM | Fulltext | verified | Include | AI_Literacies, Generative_KI, Bias_Ungleichheit, Feministisch ja; Prompting, Diversitaet teilweise | Hochschulische Lehre in Ökonomie |
| 7IVS7X63 | Fulltext | provisional | Include | Generative_KI, Bias_Ungleichheit ja; Prompting, Diversitaet, Feministisch teilweise | Preprint ohne Jahr, Venue und DOI im Text |
| KPSF8EZE | Fulltext | verified | Unclear | AI_Literacies ja; Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Diversitaet teilweise | Sozialdimension erreicht nur teilweise |
| LGYFN6JK | Fulltext | verified | Include | Generative_KI, Soziale_Arbeit, Bias_Ungleichheit ja; AI_Literacies, Prompting, Diversitaet teilweise | Ligaturartefakte im Volltext, Zitate um sie herum gewählt |
| X7ZGW6CN | Fulltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch ja | Ohne Jahr, Venue und DOI im Text |
| YTDMY5W4 | Fulltext | provisional | Include | AI_Literacies, Generative_KI, Bias_Ungleichheit, Diversitaet ja; Prompting teilweise | Institutionelles Rahmenwerk, Publikationstyp als Grauliteratur eingeordnet |

## Abweichungen und Blocker

- KPSF8EZE · Entscheidung · Der Lauf ist als Include-Lauf manifestiert, die Kategorien ergeben nach Codebuch aber Unclear, weil Bias, Gerechtigkeit und kulturelle Diversität im Editorial nur als nachgeordnete Teilaspekte der AI Literacy erscheinen · Fachliche Prüfung, ob die Sozialdimension die Include-Schwelle erreicht.
- 5G2QTZYD · Quellenqualität · Regression, ANOVA und Befragung werden ohne Angaben zu Datensätzen, Stichprobe oder Herkunft berichtet, die Gesichtserkennungswerte folgen dem zitierten Gender-Shades-Muster · Prüfung durch die Domain-Expert:innen, ob der Studientyp Empirisch und die Schadensarten auf eigener Evidenz tragen.
- YTDMY5W4 · Publikationstyp · Internes Hochschulrahmenwerk (Version 0.1) mit benannter Autorenschaft, Begutachtung und Literaturangaben, eingeordnet als belegte wissenschaftliche Grauliteratur nach der Klarstellung vom 5. September 2026 · Bestätigung der Einordnung durch die Domain-Expert:innen.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- Soziale_Arbeit · 7IVS7X63 · Menschen mit psychischen Erkrankungen sind eine Zielgruppe Sozialer Arbeit, das Werk behandelt aber Stigma im LLM-Output ohne Bezug auf Praxis oder Adressat:innen; codiert nein, AN_Population Not_SW_Specific.
- Feministisch · 7IVS7X63 · Intersektionale Linse auf Nationalität und psychische Erkrankung ohne Gender und ohne Machtanalyse; zwischen Kategorienbeispiel (intersektionale Analysen zählen) und System-Prompt (explizite intersektionale Machtanalyse) als teilweise codiert.
- AN_Harm_Types · 7G73H3KM · Das eigene Bias-Beispiel betrifft die Bevorzugung des ökonomischen Mainstreams in ChatGPTs Definitionen, eine epistemische, keine soziale Gruppe; daher None statt Exclusionary_Norms.
- AN_Harm_Types · YTDMY5W4 · Epistemische Ungerechtigkeit und nicht inklusiver Output werden behauptet, nicht nachgewiesen; als Exclusionary_Norms codiert, weil das Rahmenwerk den Mechanismus im eigenen Argument setzt.
- AN_Gender_Definition und AN_Gender_Understanding · X7ZGW6CN · Die übernommene queertheoretische Bestimmung, dass female keine klar definierte natürliche Kategorie ist, als Explicit gewertet; Non_Binary_Inclusive, weil trans und femme Communities als Kategorien des konzeptuellen Arguments geführt werden, ohne Messung.
- AN_Gender_Understanding · 5G2QTZYD · Binary_Categorical zusammen mit Intersectional (Black women), offene Paarung aus dem Pilotlauf.
- AN_Task · LGYFN6JK · Prüfung von Fallnotizen auf diskriminierende Sprache ist als Forschungsnutzung beschrieben und nur unter Research codiert, offene Frage des Pilotlaufs zu Documentation_Recording.
- AN_Theory_Reference · LGYFN6JK · Das antirassistische Forschungsrahmenwerk (Goings et al. 2023) rahmt die Bias-Empfehlung und wurde als Yes gewertet.
- identity_check · alle Quellen ohne DOI · verified, wo Titel, Autor:innen und Jahr im Text stehen; provisional, wo zusätzlich Jahr oder Venue fehlen (7IVS7X63, X7ZGW6CN) oder der Publikationstyp eine Einordnung verlangt (YTDMY5W4).

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
