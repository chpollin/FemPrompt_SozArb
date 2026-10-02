# codebook-v141-recode-03-6-20261002, ar1

- Akteur: agent
- Zuweisung: 2EBHMYU4, 4ZL5Q48E, 7FBB2KUC, A2P8MXMY, AHUSFEEA, INQNDHTI (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-03-6-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, Hashes gegen das Manifest geprüft und übereinstimmend, jeweils vollständig gelesen; Regeln aus assessment/categories.yaml v1.4.1 und den freigegebenen Abschnitten von knowledge/update-protocol.md
- Ergebnis: bestanden
- Verteilung: Include 5, Unclear 1, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 2EBHMYU4 | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, AI_Literacies teilweise | Framing-Analyse von vier Reports, nur Ausgaben-DOI im Text |
| 4ZL5Q48E | Fulltext | verified | Unclear | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit teilweise | Sozialdimension nur teilweise, siehe Auslegung |
| 7FBB2KUC | Fulltext | provisional | Include | Generative_KI ja, KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise | Zeitschrift und DOI nicht im Text |
| A2P8MXMY | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, Fairness ja, AI_Literacies teilweise, Diversitaet teilweise | |
| AHUSFEEA | Fulltext | provisional | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, Fairness ja, AI_Literacies teilweise, Soziale_Arbeit teilweise | Toolkit ohne DOI, Variantenmischung |
| INQNDHTI | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, AI_Literacies teilweise, Gender teilweise, Diversitaet teilweise, Fairness teilweise | |

## Abweichungen und Blocker

- 4ZL5Q48E, Entscheidung im Recode, Unclear statt Include: Das Werk behandelt Machtasymmetrien zwischen Management und Beschäftigten zentral, Bias und Diskriminierung aber nur in einem Absatz des Konzeptteils. Ich habe Bias_Ungleichheit als teilweise gewertet, weil die Kategorie auf Diskriminierung und Ungleichheit zwischen sozialen Gruppen zielt und organisationale Hierarchie allein sie nicht trägt. Benötigte Klärung: ob Machtungleichheit im Arbeitsverhältnis als soziale Ungleichheit im Sinne von Bias_Ungleichheit zählt; Domain-Expert:innen-Entscheidung empfohlen, da der Recode eine aktive Include-Annotation ersetzt.
- 7FBB2KUC, Metadatenlücke: Zeitschriftenname und DOI fehlen im Volltext, Titel, Autor:innen und Datum stimmen. Vorläufige Identität, keine Sperre.
- AHUSFEEA, Metadatenlücke und Variante: keine DOI, keine Einzelautor:innen, die Einleitung nennt Policymakers als Zielgruppe, während Titelblatt und ein Satz die Industriefassung angeben. Benötigte Klärung: ob der Volltext der gebundenen Version (version_type unknown) der Industriefassung entspricht.

## Codierregeln mit Auslegungsbedarf

- Publikationstyp, AHUSFEEA, EU-gefördertes Projekt-Toolkit mit institutioneller Autorschaft (DIVERSIFAIR, Work Package 5) und Quellenbasis aus Interviews, Fokusgruppen und Literatur; als Policy- und Praxisreport zugelassen, nicht als Ratgeber ohne wissenschaftliche Anlage, Grenzfall für die Expert:innen.
- AN_Harm_Types, AHUSFEEA, die Fallstudienbibliothek besteht aus zitierten Fällen, enthält aber eigene Analyseabschnitte (Intersectionality at play); ich habe sie als eigene Synthese gewertet und je Wert eine Passage belegt.
- AN_Harm_Types, INQNDHTI, die rassistisch verzerrte Allokation des US-Versorgungsalgorithmus ist eine allokative Disparität ohne Einordnung als direkt oder indirekt und blieb ohne eigenen Code; Indirect_Discrimination nur dort, wo das Werk selbst so klassifiziert.
- AN_Harm_Types, 2EBHMYU4, Exclusionary_Norms aus der zentralen Synthese der homogenen weißen männlichen Entwicklerschaft; Einzelfälle wie das Amazon-Tool blieben als zitierte Fälle unkodiert.
- AN_Theory_Reference, 7FBB2KUC, Staub-Bernasconis Menschenrechtsprofession rahmt die Gesamtanalyse und wird in der Diskussion auf das Diskriminierungsverbot bezogen; als Yes kodiert, Grenze zwischen rahmendem Konzept und Erwähnung offen.
- AN_Bias_Axes, 7FBB2KUC, digitale Affinität nicht als soziale Achse gewertet (analog zu Programmiererfahrung), daher None bei Exclusionary_Norms nach dem Anker MA3LBJS6.
- AN_Bias_Axes Other_Axis, 2EBHMYU4 (Globaler Norden und Süden), A2P8MXMY (Wohnort und Behördenstandort), AHUSFEEA (nicht-traditionelle Familienform), jeweils in AN_Notes benannt.
- AN_Gender_Understanding, AHUSFEEA, nur Intersectional kodiert; die Fälle vergleichen Frauen und Männer, ohne die Binarität zu prüfen. Die Kombination Binary_Categorical mit Intersectional bleibt nach Protokoll offen und wurde nicht vergeben.
- AN_Gender_Definition, 2EBHMYU4, Explicit auf Grundlage der eigenen Sätze zu Gender als sozial konstruierter, nicht mehr binär verstandener Kategorie im Abschnitt 2.1.
- AN_Task, AHUSFEEA und INQNDHTI, Other_Task für Einsatzfelder außerhalb der Sozialen Arbeit (Personalauswahl, Kredit, Betrugserkennung, Rückfallprognose, klinische Diagnose).

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
