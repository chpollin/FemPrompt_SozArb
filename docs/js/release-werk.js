// Werk detail and Korpus views over released works.
(function () {
'use strict';

const EC = window.EC;
const LEVEL_LABELS = { 1: 'teilweise', 2: 'ja' };
const TEXT_SOURCE_LABELS = { raw: 'Volltext', abstract: 'Abstract', none: 'kein Papertext' };
const PEER_REVIEW_LABELS = {
    peer_reviewed: 'Peer-Review abgeschlossen', under_review: 'im Peer-Review',
    not_peer_reviewed: 'kein Peer-Review', not_established: 'Peer-Review nicht belegt',
};
const UNSCREENED = 'unscreened';
let model = null;

function link(url, text) {
    const safe = EC.safeUrl(url);
    return safe ? '<a href="' + EC.esc(safe) + '" target="_blank" rel="noopener">' + EC.esc(text) + '</a>' : EC.esc(text);
}

function sourceLink(work) {
    const doi = String(work.doi || '').trim();
    if (doi) return link('https://doi.org/' + encodeURI(doi), 'DOI ' + doi);
    return work.url ? link(work.url, 'Quelle öffnen') : '';
}

function metaLine(work) {
    return [work.authors, work.year, work.journal, work.versionType ? EC.versionLabel(work.versionType) : '']
        .filter(Boolean).map(EC.esc).concat(sourceLink(work) ? [sourceLink(work)] : []).join(' · ');
}

function stateText(state) {
    if (state.state === 'none') return 'nicht zutreffend';
    if (state.state === 'undecidable') return 'nicht entscheidbar';
    if (state.state === 'absent') return 'noch nicht codiert';
    return '';
}

function categorySection(work) {
    const record = work.record;
    const categories = (record.categories || []).slice().sort(function (a, b) {
        return model.schema.categories.findIndex(function (c) { return c.key === a.key; }) -
            model.schema.categories.findIndex(function (c) { return c.key === b.key; });
    });
    if (!categories.length) return '';
    return '<h3>Kategorien</h3><dl class="code-list">' + categories.map(function (category) {
        const label = (model.schema.categories.find(function (c) { return c.key === category.key; }) || {}).label || category.key;
        const quotes = model.categoryEvidence(work, category.key).map(function (item) {
            return '<blockquote class="evidence-quote">' + EC.highlight(item.text, item.term) + '</blockquote>' +
                '<p class="evidence-locator">' + EC.esc(TEXT_SOURCE_LABELS[item.textSource] || 'Textgrundlage offen') + '</p>';
        }).join('');
        return '<div class="code-row" data-code="' + EC.esc(category.key) + '"><dt>' + EC.esc(label) + '</dt><dd>' +
            '<p class="code-values">' + EC.esc(LEVEL_LABELS[category.level] || ('Stufe ' + category.level)) + '</p>' + quotes + '</dd></div>';
    }).join('') + '</dl>';
}

function analysisSection(work) {
    const record = work.record;
    if (record.decision !== 'Include' && !record.analysis) return '';
    const fields = model.dims.filter(function (dim) { return dim.kind === 'field'; });
    const rows = fields.map(function (dim) {
        const state = model.stateOf(work, dim.id);
        const values = state.state === 'value' ? state.values.map(function (value) { return EC.esc(dim.valueLabel(value)); }).join(', ') : stateText(state);
        // A correction reason is the agent's rationale, never evidence, so it is not set as a quotation.
        const correction = ((record.ai_correction && record.ai_correction.changes) || []).filter(function (change) {
            return change.path === '/analysis/fields/' + dim.id;
        }).map(function (change) {
            return '<p class="rationale">Korrekturbegründung des KI-Agenten, kein Beleg. ' + EC.esc(change.reason) + '</p>';
        }).join('');
        return '<div class="code-row" data-code="' + EC.esc(dim.id) + '" data-state="' + state.state + '"><dt>' + EC.esc(dim.label) +
            '</dt><dd><p class="code-values">' + values + '</p>' + correction + '</dd></div>';
    }).join('');
    const notes = record.analysis && record.analysis.notes;
    const actor = record.actor === 'agent' ? 'des codierenden KI-Agenten' : 'der codierenden Fachexpertin oder des Fachexperten';
    // The coding note explains the coding; it is no source passage and stays collapsed.
    return '<h3>Analysefelder</h3><dl class="code-list">' + rows + '</dl>' +
        '<p class="evidence-missing">Für Analysefelder ist keine Belegstelle erfasst.</p>' +
        (notes ? '<details class="rationale-record"><summary>Begründung ' + EC.esc(actor) + ', kein Beleg</summary>' +
            '<p class="rationale">' + EC.esc(notes) + '</p></details>' : '');
}

function decisionLine(work) {
    const record = work.record;
    if (!record) return '<p class="werk-decision">Kein veröffentlichtes Screening</p>';
    return '<p class="werk-decision">Screening ' + EC.esc(record.decision) + (record.reason ? ' · ' + EC.esc(String(record.reason).replace(/_/g, ' ')) : '') + '</p>';
}

function technicalSection(work) {
    const record = work.record;
    const rows = [['Werk-ID', work.id]];
    if (record) {
        rows.push(['Fassungs-ID', record.version_id], ['Fassung', EC.versionLabel(record.version_type) + (record.is_preferred_version ? ', bevorzugte Fassung' : '')],
            ['Begutachtung', PEER_REVIEW_LABELS[record.peer_review_status] || PEER_REVIEW_LABELS.not_established],
            ['Einträge', work.recordIds.join(', ')]);
        if ((record.work_versions || []).length > 1) {
            rows.push(['Bekannte Fassungen', record.work_versions.map(function (item) { return EC.versionLabel(item.version_type); }).join(' · ')]);
        }
        (record.source_records || [record]).forEach(function (source) {
            const receipt = source.ai_verification;
            if (receipt) {
                rows.push(['KI-Quellenprüfung ' + source.id, receipt.agent_id + ' · ' + receipt.model + ' · ' + receipt.reviewed_at],
                    ['Prüfbefund ' + source.id, receipt.findings], ['Prüfartefakt ' + source.id, receipt.artifact + ' · ' + receipt.sha256]);
            }
            if (source.verification) {
                rows.push(['Fachliche Verifikation ' + source.id, (source.verification.actor_ids || []).join(', ') + ' · ' + (source.verification.at || '')]);
            }
            if (source.publication_approval) {
                rows.push(['Publikationsfreigabe ' + source.id, (source.publication_approval.actor_ids || []).join(', ') + ' · ' + (source.publication_approval.at || '')]);
            }
        });
        if (record.ai_correction) {
            const correction = record.ai_correction;
            rows.push(['KI-Korrektur', correction.agent_id + ' · ' + correction.model + ' · ' + correction.corrected_at]);
        }
        rows.push(['Codierung', (record.actor === 'agent' ? 'codierender KI-Agent ' : 'Fachexpertin oder Fachexperte ') + record.reviewer]);
    } else {
        work.papers.forEach(function (paper) { rows.push(['Fassungs-ID ' + paper.id, paper.version_id]); });
    }
    return '<details class="werk-technical"><summary>Identität und Prüfnachweis</summary><dl class="technical-list">' +
        rows.map(function (row) { return '<dt>' + EC.esc(row[0]) + '</dt><dd>' + EC.esc(row[1]) + '</dd>'; }).join('') + '</dl></details>';
}

function renderWerk(params) {
    const root = document.getElementById('werk-root');
    const work = model.workById(params.id || '');
    if (!work) {
        root.innerHTML = '<h1>Werk nicht gefunden</h1><p class="empty-state">Diese Kennung gehört zu keinem veröffentlichten Werk.</p>';
        return;
    }
    const assertions = work.assertions.length
        ? '<section class="werk-assertions" aria-labelledby="werk-assertions-title"><h2 id="werk-assertions-title">Aussagen</h2>' +
            work.assertions.map(function (assertion) { return EC.renderAssertion(assertion, { level: 3 }); }).join('') + '</section>'
        : '';
    const codes = work.record
        ? '<section class="werk-codes" aria-labelledby="werk-codes-title"><h2 id="werk-codes-title">Codierung</h2>' +
            categorySection(work) + analysisSection(work) + '</section>'
        : '';
    root.innerHTML = '<article class="werk" data-work-id="' + EC.esc(work.id) + '">' +
        '<h1 id="werk-title">' + EC.esc(work.title) + '</h1>' +
        '<p class="werk-meta">' + metaLine(work) + '</p>' +
        '<p class="werk-status">' + EC.statusMark(work.status, { full: true }) + '</p>' +
        decisionLine(work) + codes + assertions + technicalSection(work) + '</article>';
}

function decisionOf(work) { return work.record ? work.record.decision : UNSCREENED; }
function decisionLabel(value) { return value === UNSCREENED ? 'nicht gescreent' : value; }
function studyOf(work) { return model.stateOf(work, model.STUDY_FIELD).values; }

const FACETS = [
    { key: 'decision', id: 'korpus-decision', label: 'Entscheidung', all: 'Alle Entscheidungen',
        values: function (work) { return [decisionOf(work)]; }, labelOf: decisionLabel },
    { key: 'study', id: 'korpus-study', label: 'Studientyp', all: 'Alle Studientypen', values: studyOf },
    { key: 'year', id: 'korpus-year', label: 'Jahr', all: 'Alle Jahre', values: function (work) { return work.year ? [String(work.year)] : []; } },
    { key: 'status', id: 'korpus-status', label: 'Prüfstand', all: 'Alle Prüfstände', values: function (work) { return [work.status]; },
        labelOf: function (value) { return value === 'verified' ? '● fachlich verifiziert' : '◆ ' + model.publicLabel; } },
];

function matches(work, params, skip) {
    const words = EC.fold(params.q || '').split(/\s+/).filter(Boolean);
    if (!words.every(function (word) { return work.search.indexOf(word) >= 0; })) return false;
    return FACETS.every(function (facet) {
        if (facet.key === skip || !params[facet.key]) return true;
        return facet.values(work).indexOf(params[facet.key]) >= 0;
    });
}

function facetValues(facet) {
    const values = new Set();
    model.works.forEach(function (work) { facet.values(work).forEach(function (value) { values.add(value); }); });
    const list = Array.from(values);
    if (facet.key === 'year') return list.sort(function (a, b) { return b - a; });
    if (facet.key === 'study') return (model.fields.study_types || []).filter(function (value) { return values.has(value); });
    if (facet.key === 'decision') return ['Include', 'Unclear', 'Exclude', UNSCREENED].filter(function (value) { return values.has(value); });
    return list.sort();
}

function korpusItem(work) {
    const study = studyOf(work).join(', ');
    return '<li class="korpus-item" data-work-id="' + EC.esc(work.id) + '">' +
        '<a class="korpus-title" href="' + EC.esc(EC.href({ view: 'werk', id: work.id })) + '">' + EC.esc(work.title) + '</a>' +
        '<p class="work-meta">' + [work.authorYear, study, decisionLabel(decisionOf(work))].filter(Boolean).map(EC.esc)
            .concat([EC.statusMark(work.status)]).join(' · ') + '</p></li>';
}

function renderKorpusList(params) {
    const selected = model.works.filter(function (work) { return matches(work, params); });
    const active = Boolean(params.q || FACETS.some(function (facet) { return params[facet.key]; }));
    document.getElementById('korpus-count').textContent = active ? EC.workCount(selected.length) : '';
    document.getElementById('korpus-list').innerHTML = selected.map(korpusItem).join('');
    document.getElementById('korpus-empty').hidden = selected.length > 0;
    FACETS.forEach(function (facet) {
        const select = document.getElementById(facet.id);
        const value = params[facet.key] || '';
        const options = facetValues(facet);
        // A facet with one value filters nothing and is not offered.
        select.closest('label').hidden = options.length < 2 && !value;
        select.innerHTML = '<option value="">' + EC.esc(facet.all) + '</option>' + options.map(function (option) {
            // Counts answer a search or filter, so they appear only while one is active.
            const count = active ? ' (' + model.works.filter(function (work) {
                return matches(work, params, facet.key) && facet.values(work).indexOf(option) >= 0;
            }).length + ')' : '';
            return '<option value="' + EC.esc(option) + '"' + (option === value ? ' selected' : '') + '>' +
                EC.esc((facet.labelOf ? facet.labelOf(option) : option) + count) + '</option>';
        }).join('');
    });
}

function korpusParams() {
    const params = EC.parseHash();
    const state = { view: 'korpus' };
    ['q'].concat(FACETS.map(function (facet) { return facet.key; })).forEach(function (key) { if (params[key]) state[key] = params[key]; });
    return state;
}

EC.registerView('werk', {
    title: function (params) { const work = model.workById(params.id || ''); return work ? work.title : 'Werk'; },
    init: function (instance) { model = instance; },
    render: renderWerk,
});

EC.registerView('korpus', {
    title: function () { return 'Korpus'; },
    init: function () {
        const root = document.getElementById('korpus-root');
        root.innerHTML = '<div class="controls" role="group" aria-label="Korpus filtern">' +
            '<label>Suche <input id="korpus-search" type="search" autocomplete="off"></label>' +
            FACETS.map(function (facet) { return '<label>' + EC.esc(facet.label) + ' <select id="' + facet.id + '"></select></label>'; }).join('') +
            '</div><p id="korpus-count" class="result-count" aria-live="polite"></p>' +
            '<ol id="korpus-list" class="korpus-list" role="list"></ol>' +
            '<p id="korpus-empty" class="empty-state" hidden>Kein veröffentlichtes Werk entspricht dieser Auswahl.</p>';
        root.addEventListener('input', function (event) {
            if (event.target.id !== 'korpus-search') return;
            const params = korpusParams();
            params.q = event.target.value;
            EC.go(params, { replace: true });
        });
        root.addEventListener('change', function (event) {
            const facet = FACETS.find(function (item) { return item.id === event.target.id; });
            if (!facet) return;
            const params = korpusParams();
            params[facet.key] = event.target.value;
            EC.go(params);
        });
    },
    render: function (params) {
        const input = document.getElementById('korpus-search');
        if (input.value !== (params.q || '')) input.value = params.q || '';
        renderKorpusList(params);
    },
});
})();
