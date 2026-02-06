---
title: "PreciseDebias: An Automatic Prompt Engineering Approach for Generative AI to Mitigate Image Demographic Biases"
authors: ["Colton Clemmer", "Junhua Ding", "Yunhe Feng"]
year: 2024
type: conferencePaper
language: en
categories:
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Clemmer_2024_PreciseDebias_An_automatic_prompt_engineering.md
confidence: 95
---

# PreciseDebias: An Automatic Prompt Engineering Approach for Generative AI to Mitigate Image Demographic Biases

## Kernbefund

PreciseDebias erreicht eine 97,6%ige Erfolgsquote bei der Generierung ethnisch diverser Bilder und 99,9% bei geschlechtsspezifischen Bildern durch proportionale Lernraten-Anpassung basierend auf gemessenen Bias-Differenzen.

## Forschungsfrage

Wie können generative KI-Modelle durch automatisiertes Prompt-Engineering dazu befähigt werden, Bilder mit gewünschten demografischen Verteilungen zu generieren und damit demografische Verzerrungen zu reduzieren?

## Methodik

Empirisch/Mixed: Entwicklung eines End-to-End-Frameworks mit Fine-Tuning von Large Language Models (LLaMA-7B mit LoRA), Bias-Messung durch statistische Analyse, manuelle Annotation von 4487 generierten Bildern, Vergleich mit Baseline-Methoden (Regular Expression, NER).
**Datenbasis:** 560 synthetisch generierte Trainingsprompts (via GPT-3); Validierung mit 4487 generierten Bildern (45 Bilder pro Prompt über 9 Durchläufe); manuelle Annotation demografischer Attribute

## Hauptargumente

- Existierende Lösungen wie Re-Ranking-Algorithmen können nur bestehende Bilder umsortieren, nicht neue diversere Bilder generieren; PreciseDebias erzeugt hingegen neue, qualitativ hochwertige Daten direkt, ohne existierende Datenquellen zu degradieren.
- Rule-basierte Prompt-Augmentierung (Regular Expressions) scheitert bei kontextuellen Mehrdeutigkeiten (z.B. 'white truck' als Farbterm vs. Ethniedeskriptor) und kann ethnische Deskriptoren falsch erkennen; Large Language Models verstehen dagegen Kontext und statistische Wahrscheinlichkeit durch Attention-Mechanismen.
- Ein iterativer Bias-Mess- und Proportional-Training-Ansatz mit angepassten Lernraten für unterrepräsentierte demografische Gruppen ermöglicht präzise Kontrolle über Ausgabe-Demografien, ohne dass negative Bias-Werte für überrepräsentierte Gruppen direkt optimiert werden müssen.

## Kategorie-Evidenz

### Generative_KI

Das Paper fokussiert explizit auf generative KI-Modelle: 'By leveraging fine-tuned Large Language Models (LLMs) coupled with text-to-image generative models' und verwendet Stable Diffusion und LLaMA-7B als Kernkomponenten.

### Prompting

Automatisches Prompt-Engineering ist der zentrale Beitrag: 'we propose PreciseDebias, a comprehensive end-to-end framework that can rectify demographic bias in image generation. By leveraging fine-tuned Large Language Models (LLMs) coupled with text-to-image generative models, PreciseDebias transforms generic text prompts to produce images in line with specified demographic distributions.'

### KI_Sonstige

Computer Vision und NLP-Techniken werden integriert, z.B. Named Entity Recognition (NER) als Baseline-Vergleich und Stable Diffusion als Text-zu-Bild-Generator.

### Bias_Ungleichheit

Das Paper adressiert explizit demografische Verzerrungen in KI-Systemen: 'Recent years have witnessed growing concerns over demographic biases in image-centric applications' und zeigt, dass DALL-E einen Male-to-Female-Ratio von 2.35 für 'doctor' generiert, der vom realen Ratio von 1.78 abweicht.

### Gender

Geschlecht ist eine der zwei Hauptdimensionen der Bias-Analyse: 'Extensive experiments demonstrate the effectiveness of PreciseDebias in rectifying biases pertaining to both ethnicity and gender in images.' Mit Erfolgsquoten von 99,9% für Gender-spezifische Bilderzeugung.

### Diversitaet

Diversität von Repräsentationen ist das Kernziel: 'The advent of generative AI offers a pathway to mitigate these biases by producing underrepresented images' und das Paper zeigt Generalisierung 'across multiple professions and demographic attributes'.

### Fairness

Fairness-Metriken und -Ziele sind zentral: Das Papier verwendet statistische Fairness-Metriken (Demographic Parity durch kontrollierte Ratios) mit der Formel Δc = Gc - P(c|M), um 'specified demographic distributions' zu erreichen.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, adressiert aber kritische fairness-bezogene Herausforderungen bei generativen KI-Systemen, die zunehmend in sozialen Kontexten (z.B. bei Rekrutierung, Bildung, Informationszugang) eingesetzt werden. Die Bias-Mitigation in visuellen KI-Systemen berührt Fragen sozialer Gerechtigkeit und Repräsentation.

**Unique Contribution:** PreciseDebias bietet einen neuartigen End-to-End-Ansatz zur präzisen Kontrolle demografischer Ausgaben generativer KI durch iteratives Bias-Messen und proportionale Lernraten-Anpassung ohne Retraining des Basismodells—ein technisch innovativer Post-Processing-Ansatz mit 97,6%iger Erfolgsquote.

**Limitations:** Das Paper kategorisiert demografische Dimensionen (Ethnizität, Geschlecht) in vordefinierten binären/kategorialen Schemata (männlich/weiblich, vier Ethnizitäten); es werden nur englischsprachige Prompts und zwei Basismodelle (LLaMA, Stable Diffusion) getestet; manuelle Annotation demografischer Merkmale in Bildern ist fehleranfällig und nicht skalierbar; intersektionale Effekte werden nicht adressiert.

**Target Group:** KI-Entwickler und ML-Engineers, die generative Systeme bauen; Fairness/AI-Ethics-Forscher; Plattformen für Bildersuche und -generierung; Policy-Maker im Bereich AI-Regulierung und Fairness; weniger direkt relevant für sozialarbeiterische Praktiker, aber indirekt für die Gestaltung von KI-Systemen, die in sozialen Diensten eingesetzt werden.

## Schlüsselreferenzen

- [[Bianchi_et_al_2023]] - Easily accessible text-to-image generation amplifies demographic stereotypes at large scale
- [[Cornell_Data_Science_Team_2022]] - Demographic bias analysis in DALL-E text-to-image generation
- [[Feng_Shah_2022]] - Has CEO gender bias really been fixed? Adversarial attacking and improving gender fairness in image search
- [[Bansal_et_al_2022]] - How well can text-to-image generative models understand ethical natural language interventions?
- [[Taori_et_al_2023]] - Stanford Alpaca: Instruction-following LLaMA model
- [[Touvron_et_al_2023]] - LLaMA: Open and efficient foundation language models
- [[Rombach_et_al_2022]] - High-resolution image synthesis with latent diffusion models (Stable Diffusion)
- [[Hu_et_al_2021]] - LoRA: Low-Rank Adaptation of Large Language Models
- [[Brown_et_al_2020]] - Language models are few-shot learners (GPT-3)
- [[Vaswani_et_al_2017]] - Attention is all you need (Transformer architecture)
