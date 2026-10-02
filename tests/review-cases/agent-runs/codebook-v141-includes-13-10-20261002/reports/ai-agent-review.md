# codebook-v141-includes-13-10-20261002, AI Agent Review

- Akteur: agent, Reviewer ai-agent-review
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt des Laufs prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, beide PRISM-Tracks und Berichte, zehn Volltexte unter docs/data/fulltext/, alle Hashes gegen das Laufmanifest geprüft und alle Quellen vollständig gelesen
- Artefakt: ai-agent-review.json
- Validator: PASS AI-agent review: 10 records
- Ergebnis: agreed 1, resolved 9, blocked 0
- Verteilung: Include 8, Unclear 1, Exclude 1

## Records

| Paper-ID | Ergebnis | Entscheidung | aufgelöste Felder |
|---|---|---|---|
| 3B87U5LN | resolved | Include | KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Diversitaet nein |
| 7AMRV4DT | resolved | Exclude (Not_relevant_topic) | Identitätsstatus provisional |
| BJZYGNEE | resolved | Include | AN_Task None, Identitätsstatus verified |
| CY5IMM6G | agreed | Include | keine |
| H59BNSX8 | resolved | Include | AN_Mitigation_Status Demonstrated, Studientyp Konzept |
| I78CL6R5 | resolved | Unclear | Identitätsstatus provisional |
| MJDTRLAI | resolved | Include | AN_Bias_Axes ohne Religion, AN_Harm_Types Misrepresentation und Stereotyping, Identitätsstatus provisional |
| PQC9G5EU | resolved | Include | Identitätsstatus provisional |
| SS5HTYY6 | resolved | Include | AN_Population mit Health_Care, Identitätsstatus verified |
| VFD9ENG6 | resolved | Include | AN_Mitigation_Stage mit allen vier belegten Stufen, AN_Gender_Understanding Binary_Categorical und Intersectional, Identitätsstatus provisional |

Beide Tracks stimmen in allen zehn Entscheidungen überein. Kein Wert, den beide Tracks teilten, wurde überschrieben. Alle Belegstellen beider Tracks und die vier neu gesetzten Fundstellen sind zeichengetreu in den Quellen enthalten, was der Validator bei der Nachbildung des finalen Pakets bestätigt.

## Auflösungen

- Identitätsstatus. Die Tracks wichen bei sieben Werken zwischen verified und provisional ab. Die Auflösung folgt dem Reviewer-Prompt. Fehlt im Text das Erscheinungsjahr, liegt eine Metadatenlücke vor, die vorläufige Codierung erlaubt, daher provisional für 7AMRV4DT, I78CL6R5, MJDTRLAI, PQC9G5EU und VFD9ENG6. BJZYGNEE und SS5HTYY6 nennen Jahr, Titel und Autorschaft, die fehlende DOI ersetzt die hashgebundene Manifestversion als stabile Kennung, daher verified. Kein Titel- oder DOI-Konflikt.
- 3B87U5LN. Die Diskussion vergleicht generative mit regelbasierten Chatbots ausdrücklich (KI_Sonstige teilweise) und argumentiert, dass der Nutzen die Bevölkerung mit Unterstützungsbedarf nicht vollständig erreicht (Bias_Ungleichheit teilweise). Der nicht englischsprachige Nutzerkreis steht nur in einer Wunschliste der Teilnehmenden, daher Diversitaet nein. Die Entscheidung bleibt Include.
- BJZYGNEE, AN_Task. Rechtsberatung und Gerichtstransparenz sind Aufgaben referierter Projekte, die die Typologie illustrieren. Das Werk beschreibt keine eigene berufliche Aufgabe für KI-Nutzung, daher None.
- H59BNSX8. Die Autor:innen setzen die kritische Fallstudienpädagogik in der eigenen Lehre ein und berichten Schlussfolgerungen der Studierenden ohne Evaluationsergebnis, daher Demonstrated. Der zweite Teil entwirft ein Vorgehen mit fünf Leitfragen, daher Konzept.
- MJDTRLAI. Pastor- und Mönch-Prompts werden nur nach Gender und Race ausgezählt, kein Ergebnis vergleicht religiöse Gruppen, daher keine Achse Religion. Die ostasiatische Standarddarstellung für „Asian“ verallgemeinert eine unvollständige Darstellung auf die Gruppe, das ist Misrepresentation und nicht Erasure.
- SS5HTYY6, AN_Population. Abschnitt 3.3 behandelt Gesundheitsmonitoring, Telemedizin und virtuelle Pflege als eigenes Feld, daher Health_Care.
- VFD9ENG6. Jede der vier Mitigationsstufen hat eigene Belege, Pre_Processing über die Coverage-Anforderung an intersektionale Teilgruppen und Organisational_Process über die zweimal geforderte Beteiligung vielfältiger Stakeholder. Die eigenen Beispiele führen Geschlecht ungeprüft als Female und Male in Kombination mit Race, daher Binary_Categorical zusammen mit Intersectional.

## Markierungen für Domänenexpert:innen

- 3B87U5LN, Soziale_Arbeit ja und damit Include beruhen allein auf der Zielgruppenklausel, das Werk nennt Soziale Arbeit nicht.
- SS5HTYY6, die Referenzliste enthält Platzhalter-URLs und unplausible bibliografische Angaben zu bekannten Werken. Die Publikationstypregel ist formal erfüllt, die Belastbarkeit der synthetisierten Aussagen einschließlich der Pilotprogramme hinter Demonstrated braucht eine Integritätsprüfung.
- VFD9ENG6, die Paarung Binary_Categorical mit Intersectional hat der Pilot offen gelassen, dazu Feministisch ja für einen technischen Fairness-Survey mit Crenshaw-Rahmung.
- 7AMRV4DT, Exclude in einem Include-Batch, Bestätigung des Themenausschlusses.
- I78CL6R5, Unclear in einem Include-Batch, K-12-Rahmenwerk mit Bias, Fairness und Inklusion nur als nachgeordnetem Lerninhalt.

## Selbstprüfung

- Record-IDs entsprechen der Zuweisung: ja
- alle Unterschiede dokumentiert und quellengebunden aufgelöst: ja
- alle Includes vollständig analysiert, Paarungsregeln eingehalten: ja
- Validator bestanden: ja
- Manifest, Pakete und Tracks unverändert, keine gesperrten Pfade gelesen: ja
