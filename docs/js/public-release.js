// The result site reuses PRISM's literature and grounded-chat modules.
(function () {
'use strict';
let release = { meta: {}, papers: [] };
let assertions = [];
const subscribers = [];
let state = { view: 'evidence', litView: 'matrix', litYear: 'all', litSource: 'all', litStudy: 'all', litProfile: 'AN_Prompting_Role', litSelection: null };
function escapeHtml(value) { const node = document.createElement('span'); node.textContent = String(value == null ? '' : value); return node.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function syncHash() {
    const params = new URLSearchParams();
    Object.keys(state).forEach(function (key) { if (state[key] != null) params.set(key, state[key]); });
    history.replaceState(null, '', '#' + params.toString());
}
const store = {
    get: function () { return state; },
    set: function (patch) { state = Object.assign({}, state, patch); syncHash(); subscribers.forEach(function (f) { f(state); }); },
    subscribe: function (callback) { subscribers.push(callback); return function () { const i = subscribers.indexOf(callback); if (i >= 0) subscribers.splice(i, 1); }; }
};
window.EC = {
    escapeHtml: escapeHtml, store: store, CATEGORIES: [], CAT_COLORS: {},
    getAllPapers: function () { return release.papers; },
    getMeta: function () { return Object.assign({total_papers: release.papers.length}, release.meta); },
    getKappas: function () { return {}; }, getConceptData: function () { return null; },
    getDivergencePatterns: function () { return null; },
    paperStatus: function () { return {label: 'KI-quellengeprüft'}; },
    navigateToPaper: function (id) {
        const paper = release.papers.find(function (p) { return p.id === id; });
        if (!paper) return false;
        selectView('evidence'); document.getElementById('evidence-search').value = paper.title; renderAssertions(paper.title); return true;
    }
};
function selectView(view) {
    if (['evidence', 'literature', 'chat'].indexOf(view) < 0) view = 'evidence';
    document.querySelectorAll('.release-view').forEach(function (node) { node.hidden = node.id !== 'release-' + view; });
    document.querySelectorAll('.release-nav button').forEach(function (node) { node.setAttribute('aria-pressed', String(node.dataset.view === view)); });
    store.set({view: view});
}
function restoreLocation() {
    const hash = new URLSearchParams(location.hash.slice(1));
    const defaults = { view: 'evidence', litView: 'matrix', litYear: 'all', litSource: 'all', litStudy: 'all', litProfile: 'AN_Prompting_Role', litSelection: null };
    Object.keys(defaults).forEach(function (key) { state[key] = hash.has(key) ? hash.get(key) : defaults[key]; });
    selectView(state.view);
}
function renderAssertions(query) {
    const words = String(query || '').toLocaleLowerCase('de').split(/\s+/).filter(Boolean);
    const selected = assertions.filter(function (a) { const text = JSON.stringify(a).toLocaleLowerCase('de'); return words.every(function (word) { return text.indexOf(word) >= 0; }); });
    const root = document.getElementById('assertion-list');
    if (!selected.length) { root.innerHTML = '<p>Für diese Auswahl liegen noch keine quellengeprüften Aussagen vor.</p>'; return; }
    root.innerHTML = selected.map(function (a) {
        const review = a.review || {};
        return '<article class="assertion-card"><h2>' + escapeHtml(a.statement) + '</h2>' +
            '<p class="assertion-review">KI-Agent: ' + escapeHtml(review.agent_id) + ' · Modell: ' + escapeHtml(review.model) + ' · Prüfung: ' + escapeHtml(review.reviewed_at) + '</p>' +
            '<details><summary>Belege und Prüfbegründung</summary><p>' + escapeHtml(review.findings) + '</p>' +
            a.evidence.map(function (e) { const url = /^https?:\/\//i.test(e.source_url) ? e.source_url : ''; return '<blockquote>' + escapeHtml(e.quote) + '</blockquote><p>' + (url ? '<a target="_blank" rel="noopener" href="' + escapeHtml(url) + '">' + escapeHtml(e.title) + '</a>' : escapeHtml(e.title)) + ' · ' + escapeHtml(e.locator) + '</p><p class="assertion-review">' + escapeHtml(e.work_id) + ' · ' + escapeHtml(e.version_id) + '</p>'; }).join('') + '</details></article>';
    }).join('');
}
document.addEventListener('DOMContentLoaded', async function () {
    try {
        async function read(path) { const response = await fetch(path); if (!response.ok) throw new Error('Geprüfter Datenstand nicht verfügbar: ' + path); return response.json(); }
        const payload = await Promise.all([read('data/public_release.json'), read('data/assertion_index.json'), read('data/category_schema.json')]);
        release = payload[0]; assertions = payload[1].assertions;
        payload[2].categories.forEach(function (category) { window.EC.CATEGORIES.push(category.key); window.EC.CAT_COLORS[category.key] = category.color; });
        document.getElementById('release-counts').textContent = release.meta.assertion_count + ' belegte Aussagen · ' + release.meta.work_count + ' Werke · ' + release.meta.record_count + ' bibliografische Einträge';
        renderAssertions('');
        document.getElementById('evidence-search').addEventListener('input', function (event) { renderAssertions(event.target.value); });
        document.querySelectorAll('.release-nav button').forEach(function (node) { node.addEventListener('click', function () { selectView(node.dataset.view); }); });
        restoreLocation();
        if (window.initLiteraturbild) window.initLiteraturbild();
        if (window.initWissensChat) window.initWissensChat();
        selectView(state.view);
        window.addEventListener('hashchange', restoreLocation);
    } catch (error) {
        document.getElementById('release-counts').className = 'release-error';
        document.getElementById('release-counts').textContent = error.message;
    }
});
})();
