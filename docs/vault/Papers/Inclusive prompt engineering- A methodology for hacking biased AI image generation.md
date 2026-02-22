---
title: Inclusive prompt engineering: A methodology for hacking biased AI image generation
authors:
  - R. Skilton
  - A. Cardinal
year: 2024
type: conferencePaper
url: https://www.researchgate.net/publication/385325948_Inclusive_Prompt_Engineering_A_Methodology_for_Hacking_Biased_AI_Image_Generation
doi: 10.1145/3641237.3691655
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Stereotypen
  - Stereotype
  - Stereotyping
mitigation_strategies:
  - Prompt Engineering
  - Debiasing
  - Inclusive Result
  - Inclusive Prompt
---

# Inclusive prompt engineering: A methodology for hacking biased AI image generation

## Abstract

This conference paper introduces "inclusive prompt engineering" as a strategy to probe and mitigate biases in generative AI image systems. Authors developed methodology to systematically modify prompts and provide tools for generating more diverse outputs. User studies revealed that when participants encountered stereotypical outputs, they tried adding negative qualifiers but models often failed to obey these negations. Findings underscore need for improved prompt interfaces that actively promote inclusive representation.

## Key Concepts

### Bias Types
- [[Stereotype]]
- [[Stereotypen]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Debiasing]]
- [[Inclusive Prompt]]
- [[Inclusive Result]]
- [[Prompt Engineering]]

## Full Text

---
title: "Inclusive Prompt Engineering: A Methodology for Hacking Biased AI Image Generation"
authors: ["Rachel Skilton", "Alison Cardinal"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Skilton_2024_Inclusive_prompt_engineering_A_methodology_for.md
confidence: 93
---

# Inclusive Prompt Engineering: A Methodology for Hacking Biased AI Image Generation

## Kernbefund

DALL-E betreibt sogenannte 'Toxic Positivity', die durch Content-Filter verursacht wird und dazu führt, dass der KI-Generator bei der Darstellung menschlicher Subjekte standardmäßig zu jungen, dünnen, schönen und weißen Menschen greift. Durch iteratives Prompt Engineering mit positiver Umformulierung von sensiblen Begriffen können Nutzer diese Verzerrungen umgehen und vielfältigere Darstellungen erhalten.

## Forschungsfrage

Wie können Content Designer und technische Kommunikatoren strategisch Prompt Engineering einsetzen, um verzerrte KI-Bildgeneratoren zu umgehen und vielfältige, inklusive visuelle Darstellungen zu erzeugen?

## Methodik

Mixed Methods: Empirisch (systematische Experimente mit DALL-E durch iterative Prompt-Manipulation) kombiniert mit theoretischer Analyse der zugrundeliegenden Bias-Mechanismen; Zero-Shot Prompting zur Identifikation von Basis-Bias-Mustern.
**Datenbasis:** Qualitativ: Umfangreiche Experimente mit DALL-E Image Generator; systematische Analyse von generierten Prompts und visuellen Outputs; Case Studies zu Begriffen wie 'low income', Alter und Körpermerkmalen.

## Hauptargumente

- Content-Moderations-Filter in KI-Bildgeneratoren führen unbeabsichtigt zu rassistischen und ageistischen Outputs, indem sie vermeintlich negative Begriffe wie 'arm', 'alt' oder 'übergewichtig' mit negativen Konnotationen verbinden und dadurch Stereotypen verstärken, anstatt sie zu bekämpfen.
- Durch systematisches Prompt Engineering, insbesondere durch positive Umformulierung sensibler Begriffe und iterative Anpassung basierend auf dem von der KI zurückgegebenen Prompt, können Designer die toxische Positivität umgehen und authentische Repräsentationen menschlicher Vielfalt erzeugen.
- Technische und professionelle Kommunikation als Disziplin hat die Verantwortung und Expertise, Praktiker und Lernende in der kritischen Analyse und ethischen Nutzung von emergenten KI-Technologien zu schulen, um strukturelle Ungleichheiten zu adressieren.

## Kategorie-Evidenz

### Evidenz 1

As a field that has historically addressed the social impact of visual content and has provided strategies for analyzing user interfaces, the field [of technical and professional communication] is poised to provide guidance to practitioners and scholars alike on how to analyze and use these technology tools. [...] we offer a methodology [...] for content designers and students for how to use them.

### Evidenz 2

With the emergent and rapidly expanding use cases of images created with AI image generators such as Midjourney, DALL-E, and Adobe Firefly [...] Through a series of prompt engineering practices, we show how users can bypass this toxic positivity to create images that better demonstrate the diversity of humanity.

### Evidenz 3

Through what we call 'toxic positivity,' DALL-E attempts to avoid negative stereotypes by defaulting to the 'least offensive' images. [...] Through a series of prompt engineering practices [...] we alter sections that misrepresent the subject. Through continued refining, we arrive at an image more aligned with our intended inclusive result.

### Evidenz 4

AI image generators are known to create biased images [...] often defaulting to generating white men when asked to create images of humans without explicit direction. [...] what is considered an offensive stereotype is not clearly stated by the system in the list of restricted content. [...] the output is worse than intended. DALL-E's model reinforces the idea that disability, especially as it shows up in a person's body or physical appearance, is inherently negative.

### Evidenz 5

Our goal in this method is to help designers and technical communicators produce visuals that accurately reflect the diverse range of human experiences, including variations in age, body type, ethnicity, and gender. [...] we aim to counteract overly 'positive' and limited representations of humanity in AI-generated images.

### Evidenz 6

The intention of the user ultimately dictates how the program is used regardless of safeguards put in place. [...] By intentionally crafting prompts, we aim to counteract overly 'positive' and limited representations of humanity in AI-generated images.

## Assessment-Relevanz

**Domain Fit:** Das Paper adressiert die Schnittstelle zwischen KI-Literacies, Generative KI und Fragen sozialer Gerechtigkeit, insbesondere Bias und Diversität. Allerdings hat es keinen direkten Bezug zu Sozialer Arbeit als Praxis oder deren spezifischen Zielgruppen, sondern fokussiert auf Technical and Professional Communication und Content Design.

**Unique Contribution:** Das Paper leistet einen innovativen praktischen Beitrag durch die Entwicklung einer systematischen Methodology (Inclusive Prompt Engineering), die Praktiker befähigt, strukturelle Bias in generativen KI-Systemen zu erkennen und durch iteratives Prompting zu umgehen, statt nur die Probleme zu beschreiben.

**Limitations:** Die Forschung ist auf DALL-E beschränkt; es werden keine quantitativen Messungen der Bias-Reduktion durchgeführt; die Skalierbarkeit der Methode auf andere KI-Systeme oder Domänen wird nicht systematisch überprüft; keine Evaluation durch Nutzer aus marginalisierten Gruppen.

**Target Group:** Content Designer, Technical und Professional Communicators, Hochschul-Lehrende in Design- und Kommunikationsprogrammen, Praktiker in Marketing und UX, sowie KI-Nutzer, die sich ethischer und inklusiver Bildgenerierung verpflichtet sehen; potenziell auch Policy-Maker und KI-Entwickler bei OpenAI und ähnlichen Unternehmen.

## Schlüsselreferenzen

- [[Walton_Moore_and_Jones_2019]] - Technical Communication After the Social Justice Turn: Building Coalitions for Action
- [[Benjamin_Ruha_2019]] - Race after technology: Abolitionist tools for the new Jim code
- [[WachterBoettcher_Safiya_2017]] - Technically wrong: Sexist apps, biased algorithms, and other threats of toxic tech
- [[Bolukbasi_et_al_2016]] - Man is to computer programmer as woman is to homemaker?: Debiasing word embeddings
- [[Bailey_AH_et_al_2022]] - Based on billions of words on the internet, people = men
- [[Haas_Angela_M_2012]] - Race, rhetoric, and technology: A case study of decolonial technical communication theory, methodology, and pedagogy
- [[Jones_NN_and_Williams_MF_2018]] - Technologies of disenfranchisement: Literacy tests and black voters in the US from 1890 to 1965
- [[Goodman_Wendy_2022]] - Toxic Positivity: Keeping it real in a world obsessed with being happy
