# codebook-v141-includes-11-8-20261002 · ar2

- Akteur: agent
- Zuweisung: 2SNYUZG4, 5ERYSQCK, 9Y7ZFGI5, EN6GNKL3, HJ7BHX8J, JI24FQPV, Q4LK53XW, UJ7DXK8Y (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-11-8-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/ laut Manifest, SHA-256 aller acht Quellen vor der Codierung gegen das Manifest geprüft und übereinstimmend, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 2 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 2SNYUZG4 | Fulltext | provisional | Unclear | AI_Literacies ja, Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | Perspective-Artikel zu GenAI und Lernen; soziale Dimension nur nachgeordnet (Gleichheit, WEIRD-Bias), kein DOI und kein Jahr im Text |
| 5ERYSQCK | Fulltext | verified | Unclear | Generative_KI ja, Prompting teilweise, Gender teilweise | Skalenentwicklung zu Vertrauen in LLMs; Geschlecht nur als Regressionsvariable mit Ergebnis, kein DOI im Text |
| 9Y7ZFGI5 | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, Generative_KI teilweise, Fairness teilweise | Narrative Review zu Gender-Bias und Digital Literacy |
| EN6GNKL3 | Fulltext | verified | Include | AI_Literacies ja, Generative_KI ja, Bias_Ungleichheit ja, Prompting teilweise, KI_Sonstige teilweise, Gender teilweise, Diversitaet teilweise | Fallstudie Lehrkräftebildung mit Bias-Experiment an Bildgeneratoren |
| HJ7BHX8J | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Feministisch ja, Gender teilweise, Diversitaet teilweise | Interviewstudie, feministische Theorie der Verantwortung, kein DOI im Text |
| JI24FQPV | Fulltext | verified | Include | Generative_KI ja, Soziale_Arbeit ja, AI_Literacies teilweise, Prompting teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | Interviews mit klinischen Sozialarbeiter:innen zu LLMs |
| Q4LK53XW | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Feministisch ja, Fairness ja, Diversitaet teilweise | Philosophische Kritik intersektionaler Fairness |
| UJ7DXK8Y | Fulltext | provisional | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Generative_KI teilweise, Prompting teilweise, Gender teilweise, Fairness teilweise | NLPositionality, kein DOI und kein Publikationsjahr im Text |

## Abweichungen und Blocker

- 2SNYUZG4 · Metadatenlücke · Text ohne DOI und Publikationsjahr, Titel und Autor:innen stimmen · Bestätigung von DOI und Jahr aus den Korpusmetadaten
- UJ7DXK8Y · Metadatenlücke · Text ohne DOI und Publikationsjahr, nur Erhebungsdatum 25. Mai 2023 · Bestätigung von DOI und Jahr aus den Korpusmetadaten
- 5ERYSQCK, HJ7BHX8J · Metadatenlücke · kein DOI im Text, Jahr bzw. Datum vorhanden, daher verified mit Vermerk · keine Klärung zwingend
- Keine Blocker. Kein Titel- oder DOI-Konflikt, kein Widerspruch zwischen Codebuch, Protokollabschnitten und Laufmanifest.

## Codierregeln mit Auslegungsbedarf

- Entscheidung · 2SNYUZG4 · Gleichheit, WEIRD-Bias und Inklusivität stehen in einem Unterabschnitt der ethischen Herausforderungen, daher Bias_Ungleichheit und Diversitaet nur teilweise; Ergebnis Unclear trotz zentraler AI Literacy
- Entscheidung · 5ERYSQCK · Geschlechtsunterschied als Regressionsbefund im Abstract, aber ohne Gender-Fokus, daher Gender teilweise; Ergebnis Unclear
- Feministisch · 9Y7ZFGI5 · strukturelle geschlechterbezogene Kritik trägt die erste Forschungsfrage, ohne ausdrücklich feministische Theorie; als ja gewertet
- AN_Bias_Axes · 9Y7ZFGI5 · Stadt-Land-Beispiel im Intersektionalitätsabschnitt betrifft Zugangsbarrieren, nicht KI-Bias; Intersectional nicht codiert
- AN_Mitigation_Status · 9Y7ZFGI5 · AI4ALL-Zahlen messen Berufsinteresse, nicht Bias-Reduktion; Proposed statt Evaluated
- AN_Prompting_Role · EN6GNKL3, JI24FQPV · Prompts zum Hervorrufen von Modellausgaben (Bias-Probe im Kurs, Demonstration im Interview) als Research_Instrument gewertet, obwohl kein Messdesign der Studie selbst vorliegt
- AN_Theory_Reference · EN6GNKL3 · Rahmung generativer KI als sozio-technisches System, das Ungleichheiten und Biases reproduziert, als Theoriebezug gewertet; Grenzfall zwischen rahmendem Konzept und illustrativer Erwähnung
- AN_Mitigation_Status · EN6GNKL3 · Kurs als Schulungsmaßnahme durchgeführt und ausgewertet, ohne Prüfung eines Bias-Ergebnisses; Demonstrated
- AN_Bias_Axes · HJ7BHX8J · geschlechtliche und rassifizierte Verteilung von Wartungsarbeit trägt eine eigene Empfehlung, stützt sich aber auf zitierte Literatur; Gender und Race_Ethnicity codiert, Grenzfall zu None
- Bias_Ungleichheit · HJ7BHX8J · Diskriminierung motiviert die Studie, strukturelle Ungleichheit trägt eines von drei Diskussionsthemen; als ja gewertet
- AN_Bias_Axes · JI24FQPV · Rassismus, Ethnizität und Wohlstand nur in Teilnehmendenfragen; None
- AN_Harm_Types · Q4LK53XW · zitierter Gesichtserkennungsfall wird im eigenen Argument kausal analysiert, daher Disparate_Performance; selbst konstruierter Einstellungsalgorithmus ohne Einordnung durch das Werk als Direct_Discrimination codiert (offene Frage aus dem Pilotlauf)
- AN_Task · Q4LK53XW, 9Y7ZFGI5 · Einstellung, Zulassung, Kreditvergabe und Rückfallprognose als Other_Task außerhalb Sozialer Arbeit
- AN_Task · UJ7DXK8Y · Hate-Speech-Erkennung und soziale Akzeptabilität als NLP-Benchmarkaufgaben gewertet, None statt Other_Task (Content Moderation)
- AN_Bias_Axes · UJ7DXK8Y · Länder werden als kulturelle Sphären gruppiert, daher Language_Culture statt Nationality_Migration; Religion nur in Tabelle 2 verglichen und codiert

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
