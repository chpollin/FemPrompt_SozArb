---
title: "The cultural stereotype and cultural bias of ChatGPT"
authors: ["Hang Yuan", "Zhongyue Che", "Yue Zhang", "Shao Li", "Xianger Yuan", "Liqin Huang", "Xiaomeng Hu", "Kaiping Peng", "Siyang Luo"]
year: 2025
type: journalArticle
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Yuan_2025_The_cultural_stereotype_and_cultural_bias_of.md
---

# The cultural stereotype and cultural bias of ChatGPT

## Kernbefund

ChatGPT 3.5 zeigt signifikante kulturelle Stereotype in 8 von 13 Aufgaben und Vorurteile in Fairness-Aufgaben, während ChatGPT 4.0 Stereotype auf mehr Aufgaben ausweitet, aber in weniger Aufgaben Vorurteile zeigt. Vier Prompt-Strategien reduzieren erfolgreich Stereotype und Bias.

## Forschungsfrage

Inwieweit weist ChatGPT kulturelle Stereotype und Vorurteile auf, und wie können diese durch Prompt-Strategien reduziert werden?

## Methodik

Mixed-Methods: Empirisch mit drei Studien kombiniert. Study 1: Fragebogen-Surveys zu 13 kulturellen Wertedimensionen in 65 Ländern/Regionen. Study 2: Experimentelle Verhaltensaufgaben (13 Entscheidungsszenarien) mit 20 Ländern, ANOVA und Korrelationsanalysen, Representational Similarity Analysis (RSA). Study 3: Quasi-experimentell mit vier Prompt-Strategien (Interventionen) zur Bias-Reduktion.
**Datenbasis:** Study 1: Kulturelle Wertedaten aus 65 Ländern/Regionen (sekundär). Study 2: ChatGPT-Interaktionen mit 20 Ländern, je 10 Wiederholungen pro Task (n=13 Aufgaben × 20 Länder × 10 = mindestens 2.600 Datenpunkte). Study 3: Tests mit vier Prompt-Strategien auf 6 Aufgaben.

## Hauptargumente

- ChatGPT hat durch Trainingsdaten unbewusst kulturelle Werte internalisiert, die zu stereotypen Generalisierungen über Kulturen führen, besonders in Szenarien zur Fairness und Kooperation. Dies gefährdet die Neutralität und faire Interaktion mit Nutzern verschiedener kultureller Hintergründe.
- Kulturelle Stereotype und Vorurteile in ChatGPT sind nicht unabhängig voneinander: Bei ChatGPT 3.5 sind sie unabhängig, bei 4.0 korrelieren sie signifikant miteinander (r=0.77-0.81). Dies deutet auf unterschiedliche Mechanismen der Bias-Entstehung zwischen Modellversionen hin.
- Die vier Prompt-Strategien (Betonung persönlicher Merkmale, Fairness-Betonung, Zukunfts-Szenarien, Szenarien ohne nationale Unterschiede) sind wirksame und praktisch anwendbare Interventionen zur Mitigierung von Bias in menschlicher Interaktion mit ChatGPT, ohne dass Modell-Retraining notwendig ist.

## Kategorie-Evidenz

### AI_Literacies

Das Paper untersucht implizite kulturelle Werte und Bias in KI-Systemen und deren Verstehen durch Nutzende: 'ensure that AI models equally benefit human society, we must fully understand the cultural stereotypes and biases that AI models may exhibit'

### Generative_KI

Fokus auf ChatGPT 3.5 und ChatGPT 4.0 als Large Language Models und deren kulturelle Verhalten: 'ChatGPT 3.5 exhibits apparent cultural stereotypes in most decision-making tasks and shows significant cultural bias in third-party punishment and ultimatum games. However, ChatGPT 4o, while reinforcing stereotypes, showed reduced cultural bias'

### Prompting

Study 3 testet explizit vier Prompt-Strategien: 'we designed various prompt strategies to enable ChatGPT to overlook cultural differences between countries and provide unbiased answers. Our approaches include emphasizing personal traits, emphasizing fairness, creating future-oriented scenarios, and creating scenarios without national differences'

### KI_Sonstige

Verwendung von Representational Similarity Analysis (RSA) aus Neurowissenschaften und Multivariate Pattern Analysis auf KI-Systeme angewendet: 'RSA initially originated in systems neuroscience and is a specialized multivariate pattern analysis method'

### Bias_Ungleichheit

Zentral: Systematische Analyse von algorithmischen Vorurteilen gegenüber verschiedenen Kulturen: 'if ChatGPT shows a different cultural value from the user, it may have controversial answers or offensive suggestions, which will cause user resistance or distrust, or subtly influence users' values and affect their physical and mental health'

### Diversitaet

Untersuchung von Unterschieden zwischen 20 Ländern und kulturellen Gruppen: 'we ask ChatGPT to simulate decision-making across various nationalities' and 'studied in 65 countries/regions' zur Erfassung von Diversität in kulturellen Wertorientierungen

### Fairness

Expliziter Fokus auf algorithmische Fairness und faire Interaktion: 'the neutrality and fairness of interactions, exacerbate misunderstandings, and lead to group conflict or societal divisions'. Multiple Fairness-bezogene Aufgaben (Ultimatum Game, Third-party Punishment, Dictator Task, Public Good Game)

## Assessment-Relevanz

**Domain Fit:** Das Paper ist für die Schnittstelle AI/Soziale Arbeit hochrelevant, da es zeigt, wie generative KI-Systeme in alltäglichen Interaktionen kulturelle Gruppen stereotypisieren und benachteiligen könnten. Dies hat direkte Implikationen für Beratungs-, Case-Management- und unterstützungsbasierte Dienste, die zunehmend KI-Tools einsetzen.

**Unique Contribution:** Das Paper leistet einen innovativen Beitrag durch die multidimensionale Analyse von kulturellen Werten und deren Beziehung zu Stereotypen und Bias in Verhaltensaufgaben (nicht nur Wert-Abfragen), kombiniert mit RSA-Musteranalyse und praktisch umsetzbaren Prompt-Interventionen, die ohne Model-Retraining funktionieren.

**Limitations:** Das Paper konzentriert sich auf anglophone ChatGPT-Interaktionen (alle Tests auf Englisch), was kulturelle Nuancen in anderen Sprachen nicht erfasst; die Generalisierbarkeit auf andere generative Modelle ist unklar; die langfristigen Effekte von Prompt-Strategien in echten Nutzungsszenarien werden nicht getestet.

**Target Group:** KI-Entwickler und -Deployer, Policy-Maker im Bereich Algorithmen-Governance, Sozialarbeiter und Organisationen der Sozialen Arbeit, die ChatGPT oder ähnliche LLMs in der Praxis einsetzen, Fairness/Bias-Forscher, Digital-Rights-Aktivisten und Nutzer von KI-Systemen, die kulturelle Sensibilität schätzen

## Schlüsselreferenzen

- [[Atari_et_al_2023]] - Cultural values in GPT models
- [[Tao_et_al_2024]] - Cultural bias and cultural alignment of large language models
- [[Zewail_et_al_2024]] - Moral stereotyping in large language models
- [[Bender_et_al_2021]] - On the Dangers of Stochastic Parrots
- [[Hofstede_2001]] - Culture's Consequences: Comparing Values, Behaviors, Institutions and Organizations Across Nations
- [[Henrich_et_al_2001]] - Cooperation, Reciprocity and Punishment in Fifteen Small-Scale Societies
- [[Haxby_et_al_2014]] - Decoding Neural Representational Spaces Using Multivariate Pattern Analysis
- [[Ferrara_2023]] - Should ChatGPT be biased? Challenges and risks of bias in large language models
- [[Motoki_et_al_2023]] - More human than human: Measuring ChatGPT political bias
- [[Kleinman_Benson_2006]] - Anthropology in the clinic: The problem of cultural competency and how to fix it
