# codebook-v141-includes-10-8-20261002 · ar2

- Akteur: agent
- Zuweisung: 22KJL3PC, 3AHQEHDF, 3AQ2K3BX, 6L85PRUW, 7L93JBLR, ERTJZW5M, K3YCLBXK, QY6P4RGQ (Reihenfolge des Laufmanifests)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-10-8-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 vor der Codierung gegen das Manifest geprüft, alle acht stimmen überein; jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 2 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 22KJL3PC | Fulltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting, Bias_Ungleichheit, Diversitaet (t), Fairness (t) | Prompt-Strategien gegen kulturellen Bias evaluiert |
| 3AHQEHDF | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit (t), Diversitaet | Preprint ohne DOI und Jahr im Text |
| 3AQ2K3BX | Fulltext | provisional | Unclear | AI_Literacies, KI_Sonstige (t), Bias_Ungleichheit (t), Diversitaet (t) | Sozialdimension nur nachgeordnet; DOI und Jahr fehlen im Text |
| 6L85PRUW | Fulltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting, Bias_Ungleichheit, Gender (t), Diversitaet | Inclusive prompt engineering, demonstriert |
| 7L93JBLR | Fulltext | verified | Include | Generative_KI (t), KI_Sonstige, Soziale_Arbeit (t), Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (t) | Feministische Lesart des AI Act |
| ERTJZW5M | Fulltext | verified | Unclear | AI_Literacies (t), KI_Sonstige, Bias_Ungleichheit (t) | Bias nur als Vertrauensbarriere |
| K3YCLBXK | Fulltext | verified | Include | AI_Literacies, Generative_KI (t), Prompting (t), KI_Sonstige (t), Bias_Ungleichheit, Gender (t), Diversitaet (t) | Policy-Report Digital Promise, zulässig |
| QY6P4RGQ | Fulltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit, Gender (t), Fairness (t) | DOI und Jahr fehlen im Text |

(t) = teilweise, sonst ja.

## Abweichungen und Blocker

- keine Blocker
- 3AHQEHDF, 3AQ2K3BX, QY6P4RGQ · Metadatenlücke · Titel und Autor:innen stimmen, DOI und Jahr fehlen im konvertierten Text · Abgleich mit Zotero-Metadaten, kein Titel- oder Kennungskonflikt
- K3YCLBXK · Publikationstyp · Bericht einer gemeinnützigen Organisation mit benannter Autorenschaft, Expert:innenreview und Literaturbasis, als belegter Policy-Report zugelassen · keine Klärung nötig, Hinweis für die Fachprüfung

## Codierregeln mit Auslegungsbedarf

- Bias_Ungleichheit · 3AQ2K3BX, ERTJZW5M · Bias als ein Thema unter mehreren (Ethik-Forschungsfrage bzw. eine Vertrauensbarriere) als teilweise gewertet, daraus Unclear
- Bias_Ungleichheit · K3YCLBXK · Justice ist einer von zwei Kernwerten des Rahmenwerks, daher ja
- Generative_KI · QY6P4RGQ · Rahmung als Large Language Models trägt ja, obwohl RoBERTa und DeBERTaV3 Encoder-Klassifikatoren sind
- Prompting · QY6P4RGQ · Template-Kontexte als Eingabeinstrument zur Bias-Erhebung als teilweise und Research_Instrument gewertet
- AN_Harm_Types · 22KJL3PC · Allokationen in simulierten Spielen (Diktator, Ultimatum) gegenüber Interaktant:innen nach angegebener Nationalität als Direct_Discrimination gewertet
- AN_Harm_Types · 7L93JBLR, K3YCLBXK · Regel 1.4.1 angewandt, zitierte Fallbeispiele (Hiring, Healthcare, Proxy-Variablen) nicht codiert, nur eigene Argumente und eigene Fallanalysen (SyRI, Google-Translate-Beispiel, Doctor-Beispiel)
- AN_Theory_Reference · 22KJL3PC · Hofstedes Kulturdimensionen rahmen die Erklärung der Bias-Quellen, daher Yes
- AN_Theory_Reference · QY6P4RGQ · Crawfords representational harms als Bias-Definition (Explicit) gewertet, nicht zusätzlich als Theoriebezug
- AN_Theory_Reference · K3YCLBXK · Tech-Justice-Perspektive ohne benannte Theorie, daher No
- AN_Gender_Definition · 7L93JBLR · Aussage zur sozialen Konstruktion und zu allen Geschlechtern einschließlich nicht-binärer Personen als Explicit gewertet
- AN_Population, AN_Task · 7L93JBLR · SyRI als einzelner Fall der Sozialverwaltung, adressiertes Feld bleibt Not_SW_Specific und Task None
- AN_Bias_Axes · 6L85PRUW · Disability aus der eigenen Argumentation zu Körper und Erscheinungsbild codiert, Grenzfall zu Physical_Appearance

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
