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
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code (Claude Opus 5.5)
related: [INDEX, plan, journal, project, analysis-methods, governance, verification, testing, standards]
---

# Handoff

## Current result

State of 2 October 2026. `main` is the integration branch and is ahead of `origin/main` by the unpushed commits of 2 October. The GitHub repository has been private since 1 October 2026. GitHub Pages stays public at https://chpollin.github.io/FemPrompt_SozArb/ and serves `docs/` from `main` as a legacy build, which exposes the internal working surfaces but not the git-ignored reading layer. The switch to `build/site/` is decision 3 in [[plan#Open decisions]].

The full texts stay in the private repository by operator decision of 1 October 2026, which supersedes the plan of 29 September to remove protected texts. The laptop branch `prepare-expert-verification`, which carried that removal, is not merged. A clone obtains the PRISM reading layer by running `npm run build` from the tracked `generated/markdown_clean/`.

The day's results, each documented at its canonical place, are the following.

- The main question and the five sub-questions SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, and the publication context in Adult Literacy Education ([[project#Research questions]], [[project#Publication context]]).
- Human screening without AI pre-assessment, the expert prefill counted as done and the split of the open papers between the two reviewers (ADR-042, ADR-043, ADR-044 in [[specification]]).
- The PRISMA 2020 flow per identification source in `generated/prisma-flow/`, with the declared deviation for items 6 and 7 and the recommended paper wording in [[standards#Identification and selection reporting]].
- The methodological basis of the literature analysis ([[analysis-methods]]), explicit field states and analysis coverage ([[data#Analysis field states and coverage]]), the descriptive mapping tools ([[methods#Descriptive mapping and process diagnostics]]) and the rebuilt public Evidence Companion ([[specification#Public Evidence Companion]]).
- Bounded file names and the 120-character limit for tracked paths ([[data#File naming and path length]]).
- The draft codebook amendment v1.4 ([[codebook-v1.4-proposal]]) and an answer draft for SQ1 over grounded Assertions in [sq1-use.md](../research-vault/40_output/literature-report/sq1-use.md).

On 2 October 2026 the analysis-coding run under codebook 1.4.1 coded the included works with full text that had no 1.4 coding and integrated them into the agent track ([[update-protocol#Coding run of 2 October 2026]]). The UI fixes of the plan and of the independent acceptance review of the result site lie on the unmerged branch `worktree-agent-ad2a266c70c16ddd6`, built and checked green, whose merge into `main` is the operator's ([[plan#UI development]]).

## Continuation point

1. The two reviewers screen their assigned open papers in PRISM, in a local clone with Chrome or Edge, following the setup in the README and `docs/help.html#prism`.
2. Merge the UI branch after the operator's review, then the operator review on the phone.
3. The domain experts take the spot checks in each run's `spot-check-sample.json` and decide the human and agent decision divergences the completion package lists.
4. Merge the branch `recode-v13-works`, which carries the recode contract ADR-046 and the recode of the works coded under 1.3, decide the Version binding of `JFDBPUBN`, `BDI6XU5A` and `XIYX5HJS`, and resolve the Work duplicates ([[plan#Source and corpus readiness]]).
5. Refresh the answer drafts for SQ1 to SQ5 to the recoded state and continue with Assertions under step 4 of [[plan#Answering the research questions]].

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
