---
title: "Measuring gender and racial biases in large language models: Intersectional evidence from automated resume evaluation"
authors: ["Jiafu An", "Difang Huang", "Chen Lin", "Mingzhu Tai"]
year: 2025
type: journalArticle
language: en
categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
processed: 2026-02-04
source_file: An_2025_Measuring_gender_and_racial_biases_in_large.md
---

# Measuring gender and racial biases in large language models: Intersectional evidence from automated resume evaluation

## Kernbefund

LLMs bevorzugen systematisch weibliche Kandidaten und benachteiligen schwarze männliche Kandidaten bei ansonsten ähnlichen Qualifikationen. Diese Verzerrungen führen zu Unterschieden in der Einstellungswahrscheinlichkeit von 1-3 Prozentpunkten und sind konsistent über verschiedene Modelle und Jobpositionen hinweg.

## Forschungsfrage

Wie beeinflussen Geschlechts- und Rassenidentität die Bewertung von Jobkandidaten durch große Sprachmodelle, und welche intersektionalen Muster zeigen sich dabei?

## Methodik

Empirisch: Randomisiertes Experiment mit ~361.000 synthetischen Lebensläufen mit randomisierten sozialen Identitäten (Geschlecht und Rasse), bewertet durch fünf gängige LLMs (GPT-3.5 Turbo, GPT-4o, Gemini 1.5 Flash, Claude 3.5 Sonnet, Llama 3-70b). Regressionsanalysen mit Kontrollvariablen und Fixed Effects.
**Datenbasis:** n=~361.000 synthetische Lebensläufe mit randomisierten Merkmalen (Berufserfahrung, Bildung, Fähigkeiten) und zugewiesenen geschlechtlichen und rassischen Identitäten

## Hauptargumente

- LLM-basierte Entscheidungssysteme in der Rekrutierung erben und können soziale Verzerrungen verstärken, da sie auf von Menschen generierten Daten trainiert werden, die gesellschaftliche Biases widerspiegeln.
- Während LLMs weibliche Kandidaten bevorzugen (möglicherweise aufgrund von Debiasing-Maßnahmen in der Trainingsphase), zeigen sie gleichzeitig signifikante Verzerrungen gegen schwarze männliche Kandidaten, was auf intersektionale Komplexität hindeutet.
- Simplistische Debiasing-Methoden sind unzureichend; die komplexen Verzerrungsmuster deuten auf die Notwendigkeit nuancierterer, kontextabhängiger und intersektionaler Ansätze zur Minderung von Bias in KI-Systemen hin.

## Kategorie-Evidenz

### Generative_KI

Die Studie untersucht 'a number of commonly used LLMs, including OpenAI's GPT-3.5 Turbo and GPT-4o, Google's Gemini 1.5 Flash, Anthropic AI's Claude 3.5 Sonnet, and Meta's Llama 3-70b' bei der Bewertung von Lebensläufen.

### KI_Sonstige

Das Paper behandelt algorithmische Entscheidungssysteme, NLP-Bias und maschinelles Lernen im Kontext von 'high-stakes decision-making processes' in der Rekrutierung.

### Bias_Ungleichheit

Zentrales Thema: 'LLM-based AI systems demonstrate significant biases, varying in terms of the directions and magnitudes across different social groups' mit wirtschaftlichen Konsequenzen für unterrepräsentierte Gruppen.

### Gender

Expliziter Fokus auf Geschlechtsverzerrung: 'the LLMs award higher assessment scores for female candidates with similar work experience, education, and skills, but lower scores for black male candidates'.

### Diversitaet

Intersektionale Analyse rassischer und geschlechtsspezifischer Kategorien: 'we find that, in aggregate, most of the LLMs seem to be 'prosocial' when screening resumes: four out of five models we assessed yield significantly higher assessment scores on average for minority (female OR black) job candidates'.

### Feministisch

Explizite Verwendung von Crenshaw's Intersektionalitätsrahmen (Referenz 38: 'Crenshaw K. 2013. Demarginalizing the intersection of race and sex: a black feminist critique') und intersektionale Methodik: 'we explicitly evaluating how LLMs exhibit very different bias patterns across the intersections between gender and race'.

### Fairness

Fokus auf algorithmische Fairness in Hiring-Entscheidungen, Analyse differentieller Behandlung und wirtschaftlicher Auswirkungen: 'The effects are robust across different job positions and applications from different states. They are also robust when we repeat the analyses many times using randomly drawn subsamples.'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle AI und soziale Gerechtigkeit, insbesondere für Arbeitsmärkte und Chancengleichheit. Es adressiert zentrale Fairness-Fragen, die für Sozialarbeit und Policy-Making kritisch sind, behandelt aber nicht direkt sozialarbeiterische Praxis.

**Unique Contribution:** Erste großangelegte randomisierte Experimental-Studie zu intersektionalen Biases (Gender × Rasse) in aktuellen LLMs im Kontext von Jobrekrutierung mit über 361.000 synthetischen Lebensläufen und fünf prominenten Modellen, die zeigt, dass Debiasing-Maßnahmen zu ungleichmäßigen Ergebnissen führen können.

**Limitations:** Die Studie nutzt synthetische Resume-Daten mit zugewiesenen Namen als Identitätsmarker (keine Berücksichtigung von intersektionalen Phänotypen oder Kontexteffekten); Fokus auf englischsprachige, US-amerikanische Kontext; begrenzte Analyse der Mechanismen hinter den Verzerrungen.

**Target Group:** KI-Entwickler und Ethiker, HR-Professionals, Policy-Maker zu Algorithmen-Regulierung, Diversity-Officer, Sozialwissenschaftler zu Diskriminierung und Arbeitsmarkt, Fairness-Forscher, kritische KI-Literatur-Community

## Schlüsselreferenzen

- [[Bertrand_Mullainathan_2004]] - Are Emily and Greg more employable than Lakisha and Jamal? Field experiment on labor market discrimination
- [[Crenshaw_2013]] - Demarginalizing the intersection of race and sex: Black feminist critique
- [[Caliskan_Bryson_Narayanan_2017]] - Semantics derived from language corpora contain human-like biases
- [[Garg_et_al_2018]] - Word embeddings quantify 100 years of gender and ethnic stereotypes
- [[Bender_et_al_2021]] - On the dangers of stochastic parrots: can language models be too big?
- [[Mehrabi_et_al_2021]] - A survey on bias and fairness in machine learning
- [[Deshpande_Pan_Foulds_2020]] - Mitigating demographic bias in AI-based resume filtering
- [[Wilson_Caliskan_2024]] - Gender, race, and intersectional bias in resume screening via language model retrieval
- [[Armstrong_et_al_2024]] - The silicon ceiling: auditing GPT's race and gender biases in hiring
- [[Gallegos_et_al_2024]] - Bias and fairness in large language models: a survey
