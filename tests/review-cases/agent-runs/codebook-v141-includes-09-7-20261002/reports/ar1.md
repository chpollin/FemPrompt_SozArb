# codebook-v141-includes-09-7-20261002 · ar1

- Akteur: agent
- Zuweisung: 8WBUGXRR, BBLJ4RG3, DUV4TUG3, JJLSMEQA, JKF6VAQB, PAZJHB8J, VVEEL68I
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-09-7-20261002/ar1/ar1-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/, Hashes gegen das Laufmanifest geprüft, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 4 · Unclear 2 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 8WBUGXRR | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit (ja); AI_Literacies, Diversitaet, Fairness (teilweise) | Narratives Review mit Rahmenwerk, Bias-Achsen und Schadensarten None |
| BBLJ4RG3 | Fulltext | verified | Unclear | AI_Literacies, KI_Sonstige (ja); Bias_Ungleichheit, Fairness (teilweise) | Sozialdimension nur als Ethikprinzip und Reflexionscode |
| DUV4TUG3 | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja) | Titelvariante gegenüber dem Korpustitel |
| JJLSMEQA | Fulltext | verified | Unclear | AI_Literacies, Generative_KI (ja); Prompting, Bias_Ungleichheit (teilweise) | Bias nur als Lehrkräftebefund nachgeordnet |
| JKF6VAQB | Fulltext | verified | Exclude (Not_relevant_topic) | Generative_KI (ja) | Sozialdimension nur in Rahmungssätzen, Record-IDs JKF6VAQB und ZHQMHHPQ |
| PAZJHB8J | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Diversitaet, Fairness (teilweise) | Referenzen teils sachfremd, in AN_Notes vermerkt |
| VVEEL68I | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Bias_Ungleichheit, Diversitaet, Fairness (ja); Soziale_Arbeit, Gender (teilweise) | Konvertierung in 4.3 bis 5.3 doppelt und verwürfelt, lesbar |

## Abweichungen und Blocker

- DUV4TUG3 · Identität · Texttitel „Improving Diversity of Demographic Representation in Large Language Models via Collective-Critiques and Self-Voting“, Korpustitel „Improving diversity of demographic representation in people entities in Large Language Models“; gleicher Gegenstand, kein DOI und kein Jahr im Text, als Titelvariante gelesen und vorläufig codiert · Bestätigung der Work-Version-Bindung
- PAZJHB8J · Quellenqualität · mehrere Literaturangaben passen nicht zu den gestützten Aussagen (etwa ein Review zu Net-Zero-Gebäudedesign für NLP-Dokumentation); Publikationstyp bleibt zulässig · keine Klärung für die Codierung nötig, Hinweis für die Synthese
- VVEEL68I · Konvertierung · Abschnitte 4.3 bis 5.3 enthalten überlagerte, teils zerstückelte Textfragmente; alle Belege stammen aus zusammenhängenden Passagen · keine
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Gender_Understanding · DUV4TUG3 · Die Analyse führt Geschlecht als male, female und other aus einem Knowledge Graph; die Autor:innen nennen „other“ selbst einen unzureichenden Platzhalter für Geschlechter jenseits der Binarität. Als Non_Binary_Inclusive codiert, weil eine Kategorie jenseits der Binarität Teil der Analyse ist; Binary_Categorical wäre die engere Lesart.
- AN_Bias_Definition · DUV4TUG3 · Explicit über die eigene Bestimmung des Fairness- und Inklusionsproblems als fehlende Repräsentationsvielfalt samt Metriken Entropy und Max-gap.
- AN_Bias_Axes, AN_Harm_Types · 8WBUGXRR · Gender, Race und Stereotypisierung stammen aus zitierten Praxisquellen und dienen als illustrative Attribute; nach Regel 1 beider Felder None.
- AN_Bias_Axes, AN_Harm_Types · PAZJHB8J · Nur Race_Ethnicity und Indirect_Discrimination aus dem eigenen Argument in 4.1; Socioeconomic, Language_Culture und weitere Schadensarten stehen nur in der Liste zitierter Fälle in 4.1.1 und bleiben uncodiert.
- AN_Mitigation_Status · VVEEL68I · Das Werk nennt sein Vorgehen eine Evaluation, berichtet aber nur Rückmeldungen zur Trainingswirkung, keine geprüfte Bias-Reduktion; daher Demonstrated.
- AN_Theory_Reference · VVEEL68I · Yes über die kritische, sozialgerechtigkeitsorientierte Tradition des Participatory Design, die die Behandlung von AI-Bias und Fairness rahmt.
- Soziale_Arbeit · VVEEL68I · teilweise, weil Empfänger:innen sozialer Sicherungsleistungen und Betroffene häuslicher Gewalt als Teilnehmende einbezogen sind, ohne Bezug zur sozialarbeiterischen Praxis.
- Gender · 8WBUGXRR · nein, weil Geschlecht nur in einem zitierten Debiasing-Beispiel vorkommt.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
