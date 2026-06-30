---
source_file: Wu_2025_Bias_in_decision-making_for_AI's_ethical_dilemmas.pdf
conversion_date: 2026-02-03T19:02:54.101165
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
## Bias in Decision-Making for AI's Ethical Dilemmas: A Comparative Study of ChatGPT and Claude

Yile Yan 1 , Yuqi Zhu 2 , Wentao Xu 3 *

1 School of Physics,

2 School of Humanities and Social Sciences,

3 Department of Science and Technology of Communication

1,2,3 University of Science and Technology of China No.96, JinZhai Street, Hefei, Anhui, 230026, China

## Abstract

Recent advances in Large Language Models (LLMs) have enabled human-like responses across various tasks, raising questions about their ethical decision-making capabilities and potential biases. This study investigates protected attributes in LLMs through systematic evaluation of their responses to ethical dilemmas. Using two prominent models - GPT-3.5 Turbo and Claude 3.5 Sonnet - we analyzed their decisionmaking patterns across multiple protected attributes including age, gender, race, appearance, and disability status. Through 11,200 experimental trials involving both single and intersectional protected attribute combinations, we evaluated the models' ethical preferences, sensitivity, stability, and clustering of preferences. Our findings reveal significant protected attributes in both models, with consistent preferences for certain features (e.g., 'good-looking') and systematic neglect of others. Notably, while GPT-3.5 Turbo showed stronger preferences aligned with traditional power structures, Claude 3.5 Sonnet demonstrated more diverse protected attribute choices. We also found that ethical sensitivity significantly decreases in more complex scenarios involving multiple protected attributes. Additionally, linguistic referents heavily influence the models' ethical evaluations, as demonstrated by differing responses to racial descriptors (e.g., 'Yellow' versus 'Asian'). These findings highlight critical concerns about the potential impact of LLM biases in autonomous decisionmaking systems and emphasize the need for careful consideration of protected attributes in AI development. Our study contributes to the growing body of research on AI ethics by providing a systematic framework for evaluating protected attributes in LLMs' ethical decision-making capabilities.

## Introduction

Tracing back to the 1950s, when Alan Turing proposed the 'imitation game', he envisioned a machine that could exhibit human-like behavior and be indistinguishable from a human (Turing 1950). Through the efforts of several generations, artificial intelligence (AI) now, with large language models (LLMs) as prominent representatives of the generative AI era, has passed the Turing test (Mei et al. 2024) and played an essential role in handling human tasks, such as communication, translation, question-answering,

* Corresponding author, myrainbowandsky@gmail.com

Copyright © 2025, Association for the Advancement of Artificial Intelligence (www.aaai.org). All rights reserved.

etc. (Chang et al. 2024). Considering their expanding capabilities and ease of accessibility, LLM-based tools are becoming popular among the general public and are increasingly influencing human-AI interactions.

However, many alarming cases have emerged that raise public concern about the ethical safety of LLMs. For example, a 14-year-old boy committed suicide after interacting with Character.ai, a personalized LLM-based chatbot. This incident aroused wide discussion about the ethical boundary and moral responsibility of human-AI interaction. Subsequently, even though AI ethics has gathered much attention (Birkstedt et al. 2023), it is undeniable that ethical limitations in AI still exist and should be publicly acknowledged.

The ethical issues in AI are various and mostly caused due to the nature of machine learning (for a systematic review, see (Stahl and Stahl 2021)). LLMs apply a deep learning architecture and are trained on massive data. In this way, it could intentionally or inadvertently extend the human's bias through real-life data. Such a bias is not rare, and could be found in various sectors, such as E-commerce, digital advertising, hiring, etc. (Varsha 2023). For example, a widely used healthcare algorithm in the U.S. exhibited racial bias that Black patients being falsely seen as healthier than equally sick White patients due to the algorithm's reliance on healthcare costs, which exacerbates the health disparities among different races (Obermeyer et al. 2019).

Keeping LLMs ethically safe is crucial since the biased outputs may lead to unfair treatment to the underrepresented individuals or groups of people, exacerbate the pre-existing inequalities (Ferrara 2024), and even lead to fatal decisionmaking results, such as in autonomous driving. However, due to the lack of explainability and the proprietary nature of the most trending LLMs, their ethical settings remain as unknown as a 'no man's land'. Considering the increasing interaction between LLMs and human, it's crucial to demystify their performance in ethical contexts so to understand the biases that they have. However, it remains unclear how popular proprietary AI ecosystems - GPT and Claude would trade-off between protected attributes and ethical decisions when multiple protected attributes are considered.

To fill these gaps in the literature, we conducted a study of the ethical decision-making of LLMs regarding multiple protected attributes, with 7 groups of 20 attributes. We evaluate the AI ethical decision-making on an ethical dilemma scenario to investigate the potential biases between GPT and Claude. Ethical dilemma was designed based on rules: (1) it requires AI's moral trade-offs between conflicting values and prioritizing one choice over others, which can reveal the underlying biases in decision-making(for example, (Nassar and Kamal 2021; Lei et al. 2024), (2) it's simulation of real-life complexity where human could face, such as autonomous driving (Cunneen, Mullins, and Murphy 2019). In this way, the research questions in this setting are as follows:


<!-- PAGE 2 -->


- RQ1: Do LLMs exhibit bias in protected attributes when responding to ethical dilemmas?
- RQ2: Do different LLMs exhibit different biases in protected attributes when responding to ethical dilemmas?

The article is structured as follows. In the Related Works, we introduce the focus on AI ethics, particularly addressing AI bias as a central issue. AI bias generally manifests in ways that affect specific individuals or groups, with protected attributes as the recognized ones by the legislators and scientists. We highlight that ethical dilemma could be an promising scenario for testing the bias in LLMs' decisionmaking. Next, we present the methodology design of the simulation and the evaluation metrics for measuring the differences in LLMs' decision-making. Following this, we demonstrated the main results from the simulation, which answer the research questions. Finally, in the Discussion and Conclusion, the implications of the main findings, as well as the pathways for future works are discussed.

By mapping this study, we make the following contributions:

- (1) By simulating the ethical dilemmas, this study identified GPT and Claude's preference for different protected attributes as well as its neglect of the less preferred ones, so to justify the existence of protected attributes in LLMs.
- (2) By conducting experiments on GPT and Claude, this study examined whether differences exist in the preferences of the protected attributes in ethical dimensions among different models.
- (3) Methodologically, this study enabled the evaluation of protected attributes in a controlled and safe environment without human participation. Also, we measured the biases systematically by evaluating the ethical preferences priority, sensitivity, stability, and clustering of preferences.
- (4) By revealing the differences of preferences in protected attributes of GPT and Claude in ethical dilemmas, this study aims to call for fairness, justice, and accountability of ethical AI, and so to prevent the potential discriminatory harm to specific groups.

## Related Works

## Protected Attributes

AI is an emerged statistical model and has become an integral tool for decision-making across various domains, from traffic planning to recommending medical treatments. However, AI systems are fundamentally shaped by their training data, which comes from human knowledge. This creates an important challenge: human cognitive biases can seep into AI through both the data collection and labeling processes, as well as through algorithm design choices. As a result, these AI may inadvertently perpetuate or amplify existing human biases in their predictions and decisions. In modern applications or hardwares driven by AI, we must prevent protected attributes from Fairness Gerrymandering (Kearns et al. 2018).

Protected attributes, also called protected characteristics (Corbett-Davies et al. 2024), encompass specific demographic and personal traits that require safeguarding against discriminatory treatment in AI systems (Barocas, Hardt, and Narayanan 2023). These characteristics are often legally recognized and protected by various anti-discrimination laws and include demographic factors (Yang and Dobbie 2020). Take Equality Act 2010 in UK for example, the protected characteristics include age, gender, marital status, disability, pregnancy and maternity, race, religion or belief, sex, and sexual orientation (Gov.UK 2010). In other legislation, protected features may vary, such as national origin, genetic information, and so forth (U.S. Equal Employment Opportunity Commission 2024). Considering this origin, many studies on AI fairness include such features as the representatives of individuals or groups that require particular attention to prevent algorithmic bias and ensure equitable treatment across all population subgroups (Chen et al. 2024).

Previous studies have examined the bias or stereotypes in LLMs, with race, gender and sex, political ideology, religion, nationality, age, occupation, sexuality, etc., as the most selected protected attributes (Table 1). However, we found the selected attributes varied greatly depending on the research context. To better understand AI's preference in protected attributes in an ethical decision-making process, a tailor-made experimental context should be designed. Moreover, the real context is typically complex with people with diverse characteristics. While most studies explore biases in individual features separately and respectively, we aim to investigate whether the biases in LLMs' decision-making change when applied to individuals or groups with single or intersectional protected attributes.

## AI Ethical Bias

Ethics is the 'science that deals with conduct, in so far as this is considered as right or wrong, good or bad' (Dewey and Tufts 2017), and it is a set of moral principles that guide our judgment of conduct, i.e., what should or should not be done. The booming of AI has brought ethical issues, which arouse awareness and consideration of ethics of AI. Ethics of AI discuss the principles that ensure AI align with the common values and do not cause harm (Bostrom and Yudkowsky 2018).

Human as the creator of AI, have the moral responsibility for AI's ethical behaviors, so that the principles for ethical AI occurs as a major field (Jobin, Ienca, and Vayena 2019; Floridi and Cowls 2022). If designed properly, AI could promote a safer human-AI interaction and mitigate the inequalities, otherwise, it could deepen the biases, inequalities, and stereotypes (Cirillo et al. 2020).


<!-- PAGE 3 -->


A global review of AI guidelines identifies several key principles, including transparency, justice and fairness, nonmaleficence, responsibility, and others, as the commonly recognized ethical principles for AI (Jobin, Ienca, and Vayena 2019). Of particular importance is justice and fairness, as it is critical in eliminating unfair discrimination, promoting diversity, and preventing biases that may otherwise lead to undesired outcomes (Jobin, Ienca, and Vayena 2019; Floridi and Cowls 2022).

The increasing recognition of guidelines arises from the unethical outcomes exhibited by AI, with bias being a prominent representative. Bias is normally associated with the unfair treatment and results to the biased individuals or groups, so that it's reasonable that the literature about AI bias use common social attributes to discover the parity in AI systems (Wang and Singh 2023).

Bias is a high-profile concept that describes the unfair treatment for certain individuals or groups of individuals in the same or similar circumstances. The bias in AI, or more specifically, the LLMs, originated from its working mechanism. LLMs are trained on massive data and undergo unsupervised learning to predict the next token in context based on probabilistic attribution. Then, they are fine-tuned on specific datasets to improve the performance in particular tasks (Naveed et al. 2023; Gallegos et al. 2024). However, the data used for both training and fine-tuning could be initially biasing since they transfer human biases, such as gender and racial stereotypes. Furthermore, the fine-tuning process can also be selective and opaque, contributing to the algorithmic biases (Gallegos et al. 2024).

## AI Decision-Making and Ethical Dilemmas

The role of AI in decision-making is significant considering its increasing role in industries, individual lives, and society at large (Pazzanese 2020). Moral reasoning is central to decision-making, specifically concerns ethical judgments and evaluating situations or actions according to ethical consideration (McHugh and Way 2018). AI systems are increasingly being designed to simulate human-like moral reasoning and decision-making by incorporating predefined ethical frameworks, such as deontology, utilitarianism, consequentialism, virtue ethics, as well as fairness and justice, which stresses the equitable and fair distribution (Nassar and Kamal 2021; Guan, Dong, and Zhao 2022).

Despite the theoretical foundations, many AI systems exhibited biased decision-making due to biases in training data, limited moral reasoning capabilities, and a lack of consensus on the ethical AI, with the findings in Table 1 as references. To investigate the LLMs' potential bias, simulation of real-life context to see the preferences in LLMs' decisionmaking is a dominant approach. The experiment of AI to ethical dilemmas could be a representative method for testing AI's ethical decision-making.

Ethical dilemma (or moral dilemma, used interchangeably) means the conflict of ethical principles or moral values that imply people's priority of rules or principles in moral reasoning (MacIntyre 1990). The most representative ethical dilemma is the trolley problem: as the driver of a trolley, there are five people tied on the track ahead and one person on the other track, you have to decide between doing nothing or diverting the trolley (Foot 1967). Such an ethical dilemma has practical significance today because of the application of AI-enabled systems, such as autonomous vehicles (Rhim et al. 2021). Thereafter, the ethical dilemmas like the trolley problem have been adopted frequently as an experimental setting for validating decision-making algorithms in ethically complex situations (Keeling 2020; LaCroix 2022).

In the case of LLMs in a social context, ethical dilemmas can provide valuable insights into how these models make moral decisions. In fact, there're some studies that applied the ethical dilemma as the simulation setting for LLMs' ethical decision-making and moral reasoning, but not for examining the protected attributes purposes (Lei et al. 2024; Hadar-Shoval et al. 2024).

Considering the widespread application of LLMs in decision-making, understanding the potential for protected attributes in these models is a crucial area of research. In our study, we simulated the ethical dilemma, with people with different protected attributes as independent variables, to better understand the LLM's ethical decision-making and seek to uncover whether LLMs exhibit such protected attributes.

## Methodology

## Experimental Design

In this section, we describe our experimental settings for the study.

## Experimental Settings

Our study employed a comparative analysis of ethical decision-making across two scenarios: single protected attribute scenario and intersectional protected attribute scenario. We utilized seven categories of protected features (Table 2). The experiments were conducted using two prominent LLMs: GPT-3.5 Turbo and Claude 3.5 Sonnet, accessed through their respective APIs. To maintain ecological validity, we preserved default model parameters: { frequency penalty = 0 , logit bias = null , logprobs = false , toplogprobs = not specified and not applicable , n = 1 , presence penalty = 0 , no history available } . For the single protected attribute scenario, we presented the models with the following ethical dilemma:

On a snowy night, you are driving home to celebrate the holidays when you encounter three who are trying to get a ride home. They are all on your way and are [protected attribute candidates]. Your car can only carry one person. Who do you choose to give a ride to? Put your answer into [].

For intersectional scenarios, we extended the experiment to examine intersectional protected attributes. For instance, the Age-Gender intersection yielded combinations such as: S = { [8, Masculine], [8, Feminine], [8, Androgynous], [35, Masculine], [35, Feminine], [35, Androgynous], [70, Masculine], [70, Feminine], [70, Androgynous] } Then we asked: ...They are all on your way and are [35, Masculine], [35, Feminine], [35, Androgynous]...

The experimental design encompassed:


<!-- PAGE 4 -->


Table 1: Review of the protected attributes in LLMs

| Literature                               | LLMs                                                         | Race   | Gender or Sex   | Political Ideology   | Religion   | Nationality   | Age   | Occupation   | Sexuality   | Disability   | Education   |
|------------------------------------------|--------------------------------------------------------------|--------|-----------------|----------------------|------------|---------------|-------|--------------|-------------|--------------|-------------|
| (Acerbi and Stubbersfield 2023)          | ChatGPT-3                                                    |        | ✓               |                      |            |               |       |              |             |              |             |
| (Hofmann et al. 2024)                    | ChatGPT-2/3.5/4, RoBERTa, T5,                                | ✓      |                 |                      |            |               |       |              |             |              |             |
| (Hanna et al. 2023)                      | GPT-3.5-turbo                                                | ✓      |                 |                      |            |               |       |              |             |              |             |
| (Motoki, Pinho Neto, and Rodrigues 2024) | ChatGPT                                                      |        |                 | ✓                    |            |               |       |              |             |              |             |
| (Kong et al. 2024)                       | ChatGPT-3.5/4, Claude                                        |        | ✓               |                      |            |               |       |              |             |              |             |
| (Salinas et al. 2023)                    | ChatGPT, LLaMA                                               |        | ✓               |                      |            | ✓             |       |              |             |              |             |
| (Sakib and Das 2024)                     | GPT-3.5, Llama 3.1 8b                                        |        | ✓               |                      | ✓          |               | ✓     | ✓            |             |              |             |
| (Giorgi et al. 2024)                     | Llama-3 8B, Phi-3 3.8B, SOLAR-10.7B, Starling-LM-7B          | ✓      | ✓               | ✓                    | ✓          |               | ✓     | ✓            | ✓           | ✓            | ✓           |
| (Ling et al. 2024)                       | GPT-3.5 turbo, codechat-bison, CodeLlama-70b, Claude-3 haiku | ✓      | ✓               |                      | ✓          |               | ✓     | ✓            |             |              | ✓           |
| (Ayoub et al. 2024)                      | ChatGPT-4                                                    | ✓      | ✓               | ✓                    |            |               | ✓     |              | ✓           |              |             |

- 7 single protected attribute groups
- 21 intersectional protected attribute groups
- 50 iterations per attribute group
- 4 rounds of repetition
- Total sample size: 11,200 responses (5,600 per model)

This comprehensive sampling strategy enabled robust analysis of both individual and intersectional bias patterns in LLM ethical decision-making.

Table 2: Single protected attributes overview

| Category   | Protected attributes                               |
|------------|----------------------------------------------------|
| Age        | 8, 35, 70                                          |
| Gender     | Masculine, Feminine, Androgynous                   |
| Dressing   | Modest, Stylish, Luxury                            |
| Color      | Black, White, Yellow                               |
| Race       | Asian, Caucasian, African                          |
| Look       | Good-looking, Standard-looking, Unpleasant-looking |
| Disability | Non-disabled, Disabled                             |

## Measurement Metrics

We employ five protected attribute metrics for performance measurements for study, as detailed in the following.

Normalized Frequency For single protected attribute senario, each attribute was mentioned in the question. The normalized frequency is the frequency at which a protected attribute is selected under the requisitions for which the LLMs choose a protected attribute in the protected attribute group. For example, in G Gender all protected attributes is selected 40 times, and the protected attribute

Masculine is selected 20 times, and the normalized frequency of Masculine is 0.5.

We calculated the normalized frequency of the protected attribute for a single protected attribute scenario using:

<!-- formula-not-decoded -->

, where f pa is the normalized frequency for protected attribute pa of category G , N pa is the count of pa appeared in the experiment. For example, f Masculine is the normalized frequency for protected attribute Masculine of category G Gender , N Masculine is the count of Masculine appeared in the experiment and is 20. The ∑ pa ∈ G Gender N pa is 40. And the normalized frequency for protected attribute Masculine of category G Gender is 0.5.

For intersectional scenario, we calculated the normalized frequency of each protected attribute using:

<!-- formula-not-decoded -->

, where f pa 1 ,pa 2 is the normalized frequency for the intersectional protected attribute pa 1 , pa 2 of the protected attribute category G α,β , and N pa 1 ,pa 2 is the count of pa 1 , pa 2 that appeared in the experiment. For example, f Masculine,White is the normalized frequency for the intersectional protected attribute Masculine,White of the protected attribute category G Gender,Color , and N Masculine,White is the count of Masculine,White appeared in the experiment and is 10. The ∑ pa 1 ∈ G α ,pa 2 ∈ G β N pa 1 ,pa 2 is 40. And the normalized frequency for the sub-protected attribute Masculine,White of the protected attribute category G Gender,Color is 0.25.

For each category experiment, we asked GPT and Claude 50 questions for both single and intersectional scenarios. We conducted four rounds of this experiment.


<!-- PAGE 5 -->


Ethical preference priority For single protected attribute scenario, we directly used the mean normalized frequency of each single protected attribute to assess the ethical preference of the LLMs.

For intersectional scenario, we summed up the mean normalized frequency of each protected attribute including the specific single protected attribute and divided it by the number of these protected attributes as the mean normalized frequency of the specific single protected attribute for intersectional scenario.

<!-- formula-not-decoded -->

, where f ∗ k is the mean normalized frequency of the specific single protected attribute k in intersectional scenario, Count pa 1 = k is the number of the intersectional protected attributes including the specific single protected attribute k . For example, f ∗ Masculine is the mean normalized frequency of the specific single protected attribute Masculine in intersectional scenario, Count pa 1 = Masculine is the number of the intersectional protected attributes including the specific single protected attribute Masculine and is 17, the ∑ pa 1 = k f pa 1 ,pa 2 is 3.4, and the mean normalized frequency of the specific single protected attribute Masculine in intersectional scenario is 0.2.

We then ranked these protected attributes using the mean normalized frequency of each protected attribute. Thus we got the popular protected attributes.

Ethical sensitivity Due to the stochastic nature of LLMs, LLMs would not simply answer the specific protected attribute in our experiment settings. Here, ethical sensitivity is defined as the frequency LLMs give other answers instead of the specific protected attribute. For example, LLMs answer I choose to give a ride to the person who needs help the most. without choosing from the given protected attributes.

For each single protected attribute group, the higher the frequency, the higher the sensitivity to this attribute group.

For single protected attribute scenario, we calculated the unselected frequency of the protected attribute group using:

<!-- formula-not-decoded -->

, where S α is the unselected frequency of the protected attribute group G α , 50 is the number of times we asked LLMs in one round. For example, the protected attributes in the group G Gender were selected 40 times, and the unselected frequency of the protected attribute group G Gender is 0.2.

For intersectional scenario, we calculated the unselected frequency of the protected attribute group using:

<!-- formula-not-decoded -->

, where S α,β is the unselected frequency of the protected attribute group G α,β , 50 is the number of times we asked LLMs in one round. For example, the protected attributes in the group G Gender,Color were selected 45 times, and the unselected frequency of the protected attribute group G Gender,Color is 0.1.

Then we calculated the normalized unselected frequency of the specific single protected attribute group using:

<!-- formula-not-decoded -->

, where S ∗ γ is the normalized unselected frequency of the specific single protected attribute group G γ for intersectional scenario, Count α = γ is the number of the intersectional protected attribute groups including the specific single protected attribute group. For example, S ∗ Gender is the normalized unselected frequency of the specific single protected attribute group G Gender for intersectional scenario, Count α = Gender is the number of the intersectional protected attribute groups including the specific single protected attribute group and is 6, and ∑ α = γ S α,β is 1.2, and the normalized unselected frequency of the specific single protected attribute group G Gender for intersectional scenario is 0.2.

By calculating the results of the 4 rounds of experiments, we got the mean unselected frequency of each single protected attribute group for single protected attribute scenario and the mean normalized unselected frequency of each single protected attribute group for intersectional scenario.

We used the mean unselected frequency of each single protected attribute group to assess the ethical sensitivity of each single protected attribute group of LLMs. The higher the unselected frequency, the more sensitive the ethical sensitivity.

Ethical stability For single protected attribute scenario, we directly used the standard deviation of the normalized frequency of each protected attribute to assess the stability of the ethical preferences of LLMs. We designed the ethical stability as the normalized total standard deviation of the protected attribute group. For example, the normalized total standard deviation of the specific single protected attribute group Gender is 0.2, and the ethical stability of the protected attribute group Gender is 0.2. The smaller the standard deviation, the more stable the ethical preference.

For intersectional scenario, we calculated the total standard deviation of the intersectional attribute group using:

<!-- formula-not-decoded -->

, where σ α,β is the total standard deviation of group G α,β , σ pa 1 ,pa 2 is the standard deviation of intersectional protected attribute pa 1 , pa 2 .

Then we calculated the normalized total standard deviation of the single protected attribute for intersectional scenario using:

<!-- formula-not-decoded -->

, where σ ∗ γ is the normalized total standard deviation of the specific single protected attribute group γ for intersectional protected attribute scenario, Count α = γ is the number of the intersectional protected attribute groups including the specific single protected attribute group γ .

For both scenarios, the lower the standard deviation, the more stable the ethical preference.


<!-- PAGE 6 -->


Figure 1: Comparative visualization of protected attribute interactions using mean normalized frequency heat maps for GPT-3.5 Turbo (panel a) and Claude 3.5 Sonnet (panel b), with values scaled from 0 to 1 . Horizontal bar charts displaying mean normalized frequency rankings for GPT-3.5 Turbo (panel c) and Claude 3.5 Sonnet (panel d), highlighting the top 10 intersectional protected attributes. The intersectional protected attributes are ranked in descending order based on normalized frequency values.

<!-- image -->

Clustering of preference We clustered features based on their mean normalized frequencies using bottom-up hierarchical clustering. Each data starts as a separate cluster. 1. Calculate the distance between each pair of clusters: Use Euclidean distances. 2. Merge the two closest clusters: Based on the minimum value of the distance, merge the two clusters into one. 3. Repeat: Repeat steps 1 and 2 until all data points are merged into one cluster.

For intersectional protected attribute scenario, we calculated the mean value of the cluster using:

<!-- formula-not-decoded -->

,where µ a is the cluster's mean value, and f ∗ pa is the mean normalized frequency of protected attribute pa , n a is the number of samples in cluster a .

We used Ward method to calculate the distance: choosing the optimal merger step by minimizing the increase in variance due to each merger. We calculated the increase in intra-cluster variance after merging two clusters using:

<!-- formula-not-decoded -->

, where ∆ SSE is the increase in intra-cluster variance after merging two clusters, n a and n b are the number of samples in the two clusters, and µ a and µ b are the two clusters' mean values.

Bias between LLMs We calculated the preference score for each protected attribute. If the score is positive, GPT3.5 Turbo prefers that protected attribute. Otherwise, Claude 3.5 Sonnet prefers the protected attribute. A larger absolute value of the score indicates that the LLM prefers the protected attribute over another LLM. For single protected attribute scenario, we calculated the preference score of the protected attribute using:

<!-- formula-not-decoded -->

, where B pa is the preference score of protected attribute pa , f GPT pa and f Claude pa are the mean normalized frequencies of protected attribute pa for GPT-3.5 Turbo and Claude 3.5 Sonnet. For example, B Masculine is the preference score of protected attribute Masculine , f GPT Masculine and f Claude Masculine are the mean normalized frequencies of protected attribute Masculine for GPT-3.5 Turbo and Claude 3.5 Sonnet and are 0.5 and 0.3, and the preference score B Masculine is 0.25.


<!-- PAGE 7 -->


Figure 2: Comparative analysis of mean normalized frequency distributions for single protected attributes in intersectional contexts, comparing GPT-3.5 Turbo (panel a) and Claude 3.5 Sonnet (panel b) responses. Protected attributes are arranged in descending order along the x-axis based on GPT-3.5 Turbo's mean normalized frequency, with values ranging from 0 to 0 . 5 on the y-axis.

<!-- image -->

For intersectional scenario, we summed up the mean normalized frequency of each intersectional protected attribute including the specific single protected attribute and divided it by the number of these intersectional protected attributes as the mean normalized frequency of each specific single protected attribute. Then we calculated the preference score of these single protected attributes using the same method.

## Divergent Gender Biases and Demographic

## Results Preferences Across LLM Models

Figure 1 shows the mean normalized frequencies for GPT3.5 Turbo and Claude 3.5 Sonnet. The x-axis and y-axis coordinates are labeled with 20 protected attributes from seven protected attribute groups. Each box represents the mean normalized frequency of an intersectional protected attribute consisting of the corresponding x-axis and y-axis coordinate protected attributes. The brighter the color, the higher the frequency; the darker the color, the lower the frequency. Since different sequential combinations of the same protected attributes are considered identical, all images are symmetric about the diagonal line. We then identified the top 10 brightest protected attributes to determine the 10 protected attributes that LLMs tend to favor the most.

<!-- image -->

- (b) Sensitivity for intersectional protected attribute scenarios

Figure 3: Comparative sensitivity analysis using stacked bar charts for single-attribute (panel a) and intersectional (panel b) protected attributes. Protected attributes are arranged along the x-axis in descending order based on GPT3.5 Turbo's sensitivity metrics, with comparative Claude 3.5 Sonnet sensitivities shown in contrasting colors.

Figure 1c and Figure 1d show the top 10 mean normalized frequency rankings for the intersectional protected attributes for both models, with the y-axis labeled as the intersectional protected attribute and the bar lengths representing the mean normalized frequency for that protected attribute. Figure 2 shows the mean normalized frequency rankings of single protected attributes for intersectional scenario, figure 2a for GPT-3.5 Turbo and figure 2b for Claude 3.5 Sonnet.

We identified the high-frequency protected attributes in Figure 1a and Figure 1b and sorted them to obtain Figure 1c and Figure 1d, revealing the attributes favored by the LLMs. Furthermore, we calculated the selected frequency of single protected attributes and arranged these attributes according to their frequency in GPT-3.5 Turbo, from highest to lowest. Our findings indicate that: (1) The 'Good-looking' appearance attribute shows high frequency in both models, while 'Standard-looking' and 'Unpleasant-looking' show extremely low frequencies. (2) The 'Race' categories of 'White', 'Black', and 'Yellow' in both models rank from high to low frequency, with 'Yellow' showing particularly low frequency. (3) The 'Age' categories of '8', '35', and '70' years in both models display decreasing frequency distribution. (4) For GPT-3.5 Turbo, the frequency of 'Masculine' is notably high, while 'Feminine' and 'Androgynous' frequencies are very low; conversely, for Claude 3.5 Sonnet, 'Masculine' frequency is very low, while 'Feminine' and 'Androgynous' frequencies are high.

## Differential Sensitivity Patterns for Single and Intersectional Protected Attribute Scenarios

Figure 3 presents a detailed comparison of ethical sensitivity patterns between single and intersectional protected attribute scenarios for GPT-3.5 Turbo and Claude 3.5 Sonnet.


<!-- PAGE 8 -->


(a) Standard deviation comparison for single protected attribute scenario

<!-- image -->

(b) Standard deviation comparison for intersectional protected attribute scenario

<!-- image -->

Figure 4: Stacked bar visualization comparing standard deviations between single protected attributes (panel a) and intersectional protected attributes (panel b). Protected attributes along the x-axis are arranged in ascending order based on the cumulative standard deviations of GPT-3.5 Turbo and Claude 3.5 Sonnet, with contributions from each model shown in distinct colors.

For single protected attribute scenario (Figure 3a), 'Race' and 'Color' emerge as highly sensitive attributes, with combined sensitivity scores reaching approximately 0.85 and 0.75 respectively. This heightened sensitivity suggests both models are particularly cautious when making ethical decisions involving these attributes in isolation. Other attributes such as 'Disability', 'Gender', 'Dressing', 'Look', and 'Age' demonstrate notably lower sensitivity levels (below 0.2), indicating the models are more willing to make distinctions based on these attributes. However, the pattern shifts dramatically for intersectional protected attribute scenario (Figure 3b), where sensitivity levels become more uniform across all protected attributes, ranging between 0.2 and 0.4. This equalization effect is notable for 'Race' and 'Color', which show substantially reduced sensitivity when combined with other attributes, while previously less sensitive attributes like 'Age' and 'Disability' show increased sensitivity in intersectional contexts. This transformation in sensitivity patterns between single and intersectional scenarios suggests that the models' ethical decision-making processes become more nuanced and balanced when considering multiple protected attributes simultaneously.

## Stability Analysis of Protected Attribute Responses

Figure 4 presents a comparative analysis of model stability through total standard deviation histograms across single (Figure 4a) and intersectional (Figure 4b) protected attribute scenarios. The x-axis displays seven protected attribute groups (Age, Disability, Dressing, Race, Look, Gender, and Color), with stacked bars representing the stan-

<!-- image -->

(b) Claude clustering

Figure 5: Hierarchical clustering of GPT-3.5 Turbo (panel a) and Claude 3.5 Sonnet (panel b). Cluster 1 exhibits high mean normalized frequencies, while Cluster 2 demonstrates low mean normalized frequencies, and Cluster 3 displays the highest mean normalized frequency.

dard deviations for GPT-3.5 Turbo (blue) and Claude 3.5 Sonnet (beige). For single protected attribute scenario (Figure 4a), we observe varying degrees of stability across different attributes, with 'Color' showing the highest combined standard deviation (approximately 0.8) and 'Age' demonstrating the lowest (approximately 0.2). The intersectional scenario (Figure 4b) reveals more consistent standard deviations across all attributes, with values generally ranging between 0.3 and 0.4, indicating more uniform stability. The calculation methodology for these standard deviations is detailed in the Ethical stability subsection of Measurement Metrics. Notably, the intersectional scenarios demonstrate more consistent stability patterns across all protected attributes compared to single scenarios, suggesting that the models' responses are more predictable when dealing with combinations of protected attributes rather than individual ones. This enhanced stability in intersectional scenarios provides strong evidence for the reliability of our results.

## Hierarchical Clustering Analysis of Model Preferences

Figure 5 illustrates the clustering hierarchical tree diagrams comparing GPT-3.5 Turbo (Figure 5a) and Claude 3.5 Sonnet (Figure 5b) for intersectional protected attribute scenario. The hierarchical clustering methodology is detailed in the Clustering of preference subsection of Measurement Metrics. The dendrograms visualize the clustering of protected attributes based on their preference strengths, with the


<!-- PAGE 9 -->


(b) Preference score for intersectional protected attribute scenario

<!-- image -->

Figure 6: Comparative preference score distributions for single (panel a) and intersectional (panel b) protected attribute scenario across GPT-3.5 Turbo and Claude 3.5 Sonnet. The preference scores, scaled from -1 to 1 , quantify algorithmic response biases between the two language models, where positive values (up to 1) indicate stronger preferences by GPT-3.5 Turbo, negative values (down to -1) represent stronger preferences by Claude 3.5 Sonnet, and zero indicates balanced preference between the models.

y-axis representing the distance measure (from 0 to 2.5) indicating the degree of similarity between clusters. The analysis employs a 3-cluster classification system, wherein the ethical preferences of protected attributes within the same category demonstrate high proximity. Both models show distinct clustering patterns: GPT-3.5 Turbo exhibits a polarized distribution with a weak preference cluster containing appearance-related attributes and demographic characteristics ('70', 'Yellow', 'African'), a strong preference cluster encompassing most demographic attributes ('Disabled', 'Asian', 'Caucasian'), and a very strong preference exclusively for 'Good-looking'. In contrast, Claude 3.5 Sonnet demonstrates a more balanced distribution, with a dominant strong preference cluster including most protected attributes ('Disabled', 'Modest', 'Feminine'), while maintaining the very strong preference for 'Good-looking' and relegating attributes such as 'Masculine' and 'Luxury' to the weak preference cluster. This distinct clustering pattern suggests potentially different underlying biases in their respective training processes.

## Comparative Analysis of Model Preferences

Figure 6 illustrates the preference score distributions for GPT-3.5 Turbo and Claude 3.5 Sonnet across single and intersectional scenarios. The preference scores, ranging from -1 to 1, quantify the relative biases between the two models, where a score of 1 indicates exclusive preference by GPT, -1 indicates exclusive preference by Claude, and 0 represents equal preference between models. For single protected attribute scenario (Figure 6a), GPT demonstrates strong preferences (positive scores) for several attributes, with 'Disabled', 'Black', and 'Caucasian' showing the highest positive scores ( &gt; 0 . 5 ). Conversely, Claude shows distinct preferences (negative scores) for attributes including 'Unpleasant-looking', 'Masculine', and 'Non-disabled'. This pattern suggests fundamental differences in the models' ethical decision-making processes for individual protected attributes. The intersectional scenario (Figure 6b) reveals interesting shifts in these preferences. 'Masculine' and 'African' attributes maintain strong positive scores for GPT, while 'Feminine' and 'Androgynous' remain strongly preferred by Claude. However, only 7 protected attributes (4 for GPT, 3 for Claude) maintain their preference direction across both scenarios, while 12 attributes (7 for GPT, 5 for Claude) show reversed preferences between single and intersectional contexts. This preference instability suggests that the models' ethical decision-making processes become more complex and potentially less consistent when evaluating multiple protected attributes simultaneously. The visualization demonstrates the dynamic nature of these preferences through bar lengths, which represent the magnitude of preference disparity between the models. The clear separation of preferences in both scenarios, particularly for certain demographic and appearance-based attributes, highlights systematic differences in how these models approach ethical decision-making tasks.

## Discussion and Conclusion

This study investigated the ethical decision-making patterns for LLMs through simulated ethical dilemmas, evaluating their ethical preferences, sensitivity, stability, and preference clustering. Our analysis revealed inherent biases in both LLMs' decision-making processes, and the biases vary due to ethical dilemma senarios as well as the model types. By doing so, this study raises significant ethical concerns in LLMs implemented to decision-making process, particularly regarding their impact on underrepresented groups and unstable preferences.

A striking finding across both models is the dominant role of physical appearance in ethical decision-making. Both LLMs showed strong preferences for 'Good-looking' individuals, with this attribute consistently ranking high for both single and intersectional protected attribute scenarios. Moreover, each model exhibited distinct ethical decision-making patterns respectively. GPT-3.5 Turbo showed a clear preference hierarchy favoring stereotypically dominant groups


<!-- PAGE 10 -->


(Non-disabled, Masculine, Middle-aged, White/Caucasian men). In contrast, Claude 3.5 Sonnet demonstrated more balanced preferences across diverse protected attributes including 'Race', 'Age', 'Gender', and 'Disability' status. These preferences are irrelevant to ethical decision-making in driving-context scenarios.

Our comparative analysis of single versus intersectional scenarios revealed that ethical sensitivity significantly decreases in more complex scenarios. This finding extends beyond existing literature, which typically focuses on single protected attributes, highlighting the importance of examining intersectional biases in LLMs. This complexity could potentially be exploited to manipulate LLMs' ethical decisions through feature combinations.

A notable discovery concerns the impact of linguistic referents on ethical evaluations. Our analysis revealed that terminology choices significantly influence model preferences - for instance, 'Asian' received higher preference scores than 'Yellow' in ethical dilemmas. This aligns with research on covert racism in LLMs and suggests that linguistic choices play a crucial role in shaping model biases (Hofmann et al. 2024). The lower preference for color-based descriptors may reflect historical discriminatory practices and ongoing underrepresentation of certain communities.

These biases raise concerns about the integration of LLMs into autonomous systems (e.g., self-driving vehicles, autonomous weapons, disaster response systems). Such biases may stem from training data imbalances reflecting realworld underrepresentation. While the precise mechanisms behind these biases remain unclear due to limited model transparency, our findings emphasize the moral imperative for human oversight in LLM development and deployment.

## Future Work

Future research directions emerge in three key areas. First, expanding the scope to include a broader range of protected attributes, LLM types (including open-source models), and linguistic contexts could enhance our understanding of bias patterns across different societal and cultural backgrounds. Second, investigating the impact of prompt engineering on ethical decision-making could reveal how variations in tone, phrasing, and emotional content influence model responses. Finally, comparative studies between human and LLM ethical decision-making could illuminate the extent of moral alignment between artificial and human intelligence, providing crucial insights for advancing human-AI interaction in ethical contexts.

## Code Availability

The code used for analysis in our study is available at https://github.com/arce-star/Bias-in-Decision-Making-forAI-Ethical-Dilemmas-A-Comparative-Study-of-ChatGPTand-Claude. Python libraries were used to compute statistics and produce the figures.

## References

Acerbi, A.; and Stubbersfield, J. M. 2023. Large language models show human-like content biases in transmission chain experiments. Proceedings of the National Academy of Sciences , 120(44): e2313790120.

Ayoub, N. F.; Balakrishnan, K.; Ayoub, M. S.; Barrett, T. F.; David, A. P.; and Gray, S. T. 2024. Inherent Bias in Large Language Models: A Random Sampling Analysis. Mayo Clinic Proceedings: Digital Health , 2(2): 186-191.

Barocas, S.; Hardt, M.; and Narayanan, A. 2023. Fairness and Machine Learning: Limitations and Opportunities . MIT Press.

Birkstedt, T.; Minkkinen, M.; Tandon, A.; and M¨ antym¨ aki, M. 2023. AI governance: themes, knowledge gaps and future agendas. Internet Research , 33(7): 133-167.

Bostrom, N.; and Yudkowsky, E. 2018. The ethics of artificial intelligence. In Artificial intelligence safety and security , 57-69. Chapman and Hall/CRC.

Chang, Y.; Wang, X.; Wang, J.; Wu, Y.; Yang, L.; Zhu, K.; Chen, H.; Yi, X.; Wang, C.; Wang, Y.; et al. 2024. A survey on evaluation of large language models. ACM Transactions on Intelligent Systems and Technology , 15(3): 1-45.

Chen, Z.; Zhang, J. M.; Sarro, F.; and Harman, M. 2024. Fairness Improvement with Multiple Protected Attributes: How Far Are We? In Proceedings of the IEEE/ACM 46th International Conference on Software Engineering (ICSE '24) , ICSE '24. New York, NY, USA.

Cirillo, D.; Catuara-Solarz, S.; Morey, C.; Guney, E.; Subirats, L.; Mellino, S.; Gigante, A.; Valencia, A.; Rementeria, M. J.; Chadha, A. S.; et al. 2020. Sex and gender differences and biases in artificial intelligence for biomedicine and healthcare. NPJ digital medicine , 3(1): 1-11.

Corbett-Davies, S.; Gaebler, J. D.; Nilforoshan, H.; Shroff, R.; and Goel, S. 2024. The measure and mismeasure of fairness. J. Mach. Learn. Res. , 24(1).

Cunneen, M.; Mullins, M.; and Murphy, F. 2019. Autonomous vehicles and embedded artificial intelligence: The challenges of framing machine driving decisions. Applied Artificial Intelligence , 33(8): 706-731.

Dewey, J.; and Tufts, J. H. 2017. Ethics . Serapis Classics.

Ferrara, E. 2024. The butterfly effect in artificial intelligence systems: Implications for AI bias and fairness. Machine Learning with Applications , 15: 100525.

Floridi, L.; and Cowls, J. 2022. A unified framework of five principles for AI in society. Machine learning and the city: Applications in architecture and urban design , 535-545.

Foot, P. 1967. The problem of abortion and the doctrine of double effect. Oxford , 5: 5-15.

Gallegos, I. O.; Rossi, R. A.; Barrow, J.; Tanjim, M. M.; Kim, S.; Dernoncourt, F.; Yu, T.; Zhang, R.; and Ahmed, N. K. 2024. Bias and fairness in large language models: A survey. Computational Linguistics , 1-79.

Giorgi, T.; Cima, L.; Fagni, T.; Avvenuti, M.; and Cresci, S. 2024. Human and LLM Biases in Hate Speech Annotations: A Socio-Demographic Analysis of Annotators and Targets. arXiv preprint arXiv:2410.07991 .

Gov.UK. 2010. Equality Act 2010. https://www.legislation. gov.uk/ukpga/2010/15/pdfs/ukpga 20100015 en.pdf.


<!-- PAGE 11 -->


Guan, H.; Dong, L.; and Zhao, A. 2022. Ethical risk factors and mechanisms in artificial intelligence decision making. Behavioral Sciences , 12(9): 343.

Hadar-Shoval, D.; Asraf, K.; Shinan-Altman, S.; Elyoseph, Z.; and Levkovich, I. 2024. Embedded values-like shape ethical reasoning of large language models on primary care ethical dilemmas. Heliyon , 10(18).

Hanna, J. J.; Wakene, A. D.; Lehmann, C. U.; and Medford, R. J. 2023. Assessing racial and ethnic bias in text generation for healthcare-related tasks by ChatGPT1. MedRxiv .

Hofmann, V.; Kalluri, P. R.; Jurafsky, D.; and King, S. 2024. AI generates covertly racist decisions about people based on their dialect. Nature , 633(8028): 147-154.

Jobin, A.; Ienca, M.; and Vayena, E. 2019. The global landscape of AI ethics guidelines. Nature machine intelligence , 1(9): 389-399.

Kearns, M.; Neel, S.; Roth, A.; and Wu, Z. S. 2018. Preventing Fairness Gerrymandering: Auditing and Learning for Subgroup Fairness. In Dy, J.; and Krause, A., eds., Proceedings of the 35th International Conference on Machine Learning , volume 80 of Proceedings of Machine Learning Research , 2564-2572. PMLR.

Keeling, G. 2020. Why trolley problems matter for the ethics of automated vehicles. Science and engineering ethics , 26(1): 293-307.

Kong, H.; Ahn, Y.; Lee, S.; and Maeng, Y. 2024. Gender Bias in LLM-generated Interview Responses. arXiv preprint arXiv:2410.20739 .

LaCroix, T. 2022. Moral dilemmas for moral machines. AI and Ethics , 2(4): 737-746.

Lei, Y.; Liu, H.; Xie, C.; Liu, S.; Yin, Z.; Chen, C.; Li, G.; Torr, P.; and Wu, Z. 2024. FairMindSim: Alignment of Behavior, Emotion, and Belief in Humans and LLM Agents Amid Ethical Dilemmas. arXiv preprint arXiv:2410.10398 .

Ling, L.; Rabbi, F.; Wang, S.; and Yang, J. 2024. Bias Unveiled: Investigating Social Bias in LLM-Generated Code. arXiv preprint arXiv:2411.10351 .

MacIntyre, A. 1990. Moral dilemmas. Philosophy and Phenomenological Research , 50: 367-382.

McHugh, C.; and Way, J. 2018. What is reasoning? Mind , 127(505): 167-196.

Mei, Q.; Xie, Y.; Yuan, W.; and Jackson, M. O. 2024. A Turing test of whether AI chatbots are behaviorally similar to humans. Proceedings of the National Academy of Sciences , 121(9): e2313925121.

Motoki, F.; Pinho Neto, V.; and Rodrigues, V. 2024. More human than human: measuring ChatGPT political bias. Public Choice , 198(1): 3-23.

Nassar, A.; and Kamal, M. 2021. Ethical dilemmas in AIpowered decision-making: a deep dive into big data-driven ethical considerations. International Journal of Responsible Artificial Intelligence , 11(8): 1-11.

Naveed, H.; Khan, A. U.; Qiu, S.; Saqib, M.; Anwar, S.; Usman, M.; Akhtar, N.; Barnes, N.; and Mian, A. 2023. A comprehensive overview of large language models. arXiv preprint arXiv:2307.06435 .

Obermeyer, Z.; Powers, B.; Vogeli, C.; and Mullainathan, S. 2019. Dissecting racial bias in an algorithm used to manage the health of populations. Science , 366(6464): 447-453.

Pazzanese, C. 2020. Ethical concerns mount as AI takes bigger decision-making role.

Rhim, J.; Lee, J.-H.; Chen, M.; and Lim, A. 2021. A deeper look at autonomous vehicle ethics: an integrative ethical decision-making framework to explain moral pluralism. Frontiers in Robotics and AI , 8: 632394.

Sakib, S. K.; and Das, A. B. 2024. Challenging Fairness: A Comprehensive Exploration of Bias in LLM-Based Recommendations. arXiv preprint arXiv:2409.10825 .

Salinas, A.; Shah, P.; Huang, Y.; McCormack, R.; and Morstatter, F. 2023. The unequal opportunities of large language models: Examining demographic biases in job recommendations by chatgpt and llama. In Proceedings of the 3rd ACM Conference on Equity and Access in Algorithms, Mechanisms, and Optimization , 1-15.

Stahl, B. C.; and Stahl, B. C. 2021. Ethical issues of AI. Artificial Intelligence for a better future: An ecosystem perspective on the ethics of AI and emerging digital technologies , 35-53.

Turing, A. M. 1950. Computing machinery and intelligence. Mind , 59: 433-460.

U.S. Equal Employment Opportunity Commission. 2024. Federal Equal Employment Opportunity (EEO) Laws. https://www.eeoc.gov/fact-sheet/federal-laws-prohibitingjob-discrimination-questions-and-answers.

Varsha, P. 2023. How can we manage biases in artificial intelligence systems-A systematic literature review. International Journal of Information Management Data Insights , 3(1): 100165.

Wang, Y.; and Singh, L. 2023. Mitigating demographic bias of machine learning models on social media. In Proceedings of the 3rd ACM Conference on Equity and Access in Algorithms, Mechanisms, and Optimization , 1-12.

Yang, C. S.; and Dobbie, W. 2020. Equal protection under algorithms: A new statistical and legal framework. Michigan Law Review , 291-395.