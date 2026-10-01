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
  task-context: SQ3 Assertion drafted from anchored statements of an active distillate.
    No AI Agent Review and no domain-expert verification have taken place.
checked:
  validation: '2026-10-01'
assertion-id: switching-prompt-language-shifted-rather-than-removed-cultural-bias
grounding:
- '[[20_distillates/publications/multi-agent-cultural-debate#^s1]]'
- '[[20_distillates/publications/multi-agent-cultural-debate#^s2]]'
contested-with: []
research-questions:
- SQ3
intended-output:
- literature-report
---

# Switching the prompt language to Chinese shifted measured cultural bias instead of removing it

## Statement

In a Chinese-English cultural-bias benchmark, prompting in Chinese shifted measured bias toward East Asian perspectives instead of eliminating it.

## Support

- [[20_distillates/publications/multi-agent-cultural-debate#^s1]] supports the shift of measured bias under Chinese prompting.
- [[20_distillates/publications/multi-agent-cultural-debate#^s2]] supports the authors' limit that no repeated multi-run evaluation was conducted.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Choice of prompt language as a mitigation of Western-centric bias, without a matching value in the controlled technique vocabulary |
| Purpose | Mitigation of cultural bias in generated answers |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated, with a negative result for the technique |

## Conditions and limits

The distillate records a bilingual benchmark over five cultural domains with discrete labels and an evaluation by several language-model judges in its method, findings and limitations sections, none of which carries a statement anchor. The anchored statements do not name the models used for the language comparison. Stability across runs is not established. The result concerns cultural bias between Western and East Asian perspectives and says nothing about other bias axes.

## Scope boundary

The same paper proposes a multi-agent debate procedure with cultural personas and reports results for it. Those results appear only in the distillate's main-findings section without a statement anchor, so this Assertion makes no claim about the debate procedure.

## Screening state

The Work has no recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on its inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
