---
title: AI_Gender_Bias__Disparities__and_Fairness__Does_Tr
authors:
  - Unknown Author
year: 2024
type: research-paper
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2025-09-29
date_modified: 2025-09-29
bias_types:
  - Discrimination
  - Prejudice
  - Disparity
---

# AI_Gender_Bias__Disparities__and_Fairness__Does_Tr

## Key Concepts

### Bias Types
- [[Discrimination]]
- [[Disparity]]
- [[Prejudice]]

## Full Text

---
source_file: AI Gender Bias, Disparities, and Fairness_ Does Tr.pdf
conversion_date: 2025-08-06T13:43:40.835099
---

## AI Gender Bias, Disparities, and Fairness: Does Training Data Matter?

Ehsan Latif 1* , Xiaoming Zhai 2 and Lei Liu 3

1,2* AI4STEM Education Center, University of Georgia, Athens, 30605, Athens, USA.

3 Educational Testing Service, Princeton, New Jersey, USA.

*Corresponding author(s). E-mail(s): ehsan.latif@uga.edu; Contributing authors: xiaoming.zhai@uga.edu; lliu001@ets.org;

## Abstract

This paper examines one of the pressing concerns of gender biases in the human subject data used to train large language models. As a part of this discussion it summarizes the findings about gender bias in automatic scoring of studentwritten responses. Therefore, the first research question is to analyze the potential gender bias, gender inequality, and gender equity in usually gender-averaged AI training samples (i.e., male, female, and a combination of both). Using the finetuned version of the BERT model and combined with GPT-3.5, this research employs more than 6000 human-graded student responses from seventy males and seventy females across six tasks. The study employs three distinct techniques for bias analysis: The metrics used in this work are scoring accuracy difference to assess the degree of bias, mean score gaps by gender (MSG) to determine gender disparity, and Equalized Odds (EO) to measure fairness. This has been found to be true concerning mixed-gender trained models, in which results have said the scoring accuracy difference between male- and female-trained models is insignificant, therefore supporting that no significant scoring bias exists. In agreement with BERT and GPT-3.5 was that mixed gender trained models produced fewer MSG and non-disparate predictions than the humans are capable of, while the gender-specifically trained models produced a higher MSG as compared to the humans, meaning that unbalanced training data in the generation of algorithmic models, only widens the existing gender gaps. The study conducted under the EO analysis indicates that mixed-gender trained models helped to produce a better outcome than gender-specific training. Altogether, the research leads to the conclusion that gender-sparse data do not produce scoring prejudice in the sexbased sense but contribute to the expansion of gender gaps as well as diminished scoring equity.

## 1 Introduction

Recent AI advancements have reached the core of human existence indicators, disturbing practices, and industries. However, that is possible only in theory because when using people to perform the job of AI, they will bring inbuilt biases, especially gender biases, which are always a sure recipe for disaster. Such biases are extended in universally proper word embeddings, and supervised machine learning categorizations are emphasized (Bolukbasi, Chang, Zou, Saligrama, &amp; Kalai, 2016; Hall &amp; Ellis, 2023). Discrimination against women in AI automatic scoring systems automatically prop up socio-cultural prejudices and inequalities (Zhai &amp; Nehm, 2023). Consequently, Cirillo et al. (2020); Leavy (2018); Nadeem, Abedin, and Marjanovic (2020) have illustrated how diversity affects machine learning decisions out loud these questions of bias.

However, this belief can also create high social costs when bias is inflated, especially pseudo-AI biases that widen the gap between the technology-disadvantaged groups, which include females. Some of the potential threats that may be found in the new generation of AI include pseudo-AI bias, which is already a known term defined as a false assumption of AI bias (Zhai &amp; Krajcik, 2022). For instance, if the AI scoring leads in the way that particular differences between male and female students are found, but these differences are not systematic. Such a result will not be a bias but rather a mistake. People often explain such an error as 'bias' that originates from AI, which is one of the manifestations of pseudo-AI bias. Vague assertions that there is a pseudo-AI bias can also amplify an unjustified fear about AI. Therefore, detecting AI gender bias is crucial to avoid the confusion of pseudo-AI bias with genuine AI bias.

This research work is beneficial in providing a certain kind of value to the existing literature that discusses gender bias with AI, as lots of work within this area of study has recently been pointed out to lack adequate data. As equally relevant to bureaucratic enhancement as not removing gender discrimination from technology, Franzoni (2023) notes that innovation continues in gender discrimination in the promotions of the police force. Still, Franzoni scarcely discussed the socio-cultural bias of AI and its potential consequences, thus not having a principal emphasis on the technical side. From this view, a detailed iterative literature review of socio-technical gender bias in AI algorithms, as composed by Hall and Ellis (2023), contributes to that activity to point out the fact that when a given individual does not have a sure other form of bias that is not current in the AI, he or she can end up affected a lot by that bias and vice versa; thus, it requires a realistic and tangible means of finding that bias even though their work has no empirical context in terms of comparing specific ML models or datasets for training those models, analysis of the bias was conducted and, therefore, the existing literature informed theoretical framework of the study. Furthermore, Lima, Pisker, and Corrˆ ea (2023) state that the current AI systems are gender biased, working sensitively to gender approaches, mentioned that they need to be further polished, and strategies need to be debated about how to train an AI. However, they did

not discuss such an important question: what if the data sets used are imbalanced, and this AI reflects such imbalances? To the above question, this research fills the gap through the survey method combined with Econometric analysis.

This study also satisfies the following goals independently: analyzing gender bias through extensive studies and modified algorithms. Li, Xing, and Leite (2022), in their study, did not expound on fair AI in outcome predictions, as pointed out above, nor did they use mixed gender in moderation of bias. Therefore, Lu, Mardziel, Wu, Amancharla, and Datta (2020) offer insights into where the bias may stem from and what may be done to remove or mitigate it; however, they fail to explore the impact of training using mixed and gender-discriminating data sets. Briefly, Sun et al. (2019) outlined the strategies used in the literature to mitigate gender bias in natural language processing and the approaches to tackle it while avoiding datasets with both genders. This paper aims to investigate the origins of the emerging gender bias that is forecasted through the utilization of artificial intelligence and the relationship that it might have with biased training sets.

As the Ethical Evaluation Framework provided by Slimi (2023) and the Advantages listed by O'Connor and Liu (2023) indicate, this paper deals with the ethical issue of fairness and equity in AI systems. Such is the case in Slimi (2023). From this analysis, it can be concluded that natural AI systems that reflect the current bias are inadequate. There is a need to design systems that do not reflect the current bias, primarily when AI technology will be used in learning sectors that support equality. On the same note, O'Connor and Liu (2023) analyzes the reinforcement and reduction of gender bias in AI technologies, barriers, and possibilities, which offer insights on increasing chances of creating AI with less bias. Their work implies the complexity of eradicating sexist AI by giving a clear account of the process that underpins the creation of non-sexist training data, which is highly technical and socially layered. However, there is scarce knowledge on how to increase fairness measures and prevent bias from using training data containing skewed gender data.

This research contributes to the field by providing empirical evidence that targeted mix-gender model training can reduce gender bias. Lima et al. (2023) offer a guide to the emancipative design of AI in education and other arenas. This work contributes to filling the identified gap in the literature by concentrating on how the training data affects bias. Manresa-Yee and Ramis (2021)) discuss the application of explainable AI in evaluating gender bias in AI models and the significance of the approaches in reducing bias. Nemani, Joel, Vijay, and Liza (2023) undertook research focusing on distinguishing various techniques concerning bias and the capacity of transformer models to handle the bias. While the data collected from their survey is advantageous in today's Gender bias literature, similar to the previous surveys, the authors' new assertion lacks empirical evidence that compares mixed-gender versus gender-specific training data. This study builds on their work to systematically test in an empirical study how changes in the structure of the training data utilized by the machine learning algorithms under investigation influence gender bias, disparity, and fairness in the final scores allocated by AI.

To address the research gaps in previously discussed studies, we extend the work reported by Slimi (2023) and O'Connor and Liu (2023) by exploring the applicability of the proposed mixed-gender data approach in the male and female training data samples. In addition, this study aligns with the elements of ethics highlighted by Manresa-Yee and Ramis (2021) and Nemani et al. (2023) to ensure gender bias issues are addressed using a more complex approach. By extension, this means that while mixed-gender training data do not create scoring bias, they greatly assist in the elimination of gender bias and the enhancement of the anti-bias quotient of AI measures, hence aiding in the fabrication of ethical AI systems that are for the welfare of society.

As for broader patterns, one has to refer to how fine-tuned versions of BERT and GPT-3.5 affect the dissemination of information from broad perspectives. The study describes how bias, unfair treatment, and inconsistent scoring by the machine may be detected by comparing the student responses graded by the human experts. The study also addresses the gaps in the literature by assessing the mixed-trained model relative to gender-separate trained models. It demonstrates that mixed-trained models have an advantage in attaining a reduced mean score gap and generating more equal results. The study suggests that while training the AI model on biased data does not result in the creation of bias, the performance improves gender characteristics to influence fairness, an area of study many previous studies failed to explore. This work focuses on addressing the following research questions:

1. How do gender-unbalanced training samples contribute to gender bias in automatic scoring?
2. How do gender-unbalanced training samples affect AI scoring disparity by gender?
3. How do gender-unbalanced training samples contribute to AI gender fairness for automatic scoring?

## 2 Background

## 2.1 Automatic Scoring in Education

Today's classroom assessments are not like those of the past because of the availability of AI. As Gonz´ alez-Calatayud, Prendes-Espinosa, and Roig-Vila (2021) have revealed in their recent comprehensive and highly detailed systematic review of the studies concerning the use of AI in developing student assessments, some methodologies have been employed and for which the countries of origin reported information concerning their impact. Zhai (2021) are the authors of an article discussing the state of the art of and practice regarding AI-based assessments in science concerning the development of their latest work where they present their findings. It reveals that many kinds of AI, such as machine learning and natural language processing, have been justified in that they can correctly assess the students' answers in all subjects.

Nevertheless, the formation of automatic scoring is not an easy task. Zhai, He, and Krajcik (2022) build a study on applying machine learning for science assessments, which helps to understand how hard it is to assess student models correctly. Automatic scoring requires accuracy; therefore, the measures include agreed scores between the machines and humans. Zhai, Shi, and Nehm (2021) recently published a

meta-analysis of machine learning-based science assessments, and the results showed partial consistency in human-machine agreement. It also expands on why agreements between machine and human scores are low. Their conclusions suggest that while, in some ways, AI can achieve a level of similarity to the humanly scored version, there are nonetheless disparities because of intra (such construct as construct complexity) and extra AI (such as algorithms) factors to their automatic assessments. It is still necessary to address the task or permanently update the assessment of individual algorithm parameters within educational environments.

Advancements in AI have not only made the automatic scoring process fast but also made it personalized and adaptive to enhance the student learning experience (Lee, Latif, Wu, Liu, &amp; Zhai, 2023; Zhai, Yin, Pellegrino, Haudek, &amp; Shi, 2020). Researchers have used these models in automatically grading science writing (Latif et al., 2023; Lee, Shi, et al., 2023). This study focuses on the AI bias for automatic scoring of written responses of different genders; hence, all the defined terminologies revolve around the deviation of automatic scoring to analyze AI bias. Studies also highlight the ethical concerns of the multifaceted implementation of AI in education and suggest keeping the social and moral values along with technological advancements (Berendt, Littlejohn, &amp; Blakemore, 2020). Felix (2020) and Qadir (2023) share their perspectives on the fitness of AI in education, with changing applications of AI from fortifying teaching methodologies to assisting administrative work. This study addresses these ethical concerns by evaluating the impact of mixed dataset (containing responses from both genders of students) training of machine learning models for automatic scoring on AI bias.

## 2.2 AI Gender Bias, Disparities, and Fairness

Gender bias, disparities, and fairness - in AI, particularly educationally, as we find ourselves - are topics that remain surrounded by half-truths and facts. Subsequently, we define bias for AI systematically like Larrazabal, Nieto, Peterson, Milone, and Ferrante (2020) since bias entails systematic rather than random error in which we study the calculated error in the scoring accuracy in the trained model of AI. For instance, if the machines award one gender a better score than the other, this can trigger debates on AI partiality to the said gender. Gender disparities in AI are defined as mean scoring gaps in automatically predicted machine scores for responses written by students of different genders; this conceptualization is based on the for Economic Co-operation and (OECD) (2018) definition. For instance, high variability of average scores between genders can increase gender inequality in AI applications.

Moreover, AI fairness as equity (Holstein &amp; Doroudi, 2019) is also discussed; in other words, if the normalized gender responses received scores close to one another by machines, then this represents equity in AI. The AI model is hypothesized to be biasfree if the ratio of False Positive to True Positive of automatically generated scores for the responses written by different genders is equal. This section aims to flesh out these aspects to gain a better knowledge and perception of how and to what extent gender issues are present in AI systems.

Lack of context, lack of related knowledge, and jumping to the wrong conclusions are invariably present at the heart of most misconceptions regarding the gender bias of

AI. One such myth is that AI is not biased since it uses Algorithms and Data. However, as stated in Bolukbasi et al. (2016) and Hardt, Price, and Srebro (2016), biases are not only in the training data used in the designing of the algorithms but also in its operations; they may appear to form words or phrases that are neutral with regards to gender. The next myth is that the issue of gender AI bias is the problem at the technical level only. To solve these problems, it is necessary to collect more data and at least create better algorithms. These are basic ingredients that contribute towards the success of any AI solution, as noted by Lu et al. (2020) as well as Manresa-Yee and Ramis (2021). Nevertheless, comparatively, eradicating gender stereotypes in AI entails enhanced recognition of sociological structures and civilizational norms.

Bias in AI based on gender is not straightforward and has deep layers that mix quantitative-technical and qualitative-social. One type of bias is pseudo-AI Bias, which is in accordance with socially constructed and imposed stereotypes (Zhai &amp; Krajcik, 2022). Bias manifests itself in many forms, including skewed views on datasets or bias in the interpretation of results generated by AI systems. This bias is evident within educational situations where the result of an action reflects the performance. It means unequal evaluation, continued perpetration of gender roles, and prescription that keep women off educational attainment. Madaio, Blodgett, Mayfield, and Dixon-Rom´ an (2022) review the structural bias that could be involved when using AI solutions in learning environments. Lacking precision, scholars will have to develop more elaborate concepts that capture these biases and will have to call for more sophisticated ways of studying them.

The plain truth is that, in education, as in many other areas of life, dispelling myths about gender bias in artificial intelligence, on top of simply being informed about the issue, can go a long way toward building better, fairer systems for all learners. Gendered AI must involve synergy and controversy in ideas of gender studies, practitioners, and theorists in ethical AI and educational theory to ensure that our applications are not just making current dignities inequitable. To tackle AI gender discrimination in education, myths should be disregarded, and the reality is that the actual existence of biases and their emergence is more nuanced within and as a result of the systems of AI. Therefore, such an understanding is necessary to develop AI applications that would be both equitable and efficient in various learning environments.

## 2.2.1 This Study's Approach to Bias, Disparities, and Fairness Analysis

This study employs a rigorous methodology to analyze gender issues in automatic scoring. We have fine-tuned the base variant of the BERT model (similar to Liu, He, Liu, Liu, and Zhai (2023)) and GPT-3.5-turbo (identical to Latif and Zhai (2024), using more than 6000 human experts' rated student responses, proportionally distributed among male, female, and mixed datasets across six assessment items. Specific details about the dataset and fine-tuning process are presented in Section 3. This study measures AI gender bias by paired t-test of scoring accuracy between different genderspecifically trained models (Mowery, 2011); the gender disparities by mean score gaps by gender (Wang &amp; Brown, 2007; Wilson et al., 2023); and fairness by Equalized Odds

(Hardt et al., 2016). These methods comprehensively show how gender issues manifest in AI scoring systems for mixed and separately trained models.

Therefore, the concept of the investigation is based on the hypothesis that gender bias in automatic scoring across mixed male and female responses is not apparent when the AI models were trained from mixed-gender datasets. At its center is the idea that it is possible for the discriminative model approaches to learn more genderneutral patterns with a diverse training set due to the removal of bias from unbalanced datasets. Pertinent to this analysis is its focus on explaining AI and gender issues in a simple manner. Employing a rationale of empirical evidence, the study asserts that when it comes to gender, AI is not averse to running into difficulty but is not necessarily hard-coded. All of them may be solved with proper reasoning and methods during training sessions. The hypothesis rejects the belief that all AI systems are biased or that unbiased AI is too hard to develop.

These results are valuable and relevant for AI advancement in school settings. In conclusion, the authors state that training data must be considered and that applying the right analysis method can lead to more equitable solutions. The conclusions are agnostic to the larger discussion regarding the integration of ethics into the advancement of artificial intelligence theories, stating that all of the theories should serve to teach AIs.

To sum up, this study contributes to the growing literature on gender bias in AI by providing an appropriate course of training and further analysis with improved efficiency. It also brings empirical evidence and conceptual ground, thus opening the path to the possession of apt technical knowledge and thorough moral responsibility to develop decent AI systems devoid of many wrong beliefs.

## 3 Methodology

This study investigates gender issues in AI-based scoring systems based on stateof-the-art large language models like BERT and GPT-3.5-turbo models. We have fine-tuned the BERT model on the students' written responses in such a way that the BERT model acts as a multi-class classifier. The human-rated dataset is fed into the BERT model by employing a 3-fold validation mechanism to validate the model's accuracy. Each fold is split into 8:2 for training and validation, and finally, the accumulated accuracy of each fold is reported. Fine-tuning the GPT-3.5-turbo model is a more sophisticated method in which we first process the dataset to clean the data from gibberish letters and extract tokens for model evaluation. GP-3.5-turbo model is initialized by setting ReLU (a regression-based loss function for multi-class classification), setting a small learning rate for better accuracy, and optimal batch size to optimize the fine-tuning process for appropriate epochs. Both models are evaluated on the same matrices consisting of mean absolute error, precision, and accuracy. Large Language models tend to revolutionize education technology (Latif et al., 2023) and raise potential challenges, such as bias, disparity, and fairness, which must be addressed. A comprehensive methodology was adopted, comprising different training and testing phases for models and employing various statistical techniques to evaluate

Fig. 1 Overview of AI gender bias analysis for automatic scoring.

<!-- image -->

gender bias, disparities, and fairness. The paired t-test with a p-value &gt; 0.05 on accuracy between machine scores of different genders is used to determine the statistical insignificance and non-biased nature of automatic scoring. The mean score gap with the threshold set to 0.2 determines prediction disparities. Finally, equalized odds are calculated to check fairness in the automatic scoring of written responses by different genders. The threshold for each analysis is extracted by setting parameters for a balanced dataset and scoring accuracy &gt; 80%. Fig. 1 provides a comprehensive overview of the research design and evaluation mechanism.

## 3.1 Dataset

The study utilized a meticulously categorized dataset of student-written responses to six assessment items, each classified under the multi-class category. The datasets were categorized based on reported gender (i.e., male and female; we eliminated the data that did not report gender information), and a mixed dataset incorporated responses from both genders. The dataset was collected from the Mathematical Thinking in Science (MTS) project (ETS-MTS, November, 2023; Jin et al., 2019). Based on the availability of data, we used the maximum of available data while maintaining the ratio between training and testing data for each item by gender. Consequently, we randomly identified three training datasets for each item: mixed, male, and female training datasets and three testing datasets for each item. The detailed composition of each assessment item's dataset is presented in Table 1. This comprehensive dataset facilitated a nuanced analysis of gender bias in AI-based scoring systems, ensuring robust and broadly applicable study findings.

## 3.1.1 Dataset Description:

In the multi-class assessment activities, students must use mathematical reasoning (such as proportional reasoning) and scientific knowledge to answer science problems (Jin et al., 2019). The purpose of the tasks is to evaluate the mathematical reasoning in science and the process by which students learn it as they advance through science courses in high school. The high school-level tasks focus on two NGSS disciplinary fundamental ideas: PS3 (Energy) and LS2 (Ecosystems: Interactions, Energy, and Dynamics). Almost 6000 students in grades 9 through 12 participated in the study.

Table 1 Summary of Datasets and Their Samples

| Datasets               |   mixed Training samples |   mixed Testing samples |   Male Training samples |   Male Testing samples |   Female Training samples |   Female Testing samples |
|------------------------|--------------------------|-------------------------|-------------------------|------------------------|---------------------------|--------------------------|
| falling weights        |                     1148 |                     230 |                     342 |                     87 |                       478 |                      120 |
| gelatin                |                      918 |                     230 |                     344 |                     86 |                       477 |                      120 |
| bathtub                |                      916 |                     230 |                     364 |                     92 |                       450 |                      113 |
| sandwater1             |                      915 |                     229 |                     364 |                     92 |                       450 |                      113 |
| sandwater2             |                      913 |                     229 |                     364 |                     92 |                       449 |                      113 |
| two boiling situations |                      909 |                     228 |                     363 |                     91 |                       448 |                      113 |

Eight educators scored the students' answers using the respective scoring rubrics. To respond to these tasks, students should consider the three key concepts: 1) The two variables that are dependent on the amount of material (mass, M), heat (Q), and temperature (T). Heat is an extensive variable, whereas temperature is an intense variable independent of the amount of substance. 2) Specific heat as a compound is needed to increase a substance's temperature by one degree Celsius per unit of mass. 3) T depends on M and C for an identical quantity of Q: The intake and outflow of heat will change a substance's temperature.

Fig. 2 presents an example of multi-class tasks that illustrate a situation where a paddle wheel is driven by a falling weight to agitate the water. Students must predict whether the water will warm up and provide a justification in writing. As a result of the paddle stirring the water due to falling weight, students must determine the heat change in the water in this example problem. A four-level rubric was created to evaluate students' knowledge usage proficiency in answering the example item. Human experts from ETS have graded the student responses based on the rubric. Specific details for each level are listed in Table 2.

## 3.2 Experimental Setup

The experimental setup involved rigorous training and testing using multiple training and testing datasets.

Training Phase: Each dataset undergoes a unique training cycle:

- A mixed-trained model trained with the mixed training dataset including both genders.
- A female-trained model trained solely with data from females.
- A male-trained model trained exclusively with data from males.

Using this approach, we developed three distinct language models for each assessment item, fine-tuned using both BERT and GPT-3.5, respectively.

Testing Phase: Every trained model goes through several testing stages to determine possible bias. Specifically, In the first experiment, the model trained on the mixed dataset was compared to the mixed testing data as well as separately for the

## Item ID: CHII\_FallingWeight

<!-- image -->

- 1 The falling weight causes the paddle to stir the water. Do you think that will warm the water? Choose one option.
- A Yes
- B. No
- C Not enough information is provided.
- 2 Please your answer. explain

Fig. 2 Example Multi-class Task: Falling weights

male and female testing data. We trained and utilized both BERT and GPT-3.5. In the second experiment, Gender-specific models were used to test against the same and the counterpart's gender datasets. Likewise, we employed BERT and GPT-3.5. This experimental design was intended to systematically evaluate any possible prejudices in the models' decision-making based on datasets and gender splits.

## 3.3 Accuracy Difference (Pair t-Test)

Paired t-tests were employed to analyze the difference in accuracy between trained models of related. Mowery (2011) noted that the paired t-test is useful in establishing the differences in pairs of observations. In our work, it was imperative to compare the accuracies of models that were trained using different datasets.

Table 2 Scoring rubric for task: Falling weights

| Level   | Description                                                                                                                                                                                                                                                                                                          | Example                                                                                                                                                                                                                                                         |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 3       | A Level 3 response suggests that the stu- dent understands the measurability of vari- ables. Level 3 responses must choose A. There are two patterns at Level 3:                                                                                                                                                     | Example 1: A [Yes.] Because the weight will stir the water, the movement in water particles will cause the temperature to rise.                                                                                                                                 |
|         | 3a: [Identification of heat/energy] The response 1) associates movement (e.g., movement of the weight, paddle, and/or water) with energy/heat AND/OR2) asso- ciates particle movement with tempera- ture, heat, or energy.                                                                                           | Example 2: A. [Yes.] The falling weight transfers its energy to the paddles that spin. The spinning paddles transfer their energy to the water. Because water (the system) absorbs energy, the temperature of the water will increase even if it is very small. |
|         | 3b: [Identification of heat/energy with errors.] The response 1) associates move- ment (weight, paddle, and/or water) with energy or heat AND/OR 2) associates par- ticle movement with temperature, heat, or energy. But, the response also confuses energy/heat/temperature with other vari- ables such as forces. | Example 3: A. [Yes.] The weight falling will cause the paddle to start moving, which turns gravity into kinetic energy, and the kinetic energy is then transferred to the water and moves the water's molecules, which would then start heating the water.      |
| 2       | A Level 2 response:                                                                                                                                                                                                                                                                                                  | Example 1: C [Not enough information is provided.] It depends on how fast the pad- dles are turning. If they are turning fast enough, they could warm the water.                                                                                                |
|         | 2a : [Threshold] The response indicates a threshold where the movement must be fast to a certain degree or the energy input must be large enough to cause an increase in temperature.                                                                                                                                | Example 2: B. [No.] Stirring the water will not increase the temperature of the water because no energy is being added.                                                                                                                                         |
|         | 2b: [General understanding] The response indicates that the student generally under- stands that work/energy will cause the temperature to increase but cannot apply that general understanding to this specific scenario.                                                                                           | Example 3. C. [Not enough information is provided.] there is not enough information to explain more about the temperature; just will it spin, and yes, it will spin pretty fast.                                                                                |
|         | 2c: [Macroscopic causation] The response provides a causal relationship at a macro- scopic scale without using energy or heat. 2d: [Irrelevant variables ONLY] The response analyzes the scenario based on                                                                                                           | Example 4: B. [No.] We don't know if the water is warm or cold already, room tem- perature, etc. Example 5: A. [Yes] Due to the friction between the paddle and the water, the                                                                                  |
| 1       | irrelevant variables. Level 1 responses have the following pat- terns: 1a: [IDK] 'I don't know' type of response. 1b: [No information] The response does not provide information about the stu- dent's ideas about the phenomenon or                                                                                 | water will get warmer after some time. Example 1: A. [Yes.] It's placed in an insu- lated container, and it has a thermometer.                                                                                                                                  |
| 0       | Blank or random letters                                                                                                                                                                                                                                                                                              | Acareba artouth                                                                                                                                                                                                                                                 |

Mathematically, the paired t-test is expressed as:

<!-- formula-not-decoded -->

where D is the mean of the differences between paired observations, s D is the standard deviation of the differences, and n is the number of pairs. A p-value greater than 0.05 indicated no significant difference in accuracies between the models, suggesting minimal gender bias.

## 3.4 Mean Score Gap

Mean Score Gap (MSG) was utilized to evaluate the disparity in scores between different genders. MSG can be generated either by human experts or machine algorithmic models. Given that human-assigned scores have undergone rigorous scrutiny, we used MSG generated by human-assigned scores as the golden standard to evaluate machine-generated MSG. It can be seen that if machine-generated MSG is larger than human-generated MSG for the same testing data, the machine exacerbates the gender difference and may potentially create inequity. Wang and Brown (2007) and Wilson et al. (2023) highlighted the importance of such comparisons in their study on automated essay scoring and automatic scoring of written scientific arguments. MSG for target dataset K is calculated as:

<!-- formula-not-decoded -->

where score k,i is the score assigned to the i th response by models trained on dataset K ; where K = { K male , K female , K mix } , and n , m are total number of male and female responses in testing data. A threshold of MSG &lt; 0.2 was used to indicate acceptable score disparity.

## 3.5 Equalized Odds

Equalized Odds, as defined by Hardt et al. Hardt et al. (2016), involves assessing the equality of true and false positive rates across groups. It is a crucial measure of fairness in predictive models. The Equalized Odds (EO) criterion is given by:

<!-- formula-not-decoded -->

where TPR male and TPR female are the true positive rates for Male and Female, respectively, and FPR male and FPR female are the false positive rates for the two genders. An EO value less than 0.01 indicates a fair model with minimal gender bias.

These three methods - Paired t-test, MSG, and Equalized Odds - provide a comprehensive approach to evaluating gender bias, disparities, and fairness in AI-based scoring systems, ensuring the ethical uses of AI models. The methodology encompassed a detailed experimental setup with rigorous training and testing phases, coupled with statistical analyses to comprehensively assess gender issues in AI-based scoring systems.

## 4 Results

## 4.1 Scoring Accuracy Difference Evaluation

A paired samples t-test was performed to evaluate whether there was a statistical difference between the scoring accuracy for male and female predicted scores before and after randomly mixing both genders' responses.

A repeated measures ANOVA was conducted to compare the scoring accuracy of mixed testing data from the mixed-trained BERT model and GPT-3.5 model with their respective male-trained and female-trained counterparts.

For the BERT model, the analysis revealed that the scoring accuracy of mixed testing data from the mixed-trained model (∆ M = 0 . 022, SD = 0 . 022) was not significantly higher than that of the male-trained model (∆ M = 0 . 020, SD = 0 . 080), t (6) = -0 . 86, p = . 42. Similarly, no significant difference was observed between the mixed-trained model and the female-trained model (∆ M = 0 . 030, SD = 0 . 069), t (6) = -1 . 37, p = . 22.

For the GPT-3.5 model, the scoring accuracy of mixed testing data from the mixedtrained model (∆ M = 0 . 023, SD = 0 . 090) was also not significantly higher than that of the male-trained model (∆ M = 0 . 016, SD = 0 . 110), t (6) = -0 . 42, p = . 53, or the female-trained model (∆ M = 0 . 018, SD = 0 . 010), t (6) = -0 . 42, p = . 69.

Both the BERT and GPT-3.5 models demonstrated consistent performance across mixed and gender-specific datasets, suggesting minimal gender biases.

Fig. 3 Mean score gaps between male and female testing data: Comparing human-graded scores and fine-tuned LLMs' scores: Mixed training Model (Left) , Male trained Model (Center) , and Female trained Model (Right) comparison line plots of BERT (Top) and GPT3.5 (Bottom) fine-tuned models's scores. The shaded region in each plot signifies the ∆ MSG .

<!-- image -->

## 4.2 Mean Score Gap

To verify our assumption, we designed three experiments to compare the difference of MSGs (∆ MSG ) between human- and machine-graded scores. For each experiment, we

tested the three models: Mixed-, male-, and female-trained models and compared each of them with human-generated MSG on combined male and female testing samples.

A repeated measures ANOVA was conducted to analyze the ∆ MSG between human and mixed-trained machine-graded scores for BERT and GPT-3.5 models. This was to validate the hypothesis that mixed-gender training data would have the least impact on the MSG. Human scores, used as the golden standard, yielded an average MSG of M Human = -0 . 0957, SD Human = 0 . 0746.

In the first experiemnt, upon training the mixed-gender model, the BERT model produced an average MSG of M Mix-BERT = -0 . 1078, SD Mix-BERT = 0 . 0742, with a difference of ∆ MSG Mix-BERT = 0 . 0122 compare to M Human . Similarly, the GPT-3.5 model yielded an average MSG of M Mix-GPT = -0 . 1150, SD Mix-GPT = 0 . 0724, with the MSG difference of ∆ MSG Mix-GPT = 0 . 0193 compare to M Human . However, these differences were not statistically significant for both BERT and GPT mixed models with values ( t Mix-BERT = -1 . 5598, p &gt; 0 . 05) and ( t Mix-GPT = -1 . 8896, p &gt; 0 . 05), respectively.

In the second experiment, for the gender-specific models, the BERT model demonstrated a decrease in the average MSGs compared to human scores: M Male, BERT = -0 . 0742, SD Male, BERT = 0 . 0871, and M Female, BERT = -0 . 0603, SD Female, BERT = 0 . 0564. The MSG differences were ∆ MSG Male, BERT = -0 . 0337 and ∆ MSG Female, BERT = -0 . 0138. Both male and female BERT models have shown a reduction in visible MSG in their correlations ∆ MSG compared to human MSG and have a statistically significant difference ( t Male, BERT = -3 . 0857, p &lt; 0 . 05) and ( t Female, BERT = -3 . 6226, p &lt; 0 . 05).

Similarly, for the GPT-3.5 model, both gender-specific models demonstrated a lower average MSG ( M Male, GPT = -0 . 1212, SD Male, GPT = 0 . 0769) compared to the female-specific model ( M Female, GPT = -0 . 0808, SD Female, GPT = 0 . 0815). The MSG differences were ∆ MSG Male, GPT = 0 . 0062 and ∆ MSG Female, GPT = -0 . 043, with visible statistically significant differences ( t Male, GPT = -3 . 8574, p &lt; 0 . 05) and ( t Female, GPT = -3 . 4283, p &lt; 0 . 05). (Detailed results can be seen in Fig. 3).

These results indicate that training with a mixed dataset in both BERT and GPT3.5 models has shown a minimal MSG compared to gender-specific training. This outcome validates our hypothesis that a balanced mixed training dataset has no significant traces toward gender disparities, as reflected in the similar MSGs in the mixed models compare to human MSG. On the other hand, gender specific models has shown siginifacant tilt toward gender disparities. The findings underscore the importance of inclusive training datasets in developing AI models that yield more equitable scoring outcomes.

## 4.3 Equalized Odds Evaluation

The study evaluated the Equalized Odds (EO) (Hardt et al., 2016) for BERT and GPT-3.5 models to assess fairness in gender predictions.

The BERT model demonstrated an EO of 0.042 on the mixed testing dataset for the mixed-trained model, indicating a lower disparity in prediction fairness. In contrast, the gender-specifically-trained models exhibited higher EO values on the mixed testing dataset, with the Male model showing an EO of 0.107 and the Female model having

an EO of 0.074. These results suggest that the mixed-trained model is more equitable in its predictions across genders than gender-specific models.

For the GPT-3.5 model, the mixed-trained model's EO was 0.061 on the mixed testing dataset, again reflecting a reduced gradient and, thus, greater fairness in predictions. The Male and Female trained models showed EOs on the same testing dataset of 0.076 and 0.074, respectively. While these values are closer to that of the mixed model than the BERT model, they indicate a higher disparity in the gender-specific models.

The mixed-trained models for both BERT and GPT-3.5 have lower EO values, suggesting more equitable predictions and higher fairness than gender-specific models. This outcome supports the hypothesis that training with a balanced dataset can reduce the EO gradient, contributing to the development of fair AI models.

## 5 Discussion

The intelligent computational analysis plays a role when it comes to evaluating the student's performance and defining existing learning capacity. Considering a great deal of data, AI systems may show the teachers information and the potentiality of how the students use them, thus giving them a better perspective of decision-making and enclosing better strategies. Analyzing the impact of gender bias, disparities, and fairness when it comes to the various aspects of the automatic scoring issues and the gender biases of the data sets that have been used, the presented research framework incorporates an experimental method. In a study where we evaluated the efficacy of gender-unbalanced training datasets in the elimination of gender bias in the scored AI system, it was established to be useful. Combined with this, it also introduced facts that endeavored to provide real evidence of sources in excluding the prejudice that AI only escalates sexism (Bolukbasi et al., 2016; Lu et al., 2020).

On the contrary, this study found that algorithms for imbalanced data may further reinforce gender-based bias instead of addressing this issue. In this study, the balanced mixed training model did not exhibit gender-biased behaviors, so this study offered an opportunity to address such baseless claims about the prejudice of AI systems. To avoid acting as the malevolent agent that deepens the impression of gender-predetermined roles and functions that are assigned to women, non-transphobic gender minorities' representations in the data that feeds models must be addressed.

As for the concept of balanced training for female and male models, the results obtained based on the proposed mixture training are provided by the various minimized EO gradients and decreased MSG in the mixture-trained models. This discovery is crucial given that Hardt et al. (2016). The authors have further affirmed the role of opportunity equality in supervised learning. Based on the findings of our study, it can be concluded that mixed training datasets with all the data split in fifty-fifty could enhance the fairness of the AI-based tests and assessment in the learning context where the fairness of the AI is paramount (Li et al., 2022). This discovery establishes the relevance and fairness of AI functions in higher learning. It falls in line with the fundamental postulations presented by Slimi (2023) with regard to the use of AI.

Our findings align with the literature supporting debiasing AI systems (ManresaYee &amp; Ramis, 2021; Nadeem, Marjanovic, Abedin, et al., 2022). This work shows that balanced training produces more equitable AI outcomes, which advances the more significant attempts to develop impartial and fair AI models. The method offers a workable answer to this widespread problem by refuting that AI systems are bound to reproduce societal prejudices. The study's findings strongly support the gender issue of balanced mixed training in AI for automated scoring. In addition to addressing the pressing issues of equality and fairness in AI-based scoring systems, our method offers proof against mechanical pseudo-bias in general AI applications.

## 6 Conclusion

The analysis using BERT and GPT-3.5 on student written responses has significantly advanced our understanding of gender bias, disparities, and fairness in AI-based scoring systems. The paper also shows the concerns of gender imbalance training, which has nearly no gender bias. In this regard, the results are, in a way, opposite to what one would expect given the current discourses about the biases that AI may inherently possess. This meant that the models trained in mixed genders, rather than in the single-gender data set, had a lower MSG than humans; it was argued that algorithms trained in the imbalanced gender data set could help expand gender bias. It was seen from the analysis employing EO that gender intermixed underwent far less bias than gender-exclusive models. The research findings reveal that gender-sparse data does not per se lead to scoring bias but amplifies gender inequalities and overall scoring equity.

## Acknowledgment

This study secondary analyzed data from a project supported by the Institute of Education Sciences (grant number R305A160219). The authors acknowledge the funding agencies and the project teams for making the data available for analysis. Project is partially supported by NSF (grants numbers 2101104). The findings, conclusions, or opinions herein represent the views of the authors and do not necessarily represent the views of personnel affiliated with the funding agencies.

## References

Berendt, B., Littlejohn, A., Blakemore, M. (2020). Ai in education: Learner choice and fundamental rights. Learning, Media and Technology , 45 (3), 312-324,

Bolukbasi, T., Chang, K.-W., Zou, J.Y., Saligrama, V., Kalai, A.T. (2016). Man is to computer programmer as woman is to homemaker? debiasing word embeddings. Advances in neural information processing systems , 29 , ,

Cirillo, D., Catuara-Solarz, S., Morey, C., Guney, E., Subirats, L., Mellino, S., . . . others (2020). Sex and gender differences and biases in artificial intelligence for biomedicine and healthcare. NPJ digital medicine , 3 (1), 81,

ETS-MTS, T. (November, 2023). Learning progression-based and ngss-aligned formative assessment for using mathematical thinking in science. http://etscls.org/mts/index.php/assessment/ , ,

Felix, C.V. (2020). The role of the teacher and ai in education. International perspectives on the role of technology in humanizing higher education (pp. 33-48). Emerald Publishing Limited.

for Economic Co-operation, O., &amp; (OECD), D. (2018). Bridging the digital gender divide: Include, upskill, innovate. OECD , ,

Franzoni, V. (2023). Gender differences and bias in artificial intelligence. Gender in ai and robotics: The gender challenges from an interdisciplinary perspective (pp. 27-43). Springer.

Gonz´ alez-Calatayud, V., Prendes-Espinosa, P., Roig-Vila, R. (2021). Artificial intelligence for student assessment: A systematic review. Applied Sciences , 11 (12), 5467,

Hall, P., &amp; Ellis, D. (2023). A systematic review of socio-technical gender bias in ai algorithms. Online Information Review , ,

Hardt, M., Price, E., Srebro, N. (2016). Equality of opportunity in supervised learning. Advances in neural information processing systems , 29 , ,

Holstein, K., &amp; Doroudi, S. (2019). Fairness and equity in learning analytics systems (fairlak). Companion proceedings of the ninth international learning analytics &amp; knowledge conference (lak 2019) (pp. 1-2).

Jin, H., van Rijn, P., Moore, J.C., Bauer, M.I., Pressler, Y., Yestness, N. (2019). A validation framework for science learning progression research. International Journal of Science Education , 41 (10), 1324-1346,

Larrazabal, A.J., Nieto, N., Peterson, V., Milone, D.H., Ferrante, E. (2020). Gender imbalance in medical imaging datasets produces biased classifiers for computeraided diagnosis. Proceedings of the National Academy of Sciences , 117 (23),

Latif, E., Mai, G., Nyaaba, M., Wu, X., Liu, N., Lu, G., . . . Zhai, X. (2023). Artificial general intelligence (agi) for education. arXiv preprint arXiv:2304.12479 , ,

Latif, E., &amp; Zhai, X. (2024). Fine-tuning chatgpt for automatic scoring. Computers and Education: Artificial Intelligence , 100210,

- Leavy, S. (2018). Gender bias in artificial intelligence: The need for diversity and gender theory in machine learning. Proceedings of the 1st international workshop on gender equality in software engineering (pp. 14-16).
- Lee, G.-G., Latif, E., Wu, X., Liu, N., Zhai, X. (2023). Applying large language models and chain-of-thought for automatic scoring. arXiv preprint arXiv:2312.03748 , ,

Lee, G.-G., Shi, L., Latif, E., Gao, Y., Bewersdorf, A., Nyaaba, M., . . . others (2023). Multimodality of ai for education: Towards artificial general intelligence. arXiv preprint arXiv:2312.06037 , ,

- Li, C., Xing, W., Leite, W. (2022). Using fair ai to predict students' math learning outcomes in an online platform. Interactive Learning Environments , 1-20,

Lima, R.M.d., Pisker, B., Corrˆ ea, V.S. (2023). Gender bias in artificial intelligence. Journal of Telecommunications and the Digital Economy , 11 (2), 8-30,

Liu, Z., He, X., Liu, L., Liu, T., Zhai, X. (2023). Context matters: A strategy to pre-train language model for science education [Book Section]. In N. Wang &amp; e. al. (Eds.), Ai in education 2023 (Vol. CCIS 1831, p. 1-9). Switzerland AG: Springer. Retrieved from https://doi.org/10.1007/978-3-031-36336-8 103

- Lu, K., Mardziel, P., Wu, F., Amancharla, P., Datta, A. (2020). Gender bias in neural natural language processing. Logic, Language, and Security: Essays Dedicated to Andre Scedrov on the Occasion of His 65th Birthday , 189-202,

Madaio, M., Blodgett, S.L., Mayfield, E., Dixon-Rom´ an, E. (2022). Beyond 'fairness': Structural (in) justice lenses on ai for education. The ethics of artificial intelligence in education (pp. 203-239). Routledge.

Manresa-Yee, C., &amp; Ramis, S. (2021). Assessing gender bias in predictive algorithms using explainable ai. Proceedings of the xxi international conference on human computer interaction (pp. 1-8).

Mowery, B.D. (2011). The paired t-test. Pediatric nursing , 37 (6), 320-322,

Nadeem, A., Abedin, B., Marjanovic, O. (2020). Gender bias in ai: A review of contributing factors and mitigating strategies.

Nadeem, A., Marjanovic, O., Abedin, B., et al. (2022). Gender bias in ai-based decision-making systems: a systematic literature review. Australasian Journal of Information Systems , 26 , ,

Nemani, P., Joel, Y.D., Vijay, P., Liza, F.F. (2023). Gender bias in transformer models: A comprehensive survey. arXiv preprint arXiv:2306.10530 , ,

O'Connor, S., &amp; Liu, H. (2023). Gender bias perpetuation and mitigation in ai technologies: challenges and opportunities. AI &amp; SOCIETY , 1-13,

Qadir, J. (2023). Engineering education in the era of chatgpt: Promise and pitfalls of generative ai for education. 2023 ieee global engineering education conference (educon) (pp. 1-9).

Slimi, Z. (2023). Navigating the ethical challenges of artificial intelligence in higher education: An analysis of seven global ai ethics policies.

Sun, T., Gaut, A., Tang, S., Huang, Y., ElSherief, M., Zhao, J., . . . Wang, W.Y. (2019). Mitigating gender bias in natural language processing: Literature review. arXiv preprint arXiv:1906.08976 , ,

Wang, J., &amp; Brown, M.S. (2007). Automated essay scoring versus human scoring: A comparative study. Journal of technology, Learning, and assessment , 6 (2), n2,

Wilson, C., Haudek, K., Osborne, J., Stuhlsatz, M., Cheuk, T., Donovan, B., . . . Zhai, X. (2023). Using automated analysis to assess middle school students' competence with scientific argumentation [Journal Article]. Journal of Research in Science Teaching , 1-32, https://doi.org/10.1002/tea.21864 Retrieved from

## https://doi.org/10.1002/tea.21864

Zhai, X. (2021). Practices and theories: How can machine learning assist in innovative assessment practices in science education [Journal Article]. Journal of Science Education and Technology , 30 (2), 139-149, Retrieved from https://link.springer.com/article/10.1007/s10956-021-09901-8

Zhai, X., He, P., Krajcik, J. (2022). Applying machine learning to automatically assess scientific models. Journal of Research in Science Teaching , 59 (10), 1765-1794,

Zhai, X., &amp; Krajcik, J. (2022). Pseudo ai bias. arXiv preprint arXiv:2210.08141 , ,

Zhai, X., &amp; Nehm, R.H. (2023). Ai and formative assessment: The train has left the station. Journal of Research in Science Teaching , ,

Zhai, X., Shi, L., Nehm, R.H. (2021). A meta-analysis of machine learning-based science assessments: Factors impacting machine-human score agreements. Journal of Science Education and Technology , 30 , 361-379,

Zhai, X., Yin, Y., Pellegrino, J.W., Haudek, K.C., Shi, L. (2020). Applying machine learning in science assessment: a systematic review [Journal Article]. Studies in Science Education , 56 (1), 111-151,