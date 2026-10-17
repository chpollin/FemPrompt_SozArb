---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-17'
assertions:
  - "[[30_assertions/binary-gender-benchmark-defines-bias-through-task-performance]]"
  - "[[30_assertions/intersectional-ai-framing-connects-gender-to-power]]"
posits: 5
research-questions: [SQ4]
created: '2026-10-02'
updated: '2026-10-17'
---

# Conceptual grounding of gender and bias (SQ4)

The current coded subset more often records an explicit definition of bias than of gender. Its conceptual approaches include a binary operationalisation of bias in a word-counting benchmark and an intersectional account of identity, power and AI inequalities. The comparison is provisional. The mapping describes eligible agent coding, while the qualitative comparison below rests on two complete source texts read for this revision and linked through new, unreviewed Assertions.

SQ4 asks whether gender and bias are defined, how gender is understood and which theories frame the literature ([research questions](../../../knowledge/project.md#research-questions)). All four components are addressed below. This is an interim answer to the whole sub-question, not a complete qualitative synthesis of every eligible Work. No source selection, screening decision, canonical identity or verification state was changed.

## Coverage snapshot of 17 October 2026

The completion package was reproduced from the inspected repository state after rebuilding the ignored reading layer. Its SQ4 tables and field states are the quantitative sources. Counts refer to registered Works, which still include unresolved duplicates.

| Population or field state | Works |
|---|---:|
| Recorded Include denominator | 153 |
| Coded on all four SQ4 fields | 100 |
| Human and agent decision conflict | 25 |
| Missing eligible coding | 22 |
| Integrity or source hold | 2 |
| Stale source review | 2 |
| Not collected under the active older codebook | 2 |
| Total unresolved for SQ4 | 53 |

These are the `all` rows for the SQ4 fields in [field-states.csv](../../../generated/completion/field-states.csv). The identical coded Work-ID sets were compared across all four fields. A recorded Include is distinct from permission to use its analysis. No unresolved record is counted as having no gender definition or no theory.

The earlier draft described the pre-recode state with 85 coded Works and 19 not-collected Works. The current files supersede that description. The remaining not-collected Works are *Towards Substantive Equality in Artificial Intelligence* (`XIYX5HJS`, `DWS4KXBW`) and *Gender und KI-Anwendungen* (`BDI6XU5A`, `JFDBPUBN`). Their older coding remains eligible for fields it actually collected. The SQ4 fields remain unavailable pending exact-Version reconciliation and recoding ([plan](../../../knowledge/plan.md#analysis-tool-follow-ups)).

## Definitions and gender understandings

All values below come from [sq-analysis-tables.csv](../../../generated/completion/sq-analysis-tables.csv), question SQ4. Each field has the same denominator of 100 coded Works. Gender understanding is multi-valued.

| Definition state | Gender | Bias |
|---|---:|---:|
| Explicit | 13 | 46 |
| Implicit_Only | 40 | 51 |
| Absent | 10 | 1 |
| Not_Applicable | 37 | 2 |

| Gender understanding | Works |
|---|---:|
| Binary_Categorical | 27 |
| Social_Construct | 17 |
| Non_Binary_Inclusive | 15 |
| Intersectional | 23 |
| Unclear | 10 |
| Not_Applicable | 37 |

The explicit-definition contrast therefore survives the recode as a description of coding. It establishes no population prevalence. `Not_Applicable` means that the field is outside the Work's coded subject, while `Absent` records that the relevant definition was not identified under the codebook.

The complete coded Work records show that every `Binary_Categorical` code occurs with `Implicit_Only`, and none with `Explicit`. This is an observed cross-classification, not an absence claim about the literature. The codebook itself defines `Binary_Categorical` as two fixed categories that the Work does not examine. This makes the result sensitive to the operational definitions and prevents interpreting it as an independent test of research traditions.

## Source-grounded conceptual comparison

Kaneko et al. (2024) operationalise bias through a performance difference when gender-associated occupational words are added to feminine and masculine word lists. They explicitly limit the evaluation to binary gender and caution that a low benchmark score does not establish freedom from bias. The conceptual object is a bounded property of test performance. This is supported by the [benchmark Assertion](../../30_assertions/binary-gender-benchmark-defines-bias-through-task-performance.md), grounded in section 2, Limitations and the Ethics Statement of the read preprint.

Ulnicane (2024) adopts intersectionality to examine identity categories in relation to power, oppression and social hierarchy. Her analysis of four policy-oriented reports links workforce discrimination and biased AI systems as systemic concerns. She also shows that a non-binary conceptual position can coexist with binary and geographically restricted data. The article uses a framing approach and limits its conclusions to the examined reports and their context. The [framing Assertion](../../30_assertions/intersectional-ai-framing-connects-gender-to-power.md) anchors these statements in sections 2.1, 2.2, 3.1, 3.3 and 4.

The existing SQ4 coding records the benchmark as `Implicit_Only` for gender, `Binary_Categorical`, `Explicit` for bias and `No` for a framing theory. It records the framing article as `Explicit` for gender, `Social_Construct` and `Intersectional`, `Implicit_Only` for bias and `Yes` for theory. The read passages support this contrast at the level described above. Whether the framing article's adoption of socially constructed identity categories meets the exact threshold for an explicit gender definition remains a domain-expert judgement.

Taken together, these texts suggest that an explicit operational criterion for bias and a developed account of gender answer different conceptual questions. This is an interpretation of this draft, not a causal finding or an exhaustive typology. Neither text evaluates an LLM intervention in social-work practice. Their value for SQ4 is conceptual, and transfer to that practice remains to be established.

## Theory references

The generated SQ4 table records a named theory reference in 58 of 100 coded Works and no reference meeting the codebook criterion in 42. This field alone does not identify which theory is used, whether it is applied consistently or whether the Work's definition is adequate.

A read-only cross-tabulation of the same eligible Work IDs gives the following snapshot.

| Bias definition | Theory Yes | Theory No |
|---|---:|---:|
| Explicit | 27 | 19 |
| Implicit_Only | 31 | 20 |
| Absent | 0 | 1 |
| Not_Applicable | 0 | 2 |

The similar shares in the first two rows do not demonstrate statistical independence. The prior draft's independence claim has been removed. No significance test or causal inference is made.

Intersectionality and framing analysis are directly established in the read article by Ulnicane (2024). The earlier theory-family ranking was compiled from coding-review notes before the recode. It has not been reproduced or checked against all contributing full texts in this revision and is not presented as a current result. A complete answer about the distribution of named theories needs the remaining source-based Assertion work and review.

## Effects of unresolved decisions

### Exact source Versions and holds

The two not-collected Works above lack the SQ4 fields in their eligible older coding. Their open exact-Version recode assignments prevent treating a newly read or preferred expression as if it already supplied current reviewed SQ4 coding.

The two stale-review Works are *Examining risks of racial biases in NLP tools for child protective services* (`C8A7TXTF`, `R7V99ERA`) and *How child welfare workers reduce racial disparities in algorithmic decisions* (`64ZCWCBS`, `7FEFMCBZ`). Their historical reviews do not automatically transfer to the currently bound representations.

The hold set contains *Towards a Feminist Metaethics of AI* (`LT3D3ZQ2`) and the cultural-bias systematic-review Work (`5UAHQESQ`, `6MJYP7ZX`, `EHQBHVYV`). The former has the documented ACM/arXiv expression mismatch, and the latter retains an unresolved expression relationship to the withdrawn arXiv material. Their stored codes are not admissible SQ4 evidence while held. Details and governing decisions remain in [data](../../../knowledge/data.md#bibliographic-questions-requiring-reconciliation) and [plan](../../../knowledge/plan.md#works-with-conflicts-or-holds).

### Duplicate identities

Hash comparison of the available reading texts for the coded Works identifies three pairs of registered Works sharing byte-identical texts.

| Reading records | Title | Effect |
|---|---|---|
| GP4JDSI8 / D2EGAVKZ | Data Feminism for AI | Both carry identical SQ4 codes, including an explicit gender definition and all three critical understanding values |
| HLBXNWAZ / YLAKP7Z2 | Intersectional analysis of visual generative AI | Both carry the same SQ4 codes as each other |
| YN9JAREI / 4KMMPA6A | Faires KI-Prompting | Both carry implicit gender, explicit bias and no theory, but only YN9JAREI carries Intersectional in addition to Binary_Categorical |

As a sensitivity calculation only, retaining one text per pair gives 97 text units, 11 explicit gender definitions, 45 explicit bias definitions and 56 theory references. Binary categorical understanding becomes 26, social construct 15 and non-binary inclusive 13. Intersectional becomes either 20 or 21 depending on which existing coding of the guide is retained. The three removed rows and unchanged cases can be reconstructed from the Work IDs in the current completion package and the pairs above.

This calculation creates neither a new corpus denominator nor a merge decision. Identical text does not settle publication identity or the appropriate coding. The guide's disagreement requires adjudication before a consolidated code is defensible. The explicit-definition contrast remains under either scenario, while exact frequencies remain provisional.

### Screening and missing evidence

The 25 human/agent decision conflicts are a different source of uncertainty. Choosing an eligible expression or consolidating a duplicate cannot settle them. Domain-expert screening governs inclusion, and a human screening decision would still not verify the SQ4 interpretation.

The 22 Works in the missing state have no eligible SQ4 coding in this package. Their current reason is recorded per Work, and this revision makes no renewed claim that all lack an obtainable full text. The unresolved set is not assumed random. Neither an empty cross-tabulation cell nor a code absent from the eligible subset establishes a gap in the literature.

## Decision points and completion boundary

| Required judgement | Evidence | Recommendation and consequence |
|---|---|---|
| Which expressions should support the remaining recodes? | Exact-Version cases above and the existing plan | Resolve each source relationship before recoding. Until then retain older coding only for its collected fields |
| Which registered Works should be consolidated? | The three identical-text pairs and the guide's conflicting Intersectional code | Decide Work identity with retained provenance, then adjudicate the guide. Without a decision, report registered-Work counts and sensitivity separately |
| How should human/agent screening conflicts be resolved? | The 25 Work IDs in `conflict_decision_work_ids` of the SQ4 field-state rows | Domain experts decide inclusion per Work. Keep these Works outside the eligible mapping until reconciled |
| Does adopted social-category theory qualify as an explicit gender definition? | Ulnicane (2024), sections 2.1 and 3.3, and the existing codebook boundary questions | Include this source in the expert spot check. Do not silently recode it or change the rule in this assignment |

The complete local Markdown texts of the two cited works were read. Their short quotations, source identities, current coding eligibility and Assertion anchors were checked. The new distillates, Assertions and chapter were prepared and checked by the same session. They have no independent AI Agent Review, no domain-expert verification and no publication approval. The existing PRISM setup test of 17 October was read and not repeated. SQ1, SQ2, SQ3 and SQ5 remain outside this first answer revision.
