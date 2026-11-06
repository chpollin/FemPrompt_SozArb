"""An operator decision is the only path by which one established Work absorbs another."""

import json

import pytest

from src.analysis import build_work_version_registry as builder

SURVIVOR = 'work:79601e71-971d-574c-a299-65b068101286'
ABSORBED = 'work:8111287c-84d0-5fe4-9bd5-fb5ded077905'


def _previous():
    return {
        'record': {'A': {'work_id': 'work:a', 'version_id': 'version:a'}},
        'legacy': {'title:x': 'work:b'},
        'identifier_work': {'doi:10.1/x': 'work:b'},
        'identifier_version': {'doi:10.1/x': 'version:b'},
    }


def test_without_decision_two_established_works_are_not_merged():
    version = {'identifiers': {'zotero_key': ['A'], 'doi': ['10.1/x']}}
    with pytest.raises(ValueError, match='would merge established works'):
        builder._stable_work_id(set(), [version], _previous())


def test_decision_redirects_works_and_versions_to_the_survivor():
    previous = _previous()
    decision = {
        'surviving_work_id': 'work:a', 'absorbed_work_id': 'work:b',
        'version_redirects': {'version:b': 'version:a'},
    }
    builder._apply_identity_decisions(previous, [decision])
    version = {'identifiers': {'zotero_key': ['A'], 'doi': ['10.1/x']}}
    assert builder._stable_work_id({'title:x'}, [version], previous) == 'work:a'
    assert builder._stable_version_id(version, previous) == 'version:a'


def test_stale_decision_evidence_is_refused(tmp_path):
    (tmp_path / 'corpus').mkdir()
    (tmp_path / 'evidence.json').write_text('{}\n', encoding='utf-8')
    (tmp_path / builder.IDENTITY_DECISIONS_PATH).write_text(json.dumps({
        'schema': 'femprompt-work-identity-decisions/0.1',
        'decisions': [{
            'decision_id': 'd', 'surviving_work_id': 'work:a', 'absorbed_work_id': 'work:b',
            'decided_by': 'operator', 'decided_on': '2026-11-06', 'rationale': 'same paper',
            'evidence': [{'source_path': 'evidence.json', 'sha256': 'sha256:0'}],
        }],
    }), encoding='utf-8')
    with pytest.raises(ValueError, match='stale identity decision evidence'):
        builder.load_identity_decisions(tmp_path)


def test_committed_registry_resolves_the_absorbed_work_to_the_zotero_record():
    registry = builder.build_registry(builder.REPO)
    assert all(work['work_id'] != ABSORBED for work in registry['works'])
    assert registry['legacy_work_id_index'][ABSORBED] == SURVIVOR
    assert registry['record_index']['DL7G37W9']['work_id'] == SURVIVOR
    survivor = next(work for work in registry['works'] if work['work_id'] == SURVIVOR)
    assert survivor['identity_decision'] == 'dl7g37w9-khorramrouz-levy-2026-11-06'
    assert 'candidate_work_requires_identity_adjudication' not in survivor['flags']
    assert {c['work_id'] for c in registry['candidate_index'].values()} >= {SURVIVOR}
    assert registry['source_index']['DL7G37W9']['work_id'] == SURVIVOR
