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
assertion-id: chain-of-thought-prompting-added-inference-overhead-in-clinical-benchmark
grounding:
- '[[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s4]]'
contested-with: []
research-questions:
- SQ3
intended-output:
- literature-report
---

# Chain-of-thought prompting added inference overhead in a clinical bias benchmark, while role-playing and bias-aware prompts added little

## Statement

A clinical bias benchmark study reports that inference overhead depended on the model and the prompting strategy, with chain-of-thought prompting increasing output length and latency for most tested models while role-playing and bias-aware prompts added little overhead.

## Support

- [[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s4]] supports the model dependence of the overhead and the contrast between chain-of-thought prompting and the role-playing and bias-aware prompts.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Chain-of-thought, role-playing and bias-aware prompting |
| Purpose | Cost of bias-mitigation prompting, reported as a limitation |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated, as a measured cost of the techniques |

## Conditions and limits

The models and benchmark are those named in [[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]. The measures are output length and latency per strategy and model. The finding concerns the tested deployments and does not establish costs for other models, serving configurations or tasks.

## Screening state

The Work has no recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on its inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]
