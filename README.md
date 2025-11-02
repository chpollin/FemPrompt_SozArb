# FemPrompt & SozArb Research Pipeline

**AI-Assisted Literature Research System for Bias and Intersectionality Analysis**

Automated, end-to-end pipeline for systematic literature discovery, intelligent PDF acquisition, and knowledge graph generation using Claude AI.

---

## Projects

### FemPrompt (326 papers)
Feminist AI literacies and bias mitigation research
**Status:** Complete ✅

### SozArb (325 papers) - Current
AI literacy in social work for vulnerable populations
**Status:** LLM assessment complete (208 Include, 84 Exclude, 33 Unclear)

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Run complete pipeline
python run_pipeline.py
```

**Duration:** ~6-9 hours for 208 papers | **Cost:** ~$7-9 (Claude Haiku 4.5)

---

## Documentation

**→ All documentation is in the [`knowledge/`](knowledge/) folder:**

| File | Content |
|------|---------|
| **[00_README.md](knowledge/00_README.md)** | Documentation overview (start here) |
| **[01_QUICKSTART.md](knowledge/01_QUICKSTART.md)** | Installation & examples |
| **[02_TECHNICAL.md](knowledge/02_TECHNICAL.md)** | Complete technical reference |
| **[03_STATUS.md](knowledge/03_STATUS.md)** | Current project status |
| **[04_JOURNAL.md](knowledge/04_JOURNAL.md)** | Development log |
| **[05_CLAUDE_RULES.md](knowledge/05_CLAUDE_RULES.md)** | AI assistant rules |

**German documentation:** `knowledge/Projekt.md`, `Theorie.md`, `Methodik.md`, etc.

---

## Key Features

- **LLM-Based PRISMA Assessment** - 100% automated, $0.002/paper
- **Excel Input Support** - Direct .xlsx reading
- **Hierarchical PDF Acquisition** - 8 fallback strategies, 70-80% success
- **AI Summarization** - Claude Haiku 4.5, ~$0.03-0.04/document
- **Knowledge Graph Generation** - Obsidian-compatible vault

---

## License & Citation

[Add license here]

**Last Updated:** 2025-11-02
