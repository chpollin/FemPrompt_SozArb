# Deep-Research-Assisted Literature Reviews

FemPrompt SozArb is a qualitative literature review on how social work professionals can use large language models (LLMs) for their tasks responsibly, constructively and productively, framed by feminist AI literacies. It also builds the workflow in which AI contributions and research decisions remain traceable to their sources. The work forms part of the [Elisabeth List Fellowship project “Diversity-Sensitive Engagement with Artificial Intelligence”](https://digitalesozialearbeit.github.io/list-fellowship.html) at the University of Graz.

## Research questions

The main question asks how social work professionals can use LLMs responsibly, constructively and productively for their tasks, which bias forms the literature identifies for which groups, how it handles them, which understanding of gender and bias it rests on, and which competences and organisational conditions it names. Five sub-questions structure the answer.

1. SQ1 Use. For which tasks and fields of social work does the literature describe LLM use, and which benefit does it report?
2. SQ2 Bias forms. Which bias forms, harm types and affected groups does the literature address, and which forms are missing?
3. SQ3 Handling of bias. How does the literature handle these bias forms, at which stage, with which techniques and with which evidence status?
4. SQ4 Conceptual grounding. Does the literature define gender and bias, and on which understanding and theories does it rest?
5. SQ5 Competences. Which competences and organisational conditions does the literature name for responsible use?

The methodological question of the paper asks how LLMs and AI agents can be integrated into a qualitative literature review with traceable contributions and final scholarly authority held by domain experts. The full wording, the German interface labels and the publication context are in [`knowledge/project.md`](knowledge/project.md#research-questions).

## Method in brief

Candidate literature was identified through AI-assisted deep research in two rounds, extended by an agent web search, without a bibliographic database search. The review reports identification, selection and screening according to PRISMA 2020 and PRISMA-trAIce, with a declared deviation for information sources and search strategy. References are curated in Zotero and bound to the exact publication version read. Full texts are converted to Markdown with Docling and checked against their sources.

Human reviewers screen in PRISM, the project's screening tool, with ten categories and without any AI pre-assessment. The analysis fields are coded by AI agents in separate, source-reviewed runs. Domain experts hold the scholarly authority. Source-linked knowledge documents and Assertions in the research vault support the answers to the sub-questions.

## Working with the repository

The repository is private. Full texts stay in it, and a local build turns them into the reading layer of PRISM. Editing in PRISM works only in a local clone opened in Chrome or Edge, because saving uses the browser's File System Access interface.

On Windows, clone into a short path such as `C:\femprompt`, for example with GitHub Desktop, because some paths come close to the Windows path limit. Install Python 3.11 or later from python.org and make sure `python` does not resolve to the Microsoft Store alias (Settings, Apps, Advanced app settings, App execution aliases). Node.js 22 is needed for the build and tests.

```sh
python -m pip install -r requirements-build.txt
npm install
npm run build
python -X utf8 -m src.publish.serve
```

`npm run preview` starts the same server. PRISM then opens at http://127.0.0.1:8870/prisma.html and the working application at http://127.0.0.1:8870/index.html. Reviewers start from the PRISM section of the help page, `docs/help.html#prism`. Developers run `npm run check` after the build, and the full test setup is in [`knowledge/testing.md`](knowledge/testing.md).

GitHub Pages currently serves `docs/` from `main` at https://chpollin.github.io/FemPrompt_SozArb/. The public result site, the Evidence Companion, is built into `build/site/`, and switching Pages to it is an open decision.

## Project knowledge

Development follows Promptotyping, a method in which a maintained knowledge base guides implementation and review. The knowledge base starts at [`knowledge/INDEX.md`](knowledge/INDEX.md), the current state and continuation point are in [`knowledge/handoff.md`](knowledge/handoff.md), and the open decisions are in [`knowledge/plan.md`](knowledge/plan.md). Agent working rules are in [`CLAUDE.md`](CLAUDE.md).

## Citation and licence

Pollin, C., Sackl-Sharif, S., Klinger, S., & Steiner, C. *Deep-Research-Assisted Literature Reviews: Epistemic Infrastructure as Practice.* [Project repository](https://github.com/chpollin/FemPrompt_SozArb).

Code is licensed under [MIT](LICENSE). Documentation and knowledge documents use [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Underlying publications and third-party research data retain their respective rights and licences.
