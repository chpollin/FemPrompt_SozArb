# codebook-v141-includes-08-7-20261002 · ar1

- Akteur: agent
- Zuweisung: 8MDXCTA6, G53MCF3W, IDW7QSYG, J9IZDVTW, XXCDL3A3, Y8J3HI9J, ZLMLP53P
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-08-7-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, Codebuch 1.4.1
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 8MDXCTA6 | Fulltext | provisional | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Fairness (ja); AI_Literacies, Diversitaet (teilweise) | Systematischer Review, Kinder- und Jugendhilfe; kein DOI im Text |
| G53MCF3W | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet (ja); AI_Literacies, Feministisch, Fairness (teilweise) | Preprint, kein DOI im Text |
| IDW7QSYG | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja); AI_Literacies, Fairness (teilweise) | Social Opinion Mining, feministischer Theorierahmen |
| J9IZDVTW | Fulltext | verified | Unclear | AI_Literacies (ja); Bias_Ungleichheit (teilweise) | Sozialdimension erreicht nur teilweise, kein Bezug zu Sozialer Arbeit |
| XXCDL3A3 | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Feministisch, Fairness (ja); Gender, Diversitaet (teilweise) | Kritischer Review, Intersektionalität in AI Fairness |
| Y8J3HI9J | Fulltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Feministisch, Fairness (ja); Gender, Diversitaet (teilweise) | Theoretischer Beitrag, kein DOI im Text |
| ZLMLP53P | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja); Generative_KI, Fairness (teilweise) | Fallstudie Queer in AI |

## Abweichungen und Blocker

- J9IZDVTW · Entscheidung abweichend vom Laufzweck · Der Lauf codiert eingeschlossene Werke, die Quelle trägt nach den zehn Kategorien aber nur Unclear. Die Stichprobe sind Promovierende „from a socio-educational background“, mehrheitlich Bildungswissenschaften, ohne ausdrücklichen Bezug zu Sozialer Arbeit. Bias und Ungleichheit erscheinen nur als Survey-Item „Equity and fairness“ und als Ausblick auf „potential biases“ · Domänenexpertise zur Frage, ob „socio-educational“ als Bezug zur Sozialen Arbeit gilt.
- 8MDXCTA6, G53MCF3W, Y8J3HI9J · Metadatenlücke · Der Volltext nennt keinen DOI, Titel, Autor:innen und Jahr stimmen. Codierung vorläufig, kein Titel- oder DOI-Konflikt · Abgleich des DOI mit dem Korpusdatensatz.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types · 8MDXCTA6 · Allokative Disparität in Risikowerten, die der Review nicht als direkt oder indirekt einordnet. Codiert als Indirect_Discrimination über den eigenen Befund zu Daten aus Überwachung marginalisierter Familien, also Vorkontakt mit Hilfesystemen als Proxy.
- AN_Mitigation_Stage · 8MDXCTA6 · Getrennte Modelle für Māori-Kinder als In_Training gewertet. Evaluated nur über die synthetisierte Evaluation mit negativem Ergebnis.
- AN_Bias_Axes · IDW7QSYG · Intersectional, weil H4 die Konvergenz von Gender und Race testet und der Befund mit der matrix of domination gedeutet wird. Grenzfall, weil gemeinsames Vorkommen im Diskurs gemessen wird und kein von der Kombination abhängiges Bias-Ergebnis.
- AN_Gender_Understanding · IDW7QSYG · Binary_Categorical mit Intersectional. Die Analyse klassifiziert binär über gender-guesser und Pronomen, die Aussage „gender as a narrow social construct“ steht nur in AN_Gender_Definition und AN_Notes. Die Paarung Binary_Categorical mit Intersectional ist laut Pilotbericht noch offen.
- AN_Harm_Types · IDW7QSYG · None, weil Schadensmechanismen nur im zitierten Theorieteil stehen und das eigene Ergebnis Diskursmerkmale betrifft.
- AN_Bias_Axes · G53MCF3W, ZLMLP53P · Gender und Sexual_Orientation_Identity gemeinsam, weil nicht-binäre und trans Personen als eigene Kategorien geführt werden und das Werk die Achse zugleich als gender benennt.
- AN_Harm_Types · G53MCF3W · Unterschiede im Ton zwischen den Gruppen sind nach 1.4.1 nicht als Disparate_Performance codiert.
- AN_Mitigation_Stage · XXCDL3A3 · Das Pipeline-Tagging (pre-, in-, post-processing) als Inventar, das die Synthese strukturiert, codiert. Status Proposed, weil der Review Engagement mit Intersektionalität und nicht die Wirksamkeit der Maßnahmen bewertet.
- AN_Harm_Types · Y8J3HI9J · Die Stufenanalyse in Abschnitt 3.2 wird als eigenes Argument gewertet, das zitierte Fälle ausführt. Die Repräsentationsbeispiele in 4.1 bleiben als bloß illustrierende Zitate uncodiert.
- AN_Mitigation_Status · Y8J3HI9J · Evaluated nur über die synthetisierte Studie von Pierson et al. (Labelwahl, diverser Datensatz).
- AN_Mitigation_Status · ZLMLP53P · Evaluated für organisatorische Maßnahmen gegen Ausschluss aus der AI-Forschung (Stipendien, Workshops, Konferenzleitfaden) mit berichteten Befragungsergebnissen und Adoptionsstand. Es handelt sich nicht um technische Bias-Mitigation, Demonstrated wäre die vorsichtigere Lesart.
- AN_Task · Y8J3HI9J · Klinische Diagnose und Bedarfsschätzung als Other_Task, weil die Aufgabe außerhalb der Sozialen Arbeit liegt.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
