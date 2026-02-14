# Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews

Workflow-Design zwischen Large Language Models und Expert:innenwissen.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Teil des [Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz"](https://socialai.2aw.at/) an der Universitaet Graz.

---

## Projektziel

**Primaer:** Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit. Konzeptuelle Grundlage fuer eine Benchmark ("Fair Bench").

**Sekundaer:** Methodische Innovation dokumentieren -- epistemische Infrastruktur fuer LLM-gestuetzte Forschung, dokumentiert in einem Paper fuer Forum Wissenschaft (Deadline: 4. Mai 2026).

---

## Forschungsfragen

1. Wie manifestiert sich Bias in Frontier-LLMs kontextabhaengig?
2. Welche Prompt-Strategien ermoeglichen diskriminierungssensible KI-Nutzung?
3. Wie koennen Sozialarbeitende AI-Literacy entwickeln?

---

## Korpus

**326 Papers** aus Zotero (254 Deep Research + 50 manuell), drei Assessment-Tracks:

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit (56%) |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig (325/325) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | Code bereit, wartet |

---

## Repository-Struktur

```
├── corpus/                    # Korpus-Metadaten
│   ├── zotero_export.json
│   └── papers_metadata.csv
│
├── assessment/                # Human Assessment Tools
│   ├── create_thematic_assessment.py
│   └── excel_to_zotero_tags.py
│
├── assessment-llm/            # LLM Assessment
│   ├── assess_papers.py       # Claude Haiku Pipeline
│   ├── prompt_template.md     # 5-Dimensionen Schema
│   └── output/                # Ergebnisse
│
├── benchmark/                 # Human vs. LLM Vergleich
│   ├── config/categories.yaml # 10-Kategorien Schema
│   ├── scripts/               # Analyse-Skripte
│   └── data/                  # Assessment-Daten
│
├── pipeline/                  # PDF → Markdown → Knowledge
│   ├── scripts/               # Python-Scripts
│   ├── tools/                 # Browser-Tools
│   ├── pdfs/                  # 257 PDFs
│   ├── markdown/              # 252 Markdown-Dateien
│   ├── markdown_clean/        # Bereinigte Markdowns
│   ├── knowledge/distilled/   # 249 destillierte Wissensdokumente
│   └── validation_reports/    # Validierungsberichte
│
├── config/                    # Konfiguration
│   └── defaults.yaml
│
├── prompts/                   # Prompt-Changelog und Governance
│   └── CHANGELOG.md
│
├── vault/                     # Obsidian Vault (Skelett, wartet auf Daten)
│
├── deep-research/restored/    # Deep-Research-Artefakte (RIS, Raw-Outputs)
│
└── knowledge/                 # Dokumentation (01-06 + Guides + Paper)
```

---

## Aktueller Stand

### Assessment

| Track | Status | Details |
|-------|--------|---------|
| Human | In Arbeit | Google Sheets (Susi, Sabine) |
| LLM | Fertig | 325 Papers, 100% Erfolgsrate |

### Pipeline

| Schritt | Status | Details |
|---------|--------|---------|
| PDF-Download | Fertig | 257 PDFs |
| Markdown-Konversion | Fertig | 252 (98.1%) |
| Validierung | Fertig | 98.7 Konfidenz-Score |
| Knowledge Distillation | Fertig | 249/252 (98.8%) |
| Vault-Generierung | Wartet | - |

### Benchmark

Wartet auf Abschluss des Human-Assessments.

---

## Assessment-Schemas

### Human Assessment (10 binaere Kategorien)

| Kategorie | Gruppe |
|-----------|--------|
| AI_Literacies | Technik |
| Generative_KI | Technik |
| Prompting | Technik |
| KI_Sonstige | Technik |
| Soziale_Arbeit | Sozial |
| Bias_Ungleichheit | Sozial |
| Gender | Sozial |
| Diversitaet | Sozial |
| Feministisch | Sozial |
| Fairness | Sozial |

**Inklusions-Logik:** `(Technik >= 1) AND (Sozial >= 1) → Include`

### LLM Assessment (5 Dimensionen, 0-3)

| Dimension | Beschreibung |
|-----------|--------------|
| AI_Komp | AI/LLM-Kompetenzen |
| Vulnerable | Vulnerable Gruppen & Digital Equity |
| Bias | Algorithmische Verzerrungen |
| Praxis | Praktische Implementation |
| Prof | Professioneller Kontext (Soziale Arbeit) |

---

## Team

| Person | Rolle |
|--------|-------|
| Susi Sackl-Sharif | Human-Assessment, Forschungsleitung |
| Sabine Klinger | Human-Assessment |
| Christopher Pollin | Technische Umsetzung |
| Christina | Zotero-Kuratierung |
| Christian Steiner | Paper-Review |

---

## Paper

**Forum Wissenschaft 2/2026:** "Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews"
- Deadline: 4. Mai 2026
- Umfang: 18.000 Zeichen
- Fokus: Epistemische Infrastruktur fuer LLM-gestuetzte Forschung

---

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [01-project.md](knowledge/01-project.md) | Projektziel, theoretischer Rahmen, Glossar |
| [02-methodology.md](knowledge/02-methodology.md) | PRISMA, dualer Bewertungspfad, SKE |
| [03-status.md](knowledge/03-status.md) | Aktueller Stand |
| [04-technical.md](knowledge/04-technical.md) | Pipeline-Architektur, Scripts, Kosten |
| [05-paper-repo-abgleich.md](knowledge/05-paper-repo-abgleich.md) | Paper vs. Repository (detailliert) |
| [06-epistemic-infrastructure.md](knowledge/06-epistemic-infrastructure.md) | Mapping-Tabelle, Sycophancy-Mitigation |
| [WORKFLOW.md](WORKFLOW.md) | Workflow-Uebersicht |
| [prompts/CHANGELOG.md](prompts/CHANGELOG.md) | Prompt-Versionierung |

---

## API-Kosten

| Operation | Kosten |
|-----------|--------|
| Knowledge Distillation (249 Docs) | ~$7.00 |
| LLM-Assessment 5D (325 Papers) | ~$1.15 |
| Validierung | ~$0.58 |
| **Gesamt** | **~$8.73** |

Modell: Claude Haiku 4.5

---

*Aktualisiert: 2026-02-14*
