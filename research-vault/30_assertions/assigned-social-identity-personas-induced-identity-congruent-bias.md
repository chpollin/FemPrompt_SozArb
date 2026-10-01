---
type: assertion
topics:
- '[[Prompting and Bias Mitigation]]'
status: grounded
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code/agent-aec849b171b42da27
  model: Claude Opus 5.5
  model-id: claude-opus-5-5
  prepared-at: '2026-10-01T08:16:40+00:00'
  task-context: SQ3 Assertion drafted from anchored statements of two active distillates.
    No AI Agent Review and no domain-expert verification have taken place.
checked:
  validation: '2026-10-01'
assertion-id: assigned-social-identity-personas-induced-identity-congruent-bias
grounding:
- '[[20_distillates/publications/persistent-outgroup-bias-personas#^s1]]'
- '[[20_distillates/publications/persistent-outgroup-bias-personas#^s2]]'
- '[[20_distillates/publications/persona-motivated-reasoning#^s1]]'
- '[[20_distillates/publications/persona-motivated-reasoning#^s2]]'
contested-with:
- '[[30_assertions/multi-persona-thinking-reported-lower-benchmark-bias-than-prompting-baselines]]'
research-questions:
- SQ2
- SQ3
intended-output:
- literature-report
---

# Assigning a social-identity persona in a prompt induced identity-congruent bias in two evaluations

## Statement

Two evaluations report that assigning a social-identity persona in a prompt induces identity-congruent bias, observed as ingroup favouritism and outgroup bias in one study and as reduced veracity discernment in the other.

## Support

- [[20_distillates/publications/persistent-outgroup-bias-personas#^s1]] supports ingroup favouritism and outgroup bias under persona prompts.
- [[20_distillates/publications/persistent-outgroup-bias-personas#^s2]] supports the restriction of that study to political and gender domains, English and a United States context.
- [[20_distillates/publications/persona-motivated-reasoning#^s1]] supports the reduction of veracity discernment after political and sociodemographic persona assignment.
- [[20_distillates/publications/persona-motivated-reasoning#^s2]] supports that study's limit of binary gender categories.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Assignment of a single social-identity persona, read as Role_Persona in the controlled vocabulary |
| Purpose | The technique is the object of evaluation as a source of bias, not a mitigation |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated as a risk of the technique |

## Conditions and limits

The outgroup study measures intergroup treatment with survey-style Likert items in political and gender domains, according to its distillate's method section. The motivated-reasoning study tests eight personas across four attributes on eight models with a misinformation-headline task and a numeric scientific-evidence task, according to its distillate's method section, and the anchored quotation states the size of the largest reduction in veracity discernment. Neither study establishes the effect for richer or intersectional identity profiles, open-ended downstream behaviour or professional tasks.

## Contested evidence

[[30_assertions/multi-persona-thinking-reported-lower-benchmark-bias-than-prompting-baselines]] uses contrasting personas together with a neutral perspective as a mitigation. The configurations differ, so the evidence qualifies persona prompting in both directions without a direct contradiction. This reading is an inference of the preparing agent.

## Screening state

Neither Work has a recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on their inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/multi-persona-thinking-reported-lower-benchmark-bias-than-prompting-baselines]]
