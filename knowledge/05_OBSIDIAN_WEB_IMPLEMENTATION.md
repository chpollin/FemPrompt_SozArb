# Obsidian-Web Implementierungsplan: Technische Umsetzung

**Erstellt:** 2025-11-06
**Basis:** [04_OBSIDIAN_WEB_STRATEGY.md](04_OBSIDIAN_WEB_STRATEGY.md)
**Ziel:** Step-by-Step Anleitung für Quartz v4 Deployment

---

## Übersicht: Was wird gebaut?

**Input:** FemPrompt_Vault/ (46 Markdown-Dateien, 16 Papers, 25 Concepts)
**Output:** https://chpollin.github.io/FemPrompt_SozArb/ (interaktive Webseite)
**Technologie:** Quartz v4 (statischer Site Generator für Obsidian)
**Hosting:** GitHub Pages (kostenlos)
**Aufwand:** 8-10 Stunden Setup + 2h/Woche Content-Erweiterung

---

## Phase 1: Environment Setup (1-2 Stunden)

### 1.1 Prerequisites installieren

**Node.js & npm:**
```bash
# Windows (mit winget)
winget install OpenJS.NodeJS.LTS

# Verifizieren
node --version  # Should be v18.x or v20.x
npm --version   # Should be v9.x or v10.x
```

**Git:**
```bash
# Bereits installiert, verifizieren:
git --version
```

**Optional: VS Code Extension für Markdown:**
- Markdown All in One
- Markdown Preview Enhanced

### 1.2 Quartz v4 klonen und initialisieren

```bash
cd c:\Users\Chrisi\Documents\GitHub\FemPrompt_SozArb

# Quartz als Submodule ODER in separatem Ordner
# Option A: Submodule (empfohlen)
git submodule add https://github.com/jackyzha0/quartz.git quartz
cd quartz
npm install

# Option B: Separate Installation (wenn Submodule Probleme macht)
cd ..
git clone https://github.com/jackyzha0/quartz.git FemPrompt_Web
cd FemPrompt_Web
npm install
```

**Erwartete Ausgabe:**
```
added 523 packages, and audited 524 packages in 45s
```

### 1.3 Quartz mit Vault verlinken

**Option A: Symlink (Windows PowerShell als Admin):**
```powershell
cd c:\Users\Chrisi\Documents\GitHub\FemPrompt_SozArb\quartz
New-Item -ItemType SymbolicLink -Path "content" -Target "..\FemPrompt_Vault"
```

**Option B: Direkte Konfiguration (quartz.config.ts):**
```typescript
// quartz.config.ts
const config: QuartzConfig = {
  configuration: {
    pageTitle: "FemPrompt SozArb Knowledge Base",
    contentDir: "../FemPrompt_Vault",  // Pfad zum Vault
    // ...
  }
}
```

**Option C: Copy-Strategie (einfachste):**
```bash
# Initial copy
cp -r FemPrompt_Vault/* quartz/content/

# Später via Script aktualisieren
```

**EMPFEHLUNG:** Option A (Symlink) für automatische Sync

---

## Phase 2: Quartz Konfiguration (2-3 Stunden)

### 2.1 quartz.config.ts anpassen

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "FemPrompt & SozArb: Feminist AI Literacy Research",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",  // Optional: Privacy-friendly analytics
    },
    locale: "de-DE",
    baseUrl: "chpollin.github.io/FemPrompt_SozArb",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",  // Feminist AI Theme: Teal
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
```

### 2.2 quartz.layout.ts anpassen

```typescript
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/chpollin/FemPrompt_SozArb",
      "Knowledge Base": "https://github.com/chpollin/FemPrompt_SozArb/tree/main/knowledge",
      "Paper (Preprint)": "#",  // Update wenn verfügbar
    },
  }),
}

// Components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// Components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
```

### 2.3 Custom CSS für Feminist AI Branding

**Erstelle:** `quartz/styles/custom.scss`

```scss
// Feminist AI Theme: Teal & Coral Accents
:root {
  --feminist-teal: #284b63;
  --feminist-coral: #f28482;
  --feminist-sage: #84a59d;
  --feminist-cream: #f6f6f4;
}

// Highlight für Intersectionality-Konzept
.internal-link[href*="Intersectionality"] {
  color: var(--feminist-coral);
  font-weight: 600;
}

// Badge für Paper-Count
.concept-frequency {
  display: inline-block;
  background: var(--feminist-teal);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  margin-left: 8px;
}

// PRISMA-Flowchart Styling
.mermaid {
  background: var(--feminist-cream);
  padding: 20px;
  border-radius: 8px;
}

// Table of Contents sticky positioning
.toc {
  position: sticky;
  top: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

// Graph View Custom Colors
.graph-node[data-tag*="bias-type"] {
  fill: var(--feminist-coral) !important;
}

.graph-node[data-tag*="mitigation"] {
  fill: var(--feminist-teal) !important;
}
```

### 2.4 Landing Page (index.md) erstellen

**Erstelle/Update:** `FemPrompt_Vault/index.md`

```markdown
---
title: "FemPrompt & SozArb: Feminist AI Literacy Research"
description: "Systematic literature review on bias in frontier LLMs, with feminist epistemology and PRISMA methodology"
tags: [home, moc]
---

# FemPrompt & SozArb Knowledge Base

## 🎯 Research Question

> How can feminist Digital/AI Literacies and diversity-reflective prompting help to expose and mitigate bias and intersectional discrimination in AI technologies?

## 📊 Vault Statistics

| Metric | FemPrompt | SozArb | Total |
|--------|-----------|--------|-------|
| **Papers Assessed** | 326 | 325 | 651 |
| **Papers Included** | - | 222 | - |
| **Papers Processed** | 16 | 47 | 63 |
| **Concepts Extracted** | 25 | TBD | 25+ |
| **Top Concept** | Intersectionality (107x) | TBD | - |

## 🗺️ Quick Navigation

### For Researchers
- [[MASTER_MOC|Master Map of Content]] - Complete vault overview
- [[Concepts/Bias_Types/_Bias_Types_MOC|Bias Types]] - Gender, racial, intersectional discrimination
- [[Concepts/Mitigation_Strategies/_Mitigation_MOC|Mitigation Strategies]] - Prompting, evaluation, debiasing

### For Reviewers
- [[REVIEWER_README|Start Here]] - Quick intro for peer reviewers
- [[Methods/PRISMA_Workflow|PRISMA Methodology]] - How we conducted the review
- [[Methods/Assessment_Process|LLM-Based Assessment]] - Claude Haiku 4.5 screening (100% success)

### For Replication
- [[Replication/Replication_Guide|Replication Guide]] - Use our methodology for your project
- [[Replication/Templates/|Templates]] - Assessment forms, prompts
- [[Replication/Known_Issues|Known Issues]] - What we learned the hard way

## 🔬 Methodology Highlights

This review combines:
- **Multi-Model Deep Research:** 4 LLMs (ChatGPT, Claude, Gemini, Perplexity) for literature discovery
- **LLM-Based Screening:** Claude Haiku 4.5 assessed 325 papers in 24 minutes ($0.58)
- **Expert-in-the-Loop:** Human validation at critical decision points
- **Feminist Epistemology:** Haraway's situated knowledge, Crenshaw's intersectionality

See [[Methods/PRISMA_Workflow|Full Methodology]]

## 📚 Top Concepts

1. [[Concepts/Bias_Types/Intersectionality|Intersectionality]] - 107 mentions
2. [[Concepts/Mitigation_Strategies/Feminist_AI|Feminist AI]] - 21 mentions
3. [[Concepts/Mitigation_Strategies/Bias_Mitigation|Bias Mitigation]] - 19 mentions
4. [[Concepts/Mitigation_Strategies/Prompt_Engineering|Prompt Engineering]] - 12 mentions
5. [[Concepts/Bias_Types/Algorithmic_Bias|Algorithmic Bias]] - 10 mentions

See [[Analysis/Concept_Frequency|Full Frequency Analysis]]

## 🔍 Research Gaps Identified

- **AI Literacy for Social Work:** Rel_AI_Komp score = 1.18/3.0 (lowest dimension)
- **Practical Prompting Strategies:** Few papers on applied mitigation in professional contexts
- **Intersectional Operationalization:** Intersectionality discussed (107x) but rarely implemented

See [[Analysis/Research_Gaps|Detailed Gap Analysis]]

## 📖 Recent Papers (2024-2025)

- [[Papers/2024/Chen_2025_Persona_Vectors|Chen et al. 2025]] - Persona vectors in activation space
- [[Papers/2024/Shanahan_2024_Exotic_Minds|Shanahan 2024]] - Exotic mind-like entities
- [[Papers/2024/Summerfield_2025_Strange_Minds|Summerfield 2025]] - Strange new minds & emergent capabilities

See [[Papers/|All Papers by Year]]

## 🌐 About This Knowledge Base

This vault documents two systematic literature reviews:
- **FemPrompt:** Feminist approaches to AI literacy & prompting
- **SozArb:** AI competencies for social work professionals

**Status:** FemPrompt complete (16 papers), SozArb in progress (47/222 papers)

**License:** CC-BY-4.0 for vault content (summaries, analysis)
**Data:** Raw data available in [GitHub repository](https://github.com/chpollin/FemPrompt_SozArb)

## 📬 Contact & Citation

**Project Lead:** Christopher Pollin ([GitHub](https://github.com/chpollin))
**Institution:** University of Graz

**How to Cite:**
```bibtex
@misc{pollin2025femprompt,
  author = {Pollin, Christopher and [Co-Authors]},
  title = {FemPrompt & SozArb Knowledge Base},
  year = {2025},
  url = {https://chpollin.github.io/FemPrompt_SozArb/},
  note = {Accessed: YYYY-MM-DD}
}
```

**Paper (Preprint):** [Link coming soon]

---

*Last Updated: 2025-11-06*
*Vault Version: 1.0*
*Papers Processed: 63 (16 FemPrompt + 47 SozArb)*
```

---

## Phase 3: Content-Optimierung (2-3 Stunden)

### 3.1 Frontmatter standardisieren

**Alle Paper-Dateien sollten haben:**

```yaml
---
title: "Chen et al. 2025: Persona Vectors in Activation Space"
authors: ["Chen, A.", "Smith, B."]
year: 2025
doi: "10.1234/example"
tags: [paper, femprompt, llm-ontology, alignment]
relevance:
  bias: 3
  vulnerable: 2
  praxis: 1
  prof: 2
  ai_komp: 2
project: femprompt
status: processed
---
```

**Alle Concept-Dateien:**

```yaml
---
title: "Intersectionality"
type: concept
category: bias-type
frequency: 107
tags: [concept, bias-type, intersectionality, feminist-theory]
related:
  - "[[Feminist AI]]"
  - "[[Algorithmic Bias]]"
  - "[[Discrimination]]"
---
```

**Skript für Batch-Update (Python):**

```python
# scripts/standardize_frontmatter.py
import os
import yaml
from pathlib import Path

def update_paper_frontmatter(filepath):
    """Add missing frontmatter fields to paper notes"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse existing frontmatter
    if content.startswith('---'):
        parts = content.split('---', 2)
        fm = yaml.safe_load(parts[1])
        body = parts[2]
    else:
        fm = {}
        body = content

    # Ensure required fields
    if 'tags' not in fm:
        fm['tags'] = ['paper']
    if 'paper' not in fm['tags']:
        fm['tags'].append('paper')

    # Add relevance scores if missing (default 0)
    if 'relevance' not in fm:
        fm['relevance'] = {
            'bias': 0,
            'vulnerable': 0,
            'praxis': 0,
            'prof': 0,
            'ai_komp': 0
        }

    # Rebuild file
    new_content = f"---\n{yaml.dump(fm, sort_keys=False)}---{body}"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✓ Updated {filepath.name}")

# Run for all papers
vault_path = Path("FemPrompt_Vault/Papers")
for md_file in vault_path.rglob("*.md"):
    update_paper_frontmatter(md_file)
```

### 3.2 Broken Links fixen

```bash
cd FemPrompt_Vault

# Find broken links (bash)
grep -r "\[\[.*\]\]" . --include="*.md" | \
  grep -v "\.obsidian" | \
  sed 's/.*\[\[\(.*\)\]\].*/\1/' | \
  sort | uniq > all_links.txt

# Check which files exist
while read link; do
  # Search for file with this name
  find . -name "*${link}*.md" -type f | grep -v ".obsidian" || echo "MISSING: $link"
done < all_links.txt
```

**Alternative: Obsidian Plugin "Broken Links"**
- Install in Obsidian Desktop
- Run "Find Broken Links"
- Export Report → Fix manually

### 3.3 MOC-Struktur vervollständigen

**Erstelle fehlende MOCs:**

`Concepts/Bias_Types/_Bias_Types_MOC.md`:
```markdown
---
title: "Bias Types - Map of Content"
type: moc
tags: [moc, bias-types]
---

# Bias Types in AI Systems

## Overview

This MOC aggregates all identified bias types from our literature review.

## High-Frequency Concepts (10+ mentions)

1. [[Intersectionality]] - 107 mentions
2. [[Discrimination]] - 21 mentions
3. [[Algorithmic Bias]] - 10 mentions

## Medium-Frequency Concepts (5-9 mentions)

4. [[Intersectional Dimensions]] - 4 mentions
5. [[Stereotyping]] - 3 mentions

## Low-Frequency Concepts (1-4 mentions)

- [[Intersectional Harm]] - 2 mentions
- [[Intersectional Inequalities]] - 2 mentions
- [[Algorithmic Discrimination]] - 1 mention

## Papers by Bias Type

### Gender Bias
```dataview
TABLE Rel_Bias, Year
FROM #paper
WHERE contains(file.outlinks, [[Gender Bias]])
SORT Rel_Bias DESC
```

### Racial Bias
[Similar query]

## Research Gaps

- **Underrepresented:** Disability bias, age bias, class bias
- **Missing Intersections:** Race-Gender-Disability, etc.

## Related MOCs

- [[_Mitigation_MOC|Mitigation Strategies]]
- [[Methods/LLM_Ontology|LLM Ontology & Bias Emergence]]
```

---

## Phase 4: GitHub Pages Deployment (1-2 Stunden)

### 4.1 Build testen (lokal)

```bash
cd c:\Users\Chrisi\Documents\GitHub\FemPrompt_SozArb\quartz

# Build static site
npx quartz build

# Preview lokal
npx quartz build --serve

# Öffne Browser: http://localhost:8080
```

**Erwartete Ausgabe:**
```
Started a Quartz server listening at http://localhost:8080
```

**Test-Checklist:**
- [ ] Landing Page (index.md) rendert korrekt
- [ ] Graph View funktioniert
- [ ] Search funktioniert
- [ ] Internal Links funktionieren
- [ ] Backlinks werden angezeigt
- [ ] Dark/Light Mode toggle

### 4.2 GitHub Actions Setup

**Erstelle:** `.github/workflows/deploy-quartz.yml`

```yaml
name: Deploy Quartz to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for Git dates

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd quartz
          npm ci

      - name: Build Quartz
        run: |
          cd quartz
          npx quartz build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: quartz/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4.3 GitHub Repository Einstellungen

**In GitHub Web UI:**

1. Gehe zu: https://github.com/chpollin/FemPrompt_SozArb/settings/pages
2. **Source:** Wähle "GitHub Actions"
3. **Branch:** (wird ignoriert bei Actions, aber setze auf `main`)
4. **Save**

**Alternativ via gh CLI:**
```bash
gh repo edit chpollin/FemPrompt_SozArb \
  --enable-pages \
  --pages-branch main \
  --pages-path /
```

### 4.4 Commit & Push

```bash
cd c:\Users\Chrisi\Documents\GitHub\FemPrompt_SozArb

git add .github/workflows/deploy-quartz.yml
git add quartz/
git add FemPrompt_Vault/index.md
git add knowledge/04_OBSIDIAN_WEB_STRATEGY.md
git add knowledge/05_OBSIDIAN_WEB_IMPLEMENTATION.md

git commit -m "feat: add Quartz v4 web publishing for FemPrompt_Vault

- Configure Quartz v4 with feminist AI branding
- Create landing page with vault statistics
- Add GitHub Actions deployment pipeline
- Document strategy & implementation

Web URL: https://chpollin.github.io/FemPrompt_SozArb/"

git push origin main
```

### 4.5 Deployment verifizieren

**GitHub Actions Tab öffnen:**
https://github.com/chpollin/FemPrompt_SozArb/actions

**Warten auf:** ✅ "Deploy Quartz to GitHub Pages" (ca. 2-3 Minuten)

**Webseite öffnen:**
https://chpollin.github.io/FemPrompt_SozArb/

**Test-Checklist:**
- [ ] Landing Page lädt
- [ ] CSS/JS funktioniert
- [ ] Graph View interaktiv
- [ ] Search funktioniert
- [ ] Mobile Responsive

---

## Phase 5: Post-Launch Optimierung (laufend)

### 5.1 SEO & Discoverability

**Google Search Console:**
1. https://search.google.com/search-console
2. Add Property: `https://chpollin.github.io/FemPrompt_SozArb/`
3. Submit Sitemap: `https://chpollin.github.io/FemPrompt_SozArb/sitemap.xml`

**robots.txt (automatisch von Quartz generiert):**
```
User-agent: *
Allow: /

Sitemap: https://chpollin.github.io/FemPrompt_SozArb/sitemap.xml
```

**Open Graph Tags (in Frontmatter):**
```yaml
---
og:title: "FemPrompt & SozArb Knowledge Base"
og:description: "Systematic literature review on bias in frontier LLMs"
og:image: "/assets/images/og-image.png"
og:type: "website"
---
```

### 5.2 Analytics (Optional, Privacy-Friendly)

**Plausible Analytics (empfohlen):**
```typescript
// quartz.config.ts
analytics: {
  provider: "plausible",
  host: "plausible.io"
}
```

**Kostenlos für Open Source:** https://plausible.io/open-source

**Alternative: GoatCounter (100% kostenlos):**
```html
<!-- In custom head.html -->
<script data-goatcounter="https://femprompt.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

### 5.3 Custom Domain (Optional)

**Wenn gewünscht:** `femprompt-sozarb.org` statt `chpollin.github.io/FemPrompt_SozArb`

**Schritte:**
1. Domain kaufen (Namecheap, Cloudflare, etc.)
2. DNS konfigurieren:
   ```
   A Record: @ → 185.199.108.153
   A Record: @ → 185.199.109.153
   A Record: @ → 185.199.110.153
   A Record: @ → 185.199.111.153
   CNAME: www → chpollin.github.io
   ```
3. GitHub Pages Settings: Add Custom Domain
4. `quartz.config.ts`: Update `baseUrl: "femprompt-sozarb.org"`

**Kosten:** ~$10/Jahr für .org Domain

### 5.4 Monitoring & Maintenance

**Wöchentliche Checks:**
- [ ] Deployment Status: https://github.com/chpollin/FemPrompt_SozArb/deployments
- [ ] Broken Links: Run `npx quartz build` lokal, check Warnings
- [ ] Search Indexing: Teste 5 zufällige Suchen

**Monatliche Updates:**
- [ ] Quartz Version: `cd quartz && npm update`
- [ ] Node.js Version: Check LTS Updates
- [ ] Content Sync: Vault → Web (automatisch via GitHub Actions)

**Bei Problemen:**
```bash
# Clear cache & rebuild
cd quartz
rm -rf .quartz-cache
rm -rf public
npx quartz build
```

---

## Phase 6: Content-Erweiterung (laufend)

### 6.1 SozArb-Integration

**Wenn SozArb 222 Papers vollständig:**

```bash
# Separate Vault ODER Merge
# Option A: Separate SozArb_Vault
cd c:\Users\Chrisi\Documents\GitHub\FemPrompt_SozArb
python analysis/generate_obsidian_vault_improved.py \
  --summaries analysis/summaries_socialai/ \
  --output SozArb_Vault \
  --project-name "SozArb"

# Deploy beide Vaults
# quartz.config.ts: Multi-Vault Support

# Option B: Merge in FemPrompt_Vault
python analysis/generate_obsidian_vault_improved.py \
  --summaries analysis/summaries_socialai/ \
  --output FemPrompt_Vault \
  --project-name "SozArb" \
  --append
```

**Cross-Project-Analyse:**
- `Concepts/` enthält dann FemPrompt + SozArb Erwähnungen
- Tags: `#femprompt` vs `#sozarb` für Filter
- Dataview: "Papers from both projects mentioning Intersectionality"

### 6.2 Paper_Claims.md erstellen

**Für jede Paper-Sektion:**

```markdown
---
title: "Paper Claims & Evidence"
type: paper-support
tags: [paper, evidence-base]
---

# Paper Claims mit Vault-Evidenz

## Sektion 1: Einleitung

### Claim 1.1: "LLMs reproduzieren intersektionale Diskriminierung"

**Evidenz:**
- [[Concepts/Bias_Types/Intersectionality|Intersectionality Concept]] - 107 Erwähnungen
- **Papers:**
  - [[Papers/2023/Noble_2023|Noble 2023]] - Algorithms of Oppression
  - [[Papers/2024/Buolamwini_2024|Buolamwini 2024]] - Intersectional AI Audits

**Zitat für Paper:**
> "Our literature review identified 107 mentions of intersectionality across 16 papers,
> indicating widespread recognition of multi-dimensional bias in AI systems."

---

## Sektion 4: Methodology

### Claim 4.1: "LLM-basiertes Screening erreicht 100% Erfolgsrate"

**Evidenz:**
- [[Methods/Assessment_Process|Assessment Process Dokumentation]]
- **Daten:** assessment-llm/output/assessment_llm_run5.xlsx
- **Metriken:**
  - 325 Papers assessed
  - 0 Errors (nach Auto-Repair)
  - $0.58 Kosten
  - 24 Minuten

**Reviewer-Note:**
> "Raw data available in GitHub repository:
> [assessment_llm_run5.xlsx](https://github.com/chpollin/FemPrompt_SozArb/blob/main/assessment-llm/output/assessment_llm_run5.xlsx)"

---

[... weitere Claims ...]
```

### 6.3 REVIEWER_README.md

```markdown
---
title: "Start Here - Guide for Peer Reviewers"
tags: [reviewer, documentation]
---

# Welcome, Reviewer! 👋

This knowledge base supports the paper **"[Paper Title]"** submitted to **[Journal]**.

## Quick Start (5 minutes)

1. **Read:** [[index|Landing Page]] - Project overview
2. **Explore:** [[MASTER_MOC|Master MOC]] - Full vault structure
3. **Validate:** [[Paper_Claims|Paper Claims]] - Evidence for every major claim

## FAQ for Reviewers

### How were papers selected?

See [[Methods/PRISMA_Workflow|PRISMA Methodology]]

**TL;DR:**
- 326 papers identified via 4 LLMs (ChatGPT, Claude, Gemini, Perplexity)
- 325 papers screened via Claude Haiku 4.5 (automated)
- 222 papers included (68.3%)
- 47 papers processed to date (SozArb project in progress)

### Is LLM-based screening reliable?

See [[Methods/Assessment_Process#Auto-Repair Mechanism]]

**Short Answer:** Yes, 100% success rate after auto-repair.

**Details:**
- Initial run: 84% success (54 errors: timeouts, format issues)
- Auto-repair: Re-ran 54 failed papers
- Final: 325/325 success (100%)
- Cost: $0.58 total

### Can I access raw data?

**Yes, everything is public:**
- Excel: [assessment_llm_run5.xlsx](https://github.com/chpollin/FemPrompt_SozArb/blob/main/assessment-llm/output/assessment_llm_run5.xlsx)
- Code: [assess_papers.py](https://github.com/chpollin/FemPrompt_SozArb/blob/main/assessment-llm/assess_papers.py)
- Prompts: [prompt_template.md](https://github.com/chpollin/FemPrompt_SozArb/blob/main/assessment-llm/prompt_template.md)

### Why only 47/222 PDFs processed?

See [[knowledge/Projekt#Pipeline-Execution]]

**Reason:** SozArb project is work-in-progress.

**Current Status:**
- FemPrompt: 100% complete (16 papers)
- SozArb: 21% complete (47/222 papers)
- Missing PDFs: No Zotero access + Paywall issues

**Paper Implication:**
- Evidence base primarily from FemPrompt (16 papers)
- SozArb data as preliminary validation (47 papers)
- Full SozArb analysis: Future work

### How can I replicate this?

See [[Replication/Replication_Guide]]

**Download Templates:**
- [[Replication/Templates/prompt_template|Assessment Prompt]]
- [[Replication/Templates/assessment_template|Excel Template]]

## Still have questions?

**Contact:** Christopher Pollin - [GitHub](https://github.com/chpollin) - [Email]

**GitHub Issues:** [Open an issue](https://github.com/chpollin/FemPrompt_SozArb/issues) for technical questions
```

---

## Phase 7: Launch Announcement (1 Stunde)

### 7.1 Social Media Posts

**Twitter/Mastodon:**
```
🚀 Launch: FemPrompt & SozArb Knowledge Base

We just published an interactive web version of our systematic literature review on #BiasInAI!

✅ 222 papers assessed (via LLM-based PRISMA screening)
✅ Feminist epistemology framework
✅ Open Science: Data, code, summaries

Explore: https://chpollin.github.io/FemPrompt_SozArb/

#OpenScience #FeministAI #PRISMA #LLM #SystematicReview

🧵 Thread: What makes this different? [1/5]
```

**LinkedIn:**
```
Excited to share our new research infrastructure: An interactive knowledge base
for exploring bias in frontier LLMs through a feminist lens.

Key innovations:
• Multi-model literature discovery (4 LLMs)
• LLM-based PRISMA screening (100% success, $0.58 cost)
• Obsidian-powered knowledge graph
• Full methodological transparency

Perfect for:
📚 Researchers studying AI ethics
🔍 Practitioners seeking evidence-based guidance
🎓 Students learning systematic review methods

Check it out: https://chpollin.github.io/FemPrompt_SozArb/

Paper preprint coming soon!

#AI #Ethics #Research #OpenScience
```

### 7.2 GitHub README Update

**Update:** `README.md` (Root-Level)

```markdown
# FemPrompt & SozArb: Feminist AI Literacy Research

[![Website](https://img.shields.io/badge/Website-Live-green)](https://chpollin.github.io/FemPrompt_SozArb/)
[![License](https://img.shields.io/badge/License-CC--BY--4.0-blue)](LICENSE)
[![Papers](https://img.shields.io/badge/Papers-222_Included-orange)](https://chpollin.github.io/FemPrompt_SozArb/MASTER_MOC)

Systematic literature review on bias in frontier LLMs, combining PRISMA methodology with feminist epistemology.

## 🌐 Explore the Knowledge Base

**Interactive Web Version:** https://chpollin.github.io/FemPrompt_SozArb/

- 📊 222 papers assessed (325 screened)
- 🧠 25+ concepts extracted (Intersectionality, Bias Mitigation, etc.)
- 🔗 Interactive graph view
- 🔍 Full-text search

## 📖 Paper

**Preprint:** [Coming soon]
**Status:** Under review at [Journal Name]

## 🔬 Methodology Highlights

- **Multi-Model Literature Discovery:** ChatGPT, Claude, Gemini, Perplexity
- **LLM-Based Screening:** Claude Haiku 4.5 (100% success rate, $0.58)
- **Feminist Framework:** Haraway's situated knowledge, Crenshaw's intersectionality
- **PRISMA 2020 Compliant:** Full transparency, reproducible workflow

See [Methodology Documentation](https://chpollin.github.io/FemPrompt_SozArb/Methods/PRISMA_Workflow)

## 🚀 Quick Start

### For Researchers
1. Browse [Papers by Year](https://chpollin.github.io/FemPrompt_SozArb/Papers/)
2. Explore [Concept Network](https://chpollin.github.io/FemPrompt_SozArb/MASTER_MOC)
3. Analyze [Research Gaps](https://chpollin.github.io/FemPrompt_SozArb/Analysis/Research_Gaps)

### For Replication
1. Read [Replication Guide](https://chpollin.github.io/FemPrompt_SozArb/Replication/Replication_Guide)
2. Download [Templates](https://github.com/chpollin/FemPrompt_SozArb/tree/main/assessment-llm)
3. Run [Pipeline](https://github.com/chpollin/FemPrompt_SozArb/blob/main/analysis/run_pipeline.py)

## 📁 Repository Structure

```
FemPrompt_SozArb/
├── FemPrompt_Vault/        # Obsidian knowledge base (web-published)
├── knowledge/              # Documentation (Theorie, Methodik, Prozess)
├── assessment-llm/         # LLM-based PRISMA screening
├── analysis/               # PDF acquisition, summarization, vault generation
└── quartz/                 # Quartz v4 web publishing
```

## 📊 Data Availability

All research data openly available:
- **Assessment Results:** [assessment_llm_run5.xlsx](assessment-llm/output/assessment_llm_run5.xlsx)
- **Code:** [Python scripts](analysis/)
- **Prompts:** [prompt_template.md](assessment-llm/prompt_template.md)

## 📜 License

- **Code:** MIT License
- **Vault Content (Summaries, Analysis):** CC-BY-4.0
- **Papers:** Respective publishers' licenses (not redistributed)

## 🙏 Citation

```bibtex
@misc{pollin2025femprompt,
  author = {Pollin, Christopher and [Co-Authors]},
  title = {FemPrompt \& SozArb Knowledge Base},
  year = {2025},
  url = {https://chpollin.github.io/FemPrompt_SozArb/},
  note = {Accessed: YYYY-MM-DD}
}
```

## 📬 Contact

**Principal Investigator:** Christopher Pollin
**Institution:** University of Graz
**GitHub:** [@chpollin](https://github.com/chpollin)

**Questions?** Open an [Issue](https://github.com/chpollin/FemPrompt_SozArb/issues)
```

### 7.3 Community Engagement

**Relevant Communities:**
- r/MachineLearning (Reddit)
- HuggingFace Forums
- ACM FAccT Community
- SIGCHI (if UX-relevant)
- Digital Humanities Slack/Discord

**Template Post:**
```
Hi all!

We just launched an open knowledge base for our systematic review on bias in LLMs:
https://chpollin.github.io/FemPrompt_SozArb/

Novel aspects:
• LLM-based PRISMA screening (Claude assessed 325 papers in 24min)
• Feminist epistemology framework (Haraway, Crenshaw)
• Interactive exploration (Obsidian → Quartz)

Would love feedback, especially on:
1. Methodological rigor (is LLM screening acceptable?)
2. Reusability (would you use this for your project?)

Code + data fully open: https://github.com/chpollin/FemPrompt_SozArb
```

---

## Troubleshooting Guide

### Problem 1: Quartz Build Fails

**Error:** `TypeError: Cannot read property 'slug' of undefined`

**Solution:**
```bash
# Check for invalid frontmatter
cd FemPrompt_Vault
grep -r "^---$" . --include="*.md" -A 20 | grep "^---$" -B 20 | less

# Fix: Ensure all frontmatter is valid YAML
# Common issues: Unquoted colons, unescaped quotes
```

### Problem 2: Links nicht auflösbar

**Error:** `[Warn] Could not resolve link to [[Nonexistent Page]]`

**Solution:**
```bash
# Option A: Fix broken links
sed -i 's/\[\[Nonexistent Page\]\]/Nonexistent Page/g' *.md

# Option B: Ignore via quartz.config.ts
ignorePatterns: ["private", "templates", ".obsidian", "**/Broken Links**"],
```

### Problem 3: GitHub Pages 404

**Error:** https://chpollin.github.io/FemPrompt_SozArb/ → 404

**Checks:**
1. GitHub Actions Status: https://github.com/chpollin/FemPrompt_SozArb/actions
   - ✅ Grün? Dann warte 2-3 Minuten
   - ❌ Rot? Check Logs
2. GitHub Pages Settings: https://github.com/chpollin/FemPrompt_SozArb/settings/pages
   - Source: GitHub Actions (nicht Branch!)
3. `quartz.config.ts`: `baseUrl` korrekt?
   - `"chpollin.github.io/FemPrompt_SozArb"` (ohne https://, ohne trailing slash)

### Problem 4: Graph View leer

**Symptom:** Graph zeigt keine Nodes

**Solution:**
```typescript
// quartz.config.ts → Check Plugin Config
Plugin.Graph({
  localGraph: {
    depth: 2,  // Increase if too few connections
    enableDrag: true,
    enableZoom: true,
    enableHover: true,
  },
  globalGraph: {
    depth: -1,  // -1 = show all
  },
})
```

### Problem 5: Search findet nichts

**Check:**
1. `quartz build` Warnings: "Skipped indexing [file]"?
2. Frontmatter `draft: true`? → Remove
3. File in `ignorePatterns`? → Check config

---

## Success Checklist

### Phase 1: Setup ✅
- [ ] Node.js installiert (v20+)
- [ ] Quartz geklont & npm install
- [ ] Vault verlinkt (Symlink ODER Copy)
- [ ] `quartz.config.ts` konfiguriert
- [ ] `npx quartz build --serve` funktioniert lokal

### Phase 2: Content ✅
- [ ] index.md als Landing Page
- [ ] Alle Paper-Dateien haben standardisiertes Frontmatter
- [ ] Broken Links gefixt
- [ ] MOCs vervollständigt (Bias_Types_MOC, Mitigation_MOC)
- [ ] REVIEWER_README.md erstellt

### Phase 3: Deployment ✅
- [ ] `.github/workflows/deploy-quartz.yml` committed
- [ ] GitHub Pages aktiviert (Source: Actions)
- [ ] Deployment erfolgreich (Actions Tab grün)
- [ ] Webseite erreichbar: https://chpollin.github.io/FemPrompt_SozArb/
- [ ] Graph, Search, Backlinks funktionieren

### Phase 4: Optimization ✅
- [ ] Google Search Console: Sitemap submitted
- [ ] SEO: Meta Tags in wichtigen Seiten
- [ ] Analytics (optional): Plausible/GoatCounter konfiguriert
- [ ] Mobile Responsiveness getestet

### Phase 5: Launch ✅
- [ ] README.md updated mit Badge & Link
- [ ] Social Media Posts (Twitter, LinkedIn, Mastodon)
- [ ] Community Posts (Reddit, HuggingFace, etc.)
- [ ] Co-Autor:innen informiert

---

## Weiterführende Ressourcen

### Quartz Dokumentation
- Official Docs: https://quartz.jzhao.xyz/
- GitHub: https://github.com/jackyzha0/quartz
- Discord: https://discord.gg/cRFFHYye7t

### Obsidian Publish Alternativen
- Digital Garden: https://github.com/oleeskild/obsidian-digital-garden
- Obsidian Publish (offiziell): https://obsidian.md/publish
- MkDocs Material: https://squidfunk.github.io/mkdocs-material/

### Inspiration: Andere Academic Knowledge Bases
- Andy Matuschak's Notes: https://notes.andymatuschak.org/
- Maggie Appleton's Garden: https://maggieappleton.com/garden
- Gwern Branwen: https://gwern.net/

---

**Ende des Implementierungsplans**

**Nächster Schritt:** Entscheidung treffen → Phase 1 starten (8h Setup)

**Fragen?** Siehe knowledge/04_OBSIDIAN_WEB_STRATEGY.md für strategischen Kontext.
