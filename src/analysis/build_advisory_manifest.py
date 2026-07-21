#!/usr/bin/env python3
"""Build the input manifest for the TP4 advisory LLM track (SQ1-SQ3 corpus synthesis).

Data flow: assessment/human_assessment.csv (binding human decisions, filter
Decision == Include) -> kd_mapping.build_kd_mapping (Zotero_Key -> distilled
knowledge document) -> per-paper section-filtered input files plus a manifest.

Outputs under generated/analysis-advisory/:
    manifest.json   provenance, per-paper entries, unmapped includes (named gap)
    inputs/<KEY>.md section-filtered knowledge-document text per included paper

The section filter reuses kd_mapping.load_kd_sections, which excludes
Assessment-Relevanz (leaks a pre-made judgment) and Schluesselreferenzen.
Advisory-track framing: outputs feed the advisory LLM coding only; the binding
human decision and the human pilot coding remain the licensed track (plan.md,
Decided questions, 2026-07-03).

Usage:
    python src/analysis/build_advisory_manifest.py
"""

import argparse
import csv
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'assess'))
from kd_mapping import (  # noqa: E402
    build_kd_mapping,
    load_kd_sections,
    load_papers_index,
    normalize_for_matching,
)

REPO = Path(__file__).resolve().parents[2]


def main() -> None:
    sys.stdout.reconfigure(encoding='utf-8')

    parser = argparse.ArgumentParser(description='Build advisory-track input manifest')
    parser.add_argument('--human-csv', default=REPO / 'assessment' / 'human_assessment.csv')
    parser.add_argument('--papers-csv', default=REPO / 'assessment' / 'papers_full.csv')
    parser.add_argument('--kd-dir', default=REPO / 'generated' / 'distilled')
    parser.add_argument('--out-dir', default=REPO / 'generated' / 'analysis-advisory')
    args = parser.parse_args()

    human_csv = Path(args.human_csv)
    for required in (human_csv, Path(args.papers_csv), Path(args.kd_dir)):
        if not required.exists():
            sys.exit(f'FEHLER: missing input {required}')

    with open(human_csv, encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    includes = [r for r in rows if r['Decision'].strip() == 'Include']
    print(f'OK: {len(rows)} human decisions, {len(includes)} Include')

    matched, _unmatched_stems, stats = build_kd_mapping(Path(args.papers_csv), Path(args.kd_dir))
    print(f'OK: kd_mapping matched {len(matched)} Zotero_Keys {stats}')

    # Second pass: the corpus holds many duplicates, so a paper's distilled
    # document may be mapped under a sibling Zotero_Key. Reuse it via exact
    # normalized-title match against the already-matched papers.
    papers_index = load_papers_index(Path(args.papers_csv))
    title_to_kd = {}
    for zkey, kd_path in matched.items():
        title_norm = papers_index.get(zkey, {}).get('title_norm', '')
        if title_norm:
            title_to_kd.setdefault(title_norm, kd_path)

    out_dir = Path(args.out_dir)
    inputs_dir = out_dir / 'inputs'
    inputs_dir.mkdir(parents=True, exist_ok=True)

    papers = []
    unmapped = []
    for row in includes:
        zkey = row['Zotero_Key'].strip()
        entry = {
            'zotero_key': zkey,
            'author_year': row.get('Author_Year', ''),
            'title': row.get('Title', ''),
            'studientyp': row.get('Studientyp', ''),
        }
        kd_path = matched.get(zkey)
        if kd_path is None:
            kd_path = title_to_kd.get(normalize_for_matching(entry['title']))
            if kd_path is not None:
                entry['mapped_via'] = 'duplicate_title'
        if kd_path is None:
            unmapped.append(entry)
            continue
        sections = load_kd_sections(kd_path)
        input_path = inputs_dir / f'{zkey}.md'
        header = (
            f'# {entry["title"]}\n\n'
            f'Zotero_Key: {zkey}\nAuthor_Year: {entry["author_year"]}\n\n'
        )
        input_path.write_text(header + sections + '\n', encoding='utf-8')
        entry['input_file'] = str(input_path.relative_to(REPO)).replace('\\', '/')
        entry['kd_source'] = str(kd_path.relative_to(REPO)).replace('\\', '/')
        entry['chars'] = len(sections)
        papers.append(entry)

    manifest = {
        'purpose': 'TP4 advisory LLM track inputs (SQ1-SQ3), human-included papers only',
        'script': 'src/analysis/build_advisory_manifest.py',
        'sources': {
            'human_decisions': str(human_csv.relative_to(REPO)).replace('\\', '/'),
            'papers_index': str(Path(args.papers_csv).relative_to(REPO)).replace('\\', '/'),
            'kd_dir': str(Path(args.kd_dir).relative_to(REPO)).replace('\\', '/'),
        },
        'counts': {
            'human_decisions': len(rows),
            'human_includes': len(includes),
            'mapped': len(papers),
            'unmapped_includes': len(unmapped),
        },
        'papers': papers,
        'unmapped_includes': unmapped,
    }
    manifest_path = out_dir / 'manifest.json'
    tmp = manifest_path.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(manifest_path)

    print(f'OK: {len(papers)} input files written to {inputs_dir}')
    if unmapped:
        print(f'WARNUNG: {len(unmapped)} includes without distilled document (named gap):',
              file=sys.stderr)
        for e in unmapped:
            print(f'  - {e["zotero_key"]} {e["author_year"]} {e["title"][:60]}', file=sys.stderr)
    print(f'OK: manifest at {manifest_path}')


if __name__ == '__main__':
    main()
