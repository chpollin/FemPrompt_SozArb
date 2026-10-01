# Working rules for FemPrompt SozArb

FemPrompt is a literature review on how social work professionals can use large language models responsibly for their tasks, framed by feminist AI literacies. The main question and the five sub-questions SQ1 to SQ5 live in [knowledge/project.md](knowledge/project.md), and [knowledge/INDEX.md](knowledge/INDEX.md) owns the glossary and knowledge navigation.

## Session entry

1. Read [knowledge/INDEX.md](knowledge/INDEX.md), [knowledge/handoff.md](knowledge/handoff.md) and the relevant work in [knowledge/plan.md](knowledge/plan.md).
2. Check `git status`, `git log -3` and the latest entry in [knowledge/journal.md](knowledge/journal.md). Verify state-dependent statements against the current files, not against other documents.
3. Read the canonical documents relevant to the change before editing. Record a concise execution plan for multi-step work using the current harness's available facilities.

In this project, `knowledge/handoff.md` is the rolling current-state and continuation record. This explicit local convention takes precedence over the generic Process Inbox convention.

| Work | Canonical entry |
|---|---|
| Review method, pipeline and script usage | [methods](knowledge/methods.md) |
| Analysis frame and the answer path per sub-question | [analysis methods](knowledge/analysis-methods.md) |
| PRISM, result site, architecture decisions and design system | [specification](knowledge/specification.md) |
| Corpus, Work-Version identity, schemas, file naming and local source storage | [data](knowledge/data.md) |
| Authority, corrections, rights and publication | [governance](knowledge/governance.md) |
| Setup, local preview, build and technical checks | [testing](knowledge/testing.md) |
| Evidence and scholarly verification state | [verification](knowledge/verification.md) |
| Reporting standards and the PRISMA flow | [standards](knowledge/standards.md) |
| Round-two intake, analysis coding and source review | [update protocol](knowledge/update-protocol.md) |
| Source-linked subject knowledge and manuscript | [research vault](knowledge/research-vault.md) |

## Division of labour

- Human reviewers screen in PRISM with the ten categories of `assessment/categories.yaml` and see no AI pre-assessment, neither the LLM proposal nor the agent record (ADR-044). The subject of an edit is the own record, else the consolidated expert decision of the earlier Excel workflow as a prefilled draft, else an empty draft. Expert decisions count as done.
- The open papers are split between the two reviewers in `docs/data/screening/assignment.json`, which is append-only and is no reviewer file (ADR-043). Each person writes one reviewer file `docs/data/screening/<key>.json`.
- PRISM has the modes `Lesen` and `Bearbeiten`. `Bearbeiten` exists only in a local clone with a built reading layer, opened in Chrome or Edge (ADR-042). PRISM offers no human verification or approval action, and existing verification entries stay readable (ADR-040, ADR-044).
- The analysis fields (`AN_*`) are coded by AI agents in operationally isolated runs with a separate source-grounded AI Agent Review, following [update protocol](knowledge/update-protocol.md) and `skills/prism-agent-review/`. Agent runs stay reference-blind. The agent track never becomes the subject of a human session. PRISM still asks a human reviewer for analysis coding on an Include (FR-14), and whether that step is withdrawn is an open decision in [plan](knowledge/plan.md#open-decisions).
- Domain experts hold final scholarly authority. Technical validation and AI Agent Review grant no human verification or publication approval ([governance](knowledge/governance.md)).

## Research and publication boundaries

- Follow [governance](knowledge/governance.md) and `config/publication_policy.json`. The explicitly authorised preliminary release carries attributed AI source review.
- The repository is private. `main` is the integration branch. GitHub Pages still serves `docs/` from `main`, and the switch to the allowlisted result site in `build/site/` is an open operator decision ([plan](knowledge/plan.md#deployment)). Deployment requires the operator's instruction.
- Full texts stay in the private repository by operator decision of 1 October 2026. The reading layer `docs/data/fulltext/` and its manifest are git-ignored and rebuilt by `npm run build` from the tracked `generated/markdown_clean/`, so every clone can read papers after a build. Full texts are never part of the Pages site or the result site.
- Preserve historical annotations and source identity. Corrections follow the hash-bound sidecar and review-receipt contracts. Resolve a changed export deliberately against existing metadata corrections. Changing the source-binding rule needs the operator's explicit permission ([plan](knowledge/plan.md#open-decisions)).
- Treat `generated/distilled/`, including its stage-one JSON and verification records, as historical read-only research material. The legacy `research-vault/10_distillates/` and `20_claims/` are read-only migration sources. New active material follows the [research-vault contract](knowledge/research-vault.md).
- Preserve local sources under `pipeline/` and `generated/local-source-preservation/` according to [local source preservation](knowledge/data.md#local-source-preservation). They are excluded from Git. A clean Git status does not establish that local data can be deleted. Leave `.vault_cache/` intact.
- Change prompts through a recorded prompt version or status change.
- The canonical manuscript draft is `research-vault/40_output/paper/paper.md`. Its target is the Adult Literacy Education special issue in [project](knowledge/project.md#publication-context), and its architecture is an open decision in [plan](knowledge/plan.md#open-decisions). The earlier Forum Wissenschaft 2/2026 paper is editorially closed and maintained outside the repository.

## Implementation rules

- Read the actual callers and data flow before changing shared behavior. Preserve existing files and modules where they serve the task.
- Keep the frontend as vanilla JavaScript without a frontend bundler or runtime framework. The Python build produces data projections and the result site. These are separate parts of the architecture.
- Use IIFE modules through `window.EC`, the existing design tokens (`pt-*` in PRISM, `docs/css/tokens.css` for the result site and the working application) and pinned local assets under `docs/vendor/`. System fonts avoid remote font requests. Apply the detailed [interface requirements](knowledge/specification.md).
- Head, header and footer of the pages listed in `src/publish/build_pages.py` are generated by that script. Every listed page carries the shared header, PRISM included, and PRISM has no footer. Edit the generator, never the markup. `docs/release.html`, the source of the result site, carries its own chrome.
- The result site and the views it shares with the working application follow the display rules in [specification](knowledge/specification.md#epistemic-display-rules). A cell or edge states joint coding in the same Work, never a relation, the coded-Works denominator stands above every result, a work-level status is never attributed to one technique or stage, and recommendations are reported as those of their source.
- The optional Knowledge Chat retains its explicit-request and tab-scoped key contract in [specification](knowledge/specification.md). Never commit credentials or contact the provider before the user requests a response.
- Use `pathlib.Path` and UTF-8 for Python. Preserve the existing script-pipeline layout for bounded edits. Use the established long-path and canonical-text-hash helpers where required. Derive title-based file names through `src/file_naming.py` and keep tracked paths within 120 characters, which `tests/test_path_length.py` enforces ([data](knowledge/data.md#file-naming-and-path-length)).
- Category definitions come from `assessment/categories.yaml`. Change the source and regenerate its projections rather than editing `docs/data/category_schema.json` directly.
- Generated artifacts are changed through their generators. Inspect input and output fingerprints after a source edit. `knowledge/project.md` is also a build input.

## Change verification and Git

- Run `npm run build` and then `npm run check` before committing a change to code, data or build inputs. Run `python -m src.publish.check_claims` when the claims layer changes and `npm run pilot` before integrating changes to the screening path. Apply the additional change gates in [testing](knowledge/testing.md).
- A build on Windows can leave line-ending-only drift in `docs/` or data files. Discard it with `git checkout -- <path>` and never commit it.
- `main` is the integration branch. Do substantial work on a branch or worktree off `main` and leave merging to the operator. Commit coherent verified changes with an imperative English message. Stage specific paths. Merges, pushes and deployment require the operator's instruction. Never force-push `main`.
- Never commit credentials, source PDFs, browser output or `.vault_cache/`. A new full-text representation requires source-specific rights and conversion provenance. Governed reviewer records and reproducibility manifests are research data and may be committed after their validation gates pass.

## Documentation

- Write repository documentation and code in English. The user-facing pages under `docs/` and the interface labels they describe stay German. The journal retains its bilingual history. Apply the operator's prose style and use no emojis.
- Keep one canonical owner for each subject and link to it. Update the responsible knowledge document and add one compact journal entry for each substantive session.
- Authored knowledge documents carry `title`, `project`, `method`, `status`, `created` and `updated`. Preserve the repository's shared `version` convention. Document maturity does not declare research completion.
- Keep volatile quantities in their generated data and views. Describe findings qualitatively in durable prose. Dates and quantities in historical journal entries remain part of their original record.

## Interpretation and compatibility constraints

- Historical benchmark values before the Zotero-key pairing correction are superseded. Use the canonical benchmark data and [divergence analysis](knowledge/analysis-divergence.md). The agreement output's `meta.total_papers` denotes the union of assessment tracks rather than the corpus.
- A reviewer record seeded from the expert decision is a confirmation of that decision, never a second independent human track (ADR-042). Only records formed without the agent coding and the LLM assessment enter an agreement analysis against them (ADR-044).
- Source matching uses the established cascade and explicit Work-Version bindings. Filename similarity alone grants no source identity. Category interpretation remains a research decision under [methods](knowledge/methods.md).
- Data quirks and rendering details live with their canonical owner, see [data](knowledge/data.md) and the design system in [specification](knowledge/specification.md). Windows `nul` is a reserved device name and must not enter the tracked tree.
