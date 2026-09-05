---
type: distillate
source-type: publication
reference: Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large
record-id: CYZQ6XPK
work-id: work:843c90a1-99ba-5cbf-9c92-df165923d2b2
version-id: version:5d14f904-8bae-5aae-80af-d807533bd251
version-type: preprint
topics:
  - "[[Prompting and Bias Mitigation]]"
status: ai-agent-reviewed
checked:
  quote: 2026-08-23
  validation: 2026-08-23
  ai-agent-review: 2026-08-23
created: 2026-08-23
updated: 2026-08-23
---

# Distillate: Chain-of-Thought prompting and gender bias

Kaneko et al. evaluate Chain-of-Thought prompting as a gender-bias mitigation method across a constructed benchmark and selected downstream tasks.

## Core statements

- Kaneko et al. report lower bias scores for zero-shot and few-shot Chain-of-Thought prompting in their evaluation. ^s1
  > "both Zero-shot+CoT and Few-shot+CoT decrease bias scores in LLMs" (arXiv:2401.15585, sec. 3.3)
- Kaneko et al. report that Chain-of-Thought does not consistently outperform a debiasing prompt for smaller or only pretrained models. ^s2
  > "for relatively small models or models that have only been pre-trained, CoT does not necessarily debias better than DP." (arXiv:2401.15585, sec. 4.3)

## Open questions

- How far do the reported effects transfer to other bias categories, languages, and applied settings?

## Related

- [[30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations]]
- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
