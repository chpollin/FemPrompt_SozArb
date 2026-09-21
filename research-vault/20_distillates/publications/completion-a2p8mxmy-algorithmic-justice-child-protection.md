---
type: distillate
source-type: publication
reference: A2P8MXMY
record-id: A2P8MXMY
work-id: work:9cbefba0-b92b-59a3-8595-a1ac5e9fca72
version-id: version:4c9dae5b-4429-5d97-81f6-764be7b98368
version-type: version_of_record
topics:
- '[[Artificial Intelligence]]'
- '[[Social Work]]'
- '[[Fairness]]'
status: ai-agent-reviewed
checked:
  quote: 2026-09-21
  validation: '2026-09-21'
  ai-agent-review: '2026-09-21'
created: 2026-09-21
updated: '2026-09-21'
prepared-by:
  agent-id: /root/knowledge_completion
  model: gpt-5.6-sol
  prepared-at: 2026-09-21
  artifact-review-status: ai-agent-reviewed
source-representation:
  path: generated/markdown_clean/A2P8MXMY.md
  sha256: sha256:d32cb4bb6e523b1930be2d9ff12d1b78ef1790886d02c13a2014c56e0ca0b025
  version-id: version:4c9dae5b-4429-5d97-81f6-764be7b98368
  version-type: version_of_record
  source-url: https://www.mdpi.com/2076-0760/8/10/281
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound Markdown conversion, including the linearised article text and references. Figures were present only as image placeholders and were not independently inspected. The source binding received a separate identity review, while this distillate remains unreviewed.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/A2P8MXMY-authority.json
  sha256: sha256:d5c5d19a7da1a81e313b77cb022b5e83fcb3c325f1ed01de98fb739598c05859
---

# Distillate: Algorithmic justice in child protection

The article critically examines predictive algorithms in child protection by connecting statistical fairness problems with social justice, rights and the conditions of social work practice.

## Core statements

- Administrative child-protection data do not represent the population incidence of abuse. Reporting, surveillance, service access and institutional decisions shape who enters the data and which outcomes become training labels. ^s1
- Predictive systems can reproduce racial and class inequalities when proxy outcomes, feedback loops and correlations carry existing system disparities into individual risk scores. ^s2
  > "Interrogating these assumptions highlights not the creation of inequalities in child protection systems by algorithmic tools, but the reproduction and reification of existing ones." (10.3390/socsci8100281, section 6)
- Statistical fairness criteria do not settle the rights questions raised by child-protection decisions. Due process, participation, consent and the right to challenge an inference remain relevant because interventions concern identifiable families. ^s3
- Social workers can become responsible for decisions shaped by tools they cannot explain. Implementation therefore has to preserve professional discretion and accountable human judgment. ^s4
  > "How tools are implemented and managed are crucial to assisting workers to maintain ultimate control for decisions made." (10.3390/socsci8100281, section 10)
- The source concludes that claims drawn from the available data should remain tentative because the target outcome is socially produced, incompletely observed and changed by intervention. ^s5
  > "the 'reasonable inference' services users have a right to, may be remarkably tentative in child protection." (10.3390/socsci8100281, section 13)

## Research question and method

The article asks which statistical fairness problems arise when predictive algorithms use child-protection data, which justice and rights issues follow, and what their use means for families and social workers. It is a critical conceptual analysis grounded in research on predictive risk modelling, child-protection decision making, algorithmic fairness and social-work ethics. It examines the sample frame, predictive parity, socially produced outcomes, feedback loops, professional responsibility, family participation, consent and reasonable inference. It does not report a new empirical study.

## Main findings

Child-protection records are a selective trace of reports, investigations and institutional judgments. Unequal surveillance and differences in reporting or service provision can therefore become model features or outcomes even when they do not reflect different incidence of abuse. Feedback cannot fully correct this problem because outcomes for screened-out families remain partly unobserved and intervention changes the events that later appear in the record.

The article also shows why technical fairness measures remain incomplete in this setting. A metric can redistribute false positives and false negatives across groups without resolving whether the underlying proxy, intervention threshold or institutional response is just. Families face consequences from scores that describe group-level correlations, while opaque tools can weaken participation and explanation. Social workers remain professionally and legally accountable even when an algorithm materially shapes the decision.

## Assessment relevance

`KI_Sonstige` is central because the article concerns predictive analytics and algorithm-assisted decisions in child protection. `Soziale_Arbeit` is central through its focus on child-protection practice, professional responsibility and family participation. `Bias_Ungleichheit`, `Diversitaet` and `Fairness` are central because the analysis examines racial, ethnic, Indigenous and class inequalities, group disparities and competing fairness criteria. The article mentions gender as one possible inequality axis but does not conduct an explicit gender analysis. It does not study generative AI, prompting, AI literacy or a feminist method.

## Limitations

The contribution synthesises conceptual and empirical literature available in 2019 rather than evaluating a newly deployed model. Several examples rely on administrative proxies and evaluations whose outcome definitions the article itself criticises. Its conclusions therefore identify mechanisms and rights concerns, while their size and operation depend on jurisdiction, dataset, institutional workflow and tool design. The article concentrates on Anglophone child-protection systems and does not establish the performance of any one system across later deployments.

## Review boundary

This document was prepared from the source representation identified in its metadata. The current review state and its supporting receipt are recorded in the frontmatter. AI review does not establish domain-expert verification or publication approval.
