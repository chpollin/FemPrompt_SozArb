---
type: assertion
topics:
- '[[Generative AI in Social Work]]'
status: grounded
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code/worktree-agent-a02b678bb211ace30
  model: Claude Opus 5.5 (claude-opus-5-5)
  prepared-at: '2026-10-01T08:15:00+00:00'
  task-context: SQ1 drafting from the active distillates in research-vault/20_distillates/publications/.
    No full text, historical screening track or advisory coding used as evidence.
  artifact-review-status: pending, no AI Agent Review or domain-expert verification has occurred
checked:
  validation: '2026-10-01'
assertion-id: cheng-et-al-report-smaller-disparity-for-worker-assisted-than-algorithm-only-screening
grounding:
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s2]]'
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s3]]'
- '[[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s4]]'
contested-with: []
research-questions:
- SQ1
- SQ2
intended-output:
- literature-report
---

# Cheng et al. report a smaller disparity for worker-assisted than for algorithm-only screening

## Statement

Cheng et al. (2022) report that, in one county's child-welfare intake after deployment of a screening algorithm, decisions by workers assisted by the tool showed a smaller Black-white screen-in disparity than a hypothetical algorithm-only policy, and they do not attribute the change from the earlier period to the tool.

## Support

- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s2]] supports the comparison of disparities between the hypothetical algorithm-only policy and actual worker-assisted decisions.
- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s3]] supports the qualitative account that workers used contextual information and compensated for perceived model limitations.
- [[20_distillates/publications/7fefmcbz-child-welfare-worker-algorithm-disparities#^s4]] supports the limitation that the quantitative comparison does not establish a causal effect of introducing the tool.

## Scope boundary

The study is a mixed-methods analysis of one county, one workflow and one version of a predictive screening tool, not of a large language model. The algorithm-only decisions are counterfactual and depend on a chosen threshold, and the qualitative fieldwork took place after later policy and model changes (limitations section of the distillate, without statement anchor). The reported difference concerns the combination of algorithmic score and worker discretion. It is no evidence of a benefit of the tool on its own, and it does not distinguish warranted from unwarranted disparity. Contradicting sources were not systematically searched, so `contested-with: []` does not assert consensus.

## Review status

Drafted by the agent named in the frontmatter. Deterministic validation only. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/cheng-et-al-and-field-et-al-examine-predictive-and-nlp-tools-in-child-welfare]]
