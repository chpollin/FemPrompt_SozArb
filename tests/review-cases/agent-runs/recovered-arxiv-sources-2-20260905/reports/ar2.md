# recovered-arxiv-sources-2-20260905 · ar2

- Akteur: agent; actor type: ai_agent; actor ID: /root/source_reviewer_b.
- Actual model: OpenAI GPT-6 family. The exact deployment ID/version is not exposed by this runtime; no immutable model ID is claimed.
- Actual start (UTC): 2026-09-05T19:03:25Z.
- Actual completion (UTC): 2026-09-05T19:11:09.670Z.
- Zuweisung, in binding order: RAY6G2R7, SQYLQFRU.
- Coding-Paket: tests/review-cases/agent-runs/recovered-arxiv-sources-2-20260905/tracks/ar2-coding.json.
- Quellenbasis: complete assigned original-source HTML text extractions, including references and all appendices, plus every declared original PNG viewed with view_image at original detail.
- Ergebnis: bestanden.
- Verteilung: Include 1 · Unclear 0 · Exclude 1 · Blockiert 0.
- Isolation: this reviewer context used the frozen rules, its assignment, assigned Paper texts/images, the analysis vocabulary, the coding validator, and its own outputs. No other reviewer judgments, tracks, knowledge distillates, productive screening files, previous runs or source-QC reports were inspected. Operational separation carries no epistemic independence claim.

## Rules and hash verification

Read in full: skills/prism-agent-review/SKILL.md; prompts/prism-agent-reviewer-v1.2.md; assessment/categories.yaml version 1.3. Read all required sections of knowledge/update-protocol.md: Eligibility; Text preparation and source gate; Agent-assisted completion and its subsections; Analysis coding including Source-review clarification, 5 September 2026. Also read docs/data/analysis_fields.json and tests/review-cases/validate-coding-packet.mjs for the contract.

Only the run's shared assignment applicable to ar2, its ar2 track and relevant run parameters were surfaced. The publication-type policy accepts scholarly sources and explicitly makes this a source-recovery review of existing corpus records, without changing the original search window. Both sources are identifiable scholarly research articles/preprints; no publication-type override was needed.

The actual prompt SHA-256 is 3aea5ce1e84a3f2557aee507632552816792a27d698003517ae238e1ec96d8af, matching the manifest. The actual text and image SHA-256 values below match their declared values; they were checked before reading and again after packet validation.

| Paper-ID | Text source | Actual SHA-256 | Match |
|---|---|---|---|
| RAY6G2R7 | corpus/source-acquisition/residual-resolution-2026-09-05/swiftsage-arxiv-v2-text.md | fd64251d9eed80eca0689fe3bad5e8ea15465746be71af1e38d7f8c9bdb553d1 | yes |
| SQYLQFRU | corpus/source-acquisition/residual-resolution-2026-09-05/kabra-arxiv-v3-text.md | bac6454052cd33fa790fde5c12b2bfc10fd340fb20433725feecd6a804283620 | yes |

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | Positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| RAY6G2R7 | Fulltext + 6 PNGs | provisional: title, all 9 authors and arXiv 2305.17390v2 match; exact publication date absent from assigned Paper level | Exclude / Not_relevant_topic | Generative_KI ja; Prompting ja; KI_Sonstige teilweise | All social categories nein. |
| SQYLQFRU | Fulltext + 3 PNGs | provisional: title, all 3 authors and arXiv 2504.05632v3 match; exact publication date absent from assigned Paper level | Include | Generative_KI ja; Prompting ja; Bias_Ungleichheit ja; Diversitaet teilweise; Fairness ja | Complete Include analysis; numerical limitations retained. |

### Category reasoning

RAY6G2R7 develops generative action planning and a two-stage prompting procedure as central contributions. Conventional reinforcement-learning baselines are an explicit subordinate comparison, supporting KI_Sonstige teilweise; the Swift component itself is a sequence-to-sequence language model. AI_Literacies is nein because the capacities concern computational agents, without an investigated human competence or teaching setting. The task/action data-imbalance discussion concerns simulated experiment actions, not social disadvantage or demographic bias. References to a fair comparison concern benchmark methods and permitted trials, not algorithmic social fairness. There is no substantive social-work, gender, social-diversity or feminist analysis, so all six social categories are nein and the deterministic result is Exclude.

SQYLQFRU centrally investigates generative LMs, stereotype mitigation and algorithmic fairness, and evaluates prompting as an explicit comparative research question with exact templates in A.1–A.3. Demographic representation is explicitly addressed through identity-group attributions across age, religion and nationality, but diversity/inclusion is subordinate to the bias/fairness study, giving Diversitaet teilweise. Gender is present in references rather than in this paper's investigated axes; there is no feminist or interacting-axis analysis. AI_Literacies, KI_Sonstige and Soziale_Arbeit are nein: this is a generative-model fine-tuning/benchmark study, not human AI education, a separate conventional AI system or a social-work setting.

The Include analysis codes the paper's own evaluated ReGiFT data selection and fine-tuning, and its evaluated CoT prompting comparator. Prompting roles are Research_Instrument and Object_of_Critique; techniques are Thought_Generation and General_Guidance. A.1 explicitly says the zero-shot prompts contain no demonstrations. The mitigation stages are Pre_Processing, In_Training and Prompt_Practice, each explained in AN_Notes. Output extraction/normalisation for scoring is not treated as technical output debiasing. Evaluated records completed intervention assessments, including mixed/negative comparator results; it does not imply general effectiveness. Population is Not_SW_Specific; study type is Experimentell; the three tested axes are coded separately without Intersectional. Stereotyping is the demonstrated harm.

## Full text coverage

- RAY6G2R7: read the complete 64,519-character assigned file, all 2,899 content lines (2,900 newline-split entries including the terminal empty entry). Coverage comprises title/authors, abstract, Sections 1–5, limitations, acknowledgements, all 41 references, Appendix A dataset statistics, Appendix B.1–B.3 implementation details, Appendix C.1–C.3 results/efficiency/cost analysis, all four tables and every figure caption. Sequential reading ranges were 1–200, 201–1000, 1001–1900 and 1901–end; nothing was skipped.
- SQYLQFRU: read the complete 55,324-character assigned file, all 1,596 content lines (1,597 newline-split entries including the terminal empty entry). Coverage comprises title/authors, abstract, Sections 1–7, Algorithm 1, Tables 1–5, ethics, reproducibility and limitations statements, all references, Appendix A.1–A.3 prompts/scoring, all A.4.1–A.4.4 reasoning examples, and all A.5.1–A.5.4 qualitative examples. Sequential reading ranges were 1–550, 551–1050 and 1051–end; nothing was skipped.

## Full image coverage

Every one of the nine declared PNGs was opened through view_image and visually inspected. No numeric values were estimated from plotted pixel positions or undefined error bars. The declared source-PDF hashes are provenance values in the assignment; this reviewer verified the assigned text/PNG bytes, not an unassigned PDF file.

| Paper-ID | Image path | Locator | Actual SHA-256 | Viewed and hash matched |
|---|---|---|---|---|
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-2305.17390v2-page-2.png | Original PDF page 2, Figure(s) 1; full_pdf_page_render | c353cb1a1745c8e455bccaf0f287e6fc4c1c5ccfddedcebf2352d170535cd6ba | yes |
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-2305.17390v2-page-5.png | Original PDF page 5, Figure(s) 2; full_pdf_page_render | a52b0214660a4b6e9a657f4600e740cc4e5e2fad6075aa7e75d180567958e8ce | yes |
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-2305.17390v2-page-9.png | Original PDF page 9, Figure(s) 3; full_pdf_page_render | d03bf00413fbd65c7ef60f3dabfff1cee966bfe02838536a1c1b22f961a3f98f | yes |
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-2305.17390v2-page-15.png | Original PDF page 15, Figure(s) 4; full_pdf_page_render | beff42eb886a52f5c4ce0fd1ab3bb20b73811f0c4d400340c932829f737f2a1d | yes |
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-2305.17390v2-page-18.png | Original PDF page 18, Figure(s) 5; full_pdf_page_render | 314a51bdc0b3ee89d859c6e8d93348e0f87ce3b2a9c6256a78f950be5a6f8488 | yes |
| RAY6G2R7 | corpus/source-acquisition/reading-assets-2026-09-05/assets/swiftsage-figure4.png | Original PDF page 15, Figure(s) 4; unaltered_original_figure_png | 0d5e30495ab0cd0d6531a618b18ab9540a0dfa09bb9ba1ae54ba4a95fce9faf8 | yes |
| SQYLQFRU | corpus/source-acquisition/reading-assets-2026-09-05/assets/kabra-2504.05632v3-page-2.png | Original PDF page 2, Figure(s) 1,2; full_pdf_page_render | 1fe0bb3d9726a6fec06b66dab08cc4d9eff3d8b9feda38da152acd66084e46a1 | yes |
| SQYLQFRU | corpus/source-acquisition/reading-assets-2026-09-05/assets/kabra-2504.05632v3-page-7.png | Original PDF page 7, Figure(s) 3; full_pdf_page_render | 97ee9803cd792f65839b3271e4fc8b714473ec209b24c6e5c159f73188f9d3e8 | yes |
| SQYLQFRU | corpus/source-acquisition/reading-assets-2026-09-05/assets/kabra-2504.05632v3-page-9.png | Original PDF page 9, Figure(s) 4; full_pdf_page_render | 7c4df10bb49855fd895e8d8110a801c7020a82fcd0c8f8dbff50aabb97016afc | yes |

Visual observations:

- SwiftSage page 2 / Figure 1: inspected all four method columns, the oracle-demonstration/subgoal distinction, SwiftSage's small-LM/LLM switching and action buffer.
- SwiftSage page 5 / Figure 2: inspected the broken-stove example, five planning questions, planning-to-grounding flow and executable action sequence; confirms the text's generative-agent interpretation.
- SwiftSage page 9 / Figure 3: inspected all 30 task trajectory panels, the blue/red/grey method mapping and caption's time/score definitions. The plots describe task performance, not social-group fairness.
- SwiftSage page 15 / Figure 4 and separate original Figure 4 PNG: inspected all 23 pseudocode lines, mode switching, buffer, validity/critical-action checks and exception handling. The separate original PNG made the code explicit; the source discrepancy below is retained.
- SwiftSage page 18 / Figure 5: inspected short/medium/long trajectory groups and the complete accompanying Table 4; these are efficiency/cost comparisons.
- Kabra page 2 / Figures 1–2: inspected the illustrative religious-stereotype question and all three model routes; inspected the reasoning/non-reasoning versus prompting/instruction-fine-tuning method map.
- Kabra page 7 / Figure 3: inspected ambiguous and disambiguous contexts, all four output columns, incorrect identity-group responses and context-grounded ReGiFT responses. These are qualitative stereotype examples, not evidence of a tested gender or intersectional effect.
- Kabra page 9 / Figure 4: inspected Table 5 and both labelled bars (139.62 correct, 243.81 incorrect), visible error bars, axes and caption. The image supplies no definition of the error-bar statistic or sample size.

## Abweichungen und Blocker

- Both papers · metadata gap, non-blocking under the prompt · titles, authors and stable arXiv versions match; the assigned exact publication dates (2023-12-06 and 2025-06-05) are not printed in the assigned texts/PNGs. arXiv identifiers are consistent with the assigned years. Identity checks remain provisional rather than claiming an independent exact-date verification.
- RAY6G2R7 · internal source inconsistency · Section 3.4 describes switching after five zero-reward time steps using R; Figure 4 line 21 instead checks a sum of cumulative scores S[-5:]. The source does not resolve the discrepancy. It does not change topic eligibility; no implementation correction was inferred.
- SQYLQFRU · internal numerical inconsistency · Table 1 and Table 3 disagree on Mistral ReGiFT age ambiguous/overall values (82.78/84.01 versus 82.58/83.91), and on several Phi-4 religion/nationality cells. These source values were not silently reconciled; they limit exact quantitative synthesis.
- SQYLQFRU · interpretation limitation · the narrative that CoT gives modest gains is not uniform across Table 3, which also reports worse outcomes than base models. Evaluated includes these negative/mixed outcomes.
- SQYLQFRU · graph limitation · Figure 4's error-bar statistic, sample sizes and a significance test are not identified in the assigned Paper level. The printed means are readable, but no confidence interval, verified statistical significance, causal trace-length claim or usable threshold is inferred.
- SQYLQFRU · method limitation · correct final answers are used as a proxy for reasoning-trace validity; the paper acknowledges that this assumption can fail. Generalisation beyond the three tested demographic axes, selected model sizes and reading-comprehension task remains limited.
- No unresolved title/stable-identifier conflict, hash mismatch, missing assigned text/image, publication-type blocker or coding-contract blocker was found. These records remain advisory source-review outputs, with the above substantive limitations intact.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja; exactly RAY6G2R7, SQYLQFRU in the requested order.
- alle zehn Kategorien und Evidence-Arrays je Record vorhanden: ja.
- alle positiven Kategorien haben zeichengetreue, zusammenhängende Paper-Belege: ja; 10 quotations passed a stricter case-sensitive exact-substring check against the raw assigned source, in addition to the official validator.
- alle Includes sind vollständig analysiert: ja; one Include, all controlled fields filled, AN_Coding_Basis Fulltext.
- vollständige Text- und Bildlektüre: ja; 2/2 complete texts including appendices and 9/9 declared PNGs.
- Coding-Paket-Validator bestanden: ja; node tests/review-cases/validate-coding-packet.mjs tests/review-cases/agent-runs/recovered-arxiv-sources-2-20260905/run.json ar2 returned PASS coding packet: ar2, 2 records (exit 0).
- Wrote only tracks/ar2-coding.json and reports/ar2.md within this run. The manifest, assigned sources, productive data, code and other tracks were not edited.
