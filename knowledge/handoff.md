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
updated: 2026-10-21
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code (Claude Opus 5.5)
related: [INDEX, plan, journal, project, analysis-methods, governance, verification, testing, standards]
---

# Handoff

## Current result

The operator clarified on 21 October 2026 that duplicates and all annotations remain preserved. Later analysis counts each established underlying work once. This supersedes the earlier merge instruction. No duplicate consolidation or counting change was implemented. The mixed Stable Diffusion bibliographic record was checked, and the operator then explicitly authorised correcting its URL, author list and year. The live Zotero correction and local metadata projection have been applied and read back, with records, existing texts and annotations preserved. [[plan#Source and corpus readiness]] owns the decision, and [[data#Stable Diffusion source-identity check of 21 October 2026]] records the evidence and limits.

State of 2 October 2026. `main` is the integration branch and is ahead of `origin/main` by the unpushed commits of 2 October. The GitHub repository has been private since 1 October 2026. GitHub Pages stays public at https://chpollin.github.io/FemPrompt_SozArb/ and serves `docs/` from `main` as a legacy build, which exposes the internal working surfaces but not the git-ignored reading layer. The switch to `build/site/` is decision 3 in [[plan#Open decisions]].

The full texts stay in the private repository by operator decision of 1 October 2026, which supersedes the plan of 29 September to remove protected texts. The laptop branch `prepare-expert-verification`, which carried that removal, is not merged. A clone obtains the PRISM reading layer by running `npm run build` from the tracked `generated/markdown_clean/`.

The day's results, each documented at its canonical place, are the following.

- The main question and the five sub-questions SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, and the publication context in Adult Literacy Education ([[project#Research questions]], [[project#Publication context]]).
- Human screening without AI pre-assessment, the expert prefill counted as done and the split of the open papers between the two reviewers (ADR-042, ADR-043, ADR-044 in [[specification]]).
- The PRISMA 2020 flow per identification source in `generated/prisma-flow/`, with the declared deviation for items 6 and 7 and the recommended paper wording in [[standards#Identification and selection reporting]].
- The methodological basis of the literature analysis ([[analysis-methods]]), explicit field states and analysis coverage ([[data#Analysis field states and coverage]]), the descriptive mapping tools ([[methods#Descriptive mapping and process diagnostics]]) and the rebuilt public Evidence Companion ([[specification#Public Evidence Companion]]).
- Bounded file names and the 120-character limit for tracked paths ([[data#File naming and path length]]).
- The draft codebook amendment v1.4 ([[codebook-v1.4-proposal]]) and an answer draft for SQ1 over grounded Assertions in [sq1-use.md](../research-vault/40_output/literature-report/sq1-use.md).

On 2 October 2026 the analysis-coding run under codebook 1.4.1 coded the included works with full text that had no 1.4 coding and integrated them into the agent track ([[update-protocol#Coding run of 2 October 2026]]). The UI fixes of the plan and of the independent acceptance review of the result site are merged into `main` ([[plan#UI development]]).

The rebuilt and self-tested reviewer path is merged into `main` and pushed. Reviewers start PRISM with `start-prism.cmd`, which needs Python alone and changes no tracked file, the local server writes their files without a folder step (ADR-047), formal exclusions need no Paper Beleg (ADR-048), the save action sits in the assessment panel, and the `Offen` list puts full texts first. The interface and rule decisions are provisional in [[plan#Decisions taken]], and the self-test is recorded in [[testing#Run of 2 October 2026]]. The Wissensnetz, Kategorien and Landkarte corrections of `ui-evidence-map` and the recode branch `recode-v13-works` are merged as well, and further work on `ui-evidence-map` continues in the worktree `FemPrompt_ui`.

The Zotero organisation and subsequent source-reviewed curation approved on 3 October 2026 have been applied and fully read back. Source-backed metadata corrections, additive thematic membership, reciprocal publication relations and the recovered Gemini provenance are documented in Zotero. Existing item keys, attachments and historical notes remain intact. The committed raw export stays unchanged, while hash-bound corrections and explicit current provenance reconcile the local project data. Unresolved source identities remain marked. Identifier changes that would migrate research identities are deferred locally, and the selected arXiv record for *Towards a Feminist Metaethics of AI* carries a synthesis hold because its bound text identifies the ACM conference version. [[methods#Source-reviewed bibliographic curation]] and [[data#Bibliographic correction and provenance projections]] describe the evidence and limits. Manual full-text downloads remain assigned to the colleague, who adds the files to Zotero.

The curation changes and subsequent knowledge clarification are on `codex/zotero-curation` and await operator integration into `main`. They have not been deployed. [[data#Conditions for using the literature]] distinguishes source preparation, eligible interim coding and scholarly use. The remaining bibliographic discrepancies are named in [[data#Bibliographic questions requiring reconciliation]]. Existing summary text, historical annotations and canonical record identities were preserved in the verified projection.

## Continuation point

1. Accept or revise the provisional decisions of 2 October in [[plan#Decisions taken]], give the second reviewer write access to the repository and retain the reminder that the colleague supplies missing full texts through Zotero under decision 21. A fresh clone of `main` carries the reviewer start.
2. The two reviewers screen their assigned open papers in PRISM, started with `start-prism.cmd` in a local clone, following the README and `docs/help.html#prism`. A first guided session with each is the remaining usability check. Then the operator review on the phone.
3. The domain experts take the spot checks in each run's `spot-check-sample.json` and decide the human and agent decision divergences the completion package lists.
4. Preserve duplicate records and annotations. Later analysis must count each established underlying work once under the clarified decision in [[plan#Source and corpus readiness]]. The current Stable Diffusion identity check is documented in [[data#Stable Diffusion source-identity check of 21 October 2026]]. Other source-Version and recoding work requires its existing separate assignment.
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

The knowledge refactoring of the evening of 1 October 2026 ran `npm run build` and `npm run check` on its branch. The other verification rounds of the day are recorded with their scope in the [[journal]] entries of 1 October. These checks establish technical behaviour, not domain-expert acceptance. No record, Assertion or output carries domain-expert verification ([[verification]]). The curation baseline passed the complete build, project check and screening browser pilot on 3 October 2026. Those checks establish the bounded technical result and preserved historical knowledge. [[verification]] records its authority limits. The native browser folder-permission check and the expert acceptance session remain open.
