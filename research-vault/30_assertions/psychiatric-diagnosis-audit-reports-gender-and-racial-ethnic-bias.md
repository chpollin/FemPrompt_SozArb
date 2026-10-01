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
assertion-id: psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias
grounding:
- '[[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s1]]'
- '[[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# A psychiatric diagnosis audit reports gender and racial or ethnic bias in LLMs

## Statement

An audit study that varied implicit gender and racial or ethnic identity cues while holding psychiatric case content constant across several large language models reports biases in the generated diagnoses and urges caution and vigilance in using LLMs for psychiatric clinical decision support.

## Support

- [[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s1]] supports the audit design and the identity dimensions varied.
- [[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]] supports the warning against harmful differential treatment and its basis in the reported biases.

## Scope boundary

Affected groups: patients signalled through implicit gender and racial or ethnic identity cues. Systems: several general and medical large language models. Task: automated psychiatric diagnosis against recorded diagnoses. Study type: audit study with simulated decision support. The forms of the reported bias, which the distillate's main findings describe as differences in overdiagnosis, diagnosis types and descriptive language, carry no statement anchor and are therefore not part of this Assertion. The distillate's limitations section adds that constant symptoms cannot represent culturally varying presentation and that simulated decision support does not establish clinical outcomes. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/long-term-care-summaries-showed-model-dependent-gender-differences]]
- [[30_assertions/mental-health-classification-shows-demographic-disparities-across-language-models]]
