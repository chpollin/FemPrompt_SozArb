---
type: assertion
topics:
- '[[Safeguards and Governance]]'
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
assertion-id: worker-assisted-screening-showed-smaller-racial-disparity-than-algorithm-only-policy
grounding:
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s1]]'
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s2]]'
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s3]]'
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s4]]'
contested-with: []
research-questions:
- SQ2
- SQ3
intended-output:
- literature-report
---

# Worker-assisted child-welfare screening showed a smaller racial disparity than a hypothetical algorithm-only policy

## Statement

In one county child-welfare intake system, actual worker decisions assisted by a predictive screening tool showed a smaller Black-white screen-in-rate disparity than a hypothetical policy that would have followed the tool alone over the same post-deployment period.

## Support

- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s1]] supports the comparison between a hypothetical algorithm-only policy and actual worker decisions assisted by the Allegheny Family Screening Tool.
- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s2]] supports the two disparity values for the studied post-deployment period.
- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s3]] supports the qualitative finding that workers used contextual information and compensated for perceived model limitations.
- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s4]] supports the limit that the study cannot attribute the change from the earlier period to the introduction of the tool.

## Technique, purpose, stage and evidence status

| Dimension | Reading |
|---|---|
| Safeguard | Retained worker discretion over a predictive risk score |
| Purpose | Reduction of racial disparity in algorithm-assisted screening decisions |
| Stage | Organisational_Process, read by the preparing agent from the codebook stage definitions and not a governed coding value |
| Evidence status | Evaluated, through an observational comparison with a counterfactual policy |

## Conditions and limits

The system is a non-generative predictive risk model, version 1 of the Allegheny Family Screening Tool. The measure is the Black-white difference in screen-in rates. The algorithm-only policy is counterfactual and depends on a chosen score threshold, according to the distillate's method and limitations sections. The limitations section further records that the quantitative data and the qualitative fieldwork come from different periods, that corrected retrospective scores sometimes differ from those workers saw, and that the study does not distinguish warranted from unwarranted disparity. The finding concerns one county, one workflow and one tool version and establishes no effect for generative AI.

## Screening state

The Work carries an Include decision in `generated/completion/completion-package.json` and governed coding with mitigation stage Organisational_Process and status Evaluated in `generated/completion/sq-association-tables.csv`.

## Review status

The Assertion is `grounded`. Only deterministic validation has run. AI Agent Review and domain-expert verification are pending.

## Related

- [[30_assertions/child-protection-analysis-proposes-preserving-accountable-professional-discretion]]
- [[30_assertions/reflexive-use-of-algorithmic-decisions-can-expose-bias-without-preventing-it]]
