# codebook-v141-includes-15-10-20261002 · ar1

- Akteur: agent
- Zuweisung: 7W3RGSSG, ACDF4FL9, DZ39L7GC, EXVG7MQR, H7E3N6VR, LBLF9BCW, MT54YHER, ST9UCTJE, YRBP6IEJ, Z9BIKVS3
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-15-10-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, Codebuch 1.4.1, Prompt 1.4
- Ergebnis: bestanden
- Verteilung: Include 8 · Unclear 1 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 7W3RGSSG | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender teilweise | Fassung ohne Debiasing-Experiment |
| ACDF4FL9 | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender teilweise | Fassung mit Debiasing-Experiment, gleicher Titel wie 7W3RGSSG |
| DZ39L7GC | Fulltext | verified | Unclear | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit teilweise | Sozialdimension nur über ein Modul zu Data Bias |
| EXVG7MQR | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies, Generative_KI, Bias_Ungleichheit, Diversitaet teilweise | AN_Harm_Types nicht entscheidbar |
| H7E3N6VR | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet teilweise | deutscher Sammelbandbeitrag, Publikationstyp zulässig |
| LBLF9BCW | Fulltext | provisional | Exclude (Not_relevant_topic) | Generative_KI ja, Prompting ja | Titelvariante, keine Sozialdimension |
| MT54YHER | Fulltext | verified | Include | AI_Literacies ja, Bias_Ungleichheit ja, Generative_KI, KI_Sonstige, Diversitaet, Fairness teilweise | Bias als Lerninhalt |
| ST9UCTJE | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Fairness ja | Toxizitätsklassifikation |
| YRBP6IEJ | Fulltext | verified | Include | AI_Literacies ja, Generative_KI ja, Prompting ja, Soziale_Arbeit ja, KI_Sonstige, Bias_Ungleichheit teilweise | Curriculumvorschlag |
| Z9BIKVS3 | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Feministisch ja, Generative_KI, Gender teilweise | CIGI Working Paper, Publikationstyp zulässig |

## Abweichungen und Blocker

- LBLF9BCW · Identität · Texttitel endet auf „Ensembles in Reasoning tasks“, Korpustitel auf „Outputs“, Kurztitel, Methode und Autorengruppe stimmen überein, keine DOI im Text · Klärung, ob die Abweichung als Titelvariante derselben Work gilt. Die Entscheidung Exclude hängt nicht davon ab, weil das Werk keine Sozialdimension behandelt.
- DZ39L7GC · Entscheidung · der Lauf codiert Includes, der Quelltext trägt aber nur Unclear, da Bias nur als ein Modulthema auftritt und Soziale Arbeit, Gender und Diversität fehlen · Abgleich mit der Expert:innen-Entscheidung durch die AI Agent Review oder die Domänenexpert:innen.
- LBLF9BCW · Entscheidung · ebenfalls kein Include aus dem Quelltext, „Diversity“ bezeichnet methodische Prompt-Diversität · wie oben.
- 7W3RGSSG und ACDF4FL9 · Work-Bindung · zwei Fassungen desselben Titels mit gleicher Autorschaft, die zweite ergänzt das Debiasing-Experiment, das Manifest bindet sie an getrennte Works · Klärung, ob sie in der Synthese getrennt gezählt werden sollen.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types · EXVG7MQR · allokative Benachteiligung von Klient:innen durch nicht repräsentative Daten, ohne Einordnung als unmittelbare oder mittelbare Diskriminierung, als nicht entscheidbar vermerkt. Der Punkt entspricht der im Pilotlauf offenen Frage zu nicht klassifizierten allokativen Disparitäten.
- AN_Harm_Types · Z9BIKVS3 · das Wohlfahrtsbeispiel bleibt aus demselben Grund ohne Diskriminierungscode, codiert ist nur Exclusionary_Norms.
- AN_Theory_Reference · ST9UCTJE · Counterfactual Fairness aus der kausalen Inferenz als rahmendes theoretisches Konzept gewertet. Ob ein technisches Fairnesskriterium als Theorie zählt, regelt das Codebuch nicht ausdrücklich.
- AN_Theory_Reference · 7W3RGSSG, ACDF4FL9 · die Dual-Process-Theorie rahmt die Entstehung sozialer Bias im Modell und gilt daher als Theoriebezug, obwohl sie keine Gender- oder Bias-Theorie im engeren Sinn ist.
- AN_Bias_Axes · 7W3RGSSG, ACDF4FL9 · Beruf, Beauty in Profession und Institution sind gemessene Kategorien, aber keine Achsen sozialer Benachteiligung, daher uncodiert, Beauty als Physical_Appearance.
- AN_Gender_Understanding · Z9BIKVS3 · feministischer und intersektionaler Rahmen ohne ausdrückliche Aussage zur sozialen Herstellung von Geschlecht und ohne kombinationsabhängiges Ergebnis, daher Unclear mit Absent.
- AN_Mitigation_Stage · MT54YHER · Gegenstrategien sind Lerninhalt eines evaluierten Literacy-Trainings, das Werk evaluiert aber keine Maßnahme gegen Bias, daher None.
- Soziale_Arbeit · H7E3N6VR · Medienpädagogik mit digital benachteiligten Gruppen ohne Bezug auf Praxis, Theorie oder Ausbildung der Sozialen Arbeit als nein gewertet.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
