# codebook-v141-includes-08-7-20261002 · ar2

- Akteur: agent
- Zuweisung: 8MDXCTA6, G53MCF3W, IDW7QSYG, J9IZDVTW, XXCDL3A3, Y8J3HI9J, ZLMLP53P (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-08-7-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/ laut Manifest, alle sha256 vor der Codierung gegen das Manifest geprüft und vollständig gelesen; Regelquellen assessment/categories.yaml v1.4.1, knowledge/update-protocol.md (Eligibility, Text preparation and source gate, Agent-assisted completion, Analysis coding mit Source-review clarification), prompts/prism-agent-reviewer-v1.4.md
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 8MDXCTA6 | Fulltext | provisional | Include | AI_Literacies (t), KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet (t), Fairness | Systematischer Review zu ML-Risikomodellen in der Kinder- und Jugendhilfe; keine DOI im Text |
| G53MCF3W | Fulltext | provisional | Include | AI_Literacies (t), Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness (t) | Preprint, Interviewstudie zu ChatGPT; keine DOI im Text |
| IDW7QSYG | Fulltext | verified | Include | AI_Literacies (t), KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (t) | Twitter-Opinion-Mining, Management Decision 2025 |
| J9IZDVTW | Fulltext | verified | Unclear | AI_Literacies, KI_Sonstige (t), Bias_Ungleichheit (t) | AI-Literacy-Befragung von Promovierenden; keine soziale Kategorie auf ja |
| XXCDL3A3 | Fulltext | verified | Include | AI_Literacies (t), KI_Sonstige, Bias_Ungleichheit, Gender (t), Diversitaet (t), Feministisch, Fairness | Kritischer Review zu Intersektionalität in AI Fairness, AIES 2023 |
| Y8J3HI9J | Fulltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender (t), Diversitaet (t), Feministisch, Fairness | Theoretische Arbeit zu struktureller Ungerechtigkeit, Fallbeispiel Gesundheitsversorgung; keine DOI im Text |
| ZLMLP53P | Fulltext | verified | Include | Generative_KI (t), KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (t) | Fallstudie Queer in AI, FAccT 2023 |

(t) = teilweise, sonst ja.

## Abweichungen und Blocker

- J9IZDVTW · Entscheidung abweichend vom Laufzweck · Der Lauf ist als Analysecodierung eingeschlossener Werke angelegt, die Quelle trägt aber keine soziale Kategorie auf ja. Bias und Fairness erscheinen nur als Fragebogenitems und als Hinweis auf mögliche Biases in der AI-Literacy-Bildung, die Stichprobe sind Promovierende mit sozio-edukativem Hintergrund ohne Bezug zur Sozialen Arbeit. Abgeleitet wird daher Unclear, ohne Analysefelder · Klärung durch die AI Agent Review oder die Domain-Expert:innen, ob der Sozialarbeitsbezug oder der Bias-Bezug anders zu gewichten ist.
- 8MDXCTA6, G53MCF3W, Y8J3HI9J · Metadatenlücke · Der Volltext druckt keine DOI, Titel, Autor:innen und Jahr stimmen, kein Titel- oder DOI-Konflikt · vorläufige Codierung, DOI-Abgleich durch den Orchestrator.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Mitigation_Status · 8MDXCTA6, Y8J3HI9J · Evaluated stützt sich jeweils auf eine im Werk referierte abgeschlossene Prüfung mit Ergebnis (Wilson et al. 2015, separate Modelle ohne gewünschten Effekt; Pierson et al. 2021, geringere unerklärte Schmerzdisparitäten), nicht auf ein eigenes Experiment. Bei Y8J3HI9J ist das Werk theoretisch und kein Review, die Source-review clarification nennt ausdrücklich nur Reviews; alternativ wäre Proposed vertretbar.
- AN_Bias_Axes · G53MCF3W · Die Gruppe nicht-binärer und trans Teilnehmender wurde zusätzlich zu Gender als Sexual_Orientation_Identity codiert, weil sie Geschlechtsidentität betrifft; das Werk selbst spricht nur von gender.
- AN_Bias_Axes · IDW7QSYG · Intersectional nicht codiert, weil die Analyse nur das gemeinsame Vorkommen von gender und race in Tweets misst; die Deutung über die Matrix of Domination steht im Theoriebezug.
- AN_Gender_Understanding · IDW7QSYG · Die Einleitung nennt gender as a narrow social construct, die Analyse klassifiziert Nutzer:innen aber binär über Namenswörterbuch und Pronomen; der Wert folgt der Analyse (Binary_Categorical, Definition Implicit_Only).
- AN_Gender_Definition · XXCDL3A3 · Explicit über die übernommene Bestimmung von Collins und Bilge, dass Macht soziale Teilungen wie gender hervorbringt; eine eigene Definition von gender gibt das Werk nicht, Implicit_Only wäre die engere Lesart.
- AN_Gender_Definition · Y8J3HI9J · Gender erscheint als Achse struktureller Ungleichheit ohne Bestimmung und ohne ausdrückliche Aussage zur sozialen Herstellung, daher Absent mit Unclear.
- AN_Harm_Types · Y8J3HI9J · Erasure und Stereotyping beruhen auf zitierten Beispielen (Eveleth, Noble), die das Werk in sein eigenes Argument zu Anerkennung und Repräsentation einbaut; die Grenze zur bloß zitierten Fallliste ist eng.
- AN_Harm_Types · XXCDL3A3, ZLMLP53P · Codiert sind Mechanismen, die die Werke für ihren eigenen Gegenstand (AI-Fairness-Forschung bzw. Konferenz- und Publikationspraxis) belegen, nicht die in Abschnitt 2 von ZLMLP53P referierten AI-Harms.
- AN_Mitigation_Stage · XXCDL3A3 · Pre-, In- und Post-Processing folgen der Synthesestruktur des Reviews (Tagging der Pipeline-Stufe der geprüften Papers), nicht eigenen Eingriffen.
- AN_Task · IDW7QSYG, Y8J3HI9J · NLP als Forschungsmethode der Autor:innen wurde nicht als Aufgabe codiert (None); klinische Diagnose und Bedarfsbewertung außerhalb der Sozialen Arbeit als Other_Task.
- AN_Mitigation_Status · ZLMLP53P · Demonstrated, weil die Initiativen umgesetzt und mit Umfrage- und Adoptionsangaben beschrieben sind, aber keine abgeschlossene Prüfung einer Bias-Maßnahme berichtet wird.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
