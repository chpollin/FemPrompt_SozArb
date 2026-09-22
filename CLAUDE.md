# Working rules for FemPrompt SozArb

FemPrompt is a literature review on feminist AI literacies in social work. Project identity and research questions live in [knowledge/project.md](knowledge/project.md), and [knowledge/INDEX.md](knowledge/INDEX.md) owns the glossary and knowledge navigation.

## Session entry

1. Read [knowledge/INDEX.md](knowledge/INDEX.md), [knowledge/handoff.md](knowledge/handoff.md) and the relevant work in [knowledge/plan.md](knowledge/plan.md).
2. Check `git status`, `git log -3` and the latest entry in [knowledge/journal.md](knowledge/journal.md). Verify state-dependent statements against the current files.
3. Read the canonical documents relevant to the change before editing. Record a concise execution plan for multi-step work using the current harness's available facilities.

In this project, `knowledge/handoff.md` is the rolling current-state and continuation record. This explicit local convention takes precedence over the generic Process Inbox convention.

| Work | Canonical entry |
|---|---|
| Review method, pipeline and script usage | [methods](knowledge/methods.md) |
| PRISM requirements, architecture decisions and design system | [specification](knowledge/specification.md) |
| Corpus, Work-Version identity, schemas and local source storage | [data](knowledge/data.md) |
| Authority, corrections, rights and publication | [governance](knowledge/governance.md) |
| Setup, local preview, build and technical checks | [testing](knowledge/testing.md) |
| Evidence and scholarly verification state | [verification](knowledge/verification.md) |
| Reporting standards | [standards](knowledge/standards.md) |
| Round-two intake, coding and source review | [update protocol](knowledge/update-protocol.md) |
| Source-linked subject knowledge and manuscript | [research vault](knowledge/research-vault.md) |

## Research and publication boundaries

- Follow [governance](knowledge/governance.md) and `config/publication_policy.json`. The explicitly authorised preliminary release carries attributed AI source review. Technical validation grants no human verification or publication approval.
- Build with `npm run build`, verify with `npm run check` and deploy only `build/site/`. The working application under `docs/` includes internal research surfaces and local reading assets. Deployment requires the operator's instruction.
- Preserve historical annotations and source identity. Corrections follow the hash-bound sidecar and review-receipt contracts. Resolve a changed export deliberately against existing metadata corrections.
- Treat `generated/distilled/`, including its stage-one JSON and verification records, as historical read-only research material. The legacy `research-vault/10_distillates/` and `20_claims/` are read-only migration sources. New active material follows the [research-vault contract](knowledge/research-vault.md).
- Preserve local sources under `pipeline/` and `generated/local-source-preservation/` according to [local source preservation](knowledge/data.md#local-source-preservation). They are excluded from Git. A clean Git status does not establish that local data can be deleted. Leave `.vault_cache/` intact.
- Change prompts through a recorded prompt version or status change. Follow `skills/prism-agent-review/` and its canonical prompt and run manifest for governed annotation work.
- The canonical manuscript is `research-vault/40_output/paper/paper.md`. The submitted Forum Wissenschaft 2/2026 paper is editorially closed and maintained on Google Docs. Remaining work belongs in [plan](knowledge/plan.md).

## Implementation rules

- Read the actual callers and data flow before changing shared behavior. Preserve existing files and modules where they serve the task.
- Keep the frontend as vanilla JavaScript without a frontend bundler or runtime framework. The Python build produces data projections and the result site. These are separate parts of the architecture.
- Use IIFE modules through `window.EC`, the existing `pt-*` design tokens and pinned local assets under `docs/vendor/`. System fonts avoid remote font requests. Apply the detailed [interface requirements](knowledge/specification.md).
- Head, header, navigation and footer of every page in `docs/` are propagated by `src/publish/build_pages.py`. Edit the generator, never the markup. PRISM carries the slim header and no footer (ADR-039).
- PRISM shows the round-one expert decision and the round-one LLM proposal as labelled references in human sessions. The takeover sets category levels only, never evidence, and agent runs stay reference-blind (ADR-038).
- The optional Knowledge Chat retains its explicit-request and tab-scoped key contract in [specification](knowledge/specification.md). Never commit credentials or contact the provider before the user requests a response.
- Use `pathlib.Path` and UTF-8 for Python. Preserve the existing script-pipeline layout for bounded edits. Use the established long-path and canonical-text-hash helpers where required. Truncate generated title components to 100 characters for Windows path compatibility.
- Category definitions come from `assessment/categories.yaml`. Change the source and regenerate its projections rather than editing `docs/data/category_schema.json` directly.
- Generated artifacts are changed through their generators. Inspect input and output fingerprints after a source edit. `knowledge/project.md` is also a build input.

## Change verification and Git

- Run `npm test` and `python -m pytest tests/` before committing. Run `python -m src.publish.check_claims` when the claims layer changes and `npm run pilot` before integrating changes to the screening path. Apply the additional change gates in [testing](knowledge/testing.md).
- Run `npm run build` before the integrated `npm run check` when build inputs change. The full-text reading layer under `docs/data/fulltext/` is rights-gated and git-ignored: rebuild it locally before freshness checks, and never assume a clone can read papers, a verification session needs a prepared project folder. Follow [clean-checkout verification](knowledge/testing.md#clean-checkout-verification).
- Branch off `main` for substantial work. Commit coherent verified changes with an imperative `type: description` message. Merges, pushes and deployment require the operator's instruction. Never force-push `main`.
- Never commit credentials, licensed source PDFs or full texts, browser output or `.vault_cache/`. A reviewed open-access representation requires source-specific rights and conversion provenance. Governed reviewer records and reproducibility manifests are research data and may be committed after their validation gates pass.

## Documentation

- Write repository documentation and code in English. The user-facing pages under `docs/` and the interface labels they describe stay German. The journal retains its bilingual history. Apply the operator's prose style and use no emojis.
- Keep one canonical owner for each subject and link to it. Update the responsible knowledge document and add one compact journal entry for each substantive session.
- Authored knowledge documents carry `title`, `project`, `method`, `status`, `created` and `updated`. Preserve the repository's shared `version` convention. Document maturity does not declare research completion.
- Keep volatile quantities in their generated data and views. Describe findings qualitatively in durable prose. Dates and quantities in historical journal entries remain part of their original record.

## Interpretation and compatibility constraints

- Historical benchmark values before the Zotero-key pairing correction are superseded. Use the canonical benchmark data and [divergence analysis](knowledge/analysis-divergence.md). The agreement output's `meta.total_papers` denotes the union of assessment tracks rather than the corpus.
- Source matching uses the established cascade and explicit Work-Version bindings. Filename similarity alone grants no source identity. Category interpretation remains a research decision under [methods](knowledge/methods.md).
- Data quirks and rendering details live with their canonical owner, see [data](knowledge/data.md) and the design system in [specification](knowledge/specification.md). Windows `nul` is a reserved device name and must not enter the tracked tree.
