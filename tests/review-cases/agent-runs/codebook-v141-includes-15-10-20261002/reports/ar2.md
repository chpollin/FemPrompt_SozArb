# codebook-v141-includes-15-10-20261002 · ar2

- Akteur: agent
- Zuweisung: 7W3RGSSG, ACDF4FL9, DZ39L7GC, EXVG7MQR, H7E3N6VR, LBLF9BCW, MT54YHER, ST9UCTJE, YRBP6IEJ, Z9BIKVS3
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-15-10-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/ laut Manifest, SHA-256 aller zehn Quellen vor dem Lesen gegen das Manifest geprüft, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 8 · Unclear 1 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 7W3RGSSG | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender teilweise, Fairness teilweise | keine DOI und kein Jahr im Text, titelgleich mit ACDF4FL9 |
| ACDF4FL9 | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender teilweise, Fairness teilweise | erweiterte Fassung mit Debiasing-Prompts |
| DZ39L7GC | Fulltext | provisional | Unclear | AI_Literacies ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise | Sozialdimension nur über ein Modul zu Data Bias |
| EXVG7MQR | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies, Generative_KI, Bias_Ungleichheit, Diversitaet, Fairness je teilweise | DOI 10.55521/10-020-205 |
| H7E3N6VR | Fulltext | provisional | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet teilweise, Feministisch teilweise | deutschsprachig, keine DOI und kein Jahr |
| LBLF9BCW | Fulltext | provisional | Exclude (Not_relevant_topic) | Generative_KI ja, Prompting ja | Titelvariante, keine Sozialdimension |
| MT54YHER | Fulltext | provisional | Include | AI_Literacies ja, Bias_Ungleichheit ja, Generative_KI, KI_Sonstige, Diversitaet, Fairness je teilweise | Konvertierungsartefakte im Titel |
| ST9UCTJE | Fulltext | provisional | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Fairness ja | keine DOI und kein Jahr |
| YRBP6IEJ | Fulltext | verified | Include | AI_Literacies ja, Generative_KI ja, Prompting ja, Soziale_Arbeit ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise | DOI 10.1080/10437797.2024.2340931 |
| Z9BIKVS3 | Fulltext | provisional | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Feministisch ja, Gender teilweise | CIGI Working Paper, als belegter Policy-Report zulässig |

## Abweichungen und Blocker

- LBLF9BCW · Titelvariante · Korpustitel endet auf „Large Language Model Outputs“, der Volltext auf „Large Language Model Ensembles in Reasoning tasks“. Name DIPPER, Gegenstand und Titelanfang stimmen überein, daher als Fassungsvariante vorläufig codiert und nicht gesperrt · Entscheidung, ob die Abweichung als Titelkonflikt gilt. Die Entscheidung Exclude hängt nicht davon ab.
- 7W3RGSSG und ACDF4FL9 · möglicher Werkdoppel · gleicher Titel und gleiche Autoren, getrennte Work-IDs, ACDF4FL9 ist eine erweiterte Fassung mit Debiasing-Experiment · Prüfung der Work-Version-Bindung.
- DZ39L7GC · Entscheidung Unclear in einem Lauf über Includes · die Sozialdimension erreicht nur teilweise (ein Curriculumsmodul zu Data Bias, sonst allgemeine Social-Impact-Diskussion) · Klärung durch die Domänenexpert:innen.
- Sieben Records sind provisional, weil der Volltext keine DOI oder stabile Kennung nennt. Titel und Autor:innen stimmen jeweils überein, Quellhashes entsprechen dem Manifest.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types · EXVG7MQR · algorithmischer Bias in der Klient:innenbeurteilung wird nur als Risiko aus nicht repräsentativen Daten mit Zitatbeleg benannt, kein Mechanismus für den eigenen Gegenstand, daher None statt einer nicht klassifizierten allokativen Disparität.
- AN_Harm_Types · H7E3N6VR · Exclusionary_Norms stützt sich auf die im Beitrag berichtete eigene Fokusgruppenstudie der Autorinnen (Mehrheitssprachensystem, Autokorrektur von Namen), die als eigenes Ergebnis gewertet wurde. Indirect_Discrimination stützt sich auf die eigene Übersicht Tab. 1 und das ausgeführte Proxy-Beispiel.
- Feministisch · H7E3N6VR · ein expliziter Satz und eine Tabellenzeile zu intersektionaler Diskriminierung ohne eigene Machtanalyse, als teilweise gewertet.
- AN_Bias_Axes · 7W3RGSSG, ACDF4FL9 · beauty als Physical_Appearance, profession, beauty in profession und institutional ohne Achse, weil keine soziale Benachteiligungsachse bestimmt ist.
- AN_Bias_Axes · Z9BIKVS3 · Achsen aus Beispielen des eigenen Arguments (einkommensschwache Familie, ländliche und indigene Gemeinschaften), Wohnort als Other_Axis. Intersectional nicht codiert, obwohl Intersektionalität der Rahmen ist, weil keine Passage ein von der Kombination abhängiges Ergebnis zeigt.
- AN_Gender_Understanding · Z9BIKVS3 · Social_Construct gestützt auf den übernommenen Rahmen McPhails („gendered systems of oppression“). Ob dieser übernommene Satz die 1.4.1-Schwelle einer ausdrücklichen Aussage erfüllt, ist ein Grenzfall.
- AN_Theory_Reference · ST9UCTJE · counterfactual fairness nach Kusner et al. als theoretisches Konzept gewertet, das die Behandlung von Bias rahmt, nicht nur als technisches Kriterium.
- AN_Theory_Reference · H7E3N6VR · digitale Ungleichheit und Kompetenzdimensionen rahmen Zielgruppen und Kompetenz, nicht Bias, daher No.
- AN_Mitigation_Stage · MT54YHER · die evaluierte Lernintervention ist keine Maßnahme gegen Bias in einem System, daher None.
- AN_Task · ST9UCTJE · Inhaltsmoderation durch Toxizitätsklassifikation als Other_Task. YRBP6IEJ · Policy-Analyse und Advocacy als Other_Task.
- Gender · YRBP6IEJ · Gender-Bias erscheint nur in zitierten Beispielen und einer Aufzählung, daher nein und Gender_Definition Not_Applicable.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
