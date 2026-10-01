# Round-1 replay (R2 / TP3)

`replay_round1.py` rebuilds the retrospective PRISMA FlowModel and the
human-vs-LLM agreement for the first review round from the raw assessment CSVs,
by a human-checked path. It supersedes any hand-entered count for the R1 record
(plan.md, Stage R / R2, TP3).

## Run

```bash
python src/replay/replay_round1.py
python src/replay/replay_round1.py --check-only
```

From the repo root. The default command regenerates both replay artifacts.
`--check-only` performs the same reconstruction and self-test without changing
them. The script uses only the Python standard library.

## What it does

1. **Re-pairs by `Zotero_Key`**, never by the sequential `ID` column. The
   2026-03-27 merge bug paired on sequential ID and made every pre-fix figure
   wrong; the fix is this key and this key only. Inputs:
   `assessment/human_assessment.csv`, `assessment/llm_assessment_10k.csv`,
   `assessment/papers_full.csv`.
2. **FlowModel** (`flow_model.json`): identified records, duplicates flagged,
   per-track screened counts, human exclusion-reason breakdown (controlled
   vocabulary from `categories.yaml`; out-of-vocabulary values are surfaced,
   never dropped), included per track. Every denominator is named. The
   benchmark meta counts the UNION of the two tracks, not the corpus; both are
   reported. The formerly stray `2YS85B49` flag is corrected by the canonical
   `papers_full.csv` generator. Replay now requires every `Has_HA` flag to match
   `human_assessment.csv` exactly.
3. **Agreement** (`agreement_replay.json`): decision confusion matrix, observed
   agreement, Cohen's kappa, plus the 2x2 decomposition (PABAK, kappa-max,
   prevalence index, bias index) and the ten per-category kappas, computed both
   on the full paired set and on the **content-only** subset (human workflow
   exclusions Duplicate / No full text / Wrong publication type separated out).
4. **Self-test**: the decision matrix, decision kappa, and ten per-category
   kappas are compared against the canonical
   `generated/benchmark-results/agreement_metrics.json`, exact within `1e-9`.
   On mismatch it prints the deltas and exits non-zero. On success it prints one
   `PASS` line. The default mode writes the outputs; `--check-only` leaves them
   unchanged.
5. **Condition contrast** (secondary): each of
   `llm_assessment_{haiku,haiku_kd,sonnet,sonnet_kd}.csv` against the human
   track, full and content-only, reported mechanically by kappa (plan.md V1).

## PRISMA flow per identification source

`prisma_flow.py` extends the replay to every identification source of both
rounds and writes `generated/prisma-flow/` (JSON, CSV, Markdown and the
multiple-finds matrices). It runs as a step of `npm run build`; it writes no
timestamp, so its outputs are a deterministic function of the hashed inputs.

```bash
python -m src.replay.prisma_flow
python -m src.replay.prisma_flow --check
```

Round one is taken from `build_flow_model` of this replay. The method and the
identity rule are documented in `knowledge/methods.md`, section PRISMA flow per
identification source.

## Normalization provenance

`normalize_decision` is byte-for-byte from `src/assess/merge_assessments.py`.
`normalize_value` follows it except that a mark other than Ja or Nein, such as
the expert's '?', counts as missing in both modules. `cohens_kappa` (round-4) is
byte-for-byte from `src/assess/calculate_agreement.py`; `normalize_reason` mirrors the
controlled-vocabulary logic in `docs/js/prisma-import.js`. That is why the
replay reproduces the canonical numbers without reading the merged CSV.

## Outputs

- `generated/benchmark-results/replay/flow_model.json`
- `generated/benchmark-results/replay/agreement_replay.json`

Both carry a provenance block (input files, script path, run timestamp, pairing
key).
