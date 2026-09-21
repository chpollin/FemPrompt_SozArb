---
type: distillate
source-type: publication
reference: Z9DNTBFF
record-id: Z9DNTBFF
work-id: work:ec94cf1c-87bf-5f4d-a840-9dd3b92eefab
version-id: version:5cc89bf8-9652-519b-9e31-d77a07848330
version-type: version_of_record
topics:
- '[[Artificial Intelligence]]'
- '[[Bias and Fairness]]'
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
  path: corpus/source-acquisition/completion-20260921/Z9DNTBFF.identity-bound.md
  sha256: sha256:729606223c6f936d78f837d285ae84f5d18f010b62af7dfa793cce64119fd3c0
  version-id: version:5cc89bf8-9652-519b-9e31-d77a07848330
  version-type: version_of_record
  source-url: https://aclanthology.org/2022.gebnlp-1.10/
  is-preferred-version: true
  boundary: The preparing agent read the complete hash-bound Docling conversion. Conversion QC for this representation was not complete at preparation time. Formulae were marked as not decoded, and figures and visual layout were not independently inspected. The source hash follows the repository artifact_hash contract, which normalises CRLF to LF for text files.
source-review:
  path: corpus/knowledge-reviews/2026-09-21/Z9DNTBFF-new-kd-hash-correction.json
  sha256: sha256:9ee52042803254d3de700471aa03b8c97d256ae401e344f27267d81df25cc867
---

# Distillate: Worst of Both Worlds: Biases Compound in Pre-trained Vision-and-Language Models

The paper extends masked-language-model bias probes to a vision-and-language model and examines how pre-training, textual gender cues and visual gender cues interact. Its case study indicates that learned stereotypes can override evidence in an image.

## Core statements

- The study treats reliance on stereotypical gender cues as a source of representational harm that may displace relevant input evidence. ^s1
  > "Relying on stereotypical cues (learned from biased pre-training data) can cause the model to override visual and linguistic evidence when making predictions." (10.18653/v1/2022.gebnlp-1.10, section 2)
- The method distinguishes bias from vision-language pre-training, language context and visual context. ^s2
- The reported analyses indicate that VL-BERT may follow gender stereotypes even when visual information points elsewhere. ^s3
  > "In both cases, the model's gender bias overrides the visual evidence (the entity)." (10.18653/v1/2022.gebnlp-1.10, section 4.4)
- The authors identify their binary treatment of gender as a serious limitation and call for more inclusive probes and data. ^s4
  > "Gender is not binary, but this work performs bias analysis for the terms 'male' and 'female' - which are traditionally proxies for cis-male and cis-female." (10.18653/v1/2022.gebnlp-1.10, section 7)

## Research question and method

The paper asks how vision-language pre-training changes gender associations and whether gender cues in visual and linguistic inputs influence predictions. It adapts a template-based masked-language-model method to VL-BERT and compares its associations with text-only BERT. The study separates pre-training, language-context and visual-context associations. A controlled case study covers stereotypically gendered clothing, bags and drinks, followed by analysis of a broader set of entities whose stereotypical labels were established through a small human survey.

## Main findings

The case study finds that pre-training and both input modalities can shift model associations. Language and visual cues about an agent's gender sometimes change the model's confidence in an entity, and the model can prefer a stereotypical association over the object visible in an image. The broader entity analysis is reported as consistent with the case-study pattern and suggests that multimodal pre-training compounds rather than resolves gender associations learned in language.

## Assessment relevance

`KI_Sonstige`, `Gender` and `Bias_Ungleichheit` are central because the paper studies gender stereotypes in a multimodal transformer. `Diversitaet` is relevant through the explicit limitation concerning nonbinary, gender-nonconforming and trans people and the call for inclusive probes and data. The paper measures model bias but does not analyse algorithmic-fairness criteria or mitigation systems, so `Fairness` is not established. It does not concern social work, generative-AI use, prompting practice, AI literacy or a feminist research method.

## Limitations

The study examines one vision-and-language architecture, English prompts and a restricted set of entities. Its operationalisation treats gender through male and female terms and selected images of self-identified male- and female-presenting people. The authors state that this binary design does not represent gender adequately. The broader stereotype labels come from a small survey. Conversion QC remained incomplete during preparation. Formulae were not decoded, and figures and visual examples were not independently inspected. This distillate therefore avoids quantitative claims that depend on figures or tables.

## Review boundary

This document was prepared from the source representation identified in its metadata. Current review state and supporting receipt are recorded in frontmatter. AI review does not establish domain-expert verification or publication approval.
