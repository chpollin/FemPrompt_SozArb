---
title: "SQ Analysis, Advisory LLM Track"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
version: "0.6"
created: 2026-07-21
updated: 2026-08-23
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-5.6)
related: [update-protocol, plan, methods, verification, research-vault, analysis-divergence]
---

# SQ Analysis, Advisory LLM Track

This advisory analysis records hypotheses generated from an earlier LLM coding over the available distilled knowledge documents. It supports schema refinement, expert-question design, and later comparison with the governed full-corpus analysis. Its structured inputs and quantities live under `generated/analysis-advisory/`. The present document carries the qualitative interpretation and its authority limits.

## Method chain

The advisory workflow mapped round-one Includes to available distilled knowledge documents, coded the frozen analysis fields, aggregated the structured values, generated candidate syntheses for SQ1 to SQ3, and ran an adversarial review against the coded records. The chain is documented in the following artifacts.

| Artifact | Function |
|---|---|
| `manifest.json` | source mapping, coverage, and unmapped records |
| `sq_extraction.json` | per-paper coding, snippets, and answerability notes |
| `aggregates.json` | deterministic frequencies and co-occurrences |
| `syntheses_critique.json` | candidate claims, gaps, and adversarial verdicts |

The coding basis was the generated distillate. Each record therefore inherits the selection, summarisation, and translation choices of that layer. Duplicate-title mappings and missing distillates create additional coverage uncertainty. These limits require regeneration from the completed governed corpus before the paper can use the findings.

## Advisory findings

### SQ1, prompting techniques and evidence

The candidate pattern suggests that much of the corpus discusses AI literacy, governance, or bias without specifying a concrete prompting technique. Where named techniques occur, they cluster in experimental or benchmark-oriented studies. General guidance covers both broad prompting literacy and concrete interventions that lack a stable taxonomy label. The later analysis should separate these two uses.

Evaluated prompting interventions appear concentrated on narrow representational-bias tasks outside social-work practice. Self-critique and self-debiasing form the most coherent candidate technique family in the advisory coding. Their transfer to professional social-work settings remains an empirical question.

### SQ2, bias axes and mitigation

Gender and race or ethnicity form the most visible axes in the advisory coding. Intersectional, socioeconomic, disability, sexuality, age, and language-related analyses appear less consistently connected to evaluated mitigation. Organisational guidance and AI-literacy measures dominate the proposed responses, while evaluated technical work concentrates on narrower prompt or model interventions.

The candidate pattern distinguishes representational harms from allocative and performance harms. Technical prompting studies focus mainly on stereotyping. Social-work literature more often raises proxy discrimination, unequal service outcomes, and governance duties. The final analysis must test this mismatch against the verified Paper sources.

### SQ3, social-work-specific constraints

The advisory coding found little evidence that concrete prompting techniques have been evaluated in genuine social-work practice settings. Social-work sources instead emphasise professional judgement, vulnerable or involuntary clients, structural disadvantage, participatory design, data sovereignty, and accountability for consequential decisions.

These themes suggest that general prompt-engineering guidance requires domain adaptation. A social-work-specific account would need to address relational practice, institutional power, proxy variables for poverty and marginalisation, and the consequences of decisions that clients cannot simply exit.

## Candidate gap map

| Gap | Advisory interpretation | Required verification |
|---|---|---|
| Technique transfer | Evaluated prompt interventions occur outside social-work practice | Recompute technique by practice-field relations from verified records |
| Harm mismatch | Prompt studies and social-work studies focus on different harm mechanisms | Verify harm and mitigation coding against Paper sources |
| Socioeconomic and intersectional coverage | Central social-work axes have little evaluated prompting evidence | Check full corpus and absent-source cases |
| Evidence status | Organisational recommendations exceed evaluated domain interventions | Recompute mitigation stage by evidence status |
| Practice-field coverage | Several social-work fields are thin or absent in the closed vocabulary | Review population and practice-field coding with domain experts |
| Benchmark substrate | Generative stereotyping benchmarks capture only part of the harms raised in social work | Translate verified gaps into later benchmark requirements |

## Use in the paper workflow

The advisory analysis supports the structure of the synthesis section and the questions in `paper/expert-questions.md`. It provides hypotheses for the governed analysis scripts and candidate Assertions. It cannot supply a paper result, figure, or abstract statement in its current state.

The licensing path has four steps. The complete corpus receives governed coding, deterministic analysis derives the quantitative patterns, Assertions connect qualitative statements to source-linked distillates, and domain experts verify the resulting interpretation. [[verification]] records progress through these checks.
