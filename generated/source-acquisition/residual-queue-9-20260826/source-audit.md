# Source audit: residual queue batch, 26 August 2026

## Scope and result

The batch contains the nine Works that remained in `generated/agent-screening-queue.json` after the previous open-access acquisition runs. It is bounded by that queue snapshot and excludes the later Codex Websearch package, whose candidates still require Zotero import and Work-Version binding.

One Work reached the reviewed Paper-source gate. Eight Works remain fail-closed. The source result itself carries no annotation or later authority; the subsequent governed run for `8NG4ZEWE` is recorded separately.

| Record | Identity result | Full-text result | Gate |
|---|---|---|---|
| `8NG4ZEWE` | Walgenbach, *Intersektionalität*, 2023, DOI `10.35468/wbeb2022-155` | Complete official HTML full text converted with Docling and visually checked against the official two-page PDF | source-ready |
| `5T55I5Z7` | UNESCO, *Artificial Intelligence and Gender Equality*, 2020, ark `pf0000374174` | Official delivery endpoint still returns HTTP 403 | blocked on official delivery |
| `ZQHP5G35` | Jørgensen, *Data and rights in the digital welfare state: the case of Denmark*, DOI `10.1080/1369118X.2021.1934069` | Publisher and repository checks expose metadata and abstract, while the article remains access-restricted | blocked on full text |
| `KI9GRGHB` | Marjanovic, Cecez-Kecmanovic and Vidgen, *Theorising algorithmic justice*, DOI `10.1080/0960085X.2021.1934130` | The UTS repository labels the listed PDF closed access; the file request returns an access page | blocked on full text |
| `LR8Z3YHP` | Hoeyer and Wadmann, *‘Meaningless work’*, DOI `10.1080/03085147.2020.1733842` | An official repository lists a CC BY Version of Record, but the canonical Zotero record carries unrelated DOI `10.1177/0950017020950021`; direct file delivery is access-blocked in this environment | blocked on Zotero identity correction |
| `XG7RFFC7` | U.S. Bureau of Labor Statistics, 2023 | The agency renamed OES to OEWS in 2021. The record supplies neither a release identifier nor a valid journal-article identity | blocked on bibliographic curation |
| `SQYLQFRU` | The supplied title resolves to Kabra, Jha and Reddy, 2025, arXiv `2504.05632`; the record says Furniturewala et al., 2024 | An open preprint exists for the different verified identity | blocked on bibliographic curation |
| `RAY6G2R7` | The supplied URL `2404.17218` is Kamruzzaman and Kim. The actual SwiftSage work is arXiv `2305.17390` with different title, authors and year | Open sources exist for conflicting identities | blocked on bibliographic curation |
| `Z9DNTBFF` | The supplied URL `2405.20152` is Howard et al. The similar Srinivasan and Bisk work is the 2022 paper DOI `10.18653/v1/2022.gebnlp-1.10` | Open sources exist for conflicting identities | blocked on bibliographic curation |

## Lifecycle boundary

Source preparation alone only satisfied the Paper-source gate for `8NG4ZEWE`. The later run `residual-source-8ng4zewe-20260826` produced two operationally isolated tracks, deterministic PRISM roundtrips and an accepted AI Agent Review; its append-only productive record now carries `ai-agent-reviewed`. The other Works retain their previous lifecycle state and queue blockers. Domain-expert verification, publication approval and public projection remain open.
