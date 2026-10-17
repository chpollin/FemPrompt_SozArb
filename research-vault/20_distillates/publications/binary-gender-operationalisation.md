---
type: distillate
source-type: publication
reference: Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large
record-id: CYZQ6XPK
work-id: work:843c90a1-99ba-5cbf-9c92-df165923d2b2
version-id: version:5d14f904-8bae-5aae-80af-d807533bd251
version-type: preprint
topics: ["[[Gender, Intersectionality, and Bias]]"]
status: grounded
checked:
  quote: '2026-10-17'
  validation: '2026-10-17'
created: '2026-10-17'
updated: '2026-10-17'
prepared-by:
  agent-id: codex/socialai/01a14a55-dac3-7632-9963-b13b212447d7
  model: GPT-6
  task-context: Full-text SQ4 preparation, without a separate AI Agent Review.
---

# Binary gender operationalisation in a prompting benchmark

Kaneko et al. (2024), *Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting*, evaluate a constructed word-counting task and selected benchmark tasks. This SQ4-specific reduction complements the existing effect-focused distillate without changing its reviewed bytes.

## Core statements

- The benchmark operationalises gender bias as a difference in counting accuracy when stereotypically gender-associated occupational words are added to feminine and masculine word lists (Kaneko et al., 2024, section 2). ^s1
  > “Bias evaluation is based on the difference in the accuracy” (section 2, reading-layer line 41).
- The authors explicitly restrict the evaluated gender categories to binary gender and identify non-binary gender as future work (Kaneko et al., 2024, Limitations). ^s2
  > “The gender biases we considered in this paper cover only binary gender.” (reading-layer line 360).
- A low score on this benchmark does not establish that the LLM is free of bias (Kaneko et al., 2024, Ethics Statement). ^s3
  > “A low bias score in our evaluation method does not guarantee that the model is free of bias.” (reading-layer line 364).

## Reading and authority

The preparing session read the complete available Markdown representation, including the references and prompt appendix. The source is `generated/markdown_clean/Kaneko_2024_Evaluating_gender_bias_in_large_language_models.md`, projected as `docs/data/fulltext/CYZQ6XPK.md`. The record and preferred preprint Version were checked in the existing registry and reading manifest. This uses the existing legacy source resolution and creates no new binding or preferred Version.

The source file's byte SHA-256 on this worktree is `7a17b98f73907a2af18d05099dbf459b79645b9a1798720722b7e0d0a0b0b5f0`. This byte digest is a local inspection anchor, not a canonical-text-hash review receipt. Figures and original PDF layout were not inspected. The conceptual statements above rely on prose, not reconstructed figure values. The cited reference key retains its historical title while the body identifies the title printed in the read text.

The new distillate is unreviewed source preparation. `grounded` records deterministic structural validation only. No independent AI Agent Review, conversion-fidelity certification or domain-expert verification is claimed.

## Related

- [[20_distillates/publications/kaneko-2024-cot-and-gender-bias]]
- [[30_assertions/binary-gender-benchmark-defines-bias-through-task-performance]]
