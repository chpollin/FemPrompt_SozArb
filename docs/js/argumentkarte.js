// Argumentkarte on the start view of the working Companion: every Assertion as a tile in
// the column of each sub-question its `research_questions` names. A tile's fill shows its
// release state, its unit marks the number of source Works. Selecting a tile highlights the
// tiles that share a Work with it and marks the tiles recorded as contested with it.
//
// Draft Assertions come only from the git-ignored local working file that
// src/publish/build_assertion_map.py writes; where it is absent, as on the public Pages
// site, the map shows the released Assertion index alone (knowledge/governance.md).
(function () {
'use strict';

const EC = window.EC;
const WORKING_URL = 'data/assertions_working.json';
const WORKING_SCHEMA = 'femprompt-assertion-working/0.1';
const ACCENTS = { '1': 'use', '2': 'risk', '3': 'practice', '4': 'concept', '5': 'competence' };
// More marks than this no longer read at a glance; the count stays in label and tooltip.
const MAX_UNITS = 6;

let model = null;
let items = [];
let byId = {};
let selected = null;
let root = null;
let tip = null;

function questionIds(values) {
    return (values || []).map(function (value) {
        const match = /(\d+)/.exec(String(value));
        return match ? match[1] : '';
    }).filter(Boolean);
}

// The released index carries no `contested-with`; naming a contested draft from the
// public file would leak it, so the fallback shows no conflicts.
function fromReleased() {
    return (model.assertions || []).map(function (assertion) {
        const works = {};
        assertion.evidence.forEach(function (evidence) {
            if (!works[evidence.record_id]) {
                works[evidence.record_id] = {
                    record_id: evidence.record_id, work_id: evidence.work_id,
                    title: evidence.title, author_year: evidence.author_year,
                };
            }
        });
        return {
            id: String(assertion.assertion_ref || assertion.id).split('/').pop(),
            title: assertion.title, label: assertion.label || '', statement: assertion.statement, status: assertion.status,
            released: true, research_questions: assertion.research_questions || [],
            contested_with: [], works: Object.keys(works).map(function (key) { return works[key]; }),
        };
    });
}

function load() {
    return fetch(WORKING_URL)
        .then(function (response) { return response.ok ? response.json() : null; })
        .catch(function () { return null; })
        .then(function (data) {
            const working = Boolean(data && data.schema === WORKING_SCHEMA && Array.isArray(data.assertions));
            return { source: working ? 'working' : 'released', list: working ? data.assertions : fromReleased() };
        });
}

function statusInfo(item) {
    if (item.status === 'verified' || item.status === 'publication-approved') return { key: 'verified', glyph: '●', label: 'fachlich verifiziert' };
    if (item.released) return { key: 'released', glyph: '◆', label: (model && model.publicLabel) || 'KI-quellengeprüft' };
    return { key: 'draft', glyph: '◇', label: 'Entwurf, ungeprüft' };
}

function worksLabel(count) { return count + (count === 1 ? ' Werk' : ' Werke'); }

function tileHtml(item) {
    const status = statusInfo(item);
    const units = Math.min(item.works.length, MAX_UNITS);
    let marks = '';
    for (let index = 0; index < units; index += 1) marks += '<i></i>';
    // A short label shows the core claim in the tile; its accessible name starts with it.
    const label = item.label ? '<span class="amap-label">' + EC.esc(item.label) + '</span>' : '';
    return '<li><button type="button" class="amap-tile amap-tile--' + status.key + (label ? ' amap-tile--labelled' : '') +
        '" data-id="' + EC.esc(item.id) + '" aria-pressed="false" ' +
        'aria-label="' + EC.esc((item.label ? item.label + ': ' : '') + item.title + ', ' + status.label + ', ' + worksLabel(item.works.length)) + '">' +
        label + '<span class="amap-units" aria-hidden="true">' + marks + '</span></button></li>';
}

// Reviewed tiles lead, then tiles with more source Works.
function ordered(list) {
    return list.slice().sort(function (a, b) {
        return (b.released - a.released) || (b.works.length - a.works.length) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
}

function groupHtml(id, label, list, accent) {
    const count = '<span class="amap-count" aria-label="' + EC.esc(list.length === 1 ? '1 Aussage' : list.length + ' Aussagen') + '">' + list.length + '</span>';
    return '<section class="amap-col' + (accent ? ' amap-col--' + accent : '') + '" data-sq="' + EC.esc(id) + '" aria-labelledby="amap-col-' + EC.esc(id) + '">' +
        '<h3 id="amap-col-' + EC.esc(id) + '"><span class="amap-col-name">' + EC.esc(label) + '</span> ' + count + '</h3>' +
        (list.length ? '<ul class="amap-tiles" role="list">' + ordered(list).map(tileHtml).join('') + '</ul>'
            : '<p class="amap-empty">Noch keine Aussage</p>') + '</section>';
}

function legendHtml() {
    const sample = function (cls, units) {
        let marks = '';
        for (let index = 0; index < units; index += 1) marks += '<i></i>';
        return '<span class="amap-tile amap-tile--sample ' + cls + '" aria-hidden="true"><span class="amap-units">' + marks + '</span></span>';
    };
    return '<ul class="amap-legend" role="list" aria-label="Legende">' +
        '<li>' + sample('amap-tile--released', 0) + EC.esc((model && model.publicLabel) || 'KI-quellengeprüft') + '</li>' +
        '<li>' + sample('amap-tile--draft', 0) + 'Entwurf, ungeprüft</li>' +
        '<li>' + sample('amap-tile--draft', 3) + 'Punkte: Werke je Aussage</li>' +
        '<li>' + sample('amap-tile--draft is-shared', 0) + 'teilt ein Werk mit der Auswahl</li>' +
        '<li>' + sample('amap-tile--draft is-contested', 0) + 'widerspricht der Auswahl</li></ul>';
}

function render(container) {
    const questions = EC.questions || [];
    const known = questions.map(function (question) { return question.id; });
    const columns = questions.map(function (question) {
        const list = items.filter(function (item) { return questionIds(item.research_questions).indexOf(question.id) >= 0; });
        return groupHtml(question.id, question.name, list, ACCENTS[question.id]);
    }).join('');
    const rest = items.filter(function (item) {
        return !questionIds(item.research_questions).some(function (id) { return known.indexOf(id) >= 0; });
    });
    container.innerHTML = '<h2 class="amap-title" id="amap-title">Argumentkarte</h2>' +
        '<div class="amap-columns">' + columns + '</div>' +
        (rest.length ? '<div class="amap-rest">' + groupHtml('ohne', 'Ohne Teilfrage', rest, '') + '</div>' : '') +
        legendHtml() +
        '<div class="amap-detail" id="amap-detail" hidden></div>';
}

function workHtml(work) {
    const known = model && work.work_id && model.workById(work.work_id);
    const title = known
        ? '<a href="' + EC.esc(EC.href({ view: 'werk', id: work.work_id })) + '">' + EC.esc(work.title) + '</a>'
        : EC.esc(work.title);
    return '<li class="amap-work"><span class="amap-work-title">' + title + '</span>' +
        '<span class="amap-work-meta">' + (work.author_year ? EC.esc(work.author_year) + ', ' : '') +
        '<a href="prisma.html?paper=' + encodeURIComponent(work.record_id) + '">PRISM</a></span></li>';
}

function detailHtml(item) {
    const status = statusInfo(item);
    const names = questionIds(item.research_questions).map(function (id) {
        const question = (EC.questions || []).find(function (entry) { return entry.id === id; });
        return question ? question.name : '';
    }).filter(Boolean);
    const contested = item.contested_with.map(function (id) { return byId[id]; }).filter(Boolean);
    return '<div class="amap-detail-head"><h3 id="amap-detail-title">' + EC.esc(item.title) + '</h3>' +
        '<button type="button" class="amap-close" aria-label="Auswahl aufheben">×</button></div>' +
        '<p class="amap-detail-meta"><span class="amap-status amap-status--' + status.key + '"><span aria-hidden="true">' + status.glyph + '</span> ' +
        EC.esc(status.label) + '</span>' + names.map(function (name) { return ', ' + EC.esc(name); }).join('') + '</p>' +
        '<p class="amap-statement">' + EC.esc(item.statement) + '</p>' +
        '<h4>' + EC.esc(worksLabel(item.works.length)) + '</h4><ul class="amap-works" role="list">' + item.works.map(workHtml).join('') + '</ul>' +
        (contested.length ? '<h4>Widerspricht</h4><ul class="amap-contested" role="list">' + contested.map(function (other) {
            return '<li><button type="button" class="amap-jump" data-id="' + EC.esc(other.id) + '">' + EC.esc(other.title) + '</button></li>';
        }).join('') + '</ul>' : '');
}

function select(id) {
    const item = id ? byId[id] : null;
    selected = item ? item.id : null;
    const shared = {};
    if (item) item.works.forEach(function (work) { shared[work.record_id] = true; });
    const contested = item ? item.contested_with : [];
    root.classList.toggle('amap--active', Boolean(item));
    root.querySelectorAll('.amap-tile[data-id]').forEach(function (tile) {
        const other = byId[tile.dataset.id];
        const isSelected = Boolean(item) && other.id === item.id;
        tile.classList.toggle('is-selected', isSelected);
        tile.setAttribute('aria-pressed', String(isSelected));
        tile.classList.toggle('is-contested', Boolean(item) && contested.indexOf(other.id) >= 0);
        tile.classList.toggle('is-shared', Boolean(item) && !isSelected && other.works.some(function (work) { return shared[work.record_id]; }));
    });
    const detail = root.querySelector('#amap-detail');
    detail.hidden = !item;
    detail.innerHTML = item ? detailHtml(item) : '';
}

function position(anchor) {
    const rect = anchor.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - box.width / 2;
    let top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + box.width > window.innerWidth - 8) left = window.innerWidth - box.width - 8;
    if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 8;
    tip.style.left = left + window.scrollX + 'px';
    tip.style.top = top + window.scrollY + 'px';
}

// Same element and styling as the navigation tooltips of nav-tips.js.
function showTip(tile) {
    const item = byId[tile.dataset.id];
    if (!item) return;
    tip.innerHTML = '<div class="tip-text"></div>';
    tip.firstChild.textContent = item.title + '. ' + statusInfo(item).label + ', ' + worksLabel(item.works.length);
    tip.hidden = false;
    position(tile);
}

function hideTip() { if (tip) tip.hidden = true; }

function focusTile(id) {
    const tile = root.querySelector('.amap-tile[data-id="' + CSS.escape(id) + '"]');
    if (!tile) return;
    tile.focus();
    tile.scrollIntoView({ block: 'nearest' });
}

function bind() {
    root.addEventListener('click', function (event) {
        const tile = event.target.closest('.amap-tile[data-id]');
        if (tile) {
            hideTip();
            select(selected === tile.dataset.id ? null : tile.dataset.id);
            if (selected) root.querySelector('#amap-detail').scrollIntoView({ block: 'nearest' });
            return;
        }
        const jump = event.target.closest('.amap-jump');
        if (jump) { select(jump.dataset.id); focusTile(jump.dataset.id); return; }
        if (event.target.closest('.amap-close')) {
            const previous = selected;
            select(null);
            if (previous) focusTile(previous);
        }
    });
    root.addEventListener('mouseover', function (event) {
        const tile = event.target.closest('.amap-tile[data-id]');
        if (tile) showTip(tile);
    });
    root.addEventListener('mouseout', function (event) {
        const tile = event.target.closest('.amap-tile[data-id]');
        if (tile && document.activeElement !== tile) hideTip();
    });
    root.addEventListener('focusin', function (event) {
        const tile = event.target.closest('.amap-tile[data-id]');
        if (tile) showTip(tile); else hideTip();
    });
    root.addEventListener('focusout', hideTip);
    root.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        hideTip();
        if (selected) { const previous = selected; select(null); focusTile(previous); }
    });
}

function mount(instance) {
    model = instance;
    const host = document.querySelector('#view-start .start');
    if (!host || document.getElementById('argument-map')) return;
    root = document.createElement('section');
    root.className = 'amap';
    root.id = 'argument-map';
    root.setAttribute('aria-labelledby', 'amap-title');
    host.appendChild(root);
    tip = document.createElement('div');
    tip.id = 'amap-tip';
    tip.className = 'rich-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);
    load().then(function (loaded) {
        items = loaded.list;
        byId = {};
        items.forEach(function (item) { byId[item.id] = item; });
        render(root);
        bind();
        root.dataset.source = loaded.source;
    });
}

// research-app.js calls EC.renderStart once the release model is ready; the map hooks in
// there so it needs no change to the start view module or the router.
const renderStart = EC.renderStart;
EC.renderStart = function (instance) {
    if (renderStart) renderStart(instance);
    mount(instance);
};
})();
