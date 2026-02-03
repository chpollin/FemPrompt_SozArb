---
source_file: Chen_2024_Exploring_complex_mental_health_symptoms_via.pdf
conversion_date: 2026-02-03T18:23:09.191236
converter: docling
quality_score: 95
---

<!-- PAGE 1 -->
## Exploring Complex Mental Health Symptoms via Classifying Social Media Data with Explainable LLMs

## Kexin Chen

University of Toronto, Canada

Noelle Lim LinkedIn Corporation, USA Claire Lee Princeton University, USA Michael Guerzhoy

University of Toronto, Canada

## Abstract

We propose a pipeline for gaining insights into complex diseases by training LLMs on challenging social media text data classification tasks, obtaining explanations for the classification outputs, and performing qualitative and quantitative analysis on the explanations. We report initial results on predicting, explaining, and systematizing the explanations of predicted reports on mental health concerns in people reporting Lyme disease concerns. We report initial results on predicting future ADHD concerns for people reporting anxiety disorder concerns, and demonstrate preliminary results on visualizing the explanations for predicting that a person with anxiety concerns will in the future have ADHD concerns.

Keywords: Mental Health, Anxiety Disorder, ADHD, Lyme disease, RoBERTa, Explainable AI, Qualitative Analysis

## 1. Introduction

Asubstantial proportion of people with mental health issues do not consult a specialist (Statistics Canada, 2023) and many turn online to discuss their concerns (Giles and Newbold, 2011). For many complex diseases, but especially for diseases with mental health aspects, syndromes interact with the nosology 1 and the cultures of the clinician specializations in complex and ill-understood ways (Zachar and Kendler, 2017). Social media offers

1. nosology(n): the branch of medical science dealing with the classification of diseases.

© 2024 K. Chen, N. Lim, C. Lee &amp; M. Guerzhoy.

co.chen@mail.utoronto.ca arinlim@gmail.com

skclairelee@gmail.com guerzhoy@cs.toronto.edu

a wealth of data not traditionally available to clinicians, with millions of patients talking about their symptoms (Low et al., 2020).

In this paper, we propose a pipeline for gaining new insights from large-scale social media data:

1. Identify a challenging classification task
2. Learn LLM-based classifiers for the task
3. Generate explanations for the LLM's classification outputs
4. Use quantitative and qualitative analyses to gain new insights from the data

In this work, we apply this approach to two tasks. First, building on the work in (Lee et al., 2024), we classify social media users in the r/anxiety subreddit who have not yet posted in the r/ADHD subreddit as ones that will or will not post in the r/ADHD subreddit in the future, and then visualize the explanations for that classifier. The task is interesting because it can be used as a proxy task for detecting ADHD concerns in people with anxiety concerns, because the task seems impossible for keyword-based architectures (Lee et al., 2024), and the visualization of prediction explanations in this task can lead in to insights about both symptoms and nosology of anxiety disorders and ADHD. Second, we classify Reddit posts that potentially contain concerns about Lyme disease as possibly containing mental health concerns related to Lyme or not containing mental health related to Lyme, based on a small manually-labelled dataset. The task is interesting because it allows us


<!-- PAGE 2 -->


to iteratively obtain a larger dataset of social media posts related to both Lyme disease and mental health. We analyze the explanations for the classifier that classifies posts as mental health-related or not in order to obtain possibly-novel preliminary insights into the mental health aspects of Lyme disease.

## 2. Background

Research shows that up to 53% of adults with ADHD may also suffer from an anxiety disorder, while approximately 28% of adults with an anxiety disorder may have undiagnosed ADHD (Quinn and Madhoo, 2014) (Ameringen et al., 2011). This overlap can complicate clinical decision-making, as anxiety or depression symptoms are often treated without recognizing the potential presence of ADHD, resulting in only the symptoms for anxiety being treated and ADHD beign left untreated (Katzman et al., 2017). Lyme disease is known for its significant neurological and psychological impacts. Approximately 40% of individuals diagnosed with Lyme disease experience neurological symptoms, with a notable percentage also developing mental health disorders (Fallon and Nields, 1994). The prevalence of mental health disorders for those diagnosed with Lyme disease is much higher than in the general population (Fallon et al., 2021).

## 3. Methods

## 3.1. Task Description

## 3.1.1. Will exclusive /r/Anxiety poster also post in /r/ADHD in the future?

In Lee et al. (2024), data is collected from Reddit to classify posts from users who only discuss anxiety in the /r/Anxiety subreddit versus those who transition from posting in the /r/Anxiety to discussing ADHD in /r/Anxiety . This classification task serves as a proxy for identifying individuals who might be developing awareness of their potential comorbid ADHD condition.

## 3.1.2. Mental health aspects of Lyme disease

We classify Lyme disease-related posts as either mental health-related or not using RoBERTa models, which have demonstrated their utility in classifying mental health disorders from textual data on social media (Malviya et al., 2021) (Murarka et al., 2021) (Lee et al., 2024).

## 3.2. Datasets

ADHD and Anxiety Dataset Text data is collected from the /r/Anxiety and /r/ADHD subreddits (Lee et al., 2024). Posts are included if users exclusively post in the /r/Anxiety or initially posted there before starting to also post in /r/ADHD , with a total of 47,482 posts collected from before 2023. Posts from /r/ADHD are excluded if posted within six months of the first /r/Anxiety post. This results in a total of 47,482 posts, of which 33% are retained for testing purposes.

## Manually-labelled Mental-Health-Related Symptoms of Lyme disease Dataset

We collect a dataset of 58,398 Reddit posts containing the term 'Lyme' from Reddit from before 2022. A subset of 343 posts is manually labeled as mental-healthrelated or non-health-related based on specific criteria. Any of the following are reasons to label a post as mental-health-related: 1) Mention of specific mental health symptoms 2) Ideation of self-harm or suicide 3) emotional distress 4) anger management issues 5) social relationship challenges 6) persistent feelings of emptiness 7) Substance use issues.

## 3.3. Expanded Mental-Health-Related Symptoms of Lyme Dataset

We train a RoBERTA classifier to predict whether a post is mental-health-related or not, and classify 58,398 posts containing the keyword 'Lyme' as mental-health-related or not. We retain the potentially mental-health-related Lyme posts.

## 3.4. Baseline AskDocs dataset

We scrape the latest 5,000 posts from before 2022 from the general-medical-interest r/AskDocs subreddit as a reference set.

## 3.5. Classification results

For the mental-health-related datasets, we present results with baselines as well as with a fine-tuned RoBERTa using a 80/20 training/test split. The results are shown in Table 1.


<!-- PAGE 3 -->


Table 1: Performance metrics for predicting mental-health-related posts in ADHD and Lyme datasets (balanced for 50% baserate)

| Dataset                                    | Metric   |   Logistic Regression |   Na¨ ıve Bayes |   RoBERTa |
|--------------------------------------------|----------|-----------------------|-----------------|-----------|
| Will post in ADHD after posting in Anxiety | Accuracy |                  0.48 |            0.59 |      0.89 |
|                                            | F1 Score |                  0.61 |            0.59 |      0.89 |
| Lyme                                       | Accuracy |                  0.81 |            0.72 |      0.88 |
| Lyme                                       | F1 Score |                  0.42 |            0.47 |      0.73 |

Table 2: Examples of RoBERTa classifier's explanation for positive predictions for ADHD (ADHD/Anxiety) and Mental Health concerns (Lyme) on Reddit posts rephrased and altered for anonymity

| Datasets               | Examples                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ADHD and Anxiety       | Post: I missed a deadline by several days and I'm extremely stressed. I haven't felt well over the past weekend. I've had multiple arguments with my mom, and our relationship is more strained than ever. I ended up procrastinating and avoided urgent tasks, including reading the email about the assignment I missed. I finally checked it today and realized I've been behind for days. I know I should explain the situation to my instructor and complete the work as soon as possible, but the consequences feel significant this time, and I can't stop worrying about it. I also don't know how to explain my situation without it sounding like I'm making excuses. I'm lost. I can't even focus on the email to understand what I need to do now; my eyes literally hurt from reading it.                                                                                                                                                                                                                          |
| Lyme and Mental Health | Post: Five years ago, I contracted Lyme disease and experienced something quite unusual and intriguing; my brain felt like it was constantly operating at full capacity. It's hard to put the sensation into words, but I recall it involved a struggle to gauge size (everything appeared enormous yet proportional to everything else, including myself), which made me constantly attempt to 'render' objects in my mind without any success. This phenomenon only occurred at night and was particularly noticeable when I tried to fall asleep and began to lightly dream before dozing off. On the nights this occurred, I would be in a delirious state in all but one instance (total of 5-6 episodes). Although these episodes began when I got Lyme disease, they continued sporadically afterward, with the last one occurring about two years after the initial infection, and were usually, though not always, linked to a fever. Is there a name for this phenomenon? Where can I find more information about it? |

## 3.6. Generating explanations

We generate explanations as follows for the RoBERTa classifier: each post is broken up into phrases (defined as sentence fragments enclosed in punctuation marks). Each phrase in turn is masked out, and the phrases that influence the classifier output the most are highlighted. The examples of RoBERTa classifier's highlights on Reddit posts for mental health indicators are shown in Table 2, and more examples for Lyme disease posts related to mental health are pre- sented in Table 4 in the Appendix. All the examples we show in the paper have been rephrased to ensure that user privacy is protected.

## 3.7. Using Explanations to Explore Mental Health Aspects of Lyme Disease

We use the following procedure to explore the mental health aspects of Lyme disease.


<!-- PAGE 4 -->


Table 3: Comparison of counts of unusual symptoms that we also highlighted by RoBERTa as explanation for classifying post as mental-health-related in the Lyme dataset (out of top 300 matches) and AskDocs (reference) (out of top 300) dataset

| Phrases                                                                                                                                   |   Lyme Dataset (%) |   AskDocs (ref- erence) |
|-------------------------------------------------------------------------------------------------------------------------------------------|--------------------|-------------------------|
| The ceiling of my current apartment has mold, and the landlord is slow to clean it up [theme: mold]                                       |              44    |                    19.7 |
| I experience sinus pressure that feels like it's squeezing my nose, with tension noticeable when I look downward [theme: si- nus/nose]    |              22.7  |                    18   |
| My weight issues stem from a combination of an eating disorder and thyroid problems [theme: weight/eating disorder/thyroid]               |               5    |                     3.3 |
| My body clenches and contracts involuntarily, with intense ab- dominal twitches causing my body to jerk [theme: clench- ing/contractions] |              45.3  |                    41.7 |
| Even now, I have flare-ups when highly stressed, mainly mani- festing as persistent facial pressure [theme: flare-ups]                    |              10    |                     8   |
| I suddenly developed significant cross-eyed vision [theme: vision]                                                                        |               5.33 |                     4   |

1. Classify 5,000 posts containing 'Lyme' as mental-health related or not
2. Obtain explanations for the posts classified as mental-health-related
3. Iterate by grouping the explanations together manually
4. Obtain OpenAI text-embedding-3-large embeddings for each group of explanations and manually look through the top 300 matches by cosine similarity in all the Lyme posts for more similar explanations
5. Look through the top 300 matches for each group of explanations in the reference r/AskDocs corpus.

Preliminary results are available in Table 3. We identify that the mold theme appears more prevalent in the Lyme dataset than in the baseline AskDocs dataset (p-value &lt; 0 . 01 when using a simple random sample model) in the hand-labelled top 300 matches for the symptom description, indicating a potential avenue to explore in the three-way interaction of expressing concern about Lyme, expressing mentalhealth concerns, and speaking about mold.

## 4. Conclusion

We work with two mental-health-related social media text datasets. We demonstrate a pipeline of identifying an interesting and challenging classification task, obtaining explanations for RoBERTa's classification decisions on the tasks, and exploring those explanations. For the Lyme dataset, we demonstrate preliminary results showing a proof-of-concept of a pipeline where the explanations of the classifier are used in order to identify interesting patterns in the dataset.

## References

Michael Van Ameringen, Catherine Mancini, William Simpson, and Beth Patterson. Adult attention deficit hyperactivity disorder in an anxiety disorders population. CNS Neurosci. Ther. , 17(4):221226, April 2011.

Brian A. Fallon and Jenifer A. Nields. Lyme disease: A neuropsychiatric illness. Am. J. Psychiatry , 151 (11):1571-1583, November 1994.

Brian A. Fallon, Trine Madsen, Annette Erlangsen, and Michael E. Benros. Lyme borreliosis and as-


<!-- PAGE 5 -->


- sociations with mental disorders and suicidal behavior: A nationwide danish cohort study. Am. J. Psychiatry , 178(10):921-931, October 2021.
- David C. Giles and Julie Newbold. Self-and otherdiagnosis in user-led mental health online communities. Qual. Health Res. , 21(3):419-428, March 2011.
- Martin A. Katzman, Terrence S. Bilkey, Pratap R. Chokka, Angelo Fallu, and Laureen J. Klassen. Adult adhd and comorbid disorders: Clinical implications of a dimensional approach. BMC Psychiatry , 17(1), July 2017. doi: 10.1186/ s12888-017-1463-3.
- Claire S. Lee, Noelle Lim, and Michael Guerzhoy. Detecting a proxy for potential comorbid adhd in people reporting anxiety symptoms from social media data. In 9th Workshop on Computational Linguistics and Clinical Psychology , page 172, 2024.
- Daniel M. Low, Laurie Rumker, Tanya Talkar, John Torous, Guillermo Cecchi, and Soumya S. Ghosh. Natural language processing reveals vulnerable mental health support groups and heightened health anxiety on reddit during covid-19: Observational study. J. Med. Internet Res. , 22(10):e22635, October 2020. doi: 10.2196/22635.
- Keshu Malviya, Bholanath Roy, and S.K. Saritha. A transformers approach to detect depression in social media. In 2021 International Conference on Artificial Intelligence and Smart Systems (ICAIS) , pages 718-723. IEEE, March 2021.
- Ankit Murarka, Balaji Radhakrishnan, and Sushma Ravichandran. Classification of mental illnesses on social media using roberta. In Proceedings of the 12th International Workshop on Health Text Mining and Information Analysis , pages 59-68, 2021.
- Patricia O. Quinn and Manisha Madhoo. A review of attention-deficit/hyperactivity disorder in women and girls. Prim. Care Companion CNS Disord. , 16 (3), June 2014. doi: 10.4088/pcc.13r01596.
- Statistics Canada. Mental health service utilization in canada, 2023. URL https://www150.statcan.gc.ca/n1/pub/75-006-x/2023001/article/00011-eng.htm . Accessed: 2024-08-29.
- Peter Zachar and Kenneth S. Kendler. The philosophy of nosology. Annu. Rev. Clin. Psychol. , 13(1): 49-71, May 2017.

## Appendix A. Explanations from r/Lyme


<!-- PAGE 6 -->


Table 4: Examples of RoBERTa classifier's explanation for positive predictions for Mental Health concerns in Lyme-related Reddit posts, rephrased for privacy

## Examples

Post: my partner has been dealing with lyme since around 2015. he has a hard time managing his hip pain, neck and back pain, persistent headaches that disturb his sleep, difficulty sleeping due to anxiety, and overall heightened anxiety levels. i've never met someone with lyme before. i want to support him but need advice on how friends or family can best help someone with lyme. update: just got dumped for his ex, lol.

Post: i've recently experienced a number of strange, debilitating symptoms. it began with a stiff neck in late november, and in the past week, it has rapidly worsened to include headaches, severe depression, a sense of unreality, hand tremors, poor coordination, no appetite or thirst, visual disturbances, and feeling extremely hot or cold in different parts of my body.

Post: i had personality disorders before contracting lyme, and it's interfering with my recovery, i feel completely empty and unmotivated, struggling with dependency issues, wanting to be taken care of, and lacking any willpower. healing from lyme would be easier if my mental health wasn't such an obstacle. sometimes i end up not eating or falling into depression, losing the will to get up in the morning. i can't even commit to taking supplements or changing my diet anymore. i'm afraid my mental health issues might be my downfall.

Post: derealization and depersonalization (dpdr) feels like being intoxicated or out of reality, floating sensations, a feeling of disconnection from your body, thoughts, or words. you don't recognize yourself or loved ones anymore. it's a terrifying experience. it feels like your brain is permanently altered, and it seems like it will never return to normal. has anyone here successfully treated this symptom? i have lyme and other co-infections, confirmed by cdc tests, and am five months into antibiotic treatment.

Post: january 23: sensation of bugs crawling on my scalp, had a paranoid episode thinking i had lice when i didn't. persistent crawling sensation led to paranoia, depression, and brain fog, forgetfulness with words. later that january: discovered a bump on my scalp, scratched it off, and it bled excessively. the area around it had a bullseye appearance. never saw a tick but had continuous crawling sensations. february 23: teeth grinding, jaw locking. thought it was related to my adhd meds, brain fog, forgetfulness, attributed to adhd. menstrual cycle became longer, around 30-32 days. march 23: hospital admission for unexplained chest pain. abnormal blood tests suggested a possible infection but was sent home. cycle was again irregular, 32-33 days. april 23: noticed significant cognitive decline, increased adhd medication dosage. difficulty finding words, staying up later, restlessness, poor sleep quality. may 23: severe foot pain in the morning, difficulty walking, tight calf muscles, intense pms symptoms, extended cycle to 36 days, elevated liver enzymes.

Post: hi everyone. i've been battling Lyme disease for over four years. my pain has been particularly severe lately, disrupting my sleep and worsening my mood. it's making me less active and exacerbating my erratic sleep schedule. what pain management strategies or sleep aids have worked well for you? pain medications aren't effective, and heat pads aren't helping. i'm at a loss, any suggestions?

Post: have you experienced anhedonia due to lyme? to clarify, i don't mean general depression or reduced enjoyment, but a complete inability to feel pleasure or love for others. total numbness. i rarely see discussions about this symptom, and when i do, it often sounds like it's mistaken for major depression. total flatness and emotional numbness. has anyone else experienced this? how long did it last?