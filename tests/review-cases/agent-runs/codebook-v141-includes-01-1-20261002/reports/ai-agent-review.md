# codebook-v141-includes-01-1-20261002, AI Agent Review

- Akteur: agent (ai-agent-review), Claude Code subagent, Modell claude-opus-5-5
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, Hashes gegen das Manifest geprüft
- Quelle: docs/data/fulltext/L6PH7GDL.md, Hash gegen das Manifest geprüft, vollständig gelesen einschließlich aller Kapitel, Literaturverzeichnisse und des Autor:innenverzeichnisses
- Ergebnis: 1 Record, resolved, keine Blocker
- Verteilung: Include 1, Unclear 0, Exclude 0
- Validator: PASS AI-agent review: 1 records

## Record L6PH7GDL

Der Sammelband „Künstliche Intelligenz in der Sozialen Arbeit: Grundlagen für Theorie und Praxis“ (Beltz Juventa 2025, DOI 10.3262/978-3-7799-8562-4) ist als ein Werk codiert. Titel, DOI, Herausgeberschaft und Jahr stimmen mit der Paper-Ebene überein. Als wissenschaftlicher Sammelband mit identifizierbarer Kapitelautorschaft erfüllt er die Publikationstypregel.

Beide Tracks vergeben identische Kategorienwerte. AI_Literacies, Generative_KI, KI_Sonstige, Soziale_Arbeit und Bias_Ungleichheit stehen auf ja, Prompting, Gender, Diversitaet und Fairness auf teilweise, Feministisch auf nein. Daraus folgt Include. Alle Belegstellen beider Tracks sind zeichengetreu in der Quelle enthalten. Der finale Record übernimmt die Vereinigung der Belege.

## Auflösungen

| Feld | ar1 | ar2 | gewählt | Grund |
|---|---|---|---|---|
| AN_Prompting_Role | mit Object_of_Critique | ohne | mit Object_of_Critique | Pelzl analysiert Prompting-Angriffe als Praxis manipulierender Eingaben |
| AN_Bias_Axes | Language_Culture, ohne Disability | Disability, ohne Language_Culture | beide Achsen | eigene Beobachtung zur Dialekterkennung bei Plafky et al. und Steiners eigene Forderung „vor allem im Bereich Behinderung“ |
| AN_Harm_Types | Exclusionary_Norms, Erasure, Disparate_Performance | Exclusionary_Norms | wie ar1 | Erasure aus Steiners eigener Analyseebene a) und Tappe, Disparate_Performance aus dem eigenen Befund zur Sprachvarietät |
| AN_Population | mit Health_Care, Social_Assistance_Admin | ohne | wie ar1 | Schlomann 3.3 und Heffels zur Pflege, Dötterl 5.1 zum Zugang zu Sozialleistungen |
| AN_Gender_Definition | Implicit_Only | Absent | Absent | kein Kapitel bestimmt Geschlecht, die Hinweise sind zitierte Befunde und Aufzählungen |
| AN_Gender_Understanding | Binary_Categorical | Unclear | Unclear | Paarung mit Absent, keine eigene Analyse, die auf zwei festen Kategorien beruht |

Übereinstimmende Werte (Studientyp Theoretisch, AN_Task, AN_Prompt_Techniques General_Guidance, AN_Mitigation_Stage Pre_Processing und Organisational_Process, AN_Mitigation_Status Proposed, AN_Bias_Definition Explicit, AN_Theory_Reference Yes mit Steiners kritischer Fassung von Inklusion und Exklusion) trägt die Quelle. Sie bleiben unverändert.

## Markierung für Domänenexpert:innen

L6PH7GDL ist für eine fachliche Entscheidung markiert. Der Band wird als ein Werk codiert, mehrere Analysewerte stützen sich auf einzelne Kapitel. Grenzfälle sind Disability (Steiner), Erasure (Steiner, Tappe), Disparate_Performance und Language_Culture aus einer beiläufigen Dialektbeobachtung, Object_of_Critique aus Prompting-Angriffen sowie die Gender-Felder, die nur auf verstreuten zitierten Beispielen beruhen.

## Selbstprüfung

- zugewiesene und geprüfte IDs stimmen überein: ja
- alle Belegstellen im finalen Record sind zeichengetreu in der Quelle: ja
- Include vollständig analysiert, Paarungsregeln der SQ4-Felder eingehalten: ja
- Manifest, Coding-Pakete und Tracks unverändert: ja
- Validator bestanden: ja
