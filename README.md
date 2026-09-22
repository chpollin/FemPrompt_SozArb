# Deep-Research-Assisted Literature Reviews

FemPrompt SozArb studies feminist AI literacy and bias in large language models (LLMs) in social work. It develops a literature-review workflow in which AI contributions and research decisions remain traceable to their sources. The work forms part of the [Elisabeth List Fellowship project “Diversity-Sensitive Engagement with Artificial Intelligence”](https://digitalesozialearbeit.github.io/list-fellowship.html) at the University of Graz.

The [Evidence Companion](https://chpollin.github.io/FemPrompt_SozArb/) provides access to the literature corpus and research views. This repository contains the bibliographic data, source-linked knowledge documents, assessment records, research prompts and software behind the review. [PRISM](https://chpollin.github.io/FemPrompt_SozArb/prisma.html) is the verification surface for the prepared records: it shows the paper text, the agent coding with its evidence, and the round-one expert decision and round-one LLM proposal as labelled references, and records the domain expert's own result. Domain experts start from the [verification guide](https://chpollin.github.io/FemPrompt_SozArb/onboarding.html).

## Method and data flow

Deep Research systems conduct iterative searches to identify candidate publications. References are curated in Zotero and associated with specific publication versions. Available full texts are converted into Markdown with Docling and checked against the sources. These texts support structured knowledge documents and evidence-backed assessments in PRISM. Each assessment preserves the connection to the publication version read.

The first review round compared separately recorded expert and LLM assessments using the same ten-category schema. In the subsequent round, AI agents prepare annotations that undergo a separate AI review against their sources. Domain experts hold the scholarly authority. An accepted verification may cover a whole record or an individual statement or field, and it applies only to the checked content and its evidence basis. How mixed-authority content is published is still being settled.

Reviewed assessments feed the literature analysis. Knowledge documents support source-linked statements that are brought together in the literature report and follow-up manuscript. Corpus preparation and the manuscript remain unfinished. Released results cover an explicitly labelled AI-source-reviewed subset, with domain-expert verification still open. The full-text reading layer is rights-gated and not part of the repository; a clone shows abstracts only until the prepared reading folder has been handed over. Known defects of the verification path are recorded in [`knowledge/plan.md`](knowledge/plan.md).

## Documentation and development

Development follows Promptotyping, an iterative method in which a maintained project knowledge base guides implementation and review. Full project documentation is in [`knowledge/`](knowledge/INDEX.md).

## Citation and licence

Pollin, C., Sackl-Sharif, S., Klinger, S., & Steiner, C. *Deep-Research-Assisted Literature Reviews: Epistemic Infrastructure as Practice.* [Project repository](https://github.com/chpollin/FemPrompt_SozArb).

Code is licensed under [MIT](LICENSE). Documentation and knowledge documents use [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Underlying publications and third-party research data retain their respective rights and licences.
