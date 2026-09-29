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
  quote: '2026-09-29'
  validation: '2026-09-29'
  ai-agent-review: '2026-09-29'
created: 2026-09-21
updated: '2026-09-29'
prepared-by:
  agent-id: claude-code/kd-revision-producer-2
  model: claude-opus-5-5
  prepared-at: 2026-09-29
  artifact-review-status: ai-agent-reviewed
revised-by:
  agent-id: claude-code/orchestrator
  model: claude-opus-5-5
  revised-at: 2026-09-29
  basis: corpus/knowledge-reviews/2026-09-29/Z9DNTBFF-reading-kd.json
source-representation:
  path: corpus/source-acquisition/completion-20260921/Z9DNTBFF-reading.md
  sha256: sha256:588046a149fe3426fdf07d03c77097a212b60da2578e5747ad8b9e8c08b4f910
  version-id: version:5cc89bf8-9652-519b-9e31-d77a07848330
  version-type: version_of_record
  source-url: https://aclanthology.org/2022.gebnlp-1.10/
  is-preferred-version: true
  boundary: The complete Version of Record text retains source-specific attribution and independently checked repairs to the six displayed equations, the Table 1 score column, the Table 2 row alignment and the Table 3 probabilities, with Figures 2 to 5 measured on their embedded rasters. A second independent conversion QC accepts the corrected reading copy for text assessment. Figure values are plot readings rather than values reported by the authors. The five figure rasters are bound as hash-bound CC BY 4.0 reading assets, while the photographs of Figure 1 and Tables 1, 3 and 4 are described and not reproduced.
source-review:
  path: corpus/knowledge-reviews/2026-09-29/Z9DNTBFF-reading-kd-final.json
  sha256: sha256:bf34fd49159a438ad3fd3996cb5aca75ef111921c478f25aec8e815bbc1c2744
---

# Distillate: Worst of Both Worlds: Biases Compound in Pre-trained Vision-and-Language Models

The paper extends masked-language-model bias probes to a vision-and-language model and examines how pre-training, textual gender cues and visual gender cues interact. Its case study shows examples in which learned stereotypes override the object visible in an image.

## Core statements

- The study treats reliance on stereotypical gender cues as a source of representational harm that may displace relevant input evidence. ^s1
  > "Relying on stereotypical cues (learned from biased pre-training data) can cause the model to override visual and linguistic evidence when making predictions." (10.18653/v1/2022.gebnlp-1.10, section 2)
- The method distinguishes bias from vision-language pre-training, language context and visual context. ^s2
- In the two examples of Table 3, VL-BERT gives the stereotypically gendered bag a higher probability than the bag shown in the image. ^s3
  > "In both cases, the model's gender bias overrides the visual evidence (the entity)." (10.18653/v1/2022.gebnlp-1.10, section 4.4)
- The authors identify their binary treatment of gender as a serious limitation and call for more inclusive probes and data. ^s4
  > "Gender is not binary, but this work performs bias analysis for the terms 'male' and 'female' - which are traditionally proxies for cis-male and cis-female." (10.18653/v1/2022.gebnlp-1.10, section 7)

## Research question and method

The paper asks how vision-language pre-training changes gender associations and whether gender cues in visual and linguistic inputs influence predictions. It adapts a template-based masked-language-model method to VL-BERT and compares its associations with text-only BERT. An association score is the log ratio of the masked-entity probability with a gendered agent to a normalising probability, and the bias score of an entity is its female minus its male association score, so positive values indicate a female and negative values a male bias. The study separates pre-training, language-context and visual-context associations. A controlled case study covers three entity pairs of clothing, bags and drinks, each entity with six images of men and six of women. A second analysis compares the text-only bias scores of VL-BERT and BERT for 40 entities that a majority of ten surveyed people labelled as stereotypically masculine or feminine.

## Main findings

The case study finds that pre-training and both input modalities can shift model associations. The authors conclude that pre-training shifts the case-study entities towards men. In Figure 3 the language scores for purse are about 0.86 with a female and about -1.15 with a male agent, and briefcase, apron and beer also differ by agent gender, while suit and wine stay close to zero for both. In Figure 4 every visual score is positive, so an image containing the entity raises the model's confidence in it for both genders. The rise is larger with women for purse (about 2.55 against 0.45) and apron (5.59 against 4.72) and larger with men for briefcase (3.97 against 2.83) and beer (2.33 against 1.64).

The override statement rests on the two examples of Table 3. For a man holding a patterned bag, marked as the purse, the model assigns purse 0.0018 and briefcase 0.4944. For a woman holding a briefcase it assigns purse 0.084 and briefcase 0.067, a narrow margin. The paper reports no rate of such overrides. As a reading of this document, the aggregate visual scores show that the model uses visual evidence to different degrees by agent gender, while the override itself is documented only by selected examples.

The authors report that the VL-BERT bias scores of the broader entity set largely follow their stereotype labels. The Figure 5a readings bear this out for most entities, with four exceptions among the 39 legible labels. Bat (about 0.05) and aviator (about 0.57) are labelled masculine but plotted on the female side, and punch (about -0.85) and wine (about -0.44) are labelled feminine but plotted on the male side.

The authors read Figure 5b as a shift of most entities towards masculine association through vision-language pre-training. The largest shifts in that direction concern cat (about -1.41), jersey (-1.33), scarf (-1.25), whiskey (-1.17), beer (-1.05) and scotch (about -1.01). Seven dots lie on the other side, cigar (about 0.90), aviator (about 0.63) and five unlabelled entities between about 0.09 and 0.31. As an inference of this document, a shift towards men strengthens the masculine-labelled associations of jersey, whiskey, beer and scotch but weakens the feminine-labelled associations of cat and scarf, and it weakens the masculine association of cigar. The figure therefore supports a masculine skew added by pre-training rather than a uniform strengthening of every stereotype learned in language.

## Assessment relevance

`KI_Sonstige`, `Gender` and `Bias_Ungleichheit` are central because the paper studies gender stereotypes in a multimodal transformer. `Diversitaet` is relevant through the explicit limitation concerning nonbinary, gender-nonconforming and trans people and the call for inclusive probes and data. The paper measures model bias but does not analyse algorithmic-fairness criteria or mitigation systems, so `Fairness` is not established. It does not concern social work, generative-AI use, prompting practice, AI literacy or a feminist research method.

## Limitations

The study examines one vision-and-language architecture, English prompts and a restricted set of entities. Its operationalisation treats gender through male and female terms and selected images of self-identified male- and female-presenting people. The authors state that this binary design does not represent gender adequately. The broader stereotype labels come from a small survey. Two independent conversion QCs checked the repaired equations, tables and figure readings against the Version of Record, and the second accepted the corrected reading copy for text assessment. The figure values used here are readings of the embedded rasters rather than values reported by the authors. Figure 5a shows 39 legible labels although its caption names 40 entities, and most Figure 5b dots are unlabelled. The photographs of Figure 1 and Tables 1, 3 and 4 are described in the reading copy, not reproduced.

## Review boundary

This document was prepared from the source representation identified in its metadata. Current review state and supporting receipt are recorded in frontmatter. AI review does not establish domain-expert verification or publication approval.
