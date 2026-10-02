# codebook-v141-includes-12-9-20261002 · ar1

- Akteur: agent
- Zuweisung: C325Y32P, CYZQ6XPK, KRUQB7L2, LT3D3ZQ2, LXKXPD5H, MTMU9UPJ, N7J2ZRFP, V4GTLMED, VP6SXQHY (Laufmanifest, Codebuch 1.4.1, Prompt 1.4)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-12-9-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, alle vollständig gelesen, SHA-256 aller neun Quellen stimmt mit dem Manifest überein
- Ergebnis: bestanden
- Verteilung: Include 5 · Unclear 3 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| C325Y32P | Volltext | verified | Unclear | KI_Sonstige ja; AI_Literacies, Generative_KI, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Fairness teilweise | Policy-Report (WEF/Schwab Foundation) zu KI-Adoption sozialer Innovator:innen, keine Sozialkategorie zentral |
| CYZQ6XPK | Volltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender ja; Fairness teilweise | CoT-Debiasing, Experimentell, Evaluated |
| KRUQB7L2 | Volltext | verified | Exclude (Not_relevant_topic) | Generative_KI ja; AI_Literacies, Prompting teilweise | Kalibrierung von LLM-Erklärungen, keine Sozialdimension |
| LT3D3ZQ2 | Volltext | verified | Include | KI_Sonstige, Feministisch ja; Bias_Ungleichheit, Gender, Diversitaet teilweise | Feministische Metaethik der KI, Theoretisch |
| LXKXPD5H | Volltext | provisional | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit ja; AI_Literacies, Generative_KI, Diversitaet, Fairness teilweise | Tagungs-Handout ohne Autor:innenangabe im Text |
| MTMU9UPJ | Volltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Fairness ja | DR.GAP, Experimentell, Evaluated |
| N7J2ZRFP | Volltext | verified | Unclear | KI_Sonstige ja; Bias_Ungleichheit teilweise | IR-Agenda zu Big Tech, Bias nur ein Absatz |
| V4GTLMED | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Diversitaet, Feministisch ja; AI_Literacies, Gender, Fairness teilweise | Interviewstudie, Empirisch |
| VP6SXQHY | Volltext | verified | Unclear | AI_Literacies ja; Generative_KI, Prompting, Bias_Ungleichheit, Fairness teilweise | AI-Literacy-Framework für Unternehmen, Bias nur als Teil ethischer Literacy |

## Abweichungen und Blocker

- LXKXPD5H · Publikationstyp und Identität · Handout der OGSA-Tagung vom 25. März 2025, im Text weder Autor:in noch DOI oder Verlag, nur Literaturempfehlungen statt Belegapparat. Als Konferenzbeitrag und wissenschaftliche Graue Literatur codiert, Identität provisional · Domain-Expert:innen bestätigen Autorschaft und Zulässigkeit unter der Publikationstypregel.
- C325Y32P, KRUQB7L2, N7J2ZRFP, VP6SXQHY · Entscheidung abweichend vom Laufzweck · Der Lauf codiert eingeschlossene Werke, die quellengebundene Kategorienprüfung erreicht hier aber keine Sozialkategorie auf `ja` (drei Unclear, ein Exclude). Keine Analysefelder erhoben · Domain-Expert:innen prüfen, ob die frühere Include-Entscheidung auf einer anderen Lesart von Soziale_Arbeit, Bias_Ungleichheit oder Fairness beruht.
- Kein Blocker. Keine Regelwidersprüche zwischen Codebuch, Protokoll und Manifest festgestellt.

## Codierregeln mit Auslegungsbedarf

- AN_Gender_Understanding · LT3D3ZQ2 · Intersectional stützt sich auf das eigene, aber programmatische Argument, die Wirkung von KI nach Gender in Wechselwirkung mit weiteren Merkmalen zu untersuchen. AN_Bias_Axes bleibt None, weil kein Bias analysiert wird. Die Asymmetrie folgt daraus, dass die Feldregel für Intersectional auf AN_Bias_Axes verweist, während das Gender-Verständnis die Analyse des Werks beschreibt.
- AN_Bias_Definition · CYZQ6XPK, MTMU9UPJ · Explicit aus der operationalen Bestimmung von Bias durch Benchmark-Metriken (unbiased gleich unveränderte Genauigkeit, Delta G). Grenze zu Implicit_Only („aus Messung erkennbar“) ist eng.
- AN_Bias_Definition · V4GTLMED · Explicit aus der eigenen Bestimmung von „AI partiality“ als Ersatzbegriff für Bias. Die Bestimmung gilt dem Nachfolgebegriff, nicht Bias selbst.
- AN_Harm_Types · MTMU9UPJ · Disparate_Performance aus der gemessenen Genauigkeitsdifferenz zwischen maskulinen und femininen Pronomen. Exclusionary_Norms (männlicher Default in VLMs) nicht codiert, weil das Werk die Erklärung nur vermutet („may arise“).
- AN_Bias_Axes · LXKXPD5H · Achsen aus den eigenen Fallbeispielen des Handouts. Wohnort (Stadtteil) als Other_Axis, Disability und Gender nur in Aufzählungen.
- AN_Task · LXKXPD5H · Teaching_Further_Education für den mit ChatGPT verbundenen Avatar Konrad in Workshops. Dokumentationssysteme ohne KI-Bezug nicht als Documentation_Recording codiert.
- Fairness · CYZQ6XPK teilweise, MTMU9UPJ ja · Beide nutzen Bias-Metriken und Debiasing; MTMU9UPJ rahmt Metriken und Methode ausdrücklich als Fairness, CYZQ6XPK nur beiläufig.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
