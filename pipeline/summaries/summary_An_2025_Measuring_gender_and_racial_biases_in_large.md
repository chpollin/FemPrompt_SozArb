```yaml
document_type: Research Paper
research_domain: AI Ethics, AI Bias & Fairness, Human Resources
methodology: Quantitative
keywords: LLM bias, resume evaluation, gender bias, racial bias, hiring discrimination
mini_abstract: This empirical study measures gender and racial biases in five widely-used LLMs (GPT-3.5 Turbo, GPT-4o, Gemini 1.5 Flash, Claude 3.5 Sonnet, Llama 3-70b) for resume evaluation, finding that these models perpetuate discrimination against women and Black candidates despite identical qualifications, with hiring probability differences of 1-3 percentage points.
target_audience: Researchers, Policymakers, HR Practitioners, AI Developers
geographic_focus: Global
publication_year: Unknown
related_fields: Algorithmic fairness, Recruitment technology, Labor economics
```
---

# Summary: An_2025_Measuring_gender_and_racial_biases_in_large

# Summary: Gender and Racial Biases in LLM-Based Resume Evaluation

## Overview
As organizations increasingly adopt AI for hiring decisions, understanding whether large language models (LLMs) replicate or mitigate human recruitment biases is critical. Despite decades of policy efforts, underrepresented groups—women and racial/ethnic minorities—continue facing significant labor market inequality. This study addresses a crucial gap by empirically measuring gender and racial biases in five widely-used LLMs (GPT-3.5 Turbo, GPT-4o, Gemini 1.5 Flash, Claude 3.5 Sonnet, Llama 3-70b) in high-stakes hiring contexts. The research reveals that LLMs do not uniformly reduce human biases; instead, they perpetuate discrimination while potentially systematizing it at scale. These findings challenge assumptions that AI-driven recruitment offers fairness benefits and underscore the need for rigorous bias auditing before deployment.

## Main Findings

1. **Gender bias favors female candidates:** All five LLMs consistently award higher assessment scores to female candidates with identical qualifications, education, and work experience compared to male candidates.

2. **Racial bias disadvantages Black male candidates:** Systematic bias against Black male candidates persists across all tested models, resulting in lower scores despite comparable qualifications.

3. **Hiring probability impact:** Identified biases translate to 1-3 percentage-point differences in hiring probabilities, creating meaningful distributional economic consequences across social groups.

4. **Consistency across models:** Despite different architectures, training data, and debiasing strategies, bias patterns remain qualitatively similar and quantitatively comparable across all five models.

5. **Debiasing limitations:** Current mitigation techniques (RLHF, adversarial training, fairness constraints) fail to eliminate systematic biases, suggesting fundamental challenges in AI fairness approaches.

6. **Intersectional effects:** Gender and racial biases interact in complex ways, with patterns varying across demographic subgroups and job positions.

## Methodology/Approach
Researchers conducted a large-scale randomized experimental audit using approximately 361,000 synthetically generated resumes for entry-level positions. The experimental design randomly assigned social identity markers (gender, race/ethnicity) while holding qualifications constant—work experience, education, and skills remained identical across conditions. This controlled approach isolated the causal effect of social identity on LLM scoring. The study tested multiple job positions and demographic subsamples to ensure robustness. Resumes were submitted to each LLM with identical instructions to score candidates, enabling direct comparison of bias patterns across models.

## Relevant Concepts

**Large Language Models (LLMs):** AI systems trained on vast text corpora that generate human-like responses; increasingly deployed in consequential decisions including hiring, lending, and criminal justice.

**Algorithmic Bias:** Systematic errors in AI systems that disadvantage particular social groups, often inherited from biased training data or reflecting societal prejudices encoded in language.

**Intersectionality:** The interconnected nature of social categorizations (gender, race, class) that create overlapping systems of discrimination; here, examining how gender and racial biases interact.

**Debiasing:** Technical interventions (reinforcement learning from human feedback, adversarial training) intended to reduce algorithmic bias; this study shows current methods are insufficient.

**High-Stakes Decision-Making:** Consequential contexts where AI errors directly affect individuals' economic opportunities, employment, and life outcomes.

**Randomized Experimental Design:** Research methodology that randomly assigns conditions to isolate causal effects while controlling for confounding variables.

**Distributional Outcomes:** How benefits and harms are allocated across social groups; here, how LLM biases create unequal hiring probabilities.

## Practical Implications

**For Social Workers:**
- Advocate for independent bias audits of AI hiring tools before client organizations adopt them
- Educate employers about persistent LLM biases to counter assumptions that AI ensures fairness

**For Organizations:**
- Conduct third-party bias audits of any LLM-based hiring systems before deployment
- Implement human review processes for AI-generated hiring recommendations, particularly for underrepresented candidates
- Monitor hiring outcomes by demographic group to detect systematic disparities

**For Policymakers:**
- Mandate bias auditing and transparency requirements for AI systems used in employment decisions
- Establish legal liability for discriminatory outcomes from AI hiring tools
- Fund research into effective debiasing techniques before widespread AI adoption

**For Researchers:**
- Investigate root causes of persistent biases across diverse model architectures
- Develop and test novel debiasing approaches beyond current RLHF and adversarial methods
- Extend bias audits to other high-stakes domains (lending, criminal justice, healthcare)

## Limitations & Open Questions

**Limitations:**
- Root causes of observed biases remain unexplained; unclear whether biases stem from training data, model architecture, or language patterns
- Synthetic resumes may not capture real-world hiring complexities (cover letters, interviews, network effects)
- Inconsistent bias patterns for Asian and Hispanic candidates limit generalizability across all underrepresented groups

**Open Questions:**
- Why do current debiasing techniques fail to eliminate biases despite developer efforts?
- How do LLM biases interact with human recruiter biases in hybrid systems?
- Do findings generalize to non-English languages and non-hiring domains?

## Relation to Other Research

- **AI Fairness & Algorithmic Discrimination:** Extends prior work on bias in NLP and word embeddings by quantifying biases in high-stakes, real-world decision contexts rather than abstract language tasks.

- **Labor Market Inequality:** Connects to decades of research on discrimination in hiring, showing AI may systematize rather than reduce inequality despite efficiency claims.

- **AI Governance & Accountability:** Contributes empirical evidence supporting calls for mandatory bias auditing and regulatory oversight of consequential AI systems.

- **Debiasing Effectiveness:** Challenges optimistic narratives about technical fixes, demonstrating that current mitigation strategies are insufficient for ensuring fairness.

## Significance
This research directly challenges the assumption that AI-driven hiring offers fairness advantages over human decision-making. As over half of firms invest in AI-based recruiting, understanding LLM biases is urgent. The study's key contribution is demonstrating that biases persist across diverse, state-of-the-art models despite different debiasing approaches—indicating systemic rather than isolated problems. The 1-3 percentage-point hiring probability differences may seem small but translate to thousands of individuals excluded from opportunities at scale. Most critically, the research reveals that LLMs perpetuate racial bias while reducing gender bias, creating a false narrative of progress. This asymmetry risks legitimizing AI hiring tools that actually worsen racial inequality. The findings demand immediate action: independent auditing before deployment, transparency requirements, and urgent research into effective fairness mechanisms. Without intervention, AI threatens to systematize and accelerate discrimination across labor markets.

---

**Quality Metrics:**
- Overall Score: 69/100
- Accuracy: 45/100
- Completeness: 60/100
- Actionability: 75/100
- Concepts Defined: 23

*Generated: 2026-02-03 20:59*
*Model: claude-haiku-4-5*
*API Calls: 64 total*
