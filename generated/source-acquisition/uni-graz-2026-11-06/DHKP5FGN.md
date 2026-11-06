---
source_file: DHKP5FGN.pdf
conversion_date: 2026-11-06T10:51:21.264838
converter: docling
quality_score: 95
---

<!-- image -->

## Journal of Social Work Practice

Psychotherapeutic Approaches in Health, Welfare and the Community

ISSN: 0265-0533 (Print) 1465-3885 (Online) Journal homepage: www.tandfonline.com/journals/cjsw20

## AI-enhanced ethical decision-making in social work: development and testing of an applicationspecific language model

Jia-Lin Zhao, Li Shen, John Shields, Xiang Huang &amp; Samdan Chokyi

To cite this article: Jia-Lin Zhao, Li Shen, John Shields, Xiang Huang &amp; Samdan Chokyi (04 Jun 2026): AI-enhanced ethical decision-making in social work: development and testing of an application-specific language model, Journal of Social Work Practice, DOI: 10.1080/02650533.2026.2683352

To link to this article:

https://doi.org/10.1080/02650533.2026.2683352

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

Published online: 04 Jun 2026.

Submit your article to this journal

Article views: 116

View related articles

View Crossmark data

曲

CrossMark

<!-- image -->

<!-- image -->

<!-- image -->

<!-- image -->

## AI-enhanced ethical decision-making in social work: development and testing of an application-specific language model

Jia-Lin Zhao a , Li Shen a , John Shields b , Xiang Huang a and Samdan Chokyi a a School of Public Affairs, Nanjing University of Science and Technolog, Nanjing, China; b The University of Sydney Business School, the University of Sydney, Sydney, Australia

## ABSTRACT

We  develop  and  test  an  application-specific  language  model  for supporting  ethical  decision-making  in  social  work.  The  model  is built  using  Gemini  2.5  pro  with  seven  agents,  six  of  which  are responsible  for  information  aggregation  of  possible  actions,  relevant ethical issues, principles, standards, laws and values while the seventh is responsible for summarising the information and recommending and justifying issue-related decisions. We further test the model via 70 simulated cases. In evaluating the appropriateness of social  workers'  case-specific  actions,  the  model's  judgements showed  80%  alignment  with  the  answers  from  the  casebook.  It also  provided  sufficient  reasons  or  appropriate  remedial  plans  in nearly half of  the  cases.  Errors  were  due  chiefly  to  inaccuracies  in understanding legal compliance requirements, inadequate consideration of case-specific situations, and logical fallacies. Conversely, in  some  cases  the  model  provided  responses  that  were  more appropriate  than  those  from  the  casebook.  Accordingly,  we  see considerable  scope  to  apply  artificial  intelligence  in  supporting social work ethical decision-making.

## Introduction

Helping  professionals  such  as  therapists,  healthcare  workers  and  social  workers  frequently  face  ethical  issues  when  serving  their  clients  (Beauchamp  &amp;  Childress,  1979; Reamer,  2018).  In  particular,  it  is  important  for  social  workers  to  make  decisions  in accordance with their professional values and ethics. Typical ethical issues faced by social workers include confidentiality and privacy, self-determination and paternalism, professional  boundaries  and  dual  relationships,  divided  loyalties  and  allocation  of  limited resources (Reamer, 2018). Sometimes, social workers may also face ethical dilemma, 'a situation  in  which  professional  duties  and  obligations,  rooted  in  core  values,  clash' (Reamer, 2018, p. 4).

Various theoretical frameworks are available to identify and resolve ethical issues in social work (e.g. Dolgoff et al., 2012; Reamer, 2018). Yet the decision-making process still largely depends on human judgement, which may vary based on individual knowledge,

<!-- image -->

## ARTICLE HISTORY

Received 4 January 2026 Accepted 23 May 2026

## KEYWORDS

Social work ethical issues; artificial intelligence; decision making; application-specific language model

<!-- image -->

experience and bias. In countries such as China, where the profession of social work is still developing, a lack of high-quality supervision resources may complicate the process of ethical decision-making further still (Wu et al., 2021). The development of social work in  China  is  also  largely  supported  and  affected  by  the  government  (Chen,  2025). Accordingly,  there  are  more  challenges  for  Chinese  social  workers  to  balance  the responsibilities for both individual clients and society at large (Chen, 2025). Yet there are  universal  principles  shared  by  the  international  social  work  community  such  as human  dignity  and  social  justice  (Sonnenberg,  2021).  Social  workers  in  China  also hold these values (Gao, 2014; Gao &amp; Yan, 2015; Zhao, 2016). Due to the lack of national standard, they also refer to theories and codes from western countries to address ethical issues (Zhao, 2016).

The growing sophistication and uptake generative artificial intelligence (AI) has the potential to render the profession like social work particular assistance in grappling with complex ethical matters. Large-language models based on transformer structure, such as ChatGPT, are pre-trained with billions of points of internet content and have the capacity to  process  human  language  formats,  aggregate  metadata  information,  engage  in  datadriven  reasoning  and  propose  evidence-based  answers  and  solutions  (Dwivedi  et  al., 2023). Yet the 'thinking style' of AI is still based on mathematical calculations of token values and produce output by matching their patterns with the training data (Vaswani et al.,  2017),  which  differs  from  humans'  inductive reasoning. Accordingly, AI may only serve as a cognitive extension rather than substitution for human reasoning by providing more information and recommendations (Hao et al., 2024).

Several studies have examined AI's ability to provide answers for social work problems and solving ethical issues. Victor et al. (2023), for instance, find that ChatGPT scored 76%, 80% and 64% in the Bachelors, Masters and Clinical exams by the Association of Social Work Boards. Zhao et al. (2025) further find that both ChatGPT and ERNIE Bot passed  the  entry-level  Chinese  Social  Work  Certification  Examination  with  average scores  around  80%.  In  a  recent  study,  Segal  (2025)  explores  the  performance  of ChatGPT  in  dealing  social  work  dilemmas  but  finds  its  disparities  in  analysing  the dilemmas, referring to ethical codes and laws and empathising with clients. Accordingly, there would appear to have considerable merit in developing and testing a  more  reliable  and  professional  AI  system  for  supporting  ethical  decision-making  in social work.

## Developing an application-specific language model for addressing ethical issues: general considerations

With a view to strengthening AI's reliability and sufficiency in dealing with ethical issues in social work, we have chosen to focus on developing an application-specific language model involving three steps: (1) pre-training; (2) prompt engineering adjustment and (3) fine-tuning with domain-specific information (Mann et al., 2025).

The first step involves pre-training. This means that the AI model should be already trained with metadata in order to have basic knowledge and abilities in processing texts and providing answers. Several models such as ChatGPT, Claude and Gemini are capable of fulfilling the purpose. Although many previous studies have used ChatGPT, Google's

Gemini  2.5  pro  currently  ranks  first  in  processing  texts  and  linguistic  precision (LMArena, 2025), which has been used in this study.

Second,  the  model  requires  adjustment  using  prompt  engineering.  Prompts  are instructions inputted by users to guide the work procedure and responses by AI models (Mann et al., 2025). Ethical decision-making is usually complex and needs to take various aspects and information into consideration. Considering the common grounds of strategies to solve ethical issues in social work (e.g. Dolgoff et al., 2012; Reamer, 2018), we employed Reamer's (2018) strategy: identifying the ethical issues, the individuals, groups and  organisations  involved  and  all  viable  actions  and  potential  benefits  and  risks; checking  reasons  by  considering  relevant  ethical  and  social  work  principles,  social work  standards,  policies  and  laws  and  personal  values  and  making  the  decision  and documenting the decision-making process. Accordingly, we establish the decision-making process of Gemini 2.5 pro by two stages. In the first stage, the AI model considers all the aspects and collects relevant information. In the second stage, the model weighs on all the information and makes recommendations. The procedure is depicted in Figure 1.

Third, the model requires further refinement via domain-specific fine-tuning. Finetuning  refers  to  the  process  of  training  AI  models  based  on  local  datasets,  including methods such as retrieval-augmented generation and reinforcement learning (Mann et al., 2025). In this project, we used retrieval-augmented generation by providing relevant ethical principles (e.g. the four principles by Beauchamp &amp; Childress, 1979), social work standards  (e.g.  the  code  of  ethics  by  the  US  National  Association  of  Social  Workers, NASW, 2021) and local  laws  and  policies  to  Gemini  2.5  pro.  Since  there  is  a  lack  of national standards for social work ethics in China, widely used theories and codes from the international social work community can be helpful. Adding laws and policies to the system may further adapt ethical decisions to the local context.

## Model development method

## Test materials

We used the Social Work Ethics in Discourse: Case Studies from Shenzhen's Professional Practice published  by  Shenzhen  Association  of  Social  Workers  (SASW)  in  2022.  The Ministry  of  Civil  Affairs  of  the  People's  Republic  of  China  (MCA)  issued  the Ethical Guidelines for Social Workers in 2012. However, the guideline was somewhat abstract and politically oriented, and not easy to operationalise (Zhao, 2016). Consequently, in 2020, SASW further released the group standard 'Shenzhen Ethics Guidelines for Social Work Practice' providing specific guidance. The group standard is based on global social work values  including  'social  justice,  service,  individual  worth  and  dignity,  importance  of human  relationships,  social  cohesion,  and  the  recognition  of  professional  standards' (SASW, 2020, p. 1). It also covers major ethical issues such as client self-determination, protection of privacy, and informed consent. More importantly, the standard takes local policies  and  laws  into  consideration,  which  help  social  workers  make  more  balanced decisions suitable for the local context.

Used  as  the  testing  materials  in  the  current  study,  the  book  of  case  studies  is  a companion  to  the  Shenzhen  group  standard,  which  has  70  cases  arranged  into  six sections  including  ethical  issues  with  clients  (53  cases),  colleagues  and  fellow  social

<!-- image -->

TheclienouswifsoughtlpfciaorkerPengstatingthatusbandwascmmittingmstiilehpedthocialworerwouldeetwithuandtstoptheabuseutreqd he didnot call thepolice.After discussing the plan and gaining the client's consent,he collaboratedwith staffrom the community'sWomen'sFederationtomeetwiththehusband.. Case 2 (SASW,2022,p.7-8)

Agent6

1. The Client (Wife)-

## Agent5

TraditionalValuesPrioritizing policies

Agent4

Considering relevant social

FamilyIntegrityand Personal

1.Prohibition of Domestic work standards

Agent3

Considering relevant ethical deeplyinfluencedby traditional

“"Face”Above All Else: The client's personal values are

Violence andProtection of

Personal Rights...Civil Code of culture,placing"family

Article1042:Domestic violence the People's Republic of China

being as Primary, but

1.Consider the Client's Well-

Respect forClientsSelf principles

actions,benefits andrisks

Identifying those involved,

Agent2:

Agent1

Identifyingthe ethicalissues harmony”and"face"(social

standing)above her personal abandonment among family

is prohibited.Abuse and

Law May Take Precedence Over

ResponsibilitytoSociety or the

Commitment to the

"Social workers respect and members are prohibited...

Clien...NASWCodeof Ethics,

1.01 Commitment to Client...

their own choices and decisions, promote people's rights tomake

Determination...CitedTexts:

Option 1: Strictly Adhere to the provided this does not threaten

Request...This course of action

Client'sConfidentiality

According to the document (p.

1.ConfidentialityandPrivacy

1),social workers often face therights andlegitimate interests

fully complying with the client's involves SocialWorker Peng

ethical dilemmas relatedto of others."(Global Social Work

Statement of Ethical Principles wife is the source of the

wishes by not revealing that the confidentiality and privacy...

4.2)...

information...It respects the

Paternalism:The document client's right to self-

determination...

are committed torespecting and determination...

promoting a client's right to self- states (p.3-4) that social workers

2. Self-determination and

In thecase study,SocialWorkerPeng's actionwastoobtainconsent after discussingwiththeclient,andthenmeetwiththe husbandjointly

reasonablefirst-choiceoption..RiskofContradictingtheClientsCore

(Focus onempowering the clientand temporarilynot intervening managing and reducing the current risks by“developing a detailed

TheMostReasonableCourse ofAction andRationale:Option4

directly inthe conflict with the husband)..it involves actively corresponds toOption3in the table above...itisnot themost

s

Figure 1. Decision-making procedure for Gemini 2.5 pro in solving social work ethical issues including agents' functions and sample outputs.

| Compliance with Values             | client's (wife's) value harmony and "face," but conflicts with the social worker's value of resolving issues openly and legally.* Aligns with the of maintaining superficial family     |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Legality                           | stop theillegal act of "domestic violence."..*                                                                                                                                          |
| Compliance with Ethical Codes      | Violates professional integrity and fails to consider the client's well-being as primary (due to high risk)..                                                                           |
| Ethical Principles Compliance with | with the principles of "confidentiality” and "respect for self- determination," but Largely complies may violate the principle due to effectivenes.. "beneficence" limited              |
| Potential Risks                    | 1. The social worker's professional integrity is compromised; they intervention is vague, may get caught in a 2. The reason for effectiveness.. limiting the lie.                       |
| Potential Benefits                 | 1. Maximally respects the client's right to and confidentiality, maintaining the trust self-determination 2. May temporarily retaliation from the relationship. avoid direct husband... |
| dosos Possible Courses of Agent7   | intervene in the name Strictly adhere to confidentiality requirements and of a third party. Option 1:  Action                                                                           |

<!-- image -->

workers (4 cases), interns and volunteers (5 cases), service agencies, service user organisations and service purchasers (4 cases), social work profession (3 cases) and society (1 case). For each case, a description is first provided, and then an analysis is given regarding whether the action of the social worker is appropriate and the reasons by referring to the Shenzhen standard, relevant laws and policies.

## Building the AI model

We accessed Gemini 2.5 pro via the Vertex AI studio in Google cloud (console.cloud. google.com/vertex-ai/studio/). To ensure the reliability of the model, we set the values of both  temperature  and  Top-P  to  0,  which  let  the  model  to  provide  the  least  variable responses. Based on the decision-making procedure proposed earlier (see Figure 1), we further  created  seven  agents  to  perform  distinct  tasks.  Original  prompts  are  available from the corresponding author.

## Agent 1: identifying the ethical issues

This agent needs to identify the main ethical issues or dilemmas involved in the case, such as confidentiality and privacy, self-determination and limitation, professional boundaries and dual relationships, divided loyalties and allocation of limited resources. The agent was further fine-tuned to by uploading Chapters 4 and 5 from Reamer's (2018) Social Work  Values  and  Ethics ,  which  covers  the  common  issues  and  dilemmas  in  clinical practice and macro practice.

## Agent 2: identifying the individuals, groups or organisations involved, and all the possible actions, benefits and risks

We instructed the agent to identify all possible actions for the social workers in the cases, determine the individuals, groups, and organisations involved and assess the potential benefits and risks. Since this task was mainly about understanding the situation in the case and making deduction from it, we applied a zero-shot learning strategy and did not fine-tune the agent with extra materials.

## Agent 3: considering relevant ethical principles

The task of this agent is to collect information about ethical principles relevant to the issues  or  dilemmas in  the  cases.  The  agent  was  fine-tuned  by  uploading  the  materials from Beauchamp and Childress's (1979) four ethical principles, Dolgoff et al.'s (2008/ 2012)  hierarchies  of  ethical  principles,  the  Global  Social  Work  Statement  of  Ethical Principles  (International  Association  of  Schools  of  Social  Work,  ISSAW,  2018)  and ethical principles by NASW (2021). We also uploaded the Ethical Guidelines for Social Workers issued by MCA (2012) to improve the ability of the agent in identifying local ethical principles in social work. To ensure that the information provided by the agent is free  of  AI  hallucination  (Huang  et  al.,  2025),  we  also  instructed  the  agent  to  cite  the original texts from the materials.

## Agent 4: considering relevant ethical standards

The task of this agent is to collect information about the ethical standards directly related to  the  situations  in  the  cases.  The  agent  was  fine-tuned  by  uploading  NASW's  (2021)

6

<!-- image -->

ethical  standards,  which  are  widely  recognised  and  applied  in  social  work  practices. Because there might be cross-cultural differences, and there is no national social work ethical  standard  in  China  currently,  we  also  included  the  ethical  standards  by  Taiwan Association of Social Workers (2008), and the group standard by SASW (2020). For the same reason, we instructed the agent to cite the original texts.

## Agent 5: considering relevant laws and policies

This agent is tasked with collecting relevant laws and policies related to the ethical issues in the cases. Considering the vast number of laws and policies, we only include those at the  national-level  and  those  related  to  the  cases.  Likewise,  the  agent  needs  to  cite  the original  texts.  We  further  fine-tuned  this  agent  using  the  national-level  laws,  which generally cover the targeted groups and related topics in the cases such as personal rights, protection of minors and elders and treatment of those with mental health conditions (e. g. Mental Health Law of the People's Republic of China, 2012).

## Agent 6: considering personal values

The task of this agent is to identify the values of the individuals and groups involved in the  ethical  issues  or  dilemmas,  which  may  also  consider  the  potential  cultural  backgrounds  or  organisational  norms.  Since  the  task  is  mainly  about  understanding  the situations and deducing the values by those involved, similar to Agent 2, we applied a zero-shot learning strategy.

## Agent 7: weighing and making ethical decision

We divided the task of this agent into two parts. First, the agent had to summarise the information provided by the prior six agents, and determine whether the actions complied  with  the  relevant  ethical  principles,  standards,  laws  and  personal  values.  We instructed the agent to provide a summary table of those information, which also suggest potential ethical issues or dilemmas within each action. Second, because each case in the test  materials  also  includes  an  actual  action  of  the  social  worker,  the  agent  made  a judgement on whether the social worker's action in the case is appropriate and provided reasons or substituted plans based on its summary.

## Testing procedure

The test procedure included three steps. First, we inputted the description of each case from the test  book  into  the  first  six  agents,  and  obtained  their  responses  one  by  one. Second,  we  uploaded  the  responses  from  the  six  agents  to  Agent  7  and  obtained  its response, including the summary table and the final ethical decision. Third, we recorded the responses from all seven agents in one PDF document for each case.

## Analytical strategies

We firstly evaluated the 'correctness' of each response from Gemini 2.5 Pro by comparing it  with  the  original  casebook (SASW, 2022). If the AI model's judgement aligned with that of the book's analysis (i.e. both deemed the behaviour appropriate or inappropriate), its  response  was coded as 'correct'. This task was completed by the first author of the

paper (an associate professor of social work) and double-checked by the second author (a professor of social work). However, it should be noted that 'correctness' in the current study only meant the alignment between the AI model's response and the analysis in the original book on whether the behaviours of social workers in the cases were appropriate or not, which did not include the reasons (as we further analysed in the second step). Given the complexity of social work ethical decision-making, the correctness of an action is  always  relative  and  context-dependent.  Since  the  Shenzhen  standard  has  a  balance between  global  social  work  values  and  local  requirements,  calculating  the  degree  of alignment  can  be  one  method  to  provide  reference  points  for  assessing  the  model's capability.

Second,  we  conducted  a  thematic  analysis  of  the  reasons  behind  the  correct  and incorrect  responses  offered  by  the  AI  model.  We  reviewed  the  reasons  and  the  most appropriate action plans it provided, compared them with the case analysis in the original book, and held a panel discussion on the final themes. This analysis may help check the validity  of  the  AI's  responses,  including  whether  it  had  sufficient  reasons  or  better substitute plans to support ethical decisions and why it reached incorrect decisions. It may  also  illustrate  AI's  abilities  in  gathering  and  distilling  relevant  information  (e.g. ethical codes and principles, laws and policies). Each case (including the original case and all the AI's outputs) was reviewed by the first two authors of the paper together with a professional  social  worker  from  the  relevant  fields  including  adolescent  social  work, community social work, and mental health social work.

## Results

## Test performance of Gemini 2.5 pro in ethical decision-making

As shown in Table 1, Gemini 2.5 pro achieved 80% correctness in determining whether the social workers' behaviours were appropriate or not according to the test book in all 70 cases. The rate in each section (e.g. the ethical issues with clients) was also generally stable at  around  80%,  indicating  the  reliability  of  the  AI  model's  ability  in  handling  ethical issues. However, the AI model had different degrees of accuracy in solving positive and negative cases. For positive cases, it had an accuracy rate of 67.5% while for negative cases the accuracy rate was 96.7%. It seems that the model was more capable of recognising a negative  case  in  which  the  social  worker's  behaviour  was  inappropriate  but  was  more reluctant to confirm a positive case in which the social worker's behaviour was appropriate  according  to  the  analysis  from  the  casebook.  This  suggests  the  importance  of further checking the full responses generated by the model, including the reasons it offers and the substitute action plans for inappropriate actions.

## Reasoning given for correct answers

## Correct reasons or substitute action plans

As  shown  in  Table  2,  half  of  the  correct  judgements  provided  by  the  AI  model  were accompanied  by  explanatory  reasoning  and/or  substitute  action  plans  consistent  with those  recommended in the relevant test case.  For instance, in Case 39  (SASW, 2022), Gemini  made  the  correct  judgement  that  social  worker  Peng's  behaviour  was

<!-- image -->

Table 1. Test performance of Gemini 2.5 pro in social work ethical decision-making.

|                                                                                                      | No. of correctness a /all cases (%)   |
|------------------------------------------------------------------------------------------------------|---------------------------------------|
| Total cases (70 cases)                                                                               | 56/70 (80.0%)                         |
| ● Ethical issues with clients (53 cases)                                                             | 42/53 (79.2%)                         |
| ● Ethical issues with colleagues and fellow social workers (4 cases)                                 | 2/4 (50%)                             |
| ● Ethical issues with interns and volunteers (5 cases)                                               | 5/5 (100%)                            |
| ● Ethical issues with service agencies, service user organisations, and service purchasers (4 cases) | 3/4 (75%)                             |
| ● Ethical issues with social work profession (3 cases)                                               | 3/3 (100%)                            |
| ● Ethical issues with society (1 case)                                                               | 1/1 (100%)                            |
| All positive cases (the social worker's behaviour is appropriate; 40 cases)                          | 27/40 (67.5%)                         |
| All negative cases (the social worker's behaviour is inappropriate; 30 cases)                        | 29/30 (96.7%)                         |

Note. a correctness  only  means  the  alignment  between  the  AI  model's  response  and  the  analysis  in  the  casebook  on whether  the  social  workers'  behaviours  in  the  cases  were  appropriate  or  not,  which  did  not  include  the  analysis  of reasons or substitute plans.

Table 2. Reasons for correct and incorrect responses by Gemini 2.5 pro.

| Themes                                                                                                  | No. of codings   |
|---------------------------------------------------------------------------------------------------------|------------------|
| Reasons for correct answers                                                                             |                  |
| ● Correct reasons or substitute action plans                                                            | 28               |
| ● Insufficient reasons or substitute action plans (ignoring what the case needs to address)             | 12               |
| ● Insufficient reasons or substitute action plans (not familiar with local organisational requirements) | 5                |
| ● Insufficient reasons or substitute action plans (not considering case-specific situation)             | 4                |
| ● Better substitute action plans                                                                        | 4                |
| ● Insufficient substitute action plans (not considering relevant ethical standards)                     | 3                |
| Reasons for incorrect answers                                                                           |                  |
| ● Boundaries of legal compliance                                                                        | 5                |
| ● Incorrect reasons (not considering case-specific situation)                                           | 5                |
| ● Incorrect reasons (logical fallacies)                                                                 | 3                |
| ● Better substitute action plans                                                                        | 3                |

inappropriate,  and  provided  the  correct  reasons  and  substitute  action  plans,  which emphasised the confidentiality and self-determination of the client:

In the case, the action of the social worker Peng in contacting the community social worker without prior communication with Xiao Ming or his parents was not appropriate . . . This action seriously violated the fundamental ethical principles of 'confidentiality and privacy' and 'client self-determination'. . . . Based on the analysis, Action Plan 2 (seeking consent before initiating cross-agency collaboration) is the most reasonable course of action. This plan fully aligns with multiple core ethical principles, including 'client self-determination', 'confidentiality and privacy', 'beneficence', and 'minimum harm'. It seeks to maximize the  client's  best  interests  while  choosing  the  path  that  causes  the  least  harm  and  most respects the client's autonomy . . .

## Insufficient reasons or substitute action plans (ignoring what the case needs to address)

In some cases, the Gemini model made the correct judgement regarding the appropriateness of the social worker's behaviour in the case, but provided insufficient reasons or alternative actions due to discounting or ignoring some salient and actionable aspects of the case. For instance, as described in Case 22 (SASW, 2022, p. 26):

<!-- image -->

A community center launched an 'After-School Classroom' service. One day, Xiao Qiang's mother contacted the center's social worker, Peng, by phone, informing him that Xiao Qiang had not returned home even after 8:00 PM. The social worker responded that Xiao Qiang had left  the  'After-School  Classroom'  as  early  as  6:00  PM.  Xiao  Qiang's  mother  became angry with Peng, blaming him for failing to ensure the child's safety. Later that evening, around 9:00 PM, Xiao Qiang returned home on his own. It turned out he had gone to a classmate's house to play games and lost track of time.

Clearly, the social worker's behaviour in the case is not appropriate, because the social worker  had  the  responsibility  to  ensure  the  safety  of  the  child  involved  while  also reassuring  and  calming  the  mother.  These  are  both  addressed  by  the  case  analysis  in the  test  book  (SASW,  2022).  Conversely,  although  Gemini  judged  the  social  worker's behaviour to be inappropriate, its substitute plan did not mention the need to conduct an immediate search for the child.

## Insufficient reasons or substitute action plans (not familiar with local organisational requirements)

Since  many  social  workers  are  employed  by  social  work  agencies,  they  are  usually required to follow the relevant organisational policies (Reamer, 2018). Case 40 described a social worker who wanted to use a case of his clients for a competition of exemplary case studies (SASW, 2022). It is clear that the social worker should first obtain informed consent from the client. However, in the local context, and as described in the test book (SASW,  2022,  p.  42),  Peng  should  also  obtain  the  permission  from  the  employing organisation: ' . . . It is recommended that Peng first submit an application to his organization and, after obtaining permission, communicate with the client . . . ' Gemini mentioned the procedure of informed consent, but it failed to include the need for organisational pre-approval.

## Insufficient reasons or substitute action plans (not considering case-specific situation)

In some instances, the model missed important information in the case and consequently offered  insufficient  justification  or  recommendations.  Case  37  (SASW,  2022),  for instance, describes a social worker who kept the confidential of an adolescent who had attempted  suicide  by  overdosing  on  medication  and  did  not  inform  his  mother. According to the test book, the social worker's behaviour is inappropriate because ' social workers should prioritize the safety of service recipients' lives and protect their lives and property from harm as the first service principle ' (SASW, 2020, p. 2). The fact is that the adolescent had already attempted suicide strongly indicates that there may be further risk of  self-harm.  Gemini,  however,  seemed  to  underestimate  the  risk  and  only  suggested encouraging the client to disclose the information by himself.

## Better substitute action plans

In four cases, the AI model not only made correct judgement but also provided better alternative action plans than those in the test book. Case 61 (SASW, 2022), for instance, describes a social worker who declined the request from an intern who wanted to use service records for his graduation thesis. According to the test book, Peng's rejection was appropriate,  because  ' Social  workers  should  properly  keep  the  information  of  service recipients and adopt the confidentiality principle for interns and volunteers unless required

<!-- image -->

for service ' (SASW, 2020, p. 7). Gemini not only confirmed the appropriateness of Peng's action but also proposed a better action plan with sufficient reasons:

Action Plan 3 (guiding the student through the formal ethical procedure to obtain authorization) represents the most reasonable course of action . . . It not only protects the client but,  more  importantly,  respects  their  right  to  informed  consent  and  self-determination. Simultaneously,  it  transforms  an  ethical  dilemma  into  a  profound  professional  teaching moment, enabling the intern to learn ethically sound research methods . . .

## Insufficient substitute action plans (not considering relevant ethical standards)

In very rare cases, although Gemini provided a correct judgement, it failed to follow the inputted ethical standards, and consequently provided insufficient alternative plans. For instance,  the  Shenzhen  group  standard  (SASW,  2020)  specifies  a  three-year  retention period of case files. In Case 10 (SASW, 2022), Gemini made the correct judgement, but failed to cite the relevant ethical standards. Instead, it suggested seeking guidance from superiors or professional sources because ' when the specific regulations regarding records management are unclear, taking any substantive action (whether destruction or relocation) carries  inherent  risks '.  Clearly,  the  AI  model  failed  to  give  sufficient  'attention'  to  the relevant standard when making the final decision.

## Reasons for incorrect answers

## Boundaries of legal compliance

It  may be difficult for the AI model to balance legal requirements and the social work profession's key values and ethics. Sometimes it ignored the legal requirement. Case 15 (SASW,  2022),  for  instance,  described  the  transfer  of  a  mental  health  rehabilitation service  recipient'  information.  In  the  case,  although  social  worker  Peng  informed  Ms. Zhou that her information would be forwarded to another social worker, Peng actually did not get Zhou's consent about the treatment of her information. Accordingly, Gemini judged the social worker's behaviour to be inappropriate because it violates the principles of  confidentiality  and  self-determination.  Nevertheless,  Peng's  actions  were  actually appropriate  according  to  the  national  laws  because  the  services  for  individuals  with severe  mental  illnesses  are  under  the  supervision  of  the  government  and  included  in the public health system (Mental Health Law of the People's Republic of China, 2012).

In  other  times,  the  model  followed  laws  too  strictly.  In  Case  32  (SASW,  2022),  for instance, Gemini advocated reporting a client's relapse into drug use to the police based on legal requirements. Yet this may be controversial because it risks undermining the social  worker's professional relationship and trust with the client, potentially compromising service continuity and the client's well-being. According to the case, even without the social worker's report, the client would still undergo mandatory testing soon, and the public security authorities would be notified. Accordingly, instead of reporting, ' the social worker  should  use  this  incident  as  an  opportunity  to  help  Mr.  Dai  identify  the  reasons behind his relapse, explore ways to prevent it in the future, and guide him in adopting a rational perspective on the potential penalties, consequences, and challenges he may face ' (SASW, 2020, p. 34).

## Incorrect reasons (not considering the case-specific situation)

As mentioned earlier in the reasons for correct answers, Gemini may overlook critical information in the case and, on occasions, this led to it making incorrect judgements. In Case 52 (SASW, 2022, p. 51), for instance:

During the COVID-19 pandemic, the client Xiaozhen was quarantined in another province. Peng, the social worker, provided stress management counselling to her through WeChat video  calls.  Meanwhile,  Peng  informed  Xiaozhen  that  she  herself  was  also  under  home quarantine for pandemic prevention, and that what Xiaozhen said might be seen or heard by Peng's family members.

Gemini  judged  Peng's  behaviour  to  be  inappropriate  due  to  its  violation  of  the fundamental principle of professional confidentiality. However, it ignored the fact that the social worker herself was also in home quarantine and that it may be impossible to find a completely private space to conduct the counselling. That was the reason why the social  worker informs the client of her situation and manages to gain her consent for meeting via WeChat.

## Incorrect reasons (logical fallacies)

In very rare cases, Gemini committed obvious logical fallacies. Case 56 (SASW, 2022), for instance, described a social worker who intended to write a case study based on a client to participate  in  a  case  competition  and  obtained  consent  from  both  the  client  and  the organisation. Gemini judged the social worker's behaviour to be inappropriate because it violates the ethical principle of respect for and trust in colleagues:

While it formally adheres to the standard of 'honestly acknowledging contributions' (such as outlined in Section 4.08(b) of the NASW Code of Ethics), the essence of this standard is rooted in mutual respect and consent. Therefore, this action remains ethically flawed.

This reasoning is contradictory. On one hand, the AI model acknowledged the social worker's  behaviour  as  being  aligned  with  cited  ethical  standards;  on  the  other  hand, Gemini also stated that the behaviour did not show respect for colleagues.

## Better substitute action plans

In three cases, Gemini had different judgement from the test book but provided better alternative  plans.  Case  63  (SASW,  2022),  for  instance,  describes  a  social  worker  who disclosed the information of an applicant (Xiao Xu) to the recruitment lead to ensure professional  standards  and  safety  because  the  applicant  was  a  former  user  of  mental health service. The case analysis from the test book suggested that Peng's behaviour was appropriate because ' social workers should actively uphold the overall image of the social work service institution, provide consultation and suggestions, and improve the organization's service standards ' (SASW, 2020, p. 8). Nevertheless, such a judgement is questionable in that it considers only the interest of the organisation and ignored Xiao Xu's right to  confidentiality  and  self-determination.  Gemini  captured  this  point  and  provided  a better choice:

The social worker Peng's action in the case (reporting Xiao Xu's situation to the recruitment lead) was unreasonable . . . While the action addressed the organization's risk assessment needs, it exposed Xiao Xu to significant risks of discrimination and unfair treatment due to

<!-- image -->

privacy disclosure . . . Among all the options, Action Plan Four (communicating with the applicant  Xiao  Xu  before  taking  any  action)  is  the  most  reasonable  . . .  This  approach prioritizes  the  principle  of  'respecting  human  dignity  and  self-determination',  treating Xiao Xu as an active participant in resolving the situation rather than a passive subject . . .

## Discussion

This study proposed an application-specific language model for supporting social work ethical decision-making and tested its performance among 70 simulated cases. The AI model generally performed well in judging the appropriateness of the social workers in the cases, with an accuracy rate of 80% when referring to the answers provided in the casebook.

On the positive side, Gemini's performance in this study illustrates the basic ability of large-language models to assist in solving social work problems (Victor et al., 2023). It further  suggests  that  when  being  pre-trained,  properly  prompted  and  fine-tuned,  an application-specific model can make appropriate decisions for ethical issues (Mann et al., 2025). Segal (2025) found that ChatGPT faced the challenges of dealing with complexities, disparities in reference to the code of ethics and relevant laws and lacking empathy in solving ethical issues. With our Gemini model, these problems are less in evidence. When being fine-tuned with relevant documents, the AI model can correctly cite salient details when making a final decision. It can also take the perspectives of all the stakeholders involved in ethical issues by considering their personal values, different action plans and potential benefits and risks. Furthermore, similar to Victor et al. (2023), we find that the AI model can even provide better substitute plans than those recommended by the casebook.

Nevertheless, the AI model considered here is still prone to error. One major challenge it  struggled  with  was  in  dealing  appropriately  with  legal  and  regulatory  complexity.  It sometimes  overemphasised  the  ethics  of  client  confidentiality,  informed  consent,  and self-determination, consequently failing to adhere to the national law (e.g. Case 15). In other times, it followed the laws too strictly but ignored the key values of social work (e.g. Case  32).  Clearly,  its  decision-making  process  may  need  to  be  supervised  by  more experienced  human  practitioners.  Adapting  social  work  values  and  ethics  into  local systems  and  contexts  is  also  a  major  challenge  facing  Chinese  social  workers,  which may require more research evidence and theories derived from practices (Gao, 2014). A further challenge may be with the basic reasoning abilities of the AI model. Although Gemini  2.5  pro  may  have  high  precision  in  processing  languages  and  texts,  it  still committed logical fallacies and overlooked key information. This is in accordance with the notion of AI hallucination which suggests that the outputs of large-language models may have internal logical contradictions or be inconsistent with the context or information provided (Huang et al., 2025).

Our study makes three main contributions to theoretical understanding of the potential  of  AI  to  support  ethical  decision-making and reasoning. First, we proposed an AI model for dealing with ethical issues and dilemmas in social work. Although there are previous  studies  testing  the  ability  of  AI  models  in  answering  social  work  questions (Victor et al., 2023; Zhao et al., 2025), there is no model specifically designed for ethical decision-making in social work. Second, we built the AI model in Gemini 2.5 pro and

<!-- image -->

empirically tested its performance in dealing with ethical issues. Overall, the model has high degree of alignment in judging appropriateness of the social workers' behaviours with the test book. Since the Shenzhen group standard has a good balance between global social work values and local policies and laws, the findings suggest that by prompting and fine-tuning with relevant materials, the AI model can make reasonable judgement to fit with the local context. Third, we confirmed that the model generally provided correct reasons and substitute plans or even better plans than that in the case analysis from the test  book.  In  other  words,  the  model not  only made correct judgement on the appropriateness of the social workers' behaviours but also provided relevant reasons and plans by citing theories and principles to support its judgement. But there are still challenges to be addressed since our model struggled to deal with the issue of compliance with laws and remained prone to hallucination.

The findings have several implications for social work practice. The AI model developed  in  the  current  study  can  be  adapted  as  a  mobile  device  application,  which  can support social workers' daily activities in the field by providing relevant information and real-time recommendations for solving ethical issues. The model can also help justify the ethical decisions by directly citing ethical principles, standards and laws. The application may be especially needed in countries where social work profession is still developing and short  of  high-quality  supervision  resources.  It  may  help  new  social  workers  become familiar with ethical issues and gather relevant information more efficiently. Hao et al. (2024) further gave an example of how humans can collaborate with AI by 'consulting' its information and recommendations and then make the final decisions. The collaboration was particularly valuable for less experienced people who made decisions based on their intuitions with a higher risk of cognitive biases (Hao et al., 2024). Nevertheless, issues such as confidentiality, protection of privacy, and data security will need to be considered more  fully  when  using  the  AI  model  in  practices  (Reamer,  2023).  Since  the  model reported here is also vulnerable to mistakes, it can only be used to support rather than substitute for judgements by experienced social workers. In other words, the AI model is only a tool for assisting problem-solving, and social workers have the ultimate responsibility to address difficult ethical issues and make decisions to better serve their clients and society. Furthermore, social workers may need to develop relevant skills to better utilise the AI tools such as the understanding of how the models are trained and function and assessing their output critically (Rodriguez et al., 2024).

Given its exploratory nature, our study has inevitable limitations. First, although the AI model was fine-tuned with relevant materials, it can still be improved further via reinforcement learning (e.g. feedback from human experts). Second, the model was only tested by using cases in the Chinese context. Although Chinese social workers share similar values with the international social work community, their decisions may still be affected by the government and laws. Boundaries of legal compliance is also one major challenge for the current AI system. As discussed by Reamer (2018), social workers generally agree that they have  obligations  to  follow  laws,  but  they  still  have  the  responsibilities  to  prevent  basic harms and achieve a balanced plan which can benefit all those involved and the society. Accordingly, since the current system was only designed to consider all these issues equally (with its six parallel agents), weights could be added to certain values or principles (e.g. doing no harm) when formulating the final output in future system designs. These weights can also be adjusted using expert responses and feedbacks to better fit local realities. Third,

<!-- image -->

the current model was only tested via simulated cases. Ethical issues or dilemmas in reality are  complex,  volatile  and  not  amenable  to  a  single  'correct'  interpretation.  They  may involve changes in the persons, groups and communities affected, as well as a process of empowerment.  It  might  be  necessary  for  future  models  to  track  and  analyse  ethical decision-making  processes  in  real  practices  in  order  to  respond  more  effectively. Furthermore,  principles  and  cases  from  specific  practical  domains  can  also  be  included to strengthen the model. Berrick (2018), for instance, proposed eight fundamental principles  in  child  welfare  and  illustrated  the  ethical  conflicts  faced  by  front-line  child  social workers. The framework can be particularly valuable for developing an AI model supporting decision-making in child protection.

In  conclusion,  our  findings  suggest  a  promising  way  forward  for  the  social  work profession; one that combines the meta-data processing efficiency of AI with the profession's most enduring responsibilities to clients, their families and wider society. However, given the limitations of the current AI system, the coercive nature and risks of automated algorithmic  governance  (Ottmann,  2025)  and  a  possible  technological  dystopia  in  the future described by Huxley (1932/2020), it is necessary to ensure the rights and capabilities of all stakeholders (particularly social workers and the vulnerable groups they serve) to participate in the design and critical evaluation of AI as well as its decision-making process (López Peláez &amp; Marcuello-Servós, 2025). As the Ronda Declaration envisions, 'Every person, regardless of age, ability, background, or location, has the opportunity to participate  meaningfully  in  decisions  that  shape  their  lives'  (International  Council  on Social Welfare, 2025, p. 2).

## Disclosure statement

No potential conflict of interest was reported by the author(s).

## Funding

This  work  was  supported  by  the  Humanities  and  Social  Science  Grant  from  the  Ministry  of Education, China [25YJA840026].

## Notes on contributors

Jia-Lin Zhao is an associate professor in social work, and his main research interests include digital social work, adolescent mental health, and human well-being.

Li Shen is a professor in social work, and his major research fields include social work theories and ethics.

John Shields is a professor specializing in human resource management and organizational studies, and his principal areas of research and teaching include performance management and reward management.

Xiang Huang and Samdan Chokyi are undergraduate students majoring in social work.

## References

- Beauchamp, T. L., &amp; Childress, J. F. (1979). Principles of biomedical ethics . Oxford University Press. Berrick,  J.  D.  (2018). The  impossible  imperative:  Navigating  the  competing  principles  of  child protection . Oxford University Press.
- Chen, H. (2025). Social work in mainland China: Past, present, and future. Journal of Social Service Research , 51 (1), 279-283. https://doi.org/10.1080/01488376.2024.2439095
- Dolgoff,  R.,  Harrington,  D.,  Loewenberg,  F.  M.  (2012). 社/uni4F1A工/uni4F5C/uni4F26理实务工/uni4F5C指南 [Ethical decisions  for  social  work  practice]  (J.  Sui,  Trans.;  9th  ed.).  China  Renmin  University  Press. (Original work published 2008).
- Dwivedi, Y. K., Kshetri, N., Hughes, L., Slade, E. L., Jeyaraj, A.,  Kar, A. K., Baabdullah, A. M., Koohang,  A.,  Raghavan,  V.,  Ahuja,  M.,  Albanna,  H.,  Albashrawi,  M.  A.,  Al-Busaidi,  A.  S., Balakrishnan, J., Barlette, Y., Basu, S., Bose, I., Brooks, L.Buhalis, D. . . . Wirtz, J. (2023). Opinion paper: 'so what if ChatGPT wrote it?' multidisciplinary perspectives on opportunities, challenges  and  implications  of  generative  conversational  AI  for  research,  practice  and  policy. International  Journal  of  Information  Management , 71 ,  102642.  https://doi.org/10.1016/j.ijin fomgt.2023.102642
- Gao, J. G., &amp; Yan, M. C. (2015). Social work in the making: The state and social work development in  China. International Journal of Social Welfare , 24 (1),  93-101.  https://doi.org/10.1111/ijsw. 12089
- Gao, X. (2014). 社/uni4F1A工/uni4F5C/uni4EF7值与/uni4F26理: 中/uni56FD本/uni571F化的解释 [Social  work  values  and  ethics:  An interpretation of Chinese localization]. In B. Li (Ed.), 专业的/uni826F/uni5FC3: /uni8F6C型/uni65F6代中/uni56FD社/uni4F1A工/uni4F5C的 守望 [The conscience of China social work] (pp. 41-56). Social Sciences Academic Press (China).
- Hao, X., Demir, E., &amp; Eyers, D. (2024). Exploring collaborative decision-making: A quasi-experimental study of human and generative AI interaction. Technology in Society , 78 , 102662. https:// doi.org/10.1016/j.techsoc.2024.102662
- Huang, L., Yu, W., Ma, W., Zhong, W., Feng, Z., Wang, H., Chen, Q., Peng, W., Feng, X., Qin, B., &amp; Liu, T. (2025). A survey on hallucination in large language models: Principles, taxonomy, challenges, and open questions. ACM Transactions on Information Systems , 43 (2), 1-55. https:// doi.org/10.1145/3703155
- Huxley,  A.  (2020). /uni7F8E丽新世界 [Brave  new  world] .  (C.  Chen  (Trans.).  Shanghai  Translation Publishing House. (Original work published 1932).
- International Council on Social Welfare. (2025). Ronda declaration 2025: On meaningful participation, inclusive social welfare, and democratic local governance .  https://www.icsw.org/es/pub lications/newsletters/276-ronda-conference-rethinking-participation-for-responsive-and-adap tive-welfare-systems
- ISSAW.  (2018). Global  social  work  statement  of  ethical  principles .  https://www.iassw-aiets.org/ archive/ethics-in-social-work-statement-of-principles/
- LMArena. (2025). Webdev arena leaderboard . https://web.lmarena.ai/leaderboard
- López Peláez, A., &amp; Marcuello-Servós, C. (2025). Digital vulnerability, artificial intelligence, and coercive practices: Contributions from digital social work. In G. Ottmann &amp; C. Noble (Eds.), AI and the disruption of welfare: Challenges for social work education and practice (pp. 242-254). Routledge. https://doi.org/10.4324/9781003673675-19
- Mann, S. P., Seah, J. J., Latham, S., Savulescu, J., Aboy, M., &amp; Earp, B. D. (2025). Chat-IRB? How application-specific  language  models  can  enhance  research  ethics  review. Journal  of  Medical Ethics , Advance online publication. https://doi.org/10.1136/jme-2025-110845
- MCA. (2012). 社/uni4F1A工/uni4F5C者职业道/uni5FB7指/uni5F15 [Ethical guidelines for social workers] . https://www.mca. gov.cn/article/gk/wj/201312/20131215000000.shtml
- NASW. (2021). Code of ethics of the National Association of Social Workers .  https://www.social workers.org/About/Ethics/Code-of-Ethics/Code-of-Ethics-English
- Ottmann, G. (2025). Automated algorithmic governance in the social services. In G. Ottmann &amp; C. Noble (Eds.), AI and the disruption of welfare: Challenges for social work education and practice (pp. 54-65). Routledge. https://doi.org/10.4324/9781003673675-5
- Reamer, F. G. (2018). Social work values and ethics (5th ed.). Columbia University Press.

<!-- image -->

<!-- image -->

- Reamer, F. G. (2023). Artificial intelligence in social work: Emerging ethical issues. International Journal of Social Work Values and Ethics , 20 (2), 52-71. https://doi.org/10.55521/10-020-205
- Rodriguez,  M.  Y.,  Goldkind,  L.,  Victor,  B.  G.,  Hiltz,  B.,  &amp;  Perron,  B.  E.  (2024).  Introducing generative artificial intelligence into the MSW curriculum: A proposal for the 2029 educational policy and accreditation standards. Journal of Social Work Education , 60 (2), 174-182. https:// doi.org/10.1080/10437797.2024.2340931
- SASW.  (2020). /uni6DF1圳社/uni4F1A工/uni4F5C/uni4F26理指/uni5F15 [Shenzhen  ethics  Guidelines  for  social  work  practice] . Group standard no. T/SZSWA 004-2020. http://www.szswa.org.cn/#/swa\_ki\_wrapper/swa\_ki\_ detail?id=117
- SASW. (2022). 社工'/uni4F26'语: /uni6DF1圳社/uni4F1A工/uni4F5C/uni4F26理案/uni4F8B [Social work 'ethics' language: Shenzhen social work ethics cases] . SASW.
- Segal, M. (2025). Social workers' evaluation of ChatGPT for solving ethical dilemmas within the limits of confidentiality. Journal of Social Work Practice , Advance online publication. 40 (1), 518. https://doi.org/10.1080/02650533.2025.2480092
- Sonnenberg, K. (2021). Ethics and ethical values in social work and their meaning for international social  work.  In  C.  Ghaderi,  K.  Sonnenberg,  L.  S.  Karim,  N.  N.  Sabir,  Z.  A.  Qader,  &amp;  L.  M. Dünnebacke (Eds.), Social work at the level of international comparison (pp. 175-191). Springer VS. https://doi.org/10.1007/978-3-658-30394-5\_13
- Taiwan  Association  of  Social  Workers.  (2008). 社/uni4F1A工/uni4F5C师/uni4F26理守则 [Code  of  ethics  for  social workers] . https://nusw.org.tw/ethics
- Vaswani,  A.,  Shazeer,  N.,  Parmar,  N.,  Uszkoreit,  J.,  Jones,  L.,  Gomez,  A.  N.,  Kaiser,  Ł.,  &amp; Polosukhin,  I.  (2017).  Attention  is  all  you  need.  In  I.  Guyon,  U.  V.  Luxburg,  S.  Bengio,  H. Wallach,  R.  Fergus,  S.  Vishwanathan,  &amp;  R.  Garnett  (Eds.), Advances  in  neural  information processing systems :  Vol. 30. Curran Associates, Inc. https://proceedings.neurips.cc/paper\_files/ paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf
- Victor, B. G., Kubiak, S. P., Angell, B., &amp; Perron, B. E. (2023). Time to move beyond the ASWB licensing  exams:  Can  generative  artificial  intelligence  offer  a  way  forward  for  social  work? Research on Social Work Practice , 33 (5), 511-517. https://doi.org/10.1177/10497315231166125
- Wu,  L.,  Huang,  Y.,  Chen,  Q.,  &amp;  Shi,  Y.  (2021).  Social  work  students'  experiences  of  ethical difficulties in field placements: A qualitative study in China. British Journal of Social Work , 51 (2), 505-523. https://doi.org/10.1093/bjsw/bcaa174
- Zhao,  F.  (2016). 社/uni4F1A工/uni4F5C/uni4F26理: 理论与实务 [Social  work  ethics:  Theory  and  practice] .  Social Sciences Academic Press (China).
- Zhao, J.-L., Qin, T.-Y., &amp; Shen, L. (2025). Test performance of artificial intelligence in the Chinese social work certification examination. Research on Social Work Practice ,  Advance online publication. https://doi.org/10.1177/10497315251389554
- 中华人民共和/uni56FD精神卫/uni751F法 [Mental  Health  Law  of  the  People's  Republic  of  China].  (2012, October 26). http://www.npc.gov.cn/zgrdw/npc/xinwen/2018-06/12/content\_2055876.htm