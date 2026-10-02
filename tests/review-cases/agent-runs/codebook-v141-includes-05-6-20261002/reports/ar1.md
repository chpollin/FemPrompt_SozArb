# codebook-v141-includes-05-6-20261002 · ar1

- Akteur: agent
- Zuweisung: 3XMBE43Z, 6L6WSDC8, HLBXNWAZ, JZN2I6J5, P82X89Q4, YMABYPKF (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-05-6-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller sechs Quellen gegen das Laufmanifest geprüft und übereinstimmend, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 4 · Unclear 1 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 3XMBE43Z | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja), Fairness (teilweise) | Promptexperiment zu Policy-Empfehlungen, feministische Theorierahmung |
| 6L6WSDC8 | Fulltext | provisional | Unclear | Generative_KI, Prompting (ja), Bias_Ungleichheit, Diversitaet (teilweise) | Perspektivendiversität ohne soziale Gruppen, Jahr und DOI fehlen im Text |
| HLBXNWAZ | Fulltext | verified | Include | Generative_KI, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja), AI_Literacies, Prompting (teilweise) | intersektionale visuelle Analyse von Stable Diffusion |
| JZN2I6J5 | Fulltext | provisional | Include | Prompting, Bias_Ungleichheit, Gender, Fairness (ja), Generative_KI (teilweise) | Soft Prompt Tuning für Encoder-Modelle, Jahr und DOI fehlen im Text |
| P82X89Q4 | Fulltext | verified | Exclude (Not_relevant_topic) | AI_Literacies (ja), Generative_KI (teilweise) | Sozialdimension vollständig nein |
| YMABYPKF | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Fairness (ja) | namensbasierter Audit, Ankerwerk des Codebuchs |

## Abweichungen und Blocker

- 6L6WSDC8 · Metadatenlücke · Text nennt weder Jahr noch Venue noch DOI, Titel stimmt exakt · keine Klärung für die Codierung nötig, Identität vorläufig
- JZN2I6J5 · Metadatenlücke · Text nennt weder Jahr noch Venue noch DOI, Titel stimmt bis auf Großschreibung · keine Klärung für die Codierung nötig, Identität vorläufig
- 6L6WSDC8 und P82X89Q4 · Entscheidung abweichend vom Laufzweck · der Lauf ist als Include-Batch beschrieben, die quellengebundene Kategorienbewertung ergibt Unclear und Exclude · fachliche Bestätigung durch die AI Agent Review und gegebenenfalls Domänenexpert:innen
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- Diversitaet, Bias_Ungleichheit · 6L6WSDC8 · Perspektivendiversität von Meinungen und Bias gegenüber dominanten Meinungen ohne Analyse sozialer Gruppen, als teilweise gewertet, daher Unclear
- Generative_KI · JZN2I6J5 · BERT und RoBERTa sind Encoder-Modelle, das Werk nennt sie LLMs, als teilweise gewertet, Technikdimension trägt Prompting
- AN_Mitigation_Stage · JZN2I6J5 · trainierte Soft Prompts bei eingefrorenem Modell als In_Training und Prompt_Practice codiert
- AN_Bias_Axes · JZN2I6J5 · Race_Ethnicity und Religion nur als Nebeneffekt auf StereoSet gemessen, nach der Messregel codiert
- AN_Bias_Axes, AN_Gender_Understanding · YMABYPKF · Intersectional codiert, weil Namen Schwarzer Frauen schlechter abschneiden als Schwarze und weibliche Namen, obwohl die Autor:innen ausdrücklich keine Intersektionalitätsanalyse beanspruchen, kombiniert mit Binary_Categorical
- AN_Harm_Types · YMABYPKF · nur Indirect_Discrimination, die Stereotyp-Erklärung der Autor:innen gilt als Mechanismus, nicht als eigene Schadensart
- AN_Theory_Reference · YMABYPKF · Doktrin von disparate treatment und disparate impact als rahmendes rechtliches Konzept gewertet, Grenzfall zwischen Theorie und Rechtsrahmen
- AN_Gender_Understanding · 3XMBE43Z · Social_Construct auf Connells Satz zu institutionell eingebetteten Geschlechterverhältnissen gestützt, das Werk nutzt zugleich biologische Stoffwechselunterschiede als Prämisse
- AN_Gender_Definition · HLBXNWAZ · Fußnote zur binären Gendernorm und zur gewählten Terminologie als ausdrückliche Bestimmung gewertet
- AN_Bias_Axes · HLBXNWAZ · Sexual_Orientation_Identity aus Heteronormativität und fehlender nicht-binärer Darstellung, Physical_Appearance aus fehlenden Körpergrößen, Toxicity für die Konföderiertenflagge nicht codiert

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
