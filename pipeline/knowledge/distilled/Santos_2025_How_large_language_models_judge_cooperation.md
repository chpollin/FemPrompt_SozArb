---
title: "How large language models judge and influence human cooperation"
authors: ["Alexandre S. Pires", "Laurens Samson", "Sennay Ghebreab", "Fernando P. Santos"]
year: 2025
type: journalArticle
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Santos_2025_How_large_language_models_judge_cooperation.md
confidence: 88
---

# How large language models judge and influence human cooperation

## Kernbefund

LLMs zeigen Übereinstimmung bei der Beurteilung von Kooperation mit wohlreputablen Personen, aber erhebliche Varianz bei der Beurteilung von Kooperation mit Personen mit schlechtem Ruf; diese Unterschiede können Kooperationsniveaus signifikant beeinflussen, und gezielte Prompt-Interventionen können LLM-Normen lenken.

## Forschungsfrage

Wie beurteilen Large Language Models kooperatives Verhalten und welche Auswirkungen haben diese Urteile auf langfristige Kooperationsdynamiken in menschlichen Gesellschaften?

## Methodik

Mixed Methods: Empirisch (Analyse von 21 LLMs mit 43.200 Prompts zu Kooperationsszenarien) + Theoretisch (evolutionsspieltheoretisches Modell der indirekten Reziprozität)
**Datenbasis:** 21 LLMs (GPT-4o, Claude, Llama, Gemini, Deepseek, Grok, etc.), 43.200 generierte Prompts mit systematischen Variationen von Akteur-Namen (Geschlecht, kulturelle Herkunft), Kontexten und Themen

## Hauptargumente

- LLMs fungieren zunehmend als Berater bei sozialen Entscheidungen und können durch ihre Urteile über kooperatives Verhalten menschliche moralische und soziale Normen prägen, mit unbekannten langfristigen Konsequenzen für menschliche Kooperationsfähigkeit.
- Verschiedene LLMs internalisieren unterschiedliche soziale Normen (Image Score, Simple Standing, Shunning, Stern-Judging), die sich in ihrer Fähigkeit unterscheiden, Kooperation in Populationen aufrechtzuerhalten; neuere Modellversionen tendieren zu komplexeren, kontextabhängigen Normen.
- LLM-Urteile zeigen systematische Biases basierend auf den Namen (Geschlecht, wahrgenommener kultureller Hintergrund) und Kontexten der Akteure; Prompt-Engineering durch Universalisierungs-, Empathie-, Signalisierungs- und Motivations-Interventionen kann diese Normen gezielt verändern und damit kooperatives Verhalten lenken.

## Kategorie-Evidenz

### AI_Literacies

Das Paper analysiert, wie Menschen auf LLM-basierte Ratschläge reagieren und welche Kompetenz nötig ist, um Auswirkungen von LLMs auf soziale Entscheidungen zu verstehen: 'Humans increasingly rely on large language models (LLMs) to support decisions in social settings.'

### Generative_KI

Zentrale Analyse von 21 state-of-the-art Large Language Models (GPT-4o, Claude, Llama, Gemini, Deepseek) und deren Fähigkeit, soziale Urteile zu treffen: 'We provide 21 different LLMs with an extensive set of examples where individuals cooperate - or refuse cooperating - in a range of social contexts'

### Prompting

Explizite Untersuchung von Prompt-Engineering und dessen Effekt auf LLM-Normen: 'Finally, we test prompts to steer LLM norms, showing that such interventions can shape LLM judgements, particularly through goal-oriented prompts.' Mit vier Prompt-Interventionstypen: Universalisierung, Empathie, Signalisierung und Motivation.

### KI_Sonstige

Verwendung von evolutionsspieltheoretischen Modellen zur Analyse von Kooperationsdynamiken unter indirekter Reziprozität: 'we develop an evolutionary game theoretical model to study cooperation in an adaptive population where individuals repeatedly play donation games'

### Bias_Ungleichheit

Das Paper dokumentiert systematische Biases in LLM-Urteilen basierend auf wahrgenommener Identität: 'nearly all models judge donors based on gender and perceived cultural background of the agents (as inferred from their names), and more significantly, on the context of the interaction.' Dies kann soziale Ungleichheit verstärken.

### Gender

Analyse von Geschlechtseffekten in LLM-Urteilen: 'In Figure 2, this uncertainty is captured by the use of an ellipse indicating one standard deviation of the calculated social norm... models such as Grok 2 display more sensitive norms.' Datensatz enthält männliche und weibliche Namen: 'our prompt dataset contains a mixture of male and female recipient and donor names from various cultural backgrounds'

### Diversitaet

Explizite Untersuchung von Unterschieden in der Behandlung verschiedener kultureller und geschlechtlicher Gruppen: 'prompt dataset contains a mixture of male and female recipient and donor names from various cultural backgrounds' mit Namen aus Western, East Asian, Sub-Saharan, und MENA-Regionen. Das Paper analysiert, wie diese Diversitätsmarker LLM-Urteile beeinflussen.

### Fairness

Das Paper adressiert algorithmische Fairness durch die Frage, ob und wie LLM-Normen gerecht zwischen verschiedenen Populationen Kooperation aufrechterhalten können: 'we develop an evolutionary theoretical model of indirect reciprocity to evaluate the capacity to sustain human cooperation via the norms extracted from LLMs.' und 'to carefully align LLM norms in order to preserve human cooperation'

## Assessment-Relevanz

**Domain Fit:** Das Paper hat hohe Relevanz für die Schnittstelle zwischen KI und sozialen Systemen, nicht jedoch für klassische Soziale Arbeit als Praxis. Es trägt wichtige Erkenntnisse darüber bei, wie KI-Systeme menschliche soziale Normen und Kooperationsfähigkeit beeinflussen können. Für Soziale Arbeit relevant wären Fragen der Auswirkung auf vulnerable Populationen und sozialarbeiterische Entscheidungssysteme, die aber nicht explizit adressiert werden.

**Unique Contribution:** Das Paper verbindet erstmals empirische Analyse von LLM-basierten sozialen Urteilen mit evolutionsspieltheoretischen Modellen der indirekten Reziprozität und zeigt, dass LLM-Varianz in Normurteilen langfristige gesellschaftliche Kooperationsdynamiken signifikant verändern kann, sowie dass Prompt-Interventionen wirksam Normen lenken können.

**Limitations:** Die Studie untersucht nur Urteile zu abstrakten Kooperationsszenarien (Donationsspiele) und keine tatsächlichen menschlichen Verhaltensänderungen; die Evolution im Modell ist idealisiert; real-world Faktoren wie Netzwerk-Struktur, fehlerhafte Informationen oder kulturelle Spezifika sind nicht berücksichtigt; die Generalisierbarkeit der Findings auf nicht-Western-Kontexte ist unklar.

**Target Group:** KI-Forscher:innen, KI-Sicherheitsexpert:innen, Policymaker in Regulierung von LLMs, Ethiker:innen, Spiel- und Kooperationstheoriker:innen, Entwickler:innen von KI-Systemen; bedingt relevant für Sozialarbeiter:innen, die mit algorithmen-gestützten Entscheidungssystemen arbeiten

## Schlüsselreferenzen

- [[Nowak_Sigmund_2005]] - Evolution of indirect reciprocity
- [[Ohtsuki_Iwasa_2006]] - The leading eight: social norms that can maintain cooperation by indirect reciprocity
- [[Santos_Santos_Pacheco_2018]] - Social norm complexity and past reputations in the evolution of cooperation
- [[Weidinger_et_al_2021]] - Ethical and social risks of harm from language models
- [[Gallegos_et_al_2024]] - Bias and fairness in large language models: A survey
- [[Kotek_Dockum_Sun_2023]] - Gender bias and stereotypes in large language models
- [[Tao_et_al_2024]] - Cultural bias and cultural alignment of large language models
- [[Hu_et_al_2025]] - Generative language models exhibit social identity biases
- [[Krügel_Ostermaier_Uhl_2023]] - Chatgpt's inconsistent moral advice influences users' judgment
- [[Bai_et_al_2023]] - Artificial intelligence can persuade humans on political issues
