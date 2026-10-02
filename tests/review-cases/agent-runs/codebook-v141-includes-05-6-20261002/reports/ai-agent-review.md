# codebook-v141-includes-05-6-20261002, AI Agent Review

- Akteur: agent, Rolle ai-agent-review, an keinem Track beteiligt
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch 1.4.1, Reviewer-Prompt der Tracks prism-agent-reviewer-v1.4
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, beide Hashes gegen das Manifest geprüft, beide Pakete bestehen den Coding-Paket-Validator
- Quellenbasis: sechs zugewiesene Volltexte unter docs/data/fulltext/, Hashes gleich dem Manifest, jede Quelle vollständig gelesen, Anhänge mit Promptbeispielen und Ergebnistabellen durchgesehen
- Ausgabe: ai-agent-review.json, Validator `PASS AI-agent review: 6 records`
- Ergebnis: 0 agreed, 6 resolved, 0 blocked
- Entscheidungen: Include 4, Unclear 1, Exclude 1

## Records

| Paper-ID | Identität | Entscheidung | Aufgelöste Unterschiede |
|---|---|---|---|
| 3XMBE43Z | verified | Include | Prompting, AN_Prompting_Role, AN_Prompt_Techniques, AN_Bias_Axes |
| 6L6WSDC8 | provisional | Unclear | Diversitaet, Fairness, Entscheidung, Analyse entfällt |
| HLBXNWAZ | verified | Include | AN_Prompt_Techniques, AN_Task |
| JZN2I6J5 | provisional | Include | Generative_KI, AN_Mitigation_Stage |
| P82X89Q4 | verified | Exclude (Not_relevant_topic) | Generative_KI |
| YMABYPKF | verified | Include | AN_Prompting_Role, AN_Prompt_Techniques, AN_Harm_Types |

Die vorläufige Identität von 6L6WSDC8 und JZN2I6J5 beruht auf fehlendem Jahr, Venue und DOI im konvertierten Text. Titel und Autor:innen stimmen, ein Konflikt besteht nicht. Alle Publikationstypen sind zulässig (wissenschaftliche Artikel, ACL-Konferenzbeiträge, ein systematischer Review, ein wissenschaftlicher Preprint).

## Auflösungen

### 3XMBE43Z

- Prompting ja statt teilweise, weil die Promptformulierung die einzige unabhängige Variable des Experiments ist und der Kernbefund die Promptgestaltung betrifft.
- AN_Prompting_Role um Recommended_Practice ergänzt und AN_Prompt_Techniques General_Guidance, weil das Werk präzise, inklusive Promptsprache empfiehlt und beide Tracks Prompt_Practice als Maßnahme codieren.
- AN_Bias_Axes Gender und Sexual_Orientation_Identity, weil nicht-binäre Beschäftigte in zwei Szenarien eine eigene ausgewertete Vergleichsgruppe sind und das Codebuch Geschlechtsidentität dieser Achse zuordnet.

### 6L6WSDC8

- Diversitaet teilweise statt ja, weil das Werk Perspektivendiversität von Meinungen misst und keine soziale Gruppe analysiert. Der Bezug auf übersehene Minderheitenperspektiven steht nur im Abschnitt Related Work.
- Fairness nein statt teilweise, weil der einzige Fairnessbezug eine Selbstverortung ohne Kriterium oder Metrik ist.
- Entscheidung Unclear statt Include, da keine Sozialkategorie ja erreicht. Die Include-Analyse von ar2 entfällt.

### HLBXNWAZ

- AN_Prompt_Techniques General_Guidance, weil die Diskussion Nutzer:innen rät, bewusster zu wählen, welche Prompts sie verwenden, und beide Tracks dazu Recommended_Practice codieren.
- AN_Task None statt Other_Task, weil die minimalen Prompts ausdrücklich alltägliche Internetnutzer:innen simulieren und keine berufliche Anwendungsaufgabe erprobt wird. Die Achsenliste beider Tracks ist identisch, nur die Reihenfolge weicht ab.

### JZN2I6J5

- Generative_KI teilweise statt ja, weil Methode und Experimente ausdrücklich Encoder-Modelle ohne Generierung betreffen. Prompting trägt die Technikdimension.
- AN_Mitigation_Stage Intra_Processing und Prompt_Practice statt In_Training, weil das Werk den Eingriff selbst bei der Inferenz verortet und die Modellgewichte eingefroren bleiben.

### P82X89Q4

- Generative_KI nein statt teilweise, weil generative KI nur in einem Beispielsatz erscheint. Die Sozialdimension bleibt vollständig nein, Exclude mit Not_relevant_topic.

### YMABYPKF

- AN_Prompting_Role um Recommended_Practice ergänzt und AN_Prompt_Techniques General_Guidance, weil das Werk den numerischen Anker im Prompt ausdrücklich als Mittel gegen die Verzerrungen ausweist.
- AN_Harm_Types nur Indirect_Discrimination, weil das Werk numerische Ratschläge über Personen misst, also allokative Entscheidungen, und die Stereotype als vermutete Ursache nennt, nicht als Ausgabe über eine Gruppe.

## Für Domänenexpert:innen markiert

- 6L6WSDC8, Entscheidung Unclear in einem Include-Batch. Zu klären ist, ob Perspektivendiversität von Meinungen mit Verweis auf Minderheitenperspektiven als Diversitaet ja gilt.
- P82X89Q4, Entscheidung Exclude in einem Include-Batch. Zu klären ist, ob die allgemeine Ethikkompetenz oder der Nebensatz zu Bias ein Bias_Ungleichheit teilweise trägt, was Unclear ergäbe.
- YMABYPKF, AN_Theory_Reference Yes über die Rechtsdoktrin von disparate treatment und disparate impact sowie AN_Harm_Types ohne Stereotyping. Beide Grenzfälle betreffen Feldregeln, die der Pilotlauf als offen vermerkt hat.

## Grenzfälle ohne Trackdifferenz

- 3XMBE43Z, AN_Gender_Understanding Social_Construct stützt sich auf den angewandten Connell-Satz, das Werk nutzt zugleich biologische Stoffwechselunterschiede als Prämisse.
- HLBXNWAZ, AN_Gender_Definition Explicit stützt sich auf Fußnote 2, die die binäre Gendernorm bestimmt und eine Terminologie festlegt.
- YMABYPKF, Intersectional in AN_Bias_Axes und AN_Gender_Understanding folgt der Feldregel, obwohl die Autor:innen ausdrücklich keine Intersektionalitätsanalyse beanspruchen.

## Selbstprüfung

- Record-IDs gleich der Zuweisung: ja
- alle Kategorienbelege und analysis_evidence-Stellen zeichengetreu in der Quelle: ja, mechanisch durch den Validator und beim Lesen geprüft
- alle Includes vollständig analysiert, Paarungsregeln eingehalten: ja
- kein Wert überschrieben, den beide Tracks teilten: ja
- Validator bestanden: ja
