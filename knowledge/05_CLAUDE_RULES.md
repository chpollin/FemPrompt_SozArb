# Working Rules for Claude AI Assistant

**Project:** FemPrompt & SozArb - Literature Research Pipeline
**Last Updated:** 2025-11-02

---

## Project Context

This repository contains TWO related projects:

1. **FemPrompt** (326 papers) - Feminist AI literacies and bias mitigation
2. **SozArb** (325 papers) - AI literacy in social work and vulnerable populations

Both use the same automated pipeline for literature processing.

---

## File Organization Rules

### Important Files (Read These First)

When starting a new session, read these files to understand current state:

1. **CURRENT_STATUS.md** - Current state, pending tasks, blockers
2. **TECHNICAL.md** - Complete technical documentation
3. **README.md** - Project overview
4. **assessment-llm/README.md** - LLM assessment system guide

### Configuration Files (Don't Modify Unless Asked)

- `pipeline_config.yaml` - Pipeline configuration
- `.env` - API keys (never commit this!)
- `requirements.txt` - Python dependencies

### Data Files (Read-Only Unless Explicitly Told)

- `analysis/zotero_vereinfacht.json` - Bibliography metadata
- `assessment-llm/output/*.xlsx` - Assessment results
- Any files in `analysis/pdfs/`, `analysis/markdown_papers/`, etc.

---

## Code Modification Rules

### When Modifying Python Scripts

1. **Always read the file first** before editing
2. **Test changes** with small datasets before full runs
3. **Update documentation** if you change functionality
4. **Add comments** for complex logic
5. **Preserve existing error handling**

### Files You Can Modify Freely

- Documentation (`.md` files)
- Test scripts (`test_*.py`)
- Helper scripts in `assessment-llm/`

### Files That Require Caution

- `analysis/getPDF_intelligent.py` - Core PDF acquisition (complex fallback logic)
- `analysis/summarize-documents.py` - API integration (rate limiting critical)
- `run_pipeline.py` - Master orchestrator (many dependencies)

---

## Working Conventions

### Todo List Management

**ALWAYS use TodoWrite** for:
- Multi-step tasks (3+ steps)
- Long-running operations
- Tasks with dependencies
- User requests with multiple items

**Update todos in real-time:**
- Mark `in_progress` BEFORE starting work
- Mark `completed` IMMEDIATELY after finishing
- Only ONE task `in_progress` at a time

### Git Workflow

**Branch naming:** `claude/[task-description]-[session-id]`
**Current branch:** `claude/analyze-repo-011CUj446onqiYta2ftSj82C`

**Committing:**
- Commit frequently (after each logical change)
- Use clear, descriptive messages
- Format: `[type]: [description]` (e.g., `feat: add Excel input support`)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**What to commit:**
- ✅ Code changes
- ✅ Documentation updates
- ✅ Configuration changes
- ❌ API keys or secrets
- ❌ Generated data (PDFs, summaries)
- ❌ Test artifacts (`test_*.xlsx`, `acquisition_log.json`)

**Pushing:**
- Always use: `git push -u origin <branch-name>`
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) if network errors
- NEVER force push to main/master

### File Creation Rules

**NEVER create files unless:**
- Explicitly requested by user
- Absolutely necessary for the task
- Part of pipeline output (summaries, vault)

**ALWAYS prefer:**
- Editing existing files over creating new ones
- Updating documentation in place
- Using existing templates

---

## Pipeline-Specific Rules

### PDF Acquisition (getPDF_intelligent.py)

- **Excel input:** Preferred over JSON (no conversion needed)
- **Filtering:** Use `--filter-decision Include` for PRISMA-filtered acquisition
- **Testing:** Always test with 3-5 papers before full run
- **Error handling:** Check `acquisition_log.json` and `missing_pdfs.csv`

### LLM Assessment (assessment-llm/)

- **Model:** Claude Haiku 4.5 (fast and cheap)
- **Cost:** ~$0.002 per paper
- **Success rate:** Target 100% (retry on failures)
- **Output:** Always save to `output/assessment_llm_run[N].xlsx`

### Summarization (summarize-documents.py)

- **Rate limiting:** 2-second delay between API calls (configurable)
- **Retries:** Implement exponential backoff for 429 errors
- **Model:** Claude Haiku 4.5 (default), Sonnet 4.5 (better quality)
- **Cost monitoring:** Track cost per document (~$0.03-0.04)

### Vault Generation (generate_obsidian_vault_improved.py)

- **Concept extraction:** Frequency threshold ≥2 (configurable)
- **Deduplication:** Use synonym mapping (182 entries)
- **Quality target:** 85/100 or higher

---

## Error Handling Rules

### API Errors

**HTTP 429 (Rate Limit):**
- Increase delay in `summarize-documents.py`
- Implement exponential backoff
- Check API tier limits

**HTTP 403 (Access Denied):**
- Check API key validity
- Verify permissions (especially for Zotero group libraries)
- Try alternative methods (CSV export, local execution)

### Data Errors

**NaN/None Values:**
- Always check `isinstance(value, str)` before regex operations
- Handle missing data gracefully (use empty string defaults)

**File Not Found:**
- Verify paths are absolute, not relative
- Check file existence before reading
- Provide clear error messages to user

### Pipeline Failures

**Partial Completion:**
- Use checkpoint system (`--resume` flag)
- Log progress to `.pipeline_status.json`
- Report which stage failed and why

---

## Communication Rules

### User Communication

**Be concise and direct:**
- No unnecessary superlatives or praise
- Focus on facts and problem-solving
- Provide objective technical information

**When reporting progress:**
- State what was done
- Show measurable results (numbers, percentages)
- Mention any blockers or issues
- Suggest next steps

**When asking for clarification:**
- Be specific about what you need to know
- Provide context for why you're asking
- Offer alternatives if applicable

### Documentation Updates

**When updating docs:**
- Update "Last Modified" date
- Increment version number if major changes
- Add clear section headers
- Use tables for comparisons
- Include code examples for technical steps

---

## Project-Specific Knowledge

### Two Parallel Workflows

**FemPrompt (Original):**
- 326 papers in Zotero group 6080294
- Manual PRISMA assessment (Excel → Zotero tags)
- Obsidian vault: `FemPrompt_Vault/`
- Status: Full pipeline operational

**SozArb (Current):**
- 325 papers in Zotero group 6284300
- LLM-based PRISMA assessment (100% automated)
- Assessment complete: 208 Include, 84 Exclude, 33 Unclear
- Next: PDF acquisition → Markdown → Summaries → Vault
- Status: Assessment complete, PDF acquisition ready

### Key Innovations (Document These)

1. **LLM-based PRISMA assessment** - Fully automated, 100% success rate
2. **Excel input for getPDF_intelligent.py** - No JSON conversion needed
3. **5-dimensional relevance scoring** - Parametric, adaptable to other projects
4. **Hierarchical PDF acquisition** - 8 fallback strategies

### Reusability

This pipeline is **fully parametric** and can be adapted for:
- Different research questions
- Different assessment dimensions
- Different document types
- Different knowledge graph structures

When helping users adapt the pipeline:
- Point to example files (e.g., `prompt_template_EXAMPLE_SOCIAL_WORK.md`)
- Explain which parameters to change
- Provide cost and time estimates

---

## Quick Reference

### First Actions in New Session

1. Read `CURRENT_STATUS.md`
2. Check git status: `git status`
3. Check for uncommitted work
4. Read recent commits: `git log -3`
5. Create todo list if multi-step task

### Before Committing

1. Verify all changes are intentional
2. Check `.gitignore` for test artifacts
3. Update documentation if needed
4. Write clear commit message
5. Push to correct branch

### Before Answering User Questions

1. Read relevant documentation first
2. Search codebase for examples
3. Verify current state (don't assume)
4. Provide specific file paths and line numbers
5. Offer actionable next steps

---

## Special Instructions

### Don't Be Overly Cautious

- If you understand the task, proceed directly
- Don't ask for confirmation on routine tasks
- Use your judgment for minor documentation updates
- Trust the git history (you can always revert)

### Be Proactive

- Suggest improvements when you see issues
- Point out inconsistencies in documentation
- Offer to automate repetitive tasks
- Update outdated information without being asked

### Prioritize User Goals

- Technical accuracy > pleasing the user
- Objective truth > validating beliefs
- Working code > elegant code (unless explicitly asked)
- Clear documentation > comprehensive documentation

---

*This file is for Claude (me) only. Users should read TECHNICAL.md instead.*
