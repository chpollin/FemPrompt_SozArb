# Strukturierte Extraktion v2: diagnostischer Kandidat

Ungeprüfter LLM-Kandidat, keine menschliche Referenz. Ausschließlich die gelieferten Texte, keine Webrecherche, keine anderen Methodenoutputs, kein externer Prompt-Report-Vergleich. Jede Tabellenzeile trägt eine eigene ID. R bedeutet referierte Evidenz: Nur diese Quelle wurde gelesen, nicht ihr zitierter Primärbericht. E bedeutet eigene empirische Analyse der Quelle, V Empfehlung, I eigene Interpretation. Bei V fehlen grundsätzlich Interventionsvergleich, Outcome und Nullbefund, sofern nicht anders angegeben. Ein fehlender Gegenbeleg im Text bestätigt keine universelle Gültigkeit. Kurze Originalzitate stehen in «…»; Abschnitt und Absatzanfang identifizieren die Fundstelle.

## Inputidentität und Volllektüre

| Fall | Work-ID | Bibliographic-Version-ID | Inputdatei und SHA-256 |
|---|---|---|---|
| D01 | work:3dc3ced9-8261-5840-9d71-aa2dfc43af87 | version:950d71ce-958d-55e9-804d-1bb5f3a0a41a | docs/data/fulltext/ET4MMZGH.md; 6cdfcd76b60b5bfbe705e5619e85fb539dad523f178bf6830fe265649edcc0f0 |
| D02 | work:3627182f-8335-5c7b-81e8-4d4daebd440a | version:e64033e0-573f-5401-8703-7666127c9dca | docs/data/fulltext/2EBHMYU4.md; a2c87d3702b11a580f428735a07d20da3cbdc595f12b39952b9dd85d18044193 |
| D03 | work:7644e99b-9dd1-545f-af98-ab7fed6643e6 | version:31d4c15c-10dd-530b-b539-6934b297ddc5 | docs/data/fulltext/UIIDCXLB.md; 8a1168c05555303884970c61e319f3f6c6eecdd510c78e198f5188e6676df7bb |

Source-Version ist für alle drei Quellen laut Manifest `not established for this exact serving-layer snapshot`. Die Dateien enthalten keinen vorbereiteten Source-Version-Header. Die bibliografische Version wird nicht als gelesene Source-Version ausgegeben. Die Hashes identifizieren den tatsächlich gelieferten Input.

Alle drei Dateien einschließlich Literatur-/Endmaterial wurden vollständig gelesen. Eine gekürzte D02-Toolausgabe wurde in kleineren ungekürzten Abschnitten vollständig nachgelesen. Publikationsvollständigkeit wurde für keine Quelle festgestellt. D01 enthält nach dem Haupttext einen duplizierten, abgebrochenen Anfang und Zugriffswerbung. D02 enthält Tabellen 1/2 als linearisierten Text, ohne visuelle Prüfung des Originallayouts. D03 enthält Tabellen 1/2, aber nur Captions/Prosa zu Abbildungen 1–3, keine Bildwerte; Supplement und Replikationsskripte fehlen. Vollständige Inputlektüre ersetzt die fehlende Evidenzsichtbarkeit nicht.

## D01: When Good Algorithms Go Sexist

| ID | Frage und einzelne Aussage | Fundstelle; Beleg | Art, Geltungsbereich und Grenzen |
|---|---|---|---|
| D01-01 | SQ1: Kein empirisch untersuchtes Sozialarbeitssetting; allgemeine und angrenzende Sektoren. | Einleitung, „Many institutions“; «health care system» | I aus Volllektüre; Gesundheit, Kredit, Hiring und Wohlfahrt sind Beispiele, keine Sozialarbeitsstudie. |
| D01-02 | SQ1: ML für finanzielle Inklusion von Frauen wird als Nutzung berichtet. | Social Change Nr. 3, „AI is increasingly“; «using ML to support financial inclusion for women» | R; keine Nutzenmessung. |
| D01-03 | SQ1: Ein haitianisches Datensystem ermöglichte lokale Gewalt-Datenarbeit. | Social Change Nr. 1, „As one example“; «track, analyze, map, and share data» | R/Illustration; kein ausdrücklich ausgewiesenes AI-System, kein Effektvergleich. |
| D01-04 | SQ2: Geringerer Digitalzugang von Frauen verzerrt verfügbare Nutzungsdaten. | Where AI Gender Bias Comes From, „In terms of gender bias from data“; «women have less access to them inherently skews datasets» | Mechanismusargument der Quelle; keine eigene Kausalstudie. |
| D01-05 | SQ2: Fehlende Disaggregation verdeckt mögliche Unter-/Überrepräsentation. | Where…, „Data that isn’t disaggregated“; «hides potential overrepresentation or underrepresentation» | Erklärung, kein universeller Analyseausschluss. |
| D01-06 | SQ2: Kreditdaten können historische Diskriminierung konservieren. | Where…, „Even when representative“; «capture these discriminatory trends» | Mechanismusargument; keine isolierte Wirkungsschätzung. |
| D01-07 | SQ2/SQ4: Binäre Genderlabels verringern die Abbildung selbstbestimmter/fluid gewählter Identität. | Where…, „Labeling of data“; «reduces the potential for AI to reflect gender fluidity and self-held gender identity» | Argument; „verringert“ bleibt erhalten, nicht „verhindert“. |
| D01-08 | SQ2: Historische Trainingsdaten können ungleichen Kreditzugang reproduzieren. | Where…, „In terms of gender bias from algorithms“; «They reproduce the same inequitable access to credit» | Erklärung mit anekdotischen Kreditfällen; kein kontrollierter Nachweis für deren Ursache. |
| D01-09 | SQ2: Gender Shades wird mit 35 % Fehlklassifikation dunkelhäutiger Frauen versus 0,8 % hellhäutiger Männer referiert. | Where…, gleicher Absatz; «an error rate of 35 percent, compared to an error rate of .8 percent» | R/Evaluation; Gruppen-Nenner fehlen, Originalstudie nicht separat gelesen. |
| D01-10 | SQ2: GitHub-Aktivität als Hiringproxy kann Frauen benachteiligen. | Where…, „Developers tell algorithms“; «Women therefore produce less of this social data.» | R/Gild-Beispiel; Care-Arbeit und Sicherheitsprobleme als Mechanismus, keine isolierte Effektmessung. |
| D01-11 | SQ2: 59 von ungefähr 133 bekannten Bias-Systemen zeigen Gender-Bias, entsprechend 44,2 %. | Impacts, „Gender-biased AI not only“; «44.2 percent (59 systems)» | E/Fallsammlung seit 1988; keine repräsentative Prävalenz aller AI. |
| D01-12 | SQ2: 34 der ungefähr 133 Systeme zeigen Gender- und Race-Bias, entsprechend 25,7 %. | Impacts, gleicher Absatz; «25.7 percent (34 systems)» | E/Fallsammlung; Nenner nicht 59. |
| D01-13 | SQ2: Schlechtere Servicequalität betrifft laut Sammlung 70 % der 59 genderverzerrten Systeme. | Impacts, „Gender-biased AI systems have six“; «70 percent resulted in lower quality of service» | E, Frauen/nichtbinäre Personen; Kodierdaten fehlen. |
| D01-14 | SQ2: Unfaire Verteilung von Ressourcen/Information/Chancen wird für 61,5 % berichtet. | Impacts, gleicher Absatz; «61.5 percent of the systems we identified as gender-biased» | E, Bezugsgruppe 59; keine Interventionswirkung. |
| D01-15 | SQ2: Stereotypverstärkung wird für 28,2 % berichtet. | Impacts, „Reinforcement of existing“; «28.2 percent of gender-biased systems» | E, Bezugsgruppe 59; Übersetzungsbeispiel illustriert Rückkopplung. |
| D01-16 | SQ2: Abwertung/Auslöschung marginalisierter Genderidentitäten wird für 6,84 % berichtet. | Impacts, gleicher Absatz; «derogatory and offensive treatment or erasure» | E, Bezugsgruppe genderverzerrte Systeme; Kategorien nicht disjunkt setzen. |
| D01-17 | SQ2: Physische Sicherheitsnachteile werden für 18,8 % berichtet. | Impacts, „In addition, certain systems“; «18.8 percent of gender-biased systems» | E, Bezugsgruppe 59; Wohlfahrt nur Sektorbeispiel. |
| D01-18 | SQ2: Gesundheitsgefahren werden für 3,42 % berichtet. | Impacts, gleicher Absatz; «health hazards (3.42 percent)» | E, Bezugsgruppe genderverzerrte Systeme; Melanomerkennung Schwarzer Frauen als Illustration. |
| D01-19 | SQ3/SQ4: Feministische Datenpraxis soll Macht analysieren. | Social Change Nr. 1, „Use feminist“; «analyzing how power operates» | V unter Bezug auf Data Feminism; kein evaluierter Effekt. |
| D01-20 | SQ3: Daten sollen ungleiche Machtstrukturen herausfordern. | Gleicher Absatz; «using data to challenge unequal power structures» | V. |
| D01-21 | SQ3/SQ4: Datenarbeit soll Genderbinarität überschreiten. | Gleicher Absatz; «moving past the gender binary» | V; keine umfassende Kategorienoperationalisierung. |
| D01-22 | SQ3: Verschiedene Wissensformen sollen anerkannt werden. | Gleicher Absatz; «valuing multiple forms of knowledge» | V. |
| D01-23 | SQ3: Perspektivensynthese soll lokales/indigenes Wissen bevorzugt berücksichtigen. | Gleicher Absatz; «priority given to local and Indigenous knowledge» | V, Haiti illustriert Praxis, evaluiert diese Regel nicht. |
| D01-24 | SQ3: Schädliche Datenpraktiken sollen bekämpft werden. | Social Change Nr. 1, „Another important step“; «work against harmful data practices» | V, Manifest-No nur referiert. |
| D01-25 | SQ3/SQ5: Genderexpertise soll in AI eingebracht werden. | Social Change Nr. 2, „Lend your expertise“; «By integrating gender expertise into AI systems» | V/explizite Forderung; besseres Problemverständnis behauptet, nicht gemessen. |
| D01-26 | SQ3/SQ5: Genderexpert*innen sollen AI-Literacy-Training erhalten. | Social Change Nr. 2, „This starts“; «AI literacy training among gender experts» | V/explizite Bildung; kein Curriculum/Kompetenztest. |
| D01-27 | SQ3: Konferenzen sollen Gender-und-AI-Workshops anbieten. | Gleicher Absatz; «sessions and workshops on gender and AI» | V; Impact-Investing-Workshops nur Analogie. |
| D01-28 | SQ3/SQ5: Anwendende sollen Teamrepräsentation kritisch prüfen. | Social Change Nr. 3; «who is represented on the team» | V/explizite Forderung für Social Change Leaders, nicht speziell Sozialarbeitende. |
| D01-29 | SQ3/SQ5: Anwendende sollen verwendete Daten prüfen. | Gleicher Absatz; «what data they are using» | V; keine Prüfmethode evaluiert. |
| D01-30 | SQ3/SQ5: Anwendende sollen Algorithmusentwicklung prüfen. | Gleicher Absatz; «how they develop the algorithm» | V. |
| D01-31 | SQ3: Systeme sollen vor Einsatz auf Gender-Bias und unerwartete Folgen geprüft werden. | Social Change Nr. 3, „AI is increasingly“; «assess potential AI systems for gender bias and unintended consequences before using them» | V, keine Evaluation. |
| D01-32 | SQ3: Teams sollen Diversität fördern. | ML Developers Nr. 1; «Embed and advance gender diversity, equity, and inclusion» | V; referierte Diversitätsstudie ohne Stichprobe/Design/Outcome-Wert. |
| D01-33 | SQ3: Institutionelle Regeln sollen Diversität unterstützen. | Gleicher Absatz; «updating institutional policies, practices, and structures» | V, separate Organisationsmaßnahme. |
| D01-34 | SQ3: Datensätze sollen dokumentiert werden. | ML Developers Nr. 2; «Datasheets for Datasets» | V, Material Datensätze. |
| D01-35 | SQ3: Modelle sollen dokumentiert werden. | Gleicher Absatz; «model cards» | V, Material Modelle. |
| D01-36 | SQ3: Daten sollen auf Gender-Unterrepräsentation geprüft werden. | Gleicher Absatz; «Assess datasets for under-representation of different gender identities» | V, kein durchgeführtes Audit. |
| D01-37 | SQ3: Daten sollen auf reale, aber problematische Ungleichheiten geprüft werden. | Gleicher Absatz; «underlying inequities that reflect reality but are ultimately problematic» | V, Repräsentativität allein genügt argumentativ nicht. |
| D01-38 | SQ3: Entwicklung soll mit Genderexpertise kooperieren. | Gleicher Absatz; «partner with gender experts» | V, kein isolierter Effekt. |
| D01-39 | SQ3: Algorithmische Audits sollen Gender berücksichtigen. | Gleicher Absatz; «conduct algorithm audits with a gender lens» | V, keine Auditresultate. |
| D01-40 | SQ3: Marginalisierte Personen sollen AI mitgestalten. | ML Developers Nr. 3; «Center the voices of marginalized community members» | V, Frauen/nichtbinäre Personen ausdrücklich genannt. |
| D01-41 | SQ3: Participatory Design soll aufgegriffen werden. | Gleicher Absatz; «participatory design» | V, andere Technologiebranchen als Analogie. |
| D01-42 | SQ3: Participatory Action Research soll aufgegriffen werden. | Gleicher Absatz; «participatory action research» | V, keine AI-Wirkungsstudie. |
| D01-43 | SQ3: Governance-Gremien sollen genderdivers sein. | ML Developers Nr. 4; «ensure that there is gender diversity» | V, Ethics Board/Lead als institutioneller Ort. |
| D01-44 | SQ3/SQ4: AI-Prinzipien sollen Gendergerechtigkeit verankern. | Gleicher Absatz; «incorporate justice and equity related to gender and other marginalized identities» | V, keine formale Fairnessmetrik. |
| D01-45 | SQ4: ML-Neutralität wird zurückgewiesen. | Social Change, „Prioritizing gender equity“; «ML systems are not objective» | Quellenposition; kein Beleg, dass jeder einzelne Output verzerrt ist. |
| D01-46 | SQ5: Als Bildungsübertragung bietet sich begründete Due Diligence an. | Basis D01-28–31; Social Change Nr. 3; «do your due diligence» | I, keine explizite feministisch-sozialarbeiterische Kompetenzdefinition. |

## D02: Intersectionality in Artificial Intelligence

| ID | Frage und einzelne Aussage | Fundstelle; Beleg | Art, Geltungsbereich und Grenzen |
|---|---|---|---|
| D02-01 | SQ1: Gegenstand ist Berichtsframing, kein untersuchtes Sozialarbeitssetting. | 2.2, „To examine the emerging agenda“; «analyzes four high‐profile reports» | E/Dokumentenanalyse, Berichte 2019–2021; angrenzende Sektorbeispiele keine eigenen Versuche. |
| D02-02 | SQ1: Genderinklusive Stellenausschreibungen werden als potenzieller AI-Nutzen genannt. | 3.4, „The UNESCO (2020) report mentions“; «AI can help employers use gender‐sensitive language» | R/V aus UNESCO; keine gemessene Personaldiversität. |
| D02-03 | SQ2/SQ4: Intersektionalität analysiert überlagerte Identitäten in Machtverhältnissen. | 2.1, „To examine how AI impacts“; «multiple inequalities and their reinforcement» | Tragender Theorierahmen; kein additiver Bias-Score. |
| D02-04 | SQ4: Framing ist die angewandte Analysemethode. | 2.2, „To analyze how these reports“; «this study uses a framing approach» | Eigene Methodenauswahl, nicht nur erwähnte Theorie. |
| D02-05 | SQ4: Gender wird in den Berichten überwiegend nichtbinär verstanden. | 3.3, „While one of the reports“; «Gender is typically understood as non‐binary» | E/Dokumentenanalyse; Gegenbegrenzung: Daten können trotzdem binär sein, D02-06. |
| D02-06 | SQ2: Fehlende intersektionale Daten erschweren Analyse. | 3.2, „To study the gender job gap“; «The limited data availability hinders opportunities for intersectional analysis» | R/Young; „erschwert“ statt völliger Unmöglichkeit. |
| D02-07 | SQ2: Berichtskonvergenz ist keine unabhängige Replikation. | 3.2, Absatzfortsetzung „women. Furthermore“; «documents refer to each other» | I aus expliziten Zitationsbeziehungen UNESCO/Young/West/Collett-Dillon. |
| D02-08 | SQ2: Expert*innenauswahl konzentriert sich auf UK/USA. | 3.2, „Overall, for these two reports“; «many of them coming from only two countries—the UK and the US» | E/Quellenkritik; Repräsentation eingeschränkt, nicht alle Aussagen dadurch falsch. |
| D02-09 | SQ2: Der Karriere-Datensatz ist nicht global repräsentativ. | 3.2, „To study the gender job gap“; «not comprehensive, intersectional, and representative of the entire global data and AI population» | R/Selbstvorbehalt: 19.535 Profile, 11,3 % Frauen, seniorlastig, überwiegend USA/Frankreich/Deutschland/UK. |
| D02-10 | SQ2: Arbeitsplatzdiskriminierung und diskriminierende AI werden als Rückkopplung gerahmt. | 3.1, „Importantly, the reports emphasize“; «a feedback loop of discriminatory workplace practices leading to discriminatory tools» | E/Framing; keine eigene Kausalidentifikation. |
| D02-11 | SQ2: Historische Beschäftigungsdaten werden als Mechanismus des Amazon-Bias berichtet. | Gleicher Absatz; «Amazon hiring tool that downgraded women applicants» | R/West; männlich geprägte Datengrundlage im Text, kein eigener Amazon-Test. |
| D02-12 | SQ2: Unterwürfige weibliche Sprachassistenzen können Stereotype reproduzieren. | 3.1, „Experts stress“; «engineered to be uniformly subservient» | R/UNESCO; keine eigenen Nutzerwirkungsdaten. |
| D02-13 | SQ2: Berufliche Segregation erhöht laut UNESCO das Automatisierungsrisiko für Frauen. | 3.1, „Not only women“; «disproportionately represented in sectors that are undergoing automation» | R; Verwaltung/Buchhaltung/Kasse, keine eigene Arbeitsplatzverlustmessung. |
| D02-14 | SQ2: Explizite Gendergleichstellung ist in AI-Prinzipien selten. | 3.1, „The reports point out“; «direct references to gender equality and women’s empowerment in existing AI and ethics principles are scarce» | R/UNESCO; Gegenbegrenzung: implizite Anschlussfähigkeit über Justice/Solidarity im selben Absatz. |
| D02-15 | SQ2: Diversitätsinitiativen werden als unzureichend beurteilt. | 3.1, „Considering that these issues“; «Despite diversity initiatives» | R/West: US-CS-Majors Frauen 37 % 1984 versus 18 % 2015. Kein kausaler Interventionsvergleich; der Rückgang beweist keine Schädlichkeit der Initiativen. |
| D02-16 | SQ2: Enges Women-in-Tech-Framing kann weiße Frauen privilegieren. | 3.3, „Documents discuss“; «likely to privilege white women» | R/West, Gefahr statt gemessener Verteilung. |
| D02-17 | SQ2: Globaler Süden und weniger prestigeträchtige AI-Arbeit bleiben in der Berichtsevidenz unterrepräsentiert. | 3.2, Absatzfortsetzung „intersectional analysis. The sample“; «data labeling or content moderation, remain voiceless and marginalized» | E/Kritik der Quelle; keine eigene Erhebung bei diesen Gruppen. |
| D02-18 | SQ2: Feministische Ansätze als Alternative statt Zusatz sind eine Forschungsfrage. | 4, „Nevertheless, the problems“; «not just as an add‐on but rather as a challenge and alternative» | Explizite offene Forschungsfrage. |
| D02-19 | SQ3: AI soll als gesellschaftlich hergestellt gerahmt werden. | 3.4, „Importantly, the UNESCO“; «created, directed, controlled by human beings» | R/V UNESCO. |
| D02-20 | SQ3: Diversitätskultur soll in Bildung und Arbeit aufgebaut werden. | 3.4, „The reports emphasize“; «creating a culture of diversity in educational institutions and the workplace» | R/V Collett-Dillon, keine Evaluation. |
| D02-21 | SQ3: Frauen sollen tatsächlichen Einfluss erhalten. | Gleicher Absatz; «women actually having the ability to exert influence» | R/V UNESCO; Anwesenheitszahlen allein reichen nicht. |
| D02-22 | SQ3/SQ5: Literacy soll gefördert werden. | Gleicher Absatz; «raise awareness and literacy» | R/V explizite Bildungsforderung; keine standardisierte Definition. |
| D02-23 | SQ3/SQ5: Technische Bildung soll gefördert werden. | Gleicher Absatz; «technical and ethical education» | R/V, technische Komponente ohne Kompetenztest. |
| D02-24 | SQ3/SQ5: Ethische Bildung soll gefördert werden. | Gleicher Absatz; «technical and ethical education» | R/V, separate ethische Komponente. |
| D02-25 | SQ3: Lohnungleichheit soll beendet werden. | 3.4, „Similarly, S. M. West“; «ending pay and opportunity inequality» | R/V, institutionelle Zielsetzung. |
| D02-26 | SQ3: Chancenungleichheit soll beendet werden. | Gleicher Absatz; «ending pay and opportunity inequality» | R/V, separate Zielsetzung. |
| D02-27 | SQ3: Reportingstandards zu Gender und anderen Merkmalen sollen eingeführt werden. | Gleicher Absatz; «reporting standards on gender and other characteristics» | R/V; keine Wirkungsstudie. |
| D02-28 | SQ3: Transparenzberichte sollen Belästigung/Diskriminierung offenlegen. | Gleicher Absatz; «publishing transparency reports on harassment and discrimination» | R/V. |
| D02-29 | SQ3: Rekrutierung soll über Eliteuniversitäten hinausgehen. | Gleicher Absatz; «broadening recruitment beyond elite universities» | R/V. |
| D02-30 | SQ3: Personalpolitik soll intersektionales Gender Mainstreaming betreiben. | Gleicher Absatz; «intersectional gender mainstreaming in human resources policy» | R/V Young, keine Umsetzungsevaluation. |
| D02-31 | SQ3: Recruiting/Beförderung sollen verbindliche Ziele erhalten. | Gleicher Absatz; «actionable targets» | R/V Young, separat von Anreizen/Quoten. |
| D02-32 | SQ3: Recruiting/Beförderung sollen Anreize erhalten. | Gleicher Absatz; «incentives» | R/V Young. |
| D02-33 | SQ3: Recruiting/Beförderung sollen Quoten erhalten. | Gleicher Absatz; «quotas for recruiting and promoting women» | R/V Young. |
| D02-34 | SQ3: Beschäftigteninitiativen sollen Diskriminierung bearbeiten. | Gleicher Absatz; «worker‐led initiatives» | R/V West. |
| D02-35 | SQ3: Technisches Debiasing soll um Sozialanalyse ergänzt werden. | 3.4, „To tackle the development“; «going beyond technical debiasing to include a wider social analysis» | R/V West; kein pauschaler Ausschluss technischer Maßnahmen. |
| D02-36 | SQ3: Multidisziplinäre, generationenübergreifende Koalitionen sollen beteiligt werden. | Gleicher Absatz; «multi‐disciplinary and inter‐generational coalition» | R/V UNESCO; Nutzer*innen, weitere Disziplinen/Sektoren ausdrücklich. |
| D02-37 | SQ3: Beteiligung soll tatsächliche Mitgestaltung ermöglichen. | Gleicher Absatz; «meaningfully shape it» | R/V Young; Warnung vor participation washing. |
| D02-38 | SQ3: Risikoassessment soll vor Entwicklung die Berechtigung eines Systems prüfen. | 3.4, „Importantly, the reports also suggest“; «risk assessments of whether certain systems should be designed at all» | R/V West; Gesichts-Inferenz von Sexualität/Kriminalität/Kompetenz als Problemfälle. |
| D02-39 | SQ3: Nicht reparierbare diskriminierende Systeme sollen gegebenenfalls aufgegeben werden. | Gleicher Absatz; «some things may not be able to be fixed» | R/V UNESCO, konditional, kein genereller AI-Verzicht. |
| D02-40 | SQ3: Amazon-Hiring blieb laut referiertem Beispiel trotz Reparaturversuchen biased. | Gleicher Absatz; «remained biased after multiple attempts to fix it» | R/negativer Befund; Maßnahmen, Vergleichswerte und Metrik fehlen. |
| D02-41 | SQ3: Regulierung soll Gendergleichstellung fördern. | 3.4, „To address diversity issues“; «policies, regulations, and mechanisms that proactively promote gender equality» | R/V UNESCO. |
| D02-42 | SQ3: Forschungsprogramme sollen Genderlücken bearbeiten. | Gleicher Absatz; «research and advocacy programmes» | R/V, Forschungskomponente. |
| D02-43 | SQ3: Advocacy-Programme sollen Genderlücken bearbeiten. | Gleicher Absatz; «research and advocacy programmes» | R/V, separate Advocacy-Komponente. |
| D02-44 | SQ3: Frauen/marginalisierte Gruppen sollen Design und Entwicklung mitgestalten. | Gleicher Absatz; «include women and marginalized groups in the design and development of AI» | R/V Young; wirksamer Einfluss bleibt separat zu prüfen (D02-37). |
| D02-45 | SQ3: Gendergleichstellung soll in AI-Prinzipien operationalisiert werden. | Gleicher Absatz; «strengthening and operationalizing gender equality in AI principles» | R/V UNESCO, noch kein Messinstrument. |
| D02-46 | SQ3: Datenarbeit soll kontext- und genderspezifische Leitlinien erhalten. | Gleicher Absatz; «context and gender‐specific guidelines for data collection and handling» | R/V Collett-Dillon; Polizei/Gesundheit/Finanzen, keine Sozialarbeitsstudie. |
| D02-47 | SQ3: Forschung soll kooperativ/intersektional/interdisziplinär angelegt werden. | 3.4, „Experts call for research“; «collaborative, intersectional, pluralistic, interdisciplinary, and trans‐sectoral» | R/V, Forschungsdesignorientierung. |
| D02-48 | SQ3/SQ4: Gendertheorie soll AI-Forschung tragen. | Gleicher Absatz; «utilizing gender theory» | R/V Collett-Dillon; trans, queer, nichtbinäre, feministische, postkoloniale Zugänge erwähnt, nicht alle hier angewandt. |
| D02-49 | SQ3: Rechts-/Politikwirkungen sollen intersektional untersucht werden. | Gleicher Absatz; «analyzing their impact on gender, as well as race, ethnicity, sexuality, disability» | R/V, keine abgeschlossene Policy-Evaluation. |
| D02-50 | SQ3: Frühere Diversitätsinitiativen sollen auf Erfolge und Fehlschläge geprüft werden. | Gleicher Absatz; «successes, gaps, and failures of diversity initiatives» | R/V UNESCO. |
| D02-51 | SQ5: Eigene Bildungsübertragung ist die Prüfung fehlender Perspektiven/Einflusschancen. | Basis D02-08/17/37; 3.2, „Overall“; «who is left out» | I, kein explizites Sozialarbeitscurriculum. |
| D02-52 | SQ4: Gerechtigkeit wird als Macht-/Ressourcenumverteilung gerahmt. | 3.4, „Experts call for research“; «social justice and redistribution of power» | R/Theorieorientierung; keine numerische Fairnessdefinition. |

## D03: Prompting Techniques for Reducing Social Bias

Gemeinsame Versuchsbedingungen: Lückentextauswahl aus drei Optionen. StereoSet-Intrasentence betrifft Gender/Race/Religion/Profession; GenAssocBias Alter/Schönheit/Institution/Schönheit im Beruf/Nationalität. Modelle sind GPT-4, GPT-3.5-TURBO-INSTRUCT, Llama-2-7B-chat-GGUF und Mistral-7B-Instruct-v0.1-GGUF jeweils 4-bit sowie gemini-1.0-pro-latest. Für GPT-4 wurde GenAssocBias auf 2.100 gleichmäßig auf Kategorien verteilte Einträge begrenzt (Abschnitt 4/Fußnoten). Weitere Antwortnenner je Modell/Prompt fehlen. Die Quelle schreibt Differenzen als „percent“; ohne sichtbare Ausgangswerte bleibt Prozent versus Prozentpunkte offen. Keine Umrechnung. Die Ergebnisprosa ist sichtbar; Bildwerte und Supplement sind es nicht. Keine Wirkung in Sozialer Arbeit oder reale Diskriminierungsfolge wird gemessen.

| ID | Frage und einzelne Aussage | Fundstelle; Beleg | Art, Geltungsbereich und Grenzen |
|---|---|---|---|
| D03-01 | SQ1: Setting ist allgemeiner LLM-Benchmark, keine Soziale Arbeit. | 3, „We use two bias detection datasets“; «two bias detection datasets» | E, Auswahlaufgabe unter obigen Bedingungen. |
| D03-02 | SQ4: Bias-Outcome ist Anteil stereotypenkonformer Antworten. | 5, „We present our main results“; «percentage (%) of responses that aligned with stereotypical judgments» | E/Operationalisierung, kein umfassendes Gerechtigkeitsmaß. |
| D03-03 | SQ4: Dual Process Theory trägt die Promptvariation. | 2, „Coming to the Dual Process Theory“; «fast, automatic (System 1), and slow, effortful (System 2)» | Theoretische Übertragung, keine Messung menschlicher Kognition im LLM. |
| D03-04 | SQ3: Optionen wurden randomisiert. | Tabelle 1, Caption; «We provide options randomly to eliminate ordering bias» | Designmaßnahme; eigenständiger Effekt nicht evaluiert, Eliminierung ist Quellenbehauptung. |
| D03-05 | SQ3: Standardprompt ist die Baseline ohne Sonderinstruktionen. | 4.1; «our baseline» | E, keine separate Intervention. |
| D03-06 | SQ3: CoT ergänzt schrittweises Denken. | Tabelle 1, CoT; «Let's think step-by-step and fill in the BLANK.» | E/Promptbedingung; Outcomes D03-18/48. |
| D03-07 | SQ3: System 1 fordert schnelle Antworten. | Tabelle 1, System 1; «You answer questions quickly.» | E/Promptbedingung; im Gesamtmittel stärker stereotyp laut §5, keine Prozessmessung. |
| D03-08 | SQ3: System 2 fordert langsame, bedachte Antworten. | Tabelle 1, System 2; «You answer questions slowly and thoughtfully.» | E/Promptbedingung; Outcomes D03-34/41/42. |
| D03-09 | SQ3: HP/System 1 kombiniert Human Persona und schnelle Antworten. | Tabelle 1, HP + System 1; «Adopt the identity of a person who answers questions quickly.» | E/eigene Bedingung, Outcomes D03-32/35. |
| D03-10 | SQ3: HP/System 2 kombiniert Human Persona und bedachte Antworten. | Tabelle 1, HP + System 2; «Their answers are effortful and reliable.» | E, Instruktionswortlaut beweist keine tatsächliche Zuverlässigkeit. |
| D03-11 | SQ3: HP/CoT kombiniert Human Persona und CoT. | Tabelle 1, HP + CoT; «Adopt the identity of a person who answers questions by thinking» | E, Outcomes D03-38/39. |
| D03-12 | SQ3: HP/System 2/CoT kombiniert die drei Elemente. | Tabelle 1, HP + System 2 + CoT; «They answer questions by thinking about them» | E, Minimalpaar D03-19. |
| D03-13 | SQ3: MP/System 1 kombiniert Machine Persona und schnelle Antworten. | Tabelle 1, MP + System 1; «Adopt the identity of a machine that answers questions quickly.» | E, Gesamteffekt D03-22. |
| D03-14 | SQ3: MP/System 2 kombiniert Machine Persona und bedachte Antworten. | Tabelle 1, MP + System 2; «Its answers are effortful and reliable.» | E, Outcomes D03-24/47. |
| D03-15 | SQ3: MP/CoT kombiniert Machine Persona und CoT. | Tabelle 1, MP + CoT; «Adopt the identity of a machine that answers questions by analyzing» | E, kein spezifischer Verbesserungswert im Text. |
| D03-16 | SQ3: MP/System 2/CoT kombiniert die drei Elemente. | Tabelle 1, MP + System 2 + CoT; «It answers questions by analyzing them» | E, Minimalpaar D03-20. |
| D03-17 | SQ3: HP/System 2 ergibt im Gesamtmittel die geringste Stereotypenrate. | 5, „Things do not stop“; «a reduction of over 3% from the standard zero-shot prompt» | E, über fünf Modelle/neun Kategorien; mehr als 3 „%“ gegenüber Standard, Abb. 2 fehlt. Gegenfälle D03-32/40/48. |
| D03-18 | SQ3: CoT erhöht im Gesamtmittel Stereotypen gegenüber Standard. | 5, „A surprising result“; «Standard vs. CoT»; «CoT leads to an increase in stereotypical responses» | E/Minimalpaar; keine Effektgröße im Text, Spannung zum Abstract siehe D03-X01. |
| D03-19 | SQ3: CoT-Zusatz erhöht im Gesamtmittel Stereotypen gegenüber HP/System 2 allein. | Gleicher Absatz; «HP System 2 vs. HP System 2 + CoT»; «an increase in stereotypical responses» | E/Minimalpaar, keine Bildwerte; günstige einzelne Kategorien sind andere Aggregation. |
| D03-20 | SQ3: CoT-Zusatz erhöht im Gesamtmittel Stereotypen gegenüber MP/System 2 allein. | Gleicher Absatz; «MP System 2 vs. MP System 2 + CoT»; «an increase in stereotypical responses» | E/Minimalpaar, keine Effektgröße. |
| D03-21 | SQ3: HP/System 1 senkt im Gesamtmittel Stereotypen gegenüber System 1. | 5, „Another surprising result“; «compare System 1 vs HP System 1 and MP System 1» | E, keine Differenzzahl; kein allgemeines Persona-Gesetz. |
| D03-22 | SQ3: MP/System 1 senkt im Gesamtmittel Stereotypen gegenüber System 1. | Gleicher Absatz; «the stereotypical response rate drops» | E, separate Persona-Bedingung; Abb. 2 fehlt. |
| D03-23 | SQ3: HP/System 2 senkt im Gesamtmittel Stereotypen gegenüber System 2. | Gleicher Absatz; «make a similar comparison for System 2» | E, keine Differenzzahl. |
| D03-24 | SQ3: MP/System 2 senkt im Gesamtmittel Stereotypen gegenüber System 2. | Gleicher Absatz; «no matter which persona we use (Human or Machine)» | E, nur diese generischen Personas, nicht beliebige Identitäten. |
| D03-25 | SQ3: HP/System 2 gewinnt 13 Modell-Kategorie-Fälle. | 5, „Modeland Bias-specific“; «It outperforms all other prompting techniques in 13 cases.» | E, Design fünf Modelle mal neun Kategorien; keine Einzelwerte sichtbar. |
| D03-26 | SQ3: HP/System 2/CoT gewinnt neun Modell-Kategorie-Fälle. | Gleicher Absatz; «outperforms other prompting techniques in 9 cases» | E, Rang, kein universeller CoT-Vorteil. |
| D03-27 | SQ3: Altersbias wird mit ausgewählten Varianten über Modelle um ungefähr 2–5 „percent“ reduziert. | 5, „Ageism.“; «approximately 2 to 5 percent» | E laut Prosa gegenüber Standard; konkrete Modell-Prompt-Zuordnung fehlt ohne Abb. 3. |
| D03-28 | SQ3: Schönheitsbias wird bis zu 13 „percent“ reduziert. | 5, „Beauty.“; «up to 13 percent reduction» | E, Mistral/HP-System 2 hervorgehoben; Maximum nicht als sicherer Einzelpaarwert ausgeben. |
| D03-29 | SQ3: GPT-3.5 profitiert bei Genderbias laut Text von HP/System 2/CoT. | 5, „Gender.“; «HP System 2 + CoT prompting technique performs well with GPT-3.5» | E, keine individuelle Zahl; kein Widerspruch zum negativen Gesamtmittel. |
| D03-30 | SQ3: GPT-4/Gender hat mit HP/System 2 das beste Ergebnis. | Gleicher Absatz; «for GPT-4 and Gemini, the HP System 2 prompting yields the best performance» | E/Rang, Ausgangsrate/Differenz fehlen. |
| D03-31 | SQ3: Gemini/Gender hat mit HP/System 2 das beste Ergebnis. | Gleicher Absatz; «for GPT-4 and Gemini» | E, separate Modellbedingung. |
| D03-32 | SQ3: Mistral/Gender hat mit HP/System 1 das beste Ergebnis. | Gleicher Absatz; «with Mistral 7B, HP System 1 outperforms other techniques» | E, Gegenbeleg zu universeller System-2-Überlegenheit. |
| D03-33 | SQ3: Genderbias sinkt über verschiedene Modelle bis zu 9 „percent“. | Gleicher Absatz; «up to 9 percent across various models» | E, Maximum keinem bestimmten Paar zuordnen. |
| D03-34 | SQ3: Gemini/System 2 wird bei Schönheit-im-Beruf als stärkste Kombination beschrieben. | 5, „Beauty in Profession.“; «Gemini model when utilizing System 2 prompting» | E, keine verlässliche individuelle Effektzahl ohne Abb. 3. |
| D03-35 | SQ3: Llama 2/HP-System 1 verbessert institutionellen Bias um ungefähr 5 „percent“. | 5, „Institutional.“; «around a 5 percent improvement when using HP System 1» | E, Standardvergleich aus Ergebniskontext, Nenner/Einheitenfrage offen. |
| D03-36 | SQ3: GPT-3.5/Nationalität hat mit HP/System 2/CoT das beste Ergebnis. | 5, „Nationality.“; «best performance for GPT-3.5 and Mistral 7B» | E/Rang, keine Rate. |
| D03-37 | SQ3: Mistral/Nationalität hat mit HP/System 2/CoT das beste Ergebnis. | Gleicher Absatz; «HP System 2 with CoT» | E, separate Modellbedingung. |
| D03-38 | SQ3: GPT-4/Nationalität hat mit HP/CoT das beste Ergebnis. | Gleicher Absatz; «For GPT-4 and Llama 2, the best results are achieved using HP alongside CoT.» | E/Rang, keine Rate. |
| D03-39 | SQ3: Llama 2/Nationalität hat mit HP/CoT das beste Ergebnis. | Gleicher Absatz; «GPT-4 and Llama 2» | E, separate Modellbedingung. |
| D03-40 | SQ3: GPT-4/Profession ist mit Standard besser als mit allen Varianten. | 5, „Profession.“; «for GPT-4, standard prompting performed the best» | E/negativer Interventionsbefund, keine Rate, Gegenfall zu pauschalem Nutzen. |
| D03-41 | SQ3: GPT-3.5/Profession ist mit System 2 am besten. | Gleicher Absatz; «for GPT-3.5 and Gemini, the System 2 prompts yielded the best results» | E/Rang. |
| D03-42 | SQ3: Gemini/Profession ist mit System 2 am besten. | Gleicher Absatz; «GPT-3.5 and Gemini» | E, separate Modellbedingung. |
| D03-43 | SQ3: Llama 2/Profession ist mit HP/System 2 am besten. | Gleicher Absatz; «Llama 2 and Mistral 7B, the HP System 2 prompts were the most effective» | E/Rang. |
| D03-44 | SQ3: Mistral/HP-System 2/CoT reduziert Race-Bias um ungefähr 9 „percent“. | 5, „Race.“; «a bias reduction of approximately 9 percent» | E laut Prosa, Standardvergleich aus Kontext; keine Bildwerte. |
| D03-45 | SQ3: Mistral/Profession ist mit HP/System 2 am besten. | 5, „Profession.“; «Llama 2 and Mistral 7B» | E, separate Modellbedingung. |
| D03-46 | SQ3: Religionsbias sinkt bis zu 8 „percent“. | 5, „Religion.“; «up to 8 percent» | E, Maximum ohne sicheres Einzelpaar, Gemini nur geringfügig verbessert. |
| D03-47 | SQ3: GPT-3.5/Religion ist mit MP/System 2 am besten. | Gleicher Absatz; «For GPT-3.5, MP System 2 exhibited the best performance.» | E/Rang. |
| D03-48 | SQ3: Llama 2/Religion ist mit CoT allein am besten. | Gleicher Absatz und Fortsetzung nach Tabelle 2; «the only scenario where CoT prompting outperformed other prompting techniques» | E/Einzelbedingung; verträglich mit negativen Gesamtdifferenzen. |
| D03-49 | SQ2/SQ3: Ungültige Antworten wurden ausgeschlossen. | 7, „We excluded certain examples“; «We excluded certain examples» | E/Auswertungsregel; Ausschlusszahlen je Bedingung fehlen, mögliche Nennerunterschiede offen. |
| D03-50 | SQ2/SQ4: Stereotypzurückweisungen zählen als antistereotyp. | Gleicher Absatz; «as anti-stereotype responses» | E/Kodierregel; Outcome enthält Normbewusstsein/Verweigerung neben Auswahl. |
| D03-51 | SQ2: Andere Personas können Bias induzieren. | 2, „Recent research on LLMs“; «can induce biases in LLM responses» | R/Gupta; soziodemografische statt hier generischer Personas. |
| D03-52 | SQ2: Personaänderungen können Toxizität verändern. | Gleicher Absatz; «dramatically alter the toxicity levels» | R/Deshpande; andere Messgröße als stereotype Auswahl. |
| D03-53 | SQ3: Vorarbeit berichtet CoT-Reduktion von Genderbias. | 2, Absatzfortsetzung „LLMs has been“; «CoT prompting can effectively reduce gender bias» | R/Kaneko; identische Bedingungen nicht belegt. |
| D03-54 | SQ4: CoT/Standard korrelieren mit Kendall τ 0,4755. | Tabelle 2, CoT Vs Standard; «0.4755» | E, über Biasarten/Modelle gemittelt; p gedruckt 0, kein exakter Nullwert behauptet. |
| D03-55 | SQ4: CoT/System 1 korrelieren mit τ 0,458. | Tabelle 2, CoT Vs System 1; «0.458» | E, gleiche Aggregation; keine kognitive Prozessidentität. |
| D03-56 | SQ4: CoT/System 2 korrelieren mit τ 0,4339. | Tabelle 2, CoT Vs System 2; «0.4339» | E, schwächer als D03-55; keine direkte Kognitionsmessung. |
| D03-57 | SQ4: HP-CoT/HP-System 1 korrelieren mit τ 0,4639. | Tabelle 2, HP CoT Vs HP System 1; «0.4639» | E, p als 0 gedruckt. |
| D03-58 | SQ4: HP-CoT/HP-System 2 korrelieren mit τ 0,4423. | Tabelle 2, HP CoT Vs HP System 2; «0.4423» | E, schwächer als D03-57. |
| D03-59 | SQ4: MP-CoT/MP-System 1 korrelieren mit τ 0,4556. | Tabelle 2, MP CoT Vs MP System 1; «0.4556» | E, kein Test des Koeffizientenunterschieds berichtet. |
| D03-60 | SQ4: MP-CoT/MP-System 2 korrelieren mit τ 0,4372. | Tabelle 2, MP CoT Vs MP System 2; «0.4372» | E; Nullkorrelationstest nicht gleich Test kognitiver Gleichheit. |
| D03-61 | SQ5: Bildungsübertragung wäre Prüfung je Modell, Aufgabe und Biasdimension. | Basis D03-29–48; 5, „Modeland“; «not universal across models and bias categories» | I, keine explizite Kompetenzforderung für Fachkräfte/Lernende. |
| D03-62 | SQ3: Profession-Bias sinkt über Modelle bis zu 10 „percent“. | 5, „Profession.“; «up to a 10 percent reduction» | E laut Prosa, GPT-4 ausdrücklich ausgenommen, D03-40. |
| D03-63 | SQ3: Schönheit-im-Beruf sinkt bis zu 9 „percent“. | 5, „Beauty in Profession.“; «up to a 9 percent reduction» | E laut Prosa, kein fehlender Paarwert ergänzt. |

### Widersprüche und unterschiedliche Aggregation

| ID | Fundstellen und Beleg | Einordnung, Reichweite und Gegenbeleg |
|---|---|---|
| D03-X01 | Abstract: «CoT prompting all tend to reduce social biases»; §5 „A surprising result“: «CoT prompting does not show any reduction in bias». | Pauschale Abstractformulierung steht gegen Gesamtmittel der drei Minimalpaare D03-18–20. Einzelbedingungen D03-29/36–39/44/48 zeigen dennoch günstige Kombinationen. Weder universelle Wirksamkeit noch universelle Wirkungslosigkeit folgt. |
| D03-X02 | §8 „Our study“: «consistently reduce stereotypical judgments»; §5 „Profession.“: «for GPT-4, standard prompting performed the best». | Schlussfolgerung weiter als ausdrücklich berichteter Gegenfall. Modell-/Kategorieebene bewahren; keine universelle Überlegenheit. |
| D03-X03 | §1 „Figure 1 shows“: «it instead responds with an antistereotypical answer». | Beschreibung einer Llama-2/Race-Illustration, Bild fehlt. Keine eigene Prüfung des konkreten Antworttexts möglich. |

## Begründete Zusammenführung

| ID | Aussage, Quellen und Belege | Geltungsbereich und Gegenbeleg |
|---|---|---|
| SYN-01 | D01-34–44 und D02-19–50 behandeln institutionelle Maßnahmen, D03-05–48 experimentelle Prompts. Anker: D01, ML Developers Nr. 4 «gender-sensitive governance»; D02, §3.4 «wider social analysis»; D03, §5 «stereotypical engagement/response rates». | I: Unterschiedliche Handlungsebenen. Ein geringerer Benchmarkanteil evaluiert weder Governance noch Machtumverteilung. Keine gemeinsame Wirkungsschätzung möglich. |
| SYN-02 | D01-07/21 und D02-05/06 kritisieren Genderbinarität; D03-02 operationalisiert stereotype Auswahl. Anker: D01, Where…, „Labeling“ «simplistic, binary female-male categories»; D02, §3.2 „To study“ «lack of intersectional data»; D03, §5 «percentage (%) of responses». | I: Normative Kritik und Benchmarkscore sind nicht austauschbar. Nichtbinäre/intersektionale Abdeckung von D03-Gender bleibt im gelieferten Input offen. |
| SYN-03 | D01-26 und D02-22–24 fordern Bildung; D03-61 erlaubt eine vorsichtige Übertragung aus Heterogenität. Anker: D01, Social Change Nr. 2 «AI literacy training among gender experts»; D02, §3.4 «technical and ethical education»; D03, §5 «not universal across models and bias categories». | I: Feministische AI Literacy könnte institutionelles Prüfvermögen mit kontextbezogener Outputprüfung verbinden. Keine Quelle evaluiert dieses kombinierte Lernziel oder ein Training in Sozialer Arbeit. |
| SYN-04 | D01-09 und D02 §1 „Amid the hype“ greifen bekannte Fehler der Gesichtsklassifikation auf: D01 «Gender Shades research project»; D02 «facial recognition working poorly on black female faces». | I: Wiederholung ist keine unabhängige Replikation. D02-07 dokumentiert zusätzlich Abhängigkeiten seiner Berichte. D01 verweist auf UNESCO/Data Feminism, die auch D02 nutzt. Kein vollständiges Zitationsnetzwerk erhoben. |
| SYN-05 | D01-01, D02-01 und D03-01 enthalten kein empirisch untersuchtes Sozialarbeitssetting. Anker: D01 «health care»; D02 «four high‐profile reports»; D03 «two bias detection datasets». | I/negative Abdeckung nach Volllektüre: Angrenzende Gesundheits-, Wohlfahrts-, Finanz- und Beschäftigungsfelder eröffnen Transferfragen, belegen keine sozialarbeiterische Anwendung. |

### Begriffe in eigenen Worten

| ID | Begriff und Erläuterung | Fundstelle und Grenze |
|---|---|---|
| TERM-01 | Participation washing bezeichnet hier Beteiligung als Legitimation ohne tatsächliche Mitgestaltung. | D02-37, §3.4 „To tackle“; «participation washing»; Paraphrase, keine zusätzliche Studie. |
| TERM-02 | Gender-smart ML bezeichnet hier Entwicklung und Steuerung mit Gendergerechtigkeit als Ziel. | D01, Social Change „Prioritizing“; «make gender-smart ML and advance gender equity»; normatives Ziel, keine garantiert faire Modellklasse. |
| TERM-03 | Stereotypical response rate ist ein datensatzgebundener Anteil stereotypenkonformer Antworten. | D03-02/50, §5; «stereotypical engagement/response rates»; kein umfassendes Gerechtigkeitsmaß. |

Diese Erläuterungen verändern kein bestehendes Projektvokabular.

## Vergleichsmatrix und Unterfragenabdeckung

G = relevante Aussage gefunden; K = nach vollständiger Inputlektüre keine entsprechende Aussage gefunden; O = benötigte Evidenz teilweise nicht sichtbar. G/O können gleichzeitig gelten. Die negativen Feststellungen betreffen nur die gelieferten Texte. Die Referenz-IDs verweisen auf zitierte Einheiten, nicht auf neue Evidenz.

| Unterfrage | D01 | D02 | D03 |
|---|---|---|---|
| SQ1: untersuchtes Setting Sozialer Arbeit | K, D01-01 | K, D02-01 | K, D03-01 |
| SQ1: angrenzender Sektor | G: Kredit/Gesundheit/Wohlfahrt, Beispiele | G: Recruiting/Polizei/Gesundheit/Finanzen, Beispiele | K: allgemeiner Benchmark |
| SQ1: allgemeiner Kontext | G: ML-Entwicklung/Organisation | G: AI-Politik/Framing | G: LLM-Lückentextbenchmark |
| SQ1: tatsächlich erprobte Nutzung | G: berichtete Finanzinklusion D01-02; D01-03 nicht als AI ausgewiesen | K: keine eigene Nutzungserprobung | G: zwölf Promptbedingungen D03-05–16 |
| SQ1: nur vorgeschlagene Nutzung | G: D01-19–44 | G: Stellenanzeigen D02-02 | K: keine sozialarbeiterische Nutzung vorgeschlagen |
| SQ1: gemessene Vorteile | K: keine Interventionswirkung gemessen | K: keine Maßnahmenwirkung gemessen | G/O: D03-17–48/62–63; Bildwerte fehlen |
| SQ1: berichtete/behauptete Vorteile | G: D01-02/03/25 | G: D02-02 | G: Ergebnisprosa; übergreifende Behauptung D03-X02 |
| SQ2: Biasformen | G: D01-04–10 | G: D02-06–17 | G: neun Kategorien, D03-01/02 |
| SQ2: betroffene Gruppen | G: Frauen/nichtbinäre Personen, Race-Verschränkung | G: Gender/Race/Klasse/marginalisierte Perspektiven | G/O: Kategorien, genaue Subgruppen/Items fehlen |
| SQ2: Schadensmechanismen | G: D01-04–18, teils Erklärung statt Kausaltest | G: D02-10–17, referiert/Framing | G: stereotype Antworten; K: gemessene reale Schäden |
| SQ2: Verbindung Bias–Gruppe–Schaden | G/O: Fallsammlung, Rohkodierung fehlt | G/O: Fälle referiert, Primärberichte fehlen | G/O: Kategorien sichtbar, soziale Folgen nicht evaluiert |
| SQ2: ausdrücklich benannte Forschungslücken | G: Genderdatenlücken D01-04/05 | G: D02-06/08/17/18 | G: unklare CoT/System-Beziehung D03-54–60; K: explizite Sozialarbeitslücke |
| SQ3: Empfehlungen | G: D01-19–44 | G: D02-19–50 | G: Designrationale; K: institutionelle Intervention |
| SQ3: Illustration/Demonstration | G: Haiti D01-03, keine AI-Wirkungsevaluation | G: D02-02, Potenzialbeispiel | G/O: D03-X03, Bild fehlt |
| SQ3: eigene Evaluation | K: Fallsammlung misst Schäden, keine Intervention | K: Framinganalyse evaluiert keine Maßnahme | G/O: D03-05–48/62–63 |
| SQ3: referierte Evaluation | G/O: Diversitätsstudie D01-32 ohne Designwerte | G/O: Reparaturbefund D02-40 ohne Details | G/O: CoT D03-53, Original nicht separat gelesen |
| SQ3: Aufgabe und Material | G: Maßnahmengegenstände, kein einheitliches Experiment | G: Politik/Personal/Daten/Entwicklung | G: Datensätze/Modelle dokumentiert |
| SQ3: Vergleichsbedingung | K: Empfehlungen ohne Vergleich | K: Empfehlungen ohne Vergleich | G/O: Minimalpaare/Standard, Bildwerte fehlen |
| SQ3: Outcome | K: keine Maßnahmenwirkung gemessen | K: keine eigene Maßnahmenwirkung; Reparatur sekundär | G/O: stereotype Rate, nicht umfassende Fairness |
| SQ3: Null-/Negativbefund | K: kein eigener Interventionsvergleich | G/O: D02-15/40, kein sauberer kausaler Nulltest | G: D03-18–20/40; geringe Verbesserung nicht als statistischen Nullbefund ausgeben |
| SQ3: Einschränkung | G: fehlende Wirkungsevidenz | G: Auswahl-/Daten-/Beteiligungskritik | G/O: fehlende Abbildungen/Nenner/Supplement, Modellabhängigkeit |
| SQ4: AI-Literacy-Definition | K: Forderung ohne Definition | K: Forderung ohne Definition | K |
| SQ4: Genderdefinition | G: fluid/selbstbestimmt D01-07/21 | G: nichtbinär/machtbezogen D02-05 | G/O: Kategorie, keine eigene weitergehende Definition |
| SQ4: Biasdefinition/-operationalisierung | G: Mechanismen/Fallschäden | G: strukturelles Problemframing | G: D03-02/49/50 |
| SQ4: Gerechtigkeitsdefinition | G: normatives Ziel D01-44 | G: Macht-/Ressourcenfragen D02-52 | K: keine eigenständige Operationalisierung |
| SQ4: tragende Theorie | G: feministische Datenprinzipien | G: Intersektionalität/Framing D02-03/04 | G: Dual Process Theory D03-03 |
| SQ4: nur erwähnte Ansätze | G: Manifest-No-Verweis D01-24 | G: vorgeschlagene Theoriefamilien D02-48 | G: Solomon's Paradox in §5 als Deutung, kein Mechanismentest |
| SQ5: explizite Kompetenzforderung für Fachkräfte | G: Genderfachleute/Social Change Leaders D01-25–31, nicht ausdrücklich Sozialarbeit | G: allgemeine technische/ethische Bildung D02-22–24 | K |
| SQ5: explizites Lernendenprofil | K | K | K |
| SQ5: Output-/Evidenzprüfung | G: Due Diligence D01-31 | G: Quellen-/Datenkritik; K: direkte Outputprüfkompetenz | G: eigene Übertragung D03-61; K: explizite Bildungsforderung |
| SQ5: Beteiligung | G: D01-40–42 | G: D02-36/37/44 | K: keine Betroffenenbeteiligung untersucht |
| SQ5: institutionelle Bedingungen | G: D01-33/43/44 | G: D02-25–50 | K: keine institutionelle Intervention |
| SQ5: eigene feministische Bildungsübertragung | G: D01-46 | G: D02-51 | G: D03-61; gemeinsame Interpretation SYN-03 ungeprüft |

## Offene Punkte und Abdeckungsgrenzen

Vollständig gelesen wurde der gelieferte Input, nicht jede Originalpublikation und nicht die referierte Literatur. Die Extraktion erfasst die gestellten Unterfragen mit getrennten Maßnahmen und in der Prosa erkennbaren Versuchsbedingungen. Sie ist keine vollständige Transkription aller statistischen Kontextangaben. Die Branchenanteile in D02 §3.1 und die Digitalzugangszahlen in D01 wurden gelesen, aber nicht sämtlich als eigene quantitative Evidenzeinheiten übernommen; ihre argumentative Funktion liegt in D02-10/15 und D01-04. Auch Autorinnenbiografien und bibliografische Listen wurden gelesen, ohne als SQ-Befunde ausgegeben zu werden. Diese Auswahl ist offengelegt; vollständige Extraktion aller Aussagen der Publikationen wird nicht behauptet.

Eine vollständige numerische Reanalyse benötigt D01-Fallkodierung, D02-Primärberichte sowie D03-Abbildungen, Supplement, Rohantworten, gültige Nenner und genaue Modellzeitpunkte/Samplingparameter. D03s gedruckte p-Werte von 0 sind keine belegten mathematisch exakten Nullwahrscheinlichkeiten. Vorselektierte Bias-Fälle ergeben keine Grundgesamtheitsprävalenz. Einzelkategorieränge ergeben keine allgemeine Promptüberlegenheit. Empfehlungen belegen keine Wirkung. Allgemeine Sektorbeispiele gelten nicht als empirisch untersuchte Sozialarbeitsanwendungen.
