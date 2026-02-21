# Working Rules for Claude AI Assistant

**Project:** Literature Review - AI Literacy & Bias in Social Work
**Last Updated:** 2026-02-21

---

## Project Context

Systematischer Literature Review zu **AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit.

**Ein Korpus (326 Papers), zwei Assessment-Tracks:**

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit |
| **LLM** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |

---

## File Organization Rules

### Important Files (Read These First)

When starting a new session, read these files to understand current state:

1. **knowledge/status.md** - Current state, pending tasks
2. **knowledge/methods-and-pipeline.md** - Methodology and technical documentation
3. **knowledge/README.md** - Documentation index

### Configuration Files (Don't Modify Unless Asked)

- `config/defaults.yaml` - Pipeline configuration
- `.env` - API keys (never commit this!)
- `requirements.txt` - Python dependencies

### Data Files (Read-Only Unless Explicitly Told)

- `corpus/zotero_export.json` - Bibliography metadata
- `assessment/llm-5d/output/*.xlsx` - Assessment results (5D, archived)
- Any files in `pipeline/pdfs/`, `pipeline/markdown/`, etc.

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
- Helper scripts in `assessment/llm-5d/`

### Files That Require Caution

- `pipeline/scripts/acquire_pdfs.py` - Core PDF acquisition
- `pipeline/scripts/distill_knowledge.py` - Knowledge extraction (API integration)
- `pipeline/scripts/generate_vault.py` - Vault generation

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

**Committing:**
- Commit frequently (after each logical change)
- Use clear, descriptive messages
- Format: `[type]: [description]` (e.g., `feat: add Excel input support`)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**What to commit:**
- Code changes
- Documentation updates
- Configuration changes
- NICHT: API keys or secrets
- NICHT: Generated data (PDFs, knowledge docs)
- NICHT: Test artifacts (`test_*.xlsx`, `acquisition_log.json`)

**Pushing:**
- Always use: `git push -u origin <branch-name>`
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

### LLM Assessment (assessment/llm-5d/)

- **Model:** Claude Haiku 4.5 (fast and cheap)
- **Cost:** ~$0.004 per paper (5D: $1.15/325, 10K: $1.44/326)
- **Success rate:** 100%
- **Output:** `assessment/llm-5d/output/assessment_llm.xlsx` (5D), `benchmark/data/llm_assessment_10k.csv` (10K)

### Knowledge Distillation (pipeline/scripts/distill_knowledge.py)

- **3-Stage Workflow:** Extract & Classify (LLM) → Format Markdown (lokal) → Verify (LLM)
- **Rate limiting:** Configurable delay between API calls (default: 1s)
- **Model:** Claude Haiku 4.5
- **Cost:** ~$0.028/Paper
- **Output:** `pipeline/knowledge/distilled/` (249 Dokumente)

### Vault Generation (pipeline/scripts/generate_vault.py)

- **Concept extraction:** Frequency threshold ≥2 (configurable)
- **Deduplication:** Use synonym mapping
- **Quality target:** 85/100 or higher

---

## Error Handling Rules

### API Errors

**HTTP 429 (Rate Limit):**
- Increase delay between API calls
- Implement exponential backoff
- Check API tier limits

**HTTP 403 (Access Denied):**
- Check API key validity
- Verify permissions

### Data Errors

**NaN/None Values:**
- Always check `isinstance(value, str)` before regex operations
- Handle missing data gracefully (use empty string defaults)

**File Not Found:**
- Verify paths are absolute, not relative
- Check file existence before reading
- Provide clear error messages to user

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

### Documentation Updates

**When updating docs:**
- Update "Last Modified" date
- Use date format `*Aktualisiert: YYYY-MM-DD*` for footers
- Add clear section headers
- Use tables for comparisons

---

## Key Innovations

1. **LLM-based PRISMA assessment** - Fully automated, 100% success rate
2. **5-dimensional relevance scoring** - Parametric, adaptable to other projects
3. **Hierarchical PDF acquisition** - 4 fallback strategies
4. **Human-LLM Benchmark** - Cohen's Kappa comparison

---

## Quick Reference

### First Actions in New Session

1. Read `knowledge/status.md`
2. Check git status: `git status`
3. Read recent commits: `git log -3`
4. Create todo list if multi-step task

### Before Committing

1. Verify all changes are intentional
2. Check `.gitignore` for test artifacts
3. Update documentation if needed
4. Write clear commit message
5. Push to correct branch

---

*This file is for Claude (me) only. Users should read README.md instead.*
