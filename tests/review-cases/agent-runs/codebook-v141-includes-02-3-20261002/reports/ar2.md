# codebook-v141-includes-02-3-20261002 · ar2

- Akteur: agent
- Zuweisung: AXEIVEW3, LXDG4KQK, Y6M97SWQ (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-02-3-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/, SHA-256 aller drei Quellen stimmt mit dem Laufmanifest überein, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 3 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| AXEIVEW3 | Fulltext | verified | Include | AI_Literacies ja, Soziale_Arbeit ja; Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet teilweise | Erasmus+-Projektbericht mit DOI und Methodik, als belegter Forschungsreport zulässig |
| LXDG4KQK | Fulltext | verified | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet ja; AI_Literacies, Gender, Fairness teilweise | Amnesty-Report ohne DOI, stabile Kennung Index EUR 18/8709/2024, institutionelle Autorschaft |
| Y6M97SWQ | Fulltext | verified | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Fairness ja; AI_Literacies teilweise | Systematischer Review, DOI 10.1177/10497315251350933 |

## Abweichungen und Blocker

- keine

## Codierregeln mit Auslegungsbedarf

- Soziale_Arbeit · AXEIVEW3 · Jugendarbeit (youth work) wird als Handlungsfeld der Sozialen Arbeit gewertet und trägt das Include. Wird Jugendarbeit nicht als Soziale Arbeit gelesen, fiele das Werk auf Unclear.
- AN_Population · AXEIVEW3 · Kein Wert deckt allgemeine Jugendarbeit genau ab. Gewählt sind Child_Family_Welfare (Jugendarbeit als Teil der Kinder- und Jugendhilfe) und Education_Professional (KI-Kompetenzbedarf der Fachkräfte), nicht Homelessness_Youth, das prekäre Lebenslagen voraussetzt.
- AN_Bias_Axes · AXEIVEW3 · Geschlechts- und Altersunterschiede der KI-Nutzung stammen aus einer zitierten Umfrage und werden nicht als Bias analysiert, daher nicht codiert. Codiert ist nur Language_Culture aus den eigenen Fokusgruppen.
- AN_Gender_Definition/AN_Gender_Understanding · AXEIVEW3 · Implicit_Only mit Binary_Categorical aus dem Männer-Frauen-Vergleich in Abschnitt 3.2, der in den Schlussfolgerungen wieder aufgenommen wird. Alternativ wäre Not_Applicable vertretbar, wenn dieser Vergleich als bloße Stichprobenangabe gelesen wird.
- Fairness · LXDG4KQK · teilweise statt ja, weil Fairnessmetriken (TPR, Falsch-Positiv-Rate, demographic parity) einen Abschnitt tragen, der Bericht aber menschenrechtlich rahmt und Fairnessmethoden ausdrücklich als begrenztes Werkzeug bezeichnet.
- Feministisch · LXDG4KQK · nein, weil intersektionale Diskriminierung nur in Hintergrund und Empfehlungen genannt wird und die strukturelle Machtanalyse rassismus- und migrationsbezogen, nicht geschlechterbezogen geführt wird.
- AN_Bias_Axes · LXDG4KQK · Other_Axis für Familien- bzw. Beziehungsstatus und Haushaltszusammensetzung, die der Bericht als eigene Diskriminierungsgrundlage des Modells „Really Single“ analysiert.
- AN_Harm_Types · LXDG4KQK · Stereotyping nicht codiert, da die Zuschreibung „Ausländer betrügen eher“ als politisches Narrativ und Systemannahme argumentiert wird, nicht als Ausgabe des Systems.
- AN_Gender_Definition/AN_Gender_Understanding · LXDG4KQK · Absent mit Unclear, da Frauen in Krisenzentren als Gruppe behandelt werden, ohne dass ein Geschlechterverständnis erkennbar wird. Die Glossaraufzählung mit gender identity und intersex status bleibt eine Rechtsliste.
- AN_Bias_Definition/AN_Theory_Reference · Y6M97SWQ · Explicit über Russells Equity-Kriterium der konsistenten Vorhersage über Subgruppen, das der Review in seinen Analyserahmen übernimmt. Yes für die ethischen Rahmenwerke von Russell und Drake et al. mit CFIR als Rahmung von Fairness und Equity. Ob ein Implementierungs- und Ethikrahmen als Theoriebezug zählt, ist die Grenzlinie.
- AN_Mitigation_Status · Y6M97SWQ · Evaluated nur für die synthetisierte Post-Processing-Korrektur von Purdy und Glass (2023) mit berichteter Senkung der Fehlerraten, kein eigenes Experiment des Reviews.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
