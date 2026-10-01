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
assertion-id: chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally
grounding:
- '[[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s2]]'
- '[[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s1]]'
contested-with:
- '[[30_assertions/fairness-aware-prompts-reduced-measured-disparities-in-mental-health-classification]]'
research-questions:
- SQ3
intended-output:
- literature-report
---

# Chain-of-thought prompting most often reduced demographic accuracy gaps on a clinical benchmark, but no prompting strategy was universally effective

## Statement

On a clinical question benchmark with counterfactual demographic variants, chain-of-thought prompting produced the most cases of significant reductions in demographic accuracy gaps among the tested fairness-oriented prompting strategies, while no strategy reduced the gaps in every tested model and attribute and some model-attribute cases became less fair.

## Support

- [[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s2]] supports the comparative result for chain-of-thought prompting, its concentration in two models and the cases that became less fair.
- [[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s1]] supports the model dependence and the absence of a universally effective strategy.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Chain-of-thought prompting, compared with role-playing, bias-aware and few-shot prompting and a baseline prompt |
| Purpose | Mitigation of demographic bias in diagnostic question answering |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated, with a mixed result, for chain-of-thought prompting and the three comparison strategies |

## Conditions and limits

The distillate's method section, which carries no statement anchor, names the five evaluated models (GPT-5-Mini, Claude-Sonnet-4, Gemini-2.5-Flash, Qwen-3 and DeepSeek-V3.1), the AMQA benchmark with counterfactual vignette pairs for race, sex and socioeconomic status, and paired McNemar tests on the change in accuracy gaps. The measure is the diagnostic accuracy gap between demographic variants of the same vignette. Its limitations section states that benchmark responses are not clinical outcomes and that the results depend on the selected models, vignettes, demographic variants and prompt formulations.

## Screening state

The Work has no recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on its inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending. Contradictory sources were not searched systematically beyond the active distillates.

## Related

- [[30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations]]
- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
- [[30_assertions/clinical-prompting-fairness-gains-came-from-lifting-unprivileged-groups]]
- [[30_assertions/chain-of-thought-prompting-added-inference-overhead-in-clinical-benchmark]]
