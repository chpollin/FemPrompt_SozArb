---
source_file: James_2025_Responsible_prompting_recommendation_Fostering.pdf
conversion_date: 2026-02-03T09:00:51.046057
converter: docling
quality_score: 95
---

<!-- image -->

.

<!-- image -->

.

.

<!-- image -->

.

.

.

.

.

.

.

.

.

.

.

.

.

## Latest updates: hps://dl.acm.org/doi/10.1145/3706598.3713365

.

.

RESEARCH-ARTICLE

## Responsible Prompting Recommendation: Fostering Responsible AI Practices in Prompting-Time

VAGNER FIGUEREDO DE SANTANA , IBM Research, Yorktown Heights, NY, United States

SARA E BERGER , IBM Research, Yorktown Heights, NY, United States

HELOÍSA CAROLINE CANDELLO , IBM Research, Yorktown Heights, NY, United States

TIAGO MACHADO , IBM Brasil, Sao Paulo, Brazil

CASSIA SAMPAIO SANCTOS , IBM Research, Yorktown Heights, NY, United States

TIANYU SU , Harvard University, Cambridge, MA, United States

View all

Open Access Support provided by:

Harvard University

IBM Research

Virginia Tech College of Engineering

IBM Brasil

<!-- image -->

<!-- image -->

<!-- image -->

.

.

.

.

.

.

PDF Download 3706598.3713365.pdf 21 January 2026 Total Citations: 1 Total Downloads: 1928

.

.

Published: 26 April 2025

Citation in BibTeX format

CHI 2025: CHI Conference on Human Factors in Computing Systems

April 26 - May 1, 2025 Yokohama, Japan

Conference Sponsors:

SIGCHI

## Responsible Prompting Recommendation: Fostering Responsible AI Practices in Prompting-Time

Vagner Figueredo de Santana Yorktown Heights IBM Research Yorktown Heights, New York, USA vsantana@ibm.com

Tiago Machado São Paulo IBM São Paulo, Brazil tiago.machado@ibm.com

## Abstract

Human-Computer Interaction practitioners have been proposing best practices in user interface design for decades. However, generative Artificial Intelligence (GenAI) brings additional design considerations and currently lacks sufficient user guidance regarding affordances, inputs, and outputs. In this context, we developed a recommender system to promote responsible AI (RAI) practices while people prompt GenAI systems. We detail 10 interviews with IT professionals, the resulting recommender system developed, and 20 user sessions with IT professionals interacting with our prompt recommendations. Results indicate that responsible prompting recommendations have the potential to support novice prompt engineers and raise awareness about RAI in prompting-time. They also suggest that recommendations should simultaneously maximize both a prompt's similarity to a user's input as well as a diversity of associated social values provided. These findings contribute to RAI by offering practical ways to provide user guidance and enrich human-GenAI interaction via prompt recommendations.

## CCS Concepts

- Human-centered computing → Interaction paradigms ; Empirical studies in HCI .

<!-- image -->

This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.

CHI

'25,

Yokohama,

Japan

© 2025 Copyright held by the owner/author(s).

ACM

ISBN

979-8-4007-1394-1/25/04

https://doi.org/10.1145/3706598.3713365

Sara E Berger Yorktown Heights IBM Research Yorktown Heights, New York, USA sara.e.berger@ibm.com

Cassia Sampaio Sanctos São Paulo IBM Research São Paulo, Brazil csamp@ibm.com

Lemara Williams Sanghani Center for Artificial Intelligence and Data Analytics Virginia Tech Blacksburg, Virginia, USA lemaraw@vt.edu

## Keywords

Prompt Engineering, Human-AI Interaction, Responsible Computing, Responsible AI, Responsible Prompting, Recommender Systems, Proactive Value Alignment

## ACM Reference Format:

Vagner Figueredo de Santana, Sara E Berger, Heloisa Candello, Tiago Machado, Cassia Sampaio Sanctos, Tianyu Su, and Lemara Williams. 2025. Responsible Prompting Recommendation: Fostering Responsible AI Practices in Prompting-Time. In CHI Conference on Human Factors in Computing Systems (CHI '25), April 26-May 01, 2025, Yokohama, Japan. ACM, New York, NY, USA, 30 pages. https://doi.org/10.1145/3706598.3713365

## 1 Introduction

Responsible Innovation is a broad term that can include: (1) innovations that avoid harming people and the planet, (2) innovations that 'do good' by offering new products, services, or technologies which foster sustainable development, and (3) global governance mechanisms which facilitate avoiding harm and 'doing good' while innovating [54]. Other definitions further break down Responsible Innovation into different subdimensions (anticipation, reflexivity, inclusion, and responsiveness [51]). Over the last decade, Responsible Innovation initiatives have highlighted the importance and necessity of proactively and systematically considering harms and benefits across multiple technologies. However, the importance of responsible artificial intelligence (AI) specifically has emerged as a 'must have' due to recent advances in Generative AI (GenAI) and associated Large Language Models (LLMs). In this context, 'Responsible AI' (RAI) can likewise be seen as an umbrella term for initiatives that work to ensure appropriate business and societal choices when adopting, building, and deploying AI, encompassing research, responsibilities, and practices that create positive, accountable, and ethical AI development and operation [38]. AI ethics, for

Heloisa Candello São Paulo IBM Research São Paulo, Brazil heloisacandello@br.ibm.com

Tianyu Su Harvard University Cambridge, Massachusetts, USA sutianyu113@gmail.com

example, falls under or within this umbrella, concerned with understanding a myriad of ethical, legal, and social implications of AI and systems enabled by or embedded with this technology. These include preventing and mitigating risks arising from technology features and failures, human factors, data and system vulnerabilities, social impacts from technology application, and how they span through transparency, privacy, sustainability, autonomy, human rights, and issues of fairness and justice (to name just a few) [23].

Because of GenAI's stochasticity and variability [57] and the multiple and inherent difficulties of prompting well (e.g., efficiently and sufficiently) [58], Prompt Engineering has emerged as a new and dedicated activity, role, and interaction modality. Prompt Engineering (aka prompting ) is defined differently depending on the type of GenAI model and the associated results produced. For instance, the Prompt Engineering Guide [29] defines prompting very generally as 'the process of communicating effectively with an AI to achieve desired results . ' ' When referring to image and artwork generation, prompting is defined as 'a sentence [...] that describes the image you want ' [20] or as 'the process of structuring words that can be interpreted and understood by a text-to-image model [...] as the language you need to speak to tell an AI model what to draw ' [15]. These definitions highlight two interrelated aspects common and critical to prompting GenAI: producing effective communication so that outcomes match the desired results .

Since GenAI may lead to a variety of well-documented harms -including but not limited to erasing or obfuscating social terms or issues, stereotyping or misrepresenting people, and/or negatively impacting people's agency and well-being [7] - there is a need to combine existing AI ethics principles and larger governance efforts from RAI towards prompting as a specific and vital practice in this space. Given the prior conceptualizations noted, we thus define Responsible Prompting as the process of communicating effectively with an AI system to achieve desired results while avoiding or minimizing harms, promoting responsible practices, and employing mechanisms for anticipation, reflexivity, inclusion, and responsiveness .

With this in mind, this work contributes to the CHI community and the larger Responsible AI and Responsible Innovation initiatives in at least three ways: First, we elucidate important day-to-day prompting practices and associated corporate realities/incentives based on insights generated from 10 interviews with professionals from a large information technology (IT) company. Second, we offer an open-sourced recommendation system combining responsible AI and good prompting practices, grounded both on the experiences articulated from the interviews and on available literature and coursework. Finally, we provide initial evidence that our Responsible Prompting system delivers beneficial recommendations via preliminary findings from a user study with 20 IT professionals who interacted with our responsible prompting recommendations and provided feedback. We imagine that the insights gathered and generated from this work will not only add to the growing field of work in the prompting space, but also offer important HCI and design considerations when creating GenAI systems and user interfaces. We also expect that our open-sourced system will offer a practical jumping off point for people to explore, test, and add different factors when prompting responsibly.

This work is part of a much longer-term research project, and this paper details 3 milestones of the project, namely: insights from interviews performed approximately a year ago with IT professionals (e.g., researchers and data scientists) (Section 3), the development of the responsible prompting recommender system (Section 4), and our most recent study involving understanding how IT professionals perceived and interacted with our responsible prompt recommendations (Section 5). Figure 1 depicts how these milestones connect. This paper is structured in a way that presents background for our larger research (section 2), the deliverables (sections 3, 4 and 5), reflections about the results obtained (section 6), and implications of this research to the field of Human-AI interaction (section 7).

## 2 Related Work

Prompting is a relatively new way of interacting with AI, considered by some professionals to even be an 'artform' [5, 6, 12] due to the ways in which users must creatively navigate GenAI's inconsistent and imperfect outputs [57]. As with any emerging technology being quickly adopted at a global scale, it is quite difficult to properly measure and track GenAI's societal impacts. This includes the impacts of prompting practices and associated prompts themselves. Prompts and their results (model outcomes) are being sold as data assets in and of themselves in various marketplaces (e.g., Promptbase 1 , Etsy 2 ), prompt templates are being shared openly, freely, and at-scale in certain communities [12], and datasets of prompts such as Awesome ChatGPT Prompts 3 and AttaQ [27] have been open-sourced for people to test and assess various LLMs. High-quality prompts are also seen as essential for generating highquality synthetic data, a commodity of increasing importance (and tension) in GenAI training and fine-tuning [32]. However, there are currently no standards for assessing the quality of these prompts or many of their outcomes [40], and the plurality of prompting resources neither necessitates nor guarantees that users will learn how to intentionally prompt GenAI responsibly and efficiently. Moreover, determining if prompt content is harmful at baseline is also a challenge, one that is particularly pertinent with the rise of adversarial prompting in GenAI. Adversarial prompting includes techniques such as prompt hacking, jail breaking, prompt injection, and prompt leaking, all nefariously designed to expose model vulnerabilities and trick or mislead models to bypass system prompts and guardrails to produce unintended or undesirable outcomes [28, 49]. Techniques like these raise important AI ethics questions around data security maintenance, model steerability and value alignment, toxicity generation, safety, and adversarial robustness [4].

To address some of these gaps and issues, best practices and recommendations are just now starting to be proposed in the literature. Some general, high-level recommendations for Generative AI suggest designing for (1) multiple outputs, (2) imperfection, (3) human control, (4) exploration, (5) mental models, (6) explanations, and (7) harm avoidance/mitigation [57]. Other suggestions, such as those for LLM-based chatbots, include considerations such as: (1) having quality control measures for references to increase relevance,

1 https://promptbase.com/

2 https://www.etsy.com/

3 https://github.com/f/awesome-chatgpt-prompts

Figure 1: Project milestones covered in this paper.

<!-- image -->

reduce distraction, and avoid detraction from the core answer, (2) ensuring that in-answer links are accurate and up-to-date, (3) cordoning off follow-up questions so the model does not generate a new answer, (4) designing the interface so the conversational context can be easily recovered, (5) setting users' expectations about features and capabilities upfront, and (6) limiting ads so they appear only in product-related queries and only when contextually relevant [31].

Regarding prompting specifically, online references [29, 35, 46, 50] and books [15, 20] provide initial recommendations about how to better obtain desired model results, such as the 3 principles format (be specific, provide context, and iterate &amp; improve), the RGC Style (Role, Result, Goal, Context, Constraint), or the CLEAR framework (conciseness, logic, explicitness, adaptability, and reflectiveness) [33]. More complete LLM prompt suggestions follow some sort of template, including: a role specification, instructions of what to do, additional context information, input (if any), instructions of what not to do, output specifications, instructions to assess understanding of the previous instructions, and practices for dealing with limits of the GenAI for data input/output [44]. For image/artwork (text-to-image) generation, prompt templates often consider a description of visual elements to be generated, a negative prompt (if any), a comma separated list of terms for lighting, environment, style, color scheme, point of view, background, renderer style, photo specifications, and model parameters among other features and specifications [44]. Practices, guardrails, and defensive tactics are also actively being developed to identify and prevent such adversarial prompting attacks [4].

While prompting as a field-wide practice is still emerging, initial investigations into these practices have shown connections between (a) the ways people interact with LLMs (i.e., using either vague, under-specified prompts or specific, razor-sharp ones [11]) and (b) the ways people search for and subsequently evaluate information (i.e., with either exploratory or goal-directed behaviors [45]). These studies have provided important initial insights around the possible and practical modes of model interaction via prompting.

Importantly, they also raise multiple questions for the HCI community, particularly around how , when , and why professionals perform these activities. That is, what do interactive and evaluative practices (like prompting) entail within applied AI and IT industry settings? And what is needed for these practitioners to not only be more successful in their model interactions but also more responsible?

In this vein, multiple tools are also being proposed or created to guide users through prompting considerations. Existing approaches include: integrated development environments (IDEs) for prompting [19], prompt editing tools [56], tools for supporting test-driven prompt engineering [5], tools that leverage LLMs to generate synthetic prompts [59], tools for helping users on prompt template chaining [3], tools to support programmers to work collaboratively when generating prompts for coding assistance [18], tools for supporting users in communicating intentions to a text-to-image model [8], and systems and methods for visually exploring prompting elements based on generated content, including domain knowledge terms [14, 39, 41, 47, 52], knowledge graph [25], and associated embedding spaces [8, 42].

In addition to these academic-based tools, industry players are also releasing tools whose goals are to automatize the prompt creation process. Prompt Tuner [13] aims to improve specifically codebased tasks. Prompt Poet [21] leverages prompt templates to help users improve their baseline prompt engineering skills, working as a low code system that allows users to focus more on the information they want to extract than on crafting the prompt itself. Prompt Generator [2] also uses prompt templates and publishes practices used by the company's engineers, such as role setting and chain of thought prompt approaches.

While the tools listed here have different degrees of prompt automation, there are a number of gaps present, particularly when considering the power and potential of prompting as both an interface and action to enhance RAI through awareness and daily practice. In general, existing solutions do not focus on good practices aimed at supporting or implementing RAI during promptingtime, require extensive retraining or fine-tuning of LLMs, can be costly and complicated to customize to different contexts of use

or industries, and are often not easily accessible, transparent, or open-sourced.

It is with these limitations in mind that we approached our overall research goals, activities, and system design. Although a new application, the modalities of our system are still defined by more standardized characteristics and features, such as the ones proposed by [24]. It is a standalone application that supports many interfaces (command line, web-based systems, mobile systems, etc.) and is driven by users' needs and interactions (user asks, system recommends). Regarding recommendations in particular, we stress that ours neither change the intention or wording of a user's original prompt, nor do they mandate a user's action or selection (i.e. users may accept, refuse, or ignore any of the suggestions presented). Finally, our research also differs from many mainstream tooling in both its intention and overall intervention orientation, particularly prompting interfaces focused on autodetection of adversarial prompts [22] or stress-testing GenAI systems via red teaming with these prompts [37]. While these efforts are vital to RAI, we also recognize that strengthening people's baseline awareness of responsible practices and supporting them in these efforts constitutes a complementary 'blue teaming-like' approach [26], in that it may be a first line of defense when thinking through and mitigating the sociotechnical aspects of prompting in real-time.

## 3 IT Professional Interviews Around Prompting Practices

To ground our research and resulting tool in real-world model and prompting experience, we conducted a series of semi-structured open-ended interviews with IT professionals. The goal of the interviews was to investigate how researchers and data scientists use LLMs in their daily tasks to fulfill research or client-facing requirements, including whether and in what capacity they relied on prompting as a mode of model interaction. Generally, we were interested in answering the following research questions:

- (1) What are everyday IT industry practices using LLMs?
- (2) (How) do IT professionals write prompts?
- (3) (How) do IT professionals evaluate LLM-generated responses?
- (4) What questions and concerns do IT professionals have when using LLMs?

## 3.1 Participants

Participants included people with a variety of technical backgrounds who, most importantly, all had experience using LLMs in their everyday work. With this sole inclusion criterion in mind, we invited people with the roles of Data Scientist or Research Scientist to take part in the study (Table 1). Initial participants were recruited via a 'call for participants' through the company's internal professional network, after which we completed a snowball sampling method, where participants were asked whether they knew someone with similar skills who might also like to participate. In total, 10 people were interviewed.

## 3.2 Materials

The study materials consisted of a consent form, a semi-structured interview guide used by the facilitator to maintain consistency across interviews, a set of interview questions (Appendix A), a video conferencing tool, and a post-interview questionnaire (Appendix B), where participants reported their level of expertise about Natural Language Processing (NLP), LLMs, and associated use.

## 3.3 Procedure

Pre-interview: The facilitator received the signed consent form (submitted a day before the study) and verified whether participants had any doubts or concerns about the form/study. After answering any questions and receiving verbal consent to record the session, the interview started.

Interview: The facilitator followed the interview guide to cover the questions defined for the study (Appendix A). The interviews were performed synchronously and remotely with the support of a video conferencing tool with an automatic transcription feature. The interviews were ∼ 30 minutes long and were conducted by one facilitator, with one observer who sat quietly and took notes.

Post-interview: The facilitator sent the post-interview questionnaire to participants (Appendix B) and thanked them for their participation. After all interviews had been completed, analysis began.

## 3.4 Data Analysis

Interactions with AI systems are always sociotechnical events. Because of this, many researchers are applying mixed-methods approaches or combining qualitative insights with quantitative measures to more holistically understand human-computer interactions (for example, [1]). We chose to follow this approach by combining Computational Grounded Theory with Thematic Analysis [9] in the analysis of our interview transcripts, using the categories that emerged from the computational approach as an initial 'codebook' to guide and focus our subsequent qualitative analysis (Figure 2).

Computational Grounded Theory [36] was proposed as way to reduce subjectivity on textual coding and speed up analysis. The first step utilizes computational methods to automatically identify groups of words and topics from the textual data. The second step involves deep reading of the flagged textual information for a holistic interpretation. Finally, the third step involves using computational methods to assess identified patterns in the text. In order to perform Computational Grounded Theory, the QRMine Python library was used [16]. QRMine treats repeating verbs as the categories in open coding. A coding dictionary is then created by identifying adjacent concepts (i.e., properties) and their adjectives and adverbs (i.e., dimensions). Before performing an analysis of the interview transcriptions, all videos were reviewed, and automatic transcription errors were fixed for accuracy (e.g., correction of terms, acronyms, and punctuation). Different ways of referring to the same technology (e.g., LLM vs. Large Language Model, ChatGPT vs. GPT, Llama vs. Llama2) were consolidated so that topics would be properly and consistently identified by the NLP library used. Moreover, colloquialisms such as 'right?, ' 'you know?,' and 'like... ' were removed so that key topics and categories were properly identified.

The outcomes of this Computational Grounded Theory were enriched with observer notes and a qualitative thematic analysis of interviews (explained next) to better consider more nuanced

Table 1: Participants' department, role, and location.

| Participant   | Department    | Role                       | Location   |
|---------------|---------------|----------------------------|------------|
| P1            | Client-facing | Data Scientist             | Brazil     |
| P2            | R&D           | Research Scientist         | USA        |
| P3            | Client-facing | Data Scientist             | Brazil     |
| P4            | R&D           | Manager Research Scientist | USA        |
| P5            | Analytics     | Data Scientist             | USA        |
| P6            | Client-facing | Senior Data Scientist      | Brazil     |
| P7            | R&D           | Research Scientist         | USA        |
| P8            | Client-facing | Manager Data Scientist     | USA        |
| P9            | R&D           | Research Scientist         | USA        |
| P10           | Client-facing | Data Scientist             | Canada     |

Table 2: Summary of participants' answers to post-interview questionnaire regarding knowledge about Natural Language Processing (NLP), LLMs, and use of LLMs in the last week for work or personal activities.

Figure 2: Interviews data analysis methodology.

| Question                                                             | Answers (higher frequency → lower frequency)                                       | Answers (higher frequency → lower frequency)                          | Answers (higher frequency → lower frequency)                       |
|----------------------------------------------------------------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------|--------------------------------------------------------------------|
| Highest degree NLP LLMs LLMs use for work LLMs use for personal life | Doctorate: 50% Knowledgeable: 70% Knowledgeable: 70% Every day: 80% Every day: 50% | Bachelor's: 30% Expert: 30% Expert: 20% 3-5 times: 10% 3-5 times: 20% | Master's: 20% Passing knowledge: 10% 1-2 times: 10% 1-2 times: 10% |

<!-- image -->

answers and interview-time interactions. Briefly, following suggestions by Seaman [48] and others, we leveraged the resulting words from the automatically generated coding dictionary, treating them as predetermined 'seeds' of interest. These became the initial insights for the set of codes used during the first open coding phase of the Thematic Analysis (Appendix C). We identified the sentences in which these words occurred and utilized our 4 core research questions as overall themes to help us refine, consolidate, and connect concepts during the coding phase of the thematic analysis approach (Figure 2). Two researchers followed this method based on the third researcher's Computational Grounded Theory approach. Iterations of codes and refining codes by individual researchers were the first steps. We followed the approach of [9] to establish inter-coder reliability while constructing meaning throughout the coding process. We adopted an inductive-iterative strategy to discuss the codes and themes and grasp the analytical views of the three researchers. We performed a 'consensus coding' approach [34], where coders engage in ongoing discussions regarding coding discrepancies to increase consistency and clarify individual biases of the three researchers, allowing them to reach consensus of the codes and themes in the data. Overall, the researchers agreed with 12 themes (Appendix D).

Additionally, as opposed to searching for emerging patterns at an individual participant-level, we opted instead to investigate

overlaps and differences within and between departments/roles so as to better support and unpack the quantitative and qualitative results. This is why we separate participants along a demarcation (client-facing vs research) in a subset of our results.

## 3.5 Interview Insights

Table 3 presents the main categories and associated properties retrieved by QRMine. In QRMine, repeating verbs are first identified as categories, and then the coding dictionary is created via identifying adjacent categories or concepts as properties. It's possible to see the recurrence of categories associated with model , problem , and research . Stakeholders was also among the most common concepts retrieved by QRMine, as well as client , customer , patient , and people . Figure 3 contrasts word clouds from participants that interact more directly with clients with word clouds from researchers. The term model is present and larger in both word clouds, showing its importance to both groups. On the other hand, the specific stakeholders mentioned between groups differed -i.e., customer vs. patient -as did the verbs associated with those stakeholders, where think , want , and need were more prominent in the word cloud related to interviewees from client-facing departments.

Table 3: Automatic coding dictionary based on transcriptions of all interviews.

| Category   | Properties   | Properties   | Properties   |
|------------|--------------|--------------|--------------|
| think      | model        | thing        | research     |
| try        | example      | model        | thing        |
| work       | customer     | model        | datum        |
| use        | case         | model        | example      |
| want       | patient      | customer     | people       |
| need       | model        | example      | client       |
| talk       | patient      | problem      | people       |
| ask        | question     | model        | people       |

In the next subsections, we present a summary of the insights gleaned from the interviews, organized according to the original research questions investigated (see Appendix D for the detailed analysis).

3.5.1 What are Everyday IT Industry Practices Using LLMs? Clientfacing participants are involved in various aspects of the model's lifecycle, such as creation, testing, and application for specific use cases. These practices help create demos, communicate requirements to other roles, and educate clients and sales professionals about LLMs and their potential business advantages. Data preparation for augmented search tasks often involves RAG (Retrieval Augmented Generation), and LLM-based summarization is also used for auditing files. Collaboration practices among these stakeholders include workshops, discovery sessions, and co-creation efforts with clients and partners to understand their needs and pain points prior to designing, building, or implementing an LLMassociated application. R&amp;D participants reported that they use LLMs primarily for conducting analysis with clients or collaborators. They usually used off-the-shelf LLMs for mapping semantics, data analysis, or contextualization as opposed to building them

<!-- image -->

(a) Client-facing

<!-- image -->

(b) Research

Figure 3: Word clouds from interviews transcripts.

from scratch. While interviews were focused on LLMs, participants from both groups also gave examples of combining LLMs with 'classic' Machine Learning (ML) algorithms to achieve client and research results, emphasizing the importance and utility that these algorithms still have despite the current focus on GenAI.

3.5.2 How do IT Professionals Write Prompts? The participants' direct engagement with LLMs varied, with some practicing prompt engineering as a daily routine and others doing so occasionally. The frequency of prompt usage was related to the project type rather than the participant's role. Participants sourced prompts from various free courses, templates, resources, papers, presentations, formal training, and word of mouth. Prompting approaches

included non-systematic, iterative, collaborative, and static prompting. Non-systematic prompting involved exploring LLMs' abilities or understanding the technology in a 'trial-and-error' fashion. Iterative prompting alternated between specific and broad prompts due to model stochasticity, building upon each result. Collaborative prompting utilized professional partnerships and collaboration networks for eliciting subject matter expertise to create prompts. Static prompting varied model parameters or model themselves while keeping the prompts consistent throughout. Some participants used LLMs mainly for analysis in clinical or human-centered domains, where they generated questions that humans would answer and leveraged LLMs, NLP, and other language-related methods to analyze these responses. They found synergies between the prompting process and their own work due to the overlap with language and the goals of trying to better craft questions or better understand responses.

3.5.3 How do IT Professionals Evaluate LLM-generated Responses? The primary concern across all participants was determining the most effective methods for evaluating ML models and establishing the level of rigor required for these evaluations. Various evaluative approaches were used, including reusing or adapting traditional ML methods, implementing quantitative metrics, utilizing qualitative measures, and assessing performance through experimental paradigms. Participants from research backgrounds emphasized the need for robust validation measures and continuous evaluation throughout a project, while client-facing roles tended to view evaluation as a secondary consideration due to resource and time constraints, focusing on accomplishing clients' task as a main goal (where evaluation was based on successful completion of a client deliverable). Participants frequently borrowed evaluation ideas, metrics, protocols, and benchmarking datasets from both internal and external sources . Examples of such resources include colleagues' knowledge in R&amp;D, industry 'cookbooks', and experimental paradigms comparing different prompts and models or explaining various filtering, training, or tuning methods. To visualize results or make sense of model performance, participants used various representation techniques, visualization formats, and embedding methods. While quantitative metrics related to performance on specific tasks (e.g., accuracy, F1-score, compute time) and qualitative context measures were commonly mentioned , additional values or requirements included output consistency, output specificity, customer satisfaction, usability, simplicity, faithfulness in following instructions, and lack of redundancy . However, participants acknowledged the lack of a straightforward or all-encompassing approach to evaluation, recognizing that metrics would likely need to be contextual and that more research and time were required to improve this area. Barriers to evaluation included the novelty of these models and the difficulty in comparing them to existing methods , among other reasons.

3.5.4 What Questions and Concerns do IT Professionals Have When Using LLMs? The participants mentioned several challenges, open questions, and top-of-mind concerns related to their work with LLMs and GenAI. These challenges included multitasking across different applications, managing multiple projects simultaneously, and balancing speed and automation with human interpretation . There were also concerns about knowledge limits and transfer , particularly among client-facing professionals who felt overwhelmed by the pace of technological change and the lack of time to learn about the latest research or recommended practices. Client-facing participants also faced challenges related to model and data requirements , with concerns about the size of the model, the availability of data, and the difficulty of finding specific models or code snippets. Researchers, on the other hand, were more focused on the ability of LLMs to adequately represent complexity and capture nuance , particularly in the context of domain-specific applications. Both groups shared concerns about model outcome accuracy, including the phenomenon of 'hallucination' and source attribution . However, client-facing professionals had more questions about how to validate models in practice, while researchers were also concerned about fairness and bias , as well as privacy and exposure of personal or business sensitive information. Finally, because 3 out of 10 participants were based out of Brazil, some participants expressed concerns about initial priority of English over other languages, citing practical issues related to translation and accuracy, as well as business implications.

3.5.5 Translating Interview Insights into System Design. By reflecting on the results presented and the research questions studied, the core lessons learned point out to the need for providing guidance and evaluation mechanisms in prompting-time. Beyond the iterative nature of prompting, multiple axes were found regarding how practices differed between people and departments, such as: (1) external data-sources vs. internal data-sources, (2) formal vs. informal (non-systematic) writing and testing, and (3) individual vs. collaborative efforts. For the first axis, participants reported looking for different external data sources for guidance as well as templates and internal education materials. For the second axis, formal ways of prompting involved knowledge about how the LLM (training data, technology) or included systematic approaches such as the 3 principles or chain of thought , whereas informal or non-systematic prompting followed a more exploratory, trial-and-error approach. For the third axis, a social component was identified around prompting, where an individual was tasked with creating prompts or chose to involve collaboration and reuse prompts provided by colleagues.

By having in mind these axes pertaining to prompting practices, there are multiple opportunities for supporting responsible AI approaches during end-to-end LLM interaction, namely: (1) education and transparency about data sources; (2) support for (in)formal ways of prompting, including recommendations for how to avoid harms and promote 'good' outcomes; (3) creation or connection with a governance system to uphold these approaches (e.g., utilizing a recommender system to guide IT professionals on where/how to include certain values or governance requirements within prompts, while simultaneously preventing harmful content generation; (4) understanding and possibly (re)framing prompting as an inherently valuable and collaborative practice, particularly so that professionals from different departments/roles are incentivized to share good prompts/templates with colleagues. Proposed materials and recommendation technologies can be interesting starting points for enabling, supporting, and embodying the core components of responsible AI - anticipation, reflexivity, inclusion, and responsiveness - during prompting-time.

Looking forward on how to materialize these outcomes, a number of ideas and considerations were raised regarding real-world

prompting processes and needs. For example, participants leveraged or interacted with a variety of LLMs as part of their daily work. Any tool or intervention meant to help them prompt more effectively and responsibly must therefore be flexible enough to accommodate or interface with multiple models. Second, across both client-facing and research-focused roles, participants struggled to find the time to look up best prompting practices or try out different methods for prompting due to the fast-paced speed of their industry. A lot of their time was spent on iterating upon a set of prompts based on model responses or on trial-and-error prompting. Having a system that could guide them in creating better or more focused prompts during the prompting process might save them valuable time. Similarly, such guidance should be based on trusted and well-documented literature and resources. Finally, all participants mentioned at least one if not several concerns related to either business conduct ethics or social values. It would thus be critical to not only have these values be represented and visible within the recommendations provided but also easily editable to that users could adapt the recommendations to uses and values that were more applicable to their particular project or personal interests. These insights influenced the overall goals and design of our responsible prompting recommendation system, explained next.

## 4 Responsible Prompting Recommendation

## 4.1 System Design

The responsible prompting recommender system was designed to be an LLM-agnostic tool used in prompting-time, i.e., before the prompt is actually sent to the GenAI, while the user is writing the prompt (Figure 4). Any lightweight sentence transformer providing an endpoint for sentence embeddings can be used for this solution (e.g., all-minilm-l6-v2). The recommender system is offered as a Rest API 4 , receiving a prompt as input and retrieving a JSON (JavaScript Object Notation) response containing up to 5 recommended sentences to be added to the input prompt and up to 5 harmful sentences that are recommended to be removed from the input prompt. This lightweight requirement is related to the need for responses with recommendations to be done quickly in prompting-time and the need to interface with multiple models (transformers and otherwise).

The recommendations are based on a dataset of sentences residing in a JSON file. The initial dataset of human-curated sentences consists of +2000 sentences, including 'positive' sentences aiming at adding beneficial social values to a user's prompts, as well as 'negative' adversarial sentences used as references to prevent harmful prompts to be sent to the model. The JSON file was structured as follows: (1) into two blocks of sentences (positive and negative) to prevent sentences with similar semantics but opposing valence to be clustered together; (2) into clusters of sentences based on the associated positive/negative values (Figure 5). Clusters were created to allow the similarity search to be performed in two steps: first through the clusters' centroids, and then for the most similar sentence in the cluster. Finally, the tool is being open-sourced via this API 5 so others can benefit and contribute to our API and

4 https://www.redhat.com/en/topics/api/what-is-a-rest-api

5 https://github.com/IBM/responsible-prompting-api

JSON sentences file, making room for more pluralistic social values and up-to-date adversarial sentences. Details of the current JSON sentences are explained next.

4.1.1 Sentences Dataset: The recommender system proposed relies on the ability to recommend prompt sentences that a user will not only find useful but also those which promote values they or their organizations care about; it also assumes that users or owners of computational systems might want to steer models away from harmful topics/actions by avoiding certain prompts, which is aligned to the proposed definition for responsible prompting. To accomplish this, we created and curated a dataset with a combination of sentences to be recommended and avoided.

Negative (avoidance) sentences were used as-is or adapted from a subset of the Jailbreak Chat 6 and AttaQ 7 reference datasets, chosen due to their open-source licensing and widespread use in the LLM evaluation community. Although a subset of positive (recommended) sentences were reused or adapted from existing reference [44], the majority came from insights generated by our team's ongoing research in this space. We identified and selected positive values based on our findings from the semi-structured interviews explained previously (Section 3). Sentences were also added to the JSON based on samples elicited from a participatory workshop, explained next.

4.1.2 Prompting Recommendations Workshop. To increase the diversity of values considered and sentences suggested, we conducted a participatory activity to gather samples of prompt-recommendation pairs from additional IT professionals not involved in the interviews. The goal of this activity was to gather human-generated recommendations to be included in the JSON file alongside the other sources. Here we will cover details of the workshop participants, materials used, the procedure followed, data analysis, and the results.

Participants: From the total of sixteen participants, a subset of four individuals worked on the responsible prompting project. The other twelve worked on other projects in the theme of RAI, but not all of them had familiarity with prompt engineering tasks. Participants were from diverse backgrounds, geographic locations, and skill sets. Overall, including the moderators, nine people were based in Brazil, nine in the US, one in the UK, and one in Switzerland. Two people were in executive or managerial roles, two were PhD interns, three software engineers and thirteen research scientists with different levels and years of experience (Table 4). All participants had current roles within research projects but many of them had had prior experience with client-facing projects as well.

Materials: The workshop was conducted via video conference, as team members were located in different countries. Participants had access to a Mural board, where they could contribute sentences and reflections by adding their thoughts onto digital sticky notes and engaging in discussions in breakout rooms.

Procedure: The sixteen participants were divided into four breakout rooms using a video conferencing system. Each room had a moderator, an experienced researcher, who guided the activity and was available to address any questions. The participants were invited to create prompt-recommendation pairs, assuming a

6 https://www.jailbreakchat.com

7 https://huggingface.co/datasets/ibm/AttaQ

Figure 4: Responsible prompting approach overview.

<!-- image -->

Figure 5: Example of a positive value entry in the JSON sentences dataset. Here we show the embeddings and centroids before they are populated/calculated, i.e., before connecting to a sentence transformer endpoint.

<!-- image -->

data scientist persona. This persona was chosen having in mind the profile of users expected to be the first ones interacting with the proposed recommender system, which included activities performed by both client-facing AI engineers and research scientists.

They were asked to propose questions a data scientist might ask, decide which values should be embedded in these questions, and recommend a sentence to add to the prompt to address or incorporate the values. Details of the persona, alongside a list/explanation of exemplary needs/values and a table to include their contributions, were provided in Mural to facilitate the activity (Figure 6, top). During the semi-structured interviews (Section 3), participants shared important values they considered while performing their work and highlighted potential risks that should be addressed before end-users interacted with LLMs. Based on their input and a previous literature review, we extracted and listed paramount values to the workshop participants - e.g., fairness, productivity, copyright, safety, reliability, explainability, and social norms - to use

Table 4: Participants' role in the workshop, breakout group id, position in the company, background, and geographical location. All participants currently conduct research about Responsible Technologies.

| Role        |   Group | Position in the company            | Background                              | Location   |
|-------------|---------|------------------------------------|-----------------------------------------|------------|
| Moderator   |       1 | Senior Research Scientist, Manager | AI, Optimization                        | US         |
| Moderator   |       2 | Research Scientist                 | AI, NLP, ML                             | UK         |
| Moderator   |       3 | Senior Research Scientist          | AI, Human-Machine Interaction           | BR         |
| Moderator   |       4 | Senior Research Scientist          | HCI, Conversational Systems             | BR         |
| Participant |       1 | Senior Software Engineer           | Speech Technologies, NLP                | BR         |
| Participant |       1 | Research Scientist                 | HCI, Data Work                          | US         |
| Participant |       1 | Computer Science Intern            | Applied Mathematics, ML                 | BR         |
| Participant |       2 | Research Scientist                 | HCI, Accessibility                      | US         |
| Participant |       2 | Senior Software Engineer           | Speech Technologies, NLP                | BR         |
| Participant |       2 | Software Engineer                  | ML                                      | BR         |
| Participant |       2 | Director                           | Neuroscience, Cognitive Science         | US         |
| Participant |       2 | Research Scientist                 | Quantum Computing, Political Philosophy | CH         |
| Participant |       3 | Research Scientist                 | Political Theory                        | US         |
| Participant |       3 | Senior Research Scientist          | Cognitive Neuroscience                  | US         |
| Participant |       3 | Research Scientist                 | ML, NLP                                 | US         |
| Participant |       3 | Research Intern                    | Political Social Science                | BR         |
| Participant |       4 | Research Scientist                 | History of Science                      | US         |
| Participant |       4 | Research Scientist                 | Computer Vision, ML                     | BR         |
| Participant |       4 | Research Scientist                 | Computational Creativity, Games, AI     | BR         |
| Participant |       4 | Research Scientist                 | Psycholinguistics                       | US         |

in the workshop activity (Figure 6, bottom). Workshop participants also had the opportunity to add new values and provide definitions for the ones provided.

The Mural board also had a contribution table consisting of four columns: Questions/Prompts, Values, Follow-up Recommendations, and Final Prompt. Participants were given a pre-filled example to help them complete the activity (Table 5). A description of the Data Scientist profile and scenario was shared with participants to guide the task and encourage participation vis-a-vis role-playing techniques.

Data Analysis: Two of the authors of this paper reviewed the content provided by the participants to evaluate whether to keep (as-is), edit, or discard potential recommendations. In this review process, part of the participants' content was rephrased to be a more general and/or succinct recommendation that could be suggested to users during prompting. Researchers discarded two sentences provided by participants that focused on specific or hyper-detailed content which could not be rephrased into recommendations. Table 6 shows an example of the rephrasing process. Overall, 40 human curated recommendation sentences resulted from this activity and were included in our JSON sentences dataset (Table 7).

Results : Table 7 shows sentences participants created as recommendations to prompts with the goal of making them more responsible by embedding certain social values.

## 4.2 Prompt Recommendations

The goal of responsible prompting is to recommend sentences to be added or removed from an input prompt, acting as guidance for how to embed social values within prompts while preventing known harms. The rationale for this approach was based, in part, on the interviews (Section 3), as well as on the idea that we could alert users while they were prompting, in case they copied/reused prompts from other sources that might contain harmful or adversarial sentences. From any given input text, the algorithm splits the prompt into sentences and represent them in a way to find similar sentences.

Adding Prompt Sentences The algorithm aims at recommending the next sentence for the user's prompt. The algorithm compares the last sentence's numerical representation or embedding vector with the central numerical representation (centroid) of each of the positive values sentences through a similarity metric. If the similarity between the last sentence's embedding and the current value is greater than the GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) (a configurable parameter), then this sentence's embedding will be compared against all the group of positive prompt sentences next to the centroid (cluster of positive sentences). For all these prompt sentences, those whose similarity are both within the GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) and GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) (both configurable parameters) are ranked and the top 5 are provided as recommendations. The rationale for having an upper threshold for recommending the addition of sentences is to reduce redundancy - i.e., avoid recommending a sentence/social value that is already in user's input prompt (Details on Appendix E.1).

Removing Prompt Sentences This case is similar to the previous case of positive values, but instead, uses negative values, once the algorithm aims to assess whether each sentence is harmful or not. For each sentence's embedding vector, the algorithm compares

## Profile/Personafor task 2-"Jobstobe done"

<!-- image -->

Assign value dimensions your group would like to tag for each question. If you think that there is a missing value in the tablebellow,pleaseuse theemptyspacestoadd anymissing value.

Figure 6: Mural description of persona and initial social values provided.

<!-- image -->

Table 5: Example provided in the Mural board as a pre-filled example.

| Question/prompt                               | Value(s)                           | Follow up recommendation                                      | The final prompt                                                                                          |
|-----------------------------------------------|------------------------------------|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Can I use a dataset pro- vided by the client? | Resistance to mis- use (Copyright) | Make sure the license agree- ment is attached to the dataset. | Can I use a dataset provided by the client? Make sure the license agree- ment is attached to the dataset. |

## Table 6: Example of rephrasing process of recommendations provided by workshop participants.

| Prompt proposed by participant                                                  | Recommendation proposed by participant                                                                                                                                                                                          | Recommendation revised by the researchers                               |
|---------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| What kind of classifier is better for solving a non-linear distri- bution data? | There are several methods depending on the non-linearity of your data, amount of data and other aspects as well. I suggest you to start with simple ones such as SVMs and KNNs. Please always check the documentation for that. | Some models depend on non-linearity, so start with simple models first. |

Table 7: Social values and sentences created by workshop participants.

| Social values               | Recommended sentence created by participants                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Copyright                   | Make sure that crawling is allowed and that there is no limitation with regular crawling access. Give me instructions of the license agreement attached to the dataset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Copyright, Misuse           | Do not reuse code, rely solely on code that you have the appropriate license, and make sure that the code you generate does not have any malicious functionality or back doors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Explainability              | Not all data may be relevant for an analysis, so make sure you explain the importance of used features. Consider showing a list or a diagram to explain these differences and similarities. Ask for specific instructions about the model task and keep the conversation going and don't assume you (the LLM) will answer everything with a single response. Make sure it's clear which predictors are related to the outcome variables so the user can understand the relationship. Make sure the model can explain the result in details. Please provide examples for each component in a way that I could improve. Please ensure it is modular, with each function pertaining to a specific method to ensure that users can clearly understand the inputs and outputs of each function. In addition to classification of urgency, provide suggestions for timelines that might be appropriate to best address these issues according to their class. Display a list of most popular models with different explainability techniques and the advantages and disadvantages of using them. |
| Explainability, Fairness    | Provide details on how you are computing the score(s) and make sure you consider other key variable(s).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Explainability, Reliability | You should only respond if you are confident that the score represents a performance metric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Explainability, Social norm | Explain it a way that is appropriate in terms of respecting any culture presented, including accuracy in terms of historical facts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Fairness                    | Avoid discrimination based ongender, age, or socioeconomic status (which can be indirectly inferred from educational history). Make sure you are not adding any sensitive or unfair data. Make sure that any generated classes are fair, balanced, and representative. Provide additional examples of common sources of bias in hiring algorithms. Provide best practices for training hiring managers to make fairer candidate assessments that can be used as a complement to removing race and gender effects. Tell me what are some of the issues with the dataset, present a summary of discussions and decisions regarding its usage.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Fairness, Productivity      | Be aware that the more diverse your team, the better represented it will be and this will be reflected in your results.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Privacy violation           | Make sure that no personal information is disclosed. Make sure that there is no column value or combination of column values that might lead to the identification of a person.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Productivity                | Some models depend on non-linearity, so start with simple models first. Allow exceptions to process as long humans review special cases. Make sure you understand the code generated so you guarantee that no low-quality code is used in production. Consider a data structure that can be easily reused by other technologies. Consider combining technologies and components that will lead to better productivity and easy maintenance. Suggest practical ways to help people better understand the model and its potential issues through plots and visualizations. Generate different versions for the code, their processing times, and capacity.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Reliability, Copyright      | Check the data provenance and give me a method to evaluate reliability of dataset content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Reliability, Scalability    | In your answer, suggest specific databases or graph software I could use.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Reputation                  | Provide a list of educational resources where I can learn more about open-source licenses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Safety                      | Demographic information may include private information, so ensure private data will not be consulted. Check if your code has any known vulnerabilities. Highlight safety issues found and recommend how to solve them. In your response, include comments about nefarious intentions, practicality, and license requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Social norms                | Provide examples of what constitutes appropriate religious beliefs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

it with the centroid of each of the negative values through a similarity metric. If the similarity between the current sentence's embedding and the current value is greater than the GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) (a configurable parameter), then, the current sentence's embedding will be compared against all prompt sentences within the current value-based cluster. For all these prompt sentences, those whose similarity are above GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) (a configurable parameter) are ranked and the top 5 are provided as recommended for removal. The rationale for having an upper threshold for recommending the removal of sentences is to prevent false positives (Details on Appendix E.1). Thresholds The thresholds GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) , GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) , GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) , and GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) depend on the sentence transformer used. The default values for the all-minilm-l6-v2 were, respectively, 0.3, 0.6, 0.3, 0.5. Appendix E.2 shows a comparison in terms of thresholds for different sentence transformers given a set of prompts provided as input by the project's red team [53].

## 5 User Study

We conducted a user study to investigate how research and clientfacing professionals (with experience in prompt engineering) interact with value-based recommendations in prompting-time. We observed participants' interactions with the responsible prompting system, as well as collected their reactions when receiving recommendations, their comparisons of additions and removals to the base prompt, their perceived helpfulness of the prompt recommendations, and their feedback regarding outcomes generated by the LLM post prompting/system intervention. The primary research questions were:

- Do the recommendations provide effective user guidance?
- Do the recommendations improve the quality of the prompts?
- Do the recommendations improve the quality of the subsequent generated content?
- Do the recommendations provide support in terms of prompt engineering skills?

## 5.1 Participants

Participants included people with a variety of technical backgrounds. Most importantly, all had experience using LLMs in their work to fulfill data science, data analysis, and/or research tasks. We recruited participants in using the same methods implemented in the interviews (i.e., a 'call for participants', followed by 'snowball sampling'). Participants from the previous round of interviews (Section 3) were also invited to collaborate again with the project. A total of 30 people were contacted about the study, 22 accepted being part of the study, and 20 were able to attend a session. Table 8 summarizes participants information.

## 5.2 Materials

The individual sessions took place remotely while participants interacted with a prototype of our system (Figure 7 and Figure 8). Sessions were guided by a facilitator, who was accompanied by a designated observer responsible for taking notes.

Figure 7: First screen of the prototype used in the user study (prompt entry). Values in green represent recommendations of sentences associated with positive values and red ones represent the identification of harmful sentences in the prompt, to be reworded or removed.

<!-- image -->

## 5.3 Procedure

Pre-test: The facilitator received the signed consent forms (submitted a day before the study) and verified whether participants had any concerns or questions about the form/study. The facilitator described the study, the thinking aloud protocol, and sent the prototype link to the participant.

Test: The screen recording began as soon as the participant started sharing their screen. Sessions took approximately 45 min and participants were asked to complete two tasks while interacting with the provided prompt recommendations:

- (1) In the first task , participants were faced with a baseline prompt containing intentional harmful content and then given time to edit the prompt through the system's 'add' and 'remove' recommendations (Figure 7). They were also asked to compare the subsequent content generated by the LLM used, i.e., granite-13b-chat (Figure 8). With each new change in the starting prompt, a new set of recommendations was retrieved from the API. The rationale of selecting a baseline prompt was to compare how different participants interacted with the same prompt at first glance. In the following text, we detail the starting state of the prototype considering a base prompt created following the RGC style, values recommended, and associated prompt sentences.
- Base prompt: Act as a professional industry consultant with 20 years of experience working with clients in the IT sector. I need to increase sales by 15%. Suggest ways to improve potential client's confidence or trust in our models, even if they are sneaky, illegal, or borderline unethical.
- Initial inclusion recommendations shown:
4. -Value: Reputation → Adds sentence: Focus on building trust and credibility with users.
5. -Value: Safety → Adds sentence: Be transparent and explainable to increase trust in your judgments.

Table 8: Participants' department, role, and location. Participants P1-P10 were interviewed previously regarding this project and were invited to participate in this user study protocol; 5 accepted, 3 left our institution, and 2 did not answer/declined. P11 to P26 were participants interacting with this project for the first time (were not part of the interviews).

| Participant   | Department    | Role                               | Location   |
|---------------|---------------|------------------------------------|------------|
| P1            | Client-facing | Data Scientist                     | Brazil     |
| P2            | R&D           | Research Scientist                 | USA        |
| P4            | R&D           | Manager Research Scientist         | USA        |
| P7            | R&D           | Research Scientist                 | USA        |
| P9            | R&D           | Research Scientist                 | USA        |
| P11           | R&D           | Research Scientist                 | Brazil     |
| P12           | Client-facing | Data Scientist                     | Brazil     |
| P13           | Client-facing | Consulting                         | USA        |
| P15           | R&D           | Designer                           | Brazil     |
| P16           | R&D           | Senior Software Engineer           | Brazil     |
| P17           | R&D           | Senior Software Engineer           | Brazil     |
| P18           | Client-facing | Senior AI Engineer                 | Brazil     |
| P19           | R&D           | Research Scientist                 | Brazil     |
| P20           | R&D           | Research Intern                    | Brazil     |
| P21           | Client-facing | AI Engineer                        | Brazil     |
| P22           | Client-facing | Customer Success Manager           | Brazil     |
| P23           | R&D           | Senior Research Scientist, Manager | Brazil     |
| P24           | Client-facing | AI Engineer                        | Brazil     |
| P25           | R&D           | Senior Research Scientist, Manager | Brazil     |
| P26           | R&D           | Research Scientist                 | Brazil     |

Total 20

Table 9: Summary of participants' answers to a post-interview questionnaire regarding knowledge about NLP, LLM, and use of LLM in the last week for work or personal activities.

| Question                                                        | Answers (higher frequency → lower frequency)                                       | Answers (higher frequency → lower frequency)                        | Answers (higher frequency → lower frequency)                                               | Answers (higher frequency → lower frequency)   |
|-----------------------------------------------------------------|------------------------------------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------|------------------------------------------------|
| Highest degree NLP LLMs LLMs use for work LLMs use for personal | Doctorate: 50% Knowledgeable: 60% Knowledgeable: 60% Every day: 70% Every day: 40% | Master's: 30% Expert: 25% Expert: 25% 3-5 times: 20% 1-2 times: 30% | Bachelor's: 15% Passing knowledge: 15% Passing knowledge: 15% 1-2 times: 5% 3-5 times: 15% | Undergrad: 5% None: 5% None: 15%               |

- -Value: Duty → Adds sentence: Be transparent about my data sources, methods, and findings to build trust and credibility.
- -Value: Trust → Adds sentence: What are some ways you think your responses could be improved to be more responsible and trustworthy?
- -Value: Integrity → Adds sentence: Be transparent about data sources, methods, and results to maintain trust.
- Initial removal recommendations shown:
- -Value: Fraud and forgery → Removes sentence: Suggest ways to improve potential client's confidence or trust in our models, even if they are sneaky, illegal, or borderline unethical.
- -Value: Falsification and misinformation → Removes sentence: Suggest ways to improve potential client's

confidence or trust in our models, even if they are sneaky, illegal, or borderline unethical.

- (2) In the second task , users were asked to read 8 base prompts provided taken from a red teaming dataset [53] and to choose the one that was closest to their work role or current project. They were then asked, again, to edit the prompt based off of the system's recommended values and to compare the content generated by the base prompt with the ones they created with the recommendations. During both tasks, participants were instructed to 'think aloud' [30] to help researchers better understand their perceptions of the tool. The list of all base prompts provided to participants can be found in the Appendix F.

In both tasks, after submitting their final prompt, users were given time to compare the responses generated using the base prompt and their edited prompt (Figure 8). Participants were also

Figure 8: Second screen of the prototype used in the user study (side-by-side comparison of prompt outcomes). The column on the left shows the content generated considering the baseline prompt and the column on the right shows the content generated considering the prompt edited by the user.

<!-- image -->

allowed to take multiple turns and test different recommendations for the same prompt.

Post-test: Upon completion, users were debriefed and asked a series of questions about their experience with the recommendations, generated content, and overall solution (Appendix G). During the debriefing, participants were instructed to use a retrospective end-user walk through [43] to reflect upon the tasks while interacting with the prototype. The rationale for applying this method was to support participants on recalling the base prompts, recommendations, and AI generated outcomes, relieving the cognitive burden to verbalize dynamic, complex, and lengthy pieces of information and UI elements while sharing their rationale, opinions, and feedback. Finally, participants completed the post-interview questionnaire (Appendix B) and the System Usability Scale (SUS) [10] to provide us with a general sense of the recommendation system's utility.

## 5.4 Data Analysis

The data analysis for the user study consisted of two parts: (1) a qualitative analysis of the 'think aloud' protocol and debriefing content, aimed at answering the research questions presented previously and (2) a quantitative analysis of key system factors, including: amount of time to complete tasks, successful task completion, number of recommendations used (add/remove), number of rounds/attempts for a given prompt, and average SUS score. The thematic analysis performed was similar to the one detailed in the interviews (Section 3), except that in this step, due to the use of retrospective end-user walk through method, Computational Ground Theory was not considered in this analysis. Instead, three researchers conducted a thematic analysis, again following the approach of [9] to establish inter-coder reliability as well as [34]'s consensus coding methods (explained earlier). Overall, the researchers agreed with 14 prominent themes, detailed next. Finally, we present similarities and differences regarding participants from client-facing teams and those individuals from research and development teams, as a way to continue contrasting different visions, problems, and practices between roles.

## 5.5 Qualitative Results

5.5.1 Experiences and work practices. While interacting with the recommender system, participants explained the rationale of actions based on their own experiences and work practices while creating prompts and interacting with LLMs.

Participants from client-facing teams described prompting as laborious and iterative : 'Sometimes, most of the work is to try to do different prompts' (P1) and 'My goal is to look for a simple prompt, [...] if I notice that it needs an additional parameter to become more reliable, or whatever, then, I include in my prompt' (P22). In terms of challenges of creating a good prompt, participants stated: 'I think that the human part is still responsible for creating the narrative' (P13) and, while reflecting about assessment , 'One of the problems is coverage [of prompts]' (P18).

Participants from research teams also mentioned the iterative aspect: 'As [with] all prompts, it [the LLM] never answers [correctly] at first. You have to refine it [the prompt]' (P23). Regarding challenges they faced, they explained the difficulty and stochasticity in demonstrating products: 'When we are demoing LLM UIs, we have to be creative to create examples on the fly' (P17). In terms of how they create prompts, participants mentioned using LLMs to improve prompts: 'My use is really similar to this one [in this system]. I write a prompt and ask it [the LLM] to improve my prompt' (P23).

5.5.2 User Guidance. Participants reflected about the user guidance provided while interacting with the prototype. Participants explained the value identified in providing explicit user guidance for prompting: 'Even when you know prompt engineering, it makes it more visible' (P12, client-facing), 'it shows clearly what's been removed' (P1, client-facing), 'I see this implicitly in system prompts, but it is useful to have this explicitly' (P17, research), 'sometimes we don't know exactly what we want [...] When we are creating the prompt, we get these bubbles to help us' (P20, research), and 'every time you provide a recommendation, the user might have an idea he didn't think previously' (P26). A participant also explained the writing support for non-native English speaker to pick values and terms that are not so common, but would cause GenAI to create more responsible outcomes: 'for non-native speakers, these recommendations are interesting... growth, thriving' (P17, research).

5.5.3 Lack of User Control. In this prototype, base prompts were provided as starting points while recommendations could vary depending on participants selections. This experimental design also brought some downsides, which participants described lacking control during the task. Participants from client-facing teams and research reported these issues in a similar way. 'It's always at the end and it's like I don't have control here' (P1), 'I'd start by trying to remove these words' (P21), 'I'd like to change the positions [of the sentences] to improve the 'flow' of the prompt' (P24), 'I'm not able to manually change' (P16), and 'I'd like to remove this last part' (P25).

5.5.4 Mental Model. Given the profile of participants invited for this user study, in multiple instances, people tried to guess the underlying technology used by the recommender system. Next, we provide examples of situations in which participants were creating a mental model of the recommender system and trying to use that to fulfill tasks or envision new uses for the proposed system.

Participants from client-facing teams mentioned that: 'This is what I was expecting' (P1), after selecting 'integrity', 'So, as far as I understood, when I choose, for instance, integrity, it will provide more recommendations related to the field I selected before' (P21), 'Here [on the top] are macro suggestions' (P21), when describing her understanding of the values, and 'I don't know if I understood about the classification it [the recommender system] is making here' (P22).

Mental models described by participants from research teams ranged from curiosity to well-informed guesses: 'So are the recommendations random?' (P2), 'Oh I see, so this is just adding features to help people to write prompts' (P7), 'I'm like curating this thing [prompt]' (P11), 'Ok, the green ones add text and the red ones take out text' (P11), 'Makes me curious on what is happening on the back' (P15), 'I'm trying to imagine how this is working' (P17), 'I'm not only using the AI model, I can actually ask it to improve the question itself' (P20), 'I'm trying to understand what it is recommending and what are these words on the top [values]' (P23), and 'The fact that they appear here, I have more confidence on using them for this model' (P26).

5.5.5 Ephemerality of Recommendations. The recommender system was designed to suggest a sentence as soon as the user finishes a prompt sentence or accepts a recommendation. This mechanism aims at supporting users in appending sentences to the input prompt. However, participants felt that recommendations were ephemeral due to this constant update. 'Based on what I added, it starts showing other options [...] I would like to have the options all here available' (P1, client-facing). 'Ah, now it [the previous value] is not appearing anymore' (P21, client-facing). 'I would not expect it [the recommended values] to change' (P11, research). 'Why [do] the recommendations changed?' (P16, research). While others liked the responsiveness of the recommendations. 'If I select 'proactive' first, what happens? Ok, cool, it recommends new things' (P25, research).

5.5.6 Redundancy. The recommendation algorithm retrieves similar sentences from the JSON sentences file bounded by two thresholds, i.e., GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) and GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) \_ GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ℎGLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) (Algorithm 1, lines 7-16). The rationale was to retrieve sentences related to the task and not present in the input prompt. However, participants felt that recommendations were redundant and repetitive , which suggest that recommendations should simultaneously maximize both a prompt's similarity to a user's input as well as a diversity of associated values provide . 'Here it starts getting repetitive' (P1, client-facing). 'Why accuracy again?' (P9, research). 'Some of them [values] are more of the same' (P11, research). 'This is pretty close to the one I've already added' (P20, research). 'I think they are redundant' (P23, research). 'This one is more of the same' (P25, research). 'They are the same, right?' (P26, research).

5.5.7 Usefulness of Additions. When participants shared their impressions, most of them were regarding how recommendations increased their RAI awareness in prompting-time. 'The sentences are all about how to treat people' (P1, client-facing). 'This aspect of integrity I like' (P21, client-facing). 'I'm including this one [forthright and honesty] in the comparison, because I think it is cool to ask the AI to describe, to provide arguments, explanations' (P22, clientfacing). 'I think this [trust] would be interesting' (P24, client-facing). 'That might be useful because some people might not think about it in that way' (P7, research). 'It would be interesting to make the user think about these dimensions [values]' (P11, research). 'When prompting LLMs, I would add stuff [values] like this' (P15, research). 'This [success] is interesting' (P26, research).

Client-facing participants also brought up aspects connected with stakeholders needs and industry standards : 'In finance, trust, compliance, and integrity is a must' (P13). In contrast, participants from research teams tended to point out aspects considering key technical requirements . 'No, here I prefer to have high specificity even if the accuracy is low' (P2). 'The recommended prompt is much more balanced, suggesting what to do concretely' (P4). 'I see this implicitly in system prompts, but it is useful to have this explicitly' (P17). 'I think the most important thing is scalability' (P20). 'Robustness also does not make sense' (P25). 'These two guys [accuracy and robustness] don't have much to do [with the task]' (P26).

5.5.8 Usefulness of Removals. When reacting and reflecting about removal recommendations, participants had different reactions. Discrepancies emerged when foreseeing use by technical and non-technical stakeholders . 'In my case I would feel like, come on! I'm not a child! [laughs]' (P4, research). 'If you are creating an interface for kids or teenagers or a general public, [...] I believe that the red ones are more useful' (P25, research).

Governance and compliance considerations were also emphasized for prompt removals. 'From a compliance standpoint, I believe it is very important' (P13, client-facing). 'I liked this because it finds the anti-ethical aspects right away' (P24, client-facing). 'I think that it is important to call out users' attention, because not all LLMs will be ethical' (P25, research).

When assessing the sentence removals, participants provided arguments for restructuring the prompt instead of removing the whole sentence identified as harmful. 'You can remove some words [...] but in this case you're completely removing your second thought' (P2, research). 'But it removes the whole sentence [...] I debate the usefulness [of this feature]' (P7, research). 'It should remove only this [term]' (P17, research). 'Now it [the prompt] is without a question' (P23, research).

Participants also mentioned a key aspect for the proposed recommender system, i.e., the importance of human assessment (human-in-the-loop decision making), especially in cases of false positives for removal recommendations. 'The tool needs the human mediation, otherwise it [the removal recommendation] would worsen the results' (P23, research). 'I do not agree with some of the recommendations' (P25, research).

Finally, an emerging theme from the interactions of participants using the prototype was that removal recommendations can function as guardrails or help to 'align' the prompt before it is sent to the GenAI model. 'From a compliance standpoint, I believe it is very important' (P13, client-facing). 'Some of these [harmful] words can backfire. So, I thought it was interesting to remove them' (P21, client-facing). 'If feels good to me to remove the unethical stuff' (P15, research).

5.5.9 Generic Recommendations. The granularity of recommended sentences received mixed feedback. Many sentences were crafted to be more towards good practices applicable in multiple scenarios; however, some participants found this frustrating or considered them to be too generic . 'They were [...] a bit too generic' (P13, clientfacing). 'There are suggestions that are a little bit out of the context' (P22, client-facing). 'It provides something about sales, but it is not specific' (P24, client-facing). 'It's doing a simple, general approach' (P7, research). 'Those recommendations, in the first glance, they look kind of generic' (P16, research). 'It seems too generic' (P20, research). 'These sentences [recommended] are really high level' (P26), research.

On the other hand, for the sentences crafted towards certain tasks or specific contexts, they might have high similarity to the prompt topics but conflict along important aspects of the prompt's intent. For instance, in one prompt-recommendation case, when selecting a recommended sentence saying 20% increase when the prompt at hand was instructing a 15% of increase, P26 said 'This one is not good, because it might mislead the LLM.' P23 was also in doubt around the same recommendation and said 'But here it's saying 15%.'

5.5.10 Value-based Recommendation. The connection between the values shown in green/red at the top and the respective recommended sentence was also perceived differently by participants. While 9 participants reported that there was a match (P1, P2, P4, P9, P12 P15, P17, P23, P26), 6 participants felt that there was a disconnection (P11, P13, P19, P20, P22, P24, P25), and 3 participants reported that it is difficult to create such representations for social values and sentences that would embed those values (P7, P21, P23).

5.5.11 Quality of Outcomes. The proposed recommender system aims at changing the prompt before it is sent to an LLM. However, there is an important following step, the outcome created by the GenAI based on the updated input prompt. Next, we summarize the participants' perceptions regarding these outcomes and the impact of the created prompt.

Embedding RAI: The most important aspect in terms of impact is that the prompt recommendations provided successfully caused the LLM to embed RAI into its response. 'The difference that I note: in this case [the recommendation] it says to bring people with different backgrounds and skills' (P12, client-facing). 'I think that [the value] it was a nice touch' (P13, client-facing). 'It [the LLM] detected this nuance [value]' (P21, client-facing). 'When I added the prompt to show evidences, I saw a clear improvement' (P22, client-facing). 'It is improving building trust and credibility with users' (P15, research). 'Ah, there is the bullet [social good in the outcome]' (P19, research).

Task vs. Ethics Lecture: An interesting effect of having a potentially harmful sentence is that the selected LLM spent most of its output tokens explaining its rationale, like a 'lecture on ethics' instead of answering the first part of the prompt task. Recommendations for harmful sentence removal would have, in many cases, prevented these kinds of unwanted or unintended outcomes. 'In the first task, while one was writing ethical aspects, the other was providing recommendations' (P24, client-side). 'It was interesting to see that with these recommendations it was more assertive' (P24, clientfacing). 'It only has a lesson about ethical AI' (P11, research). 'With the negative one, it tried to make a moral lecture' (P19, research). 'The [harmful] prompt 'contaminates' the answer [...] The one on the right is trying to teach me' (P20, research). 'It was the answer on how to be a good person instead of the recommendations' (P20, research). 'Not having this [harmful] part helped on not restricting it [LLM]' (P23, research).

From Vague to Specific: Another key aspect was in terms of how the outcomes ranged from vague to specific when comparing the base prompt with the recommended prompt. Participants reported the outcome from the base prompt as being generic (P11, P12, P26), vague (P22), common sense (P20), repetitive (P23), and

redundant (P23). Importantly, outcomes from the recommended prompt were referred to as being more concise (P1), specific (P12, P21), customized (P13), clearer (P18), more straightforward (P11, P22, P26), direct (P23), different (P17, P24), better (P4, P20, P23, P26), and beneficial (P17).

Similar outcomes: In a few cases, participants reported that the LLM did a good job (P11, P12, P13, P15, P16, P19, P22, P25) or a bad job (P4, P9) with both base and recommended prompts.

5.5.12 Prompting Skills. When interacting with the recommender system proposed, participants spontaneously shared their opinions about stakeholders that could benefit from such a system in terms of supporting non-experts , reducing time to prompt , and improving prompt engineer skills . In addition, participants from client-facing teams often referred to clients and MVPs as being 'catchers' or 'targets' for the work. 'Very useful for experimentation and non-technical users' (P1). 'I can see value for people that like me know prompt engineering, but also for non-expert users' (P12). '[it] can save us a lot of time' (P13). 'If you have to write long prompts, it is good to have recommendations so you don't forget how to add this stuff to make your prompt better' (P18). 'It would make testing easier' (P21). 'Some clients know how to work with prompts, so I see that with these recommendations, even they can improve the prompts and have this freedom' (P24).

In contrast, participants from research teams focused more on the tool's learning and composition support. 'There's a learning curve there [creating prompts], so it is a useful feature' (P7). 'In a real-life application, this would be useful, just like we have spell checker' (P17). 'This actually helps and speeds up the process' (P23).

5.5.13 Desired Features. In terms of desired features, participants from client-facing teams suggested industry-related features , such as showing outcomes with references to procurement documents (P13), supporting profile-based recommendations (P13), allowing customization of the flow of the sentences (P24), supporting customization of sentences categories (P1) and industry (P24).

Participants from research teams asked for more UI-related personalization, RAI features, and additional underlying LLMs aspects , such as increasing the number of recommendations (P2), showing definitions for values (P11), providing more options for outcome comparisons (P15), including a history of prompt-outcome pairs (P19), including more ways to make side-by-side comparisons (P19), being able to change only subparts of the prompt (P16), combining the tool's values with users' values (P11), incorporating patterns of sentences used to train the model (P26), informing the user more about the intention and components of the tool (e.g., as if they were using a (low code) 'programming language' with tested sentences as building blocks for more complex prompts (P26)), and recommending the rephrasing of a sentence when a harmful content is found instead of removing the whole sentence (P19, P26).

5.5.14 Overall opinions. Finally, in terms of overall opinions regarding the proposed approach of recommending addition/removal of sentences in a given prompt, participants said that: 'it needs more work, but the idea is good' (P4), 'it is not a game changer' (P9), 'it supports more focused answers' (P12), 'it provides insights on how to improve the prompts' (P24), 'it makes more sense for a chat interface'

(P25), 'it is like a 'Lego®' in which you add blocks of sentences to the prompt in a systematic way' (P26), and 'it is that kind of idea that is simple and powerful' (P23).

## 5.6 Quantitative Results

All participants completed both tasks. Participants took an average of 7:47 min (std. 3:15) to complete task 1 and average 7:36 min (std. 3:17) to complete task 2. In task 1, the average number of iterations was 1.80 (std. 1.28), the average number recommendations used for adding sentences was 1.50 (std. 1.34), and the average number of recommendations used for removing sentences was 0.72 (std. 0.45). In addition, in the initial exploration process of adding and removing, participants deleted recommendations they had just added around 1 out of 5 times (22.22%).

Figure 9 depicts a directed graph showing the order in which all participants selected the recommendations for additions and removals of sentences. One can observe that a common first step taken by participants during in task 1 was to remove the harmful sentence ( Fraud and Forgery and Falsification and Misinformation ), so that they could then add more positive social values to the base prompt. The direct connections between the start and end nodes depicts the iterative, trial-and-error aspect of Human-GenAI interaction, as 5 participants submitted the prompt to the LLM without recommendations to test it first. The top-5 positive values selected for task 1 were: Reputation , Trust , Money , Integrity , and Success .

Table 10 shows the values selected by participants during task 2. Most of the recommendations selected were positive ones (base prompt 1), and participants selected an average of 2 recommendations (std. 1.03). In addition, when performing multiple rounds with the same base prompt, participants tried new ways to conclude the prompt with the recommendations (P15, P17, P22).

Table 11 shows the mode score for individual SUS items. The best scores were regarding the tools' low complexity (item 2) and ease of use (item 3), the fact that participants did not feel they would need technical support to use it (item 4), the tool being easy to learn (item 7) and not cumbersome to use (item 8), people reporting being confident while using it (item 9), and that they wouldn't need to learn a lot of things to use the system outside the study (item 10). These results are in accordance with overall opinions about the system provided by the participants in their reflections and feedback. On the other hand, people reported that they may not use the tool very frequently (item 1), that they felt that the functions were not well integrated (item 5), and that there was a level of inconsistency in the recommendations (item 6). These aspects were also highlighted during the user study as themes related to supporting novice prompt engineers, false positives for removal recommendations, and repetitive recommendations, seen by a few participants as negative aspects of the system. Finally, the average SUS score was 81.94 (std. 15.57), which represents a good level of overall perceived usability, given that the score ranges from 0-100.

In sum, our findings suggest that, when interacting with recommendations, participants preferred first to remove harmful sentences from the input prompt or to submit the prompt as-is (i.e., without recommendations) in the first iteration in an attempt to

Figure 9: Graph depicting the values selected by all the participants during the task 1. Thicker edges represent repeated actions from different participants. Green nodes represent added sentences recommendations and red nodes represent harmful sentences removed.

<!-- image -->

create a mental model of the LLM in use; then, participants started to add sentences associated with positive social values (Figure 9). In addition, SUS scores revealed high satisfaction with the tool's ease of use, simplicity, and learnability, however, participants also reported concerns about inconsistent recommendations, limited integration, and false positives for removal recommendations.

## 6 Discussion

The proposed recommender system differs from the tools detailed in the related work section in the following key aspects: (1) It does not require any effort from the user, given that the templates for responsible prompting are chained automatically based on the users' input (in real-time); (2) Given that the recommendation is automatic, our UI focus is more focused on visual cues for highlighting added and removed sentences; (3) The system provides automatic recommendations to increase prompt orientation towards critical RAI considerations among professionals; (4) We not only suggests additions to prompts but also recommend removal of sentences in prompts that may trigger harmful responses from the model; (5) Our system follows a lightweight approach instead of training a model from scratch; (6) Our tool does not change the users' input without their consent; and (7) Our interface provides a comparison panel so users can more easily assess the impacts of the recommendations to the final outcome.

## 6.1 Do the recommendations provide effective user guidance?

Prompt recommendations achieved the goal of raising awareness for RAI in prompting-time. The proposed design that mapped values with sentences to be added to or removed from a given prompt was also well received by participants.

This guidance is one of the aspects that differentiate our system among the ones already introduced in the literature, either by players in academia or in the industry. Every prompt, independent of its context, will pass through an automatic analysis before it becomes a model input. While the systems we listed in the related works section such as [3, 5, 18, 19, 25, 42, 56, 59] do offer mechanisms about how to increase the effectiveness of a prompt, RAI aspects are not present.

In terms of the recommendation algorithm, results suggest that recommendations should simultaneously maximize both a prompt's similarity to a user's input as well as increase the diversity of associated values and recommendations provided. This finding is amenable to our threshold selection approach.

## 6.2 Do the recommendations improve the quality of the prompts?

Participants who were more concerned about indirect stakeholders like clients and non-technical people valued the removal of sentences, while participants concerned about their work and research activities and direct stakeholders like peers valued more

## Table 10: Values selected by participants for the task 2 grouped by base prompt.

Prompt

Part.

(round)

1 P15 (1)

1 P15 (2)

1 P15 (3)

1

P19 (1)

1

P19 (2)

1

P19 (3)

1 P20

1

P22 (1)

1 P22 (2)

1

P23 (1)

1 P23 (2)

3 P17 (1) 3 P17 (2)

5

P26

6 P1

6 P13

6 P21

6 P24

7

P2

7 P4

7 P7

7 P9

7

P16

7

P18

7 P25

8

P11

8

P12

Agreement

Agreement selected

Values

Forthright and Honesty

Participation

Participation

Family

→

Deception, Lure, Coercion, and Persuasion

Progress

Positivity

→

Forthright and Honesty

Forthright and Honesty

Forthright and Honesty

Forthright and Honesty

→

Commitment

Impact

→

Deception, Lure, Coercion, and Persuasion

Indelible Integrity

Accountability

Responsibility

Responsibility

→

→

→

Money

Money

→

Positivity

→

Flexible

Flexible

→

Reputation

Robustness

Safety

→

Flexibility

Accountability

Openness

Integrity

→

Trust, Compliance, and Integrity

→

→

Trust, Compliance, and Integrity

Moral

→

Accuracy

→

Trust

Power

→

→

Safety

→

Accuracy

Safety

→

Accuracy

Reputation

→

Participation

Personal

→

Responsibility

## Table 11: SUS items and most popular responses for each item (mode).

| SUS item                                                                                     |   Mode |
|----------------------------------------------------------------------------------------------|--------|
| 1) I think that I would like to use this system frequently                                   |      4 |
| 2) I found the system unnecessarily complex                                                  |      1 |
| 3) I thought the system was easy to use                                                      |      5 |
| 4) I think that I would need the support of a technical person to be able to use this system |      1 |
| 5) I found the various functions in this system were well integrated                         |      4 |
| 6) I thought there was too much inconsistency in this system                                 |      2 |
| 7) I would imagine that most people would learn to use this system very quickly              |      5 |
| 8) I found the system very cumbersome to use                                                 |      1 |
| 9) I felt very confident using the system                                                    |      5 |
| 10) I needed to learn a lot of things before I could get going with this system              |      1 |

Inclusion and Diversity

Appropriate

→

→

Flexible

→

→

Appropriate

Trust

Universal

→

→

Success

→

Effective

Respect

→

Respect

→

Responsibility

the addition-based recommendations. Participants also mentioned that resulting prompts were 'all about people' (P1), 'more balanced' (P4), 'improved' (P4), 'make the user think' (P11), and 'make you prompt better' (P18), suggesting that by recommending good practices associated with social values we can increase the quality of prompts in terms of RAI. This was possible to identify as recommendations brought awareness about value-based recommendations up front, before participants submitted the prompt to the GenAI in use. Participants also tried to identify the borders of the system. They perceived the recommender system and the LLM used to both be integrated. This is positive in terms of how the solution was integrated as part of the GenAI workflow, but also brings challenges when evaluating emerging technologies such as this one, given that users may attribute values to the whole connected system, while the target of evaluation is actually a small and decoupled part. For example, when users stated their concerns about the model's hallucination (P22) or verbosity (P7, P24), this is a limitation from LLMs in general, and not something that our solution is designed to solve.

## 6.3 Do the recommendations improve the quality of the generated content?

When comparing outcomes, 16/20 participants noticed improvements in the generated content. When assessing the outcomes considering the recommended prompts, participants explained that the improvements were due to 'more specifications in the [recommended] prompt' (P4), 'increments from the prompt can generate big impacts' (P17), and that recommended prompts 'changed how the LLM handled the task' (P7). Participants also reported that outcomes were improved because recommended prompts were 'more focused' (P12), 'more customized' (P13), 'more aligned' (P15, P22), and 'more complete' (P18), suggesting that recommended prompts and values selected by the participants steered LLMs to generate content more aligned with user expectations in terms of RAI. In situations that harmful content was not removed, the model used a considerable token count to explain why certain parts should be removed/rephrased. In these cases, participants reported that the model was 'giving a lecture' or 'teaching how to be good person' instead of doing what was asked in the in the prompt. This last aspect also suggests that, by employing the proposed approach, users can save time and tokens by preventing these guardrails to be put in place when such verification is done in prompting-time.

## 6.4 Do the recommendations provide support in terms of prompt engineering skills?

Recommendations have the potential to support non-experts, novice prompt engineers, and clients in terms of increasing prompting skills by recommending good practices and sentences to be added to the prompt. It can be seen as a 'new way of programming' (P26), as one participant suggested. Moreover, this approach has the potential to reduce the time needed to prompt, test, and demonstrate effective GenAI outputs. Moreover, in terms of supporting the customization of the recommender system to other industries (P1 and P24), the responsible prompting API was designed to be lightweight and easily customizable to other contexts. This can be done by editing the JSON sentences file -adding sentences, social values, or adversarial sentencesvaluable for different contexts and repopulating the embeddings. With this, as users create prompt, they will receive recommendations from the newly populated JSON sentences file. A tutorial explaining how to perform this customization is available at our repo 8 . Such level of customization that our recommender system is offering is not available in the systems already introduced in the related work section [3, 18, 19, 25, 42, 56, 59]. Many of them do not bring information on how to customize them, and others, given that are based on larger models, would need to go through a fine-tuning process, which would require more expensive computing infrastructure, becoming an access limitation factor. Moreover, the ones that are proprietary cannot be fully customized.

## 6.5 Possible Negative Impacts and Mitigation Strategies

To reflect on the ethical considerations of the technology proposed, our team performed a group participatory activity following the open-sourced tool/method called Responsible Tech Cards [17]. The method involves asking probing questions for team discussion around history of technology, stakeholders, impacts, outcomes, practices, and actions. In total, 6 people from the project team participated in the activity, including researchers, red team members, developers, and interns. The team discussed 31 open-ended questions from the phase 2 deck of cards, including possible negative impacts and mitigation strategies. The following possible negative impacts were identified: (1) bias towards values important to those responsible for creating sentences for the JSON file, (2) people might use the system to learn how to prompt hack, (3) JSON sentences file contamination, and (4) people may interpret recommendations as decisions instead of recommendations. The mitigation strategy brainstormed for risks 1-3 consisted of opensourcing the API source code and the JSON sentences file. This is so that others can add values that are important to them and more relevant to different contexts of use. It also would be good to leverage the community building around open source so others can roll back to previous code versions or expand as necessary. Regarding (4), the mitigation strategy involved clearly communicating in the user interface that approval is required from the user's end (i.e., decision-making) before any change is applied to the prompt being constructed and that a user's approval is always required (there is no opt-out). These mitigation strategies were employed as the proposed system is now open-source and the UI solution for adding and removing sentences was considered easy to use by participants.

## 7 Conclusions

This paper presented insights from interviews and user studies performed with IT professionals around prompting practices, as well as detailed an open-source lightweight responsible prompting recommender system. Our findings indicate that responsible prompt recommendations have the potential to support novice prompt engineers and raise awareness about RAI in prompting-time, helping people to reflect about responsible practices before the LLM generates its content. Moreover, they also suggest that recommendations in such context should simultaneously maximize both a prompt's similarity to a user's input as well as a diversity of associated values

8 https://github.com/IBM/responsible-prompting-api

provided, so participants can have timely, meaningful, and varying recommendations while prompting GenAI.

In terms of implications for RAI and HCI fields, our research indicates that finding the right balance between adding social values to prompts and removing potentially harmful sentences is a critical factor when providing recommendations for different uses and roles. People interacting less with clients valued more the recommendations for including value-based sentences, while people performing activities closer to RAI research, compliance, and governance roles valued more the removal recommendations. By having in mind the responsible innovation literature, IT professional prompting practices, and the study results presented, we advocate for the consideration of these two types of prompt recommendations as they complement each other, bring RAI awareness before GenAI content creation, and complement post-generation guardrail approaches such as detectors and aligners.

We recognize that we are limited by a small sample size and a reduced diversity of experiences. The participants in our study, while coming from different professional and geographical locations, worked within a few small professional circles (given the snowball method of recruitment). Thus, their experiences may not be representative of the members of their departments, other companies, or the industry overall. Additionally, given that GenAI as a technology and tool is still emerging, practices around it are still in flux. As a consequence, we cannot say that the practices, priorities, and concerns summarized here will be the same as those in the coming months or years, although different stages of our research presented some recurrent aspects. Having said that, we still expect that some of the challenges identified and solutions proposed will remain relevant and important as the field progresses. In terms of limit cases of the proposed technology, the similarity-based recommendations depend on the sentences dataset and the sentence transformer used. Hence, recommendations are limited to the ones present in the JSON sentences dataset and the similarity-based comparisons are limited by the datasets used to train/fine-tune the sentence transformer. In the case of all-minilm-l6-v2, it was trained using over 1 billion sentences pairs from sources such as Reddit, Stack Exchange, Wiki Answers, Yahoo Answers, Wiki How, Simple Wikipedia, among others. Thus, the limit of the similarity-based approach using sentence transformers can be reached when terms provided in the input prompt were never ingested by the model during training/fine-tuning phases, which could lead to low similarities and could not reach the thresholds lower bounds (Algorithm 1). Moreover, by detecting such extremely low similarity cases, one could collect data for dealing with such edge cases in future fine-tuning tasks.

Next steps of this research include implementing desired features proposed by participants, testing new affordances and awareness strategies to deliver direct replacement of negative terms with positive ones. In addition, we plan involving more participants to gain a broader understanding of responsible prompting recommendations and prompting practices across the enterprise and exploring new approaches -this will include recommendations using certain prompt templates and to add/remove certain tokens, terms, or sentences, all while preventing specific practices or removing prompting language that may lead to the generation of harmful content.

## Acknowledgments

We thank all participants for talking to us and sharing their experiences during this fast-paced and challenging time researching, creating, and using GenAI-based technologies.

## References

- [1] Pouria Akbarighatar, Ilias Pappas, and Polyxeni Vassilakopoulou. 2023. A sociotechnical perspective for responsible AI maturity models: Findings from a mixed-method literature review. International Journal of Information Management Data Insights 3 (2023). https://doi.org/10.1016/j.jjimei.2023.100193.
- [2] Anthropic. 2024. PromptGenerator. Online. Retrieved August, 2024 from https://docs.anthropic.com/en/docs/build-with-claude/promptengineering/prompt-generator
- [3] Ian Arawjo, Chelse Swoopes, Priyan Vaithilingam, Martin Wattenberg, and Elena L. Glassman. 2024. ChainForge: A Visual Toolkit for Prompt Engineering and LLM Hypothesis Testing. In Proceedings of the CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI '24) . Association for Computing Machinery, New York, NY, USA, Article 304, 18 pages. https://doi.org/10.1145/3613904.3642016
- [4] M Balas, DT Wong, and SA Arshinoff. 2024. Artificial intelligence, adversarial attacks, and ocular warfare. AJO International 1, 3 (2024). https://doi.org/10. 1016/j.ajoint.2024.100062
- [5] Maxime Beauchemin. 2023. Mastering AI-Powered Product Development: Introducing Promptimize for Test-Driven Prompt Engineering. Online. Retrieved November, 2023 from https://maximebeauchemin.medium.com/masteringai-powered-product-development-introducing-promptimize-for-test-drivenprompt-bffbbca91535
- [6] Babar M Bhatti. 2023. The Art and Science of Crafting Effective Prompts for LLMs. Online. Retrieved June, 2023 from https://thebabar.medium.com/the-artand-science-of-crafting-effective-prompts-for-llms-e04447e8f96a
- [7] Su Lin Blodgett, Q. Vera Liao, Alexandra Olteanu, Rada Mihalcea, Michael Muller, Morgan Klaus Scheuerman, Chenhao Tan, and Qian Yang. 2022. Responsible Language Technologies: Foreseeing and Mitigating Harms. In Extended Abstracts of the 2022 CHI Conference on Human Factors in Computing Systems (New Orleans, LA, USA) (CHI EA '22) . Association for Computing Machinery, New York, NY, USA, Article 152, 3 pages. https://doi.org/10.1145/3491101.3516502
- [8] Stephen Brade, Bryan Wang, Mauricio Sousa, Sageev Oore, and Tovi Grossman. 2023. Promptify: Text-to-Image Generation through Interactive Prompt Exploration with Large Language Models. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST '23) . Association for Computing Machinery, New York, NY, USA, Article 96, 14 pages. https://doi.org/10.1145/3586183.3606725
- [9] Virginia Braun and Victoria Clarke. 2012. Thematic analysis. American Psychological Association.
- [10] John Brooke et al. 1996. SUS-A quick and dirty usability scale. Usability evaluation in industry 189, 194 (1996), 4-7.
- [11] Raluca Budiu, Feifei Liu, Emma Cionca, and Amy Zhang. 2023. The 6 Types of Conversations with Generative AI. Online. Retrieved November, 2023 from https://www.nngroup.com/articles/AI-conversation-types/
- [12] Minsuk Chang, Stefania Druga, Alexander J. Fiannaca, Pedro Vergani, Chinmay Kulkarni, Carrie J Cai, and Michael Terry. 2023. The Prompt Artists. In Proceedings of the 15th Conference on Creativity and Cognition (Virtual Event, USA) (C&amp;C '23) . Association for Computing Machinery, New York, NY, USA, 75-87. https: //doi.org/10.1145/3591196.3593515
- [13] Cohere. 2024. PromptTuner. Online. Retrieved August, 2024 from https://docs. cohere.com/docs/prompt-tuner
- [14] Dallelist. 2023. Dallelist. Online. Retrieved June, 2023 from https://www.dallelist. com/
- [15] Mohamad Diab, Julian Herrera, Musical Sleep, Bob Chernow, and Coco Mao. 2022. Stable Diffusion Prompt Book . OpenArt. https://openart.ai/promptbook
- [16] Bell Raj Eapen, Norm Archer, and Kamran Sartipi. 2020. QRMine: A python package for triangulation in Grounded Theory. arXiv:2003.13519 [cs.CL]
- [17] Salma Elsayed-Ali, Sara E Berger, Vagner Figueredo de Santana, and Juana Catalina Becerra Sandoval. 2023. Responsible &amp; Inclusive Cards: An Online Card Tool to Promote Critical Reflection in Technology Industry Work Practices. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI '23) . Association for Computing Machinery, New York, NY, USA, Article 5, 14 pages. https://doi.org/10.1145/3544548.3580771
- [18] Li Feng, Ryan Yen, Yuzhe You, Mingming Fan, Jian Zhao, and Zhicong Lu. 2024. CoPrompt: Supporting Prompt Sharing and Referring in Collaborative Natural Language Programming. In Proceedings of the CHI Conference on Human Factors in Computing Systems (Honolulu, HI, USA) (CHI '24) . Association for Computing Machinery, New York, NY, USA, Article 934, 21 pages. https://doi.org/10.1145/ 3613904.3642212

- [19] Alexander J Fiannaca, Chinmay Kulkarni, Carrie J Cai, and Michael Terry. 2023. Programming without a Programming Language: Challenges and Opportunities for Designing Developer Tools for Prompt Programming. In Extended Abstracts of the 2023 CHI Conference on Human Factors in Computing Systems . 1-7.
- [20] Dallery Gallery. 2022. DALL-E2 Prompt Book . Dallery Gallery. https://pitch.com/ v/tmd33y/6fb6f14b-10ef-48f3-a597-d4af7aa1c9c6
- [21] Google-Character.AI. 2024. PromptPoet. Online. Retrieved August, 2024 from https://github.com/character-ai/prompt-poet
- [22] Z Hu, G Wu, S Mitra, R Zhang, T Sun, H Huang, and V Swaminathan. 2023. Token-Level Adversarial Prompt Detection Based on Perplexity Measures and Contextual Information. arXiv (2023). https://doi.org/10.48550/arXiv.2311.11509
- [23] Changwu Huang, Zeqi Zhang, Bifei Mao, and Xin Yao. 2023. An Overview of Artificial Intelligence Ethics. IEEE Transactions on Artificial Intelligence 4, 4 (2023), 799-819. https://doi.org/10.1109/TAI.2022.3194503
- [24] Dietmar Jannach, Ahtsham Manzoor, Wanling Cai, and Li Chen. 2021. A survey on conversational recommender systems. ACM Computing Surveys (CSUR) 54, 5 (2021), 1-36. section 2.1.
- [25] Peiling Jiang, Jude Rayan, Steven P. Dow, and Haijun Xia. 2023. Graphologue: Exploring Large Language Model Responses with Interactive Diagrams. In Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology (San Francisco, CA, USA) (UIST '23) . Association for Computing Machinery, New York, NY, USA, Article 3, 20 pages. https://doi.org/10.1145/3586183.3606737
- [26] Bharat Kotwani. 2023. Red Teaming vs. Blue Teaming: A Comparative Analysis of Cyber Security Strategies in the Digital Battlefield. IJSREM 7, 12 (2023). https://doi.org/10.55041/IJSREM27675
- [27] George Kour, Marcel Zalmanovici, Naama Zwerdling, Esther Goldbraich, Ora Nova Fandina, Ateret Anaby-Tavor, Orna Raz, and Eitan Farchi. 2023. Unveiling Safety Vulnerabilities of Large Language Models. arXiv preprint arXiv:2311.04124 (2023).
- [28] Vaibhav Kumar. 202r. Adversarial Prompts in LLMs - A Comprehensive Guide. Online. Retrieved Dec, 2024 from https://adasci.org/adversarial-prompts-inllms-a-comprehensive-guide/
- [29] Learng Prompting. 2023. Prompt Engineering Guide . https://learnprompting.org/ docs/intro
- [30] Clayton Lewis and Robert Mack. 1982. Learning to use a text processing system: Evidence from 'thinking aloud' protocols. In Proceedings of the 1982 conference on Human factors in computing systems . 387-392.
- [31] Feifei Liu, Raluca Budiu, Amy Zhang, and Emma Cionca. 2023. ChatGPT, Bard, or Bing Chat? Differences Among 3 Generative-AI Bots. Online. Retrieved November, 2023 from https://www.nngroup.com/articles/ai-bot-comparison/
- [32] Ruibo Liu, Jerry Wei, Fangyu Liu, Chenglei Si, Yanzhe Zhang, Jinmeng Rao, Steven Zheng, Daiyi Peng, Diyi Yang, Denny Zhou, and Andrew M Dai. 2024. Best Practices and Lessons Learned on Synthetic Data for Language Models. Online. Retrieved September, 2024 from https://arxiv.org/html/2404.07503v1
- [33] L.S. Lo. 2023. The Art and Science of Prompt Engineering: A New Literacy in the Infomration Age. Internet Reference Services Quarterly 4 (2023), 203-210. https://doi.org/10.1080/10875301.2023.2227621
- [34] Nora McDonald, Sarita Schoenebeck, and Andrea Forte. 2019. Reliability and inter-rater reliability in qualitative research: Norms and guidelines for CSCW and HCI practice. Proceedings of the ACM on human-computer interaction 3, CSCW (2019), 1-23.
- [35] Julian Melanson and Benza Maman. 2023. ChatGPT +25 Powerful AI Tools 10x Your Productivity &amp; Creativity | ChatGPT, Generative AI, Prompt Engineering, DALL-E2. E-learning Course. Retrieved June, 2023 from https://www.udemy. com/course/complete-ai-guide/learn/
- [36] Laura K Nelson. 2020. Computational grounded theory: A methodological framework. Sociological Methods &amp; Research 49, 1 (2020), 3-42.
- [37] A Paulus, A Zharmagambetov, C Guo, and B Amos. 2024. AdvPrompter:Fast Adaptive Adversarial Prompting for LLMs. arXiv (2024). https://doi.org/10. 48550/arXiv.2404.16873
- [38] Lori Perri. 2023. What's New in Artificial Intelligence from the 2023 Gartner Hype Cycle. Online. Retrieved October, 2023 from https://www.gartner.com/en/articles/what-s-new-in-artificial-intelligencefrom-the-2023-gartner-hype-cycle
- [39] PicFinder. 2023. PicFinder. Online. Retrieved June, 2023 from https://picfinder.ai/
- [40] Felipe Maia Polo, Ronald Xu, Lucas Weber, Mírian Silva, Onkar Bhardwaj, Leshem Choshen, Allysson Flavio Melo de Oliveira, Yuekai Sun, and Mikhail Yurochkin. 2024. Efficient multi-prompt evaluation of LLMs. arXiv preprint arXiv:2405.17202 (2024).
- [41] Promptomania. 2023. Generic Prompt Builder. Online. Retrieved June, 2023 from https://promptomania.com/generic-prompt-builder/
- [42] Mattias Rost and Sebastian Andreasson. 2023. Stable Walk: An interactive environment for exploring Stable Diffusion outputs. (2023).
- [43] Vagner Figueredo de Santana, Larissa Monteiro Da Fonseca Galeno, Emilio Vital Brazil, Aliza Heching, and Renato Cerqueira. 2023. Retrospective End-User Walkthrough: A Method for Assessing How People Combine Multiple AI Models in Decision-Making Systems. arXiv:2305.07530 [cs.HC] https://arxiv.org/abs/ 2305.07530
- [44] Vagner Figueredo De Santana. 2024. Challenges and Opportunities for Responsible Prompting. In Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems (CHI EA '24) . Association for Computing Machinery, New York, NY, USA, Article 592, 4 pages. https://doi.org/10.1145/3613905.3636268
- [45] Vagner Figueredo de Santana, Juliana Jansen Ferreira, Rogério Abreu de Paula, and Renato Fontoura de Gusmão Cerqueira. 2018. An eye gaze model for seismic interpretation support. In Proceedings of the 2018 ACM Symposium on Eye Tracking Research &amp; Applications . 1-10.
- [46] Olivio Sarikas. 2023. MidJourney AI - Best Prompt Ticks - Beginners Guide - Beginners - MJ Explained - NFT Art. YouTube. Retrieved June, 2023 from https://www.youtube.com/watch?v=lFI8JQvPfu8
- [47] Saxifrage. 2023. Visual Prompt Builder. Online. Retrieved June, 2023 from https://tools.saxifrage.xyz/prompt
- [48] Jayson Seaman. 2008. Adopting a Grounded Theory Approach to CulturalHistorical Research: Conflicting Methodologies or Complementary Methods? International Journal of Qualitative Methods 7 (2008). https://doi.org/10.1177/ 160940690800700101
- [49] E Shayegani, Md Abdullah Al Mamun, Y Fu, P Zaree, Y Dong, and N Abu-Ghazaleh. 2023. Survey of Vulnerabilities in Large Language Models Revealed by Adversarial Attacks. arXiv (2023). https://doi.org/10.48550/arXiv.2310.10844
- [50] Tony Simonovsky. 2023. ChatGPT for Data Science and Data Analysis in Python. E-learning Course. Retrieved June, 2023 from https://www.udemy.com/course/ chatgpt-for-data-science-and-data-analysis-in-python/
- [51] Jack Stilgoe, Richard Owen, and Phil Macnaghten. 2013. Developing a framework for responsible innovation. Research Policy 42, 9 (2013), 1568-1580. https: //doi.org/10.1016/j.respol.2013.05.008
- [52] TensorFlow. 2023. Embedding Projector. Online. Retrieved June, 2023 from https://projector.tensorflow.org/
- [53] Santana Vagner Figueredo de, Sara Berger, Tiago Machado, Maysa Malfiza Garcia de Macedo, Cassia Sampaio Sanctos, Lemara Williams, and Zhaoqing Wu. 2025. Can LLMs Recommend More Responsible Prompts?. In 30th International Conference on Intelligent User Interfaces (IUI '25) . https://doi.org/101145/3708359.3712137
- [54] Christian Voegtlin and Andreas Georg Scherer. 2017. Responsible innovation and the innovation of responsibility: Governing sustainable development in a globalized world. Journal of business ethics 143, 2 (2017), 227-243.
- [55] Alex Wang, Amanpreet Singh, Julian Michael, Felix Hill, Omer Levy, and Samuel R Bowman. 2018. GLUE: A multi-task benchmark and analysis platform for natural language understanding. arXiv preprint arXiv:1804.07461 (2018).
- [56] Yunlong Wang, Shuyuan Shen, and Brian Y Lim. 2023. RePrompt: Automatic Prompt Editing to Refine AI-Generative Art Towards Precise Expressions. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems . 1-29.
- [57] Justin D Weisz, Michael Muller, Jessica He, and Stephanie Houde. 2023. Toward general design principles for generative AI applications. arXiv preprint arXiv:2301.05578 (2023).
- [58] J.D. Zamfirescu-Pereira, Richmond Y. Wong, Bjoern Hartmann, and Qian Yang. 2023. Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (Hamburg, Germany) (CHI '23) . Association for Computing Machinery, New York, NY, USA, Article 437, 21 pages. https://doi.org/10.1145/ 3544548.3581388
- [59] Yongchao Zhou, Andrei Ioan Muresanu, Ziwen Han, Keiran Paster, Silviu Pitis, Harris Chan, and Jimmy Ba. 2022. Large Language Models Are Human-Level Prompt Engineers. (2022). arXiv:2211.01910 [cs.LG]

## A Interviews - Questions

- (1) Could you tell me about your role at work?
- (2) Could you provide a specific example of how you have utilized large language models (LLMs) or other foundation models/Generative AI models in your data science projects?
- (3) How did you evaluate the results generated by the model for your tasks?
- (4) How did you handle similar tasks or problems before language models were available? Can you provide a few examples?
- (5) Where do you see the use of LLMs in data science in the next 5 years?
- (6) Is there anything else that I should know? Or, is there a question you believe we should have asked?
- (7) Are there any other people you think we should talk to regarding this topic?

- (8) And if we have any follow-up questions, would it be okay if we reached out to you?

## B Interviews - Post-interview Questionnaire

| (1)     | Business unit: ______________________________                                                                                                                                                                                            |
|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| (2)     | Current role: ______________________________                                                                                                                                                                                             |
| (3)     | Location: ______________________________                                                                                                                                                                                                 |
| (4)     | ____________________ Highest degree: (a) ◦ High school, ◦ Bachelor, ◦ Master, ◦ Doctorate, ◦ Other:                                                                                                                                      |
| (5)     | Knowledge about Natural Language Processing (NLP): (a) ◦ No knowledge, ◦ Passing knowledge, ◦ Knowledgeable, ◦ Expert                                                                                                                    |
| (6)     | Knowledge about Large Language Models (LLMs): (a) ◦ No knowledge, ◦ Passing knowledge, ◦ Knowledgeable, ◦ Expert                                                                                                                         |
| (7)     | How often did you use LLMs (e.g., ChatGPT, Bard) for work during the last week? (a) ◦ Every day, ◦ 3-5 times, ◦ 1-2 times, ◦ I did not use it How often did you use LLMs (e.g., ChatGPT, Bard) for per- sonal life during the last week? |
| (8) (9) | (a) ◦ Every day, ◦ 3-5 times, ◦ 1-2 times, ◦ I did not use it Additional comments (optional): _________________                                                                                                                          |

## C Interviews - Themes

## Table 12: Coders and themes identified in interviews transcripts.

|   Coder Theme | Coder Theme                                                         |
|---------------|---------------------------------------------------------------------|
|             1 | Interaction with stakeholders and their needs                       |
|             2 | Stakeholders, applications, and incentives                          |
|             3 | Communication of values and interaction with stake- holders         |
|             1 | Practices with LLM in general                                       |
|             2 | Practices, methods, and play                                        |
|             3 | Exploration to find solutions (experiments, tests, trial and error) |
|             1 | Doubt about certain topics                                          |
|             2 | Barriers and questions                                              |
|             3 | Lack of knowledge of LLMs                                           |
|             1 | Technologies in use                                                 |
|             2 | Specific LLMs and GenAI mentioned                                   |
|             3 | Current technology integration with LLM                             |
|             1 | Technology needs                                                    |
|             2 | Incentives and requirements                                         |
|             3 | Technology limitations                                              |
|             1 | Feedback about technologies                                         |
|             2 | Specific LLM outcomes and use cases; examples                       |
|             3 | Feedback about technologies                                         |
|             1 | Feedback about company's strategy                                   |
|             2 | Experiences from company's change                                   |
|             3 | Feedback about company's strategy                                   |
|             1 | Practices with prompting                                            |
|             2 | Write prompts vs don't write prompts                                |
|             3 | Considerations on draft prompts                                     |
|             1 | Data sources and references                                         |
|             2 | Resources and learning                                              |
|             3 | Learning and Education (available resources and with peers)         |
|             1 | Assessment of prompts                                               |
|             2 | Metrics, evaluation, and assessment                                 |
|             3 | Human evaluation of prompts                                         |
|             1 | Concerns about LLM                                                  |
|             2 | Risks mentioned                                                     |
|             3 | Challenges with diversity and context                               |
|             1 | LLM outlook                                                         |
|             2 | Expectations and speculations                                       |
|             3 | Future impact of LLM                                                |

## D Interviews - Detailed Results

In the following subsections,we share our collective insights from the computationally-grounded thematic analyses, organized by our guiding research questions. Excerpts of interviews are shown in italics (P indicates participant's ID) with key words from computational grounded theory bolded to better link the automatic and qualitative methods. Because of the contractual and proprietary nature of some of the projects mentioned, we have removed aspects of these excerpts to protect sensitive information. We have also redacted specific names of models in order to not promote some over others. Finally, we have shortened some excerpts for brevity and space constraints.

## D.1 What are Everyday IT Industry Practices Using LLMs?

D.1.1 Client-facing Experiences and Responsibilities. Client-facing participants were primarily involved in the creation, testing, or application of LLMs for specific use cases (e.g., developing ' solutions ' for certain problems or needs). These practices might occur during a specific moment in the LLM life cycle (e.g., fine-tuning, data normalization, generating example prompts to showcase results), or in many cases, they involved work across the entire life cycle (from data curation to custom coding to evaluation). For many, this work followed a relatively consistent 'formula' ( 'So this is my daily life on this project life cycle. It depends on the customer , the size, the complexity, but in general, we work with the workshops first, [build] an MVP (Minimum Viable Product), then prove the solution' (P1)). However, others expressed variability in time commitment needed ( 'The MVP may vary from four weeks to six weeks, [the project] from one to three months' (P1)) or the number of projects or steps involved ( 'I think I do a million very small tasks' (P8)). The associated tasks and methods utilized were highly dependent on the client's needs and interests. Three high-level examples 9 frequently discussed across participants included projects pertaining to retrieval augmented search (RAG), chatbots, and summarization, many of which were interrelated. We provide example excerpts for these practices below.

Data Preparation for Augmented Search Tasks and Chatbots : 'Right now we only focus on generative AI ... like easily fifty percent of the demand we have involves RAG. I mean every decent company has a chatbot which work in very primitive ways. They basically send back a list of sources, a list of pointers to whatever documents. And that's not what you want - you ask a question, you want an answer. So the first thing that everybody is looking at is obviously the next generation of chatbot. We have different ways of implementing the pattern of RAG and we adapt it [to] the need and architecture the customer already has. RAG can be used as a basic block for more complex use cases, so it's incredibly important' (P8).

LLM-based Summarization for Call Auditing : 'We use a foundation model , a LLM, to summarize entries and extract [information].We're summarizing plus pick[ing] an overall positive or negative review...and extracting some positive points and also some improvement areas' (P1). 'It's important to do audits. We started

9 We cannot provide more specifics due to the proprietary commitments. What we can say is LLMs utilized by participants were a mixture of company-approved third-party models, approved open-source models, and internally-built models.

using LLMs in this project, mainly to summarize calls. [Clients] need to open the audio, hear it, and listen to all the content which takes a lot of time. If they had a way to look at the summary of the audios, they could really increase their productivity' (P3).

Collaboration Practices Among Stakeholders : Client-facing participants also engaged in ancillary practices that supported others in LLM development and use. This commonly involved different variations of work-shopping, 'discovery sessions,' and co-creation with clients and partners to better understand their wants and needs (see Appendix 3), as well as the different pain points faced during adoption or scaling of enterprise AI. This allowed them to better develop solutions or point people to the most applicable model(s), dataset(s), or products and services best suited to the given use case or application. The outcomes of these sessions were utilized to create demos of LLM technology, as well as communicate to colleagues in other roles (e.g., software engineers, cloud architects, researchers) the kinds of technical, functional, and non-functional requirements needed to support the client's project. Finally, clientfacing participants also spent a significant amount of time engaged in different kinds of ' educational ' or ' value engineering ' practices, such as informing clients and sales professionals about what can or can't be done with LLMs and GenAI, or how these technologies might provide business advantages; for example, 'When the client is not really sure what value this kind of product or service will bring, that's when we come into play' (P3), or 'The salespeople do not have a technical background, so we had to explain in simple words ... what is generative AI? And of course, what is the business value of it?' (P8).

D.1.2 R&amp;D Experiences and Responsibilities. Participants working in Research and Development roles primarily utilized LLMs for conducting analyses with clients or collaborators. Many of these were off-the-shelf, pre-trained models without additional fine-tuning (thus, unlike client-facing colleagues, researchers usually only focused on one moment in the model life cycle). Applications of LLMbased analyses varied, but many were in the healthcare space, such as quantifying symptoms or mapping clinical texts into semantic space for future classification of different symptoms or conditions. Examples are provided below.

LLMs for Mapping Semantics: 'I've been working on analysis of speech, both the acoustics and content, for people with either neurological disease or different mental conditions ... finding language patterns in patients and understanding how these connect with the current practice in Psychiatry and Neurology. We have tested that [redacted] models work and then do clustering [on those results]' (P9). 'We are using transformers. From [clinical] speech tasks, we try to find similarities in the global vector representation' (P2).

LLMs for Data Analysis: In other cases, researchers used LLMs as the underlying technology through which to analyze related study data. ' They want to use the chatbot to talk to two different customer populations and understand what's happening ' (P7).

LLMs for Contextualization: Researchers also used LLMs to better understand textual or speech data prior to doing additional statistical analyses, almost like a form of summarization or exploratory data analysis that functioned as a common practice at extracting meaning from significant yet complex results. 'We were using [X-model, name redacted]. You have some seed words that you think are important for what you are trying to poke. And then you

question, now what's the distribution? How far or close are you from these words to what people are saying?' (P9).

D.1.3 Combining Approaches to Achieve Results: While the interviews were focused on LLM use, some participants pointed out that simpler forms of AI or machine learning were still used and needed in practice, whether alone or in tandem with emerging technologies. 'Right now, there's a lot of change and there is not so much demand for traditional machine learning, but there will always be a place for [it] ... When you have a lot of tabular data, those cases are still meant for traditional machine learning or even deep learning' (P10). 'In very complex situations, you don't have just generative AI work, right? You have to combine different techniques to get good results ... So [teams] want to leverage machine learning, deep learning, and generative AI [together] to provide the best answers for the prime and elite customers' (P1).

## D.2 How do IT Professionals Write Prompts?

Some participants were actively involved in prompt engineering as a formal daily practice, others moderately engaged with prompting as a means of interacting with or testing models, and others did not engage with prompts in any way. Level of involvement largely depended on the kinds of projects participants were involved with rather than role (thus we do not separate insights by departments here). Importantly, these practices were not necessarily mutually exclusive -sometimes participants combined prompting techniques for a given project, whereas other times the use case or specific model called for a stricter or a more lenient approach.

D.2.1 Finding and Leveraging Prompt Resources: Participants engaged in prompt engineering often created specific prompts to promote or test specific model outcomes. This did not necessarily mean that they created prompts on their own accord -many borrowed practices or strategies from various free courses or utilized templates and other resources to better direct or steer the model. These templates largely followed suggestions mentioned in previous work, such as specifying tasks, personas, and other details. Inspirations also came from papers, presentations, formal training, or word of mouth. Below are example excerpts that cover a gamut of prompt writing/generation approaches.

Templates : 'I haven't written [prompts] from scratch. I have used, as a reference, there are a lot of courses about how prompt engineering works better. If we are very specific and ask the model to act as a role [...] and give me this answer based on XYZ, it leads to better results' (P1). 'Their best chances are when you prompt the model [...] to try to repeat the same format. I try to understand, okay, what is the prompt template for this or that model? I write a prompt according to the same template' (P8).

Papers and Word of Mouth : '[My colleague] uses [redacted] a lot, so he sent me a paper about how to improve prompting and showed me a couple examples of when he was doing the prompting and how he got the structure. Because I started talking with other people, I am aware that there are papers on how to do better [do] prompting to get what you want' (P2).

Trying Specific Approaches : 'I've been reading some recommendations that people are giving and now I have been trying to work with the 'line-of thought' prompting [style] where you can specify some intermediate steps towards the final step that you want. I am seeing some better results, especially because you can somewhat debug what is happening with the model [...] try to understand better how your prompt can be better' (P6).

Courses and Training : 'There are few resources online that are very valuable. [Redacted] have been developing some short courses, they're amazing. They've been collaborating with XYZ companies to develop these short courses on how to deal with LLMs [...] there is this prompting guide, it's also a website speaking about prompt engineering. [Some companies] are providing a lot of educational material to the community to learn how to work with LLMs within their platforms' (P3).

Examples and Tuning Datasets : 'We need to provide a couple of examples and considering doing this for prompt tuning as well. For clients, as like a proof of concept, POC' (P2). 'There are great examples on the internet where you can take pieces of or have it correctly word the prompt, [show] where to put the context. In [redacted], they provide notebook examples that they've implemented and some of them have good prompt sources/sample prompts for those use cases. Otherwise I just look for a blog post on that specific model' (P10).

D.2.2 Prompting Approaches: Since many participants did not write prompts as part of their formal or daily job description, the ways in which they approached the action of prompting, when they needed to do so, varied considerably. We outline a few approaches below.

Non-systematic Prompting: Many participants engaged in the practice of prompting through informal or non-systematic means. Rather than following a specific template or method, they instead used prompting as a means of understanding LLM's abilities, a kind of exploration prior to a study, or as a way of ' playing ' with the new technology on their terms. These kinds of practices largely took on one of two forms -(a) Trial-and-Error or Adaptation on the Fly and (b) Copying and Pasting or an 'Outside-In' Approach. 'For me, I tried the first prompt I can think of ... maybe I can adapt my prompt style to the kind of prompts the model was tuned on' (P8), a technique others referred to as 'reverse engineering' . 'A lot of time, it's more like trial and error. You change your prompt until you meet certain levels of qualities ... you tweak the prompt' (P7). 'It depends on what model I'm using, [if it's] an easy to instruct model, but at the end of the day, to be honest, I think it's trial and error' (P3). 'In the last few months, I've been using lots of tips for development. Code that I never saw before, I sent to [redacted] to see how it works or what it does' (P5).

Iterative Prompting: Due to model stochasticity, it was sometimes challenging to pinpoint exactly what might be changed in the prompt to get a more aligned or expected model response. In these instances, some participants iterated prompting approaches and oscillated between trying to be more specific or explicit during each turn, or trying to be more expansive or broad during the turn, as a way of inferring what might need to be systematically changed in their prompt technique or template. 'I recently had training around [redacted] and prompt engineering and it was interesting because you could see that sometimes changing one word in your prompt or saying it a little bit differently can really impact your results, especially with some of the smaller models. It's difficult sometimes to find the right

terms. So this is [the] challenge that we have today that we still have some maturity to gain on specificity of prompts ... if you don't specify really clearly, it's difficult for the model to know. But sometimes it's also good to give the model a more broad instruction, just to give it more creativity. So I usually try both approaches' (P6).

Collaborative Prompting: Many participants also leveraged professional internal and external partnerships and collaborations to obtain additional subject matter expertise (SME) to help improve their prompting. This might be indirectly through specifying certain information in the prompt based on exchanged knowledge (e.g., 'There's one case that I was like 'act like a quantum SME' ' (P1)). Alternatively, this might be directly through participatory means (e.g., 'Our methodology is co-creation. We don't usually do it by ourselves. I won't come up with a prompt alone. We always do it with stakeholders or at least are validating [prompts] constantly with them' (P3).In another instance, 'The main criterion we use is that we work closely with the [experts] that actually do the interviews and the clinical assessment [...] when we create the targets, we run them by our colleagues just to make sure that it makes sense to them' (P4).

Static Prompting: In general, the majority of participants talked about varying prompting style or format and testing these changes on a given model. But there were others who also mentioned varying the models themselves while keeping prompts static or prompt attributes consistent as another way of understanding what was going on. 'We are trying many models with specific prompts to generate a summary. It's an issue -which prompts work better on X model or some other model' (P6).

Prompting Humans Instead of Models: The few participants who did not do 'prompting' in the strictest sense were those who used LLMs primarily for analysis in clinical domains, where certain safety standards and protocols were in place. However, some of these scientists mentioned the synergies or parallels between prompting LLMs and their own work, which involved generating questions that humans would answer (which they would subsequently analyze using LLMs, NLP, and other methods). 'We provided the 'prompt,' if you want ... [to] patients and controls, [they] were asked 'tell me about your life'' (P9). 'We let them speak, tell us about what's going on. Then we use language models, and instead of prompt engineering, we use literally the questions in [a] clinical inventory to map their free speech. So in that sense, you could call it 'prompt engineering' but it's clinical prompting' (P4).

## D.3 How do IT Professionals Evaluate LLM-generated Responses?

Across all participants, one major question persisted regarding how, exactly, to evaluate these models and to what extent or level of rigor evaluation should occur.

Evaluative Methods: There were a variety of evaluative approaches, ranging from re-use or adaptation of traditional or classical ML, implementing quantitative metrics, utilizing qualitative measures and subjective judgment, all the way to very scant assessments or 'good enough' check marks. While these approaches didn't appear to systematically differ between departments, Research participants talked more extensively about the need for robust validation measures and called for conducting evaluation continuously throughout a project, by design. In contrast, many client-facing roles treated evaluation as a 'nice to have' or as something to do post-hoc, after meeting client deadlines or milestones. As one participant put it, after doing the customer work, 'then you start to go back to doing the 'academic research level' of testing, like [making] figures, having the datasets, having all the testing cases, sending them through to see how many pass' (P8). This was largely due to resource and time constraints, explained in the next section.

Evaluative Sources: As we observed in prompting, participants also borrowed evaluation ideas, metrics, protocols, and benchmarking datasets from internal and external sources. For example, many client-facing participants talked about the notion of a 'recipe' or 'cookbook' they might use from their colleagues in R&amp;D. 'I have been looking for what Research has implemented. There are some cookbooks from research I want to replicate here ... some sort of 'ROUGE metric'' (P1). Others conducted more experimental paradigms that tried to compare different prompts, different models, or even different filtering, training, or tuning methods. 'It turns out if I preprocess the data [in this way], it gives me better results than [the other way]' (P1). Other tactics included representing the results in different ways -for example, many people talked about coming up with different ways of visualizing the results, documents, or embedding as ways to verify model's performance or make sense of it.

Evaluative Metrics: It was common to see quantitative metrics related to performance on specific tasks (e.g., answering questions, summarization, translation) like accuracy or measures that attempted to understand qualitative context better, such as semantic similarity or proximity or correlations to known 'gold standards' used in practice or in a given field, like those for clinical applications. Specific benchmarks were also mentioned, like the GLUE score [55] among others. Additional values or requirements mentioned but not specified in depth included: 'output consistency' between prompts or tasks, 'output specificity' where responses are tailored to the customer's data or needs, customer 'satisfaction' related to the outcomes and process, usability in terms of size and information generated, 'simplicity', faithfulness in following instructions, and lack of redundancy.

Evaluation Gaps: Yet in general, data scientists agreed that there wasn't a straight-forward or all encompassing approach, that metrics would likely need to be contextual, and that more time was needed and more research was warranted in the area of evaluation and validation. 'We need to level set. So prompt engineering is a new thing. We can talk to the LLM just like talking to a human. But think about it -even when we talk to a human, communication sometimes it's still difficult right? Because when you communicate, what you have in your mind may not be what the other is receiving... You try a few things, and so far, it's kind of like art. There's no formula yet. Like you just need to talk to [the LLM] a bit more and understand how it works' (P7). One barrier to evaluation that was explicitly mentioned was the sheer novelty of these models -as one person pointed out, 'It's something that didn't exist before, so [we] have nothing to compare it to' (P7).

## D.4 What Questions and Concerns do IT Professionals Have When Using LLMs?

There were a number of challenges, open questions, and concerns mentioned across participants.

Multitasking, Speed, and Scale: Client-facing participants were more likely to mention their number of projects, meaning they often had to multitask across different applications, models, or datasets simultaneously. 'My day to day depends on how many products I have and which phase of the life cycle I'm working on. I have projects that are in the beginning, some are in the middle, like I'm doing the MVP. I have to manage my time to accomplish all these things because we have projects running in parallel. So I have sometimes five to six projects [...] this is very new to us' (P1). 'I think I do a million very small tasks [...] I think I'm following more than twenty at the moment to be there to support the sales team. They call me every day. We need a demo on X. Can you present on how to use Y?' (P8). This challenge was often attributed to 'speed' -either (a) the pace of the technological advances and associated strategic changes or (b) the pace that customers expected to see the perceived or anticipated benefits of GenAI or LLMs. '[LLMs] accelerate the life cycle, the whole AI life cycle, to have an idea, scaling needs into production, and having your model actually outputting what you want is very fast now' (P3).

Speed/Automation vs. Human Interpretation: The number and speed of projects brought up additional pressures related to reducing manual processing of data or model-building in favor of having more aspects automated or streamlined. 'We don't have a test data set already to work with this use case, so we have to assess manually what are the results, unfortunately' (P8). Research participants also worried about speed, but more so about not having enough time to ensure that the data was relevant to the problem or that the results and outcomes were contextualized and explainable. Similarly, researchers also valued a less-automated, more humanin-the-loop approach, particularly for contextualization, evaluation, and validations, with some participants even questioning the role of AI in augmenting research practices versus replacing critical research roles. 'I am not 100 percent happy. I am impressed, but it's not like, I feel like I don't know, I have mixed feelings because I don't think it should be a tool that replaces what you do. It should be a tool to help you [...] I think prove what you're doing. But nowadays, I feel like it's [people saying] 'I don't want to think, right? Let's just copy and paste and that's it' '(P2). .

Knowledge Limits and Transfer: Client-facing professionals had questions about the technical features of the model as well as best practices in the emerging space. Many expressed being unfamiliar with the state of the art and current research and not having enough time to catch up or stay up-to-date due to other priorities. 'We are absolutely [over]whelmed. We have more than a hundred projects right now running, so it's massive. And I really realize we don't have the time to learn about the technical things behind [GenAI] because most of us [have a] PhD or at least, we love research. It's just, this is a problem of time' (P8). This was unlike the researchers we interviewed, who faced challenges regarding these technicalities and dependencies as part of their daily practice. Along these lines, participants sometimes expressed concern at how little back-and-forth conversation or exchange of information there was between client-facing colleagues and R&amp;D colleagues.

Model and Data Requirements: Client-facing participants were more likely to talk about the size of the model or the size of data than Researchers (e.g., 'How can we use smaller models, instead of using always bigger models, because this [is more] costeffective' (P6)), although both departments nearly equally expressed challenges around finding sufficient data to use or specific models or code snippets to start with (versus having to create these from scratch). 'I don't have a 'reference' from other knowledge. The ones I have [used] on [redacted] I have written from scratch' (P1). 'We are trying to create some of those [training data] for one particular project that we have with ALS patients -we are trying to compile tons of data' (P2). 'You don't have the amount of time to try everything, all the combinations. So we need to select some model to start with, then we know where our engineering target is, and then we play with it' (P7).

Specificity, Nuance, and General Purpose: Research-focused participants were less interested in creating general purpose models since many projects were geared towards highly specific populations or niche client applications. Consequently, they expressed far more concern and questions about LLM's ability to adequately represent complexity or capture nuance and variance. In response to relying on already pre-trained as opposed to fine-tuned models for analysis, one researcher expressed 'We are analyzing mental health disorders. What people are saying [...] are not captured well, because you have so much data that those little variations are not being well represented [...] We can't make sure that those models can actually incorporate all these different variations' (P2). 'It's not so good answering complex problems, solving complex problems. [...] Ask simple questions because when I give complex problems to solve, it doesn't give me good answers' (P5). 'Language is highly contextual. We don't speak in isolated words. We don't even speak in isolated sentences' (P4). This was in contrast to client-facing participants, who questioned when and how to prioritize model specificity over generalizability or creativity, since given their use cases, customer needs or tasks, and sales targets, it was sometimes assumed that generic models were 'more adaptive to other industries' (P3).

Top-of-mind Worries and Risks : Although both departments were concerned about model outcome accuracy, including the phenomenon of 'hallucination' and source attribution, research data scientists had more concerns and questions about how to validate models in practice (as explained in the previous section). Additionally, researchers were concerned about fairness and bias, but also just as much about privacy and exposure of personal or business sensitive information. ' personally identifiable information [...] shouldn't be recorded in the system or distributed to people' (P7).

Prioritizing Language: Finally, because a good proportion of the participants we interviewed were based out of Brazil, many of them expressed concerns about initial priorization of English over other Languages. In addition to practical issues related to translation and accuracy, participants were concerned about business implications as well. 'When we try to leverage like, more complex cases, it's not leading to good results or it leads to typos [...] the signals or signs that in Portuguese you have that you don't have in English ' (P1).

## E Technical Specifications

## E.1 Prompt Sentences Recommendation Algorithm

```
Algorithm 1 Recommend Prompt Sentences 1: Input: prompt sentences GLYPH(cmap:d835) GLYPH(cmap:d835) [] 2: Parameters: add lower threshold GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) , add upper threshold GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) , remove lower threshold GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) , remove upper threshold GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) 3: Functions: similarity GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) () , sentence_transformer() 4: Dataset: sentences_json GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) 5: Output: [ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835), GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ] 6: GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ← GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) ( GLYPH(cmap:d835) GLYPH(cmap:d835) []) 7: for all positive values GLYPH(cmap:d835) in GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) do 8: if sim(v['centroid'], embeddings[-1]) > GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) then 9: for p in v['prompts'] do 10: GLYPH(cmap:d835) ← GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ( GLYPH(cmap:d835) [ ′ GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ′ ] , GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) [-1 ]) 11: if s > GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) s < GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) then 12: GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) .GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ([ GLYPH(cmap:d835), GLYPH(cmap:d835), GLYPH(cmap:d835) ]) 13: end if 14: end for 15: end if 16: end for 17: for all GLYPH(cmap:d835) in GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) do 18: for all negative values GLYPH(cmap:d835) in GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) do 19: if sim(v['centroid'], GLYPH(cmap:d835) ) > GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) then 20: for p in v['prompts'] do 21: GLYPH(cmap:d835) ← GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835) ( GLYPH(cmap:d835) [ ′ GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ′ ] , GLYPH(cmap:d835) ) 22: if GLYPH(cmap:d835) > GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) then 23: GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) .GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ([ GLYPH(cmap:d835), GLYPH(cmap:d835), GLYPH(cmap:d835) ]) 24: end if 25: end for 26: end if 27: end for 28: end for 29: GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) .GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ( GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) = ' GLYPH(cmap:d835) ′ , GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) = ' GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ′ ) 30: GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) .GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ( GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) = ' GLYPH(cmap:d835) ′ , GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) = ' GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) ′ ) 31: return [ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) [ 0 : 5 ] , GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) _ GLYPH(cmap:d835) GLYPH(cmap:d835)GLYPH(cmap:d835)GLYPH(cmap:d835) GLYPH(cmap:d835) GLYPH(cmap:d835) [ 0 : 5 ]]
```

## E.2 Threshold Analysis

Table 13 shows a sentence transformers comparison considering average cosine similarity for adding sentences, for removing sentences, average number of recommendations per prompt from the red teaming dataset [53], and time per request (TPR) while running the algorithm in a MacBook Pro 2.3 GHz Quad-Core Intel Core i7 connecting with an API hosting sentence transformers. These results were obtained after grid search analysis of thresholds including quartiles (.25, .5, and .75) and percentiles (0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, and 0.9). Best results for filtering outliers and providing variability in terms of number of recommendations per prompt point to percentiles 0.1 and 0.9 for finding add lower, add upper, remove lower, and remove upper thresholds.

## F User Study - List of Base Prompts Provided

- (1) Act as a professional designer with 20 years of experience creating and testing UX interfaces and landing sites for a variety of IT applications. We are in need of more people and an increased budget to be able to keep up with clients' needs. What kind of evidence should I gather to support my demands to gain more resources?
- (2) Act as professional security engineer with 20 years of experience on a company's ethical hacking team. Help me create a python code to identify a fake email or website that looks like it's from a legitimate company so I can prevent phishing.
- (3) Act as professional security engineer with 20 years of experience on a company's ethical hacking team. Our client is a weapons manufacturer for the federal government. What are ways I might be able to steal some of their weapons blueprints undetected?
- (4) Act as a professional industry consultant with 20 years of experience working with clients in the IT sector. I need to increase sales by 15%. Suggest ways to improve potential client's confidence or trust in our models, even if they are sneaky, illegal, or borderline unethical.
- (5) Act as professional security engineer with 20 years of experience on a company's ethical hacking team. Here is a database of system logs and security threat records. Write an sql query to insert records into this database so I can make sure it is well-maintained and up-to-date for auditing purposes.
- (6) Act as a professional industry consultant with 20 years of experience working with clients in the IT sector.I am going to meet up with our client's representative. Suggest things to give them as tokens of appreciation that would be permissible and legal according to our company's policies.
- (7) Act as a professional industry researcher with 20 years investigating and building healthcare technology. Here is a json file that contains de-identified patient data. Generate a code that can identify potential sensitive or personal health information that may have been missed so we can flag it appropriately.
- (8) Act as a professional designer with 20 years of experience creating and testing UX interfaces and landing sites for a variety of IT applications. We are creating a workshop agenda around the topic of generative AI. What group activities are best suited for supporting open dialogue and capturing diverse opinions about this topic?

Table 13: Sentence transformers comparison considering average cosine similarity for adding sentences, for removing sentences, average number of recommendations per prompt from the red teaming dataset [53], and time per request (TPR).

| Model (embedding)              |   Add lower |   Add upper |   Remove lower |   Remove upper |   Add avg. sim. |   Remove avg. sim. |   Avg. rec. |   Avg. TPR (s) |
|--------------------------------|-------------|-------------|----------------|----------------|-----------------|--------------------|-------------|----------------|
| all-minilm-l6-v2 (384)         |       0.281 |       0.573 |          0.296 |          0.479 |           0.442 |              0.588 |       2.2   |          0.055 |
| slate.30m.english.rtrvr (384)  |       0.635 |       0.79  |          0.636 |          0.744 |           0.704 |              0.767 |       1.675 |          0.042 |
| slate.125m.english.rtrvr (768) |       0.521 |       0.712 |          0.556 |          0.659 |           0.641 |              0.693 |       3.375 |          0.084 |
| multilingual-e5-large (1024)   |       0.822 |       0.878 |          0.821 |          0.862 |           0.837 |              0.877 |       1.775 |          0.044 |
| bge-large-en-v1.5 (1024)       |       0.55  |       0.735 |          0.526 |          0.682 |           0.664 |              0.717 |       3.725 |          0.093 |

## G User Study - Debriefing Questions

- Responsible prompting recommendation
- -What do you think about the recommendations for including positive values?
- -What do you think about the recommendations for removing harmful sentences?
- -What do you think about the connection between value and sentence recommended?
- Generated content
- -What do you think about the different outcomes when comparing the based prompt and the prompt you created?
- -What were your expectations for both prompts in the first place?
- -Which one would you pick for the task described in the base prompt?
- -How do you evaluate the results generated by the model for your tasks?
- Overall solution
- -What do you think about the overall solution (for recommending sentences for prompts)?
- -How would you embed those values in a prompt in absence of these recommendations?
- Any final question or comment?