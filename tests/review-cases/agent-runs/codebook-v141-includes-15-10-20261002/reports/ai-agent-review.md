# codebook-v141-includes-15-10-20261002, AI Agent Review

- Akteur: agent, Rolle ai-agent-review
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt der Tracks prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, die PRISM-Tracks ar1.json und ar2.json, die Berichte beider Tracks und die zehn zugewiesenen Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen. Alle Quell- und Pakethashes entsprechen dem Manifest.
- Artefakt: ai-agent-review.json
- Validator: `PASS AI-agent review: 10 records`
- Ergebnis: 1 agreed, 9 resolved, 0 blocked
- Verteilung: Include 8, Unclear 1, Exclude 1

## Records

| Paper-ID | Ergebnis | Entscheidung | Identität | Aufgelöste Unterschiede |
|---|---|---|---|---|
| 7W3RGSSG | resolved | Include | provisional | Fairness, Identitätsstatus |
| ACDF4FL9 | resolved | Include | provisional | Fairness, Identitätsstatus |
| DZ39L7GC | resolved | Unclear | provisional | KI_Sonstige, Identitätsstatus |
| EXVG7MQR | resolved | Include | verified | Fairness, AN_Harm_Types, AN_Task |
| H7E3N6VR | resolved | Include | provisional | Feministisch, Studientyp, Identitätsstatus |
| LBLF9BCW | agreed | Exclude (Not_relevant_topic) | provisional | keine |
| MT54YHER | resolved | Include | provisional | Identitätsstatus |
| ST9UCTJE | resolved | Include | provisional | AN_Bias_Axes, Identitätsstatus |
| YRBP6IEJ | resolved | Include | verified | AN_Task |
| Z9BIKVS3 | resolved | Include | provisional | Generative_KI, AN_Bias_Axes, AN_Gender_Definition, AN_Gender_Understanding, AN_Bias_Definition, Identitätsstatus |

Beide Tracks leiten dieselben Entscheidungen ab. Keine Abweichung verschiebt eine Entscheidung. Alle Belegstellen beider Pakete sind zeichengetreu in den Quellen enthalten, was der Validator für die finalen Records erneut prüft.

## Titelabweichung LBLF9BCW

Der Korpustitel endet auf „Large Language Model Outputs“, der Text auf „Large Language Model Ensembles in Reasoning tasks“. Ein sperrender Titelkonflikt liegt nicht vor. Der unterscheidende Haupttitel einschließlich des Methodennamens DIPPER ist identisch, der Text behandelt genau dieses Verfahren, und es gibt weder eine konkurrierende DOI noch einen abweichenden Autor:innennachweis noch einen Hinweis auf ein anderes Werk. Die Abweichung ist eine Titelvariante derselben Arbeit und bleibt mit vorläufigem Identitätsstatus dokumentiert. Die Korpusmetadaten sollten auf den Texttitel geprüft werden. Die Entscheidung Exclude hängt davon nicht ab, weil das Werk keine Sozialdimension behandelt.

## Wesentliche Auflösungen

- Identitätsstatus bei sieben Werken provisional. ar1 setzte verified trotz fehlender DOI oder stabiler Kennung. Nach Arbeitsschritt 1 des Reviewer-Prompts begründet eine solche Metadatenlücke eine vorläufige Codierung.
- Fairness bei 7W3RGSSG und ACDF4FL9 nein. Die einzige Stelle ist ein motivierender Einleitungssatz, gemessen wird nur die Rate stereotyper Antworten.
- Fairness bei EXVG7MQR teilweise. Das Werk hat einen eigenen Abschnitt zu algorithmic bias and unfairness und schlägt eine faire Datenbehandlung als Gestaltungsprinzip vor.
- AN_Harm_Types bei EXVG7MQR nicht entscheidbar statt None. Das Werk argumentiert selbst eine verzerrte Beurteilung von Klient:innen, klassifiziert sie aber nicht als unmittelbare oder mittelbare Diskriminierung, und Codebuch 1.4.1 regelt diesen Fall nicht.
- AN_Task bei EXVG7MQR und YRBP6IEJ jeweils der umfassendere Wert von ar2, weil jeder zusätzliche Wert eine eigene beschreibende Passage im Werk hat (KI-Trainingssimulator, Materialien für Sitzungen und Übersetzungen, Policy-Analyse und Advocacy als Other_Task).
- KI_Sonstige bei DZ39L7GC ja, weil klassische KI- und ML-Inhalte der zentrale Lehrgegenstand des Curriculums sind.
- Feministisch bei H7E3N6VR nein, weil intersektionale Diskriminierung nur benannt und nicht als Machtanalyse entwickelt wird. Studientyp Konzept wegen des eigenen Kompetenzmodells und der eigenen Übersicht.
- Race_Ethnicity bei ST9UCTJE nicht codiert, weil Race nur in einer Aufzählung, einem illustrierenden Substitutionsbeispiel und im Ausblick erscheint.
- Bei Z9BIKVS3 Generative_KI nein (ein illustrierendes Claude-Beispiel), Achsen Socioeconomic, Race_Ethnicity und Other_Axis aus demselben Beispielsatz des eigenen Befunds, AN_Bias_Definition Implicit_Only, weil die Crenshaw-Passage Intersektionalität und nicht Bias bestimmt, und AN_Gender_Understanding Unclear mit Absent, weil die McPhail-Passage keine eigene Aussage darüber ist, was Geschlecht ist, wie 1.4.1 sie für Social_Construct verlangt.

## Markierung für Domänenexpert:innen

- Z9BIKVS3, Schwelle Social_Construct nach 1.4.1, die Tracks lagen auf beiden Seiten.
- EXVG7MQR, AN_Harm_Types nicht entscheidbar wegen der ungeregelten nicht klassifizierten allokativen Benachteiligung.
- DZ39L7GC, quellenbasierte Entscheidung Unclear in einem Lauf über eingeschlossene Werke.
- LBLF9BCW, quellenbasierte Entscheidung Exclude in einem Lauf über eingeschlossene Werke, dazu die Titelvariante in den Korpusmetadaten.
- 7W3RGSSG und ACDF4FL9, zwei titel- und autorengleiche Fassungen an getrennten Works, die Zählung in der Synthese ist zu klären.

## Autoritätsgrenze

Die Übereinstimmung der beiden Tracks ist eine Prozessdiagnose, beide liefen auf demselben Modell. Der Review begründet höchstens den internen Status ai-agent-reviewed nach einer Integrationsentscheidung. Fachliche Verifikation und Publikationsfreigabe bleiben bei den Domänenexpert:innen.
