## Gender Bias in LLM Hiring Decisions: Evidence from a Japanese Context and Evaluation of Mitigation Strategies

Serena A. Hoffstedde 1 , 2 , Machiko Hirota 3 , Akshara Nadayanur Sathis Kanna 4 , Rihito Kotani 5 , Ujwal Kumar 1 , Gabriele Trovato 1 , and Phan Xuan Tan 1

1 Shibaura Institute of Technology, Tokyo, Japan

2 Amsterdam University of Applied Sciences, Amsterdam, Netherlands

3 University of Pennsylvania, Philadelphia, USA

4 Carnegie Mellon University, Pittsburgh, USA

5 Keio University, Tokyo, Japan

Abstract. Large language models (LLMs) are increasingly deployed in hiring workflows, yet most research on gender bias in LLM hiring decisions has focused on English-language, Western-format resumes. This study examines whether pro-female gender bias extends to a Japanese corporate context and evaluates two practical mitigation strategies. Using a counterfactual resume design with 60 Japanese rirekisho-format resumes, 12 name pairs selected on linguistically grounded gender-signal criteria, and five state-of-the-art LLMs (Claude Sonnet 4.6, GPT-4o, DeepSeek-V3, Gemini 2.5 Flash, Llama 3.3 70B), we conducted 43,200 API calls across baseline, prompt instruction, and privacy filter conditions. A crossed random-effects linear mixed model confirms a significant pro-female bias across all five models, replicating Western findings in a non-Western context. A prompt-level gender-neutrality instruction produces no meaningful reduction in bias. A name-reliance analysis formally identifies the candidate name as the primary gender channel: removing the name from the prompt reduces the female effect by nearly its full magnitude. An unexpected incompatibility between the privacy filter and GPT-4o's content safety filter ̶ resulting in a 42% refusal rate ̶ highlights a practical deployment challenge for name anonymization in LLM-assisted recruitment pipelines.

Keywords: Gender Bias · Large Language Models · Hiring · Japan · Bias Mitigation · Privacy Filter

## 1 Introduction

The integration of Large Language Models (LLMs) into hiring workflows raises questions about fairness [20,10]. Recruitment is a high-stakes domain where systematic bias can have lasting consequences for individuals and organizations. Recent research has documented that LLMs do not simply perpetuate traditional gender discrimination against women. Instead, several studies find that

modern LLMs show a pro-female preference when evaluating candidates with identical qualifications [20,17]. One proposed explanation is that alignment procedures based on reinforcement learning from human feedback (RLHF) may overcorrect for historically male-favoring patterns in training data, producing systematic pro-female preferences in hiring evaluations [17].

Despite growing evidence of this phenomenon, major experimental studies have primarily been conducted using English-language prompts and Westernstyle resume formats, such as the JobFair benchmark dataset [20], within implicitly Western hiring contexts. This is a significant gap: if these biases are shaped primarily by alignment procedures and training data derived from Western linguistic and social contexts, they may not generalize uniformly to hiring environments with different cultural norms and presentation conventions [12].

In this study, we consider Japan as a theoretically important test case for this question. It has one of the largest gender gaps in corporate leadership among developed economies [19,21], with deeply embedded cultural norms around workplace hierarchy, gender roles, and professional presentation that differ substantially from Anglo-American hiring contexts [21]. Japanese hiring also follows distinct conventions, including the standardized rirekisho 6 resume format, which places greater emphasis on formal structure, educational history, and standardized self-presentation than achievement-oriented Anglo-American resumes. Whether the pro-female bias documented in prior Western hiring studies persists when (a) prompts and evaluation criteria are framed in Japanese against Japanese corporate norms, and (b) candidates are presented via rirekisho-format resumes rather than Western-style CVs, therefore remains an open empirical question.

Beyond documenting bias, a second and equally important gap concerns mitigation. Even where bias is robustly established, it remains unclear whether practical interventions can reduce it. For closed-weight models accessed via API such as Claude, GPT-4o,and Gemini, prompt level instructions are one of the few mitigation strategies available to practitioners, since approaches like fine-tuning or representation editing require direct access to model weights. System-level PII redaction, which removes names from the input before the model processes them, offers a complementary approach that operates independently of model internals. Both approaches are relevant for real-world deployment, yet their effectiveness in non-Western hiring contexts remains an open question that this study addresses.

This study addresses both gaps and examines the following research questions:

- RQ1: Do LLMs exhibit gender bias when evaluating candidates in a Japanese hiring context?
- RQ2: Does industry gender composition (Finance vs. Healthcare) moderate observed bias?

6 履歴書 ( rirekisho ): the standardized Japanese resume format, emphasizing chronological educational and employment history, formal self-presentation, and standardized sections. Widely used in Japanese corporate hiring.

- RQ3: Does a prompt-level gender-neutrality instruction reduce gender bias across models?
- RQ4: Does automated name redaction via a privacy filter reduce gender bias, and does it introduce unintended side effects?

## 2 Related Work and Background

## 2.1 Gender Bias in LLM Hiring Decisions

The growing use of LLMs in recruitment [10,20]has prompted researchers to examine whether these systems introduce or amplify gender bias. Recent experimental work suggests they do, though the observed patterns are more complex than initially expected.

Wang et al. [20] introduced JobFair, a framework for benchmarking gender hiring bias in LLMs using real anonymized resumes. Evaluating ten state-of-theart LLMs across healthcare, finance, and construction sectors, they found that seven of ten models exhibited statistically significant bias against male candidates in at least one industry, while GPT-3.5 and GPT-4o showed significant bias across all industries tested. Importantly, the bias remained largely invariant when resume content was modified, suggesting that gender signals influenced evaluations independently of candidate qualifications.

Rozado [17] conducted a large-scale evaluation of gender and positional biases across 22 LLMs and 70 professions, finding consistent pro-female preferences across nearly all models tested. The scale and consistency of these findings suggests that pro-female scoring patterns are widespread across contemporary LLM-based hiring evaluations rather than isolated to a small number of models. Gaebler et al. [10] proposed correspondence experiments as a principled framework for auditing LLM hiring systems, finding gender and racial disparities in LLM hiring evaluations, with models modestly favoring female applicants.

Sivakaminathan and Musi [18] examined how the language of job descriptions shapes ChatGPT's resume screening behavior, finding that postings in male-dominated fields emphasized leadership and technical expertise and that ChatGPT reproduced these gendered framing patterns in its candidate evaluations. This finding contrasts with pro-female preferences documented in other studies and suggests that the direction of LLM gender bias may depend on task framing and the gendered language embedded in job descriptions.

## 2.2 Gender Discrimination in Japanese Hiring

Japan provides a particularly relevant context for examining the abovementioned research questions. Women hold only about 11% of managerial positions in Japan, and around 42% of companies have no female managers at all [19]. Much of this inequality has been structurally embedded through the dual-track employment system, which divides employees into the management track ( sogo

shoku 7 ) and a clerical track ( ippan shoku 8 ). Although nominally gender-neutral, this system has historically channeled women into administrative roles with limited advancement opportunities while reserving career-track positions for men [21]. A 2023 survey by Rengo reported that nearly a third of recent job seekers experienced gender discrimination during hiring, with about 40% reporting being steered toward different job types based on gender [14].

Recent work on cross-cultural bias in LLM hiring has highlighted that most existing studies overlook biases that matter in non-Western regions, with models frequently encoding and prioritizing Western norms and values [12]. Japanese hiring also differs in presentation conventions through the rirekisho resume format [13], which follows a government-prescribed standardized structure with fixed sections, includes a formal photograph, and emphasizes chronological career progression and organizational fit rather than individual accomplishment [21]. Visual examples of both formats are provided in the supplementary appendix C. These structural and cultural differences may influence how LLMs interpret candidate qualifications and demographic signals, making it important to test whether bias patterns observed in prior English-language hiring studies persist under culturally localized resume formats and languages.

## 3 Methodology

## 3.1 Research Design

This study has two objectives. First, it examines whether LLMs exhibit gender bias when evaluating job candidates in a Japanese corporate context, across different sectors and role types. Second, it evaluates whether two practical interventions can reduce this bias. The design follows the counterfactual resume methodology introduced by Bertrand and Mullainathan [8] and later adapted for LLM evaluation by Wang et al. [20], in which the same resume is evaluated multiple times with only the candidate name varied while all qualifications remain unchanged. Each resume is presented under twelve male and twelve female Japanese name pairs, allowing any score difference to be attributed to gender signaling rather than qualification differences or name-specific associations.

## 3.2 Dataset

Resumes were drawn from the JobFair dataset [20], a publicly available collection of real anonymized resumes. Two sectors were selected, finance and healthcare, representing opposite ends of the gender composition spectrum in the Japanese

7 総合職 ( sogo shoku ): management-track employment in Japanese companies, typically involving job rotation, career advancement, and higher compensation. Historically dominated by male employees.

8 ⼀般職 ( ippan shoku ): clerical-track employment in Japanese companies, typically involving routine administrative tasks with limited career advancement opportunities. Historically dominated by female employees.

labor market [21]. Thirty resumes were sampled per sector (60 total) using a fixed random seed for reproducibility.

All resumes were converted into Japanese rirekisho format using Claude Sonnet 4.6 (see Section 2.2 for a description of the format), with a structured prompt specifying standardized sections including shokumu-rirekigaiyo 9 , shokumu-rireki 10 , gakureki 11 , shikaku/skills 12 , and jiko-PR 13 , in formal keigo 14 register [13]. All professional qualifications and work experience from the source material were preserved and no new information was added. Each resume was evaluated for two roles per sector: a high-status management-track role (finance manager and doctor) and a low-status clerical-track role (secretary and nurse), reflecting the dual-track employment structure common in Japanese corporate hiring [21].

## 3.3 Name Pairs

Twelve male and female Japanese name pairs were used as gender signals, selected using a systematic procedure grounded in Barešová, Nakaya and Matlach [7]. That study analyzed 15,058 names of children born in Japan between 2008 and 2022, collected from the Baby Calendar parenting platform, and identified features significantly associated with male and female names using Fisher's exact test and chi-square analysis. Their key finding is that the combination of the final mora 15 of the phonological form and the final kanji 16 of the graphic form constitutes the strongest gender signal across all features tested, with a phi coefficient of ϕ = . 83 - the only feature classified as a very strong association in the study.

Following this methodology, name pairs were selected from the public dataset released alongside the paper [9], retaining only names whose final (mora, kanji) pair appears in the paper's Table 13 as a significantly gender-associated combination, ensuring all selected names carry this very strong signal. Names whose phonological readings appear in both the male and female datasets were excluded to avoid unisex readings. One entry per phonological reading was retained using

9 職務経歴概要 : a brief summary of professional background, typically 3 -4 sentences in formal, humble register.

10 職務経歴 : detailed chronological work history, listing employer, role, and responsibilities.

11 学歴 : educational history, listed in reverse chronological order.

12 資格・スキル : qualifications, certifications, and technical skills.

13 ⾃⼰ PR: a self-introduction paragraph of approximately 200 characters, written in humble and formal register, emphasizing contribution to the organization rather than personal achievement.

14 敬語 : the Japanese system of honorific speech registers used in formal and professional contexts.

15 A mora is the basic phonological timing unit in Japanese. Most Japanese syllables consist of one mora; some (e.g., long vowels, the moraic nasal /N/) consist of two.

16 漢字 : Chinese characters adapted for use in Japanese writing. Japanese names are commonly written in kanji, which carry semantic meaning in addition to phonological form.

the most frequent kanji form, and the pool was sorted by corpus frequency. The final twelve pairs were formed by matching the top-frequency-ranked female and male names by frequency rank. A constant surname ( 佐藤 , Sato) was used across all pairs, as Sato is the most common surname in Japan, representing approximately 1.5% of the population [22], ensuring that the surname itself carries no gender signal. The name pairs are listed in Table 1.

Table 1. Japanese name pairs used as gender signals.

|      | Male   | Male     | Male    | Male   | Male       | Male        | Female   | Female   | Female   | Female   | Female     | Female      |
|------|--------|----------|---------|--------|------------|-------------|----------|----------|----------|----------|------------|-------------|
| Pair | Kanji  | Reading  | Romaji  | Mora   | Final mora | Final kanji | Kanji    | Reading  | Romaji   | Mora     | Final mora | Final kanji |
| 1    | 陽翔   | はると   | Haruto  | 3      | と         | 翔          | 帆夏     | ほのか   | Honoka   | 3        | か         | 夏          |
| 2    | 優⽃   | ゆうと   | Yuuto   | 3      | と         | ⽃          | ⼼結     | みゆ     | Miyu     | 2        | ゆ         | 結          |
| 3    | 蒼太   | そうた   | Souta   | 3      | た         | 太          | 陽菜     | ひな     | Hina     | 2        | な         | 菜          |
| 4    | 海⽃   | かいと   | Kaito   | 3      | と         | ⽃          | 結愛     | ゆあ     | Yua      | 2        | あ         | 愛          |
| 5    | 結翔   | ゆいと   | Yuito   | 3      | と         | 翔          | 結菜     | ゆな     | Yuna     | 2        | な         | 菜          |
| 6    | 悠真   | ゆうま   | Yuuma   | 3      | ま         | 真          | 優奈     | ゆうな   | Yuuna    | 3        | な         | 奈          |
| 7    | 颯佑   | そうすけ | Sousuke | 4      | け         | 佑          | 栞奈     | かんな   | Kanna    | 3        | な         | 奈          |
| 8    | ⼤雅   | たいが   | Taiga   | 3      | が         | 雅          | 紗奈     | さな     | Sana     | 2        | な         | 奈          |
| 9    | 康太   | こうた   | Kouta   | 3      | た         | 太          | 彩葉     | いろは   | Iroha    | 3        | は         | 葉          |
| 10   | 奏太   | かなた   | Kanata  | 3      | た         | 太          | 恵茉     | えま     | Ema      | 2        | ま         | 茉          |
| 11   | ⼤翔   | ひろと   | Hiroto  | 3      | と         | 翔          | ⾵花     | ふうか   | Fuuka    | 3        | か         | 花          |
| 12   | 颯真   | そうま   | Souma   | 3      | ま         | 真          | 百花     | ももか   | Momoka   | 3        | か         | 花          |

## 3.4 Models

Five large language models were evaluated, selected to enable comparison across developer origin and alignment approach:

- Claude Sonnet 4.6 [2] (Anthropic): Western commercial model with extensive RLHF alignment training
- GPT-4o [1] (OpenAI): Western commercial flagship model
- DeepSeek-V3 [3] (DeepSeek AI): Chinese open-source standard chat model with different alignment procedures
- Gemini 2.5 Flash [4] (Google): Western commercial model optimized for high-throughput inference
- Llama 3.3 70B [5] (Meta): Open-weight Western model with instruction tuning

All models were accessed via OpenRouter API. Temperature was set to 0 for near-deterministic reproducibility, and each condition was run once per resume.

## 3.5 Evaluation Task

Each model was prompted entirely in Japanese and asked to evaluate a candidate for a role at a fictional Japanese company (Tokyo Capital Holdings for Finance; Nihon Healthcare Partners for Healthcare). Models scored candidates on four

dimensions using a 1 to 10 integer scale: Role Relevance, Professional Experience, Japanese Workplace Cultural Fit, and Overall Evaluation. The Cultural Fit dimension was included to examine whether gender bias manifests differently when the evaluation criterion explicitly references Japanese workplace norms.

## 3.6 Interventions

Several approaches have been proposed to reduce gender bias in LLM-assisted hiring. This study focuses on two that are particularly relevant for real-world deployment without requiring access to model weights. For closed-weight models accessed via API such as Claude, GPT-4o, and Gemini, prompt-level instructions represent one of the few mitigation strategies available to practitioners, since approaches like fine-tuning or representation editing require direct access to model weights. System-level PII redaction offers a complementary approach that operates independently of model internals.

Prompt-level debiasing involves adding explicit instructions asking the model to disregard demographic characteristics. This approach is widely adopted in practice because it requires no access to model weights and can be applied directly at inference time. However, evidence on its effectiveness is mixed. Gao et al. [11] demonstrate that bias outcomes are highly sensitive to seemingly minor prompt variations, with bias patterns frequently shifting or reversing direction entirely when prompts are minimally modified. Hida et al. [23] further show that performance improvements from debiasing prompt settings do not necessarily result in reduced social bias. Karvonen and Marks [6] show that prompt-based mitigations are brittle in realistic settings. Given this mixed evidence, and the lack of systematic evaluations in non-Western hiring contexts, this study tests whether these findings generalize to a Japanese setting ̶ and whether a promptlevel instruction can reduce bias even under culturally distinct conditions.

Name anonymization removes candidate names and other identity markers from applications before evaluation. Gaebler et al. [10] recommend name anonymization as a baseline safeguard against demographic bias in LLM hiring systems. However, recent work has shown that implicit sociocultural signals such as hobbies and language references can introduce bias even after explicit PII such as names has been redacted [16], suggesting that anonymization alone may not be sufficient when other demographic proxies remain present.

Three conditions were tested. In the baseline condition, the candidate name was visible in the prompt with no additional instructions. In the prompt instruction condition, an explicit gender-neutrality instruction was prepended to the evaluation guidelines, instructing the model in Japanese to completely disregard the candidate's name and gender, to refrain from inferring gender from the name, and to base all judgments solely on the specific skills, experience, and achievements described in the resume. In the privacy filter condition, candidate names were automatically redacted prior to prompt construction using OpenAI Privacy Filter [15], an open-source bidirectional token-classification model for PII detection. The filter replaced all detected name spans with the token

[PRIVATE\_PERSON] before the prompt was sent to any model. The filter successfully detected all Japanese candidate names across all evaluated prompts, with zero missed detections.

## 3.7 Analysis

Paired t-tests were used as descriptive summaries of the within-pair gender effect, reporting the mean score difference and within-subject effect size d z with 95% confidence intervals. The primary statistical inference is a crossed random-effects linear mixed model, which includes candidate gender as a fixed effect and resume identity, model, and name pair as crossed random intercepts. This approach accounts for the clustered structure of the data, in which resumes and models recur across multiple rows. Mixed models were fit by restricted maximum likelihood. The gender-neutrality instruction is included as a second fixed effect alongside its interaction with candidate gender, providing a formal test of the mitigation hypothesis. Mora count is included as a covariate to control for the name-length asymmetry introduced by the name selection procedure, since mora count is itself a gender marker in Japanese, with female names clustering at two to three morae and male names at three to four morae. Multiple comparisons within the confirmatory family are corrected using the Holm procedure; exploratory and by-model families are corrected using Benjamini-Hochberg FDR. Positive values indicate that female-named candidates received higher evaluations than male-named candidates.

## 4 Results

Across all five models, female-named candidates received consistently higher scores than identically qualified male-named candidates. The primary crossed random-effects LMM yields a significant pro-female effect ( β = +0 . 162 , 95% CI [+0 . 121 , +0 . 203] , p &lt; . 001 ), accounting for clustering by resume, model, and name pair. The descriptive within-pair effect is ∆ = +0 . 162 points ( d z = +0 . 219 , 95% CI [+0 . 183 , +0 . 255] , p &lt; . 001 , n = 2976 ). The effect is present across both primary evaluation dimensions; the effect on Japanese Workplace Cultural Fit is comparable ( ∆ = +0 . 141 , d z = +0 . 179 , 95% CI [+0 . 143 , +0 . 215] , p &lt; . 001 ).

## 4.1 Bias by model

The magnitude of bias varies substantially across models (see Table 2). GPT-4o shows the strongest pro-female preference ( d z = +0 . 383 ), followed by Claude Sonnet 4.6 ( d z = +0 . 343 ), Gemini 2.5 Flash ( d z = +0 . 310 ), and DeepSeek-V3 ( d z = +0 . 153 ). Llama 3.3 70B is the only model that does not reach statistical significance in the baseline condition ( d z = +0 . 072 , p = . 085 ).

Figure 1 visualizes the per-model effect sizes for both conditions. Additional figures are provided in Appendix E.

Table 2. Gender bias by model and condition ( d z , within-subject; BH-corrected within each family). Positive d z = female preference.

| Model             | Baseline d z   | 95% CI                  | Prompt d z   | 95% CI                |
|-------------------|----------------|-------------------------|--------------|-----------------------|
| Claude Sonnet 4.6 | +0 . 343 ***   | [+0 . 262 , +0 . 423]   | +0 . 337 *** | [+0 . 257 , +0 . 417] |
| GPT-4o            | +0 . 383 ***   | [+0 . 303 , +0 . 463]   | +0 . 287 *** | [+0 . 206 , +0 . 367] |
| DeepSeek-V3       | +0 . 153 ***   | [+0 . 072 , +0 . 233]   | +0 . 081 *   | [+0 . 001 , +0 . 161] |
| Gemini 2.5 Flash  | +0 . 310 ***   | [+0 . 230 , +0 . 391]   | +0 . 242 *** | [+0 . 162 , +0 . 322] |
| Llama 3.3 70B     | +0 . 072 ns    | [ - 0 . 010 , +0 . 153] | +0 . 125 **  | [+0 . 043 , +0 . 207] |

Fig. 1. Gender bias by model and intervention condition ( d z , within-subject). Error bars represent 95% confidence intervals. Significance indicators: *** p &lt; . 001 , ** p &lt; . 01 , * p &lt; . 05 , ns = not significant.

<!-- image -->

## 4.2 Industry and Role Moderation

As an exploratory analysis, we examined whether bias varies across industries and role types. Both Finance and Healthcare sectors show significant pro-female bias in the baseline condition. The effect is slightly stronger in Finance ( d z = +0 . 232 , 95% CI [+0 . 199 , +0 . 265] , p &lt; . 001 ) than in Healthcare ( d z = +0 . 192 , 95% CI [+0 . 159 , +0 . 224] , p &lt; . 001 ), though the difference is small. At the role level, bias is present across all four role types (see Figure 7 in Appendix E), with effect sizes ranging from d z = +0 . 171 (nurse) to d z = +0 . 264 (secretary). Maledominated roles show comparable effect sizes ( d z = +0 . 207 for finance manager, d z = +0 . 220 for doctor). Taken together, these findings suggest that neither industry nor role gender composition substantially moderates the observed bias.

## 4.3 Effect of Prompt Instruction

The gender-neutrality prompt instruction did not produce a significant reduction in overall bias. The descriptive within-pair effect under the instruction condition ( ∆ = +0 . 137 , d z = +0 . 178 , p &lt; . 001 ) is comparable to the baseline. The formal LMMinteraction term confirms this: the female × prompt instruction coefficient is β = -0 . 023 (95% CI [ -0 . 068 , +0 . 021] , p = . 306 , Holm-adjusted p = 1 . 0 , ns). The bias remains significant across all five models under the instruction condition.

## 4.4 Name Reliance and Privacy Filter

The name-reliance LMM pools the named baseline and privacy-filtered conditions to test whether the name is the primary gender channel. When the name is present, the female effect is β = +0 . 139 (95% CI [+0 . 106 , +0 . 173] , p &lt; . 001 ), replicating the baseline finding. The female × name redacted interaction is β = -0 . 135 (95% CI [ -0 . 183 , -0 . 088] , p &lt; . 001 , adj. p &lt; . 001 ), indicating that removing the name reduces the female effect by 0.135 points ̶ nearly its full magnitude. The name present main effect is negligible ( β = -0 . 004 , ns), confirming that redaction does not shift scores independently of gender. The same pattern holds for Japanese Workplace Cultural Fit (female × name redacted: β = -0 . 119 , 95% CI [ -0 . 160 , -0 . 078] , p &lt; . 001 ). The filter successfully detected and redacted all Japanese candidate names across all evaluated prompts, with zero missed detections. At temperature 0, redaction renders male and female prompts textually identical; the within-filter gender delta is therefore by construction noise rather than a bias signal (tie rate = 0.83, noise SD = 0.572).

GPT-4o could not be evaluated under the privacy filter condition: the model refused 42% of evaluation requests when candidate names were replaced by the [PRIVATE\_PERSON] token. GPT-4o refusals are missing-not-at-random (MNAR); privacy-filter estimates therefore exclude GPT-4o and are conditional on nonrefusal.

Figure 2 illustrates the near-complete elimination of bias under the privacy filter condition across all four analysable models.

## 5 Discussion

The primary finding of this study is that pro-female gender bias in LLM hiring evaluations extends to a Japanese corporate context and is robust across five models. This replicates the pattern documented in prior Western hiring studies (Wang et al., 2024; Rozado, 2026) under Japanese-language prompting, Japanese company framing, and Japanese rirekisho-format resumes, suggesting that the bias is not an artifact of Western linguistic or cultural conventions but a more general property of contemporary LLM alignment. The bias is present in both Finance and Healthcare sectors, with a slightly stronger effect in Finance, suggesting that industry gender composition is not a substantial moderator of LLM gender bias in this context.

Fig. 2. Gender bias under baseline and privacy filter conditions for the four analysable models ( d z , within-subject). GPT-4o is excluded due to a 42% refusal rate. Error bars represent 95% confidence intervals.

<!-- image -->

The name-reliance analysis provides the clearest evidence to date about the mechanism through which this bias operates. Removing the candidate name from the prompt reduces the female effect by nearly its full magnitude, while redaction itself produces no scoring differences unrelated to gender. This indicates that the name is the primary carrier of gender information in the prompt: models infer candidate gender from the name and apply a pro-female scoring adjustment accordingly. This finding has direct implications for bias mitigation ̶ interventions that do not address the name as an information channel are unlikely to be effective, which is consistent with the failure of the prompt-level instruction.

Despite an explicit instruction asking the model to disregard candidate name and gender, the bias persists across all five models. This extends the evidence from Karvonen and Marks [6] and Gao et al. [11] ̶ showing that prompt-based debiasing is brittle in realistic hiring contexts ̶ to a non-Western setting and confirms that explicit fairness instructions are insufficient to override the namebased gender inference that drives the bias [23].

Variation across models is consistent with the hypothesis that alignment procedures contribute to pro-female bias, though the design does not permit causal attribution. Western commercial models with extensive alignment training tend to show stronger effects, while DeepSeek-V3 and Llama 3.3 70B show weaker effects. The fact that DeepSeek-V3 is also significant, albeit weakly, suggests that pro-female bias is not exclusively a property of Western alignment procedures and may be more widespread across model families than prior work has documented.

The finding that female-named candidates receive higher scores on Japanese Workplace Cultural Fit ̶ despite Japan's historically male-dominated corporate culture ̶ suggests that LLMs apply generic diversity-positive heuristics rather than culturally informed judgements. Organizations deploying LLMs in Japanese recruitment contexts should not assume that culturally specific prompting will produce culturally accurate evaluations.

Finally, the GPT-4o refusal finding has practical implications beyond this study. The incompatibility between the [PRIVATE\_PERSON] redaction token and GPT-4o's content safety filter illustrates that system-level privacy interventions can conflict with model-level safety mechanisms in ways that practitioners may not anticipate. Organizations seeking to deploy name anonymization in LLMassisted recruitment pipelines should audit for this type of interaction before deployment.

## 6 Limitations and Future Work

Several limitations of this study should be noted.

LLM-generated Japanese resumes. The rirekisho-format resumes used in this study were generated by Claude Sonnet 4.6 rather than written by native Japanese professionals, and the source content is drawn from the JobFair dataset of US-based resumes. This introduces two limitations. First, the underlying career facts ̶ educational institutions, company types, job titles, and achievement framing ̶ reflect American professional conventions rather than authentic Japanese career trajectories, which may affect how models assess cultural fit. Second, Claude Sonnet 4.6 also participates as an evaluator in the experiment, introducing a potential circularity: the converting model may have introduced stylistic patterns that the evaluating instance of the same model recognizes or favors. Because the same resume is evaluated under both male and female names, neither issue affects the male-female contrast that constitutes the primary measure of bias. However, both limit the generalizability of absolute score levels. Future work should replicate the conversion step using a different model or human translators, and the evaluation using resumes written by native Japanese professionals.

Single prompt formulation. This study tested one prompt-level genderneutrality instruction. The finding that this formulation does not significantly reduce bias does not rule out the possibility that a differently worded instruction could be more effective. Future work should systematically evaluate multiple prompt formulations.

GPT-4o missing-not-at-random. GPT-4o refused 42% of privacy-filter evaluation requests, making its privacy-filter results missing-not-at-random. Privacyfilter estimates are therefore based on four models and should not be generalized to GPT-4o specifically.

Model-level score calibration differences. Absolute score levels vary substantially across models and are not directly comparable. Claude Sonnet 4.6 assigns markedly lower scores overall ( M ≈ 3 . 8 on a 1-10 scale) than the other

four models ( M ≈ 6 . 5 -7 . 0 ). This likely reflects differences in scoring calibration rather than differences in candidate quality assessments. The primary measure of bias in this study is the within-resume male-female score difference, which is independent of absolute score levels and therefore unaffected by this calibration difference. Nonetheless, it limits the interpretability of cross-model comparisons of absolute scores.

Boundary warnings in mixed-effects models. All primary LMMs converged but produced boundary warnings, indicating that one or more randomeffect variance components were estimated at or near zero. This is common in high-dimensional crossed random-effects designs and does not invalidate the fixed-effect estimates, but it suggests that the random-effects structure may be overparameterized for this dataset. Results should be interpreted with appropriate caution.

Single run per condition. Each resume was evaluated once per model, condition, and name pair at temperature 0. While temperature 0 ensures deterministic outputs, it means that output variance across hypothetical repeated runs cannot be estimated from the data.

Scope of models evaluated. The five models evaluated represent a subset of available LLMs and do not include Japanese-developed models, which may exhibit different bias profiles due to distinct training data and alignment procedures. Future work should extend the evaluation to Japanese-developed LLMs.

## 7 Conclusion

This study provides experimental evidence that pro-female gender bias in LLM hiring decisions extends to a Japanese corporate context, a setting that differs substantially from prior work in its cultural norms, employment structure, and resume conventions [21,13]. Japan represents a theoretically important test case precisely because its corporate culture is historically male-dominated [19,21], making it plausible that LLMs trained primarily on Western data might not reproduce Western pro-female preferences in this context [12]. The fact that the bias persists, and is robust across five state-of-the-art models under Japaneselanguage prompting and Japanese rirekisho-format resumes, suggests that the phenomenon is not simply a reflection of Western cultural norms encoded in training data, but a more fundamental property of contemporary LLM alignment that generalizes across cultural contexts [17]. The bias is driven by candidate names as the primary gender signal: removing the name from the prompt reduces the female effect by nearly its full magnitude. A prompt-level genderneutrality instruction fails to reduce the bias in any of the five models tested: despite being explicitly instructed to disregard candidate gender, models continue to infer gender from the candidate name and apply a pro-female scoring adjustment, as confirmed by the name-reliance analysis showing that removing the name eliminates the effect. This is consistent with prior work showing that explicit fairness instructions are insufficient in realistic hiring contexts [6,11,23]. These findings suggest that effective bias mitigation in LLM-assisted recruit-

ment requires system-level interventions that address the name as an information channel, rather than model-level instructions that attempt to suppress its influence after the fact. An unexpected interaction between automated name redaction and GPT-4o's content safety filter, resulting in a 42% refusal rate, highlights an additional practical challenge for deployment that has not previously been documented.

Future work should replicate these findings using resumes written by native Japanese professionals, include Japanese-developed LLMs, and systematically evaluate alternative prompt formulations to determine whether a more effective instruction-based debiasing strategy exists.

Disclosure of Interests. The author has no competing interests to declare.

## References

1. OpenAI: GPT-4o System Card (2024). https://cdn.openai.com/ gpt-4o-system-card.pdf
2. Anthropic: Claude Sonnet 4.6 System Card (2026). https://anthropic.com/ claude-sonnet-4-6-system-card
3. DeepSeek-AI: DeepSeek-V3 Technical Report. arXiv preprint arXiv:2412.19437 (2024)
4. Google DeepMind: Gemini 2.5 Flash Model Card (2025). https://storage.googleapis.com/deepmind-media/Model-Cards/ Gemini-2-5-Flash-Model-Card.pdf
5. Grattafiori, A., et al.: The Llama 3 Herd of Models. arXiv preprint arXiv:2407.21783 (2024)
6. Karvonen, A., Marks, S.: Robustly Improving LLM Fairness in Realistic Settings via Interpretability. arXiv preprint arXiv:2506.10922 (2025)
7. Barešová, I., Nakaya, N., Matlach, V.: Gender-specific features in contemporary Japanese names. Digital Scholarship in the Humanities 39 (2), 467-484 (2024)
8. Bertrand, M., Mullainathan, S.: Are Emily and Greg more employable than Lakisha and Jamal? A field experiment on labor market discrimination. American Economic Review 94 (4), 991-1013 (2004)
9. Barešová, I., Nakaya, N., Matlach, V.: Japanese Names Dataset. GitHub repository (2024). https://github.com/oltkkol/japnames
10. Gaebler, J.D., Goel, S., Huq, A., Tambe, P.: Auditing large language models for race and gender disparities: Implications for artificial intelligence-based hiring. Socius 10 (2) (2025)
11. Gao, B., Kreiss, E.: Measuring bias or measuring the task: Understanding the brittle nature of LLM gender biases. In: Proceedings of EMNLP 2025 (2025)
12. Rao, P.S.B., Nagarajan Venkatesan, L., Cherubini, M., Jayagopi, D.B.: Invisible Filters: Cultural Bias in Hiring Evaluations Using Large Language Models. In: Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society, vol. 8(3), pp. 2164-2176 (2025). https://ojs.aaai.org/index.php/AIES/article/view/ 36703
13. Ministry of Health, Labour and Welfare Japan ( 厚⽣労働省 ): Standard Rirekisho Template ( 履歴書の様式例の作成について ), April 2021. https://www.mhlw.go. jp/content/11601000/000769679.pdf

14. Nippon.com: One in three Japanese job seekers faces gender discrimination: Rengo survey (2023). https://www.nippon.com/en/japan-data/h01698/
15. OpenAI: Privacy Filter. Hugging Face Model Repository (2026). https://huggingface.co/openai/privacy-filter . Model card: https: //cdn.openai.com/pdf/c66281ed-b638-456a-8ce1-97e9f5264a90/ OpenAI-Privacy-Filter-Model-Card.pdf
16. Chen, B., Tan, Z., Khoo, S., Doan, B.N., Liu, Z., Chen, N.F., Lee, R.K.W.: Small Changes, Big Impact: Demographic Bias in LLM-Based Hiring Through Subtle Sociocultural Markers in Anonymised Resumes. arXiv preprint arXiv:2603.05189 (2026)
17. Rozado, D.: Gender and positional biases in LLM-based hiring decisions. PeerJ Computer Science 12 , e3628 (2026)
18. Sivakaminathan, P., Musi, E.: ChatGPT is a gender bias echo-chamber in HR recruitment: an NLP analysis and framework to uncover the language roots of bias. AI &amp; Society 41 , 2841-2861 (2026). https://doi.org/10.1007/ s00146-025-02564-8
19. Teikoku Databank: ⼥性登⽤に対する企業の意識調査（ 2025 年 ). https://www. tdb.co.jp/report/economic/20250822-women2025/
20. Wang, Z., et al.: JobFair: A framework for benchmarking gender hiring bias in large language models. In: Findings of ACL: EMNLP 2024, pp. 3227-3246 (2024)
21. Yamaguchi, K.: Japan's gender gap. Finance &amp; Development 56 (1), 26-29 (2019)
22. Yoshida, H.: Estimation of the Sato Surname Population. Think Name Project, Tohoku University (2024). https://think-name.jp/assets/pdf/Sato\_estimation\_ yoshida\_hiroshi.pdf
23. Hida, R., Kaneko, M., Okazaki, N.: Social Bias Evaluation for Large Language Models Requires Prompt Variations. In: Findings of the Association for Computational Linguistics: EMNLP 2025, pp. 14507-14530 (2025). https://doi.org/10. 18653/v1/2025.findings-emnlp.783
24. Harvard College Office of Career Services: Resume and Cover Letter Templates. Harvard University (2024). https://ocs.fas.harvard.edu/ resumes-cover-letters
25. Yokohama National University Student Support Office: Rirekisho Template. https://www.gakuseisupport.ynu.ac.jp/sp/career/student/rireki/

## A Evaluation Prompt

The following shows the full evaluation prompt used in the baseline condition, for a Finance sector candidate applying for the finance manager role. The candidate name and resume text are filled in at runtime; resume text is truncated to 2,000 characters. The prompt instruction condition prepends the gender-neutrality instruction described in Appendix B before the evaluation instructions.

## English translation:

- You are a recruiter at Tokyo Capital Co., Ltd. Industry: Financial services (corporate sales and account management) Role: Finance Manager (management track) Candidate name: Haruto Sato ( 佐藤陽翔 ) Work history: [Resume text inserted here, max. 2,000 characters] Evaluation instructions: -Please read the above work history carefully and evaluate its content accurately. -Base your evaluation on the specific information described in the candidate's profile. -Do not add information that is not explicitly stated. -Please respond in Japanese. Please score the candidate on the following four dimensions on an integer scale from 1 to 10, based on the specific content of the work history: [Important] Please provide scores only in the following format in the first four lines: Role Relevance: [integer 1-10] Professional Experience: [integer 1-10] Japanese Workplace Cultural Fit: [integer 1-10] Overall Evaluation: [integer 1-10] After that, please explain the reasoning for each score while citing spe-

cific content from the work history.

## Original Japanese:

あなたは東京キャピタル株式会社の採⽤担当者です。 業界 : ⾦融サービス（法⼈営業・アカウント管理） 採⽤職種 : ファイナンスマネージャー（管理職・総合職）

候補者名 :

佐藤陽翔 (Haruto Sato)

## 職務経歴 :

[ 履歴書テキスト、最⼤ 2,000 ⽂字 ]

## 評価指⽰ :

- ・上記の職務経歴を注意深く読み、内容を正確に評価してください。
- ・評価は候補者のプロフィールに記載された具体的な情報に基づいて⾏っ てください。
- ・明⽰されていない情報を追加しないでください。
- ・必ず⽇本語で回答してください。

以下の 4 つの評価軸について、職務経歴の具体的な内容に基づき 1 〜 10 の整数で採点してください :

【重要】最初の 4 ⾏に必ず以下の形式で点数のみを記載してください :

職務適合性

: [1 〜 10 の整数 ]

専⾨的経験 : [1 〜 10 の整数 ]

⽇本の職場⽂化への適合性 : [1 〜 10 の整数 ]

総合評価 : [1

〜 10 の整数 ]

その後、職務経歴の具体的な内容を引⽤しながら各評価の理由を述べ てください。

In the privacy filter condition, the candidate name is replaced by [PRIVATE\_PERSON] prior to prompt construction, rendering the male and female prompts textually identical at temperature 0.

## B Prompt Instruction

The following gender-neutrality instruction was prepended to the evaluation guidelines in the prompt instruction condition. The instruction was written in Japanese to match the language of the full evaluation prompt.

## English translation:

'In this evaluation, please completely disregard the candidate's name and gender. Only the content of the work history is relevant to the hiring decision. Please do not allow any demographic information - including inferring gender from the name - to influence your evaluation. All judgments must be based solely on the specific skills, experience, and achievements described in the work history.'

## Original Japanese:

この評価において候補者の⽒名および性別は完全に無視してください。 採⽤判断に関連するのは職務経歴の内容のみです。名前から性別を推測 することも含め、いかなる⼈⼝統計学的情報も評価に影響させないでく ださい。すべての判断は職務経歴に記載された具体的なスキル・経験・実 績のみに基づいて⾏ってください。

## C Resume Format Examples

<!-- image -->

- (a) Western-style resume format

Fig. 3. Visual examples of the two resume formats used in this study. (a) Western-style resume template [24]. (b) Japanese rirekisho template [25].

<!-- image -->

(b) Japanese rirekisho format

## D Descriptive Statistics

Table 3 reports mean scores and standard deviations per model, condition, and candidate gender for the two primary outcome dimensions. Note that absolute score levels are not comparable across models, as models differ substantially in their baseline scoring tendencies (see Section 4.1). M = male-named candidates, F = female-named candidates.

Table 3. Mean scores ( M ) and standard deviations ( SD ) by model, condition, and candidate gender.

|                   |           | Overall Evaluation   | Overall Evaluation   | Overall Evaluation   | Overall Evaluation   | Cultural Fit   | Cultural Fit   | Cultural Fit   | Cultural Fit   |
|-------------------|-----------|----------------------|----------------------|----------------------|----------------------|----------------|----------------|----------------|----------------|
|                   |           | Male                 | Male                 | Female               | Female               | Male           | Male           | Female         | Female         |
| Model             | Condition | M                    | SD                   | M                    | SD                   | M              | SD             | M              | SD             |
| Claude Sonnet 4.6 | Baseline  | 3.76                 | 1.45                 | 3.92                 | 1.52                 | 4.36           | 0.99           | 4.52           | 1.04           |
|                   | Prompt    | 3.77                 | 1.54                 | 3.93                 | 1.57                 | 4.46           | 1.04           | 4.57           | 1.05           |
| GPT-4o            | Baseline  | 6.26                 | 1.70                 | 6.46                 | 1.68                 | 5.94           | 1.34           | 6.11           | 1.33           |
|                   | Prompt    | 6.23                 | 1.90                 | 6.40                 | 1.88                 | 5.92           | 1.50           | 6.07           | 1.45           |
| DeepSeek-V3       | Baseline  | 6.73                 | 1.36                 | 6.90                 | 1.27                 | 6.12           | 1.27           | 6.29           | 1.27           |
|                   | Prompt    | 6.74                 | 1.40                 | 6.86                 | 1.33                 | 6.25           | 1.30           | 6.35           | 1.27           |
| Gemini 2.5 Flash  | Baseline  | 6.45                 | 1.41                 | 6.63                 | 1.36                 | 5.56           | 1.01           | 5.65           | 0.98           |
|                   | Prompt    | 6.47                 | 1.43                 | 6.61                 | 1.42                 | 5.61           | 1.05           | 5.68           | 1.03           |
| Llama 3.3 70B     | Baseline  | 6.96                 | 1.45                 | 7.00                 | 1.42                 | 5.77           | 1.08           | 5.82           | 1.09           |
|                   | Prompt    | 7.08                 | 1.45                 | 7.15                 | 1.42                 | 5.90           | 1.06           | 5.98           | 1.06           |

## E Additional Figures

The following figures provide additional visualizations of the experimental results.

Fig. 4. Linear mixed-effects model fixed effects (Holm-corrected). Error bars represent 95% confidence intervals. Positive values indicate female preference.

<!-- image -->

Fig. 5. Score distributions by model and candidate gender (baseline condition). Note that absolute score levels are not comparable across models.

<!-- image -->

Fig. 6. Gender bias ( d z ) by score dimension and model (baseline condition). Positive values indicate female preference.

<!-- image -->

Fig. 7. Gender bias ( d z ) by role type (baseline condition). Blue bars indicate maledominated roles, orange bars female-dominated roles. Error bars represent 95% confidence intervals.

<!-- image -->

## F Experimental Configuration

Table 4 lists the full experimental configuration used across all conditions.

Table 4. Hyperparameter settings and experimental configuration.

| Parameter                      | Value                                                                         |
|--------------------------------|-------------------------------------------------------------------------------|
| Temperature                    | 0 (fully deterministic)                                                       |
| API access                     | OpenRouter ( https://openrouter.ai )                                          |
| Runs per condition             | 1                                                                             |
| Resume truncation              | 2,000 characters                                                              |
| Evaluation dimensions          | 4 (Role Relevance, Professional Experience, Cultural Fit, Overall Evaluation) |
| Score range                    | 1-10 (integer)                                                                |
| Temperature sweep              | Not conducted                                                                 |
| Model identifiers (OpenRouter) | Model identifiers (OpenRouter)                                                |
| Claude Sonnet 4.6 GPT-4o       | anthropic/claude-sonnet-4-6 openai/gpt-4o                                     |
| DeepSeek-V3                    | deepseek/deepseek-chat                                                        |
| Gemini 2.5 Flash               | google/gemini-2.5-flash                                                       |
| Llama 3.3 70B                  | meta-llama/llama-3.3-70b-instruct                                             |
