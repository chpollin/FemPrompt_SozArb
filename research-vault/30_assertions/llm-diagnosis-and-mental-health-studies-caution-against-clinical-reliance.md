---
type: assertion
topics:
- '[[Generative AI]]'
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
assertion-id: llm-diagnosis-and-mental-health-studies-caution-against-clinical-reliance
grounding:
- '[[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]]'
- '[[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]]'
- '[[20_distillates/publications/patient-bias-llm-health-consultations#^s1]]'
contested-with: []
research-questions:
- SQ1
- SQ2
intended-output:
- literature-report
---

# LLM studies on diagnosis and mental-health prediction caution against clinical reliance

## Statement

Three studies that test LLMs for mental-health prediction, automated psychiatric diagnosis and health consultations caution against relying on the tested models in clinical decisions, although the mental-health prediction study reports encouraging predictive performance.

## Support

- [[20_distillates/publications/completion-9zkzqm63-bias-mental-health-llms#^s4]] supports that Wang et al. (2024) judge the evaluated models inadequate for real-world deployment in critical mental-health tasks despite encouraging performance.
- [[20_distillates/publications/demographic-bias-psychiatric-llm-diagnoses#^s2]] supports the call of the 2026 audit of automated psychiatric diagnoses for caution and vigilance in psychiatric clinical decision support.
- [[20_distillates/publications/patient-bias-llm-health-consultations#^s1]] supports the 2026 simulation finding that biased patient framing reduces diagnostic accuracy and compromises reliability in health consultations.

## Scope boundary

The settings are mental health and health care, and none of the three studies examines social work. All three are benchmark, audit or simulation designs and observe no clinical outcome (method and limitation sections of the distillates, without statement anchors). The study by Wang et al. is an arXiv preprint. For SQ1 the Assertion records diagnostic and classification tasks for which the tested literature reports risks that outweigh the reported performance in its own conclusion. Contradicting sources were not systematically searched, so `contested-with: []` does not assert consensus.

## Review status

Drafted by the agent named in the frontmatter. Deterministic validation only. No AI Agent Review and no domain-expert verification have taken place.
