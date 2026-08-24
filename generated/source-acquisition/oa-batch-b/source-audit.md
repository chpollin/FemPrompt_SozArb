# OA batch B: source-acquisition audit

Acquired on 2026-08-23. A source is accepted only where the primary source
confirms the record's identity. The canonical screening queue and all
productive screening data remain unchanged by this acquisition batch.

## Conversion check

`src/acquire/validate_markdown_enhanced.py` found no conversion failure and no
text-loss warning in the three PDF conversions. It reported only table-count
mismatches (A2P8MXMY: PDF 1 / Markdown 0; BHXDU7VM: 0 / 9; P4YQIKJX: 1 / 7),
which place all three in the manual-review queue at medium priority. These are
conversion-structure warnings, not source-identity failures. The detailed
reports are in `validation_reports/`; no screening annotation was derived.

## AI source-preparation review

Status: `ai_source_preparation_reviewed`. Scope: source identity, PDF/Markdown
correspondence, and the table-count warnings only. This is not human review,
domain verification, a screening decision, or publication approval.

- `P4YQIKJX`: title, authors, year, and DOI are present in the source and the
  conversion. Numbered tables 1–5 occur in both PDF extraction and Markdown.
- `A2P8MXMY`: title, author, year, and DOI are present in the source and the
  conversion. Neither PDF extraction nor Markdown has a numbered table label.
- `BHXDU7VM`: title, seven authors, year, working-paper number, and DOI are
  source-confirmed. Numbered tables 1, 2, 3, 5, and 24 occur in both PDF
  extraction and Markdown.
- `QUV5DQH3` and `FTJM5R8N`: each captured official HTML document has a
  SHA-256-pinned semantic projection with title, author, year, and DOI in its
  provenance front matter.

The three identity-conflict records remain unbound. The five reviewed local
sources may enter the reading layer through their explicit curated overrides;
they do not yet have an AI-agent screening result.

## P4YQIKJX — acquired PDF

- Verified metadata: Li, Fan; Ruijs, Nick; Lu, Yuan (2023). *Ethics & AI: A
  Systematic Review on Ethical Concerns and Related Strategies for Designing
  with AI in Healthcare*. DOI `10.3390/ai4010003`.
- Primary-access source: TU/e institutional repository, publisher's PDF / version
  of record: `https://pure.tue.nl/ws/portalfiles/portal/256909018/ai_04_00003.pdf`.
- Local PDF: `generated/pdfs/P4YQIKJX.pdf`, SHA-256
  `b73d6f694c83af054da798caca1c55498c9e72e4c59be5e2655bcdd6a09dd871`.
- Pipeline result: `generated/markdown_clean/P4YQIKJX.md`, 110,011 characters,
  SHA-256 `18597852d517aadc4b258687332236fe86ab3b156000641ef47f9641ec4ae8d8`.

## A2P8MXMY — acquired PDF

- Verified metadata: Keddell, Emily (2019). *Algorithmic Justice in Child
  Protection: Statistical Fairness, Social Justice and the Implications for
  Practice*. DOI `10.3390/socsci8100281`.
- Primary-access source: MDPI's official collection *Critical Debates and
  Developments in Child Protection*, containing the publisher reprint:
  `https://mdpi-res.com/bookfiles/book/2989/Critical_Debates_and_Developments_in_Child_Protection.pdf?v=1698490642`.
- The source compilation is local at `generated/pdfs/A2P8MXMY-collection.pdf`,
  SHA-256 `31ceb1cb4df9a6357947a6622c2bfa411e2c66fe122bd6029157ad7b7f704b3a`.
  Pages 174–195, bounded by the article title and the following article title,
  were extracted without text edits to `generated/pdfs/A2P8MXMY.pdf`.
- Extracted PDF SHA-256:
  `dbc3bab585c6f1d8d545d87cee0bc0ee702a357ebd90eadb37f1a24bb87819e9`.
- Pipeline result: `generated/markdown_clean/A2P8MXMY.md`, 99,311 characters,
  SHA-256 `9140333c3381acfd3929651b57aeecdef09fe97ca5eca0bf2ca419f5131a1c69`.

## BHXDU7VM — acquired PDF

- Verified metadata: Chatterji, Aaron; Cunningham, Thomas; Deming, David J.;
  Hitzig, Zoe; Ong, Christopher; Shan, Carl Yan; Wadman, Kevin (2025). *How
  People Use ChatGPT*. NBER Working Paper 34255. DOI `10.3386/w34255`.
- Primary-access source: National Bureau of Economic Research:
  `https://www.nber.org/system/files/working_papers/w34255/w34255.pdf`.
- Local PDF: `generated/pdfs/BHXDU7VM.pdf`, SHA-256
  `0d9257c3448c258b148be6d31c7f20aa702bf0cfe0ae9136c2d3719c78f55571`.
- Pipeline result: `generated/markdown_clean/BHXDU7VM.md`, 130,525 characters,
  SHA-256 `2a72fca8f00983722a750630cd8e494b591d96e3af57e74a952b9627d1ad2978`.

## QUV5DQH3 — acquired official HTML full text

- Verified metadata: Smith, Genevieve; Rustagi, Ishita (2021). *When Good
  Algorithms Go Sexist: Why and How to Advance AI Gender Equity*. DOI
  `10.48558/A179-B138`.
- Primary-access source: Stanford Social Innovation Review:
  `https://ssir.org/articles/entry/when_good_algorithms_go_sexist_why_and_how_to_advance_ai_gender_equity`.
- Captured official HTML: `QUV5DQH3.official.html`, SHA-256
  `595ff1f5fefce4bd6bf467dec636e24bab12aa67eaf1fcc0c7839a29bf2ea911`.
- Provenance-marked semantic HTML projection:
  `generated/markdown_clean/QUV5DQH3.md`, SHA-256
  `b6d043134bf9e7a90ad2a8eadcddbfb687328af59f7ef655407ab28fa67d317f`.

## FTJM5R8N — acquired official HTML full text

- Verified metadata: He, Horace; Thinking Machines Lab (2025). *Defeating
  Nondeterminism in LLM Inference*. DOI `10.64434/tml.20250910`.
- Primary-access source: Thinking Machines Lab, *Connectionism*:
  `https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/`.
- Captured official HTML: `FTJM5R8N.official.html`, SHA-256
  `831829e6ddb8ea9585ef6868f9da5920548844cd8eea452c6f6c83372576145b`.
- Provenance-marked semantic HTML projection:
  `generated/markdown_clean/FTJM5R8N.md`, SHA-256
  `36673b625b15f62f4e53501b32dcb731ae911412a8c0d752cda5d4a95ee06f38`.

## Z9DNTBFF — blocked: supplied source is a different work

- Corpus source URL `https://arxiv.org/html/2405.20152v1` resolves to *Uncovering
  Bias in Large Vision-Language Models at Scale with Counterfactuals* by Phillip
  Howard, Kathleen C. Fraser, Anahita Bhiwandiwalla, and Svetlana Kiritchenko
  (2024). It does not match the record title or authors.
- A similarly named work by Tejas Srinivasan and Yonatan Bisk is *Worst of Both
  Worlds: Biases Compound in Pre-trained Vision-and-Language Models* (2022), DOI
  `10.18653/v1/2022.gebnlp-1.10`; its title and year also differ from the record.
- No local full text was bound.

## RAY6G2R7 — blocked: supplied source is a different work

- Corpus source URL `https://arxiv.org/html/2404.17218v3` resolves to *Prompting
  Techniques for Reducing Social Bias in LLMs through System 1 and System 2
  Cognitive Processes*, not the stated SwiftSage work.
- The primary SwiftSage record is *SwiftSage: A Generative Agent with Fast and
  Slow Thinking for Complex Interactive Tasks* (2023), arXiv `2305.17390`, by
  Bill Yuchen Lin and eight coauthors. Its title, year, and authorship differ
  from this record.
- No local full text was bound.

## SQYLQFRU — blocked: title match, authorship/year conflict

- The identifiable primary work is *Reasoning Towards Fairness: Mitigating Bias
  in Language Models through Reasoning-Guided Fine-Tuning* (2025), arXiv
  `2504.05632`, DOI `10.48550/arXiv.2504.05632`, by Sanchit Kabra, Akshita Jha,
  and Chandan K. Reddy.
- The corpus record instead gives Furniturewala, Zhang, and Chang (2024) and
  only a secondary summary URL. The authorship and year cannot be reconciled
  from a primary source.
- No local full text was bound.
