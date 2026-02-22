---
title: Policy advice and best practices on bias and fairness in AI
authors:
  - J. M. Alvarez
  - A. Bringas Colmenarejo
  - A. Elobaid
  - S. Fabbrizzi
  - M. Fahimi
  - A. Ferrara
  - 
  - S. Ruggieri
year: 2024
type: journalArticle
url: https://link.springer.com/article/10.1007/s10676-024-09746-w
doi: 10.1007/s10676-024-09746-w
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
  - Algorithmic Discrimination
  - Intersectionality
mitigation_strategies:
  - Bias Mitigation
  - Debiasing
  - Bias Evaluation
---

# Policy advice and best practices on bias and fairness in AI

## Abstract

This open-access paper provides a comprehensive overview of fairness in AI, bridging technical bias mitigation methods with legal and policy considerations. Alvarez et al. survey the state-of-the-art in fair AI techniques and review major policy initiatives and standards on algorithmic bias. A key contribution is the NoBIAS architecture introduced in the paper, which comprises a “Legal Layer” (focusing on EU non-discrimination law and human rights requirements) and a “Bias Management Layer” (covering bias understanding, mitigation, and accountability). The authors note that AI systems have produced real-world harms, including illegal discrimination against protected groups, and they highlight challenges such as intersectional discrimination that current EU law does not explicitly address. By organizing existing knowledge and best practices, the article guides researchers and practitioners in aligning technical solutions with ethical and legal norms – underscoring that managing AI bias requires not just algorithmic techniques but also adherence to equality principles and governance frameworks.

## Key Concepts

### Bias Types
- [[Algorithmic Discrimination]]
- [[Discrimination]]
- [[Intersectionality]]

### Mitigation Strategies
- [[Bias Evaluation]]
- [[Bias Mitigation]]
- [[Debiasing]]

## Full Text

---
title: "Policy advice and best practices on bias and fairness in AI"
authors: ["Jose M. Alvarez", "Alejandra Bringas Colmenarejo", "Alaa Elobaid", "Simone Fabbrizzi", "Miriam Fahimi", "Antonio Ferrara", "Siamak Ghodsi", "Carlos Mougan", "Ioanna Papageorgiou", "Paula Reyero", "Mayra Russo", "Kristen M. Scott", "Laura State", "Xuan Zhao", "Salvatore Ruggieri"]
year: 2024
type: journalArticle
language: en
processed: 2026-02-04
source_file: Alvarez_2024_Policy_advice_and_best_practices_on_bias_and.md
confidence: 88
---

# Policy advice and best practices on bias and fairness in AI

## Kernbefund

The paper provides a comprehensive bird's-eye overview of fair-AI state-of-the-art and identifies critical gaps including the need for multi-stakeholder participatory design, intersectionality awareness, causal approaches to bias, knowledge-informed models, and bias monitoring across different domains and data types.

## Forschungsfrage

How can fair-AI methods, policies, and best practices be systematically surveyed and advanced to guide researchers and practitioners in managing bias and fairness in AI systems, particularly within the European Union legal context?

## Methodik

Multidisciplinary literature review combined with applied research findings from the NoBIAS project; conceptual framework development integrating legal, technical, and social perspectives on bias management.
**Datenbasis:** Literature review of fair-AI research; outputs from NoBIAS research project (15 Early-Stage Researchers across multiple institutions)

## Hauptargumente

- Bias in AI originates from three sources—pre-existing bias in data, technical bias in algorithm design, and emerging bias in organizational processes—and requires multidisciplinary approaches moving beyond pure technical optimization toward engagement with philosophical, legal, and social theories of equality.
- Fair-AI research has been dominated by technical metrics-focused approaches that isolate fairness from policy and civil society contexts; domain-specific, context-aware approaches involving multiple stakeholders are essential for meaningful bias mitigation.
- Critical but under-addressed challenges include intersectionality (where debiasing for one group can exacerbate marginalization of subgroups), the 'debiasing paradox,' causal reasoning requirements, bias in unsupervised learning and graph mining, and temporal monitoring of bias distribution shifts.

## Kategorie-Evidenz

### Evidenz 1

Paper discusses need for 'novel researchers and practitioners' to develop 'bird's-eye guidance' and addresses education/awareness gaps: 'increase awareness on bias and fairness in AI' and criticizes 'low-resource methods' framing that treats underrepresentation as data scarcity rather than preventive design.

### Evidenz 2

Covers multiple AI subdisciplines: supervised ML, unsupervised learning, reinforcement learning, NLP, computer vision, speech processing, recommender systems, knowledge representation, graph mining, and large language models.

### Evidenz 3

Explicit application to public employment services: 'NoBIAS project contributed in Scott et al. (2022) to a participatory approach in the design of algorithmic systems in support of public employment services,' directly relevant to social work contexts of job placement and welfare administration.

### Evidenz 4

Central focus throughout: 'concerns have been raised about the—intentional or unintentional—negative impacts on individuals and society due to biases embedded in AI models' with emphasis on 'illegal discrimination against social groups protected by non-discrimination law' and structural inequality reinforcement.

### Evidenz 5

Extensively addresses representation and inclusion: 'involving interested communities during the whole development process,' concerns about 'underrepresentation of social minorities,' 'representation bias,' diverse groups in AI design, and explicit discussion of intersectionality as key challenge.

### Evidenz 6

Core subject matter: defines fair-AI as 'designing methods for detecting, mitigating, and controlling biases in AI-supported decision making' with detailed discussion of fairness metrics (group fairness, individual fairness, causal fairness), bias detection, pre/in/post-processing mitigation approaches, and monitoring methods.

## Assessment-Relevanz

**Domain Fit:** Highly relevant for AI-Social Work intersection, particularly for understanding how algorithmic systems affect vulnerable populations in welfare, employment, and social services contexts. Addresses policy frameworks necessary for responsible AI deployment in socially sensitive domains. Limited explicit engagement with social work theory but strong practical relevance.

**Unique Contribution:** Synthesizes fair-AI state-of-the-art while centering previously under-theorized challenges (intersectionality, debiasing paradox, multi-stakeholder design, causal reasoning, non-i.i.d. data) and grounds recommendations in EU legal context through the NoBIAS project's multidisciplinary architecture.

**Limitations:** Focus on EU legal context may limit applicability to other jurisdictions; limited empirical validation of proposed best practices; does not deeply engage with social work theory or practice-based perspectives on algorithmic justice.

**Target Group:** AI researchers and practitioners, policymakers, EU regulatory bodies, social workers and human services organizations implementing AI systems, algorithmic auditors, human-centered AI designers, computer scientists, legal scholars, social scientists studying algorithmic discrimination

## Schlüsselreferenzen

- [[Pedreschi_et_al_2008]] - Pioneering fair-AI work on discrimination in machine learning
- [[Kamiran_Calders_2009]] - Fair-AI foundational research
- [[Mittelstadt_et_al_2023]] - Critique of isolated bias mitigation approaches lacking policy engagement
- [[Scott_et_al_2022]] - Algorithmic tools in public employment services: Jobseeker-centric perspective
- [[Smirnov_et_al_2021]] - Debiasing paradox in quota-based approaches
- [[Pearl_2009]] - Structural Causal Models and Perlian Causality framework
- [[Olteanu_et_al_2019]] - Bias categorization in social data
- [[Ovalle_et_al_2023]] - Intersectionality in AI bias mitigation
- [[Shahbazi_et_al_2023]] - Representation bias in data: identification and resolution
- [[Gallegos_et_al_2023]] - Bias in large language models
