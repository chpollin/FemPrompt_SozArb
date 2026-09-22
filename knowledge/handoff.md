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
updated: 2026-09-22
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code
related: [INDEX, plan, journal, governance, verification, testing]
---

# Handoff

## Current result

Continue on `main`, tracking `origin/main`. On 22 September 2026 the operator requested all completed work on `main`. The provenance refactor, knowledge curation and laptop handoff were integrated by fast-forward from `refactor/provenance-readiness`, preserving the preceding repository consolidation and source-preparation history. No result-site deployment was performed during this work.

The technical refactor and repository knowledge curation are complete within their recorded scope. The literature review, full-corpus preparation and manuscript remain unfinished. [[plan]] owns remaining work, [[verification]] owns the evidence and authority register, and [[journal]] preserves the detailed decision history.

## Agreed goals and remaining work

The following goals describe the project rather than completed achievements. Current item-level evidence lives in the [completion package](../generated/completion/README.md) and `generated/literature-readiness.json`.

| Goal | Established work | Remaining work and canonical owner |
|---|---|---|
| Make the AI-assisted research process traceable | Governed runs distinguish human, AI-agent and software contributions. Review projections retain attribution, scope and source identities | Implement human review of individual statements or fields, with content and evidence dependencies. [[governance]] and [[plan#Provenance and verification alignment]] |
| Prepare the intended literature corpus | Zotero imports, canonical membership, Work-Version identities and source-backed metadata corrections are recorded | Resolve remaining source access, identity, exact reading-Version and conversion gaps. [[plan#Source and corpus readiness]] |
| Provide reliable reading material and source-specific knowledge | Checked representations, attributed active distillates and independent source-review receipts exist for a subset | Complete the intended coverage and retain explicit losses in figures, tables and formulas. [[research-vault]] and [[data#Knowledge-document coverage]] |
| Annotate the corpus with source evidence | The agent workflow provides isolated coding, deterministic PRISM transfer and separate AI Agent Review | Process newly source-ready works and unresolved or invalidated coding. [[update-protocol#Agent-assisted completion]] |
| Provide PRISM as a usable research tool | Reading, evidence capture, correction, storage, export and reload have technical test coverage | Implement field-level verification and conduct an acceptance session with domain experts. Native folder permission and physical saving still need the manual environment check. [[specification]] and [[testing#Manual acceptance boundary]] |
| Compare prompting techniques and their evidence | Controlled analysis fields, descriptive tables and initial source-linked Assertions exist | Compare proposed, demonstrated and evaluated uses across tasks and study conditions. [[research-vault#Comparative synthesis scope]] |
| Analyse bias, harms and mitigation | Coding vocabulary and preliminary descriptive projections exist | Develop source-grounded comparisons of harm mechanisms, intervention points, reported effects and limitations. [[update-protocol#Analysis coding]] |
| Identify requirements specific to social work | Analysis fields cover populations, practice contexts and domain constraints | Synthesize institutional conditions, affected groups and gaps in general prompting guidance. [[project#Research questions]] |
| Enable and conduct domain-expert verification | Whole-record verification is implemented. Statement- or field-level verification is accepted as the target scope | Implement that scope and have experts verify the specific findings and interpretations used. Existing AI reviews confer no human authority. [[governance#Verification scope decision, 22 September 2026]] |
| Produce a source-grounded literature report | A report structure and initial grounded findings exist | Complete comparative synthesis, contradictory evidence and research gaps through the shared Assertion layer. `research-vault/40_output/literature-report/` |
| Finish the scholarly result paper | One canonical manuscript draft exists | Integrate the completed findings, verify substantive claims and interpretation, and obtain a decision on authorship, venue and final submission. `research-vault/40_output/paper/paper.md` |
| Make results reproducible with their actual review status | The build, round-one replay and policy-filtered preliminary AI-reviewed result projection are implemented | Define publication of mixed-authority content before changing the publisher. Preserve historical review and approval events. [[governance#Publication boundary]] and [[testing]] |

## Decisions to preserve

- Human verification may cover an individual statement or field. Acceptance applies only to the named content and its checked evidence basis. It does not verify the containing document or a derived interpretation automatically.
- The first analytical output is comparative literature synthesis. Reported findings, study conditions, contradictions and limitations can be prepared now. Practice recommendations require a separate decision and appraisal of study quality and transfer conditions.
- The substantive question answered by a field acceptance remains to be clarified, including faithful source coding and further scholarly interpretation. Publication of records containing differently reviewed parts also remains to be defined.
- Field-level verification is not yet implemented in PRISM. The current whole-record lifecycle and publication policy remain active. The proposal to remove an additional publication-approval step has not been implemented. Final manuscript submission remains an explicit human decision.
- The operator authorised additive Zotero writes and controlled source preparation on 21 September 2026. [[governance#Authorised additive Zotero import]] preserves the creation-only scope and credential boundaries. Existing-item corrections require their own scoped operation.

## Completed work to retain

- The additional FemPrompt worktrees were consolidated after preserving and comparing local source bytes. Their histories are retained. Full-text preparation shares registry inputs within each invocation, and knowledge aliases resolve by exact Work-Version identity.
- Source-backed bibliographic corrections and live Zotero additions were integrated while preserving historical raw records and annotation keys. Valid previous imports and reviews must not be repeated merely because older reports describe them as pending.
- Conversion-review projections retain recorded reviewer, time, scope and checked file identities in JSON and CSV. Candidate completion uses exact selected-Version identifiers, keeps observed library membership separate and withholds conflicting or ambiguous bindings.
- The knowledge curation removed completed tasks and duplicated instructions from the plan. Zotero commands now belong to [[methods#Zotero reconciliation and import]], authority to [[governance]], and evidence state to [[verification]]. Historical decisions retain their original meaning.
- The run `recovered-arxiv-sources-2-20260905` and the recorded correction batches are complete within their scope. [[update-protocol#Source-review clarification, 5 September 2026]] remains applicable. Research data, original annotations and review receipts were preserved.

## Continuation point

1. Restore the laptop checkout and run the checks below before interpreting missing generated files as research gaps.
2. Read [[plan#Source and corpus readiness]] with the current completion and literature-readiness inventories. Select unresolved items and inspect their actual source files and valid receipts before acquiring, converting or reviewing material again. In particular, documented formula and figure losses and exact reading-Version gaps remain real work.
3. Continue source preparation and knowledge-document coverage under [[plan#Controlled corpus completion]]. Screen eligible works under [[update-protocol#Agent-assisted completion]]. Source availability alone does not establish a completed annotation or review.
4. Continue the field-verification implementation under [[plan#Provenance and verification alignment]], preserving the existing whole-record path. Resolve the open review meaning and mixed-authority publication questions before treating them as settled requirements.
5. Prepare comparative analysis and source-linked Assertions using declared coverage and limitations. Domain experts must check the resulting scholarly claims before those claims receive human-verification status.

Bounded `gpt-5.6-sol` assignments can prepare sources or knowledge drafts for explicit record lists, while a separate reviewer checks source support. The lead owns shared registry and PRISM integration and verifies delegated results against real artifacts. Source or withdrawal holds under [[plan#Works with conflicts or holds]] remain active across affected aliases. AI corrections remain immutable sidecars, and future Zotero exports must be reconciled with `corpus/metadata_corrections.json`.

## Laptop checkout and local material

Run these commands in the existing FemPrompt repository. Inspect `git status` first and preserve any laptop-only changes before switching. If the local branch has diverged, inspect the differing commits instead of resetting it.

```powershell
git status
git fetch origin
git switch main
git pull --ff-only
```

Install missing build dependencies through [[testing#Clean-checkout verification]]. For a new environment that procedure includes `python -m pip install -r requirements-build.txt`, `npm ci` and `npx playwright install chromium`. With dependencies available, run:

```powershell
npm run build
npm run check
npm run preview
```

The build reconstructs ignored reading projections and needs no external API key. Open PRISM at `http://127.0.0.1:8870/prisma.html` and the Companion at `http://127.0.0.1:8870/index.html`. The generated result view is served at `/results/index.html`. Follow [[testing]] for additional checks appropriate to later changes.

| Material | Availability after checkout |
|---|---|
| Versioned code, project knowledge, research data, reviewed source representations and committed receipts | Retrieved through Git on the named branch |
| Generated reading layer, readiness inventories and local result site | Rebuilt by `npm run build` |
| Original PDFs and local acquisition evidence under `pipeline/`, `generated/pdfs/` and ignored portions of `generated/source-acquisition/` | Require a separate private transfer if absent on the laptop. Preserve relative paths and compare the relevant recorded hashes before source review |
| `generated/local-source-preservation/` and the private `refactor-preservation/` inventory in the Git common directory | Local preservation material, absent from an ordinary checkout. [[data#Local source preservation]] records its role |
| `generated/zotero-sync/`, local credentials and `.vault_cache/` | Not transferred by Git. Preserve private receipts separately, provision credentials locally when needed, and do not commit these materials |
| Personal Obsidian vault | A separate working copy requiring its own synchronization |

A successful build from versioned representations does not establish that original PDFs are available for further visual review. No private source transfer to the laptop was performed in this session. A change to `knowledge/project.md` requires a rebuild because it is a hash-bound build input.

## Pending personal-vault alignment

A task started in the personal Obsidian vault must update `Projects/SocialAI/SocialAI Literature Review und PRISM.md`. Replace the obsolete assertion that read-only PRISM has not reached local `main`, and align verification granularity and comparative synthesis with [[governance]] and [[research-vault]]. The local implementation and its tests are established. The deployed state was not checked during this handoff.

Check `Projects/SocialAI/Project Overview SocialAI.md` and `Projects/SocialAI/SocialAI Paper-Pipeline.md` against the same decisions. Preserve the final manuscript submission decision and the historical case study. These vault documents were read but remain unchanged under the outside-vault write boundary.

## Verification state

The implementation and knowledge curation passed the full build, freshness checks, JavaScript and Python suites and result-site browser tests. The consolidation also passed the Companion browser checks, PRISM pilot and tracked-only checkout reproduction. Targeted Python lint and formatting checks passed for the changed code. Independent review findings were corrected and the lead checked the resulting files. [[journal]] retains the distinct verification rounds.

Protected research inputs and review receipts retained their byte hashes. The documentation curation changed generated completion data only through the updated project-input fingerprint. Local reference checks and the prose self-check cover the revised knowledge documents. These checks establish technical behaviour and preservation, not domain-expert acceptance.

The native browser folder permission and physical-write check, expert usability acceptance and outstanding scholarly verification remain open. The earlier clean dependency installation reported an `undici` development-dependency advisory, recorded in [[journal]]. No dependency remediation, new human review or deployment was performed by this documentation work.
