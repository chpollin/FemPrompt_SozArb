---
type: assertion
topics:
- '[[Gender, Intersectionality, and Bias]]'
- '[[Prompting and Bias Mitigation]]'
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
assertion-id: mental-health-classification-shows-demographic-disparities-across-language-models
grounding:
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s1]]'
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s2]]'
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]]'
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]]'
contested-with: []
research-questions:
- SQ2
- SQ3
intended-output:
- literature-report
---

# Mental-health classification shows demographic disparities across language models

## Statement

A preprint that inserted demographic contexts for gender, race, age, religion, sexuality, nationality and their combinations into mental-health classification prompts reports measured fairness disparities across language models, which fairness-aware prompts reduced in the evaluated settings without removing differences between models and tasks.

## Support

- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s1]] supports the research question on fairness across social groups in mental-health prediction.
- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s2]] supports the demographic contexts and their combinations.
- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]] supports the reduction of measured disparities by fairness-aware prompting and the remaining model and task differences.
- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]] supports the authors' judgement that the models remain inadequate for real-world deployment in critical mental-health tasks.

## Scope boundary

Affected groups: synthetic demographic identities along seven social factors and their combinations. Systems: general and mental-health-specific language models. Task and measure: mental-health classification on existing datasets, with fairness assessed as differences in equality of opportunity according to the distillate's method section. Study type: experimental evaluation reported in an arXiv preprint. The distillate's limitations section adds that inserted identity context may not represent how demographic information appears in practice and that table- and figure-dependent numbers were omitted. The Assertion makes no claim that prompting removes demographic bias. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
- [[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]]
