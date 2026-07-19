---
layer: advisory
title: "Vorbereitungsdossier für die bindende Stufe-3-Verifikation der Distillat-Belegketten"
created: 2026-07-18
updated: 2026-07-18
status: draft
---

# Stufe-3-Vorbereitungsdossier, advisory

Dieses Dossier bereitet die bindende menschliche Stufe-3-Verifikation der wartenden Distillate (`research-vault/waitlist.md`) vor. Es trifft keine bindenden Urteile. Jede Empfehlung ist ein advisory Vorschlag mit Fundstelle; die Migrationsentscheidung je Distillat bleibt beim Menschen, konsistent mit der Verantwortungsasymmetrie des Projekts und mit dem Distillat-Prüfplan in `knowledge/research-vault.md` Abschnitt 2. Die Zählungen sind eine Momentaufnahme vom 2026-07-18 aus den lokal vorliegenden, gitignorierten Audit-Artefakten unter `generated/distilled/_evidence_audit/` und aus der Stufe-1b-Auflösung `stage1b_resolution.json`.

Verifikationsquelle für jeden Zitatanspruch ist der konvertierte Volltext in `generated/markdown_clean/`, autoritative Kategoriezuordnung sind die Booleans in `generated/distilled/_stage1_json/`, Kategoriegrenze ist `assessment/categories.yaml`. Wo der Volltext fehlt oder ein fremdes Paper enthält, ist der Anspruch nicht prüfbar; das ist unten so benannt und nicht durch ein Verdikt überdeckt.

## 1. G-Fälle, Polaritätsfehler, vollständig adjudiziert

Alle vier G-Distillate tragen im Stage-1-JSON-Evidenztext selbst eine explizite Verneinung des zugeordneten Kategorienfokus. Der Evidenztext ist damit nicht confabuliert, er ist honest, aber er stützt die geflaggte Kategorie nicht, sondern verneint sie. Die Frage der Stufe 3 ist folglich nicht die Zitattreue, sondern ob das Kategorie-Flag im Stage-1-JSON gegen die Definition in `categories.yaml` zu halten oder zu streichen ist.

| Distillat | Flag | Evidenztext (Stage-1-JSON, wörtlich) | Volltextbefund | Definition-Abgleich | Empfehlung |
|---|---|---|---|---|---|
| `Chiu_2024_What_are_artificial_intelligence_literacy_and` | Gender | "'24 male and 6 female participants' (20% weiblich), aber kein expliziter Gender-Analysefokus" | Volltext nennt "24 male and 6 female participants" nur in der Stichprobenbeschreibung der Lehrkräfte; keine Gender-Analyse | `categories.yaml` Gender verlangt "Expliziter Gender-Fokus", examples_negative nennt genau "Demografische Daten enthalten Geschlecht, aber kein Gender-Fokus" | **Flag streichen** (Gender=false) |
| `Weber_2023_Messung_von_AI_Literacy_–_Empirische_Evidenz_und` | Gender | "Geschlechterverteilung in den Stichproben erfasst (…), aber keine explizite geschlechterspezifische Analyse oder Diskussion von Gender-Unterschieden" | Geschlecht erscheint nur als Demografiezeile der Stichprobentabellen (Weiblich/Männlich/Anderes in Prozent); keine geschlechterspezifische Auswertung | wie Chiu, examples_negative einschlägig | **Flag streichen** (Gender=false) |
| `Tun_2025_Trust_in_artificial_intelligence–based_clinical` | Bias_Ungleichheit | "'algorithmic bias' und 'false positives/negatives' als Vertrauensbarrieren; (…) jedoch keine explizite Analyse sozialer Ungleichheiten" | "algorithmic bias" und "false positives/negatives" verbatim als Vertrauensbarrieren im klinischen Kontext; keine Treffer für inequit/disparit/discrimination/marginal | `categories.yaml` Bias_Ungleichheit verlangt Thematisierung von "Diskriminierung, algorithmischem Bias, soziale Ungleichheit". "algorithmic bias" ist wörtlich benannt, aber als technische Vertrauensbarriere, nicht als soziale Ungleichheit | **Unentscheidbar, Tendenz halten.** Die Kategorie nennt algorithmischen Bias als hinreichend. Der Volltext erwähnt ihn explizit. Ob die rein technische Rahmung ohne soziale Ungleichheitsanalyse die Definition noch trägt, ist eine Grenzentscheidung für den Menschen. Nicht mit Chiu/Weber gleichzusetzen, weil dort der Kategorienbegriff (Gender-Fokus) klar verfehlt ist, hier der Kategorienbegriff (algorithmischer Bias) wörtlich vorkommt. |
| `Xu_2023_Transparency_enhances_positive_perceptions_of` | Diversitaet | "Sample-Charakterisierung nach Rasse/Ethnizität (…), Geschlecht (…) dokumentiert; jedoch keine intersektionalen Analysen" | Race/Ethnizität und Geschlecht nur als Stichprobendemografie; null Treffer für "intersection", "diversity", "representation"; "inclusion" bezieht sich auf statistische Modellinklusion | `categories.yaml` Diversitaet verlangt Thematisierung von "Diversität, Inklusion oder Repräsentation verschiedener Gruppen", examples_negative grenzt reine demografische Zusammensetzung aus | **Flag streichen** (Diversitaet=false) |

Zusatzbefund: Chiu und Xu tragen laut Waitlist zusätzlich offene F-Zitatansprüche unter anderen Kategorien. Diese sind vom G-Urteil unberührt und Teil der F-Restmenge.

## 2. Volltext-Fehlzuordnungen, drei Acquisition-Fehler

Die Volltextidentität ist in allen drei Fällen bestätigt; die Volltextdatei zum Distillat enthält nachweislich ein fremdes Paper. Die echte Quelle wurde quer über `generated/markdown_clean/` gesucht.

| Distillat | Volltextdatei enthält tatsächlich | Bestätigung | Echte Quelle im Korpus | Konsequenz |
|---|---|---|---|---|
| `Kutscher_2023_Positionings,_challenges,_and_ambivalences_in` | Alvarez et al. "Policy advice and best practices on bias and fairness in AI" | Datei-Heading "## Policy advice and best practices on bias and fairness in AI", Autoren Alvarez et al.; identisch zur separaten `Alvarez_2024`-Datei | **Fehlt.** Kein Volltext mit dem Kutscher-2023-Titel als Primärtext auffindbar | Distillat unprüfbar, solange der echte Kutscher-Volltext fehlt |
| `Ghosal_2024_An_empirical_study_of_structural_social_and` | Jääskeläinen et al. "Intersectional analysis of visual generative AI: the case of stable diffusion" | Datei-Heading identisch zur `Jääskeläinen_2025`- und `Sharma_2024`-Datei (drei Kopien desselben Papers im Korpus) | **Fehlt.** Kein Ghosal-2024-Primärtext ("empirical study of structural social") auffindbar | Distillat unprüfbar, solange der echte Ghosal-Volltext fehlt |
| `Kong_2022_Are_Intersectionally_Fair_AI_Algorithms_Really` | Goyal et al. "Fairness Indicators for Systematic Assessments of Visual Feature Extractors" (Meta), DOI 10.1145/3531146.3533074 | Datei-Heading und Autoren (Goyal, Romero Soriano, Usunier) bestätigt; "Goyal" 4×, "Fairness Indicators" 16× im Text | **Fehlt als Primärtext.** Der echte Titel lautet vollständig "Are 'Intersectionally Fair' AI Algorithms Really Fair to Women **of Color**? A Philosophical Analysis" (die Distillat-Metadaten kürzen "of Color" weg). Er erscheint mehrfach als Literaturzitat (D'Ignazio, Gohar, Ovalle, Zannone u.a.), aber nirgends als Primärtext | Distillat unprüfbar, solange der echte Kong-Volltext fehlt |

Alle drei bleiben unprüfbar. Die F-Befunde dieser Distillate sind durch die Fehlzuordnung erklärt und dürfen nicht als Confabulation der eigentlichen Quelle gewertet werden. Empfehlung an die Operator-Seite: die drei echten Volltexte akquirieren (Kutscher 2023, Ghosal 2024, Kong 2022 "…of Color"); erst dann ist eine Belegkette herstellbar. Der Goyal-Volltext liegt korrekt unter dem migrierten Goyal-Distillat, die Vault-Konsequenz ist in der Waitlist notiert.

## 3. U-Fälle, Metadaten-Verdacht, triagiert

Für die U-Fälle wurde der im Distillat-Frontmatter behauptete `title` gegen alle Volltext-Headings in `generated/markdown_clean/` gesucht. Drei Muster trennen sich.

### 3a. Echte Quelle lokalisierbar, nur Dateinamen-Schlüssel weicht ab

Bei diesen matcht der behauptete Titel einen echten Primärtext, und stichprobenweise lösen sich die Distillat-Zitate dort auf. Der U-Status ist ein Zuordnungsproblem, keine Confabulation.

| Distillat | Behaupteter Titel | Echter Volltext | Zitat-Auflösung (Stichprobe) |
|---|---|---|---|
| `Alliance_2024_Incubating` | "Incubating Feminist AI 2021-2024: Executive Summary" | `A+ Alliance_2024_Incubating_Feminist_AI_Executive_Summary_2021-2024.md` | mehrere distinkte Zitate verbatim aufgelöst |
| `Friedrich-Ebert-Stiftung_2025_artificial` | "The EU Artificial Intelligence Act through a Gender Lens" (Karagianni) | `Karagianni_2025_The_EU_artificial_intelligence_act_through_a.md` | Mehrheit der Zitate aufgelöst; das FES-Distillat trägt Karagiannis Titel |
| `Klein_2024_Data` | "Data Feminism for AI" (Klein, D'Ignazio) | `D'Ignazio_2024_Data_Feminism_for_AI.md` | Mehrheit der Zitate aufgelöst; bestätigt die in der Waitlist notierte Dublette zu D'Ignazio |

Empfehlung: Diese drei über die kanonische Quelle abdecken, nicht als eigenständige Belegkette migrieren. Je Quelle trägt ein Distillat die Belegkette.

### 3b. Metadaten fehlassoziiert, Titel zeigt auf ein klar fremdes Paper

Der Frontmatter-Titel benennt ein Werk, das mit dem Distillat-Schlüssel nichts zu tun hat. Kein Primärtext des Schlüsselthemas ist auffindbar. Das ist der harte Metadaten-Verdacht; das Distillat ist zu seinem angeblichen Gegenstand nicht vertrauenswürdig.

| Distillat | Frontmatter-Titel (fremd) | Kein Primärtext gefunden für |
|---|---|---|
| `Yunusov_2024_MirrorStories` | word2vec-Paper (Mikolov et al. 2013, "Distributed Representations of Words and Phrases") | MirrorStories |
| `Women_2024_Artificial` | LLM-Scaling ("Will we run out of data?", Villalobos et al.) | das angebliche Frauen-/KI-Thema |
| `D_Ignazio_2024_Data` | spanischsprachige communitäre Feminismus-Theorie (Cabnal, "feminismo comunitario") | das D'Ignazio-Data-Thema (Dublette zu Klein, s. 3a) |
| `Mosene_2023_Feministische` | Haraway 1985 "Manifest für Cyborgs" | das Mosene-Paper |
| `Barman_2024_Beyond` | südaustralische GenAI-Guideline | das Barman-Paper |
| `Statistics_2023_Occupational` | US-Arbeitsmarktstatistik (BLS "Occupational Employment and Wages") | keines, Titel ist selbst eine Statistik |
| `Arias_López_2023_Digital` | WHO "Global strategy on digital health 2020-2025" | das Arias-López-Paper |
| `Freinhofer_2025_Prompten` | englisches Prompt-Handbuch ("quick-start handbook for effective prompts") | das PCRR-Paper |
| `Unknown_2024_Research` | "…risks and countermeasures of ChatGPT … in social work" (Yuan Yi), Autor unbekannt | dieser Primärtext |
| `Attard-Frost_2025_Countergovernance` | AIDA-Submission (Dais/McGill) | das Countergovernance-Paper |
| `Project_2024_Intersectionality` | DIVERSIFAIR-Toolkit | dieser Primärtext |
| `Debnath_2024_LLMs` / `Tun_2025_Trust` | Titel "nicht angegeben" | Kurznamen-Duplikate der vollständigen Debnath/Tun-Distillate |

Empfehlung: nicht migrieren. Der Frontmatter-Titel ist als Zuordnungssignal wertlos oder irreführend; der behauptete Gegenstand ist ohne Volltext nicht belegbar. Bei `Debnath_2024_LLMs` und `Tun_2025_Trust` liegt zusätzlich ein Kurznamen-Duplikat des jeweiligen vollständigen Distillats vor (`Debnath_2024_Can_LLMs…`, `Tun_2025_Trust_in_artificial…`); die kanonische Fassung trägt die Prüfung.

### 3c. Titel plausibel, Volltext dennoch nicht auflösbar

| Distillat | Frontmatter-Titel | Befund |
|---|---|---|
| `He_2024_steerability` | "Evaluating the Prompt Steerability of Large Language Models" | plausibler eigener Titel, aber kein Primärtext im Korpus; separates vollständiges `He_2024_On_the_steerability…`-Distillat existiert und wartet mit F |
| `Hall_2024_systematic` | "child maltreatment hotline screening decisions" (Chouldechova et al.) | Titel nennt ein referenziertes Fallstudien-Paper, kein Primärtext auffindbar |
| `Qiu_2025_Mitigating` | "EDITBIAS: Debiasing Stereotyped Language Models via Model Editing" | plausibler Titel, kein Primärtext im Korpus |
| `Sharma_2024_Intersectional` | "Understanding how users may work around algorithmic bias" (Overbye-Thompson, Rice) | Titel weicht vom Schlüssel ab; die `Sharma_2024_Intersectional_analysis…`-Datei ist eine Kopie des Jääskeläinen-Papers |
| `Washington_2025_Fragile` | "Fragile Foundations: Hidden Risks of Generative AI" | plausibler eigener Titel, kein Primärtext im Korpus |
| `Kamruzzaman_2024_Prompting` | "…System 1 and System 2 Cognitive Processes" (Kamruzzaman, Kim) | Volltext-Versionen existieren (`Kamruzzaman_2024_Prompting_techniques…`), Zitate lösen sich aber laut Waitlist in keiner Version vollständig auf |
| `Kutscher_2020_Handbuch` | "Handbuch Soziale Arbeit und Digitalisierung" | Sammelband-Titel; `Kutscher_2020_Handbuch…`-Volltext existiert, Zuordnung des Distillats unklar |

Empfehlung: ohne auflösbaren Volltext keine Belegkette. Wo ein gleichnamiges vollständiges Distillat existiert (He, Kamruzzaman, Kutscher_2020), über dieses entscheiden.

U-Triage-Summe: von den U-Fällen sind drei über die kanonische Quelle abdeckbar (3a), zwölf tragen fehlassoziierte Metadaten und sind zu ihrem behaupteten Gegenstand wertlos (3b), sieben haben einen plausiblen Titel, aber keinen auflösbaren lokalen Volltext (3c).

## 4. F-Fälle, stratifizierte Stichprobe, advisory Prior

Grundgesamtheit für die Stichprobe waren die nach Stufe 1b offenen F-Zitatansprüche (`match=null` in `stage1b_resolution.json`), bereinigt um die U-, Fehlzuordnungs- und Dubletten-Distillate, damit die Stichprobe genuines F misst und nicht die schon erklärten Fälle. Bereinigt bleiben offene F-Zitate über distinkte Distillate. Gezogen wurde deterministisch geschichtet nach F-Dichte (hoch/mittel/niedrig), Sprache (englisch/deutsch) und Kategorie.

Der Stufe-1b-Matcher ist artefakt-tolerant (Zitationsklammern, Ligaturen, geschachtelte Quotes, Ellipsen mit geordneten Segmenten). Was hier noch offen ist, ist die härtere Restmenge. Die Stichproben-Nachprüfung nutzte eine gröbere Fenster-Suche als 1b und ist advisory; sie trennt drei Sorten.

| # | Distillat | Kategorie | Zitatanspruch (gekürzt) | Volltext-Befund | Advisory-Einordnung |
|---|---|---|---|---|---|
| 1 | `Ahmed_2024_Feminist_perspectives_on_AI_Ethical` | Soziale_Arbeit | "Feminist ethics emphasizes transparency, fairness, and inclusivity, challenging the patriarchal and corporate-driven narratives" | Rumpf verbatim vorhanden, Kopf verändert: Quelle sagt "A feminist ethical **framework** emphasizes…" | echte Zitatveränderung, umgeschriebener Zitatkopf (Stufe 2 F-hart) |
| 2 | `Chiu_2025_AI_literacy_and_competency_definitions` | Prompting | "prompt engineering... relies on understanding how the model encodes concepts" | Segment "on understanding how the model" vorhanden, Ellipse mit `...` markiert | komponiert/elidiert, Artefaktklasse |
| 3 | `Jarke_2025_Datafied_ageing_futures` | AI_Literacies | "participatory futuring methods enable participants to question their own anticipations about the futures of data-driven technologies" | Endsegmente verbatim, Kopf nicht kontiguierlich | wahrscheinlich Elision, Artefaktklasse (Jarke bereits mit 1b-Ligatur-Fehlalarm belastet) |
| 4 | `Fujii_2024_Bildungsteilhabe` | Bias_Ungleichheit | "multiple strukturelle Benachteiligungslagen (z.B. durch asylrechtliche Bestimmungen)" | Klammer-Teil "durch asylrechtliche Bestimmungen" vorhanden | Elision/Klammer-Einschub, Artefaktklasse |
| 5 | `Studeny_2025_Digitale_Werkzeuge` | Diversitaet | "ältere Menschen, Personen mit geringer Bildung oder Migrationserfahrung" | Segment "Personen mit geringer Bildung oder" vorhanden | Elision, Artefaktklasse |
| 6 | `An_2025_Measuring_gender_and_racial_biases` | Feministisch | "we explicitly evaluating how LLMs exhibit very different bias…" | Teilfenster vorhanden (grammatisch auffälliger Zitatkopf) | Teilzitat, Grenzfall, an Mensch |
| 7 | `Peng_2022_A_Literature_Review_of_Digital_Literacy` | AI_Literacies | "ability, attitude, and awareness to use digital devices in a…" | Kopf vorhanden, Ende nicht kontiguierlich | Teilzitat/Elision, Artefaktklasse |
| 8 | `Sinders_2017_Feminist_Data_Set` | Bias_Ungleichheit | "Machine learning algorithms have also been used in biased an…" | Kopf vorhanden, Ende nicht kontiguierlich | Teilzitat/Elision, Artefaktklasse |
| 9 | `Lau_2023_Dipper_Diversity_in_Prompts` | Prompting | "Drawing inspiration from how using different prompts w would…" | Kopf vorhanden, Extraktions-Duplikat "w would" | Extraktions-Artefakt |
| 10 | `Rodriguez_2024_Introducing_Generative_AI` | Fairness | "Social work courses should investigate how outputs generated…" | Kopf vorhanden | Teilzitat, wahrscheinlich Artefakt (Stufe 2 sah in demselben Distillat einen Satzende-Fehlalarm) |
| 11 | `Biegelbauer_2023_Leitfaden_Digitale_Verwaltung` | AI_Literacies | "Wie wird die KI-Kompetenz der breiten Öffentlichkeit [...] g…" | Kopf vorhanden, `[...]`-Elision markiert | markierte Elision, Artefaktklasse |
| 12 | `Gengler_2024_Faires_KI-Prompting` | Fairness | "Fairness im Kontext von KI bedeutet, dass alle Menschen glei…" | Kopf vorhanden | Teilzitat, wahrscheinlich Artefakt |
| 13 | `Rodríguez-Martínez_2024_Ethical_issues` | KI_Sonstige | "algorithmic decision-making" | Fragment nicht als Phrase im Volltext | kurzes generisches Fragment mit Zitatanspruch, Paraphrase-mit-Anführung, Kern-Fehlerklasse |
| 14 | `Browne_2024_Tech_workers'_perspectives` | Diversitaet | "marginalized users and consumers" | Fragment nicht im Volltext | wie 13, Paraphrase-mit-Anführung |
| 15 | `Unknown_AI_competency_framework_for_students` | Fairness | "fair representations in datasets" | Fragment nicht im Volltext | wie 13, Paraphrase-mit-Anführung; Distillat trägt zudem einen Unknown-Schlüssel |

Verteilung der Stichprobe:

| Advisory-Einordnung | Anzahl |
|---|---|
| echte Zitatveränderung / Confabulation-Kandidat (hart) | 1 (#1 Ahmed) |
| Paraphrase-mit-Anführung, kurzes Fragment, Kern-Fehlerklasse, kein Wörtlichbeleg | 3 (#13, #14, #15) |
| Elision / komponiertes Zitat / Extraktions-Artefakt (formal F, inhaltlich honest) | 11 |
| Stichprobengröße | 15 |

Advisory-Prior für den Operator: In dieser Stichprobe überwiegt die Artefakt-/Elisionsklasse deutlich. Genuine Zitatveränderung im Sinne einer umgeschriebenen Behauptung trat einmal auf (Ahmed, deckt sich mit dem Stufe-2-Verdikt F-hart). Drei weitere Fälle sind kurze, generische Fragmente in Anführungszeichen ohne Wörtlichbeleg; sie sind nicht elaborierte Confabulation, sondern Paraphrase-mit-Zitatanspruch, die Kern-Fehlerklasse aus ADR-022. Grob überschlagen liegt der Anteil echter Confabulation plus Paraphrase-mit-Anführung bei rund einem Viertel bis einem Drittel der offenen F, der Rest sind tolerierbare Zitierpraxis-Artefakte. Diese Schätzung stützt sich auf eine kleine Stichprobe und die gröbere Nachprüfung; sie ersetzt die zitatweise menschliche Prüfung nicht und ist bewusst als Prior, nicht als Rate ausgewiesen.

Warnhinweise für die Stufe-3-Prüfung:

- Der Ahmed-Fall zeigt das gefährlichste Muster: verbatim Rumpf mit umgeschriebenem Kopf. Ein zeichengenauer Matcher fängt das, ein flüchtiger Blick nicht.
- Die kurzen Fragment-Fälle (#13 bis #15) sind leicht als "steht doch sinngemäß im Text" durchzuwinken; die Kategorie-Evidenz verlangt aber Wörtlichbeleg, nicht Sinngemäßheit. Hier ist die Trennung P (honest paraphrase, darf als Prosa mit) gegen F (Zitatanspruch ohne Beleg, darf nicht als verankertes Zitat) die eigentliche menschliche Entscheidung.
- Distillate mit gemeinsamer Quelle (Laine/McCrory, Wilson-Paar, Wang) ziehen bei Freigabe je Quelle nur einmal ein; die Waitlist vermerkt die Paare.

## Grenzen dieses Dossiers

Die drei Volltext-Fehlzuordnungen bleiben unprüfbar, solange die echten Volltexte fehlen; hier ist kein Verdikt möglich und keines gegeben. Der Tun-G-Fall ist als Grenzentscheidung offen gelassen, weil der Kategorienbegriff wörtlich im Volltext vorkommt. Die F-Einordnungen beruhen auf einer kleinen geschichteten Stichprobe und einer Nachprüfung, die gröber ist als der Stufe-1b-Matcher; sie geben einen Prior, kein Urteil je Zitat. Alle Migrationsentscheidungen bleiben beim Menschen.
