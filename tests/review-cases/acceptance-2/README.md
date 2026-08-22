# Operator acceptance: two new papers

These proposed judgements are test records awaiting human review. The read-only PRISM view loads both records without connecting a working folder and never writes research data.

## Direct review links

- `http://localhost:8765/prisma.html?review=acceptance-2&paper=Z4YXX9PZ`
- `http://localhost:8765/prisma.html?review=acceptance-2&paper=AIGLDZ4C`

`Z4YXX9PZ` is an experimental paper on prompting techniques for reducing social bias in LLMs. The proposal is Include with complete analysis coding.

`AIGLDZ4C` is a practical web guide to inclusive AI image prompting. Its content covers the category rule, while the proposed final decision is Exclude with `Wrong_publication_type`.

`reviewer2.json` is the source fixture retained for provenance. `manifest.json` pins the full-text hashes and the passages used for every category and analysis code. The browser-facing copy under `docs/data/review-cases/acceptance-2.json` uses the reviewer key `acceptance` and is deliberately read-only.

No record from this directory may be promoted into `docs/data/screening/` before explicit operator acceptance.
