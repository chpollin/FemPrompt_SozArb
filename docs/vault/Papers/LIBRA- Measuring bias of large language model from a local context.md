---
title: LIBRA: Measuring bias of large language model from a local context
authors:
  - B. Pan
  - H. Liu
  - Y. Hou
  - M. Yang
year: 2025
type: report
url: https://www.researchgate.net/publication/388686547_LIBRA_Measuring_Bias_of_Large_Language_Model_from_a_Local_Context
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Stereotype
  - Stereotyping
  - Stereotypical
---

# LIBRA: Measuring bias of large language model from a local context

## Abstract

Critiques the U.S.-centricity of existing LLM bias evaluation methods. Proposes the Local Integrated Bias Recognition and Assessment (LIBRA) framework and develops dataset of over 360,000 test cases specific to New Zealand context. Results show models like BERT and GPT-2 struggle with local context, while Llama-3 responds better to different cultural contexts despite exhibiting larger bias overall.

## Key Concepts

### Bias Types
- [[Stereotype]]
- [[Stereotypical]]
- [[Stereotyping]]

## Full Text

---
title: "LIBRA: Measuring Bias of Large Language Model from a Local Context"
authors: ["Bo Pang", "Tingrui Qiao", "Caroline Walker", "Chris Cunningham", "Yun Sing Koh"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Pan_2025_LIBRA_Measuring_bias_of_large_language_model_from.md
confidence: 91
---

# LIBRA: Measuring Bias of Large Language Model from a Local Context

## Kernbefund

Lokale Wörter (besonders Te Reo Māori) liegen außerhalb der Wissensgrenzen der meisten LLMs; Llama-3 zeigt besseres Verständnis für kulturelle Kontexte, aber alle getesteten Modelle zeigen erhebliche Bias - insbesondere gilt: linguistisch kompetentere Modelle sind stärker verzerrt.

## Forschungsfrage

Wie können lokale Biases in Large Language Models effektiv gemessen werden, indem kulturspezifische Korpora genutzt werden und gleichzeitig die Herausforderungen durch Wörter außerhalb der Wissensgrenzen der Modelle adressiert werden?

## Methodik

Empirisch-Mixed: Framework-Entwicklung (LIBRA) mit automatisierter Datensatzkonstruktion aus lokalen Korpora (367.384 neuseeländische Nachrichtenartikel und Transkripte), Keyword-Augmentation mittels LLM2Vec und Association Rule Learning, Fuzzy Clustering, Evaluationen mit Jensen-Shannon Divergence und neuer EiCAT-Metrik, Evaluationen an BERT, GPT-2, Llama-3 Modellen.
**Datenbasis:** 167.712 Sätze und Tripel-Testfälle aus 367.384 Nachrichtenartikel und Transkripten aus neuseeländischen lokalen Medien; 8 Zielgruppen (Alter 73,43%, Geschlecht 10,78%, Rasse/Ethnizität 10,65%, sexuelle Orientierung 2,94%, physisches Erscheinungsbild 0,96%, Behinderung 0,78%, Nationalität 0,02%, Religion 0,45%); Validierung auch mit 'Our Voices' Dataset und Malaysia-Kontext

## Hauptargumente

- Bestehende LLM-Bias-Forschung fokussiert zu stark auf US-amerikanische kulturelle Kontexte und ignoriert lokale, regionale Stereotype in anderen Kulturen, was zu unfairen Entwicklungs- und Einsatzpraktiken führt.
- Wörter außerhalb der Wissensgrenzen von LLMs (wie Te Reo Māori Begriffe) erzeugen halluzinatorische und selbstsichere Ausgaben, die nicht auf echtem Bias beruhen sondern auf Wissenslücken; diese müssen bei der Bias-Messung separat identifiziert und gewichtet werden.
- Ein Framework zur automatisierten Datensatzkonstruktion aus lokalen Korpora ohne Crowdsourcing ermöglicht es Forschern weltweit, kulturspezifische Bias-Tests effizient zu entwickeln und dabei grammatikalische Diversität und syntaktische Variation zu bewahren.

## Kategorie-Evidenz

### Evidenz 1

Das Paper adressiert die Notwendigkeit von Verständnis über LLM-Biases und deren Auswirkungen auf diverse Kulturen: 'LLMs have become a cornerstone in natural language processing (NLP) applications' und 'Developing methodologies to detect local biases in region-specific contexts accurately is essential, ensuring that LLMs are evaluated and improved with a sensitivity to cultural diversity.'

### Evidenz 2

Fokus auf Large Language Models (BERT, GPT-2, Llama-3): 'This research addresses these limitations with a Local Integrated Bias Recognition and Assessment Framework (LIBRA) for measuring bias using datasets sourced from local corpora without crowdsourcing.'

### Evidenz 3

Verwendung von NLP-Techniken (Named Entity Recognition, Clustering, Text Encoding mit LLM2Vec, Association Rule Learning, Jensen-Shannon Divergence Analyse): 'For privacy, we perform Named Entity Recognition (NER)' und 'We then measure bias between these distributions using the Jensen-Shannon Divergence, JSD(Da||Ds).'

### Evidenz 4

Fokus auf marginalisierte Communities und historisch benachteiligte Gruppen in Neuseeland: 'Māori and Pacific Peoples have historically faced poor socio-economic outcomes stemming from colonization and cultural marginalization' und Fokus auf faire Technologien für diverse Populationen.

### Evidenz 5

Zentrale Fokus auf algorithmischen Bias, Stereotype in LLMs und strukturelle Ungleichheiten: 'Bias in LLMs is typically influenced by the data they are trained on, which consists of internet-sourced corpora reflecting the dominant cultural stereotypes from all over the world. When used in diverse cultural settings, this leads to unfair and potentially harmful outcomes.'

### Evidenz 6

Expliziter Fokus auf kulturelle Diversität, lokale Kontexte und unterrepräsentierte Sprachen: 'The use of LLMs in diverse cultural settings, this leads to unfair and potentially harmful outcomes' und Konzentration auf Te Reo Māori und kulturelle Besonderheiten: 'It addresses the significant presence of Te Reo Māori borrow-words in the NZ English corpora and whose limited presence in LLM training data often poses challenges.'

### Evidenz 7

Framework zur Messung und Verbesserung der Fairness von LLMs durch neue Metriken (EiCAT) und beyond knowledge boundary scoring: 'The Enhanced Idealized CAT Score (EiCAT), which incorporates measures of bias, language model capacity and knowledge boundaries, is as follows' und 'ensure that LLMs are evaluated and improved with a sensitivity to cultural diversity.'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochgradig relevant für die Schnittstelle KI und Soziale Arbeit: Es adressiert systematisch die Verzerrungen in LLMs gegenüber marginalisierten Communities (Māori, Pacific Peoples, unterrepräsentierte kulturelle Gruppen) und zeigt, wie diese Biases harm für vulnerable Populationen bedeuten können. Die Fokussierung auf lokale Kontexte und kulturelle Sensibilität sind zentral für ethisch verantwortungsvolle Soziale Arbeit in multikulturellen Gesellschaften.

**Unique Contribution:** Die Innovation liegt in der Kombination aus (1) automatisierter Datensatzkonstruktion aus lokalen Korpora ohne Crowdsourcing, (2) expliziter Behandlung von Wissensgrenzen-Problemen bei lokalen Wörtern durch Beyond Boundary Score, und (3) neuer EiCAT-Metrik, die Bias und kulturelle Verständnis simultan misst - damit wird erstmals ein skalierbares Framework für regionale Bias-Evaluation außerhalb des US-Kontexts bereitgestellt.

**Limitations:** Das Paper konzentriert sich auf englischsprachige Kontexte mit begrenzt lokalisierten Tests (Neuseeland, Malaysia, Our Voices); die Verallgemeinerbarkeit auf stark nicht-englische Sprachkontexte oder visuelle/multimodale Biases ist unklar; auch die Annotation durch 'local cultural experts' ist nicht detailliert dokumentiert, was Replikierbarkeit gefährdet.

**Target Group:** KI-Entwickler und Forscher im NLP-Bereich; Policymaker für KI-Regulierung in multikulturellen Gesellschaften; Sozialarbeiter und Organisationen, die mit marginalisierten Communities arbeiten und LLM-basierte Systeme evaluieren müssen; Wissenschaftler in Gender Studies und Critical Data Studies mit Interesse an algorithmischer Gerechtigkeit; internationale Institutionen zur KI-Governance und Bias-Mitigation

## Schlüsselreferenzen

- [[Nadeem_M_Bethke_A_Reddy_S_2021]] - StereoSet: Measuring stereotypical bias in pretrained language models
- [[Caliskan_A_Bryson_JJ_Narayanan_A_2017]] - Semantics derived automatically from language corpora contain human-like biases
- [[Nangia_N_Vania_C_Bhalerao_R_Bowman_SR_2020]] - CrowS-Pairs: A Challenge Dataset for Measuring Social Biases in Masked Language Models
- [[May_C_Wang_A_Bordia_S_Bowman_SR_Rudinger_R_2019]] - On measuring social biases in sentence encoders
- [[Li_Y_Du_M_Song_R_Wang_X_Wang_Y_2023]] - A survey on fairness in large language models
- [[Gallegos_IO_Rossi_RA_Barrow_J_Tanjim_MM_Kim_S_Dernoncourt_F_Yu_T_Zhang_R_Ahmed_NK_2024]] - Bias and Fairness in Large Language Models: A Survey
- [[Yogarajan_V_Dobbie_G_Keegan_TT_Neuwirth_RJ_2023]] - Tackling bias in pretrained language models: Current trends and under-represented societies
- [[Radford_A_Wu_J_Child_R_Luan_D_Amodei_D_Sutskever_I_2019]] - Language models are unsupervised multitask learners
