---
type: assertion
assertion-id: mental-health-llm-audits-advise-against-unguarded-reliance-in-consequential-decisions
topics:
- '[[Bias and Fairness]]'
- '[[Prompting and Bias Mitigation]]'
status: grounded
checked:
  validation: '2026-10-01'
grounding:
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]]'
- '[[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]]'
contested-with: []
research-questions:
- SQ4
intended-output:
- literature-report
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code-subagent/sq4-competences
  model: Claude Opus 5.5 (claude-opus-5-5)
  prepared-at: '2026-10-01'
  task-context: SQ4 best-fit framework synthesis draft. Wording derived from the cited active distillate statements; no historical screening tracks or advisory SQ outputs used as evidence.
  artifact-review-status: pending; no AI Agent Review or domain-expert verification has occurred
---

# Mental-health LLM audits advise against unguarded reliance in consequential decisions

## Statement

Two evaluations of LLMs in mental-health and psychiatric tasks conclude that the evaluated models should not be relied on without caution in consequential clinical decisions.

## Support

- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]]. Wang et al. (2024) judge the evaluated models inadequate for autonomous real-world deployment in critical mental-health tasks.
- [[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]]. The audit of automated psychiatric diagnoses urges caution and vigilance when LLMs are used in clinical decision support.

## Scope boundary

Both studies use benchmark or vignette designs in clinical settings and do not observe social-work practice. Their conclusions concern the evaluated models at the time of study. The Assertion records the authors' cautionary conclusion and does not specify which safeguards they consider sufficient.

## Related

- [[30_assertions/wang-et-al-fairness-aware-prompting-reduced-mental-health-disparities]]
- [[30_assertions/sources-tie-algorithmic-decision-support-to-retained-professional-control]]
