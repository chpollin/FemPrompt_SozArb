---
source_file: Zhao_2025_Thinking_like_a_scientist_Can_interactive.pdf
conversion_date: 2026-02-03T09:34:47.110305
converter: docling
quality_score: 95
---

<!-- image -->

## Thinkingglyph[suppress] Likeglyph[suppress] aglyph[suppress] Scientist:glyph[suppress] Canglyph[suppress] Interactiveglyph[suppress] Simulationsglyph[suppress] Fosterglyph[suppress] Criticalglyph[suppress] AIglyph[suppress] Literacy?glyph[suppress]

Yiling Zhao 1( B )glyph[suppress] , Audrey Michal 2glyph[suppress] , Nithum Thain 3glyph[suppress] , and Hari Subramonyam 1

1 Stanford University, Stanford, C A, USA { ylzhao,harihars } @stanford.eduglyph[visiblespace]

2glyph[suppress] University of Michigan, Flint, MI, USA

almichal@umich.eduglyph[visiblespace]

- 3glyph[suppress] Google Research, Toronto, ON, Canada

nthain@google.comglyph[visiblespace]

Abstract.glyph[suppress] As AI systems shape individual and societal decisions, fostering critical AI literacy is essential. Traditional approaches-such as blog articles, static lessons, and social media discussions-often fail to support deep conceptual understanding and critical engagement. This study examines whether interactive simulations can help learners 'think like a scientist' by engaging them in hypothesis testing, experimentation, and direct observation of AI behavior. In a controlled study with 605 participants, we assess how interactive AI tutorials impact learning of key concepts such as fairness, dataset representativeness, and bias in language models. Results show that interactive simulations effectively enhance AI literacy across topics, supporting greater knowledge transfer and self-reported confidence, though engagement alone does not predict learning. This work contributes to the growing field of AI literacy education, highlighting how interactive, inquiry-driven methodologies can better equip individuals to critically engage with AI in their daily lives.

Keywords:glyph[suppress] AI literacy · Education about AI · Critical R eflection on AI Applications · Learning Analytics

## 1 Introductionglyph[suppress]

As artificial intelligence (AI) systems increasingly shape individual and societal experiences, fostering critical AI literacy is essential [25]. This literacy extends beyond a conceptual understanding of AI and necessitates critical thinking skills to assess its limitations and broader implications. For example, a hiring algorithm trained on historical recruitment data may inadvertently perpetuate biases, disadvantaging historically underrepresented groups [27]. Thus, it is crucial to recognize that datasets are not neutral-they are shaped by the choices, assumptions, and limitations of their creators-and that educators and policymakers must critically analyze training data and decision-making processes to identify and mitigate biases before implementation.

Current AI literacy approaches employ diverse content and methods, including tools like Google Teachable Machine [3], structured curricula integrating technical and ethical topics [5], hands-on workshops with interactive activities [15,31], and programming-based frameworks such as block-based e nvironments [16]. These initiatives are often tailored to specific age groups or audiences, offering accessible introductions to AI concepts while fostering engagement through simplified, project-based learning. However, many of these approaches prioritize operational skills , often overlooking the critical thinking required to interrogate biases, evaluate limitations, and understand the societal impacts of AI systems. By emphasizing technical knowledge or modular learning, they may neglect the critical literacy needed to navigate AI's ethical, political, and social complexities in real-world contexts [8,22].

To address this gap, the approach of scientific discovery learning (SDL) offers a promising alternative by e mphasizing active exploration, hypothesis testing, and iterative reasoning [7]. SDL encourages users to 'think like a scientist'to question assumptions, analyze evidence, and draw conclusions-potentially enhancing critical thinking and reasoning skills. For instance, an interactive Explorable such as Google's Datasets Have Worldviews [11] allows people to adjust the parameters of a dataset and observe how differing assumptions, such as changes i n category definitions or sampling biases, impact AI classifications (see Fig. 1). This interactive process could help people understand how the worldviews embedded in datasets shape AI decisions, fostering a deeper understanding of the system's limitations and encouraging critical thinking about the implications of those decisions.

Building on the theoretical foundation of SDL, our work investigates the potential of Explorable Explanations to enhance AI literacy by fostering critical thinking and reasoning skills . Our research questions are:

- RQ1: Are interactive tutorial articles effective in teaching AI-related concepts and improving AI literacy?
- RQ2: If an interactive article effectively improves conceptual understanding of a specific AI ethics topic, does t his improvement generalize more broadly across other AI topics?
- RQ3: What interaction patterns do readers use when interacting with Explorable articles?

Through a controlled study involving over 600 participants on Prolific [26], we evaluate the effectiveness of four Explorable explanations-focused on datasets and biases, algorithmic decision-making, AI ethics and fairness, and generative AI-compared to traditional static materials for developing a critical understanding of AI systems. Participants manipulated parameters, tested assumptions, and observed real-time outcomes, aligning with the principles of SDL. Results demonstrated that participants in the Explorable condition experienced significant gains in AI literacy, both in objective assessments and self-reported understanding. While learning gains were also observed in the control conditions, participants in the Explorable condition demonstrated patterns of conceptual improvement and broader generalization across topics, suggesting potential

advantages of interactive formats. Furthermore, analysis of interaction patterns revealed that engagement styles varied based on content complexity and topic familiarity. The correlation between interaction quantity and literacy improvement was weak or non-significant, indicating that the quality of engagement, rather than the amount, is crucial. These findings demonstrate the potential of Explorable explanations as an interactive metho d to address the limitations of current AI literacy approaches. They provide a way to equip end users of AI with the critical thinking and reasoning skills needed to understand and assess AI systems they may encounter.

Fig.glyph[suppress] 1.glyph[suppress] Explorable Illustration: Datasets Hav e Worldviews.

<!-- image -->

## 2 Relatedglyph[suppress] Workglyph[suppress]

AI literacy is a set of competencies that enables individuals to critically evaluate AI technologies, communicate and collaborate effectively with AI, a nd use AI as a tool online, at home, and in the workplace [20]. Researchers argue that AI literacy is essential for career development and everyday usage, emphasizing the importance of learning to use AI appropriately while distinguishing between ethical and unethical practices [23]. Cultivating AI literacy equips people with the ability to use AI-driven technologies f or advanced learning and skill development [12]. Furthermore, educating people about AI ethics is critical to promoting the application of AI for societal good [9]. Hidalgo emphasized that AI literacy should thus encompass both technological aspects of how AI wo rks and its impact on people, including ethics and fairness [14]. Recent studies have begun to explore whether training in AI ethics can improve understanding of AI implications. For example, Kasinidou et al. found that attending a brief seminar on Fairness, Accountability, Transparency , and Ethics (FATE) in algorithmic decision-making improved understanding of FATE topics in AI among computer science students [17]. Additionally, Kasperson et al. found that having high school students use a web-based tool to learn about machine learning in societal contexts encouraged an improved understanding of AI implications [18].

In addition to investigating what content to teach for comprehensive AI literacy, researchers have begun testing how to best teach AI literacy. Kim et al. demonstrated that AI education with flipped learning improved academic achievement in students with and without technical backgrounds [19]. Alam proposed gaming as a method to assist in teaching AI and machine learning, leveraging its engaging features [1]. Others have focused on understanding training data to explain how biases in training data can negatively affect the fairness of AI decisions (i.e., Explainable AI) [2]. However, Sneirson et al. noted that while several AI practitioners have developed AI explanations (Explainables), they struggle to evaluate the success of their artifacts, and rigorous quantitative pre- and post-test comparisons have been lacking [30].

Interactive simulations have shown promising contributions to science education, serving as a platform for inquiry-based learning and fostering the development of scientific knowledge and skills [29]. By supporting sophisticated manipulation of information, interactive tools are useful f or teaching complex concepts and simulations [21]. Interactive formats are both engaging and educationally effective across various disciplines, including medical education [13,24,28] and engineering [10]. However, few studies have specifically investigated the effectiveness of web-based interactive tutorials for teaching the ethical implications of AI. Thus, interactive articles could serve as an entry point for individuals of all ages and backgrounds to build foundational knowledge in AI. Given their potential to explain complex concepts and engage audiences, interactive articles could be particularly effective in improving AI literacy.

## 3 Method

glyph[suppress]

We conducted a controlled study to evaluate how interactive simulations impact AI literacy. Participants engaged with four AI topics across three different instructional formats, and their learning outcomes were assessed using pre- and post-test measures.

Study Design: Participants were randomly assigned to one of three conditions designed to assess the impact of interactivity on AI literacy: (1) Explorable (interactive tutorial) , where participants engaged with a web-based tutorial featuring dynamic visualizations, adjustable parameters, and real-time feedback to explore AI concepts through hands-on experimentation; (2) Static (PDF tutorial) , where participants received a non-interactive, text-based version of the tutorial in PDF format, preserving the explanatory content but removing interactive elements such as simulations and input-based feedback; and (3) Basic Control (no tutorial) , where participants received no instructional material and proceeded directly from the pre-test to the post-test, serving as a baseline for evaluating prior knowledge and incidental learning. The Explorable and Static conditions allowed for a direct comparison of interactive versus static learning materials, while the Basic Control condition provided a measure of how much learning could be attributed to the interventions rather than general exposure to AI-related concepts.

The pre-test included demographic questions (age, gender, ethnicity, education level, and country of residence) and 18 A I literacy items adapted from the Meta AI Literacy Scale [4], rated on a 5-point Likert scale from Strongly Disagree (1) to Strongly Agree (5). These questions covered Use &amp; Apply AI (e.g., 'I can operate AI applications in everyday life'), Know &amp; Understand AI (e.g., 'I can assess the limitations and opportunities of using an AI'), Detect AI (e.g., 'I can distinguish devices that use AI f rom devices that do not'), and AI Ethics (e.g., 'I can analyze AI-based applications for their ethical implications'). Participants also answered two multiple-choice questions based on real-world AI scenarios from the AI Incident Database 1 , assessing their ability to identify risks and propose mitigation strategies corresponding to the AI topic group they were assigned to. F or instance, for the Diversity topic, the case of Incident 37 2 : 'Female Applicants Down-Ranked by Amazon Recruiting Tool' was used to develop a scenario describing how companies use AI to identify the most promising candidates in the resume screening process. The first question asked participants to identify the main poten tial issue caused by the use of AI in the given scenario, while the second question asked participants to select appropriate mitigation strategies for improving equitable usage.

Following the pre-test , participants in the Explorable group interacted with an assigned tutorial, while the Static group read a non-interactive PDF version. The Basic Control group received no instructional material. The post-test included additional target-topic AI scenario questions, three non-target AI scenario questions (in randomized order), and a re-evaluation of AI literacy using the same 18 AI literacy items. To analyze engagement for the Explorable group, all interactions on the simulation, such as scrolling and clicking, were logged using the participant's session ID along with timestamp information.

Topic Selection and Justification: This study evaluated the effectiveness of interactive simulations in improving AI literacy using four AI Explorables 3 developed by a multidisciplinary team at a major technology company. These Explorables were selected to represent diverse AI topics, balancing technical and ethical dimensions: Large Language Models 4 , showcasing advances in language tec hnology; Diversity 5 and Fa irness 6 , addressing bias and algorithmic equity; a nd Data Representations 7 , illustrating how datasets shape AI outputs. This selection provided a well-rounded foundation for AI literacy, equipping learners with conceptual understanding and critical perspectives on AI's societal implications.

1glyph[suppress] https://incidentdatabase.ai/.

2glyph[suppress] https://incidentdatabase.ai/cite/37.

3glyph[suppress] https://pair.withgoogle.com/explorables/.

4glyph[suppress] https://pair.withgoogle.com/explorables/fill-in-the-blank/.

5glyph[suppress] https://pair.withgoogle.com/explorables/measuring-diversity/.

6glyph[suppress] https://pair.withgoogle.com/explorables/measuring-fairness/.

7glyph[suppress] https://pair.withgoogle.com/explorables/dataset-worldviews/.

Participants and Recruitment: This study was preregistered 8 , and participants were recruited using the Prolific Platform [26]. They were required to be at least 18 years old, proficient in English, and located in the United States. These criteria helped ensure a broad adult population while controlling for cultural and linguistic variables ( n = 612). Participants in the Explorable and static tutorial control groups were compensated $4 for completing the survey, while those in the basic control groups were compensated $2. The compensation w as determined based on the relative time required to complete the study, calculated to reflect approximately $12 for an hour of effort. Qualified participants were randomly assigned to one AI topic group and could not be selected for any other group.

To ensure data quality, we implemented several measures. Explorable group participants were required to interact with the Explorable for at least 5 min, with submissions below 1 min flagged for review. Control group participants had to enter a password at the end of their static tutorial to proceed. Additionally, all participants faced an attention check question in the post-test survey, with incorrect responses leading to submission flagging. These measures collectively enhanced our confidence in the validity of participant engagement and data quality across both groups.

## 3.1 Data A nalysis

The survey responses, activity logs, and Prolific submission data were linked using participant's session IDs. Only approved Prolific submissions were retained for analysis. After cleaning and linking, valid data points varied across groups: 47 for LLM Explorable, 51 each for Fairness, Diversity, and Worldview Explorables; 49 for LLM Static con trol, 50 for Worldview Static control, 51 each for Fairness and Diversity Static controls. The Basic control group consistently had 51 valid data points across all four AI topics.

Tutorial Effectiveness: We assessed tutorial effectiveness using both withinsubject paired t -tests and between-group regression analyses. Paired t -tests evaluated whether participants demonstrated significant improvements from pre- to post-test on topic-specific scenario items, with p ≤ 0 . 05 indicating a meaningful learning gain. To compare i nstructional formats while accounting for prior knowledge, we fit an ordinary least squares (OLS) regression model predicting post-test scores from pre-test scores and instructional condition.

Generalization: To assess knowledge transfer, we compared post-test accuracy between target and non-target topic AI scenario questions using paired t -tests. Effective generalization is indicated by statistically similar performance across target and non-target questions ( p &gt; 0 . 05).

8glyph[suppress] Preregistration available a t Self-assessed AI Literacy: Changes in self-reported AI literacy and ethics understanding were evaluated using paired t -tests comparing pre- and postinterv ention scores within-subject for each AI topic across all conditions.

Engagement Analysis: User engagement was analyzed through a multifaceted approach. We identified distinct scrolling behaviors by visualizing scroll depth over time for individual users, providing insights into various interaction patterns. Additionally, we mapped user interactions into two categories: 'Identify Issue' and 'Propose Solutions' activities. To examine how engagement styles related to learning outcomes, we computed partial correlations between activit y counts and score improvements, controlling for time-on-task via OLS regression and correlating the resulting residuals. This isolated the unique contribution of interaction types beyond engagement duration.

## 4 Resultsglyph[suppress]

The study included a diverse participant pool. The age distribution was rightskewed, with 65% participants under 40. Gender leaned slightly male (53% male, 44% female, 3% other), and education levels skewed toward higher degrees, with bachelor's holders most common (39%). Racially, White/Caucasian participants were the largest group (63%), followed by Black or African American (15.5%) and Asian participants (11%).

## 4.1 Effectiveness of Interactive S imulations

Figure 2 displays changes in participants' overall performance on AI literacy questions across four topics: Worldview , Diversity , Fairness , and LLM . The Explorable condition showed significant improvements in ov erall scores across three topics, demonstrating the effectiveness of the interactive intervention. For

<!-- image -->

Errorbarsrepresent95%confidenceintervals.

*Significant changes(p≤0.05)

Fig.glyph[suppress] 2.glyph[suppress] AI Literacy Learning Gains Across Conditions.

Worldview, there was a significant gain in 'Identify the issue' ( p = 0 . 007). The Diversity topic showed a significant improvement in 'Propose solutions' ( p &lt; 0 . 001), while Fairness improved consistently across all measures (all 0 008).

The Explorable group demonstrated statistically significant pre-to-post improvements in most topics, while gains in the Basic Control group were smaller or non-significant. For example, in the Worldview topic, overall scores improved from 0.53 to 0.67 ( p &lt; 0 . 001) in the Explorable condition, compared to a smaller increase from 0.46 to 0.58 ( p = 0 . 047) in the Basic Control condition. In the Diversity topic, the Explorable group improved significantly from 0.69 to 0.81 ( p &lt; 0 . 001), while the Basic Control group's increase from 0.63 to 0.71 was not statistically significant ( p = 0 . 06). Similarly, for 'Propose Solutions' in Diversity, the Explorable condition improved from 0.65 to 0.86 ( p &lt; 0 . 001), while the Basic Control condition showed minimal change (0.69 to 0.72, p = 0 . 65).

ps ≤ .

Further comparison between the Explorable and Static Control conditions revealed that while both interventions improved AI literacy, their effectiveness varied by topic. The Explorable condition showed clear advantages in fostering solution-oriented thinking for Diversity (0.65 to 0.86, p &lt; 0 . 001; Static Control: 0.62 to 0.74, p = 0 . 05) and Fairness (0.61 to 0.78, p = 0 . 01; Static Control: 0.61 to 0.65, p = 0 . 57). For W orldview, the Static Control was highly effective in improving 'Identify the issue' scores (0.37 to 0.70, p &lt; 0 . 001), while the Explorable condition also showed significant gains (0.46 to 0.65, p = 0 . 01), suggesting that static materials can also be effective for certain learning outcomes.

Notably, the LLM topic showed mixed results, with all three conditions experiencing some declines in performance. These findings underscore that while interactive and static interventions both enhanced AI literacy in some areas, their relative effectiveness is topic-dependent, highlighting the need to tailor educational strategies to specific AI concepts.

analcon-

To account for differences in pre-test ability, we conducted a regression ysis predicting post-test scores from pre-test performance and instructional dition:

<!-- formula-not-decoded -->

where Static iψ and Basic iψ are dummy variables and Explorable iψ serves as the reference group. The model revealed a strong relationship between pre- and post-test performance ( β 1glyph[suppress] = 0 . 22, SE = 0.03, p &lt; . 001), highlighting the importance of prior knowledge. While post-test scores in the Static ( β 2glyph[suppress] = -0 . 01, SE = 0.03, p = . 642) and Basic ( β 3glyph[suppress] = -0 . 04, SE = 0.03, p = . 127) conditions were slightly lower than in the Explorable condition, these differences were not statistically significant. Overall, the regression results support the pattern observed in the within-group analyses: interactive tutorials are at least as effective as static materials and may offer additional benefits for promoting knowledge generalization and building perceptual confidence, as discussed in the following sections.

## 4.2 Transfer Task G eneralization

The Explorable condition demonstrated strong generalization across most AI topics. As shown in Table 1, there were no significant differences between target and non-target question performance for Worldview ( p = 0 . 93), Fairness ( p = 0 . 16), and LLM ( p = 0 . 96), indicating effective knowledge transfer. However, in the Diversity group, target questions significantly outperformed nontarget ones ( p &lt; 0 . 001), suggesting that the knowledge acquired in this domain was more specific and less transferable. In contrast, control conditions exhibited limited generalization, with significant target/non-target differences, indicating that interactive learning may better support knowledge transfer than passive exposure.

Tableglyph[suppress] 1.glyph[suppress] AI Literacy Generalization and Self-Assessed Literacy Changes

|              |         | Target vs. Non-Target ItemsAI   | Target vs. Non-Target ItemsAI   | Target vs. Non-Target ItemsAI   | Literacy                | Change                      |
|--------------|---------|---------------------------------|---------------------------------|---------------------------------|-------------------------|-----------------------------|
| Condition    | TopicID | Issue                           | Prop. Sol.                      | Overall                         | Gen. AI                 | Lit.AI Ethics               |
| ExplorableWV |         | 0.02                            | -0.03                           | -0.01                           | 0.11 *glyph[suppress]   | -0.03 0.22 *glyph[suppress] |
|              | Div     | 0.18 ***glyph[suppress]         | 0.22 ***glyph[suppress]         | 0.40 ***glyph[suppress]         | 0.16 ***glyph[suppress] |                             |
|              | Fair    | 0.05                            | 0.08                            | 0.13                            | 0.12 ***glyph[suppress] | 0.12                        |
|              | LLM     | -0.01                           | 0.01                            | 0.00                            | 0.21 ***glyph[suppress] | 0.09                        |
| Basic Ctrl   | WV      | 0.17 ***glyph[suppress]         | -0.14 *glyph[suppress]          | 0.02                            | 0.09 *glyph[suppress]   | 0.11                        |
|              | Div     | 0.24 ***glyph[suppress]         | 0.14 ***glyph[suppress]         | 0.38 ***glyph[suppress]         | 0.06                    | 0.00                        |
|              | Fair    | 0.05                            | 0.18 ***glyph[suppress]         | 0.23 ***glyph[suppress]         | 0.03                    | 0.05                        |
|              | LLM     | 0.14 *glyph[suppress]           | 0.03                            | 0.18 *glyph[suppress]           | 0.08                    | 0.12                        |
| Static       | CtrlWV  | 0.26 ***glyph[suppress]         | -0.04                           | 0.22 *glyph[suppress]           | 0.06                    | 0.14                        |
|              | Div     | 0.16 *glyph[suppress]           | 0.15 *glyph[suppress]           | 0.31 ***glyph[suppress]         | 0.10 *glyph[suppress]   | 0.04                        |
|              | Fair    | 0.10                            | -0.02                           | 0.08                            | 0.10 *glyph[suppress]   | 0.15 *glyph[suppress]       |
|              | LLM     | 0.00                            | 0.01                            | 0.01                            | 0.15 ***glyph[suppress] | 0.20 ***glyph[suppress]     |

Note: ID = Identify the Issue, Prop. Sol. = Propose Solutions, Gen. AI Lit. = General AI Literacy. WV = Worldview, Div = Diversity, Fair = Fairness, Ctrl = Control. Values reflect m ean differences (e.g., Target - Non-Target or Post - Pre). Significance: * p &lt; .05, ** p &lt; .01, *** p ≤ .001

## 4.3 Self-assessed AI L iteracy

Within-subject paired t -tests were conducted to compare preand postintervention self-assessed scores for both general AI literacy and ethical AI literacy. In the Explorable condition, participants reported significant improvements in general AI literacy across all topics. For instance, in the LLM group, the mean self-assessed AI literacy increased from 3 . 56 to 3 . 77 ( mean difference =

0.21, p &lt; 0 . 001), and in Diversity, from 3 . 58 to 3 . 74 ( mean difference = 0.16, p = 0 . 001). Regarding AI ethics, the Explorable condition showed a significant increase in the Diversity group ( mean difference = 0.22, p = 0 . 03), while other topics showed more minor or non-significant changes. In contrast, the Basic Control condition showed significant improvement in general AI literacy only for Worldview ( mean difference = 0.09, p = 0 . 01), and the Static Control condition yielded significant improvements in Diversity ( p = 0 . 02), Fairness ( p = 0 . 01), and LLM ( p = 0 . 003). These findings suggest that interactive experiences enhance participants' confidence in their AI literacy more consistently those who do not receive AI tutorials.

## 4.4 Interactive Engagement P atterns

Analysis of user engagement with the Explorable condition revealed diverse scrolling patterns, indicative o f different learning approaches. For example, Fig. 3a illustrates a consistent, linear progression, suggesting a methodical and sequential reading style. In contrast, Fig. 3b shows an initial rapid scroll-likely to preview content-followed by detailed reading with periods of backtracking and re-reading ov er 18 min, which suggests a more exploratory and reflective approach. Figure 3c depicts another pattern, characterized by frequent, short scroll movements over 22 min, indicating a careful, section-by-section review and active integration of ideas. These varied engagement styles highlight that learners interact with AI literacy content in multiple ways, which has implications for designing more adaptive and effective educational materials.

Fig.glyph[suppress] 3.glyph[suppress] Different user scroll patterns.

<!-- image -->

User interactions within the Explorable condition were further categorized into 'Identify Issue' and 'Propose Solutions' activities. As shown in Fig. 4, partial correlation analyses were conducted between activity counts and score improvements while controlling for time-on-task. Most relationships remained weak or non-significant; however, there were notable exceptions: in the Fairness topic, the number of 'Identify Issue' actions correlated moderately with performance improvement ( r = 0 . 36, p = 0 . 011); in the LLM domain, activity counts correlated with both AI ethics understanding ( r = 0 . 28, p = 0 . 033) and

overall AI literacy ( r = 0 . 45, p = 0 . 001); and in the Worldview topic, 'Propose Solutions' activities correlated with topic-specific improvements ( r = 0 . 32, p = 0 . 024). These findings suggest that while o verall engagement does not uniformly predict learning outcomes, the quality and type of engagement in specific tasks is meaningfully related to performance.

## 5 Discussionglyph[suppress]

## 5.1 Implications for AI Education

Our findings demonstrate that interactive simulations effectively enhance AI literacy, as evidenced by significant within-subject improvements in both objective assessments and self-reported understanding. Participants in the Explorable condition showed notable gains in identifying issues and proposing solutions, particularly within topics such as diversity, fairness, and data representation.

OLS regression analyses indicated that all conditions, including the Static and Basic Controls, yielded some learning gains. Although we did not observe statistically significant differences between conditions, participants in the Explorable condition exhibited stronger patterns of generalization to non-target topics. This suggests that while exposure to AI concepts-such as reading static materials or answering survey questions-can s upport learning, interactive engagement may facilitate broader conceptual transfer and deeper understanding. The Basic Control group's limited generalization further indicates that passive exposure may be insufficient for comprehensive learning.

These results align with active learning theories, particularly the ICAP framework [6], which emphasizes that constructive and interactive engagement

<!-- image -->

ScoreIncrement

Fig.glyph[suppress] 4.glyph[suppress] Correlation: Activity Counts vs Score Increment. Note:glyph[suppress] Abbreviations:glyph[suppress] IDglyph[suppress] =glyph[suppress] Identifyglyph[suppress] Issue,glyph[suppress] PSglyph[suppress] =glyph[suppress] Proposeglyph[suppress] Solution,glyph[suppress] Divglyph[suppress] =glyph[suppress] Diversity,glyph[suppress] Fairglyph[suppress] =glyph[suppress] Fairness,glyph[suppress] WVglyph[suppress] =glyph[suppress] Worldview.glyph[suppress] Greenglyph[suppress] boxesglyph[suppress] indicateglyph[suppress] significantglyph[suppress] correlationsglyph[suppress] (glyph[suppress] pψ ≤ 0 glyph[triangleright] 05 ). (Color figure online)

fosters deeper learning than passive methods. The ability to manipulate parameters, test assumptions, and receive real-time feedback in the Explorable condition likely supported iterative reasoning and reflection, contributing to more durable learning outcomes. However, while the Explorables were generally effective, topic-dependent variations emerged. The LLM topic showed declines, possibly due to the probabilistic and less intuitive nature of language models-unlike Dive rsity and Fairness, which are grounded in more concrete ethical frameworks. These findings suggest that certain AI topics, such as generative models, may require additional scaffolding-such as guided examples or case-based reasoning-to fully support conceptual understanding.

## 5.2 Engagement Analysis and Learning Outcomes

Our analysis of engagement patterns provides key insights into how learners interact with interactive AI education tools. Scrolling behaviors varied widely, reflecting distinct information processing strategies, from linear to exploratory. Surprisingly, no uniformly significant correlation emerged between raw interaction frequency (e.g., scrolling depth, number of interactions) and learning outcomes. This suggests that the mere quantity of engagement does not necessarily translate to better understanding. Instead, the quality of interaction-moments of reflection, problem-solving, and revisiting key sections-may be more critical. These findings call for more sophisticated engagement metrics and suggest that dynamic scaffolding, especially in later sections, may help sustain attention. Future AI education tools should adopt adaptive interfaces to guide more effective engagement.

## 5.3 Design Considerations for Future AI Literacy Tools

The effectiveness of interactive simulations underscores the need for AI education tools that encourage exploration and reflection. However, our findings also suggest that not all interactive experiences are equally beneficial-some AI topics may require additional support to ensure comprehension. A key takeaway is that interactive tools should be adaptable to learners' prior knowledge and engagement styles. Future AI education platforms should incorporate real-time feedback to adjust difficulty levels, suggest additional resources, or prompt users to revisit key concepts based on engagement patterns. Another design consideration is balancing interactivity with clarity, as our findings show that more engagement alone doesn't guarantee learning. Instead, AI literacy tools should foster meaningful engagement through prompts or contextual explanations.

## 5.4 Limitations and Threats to Validity

While this study offers valuable insights, several limitations should be noted. Our self-selected online sample may introduce biases in engagement and prior AI knowledge, underscoring the need for broader participant diversity. Additionally, reliance on quantitative engagement metrics, such as scrolling behavior,

provides an incomplete view of cognitive engagement; future research should incorporate qualitative methods like think-aloud protocols. Finally, our study focused on short-term learning gains, leaving long-term retention and knowledge transfer unexamined. Future work should explore sustained learning effects and the applicability of AI literacy skills in new contexts.

## 6 Conclusionglyph[suppress]

This study provides compelling evidence for the effectiveness of interactive simulations in advancing AI literacy, particularly in fostering conceptual engagement, confidence, and generalization across topics. These simulations foster deeper conceptual engagement and critical analysis by enabling learners to 'think like a scientist' through hypothesis testing, experimentation, and real-time observation of AI behavior. However, our findings also reveal that basic engagement metrics do not reliably predict learning outcomes. This underscores the importance of designing AI education to ols prioritizing meaningful interaction over surface-level interactivity. As AI systems increasingly shape societal decisionmaking, these insights highlight the need for thoughtfully designed educational interventions that equip individuals with the skills to assess and navigate AIdriven technologies critically.

## Referencesglyph[suppress]

1. Alam, A.: A digital game based learning approach for effective curriculum transaction for teaching-learning of artificial intelligence and machine learning. In: 2022 International Conference on Sustainable Computing and Data Communication Systems (ICSCDS), pp. 69-74. IEEE (2022)
2. Anik, A.I., Bunt, A.: Data-centric explanations: explaining training data of machine learning systems to promote transparency. In: Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems, pp. 1-13 (2021)
3. Carney, M., et al.: Teachable machine: approachable web-based tool for exploring machine learning classification. In: Extended abstracts o f the 2020 CHI Conference on Human Factors in Computing Systems, pp. 1-8 (2020)
4. Carolus, A., Koch, M., Straka, S., Latoschik, M.E., Wienrich, C.: Mails -meta AI literacy scale: Development and testing of an AI literacy questionnaire based on well-founded competency models and psychological change- and metacompetencies (2023)
5. Casal-Otero, L., Catala, A., Fern´ andez-Morante, C., Taboada, M., Cebreiro, B., Barro, S.: Ai literacy in k -12: a systematic literature review. Int. J. STEM Educ. 10 (1), 29 (2023)
6. Chi, M.T., Wylie, R.: The ICAP framework: Linking cognitive engagement to active learning outcomes. Educ. Psychol. 49 (4), 219-243 (2014)
7. De Jong, T., Van Joolingen, W.R.: Scientific discovery learning with computer simulations o f conceptual domains. Rev. Educ. Res. 68 (2), 179-201 (1998)
8. De Silva, D., Jayatilleke, S., El-Ayoubi, M., Issadeen, Z., Moraliyage, H., Mills, N.: The human-centred design of a universal module for artificial intelligence literacy in tertiary education institutions. Mach. Learn. Knowl. Extract. 6 (2), 1114-1125 (2024)

9. Dignum, V.: Responsible artificial intelligence: how to develop and use AI in a responsible way, vol. 2156. Springer (2019)
10. Goeser, P.T., Hamza-Lup, F.G., Johnson, W.M., Scharfer, D.: View: A virtual interactiv e web-based learning environment for engineering (2018)
11. Google: Explorables -google pair. https://pair.withgoogle.com/explorables/ (2025). Accessed 22 J an 2025
12. Griffin, P., Care, E.: Assessment and teaching of 21st cen tury skills: Methods and approach. Springer (2014)
13. Hallgren, R.C., Parkhurst, P.E., Monson, C.L., Crewe, N.M.: An interactive, webbased tool for learning anatomic landmarks. Acad. Med. 77 (3), 263-265 (2002)
14. Hidalgo, C.: Agency in AI and education policy: European resolution three on harnessing the potential for AI in and through e ducation. In: International Conference on Artificial Intelligence in Education, pp. 319-327. Springer (2024)
15. Hitron, T., Orlev, Y., Wald, I., Shamir, A., Erel, H., Zuckerman, O.: Can children understand machine learning concepts? the effect of uncovering black boxes. In: Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems, pp. 1-11 (2019)
16. Jatzlau, S., Michaeli, T., Seegerer, S., Romeike, R.: It's not magic after all-machine learning in snap! using reinforcement l earning. In: 2019 IEEE Blocks and Beyond Workshop (B&amp;B), pp. 37-41. IEEE (2019)
17. Kasinidou, M., Kleanthous, S., Orphanou, K., Otterbacher, J.: Educating computer science students about algorithmic fairness, accountability, transparency and ethics. In: Proceedings of the 26th A CMConference on Innovation and Technology in Computer Science Education V. 1., pp. 484-490 (2021)
18. Kaspersen, M.H., Bilstrup, K., Van Mechelen, M., Hjort, A., Bouvin, N.O., Petersen, M.G.: High school students exploring machine learning and its societal implications: Opportunities and challenges. Int. J. Child-Comput. Interact. 34 , 100539 (2022)
19. Kim, H.J., So, H.J., Suh, Y.J.: Examining the impact of flipped learning for developing young job seekers' AI literacy. In: International Conference on Artificial Intelligence in Education, pp. 817-823. Springer (2023)
20. Long, D., Magerko, B.: What is AI literacy? competencies and design considerations. In: Proceedings of the 2020 CHI conference on human factors in computing systems, pp. 1-16 (2020)
21. Mioduser, D., Nachmias, R., Lahav, O., Oren, A.: Web-based learning environments: current pedagogical and tec hnological state. J. Res. Comput. Educ. 33 (1), 55-76 (2000)
22. Newman-Griffis, D.: AI thinking: a framework for rethinking artificial intelligence in practice. Royal Society Open Sci. 12 (1), 241482 (2025)
23. Ng, D., Leung, J., Chu, S., Qiao, M.S.: Conceptualizing AI literacy: an exploratory review. Comput. Educ.: Artif. Intell. 2 , 100041 (2021)
24. Parker, M.J., Seifter, J.L.: An interactive, web-based learning environment for pathoph ysiology. Acad. Med. 76 (5), 550 (2001)
25. Popa, D.M.: Critical exploratory investigation of ai consumption, AI perception and AI literacy requirements. AI perception and A I literacy requirements (November 01, 2024) (2024)
26. Prolific: Prolific - participant recruitment for online research. https://www.prolific. com/ (2025). Accessed 22 J an 2025
27. Raub, M.: Bots, bias and big data: artificial intelligence, algorithmic bias and disparate impact liability in hiring practices. Ark. L. Rev. 71 , 529 (2018)

28. Servais, E.L., LaMorte, W.W., Agarwal, S., Moschetti, W., Mallipattu, S.K., Moulton, S.L.: Teaching surgical decision-making: an interactive, web-based approach. J. Surg. Res. 134 (1), 102-106 (2006)
29. Shved, E., Bumbacher, E., Mejia-Domenzain, P., Kapur, M., K¨ aser, T.: Teaching and measuring multidimensional inquiry skills using interactive simulations. In: International Conference on Artificial Intelligence in Education, pp. 482-496. Springer (2024)
30. Sneirson, M., Chai, J., Howley, I.: A learning approach for increasing AI literacy via xai in informal settings. In: International Conference on Artificial Intelligence in Education, pp. 336-343. Springer (2024)
31. Wan, X., Zhou, X., Ye, Z., Mortensen, C.K., Bai, Z.: Smileycluster: supporting accessible machine learning in k-12 scientific discovery. In: Proceedings of the Interaction Design and Children Conference, pp. 23-35 (2020)