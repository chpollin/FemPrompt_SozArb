---
source_file: cf8d8fbb3db223f01b6c.pdf
conversion_date: 2026-08-24T16:46:44.004486
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
## No Free Lunch in Language Model Bias Mitigation? Targeted Bias Reduction Can Exacerbate Unmitigated LLM Biases

Shireen Chand, ∗ Faith Baca, ∗ Emilio Ferrara

Thomas Lord Department of Computer Science, University of Southern California shireenc@usc.edu; faithbac@usc.edu; emiliofe@usc.edu

* equal contributors

## Abstract

Large Language Models (LLMs) inherit societal biases from their training data, potentially leading to harmful or unfair outputs. While various techniques aim to mitigate these biases, their effects are often evaluated only along the dimension of the bias being targeted. This work investigates the cross-category consequences of targeted bias mitigation. We study four bias mitigation techniques applied across ten models from seven model families, and we explore racial, religious, profession- and gender-related biases. We measure the impact of debiasing on model coherence and stereotypical preference using the StereoSet benchmark. Our results consistently show that while targeted mitigation can sometimes reduce bias in the intended dimension, it frequently leads to unintended and often negative consequences in others, such as increasing model bias and decreasing general coherence. These findings underscore the critical need for robust, multi-dimensional evaluation tools when examining and developing bias mitigation strategies to avoid inadvertently shifting or worsening bias along untargeted axes.

## 1 Introduction

Large Language Models (LLMs) have become known as a widespread and revolutionary technology, embedded in many different applications that influence how we access information, create content and interact with the digital world. However, their increasing adoption is accompanied by a fundamental challenge: LLMs trained on large corpora of human-generated content inherit and frequently exacerbate deeply ingrained societal prejudices regarding race, gender, religion and other sensitive categories [43, 13]. The risk of these models reinforcing harmful stereotypes is a critical barrier to their safe and fair adoption, making the development of effective bias mitigation techniques a central focus of AI research [3, 42, 10].

This paper addresses this gap by systematically investigating the cross-category effects of several common mitigation strategies. Our research question is: How does the mitigation of bias along a single axis (e.g., gender) affect the model's performance along several axes (gender, profession, religion, and race)? Our work is motivated by this fundamental question, operating under the hypothesis that there is No Free Lunch in language model bias mitigation: We hypothesize that, due to the entangled nature of conceptual representation with LLMs, targeted interventions on singular bias dimensions will inevitably cause unintended

Numerous mitigation strategies have been proposed, ranging from data debiasing and constrained decoding to fine-tuning and parameter editing [5, 6, 23, 25]. However, the evaluation of these techniques often focuses narrowly on the specific bias dimension being targeted for reduction. Less understood are the potential side effects or cross-category impacts: for example, how does attempting to mitigate gender bias affect religious bias, or how does targeting race bias influence profession-related stereotypes?


<!-- PAGE 2 -->


side effects on other, unmitigated bias dimensions. To test this hypothesis, we propose and implement a comprehensive auditing framework for Transformer-based LLMs.

Our contributions are as follows:

- We conduct a comprehensive study of four post-hoc debiasing techniques (Logit Steering, Activation Patching, BiasEdit and Prompt Debiasing) across ten language models, creating a robust and generalizable body of evidence.
- We find consistent and statistically significant evidence for our "No Free Lunch" hypothesis. Targeted debiasing frequently causes biases to spill over into untargeted dimensions, in some cases causing more harm than the original intervention sought to fix.
- We present our methodology as a necessary framework (cf., Figure 1) for the responsible evaluation of bias mitigation techniques, advocating for the adoption of multi-dimensional analysis as a standard practice in the field to prevent the inadvertent "trading" of one bias for another.

## 2 Related Work

## 2.1 Trade-offs in Algorithmic Success and AI

Efforts to improve fairness in LLMs often reveal just how intertwined linguistic structures and representations are within models. While the study of bias and fairness in machine learning is a well-established field, the notion of interconnectedness extends beyond the scope of LLMs and bias research specifically; adjustments to certain specific representational components in complex technological systems inevitably lead to unforeseen trade-offs [22].

This challenge is fundamentally related to the "No Free Lunch" (NFL) theorem for optimization originally proposed by Wolpert and Macready in 1997 [44]. The NFL theory states that, for a given search or optimization algorithm, any gains in performance on one class of problems are necessarily offset by losses in performance on another class of problems. When applied to machine learning, the theory suggests that no single, universally superior algorithm or intervention exists for any type of problem, as improvements in one aspect of a system often come at the expense of another. We furthered this idea in the context of AI systems by positing the problem of " Butterfly Effect " in AI bias: small, targeted interventions can trigger cascading and unpredictable consequences in the broader system's behavior [11]. Though their original contexts are much wider in scope, both the Butterfly Effect and the NFL theory work in concert to offer a theoretical lens for the analysis of intervention trade-offs in bias mitigation.

## 2.2 Bias Benchmarks

Various recent surveys [27, 36, 12] offer extensive overviews of the different sources of bias, starting from historical representation in training data to algorithmic processing and the different mathematical definitions of fairness.

Our work adopts the StereoSet benchmark [30], which is uniquely suited to our research goals. Unlike binary choice datasets, StereoSet presents example contexts paired with triplets of sentences (stereotype, anti-stereotype, unrelated) which allows for the disentanglement of a model's linguistic coherence from its stereotypical preference. This is critical as Wang et al . [41]

To quantify these biases, a variety of benchmarks have been developed. For example, datasets like CrowS-Pairs [31] and WinoBias [48] measure bias through paired sentences that differ only by a demographic term; the BOLD dataset [9] evaluates bias in open-ended text generation across a vast number of prompts. Bias evaluation has also been extended into other realms such as question answering [35] and Vision Language Models [40].


<!-- PAGE 3 -->


find that there are significant trade-offs between fairness and accuracy in contexts like multitask learning. Furthermore, it has been shown that catastrophic forgetting [21] is a significant challenge for neural networks and LLMs in both learning and unlearning tasks [32, 33, 18]; thus, measuring how debiasing affects model coherence is of essence. Additionally, StereoSet's multidimensional nature, covering race, gender, religion and profession, is also a prerequisite for our investigation into the cross-dimensional effects of bias mitigation.

## 2.3 Existing Mitigation Techniques

A significant body of work has focused on mitigating bias during the model's initial training or a subsequent full fine-tuning phase. These methods aim to embed fairness more fundamentally into the model's parameters. Techniques include data augmentation with counterfactual examples [49], re-weighting training examples to reduce the influence of biased data, and resource-intensive methods like Reinforcement Learning from Human Feedback (RLHF) to steer models toward less harmful behavior [34, 2]. Architectural analyses as done by Leteno et al. [24], try to identify the specific components responsible for encoding bias and give insights that can inform future model design. The Fair Class Balancing technique by Yan and collaborators [46] demonstrates a method for rebalancing training data not on the sensitive attributes themselves, but on automatically discovered proxy attributes, hence improving group fairness. While potentially more robust, these methods are highly computationally expensive, require access to large datasets, and involve a full training pipeline.

In contrast to training based methods, inference based (or post hoc) techniques are computationally cheap and model agnostic. The foundational idea of representing social bias as a linear direction in an embedding space was introduced by Bolukbasi et al. [5] for static word embeddings. The authors demonstrated that certain biases, such as gender, could be identified via PCA on the difference vectors of definitional pairs (e.g., "he" vs "she") and subsequently removed via geometric projection. The Logit Steering and Activation Patching techniques are direct applications of this projection method to the hidden states of modern Transformer models. However, Hila Gonen and Yoav Goldberg [15] find that while these techniques may successfully remove the projection of bias, they tend to leave the clustering of biased concepts intact in the vector space. Thus, debiasing may often operate at a superficial level and, while effective on the surface, may fail to eliminate the underlying structures responsible for bias emergence.

A promising middle ground between full retraining and pure inference time methods is the field of model editing. These techniques make surgical, computationally efficient modification to the weights of a pre-trained model to alter a specific behavior. Techniques like ROME [28], MEMIT [29] and BiasEdit [45] fall under this category. They are a better alternative to full fine-tuning, but still require direct access to the model's parameters.

While the aforementioned techniques have been shown to be generally effective at reducing bias on their target dimension, their evaluation on untargeted dimensions is often overlooked. Most studies measure the reduction of a specific bias and may track its effect on overall model capabilities like perplexity. However, the potential for collateral damage where an intervention on one bias axis inadvertently introduces or exacerbates bias on another is a critical but underexplored area. This paper directly addresses this gap. By applying a suite of interventions and measuring their effects across all four StereoSet dimensions, we provide a complete analysis of their true costs, suggesting that the " No Free Lunch " principle is at play.

## 3 Methodology

## 3.1 Dataset: StereoSet

To evaluate model bias across multiple domains, we utilize the StereoSet datatset [30], a widely recognized benchmark designed specifically to measure stereotypical biases in pretrained


<!-- PAGE 4 -->


Figure 1: A Visual Representation of Our Auditing Framework and the "No Free Lunch" Principle. The process begins with a pre-trained LLM with entangled biases. A debiasing technique is applied to a single target dimension. The intervened model is then evaluated across all dimensions using the StereoSet benchmark.

<!-- image -->

language models. The dataset's structure is uniquely suited for our research, as it allows for a nuanced quantification of bias rather than just its detection.

For our experiments, we use the intersentence portion of StereoSet data and the benchmark's accompanying metrics to probe models' coherence and preferences for stereotypical sentences.

## 3.1.1 Scope and Dimensions

The StereoSet dataset is organized into four distinct domains of social bias, allowing us to investigate the central thesis of our paper: that mitigating bias in one dimension can exacerbate it in others. The validations set used in our evaluation contains a total of 2123 examples, distributed across four dimensions (race, gender, religion, profession). More specifically, after we apply very minor filtering, there are 242, 827, 976, and 78 gender, profession, race, and religion intersentence entries, respectively.

## 3.1.2 Structure of an Intersentence StereoSet Entry

Each data point consists of a context sentence and a set of three carefully constructed stereotype, anti-stereotype, and unrelated completions . The stereotype completions are designed to reflect existing social stereotypes while the anti-stereotype completions subvert these biases. The unrelated completions are included to evaluate the linguistic coherence of models.

An example entry taken from the StereoSet data's race category is as follows:

- Context : "My neighbor is Hispanic."
- Stereotype : "He doesn't speak English."
- Anti-stereotype : "He went to college and is a teacher."
- Unrelated : "Dogs have funny tails."


<!-- PAGE 5 -->


## 3.1.3 Evaluation Metrics

The Language Modeling Score (LMS) serves as a measure of a model's fundamental linguistic competence. In the context of intersentence StereoSet data, LMS evaluates a model's ability to distinguish between meaningful and unrelated sentence completions. For each example, a model is considered successful if it assigns a higher probability to either the stereotypical or antistereotypical completion than to the unrelated completion. The final score is the percentage of examples where this condition is met.

The LMS is calculated as:

<!-- formula-not-decoded -->

where N is the total number of examples and I is the indicator function. For each example i , P stereo ,i , P anti-stereo ,i , and P unrelated ,i denote the model-assigned probabilities of the stereotypical, anti-stereotypical, and unrelated completions, respectively. A higher LMS indicates a more coherent model that better understands the context, and the LMS of an ideal model is 100.

The SS is calculated as:

The next evaluation metric is the Stereotype Score (SS), which directly measures the model's bias by quantifying its preference for stereotypical associations. It is calculated as the percentage of examples in which the model assigns a higher probability to the stereotypical completion over the anti-stereotypical one.

<!-- formula-not-decoded -->

A score of 100 indicates a complete preference for stereotypical assocations, while a score of 0 indicates a complete preference for anti-stereotypical ones. An ideally unbiased model would demonstrate no preference, yielding an SS of 50.

## 3.1.4 Idealized CAT Score (ICAT)

To provide a single, holistic measure that balances linguistic competence with fairness, we use the Idealized Correlation Association Test (ICAT) score. The ICAT score combines LMS and SS, rewarding models that are both knowledgeable (high LMS) and unbiased (SS close to 50).

The ICAT score is calculated as:

The score is formulated to penalize models that are biased in either the stereotyical or antistereotypical direction through its fairness component, min ( SS, 100 -SS ) 50 . This term is maximized at 1 when SS is 50 and drops to 0 when SS is either 0 or 100.

<!-- formula-not-decoded -->

The ICAT score ranges from 0 to 100 and satisfies several desirable axioms:

- An ideal model with perfect coherence (LMS=100) and no bias (SS=50) achieves an ICAT score of 100.
- A fully biased model (SS=0 or SS=100) achieves an ICAT score of 0, regardless of its LMS.
- A random-guess model (LMS=50, SS=50) achieves an ICAT score of 50.


<!-- PAGE 6 -->


Table 1: Models Used in Experiments

| Family   | Model                              | Parameters   |
|----------|------------------------------------|--------------|
| Gemma    | google/gemma-2b                    | 2B           |
| Gemma    | google/gemma-7b                    | 7B           |
| OLMo     | allenai/OLMo-1B-0724-hf            | 1B           |
| OLMo     | allenai/OLMo-2-1124-7B             | 7B           |
| LLaMA    | meta-llama/Llama-3.2-1B            | 1B           |
| LLaMA    | meta-llama/Llama-2-7b-hf           | 7B           |
| Qwen     | Qwen/Qwen2.5-3B-Instruct           | 3B           |
| GPT-Neo  | EleutherAI/gpt-neo-1.3B            | 1.3B         |
| Mistral  | mistralai/Mistral-7B-Instruct-v0.3 | 7B           |
| Deepseek | deepseek-ai/deepseek-llm-7b-chat   | 7B           |

## 3.2 Models

In order to comprehensively evaluate bias and mitigation techniques, we conduct experiments across a diverse set of transformer-based LLMs. This range allows us to observe how model features influence baseline biases and to quantify the efficacy of bias mitigation methods. The models used in our study are summarized in Table 1.

These models were chosen to represent a broad spectrum of model characteristics including size and architecture. The selection enables us to determine whether bias mitigation techniques are more effective for certain models, and to analyze how cross-category bias spillover manifests across different LLM families.

## 3.3 Bias Mitigation Techniques

To investigate the trade-offs of targeted debiasing, we implement four distinct techniques. While all are applied post-hoc without full retraining, they represent three different families of intervention: Geometric Interventions that manipulate activations in-flight, Model Editing Interventions that make surgical modifications to model weights, and Input-Based Interventions that modify the prompt.

## 3.3.1 Bias Direction Computation via PCA

To perform targeted interventions, we must first represent an abstract bias concept as a concrete direction in the model's activation space. We adopt the methodology pioneered by Bolukbasi and collaborators [5] for word embeddings and adapt it for contextual language models.

For each pair, we compute the difference between the two resulting vectors (e.g., ⃗ h "He is" -⃗ h "She is" . This creates a set of difference vectors, each pointing along a slightly different instantiation of the bias axis. To find the single, most dominant direction of variance across all difference vectors, we perform Principal Component Analysis (PCA) and extract the first principal component.

We begin by selecting contrastive pairs for each bias dimension that represent the poles of the bias axis (e.g., ("He is", "She is") for gender, ("Black person", "White person") for race). Each text in a pair is fed through the model, and we extract the final-layer hidden state representations. The hidden state for each text is averaged across all token positions to produce a single vector.

The resulting vector is normalized to have a unit length, giving a pure directional vector, ⃗ v bias that represents the core axis of the targeted bias within the model's activation space. The computed bias vector ⃗ v bias serves as the basis for Logit Steering and Activation Patching.


<!-- PAGE 7 -->


## 3.3.2 Geometric Interventions

The following bias mitigation techniques operate by geometrically projecting out the pre-computed bias direction from the model's hidden state activations during the forward pass.

## 3.3.2.1 Logit Steering (Projection-Based Debiasing)

Logit Steering is an inference-time intervention that aims to remove the influence of the bias direction from the model's activations at a specific layer. The technique is implemented via a forward hook attached to the penultimate layer of the model.

During the forward pass, for each hidden state vector ⃗ h produced by this layer, we perform a linear projection to remove the component that aligns with the bias direction:

<!-- formula-not-decoded -->

where proj ⃗ v bias ( ⃗ h ) is the projection of ⃗ h onto the bias vector ⃗ v bias . The hyperparameter α is a scaling factor that controls the strength of the intervention. For all our experiments, we use α = 1 . 0 , representing a full removal of the projected bias component.

## 3.3.2.2 Activation Patching

Activation Patching is a more aggressive form of projection-based debiasing, repurposing a technique from the field of mechanistic interpretability [28]. While the mathematical operation is identical to Logit Steering, the key difference is its scope [47].

Based on the hypothesis that bias is a distributed representation across multiple layers, this technique applies the same "projection and subtraction" intervention simultaneously to several layers of the model. We apply the hook to the final five layers of each model. This constitutes a more forceful patch intended to remove the bias signal more thoroughly as it propogates through the network. As with Logit steering, we use an intervention strength of α = 1 . 0 .

## 3.3.3 Prompt Debiasing (Input based Intervention)

Unlike the geometric interventions, Prompt Debiasing is an input-based technique that uses the instruction-following capabilities of modern LLMs [38, 2]. This method involves prepending a carefully crafted instructional prompt to the original StereoSet context before it is processed by the model.

The prompts explicitly instruct the model to avoid the targeted bias and provide examples of neutral behavior. For example, the prompt for the gender dimension begins:

"Please respond without gender stereotypes or bias. Treat all genders equally. Examples of unbiased statement: - An engineer could be any gender...."

A critical aspect of our methodology is the evaluation of this technique. To ensure we are only measuring the model's performance on the actual task completion, the tokens corresponding to our instructional prompt are masked and excluded from the Negative Log-Likelihood (NLL) calculation. This isolates the effect of the conditioning prompt on the model's output quality.

## 3.3.4 BiasEdit (Parameter Editing)

BiasEdit is a targeted model editing approach that modifies a small subset of a model's parameters to reduce stereotypical bias while preserving overall language modeling performance [45]. The method has been shown to successfully reduce racial, religious, and gender-related biases in transformer-based LLMs while minimally affecting downstream task performance, but there is no investigation of its cross-dimension effects.


<!-- PAGE 8 -->


The technique works by employing lightweight editor networks that generate parameter updates for specific model components. Based on preliminary bias tracing experiments, Xu et al. [45] conclude that stereotypical associations tend to be concentrated in the MLP layers of transformer blocks with co-occurrences being captured in lower layers. Additional results determine which specific layers are optimal for debiasing. For consistency, we implement the technique on the penultimate layer of each model to balance intervention effectiveness with minimal disruption to overall model performance.

To train the editor networks, we utilize the same StereoSet examples as in other methods with a 8:1 train-dev split for each dimension. The editing process is guided by two loss functions: a symmetric debiasing loss that encourages models to assign equal probability to StereoSet's stereotypical and anti-stereotypical completions, and a retention loss that preserves language modeling capabilities by attempting to maintain predictions on neutral completions. Thus, critically, BiasEdit's goal is not simply to reduce stereotypical bias within models, but to achieve equal distributions between stereotypical and anti-stereotypical predictions while maintaining coherence. While the approach is defined for intrasentence data, we adapt it to handle StereoSet's intersentence examples to reflect our goal of evaluating and understanding the manifestation bias across complex contexts. This process yields a model specifically adapted based on antistereotypes from a single bias dimension.

## 4 Auditing Framework

## 4.1 Stage 1: Baseline Performance Calculation

The initial and most important phase is the establishment of a performance baseline for each model. This provides the reference point against which all changes are measured. The pretrained language model is loaded and run on the StereoSet dataset without any debiasing interventions active. The evaluation is performed independently for each of the four bias dimensions. The raw LMS, SS and ICAT scores for each dimension are calculated and saved.

## 4.2 Stage 2: Intervention Application and Evaluation

For the geometric techniques, the bias direction vector ( ⃗ v bias ) for the target dimension is computed using PCA as described in section § 3.3.1. For BiasEdit, the necessary weight modifications are calculated. Next, the specific debiasing technique is activated. For Logit Steering and Activation Patching, the appropriate forward hooks are registered on the model's layers. For BiasEdit, the pre-calculated weight changes are applied to the model. For Prompt Debiasing, the relevant instructional prompt is prepared for prepending to the input.

## 4.3 Stage 3: Multi-Dimensional Evaluation

With the intervention active for the chosen target dimension, the model is evaluated on the StereoSet benchmark across all four evaluation dimensions using LMS, SS, and ICAT. This process is designed to capture not only the intended effects but also the unintended collateral damage central to our "No Free Lunch" thesis.

## 5 Results

We conducted 160 unique debiasing experiments , evaluating the language models across 4 techniques and 4 target dimensions. Each experiment was audited by measuring its impact across all 4 fairness dimensions, resulting in 640 total evaluations . Using ICAT score as our measure of a model's overall utility, our results reveal that targeted interventions achieved a statistically significant improvement in the on-target ICAT score in only 20.6% cases. Conversely, these


<!-- PAGE 9 -->


## Average Impact on Overall Score (IcAT): A Heatmap of Systemic Trade-offs

Figure 2: Average Impact on Overall Score (ICAT) . Each cell represents the average outcome of an intervention where the y-axis is the dimension being targeted for mitigation and x-axis is the dimension being evaluated. Blue cells indicate a negative average change (net harm to the model's quality and fairness), while red cells indicate a postive change (net improvement).

<!-- image -->

same interventions caused statistically significant collateral damage, worsening the ICAT score on unmitigated, spillover dimensions in 31.5% of all spillover evaluations.

## 5.1 The "No Free Lunch" Principle: A Systemic View of Trade-offs

Our primary finding is that bias mitigation is not a localized fix but a systemic intervention with far-reaching consequences. The Heatmap in Figure 2 summarizes this phenomenon by showing the average change in the model's overall utility (ICAT score) for every target-evaluation pair.

For example, consider the case where profession is both the target and evaluation dimension, which shows a catastrophic average ICAT drop of -3.16 , a result that is statistically significant (t(39) = -2.22, p &lt; .05). This means that the techniques applied to "fix" profession bias were so harmful to the model's core linguistic capabilities that they made the model significantly worse at handling the topic of professions: In essence, the cure was worse than the disease . Similarly, targeting race bias led to an average on-target ICAT drop of -1.70 while also causing significant collateral damage to the model's performance on profession with a drop of -3.20 (t(39) = -2.28, p &lt; .05).

The results are striking and reveal the potential for a pattern of systemic harm . The most dominant feature is the prevalence of negative (blue) values, indicating that these interventions, on average, damage the model's overall quality. This is true not only for off-target "collateral damage" but for the on-target intervention itself.


<!-- PAGE 10 -->


Figure 3: Target Effectiveness vs Spillover Impact (Stereotype Change). This scatter plot visualized the outcome of every unique debiasing intervention. The x-axis represents the on-target effectiveness, showing the change in the Stereotype Score on the dimension the intervention was designed to fix. The y-axis represents the collateral impact.

<!-- image -->

The Scatter Plot in Figure 3 confirms this is not an artifact of averaging. While some interventions land in the ideal outcome quadrant (bottom-left, i.e., Good Target / Good Spillover ), a dense cluster populates the "No Free Lunch" quadrant (bottom-right, i.e., Good Target / Bad Spillover ), showing that it is a frequent outcome for a successful stereotype reduction to be paid for with an increase in stereotypical associations elsewhere.

## 5.2 Dimension-Specific Debiasing Success

Our analysis displays substantial variation in debiasing success across the four dimensions: some dimensions proved quite amenable to intervention while others resulted in significant increases in bias levels, as displayed in Figure 4.

Gender as an evaluation dimension follows closely behind in terms of this pattern. Another potential explanation is that, since there are many fewer StereoSet triplets for both religion and gender, metrics become more sensitive to small changes thus amplifying observed spillovers. This highlights the importance of balance in dimensional composition in future efforts to create bias benchmarks.

Religion emerged as the most spillover-susceptible evaluation dimension, exhibiting both the top beneficial and top adverse spillovers. This suggests that religion is highly entangled with other dimensions of bias and that models may lack the capability to representationally distinguish racial bias, for example, from religious bias.

The beneficial spillovers warrant extra scrutiny as successful reduction of SS does not require that a model maintains its coherence. The top three most beneficial cross-category spillovers


<!-- PAGE 11 -->


Figure 4: Dimension-specific debiasing spillover effects, showing cases with beneficial and adverse spillovers (reductions and increases in LMS, respectively). Both figures display the top spillovers per target-evaluation pair across all model and technique types.

<!-- image -->

were the result of applying the BiasEdit technique. In two of these runs, applying the technique increased LMS, but in the last one, LMS decreased by more than 20% . This shows that mitigating bias along one dimension can result in significant, unintended consequences unrelated to the main goal of debiasing -both good and bad- along other dimensions.

The asymmetric pattern of spillovers suggests that bias mitigation techniques seeking to reduce bias along one dimension at a time may be insufficient. Real-world biases are complex and often represented intersectionally [8, 17] in LLMs [26, 39]. Beyond the context of LLMs, Kearns et al . [19] show that satisfying fairness constraints for certain independent groups does not guarantee fairness for their intersections. Thus, future work in fairness must address these concerns to accurately represent real-world biases. A potential avenue for exploration to reduce spillover effects is debiasing models sequentially so that dimensions are addressed in order of their independence of other dimensions. Addressing the issue of cross-dimension spillover is critical to ensure progress toward fairer LLMs.

## 5.3 Analysis of Bias Mitigation by Technique

In addition to examining the cross-dimension spillover effects, we analyze each technique's success in mitigating bias along intended dimensions. A successful experimental run is defined here as a reduction in SS. Additionally, Figure 5 displays the distributions of change in SS across models for target dimension reduction.

Logit-steering was the least successful method overall, reducing SS in only 35% of runs. This suggests its intervention is often too weak to overcome the model's pre-existing biases. Activation Patching and Prompt Debiasing occupy a middle ground, succeeding 42.5% and 45.0% of the

BiasEdit was overall the most successful debiasing technique, reducing SS along intended dimensions in 72.5% of experimental runs. Nonetheless, Figure 5 shows that BiasEdit also displayed the largest range in SS change by far, suggesting that, while the technique may be successful in reducing bias in many cases, its efficacy is highly model- and dimension-dependent. This contrasts the original results presented in [45] of implementing the method on intrasentence data, indicating that intersentence complexity is also a significant factor in the technique's variability. Therefore, it is critical to develop debiasing methods that support intersentence data to reflect real-world language and biases more faithfully.


<!-- PAGE 12 -->


## Distributions of Bias Changes by Technique

Figure 5: Change in bias is quantified through SS\_diff. SS\_diff changes averaged across all models are displayed. Only experimental runs in which the target and evaluation dimensions match are shown.

<!-- image -->

time, respectively, both contributing to modest average decreases in SS.

## 5.4 Model Analysis

To tie our analyses together, we examine how debiasing interacts with model architecture. Figure 6 displays the changes in SS and LMS averaged across technique and dimension types. The figure also makes clear that editing resulted changes in bias and model coherence that varied substantially between models.

Both Gemma-2b and DeepSeek-7b displayed increases in SS after debiasing. These models may encode biases in ways that are inaccessible to our debiasing techniques. Qwen-3B presents a puzzling case: while LMS is decreased after intervention, SS is increased, implying that the model became both more biased and less coherent overall. This behavior shines light on the scarcity of our understanding about internal representations of bias in LLMs, and further work is needed to thoroughly assess how complex biases manifest in varying model architectures.

Generally, models with fewer parameters display larger drops in LMS, indicating that smaller models were much more susceptible to losses in coherence resulting from intervention. This is likely because smaller models rely more heavily on compact, intertwined representations of language, meaning that any slight perturbation -including debiasing along a singular dimensioncan be highly damaging to the internal structure responsible for general language modeling capabilities. Decreases in LMS occurred in seven out of the ten models after debiasing was applied.


<!-- PAGE 13 -->


Figure 6: Change in SS and LMS metrics by model type. Averages are computed over all technique and dimension types.

<!-- image -->

## 6 Discussion

Our central finding that targeted interventions frequently cause harm to unmitigated dimensions can be explained by the entangled nature of conceptual representations within LLMs [7]. Our results strongly suggest that a model does not learn "gender", "race", etc., as discrete, orthogonal concepts. Instead, these are overlapping, co-dependent subspaces learned from a training corpus where they are deeply linked.

Our results prove that evaluating a debiasing technique solely on its intended target is insufficient and misleading since it might appear successful but may be silently amplifying other harms. New auditing techniques for LLMs are emerging [1, 37]: We argue that the use of a multi-dimensional auditing framework such as the one we proposed in this paper should become a standard practice. Before deploying any bias mitigation technique, practitioners must perform a comprehensive evaluation to map its full impact, measuring not only the intended effects but also the unintended spillover.

The vulnerability of the religion dimension to spillover is a prime example. In Westernbased training data, discussions of religion are intertwined with gender roles, ethnic identities and specific professions [20]. Consequently, when an intervention forcefully alters the model's representation of gender or race, it is not adjusting an isolated variable but disturbing a thread that runs through many other concepts. The resulting collateral damage is not a bug but an emergent feature of the entangled knowledge.

Finally, we must acknowledge the limitations of our study. Our analysis is based on the StereoSet benchmark which, as pointed out by Blodgett and collaborators [4], has some known limitations: They argue that fairness benchmarks like StereoSet inevitably encode a specific set of societal norms and stereotypes reflective of their place and time of creation, which in this case is modern, English-speaking cultures. The associations it labels as "stereotypical" may not be universally applicable across different global or historic contexts. Other critiques shine light on additional concerns about the validity of StereoSet's data in terms of aspects ranging from spelling and grammar to the inaccuracy of claims that the stereotypes represented in the benchmark actually reflect harmful biases rather than innocuous biases or contextual ambiguities [16].

Therefore, while our findings demonstrate bias spillovers within the StereoSet framework , future work is essential to validate these trade-offs in real-world applications and across more culturally-aware benchmarks. First, we will expand to newer social bias benchmarks such as


<!-- PAGE 14 -->


BBQ [35], which highlights attested biases against people belonging to protected classes along nine social dimensions. Furthermore, complementary to bias benchmarks like CrowS-Pairs and StereoSet, RealToxicityPrompts [14] targets generative toxicity, providing prompts and scoring methods to quantify how frequently language models produce toxic continuations in realistic settings: it will be well worth exploring whether other forms of alignment, e.g., harm mitigation, could lead to unintended exacerbation of other harm dimensions.

## 7 Conclusions

Our study systematically investigated the cross-category effects of targeted bias mitigation techniques in LLMs, presenting a framework for thorough bias analysis as well as compelling evidence for our posited "No Free Lunch" principle in debiasing. By applying four distinct post-hoc bias mitigation methods (Logit Steering, Activation Patching, BiasEdit, and Prompt Debiasing) across ten transformer-based LLMs and evaluating their impact on four dimensions of bias (gender, profession, religion, and race) using the StereoSet benchmark, we revealed a pattern of systemic trade-offs.

Our findings also lay the foundation for future approaches to fairer, more robust methods for model debiasing. Firstly, existing methods are designed to mitigate single-axis biases that occur within the context of singular simplistic sentences. Models generally display lower understanding of longer contexts and intersentence data overall. Yet, natural language and societal biases are not constrained by sentence length and complexity. Future methods will need to be equipped to handle both longer, intersentence debiasing data and more complex, multi-dimensional, and even intersectional biases in order to accurately represent language and society.

Our results show that targeted debiasing frequently leads to collateral damage , significantly worsening overall model utility in the majority of experimental runs. Additionally, we find that bias mitigation techniques seeking to address only one dimension of bias often result in cross-category spillover. In many cases, out findings demonstrate that mitigating bias along a singular dimension can exacerbate it along another . While there are many existing debiasing techniques that vary in terms of efficacy, the methods we explored consistently have the potential to unintentionally make models more biased and even less coherent overall. In addition, while we found that larger models are more robust and equipped to resist the occasionally catastrophic effects of debiasing on general language modeling abilities, bias mitigation techniques varied significantly across model types. This suggests that many characteristics of biases and how they manifest in model architectures are unexplored .

Another future route for investigation is how biases manifest differently in models with varying architectures. As models' complexity increases, this represents an important step in the fields of both bias research and mechanistic interpretability.

Ultimately, our work highlights the "No Free Lunch" principle: every debiasing intervention comes with trade-offs . Someday, these insights may guide the development of LLMs and, more broadly, AI systems that balance trade-offs thoughtfully to become fairer, more reliable, and more reflective of the communities they serve.

Finally, future benchmarks and tools for bias detection and analysis must prioritize compositional balance and clear contextual validity: it is essential for tools claiming to detect certain harmful biases to ground their data in real-world harms experienced by varying communities rather than examples that may misrepresent the very biases they purport to address. This balance will not only bolster the framework we have presented but also make significant progress toward fair LLMs.


<!-- PAGE 15 -->


## References

- [1] Maryam Amirizaniani, Elias Martin, Tanya Roosta, Aman Chadha, and Chirag Shah. Auditllm: A tool for auditing large language models using multiprobe approach. In Proceedings of the 33rd ACM International Conference on Information and Knowledge Management , pages 5174-5179, 2024. URL https://dl.acm.org/doi/abs/10.1145/3627673.3679222 .
- [2] Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, John Kernion, Andy Jones, Anna Chen, Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, Carol Chen, Catherine Olsson, Chris Olah, Danny Hernandez, Dawn Drain, Deep Ganguli, Dustin Li, Eli Tran-Johnson, E Perez, Jamie Kerr, Jared Mueller, Jeffrey Ladish, J Landau, Kamal Ndousse, Kamil˙ e Lukoi¯ ut˙ e, Liane Lovitt, Michael Sellitto, Nelson Elhage, Nicholas Schiefer, Noem'i Mercado, Nova Dassarma, Robert Lasenby, Robin Larson, Sam Ringer, Scott Johnston, Shauna Kravec, Sheer El Showk, Stanislav Fort, Tamera Lanham, Timothy TelleenLawton, Tom Conerly, T. J. Henighan, Tristan Hume, Sam Bowman, Zac Hatfield-Dodds, Benjamin Mann, Dario Amodei, Nicholas Joseph, Sam McCandlish, Tom B. Brown, and Jared Kaplan. Constitutional ai: Harmlessness from ai feedback. ArXiv , abs/2212.08073, 2022. URL https://api.semanticscholar.org/CorpusID:254823489 .
- [3] Su Lin Blodgett, Solon Barocas, Hal Daume III, and Hanna Wallach. Language (technology) is power: A critical survey of 'bias' in nlp. In Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics , pages 5454-5476, 2020. URL https: //aclanthology.org/2020.acl-main.485/ .
- [4] Su Lin Blodgett, Gilsinia Lopez, Alexandra Olteanu, Robert Sim, and Hanna Wallach. Stereotyping Norwegian salmon: An inventory of pitfalls in fairness benchmark datasets. In Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing (Volume 1: Long Papers) , pages 1004-1015, Online, August 2021. Association for Computational Linguistics. doi: 10.18653/v1/2021.acl-long.81. URL https://aclanthology.org/2021. acl-long.81/ .
- [5] Tolga Bolukbasi, Kai-Wei Chang, James Y. Zou, Venkatesh Saligrama, and Adam T. Kalai. Man is to computer programmer as woman is to homemaker? debiasing word embeddings. In Advances in Neural Information Processing Systems 29 (NeurIPS 2016) , pages 4349-4357. Curran Associates, Inc., 2016. URL https://proceedings.neurips.cc/ paper/2016/hash/a486cd07e4ac3d270571622f4f316ec5-Abstract.html .
- [6] Shikha Bordia and Samuel R. Bowman. Identifying and reducing gender bias in word-level language models. In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long Papers) , pages 779-784. Association for Computational Linguistics, 2019. doi: 10.18653/v1/N19-1077. URL https://aclanthology.org/N19-1077 .
- [7] Aylin Caliskan, Joanna J Bryson, and Arvind Narayanan. Semantics derived automatically from language corpora contain human-like biases. Science , 356(6334):183-186, 2017. URL https://www.science.org/doi/abs/10.1126/science.aal4230 .
- [8] Kimberle Crenshaw. Mapping the margins: Intersectionality, identity politics, and violence against women of color. Stanford Law Review , 43(6):1241-1299, 1991. doi: 10.2307/1229039. URL https://doi.org/10.2307/1229039 .
- [9] Jwala Dhamala, Tony Sun, Varun Kumar, Satyapriya Krishna, Yada Pruksachatkun, Kai-Wei Chang, and Rahul Gupta. Bold: Dataset and metrics for measuring biases


<!-- PAGE 16 -->


in open-ended language generation. In Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency , FAccT '21, page 862-872, New York, NY, USA, 2021. Association for Computing Machinery. doi: 10.1145/3442188.3445924. URL https://doi.org/10.1145/3442188.3445924 .

- [10] Emilio Ferrara. Should chatgpt be biased? challenges and risks of bias in large language models. First Monday , 2023. URL https://firstmonday.org/ojs/index.php/ fm/article/view/13346 .
- [11] Emilio Ferrara. The butterfly effect in artificial intelligence systems: Implications for ai bias and fairness. Machine Learning with Applications , 15:100525, 2024. ISSN 2666-8270. doi: https://doi.org/10.1016/j.mlwa.2024.100525. URL https://www.sciencedirect. com/science/article/pii/S266682702400001X .
- [12] Emilio Ferrara. Fairness and bias in artificial intelligence: A brief survey of sources, impacts, and mitigation strategies. Sci , 6(1):3, 2024. URL https://www.mdpi.com/2413-4155/6/ 1/3 .
- [13] Isabel O Gallegos, Ryan A Rossi, Joe Barrow, Md Mehrab Tanjim, Sungchul Kim, Franck Dernoncourt, Tong Yu, Ruiyi Zhang, and Nesreen K Ahmed. Bias and fairness in large language models: A survey. Computational Linguistics , 50(3):1097-1179, 2024. URL https: //aclanthology.org/2024.cl-3.8/ .
- [14] Samuel Gehman, Suchin Gururangan, Maarten Sap, Yejin Choi, and Noah A Smith. Realtoxicityprompts: Evaluating neural toxic degeneration in language models. In Findings of the Association for Computational Linguistics: EMNLP 2020 , pages 3356-3369, 2020. URL https://aclanthology.org/2020.findings-emnlp.301/ .
- [15] Hila Gonen and Yoav Goldberg. Lipstick on a pig: Debiasing methods cover up systematic gender biases in word embeddings but do not remove them. In Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 1 (Long and Short Papers) , pages 609614, Minneapolis, Minnesota, June 2019. Association for Computational Linguistics. doi: 10.18653/v1/N19-1061. URL https://aclanthology.org/N19-1061/ .
- [16] Priyanshul Govil, Hemang Jain, Vamshi Bonagiri, Aman Chadha, Ponnurangam Kumaraguru, Manas Gaur, and Sanorita Dey. Cobias: Assessing the contextual reliability of bias benchmarks for language models. In Proceedings of the 17th ACM Web Science Conference 2025 , Websci '25, page 460-471. ACM, May 2025. doi: 10.1145/3717867.3717923. URL http://dx.doi.org/10.1145/3717867.3717923 .
- [17] Wei Guo and Aylin Caliskan. Detecting emergent intersectional biases: Contextualized word embeddings contain a distribution of human-like biases. In Proceedings of the 2021 AAAI/ACM Conference on AI, Ethics, and Society , AIES '21, page 122-133, New York, NY, USA, 2021. Association for Computing Machinery. doi: 10.1145/3461702.3462536. URL https://doi.org/10.1145/3461702.3462536 .
- [18] Karina Halevy, Anna Sotnikova, Badr AlKhamissi, Syrielle Montariol, and Antoine Bosselut. 'flex tape can't fix that': Bias and misinformation in edited language models. In Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing , pages 8690-8707, Miami, Florida, USA, November 2024. Association for Computational Linguistics. doi: 10.18653/v1/2024.emnlp-main.494. URL https://aclanthology.org/ 2024.emnlp-main.494/ .


<!-- PAGE 17 -->


- [19] Michael Kearns, Seth Neel, Aaron Roth, and Zhiwei Steven Wu. Preventing fairness gerrymandering: Auditing and learning for subgroup fairness, 2018. URL https://arxiv.org/ abs/1711.05144 .
- [20] Hannah Rose Kirk, Yennie Jun, Filippo Volpin, Haider Iqbal, Elias Benussi, Frederic Dreyer, Aleksandar Shtedritski, and Yuki Asano. Bias out-of-the-box: An empirical analysis of intersectional occupational biases in popular generative language models. Advances in neural information processing systems , 34:2611-2624, 2021. URL https://dl.acm.org/doi/10. 5555/3540261.3540461 .
- [21] James Kirkpatrick, Razvan Pascanu, Neil Rabinowitz, Joel Veness, Guillaume Desjardins, Andrei A. Rusu, Kieran Milan, John Quan, Tiago Ramalho, Agnieszka Grabska-Barwinska, Demis Hassabis, Claudia Clopath, Dharshan Kumaran, and Raia Hadsell. Overcoming catastrophic forgetting in neural networks. Proceedings of the National Academy of Sciences , 114(13):3521-3526, March 2017. ISSN 1091-6490. doi: 10.1073/pnas.1611835114. URL http://dx.doi.org/10.1073/pnas.1611835114 .
- [22] Jon Kleinberg, Sendhil Mullainathan, and Manish Raghavan. Inherent trade-offs in the fair determination of risk scores. In 8th Innovations in Theoretical Computer Science Conference (ITCS 2017) , pages 43-1. Schloss Dagstuhl-Leibniz-Zentrum fur Informatik, 2017. URL https://dl.acm.org/doi/10.1145/3603195.3603197 .
- [23] Anne Lauscher, Tobias Lueken, and Goran Glavas. Sustainable modular debiasing of pretrained contextualized language models. In Findings of the Association for Computational Linguistics: EMNLP 2021 , pages 3221-3235. Association for Computational Linguistics, 2021. doi: 10.18653/v1/2021.findings-emnlp.274. URL https://aclanthology.org/2021. findings-emnlp.274 .
- [24] Thibaud Leteno, Antoine Gourru, Charlotte Laclau, and Christophe Gravier. An Investigation of Structures Responsible for Gender Bias in BERT and DistilBERT , pages 249-261. 04 2023. doi: 10.1007/978-3-031-30047-9\_20. URL https://link.springer.com/chapter/ 10.1007/978-3-031-30047-9\_20 .
- [25] Zichao Lin, Shuyan Guan, Wending Zhang, Huiyan Zhang, Yugang Li, and Huaping Zhang. Towards trustworthy llms: a review on debiasing and dehallucinating in large language models. Artificial Intelligence Review , 57(9):243, 2024. URL https://link.springer. com/article/10.1007/s10462-024-10896-y .
- [26] Weicheng Ma, Brian Chiang, Tong Wu, Lili Wang, and Soroush Vosoughi. Intersectional stereotypes in large language models: Dataset and analysis. In Findings of the Association for Computational Linguistics: EMNLP 2023 , pages 8589-8597, Singapore, December 2023. Association for Computational Linguistics. doi: 10.18653/v1/2023.findings-emnlp.575. URL https://aclanthology.org/2023.findings-emnlp.575/ .
- [27] Ninareh Mehrabi, Fred Morstatter, Nripsuta Saxena, Kristina Lerman, and Aram Galstyan. A survey on bias and fairness in machine learning. ACM Comput. Surv. , 54(6), July 2021. ISSN 0360-0300. doi: 10.1145/3457607. URL https://doi.org/10.1145/3457607 .
- [28] Kevin Meng, David Bau, Alex Andonian, and Yonatan Belinkov. Locating and editing factual associations in GPT. In Advances in Neural Information Processing Systems 35 (NeurIPS 2022) , pages 17359-17372. Curran Associates, Inc., 2022. URL https://proceedings.neurips.cc/paper\_files/paper/2022/hash/ 508cabc3a7aea6b615fa821b0d99b341-Abstract-Conference.html .


<!-- PAGE 18 -->


- [29] Kevin Meng, Arnab Sen Sharma, Alex J Andonian, Yonatan Belinkov, and David Bau. Mass-editing memory in a transformer. In The Eleventh International Conference on Learning Representations , 2023. URL https://openreview.net/forum?id=MkbcAHIYgyS .
- [30] Moin Nadeem, Anna Bethke, and Siva Reddy. StereoSet: Measuring stereotypical bias in pre-trained language models. In Proceedings of the 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing (Volume 1: Long Papers) , pages 5356-5371. Association for Computational Linguistics, 2021. doi: 10.18653/v1/2021.acl-long.416. URL https: //aclanthology.org/2021.acl-long.416 .
- [31] Nikita Nangia, Clara Vania, Rasika Bhalerao, and Samuel R. Bowman. CrowS-pairs: A challenge dataset for measuring social biases in masked language models. In Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP) , pages 1953-1967, Online, November 2020. Association for Computational Linguistics. doi: 10.18653/v1/2020.emnlp-main.154. URL https://aclanthology.org/2020.emnlp-main. 154/ .
- [32] Thanh Tam Nguyen, Thanh Trung Huynh, Zhao Ren, Phi Le Nguyen, Alan Wee-Chung Liew, Hongzhi Yin, and Quoc Viet Hung Nguyen. A survey of machine unlearning. ACM Trans. Intell. Syst. Technol. , 16(5), September 2025. ISSN 2157-6904. doi: 10.1145/3749987. URL https://doi.org/10.1145/3749987 .
- [33] Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul Christiano, Jan Leike, and Ryan Lowe. Training language models to follow instructions with human feedback, 2022. URL https://arxiv.org/abs/2203.02155 .
- [34] Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, et al. Training language models to follow instructions with human feedback. Advances in neural information processing systems , 35:27730-27744, 2022. URL https://dl.acm.org/doi/abs/10.5555/3600270. 3602281 .
- [35] Alicia Parrish, Angelica Chen, Nikita Nangia, Vishakh Padmakumar, Jason Phang, Jana Thompson, Phu Mon Htut, and Samuel Bowman. Bbq: A hand-built bias benchmark for question answering. In Findings of the Association for Computational Linguistics: ACL 2022 , pages 2086-2105, 2022. URL https://aclanthology.org/2022.findings-acl. 165/ .
- [36] Dana Pessach and Erez Shmueli. A review on fairness in machine learning. ACM Comput. Surv. , 55(3), February 2022. ISSN 0360-0300. doi: 10.1145/3494672. URL https://doi. org/10.1145/3494672 .
- [37] Peiran Qiu, Siyi Zhou, and Emilio Ferrara. Information suppression in large language models: Auditing, quantifying, and characterizing censorship in deepseek. Information Sciences , 724:122702, 2026. ISSN 0020-0255. doi: https://doi.org/10.1016/j.ins.2025.122702. URL https://www.sciencedirect.com/science/article/pii/S0020025525008357 .
- [38] Timo Schick, Sahana Udupa, and Hinrich Schutze. Self-diagnosis and self-debiasing: A proposal for reducing corpus-based bias in nlp. Transactions of the Association for Computational Linguistics , 9:1408-1424, 2021. URL https://aclanthology.org/2021.tacl-1. 84/ .


<!-- PAGE 19 -->


- [39] Badr Souani, Ezekiel Soremekun, Mike Papadakis, Setsuko Yokoyama, Sudipta Chattopadhyay, and Yves Le Traon. Hinter: Exposing hidden intersectional bias in large language models, 2025. URL https://arxiv.org/abs/2503.11962 .
- [40] Sibo Wang, Xiangkui Cao, Jie Zhang, Zheng Yuan, Shiguang Shan, Xilin Chen, and Wen Gao. Vlbiasbench: A comprehensive benchmark for evaluating bias in large vision-language model, 2024. URL https://arxiv.org/abs/2406.14194 .
- [41] Yuyan Wang, Xuezhi Wang, Alex Beutel, Flavien Prost, Jilin Chen, and Ed H. Chi. Understanding and improving fairness-accuracy trade-offs in multi-task learning. In Proceedings of the 27th ACM SIGKDD Conference on Knowledge Discovery &amp; Data Mining , KDD '21, page 1748-1757, New York, NY, USA, 2021. Association for Computing Machinery. doi: 10.1145/3447548.3467326. URL https://doi.org/10.1145/3447548.3467326 .
- [42] Laura Weidinger, John Mellor, Maribeth Rauh, Conor Griffin, Jonathan Uesato, Po-Sen Huang, Myra Cheng, Mia Glaese, Borja Balle, Atoosa Kasirzadeh, et al. Ethical and social risks of harm from language models. arXiv preprint arXiv:2112.04359 , 2021. URL https://arxiv.org/abs/2112.04359 .
- [43] Laura Weidinger, Jonathan Uesato, Maribeth Rauh, Conor Griffin, Po-Sen Huang, John Mellor, Amelia Glaese, Myra Cheng, Borja Balle, Atoosa Kasirzadeh, et al. Taxonomy of risks posed by language models. In Proceedings of the 2022 ACM conference on fairness, accountability, and transparency , pages 214-229, 2022. URL https://dl.acm.org/doi/ 10.1145/3531146.3533088 .
- [44] D.H. Wolpert and W.G. Macready. No free lunch theorems for optimization. IEEE Transactions on Evolutionary Computation , 1(1):67-82, 1997. doi: 10.1109/4235.585893. URL https://ieeexplore.ieee.org/document/585893 .
- [45] Xin Xu, Wei Xu, Ningyu Zhang, and Julian McAuley. BiasEdit: Debiasing stereotyped language models via model editing. In Proceedings of the 5th Workshop on Trustworthy NLP (TrustNLP 2025) , pages 166-184, Albuquerque, New Mexico, May 2025. Association for Computational Linguistics. doi: 10.18653/v1/2025.trustnlp-main.13. URL https:// aclanthology.org/2025.trustnlp-main.13/ .
- [46] Shen Yan, Hsien-te Kao, and Emilio Ferrara. Fair class balancing: Enhancing model fairness without observing sensitive attributes. CIKM '20, page 1715-1724, New York, NY, USA, 2020. Association for Computing Machinery. doi: 10.1145/3340531.3411980. URL https: //doi.org/10.1145/3340531.3411980 .
- [47] Fred Zhang and Neel Nanda. Towards best practices of activation patching in language models: Metrics and methods. In The Twelfth International Conference on Learning Representations , 2023. URL https://openreview.net/forum?id=Hf17y6u9BC .
- [48] Jieyu Zhao, Tianlu Wang, Mark Yatskar, Vicente Ordonez, and Kai-Wei Chang. Gender bias in coreference resolution: Evaluation and debiasing methods. In Proceedings of the 2018 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Volume 2 (Short Papers) , pages 1520, New Orleans, Louisiana, June 2018. Association for Computational Linguistics. doi: 10.18653/v1/N18-2003. URL https://aclanthology.org/N18-2003/ .
- [49] Ran Zmigrod, Sebastian Mielke, Hanna Wallach, and Ryan Cotterell. Counterfactual data augmentation for mitigating gender stereotypes in languages with rich morphology. pages 1651-1661, 01 2019. doi: 10.18653/v1/P19-1161. URL https://aclanthology. org/P19-1161/ .