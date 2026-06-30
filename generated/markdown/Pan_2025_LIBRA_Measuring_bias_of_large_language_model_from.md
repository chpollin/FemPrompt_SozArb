---
source_file: Pan_2025_LIBRA_Measuring_bias_of_large_language_model_from.pdf
conversion_date: 2026-02-03T18:45:31.694599
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
## LIBRA: Measuring Bias of Large Language Model from a Local Context

Bo Pang 1 , Tingrui Qiao 1 , Caroline Walker 2[0000 -0002 -9210 -7651] , Chris Cunningham 3 , and Yun Sing Koh 1[0000 -0001 -7256 -4049]

1 School of Computer Science, University of Auckland, Auckland, New Zealand

{bpan882, tqia361}@aucklanduni.ac.nz, y.koh@auckland.ac.nz

2 The Liggins Institute, University of Auckland, Auckland, New Zealand caroline.walker@auckland.ac.nz

3 Research Centre for M¯ aori Health and Development, Massey University, Wellington, New Zealand

C.W.Cunningham@massey.ac.nz

Abstract. Large Language Models (LLMs) have significantly advanced natural language processing applications, yet their widespread use raises concerns regarding inherent biases that may reduce utility or harm for particular social groups. Despite the advancement in addressing LLM bias, existing research has two major limitations. First, existing LLM bias evaluation focuses on the U.S. cultural context, making it challenging to reveal stereotypical biases of LLMs toward other cultures, leading to unfair development and use of LLMs. Second, current bias evaluation often assumes models are familiar with the target social groups. When LLMs encounter words beyond their knowledge boundaries that are unfamiliar in their training data, they produce irrelevant results in the local context due to hallucinations and overconfidence, which are not necessarily indicative of inherent bias. This research addresses these limitations with a Local Integrated Bias Recognition and Assessment Framework (LIBRA) for measuring bias using datasets sourced from local corpora without crowdsourcing. Implementing this framework, we develop a dataset comprising over 360,000 test cases in the New Zealand context. Furthermore, we propose the Enhanced Idealized CAT Score ( EiCAT ), integrating the iCAT score with a beyond knowledge boundary score ( bbs ) and a distribution divergence-based bias measurement to tackle the ch llenge of LLMs encountering words beyond knowledge boundaries. Our results show that the BERT family, GPT-2, and Llama-3 models seldom understand local words in different contexts. While Llama-3 exhibits larger bias, it responds better to different cultural contexts. The code and dataset are available at: https://github.com/ipangbo/LIBRA.

Keywords:

Bias · Large Language Model · Dataset.

## 1 Introduction

Large Language models (LLMs) have become a cornerstone in natural language processing (NLP) applications, providing substantial advancements in


<!-- PAGE 2 -->


Fig. 1: The comparative responses of different LLMs to prompts such as 'My karani' or 'My karani T¯ opia', which is a transliteration between English and M¯ aori 'My granny T¯ opia', illustrate the challenges faced in local contexts. In multiple generations, the Llama-3 model considers karani to be a model or a car; GPT-2 considers karani to be a cup of coffee. Words in the local context that are beyond the knowledge boundaries of the LLMs severely affect the predictive performance of the LLMs, thus interfering with the test for bias.

<!-- image -->

tasks ranging from chat to text generation [7]. The use of LLMs in real-world applications has raised significant concerns about their potential biases and the impact these biases may have on different social groups [10]. Bias in LLMs is typically influenced by the data they are trained on, which consists of internetsourced corpora reflecting the dominant cultural stereotypes from all over the world [22, 29]. When used in diverse cultural settings, this leads to unfair and potentially harmful outcomes. However, current research on stereotypical bias in LLMs focuses on bias based on United States' culture [20,21,24,26], while there is a lack of research on bias based on cultures from other parts of the world. We refer to this stereotypical bias contained in corpora in a region as the ocal bias.

Developing methodologies to detect local biases in region-specific contexts accurately is essential, ensuring that LLMs are evaluated and improved with a sensitivity to cultural diversity. In localized contexts, a significant challenge in evaluating LLMs is the presence of words beyond the models' knowledge boundaries [28]. LLMs are often trained on extensive internet-sourced corpora, but these datasets may lack sufficient representation of region-specific terms, including those from local languages and dialects [9,11,15,31]. This deficiency can lead to unrepresentative and culturally inappropriate outputs [14]. For example, as illustrated in Fig. 1, let LLMs generate text after 'My karani', which contains the M¯ aori word 'karani' meaning grandmother. However, Llama-3 [31] and GPT 2 [27] misinterpreted 'karani' as a model, a car, or a cup of coffee, generating unrelated content. Given these challenges, we ask the following research question: How can we effectively measure local biases in LLMs by leveraging region-specific corpora while addressing the challenges posed by local words that exceed the knowledge boundaries of LLMs?

To tackle the challenge of measuring the local bias of LLMs, we propose a novel framework called L ocal I ntegrated B ias R ecognition and A ssessment (LIBRA) for efficiently constructing datasets and measuring bias using local corpora without relying on crowdsourcing. We address the issue of words beyond LLMs' knowledge boundaries within the bias testing dataset by detecting beyond knowl-


<!-- PAGE 3 -->


Fig. 2: Build and use a dataset to test the bias of Large Language Models. A fair model should have similar chances of choosing between stereotyped and antistereotyped sentences while selecting less irrelevant sentences. However, if the content in the sentence is beyond the knowledge boundaries (shown in the figure as KB) of Large Language Models, it will produce meaningless distribution.

<!-- image -->

edge boundaries words and minimizing the effects of hallucinatory results from them during bias testing, thereby ensuring the authenticity and reliability of the test results. Additionally, we create a New Zealand-based dataset to reveal the bias of LLMs in the New Zealand context. When designing the dataset structure, we used the triplet structure of StereoSet [20], where each test case contains three similar sentences with different words describing the target social group. The description regarding target social groups requires manual annotation from crowdsourced workers. Instead of changing the descriptive words, as shown in Fig. 2, we identify and replace the words that denoted the target social group in our collected corpora, thus allowing the entire dataset to be generated automatically. When dealing with sentences with words beyond the LLM's knowledge boundary, we identify local words by constructing local vocabulary lists that differ from those of general English. We add extra evaluations for local words to ensure that LLMs' interpretation of these local words matches their formal definition. A key innovation of our approach is the introduction of the Enhanced Idealised CAT Score ( EiCAT ), which integrates the traditional iCAT score [20] with a beyond LLM's knowledge boundary score ( bbs ). This new metric uses the Jensen-Shannon divergence to analyze bias by examining the distribution of logits associated with stereotypical and anti-stereotypical choices in the dataset. By incorporating the bbs , the EiCAT score penalizes models that fail to understand local words, thus ensuring an accurate assessment of bias in localized contexts.

Our contributions are as follows. (1) We propose a new metric that uses logit distribution from LLMs to assess stereotypical bias in LLMs, significantly enhancing the statistical significance of the evaluation method. (2) We develop a mechanism that mitigates risks that LLMs might not be sufficiently trained to handle local words in corpora when testing bias. (3) We design a pipeline that uses local corpora to generate a dataset. We created a dataset from over 360,000 articles in the local context and generated over 160,000 test cases by applying our pipeline in New Zealand to evaluate LLM local bias.


<!-- PAGE 4 -->


## 2 Related Work

Bias in Large Language Model. Bias occurs when a model assumes a person possesses characteristics stereotypical of their group [14]. For instance, an LLM might use 'her' when processing sentences that include 'nurse', reflecting a gender bias. Such biases can lead to social injustice; for example, if a biased LLM is used for nurse CV screening, it may preferentially select females over males due to the stereotype of associating nursing with women.

Measuring Bias of Large Language Model. Methods for testing LLM bias include embedding-based, generated text-based, and probability-based methods. Embedding-based methods such as WEAT [4] and SEAT [16] assess similarities between vectors for target social groups and stereotype-associated vectors in text encoders' embedding. While the approach is simple, it measures upstream of LLMs and is not representative enough of downstream tasks [3]. The generated text-based approach directly tests LLMs using datasets to generate potentially stereotyped results. Applicable to all LLMs, it requires only model outputs without access to text encoders or logits. However, using classifiers to analyze these outputs can introduce their own biases [25]. Probability-based methods, exemplified by StereoSet [20] and CrowS-Pairs [21], use pseudo-log likelihoods to assess the probability of word generation, ideally suited for open-source LLMs or APIs providing logits data. The pseudo-log likelihoods used by StereoSet [20] are represented as follows: L ( S ) = 1 | M | ∑ t ∈ M log P ( t | U ; θ ) , where S is a sentence, M and U are masked and other words in S , and θ is other parameters in the model. The Stereotype Score ( ss ) measures the proportion of biased sentences preferred by the model. In contrast, the Language Model Score ( lms ) reflects the selection percentage of non-irrelevant terms, showing the model's language ability. StereoSet [20] integrates these into the Idealized CAT Score ( iCAT ): iCAT = lms · min ((100 -ss ) ,ss ) 50 . Our proposed metric improves bias measurement by analyzing the distributional distance between logits for stereotypical and antistereotypical responses, unlike traditional metrics focusing solely on the highest probability choice. Our approach detects model preferences certainty, providing a more comprehensive understanding of model bias across various behaviours.

Datasets for evaluating LLM bias are typically created through crowdsourcing, which offers diversity but leads to high costs and variable quality. Alternative methods like filling sentence templates with varying words produce monotonous content and lack syntactic diversity [10,24]. Moreover, these datasets often reflect biases against historically disadvantaged U.S. groups, complicating bias research globally due to a lack of regional cultural expertise for dataset creation. Our approach automatically generates different test cases from an extensive local corpus, ensuring grammatical diversity and efficient construction. Furthermore, the adaptability of our framework allows for the creation of culture-specific datasets globally using local resources, thus facilitating the understanding and mitigation of significant language modelling biases in different communities across the globe.


<!-- PAGE 5 -->


## 3 LIBRA Framework for Measuring Local Bias

The measurement of local bias in LLMs necessitates a local dataset paired with a metric. This section first outlines the dataset's structure and application for comprehensive bias assessment in LLMs. We then introduce our novel metric, EiCAT , and describe a pipeline for dataset creation and bias evaluation. Finally, we address the challenge of words beyond LLMs' knowledge boundaries in local contexts and propose solutions to mitigate their impact on bias assessment.

Dataset Construction. To address problems with existing datasets that test for bias in LLMs, we propose a methodology for creating bias detection datasets in LLMs without crowdsourcing, using local corpora. We define the whole local corpora as O . It consists of articles denoted as A = [ A 1 , . . . , A n ] . We predefine a set of seeding keywords K , using target social groups G to guide keyword selection. For each social group G ∈ G , we identify directly associated seed keywords ( K,G ) ∈ K . These keywords are then expanded by finding terms in a text encoder's embedding space that show high similarity, adding to K . To expand the keywords further, we use association rule learning [2] for each ( K,G ) ∈ K to discover words that often appear together with keyword K and add to K because words often appear with keywords are often potential keywords. The keyword set K is available for searching potentially biased sentences.

Directly searching the corpora O using all keywords from K is not sensitive enough because each keyword K is linked to a specific target social group G . To refine this, we employ fuzzy clustering [17] to group articles with similar topics into clusters ( C, G ) ∈ C , where each cluster is associated with a target social group. We then use a targeted keyword set K G i = { K | ( K,G ) ∈ K and G = G i } to search sentences in corresponding articles A G i = { A | A ∈ A and A ∈ C and ( C, G ) ∈ C and G = G i } . We extract all sentences S in A G i that contain the keywords in K G i to form the set of potentially biased sentences S . The sentences in S screened by local cultural experts can be used to construct a dataset for testing the bias of LLMs.

We structure our dataset as a series of triplets, each comprising an original stereotyped sentence from the corpora ( S ), an anti-stereotyped sentence ( S p ), and an unrelated sentence ( S u ) for ensuring LLMs not erroneously favouring any particular response due to content irrelevance. Each sentence in triplet T ∈ D = [ T 1 , . . . , T n ] is tokenized, with S = [ t 1 , . . . , t n ] . We identify target social group tokens ω = [ t j , t j +1 , . . . , t k ] , and for S p and S u , we retain unmodified tokens U = [ t 1 , . . . , t j -1 , t k +1 , . . . , t n ] . The sentences are then formed by replacing ω with demographic terms for S p and unrelated terms for S u , respectively, resulting in S = U left + ω + U right , S p = U left + M p + U right , and S u = U left + M u + U right .

Use Dataset to Measure LLMs Bias. We assess model bias by computing the Jensen-Shannon Divergence (JSD) between the probability distributions of stereotyped and anti-stereotyped choice logits, providing a quantitative measure of bias in model predictions. For instance, consider two models processing the


<!-- PAGE 6 -->


same test case: one assigns a probability of 99% to the stereotyped option and 1% to the anti-stereotyped option, while another assigns 51% and 49%, respectively. Traditional assessment methods might label both models as biased. However, using JSD, the latter model would be recognized as less biased, as its predictions demonstrate a more balanced distribution. Calculating stereotyped and antistereotyped logits differs by model type. Masked Language Models (MLMs) like BERT [9], RoBERTa [15], and ALBERT [11] predict tokens based on their left and right context. In contrast, Causal Language Models (CLMs), such as GPT [27] and Llama [31], generate the next token sequentially [10]. We use L ( · ) to indicate the likelihood of LLMs generating specific responses within contexts. For MLMs, this is calculated as the pseudo-log-likelihood of logits (Equation 2). For CLMs, L ( · ) is defined as the sum of logits, excluding the left part of unmodified tokens, which do not influence sentence comparison:

<!-- formula-not-decoded -->

where S [ i ] is the i -th token in the sentence S , θ is other parameters in the model. For each test case, i.e. , a triplet, L ( S ) quantifies the model's tendency across three sentences in triplets. After evaluating all triplets, we compile the L ( S ) values for stereotyped sentences into distribution D s and anti-stereotyped sentences into D a . We then measure bias between these distributions using the Jensen-Shannon Divergence, JSD ( D a ||D s ) . A JSD ( D a ||D s ) closer to 0 indicates less bias by showing similarity between the distributions, and vice versa.

Dataset Creation Pipeline. We provide a pipeline to generate a dataset from organized corpora articles, enabling local context bias measurement in LLMs. Keywords Augment. We use a broad set of seed keywords related to target social groups to search for sentences in our dataset. These keywords, crucial within their categories, are expanded using the LLM2Vec tool [1], which allows decoder-only LLMs to generate embedding spaces and find similar words within the corpora. Further expansion is achieved through association rule learning [2], identifying frequently co-occurring terms from the corpora as Augmented keywords.

Clustering and Allocating Social Groups. Directly searching the corpora with all keywords can yield many irrelevant results. For example, using 'disabled' might retrieve articles on 'disabled accounts' rather than on disability as a social group. To enhance relevance, we transform the text into vectors using LLM2Vec [1] and apply dimensionality reduction with UMAP [18]. We then categorize the corpora into topics using HDBSCAN [17], assigning texts to the nearest clusters through Iterative Clustering [12] if they do not fit an existing category. Each topic is linked to relevant social groups using two steps: summarizing cluster contents with an incremental summary technique [6] to manage context length and prompting LLMs to identify associated social groups.

Search for Sentences. We begin searching for candidate dataset sentences using each cluster's relevant social groups and augmented keywords. We divide


<!-- PAGE 7 -->


cluster texts into individual sentences and then search these using keywords associated with the cluster's target social groups. For each sentence identified by keywords, we record the original sentence, the identifying keyword, and the associated social groups for subsequent steps.

Compile Dataset. Candidate dataset sentences are refined through further processing. We use a perturbating strategy to construct anti-stereotyped and irrelevant options by modifying demographic noun keywords. Perturbating involves choosing antonyms for keywords with clear opposites (e.g., 'man' vs 'woman'). For keywords without direct opposites, such as 'European', we select terms from the same social group keyword set K G i that are distant in the text encoder's embedding space. Local culture experts review all triplets to ensure an accurate representation of stereotypes and anti-stereotypes.

Effect of Beyond Knowledge Boundary Words in Local Context. Local context-specific words can disrupt bias testing. This section outlines a method to identify and exclude words beyond an LLM's knowledge boundary from test sentences S . If LLMs fail to comprehend certain local terms, those test cases are marked invalid to prevent meaningless tests. Additionally, we factor the proportion of unrecognized local words into our quality metric for the model.

For each test case sentence set S , we compile a vocabulary list of all appearing words V . We then exclude words and their variants found in English dictionaries, denoted as V w , resulting in V ′ = V \ V w . The V ′ represents words beyond LLMs' knowledge boundaries within S . To verify if LLMs understand a word W ∈ V ′ , we compare the model's interpretation with its formal definition, avoiding direct prompts that could induce model hallucinations and false positives in the results [28]. For each word W ∈ V ′ , we use prompt template P 1 to extract its definition D 1 from an LLM and compare it with the official definition D 2 . If D 1 and D 2 align, the test case is valid; otherwise, any triplets with W are marked invalid. The verification template P 2 can be applied on any LLM since this task is independent of the tested model, allowing using more capable models if necessary.

For each word W ∈ V ′ , with S w being the sentences containing W , we define a binary function f ( W,S w ) to assess if a language model accurately understands W in S w ; f ( W,S w ) = 1 means D 1 and D 2 matches, and 0 indicates not matching. To refine LLM bias evaluation in localized contexts, we introduce Beyond LLM's Knowledge Boundary Score ( bbs ):

<!-- formula-not-decoded -->

The Enhanced Idealized CAT Score ( EiCAT ), which incorporates measures of bias, language model capacity and knowledge boundaries, is as follows:

<!-- formula-not-decoded -->

where α is a weighting parameter that adjusts the contribution of JSD and bbs to the overall EiCAT score, allowing customization on the bias measurement.


<!-- PAGE 8 -->


The EiCAT score ranges from 0 to 1 and quantitatively evaluates fairness and effectiveness in local contexts of LLMs, with higher scores indicating better performance and less bias. We set the weighting parameter α equal to the bbs value to dynamically balance the influence between bias assessment and the model's understanding of local-specific vocabulary. When bbs is high, indicating the model effectively comprehends local terms, α increases, emphasising the bias measurement component more. Conversely, if bbs is low, suggesting a limited understanding of local words, α decreases, increasing the relative weight of the bbs . This approach ensures the EiCAT score appropriately penalizes models for bias and lack of contextual understanding, providing a more accurate and fair assessment of their capabilities in localized contexts.

## 4 New Zealand Context Dataset Construction

New Zealand's bicultural foundation, comprising indigenous M¯ aori and European settlers, is further diversified by subsequent immigration. M¯ aori and Pacific Peoples have historically faced poor socio-economic outcomes stemming from colonization and cultural marginalization [30]. While the Treaty of Waitangi settlements have addressed some historical grievances, the residue of biases persists [33].

Fig. 3: Visualisations of Contextual Diversity. Fig. (a) shows BERT embeddings clustering purely English, mixed English-M¯ aori, and solely M¯ aori sentences separately, indicating LLMs' distinct treatment of linguistic variations that could limit effective output across them. Fig. (b) reveals a heatmap of similarities among the top 50 topics from U.S. English and New Zealand-specific corpora, highlighting their significant contextual differences with minimal overlap.

<!-- image -->

We apply our pipeline in a New Zealand context to explore local bias and LLM knowledge boundaries, as Fig. 3 illustrates the differences between New


<!-- PAGE 9 -->


Zealand and general English contexts. To enhance syntactic diversity, we include both text-source and oral-source texts in our corpora [5]. For privacy, we perform Named Entity Recognition (NER) [13]. Depending on the source, the raw corpora may require filtering out bias-irrelevant content such as weather forecasts, jokes, and puzzles. Finally, we use 367,384 news articles and broadcast transcripts collected from New Zealand local media to analyze language use associated with various social groups in New Zealand. Our dataset, comprising 167,712 sentences and triplets, assesses bias across eight target groups as summarized by [19]. It addresses the significant presence of Te Reo M¯ aori 'borrow-words' in the NZ English corpora and whose limited presence in LLM training data often poses challenges.

The distribution of sentences across different social groups in our dataset mirrors their prevalence in local corpora. Age-related content is predominant, making up 73.43% of the total, reflecting its frequent discussion and relevance as a social factor. Gender and race/ethnicity also feature prominently, accounting for 10.78% and 10.65%, respectively, highlighting their importance in the discourse. Lesser represented groups include sexual orientation (2.94%), physical appearance (0.96%), disability (0.78%), nationality (0.02%), and religion (0.45%), indicating these topics are less frequent or more context-specific in the corpora.

Our dataset recognises 'noise' as a test case that does not precisely target the intended social groups. Instead of individual assessments, we analyze the collective distribution of these cases using horizontal comparisons across models. This method ensures that our comparative analysis remains effective even in noisy scenarios where models consistently select the same stereotyped option for fluency. The consistent response to poorly flowing sentences confirms that our metric accurately captures model biases, offering a reliable framework for evaluating biases across various cultural contexts.

## 5 Results And Discussions

Here, we assess which words in our dataset are first beyond the knowledge boundaries of several prominent open-source LLMs, including the BERT family, GPT2, and Llama 3 family (Version 3.1). Next, we present the results of applying our New Zealand context dataset and evaluation metrics to these models. All experiments use the Transformers library [32] and are performed on an NVidia A100 with 80GB of video memory.

LLMs Knowledge Boundaries in New Zealand Context. Our experiments involved analyzing words from the New Zealand corpus beyond the knowledge boundaries of tested models, revealing significant performance variations. Evaluating the bbs in Table 1 shows all tested LLMs achieve low scores, indicating poor comprehension of non-English words in the New Zealand context. The Llama family model outperformed others, while GPT-2 struggled with non-


<!-- PAGE 10 -->


Fig. 4: Comparison of kernel density estimation (KDE) plots for the logtransformed density of logits across the largest size of tested LLMs in the New Zealand Context. Each subplot represents the distribution of logits, where the X-axis shows the range of logits values, and the Y-axis displays the log-scale density estimation of data points at each logit value. Stereotyped logits are depicted with solid lines, while anti-stereotyped logits are depicted with dashed lines, facilitating a visual comparison of the model's behaviour towards stereotyped versus anti-stereotyped content. A larger divergence represents the model with a larger bias.

<!-- image -->

English words from our dataset, and the BERT family models' performance was moderate, positioned between Llama and GPT-2.

LLM Bias in New Zealand Context. Analysis of the New Zealand dataset indicates that BERT and RoBERTa outperform ALBERT in language model scores, showing stronger text completion abilities. However, their elevated JSD and bbs scores suggest they exhibit more bias due to greater differences in logit distribution between stereotyped and anti-stereotyped responses. This comparison highlights the inherent biases of BERT and RoBERTa relative to ALBERT. Notably, the JSD values cannot be directly compared across masked and causal models. GPT-2 displays lower biases but weaker language capabilities. In contrast, the Llama-3 model achieves higher EiCAT scores by effectively handling local words, demonstrating the best performance of all causal language models in the New Zealand context.

LLM Bias in Other Contexts. We evaluate LLM biases using two culturally distinct contexts to validate our framework's adaptability. The first, Our Voices dataset, collects natural language data from young New Zealanders, reflecting contemporary sociolinguistic trends among youth [23]. The second context comes


<!-- PAGE 11 -->


Table 1: Performance Metrics of Different LLMs on the New Zealand Context Dataset. This table presents evaluation metrics scaled to a 0-100 range for readability, covering Language Model Score ( lms ), Jensen-Shannon Divergence ( JSD ), Beyond Knowledge Boundary Score ( bbs ), traditional Idealized CAT Score ( iCAT ) using the StereoSet dataset for comparison, and Enhanced Idealized CAT Score ( EiCAT ). The models are categorized into Theoretical Language Models (TLMs), Masked Language Models (MLMs), and Causal Language Models (CLMs). We also assess the largest model variants in specific contexts: New Zealand young people (OV) using the Our Voices dataset and the Malaysia context (Malay) to understand bias within these unique cultural settings. Theoretical models are included to illustrate extreme cases for reference. The best performance is highlighted in bold for each metric and category.

| Model             |    lms |    JSD |    bbs |   iCAT |   EiCAT |
|-------------------|--------|--------|--------|--------|---------|
| RandomLM          |  66.67 |   0    |   0    |  66.67 |    0    |
| IdealLM           | 100    |   0    |   0    | 100    |    0    |
| LocalIdealLM      | 100    |   0    | 100    | 100    |  100    |
| StereotypedLM     | 100    | 100    | 100    |   0    |    0    |
| BERT-base         |  96.04 |  45.44 |   3.96 |  71.6  |    5.73 |
| BERT-large        |  96.73 |  47.27 |   4.11 |  70.28 |    5.91 |
| RoBERTA-base      |  96.89 |  39.11 |   1.67 |  84.43 |    2.58 |
| RoBERTA-large     |  97.46 |  39.83 |   2.28 |  81.58 |    3.51 |
| ALBERT-base-v2    |  89.11 |  27.56 |   0.08 |  44.92 |    0.12 |
| ALBERT-large-v2   |  88.26 |  22.49 |   1.9  |  39.7  |    2.94 |
| ALBERT-xlarge-v2  |  86.23 |  21.37 |   1.22 |  41.88 |    1.87 |
| ALBERT-xxlarge-v2 |  91.28 |  35.58 |   0.46 |  44.44 |    0.69 |
| GPT-2-base        |  57.82 |   0.49 |   1.07 |  37.8  |    1.23 |
| GPT-2-medium      |  57.3  |   0.73 |   1.75 |  51.85 |    1.98 |
| GPT-2-large       |  59.67 |   1.48 |   1.37 |  59.83 |    1.61 |
| GPT-2-xl          |  58.78 |   1.37 |   1.45 |  60.68 |    1.68 |
| Llama-3-8b        |  77.48 |   3.35 |   7.31 |  59.16 |   10.72 |
| BERT-large        |  96.45 |  40.86 |   0    |  70.28 |    0    |
| RoBERTA-large     |  95.96 |  32.93 |   9.52 |  81.58 |   14.39 |
| ALBERT-xxlarge-v2 |  94.63 |  28.59 |   4.76 |  44.44 |    7.51 |
| GPT-2-xl          |  63.49 |   1.92 |   0    |  60.68 |    0    |
| Llama-3-8b        |  80.38 |   2.86 |   4.76 |  59.16 |    7.36 |
| BERT-large        | 100    |  63.77 |  17.86 |  70.28 |   21.14 |
| RoBERTA-large     |  99.22 |  39.39 |  10.71 |  81.58 |   15.93 |
| ALBERT-xxlarge-v2 |  92.97 |  39.9  |   7.14 |  44.44 |   10.15 |
| GPT-2-xl          |  68.81 |   1.72 |   0    |  60.68 |    0    |
| Llama-3-8b        |  83.93 |   2.49 |   7.14 |  59.16 |   11.41 |


<!-- PAGE 12 -->


from the MEN dataset [8], consisting of 200 Malaysian local news. Malaysian English is influenced by Malay, Chinese, and Tamil, featuring unique lexical and syntactic variations [8]. These datasets enable a comprehensive analysis of LLM performance across varied linguistic environments.

We assess the largest model sizes in these contexts. BERT shows the highest linguistic competence but the highest bias. RoBERTa consistently attains high EiCAT scores and robust bbs , indicating its effective handling of local vocabulary. ALBERT's performance is slightly inferior, with reduced linguistic capabilities and less bias. Llama-3 outperforms other causal models, achieving the highest EiCAT scores. Remarkably, some models score zero due to a bbs of zero, indicating a failure to recognize local-specific vocabulary.

Discussion Our framework provides a refined measure of models' ability to handle culturally specific content without bias. By integrating the bias assessment with the bbs , EiCAT captures the fairness of the model's predictions without hallucination and overconfidence and its capacity to understand and process culturally unique vocabulary. This dual focus is crucial for ensuring cultural fairness in LLMs, particularly for underrepresented languages. Furthermore, the framework empowers researchers globally to efficiently evaluate LLM biases in specific local contexts, guiding the broader use of LLMs globally.

Our experimental results highlight the varying performance of different models within different contexts. The higher EiCAT scores of the Llama-3 model indicate that it better understands words in the local context and reduces bias, representing it as the most suitable model to handle the task in the New Zealand context. Even though Llama-3 did not achieve the best scores in all contexts, it is still the strongest overall model among the causal language models. This performance is due to their advanced architectures and more diverse training datasets. However, even the best-performing models like Llama are not entirely free from biases or limitations in handling words beyond their knowledge boundaries, underscoring the need for continuous improvements in model training.

BERT, RoBERTa and Llama-3, despite achieving high lms , display a greater degree of bias. The exact opposite is the case for ALBERT and GPT-2. As with StereoSet, we find that models with higher lms have higher JSD , which indicates that more linguistically competent models tend to be more biased. The relationship is because LLMs objectively have biases, and the more linguistically competent the model, the more accurately it can represent the biases inherited from the training data. This also suggests we accurately reflect the bias by comparing logit distribution distances.

## 6 Conclusion

We proposed the LIBRA framework to measure biases in large language models (LLMs) within local contexts. By leveraging diverse and expansive corpora, we developed a New Zealand context dataset, relying on robust methods to


<!-- PAGE 13 -->


gather and curate extensive local data rather than traditional crowdsourcing approaches. The Enhanced Idealized CAT Score ( EiCAT ), introduced within the framework, integrates traditional bias metrics with a beyond knowledge boundary score ( bbs ) and a distributional divergence-based assessment, offering a comprehensive evaluation tool. Applying this framework to the New Zealand context, we utilized data sourced from New Zealand media to create a dataset comprising over 160,000 test cases. Our analysis revealed that while models such as Llama-3 exhibit certain biases, they demonstrate a stronger capacity to handle culturally specific vocabulary and terminology. By testing knowledge boundaries, we also highlighted the importance of formal definitions and structured data in assessing LLMs' capabilities with underrepresented languages such as M¯ aori and Malay. These findings underscore the necessity of incorporating localized and contextually rich data in evaluating and improving LLM fairness. LIBRA offers a scalable, adaptable approach for researchers globally, promoting the development of more fair and culturally sensitive language technologies.

Acknowledgement. The authors thank the Growing Up in New Zealand rangatahi / youth who participated in the Our Voices study, conducted by the Our Voices study team. The Our Voices study was designed by Susan M.B. Morton (GUiNZ Foundation Director and Principal Investigator of Our Voices 2019-2022) and the Our Voices study team. The authors acknowledge the contributions of the original Our Voices team and study investigators: Susan M.B. Morton, Rizwan Asghar, Polly E. Atatoa Carr, Chris Cunningham, Daniel Exeter, Sarah Knowles, Yun Sing Koh, Christopher Nixon, Elizabeth R. Peterson, Avinesh Pillai, Chris Schilling, Caroline Walker, Joerg Wicker, Kane Meissel (Principal Investigator 2023-2025), and those who have contributed at various points throughout the study. The views reported in this paper are those of the authors and do not necessarily represent the views of the Our Voices Investigators or Growing Up in New Zealand. Financial support: The Our Voices study was funded by an Endeavour grant (UOAX1912) by the Ministry of Business, Innovation and Employment (2019-2025). This funding also provided a travel grant awarded to the first author of this manuscript. Funders had no role in the design, analysis or writing of this article. Conflict of interest: None. Ethics of human subject participation: This study was conducted according to the guidelines laid down in the Declaration of Helsinki and all procedures involving human subjects were approved by the Ministry of Health's Northern B Health and Disability Ethics Committee. Consent was obtained from all participants and their parent or guardian.

## References

1. BehnamGhader, P., Adlakha, V., Mosbach, M., Bahdanau, D., Chapados, N., Reddy, S.: LLM2vec: Large language models are secretly powerful text encoders. In: First Conference on Language Modeling (2024), https://openreview.net/forum? id=IW1PR7vEBf


<!-- PAGE 14 -->


2. Borgelt, C.: An implementation of the fp-growth algorithm. In: Proceedings of the 1st International Workshop on Open Source Data Mining: Frequent Pattern Mining Implementations. p. 1-5. OSDM '05, Association for Computing Machinery, New York, NY, USA (2005). https://doi.org/10.1145/1133905.1133907
3. Cabello, L., Jørgensen, A.K., Søgaard, A.: On the independence of association bias and empirical fairness in language models. In: Proceedings of the 2023 ACM Conference on Fairness, Accountability, and Transparency. p. 370-378. FAccT '23, Association for Computing Machinery, New York, NY, USA (2023). https://doi. org/10.1145/3593013.3594004
4. Caliskan, A., Bryson, J.J., Narayanan, A.: Semantics derived automatically from language corpora contain human-like biases. Science 356 (6334), 183186 (2017). https://doi.org/10.1126/science.aal4230, https://www.science.org/ doi/abs/10.1126/science.aal4230
5. Chan, H., Verspoor, M., Vahtrick, L.: Dynamic development in speaking versus writing in identical twins. Language Learning 65 (2), 298-325 (2015). https://doi. org/https://doi.org/10.1111/lang.12107, https://onlinelibrary.wiley.com/doi/abs/ 10.1111/lang.12107
6. Chang, Y., Lo, K., Goyal, T., Iyyer, M.: Booookscore: A systematic exploration of book-length summarization in the era of LLMs. In: The Twelfth International Conference on Learning Representations (2024), https://openreview.net/forum? id=7Ttk3RzDeu
7. Chang, Y., Wang, X., Wang, J., Wu, Y., Yang, L., Zhu, K., Chen, H., Yi, X., Wang, C., Wang, Y., Ye, W., Zhang, Y., Chang, Y., Yu, P.S., Yang, Q., Xie, X.: A survey on evaluation of large language models. Association for Computing Machinery Transactions on Intelligent Systems and Technology 15 (3) (March 2024). https: //doi.org/10.1145/3641289
8. Chanthran, M., Soon, L.K., Ong, H.F., Selvaretnam, B.: Malaysian English news decoded: A linguistic resource for named entity and relation extraction. In: Calzolari, N., Kan, M.Y., Hoste, V., Lenci, A., Sakti, S., Xue, N. (eds.) Proceedings of the 2024 Joint International Conference on Computational Linguistics, Language Resources and Evaluation. pp. 10999-11022. ELRA and ICCL, Torino, Italia (May 2024), https://aclanthology.org/2024.lrec-main.959
9. Devlin, J.: Bert: Pre-training of deep bidirectional transformers for language understanding. arXiv preprint arXiv:1810.04805 (2018)
10. Gallegos, I.O., Rossi, R.A., Barrow, J., Tanjim, M.M., Kim, S., Dernoncourt, F., Yu, T., Zhang, R., Ahmed, N.K.: Bias and Fairness in Large Language Models: A Survey. Computational Linguistics pp. 1-83 (08 2024). https://doi.org/10.1162/ coli\_a\_00524
11. Lan, Z., Chen, M., Goodman, S., Gimpel, K., Sharma, P., Soricut, R.: Albert: A lite bert for self-supervised learning of language representations. In: International Conference on Learning Representations (2020), https://openreview.net/forum? id=H1eA7AEtvS
12. Li, H., Schlegel, V., Batista-Navarro, R., Nenadic, G.: Do you hear the people sing? key point analysis via iterative clustering and abstractive summarisation. In: Rogers, A., Boyd-Graber, J., Okazaki, N. (eds.) Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers). pp. 14064-14080. Association for Computational Linguistics, Toronto, Canada (2023). https://doi.org/10.18653/v1/2023.acl-long.786, https://aclanthology.org/ 2023.acl-long.786


<!-- PAGE 15 -->


13. Li, J., Sun, A., Han, J., Li, C.: A survey on deep learning for named entity recognition. IEEE Transactions on Knowledge and Data Engineering 34 (1), 50-70 (2022). https://doi.org/10.1109/TKDE.2020.2981314
14. Li, Y., Du, M., Song, R., Wang, X., Wang, Y.: A survey on fairness in large language models. arXiv preprint arXiv:2308.10149 (2023)
15. Liu, Y., Ott, M., Goyal, N., Du, J., Joshi, M., Chen, D., Levy, O., Lewis, M., Zettlemoyer, L., Stoyanov, V.: RoBERTa: A robustly optimized BERT pretraining approach (2020), https://openreview.net/forum?id=SyxS0T4tvS
16. May, C., Wang, A., Bordia, S., Bowman, S.R., Rudinger, R.: On measuring social biases in sentence encoders. In: Burstein, J., Doran, C., Solorio, T. (eds.) Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long and Short Papers). pp. 622-628. Association for Computational Linguistics, Minneapolis, Minnesota (Jun 2019). https://doi.org/10.18653/v1/N19-1063, https://aclanthology.org/N19-1063
17. McInnes, L., Healy, J., Astels, S.: HDBSCAN: Hierarchical density based clustering. Journal of Open Source Software 2 (11), 205 (2017). https://doi.org/10.21105/ joss.00205, https://doi.org/10.21105/joss.00205
18. McInnes, L., Healy, J., Saul, N., Grossberger, L.: UMAP: Uniform manifold approximation and projection. The Journal of Open Source Software 3 (29), 861 (2018)
19. Meade, N., Poole-Dayan, E., Reddy, S.: An empirical survey of the effectiveness of debiasing techniques for pre-trained language models. In: Muresan, S., Nakov, P., Villavicencio, A. (eds.) Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers). pp. 1878-1898. Association for Computational Linguistics, Dublin, Ireland (May 2022). https://doi.org/ 10.18653/v1/2022.acl-long.132, https://aclanthology.org/2022.acl-long.132
20. Nadeem, M., Bethke, A., Reddy, S.: StereoSet: Measuring stereotypical bias in pretrained language models. In: Zong, C., Xia, F., Li, W., Navigli, R. (eds.) Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing (Volume 1: Long Papers). pp. 5356-5371. Association for Computational Linguistics, Online (August 2021). https://doi.org/10.18653/v1/2021.acl-long.416, https://aclanthology.org/2021.acl-long.416
21. Nangia, N., Vania, C., Bhalerao, R., Bowman, S.R.: CrowS-Pairs: A Challenge Dataset for Measuring Social Biases in Masked Language Models. In: Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing. Association for Computational Linguistics, Online (Nov 2020)
22. Navigli, R., Conia, S., Ross, B.: Biases in large language models: Origins, inventory, and discussion. J. Data and Information Quality 15 (2) (June 2023). https://doi. org/10.1145/3597307
23. OurVoices: Our Voices Home, https://ourvoices.auckland.ac.nz/
24. Parrish, A., Chen, A., Nangia, N., Padmakumar, V., Phang, J., Thompson, J., Htut, P.M., Bowman, S.: BBQ: A hand-built bias benchmark for question answering. In: Muresan, S., Nakov, P., Villavicencio, A. (eds.) Findings of the Association for Computational Linguistics: 60th Annual Meeting of the Association for Computational Linguistics. pp. 2086-2105. Association for Computational Linguistics, Dublin, Ireland (May 2022). https://doi.org/10.18653/v1/2022.findings-acl.165, https://aclanthology.org/2022.findings-acl.165


<!-- PAGE 16 -->


25. Pozzobon, L.A., Ermis, B., Lewis, P., Hooker, S.: On the challenges of using blackbox APIs for toxicity evaluation in research. In: The 2023 Conference on Empirical Methods in Natural Language Processing (2023), https://openreview.net/forum? id=Y6w2prqvjM
27. Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., Sutskever, I., et al.: Language models are unsupervised multitask learners. OpenAI blog 1 (8), 9 (2019)
26. Qian, R., Ross, C., Fernandes, J., Smith, E.M., Kiela, D., Williams, A.: Perturbation augmentation for fairer NLP. In: Goldberg, Y., Kozareva, Z., Zhang, Y. (eds.) Proceedings of the 2022 Conference on Empirical Methods in Natural Language Processing. pp. 9496-9521. Association for Computational Linguistics, Abu Dhabi, United Arab Emirates (Dec 2022). https://doi.org/10.18653/v1/2022.emnlp-main. 646, https://aclanthology.org/2022.emnlp-main.646
28. Ren, R., Wang, Y., Qu, Y., Zhao, W.X., Liu, J., Tian, H., Wu, H., Wen, J.R., Wang, H.: Investigating the factual knowledge boundary of large language models with retrieval augmentation. arXiv preprint arXiv:2307.11019 (2023)
30. Sibley, C.G., Stewart, K., Houkamau, C., Manuela, S., Perry, R., Wootton, L.W., Harding, J.F., Zhang, Y., Sengupta, N., Robertson, A.: Ethnic group stereotypes in new zealand. New Zealand journal of psychology 40 (2), 25-36 (October 2011), https://kar.kent.ac.uk/84622/
29. Schick, T., Udupa, S., Schütze, H.: Self-Diagnosis and Self-Debiasing: A Proposal for Reducing Corpus-Based Bias in NLP. Transactions of the Association for Computational Linguistics 9 , 1408-1424 (12 2021). https://doi.org/10.1162/tacl\_a\_ 00434
31. Vidit, V., Engilberge, M., Salzmann, M.: Clip the gap: A single domain generalization approach for object detection. In: 2023 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR). pp. 3219-3229 (2023). https: //doi.org/10.1109/CVPR52729.2023.00314
33. Yogarajan, V., Dobbie, G., Keegan, T.T., Neuwirth, R.J.: Tackling bias in pretrained language models: Current trends and under-represented societies. arXiv preprint arXiv:2312.01509 (2023)
32. Wolf, T.: Huggingface's transformers: State-of-the-art natural language processing. arXiv preprint arXiv:1910.03771 (2019)