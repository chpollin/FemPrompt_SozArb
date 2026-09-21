---
type: distillate
source-type: publication
reference: R7V99ERA
record-id: R7V99ERA
work-id: work:365293c9-c8ea-54dd-9f65-2f37976f1a31
version-id: version:5cc8d78c-4578-5a0b-a269-b186f10fe049
version-type: unknown
topics:
  - "[[Artificial Intelligence]]"
  - "[[Social Work]]"
  - "[[Fairness]]"
status: preparation
checked:
  quote: 2026-09-21
created: 2026-09-21
updated: 2026-09-21
prepared-by:
  agent-id: /root/prism_assessment
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: unreviewed
source-representation:
  path: generated/markdown/R7V99ERA.md
  sha256: sha256:9555c30e0bac19f16810d62e566a4a7d6dd51c0e3e40b05b4a82d13fd69dd674
  version-id: version:5cc8d78c-4578-5a0b-a269-b186f10fe049
  version-type: unknown
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound proceedings conversion, including appendices and linearised tables. Figures were available only as captions or image placeholders and were not independently inspected. Source identity review does not constitute review of this distillate.
---

# Distillate: Racial bias risks in child-protective-services NLP

## Core statements

- The study evaluates racial performance disparities for natural-language processing over more than three million administrative contact notes from one county child-protection system. ^s1
- It finds systematic racial differences in word use, significantly lower named-entity-recognition recall for Black clients' names, possible but statistically uncertain coreference disparities, and little evidence that adding text to the studied risk model increased aggregate racial performance disparities. ^s2
- The absence of that aggregate risk-model effect does not make text use benign because notes may encode perception, surveillance and prior decisions, while extraction can remove context and deepen institutional information asymmetries. ^s3

> "For all models, recall is significantly higher for names of white clients than for names of black clients." (bound Version, source text)

> "our results cannot be assumed to generalize to other scenarios without appropriate evaluation." (bound Version, source text)

## Method and scope

The source examines 3,105,071 contact notes written from approximately 2010 to November 2020. It first compares note volume and race-associated word use with log-odds and word embeddings. It then adds text features to a structured out-of-home-placement model using 28,769 training and 14,417 test referral-child observations. Random-forest models compare 818 structured features with a hybrid representation that adds 1,000 selected term-frequency features. Fairness analyses compare performance, calibration and high-risk classification for Black and white children. Information-extraction experiments evaluate four named-entity-recognition systems against client names in county records and neural coreference systems on a small expert-annotated contact-note set.

## Assessment relevance

The paper directly supports `KI_Sonstige`, `Soziale_Arbeit`, `Bias_Ungleichheit` and `Fairness`. It evaluates machine-learning and NLP systems in child protective services with explicit racial fairness questions and sociotechnical consequences. Its brief discussion of generative models is prospective and does not constitute a generative-AI study. It does not study prompting, gender or feminist methods.

## Limitations

Race is recorded as perceived by workers, and the main comparisons reduce the data to Black-majority and white-majority families. Results come from one anonymous county and specific model and annotation choices. The coreference test set is small and most differences are not statistically significant. Names already present in structured records are an imperfect proxy for information-extraction utility. The authors evaluate algorithmic fairness as one risk and explicitly do not claim it captures privacy, contestability, surveillance, institutional power or data-quality harms. Figures were not independently inspected during preparation.

## Review boundary

This preparation is source-bound and unreviewed. It grants no separate AI source-review, human verification, scientific acceptance or publication authority.
