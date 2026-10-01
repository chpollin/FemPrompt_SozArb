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
related: [INDEX, plan, journal, project, analysis-methods, governance, verification, testing]
---

# Handoff

## Current result

The work of 1 October 2026 sits on the local branch `companion-redesign`, which starts from `main` at `57a311b`. The branch is neither pushed nor merged into `main`, so it exists only in the repository where it was created, and `origin/main` still carries the state of 22 September. The laptop branch `prepare-expert-verification` is unmerged as well. It is neither on `origin` nor in this repository, so its content is unknown here and it may conflict with `companion-redesign`. Pushing and merging both branches is open decision 3 in [[plan#Open decisions]].

The GitHub repository has been private since 1 October 2026. GitHub Pages stays public at https://chpollin.github.io/FemPrompt_SozArb/ and serves `docs/` from `main` as a legacy build, so it shows the state of `origin/main` including the internal working surfaces and not this branch. Links from public pages to the repository are dead for the public. The switch to `build/site/` is described in [[plan#Deployment]] and requires the operator's approval.

The branch carries the following changes, each documented at its canonical place.

- The substantive question is primary, with SQ1 Use, SQ2 Risks, SQ3 Practices and SQ4 Competences, and the methodological question is the second question of the paper ([[project#Research questions]]).
- The methodological basis of the literature analysis, with mapping and synthesis layers, analysis tiers and validation design ([[analysis-methods]]).
- Explicit field states and analysis coverage in the public data ([[data#Analysis field states and coverage]]) and repaired projection errors, recorded in the [[journal]] entries of 1 October.
- Descriptive mapping tools and agent-track process diagnostics ([[methods#Descriptive mapping and process diagnostics]]).
- The rebuilt public Evidence Companion on the result site ([[specification#Public Evidence Companion]]).
- An answer draft for SQ1 over grounded Assertions in [sq1-use.md](../research-vault/40_output/literature-report/sq1-use.md). Drafts for SQ2 to SQ4 were cancelled by the operator.

[[plan]] owns the remaining work and every open decision, [[verification]] the evidence and authority state, and [[journal]] the detailed history.

## Continuation point

1. Obtain the open decisions in [[plan#Open decisions]]. Decisions 1 to 3 gate the coding run, and decision 3 also gates bringing the branches together.
2. Once authorised, push `companion-redesign`, have the laptop push `prepare-expert-verification`, compare both against `main` and merge. Conflicts in knowledge documents resolve towards the current research questions in [[project]] and the decisions recorded in [[plan]].
3. Relabel the SQ tables to the current sub-questions under [[plan#Analysis tool follow-ups]].
4. Continue the SQ1 answer under step 4 of [[plan#Answering the research questions]], with the AI Agent Review of its Assertions and distillates for the included Works that lack one.
5. Start the independent acceptance review of the Evidence Companion under [[plan#UI development]].
6. Source preparation under [[plan#Controlled corpus completion]] does not wait for these decisions.

## Decisions to preserve

- The review delivers the evidence base. Recommendations found in the literature are reported as recommendations of their sources ([[project#Project goal]]).
- Human verification may cover an individual statement or field and applies only to the named content and its evidence basis. It is accepted but not implemented ([[governance#Verification scope decision, 22 September 2026]]). Since ADR-044 PRISM no longer offers the whole-record verification path of ADR-040.
- The round-one expert annotations are valid corpus decisions. The experts' scope is the 2026 intake and the agent-coded papers, which they screen without seeing the agent coding or the LLM assessment (ADR-044).
- The public Evidence Companion is the allowlisted result site from `build/site/` ([[governance#Publication boundary]]). Deployment, push and merge remain operator-gated.
- Additive Zotero writes are authorised under [[governance#Authorised additive Zotero import]]. Existing-item corrections need their own scoped operation.

## Checkout and local material

On the machine that holds `companion-redesign`, inspect the working tree first and preserve machine-local changes.

```powershell
git status
git fetch origin
git switch companion-redesign
```

On the other machine the branch becomes available only after the authorised push, through `git fetch origin` and `git switch --track origin/companion-redesign`. On the laptop, commit `prepare-expert-verification` before switching. If a local branch has diverged, inspect the differing commits instead of resetting it.

Install missing dependencies through [[testing#Clean-checkout verification]], then build, check and preview.

```powershell
npm run build
npm run check
npm run preview
```

The build reconstructs ignored reading projections and needs no external API key. PRISM opens at `http://127.0.0.1:8870/prisma.html`, the internal working application at `http://127.0.0.1:8870/index.html` and the result site with the Evidence Companion at `http://127.0.0.1:8870/results/index.html`. A change to `knowledge/project.md` requires a rebuild because it is a hash-bound build input.

| Material | Availability after checkout |
|---|---|
| Versioned code, project knowledge, research data, reviewed source representations and committed receipts | Retrieved through Git on the named branch |
| Generated reading layer, readiness inventories and local result site | Rebuilt by `npm run build` |
| Original PDFs and local acquisition evidence under `pipeline/`, `generated/pdfs/` and ignored parts of `generated/source-acquisition/` | Require a separate private transfer if absent. Preserve relative paths and compare the recorded hashes before source review. The open-access preprint reacquired on 22 September exists only on the laptop |
| `generated/local-source-preservation/`, `generated/zotero-sync/`, credentials and `.vault_cache/` | Not transferred by Git and never committed ([[data#Local source preservation]]). Group writes need a locally provisioned Zotero key |

## Verification state

The knowledge refactoring of 1 October 2026 ran `npm run build` and `npm run check` on the branch head. The other verification rounds of the day are recorded with their scope in the [[journal]] entries of 1 October. These checks establish technical behaviour, not domain-expert acceptance. No record, Assertion or output carries domain-expert verification ([[verification]]). The native browser folder-permission check and the expert acceptance session remain open.
