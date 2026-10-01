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
assertion-id: persona-prompts-shift-llm-outputs-toward-assigned-identities
grounding:
- '[[20_distillates/publications/persistent-outgroup-bias-personas#^s1]]'
- '[[20_distillates/publications/persistent-outgroup-bias-personas#^s2]]'
- '[[20_distillates/publications/persona-motivated-reasoning#^s1]]'
- '[[20_distillates/publications/persona-motivated-reasoning#^s2]]'
contested-with: []
research-questions:
- SQ2
- SQ3
intended-output:
- literature-report
---

# Persona prompts shift LLM outputs toward the assigned identity

## Statement

Two experiments report that assigning a political, gender or other sociodemographic persona through the prompt shifts LLM outputs toward that identity, as ingroup favouritism and outgroup bias on survey-style items and as reduced veracity discernment in reasoning tasks.

## Support

- [[20_distillates/publications/persistent-outgroup-bias-personas#^s1]] supports ingroup favouritism and outgroup bias under persona prompts, quoting that self-categorization of social identity leads to both.
- [[20_distillates/publications/persistent-outgroup-bias-personas#^s2]] supports the restriction of that study to political and gender domains, English and the United States context.
- [[20_distillates/publications/persona-motivated-reasoning#^s1]] supports identity-congruent errors after persona assignment, quoting reduced veracity discernment relative to models without personas.
- [[20_distillates/publications/persona-motivated-reasoning#^s2]] supports the authors' limitation that binary gender categories do not represent the full range of identities.

## Scope boundary

Affected groups: political and gender identity groups, and in the second study further sociodemographic attributes. Systems: selected large language models assigned personas by prompt. Tasks and measures: Likert-anchored survey items, misinformation-headline veracity and numeric scientific-evidence judgements. Study type: two experiments. Both studies use simple, partly binary identity categories and do not cover open-ended downstream behaviour. The relevance of this finding for role or persona prompting as a recommended practice is an inference that belongs to SQ3 and is not stated by the sources. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]
- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
