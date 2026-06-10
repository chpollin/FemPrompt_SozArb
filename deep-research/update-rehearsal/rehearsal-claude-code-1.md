---
title: "Rehearsal Run 1: Claude Code Lane Simulating ChatGPT (OpenAI) Deep Research"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [update-protocol-draft, plan]
---

# REHEARSAL RUN

**REHEARSAL RUN, Claude Code lane. Not part of the screened corpus until the protocol is committed. System simulated: ChatGPT (OpenAI) Deep Research. Prompt included verbatim below.**

This file documents a marked rehearsal of the round 2 update search (TP5 / Stage B2, see `knowledge/plan.md` and `knowledge/update-protocol-draft.md`). It is a dry run of the L1 lane (ChatGPT (OpenAI) Deep Research) executed agentically inside Claude Code with web search tools. It produces a candidate list, not screened or deduplicated records. Nothing in this file enters the corpus; the pre-registered protocol governs the real runs.

## Run metadata

- Run date: 2026-06-09
- Executor: Claude Code session with WebSearch and WebFetch tools (this is the simulation caveat: the actual ChatGPT Deep Research product was not used; lane fidelity is therefore approximate)
- System simulated: ChatGPT (OpenAI) Deep Research (lane L1 of the protocol draft)
- Time window applied: publications in or after October 2025, per the added restriction sentence in the prompt
- Discovery queries executed (verbatim):
  1. `"feminist AI literacy" OR "feminist AI literacies" intersectional 2025 2026`
  2. `intersectional prompting large language models discrimination critical practice peer-reviewed 2026`
  3. `"critical AI literacy" structural power individual competence limits critique 2026`
  4. `feministische KI intersektionale Diskriminierung Prompting Kompetenz 2025 2026`
  5. `Veldhuis "critical AI literacy" 2025 dimensions sociopolitical`
  6. `social work artificial intelligence gender bias intersectionality 2026 journal article`
  7. `"feminist" prompting OR "prompt engineering" generative AI critique power asymmetries article 2026`
  8. `intersectional bias audit large language models co-constitution discrimination November 2025`
  9. `gender bias mitigation prompting LLM instruction study December 2025 January 2026`
  10. `"data feminism" OR "feminist HCI" generative AI literacy education 2026 study`
  11. `Soziale Arbeit künstliche Intelligenz Diskriminierung kritische Perspektive Zeitschrift 2026`
- Verification: candidate metadata confirmed by opening arXiv abstract pages, publisher pages, or Crossref API records (`api.crossref.org/works/DOI`); per-candidate confidence notes state what was actually opened. Only items actually seen in search results or opened pages are listed; no invented references.

## Prompt (verbatim)

```
KONTEXT

Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?

You are an expert in systematic scientific literature analysis. You conduct comprehensive research, summarise relevant sources accurately, critically evaluate their quality and cite them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic 'Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?' from 2023-2025, especially from peer-reviewed sources.
2. Create a concise summary (max. 150 words) for each source, accurately presenting the central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low), justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral, precise, academic style. Structure of the answer:

1. APA citation
2. Concise summary of the key statements
3. Critical quality assessment including explicit justification

Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1.
```

## Candidate list

Eligibility shorthand below refers to the round 1 inclusion logic (at least one technology dimension AND at least one social dimension, `benchmark/config/categories.yaml` v1.2) and to the research question's three elements: feminist/critical AI literacies, intersectionally informed prompting as critical practice, and the structural-power limit of individual competence approaches.

### C01

- Title: "Grillz on a hijabi": Intersectional Identities in Fostering Critical AI Literacy
- Authors: Jaemarie Solyst, Chloe Fong, Faisal Nurdin, Rotem Landesman, R. Benjamin Shapiro
- Venue: arXiv preprint (cs.HC), no journal or conference venue stated
- Year: 2025 (submitted 2025-10-07)
- URL: https://arxiv.org/abs/2510.06306
- Relevance: Critical AI literacy program in which Black Muslim teenage girls encounter generative AI bias and safety failures around their intersectional identities; the creative friction becomes the vehicle for critical analysis. Direct hit on feminist/intersectional AI literacies (social dimension) with generative AI tools (technology dimension).
- Confidence: High. Abstract page opened; title, authors, and submission date verified. Preprint, not yet peer reviewed.

### C02

- Title: Intersectional biases in narratives produced by open-ended prompting of generative language models
- Authors: Evan Shieh, Faye-Marie Vassel, Cassidy R. Sugimoto, Thema Monroe-White
- Venue: Nature Communications
- Year: 2026 (published 2026-01-08)
- DOI: 10.1038/s41467-025-68004-9
- Relevance: Open-ended prompting used as the instrument that surfaces intersectional omission, subordination, and stereotyping across five language models; empirically operationalizes making the co-constitution of discrimination forms visible. Technology and social dimensions both clearly present.
- Confidence: High. Article page opened; all metadata verified. Note: an EAAMO 2025 conference PDF with a near-identical title appeared in results (https://conference2025.eaamo.org/conference_information/schedule/papers/language_models_generate_widespread_intersectional_biases.pdf) but could not be parsed; it is plausibly the conference version of the same line of work, unverified.

### C03

- Title: From prompt engineering to prompt design: Research strategies for visual generative AI
- Authors: Gabriele Colombo, Sabine Niederer, Carlo De Gaetano
- Venue: Big Data & Society, 13(2)
- Year: 2026 (May 2026 per search results)
- DOI: 10.1177/20539517261451462
- Relevance: Reframes prompting from output optimization to critical research practice: ambiguous prompting for bias research, provocative prompting for content moderation probing, reverse-engineered prompting for machine critique; search snippets connect it to data feminist, consent-based practice. Close fit to intersectionally informed prompting as critical practice.
- Confidence: High on existence, venue, and authors (search results plus an institutional repository PDF listing at re.public.polimi.it); the SAGE article page itself could not be opened, so the May 2026 date is from search results only.

### C04

- Title: Reimagining Data Work: Participatory Annotation Workshops as Feminist Practice
- Authors: Yujia Gao, Isadora Araujo Cruxen, Helena Suarez Val, Alessandra Jungs de Almeida, Catherine D'Ignazio, Harini Suresh
- Venue: arXiv preprint; abstract page states acceptance at CHI 2026
- Year: 2026 (submitted 2026-02-25)
- URL: https://arxiv.org/abs/2602.22196
- Relevance: Feminist epistemology applied to data annotation with journalists and activists documenting gender-related violence; reframes data and AI development as relational and political spaces. Speaks directly to structural power versus individual competence in AI development.
- Confidence: High. Abstract page opened; metadata verified. Author names rendered here without diacritics where uncertain; check originals at import.

### C05

- Title: Emergent Technology, Emergent Critique: Students and Teachers Developing Critical AI Literacy through Participatory Design around Generative AI
- Authors: Santiago Ojeda-Ramirez, Eva Durall Gazulla, Kylie Peppler
- Venue: arXiv preprint (cs.HC)
- Year: 2026 (submitted 2026-04-23, revised 2026-04-29)
- URL: https://arxiv.org/abs/2604.21995
- Relevance: Participatory design study in which Latinx students and teachers develop critical AI literacy practices, including sociopolitical power analysis (building on the Veldhuis et al. critical AI literacy dimensions). Models literacy as collective practice, which bears on the limits of individual competence approaches.
- Confidence: High. Abstract page opened; metadata verified. Preprint, not yet peer reviewed.

### C06

- Title: Invisible Influences: Investigating Implicit Intersectional Biases through Persona Engineering in Large Language Models
- Authors: Nandini Arimanda, Achyuth Mukund, Sakthi Balan Muthiah, Rajesh Sharma
- Venue: arXiv preprint; abstract page states ACM Web Science Conference as venue
- Year: 2026 (abstract page states submission 2026-03-16)
- URL: https://arxiv.org/abs/2604.06213
- Relevance: Persona prompting used as a probe that makes implicit intersectional bias visible (BADx metric, five models, marginalized versus privileged personas). Methodically the closest technical analogue to intersectionally informed prompting as a visibility practice.
- Confidence: High on metadata (abstract page opened). The stated submission date (March) and the arXiv number series (2604) differ by one month; record as stated on the page and recheck at import.

### C07

- Title: Compounding Disadvantage: Auditing Intersectional Bias in LLM-Generated Explanations Across Indian and American STEM Education
- Authors: Amogh Gupta, Niharika Patil, Sourojit Ghosh, SnehalKumar (Neil) S Gaikwad
- Venue: arXiv preprint (cs.CY)
- Year: 2026 (submitted 2026-01-20, revised 2026-05-17)
- URL: https://arxiv.org/abs/2601.14506
- Relevance: Intersectional audit of LLM explanations across caste, school tier, race, institution type, income, gender, and disability; finds systematic quality disadvantages for marginalized combinations. Empirical evidence for compounding (co-constituted) discrimination in LLM outputs.
- Confidence: High. Abstract page opened; metadata verified. Preprint, not yet peer reviewed.

### C08

- Title: AI and Gender—The Ambivalent Role of AI in Advancing Gender Equality for SDG 5 (the dash is part of the published title)
- Authors: Lucie Stecker, Michael Boecker, Uli Kowol, Tanusha Raniga
- Venue: Journal of Human Rights and Social Work
- Year: 2026 (published online 2026-03-23)
- DOI: 10.1007/s41134-025-00432-5
- Relevance: Scoping review of AI and gender equality with explicit social work framing; opportunities versus algorithmic bias and digital exclusion, with governance and legal frameworks foregrounded over individual competence. Strong fit for the project's social work anchoring.
- Confidence: High. Article page opened; metadata verified.

### C09

- Title: Gender bias in text-to-image generative artificial intelligence: Neglect and stereotypical presentations across three popular platforms
- Authors: Hannah Weinmann, Tanja V. Messingschlager, Markus Appel
- Venue: New Media & Society
- Year: 2026 (published online 2026-04-16)
- DOI: 10.1177/14614448261435197
- Relevance: Peer-reviewed study of gender bias in text-to-image outputs across three platforms; search snippets note an explicit call for intersectional follow-up analysis. Technology dimension strong, social dimension via gender bias; intersectionality named as future direction rather than executed.
- Confidence: High on metadata (Crossref record fetched); full text not opened (SAGE page blocked).

### C10

- Title: Toward a framework for artificial intelligence arts-based research: a critical, human-centered approach for prompt engineering with qualitative datasets
- Authors: Hannah R. Gerber
- Venue: Educational Media International, 62(3)
- Year: 2025 (published online 2025-11-04)
- DOI: 10.1080/09523987.2025.2556606
- Relevance: Framework for critical, human-centered prompt engineering grounded in critical literacy traditions; raises voice, authorship, power, and authenticity questions for AI use with qualitative data. Connects prompting practice to critical literacy, the prompt's central pairing.
- Confidence: High on metadata (Crossref record fetched, which places it inside the window); the Taylor & Francis page itself was blocked, full text not opened. Listed as an editorial-type piece in one search snippet; verify document type at import.

### C11

- Title: Algorithm beyond Neutrality: Feminist Approaches to Redefining Artificial Intelligence
- Authors: Manavi Shahi, Harleen Kaur, Deepa Tyagi, Rati Sood, Vipin Kumar, Tikaram
- Venue: Proceedings of the 3rd International Conference on Library & Technology, "Artificial Intelligence and Humanities in Library and Education 4.0" (AIHLE 2025), Atlantis Press
- Year: 2026 (proceedings published 2026-03-16)
- DOI: 10.2991/978-94-6239-618-0_20
- Relevance: Feminist methodologies set against the neutrality myth of algorithms, with a survey component on public awareness of algorithmic bias. On-topic for feminist approaches; the conference is library/education oriented rather than a core AI ethics venue.
- Confidence: Medium-high. Proceedings page opened and metadata verified; peer review depth and methodological robustness of the survey unverified.

### C12

- Title: No Free Lunch in Language Model Bias Mitigation? Targeted Bias Reduction Can Exacerbate Unmitigated LLM Biases
- Authors: Shireen Chand, Faith Baca, Emilio Ferrara
- Venue: AI (MDPI), 7(1), article 24
- Year: 2026 (published online 2026-01-13)
- DOI: 10.3390/ai7010024
- Relevance: Shows that targeted debiasing interventions degrade untargeted bias dimensions (cross-category spillover), with a multi-dimensional auditing framework as the response. Technical evidence for the prompt's claim that narrow, single-axis fixes miss the structural entanglement of discrimination forms.
- Confidence: High on metadata (Crossref record fetched); full text not opened (MDPI page blocked). MDPI venue quality to be assessed at screening.

### C13

- Title: A Critique of Human-Centred AI: A Plea for a Feminist AI Framework (FAIF)
- Authors: Tanja Kubes
- Venue: AI & Society, volume 41, pages 2827 to 2838
- Year: 2026 issue; published online 2025-08-19
- DOI: 10.1007/s00146-025-02556-8
- Relevance: Argues human-centred AI cannot deliver fairness because it leaves structural, ontological problems untouched; proposes a feminist AI framework against capitalist, Eurocentric, androcentric development. Directly on the limits of individual or surface-level approaches versus structural power asymmetries.
- Confidence: High on metadata (article page opened). BORDERLINE WINDOW: the online-first date precedes the October 2025 cutoff while the issue date is inside it; whether round 1 already covered it must be settled by the protocol's deduplication step, not silently here.

### C14

- Title: Feministische KI: Warum Künstliche Intelligenz Ungerechtigkeit verstärkt und was wir dagegen tun müssen
- Authors: Eva Gengler
- Venue: Verlag J.H.W. Dietz Nachf., Bonn (monograph), ISBN 9783801207199
- Year: 2026 (per publisher listing and secondary coverage; exact month not confirmed)
- URL: https://dietz-verlag.de/isbn/9783801207199/Feministische-KI-Warum-Kuenstliche-Intelligenz-Ungerechtigkeit-verstaerkt-und-was-wir-dagegen-tun-muessen-Eva-Gengler
- Relevance: German-language monograph on feminist AI, power, and intersectional feminism by a researcher working on AI from a feminist socio-technical perspective; structural injustice framing matches the prompt's German discourse context. Not peer reviewed (trade non-fiction).
- Confidence: Medium. Publisher page seen in search results; existence and 2026 year corroborated by multiple secondary sources; not a peer-reviewed source, publication month unconfirmed.

### C15

- Title: Prompt Engineering for Responsible Generative AI Use in African Education: A Report from a Three-Day Training Series
- Authors: Benjamin Quarshie, Vanessa Willemse, Macharious Nabang, Bismark Nyaaba Akanzire, Patrick Kyeremeh, Saeed Maigari, Dorcas Adomina, Ellen Kwarteng, Eric Kojo Majialuwe, Craig Gibbs, Jerry Etornam Kudaya, Sechaba Koma, Matthew Nyaaba
- Venue: arXiv preprint (cs.CY)
- Year: 2026 (submitted 2026-01-04)
- URL: https://arxiv.org/abs/2601.06121
- Relevance: Prompt engineering training framed as AI literacy requiring ethical awareness and contextual sensitivity, with equity barriers in African educational contexts. Peripheral to the feminist/intersectional core but on the literacy-versus-structure axis of the prompt.
- Confidence: High on metadata (abstract page opened); relevance medium, include for screening rather than assume eligibility.

## Items checked and excluded (window or duplicate-foundation reasons)

- Shah, S. S., Gender Bias in Artificial Intelligence: Empowering Women Through Digital Literacy, Premier Journal of Artificial Intelligence: the article page states publication 2025-01-08, which is outside the window, although a search snippet wrongly suggested January 2026. Page-level data preferred. (https://premierscience.com/pjai-24-524/)
- Veldhuis et al., Critical Artificial Intelligence literacy: A scoping review and framework synthesis, International Journal of Child-Computer Interaction: 2024 publication, pre-window; appears here only because in-window candidates (C05) build on it.
- arXiv 2509.10782 (September 2025), arXiv 2508.07111 (August 2025), arXiv 2503.11962 (HInter, March 2025), PNAS Nexus 10.1093/pnasnexus/pgaf089 (volume 4, issue 3, 2025; pre-cutoff by issue position, not individually verified), the IDC 2025 paper Beyond the Algorithm (conference June 2025), and The Gendered, Epistemic Injustices of Generative AI (10.1080/08164649.2025.2480927; DOI sequence suggests early 2025, not individually verified): all apparently before the October 2025 cutoff.

## Limitations of this rehearsal

This run used Claude Code's WebSearch rather than the ChatGPT Deep Research product, so result composition will differ from a real L1 run. Search coverage was eleven discovery queries plus targeted verification; a production run needs the full protocol governance (declared execution window, run logging, RIS export, deduplication). Four candidates (C03, C09, C10, C12) rest on Crossref or search-result metadata because publisher pages were blocked; their full texts were not opened. No item from this file may enter the corpus before the protocol in `knowledge/update-protocol-draft.md` is finalized and committed.
