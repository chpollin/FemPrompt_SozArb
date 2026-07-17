---
type: specification
created: 2026-07-17
tags: [fair-bench, analysis-design, pilot]
status: draft
---

# Pilot der Analysefelder (TP4) an stratifizierter Stichprobe

Advisory LLM-Pilot, Modell Claude Opus, Lauf 2026-07-17. Dieser Bericht ist Vorstufe zum Freeze der Analysefelder aus [[update-protocol#Analysis fields (TP4)]]. Die Kodierung hier ist beratend und nicht verbindlich; die verbindliche Kodierung machen später Menschen im Excel-Workflow. Er misst Füllrate und Entscheidbarkeit der sieben Felder plus Studientyp an bereits mit Include kodierten Papers, sammelt Ambiguitäten und leitet Revisionsvorschläge für Definitionen und Wertelisten ab. Die offenen Entscheidungen aus [[update-protocol#F. Open decisions]] werden einbezogen, wo der Pilot sie informiert.

## Stichprobenziehung

Grundgesamtheit sind die 142 Papers mit `Decision = Include` in `assessment/human_assessment.csv`. Zwei Strata nach dem Validierungspfad ([[update-protocol#E. Analysis methods over the coded corpus]]), Prompting Ja/Nein aus der Kategorienspalte `Prompting` und Textverfügbarkeit. Die Textverfügbarkeit trennt Papers mit vorhandenem Destillat unter `generated/distilled/` von Papers ohne Destillat, für die nur der Abstract aus der CSV vorliegt. Volltexte unter `_sources/` sind auf diesem Rechner nicht vorhanden, deshalb ist die tiefste verfügbare Textbasis entweder das Destillat (`Knowledge_Doc`) oder der Abstract (`Abstract`).

Zellenbesetzung in der Grundgesamtheit:

| Zelle | Prompting | Destillat | n |
|---|---|---|---|
| A | Ja | vorhanden | 65 |
| B | Ja | fehlt | 4 |
| C | Nein | vorhanden | 67 |
| D | Nein | fehlt | 6 |

Alle vier Zellen sind mit mindestens 2 besetzt, deshalb war kein Auffüllen aus einer Nachbarzelle nötig. Ziehung deterministisch, je Zelle die zwei alphabetisch ersten nach `Zotero_Key`. Das macht den Lauf reproduzierbar.

Gezogene Stichprobe, 8 Papers:

| Zelle | Zotero_Key | Author_Year | Kurztitel | Textbasis |
|---|---|---|---|---|
| A | 22KJL3PC | Yuan 2025 | The cultural stereotype and cultural bias of ChatGPT | Knowledge_Doc |
| A | 22XEFRWP | Petzel 2025 | Prejudiced interactions with LLMs reduce trustworthiness | Knowledge_Doc |
| B | 64DQYVVB | Liu 2025 | More or less wrong, directional bias in LLM reasoning | Abstract |
| B | 6MJYP7ZX | Prakash 2023 | Prompt engineering against cultural bias, Arabs and Muslims | Abstract |
| C | 2SLISKSW | McCrory 2024 | Avoiding catastrophe through intersectionality in AI governance | Knowledge_Doc |
| C | 2SNYUZG4 | Yan 2024 | Promises and challenges of generative AI for human learning | Knowledge_Doc |
| D | CHJQ52DC | Latif 2024 | AI Gender Bias, Disparities, and Fairness | Abstract |
| D | DWS4KXBW | Ovalle 2024 | Towards Substantive Equality in AI | Abstract |

## Kodiertabelle

Kodierung nach den Regeln aus [[update-protocol#C. Coding instructions]]. Kodiert wird, was das Paper tut, nicht was es zitiert. `None` steht nur, wo das Thema wirklich nicht behandelt wird. Mehrfachwerte semikolonsepariert. Studientyp aus der bereits vergebenen CSV-Spalte übernommen und gegen das Vokabular geprüft.

| Key | AN_Prompt_Techniques | AN_Bias_Axes | AN_Harm_Types | AN_Mitigation_Stage | AN_Mitigation_Status | AN_Population | AN_Coding_Basis | Studientyp |
|---|---|---|---|---|---|---|---|---|
| 22KJL3PC Yuan | General_Guidance | Language_Culture;Nationality_Migration | Stereotyping | Prompt_Practice | Evaluated | Not_SW_Specific | Knowledge_Doc | Experimentell |
| 22XEFRWP Petzel | None | Gender;Race_Ethnicity | Stereotyping;Disparate_Performance | None | None | Not_SW_Specific | Knowledge_Doc | Experimentell |
| 64DQYVVB Liu | Thought_Generation | Gender;Race_Ethnicity | Disparate_Performance | Prompt_Practice | Evaluated | Not_SW_Specific | Abstract | Experimentell |
| 6MJYP7ZX Prakash | Role_Persona;Self_Criticism;General_Guidance | Religion;Nationality_Migration | Stereotyping;Derogatory_Language | Prompt_Practice | Evaluated | Not_SW_Specific | Abstract | Literaturreview |
| 2SLISKSW McCrory | None | Intersectional;Gender;Race_Ethnicity;Socioeconomic | Exclusionary_Norms;Erasure | Organisational_Process | Proposed | General_Social_Work | Knowledge_Doc | Theoretisch |
| 2SNYUZG4 Yan | None | Gender;Disability | Disparate_Performance | Prompt_Practice | Proposed | Education_Professional | Knowledge_Doc | Konzept |
| CHJQ52DC Latif | None | Gender | Disparate_Performance | In_Training | Evaluated | Education_Professional | Abstract | Experimentell |
| DWS4KXBW Ovalle | None | Gender;Intersectional | Exclusionary_Norms | Organisational_Process | Proposed | Not_SW_Specific | Abstract | Konzept |

Kodiernotizen zu den strittigen Zellen stehen in der Ambiguitätenliste. Kurz zu vier Entscheidungen. Yuan wurde als `General_Guidance` kodiert, weil die vier Strategien inhaltliche Framing-Anweisungen sind und keiner benannten Prompt-Report-Familie zugeordnet werden können. Petzel manipuliert voreingenommene gegen unvoreingenommene Interaktionen, entwickelt aber keine Prompting-Technik und keine Mitigation, deshalb Technik und Mitigation `None` trotz `Prompting: Ja` in der Humankodierung. Liu kodiert Chain-of-thought als `Thought_Generation`, die einzige im Paper evaluierte Technik. Prakash als systematisches Review synthetisiert fünf fremde Techniken, die Kodierregel 5 (kodiere was das Paper tut, nicht was es zitiert) kollidiert hier mit dem Studientyp Literaturreview, siehe Ambiguität A3.

## Füllraten

Füllrate je Feld, gemessen als Anteil der 8 Papers mit einem Nicht-`None`-Wert.

| Feld | Nicht-None | Füllrate |
|---|---|---|
| AN_Prompt_Techniques | 3/8 | 0,38 |
| AN_Bias_Axes | 8/8 | 1,00 |
| AN_Harm_Types | 8/8 | 1,00 |
| AN_Mitigation_Stage | 7/8 | 0,88 |
| AN_Mitigation_Status | 7/8 | 0,88 |
| AN_Population | 8/8 | 1,00 |
| Studientyp | 8/8 | 1,00 |

Beobachtungen zur Entscheidbarkeit nach Textbasis. `AN_Bias_Axes`, `AN_Population` und `Studientyp` waren aus jeder Textbasis entscheidbar, auch aus dem Abstract. `AN_Prompt_Techniques` war das am schwersten und am seltensten belegbare Feld; nur wo eine Technik explizit benannt war (Liu Chain-of-thought, Prakash fünf benannte Ansätze, Yuan vier benannte Strategien) ließ es sich vergeben, bei den vier Papers ohne Prompting-Fokus fiel es auf `None`. Für Petzel (`Prompting: Ja`, aber Technik `None`) trennt die Humankodierung Prompting-Bezug und Prompting-Technik nicht, was die niedrige Füllrate mit erklärt. `AN_Harm_Types` erreichte formal volle Füllrate, war aber das Feld mit der geringsten Zuordnungssicherheit; die Grenzen zwischen `Stereotyping`, `Misrepresentation` und `Disparate_Performance` waren aus Destillat und Abstract mehrfach nicht sauber zu ziehen (siehe A2). `AN_Mitigation_Stage` aus dem Abstract war für Latif nur grob entscheidbar, die Zuordnung `In_Training` stützt sich auf die im Abstract genannten Trainingsdaten-Konfigurationen.

## Ambiguitätenliste

- **A1 Prompting Ja ohne kodierbare Technik.** Petzel und mehrere andere `Prompting: Ja`-Papers verwenden Prompts als Untersuchungsinstrument, ohne eine Technik zu empfehlen oder zu evaluieren. Die Humankategorie `Prompting` und das Feld `AN_Prompt_Techniques` messen Unterschiedliches. Ohne Klärung entsteht eine systematisch niedrige und schwer interpretierbare Füllrate.
- **A2 Harm-Typen überlappen.** `Stereotyping`, `Misrepresentation`, `Disparate_Performance` und `Exclusionary_Norms` konkurrierten in fünf der acht Kodierungen. Aus Destillat oder Abstract ist die Gallegos-Definition (der genaue Schadensmechanismus) oft nicht entscheidbar, weil der Mechanismus nur im Volltext benannt wird. Das Feld ist mit der aktuellen Textbasis das unzuverlässigste, was die im Protokoll vermutete Kodierschwierigkeit bestätigt.
- **A3 Review-Papers und Regel 5.** Bei Prakash (Literaturreview) sind die fünf Prompt-Techniken der Gegenstand des Papers, aber nicht etwas, das das Paper selbst tut. Regel 5 (kodiere was das Paper tut, nicht was es zitiert) und der Studientyp Literaturreview stehen in Spannung. Ohne Sonderregel für Reviews werden entweder Reviews unter `None` verschwinden oder Regel 5 wird verletzt.
- **A4 General_Guidance als Sammelbecken.** Yuans vier Strategien sind konkrete, benannte und evaluierte Interventionen, fallen aber mangels Prompt-Report-Familie auf `General_Guidance`, den unspezifischsten Code. Damit verliert das aussagekräftigste Prompting-Paper der Stichprobe seine Auflösung im Technik-Feld.
- **A5 AN_Population außerhalb der Sozialen Arbeit.** Sechs der acht Papers sind nicht sozialarbeitsspezifisch. `Not_SW_Specific` trägt damit die Hauptlast, während die feinkörnigen SW-Praxisfelder (Child_Family_Welfare, Homelessness_Youth, Social_Assistance_Admin) in der Stichprobe nicht ein einziges Mal vergeben wurden. Ob das an der Stichprobe oder am Korpus liegt, ist mit acht Papers nicht entscheidbar.
- **A6 Education_Professional dehnt sich.** Latif (Schülerantworten bewerten) und Yan (GenAI für Lernen) sind Bildungspapers, keine Papers zur beruflichen Weiterbildung von Fachkräften. `Education_Professional` war im Protokoll für den Ort der AI-Literacy-Literatur gedacht, fängt hier aber jeden Bildungskontext ein und wird dadurch unscharf.
- **A7 Intersectional als Auszeichnung.** McCrory und Ovalle behandeln Intersektionalität als Analyserahmen. Die Protokollregel verlangt für `Intersectional` mindestens zwei Achsen in ihrer Wechselwirkung. Bei McCrory ist das erfüllt, bei Ovalle stützt sich die Vergabe auf die programmatische Nennung, nicht auf eine ausgearbeitete Zwei-Achsen-Analyse; die Grenze zwischen echter intersektionaler Analyse und intersektionalem Vokabular ist aus dem Abstract kaum zu ziehen.

## Revisionsvorschläge

Die Vorschläge sind advisory und informieren die Freeze-Entscheidung, sie ersetzen sie nicht.

1. **AN_Harm_Types auf optional oder streichen (informiert offene Entscheidung 2).** Der Pilot bestätigt die geringste Zuordnungssicherheit dieses Feldes und seine Abhängigkeit vom Volltext. Empfehlung, das Feld optional zu führen und nur bei Textbasis `Fulltext` verpflichtend zu machen. Bei ausschließlich Destillat- und Abstract-Kodierung liefert es mehr Rauschen als Signal.
2. **Prompting-Fokus von Prompting-Technik trennen.** Ein knappes Feld oder eine Regel, die `AN_Prompt_Techniques = None` bei `Prompting: Ja` erlaubt und als eigene Klasse führt (Prompt als Untersuchungsinstrument gegen Prompt als empfohlene Praxis). Das macht die niedrige Füllrate interpretierbar statt verdächtig.
3. **Sonderregel für Review-Studientypen.** Für `Literaturreview` und `Konzept` sollte Regel 5 gelockert werden, sodass die synthetisierten Techniken als das kodierbar sind, was das Review zusammenträgt, mit einer Markierung im Basis- oder Notizfeld. Sonst werden gerade die Übersichtsarbeiten, die das Technik-Inventar am dichtesten abbilden, unter `None` unsichtbar.
4. **Role_Persona-Promotion beibehalten (informiert offene Entscheidung 6).** Prakash belegt Role- und Persona-Prompts als eigenständige, mehrfach genannte Kategorie in der Praxis-Literatur. Die Stichprobe stützt die Promotion aus der Zero-Shot-Familie, wenn auch nur an einem Fall.
5. **AN_Population schärfen (informiert offene Entscheidung 6).** Zwei Anpassungen. Erstens `Education_Professional` auf berufsbezogene AI-Literacy-Kontexte begrenzen und einen getrennten Wert für allgemeine Bildung (Schule, Hochschule) erwägen, da Latif und Yan sonst falsch einsortiert werden. Zweitens die feinkörnigen SW-Praxisfelder erst nach einer größeren Stichprobe finalisieren, da sie in acht Papers gar nicht getroffen wurden und ihre Trennschärfe hier nicht prüfbar ist.
6. **Other_Axis vorerst behalten (informiert offene Entscheidung 6).** In der Stichprobe war jede benötigte Achse durch die bestehende Liste abgedeckt, `Other_Axis` wurde nie gebraucht. Das spricht nicht für eine Erweiterung, aber die Stichprobe ist zu klein, um `Other_Axis` zu streichen; Beibehaltung als Auffangwert bis zur vollen Kodierung.
7. **General_Guidance mit Freitext ergänzen.** Wo eine benannte, evaluierte Strategie auf `General_Guidance` fällt (Fall Yuan), sollte die konkrete Strategie in `AN_Notes` festgehalten werden, damit die Auflösung nicht verloren geht. Alternativ eine spätere Verfeinerung des Technik-Vokabulars um framing- und constraint-basierte Strategien prüfen.

## Related

- [[update-protocol]]
- [[plan]]
- [[specification]]
- [[data]]
