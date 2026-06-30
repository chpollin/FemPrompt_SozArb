---
source_file: Latif_2023_AI_Gender_Bias,_Disparities,_and_Fairness_Does.pdf
conversion_date: 2026-02-03T09:08:24.420461
converter: docling
quality_score: 95
---

## AI Gender Bias, Disparities, and Fairness: Does Training Data Matter?

Ehsan Latif AI4STEM Education Center &amp; Department of Mathematics, Science, and Social Studies Education, University of Georgia Athens, GA, USA

Xiaoming Zhai ∗ AI4STEM Education Center &amp; Department of Mathematics, Science, and Social Studies Education, University of Georgia Athens, GA, USA

Lei Liu Educational Testing Service Princeton, NJ, USA

Figure 1. Overview of AI gender bias analysis for automatic scoring.

<!-- image -->

compared with gender-specifically trained models. Collectively, the findings suggest that gender-unbalanced data do not necessarily generate scoring bias but can enlarge gender disparities and reduce scoring fairness.

Keywords: Artificial Intelligence (AI), Gender Bias, Machine Learning, Automatic Scoring, Education, Equalized Odds

## 1 Introduction

Today's AI is so advanced in computation that it has penetrated deep into the well of human life, shaking up industries and practices. But the possibility of artificial intelligence is always spoiled by built-in biases, especially gender biases, which often cause serious problems. In particular, discrimination against women in AI takes the form of influential automatic scoring systems that reproduce societal stereotypes and gaps [Zhai and Nehm 2023]. Among others, see [Cirillo et al. 2020; Leavy 2018; Nadeem et al. 2020] have stressed the important role that diversity is certain to play in machine learning over these questions of bias.

Zhai and Krajcik [2022] introduce the concept of pseudoAI bias to combat this mechanical AI bias, often giving rise to unnecessary fear about artificial intelligence. Although unintentional, the mechanical bias leads to discriminatory outcomes. These become especially glaring where gender is involved. Such biases in exceedingly widely used word embeddings and supervised machine learning models are

## Abstract

This study delves into the pervasive issue of gender issues in artificial intelligence (AI), specifically within automatic scoring systems for student-written responses. The primary objective is to investigate the presence of gender biases, disparities, and fairness in generally targeted training samples with mixed-gender datasets in AI scoring outcomes. Utilizing a fine-tuned version of BERT and GPT-3.5, this research analyzes more than 1000 human-graded student responses from male and female participants across six assessment items. The study employs three distinct techniques for bias analysis: Scoring accuracy difference to evaluate bias, mean score gaps by gender (MSG) to evaluate disparity, and Equalized Odds (EO) to evaluate fairness. The results indicate that scoring accuracy for mixed-trained models shows an insignificant difference from either male- or female-trained models, suggesting no significant scoring bias. Consistently with both BERT and GPT-3.5, we found that mixed-trained models generated fewer MSG and non-disparate predictions compared to humans. In contrast, compared to humans, genderspecifically trained models yielded larger MSG, indicating that unbalanced training data may create algorithmic models to enlarge gender disparities. The EO analysis suggests that mixed-trained models generated more fairness outcomes

∗ Corresponding author. Email: xiaoming.zhai@uga.edu

further underscored by the work of Bolukbasi et al. [2016] and Hall and Ellis [2023].

This is the significance of this study. By analyzing over 100 human-graded questions across various gender categories, it uses statistical evidence to show that both mixed-trained models are gender-neutral. Based on our male-only, femaleonly, and mixed written datasets (training), we have tested the performance of these models, creating both males and females or combined testing data. We use standard methods such as scoring accuracy difference (pair t-test [Mowery 2011]) to measure potential gender bias, mean score gaps [Wang and Brown 2007; Wilson et al. 2023]between machine and human scores for different genders to measure gender disparity, and Equalized Odds [Hardt et al. 2016] to measure fairness. (See Figure 1 for a detailed overview of the approach). The findings reveal a promising trajectory toward analyzing gender issues, evidenced by the insignificant accuracy difference that means non-biased prediction, low MSGs mean non-disparate prediction, and minimal odds gradient gamma ( &lt; . 01) mean fair prediction for mixed and separate models.

Thus, this study adds to the current debate over gender bias in AI. It chimes with recent studies [Franzoni 2023; Hall and Ellis 2023; Lima et al. 2023] insisting on developing gender-aware artificial intelligence. Moreover, it is in tune with attempts to remove gender bias through all-round reviews and refinements of algorithms [Li et al. 2022; Lu et al. 2020; Sun et al. 2019].

According to Slimi [2023] and O'Connor and Liu [2023], this study is due to an ethical mandate of fairness or even equity in AI systems. This research shows that targeted mix model training lacks traces of gender bias, providing a pathway for creating more equitable AI in education and other contexts. It contributes to the growing debate about ethical or socially beneficial artificial intelligence AI [Manresa-Yee and Ramis 2021; Nemani et al. 2023].

## 2 Background

## 2.1 AI in Education

AI, as an integral part of education, represents a fundamental change in the teaching and learning process. From personalized learning to administrative efficiency and pedagogical innovations, the fields in which AI can play a role are very diverse.

Roles and Impacts: Multifaceted implementation of AI in educational contexts. There are also studies [Berendt et al. 2020; Holmes et al. 2021] that discuss the ethical risks of AI in education and insist on keeping pace with technological progress while not violating moral or social values. How does AI fit into the educational process? Felix [2020] and Qadir Qadir [2023] share their perspectives on this, with changing applications of artificial intelligence from fortifying teaching methodologies to assisting administrative work.

Educational Analytics and Assessment: AI-based analysis is vital for evaluating student performance and discovering learning deficiencies. AI systems capable of handling large amounts of data can help educators interpret how students are doing so that they make more informed decisions and plan better-targeted approaches.

Ethical and Social Considerations: AI in education also raises important ethical questions. Algorithmic fairness, data privacy, and the digital divide are key to discussing AI in education. One recent study [Holmes et al. 2021] shares these ethical concerns, urging a community-wide framework to ensure that AI is used responsibly and equitably in educational settings.

The educational use of AI is developing rapidly, bringing new promise for enriching pedagogy and learning. Yet achieving the integration of AI in education depends on meeting the ethical, social and practical challenges posed by these technological developments.

## 2.2 Automatic Scoring in Education

Now that the era of AI in education is arriving, automatic scoring systems have evolved by leaps and bounds [Latif and Zhai 2023a; Zhai et al. 2020a,b]. Today's student assessments differ greatly from those of yesteryear. It provides scalability and efficiency for training while promoting new paradigms in educational tests.

Current State and Advancements: In a recent and detailed systematic review of studies on AI applications in creating student assessments, González-Calatayud et al. [2021] cover methodologies that have been used with information about their effectiveness from different countries around the world in October 2015, Zhai et al. [2021a] had published a review of AI-based assessments on science that covered the state-ofthe-art and practice concerning their latest developments as well as research outcomes. Their work shows that various AI technologies, especially machine learning and natural language processing, have already been proven to evaluate student answers in different subjects accurately.

Challenges in Implementation: These developments notwithstanding, making automatic scoring a reality is difficult. Zhai et al. [2022] explore the use of machine learning in scientific assessments, providing insight into how difficult it is to evaluate student models accurately. Zhai and Nehm [2023] look further into these problems, especially as they pertain to classroom assessments of student performance. They also consider how AI can be designed better for improved educational outcomes.

Machine-Human Score Agreements: Agreeing scores between machines and men is an important factor in automatic scoring. Zhai et al. [2021b] conducted a meta-analysis of machine learning-based science assessments to learn the reasons for low agreements between machine and human scores. Their conclusions indicate that although, in some aspects, AI can come extremely close to the humanly scored version,

differences nonetheless remain. There is still a need to review and improve individual algorithm parameters within educational environments continually.

Potential and Future Directions: Improving efficiency and scalability is not all AI can do for automatic scoring. It provides room for personal feedback, an adapting learning environment, and an in-depth assessment of student comprehension [Lee et al. 2023b; Zhai 2021]. According to researchers, the future of AI in education is for generative AI technology to complement and augment verbal teaching methods. It could go further than that by even allowing us glimpses into student learning processes and outcomes like never before possible. With great potential, LLMs are a revolutionary tool. These models have been used by researchers in grading science writing automatically [Latif and Zhai 2023b; Lee et al. 2023a].

## 2.3 AI Gender Bias, Disparities, and Fairness

Gender bias, disparities, and fairness in AI-especially educationally speaking, is a subject clouded by half-truths and hard facts. We consider the systematic definition of bias for AI (similar to [Larrazabal et al. 2020]), which refers to systematic rather than random error in which we analyze the calculated error in scoring accuracy of trained AI models. Gaps in automatically predicted machine scores for responses written by different genders of students are considered gender disparities in AI (concept defined by OECD [for Economic Co-operation and OECD]). Further, AI fairness as equity [Holstein and Doroudi 2019] is considered where the AI model assumes to be fair if it demonstrates an equal proportion of false positives and true positives for automatically predicted scores of different gender written responses. This section aims to dissect these aspects, providing a clearer understanding of the extent and implications of gender issues in AI systems.

Unraveling Myths: Misunderstanding Missing Information and flawed conclusions are almost always behind common myths about the gender bias of AI. One such myth is the belief that AI systems are naturally unbiased since they rely on algorithms and data. But as Bolukbasi et al. [2016] and Hardt et al. [2016] show, biases are inherent not only to the training data on which algorithmic design is based but even to its mechanisms of operation; they can result from seemingly gender-neutral words or expressions having a greater affinity with the Another myth is that the gender bias in AI lies wholly at a technical level, where it depends on solving these difficulties by gathering more data or writing better algorithms. These are essential factors, as recognized by Lu et al. [2020] and Manresa-Yee and Ramis [2021]. However, overcoming gender bias in AI requires a more profound awareness of societal structures and cultural values.

Confronting Realities: Gender bias in AI is complex and multilayer, both quantitatively technical and qualitatively social. A type of bias is pseudo-AI Bias Zhai and Krajcik

[2022] that reflects society's stereotypes. Bias can appear in various forms, such as distorted dataset representations or biased interpretations of results from AI.

Impact on Education: In educational settings, this bias affects outcomes. It means unequal assessment, reinforced gender stereotypes, and barriers to genuine educational opportunity. Madaio et al. [2022] analyze structural injustices that may be propagated through AI applications in educational contexts. They call for more comprehensive approaches to understanding these biases.

Debunking Myths and Embracing Realities: The bottom line is that both in education and elsewhere, slaying myths about AI gender bias - along with being aware of it- can lead to developing fairer, more equitable systems for all learners. This requires an integrated, multi-faceted approach that incorporates the ideas of gender studies experts and people from practice in ethical AI design and educational theory to ensure our applications are not simply making existing dignities unequal. To understand and resolve AI gender discrimination in education, we must abandon myths and face up to the actual, much more complicated ways that various biases both exist within and arise from systems of artificial intelligence. Such an understanding is critical to creating AI applications that are fair and effective in different educational settings.

Study's Approach to Bias, Disparities, and Fairness Analysis: The study employs a rigorous methodology to analyze gender issues in automatic scoring. We have fine-tuned standard BERT (similar to [Liu et al. 2023]) and GPT-3.5 (identical to [Latif and Zhai 2023b]), using more than 1000 human expert's rated student responses, proportionally distributed among male, female, and mixed datasets across six assessment items. The study measured bias by pair t-test of scoring accuracy between different gender-specifically trained models [Mowery 2011]; the gender disparities by mean score gaps by gender [Wang and Brown 2007; Wilson et al. 2023]; and fairness by EO [Hardt et al. 2016]. These methods comprehensively show how gender issues manifest in AI scoring systems for mixed and separately trained models.

Gender-Neutral Nature of Mixed Trained Models: Thestudy's core hypothesis is that AI models trained using mixed-gender datasets don't demonstrate gender prejudice in automatic scoring when tested on male and female responses. At its core is the notion that AI algorithms can only learn more gender-neutral patterns with a greater diversity of training data, thus eliminating biases resulting from unbalanced or skewed datasets.

Setting Ground to Avoid AI gender issues: Acritical element of this study is its aim to demystify AI and gender problems. The study uses a data-driven, empirical approach to show that difficulties in AI surrounding gender are not immovable. Through careful and reasoned training methods, they can be solved. This goes against the prevailing misconception that

all AI systems are biased or that arriving at bias-free AI is too complicated.

Implications for AI Development: These findings are significant for AI development in educational environments. They say that training data must be carefully thought about, and applying an appropriate analysis technique can result in fairer, more equitable AI systems. This is consistent with the broader debate on mainstreaming ethics in AI development, which stresses that all aspects of theory should be used to train AIs.

In short, this study adds to the ongoing efforts of many gender issues in AI through targeted training and rigorous analysis. It also provides empirical evidence and a conceptual framework, paving the way for adequate technical knowledge and full moral responsibility to develop responsible AI systems that do not fall prey to many wrong beliefs.

## 3 Methodology

This study aims to investigate gender issues in AI-based scoring systems based on state-of-the-art Language Models BERT and GPT-3.5 models. Large Language models tend to revolutionize education technology [Latif et al. 2023] and raise potential challenges, such as bias, disparity, and fairness, which must be addressed. A comprehensive methodology was adopted, comprising different training and testing phases for models and employing various statistical techniques to evaluate gender bias, disparities, and fairness. Figure 1 presents an overview of the research design.

## 3.1 Dataset

The study utilized a meticulously categorized dataset of student-written responses to six assessment items, each classified under the multi-class category. The datasets were categorized based on reported gender (i.e., male and female; we eliminated the data that did not report gender information), and a mixed dataset incorporated responses from both genders. Based on the availability of data, we used the maximum of available data while maintaining the ratio between training and testing data for each item by gender. Consequently, we randomly identified three training datasets for each item: mixed, male, and female training datasets and three testing datasets for each item. The detailed composition of each assessment item's dataset is presented in Table 1.

This comprehensive dataset facilitated a nuanced analysis of gender bias in AI-based scoring systems, ensuring robust and broadly applicable study findings.

## 3.2 Experimental Setup

The experimental setup involved rigorous training and testing using multiple training and testing datasets.

Training Phase: Each dataset undergoes a unique training cycle:

- A mixed-trained model trained with the mixed training dataset including both genders.
- A male-trained model trained exclusively with data from males.
- A female-trained model trained solely with data from females.

Using this approach, we developed three distinct language models for each assessment item, fine-tuned using both BERT and GPT-3.5, respectively.

Testing Phase: Each trained model undergoes multiple testing phases to detect potential biases. Specifically,

- Experiment 1. The model trained on the mixed dataset was tested against mixed testing data and separately against testing data from males and females. We used both BERT and GPT-3.5.
- Experiment 2. Models trained on a single gender's data were tested on their respective gender's test data and against the test data from the opposite gender. Similarly, we used both BERT and GPT-3.5.

This experimental design aimed to rigorously assess any inherent biases in the models' predictions across different datasets and gender divisions.

## 3.3 Accuracy Difference (Pair t-Test)

The accuracy difference between models was assessed using a paired t-test, a statistical method ideal for comparing the means of two related groups. Mowery [Mowery 2011] describes the paired t-test as a powerful tool for detecting differences in paired observations. Our study involved comparing the accuracies of models trained on different datasets.

Mathematically, the paired t-test is expressed as:

<!-- formula-not-decoded -->

where 𝐷 is the mean of the differences between paired observations, 𝑠 𝐷 is the standard deviation of the differences, and 𝑛 is the number of pairs. A p-value greater than 0.05 indicated no significant difference in accuracies between the models, suggesting minimal gender bias.

## 3.4 Mean Score Gap

Mean Score Gap (MSG) was utilized to evaluate the disparity in scores between different genders. MSG can be generated either by human experts or machine algorithmic models. Given that human-assigned scores have undergone rigorous scrutiny, we used MSG generated by human-assigned scores as the standard to evaluate machine-generated MSG. It can be seen that if machine-generated MSG is larger than human-generated MSG for the same testing data, the machine exacerbates the gender difference and may potentially create inequity. Wang and Brown [2007] and Wilson et al. [2023]highlighted the importance of such comparisons in

Table 1. Summary of Datasets and Their Samples

| Datasets               | Category    |   mixed Train- ing samples |   mixed Test- ing samples |   Male Train- ing |   Male Testing |   Female Training |   Female Testing |
|------------------------|-------------|----------------------------|---------------------------|-------------------|----------------|-------------------|------------------|
| falling weights        | Multi-class |                       1148 |                       230 |               342 |             87 |               478 |              120 |
| gelatin                | Multi-class |                        918 |                       230 |               344 |             86 |               477 |              120 |
| bathtub                | Multi-class |                        916 |                       230 |               364 |             92 |               450 |              113 |
| sandwater1             | Multi-class |                        915 |                       229 |               364 |             92 |               450 |              113 |
| sandwater2             | Multi-class |                        913 |                       229 |               364 |             92 |               449 |              113 |
| two boiling situations | Multi-class |                        909 |                       228 |               363 |             91 |               448 |              113 |

their study on automated essay scoring and automatic scoring of written scientific arguments. MSG is calculated as:

<!-- formula-not-decoded -->

where 𝑠𝑐𝑜𝑟𝑒 𝑔𝑒𝑛𝑑𝑒𝑟 1 ,𝑖 and 𝑠𝑐𝑜𝑟𝑒 𝑔𝑒𝑛𝑑𝑒𝑟 2 ,𝑖 are the scores assigned to the 𝑖 𝑡ℎ response by models trained on Male and Female datasets, respectively, and 𝑛 is the total number of responses. A threshold of MSG &lt; 0.2 was used to indicate acceptable score disparity.

## 3.5 Equalized Odds

Equalized Odds, as defined by Hardt et al. [Hardt et al. 2016], involves assessing the equality of true and false positive rates across groups. It is a crucial measure of fairness in predictive models. The Equalized Odds (EO) criterion is given by:

<!-- formula-not-decoded -->

where 𝑇𝑃𝑅 𝑚𝑎𝑙𝑒 and 𝑇𝑃𝑅 𝑓 𝑒𝑚𝑎𝑙𝑒 are the true positive rates for Male and Female, respectively, and 𝐹𝑃𝑅 𝑚𝑎𝑙𝑒 and 𝐹𝑃𝑅 𝑓 𝑒𝑚𝑎𝑙𝑒 are the false positive rates for the two genders. An EO value less than 0.01 indicates a fair model with minimal gender bias.

These three methods - Paired t-test, MSG, and Equalized Odds - provide a comprehensive approach to evaluating gender bias, disparities, and fairness in AI-based scoring systems, ensuring the ethical uses of AI models. The methodology encompassed a detailed experimental setup with rigorous training and testing phases and statistical analyses to assess gender issues in AI-based scoring systems comprehensively.

## 4 Results

## 4.1 Scoring Accuracy Difference Evaluation

A paired samples t-test was performed to evaluate whether there was a statistical difference between the scoring accuracy for male and female predicted scores before and after randomly mixing both genders' responses.

4.1.1 BERT Model Results. Results indicated that scoring accuracy of mixed testing data from mixed-trained BERT

model (MD=0.022, SD = 0.022) was not significantly higher than either the male-trained BERT model (MD=0.02, SD=0.08), t(6)=-0.86, 𝑝 = . 42 &gt; 0 . 05 nor the female-trained BERT model (MD=0.03, SD=0.069), t(6)=-1.37, 𝑝 = . 22 &gt; 0 . 05.

4.1.2 GPT-3.5 Turbo Model Results. Results indicated that scoring accuracy of mixed testing data from mixedtrained GPT-3.5 model (MD=0.023, SD = 0.09) was not significantly higher than either the male-trained GPT-3.5 model (MD=0.016, SD=0.11), t(6)=-0.42, 𝑝 = . 526 &gt; 0 . 05 nor the female-trained GPT-3.5 model (MD=0.018, SD=0.010), t(6)=0.42, 𝑝 = . 688 &gt; 0 . 05.

Interpretation: Both the BERT and GPT-3.5 models demonstrated consistent performance across mixed and genderspecific datasets, suggesting minimal gender biases.

## 4.2 Mean Score Gap

To verify our assumption, we designed two experiments to compare the difference of MSGs between human- and machine-graded scores. We tested the three models, Mixed-, male-, and female-trained models, and compared each of them with human-generated MSG.

4.2.1 Experiment 1: Mean Score Gap for the MixedTraining Models. The first experiment analyzed the MSGs between human and mix-trained machine-graded scores for BERT and GPT-3.5, respectively. We tested the model performance with mixed, male, and female testing datasets, respectively.

For the BERT model, the MSG of the six tasks yielded from human-assigned scores on the mixed testing dataset was 𝑀 𝑚𝑖𝑥𝑒𝑑 = 0 . 032, the male testing data was 𝑀 𝑚𝑎𝑙𝑒 = 0 . 056, and the female testing data was 𝑀 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 042. Correspondingly, MSG generated by the mixed-trained BERT model on the three testing datasets were 𝑀 𝑚𝑖𝑥𝑒𝑑 = 0 . 022, 𝑀 𝑚𝑎𝑙𝑒 = 0 . 048, and 𝑀 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 033. The results indicate that the MSG between mixed test datasets against humans ( 𝑀𝐷 𝑚𝑖𝑥𝑒𝑑 = 0 . 011) is comparatively lower than that of males ( 𝑀𝐷 𝑚𝑎𝑙𝑒 = 0 . 08) and females ( 𝑀𝐷 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 09).

In contrast, for the GPT-3.5 model, the MSG of the six tasks yielded from human-assigned scores on the mixed

Figure 2. Mean score gaps between male and female testing data: Comparing human-graded scores and fine-tuned LLMs' scores: Mixed training Model (Left) , Male trained Model (Center) , and Female trained Model (Right) comparison line plots of BERT (Top) and GPT3.5 (Bottom) fine-tuned models's scores.

<!-- image -->

testing dataset was 𝑀 𝑚𝑖𝑥𝑒𝑑 = 0 . 074, the male testing data was 𝑀 𝑚𝑎𝑙𝑒 = 0 . 082, and the female testing data was 𝑀 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 112. Correspondingly, MSG generated by the mixed-trained GPT-3.5 model on the three testing datasets were 𝑀 𝑚𝑖𝑥𝑒𝑑 = 0 . 072, 𝑀 𝑚 𝑎𝑙𝑒 = 0 . 072, and 𝑀 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 105. The results indicate that the MSG between mixed test datasets against humans ( 𝑀𝐷 𝑚𝑖𝑥𝑒𝑑 = 0 . 002) is comparatively lower than that of males ( 𝑀𝐷 𝑚𝑎𝑙𝑒 = 0 . 010) and females ( 𝑀𝐷 𝑓 𝑒𝑚𝑎𝑙𝑒 = 0 . 07).

## 4.2.2 Experiment2:MeanScoreGapforGenderSpecifically Trained Models. To understand the MSGs generated by the gender-specifically-trained models, the second experiment compared the MSGs yielded by machine-graded scores and human-graded scores, respectively. For each assessment task, we calculated MSG on the male and female testing datasets, respectively. We first reported the BERT results, followed by the GPT-3.5 results.

For the BERT model, overall the two gender-specifically trained models demonstrated a larger average MSG for the six tasks, M = 0.107, compared to that generated by the human grader, M = 0.98. For example, 'sandwater2', the MSGs were close for both testing datasets (Males: M=2.38, SD=0.67; Females: M=2.20, SD=0.73), akin to human MSGs (Males: M=2.33, SD=0.71; Females: M=2.20, SD=0.74), respectively. When a gender-specifically trained male model was tested on gender-counterpart testing data, we found that both Male and Female-trained Models showed increased MSGs on both testing datasets compared to human-generated MSGs. For example, the Male model in 'twoboilingsituation' scored Female testing data higher (M=2.42, SD=0.59) than Female testing data, indicating an increased gender disparities. Conversely, when gender-specific models were tested on the same gender testing datasets, they exhibited decreased gender disparities (Detailed results can be seen in Fig. 2). An anomaly noted was the similarity in standard deviations between the Mixed Model and human scores, indicating consistent scoring variance.

Similarly, the GPT-3.5, overall, the fine-tuned male- and female-trained models exhibited a larger average MSG for six tasks, M = 0.115, compared to that graded by the human expert, M = 0.98. For instance, for the item 'twoboilingsituation', the MSGs were close for both testing datasets (Males: M=2.40, SD=0.88; Females: M=2.15, SD=0.83), mirroring human scores (Males: M=2.37, SD=0.96; Females: M=2.19, SD=0.87), respectively. When a gender-specifically trained model was tested on gender-counter part testing data, we found that both Male and female-trained models showed increased MSGs on both testing datasets compared to human-generated MSGs. For instance, the male Model in 'sandwater1' had a lower score for females (M=2.12, SD=0.76) than males. Across all items, the Mixed testing's scores closely resembled human graders, suggesting reduced bias (Detailed results can be seen in Fig. 2).

Interpretation: These results indicate that training with a mixed dataset in both BERT and GPT-3.5 models has shown a minimal MSG compared to gender-specific training. This outcome validates our hypothesis that a balanced mixed training dataset have significant traces toward gender disparitiess, as reflected in the reduced MSGs in the mixed models. The findings underscore the importance of inclusive training datasets

in developing AI models that yield more equitable scoring outcomes.

## 4.3 Equalized Odds Evaluation

The study evaluated the Equalized Odds (EO) [Hardt et al. 2016] for BERT and GPT-3.5 models to assess fairness in gender predictions.

4.3.1 BERT Model Equalized Odds. The BERT model demonstrated an EO of 0.042 on the mixed testing dataset for the mixed-trained model, indicating a lower disparity in prediction fairness. In contrast, the gender-specificallytrained models exhibited higher EO values on the mixed testing dataset, with the Male model showing an EO of 0.107 and the Female model having an EO of 0.074. These results suggest that the mixed-trained model is more equitable in its predictions across genders than gender-specific models.

4.3.2 GPT-3.5 Model Equalized Odds. For the GPT-3.5 model, the mixed-trained model's EO was 0.061 on the mixed testing dataset, again reflecting a reduced gradient and, thus, greater fairness in predictions. The Male and Female trained models showed EOs on the same testing dataset of 0.076 and 0.074, respectively. While these values are closer to that of the mixed model than the BERT model, they indicate a higher disparity in for the gender-specific models.

Interpretation: The mixed-trained models for both BERT and GPT-3.5 have lower EO values, suggesting more equitable predictions and higher fairness compared to genderspecific models. This outcome supports the hypothesis that training with a balanced dataset can reduce the EO gradient, contributing to the development of fair AI models.

## 5 Discussion

The research shows that gender bias is absent from genderunbalanced training datasets for AI-based scoring systems. The results provided evidence to refute the widely held belief that AI inevitably reinforces gender biases [Bolukbasi et al. 2016; Lu et al. 2020]. Our findings, however, suggest that algorithms that are trained on data that is imbalanced in terms of gender could exacerbate existing gaps in gender. The promise of balanced training in addressing gender equity is demonstrated by the decreased EO gradients and reduced MSG in models trained on mixed datasets. This discovery is vital in light of Hardt et al. [2016], who highlight the significance of opportunity equality in supervised learning.

Ourresearch indicates that balanced mixed training datasets have the potential to improve the equality of AI-based assessments in education, where the fairness of AI is crucial [Li et al. 2022]. This strategy emphasizes the need for inclusive and equitable AI activities, which aligns with the ethical principles Slimi [2023] suggests for AI in higher education.

According to Zhai and Krajcik [2022] concept of pseudo AI bias, biases in AI might be deeply embedded and subtle rather than always obvious. This study's demonstration of the balanced mixed training model's gender-neutral behavior offers a path forward for resolving such unfounded allegations about AI biases. Gender stereotypes can be prevented from unintentionally being reinforced by AI models by guaranteeing varied representation in training data.

The literature supporting debiasing AI systems [ManresaYee and Ramis 2021; Nadeem et al. 2022] aligns with our findings. This work shows that balanced training produces more equitable AI outcomes, which advances the larger attempts to develop impartial and fair AI models. The method offers a workable answer to this widespread problem by refuting that AI systems are bound to reproduce societal prejudices.

The study's findings strongly support the gender issue of balanced mixed training in artificial intelligence for automated scoring. In addition to addressing the pressing issues of equality and fairness in AI-based scoring systems, our method offers proof against mechanical pseudo-bias in more general AI applications.

## 6 Conclusion

The analysis using BERT and GPT-3.5 on student written responses has significantly advanced our understanding of gender bias, disparities, and fairness in AI-based scoring systems. This study demonstrates that gender-unbalanced training has insignificant traces of gender bias. The findings challenge prevailing narratives about the inevitability of AI bias. We found that models trained on mixed-gender data, as opposed to gender-specific data, produced lower MSG when compared with human-generated results, implying that training data lacking gender balance might lead to algorithms exacerbating gender disparities. The EO analysis revealed that models trained on mixed-gender data achieved fairer outcomes than gender-specific ones. The results indicate that while gender-imbalanced data may not inherently lead to scoring bias, they can amplify gender disparities and diminish scoring fairness.

## Acknowledgment

This study secondary analyzed data from a project supported by the Institute of Education Sciences (grant number R305A160219). The authors acknowledge the funding agencies and the project teams for making the data available for analysis. The project is partially supported by NSF (grant number 2101104). The findings, conclusions, or opinions herein represent the authors' views and do not necessarily represent the views of personnel affiliated with the funding agencies.

## References

- Bettina Berendt, Allison Littlejohn, and Mike Blakemore. 2020. AI in education: Learner choice and fundamental rights. Learning, Media and Technology 45, 3 (2020), 312-324.
- Tolga Bolukbasi, Kai-Wei Chang, James Y Zou, Venkatesh Saligrama, and Adam T Kalai. 2016. Man is to computer programmer as woman is to homemaker? debiasing word embeddings. Advances in neural information processing systems 29 (2016).
- Davide Cirillo, Silvina Catuara-Solarz, Czuee Morey, Emre Guney, Laia Subirats, Simona Mellino, Annalisa Gigante, Alfonso Valencia, María José Rementeria, Antonella Santuccione Chadha, et al. 2020. Sex and gender differences and biases in artificial intelligence for biomedicine and healthcare. NPJ digital medicine 3, 1 (2020), 81.
- Cathrine V Felix. 2020. The role of the teacher and AI in education. In International perspectives on the role of technology in humanizing higher education . Emerald Publishing Limited, 33-48.
- Organisation for Economic Co-operation and Development (OECD). 2018. Bridging the digital gender divide: Include, upskill, innovate. OECD (2018).
- Valentina Franzoni. 2023. Gender Differences and Bias in Artificial Intelligence. In Gender in AI and Robotics: The Gender Challenges from an Interdisciplinary Perspective . Springer, 27-43.
- Víctor González-Calatayud, Paz Prendes-Espinosa, and Rosabel Roig-Vila. 2021. Artificial intelligence for student assessment: A systematic review. Applied Sciences 11, 12 (2021), 5467.
- Paula Hall and Debbie Ellis. 2023. A systematic review of socio-technical gender bias in AI algorithms. Online Information Review (2023).
- Moritz Hardt, Eric Price, and Nati Srebro. 2016. Equality of opportunity in supervised learning. Advances in neural information processing systems 29 (2016).
- Wayne Holmes, Kaska Porayska-Pomsta, Ken Holstein, Emma Sutherland, Toby Baker, Simon Buckingham Shum, Olga C Santos, Mercedes T Rodrigo, Mutlu Cukurova, Ig Ibert Bittencourt, et al. 2021. Ethics of AI in education: Towards a community-wide framework. International Journal of Artificial Intelligence in Education (2021), 1-23.
- Kenneth Holstein and Shayan Doroudi. 2019. Fairness and equity in learning analytics systems (FairLAK). In Companion proceedings of the ninth international learning analytics &amp; knowledge conference (LAK 2019) . 1-2.
- Agostina J Larrazabal, Nicolás Nieto, Victoria Peterson, Diego H Milone, and Enzo Ferrante. 2020. Gender imbalance in medical imaging datasets produces biased classifiers for computer-aided diagnosis. Proceedings of the National Academy of Sciences 117, 23 (2020), 12592-12594.
- Ehsan Latif, Gengchen Mai, Matthew Nyaaba, Xuansheng Wu, Ninghao Liu, Guoyu Lu, Sheng Li, Tianming Liu, and Xiaoming Zhai. 2023. Artificial general intelligence (AGI) for education. arXiv preprint arXiv:2304.12479 (2023).
- Ehsan Latif and Xiaoming Zhai. 2023a. Automatic Scoring of Students' Science Writing Using Hybrid Neural Network. arXiv preprint arXiv:2312.03752 (2023).
- Ehsan Latif and Xiaoming Zhai. 2023b. Fine-tuning chatgpt for automatic scoring. arXiv preprint arXiv:2310.10072 (2023).
- Susan Leavy. 2018. Gender bias in artificial intelligence: The need for diversity and gender theory in machine learning. In Proceedings of the 1st international workshop on gender equality in software engineering . 14-16.
- Gyeong-Geon Lee, Ehsan Latif, Xuansheng Wu, Ninghao Liu, and Xiaoming Zhai. 2023a. Applying Large Language Models and Chain-of-Thought for Automatic Scoring. arXiv preprint arXiv:2312.03748 (2023).
- Gyeong-Geon Lee, Lehong Shi, Ehsan Latif, Yizhu Gao, Arne Bewersdorf, Matthew Nyaaba, Shuchen Guo, Zihao Wu, Zhengliang Liu, Hui Wang, et al. 2023b. Multimodality of AI for Education: Towards Artificial General Intelligence. arXiv preprint arXiv:2312.06037 (2023).
- Chenglu Li, Wanli Xing, and Walter Leite. 2022. Using fair AI to predict students' math learning outcomes in an online platform. Interactive Learning Environments (2022), 1-20.
- Rosileine Mendonca de Lima, Barbara Pisker, and Victor Silva Corrêa. 2023. Gender bias in artificial intelligence. Journal of Telecommunications and the Digital Economy 11, 2 (2023), 8-30.
- Chaoming Liu, Wenhao Zhu, Xiaoyu Zhang, and Qiuhong Zhai. 2023. Sentence part-enhanced BERT with respect to downstream tasks. Complex &amp; Intelligent Systems 9, 1 (2023), 463-474.
- Kaiji Lu, Piotr Mardziel, Fangjing Wu, Preetam Amancharla, and Anupam Datta. 2020. Gender bias in neural natural language processing. Logic, Language, and Security: Essays Dedicated to Andre Scedrov on the Occasion of His 65th Birthday (2020), 189-202.
- Michael Madaio, Su Lin Blodgett, Elijah Mayfield, and Ezekiel Dixon-Román. 2022. Beyond 'fairness': Structural (in) justice lenses on ai for education. In The ethics of artificial intelligence in education . Routledge, 203-239.
- Cristina Manresa-Yee and Silvia Ramis. 2021. Assessing gender bias in predictive algorithms using explainable AI. In Proceedings of the XXI International Conference on Human Computer Interaction . 1-8.
- Bernice D Mowery. 2011. The paired t-test. Pediatric nursing 37, 6 (2011), 320-322.
- Ayesha Nadeem, Babak Abedin, and Olivera Marjanovic. 2020. Gender Bias in AI: A review of contributing factors and mitigating strategies. (2020).
- Ayesha Nadeem, Olivera Marjanovic, Babak Abedin, et al. 2022. Gender bias in AI-based decision-making systems: a systematic literature review. Australasian Journal of Information Systems 26 (2022).
- Praneeth Nemani, Yericherla Deepak Joel, Palla Vijay, and Farhana Ferdousi Liza. 2023. Gender Bias in Transformer Models: A comprehensive survey. arXiv preprint arXiv:2306.10530 (2023).
- Sinead O'Connor and Helen Liu. 2023. Gender bias perpetuation and mitigation in AI technologies: challenges and opportunities. AI &amp; SOCIETY (2023), 1-13.
- Junaid Qadir. 2023. Engineering education in the era of ChatGPT: Promise and pitfalls of generative AI for education. In 2023 IEEE Global Engineering Education Conference (EDUCON) . IEEE, 1-9.
- Zouhaier Slimi. 2023. Navigating the Ethical Challenges of Artificial Intelligence in Higher Education: An Analysis of Seven Global AI Ethics Policies. (2023).
- Tony Sun, Andrew Gaut, Shirlyn Tang, Yuxin Huang, Mai ElSherief, Jieyu Zhao, Diba Mirza, Elizabeth Belding, Kai-Wei Chang, and William Yang Wang. 2019. Mitigating gender bias in natural language processing: Literature review. arXiv preprint arXiv:1906.08976 (2019).
- Jinhao Wang and Michelle Stallone Brown. 2007. Automated essay scoring versus human scoring: A comparative study. Journal of technology, Learning, and assessment 6, 2 (2007), n2.
- C. Wilson, K. Haudek, J. Osborne, M. Stuhlsatz, T. Cheuk, B. Donovan, Z. Bracey, M. Mercado, and X. Zhai. 2023. Using automated analysis to assess middle school students' competence with scientific argumentation. Journal of Research in Science Teaching (2023), 1-32. https://doi.org/10. 1002/tea.21864
- Xiaoming Zhai. 2021. Advancing automatic guidance in virtual science inquiry: From ease of use to personalization. Educational Technology Research and Development 69, 1 (2021), 255-258. https://doi.org/DOI: 10.1007/s11423-020-09917-8
- Xuesong Zhai, Xiaoyan Chu, Ching Sing Chai, Morris Siu Yung Jong, Andreja Istenic, Michael Spector, Jia-Bao Liu, Jing Yuan, and Yan Li. 2021a. A Review of Artificial Intelligence (AI) in Education from 2010 to 2020. Complexity 2021 (2021), 1-18.
- Xiaoming Zhai, Kevin C Haudek, Lehong Shi, Ross Nehm, and Mark UrbanLurain. 2020a. From substitution to redefinition: A framework of machine learning-based science assessment. Journal of Research in Science Teaching 57, 9 (2020), 1430-1459. - Xiaoming Zhai, Peng He, and Joseph Krajcik. 2022. Applying machine learning to automatically assess scientific models. Journal of Research in Science Teaching 59, 10 (2022), 1765-1794.
- Xiaoming Zhai and Joseph Krajcik. 2022. Pseudo AI bias. arXiv preprint arXiv:2210.08141 (2022).

Xiaoming Zhai and Ross H Nehm. 2023. AI and formative assessment: The train has left the station. Journal of Research in Science Teaching (2023). Xiaoming Zhai, Lehong Shi, and Ross H Nehm. 2021b. A meta-analysis of machine learning-based science assessments: Factors impacting machinehuman score agreements. Journal of Science Education and Technology

30 (2021), 361-379.

Xiaoming Zhai, Yue Yin, James W Pellegrino, Kevin C Haudek, and Lehong Shi. 2020b. Applying machine learning in science assessment: a systematic review. Studies in Science Education 56, 1 (2020), 111-151.