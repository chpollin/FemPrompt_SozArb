---
type: distillate
source-type: publication
reference: FR8Z2998
record-id: FR8Z2998
work-id: work:0acf6fa2-7f5e-53c4-a1d1-30ab1ae8d310
version-id: version:8bffb8fc-6a26-5e82-a77f-1a0f5c8b7794
version-type: version_of_record
topics:
- '[[Generative AI]]'
status: ai-agent-reviewed
checked:
  quote: 2026-09-21
  validation: '2026-09-21'
  ai-agent-review: '2026-09-21'
created: 2026-09-21
updated: '2026-09-21'
prepared-by:
  agent-id: /root/knowledge_documents
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: ai-agent-reviewed
source-representation:
  path: generated/source-acquisition/codex-websearch-2026/markdown-clean/aff73b4c6b2eab31b8f7.md
  sha256: sha256:401ad82df917c2ba9ae1e22a0cb706c9f2b6460e3c82f1d8a6a8cf1333988239
  version-id: version:8bffb8fc-6a26-5e82-a77f-1a0f5c8b7794
  version-type: version_of_record
  source-url: https://www.jmir.org/2026/1/e85770
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound Markdown source representation and checked the quoted passages. No separate AI source review or domain-expert verification has occurred.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/FR8Z2998-r2.json
  sha256: sha256:fbcf632c19792d4c2362f09852b43666a3c91cdf9d736acb159c9d2c9bddc1d1
---

# Distillate: Patient Cognitive Bias in Large Language Model-Supported Health Consultations: Simulation-Based Comparative Study

The simulation study compares six language models in standard and cognitively biased patient consultations across medical cases. Biased framing reduces diagnostic accuracy and redirects errors toward patients’ preferred explanations.

## Core statements

- The simulation study compares six language models in standard and cognitively biased patient consultations across medical cases. Biased framing reduces diagnostic accuracy and redirects errors toward patients’ preferred explanations. ^s1
  > "patient-driven cognitive bias as a behavioral  risk  that  compromises  the  reliability  of  LLMs in health consultations." (10.2196/85770)

- The authors limit their conclusion to the evaluated evidence and call for further safety or outcome research. ^s2
  > "biased  user  input  led  to  substantial  degradation  in  diagnostic accuracy" (10.2196/85770)

## Research question and method

The simulation study asks how patient cognitive bias changes language-model diagnoses and whether prompts, decoding temperature or a dual-system design mitigate the effect. Six models conduct three-round consultations across 1,273 medical examination cases in unbiased and biased conditions.

## Main findings

Biased patient framing reduced diagnostic accuracy and aligned errors with preferred but incorrect diagnoses. Prompt and temperature changes offered limited protection, while separating conversation from reasoning with a dedicated reasoning model restored much of the lost benchmark performance.

## Assessment relevance

`Generative_KI` and `Prompting` are central through interactive diagnosis and the tested prompt strategies. The study examines patient cognitive framing and diagnostic reliability rather than demographic or structural inequality, so `Bias_Ungleichheit` is not established. It does not evaluate algorithmic-fairness metrics, fair-machine-learning systems or demographic debiasing, so `Fairness` is not established. Social work is absent.

## Limitations

Simulated patients and examination cases do not reproduce clinical care. Results depend on the selected models, generated dialogues and preferred-diagnosis manipulation, and the dual-system result does not establish deployment safety.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
