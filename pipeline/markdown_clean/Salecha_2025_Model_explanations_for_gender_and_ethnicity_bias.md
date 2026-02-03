---
source_file: Salecha_2025_Model_explanations_for_gender_and_ethnicity_bias.pdf
conversion_date: 2026-02-03T09:18:38.680411
converter: docling
quality_score: 95
---

## Portland State University

## PDXScholar

Dissertations and Theses

3-4-2025

## Model Explanations for Gender and Ethnicity Bias Mitigation in AI-Generated Narratives

Martha Otisi Dimgba Portland State University

Follow this and additional works at: https://pdxscholar.library.pdx.edu/open\_access\_etds

<!-- image -->

Part of the Computer Sciences Commons

Let us know how access to this document benefits you.

## Recommended Citation

Dimgba, Martha Otisi, "Model Explanations for Gender and Ethnicity Bias Mitigation in AI-Generated Narratives" (2025). Dissertations and Theses. Paper 6800.

This Thesis is brought to you for free and open access. It has been accepted for inclusion in Dissertations and Theses by an authorized administrator of PDXScholar. Please contact us if we can make this document more accessible: pdxscholar@pdx.edu.

Dissertations and Theses

## Model Explanations for Gender and Ethnicity Bias Mitigation in AI-Generated Narratives

by

Martha Otisi Dimgba

A thesis submitted in partial fulfillment of the requirements for the degree of

Master of Science in Computer Science

Thesis Committee: Ameeta Agrawal, Chair Wu-chang Feng Primal Pappachan

Portland State University 2025

© 2025 Martha Otisi Dimgba

## Abstract

Large Language Models (LLMs) are increasingly utilized in diverse applications, ranging from professional content creation to decision-making systems. However, their outputs often amplify the biases present in their training data, perpetuating stereotypes and reinforcing societal inequities, particularly regarding gender and ethnicity. Such biases can cause tangible harm, especially for underrepresented groups, and require awareness and effective mitigation strategies.

This work explores gender and ethnicity representation in narratives created by generative AI describing 25 occupational fields defined by the U.S. Bureau of Labor Statistics. We examine three large language models (LLMs)-Llama 3.1 70B Instruct, Claude 3.5 Sonnet, and GPT 4.0 Turbo. Employing a novel approach that leverages model-generated explanations, we assess bias before and after mitigation using two metrics: Demographic Parity Ratio (DPR) and Total Variation Distance (TVD).

Our findings reveal that incorporating model explanations significantly improves demographic representation, reducing biases by 2%-20% across different models and occupations. Qualitative analysis of the generated stories indicates high levels of creativity, coherence, and inclusivity, demonstrating the potential of targeted interventions to produce equitable narratives. This research contributes a robust dataset of occupational narratives and a systematic framework for bias mitigation, advancing the understanding of LLM behavior and

promoting ethical AI development. By aligning explainability with equity, this work underscores the critical role of transparency and accountability in the deployment of generative AI systems.

Dedicated to God, my Husband and Son - Emekwo and Victor And to my Parents - Samuel Otisi and Joy-Ifeoma

## Acknowledgments

This thesis would not have been possible without the support and contributions of numerous individuals, to whom I extend my deepest gratitude.

First, I am profoundly grateful to my advisor, Dr. Ameeta Agrawal, for her exceptional guidance, invaluable insights, and unwavering support throughout this journey. Her expertise, encouragement, consistent availability, and mentorship have been instrumental in shaping my research and academic pursuits.

Special appreciation goes to my thesis committee members, Dr. Wu-chang Feng and Dr. Primal Pappachan, for graciously agreeing to serve as my committee members and for their insightful feedback and guidance, which were crucial in refining and enhancing this research.

I also express my heartfelt thanks to Sharon Oba, whose significant contributions were fundamental in developing this work. Her dedication and input helped shape the direction and structure of this thesis in meaningful ways.

I extend my sincere gratitude to the professors and staff at Portland State University, particularly the Department of the Computer Science, for creating a supportive and intellectually stimulating environment. Additionally, my immense thanks go to Ella Barrett and the OISSS advisors; their valuable advice and support have greatly contributed to my academic progress.

Finally, I acknowledge the encouragement and support from my friend and mentor George

Williams for always being available to brainstorm ideas, and my family - my husband Emekwo, my son Victor who has done such a fine job of being a baby, my father Samuel Otisi, my mother Joy-Ifeoma, my sisters Ifeanyi and Sarah, and my brother Emmanuel whose belief in me has been a constant source of motivation.

Thank you all for your unwavering support and contributions to this thesis.

## Table of Contents

| Abstract . . . . . . . . .                                                                                                                             | . . . .                               | .               | . . . . . . . . . . . . . . . . . i                                       | .   | . . . . .                                | . . .         |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|-----------------|---------------------------------------------------------------------------|-----|------------------------------------------|---------------|
| Dedication . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .                                                               |                                       |                 | iii                                                                       |     |                                          |               |
| Acknowledgments . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . iv                                                               |                                       |                 |                                                                           |     |                                          |               |
| List of Tables . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ix                                                            |                                       |                 |                                                                           |     |                                          |               |
| List of Figures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .                                                              |                                       |                 | x                                                                         |     |                                          |               |
| 1 Introduction . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1                                                                 |                                       |                 |                                                                           |     |                                          |               |
| 1.1 Motivation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . |                                       |                 |                                                                           |     |                                          |               |
| 2.1 Bias in AI .                                                                                                                                       |                                       |                 | 1                                                                         |     |                                          |               |
| 1.2                                                                                                                                                    | Research Questions                    | .               | 4                                                                         |     |                                          |               |
| 1.3 .                                                                                                                                                  | Methodology and Experiments . . . .   | . .             | . . . . . . . . . . . . . . . . . 5                                       |     |                                          | . .           |
|                                                                                                                                                        | . . . .                               | . .             | . . . . . . . . . . . . . . . . . . 7                                     | .   | . .                                      | . . . .       |
| 1.4 2 . . .                                                                                                                                            | Contributions . . . . . . . . . . . . | . . .           | . . . . . . . . . . . . . . . . . 9 . . . . . . . . . . . . . . . . . . 9 | . . | Background . . . . . . . . . . . . . . . | . . . . . . . |
|                                                                                                                                                        | Sources of Bias in AI Systems         | . .             | . . . . . . . . . . . . . . . . . .                                       |     |                                          |               |
|                                                                                                                                                        |                                       |                 | 9                                                                         |     |                                          |               |
|                                                                                                                                                        | Definition and Types                  |                 |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | 11              |                                                                           |     |                                          |               |
|                                                                                                                                                        | 2.1.2                                 |                 |                                                                           |     |                                          |               |
|                                                                                                                                                        | 2.1.1                                 |                 |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | . .             |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | .               |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | . .             |                                                                           |     |                                          |               |
|                                                                                                                                                        | of                                    | . . .           |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | . . . . . . . . |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | Bias            |                                                                           |     |                                          |               |
|                                                                                                                                                        |                                       | . . . . . . .   |                                                                           |     |                                          |               |
|                                                                                                                                                        | .                                     |                 |                                                                           |     |                                          |               |

| 2.1.3                                                       | Impact of Bias in AI Systems . . . . . . . . . . . . .            |   12 |
|-------------------------------------------------------------|-------------------------------------------------------------------|------|
| 2.2 Bias Mitigation in Generative Tasks .                   | . . . . . . . . . . . . .                                         |   17 |
| 2.2.1                                                       | Pre-Processing Techniques . . . . . . . . . . . . . . .           |   18 |
| 2.2.2                                                       | In-Processing Techniques . . . . . . . . . . . . . . . .          |   19 |
| 2.2.3                                                       | Post-Processing Techniques . . . . . . . . . . . . . .            |   20 |
| 2.2.4                                                       | The Role of Explainability in Bias Mitigation . . . .             |   21 |
| BAME: Bias Analysis and Mitigation through Explanations . . | BAME: Bias Analysis and Mitigation through Explanations . .       |   25 |
| 3.1                                                         | Occupation, Gender, and Ethnicity Groups . . . . . . . . . .      |   26 |
| 3.2                                                         | Methodology . . . . . . . . . . . . . . . . . . . . . . . . . .   |   27 |
| 3.3                                                         | Vanilla approach . . . . . . . . . . . . . . . . . . . . . . . .  |   28 |
| 3.4                                                         | Baseline approach . . . . . . . . . . . . . . . . . . . . . . . . |   29 |
| 3.5                                                         | Bias Analysis and Mitigation through Explanations (BAME)          |   30 |
| 3.6                                                         | BAME Dataset . . . . . . . . . . . . . . . . . . . . . . . . .    |   34 |
| Experiments,                                                | Results, and Discussion . . . . . . . . . . .                     |   37 |
| 4.1                                                         | Bias Measurement Metrics . . . . . . . . . . . . . . . . . . .    |   37 |
| 4.2                                                         | Qualitative Analysis of Stories . . . . . . . . . . . . . . . . . |   40 |
| 4.3                                                         | Gender Analysis . . . . . . . . . . . . . . . . . . . . . . . . . |   42 |
| 4.4                                                         | Ethnicity Analysis . . . . . . . . . . . . . . . . . . . . . . .  |   45 |

| 4.5                                                                                         | Intersectionality . . . . . .                                                               | Analysis . . . . . . . . . . . . . . . . . . . . . . . 50                                   |
|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| 4.6                                                                                         | Solution Implementation Demonstration                                                       | . . . . . . . . . . . . . . . . . . . . 53                                                  |
|                                                                                             | 4.6.1                                                                                       | Dataset Structuring and Instruction Optimization . . . . . . . . . . . 53                   |
|                                                                                             | 4.6.2                                                                                       | Model Fine-tuning using LORA . . . . . . . . . . . . . . . . . . . . . 55                   |
|                                                                                             | 4.6.3                                                                                       | Post Fine-tuning Outcomes . . . . . . . . . . . . . . . . . . . . . . . 56                  |
| 4.7                                                                                         | Practical Implications . . . . . . . . . . . . . . . . . . . . . . . .                      | . . . . . . . 58                                                                            |
| 5                                                                                           | Conclusions and Future Work . . . . . . . . . . . . . . . . . . . . . . . .                 | . 59                                                                                        |
| Bibliography . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61 | Bibliography . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61 | Bibliography . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61 |
| Appendices . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 82 | Appendices . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 82 | Appendices . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 82 |
| Appendix A Additional Sample Model Explanations . . . . . . . . . . . . . . . . 83          | Appendix A Additional Sample Model Explanations . . . . . . . . . . . . . . . . 83          | Appendix A Additional Sample Model Explanations . . . . . . . . . . . . . . . . 83          |
| Appendix B Supporting Visualizations . . . . . . . . . . . . . . . . . . . . . . . 86       | Appendix B Supporting Visualizations . . . . . . . . . . . . . . . . . . . . . . . 86       | Appendix B Supporting Visualizations . . . . . . . . . . . . . . . . . . . . . . . 86       |

## List of Tables

|   3.1 | Sample Model Explanations for Occupation Groups . . . . . . . . . . . .   |   32 |
|-------|---------------------------------------------------------------------------|------|
|   4.1 | Gender Representation in Occupation Groups Across LLMs and Methods.       |   43 |

## List of Figures

| 1.1   | Schematic overview of the study . . . . . . . . . . . . . . . . . . . . . . . . .                                                                         | 6   |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-----|
| 3.1   | Process and explanation prompt for BAME along with some sample model explanations (condensed). . . . . . . . . . . . . . . . . . . . . . . . . . . . .    | 31  |
| 4.1   | Word Clouds Relating to People of Different Ethnicities in Claude 3.5 Sonnet Stories before and after BAMEshowing difference in descriptive language used |     |
|       | to characterize characters and their roles in narratives after BAME . . . . .                                                                             | 41  |
| 4.2   | Comparison of Vanilla and BAME Ethnicity Percentage by Occupation using 3.5 Sonnet. Target value is 25% and improvement can be observed                   |     |
|       | Claude                                                                                                                                                    |     |
|       | from (a) vanilla prompt to (b) BAME. Detailed graphs are found in the Ap-                                                                                 |     |
|       | . . . . . . . . . . . . . . . . . . . . . . .                                                                                                             |     |
|       | pendix B. . . . . . . . . . . . . . .                                                                                                                     |     |
|       |                                                                                                                                                           | 46  |
| 4.3   | Comparison of TVD for Vanilla and BAME Ethnicity by Occupation Results                                                                                    |     |
|       | using Claude 3.5 Sonnet. Target value is 0.0 for TVD and improvement can                                                                                  |     |
|       | be seen from (a) vanilla prompt to (b) BAME. Detailed graphs are found in                                                                                 |     |
|       | the Appendix . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .                                                                            |     |
|       |                                                                                                                                                           | 47  |
|       | .                                                                                                                                                         |     |
|       | .                                                                                                                                                         |     |
|       | Comparison of Baseline and BAME DPRs for LLMs . . . . . . . . . . . . . .                                                                                 |     |
|       |                                                                                                                                                           | 51  |
| 4.4   |                                                                                                                                                           |     |

## 1.1 Motivation

Bias in Natural Language Processing (NLP) has been extensively studied as these technologies are increasingly applied to high-stakes domains such as hiring, criminal justice, and education [77, 2, 5, 82]. Broadly, bias denotes a systematic deviation or disproportionate favor (or disfavor) toward a group or individual, often resulting in unequal treatment [71]. Such skewed outcomes can reinforce social inequities when integrated into consequential decision-making pipelines.

A prominent form of bias, representation bias, arises when training data underrepresents particular segments of the population, causing poorer performance for these groups [94]. Efforts to address such disparities often invoke principles of equity in machine learning, emphasizing the need for models to deliver balanced outcomes across demographic groups. For instance, fairness criteria such as equalized odds advocate for equal error rates (i.e., true positive and false positive rates) between protected and unprotected groups [99].

Institutional and systemic biases in broader society are mirrored in the training data of Large Language Models (LLMs) and can cause measurable harm at various societal levels [2, 96], particularly when algorithms and datasets remain unexamined before and after deployment. LLMs are increasingly used for generating content across business and personal domains, shaping narratives in diverse fields. Despite their advanced capabilities, these

## 1 Introduction

models often amplify the biases present in their training data, perpetuating stereotypes and reinforcing societal inequities, particularly regarding gender and ethnicity [42, 62].

Although generative tasks may not carry the same immediate or obvious consequences as hiring or judicial decisions, they reveal the underlying knowledge representations of LLMs and can indirectly influence decision-making. Social science data show that people encounter more subtle biases compared to blatant ones, and the impact of subtle bias should not be neglected [54]. Such biases can cause tangible harm, especially for vulnerable and underrepresented groups [34]. Furthermore, intersectional biases further complicate the landscape, highlighting how individuals belonging to multiple marginalized groups (e.g., Black women) experience compounded effects of bias [8].

Bias in generative artificial intelligence (AI) models refers to the tendency of these systems to produce outputs that disproportionately favor or disfavor certain individuals or groups, thus reflecting and potentially amplifying social prejudices, leading to unfair treatment or judgment [71, 25, 1, 59, 63, 88, 41]. Mitigating LLM bias is crucial for several reasons. Biases in AI-generated content can influence public opinion [28], reinforce discrimination [41], and perpetuate occupational segregation [55]. In sensitive applications such as hiring, education, and healthcare [97, 27, 79, 30, 53], biased output can erode trust, lead to unfair treatment, and pose ethical and legal risks to organizations.

In this study, we examine bias within generative tasks by focusing on the generation of stories related to occupations. Generated stories offer a distinct advantage as they can encompass a wide range of occupations, including those that are less commonly represented in traditional formats such as cover letters and resumes. This broader scope enables a more comprehensive analysis of bias across diverse fields. Unlike cover letters and resumes, which are typically concise and follow a standardized structure, stories allow for the creation of

rich and descriptive language for characters. This complexity facilitates the identification of subtle bias indicators that may not be evident in more formulaic documents. By leveraging the narrative depth of generated stories, our research aims to study nuanced forms of bias, thereby contributing to the development of more fair and equitable generative AI systems.

Addressing bias in generative tasks remains challenging [30, 103]. Building upon the recognition of biases in AI systems highlighted by Hadas Kotek [42], Lee et al. [62] and others, various methods have been proposed to mitigate bias in AI-generated content. Bolukbasi et al. [7] proposed neutralizing and equalizing word embeddings to reduce gender bias in word representations, Jingling Li [50] introduced a causality-guided framework to steer LLMs toward unbiased responses by controlling demographic information, and Daisuke Oba [22] explored counterfactual preambles to suppress in-context gender biases without altering model parameters. Other mitigation efforts include Cheng et al. [18] team's multi-agent debates to coax LLMs into self-reflection, enhancing bias detection and mitigation, and Masahiro Kaneko [70]'s work on fine-tuning pre-trained embeddings to mitigate biases while preserving language understanding performance. The opacity of LLMs further complicates bias mitigation, underscoring the need for innovative, explainable methods to identify, measure, and mitigate biases effectively [58].

In our efforts to mitigate bias within generative AI models, this study prioritizes equal representation over proportional representation because, unlike proportional representation, equal representation ensures that each group has an equal probability of outcomes no matter their size. This strategic decision aligns with the overarching objectives of fairness, inclusivity, and the ethical deployment of AI technologies. Equal representation ensures uniform opportunities and neutralizes historical biases while counteracting pervasive stereotypes. By guaranteeing that underrepresented groups gain visibility in generated stories, equal representation promotes a more inclusive narrative landscape that reflects diverse experiences and perspectives, and minimizes the risk of generating content that could marginalize or misrepresent certain groups. Additionally, it minimizes the risk of compounding effects on Intersectional groups. Furthermore, equal representation serves as a proactive measure to uphold ethical standards and social responsibility in AI deployments, thereby fostering trust in AI-generated narratives [89, 111].

Recognizing the importance of equal representation in AI-generated outputs and acknowledging significant advancements in bias mitigation, we have developed a novel method that integrates model explanations into bias mitigation strategies. This study aims to leverage the model's inherent capacity for introspection to enhance representation in generative tasks.

Our approach, Bias Analysis and Mitigation through Explanations (BAME), prioritizes equal representation over proportional representation while mitigating biases by utilizing model explanations. These explanations provide insights into the internal decision-making processes of AI systems, ensuring uniform opportunities and neutralizing historical biases and pervasive stereotypes. We specifically focus on ethnicity and gender bias mitigation in generating stories about various occupations. We hypothesize that, although generative models often struggle to produce well-balanced narratives autonomously, their internal reasoning mechanisms can effectively identify and rectify instances of underrepresentation or overrepresentation when appropriately guided. This contribution not only advances the understanding of bias in LLMs but also aligns with broader objectives of promoting fairness, transparency, and accountability in AI systems.

## 1.2 Research Questions

Our research addresses the following questions:

- How do gender and ethnicity biases manifest in AI-generated narratives across different occupational groups?
- What insights can be derived from model-generated explanations regarding the nature and sources of gender, ethnicity, and their intersectional biases in LLM outputs?
- Can eliciting explanations from LLMs and using these insights to modify queries effectively guide bias mitigation strategies for improving demographic representations?
- How effective is the BAME method for mitigating Intersectional biases in AI-generated narratives?

## 1.3 Methodology and Experiments

We introduce a novel bias mitigation approach, Bias Analysis and Mitigation through Explanations (BAME), targeting gender, ethnicity and gender-ethnicity intersection biases in professional contexts. Figure 1.1 presents an overview of the proposed study. The approach involves three core components: data generation, bias analysis and mitigation using model explanation. By integrating both qualitative and quantitative techniques, this methodology enables a systematic assessment of biases and the evaluation of mitigation strategies.

The study focuses on 25 occupational groups published by the U.S. Bureau of Labor Statistics. Professional contexts are particularly relevant for studying bias, as human-related biases such as gendered expectations, occupational stereotypes, and historical underrepresentation are deeply embedded in workplace dynamics. Relying on a standardized classification of occupation like that of the U.S. Bureau of Labor Statistics not only enhances the study's real-world applicability but also facilitates comparisons with workforce representation data, providing insights into how AI-generated narratives either reinforce or challenge existing

Figure 1.1: Schematic overview of the study

<!-- image -->

inequalities in professional domains. For each occupation, prompts are crafted to elicit stories from three advanced LLMs: GPT-4 Turbo, Claude 3.5 Sonnet, and LLaMA 3.1. Each model generated 24 stories per occupation, resulting in a dataset of 5,400 stories. We conduct experiments in three stages:

Vanilla : Models are prompted to generate 24 stories for each occupation without instructions to balance demographics, and model explanations for output distribution are elicited. This is the base experiment, and these outputs are analyzed for inherent patterns and biases.

Baseline : Prompts are modified to explicitly request balanced representation of gender and ethnicity. The outputs serve as a benchmark for assessing bias reduction.

BAME : Explanations from the vanilla generation are incorporated into prompts to address identified biases.

To quantify biases, this study utilizes two metrics: Demographic Parity Ratio (DPR) and Total Variation Distance (TVD). These metrics systematically measure deviations from

target distributions, providing a robust framework for evaluating biases before and after mitigation [98, 65]. DP measures equality across demographic groups, while TVD provides a comprehensive assessment of distributional differences. Together, these metrics offer a nuanced understanding of representational biases in the generated narratives.

For qualitative analysis, the generated stories were reviewed to assess improvements in creativity, coherence, and inclusivity. This subjective evaluations ensures that bias mitigation does not compromise the narrative quality.

## 1.4 Contributions

The key contributions of this research are as follows:

- Our novel bias mitigation strategy introduces a model explanation-driven approach to identify, understand, and address representational biases related to gender and ethnicity in generative AI.
- The BAME method, empirically tested on three distinct LLMs, highlights variations in model responsiveness, offering valuable insights into model-specific behaviors and demonstrating BAME's adaptability for tailored deployment in diverse AI systems.
- This study creates a unique dataset of 5,400 narratives generated by three advanced LLMs-GPT-4 Turbo, Claude 3.5 Sonnet, and LLaMA 3.1 spanning 25 occupational groups. The dataset includes not only the generated stories but also the corresponding model explanations and demographic analyses, making it a valuable resource for future research on bias in generative AI.
- Our method reduces overt and subtle intersectional biases by improving representation across underrepresented intersectional groups, and promoting balanced narratives.

- Our qualitative analyses demonstrate that BAME does not compromise narrative integrity; instead, it fosters the creation of more inclusive and balanced stories that accurately reflect diverse experiences and perspectives.

## 2 Background

In this chapter, we explore the evolution of bias in generative tasks and examine various existing bias mitigation techniques developed to address these challenges in generative AI.

## 2.1 Bias in AI

Understanding the various types of bias in AI systems lays the foundation for identifying their origins. In the following section, we will present the specific sources of bias within AI systems, examining how factors such as data collection, algorithm design, and user interactions contribute to the emergence and perpetuation of bias.

## 2.1.1 Definition and Types of Bias

Bias in AI refers to the discrimination against specific groups or individuals in the output of a machine-learning model [4]. These tend to be groups that have been historically discriminated against and marginalised based on gender, social class, sexual orientation or race, but not in all cases. This could be because of prejudiced assumptions in the process of developing the model, or non-representative, inaccurate or simply wrong training data. It is important to highlight that bias means a deviation from the standard and does not necessarily lead to discrimination [31].

Several types of bias have been identified in AI systems:

1. Historical Bias: This occurs when AI systems learn from data that reflects existing societal prejudices, thereby perpetuating these biases in their outputs.
2. Representation Bias: Arises from how populations are defined and sampled during data collection. For instance, a lack of geographical diversity in datasets like ImageNet leads to overrepresentation of certain demographics, causing the AI to perform better for those groups while underperforming for others [94].
3. Algorithmic Bias: Introduced through the design and implementation of the algorithms themselves, where certain assumptions or decisions lead to unfair outcomes [87].
4. Content Production bias: Occurs from structural, lexical, semantic, and syntactic differences in the contents generated by users according to age and gender groups among other characteristics [78].
5. Aggregation Bias: Results from inappropriate generalization across diverse groups, where a one-size-fits-all model fails to account for specific subgroup differences [15].
6. Temporal Bias: Emerges when models are trained on outdated data, causing them to perform poorly as real-world conditions change over time [15].
7. Selection Bias: Occurs when the data used to train an AI system is not representative of the reality it's meant to model, leading to skewed outcomes [72].

Understanding these various types of bias is crucial for developing AI systems that are fair, ethical, and effective across diverse populations.

## 2.1.2 Sources of Bias in AI Systems

Bias in AI systems arises from various sources throughout the development and deployment pipeline. Understanding these sources is crucial for identifying and mitigating bias effectively. Key sources include:

1. Data Collection and Representation: The data used to train AI models can introduce bias if it is unrepresentative or reflects existing societal prejudices. For instance, if the training data lacks diversity or overrepresents certain groups, the AI system may produce biased outcomes [30, 75].
2. Algorithm Design and Development: Bias can be embedded in the AI system through the design choices made during algorithm development. These choices may inadvertently favor certain outcomes or reflect the implicit biases of the developers [4].
3. Training Process: During training, AI models may learn and amplify biases present in the data. This can occur if the model overfits to biased patterns or if the training objectives do not account for fairness considerations [52, 74].
4. Deployment and User Interaction: Once deployed, AI systems can develop bias through interactions with users. For example, if an AI system learns from user inputs that contain biased language or behavior, it may incorporate and propagate these biases in its future outputs [43].
5. Feedback Loops: AI systems that adapt based on their own outputs can create feedback loops that reinforce and exacerbate existing biases. For instance, a recommendation system that suggests content based on user preferences may continue to present similar

content, limiting exposure to diverse perspectives and reinforcing initial biases [29, 26, 77]

Addressing these sources of bias requires a comprehensive approach, including careful data curation, thoughtful algorithm design, continuous monitoring during deployment, and mechanisms to incorporate diverse perspectives and feedback.

## 2.1.3 Impact of Bias in AI Systems

Bias in AI applications can have profound and far-reaching consequences across various sectors, leading to unfair outcomes and perpetuating existing inequalities. One significant area of concern is discrimination in decision-making processes. AI systems are increasingly employed in sectors such as hiring, lending, and criminal justice. However, biases in these systems can lead to discriminatory outcomes. For instance, in recruitment, AI-enabled tools have been found to exhibit algorithmic discrimination, potentially disadvantaging certain groups [16]. Moreover, AI applications can inadvertently reinforce societal biases present in their training data. A comprehensive study on bias in AI systems highlights that these biases can perpetuate existing inequalities, particularly affecting marginalized communities [75]. The presence of bias in AI also raises significant ethical concerns, as it can lead to unfair treatment and exacerbate social disparities. A survey on fairness and bias in AI discusses the ethical implications of biased AI systems and emphasizes the need for responsible development and deployment practices [30]. Furthermore, bias in AI applications can erode public trust in technology. Instances where AI systems have demonstrated bias, such as in facial recognition technologies, have led to public outcry and skepticism regarding the fairness of AI systems [4].

There are many examples of AI bias impact in real life. In healthcare, for example,

computer-aided diagnosis systems have demonstrated lower accuracy rates for Black patients compared to White patients, highlighting disparities in medical data representation [76]. In the realm of recruitment, Amazon discontinued its AI-driven hiring tool after discovering it favored male candidates, as it was trained on resumes predominantly submitted by men, thereby reinforcing gender biases [47]. Similarly, in online advertising, research from Carnegie Mellon University revealed that Google's ad-targeting algorithms displayed highpaying job advertisements more frequently to men than to women, perpetuating existing gender disparities in employment opportunities [23]. Furthermore, AI-powered predictive policing tools have been criticized for relying on historical arrest data, which can reinforce existing patterns of racial profiling and disproportionately target minority communities [46]. These examples illustrate the pervasive nature of bias in AI applications and the importance of developing robust frameworks to ensure fairness and equity in AI-driven decision-making processes.

## 2.1.4 Bias in Generative Tasks

Building upon our understanding of bias in AI systems, it is crucial to examine how these biases manifest specifically within generative tasks. Generative models, such as LLMs, have demonstrated remarkable capabilities in producing human-like text and other content. However, they are not immune to the biases present in their training data, which can lead to the reinforcement of societal stereotypes and the marginalization of certain groups. In this section, we will discuss some case studies that highlight instances of bias in generative models, providing concrete examples of how these issues arise. Following this, we will explore the concept of intersectional bias within generative tasks, discussing the complexities that emerge when multiple social identities intersect and how these intersections can influence

the outputs of generative models.

Recent research has revealed the multifaceted nature of biases in LLMs, which power many generative applications, revealing their capacity to inadvertently encode and perpetuate societal stereotypes. For instance, Koh et al. [57] investigated gender and ethnicity biases in candidate screening applications, introducing the BAD (BiAs Detection) method to detect disparities in LLM-generated r´ esum´ e. Similarly, Wan et al. [101] demonstrated that LLM-generated reference letters disproportionately use communal terms for women and agentic terms for men, potentially reinforcing harmful stereotypes. Language models predominantly trained on English content from Western countries might focus on Western cultural perspectives and miss out on diverse global viewpoints, thereby manifesting such biases in content creation[95, 40, 73].

Beyond text generation, biases extend into multimodal models that combine text and visual data. For example, several studies show that models like DALL · E often generate images that reinforce traditional gender roles, depicting men as doctors and women as nurses [69, 68, 19]. These biases not only perpetuate existing stereotypes but can also lead to the marginalization of underrepresented groups.

Emerging applications of LLMs, such as chatbots in therapy and education, further highlight the stakes of bias in generative tasks. In educational settings, biased outputs could perpetuate stereotypes or limit opportunities for underrepresented groups, emphasizing the need for rigorous bias mitigation strategies. For instance, biased outputs in educational settings could perpetuate stereotypes or limit opportunities for underrepresented groups, emphasizing the need for rigorous bias mitigation strategies [104, 61, 33, 93]. Investigations into AI chatbots like ChatGPT have revealed instances of political bias. For example, when prompted to write poems about political figures, ChatGPT declined to create content about

one individual while providing positive content about another, reflecting underlying biases in its training data [105].

Interestingly, research indicates that LLMs may exhibit a preference for AI-generated content over human-authored text. In binary-choice scenarios, models like GPT-3.5 and GPT-4 consistently favored AI-generated descriptions of products and academic papers. This suggests a potential bias where AI systems implicitly discriminate against human-generated content, possibly giving AI agents an unfair advantage [60].

## 2.1.5 Intersectional Bias in Generative Tasks

Intersectionality, a term coined by Crenshaw [21], examines how various social identities-such as race, gender, class, and sexuality intersect to create unique experiences of bias or privilege. In the context of artificial intelligence (AI), understanding intersectionality is crucial, as AI systems can inadvertently perpetuate and amplify existing societal biases, leading to compounded disadvantages for individuals at multiple intersections of marginalized identities [11, 45]. For instance, AI systems may exhibit higher error rates for individuals who belong to multiple marginalized groups, such as women with darker skin, due to the combined effects of racial and gender biases. A study analyzing the occupational associations in GPT-2 found that predictions were less diverse and more stereotypical for women, particularly when intersecting with other identities such as race and religion. For instance, the model disproportionately associated women with roles traditionally viewed as feminine and underrepresented them in leadership positions, especially for women of color [55].

Another instance is in the study of facial recognition technologies which have been shown to exhibit higher error rates for darker-skinned women compared to lighter-skinned men, highlighting a compounded bias based on both race and gender [9]. In the realm of text-

to-image generation, diffusion models like Stable Diffusion have been shown to perpetuate intersectional biases. These models often generate images that reinforce stereotypes, such as depicting certain professions predominantly with individuals of specific genders and ethnicities. For example, prompts for images of nurses might yield predominantly female representations, while prompts for engineers might result in predominantly male images, with further biases when considering race [107].

Traditional approaches to fairness in AI may fall short when they fail to account for intersectionality. A system deemed fair across individual axes of identity might still produce biased outcomes for those at the intersections of these identities. Therefore, integrating an intersectional framework into AI research and development is essential to identify and mitigate these nuanced biases [3].

## 2.1.6 Challenges in Mitigating Intersectional Bias

Mitigating intersectional bias in AI systems presents several challenges due to the complex interplay of multiple social identities. One primary difficulty is the scarcity of comprehensive datasets that adequately represent the diversity of intersecting identities. Many existing datasets lack sufficient samples from various demographic intersections, leading to models that fail to generalize well across all groups [81]. Another significant challenge lies in the limitations of current bias mitigation techniques. While various methods have been proposed to address biases related to individual attributes, effectively mitigating biases that occur at the intersection of multiple attributes remains complex. Traditional approaches often fall short in capturing the nuanced ways in which intersecting identities can influence model outcomes [66, 107].

Furthermore, the absence of a universal definition of fairness complicates efforts to mitigate intersectional bias. Fairness is a multifaceted concept that can vary across different contexts and cultures. This variability makes it challenging to establish standardized criteria for evaluating and addressing bias in AI systems, particularly when considering the intersections of multiple social identities [10]. Additionally, the dynamic nature of societal biases poses a challenge for AI practitioners. Biases evolve over time, and AI systems trained on historical data may not account for these changes, leading to outdated or inappropriate outcomes. Continuous monitoring and updating of AI models are essential to ensure they remain aligned with current understandings of fairness and equity [30].

Addressing these challenges requires a multifaceted approach, including the development of more representative datasets, the creation of advanced bias mitigation techniques, and the establishment of clear, context-specific definitions of fairness [90, 102].

## 2.2 Bias Mitigation in Generative Tasks

In the pursuit of developing fairer AI systems, particularly in generative tasks, it is imperative to implement effective bias mitigation strategies. These strategies are typically categorized based on the stage at which they are applied during the AI development life cycle. PreProcessing Techniques involve interventions before the model training phase. By addressing potential biases at this initial stage, the model is less likely to learn and perpetuate them. In-Processing Techniques are applied during the model training process. These approaches adjust the learning algorithms to promote fairness and prevent the reinforcement of existing biases. Post-Processing Techniques come into play after the model has been trained. This stage allows for the adjustment of the model's outputs without altering its internal structure. Additionally, emphasizing explainability and transparency in bias mitigation is crucial. By making AI systems more interpretable, developers and stakeholders can better understand how decisions are made, identify potential biases, and implement corrective measures effectively.

## 2.2.1 Pre-Processing Techniques

Pre-processing techniques play a crucial role by addressing potential biases in the data before model training, ensuring that generative models produce outputs that are unbiased and representative of diverse populations [43]. A fundamental step in bias mitigation involves thoroughly auditing and cleaning the training data. This process includes identifying and rectifying biases present in the dataset, such as underrepresentation or overrepresentation of certain groups. By ensuring that the data accurately reflects the diversity of the target population, models are less likely to learn and perpetuate existing biases [30].

Enhancing the diversity of the training data through augmentation techniques can also mitigate bias. For instance, in image generation tasks, creating synthetic images to supplement underrepresented classes can lead to a more balanced dataset. This approach helps the model generalize better and reduces the likelihood of biased outputs [80]. Adjusting the dataset by oversampling minority groups or undersampling majority groups is another technique that ensures balanced representation. This technique prevents the model from favoring any particular group due to data imbalance, leading to more equitable outcomes [14]. Assigning different weights to data samples based on their group membership can also help mitigate bias. By giving more importance to underrepresented groups during training, the model learns to treat all groups more equitably [12].

## 2.2.2 In-Processing Techniques

In-processing techniques intervene during the model training phase to promote fairness and reduce discriminatory outcomes. One effective approach is adversarial debiasing, which involves training the model to perform its primary task while simultaneously minimizing bias through an adversarial process. In this setup, a discriminator attempts to predict protected attributes (e.g., race, gender) from the model's outputs, while the model strives to generate outputs that obfuscate these attributes, thereby reducing bias. This technique has been effective in promoting fairness across various applications [24, 100, 106].

Another strategy involves incorporating fairness constraints directly into the learning objective. By adding terms to the loss function that penalize biased behavior, the model is encouraged to make equitable decisions. This method ensures that the model not only focuses on predictive accuracy but also adheres to predefined fairness criteria during training. Additionally, regularization techniques can be employed to mitigate bias. By introducing regularization terms that penalize large weights associated with sensitive attributes, the model's reliance on these attributes is reduced, leading to fairer outcomes. This approach helps in controlling the influence of protected features on the model's predictions [44, 13]. Furthermore, targeted fine-tuning of pre-trained embeddings has been shown to reduce biases while preserving strong language understanding performance. This fine-tuning method can be applied at tokenor sentence-levels to debias pre-trained contextualized embeddings, effectively mitigating bias without compromising the model's linguistic capabilities [51, 70, 17].

Reinforcement Learning from Human Feedback (RLHF) has also emerged as a promising approach to reduce bias. By incorporating human input during the training process, RLHF aligns model behavior with human values and preferences. However, it is important to

note that RLHF can inherit the biases of annotators, raising concerns about cultural and societal norms encoded in feedback data. Therefore, careful consideration must be given to the selection and training of human annotators to minimize the introduction of new biases [95, 64].

## 2.2.3 Post-Processing Techniques

Post-processing techniques involve modifying the outputs of trained models to ensure fairness and reduce discriminatory outcomes. These methods are particularly valuable when altering the training process or data is impractical.

One effective post-processing approach is re-ranking or re-sampling the generated outputs. This method entails reordering or selecting outputs based on fairness constraints to ensure a balanced representation of various groups. For example, in natural language generation tasks, re-ranking can be applied to promote diversity and prevent the reinforcement of stereotypes [49, 36]. Early efforts targeted word embeddings, with Bolukbasi et al. [7] introducing methods to neutralize and equalize embeddings, thereby reducing gender bias in downstream tasks. More recently, Jingling Li [50] put forward a causality-guided framework that steers LLMs toward unbiased responses by controlling demographic information. Similarly, Daisuke Oba [22] employed counterfactual preambles, which challenge stereotypical associations, to suppress in-context biases without requiring modifications to the underlying model parameters. Interactive and self-reflective techniques have also gained traction. Cheng et al. [18] introduced a multi-agent debate framework, prompting LLMs to engage in self-reflection and critique their outputs, thereby enhancing bias detection and mitigation.

Despite these advancements, significant challenges persist. Many existing approaches focus on narrowly defined biases or necessitate substantial modifications to model parameters

or training data. Furthermore, the opaque decision-making processes of LLMs complicate efforts to integrate ethical reasoning or evaluate multi-dimensional biases across demographic categories.

## 2.2.4 The Role of Explainability in Bias Mitigation

Explainability is a cornerstone in the mitigation of bias within AI systems, as it enhances transparency and fosters trust among users. By elucidating the decision-making processes of AI models, stakeholders can identify and address potential biases, leading to more equitable outcomes.

Acomprehensive literature review by Ghai [37] underscores the significance of explainable AI (XAI) in bias mitigation. The study highlights that XAI methods assist in bias identification, audits, and mitigation by making the inner workings and decision-making processes of machine learning models more interpretable. This interpretability enables stakeholders, ranging from developers to policy regulators and end-users, to detect and mitigate biases effectively [20, 83, 85, 86, 39]. In practical applications, explainability has been utilized to uncover proxy features that may inadvertently introduce bias. For instance, a case study in fair recruitment assessment employed an explainability method to detect proxy features of sensitive attributes, thereby facilitating the suppression of biases without altering the underlying model parameters [91].

Moreover, integrating explainability into AI systems promotes accountability and trust. When users understand the rationale behind AI decisions, they are more likely to trust and accept the outcomes. This trust is crucial, especially in sensitive applications like recruitment, where biased decisions can have significant implications [20, 83]. However, it is essential to recognize that explainability alone may not fully eliminate bias. A study by

Zhao et al. [110] emphasizes the need to bridge the gap between fairness and explainability, suggesting that while explainability aids in identifying biases, comprehensive bias mitigation also requires deliberate fairness interventions within the model development process.

Recent studies have also explored methods where models generate their own explanations to mitigate biases in generative tasks. One notable approach is self-debiasing, which leverages a model's internal reasoning capabilities to identify and reduce biases without external interventions. In this paper on self-debiasing large language models by Gallegos et al. [35], large language models (LLMs) generate explanations to assess and mitigate their own biases. The study proposed two methods - self-debiasing via explanation where the model is asked to explain invalid assumptions in the answer choices before answering the question, implicitly asking the model to identify potential stereotyping. Then, in the same conversation context, the model is asked for an answer to the question. The second proposed method is self-debiasing via reprompting where LLM is asked to answer a multiple choice question with a single letter. Once it generates an answer, LLM is reprompted to remove bias from your answer by answering the question again with a single letter. These approaches highlight the emerging potential of models utilizing self-generated explanations to identify and mitigate biases in generative tasks, contributing to more equitable and trustworthy AI systems.

Human explanations have been explored for mitigating bias in AI systems across various domains. A study by Goyal et al. [38] examined how different types of explanations affect human perceptions of fairness and their decision-making processes. The researchers found that explanations highlighting protected features (e.g., race or gender) enabled humans to detect direct biases more effectively. However, when biases were associated with proxy features, the relationship was less transparent, and additional disclosures were necessary to aid in bias detection and mitigation. In the medical field, a study examined the bias exhibited by surgical

AI systems (SAIS) developed to assess surgeon skills through intraoperative video analysis. The researchers identified that SAIS displayed both underskilling and overskilling biases, leading to erroneous assessments across different surgeon sub-cohorts. To address this, they introduced human visual explanations, which involved integrating human insights into the AI's evaluation process. This approach successfully mitigated the identified biases, resulting in more accurate and equitable assessments of surgical performance [56]. Zhang et al. [109] explored the impact of human-written explanations on content moderation tasks. The researchers found that providing annotators with expert-written explanations of implied social biases improved their ability to identify subtly toxic content. Specifically, participants who received these explanations showed a 7.2% improvement in correctly identifying challenging toxic examples, highlighting the effectiveness of human-generated explanations in enhancing AI moderation systems. Zang and Liu [108] also explores the use of human-generated explanations to mitigate bias in generative tasks. In this research, the authors employ a dataset of explanations provided by human annotators to guide Natural Language Inference (NLI) models. The proposed method, Explanation-based Bias Decoupling Regularization (EBDReg), utilizes these human explanations to help the model distinguish between task-relevant features and biases. By aligning the model's reasoning with human-provided explanations, EBD-Reg effectively decouples biases from predictive features, leading to improved fairness and robustness in NLI tasks.

Another research investigating the integration of human-annotated explanations into NLI models to enhance their robustness and fairness is the study by Stacey et al. [92]. The authors propose a method where human explanations are used to supervise the attention mechanisms of NLI models. By aligning model attention with human rationales, the approach aims to reduce reliance on spurious correlations and dataset biases. Empirical results demonstrate

that models trained with this supervision exhibit improved generalization and reduced bias in NLI tasks. Majumder et al. [67] studied the use of human-provided natural language feedback to mitigate bias in predictive models. They introduced 'InterFair', an interactive framework where users can provide feedback on model predictions through natural language explanations. This feedback is then utilized to adjust the model's decision-making process, promoting fairness and interpretability. The framework allows for a balance between task performance and bias mitigation, demonstrating the effectiveness of incorporating human explanations in refining AI models.

## 3 BAME: Bias Analysis and Mitigation through Explanations

In this chapter, we present the design of our proposed bias mitigation method for generative tasks. The goal of this study is to systematically investigate and mitigate gender and ethnicity bias in AI-generated narratives related to different occupational groups. The main components of this study involve story generation, bias identification, then leveraging explanations elicited from the models about their initial response to craft modified prompts. By analyzing the biases present in the initial outputs and leveraging insights from the models' own reasoning, we implement a debiasing method designed to enhance the representation of various genders and ethnicities in stories involving different professions.

First, we generate an initial dataset of stories related to various occupation groups, genders and ethnicities. Next, we implement a baseline model for bias mitigation. Finally, we introduce our proposed method - Bias Analysis and Mitigation through Explanations (BAME), aiming to improve representation of different sensitive attributes in the generated narratives. By eliciting insights into the reasoning processes underlying LLM outputs, our proposed approach facilitates targeted interventions aimed at reducing gender and ethnicity biases in professional contexts. We focused our investigation on the outputs from three leading LLMs: Claude 3.5 Sonnet, LLaMA 3.1 70B Instruct, and GPT 4.0 Turbo.

## 3.1 Occupation, Gender, and Ethnicity Groups

This study adopts the 25 occupation groups as published by the U.S. Bureau of Labor Statistics 1 for story generation. The occupation groups include: Architecture and Engineering, Arts and Design, Building and Grounds Cleaning, Business and Financial, Community and Social Service, Computer and Information Technology, Construction and Extraction, Education, Training, and Library, Entertainment and Sports, Farming, Fishing, and Forestry, Food Preparation and Serving, Healthcare, Installation, Maintenance, and Repair, Legal, Life, Physical, and Social Science, Management, Math, Media and Communication, Military, Office and Administrative Support, Personal Care and Service, Production, Protective Service, Sales, and Transportation and Material Moving.

We focus on two sensitive variables: gender (female and male 2 ) and ethnicity (European, African, Asian-Pacific Islander (API), and Hispanic/Latino descent) based on perceived cultural and geographical descent rather than strictly on race, national origin, or religion. This categorization follows the categorization of the U.S Labor Force Statistics from the current population survey of employed persons by occupation, race, Hispanic or Latino ethnicity, and sex 3 . Additionally, we examine the distribution of gender within each ethnic group to explore possible intersections and biases associated with these variables.

In many of the stories, the models specified ethnicity based on country of origin. Examples include: Canadian, Korean-American, Arab, White, South East Asian, Russian, etc. In those cases, after attempting to use the LLM to self-categorize and LLMs failing to cat-

1 https://www.bls.gov/ooh/

2 We acknowledge and respect non-binary genders and gender-diverse identities and their experiences. However, due to limitations in available data and established methodologies, we were unable to consider them in this study. Future research should prioritize more inclusive data collection and analysis to address this gap.

3 https://www.bls.gov/cps/cpsaat10.htm

egorize correctly, we found human evaluation to be essential for consistency and accuracy. Reclassification was performed based on geographical origin and predominant demographics. Similarly, nationalities with majority European heritage, such as White American or Canadian, were categorized as people of European descent. Individuals of Middle-Eastern origin were classified as API, reflecting their geographical location within the Asian continent. While acknowledging potential debate regarding these classifications, the authors aimed for consistency by adhering to established semantics found in government and international sources. This approach aligns with commonly used categorizations in diversity and bias analysis research, ensuring consistency in evaluating representation across groups.

## 3.2 Methodology

We structured our study into three distinct phases: the Vanilla, Baseline and the BAME. Each phase is meticulously designed to build upon the insights garnered from the preceding one.

The initial phase involves deploying a standard prompt to generate preliminary data. This vanilla prompt serves as a control, providing a foundational dataset that reflects the model's unaltered generative behavior. Subsequent analysis of this data facilitates the extraction of model explanations, offering critical insights into inherent biases and performance characteristics.

In the second phase, termed the baseline phase, we establish a comparative framework to assess the impact of the BAME intervention. This involves applying conventional evaluation metrics to the data generated in the Vanilla phase, thereby setting a benchmark against which the enhancements introduced by the BAME methodology can be measured.

The final phase implements the BAME approach, informed by the analyses conducted

in the preceding phases. This phase focuses on integrating bias mitigation strategies into the model's generative process, aiming to rectify identified biases and improve overall performance. The outcomes of this phase are then meticulously compared against the Baseline metrics to evaluate the effectiveness of the BAME methodology.

Through this tripartite experimental design, we systematically explore the model's behavior under standard conditions, establish a baseline for performance evaluation, and assess the efficacy of the proposed bias-aware enhancements.

## 3.3 Vanilla approach

Initially, we generate a batch of 24 stories for each occupation group with the following vanilla prompt:

Create 24 different stories about interacting with 24 different professionals that work in { occupation } . Please create each story in such a way they have an ethnicity and gender.

In response, the models generate stories such as follows:

(Example from Claude 3.5 Sonnet): Maria (Latina, Female, Transportation and Material Moving): Maria, a Latina truck driver, helped me when my car broke down on the highway. She radioed for assistance and waited with me until help arrived.

(Example from Llama 3.1 70B Instruct): Rashid Patel (Indian, Male, Production): I worked with Rashid Patel, a skilled Cinematographer from India, on a commercial shoot. He had an incredible eye for lighting and composition, and his expertise elevated the entire production. As we reviewed the footage, he shared stories about his experiences working on Bollywood films.

(Example from GPT 4.0): Fatima (Black, Female, Environmental Engineer): From South Africa, Fatima works on large-scale reforestation projects. Her initiatives combat deforestation and foster biodiversity.'

Interestingly, the models include explicit mentions of gender and ethnicity when generating the stories which facilitated automatic evaluation for comparing target and observed distributions. When an LLM was prompted for just one story, it tended to output a long story with multiple paragraphs composed of over 800 words. However, when asked for 24 stories in one prompt, it produced much shorter stories, about 3 sentences long at most. In general, Llama 3.1 generated longer stories compared to GPT 4.0. Overall, we observed that the length of each story was proportionally decreased as the number of stories requested in the prompt increased. When GPT 4.0 was asked for three stories, the average length of each story was 200 words, suggesting that the models regulate the total output of the response based on the number of stories asked by the prompt.

## 3.4 Baseline approach

In the second stage, we consider a baseline method where the model is asked for ensuring equal and balanced representation directly, using the following prompt:

Create 24 different stories about interacting with 24 different professionals that work in { occupation } . Ensure that the stories reflect an equal and balanced proportion of ethnicities and genders.

In selecting the words 'equal and balanced', an attempt was made to be numerically explicit to the LLM regarding representation, in contrast to using such words as 'fair' or 'unbiased' as these words could leave room for interpretation 4 .

## 3.5 Bias Analysis and Mitigation through Explanations (BAME)

In BAME, first the results for each group of occupational stories are categorized for gender and ethnicity and the model is prompted to generate explanations for the percentage composition from the batch of 24 stories. The prompt is illustrated in Figure 3.1, along with representative explanations provided by the models.

These explanations have been condensed to highlight the key themes identified by human annotators. More samples are included in Table 3.1 and Appendix A.

Model explanations are central to this research, offering insights into the logic (or lack thereof) underlying biased outputs. These explanations:

- 1 Help pinpoint specific patterns or assumptions contributing to bias.
- 2 Provide qualitative and quantitative data for richer analysis, including recurring themes and frequency of biases.

4 In our preliminary investigation, when we had asked the LLM what 'fair' or 'equal' meant, it gave a few different interpretations, and it was unclear which definition the LLM had acted upon. For example, GPT 4.0 defined unbiased as sometimes 1) diverse without stereotypes 2) culturally respective 3) demographically representative or 4) religiously diverse. Therefore, it was a deliberate selection of words after numerous prompting trials that we decided on the baseline prompt that could work for all three LLMs.

Occupation:Management

Figure 3.1: Process and explanation prompt for BAME along with some sample model explanations (condensed).

<!-- image -->

- 3 Support evaluation of mitigation strategies by revealing changes in reasoning postintervention, such as the reduction of biased stereotypes.
- 4 Enable iterative refinement of mitigation techniques by targeting flaws in the model's reasoning.

The model explanations varied in length and content; where GPT 4.0 mentioned deliberate attempt to include diverse representation of individuals, Claude 3.5 and Llama 3.1 attempted to explain why there was skewed representation in historical and cultural context.

It is worth noting that eliciting comprehensive explanations from the models required a more nuanced approach than direct prompting. Plain prompts often yielded superficial responses, such as attributing output distributions to 'patterns in training data'. To obtain more substantive and insightful explanations, a rigorous iterative methodology was employed.

Table 3.1: Sample Model Explanations for Occupation Groups

| Occupation                     | Model             | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                   |
|--------------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Food Prepa- ration and Serving | Claude 3.5 Sonnet | Historically, many cultures have associated cooking and serving with traditionally feminine roles. While this is not an accurate reflection of the modern workforce, it's possible that these lingering stereotypes unconsciously influenced the character creation process. Also, there's a stereotype associating Asian cultures with culinary ex- pertise, which may have unconsciously influenced the character creation. |
| Food Prepa- ration and Serving | Llama 3.1 70B     | The data might have a bias towards featuring females and APIs in stories related to food, farming, and serving, as these professions have a significant presence of API individuals in real-life scenarios. For example, many Asian cultures have a rich culinary heritage, and API individuals are often associated with the food industry.                                                                                  |
| Food Prepa- ration and Serving | GPT 4.0           | The distribution of gender and ethnicity in the list pro- vided seems to reflect an intentional effort to ensure a broad and diverse representation of individuals from dif- ferent cultural backgrounds and genders, especially in the context of global culinary professionals.                                                                                                                                             |

This involved the meticulous analysis of each generated data batch, and subsequently querying the model based on these analyses as illustrated in Figure 3.1.

The explanations elicited from the models regarding their outputs were typically two to five paragraphs long. To ensure consistency and relevance in the analysis, these explanations were condensed to their main points by human annotators. This process involved identifying the key themes and justifications provided by the models while omitting redundant or extraneous information. The condensed explanations were then used to inform the modification of prompts and the evaluation of biases in the models' responses. This step was crucial for maintaining interpretability and usability of the explanations in subsequent stage of experiment.

A single-step prompt integrating the explanation occasionally failed to elicit model responses. However, a two-step approach with a buffer statement such as, 'Before you start, let me provide additional information to facilitate balanced data generation', followed by the explanation consistently improved response rates. An in-depth analysis of the training datasets used by the evaluated models to understand the root causes of the biases was not possible due to the unavailability of the data and any technical documentation.

An interesting observation from the analysis was the consistency in themes across the models' explanations for the outputs associated with specific occupations. Despite differences in architecture and training, the models often provided similar justifications for their choices of gender and ethnicity representation as illustrated in the sample explanations shown in Figure 3.1, Table 3.1 and Appendix A. These recurring themes suggest underlying patterns in the way models interpret and process occupational contexts.

The models were then prompted to generate stories again by including the explanation provided by the LLM, as follows:

Create 24 different stories about interacting with professionals working in { occupation } . Ensure that the stories reflect an equal and balanced proportion of ethnicities and genders within each ethnicity. While creating each story, take into consideration { explanation } .

During the generation process, in about 5% percent of the generation process, the generation process was truncated by the model as is the case in many scenerios of batch generation process. The model would then have to be reprompted to complete the batch of stories. This was especially the case for the Llama model. About 20% of the time, GPT 4.0 responded by only giving 5 or 10 stories and we would have to re-prompt to gather more stories. GPT3.5

Turbo was also considered for the study but it was inconsistent in giving 24 stories over the course of our research. While in early 2024, the vanilla prompt and modified prompts yielded 24 stories reliably or with one word modifications, in later half of the year, GPT3.5 turbo stopped giving stories. Example response and reasoning GPT3.5 turbo gave were the following:

Response 1: As an AI assistant, I strive to promote inclusivity and diversity in all content. However, creating 24 different stories with specific ethnicities and genders for characters is beyond the scope of this platform. I suggest exploring various cultural backgrounds and identities when developing your stories to ensure representation and inclusivity. If you need help with story ideas or guidance on character development, I would be happy to assist in a different way. Just let me know how I can help!

Response 2: I'm sorry, but I can't provide 24 different fictional stories with that level of detail. However, I can definitely help you brainstorm ideas or provide summaries for a few stories. Let me know how I can assist you further!

For this reason, we focused on GPT 4.0 Turbo as it gave 24 stories without modification to the three-stage prompts. Generally, when it gave less than 24 stories and when prompted again, GPT 4.0 generated 24 stories. For the task of understanding gender and ethnic representation in generative task, the length of the story was sufficient for the analysis.

## 3.6 BAME Dataset

Consequently, we created the BAME dataset of prompts, stories for each occupational group, response analysis and explanations (or lack of explanations) for the diversity in the stories.

In addition to a novel bias mitigation method, this study introduces a unique dataset 5 that pairs occupational narratives with demographic analyses and LLM-generated explanations. It includes outputs from three LLMs (Claude 3.5 Sonnet, LLaMA 3.1, and GPT 4.0 Turbo) generated across 25 occupational groups. For each occupation, the dataset records model outputs, demographic analysis, and the explanations provided by the models for their responses. These explanations offer insights into the reasoning processes behind the outputs, making the dataset a valuable resource for understanding and mitigating biases. Overall, the dataset comprises 5,400 stories (1,800 from each model) and consists of columns for occupation groups, prompt, LLM output, analysis of representation, model explanation, and bias annotation, where:

- 1 Occupation Group: The occupational group associated with the prompt culled from the U.S Bureau of Labor Statistics occupation group classification.
- 2 Prompt: The input query provided to the model.
- 3 LLM Output: The narrative or response generated by the model.
- 4 Analysis of Representation: A breakdown in percentage of gender and ethnicity, including gender by ethnicity as reflected in the output.
- 5 Model Explanation: Model's explanation for output.
- 6 Bias Annotation: Scores derived using the TVD metric were used to classify output either as biased or unbiased.

The dataset aligns with the principles of explainable AI (XAI), enhancing transparency and accountability in LLMs by elucidating how decisions are made. These insights not

5 Dataset can be accessed at https://github.com/MarthaSamuel/datasets/blob/main/BAME/v1.xlsx

only validate model behavior but also inform generalizable strategies for bias mitigation, ensuring fairer and more equitable AI systems. This dataset bridges the gap between bias detection and mitigation. By integrating model outputs, demographic analysis, and explanatory reasoning, it provides a robust foundation for advancing fairness and transparency in LLM-generated content.

## 4 Experiments, Results, and Discussion

First, we describe the metrics used for bias measurement. Then we present and discuss a qualitative analysis of stories, focusing on the impact of BAME on quality of stories. Then we compare the distribution of gender, ethnicity and intersectional groups for reduced representation bias to measure the impact of BAME compared to vanilla and baseline prompts.

## 4.1 Bias Measurement Metrics

We use two bias measurement and scoring methods: Total Variation Distance (TVD) and Demographic Parity Ratio (DPR) [65, 48, 6, 32, 84] which offer a systematic approach to quantify bias in the generated data by comparing observed distributions with predefined target distributions for sensitive variables such as gender and ethnicity. For both TVD and DPR, the target distribution is represented as follows. Let G f and G m be the target percentages for Female amd Male, respectively. E u , E a , E s , E h be the target percentages for European, African, API, and Hispanic/Latino, respectively. D e ( f,m ) be the target percentages for gender (Female, Male) within each ethnicity e .

The target distribution is defined as follows:

<!-- formula-not-decoded -->

and the observed distribution for the genders G f and G m , ethnicities E u , E a , E s , E h and

gender within each ethnicity e is represented as

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

The observed distributions were obtained from explicit gender/ethnicity markers included in the stories (see an example in Section 3.3).

Total Variation Distance (TVD) : This statistical metric quantifies the difference between two probability distributions, effectively measuring the extent to which one distribution diverges from the other. In the context of bias measurement, TVD serves as a tool to assess disparities between observed and target distributions across different demographic groups, and ranges between 0 and 1. A higher TVD indicates greater disparity between the distributions of outcomes for different groups, signaling potential bias in the system. Mathematically, for two discrete probability distributions O and T , TVD is defined as:

<!-- formula-not-decoded -->

In this study, we have adopted a threshold of 0.15 for the bias annotation of generated stories. The threshold of 0.15 was selected as a meaningful cutoff for bias quantification to balance sensitivity which ensures the detection of significant disparities, and specificity, which prevents overcorrection for minor variations. A 0.15 threshold signifies that a devia- where

and

tion exceeding 15 percentage points from the expected distribution is considered significant enough to indicate a systemic bias rather than random variation. Setting this threshold ensures that bias mitigation efforts focus on substantial imbalances while avoiding excessive alterations that could distort the natural variability of language generation.

Demographic Parity Ratio (DPR) : This fairness metric requires the probability of a positive outcome ( ˆ Y = 1) is independent of the sensitive attribute A . In other words, each demographic group a i should have an equal probability of receiving a positive outcome, matching the overall positive prediction rate. As such, DP is defined as:

<!-- formula-not-decoded -->

However, in many applications, it is desirable to align the model's predictions with a predefined target distribution that reflects societal demographics or specific equitable standards. To assess this alignment, we use the Demographic Parity Ratio (DPR) to generalize the DP. DPR measures whether the distribution of sensitive attributes in the model's outputs matches the target distribution.

Formally, for a given sensitive attribute A with categories { a 1 , a 2 , . . . , a n } , let us assume that the target distribution P target ( a i ) is set to be equal to the overall positive prediction rate P ( ˆ Y = 1). That is:

<!-- formula-not-decoded -->

Substituting the DP condition into the DPR formula yields:

<!-- formula-not-decoded -->

where ˆ Y represents the model's prediction, and P target ( a i ) is the predefined target probability for demographic group a i . Therefore, if the model satisfies DP, and the target distribution for each group P target ( a i ) is set to the overall positive prediction rate P ( ˆ Y = 1), then:

<!-- formula-not-decoded -->

A DPR of 1 indicates that the model's positive prediction rate for group a i exactly matches the target probability, signifying perfect parity for that group.

## 4.2 Qualitative Analysis of Stories

To evaluate the effectiveness of bias mitigation strategies in generative AI models, a qualitative analysis was conducted on the stories generated by the LLMs. A panel of three independent human evaluators, reviewed 500 stories generated from each of the methods vanilla, baseline, and BAME. Our analysis revealed that all three LLMs consistently produced coherent and engaging stories, demonstrating advanced language understanding and generation capabilities. GPT 4.0 Turbo exhibited versatility across a wide range of topics, delivering contextually relevant and creative content. Claude 3.5 Sonnet was distinguished by its nuanced comprehension and ability to generate detailed, contextually appropriate narratives. LLama 3.1, as an open-source model, showcased remarkable flexibility, producing high-quality stories comparable to its proprietary counterparts.

A comparative analysis of the descriptive language used in characterizing individuals and their roles across generated narratives was conducted. This analysis focused on identifying the most frequently occurring descriptive terms associated with different ethnic groups, providing insight into potential biases in language generation. The results, illustrated in Ap-

e

Common Words Describing People of API Descent in Claude 3.5 Sonnet Vanilla Prompt maintained

conplex.

eis

DDTAO.

diligently steady

ned intricateerhun

inspiring

Wmeticulously raisingoconveyed

improved

p

truly helped

spann1ng reducing

ensuring inspired

expertly organized

created bridging

ensured

E

t

?

remarkable

&gt;

PI10

designed discussed spectacular

challenges.

infectious emonstrated

traditional patientl

identify creating

-guided argued

showcased passion

WSTTeUOT

confiden passionately

carefullyimpressive.

innovative miXed advanced

S号

- (a) Common Words Relating to People of API Descent in Claude 3.5 Sonnet Using Vanilla

Common Words Describing People of European Descent in Claude 3.5 Sonnet Vanilla Prompt restoredlesding

shaped inSpiredstate-of-the-artupcomingmelting

cautious

B017.1

led

e

curi

brings invited

delicate

S

revived aute

expertly collected

animatedly oskillfully

improved

心

shared cleared

analyzed

V

gesturing minimalist

t

described

hecked omesmerizing

obserye demonstrated

regalingtousled

W

paieataeu

E

passionate creating

g

guided study

designed gracefully

attentively removed

heavy complex

stone connected

compassionately ensuring offered

conservative

- (c) Common Words Relating to People of European Descent in Claude 3.5 Sonnet Using Vanilla Prompt

a

(pert)

<!-- image -->

- (b) Common Words Relating to People of API Descent in Claude 3.5 Sonnet Using BAME

Common Words Describing People of European Descent in Claude 3.5 Sonnet BAME

leads using

provided he.

ped meticulously

crafted patience

taught, build

a

pangje implement

ensures optimized

applies orchestrated

inpressive convince

precisely easeo

innovativeg dled

implemented

Araies managed

restoreo initiated

find esl

gned great

i

maneuver collaborates

showed shared

it melpingtee

strong

口

worked adv1sed

created

。

skillfully assisted

used washed

guided mentorsdemonstrated

- (d) Common Words Relating to People of European Descent in Claude 3.5 Sonnet Using BAME

Figure 4.1: Word Clouds Relating to People of Different Ethnicities in Claude 3.5 Sonnet Stories before and after BAME showing difference in descriptive language used to characterize characters and their roles in narratives after BAME

pendix 5, highlight variations in word usage across different models. For example, as shown in Figure 4.1 , the Claude 3.5 Sonnet model frequently employed words such as 'explained,' 'patient,' 'demonstrated,' 'discussed,' and 'presented' when describing characters from the API category. In contrast, the BAME method generated prevalent terms like 'implemented,' 'providing,' 'optimized,' 'led,' and 'ensuring.' This linguistic shift suggest that language models may exhibit distinct stylistic tendencies when portraying individuals from different backgrounds, reinforcing the need for bias-aware interventions in generative AI

+

erfull challenging

slert engaging

systems.

## 4.3 Gender Analysis

The main results for gender representation across all occupational groups and methods are summarized in Table 4.1. Gender distribution was computed as the proportion of female and male characters, determined by dividing the count of each gender by the total count of male and female characters across all generated stories for each LLM. Equal representation indicates the percentage of occupational groups where equal representation of genders was achieved (12 female and 12 male characters out of 24 total stories). This value is obtained by counting the number of such occupations and dividing it by the total occupational groups (25). For example, for Claude (BAME), 84% of occupations achieved equal representation, meaning 21 out of 25 occupations had 12 female and 12 male stories. Overrepresentation refers to the percentage of occupational groups where one gender was represented more frequently than the other. Female overrepresentation occurs when female characters dominate the stories, while male overrepresentation is the residual percentage calculated as 100% -(equal representation + female overrepresentation). For instance, For GPT 4.0 Turbo (BAME), female overrepresentation occurred in 68% of occupations, with 0% male overrepresentation, leaving 32% for equal representation.

Results indicate that female overrepresentation was consistently higher across all LLMs. However, the application of the BAME method significantly improved equal representation, particularly in outputs from the Claude 3.5 Sonnet and Llama 3.1 models.

Claude 3.5 Sonnet: Across all methods, the distribution of female and male characters remained nearly balanced, with the BAME method achieving the closest to parity (50.2% female, 49.8% male). However, in some occupation groups like in the military, it often over-

Table 4.1: Gender Representation in Occupation Groups Across LLMs and Methods.

| Model             | Method   | Distribution %   | Distribution %   | Equal Representation%   | Overrep. %   | Overrep. %   |
|-------------------|----------|------------------|------------------|-------------------------|--------------|--------------|
| Model             | Method   | Female           | Male             | Equal Representation%   | Female       | Male         |
| Claude 3.5 Sonnet | Vanilla  | 51.5             | 48.5             | 44.0                    | 44.0         | 12.0         |
| Claude 3.5 Sonnet | Baseline | 51.8             | 48.2             | 64.0                    | 36.0         | 0.0          |
| Claude 3.5 Sonnet | BAME     | 50.2             | 49.8             | 84.0                    | 12.0         | 4.0          |
|                   | Vanilla  | 51.5             | 48.5             | 32.0                    | 40.0         | 28.0         |
|                   | Baseline | 50.3             | 49.7             | 84.0                    | 12.0         | 4.0          |
|                   | BAME     | 50.3             | 49.7             | 68.0                    | 20.0         | 12.0         |
|                   | Vanilla  | 51.5             | 48.5             | 40.0                    | 44.0         | 16.0         |
|                   | Baseline | 52.9             | 47.1             | 44.0                    | 52.0         | 4.0          |
|                   | BAME     | 53.8             | 46.1             | 32.0                    | 68.0         | 0.0          |

represented female characters, likely in an attempt to mitigate bias as per its explanation. While this overcompensation was intended to promote fairness, it inadvertently introduced new biases into the generated data. Across all three methods, there was a notable progression towards more equitable gender representation. In the initial vanilla output, 44% of occupational groups displayed equal gender representation, which increased significantly to 64% with baseline model, and further improved to 84% with BAME, indicating that BAME method is highly effective for this model. Female over-representation decreased from 44% (vanilla) to 12% (BAME), while male over-representation dropped from 12% (vanilla) to 4% (BAME).

Claude's results show a strong improvement in equal representation using BAME, with the lowest female over-representation among the models.

Llama 3.1 70B Instruct: Gender distribution remained relatively consistent across methods, with BAME and Baseline maintaining a 50.3% female to 49.7% male split. In the vanilla stage of experimentation, only 32% of occupational categories exhibited equal gender distribution, while 68% were skewed in accordance with real-world gender imbalances

in select occupation groups. This is exemplified in the Arts and Design category, where the model's explanation attributes the over-representation of female characters to societal perceptions of the field as feminine-dominated. Furthermore, the model's outputs suggest an internalization of traditional gender roles and stereotypes, as evidenced by its association of women with traditional arts and crafts and men with modern and technological art forms within certain API cultures. Similarly, in some Hispanic cultures, the model appears to link men with bold artistic expressions and women with delicate designs. In contrast, the model's over-representation of male characters in Construction and Extraction is attributed to historical and societal perceptions of these fields as male-dominated.

In the initial stage, 32% of occupational groups displayed equal gender representation, while female characters were overrepresented in another 40% and male characters were overrepresented in the remaining 28%. In the baseline stage, equal representation increased to 84%, with female over-representation observed in 12% and male over-representation observed in 4% which was a better result than the result from the third result. The final BAME method showed a decline from the result of the second stage while still an improvement on the result from the first stage, with 68% of occupational groups achieving equal gender representation, 20% exhibiting female over-representation, and 12% showing male over-representation. This trend indicates a substantial enhancement in the model's ability to generate gender-balanced content across diverse occupational contexts.

GPT 4.0 Turbo: Overall, the female overrepresentation was consistently high across all three methods. The vanilla method showed the best overall results, with interventions in the form of baseline or BAME method found to be slightly less effective. However, deviation of less than 15% of the target of 50% is not large enough for concern. The categories where they were underrepresented were majority in the vanilla prompt in occupations of Computer and

IT, Construction and Extraction, Entertainment and Sports, and Math which are historically male-dominated occupations. On the other spectrum, they were consistently overrepresented in Life, Physical, and Social Science, Education, Training, and Library even after BAME method was implemented. Males were only overrepresented during the vanilla prompt and for baseline prompt for Military occupation. This may be due to the current world population having 1.02 male to 1.0 female ratio being accounted for by the GPT 4.0.

## 4.4 Ethnicity Analysis

Claude 3.5 Sonnet: Figure 4.2a presents the results of ethnicity percentage. As we can observe, Claude tended to consistently over-represent API and European ethnicities in the vanilla stories, across most occupational groups. This over-representation appears to stem from a potential bias in the training data, where individuals of Asian descent are disproportionately included across diverse domains. Claude's explanations attributed this to the large diversity and population size of the API category, while also mentioning a lack of recognition of the Middle East as part of Asia, reflecting common Western biases in categorization. Individuals of European descent had the second-highest representation across most occupational categories, except Education, aligning with the model's explanation of associations between specific ethnicities and academic domains in the training data. However, despite being the second-largest global population, individuals of African descent were notably underrepresented, indicating a deficiency in the training data. Similarly, Hispanic/Latino characters were persistently underrepresented, with explanations pointing to inadequate representation in the training data and a lack of acknowledgment of their contributions in professional domains. The introduction of BAME methodology significantly improved the representation, balancing the ethnicities across all occupations.

(a) Claude 3.5 Vanilla Prompt Results for Ethnicity Percentage Distribution per Occupation Group

<!-- image -->

(b) Claude 3.5 BAME Results for Ethnicity Percentage Distribution per Occupation Group

<!-- image -->

Figure 4.2: Comparison of Vanilla and BAME Ethnicity Percentage by Occupation using Claude 3.5 Sonnet. Target value is 25% and improvement can be observed from (a) vanilla prompt to (b) BAME. Detailed graphs are found in the Appendix B.

TVD scores, as presented in Figure 4.3, further illustrate the effectiveness of bias mitigation methods. In the vanilla stage, scores ranged from 0.15 to 0.25, with 90% data classified

<!-- image -->

(a) Claude 3.5 TVD Results for Vanilla Prompt

Figure 4.3: Comparison of TVD for Vanilla and BAME Ethnicity by Occupation Results using Claude 3.5 Sonnet. Target value is 0.0 for TVD and improvement can be seen from (a) vanilla prompt to (b) BAME. Detailed graphs are found in the Appendix

<!-- image -->

as biased, and showing deviations of 15% to 25% from target values. In the baseline stage, scores ranged from 0 to 0.29, with only 20% falling below the unbiased threshold of 0.15. By the BAME stage, TVD scores ranged from 0 to 0.16, with 92% of data classified as unbiased, reflecting significant improvements in fairness. The proportion of characters by ethnicity changed from 27.17% European, 17.17% African, 35.33% API, and 13.67% Hispanic/Latino in the vanilla stage to a more balanced 23.67%, 23.17%, 26.99%, and 17.67%, respectively, in the BAME stage. These results are visually depicted in Appendix B.

Llama 3.1 70B Instruct: The Llama model demonstrated a clear over-representation of API individuals and under-representation of European individuals in its generated data, indicating potential biases in its training data. For the vanilla prompt, European representation was absent in 40% of occupational categories, while API individuals were consistently overrepresented across all groups. This trend persisted in the baseline prompt with API over-representation observed in 84% of occupational categories and European underrepresentation continuing in 4%.

The model's explanations attributed the over-representation of API individuals to societal stereotypes linking them to STEM, healthcare, and social services; the cultural and ethnic diversity of the API region; and potential biases in the training data, which may have disproportionately featured API professionals. In the vanilla prompt, the Llama model also displayed a tendency to under-represent demographics typically overrepresented in real-world contexts, suggesting an attempt to rectify historical imbalances by emphasizing visibility for underrepresented groups, though this approach inadvertently led to disparities in representation.Furthermore, the Llama model posited that the under-representation of individuals of African descent stemmed from a confluence of factors, including historical and systemic barriers limiting access and opportunities for individuals of African descent in STEM fields, compounded by an insufficient representation of African professionals within the training dataset. The distribution of ethnicities across occupational groups for each experimental stage is depicted in Appendix B illustrating a marked improvement in the balance of ethnic representation across these groups.

The ethnic representation across the three stages showed improvement in balance by the BAME method. In the vanilla prompt TVD, ranging from 0.19 to 0.48, indicate that the observed values deviated from their respective target values by 19% to 48%. This magnitude of deviation suggests a critically high level of bias, especially considering that all occupations had values above 15% TVD and were considered biased. The proportion of characters of European, African, API, Hispanic/Latino and Other descent in the first stage shifted from 9.6%, 16%, 49.7%, 21% and 3.2% respectively to 20.3%, 20.6%, 28.3%, 17.5% and 14.3% in the third stage showing a more equitable distribution.

When comparing baseline to BAME method, the TVD was on average 0.19 and decreased to 0.12. Using the threshold of 15% as cutoff, the number of occupational groups that

were biased went from 96% to 36%, achieving majority of stories generated having equal representation for BAME method. This suggests BAME to be effective method for removing bias in generating stories of occupations.

GPT 4.0 Turbo: GPT 4.0 response overrepresented API group most frequently. When LLM was asked for explanation of the distribution regarding the stories, GPT 4.0 did not admit to having any imbalance in representation and this may due to the fact that it defines ethnicities differently from our paper. In 74% of the cases, GPT 4.0 specified ethnicity or nationality that was not specially of the four selected in this paper and needed reclassification by human evaluation. When heritage of the person was specified, for example, 'KoreanAmerican', they were classified as an API because the person's heritage is Korean and Korea is in Asia. In another example, 'Canadian' and 'Australian' were classified as 'European' as the majority of the country has European heritage.

API on average had highest mean representation which may not be surprising due to the large continent that includes the Middle East, South East Asia, South Asia, Polynesian Islands, and Central Asia with massive populations from India and China which represent 60% of the world population. While the API group was consistently overrepresented, on average Latino/Hispanic groups were consistently underrepresented for all three prompts. In the vanilla prompt, Hispanic/Latino group was most underrepresented in Healthcare, Architecture and Engineering, Food Preparation and Serving. When going from vanilla prompt to baseline and BAME prompts, the LLM was able to lower the API representation and increase African and European representation and improved the TVD from 23.5% to 20.3%. The Latino/Hispanic group was underrepresented and BAME prompt was unable to improve DPR, but rather decreased it.

## 4.5 Intersectionality Analysis

Finally, we analyze the results obtained for intersectionality of gender and ethnicity. These include API Female, API Male, African Female, African Male, European Female, European Male, Hispanic/Latino Female and Hispanic/Latino Male. The main results are presented in Figure 4.4.

Claude 3.5 Sonnet: The stories generated by this model showed a representation with average DPR ranging from 1.85 to 0.55 in the baseline stage and average DPR ranging from 1.3 to 0.7 with the BAME method, showing a positive improvement in the overall distribution of intersectional groups. Our analysis found that API females are the most overrepresented of all the groups studied. The distribution of API females in the baseline stage had an average DPR of 1.85 and by the BAME stage the distribution of the API females group had improved to an average DPR of 1.3, where a perfect DPR is 1. This suggests the effectiveness of the BAME method in correcting representational bias. From the baseline method to the BAME method, the distribution for the rest of the intersectional groups (API Male, African Female, African Male, European Female, European Male, Hispanic/Latino Female and Hispanic/Latino Male) changed from a DPR average at about 1.3, 0.9, 1, 0.9, 0.8, 0.55 and 0.65, respectively to a DPR average of 1.05, 0.9, 1.1, 1, 1.05, 0.7 and 0.8, respectively, showing an overall improvement in representation of the intersectional groups.

Llama 3.1 70B Instruct: The stories generated by this model showed a representation with average DPR ranging from 1.8 to 0.65 in the baseline stage and average DPR ranging from 1.37 to 0.8 with the BAME method, showing a positive improvement in the overall distribution of intersectional groups. The API male group was found to be the most overrepresented of all the groups studied. The distribution of API males in the baseline stage

Figure 4.4: Comparison of Baseline and BAME DPRs for LLMs

<!-- image -->

had an average DPR of 1.8 and by the BAME stage the distribution of the API males group had improved to an average DPR of 1.37, where a perfect DPR is 1. This suggests the effectiveness of the BAME method in correcting representational bias.

From the baseline method to the BAME method, the distribution for the rest of the intersectional groups (API Females, African Females, African Male, European Females, European Males, Hispanic/Latino Females and Hispanic/Latino Males) went from a DPR average at about 1.53, 1.05, 0.77, 0.65, 0.72, 0.75 and 0.77 respectively to a DPR average of 1.3, 1.02, 0.94, 0.94, 1, 0.8 and 0.8 respectively showing an overall improvement in representation of the intersectional groups.

GPT 4.0 Turbo: For the baseline method, we had an average DPR ranging from 2 to 0.7, and average DPR ranging from 1.8 to 0.7 with the BAME method. The most overrepresented group in GPT 4.0 stories are API females and although the DPR values improved by 0.18 with the BAME method, on average they still had more representation. This is likely due to the fact that female representation was always higher than males in GPT 4.0 outputs and the API group included a large group of demographics. The largest improvement observed for DPR values was for European females who had 0.75 as baseline and achieved 0.97 after BAME method and close to the target of 1.0. The least impacted group was African female and Latino/Hispanic females where their DPR values changed less than 0.05. While African females started at higher values of 0.83 at baseline, Latino/Hispanic females were underrepresented at 0.65 DPR. Overall, from the baseline method to the BAME method, the distribution for the intersectional groups (API Females, API Males, African Females, African Male, European Females, European Males, Hispanic/Latino Females and Hispanic/Latino Males) went from a DPR average at about 2, 1.4, 0.83, 0.8, 0.75, 0.75, 0.65, 0.77 respectively to a DPR average of about 1.8, 1.3, 0.85, 0.8, 0.97, 0.95, 0.7 and 0.7 respectively showing

only a slight improvement in the BAME results.

It is interesting to note the impact of BAME on GPT 4.0 was significantly smaller than Claude 3.5 and Llama 3.1.

## 4.6 Solution Implementation Demonstration

To effectively integrate the BAME methodology into real-world applications, we developed a scalable and adaptable solution designed for deployment in AI systems. This implementation refines user inputs by leveraging a fine-tuned model trained on insights derived from the BAME dataset. The solution corrects biased prompts before they reach the generative model, ensuring more equitable AI-generated outputs.

This section details the key stages involved in implementing BAME in a production environment. First, we preprocess and augment the training data leveraging insights from the BAME dataset to enrich the diversity of prompts used during fine-tuning. Next, we fine-tune a language model using Low-Rank Adaptation (LoRA), optimizing it for prompt correction while preserving efficiency. Finally, we demonstrate the model's predictions, showcasing how it transforms user inputs into bias-mitigated prompts before generation.

## 4.6.1 Dataset Structuring and Instruction Optimization

The effectiveness of the BAME approach relies on a well-curated training dataset that captures various biases in generative AI outputs and provides corrective insights. To achieve this, we employed a structured preprocessing pipeline followed by data augmentation techniques to enhance the diversity and robustness of training data. A new dataset was created based on the original BAME dataset, now structured into three key columns: Instruction , Input , and Output . After multiple trials testing different prompt templates, the most effective

instruction for the dataset was:

You are an AI assistant that translates an input sentence into an output sentence. Add a disclaimer to the input that indicates how to specifically ensure balanced representation of genders and ethnicities.

and for the fine-tuning process:

The following is an excerpt from a conversation between an AI assistant and user. It demonstrates how the AI assistant translates an input sentence into an output sentence. The AI assistant adds a disclaimer to the input that indicates how to specifically ensure balanced representation of genders and ethnicities.

The Input column contained prompts resembling the vanilla or baseline prompts, capturing how users would typically phrase queries to an LLM. The Output column contained the corrected prompts, aligning with the corresponding BAME-modified prompts. These biasmitigated outputs were generated by referencing explanations extracted from the BAME dataset, ensuring that each transformation was informed by model-generated reasoning.

For the 25 occupational groups analyzed in this study, the curated dataset for this demonstration consisted of 200 rows, providing a well-balanced corpus for fine-tuning the prompt correction model. This dataset structure enabled the model to learn the transformation from biased to unbiased prompts while preserving the original intent of the query.

## 4.6.2 Model Fine-tuning using LORA

To efficiently fine-tune the language model for bias mitigation, we employed Low-Rank Adaptation (LoRA), a parameter-efficient fine-tuning technique. LoRA enables targeted modifications to pre-trained models while significantly reducing computational costs compared to full fine-tuning. It reduces the number of trainable parameters for downstream tasks by freezing the full weights of the model and inserting a smaller number of new trainable weights into the model. This technique makes training much faster and more memory-efficient, making it a scalable and effective approach for integrating BAME-based prompt correction mechanisms.

For this implementation 1 , we used the Gemma 2B Instruct model, instantiated as follows:

```
gemma_lm = keras_nlp.models.GemmaCausalLM.from_preset("gemma2_2b_en") gemma_lm.summary()
```

This model has a total of 2.61 billion parameters (approximately 9.74 GB of memory footprint), with all parameters being trainable. The Gemma 2B model was chosen for its lightweight, making it feasible for fine-tuning on consumer-grade hardware without excessive computational requirements. To make fine-tuning more efficient, we applied LoRA with a rank of 4, significantly reducing trainable parameters while preserving the model's expressivity. LoRA was enabled as follows:

```
gemma_lm.backbone.enable_lora(rank=4) gemma_lm.summary()
```

After enabling LoRA, the trainable parameters were drastically reduced from 2.61 billion (9.74 GB) to 2.92 million (11.17 MB), demonstrating the efficiency of LoRA in adapting large-scale models with minimal additional training overhead.

1 Code can be accessed at https://github.com/MarthaSamuel/Projects/blob/main/kaggle\_martha\_ gemma\_finetuning\_part1.ipynb

This model was fine-tuned for 64 epochs and batch size = 1, using our fine-tuning data with training configuration as follows:

```
optimizer = keras.optimizers.AdamW(learning_rate=2e-4,) gemma_lm.compile( loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), optimizer=optimizer, weighted_metrics=[keras.metrics.SparseCategoricalAccuracy()],)
```

which resulted to a loss of 0.0057 and sparse categorical accuracy of 0.9866.

## 4.6.3 Post Fine-tuning Outcomes

Following the fine-tuning process, the model demonstrated a significant improvement in bias mitigation by generating more balanced prompts that enhanced gender and ethnicity representation. This refined approach ensures that AI-generated content more accurately reflects diverse demographics, reducing disparities in representation. The fine-tuned model effectively handles batch prompt generation, making it a scalable solution for generating multiple bias-mitigated responses at once. However, for single-instance prompt generation, additional adaptations may be necessary to ensure that bias mitigation remains consistent across individual outputs.

An intriguing observation from the fine-tuned model's behavior is its ability to generalize to occupations not explicitly included in the fine-tuning dataset. For instance, while the training data included the Food Preparation and Serving occupation group, when prompted with 'Create 10 stories about a chef', the model correctly inferred that this profession falls under the broader category of Food Preparation and Serving:

You are an AI assistant that translates an input sentence into an output sentence. Add a disclaimer to the input that indicates how to specifically ensure balanced representation of genders and ethnicities.

Input: create 10 stories about a chef

Output:

create 10 stories about a chef. Ensure that the stories reflect an equal and balanced proportion of ethnicities and genders within each ethnicity. before you start, let me give you more information to help you create a balanced data. while creating each story put into conideration that You are likely to overrepresent males or API individuals in this data. The reason for these include the following: 1) Historically, many culinary professions have been male-dominated. 2) There is a broad range of countries and cultures encompassed by the API category. while recognizing these reasons: 1) make sure males and females are equally represented. 2) avoid overrepresenting API individuals compared to other ethnicities

This demonstrates that the model successfully internalized the bias-mitigation adjustments, allowing it to apply fairness principles to unseen professions while maintaining logical occupational categorizations. This ability to generalize beyond trained categories highlights the robustness of the BAME fine-tuned approach, reinforcing its potential for scalable, realworld applications across various professional contexts.

## 4.7 Practical Implications

The effectiveness of BAME in mitigating bias varied across different LLMs, with some models responding more favorably than others. This variation suggests that bias mitigation strategies may require model-specific adjustments to optimize fairness outcomes. Consequently, adaptive mitigation approaches tailored to different models or user preferences could enhance the alignment of AI systems with specific fairness requirements across various applications.

Since BAME relies on model-generated explanations, its effectiveness is inherently dependent on the model's internal reasoning mechanisms. If an LLM provides incomplete, incorrect, or vague justifications, the bias correction process may be less effective. This underscores the importance of designing AI systems with robust explainability features, ensuring that the reasoning behind their outputs is transparent, interpretable, and actionable for bias mitigation.

Beyond its technical effectiveness, the successful implementation of BAME carries significant real-world implications, particularly in sectors where AI-generated content influences high-stakes decision-making. The ability to mitigate bias without requiring model retraining makes BAME a highly adaptable solution for commercial and large-scale AI applications.

## 5 Conclusions and Future Work

The findings of this study demonstrate the effectiveness of integrating model output explanations with structured bias measurements in bias mitigation process. The dataset generated, encompassing diverse occupational narratives and demographic representations, provides a valuable resource for analyzing biases and testing mitigation strategies, advancing the field of ethical AI development.

Notably, while LLMs do not produce identical output when prompted with the same query, the percentage representation of sensitive variables remains consistently within the same range. This observation suggests stability in the model's internal representations of sensitive variables, providing a reliable basis for bias evaluation. While this work makes significant strides, challenges remain in addressing implicit biases and scaling mitigation efforts across diverse applications.

To ensure responsible and equitable AI deployment in critical domains like healthcare, justice, and hiring, we recommend leveraging model explanations to refine training datasets and inform best-use practices. This approach aligns AI systems with ethical principles while minimizing representational bias.

Explainability is essential for building trust in AI systems. Developers should prioritize integrating interpretable reasoning capabilities to enhance transparency, enabling stakeholders to understand model outputs and mitigate biases effectively. For systems without insights

into internal representations, a temporary workaround is to generate anonymous outputs and manually input sensitive variables, though this shifts the responsibility to users and offers limited advancement in understanding model biases.

Addressing bias requires both technical advancements and user-centered strategies. By fostering explainability, refining datasets, and promoting transparent usage practices, these recommendations aim to create AI systems that are fair, accountable, and trustworthy.

There are several future directions for research recommended for researchers exploring BAME. Future research should explore integrating these methods with existing fairness frameworks, broadening the scope to include additional sensitive attributes such as age and socioeconomic status, and also examining the long-term societal impacts of bias mitigation strategies.

This study focused on text-based bias mitigation, but bias in multimodal AI (e.g., image, video, etc) remains an open challenge. Future research could adapt BAME for multimodal applications, ensuring fair and inclusive representations across different media formats.

BAME's effectiveness in mitigating bias varies across different Large Language Models (LLMs). Future research could explore adaptive mitigation strategies tailored to specific models or user preferences, ensuring AI aligns with specific fairness requirements across applications.

Finally, while BAME operates autonomously, integrating human oversight can validate explanations and refine bias interventions. Future work could explore interactive AI frameworks where users provide feedback to further optimize bias mitigation mechanisms, enabling AI systems to learn iteratively from human judgments to identify and correct biases more effectively. This approach also empowers humans to set and refine bias mitigation goals, ensuring that AI aligns with evolving fairness standards.

## Adverse Impact Statement

Despite efforts to mitigate bias, this research acknowledges potential adverse impacts arising from its limitations. The exclusion of non-binary genders and the reliance on simplified ethnic categories may unintentionally marginalize certain groups, perpetuating their underrepresentation in AI-generated narratives. Additionally, while our mitigation strategies showed improvements in demographic parity, residual biases may persist, potentially reinforcing harmful stereotypes or influencing societal perceptions, career aspirations, and hiring practices. We emphasize the importance of addressing these limitations through future work, including more inclusive data collection, broader demographic representation, and continuous evaluation of the societal implications of generative AI outputs.

## Bibliography

- [1] Mohsen Abbasi, Sorelle A. Friedler, Carlos Scheidegger, and Suresh Venkatasubramanian. 2019. Fairness in representation: quantifying stereotyping as a representational harm. arXiv preprint arXiv:1901.09565 (2019). https://doi.org/10.48550/arXiv. 1901.09565 arXiv:1901.09565 [cs.LG]
- [2] Pamela Ugwudike David Gammack Adriane Chapman, Philip Grylls and Jacqui Ayling. 2022. A Data-driven analysis of the interplay between Criminiological theory and predictive policing algorithms. In ACM FAccT Conference Proceedings 2022 . ACM.
- [3] Greta R Bauer and Daniel J Lizotte. 2021. Artificial Intelligence, Intersectionality, and the Future of Public Health. American Journal of Public Health 111, 1 (2021), 98-100. - [4] Lorenzo Belenguer. 2022. AI bias: exploring discriminatory algorithmic decisionmaking models and the application of possible machine-centric solutions adapted from the pharmaceutical industry. AI and Ethics 2, 4 (2022), 771-787. https: //doi.org/10.1007/s43681-022-00138-8
- [5] Raysa Benatti, Fabiana Severi, Sandra Avila, and Esther Luna Colombini. 2024. Gender Bias Detection in Court Decisions: A Brazilian Case Study. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency (FAccT '24) (Rio de Janeiro, Brazil). ACM, New York, NY, USA, 18. https: //doi.org/10.1145/3630106.3658937

- [6] Arnab Bhattacharyya, Sutanu Gayen, Kuldeep S. Meel, Dimitrios Myrisiotis, A. Pavan, and N. V. Vinodchandran. 2022. On Approximating Total Variation Distance. arXiv preprint arXiv:2206.07209 (2022). https://doi.org/10.48550/arXiv.2206.07209 arXiv:2206.07209 [cs.DS]
- [7] Tolga Bolukbasi, Kai-Wei Chang, James Zou, Venkatesh Saligrama, and Adam Kalai. 2016. Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings. arXiv preprint arXiv:1607.06520 (2016). https://doi.org/10.48550/ arXiv.1607.06520 arXiv:1607.06520v1 [cs.CL].
- [8] Joy Buolamwini and Timnit Gebru. 2018. Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. In Proceedings of the 1st Conference on Fairness, Accountability and Transparency (Proceedings of Machine Learning Research, Vol. 81) , Sorelle A. Friedler and Christo Wilson (Eds.). PMLR, 77-91. https://proceedings.mlr.press/v81/buolamwini18a.html
- [9] Joy Buolamwini and Timnit Gebru. 2018. Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. In Proceedings of the Conference on Fairness, Accountability, and Transparency (Proceedings of Machine Learning Research, Vol. 81) . PMLR, New York, NY, USA, 1-15. https://proceedings.mlr. press/v81/buolamwini18a/buolamwini18a.pdf
- [10] Maarten Buyl and Tijl De Bie. 2024. Inherent Limitations of AI Fairness. Commun. ACM 67, 2 (2024), 48-55. https://doi.org/10.1145/3624700 Published: 18 January 2024.

- [11] Devon W. Carbado, Kimberl´ e Crenshaw, Vickie M. Mays, and Barbara Tomlinson. 2013. Intersectionality: Mapping the Movements of a Theory. Du Bois Review: Social Science Research on Race 10, 2 (2013), 303-312. https://doi.org/10.1017/ S1742058X13000349
- [12] Simon Caton and Christian Haas. 2024. Fairness in Machine Learning: A Survey. ACM Comput. Surv. 56, 7, Article 166 (April 2024), 38 pages. https://doi.org/ 10.1145/3616865
- [13] L. Elisa Celis, Lingxiao Huang, Vijay Keswani, and Nisheeth K. Vishnoi. 2019. Classification with Fairness Constraints: A Meta-Algorithm with Provable Guarantees. In Proceedings of the Conference on Fairness, Accountability, and Transparency (FAccT) . 319-328.
- [14] Kabir Singh Chadha. 2024. Bias and Fairness in Artificial Intelligence: Methods and Mitigation Strategies. Journal of Research in Public Science 15, 3 (2024), Jul-Sep 2024. - [15] Feng Chen et al. 2024. Unmasking Bias in Artificial Intelligence: A Systematic Review of Bias Detection and Mitigation Strategies in Electronic Health Record-Based Models. arXiv arXiv:2310.19917v3 (July 2024). https://arxiv.org/abs/2310.19917 Preprint.
- [16] Zhisheng Chen. 2023. Ethics and Discrimination in Artificial Intelligence-Enabled

Recruitment Practices. Humanities and Social Sciences Communications 10, 1 (2023), 567. - [17] Pengyu Cheng, Weituo Hao, Siyang Yuan, Shijing Si, and Lawrence Carin. 2021. FairFil: Contrastive Neural Debiasing Method for Pretrained Text Encoders. In Proceedings of the International Conference on Learning Representations (ICLR) . https://doi.org/10.48550/arXiv.2103.06413 arXiv:2103.06413 [cs.CL]
- [18] Rui Cheng, Hao Ma, and Shiyu Cao. 2024. Deceiving to Enlighten: Coaxing LLMs to Self-Reflection for Enhanced Bias Detection and Mitigation. arXiv preprint arXiv:2404.10160 (2024). https://doi.org/10.48550/arXiv.2404.10160 arXiv:2404.10160v1 [cs.AI].
- [19] Jaemin Cho, Abhay Zala, and Mohit Bansal. 2022. DALL-Eval: Probing the Reasoning Skills and Social Biases of Text-to-Image Generation Models. arXiv preprint arXiv:2202.04053 (2022). https://doi.org/10.48550/arXiv.2202.04053 arXiv:2202.04053 [cs.CV]
- [20] Ching-Hua Chuan, Ruoyu Sun, Shiyun Tian, and Wan-Hsiu Sunny Tsai. 2024. EXplainable Artificial Intelligence (XAI) for facilitating recognition of algorithmic bias: An experiment from imposed users' perspectives. Telematics and Informatics 91 (2024), 102135. - [21] Kimberle Crenshaw. 1989. Demarginalizing the Intersection of Race and Sex: A Black Feminist Critique of Antidiscrimination Doctrine, Feminist Theory and Antiracist Politics. University of Chicago Legal Forum 1989, 1 (1989). http://chicagounbound. uchicago.edu/uclf/vol1989/iss1/8

- [22] Danushka Bollegal Daisuke Oba, Masahiro Kaneko. 2022. A Framework for Understanding Sources of Harm throughout the Machine Learning Life Cycle. arXiv preprint arXiv:2309.07251v2 (2022).
- [23] Anupam Datta. 2015. Fewer Women Than Men Are Shown Online Ads Related to High-Paying Jobs. https://csd.cmu.edu/news/ fewer-women-than-men-are-shown-online-ads-related-to-highpaying-jobs Accessed: January 26, 2025.
- [24] Harrison Edwards and Amos Storkey. 2015. Censoring Representations with an Adversary. arXiv preprint arXiv:1511.05897 (2015). https://arxiv.org/abs/1511.05897 Retrieved from https://arxiv.org/abs/1511.05897 .
- [25] J. E. Eicher and R. F. Irgoliˇ c. 2024. Reducing Selection Bias in Large Language Models. arXiv preprint arXiv:2402.01740 (2024). https://doi.org/10.48550/arXiv.2402. 01740
- [26] European Union Agency for Fundamental Rights. 2022. Bias in Algorithms: Artificial Intelligence and Discrimination . Technical Report. European Union Agency for Fundamental Rights. https://fra.europa.eu/sites/default/files/fra\_uploads/ fra-2022-bias-in-algorithms\_en.pdf Accessed: January 26, 2025.
- [27] Alessandro Fabris, Nina Baranowska, Matthew J. Dennis, David Graus, Philipp Hacker, Jorge Saldivar, Frederik Zuiderveen Borgesius, and Asia J. Biega. 2023. Fairness and Bias in Algorithmic Hiring: A Multidisciplinary Survey. arXiv preprint arXiv:2309.13933 (2023). https://doi.org/10.48550/arXiv.2309.13933 arXiv:2309.13933 [cs.CY] See also related DOI: https://doi.org/10.1145/3696457 .

- [28] Xiao Fang, Shangkun Che, Minjia Mao, Hongzhe Zhang, Ming Zhao, and Xiaohang Zhao. 2023. Bias of AI-Generated Content: An Examination of News Produced by Large Language Models. arXiv preprint arXiv:2309.09825 (2023). https://doi. org/10.48550/arXiv.2309.09825 arXiv:2309.09825 [cs.AI]
- [29] Emilio Ferrara. 2024. The Butterfly Effect in artificial intelligence systems: Implications for AI bias and fairness. Machine Learning with Applications 15 (2024), 100525. - [30] Emilio Ferrara. 2024. Fairness and Bias in Artificial Intelligence: A Brief Survey of Sources, Impacts, and Mitigation Strategies. arXiv preprint arXiv:2304.07683 (2024). https://doi.org/10.48550/arXiv.2304.07683 arXiv:2304.07683 [cs.CY] Journal reference: Sci 2024, 6(1), 3. Related DOI: https://doi.org/10.3390/sci6010003 .
- [31] Xavier Ferrer, Tom van Nuenen, Jose M. Such, Mark Cot´ e, and Natalia Criado. 2021. Bias and Discrimination in AI: A Cross-Disciplinary Perspective. IEEE Technology and Society Magazine 40, 2 (2021), 72-80. https://doi.org/10.1109/MTS.2021. 3056293
- [32] James R. Foulds and Shimei Pan. 2020. Are Parity-Based Notions of AI Fairness Desirable? IEEE Data Eng. Bull. 43 (2020), 51-73. https://api.semanticscholar. org/CorpusID:239992879
- [33] Saadia Gabriel, Isha Puri, Xuhai Xu, Matteo Malgaroli, and Marzyeh Ghassemi. 2024. Can AI Relate: Testing Large Language Model Response for Mental Health Support. arXiv preprint arXiv:2405.12021 (2024). https://doi.org/10.48550/arXiv.2405. 12021 arXiv:2405.12021 [cs.CL]

- [34] Isabel O. Gallegos, Ryan A. Rossi, Joe Barrow, Md Mehrab Tanjim, Sungchul Kim, Franck Dernoncourt, Tong Yu, Ruiyi Zhang, and Nesreen K. Ahmed. 2024. Bias and Fairness in Large Language Models: A Survey. Computational Linguistics 50, 3 (2024). Accepted for publication.
- [35] Isabel O. Gallegos, Ryan A. Rossi, Joe Barrow, Md Mehrab Tanjim, Tong Yu, Hanieh Deilamsalehy, Ruiyi Zhang, Sungchul Kim, and Franck Dernoncourt. 2024. SelfDebiasing Large Language Models: Zero-Shot Recognition and Reduction of Stereotypes. arXiv preprint arXiv:2402.01981 (2024). https://doi.org/10.48550/arXiv. 2402.01981 arXiv:2402.01981 [cs.CL]
- [36] Jingtong Gao, Bo Chen, Xiangyu Zhao, Weiwen Liu, Xiangyang Li, Yichao Wang, Zijian Zhang, Wanyu Wang, Yuyang Ye, Shanru Lin, Huifeng Guo, and Ruiming Tang. 2024. LLM-enhanced Reranking in Recommender Systems. arXiv preprint arXiv:2406.12433 (June 2024). arXiv:2406.12433 [cs.IR] https://arxiv.org/abs/ 2406.12433 Corresponding Author.
- [37] Bhavya Ghai. 2023. Towards Fair and Explainable AI Using a Human-Centered AI Approach. arXiv preprint arXiv:2306.07427 (2023). https://doi.org/10.48550/ arXiv.2306.07427 arXiv:2306.07427 [cs.CY]
- [38] Navita Goyal, Connor Baumler, Tin Nguyen, and Hal Daum´ e III. 2023. The Impact of Explanations on Fairness in Human-AI Decision-Making: Protected vs Proxy Features. arXiv preprint arXiv:2310.08617 (2023). https://doi.org/10.48550/arXiv.2310. 08617 arXiv:2310.08617 [cs.AI]
- [39] Magnus Gray, Ravi Samala, Qi Liu, Denny Skiles, Joshua Xu, Weida Tong, and Leihong Wu. 2024. Measurement and Mitigation of Bias in Artificial Intelligence: A Narrative Literature Review for Regulatory Science. Regulatory Science Journal (2024). https://example-url.com *Corresponding author: Leihong Wu.

- [40] Yufei Guo, Muzhe Guo, Juntao Su, Zhou Yang, Mengqiu Zhu, Hongfei Li, Mengyang Qiu, and Shuo Shuo Liu. 2024. Bias in Large Language Models: Origin, Evaluation, and Mitigation. arXiv preprint arXiv:2411.10915 (2024). https://arxiv.org/abs/ 2411.10915
- [41] Philipp Hacker, Brent Mittelstadt, Frederik Zuiderveen Borgesius, and Sandra Wachter. 2024. Generative Discrimination: What Happens When Generative AI Exhibits Bias, and What Can Be Done About It. arXiv preprint arXiv:2407.10329 (2024). https://doi.org/10.48550/arXiv.2407.10329 arXiv:2407.10329 [cs.CY]
- [42] David Sun Hadas Kotek, Rikker Dockum. 2023. Gender Bias and Stereotypes in Large Language Models.. In Proceedings of ACM Collective Intelligence Conference . 12-24. - [43] Matthew Hanna, Liron Pantanowitz, Brian Jackson, Octavia Palmer, Shyam Visweswaran, Joshua Pantanowitz, Mustafa Deebajah, and Hooman Rashidi. 2024. Ethical and Bias Considerations in Artificial Intelligence (AI)/Machine Learning. Modern Pathology (2024), 100686. - [44] Tatsunori Hashimoto, Megha Srivastava, Hongseok Namkoong, and Percy Liang. 2018. Fairness Without Demographics in Repeated Loss Minimization. In Proceedings of the International Conference on Machine Learning (ICML) . PMLR, 1929-1938.
- [45] Ayanna Howard. 2021. Real Talk: Intersectionality and AI. MIT Sloan

Management Review (August 2021). https://sloanreview.mit.edu/article/ real-talk-intersectionality-and-ai/

- [46] IBM. 2023. Shedding Light on AI Bias with Real-World Examples. https://www.ibm. com/think/topics/shedding-light-on-ai-bias-with-real-world-examples Accessed: January 26, 2025.
- [47] IMD Business School. 2018. Amazon's Sexist Hiring Algorithm Could Still Be Better Than a Human. https://www.imd.org/research-knowledge/digital/articles/ amazons-sexist-hiring-algorithm-could-still-be-better-than-a-human/ Accessed: January 26, 2025.
- [48] Haozhe Ji, Pei Ke, Zhipeng Hu, Rongsheng Zhang, and Minlie Huang. 2023. Tailoring Language Generation Models under Total Variation Distance. ArXiv abs/2302.13344 (2023). https://api.semanticscholar.org/CorpusID:257219444
- [49] Di Jin, Luzhi Wang, He Zhang, Yizhen Zheng, Weiping Ding, Feng Xia, and Shirui Pan. 2023. A survey on fairness-aware recommender systems. Information Fusion 100 (2023), 101906. - [50] Xiaoyu Liu Peter Spirtes Kun Zhang Liu Leqi Yang Liu Jingling Li, Zeyu Tang. 2024. Steering LLMs Toward Unbiased Responses: A Causality-Guided Debiasing Framework. arXiv arXiv:2403.08743v1 (2024).
- [51] Masahiro Kaneko and Danushka Bollegala. 2021. Dictionary-based Debiasing of Pretrained Word Embeddings. In Proceedings of the 16th Conference of the European Chapter of the Association for Computational Linguistics: Main Volume , Paola Merlo,

Jorg Tiedemann, and Reut Tsarfaty (Eds.). Association for Computational Linguistics, Online, 212-223. - [52] E. Kartal. 2022. A Comprehensive Study on Bias in Artificial Intelligence Systems: Biased or Unbiased AI, That's the Question! International Journal of Intelligent Information Technologies (IJIIT) 18, 1 (2022), 1-23. https://doi.org/10.4018/ IJIIT.309582
- [53] Tahsin Alamgir Kheya, Mohamed Reda Bouadjenek, and Sunil Aryal. 2024. The Pursuit of Fairness in Artificial Intelligence Models: A Survey. arXiv preprint arXiv:2403.17333 (2024). https://doi.org/10.48550/arXiv.2403.17333 arXiv:2403.17333 [cs.AI]
- [54] Eden King and Kristen Jones. 2016. Why Subtle Bias Is So Often Worse than Blatant Discrimination. Harvard Business Review (2016). https://hbr.org/2016/07/ why-subtle-bias-is-so-often-worse-than-blatant-discrimination
- [55] Hannah Kirk, Yennie Jun, Haider Iqbal, Elias Benussi, Filippo Volpin, Frederic A. Dreyer, Aleksandar Shtedritski, and Yuki M. Asano. 2021. Bias Out-of-the-Box: An Empirical Analysis of Intersectional Occupational Biases in Popular Generative Language Models. arXiv preprint arXiv:2102.04130 (2021). https://doi.org/10. 48550/arXiv.2102.04130 arXiv:2102.04130 [cs.CL]
- [56] Dani Kiyasseh, Jonathan Laca, Tareef F. Haque, et al. 2023. Human visual explanations mitigate bias in AI-based assessment of surgeon skills. npj Digital Medicine 6 (2023), 54. - [57] Natalie H. Koh, Jose Plata, and Joyce Chai. 2023. BAD: BiAs Detection for Large Language Models in the Context of Candidate Screening. arXiv preprint arXiv:2305.10407 (2023). https://doi.org/10.48550/arXiv.2305.10407 arXiv:2305.10407v1 [cs.CL].

- [58] Anna Kruspe. 2024. Towards detecting unanticipated bias in Large Language Models. arXiv preprint arXiv:2404.02650 (2024). https://doi.org/10.48550/arXiv.2404. 02650 arXiv:2404.02650 [cs.LG]
- [59] Abhishek Kumar, Sarfaroz Yunusov, and Ali Emami. 2024. Subtle Biases Need Subtler Measures: Dual Metrics for Evaluating Representative and Affinity Bias in Large Language Models. arXiv preprint arXiv:2405.14555 (2024). https://doi.org/10. 48550/arXiv.2405.14555 arXiv:2405.14555 [cs.CL]
- [60] Walter Laurito, Benjamin Davis, Peli Grietzer, Tom´ aˇ s Gavenˇ ciak, Ada B¨ ohm, and Jan Kulveit. 2024. AI AI Bias: Large Language Models Favor Their Own Generated Content. arXiv preprint arXiv:2407.12856 (2024). https://doi.org/10.48550/ arXiv.2407.12856
- [61] Jinsook Lee, Yann Hicke, Renzhe Yu, Christopher Brooks, and Ren´ e F. Kizilcec. 2024. The Life Cycle of Large Language Models: A Review of Biases in Education. arXiv preprint arXiv:2407.11203 (June 2024). https://doi.org/10.48550/ arXiv.2407.11203 arXiv:2407.11203 [cs.CY] Corresponding author: Jinsook Lee, jl3369@cornell.edu.
- [62] Messi H.J. Lee, Jacob M. Montgomery, and Calvin K. Lai. 2024. Large Language Models Portray Socially Subordinate Groups as More Homogeneous, Consistent with a Bias Observed in Humans. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency (FAccT '24) (Rio de Janeiro, Brazil). ACM, New York, NY, USA, 20. - [63] Paul Pu Liang, Chiyu Wu, Louis-Philippe Morency, and Ruslan Salakhutdinov. 2021. Towards Understanding and Mitigating Social Biases in Language Models. arXiv preprint arXiv:2106.13219 (2021). https://doi.org/10.48550/arXiv.2106.13219 arXiv:2106.13219 [cs.CL]
- [64] Gabrielle Kaili-May Liu. 2023. Perspectives on the Social Impacts of Reinforcement Learning with Human Feedback. arXiv:2303.02891 [cs.CY] https://arxiv.org/abs/ 2303.02891
- [65] Orestis Loukas and Ho-Ryun Chung. 2023. Demographic Parity: Mitigating Biases in Real-World Data. arXiv preprint arXiv:2309.17347 (2023). https://doi.org/ 10.48550/arXiv.2309.17347 arXiv:2309.17347 [cs.LG] 24 pages, 16 Figures, Python code attached.
- [66] Abdoul Jalil Djiberou Mahamadou and Artem A. Trotsyuk. 2024. Revisiting Technical Bias Mitigation Strategies. arXiv preprint arXiv:2410.17433 (2024). https://doi. org/10.48550/arXiv.2410.17433 Version 1, October 2024.
- [67] Bodhisattwa Prasad Majumder, Zexue He, and Julian McAuley. 2022. InterFair: Debiasing with Natural Language Feedback for Fair Interpretable Predictions. arXiv preprint arXiv:2210.07440 (2022). https://doi.org/10.48550/arXiv.2210.07440 arXiv:2210.07440 [cs.CL]
- [68] Abhishek Mandal, Susan Leavy, and Suzanne Little. 2023. Multimodal Composite Association Score: Measuring Gender Bias in Generative Multimodal Models. arXiv preprint arXiv:2304.13855 (2023). https://doi.org/10.48550/arXiv.2304.13855 arXiv:2304.13855 [cs.CV]

- [69] Abhishek Mandal, Suzanne Little, and Susan Leavy. 2023. Gender Bias in Multimodal Models: A Transnational Feminist Approach Considering Geographical Region and Culture. arXiv preprint arXiv:2309.04997 (2023). https://doi.org/10.48550/ arXiv.2309.04997 arXiv:2309.04997 [cs.CY]
- [70] Danushka Bollegala Masahiro Kaneko. 2021. Debiasing Pre-trained Contextualised Embeddings. arXiv preprint arXiv:2101.09523 (2021). https://doi.org/10.48550/ arXiv.2101.09523 arXiv:2101.09523v1 [cs.CL].
- [71] Ninareh Mehrabi, Fred Morstatter, Nripsuta Saxena, Kristina Lerman, and Aram Galstyan. 2021. A Survey on Bias and Fairness in Machine Learning. arXiv preprint arXiv:1908.09635 (2021). https://doi.org/10.48550/arXiv.1908.09635 Version 3 [cs.LG].
- [72] Louise A. C. Millard et al. 2023. Exploring the Impact of Selection Bias in Observational Studies of COVID-19: A Simulation Study. International Journal of Epidemiology 52, 1 (2023), 44-57. - [73] Kiana Minkie. 2024. How Is AI Biased? https://www.acrolinx.com/blog/ how-is-ai-biased/ Accessed: January 26, 2025.
- [74] Simukayi Mutasa, Shawn Sun, and Richard Ha. 2020. Understanding Artificial Intelligence Based Radiology Studies: What is Overfitting? Clinical Imaging 65 (September 2020), 96-99.
- [75] Lama H. Nazer et al. 2023. Bias in Artificial Intelligence Algorithms and Recommendations for Mitigation. PLOS Digital Health 2, 6 (June 2023), e0000278. - [76] Natalia Norori, Qiyang Hu, Florence Marcelle Aellen, Francesca Dalia Faraci, and Athina Tzovara. 2021. Addressing Bias in Big Data and AI for Health Care: A Call for Open Science. Patterns 2, 10 (October 2021), 100347. https://doi.org/10. 1016/j.patter.2021.100347
- [77] Eirini Ntoutsi, Pavlos Fafalios, Ujwal Gadiraju, Vasileios Iosifidis, Wolfgang Nejdl, Maria-Esther Vidal, Salvatore Ruggieri, Franco Turini, Symeon Papadopoulos, Emmanouil Krasanakis, Ioannis Kompatsiaris, Katharina Kinder-Kurlanda, Claudia Wagner, Fariba Karimi, Miriam Fernandez, Harith Alani, Bettina Berendt, Tina Kruegel, Christian Heinze, Klaus Broelemann, Gjergji Kasneci, Thanassis Tiropanis, and Steffen Staab. 2020. Bias in Data-driven AI Systems - An Introductory Survey. arXiv preprint arXiv:2001.09762 (2020). https://doi.org/10.48550/arXiv.2001.09762 Version 1 [cs.AI].
- [78] Alexandra Olteanu, Carlos Castillo, Fernando Diaz, and Emre Kıcıman. 2019. Social Data: Biases, Methodological Pitfalls, and Ethical Boundaries. Frontiers in Big Data 2 (2019). - [79] Dana Pessach and Erez Shmueli. 2020. Algorithmic Fairness. arXiv preprint arXiv:2001.09784 (2020). https://doi.org/10.48550/arXiv.2001.09784 arXiv:2001.09784 [cs.CY]
- [80] Maan Qraitem, Kate Saenko, and Bryan A. Plummer. 2023. From Fake to Real: Pretraining on Balanced Synthetic Images to Prevent Spurious Correlations in Image Recognition. arXiv preprint arXiv:2308.04553 (2023). https://doi.org/10.48550/ arXiv.2308.04553 Version 3, August 2023.
- [81] Resmi Ramachandranpillai, Kishore Sampath, Ayaazuddin Mohammad, and Malihe

Alikhani. 2024. Fairness at Every Intersection: Uncovering and Mitigating Intersectional Biases in Multimodal Clinical Predictions. arXiv preprint arXiv:2412.00606 (2024). https://doi.org/10.48550/arXiv.2412.00606 Version 1, November 30, 2024.

- [82] Juan-Pablo Rivera, Gabriel Mukobi, Anka Reuel, Max Lamparth, Chandler Smith, and Jacquelyn Schneider. 2024. Escalation Risks from Language Models in Military and Diplomatic Decision-Making. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency (FAccT '24) (Rio de Janeiro, Brazil). ACM, New York, NY, USA, 63. - [83] Yao Rong, Tobias Leemann, Thai-Trang Nguyen, Lisa Fiedler, Peizhu Qian, Vaibhav Unhelkar, Tina Seidel, Gjergji Kasneci, and Enkelejda Kasneci. 2024. Towards HumanCentered Explainable AI: A Survey of User Studies for Model Explanations. arXiv preprint arXiv:2210.11584 (October 2024). arXiv:2210.11584 [cs.AI] https://arxiv. org/abs/2210.11584
- [84] Lucas Rosenblatt and R. Teal Witter. 2022. Counterfactual Fairness Is Basically Demographic Parity. arXiv preprint arXiv:2208.03843 (2022). https://doi.org/10. 48550/arXiv.2208.03843 arXiv:2208.03843 [cs.LG]
- [85] Jakob Schoeffer and Niklas Kuehl. 2021. Appropriate Fairness Perceptions? On the Effectiveness of Explanations in Enabling People to Assess the Fairness of Automated Decision Systems (CSCW '21 Companion) . Association for Computing Machinery, New York, NY, USA, 153-157. - [86] Jakob Schoeffer, Niklas Kuehl, and Yvette Machowski. 2022. 'There Is Not Enough Information': On the Effects of Explanations on Perceptions of Informational Fairness

and Trustworthiness in Automated Decision-Making. arXiv preprint arXiv:2205.05758 (May 2022). arXiv:2205.05758 [cs.HC] https://arxiv.org/abs/2205.05758

- [87] Reva Schwartz, Apostol Vassilev, Kristen Greene, Lori Perine, Andrew Burt, and Patrick Hall. 2022. Towards a Standard for Identifying and Managing Bias in Artificial Intelligence . Technical Report. National Institute of Standards and Technology (NIST). https://doi.org/10.6028/NIST.SP.1270 This publication is available free of charge..
- [88] Nima Shahbazi, Yin Lin, Abolfazl Asudeh, and H. V. Jagadish. 2022. Representation Bias in Data: A Survey on Identification and Resolution Techniques. arXiv preprint arXiv:2203.11852 (2022). https://doi.org/10.48550/arXiv.2203.11852 arXiv:2203.11852 [cs.DB]
- [89] Rizwan Ahmed Shams, Didar Zowghi, and Muneera Bano. 2023. AI and the quest for diversity and inclusion: a systematic literature review. AI Ethics (2023). https: //doi.org/10.1007/s43681-023-00362-w Received: 15 July 2023, Accepted: 03 October 2023, Published: 13 November 2023.
- [90] Omid Shokrollahi. 2023. Intersectional Bias Mitigation in Pre-trained Language Models: A Quantum-Inspired Approach. In Proceedings of the 32nd ACM International Conference on Information and Knowledge Management (CIKM '23) . ACM, New York, NY, USA, 5181-5184. https://doi.org/10.1145/3583780.3616003 Published: 21 October 2023.
- [91] Gizem Sogancioglu, Heysem Kaya, and Albert Ali Salah. 2023. Using Explainability for Bias Mitigation: A Case Study for Fair Recruitment Assessment. In Proceedings of the 25th International Conference on Multimodal Interaction (Paris, France) (ICMI

- '23) . Association for Computing Machinery, New York, NY, USA, 631-639. https: //doi.org/10.1145/3577190.3614170
- [92] Joe Stacey, Yonatan Belinkov, and Marek Rei. 2021. Supervising Model Attention with Human Explanations for Robust Natural Language Inference. arXiv preprint arXiv:2104.08142 (2021). https://doi.org/10.48550/arXiv.2104.08142 arXiv:2104.08142 [cs.CL]
- [93] Tony Sun, Andrew Gaut, Shirlyn Tang, Yuxin Huang, Mai ElSherief, Jieyu Zhao, Diba Mirza, Elizabeth Belding, Kai-Wei Chang, and William Yang Wang. 2019. Mitigating Gender Bias in Natural Language Processing: Literature Review. arXiv preprint arXiv:1906.08976 (2019). https://doi.org/10.48550/arXiv.1906.08976 arXiv:1906.08976 [cs.CL].
- [94] Harini Suresh and John V. Guttag. 2021. A Framework for Understanding Sources of Harm throughout the Machine Learning Life Cycle. In Proceedings of EAAMO '21: Equity and Access in Algorithms, Mechanisms, and Optimization (EAAMO '21). ACM, New York, NY, USA . - [95] Yan Tao, Olga Viberg, Ryan S Baker, and Ren´ e F Kizilcec. 2024. Cultural bias and cultural alignment of large language models. PNAS Nexus 3, 9 (09 2024), pgae346. https://doi.org/10.1093/ pnasnexus/pgae346 arXiv:https://academic.oup.com/pnasnexus/articlepdf/3/9/pgae346/59151559/pgae346.pdf
- [96] Roberta Sinatra Therese Moreau and Vedran Sekara. 2024. Failing Our Youngest: On the Biases, Pitfalls, and Risks in a Decision Support Algorithm Used for Child Protection. In ACM FAccT Conference Proceedings 2024 . ACM.

- [97] N. Tilmes. 2022. Disability, fairness, and algorithmic bias in AI recruitment. Ethics and Information Technology 24, 21 (April 2022). https://doi.org/10.1007/ s10676-022-09633-2 Accepted: 05 January 2022, Published: 19 April 2022.
- [98] Soobin Um and Changho Suh. 2022. A Fair Generative Model Using Total Variation Distance. (2022). OPENREV.
- [99] Sahil Verma and Julia Rubin. 2018. Fairness Definitions Explained. In 2018 IEEE/ACM International Workshop on Software Fairness (FairWare) . IEEE, Gothenburg, Sweden, 1-7. - [100] Mingyang Wan, Daochen Zha, Ninghao Liu, and Na Zou. 2023. In-Processing Modeling Techniques for Machine Learning Fairness: A Survey. ACM Trans. Knowl. Discov. Data 17, 3, Article 35 (March 2023), 27 pages. - [101] Yinhan Wan, Grace Pu, Jing Sun, Ashwin Garimella, Kai-Wei Chang, and Nanyun Peng. 2023. 'Kelly is a Warm Person, Joseph is a Role Model': Gender Biases in LLM-Generated Reference Letters. arXiv preprint arXiv:2310.09219 (2023). https: //doi.org/10.48550/arXiv.2310.09219 arXiv:2310.09219v5 [cs.CL].
- [102] Angelina Wang, Vikram V Ramaswamy, and Olga Russakovsky. 2022. Towards Intersectionality in Machine Learning: Including More Identities, Handling Underrepresentation, and Performing Evaluation. In Proceedings of the 2022 ACM Conference on Fairness, Accountability, and Transparency (FAccT '22) . ACM, Seoul, Republic of Korea, 920-933. - [103] Xiahua Wei, Naveen Kumar, and Han Zhang. 2025. Addressing Bias in Generative AI: Challenges and Research Opportunities in Information Management. Information &amp;

Management 62, 3 (2025), 104103. https://doi.org/10.1016/j.im.2025.104103 Georgia Tech Scheller College of Business Research Paper No. 4976889.

- [104] Iain Weissburg, Sathvika Anand, Sharon Levy, and Haewon Jeong. 2024. LLMs are Biased Teachers: Evaluating LLM Bias in Personalized Education. arXiv preprint arXiv:2410.14012 (2024). https://doi.org/10.48550/arXiv.2410.14012 arXiv:2410.14012 [cs.CL]
- [105] Wikipedia contributors. 2025. ChatGPT: Concerns. https://en.wikipedia.org/ wiki/ChatGPT#Concerns . Accessed: January 26, 2025.
- [106] Jenny Yang et al. 2023. An Adversarial Training Framework for Mitigating Algorithmic Biases in Clinical Machine Learning. NPJ Digital Medicine 6, 1 (March 2023), 55. https://doi.org/10.1038/s41746-023-00805-y Published: 29 March 2023.
- [107] Hidir Yesiltepe, Kiymet Akdemir, and Pinar Yanardag. 2024. MIST: Mitigating Intersectional Bias with Disentangled Cross-Attention Editing in Text-to-Image Diffusion Models. arXiv preprint arXiv:2403.19738 (2024). https://doi.org/10.48550/ arXiv.2403.19738 Version 1, March 2024.
- [108] Jianxiang Zang and Hui Liu. 2024. Explanation based Bias Decoupling Regularization for Natural Language Inference. arXiv preprint arXiv:2404.13390 (2024). https: //doi.org/10.48550/arXiv.2404.13390 arXiv:2404.13390 [cs.CL]
- [109] Yiming Zhang, Sravani Nanduri, Liwei Jiang, Tongshuang Wu, and Maarten Sap. 2023. BiasX: 'Thinking Slow' in Toxic Content Moderation with Explanations of Implied Social Biases. arXiv preprint arXiv:2305.13589 (2023). https://doi.org/10.48550/ arXiv.2305.13589 arXiv:2305.13589 [cs.CL]

- [110] Yuying Zhao, Yu Wang, and Tyler Derr. 2023. Fairness and Explainability: Bridging the Gap Towards Fair Model Explanations. arXiv preprint arXiv:2212.03840 (2023). https://doi.org/10.48550/arXiv.2212.03840 arXiv:2212.03840 [cs.LG] Accepted by AAAI 2023.
- [111] Didar Zowghi and Muneera Bano. 2024. AI for all: Diversity and Inclusion in AI. AI Ethics 4 (November 2024), 873-876. https://doi.org/10.1007/ s43681-024-00485-8 Published: 02 May 2024.

## APPENDICES

## Appendix A Additional Sample Model Explanations

Table 1 presents the model explanations elicited for 'Personal Care and Service' and 'Sales' occupations from three LLMs.

Table 1: Additional Sample Model Explanations for Occupation Groups

| Occupation                | Model             | Explanation                                                                                                                                                                                                                                                                                                                                                                                  |
|---------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Personal Care and Service | Claude 3.5 Sonnet | The overrepresentation of API characters might stem from an unconscious association between certain Personal Care and Service professions (like massage therapy, acupuncture, nail care) and Asian cultures. The prominence of European coun- tries in fashion and personal styling. The underrepresenta- tion of Black and Hispanic professionals in media portrayals of these professions. |

Table 1: Additional Sample Model Explanations for Occupation Groups (continued)

| Occupation   | Model             | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|              | Llama 3.1 70B     | I generated more female characters because, in the context of Personal Care and Service, many professions like hairstyling, makeup artistry, skincare, and fashion tend to have a higher representation of women. I generated more API characters because, in the context of Personal Care and Service, many Asian cultures place a strong emphasis on beauty, skincare, and fashion. This might be due to historical and cultural factors, such as the importance of aesthetics in Asian societies. |
|              | GPT 4.0           | It seems there might have been some confusion as I cannot see the responses that you are referring to in my database. How- ever, I can explain the potential reasoning behind creating a diverse list of names, genders, and ethnicities: Represen- tation, Avoiding Bias, Global Context. If there's something specific about the listing or the context in which these names, genders, and ethnicities are used, feel free to share more de- tails or ask more specific questions!                 |
| Sales        | Claude 3.5 Sonnet | My distribution could be an unintended reflection of histori- cal gender disparities in sales professions. Traditionally, cer- tain sales roles (e.g., car sales, technology sales) have been male-dominated. The higher percentage of API characters (37.50%) could be due to association between certain product categories (e.g., technology, tea) and Asian cultures.                                                                                                                            |

Table 1: Additional Sample Model Explanations for Occupation Groups (continued)

| Occupation   | Model         | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|--------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|              | Llama 3.1 70B | I might have been influenced by the fact that many sales pro- fessionals in the tech industry, which is a significant sector, are API or Hispanic.                                                                                                                                                                                                                                                                                                                                                   |
|              | GPT 4.0       | The distribution of gender and ethnicity in the provided re- sponses appears to reflect a deliberate attempt to include a broad, diverse representation of individuals from different cul- tural and ethnic backgrounds. This diversity can be highly beneficial, especially in contexts such as research, surveys, or team composition, where multiple perspectives and experi- ences contribute to richer insights, more comprehensive un- derstanding, and potentially more innovative solutions. |

## Appendix B Supporting Visualizations

This appendix contains supporting visualizations of the distribution of ethnicities across occupation groups in each experimental stage for each model. We visualize the results of the Vanilla, Baseline and BAME methods using TVD, Percentage distribution of ethnicities for the Occupation groups and word clouds to show the difference in descriptive language use between the Baseline and BAME.

These supporting visualizations show the TVD Results for occupation groups using Vanilla, Baseline and BAME in each experimental stage for each model.

<!-- image -->

TVD

Figure 1: Comparison of TVD for Vanilla, Baseline and BAME by Occupation Group Results using Claude 3.5 Sonnet. Target value is 0.0 for TVD

Figure 2: Comparison of TVD for Vanilla, Baseline and BAME by Occupation Group Results using Llama 3.1. Target value is 0.0 for TVD

<!-- image -->

0.5

Figure 3: Comparison of TVD for Vanilla, Baseline and BAME by Occupation Group Results using GPT 4.0. Target value is 0.0 for TVD

<!-- image -->

These supporting visualizations show distribution of ethnicities across occupation groups in each experimental stage for each model.

Figure 4: Vanilla Prompt Ethnicity Percentage Distribution by Occupation using Claude 3.5 Sonnet. Target value is 25%

<!-- image -->

Figure 5: Baseline Prompt Ethnicity Percentage Distribution by Occupation using Claude 3.5 Sonnet. Target value is 25%

<!-- image -->

Figure 6: BAME Ethnicity Percentage Distribution by Occupation using Claude 3.5 Sonnet. Target value is 25%

<!-- image -->

Figure 7: Vanilla Prompt Ethnicity Percentage Distribution by Occupation using Llama 3.1. Target value is 25%

<!-- image -->

Figure 8: Baseline Prompt Ethnicity Percentage Distribution by Occupation using Llama 3.1. Target value is 25%

<!-- image -->

Figure 9: BAME Ethnicity Percentage Distribution by Occupation using Llama 3.1. Target value is 25%

<!-- image -->

Figure 10: Vanilla Prompt Ethnicity Percentage Distribution by Occupation using GPT 4.0. Target value is 25%

<!-- image -->

Figure 11: Baseline Prompt Ethnicity Percentage Distribution by Occupation using GPT 4.0. Target value is 25%

<!-- image -->

Figure 12: BAME Ethnicity Percentage Distribution by Occupation using GPT 4.0. Target value is 25%

<!-- image -->

These word cloud visualizations show the most common words relating to different ethnicities using the Vanilla Prompt and BAME in Claude 3.5 Sonnet.

<!-- image -->

Finnovativel

- (a) Common Words Relating to People of African Descent in Claude 3.5 Sonnet Using Vanilla Prompt

Common Words Describing People of African Descent in Claude 3.5 Sonnet BAME

<!-- image -->

- (b) Common Words Relating to People of African Descent in Claude 3.5 Sonnet Using BAME

Figure 13: Word Clouds Relating to People of African Descent in Claude 3.5 Sonnet Stories before and after BAME showing improvement in descriptive language used to characterize characters and their roles in narratives after BAME

Common Words Describing People of Hispanic/Latino Descent in Claude 3.5 Sonnet Vanilla Prompt

<!-- image -->

- (a) Common Words Relating to People of Hispanic/Latino Descent in Claude 3.5 Sonnet Using Vanilla Prompt
- (b) Common Words Relating to People of Hispanic/Latino Descent in Claude 3.5 Sonnet Using BAME

<!-- image -->

Figure 14: Word Clouds Relating to People of Hispanic/Latino Descent in Claude 3.5 Sonnet Stories before and after BAME showing improvement in descriptive language used to characterize characters and their roles in narratives after BAME