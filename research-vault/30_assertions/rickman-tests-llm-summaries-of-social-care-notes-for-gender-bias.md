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
assertion-id: rickman-tests-llm-summaries-of-social-care-notes-for-gender-bias
grounding:
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s1]]'
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s2]]'
- '[[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s3]]'
contested-with: []
research-questions:
- SQ1
- SQ2
intended-output:
- literature-report
---

# Rickman tests LLM summaries of social-care notes for gender bias

## Statement

Rickman (2025) uses LLM summarisation of long-term-care case notes as the test task for a counterfactual gender-bias evaluation and reports that gender differences in the summaries depend on the model.

## Support

- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s1]] supports the counterfactual design that holds the care record constant and varies the represented gender.
- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s2]] supports the model dependence, with no detected differences for one model and the clearest differences for another.
- [[20_distillates/publications/completion-j4k3xa52-gender-bias-long-term-care-llms#^s3]] supports the author's concern that underemphasis of women's health needs could affect service allocation in needs-based care.

## Scope boundary

The task is the summarisation of case documentation in adult social care, using pseudonymised records of one English local authority (method section of the distillate, without statement anchor). The study evaluates bias in this task and not its benefit, accuracy or time saving. The allocation consequence is a stated possibility and not an observed effect. Contradicting sources were not systematically searched, so `contested-with: []` does not assert consensus.

## Review status

Drafted by the agent named in the frontmatter. Deterministic validation only. No AI Agent Review and no domain-expert verification have taken place.
