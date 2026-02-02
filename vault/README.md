# FemPrompt Research Vault

Obsidian Knowledge Graph für den Human vs. Agent Assessment Benchmark.

## Zweck

Dieses Vault enthält:
- **Papers/** - Zusammenfassungen der Include-Papers mit Assessment-Metadaten
- **Concepts/** - Extrahierte Konzepte (Bias Types, Mitigation Strategies)
- **MOCs/** - Maps of Content für Navigation

## Assessment-Provenienz

Jedes Paper im Vault hat Metadaten zu beiden Assessment-Tracks:

```yaml
assessment:
  human: Include|Exclude|Unclear
  agent: Include|Exclude|Unclear
  agreement: true|false
```

## Nutzung

1. Öffne diesen Ordner als Vault in Obsidian
2. Starte mit `MOCs/Index.md`
3. Nutze die MOCs für thematische Navigation

## Generierung

```bash
python pipeline/scripts/generate_vault.py \
  --summaries pipeline/summaries/ \
  --assessment benchmark/data/merged_comparison.csv \
  --output vault/
```

---

*Version: 2.0 (Human vs. Agent)*
*Erstellt: 2026-02-02*
