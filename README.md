# FemPrompt & SozArb Research Pipeline

**AI-Assisted Literature Research System with Feminist Epistemology**

Automated, end-to-end research pipeline for systematic literature discovery, intelligent PDF acquisition, and knowledge graph generation. Combines multi-model deep research with LLM-based PRISMA assessment and enhanced summarization.

---

## Projects

### 1. FemPrompt (326 papers) ✅
- **Focus:** Feminist AI literacies and bias mitigation
- **Status:** Complete (vault generated, 35 concepts)

### 2. SozArb (325 papers) 🔄
- **Focus:** AI literacy in social work for vulnerable populations
- **Status:** 75 enhanced summaries (v2.0), 144 concepts, web viewer operational

---

## Quick Start

```bash
# Clone & install
git clone <repo-url>
cd FemPrompt_SozArb
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Run LLM assessment
python assessment-llm/assess_papers.py --input papers.xlsx --output assessment.xlsx

# Run complete pipeline
python run_pipeline.py --project sozarb --stages all
```

**Results:** 325 papers assessed in 24 min ($0.58), 75 summaries (76.1/100 avg quality), $3.73 total cost.

---

## Documentation

**Complete documentation is in [`knowledge/`](knowledge/)**

📖 **Start here:** [knowledge/README.md](knowledge/README.md) - Documentation index

**Key documents:**
- [STATUS.md](knowledge/STATUS.md) - Current project status & next steps
- [QUICKSTART.md](knowledge/QUICKSTART.md) - Detailed setup & first steps
- [TECHNICAL.md](knowledge/TECHNICAL.md) - Complete technical reference
- [COMPLETE_GUIDE.md](knowledge/COMPLETE_GUIDE.md) - Full pipeline guide
- [PROJECT_OVERVIEW.md](knowledge/PROJECT_OVERVIEW.md) - Research questions (German)
- [THEORETICAL_FRAMEWORK.md](knowledge/THEORETICAL_FRAMEWORK.md) - Feminist epistemology

---

## Features

### 🤖 Multi-Model Deep Research
4 LLMs (Claude, Gemini, ChatGPT, Perplexity) for literature discovery

### 📊 LLM-Based PRISMA Assessment
100% automated, 5-dimensional relevance scoring (0-3 scale)

### 🔍 Enhanced Summarization v2.0
- Multi-pass reading (100% paper coverage)
- Cross-validation with quality metrics (Accuracy, Completeness, Actionability)
- Stakeholder-specific practical implications
- Limitations & open questions documented

### 🧠 Knowledge Graph Generation
Obsidian vaults with bidirectional concept links, MOCs, web viewer

### 🔬 Markdown Quality Validation
Corruption detection before expensive AI processing (~$7.50 savings/file)

---

## Repository Structure

```
FemPrompt_SozArb/
├── knowledge/              # 📚 Complete documentation (START HERE!)
├── analysis/               # Core pipeline scripts
├── assessment-llm/         # LLM-based PRISMA assessment
├── SozArb_Research_Vault/  # Generated Obsidian vault (266 papers, 75 summaries)
├── docs/                   # Web viewer (interactive network visualization)
└── run_pipeline.py         # Master orchestrator
```

---

## Performance

**For 222 Include papers (SozArb):**
- LLM Assessment: 24 min, $0.58
- Enhanced Summarization: ~3 hours, ~$3.15
- Total: ~6-9 hours, ~$7-9

**Model:** Claude Haiku 4.5 (cost-efficient, fast, high-quality)

---

## Current Status

**FemPrompt:** ✅ Complete
**SozArb:** 🔄 75/222 papers processed with Enhanced v2.0

See [knowledge/STATUS.md](knowledge/STATUS.md) for detailed status & next steps.

---

## Citation

If you use this pipeline in your research, please cite:

```bibtex
@software{femprompt_sozarb_2025,
  title = {FemPrompt \& SozArb: AI-Assisted Literature Research Pipeline},
  author = {[Your Name]},
  year = {2025},
  url = {https://github.com/[username]/FemPrompt_SozArb}
}
```

---

## License

[Specify license]

---

**Documentation:** [knowledge/README.md](knowledge/README.md)
**Technical Support:** [knowledge/TECHNICAL.md](knowledge/TECHNICAL.md)
**Issues:** Report bugs via GitHub Issues
