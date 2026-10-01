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
assertion-id: vision-language-model-gender-stereotypes-override-visual-evidence
grounding:
- '[[20_distillates/publications/completion-z9dntbff-gender-bias-vision-language-models#^s1]]'
- '[[20_distillates/publications/completion-z9dntbff-gender-bias-vision-language-models#^s3]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# Gender stereotypes can override visual evidence in a vision-and-language model

## Statement

A probing study of the pre-trained vision-and-language model VL-BERT reports that learned gender stereotypes can override visual evidence in the model's predictions, which the authors treat as a representational harm.

## Support

- [[20_distillates/publications/completion-z9dntbff-gender-bias-vision-language-models#^s1]] supports the framing of reliance on stereotypical gender cues as a representational harm that can displace input evidence.
- [[20_distillates/publications/completion-z9dntbff-gender-bias-vision-language-models#^s3]] supports the reported cases in which the model's gender bias overrides the visible entity.

## Scope boundary

Affected group: women and men as represented through male and female terms and images of male- and female-presenting people. System: VL-BERT, a pre-trained multimodal transformer and not a generative LLM in use. Task and measure: template-based masked prediction of stereotypically gendered entities. Study type: probing study with a controlled case study and a broader entity analysis. The distillate's limitations section adds that the study covers one architecture, English prompts and a restricted entity set and that its binary design does not represent gender adequately. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]
