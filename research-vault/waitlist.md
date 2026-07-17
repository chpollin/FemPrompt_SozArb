---
layer: waitlist
title: "Warteliste, nicht migrierte Distillate mit F-, D- oder G-Befund"
created: 2026-07-17
status: snapshot
---

# Warteliste, nicht migrierte Distillate

Diese Datei registriert die Distillate aus `generated/distilled/`, die der Evidence-Audit (`generated/distilled/_evidence_audit/`) mit einem F-, D- oder G-Befund ausweist und die nach der Präregistrierungs-Vorbedingung des research-vault-Plans nicht nach `10_distillates/` migriert wurden. Ein Eintrag zieht erst nach der bindenden menschlichen Stufe-3-Verifikation durch den Operator in die Belegkette ein, entweder migriert oder mit korrigierter Beleglage.

Die Befundklassen stammen aus der deterministischen Stufe 1 des Audits, die G-Klasse aus der adversarialen Stufe 2 (`stage2_verdicts.json`), beide advisory. Stufe 1 ist bei F bewusst überinklusiv, ein Teil der F-Kandidaten sind Matcher- oder docling-Artefakte, kein echtes Confabulation. Die Trennung bindet erst der Mensch.

## Befundklassen

- **F** Zitatanspruch nicht im Volltext auflösbar, Confabulation-Kandidat, in Stufe 1 zeichengenau, überinklusiv.
- **D** Zitat über Kategorien oder Papers dupliziert.
- **G** Evidenz argumentiert gegen die zugeordnete Kategorie, Polaritätsfehler, das schärfste Muster.
- **U** kein Volltext in `generated/markdown_clean/` zuordenbar, eigener Verdacht auf fehlassoziierte oder korrupte Distillat-Metadaten. Nach dem Audit gesondert zu prüfen, hier als Migrationssperre geführt, weil die Zitate nicht anker-geprüft werden konnten.

## Verweis auf die Stufe-3-Verifikation

Die menschliche Verifikation folgt der Priorisierung aus `generated/distilled/_evidence_audit/AUDIT-SUMMARY.md`, Abschnitt "Was an die menschliche Verifikation (Stufe 3) geht". Reihenfolge nach Schärfe, zuerst G, dann die harten F-Confabulation-Fälle der Stufe-2-Stichprobe, dann D mit Vorrang der within-paper-cross-category-Fälle, dann die U-Fälle als Metadaten-Verdacht.

## Momentaufnahme der Verteilung (2026-07-17)

| Befundklassen | Anzahl Distillate |
|---|---|
| G + F + D | 2 |
| G + F | 1 |
| G | 1 |
| F + D | 38 |
| F | 132 |
| U + D | 4 |
| D | 3 |
| U | 11 |
| Summe | 192 |

## Einträge

### G + F + D

- `generated/distilled/Chiu_2024_What_are_artificial_intelligence_literacy_and.md`
- `generated/distilled/Tun_2025_Trust_in_artificial_intelligence–based_clinical.md`

### G + F

- `generated/distilled/Xu_2023_Transparency_enhances_positive_perceptions_of.md`

### G

- `generated/distilled/Weber_2023_Messung_von_AI_Literacy_–_Empirische_Evidenz_und.md`

### F + D

- `generated/distilled/Alvarez_2024_Policy_advice_and_best_practices_on_bias_and.md`
- `generated/distilled/Arias López_2023_Digital_literacy_as_a_new_determinant_of_health_A.md`
- `generated/distilled/Asseri et al._2025_Prompt_Engineering_Techniques_for_Mitigating.md`
- `generated/distilled/Asseri_2025_Prompt_engineering_techniques_for_mitigating.md`
- `generated/distilled/Bai_2025_Explicitly_unbiased_large_language_models_still.md`
- `generated/distilled/Benlian_2025_The_AI_literacy_development_canvas_Assessing_and.md`
- `generated/distilled/Boetto_2025_Artificial_Intelligence_in_Social_Work_An_EPIC.md`
- `generated/distilled/Browne_2024_Engineers_on_responsibility_feminist_approaches.md`
- `generated/distilled/Chisca_2024_Prompting_techniques_for_reducing_social_bias_in.md`
- `generated/distilled/Fraile-Rojas_2025_Female_perspectives_on_algorithmic_bias.md`
- `generated/distilled/Gengler_2024_Faires_KI-Prompting_–_Ein_Leitfaden_für.md`
- `generated/distilled/Ghosal_2024_An_empirical_study_of_structural_social_and.md`
- `generated/distilled/Guerra_2023_Feminist_reflections_for_the_development_of.md`
- `generated/distilled/Hooshyar et al._2025_Towards_responsible_AI_for_education_Hybrid.md`
- `generated/distilled/Jääskeläinen_2025_Intersectional_analysis_of_visual_generative_AI.md`
- `generated/distilled/Kamruzzaman_2024_Prompting.md`
- `generated/distilled/Klinge_2024_A_sociolinguistic_approach_to_stereotype.md`
- `generated/distilled/Knowles_2023_Trustworthy_AI_and_the_Logics_of_Intersectional.md`
- `generated/distilled/Kutscher_2023_Positionings,_challenges,_and_ambivalences_in.md`
- `generated/distilled/Laine_2025_Avoiding_Catastrophe_Through_Intersectionality_in.md`
- `generated/distilled/Lütz_2024_The_AI_Act,_gender_equality_and.md`
- `generated/distilled/Maeda_2025_Toward_Agency‐Centered_span.md`
- `generated/distilled/McCrory_2024_Avoiding_catastrophe_through_intersectionality_in.md`
- `generated/distilled/Peng_2022_A_Literature_Review_of_Digital_Literacy_over_Two.md`
- `generated/distilled/Ricaurte Quijano_2024_Towards_Substantive_Equality_in_Artificial.md`
- `generated/distilled/Rodríguez-Martínez_2024_Ethical_issues_related_to_the_use_of_technology.md`
- `generated/distilled/Ruiz_2024_AI_Literacy_A_Framework_to_Understand,_Evaluate,.md`
- `generated/distilled/Shafie_2025_More_or_less_wrong_A_benchmark_for_directional.md`
- `generated/distilled/Sperling_2024_In_search_of_artificial_intelligence_(AI).md`
- `generated/distilled/Taeihagh_2025_Governance_of_generative_AI_A_comprehensive.md`
- `generated/distilled/Tang_2024_GenderCARE_A_Comprehensive_Framework_for.md`
- `generated/distilled/UNESCO_2024_Bias_against_women_and_girls_in_large_language.md`
- `generated/distilled/Vethman_2025_Fairness_Beyond_the_Algorithmic_Frame_Actionable.md`
- `generated/distilled/Wilson_2024_Gender,_race,_and_intersectional_bias_in_AI.md`
- `generated/distilled/Wudel_2025_What.md`
- `generated/distilled/Wudel_2025_What_is_Feminist_AI.md`
- `generated/distilled/Zhao_2025_Thinking_like_a_scientist_Can_interactive.md`
- `generated/distilled/van Toorn_2024_Introduction_to_the_digital_welfare_state.md`

### F

- `generated/distilled/Ahmed_2024_Feminist_perspectives_on_AI_Ethical.md`
- `generated/distilled/Ahn_2025_Artificial_Intelligence_(AI)_literacy_for_social.md`
- `generated/distilled/Ahrweiler_2025_AI_FORA_–_Artificial_Intelligence_for_Assessment.md`
- `generated/distilled/Amnesty International_2024_Coded_injustice_Surveillance_and_discrimination.md`
- `generated/distilled/An_2025_Measuring_gender_and_racial_biases_in_large.md`
- `generated/distilled/Articulate_2025_How_to_Create_Inclusive_AI_Images_A_Guide_to.md`
- `generated/distilled/Barman_2024_Beyond_transparency_and_explainability_On_the.md`
- `generated/distilled/Biagini_2024_Less_knowledge,_more_trust_Exploring_potentially.md`
- `generated/distilled/Biegelbauer_2023_Leitfaden_Digitale_Verwaltung_und_Ethik.md`
- `generated/distilled/Bisconti_2024_A_formal_account_of_AI_trustworthiness_Connecting.md`
- `generated/distilled/Browne_2024_Tech_workers'_perspectives_on_ethical_issues_in.md`
- `generated/distilled/Casal-Otero_2023_AI_literacy_in_K-12_a_systematic_literature_review.md`
- `generated/distilled/Charlesworth_2024_Flexible_intersectional_stereotype_extraction.md`
- `generated/distilled/Chee_2025_A_Competency_Framework_for_AI_Literacy_Variations.md`
- `generated/distilled/Chen_2023_Ideology_Prediction_from_Scarce_and_Biased.md`
- `generated/distilled/Cher_2024_Exploring_machine_learning_to_support.md`
- `generated/distilled/Chisca_2024_Prompting_fairness_Learning_prompts_for_debiasing.md`
- `generated/distilled/Chiu_2025_AI_literacy_and_competency_definitions,.md`
- `generated/distilled/Choudhury_2024_Large_Language_Models_and_User_Trust_Consequence.md`
- `generated/distilled/Ciston_2024_Intersectional_Artificial_Intelligence_Is.md`
- `generated/distilled/Clemmer_2024_PreciseDebias_An_automatic_prompt_engineering.md`
- `generated/distilled/Colombatto_2025_The_influence_of_mental_state_attributions_on.md`
- `generated/distilled/De Duro_2025_Measuring_and_identifying_factors_of_individuals'.md`
- `generated/distilled/Debnath_2024_Can_LLMs_reason_about_trust_A_pilot_study.md`
- `generated/distilled/Dencik_2024_Automated_government_benefits_and_welfare.md`
- `generated/distilled/Deuze_2022_Imagination,_Algorithms_and_News_Developing_AI.md`
- `generated/distilled/Dilek_2025_AI_literacy_in_teacher_education_Empowering.md`
- `generated/distilled/Dixon_2018_Measuring_and_mitigating_unintended_bias_in_text.md`
- `generated/distilled/Engelhardt_2025_Voll_(dia)logisch_Ein_Werkstattbericht_über_den.md`
- `generated/distilled/European Commission. Joint Research Centre._2017_DigComp_2.1_the_digital_competence_framework_for.md`
- `generated/distilled/European Data Protection Supervisor_2023_Explainable_Artificial_Intelligence.md`
- `generated/distilled/Freinhofer_2025_Prompten_nach_Plan_Das_PCRR-Framework_als.md`
- `generated/distilled/Fujii_2024_Bildungsteilhabe_-_Flucht_-_Digitalisierung_Eine.md`
- `generated/distilled/Gaba_2025_Bias,_accuracy,_and_trust_Gender-diverse.md`
- `generated/distilled/Gallegos_2024_Bias_and_fairness_in_large_language_models_A.md`
- `generated/distilled/Garg_2019_Counterfactual_fairness_in_text_classification.md`
- `generated/distilled/Gohar_2023_Survey.md`
- `generated/distilled/Hall_2024_A_systematic_review_of_sophisticated_predictive.md`
- `generated/distilled/Hauck_2025_A_framework_for_the_learning_and_teaching_of.md`
- `generated/distilled/Hayati_2024_How_Far_Can_We_Extract_Diverse_Perspectives_from.md`
- `generated/distilled/He_2024_On_the_steerability_of_large_language_models.md`
- `generated/distilled/Jaakkola_2024_Operationalizing_positive-constructive_pedagogy.md`
- `generated/distilled/James_2023_Algorithmic_decision-making_in_social_work.md`
- `generated/distilled/Jarke_2024_Who_cares_about_data_Data_care_arrangements_in.md`
- `generated/distilled/Jarke_2025_Datafied_ageing_futures_Regimes_of_anticipation.md`
- `generated/distilled/Jin_2025_GLAT_The_generative_AI_literacy_assessment_test.md`
- `generated/distilled/Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large.md`
- `generated/distilled/Kaneko_2024_Evaluating_gender_bias_in_large_language_models.md`
- `generated/distilled/Karagianni_2025_The_EU_artificial_intelligence_act_through_a.md`
- `generated/distilled/Kawakami_2022_Improving_human-AI_partnerships_in_child_welfare.md`
- `generated/distilled/Klein_2024_Data.md`
- `generated/distilled/Kojima_2022_Large_language_models_are_zero-shot_reasoners.md`
- `generated/distilled/Kong_2022_Are_Intersectionally_Fair_AI_Algorithms_Really.md`
- `generated/distilled/Kong_2024_Developing_an_artificial_intelligence_literacy.md`
- `generated/distilled/Kumar_2024_How_AI_hype_impacts_the_LGBTQ+_community.md`
- `generated/distilled/Kutscher_2024_Digitalität_und_Digitalisierung_als_Gegenstand.md`
- `generated/distilled/Lahoti_2023_Improving_diversity_of_demographic_representation.md`
- `generated/distilled/Lanzetta_2024_Artificial_Intelligence_Competence_Needs_for.md`
- `generated/distilled/Lau_2023_Dipper_Diversity_in_Prompts_for_Producing_Large.md`
- `generated/distilled/Lin_2022_Artificial_Intelligence_in_a_Structurally_Unjust.md`
- `generated/distilled/Linnemann_2023_Bedeutung_von_Künstlicher_Intelligenz_in_der.md`
- `generated/distilled/Linnemann_2025_Künstliche_Intelligenz_in_der_Sozialen_Arbeit.md`
- `generated/distilled/Ma_2023_Intersectional_Stereotypes_in_Large_Language.md`
- `generated/distilled/Mei_2023_Assessing_GPT's_bias_towards_stigmatized_social.md`
- `generated/distilled/Meilvang_2024_Decision_support_and_algorithmic_support_The.md`
- `generated/distilled/Moreau_2024_Failing_our_youngest_On_the_biases,_pitfalls,_and.md`
- `generated/distilled/Navigli_2023_Biases_in_large_language_models_Origins,.md`
- `generated/distilled/Ng_2021_Conceptualizing_AI_literacy_An_exploratory_review.md`
- `generated/distilled/Ng_2022_Using_digital_story_writing_as_a_pedagogy_to.md`
- `generated/distilled/Ng_2025_Opportunities,_challenges_and_school_strategies.md`
- `generated/distilled/Nuwasiima_2024_The_role_of_artificial_intelligence_(AI)_and.md`
- `generated/distilled/OECD_2023_Advancing_Accountability_in_AI.md`
- `generated/distilled/Ovalle_2023_Factoring_the_Matrix_of_Domination_A_Critical.md`
- `generated/distilled/Pan_2025_LIBRA_Measuring_bias_of_large_language_model_from.md`
- `generated/distilled/Park_2025_AI_algorithm_transparency,_pipelines_for_trust.md`
- `generated/distilled/Parrish_2022_BBQ_A_hand-built_bias_benchmark_for_question.md`
- `generated/distilled/Parrish_2025_Self-debiasing_large_language_models_Zero-shot.md`
- `generated/distilled/Patton_2023_ChatGPT_for_Social_Work_Science_Ethical.md`
- `generated/distilled/Pinski_2023_AI_Literacy_-_Towards_Measuring_Human_Competency.md`
- `generated/distilled/Pinski_2024_AI_literacy_for_users_–_A_comprehensive_review.md`
- `generated/distilled/Qiu_2025_DR.GAP_Mitigating_bias_in_large_language_models.md`
- `generated/distilled/Ricaurte_2024_How_can_feminism_inform_AI_governance_in_practice.md`
- `generated/distilled/Rodriguez_2024_Introducing_Generative_Artificial_Intelligence.md`
- `generated/distilled/Salinas_2025_What’s_in_a_name_Auditing_large_language_models.md`
- `generated/distilled/Sant_2024_The_power_of_prompts_Evaluating_and_mitigating.md`
- `generated/distilled/Santos_2024_Explainability_through_systematicity_The_hard.md`
- `generated/distilled/Santos_2025_How_large_language_models_judge_cooperation.md`
- `generated/distilled/Schneider_2018_Der_Einfluss_der_Algorithmen_Neue_Qualitäten.md`
- `generated/distilled/Schneider_2022_Exploring_opportunities_and_risks_in_decision.md`
- `generated/distilled/Schneider_2025_Indecision_on_the_use_of_artificial_intelligence.md`
- `generated/distilled/Schönauer_2025_Akzeptanz_von_KI_und_organisationale.md`
- `generated/distilled/Shin_2024_Can_prompt_modifiers_control_bias_A_comparative.md`
- `generated/distilled/Shukla_2025_Investigating_AI_systems_examining_data_and.md`
- `generated/distilled/Siapka_2023_Towards_a_Feminist_Metaethics_of_AI.md`
- `generated/distilled/Siddals_2024_It_happened_to_be_the_perfect_thing_Experiences.md`
- `generated/distilled/Sinders_2017_Feminist_Data_Set.md`
- `generated/distilled/Singh_2025_reparative.md`
- `generated/distilled/Slesinger_2024_Training_in_Co-Creation_as_a_Methodological.md`
- `generated/distilled/Small_2023_Generative_AI_and_opportunities_for_feminist.md`
- `generated/distilled/Srivastava_2024_Algorithmic_Governance_and_the_International.md`
- `generated/distilled/Strauß_2024_CAIL_–_Critical_AI_Literacy_Kritische.md`
- `generated/distilled/Studeny_2025_Digitale_Werkzeuge_und_Machtasymmetrien.md`
- `generated/distilled/Sūna_2024_Diskriminierung_durch_Algorithmen_–_Überlegungen.md`
- `generated/distilled/Takaoka_2022_AI_implementation_science_for_social_issues.md`
- `generated/distilled/Tinmaz_2022_A_systematic_review_on_digital_literacy.md`
- `generated/distilled/Toupin_2024_Shaping_feminist_artificial_intelligence.md`
- `generated/distilled/UNESCO_2021_Recommendation_on_the_Ethics_of_Artificial.md`
- `generated/distilled/UNESCO_2024_Women4Ethical_AI_Global_cooperation_for.md`
- `generated/distilled/Unknown_AI_competency_framework_for_students.md`
- `generated/distilled/Unknown_Artificial_Intelligence_in_Social_Sciences_and.md`
- `generated/distilled/Unknown_Artificial_Intelligence_in_Social_Work_An_EPIC.md`
- `generated/distilled/Victor_2023_Recommendations_for_social_work_researchers_and.md`
- `generated/distilled/Voutyrakou_2025_Algorithmic_Governance_Gender_Bias_in.md`
- `generated/distilled/Waag_2023_Rationalisierung_durch_Digitalisierung.md`
- `generated/distilled/Wajcman_2023_Feminism_Confronts_AI_The_Gender_Relations_of.md`
- `generated/distilled/Wang_2024_A_survey_on_fairness_in_large_language_models.md`
- `generated/distilled/Wang_2024_Algorithmic_discrimination_examining_its_types.md`
- `generated/distilled/Wang_2025_Multilingual_Prompting_for_Improving_LLM.md`
- `generated/distilled/West_2023_Discriminating_Systems_Gender,_Race,_and_Power_in.md`
- `generated/distilled/Wilson_2024_AI_tools_show_biases_in_ranking_job_applicants'.md`
- `generated/distilled/Wong_2020_Broadening_artificial_intelligence_education_in.md`
- `generated/distilled/World Economic Forum_2024_AI_for_impact_The_PRISM_framework_for_responsible.md`
- `generated/distilled/Wu_2025_Bias_in_decision-making_for_AI's_ethical_dilemmas.md`
- `generated/distilled/Yan_2024_Promises_and_challenges_of_generative_artificial.md`
- `generated/distilled/Yu_2025_Algorithmic-Assisted_Decision-Making_Tools_in.md`
- `generated/distilled/Yuan_2025_The_cultural_stereotype_and_cultural_bias_of.md`
- `generated/distilled/Yunusov_2024_MirrorStories_Reflecting_Diversity_through.md`
- `generated/distilled/Zakharova_2024_Tensions_in_digital_welfare_states_Three.md`
- `generated/distilled/Zannone_2023_Intersectional_Fairness_A_Fractal_Approach.md`
- `generated/distilled/Zayed_2024_Scaling_implicit_bias_analysis_across.md`
- `generated/distilled/Zeng_2025_Governing_discriminatory_content_in.md`
- `generated/distilled/Zhang_2025_Learning_About_AI_A_Systematic_Review_of_Reviews.md`

### U + D

- `generated/distilled/Alliance_2024_Incubating.md`
- `generated/distilled/Friedrich-Ebert-Stiftung_2025_artificial.md`
- `generated/distilled/Sharma_2024_Intersectional.md`
- `generated/distilled/Washington_2025_Fragile.md`

### D

- `generated/distilled/A+ Alliance_2024_Incubating_Feminist_AI_Executive_Summary_2021-2024.md`
- `generated/distilled/D'Ignazio_2024_Data_Feminism_for_AI.md`
- `generated/distilled/Skilton_2024_Inclusive_prompt_engineering_A_methodology_for.md`

### U

- `generated/distilled/Arias_López_2023_Digital.md`
- `generated/distilled/Attard-Frost_2025_Countergovernance.md`
- `generated/distilled/D_Ignazio_2024_Data.md`
- `generated/distilled/Hall_2024_systematic.md`
- `generated/distilled/He_2024_steerability.md`
- `generated/distilled/Kutscher_2020_Handbuch.md`
- `generated/distilled/Mosene_2023_Feministische.md`
- `generated/distilled/Ovalle_2023_Factoring.md`
- `generated/distilled/Project_2024_Intersectionality.md`
- `generated/distilled/Qiu_2025_Mitigating.md`
- `generated/distilled/Women_2024_Artificial.md`
