---
title: "What's in a Name? Auditing Large Language Models for Race and Gender Bias"
authors: ["Alejandro Salinas", "Amit Haim", "Julian Nyarko"]
year: 2025
type: workingPaper
language: en
processed: 2026-02-05
source_file: Salinas_2025_What’s_in_a_name_Auditing_large_language_models.md
confidence: 89
---

# What's in a Name? Auditing Large Language Models for Race and Gender Bias

## Kernbefund

LLMs zeigen systematische Biase, die Namen benachteiligen, die mit rassischen Minderheiten und Frauen assoziiert sind, wobei Black Women die am meisten benachteiligten Ergebnisse erhalten. Diese Biase sind konsistent über Modelle und Szenarien hinweg und können durch numerische Anker, nicht aber durch qualitative Details reduziert werden.

## Forschungsfrage

Sind state-of-the-art Large Language Models (einschließlich GPT-4) anfällig für systematische Biase basierend auf Namen, die mit Rasse und Geschlecht korrelieren?

## Methodik

Empirisch: Audit-Studiendesign mit direktem Prompting. 42 Prompt-Templates über 14 Domänen mit systematischer Variation von Namen nach Rasse/Geschlecht-Assoziationen. Mehrere Modelle getestet (GPT-4o, GPT-4, GPT-3.5, Llama-3-70B, Mistral Large, PaLM-2). Quantitative Analyse mit Konfidenzintervallen.
**Datenbasis:** 42 Prompt-Templates über 14 Domänen (z.B. Autoverkauf, Wahlprognosen, Einstellungen, Sportvorhersagen); Tests mit 6 verschiedenen LLMs; systematische Variation nach Rasse und Geschlecht basierend auf Namen-Assoziationen

## Hauptargumente

- Namen, die mit rassischen Minderheiten und Frauen assoziiert sind, führen systematisch zu weniger vorteilhaften Ratschlägen und Vorhersagen durch LLMs, was auf implizit kodierte Stereotype hinweist, die den US-Bevölkerungsstereotypen entsprechen.
- Qualitative Kontextinformationen haben inkonsistente Effekte auf Bias-Reduktion und können Disparitäten sogar verstärken, während numerische Anker in den meisten Szenarien wirksam gegen Namen-basierte Disparitäten sind.
- Trotz Bemühungen um Bias-Mitigation und Guardrails gegen explizite Diskriminierung basierend auf Rasse und Geschlecht bleiben LLMs von Bias durchdrungen, was die Notwendigkeit von Audits bei Deployment und Implementation unterstreicht, nicht nur während der Entwicklung.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf state-of-the-art LLMs: 'We employ an audit design to investigate biases in state-of-the-art large language models, including GPT-4.'

### Evidenz 2

Systematische Variation von Prompts: 'We assess the name-sensitivity of the output produced by state-of-the-art language models. Our assessment encompasses 42 idiosyncratic prompts.'

### Evidenz 3

Algorithmic fairness und NLP: 'The fairness of AI algorithms, including LLMs, has been a pernicious issue, motivating a growing literature and community of AI ethics research.'

### Evidenz 4

Zentrale Fokus auf algorithmischen Bias und strukturelle Benachteiligung: 'Names associated with white men yield the most beneficial predictions, while those associated with Black women generate outcomes that disadvantage the individual in question.'

### Evidenz 5

Expliziter Geschlechterfokus in Bias-Analyse: 'Disparities across gender and race, among other attributes, have especially preoccupied the field. Names associated with Black women receive the least advantageous outcomes.'

### Evidenz 6

Fokus auf marginalisierte Gruppen und Intersektionalität: 'The biases are consistent with common stereotypes prevalent in the U.S. population. The findings suggest that... disparities are the result of a systematic bias... to the disadvantage of women, Black communities, and in particular Black women.'

### Evidenz 7

Algorithmische Fairness und Fairness-Audit: 'bias auditing as an important component of AI harm mitigation in policy discussions and regulatory frameworks' und explizite Verbindung zu Disparate Impact Konzepten in der Rechtsprechung.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist für die Schnittstelle KI und Soziale Arbeit relevant, da es zeigt, dass LLMs in praktischen Anwendungskontexten (wie Beratung, Recruiting, oder Unterstützungsentscheidungen) systematische Biase reproduzieren können, die marginalisierte Gruppen benachteiligen - zentrale Anliegen der Sozialen Arbeit.

**Unique Contribution:** Das Paper führt das erste umfassende Audit von state-of-the-art LLMs (besonders GPT-4) durch, das systematische Namen-basierte Biase mit kontinuierlichen Outcome-Metriken über 14 praktische Domänen hinweg dokumentiert und empirisch das Versagen qualitativer Bias-Mitigationsstrategien zugleich wie die Effektivität numerischer Anker demonstriert.

**Limitations:** Die Studie basiert auf englischsprachigen Namen und US-amerikanischen Stereotypen; die Generalisierbarkeit auf andere sprachliche/kulturelle Kontexte ist unklar; die Kausalität zwischen Namen-Wahrnehmung und Modell-Bias wird nicht mechanistisch erklärt.

**Target Group:** KI-Entwickler und Deployment-Teams, Policymaker und Regulators, AI-Ethics-Forscher, Organisationen die LLMs in Entscheidungssystemen einsetzen (HR, Finanzdienstleistungen, öffentliche Dienste), kritische Technologie-Studien; begrenzt direkt relevant für Sozialarbeiter, aber indirekt für die Kritik algorithmischer Systeme in Sozialen Diensten

## Schlüsselreferenzen

- [[Bertrand_Mullainathan_2004]] - Resume correspondence study on hiring bias
- [[Caliskan_Bryson_Narayanan_2017]] - Word Embedding Association Test (WEAT)
- [[Buolamwini_Gebru_2018]] - Gender Shades - Facial Recognition Bias
- [[Kotek_Dockum_Sun_2020]] - Ambiguous pronoun resolution in LLMs
- [[Sheng_et_al_2019]] - Measuring gender and racial bias in language models
- [[Veldanda_et_al_2024]] - LLM bias in resume-to-job matching
- [[Wan_et_al_2023]] - Gender bias in reference letter generation by LLMs
- [[Gaebler_et_al_2023]] - Reverse bias in LLM hiring decisions
- [[Tamkin_et_al_2023]] - LLM bias in diverse decision-making scenarios
