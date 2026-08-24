---
source_file: P4YQIKJX.pdf
conversion_date: 2026-08-23T18:56:32.705318
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
<!-- image -->

TU/e

## Ethics &amp; AI: A systematic review on ethical concerns and related strategies for designing with AI in healthcare

## Citation for published version (APA):

Li, F., Ruijs, N., &amp; Lu, Y. (2023). Ethics &amp; AI: A systematic review on ethical concerns and related strategies for designing with AI in healthcare. AI, 4(1), 28-53. <!-- image -->

10.3390/ai4010003

## Document status and date:

Published: 01/03/2023

## Document Version:

Publisher's PDF, also known as Version of Record (includes final page, issue and volume numbers)

## Please check the document version of this publication:

- A submitted manuscript is the version of the article upon submission and before peer-review. There can be important differences between the submitted version and the official published version of record. People interested in the research are advised to contact the author for the final version of the publication, or visit the DOI to the publisher's website.
- The final author version and the galley proof are versions of the publication after peer review.
- The final published version features the final layout of the paper including the volume, issue and page numbers.

Link to publication

## General rights

Copyright and moral rights for the publications made accessible in the public portal are retained by the authors and/or other copyright owners and it is a condition of accessing publications that users recognise and abide by the legal requirements associated with these rights.

- Users may download and print one copy of any publication from the public portal for the purpose of private study or research.
- You may not further distribute the material or use it for any profit-making activity or commercial gain
- You may freely distribute the URL identifying the publication in the public portal.

If the publication is distributed under the terms of Article 25fa of the Dutch Copyright Act, indicated by the 'Taverne' license above, please follow below link for the End User Agreement:

www.tue.nl/taverne

## Take down policy

If you believe that this document breaches copyright please contact us at:

openaccess@tue.nl providing details and we will investigate your claim.

Download date: 23. Aug. 2026

<!-- PAGE 2 -->

<!-- image -->

Review

## Ethics &amp; AI: A Systematic Review on Ethical Concerns and Related Strategies for Designing with AI in Healthcare

Fan Li *, Nick Ruijs and Yuan Lu

Industrial Design Department, Eindhoven University of Technology, 5600 MB Eindhoven, The Netherlands * Correspondence: f.li@tue.nl

Abstract: In modern life, the application of artificial intelligence (AI) has promoted the implementation of data-driven algorithms in high-stakes domains, such as healthcare. However, it is becoming increasingly challenging for humans to understand the working and reasoning of these complex and opaque algorithms. For AI to support essential decisions in these domains, specific ethical issues need to be addressed to prevent the misinterpretation of AI, which may have severe consequences for humans. However, little research has been published on guidelines that systematically addresses ethical issues when AI techniques are applied in healthcare. In this systematic literature review, we aimed to provide an overview of ethical concerns and related strategies that are currently identified when applying AI in healthcare. The review, which followed the PRISMA guidelines, revealed 12 main ethical  issues:  justice  and  fairness,  freedom  and  autonomy,  privacy,  transparency,  patient safety and cyber security, trust, beneficence, responsibility, solidarity, sustainability, dignity, and conflicts. In addition to these 12 main ethical issues, we derived 19 ethical sub-issues and associated strategies from the literature.

Keywords: artificial intelligence (AI); ethics of AI; strategies; healthcare

## 1. Introduction

In recent years, AI has developed rapidly and it now affects people's lives in many fields, including healthcare [1], intelligent transportation [2], and education [3]. For instance, genetic  algorithms  are  used  to  predict  outcomes  in  critically  ill  patients  in healthcare [4]; sensing algorithms are applied for self-driving vehicles in smart transportation [5]; and natural language processing (NLP) is combined with machine learning (ML) to facilitate online learning in education [6]. As one of the core technologies of AI, ML has brought the development of AI to an advanced level [7,8]. ML employs algorithmic methods that enable machines to solve problems without explicit computer programming [9]. Deep learning (DL) is a subset of ML based on multi-layered artificial neural networks, which can be further utilized to solve complex problems using unstructured data, much like the human brain [10,11]. Healthcare is one of the most promising application domains for ML and DL [12]. AI techniques and their applications can help to detect cancer faster and earlier than before, make more accurate medical diagnoses, care for and monitor the elderly using robots, etc. [12 -14]. ML techniques can process massive amounts of data and make increasingly accurate assessments and predictions [15,16]. Although ML has advanced the development of AI, it also brings up ethical issues, especially in the healthcare domain [17 -19]. Ethics has been identified as a priority for developing and deploying AI across sectors [20,21]. Ethical decision making by AI systems refers to the computational process of evaluating and selecting alternatives in a manner compliant with social, ethical, and legal requirements [22]. The resulting ethical issues affect the further development and acceptance of AI, especially in healthcare, where technology must comply with the

Citation: Li, F.; Ruijs, N.; Lu, Y. Ethics &amp; AI: A Systematic Review on Ethical Concerns and Related Strategies for Designing with AI in Healthcare. AI 2023 , 4 , 28 -52. Academic Editors: Pablo Rivas and Gissella Bejarano

Received: 4 November 2022 Revised: 16 December 2022 Accepted: 22 December 2022 Published: 31 December 2022

<!-- image -->

Copyright: ©  2022 by the authors. Licensee MDPI, Basel, Switzerland. This article is  an open access article distributed under the terms and conditions of the Creative Commons Attribution (CC BY) license (https://creativecommons.org/licenses/by/4.0/).

<!-- image -->

<!-- PAGE 3 -->

law, regulations, and privacy principles to ensure the maintenance of the common good [13,17 -19].

The use of sophisticated ML algorithms employing DL and other complex techniques leads  to  black-box  models,  which  may  have  low  transparency  and  explainability  [23]. Black-box models make it difficult even for their developers to explain how an AI system makes decisions [24]. Meanwhile, users are confronted with decisions without an explanation for these decisions [25] . The 'black -box' nature of ML often clashes with legislation in high-stakes domains, where stakeholders can experience severe consequences if a bad decision is made. Particularly in the healthcare domain, where lives are at stake, the actual adoption of AI in everyday practice is limited by numerous factors, including accuracy, explainability, transparency, and compatibility [26]. This makes it important to promote the explainability of AI algorithms. Explainability is essential to responsible AI and can build trust in and engagement with AI [27]. Algorithmic transparency and explainability have been requested by several societal bodies, such as the government [26], the media [28,29], and the legal community [30]. The research community has embraced this notion over the last few years, and numerous efforts have been made to design explainable AI systems (e.g., [31,32]). Nevertheless, aside from explainability, multiple ethical concerns still exist when using AI-enabled solutions in the healthcare field, and they are gradually becoming the dominant factors influencing the adoption of AI.

Policymakers and related professionals have been looking for approaches to cope with the ethical risks associated with AI development. Examples of rules and regulations are the 'Ethics Guidelines for Trustworthy AI' from the European Commission [33] , 'Report on the Future of Artificial Intelligence' from the US [34] , and the 'Beijing AI Principles' from the Chinese government [35]. Among these governing bodies, the European Union (EU) has been acknowledged as a leader in establishing a framework for ethical regulations and rules for AI [36]. Unlike the other two sets of guidelines, the fundamental principle of the EU guidelines is to promote a ' humancentered' approach that respects European values and regulations [33]. The ethical challenges addressed by the EU framework are globally relevant. As they are based on a fundamental-rights approach, the relevance and importance of these guidelines can be considered universal. The authority and obligations underlying these guidelines form the framework for most of the United Nations'  (UN) Sustainable Development Goals (SDGs) .  This  also  affects  the  development strategies in low- and middle-income countries outside the EU [37]. These guidelines apply to all industrial sectors, and none of them are specifically and directly related to AI's ethical and legal aspects in healthcare.

In addition to the ethical regulations and policies mentioned above, many academic publications discuss general ethical issues related to AI. Examples are 'The global landscape of AI ethics guidelines' by Jobin's group, which presents an overview of existing ethical guidelines and strategies [38] ; 'The Ethics of AI Ethics: An Evaluation of Guidelines' by Hangendorff, which analyzes 22 ethical guidelines for AI, and providing recommendations for overcoming their relative ineffectiveness [39] ; and 'Artificial intelligence ethics guidelines for developers and users: clarifying their content and normative implications' by Ryan and Carsten Stahl, which provides a elaborative explanation of 11 normative implications of current AI ethical guidelines directed to AI developers and organizational users [40]. Although these three documents present very useful discussions of ethical AI issues in a general domain, none of them specifically address the ethics of AI in healthcare.

Academic publications discussing the ethical issues concerning AI in healthcare do exist, such as 'The ethics of AI in health care: A mapping review' by Morley's research group [41] ,  'Ethical and legal challenges of artificial intelligence -driven healthcare' by Gerke's group [42] , and 'A governance model for the application of AI in healthcare' by Reddy's group [43]. Mor ley's group focused on mapping the ethical issues based on epistemic, normative, and overarching perspectives [41] .  Gerke's group explored ethical issues from the perspective of legal challenges, but did not present a systematic review of

<!-- PAGE 4 -->

how AI can influence them in healthcare applications [42] . Reddy's group addressed the introduction and implementation of a proposed governance model in healthcare. However, their specification of the ethical issues only focused on the general governance model for ethical issues related to the essential elements of safety and the responsible use of AI.

In short, governmental policy and academic research have often addressed the ethics of  AI  in  a  general  sense,  but  have  devote  much  less  attention  to  the  specific  field  of healthcare. Some of the publications do elaborate on AI ethical issues in healthcare, but they fail to give a systematic overview of the ethical issues identified in the application of AI techniques in healthcare.

In this literature review, we aimed to provide an overview of the currently identified ethical concerns related to AI in healthcare. Specifically, the following questions were answered: (1) what are the ethical issues related to AI in healthcare, and (2) what are the ethical strategies related to AI in healthcare? In this way, we aimed to help development teams working on AI for healthcare take the necessary actions to proactively manage ethical issues related to AI in their design processes.

This paper is organized as follows: Section 2 presents the methodology applied in the systematic review; Section 3 presents the review results; Section 4 discusses the results and provides the conclusions of this paper.

## 2. Methods

We applied a systematic literature review as an approach to conduct our study. This is an approach which involves evaluating and interpreting all existing primary studies concerning a particular research question, topic, or phenomenon of interest [44]. We followed the PRISMA guidelines to develop the methods for planning and realizing our study [45]. A protocol regarding our review was conducted and registered in PROSPERO, a prospective international register of systematic reviews [46].

The following processes were implemented in this study: the literature search strategy, the eligibility criteria, the selection process, quality assessments, and data synthesis. Three independent reviewers were involved in the research process. Reviewers 1 and 2 performed the PRISMA selection and screening processes in parallel, which limited the possible risk of bias in both selection and reporting. The 3rd reviewer took charge of the validation of the research process.

## 2.1. Literature Search Strategy

A literature search was conducted in the following 5 databases: ACM, PubMed, Nature-SCI, IEEE Xplore, and the AI Ethics Guidelines Global Inventory. The first 3 databases  are  academic  databases  and  the  last  one  is  a  searchable  inventory  of  published frameworks that list AI ethical values. Therefore, our search included both academic research and gray literature containing principles and guidelines for ethical AI. Documents addressing the following aspects were selected: artificial intelligence, healthcare, ethics, and guidelines. The literature search was conducted through an automatic search in each search engine listed, using the keywords and synonyms presented in Table 1. The exact search strings are listed in Appendix A. After the review started, we defined the search period as being between January 2010 and September 2020.

<!-- PAGE 5 -->

Table 1. Keywords and synonyms.

| Keywords                | Synonyms                                                                                                                                                                                                                                                        |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Artificial Intelligence | 'Artificial Intelligence' OR 'AI' OR 'Machine Learning' OR 'ML' OR 'Deep Learning' OR 'Artificial Neural Networks' OR 'Computer Vision' 'Healthcare' OR 'Medical care' OR 'care' OR 'Diagnosis pro- cesses' OR 'treatment protocol development' OR 'drug devel- |
| Healthcare              | opment' OR 'personalized medicine' OR 'patient monitoring' OR 'Medicine' OR 'Radiology' OR 'Pathology' OR 'Decision Supp ort Systems' 'Ethics' OR 'Fairness' OR 'Integrity' OR 'Virtues' OR 'Value -                                                            |
| Ethics                  | System' OR 'Ethical Values' OR 'Rightness' OR 'Moral' OR 'Morality'                                                                                                                                                                                             |
| Guidelines              | 'Guidelines' OR 'Recommendations' OR 'Instructions' OR 're- quirements' OR 'principles' OR 'regulations' OR 'sugges- tions' OR 'advice' OR 'Rules' OR 'standard' OR 'criteria'                                                                                  |

## 2.2. Eligibility Criteria

The eligibility criteria are specified as inclusion and exclusion criteria in Table 2. We stipulated that the selected documents had to be aligned with the inclusion and exclusion criteria to fit the scope of our research.

Table 2. Inclusion and exclusion criteria (documents published between 1/1/2000 and 6/9/2020).

|   No. | Inclusion                                              | No.   | Exclusion                                                    |
|-------|--------------------------------------------------------|-------|--------------------------------------------------------------|
|     1 | Written in English                                     | 1.    | Did not mention ethical issues or guide- lines related to AI |
|     2 | Mentions ethical issues related to AI or guidelines 2. |       | Did not focus on the application area of healthcare          |
|     3 | Highlights the application area of healthcare 3.       |       | Did not have more than 10 citations                          |
|     4 | Published between 1/1/2000 and 6/9/2020                |       |                                                              |

## 2.3. Selection Process

The document selection process was based on the following steps:

1. The preliminary collection of studies from the database search; in this step, 2 reviewers worked independently and applied the search strings to the 5 selected databases. Meanwhile, these 2 reviewers also worked in parallel to follow the inclusion criteria of the publishing period from January 2010 and September 2020, and determined that the text was written in English.
2. Titles and abstracts were screened according to eligibility criteria (Table 2), and duplicates were removed. After collecting preliminary studies, the titles and abstracts were screened according to inclusion criteria 1 and 2, relating to ethical issues and guidelines in the healthcare domain. All documents were organized in a table with the following columns of reference: issues, strategies, and healthcare application area. These issues were compared and synthesized in a list, where the number of documents referencing each issue was recorded. Additionally, duplicate documents were removed in this step.
3. Full texts were screened in regard to the inclusion and exclusion criteria (Table 2). In this step, we aimed to select the primary studies for the systematic literature review; 2  reviewers  read  independently  through  the  full  texts  of  the  documents  and

<!-- PAGE 6 -->

evaluated the records based on the inclusion and exclusion criteria. A consensus was reached after discussing the reasons for several disagreements that occurred.

## 2.4. Quality Assessment

The quality assessment questions in this study (Table 3) were designed according to the quality assessment checklist provided by Kitchenham and Charters [47] to assess and evaluate the quality of the selected primary documents and remove bias. Each selected primary study was scored with the quality questions presented in Table 3. Documents addressing the quality assessment questions were assigned 1 point, 0.5 points were assigned to documents that partially addressed the questions, and 0 points were assigned to studies with no evidence of addressing the questions.

Table 3. Quality assessment questions.

|   No. | Quality Questions                                                                        | Score   |
|-------|------------------------------------------------------------------------------------------|---------|
|     1 | Does the adopted research method address the research questions?                         | 1/0.5/0 |
|     2 | Does the study have a clear research objective?                                          | 1/0.5/0 |
|     3 | Does the study have a specific description of each ethical issue?                        | 1/0.5/0 |
|     4 | Does the study have a specific description of strategies related to the ethi- cal issue? | 1/0.5/0 |
|     5 | Do the results of the study add value to the area of research?                           | 1/0.5/0 |

## 2.5. Data Synthesis

As  already  discussed  in  the  introduction,  many  academic  publications  have  discussed general ethical issues related to AI. The global landscape of AI ethics guidelines by Jobin's group (2019) identified 11 issues based on a scoping review of ethical guidelines related to AI solutions applied to a general domain [38]. It established a systematic overview of the global landscape of existing ethical guidelines and strategies, and has been widely cited in this academic area. We applied these 11 issues, together with the Ethics Guidelines for Trustworthy AI (EGTAI) provided by the European Commission, as a departure point to categorize the issues identified in our research in the healthcare field [36,38]. We were able to add or remove more relevant or less prominent issues in our review because Jobin et al. (2019) discussed the ethical issues of AI solutions for the purpose of providing a broad overview. In our study, we aimed to address the ethical issues in healthcare, which may have led to differences due to the differing scope of the previous literature review and its results.

Based on the work of Jobin (2019) and the EU's EGTAI, two reviewers carried out the thematic code-mapping process. In this proc ess, they applied Jobin's ethical principles and the codes identified in the existing AI guidelines as the foundation and added one code, 'control,' derived from EGTAI [36,38]. The code-mapping process consisted of two iterations of themes; one was the ethical issues and the other was the related codes. We used the abductive methodology, including inductive and deductive approaches, during the code mapping process. We first used a deductive approach to deduct selected documents based on Jobin's work. We found that ethical issues in the healthcare field have their own focus, which is different from Jobin's focus . According to the differences identified, we also applied an inductive approach to identify new ethical issues, and some issues were also renamed according to the content of the selected documents. Eventually, the ethical issues finally identified in our study were different from Jobin's guidelines, as shown in Section 3.

<!-- PAGE 7 -->

## 3. Results

In the phase of preliminary study collection, the search string retrieved a total of 303 documents, of which 5 were from the ACM Digital Library; 131 from PubMed; 90 from Nature-SCI; 73 from IEEE Xplore, and 4 were from the AI Ethics Guidelines Global Inventory (Figure 1). The selected documents fulfilled the inclusion criteria of being written in English and published between January 2010 and September 2020. Two reviewers worked in parallel to obtain the results of this phase. As can be seen in Figure 1, out of the 303 documents obtained from the database search, the titles and abstracts of 300 unique documents were selected after removing duplicates. Of these 300 documents, 122 full documents were screened on the basis of the inclusion criteria regarding ethical issues and guidelines in the healthcare domain. This eventually resulted in 45 documents which were subjected a thorough full-text analysis, excluding 76 documents based on the inclusion and exclusion criteria.

Figure 1. PRISMA flowchart of the results of the literature search.

<!-- image -->

<!-- PAGE 8 -->

We observed the following distribution of the databases used: 30 from PubMed; 7 from Nature-SCI, 4 from AI Ethics Guidelines Global Inventory, 3 from IEEE Xplore, and 1 from ACM Digital Library. T he works' scores in the quality assessment stage are displayed in Table 4 in decreasing order.

Table 4. Studies' quality assessment scores in decreasing order.

|   No. | Document                                                                                                                                                    | Citation   |   Score |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|---------|
|     1 | Digital Technology and Healthcare Which Ethical Issues for Which Regulations?                                                                               | [48]       |     5   |
|     2 | Artificial Intelligence in Healthcare (2019)                                                                                                                | [49]       |     5   |
|     3 | How to achieve trustworthy artificial intelligence for health.                                                                                              | [37]       |     5   |
|     4 | Protecting Your Patients' Interests in the Era of Big Data, Artificial Intelligence, and Predictive Analytics.                                              | [50]       |     5   |
|     5 | Ethical considerations about artificial intelligence for prognostication in intensive care.                                                                 | [51]       |     5   |
|     6 | Acritical perspective on guidelines for responsible and trustworthy artificial intelli- gence.                                                              | [52]       |     5   |
|     7 | Trust in and Ethical Design of Carebots: The Case for Ethics of Care.                                                                                       | [53]       |     5   |
|     8 | Artificial intelligence and medical imaging 2018: French Radiology Community white paper.                                                                   | [54]       |     5   |
|     9 | Ethical principles for the application of artificial intelligence (AI) in nuclear medicine.                                                                 | [55]       |     5   |
|    10 | Ethical considerations for artificial intelligence: an overview of the current radiology landscape.                                                         | [56]       |     4.5 |
|    11 | Ethical Considerations of Using Machine Learning for Decision Support in Occupa- t ional Health: An Example Involving Periodic Workers' Health Assessments. | [57]       |     4.5 |
|    12 | AI in Cardiac Imaging: AUK-Based Perspective on Addressing the Ethical, Social, and Political Challenges                                                    | [58]       |     4.5 |
|    13 | Five guiding principles for responsible use of AI in healthcare and healthy living.                                                                         | [59]       |     4.5 |
|    14 | Ethical Artificial Intelligence for Digital Health Organizations.                                                                                           | [60]       |     4.5 |
|    15 | Reporting guidelines for clinical trial reports for interventions involving artificial intel- ligence: the CONSORT-AI extension.                            | [61]       |     4.5 |
|    16 | Recommendations for the ethical use and design of artificial intelligent care providers.                                                                    | [62]       |     4.5 |
|    17 | Building the case for actionable ethics in digital health research supported by artificial intelligence.                                                    | [63]       |     4.5 |
|    18 | Artificial intelligence: Who is responsible for the diagnosis?                                                                                              | [64]       |     4.5 |
|    19 | Predictably unequal: understanding and addressing concerns that algorithmic clinical prediction may increase health disparities.                            | [65]       |     4.5 |
|    20 | Ethics of artificial intelligence in radiology: Summary of the joint European and North American multi-society statement.                                   | [66]       |     4.5 |
|    21 | Agovernance model for the application of AI in health care.                                                                                                 | [43]       |     4.5 |
|    22 | Guidelines for clinical trial protocols for interventions involving artificial intelligence: the SPIRIT-AI extension.                                       | [67]       |     4.5 |
|    23 | Your Robot Therapist Will See You Now: Ethical Implications of Embodied Artificial Intelligence in Psychiatry, Psychology, and Psychotherapy                | [68]       |     4   |
|    24 | Secure, privacy-preserving and federated machine learning in medical imaging                                                                                | [69]       |     4   |
|    25 | On the ethics of algorithmic decision-making in healthcare.                                                                                                 | [70]       |     4   |
|    26 | Artificial intelligence in health care: accountability and safety.                                                                                          | [71]       |     4   |
|    27 | Do no harm: a roadmap for responsible machine learning for health care                                                                                      | [72]       |     4   |
|    28 | Digital technologies in the public-health response to COVID-19                                                                                              | [73]       |     4   |
|    29 | Leveraging Artificial Intelligence to Improve Voice Disorder Identification Through the Use of a Reliable Mobile App                                        | [74]       |     4   |
|    30 | Operationalizing Data Justice in Health Informatics                                                                                                         | [75]       |     4   |

<!-- PAGE 9 -->

|   31. | Causal inference and counterfactual prediction in machine learning for actionable healthcare                                                                     | [76]   |   3.5 |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|-------|
|    32 | Protecting Life While Preserving Liberty: Ethical Recommendations for Suicide Pre- vention with Artificial Intelligence.                                         | [77]   |   3.5 |
|    33 | Fairness in Machine Learning for Healthcare                                                                                                                      | [78]   |   3.5 |
|    34 | Data mining for health: staking out the ethical territory of digital phenotyping                                                                                 | [79]   |   3.5 |
|    35 | Observational Measures for Effective Profiling of Healthcare Staffs' Security Practice (2019)                                                                    | [80]   |   3.5 |
|    36 | Ethical Issues Raised by the Introduction of Artificial Companions to Older Adults with Cognitive Impairment: ACall for Interdisciplinary Collaborations         | [81]   |   3.5 |
|    37 | Ensuring Fairness in Machine Learning to Advance Health Equity (2018)                                                                                            | [82]   |   3.5 |
|    38 | Ethical concerns with the use of intelligent assistive technology: findings from a quali- tative study with professional stakeholders.                           | [83]   |   3.5 |
|    39 | Stigma, biomarkers, and algorithmic bias: recommendations for precision health with artificial intelligence.                                                     | [84]   |   3   |
|    40 | Societal Issues Concerning the Application of Artificial Intelligence in Medicine                                                                                | [85]   |   3   |
|    41 | Global Evolution of Research in Artificial Intelligence in Health and Medicine: ABibli- ometric Study                                                            | [86]   |   3   |
|    42 | Sport and exercise genomics: the FIMS 2019 consensus statement update.                                                                                           | [87]   |   3   |
|    43 | Computing schizophrenia: ethical challenges for machine learning in psychiatry.                                                                                  | [88]   |   3   |
|    44 | Transparency of Health Informatics Processes as the Condition of Healthcare Profes- sionals' and Patients' Trust and Adoption: The Rise of Ethical Requirements. | [89]   |   3   |
|    45 | Artificial intelligence and the radiologist: the future in the Armed Forces Medical Ser- vices.                                                                  | [90]   |   3   |

Table 5 lists the ethical issues that we identified based on the 45 selected documents. As highlighted in the Methods section, we added one codeword based on the fact that it was addressed in EGTAI. We added the term 'control' as the related code word signifying the main ethical issue of freedom and 'autonomy' for the thematic code mapping process [33] . EGTAI emphasizes that 'control' is one of the fundamental human rights to be recognized when applying AI solutions [33]. After the synthesis of the data, we established 11 main ethical issues and 19 sub-issues as the initial results (Table 5). The ethical subissues were derived from the code mapping of the related codewords. We were not able to apply all the codes from Jobin's work, as the selected documents could not be matched to all of them. After the thematic code mapping, as part of the data synthesis processes, we added ' conflicts ' as the 12th main ethical issue. 'Conflict' is not mentioned in the work of Jobin et al. (2019). This decision was made on the basis of full-text screening and the detailed interpretation of the selected documents. Conflict has two components: one is related to the conflicting goals between government policy and users, and the other is related to conflict in decision-making between the doctors and patients. In addition, we renamed the issue of ' nonmaleficence' in Jobin's work as ' patient safety and cyber security'. The reason for this was that, according to the selected documents, the ethical issue of non-maleficence addresses patient safety and cyber security.

An overview and specification of the results obtained in different stages of the selection process are presented in Table 5. After the full-text thematic analysis, the ethical issues related to AI that were identified in each document were synthesized into 12 overarching main ethical issues. These were justice and fairness, freedom and autonomy, privacy, transparency, patient safety and cyber security, trust, beneficence, responsibility, solidarity, sustainability, dignity, and conflicts. Table 5 also shows the results of the thematic analysis of each main ethical issue related to AI and its related sub-issues in the selected documents. There were 19 ethical sub-issues included among the main issues.

<!-- PAGE 10 -->

Details regarding the specification of the main ethical issues and related sub-issues are elaborated further in this section.

Table 5. Overview and specification of identified ethical issues related to AI.

| No.   | Main Ethical Issues               | No.   | Ethical Sub-Issues                    | No.                                   | References                                                     |
|-------|-----------------------------------|-------|---------------------------------------|---------------------------------------|----------------------------------------------------------------|
| 1.    | Justice and fairness              | 24/45 | Bias                                  | 22/24                                 | [43,48,49,51,53 - 56,58,59,65,68 - 70,72,75,76,78,82,85,88,89] |
|       |                                   |       | Fairness                              | 10/24                                 | [37,49,58,59,65,69,70,78,82,85]                                |
|       |                                   |       | Discrimination and Equality           | 10/24                                 | [43,48 - 51,56,58,65,75,89]                                    |
| 2.    | Freedom and autonomy              | 22/45 | Control                               | 12/22                                 | [37,43,48,52,54,66,71,75,77,79,80,83]                          |
|       |                                   |       | Respecting human au- tonomy           | 9/22                                  | [37,51,52,60,68,70,77,83,88]                                   |
|       |                                   |       | Informed consent                      | 9/22                                  | [48 - 50,53,58,70,75,81,83]                                    |
| 3.    | Privacy                           | 20/45 | Data privacy                          | 20/20                                 | [43,48,50,53,55,57,58,60,62,66,68,73 - 75,77,80,83,85,87,89]   |
|       |                                   |       | Confidentiality                       | 9/20                                  | [50,51,53,55,68,74,77,83,89]                                   |
| 4.    | Transparency                      | 18/45 | Transparency                          | 15/18                                 | [48,52,55,56,58,59,61,67,68,73,79,83,86, 89,90]                |
|       |                                   |       | Explainability                        | 5/18                                  | [43,58,84,85,89]                                               |
| 5.    | Patient safety and cyber security | 14/45 | Patient safety                        | 9/14                                  | [37,48,49,60,66,71,72,79,89]                                   |
|       |                                   |       | Cyber security                        | 6/14                                  | [52,68,74,80,83,89]                                            |
| 6.    | Trust                             | 12/45 | [43,48,49,53,54,58,60,62,68,80,84,89] | [43,48,49,53,54,58,60,62,68,80,84,89] | [43,48,49,53,54,58,60,62,68,80,84,89]                          |
| 7.    | Beneficence                       | 11/45 | [43,51,53,55 - 57,59,81,83,88,89]     | [43,51,53,55 - 57,59,81,83,88,89]     | [43,51,53,55 - 57,59,81,83,88,89]                              |
| 8.    | Responsibility                    | 9/45  | [43,54 - 56,66,70,71,79,80]           | [43,54 - 56,66,70,71,79,80]           | [43,54 - 56,66,70,71,79,80]                                    |
| 9.    | Solidarity                        | 8/45  | [48,49,52,53,56,58,62,83]             | [48,49,52,53,56,58,62,83]             | [48,49,52,53,56,58,62,83]                                      |
| 10.   | Sustainability                    | 7/45  | [37,55,57,59,73,75,83]                | [37,55,57,59,73,75,83]                | [37,55,57,59,73,75,83]                                         |
| 11.   | Dignity                           | 7/45  | [51,53,54,62,66,70,80]                | [51,53,54,62,66,70,80]                | [51,53,54,62,66,70,80]                                         |
| 12.   | Conflict                          | 7/45  | [37,51,54,57,64,66,83]                | [37,51,54,57,64,66,83]                | [37,51,54,57,64,66,83]                                         |

In the following, all the identified main ethical issues and sub-issues, as well as the related coping strategies, are discussed in detail.

## 3.1. Main Ethical Issue 1: Justice and Fairness

As it can be seen in Table 5, justice and fairness was found to be the most prevalent ethical issue (in 24 out of 45 sources). Justice and fairness were mainly expressed in reference to bias, fairness, discrimination, and equality. This theme is related to the fair distribution of medical goods and services, without discrimination among individuals.

## 3.1.1. Bias

As can be observed in Table 5, bias was the most frequently discussed ethical issue related to justice and fairness (N = 22). In healthcare, bias is mainly caused by self-learning algorithms implemented during the self-learning process [54,65]. It can come from ' algorithmic bias' due to a systematic error or an unintended tendency of AI algorithms to prefer one outcome over another [49,56], such as self-fulfilling [49], overfitting [54], or black-box problems [49,58]. In addition, the training data used as inputs, especially inappropriate and poorly representative training data for AI models, represent another factor contributing to the issue of bias [43,49]. Such input biases can arise when the input data used for training the model do not represent the full spectrum of the target population or when the system has incomplete data [43,49].

<!-- PAGE 11 -->

In the selected documents, sampling bias [43,65,78] and gender bias [56,59] were notable issues related to input data. Sampling bias is a well-known and influential issue, exemplified in the Framingham Heart Study, which included people from Framingham, a  small,  racially  homogeneous town in Massachusetts. Sampling bias can result in the over-treatment or under-treatment of certain ethnic groups [65]. Gender bias [56,59] arises, for example, when AI algorithms only learn from predominantly male data, which may cause an AI-powered clinical decision support tool not to capture fully the complexities of a disease in women [59]. For example, 80% of spontaneous coronary artery dissection (SCAD), a condition that can tear blood vessels in the heart, involves women. Still, women are underrepresented in clinical trials investigating SCAD [59].

## 3.1.2. Fairness

Fairness was the second-most frequently discussed ethical sub-issue within main ethical issue 1. Ten selected documents addressed this issue (Table 5). It is one of the fundamental foundations of justice and fairness, and along with bias, fairness has been a topical issue for centuries [78]. The complexity and opaqueness of most ML algorithms affect the fairness of AI systems. They lead to an unexplainable decision-making process and output, which makes it difficult to know if the AI system is fair or not [70,85].

In particular, two factors within the area of fairness could be distinguished in the literature: gender and ethnicity [78,85]. One of the earliest cases involving both factors dates  back  to  the  1970s,  when  algorithms  were  used  by  St George's H ospital  Medical School in the United Kingdom to discriminate based on gender and race in making initial screening decisions for medical school applicants [78]. Some organizations do not hold data on gender and ethnicity, which can cause a lack of fairness for legal, institutional, or commercial reasons. However, without these data, the risk of indirect discrimination also increases [85].

## 3.1.3. Discrimination and Equality

Similarly to the issue of fairness, issues related to discrimination and equality were discussed in 10 documents (Table 5). Due to the data-driven nature of AI technology, discrimination mainly stems from the selection of training datasets [51]. An AI solution could lack equality if the training data are not representative or if the target is not appropriately selected [50] . For instance, France Assos Santé has emphasized that 'one of the dangers often identified with the computerization of health data concerns the practice of risk selection by insurance companies' [48].

Additionally, aggregated data may be used to make decisions about larger populations or to create groups that did not previously exist, which could lead to discrimination, profiling, or surveillance [50]. Some AI models deployed in domains outside of healthcare have shown racial biases/discrimination [43,48,49,56,65,75], such as overestimating criminal recidivism among members of certain racial groups [43]. This ethical issue also appears in the healthcare domain. In the United States, a healthcare allocation algorithm has been widely used to determine patients' healthcare needs and thus implement services that exhibit significant racial bias. For instance, African American patients were significantly ' sicker ' than white patients who obtained the same scores and, therefore, the same services through the algorithm [56,58].

<!-- PAGE 12 -->

## 3.1.4. Strategies for Main Ethical Issue 1

Regarding the issue of justice and fairness, the selected documents call for the following strategies, emphasizing AI algorithmic and data-related perspectives.

- Algorithmic perspective
- Purify the algorithms of AI-based decision support tools [85] by
- Understanding the difference between the training data and input  data [55,82] before utilizing an AI algorithm and preprocessing the training dataset; and
- Evaluating ecological  validity  when  considering  the  output  of  the  algorithms [55].
- Manage fairness constraints and distribution in ML algorithms by
- Validating algorithms for different subpopulations from a technical perspective [59]; and
- Compensating for disadvantaged subgroups on an egalitarian basis if necessary [70].
- Data perspective
- Guarantee that the input data collection and analysis are conducted in a mindful, objective, and diverse manner [59,78].
- Encourage the cooperation of stakeholders, including ethicists, social scientists, and regulatory scholars, in the development of AI systems [72].

## 3.2. Main Ethical Issue 2: Freedom and Autonomy

The second-most frequently addressed issue was freedom and autonomy. As can be seen in Table 5, there were 22 documents related to this issue. In the selected literature, this main ethical issue included the sub-issues of control, respecting human autonomy, and informed consent.

## 3.2.1. Control

Table 5 shows that 12 documents emphasized this issue. Based on these sources, we understand that the issue of control concerns the management of the data involved in the AI system [48,54,66,75,80,83]. It reflects the ability of individuals to control their data that are used by different stakeholders [75], as well as the ability of end-users to control their own data and thus secure their privacy directly [83]. Control also relates to the decisions or recommendations regarding the AI systems used in clinical diagnosis [37,54,71]. The control of decision-making can only be safeguarded through the development of AI and applying human intelligence in line with human values and needs [37]. Control in AI systems is related to moral responsibility and influences the accountability of patient harm [71]. For example, clinicians do not have direct control over the decisions and recommendations that the AI system makes [71]. Furthermore, clinicians lack an understanding of how AI systems translate the input data into output decisions because of the opaque nature of AI systems [71]. Additionally, a lack of robust control over AI system s' recommendations will harm patients ' trust in the clinical care they receive [71]. The issue of informed consent also influences the primary control of medical information in healthcare [79].

## 3.2.2. Respecting Human Autonomy

As shown in Table 5, nine studies were identified discussing this issue. In the context of healthcare, the sub-issue of respecting human autonomy refers to the respect for patient autonomy [37,51]. It could also be called respecting patient choice, recognizing the individual's ability for self-determination and the right to make choices based on their values and beliefs [51]. The opacity of MLbased decisions can potentially threaten patients' autonomy by impairing the authority of physicians and the shared decision-making between doctors and patients [37,70]. For instance, algorithms applied in healthcare enforce the paternalistic model by prescribing values on ranked treatment options, which ignore the

<!-- PAGE 13 -->

patient's preferences and harm their autonomy [37]. The use of highly autonomous decision-making systems  can  raise  the  issue  of  autonomy  by  manipulating  patients  to  do things they should not do or have not considered thoroughly [68].

## 3.2.3. Informed Consent

We identified nine documents discussing the sub-issue of informed consent (Table 5). Informed consent usually refers to general consent to treatment, a specific procedure, or participation in research. The nine sources reviewed here discuss how informed consent relates to the data involved in AI systems [48,50,70,75,83]. First, consent in the field of health research empowers the people involved to confirm (or reject) the sharing of their data and, in the meantime, to comprehend who their data will be shared with and the data sharing plan [48]. Secondly, obtaining consent from a subject to share their information with a 3rd party is obligated and non-negotiable [83]. Thirdly, asking for consent is necessary due to the opaqueness of ML algorithm systems, as the sensitive information will be stored in the system. Next, predicting possible AI approaches may require different consent, such as blanket consent [50] and tiered consent [31], according to multiple levels, and mechanisms must be created to deal with patients who do not wish to be included in such exercises [50]. Lastly, the sources also suggest that obtaining consent is critical and obligatory for both competent and incompetent users, ensuring that they are respected and their privacy is maintained when exposed to monitoring technologies [81].

## 3.2.4. Strategies for Main Ethical Issue 2

To cope with the issue of freedom and autonomy, various strategies were found in the selected documents.

To cope with the sub-issue of control, the publications proposed the following strategies:

- Ensure that human beings stay in control and that they are the final decision-makers [48]; and
- Develop regulations and codes of conduct to maintain the rights of human users' to control their data, specifically regarding the control of the different versions, as well as the usage and disclosure, of their data [66,80], and understanding the full spectrum of AI to enable clinicians to control the technology [43].

To cope with the issue of respecting human autonomy, the literature calls for the following strategies:

- Reach a universal understanding of the medical issues that patient -clinician relationships need to deal with [51];
- Discuss patient autonomy in the context of trust, on which the concept of shared decision-making concept and the legal responsibilities within the system are based [51];
- Respect the physicians' judgments within the modern healthcare system [88]; and
- Ensure transparent AI so that patients comprehend that the intelligent system does not dominate human-judgment [68].

To cope with the issues related to informed consent, the literature recommends the

## following strategies:

- Communicate with vulnerable groups carefully before consent is obtained [53];
- Apply advance directives to understand the expressed wishes of senior citizens and respect their autonomy in the progression of their disease [83];
- Comprehend vulnerable group s' decisions about intelligent assistive technology before their cognitive impairment worsens [83];
- Use behavioral observation to detect patients' behaviors indicating the withdrawal of obtained consent due to discomfort and disease progression [83]; and
- Customize informed consent to ensure that each patient understands the purpose and the risks of using AI solutions, such as care bots [53].

<!-- PAGE 14 -->

## 3.3. Main Ethical Issue 3: Privacy

Table 5 shows that 20 documents were identified related to this issue. Within these documents, this issue was addressed in terms of data privacy and confidentiality.

## 3.3.1. Data Privacy

Twenty documents addressed data privacy, which made it the most frequently addressed sub-issue of the main issue of privacy (Table 5). Data privacy refers to the control over the individual's health information [50,55]. For example, a care robot caring for vulnerable patients may collect information about that person 24/7, and the collected data might be transferred to the hospital for medical purposes. This condition will go against the patients' privacy rights and self -control, such as rejecting treatment provided by care robots or related stakeholders [50]. Data privacy issues can be caused by three factors: data usage [55,62,87,89], data ownership [53], and custodianship [57]. Particularly, data usage issues were caused by

- The use of sensitive or personal health information without the patient being aware [50,53,62,68,85]; and
- The misuse of sensitive or personal health information for financial benefits [55,57,62]. Some sources mentioned that privacy also affe cts  users'  trust [62]  and  autonomy [62,77] when using AI-powered solutions in healthcare. A few sources also addressed the influence of privacy on data ownership [55], discrimination [50], stigmatization [50], dignity [62], and well-being [62].

## 3.3.2. Confidentiality

Nine documents addressed confidentiality, the second sub-issue of main ethical issue 3 (Table 5). Confidentiality refers to the responsibility of maintaining the privacy of anyone entrusted with these data [50,55]. Similarly to data privacy, confidentiality also relates to the scope, appropriate storage, access, and dissemination of sensitive data [53]. Based on the reviewed sources, security risks have the greatest effect on confidentiality when applying AI systems in healthcare [53,74,83,89]. During the process of sharing and transmitting patients' data to third parties, the data can be subjected to security attacks or privacy violations [53,74,83,89]. For instance, most studies on mobile disorder detection systems use mobile devices to acquire useful signals, transmit them to external servers for analysis, and visualize and communicate the results to users [74]. Afterwards, the collected users' data are stored in the database and thus face the risk of being hacked [53,55].

## 3.3.3. Strategies for Main Ethical Issue 3

Regarding the issue of privacy, the selected documents call for the following strategies:

- Establish strict rules about data acquisition, data flow management, anonymization, and security [89];
- Store and transfer data securely within regulatory requirements when designing and implementing AI solutions in healthcare [55];
- Ensure that  data  transmission  occurs  with patients'  consent  and  ethical  approval [55,83];
- Restrict identifiable health data during data sharing and protection [48,89];
- Balance privacy and personal data sharing, especially in regard to the use of new technologies to enable the automated collection and analysis of health data [89];
- Make sure that data analysis within healthcare follows the code of ethics, laws, and regulations [87]; and
- Incorporate legal rules regarding access to public databases into criminal law [48].

<!-- PAGE 15 -->

## 3.4. Main Ethical Issue 4: Transparency

## 3.4.1. Transparency

Transparency was the most emphasized sub-issue grouped under the main ethical issue of transparency, and 15 of the selected documents discussed this sub-issue (Table 5). Transparency refers to the possibility of understanding an AI system's decision -making process [56]. The black-box nature of most AI algorithms causes a lack of transparency regarding  the  inner  reasoning  of  specific  AI  techniques  [55,56,58,90],  especially  deep learning. In particular, the blackbox's fundamental steps of analysis are opaque, as is the decision-making  process  [56,89].  These  issues  are  exacerbated  when  algorithms  are trained on biased data or exclude certain demographic characteristics [56]. For instance, an AI algorithm used in the United States of America to predict accused persons' future recidivism rates showed that the risk scores for an African American with minor crimes were higher than a white American who had committed multiple crimes [65]. Trust, public  trust,  patient trust, and the adoption of AI in healthcare will eventually depend on transparency [52,59,79,89]. Additionally, the processing of sensitive data such as individual medical records raises the issue of transparency [83].

## 3.4.2. Explainability

Next to transparency, explainability is another sub-issue related to main ethical issue 4, and five documents were found to address this sub-issue (Table 5). Similarly to transparency, explainability is associated with the black-box nature of ML and AI algorithms, which lead to difficulty in explaining and interpreting the relationship between input data and outcomes [58,85]. Explainability can create or increase the trust of users in AI systems [84]. The better the AI system's e xplanation, the higher the level of trust in the application of AI in the medical field [84,85]. Without explainability, medical professionals will encounter difficulty in ensuring the system's credibility and inspir ing trust in a decision that they cannot even explain to anyone, be it a patient or another medical professional [85].

## 3.4.3. Strategies of Main Ethical Issue 4

To deal with the issues of transparency and explainability, the sources propose the following strategies:

- Enable AI solutions to be transparent and explainable to patients in terms of the AI algorithms and the decisions regarding their treatments [55,68];
- Elaborate the data collected from patients for medical use, such as digital phenotyping [79];
- Embed transparency in data analysis after collecting the data [79];
- Ensure that the AI system is clear and transparent regarding its data analysis approach [79];
- Develop AI-enabled solutions in partnership with different stakeholders to achieve the ideal level of transparency [59];
- Consider the various needs, demands, and concerns that emerge during collaboration with stakeholders in the healthcare system [59]; and
- Ensure that the legislation addressing the need for the AI system and its decisionmaking contains guarantees regarding transparency and explainability to stakeholders [89].

## 3.5. Main Ethical Issue 5: Patient Safety and Cyber Security

## 3.5.1. Patient Safety

In the main ethical issue of patient safety and cyber security, patient safety was the most frequently discussed sub-issue, being addressed in nine documents (Table 5). Patient safety is an essential element in healthcare and is a central subject of debate every time AI is introduced to a healthcare setting [49]. This sub-issue relates to the unnecessary or potential  harm  caused  by  AI  tools  or  unsafe  AI  in  healthcare  [49].  Integrating  AI  into

<!-- PAGE 16 -->

healthcare can provide multiple benefits, such as improving patient safety and the quality of care [49,89], improving access to healthcare, providing local real-time advice to patients or clinicians, and identifying medical emergencies such as sepsis [49]. On the other hand, AI-enabled clinical support tools can also make mistakes, and the AI algorithms can provide unsafe advice and decisions, which could cause harm to patients [49,71]. Of course, in traditional healthcare, the healthcare provider can also harm patients by not obeying patient safety protocols, standards, or procedures. When AI is widely introduced in  a healthcare system, it is difficult to define who is responsible for the harm caused by AI errors. This could be the computer programmers who developed the AI solutions, the clinicians using the techniques during the diagnosis process, or the regulator making the relevant policy for the AI solutions [49].

## 3.5.2. Cyber Security

In addition to the patient safety issue, six sources also discussed the cyber security of AI (Table 5), which is mainly related to the prudence, safety, risk, and technical robustness/safety of the cyber environment [52,80]. It is also linked to the capability of taking precautions to avoid undesired results and mitigate existential risks  [52]. The selected documents also reported that the mental healthcare field requires thoughtful consideration  regarding  the  data  security  of  the  devices  that  come  into  contact  with  individual health information, the approaches related to data generation, and the possibility of hacking and unauthorized surveillance [68]. When advanced tools and techniques are used to extract large amounts of heterogeneous data provided by citizens, this may lead to security attacks or privacy invasions [74]. On the other hand, these advanced tools and techniques help support data collection, storage, and transmission, providing intelligent planning ideas, building models, and data management methods [74].

## 3.5.3. Strategies for Main Ethical Issue 5

To deal with patient safety and cyber security, the following strategies need to be addressed:

- Develop AI systems in a regulated manner together with clinicians and computer scientists [49,72];
- Vet and review AI tools through legally selected regulatory committees before using them [66];
- Update regulations, codes of conduct, and standards continuously [66];
- Cooperate with stakeholders involved in the AI development process to help the project team establish a responsible ethics model and ensure patient safety and the rights and interests of users [49,72];
- Foresee undesirable results and avoid adverse consequences of AI techniques by taking proper action to ensure cyber security [52];
- Ensure that the AI system is robust enough to protect the user's d ata from being destroyed by the operational or system-interacting agents [52]; and
- Develop explicit standards or policies of data management with security and privacy, and implement them to preserve data confidentiality and identification in healthcare [68,74].

## 3.6. Main Ethical Issue 6: Trust 3.6.1. Trust

Twelve documents discussed the issue of trust (Table 5). Trust refers to a relational and normative concept, which implies some uncertainty or a risk that the tasks delegated to human agents will not go as planned [53]. Trust is a central part of the therapeutic relationship between human care providers and patients. As in this relationship, trust is crucial to the interaction between patients and artificial intelligent care providers. Understanding the trust in this interaction is significant, especially in the healthcare domain

<!-- PAGE 17 -->

[62,80,89].  The  level  of  trust  in  the  interaction  between  humans  and  AI  systems  in healthcare depends on various aspects of data [43,48,58,62,80], including data usage [48], data-driven technology [58], data confidentiality [80], and breaches of patient data [43]. The dual-use aspects of technology can threaten trust in the system and related professions, because the technology can be used in multiple ways, and there is also a risk that the collected data will also be used for other purposes [62]. Bias is another factor related to trust in AI systems used in healthcare [53,58]. AI could generate biased and overfitted results that clinicians did not identify, decreasing the user 's trust and acceptance of AI systems in healthcare [54]. Similarly, automatic recommendations or decisions provided by  AI  systems  with  low  precision  and  a  lack  of  explainability  and  transparency  can threaten patient trust [43,84].

## 3.6.2. Strategies for Main Ethical Issue 6

To cope with the issue of trust, the strategies presented in the literature are as follows:

- Inform the patients when and how their data are shared, as part of the research protocols  and  sharing  conditions  (de-identification,  registration,  access  control,  etc.) [48,58];
- Improve data privacy and confidentiality to prevent the reidentification of anonymized data with spatial data points to ensure patients' trust in health services [43][80]; and
- Educate healthcare personnel on the basics of AI, including techniques and solutions, to establish trust in AI healthcare providers [43,84].

## 3.7. Main Ethical Issue 7: Beneficence

## 3.7.1. Beneficence

Eleven documents discussed the issue of beneficence (Table 5). Beneficence refers to act with the best interest of others [57,88]. It also expresses the desire to promote welfare [88]. In healthcare, beneficence refers to the act of a healthcare professional who provides benefits or 'promotes/does good' [56,57,89] for care-recipients [43,51,53,88] through promoting their health and well-being [53,55,57,59], lowering the risks, and preventing health problems and illnesses. It is also related to the balance of the benefits of interventions against risks and costs [53,57]. The moral acceptability of deception is also connected to the ethical issue of beneficence. It has been pointed that although it is ostensibly wrong, deception can be justified under certain circumstances to promote a patient's physical and mental health. For example, a study of interviews with people with dementia has shown that they usually find lying acceptable if it is in their best interests [83].

## 3.7.2. Strategies for Main Ethical Issue 7

To deal with the issue of beneficence, researchers have called for the following strategies in improving communication and enhancing beneficence in the design process:

1. Improve the communication of beneficence by
- Exhibiting caring behavior to care receivers to improve their well-being [53]; and
- Informing patients about their best interests and established standards [83].
2. Encourage AI developers to design and enhance beneficence by
- Reflecting on issues and promoting both individual and collective well-being during the design process [56]; and
- Personalizing AI-powered solutions by coaching, preventing, and treating diseases to support healthy living [59].

<!-- PAGE 18 -->

## 3.8. Main Ethical Issue 8: Responsibility

## 3.8.1. Responsibility

Table 5 shows that nine documents addressed this ethical issue. In the selected documents, responsibility means being responsible for the decisions made by AI systems when they are applied in the healthcare domain [55,56,66,71]. It raises the question of who has responsibility for the errors or incorrect performance of AI systems [43,56,66]. Responsibility is often referred to as responsible AI or ML [66,79]. In addition to robustness and interpretability,  responsible  ML  is  the  central  factor  related  to  the  adoption  of  ML  in healthcare [85]. For AI systems used in healthcare, it is also necessary to have accountability for patient harm [66,71]. When AI systems are involved in the decision-making process, it is unclear to what extent human clinicians will be held accountable for patient harm [71]. It could be that clinicians do not have direct control of the decisions made by AI systems, or that the AI systems are not transparent [71]. Therefore, it is difficult, or even impossible, for the clinician to understand how the system makes the output decision on the basis of the input data [71] . Additionally, the AI developer responsible for 'do no harm' is accountable for the harm caused by the decision-making of AI systems [66].

## 3.8.2. Strategies for Main Ethical Issue 8

To deal with the issue of responsibility, the literature proposes the following strategies:

- Define clear guidelines when making decisions about ethics and legal liability based on AI outputs [43];
- Recognize and document shared responsibility among stakeholders before developing AI solutions [55];
- Require both doctors and AI developers to follow the ' do no harm ' standard [66]; and
- Involve AI developers and engineers specializing in system safety in moral accountability assessments to prevent patient harm [71].

## 3.9. Main Ethical Issue 9: Solidarity

## 3.9.1. Solidarity

Eight documents highlighted the issue of solidarity (Table 5). Solidarity is always highlighted when dealing with the issue of justice and equality when AI-powered solutions are applied in healthcare [48,52,53,56,58]. Within the scope of justice and equality, the allocation algorithm that is widely used in healthcare can result in the discrimination of particular groups [48] and races [52], as well as inequality in the allocation of resources [52], geography, and social economy [58]. For example, insurers adjust the class unity of their insurance according to their risk level and ultimately stratify their customers [48]. African American patients and disabled people may not be treated equally to nondisabled Caucasian people [52,56,58].

In addition, physicians might prioritize their patients according to criteria other than medical urgency [56]. Solidarity is also related to the inequality of care distributed in society and the burdens of the caregivers, which influence societal concerns in relation to public health [53]. The nature of algorithmic prediction can easily translate into algorithm profiling  to  categorize  new  subgroups  among  existing  populations  without  their knowledge, threatening patients' autonomy and individuality within societies. Solidarity is also emphasized as an effective approach to reinforce the community-based nature of healthcare and emphasize the significance of pursuing the common good within this context [56]. Patient -doctor relations are essential to the issue of solidarity [52,62,83]. The establishment of a good rapport with patients improves treatment results [62,83].

<!-- PAGE 19 -->

## 3.9.2. Strategies for Main Ethical Issue 9

To cope with the issue of Solidarity, a solidarity-based model needs to be established when applying AI solutions in society [48]. The processes of technologies such as AI and big data should be beneficial without exacerbating socioeconomic or cultural divisions while at the same time preserving the solidarity-based model of social protection [48].

Within the scope of equality and justice, the following strategies are proposed in the reviewed sources:

- Include the goal of improving the health of disabled people when designing with AI [52];
- Improve internet speed and pursue the digital transformation of the healthcare system to cope with the inequalities caused by the digital divide [48];
- Consider interpersonal justice in the design of care bots to decrease inequality in the distribution of care in society and burdens on caregivers [53];
- Allow patients to select among available resources to respect their autonomy to cope with inequality in the allocation of resources [56]; and
- Establish adequate communication, mutual trust, and empathy in the patient -doctor relationship [83].

## 3.10. Main Ethical Issue 10: Sustainability

## 3.10.1. Sustainability

The issue of sustainability was discussed in association with the issue of solidarity and was discussed in seven documents (Table 5). Based on the selected documents, we know that the UN's SDGs affect the development strategies in low - and middle-income countries. It presents AI as an explicit global and transnational effort to promote trustworthy development, deployment, and application.    Against this background, the issue of sustainability is a key factor related to the trustworthy establishment of AI worldwide [37].

Five concerns related to the sustainability of developing, deploying, and implementing AI solutions in healthcare were discussed in the literature. Specifically, we identified these concerns as conflicting goals, unequal contexts, risk and uncertainty, opportunity cost, and democratic deficits [37]. Sustainability in employability was discussed in relation to the use of computer algorithms and ML to support decision-making in occupational health. ML applied in this context has potential for sustained employability through the design of improved decision support tools. In particular, the data used in ML algorithms as the training set can maintain sustained employability by predicting suitable interventions. However, the issue of group profiling and discrimination can occur when applying ML decision-support tools in occupational health, which might lead to social and potential economic inequality [57]. AI should contribute to the sustainable development of society and benefit individ uals' health and well-being [59].

Additionally,  beneficence  is  significant  in  maintaining  sustainability,  promoting well-being, and preserving dignity [55]. Moreover, health and well-being, as well as inequalities between urban and rural health services, influence sustainability [37,59]. Digital technologies are valuable in advancing universal health coverage and SDGs. However, the digital divide influences sustainability, and also prevents the achievement of the SDGs. This is especially the case in regard to the lack of communication in low- and middleincome countries [73,75]. The sources also addressed the financial sustainability of the healthcare system [83] and the significance of establishing a data ecosystem in the digital health domain [75].

<!-- PAGE 20 -->

## 3.10.2. Strategies for Main Ethical Issue 10

To ensure the sustainability of trustworthy AI technologies, the sources call for the following strategies:

1. Support the establishment of trustworthy global AI by:
- Addressing threats in implementing trustworthy AI in the related framework [37];
- Understanding the translation of ethical norms into practice to secure the trustworthy governance of AI both locally and globally [37];
- Enabling cross-country development of shared, well-expressed rules so that they are context-independent [37];
- Making high-income countries responsible for providing financial support to make up for the potential losses of countries involved in global endeavors [37];
- Translating shared general norms into specific regulations [37];
- Cooperating with the World Health Organization and UN bodies to lead shared efforts toward the development of a trustworthy global AI system [37];
- Developing tools to cope with inequality and the digital divide in low- and middleincome countries [73]; and
- Embedding a systematic approach to establish digital care passes, linking rapid detection with digital symptom checkers, contact tracing, epidemiological intelligence, and long-term clinical follow-up [73].
2. Develop sustainable ML decision-making tools within occupational healthcare, and ensuring that 'education' is carried out in rega rd to these tools by:
- Providing the best effective data and training these tools with the best-known algorithms [57]; and
- Validating the tools and discussing their ethical impact [57].
3. Engage health  research  ethics  committees  in  assessing  ML  decision-making  tools regarding  the aspects of potential analytical risk [57], function creeps [57], discrimination issues [57], privacy issues [57]; and data custody and ownership [57].

## 3.11. Main Ethical Issue 11: Dignity

## 3.11.1. Dignity

The next most frequently discussed issue was dignity, as can be seen in Table 5. We identified seven documents addressing the issue of dignity. Dignity is considered a fundamental right [51,62,80] and relates to the respect for human rights and freedoms [66]. In the context of care ethics, this topic is ultimately about human dignity in the relationship between the caregiver and the care recipient [53]. The computer scientist Weizenbaum expressed the concern that everything in society was approaching a state corresponding to the computational metaphor, resulting in a mechanical expectation regarding decisionmaking, which would eventually result in affronts to human dignity [62]. For instance, the paternalistic AI model ignores patients' preferences, not just harming patients' autonomy but also their dignity [70].

## 3.11.2. Strategies for Main Ethical Issue 11

To deal with the issue of dignity, the reviewed sources recommend the following strategies:

- Design and operate AI systems to be compatible with human dignity, rights, and freedom [53,54];
- Focus on dignity and privacy to respect human rights when establishing the ethics of AI-enabled solutions [53]; and
- Enact patient acts to support the respect for human dignity, life, and integrity [80].

<!-- PAGE 21 -->

## 3.12. Main Ethical Issue 12: Conflicts

## 3.12.1. Conflicts

Related to the issue of Sustainability is that of conflict. We again identified seven documents that discussed this issue (Table 5). Conflicts are non-avoidable when AI solutions are implemented in the healthcare domain. Conflicting goals are often encountered in this context, as discussed in relation to the issue of sustainability, in cases where some political objectives of regulations such as the SDGs determine the political governance and development strategies in health sectors. This influences local healthcare priorities and may lead to conflicting goals in opposing AI technologies that promote ethical safety [37]. Conflicts in decision-making occur between patients or surrogates and medical staff in interpreting results, as well as between AI models and physicians [51]. When using ML decision-making tools  in  an  occupational  context,  stakeholders  often  have  conflicts  in terms of their priorities and the differing interests or perspectives of employers, employees, regulations, insurance companies, etc. [57]. Automation bias is an influential factor in conflicting human decisions [64,66]. Potential conflicts emerge due to the ability of humans to act autonomously and the nature of complex machines, which are sometimes obscure but infallible [54]. The literature also discusses the conflict between data security and general liability problems [83].

## 3.12.2. Strategies for Main Ethical Issue 11

To cope with the issue of conflicts, the literature calls for the following strategies:

- Share decision-making with patients or their surrogates to guarantee human oversight and assign responsibility to physicians, patients, and surrogates [51]; and
- Seek human perspectives, for instance, thhrough multidisciplinary team meetings, to deal with conflicts in the decision-making or predictions of AI models and physicians [51].

## 4. Discussion and Conclusions

In this systematic literature review, we aimed to provide an overview of the ethical issues and strategies related to the use of AI solutions in healthcare. These strategies can help developers, policymakers, healthcare institutions, and other healthcare ecosystem stakeholders to take necessary actions to proactively manage the ethical issues associated with AI in the related design processes.

We combined the ethical concerns addressed in the documents The Global Landscape of  AI  Ethics  Guidelines by Jobin's group (2019) and EGTAI developed by the European Commission as the departure point to categorize the issues identified in this review. We applied a thematic code mapping process based on an abductive approach, including inductive and deductive methods. We adjusted the list of ethical issues associated with AI by adding and renaming the issues based on Jobin's work and referencing with EGTAI.

Eventually, based on the 45 selected documents, we identified 12 overarching main ethical  issues  and  19  sub-issues  (Table  5).  Comparing  these  19  ethical  sub-issues  with Jobin's guidelines, we added 'control' as a sub -issue of the main issue of freedom and autonomy. This is because EGTAI claimed that 'control' is a fundamental human right related to the application of AI solutions and is essential to human autonomy [36]. To the list presented in Jobin's work, we also added the issue of 'conflict' to our list of identified ethical issues of AI. The issue of 'sustainability' in Jobin's work and EGTAI was related to environmental aspects and was associated with environmental well-being and protection during the deployment of AI in the general domain [36,38]. In our literature review, sustainability  was  mainly  related  to  the  sustainable  development  of users'  health  and well-being, as well as their employability [37,55,59]. The issue of 'solidarity' discussed in Jobin's work was linked to AI's implications for the labor market [38]. However, in our study, this issue was related to justice and equality [48,52,53,56,58] especially in regard to the sharing of burdens and benefits to prevent inequalities and discrimination [52,53],

<!-- PAGE 22 -->

which is similar to the approach taken in EDGAT [36]. We found that solidarity was also related to the relationship between patients and physicians and the social support available in community groups with the aim of improving shared AI usage and development in  healthcare  [52,62,83].  Additionally, academic sources and legal documents were excluded from Jobin's work. In contrast, our literature review includes both academic and gray literature on ethical issues and AI guidelines, adding the academic perspective that Jobin's work excluded. In addition, our results suggested that ML algorithms in AI systems still cause many ethical concerns, such as issues related to biases, fairness, transparency, and explainability. We also identified different strategies to cope with the issues related to ML algorithms. Examples of such strategies are purifying the algorithms of AIbased decision support tools, managing fairness constraints in ML, and making the AI decision-making process clear for users. In addition to the strategies proposed in this review, other prevalent studies also deal with ML algorithmic issues. For instance, these studies address censorship, specifically tackling the issue of fairness in relation to censorship [91,92]. In other words, the effectiveness of the strategies proposed in this review are far from satisfactory. Therefore, we call for cooperation among AI developers, healthcare professionals, and policymakers in developing and applying algorithmic interventions which emphasize fairness in regard to censorship [91,92].

This systematic literature review was conducted between 2010 and 2020, and therefore we excluded AI solutions in healthcare developed over the past three years during the COVID pandemic [93]. Nevertheless, the worldwide spread of COVID and the different forms of lockdown have accelerated the implementation of digital healthcare tools. In many cases, the role of digital health tools has shifted from an interesting potential opportunity to an immediate necessity. For instance, humanoid robots have been developed, including cognitive technologies to create artificial minds in order to care for vulnerable patients [50,94]. In this context, it is even more urgent to understand the ethical issues related to AI and the associated strategies.

In general, the work of Jobin and EGTAI support a broad understanding of the application of AI and the related ethical issues. In contrast, our literature review focused on ethical issues related to the applications of AI in healthcare. Due to our focus on healthcare, our results are in principle not generalizable to other domains. This is because the definition of each ethical issue might be different when people conduct similar reviews in other fields or databases. Thus, future work is required to explore the ethical issues related to the use of AI in other domains. Additionally, the knowledge on the ethical issues and strategies summarized in this paper can be extended to provide tools for guiding designers or stakeholders when developing AI solutions within the healthcare domain.

Author Contributions: Conceptualization, F.L., N.R. and Y.L.; methodology, F.L., N.R. and Y.L.; validation, Y.L.; formal analysis, F.L. and Y.L.; writing -original draft preparation, F.L., N.R. and Y.L.; writing -review and editing, F.L. and Y.L.; supervision, Y.L.; funding acquisition, F.L. and Y.L. All authors have read and agreed to the published version of the manuscript.

Funding: This  work  was  supported  by  the  Eindhoven University of Technology and the China Scholarship Council.

Institutional Review Board Statement: Not applicable.

Informed Consent Statement: Not applicable.

Data Availability Statement: The protocol regarding this review was registered in PROSPERO with links found in References. Furthermore, the accepted papers were extracted from the databases discussed in Section 2: the results are replicable using the search string defined in Appendix A.

Conflicts of Interest: The authors declare no conflict of interest.

<!-- PAGE 23 -->

## Appendix A

Table A1. Search strings for each database.

| Database             | Search String                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |   Results |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| ACMDigital Library   | 'Abstract' keywords:[['artificial intelligence'] OR ['ai'] OR ['machine learning'] OR ['ml'] OR ['deep learning'] OR ['artificial neural networks'] OR ['computer vi- sion']] AND[['healthcare'] OR ['medical care'] OR ['care'] OR ['diagnosis p ro- cesses'] OR ['treatment protocol development'] OR ['drug development'] OR ['personalized medicine'] OR ['patient monitoring'] OR ['medicine'] OR ['radiol- ogy'] OR ['pathology'] OR ['decision support systems']] AND[['ethics'] OR ['fair- ness'] OR ['integrity'] OR ['virtues'] OR ['value - system'] OR ['ethical values'] OR ['rightness'] OR ['moral'] OR ['morality']] AND[['guidelines'] OR ['recommen- dations'] OR ['instructions'] OR ['requirements'] OR ['principles'] OR ['regula- tions'] OR ['suggestions'] OR ['advice'] OR ['rules'] OR ['standard'] OR ['crite- ria']] AND[Publication Date: (1 January 2000 TO 30 September 2020)] |         5 |
| PubMed               | 'Title/Abstract' keywords:[Artificial Intelligence] OR [AI] OR [Machine Learning] OR [ML] OR [Deep Learning] OR [Artificial Neural Networks] OR [Computer Vi- sion]AND [Healthcare] OR [Medical care] OR [care] OR [Diagnosis processes] OR [treatment protocol development] OR [drug development] OR [personalized medi- cine] OR [patient monitoring] OR [Medicine] OR [Radiology] OR [Pathology] OR [Decision Support Systems] AND[Ethics] OR [Fairness] OR [Integrity] OR [Virtues] OR [Value-System] OR [Ethical Values] OR [Rightness] OR [Moral] OR [Morality] AND[Guidelines] OR [Recommendations] OR [Instructions] OR [requirements] OR [principles] OR [regulations] OR [suggestions] OR [advice] OR [Rules] OR [standard] OR [criteria]Filters applied: 2000 - 2020                                                                                                                               |       131 |
| IEEE Xplore          | ('Artificial Intelligence' OR 'AI' OR 'Machine Learning' OR 'ML' OR 'Deep Learning' OR 'Artificial Neural Networks' OR 'Computer Vision')AND ('Healthcare' OR 'Medical care' OR 'care' OR 'Diagnosis processes' OR 'treat- ment protocol development' OR 'drug development' OR 'personalized medicine' OR 'patient monitoring' OR 'Medicine' OR 'Radiology' OR 'Pathology' OR 'De- cision Support Systems') AND('Guidelines' OR 'Recommendations' OR 'Instruc- tions' OR 'requirements' OR 'principles' OR 'regulations' OR 'suggestions' OR 'advice' OR 'Rules' OR 'standard' OR 'criteria') AND('Ethics' OR 'Fairness' OR 'Integrity' OR 'Virtues' OR 'Value - System' OR 'Ethical Values' OR 'Rightness' OR 'Moral' OR 'Morality') Filters Applied: 2000 - 2020                                                                                                                                            |        73 |
| Nature-SCI           | Artificial Intelligence ethical healthcare guidelines 90 Filters applied: 2000 - 2020                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |        90 |
| AI Ethics Guidelines | Healthcare OR medicine                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |         4 |

## References

1. Panesar, A.; Panesar, H. Artificial Intelligence and Machine Learning in Global Healthcare. Handb. Glob. Health 2020 ,  1 -39. 2. Nikitas, A.; Michalakopoulou, K.; Njoya, E.T.; Karampatzakis, D. Artificial Intelligence, Transport and the Smart City: Definitions and Dimensions of a New Mobility Era. Sustainability 2020 , 12 , 2789. 3. Tahiru, F. AI in Education. J. Cases Inf. Technol. 2020 , 23 , 20. 4. Pannu, A.; Tech Student, M. Artificial Intelligence and Its Application in Different Areas. Certif. Int. J. Eng. Innov. Technol. 2008, 4. 79 -84. ISSN: 2277 -3754
5. Greenough  John.  10  Million  Self-Driving  Cars  Will  Be  on  the  Road  by  2020.  Available  online:  https://www.businessinsider.com/report-10-million-self-driving-cars-will-be-on-the-road-by-2020-2015-5-6?international=true&amp;r=US&amp;IR=T  (accessed on 27 November 2022).
6. Stone, P.; Brooks, R.; Brynjolfsson, E.; Calo, R.; Etzioni, O.; Hager, G.; Hirschberg, J.; Kalyanakrishnan, S.; Kamar, E.; Kraus, S.; et al. Artificial Intelligence and Life in 2030: The One Hundred Year Study on Artificial Intelligence. Rep. 2015-2016 Study Panel 2016 , doi:https://ai100.stanford.edu.
7. Xu,  W.  Toward  Human-Centered  AI:  A  Perspective  from  Human-Computer  Interaction. Interactions 2019 , 26 ,  42 -46.

<!-- PAGE 24 -->

- 8. Alpaydin, E. Introduction to Machine Learning , 3rd ed.; PHI: Delhi, New Delhi, India, 2014.
9. Ngiam, K.Y.; Khor, I.W. Big Data and Machine Learning Algorithms for Health-Care Delivery. Lancet Oncol. 2019 , 20 , e262 -e273.
10. Ravi, D.; Wong, C.; Deligianni, F.; Berthelot, M.; Andreu-Perez, J.; Lo, B.; Yang, G.Z. Deep Learning for Health Informatics. IEEE J. Biomed. Health Inform. 2017 , 21 , 4 -21. 11. Rajula, H.S.R.; Verlato, G.; Manchia, M.; Antonucci, N.; Fanos, V. Comparison of Conventional Statistical Methods with Machine Learning in Medicine: Diagnosis, Drug Development, and Treatment. Medicina 2020 , 56 ,  455.  12. Bohr, A.; Memarzadeh, K. The Rise of Artificial Intelligence in Healthcare Applications. In Artificial Intelligence in Healthcare ; Academic Press: Cambridge, MA, USA, 2020; ISBN 9780128184387.
13. Bartoletti, I. AI in Healthcare: Ethical and Privacy Challenges. In Lecture Notes in Computer Science (Including Subseries Lecture Notes in Artificial Intelligence and Lecture Notes in Bioinformatics), Proceedings of the Conference on Artificial Intelligence in Medicine in Europe, Poznan, Poland, 26 -29 June 2019 ; Springer: Cham, Switzerland., 2019
14. Habuza, T.; Navaz, A.N.; Hashim, F.; Alnajjar, F.; Zaki, N.; Serhani, M.A.; Statsenko, Y. AI Applications in Robotics, Diagnostic Image Analysis and Precision Medicine: Current Limitations, Future Trends, Guidelines on CAD Systems for Medicine. Inform. Med. Unlocked 2021 , 24 , 100596.
15. Esteva, A.; Kuprel, B.; Novoa, R.A.; Ko, J.; Swetter, S.M.; Blau, H.M.; Thrun, S. Dermatologist-Level Classification of Skin Cancer with Deep Neural Networks. Nature 2017 , 542 , 115 -118. 16. Lee, H.; Tajmir, S.; Lee, J.; Zissen, M.; Yeshiwas, B.A.; Alkasab, T.K.; Choy, G.; Do, S. Fully Automated Deep Learning System for Bone Age Assessment. J. Digit. Imaging 2017 , 30 , 427 -441. 17. Char, D.S.; Abràmoff, M.D.; Feudtner, C. Identifying Ethical Considerations for Machine Learning Healthcare Applications. Am. J. Bioeth. 2020 , 20 , 7 -17. 18. Johnson, S.L.J. AI, Machine Learning, and Ethics in Health Care. J. Leg. Med. 2019 , 39 , 427 -441. 19. Chen, I.Y.; Pierson, E.; Rose, S.; Joshi, S.; Ferryman, K.; Ghassemi, M. Ethical Machine Learning in Healthcare. Annu. Rev. Biomed. Data Sci. 2021 , 4 , 123 -144. 20. Gibney, E. The Battle for Ethical AI at the World's Biggest Machine -Learning Conference. Nature 2020 , 577 , 609 -610.
21. Ouchchy, L.; Coin, A.; Dubljević, V. AI in the Headlines: The Portrayal of the Ethical Issues of Artificial Intelligence in t he Media. AI Soc. 2020 , 35, 927 -936. 22. Dignum, V. How to Develop and Use AI in a Responsible Way. In Artificial Intelligence: Foundations, Theory, and Algorithms ; Springer: Cham, Switzerland, 2019.
23. Carabantes,  M.  Black-Box  Artificial  Intelligence:  An  Epistemological  and  Critical  Analysis. AI  Soc. 2020 , 35 ,  309 -317. 24. Lipton, Z.C. The Mythos of Model Interpretability. Queue 2018 , 16 , 31 -57. 25. Bird, E.; Fox-Skelly, J.; Jenner, N.; Larbey, R.; Weitkamp, E.; Winfield, A. The Ethics of Artificial Intelligence: Issues and Initiatives. Leg. Stud. Inst. Chosun Univ. 2020, 29 -30, doi: 10.2861/6644
26. Munoz, C.; Smith, M.; Patil, D. Big Data: A Report on Algorithmic Systems, Opportunity, and Civil Rights Big Data: A Report on Algorithmic Systems, Opportunity, and Civil Rights . Executive Office of the President: Washington, DC, WA, USA, 2016.
27. Shin, F.P.D. The Effects of Explainability and Causability on Perception, Trust, and Acceptance: Implications for Explainable AI. Int. J. Hum. Comput. Stud. 2020 , 146 , 102551. 28. Angwin, J.; Larson, J.; Mattu, S.; Kirchner, L. Machine Bias: There's Software Used across the Country to Predict Future Criminals. And It's Biased against Blacks. ProPublica 2016 . 29. Hofman, J.M.; Sharma, A.; Watts, D.J. Prediction and Explanation in Social Systems. Science 2017 , 355 , 486 -488.
30. Suzor, N. Google Defamation Case Highlights Complex Jurisdiction Problem. ABC News. 31. Weller, A. Transparency: Motivations and Challenges. In Lecture Notes in Computer Science) ; Springer: Cham, Switzerland, 2019. 32. Zeng, J.; Ustun, B.; Rudin, C. Interpretable Classification Models for Recidivism Prediction. J. R. Stat. Soc. Ser. A (Stat. Soc.) 2017 , 180 , 689 -722. 33. Ala-Pietilä, P.; Bauer, W.; Bergmann, U.; Bieliková, M.; Bonnet, Y.; Bouarfa, L.; Brunessaux, S.; Chatila, R.; Coeckelbergh, M.; Dignum, V.; et al. Ethics Guidelines for Trustworthy AI High-Level Expert Group on Artificial Intelligence ; Brussels, Belgium, 2019.
34. John, H.P.; Afua, B.; Ed, F.; Terah, L.; Megan, S. Preparing for the Future of Artificial Intelligence ; Executive Office of the President National Science and Technology Council Committee on Technology: Washington, DC, WA, USA, 2016.
35. Beijing  Academy  of  Artificial  Intelligence.  Beijing  AI  Principles. Datenschutz  Und  Datensicherheit-DuD 2019 , 43 ,  656 -656. 36. Tambiama,  M.  EU  Guidelines  on  Ethics in Artificial Intelligence: Context and Implementation. 

<!-- PAGE 25 -->

37. Bæ røe, K.; Miyata-Sturm, A.; Henden, E. How to Achieve Trustworthy Artificial Intelligence for Health. Bull. World Health Organ. 2020 , 98 , 257. 38. Jobin,  A.;  Ienca,  M.;  Vayena,  E.  The  Global  Landscape  of  AI  Ethics  Guidelines. Nat.  Mach.  Intell. 2019 , 1 ,  389 -399. 39. Hagendorff, T. The Ethics of AI Ethics: An Evaluation of Guidelines. Minds Mach. 2020 , 30 , 99 -120. 40. Ryan, M.; Stahl, B.C. Artificial Intelligence Ethics Guidelines for Developers and Users: Clarifying Their Content and Normative Implications. J. Inf. Commun. Ethics Soc. 2021 , 19 , 61 -86. 41. Morley, J.; Machado, C.C.V.; Burr, C.; Cowls, J.; Joshi, I.; Taddeo, M.; Floridi, L. The Ethics of AI in Health Care: A Mapping Review. Soc. Sci. Med. 2020 , 260 , 113172.
42. Gerke, S.; Minssen, T.; Cohen, G. Ethical and Legal Challenges of Artificial Intelligence-Driven Healthcare. In Artificial Intelligence in Healthcare ; Academic Press: Cambridge, MA, USA, 2020; ISBN 9780128184387.
43. Reddy, S.; Allan, S.; Coghlan, S.; Cooper, P. A Governance Model for the Application of AI in Health Care. J. Am. Med. Inform. Assoc. 2020 , 27 , 491 -497.
44. Khan, A.A.; Badshah, S.; Liang, P.; Khan, B.; Ahmad, A.; Fahmideh, M.; Niazi, M.; Akbar, A. Ethics of AI: A Systematic Literature Review of Principles and Challenges. In Proceedings of the International Conference on Evaluation and Assessment in Software Engineering 2022, Gothenburg, Sweden, 13 -15 June 2022; pp. 383 -392.
45. Moher, D.; Liberati, A.; Tetzlaff, J.; Altman, D.G. and PRISMA Group. Preferred Reporting Items for Systematic Reviews and Meta-Analyses: The PRISMA Statement. PLoS Med. 2009 , 151 , 264 -269.
46. Li, F.; Ruijs, N.; Lu, Y. Ethics &amp; AI: A Systematic Review on Identifying Ethical Concerns for Guiding AI-Enabled Design in Healthcare. 47. Kitchenham, B.A.; Charters, S. Guidelines for Performing Systematic Literature Reviews in Software Engineering ;  EBSE Technical report, Version 2.3: Keele, UK; Durham, UK, July 2007.
48. French National Ethical Consultative Committee for Life Sciences and Health. Digital Technology and Healthcare Which Ethical Issues for Which Regulations? Paris, France, 2018 .
49. Academy of Medical Royal Colleges. Artificial Intelligence in Healthcare ; London, UK, 2019. 50. Balthazar, P.; Harri, P.; Prater, A.; Safdar, N.M. Protecting Your Patients' Interests in the Era of Big Data, Artificial Int elligence, and Predictive Analytics. J. Am. Coll. Radiol. 2018 , 15 , 580 -586. 51. Beil, M.; Proft, I.; van Heerden, D.; Sviri, S.; van Heerden, P.V. Ethical Considerations about Artificial Intelligence for Prognostication in Intensive Care. Intensive Care Med. Exp. 2019 , 7 , 70. 52. Buruk, B.; Ekmekci, P.E.; Arda, B. A Critical Perspective on Guidelines for Responsible and Trustworthy Artificial Intelligence. Med. Health Care Philos. 2020 , 23 , 387 -399. 53. Yew,  G.C.K.  Trust  in  and  Ethical  Design  of  Carebots:  The  Case  for  Ethics  of  Care. Int.  J.  Soc.  Robot. 2021 , 13 ,  629 -645. 54. Group, S.I.; Community, F.R.; Artificial Intelligence and Medical Imaging 2018: French Radiology Community White Paper. Diagn. Interv. Imaging 2018 , 99 , 727 -742.
55. Currie, G.; Hawk, K.E.; Rohren, E.M. Ethical Principles for the Application of Artificial Intelligence (AI) in Nuclear Medicine. Eur. J. Nucl. Med. Mol. Imaging 2020 , 47 , 748 -752.
56. D'antonoli, T.A. Ethical Considerations for Artificial Intelligence: An Overview of the Current Radiology Landscape. Diagn. Interv. Radiol. 2020 , 26 , 504. 57. Six Dijkstra, M.W.M.C.; Siebrand, E.; Dorrestijn, S.; Salomons, E.L.; Reneman, M.F.; Oosterveld, F.G.J.; Soer, R.; Gross, D.P.; Bieleman, H.J. Ethical Considerations of Using Machine Learning for Decision Support in Occupational Health: An Example Involving Periodic Workers' He alth Assessments. J. Occup. Rehabil. 2020 , 30 , 343 -353.
58. Fenech, M.E.; Buston, O. AI in Cardiac Imaging: A UK-Based Perspective on Addressing the Ethical, Social, and Political Challenges. Front. Cardiovasc. Med. 2020 , 54 . 59. Houten,  H.  van  Five  Guiding  Principles  for  Responsible  Use  of  AI  in  Healthcare  and  Healthy  Living.  Available  online: https://www.philips.com/a-w/about/news/archive/blogs/innovation-matters/2020/20200121-five-guiding-principles-for-responsible-use-of-ai-in-healthcare-and-healthy-living.html (accessed on 11 February 2022).
60. Joerin, A.; Rauws, M.; Fulmer, R.; Black, V. Ethical Artificial Intelligence for Digital Health Organizations. Cureus 2020 , 12 . 61. Liu, X.; Cruz Rivera, S.; Moher, D.; Calvert, M.J.; Denniston, A.K.; Chan, A.W.; Darzi, A.; Holmes, C.; Yau, C.; Ashrafian, H.; et al. Reporting Guidelines for Clinical Trial Reports for Interventions Involving Artificial Intelligence: The CONSORT-AI Extension. Nat. Med. 2020 , 370 . 62. Luxton, D.D. Recommendations for the Ethical Use and Design of Artificial Intelligent Care Providers. Artif. Intell. Med. 2014 , 62 . 63. Nebeker, C.; Torous, J.; Bartlett Ellis, R.J. Building the Case for Actionable Ethics in Digital Health Research Supported by Artificial Intelligence. BMC Med. 2019 , 17 , 137.

<!-- PAGE 26 -->

64. Neri, E.; Coppola, F.; Miele, V.; Bibbolino, C.; Grassi, R. Artificial Intelligence: Who Is Responsible for the Diagnosis? La Radiol. Med. 2020 , 125 , 517 -521.
65. Paulus, J.K.; Kent, D.M. Predictably Unequal: Understanding and Addressing Concerns That Algorithmic Clinical Prediction May Increase Health Disparities. NPJ Digit. Med. 2020 , 3 , 99. 66. Raymond Geis, J.; Brady, A.P.; Wu, C.C.; Spencer, J.; Ranschaert, E.; Jaremko, J.L.; Langer, S.G.; Kitts, A.B.; Birch, J.; Shields, W.F.; et al. Ethics of Artificial Intelligence in Radiology: Summary of the Joint European and North American Multisociety Statement. Radiology 2019 , 293 , 436 -440. 67. Cruz Rivera, S.; Liu, X.; Chan, A.W.; Denniston, A.K.; Calvert, M.J.; Darzi, A.; Holmes, C.; Yau, C.; Moher, D.; Ashrafian, H.; et al. Guidelines for Clinical Trial Protocols for Interventions Involving Artificial Intelligence: The SPIRIT-AI Extension. Nat. Med. 2020 , 26 , 1351 -1363. 68. Fiske, A.; Henningsen, P.; Buyx, A. Your Robot Therapist Will See You Now: Ethical Implications of Embodied Artificial Intelligence in Psychiatry, Psychology, and Psychotherapy. J. Med. Internet Res. 2019 , 21 , e13216. 69. Kaissis, G.A.; Makowski, M.R.; Rückert, D.; Braren, R.F. Secure, Privacy-Preserving and Federated Machine Learning in Medical Imaging. Nat. Mach. Intell. 2020 , 2 , 305 -311. 70. Grote, T.; Berens, P. On the Ethics of Algorithmic Decision-Making in Healthcare. J. Med. Ethics 2020 , 46 , 205 -211.
71. Habli, I.; Lawton, T.; Porter, Z. Artificial Intelligence in Health Care: Accountability and Safety. Bull. World Health Organ. 2020 , 98 , 251. 72. Wiens, J.; Saria, S.; Sendak, M.; Ghassemi, M.; Liu, V.X.; Doshi-Velez, F.; Jung, K.; Heller, K.; Kale, D.; Saeed, M.; et al. Do No Harm: A Roadmap for Responsible Machine Learning for Health Care. Nat. Med. 2019 , 25 , 1337 -1340. 73. Budd, J.; Miller, B.S.; Manning, E.M.; Lampos, V.; Zhuang, M.; Edelstein, M.; Rees, G.; Emery, V.C.; Stevens, M.M.; Keegan, N.; et al. Digital Technologies in the Public-Health Response to COVID-19. Nat. Med. 2020 , 26 , 1183 -1192.
74. Verde, L.; De Pietro, G.; Alrashoud, M.; Ghoneim, A.; Al-Mutib, K.N.; Sannino, G. Leveraging Artificial Intelligence to Improve Voice Disorder Identification through the Use of a Reliable Mobile App. IEEE Access 2019 , 7 , 124048 -124054. 75. Thinyane, M. Operationalizing Data Justice in Health Informatics. In Proceedings of the 11th Academic Conference ITU Kaleidoscope: ICT for Health: Networks, Standards and Innovation, ITU K, Atlanta, GA, USA, 4 -6 December 2019; 1 -8.
76. Prosperi, M.; Guo, Y.; Sperrin, M.; Koopman, J.S.; Min, J.S.; He, X.; Rich, S.; Wang, M.; Buchan, I.E.; Bian, J. Causal Inference and Counterfactual Prediction in Machine Learning for Actionable Healthcare. Nat. Mach. Intell. 2020 , 2 , 369 -375. 77. McKernan, L.C.; Clayton, E.W.; Walsh, C.G. Protecting Life While Preserving Liberty: Ethical Recommendations for Suicide Prevention with Artificial Intelligence. Front. Psychiatry 2018 , 9 , 650. 78. Ahmad, M.A.; Patel, A.; Eckert, C.; Kumar, V.; Teredesai, A. Fairness in Machine Learning for Healthcare. In Proceedings of the Proceedings of the ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, Long Beach, CA, USA, 6 -10 July 2020; pp. 3529 -3530.
79. Martinez-Martin, N.; Insel, T.R.; Dagum, P.; Greely, H.T.; Cho, M.K. Data Mining for Health: Staking out the Ethical Territory of Digital Phenotyping. NPJ Digit. Med. 2018 , 1 , 68. 80. Yeng, P.K.; Yang, B.; Snekkenes, E.A. Observational Measures for Effective Profiling of Healthcare Staffs' Security Practices. In Proceedings of the 2019 IEEE 43rd Annual Computer Software and Applications Conference (COMPSAC), Milwaukee, WI, USA, 15 -19 July 2019; Volume 2, pp. 397 -404.
81. Portacolone, E.; Halpern, J.; Luxenberg, J.; Harrison, K.L.; Covinsky, K.E. Ethical Issues Raised by the Introduction of Artificial Companions to Older Adults with Cognitive Impairment: A Call for Interdisciplinary Collaborations. J. Alzheimer's Dis. 2020 , 76 , 445 -455.
82. Rajkomar, A.; Hardt, M.; Howell, M.D.; Corrado, G.; Chin, M.H. Ensuring Fairness in Machine Learning to Advance Health Equity. Ann. Intern. Med. 2018 , 169 , 866 -872. 83. Wangmo, T.; Lipps, M.; Kressig, R.W.; Ienca, M. Ethical Concerns with the Use of Intelligent Assistive Technology: Findings from a Qualitative Study with Professional Stakeholders. BMC Med. Ethics 2019 , 20 , 98. 84. Walsh, C.G.; Chaudhry, B.; Dua, P.; Goodman, K.W.; Kaplan, B.; Kavuluru, R.; Solomonides, A.; Subbian, V. Stigma, Biomarkers, and Algorithmic Bias: Recommendations for Precision Behavioral Health with Artificial Intelligence. JAMIA Open 2021 , 3 , 9 -15.
85. Vellido,  A.  Societal  Issues  Concerning  the  Application  of  Artificial  Intelligence  in  Medicine. Kidney  Dis. 2019 , 5 ,  11 -17. 86. Tran, B.X.; Vu, G.T.; Ha, G.H.; Vuong, Q.H.; Ho, M.T.; Vuong, T.T.; La, V.P.; Ho, M.T.; Nghiem, K.C.P.; Nguyen, H.L.T.; et al. Global Evolution of Research in Artificial Intelligence in Health and Medicine: A Bibliometric Study. J. Clin. Med. 2019 , 8 , 360. 87. Tanisawa, K.; Wang, G.; Seto, J.; Verdouka, I.; Twycross-Lewis, R.; Karanikolou, A.; Tanaka, M.; Borjesson, M.; Di Luigi, L.; Dohi, M.; et al. Sport and Exercise Genomics: The FIMS 2019 Consensus Statement Update. Br. J. Sport. Med. 2020 , 54 , 969 -975.
88. Starke, G.; De Clercq, E.; Borgwardt, S.; Elger, B.S. Computing Schizophrenia: Ethical Challenges for Machine Learning in Psychiatry. Psychol. Med. 2021 , 51 , 2515 -2521.
89. Séroussi,  B.;  Hollis,  K.F.;  Soualmia,  L.F.  Transparency  of  Health  Informatics  Processes  as  the  Condition  of  Healthcare

<!-- PAGE 27 -->

- Professionals' and Patients' Trust an d Adoption: The Rise of Ethical Requirements. Yearb. Med. Inform. 2020 , 29 , 7 -10.
90. Sen, D.; Chakrabarti, R.; Chatterjee, S.; Grewal, D.S.; Manrai, K. Artificial Intelligence and the Radiologist: The Future in the Armed Forces Medical Services. J. R. Army Med. Corps 2019 . http://dx.doi.org/10.1136/jramc-2018-001055
91. Zhang, W.; Weiss, J.C. Fair Decision-Making under Uncertainty. In Proceedings of the 2021 IEEE International Conference on Data Mining, ICDM, Auckland, New Zealand, 7 -10 December 2021; pp. 886 -895. 92. Zhang, W.; Weiss, J.C. Longitudinal Fairness with Censorship. In Proceedings of the 36th AAAI Conference on Artificial Intelligence, June 28 2022; Volume 36. 12235-12243. 93. Lekadir, K.; Quaglio, G.; Garmendia, A.T.; Gallin, C. Artificial Intelligence in Healthcare-Applications, Risks, and Ethical and Societal Impacts. EPRS 2022 . 94. Kuzior, A.; Kwilinski, A. Cognitive Technologies and Artificial Intelligence in Social Perception. Manag. Syst. Prod. Eng. 2022 , 30 , 109 -115. Disclaimer/Publisher's Note: The statements, opinions and data contained in all publications are solely those of the individual author(s) and contributor(s) and not of MDPI and/or the editor(s). MDPI and/or the editor(s) disclaim responsibility for any injury to people or property resulting from any ideas, methods, instructions or products referred to in the content.