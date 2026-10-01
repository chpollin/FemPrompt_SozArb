---
type: assertion
assertion-id: wang-et-al-report-fairness-aware-prompting-reduced-measured-disparities-in-mental-health-prediction
topics:
- '[[Prompting and Bias Mitigation]]'
status: grounded
checked:
  validation: '2026-10-01'
grounding:
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]]'
contested-with:
- '[[30_assertions/xiao-et-al-find-no-fair-prompting-strategy-effective-in-every-tested-scenario]]'
research-questions:
- SQ3
- SQ4
intended-output:
- literature-report
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code-subagent/sq4-competences
  model: Claude Opus 5.5 (claude-opus-5-5)
  prepared-at: '2026-10-01'
  task-context: SQ4 best-fit framework synthesis draft. Wording derived from the cited active distillate statement; no historical screening tracks or advisory SQ outputs used as evidence.
  artifact-review-status: pending; no AI Agent Review or domain-expert verification has occurred
---

# Wang et al. report that fairness-aware prompting reduced measured disparities in mental-health prediction

## Statement

Wang et al. (2024) report that fairness-aware prompting reduced measured demographic disparities in mental-health prediction across their evaluated settings, while differences between models and tasks remained.

## Support

- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s3]]. The source reports the reduction and the remaining model and task differences.

## Contested evidence

[[30_assertions/xiao-et-al-find-no-fair-prompting-strategy-effective-in-every-tested-scenario]] reports that no fair-prompting strategy reduced measured gaps in every tested medical scenario. The tension concerns generalisation across settings and remains unresolved in this draft.

## Scope boundary

The study is an arXiv preprint using synthetic demographic enrichment of selected datasets. Its authors do not claim that prompting removes demographic bias or makes the models ready for clinical use. Table- and figure-dependent comparisons were not carried into the distillate.

## Related

- [[30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations]]
- [[30_assertions/mental-health-llm-audits-advise-against-unguarded-reliance-in-consequential-decisions]]
