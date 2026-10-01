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
assertion-id: clinical-prompting-fairness-gains-came-from-lifting-unprivileged-groups
grounding:
- '[[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s3]]'
contested-with: []
research-questions:
- SQ3
intended-output:
- literature-report
---

# Fairness gains from prompting on a clinical benchmark came mainly from higher accuracy for unprivileged groups

## Statement

In a clinical question benchmark, the fairness gains reported for fairness-oriented prompting arose mainly through higher diagnostic accuracy for unprivileged groups, while accuracy for privileged groups remained stable.

## Support

- [[20_distillates/publications/a7u389p5-medical-bias-prompt-engineering#^s3]] supports the direction of the reported gains and the stability of privileged-group accuracy.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Role-playing, bias-aware, few-shot and chain-of-thought prompting as a group of fairness-oriented strategies |
| Purpose | Mitigation of demographic bias in diagnostic question answering |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated |

## Conditions and limits

The models, benchmark and test procedure are those named in [[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]. The measure is diagnostic accuracy per demographic group on counterfactual vignettes. The cited statement describes the gains as a general pattern and not as a result of every model and strategy. The finding concerns benchmark accuracy and establishes no effect on clinical care.

## Screening state

The Work has no recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on its inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]
