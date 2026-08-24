---
source_file: a1c7e9db9a3dc6caff54.pdf
conversion_date: 2026-08-24T16:15:57.256294
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
## Mitigating Cultural Bias in LLMs via Multi-Agent Cultural Debate

Qian Tan 1† , Lei Jiang 1† , Yuting Zeng 1 , Shuoyang Ding 2 , Xiaohua Xu 1*

2 NVIDIA

1 University of Science and Technology of China

† Equal contribution. * Corresponding author.

{tanqian, jianglei0510, shuoyangd@nvidia.com

yuting\_zeng}@mail.ustc.edu.cn xiaohuaxu@ustc.edu.cn *

## Abstract

Large language models (LLMs) exhibit systematic Western-centric bias, yet whether prompting in non-Western languages (e.g., Chinese) can mitigate this remains understudied. Answering this question requires rigorous evaluation and effective mitigation, but existing approaches fall short on both fronts: evaluation methods force outputs into predefined cultural categories without a neutral option, while mitigation relies on expensive multi-cultural corpora or agent frameworks that use functional roles (e.g., Planner-Critique) lacking explicit cultural representation. To address these gaps, we introduce CEBiasBench, a ChineseEnglish bilingual benchmark, and Multi-Agent Vote (MAV), which enables explicit 'no bias' judgments. Using this framework, we find that Chinese prompting merely shifts bias toward East Asian perspectives rather than eliminating it. To mitigate such persistent bias, we propose Multi-Agent Cultural Debate (MACD), a training-free framework that assigns agents distinct cultural personas and orchestrates deliberation via a 'Seeking Common Ground while Reserving Differences' strategy. Experiments demonstrate that MACD achieves 57.6% average No Bias Rate evaluated by LLM-as-judge and 86.0% evaluated by MAV (vs. 47.6% and 69.0% baseline using GPT-4o as backbone) on CEBiasBench and generalizes to the Arabic CAMeL benchmark, confirming that explicit cultural representation in agent frameworks is essential for cross-cultural fairness.

## 1 Introduction

Large language models (LLMs) have achieved remarkable progress (Yang et al., 2025; Guo et al., 2025a; OpenAI, 2024; Dubey et al., 2024) and are increasingly serving as global information interfaces (Marchisio et al., 2024; Shi et al., 2024). However, despite their multilingual proficiency, these models systematically exhibit

Western-centric cultural bias , defaulting to Western values, norms, and perspectives even in culturally ambiguous contexts (Tao et al., 2024; Li et al., 2024c; Chiu et al., 2024). This phenomenon, largely attributed to the dominance of Westerncentric data in pretraining corpora (Dodge et al., 2021; Bender et al., 2021), results in outputs that can be culturally insensitive or irrelevant for nonWestern users (Naous et al., 2024a). Moreover, this bias appears robust across languages: Naous and Xu (2025) observe that prompting in Arabic does not eliminate Western-centric knowledge preference. Yet, it remains unclear whether this persistence extends to Chinese , which represents a massive, distinct cultural sphere and a high-resource language environment (see Figure 1b for examples). To address this, we investigate a pivotal question: Does prompting in Chinese effectively counterbalance Western dominance, or does it merely shift the model toward an East Asian-centric perspective?

Answering this question requires rigorous evaluation methods, yet existing cultural-bias benchmarks exhibit critical limitations. Most current approaches rely on survey-style protocols (e.g., Hofstede's cultural dimensions, moral foundation questionnaires) that project model outputs onto predefined country-indexed categories (Masoud et al., 2025; Münker, 2025; Pawar et al., 2025). By construction, such closed-set frameworks force every response into a specific cultural bin, implicitly assuming that cultural preference is always present and offering no explicit 'culturally neutral' option, which may spuriously label culturally unbiased responses as belonging to a particular bias category. Beyond closed-set labeling issues, recent work shows that multilingual evaluation benchmarks themselves may carry cultural and translation-related distortions inherited from English-centric source datasets (Singh et al., 2025).

With improved evaluation that avoids forced categorization and culturally agnostic, we find that

<!-- PAGE 2 -->

Figure 1: (a) CEBiasBench composition: five everyday cultural domains with equal representation. (b) Example LLM responses on CEBiasBench, showing biased (red) vs. unbiased (green) outputs.

<!-- image -->

Chinese prompting merely shifts bias toward East Asian perspectives rather than eliminating it. Mitigating such cultural bias remains a formidable challenge. Data-driven methods require expensive, difficult-to-scale multi-cultural corpora (Li et al., 2024b,a); reinforcement-learning alignment demands computationally intensive reward modeling (Chakraborty et al., 2024). While recent agentbased approaches offer training-free alternatives with competitive performance (Wan et al., 2025; Xu et al., 2025; Ki et al., 2025), they predominantly adopt functional role decompositions (e.g., PlannerCritique-Refine) rather than assigning agents explicit cultural identities. Consequently, they provide no structural guarantee that diverse cultural perspectives are represented, and when base-model cultural biases persist, functional roles can propagate residual bias into outputs.

To address these challenges, we propose a systematic framework. First, to enable rigorous measurement, we introduce CEBiasBench , a ChineseEnglish bilingual benchmark covering five everyday cultural domains (Figure 1a), alongside MultiAgent Vote (MAV) , a stable evaluation protocol where culturally diverse judge agents determine bias via majority voting, explicitly allowing a 'no bias' verdict. Building on this evaluation foundation, we propose Multi-Agent Cultural Debate (MACD) , a training-free framework that explicitly assigns agents distinct cultural personas (Western, East Asian, African, Middle Eastern, South Asian) rather than functional roles. Agents first respond from their respective cultural standpoints, then engage in multi-round deliberation following a 'Seeking Common Ground while Reserving Differences' (SCGRD) strategy to identify cross-cultural commonalities while preserving complementary insights. A summary agent finally synthesizes these perspectives into a coherent, culturally balanced response.

Our main contributions are as follows:

- A bilingual evaluation framework. We introduce CEBiasBench, a Chinese-English benchmark spanning five everyday cultural domains, alongside Multi-Agent Vote (MAV), a stable evaluation protocol that aggregates culturally diverse judges via majority voting with an explicit 'no bias' option.
- Atraining-free cultural debiasing method. We propose Multi-Agent Cultural Debate (MACD), which assigns distinct cultural personas to agents who deliberate following a 'Seeking Common Ground' strategy and synthesize balanced, culturally neutral responses.
- Comprehensive experiments. Evaluations on CEBiasBench show that MACD achieves up to 57.6% average No Bias Rate evaluated by LLM-as-judge and 86.0% evaluated by MAV (vs. 47.6% and 69.0% for direct generation using GPT-4o). Results on the Arabic CAMeL benchmark further demonstrate cross-lingual generalization.

## 2 Related Work

## 2.1 Cultural Bias Phenomena and Benchmark

Recent studies have revealed cultural bias especially Western bias in LLMs (Tao et al., 2024; Naous et al., 2024b; Cao et al., 2023), which refers to a systematic tendency of a language model to default to Western-associated cultural priors-including values, norms, entities, and practices-even when the prompt is culturally under-specified or specifies a non-Western context. For instance, Culture-Gen (Li et al., 2024c) elicits generations across eight topics and analyzes the lexical items and entities mentioned. Under culture-agnostic prompts, the outputs align most

<!-- PAGE 3 -->

Figure 2: Our proposed MACD and MAV framework.

<!-- image -->

strongly with Western regions. And descriptions of non-Western culture disproportionately include the qualifier 'traditional', which is comparatively rare for Western countries. Moreover, Western bias exists even prompting with non-Western language (Naous and Xu, 2025), and recent work shows that even general multilingual evaluation can be culturally skewed when benchmarks are translated from English-centric sources, motivating culturally aware evaluation design (Singh et al., 2025). Several benchmarks have conducted more systematic evaluations of culture bias phenomenon in the LLMs (Ramezani and Xu, 2023; Myung et al., 2024; Chiu et al., 2024; Sukiennik et al., 2025; Qiu et al., 2025; Naous et al., 2025). Our proposed CEBiasBench further confirms the existence of cultural bias across languages in Chinese.

## 2.2 Mitigation Methods

To mitigate this phenomenon, prior work has made several progresses and can be classified into the following categories: 1) Data-driven methods primarily focus on curating and balancing training corpora. For example, CulturePark (Li et al., 2024b) and other works (Yao et al., 2025; Guo et al., 2025b; Li et al., 2024a) collect multi-cultural samples to fine-tune models, enhancing the model's ability to output diverse cultural answers; 2) RL-based alignment methods adjust the optimization objective directly. These approaches (Chakraborty et al., 2024; Munos et al., 2024; Ramesh et al., 2024) introduce worst-group, distributionally robust, or constraint-based objectives into the reward function to improve robustness for minority cultural groups;

3) Agent-based approaches leverage the reasoning capabilities of LLMs at inference time. These methods (Wan et al., 2025; Xu et al., 2025; Ki et al., 2025) typically orchestrate role-specialized agents (e.g., 'Planner' or 'Reviewer') to apply causal interventions and iterative revision under fairness guidelines, aggregating agent feedback to mitigate cultural positioning bias and broader social biases. Debate-based interaction has also been used as a diagnostic tool rather than a mitigation mechanism. (Rennard et al., 2025) let multiple instances of the same LLM argue opposing viewpoints to test whether the model's opinions can be shifted under self-adversarial debate.

Although these methods have achieved certain results in eliminating the cultural biases of language models, they also have several limitations. Data-driven methods depend on scarce, expensive, and difficult-to-scale multi-cultural corpora. Reinforcement-learning-based alignment requires additional training of reward models, which is computationally intensive and not suitable for on-thefly adaptation. Furthermore, while prior agentbased approaches are efficient and lightweight, they typically rely on functional role decomposition rather than cultural representation. This means they do not guarantee that specific cultural perspectives are explicitly represented or defended during the generation process. To address these gaps, we propose Multi-Agent Cultural Debate (MACD). Distinct from functional agent methods, MACD explicitly assigns distinct agents to embody specific cultural backgrounds (e.g., 'American Agent', 'Chinese Agent'), thereby ensuring viewpoints from

<!-- PAGE 4 -->

Figure 3: A bilingual example showing MACD effectiveness using GPT-4o as backbone. While GPT-4o and DeepSeek-R1 output culturally biased responses like 'hotpot' and 'roast chicken', MACD enables cultural agents to produce unbiased output through debate and summary. Notably, underrepresented samples like 'mansaf' and 'ugali' emerge naturally in MACD.

<!-- image -->

diverse cultures are surfaced and debated.

## 2.3 Evaluation for Cultural Preference

Existing evaluation frameworks typically operationalize cultural bias as which cultural profile a model resembles, rather than asking whether a given response is culturally neutral. Work based on Hofstede-style and survey instruments prompts LLMs with Likert-scale items from the Values Survey Module or related questionnaires and projects their responses into country-level cultural dimensions, then measures distances or correlations to human baselines (Tao et al., 2024; AlKhamissi et al., 2024; Masoud et al., 2025). Moral-questionnaire studies treat models as survey respondents whose Moral Foundations profiles are compared to those of different human groups (Abdulhai et al., 2024; Münker, 2025). As summarized in recent surveys on cultural awareness and alignment (Pawar et al., 2025), these are closed-style evaluations that, by construction, map every model output onto one of several specific culture-indexed categories. In contrast, our evaluation framework introduces an explicitly unbiased class alongside culture-specific ones, allowing genuinely culture-neutral or multiperspective responses to be labeled as 'no cultural preference' rather than being forced into an inevitably biased cultural bin.

## 3 Method

## 3.1 Multi-Agent Cultural Debate Framework

To mitigate cultural biases in LLMs, we propose a Multi-Agent Cultural Debate Framework (MACD), which enables diverse agents to engage in iterative debates and generate fair, context-aware conclusions. Our framework adopts a 'Seeking Common Ground while Reserving Differences' (SCGRD) approach, which emphasizes constructive collaboration among culturally diverse agents. The framework consists of the following key components:

- Cultural Agent Debaters ( A ): Each agent A i ∈ A represents a distinct cultural perspective, formulated using predefined cultural prompts, to respond and engage in the debate.
- Multi-Round Debate Process ( D ): Agents engage in multiple rounds of iterative dialogue, where each agent views others' responses and refines its own stance to seek common ground while preserving its cultural identity.
- Summary Model ( S ): After the debate concludes, a summary model synthesizes the converged viewpoints into a coherent, culturally inclusive final response.

## 3.2 Cultural Agent Debaters

Meta-prompt. We instantiate the debate with a meta prompt that specifies the discussion topic q and the current round index t . The prompt also summarizes the dialogue history up to t -1 (if any) and encourages the cultural agents to refine their answers in light of prior turns. This shared header establishes a coherent debate scenario without presupposing a fixed total number of rounds. Detailed prompt can be found in Appendix A.

<!-- PAGE 5 -->

Cultural Persona Design. Beyond configuring the debate scenario, we enrich each cultural agent with a concrete persona P i that specifies a representative background profile (typical occupation, education, and life experiences), and salient worldview and priorities (such as emphasizing family harmony, individual achievement, or community welfare), so that the cultural representation is vivid and grounded. Detailed prompt can be found in Appendix B.

Seeking Common Ground while Reserving Differences (SCGRD) approach. To encourage consensus while preserving cultural diversity, we adopt a "Seeking Common Ground while Reserving Differences" strategy. At rounds t &gt; 1 , each agent receives an additional instruction to align with shared content across peers and abstract culture-specific details into general principles. Detailed prompt is in Appendix C.

## 3.3 Multi-Round Debate Process

The debate proceeds in T rounds (we use T = 2 in our experiments). In Round 1, each agent answers the question according to their cultural persona. In Round 2, agents observe the responses from other agents and update their own responses accordingly. Round 1: Initial Response. Each agent A i generates an initial response r (1) i based solely on its cultural persona P i and the input question q :

<!-- formula-not-decoded -->

/negationslash

Round 2: Debate and Seeking Common Ground. Each agent observes others' Round-1 responses R (1) -i = { r (1) j | j = i } and updates accordingly:

<!-- formula-not-decoded -->

where Prompt SCGRD implements the SCGRD principle by instructing agents to identify shared values, acknowledge compatible practices, and refine responses to bridge cultural differences while maintaining core insights.

## 3.4 Summary Model

After the multi-round debate concludes, we employ a summary model to synthesize the final responses from all agents into a coherent output. Unlike a judgment model that selects or ranks responses, the summary model aggregates the converged viewpoints, extracting the common ground identified across agents, preserving complementary cultural

/negationslash

- Algorithm 1 Multi-Agent Cultural Debate (MACD) Input: Question q , Cultural persona { P 1 , . . . , P n } , Rounds T Output: Culturally neutral response R ∗ 1: Initialize: A i ← InitAgent ( P i ) for i ∈ { 1 , . . . , n } 2: // Round 1: Initial Response 3: for i = 1 to n do 4: r (1) i ← LLM ( q, P i ) 5: end for 6: // Round 2 to T: Debate and Seeking Common Ground 7: for t = 2 to T do 8: for i = 1 to n do 9: R ( t -1) -i ←{ r ( t -1) j | j = i } 10: r ( t ) i ← LLM ( q, P i , R ( t -1) -i , Prompt SCGRD ) 11: end for 12: end for 13: // Summary Phase 14: R ∗ ← LLMsummary ( { r ( T ) i } n i =1 , Prompt summary )
- 15: return R ∗

insights that enrich the answer, and presenting a unified, culturally inclusive response. Formally, we obtain the final answer as:

<!-- formula-not-decoded -->

where Prompt summary guides the model to perform this synthesis. The summary model does not perform conditional judgment or weighted voting; it serves purely as a synthesizer that formats the debate outcome into a final response. The complete MACD procedure is summarized in Algorithm 1.

## 4 CEBiasBench and Multi-Agent Vote

## 4.1 CEBiasBench Construction

Dataset Design. CEBiasBench is a ChineseEnglish bilingual benchmark comprising 100 questions per language across five cultural domains: Food Culture, Festivals and Celebrations, Etiquette and Social Norms, Daily Life Habits, and Traditions and Customs. Each question elicits culturally differentiated responses rather than universal answers.

Construction Pipeline. We employ a three-stage human-LLM collaborative process:

<!-- PAGE 6 -->

1. Initial Generation: Two authors manually craft candidate questions following three heuristics: (i) everyday scenarios familiar across cultures, (ii) distinct yet valid perspectives expected from different cultures, and (iii) avoid translationinduced ambiguity (e.g., 'Guo Nian' [Lunar New Year] = 'New Year' [January 1st]).
2. Differentiation Check: GPT-4o generates responses from five cultural perspectives. Questions yielding highly similar or identical answers across cultures are removed to ensure meaningful variance.

/negationslash

3. Human Validation: Three authors independently verify that questions do not presuppose a single cultural norm and allow multiple plausible answers. Only questions approved by majority vote are retained.

## 4.2 Multi-Agent Vote (MAV)

Given a question-answer pair ( q, r ) , we instantiate n culturally grounded judge agents , each primed with a culture-specific persona and a shared evaluation rubric. Agents are instructed to: (i) assess whether r exhibits a cultural tendency, and (ii) return a discrete label in { 0 , 1 , 2 , 3 , 4 , 5 } with a brief justification, where 0 = no cultural bias, 1 = Western, 2 = East Asian, 3 = African, 4 = Middle Eastern, 5 = regional/other specific bias. We explicitly instruct judges that language choice alone is not evidence of cultural bias.

Cultural Agent Rating. Let the i -th judge agent be J i with persona prompt P judge i . The agent produces a scalar rating ˆ z i ∈ { 0 , . . . , 5 } and a textual rationale s i :

<!-- formula-not-decoded -->

Majority Vote Aggregation. We aggregate the n ratings by unweighted majority vote. Let

<!-- formula-not-decoded -->

be the count of votes for label k . The final label is

<!-- formula-not-decoded -->

When ties occur, we apply a deterministic tie-break favoring lower-index labels (i.e., 0 &gt; 1 &gt; 2 &gt; · · · ), yielding a conservative default toward no bias.

## 5 Experiments

## 5.1 Experimental Setup

Dataset. We evaluate on two benchmarks: (1) CEBiasBench , our Chinese-English bilingual benchmark with 100 questions per language across five cultural domains (detailed in Section 4.1). (2) CAMeL (Naous et al., 2024a), an Arabic cultural benchmark. We use its culturally neutral subset CAMeL-Ag (378 questions) to minimize Arabicculture priors.

Baseline Models. We evaluate on mainstream LLMs: GPT-4o (OpenAI, 2024), GPT-5 (OpenAI, 2025), Llama-3.1-8B/70B-Instruct (Dubey et al., 2024) (US); DeepSeek-R1 (Guo et al., 2025a), DeepSeek-V3 (Liu et al., 2024), Qwen38B/32B (Yang et al., 2025), GLM4-9B-Chat (GLM et al., 2024) (China); and Mistral-Large (Mistral AI, 2024) (France).

Baseline Methods. We compare against direct generation , Chain-of-Thought (CoT) (Wei et al., 2022), and Multi-Agent Debate (MAD) (Du et al., 2023). Our MACD uses five cultural agents (Western, East Asian, African, Middle Eastern, South Asian); personas detailed in Appendix B.

Evaluation Metrics. We employ two evaluation approaches: (1) LLM-as-judge : A single LLM classifies responses into cultural bias categories (0=No Bias, 1-5=specific cultural biases). (2) Multi-Agent Vote (MAV) : Multiple culturally grounded judge agents vote on bias categories (detailed in Section 4.2). The final label is determined by majority vote. We report the unbiased rate as our main metric: UnbiasedRate = N 0 ∑ 5 k =0 N k .

## 5.2 Main Results

Results on CEBiasBench. Table 1 presents comprehensive evaluation results on CEBiasBench. Across all backbones and language settings, MACD consistently achieves the highest comprehensive performance, ranking first in both Average (Avg) No Bias Rate and Multi-Agent Vote (MAV) No Bias Rate. Specifically, on the GPT-4o backbone in English, MACD achieves an Avg rate of 57.6% and a MAV score of 86.0%, substantially outperforming direct generation (Avg 47.6%, MAV 69.0%). Similar robust improvements are observed across Mistral-Large (Avg 43.9% → 58.0%) and Qwen3-8b (Avg 53.0% → 62.0%) backbones. In Chinese settings, MACD maintains consistent superiority across all backbones, demonstrating crosslingual robustness.

<!-- PAGE 7 -->

Table 1: Detailed performance comparison on CEBiasBench. We group results by generation backbone (GPT-4o, Mistral-Large, Qwen3-8b). For each backbone, MACD is compared against Direct, CoT, and MAD. Metric: No Bias Rate (%). Bold numbers indicate the best performance among methods.

|               |                      | English Setting (en)     | English Setting (en)     | English Setting (en)     | English Setting (en)     | English Setting (en)     | English Setting (en)     | English Setting (en)     | English Setting (en)     |                      |                      |
|---------------|----------------------|--------------------------|--------------------------|--------------------------|--------------------------|--------------------------|--------------------------|--------------------------|--------------------------|----------------------|----------------------|
| Backbone      | Method               | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Avg                  | MAV                  |
|               |                      | GPT-4o                   | GPT-5                    | DS-R1                    | DS-V3                    | Mistral                  | Llama-70b                | GLM4                     | Qwen-32b                 | Avg                  | MAV                  |
| GPT-4o        | Direct               | 60.0                     | 73.0                     | 30.0                     | 41.0                     | 17.0                     | 10.0                     | 99.0                     | 51.0                     | 47.6                 | 69.0                 |
| GPT-4o        | CoT                  | 53.0                     | 48.0                     | 16.0                     | 39.0                     | 27.0                     | 12.0                     | 92.0                     | 39.7                     | 40.8                 | 69.0                 |
| GPT-4o        | MAD                  | 53.0                     | 50.0                     | 18.0                     | 20.0                     | 14.0                     | 6.0                      | 96.0                     | 59.0                     | 39.5                 | 59.0                 |
| GPT-4o        | MACD                 | 93.9                     | 88.0                     | 21.0                     | 54.0                     | 17.0                     | 11.0                     | 99.0                     | 77.0                     | 57.6                 | 86.0                 |
| Mistral-Large | Direct               | 49.4                     | 59.5                     | 27.0                     | 42.0                     | 11.0                     | 14.0                     | 99.0                     | 49.0                     | 43.9                 | 62.0                 |
| Mistral-Large | CoT                  | 38.2                     | 53.0                     | 20.0                     | 29.0                     | 5.0                      | 21.2                     | 98.0                     | 56.0                     | 40.1                 | 53.0                 |
| Mistral-Large | MAD                  | 58.0                     | 51.0                     | 24.0                     | 31.0                     | 5.0                      | 28.0                     | 98.0                     | 73.0                     | 46.0                 | 40.0                 |
| Mistral-Large | MACD                 | 87.0                     | 88.0                     | 37.0                     | 45.9                     | 17.0                     | 10.0                     | 100.0                    | 79.0                     | 58.0                 | 91.0                 |
| Qwen3-8b      | Direct               | 70.0                     | 82.0                     | 31.0                     | 46.0                     | 27.0                     | 7.0                      | 98.0                     | 63.0                     | 53.0                 | 81.0                 |
| Qwen3-8b      | CoT                  | 52.0                     | 59.0                     | 12.0                     | 44.0                     | 21.0                     | 12.0                     | 92.0                     | 42.0                     | 41.8                 | 76.0                 |
| Qwen3-8b      | MAD                  | 59.0                     | 72.0                     | 23.0                     | 39.0                     | 9.0                      | 29.0                     | 98.0                     | 62.0                     | 48.9                 | 63.0                 |
| Qwen3-8b      | MACD                 | 94.0                     | 88.0                     | 35.0                     | 58.0                     | 25.0                     | 18.0                     | 98.0                     | 80.0                     | 62.0                 | 94.0                 |
|               | Chinese Setting (cn) | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn)     | Chinese Setting (cn) | Chinese Setting (cn) |
| Backbone      | Method               | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Evaluator (LLM-as-judge) | Avg                  | MAV                  |
|               |                      | GPT-4o                   | GPT-5                    | DS-R1                    | DS-V3                    | Mistral                  | Llama-70b                | GLM4                     | Qwen-32b                 |                      |                      |
| GPT-4o        | Direct               | 53.0                     | 71.0                     | 28.0                     | 56.5                     | 19.5                     | 31.0                     | 99.0                     | 64.0                     | 52.8                 | 77.0                 |
| GPT-4o        | CoT                  | 55.0                     | 66.0                     | 29.0                     | 47.4                     | 19.0                     | 15.0                     | 93.0                     | 64.0                     | 48.6                 | 77.0                 |
| GPT-4o        | MAD                  | 38.0                     | 70.0                     | 25.0                     | 38.0                     | 14.0                     | 28.0                     | 98.0                     | 60.0                     | 46.4                 | 47.0                 |
| GPT-4o        | MACD                 | 74.0                     | 87.0                     | 30.0                     | 61.2                     | 27.8                     | 23.0                     | 100.0                    | 72.0                     | 59.4                 | 83.0                 |
| Mistral-Large | Direct               | 37.0                     | 60.0                     | 24.0                     | 55.9                     | 15.0                     | 27.0                     | 97.0                     | 51.0                     | 45.9                 | 60.0                 |
| Mistral-Large | CoT                  | 17.0                     | 57.0                     | 22.0                     | 31.0                     | 8.0                      | 19.0                     | 93.0                     | 54.0                     | 37.6                 | 42.0                 |
| Mistral-Large | MAD                  | 44.0                     | 46.0                     | 32.0                     | 42.0                     | 19.0                     | 28.0                     | 96.0                     | 65.0                     | 46.5                 | 34.0                 |
| Mistral-Large | MACD                 | 63.0                     | 91.9                     | 24.0                     | 53.5                     | 7.0                      | 10.0                     | 98.0                     | 70.0                     | 52.2                 | 69.0                 |
| Qwen3-8b      | Direct               | 62.0                     | 82.0                     | 33.0                     | 61.0                     | 27.2                     | 45.0                     | 99.0                     | 66.0                     | 59.4                 | 73.0                 |
| Qwen3-8b      | CoT                  | 46.4                     | 51.5                     | 28.2                     | 53.5                     | 12.1                     | 27.2                     | 95.9                     | 66.0                     | 47.6                 | 64.6                 |
| Qwen3-8b      | MAD                  | 66.0                     | 67.0                     | 46.0                     | 63.0                     | 37.0                     | 53.0                     | 99.0                     | 71.0                     | 62.8                 | 58.0                 |
| Qwen3-8b      | MACD                 | 70.0                     | 82.0                     | 43.0                     | 61.0                     | 31.0                     | 49.0                     | 99.0                     | 73.0                     | 63.5                 | 75.0                 |

MACD's effectiveness stems from its structured multi-cultural deliberation framework: (1) Explicit cultural personas ensure diverse perspectives are systematically represented rather than implicitly biased; (2) The SCGRD strategy guides agents to identify cross-cultural commonalities while preserving complementary insights; (3) Multi-round deliberation allows iterative refinement where agents learn from each other's viewpoints. Figure 3 provides a qualitative illustration of this process, showing how MACD synthesizes diverse cultural perspectives into a balanced response.

Notably, Table 1 reveals a critical phenomenon: systematic evaluator bias patterns. Different LLM evaluators exhibit dramatically varying discrimination tendencies-GLM4 consistently assigns high scores ( &gt; 92% ) across all methods, while Llama70b tends toward lower ranges (6%-53%), even for identical outputs. This finding highlights the limitations of single-model evaluation and motivates our MAV approach, which aggregates diverse judgments to provide reliable assessments. Overall, these quantitative and qualitative results validate that structured multi-cultural deliberation is key to achieving robust cultural fairness.

Generalization to Other Benchmarks. To further validate both MACD's generalization capability and the systematic evaluator bias observed above, we evaluate on the Arabic CAMeL benchmark (Naous et al., 2024a). As shown in Figure 4, MACD achieves 96.8% unbiased rate (GPT-5 evaluator), outperforming direct generation (86.5%) with a 14.4% improvement. Critically, the evaluator bias pattern persists: GLM4 assigns &gt; 99% scores to all methods, mirroring its behavior on CEBiasBench. This cross-dataset consistently confirms that cultural biases exist in evaluators, further justifying our MAV framework. The results demon-

<!-- PAGE 8 -->

strate that MACD's effectiveness extends robustly to Arabic language contexts.

Figure 4: Bias distribution on CAMeL benchmark (GPT4o backbone).

<!-- image -->

Bias Distribution Analysis. Figure 5 visualizes the bias distribution on CEBiasBench-CN, directly addressing the question raised in our introduction: does prompting in Chinese counterbalance Western dominance, or merely shift bias? The heatmap reveals that baseline models exhibit a strong East Asian concentration (38%-48% for direct generation, CoT, and MAD), confirming that language switching induces a bias shift toward the prompt language's culture. However, Western bias persists at 8%-14%, indicating incomplete elimination. This validates our hypothesis that language switching alone cannot achieve cultural neutralityit merely relocates the bias. In contrast, MACD reduces East Asian bias to 20%-21% while maintaining low Western bias, demonstrating that structured multi-cultural deliberation is necessary for true balance.

Response Quality Analysis. To verify that MACD maintains informativeness while achieving cultural neutrality, we analyze information density (unique content words per 100 characters) versus response length. As shown in Figure 6, MACD achieves the highest information density (8.65) compared to direct generation (8.11), CoT (6.60), and MAD (4.29), while maintaining concise responses. This demonstrates that MACD's brevity reflects effective synthesis rather than information loss.

## 5.3 Ablation Study

We ablate key components on CEBiasBench-EN using Qwen-32B as evaluator (Table 2).

Component-wise Analysis. We ablate two core components: (1) cultural personas and (2) the seeking common ground strategy. Removing cultural personas drops the No Bias Rate from 80.0% to 59.0%, while removing the consensus strategy reduces it to 61.0%. This validates that both components are essential and complementary.

Figure 5: Bias heatmap to show the distribution of culturally biased answer.

<!-- image -->

Figure 6: Response quality analysis: Length vs. Information Density. MACD achieves the highest density while maintaining concise responses.

<!-- image -->

Effect of Agent Number. Performance improves with more agents: 60.0% (1 agent) → 80.0% (5 agents). The single-agent baseline shows that multicultural deliberation is crucial for fairness.

Effect of Debate Rounds. Two rounds (80.0%) achieve optimal performance. One round (53.0%) lacks inter-agent refinement, while three rounds (64.0%) show degradation likely due to oversmoothing where excessive iteration loses valuable cultural nuances.

Table 2: Ablation study on CEBiasBench-EN (Qwen32B evaluator).

| Variant | Persona | Strategy | #Agents | No Bias (%) |
|---|:---:|:---:|---:|---:|
| **Component Ablation** |  |  |  |  |
| w/o Persona | × | ✓ | 5 | 59.0 |
| w/o Strategy | ✓ | × | 5 | 61.0 |
| MACD-Full | ✓ | ✓ | 5 | 80.0 |
| **#Agents Ablation** |  |  |  |  |
| 1 Agent | ✓ | ✓ | 1 | 60.0 |
| 3 Agents | ✓ | ✓ | 3 | 70.0 |
| 5 Agents (Full) | ✓ | ✓ | 5 | 80.0 |
| **Rounds Ablation** |  |  |  |  |
| 1 Round | ✓ | ✓ | 5 | 53.0 |
| 2 Rounds (Full) | ✓ | ✓ | 5 | 80.0 |
| 3 Rounds | ✓ | ✓ | 5 | 64.0 |

## 6 Conclusion

In this paper, we investigate the pivotal question raised in multilingual cultural bias research: Does prompting in non-Western languages counterbalance Western dominance? To answer this, we intro-

<!-- PAGE 9 -->

duce CEBiasBench, a Chinese-English bilingual benchmark. Our experiments reveal that language switching merely relocates bias-Chinese prompts induce East Asian bias while Western bias persists. To address this, we propose MACD, a training-free multi-agent framework that synthesizes diverse cultural perspectives through structured deliberation. Additionally, we identify systematic evaluator bias, where LLM judges exhibit dramatically varying discrimination. This motivates our MAV (MultiAgent Vote) protocol, which aggregates diverse judgments via majority voting for reliable assessment. Experiments show that MACD achieves 57.6% average No Bias Rate evaluated by LLMas-judge and 86.0% evaluated by MAV (vs. 47.6% and 69.0% for direct generation using GPT-4o) and generalizes to Arabic contexts.

## Limitations

Despite the effectiveness of our proposed method, our work has several limitations. First, CEBiasBench focuses on five everyday cultural domains and a fixed set of discrete labels, which may not capture finer-grained cultural nuances, intracultural diversity, or culturally mixed responses; expanding coverage to more regions, languages, and interaction types remains future work. Second, due to budget constraints associated with API usage, we did not conduct repeated multi-run evaluations. As a result, the stability of the reported results across multiple runs remains to be further validated.

## Ethics Statement

We study cultural bias in LLMs using publicly available model outputs. We avoid collecting personal data and do not infer sensitive attributes about individuals. To reduce stereotyping risk, we (i) design culture-neutral prompts, (ii) report a 'No Bias' class and dispersion metrics, and (iii) analyze evaluator bias and known failure modes. We aggregate statistics under a permissive license; no raw human data are released. This work aims to improve fairness and does not enable targeting or profiling of specific groups, and we do not claim that cultural neutrality is universally optimal for all tasks or user preferences.

## Acknowledgments

This work was supported in part by the National Natural Science Foundation of China (NSFC) with

Grant No. 62172383 and No. 62231015, Anhui Provincial Key R&amp;D Program with Grant No.S202103a05020098, Research Launch Project of University of Science and Technology of China (USTC) with Grant No.KY0110000049.

## References

Marwa Abdulhai, Gregory Serapio-Garcia, Clément Crepy, Daria Valter, John Canny, and Natasha Jaques. 2024. Moral foundations of large language models. In Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing , pages 17737-17752.

Badr AlKhamissi, Muhammad ElNokrashy, Mai AlKhamissi, and Mona Diab. 2024. Investigating cultural alignment of large language models. arXiv preprint arXiv:2402.13231 .

Emily M Bender, Timnit Gebru, Angelina McMillanMajor, and Shmargaret Shmitchell. 2021. On the dangers of stochastic parrots: Can language models be too big? In Proceedings of the 2021 ACM conference on fairness, accountability, and transparency , pages 610-623.

Yong Cao, Li Zhou, Seolhwa Lee, Laura Cabello, Min Chen, and Daniel Hershcovich. 2023. Assessing cross-cultural alignment between chatgpt and human societies: An empirical study. arXiv preprint arXiv:2303.17466 .

- Souradip Chakraborty, Jiahao Qiu, Hui Yuan, Alec Koppel, Furong Huang, Dinesh Manocha, Amrit Singh Bedi, and Mengdi Wang. 2024. Maxmin-rlhf: Alignment with diverse human preferences. arXiv preprint arXiv:2402.08925 .

Yu Ying Chiu, Liwei Jiang, Bill Yuchen Lin, Chan Young Park, Shuyue Stella Li, Sahithya Ravi, Mehar Bhatia, Maria Antoniak, Yulia Tsvetkov, Vered Shwartz, and 1 others. 2024. Culturalbench: a robust, diverse and challenging benchmark on measuring (the lack of) cultural knowledge of llms.

Jesse Dodge, Maarten Sap, Ana Marasovi´ c, William Agnew, Gabriel Ilharco, Dirk Groeneveld, Margaret Mitchell, and Matt Gardner. 2021. Documenting large webtext corpora: A case study on the colossal clean crawled corpus. In Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing , pages 1286-1305.

Yilun Du, Shuang Li, Antonio Torralba, Joshua B Tenenbaum, and Igor Mordatch. 2023. Improving factuality and reasoning in language models through multiagent debate. In Forty-first International Conference on Machine Learning .

Abhimanyu Dubey, Abhinav Jauhri, Abhinav Pandey, Abhishek Kadian, Ahmad Al-Dahle, Aiesha Letman, Akhil Mathur, Alan Schelten, Amy Yang, Angela

<!-- PAGE 10 -->

- Fan, and 1 others. 2024. The llama 3 herd of models. arXiv e-prints , pages arXiv-2407.
- Team GLM, Aohan Zeng, Bin Xu, Bowen Wang, Chenhui Zhang, Da Yin, Dan Zhang, Diego Rojas, Guanyu Feng, Hanlin Zhao, and 1 others. 2024. Chatglm: A family of large language models from glm-130b to glm-4 all tools. arXiv preprint arXiv:2406.12793 .
- Daya Guo, Dejian Yang, Haowei Zhang, Junxiao Song, Ruoyu Zhang, Runxin Xu, Qihao Zhu, Shirong Ma, Peiyi Wang, Xiao Bi, and 1 others. 2025a. Deepseek-r1: Incentivizing reasoning capability in llms via reinforcement learning. arXiv preprint arXiv:2501.12948 .
- Geyang Guo, Tarek Naous, Hiromi Wakaki, Yukiko Nishimura, Yuki Mitsufuji, Alan Ritter, and Wei Xu. 2025b. Care: Aligning language models for regional cultural awareness. arXiv preprint arXiv:2504.05154 .
- Dayeon Ki, Rachel Rudinger, Tianyi Zhou, and Marine Carpuat. 2025. Multiple llm agents debate for equitable cultural alignment. arXiv preprint arXiv:2505.24671 .
- Cheng Li, Mengzhuo Chen, Jindong Wang, Sunayana Sitaram, and Xing Xie. 2024a. Culturellm: Incorporating cultural differences into large language models. Advances in Neural Information Processing Systems , 37:84799-84838.
- Cheng Li, Damien Teney, Linyi Yang, Qingsong Wen, Xing Xie, and Jindong Wang. 2024b. Culturepark: Boosting cross-cultural understanding in large language models. Advances in Neural Information Processing Systems , 37:65183-65216.
- Huihan Li, Liwei Jiang, Jena D Hwang, Hyunwoo Kim, Sebastin Santy, Taylor Sorensen, Bill Yuchen Lin, Nouha Dziri, Xiang Ren, and Yejin Choi. 2024c. Culture-gen: Revealing global cultural perception in language models through natural language prompting. arXiv preprint arXiv:2404.10199 .
- Aixin Liu, Bei Feng, Bing Xue, Bingxuan Wang, Bochao Wu, Chengda Lu, Chenggang Zhao, Chengqi Deng, Chenyu Zhang, Chong Ruan, and 1 others. 2024. Deepseek-v3 technical report. arXiv preprint arXiv:2412.19437 .
- Kelly Marchisio, Wei-Yin Ko, Alexandre Bérard, Théo Dehaze, and Sebastian Ruder. 2024. Understanding and mitigating language confusion in llms. arXiv preprint arXiv:2406.20052 .
- Reem Masoud, Ziquan Liu, Martin Ferianc, Philip C Treleaven, and Miguel Rodrigues Rodrigues. 2025. Cultural alignment in large language models: An explanatory analysis based on hofstede's cultural dimensions. In Proceedings of the 31st International Conference on Computational Linguistics , pages 84748503.
- Mistral AI. 2024. Mistral large, our new flagship model. https://mistral.ai/news/ mistral-large . Technical report.
- Simon Münker. 2025. Cultural bias in large language models: Evaluating ai agents through moral questionnaires. arXiv preprint arXiv:2507.10073 .
- Rémi Munos, Michal Valko, Daniele Calandriello, Mohammad Gheshlaghi Azar, Mark Rowland, Zhaohan Daniel Guo, Yunhao Tang, Matthieu Geist, Thomas Mesnard, Côme Fiegel, and 1 others. 2024. Nash learning from human feedback. In Forty-first International Conference on Machine Learning .
- Junho Myung, Nayeon Lee, Yi Zhou, Jiho Jin, Rifki Putri, Dimosthenis Antypas, Hsuvas Borkakoty, Eunsu Kim, Carla Perez-Almendros, Abinew Ali Ayele, and 1 others. 2024. Blend: A benchmark for llms on everyday knowledge in diverse cultures and languages. Advances in Neural Information Processing Systems , 37:78104-78146.
- Tarek Naous, Michael J Ryan, Alan Ritter, and Wei Xu. 2024a. Having beer after prayer? measuring cultural bias in large language models. In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) , pages 16366-16393, Bangkok, Thailand. Association for Computational Linguistics.
- Tarek Naous, Michael J Ryan, Alan Ritter, and Wei Xu. 2024b. Having beer after prayer? measuring cultural bias in large language models. In Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) , pages 16366-16393.
- Tarek Naous, Anagha Savit, Carlos Rafael Catalan, Geyang Guo, Jaehyeok Lee, Kyungdon Lee, Lheane Marie Dizon, Mengyu Ye, Neel Kothari, Sahajpreet Singh, and 1 others. 2025. Camellia: Benchmarking cultural biases in llms for asian languages. arXiv preprint arXiv:2510.05291 .
- Tarek Naous and Wei Xu. 2025. On the origin of cultural biases in language models: From pre-training data to linguistic phenomena. In Proceedings of the 2025 Conference of the Nations of the Americas Chapter of the Association for Computational Linguistics: Human Language Technologies (Volume 1: Long Papers) , pages 6423-6443, Albuquerque, New Mexico. Association for Computational Linguistics.
- OpenAI. 2024. Gpt-4o: Our most advanced ai model. Accessed: 2024-07-20.
- OpenAI. 2025. Introducing gpt-5. Technical report, OpenAI. Technical report.
- Siddhesh Pawar, Junyeong Park, Jiho Jin, Arnav Arora, Junho Myung, Srishti Yadav, Faiz Ghifari Haznitrama, Inhwa Song, Alice Oh, and Isabelle Augenstein. 2025. Survey of cultural awareness in language models: Text and beyond. Computational Linguistics , pages 1-96.

<!-- PAGE 11 -->

- Haoyi Qiu, Alexander Richard Fabbri, Divyansh Agarwal, Kung-Hsiang Huang, Sarah Tan, Nanyun Peng, and Chien-Sheng Wu. 2025. Evaluating cultural and social awareness of llm web agents. In Findings of the Association for Computational Linguistics: NAACL 2025 , pages 3978-4005.
- Shyam Sundhar Ramesh, Yifan Hu, Iason Chaimalas, Viraj Mehta, Pier Giuseppe Sessa, Haitham Bou Ammar, and Ilija Bogunovic. 2024. Group robust preference optimization in reward-free rlhf. Advances in Neural Information Processing Systems , 37:3710037137.
- Aida Ramezani and Yang Xu. 2023. Knowledge of cultural moral norms in large language models. arXiv preprint arXiv:2306.01857 .
- Virgile Rennard, Christos Xypolopoulos, and Michalis Vazirgiannis. 2025. Bias in the mirror: Are llms opinions robust to their own adversarial attacks. In Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) , pages 2128-2143.
- Weiyan Shi, Ryan Li, Yutong Zhang, Caleb Ziems, Sunny Yu, Raya Horesh, Rogério Abreu De Paula, and Diyi Yang. 2024. CultureBank: An online community-driven knowledge base towards culturally aware language technologies. In Findings of the Association for Computational Linguistics: EMNLP 2024 , pages 4996-5025, Miami, Florida, USA. Association for Computational Linguistics.
- Shivalika Singh, Angelika Romanou, Clémentine Fourrier, David Ifeoluwa Adelani, Jian Gang Ngui, Daniel Vila-Suero, Peerat Limkonchotiwat, Kelly Marchisio, Wei Qi Leong, Yosephine Susanto, and 1 others. 2025. Global mmlu: Understanding and addressing cultural and linguistic biases in multilingual evaluation. In Proceedings of the 63rd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) , pages 18761-18799.
- Nicholas Sukiennik, Chen Gao, Fengli Xu, and Yong Li. 2025. An evaluation of cultural value alignment in llm. arXiv preprint arXiv:2504.08863 .
- Yan Tao, Olga Viberg, Ryan S Baker, and René F Kizilcec. 2024. Cultural bias and cultural alignment of large language models. PNAS nexus , 3(9):pgae346.
- Yixin Wan, Xingrun Chen, and Kai-Wei Chang. 2025. Which cultural lens do models adopt? on cultural positioning bias and agentic mitigation in llms. arXiv preprint arXiv:2509.21080 .
- Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Fei Xia, Ed Chi, Quoc V Le, Denny Zhou, and 1 others. 2022. Chain-of-thought prompting elicits reasoning in large language models. Advances in neural information processing systems , 35:2482424837.
- Zhenjie Xu, Wenqing Chen, Yi Tang, Xuanying Li, Cheng Hu, Zhixuan Chu, Kui Ren, Zibin Zheng,
- and Zhichao Lu. 2025. Mitigating social bias in large language models: A multi-objective approach within a multi-agent framework. In Proceedings of the AAAI Conference on Artificial Intelligence , volume 39, pages 25579-25587.
- An Yang, Anfeng Li, Baosong Yang, Beichen Zhang, Binyuan Hui, Bo Zheng, Bowen Yu, Chang Gao, Chengen Huang, Chenxu Lv, and 1 others. 2025. Qwen3 technical report. arXiv preprint arXiv:2505.09388 .
- Jing Yao, Xiaoyuan Yi, Jindong Wang, Zhicheng Dou, and Xing Xie. 2025. Caredio: Cultural alignment of llm via representativeness and distinctiveness guided data optimization. arXiv preprint arXiv:2504.08820 .

## A Meta prompt

We construct the following meta-prompt to instantiate a debate setting for the LLM: "{ P i } You are currently participating in a debate, and there is round {round\_num} of the debate. (For round 1) {question}. Directly answer the question according to your culture. (For round 2 to T) Question: {question} Previous responses of people from other culture background: - { Cultural i } perspective: { response i } Based on other perspectives and ** {Prompt SCGRD } ** strategy, refine your answer to the question. You must summarize the common actions and examples with other cultures at the end of your refined answer. Don't over-analyze, such as what these cultural actions indicate or mean. You just discuss the original question."

## B Cultural Persona

We define distinct cultural personas for each agent to ensure a diverse and vivid representation. The specific cultural descriptions and values used in our experiments are:

- Western : 'You are a 29-year-old woman living in Amsterdam, the Netherlands. You speak English and Dutch, hold an MSc in Urban Planning, and work at a municipal planning agency. You cycle to work and spend weekends at museums or running outdoors. Living independently with your partner, you value privacy and contractual norms, prefer data- and evidence-based analysis at work, and make decisions that emphasize individual choice, equality, and transparent public rules while seeking defensible trade-offs between efficiency and fairness.' Values: individual rights, freedom, rational analysis, utilitarianism.

<!-- PAGE 12 -->

Table 3: The full result of the large language model in terms of cultural bias responses evaluated by LLM-as-judge and MAV on CEBiasBench. Numeric results denote No Bias / Western Bias / East Asian Bias / African Bias / Middle Eastern Bias / Regional or Other Bias.

| Language | Method | Generate / evaluate | gpt-4o | gpt-5 | DeepSeek-R1 | DeepSeek-V3 | mistral-large | llama-3.1-70b-instruct | glm4-9b-chat | Qwen3-32b | MAV (gpt-4o) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| en | Direct | gpt-4o | 60/40/0/0/0/0 | 73/27/0/0/0/0 | 30/66/0/0/0/4 | 41/59/0/0/0/0 | 17/81/0/0/0/2 | 10/90/0/0/0/0 | 99/1/0/0/0/0 | 50/47/0/0/0/1 | 69/31/0/0/0/0 |
| en | Direct | gpt-5 | 54/45/1/0/0/0 | 60/37/1/0/0/2 | 20/72/2/0/0/6 | 40/58/2/0/0/0 | 13/87/0/0/0/0 | 8/91/1/0/0/0 | 98/2/0/0/0/0 | 53/45/2/0/0/0 | 67/31/1/1/0/0 |
| en | Direct | DeepSeek-R1 | 53/44/3/0/0/0 | 65/31/2/0/0/2 | 15/79/2/0/0/4 | 41/57/2/0/0/0 | 13/85/1/0/0/0 | 6/94/0/0/0/0 | 95/5/0/0/0/0 | 51/44/3/0/0/2 | 63/34/2/1/0/0 |
| en | Direct | internlm3-8b-instruct | 71/26/0/0/0/0 | 72/25/0/0/0/0 | 31/63/0/0/0/3 | 49/48/0/0/0/0 | 29/68/0/0/0/0 | 16/81/0/0/0/0 | 92/5/0/0/0/0 | 64/32/1/0/0/0 | 77/20/0/0/0/0 |
| en | Direct | mistral-large | 49/46/3/0/0/1 | 59/36/2/0/0/2 | 27/58/4/0/0/11 | 42/55/2/0/0/1 | 11/82/4/1/0/2 | 14/84/2/0/0/0 | 99/1/0/0/0/0 | 49/47/4/0/0/0 | 62/35/3/0/0/0 |
| en | Direct | llama-3.1-8b-instruct | 51/48/1/0/0/0 | 63/35/0/0/0/2 | 23/70/1/0/0/6 | 42/57/1/0/0/0 | 15/83/1/0/0/1 | 6/94/0/0/0/0 | 97/3/0/0/0/0 | 45/50/2/0/0/3 | 63/36/1/0/0/0 |
| en | Direct | falcon-7b-instruct | 55/42/1/1/1/0 | 58/39/0/0/0/3 | 13/63/1/0/0/7 | 36/63/1/0/0/0 | 12/85/1/0/0/2 | 4/95/1/0/0/0 | 95/5/0/0/0/0 | 35/61/1/0/0/3 | 59/38/1/0/1/1 |
| en | Direct | glm4-9b-chat | 66/33/1/0/0/0 | 77/23/0/0/0/0 | 18/73/1/0/0/8 | 43/56/0/0/0/1 | 22/78/0/0/0/0 | 5/95/0/0/0/0 | 97/3/0/0/0/0 | 58/41/1/0/0/0 | 77/23/0/0/0/0 |
| en | Direct | Qwen3-8b | 70/30/0/0/0/0 | 82/18/0/0/0/0 | 31/62/0/0/0/7 | 46/54/0/0/0/0 | 27/73/0/0/0/0 | 7/93/0/0/0/0 | 98/2/0/0/0/0 | 63/36/1/0/0/0 | 81/19/0/0/0/0 |
| en | CoT | gpt-4o | 53/47/0/0/0/0 | 48/52/0/0/0/0 | 16/79/2/0/0/3 | 39/61/0/0/0/0 | 27/73/0/0/0/0 | 12/88/0/0/0/0 | 92/8/0/0/0/0 | 39/53/0/1/0/5 | 69/31/0/0/0/0 |
| en | CoT | gpt-5 | 62/37/1/0/0/0 | 73/25/0/0/0/2 | 31/61/0/0/0/8 | 56/44/0/0/0/0 | 13/85/2/0/0/0 | 10/90/0/0/0/0 | 97/2/0/0/0/0 | 50/46/3/0/0/1 | 69/29/1/0/1/0 |
| en | CoT | DeepSeek-R1 | 42/57/1/0/0/0 | 43/57/0/0/0/0 | 27/65/0/0/0/8 | 41/59/0/0/0/0 | 15/82/2/0/0/1 | 12/86/0/0/0/1 | 81/19/0/0/0/0 | 32/62/2/0/0/4 | 50/49/0/0/0/1 |
| en | CoT | internlm3-8b-instruct | 38/46/0/0/0/0 | 42/58/0/0/0/0 | 18/71/1/0/0/10 | 30/70/0/0/0/0 | 14/86/0/0/0/0 | 16/84/0/0/0/0 | 93/6/0/0/0/0 | 52/44/0/0/0/4 | 55/44/1/0/0/0 |
| en | CoT | mistral-large | 26/42/0/0/0/0 | 53/45/1/0/0/1 | 20/76/2/0/0/2 | 29/69/2/0/0/0 | 5/95/0/0/0/0 | 21/78/0/0/0/0 | 98/2/0/0/0/0 | 56/41/3/0/0/0 | 53/47/0/0/0/0 |
| en | CoT | llama-3.1-8b-instruct | 53/46/1/0/0/0 | 63/35/1/0/0/1 | 20/70/0/0/0/10 | 50/48/2/0/0/0 | 15/83/2/0/0/0 | 8/92/0/0/0/0 | 95/5/0/0/0/0 | 48/50/1/0/0/1 | 60/37/2/0/1/0 |
| en | CoT | falcon-7b-instruct | 58/37/1/0/2/2 | 64/31/1/0/2/2 | 14/71/2/0/0/11 | 38/58/1/0/2/1 | 14/82/2/0/1/1 | 6/93/0/0/1/0 | 93/7/0/0/0/0 | 40/57/1/0/2/0 | 72/27/0/0/1/0 |
| en | CoT | glm4-9b-chat | 38/62/0/0/0/0 | 60/40/0/0/0/0 | 6/88/0/0/0/6 | 29/71/0/0/0/0 | 5/95/0/0/0/0 | 3/97/0/0/0/0 | 92/8/0/0/0/0 | 42/56/1/0/1/0 | 56/44/0/0/0/0 |
| en | CoT | Qwen3-8b | 52/47/0/0/0/1 | 59/39/1/0/0/1 | 12/77/0/0/0/11 | 44/56/0/0/0/0 | 21/79/0/0/0/0 | 12/88/0/0/0/0 | 92/8/0/0/0/0 | 42/54/2/0/0/2 | 76/24/0/0/0/0 |
| en | MAD | gpt-4o | 53/47/0/0/0/0 | 50/50/0/0/0/0 | 18/77/0/0/0/5 | 20/79/0/0/0/1 | 14/56/30/0/0/0 | 6/92/2/0/0/0 | 96/4/0/0/0/0 | 59/40/0/0/0/1 | 59/41/0/0/0/0 |
| en | MAD | mistral-large | 58/42/0/0/0/0 | 51/48/1/0/0/0 | 24/72/2/0/0/2 | 31/68/1/0/0/0 | 5/95/0/0/0/0 | 28/72/0/0/0/0 | 98/2/0/0/0/0 | 73/25/2/0/0/0 | 40/60/0/0/0/0 |
| en | MAD | Qwen-8b | 59/41/0/0/0/0 | 72/26/2/0/0/0 | 23/70/2/0/0/5 | 39/61/0/0/0/0 | 9/91/0/0/0/0 | 29/71/0/0/0/0 | 98/2/0/0/0/0 | 62/38/0/0/0/0 | 63/37/0/0/0/0 |
| en | MACD | gpt-4o | 93/6/0/0/0/0 | 88/12/0/0/0/0 | 21/66/4/0/1/8 | 54/45/1/0/0/0 | 17/80/0/0/0/3 | 11/89/0/0/0/0 | 99/1/0/0/0/0 | 77/19/2/0/0/2 | 86/13/0/1/0/0 |
| en | MACD | mistral-large | 87/13/0/0/0/0 | 88/12/0/0/0/0 | 37/52/0/0/0/11 | 45/53/0/0/0/0 | 17/83/0/0/0/0 | 10/90/0/0/0/0 | 100/0/0/0/0/0 | 79/19/2/0/0/0 | 91/9/0/0/0/0 |
| en | MACD | Qwen-8b | 94/6/0/0/0/0 | 88/12/0/0/0/0 | 35/51/0/1/0/13 | 58/41/0/0/1/0 | 25/75/0/0/0/0 | 18/82/0/0/0/0 | 98/2/0/0/0/0 | 80/19/0/0/0/1 | 94/5/1/0/0/0 |
| cn | Direct | gpt-4o | 53/8/38/0/1/0 | 71/11/18/0/0/0 | 28/37/21/0/0/14 | 56/22/21/0/0/0 | 19/54/23/0/1/0 | 31/35/34/0/0/0 | 99/1/0/0/0/0 | 64/14/22/0/0/0 | 77/4/16/0/1/2 |
| cn | Direct | gpt-5 | 45/9/45/0/1/0 | 62/11/26/0/0/1 | 18/34/33/0/0/15 | 45/20/34/0/0/0 | 13/46/35/0/1/1 | 17/40/42/0/1/0 | 100/0/0/0/0/0 | 46/17/37/0/0/0 | 59/4/33/0/1/3 |
| cn | Direct | DeepSeek-R1 | 38/34/27/0/1/0 | 63/21/15/0/1/0 | 11/59/19/0/1/10 | 43/40/17/0/0/0 | 9/63/24/0/0/0 | 12/68/18/0/1/0 | 96/3/1/0/0/0 | 51/28/18/0/1/2 | 56/24/18/0/1/1 |
| cn | Direct | internlm3-8b-instruct | 49/16/31/1/1/0 | 67/14/15/0/0/2 | 31/35/20/0/0/12 | 53/26/19/0/0/0 | 24/46/25/0/1/1 | 35/37/28/0/0/0 | 95/3/0/0/0/0 | 65/21/9/0/1/2 | 66/8/21/0/1/2 |
| cn | Direct | mistral-large | 37/21/41/0/1/0 | 60/14/23/0/1/2 | 24/37/28/0/1/10 | 47/18/18/0/1/0 | 15/53/31/0/1/0 | 27/41/31/0/1/0 | 97/2/1/0/0/0 | 51/29/14/0/1/5 | 60/12/26/0/1/1 |
| cn | Direct | llama-3.1-8b-instruct | 46/9/44/0/1/0 | 77/13/9/0/0/1 | 27/41/17/0/0/15 | 46/36/17/0/0/1 | 10/61/22/0/1/0 | 30/49/21/0/0/0 | 97/3/0/0/0/0 | 66/21/11/0/0/2 | 72/10/15/0/2/1 |
| cn | Direct | falcon-7b-instruct | 39/20/40/0/1/0 | 70/15/12/0/0/3 | 16/57/12/0/0/15 | 16/52/20/0/0/0 | 3/64/16/0/1/1 | 19/67/14/0/0/0 | 96/2/2/0/0/0 | 37/31/23/0/0/6 | 58/15/20/0/1/6 |
| cn | Direct | glm4-9b-chat | 47/10/42/0/1/0 | 71/12/17/0/0/0 | 27/38/25/0/0/10 | 36/13/22/0/0/0 | 20/51/24/0/1/0 | 33/36/31/0/0/0 | 98/2/0/0/0/0 | 54/14/29/0/1/2 | 70/6/23/0/1/0 |
| cn | Direct | Qwen3-32b | 62/8/29/0/1/0 | 82/6/11/0/0/1 | 33/38/21/0/0/8 | 61/20/19/0/0/0 | 27/47/24/0/1/0 | 45/28/27/0/0/0 | 99/1/0/0/0/0 | 66/11/22/0/0/1 | 73/5/20/0/1/1 |
| cn | CoT | gpt-4o | 55/15/30/0/0/0 | 66/18/16/0/0/0 | 29/32/24/0/0/15 | 47/26/26/0/0/0 | 19/43/36/0/1/1 | 15/59/26/0/0/0 | 93/5/2/0/0/0 | 64/14/22/0/0/0 | 77/1/22/0/0/0 |
| cn | CoT | gpt-5 | 31/9/58/0/1/1 | 67/7/25/0/0/1 | 25/26/43/0/0/6 | 45/17/30/0/0/0 | 13/43/33/0/1/1 | 27/35/38/0/0/0 | 100/0/0/0/0/0 | 46/17/37/0/0/0 | 50/3/43/0/1/3 |
| cn | CoT | DeepSeek-R1 | 39/16/45/0/0/0 | 47/11/40/0/0/2 | 26/23/39/0/0/12 | 50/15/35/0/0/0 | 11/35/53/0/0/0 | 14/56/30/0/0/0 | 91/7/2/0/0/0 | 51/28/18/0/1/2 | 44/8/48/0/0/0 |
| cn | CoT | internlm3-8b-instruct | 31/38/29/0/1/0 | 61/19/17/0/1/2 | 33/34/22/0/0/11 | 47/26/26/0/1/0 | 17/38/43/0/1/0 | 18/64/17/0/1/0 | 92/8/0/0/0/0 | 64/21/10/0/1/2 | 60/7/31/0/1/1 |
| cn | CoT | mistral-large | 17/40/43/0/0/0 | 57/11/32/0/0/0 | 22/28/47/0/0/3 | 31/24/45/0/0/0 | 8/50/41/0/1/0 | 19/65/16/0/0/0 | 93/7/0/0/0/0 | 54/20/26/0/0/0 | 42/3/53/0/1/1 |
| cn | CoT | llama-3.1-8b-instruct | 42/7/49/0/1/1 | 74/11/14/0/0/1 | 31/35/22/0/0/12 | 40/21/22/0/2/0 | 19/50/18/0/1/0 | 34/42/24/0/0/0 | 99/1/0/0/0/0 | 66/21/11/0/0/2 | 68/5/26/0/1/0 |
| cn | CoT | falcon-7b-instruct | 39/26/34/0/0/1 | 73/17/7/0/0/3 | 15/65/8/0/0/12 | 18/43/21/0/0/0 | 3/66/22/0/1/1 | 22/67/11/0/0/0 | 91/9/0/0/0/0 | 34/37/26/0/1/2 | 64/18/10/0/0/8 |
| cn | CoT | glm4-9b-chat | 38/11/50/0/1/0 | 44/15/38/0/1/2 | 17/28/41/0/0/14 | 38/15/47/0/0/0 | 16/29/54/0/1/0 | 12/59/29/0/0/0 | 91/7/2/0/0/0 | 54/14/29/0/1/2 | 48/5/44/0/1/2 |
| cn | CoT | Qwen3-8b | 46/19/33/0/1/0 | 51/14/30/1/1/2 | 28/28/33/0/0/10 | 53/24/22/0/0/0 | 21/33/44/0/1/0 | 27/50/22/0/0/0 | 95/3/1/0/0/0 | 66/11/22/0/0/1 | 64/7/26/0/1/1 |
| cn | MAD | gpt-4o | 38/14/48/0/0/0 | 70/12/18/0/0/0 | 25/42/30/0/0/3 | 38/39/23/0/0/0 | 14/56/30/0/0/0 | 28/57/15/0/0/0 | 98/2/0/0/0/0 | 60/12/27/0/0/1 | 47/15/37/0/0/1 |
| cn | MAD | mistral-large | 44/17/38/0/1/0 | 46/11/43/0/0/0 | 32/22/40/0/0/6 | 42/21/37/0/0/0 | 19/54/26/0/1/0 | 28/57/15/0/0/0 | 96/4/0/0/0/0 | 65/8/26/0/0/0/1 | 34/11/50/0/2/3 |
| cn | MAD | Qwen-8b | 66/10/24/0/0/0 | 67/7/25/0/1/0 | 46/21/30/0/0/3 | 63/17/20/0/0/0 | 37/37/25/0/1/0 | 53/34/13/0/0/0 | 99/1/0/0/0/0 | 71/7/22/0/0/0 | 58/5/34/0/1/2 |
| cn | MACD | gpt-4o | 74/5/20/0/1/0 | 87/10/2/0/1/0 | 30/49/13/0/1/7 | 60/25/12/0/1/0 | 27/46/22/0/1/1 | 23/55/22/0/0/0 | 100/0/0/0/0/0 | 72/18/7/0/1/2 | 83/3/13/0/1/0 |
| cn | MACD | mistral-large | 63/30/6/0/1/0 | 91/7/1/0/0/0 | 24/62/6/0/0/8 | 53/45/1/0/0/0 | 7/84/8/0/1/0 | 10/85/5/0/0/0 | 98/2/0/0/0/0 | 70/22/6/0/0/2 | 69/25/5/0/1/0 |
| cn | MACD | Qwen-8b | 70/8/21/0/1/0 | 82/8/8/0/1/1 | 43/33/15/0/0/9 | 61/19/20/0/0/0 | 31/36/26/0/1/6 | 49/35/16/0/0/0 | 99/1/0/0/0/0 | 73/13/13/0/0/1 | 75/2/21/0/1/1 |

- East Asian : 'You are a 22-year-old man from Guangzhou, China, now a computer science master's student and part-time teaching assistant. You speak Mandarin and Cantonese and keep close contact with your parents. Your daily routine is tightly scheduled, planful, and self-disciplined; your communication is restrained and context-sensitive. In team settings, you aim for harmony and prudent solutions, respect elders and institutions, and attend to practicality and cost.' Values: social harmony, collective well-being, filial piety, face-saving.
- African : 'You are a 30-year-old woman in Nairobi, Kenya, fluent in Swahili and English. Trained in public health, you work on community health programs and often collaborate with neighborhood organizations on outreach and services. Close to your siblings, you take part in community events and music during
- festivals.' Values: community, Ubuntu (I am because we are), collective responsibility, respect for elders.
- Middle Eastern : 'You are a 32-year-old woman from Amman, Jordan, who speaks Arabic and English. You run a small catering business while managing family responsibilities. Daily life emphasizes hospitality and etiquette, with respect for tradition and legal norms.' Values: family honor, tradition, religious duty, hospitality.
- South Asian : 'You are a 27-year-old man living in Chennai, India, who speaks Tamil and English. You hold a B.E. in Electrical Engineering and work as an engineer in manufacturing, living with your parents and valuing festivals and family rituals. Your manner is polite and measured.' Values: dharma (moral duty), karma, spiritual growth, respect for hi-

<!-- PAGE 13 -->

erarchy.

## C Seeking Common Ground while Reserving Differences (SCGRD) prompt

We design the following prompt to implement the Seeking Common Ground while Reserving Differences (SCGRD) approach: "Adjust your response to align with your agents' examples, seeking a general answer to the question, trying to find common ground and maximize overall agreement."

## D Additional Examples

Here we provide an additional example illustrating the response difference before and after MACD.

Topic: Celebration Question : For breakfast, people usually eat \_\_\_\_\_\_\_\_.

Baseline (gpt-4o) : 'For breakfast, people usually eat eggs, toast, or cereal.'(Rated as Western Bias by gpt-4o).

MACDOutput (gpt-4o) : 'For breakfast, people usually eat a staple carbohydrate with a flavorful side and enjoy a warm beverage.'

Baseline (mistral-large) : 'cereal, toast, eggs, or fruit.'(Rated as Western Bias by gpt-4o).

MACDOutput (mistral-large) : 'Breakfast often includes warm, nourishing dishes with grains, proteins, fresh sides, and hot drinks.'

Baseline (Qwen3-8B) : 'For breakfast, people usually eat a variety of foods such as eggs, toast, cereal, fruits, and juices.' (Rated as Western Bias by gpt-4o).

MACD Output (Qwen3-8B) : 'For breakfast, people usually eat **delicious food** that varies by region, often including **staple items** like **bread**, **eggs**, and **porridge**, paired with **beverages** such as **tea** or **coffee**.'

## E Detailed Result

Table 3 reports the full results, including both the LLM-as-judge evaluation and the MAV breakdown that quantifies how model responses fall into different cultural-preference categories. Specifically, the entries a/b/c/d/e/f in the table correspond to No Bias / Western Bias / East Asian Bias / African Bias / Middle Eastern Bias / Regional or Other Bias, respectively.

Table 4: Results on CAMeL benchmark (backbone: GPT-4o). Each column shows response counts per bias category. Bold = highest No Bias count. Total: 378 responses.

| Method | Eval | None | West | E.Asia | Africa | M.East | Other |
|---|---|---:|---:|---:|---:|---:|---:|
| Direct | GPT-5 | 327 | 17 | 0 | 0 | 33 | 1 |
| Direct | GLM4 | 374 | 0 | 0 | 0 | 4 | 0 |
| CoT | GPT-5 | 338 | 14 | 0 | 0 | 24 | 2 |
| CoT | GLM4 | 376 | 0 | 0 | 0 | 2 | 0 |
| MAD | GPT-5 | 327 | 11 | 0 | 0 | 37 | 3 |
| MAD | GLM4 | 374 | 2 | 0 | 0 | 2 | 0 |
| MACD | GPT-5 | 366 | 5 | 0 | 0 | 5 | 1 |
| MACD | GLM4 | 376 | 0 | 0 | 0 | 2 | 0 |

## F Results on CAMeL Benchmark

To further validate the generalization capability of our approach beyond the Chinese-English bilingual setting, we evaluate on the Arabic CAMeL benchmark (Naous et al., 2024a). Specifically, we focus on the culturally neutral subset CAMeLAg (378 questions) to minimize the influence of Arabic-specific cultural priors on model behavior. Table 4 presents the detailed results comparing direct generation, CoT, MAD, and MACD on the CAMeL benchmark using GPT-4o as the generation backbone. We employ two evaluators: GPT-5 and GLM4. Each row shows the number of responses classified into different bias categories: No Bias / Western Bias / East Asian Bias / African Bias / Middle Eastern Bias / Regional or Other Bias. The results demonstrate that MACD achieves the highest No Bias count (366 out of 378) when evaluated by GPT-5, representing a 96.8% unbiased rate. This significantly outperforms direct generation (327/378, 86.5%), CoT (338/378, 89.4%), and MAD (327/378, 86.5%). When evaluated by GLM4, MACD achieves 376 out of 378 unbiased responses (99.5%), though we note that GLM4 assigns high scores ( &gt; 99%) to all methods, indicating limited discriminative power. These results confirm that our culturally grounded multi-agent debate framework generalizes effectively to Arabic language contexts, demonstrating cross-lingual robustness in mitigating cultural bias.
