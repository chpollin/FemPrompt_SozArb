# codebook-v141-includes-01-1-20261002 · ar2

- Akteur: agent
- Zuweisung: L6PH7GDL (Künstliche Intelligenz in der Sozialen Arbeit: Grundlagen für Theorie und Praxis)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-01-1-20261002/ar2/ar2-coding.json
- Quellenbasis: docs/data/fulltext/L6PH7GDL.md, Hash gegen das Laufmanifest geprüft, vollständig abschnittsweise gelesen
- Ergebnis: bestanden
- Verteilung: Include 1 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| L6PH7GDL | Fulltext | verified | Include | AI_Literacies ja, Generative_KI ja, KI_Sonstige ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, Prompting teilweise, Gender teilweise, Diversitaet teilweise, Fairness teilweise | Sammelband, als ein Werk codiert. DOI, Herausgeber:innen und Jahr stammen aus dem Impressum, das Manifest führt keine Vergleichswerte |

## Abweichungen und Blocker

- keine

## Codierregeln mit Auslegungsbedarf

- Kategorien und Analysefelder · L6PH7GDL · Ein Sammelband vereint Kapitel mit unterschiedlichem Schwerpunkt. Als `ja` gilt, was Einführung oder Ausblick der Herausgeber:innen als zentral setzen (KI-Kompetenz, Bias). Ein Thema, das ein einzelnes Kapitel trägt, gilt als `teilweise` (Diversitaet über das Inklusionskapitel). Analysefelder sammeln, was einzelne Kapitel als eigenes Argument führen.
- AN_Harm_Types · L6PH7GDL · Der Band stützt Diskriminierung fast nur auf zitierte Fälle (Allegheny-Proxy, niederländischer Kindergeldfall, UNESCO-Bilder, Gender Shades). Nach Regel 1.4.1 bleiben diese uncodiert. Codiert ist nur `Exclusionary_Norms`, weil die Einführung ohne Fremdbeleg argumentiert, dass Adressat:innen von der in den Trainingsdaten dominierenden Norm abweichen. Die Wiedergabe des Allegheny-Mechanismus mit eigenen Worten im Ausblick ist ein Grenzfall für `Indirect_Discrimination`.
- AN_Bias_Axes · L6PH7GDL · Zitierte Fälle, die ein Kapitel als eigenes Beispiel ausführt, zählen nach dem Anker VSZM7CT6 als Achse. Dadurch sind Achsen erfasst, deren Schadensart nach der strengeren Regel für AN_Harm_Types uncodiert bleibt. `Intersectional` ist nicht codiert, weil der Vergleich von BIPoC-Frauen mit weißen Männern kein Ergebnis zeigt, das von der Kombination abhängt.
- AN_Gender_Definition und AN_Gender_Understanding · L6PH7GDL · Geschlecht kommt nur in knappen Diskriminierungsbeispielen und beim digitalen Gender Gap Älterer vor, jeweils mit Frauen und Männern. `Absent` mit `Unclear` ist gewählt, weil ein Verständnis von Geschlecht nicht bestimmbar ist. Vertretbar wäre auch `Implicit_Only` mit `Binary_Categorical`.
- AN_Prompting_Role · L6PH7GDL · `Recommended_Practice` stützt sich auf die Strukturvorgabe, mit der der Aktennotiz-Prototyp instruiert wurde. Die Prompting-Angriffe im IT-Sicherheitskapitel sind als Risikobeschreibung gelesen und nicht als `Object_of_Critique` codiert.
- AN_Theory_Reference · L6PH7GDL · Codiert ist der kritische Inklusions-/Exklusionsbegriff des Inklusionskapitels, weil er dort die Behandlung von Unterrepräsentation und Bias rahmt. Menschenrechtsprofession, Media Equation und CASA rahmen Ethik oder Kommunikation, nicht Geschlecht oder Bias.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
