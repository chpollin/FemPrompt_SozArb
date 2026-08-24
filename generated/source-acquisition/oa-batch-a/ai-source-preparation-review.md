# AI source-preparation review: OA batch A

- Activity: `ai-source-preparation-review-oa-batch-a-20260823`
- Activity type: `source_preparation_review`
- Actor: `codex-ai-source-preparation` (`ai_agent`)
- Performed: 2026-08-23
- Human verification: `false` (`pending`)
- Scope: local PDF-to-Markdown preparation and identity/table-structure checks for the five acquired Batch-A sources.
- Excluded: no screening annotation, no human adjudication, and no claim of epistemic independence.

## Identity and conversion result

The five entries below are safe matches against the canonical Paper records. The local PDF is the acquired source; the clean Markdown is the deterministic Docling-derived reading-layer input.

| Paper | Identity check | PDF SHA-256 | Clean Markdown SHA-256 | AI preparation result |
|---|---|---|---|---|
| `VSZM7CT6` | title, authors, and DOI `10.1093/bjsw/bcab168` exact; accepted manuscript says 2021 while canonical record says 2022 | `59b9bb1862abd2cc5e6b340a690c9409df6c4c7a684d36598d0493c32f6a5998` | `4c25942b2e1274943aba79c38cf41959737d030885746df3b7f3f7503317c80a` | prepared; year-version discrepancy retained for human check |
| `7FEFMCBZ` | title, authors, year 2022, DOI `10.1145/3491102.3501831` | `2a29ea2f00baa7707ed3054038cbe004adfce76a23d2e475cc5b72feee4c93d5` | `fb7a2d1d06747fb194883cb57a694ba19c036d8e9bc5c111077e08931d4c0ed1` | prepared; no enhanced-validator failure |
| `R7V99ERA` | title, authors, year 2023, DOI `10.1145/3593013.3594094` | `b38c7f1ae2ac92fc4780cb933fc8f4f6c07c094e73c474a6f1820adc184104e9` | `e5d79799268cf6f262f309bc0c40b4816032b8c9a446de9ced811c32e2172284` | prepared with table-structure warning |
| `4ZL5Q48E` | title, authors, year 2021, DOI `10.1177/20539517211020332` | `995d0872eb79004261c9f94dcafaa1e4b19b8c46ea23dca2ec1befda64477259` | `fa13ff43180c4f150403a6c2f0cd199726fe489f4d1911429f01d40b565e1467` | prepared with table-structure warning |
| `J7V3AAQT` | title, authors, year 2023, DOI `10.3389/fdgth.2023.1133987` | `4238819e0accf3c5c459ab4d02c8cb969b06a0756a3652b1ea1d9855620a3904` | `f91e466fe12c020c150c636661a7b884866e4ae6618d92016d064b835ae9750d` | prepared; no enhanced-validator failure |

## Agent inspection of table deviations

The enhanced conversion validator reported `PDF=1, Markdown=0` for `4ZL5Q48E` and `PDF=2, Markdown=11` for `R7V99ERA`. The agent compared the PDF-derived page text, table captions, and the clean Markdown around each reported location.

- `4ZL5Q48E`: the clean text preserves the article title, body, references, and the caption for Figure 1. No Markdown table is present. The validator's single detected PDF table has no corresponding tabular block in the clean output; this is a structure-preservation gap, not an identity or text-loss pass. Table-level claims must remain deferred until a human checks the original PDF layout.
- `R7V99ERA`: the clean output preserves the captions and surrounding discussion for Tables 1–10. Table 1 and Table 2 are represented as Markdown tables; later tables are represented across page text and table-like blocks, which explains the detector's higher Markdown count relative to the PDF count. The mismatch is therefore a segmentation/representation warning. It does not establish missing numerical content, and the source remains suitable for reading-layer access with the warning retained.

## Gate and unresolved records

The five acquired sources are eligible for the local full-text reading layer after deterministic identity checks. This activity does not authorize screening annotation or human-review completion. `KI9GRGHB`, `ZQHP5G35`, and `LR8Z3YHP` remain fail-closed and are intentionally absent from the source overrides: each still lacks a safe, locally acquired full text.
