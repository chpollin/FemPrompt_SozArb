# codebook-v141-includes-05-6-20261002 · ar2

- Akteur: agent
- Zuweisung: 3XMBE43Z, 6L6WSDC8, HLBXNWAZ, JZN2I6J5, P82X89Q4, YMABYPKF (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-05-6-20261002/ar2/ar2-coding.json (femprompt-prisma-coding-packet/0.2, Codebuch 1.4.1)
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller sechs Quellen gegen das Laufmanifest geprüft und übereinstimmend, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 5 · Unclear 0 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 3XMBE43Z | Fulltext | verified | Include | Generative_KI ja, Prompting teilweise, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, Fairness teilweise | Experiment mit Policy-Prompts an ChatGPT und Copilot, nicht-binäre Varianten als eigene Kategorie, feministische Theorierahmung |
| 6L6WSDC8 | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit teilweise, Diversitaet ja, Fairness teilweise | Jahr, Venue und DOI fehlen im Text; Include trägt allein Diversitaet als Perspektivendiversität |
| HLBXNWAZ | Fulltext | verified | Include | AI_Literacies teilweise, Generative_KI ja, Prompting teilweise, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja | Intersektionale visuelle Analyse von Stable Diffusion XL |
| JZN2I6J5 | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender ja, Fairness ja | Jahr, Venue und DOI fehlen im Text; Encoder-Modelle, die das Werk als LLM rahmt |
| P82X89Q4 | Fulltext | verified | Exclude (Not_relevant_topic) | AI_Literacies ja | Soziale Dimension vollständig nein, siehe Abweichungen |
| YMABYPKF | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender ja, Fairness ja | Namensbasierter Audit, Preprint ohne DOI |

## Abweichungen und Blocker

- P82X89Q4 · Entscheidungsabweichung zur Batchbezeichnung · Der Lauf ist als Include-Batch angelegt, die Quellencodierung ergibt Exclude. Das Werk entwickelt ein AI-Literacy-Kompetenzrahmenwerk aus einem systematischen Review. Bias erscheint nur im Nebensatz „identify biases“ zur Modellinterpretierbarkeit, Fairness nur als referierte Aussage von OECD und UNICEF, Soziale Arbeit wird nicht adressiert. Nach der Regel „nein gilt für fehlende oder beiläufige Behandlung“ bleibt die soziale Dimension vollständig auf nein. · Domain-Expert:innen prüfen, ob die Ethik-Kompetenz oder der Satz zu Bias ein „teilweise“ in Bias_Ungleichheit trägt, was die Entscheidung auf Unclear verschieben würde.
- 6L6WSDC8 · Identität vorläufig · Erschließbar sind nur Titel und zwei Autor:innen, Jahr, Venue und DOI stehen nicht im konvertierten Text. Es besteht kein Titelkonflikt. · Bibliografische Metadaten am Work-Datensatz ergänzen.
- JZN2I6J5 · Identität vorläufig · Titel und Autor:innen stimmen überein, Jahr, Venue und DOI fehlen im Text. Es besteht kein Titelkonflikt. · Bibliografische Metadaten am Work-Datensatz ergänzen.
- Keine Blocker. Regelquellen, Laufmanifest und Quellen waren lesbar und widerspruchsfrei. Der Abschnitt „Eligibility“ in knowledge/update-protocol.md nennt Version 1.4 als Vokabularquelle, das Laufmanifest Codebuch 1.4.1. Da 1.4.1 laut Changelog keine Eligibility-Regel ändert, liegt darin kein Widerspruch.

## Codierregeln mit Auslegungsbedarf

- Diversitaet · 6L6WSDC8 · Gegenstand ist Perspektivendiversität von Meinungen, nicht die Repräsentation sozialer Gruppen. Codiert ist ja, weil das Werk diese Diversität ausdrücklich mit übersehenen Minderheitenperspektiven verbindet. Bei strenger Lesung als methodische Diversität fiele das Werk auf Unclear oder Exclude.
- AN_Mitigation_Stage · 6L6WSDC8 · Criteria-based prompting gegen eine einzelne dominante Meinung ist als Prompt_Practice mit Status Evaluated codiert. Der adressierte Bias betrifft eine dominante Sichtweise, keine soziale Gruppe.
- AN_Mitigation_Stage · JZN2I6J5 · Soft-Prompt-Tuning mit eingefrorenen Gewichten ist als Intra_Processing (Eingriff zur Inferenz, so verortet das Werk sich selbst) und Prompt_Practice codiert. Eine Lesung als In_Training über das Training der Prompt-Parameter wäre ebenfalls vertretbar.
- AN_Prompt_Techniques · JZN2I6J5, 3XMBE43Z, YMABYPKF · Soft-Prompt-Tuning, die Rollenrahmung der Policy-Prompts („If you were the city mayor“) und numerische Anker gehören zu keiner Technikfamilie oder werden nicht als Technik beschrieben, daher None.
- AN_Bias_Axes und AN_Gender_Understanding · YMABYPKF · Intersectional ist nach der Feldregel codiert (schlechteste Ergebnisse für Namen, die als Schwarz und weiblich wahrgenommen werden), obwohl die Autor:innen ausdrücklich keine intersektionale Auswertung beanspruchen. Gepaart mit Binary_Categorical, eine Kombination, die der Pilot als offen vermerkt hat.
- AN_Theory_Reference · YMABYPKF · Die Rechtsdoktrin von disparate treatment und disparate impact ist als rahmendes theoretisches Konzept gewertet. Wird eine Rechtsdoktrin nicht als Theorie anerkannt, wäre No zu setzen.
- AN_Gender_Definition · HLBXNWAZ · Explicit stützt sich auf Fußnote 2, die „man“ und „woman“ durch heteronormative feminine und maskuline Repräsentationen ersetzt, um die binäre Norm nicht zu reproduzieren. Das ist eine Begriffsbestimmung des Werks, keine Definition von Geschlecht im engeren Sinn.
- AN_Gender_Understanding · 3XMBE43Z · Social_Construct stützt sich auf die in der eigenen Analyse angewandte Aussage nach Connell, Geschlechterverhältnisse seien institutionell in Alltagspraktiken eingebettet. Non_Binary_Inclusive folgt aus den nicht-binären Promptvarianten, die als eigene Kategorie ausgewertet werden.
- Generative_KI · JZN2I6J5 · Die Experimente nutzen Encoder-only-Modelle (BERT, RoBERTa), das Werk rahmt sie als Large Language Models. Codiert ist ja nach der Kategoriedefinition, die LLMs nennt.
- AN_Task · HLBXNWAZ · None, weil das Werk Standardausgaben ohne berufliche Anwendungsaufgabe prüft. Kreative Gestaltungsarbeit ist nur Kontext.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
