---
layer: waitlist
title: "Warteliste, nicht migrierte Distillate nach der Stufe-1b-Auflösung"
created: 2026-07-17
updated: 2026-07-18
status: snapshot
---

# Warteliste, nicht migrierte Distillate

Diese Datei registriert die Distillate aus `generated/distilled/`, die nach der deterministischen Stufe-1b-Auflösung (`src/assess/waitlist_resolution.py`, Report `generated/distilled/_evidence_audit/stage1b_resolution.json`) nicht in `research-vault/10_distillates/` liegen. Die Stufe 1b hat jeden Stufe-1-Befund gegen die committeten Volltexte in `generated/markdown_clean/` nachgeprüft, mit einem kontiguierlich-wörtlichen Matcher, der die bekannten Artefaktklassen toleriert (Zitationsklammern, docling-Ligaturen, geschachtelte Anführungszeichen, Apostroph-Paarung, Satzzeichen-Differenzen) und zwei Zitierpraxis-Ausnahmen kennt, editorische Einschübe in eckigen Klammern und markierte Ellipsen mit geordneten, nah beieinanderliegenden Segmenten. Was dieser Matcher auflöst, ist zeichenfolgengenau im Volltext belegt und migriert. Was er nicht auflöst, bleibt hier und wartet auf die bindende menschliche Stufe-3-Verifikation. Kein Eintrag dieser Liste ist menschlich geprüft.

## Befundklassen nach Stufe 1b

- **F (offen)** Zitatanspruch auch nach der artefakt-toleranten Nachprüfung nicht kontiguierlich im Volltext auflösbar. Confabulation-Kandidat, unmarkierte Elision oder verändertes Zitatende. Nur der Mensch trennt das.
- **G** Evidenz argumentiert gegen die zugeordnete Kategorie, Polaritätsfehler aus der adversarialen Stufe 2. Inhaltliches Urteil, maschinell nicht entscheidbar.
- **U** Kein Volltext in `generated/markdown_clean/` zuordenbar, weder über Dateinamen noch über Titel noch über Zitat-Inhaltssuche quer über alle Volltexte. Verdacht auf fehlassoziierte oder korrupte Distillat-Metadaten.
- **Volltext-Fehlzuordnung** Die Volltext-Datei zum Distillat enthält nachweislich ein fremdes Paper (Acquisition-Fehler). Die F-Befunde dieser Distillate sind dadurch erklärt, die eigentliche Quelle ist aber unprüfbar, solange ihr Volltext fehlt.

Die D-Klasse der Stufe 1 ist vollständig aufgelöst. Kein Duplikat-Zitat bildet eine fabrizierte Pro-Kategorie-Struktur (identischer Evidenz-Volltext unter mehreren Kategorien eines Papers tritt nicht auf); die geteilten Kurzphrasen sind je im eigenen Volltext nachgewiesen.

## Verweis auf die Stufe-3-Verifikation

Reihenfolge nach Schärfe wie in `generated/distilled/_evidence_audit/AUDIT-SUMMARY.md`, zuerst G, dann die F-offenen Fälle, dann die U-Fälle als Metadaten-Verdacht. Vier advisory Stufe-2-Urteile (F-hart für EDPS, Lin, Moreau, Ruiz) hat die Stufe 1b deterministisch widerlegt, die Zitate stehen wörtlich im Volltext; die verbleibenden F-offenen Ansprüche sind entsprechend die härtere Restmenge.

## Momentaufnahme der Verteilung (2026-07-18)

| Befundklasse | Anzahl Distillate |
|---|---|
| F (offen) | 116 |
| G (davon 2 mit zusätzlichen offenen F) | 4 |
| U | 23 |
| Volltext-Fehlzuordnung | 2 |
| Summe wartend | 145 |
| dazu aufgelöst als Quellendublette, nicht migriert | 10 |

## G, Polaritätsfehler

- `generated/distilled/Chiu_2024_What_are_artificial_intelligence_literacy_and.md` (Gender geflaggt, Evidenz verneint Gender-Analysefokus; zusätzlich offene F)
- `generated/distilled/Tun_2025_Trust_in_artificial_intelligence–based_clinical.md` (Bias_Ungleichheit geflaggt, Evidenz relativiert)
- `generated/distilled/Weber_2023_Messung_von_AI_Literacy_–_Empirische_Evidenz_und.md` (Gender geflaggt, Evidenz verneint geschlechterspezifische Analyse)
- `generated/distilled/Xu_2023_Transparency_enhances_positive_perceptions_of.md` (Diversitaet geflaggt, Evidenz ist Stichproben-Demografie; zusätzlich offene F, unmarkierte Elision)

## Volltext-Fehlzuordnung, Acquisition-Fehler

- `generated/distilled/Kutscher_2023_Positionings,_challenges,_and_ambivalences_in.md`, die Datei `generated/markdown_clean/Kutscher_2023_….md` enthält das Alvarez-Paper "Policy advice and best practices on bias and fairness in AI" (Volltext-Identität J=0.999 zur Alvarez-Datei). Der Volltext des Kutscher-Papers fehlt im Korpus.
- `generated/distilled/Ghosal_2024_An_empirical_study_of_structural_social_and.md`, die Datei enthält das Paper "Intersectional analysis of visual generative AI" (Jääskeläinen et al., J=0.997). Der Volltext des Ghosal-Papers fehlt im Korpus.

## U, kein zuordenbarer Volltext

Sieben davon standen bis 2026-07-18 in `10_distillates/`; die erste Migrationswelle hatte sie durchgelassen, weil ihre Einträge reine Paraphrase ohne prüfbare Zitate sind und die U-Erkennung der Stufe 1 nur an Zitat-Zeilen hing. Sie sind de-migriert, weil ohne Volltext keine Belegkette herstellbar ist. Der Frontmatter-Titel weicht bei mehreren nachweislich vom Dateinamen ab, das stützt den Metadaten-Verdacht.

De-migriert am 2026-07-18:

- `generated/distilled/Barman_2024_Beyond.md` (Titel nennt eine südaustralische GenAI-Guideline, nicht das Barman-Paper)
- `generated/distilled/Debnath_2024_LLMs.md` (Titel "nicht angegeben")
- `generated/distilled/Freinhofer_2025_Prompten.md` (Titel nennt ein englisches Prompt-Handbuch, nicht das PCRR-Paper)
- `generated/distilled/Statistics_2023_Occupational.md` (Titel nennt eine US-Arbeitsmarktstatistik)
- `generated/distilled/Tun_2025_Trust.md` (Titel "nicht angegeben")
- `generated/distilled/Unknown_2024_Research.md` (Titel nennt ein ChatGPT-Risiko-Paper ohne Autor)
- `generated/distilled/Yunusov_2024_MirrorStories.md` (Titel nennt das word2vec-Paper, sicher fehlassoziiert)

Bereits seit 2026-07-17 gelistet:

- `generated/distilled/Alliance_2024_Incubating.md`
- `generated/distilled/Arias_López_2023_Digital.md`
- `generated/distilled/Attard-Frost_2025_Countergovernance.md`
- `generated/distilled/D_Ignazio_2024_Data.md`
- `generated/distilled/Friedrich-Ebert-Stiftung_2025_artificial.md`
- `generated/distilled/Hall_2024_systematic.md`
- `generated/distilled/He_2024_steerability.md`
- `generated/distilled/Kamruzzaman_2024_Prompting.md` (Titel gleicht dem Kamruzzaman/Kim-Paper, Zitate lösen sich aber in keiner der beiden Versionen im Korpus vollständig auf)
- `generated/distilled/Klein_2024_Data.md` (mutmaßlich Dublette von D'Ignazio_2024_Data_Feminism_for_AI, Zitate dort nicht vollständig auflösbar, darum nicht maschinell entschieden)
- `generated/distilled/Kutscher_2020_Handbuch.md`
- `generated/distilled/Mosene_2023_Feministische.md`
- `generated/distilled/Project_2024_Intersectionality.md`
- `generated/distilled/Qiu_2025_Mitigating.md`
- `generated/distilled/Sharma_2024_Intersectional.md` (mutmaßlich Dublette des Jääskeläinen-Papers, gleiche Einschränkung)
- `generated/distilled/Washington_2025_Fragile.md`
- `generated/distilled/Women_2024_Artificial.md` (Titel nennt ein LLM-Scaling-Paper, sicher fehlassoziiert)

## F (offen), Zitatanspruch nicht auflösbar

Je Distillat die Zahl der nach Stufe 1b offenen Zitat-Ansprüche. Distillate mit gemeinsamer Quelle sind vermerkt; bei einer späteren Freigabe zieht je Quelle nur eines ein.

- `generated/distilled/Ahmed_2024_Feminist_perspectives_on_AI_Ethical.md` (2 offen, darunter der Stufe-2-bestätigte umgeschriebene Zitatfall)
- `generated/distilled/Ahrweiler_2025_AI_FORA_–_Artificial_Intelligence_for_Assessment.md` (3 offen)
- `generated/distilled/Amnesty International_2024_Coded_injustice_Surveillance_and_discrimination.md` (2 offen)
- `generated/distilled/An_2025_Measuring_gender_and_racial_biases_in_large.md` (1 offen)
- `generated/distilled/Arias López_2023_Digital_literacy_as_a_new_determinant_of_health_A.md` (1 offen)
- `generated/distilled/Articulate_2025_How_to_Create_Inclusive_AI_Images_A_Guide_to.md` (1 offen)
- `generated/distilled/Bai_2025_Explicitly_unbiased_large_language_models_still.md` (2 offen)
- `generated/distilled/Barman_2024_Beyond_transparency_and_explainability_On_the.md` (2 offen)
- `generated/distilled/Benlian_2025_The_AI_literacy_development_canvas_Assessing_and.md` (5 offen)
- `generated/distilled/Biegelbauer_2023_Leitfaden_Digitale_Verwaltung_und_Ethik.md` (3 offen)
- `generated/distilled/Bisconti_2024_A_formal_account_of_AI_trustworthiness_Connecting.md` (2 offen)
- `generated/distilled/Browne_2024_Engineers_on_responsibility_feminist_approaches.md` (3 offen)
- `generated/distilled/Browne_2024_Tech_workers'_perspectives_on_ethical_issues_in.md` (2 offen)
- `generated/distilled/Charlesworth_2024_Flexible_intersectional_stereotype_extraction.md` (1 offen)
- `generated/distilled/Chee_2025_A_Competency_Framework_for_AI_Literacy_Variations.md` (1 offen)
- `generated/distilled/Cher_2024_Exploring_machine_learning_to_support.md` (2 offen)
- `generated/distilled/Chisca_2024_Prompting_fairness_Learning_prompts_for_debiasing.md` (1 offen)
- `generated/distilled/Chiu_2025_AI_literacy_and_competency_definitions,.md` (4 offen)
- `generated/distilled/Ciston_2024_Intersectional_Artificial_Intelligence_Is.md` (1 offen)
- `generated/distilled/Debnath_2024_Can_LLMs_reason_about_trust_A_pilot_study.md` (1 offen)
- `generated/distilled/Dencik_2024_Automated_government_benefits_and_welfare.md` (2 offen)
- `generated/distilled/Engelhardt_2025_Voll_(dia)logisch_Ein_Werkstattbericht_über_den.md` (3 offen)
- `generated/distilled/European Commission. Joint Research Centre._2017_DigComp_2.1_the_digital_competence_framework_for.md` (1 offen)
- `generated/distilled/Fraile-Rojas_2025_Female_perspectives_on_algorithmic_bias.md` (1 offen)
- `generated/distilled/Freinhofer_2025_Prompten_nach_Plan_Das_PCRR-Framework_als.md` (1 offen)
- `generated/distilled/Fujii_2024_Bildungsteilhabe_-_Flucht_-_Digitalisierung_Eine.md` (1 offen)
- `generated/distilled/Gallegos_2024_Bias_and_fairness_in_large_language_models_A.md` (6 offen)
- `generated/distilled/Gengler_2024_Faires_KI-Prompting_–_Ein_Leitfaden_für.md` (1 offen)
- `generated/distilled/Guerra_2023_Feminist_reflections_for_the_development_of.md` (2 offen)
- `generated/distilled/Hall_2024_A_systematic_review_of_sophisticated_predictive.md` (1 offen)
- `generated/distilled/Hayati_2024_How_Far_Can_We_Extract_Diverse_Perspectives_from.md` (3 offen)
- `generated/distilled/He_2024_On_the_steerability_of_large_language_models.md` (1 offen, Stufe 2 sah ein verändertes Zitatende)
- `generated/distilled/Hooshyar et al._2025_Towards_responsible_AI_for_education_Hybrid.md` (2 offen)
- `generated/distilled/James_2023_Algorithmic_decision-making_in_social_work.md` (2 offen)
- `generated/distilled/Jarke_2024_Who_cares_about_data_Data_care_arrangements_in.md` (1 offen)
- `generated/distilled/Jarke_2025_Datafied_ageing_futures_Regimes_of_anticipation.md` (2 offen)
- `generated/distilled/Jin_2025_GLAT_The_generative_AI_literacy_assessment_test.md` (2 offen)
- `generated/distilled/Jääskeläinen_2025_Intersectional_analysis_of_visual_generative_AI.md` (2 offen)
- `generated/distilled/Karagianni_2025_The_EU_artificial_intelligence_act_through_a.md` (1 offen)
- `generated/distilled/Klinge_2024_A_sociolinguistic_approach_to_stereotype.md` (1 offen)
- `generated/distilled/Kong_2024_Developing_an_artificial_intelligence_literacy.md` (1 offen)
- `generated/distilled/Lahoti_2023_Improving_diversity_of_demographic_representation.md` (1 offen)
- `generated/distilled/Laine_2025_Avoiding_Catastrophe_Through_Intersectionality_in.md` (1 offen; gleiche Quelle wie McCrory_2024, J=0.996)
- `generated/distilled/Lanzetta_2024_Artificial_Intelligence_Competence_Needs_for.md` (1 offen)
- `generated/distilled/Lau_2023_Dipper_Diversity_in_Prompts_for_Producing_Large.md` (1 offen)
- `generated/distilled/Lin_2022_Artificial_Intelligence_in_a_Structurally_Unjust.md` (1 offen)
- `generated/distilled/Linnemann_2025_Künstliche_Intelligenz_in_der_Sozialen_Arbeit.md` (2 offen)
- `generated/distilled/Lütz_2024_The_AI_Act,_gender_equality_and.md` (3 offen)
- `generated/distilled/Ma_2023_Intersectional_Stereotypes_in_Large_Language.md` (1 offen)
- `generated/distilled/Maeda_2025_Toward_Agency‐Centered_span.md` (1 offen)
- `generated/distilled/McCrory_2024_Avoiding_catastrophe_through_intersectionality_in.md` (1 offen; gleiche Quelle wie Laine_2025)
- `generated/distilled/Mei_2023_Assessing_GPT's_bias_towards_stigmatized_social.md` (2 offen)
- `generated/distilled/Meilvang_2024_Decision_support_and_algorithmic_support_The.md` (1 offen)
- `generated/distilled/Moreau_2024_Failing_our_youngest_On_the_biases,_pitfalls,_and.md` (1 offen)
- `generated/distilled/Navigli_2023_Biases_in_large_language_models_Origins,.md` (2 offen)
- `generated/distilled/Ng_2022_Using_digital_story_writing_as_a_pedagogy_to.md` (2 offen)
- `generated/distilled/OECD_2023_Advancing_Accountability_in_AI.md` (1 offen)
- `generated/distilled/Ovalle_2023_Factoring_the_Matrix_of_Domination_A_Critical.md` (2 offen)
- `generated/distilled/Pan_2025_LIBRA_Measuring_bias_of_large_language_model_from.md` (2 offen)
- `generated/distilled/Park_2025_AI_algorithm_transparency,_pipelines_for_trust.md` (2 offen)
- `generated/distilled/Parrish_2022_BBQ_A_hand-built_bias_benchmark_for_question.md` (2 offen)
- `generated/distilled/Parrish_2025_Self-debiasing_large_language_models_Zero-shot.md` (1 offen)
- `generated/distilled/Patton_2023_ChatGPT_for_Social_Work_Science_Ethical.md` (5 offen)
- `generated/distilled/Peng_2022_A_Literature_Review_of_Digital_Literacy_over_Two.md` (5 offen)
- `generated/distilled/Pinski_2024_AI_literacy_for_users_–_A_comprehensive_review.md` (1 offen)
- `generated/distilled/Ricaurte Quijano_2024_Towards_Substantive_Equality_in_Artificial.md` (1 offen)
- `generated/distilled/Ricaurte_2024_How_can_feminism_inform_AI_governance_in_practice.md` (6 offen)
- `generated/distilled/Rodriguez_2024_Introducing_Generative_Artificial_Intelligence.md` (1 offen)
- `generated/distilled/Rodríguez-Martínez_2024_Ethical_issues_related_to_the_use_of_technology.md` (5 offen)
- `generated/distilled/Ruiz_2024_AI_Literacy_A_Framework_to_Understand,_Evaluate,.md` (1 offen)
- `generated/distilled/Salinas_2025_What’s_in_a_name_Auditing_large_language_models.md` (3 offen)
- `generated/distilled/Sant_2024_The_power_of_prompts_Evaluating_and_mitigating.md` (2 offen)
- `generated/distilled/Santos_2025_How_large_language_models_judge_cooperation.md` (1 offen)
- `generated/distilled/Schneider_2018_Der_Einfluss_der_Algorithmen_Neue_Qualitäten.md` (1 offen)
- `generated/distilled/Schneider_2022_Exploring_opportunities_and_risks_in_decision.md` (1 offen)
- `generated/distilled/Schönauer_2025_Akzeptanz_von_KI_und_organisationale.md` (3 offen)
- `generated/distilled/Shafie_2025_More_or_less_wrong_A_benchmark_for_directional.md` (8 offen)
- `generated/distilled/Shin_2024_Can_prompt_modifiers_control_bias_A_comparative.md` (3 offen)
- `generated/distilled/Shukla_2025_Investigating_AI_systems_examining_data_and.md` (2 offen)
- `generated/distilled/Siapka_2023_Towards_a_Feminist_Metaethics_of_AI.md` (1 offen)
- `generated/distilled/Siddals_2024_It_happened_to_be_the_perfect_thing_Experiences.md` (1 offen)
- `generated/distilled/Sinders_2017_Feminist_Data_Set.md` (2 offen)
- `generated/distilled/Slesinger_2024_Training_in_Co-Creation_as_a_Methodological.md` (1 offen)
- `generated/distilled/Small_2023_Generative_AI_and_opportunities_for_feminist.md` (2 offen)
- `generated/distilled/Sperling_2024_In_search_of_artificial_intelligence_(AI).md` (2 offen)
- `generated/distilled/Strauß_2024_CAIL_–_Critical_AI_Literacy_Kritische.md` (1 offen)
- `generated/distilled/Studeny_2025_Digitale_Werkzeuge_und_Machtasymmetrien.md` (1 offen)
- `generated/distilled/Sūna_2024_Diskriminierung_durch_Algorithmen_–_Überlegungen.md` (5 offen)
- `generated/distilled/Taeihagh_2025_Governance_of_generative_AI_A_comprehensive.md` (3 offen)
- `generated/distilled/Tang_2024_GenderCARE_A_Comprehensive_Framework_for.md` (1 offen)
- `generated/distilled/Toupin_2024_Shaping_feminist_artificial_intelligence.md` (3 offen)
- `generated/distilled/UNESCO_2021_Recommendation_on_the_Ethics_of_Artificial.md` (2 offen)
- `generated/distilled/UNESCO_2024_Women4Ethical_AI_Global_cooperation_for.md` (6 offen)
- `generated/distilled/Unknown_AI_competency_framework_for_students.md` (1 offen)
- `generated/distilled/Unknown_Artificial_Intelligence_in_Social_Sciences_and.md` (1 offen)
- `generated/distilled/Vethman_2025_Fairness_Beyond_the_Algorithmic_Frame_Actionable.md` (1 offen)
- `generated/distilled/Voutyrakou_2025_Algorithmic_Governance_Gender_Bias_in.md` (3 offen)
- `generated/distilled/Waag_2023_Rationalisierung_durch_Digitalisierung.md` (3 offen)
- `generated/distilled/Wajcman_2023_Feminism_Confronts_AI_The_Gender_Relations_of.md` (3 offen)
- `generated/distilled/Wang_2024_A_survey_on_fairness_in_large_language_models.md` (1 offen)
- `generated/distilled/Wang_2025_Multilingual_Prompting_for_Improving_LLM.md` (3 offen; gleiche Quelle wie die Volltext-Datei Wang_2024_Multilingual, J=0.998)
- `generated/distilled/West_2023_Discriminating_Systems_Gender,_Race,_and_Power_in.md` (2 offen)
- `generated/distilled/Wilson_2024_AI_tools_show_biases_in_ranking_job_applicants'.md` (2 offen; gleiche Quelle wie Wilson_2024_Gender,_race, J=0.997)
- `generated/distilled/Wilson_2024_Gender,_race,_and_intersectional_bias_in_AI.md` (3 offen; gleiche Quelle wie Wilson_2024_AI_tools)
- `generated/distilled/Wong_2020_Broadening_artificial_intelligence_education_in.md` (1 offen)
- `generated/distilled/Wu_2025_Bias_in_decision-making_for_AI's_ethical_dilemmas.md` (1 offen)
- `generated/distilled/Wudel_2025_What_is_Feminist_AI.md` (1 offen)
- `generated/distilled/Yan_2024_Promises_and_challenges_of_generative_artificial.md` (3 offen)
- `generated/distilled/Yuan_2025_The_cultural_stereotype_and_cultural_bias_of.md` (2 offen)
- `generated/distilled/Yunusov_2024_MirrorStories_Reflecting_Diversity_through.md` (3 offen)
- `generated/distilled/Zakharova_2024_Tensions_in_digital_welfare_states_Three.md` (2 offen)
- `generated/distilled/Zannone_2023_Intersectional_Fairness_A_Fractal_Approach.md` (1 offen)
- `generated/distilled/Zeng_2025_Governing_discriminatory_content_in.md` (2 offen)
- `generated/distilled/Zhang_2025_Learning_About_AI_A_Systematic_Review_of_Reviews.md` (3 offen)
- `generated/distilled/Zhao_2025_Thinking_like_a_scientist_Can_interactive.md` (3 offen)
- `generated/distilled/van Toorn_2024_Introduction_to_the_digital_welfare_state.md` (1 offen)

## Aufgelöst als Quellendublette, nicht migriert

Maschinell belegt über Volltext-Identität (Shingle-Jaccard J über die committeten Volltexte) beziehungsweise vollständige Zitat-Auflösung im Volltext der kanonischen Quelle. Je Quelle trägt genau ein Distillat die Belegkette in `10_distillates/`; diese Einträge brauchen keine Stufe-3-Verifikation, sie sind durch die kanonische Quelle abgedeckt. Offene F-Befunde der Dubletten selbst sind damit gegenstandslos.

- `generated/distilled/Gohar_2023_Survey.md`, Dublette von Gohar_2023_A_Survey_on_Intersectional_Fairness_in_Machine (alle Zitate im selben Volltext aufgelöst)
- `generated/distilled/Ovalle_2023_Factoring.md`, Dublette von Ovalle_2023_Factoring_the_Matrix_of_Domination_A_Critical (Zitat-Inhaltssuche; die kanonische Quelle wartet selbst mit F)
- `generated/distilled/Singh_2025_reparative.md`, Dublette von Singh_2025_A_reparative_turn_in_AI (alle Zitate im selben Volltext aufgelöst)
- `generated/distilled/Wudel_2025_What.md`, Dublette von Wudel_2025_What_is_Feminist_AI (Titel-Identität; die kanonische Quelle wartet selbst mit F)
- `generated/distilled/Asseri_2025_Prompt_engineering_techniques_for_mitigating.md`, Dublette von Asseri et al._2025_Prompt_Engineering_Techniques_for_Mitigating (J=0.998, migriert)
- `generated/distilled/Boetto_2025_Artificial_Intelligence_in_Social_Work_An_EPIC.md`, Dublette von Baker_2025_Artificial_intelligence_in_social_work_An_EPIC (J=0.998, Zotero-DOI 10.1080/0312407X.2025.2488345, migriert)
- `generated/distilled/Unknown_Artificial_Intelligence_in_Social_Work_An_EPIC.md`, Dublette von Baker_2025 (J=0.997)
- `generated/distilled/Kaneko_2024_Evaluating_gender_bias_in_large_language_models.md`, Dublette der Quelle des migrierten Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large (J=0.996, identischer Metadaten-Titel)
- `generated/distilled/Chisca_2024_Prompting_techniques_for_reducing_social_bias_in.md`, Fehlattribution; Volltext-Heading nennt Kamruzzaman und Kim, Version desselben Werks wie das migrierte Kamruzzaman_2024_Prompting_techniques_for_reducing_social_bias_in (J=0.534 zwischen den Versionen, Zotero-Mehrheit Kamruzzaman/Kim)
- `generated/distilled/Goldkind_2024_The_end_of_the_world_as_we_know_it_ChatGPT_and.md`, Dublette von Goldkind_2023_The_End_of_the_World_as_We_Know_It_ChatGPT_and (J=0.990, gleicher DOI 10.1093/sw/swad044), am 2026-07-18 de-migriert

Die bibliographische Zusammenführung der Dubletten-Records in Zotero bleibt Operator-seitig; diese Liste registriert nur die Vault-Konsequenz, ein Distillat je Quelle.
