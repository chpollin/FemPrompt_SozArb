---
type: assertion
topics:
- '[[Gender, Intersectionality, and Bias]]'
status: grounded
created: '2026-10-01'
updated: '2026-10-01'
prepared-by:
  agent-id: claude-code/agent-a976fd4ffaf2868a6
  model: Claude Opus 5.5
  model-id: claude-opus-5-5
  prepared-at: '2026-10-01'
  task-context: SQ2 drafting from the active source-bound distillates; quotations and block anchors checked against the distillate files, no full-text re-reading.
  artifact-review-status: pending, no AI Agent Review and no domain-expert verification
checked:
  validation: '2026-10-01'
assertion-id: llm-generated-text-positions-cultures-asymmetrically
grounding:
- '[[20_distillates/publications/insideout-cultural-bias-interview-generation#^s1]]'
- '[[20_distillates/publications/insideout-cultural-bias-interview-generation#^s2]]'
- '[[20_distillates/publications/multi-agent-cultural-debate#^s1]]'
- '[[20_distillates/publications/multi-agent-cultural-debate#^s2]]'
contested-with: []
research-questions:
- SQ2
intended-output:
- literature-report
---

# LLM-generated text positions cultures asymmetrically

## Statement

Two benchmark studies report culturally asymmetric perspectives in LLM-generated text, with insider tones in most US-context interview scripts and, when prompts are written in Chinese, a shift of measured bias toward East Asian perspectives instead of its removal.

## Support

- [[20_distillates/publications/insideout-cultural-bias-interview-generation#^s1]] supports the insider-outsider measure and quotes insider tones in over 88 percent of US-context scripts on average.
- [[20_distillates/publications/insideout-cultural-bias-interview-generation#^s2]] supports the restriction to a small subset of cultures.
- [[20_distillates/publications/multi-agent-cultural-debate#^s1]] supports that Chinese prompting shifts bias toward East Asian perspectives rather than eliminating it.
- [[20_distillates/publications/multi-agent-cultural-debate#^s2]] supports that the second study did not repeat multi-run evaluations.

## Scope boundary

Affected groups: cultures and language communities represented in generated text, measured against a US or Western reference in the first study and between Western and East Asian perspectives in the second. Systems: several large language models. Tasks and measures: generation of culturally situated interview scripts with an insider-outsider measure, and a bilingual cultural-bias benchmark with LLM judges. Study type: benchmark evaluation. The contrast that non-Western settings more often elicit outsider positioning appears only in the first distillate's main findings and carries no statement anchor. Stability across runs is unestablished for the second study. `contested-with: []` records that no conflicting statement was found among the active distillates and does not assert consensus.

## Review status

Prepared on 1 October 2026 as attributed in the frontmatter. The status `grounded` records only that the deterministic anchor and schema check passed. No AI Agent Review and no domain-expert verification have taken place.

## Related

- [[30_assertions/persona-prompts-shift-llm-outputs-toward-assigned-identities]]
