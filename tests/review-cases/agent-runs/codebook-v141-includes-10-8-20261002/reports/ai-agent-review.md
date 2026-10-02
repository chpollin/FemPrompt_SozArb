# codebook-v141-includes-10-8-20261002, AI Agent Review

- Akteur: agent (ai-agent-review), Claude Code subagent, Modell claude-opus-5-5
- Prompt: prompts/prism-ai-agent-review-v0.4.md (Version 0.4), Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt der Tracks prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, PRISM-Tracks und Berichte beider Tracks, acht Volltexte unter docs/data/fulltext/, alle Hashes gegen das Manifest geprüft und übereinstimmend
- Ausgabe: ai-agent-review.json, Validator `PASS AI-agent review: 8 records`
- Ergebnis: 1 agreed, 7 resolved, 0 blocked
- Entscheidungen: Include 6, Unclear 2, Exclude 0

Alle Volltexte wurden vollständig gelesen, alle Belegstellen beider Tracks stimmen zeichengetreu mit den Quellen überein. Kein Identitäts-, Quellen- oder Publikationstypkonflikt. Bei 3AHQEHDF, 3AQ2K3BX und QY6P4RGQ fehlen DOI und Jahr im konvertierten Text, Titel und Autor:innen stimmen, der Status bleibt provisional. Kein Wert, den beide Tracks teilten, wurde überschrieben.

## Records

| Paper-ID | Ergebnis | Entscheidung | Aufgelöste Felder |
|---|---|---|---|
| 22KJL3PC | resolved | Include | Diversitaet |
| 3AHQEHDF | resolved | Include | AN_Harm_Types |
| 3AQ2K3BX | agreed | Unclear | keine |
| 6L85PRUW | resolved | Include | AN_Gender_Definition, AN_Gender_Understanding |
| 7L93JBLR | resolved | Include | AN_Harm_Types, AN_Gender_Definition |
| ERTJZW5M | resolved | Unclear | AI_Literacies |
| K3YCLBXK | resolved | Include | AN_Bias_Axes, AN_Harm_Types, AN_Population, AN_Gender_Definition, AN_Gender_Understanding |
| QY6P4RGQ | resolved | Include | Prompting, AN_Prompting_Role, AN_Theory_Reference |

## Auflösungen

- 22KJL3PC, Diversitaet teilweise. Das Werk behandelt die Wahrnehmung von Personen aus 20 Ländern und einen respektvollen interkulturellen Umgang als nachgeordneten Aspekt.
- 3AHQEHDF, AN_Harm_Types Exclusionary_Norms und Erasure. Das eigene Experiment zeigt neben dem US-amerikanischen Default das systematische Übergehen unterrepräsentierter kultureller Gruppen, je mit eigener Passage.
- 6L85PRUW, AN_Gender_Definition Absent und AN_Gender_Understanding Unclear. Mann und Frau erscheinen nur als einzelne Bildbeschreibungen, das eigene Ziel nennt offen "a range of ... genders", eine binäre Setzung ist nicht erkennbar.
- 7L93JBLR, AN_Harm_Types ergänzt um Indirect_Discrimination. Die SyRI-Analyse ist die eigene feministische und intersektionale Fallanalyse des Werks und zeigt eine Entscheidung über Personen, die über historische Daten und Einkommen benachteiligt.
- 7L93JBLR, AN_Gender_Definition Implicit_Only. Die angeführten Passagen setzen ein sozial konstruiertes und plurales Verständnis voraus, bestimmen Geschlecht aber in keinem eigenen Satz.
- ERTJZW5M, AI_Literacies teilweise. Training ist eines von acht Vertrauensthemen und dient der Vertrauensbildung, nicht der Forschungsfrage selbst. Die Entscheidung Unclear bleibt.
- K3YCLBXK, AN_Bias_Axes None und AN_Harm_Types None. Achsen und Schäden stammen aus zitierter Literatur oder aus dem nicht ausgeführten Arztbild-Satz, Anker VSZM7CT6 und die Regel 1.4.1 schließen beide aus.
- K3YCLBXK, AN_Population Education_Professional und Not_SW_Specific. Strategie 3 adressiert ausdrücklich die berufliche Fortbildung von Lehrkräften zu KI-Kompetenz.
- K3YCLBXK, AN_Gender_Definition Implicit_Only und AN_Gender_Understanding Binary_Categorical. Die eigene Gerechtigkeitsargumentation stellt nur "females" und "white males" gegenüber.
- QY6P4RGQ, Prompting teilweise und AN_Prompting_Role Research_Instrument. Die handgeschriebenen Kontexte, Formate und Reihenfolgen sind gezielt gestaltete Eingaben, die Modellverhalten als Bias-Test hervorrufen.
- QY6P4RGQ, AN_Theory_Reference Yes. Das Werk richtet seine Bias-Bestimmung am Konzept der representational harms nach Crawford aus, die Regel schließt diese Doppelfunktion nicht aus.

## Markierungen für die Fachprüfung

- 3AQ2K3BX: Werk der Include-Charge, quellengebundene Ableitung Unclear, Eligibility-Entscheidung liegt bei den Domänenexpert:innen.
- ERTJZW5M: Werk der Include-Charge, quellengebundene Ableitung Unclear, Bias nur als eine Vertrauensbarriere.
- 7L93JBLR: Ankerwerk, Grenze eigener Fallanalyse und zitierter Fall bei SyRI sowie Explicit gegenüber Implicit_Only bei der Gender-Definition.
- K3YCLBXK: Policy-Report unter der Publikationstypregel, None bei Achsen und Schadensarten trotz Bias_Ungleichheit ja, binäre Gender-Codierung aus wenigen Erwähnungen.
- 6L85PRUW: Gender-Felder aus dünner Textbasis.
- QY6P4RGQ: Benchmark-Eingaben als Prompting, Crawford-Definition als Theoriebezug, Generative_KI ja trotz Encoder-Modellen.
- 22KJL3PC: Direct_Discrimination aus simulierten Spielzuteilungen.

## Selbstprüfung

- zugewiesene und reviewte IDs stimmen überein: ja
- alle Belegstellen im finalen Coding zeichengetreu in der Quelle: ja, durch den Validator geprüft
- alle Includes vollständig analysiert: ja
- Manifest, Coding-Pakete und Tracks unverändert: ja, Hashes nach dem Lauf geprüft
- Validator bestanden: ja
