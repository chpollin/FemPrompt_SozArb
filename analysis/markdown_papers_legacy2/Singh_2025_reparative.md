---
source_file: Singh_2025_reparative.pdf
conversion_date: 2025-11-02T17:39:51.152021
---

## What Comes After Harm? Mapping Reparative Actions in AI through Justice Frameworks

Sijia Xiao 1 , Haodi Zou 2 , Alice Qian Zhang 1 , Deepak Kumar 2 , Hong Shen 1 , Jason Hong 1 , Motahhare Eslami 1

1 Human-Computer Interaction Institute, Carnegie Mellon University

2 Department of Computer Science and Engineering, University of California, San Diego xiaosijia@cmu.edu

## Abstract

As Artificial Intelligence (AI) systems are integrated into more aspects of society, they offer new capabilities but also cause a range of harms that are drawing increasing scrutiny. A large body of work in the Responsible AI community has focused on identifying and auditing these harms. However, much less is understood about what happens after harm occurs: what constitutes reparation, who initiates it, and how effective these reparations are. In this paper, we develop a taxonomy of AI harm reparation based on a thematic analysis of real-world incidents. The taxonomy organizes reparative actions into four overarching goals: acknowledging harm, attributing responsibility, providing remedies, and enabling systemic change. We apply this framework to a dataset of 1,060 AI-related incidents, analyzing the prevalence of each action and the distribution of stakeholder involvement. Our findings show that reparation efforts are concentrated in early, symbolic stages, with limited actions toward accountability or structural reform. Drawing on theories of justice, we argue that existing responses fall short of delivering meaningful redress. This work contributes a foundation for advancing more accountable and reparative approaches to Responsible AI.

## Introduction

When New York City introduced a law requiring employers to disclose their use of AI systems in hiring and to publish audit results (New York City Department of Consumer and Worker Protection 2021), it was widely celebrated as a breakthrough in algorithmic accountability. Policymakers and researchers saw it as a promising intervention to address bias and discrimination and to drive organizational change (Johnson 2021). Yet, the law stops short of requiring companies to act on audit findings, such as correcting disparate impact. Critics have pointed out that organizations can comply in form but not in substance by disclosing superficial results or by inserting a human reviewerworkarounds that create the appearance of accountability without delivering meaningful reform (Wright et al. 2024).

This example illustrates a gap between recognizing harm and taking responsibility for addressing it. While recent research in Responsible AI (RAI) has made substantial progress in identifying and characterizing harms (Schelble

Copyright © 2025, Association for the Advancement of Artificial Intelligence (www.aaai.org). All rights reserved.

et al. 2024; Zhang et al. 2024; Techtonic Justice 2023) and in enhancing the auditing process (M¨ okander 2023; Metaxa et al. 2021), we still know relatively little about what actions are taken after harm is acknowledged. In particular, it remains unclear how often those actions contribute to meaningful redress for those impacted, which is critical for moving beyond the appearance of oversight to meaningful accountability.

In this paper, we focus on the notion of reparative action. Grounded in theories of justice, we view reparation not merely as a pragmatic fix, but as a normative response to wrongdoing (United Nations General Assembly 2005). We draw from three justice frameworks widely applied in the context of social and technological harm: punitive, restorative, and transformative justice (Feinberg 2019; Zehr 2015; Nocella and Anthony 2011). Using these frameworks, we define 'AI harm reparative action' as the process of remedying the harm caused by AI systems and restoring justice for those affected .

To understand what reparative actions entail, we first examine how reparative actions are (or are not) carried out following documented incidents of AI harm. We use the AIAAIC dataset, 1 a public repository of documented AI harms, to systematically investigate the post-incident actions taken by corporations, regulators, affected users, and other stakeholders. We ask two research questions: RQ(1) What types of reparative actions are taken following AI harm? Whois involved in those reparative actions, and how? RQ(2) How are these actions distributed across cases, and what patterns emerge in the involvement of different stakeholder groups?

To explore this, we first qualitatively analyze a purposefully sampled subset of incidents and develop a taxonomy of AI harm reparative actions. We then apply this taxonomy across 1060 cases in the AIAAIC dataset to examine the prevalence of these reparative actions and stakeholders. We organize the reparative actions into four goals: Acknowledgment, Attribution, Remedy, and Reform . Each goal encompasses distinct actions, ranging from perpetrators' communication to law and policy change. We then apply the taxonomy to see the distribution of actions and stakeholders in the full dataset.

1 https://www.aiaaic.org/aiaaic-repository/user-guide

Our analysis reveals a stark imbalance: most responses stay at an Acknowledgement and Attribution level, such as public statements or third-party audits, while significantly fewer involve Remedy and Reform. This gap reflects a broader accountability shortfall in how the AI ecosystem responds to harm.

We draw on theories of justice to interpret what meaningful reparation could look like. Punitive justice emphasizes holding perpetrators accountable through consequences; restorative justice focuses on the needs and voices of those harmed; and transformative justice seeks to address the structural conditions that enabled harm. Yet current practices often fall short of these ideals, lacking clear accountability, offering limited support to affected communities, and rarely confronting systemic causes. We also highlight the vital but often overlooked role of affected communities and civil society in initiating responses, and suggest how future reparation practices might engage them more fully.

## Related Work

In this section, we review three areas of research relevant to our study. First, we summarize how responsible AI research has approached harm identification and assessment. Second, we examine what is known about responses to AI harm. Third, we draw on justice frameworks to provide conceptual grounding for analyzing reparation, adapting these traditions to the context of AI harm.

## Identifying and Assessing AI Harm

We follow a normative definition of AI harm as a setback to an individual or group's interests caused by the design, deployment, or use of an AI system (Diberardino, Baleshta, and Stark 2024). Existing research largely emphasizes harm detection at the design and development stages and evaluation after AI is created (Raji et al. 2020). Researchers and practitioners increasingly turn to AI auditing, which involves systematic evaluations of AI systems to assess compliance with ethical, legal, or organizational standards (M¨ okander 2023; Metaxa et al. 2021; Birhane et al. 2024). A related technique is AI red-teaming which adopts a more adversarial perspective on stress-testing AI systems and simulation of bad actors or harmful use cases to reveal emergent or latent risks (Ganguli et al. 2022). On the other hand, benchmarking tools such as UnsafeBench (Qu et al. 2024) and AgentHarm (Andriushchenko et al. 2024) enable quantification of potential risks.

While these approaches are increasingly applied to postdeployment systems (Casper et al. 2024; Singh et al. 2025), the goal remains oriented toward harm prevention and risk detection. Few provide mechanisms to address harm once it has occurred or to involve affected parties in shaping the response. To address this gap, emerging research has proposed participatory methods that incorporate users into the auditing and red-teaming process (Lam et al. 2022; Cabrera et al. 2021; Shen et al. 2021; Deng et al. 2023, 2025). These approaches draw on users' situated knowledge to uncover harms that technical evaluations may overlook. However, scholars have questioned whether these methods truly foster accountability or merely serve as corporate risk management strategies (Gillespie et al. 2024; Feffer et al. 2024). Our work complements this line of work on detection and evaluation by shifting focus to the aftermath of harm. We examine how AI harm is acknowledged and repaired: who takes action, in what form, and whether these responses align with the needs of those affected.

## What Happens after AI Harm is Surfaced?

While much attention has focused on preventing AI harm, a growing body of research examines how individuals and communities respond after harm has occurred. Studies have documented acts of resistance and refusal by affected users and workers (Velkova and Kaun 2021; Ganesh and Moss 2022), as well as conditions that prompt these responses. For instance, Johnson et al. analyzed the abandonment of algorithms following public backlash (Johnson et al. 2024), while Ehsan et al. show how withdrawn systems can still erode institutional trust (Ehsan et al. 2022). Others have explored how people believe AI harms should be addressed, such as public preferences for punishment or accountability (Lima, Grgi´ c-Hlaˇ ca, and Cha 2023).

Together, these studies shed light on diverse post-harm responses, yet most focus on isolated cases, specific stakeholder groups, or relatively narrow accountability mechanisms. As a result, we lack a system-level understanding of how different actors respond after harm is surfaced and whether these responses reflect principles of accountability or reparation (Bogiatzis-Gibbons 2024). DeVrio et al.'s taxonomy offers a foundational framework by categorizing grassroots responses to algorithmic harm, emphasizing the roles of power dynamics in these interactions (DeVrio, Eslami, and Holstein 2024). Our study builds on this work by analyzing over 1,000 AI harm incidents to map stakeholder actions at scale and identify where reparative efforts occur or are absent. By focusing on reparation, we move beyond harm detection to examine the obligations that arise once harm becomes visible.

## Reparative Action in Justice Frameworks

This paper draws on three major justice traditions-punitive, restorative, and transformative justice-to contextualize different approaches to reparation. Punitive justice emphasizes holding perpetrators accountable through proportional punishment, such as incarceration, fines, or legal sanctions (Feinberg 2019; Foucault 2023; Ashworth and Kelly 2021). It is the dominant model in most legal systems and widely used across online and offline governance (Gillespie 2018). In contrast, restorative justice centers the needs of those harmed, aiming to repair relationships and rebuild trust through practices such as public acknowledgment, apology, dialogue, and community-based support (Zehr 2015; Pranis 2015). It has been widely applied in criminal justice and increasingly studied in digital governance and online harm contexts (Xiao, Jhaver, and Salehi 2023; Xiao et al. 2020). Transformative justice builds on these traditions by addressing the structural conditions that enable harm, such as racism, ableism, and economic injustice (Morris 2000; Kaba 2021). It expands the idea of reparation beyond individual or relational repair, advocating for systemic change through institutional reform, power redistribution, and community-led design (Kaba and Hassan 2019).

These frameworks offer complementary perspectives in how they define harm, assign responsibility, and envision repair. Punitive and restorative justice both focus on interpersonal accountability, but take different approaches: punitive justice emphasizes external consequences such as punishment and deterrence, while restorative justice emphasizes mutual recognition, healing, and support for those affected (Wenzel et al. 2008). In addition, while restorative and transformative justice both center the harmed party, they differ in whether the aim is to restore relationships or to transform institutions (Kim 2021).

These theories of justice have been widely applied to discussions of harm reparation in offline contexts and the governance of online communities (Nocella and Anthony 2011; Chordia et al. 2024). In the context of harm caused by AI systems, however, the process of reparation remains underexplored, and little attention has been given to the normative frameworks needed to assess the adequacy of such responses. In this study, we use these justice frameworks not only to interpret reparative actions, but also to evaluate how these actions contribute to meaningful repair.

## Methodology

We based our analysis on the AIAAIC repository of AI incidents, an independent, public-interest resource that documents events and controversies involving AI, algorithms, and automation 2 . Compared to similar resources (e.g., the AI Incident Database), AIAAIC offers greater breadth and detail, with over 1000 incidents that include summaries, analyses of causes and implications, and links to related news coverage. It has been maintained by global wide volunteers and has been widely used in AI harm research to examine the consequences of AI failures and to develop harm taxonomies (Lee et al. 2024a; Johnson et al. 2024).

Our analysis of the dataset involved two main stages: (1) developing a taxonomy of reparative actions based on a purposive sample of incidents and guided by justice frameworks, (2) identifying broader patterns by analyzing each incident with large language models (LLMs).

## Developing a Taxonomy of AI Harm Reparation

We used all 1,060 complete incident entries submitted to the AIAAIC repository before December 2024 where each entry contains a description of the incident, details of postincident developments, and references to external reporting. To construct our taxonomy of reparative actions, we analyzed a purposively sampled subset of incidents, as detailed below.

Data Familiarization Given the dataset's scale and diversity, we began with a familiarization phase to understand the structure and content of reported responses. Three researchers independently reviewed each incident summary and, when needed, consulted linked news articles to clarify

2 https://www.aiaaic.org/

timelines and stakeholder involvement. During this phase, we manually recorded the post-incident actions described in the 1060 incidents and identified the stakeholders responsible for initiating them (see Appendix A for an example).

Selection of taxonomy development dataset Our initial review revealed that post-incident responses in the AIAAIC repository varied significantly. While some incidents involved concrete follow-up measures, such as algorithmic audits, product recalls, or financial compensation, we noticed many incidents that concluded with general communications or vague promises of future investigation. As a result, directly drawing a random sample from the full dataset risked underrepresenting reparative strategies.

To address this, we defined the criterion of substantial reparative action as those leading to tangible outcomes beyond verbal communication. These include issuing refunds, redesigning products, initiating consequential investigations, and implementing staffing or policy changes. Isolated public statements or investigations without followthrough were excluded.

Using this criterion, we applied purposive sampling (Campbell et al. 2020) to identify 671 relevant incidents. From these, we randomly selected 200 to form the taxonomy development dataset . To ensure analytical saturation, we spot-coded 20 additional incidents (5% of the remainder) (Lee et al. 2024b). No new action types emerged, indicating that the sample sufficiently captured the range of reparative responses.

Developing the AI harm taxonomy To construct our taxonomy of AI harm reparation, we conducted a thematic analysis (Creswell and Creswell 2017) of the 200-incident taxonomy development dataset. While our analysis was primarily inductive, it was informed by concepts and language drawn from restorative, punitive, and transformative justice, which offered conceptual grounding for distinguishing types of reparation.

Webegan by identifying and coding specific post-incident actions and the stakeholders who initiated them. For example, corporate responses such as apologies or explanations were grouped under Perpetrators' Communication, while regulatory fines and legal charges were coded as Repercussions. Stakeholders were grouped based on their functional roles, such as Regulators and Government Bodies, Media, or Affected Users. While our action labels and categories were shaped by justice discourse, we did not assign individual actions to particular justice frameworks , as many actions could be interpreted through multiple lenses depending on context.

In the next phase, we organized the action categories based on their underlying goals and orientations as reflected in justice frameworks. This approach allowed us to identify both common justice processes such as acknowledgment, accountability, and redress, and the distinctive contributions of each framework such as the emphasis on support to affected communities in restorative justice or systemic change in transformative justice. Through this lens, we developed four overarching goals in reparation: Acknowledgment, Attribution, Remedy, and Reform . We refined the taxonomy through iterative team discussions over several months, shaping both action categories and stakeholder groupings. The final taxonomy appears in Table 1 and is elaborated in the findings section.

## Analyzing Reparative Actions At Scale

Wenext examine how these reparative actions are distributed in the AIAAIC incident database. To address this, we applied the taxonomy developed in the previous stage to all 1060 incidents. Given the scale of the dataset, manual coding was impractical. Recent research has demonstrated the potential of large language models (LLMs) to support deductive qualitative coding at scale (Xiao et al. 2023; Mun et al. 2024). We used GPT-4 Turbo, accessed via the OpenAI API 3 , to assist with this multi-label classification task, in which the model identified the presence or absence of each predefined reparative action and stakeholder category within incident descriptions.

We scraped each incident's summary and linked articles to form a text corpus, then applied a two-step prompting pipeline. First, the model extracted stakeholder-action pairs, mirroring the structure of our manual coding. Second, it assessed whether each action category was present, classified responsible stakeholders, and provided supporting evidence. An example prompt is included in Appendix C. To validate this approach, we compared model outputs to human annotations for a random sample of 200 incidents (20 per action category). Three coders labeled action and stakeholder categories, achieving 93% inter-coder reliability for actions and 90% for stakeholders. Using these annotations as ground truth, the LLM achieved 87% accuracy on actions and 79% on stakeholders, indicating substantial agreement. Based on this validation, we applied the LLM to code the remaining incidents. Summary statistics and prompt details are provided in Appendix D.

## Limitations

Our analysis draws on the AIAAIC repository, which aggregates incidents primarily from public sources such as news articles. As a result, it may overrepresent high-profile cases while overlooking less visible harms. Some stakeholder actions-such as private responses by affected individuals (DeVrio, Eslami, and Holstein 2024) or undisclosed internal changes by organizations (Lukpat)-may be difficult to detect, potentially leading to underestimation of involvement and remedy.

To scale analysis across the dataset, we used large language models. While we validated model outputs against human-coded samples and carefully designed prompts, LLM performance remains shaped by training data and prompt construction (Guo et al. 2024). We treat LLMassisted coding as a tool for identifying large-scale patterns, not as a replacement for human interpretation.

3 https://platform.openai.com

## A Taxonomy of AI Harm Reparative Actions Overview: Justice-oriented organization of taxonomy

We present a taxonomy of AI harm reparative actions (Table 1), organized according to four overarching goals that reflect key orientations in justice theory: Acknowledgment , Attribution , Remedy , and Reform . Rather than assigning each action to a specific justice framework, we used concepts from punitive, restorative, and transformative justice to group actions based on their underlying reparative aims. Acknowledgment and Attribution are foundational steps shared across justice traditions: addressing harm begins with recognizing its occurrence and establishing responsibility (United Nations General Assembly 2005). Remedy aligns with both punitive and restorative justice, though its emphasis is on redress and interpersonal accountability (Zehr 2015; Duff 2005). Reform , on the other hand, reflects the commitments of transformative justice, which seeks to address systemic conditions and prevent future harm (Morris 2000).

Each goal encompasses distinct types of actions and the stakeholders who initiate them 4 . While these goals reflect a general progression from surfacing harm to pursuing structural change, they are intended as categories rather than a prescriptive sequence. In practice, incidents may engage with only a subset of these goals or pursue them in a nonlinear or overlapping manner. This justice-informed structure allows us to evaluate not only what actions occur but also how they reflect broader commitments to accountability and repair.

To contextualize the taxonomy and illustrate broader patterns, we present a high-level summary of how frequently each reparative goal appears across the dataset. While the taxonomy is qualitatively developed to reflect justiceoriented goals and actions, this accompanying quantitative overview provides an empirical lens for understanding the prevalence and distribution of reparative responses in practice.

In our analysis of 1,060 AI incidents, 54% involved actions related to Acknowledgment and 47% involved Attribution . By contrast, only 15% of cases included any form of Remedy , and 28% showed evidence of Reform . Figure 1 presents the distribution of specific actions across these goals. The most frequent action was communication from perpetrators, appearing in 541 cases (51%). In comparison, more impactful forms of follow-through were rare: only 7% of cases involved legal or policy reform, 6% mentioned compensation, and just 4% resulted in the discontinuation of a product or feature.

Below, we describe our taxonomy in detail. We refer to incidents using their AIAAIC case ID, abbreviated as A[case ID] (e.g., A1673).

## Acknowledgment

Acknowledgment, the first step in responding to AI harm, seeks to make the harm visible and initiate collective sensemaking. While these actions do not provide material repair,

4 Stakeholder group definitions are provided in Appendix B.

Table 1: Taxonomy of Reparative Actions. This table presents our taxonomy of reparative actions, organized by four goals: Acknowledgment, Attribution, Remedy, and Reform. Each action lists the initiating stakeholders and examples. The taxonomy highlights the range of justice orientations and multi-stakeholder participation in AI harm responses.

| Goal           | Reparative Action             | Major Stakeholders                              | Examples                                                                 |
|----------------|-------------------------------|-------------------------------------------------|--------------------------------------------------------------------------|
| Acknowledgment | Public Outcry                 | General Public, Advocacy Groups, Affected Users | Protests; Petitions; Online backlash                                     |
| Acknowledgment | Perpetrators' Communica- tion | AI Corporations                                 | Denials; Justifications; Apologies                                       |
| Attribution    | Investigation of Harm         | Regulators, Media, AI Corpo- rations            | Internal corporate audits; Govern- ment audits; Investigative journalism |
| Attribution    | Initiation of Lawsuits        | Affected Users, Advocacy Groups, Regulators     | Civil or regulatory lawsuits                                             |
| Remedy         | Repercussions                 | Regulators, AI Corporations                     | Fines; Criminal charges; Dismissals                                      |
| Remedy         | Compensation                  | AI Corporations, End-Users                      | Refunds; Settlements                                                     |
| Reform         | AI Design Changes             | AI Corporations                                 | Algorithm redesign; Adjustments to product safety protocols              |
| Reform         | Content or Product Removal    | AI Corporations                                 | Content takedown; Product recalls                                        |
| Reform         | Discontinuation               | AI Corporations                                 | Shutting down chatbots or features                                       |
| Reform         | Law or Policy Change          | Regulators, AI Corporations                     | New laws; Internal policy updates                                        |

Figure 1: Distribution of Reparative Actions by JusticeOriented Goals . Perpetrators' communication was most common, while legal or policy change, compensation, and product discontinuation were among the least frequent, each appearing in fewer than 8% of cases.

<!-- image -->

they play a crucial role in shaping public narratives, surfacing concerns, and influencing how subsequent responses unfold.

Public outcry We define public outcry as the expression of concern, anger, or dissatisfaction from members of the public, often emerging through online or grassroots channels. Public outcry occurred in 95 of the 1,060 cases (8.96%). This action was primarily driven by the general public (70 cases), followed by affected users (28) and advocacy groups (16). These actors often acted as early signalers of harm, helping to surface incidents before formal account- ability mechanisms were triggered.

One common form of public outcry is social media backlash. For example, when FaceApp released a 'hot' filter that reinforced racist and Eurocentric beauty standards, users and critics voiced concern online, quickly drawing broader attention (A1673). Public outcry can also take more organized forms, including protests, petitions, crowdfunding efforts, or consumer boycotts. In one case, Fight for the Future launched a campaign against the University of British Columbia's use of Proctorio, sparking widespread opposition to automated student surveillance. Their efforts were widely shared on social media and echoed by students and advocacy groups, catalyzing broader resistance to automated surveillance in education (A0473). The visibility and influence of such outcry often depend on amplification by journalists and advocacy groups, who help transform scattered responses into broader public narratives.

Perpetrators' communication We define perpetrators' communication as the public statements made by the party responsible for AI harm. This was the most frequent response in our dataset, appearing in 541 of 1,060 incidents (51.04%), predominantly issued by AI corporations (489 cases) and end-users (76 cases). These statements are typically reactive, prompted by media scrutiny, legal threats, or public backlash. While they often appear reparative on the surface, they frequently serve reputational management goals rather than delivering accountability. Nonetheless, public communication can be an important first step in acknowledging harm and setting the stage for future action.

Such statements range from acknowledgments and promises of improvement to deflections of responsibility.

When Air Canada's chatbot provided misinformation to a customer, the airline acknowledged the issue and promised to update the system to prevent recurrence. However, such acknowledgments are not always paired with substantive commitments (A1339). By contrast, when Tesla faced a lawsuit over a crash involving its autonomous driving system, it publicly released vehicle logs to suggest driver error, denying system fault (A0555). In another case, when the startup Moodbeam was criticized for emotional surveillance in the workplace, it defended the product as a tool for supporting remote workers, downplaying privacy concerns (A0515).

Despite their visibility, these statements do not often commit to remedy or structural reform. This may partly reflect practical constraints: systemic changes often require time, coordination, or factors beyond a single actor's control. Still, the absence of meaningful follow-up creates a gap between symbolic acknowledgment and substantive repair. In many cases, these communications remain the only public-facing response, leaving affected communities without redress or closure.

## Attribution

The second type of reparative action centers on assigning responsibility. These actions serve to legitimize harm claims, clarify accountability, and sometimes lay the groundwork for downstream reparative or punitive measures.

Investigation of harm We define investigations of harm as formal efforts to examine an AI incident. This action appeared in 357 incidents (33.68%). Regulators and government bodies led most investigations (220 cases), followed by media organizations (77) and AI corporations (72). While all three groups play investigative roles, they differ in authority, transparency, and power to enforce consequences.

Regulatory investigations carry the strongest mandate. Government and public agencies can issue fines, bans, or legal action. For example, Spain's data protection authority fined Plastic Forte after finding it used facial recognition technology without proper consent (A1025).

Investigative journalism plays a critical role in surfacing harm, especially when formal oversight is lacking. In one case, journalist Ko Narin exposed deepfake pornography in South Korean schools, prompting public outcry and eventually a government investigation into Telegram's role in the abuse (A1727). However, journalistic investigations rarely lead to accountability on their own. For example, despite ProPublica's expos´ e on McKinsey's violence-associated analytics system at Rikers Island, the system remained in use (A0534).

Corporate-led audits are internally driven and often lack transparency or external accountability. Figma's CEO launched an internal review of an AI feature suspected of replicating copyrighted designs, but the audit's findings were never fully disclosed (A1560). Across such cases, we found that internal investigations are inconsistently reported and often lack transparency unless media or public scrutiny compels a response.

Initiation of legal actions We define initiation of legal actions as the act of formally submitting a legal complaint in response to an AI harm incident. Initiation of Legal Actions appeared in 176 incidents (16.6%). Some major stakeholder groups include affected users and non-users (84 and 27 cases), advocacy groups (44), and regulators and government bodies (23). These cases are often protracted, with few reaching resolution during our study window.

Advocacy groups frequently turn to litigation when other accountability channels fail. For instance, the UK-based Public Law Project challenged the Home Office's algorithm for flagging 'sham marriages,' citing discrimination and GDPR violations. As of the latest reporting, the case had not reached a resolution (A1389).

Affected Individuals, including public figures and professionals , also initiated lawsuits, typically over severe harm or personal rights violations. For example, several religious authors sued Meta and Microsoft for allegedly generating AI content derived from their copyrighted works (A1149). In another case, Megan Garcia filed a negligence lawsuit against Character AI after her son died by suicide following emotional attachment to a chatbot (A1781). Actress Scarlett Johansson also sued an AI developer for unauthorized use of her likeness (A1165).

Regulators and government bodies also initiated legal proceedings, often with stronger enforcement power and clearer outcomes. For example, the U.S. Federal Trade Commission (FTC) sued Facebook for its role in the Cambridge Analytica scandal, resulting in a $5 billion fine and a 20-year consent order. The UK Information Commissioner similarly imposed penalties and restrictions (A0128).

While lawsuits provide a formal avenue for redress, our findings show they are typically slow-moving, legally complex, and more accessible to well-resourced individuals or organizations. Cases initiated by regulators are far more likely to result in concrete consequences than those led by private actors.

## Remedy

These actions involves concrete responses aimed at addressing harm through punishment or material compensation. Unlike earlier actions that are largely symbolic or discursive, these actions impose consequences on responsible actors or offer redress to affected parties.

Repercussions Repercussions are punitive consequences imposed on a responsible entity for AI harm. Repercussions were documented in 114 incidents (10.75%). They were almost entirely enforced by regulators and government bodies (101 cases). These actions often arise when existing laws, such as those related to privacy, intellectual property, or safety, are violated in the deployment or use of AI systems.

Regulatory and legal authorities imposed a range of formal penalties, including financial fines, legal prosecution, and usage bans. Many of these actions targeted corporations for unlawful uses of AI technologies. For example, Sweden's Privacy Protection Authority fined the national police for deploying Clearview AI's facial recognition system without proper authorization in child abuse investigations (A0307). In another case, the U.S. Federal Trade Commission banned Rite Aid from using facial recognition technolo- gies for five years and required new privacy and oversight measures (A1253). In rare but severe instances, individuals also faced criminal prosecution. In A1736, a Massachusetts man was arrested for cyberstalking after using AI tools to generate fake nude images and impersonate a victim through chatbot systems.

Some organizations also enacted internal consequences following public backlash or controversy. For instance, the editor-in-chief of Die Aktuelle, a German magazine, was fired after publishing an AI-generated fake interview (A0995). While these actions represent a form of accountability, they are not the result of formal legal enforcement and are typically not subject to public oversight or consistent standards.

Taken together, these cases show that while punitive consequences are possible, they remain relatively limited in scope and frequency. Most occur within the boundaries of existing legal frameworks and require institutional authority to be meaningfully enforced, highlighting the challenges of ensuring accountability without regulatory mechanisms.

Compensation We refer to compensation as monetary or material remedies provided to individuals or groups who experienced harm in an act to address the damage done. This distinguishes it from financial penalties discussed under Repercussions, which are generally paid to regulatory bodies rather than harmed parties. Compensation occurred in 65 incidents (6.13%), making it one of the least frequent actions. AI corporations were the main providers of compensation (53 cases).

Compensation occurred both through legal processes and voluntary corporate action. In some cases, companies provided compensation as part of formal legal proceedings or in response to legal pressure. For example, DoorDash paid $2.5 million to resolve a class action lawsuit over misleading tipping practices (A0537), and a Milan court ordered Google to pay C3,800 in damages to an entrepreneur for reputational harm caused by autocomplete suggestions (A1087). In other cases, compensation was offered without a public legal mandate. General Information Services and its subsidiary e-Background-checks.com provided $10.5 million in relief to customers affected by inaccurate background checks, though the case did not result in a court ruling (A0853).

Among all reparative actions, compensation is the only one that provides direct material remedy to those affected by AI harm. Yet even in these cases, affected communities often have limited agency over whether compensation occurs, how it is structured, or who receives it. Instead, decisions about compensation are typically made through corporate discretion or legal negotiation, with little involvement from those directly impacted.

Removal of content and product recall This action refers to the removal of harmful AI-generated content or the recall of AI products to prevent further use or distribution. It was documented in 121 incidents (11.42%). AI corporations led most of these actions (97 cases), followed by regulators that apply AI products (20) and end-users (16).

Content and product removals typically aim to eliminate specific sources of harm while preserving the broader AI system. Companies removed training data containing personal images of Australian children after it was revealed that the content had been collected without consent (A1569). Tesla recalled approximately 50,000 vehicles and discontinued its 'Assertive' driving mode following regulatory concerns about safety compliance (A0816).

These actions play an important role in halting ongoing harm and responding to public concern. By removing harmful content or disabling risky features, they can offer immediate relief and demonstrate responsiveness from companies or regulators. However, such actions are typically reactive and limited in scope. Because they do not address underlying design flaws or systemic oversight gaps, similar harms may recur in new contexts.

## Reform

The final set of reparative actions involves structural changes intended to prevent future harm. These responses go beyond addressing individual incidents and aim to reshape the broader systems, products, or legal frameworks governing AI. While reform holds the greatest potential for longterm accountability and systemic improvement, our analysis shows that such efforts are inconsistently applied and often lack enforceable mechanisms to ensure follow-through.

Product and feature discontinuation The action refers to the permanent or long-term discontinuation of an AI product, a specific feature, or an associated dataset. Unlike removal of content or features, which targets specific outputs, discontinuation reflects a decision to retire the system itself. It was the least frequent action in our dataset, occurring in 47 of the 1060 incidents (4.43%), primarily carried out by AI corporations (39 cases).

Notable examples include Microsoft's decision to permanently shut down its chatbot Tay after repeated instances of offensive content, despite multiple attempts at remediation (A045). Similarly, FaceApp discontinued its 'hot filter' following public criticism over its reinforcement of racist and Eurocentric beauty standards (A1674).

Product or feature discontinuation can be a meaningful response when companies withdraw technologies that cause harm: it signals that certain systems that caused harm are no longer acceptable. However, companies are not obligated to explain or sustain these decisions, and it is often unclear whether discontinued features remain permanently retired. In some cases, similar functionalities may reappear in modified forms, suggesting the need for greater transparency and follow-through in such reforms.

AI design and development changes We define AI and design changes as technical changes made to the AI system to address the underlying issue and prevent recurrence. AI Design and Development Changes were present in 112 incidents (10.57%). These were nearly all initiated by AI corporations (109 cases). These actions aim to prevent recurrence by addressing the design and implementation issues that enable harm to happen.

Examples of this action include both changes to AI models and the implementation of safeguards in development and deployment processes. LinkedIn revised its name prediction algorithm to reduce gender bias by incorporating more diverse name datasets (A044). In another case, following accusations that its AI-generated video technology was being used to misrepresent or exploit actors, Synthesia updated its content development pipeline (A1787).

These changes reflect a proactive orientation toward harm prevention and growing attention to responsible design. Like other reform-oriented actions in our taxonomy, they are typically initiated at the discretion of companies and implemented without external oversight. This raises broader questions about how responsibility is defined and enacted across the AI industry.

Law and policy changes We define this action as the introduction or revision of legal frameworks, regulations, or organizational policies in response to the AI incident. Law and Policy Change was observed in 79 incidents (7.45%). Most were led by regulators and government bodies (54 cases), with AI corporations contributing to 29 cases.

These changes fell into two primary categories: public legislation and internal policy updates. On the legal side, governments introduced or amended laws to directly regulate AI-related harms. For example, Taiwan's National Legislature amended its Criminal Code to criminalize the creation and distribution of deepfakes (A0771), and South Korea passed a law banning the possession or viewing of sexually exploitative deepfakes (A1727). Organizational policies were also revised in response to specific incidents. TikTok updated its privacy policy to include a Dutch-language version following user complaints (A0429). In another case, the AI video platform Synthesia implemented stricter content controls after a defamatory incident, restricting content creation to verified enterprise users and banning topics such as politics and race (A1093).

These reforms represent some of the most concrete efforts to govern AI systems and mitigate harm at scale. They demonstrate increasing awareness among both governments and organizations of the need for enforceable standards and structural safeguards. One important pattern is the geographic diversity of these responses, which reflects the global reach of AI but also highlights the fragmented nature of its regulation. In the absence of coordinated standards, policy changes tend to emerge in isolated jurisdictions, resulting in uneven protections and regulatory gaps across regions.

## Stakeholder Participation Across Reparative Actions

While our taxonomy identifies which stakeholder groups initiate each type of reparative action, it is organized around actions and does not reveal how individual stakeholders contribute across the broader set of actions. To complement this, Table 2 presents the frequency with which each stakeholder group initiates each action. This comparative view highlights patterns of responsibility and exposes disparities in who drives different forms of reparation.

Perpetrators primarily respond through communication . AI corporations, the primary actors responsible for harm in the dataset, were involved in public communication far more often than in any other form of response. Their involvement in statements or apologies was more than four times higher than their participation in actions like compensation, product recalls, or design changes. This pattern suggests that perpetrators are more likely to manage perception than to initiate structural or corrective measures.

Affected communities have limited influence on outcomes. Affected users most commonly appeared in public outcry or the initiation of lawsuits, typically in reactive roles. Affected non-users were even less visible, with limited involvement primarily in legal action. Both groups were largely absent from compensation, design changes, or policy reform, indicating limited influence over how harm is addressed.

Third parties help surface harm, but rarely guide resolution. Media and academia had significant but secondary roles. Journalists were involved in 77 investigations, and academics contributed in more limited cases. Advocacy groups, while not directly involved in harm, play a part in public outcry, investigation of harm, and initiation of lawsuits. The general public also plays a significant role in engaging in public discourse about the harm.

There is a lack of multi-stakeholder collaboration. Finally, we examined the extent of coordination across different stakeholder types. Our further analysis showed that only 304 incidents (29%) involved any action carried out by more than one stakeholder group. The most common multi-actor responses were investigations (127 incidents), perpetrators' communication (55), and lawsuits (65). In most cases, however, actions were isolated efforts by individual groups, suggesting a fragmented and uncoordinated approach to AI harm reparation.

## Discussion

In this section, we first use justice frameworks to assess the reparative actions in the taxonomy, examining how efforts toward remedy and reform align with punitive, restorative, and transformative ideals. Next, we examine which stakeholders engage in the reparation process and how power is distributed; in particular, we highlight the constrained role of affected communities and the critical, but often overlooked, contributions of civil society actors. Across both areas, we identify key gaps and offer recommendations for more inclusive and effective approaches to reparation.

## A Vacuum of Justice: Evaluating Reparative Actions Through Justice Frameworks

While we categorize reparative actions by justice-oriented goals, this framing also helps us understand how these ideals are realized in practice. Justice frameworks are not prescriptive but serve as interpretive tools to identify shortcomings and possibilities for more meaningful redress. This approach aligns with calls in Responsible AI to develop contextsensitive, relational models of accountability (Metcalf et al. 2023). Here, we examine two dimensions: how actions under Remedy reflect principles of punitive and restorative justice, and how those under Reform correspond to transformative justice.

Table 2: Stakeholder involvement across reparative actions. AI corporations mainly engaged in public communication, with limited involvement in structural remedies. Affected communities participated infrequently, and third-party actors helped surface harm but rarely shaped resolution. For full action names, see Table 1.

| Stakeholder Group                | Outcry   | Comm.   | Invest.   | Lawsuit   | Repr.   | Comp.   | Design   | Recall   | Discont.   | Policy   |
|----------------------------------|----------|---------|-----------|-----------|---------|---------|----------|----------|------------|----------|
| Perpetrators - AI Corporations   | 0        | 46.1%   | 6.8%      | 0.9%      | 1.1%    | 5.0%    | 10.3%    | 9.2%     | 3.7%       | 2.7%     |
| Perpetrators - End-Users         | 0.1%     | 7.2%    | 0.7%      | 0.4%      | 0.3%    | 0.9%    | 0.1%     | 1.5%     | 0.5%       | 0.4%     |
| Affected Users                   | 2.6%     | 0       | 0.1%      | 7.9%      | 0       | 0.1%    | 0        | 0        | 0          | 0        |
| Affected Non-Users               | 0.6%     | 0       | 0         | 2.6%      | 0       | 0       | 0        | 0        | 0          | 0        |
| General Public                   | 6.6%     | 0       | 0         | 0         | 0       | 0       | 0        | 0        | 0          | 0        |
| Regulators and Government Bodies | 0.2%     | 0.3%    | 20.8%     | 2.2%      | 9.5%    | 1.2%    | 0.8%     | 1.9%     | 0.6%       | 5.1%     |
| Academia                         | 0.1%     | 0       | 0.6%      | 0         | 0       | 0       | 0        | 0        | 0          | 0        |
| Media                            | 0.3%     | 0       | 7.3%      | 0.5%      | 0       | 0       | 0        | 0.2%     | 0          | 0        |
| Auditors and Oversight Boards    | 0        | 0       | 0.8%      | 0         | 0       | 0       | 0        | 0        | 0          | 0        |
| Advocacy Groups                  | 1.5%     | 0       | 1.0%      | 4.2%      | 0       | 0.1%    | 0        | 0        | 0          | 0        |

Remedy for Past Harm: Punishment and Repair Corrective justice traditions emphasize that those responsible for harm should be held accountable and that concrete efforts should be made to repair the losses experienced by those affected (Feinberg 2019; Zehr 2015). These principles underlie both punitive and restorative justice, which guided our analysis of actions under the goal of Remedy .

Punitive justice holds that wrongdoers should face consequences proportionate to the harm they caused (Feinberg 2019). In our dataset, however, punitive responses were rare. Only 10% of cases involved fines, bans, or dismissals, typically enforced by regulators or courts. We found much less evidence of internal accountability, such as companies publicly disclosing disciplinary action or self-imposed sanctions. While internal measures may occur, the lack of transparency makes them difficult to assess. This aligns with prior research showing that AI professionals often view accountability as diffuse and located outside their individual or organizational control (Lancaster et al. 2024). Moreover, when punitive actions take place, they generally relied on traditional legal frameworks, such as privacy or copyright violations, rather than mechanisms tailored to AI-specific harms. This limits the effectiveness of punitive measures in addressing the unique and evolving risks of AI systems.

Restorative justice focuses on repairing harm by centering the needs and agency of those affected and by enabling acknowledgment, dialogue, and restitution (Zehr 2015). Yet restorative practices were similarly scarce. Only 7% of cases involved direct remedy to affected communities in the form of compensation. Few included meaningful input from those harmed in shaping the response. While public apologies and statements of intent were more common, they were often vague, symbolic, and lacked follow-through. As prior work has noted, such gestures may function more as reputational risk management than as genuine accountability (Metcalf, Moss et al. 2019; Green 2021). These patterns reflect a broader gap in current practices: even when harm is acknowledged, efforts to rebuild trust or restore relationships are limited. These patterns point to a deeper issue: even when harm is recognized, there is little investment in restoring relationships or rebuilding trust. Despite growing calls for participatory, victim-centered approaches (Ajmani et al. 2024; Ganesh and Moss 2022; Velkova and Kaun 2021), most responses failed to return agency to affected communities, leaving the core aims of restorative justice unmet.

Reform for Structural Harm: Systemic Changes Actions under the goal of Reform targeted institutional or systemic conditions, such as organizational policies or algorithm designs. These responses align with the aims of transformative justice , which seeks to prevent future harm by confronting and altering the structural and social conditions that allow harm to persist (Morris 2000).

In our dataset, 22% of cases involved actions that could be interpreted as targeting structural factors. These included product recalls, system redesigns, and law and policy change. However, many of these interventions were narrow in scope. They rarely addressed upstream drivers such as exploitative data practices, profit incentives that reward harmful behavior, or recurring harms across platforms. Most changes were confined to a single organization and lacked coordination across the broader ecosystem. In some cases, structural change took the form of product withdrawal rather than substantive redesign-what has been critiqued as a superficial fix that evades accountability (Johnson et al. 2024). These patterns echo broader critiques that ethics initiatives in the tech industry often serve to preempt regulation and manage public image rather than drive systemic accountability (Metcalf, Moss et al. 2019; Green 2021).

Remedy and Reform: Reparation of future vs reparation of the past A key distinction in our taxonomy is between reparative actions that address past harm (Remedy)

and those that seek to restructure systems to reduce recurrence (Reform). This distinction helps clarify a gap noted in existing scholarship: systemic changes cannot replace direct redress to those harmed. Recent critiques have pointed out that widely used accountability practices-such as auditing and red teaming-often serve to mitigate risk rather than ensure meaningful reparation (Gillespie et al. 2024; Feffer et al. 2024). Similarly, AI policy frameworks frequently prioritize transparency and procedural oversight while lacking enforceable requirements for remediation (Wright et al. 2024). Centering reparation requires that both individual and systemic dimensions be addressed. Remedy and reform must work together to ensure that harms are not only acknowledged but actively repaired through inclusive and sustained action.

## Uneven Participation in Reparation: Role of Affected Community and Third Parties

Our taxonomy reveals uneven stakeholder participation across the reparation process. Companies often engage early through public communication but are less involved in providing remedy or pursuing reform. Affected communities help surface harm and assign responsibility but are rarely included in shaping responses. Civil society and the public, though not directly harmed, play crucial roles in defining accountability. This uneven distribution of responsibility reflects broader gaps in the design of AI accountability infrastructures, where institutional responses often overlook the contributions of affected individuals and third-party actors (DeVrio, Eslami, and Holstein 2024).

Constrained Agency: Barriers to Collective Redress for Affected Communities Although affected communities are central to the moral case for reparation, they are often sidelined in shaping responses. Our analysis shows that they are rarely involved in formal processes of remedy or reform. For example, only 7% of cases in our dataset involved compensation, and almost none included evidence of participatory design or consultation with affected individuals.

Moreover, it is difficult for affected individuals to mobilize collectively, particularly when harms are diffuse, individualized, or legally ambiguous. Lawsuits, one of the few formal channels for redress, were more often initiated by regulators or advocacy groups than by those directly affected. This reflects deeper structural barriers: affected communities often lack the resources, visibility, or institutional support to demand meaningful accountability. Even when users engage in public contestation of AI harm, these efforts rarely connect with formal mechanisms of redress (Velkova and Kaun 2021; Ganesh and Moss 2022). Addressing this gap requires rethinking reparation as a participatory process that centers the agency and priorities of those harmed. Without such inclusion, reparation risks reinforcing the very power asymmetries it aims to challenge.

Reparation from the Outside In: The Role of Public and Civil Society Actors in Reparation Our analysis highlights a broader ecosystem of actors who influence accountability, especially where formal reparation mechanisms are lacking. While existing literature on multi-stakeholder AI

governance often focuses on developers and directly affected users (Morley et al. 2020; Rakova et al. 2020; Mohamed, Png, and Isaac 2020), we extend this view to include third-party actors such as advocacy groups, journalists, academics, and members of the public. Although not involved in AI development, these actors play key roles in initiating, sustaining, and shaping responses to harm through public oversight and intervention.

Instead of being passive observers, they frequently trigger the recognition of harm and apply pressure that compels institutional action. Advocacy groups raise awareness and mobilize campaigns (Contreras 2023); journalists conduct investigations and frame incidents as systemic (Angwin et al. 2016); academics produce audits and critiques (Deng et al. 2025; Shen et al. 2021; Cabrera et al. 2021); and the public amplifies these efforts through petitions and media engagement (DeVrio, Eslami, and Holstein 2024). These roles echo 'outsider oversight' models (Raji et al. 2022) and mirror civil society's influence in other domains (Lucaj, Van Der Smagt, and Benbouzid 2023; Gillespie et al. 2024).

Despite their importance, third-party efforts often operate in isolation from institutional processes. These actors may surface harm or apply public pressure but are rarely connected to formal mechanisms such as legal action, compensation, or policy reform. Prior work has noted that civil society interventions often remain fragmented and reactive, rather than integrated into sustained oversight (Raji et al. 2022; Lucaj, Van Der Smagt, and Benbouzid 2023; Gillespie et al. 2024). This disconnect partly reflects structural barriers, as these actors are not always directly affected and lack formal roles in governance. Yet their involvement is essential, especially given the wider societal impact of AI harms. To bridge this gap, institutions should create formal mechanisms for collaboration such as supporting independent audits, consulting civil society in policy design, and enabling their sustained participation in reparative processes (Lam et al. 2022; Feffer et al. 2024). Better integration can turn public pressure into institutional change and ensure reparation aligns with long-term public interest.

## Conclusion

This paper introduces a taxonomy of AI harm reparation and applies it to a large-scale analysis of post-incident responses. The taxonomy structures reparative actions into four stages, providing a lens to examine how harm is acknowledged, addressed, remedied, and potentially transformed over time. Our analysis highlights not only the uneven distribution of reparative efforts but also the limitations of current responses in delivering meaningful redress. Drawing on theories of corrective justice, we argue that most existing responses fall short of punitive, restorative, or transformative ideals. Rather than treating reparation as a discrete or onetime intervention, we call for a more sustained and systemic approach. This includes designing mechanisms that support affected communities, hold powerful actors accountable, and ensure accountability in carrying out law and policy.

## References

Ajmani, L.; Stapleton, L.; Houtti, M.; and Chancellor, S. 2024. Data Agency Theory: A Precise Theory of Justice for AI Applications. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency , 631641.

Andriushchenko, M.; Souly, A.; Dziemian, M.; Duenas, D.; Lin, M.; Wang, J.; Hendrycks, D.; Zou, A.; Kolter, Z.; Fredrikson, M.; et al. 2024. Agentharm: A benchmark for measuring harmfulness of llm agents. arXiv preprint arXiv:2410.09024 .

Angwin, J.; Larson, J.; Mattu, S.; and Kirchner, L. 2016. Machine Bias: There's Software Used Across the Country to Predict Future Criminals. And It's Biased Against Blacks. ProPublica .

Ashworth, A.; and Kelly, R. 2021. Sentencing and criminal justice . Bloomsbury Publishing.

Birhane, A.; Steed, R.; Ojewale, V.; Vecchione, B.; and Raji, I. D. 2024. AI auditing: The broken bus on the road to AI accountability. In 2024 IEEE Conference on Secure and Trustworthy Machine Learning (SaTML) , 612-643. IEEE.

Bogiatzis-Gibbons, D. J. 2024. Beyond Individual Accountability:(Re-) Asserting Democratic Control of AI. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency , 74-84.

Cabrera, ´ A. A.; Druck, A. J.; Hong, J. I.; and Perer, A. 2021. Discovering and validating ai errors with crowdsourced failure reports. Proceedings of the ACM on Human-Computer Interaction , 5(CSCW2): 1-22.

Campbell, S.; Greenwood, M.; Prior, S.; Shearer, T.; Walkem, K.; Young, S.; Bywaters, D.; and Walker, K. 2020. Purposive sampling: complex or simple? Research case examples. Journal of research in Nursing , 25(8): 652-661.

Casper, S.; Ezell, C.; Siegmann, C.; Kolt, N.; Curtis, T. L.; Bucknall, B.; Haupt, A.; Wei, K.; Scheurer, J.; Hobbhahn, M.; et al. 2024. Black-box access is insufficient for rigorous ai audits. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency , 2254-2272.

Chordia, I.; Baltaxe-Admony, L. B.; Boone, A.; Sheehan, A.; Dombrowski, L.; Le Dantec, C. A.; Ringland, K. E.; and Smith, A. D. R. 2024. Social Justice in HCI: A Systematic Literature Review. CHI '24. New York, NY, USA: Association for Computing Machinery. ISBN 9798400703300.

Contreras, R. 2023. First look: Civil rights group starts center to monitor AI for hate speech. Axios .

Creswell, J. W.; and Creswell, J. D. 2017. Research design: Qualitative, quantitative, and mixed methods approaches . Sage publications. ISBN 1-5063-8671-7.

Deng, W. H.; Claire, W.; Han, H. Z.; Hong, J. I.; Holstein, K.; and Eslami, M. 2025. WeAudit: Scaffolding User Auditors and AI Practitioners in Auditing Generative AI. arXiv preprint arXiv:2501.01397 .

Deng, W. H.; Guo, B.; Devrio, A.; Shen, H.; Eslami, M.; and Holstein, K. 2023. Understanding Practices, Challenges, and Opportunities for User-Engaged Algorithm Auditing in Industry Practice. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems , 1-18. Hamburg Germany: ACM. ISBN 978-1-4503-9421-5.

DeVrio, A.; Eslami, M.; and Holstein, K. 2024. Building, Shifting, &amp; Employing Power: A Taxonomy of Responses From Below to Algorithmic Harm. In The 2024 ACM Conference on Fairness, Accountability, and Transparency , 1093-1106. Rio de Janeiro Brazil: ACM. ISBN 9798400704505.

Diberardino, N.; Baleshta, C.; and Stark, L. 2024. Algorithmic harms and algorithmic wrongs. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency , 1725-1732.

Duff, A. 2005. Punishment, communication and community. In Debates in contemporary political philosophy , 397-417. Routledge.

Ehsan, U.; Singh, R.; Metcalf, J.; and Riedl, M. 2022. The Algorithmic Imprint. In 2022 ACM Conference on Fairness, Accountability, and Transparency , 1305-1317. Seoul Republic of Korea: ACM. ISBN 978-1-4503-9352-2.

Feffer, M.; Sinha, A.; Deng, W. H.; Lipton, Z. C.; and Heidari, H. 2024. Red-Teaming for Generative AI: Silver Bullet or Security Theater? Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society , 7(1): 421-437. Number: 1.

Feinberg, J. 2019. The expressive function of punishment. In Shame punishment , 3-26. Routledge.

Foucault, M. 2023. Discipline and punish. In Social theory re-wired , 291-299. Routledge.

Ganesh, M. I.; and Moss, E. 2022. Resistance and refusal to algorithmic harms: Varieties of 'knowledge projects'. Media International Australia , 183(1): 90-106.

Ganguli, D.; Lovitt, L.; Kernion, J.; Askell, A.; Bai, Y .; Kadavath, S.; Mann, B.; Perez, E.; Schiefer, N.; Ndousse, K.; et al. 2022. Red teaming language models to reduce harms: Methods, scaling behaviors, and lessons learned. arXiv preprint arXiv:2209.07858 .

Gillespie, T. 2018. Custodians of the Internet | Yale University Press.

Gillespie, T.; Shaw, R.; Gray, M. L.; and Suh, J. 2024. AI Red-Teaming is a Sociotechnical System. Now What? arXiv preprint arXiv:2412.09751 .

Green, B. 2021. The contestation of tech ethics: A sociotechnical approach to technology ethics in practice. Journal of Social Computing , 2(3): 209-225.

Guo, Y.; Ovadje, A.; Al-Garadi, M. A.; and Sarker, A. 2024. Evaluating large language models for health-related text classification tasks with public social media data. Journal of the American Medical Informatics Association , 31(10): 2181-2189.

Johnson, K. 2021. The Movement to Hold AI Accountable Gains More Steam. WIRED . Accessed: 2025-05-20.

Johnson, N.; Moharana, S.; Harrington, C.; Andalibi, N.; Heidari, H.; and Eslami, M. 2024. The Fall of an Algorithm: Characterizing the Dynamics Toward Abandonment. In The 2024 ACM Conference on Fairness, Accountability, and Transparency , 337-358. Rio de Janeiro Brazil: ACM. ISBN 9798400704505.

Kaba, M. 2021. We do this' til we free us: Abolitionist organizing and transforming justice , volume 1. Haymarket Books. ISBN 1-64259-526-8.

Kaba, M.; and Hassan, S. 2019. Fumbling towards repair: A workbook for community accountability facilitators . Project NIA. ISBN 1-939202-32-9.

Kim, M. E. 2021. Transformative justice and restorative justice: Gender-based violence and alternative visions of justice in the United States. International review of victimology , 27(2): 162-172.

Lam, M. S.; Gordon, M. L.; Metaxa, D.; Hancock, J. T.; Landay, J. A.; and Bernstein, M. S. 2022. End-User Audits: A System Empowering Communities to Lead Large-Scale Investigations of Harmful Algorithmic Behavior. Proceedings of the ACM on Human-Computer Interaction , 6(CSCW2): 1-34.

Lancaster, C. M.; Schulenberg, K.; Flathmann, C.; McNeese, N. J.; and Freeman, G. 2024. 'It's everybody's role to speak up... but not everyone will': Understanding AI professionals' perceptions of accountability for AI bias mitigation. ACM Journal on Responsible Computing , 1(1): 1-30.

Lee, H.-P.; Yang, Y.-J.; Von Davier, T. S.; Forlizzi, J.; and Das, S. 2024a. Deepfakes, phrenology, surveillance, and more! a taxonomy of ai privacy risks. In Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems , 1-19.

Lee, H.-P. H.; Yang, Y.-J.; Von Davier, T. S.; Forlizzi, J.; and Das, S. 2024b. Deepfakes, Phrenology, Surveillance, and More! A Taxonomy of AI Privacy Risks. In Proceedings of the CHI Conference on Human Factors in Computing Systems , 1-19. Honolulu HI USA: ACM. ISBN 9798400703300.

Lima, G.; Grgi´ c-Hlaˇ ca, N.; and Cha, M. 2023. Blaming Humans and Machines: What Shapes People's Reactions to Algorithmic Harm. In Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems , 1-26. Hamburg Germany: ACM. ISBN 978-1-4503-9421-5.

Lucaj, L.; Van Der Smagt, P.; and Benbouzid, D. 2023. Ai regulation is (not) all you need. In Proceedings of the 2023 ACM Conference on Fairness, Accountability, and Transparency , 1267-1279.

Lukpat, A. ???? AI Employees Fear They Aren't Free to Voice Their Concerns. The Wall Street Journal . Accessed: 2025-05-23.

Metaxa, D.; Park, J. S.; Robertson, R. E.; Karahalios, K.; Wilson, C.; Hancock, J.; and Sandvig, C. 2021. Auditing Algorithms: Understanding Algorithmic Systems from the Outside In. Foundations and Trends® in Human-Computer Interaction , 14(4): 272-344.

Metcalf, J.; Moss, E.; et al. 2019. Owning ethics: Corporate logics, silicon valley, and the institutionalization of ethics. Social Research: An International Quarterly , 86(2): 449476.

Metcalf, J.; Singh, R.; Moss, E.; Tafesse, E.; and Watkins, E. A. 2023. Taking algorithms to courts: A relational approach to algorithmic accountability. In Proceedings of the 2023 ACM Conference on Fairness, Accountability, and Transparency , 1450-1462.

Mohamed, S.; Png, M.-T.; and Isaac, W. 2020. Decolonial AI: Decolonial theory as sociotechnical foresight in artificial intelligence. Philosophy &amp; Technology , 33: 659-684.

M¨ okander, J. 2023. Auditing of AI: Legal, ethical and technical approaches. Digital Society , 2(3): 49.

Morley, J.; Floridi, L.; Kinsey, L.; and Elhalal, A. 2020. From what to how: an initial review of publicly available AI ethics tools, methods and research to translate principles into practices. Science and engineering ethics , 26(4): 21412168.

Morris, R. 2000. Stories of transformative justice . Canadian Scholars' Press.

Mun, J.; Jiang, L.; Liang, J.; Cheong, I.; DeCairo, N.; Choi, Y.; Kohno, T.; and Sap, M. 2024. Particip-ai: A democratic surveying framework for anticipating future ai use cases, harms and benefits. In Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society , volume 7, 997-1010.

New York City Department of Consumer and Worker Protection. 2021. Automated Employment Decision Tools (AEDT). Accessed: 2025-05-20.

Nocella, A. J.; and Anthony, J. 2011. An overview of the history and theory of transformative justice. Peace &amp; conflict review , 6(1): 1-10.

Pranis, K. 2015. Little Book of Circle Processes: A New/Old Approach To Peacemaking . Simon and Schuster. ISBN 9781-68099-041-6. Google-Books-ID: wl2CDwAAQBAJ.

Qu, Y.; Shen, X.; Wu, Y.; Backes, M.; Zannettou, S.; and Zhang, Y. 2024. Unsafebench: Benchmarking image safety classifiers on real-world and ai-generated images. arXiv preprint arXiv:2405.03486 .

Raji, I. D.; Smart, A.; White, R. N.; Mitchell, M.; Gebru, T.; Hutchinson, B.; Smith-Loud, J.; Theron, D.; and Barnes, P. 2020. Closing the AI accountability gap: Defining an endto-end framework for internal algorithmic auditing. In Proceedings of the 2020 conference on fairness, accountability, and transparency , 33-44.

Raji, I. D.; Xu, P.; Honigsberg, C.; and Ho, D. 2022. Outsider oversight: Designing a third party audit ecosystem for ai governance. In Proceedings of the 2022 AAAI/ACM Conference on AI, Ethics, and Society , 557-571.

Rakova, B.; Yang, J.; Cramer, H.; and Chowdhury, R. 2020. Where Responsible AI meets Reality: Practitioner Perspectives on Enablers for shifting Organizational Practices.

Schelble, B. G.; Lopez, J.; Textor, C.; Zhang, R.; McNeese, N. J.; Pak, R.; and Freeman, G. 2024. Towards Ethical AI: Empirically Investigating Dimensions of AI Ethics, Trust Repair, and Performance in Human-AI Teaming. Human Factors , 66(4): 1037-1055. Publisher: SAGE Publications Inc.

Shen, H.; DeVos, A.; Eslami, M.; and Holstein, K. 2021. Everyday Algorithm Auditing: Understanding the Power of Everyday Users in Surfacing Harmful Algorithmic Behaviors. Proc. ACM Hum.-Comput. Interact. , 5(CSCW2): 433:1-433:29.

Singh, R.; Blili-Hamelin, B.; Anderson, C.; Tafesse, E.; Vecchione, B.; Duckles, B.; and Metcalf, J. 2025. Red-Teaming in the Public Interest. Technical report, Data &amp; Society Research Institute. Accessed: 2025-04-24.

Techtonic Justice. 2023. The Ways AI Decides How LowIncome People Work, Live, Learn, and Survive. https:// www.techtonicjustice.org/reports/inescapable-ai. Accessed: 2025-04-24.

United Nations General Assembly. 2005. Basic Principles and Guidelines on the Right to a Remedy and Reparation for Victims of Gross Violations of International Human Rights Law and Serious Violations of International Humanitarian Law. UN Doc A/RES/60/147, Accessed: 2025-05-20.

Velkova, J.; and Kaun, A. 2021. Algorithmic resistance: media practices and the politics of repair. Information, Communication &amp; Society , 24(4): 523-540. Publisher: Routledge eprint: https://doi.org/10.1080/1369118X.2019.1657162.

Wenzel, M.; Okimoto, T. G.; Feather, N. T.; and Platow, M. J. 2008. Retributive and restorative justice. Law and human behavior , 32: 375-389.

Wright, L.; Muenster, R. M.; Vecchione, B.; Qu, T.; Cai, P.; Smith, A.; Investigators, C. . S.; Metcalf, J.; Matias, J. N.; et al. 2024. Null Compliance: NYC Local Law 144 and the challenges of algorithm accountability. In Proceedings of the 2024 ACM Conference on Fairness, Accountability, and Transparency , 1701-1713.

Xiao, S.; Jhaver, S.; and Salehi, N. 2023. Addressing Interpersonal Harm in Online Gaming Communities: The Opportunities and Challenges for a Restorative Justice Approach. ACM Transactions on Computer-Human Interaction . Publisher: ACM New York, NY.

Xiao, S.; Metaxa, D.; Park, J. S.; Karahalios, K.; and Salehi, N. 2020. Random, Messy, Funny, Raw: Finstas as Intimate Reconfigurations of Social Media.

Xiao, Z.; Yuan, X.; Liao, Q. V.; Abdelghani, R.; and Oudeyer, P.-Y. 2023. Supporting qualitative analysis with large language models: Combining codebook with GPT-3 for deductive coding. In Companion proceedings of the 28th international conference on intelligent user interfaces , 7578.

Zehr, H. 2015. The Little Book of Restorative Justice: Revised and Updated . Simon and Schuster. ISBN 978-168099-044-7. Google-Books-ID: zF2CDwAAQBAJ.

Zhang, R.; Li, H.; Meng, H.; Zhan, J.; Gan, H.; and Lee, Y.C. 2024. The Dark Side of AI Companionship: A Taxonomy of Harmful Algorithmic Behaviors in Human-AI Relationships. arXiv preprint arXiv:2410.20130 .

## Appendices

## Appendix A: Data Familiarization Example

During data analysis, we began with a familiarization phase to understand the structure and content of reported responses. For all 1060 cases, we manually recorded the post-incident actions and identified the stakeholders responsible for initiating them. For example, for the incident involving TikTok's mishandling of minors' personal data in the Netherlands (incident ID AIAAIC0429), the recorded sequence of actions and stakeholders was: (1) Dutch Data Protection Authority (DPA): Investigated TikTok's handling of minors' data. (2) Consumentenbond (Dutch Consumer Organization): Filed C1.5B claim over unlawful data collection. (3) Dutch DPA: Fined TikTok C750K for lacking Dutch privacy notice. (4) TikTok/ByteDance: Updated its privacy policy to include a Dutch version and tightened teen safety settings.

## Appendix B: Stakeholder Definitions

## Stakeholder Definitions

Table 3: Primary stakeholder categories referenced in our taxonomy.

| Stakeholder                      | Definition                                                                           |
|----------------------------------|--------------------------------------------------------------------------------------|
| Perpetrators - AI Corporations   | Companies that develop, deploy, or commercialize AI systems that caused harm.        |
| Perpetrators - End-Users         | Individuals or organizations that used AI systems and caused harm through their use. |
| Affected Users                   | People or groups who used the AI system as intended but were harmed.                 |
| Affected Non-Users               | People or groups who did not use the AI system but were still harmed.                |
| General Public                   | Members of society not directly harmed but who express concern or demand change.     |
| Regulators and Government Bodies | Courts, regulators, and agencies that investigate or impose consequences.            |
| Academia                         | Researchers or institutions who analyze incidents or propose solutions.              |
| Media                            | Journalists and news outlets reporting on the incident.                              |
| Auditors and Oversight Boards    | Entities that assess AI risks or harms through audits or review.                     |
| Advocacy Groups                  | NGOs or civil society organizations that represent affected communities.             |

## Appendix C: LLM prompt example

We use the Public Outcry category as an example to illustrate the LLM prompt we provided. The text input consists of a full list of actions and stakeholders extracted from the case summary and related news articles in the AIAAIC database. Please note that these represent preliminary extraction categories used during data collection and are distinct from the refined taxonomy presented in our findings.

Step 1: Determine whether the text explicitly mentions any Public Outcry .

Definition: Public Outcry refers to expressions of dissatisfaction, concern, or anger voiced publicly in response to an AI harm incident.

## Valid examples (for reference only):

- Social media backlash
- Protests and walkouts
- Public petitions

## Additional Rules:

1. Do not include private or internal complaints. Only include actions that reflect broad public visibility and concern.
2. Reports by news media do not qualify as public outcry unless they describe public reactions (e.g., protests, petitions, social media backlash).
3. Do not infer or assume - only include what is explicitly stated.

Step 2 (if Step 1 is positive): Identify Initiating Stakeholders

Stakeholder Categories: [Insert stakeholder categories presented in Table 3]

## Output Format:

- If no public outcry is explicitly mentioned, output: N/A
- If yes, list each initiating stakeholder in the format: [Stakeholder Category] --[Name from text] --[Direct evidence from text]

## Do not include any additional explanation.

Text for analysis: [Insert case summary and relevant news article text here]

## Appendix D: LLM accuracy and Inter-Rater Reliability

Inter-rater reliability We assessed inter-rater reliability among three coders, each of whom independently coded five shared cases with every other coder. This resulted in six pairwise comparisons across the three coders. For accuracy of reparative action category, we calculated the percentage of actions where both coders agreed on whether an action was present. The average agreement across all pairs was 93.33%. For accuracy of stakeholder category, we assigned a score of 1 for full agreement, 0.5 for partial agreement, and 0 for disagreement. These scores were averaged across five cases per pair. The average stakeholder agreement was 90.00%.

LLM accuracy To validate the accuracy of GPT-assisted coding across 1,060 incidents in the AIAAIC database, we conducted human annotation on a stratified sample of 200 cases-20 cases for each of the 10 reparative action categories in our taxonomy. For each category, we selected a balanced mix of positive and negative examples (10 each) and evaluated two components: whether the action was correctly identified, and whether the initiating stakeholders aligned with human labels. Action accuracy was calculated as the proportion of cases where GPT's binary label (present or not) matched the human-coded label, out of 20 total cases per category. Stakeholder accuracy was evaluated only for cases where the action was labeled as present by human annotators. In those cases, we compared the set of initiating stakeholders labeled by GPT against human annotations, assigning a score of 1 for exact matches, 0.5 for partial overlap, and 0 for no overlap. We report both macro-averaged scores across the ten action categories and micro-averaged scores weighted by the number of human-positive cases. Table 4 reports the percent agreement for each action and stakeholder category, and the total accuracy.

Table 4: LLM Classification Accuracy

| Reparative Action Category           | Action Accuracy   | Stakeholder Accuracy   |
|--------------------------------------|-------------------|------------------------|
| Public Outcry                        | 85.00%            | 77.27%                 |
| Perpetrator's Communication          | 85.00%            | 81.82%                 |
| Investigation of Harm                | 80.00%            | 65.00%                 |
| Initiation of Lawsuit                | 95.00%            | 66.67%                 |
| Repercussions                        | 95.00%            | 88.89%                 |
| Compensation                         | 80.00%            | 75.00%                 |
| AI Design and Development Change     | 80.00%            | 81.25%                 |
| Removal of Content or Product Recall | 90.00%            | 65.00%                 |
| Product or Feature Discontinuation   | 85.00%            | 92.86%                 |
| Law and Policy Change                | 95.00%            | 88.89%                 |
| Overall                              | 87.00%            | 78.78%                 |