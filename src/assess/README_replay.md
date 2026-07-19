# R4 Replay: Reproduktionsanleitung

Der code-nahe Ort für die Reproduktion des retrospektiven PRISMA-FlowModels und des dekomponierten Benchmarks (Stage R, R2/R4 in `knowledge/plan.md`). Die methodische Einordnung, das FlowModel-Schema, der Paarungsschlüssel und die Metrikdefinitionen stehen in `knowledge/methods.md`, Abschnitt "Replay verification (Stage R)". Diese README hält die Eingaben, die Skriptaufrufe und die menschliche Prüf-Checkliste.

## Die zwei Pfade

- `replay_flow.py` ist der Core-Pfad, die Produktionsberechnung. Er lädt die Roh-CSVs, paart über `Zotero_Key`, baut das FlowModel und berechnet die dekomponierten Metriken. Ausgabe ist der emittierte Report.
- `replay_selftest.py` ist der Selbsttest-Pfad, eine unabhängige Neu-Herleitung. Er rechnet Konfusionsmatrix und Cohens Kappa aus denselben Roh-CSVs mit eigener Arithmetik nach und vergleicht gegen `generated/benchmark-results/agreement_metrics.json`. Er importiert nichts aus dem Core-Pfad; das ist Absicht (Verifikationsprinzip Session 17). Ein Selbsttest, der die geprüfte Logik importiert, beweist nichts.

## Ausführung

```bash
python src/assess/replay_flow.py
python src/assess/replay_selftest.py
```

`replay_flow.py` schreibt den Report nach `generated/benchmark-results/replay_flow.json` und druckt eine menschenlesbare Zusammenfassung. Der Ausgabepfad ist über `--out` überschreibbar, die drei Eingaben über `--human`, `--llm`, `--papers`.

`replay_selftest.py` druckt je geprüfte Größe erwartet, tatsächlich und GREEN/RED und endet mit Exit 0 (grün, volle Übereinstimmung) oder ungleich 0 (rot, Abweichung). Ein rotes Verdikt blockiert R4.

## Eingabedateien und ihre Rolle

Alle Eingaben liegen unter `assessment/`. Die Spaltenüberschriften sind die am 2026-07-18 beobachteten, damit der Replay an die tatsächliche Struktur bindet, nicht an eine angenommene.

| Datei | Rolle im Replay | Schlüsselspalten (wie vorgefunden) |
|---|---|---|
| `papers_full.csv` | Identifikations-Substrat, der volle Korpus aus Zotero, eine Zeile je Record, mit Dubletten- und Human-Assessment-Flags | `Zotero_Key`, `Title`, `Item_Type`, `Collections`, `Is_Duplicate` (Yes/No), `Has_HA` (Yes/No) |
| `human_assessment.csv` | der bindende menschliche Screening-Track (Google-Sheets-Export) | `Zotero_Key`, zehn Kategoriespalten, `Decision` (Include/Exclude), `Exclusion_Reason`, `Studientyp` |
| `llm_assessment_10k.csv` | der LLM-Screening-Track (10K-Binärkategorien, die Benchmark-Basis) | `Zotero_Key`, zehn Kategoriespalten, `Decision` (Include/Exclude), `Exclusion_Reason`, `Studientyp`, `LLM_Confidence`, `LLM_Reasoning` |
| `generated/benchmark-results/agreement_metrics.json` | das kanonische Ziel, das der Selbsttest reproduziert | `decision.confusion_matrix`, `decision.cohens_kappa`, `decision.overall_agreement`, je Kategorie `kappa`/`agreement` |

Beobachtete und behandelte Spaltennamen-Varianzen:

- Die Human-CSV nennt die Diversitätskategorie `Diversitaet / Intersektionalität` (mit Schrägstrich und Umlaut), die LLM-CSV `Diversitaet`. Der Replay mappt beide auf das kanonische `Diversitaet`.
- Menschliche Ausschlussgründe sind leerzeichengetrennter Freitext (`Not relevant topic`, `Wrong publication type`, `No full text`, `Duplicate`, `Other` und ein vokabularfremdes `No relevant topic`), während `categories.yaml` Underscore-Codes listet (`Not_relevant_topic` usw.). Der Content-only-Subset matcht die tatsächlichen leerzeichengetrennten Werte der Human-CSV, nicht die YAML-Codes. Vokabularfremde und `Other`-Werte werden im Report ausgewiesen, nie stillschweigend normalisiert (die Datenhygiene-Lehre aus R1).

## Menschliche Prüf-Checkliste

R4/R5 gelten erst als menschengeprüft, wenn eine Person jede dieser Zeilen gegen die benannte Quelle bestätigt hat. Jede Zeile ist eine Zahl, die ein Mensch nachrechnet oder abliest, keine zu glaubende Behauptung.

1. **Korpusgröße.** Die Datenzeilen von `assessment/papers_full.csv` zählen (minus Kopfzeile). Muss gleich dem Identification-Count sein, den der Replay emittiert.
2. **Paired-Set.** Bestätigen, dass die Zahl der in `human_assessment.csv` und `llm_assessment_10k.csv` gemeinsam vorhandenen Zotero-Keys gleich dem Paired-Count des Replays und dem Feld `papers_with_both_assessments` von `agreement_metrics.json` ist.
3. **Human-only und LLM-only.** Bestätigen, dass die vom Replay emittierten Human-only- und LLM-only-Counts `papers_human_only` und `papers_agent_only` in `agreement_metrics.json` entsprechen und ihre Summe mit dem Paired-Set gleich der Union-Metadate `total_papers` dort ist (Union der Tracks, nicht Korpus).
4. **Konfusionsmatrix.** Die vier Entscheidungszellen (`Include_Include`, `Include_Exclude`, `Exclude_Include`, `Exclude_Exclude`) aus dem JSON des Replays ablesen und bestätigen, dass sie den gleichen Zellen in `agreement_metrics.json` entsprechen, in der Orientierung `{human}_{agent}`.
5. **Kappa und Agreement.** Bestätigen, dass Entscheidungs-Kappa und Overall-Agreement des Replays gleich `decision.cohens_kappa` und `decision.overall_agreement` sind.
6. **2YS85B49-Auflösung.** Bestätigen, dass der Guard `2YS85B49` als im Korpus und im LLM-Track vorhanden, im Human-Track abwesend, mit verirrtem `Has_HA == Yes` in `papers_full.csv` meldet, also keine menschliche Entscheidung fehlt.
7. **Content-only-Dekomposition.** Bestätigen, dass die Content-only-Subset-Größe gleich dem Paired-Set minus den menschlichen Workflow-Kriterien-Ausschlüssen ist und dass das Content-only-Kappa das Full-Set-Kappa übersteigt, konsistent mit dem V1-Befund, dass Agreement steigt, sobald Workflow-Kriterien entfernt sind.
8. **Selbsttest-Verdikt.** `src/assess/replay_selftest.py` ausführen und bestätigen, dass es grün druckt und Exit 0 liefert; ein rotes Verdikt blockiert R4.
9. **Kategorie-Stichprobe.** Zwei Kategorien wählen (eine hoch-, eine niedrig-übereinstimmende) und bestätigen, dass das Kategorie-Kappa des Replays `agreement_metrics.json` entspricht.

Wenn alle neun halten, sind das retrospektive FlowModel und der Benchmark aus den Rohdateien über einen menschengeprüften Pfad reproduziert, und das Record-Bundle von R4 darf seine Counts aus dem Replay-Output ziehen.
