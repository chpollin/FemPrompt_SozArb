# codebook-v14-pilot-10-20261001 · ar2

- Akteur: agent
- Zuweisung: G53MCF3W, KNQYFQ6B, WLV8L8PM, PQC9G5EU, VFD9ENG6, YN9JAREI, 6IU5JG5Y, LGYFN6JK, H59BNSX8, 3B87U5LN
- Coding-Paket: ar2-coding.json im Arbeitsordner des Tracks, Schema femprompt-prisma-coding-packet/0.2, Codebuch 1.4
- Quellenbasis: identitätsgeprüfte Volltexte docs/data/fulltext/<ID>.md gemäß Laufmanifest, jeweils vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 10 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| G53MCF3W | Volltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet (ja); AI_Literacies, Feministisch, Fairness (teilweise) | Preprint ohne DOI, Jahr 2025 im Text |
| KNQYFQ6B | Volltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender (ja); KI_Sonstige, Fairness (teilweise) | weder DOI noch Jahr im Text |
| WLV8L8PM | Volltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Diversitaet (ja); Gender, Feministisch, Fairness (teilweise) | weder DOI noch Jahr im Text |
| PQC9G5EU | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja); AI_Literacies, Fairness (teilweise) | Buchkapitel, weder DOI noch Jahr im Text |
| VFD9ENG6 | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Fairness (ja); Gender, Diversitaet, Feministisch (teilweise) | Preprint, weder DOI noch Jahr im Text |
| YN9JAREI | Volltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja); Feministisch (teilweise) | Publikationstyp als Auslegung, siehe unten |
| 6IU5JG5Y | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Diversitaet, Feministisch, Fairness (ja); AI_Literacies, Soziale_Arbeit, Gender (teilweise) | DOI 10.1145/3715275.3732210 |
| LGYFN6JK | Volltext | verified | Include | Generative_KI, Soziale_Arbeit (ja); AI_Literacies, Prompting, Bias_Ungleichheit, Diversitaet (teilweise) | eingeladener Kommentar, DOI 10.1086/726042 |
| H59BNSX8 | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Diversitaet, Fairness (teilweise) | DOI 10.1080/02615479.2023.2195425 |
| 3B87U5LN | Volltext | verified | Include | Generative_KI, Soziale_Arbeit (ja); AI_Literacies, KI_Sonstige, Bias_Ungleichheit, Diversitaet (teilweise) | Soziale_Arbeit über die Zielgruppe, siehe unten |

## Abweichungen und Blocker

- alle Records · Regelquelle · `knowledge/update-protocol.md` nennt in „Eligibility“ und „Analysis coding“ Version 1.3 als geltendes Vokabular und im Abschnitt „Proposed codebook amendment v1.4“ den Vorschlag als nicht übernommen, während `assessment/categories.yaml` die Übernahme von v1.4 am 2026-10-01 verzeichnet und das Laufmanifest v1.4 per Hash bindet · Nachführung des Protokolltexts an die Codebuchübernahme. Der Track codiert nach v1.4, weil Laufauftrag, Manifest und Vokabularquelle übereinstimmen und die Eligibility-Inhalte unverändert sind.
- alle Records · Regelquelle · `categories.yaml` nennt den Ausschlussgrund Consolidated_expert_exclusion, `update-protocol.md` und der Validator führen ihn nicht · ohne Folgen für diesen Track, da kein Exclude vorliegt.
- KNQYFQ6B, WLV8L8PM, PQC9G5EU, VFD9ENG6 · Metadatenlücke · Titel stimmen überein, DOI und Erscheinungsjahr fehlen im Text · vorläufige Codierung, Abgleich von DOI und Jahr gegen die Zotero-Metadaten.
- YN9JAREI · Publikationstyp · Leitfaden einer Hochschule im öffentlich geförderten Mittelstand-Digital Zentrum mit benannter Autorenschaft, Zitiervorschlag 2024 und Quellenliste, Belege überwiegend journalistisch, eigene explorative Bildprompts · als belegter institutioneller Bericht zugelassen, nicht als Blocker gemeldet. Falls der Operator solche Praxisleitfäden als allgemeinen Ratgeber wertet, wäre Exclude mit Wrong_publication_type die Folge.

## Codierregeln mit Auslegungsbedarf

- Soziale_Arbeit · 3B87U5LN · Das Werk nennt Soziale Arbeit nicht, behandelt aber zentral die psychosoziale Unterstützung von Menschen mit psychischen Belastungen. Gewertet als direkter Bezug zu einer Zielgruppe Sozialer Arbeit (ja), gestützt auf die Kategoriedefinition und das Handlungsfeld Mental_Health. Bei enger Lesart wäre der Record Unclear.
- AN_Bias_Axes · G53MCF3W · Nicht-binäre und trans Personen sind eigene Analysekategorien. Neben Gender ist Sexual_Orientation_Identity für die Geschlechtsidentität codiert, weil das Label geschlechtliche Identität einschließt.
- AN_Bias_Axes · PQC9G5EU, VFD9ENG6, 6IU5JG5Y, YN9JAREI, H59BNSX8 · Zitierte Fälle zählen als Achse, wenn das Werk sie in seiner eigenen Argumentation ausführt (Fallstudien, Eingangsbeispiele), nicht wenn sie nur in Aufzählungen, Datensatztabellen oder Anwendungsüberblicken stehen.
- AN_Harm_Types · VFD9ENG6, PQC9G5EU · Allokative Ergebnisunterschiede (statistische Parität, 80-Prozent-Regel, Einstellungs- und Werbefälle) sind belegt, das Werk klassifiziert sie aber nicht als unmittelbar oder mittelbar. Keiner der beiden Diskriminierungscodes vergeben, Begründung in AN_Notes.
- AN_Harm_Types · 6IU5JG5Y · Schadensmechanismen stehen nur im motivierenden Hintergrund, die Synthese ist nach Empfehlungsthemen gegliedert, daher None.
- AN_Harm_Types · 3B87U5LN · Ungleiche Reichweite für weniger technikaffine und nicht englischsprachige Menschen als Exclusionary_Norms codiert, analog zum Anker MA3LBJS6, ohne Achse, weil die Gruppen nur in Limitationen und Ausblick stehen.
- AN_Mitigation_Status · YN9JAREI · Die Ergänzung „divers“ im Prompt wurde ausprobiert und als wirkungsarm berichtet. Als Demonstrated gewertet, weil es sich um illustrative Einzelproben ohne abgeschlossene Prüfung handelt.
- AN_Mitigation_Status · H59BNSX8 · Kritische Fallstudienpädagogik wird in der eigenen Lehre angewendet, ohne Wirkungsprüfung, daher Demonstrated. Die Zuordnung der Lehre zu Organisational_Process folgt der Stufendefinition (Schulung).
- AN_Mitigation_Status · VFD9ENG6 · Evaluated beruht auf synthetisierten Ergebnissen zitierter Arbeiten, nicht auf einem eigenen Experiment, und ist in AN_Notes auf die betreffenden Verfahren begrenzt.
- AN_Prompt_Techniques · WLV8L8PM · ICL nur für den automatisierten Annotationsschritt mit GPT-4o, nicht als Empfehlung.
- AN_Gender_Definition · PQC9G5EU · Die Bestimmung, dass Männlichkeit und Weiblichkeit ihre Bedeutung durch ihre Einbettung in Technik erhalten, als eigener definierender Satz gewertet (Explicit).
- AN_Bias_Definition · YN9JAREI, 6IU5JG5Y · Eine ausdrücklich übernommene Bestimmung von Fairness beziehungsweise Ungerechtigkeit als Explicit gewertet, gemäß Feldnotiz zu Fairnesskriterien.
- AN_Theory_Reference · LGYFN6JK, H59BNSX8 · Antirassistischer Forschungsrahmen und kritische Theorien sozialer Macht beziehungsweise Critical Race Theory als rahmende Theorietraditionen gewertet (Yes). Grenzfall, da die Rahmung programmatisch und knapp bleibt.
- AN_Task · KNQYFQ6B, YN9JAREI · Maschinelle Übersetzung sowie Stellenanzeigen, Empfehlungsschreiben und Unternehmensbilder als Other_Task, bei Methodensurveys und Wahrnehmungsstudien ohne Anwendungsaufgabe None.
- AN_Population · YN9JAREI · Berufliche KI-Kompetenz von Unternehmensbeschäftigten außerhalb der Sozialen Arbeit als Not_SW_Specific statt Education_Professional codiert.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
