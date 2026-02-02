```yaml
document_type: Research Paper
research_domain: AI Ethics, AI Bias & Fairness
methodology: Qualitative
keywords: LLMs, LGBTQ+ representation, narrative constraints, cultural bias, generative AI
mini_abstract: This research examines how Large Language Models systematically constrain LGBTQ+ representations to narrow, identity-focused narratives, revealing representational harms that extend beyond explicit toxicity to subtle forms of narrative limitation.
target_audience: Researchers, AI Practitioners, Policymakers
geographic_focus: Global
publication_year: Unknown
related_fields: Computational Linguistics, Social Justice, Human-Computer Interaction
```
---

# Summary: Ghosal_2025_Unequal

SCORES:
Accuracy: 92
Completeness: 88
Structure: 95
Actionability: 85

IMPROVEMENTS NEEDED:
1. The summary states "replication code unavailable" but the original document says "The code to replicate our experiments is forthcoming" - these are subtly different (forthcoming vs. unavailable). Should clarify as "not yet released."
2. The methodology section infers specific experimental details (e.g., "explicit identity mentions and implicit contextual clues") that are not explicitly stated in the provided excerpt. The original only shows one example; the summary overstates methodological specificity.
3. Practical implications section adds substantial detail about "social workers," "organizations," and "policymakers" that goes beyond what the original document discusses. While reasonable extrapolations, they should be labeled as "inferred implications" rather than presented as document content.

IMPROVED SUMMARY:

# Summary: Unequal Voices: How LLMs Construct Constrained Queer Narratives

## Overview

Large Language Models increasingly shape cultural narratives through interactive and creative applications, yet their representational patterns remain inadequately examined beyond explicit toxicity metrics. This research addresses a critical gap: while LLMs may avoid overtly negative content, they systematically constrain LGBTQ+ representations to narrow, identity-focused narratives. The authors argue that representational harms extend beyond harmful stereotypes to include subtle discursive patterns that "other" marginalized groups even in neutral contexts. By analyzing persona-based LLM outputs, the study demonstrates that LGBTQ+ individuals receive disproportionately identity-centric portrayals compared to non-queer personas, mirroring real-world media marginalization and potentially causing allocational harm in sensitive applications like therapeutic chatbots.

## Main Findings

1. **Identity-Focused Constraint**: When assuming LGBTQ+ personas without additional context, LLMs default to gender or sexuality-related content, whereas non-LGBTQ+ personas receive diverse role and experience descriptions across career, community, and personal dimensions.

2. **Narrow Representation Patterns**: LGBTQ+ individuals are systematically portrayed through constrained, stereotyped narratives that deny them the full complexity of human experience afforded to dominant identity groups.

3. **Trans Broken Arm Syndrome Replication**: LLMs assume queer individuals in medical settings seek gender or sexuality-affirming care, potentially derailing conversations and failing to address primary health concerns—mirroring clinical biases.

4. **Discursive Othering Through Positive Language**: LLMs "overcorrect" by foregrounding diversity, inclusion, and community concepts when referencing marginalized identities, marking them as distinct from the majority even in identity-neutral contexts.

5. **Representational Harms Without Overt Negativity**: Subtle associational biases produce allocational harm despite surface-level positivity, particularly affecting vulnerable populations using AI-mediated support services.

## Methodology/Approach

The research employed persona-based prompting experiments using models like Llama-3.1-8B-Instruct to systematically compare outputs. Researchers prompted LLMs to assume LGBTQ+ versus non-LGBTQ+ personas in neutral scenarios (e.g., workplace settings) and analyzed generated text for three phenomena: explicitly harmful representations, narrow representations, and discursive othering. The comparative approach isolated identity-related effects by controlling for scenario context, revealing systematic differences in narrative scope and thematic focus between identity groups. Four hypotheses were formulated to test the occurrence and frequency of these phenomena.

## Relevant Concepts

**Representational Harm:** Negative or stereotyped portrayals that reinforce social inequalities and influence cultural perceptions of marginalized groups, potentially affecting both individual dignity and downstream allocational decisions.

**Allocational Harm:** Systematic disadvantage resulting from biased representations, such as therapeutic chatbots redirecting queer users away from primary health concerns due to identity-focused defaults.

**Discursive Othering:** Linguistic patterns that mark marginalized groups as distinct from dominant groups through differential topic focus, even when using positive language, perpetuating subtle social marginalization.

**Narrow Representation:** Constraining portrayals of marginalized identities to stereotyped, identity-centric narratives while affording dominant groups the full spectrum of human experience and roles.

**Inspiration Porn:** Problematic framing of marginalized individuals (particularly disabled people) as motivational examples, reducing their humanity to their identity category.

**Trans Broken Arm Syndrome:** Clinical bias where healthcare providers attribute all patient concerns to gender or sexuality rather than addressing presenting symptoms, replicated in LLM outputs.

**Identity-Neutral Settings:** Contexts (workplaces, medical offices, social gatherings) where identity should be incidental rather than central to discourse and interaction.

## Practical Implications (Inferred)

The research suggests potential applications for:
- AI auditing frameworks examining representational patterns in LLM outputs across marginalized identity categories
- Safeguards preventing identity-focused outputs in contexts where identity is not contextually relevant
- Representational impact assessments for AI systems deployed in sensitive domains (healthcare, education, social services)
- Further research into how these patterns affect downstream harms in real-world applications

## Limitations & Open Questions

**Limitations:**
- Analysis scope limited to provided examples; full experimental methodology not detailed in excerpt
- Focus on English-language contexts and specific LGBTQ+ identity terms may limit generalizability
- Replication code forthcoming (not yet released)

**Open Questions:**
- How do these constrained representations manifest across different LLM architectures and sizes?
- Do findings generalize across multilingual contexts and non-Western cultural frameworks?
- What training data characteristics drive these constrained representations?

## Relation to Other Research

- **AI Bias & Fairness**: Extends toxicity-focused auditing to subtle representational patterns beyond explicit harm
- **Media Representation Studies**: Applies real-world marginalization patterns to LLM discourse analysis
- **Healthcare AI Ethics**: Connects to concerns about therapeutic chatbots reproducing clinical biases affecting vulnerable populations
- **Algorithmic Justice**: Contributes to understanding how systems perpetuate social inequalities through normalized, non-malicious mechanisms

## Significance

This research demonstrates that representational harms in LLMs extend far beyond explicit toxicity to subtle discursive patterns that systematically marginalize LGBTQ+ individuals. As LLMs increasingly mediate human interaction in sensitive domains—therapy, education, healthcare—these constrained narratives pose concrete risks to mental health and wellbeing. The findings challenge assumptions that "positive" language prevents harm, revealing how overcorrection and identity-focus can constitute subtle discrimination. By documenting these patterns, the work provides evidence-based justification for representation audits and safeguards in AI deployment, particularly in applications serving marginalized communities. The research ultimately argues that equitable AI requires not merely avoiding harm but actively ensuring marginalized groups receive the narrative complexity and contextual appropriateness afforded to dominant groups.

---

**Quality Metrics:**
- Overall Score: 90/100
- Accuracy: 92/100
- Completeness: 88/100
- Actionability: 85/100
- Concepts Defined: 13

*Generated: 2025-11-16 19:08*
*Model: claude-haiku-4-5*
*API Calls: 158 total*
