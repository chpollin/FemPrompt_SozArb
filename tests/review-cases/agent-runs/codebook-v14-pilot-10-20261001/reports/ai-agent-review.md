# codebook-v14-pilot-10-20261001 · ai-agent-review

- Akteur: agent, Prüfinstanz ai-agent-review, Modell claude-opus-5-5 im Claude-Code-Subagenten
- Regelbasis: Prompt prism-ai-agent-review v0.4, Codebuch 1.4, Reviewer-Prompt v1.3, Laufmanifest
- Eingaben: Coding-Pakete ar1 und ar2, PRISM-Tracks ar1 und ar2, zehn Paper-Quellen, alle vollständig gelesen
- Artefakt: `ai-agent-review.json`, Validator `validate-ai-agent-review.mjs` mit PASS
- Ergebnis: ein Record übereinstimmend, neun quellenbasiert aufgelöst, alle zehn Werke Include, kein Blocker

Alle Zitate beider Tracks, Kategoriebelege wie Fundstellen in `analysis_evidence`, stehen zeichengetreu in der jeweiligen Quelle. Die PRISM-Tracks geben Kategorien, Entscheidungen und Analysefelder der Pakete unverändert wieder. Kein Unterschied betrifft eine Entscheidung, die Abweichungen liegen in Kategoriestufen unterhalb der Include-Schwelle und in Analysefeldern.

## Werke

### G53MCF3W, Gender-Diverse Perspectives on LLMs · aufgelöst

- Prompting ja statt teilweise. Die Promptvariation ist Gegenstand von RQ1 („How do gendered and neutral prompts influence ChatGPT's responses?“) und die kuratierten Prompts sind ein erklärter Beitrag.
- AN_Harm_Types ergänzt um Erasure. Die eigenen Befunde zeigen das Fehlen nicht-binärer Figuren bei neutralen Prompts („P1 and P14 noted the exclusion of non-binary and transgender identities“).
- AN_Mitigation_Stage behält Intra_Processing. Abschnitt 5.2.2 beschreibt ein Verhalten des Modells bei der Anwendung („enable the LLM to proactively seek additional user input when it detects vague or ambiguous prompts“), vorgeschlagen.

### KNQYFQ6B, The power of prompts · übereinstimmend

Beide Tracks codieren identisch und die Quelle trägt jedes Feld. Die evaluierte Maßnahme ist der 5-Shot-Prompt mit kurzer Chain-of-Thought (Tabelle 2, Abschnitt 8), Gender wird ausdrücklich binär analysiert („we have only focused on the binary male and female genders“).

### WLV8L8PM, Guardrails, not Guidance · aufgelöst

- Prompting ja statt teilweise. Beide Forschungsfragen variieren die Sprache des Prompts.
- Gender teilweise statt ja. Gegenstand sind Heteronormativität und Queer Slang, Geschlechterrollen sind ein Bestandteil („traditional gender roles, and binary gender norms“), Geschlechtergruppen werden nicht verglichen.
- AN_Prompt_Techniques None statt ICL. Der Few-Shot-Prompt an GPT-4o taggt nur Daten für Experiment 1.2 und ist kein Gegenstand des Werks.
- AN_Harm_Types ohne Disparate_Performance. Gemessen wird emotionaler Ton, die Wirkung auf sachliche Antworten bleibt laut Werk „unexplored“.
- AN_Mitigation_Stage und AN_Mitigation_Status None. Die Erweiterung von Evaluationsrahmen ist eine Forschungsagenda, die Guardrails werden beobachtet, nicht vorgeschlagen.

### PQC9G5EU, Feminism Confronts AI · aufgelöst

- AN_Harm_Types ohne Disparate_Performance. Die Erkennungsfehler stehen in einer Liste zitierter Fälle („To name only a few“, „Several studies on computer vision“), den eigenen Mechanismus argumentiert das Kapitel über maskuline Defaults und die Gender Data Gap.

### VFD9ENG6, Survey on Intersectional Fairness · aufgelöst

- AN_Harm_Types ohne Indirect_Discrimination. Die Vier-Fünftel-Regel erscheint nur als Definition eines verzerrten Ergebnisses, ein neutrales Kriterium oder Proxy wird nicht benannt, und das Werk klassifiziert die Diskriminierung nicht.
- AN_Gender_Understanding Binary_Categorical und Intersectional. Gender erscheint als ungeprüftes zweiwertiges Merkmal („Black Females and Black Males“), das Beispiel der Black woman erfüllt die Intersektionalitätsregel.

### YN9JAREI, Faires KI-Prompting · aufgelöst

- Publikationstyp zulässig. Leitfaden der BSP Business and Law School im Mittelstand-Digital Zentrum Zukunftskultur mit Zitiervorschlag, drei benannten Autor:innen, Impressum, eigenen Bildproben und Quellenliste. Nach Publikationstypregel und Klarstellung vom 5. September 2026 ist das wissenschaftsnahe graue Literatur, kein kommerzieller Blog und kein unbelegter Webtext.
- AN_Bias_Axes ohne Intersectional. Der Satz zu „Women of Color“ ist eine einzelne, nicht ausgeführte Behauptung (Anker VSZM7CT6), die eigenen Proben behandeln Geschlecht, Hautfarbe und Alter getrennt.
- AN_Harm_Types ergänzt um Indirect_Discrimination. Abschnitt 4.7 argumentiert für den eigenen Anwendungsfall, dass Anzeigensprache, „die besonders Männer als ansprechend empfinden“, über ein darauf trainiertes Modell Bewerberinnen weiter benachteiligt.
- AN_Gender_Understanding Binary_Categorical. Die Analysekategorien sind Frauen und Männer („weiblichen und männlichen Chef*innen“).
- AN_Theory_Reference No. Die Gender Data Gap ist ein Beispielpunkt, „Feministische KI“ steht im Ausblick, Data Feminism in der weiterführenden Literatur.

### 6IU5JG5Y, Fairness Beyond the Algorithmic Frame · aufgelöst

- AN_Bias_Axes ergänzt um Socioeconomic. Derselbe Eingangsfall, aus dem beide Tracks Nationality_Migration codieren, nennt „low-income and immigrant backgrounds“.
- AN_Harm_Types None. Die Fehlerraten sind eine zitierte Studie als Motivation, die Synthese ordnet nach Empfehlungsthemen.
- AN_Gender_Understanding Social_Construct und Intersectional. Das Werk fasst Sexismus als strukturelles Machtverhältnis („power relations, social justice, and structural inequality“).

### LGYFN6JK, ChatGPT for Social Work Science · aufgelöst

- AN_Task Research, Documentation_Recording und Teaching_Further_Education. Jeder Wert hat eine eigene Stelle, Fallnotizen und Überweisungen auf diskriminierende Sprache prüfen („identify language in case notes and referrals“) und Bildung („may use ChatGPT for education, research, practice“).

### H59BNSX8, Algorithmic decision-making in social work · aufgelöst

- AN_Bias_Axes ohne Socioeconomic. Sozioökonomische Benachteiligung steht nur als zitierter Befund im Schluss und in der Fragenliste.
- AN_Population ergänzt um General_Social_Work. Das Werk adressiert Soziale Arbeit insgesamt („increasingly embedded in social work practice“).
- Studientyp Theoretisch statt Konzept. Die Pädagogik wird skizziert, nicht entworfen („we have not answered the question of what would be considered an ‚ideal' unit design“).

### 3B87U5LN, Generative AI chatbots for mental health · aufgelöst

- Soziale_Arbeit bleibt ja. Die Definition nennt die Zielgruppen Sozialer Arbeit, und die ganze Studie gilt psychosozialer Unterstützung von Menschen mit psychischen Belastungen. Soziale Arbeit wird im Werk nicht genannt, die Include-Entscheidung hängt allein an dieser Lesart.
- KI_Sonstige teilweise statt nein. Regelbasierte Chatbots sind ausdrücklicher Vergleichsgegenstand in Abstract, Diskussion und Abbildung 4.
- AN_Bias_Definition Implicit_Only statt Not_Applicable. Beide Tracks codieren Bias_Ungleichheit teilweise und Exclusionary_Norms, Ungleichheit als ungleiche Reichweite ist also Gegenstand.
- Das in beiden Tracks verwendete, mitten im Wort abgeschnittene Zitat („… suggests that the bene“) ist durch eine vollständige Stelle desselben Satzes ersetzt.

## Befunde zu den Codebuchregeln

- Prompting als Kategorie unterscheidet nicht zwischen Prompting als Gegenstand und Prompting als Stimulus. Bei G53MCF3W und WLV8L8PM entstand daraus die Differenz teilweise gegen ja. Die Kategoriedefinition braucht einen Satz, ob die Variation von Eingaben als Untersuchungsbedingung „Gestaltung von Eingaben“ ist.
- Die Regel für AN_Prompt_Techniques sagt nicht, ob eine Technik zählt, die das Werk nur als Hilfsschritt der eigenen Methode einsetzt (WLV8L8PM, Tagging mit GPT-4o). Empfohlen wird eine Regel parallel zu AN_Harm_Types, die nur Techniken als Gegenstand des Werks codiert.
- AN_Harm_Types erzeugte die meisten Differenzen. Ursachen waren die Abgrenzung eigener Argumentation von zitierten Beispielfällen (PQC9G5EU, 6IU5JG5Y) und die Zuordnung von Disparate_Performance zu nicht qualitätsbezogenen Messungen (WLV8L8PM). Hilfreich wären ein Anker für eine Liste zitierter Fälle innerhalb des eigenen Arguments und der Satz, dass Unterschiede in Tonalität oder Sentiment keine Leistungsunterschiede sind.
- Für allokative Ergebnisdisparitäten, die ein Werk weder als unmittelbar noch als mittelbar klassifiziert, hat AN_Harm_Types keinen Wert (VFD9ENG6, statistische Parität und Vier-Fünftel-Regel). Diese Lücke verdeckt den Kern fairnessmetrischer Arbeiten. Ein Wert für nicht klassifizierte allokative Diskriminierung oder eine ausdrückliche Notizpflicht würde sie schließen.
- AN_Bias_Axes trennt eigene Fallbeispiele von motivierenden Eingangsfällen nicht trennscharf. Bei 6IU5JG5Y codierten beide Tracks aus demselben Eingangssatz eine Achse, aber nur einer die zweite. Die Regel sollte festhalten, dass alle Achsen einer als Arbeitsbeispiel genutzten Passage gemeinsam codiert werden.
- AN_Gender_Understanding regelt die Kombination Binary_Categorical mit Intersectional nicht ausdrücklich (VFD9ENG6). Ebenso fehlt ein Kriterium, wann eine strukturelle Rahmung ohne Aussage über Geschlecht selbst Social_Construct trägt (6IU5JG5Y).
- AN_Theory_Reference unterscheidet nicht zwischen einem rahmenden Begriff und einem einzelnen Beispielbegriff wie der Gender Data Gap (YN9JAREI). Ein Anker für einen bloß illustrierenden Begriff würde die Grenze ziehen.
- Die Paarung von AN_Bias_Definition mit Bias_Ungleichheit ist nicht geregelt. Bei 3B87U5LN stand Not_Applicable neben einer positiv codierten Bias-Kategorie und einer codierten Schadensart. Eine Regel, nach der Not_Applicable nur bei Bias_Ungleichheit nein zulässig ist, würde diesen Widerspruch maschinell erkennbar machen.
- Die Zielgruppenklausel von Soziale_Arbeit macht jede Arbeit zu psychischer Gesundheit einschlussfähig, auch ohne Bezug auf sozialarbeiterische Praxis (3B87U5LN). Ob psychosoziale Versorgung allein ja trägt, ist eine fachliche Setzung, die das Codebuch ausdrücklich treffen sollte.
- AN_Task trennt Aufgaben der Forschung über Fallakten nicht von fallbezogener Dokumentation (LGYFN6JK). Der Pilot sollte klären, ob die Prüfung von Fallnotizen durch Forschende Documentation_Recording ist.
- `knowledge/update-protocol.md` (Version 0.7) nennt in „Eligibility“ und „Analysis coding“ weiterhin Codebuch 1.3 und beschreibt 1.4 als nicht angenommenen Vorschlag. Laufmanifest und `categories.yaml` binden 1.4, das Protokoll ist nachzuziehen.
- Die PRISM-Tracks tragen an jedem Beleg `origin: "human"` bei `actor: "agent"`. Die Projektionsfunktion sollte die Herkunft eines Agentenbelegs kennzeichnen.

## Blocker

Keine. Identität, Quellenbindung und Publikationstyp sind für alle zehn Werke geklärt. YN9JAREI bleibt als Grenzfall des Publikationstyps und 3B87U5LN als Grenzfall von Soziale_Arbeit für die fachliche Stichprobenprüfung markiert.
