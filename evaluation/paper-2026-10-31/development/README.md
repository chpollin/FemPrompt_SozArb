# Development comparison, 31 October 2026

Each procedure was executed once on the same three frozen development texts in a fresh producer context. [The run record](run-record.json) identifies prompts, source hashes, producers, reviewers and deviations. Original candidates remain unchanged. The experiment produces concrete analytical candidates and correction needs, not validated paper findings.

| Procedure | Concrete contribution | Review finding |
|---|---|---|
| [Structured extraction](extraction/original.md) | Separates source recommendations, source experiments and analyst transfer. Preserves the prompting paper's difference between aggregate CoT results and category-specific exceptions. | [Review](extraction/review.md) identifies an overstated gender-classification claim, bundled measures and an SQ1 matrix that mixes adjacent sectors with actual social-work settings. |
| [Open themes](themes/original.md) | Connects data selection, participation, institutional influence and decisions about what an outcome measure counts. | [Review](themes/review.md) requires distinguishing stereotype criticism from refusal, weakening an unsupported necessity claim, and completing one source chain. |
| [Framing analysis](framing/original.md) | Separates societal harm, agenda-setting and measured stereotypical responses as different problem definitions and success criteria. | [Review](framing/review.md) limits a proposed power-transfer reading and identifies missing theoretical qualifications and correlation evidence. |

## Concrete corrections

The extraction says that binary categories exclude gender fluidity. Its source says they reduce the potential to reflect it. The appropriate correction preserves that weaker scope. The thematic candidate discusses refusal where the source describes stereotype-aware answers; these response types require separate coding. The framing candidate offers comprehensive power transfer as an alternative reading despite insufficient evidence of institutional decision rights; it should be marked as the analyst's normative extension.

All three candidates notice a tension between the prompting paper's abstract and aggregate results. The reviewers confirm that the text supports the aggregate CoT finding while retaining category-specific exceptions. The source's missing figures prevent independent checking of the numerical effects. Agreement across these candidates is not an accuracy estimate, and two cross-reviewers had prior exposure to a different procedure's output.

## Prompt changes

[Version 2](../prompts/v2/status.json) is an untested draft based on development observations and their reviews. It requires complete source headers for evaluation, distinguishes full reading from publication completeness, defines atomic evidence units, preserves graded language, separates adjacent sectors from social-work settings, requests explicit handling of conflicting aggregation levels and requires source-motivated alternative readings. References for every synthesis component are explicit. The original prompts and held-out run plan remain preserved.

The coordinator's approximate word limit constrained the first runs. Future extraction must use recorded continuations rather than compressing distinct measures into one unit. A new development run should test these changes before final prompt freeze. Exact runtime model identity was not exposed in this harness, so these agent trials cannot be represented as reproducible provider-configuration benchmarks.

## Interpretation for the paper

My provisional recommendation is to use structured extraction as the common evidence table, open themes to discover relationships and gaps not covered by that table, and framing analysis to assess what different sources mean by bias, responsibility and successful mitigation. Each interpretative step retains its source chain. This recommendation follows the observed outputs and correction burden; it is not an empirically established ranking of procedures.

[Source QC](../source-qc.md) found missing or unresolved evidence in the held-out inputs. Repair those sources and establish equal input scope before evaluation. Human reference creation and adjudication remain unperformed. No substantive evaluation-source findings were passed into development prompts.

## Technical verification

Development input, prompt and output hashes were checked against the recorded files. JSON syntax, local report links and tracked-path limits passed. The new experiment artifacts were absent from the result-site build. `npm run build` and `npm run check` completed successfully. These checks establish technical consistency, not scholarly acceptance. The build refreshed the existing human-reviewer fingerprint in its generated manifest without changing screening decisions.
