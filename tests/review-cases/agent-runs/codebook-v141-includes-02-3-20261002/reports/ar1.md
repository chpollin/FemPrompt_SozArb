# codebook-v141-includes-02-3-20261002 · ar1

- Akteur: agent
- Zuweisung: AXEIVEW3, LXDG4KQK, Y6M97SWQ (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-02-3-20261002/ar1/ar1-coding.json
- Quellenbasis: docs/data/fulltext/AXEIVEW3.md, docs/data/fulltext/LXDG4KQK.md, docs/data/fulltext/Y6M97SWQ.md, jeweils vollständig gelesen, SHA-256 gegen das Laufmanifest geprüft
- Ergebnis: bestanden
- Verteilung: Include 3 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| AXEIVEW3 | Fulltext | verified | Include | AI_Literacies ja, Soziale_Arbeit ja; teilweise Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet | Erasmus+-Projektbericht mit DOI und Methodik, als belegter Forschungsreport zulässig |
| LXDG4KQK | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, Bias_Ungleichheit ja; teilweise AI_Literacies, Gender, Diversitaet, Fairness | Amnesty-Bericht EUR 18/8709/2024 ohne DOI, institutionelle Autorschaft, Methodikkapitel |
| Y6M97SWQ | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, Fairness ja; teilweise AI_Literacies | systematischer Review, Research on Social Work Practice 2025 |

## Abweichungen und Blocker

- keine Blocker. Alle drei Quellen identitätsgeprüft, kein Titel- oder Kennungskonflikt.

## Codierregeln mit Auslegungsbedarf

- AN_Population · AXEIVEW3 · Jugendarbeit hat keinen eigenen Wert. Gewählt wurden Education_Professional für das professionelle AI-Literacy-Setting und Homelessness_Youth als nächstliegender Jugendwert, obwohl der Bericht keine prekären Lebenslagen fokussiert.
- AN_Bias_Axes, AN_Harm_Types · AXEIVEW3 · Die Sprachbarriere (Tools überwiegend englisch, griechischsprachige Jugendliche benachteiligt) wurde als eigenes Beispiel der Fokusgruppen gelesen und als Language_Culture sowie Exclusionary_Norms codiert. Eine engere Lesart sähe darin keine Bias-Analyse und codierte None.
- Gender · AXEIVEW3 · Teilweise nur über referierte Surveydaten zu Nutzungsunterschieden von Männern und Frauen, die das Fazit aufgreift. Daraus folgen Implicit_Only und Binary_Categorical. Eine strengere Lesart der Regel zu referierten Fremdaussagen ergäbe nein und Not_Applicable.
- AN_Theory_Reference · LXDG4KQK · Strukturelle Diskriminierung (Definition nach Najcevska) und Othering rahmen die Diskriminierungsanalyse des Kapitels 8 und wurden als Theoriebezug gewertet.
- Feministisch · LXDG4KQK · Intersektionalität erscheint nur in Empfehlungen, die Frauenhaus-Befragung bleibt ohne geschlechterbezogene Strukturkritik. Codiert nein.
- AN_Bias_Axes · LXDG4KQK · Familienstand und nicht-traditionelle Haushaltsform als Other_Axis, weil das Werk sie als eigenen Diskriminierungsgrund des Modells 'Really Single' benennt.
- AN_Mitigation_Status · Y6M97SWQ · Evaluated beruht auf der synthetisierten Schwellenkorrektur von Purdy und Glass (2023) mit berichtetem Ergebnis, nicht auf einem eigenen Experiment des Reviews.
- AN_Theory_Reference · Y6M97SWQ · CFIR rahmt die Implementierung, nicht Bias, daher No. Die Equity-Bestimmung nach Russell (2015) trägt AN_Bias_Definition Explicit.
- AN_Bias_Axes · Y6M97SWQ · Gender (einmal als Subgruppendimension von Genauigkeitsprüfungen) und Socioeconomic (nur in zitierter Diskussion) blieben uncodiert.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
