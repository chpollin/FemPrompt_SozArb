---
type: distillate
source-type: publication
reference: A7U389P5
record-id: A7U389P5
work-id: work:e2d886f7-c01f-50cc-9ce2-e65f7be00157
version-id: version:6d97fb15-5ef8-5e1e-8ad1-2303d8edfc28
version-type: version_of_record
topics:
- '[[Artificial Intelligence]]'
- '[[Fairness]]'
status: ai-agent-reviewed
checked:
  quote: 2026-09-21
  validation: '2026-09-21'
  ai-agent-review: '2026-09-21'
created: 2026-09-21
updated: '2026-09-21'
prepared-by:
  agent-id: /root/prism_assessment
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: ai-agent-reviewed
revised-by:
  agent-id: /root/knowledge_completion
  model: gpt-5.6-sol
  revised-at: 2026-09-21
  basis: generated/knowledge-completion-20260921/reviews/A7U389P5.json
source-representation:
  path: generated/source-acquisition/codex-websearch-2026/markdown-clean/136b6db72d8a7b8d390c.md
  sha256: sha256:e7ddd2f304de117bc74a28cf164a7793a53d9b956a484ae11d07a845efed57da
  version-id: version:6d97fb15-5ef8-5e1e-8ad1-2303d8edfc28
  version-type: version_of_record
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound local text. Linearised tables were available; figures were not independently inspected. Source identity review does not constitute review of this distillate.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/A7U389P5-authority.json
  sha256: sha256:c32d5ec154751846fa683bcff629817a88398d6d52248e9402b711cc88f6e28b
---

# Distillate: Prompt engineering for medical bias mitigation

## Core statements

- Fair prompting produced heterogeneous results across models and demographic attributes, and no strategy reduced the measured accuracy gaps in every tested scenario. ^s1
  > "bias mitigation through fair prompting is strongly model-dependent, with no strategy proving universally and significantly effective." (bound Version, Finding 1)
- Chain-of-thought prompting produced the largest overall reduction in the tested accuracy gaps, with the clearest benefits for Qwen-3 and DeepSeek-V3.1, while some model-attribute cases became less fair. ^s2
  > "chain-ofthought achieves the most cases of significant reductions (8/15), particularly for Qwen-3 and DeepSeek-V3.1." (bound Version, Finding 1)
- In the reported benchmark, fairness gains generally arose through improved accuracy for unprivileged groups while privileged-group accuracy remained stable. ^s3
  > "Fairness improvements thus stem primarily from lifting unprivileged groups rather than penalizing others." (bound Version, Finding 2)
- Inference overhead also depended on the model and prompting strategy. Chain-of-thought increased output length and latency for most tested models, while role-playing and bias-aware prompts added little overhead. ^s4
  > "the impact of prompting strategies on inference overhead varies across models." (bound Version, Finding 3)

## Method and scope

The study evaluates five Large Language Models, namely GPT-5-Mini, Claude-Sonnet-4, Gemini-2.5-Flash, Qwen-3 and DeepSeek-V3.1. It uses the AMQA benchmark, whose clinical vignettes include counterfactual pairs for race, sex and socioeconomic status. Each model receives a baseline prompt and four fairness-oriented strategies, comprising role-playing, bias-aware, few-shot and chain-of-thought prompting. The analysis compares demographic accuracy gaps, diagnostic accuracy and inference overhead. It uses paired McNemar tests for changes in inequity and examines alternative descriptions within the same strategy for Qwen-3.

## Assessment relevance

The paper provides substantive evidence for `Generative_KI`, `Prompting`, `Bias_Ungleichheit`, `Gender`, `Diversitaet`, `Fairness`. Categories outside this list are not established by the study. Category relevance records subject matter and does not decide inclusion.

## Limitations

Benchmark responses are not clinical outcomes. Results depend on the selected models, vignettes, demographic variants and prompt formulations. Figures and visual layout were not independently inspected during preparation.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
