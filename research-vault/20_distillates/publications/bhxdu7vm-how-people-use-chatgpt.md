---
type: distillate
source-type: publication
reference: BHXDU7VM
record-id: BHXDU7VM
work-id: work:f01ca4fe-7f9b-59f6-98d9-4e84559cd850
version-id: version:8663473c-428f-5ffa-89b0-0b02502fe07d
version-type: working_paper
topics:
  - "[[Generative AI use]]"
  - "[[Gender and technology use]]"
status: preparation
checked:
  quote: 2026-09-21
created: 2026-09-21
updated: 2026-09-21
prepared-by:
  agent-id: /root/knowledge_documents
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: unreviewed
source-representation:
  path: generated/markdown_clean/BHXDU7VM.md
  sha256: sha256:49a17523925a989ed5903ded9a6fdd747176bfdc9355bfc80d0048246b364400
  version-id: version:8663473c-428f-5ffa-89b0-0b02502fe07d
  version-type: working_paper
  source-url: https://www.nber.org/papers/w34255
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound NBER working-paper Markdown representation and checked the quoted passages. The source states that NBER working papers are circulated for discussion and have not been peer reviewed. No separate scholarly review has occurred.
---

# Distillate: How people use ChatGPT

The working paper analyzes how consumer ChatGPT use grew and changed, what users ask the system to do, and how use varies across demographic, educational, and occupational groups. It relies on privacy-preserving automated classifications of internal usage data and aggregated external employment data.

## Core statements

- Non-work use grew faster than work use during the observation period. ^s1
  > "non-work messages have grown faster and now represent more than 70% of all consumer ChatGPT messages." (NBER Working Paper 34255)

- Three broad topics account for most classified consumer conversations. ^s2
  > "The three most common Conversation Topics are Practical Guidance , Seeking Information , and Writing , collectively accounting for about 77% of all ChatGPT conversations." (NBER Working Paper 34255)

- The study reports a marked narrowing in its first-name-based proxy for a gender gap in active use. ^s3
  > "This suggests that gender gaps in ChatGPT usage have closed substantially over time." (NBER Working Paper 34255)

- Message-level content was not inspected by the research team. ^s4
  > "No one looked at the content of messages while conducting analysis for this paper." (NBER Working Paper 34255)

## Research question and method

The paper asks how consumer ChatGPT is used, who uses it, how usage has diffused, and which forms of use may generate economic value. It combines total consumer-plan message counts with several samples of messages from May 2024 through July 2025. Five large-language-model classifiers assign work status, conversation topic, user intent, interaction quality, and Occupational Information Network work activities. The classifiers receive the selected message and limited preceding context after personally identifying information has been removed. Their prompts are mostly reproduced in the appendix and are validated against human annotations of public WildChat conversations.

The demographic analyses use self-reported age and country, first names matched to aggregated name-gender datasets, and coarsened education and occupation data obtained through a secure data clean room. The clean room allows only approved aggregate queries and suppresses groups below 100 users. The main classified-message sample excludes users who opted out of training use, users reporting an age below 18, deleted or banned accounts, and logged-out use.

## Main findings

Non-work messages rose from 53 percent of classified consumer messages in June 2024 to 73 percent in June 2025. Practical Guidance, Seeking Information, and Writing jointly accounted for roughly three quarters of classified conversations. Writing was the largest work-related topic, with most Writing requests modifying user-provided text. In the Asking, Doing, and Expressing taxonomy, Asking was the largest overall class and grew faster than Doing.

The first-name analysis found that roughly 80 percent of weekly active users in the early months had names typically classified as masculine. The corresponding share had fallen below half by June 2025. This measures name associations, not users' self-described gender identities. Users with names typically classified as feminine were relatively more likely to use Writing and Practical Guidance, while those with names typically classified as masculine were relatively more likely to use Technical Help, Seeking Information, and Multimedia.

Younger adults accounted for a large share of messages. Adoption grew particularly quickly in low- and middle-income countries. Users with more education and users in professional occupations sent higher shares of work-related messages. Across occupations, work use concentrated on obtaining and documenting information, interpreting information for others, decision-making, advice, problem-solving, and creative thinking.

## Assessment relevance

`Generative_KI` is central because the study measures use of a mass-market generative-AI chatbot. `Prompting` is relevant because prompt-defined classifiers are the study's principal measurement instruments and their validation is reported. `Gender` is central to the analysis of diffusion and topic differences using first-name associations. `Diversitaet` is relevant only in a limited descriptive sense through comparisons by country, education, age, and occupation. The study does not investigate social work, feminist methods, algorithmic fairness, or inequality mechanisms as its primary subject.

## Limitations

The study covers consumer ChatGPT plans and omits Business, Enterprise, Education, and most logged-out use. Message samples exclude several user groups and therefore do not represent all use. Automated labels inherit classifier error. Validation is based on a small public WildChat sample, and agreement is weak for interaction quality and moderate for some multiclass tasks. The employment dataset covers a subset of users with public records and may not represent the full user population.

Gender is inferred from first names in aggregated datasets. Ambiguous or conflicting names are excluded, and the measure neither records gender identity nor supports claims about nonbinary users. Country comparisons use registered location and internet-population denominators. The paper is an NBER working paper that explicitly states it has not undergone peer review or NBER Board review.

## Review boundary

This preparation was produced from the complete hash-bound local source. Quotations were checked. Its `preparation` status is unreviewed and grants no scholarly-review authority.
