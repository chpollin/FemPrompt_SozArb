---
title: "Fachfragen an die Expertinnen (Folgepaper, Abschnitte 5 bis 7)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: de
created: 2026-07-21
updated: 2026-07-21
authors: [Christopher Pollin]
generated-with: Claude Code
---

# Fachfragen an die Expertinnen

Arbeitsdokument zur Übertragung ins gemeinsame Google Doc. Die Fragen sammeln das fachliche Urteil der beiden Kolleginnen (Expertise Bias-Forschung und soziale Dimensionen der Sozialen Arbeit) für die Kapitel des Folgepapers, die inhaltliche Bewertung verlangen, vor allem Abschnitt 6 (Synthese SQ1 bis SQ3) sowie Teile von Abschnitt 5 und 7. Antworten können direkt unter den Fragen notiert werden, Stichworte genügen; die Einarbeitung in den Draft übernimmt die redaktionelle Seite.

Grundlage der Abschnitts- und Fragenummern ist `paper/draft.md` (v0.2). Der beratende LLM-Track ist inzwischen über den Korpus gelaufen; die Fragen im Abschnitt „Aus der Advisory-Synthese" stammen aus seinen Kandidaten-Claims und verlangen fachliche Bestätigung oder Verwerfung.

## Zu SQ1, Prompting-Techniken (Abschnitt 6)

1. Welche der im Korpus beschriebenen Prompting-Techniken halten Sie aus Praxissicht der Sozialen Arbeit für anschlussfähig, welche für realitätsfern?
2. Welches Evidenzniveau muss eine Technik erreichen, damit das Paper sie als Empfehlung führt und wo genügt die Nennung als Fundstelle?

## Zu SQ2, Bias-Achsen und Mitigations (Abschnitt 6)

3. Welche Bias-Achsen haben für die sozialarbeiterische Praxis Priorität, und fehlt aus Ihrer Sicht eine Achse, die das Kategorienschema nicht abbildet?
4. Wie soll das Paper Intersektionalität behandeln, als eigene Analysedimension oder als Querschnittsbefund?

## Zu SQ3, domänenspezifische Constraints (Abschnitt 6)

5. Was übersieht generische Prompt-Engineering-Literatur aus Sicht der Profession, etwa Mandatskonflikte, Adressatinnenschutz oder Dokumentationspflichten?
6. Die Gap-Map aus SQ3 speist auch die spätere Benchmark-Vorbereitung (Fair Bench). Welche Lücken wären dafür die wichtigsten?

## Zur Interpretation der Divergenz (Abschnitt 5)

7. Die Kategorie Gender ist als „expliziter Gender-Fokus" operationalisiert und zeigt die niedrigste Mensch-LLM-Übereinstimmung. Ist die Definition aus fachlicher Sicht zu eng, und wie wäre sie für Runde 2 zu fassen?
8. Tragen die drei Divergenzmuster (semantische Expansion, implizite Feldzugehörigkeit, Keyword-Inklusion) aus Ihrer Sicht eine fachliche Interpretation, oder bleiben sie technische Beschreibung?

## Zur Discussion (Abschnitt 7)

9. Welche Implikationen für die AI-Literacy-Vermittlung in Ausbildung und Praxis sollen aus den Befunden gezogen werden, und wo verläuft die Grenze zur Überdehnung der Datenbasis?

## Aus der Advisory-Synthese

Der beratende LLM-Track hat den Korpus codiert und synthetisiert (advisory, ungeprüft, auf Basis der deutschen Destillate). Die folgenden Fragen sind aus seinen Kandidaten-Claims gezogen und nach Entscheidungswert für die beiden Fachrollen ausgewählt. Der kursive Vorsatz nennt jeweils den Kandidaten-Claim, der die Frage trägt; die volle Fassung mit Belegschlüsseln liegt in `generated/analysis-advisory/syntheses_critique.json` und im Wissensdokument [[analysis-sq-advisory]]. Ein Claim gilt hier als Kandidat, auch wo der adversariale Durchgang ihn mit „holds" bestätigt hat.

### Zu SQ1, Prompting-Techniken

10. *Die evaluierten Prompt-Techniken sind fast ausschließlich außerhalb der Sozialen Arbeit erprobt, an allgemeinen Benchmarks für Gender- und Race-Stereotype.* Übertragen sich diese Benchmark-Effekte (StereoSet, BBQ, WinoMT) auf die Textsorten, die Soziale Arbeit tatsächlich erzeugt, etwa Fallnotizen, Risikoeinschätzungen und Überweisungsschreiben, oder ist genau diese Übertragung die offene empirische Frage, die das Folgepaper benennen sollte?
11. *Die Standardantwort des Korpus auf Bias liegt auf organisationaler und normativer Ebene, wo Vorschläge dominieren und Evaluationen selten sind.* Wenn die Governance- und die feministischen Theoriearbeiten diese Verzerrungen als strukturell und datenseitig verorten, ist die Empfehlung von Prompt-Techniken an Fachkräfte dann ein Kategorienfehler, ein Notbehelf oder eine Ergänzung, und wer trägt die Verantwortung, wenn die Prompt-Ebene die Wirkung verfehlt?
12. *Der Code General_Guidance vermischt zwei Dinge, allgemeine Prompting-Literacy in Ausbildungstexten und konkret evaluierte Prompt-Manipulationen.* Soll Prompting-Literacy überhaupt als Mitigations-Technik zählen, oder gehört sie als Ausbildungs- und Curriculum-Intervention klassifiziert, da ihre bildungsseitigen Vorkommen nie auf Bias-Reduktion geprüft werden?

### Zu SQ2, Bias-Achsen und Mitigations

13. *Sozioökonomischer Bias erscheint im Korpus fast nur als indirekte Diskriminierung über Proxy-Variablen und wird ausschließlich organisational und vorgeschlagen adressiert.* Ist die leere Zelle, in der keine evaluierte Intervention gegen Proxy-Diskriminierung steht, eine echte Lücke des Feldes oder eine Grenze des Review-Zuschnitts, der feministische KI-Literacies und Prompting zentriert, während korrigierende Verfahren für allokativen Bias in der FairML- und ADM-Literatur liegen?
14. *Der am häufigsten empfohlene Interventionsort, der organisationale Prozess, ist der am wenigsten erprobte.* Ist Organisational_Process, Proposed der angemessene und erwartbare Ort der Mitigation für die Soziale Arbeit, deren eigentliche Intervention fachliches Urteil, Governance und Aufsicht sind, sodass die niedrige Evaluationsrate ein Merkmal der Kategorie und keine Schwäche ist?
15. *Intersektionalität ist auf 42 Papers codiert, sitzt aber überwiegend auf organisationaler, vorgeschlagener Ebene und misst dort getrennte Achsen statt ihrer Interaktion.* Ist die Ko-Messung getrennter Achsen eine akzeptable Operationalisierung des Mitigations-Ziels, oder verlangt das Feld nachgewiesene Interaktionseffekte, bevor eine Intervention als intersektional adressierend gilt?
16. *Stereotyping ist der häufigste Schaden im Korpus, der Bias vor allem als repräsentationales Problem rahmt.* Welche Schadenstypen haben für die sozialarbeiterische Praxis Vorrang? An diesen Prioritäten muss sich die Konzentration des Korpus auf Stereotyping und seine geringe Beachtung indirekter, allokativer Diskriminierung messen lassen, bevor sie als Befund ins Paper eingeht.

### Zu SQ3, domänenspezifische Constraints

17. *Der für die Soziale Arbeit dominante KI-Schaden liegt in prädiktiver Risikoanalytik, die die Fachkraft nicht promptet, während die promptbare LLM-Evidenz in generativen Aufgaben liegt.* Ist die Prompt-Ebene überhaupt der richtige Hebel für den Schaden, der die SW-Evidenz dominiert, und soll Fair Bench generatives LLM-Stereotyping oder allokative Fairness prädiktiver Modelle adressieren, da beide in verschiedenen technischen Substraten sitzen?
18. *Das Populationsschema kennt fünf SW-Felder und übergeht Behindertenhilfe, Altenpflege, Suchthilfe, Wohnungslosenhilfe, Migrations- und Flüchtlingsarbeit, Bewährungshilfe und Gewaltschutz.* Ist diese Fünf-Felder-Taxonomie für das Selbstverständnis der Profession erschöpfend, oder verwechselt jede Aussage „keine Evidenz" echte Korpus-Abwesenheit mit nicht codierten Kategorien?
19. *Die einzige Prompt-Technik, die je ein echtes SW-Feld berührt, ist General_Guidance, zweimal, beide in der allgemeinen Sozialen Arbeit.* Sind diese beiden Fälle, antirassistisches Prompting und identitätspersonalisierte Narrative, echte SW-adaptierte Prompting-Praxis oder generische Anleitung, die nur über das Setting umetikettiert ist? Davon hängt ab, ob die Soziale Arbeit überhaupt promptbare Evidenz besitzt.
