# codebook-v141-includes-13-10-20261002, ar2

- Akteur: agent
- Zuweisung: 3B87U5LN, 7AMRV4DT, BJZYGNEE, CY5IMM6G, H59BNSX8, I78CL6R5, MJDTRLAI, PQC9G5EU, SS5HTYY6, VFD9ENG6
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-13-10-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/ laut Laufmanifest, jeweils vollständig gelesen; Regelquellen assessment/categories.yaml v1.4.1 und die freigegebenen Abschnitte von knowledge/update-protocol.md
- Ergebnis: bestanden
- Verteilung: Include 8, Unclear 1, Exclude 1, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 3B87U5LN | Volltext | verified | Include | Generative_KI, Soziale_Arbeit (ja); AI_Literacies, KI_Sonstige, Bias_Ungleichheit (teilweise) | Soziale_Arbeit allein über die Zielgruppenklausel (psychosoziale Unterstützung), Soziale Arbeit wird nicht genannt |
| 7AMRV4DT | Volltext | provisional | Exclude (Not_relevant_topic) | KI_Sonstige (ja); Generative_KI, Prompting (teilweise) | Bias meint kognitiven Vertrauensbias, keine soziale Kategorie positiv |
| BJZYGNEE | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja); AI_Literacies, Fairness (teilweise) | DOI fehlt im Text |
| CY5IMM6G | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Generative_KI, Diversitaet, Fairness (teilweise) | Belege mit weichen Trennstrichen zeichengetreu übernommen |
| H59BNSX8 | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Diversitaet, Feministisch, Fairness (teilweise) | Autorname Lal/Lai im Text uneinheitlich |
| I78CL6R5 | Volltext | provisional | Unclear | AI_Literacies (ja); Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Diversitaet, Fairness (teilweise) | K-12-Rahmenwerk, soziale Dimension nur nachgeordnet |
| MJDTRLAI | Volltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet (ja); Fairness (teilweise) | Preprint ohne DOI und Jahr |
| PQC9G5EU | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja); AI_Literacies, Fairness (teilweise) | Buchkapitel ohne DOI, Verlag und Jahr im Text |
| SS5HTYY6 | Volltext | provisional | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Generative_KI, Diversitaet, Fairness (teilweise) | Literaturbasis mit Platzhalter-URLs und verschobenen Jahresangaben |
| VFD9ENG6 | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Feministisch, Fairness (ja); Generative_KI, Gender, Diversitaet (teilweise) | Preprint ohne DOI und Jahr |

## Abweichungen und Blocker

- 7AMRV4DT, Entscheidung, keine soziale Kategorie erreicht teilweise, der Text behandelt Vertrauen und Über- bzw. Unterabhängigkeit in Diagnose- und Wissensaufgaben ohne Diskriminierungs-, Gender- oder Sozialarbeitsbezug; Exclude trotz Zuweisung als Include-Batch, fachliche Bestätigung durch die Domänenexpert:innen.
- I78CL6R5, Entscheidung, Bias, Fairness und Inklusion erscheinen nur als nachgeordnete Inhalte eines K-12-Curriculums; Unclear, fachliche Bestätigung durch die Domänenexpert:innen.
- SS5HTYY6, Quellenintegrität, mehrere Referenzen tragen Platzhalter-URLs (https://www.ap.org/xxxx) und für bekannte Werke abweichende Jahre oder DOIs (Angwin 2023, Buolamwini und Gebru 2022); die Publikationstypregel ist formal erfüllt (Zeitschriftenartikel mit ISSN), die Belastbarkeit der Synthese braucht eine Integritätsprüfung durch die Domänenexpert:innen.
- Fehlende DOI bei 7AMRV4DT, BJZYGNEE, I78CL6R5, MJDTRLAI, PQC9G5EU, SS5HTYY6, VFD9ENG6, Titel und Autor:innen stimmen, daher provisional ohne Sperre.
- Kein Blocker, kein Widerspruch zwischen Regelquellen festgestellt.

## Codierregeln mit Auslegungsbedarf

- Soziale_Arbeit, 3B87U5LN, Nutzer:innen generativer Chatbots zur psychischen Gesundheit als Zielgruppe Sozialer Arbeit gewertet (ja), obwohl das Werk Soziale Arbeit nicht nennt.
- AN_Gender_Understanding, BJZYGNEE, Social_Construct auf die übernommene feministische STS-Rahmung und Wajcmans „historical and cultural construction of gender“ gestützt, eine eigene Bestimmung fehlt, daher AN_Gender_Definition Implicit_Only.
- AN_Harm_Types, BJZYGNEE, None trotz „male as norm“ und genderstereotyper Word Embeddings, weil beides als Position zitierter Autor:innen berichtet wird und die Typologie nicht nach Schadensarten gegliedert ist.
- AN_Mitigation_Status, BJZYGNEE und SS5HTYY6, Demonstrated als synthetisierter Status für berichtete Anwendungen ohne Ergebnis.
- AN_Harm_Types, CY5IMM6G, eigene hypothetische Fallbeispiele (Hypothekenplattform ohne informelles Einkommen, Trainingsdaten englischsprachiger Versicherter) als Indirect_Discrimination und Exclusionary_Norms gewertet.
- AN_Theory_Reference, CY5IMM6G, „antiracist and intersectional lenses“ als empfohlene Linse, nicht als Rahmung der eigenen Bias-Behandlung, daher No; H59BNSX8 dagegen Yes, weil Intersektionalität und Critical Race Theory die eigene Pädagogik der Fallanalyse rahmen.
- AN_Harm_Types, H59BNSX8, nur das eigene NDIS-Argument (standardisierter Score übersieht Behinderungsfolgen in einer Leistungsentscheidung) als Indirect_Discrimination, COMPAS- und Heat-List-Befunde als zitiert nicht codiert.
- AN_Bias_Axes, MJDTRLAI, die vom Werk „geography“ genannte Achse als Nationality_Migration codiert (Herkunftsland, Region), Hemisphären-Prompts nicht als soziale Achse.
- AN_Harm_Types, SS5HTYY6 und VFD9ENG6, nicht klassifizierte Allokationsdisparitäten als Indirect_Discrimination codiert, bei SS5HTYY6 wegen der genannten Datenproxy-Ursache, bei VFD9ENG6 über die 80-Prozent-Regel des disparate impact nach Anker YMABYPKF; der Pilot hatte diese Frage offen gelassen.
- AN_Gender_Understanding, VFD9ENG6, Binary_Categorical zusammen mit Intersectional, weil Geschlecht kategorial binär geführt und in Kombination mit Race analysiert wird.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
