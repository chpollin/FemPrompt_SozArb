# SozArb Research Vault - Web Viewer

Web-based interface for exploring the SozArb literature research corpus.

## Features

### 📚 Papers Browser
- Browse all 264 research papers
- Full-text search (title, author, abstract)
- Multi-dimensional filtering:
  - PRISMA Decision (Include/Exclude/Unclear)
  - Relevance Level (High/Medium/Low)
  - Summary Availability
- Sort by relevance, year, or author
- Click any paper for detailed view

### 📊 Dimensions Dashboard
- Visual statistics and charts
- 5 relevance dimensions:
  1. AI Literacy & Competencies
  2. Vulnerable Groups & Digital Equity
  3. Bias & Discrimination Analysis
  4. Practical Implementation
  5. Professional/Social Work Context
- Decision breakdown (Include/Exclude/Unclear)
- Relevance distribution

### 🕸️ Network Graph
- Interactive visualization of paper relationships
- Papers connected by relevance similarity
- Filter by decision and relevance
- Click nodes to view paper details
- Color-coded by PRISMA decision:
  - 🟢 Green = Include
  - 🔴 Red = Exclude
  - 🟠 Orange = Unclear

## Quick Start

### Local Development

1. **Open with Live Server:**
   ```bash
   # Using VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

2. **Or use Python:**
   ```bash
   cd docs
   python -m http.server 8000
   # Open http://localhost:8000
   ```

### GitHub Pages

Deploy to GitHub Pages:

1. Push to GitHub
2. Go to: Repository Settings → Pages
3. Source: Deploy from branch `main`, folder `/docs`
4. Save
5. Access at: `https://[username].github.io/[repo-name]/`

## Data

### Generated Files

The data is auto-generated from the Obsidian vault:

```bash
# Regenerate data from vault
python analysis/export_vault_to_web_data.py
```

**Output:**
- `data/research_vault.json` - All papers with metadata (442 KB)
- `data/graph_data.json` - Network graph data (348 KB)
- `data/statistics.json` - Aggregate statistics (8 KB)

### Data Structure

Each paper includes:
- **Identification:** Title, authors, year, DOI
- **Assessment:** PRISMA decision, exclusion reason
- **Relevance Scores:** 5 dimensions (0-3 scale), total (0-15)
- **Categorization:** Relevance level, top dimensions
- **Content:** Abstract, summary status
- **Tags:** Auto-generated from assessment

## File Structure

```
docs/
├── index.html              # Main application
├── css/
│   └── research.css        # Styles
├── js/
│   └── research-app.js     # Application logic
├── data/
│   ├── research_vault.json # Papers data
│   ├── graph_data.json     # Network data
│   └── statistics.json     # Stats
└── README.md               # This file
```

## Design

Professional academic interface with neutral color palette.

- **Color scheme:** Neutral grays with professional blue accent
- **Typography:** Inter font family for clean readability
- **Icons:** FontAwesome 6.5.1 (no emojis)
- **Layout:** Responsive grid, max-width 1400px
- **Accessibility:** WCAG AA compliant

See [DESIGN.md](DESIGN.md) for complete design system documentation.

## Tech Stack

- **Vanilla JavaScript** (ES6+)
- **CSS3** with CSS Variables
- **vis-network** 9.1.6 - Graph visualization
- **Chart.js** 4.4.0 - Statistics charts
- **Fuse.js** 7.0.0 - Fuzzy search
- **FontAwesome** 6.5.1 - Icon library
- **No build step** - Direct browser execution

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Statistics

- **Total Papers:** 264
- **With AI Summaries:** 83 (31%)
- **Include:** 215 (81%)
- **High Relevance:** 92 (35%)
- **Graph Nodes:** 264
- **Graph Edges:** 896

## Updates

To update the web viewer with new data:

1. **Add/update papers in Obsidian vault**
2. **Re-export data:**
   ```bash
   python analysis/export_vault_to_web_data.py
   ```
3. **Refresh browser** (no rebuild needed)

## Development

### Modifying Styles

Edit `css/research.css`. Changes reflect immediately (refresh browser).

### Modifying Logic

Edit `js/research-app.js`. Changes reflect immediately (refresh browser).

### Adding Features

The app uses a simple event-driven architecture:
- Load data on init
- Render based on state
- Re-render on filter/search changes

### Performance

- Lazy loading: Graph only initializes when tab is viewed
- Efficient filtering: Uses array methods, no DOM manipulation
- Search: Fuse.js provides fast fuzzy search

## License

Part of the FemPrompt_SozArb research project.

## Generated

- **Date:** 2025-11-10
- **Source:** SozArb_Research_Vault (Obsidian)
- **Export Script:** `analysis/export_vault_to_web_data.py`
