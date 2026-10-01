---
type: assertion
topics:
- '[[Gender, Intersectionality, and Bias]]'
status: grounded
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code/agent-a976fd4ffaf2868a6
  model: Claude Opus 5.5
  model-id: claude-opus-5-5
  prepared-at: '2026-10-01'
  task-context: SQ2 drafting from the active source-bound distillates; quotations and block anchors checked against the distillate files, no full-text re-reading.
  artifact-review-status: pending, no AI Agent Review and no domain-expert verification
checked:
  validation: '2026-10-01'
assertion-id: single-attribute-fairness-can-conceal-intersectional-unfairness
grounding:
- '[[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s1]]'
- '[[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s3]]'
- '[[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s4]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# Single-attribute fairness can conceal intersectional unfairness

## Statement

A survey of intersectional fairness in machine learning reports that a model can satisfy fairness criteria for separate demographic groups while remaining unfair to people at their intersections, and that computationally convenient subgroup definitions can themselves leave small groups unprotected.

## Support

- [[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s1]] supports fairness for independent groups without fairness for intersectional groups.
- [[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s3]] supports the exclusion of small groups through subgroup definitions and the call for stakeholder involvement in defining fairness notions.
- [[20_distillates/publications/completion-shjqqti6-intersectional-fairness-machine-learning#^s4]] supports that intersectional notions have mostly been explored theoretically, with little real-world evidence for the subgroups they fail to protect.

## Scope boundary

Affected groups: people located at intersections of protected attributes, with gender and race as recurring examples in the survey according to the distillate's assessment section. Systems: machine-learning classifiers, natural-language processing and ranking, not LLM use in particular. Study type: narrative survey without a reported search protocol. The Assertion states a measurement problem that applies to any single-axis bias evaluation, including those of LLMs. That transfer to LLM evaluations is an inference and not a finding of the survey. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]
- [[30_assertions/visual-disinformation-review-identifies-compounded-risks-for-marginalised-communities]]
