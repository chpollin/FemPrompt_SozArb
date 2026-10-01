---
title: Handoff
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.7"
created: 2026-08-23
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code (Claude Opus 5.5)
related: [INDEX, plan, journal, project, analysis-methods, governance, verification, testing, standards]
---

# Handoff

## Current result

State of 1 October 2026, evening. `main` is the integration branch and carries all work of the day, including the merged branch `companion-redesign`, and `origin/main` equals it. The GitHub repository has been private since 1 October 2026. GitHub Pages stays public at https://chpollin.github.io/FemPrompt_SozArb/ and serves `docs/` from `main` as a legacy build, which exposes the internal working surfaces but not the git-ignored reading layer. The switch to `build/site/` is decision 3 in [[plan#Open decisions]].

The full texts stay in the private repository by operator decision of 1 October 2026, which supersedes the plan of 29 September to remove protected texts. The laptop branch `prepare-expert-verification`, which carried that removal, is not merged. A clone obtains the PRISM reading layer by running `npm run build` from the tracked `generated/markdown_clean/`.

The day's results, each documented at its canonical place, are the following.

- The main question and the five sub-questions SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, and the publication context in Adult Literacy Education ([[project#Research questions]], [[project#Publication context]]).
- Human screening without AI pre-assessment, the expert prefill counted as done and the split of the open papers between the two reviewers (ADR-042, ADR-043, ADR-044 in [[specification]]).
- The PRISMA 2020 flow per identification source in `generated/prisma-flow/`, with the declared deviation for items 6 and 7 and the recommended paper wording in [[standards#Identification and selection reporting]].
- The methodological basis of the literature analysis ([[analysis-methods]]), explicit field states and analysis coverage ([[data#Analysis field states and coverage]]), the descriptive mapping tools ([[methods#Descriptive mapping and process diagnostics]]) and the rebuilt public Evidence Companion ([[specification#Public Evidence Companion]]).
- Bounded file names and the 120-character limit for tracked paths ([[data#File naming and path length]]).
- The draft codebook amendment v1.4 ([[codebook-v1.4-proposal]]) and an answer draft for SQ1 over grounded Assertions in [sq1-use.md](../research-vault/40_output/literature-report/sq1-use.md).

A parallel change adopts codebook v1.4 and makes the coding run harness-agnostic. It owns [[update-protocol]], [[codebook-v1.4-proposal]], `assessment/` and the coding parts of [[analysis-methods]] and [[data]], and its state is recorded there once it lands.

## Continuation point

1. The two reviewers screen their assigned open papers in PRISM, in a local clone with Chrome or Edge, following the setup in the README and `docs/help.html#prism`.
2. Integrate the codebook v1.4 adoption and run the analysis-coding agents with the separate AI Agent Review once the run model is chosen (decision 10).
3. Obtain the binding-rule permission (decision 1) and bind the prepared 2026 reading texts.
4. Decide the remapping of the four reviewed Assertions (decision 2), then continue the SQ1 answer under step 4 of [[plan#Answering the research questions]].
5. Resolve the contradiction between the division of labour and PRISM, which still asks a human reviewer for analysis coding on an Include (decision 20).
6. Start the independent acceptance review of the Evidence Companion under [[plan#UI development]].

## Decisions to preserve

- The review delivers the evidence base. Recommendations found in the literature are reported as recommendations of their sources ([[project#Project goal]]).
- Human reviewers see no AI pre-assessment. A record seeded from the expert decision confirms that decision and is never a second independent human track (ADR-042, ADR-044).
- Human verification may cover an individual statement or field and applies only to the named content and its evidence basis. It is accepted but not implemented, and PRISM offers no verification action ([[governance#Verification scope decision, 22 September 2026]]).
- The public Evidence Companion is the allowlisted result site from `build/site/` ([[governance#Publication boundary]]). Deployment, push and merge remain operator-gated.
- Additive Zotero writes are authorised under [[governance#Authorised additive Zotero import]]. Existing-item corrections need their own scoped operation.

## Checkout and local material

On either machine, inspect the working tree first and preserve machine-local changes, then bring `main` up to date.

```powershell
git status
git fetch origin
git switch main
git pull --ff-only
```

On the laptop, keep `prepare-expert-verification` unmerged and inspect its commits before deciding what to keep. If a local branch has diverged, inspect the differing commits instead of resetting it.

Install missing dependencies through [[testing#Clean-checkout verification]], then build, check and preview.

```powershell
npm run build
npm run check
npm run preview
```

The build reconstructs the ignored reading layer and projections and needs no external API key. PRISM opens at `http://127.0.0.1:8870/prisma.html`, the internal working application at `http://127.0.0.1:8870/index.html` and the result site at `http://127.0.0.1:8870/results/index.html`. A change to `knowledge/project.md` requires a rebuild because it is a hash-bound build input. Line-ending-only drift after a build is discarded per path.

| Material | Availability after checkout |
|---|---|
| Versioned code, project knowledge, research data, tracked full texts, reviewed source representations and committed receipts | Retrieved through Git on `main` |
| Generated reading layer, readiness inventories and local result site | Rebuilt by `npm run build` |
| Original PDFs and local acquisition evidence under `pipeline/`, `generated/pdfs/` and ignored parts of `generated/source-acquisition/` | Require a separate private transfer if absent. Preserve relative paths and compare the recorded hashes before source review. The open-access preprint reacquired on 22 September exists only on the laptop |
| `generated/local-source-preservation/`, `generated/zotero-sync/`, credentials and `.vault_cache/` | Not transferred by Git and never committed ([[data#Local source preservation]]). Group writes need a locally provisioned Zotero key |

## Verification state

The knowledge refactoring of the evening of 1 October 2026 ran `npm run build` and `npm run check` on its branch. The other verification rounds of the day are recorded with their scope in the [[journal]] entries of 1 October. These checks establish technical behaviour, not domain-expert acceptance. No record, Assertion or output carries domain-expert verification ([[verification]]). The native browser folder-permission check and the expert acceptance session remain open.
