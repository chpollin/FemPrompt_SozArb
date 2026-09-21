# Deep-Research-Assisted Literature Reviews

FemPrompt SozArb studies feminist AI literacy and bias in large language models (LLMs) in social work. It develops a literature-review workflow in which AI contributions and research decisions remain traceable to their sources. The work forms part of the [Elisabeth List Fellowship project “Diversity-Sensitive Engagement with Artificial Intelligence”](https://digitalesozialearbeit.github.io/list-fellowship.html) at the University of Graz.

The [Evidence Companion](https://chpollin.github.io/FemPrompt_SozArb/) provides access to the literature corpus and research views. This repository contains the bibliographic data, source-linked knowledge documents, assessment records, research prompts and software behind the review. [PRISM](https://chpollin.github.io/FemPrompt_SozArb/prisma.html) is the screening tool for reading sources, assessing categories and recording supporting passages.

## Method and data flow

Deep Research systems conduct iterative searches to identify candidate publications. References are curated in Zotero and associated with specific publication versions. Available full texts are converted into Markdown with Docling and checked against the sources. These texts support structured knowledge documents and evidence-backed assessments in PRISM. Each assessment preserves the connection to the publication version read.

The first review round compared separately recorded expert and LLM assessments using the same ten-category schema. In the subsequent round, AI agents prepare annotations that undergo a separate AI review against their sources. Domain experts retain responsibility for scholarly verification and interpretation, with publication approval recorded separately.

Reviewed assessments feed the literature analysis. Knowledge documents support source-linked statements that are brought together in the literature report and follow-up manuscript. Corpus preparation and the manuscript remain unfinished. Released results cover an explicitly labelled AI-source-reviewed subset, with domain-expert verification still open.

## Documentation and development

Development follows Promptotyping, an iterative method in which a maintained project knowledge base guides implementation and review. Full project documentation is in [`knowledge/`](knowledge/INDEX.md).

## Citation and licence

Pollin, C., Sackl-Sharif, S., Klinger, S., & Steiner, C. *Deep-Research-Assisted Literature Reviews: Epistemic Infrastructure as Practice.* [Project repository](https://github.com/chpollin/FemPrompt_SozArb).

Code is licensed under [MIT](LICENSE). Documentation and knowledge documents use [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Underlying publications and third-party research data retain their respective rights and licences.
