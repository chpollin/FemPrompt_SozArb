"""A new DOI must not silently migrate established reviewed identities."""

import json
from copy import deepcopy

import pytest

from src.analysis import build_work_version_registry as builder
from src.analysis.metadata_corrections import apply_metadata_corrections


def test_deferred_doi_keeps_independent_metadata_corrections():
    repo = builder.REPO
    original = json.loads((repo / 'corpus/zotero_export.json').read_text(encoding='utf-8'))
    untouched = deepcopy(original)
    corrected = {row['key']: row for row in apply_metadata_corrections(repo, original)}
    item = corrected['ACDF4FL9']
    assert original == untouched
    assert item['DOI'] == ''
    assert [(author['firstName'], author['lastName']) for author in item['creators']] == [
        ('Mahammed', 'Kamruzzaman'), ('Gene Louis', 'Kim'),
    ]
    assert item['date'] == '2024-09-23'
    assert item['itemType'] == 'preprint'
    assert item['repository'] == 'arXiv'
    manifest = json.loads((repo / 'corpus/metadata_corrections.json').read_text(encoding='utf-8'))
    correction = next(row for row in manifest['corrections'] if row['record_id'] == 'ACDF4FL9')
    assert all(change['field'] != 'DOI' for change in correction['changes'])
    pending = correction['deferred_identifier_enrichments'][0]
    assert pending['status'] == 'deferred_not_applied'
    assert pending['after'] == '10.48550/arXiv.2404.17218'
    assert pending['current_work_id'] != pending['conflicting_work_id']


def test_registry_preserves_both_duplicate_work_identities_and_unrelated_record():
    repo = builder.REPO
    previous = json.loads((repo / 'corpus/work_version_registry.json').read_text(encoding='utf-8'))
    rebuilt = builder.build_registry(repo)
    for key in ['ACDF4FL9', 'R3VJVFCE', 'RARE5UFC', '7W3RGSSG', 'UIIDCXLB', 'Z4YXX9PZ', 'RAY6G2R7']:
        assert rebuilt['record_index'][key] == previous['record_index'][key]
    assert rebuilt['record_index']['ACDF4FL9']['work_id'] != rebuilt['record_index']['7W3RGSSG']['work_id']
    assert rebuilt['record_index']['RAY6G2R7']['work_id'] not in {
        rebuilt['record_index']['ACDF4FL9']['work_id'], rebuilt['record_index']['7W3RGSSG']['work_id'],
    }


@pytest.mark.parametrize('guard', ['work', 'version'])
def test_established_identity_collision_guards_still_reject_the_new_doi(guard):
    previous = builder._previous_maps(json.loads((builder.REPO / 'corpus/work_version_registry.json').read_text(encoding='utf-8')))
    version = {'identifiers': {'zotero_key': ['ACDF4FL9'], 'doi': ['10.48550/arxiv.2404.17218']}}
    if guard == 'work':
        with pytest.raises(ValueError, match='would merge established works'):
            builder._stable_work_id(set(), [version], previous)
    else:
        with pytest.raises(ValueError, match='version identifiers collide'):
            builder._stable_version_id(version, previous)
