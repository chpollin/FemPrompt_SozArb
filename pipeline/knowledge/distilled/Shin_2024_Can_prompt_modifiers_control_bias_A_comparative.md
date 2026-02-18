---
title: "Can Prompt Modifiers Control Bias? A Comparative Analysis of Text-to-Image Generative Models"
authors: ["Philip Wootaek Shin", "Jihyun Janice Ahn", "Wenpeng Yin", "Vijaykrishnan Narayanan", "Jack Sampson"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Shin_2024_Can_prompt_modifiers_control_bias_A_comparative.md
confidence: 91
---

# Can Prompt Modifiers Control Bias? A Comparative Analysis of Text-to-Image Generative Models

## Kernbefund

Prompt-Modifizierer können Verzerrungen teilweise reduzieren, zeigen aber inkonsistente Ergebnisse. Prompt-Sequenzierung hat signifikante Auswirkungen, und mehrere Verzerrungen sind resistent gegen einfache Modifier-basierte Interventionen.

## Forschungsfrage

Können Prompt-Modifizierer systematisch verwendet werden, um Verzerrungen in Text-zu-Bild-Generierungsmodellen zu kontrollieren und zu reduzieren?

## Methodik

Empirisch - Vergleichende Analyse mit systematischer Prompt-Engineering-Methodik, Qualitative Bildanalyse durch Authorenevaluation (n=3 Modelle, 50-80 Bilder pro Basis-Prompt-Modifier-Paar), Quantitative Analyse mittels Varianzberechnung und Standard-Abweichung
**Datenbasis:** Empirische Analyse von Stable Diffusion, DALL·E 3 und Adobe Firefly mit 16 Basis-Prompts (Monk, Nurse, Housekeeper, Politician etc.) und Modifier-Kombinationen; insgesamt 50-80 generierte Bilder pro Prompt-Konfiguration

## Hauptargumente

- Generative KI-Modelle erben und verstärken gesellschaftliche Verzerrungen systematisch, wie am Beispiel des 'Monk'-Prompts gezeigt: Stable Diffusion und DALL·E produzieren überwiegend asiatische männliche Mönche, während Adobe Firefly ausgewogenere Repräsentationen zeigt.
- Prompt-Modifizierer als Bias-Kontrollmechanismus funktionieren fragmentarisch und sind oft fragil: Die Reihenfolge von Basis-Prompt und Modifier (z.B. 'Asian US Politician' vs. 'US Politician Asian') beeinflusst Ergebnisse unterschiedlich stark je nach Modell.
- Eine differenzierte Taxonomie zur Klassifizierung von Bias-Sensitivität ist notwendig: Die Studie kategorisiert Szenarien als 'Change of Distribution Yes/No' und 'Order Matters Yes/No' und zeigt, dass robuste Bias-Kontrolle komplexere Strategien erfordert als einfaches Prompt-Engineering.

## Kategorie-Evidenz

### Evidenz 1

Das Paper zielt auf die Kompetenzentwicklung zur kritischen Reflexion von KI ab: 'This study aims to deepen the understanding of bias in AI. Through comparative analysis, we illuminate each model's specific biases and underscore the role of prompt engineering in bias reduction.'

### Evidenz 2

Expliziter Fokus auf Text-zu-Bild-Generierungsmodelle: 'This study examines the presence and manipulation of societal biases in leading text-to-image models: Stable Diffusion, DALL·E 3, and Adobe Firefly.'

### Evidenz 3

Systematische Analyse von Prompt-Engineering als Interventionsmittel: 'Prompt Modifiers as a Tool for Bias Adjustment: We introduce the use of prompt modifiers as a means of adjusting bias within image generation models... [and] Impact of Prompt Sequencing on Bias Control.'

### Evidenz 4

Zentral thematisiert sind Diskriminierung und algorithmischer Bias: 'It has been shown that many generative models inherit and amplify societal biases... uncovering the nuanced ways these AI technologies encode biases across gender, race, geography, and region/culture.'

### Evidenz 5

Explizite Gender-Bias-Analyse: 'A preliminary analysis of image outputs for a generic 'monk' prompt... unveils a marked inclination towards representing monks as Asian males' und Tabellen zeigen durchgehend Gender-Verteilungen (Male/Female Ratios).

### Evidenz 6

Thematisierung von Repräsentation marginalisierter Gruppen: 'our analysis spanning gender, race, geography, and religion/culture biases... aims to enrich the discourse on AI ethics and creativity with respect to... fostering a more equitable trajectory for AI innovation.'

### Evidenz 7

Explizite Fairness-Fragestellung: 'Should they aim to accurately mirror historical and sociodemographic realities, or aspire towards an idealized inclusivity... This underscores the imperative for strategic bias mitigation to foster a more equitable trajectory.'  und Quantitative Fairness-Metriken: 'utilizing our dataset, we calculated variances for each category and then computed an average variance across 16 base prompts... determining the average standard deviation for these prompts.'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI-Ethik und soziale Implikationen, hat aber keinen direkten Bezug zu Sozialer Arbeit als Praxisfeld. Seine Analyse von Repräsentationsverzerrungen und Fairness-Mechanismen ist jedoch zentral für KI-Literacy und für die Ausbildung von Fachkräften, die mit KI-Systemen interagieren.

**Unique Contribution:** Die Studie bietet eine systematische komparative Analyse von Prompt-Sequenzierungseffekten und entwickelt eine neuartige Taxonomie zur Klassifizierung von Bias-Kontrollierbarkeit, die über bisherige Studien hinausgeht, die hauptsächlich Bias-Präsenz untersuchen, nicht aber deren Manipulierbarkeit.

**Limitations:** Methodische Limitation: Kleine Stichproben (50-80 Bilder pro Scenario), nur Author-Evaluationen ohne externe Human-Studies durchgeführt, problematische DALL·E API-Nutzung über ChatGPT-Interface statt direkter Zugang; thematisch limitiert auf vier Bias-Kategorien und drei Modelle.

**Target Group:** KI-Entwickler, AI-Ethik-Forscher, KI-Literacy-Pädagogen, Content-Creator die generative Modelle nutzen, Policy-Maker im Bereich KI-Regulierung, Plattform-Designer von Text-zu-Bild-Tools

## Schlüsselreferenzen

- [[Cho_et_al_2023]] - DALL-Eval: A diagnostic framework for evaluating gender and skin tone biases in text-to-image generation models
- [[Seshadri_et_al_nicht angegeben]] - Gender-occupation bias amplification in Stable Diffusion
- [[Struppek_et_al_nicht angegeben]] - Homoglyph unlearning and cultural bias mitigation
- [[Friedrich_et_al_nicht angegeben]] - Fair Diffusion: Fairness in Text-to-Image Generation
- [[Naik_et_al_nicht angegeben]] - Bias evaluation across DALL·E 2 and Stable Diffusion
- [[Dong_et_al_nicht angegeben]] - Gender biases in Large Language Models
- [[Yeh_et_al_nicht angegeben]] - Gender and cultural bias in LLMs
