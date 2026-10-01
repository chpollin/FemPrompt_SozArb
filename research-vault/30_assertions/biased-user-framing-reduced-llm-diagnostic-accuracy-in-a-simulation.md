---
type: assertion
assertion-id: biased-user-framing-reduced-llm-diagnostic-accuracy-in-a-simulation
topics:
- '[[Prompting and Bias Mitigation]]'
status: grounded
checked:
  validation: '2026-10-01'
grounding:
- '[[20_distillates/publications/patient-bias-llm-health-consultations#^s1]]'
contested-with: []
research-questions:
- SQ3
- SQ5
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

# Biased user framing reduced LLM diagnostic accuracy in a simulation

## Statement

A simulation study of LLM-supported health consultations reports that cognitively biased framing by the simulated patient reduced diagnostic accuracy and redirected errors toward the patient's preferred explanation.

## Support

- [[20_distillates/publications/patient-bias-llm-health-consultations#^s1]]. The study compares six models in standard and cognitively biased consultations across medical cases.

## Scope boundary

Simulated patients and examination cases do not reproduce clinical care. The bias studied is a cognitive framing of the user input, not a demographic or structural inequality. The Assertion makes no claim about professional users or social-work tasks.

## Related

- [[30_assertions/persona-prompting-can-introduce-identity-congruent-bias]]
