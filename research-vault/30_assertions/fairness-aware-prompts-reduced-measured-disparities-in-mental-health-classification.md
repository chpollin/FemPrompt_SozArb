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
assertion-id: fairness-aware-prompts-reduced-measured-disparities-in-mental-health-classification
grounding:
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]]'
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s2]]'
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]]'
contested-with:
- '[[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]'
research-questions:
- SQ3
intended-output:
- literature-report
---

# Fairness-aware prompts reduced measured disparities in mental-health classification without making the models fit for autonomous use

## Statement

In mental-health classification tasks with demographic context inserted into the prompts, the authors report that fairness-aware prompting reduced measured disparities in the evaluated settings without significantly compromising classification performance, while differences between models and tasks remained.

## Support

- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]] supports the reported reduction, the absence of a significant performance loss and the remaining model and task differences. The quoted conclusion is phrased as a potential of mitigation.
- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s2]] supports the experimental condition of demographic enrichment across several social factors and their combinations. This statement carries no quotation in the distillate.
- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]] supports the authors' limit that the evaluated models remain inadequate for real-world deployment in critical mental-health tasks.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Technique | Fairness-aware prompting with tailored instructions, compared in the study with zero-shot standard prompting and few-shot chain-of-thought prompting |
| Purpose | Mitigation of demographic disparities in mental-health prediction |
| Stage | Prompt_Practice, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated |

## Conditions and limits

The anchored statements do not name the models and datasets on which the fairness-aware prompts were tested, and the distillate's method section describes only the overall experiment. The model and dataset condition of this effect is therefore not determinable from the active distillate. The fairness measure is also not named here, because the measure given in the distillate's method section has been reported for correction against the source. The limitations section of the distillate records synthetic demographic enrichment, a limited set of prompting methods and content-policy interference with sensitive texts. The source is a preprint.

## Screening state

The Work has no recorded screening decision in `generated/completion/completion-package.json`. Use of this Assertion in the literature report is conditional on its inclusion.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/chain-of-thought-reduced-clinical-accuracy-gaps-most-often-but-not-universally]]
- [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]
