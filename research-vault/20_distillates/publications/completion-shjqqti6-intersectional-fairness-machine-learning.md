---
type: distillate
source-type: publication
reference: SHJQQTI6
record-id: SHJQQTI6
work-id: work:6ef2b617-d42a-5df1-b3d6-081bec49e4a2
version-id: version:8c9eb11a-47da-5afe-8a50-a00659cb9455
version-type: unknown
topics:
- '[[Artificial Intelligence]]'
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
  path: corpus/source-acquisition/completion-20260921/SHJQQTI6-reading.md
  sha256: sha256:3ff6ed0113e1c1f4eb3d1447f5b3bf2a7fa03a7195345560215a6cb070d36c76
  version-id: version:8c9eb11a-47da-5afe-8a50-a00659cb9455
  version-type: unknown
  source-url: https://www.ijcai.org/proceedings/2023/742
  is-preferred-version: true
  boundary: The complete publisher conversion is supplemented by attributed reconstructions of the equations, table and semantic figure descriptions. Independent visual conversion QC accepts this representation for text assessment. Original figure layout and specialist mathematical copy-editing remain outside that check.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/SHJQQTI6-kd-final-r2.json
  sha256: sha256:34eb126f949cf8ad48e21c9569e0571c81a0a4f1072235d4e9153d5dd3a2c892
---

# Distillate: A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges

The survey organises computational definitions and mitigation methods for intersectional fairness in machine learning. It shows why fairness measured for single protected attributes can conceal discrimination at their intersections and identifies data sparsity, subgroup selection and weak real-world evaluation as persistent problems.

## Core statements

- A model may satisfy fairness criteria for separate demographic groups while remaining unfair to people located at their intersections. ^s1
  > "Specifically, an ML predictor might be fair w.r.t the independent groups but not intersectional groups ." (10.24963/ijcai.2023/742, section 1)
- The survey distinguishes subgroup, calibration-based, metric-based, differential, max-min and probabilistic approaches to intersectional fairness and reviews mitigation with and without demographic attributes. ^s2
- Computationally convenient subgroup definitions can exclude small groups and reproduce the fairness gerrymandering they seek to prevent. ^s3
  > "This highlights the need for a broader involvement of stakeholders to design notions and not simply rely on computational methods." (10.24963/ijcai.2023/742, section 2.7)
- Empirical evaluation remains limited, especially for the subgroups that formal notions fail to protect. ^s4
  > "Intersectional notions proposed for handling biases have mostly been explored theoretically, with little evidence of their effectiveness on real-world datasets, especially in evaluating the subgroups they fail to protect." (10.24963/ijcai.2023/742, section 6)

## Research question and method

The survey asks how intersectional fairness is defined and mitigated in machine learning, which computational trade-offs distinguish existing approaches and which research gaps remain. It reviews representative literature and presents a taxonomy of fairness notions and fair-learning methods. The survey covers subgroup fairness, multicalibration, metric fairness, differential fairness, max-min fairness and probabilistic fairness, followed by mitigation using demographic attributes or proxy structure. It also reviews applications in natural-language processing, ranking, visual analytics and datasets. The paper does not describe a systematic-search protocol or meta-analysis.

## Main findings

Intersectional fairness expands evaluation from separate protected groups to overlapping identities. The reviewed methods manage the potentially large number of groups through structural restrictions, calibration classes, similarity metrics, worst-group objectives or probabilistic relaxation. These choices trade computational feasibility against the protection of small or sparsely represented subgroups.

Mitigation methods may audit identified subgroups, constrain learning, reweight worst-performing groups or infer latent subgroup structure when demographic information is unavailable. None removes the underlying problem that missing or small groups may remain unprotected. The survey calls for inclusive datasets, stakeholder participation in subgroup definition, generalisable mitigation, auditing test cases, causal analysis of bias propagation and real-world evaluation of fairness notions.

## Assessment relevance

`KI_Sonstige`, `Bias_Ungleichheit`, `Diversitaet` and `Fairness` are central because the survey concerns machine-learning discrimination across intersecting protected groups and technical approaches to measuring and mitigating it. `Gender` is substantive because intersections of gender with race and other identities recur in the definitions, applications and evaluation examples. `Feministisch` is relevant under the controlled category definition because the paper uses intersectionality following Crenshaw as a sustained analytical framework for discrimination across race and gender. It does not analyse social-work practice. Generative AI and language models appear only among application examples, so `Generative_KI`, `Prompting`, `Soziale_Arbeit` and `AI_Literacies` are not substantive topics.

## Limitations

The survey selects representative literature without reporting a reproducible search or inclusion process. It focuses mainly on classification, natural-language processing and ranking, and it explicitly notes that many fairness notions have limited real-world evidence. Its technical taxonomy does not itself establish that a chosen metric or mitigation produces social justice. The reading source contains attributed reconstructions of the equations, dataset table and semantic figure descriptions, independently compared with the publisher PDF. The descriptions do not reproduce visual layout or colour encoding, and specialist mathematical copy-editing remains open. The claims in this document follow the survey prose and do not infer additional quantitative results from the reconstructed figures.

## Review boundary

This document was prepared from the source representation identified in its metadata. Current review state and supporting receipt are recorded in frontmatter. AI review does not establish domain-expert verification or publication approval.
