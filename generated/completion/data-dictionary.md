# Data dictionary

Source fingerprint: `sha256:233004c51059be582e73dc0750db4b1df50993f07262931940b501802dca0db3`. Deterministic internal preparation; no approval is created.

| Field / artifact | Meaning |
|---|---|
| work_id | Canonical scholarly contribution; one counting unit even with multiple records or versions. |
| record_ids | Zotero bibliographic aliases linked through registry record_index. |
| version_ids / preferred_version_id | Exact linked expressions and preferred expression; an alternative source needs a recorded exception. |
| decision_authority | legacy_human, ai_review or unassessed; distinct tracks are never silently promoted. |
| effective_decision | One consistent substantive human decision if recorded, otherwise one consistent AI decision; null on unresolved within-track conflict or absence. Explicit Exclude/Duplicate is a record disposition, not a substantive work exclusion. |
| human_substantive_decisions / human_duplicate_record_ids | Work judgements and administrative duplicate records are distinct; all original dispositions and reasons remain in human_record_dispositions. Multiline note line endings use LF in this projection; original CSV rows remain unchanged. |
| historical_identity_bindings / human_metadata_error_record_ids | Attributed exact-row reconciliations link otherwise unbound historical decisions or separate documented metadata-error dispositions; they do not modify the Zotero library or historical CSV. |
| historical_resolution / integrity_hold | Source-grounded conflict explanation, separate round-specific recommendation and any current source/withdrawal hold. A hold does not rewrite the historical decision and prevents current synthesis. |
| human_verification | Historical CSV evidence or missing evidence; never a fabricated current lifecycle event. |
| agent_records | Active annotation, lifecycle events, actor/model provenance, source references and legacy gaps as recorded. |
| current_ai_source_review | Current accepted source-hash-bound review with actual agent, disclosed model, time and substantive findings; historical provenance remains separate. |
| applied_ai_correction / original_analysis | Immutable correction projection and original coding side by side; correction base artifact/hash and each field change remain auditable. |
| ai_correction_provenance | Work-queue references to each correction, its immutable basis, hashes and correcting/reviewing agent, model and dates. |
| open_ai_source_review_record_ids | Negative or unverifiable source reviews with no accepted correction; affected work coding is not counted in interim SQ tables. |
| analysis_eligible | Include with AI-reviewed analysis, no within-track decision conflict, no human/AI decision divergence and no unresolved negative source review. |
| analysis_fields | Consistent coded values across Include annotations of the work; absent values remain missing. |
| analysis_conflicts / analysis_undecidable | Conflicting or explicitly undecidable coding; excluded from that field's denominator. |
| source_blockers / next_actions | Preparation actions for the operator, not automatic exclusion reasons. |
| source_acquisition_progress | Attributed metadata corrections and original-text acquisitions, checked against raw record and evidence hashes. An acquired text alone does not establish screening readiness or scholarly verification. |
| current_source_binding_record_ids / newly_acquired_text_requires_binding | Current registry bindings and remaining binding work, derived separately from dated acquisition findings. A resolved binding no longer creates a stale acquisition action; screening remains its own queue step. |
| knowledge_coverage | Deterministic availability inventory with missing documents, identity-review candidates and concept-graph binding gaps. Active maturity labels are recorded literally and do not substitute for current review receipts. |
| candidate_id / canonical_bindings | Search-package identity and explicit current Zotero/registry mapping; title similarity never binds identities. |
| targeted_followup_candidates | Separate gap-fill intake; preserves original candidate metadata and status, gap rationale, required next steps, source access, exact-version details and identification provenance. |
| targeted_followup.source / targeted_followup_candidates[].source_artifact | Fingerprinted intake JSON and exact original candidate pointer. Source reading is identification evidence, not a new screening or human-verification event. |
| source_hash_matches | Current local screening Markdown equals its recorded SHA-256; not scientific verification. |
| conflicts_or_constraints | Exact-version exceptions, metadata corrections, absent bindings or local source integrity concerns. |
| work_count / work_ids | Unique works assigned a given controlled code; identities permit audit of every count. |
| denominator_field_coded_works | Eligible works with valid, decided coding for this field. |
| denominator_ai_analysis_eligible_works | Works eligible for this interim AI analysis before missing-field handling. |
| denominator_recorded_include_works | All works with a consistent Include decision in the selected authority track. |
| missing_or_unresolved_included_works | Included works not represented in this field; not coded as None. |
| assertions[].sources | Exact distillate paths, block anchors, record, Work and Version binding. |
| structural_grounding_complete | All stated targets/anchors/identities exist; not verification of content. |
| sources / source_fingerprint | SHA-256 of each input and deterministic aggregate; known text formats normalize CRLF to LF, binary bytes remain exact. Existing acquisition hashes retain their original byte-exact contract. No wall-clock timestamp disguises stale data. |

Controlled descriptive fields below come from `assessment/categories.yaml`. They do not replace inclusion criteria. Multi-code values can overlap; no prevalence or causal effect follows from these frequency tables.

- `AN_Prompting_Role`: Recommended_Practice, Research_Instrument, Object_of_Critique, Learning_Content, None; multiple codes allowed.
- `AN_Prompt_Techniques`: ICL, Thought_Generation, Decomposition, Ensembling, Self_Criticism, Role_Persona, General_Guidance, None; multiple codes allowed.
- `AN_Bias_Axes`: Gender, Race_Ethnicity, Intersectional, Disability, Age, Socioeconomic, Language_Culture, Sexual_Orientation_Identity, Religion, Physical_Appearance, Nationality_Migration, Other_Axis, None; multiple codes allowed.
- `AN_Harm_Types`: Derogatory_Language, Disparate_Performance, Erasure, Exclusionary_Norms, Misrepresentation, Stereotyping, Toxicity, Direct_Discrimination, Indirect_Discrimination, None; multiple codes allowed.
- `AN_Mitigation_Stage`: Pre_Processing, In_Training, Intra_Processing, Post_Processing, Prompt_Practice, Organisational_Process, None; multiple codes allowed.
- `AN_Mitigation_Status`: Evaluated, Demonstrated, Proposed, None.
- `AN_Population`: Child_Family_Welfare, Mental_Health, Health_Care, Homelessness_Youth, Social_Assistance_Admin, Education_Professional, General_Social_Work, Not_SW_Specific; multiple codes allowed.
- `AN_Coding_Basis`: Fulltext, Knowledge_Doc, Abstract.
- `AN_Notes`: free text.
