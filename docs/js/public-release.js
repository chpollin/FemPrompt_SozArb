// Public Evidence Companion: hash router, shared rendering helpers, Aussagen view.
// View modules (release-*.js) register through EC.registerView before boot.
(function () {
'use strict';

const SITE_TITLE = 'Feministische AI Literacies';
const EC = window.EC = window.EC || {};
const views = {};
const lastParams = {};
const NAV_OF_VIEW = { frage: 'fragen' };
let model = null;
let currentView = null;
let booted = false;

function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
}

function safeUrl(value) {
    const url = String(value || '').trim();
    return /^https?:\/\//i.test(url) ? url : '';
}

function parseHash() {
    const params = {};
    new URLSearchParams(location.hash.replace(/^#/, '')).forEach(function (value, key) { params[key] = value; });
    if (!params.view || !views[params.view]) params.view = 'fragen';
    return params;
}

function hashOf(params) {
    const search = new URLSearchParams();
    search.set('view', params.view);
    Object.keys(params).filter(function (key) {
        return key !== 'view' && params[key] != null && params[key] !== '' && params[key] !== 'all';
    }).sort().forEach(function (key) { search.set(key, params[key]); });
    return '#' + search.toString();
}

// Every view state lives in the hash. Control changes push a history entry so
// browser back restores the previous state; typing in a search box replaces it.
function go(params, options) {
    const hash = hashOf(params);
    if (options && options.replace) {
        history.replaceState(null, '', hash);
        render();
    } else if (hash !== location.hash) {
        location.hash = hash;
    } else {
        render();
    }
}

function href(params) { return hashOf(params); }

function statusMark(status, options) {
    const verified = status === 'verified';
    const label = verified ? 'fachlich verifiziert' : (model ? model.publicLabel : 'KI-quellengeprüft');
    const extra = options && options.full && !verified ? ' · nicht fachlich verifiziert' : '';
    return '<span class="status-mark status-mark--' + (verified ? 'verified' : 'ki') + '">' +
        '<span class="mark-glyph" aria-hidden="true">' + (verified ? '●' : '◆') + '</span> ' + esc(label + extra) + '</span>';
}

function workCount(count) { return count + (count === 1 ? ' Werk' : ' Werke'); }

function versionLabel(value) {
    const labels = (model && model.landscape.version_type_labels) || {};
    return labels[value] || (value ? String(value).replace(/_/g, ' ') : '');
}

function highlight(text, term) {
    const body = String(text || '');
    const needle = String(term || '').trim();
    const at = needle ? body.indexOf(needle) : -1;
    if (at < 0) return esc(body);
    return esc(body.slice(0, at)) + '<mark>' + esc(needle) + '</mark>' + esc(body.slice(at + needle.length));
}

function renderAssertion(assertion, options) {
    const level = (options && options.level) || 2;
    const review = assertion.review || {};
    const status = assertion.status === 'verified' || assertion.status === 'publication-approved' ? 'verified' : 'ki';
    const evidence = assertion.evidence.map(function (item) {
        const work = model.workById(item.work_id);
        const url = safeUrl(item.source_url);
        const workLink = work ? '<a href="' + esc(href({ view: 'werk', id: work.id })) + '">' + esc(item.author_year || item.title) + '</a>'
            : esc(item.author_year || item.title);
        return '<li class="evidence-item"><blockquote class="evidence-quote">' + esc(item.quote) + '</blockquote>' +
            '<p class="evidence-locator">' + workLink + ' · ' + esc(item.locator) +
            (item.version_type ? ' · ' + esc(versionLabel(item.version_type)) : '') +
            (url ? ' · <a href="' + esc(url) + '" target="_blank" rel="noopener">Quelle öffnen</a>' : '') + '</p></li>';
    }).join('');
    return '<article class="assertion" data-assertion-id="' + esc(assertion.id) + '">' +
        '<h' + level + ' class="assertion-statement">' + esc(assertion.statement) + '</h' + level + '>' +
        '<p class="assertion-meta">' + statusMark(status) +
        (assertion.topics && assertion.topics.length ? ' · ' + esc(assertion.topics.join(', ')) : '') + '</p>' +
        '<ul class="evidence-list" role="list">' + evidence + '</ul>' +
        '<details class="assertion-review"><summary>Prüfnachweis</summary>' +
        '<p class="review-line">KI-Agent ' + esc(review.agent_id) + ' · Modell ' + esc(review.model) +
        ' · geprüft ' + esc(review.reviewed_at) + '</p><p>' + esc(review.findings) + '</p></details></article>';
}

function registerView(name, view) { views[name] = view; }

function updateNav(view) {
    const active = NAV_OF_VIEW[view] || view;
    document.querySelectorAll('[data-nav]').forEach(function (link) {
        const name = link.dataset.nav;
        // A view whose module is not shipped keeps no navigation entry, so dropping
        // its script tag removes the view entirely.
        link.parentElement.hidden = !views[name];
        if (name === active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        link.setAttribute('href', href(lastParams[name] || { view: name }));
    });
}

function render() {
    if (!model) return;
    const params = parseHash();
    const view = views[params.view];
    const changed = params.view !== currentView;
    document.querySelectorAll('[data-view-root]').forEach(function (node) {
        node.hidden = node.dataset.viewRoot !== params.view;
    });
    currentView = params.view;
    view.render(params, { changed: changed });
    if (!NAV_OF_VIEW[params.view] && params.view !== 'werk') lastParams[params.view] = params;
    updateNav(params.view);
    document.title = (view.title ? view.title(params) + ' · ' : '') + SITE_TITLE;
    if (changed && booted) {
        const heading = document.querySelector('[data-view-root="' + params.view + '"] h1');
        if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: false }); }
    }
}

registerView('aussagen', {
    title: function () { return 'Aussagen'; },
    init: function () {
        document.getElementById('evidence-search').addEventListener('input', function (event) {
            const params = parseHash();
            params.q = event.target.value;
            go(params, { replace: true });
        });
    },
    render: function (params) {
        const input = document.getElementById('evidence-search');
        const query = params.q || '';
        if (input.value !== query) input.value = query;
        const words = EC.fold(query).split(/\s+/).filter(Boolean);
        const selected = model.assertions.filter(function (assertion) {
            const text = EC.fold(JSON.stringify(assertion));
            return words.every(function (word) { return text.indexOf(word) >= 0; });
        });
        const count = document.getElementById('assertion-count');
        count.textContent = words.length ? selected.length + (selected.length === 1 ? ' Aussage' : ' Aussagen') : '';
        const list = document.getElementById('assertion-list');
        list.innerHTML = selected.length ? selected.map(function (assertion) { return renderAssertion(assertion); }).join('')
            : '<p class="empty-state">Keine quellengeprüfte Aussage enthält diese Suchbegriffe.</p>';
    },
});

registerView('chat', {
    title: function () { return 'Chat'; },
    render: function () {
        const container = document.getElementById('chat-container');
        if (container.dataset.initialized !== 'true' && window.initWissensChat) {
            container.dataset.initialized = 'true';
            window.initWissensChat();
        }
    },
});

Object.assign(EC, {
    escapeHtml: esc, esc: esc, safeUrl: safeUrl, go: go, href: href, parseHash: parseHash,
    statusMark: statusMark, workCount: workCount, versionLabel: versionLabel, highlight: highlight,
    renderAssertion: renderAssertion, registerView: registerView,
    // The grounded chat links a cited record to its Work.
    navigateToPaper: function (recordId) {
        const work = model && model.workById(recordId);
        if (!work) return false;
        go({ view: 'werk', id: work.id });
        return true;
    },
});

document.addEventListener('DOMContentLoaded', async function () {
    async function read(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Der geprüfte Datenstand ist nicht verfügbar (' + path + ').');
        return response.json();
    }
    try {
        const payload = await Promise.all([
            read('data/public_release.json'), read('data/assertion_index.json'), read('data/category_schema.json'),
            read('data/analysis_fields.json'), read('data/literature_landscape.json'),
        ]);
        model = EC.createModel({
            release: payload[0], assertions: payload[1], schema: payload[2], fields: payload[3], landscape: payload[4],
        });
        EC.model = model;
        Object.keys(views).forEach(function (name) { if (views[name].init) views[name].init(model); });
        window.addEventListener('hashchange', render);
        render();
        booted = true;
    } catch (error) {
        const node = document.getElementById('release-error');
        node.textContent = error.message;
        node.hidden = false;
    }
});
})();
