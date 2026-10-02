# codebook-v141-includes-13-10-20261002 · ar1

- Akteur: agent
- Zuweisung: 3B87U5LN, 7AMRV4DT, BJZYGNEE, CY5IMM6G, H59BNSX8, I78CL6R5, MJDTRLAI, PQC9G5EU, SS5HTYY6, VFD9ENG6
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-13-10-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, alle zehn SHA-256-Werte gegen das Laufmanifest geprüft und vollständig gelesen; Regelquellen assessment/categories.yaml 1.4.1 und knowledge/update-protocol.md (Eligibility, Text preparation and source gate, Agent-assisted completion, Analysis coding einschließlich Source-review clarification)
- Ergebnis: bestanden
- Verteilung: Include 8 · Unclear 1 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 3B87U5LN | Volltext | verified | Include | Generative_KI ja, Soziale_Arbeit ja, AI_Literacies teilweise, Diversitaet teilweise | Soziale_Arbeit allein über die Zielgruppenklausel (psychosoziale Unterstützung) |
| 7AMRV4DT | Volltext | verified | Exclude (Not_relevant_topic) | KI_Sonstige ja, Generative_KI teilweise, Prompting teilweise | keine Sozialkategorie, „bias“ nur als kognitiver Vertrauensbias |
| BJZYGNEE | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch ja; AI_Literacies, Fairness teilweise | kritischer Survey, Schadensarten nur zitiert, daher None |
| CY5IMM6G | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit ja; Generative_KI, Diversitaet, Fairness teilweise | eigene Fallbeispiele tragen Achsen und Schadensarten |
| H59BNSX8 | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit ja; Diversitaet, Feministisch, Fairness teilweise | Lehrpraxis der Autor:innen als Demonstrated |
| I78CL6R5 | Volltext | verified | Unclear | AI_Literacies ja; Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Diversitaet, Fairness teilweise | K-12-Rahmenwerk, soziale Dimension nur nachgeordnet |
| MJDTRLAI | Volltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet ja; Fairness teilweise | Prompt-Modifikatoren evaluiert, gemischtes Ergebnis |
| PQC9G5EU | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch ja; AI_Literacies, Fairness teilweise | Buchkapitel, explizite Gender- und Bias-Bestimmung |
| SS5HTYY6 | Volltext | verified | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit ja; Generative_KI, Diversitaet, Fairness teilweise | Referenzliste mit Platzhalter-URLs |
| VFD9ENG6 | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Feministisch, Fairness ja; Generative_KI, Gender, Diversitaet teilweise | Survey, Evaluated aus synthetisierten Ergebnissen |

## Abweichungen und Blocker

- 7AMRV4DT · Entscheidung im Include-Lauf · Das Werk behandelt Vertrauen und Überabhängigkeit bei KI-gestützten Entscheidungen. „Bias“ meint dort kognitiven Bias, keine Diskriminierung, und keine Sozialkategorie erreicht `teilweise`. Abgeleitet wird daher Exclude mit Not_relevant_topic, obwohl der Lauf als Include-Batch angelegt ist · Prüfung durch die Domänenexpert:innen.
- I78CL6R5 · Entscheidung im Include-Lauf · K-12-Rahmenwerk für AI Literacy. Bias, Fairness und Inklusion erscheinen nur als nachgeordnete Lerninhalte, Soziale_Arbeit fehlt. Abgeleitet wird Unclear, daher ohne Analysefelder · Prüfung durch die Domänenexpert:innen.
- SS5HTYY6 · Quellenqualität · Mehrere Referenzen tragen Platzhalter-URLs („https://www.ap.org/xxxx“) und unplausible bibliografische Angaben, etwa Angwin et al. 2023 in „J Soc Comput“. Der Publikationstyp Review-Artikel mit ISSN und identifizierbarer Autorschaft ist zulässig. Die Codes stützen sich nur auf die eigenen Aussagen des Werks · Integritätsprüfung durch die Domänenexpert:innen.
- Kein Blocker. Alle Identitäten stimmen im Titel überein. Bei 7AMRV4DT ist der Korpustitel der Untertitel des Preprints. Wo der Text keinen DOI nennt, bindet die Manifest-Version mit ihrem Hash die Quelle.

## Codierregeln mit Auslegungsbedarf

- Soziale_Arbeit · 3B87U5LN · Die Studie zu Mental-Health-Chatbots nennt Soziale Arbeit nicht. Ich habe `ja` über die Zielgruppenklausel vergeben, weil Menschen, die psychosoziale Unterstützung suchen, eine Zielgruppe sind und `Mental_Health` als Handlungsfeld im Codebuch steht. Bei `teilweise` würde die Entscheidung auf Unclear kippen.
- Feministisch · VFD9ENG6 · Der technische Survey rahmt sich vollständig über Crenshaws Intersektionalität. Ich habe `ja` nach dem Positivbeispiel „Intersektionale Analyse nach Crenshaw“ vergeben, obwohl das Werk keine Geschlechterperspektive im engeren Sinn entwickelt.
- Feministisch · H59BNSX8 · Intersektionalität dient als pädagogische Leitfrage einer Machtanalyse ohne Geschlechterbezug. Daraus ergibt sich `teilweise`.
- AN_Harm_Types · BJZYGNEE · Männliche Norm, Embedding-Stereotype und Erkennungsdisparitäten stammen aus zitierten Autor:innen und Projekten. Die Synthese ordnet sich nach FAI-Typen, nicht nach Schadensarten. Nach der 1.4.1-Regel ergibt sich daher None.
- AN_Harm_Types · SS5HTYY6, H59BNSX8 · Allokative Disparitäten wie Kinderschutz-Flagging, Robodebt, NDIS-Scores und Heat List klassifizieren die Werke nicht selbst. Ich habe Indirect_Discrimination vergeben, weil historische Daten, Datenabgleich oder Template-Scores als scheinbar neutrale Kriterien wirken. Die Frage der unklassifizierten allokativen Disparität ist im Pilot offen geblieben.
- AN_Harm_Types · VFD9ENG6 · Für den Fairness-Survey habe ich Schadensarten aus den Fairnessbegriffen abgeleitet, die die Synthese strukturieren. Die Disparate-Impact-Vierfünftelregel mit Differential Fairness ergibt Indirect_Discrimination, Worst-Case-Genauigkeit über Untergruppen ergibt Disparate_Performance.
- AN_Bias_Axes · MJDTRLAI · „Geography“ ist als Nationality_Migration codiert, „region/culture“ als Language_Culture. Religion habe ich nicht codiert, weil die Pastor- und Mönch-Prompts nach Gender und Race ausgewertet werden.
- AN_Bias_Axes · PQC9G5EU · Intersectional stützt sich auf das eigene Argument zur besonderen Unterrepräsentation von Frauen of Colour in der KI-Belegschaft. Das ist eine Workforce-Ungleichheit, die das Kapitel als Ursache des Systembias argumentiert, keine Messung an einem System.
- AN_Gender_Understanding · BJZYGNEE · Social_Construct beruht auf Wajcmans Argument der historischen und kulturellen Konstruktion von Geschlecht, das das Werk im FAI-as-culture-Abschnitt referiert. Eine eigene Definition fehlt, daher Implicit_Only.
- AN_Gender_Understanding · VFD9ENG6 · Ich habe nur Intersectional codiert. Binarität erscheint allein in einem referierten Werkzeug („male/female for a binary gender“), nicht als Setzung des Surveys.
- AN_Mitigation_Status · H59BNSX8 · Die kritische Fallstudienpädagogik setzen die Autor:innen in der eigenen Lehre ein, ohne Ergebnis zu berichten. Daraus ergibt sich Demonstrated.
- AN_Mitigation_Status · SS5HTYY6 · Das Werk berichtet „implemented in pilot programs“ ohne Ergebnis. Daraus ergibt sich Demonstrated.
- AN_Mitigation_Status · PQC9G5EU · Universitätsinitiativen mit berichtetem Anstieg des Frauenanteils sind Workforce-Interventionen, keine evaluierten Bias-Maßnahmen. Daraus ergibt sich Proposed.
- AN_Task · BJZYGNEE · Other_Task steht für Rechtsberatung bei Geschlechterdiskriminierung und für Transparenz in Verfahren zu geschlechtsbezogener Gewalt. Beides ist aus referierten Projekten abgeleitet.
- AN_Task · CY5IMM6G · Ich habe sechs Aufgaben codiert, weil das Werk jede als KI-Nutzung in der Praxis benennt.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
