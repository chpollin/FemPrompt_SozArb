---
type: assertion
topics:
- '[[Gender, Intersectionality, and Bias]]'
- '[[Generative AI in Social Work]]'
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
assertion-id: long-term-care-summaries-showed-model-dependent-gender-differences
grounding:
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s1]]'
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s2]]'
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s3]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# Long-term-care summaries showed model-dependent gender differences

## Statement

A counterfactual evaluation of language-model summaries of gender-swapped adult long-term-care case notes reports gender-based differences in the generated summaries that depended on the model, with none detected for Llama 3 and the clearest differences for Gemma, and links an underemphasis of women's health needs to possible gender disparities in service receipt.

## Support

- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s1]] supports the counterfactual design that holds the care record constant and varies the represented gender.
- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s2]] supports the model dependence, quoting no gender-based differences for Llama 3 and the most significant differences for Gemma.
- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s3]] supports the link between underemphasised women's health needs and possible disparities in service receipt.

## Scope boundary

Affected group: women and men represented in adult social-care records, compared as two counterfactual gender versions. Systems: open-source language models including Llama 3 and Gemma. Task and measures: summarisation of case notes, assessed through sentiment, thematic inclusion and word frequency. Study type: counterfactual evaluation on pseudonymised records from one English local authority. The consequence for service receipt is a warning by the source, and the distillate states that the study does not observe allocation decisions. The distillate's assessment section adds that broader gender identities and intersectional diversity are not addressed. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]]
- [[30_assertions/mental-health-classification-shows-demographic-disparities-across-language-models]]
- [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]
