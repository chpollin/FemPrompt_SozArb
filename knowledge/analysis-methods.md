---
title: Analysis Methods
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
version: "0.7"
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
topics: ["[[Scoping Review]]", "[[Evidence Synthesis]]", "[[Inter-rater Reliability]]"]
related: [methods, standards, analysis-divergence, analysis-sq-advisory, update-protocol, research-vault, governance, verification, plan]
---

# Analysis Methods

The literature corpus is analysed in two layers, a descriptive mapping of the field and an interpretive synthesis over source-linked Assertions. The analyses are ordered in three tiers by the evidence they require. Every figure carries the statistical reservations stated below, and LLM-assisted analysis supports a scholarly claim only after validation against a human reference. The conducted chain up to coding is in [[methods]], the coding fields in [[update-protocol#Analysis coding]] and the analytical scope selected on 22 September 2026 in [[research-vault#Comparative synthesis scope]].

## Methodological frame

### Mapping layer

The mapping layer follows the JBI methodology for scoping reviews (Peters et al. 2020) and is reported by PRISMA-ScR (Tricco et al. 2018). JBI guidance names charting, frequency counts and tabular or graphical presentation as the analysis forms of a scoping review, with basic qualitative content analysis where categories have to be derived from text (Pollock et al. 2023). Evidence-and-gap maps present the coded Works as a matrix of two coded dimensions whose cells hold the contributing Works (Snilstveit et al. 2016; White et al. 2020). Mapping reviews, scoping reviews and evidence-and-gap maps belong to one family of reviews that describe a field instead of answering an effect question (Campbell et al. 2023).

The fit of this layer with the research questions is an inference from their wording. SQ1 to SQ3 ask which prompting techniques, bias axes, mitigations and social-work contexts the literature addresses and with which evidence status. These are mapping questions before they become synthesis questions.

PRISMA 2020 and PRISMA-trAIce remain the reporting basis recorded in [[standards]]. PRISMA-trAIce is formulated as an extension of PRISMA 2020, and its AI disclosure items describe tool use independently of the review type. Reporting the mapping layer by PRISMA-ScR therefore adds a checklist and keeps the recorded conformance work. [[standards]] does not yet list PRISMA-ScR as an applied standard, and the combination needs to be recorded there when the frame is adopted.

### Synthesis layer

The synthesis layer works on Assertions, the atomic source-linked statements of the Grounded Vault ([[research-vault]]). Best-fit framework synthesis is the primary method (Carroll et al. 2011, 2013). It codes the evidence against an a priori framework and builds new themes from evidence that the framework does not accommodate. The ten categories in `assessment/categories.yaml` and the frozen analysis vocabularies supply the a priori framework. That they can serve this role is an inference from their construction as closed vocabularies fixed before the full coding. Evidence that fits none of their values becomes the material for new themes, which keeps the confirmed framework and the emergent content apart.

Conceptual questions need an interpretive layer above the framework, for example how bias, fairness or AI literacy are constituted differently in technical, social-work and feminist literatures. Two methods qualify for this layer.

- Critical interpretive synthesis treats the literature itself as an object of critique and develops synthesising constructs across heterogeneous sources (Dixon-Woods et al. 2006).
- Meta-narrative review reconstructs how separate research traditions have framed a topic and is reported by the RAMESES standard (Greenhalgh et al. 2005; Wong et al. 2013).

The choice between them is open for the project lead. Critical interpretive synthesis suits a corpus whose disciplinary traditions are not yet delimited, while meta-narrative review presupposes traditions that can be identified and followed. This contrast is an inference from the method descriptions.

Thematic synthesis (Thomas and Harden 2008), reported by ENTREQ (Tong et al. 2012), applies only to the empirical subset of qualitative primary studies, because it presupposes findings extracted from primary research. Realist synthesis asks what works for whom under which circumstances (Pawson et al. 2005). It belongs to practice recommendations, which require a separate decision and an appraisal of study quality and transfer conditions ([[research-vault#Comparative synthesis scope]]).

## Answering the research questions

The research questions in [[project#Research questions]] are answered in two layers. A descriptive map shows from coded fields where the literature addresses a topic, where it does not, and where coding is still open. Source-linked Assertions carry everything a code cannot state, which includes benefits, effects, conditions, limitations and competences. A map cell means that codes occur jointly in the same Work. It states no relation between them.

| Question | Map from coded fields | Assertions and synthesis | Current limits |
|---|---|---|---|
| SQ1 Use | Population or setting, prompting role (recommended practice), a task field once a codebook amendment adds it | Reported benefits with task, setting, conditions and limitations | No task field exists. Much of the coded literature is not specific to social work, which is a finding only once coding is complete. Task literature without a bias focus may be underrepresented because identification centred on bias and gender. |
| SQ2 Risks | Bias axes, harm types and populations, jointly coded | Harm mechanisms and affected groups with their study conditions | Answerable with the current codebook. Two isolated agent tracks often disagree on harm types and bias axes, so the vocabulary needs sharper definitions and anchor examples before the full coding run. |
| SQ3 Practices | Prompt techniques, prompting role, mitigation stage and status | Reported effects, conditions and limitations of evaluated and demonstrated practices | Mitigation status is one value per Work, so a status cannot be attributed to a single technique or stage. Intervention-status pairs require a codebook amendment. |
| SQ4 Competences | Organisational mitigation stage and learning content as prompting role, eligibility category AI literacies | Best-fit framework synthesis against the working definition of feminist AI literacies and a named external framework of general prompt guidance | The external framework has to be named before synthesis. Comparing the corpus with the project's own prompt formula would make the gap self-referential. |

Across all questions the answer is limited by the coverage of coding. Every view and every text states how many included Works are coded for the fields it uses. An empty cell with open Works is not determinable and never a gap in the literature. What the literature recommends is reported as the recommendation of its source, never as a recommendation of the project ([[project#Project goal]]).

## Analysis plan

### Tier 1, analyses on the current data

Each figure is computed at Work level from committed data by an executable script and names its producer, which is the consolidated round-one expert annotation, the round-one LLM assessment, a governed agent track or a domain-expert verification. Figures of different producers are not pooled.

- Every table states its Work-level denominator and the lifecycle state of the contributing records. It keeps missing coding apart from coded absence, as the [completion package](../generated/completion/README.md) already does for the SQ tables.
- The analysis fields of [[update-protocol#Analysis coding]] are charted per Work together with their coding basis.
- Category and analysis-value prevalences are reported with Wilson score intervals (Wilson 1927), separately per producer track. The interval states the precision of a proportion under repeated sampling, an assumption the corpus satisfies only in a qualified sense (see [[#Statistical reservations]]).
- Evidence-and-gap maps for SQ1 to SQ3 cross bias axes or harm types with mitigation stage and evidence status, and populations with prompting role. Each cell lists its contributing Works and separates the states not coded and not addressed.
- The round-one agreement report extends the existing replay output to the confusion matrix, raw agreement, positive and negative specific agreement (Cicchetti and Feinstein 1990), the prevalence and bias indices (Byrt et al. 1993), Cohen's kappa and Krippendorff's alpha with confidence intervals (Hayes and Krippendorff 2007), and the AC1 coefficient as a sensitivity analysis (Gwet 2008). High raw agreement can coexist with a low kappa under skewed prevalence or unequal marginals (Feinstein and Cicchetti 1990), and every index rests on its own assumption about chance agreement (Zhao et al. 2013). The report describes the comparison of two documented products, the consolidated expert annotation and the LLM assessment. It reports no error rate, because round one has no inter-expert reference ([[analysis-divergence]]).
- Best-fit framework synthesis begins on Assertions whose evidence has been checked. Each synthesis statement retains the lifecycle state of its supporting Assertions ([[update-protocol#Lifecycle and authority]]).

### Tier 2, analyses after complete expert-verified coding

Tier 2 requires a coding of the intended corpus that domain experts have verified, and a human reference against which agent coding can be measured.

- A stratified random sample of Works is coded blind and independently by two domain experts, followed by consensus. The sample size follows the expected agreement and the required precision of the coefficient (Sim and Wright 2005). Strata cover round, decision and category, and the sample overrepresents the gender, feminist, diversity and bias categories for the reason given in [[#Validation of LLM-assisted analysis]].
- PRISM shows the round-one expert decision and the round-one LLM proposal as references in every human session and has no blind mode (ADR-038 in [[specification]]). Reference coding in this view would expose the coders to anchoring and automation bias (Goddard et al. 2012). The reference sample therefore needs a session mode that hides the round-one references and the agent coding, which is a tool decision against the current ADR-038 contract.
- Round-two agreement is measured between the agent coding and the human reference with the Tier 1 statistic set. Disagreements receive an error typology that starts from the round-one divergence patterns of Semantic Expansion, Implicit Field Membership and Keyword Inclusion ([[analysis-divergence#Divergence patterns]]). Against a human-human reference, the term error becomes defensible for the first time.
- Associations between categories and analysis values are estimated as odds ratios with Fisher's exact test and Benjamini-Hochberg control of the false discovery rate (Benjamini and Hochberg 1995). Zero cells receive Firth's bias-reduced estimation (Firth 1993) or a continuity correction of one half per cell. Each association is computed on the Includes and on the full screened set, because the Include decision is derived from category combinations (see [[#Statistical reservations]]).
- Multiple correspondence analysis describes the joint structure of the categorical codes (Greenacre 2017). Latent class analysis serves only as a sensitivity analysis, with the number of classes chosen by the criteria compared in Nylund et al. (2007).
- When domain-expert verification covers only part of the corpus, design-based supervised learning (Egami et al. 2023) or prediction-powered inference (Angelopoulos et al. 2023) combine the verified subset with the agent coding into estimates with valid intervals. Both methods require that the verified subset is drawn with known selection probabilities. The current verification scope covers the 2026 intake and the agent-coded records by assignment, not by random draw ([[plan#Provenance and verification alignment]]). A random verification sample would therefore have to be drawn in addition. This requirement is an inference from the method assumptions.

### Tier 3, exploratory analyses with mandatory validation

Tier 3 analyses answer a stated exploratory question. A result enters the synthesis only as an Assertion with source evidence, as [[plan#Analysis and Assertions]] already requires for topic models.

- Keyness analysis compares the terminology of disciplinary subcorpora by frequency profiling (Rayson and Garside 2000), read together with the source passages in the manner of corpus-assisted discourse analysis (Baker et al. 2008).
- Bibliographic coupling (Kessler 1963) shows which disciplines draw on shared references, computed with established tools (Aria and Cuccurullo 2017; van Eck and Waltman 2010). It depends on complete and normalised reference lists for the corpus Works.
- Embedding maps built from sentence embeddings (Reimers and Gurevych 2019) serve only as navigation. Projection to two dimensions distorts distances and neighbourhoods so strongly that the visible clusters carry no analytical weight (Chari and Pachter 2023).
- Topic models, either structural topic models (Roberts et al. 2014) or BERTopic (Grootendorst 2022), require stability checks across runs and human validation of topics as measures (Chang et al. 2009; Ying et al. 2022). Automated coherence scores do not substitute for that validation (Hoyle et al. 2021). Computational grounded theory provides the procedure for moving between computational pattern and close reading (Nelson 2020).
- Controlled experiments test the source-grounded AI Agent Review for position effects in the order of the two tracks, for preference by model family and for the influence of visible metadata, by permuting the order, varying the reviewing model and masking authors and venues. The design follows documented biases of LLM evaluators (Zheng et al. 2023; Wang et al. 2024; Panickssery et al. 2024) and of LLM review of scholarly abstracts (von Wedel et al. 2024).

## Statistical reservations

- The corpus is no probability sample. It results from deep research systems, manual search and dated supplements ([[methods]]). Prevalences describe the corpus, and an interval describes precision under a hypothetical resampling of a comparable corpus. A statement about the literature at large requires an argument about coverage that the statistics do not supply.
- The Include decision is derived from the joint levels of the technology and the social dimension. Among Includes, categories of the two dimensions are therefore selected jointly, which can create or mask associations between them (Berkson 1946). Associations computed on the full screened set serve as the comparison.
- Skewed category prevalence depresses kappa independently of the agreement pattern. The report therefore states raw and specific agreement and the prevalence and bias indices beside every coefficient.
- Round one has no inter-expert baseline. Divergence between its two products is reported as divergence ([[analysis-divergence#Interpretation limits]]).
- The two governed agent tracks come from the same model environment. Their agreement is a workflow diagnostic and no estimate of reliability or accuracy ([[update-protocol#Source-grounded AI Agent Review]]).
- Many category pairs are tested at once. Tier 2 associations therefore carry false-discovery control, and Tier 3 results carry the label exploratory.
- An uncoded field is not evidence that the literature leaves a topic unaddressed. Gap statements rest on coded absence only.
- Records, Works and publication Versions are distinct units. Prevalences count Works, and evidence retains the exact Version ([[data]]).

## Validation of LLM-assisted analysis

The evidence on LLM annotation is mixed and task-dependent. LLMs outperformed crowd workers on several text annotation tasks (Gilardi et al. 2023). On classification benchmarks of computational social science they reached fair agreement with humans without matching fine-tuned models, and their authors recommend them as members of human annotation teams (Ziems et al. 2024). In systematic reviews, GPT-4 appeared on par with humans in some tasks until chance agreement and dataset imbalance were adjusted for (Khraisha et al. 2024). A proof-of-concept study found high extraction accuracy on a small convenience sample (Gartlehner et al. 2024), while a scoping review judged LLMs for systematic reviews not yet ready for use (Lieberum et al. 2025). Annotation practice requires validation against human coding, prompt stability checks and documented model versions (Törnberg 2024; Barrie et al. 2024). Proprietary models limit reproducibility because providers can change or withdraw them (Ollion et al. 2024).

The project draws the following validation design from this evidence.

1. An agent result supports a scholarly claim only after comparison with the human reference of Tier 2 or after domain-expert verification of the specific field or statement ([[governance#Verification scope decision, 22 September 2026]]).
2. The reference sample overrepresents the gender, feminist, diversity and bias categories. LLMs reproduce gender stereotypes (Kotek et al. 2023), and language-derived representations carry human-like biases (Caliskan et al. 2017). The categories in which an LLM coder is most likely to err systematically are therefore the categories this review studies. This circularity is a field condition ([[methods#Circularity as a field condition]]), and the sample design is the inference drawn from it.
3. Assertions are checked as atomic statements against their source passages. Decomposition into atomic facts makes factual precision measurable statement by statement (Min et al. 2023). Every cited source is checked for existence and identity, because LLM-generated citations are frequently fabricated or erroneous (Walters and Wilder 2023). Source locators are checked independently of their position in long inputs, because retrieval from long contexts degrades for material in the middle (Liu et al. 2024).
4. Prompt, model, version and input are recorded per run, and classification prompts receive a stability check across paraphrased variants (Barrie et al. 2024).
5. Corpus-level estimates from partially verified coding use the estimators of Tier 2.

## Appraisal for practice recommendations

Study appraisal is required only if the project decides to derive practice recommendations ([[research-vault#Comparative synthesis scope]]). The current state of appraisal is recorded in [[methods#Quality assessment]]. The appraisal tools are assigned by source type.

- Empirical qualitative, quantitative and mixed-methods studies are appraised with the Mixed Methods Appraisal Tool, version 2018 (Hong et al. 2018).
- Narrative, expert opinion and policy texts are appraised with the three JBI tools for textual evidence (McArthur et al. 2025).
- Grey literature is appraised with the AACODS checklist (Tyndall 2010).
- The design-specific CASP checklists serve where a single study design dominates a subset (Critical Appraisal Skills Programme n.d.).
- Technical bias benchmarks are appraised with a project-specific scheme derived from two critiques of bias research in natural language processing. The first asks whether a study states its conception of bias, the harm it addresses and its normative reasoning (Blodgett et al. 2020). The second identifies pitfalls in benchmark construction that threaten construct validity (Blodgett et al. 2021). The scheme is a project construction and has to be piloted and documented before use.

## Open methodological disputes

- Thematic analysis in scoping reviews. Pollock et al. (2023) restrict scoping-review analysis to descriptive forms and basic qualitative content analysis and regard thematic approaches as exceeding a scoping review. Levac et al. (2010) recommend a qualitative thematic analysis as part of the reporting stage. The two-layer frame assigns content analysis to the mapping layer and interpretive work to the synthesis layer, which accommodates both positions without resolving them.
- Agreement coefficients under skewed prevalence. Kappa, alpha and AC1 rest on different chance models, and each has documented failure cases (Feinstein and Cicchetti 1990; Gwet 2008; Hayes and Krippendorff 2007; Zhao et al. 2013). No coefficient is neutral, which is why the report states several with their assumptions.
- Reliability in qualitative research. McDonald et al. (2019) argue that inter-rater reliability fits only some qualitative approaches, while O'Connor and Joffe (2020) defend intercoder reliability as a means of transparency and rigour. The project codes with closed vocabularies, for which agreement is meaningful. The interpretive synthesis is not measured by agreement. This division is an inference from the coding design.
- Inference on non-random corpora. Whether intervals and tests carry meaning for a corpus that is no probability sample remains contested. The project uses them as precision statements under explicit assumptions and makes no claims about the literature at large from them.
- Generative AI in reflexive qualitative research. Jowsey et al. (2025) reject generative AI for reflexive qualitative approaches as methodologically incongruent and on grounds of social and environmental justice. De Paoli (2026) and Ibrahim et al. (2026) reject a categorical exclusion, the latter proposing technological reflexivity as a guide for use. The project lets agents prepare evidence and assigns interpretation and verification to domain experts ([[governance]]). Under the rejecting position, even this preparatory role would remain incongruent for the interpretive synthesis layer. The conflict persists.
- Readiness of LLMs in evidence synthesis. Lieberum et al. (2025) find them not yet ready, while task-level studies report usable performance under specific conditions (Gartlehner et al. 2024; Khraisha et al. 2024). RAISE permits use when authors can demonstrate that it does not compromise methodological rigour ([[standards]]).
- Status of PRISMA-trAIce. Its authors present it as a proposal that has not passed a Delphi or consensus process (Holst et al. 2025). It is cited as a proposed extension ([[standards]]).

## Implementation state

The project already implements part of this plan.

- The round-one replay computes the decision and category matrices, Cohen's kappa, prevalence-adjusted kappa, maximum kappa and the prevalence and bias indices, together with the content-only subset and the condition contrast ([[methods#Round-one replay verification]], [[analysis-divergence]]).
- The conformance map records the item status against PRISMA 2020, PRISMA-trAIce and RAISE ([[standards]]).
- The completion package projects Work-level SQ tables with explicit missing coding and a provisional synthesis outline ([completion package](../generated/completion/README.md)).
- Committed scripts derive the process diagnostics of the governed agent workflow ([[update-protocol#Process diagnostics]]).
- An advisory SQ analysis over historical distillates provides hypotheses for schema refinement ([[analysis-sq-advisory]]).

Not yet implemented are the interval estimates, specific agreement, Krippendorff's alpha and the AC1 coefficient, the evidence-and-gap maps, the association analyses, the blind reference mode, the estimators for partial verification and all Tier 3 analyses. Each analysis script is documented in [[methods]] when it is built.

## Sources

- Angelopoulos, A. N., Bates, S., Fannjiang, C., Jordan, M. I., & Zrnic, T. (2023). Prediction-powered inference. *Science*, 382(6671), 669–674. https://doi.org/10.1126/science.adi6000
- Aria, M., & Cuccurullo, C. (2017). bibliometrix: An R-tool for comprehensive science mapping analysis. *Journal of Informetrics*, 11(4), 959–975. https://doi.org/10.1016/j.joi.2017.08.007
- Baker, P., Gabrielatos, C., KhosraviNik, M., Krzyżanowski, M., McEnery, T., & Wodak, R. (2008). A useful methodological synergy? Combining critical discourse analysis and corpus linguistics to examine discourses of refugees and asylum seekers in the UK press. *Discourse & Society*, 19(3), 273–306. https://doi.org/10.1177/0957926508088962
- Barrie, C., Palaiologou, E., & Törnberg, P. (2024). Prompt stability scoring for text annotation with large language models. arXiv preprint. https://doi.org/10.48550/arXiv.2407.02039
- Benjamini, Y., & Hochberg, Y. (1995). Controlling the false discovery rate: A practical and powerful approach to multiple testing. *Journal of the Royal Statistical Society Series B*, 57(1), 289–300. https://doi.org/10.1111/j.2517-6161.1995.tb02031.x
- Berkson, J. (1946). Limitations of the application of fourfold table analysis to hospital data. *Biometrics Bulletin*, 2(3), 47–53. https://doi.org/10.2307/3002000
- Blodgett, S. L., Barocas, S., Daumé III, H., & Wallach, H. (2020). Language (technology) is power: A critical survey of "bias" in NLP. In *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics* (pp. 5454–5476). https://doi.org/10.18653/v1/2020.acl-main.485
- Blodgett, S. L., Lopez, G., Olteanu, A., Sim, R., & Wallach, H. (2021). Stereotyping Norwegian salmon: An inventory of pitfalls in fairness benchmark datasets. In *Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing* (pp. 1004–1015). https://doi.org/10.18653/v1/2021.acl-long.81
- Byrt, T., Bishop, J., & Carlin, J. B. (1993). Bias, prevalence and kappa. *Journal of Clinical Epidemiology*, 46(5), 423–429. https://doi.org/10.1016/0895-4356(93)90018-V
- Caliskan, A., Bryson, J. J., & Narayanan, A. (2017). Semantics derived automatically from language corpora contain human-like biases. *Science*, 356(6334), 183–186. https://doi.org/10.1126/science.aal4230
- Campbell, F., Tricco, A. C., Munn, Z., Pollock, D., Saran, A., Sutton, A., White, H., & Khalil, H. (2023). Mapping reviews, scoping reviews, and evidence and gap maps (EGMs): The same but different, the "Big Picture" review family. *Systematic Reviews*, 12, 45. https://doi.org/10.1186/s13643-023-02178-5
- Carroll, C., Booth, A., & Cooper, K. (2011). A worked example of "best fit" framework synthesis: A systematic review of views concerning the taking of some potential chemopreventive agents. *BMC Medical Research Methodology*, 11, 29. https://doi.org/10.1186/1471-2288-11-29
- Carroll, C., Booth, A., Leaviss, J., & Rick, J. (2013). "Best fit" framework synthesis: Refining the method. *BMC Medical Research Methodology*, 13, 37. https://doi.org/10.1186/1471-2288-13-37
- Chang, J., Gerrish, S., Wang, C., Boyd-Graber, J. L., & Blei, D. M. (2009). Reading tea leaves: How humans interpret topic models. In *Advances in Neural Information Processing Systems 22*. https://papers.nips.cc/paper/2009/hash/f92586a25bb3145facd64ab20fd554ff-Abstract.html
- Chari, T., & Pachter, L. (2023). The specious art of single-cell genomics. *PLOS Computational Biology*, 19(8), e1011288. https://doi.org/10.1371/journal.pcbi.1011288
- Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II. Resolving the paradoxes. *Journal of Clinical Epidemiology*, 43(6), 551–558. https://doi.org/10.1016/0895-4356(90)90159-M
- Critical Appraisal Skills Programme (n.d.). CASP checklists. https://casp-uk.net/casp-tools-checklists/ (accessed 2026-10-01)
- De Paoli, S. (2026). Why we should reject to reject the use of generative artificial intelligence in qualitative analysis: A response to Jowsey, Braun, Clarke, Lupton, and Fine (2025). *Qualitative Inquiry*, online first. https://doi.org/10.1177/10778004261425137
- Dixon-Woods, M., Cavers, D., Agarwal, S., Annandale, E., Arthur, A., Harvey, J., Hsu, R., Katbamna, S., Olsen, R., Smith, L., Riley, R., & Sutton, A. J. (2006). Conducting a critical interpretive synthesis of the literature on access to healthcare by vulnerable groups. *BMC Medical Research Methodology*, 6, 35. https://doi.org/10.1186/1471-2288-6-35
- Egami, N., Hinck, M., Stewart, B. M., & Wei, H. (2023). Using imperfect surrogates for downstream inference: Design-based supervised learning for social science applications of large language models. In *Advances in Neural Information Processing Systems 36*. https://doi.org/10.48550/arXiv.2306.04746
- Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The problems of two paradoxes. *Journal of Clinical Epidemiology*, 43(6), 543–549. https://doi.org/10.1016/0895-4356(90)90158-L
- Firth, D. (1993). Bias reduction of maximum likelihood estimates. *Biometrika*, 80(1), 27–38. https://doi.org/10.1093/biomet/80.1.27
- Gartlehner, G., Kahwati, L., Hilscher, R., Thomas, I., Kugley, S., Crotty, K., Viswanathan, M., Nussbaumer-Streit, B., Booth, G., Erskine, N., Konet, A., & Chew, R. (2024). Data extraction for evidence synthesis using a large language model: A proof-of-concept study. *Research Synthesis Methods*, 15(4), 576–589. https://doi.org/10.1002/jrsm.1710
- Gilardi, F., Alizadeh, M., & Kubli, M. (2023). ChatGPT outperforms crowd workers for text-annotation tasks. *Proceedings of the National Academy of Sciences*, 120(30), e2305016120. https://doi.org/10.1073/pnas.2305016120
- Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias: A systematic review of frequency, effect mediators, and mitigators. *Journal of the American Medical Informatics Association*, 19(1), 121–127. https://doi.org/10.1136/amiajnl-2011-000089
- Greenacre, M. (2017). *Correspondence analysis in practice* (3rd ed.). Chapman and Hall/CRC. https://doi.org/10.1201/9781315369983
- Greenhalgh, T., Robert, G., Macfarlane, F., Bate, P., Kyriakidou, O., & Peacock, R. (2005). Storylines of research in diffusion of innovation: A meta-narrative approach to systematic review. *Social Science & Medicine*, 61(2), 417–430. https://doi.org/10.1016/j.socscimed.2004.12.001
- Grootendorst, M. (2022). BERTopic: Neural topic modeling with a class-based TF-IDF procedure. arXiv preprint. https://doi.org/10.48550/arXiv.2203.05794
- Gwet, K. L. (2008). Computing inter-rater reliability and its variance in the presence of high agreement. *British Journal of Mathematical and Statistical Psychology*, 61(1), 29–48. https://doi.org/10.1348/000711006X126600
- Hayes, A. F., & Krippendorff, K. (2007). Answering the call for a standard reliability measure for coding data. *Communication Methods and Measures*, 1(1), 77–89. https://doi.org/10.1080/19312450709336664
- Holst, D., Moenck, K., Koch, J., Schmedemann, O., & Schüppstuhl, T. (2025). Transparent reporting of AI in systematic literature reviews: Development of the PRISMA-trAIce checklist. *JMIR AI*, 4, e80247. https://doi.org/10.2196/80247
- Hong, Q. N., Fàbregues, S., Bartlett, G., Boardman, F., Cargo, M., Dagenais, P., Gagnon, M.-P., Griffiths, F., Nicolau, B., O'Cathain, A., Rousseau, M.-C., Vedel, I., & Pluye, P. (2018). The Mixed Methods Appraisal Tool (MMAT) version 2018 for information professionals and researchers. *Education for Information*, 34(4), 285–291. https://doi.org/10.3233/EFI-180221
- Hoyle, A., Goel, P., Hian-Cheong, A., Peskov, D., Boyd-Graber, J., & Resnik, P. (2021). Is automated topic model evaluation broken? The incoherence of coherence. In *Advances in Neural Information Processing Systems 34*. https://doi.org/10.48550/arXiv.2107.02173
- Ibrahim, E. I., Nelson, L. K., & Voyer, A. (2026). Should generative AI be used in reflexive qualitative research? *Qualitative Inquiry*, online first. https://doi.org/10.1177/10778004261456208
- Jowsey, T., Braun, V., Clarke, V., Lupton, D., & Fine, M. (2025). We reject the use of generative artificial intelligence for reflexive qualitative research. *Qualitative Inquiry*, online first. https://doi.org/10.1177/10778004251401851
- Kessler, M. M. (1963). Bibliographic coupling between scientific papers. *American Documentation*, 14(1), 10–25. https://doi.org/10.1002/asi.5090140103
- Khraisha, Q., Put, S., Kappenberg, J., Warraitch, A., & Hadfield, K. (2024). Can large language models replace humans in systematic reviews? Evaluating GPT-4's efficacy in screening and extracting data from peer-reviewed and grey literature in multiple languages. *Research Synthesis Methods*, 15(4), 616–626. https://doi.org/10.1002/jrsm.1715
- Kotek, H., Dockum, R., & Sun, D. (2023). Gender bias and stereotypes in large language models. In *Proceedings of the ACM Collective Intelligence Conference* (pp. 12–24). https://doi.org/10.1145/3582269.3615599
- Levac, D., Colquhoun, H., & O'Brien, K. K. (2010). Scoping studies: Advancing the methodology. *Implementation Science*, 5, 69. https://doi.org/10.1186/1748-5908-5-69
- Lieberum, J.-L., Toews, M., Metzendorf, M.-I., Heilmeyer, F., Siemens, W., Haverkamp, C., Böhringer, D., Meerpohl, J. J., & Eisele-Metzger, A. (2025). Large language models for conducting systematic reviews: On the rise, but not yet ready for use. A scoping review. *Journal of Clinical Epidemiology*, 181, 111746. https://doi.org/10.1016/j.jclinepi.2025.111746
- Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). Lost in the middle: How language models use long contexts. *Transactions of the Association for Computational Linguistics*, 12, 157–173. https://doi.org/10.1162/tacl_a_00638
- McArthur, A., Cooper, A., Edwards, D., Klugarova, J., Yan, H., Barber, B. V., Gregg, E. E., Weeks, L. E., & Jordan, Z. (2025). Textual evidence systematic reviews series paper 3: Critical appraisal of evidence from narrative, opinion, and policy. *JBI Evidence Synthesis*, 23(5), 833–839. https://doi.org/10.11124/JBIES-24-00293
- McDonald, N., Schoenebeck, S., & Forte, A. (2019). Reliability and inter-rater reliability in qualitative research: Norms and guidelines for CSCW and HCI practice. *Proceedings of the ACM on Human-Computer Interaction*, 3(CSCW), 72. https://doi.org/10.1145/3359174
- Min, S., Krishna, K., Lyu, X., Lewis, M., Yih, W., Koh, P. W., Iyyer, M., Zettlemoyer, L., & Hajishirzi, H. (2023). FActScore: Fine-grained atomic evaluation of factual precision in long form text generation. In *Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing* (pp. 12076–12100). https://doi.org/10.18653/v1/2023.emnlp-main.741
- Nelson, L. K. (2020). Computational grounded theory: A methodological framework. *Sociological Methods & Research*, 49(1), 3–42. https://doi.org/10.1177/0049124117729703
- Nylund, K. L., Asparouhov, T., & Muthén, B. O. (2007). Deciding on the number of classes in latent class analysis and growth mixture modeling: A Monte Carlo simulation study. *Structural Equation Modeling*, 14(4), 535–569. https://doi.org/10.1080/10705510701575396
- O'Connor, C., & Joffe, H. (2020). Intercoder reliability in qualitative research: Debates and practical guidelines. *International Journal of Qualitative Methods*, 19. https://doi.org/10.1177/1609406919899220
- Ollion, É., Shen, R., Macanovic, A., & Chatelain, A. (2024). The dangers of using proprietary LLMs for research. *Nature Machine Intelligence*, 6(1), 4–5. https://doi.org/10.1038/s42256-023-00783-6
- Panickssery, A., Bowman, S. R., & Feng, S. (2024). LLM evaluators recognize and favor their own generations. In *Advances in Neural Information Processing Systems 37*. https://doi.org/10.48550/arXiv.2404.13076
- Pawson, R., Greenhalgh, T., Harvey, G., & Walshe, K. (2005). Realist review: A new method of systematic review designed for complex policy interventions. *Journal of Health Services Research & Policy*, 10(Suppl. 1), 21–34. https://doi.org/10.1258/1355819054308530
- Peters, M. D. J., Marnie, C., Tricco, A. C., Pollock, D., Munn, Z., Alexander, L., McInerney, P., Godfrey, C. M., & Khalil, H. (2020). Updated methodological guidance for the conduct of scoping reviews. *JBI Evidence Synthesis*, 18(10), 2119–2126. https://doi.org/10.11124/JBIES-20-00167
- Pollock, D., Peters, M. D. J., Khalil, H., McInerney, P., Alexander, L., Tricco, A. C., Evans, C., de Moraes, É. B., Godfrey, C. M., Pieper, D., Saran, A., Stern, C., & Munn, Z. (2023). Recommendations for the extraction, analysis, and presentation of results in scoping reviews. *JBI Evidence Synthesis*, 21(3), 520–532. https://doi.org/10.11124/JBIES-22-00123
- Rayson, P., & Garside, R. (2000). Comparing corpora using frequency profiling. In *Proceedings of the Workshop on Comparing Corpora* (pp. 1–6). https://doi.org/10.3115/1117729.1117730
- Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. In *Proceedings of EMNLP-IJCNLP 2019* (pp. 3980–3990). https://doi.org/10.18653/v1/D19-1410
- Roberts, M. E., Stewart, B. M., Tingley, D., Lucas, C., Leder-Luis, J., Gadarian, S. K., Albertson, B., & Rand, D. G. (2014). Structural topic models for open-ended survey responses. *American Journal of Political Science*, 58(4), 1064–1082. https://doi.org/10.1111/ajps.12103
- Sim, J., & Wright, C. C. (2005). The kappa statistic in reliability studies: Use, interpretation, and sample size requirements. *Physical Therapy*, 85(3), 257–268. https://doi.org/10.1093/ptj/85.3.257
- Snilstveit, B., Vojtkova, M., Bhavsar, A., Stevenson, J., & Gaarder, M. (2016). Evidence & gap maps: A tool for promoting evidence informed policy and strategic research agendas. *Journal of Clinical Epidemiology*, 79, 120–129. https://doi.org/10.1016/j.jclinepi.2016.05.015
- Thomas, J., & Harden, A. (2008). Methods for the thematic synthesis of qualitative research in systematic reviews. *BMC Medical Research Methodology*, 8, 45. https://doi.org/10.1186/1471-2288-8-45
- Tong, A., Flemming, K., McInnes, E., Oliver, S., & Craig, J. (2012). Enhancing transparency in reporting the synthesis of qualitative research: ENTREQ. *BMC Medical Research Methodology*, 12, 181. https://doi.org/10.1186/1471-2288-12-181
- Törnberg, P. (2024). Best practices for text annotation with large language models. *Sociologica*, 18(2), 67–85. https://doi.org/10.6092/issn.1971-8853/19461
- Tricco, A. C., Lillie, E., Zarin, W., O'Brien, K. K., Colquhoun, H., Levac, D., et al. (2018). PRISMA extension for scoping reviews (PRISMA-ScR): Checklist and explanation. *Annals of Internal Medicine*, 169(7), 467–473. https://doi.org/10.7326/M18-0850
- Tyndall, J. (2010). *AACODS checklist*. Flinders University. https://hdl.handle.net/2328/3326
- van Eck, N. J., & Waltman, L. (2010). Software survey: VOSviewer, a computer program for bibliometric mapping. *Scientometrics*, 84(2), 523–538. https://doi.org/10.1007/s11192-009-0146-3
- von Wedel, D., Schmitt, R. A., Thiele, M., Leuner, R., Shay, D., Redaelli, S., & Schaefer, M. S. (2024). Affiliation bias in peer review of abstracts by a large language model. *JAMA*, 331(3), 252–253. https://doi.org/10.1001/jama.2023.24641
- Walters, W. H., & Wilder, E. I. (2023). Fabrication and errors in the bibliographic citations generated by ChatGPT. *Scientific Reports*, 13, 14045. https://doi.org/10.1038/s41598-023-41032-5
- Wang, P., Li, L., Chen, L., Cai, Z., Zhu, D., Lin, B., Cao, Y., Kong, L., Liu, Q., Liu, T., & Sui, Z. (2024). Large language models are not fair evaluators. In *Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics* (pp. 9440–9450). https://doi.org/10.18653/v1/2024.acl-long.511
- White, H., Albers, B., Gaarder, M., Kornør, H., Littell, J., Marshall, Z., Mathew, C., Pigott, T., Snilstveit, B., Waddington, H., & Welch, V. (2020). Guidance for producing a Campbell evidence and gap map. *Campbell Systematic Reviews*, 16(4), e1125. https://doi.org/10.1002/cl2.1125
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209–212. https://doi.org/10.1080/01621459.1927.10502953
- Wong, G., Greenhalgh, T., Westhorp, G., Buckingham, J., & Pawson, R. (2013). RAMESES publication standards: Meta-narrative reviews. *BMC Medicine*, 11, 20. https://doi.org/10.1186/1741-7015-11-20
- Ying, L., Montgomery, J. M., & Stewart, B. M. (2022). Topics, concepts, and measurement: A crowdsourced procedure for validating topics as measures. *Political Analysis*, 30(4), 570–589. https://doi.org/10.1017/pan.2021.33
- Zhao, X., Liu, J. S., & Deng, K. (2013). Assumptions behind intercoder reliability indices. *Annals of the International Communication Association*, 36(1), 419–480. https://doi.org/10.1080/23808985.2013.11679142
- Zheng, L., Chiang, W.-L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., Lin, Z., Li, Z., Li, D., Xing, E. P., Zhang, H., Gonzalez, J. E., & Stoica, I. (2023). Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. In *Advances in Neural Information Processing Systems 36*, Datasets and Benchmarks Track. https://doi.org/10.48550/arXiv.2306.05685
- Ziems, C., Held, W., Shaikh, O., Chen, J., Zhang, Z., & Yang, D. (2024). Can large language models transform computational social science? *Computational Linguistics*, 50(1), 237–291. https://doi.org/10.1162/coli_a_00502

## Related

- [[methods]]
- [[standards]]
- [[analysis-divergence]]
- [[analysis-sq-advisory]]
- [[update-protocol]]
- [[research-vault]]
- [[governance]]
- [[verification]]
- [[plan]]
