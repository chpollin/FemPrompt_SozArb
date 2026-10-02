# codebook-v141-includes-07-7-20261002 · ar1

- Akteur: agent
- Zuweisung: 6JAZXKEB, 9MDIBETZ, GPSB87RN, JMAWNUEV, MQJEES7J, T9KEZN3G, ZNHUCA4B (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-07-7-20261002/ar1/ar1-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/, alle sieben vollständig gelesen, SHA-256 aller Quellen vor der Codierung gegen das Manifest geprüft und übereinstimmend
- Ergebnis: bestanden
- Verteilung: Include 3 · Unclear 4 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6JAZXKEB | Fulltext | provisional | Unclear | AI_Literacies ja; Generative_KI, KI_Sonstige, Bias_Ungleichheit, Fairness teilweise | Bias und Fairness nur als Workshop-Inhalt zu data bias, Sozialdimension ohne ja |
| 9MDIBETZ | Fulltext | verified | Include | Generative_KI, Bias_Ungleichheit, Gender, Diversitaet, Fairness ja; Prompting teilweise | Benchmark und Debiasing evaluiert, nicht-binäre Gruppe als Analysekategorie |
| GPSB87RN | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch ja; Fairness teilweise | Policy-Paper der Friedrich-Ebert-Stiftung, Theoriebezug intersektionaler Feminismus und Data Feminism |
| JMAWNUEV | Fulltext | provisional | Unclear | AI_Literacies, Generative_KI ja; Prompting, Bias_Ungleichheit teilweise | Bias nur als Testitem und Ethik-Konzept |
| MQJEES7J | Fulltext | provisional | Unclear | AI_Literacies, Generative_KI ja; Prompting, Bias_Ungleichheit teilweise | Bias nur als Facette der AI Literacy und in Teilnehmendenzitaten |
| T9KEZN3G | Fulltext | provisional | Unclear | Generative_KI ja; AI_Literacies, Bias_Ungleichheit, Diversitaet teilweise | Bias ist eines von acht Governance-Feldern, nicht zentral |
| ZNHUCA4B | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet ja; AI_Literacies, Soziale_Arbeit, Feministisch, Fairness teilweise | UNESCO-Empfehlung, Publikationstyp siehe Auslegung |

## Abweichungen und Blocker

- keine Blocker
- 6JAZXKEB, JMAWNUEV, MQJEES7J, T9KEZN3G · Entscheidung Unclear in einem Lauf über Includes · Die Sozialdimension erreicht am Volltext nur teilweise, weil Bias, Fairness oder Diversität jeweils ein nachgeordneter Teilaspekt bleiben · Die Domain-Expert:innen entscheiden, ob die frühere Einschlussentscheidung auf einer anderen Gewichtung beruht
- 6JAZXKEB, JMAWNUEV, MQJEES7J, T9KEZN3G · Metadatenlücke · DOI und Erscheinungsjahr fehlen in der Paper-Ebene, bei T9KEZN3G zusätzlich der Untertitel als Überschrift · keine Klärung für die Codierung nötig, Identität vorläufig

## Codierregeln mit Auslegungsbedarf

- Publikationstyp · ZNHUCA4B · Eine von der UNESCO-Generalkonferenz angenommene Empfehlung ist weder Forschungsartikel noch klassischer Report. Eingeordnet als belegter Policy-Text mit identifizierbarer institutioneller Autorenschaft und dokumentierter Quellenbasis im Völkerrecht, nicht als unbelegter institutioneller Webtext. Falls die Regel institutionelle Urheberschaft nicht als identifizierbare Autorenschaft gelten lässt, wäre der Record als Blocker zu behandeln.
- Publikationstyp · GPSB87RN · Stiftungs-Policy-Paper von einem Start-up-Team mit Literaturverzeichnis, als belegter Policy-Report eingeordnet. Das MIRA-Beispiel beruht nach eigener Angabe auf einem Interview und nicht auf begutachteter Literatur.
- AN_Bias_Axes · 9MDIBETZ · Transgender und nicht-binäre Identitäten werden im Werk als Geschlechtsidentitäten geführt, daher nur Gender und nicht zusätzlich Sexual_Orientation_Identity codiert. Die Einbeziehung nicht-binärer Gruppen steht in AN_Gender_Understanding als Non_Binary_Inclusive.
- AN_Harm_Types · 9MDIBETZ · Regard-Differenzen messen Stimmung gegenüber Gruppen und begründen nach Regel 1.4.1 keine Disparate_Performance.
- AN_Mitigation_Status · GPSB87RN · Demonstrated stützt sich allein auf MIRA als vorgestelltes, angewandtes Beispiel ohne berichtete Evaluation, die übrigen Maßnahmen sind Vorschläge. Proposed wäre die strengere Lesart.
- AN_Gender_Understanding · GPSB87RN · Social_Construct aus der Bestimmung des Patriarchats als Machtsystem, in dem Männer Macht halten. Eine Definition von Geschlecht fehlt, daher AN_Gender_Definition Implicit_Only. Intersectional nicht codiert, weil keine Passage ein von einer Achsenkombination abhängiges Ergebnis zeigt.
- AN_Harm_Types · ZNHUCA4B · Erasure aus dem Verschwinden gefährdeter Sprachen durch NLP-Anwendungen. Diskriminierende algorithmische Entscheidungen werden im Text nicht als unmittelbar oder mittelbar klassifiziert und deshalb nicht codiert, entsprechend dem offenen Punkt aus dem Pilotlauf.
- AN_Bias_Definition · ZNHUCA4B · Ziffer 28 bestimmt Fairness als inklusiven Zugang zu den Vorteilen von KI, nicht Bias oder Diskriminierung selbst, daher Implicit_Only statt Explicit.
- Soziale_Arbeit · ZNHUCA4B · teilweise über welfare als menschenrechtssensiblen Einsatzbereich; entscheidungsneutral, weil Bias_Ungleichheit, Gender und Diversitaet auf ja stehen.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
