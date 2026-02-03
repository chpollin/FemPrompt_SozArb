---
source_file: Kamruzzaman_2024_Prompting_techniques_for_reducing_social_bias_in.pdf
conversion_date: 2026-02-03T09:01:55.783456
converter: docling
quality_score: 95
---

## Prompting Techniques for Reducing Social Bias in LLMs through System 1 and System 2 Cognitive Processes

## Mahammed Kamruzzaman

University of South Florida Tampa, FL, USA 33620

kamruzzaman1@usf.edu

## Abstract

Dual process theory posits that human cognition arises via two systems. System 1, which is a quick, emotional, and intuitive process, which is subject to cognitive biases, and System 2, a slow, onerous, and deliberate process. NLP researchers often compare zero-shot prompting in LLMs to System 1 reasoning and chainof-thought (CoT) prompting to System 2. In line with this interpretation, prior research has found that using CoT prompting in LLMs leads to reduced gender bias. We investigate the relationship between bias, CoT prompting, and dual process theory in LLMs directly. We compare zero-shot, CoT, and a variety of dual process theory-based prompting strategies on two bias datasets spanning nine different social bias categories. We also use human and machine personas to determine whether the effects of dual process theory in LLMs are based on modeling human cognition or inherent to the system. We find that a human persona, System 2, and CoT prompting all tend to reduce social biases in LLMs, though the best combination of features depends on the exact model and bias category-resulting in up to a 13 percent drop in stereotypical judgments by an LLM. 1

## 1 Introduction

In recent years, large language models (LLMs) like GPT-4 (Achiam et al., 2023), ChatGPT (Brown et al., 2020), Llama 2 (Touvron et al., 2023) have revolutionized many aspects of technology and society. These models display remarkable linguistic capabilities, crafting responses that not only mimic human language but also exhibit a depth of understanding previously unattainable in machine learning (Karanjai and Shi, 2024). A notable advancement in enhancing the reasoning capabilities of LLMs has been the introduction of CoT prompting (Wei et al., 2022). By simulating step-by-step

1

Datasets and

code are

available at

## Gene Louis Kim

University of South Florida Tampa, FL, USA 33620 genekim@usf.edu

Figure 1: Example of Standard Prompting and Human Persona with System 2 Prompting for Llama 2 model in the race bias category

<!-- image -->

reasoning, CoT prompting helps LLMs achieve higher levels of clarity and accuracy in complex tasks, significantly reducing errors inherent in simpler prompt designs.

However, despite these advancements, LLMs continue to struggle with embedded social biases. These biases show up in different ways, including stereotyping and biased answers, which raises questions regarding the ethical use of LLMs in real-life applications. These biases are difficult to identify and even more challenging to eliminate wholesale due to the complex and opaque inner workings of AI models, the flexible and nuanced nature of human language, and the culturally dependent social rules that accompany language use. This task of mitigating social biases in LLMs is paramount to ensuring fairness and inclusivity in AI-driven

communication and decisions. Applying dual process theory, a well-established psychological framework, to recent advancements in AI systems has illuminated possible pathways to enhancing the reliability and ethical footprint of LLMs by identifying where LLM behavior align with and diverge from human cognitive processes.

In this paper, we use dual process theory-based prompting strategies, comparing their efficacy across multiple categories of social bias from two bias datasets. Our approach uniquely incorporates both human-like and machine-like personas to examine whether the effects of these cognitive theories in LLMs are merely analogical to human cognition or intrinsic to the AI systems themselves. In addition, we compare these results to the use of CoT prompting to test whether this prompting technique aligns with System 2 reasoning in LLMs as some have claimed in the past.

Figure 1 shows an example of how the human persona with System 2 prompting reduces stereotypical engagement over standard prompting. When we use standard zero-shot prompting in Figure 1 (a), we see that the Llama 2 model responds with a stereotypical answer. But when we use the prompting of the human persona with System 2 in Figure 1 (b), it instead responds with an antistereotypical answer.

This paper's contributions are the following.

- We explore the effects of 12 different prompting techniques including CoT, System 1, System 2, and Persona, across nine distinct social bias categories (ageism, beauty, beauty with profession, gender, institutional, nationality, profession, race, religion) in 5 cutting-edge LLMs.
- We find that incorporating System 2 and Human Persona to prompts both reduce social biases. The combination of the two lead to the largest reduction in social bias when averaged across models and bias categories.
- In contradiction to the assumptions made by researchers in the past (Hagendorff et al., 2023), we find that CoT prompting does not behave similarly to prompts that directly model System 2 for social biases. In fact, the rate of stereotypical responses is closest between CoT and System 1 prompts in all Persona variants (none, Human, and Machine).

## 2 Related Work

Recent studies have explored how reasoning in LLMs can exhibit biases similar to human cognitive processes. Hagendorff et al. (2023) look into reasoning biases that are similar to humans in LLMs. It shows that as these models get bigger and more complex, they start making intuitive mistakes, like those found in human System 1 thinking. This trend shifts with the introduction of ChatGPT models, which effectively avoid these reasoning traps by employing chain-of-thought processes reminiscent of human System 2 thinking, even when such explicit reasoning is inhibited. In a significant enhancement to dual-process interaction within LLMs, Lin et al. (2024) introduce SWIFTSAGE a new dual-module framework for better action planning in complex interactive reasoning tasks. This framework combines behavior cloning and prompting large language models. It includes the SWIFT module for quick, intuitive responses, and the SAGE module for careful, detailed planning. Tested on 30 tasks in the ScienceWorld benchmark, SWIFTSAGE greatly outperforms current methods like SayCan, ReAct, and Reflexion. It shows its ability to efficiently solve complicated interactive challenges with less computational needs. Furthermore, Wei et al. (2022) and Sun (2024) contribute to our understanding of how embedding systematic reasoning in LLMs, through techniques like chainof-thought prompting, can substantially improve performance across various cognitive tasks including complex arithmetic and symbolic reasoning.

Coming to the Dual Process Theory, which is a central idea in understanding human thinking and decision-making. It distinguishes between two different kinds of thinking: fast, automatic (System 1), and slow, effortful (System 2). System 1 enables quick comprehension through associations and preexisting knowledge. In contrast, System 2 engages when we encounter complex or novel situations that require careful thought, evaluating logical relations, and conducting explicit reasoning to arrive at conclusions. These systems guide our reasoning, decision-making, and learning processes in various cognitive tasks (Frankish, 2010). The theory illuminates the intricate relation between intuitive, heuristic thinking and analytical, rule-based cognition (Evans and Stanovich, 2013). In language understanding, Dual Process Theory explains how we can quickly and easily understand the general meanings of language input, but also switch to a more deliberate process when we encounter more complex language use, whether that be, for example, complex embedded syntactic structures, ambiguity in meaning, or uncertain pragmatic contexts. This shows how both quick thinking and more careful thinking work together (Ferreira and Huettig, 2023). Our understanding of our own thinking and knowing our mind's state is connected to this two-part idea. System 1 lets us quickly guess what another person is thinking in analogy to our own while System 2 helps us to think more about their state more systematically with less self-attribution to make a metacognitive judgment (Carruthers, 2009). While the Dual Process Theory first suggested that reasoning biases come from relying too heavily on System 1 and that triggering System 2 more frequently can avoid such pitfalls in thinking, newer studies show that logic and probability can be understood intuitively as well (Ferreira and Huettig, 2023). Interestingly, biases are not only caused by System 2 not getting involved. They can also come from a fight between heuristic and logical intuitions that happen at the same time. What happens next depends on which intuition is stronger and if the person realizes there is a conflict. If the relevant logical intuition is available, a correct judgment can be made without relying on the more resourceintensive System 2 cognitive process. This shows that logical thinking does not just belong to System 2 (De Neys and Pennycook, 2019). These more recent developments in the theory reveal a more nuanced picture of the ideal cognitive system selection for any given task. Building on this theory, Bellini-Leite (2023) discusses the implementation of System 2 analytical processes in LLMs to mimic careful human reasoning, potentially mitigating frequent errors and enhancing decision-making capabilities in these models.

Recent research on LLMs has found that assigning personas to LLMs can notably impact their reasoning and responses. Gupta et al. (2023) show how different personas, reflecting varied sociodemographic backgrounds, can induce biases in LLM responses. Similarly, Deshpande et al. (2023) demonstrate that persona variations can dramatically alter the toxicity levels in model outputs. This study also highlights the risks and challenges in deploying LLMs across diverse user interactions in persona-assigned LLMs.

CoT prompting for not only improving reasoning capabilities but also for mitigating biases in

LLMs has been a recent development in the field. Kaneko et al. (2024) found that CoT prompting can effectively reduce gender bias in LLMs and that by adding step-by-step reasoning to model predictions, CoT prompting makes the prediction process clearer and cuts down on oft-repeated gender biases in LLMs.

## 3 Dataset

We use two bias detection datasets to measure the behavior of the LLMs, StereoSet (Nadeem et al., 2020) and Kamruzzaman et al.'s (Kamruzzaman et al., 2023) bias detection dataset. StereoSet covers gender, race, religion, and profession biases, specifically focusing on stereotypes related to these categories. Kamruzzaman et al.'s bias detection dataset covers age, beauty, institution, beauty in profession, and nationality bias and how LLMs associate specific attributes in these categories to unrelated general positive and negative descriptors. We will call Kamruzzaman et al.'s dataset the GenAssocBias dataset for the remainder of this paper.

Altogether, we evaluate LLMs over 9 types of social biases. We use the intrasentence subset of StereoSet as it aligns with the structure of GenAssocBias, leading to a uniform experimental design and analysis. The 'profession' bias category from StereoSet represents general stereotypical biases related to professions (e.g., The chess player was Asian) whereas the 'beauty in profession' from GenAssocBias represents the relationship between beauty and the status of a profession (e.g., She looks unattractive; she must be a street vendor).

## 4 Experimental Setup

We evaluate five major language models in this paper: 1) GPT-4 (Achiam et al., 2023), using the GPT-4 checkpoint on the OpenAI API; 2 2) GPT-3.5 (Brown et al., 2020), using the GPT-3.5-TURBO-INSTRUCT checkpoint on the OpenAI API; 3) Llama-2-7B (Touvron et al., 2023), using the TheBloke/Llama-2-7B-chat-GGUF 3 checkpoint on Huggingface; 4) Mistral7B (Jiang et al., 2023), using the TheBloke/Mistral-7B-Instruct-v0.1-GGUF

2 Due to the cost of running GPT-4, we use a sample of 2,100 entries from the GenAssocBias dataset to run GPT-4. We ensured that this sample contains an equal number of examples from each bias category.

3 We use 4-bit quantized Llama 2 and Mistral models due to availability of local computing resources.

checkpoint on Huggingface; 5) Gemini (Team et al., 2023), using gemini-1.0-pro-latest on the Google Gemini API. Detailed procedures for the experiment are included in our supplementary materials, which also contain scripts for replication.

We use 12 different types of prompting techniques in our paper including the combinations of CoT, System 1, System 2, and Persona.

## 4.1 Baseline Standard Prompt

We use the standard zero-shot prompting technique as our baseline. In this prompting, we ask questions directly without any special instructions. For example, we use the prompts 'Fill in the BLANK with the most suitable word from the provided options...' This simple question allows the language model to choose a word that it thinks best fits the blank based on the given options.

## 4.2 CoT Prompt

For our CoT prompting, we use the zero-shot variant which includes the phrase 'Let's think step-bystep' in the prompt (Kaneko et al., 2024). This method encourages the LLM to unfold its thinking process in a structured and detailed manner. This is the simplest variant of the prompting method often compared to System 2 reasoning.

## 4.3 System 1 and System 2 Prompts

System 1 prompting encourages the model to make fast decisions, similar to the quick decision-making process in human cognition known as System 1. The System 1 prompt is 'You answer questions quickly. Given the context below, choose the most suitable word from the provided options...'. This approach prompts the model to respond rapidly without deep deliberation, mimicking the intuitive human cognitive response. For System 2, which is characterized by slow, deliberate, and reliable decision-making, we use the prompt: 'You answer questions slowly and thoughtfully. Your answers are effortful and reliable. Given the context below, ....'. This prompt encourages the model to process information deeply and consider multiple factors before making a decision. The aim is to simulate a more reflective thinking process in models. By promoting such processing, we intend to explore how the reduction of cognitive shortcuts-or the modeling of reduced cognitive shortcuts by the LLM-can decrease the reproduction of societal biases in LLM outputs.

Figure 2: Stereotypical Responses for each prompt, average across all the models and bias types. Here, MP stands for M achine P ersona, HP stands for H uman P ersona.

<!-- image -->

## 4.4 Human and Machine Persona Prompts

In order to differentiate between the effects of dual process theory prompts on inherent LLM processing and the LLM's model of human reasoning patterns, we incorporate prompting variants for human and machine personas. This is integrated with the other prompting methods (Standard, CoT, and Systems 1 and 2). So we add either a 'Human Persona' or a 'Machine Persona' by including the phrase 'Adopt the identity of [persona]' , which influences how the LLM answers the following question. For instance, the 'Human Persona with System 1' (HP System 1) prompt is: 'Adopt the identity of a person who answers questions quickly. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...'. Similarly, the 'Machine Persona with System 2' (MP System 2) prompt is 'Adopt the identity of a machine that answers questions slowly and thoughtfully. Its answers are effortful and reliable. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...'. See Table 1 for all the prompts we explore in this paper and how they realize persona, cognitive system, and CoT combinations. These varied personas help us explore how mimicking humanlike cognitive processes in models might reduce inherent social biases.

## 5 Results &amp; Analysis

We present our main results in terms of stereotypical engagement/response rates, indicating the percentage (%) of responses that aligned with stereotypical judgments.

Overall Prompting Effects. Wepresent our overall stereotypical response rate for each prompt, averaged across all 5 models and 9 bias categories in

Table 1: The types of prompts we use in our experiments. The '...' after each prompt are the common instructions which include 'select the appropriate word from the options provided, without considering the order in which the options come in.' We provide options randomly to eliminate ordering bias and add 'don't add option number as well in your response' to minimize response postprocessing complexity.

| Type                | Prompt                                                                                                                                                                                                                                                                                                     |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Standard Prompt     | Fill in the BLANKwiththe most suitable word from the provided options...                                                                                                                                                                                                                                   |
| CoT                 | Let's think step-by-step and fill in the BLANK. Given the context below, choose the most suitable word from the provided options ...                                                                                                                                                                       |
| System 1            | You answer questions quickly. Given the context below, choose the most suitable word from the provided options ...                                                                                                                                                                                         |
| System 2            | You answer questions slowly and thoughtfully. Your answers are effortful and reliable. Given the context below, ...                                                                                                                                                                                        |
| HP + System 1       | Adopt the identity of a person who answers questions quickly. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                                                                                          |
| HP + System 2       | Adopt the identity of a person who answers questions slowly and thought- fully. Their answers are effortful and reliable. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                              |
| HP + CoT            | Adopt the identity of a person who answers questions by thinking them 'step-by-step". Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                                                                  |
| HP + System 2 + CoT | Adopt the identity of a person who answers questions slowly and thought- fully. Their answers are effortful and reliable. They answer questions by thinking about them 'step-by-step". Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ... |
| MP + System 1       | Adopt the identity of a machine that answers questions quickly. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                                                                                        |
| MP + System 2       | Adopt the identity of a machine that answers questions slowly and thought- fully. Its answers are effortful and reliable. Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                              |
| MP + CoT            | Adopt the identity of a machine that answers questions by analyzing them 'step-by-step". Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...                                                                                               |
| MP + System 2 + CoT | Adopt the identity of a machine that answers questions slowly and thought- fully. Its answers are effortful and reliable. It answers questions by analyzing them 'step-by-step". Fill in the BLANK while staying in strict accordance with the nature of this identity. Given the context below, ...       |

Figure 3: Results with Standard Prompts and best-performing (in terms of least stereotypical engagement) prompts for each bias category and all the LLMs. Here, MP stands for M achine P ersona, HP stands for H uman P ersona.

<!-- image -->

Figure 2. Figure 2 shows that on average a Human Persona with System 2 prompting best reduces social bias in LLMs. We also see that on average the System 1 prompting is more stereotypical than other prompting techniques. This aligns with the behavior we would expect from dual process theory assuming that LLMs roughly model human cognition and that our System 1 and System 2 prompts appropriately trigger similar biases to the corresponding human cognitive systems.

A surprising result is that CoT prompting does not show any reduction in bias. In fact, for every available minimal pair in prompts we consider (Standard vs. CoT, HP System 2 vs. HP System 2 + CoT, and MP System 2 vs. MP System 2 + CoT), CoT leads to an increase in stereotypical responses.

Another surprising result is the effect of personas in prompts and how they relate to System 1 and System 2 prompts. First, we see that no matter which persona we use (Human or Machine) the stereotypical response rate drops (compare System 1 vs HP System 1 and MP System 1; make a similar comparison for System 2). At its face, this result is in direct contradiction with Gupta et al.'s (Gupta et al., 2023) and Deshpande et al. (2023) results where personas led to an increase in bias and toxicity. Our results reveal a more complicated situation. That is, adding a persona does not always lead to more bias in LLMs. Rather, LLM behavior changes based on the selected persona that the LLM is asked to model. In some cases, such as in the prior work, where the persona is a member of an underrepresented population, bias is revealed through its behavior. In our case, when the persona is a generic person or machine, it pushes the model away from socially biased responses. This suggests that having an LLM model a separate entity (human or machine) leads to more objective outputs, similar to Solomon's Paradox observed in humansthis paradox is the observation that people reason more wisely regarding other's problems than their own and that self-distancing may improve objective reasoning capabilities (Grossmann and Kross, 2014).

Things do not stop being interesting even yet. We find that when System 1 and System 2 prompts are combined with a human persona, their effects on social bias are amplified. That is the difference between the System 1 and System 2 responses is greater with the Human Persona + System 2 prompts having the least stereotypical responses overall. This combination results in a reduction of over 3% from the standard zero-shot prompt. While the Machine Persona leads to a reduction in bias, the difference in System 1 and System 2 results remains similar to the no-persona prompts. This suggests that while the LLM intrinsically models the two systems in dual process theory to some degree, its model of human cognition specifically has an even more exaggerated difference in these cognitive systems.

Modeland Bias-specific Prompting Effects. All of the standard prompting results alongside the best performing prompting technique results for each bias category and model combination are presented in Figure 3. Here we see that the Human Persona with the System 2 (HP System 2) prompting technique often yields the least stereotypical responses, but that is not universal across models and bias categories. It outperforms all other prompting techniques in 13 cases. Similarly, the Human Persona in conjunction with System 2 and CoT (HP System 2 + CoT) prompting outperforms other prompting techniques in 9 cases. Only in one case, for profession bias and the GPT-4 model, the standard prompt outperform any other prompting techniques.

We also see from Figure 3 that the two openweight models, Llama 2 and Mistral 7B, often have similar behaviors (with the exception of the religion category) and that the two more recent closedweight models, GPT-4 and Gemini have similar behaviors. GPT-4 stands out in having the most cases where prompting variants make minimal improvement from the standard zero-shot prompt. This suggests that OpenAI has done some engineering on this front. Though it is unclear whether this is behind-the-scenes prompt modifications, analogous instruction finetuning of the model, or some other method to make the model robust to prompt variants. Next, we focus on each bias category.

Ageism. Ageism bias in Figure 3 illustrates that various prompting techniques improved the performance of all models, reducing stereotypical responses by approximately 2 to 5 percent across the board compared to standard prompting.

Beauty. From Figure 3, it is evident that using various prompting techniques improves the outcomes across all models, achieving up to 13 percent reduction in stereotypical responses for beauty bias. Notably, the Mistral 7B model exhibited the most promising results with the Human Persona System 2 (HP System 2) prompting technique. Furthermore, among the five models tested, four showed enhanced performance when prompted with HP System 2.

Beauty in Profession. In the results depicted in Figure 3, it is evident that employing various prompting techniques leads to improved outcomes across all models, resulting in up to a 9 percent reduction in stereotypical responses for beauty in profession bias. Particularly noteworthy is the performance of the Gemini model when utilizing System 2 prompting, which shows the most promising results in reducing beauty in profession bias.

Gender. We also observe a gender bias improvement of up to 9 percent across various models. For instance, the HP System 2 + CoT prompting technique performs well with GPT-3.5. Additionally, for GPT-4 and Gemini, the HP System 2 prompting yields the best performance. Notably, with Mistral 7B, HP System 1 outperforms other techniques. So, System 1 with Human Persona also reduces bias.

Institutional. We observed a reduction in institutional bias across all models, although the percentage decrease was smaller compared to reductions in gender or beauty biases. Specifically, with Llama 2, we achieved around a 5 percent improvement when using HP System 1 for prompting.

Nationality. Regarding nationality bias, the overall pattern of reduction is consistent across all models, similar to other biases. The combination of HP System 2 with CoT delivers the best performance for GPT-3.5 and Mistral 7B. For GPT-4 and Llama 2, the best results are achieved using HP alongside CoT.

Profession. We achieved up to a 10 percent reduction in bias for the profession category. All models except GPT-4 exhibited less bias compared to the results from standard prompts. However, for GPT-4, standard prompting performed the best. In the case of Llama 2 and Mistral 7B, the HP System 2 prompts were the most effective, whereas for GPT-3.5 and Gemini, the System 2 prompts yielded the best results.

Race. We observe a reduction in racial biases across all models, although the decrease is relatively small for GPT-4, akin to that observed with standard prompting techniques. In contrast, the Mistral 7B model using HP System 2 with CoT prompting shows a bias reduction of approximately 9 percent.

Religion. We achieved a reduction in religious bias by up to 8 percent. Additionally, we observed reductions across all models, although the decrease in the Gemini model was relatively minor, nearly identical to that seen with standard prompting. For GPT-3.5, MP System 2 exhibited the best performance. For Llama 2, CoT prompting delivered

Table 2: Kendall's τ test results averaged across all bias types and models. We use a significance level of α &lt; 0 . 05 to reject the null hypothesis.

| Prompting Techniques   |      τ |   p | H 0 ?   |
|------------------------|--------|-----|---------|
| CoT Vs Standard        | 0.4755 |   0 | Reject  |
| CoT Vs System 1        | 0.458  |   0 | Reject  |
| CoT Vs System 2        | 0.4339 |   0 | Reject  |
| HP CoT Vs HP System 1  | 0.4639 |   0 | Reject  |
| HP CoT Vs HP System 2  | 0.4423 |   0 | Reject  |
| MP CoT Vs MP System 1  | 0.4556 |   0 | Reject  |
| MP CoT Vs MP System 2  | 0.4372 |   0 | Reject  |

the least stereotypical responses, marking the only scenario where CoT prompting outperformed other prompting techniques.

## 6 Which Cognitive System Does CoT Best Model?

Now we further investigate whether CoT prompting is most similar to System 2 reasoning in LLMs. While Figure 2 shows that the stereotyping rate of CoT is most similar to System 1 prompts, these may be from different test items. Here we tackle this question directly by computing the Kendall τ coefficient (Kendall, 1938) between CoT-prompted responses and those of the other variants. We selected the Kendall τ ranked correlation because there is a natural order to anti-stereotypical, neutral, and stereotypical categorical values in our datasets. Table 2 lists these results. From this, we find that CoT prompting is most similar to the Standard zeroshot prompt, followed by System 1 prompting. In fact, it is most dissimilar to System 2 prompting. This pattern holds for the Human Persona and Machine Persona variants, where CoT is least correlated with the System 2 prompt variant.

This raises questions regarding how to interpret the effect that CoT prompting has on LLM behavior. While prior work has found that CoT prompting leads to better multi-step mathematical and formal reasoning capabilities (Wei et al., 2022; Yu et al., 2023; Wang et al., 2023), which aligns with System 2 in dual process theory, we do not see the same effect in social biases in this study.

## 7 Invalid LLMs Responses

We excluded certain examples due to the language models providing invalid responses. These models did not consistently choose from the three options provided. The invalid responses sometimes included phrases from the context sentence but not from the options list. In other instances, the responses were completely unrelated to both the context sentence and the options list, means out-of-context responses. Additionally, a few responses were merely numerical, ranging from 1 to 3. Some responses indicate that certain stereotypes are present in a sentence and state that promoting stereotypes is inappropriate. When calculating the prevalence of stereotypical responses, we consider these responses, which demonstrate awareness of stereotypes, as anti-stereotype responses.

## 8 Conclusion

Our study has contributed to the understanding and reduction of social biases in LLMs through prompting techniques grounded in dual process theory. By harnessing the cognitive frameworks of System 1 and System 2, as well as the incorporation of human-like personas, our research not only clarifies the role of these cognitive processes in LLMs but also demonstrates practical methods for reducing biases. Our findings reveal that System 2 prompts, particularly when combined with a Human Persona, consistently reduce stereotypical judgments across various social bias categories. This indicates a profound potential for combining analytical thought processes and personalized prompting to enhance the ethical performance of LLMs. Furthermore, our use of different models and bias datasets has allowed us to explore the diverse applications of these techniques, ensuring our results are robust and applicable across different contexts. These findings underscore the potential of sophisticated prompting strategies in enhancing the ethical aspects of AI, pointing towards a future where LLMs can assist in creating more inclusive digital environments. Through continued exploration and refinement of these methods, we anticipate further advancements in the responsible deployment of AI technologies.

## References

Josh Achiam, Steven Adler, Sandhini Agarwal, Lama Ahmad, Ilge Akkaya, Florencia Leoni Aleman, Diogo Almeida, Janko Altenschmidt, Sam Altman, Shyamal Anadkat, et al. 2023. Gpt-4 technical report. arXiv preprint arXiv:2303.08774 .

Samuel C Bellini-Leite. 2023. Dual process theory for large language models: An overview of using psychology to address hallucination and reliability issues. Adaptive Behavior , page 10597123231206604.

Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared D Kaplan, Prafulla Dhariwal, Arvind

- Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, et al. 2020. Language models are few-shot learners. Advances in neural information processing systems , 33:1877-1901.
- Peter Carruthers. 2009. How we know our own minds: The relationship between mindreading and metacognition. Behavioral and Brain Sciences , 32(2):121-138.
- Wim De Neys and Gordon Pennycook. 2019. Logic, fast and slow: Advances in dual-process theorizing. Current directions in psychological science , 28(5):503-509.
- Ameet Deshpande, Vishvak Murahari, Tanmay Rajpurohit, Ashwin Kalyan, and Karthik Narasimhan. 2023. Toxicity in chatgpt: Analyzing persona-assigned language models. In Findings of the Association for Computational Linguistics: EMNLP 2023 , pages 1236-1270.
- Jonathan St BT Evans and Keith E Stanovich. 2013. Dual-process theories of higher cognition: Advancing the debate. Perspectives on psychological science , 8(3):223-241.
- Fernanda Ferreira and Falk Huettig. 2023. Fast and slow language processing: A window into dual-process models of cognition.[open peer commentary on de neys]. Behavioral and Brain Sciences , 46.
- Keith Frankish. 2010. Dual-process and dualsystem theories of reasoning. Philosophy Compass , 5(10):914-926.
- Igor Grossmann and Ethan Kross. 2014. Exploring solomon's paradox: Self-distancing eliminates the self-other asymmetry in wise reasoning about close relationships in younger and older adults. Psychological Science , 25(8):1571-1580. PMID: 24916084.
- Shashank Gupta, Vaishnavi Shrivastava, Ameet Deshpande, Ashwin Kalyan, Peter Clark, Ashish Sabharwal, and Tushar Khot. 2023. Bias runs deep: Implicit reasoning biases in persona-assigned llms. arXiv preprint arXiv:2311.04892 .
- Thilo Hagendorff, Sarah Fabi, and Michal Kosinski. 2023. Human-like intuitive behavior and reasoning biases emerged in large language models but disappeared in chatgpt. Nature Computational Science , 3(10):833-838.
- Albert Q Jiang, Alexandre Sablayrolles, Arthur Mensch, Chris Bamford, Devendra Singh Chaplot, Diego de las Casas, Florian Bressand, Gianna Lengyel, Guillaume Lample, Lucile Saulnier, et al. 2023. Mistral 7b. arXiv preprint arXiv:2310.06825 .
- Mahammed Kamruzzaman, Md Minul Islam Shovon, and Gene Louis Kim. 2023. Investigating subtler biases in llms: Ageism, beauty, institutional, and nationality bias in generative models. arXiv preprint arXiv:2309.08902 .
- Masahiro Kaneko, Danushka Bollegala, Naoaki Okazaki, and Timothy Baldwin. 2024. Evaluating gender bias in large language models via chain-of-thought prompting. arXiv preprint arXiv:2401.15585 .
- Rabimba Karanjai and Weidong Shi. 2024. Lookalike: Human mimicry based collaborative decision making. arXiv preprint arXiv:2403.10824 .
- M. G. Kendall. 1938. A new measure of rank correlation. Biometrika , 30(1/2):81-93.
- Bill Yuchen Lin, Yicheng Fu, Karina Yang, Faeze Brahman, Shiyu Huang, Chandra Bhagavatula, Prithviraj Ammanabrolu, Yejin Choi, and Xiang Ren. 2024. Swiftsage: A generative agent with fast and slow thinking for complex interactive tasks. Advances in Neural Information Processing Systems , 36.
- Moin Nadeem, Anna Bethke, and Siva Reddy. 2020. Stereoset: Measuring stereotypical bias in pretrained language models. arXiv preprint arXiv:2004.09456 .
- Ron Sun. 2024. Can a cognitive architecture fundamentally enhance llms? or vice versa? arXiv preprint arXiv:2401.10444 .
- Gemini Team, Rohan Anil, Sebastian Borgeaud, Yonghui Wu, Jean-Baptiste Alayrac, Jiahui Yu, Radu Soricut, Johan Schalkwyk, Andrew M Dai, Anja Hauth, et al. 2023. Gemini: a family of highly capable multimodal models. arXiv preprint arXiv:2312.11805 .
- Hugo Touvron, Louis Martin, Kevin Stone, Peter Albert, Amjad Almahairi, Yasmine Babaei, Nikolay Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti Bhosale, et al. 2023. Llama 2: Open foundation and fine-tuned chat models. arXiv preprint arXiv:2307.09288 .
- Boshi Wang, Sewon Min, Xiang Deng, Jiaming Shen, You Wu, Luke Zettlemoyer, and Huan Sun. 2023. Towards understanding chain-of-thought prompting: An empirical study of what matters. In Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers) , pages 2717-2739, Toronto, Canada. Association for Computational Linguistics.
- Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Fei Xia, Ed Chi, Quoc V Le, Denny Zhou, et al. 2022. Chain-of-thought prompting elicits reasoning in large language models. Advances in neural information processing systems , 35:24824-24837.
- Zihan Yu, Liang He, Zhen Wu, Xinyu Dai, and Jiajun Chen. 2023. Towards better chain-of-thought prompting strategies: A survey.