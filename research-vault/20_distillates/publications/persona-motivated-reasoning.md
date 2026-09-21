---
type: distillate
source-type: publication
reference: STQU6H42
record-id: STQU6H42
work-id: work:0fb6cbb2-9d40-5815-9680-3e9f14f27e16
version-id: version:0606f0c5-0aa6-5cae-b273-2b8619630c6f
version-type: version_of_record
topics:
- '[[Bias and Fairness]]'
status: ai-agent-reviewed
checked:
  quote: 2026-09-21
  validation: '2026-09-21'
  ai-agent-review: '2026-09-21'
created: 2026-09-21
updated: '2026-09-21'
prepared-by:
  agent-id: /root/knowledge_documents
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: ai-agent-reviewed
source-representation:
  path: generated/source-acquisition/codex-websearch-2026/markdown-clean/4dbe6aa9dfa229e88746.md
  sha256: sha256:6ebe509cb9eb59315760f1de2ad87b7b1b17ddc641640782c15895073dd7740f
  version-id: version:0606f0c5-0aa6-5cae-b273-2b8619630c6f
  version-type: version_of_record
  source-url: https://aclanthology.org/2026.findings-acl.585/
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound ACL proceedings Markdown representation and checked the quoted passages. No separate scholarly review has occurred.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/STQU6H42.json
  sha256: sha256:db2dff39999927d4b95c2e8861e3f70f157d47fa44a52eef4a37fefebff6febd
---

# Distillate: Persona-Assigned Large Language Models Exhibit Human-Like Motivated Reasoning

The study tests whether political and sociodemographic personas induce identity-congruent motivated reasoning across eight language models and two reasoning tasks.

## Core statements

- The experiment measures identity-congruent errors after political and sociodemographic persona assignment. ^s1
  > "persona-assigned LLMs have up to 9% reduced veracity discernment relative to models without personas" (10.18653/v1/2026.findings-acl.585)

- The authors explicitly delimit transfer beyond the evaluated identities, domains or runs. ^s2
  > "our use of binary categories, specifically for gender, does not represent the full range of diverse identities" (10.18653/v1/2026.findings-acl.585)

## Research question and method

The study asks whether assigned political and sociodemographic identities cause language models to reason toward identity-congruent conclusions. Eight personas across four attributes are tested on eight models using misinformation-headline veracity and numeric scientific-evidence tasks adapted from human-subject research.

## Main findings

Persona assignment reduced headline veracity discernment by as much as 9 percent. Political personas were up to 90 percent more likely to evaluate gun-control evidence correctly when the ground truth matched the induced identity, while the tested prompt debiasing methods were largely ineffective.

## Assessment relevance

`Generative_KI`, `Prompting` and `Bias_Ungleichheit` are central. `Gender` and `Diversitaet` are directly relevant because gender and sociodemographic personas are tested and their categorical simplification is acknowledged. `Fairness` is relevant through mitigation evaluation.

## Limitations

The study uses two reasoning tasks, simple demographic personas and binary gender categories. It does not establish prevalence across richer profiles, intersectional identities or other reasoning settings.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
