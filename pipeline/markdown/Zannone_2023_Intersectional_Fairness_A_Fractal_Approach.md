---
source_file: Zannone_2023_Intersectional_Fairness_A_Fractal_Approach.pdf
conversion_date: 2026-02-03T09:33:24.816853
converter: docling
quality_score: 100
---

## INTERSECTIONAL FAIRNESS: A FRACTAL APPROACH

## Giulio Filippi ∗ , Sara Zannone ∗ , Adriano Koshiyama

Holistic AI London UK

## ABSTRACT

The issue of fairness in AI has received an increasing amount of attention in recent years. The problem can be approached by looking at different protected attributes (e.g., ethnicity, gender, etc) independently, but fairness for individual protected attributes does not imply intersectional fairness. In this work, we frame the problem of intersectional fairness within a geometrical setting. We project our data onto a hypercube, and split the analysis of fairness by levels, where each level encodes the number of protected attributes we are intersecting over. We prove mathematically that, while fairness does not propagate "down" the levels, it does propagate "up" the levels. This means that ensuring fairness for all subgroups at the lowest intersectional level (e.g., black women, white women, black men and white men), will necessarily result in fairness for all the above levels, including each of the protected attributes (e.g., ethnicity and gender) taken independently. We also derive a formula describing the variance of the set of estimated success rates on each level, under the assumption of perfect fairness. Using this theoretical finding as a benchmark, we define a family of metrics which capture overall intersectional bias. Finally, we propose that fairness can be metaphorically thought of as a 'fractal' problem. In fractals, patterns at the smallest scale repeat at a larger scale. We see from this example that tackling the problem at the lowest possible level, in a bottom-up manner, leads to the natural emergence of fair AI. We suggest that trustworthiness is necessarily an emergent, fractal and relational property of the AI system.

K eywords Intersectional Fairness · Dynamic Programming · Statistical Parity · Geometry

## 1 Introduction

The issue of fairness in AI has received an increasing amount of attention in recent years. A number of AI systems involved in sensitive applications, like recruitment or credit scoring, were found to be biased against minority groups [Dastin(2018), Telford(2019)]. For these reasons, the machine learning research community has focused on finding solutions to reduce the bias found in these models [Agarwal et al.(2018), Agarwal et al.(2019), Li and Vasconcelos(2019), Mehrabi et al.(2021)]. Many of these solutions focused on comparing either the outputs of the model (Equality of Outcome [Feldman et al.(2015)]) or the error made by the algorithm (Equality of Opportunity [Hardt et al.(2016)]) for different groups. These groups are classically identified by splitting the population using individual protected attributes, for instance according to gender, ethnicity or age.

However, what happens when these attributes intersect? The concept of intersectional fairness, initially introduced by Black feminist scholars [Crenshaw(2013a), Crenshaw(2013b)], has only recently been introduced in the context of AI. In their seminal work, Buolamwini and Gebru [Buolamwini and Gebru(2018)] performed a thorough analysis of three of the most popular facial recognition algorithms on the market (Microsoft, IBM, and Face++). They found that all algorithms were better at recognizing men and people with lighter skin, but the performance drastically decreased for darker-skinned females. The fact that the discrimination faced by Black women was 'greater than the sum' of the discrimination experienced by Black men and white women is a well-known concept in the feminist literature

* These authors contributed equally to this work. contact: sara.zannone@holisticai.com.

[Crenshaw(2013a)], also known as fairness gerrymandering in the AI literature [Kearns et al.(2018)].

These results have sparked an interest and motivated the need for studying the intersectional fairness of AI algorithms. Practically, this has meant extending the study of bias from individual protected attributes to their intersectional groups. Most of the works on intersectional fairness thus far has been concerned with measuring bias when intersecting all the protected attributes [Foulds et al.(2020b), Foulds et al.(2020a), Jin et al.(2020), Morina et al.(2019)]. Since every dataset may include an arbitrary number of protected attributes, which can be combined in any number of ways, it is not clear how one should pick the right level of granularity for the analysis [Kong(2022)].

In our paper, we tackle the problem from a slightly different perspective. Instead of fixing the level of analysis a priori, we develop a framework that allows us to examine all possible intersectional groups, at all levels of granularity, and their relationship to each other. We frame the problem of intersectional fairness using a geometrical structure, specifically a hypercube, where each protected attribute can be seen as a different dimension of the hypercube. We then project our data on the hypercube and use it to analyse how bias-related metrics like success rate or accuracy vary for different subgroups. The geometrical and mechanistic nature of our framework also allows us to compute the fairness of all possible subgroups in a computationally efficient way.

This allows us to see how the fairness properties vary for different levels. From our framework it is easy to see that fairness indeed does not propagate downwards (i.e., gerrymandering). However, we prove that it does propagate upwards. This means that ensuring fairness at the most granular level, the intersection of all protected attributes in the dataset, implies fairness at any possible intersection. We will show that these results hold for both Equality of Outcome and Equality of Opportunity frameworks. This mirrors and extends the results of [Foulds et al.(2020b), Morina et al.(2019), Yang et al.(2020)]. Finally, we find that, under perfect fairness, the variance of the set of estimated success rates on a given level decreases exponentially with increasing levels. We use this formula as a benchmark, and propose a family of metrics which capture overall intersectional bias.

We argue that the novelty of our work lies especially in the fact that our framework provides a tool to observe fairness for all the possible intersectional subgroups at once, and how their fairness properties interlink. Not only this could be great for visualisation, but it could be useful for modelling, possibly improving a mechanistic understanding of intersectional fairness.

## 2 Problem Setting

We are given a binary classification dataset D with N instances along with M protected attributes (named p 1 , ..., p M ). We assume all M protected attributes are binary with groups labelled as 0 and 1. Please note that our analysis can be easily extended beyond the binary case, however, we choose to have binary protected attributes so that the results have a simple geometric interpretation. The first insight of our framework is that we can see our data as living on a M dimensional hypercube.

A hypercube is a geometrical figure that can be extended to an arbitrary number of dimensions. A 1-dimensional hypercube is a line (Fig. 1a), a 2-dimensional hypercube is a square (Fig. 1b), and a 3-dimensional hypercube is a cube (Fig. 1c). Each hypercube is made of two copies of the previous one linked together. Higher dimensional hypercubes are difficult to visualise, but share the same property (see Fig. 1d for an example of a projection of a 4-dimensional hypercube).

First, we would like to explain the analogy between intersectional subgroups and hypercubes. If we consider a dataset with only one protected attribute, our dataset can be seen as belonging to a line, with each vertex being one of the subgroups (Fig. 1a). For example, if we consider gender as our protected attribute, then one vertex will be 'male' and the other vertex will be 'female'. If instead we consider two protected attributes, such as gender and ethnicity, our data will lie on a square (Fig. 1b). In this case, each vertex will be the intersection of gender and ethnicity (e.g., white male, black male, white female and black female), and each line will be an individual attribute. Adding a third protected attribute, such as age, will increase the dimensionality again, and make our geometrical structure into a cube (Fig. 1c). In this case a single protected attribute will corresponds to the face of the cube, while the intersection of two attributes will correspond to an edge. The vertices of the cube will be the intersection of all three protected attributes.

<!-- image -->

(c)

Figure 1: Hypercubes . (a) 1D hypercube. Assuming we have only one protected attribute (gender) with subgroups male/female. (b) 2D hypercube. Assuming there are two protected attributes (gender and ethnicity), with subgroups male/female and white/black respectively. (c) 3D hypercube. Assuming there are three protected attributes (gender, ethnicity and age), with subgroups male/female, white/black and &lt;40/40+ respectively. (d) 4D hypercube. Projection of 4D hypercube.

The idea is that each protected attribute creates a division in the data, which can be seen as adding a dimension to the hypercube. The number of protected attributes therefore defines the dimensionality of the main-hypercube, which contains the whole dataset. The vertices of the hypercube, instead, comprise the intersection of all the protected attributes (e.g., p 1 = 0 , ..., p M = 0 ). On the other hand, each edge contains the intersection of all protected attributes but one. We denote the unspecified protected attribute with the star symbol (*). More generally, if K of the M protected attributes are unspecified (denoted by *), the associated hypercube will be a K -dimensional hypercube embedded in the main-hypercube. Each hypercube will then have an associated vector x ∈ { 0 , 1 , ∗} M , which we refer to as it's vectorial specification.

We will often speak of the hypercubes as separated by levels. The level refers to the number of stars in the vectorial specification, and encodes the dimensionality of the embedded hypercube. There are M +1 possible levels (0 , ..., M ) . Level 0 (the lowest level) corresponds to the vertices, which are the deepest intersectional groups and have dimensionality 0. Level M (the highest level) consists only of the main-hypercube, which contains the whole dataset and has dimensionality M . The total number of hypercubes (intersectional groups), H tot , can be computed by summing the number of hypercubes H K at each level K , with K ∈ { 0 , . . . , M } :

<!-- formula-not-decoded -->

For each vertex v of the hypercube, we can compute the number of data points belonging to that specific subgroup. We denote this number by N ( v ) . We can similarly compute the number of data points with positive label that fall in the same intersection (vertex), N (1) ( v ) . From these we can compute the success rate for any vertex as

<!-- formula-not-decoded -->

Note that it only takes one run through the dataset to compute all success rates at vertex level. We do so by updating a dictionary with keys being all possible vertices. For each of the N instances, we are comparing arrays of length M , so the total time complexity is O ( N × M ) . In the next section, we explain how this can be used to compute the success rates for all hypercubes by propagating the computation upwards.

## 3 Propagation Algorithm

We extend the definitions of N and N (1) to work on any hypercube x ∈ { 0 , 1 , ∗} M . The definition is the same as the one for vertices, N ( x ) and N (1) ( x ) are respectively the number of datapoints and successful datapoints on a given structure. From these we can compute the success rate of a hypercube as

<!-- formula-not-decoded -->

If x is fully unspecified, the associated structure is the main-hypercube, in this case we use special notation SR ( x ) = SR tot . Let x be a hypercube which is not a vertex. Then by definition x contains at least one star. Pick the first star in x and consider the two sub-hypercubes contained by setting that star to 0 or 1, which we denote as x (0) and x (1) respectively. x (0) and x (1) are a partition of x , meaning that they are disjoint and their union is x . So the following formulas immediately follow

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

Using these, we can also compute the success rate for hypercube x , as SR ( x ) = N (1) ( x ) /N ( x ) . With equations 4 and 5, we are in a position to devise a dynamic programming algorithm for computing all the success rates.

To help in visualizing the propagation process, we think of each possible split as a branching on a network graph (See Fig. 2). We refer to the resulting graph G as the hypercube graph. It's nodes consist of all possible hypercubes, and the edges encode how these hypercubes split into lower dimensional ones. It is useful to separate the nodes of the graph by levels when visualising it. If we have M protected attributes, the resulting graph G has 3 M nodes in total, with H K = ( M K ) 2 M -K of them at level K .

Algorithm 1. We start by computing N ( v ) and N (1) ( v ) for all vertices v . If there is no data on a given vertex, we store a value of 0 for both of these. Then, while there exists a hypercube with uncomputed values. Since this hypercube is not a vertex, it's vector must contain a star. Pick the first star within the vector and let x (0) and x (1) be the hypercubes obtained by setting the star to 0, 1 respectively. We recursively compute the result of equations 4 and 5. Use these to store the success rate if needed. Finish . See Algorithm 1 for pseudo-code.

In Appendix A, we include a study of the complexity of the propagation algorithm, as opposed to the "brute force" approach. The results of the analysis are summarised in Table 1. The main takeaway is that for large N and 3 M , the difference between the multiplicative ("brute force") and additive ("propagation") complexities becomes considerable.

and

Figure 2: Hypercube graph . Example of a hypercube graph G with M = 2 protected attributes. The nodes of the graph are all hypercubes. The edges represent the possible splits.

<!-- image -->

## Algorithm 1 SR propagation

- 1: Initialize to \_ compute as a set containing all 3 M hypercube vectors.
- 2: Initialize N,N (1) as dictionaries with keys being all elements of to \_ compute .
- 3: Loop once through dataset updating N,N (1) at vertex level.
- 4: Remove all vertex vectors from to \_ compute .
- 5: while to \_ compute non empty do
- 6: Pick first element x of to \_ compute .
- 7: Find first star in x and decompose into x (0) and x (1) .
- 8: Recursively compute values of N,N (1) using equations 4 and 5.
- 9: Remove x from to \_ compute .
- 10: end while

## 4 Fairness Propagation

## 4.1 Equality of Outcome

We are given a dataset D of size N with M binary protected attributes p 1 , ..., p M and one binary label y . Define the minimum and maximum success at level K as

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

In Theorem 1, we will show that the minimum and maximum success rates must narrow down as we go up the levels. This result is similar to (Theorem IV.1. [Foulds et al.(2020b)]), although derived in a different framework.

Theorem 1. SR min ( K ) is an increasing function of K and SR max ( K ) is a decreasing function of K . In language, we refer to this result as: "success rates narrow as we go up the levels".

| Algorithm            | Complexity    |
|----------------------|---------------|
| Brute Force Approach | O ( N × 3 M ) |
| SR Propagation       | O ( N +3 M )  |

Table 1: Complexity Table. Brute force approach consists of filtering the dataset for each intersectional subgroup, and computing success rate on filtered data. SR Propagation first computes success rates at vertex level, and then propagates them upwards (Algorithm 1).

Proof. Let x be a non-vertex hypercube (of dimension K ) and let x (0) i and x (1) i be a partition of it using the i th star. Recall that we can compute the success rate as

<!-- formula-not-decoded -->

Using equation 5, this is equivalent to

<!-- formula-not-decoded -->

Which can be rewritten as

<!-- formula-not-decoded -->

Note that equation 10 is a weighed average of the success rates of the two sub-hypercubes. The weights are given by the respective proportions of datapoints coming from each of the two sub-hypercubes. A weighed average lies between the minimum and maximum values we are averaging over. So by looking at the i th split, we obtain the following bound on the success rate SR ( x ) .

<!-- formula-not-decoded -->

If we instead choose to look at all K ways of splitting the hypercube x , we obtain a better bound.

<!-- formula-not-decoded -->

Using equation 12, we conclude the proof of the theorem.

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

Please note that we didn't need to use all K ways of splitting (equation 12) to obtain the above result, picking any one of them (equation 11) would have sufficed. We choose to include all ways of splitting within the formula, because it highlights an important property of how the success rates relate across levels. That is that each hypercube at level K is constrained in K different ways.

If we further define the worst case disparate impact [Feldman et al.(2014)] and the worst case statistical parity [Feldman et al.(2014)] at level K as

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

and

We can prove the following corollary:

Corollary 1.1. DI ( K ) increases with increasing K , and SP ( K ) decreases with increasing K . In language, we refer to these results as: "Equality of Outcome fairness propagates up the levels".

Proof. As follows from Theorem 1:

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

and

## 4.2 Equality of Opportunity

In Appendix B we extend the above analysis to the Equality of Opportunity setting. We do so by adapting Theorem 1, to show that other fairness measures also narrow as we progress up the levels such as: accuracy, precision, true positive rates, false positive rates, true negative rates, false negative rates [Hardt et al.(2016)]. In language, these results can be summarized as follows: " Equality of Opportunity fairness also propagates up the levels ".

## 5 Intersectional Statistical Parity

In the previous sections, we used a minimum and maximum approach, to get worst case scenario proofs about the evolution of fairness metrics as we progress up the levels. In this section, we use a statistical interpretation of our framework. First, it will be useful to introduce some notation from probability theory. We let A 1 , . . . , A M denote the random variables associated with our M protected attributes and Y be the random variable associated to the label. Intersectional Statistical Parity (ISP) holds when there is independence between the protected attributes (including intersections of an arbitrary number of them) and the output label ([Dwork et al.(2012), Agarwal et al.(2018), Kearns et al.(2018), Foulds et al.(2020b)]). In equations,

<!-- formula-not-decoded -->

In the presence of ISP, every single hypercube has precisely the same probability of success P ( Y = 1) = p tot . For each hypercube x , the success rate SR ( x ) can therefore be seen as the sample mean of N ( x ) draws of a Bernoulli ( p tot ) random variable. Hence, the mean and variance are given by:

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

and

We first consider the simplified case where each subgroup on a given level has an equal number of instances. In this case, the number of datapoints for each hypercube at level K is exactly N K = N 2 K -M (Appendix C). In this scenario, all success rates SR ( x ) have the same distribution, with mean and variance given by equations 20 and 21 respectively and N ( x ) = N K . The theoretical value for the variance (at level K ) is then:

<!-- formula-not-decoded -->

Note that the variance decreases exponentially with increasing levels. By setting α = 2 M p tot (1 -p tot ) N and transforming to the log domain, we get a simpler formulation

<!-- formula-not-decoded -->

This means that, if ISP holds, the log of the variance at level K decreases linearly with increasing K . The slope of the linear curve is -log 2 and the intercept is log α .

Supposing we are now in possession of data, obtained from an ISP classifier. We can use the empirical success rates at each level to compute an estimate of the variance as:

<!-- formula-not-decoded -->

The above formula is known to be an estimator of the theoretical variance, under the assumption of independent samples. However, on any level above Level 0, the samples are technically not independent. That is because different hypercubes share vertices and we find that especially at very high levels, the approximation of assuming independence breaks down. We mitigate this issue by using sub-sampling. By sub-sampling our dataset several times, we solve two problems at once. The first is that we ensure the dataset is balanced, which is a crucial assumption in the derivations. The second is that we produce more samples, that are less correlated overall. We call the empirical estimate of the variance obtained using sub-sampling V ar ( K ) . If we subsample our data n sub times, V ar ( K ) can be defined mathematically as

<!-- formula-not-decoded -->

What happens if ISP does not hold? In this case, the set of success rates SR ( x ) at each level is made up of copies of random variables with different means. Since the means are different, we expect the variance to be greater than the theoretically computed minimum V ar ISP ( K ) . We can then use this theoretical value for the variance as a benchmark, to define a measure of intersectional bias at each level. We call this family of metrics V arRatio ( K ) , and define it mathematically as

<!-- formula-not-decoded -->

In this paper, we restrict our focus to the metric obtained at vertex level, for K = 0 . Once again using α = 2 M p tot (1 -p tot ) n sub to simplify the expression, the metric can be written as:

<!-- formula-not-decoded -->

There are three cases that can arise:

1. V arRatio (0) ≈ 1 indicating the classifier satisfies (or is close to satisfying) ISP.
2. V arRatio (0) &gt; 1 indicating the classifier contains some intersectional bias.
3. V arRatio (0) &lt; 1 hinting that the classifier was trained or post-processed with some bias mitigation procedures.

Please note that if the data is unbalanced and we do not use a sub-sampling approach, V ar ISP ( K ) still serves as an approximate lower bound for the expected variance at Level K (Appendix D).

In conclusion, we showed that, under perfect fairness, the variance of the empirical success rates decreases exponentially across levels. This means that the log-variance against level curve is linear, and this can be used as a test for the ISP criterion. These theoretical findings helped us define a family of metrics V arRatio ( K ) which capture intersectional bias, and because of how they are constructed, we expect them to be less affected by small sample variance than other approaches within the literature.

## 6 Experiments

## 6.1 Synthetic Data

Figure 3: Success Rate Distributions . Estimated empirical distributions of the success rates over all the hypercubes at levels 1, 4 and 7 for Experiment 1. The distributions get narrower around SR tot = 0 . 5 as we travel up the levels.

<!-- image -->

In order to verify our theoretical results, we run experiments with synthetic data. We create a function to generate random datasets, with M = 10 protected attributes, and one label. Each of the 2 10 = 1024 smallest intersectional groups (vertices), v , contains N ( v ) = 200 R instances, where R is a randomly selected integer between 1 and

10. Each vertex also has an associated probability of success p ( v ) , which we use to sample its binary label data from a Bernoulli ( p ( v )) distribution. We sub-sample the dataset n repeats = 20 times so as to have all vertices contain precisely n sub = 100 datapoints. The sub-sampling is crucial for two reasons. The first is that it allows us to generate a larger number of samples, with minimal amounts of correlation. The second is that it ensures all hypercubes have equal number of datapoints. Both of these conditions were assumptions in our theoretical derivations.

In this first example, we will consider a fair dataset, where p ( v ) = 0 . 5 for all vertices. Since the output label is here independent of all the protected attributes, this example satisfies Intersectional Statistical Parity. We run the Propagation Algorithm 1 to compute the empirical success rates over all the possible intersectional groups, that is, all the hypercubes in our geometrical model. Fig. 3 shows the distribution of the empirical success rates at different levels. As predicted by our theoretical results, the distribution gets narrower around SR tot = 0 . 5 as we go up the levels. Fig. 4a shows how the minimum and maximum values evolve as we progress up the levels. The maximum value decreases and minimum value increases, as shown in Theorem 1. Fig. 4b and Fig. 4c show plots of V ar ( K ) and log V ar ( K ) as a function of K . Both curves match the theoretical results precisely, except for small numerical approximations.

Figure 4: Experiment 1 . (a) Evolution of the minimum and maximum empirical success rates across levels. As expected from the theoretical results, these values tend to 0.5. (b) Evolution of the Variance across levels. The variance decreases exponentially, as predicted by our theoretical results. (c) Evolution of the log-Variance across levels. The log-variance linearly, as predicted by our theoretical results.

<!-- image -->

In our second experiment, we want to analyse how these results change in the presence of bias. We model bias by allowing each vertex v to have a different probability of success p ( v ) . Specifically, we select a set of 100 vertices to have probability of success p ( v ) = 0 . 5 -δ , and a separate set of 100 vertices to have probability of success p ( v ) = 0 . 5 + δ . We set our parameter δ to vary in the interval { 0 , 0 . 1 , 0 . 2 , 0 . 3 , 0 . 4 } . When δ = 0 , we retrieve the case of perfect fairness from the previous example. Otherwise, ISP will not be satisfied, and indeed our dataset will get less and less fair as δ increases. The results show that, as expected, the minimum and maximum success rates narrow down as fairness increases, that is, for lower values of δ (Fig. 5a). We also show that, just as our theoretical results had predicted, the variance of the empirical success rates increases with higher levels of bias (Fig. 5b). Accordingly, the evolution of the log-variance across levels is not linear but concave for higher levels of δ , another indicator that ISP is not satisfied. Finally, we calculate our metric V arRatio (0) (Table 2), and find that it increases for increasing values of δ , which indicate larger bias.

Figure 5: Experiment 2 . (a) Evolution of the minimum and maximum empirical success rates across levels. As expected from the theoretical results, these values tend to 0.5. These values narrow down for smaller δ , as bias decreases. (b) Evolution of the Variance across levels. The variance increases in the presence of bias. (c) Evolution of the log-Variance across levels. The log-variance curve departs from the theoretical value as we increase δ .

<!-- image -->

Table 2: Metrics Table . V arRatio (0) calculated for experiment 2.

|         | δ = 0   | δ = 0 . 1   | δ = 0 . 2   | δ = 0 . 3   | δ = 0 . 4   |
|---------|---------|-------------|-------------|-------------|-------------|
| Level 0 | 0 . 98  | 1 . 73      | 4 . 19      | 7 . 96      | 13 . 34     |

## 6.2 Real Data Experiment

For the real data test, we chose to use the Adult dataset. The Adult dataset is one of the most commonly used datasets in fair-AI research. That is because it has many attributes that can be considered sensitive (sex, race, age, etc) and the task is that of binary classification. The dataset consists of N = 48842 instances with 14 features and one label feature. The usual task given on this dataset is the prediction of the binary attribute of salary being above 50K from the other features.

For the purposes of our experiments, we performed some simple prepossessing on the data. The first step is we keep only 5 of the 15 provided columns. That is M = 4 protected attributes (sex, race, age, marital-status) and the binary label (class). We also performed some grouping on the attributes age, race and marital-status. For age, we binarize the data so that instances with age ≥ 40 are set to 1 and all others are set to 0. For race we grouped Black, AsianPac-Islander and Amer-Indian-Eskimo with the Other group. For marital-status we grouped the 7 provided statuses (Married-civ-spouse, Never-married, Divorced, Separated, Widowed, Married-spouse-absent, Married-AF-spouse) into Married and Not-Married. The reason we had to perform grouping on some attributes is to match the setting of the theoretical work (all protected attributes binary). Furthermore the grouping ensures all intersectional subgroups contain sufficient data. For the average and minimum number of datapoints over all hypercubes per level, see Table 3.

Table 3: Adult Dataset . Minimum number and average number of datapoints at each level K = 0 , . . . , 4 .

|                |   Level 0 |   Level 1 |   Level 2 |   Level 3 |   Level 4 |
|----------------|-----------|-----------|-----------|-----------|-----------|
| Average Number |      3052 |      6105 |     12210 |     24421 |     48842 |
| Minimum Number |       228 |       521 |      2511 |      7080 |     48842 |

The following results are obtained by sub-sampling the dataset n repeats = 20 times so that each vertex contains exactly n sub = 100 samples. In Fig. 6a the minimum and maximum success rates are displayed as a function of level. As we have shown, the success rates must narrow with increasing levels, although they narrow more slowly for the Adult dataset. Fig. 6b and Fig. 6c show the evolution of the variance and log-variance across levels. Observe the big difference in variance between the theoretically computed values (obtained under ISP condition) and Adult dataset values. All results indicate the presence of intersectional bias within the data.

## 7 Fractal Fairness

Intersectional fairness in the context of AI typically focuses on splitting groups of people into smaller identity categories by intersecting multiple protected attributes. Although it is commendable that the issue of intersectionality is being tackled by the community, we feel that the current approaches have some limitations. For example, it is not clear how many protected attributes one should consider, which protected attributes one should consider and how to select the level of granularity for the analysis [Kong(2022)].

On the other hand, we sought a framework that would allow us to think of intersectional fairness as a whole : one complex system involving all possible intersectional groups at all levels of description. We turned to geometry, and particularly fractals, for inspiration. Fractals are geometrical objects that, informally, can be broken down into smaller objects that resemble the original shape [Mandelbrot and Mandelbrot(1982)]. Although our framework is not mathematically a fractal, we identified a geometrical structure where each hypercube separates into further instances of hypercubes. This provided us with a mathematical model to study a nested and recursive notion of fairness. In fractals, patterns at a small scale repeat at a larger scale. Similarly, our framework asks that our data is fair for any possible subgroup of the population, no matter which or how many attributes are intersected.

Furthermore, the geometrical nature of our setting allows us to examine how fairness propagates and scales. We found that fairness necessarily propagates up the levels, while bias propagates down. This suggests that we should, first and foremost, think of fairness in a bottom-up and local way. It also indicates that we cannot think of individual parts of a system in isolation from the whole. We propose that the trustworthiness of an AI system cannot thus be enforced in a top-down way, or by separating individual components from the larger system. Instead, we argue for a bottom-up emergent and holistic approach to trustworthy AI.

Figure 6: Adult Dataset Experiment . (a) Evolution of the minimum and maximum empirical success rates across levels. (b) Evolution of the Variance across levels. (c) Evolution of the log Variance across levels.

<!-- image -->

## 8 Discussion

In this paper, we introduced a geometrical setting for studying the fairness properties of all possible intersectional subgroups together, in a unified framework. There are multiple advantages to this setting. Firstly, it allows for a quicker computation of all the success rates (or other metrics if needed), using a dynamic programming approach. Secondly, it reveals the inter-connectivity between the fairness properties of groups at different levels. In particular, we prove that success rates must narrow as we go up the levels. We use that to prove worst case disparate impact increases with increasing levels, and worst case statistical parity decreases with increasing levels. We summarise these results as "Equality of Outcome fairness propagates up the levels" . We then extend our results to the Equality of Opportunity setting. In particular, we show that accuracy, precision, true positive rates, false positive rates, true negative rates and false negative rates all narrow down as we progress up the levels. We summarise these results as "Equality of Opportunity fairness also propagates up the levels" . In the future, it might be interesting to derive a mathematical description of all metrics for which this method of proof applies.

Furthermore, we suggest that the variance of the empirically computed success rates on a given level can be used as a fairness measure. We prove that under perfect fairness (Intersectional Statistical Parity), the variance follows a simple exponential scaling law. Using this theoretical value as benchmark, we define a family of metrics which capture the intersectional bias on each level. Future work will definitely focus on examining these metrics further and studying the behaviour of the variance and log-variance curves more closely in different settings. One of the hopes is that, the shape of the log-variance curve can help in detecting but also in locating the source of bias. For instance if bias was injected into the system using combinations of two protected attributes (Level M -2 ), we might see a bend in the log-variance curve at around those values of K . This could help answer questions related to the sources of bias and identifying gerrymandering. Alternatively, the variance scaling law could be used to devise similarly structured statistical tests.

One of the advantages of our framework is that it allows us to analyse the whole system at once. Bias is not exclusively measured for given groups at a prescribed intersectional level, but instead its evolution is examined across all levels. However, most of our analyses aggregate over groups. This issue could be mitigated, for example, by using our framework in conjunction with other bias measures. In the future, it would be interesting to employ our propagation algorithm for more detailed modelling. For example, we could analyse how the success rates for two specific attributes interact and spread across levels. Otherwise, we could study the evolution of the fairness metrics for one specific attribute (e.g. gender) across levels or even specific paths within the hypercube. This would provide us with further insight into how bias affects that specific attribute. More broadly, our way of framing the problem of intersectionality can reveal the interconnections among intersectional subgroups, which could be key to developing appropriate metrics and mitigation techniques.

## References

- [Agarwal et al.(2018)] Alekh Agarwal, Alina Beygelzimer, Miroslav Dudík, John Langford, and Hanna Wallach. 2018. A reductions approach to fair classification. In International Conference on Machine Learning . PMLR, 60-69.
- [Agarwal et al.(2019)] Alekh Agarwal, Miroslav Dudík, and Zhiwei Steven Wu. 2019. Fair Regression: Quantitative Definitions and Reduction-based Algorithms. 36th International Conference on Machine Learning, ICML 2019 2019-June (5 2019), 166-183. https://doi.org/10.48550/arxiv.1905.12843
- [Buolamwini and Gebru(2018)] Joy Buolamwini and Timnit Gebru. 2018. Gender shades: Intersectional accuracy disparities in commercial gender classification. In Conference on fairness, accountability and transparency . PMLR, 77-91.
- [Crenshaw(2013a)] Kimberlé Crenshaw. 2013a. Demarginalizing the intersection of race and sex: A black feminist critique of antidiscrimination doctrine, feminist theory and antiracist politics. In Feminist legal theories . Routledge, 23-51.
- [Crenshaw(2013b)] Kimberlé Williams Crenshaw. 2013b. Mapping the margins: Intersectionality, identity politics, and violence against women of color. In The public nature of private violence . Routledge, 93-118.
- [Dastin(2018)] Jeffrey Dastin. 2018. Amazon scraps secret AI recruiting tool that showed bias against women. In Ethics of data and analytics . Auerbach Publications, 296-299.
- [Dwork et al.(2012)] Cynthia Dwork, Moritz Hardt, Toniann Pitassi, Omer Reingold, and Richard Zemel. 2012. Fairness through awareness. In Proceedings of the 3rd innovations in theoretical computer science conference . 214-226.
- [Feldman et al.(2014)] Michael Feldman, Sorelle A. Friedler, John Moeller, Carlos Scheidegger, and Suresh Venkatasubramanian. 2014. Certifying and removing disparate impact. Proceedings of the ACM SIGKDD International Conference on Knowledge Discovery and Data Mining 2015-August (12 2014), 259-268. https: //doi.org/10.48550/arxiv.1412.3756
- [Feldman et al.(2015)] Michael Feldman, Sorelle A Friedler, John Moeller, Carlos Scheidegger, and Suresh Venkatasubramanian. 2015. Certifying and removing disparate impact. In proceedings of the 21th ACM SIGKDD international conference on knowledge discovery and data mining . 259-268.
- [Foulds et al.(2020a)] James R Foulds, Rashidul Islam, Kamrun Naher Keya, and Shimei Pan. 2020a. Bayesian Modeling of Intersectional Fairness: The Variance of Bias. In Proceedings of the 2020 SIAM International Conference on Data Mining . SIAM, 424-432.
- [Foulds et al.(2020b)] James R. Foulds, Rashidul Islam, Kamrun Naher Keya, and Shimei Pan. 2020b. An intersectional definition of fairness. Proceedings - International Conference on Data Engineering 2020-April (4 2020), 19181921. https://doi.org/10.1109/ICDE48307.2020.00203

- [Hardt et al.(2016)] Moritz Hardt, Eric Price, and Nati Srebro. 2016. Equality of opportunity in supervised learning. Advances in neural information processing systems 29 (2016).
- [Jin et al.(2020)] Zhongjun Jin, Mengjing Xu, Chenkai Sun, Abolfazl Asudeh, and HV Jagadish. 2020. Mithracoverage: a system for investigating population bias for intersectional fairness. In Proceedings of the 2020 ACM SIGMOD International Conference on Management of Data . 2721-2724.
- [Kearns et al.(2018)] Michael Kearns, Seth Neel, Aaron Roth, and Zhiwei Steven Wu. 2018. Preventing Fairness Gerrymandering: Auditing and Learning for Subgroup Fairness. (2018).
- [Kong(2022)] Youjin Kong. 2022. Are "Intersectionally Fair" AI Algorithms Really Fair to Women of Color? A Philosophical Analysis. ACM International Conference Proceeding Series (6 2022), 485-494. https: //doi.org/10.1145/3531146.3533114
- [Li and Vasconcelos(2019)] Yi Li and Nuno Vasconcelos. 2019. Repair: Removing representation bias by dataset resampling. In Proceedings of the IEEE/CVF conference on computer vision and pattern recognition . 9572-9581.
- [Mandelbrot and Mandelbrot(1982)] Benoit B Mandelbrot and Benoit B Mandelbrot. 1982. The fractal geometry of nature . Vol. 1. WH freeman New York.
- [Mehrabi et al.(2021)] Ninareh Mehrabi, Fred Morstatter, Nripsuta Saxena, Kristina Lerman, and Aram Galstyan. 2021. A survey on bias and fairness in machine learning. ACM Computing Surveys (CSUR) 54, 6 (2021), 1-35.
- [Morina et al.(2019)] Giulio Morina, Viktoriia Oliinyk, Julian Waton, Ines Marusic, and Konstantinos Georgatzis. 2019. Auditing and Achieving Intersectional Fairness in Classification Problems. (11 2019). https://doi. org/10.48550/arxiv.1911.01468
- [Telford(2019)] Taylor Telford. 2019. Apple Card algorithm sparks gender bias allegations against Goldman Sachs. Washington Post 11 (2019).
- [Yang et al.(2020)] Forest Yang, Moustapha Cisse, Google Research, and Accra Sanmi Koyejo. 2020. Fairness with Overlapping Groups. (2020).

## A Complexity of Success Rate Propagation Algorithm

We first study the complexity of the "brute force" approach to computing all success rates. Suppose we filter the dataset by the appropriate intersectional group and then compute the success rates on the filtered data for each of the 3 M intersections. For each of the 3 M intersections, we are looping over N instances and for each instance we must compare arrays of length M . So this method would have time complexity O ( N × M × 3 M ) .

As we have seen, we can compute the quantities at vertex-level in O ( N × M ) time. What is the time complexity of the propagation algorithm? To compute the complexity of the propagation algorithm, we consider the hypercube graph G (see Fig. 2). Each hypercube at level K has K stars, so it is connected with 2 K hypercubes one level below. Recall that level K consists of H K = ( M K ) 2 M -K hypercubes. So the total number of edges E ( G ) in G can be written as a sum over levels K ∈ { 1 , . . . , M } .

<!-- formula-not-decoded -->

Since our algorithm functions with recursion on the graph G , by reusing values that have already been computed, it would never cross the same edge twice. So the number of edges in G is a strict upper bound on the time taken by the algorithm. So the time complexity of the dynamic programming approach is upper bounded by O ( N × M + M × 3 M ) . Assuming M is small compared to N and 3 M (and therefore modelled as a constant), the complexities of both approaches are summarized in Table 1.

## B Extension to Equality of Opportunity

## B.1 Accuracy

Until now we have only been working in an Equality of Outcome fairness framework. Meaning that we are seeking to equalize the outcomes of our model for different subgroups of the population. There are also Equality of Opportunity fairness notions, that seek to equalize the performance of our model on different subgroups. There is a quick way to translate our findings from an Equality of Outcome framework to an Equality of Opportunity framework. Suppose that

we are given the true labels as well as the predicted labels. Name these vectors y true and y pred respectively. Consider the new vector

<!-- formula-not-decoded -->

Suppose we use Theorem 1 with y correct instead of y pred . We can show that the success rate of y correct narrows as we go up the levels. However, the success rate of y correct is precisely the accuracy of y true , y pred . So we have shown that accuracy also narrows as we go up the levels. If we define the worst case accuracy ratio and worst case accuracy difference at level K as

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

By using Corollary 2, we can show that Acc ratio ( K ) increases and Acc diff ( K ) decreases with increasing K .

## B.2 Other Metrics

In the previous section, we showed how we can extend the original result about success rates to the analogous result about accuracy. The method we used to do so can be framed more generally. In particular, we can show analogous results for any metric that can be written as a success rate of a binary vector y new obtained from y true , y pred . We also allow for filtering the dataset if convenient in defining the metric (as shown in the next example).

Suppose we wish to prove that the worst case true positive rates ( TPR ) narrow as we go up the levels. We first filter our dataset D to contain only rows where y true = 1 , we temporarily discard other rows. Then create a new binary vector y truepos which is an indicator on true positives (1 if instance is a true positive, 0 otherwise). Observe that the success rate of this new vector is precisely the true positive rate of the original predictions and true labels. In equations

<!-- formula-not-decoded -->

By using Theorem 1 with this new dataset and new binary vector, we show true positive rates also narrow as we go up the levels. Using the same approach, we can also show that false positive rates, true negative rates, false negative rates and precision all narrow as we go up the levels.

## C Average number of datapoints on hypercube at Level K

We claim the following formula for the average number of datapoints on a hypercube at level K :

<!-- formula-not-decoded -->

Proof. For K = 0 , the formula holds

<!-- formula-not-decoded -->

For any level K &gt; 0 ,

<!-- formula-not-decoded -->

Each hypercube at level K -1 appears precisely M -K +1 times in the triple sum, so we can rewrite it as

<!-- formula-not-decoded -->

and since, H K = ( M K ) 2 M -K , we have

<!-- formula-not-decoded -->

Therefore

<!-- formula-not-decoded -->

Which concludes the proof by induction.

## D Variance of empirical success rates at Level K under ISP assumption

We claimed that under ISP (and uncorrelated samples), the expected empirical variance can be lower bounded by H K -1 H K p tot (1 -p tot ) N K . The proof is as follows

Proof. We make 2 assumptions (A1, A2)

1. The classifier generating the label data is ISP.
2. The samples SR ( x ) , x ∈ Level K are uncorrelated.

<!-- formula-not-decoded -->

Expand the sum

<!-- formula-not-decoded -->

Remove the cross terms that amount to squares, and aggregate them in the first sum glyph[negationslash]

<!-- formula-not-decoded -->

Now we use linearity of expectation and both assumptions A1, and A2. A1 is used to replace expectations with their theoretical value p tot . A2 is used to transform expectations of products into products of expectations.

glyph[negationslash]

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

Using Jensen's inequality applied to concave function 1 /X ,

<!-- formula-not-decoded -->

<!-- formula-not-decoded -->

And the bound is tight iff all sample sizes are the same on the given level.

So we obtain

## E Metrics for Experiment 2 measured across all levels

Table 4: Experiment 2 Metrics Table . We show the values of the metric V arRatio ( K ) for K = 0 , . . . , 9 and parameter δ = 0 , . . . , 0 . 4

<!-- image -->

|         |    δ = 0 |   δ = 0 . 1 |   δ = 0 . 2 |   δ = 0 . 3 |   δ = 0 . 4 |
|---------|----------|-------------|-------------|-------------|-------------|
| Level 0 | 0.989688 |     1.73576 |     4.19139 |     7.96645 |     13.3472 |
| Level 1 | 0.993014 |     2.21962 |     6.22018 |    12.4094  |     21.2334 |
| Level 2 | 0.995939 |     3.00121 |     9.50707 |    19.5983  |     34.0032 |
| Level 3 | 1.00063  |     4.2518  |    14.7769  |    31.1107  |     54.4612 |
| Level 4 | 1.00961  |     6.22199 |    23.0863  |    49.2413  |     86.6862 |
| Level 5 | 1.02494  |     9.24077 |    35.8239  |    77.0014  |    136.033  |
| Level 6 | 1.04656  |    13.6363  |    54.3774  |   117.403   |    207.857  |
| Level 7 | 1.06916  |    19.4053  |    78.747   |   170.448   |    302.164  |
| Level 8 | 1.07493  |    25.157   |   103.124   |   223.491   |    396.491  |
| Level 9 | 1.0134   |    25.0736  |   103.159   |   223.463   |    396.57   |