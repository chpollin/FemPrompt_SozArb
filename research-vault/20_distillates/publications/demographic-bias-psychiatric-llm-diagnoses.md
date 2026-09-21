---
type: distillate
source-type: publication
reference: UGN4TS5R
record-id: UGN4TS5R
work-id: work:e62005d4-d179-5cef-af39-3aca00c24a04
version-id: version:26f29a81-72da-5a66-8302-ba39cafbae87
version-type: version_of_record
topics:
- '[[Generative AI]]'
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
  path: generated/source-acquisition/codex-websearch-2026/html-markdown/166a9834b422f052b7c5.md
  sha256: sha256:5568a06471911bf9d102f9caf87159966469807bd990ef8a837d52585de186f5
  version-id: version:26f29a81-72da-5a66-8302-ba39cafbae87
  version-type: version_of_record
  source-url: https://pmc.ncbi.nlm.nih.gov/articles/PMC13217584
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound Markdown source representation and checked the quoted passages. No separate AI source review or domain-expert verification has occurred.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/UGN4TS5R-authority.json
  sha256: sha256:439f94b34256eceaf50284064666b750d2e55f2c7360e641b2076f1b817e3292
---

# Distillate: Implicit Gender, Racial, and Ethnic Biases in Large Language Models: An Audit Study of Automated Psychiatric Diagnoses

The audit varies implicit gender and racial or ethnic identity while holding psychiatric case content constant across several large language models. It finds differences in diagnostic accuracy, overdiagnosis, diagnostic patterns and descriptions.

## Core statements

- The audit varies implicit gender and racial or ethnic identity while holding psychiatric case content constant across several large language models. ^s1
  > "To evaluate whether large language models (LLMs) exhibit implicit gender, racial, and ethnic biases" (10.1016/j.mcpdig.2026.100344)

- The study warns that automated psychiatric decision support can reproduce harmful differential treatment and requires caution and vigilance. ^s2
  > "Given these biases, we urge caution and vigilance when using LLMs in psychiatric clinical decision support." (10.1016/j.mcpdig.2026.100344)

## Research question and method

The audit asks whether implicit gender and racial or ethnic identity changes psychiatric diagnoses when symptoms are held constant. It systematically varies identity cues across clinical cases and compares several general and medical language models against recorded diagnoses.

## Main findings

Models differed in overall accuracy and produced demographic differences in overdiagnosis, diagnosis types and descriptive language. GPT-4o had the highest reported rate of identifying at least one recorded diagnosis, while qualitative analysis found potentially harmful descriptions for minority patients.

## Assessment relevance

`Generative_KI`, `Bias_Ungleichheit`, `Gender`, `Diversitaet` and `Fairness` are central because generated diagnoses are audited across demographic identities. `Prompting` is methodological, not the main research object. Social work is absent.

## Limitations

Holding symptoms constant isolates differential model treatment but cannot represent culturally varying symptom presentation. Recorded diagnoses are an imperfect reference, and simulated decision support does not establish clinical outcomes.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
