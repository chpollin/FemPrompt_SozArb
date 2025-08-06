---
title: "Gender race and intersectional bias in AI resume"
original_document: Gender__race__and_intersectional_bias_in_AI_resume.md
document_type: Conference Paper
research_domain: AI Bias & Fairness
methodology: Empirical/Quantitative
keywords: resume screening, LLM bias, intersectionality, hiring AI, MTE models
mini_abstract: "This paper investigates biases in LLM-based resume screening, finding significant racial and gender biases, particularly disadvantaging Black males, and highlighting implications for AI in employment."
target_audience: Researchers
key_contributions: "Empirical evidence of intersectional bias in LLM resume screening"
geographic_focus: Not Applicable
publication_year: 2024
related_fields: Natural Language Processing, Human Resources, Public Policy
summary_date: 2025-08-05
language: English
---

# Summary: Gender race and intersectional bias in AI resume

## Overview
This academic document investigates the critical issue of bias in artificial intelligence (AI) hiring tools, specifically focusing on the potential for Large Language Models (LLMs) to perpetuate discrimination in resume screening. The authors, Kyra Wilson and Aylin Caliskan from the University of Washington, highlight that while AI promises efficiency in recruitment, LLMs, trained on vast general language corpora, may embed and amplify existing societal biases. The core concern is whether these advanced models can be ethically deployed in employment settings without disadvantaging protected groups based on attributes like gender and race. The study aims to empirically assess the extent of such biases in Massive Text Embedding (MTE) models, a type of LLM, when used in a simulated resume screening environment.

## Main Findings
The study reveals significant and concerning biases in MTE models used for resume screening. A primary finding is that these models statistically favor White-associated names in a striking 85.1% of cases, while female-associated names are favored in only 11.1% of cases, with a minority showing no significant difference. Critically, the research demonstrates that Black males are disadvantaged in up to 100% of the simulated screening scenarios, directly replicating real-world patterns of bias observed in employment settings and validating three hypotheses related to intersectionality. Beyond demographic biases, the study also identifies that factors such as document length and the corpus frequency of names influence resume selection outcomes. These findings underscore the pervasive nature of bias within current LLM architectures and their potential to exacerbate existing inequalities in the hiring process.

## Methodology/Approach
The research employs a robust document retrieval framework designed to simulate the job candidate selection process. This framework serves as the basis for a comprehensive resume audit study. The dataset for the audit comprises over 500 publicly available resumes and 500 corresponding job descriptions, spanning nine distinct occupations. Within this simulated environment, the study systematically evaluates the performance of selected Massive Text Embedding (MTE) models. The core of the methodology involves analyzing the selection outcomes to identify statistically significant biases. This is achieved by correlating resume selection rates with demographic proxies, primarily through name associations (e.g., White-associated names, female-associated names) and by examining intersectional categories (e.g., Black males) to quantify the extent of discriminatory outcomes. Statistical analysis is then applied to determine the significance of observed differences.

## Relevant Concepts
*   **Large Language Models (LLMs):** Advanced AI models trained on massive text datasets, capable of understanding, generating, and processing human language. In this context, they are explored for their potential application in resume screening.
*   **Massive Text Embedding (MTE) Models:** A specific type of LLM that converts text into numerical vectors (embeddings), allowing for semantic comparisons and retrieval tasks, such as matching resumes to job descriptions.
*   **Algorithmic Bias:** Systematic and repeatable errors in a computer system that create unfair outcomes, such as favoring or disfavoring certain groups. Here, it refers to biases embedded within LLMs that lead to discriminatory resume screening.
*   **Document Retrieval Framework:** A system designed to find relevant documents from a collection based on a query. In this study, it simulates how an LLM might select resumes based on job descriptions.
*   **Resume Audit Study:** A research method used to test for discrimination in hiring by submitting matched resumes that vary only by a protected attribute (e.g., name associated with race or gender) and observing differences in outcomes.
*   **Intersectionality:** The interconnected nature of social categorizations such as race, class, and gender, creating overlapping and interdependent systems of discrimination or disadvantage. The study specifically investigates how biases intersect for groups like Black males.
*   **Protected Attributes:** Characteristics legally protected from discrimination (e.g., race, gender, age, national origin) in employment decisions in the US.

## Significance
This research holds significant implications for the widespread adoption of AI tools in employment, particularly LLMs. By empirically demonstrating that MTE models exhibit substantial biases against specific demographic groups, especially replicating real-world patterns of discrimination against Black males, the study issues a critical warning. It highlights that the uncritical deployment of current LLMs in hiring could exacerbate existing inequalities and lead to illegal discriminatory practices. The findings are crucial for informing the development of fairer AI systems, influencing tech policy regarding algorithmic accountability in employment, and guiding companies in their responsible adoption of AI. It underscores the urgent need for rigorous bias auditing and mitigation strategies before LLMs become standard in automated hiring pipelines.
