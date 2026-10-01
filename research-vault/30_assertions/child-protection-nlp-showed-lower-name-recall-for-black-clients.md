---
type: assertion
topics:
- '[[Gender, Intersectionality, and Bias]]'
- '[[Algorithmic Decision Support in Social Work]]'
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
assertion-id: child-protection-nlp-showed-lower-name-recall-for-black-clients
grounding:
- '[[20_distillates/publications/r7v99era-racial-bias-nlp-child-protective-services#^s1]]'
- '[[20_distillates/publications/r7v99era-racial-bias-nlp-child-protective-services#^s2]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# Child-protection NLP showed lower name recall for Black clients

## Statement

An empirical evaluation of natural-language processing on administrative contact notes from one county child-protection system reports significantly lower named-entity-recognition recall for the names of Black clients than for those of white clients, while finding little evidence that adding text features to the studied risk model increased aggregate racial performance disparities.

## Support

- [[20_distillates/publications/r7v99era-racial-bias-nlp-child-protective-services#^s1]] supports the setting, the data and the focus on racial performance disparities.
- [[20_distillates/publications/r7v99era-racial-bias-nlp-child-protective-services#^s2]] supports the recall disparity, the uncertain coreference disparities and the absent aggregate effect in the risk model.

## Scope boundary

Affected group: Black and white clients of one county child-protection system. Systems: four named-entity-recognition systems, neural coreference systems and a random-forest placement risk model with added text features, not generative language models. Measures: recall on client names, coreference performance, and performance, calibration and high-risk classification of the risk model. Study type: empirical evaluation on administrative records. The distillate's limitations section adds that race is recorded as perceived by workers, that the main comparisons reduce families to Black-majority and white-majority groups and that the authors do not claim to capture privacy, contestability, surveillance or institutional power harms. The Assertion therefore states a component-level disparity and does not claim a disparity in the risk model's aggregate outputs. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]]
