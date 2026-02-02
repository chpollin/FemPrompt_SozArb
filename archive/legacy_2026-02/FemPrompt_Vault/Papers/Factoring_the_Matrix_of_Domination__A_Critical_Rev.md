---
title: Factoring_the_Matrix_of_Domination__A_Critical_Rev
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
  - Intersectional Groups
  - Intersectionality
  - Intersectional Methods
mitigation_strategies:
  - Intersectional Groups
  - Intersectionality
  - Intersectional Methods
  - Fairness Metrics
  - Fairness Constraints
---

# Factoring_the_Matrix_of_Domination__A_Critical_Rev

## Key Concepts

### Bias Types
- [[Intersectional Groups]]
- [[Intersectional Methods]]
- [[Intersectionality]]

### Mitigation Strategies
- [[Fairness Constraints]]
- [[Fairness Metrics]]
- [[Intersectional Groups]]
- [[Intersectional Methods]]
- [[Intersectionality]]

## Full Text

---
source_file: Factoring the Matrix of Domination_ A Critical Rev.pdf
conversion_date: 2025-08-06T13:59:51.654660
---

<!-- image -->

## Factoring the Matrix of Domination: A Critical Review and Reimagination of Intersectionality in AI Fairness

Anaelia Ovalle

Department of Computer Science University of California, Los Angeles

Arjun Subramonian Department of Computer Science University of California, Los Angeles

Vagrant Gautam Saarland University

## Gilbert Gee

Spoken Language Systems

## Kai-Wei Chang

Department of Community Health University of California, Los Angeles

## ABSTRACT

Intersectionality is a critical framework that, through inquiry and praxis, allows us to examine how social inequalities persist through domains of structure and discipline. Given AI fairness' raison d'être of 'fairness, ' we argue that adopting intersectionality as an analytical framework is pivotal to effectively operationalizing fairness. Through a critical review of how intersectionality is discussed in 30 papers from the AI fairness literature, we deductively and inductively: 1) map how intersectionality tenets operate within the AI fairness paradigm and 2) uncover gaps between the conceptualization and operationalization of intersectionality. We find that researchers overwhelmingly reduce intersectionality to optimizing for fairness metrics over demographic subgroups. They also fail to discuss their social context and when mentioning power, they mostly situate it only within the AI pipeline. We: 3) outline and assess the implications of these gaps for critical inquiry and praxis, and 4) provide actionable recommendations for AI fairness researchers to engage with intersectionality in their work by grounding it in AI epistemology.

## CCS CONCEPTS

· Social and professional topics → Computing / technology policy ; · Computing methodologies → Artificial intelligence .

## KEYWORDS

fairness, intersectionality, artificial intelligence, literature review

## ACMReference Format:

Anaelia Ovalle, Arjun Subramonian, Vagrant Gautam, Gilbert Gee, and KaiWei Chang. 2023. Factoring the Matrix of Domination: A Critical Review and Reimagination of Intersectionality in AI Fairness. In AAAI/ACM Conference on AI, Ethics, and Society (AIES '23), August 08-10, 2023, Montréal, QC, Canada. ACM, New York, NY, USA, 16 pages. https://doi.org/10.1145/ 3600211.3604705

<!-- image -->

This work is licensed under a Creative Commons Attribution International 4.0 License.

Department of Computer Science University of California, Los Angeles

## 1 INTRODUCTION

Artificial intelligence (AI) fairness research is critical to the development of just AI. Work in this space consistently urges researchers and engineers alike to consider notions of fairness defined over model predictions. These notions vary across conceptualization (e.g., group, individual fairness [8]) and operationalization (e.g., pre/in/post-processing [2]) [54]; nevertheless, the literature generally agrees on the goal of minimizing negative outcomes across demographic groups, including groups associated with multiple, 'intersectional' demographic attributes (e.g., Black women) [92]. However, Kong [66] observes that AI fairness papers often narrowly interpret intersectional subgroup fairness as intersectionality, the critical framework from which the term originates [29, 67]. This myopic conceptualization of intersectionality has non-trivial consequences for just AI design and epistemology (i.e., ways of knowing).

The term intersectionality describes a traveling framework of critical inquiry and praxis (i.e., practical action beyond mere academic theorizing) intended to examine interlocking mechanisms of structural oppression (e.g., racist policy [60]) which produce inequality [29]. Critical inquiry into the formation of inequalities generates knowledge that can inform strategies for combating them, which is often referred to as praxis. Generating knowledge that illuminates the underlying mechanisms of oppressive systems is a shared objective among critical disciplines, such as feminist, antiracist, and decolonial studies, and is rooted in a history of resistance [28]. Critical disciplines thus do not decouple reclaiming knowledge from reclaiming power. This is in contrast to disciplines rooted in colonial epistemology, e.g., science. Upon initial examination, science offers universal, empirically-grounded explanations for natural phenomena; however, science is rooted in colonialism through its imposing of a 'a positivist paradigm 1 approach to research on the colonies and other oppressed groups' [21]. According to scientific colonialism, the researcher has 'unlimited rights of access to source[s] of information belonging to [a] population,' where data collection and knowledge formation reflects the one reality the researcher understands [20, 34]. Indigenous knowledge is erased as dominant knowledge systems are imposed, preventing Indigenous people from creating and sharing their own knowledge and perspectives. Consequently, disciplines rooted in colonial epistemology often assimilate prevailing knowledge systems that perpetuate the erasure of knowledge [21, 33, 42].

1 Knowledge as a result of 'neutral' and quantifiable observation. This paradigm strictly relies on only measurement and reason [77].

Theepistemologies of AI research are not divorced from scientific colonialism's legacy. Intersectionality may be used to critically examine AI research methodologies, so that 'the world-views of those who have suffered a long history of oppression and marginalization are given space to communicate from their frames of reference' [21]. Intersectionality promotes grappling with 'how individuals and groups who are subordinated within varying systems of power might survive and resist their oppression,' thereby empowering communities to criticize the injustices they experience [28]. In the face of epistemic violence (e.g., the erasure of Indigenous knowledge), intersectionality erects a new form of epistemic resistance: knowledge production. Frameworks to articulate social inequalities have been integral to the survival of communities at the margins. Similarly, intersectionality, by enabling researchers to observe and articulate disparities, may break the epistemic molds 'researchers are placed in so they may operate differently' [21].

In the context of AI fairness, intersectionality is less about getting technology right (e.g., establishing fairness constraints for a model); it is more about interrogating the social reality which drives AI oppression, so we can then make technology better. Crenshaw uses the term intersectionality as a metaphor to speak on how 'different systems of oppression overlap,' but more importantly emphasizes that neglecting the convergence of these structures would cause rhetorical and identity politics to abandon issues and people who are actually affected by these intersecting 'systems of subordination' [6]. Intersectionality thereby challenges the sociopolitical amnesia which frames subgroup fairness as solely a technical problem [92]. We do not reject subgroup fairness outright; rather, we share this example to challenge the AI fairness community to expand its engagement with intersectionality. To operationalize AI fairness with an intersectional lens, it is vital to first illuminate underexplored gaps between intersectionality and existing AI fairness literature. To this end, we ask: (1) how is intersectionality discussed in AI fairness literature?; (2) to what extent does this discussion change based on computer science (CS) methodology?; (3) where are the largest gaps in conceptualizing and operationalizing intersectionality for advancing social justice?; (4) what tensions exist in leveraging these gaps for just AI design?; and (5) what do these findings tell us about opportunities for more just AI? To answer these questions, we contribute the following:

- (1) Identify a growing body of AI fairness papers related to intersectionality (§4) and examine their conceptions of the critical framework in contrast to core intersectionality literature (§3).
- (2) Create guiding questions to critically assess the use of intersectionality as a lens to operationalize AI fairness (Table 2).
- (3) Use our findings to analyze where gaps remain in AI fairness papers' use of intersectionality, provide recommendations towards addressing these gaps, and comment on the structural forces that may contribute to these observed norms (§5, §6).

The majority of the papers we review approach intersectionality from the narrow perspective of subgroup fairness. Through a deductive lens in §5, we find that intersectionality engagement varies significantly depending on how it is situated within the AI pipeline, how sources of biases are described, and what CS research epistemologies are invoked. Inductively in §6, we find that even when researchers center intersectionality literature, there is little engagement with the framework itself, evidenced by a lack of described social context, little discussion of power and relations between structures, questionable citational practices, and a disjointed sense of social justice praxis.

Our paper does not concern itself with claiming that intersectionality must take a particular form within AI fairness. Rather, we center intersectionality as an 'analytical sensibility' [22, 29], which when activated, can sharpen and transform the tools in the AI fairness researcher's toolbox. This, we argue, is key to justice-centric AI development. We further seek to dispel the misconception that social science disciplines have no place in STEM [72, 79]. Educated in CS, we equip the AI fairness researcher of similar training who is committed to justice with concrete ways of using their training in AI to exercise critical praxis. In this way, we hope to disrupt deep-rooted indifferences to social reality, 'a powerful force that is perhaps more dangerous than malicious intent' [5].

Positionality Statement All but one author of this paper are formally trained primarily as computer scientists, with additional training in gender theory, criticial social theories, criminology, linguistics, and related fields. One author is a social scientist who confronts issues of social inequities in both everyday life and their scholarship, necessitating an intersectional and life course perspective. All authors have informal training in queer studies through activism and advocacy. As such, our backgrounds influence this work's design, decisions, and development. All authors are located in the US or Europe, but have diasporic links to other social contexts; we do our best to position our work in a global context. We write this to empower individuals across both academia and industry research to critically engage with AI fairness paradigms. Therefore, our recommendations are articulated in a way that can be operationalized, though they are transferrable to other audiences. We position ourselves within a social justice ethos informed by decolonial theory, and that champions equity over equality as well as reparations to correct historical injustices.

## 2 RELATED WORKS

We are not the first to champion or critique intersectional praxis in AI fairness, let alone more broadly. Several works across disciplines including psychology and CS have advocated the use of intersectionality frameworks or discussed the misappropriation thereof [4, 14, 16, 24, 52, 56, 80, 82, inter alia ]. Furthermore, AI ethics researchers have addressed the narrow perspective of intersectionality as intersectional subgroup fairness (e.g., Kong [66]); our review points to this too, although our scope is wider and considers numerous gaps in AI's operationalization of intersectionality.

A few papers have reimagined intersectionality in AI [9, 23, 88], pushing for intersectional practices to be woven into the full AI pipeline, and arguing for a joint interrogation of culture, technology, and solutionist framings of fairness (e.g., critical technocultural discourse analysis [15]). Constanza-Chock [31] illuminates the lack of critical praxis in AI, drawing upon Collins's matrix of domination to encourage researchers to reflect on how AI relates to 'domination and resistance at each of these three levels (personal, community, and institutional)' [26]. Davis et al. [37], inspired by Crenshaw [36],

argue for AI to be reparative and aware of social and historical context. Klumbyte et al. [63] facilitate community-based critical analysis of the 'tensions and possibilities' of integrating intersectional knowledge into machine learning systems. With a shared goal of intersectional AI, we complementarily gauge the epistemic alignment of AI papers related to intersectionality with Collins' intersectionality tenets [29]. We go beyond the scope of papers like Birhane et al. [12], which is not explicitly about intersectionality and focuses on evaluating discussion of social context and power.

## 3 INTERSECTIONALITY OVERVIEW

Crenshaw coined the term 'intersectionality' in her 1981 paper [35], and expanded on it in [36]. In the context of violence against Black women, these works study the interactions of race and gender, as well as racism and patriarchy as systems of subordination. Her work is grounded in 'a bottom-up commitment' to address the needs of those who are 'victimized by the interplay of numerous factors,' with the explicit goal of obtaining political and social justice. Thus, praxis has been an important facet of intersectionality from its inception; what constitutes praxis is broad and contextual, including 'movements for economic justice, legal and policy advocacy, statetargeted movements for prison abolition' [22].

While various definitions of intersectionality have emerged, they all center a need to examine power relations across structures, disciplines, domains, and location [1, 25, 53]. We draw upon broad intersectionality scholarship in our paper to enrich our own observations. To ground our review methodology and analysis in the following sections, we base our evaluations on Collins and Bilge [29]. This work details six core tenets of intersectionality (drawing from an in-depth genealogy of intersectionality) that lend themselves to an analytical language and cognitive organization around how forms of oppression are co-created, operated, amplified, and interact with social and structural disparities. These tenets are: social justice, social inequality, relationality, social power, social context, and complexity. We describe each tenet below, its connections to AI fairness, and how we interpret the tenet for advancing social justice in AI fairness. These descriptions further inform the construction of 3-4 guiding questions per tenet to assess how well the works in our critical review engage with the tenets (Table 2).

Social Justice. Intersectionality emerges as a synergy between inquiry and praxis, where praxis is action to advance social justice that is informed by inequities identified via critical inquiry (e.g., via the tenets). Collins and Bilge [29] caution that inquiry alone does not further social justice; intersectionality 'demands more than simply being critical and entails turning critical analyses into critical praxis' [29]. In AI fairness, social justice praxis spans numerous practical approaches to fairness, e.g., debiasing techniques, fairness metrics for multiplicative groups; however, its effectiveness depends on authors' social context. Intersectionality widens these practical approaches; this does not remove researchers from the AI fairness domain, but rather deepens our ability to engage with the domain. Overall, intersectionality enables the creation of new forms of knowledge which are informed by a critical examination of how AI systems reproduce inequalities. Therefore, our social justice guiding questions assess how works commit to advancing justice and center the perspectives of subordinated communities.

Social Inequality. Intersectionality rejects the inevitability of inequality as 'hardwired into the social world, into individual nature' [28]; rather, the framework emphasizes the study of how social inequalities are fundamentally formed and reinforced through saturated centers of power. Dismantling inequalities requires locating these centers. In AI fairness, inequality is often measured via quantities like demographic parity and disparate impact [54]. Hence, these metrics ground the practice of harm reduction; however, static measures pointing towards equality rather than equity do not resolve complex and wide-reaching inequality. Instead, intersectionality asks us to center the social and historical context of those at the margins to inform praxis. As such, our inequality guiding questions assess the depth with which researchers situate their work in social inequality.

Relationality. Relationality enables us to examine power and inequality by centering relational thinking. This functions to unveil how concentrations of power take shape, are situated in a broader social context, and perpetuate inequalities. Relationality comprises: addition (what happens when we don't consider the intersections of social categories), articulation (how relations impact the growth or dissolution of such intersections), and co-formation (e.g., of social categories as phenomena) [29]. In the context of AI fairness, relationality involves examining the relations between decisions we make as researchers, the technical artifacts we produce, and whom they impact (e.g., how the Eurocentrism of auditing frameworks makes them fail to capture inequalities in globally-deployed AI). Hence, our relationality guiding questions assess works' intention and inquiry across technological structures and social context.

Social Power. Intersectionality uses relationality to tie 'intersecting power relations' to how power 'produce[s] social divisions of race, class, gender, etc.' [29]. Intersectionality is predicated on understanding that systems of power 'co-produce each other in ways that reproduce unequal material outcomes and the distinctive social experiences [within] hierachies' [28]. In AI fairness, power is concentrated in human choices: system design, data collection, deployment, operationalizations of fairness. These choices impact resource allocation for communities at the intersections of the 'structural, disciplinary, cultural, and interpersonal' domains [3, 26, 31]; thus, power should be discussed at all stages of the AI pipeline. Our power guiding questions therefore assess the extent to which researchers reflexively comment on or situate their work in the power relations in which they participate.

Social Context. Intersectionality centers 'context-specific [...] historical particularities and the increasing significance of a global context' [29]. When engaging with intersectionality in different (especially global) contexts, inquiry and praxis take different forms; consequently, one must practice epistemic, personal, and critical reflexivity to be cognizant of context, in order to effectively and holistically advance justice. In AI fairness, social context informs AI context through researcher training and background, model training and deployment, language choices, etc. Hence, self-reflexively acknowledging that one operates in the Global North informs who is centered in fairness tasks. Conversely, fairness works that flatten social context (e.g., by optimizing for 'Indigenous people' broadly) informs who drives knowledge production. As a result, our social context guiding questions assess the extent to which context is deliberately referenced and informs research processes.

Complexity. Complexity is key to a 'creative tension' between critical inquiry and praxis, which results in new forms of social action to combat inequality [29]. Complexity necessitates relational thinking and situational awareness. In AI fairness, complexity is often conceptualized as minimizing unfairness across a large number of social groups. However, complexity is more expansive; for example, it entails co-designing with groups who have been harmed by AI systems rather than using preconceptions of excluded groups to remedy exclusion. Our complexity guiding questions probe how works contend with model requirements, community needs, and centers of power that influence AI design. This notion of complexity is distinct from how complexity is used in the complex systems discipline, or runtime complexity in CS.

## 4 CRITICAL REVIEW METHODOLOGY

## 4.1 Paper Inclusion Criteria

To gauge how AI fairness research conceptualizes and operationalizes intersectionality, we curate 30 papers by: 1) querying 'intersectionality machine learning' on Google Scholar to obtain 75 relevant papers, and 2) filtering those to papers published in AI venues including symposiums, conferences, journals, and books. We choose to query 'machine learning' as AI fairness research tends to center machine learning. Our process simulates how researchers might discover AI fairness literature related to intersectionality when grounding their own work. Papers are tagged as including intersectionality if they cite intersectionality scholarship that centers critical inquiry. We restrict our sample to 30 papers to ensure that we can annotate each paper (some papers by multiple authors) for engagement with intersectionality. We document all the papers we review in Tables 4 and 5, and provide statistics thereof in Table 1.

## 4.2 Review Methods

Our annotation scheme is based on the tenets and corresponding guiding questions discussed in §3. All questions reflect three axes of reflexivity: epistemological, personal, and critical [78]. For each paper, for each guiding question (e.g., 'Do the authors mention power?'), we annotate whether or not the authors of the paper explicitly or implicitly answer the question. Then, for each tenet, we annotate that the paper has characteristics of the tenet if it explicitly or implicitly answers at least one of the guiding questions corresponding to the tenet. Importantly, our questions are not a checklist to determine whether researchers have 'truly' engaged with intersectionality; rather, they reveal where efforts in AI fairness are concentrated and help us reimagine our practices towards advancing social justice in AI. We share all our guiding questions in Table 2. We further break down our methodology for creating questions in Appendix §B.

11 out of the 30 papers were evaluated by 3 annotators, and we present our tenet-level interannotator agreement for these papers in Table 3. The scores in Table 3 indicate moderate to high interannotator agreement. The remaining 19 papers were each evaluated by at least 1 annotator. We expand on our annotation methodology in Appendix §C and provide our annotations at https://tinyurl.com/intersectionality-annotations.

Given the nature of intersectionality, engagement therewith cannot be captured solely through quantitative means; therefore, we also qualitatively mine intersectionality-related themes from our sample of papers. With these deductive (i.e., using our guiding questions) and inductive (i.e., qualitative coding) analyses, we supply a bird's eye and granular view of engagement with intersectionality in AI fairness. As praxis, we translate our inductive findings to recommendations for deeper engagement with intersectionality. These recommendations are tailored for AI fairness researchers with any level of training in AI, in academia, industry, or both. We urge readers to take their own identity, capacity, and power into account when considering our recommendations, as these will affect what they can do and potential consequences.

In our analyses, we acknowledge that papers are products of varied epistemological contributions, relations between authors and reviewers, and power dynamics. Thus, our critical review is not so much a criticism of AI fairness researchers as it is a reflection of broader systems, such as the incentives and infrastructural forces that govern publishing in CS and enacting change in corporations, as well as the types of knowledge production that are valued or even simply considered legitimate in the field. Papers do not reflect everything that goes into a research project, and they are also merely static snapshots in time that researchers grow beyond.

## 4.3 Investigating Intersectionality Within the AI Fairness Research Paradigm

Reflexivity enables AI fairness researchers to engage in praxis; as Mohamed et al. [72] comment, 'deciding what counts as valid knowledge, what is included within a dataset, and what is ignored and unquestioned, is a form of power [...] that cannot be left unacknowledged.' To interrogate knowledge and inspire reflexivity, we texture our deductive analysis of intersectionality in AI fairness via four methodology lenses: where intersectionality is situated in the AI development process, how papers describe sources of bias, types of CS papers, and (inter)disciplinary relationality (i.e., synergy). These methodologies speak to both the research process and structures which researchers navigate in their work. We document the methodology tags for all the papers we review in Table 4.

4.3.1 Operationalization of intersectionality. We observe how papers engage with and operationalize intersectionality in the AI pipeline. Papers are tagged as pre-processing (i.e., pre-training interventions), in-processing (i.e., training-time modeling choices), post-processing (i.e., test-time interventions of model predictions), full pipeline, or processes. 'Full pipeline' situates intersectionality (for empirical work) across the pipeline, while 'processes' situates intersectionality in broader AI design and epistemology. Works that deeply engage with intersectionality exercise its tenets at every stage of the pipeline. Researchers can contrast modes of operationalizing intersectionality and in that tension, reimagine how they engage with the framework.

4.3.2 Source of bias. A paper may characterize bias as systemic, statistical, both systemic and statistical, or entirely fail to describe its source. Understanding sources of bias is pivotal to aligning AI fairness with intersectional praxis. Intersectionality posits that unequal outcomes reflect a systemic reproduction of existing power relations [28]. Systemic descriptions of bias concern structures and oppressive forces which subsequently permeate sociotechnical

Table 1: Critical review statistics ( 𝑁 = 30 )

| Characteristic                          | N   | %    |
|-----------------------------------------|-----|------|
| Intersectionality literature referenced | 22  | 0.73 |
| No. papers for annotator agreement      | 11  | 0.37 |
| Terminology                             |     |      |
| Uses term 'intersectionality'           | 26  | 0.87 |
| Uses term 'intersectional'              | 27  | 0.9  |
| AI Pipeline Stage                       |     |      |
| Pre-processing                          | 5   | 0.17 |
| In-processing                           | 4   | 0.13 |
| Post-processing                         | 10  | 0.33 |
| Full pipeline                           | 5   | 0.17 |
| Processes                               | 10  | 0.33 |
| CS Research Paradigm                    |     |      |
| Theoretical                             | 10  | 0.33 |
| Empirical                               | 23  | 0.77 |
| Engineering                             | 11  | 0.37 |
| Other                                   | 6   | 0.2  |
| Synergy across disciplines              | 16  | 0.53 |

systems. In contrast, statistical descriptions limit sources of bias to the model or data.

4.3.3 CS paper type. We study paper types considered valid in CS (as determined by those in positions of power), exposing tensions between intersectionality and visibility, and allowing us to interrogate assumptions about supposed barriers to knowledge due to disciplinary divides [79]. We classify papers as theoretical, engineering, empirical, or a combination of types based on Stent [86]. Papers that do not fit any of these types are tagged as 'other.' This information enables AI fairness researchers to interrogate possible interplays between intersectionality and their epistemology.

4.3.4 Synergy across disciplines. Papers are tagged for synergy if they incorporate literature beyond other AI papers and intersectionality scholarship (tagging process described in §A). By incorporating knowledge forms beyond CS, we make room for dialogue across 'more than one way of knowing' [48, 83]. This is particularly important for sources of marginalized knowledge that may go unheard. Smith [83] asserts that knowledge is always situated; dominant academic AI epistemologies describe systems as 'universal' or 'neutral, ' when in fact these terms simply indicate that other ways of knowing have been subjugated. Engaging in participatory AI research is one way of 'recovering [...] stories of the past' [90]. However, researchers can also embrace synergy across disciplines. This allows us to examine how AI epistemology's alignment with other works interacts with intersectionality to create new forms of knowledge production towards advancing AI fairness.

## 5 DEDUCTIVE ANALYSIS

Quantitative Summary. We report tenet distributions across all papers in Figure 1. Complexity (97% of all papers), inequality (83%), and justice (83%) appeared most often in works that engaged with at least 1 guiding question. In contrast, the tenets that appeared least often were power (53%), context (57%), and relationality (60%). Taking the number of questions answered as a proxy for depth of engagement with a tenet, we see drops in every tenet. The largest

Figure 1: Distribution of intersectionality tenets split by depth of engagement with our guiding questions.

<!-- image -->

drop (20%) between answering 1+ questions versus 3+ questions is in complexity, despite high overall engagement. Relationality similarly drops from 60% to just 7%. These results are interrelated just as the tenets are; understanding power across structures requires understanding social context and the relations between social groups [30]. Therefore, it is suspect that a majority of papers purportedly center social justice and inequality with so few discussing power.

Cites Intersectionality Literature. Figure 2a shows that citation of intersectionality literature (see §A for more details) affects how papers engage with power, inequality, and context. It does not, however, seem to cause differential engagement with complexity and justice.

64% of papers that cite intersectionality literature engage with power, compared to 25% of papers that don't cite it. Engagement with the literature would explain this, as intersectionality is grounded in an analysis of power. However, the overall consideration of power is middling, echoing intersectionality theorists' observation that the 'recasting of intersectionality as a theory primarily fascinated with the infinite combinations and implications of overlapping identities from an analytic initially concerned with structures of power and exclusion is curious given the explicit references to structures that appear in much of the early work' [22].

We see a similarly large gap in engagement with inequality. 91% of papers that cite intersectionality literature also discuss social inequality as a phenomenon with social and historical roots, or something their work impacts, compared to only 62% of papers that don't cite it. We see this difference as a reflection of intersectionality's motivation as a framework to examine inequalities.

Papers only seem to show consistent engagement with the tenets of complexity and justice, regardless of whether they cite intersectionality literature (above 80% of papers in each of these splits). This reflects the CS paradigm of understanding intersectionality as rejecting single axes of identity, and the ethos of AI fairness - one that seeks justice and a better future. Overall, citing intersectionality literature correlates with deeper tenet engagement.

Operationalization of Intersectionality. Figure 2b shows differences in how intersectionality is used across the AI pipeline. Papers

<!-- image -->

(b) Operationalization

(d) CS Paper Type

Figure 2: Relative distributions of papers across intersetionality tenets if a paper engages with at least 1 question per tenet.

operationalizing intersectionality end-to-end had the largest coverage across intersectionality tenets, with each tenet appearing in 71-100% of these papers. Meanwhile, the lowest engagement across tenets came from papers focused on pre-processing, with none of them engaging with context, power and relationality.

The locus of operationalization seemed to make the biggest difference in how context and power were engaged with. Engagement with the social context tenet seemed to increase as papers went further down the AI pipeline; no pre-processing focused papers engaged with it compared to 25% of in-processing focused papers, 50% of post-processing focused papers, and 71% of end-to-end papers. This pattern mostly held for power as well, except that in-processing papers (50%) engaged with this tenet more than post-processing papers (25%). Overall, papers engage with more tenets when they operationalize intersectionality end-to-end and in processes.

other engaged with the largest array of tenets. 100% of these papers engaged with power, as opposed to 60% of theory papers and a quarter of empirical papers. Theoretical papers seemed to engage relatively less with context (32%) and relationality (41%). Overall, despite disciplinary divides, papers in CS are able to engage with intersectionality tenets. Supplementing these findings, our inductive analysis in section §6 indicates that many works use a heuristic definition of intersectionality that is easily operationalized across theoretical, engineering, and empirical papers, resulting in a narrow use of the framework. Engaging with literature outside the empirical and engineering papers that are de rigueur in CS can expand tenet coverage.

Source of Bias. Differences in tenet engagement across the source of bias are shown in Figure 2c. Papers treating the source of bias as statistical had the lowest engagement across tenets, with only 30% of these papers engaging with context, relationality, and power. On the other hand, these papers have 100% coverage of the complexity tenet. This could be attributed to a common narrow reading of intersectionality as just multiplying identity categories rather than as a structural analysis or a political critique [51].

When considering bias to be systemic rather than statistical, tenet coverage increases noticeably; engagement with relationality jumps from 30% to 67% of papers in the category, context goes from 30% to 73%, and inequality goes from 60% to 100%. This aligns with existing literature in which discussing the social reality of a phenomenon allows one to more deeply assess the factors that contribute to it in the first place [5].

Papers that conceive of bias as both statistical and systemic have the best tenet coverage overall, with roughly 80-90% of papers discussing each of complexity, inequality, and justice. This dual conception of bias incorporates both the social and technical aspects of AI systems and how they may inform or magnify each other.

CS Paper Type. Figure 2d shows that papers across all CS paper types consistently engage with complexity and justice, with at least 70% of papers of each type covering these tenets. This consistency breaks down more dramatically across power, relationality, context, and inequality. No engineering papers engaged with these four tenets. At the other end of the spectrum, papers classified as

Synergy Across Disciplines. Figure 3 shows each tenet category split by whether or not they had a synergistic component. As it pertains to the source of bias, synergistic papers incorporate a wider range of tenets at higher rates than non-synergistic papers (Figure 3a). Even among papers that treat bias as systemic and thus engage with a social component of bias, tenet coverage benefits hugely from synergy, with 63-73% more papers discussing complexity and justice. Figure 3b shows that when papers that discuss intersectionality across the entire pipeline have a synergistic component, they have better tenet coverage. Synergy appears not to have a big effect on papers that focus on in-processing, pre-processing or post-processing, sometimes even appearing to decrease tenet coverage. With CS paper type (Figure 3c), papers that incorporated intersectionality in an empirical and theoretical paradigm had better tenet coverage when they had a synergistic component. We note that no engineering papers in our data have a synergistic component - an interesting finding in its own right. As before, this suggests that the biggest benefit to tenet coverage can come from first operationalizing intersectionality throughout the pipeline and attending to processes and norms, which arguably necessitates interdisciplinary synergy. Overall, disciplinary synergy correlates with higher intersectionality tenet coverage.

## 6 INDUCTIVE ANALYSIS

Intersectionality as intersectional subgroup fairness. Among papers which cite intersectionality literature, many conflate intersectionality with intersectional subgroup fairness. For example, Fitzsimons et al. [44] posit:

'... a model that satisfies conditional parity with respect to race and gender independently may fail to

Figure 3: Papers with at least 1 tenet characteristic, split by presence of a synergistic literary component (top=no, bottom=yes).

<!-- image -->

satisfy conditional parity with respect to the conjunction of race and gender. In the social science literature concerns about, potentially discriminated against, subdemographics are referred to as intersectionality.'

Similarly, Mougán et al. [74] state, 'For intersectional fairness, we created the variable EthnicMarital, engineered by concatenating Ethnic and Marital status.' Indeed, we observe that many papers conceptualize intersectionality as identity-centric, and its ties to power and inequality are not explicitly named [73, 74, 95]. Our finding substantiates the concerns of intersectionality scholars that intersectionality is diluted to a 'two-by-two analysis of gender by race' rather than 'constituting a structural analysis or a political critique' [51], or contending with 'overlapping systems of subordination' [30]. Notably, papers even discuss power and inequality in depth at first, but nevertheless operationalize intersectionality as subgroup fairness without engaging these points again [46].

Such additive frameworks are helpful insofar as they enable structural inquiry. However, per our annotations, despite overwhelming discourse on cross-sectional social categories, papers' discussions of subgroups often lack social or historical context [18, 44, 73]. Few works comment on the structural factors that cause certain groups to be underrepresented in datasets, critically engage with the colonial origins of protected attributes [41], or connect groups to social structures and inequality (c.f., the explicit recognition that Black communities are targeted at a higher rate by law enforcement using facial recognition in [17]).

The obfuscation of intersectionality as subgroup fairness reflects cultural denial, 'the process that allows us to know about cruelty, discrimination, and repression, but never openly acknowledge it' [40]. We do not claim that the intentions of AI fairness researchers are malicious; rather, groups 'los[ing] meaning as a descriptive, nonanalytical category' prevents researchers from engaging in critical inquiry [28]. This disarms praxis: AI fairness can no longer contend with advancing justice for those at the margins if their experiences with AI-driven social inequalities are not centered. Therefore, we echo Collins' call for 'intellectual vigilance' in analyzing and articulating intersecting power relations. Using an intersectional lens is crucial to refocusing on marginalized communities, and can inform social justice efforts across various fields by addressing the root causes of harm, regardless of one's training.

Recommendation. Researchers exercise intellectual vigilance when using additive frameworks by creating statistical methodologies that preserve unique social and historical characteristics of intersecting groups. [93] exemplifies this. Leadership incentivizes this inquiry. Researchers and leadership prioritize widening their conceptualization of intersectionality beyond the 'subgroup fairness' interpretation, which is limited in its social justice praxis.

Anti-discrimination legislation informs design. Several papers draw from regulation (e.g., anti-discriminatory legislation) to define their fairness objective. For example, Molina and Loiseau [73] state:

'In many-if not most-real-world applications, there are multiple protected attributes (typically 10-20) along which discrimination is prohibited [1, 2].'

Foulds and Pan [46] similarly motivate their fairness criteria from a legal perspective: 'consider the 80% rule, established in the Code of Federal Regulation.' Additionally, Foulds et al. [45] seek to '[determine] whether disparities in system behavior meet legal thresholds for discrimination.' Furthermore, Ghosh et al. [49] remark, 'there does not exist a single universally agreed upon definition of fairness,' citing how different 'anti-discrimination legislation exists in various jurisdictions around the world.'

Motivating AI fairness from a strictly regulatory lens (e.g., the 80% rule, protected groups) does not fully embrace social and historical context. Several critical scholars argue that discrimination is often legitimized through anti-discrimination law [35, 38, 47, 84]. According to Freeman [47], these laws see racial discrimination 'not as conditions, but as actions inflicted on the victim by the perpetrator. ' He adds that such laws reflect the idea that 'only 'intentional'

discrimination violates anti-discrimination principles,' creating 'a class of the 'innocent' who need not feel any personal responsibility for the conditions associated with discrimination' [47]. Similarly, in AI fairness, researchers prioritize intersectional subgroup fairness over the structures that give rise to unfairness to begin with. Interestingly, AI fairness researchers who adopt a regulatory lens abundantly cite Crenshaw [36], although this work illuminates how anti-discrimination laws render Black women invisible:

'In a monumental paper published in 1989, Kimberlé Crenshaw [11] introduced Intersectionality by referencing a court case where black women were unfairly discriminated as a result of an activity to mitigate the race and gender discrimination independently' [65].

AI fairness researchers must heed the warnings of critical legal studies: indifference to the social and historical context of groups and their intersections risks reproducing histories of discrimination. For example, an important step towards dismantling injustices is challenging social categories rooted in colonialism, as 'this structure imports a descriptive and normative view of society that reinforces the status quo' [35]; hence, failing to investigate how the mechanisms responsible for the unjust social realities of oppressed groups are upheld by one's technology is fundamentally incompatible with reparation and advancing justice [32, 37]. Therefore, while social beneficence may motivate an AI fairness approach, its technical operationalization must consider the sociotechnical environment it operates within. In other words, if the goal of researchers is to leverage intersectionality towards the creation of just AI systems, these systems must be infused with social and historical literacy throughout their lifecycle to prevent indifferent engagement with the people they affect.

Recommendation. Researchers, including those in leadership, critically engage with and remain vigilant of how operationalizations of anti-discrimination laws in their AI systems do not automatically mean that their systems are fair to marginalized communities. They may do this by engaging with critical legal studies texts [35, 38, 47, 84] and marginalized communities to learn how they are unfairly impacted even by systems that pass legal audits. [59] does a good job of examining the tensions between prioritizing different forms of fairness.

Angles of power examined: technodeterminism rules. Collins describes intersectionality as examining the mutual influences which 'intersect and interlock' across 'structural, disciplinary, cultural, and interpersonal' [26] domains of power. However, among papers that cite intersectionality literature, power is the least engaged tenet, with 'power' mentioned in only 53% of papers. Moreover, merely mentioning 'power' does not entail engaging with it in depth, e.g., Foulds and Pan [46] write in their abstract that 'intersectionality [...] analyzes how interlocking systems of power and oppression affect individuals along overlapping dimensions,' but do not discuss power elsewhere in their paper. Similarly, Yang et al. [96] only mention power in their related works section.

Furthermore, across papers that do engage with power and power relations, engagement style varies. For example, we see power described as a distributable commodity; Suresh et al. [87] assert, 'our work [...] stems from the acknowledgment that power is not equally distributed in the world.' In contrast, Kirk et al. [62] note, without explicitly using the term 'power,' that 'models can exacerbate existing biases in data and perpetuate stereotypical associations to the harm of marginalized communities.'

One can argue that AI fairness researchers study mechanisms of inequality, namely the way inequalities emerge as 'AI harms,' so that we may reduce them. As such, the allocational and representational harms of our systems are the result of power enacted by our systems unto those at the margins. We do not reject these approaches to making sense of power discrepancies observed in AI-driven systems. However, many AI fairness researchers constrain their discussion of power to the AI system alone, removing themselves from the equation. The notion that a system itself exerts power is technodeterministic, i.e., it reifies the idea that systems, and not their creators, are responsible for reproducing inequalities. Only a few papers that we review escape technodeterminism, e.g., Kasy and Abebe [59] state, 'The second alternative perspective focuses on the distribution of power and asks: who gets to pick the objective function of an algorithm? The choice of objective functions is intimately connected with the political economy question of who has ownership and control rights over data and algorithms.' Engaging with intersectionality forces researchers to shed their technodeterminism and contend with the value-laden choices made by the humans that contribute to the lifecycle of AI systems. This is central to praxis that may effectively advance justice in AI fairness.

Recommendation. Researchers flex intellectual vigilance by being explicit about how their methodologies may contribute to perpetuating social inequalities. They state their full-pipeline design choices at the beginning of projects and iterate as designs are updated. Leadership gives researchers opportunities to engage in critical reflexivity. These issues are further discussed in [5, 39, 75].

Questionable citational praxis of intersectionality. Several papers reference literature incorrectly to justify their operationalization of intersectionality. For example, Ghosh et al. [49] assume that Buolamwini and Gebru [17] concerns intersectionality though it is actually a study of intersecting subgroups. We see this phenomenon again in Kang et al. [57], which cites only Buolamwini and Gebru [17] when describing intersectionality. In contrast, some papers, like Makhlouf et al. [69], discuss intersectionality, but only cite a paper on affirmative action [58]. Other papers, like Foulds and Pan [46] and Mougán et al. [74], mention intersectionality, yet do not reference any relevant literature at all; this is reflected in our deductive analysis, with 19% of papers that use the term 'intersectionality' not citing any intersectionality literature.

These findings exemplify a weak spot in the citational praxis of AI fairness researchers. Alexander-Floyd [1] calls for us to cite intersectionality literature, showing that within social science literature, there has been an erasure of Black women and Black feminist knowledge in papers that discuss intersectionality. She describes the centering of positivist and empiricist methods of knowledge production as a force that (re-)subjugates Black feminist knowledge and contributes to maintaining the status quo of whose knowledge counts as 'scientific' [1]. Bilge [7] identifies similar power structures in feminist studies and the broader neoliberal academy that contribute to 'neutralizing the critical potential of intersectionality for social justice-oriented change.'

We find this gentrification of intersectionality in our field too; AI research interprets intersectionality as a dimension of 'solvability' and scale, 'perpetuat[ing] the status quo injustice' [66]. Furthermore, potentially due to disciplinary barriers or gaps, papers use vague language when describing intersectionality. For instance, Kobayashi and Nakao [65] assert, 'the concept of Intersectionality covers diverse discussions including the issue of the oppression that people feel due to the discrimination [15].' Camara et al. [19] mention 'the complex and interconnected nature of social biases.' Mitchell et al. [71] state, 'an individual's identity and experiences are shaped [...] by a complex combination of many factors.' Vague language prevents intersectionality from being appropriately situated in sociotechnical systems, and may convey an incomplete understanding of intersectionality, neutralizing both researchers' and readers' engagement with power structures and inequality.

Recommendation. Researchers explicitly share how their interpretation of intersectionality literature informs their methodology and assumptions. They read critical social justice literature outside of CS and cite it when incorporating it in AI design. Researchers, including those across leadership, expect and enforce intersectionality citational integrity when peer-reviewing.

Intersectional AI fairness lacks relationality. We find that AI fairness researchers have adopted intersectionality in a way that strips the relationship between structures from the complexity of intersectionality's arguments. This 'misrepresents [the] initial intent' of intersectionality [27, 94], i.e., to question 'how larger social structures influence supposed group level differences' [16]. For instance, some works that engage with intersectionality literature propose statistical solutions for inequality, e.g., Foulds et al. [45] tackle data sparsity by exploiting the structure of data distributions of data-dense subgroups (e.g., white women, Black men) to inform the data distribution of data-sparse subgroups (e.g., Black women). We do not reject statistical approaches to reducing AI harms; however, formulations that do not situate their statistical methods in a social context by, for instance, stating statistical and social assumptions those methods are based on, entirely miss the point of intersectionality as a critical framework.

Being intellectually vigilant about the relationship between statistics and the social sciences is crucial for their intersection. However, we observe different levels of contending with this intersection. Vigilance is missing entirely when the assumptions and reasoning behind the translation from social science knowledge to statistics is not explicit (e.g., [18, 44, 74]), with Fitzsimons et al. [44] describing: 'In the social science literature concerns about, potentially discriminated against, sub-demographics are referred to as intersectionality [12]. More formally, this work proposes a simple approach to ensure group fairness in expectation across an arbitrary set of subgroups.' Jin et al. [55] provides a more intentional socio-technical translation: 'although all value combinations are assessed for intersectional fairness, some subgroups may be semantically meaningless and hence should not be returned as the output,' though what is 'meaningful' is not described. Other works go into more depth with their assumptions, (e.g., [93], [71]), with Mitchell et al. [71] stating with respect to subgroup formation that 'collaboration with policy, privacy, and legal experts is necessary in order to ascertain which groups may be responsibly inferred, and how that information should be stored and accessed.'

We caution against citing intersectionality literature while ignoring the relationships between the structures that create social categories. This fortifies the fallacy that we have engaged in intersectional praxis if we statistically supplement missing knowledge without examining the embedded assumptions and implications of doing so. It is through this neutralization of critical vigilance and reflexivity that AI fairness researchers are unable to identify where social inequalities may emerge through their own praxis. Invoking an intersectional lens enables this and is, therefore, pivotal to understanding the interlocking systems that produce AI injustices and doing AI justice work.

Recommendation. Researchers remain intellectually vigilant about how scholarship from the social sciences relates to and informs both statistical and wider research methodology. As a result, they preserve the social context of social groups when employing statistical methods, e.g., by transparently stating how they infuse statistical assumptions with context. Across points of power, researchers have 'vigilance check-ins' to check translative asssumptions during AI development milestones. [71] engages with transparency at the model level which complements these points.

AI social justice praxis varies. Some papers treat improved fairness as social justice praxis regardless of the task's context. For example, Foulds et al. [45] use recidivism prediction as a fairness benchmark task. As recidivism prediction is a 'byproduct of ongoing regimes of selective policing and punishment' [5], the task only serves to uphold the carceral state [52]. Here, intersectionality posits sites of violence are saturated intersections of power [29].

Furthermore, many works are not grounded in social context, which ought to inform social justice praxis [61, 65, 81]. Some papers provide context (e.g., data collection is 'biased toward nonminorities' [45]), but nevertheless prioritize generalization [45]. Some papers even give credence to inferring the social category of individuals; Fitzsimons et al. [44] state, 'gender labels were inferred using the employees' first names, parsed through the genderguesser python library.' Furthermore, we identify works that highlight the oppressive nature of social categories though often defer contestations to future work. For example, Kirk et al. [62] advocate:

'Future research is recommended to make ground truth comparisons across a broader range of countries against the set of gender-intersections examined in this paper and to comment on a broader spectrum of gender identities. '

Moreover, few papers complement technical contributions with social action, and some even tout their 'purely statistical approach' [73]; this neglects the complexity inherent to dismantling social injustices. Mathematical saviorism restricts the operationalization of critical praxis to the pre/in/post-processing stages. This encourages AI researchers to locate sources of unfairness situated only within the technical domain, ignoring the broader sociotechnical milieu linked to the power relations and inequalities upheld by AI [39]. Consequently, people already at the margins are erased, even in these contexts that ostensibly address fairness, oppression, and complexity. Thus, AI fairness researchers must engage in praxis that is informed by the experiences of those at the margins.

Some papers justify design choices that do not center care for those at the margins through utilitarian perspectives, e.g., Molina and Loiseau [73] reason, 'an algorithm which discriminates 1 person among a 1000 can be described as fair to an extent.' On the other hand, works like Suresh et al. [87] and Mitchell et al. [71] concretely advocate to dismantle injustice and shift power through participation in model development and transparency in deployment, respectively. The contrast in social justice praxis is notable; AI fairness researchers must consider how design choices situate AI systems within their sociotechnical context.

As Crenshaw [35] has said, "addressing the needs and problems of those who are most disadvantaged" means that "others who are singularly disadvantaged would also benefit." Centering these people and the contexts tied to their oppression deepens social justice engagement and creates equity. This way of engaging with intersectionality thus equips AI fairness researchers, regardless of training, to better address inequalities and injustices in AI.

Recommendation. Researchers bridge social justice inquiry and praxis by investing in and valuing the knowledge from communities that their AI systems harm. Researchers and leadership make sure that the AI design process prioritizes harm reduction to promote justice for marginalized communities. [87] does a good job at centering AI development through community engagement.

AI fairness misses critical reflexivity. Several papers neglect to state their social context and its implications for research methodology. This is reflected in our annotations, with 43% of papers-even critical ones, e.g., Kong [66]-not including their social context (often the US) [18, 68, 95]. Furthermore, when describing social context, some works only include the US as an important context, without commenting on the aspects of complexity and power inherent to doing so. This privileges western contexts as the 'default' context, resulting in western prototypicality (c.f., white prototypicality [50]). For instance, Kirk et al. [62] argue:

'using US data may provide an appropriate baseline comparison: 50% of Reddit traffic comes from the US, and a further 7% from Canada and the UK each [34]. Given that US sources form a majority in GPT-2's training material [...], we consider the US dataset a satisfactory first benchmark.'

Moreover, when authors do name their social context, they often phrase it as a blanket limitation rather than a contextualization of their research choices; Yang et al. [96] share that 'the social construction and definitions of sensitive attributes' are 'outside the scope of the present work but which are important in any real application.' Stating their context as a limitation-instead of a point which textures their work from the onset -situates their context as an afterthought, rather than something that undergirds the entire research process. On the other hand, Suresh et al. [87] center reflexivity throughout their work stating: 'Throughout this process, we take an explicitly feminist approach, both in our overaching process-which we strive to make iterative, reflexive, contextual, and participatory-as well as the technology we build'.

All in all, critical reflexivity is crucial to operationalizing intersectionality, both as inquiry and praxis. AI researchers are overwhelmingly located in the Global North [12], which makes many power relations and AI injustices invisible to us, especially when we lack the abilities to inquire upon it. Reflexivity requires that we observe the power relations we participate in or benefit from, dismantle these relations, and identify opportunities for social justice within AI fairness. Our advice aligns with conceptualizations of decolonization within the computational sciences; Birhane and Guest [11] comment that decolonizing 'requires the beneficiaries of the current systems to acknowledge their privilege and actively challenge the system that benefits them.'

Works that decouple social context and relationality from intersectionality may reflect academic incentives (e.g., conference acceptances, funding [13], citations) and infrastructural forces (e.g., conference paper formats, objectivity-washing). These push AI researchers to make 'fairness' palatable by treating it as a complexityfree scientific quantity that can be optimized [10, 89]. Our paper is bound by similar constraints; we empirically validate our critical analyses in order to publish and our citation of the papers we review gives them 'academic currency' even as we critique them.

Recommendation. Researchers across points of power iteratively dialogue on unlearning 'universal' frameworks of knowledge and remain vigilant of whose knowledge is centered when developing AI. Leadership incentivizes and provides resources for their team to engage in critical reflexivity tools throughout development. [64] provides a good example of iterative reflexivity.

## 7 CONCLUSION

What we cannot name, we cannot see. What we cannot see, we cannot address. By examining AI fairness papers related to intersectionality, we identify several patterns in how the literature discusses intersectionality and how it impacts our ability to produce equitable tools. While our field has much energy to get this technology right, we caution the community against assuming that surmounting a 'fairness issue' pre/in/post the AI pipeline means we have fixed the social reality driving the problem. This work does not seek to discard existing AI fairness work; instead, we invite a widening of AI fairness practice by centering marginalized people and valorizing critical knowledge production that makes room for their voices. We provide recommendations grounded in producing critical knowledge on how AI systems reproduce social inequalities. Our recommendations are not mutually exclusive with respect to AI fairness infrastructure. Rather, they empower researchers to flex the intellectual vigilance required to produce intersectional work, regardless of CS paradigm. Expanding both the conceptualization and operationalization of intersectionality will enable AI fairness researchers across points of power to engage in deeper social justice praxis for AI. To do this, we advocate for adopting intersectionality as an analytical sensibility rather than an axis of optimization.

'I lack imagination you say No. I lack language. The language to clarify my resistance to the literate.'

- -Cherríe Moraga (1983)

## ACKNOWLEDGMENTS

Weareimmensely grateful for the work of intersectionality scholars, especially Black women scholars. We thank Dr. Lisa Bowleg and the anonymous reviewers for their feedback.

## REFERENCES

- [1] Nikol G. Alexander-Floyd. 2012. Disappearing Acts: Reclaiming Intersectionality in the Social Sciences in a Post-Black Feminist Era. Feminist Formations 24, 1 (2012), 1-25. https://doi.org/10.1353/ff.2012.0003
- [2] Solon Barocas, Moritz Hardt, and Arvind Narayanan. 2019. Fairness and Machine Learning: Limitations and Opportunities . fairmlbook.org. http://www.fairmlbook. org.
- [3] Solon Barocas and Andrew D. Selbst. 2016. Big Data's Disparate Impact. California Law Review 104 (2016), 671.
- [4] Greta R. Bauer, Mayuri Mahendran, Chantel Walwyn, and Mostafa Shokoohi. 2021. Latent variable and clustering methods in intersectionality research: systematic review of methods applications. Social Psychiatry and Psychiatric Epidemiology 57 (2021), 221-237.
- [5] Ruha Benjamin. 2019. Race after technology: Abolitionist tools for the new jim code. Social forces (2019).
- [6] Michele Tracy Berger and Kathleen Guidroz. 2010. The intersectional approach: Transforming the academy through race, class, and gender . Univ of North Carolina Press.
- [7] Sirma Bilge. 2013. Intersectionality Undone: Saving Intersectionality from Feminist Intersectionality Studies. Du Bois Review: Social Science Research on Race 10, 2 (2013), 405-424. https://doi.org/10.1017/S1742058X13000283
- [8] Reuben Binns. 2019. On the apparent conflict between individual and group fairness. Proceedings of the 2020 Conference on Fairness, Accountability, and Transparency (2019).
- [9] Abeba Birhane. 2021. Algorithmic injustice: a relational ethics approach. Patterns 2, 2 (2021), 100205. https://doi.org/10.1016/j.patter.2021.100205
- [10] Abeba Birhane and Fred Cummins. 2019. Algorithmic Injustices: Towards a Relational Ethics. ArXiv abs/1912.07376 (2019).
- [11] Abeba Birhane and Olivia Guest. 2020. Towards decolonising computational sciences. arXiv preprint arXiv:2009.14258 (2020).
- [12] Abeba Birhane, Elayne Ruane, Thomas Laurent, Matthew S. Brown, Johnathan Flowers, Anthony Ventresque, and Christopher L. Dancy. 2022. The Forgotten Margins of AI Ethics. In 2022 ACM Conference on Fairness, Accountability, and Transparency (Seoul, Republic of Korea) (FAccT '22) . Association for Computing Machinery, New York, NY, USA, 948-958. https://doi.org/10.1145/3531146. 3533157
- [13] Borhane Blili-Hamelin and Leif Hancox-Li. 2022. Making Intelligence: Ethical Values in IQ and ML Benchmarks.
- [14] Lisa Bowleg. 2021. Evolving Intersectionality Within Public Health: From Analysis to Action. American journal of public health 111 1 (2021), 88-90.
- [15] André Brock. 2018. Critical technocultural discourse analysis. New Media &amp; Society 20 (2018), 1012-1030.
- [16] Nicole T. Buchanan, Desdamona Rios, and Kim A. Case. 2020. Intersectional Cultural Humility: Aligning Critical Inquiry with Critical Praxis in Psychology. Women &amp; Therapy 43 (2020), 235-243.
- [17] Joy Buolamwini and Timnit Gebru. 2018. Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification. In FAT .
- [18] Ángel Alexander Cabrera, Will Epperson, Fred Hohman, Minsuk Kahng, Jamie H. Morgenstern, and Duen Horng Chau. 2019. FAIRVIS: Visual Analytics for Discovering Intersectional Bias in Machine Learning. 2019 IEEE Conference on Visual Analytics Science and Technology (VAST) (2019), 46-56.
- [19] Antonio Camara, Nina Taneja, Tamjeed Azad, Emily Allaway, and Richard S. Zemel. 2022. Mapping the Multilingual Margins: Intersectional Biases of Sentiment Analysis Systems in English, Spanish, and Arabic. In LTEDI .
- [20] Graham Cameron. 2004. Evidence in an indigenous world. In Australasian Evaluation Society 2004 International Conference, Adelaide, South Australia .
- [21] Bagele Chilisa. 2019. Indigenous research methodologies . Sage publications.
- [22] Sumi Cho, Kimberlé Williams Crenshaw, and Leslie McCall. 2013. Toward a Field of Intersectionality Studies: Theory, Applications, and Praxis. Signs: Journal of Women in Culture and Society 38, 4 (Jun 2013), 785-810. https://doi.org/10.1086/ 669608
- [23] Sarah Ciston. 2019. Imagining Intersectional AI. xCoAx (2019), 39.
- [24] Elizabeth R Cole. 2009. Intersectionality and research in psychology. The American psychologist 64 3 (2009), 170-80.
- [25] The Combahee River Collective. 1978. A Black Feminist Statement. Women's Studies Quarterly (1978).
- [26] Patricia Hill Collins. 2000. Black Feminist Thought in the Matrix of Domination.
- [27] Patrícia Hill Collins. 2015. Intersectionality's Definitional Dilemmas. Review of Sociology 41 (2015), 1-20.
- [28] Patricia Hill Collins. 2019. Intersectionality as critical social theory . Duke University Press.
- [29] Patricia Hill Collins and Sirma Bilge. 2020. Intersectionality . John Wiley &amp; Sons.
- [30] Patricia Hill Collins, Elaini Cristina Gonzaga da Silva, Emek Ergun, Inger Furseth,
31. Kanisha D. Bond, and Jone Martínez-Palacios. 2019. Intersectionality as Critical Social Theory. Contemporary Political Theory 20 (2019), 690-725.
- [31] Sasha Constanza-Chock. 2020. Introduction: #TravelingWhileTrans, Design Justice, and Escape from the Matrix of Domination. Design Justice (2020).

AIES '23, August 08-10, 2023, Montréal, QC, Canada

- [32] A. Feder Cooper, Ellen Abrams, and NA Na. 2021. Emergent Unfairness in Algorithmic Fairness-Accuracy Trade-Off Research. Proceedings of the 2021 AAAI/ACM Conference on AI, Ethics, and Society (2021).
- [33] Ruth Schwartz Cowan. 1972. Francis Galton's statistical ideas: the influence of eugenics. Isis 63, 4 (1972), 509-528.
- [34] Fiona Cram. 2004. Kaupapa M¯ aori evaluation: Theories, practices, models, analyses. Evaluation Hui Summit (2004), 11-16.
- [35] Kimberlé Crenshaw. 1989. Demarginalizing the intersection of race and sex: A black feminist critique of antidiscrimination doctrine, feminist theory and antiracist politics. In Feminist legal theories . Routledge, 23-51.
- [36] Kimberle Crenshaw. 1991. Mapping the Margins: Intersectionality, Identity Politics, and Violence against Women of Color. Stanford Law Review 43, 6 (Jul 1991), 1241. https://doi.org/10.2307/1229039
- [37] Jenny L. Davis, Apryl A. Williams, and Michael W. Yang. 2021. Algorithmic reparation. Big Data &amp; Society 8 (2021).
- [38] Richard Delgado and Jean Stefancic. 2023. Critical race theory: An introduction . Vol. 87. NyU press.
- [39] Catherine D'Ignazio. 2021. Data Feminism: Teaching and Learning for Justice. Proceedings of the 26th ACM Conference on Innovation and Technology in Computer Science Education V. 1 (2021).
- [40] Virginia E. Eubanks. 2018. Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor.
- [41] Frantz Fanon. 1952. Black Skin, White Masks. My Black Stars (1952).
- [42] Frantz Fanon. 2004. The Wretched of the Earth. 1961. Trans. Richard Philcox. New York: Grove Press 6 (2004).
- [43] Jessica Finocchiaro, Roland Maio, Faidra Georgia Monachou, Gourab K. Patro, Manish Raghavan, Ana-Andreea Stoica, and Stratis Tsirtsis. 2020. Bridging Machine Learning and Mechanism Design towards Algorithmic Fairness. Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (2020).
- [44] Jack K. Fitzsimons, Michael A. Osborne, and Stephen J. Roberts. 2018. Intersectionality: Multiple Group Fairness in Expectation Constraints. ArXiv abs/1811.09960 (2018).
- [45] James R. Foulds, Rashidul Islam, Kamrun Keya, and Shimei Pan. 2018. Bayesian Modeling of Intersectional Fairness: The Variance of Bias. In SDM .
- [46] James R. Foulds and Shimei Pan. 2018. An Intersectional Definition of Fairness. 2020 IEEE 36th International Conference on Data Engineering (ICDE) (2018), 19181921.
- [47] Alan David Freeman. 1977. Legitimizing racial discrimination through antidiscrimination law: A critical review of Supreme Court doctrine. Minn. L. Rev. 62 (1977), 1049.
- [48] Timnit Gebru. 2021. Hierarchy of Knowledge in Machine Learning &amp; Related Fields and Its Consequence. https://youtu.be/OL3DowBM9uc
- [49] A. Ghosh, Lea Genuit, and Mary Reagan. 2021. Characterizing Intersectional Group Fairness with Worst-Case Comparisons. In AIDBEI .
- [50] Lewis R. Gordon. 2006. Is the Human a Teleological Suspension of Man? Phenomenological Exploration of Sylvia Wynter's Fanonian and Biodicean Reflections . Ian Randle, Kingston, Jamaica.
- [51] Kathleen Guidroz and Michele Tracy Berger. 2021. A Conversation with Founding Scholars of Intersectionality. (2021).
- [52] Lelia Hampton. 2021. Black Feminist Musings on Algorithmic Oppression. Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (2021).
- [53] Ange-Marie Hancock. 2007. When Multiplication Doesn't Equal Quick Addition: Examining Intersectionality as a Research Paradigm. Perspectives on Politics 5, 01 (Mar 2007). https://doi.org/10.1017/S1537592707070065
- [54] Abigail Z. Jacobs and Hanna M. Wallach. 2019. Measurement and Fairness. Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (2019).
- [55] Zhongjun (Mark) Jin, Mengjing Xu, Chenkai Sun, Abolfazl Asudeh, and H. V. Jagadish. 2020. MithraCoverage: A System for Investigating Population Bias for Intersectional Fairness. Proceedings of the 2020 ACM SIGMOD International Conference on Management of Data (2020).
- [56] Seth C. Kalichman, Bruno Shkembi, and Lisa A. Eaton. 2021. Finding the Right Angle: A Geometric Approach to Measuring Intersectional HIV Stigma. AIDS and Behavior 26 (2021), 27-38.
- [57] Jian Kang, Tiankai Xie, Xintao Wu, Ross Maciejewski, and Hanghang Tong. 2021. InfoFair: Information-Theoretic Intersectional Fairness. 2022 IEEE International Conference on Big Data (Big Data) (2021), 1455-1464.
- [58] Sampath Kannan, Aaron Roth, and Juba Ziani. 2019. Downstream effects of affirmative action. In Proceedings of the Conference on Fairness, Accountability, and Transparency . 240-248.
- [59] Maximilian Kasy and Rediet Abebe. 2021. Fairness, Equality, and Power in Algorithmic Decision-Making. Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (2021).
- [60] Ibram X. Kendi. 2023. How to be an antiracist . One World.
- [61] Jae-Yeon Kim, Carlos Ortiz, Sarah Nam, Sarah Santiago, and Vivek Datta. 2020. Intersectional Bias in Hate Speech and Abusive Language Datasets. ArXiv abs/2005.05921 (2020).

| [62]   | Hannah Rose Kirk, Yennie Jun, Haider Iqbal, Elias Benussi, Filippo Volpin, Frédéric A. Dreyer, Aleksandar Shtedritski, and Yuki M. Asano. 2021. Bias Out-of-the-Box: An Empirical Analysis of Intersectional Occupational Biases in                                                                                                                                                                                                                                                    |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [63]   | Popular Generative Language Models. In Neural Information Processing Systems . Goda Klumbyte, Claude Draude, and Alex S. Taylor. 2022. Critical Tools for Machine Learning: Working with Intersectional Critical Concepts in Machine Learning Systems Design. In 2022 ACMConference on Fairness, Accountability, and Transparency (Seoul, Republic of Korea) (FAccT '22) . Association for Computing Machinery, New York, NY, USA, 1528-1541. https://doi.org/10.1145/3531146. 3533207 |
| [64]   | Goda Klumbyte, Claude Draude, and Alex S. Taylor. 2022. Critical Tools for Machine Learning: Working with Intersectional Critical Concepts in Machine Learning Systems Design. 2022 ACM Conference on Fairness, Accountability, and Transparency (2022).                                                                                                                                                                                                                               |
| [65]   | Kenji Kobayashi and Yuri Nakao. 2020. One-vs.-One Mitigation of Intersectional Bias: A General Method to Extend Fairness-Aware Binary Classification. ArXiv abs/2010.13494 (2020).                                                                                                                                                                                                                                                                                                     |
| [66]   | Youjin Kong. 2022. Are 'Intersectionally Fair' AI Algorithms Really Fair to Women of Color? A Philosophical Analysis. 2022 ACM Conference on Fairness, Accountability, and Transparency (2022).                                                                                                                                                                                                                                                                                        |
| [67]   | Youjin Kong. 2022. Are 'Intersectionally Fair' AI Algorithms Really Fair to Women of Color? A Philosophical Analysis. In 2022 ACM Conference on Fairness, Accountability, and Transparency . 485-494.                                                                                                                                                                                                                                                                                  |
| [68]   | John P. Lalor, Yi Yang, Kendall Smith, Nicole Forsgren, and A. Abbasi. 2022. Benchmarking Intersectional Biases in NLP. In North American Chapter of the Association for Computational Linguistics .                                                                                                                                                                                                                                                                                   |
| [69]   | Karima Makhlouf, Sami Zhioua, and Catuscia Palamidessi. 2021. On the Ap- plicability of Machine Learning Fairness Notions. ACM SIGKDD Explorations                                                                                                                                                                                                                                                                                                                                     |
| [70]   | Newsletter 23 (2021), 14-23. Vishwali Mhasawade, Yuan Zhao, and Rumi Chunara. 2021. Machine learning and algorithmic fairness in public and population health. Nature Machine Intelligence 3 (2021), 659-666.                                                                                                                                                                                                                                                                          |
| [71]   | Margaret Mitchell, Simone Wu, Andrew Zaldivar, Parker Barnes, Lucy Vasserman, Ben Hutchinson, Elena Spitzer, Inioluwa Deborah Raji, and Timnit Gebru. 2018. Model Cards for Model Reporting. Proceedings of the Conference on Fairness, Accountability, and Transparency (2018).                                                                                                                                                                                                       |
| [72]   | Shakir Mohamed, Marie-Therese Png, and William Isaac. 2020. Decolonial AI: Decolonial theory as sociotechnical foresight in artificial intelligence. Philosophy & Technology 33 (2020), 659-684.                                                                                                                                                                                                                                                                                       |
| [73]   | Mathieu Molina and Patrick Loiseau. 2022. Bounding and Approximating Inter- sectional Fairness through Marginal Fairness. ArXiv abs/2206.05828 (2022).                                                                                                                                                                                                                                                                                                                                 |
| [74]   | Carlos Mougán, José Manuel Álvarez, Gourab K. Patro, Salvatore Ruggieri, and Steffen Staab. 2022. Fairness implications of encoding protected categorical attributes. ArXiv abs/2201.11358 (2022).                                                                                                                                                                                                                                                                                     |
| [75]   | Safiya Umoja Noble. 2018. Algorithms of oppression: how search engines reinforce racism . New York University Press, New York.                                                                                                                                                                                                                                                                                                                                                         |
| [76]   | Lorelli S. Nowell, Jill M. Norris, Deborah E. White, and Nancy J. Moules. 2017. Thematic Analysis: Striving to Meet the Trustworthiness Criteria. International Journal of Qualitative Methods 16, 1 (2017), 1609406917733847. https://doi.org/ 10.1177/1609406917733847 arXiv:https://doi.org/10.1177/1609406917733847                                                                                                                                                                |
| [77]   | University of Nottingham. (n.d.). Understanding Pragmatic Research - nottingham.ac.uk. https://www.nottingham.ac.uk/helmopen/rlos/research- evidence-based-practice/designing-research/types-of-study/understanding-                                                                                                                                                                                                                                                                   |
| [78]   | pragmatic-research/section02.html. [Accessed 15-Mar-2023]. Erlinda C Palaganas, Marian C Sanchez, Visitacion P Molintas, and Ruel DCarica- tivo. 2017. Reflexivity in qualitative research: A journey of learning. Qualitative Report 22, 2 (2017).                                                                                                                                                                                                                                    |
| [79]   | Inioluwa Deborah Raji, Morgan Klaus Scheuerman, and Razvan Amironesei. 2021. You Can't Sit With Us: Exclusionary Pedagogy in AI Ethics Education. In Proceed- ings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (Virtual Event, Canada) (FAccT '21) . Association for Computing Machinery, New                                                                                                                                                             |
| [80]   | York, NY, USA, 515-525. https://doi.org/10.1145/3442188.3445914 Yolanda A. Rankin, Jakita Owensby Thomas, and Nicole M. Joseph. 2020. Inter- sectionality in HCI. Interactions 27 (2020), 68-71.                                                                                                                                                                                                                                                                                       |
| [81]   | Kenneth S. Rogerson and Aidan Fitzsimmons. 2022. Intersectional Identities and Machine Learning: Illuminating Language Biases in Twitter Algorithms. Proceedings of the Annual Hawaii International Conference on System Sciences                                                                                                                                                                                                                                                      |
| [82]   | (2022). Ari Schlesinger, W. Keith Edwards, and Rebecca E. Grinter. 2017. Intersectional HCI: Engaging Identity through Gender, Race, and Class. In Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems (Denver, Colorado, USA) (CHI '17) . Association for Computing Machinery, New York, NY, USA, 5412-5427. https://doi.org/10.1145/3025453.3025766                                                                                                         |
| [83]   | Linda Tuhiwai Smith. 2021. Decolonizing methodologies: Research and indigenous peoples . Bloomsbury Publishing.                                                                                                                                                                                                                                                                                                                                                                        |
| [84]   | Dean Spade. 2015. Normal life: Administrative violence, critical trans politics, and the limits of law . Duke University Press.                                                                                                                                                                                                                                                                                                                                                        |

| [85]   | Ryan Steed and Aylin Caliskan. 2020. Image Representations Learned With Unsupervised Pre-Training Contain Human-like Biases. Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (2020).                                                                                                                                                                                                      |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [86]   | Amanda Stent. 2023. howtoreadacspaper.pdf. https://people.cs.pitt.edu/~litman/ courses/cs2710/papers/howtoreadacspaper.pdf. (Accessed on 03/06/2023).                                                                                                                                                                                                                                                                          |
| [87]   | Harini Suresh, Rajiv Movva, Amelia Lee Dogan, Rahul Bhargava, Isadora Araujo Cruxên, Angeles Martinez Cuba, Guilia Taurino, Wonyoung So, and Catherine D'Ignazio. 2022. Towards Intersectional Feminist and Participatory ML: A Case Study in Supporting Feminicide Counterdata Collection. 2022 ACM Conference on Fairness, Accountability, and Transparency (2022).                                                          |
| [88]   | Miriam E Sweeney and André Brock. 2014. Critical informatics: New methods and practices. Proceedings of the American Society for Information Science and Technology 51, 1 (2014), 1-8.                                                                                                                                                                                                                                         |
| [89]   | Zeerak Talat, Joachim Bingel, and Isabelle Augenstein. 2021. Disembodied Ma- chine Learning: On the Illusion of Objectivity in NLP. ArXiv abs/2101.11974 (2021).                                                                                                                                                                                                                                                               |
| [90]   | Vivetha Thambinathan and Elizabeth Anne Kinsella. 2021. Decolonizing method- ologies in qualitative research: Creating spaces for transformative praxis. Inter- national Journal of Qualitative Methods 20 (2021), 16094069211014766.                                                                                                                                                                                          |
| [91]   | Sandhya Tripathi, Bradley A. Fritz, Michael S. Avidan, Yixin Chen, and Christo- pher R. King. 2022. Algorithmic Bias in Machine Learning Based Delirium Prediction. ArXiv abs/2211.04442 (2022).                                                                                                                                                                                                                               |
| [92]   | Angelina Wang, Vikram V Ramaswamy, and Olga Russakovsky. 2022. To- wards Intersectionality in Machine Learning: Including More Identities, Han- dling Underrepresentation, and Performing Evaluation. In 2022 ACM Confer- ence on Fairness, Accountability, and Transparency (Seoul, Republic of Korea) (FAccT '22) . Association for Computing Machinery, New York, NY, USA, 336-349. https://doi.org/10.1145/3531146.3533101 |
| [93]   | Angelina Wang, Vikram V. Ramaswamy, and Olga Russakovsky. 2022. Towards Intersectionality in Machine Learning: Including More Identities, Handling Un- derrepresentation, and Performing Evaluation. 2022 ACM Conference on Fairness, Accountability, and Transparency (2022).                                                                                                                                                 |
| [94]   | Zeerak Waseem, Joachim Bingel, and Isabelle Augenstein. 2021. Disembodied Machine Learning: On the Illusion of Objectivity in NLP. ArXiv abs/2101.11974 (2021).                                                                                                                                                                                                                                                                |
| [95]   | Ke Yang, Biao Huang, Julia Stoyanovich, and Sebastian Schelter. 2020. Fairness- Aware Instrumentation of Preprocessing Pipelines for Machine Learning.                                                                                                                                                                                                                                                                         |
| [96]   | Ke Yang, Joshua R. Loftus, and Julia Stoyanovich. 2020. Causal intersectionality                                                                                                                                                                                                                                                                                                                                               |

## APPENDIX

## A TAGGING FOR INTERSECTIONALITY LITERATURE

Initially, we only tagged works as incorporating intersectionality literature when they included Collins and Bilge [29], Crenshaw [35], Hancock [53], or Cho et al. [22]. However, during our weekly discussions, we noticed that papers cited a wider array of intersectionality works; either other works by these same authors, or other scholars who center intersectionality within critical disciplines. Because we want to gauge how AI fairness conceptualizes intersectionality, casting a wider net on tags is valuable in that we can include works that, while unaware of our initial list of texts, state intersectionality as a motivation in their work and cite other works about intersectionality like [26], [30], [27], or [36]. As a result, we tag the presence of intersectionality literature if any paper includes works that: 1) discuss intersectionality outside of CS and 2) frames intersectionality as a critical social inquiry and praxis framework.

## B GUIDING QUESTIONS AND CONSIDERATIONS

We chose to create 3-4 guiding questions per tenet in order to balance in-depth coverage of each tenet with annotation feasibility. We share all our guiding questions in Table 2. While some guiding questions are straightforward (e.g., 'Do the authors consider cross-sectional social categories?'), others are more up to our interpretation and experiences (e.g., 'Are there any discussions on how spaces operate at different domains of power?'). Our interpretation of the intersectionality tenets for advancing justice in AI fairness is influenced by our social context and location, including our formal AI training, social identities, and experienced social inequalities (§1). For instance, we (the investigators) are all trans and people of color, and hence were likely more attuned to the discussion in Kong [66] of power differentials in 'regular' experiences, e.g., going through airport security.

## C ANNOTATION METHODOLOGY

We follow Lincoln and Guba's 1981 model of trustworthiness in our analysis [76], taking steps to maximize its credibility, dependability, confirmability, and transferability.

- Credibility: We are highly familiar with Collins and Bilge's tenets. We also engaged in in-depth intersectionality intensives hosted by Black feminist scholars. Furthermore, we all have done justice work in some capacity. The majority of authors on this paper are trans people of color operating in AI. One author is a social scientist who confronts social inequities in their scholarship through intersectional perspectives. We spent over 6 months developing the guiding questions.
- Dependability: 11 out of the 30 papers were evaluated by three annotators, and we present our tenet-level interannotater agreement for these papers in Table 3. The scores in Table 3 indicate moderate to high interannotator agreement. The remaining 19 papers were each evaluated by at least 1 annotator.
- Confirmability: During weekly investigator meetings, we discussed our guiding questions and identified major sources of disagreement in our annotations.
- Transferability: Our guiding questions can be operationalized across paper types and domains outside of academia.

## D MEASURING INTERANNOTATOR AGREEMENT

We use Randolph's 𝜅 to estimate inter-annotator agreement, which is free-marginal rather than fixed-marginal; we choose this because 𝜅 is computed over six distinct items (i.e., tenets).

Table 2: Collins and Bilge's tenets of intersectionality and our corresponding guiding questions

| Tenet             | Guiding Questions                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Social inequality | 1) Do the authors ground their work in how specific social or historical contexts factor into social inequality? 2) Do the authors acknowledge the implications of their work with respect to social inequality? 3) Is there a discussion of how intersecting power relations produce social inequality?                                                                            |
| Social power      | 1) Do the authors mention power? 2) Do the authors discuss any movement of power to the powerless? 3) Do the authors mention the mutual construction of power? 4) Is their own power in the work named or do the authors reflexively comment on the oppressive power relations within which their work participates?                                                                |
| Social Context    | 1) Do the authors name their social context or social location with respect to their work? 2) Do the authors discuss how their social context influences their ideas and work's design, decisions, and development? 3) Do they acknowledge the limitations of their contexts?                                                                                                       |
| Relationality     | 1) Do the authors discuss the relationships between either social groups or structures? 2) Do the authors engage with how different social groups, typically treated as separate, face shared oppression? 3) Do the authors comment on how their identities shape their inquiry in relation to the people affected by their work?                                                   |
| Complexity        | 1) Do the authors consider cross-sectional social categories? 2) Do they involve those without power in the generation and social construction of new knowledge? 3) Do the authors comment on the interplay between technical interventions and social action, or critical inquiry and practice? 4) Are there any discussions on how spaces operate at different domains of power ? |
| Social justice    | 1) Do the authors state their commitment or motivation as social justice? 2) Do the authors discuss ways in which fair predictions or rules are not equally applied to everyone and can still produce unfair and unequal outcomes? 3) Do authors aim to dismantle a form of injustice, rather than solely documenting it in the form of a paper?                                    |

Table 3: Tenet-level interannotator scores by Randolph's 𝜅 and % agreement

| Paper                         |      𝜅 |   % agreement |
|-------------------------------|--------|---------------|
| Wang et al. [93]              | 1      |        100    |
| Foulds et al. [45]            | 1      |        100    |
| Kong [66]                     | 0.7778 |         83.33 |
| Foulds and Pan [46]           | 1      |        100    |
| Rogerson and Fitzsimmons [81] | 0.5556 |         66.67 |
| Kobayashi and Nakao [65]      | 0.5556 |         66.67 |
| Kirk et al. [62]              | 0.5556 |         66.67 |
| Buolamwini and Gebru [17]     | 1      |        100    |
| Ghosh et al. [49]             | 0.5556 |         66.67 |
| Kasy and Abebe [59]           | 0.7778 |         83.33 |
| Molina and Loiseau [73]       | 0.7778 |         83.33 |
| Average:                      | 0.7778 |         83.33 |

Table 4: Papers with AI fairness research methodology tags

|   ID | Paper                         | Source Bias   | of Intersectonality Opera- tionalization   | CS Paper Type                         | Synergy   |
|------|-------------------------------|---------------|--------------------------------------------|---------------------------------------|-----------|
|    1 | Wang et al. [93]              | statistical   | full pipeline                              | empirical                             | yes       |
|    2 | Foulds et al. [45]            | statistical   | in-processing                              | theoretical, engineer- ing, empirical | no        |
|    3 | Kong [66]                     | systemic      | processes                                  | other                                 | yes       |
|    4 | Lalor et al. [68]             | both          | post-processing                            | empirical                             | no        |
|    5 | Foulds and Pan [46]           | both          | in-processing                              | theoretical, engineer- ing, empirical | yes       |
|    6 | Rogerson and Fitzsimmons [81] | systemic      | post-processing                            | empirical                             | yes       |
|    7 | Suresh et al. [87]            | systemic      | processes, full pipeline                   | empirical                             | yes       |
|    8 | Klumbyte et al. [64]          | systemic      | processes                                  | empirical, other                      | yes       |
|    9 | Kobayashi and Nakao [65]      | statistical   | full pipeline                              | engineering, empiri- cal              | no        |
|   10 | Kirk et al. [62]              | both          | post-processing                            | empirical                             | no        |
|   11 | Kim et al. [61]               | both          | post-processing                            | empirical                             | no        |
|   12 | Yang et al. [96]              | both          | full pipeline                              | theoretical, engineer- ing, empirical | no        |
|   13 | Buolamwini and Ge- bru [17]   | statistical   | pre-processing, processes                  | engineering, empiri- cal              | yes       |
|   14 | Fitzsimons et al. [44]        | statistical   | in-processing                              | theoretical, engineer- ing, empirical | no        |
|   15 | Ghosh et al. [49]             | systemic      | post-processing, processes                 | theoretical, empirical                | yes       |
|   16 | Davis et al. [37]             | systemic      | processes                                  | theoretical                           | yes       |
|   17 | Steed and Caliskan [85]       | both          | post-processing                            | empirical                             | yes       |
|   18 | Mitchell et al. [71]          | systemic      | processes                                  | other                                 | yes       |
|   19 | Kasy and Abebe [59]           | systemic      | post-processing, processes                 | theoretical, empirical                | yes       |
|   20 | Cabrera et al. [18]           | statistical   | post-processing                            | engineering, empiri- cal              | no        |
|   21 | Kang et al. [57]              | statistical   | in-processing                              | theoretical, engineer- ing, empirical | no        |
|   22 | Jin et al. [55]               | statistical   | pre-processing                             | engineering                           | no        |
|   23 | Mhasawade et al. [70]         | both          | processes                                  | other                                 | yes       |
|   24 | Camara et al. [19]            | both          | post-processing                            | empirical                             | yes       |
|   25 | Yang et al. [95]              | statistical   | full pipeline                              | engineering, empiri- cal              | no        |
|   26 | Molina and Loiseau [73]       | statistical   | pre-processing                             | theoretical, engineer- ing, empirical | no        |
|   27 | Tripathi et al. [91]          | both          | pre-processing                             | empirical                             | yes       |
|   28 | Mougán et al. [74]            | systemic      | pre-processing                             | theoretical, empirical                | no        |
|   29 | Finocchiaro et al. [43]       | systemic      | processes                                  | other                                 | yes       |
|   30 | Makhlouf et al. [69]          | systemic      | post-processing                            | other                                 | no        |

Table 5: Papers with intersectionality-related reference tags

|   ID | Paper                         | Cites Intersectionality Literature   | Says 'Intersectional'   | Says 'Intersectionality'   |
|------|-------------------------------|--------------------------------------|-------------------------|----------------------------|
|    1 | Wang et al. [93]              | Yes                                  | Yes                     | Yes                        |
|    2 | Foulds et al. [45]            | Yes                                  | Yes                     | Yes                        |
|    3 | Kong [66]                     | Yes                                  | Yes                     | Yes                        |
|    4 | Lalor et al. [68]             | No                                   | Yes                     | Yes                        |
|    5 | Foulds and Pan [46]           | Yes                                  | Yes                     | Yes                        |
|    6 | Rogerson and Fitzsimmons [81] | Yes                                  | Yes                     | Yes                        |
|    7 | Suresh et al. [87]            | Yes                                  | Yes                     | Yes                        |
|    8 | Klumbyte et al. [64]          | Yes                                  | Yes                     | Yes                        |
|    9 | Kobayashi and Nakao [65]      | Yes                                  | Yes                     | Yes                        |
|   10 | Kirk et al. [62]              | Yes                                  | Yes                     | Yes                        |
|   11 | Kim et al. [61]               | No                                   | Yes                     | No                         |
|   12 | Yang et al. [96]              | Yes                                  | Yes                     | Yes                        |
|   13 | Buolamwini and Gebru [17]     | No                                   | Yes                     | Yes                        |
|   14 | Fitzsimons et al. [44]        | Yes                                  | Yes                     | Yes                        |
|   15 | Ghosh et al. [49]             | Yes                                  | Yes                     | Yes                        |
|   16 | Davis et al. [37]             | Yes                                  | Yes                     | Yes                        |
|   17 | Steed and Caliskan [85]       | Yes                                  | Yes                     | Yes                        |
|   18 | Mitchell et al. [71]          | Yes                                  | Yes                     | Yes                        |
|   19 | Kasy and Abebe [59]           | Yes                                  | Yes                     | No                         |
|   20 | Cabrera et al. [18]           | No                                   | Yes                     | Yes                        |
|   21 | Kang et al. [57]              | No                                   | Yes                     | No                         |
|   22 | Jin et al. [55]               | No                                   | Yes                     | No                         |
|   23 | Mhasawade et al. [70]         | Yes                                  | No                      | Yes                        |
|   24 | Camara et al. [19]            | Yes                                  | Yes                     | Yes                        |
|   25 | Yang et al. [95]              | Yes                                  | Yes                     | Yes                        |
|   26 | Molina and Loiseau [73]       | Yes                                  | Yes                     | Yes                        |
|   27 | Tripathi et al. [91]          | No                                   | No                      | Yes                        |
|   28 | Mougán et al. [74]            | Yes                                  | Yes                     | Yes                        |
|   29 | Finocchiaro et al. [43]       | No                                   | Yes                     | Yes                        |
|   30 | Makhlouf et al. [69]          | Yes                                  | No                      | Yes                        |