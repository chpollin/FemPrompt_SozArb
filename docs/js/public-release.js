// Public Evidence Companion: hash router, shared rendering helpers, Aussagen view.
// View modules (release-*.js) register through EC.registerView before boot.
// The working application docs/index.html loads research-app.js first, which owns the
// URL hash there and registers itself as EC.host. In that case this module runs no
// router of its own: go, href and parseHash delegate to the host, and the host loads
// the model and renders views through EC.release.
(function () {
'use strict';

const SITE_TITLE = 'Feministische AI Literacies';
const EC = window.EC = window.EC || {};
const host = EC.host || null;
const views = {};
const lastParams = {};
const NAV_OF_VIEW = { frage: 'fragen' };
let model = null;
let currentView = null;
let booted = false;
// Set by go() so render() can tell a control change from a deep link, Back or Forward.
let internalNavigation = false;

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
    if (host) return host.parseHash();
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
    if (host) { host.go(params, options); return; }
    const hash = hashOf(params);
    internalNavigation = true;
    if (options && options.replace) {
        history.replaceState(null, '', hash);
        render();
    } else if (hash !== location.hash) {
        location.hash = hash;
    } else {
        render();
    }
}

function href(params) { return host ? host.href(params) : hashOf(params); }

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

function germanDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
    return match ? match[3] + '.' + match[2] + '.' + match[1] : String(value || '');
}

// Agent identifiers are run paths; the public view names the role they played.
const AGENT_ROLES = {
    aggregation: 'KI-Agent der Zusammenführung', research_completion: 'KI-Agent der Recherche-Ergänzung',
    source_review_check: 'KI-Agent der Quellenprüfung', grounded_chat: 'KI-Agent des Chats',
};
function agentRole(agentId) {
    const name = String(agentId || '').split('/').pop();
    return AGENT_ROLES[name] || 'KI-Agent';
}

// The stored term can be cut mid-word; the mark is widened to whole words.
function highlight(text, term) {
    const body = String(text || '');
    const needle = String(term || '').trim();
    let start = needle ? body.indexOf(needle) : -1;
    if (start < 0) return esc(body);
    let end = start + needle.length;
    const letter = /[\p{L}\p{N}]/u;
    while (start > 0 && letter.test(body[start - 1]) && letter.test(body[start])) start -= 1;
    while (end < body.length && letter.test(body[end]) && letter.test(body[end - 1])) end += 1;
    return esc(body.slice(0, start)) + '<mark>' + esc(body.slice(start, end)) + '</mark>' + esc(body.slice(end));
}

function screeningLabel(work) {
    if (!work || !work.record) return 'nicht gescreent';
    return 'Screening ' + work.record.decision;
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
            ' · <span class="screening-state">' + esc(screeningLabel(work)) + '</span>' +
            (item.version_type ? ' · ' + esc(versionLabel(item.version_type)) : '') +
            (url ? ' · <a href="' + esc(url) + '" target="_blank" rel="noopener">Quelle öffnen</a>' : '') + '</p></li>';
    }).join('');
    return '<article class="assertion" data-assertion-id="' + esc(assertion.id) + '">' +
        '<h' + level + ' class="assertion-statement">' + esc(assertion.statement) + '</h' + level + '>' +
        '<p class="assertion-meta">' + statusMark(status) +
        (assertion.topics && assertion.topics.length ? ' · ' + esc(assertion.topics.join(', ')) : '') + '</p>' +
        '<ul class="evidence-list" role="list">' + evidence + '</ul>' +
        '<details class="assertion-review"><summary>Prüfnachweis</summary>' +
        '<p class="review-line">' + esc(agentRole(review.agent_id)) + ' · Modell ' + esc(review.model) +
        ' · geprüft am ' + esc(germanDate(review.reviewed_at)) + '</p><p>' + esc(review.findings) + '</p>' +
        '<p class="review-line">Agentenkennung ' + esc(review.agent_id) + ' · Aussage ' + esc(assertion.id) + '</p></details></article>';
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
    const external = !internalNavigation || !booted;
    internalNavigation = false;
    view.render(params, { changed: changed, external: external });
    if (!NAV_OF_VIEW[params.view] && params.view !== 'werk') lastParams[params.view] = params;
    updateNav(params.view);
    const heading = visibleHeading();
    // The tab title repeats the page heading.
    const headingText = heading ? heading.textContent.trim() : '';
    document.title = (headingText ? headingText + ' · ' : '') + SITE_TITLE;
    settleFocus(document.querySelector('[data-view-root="' + params.view + '"]'),
        { changed: changed, external: external, focusHeading: booted });
}

// A deep link, Back or Forward into an open work list lands on that list; any other
// change of view moves focus to the view's heading when ctx.focusHeading allows it.
function settleFocus(root, ctx) {
    if (!root) return;
    const list = ctx.external ? root.querySelector('.worklist-section:not([hidden]) h2') : null;
    const heading = root.querySelector('h1');
    if (list) {
        list.setAttribute('tabindex', '-1');
        list.focus({ preventScroll: true });
        list.scrollIntoView({ block: 'start' });
    } else if (ctx.changed && ctx.focusHeading && heading) {
        focusHeading(heading);
    }
}

function visibleHeading() {
    return document.querySelector('[data-view-root]:not([hidden]) h1');
}

function focusHeading(heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: false });
}

if (!host) registerView('aussagen', {
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

if (!host) registerView('chat', {
    title: function () { return 'Chat'; },
    render: function () {
        const container = document.getElementById('chat-container');
        if (container.dataset.initialized !== 'true' && window.initWissensChat) {
            container.dataset.initialized = 'true';
            window.initWissensChat();
        }
    },
});

// The skip link moves focus to the visible view's heading without touching the hash,
// which holds the view state.
if (!host) document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('.skip-link');
    if (!link) return;
    event.preventDefault();
    const heading = visibleHeading();
    if (heading) focusHeading(heading);
});

Object.assign(EC, {
    esc: esc, safeUrl: safeUrl, go: go, href: href, parseHash: parseHash,
    statusMark: statusMark, workCount: workCount, versionLabel: versionLabel, highlight: highlight,
    germanDate: germanDate, agentRole: agentRole, screeningLabel: screeningLabel,
    renderAssertion: renderAssertion, registerView: registerView,
});
// A host keeps its own escaping helper and lets the grounded chat open its own paper view.
if (!host) {
    Object.assign(EC, {
        escapeHtml: esc,
        // The grounded chat links a cited record to its Work.
        navigateToPaper: function (recordId) {
            const work = model && model.workById(recordId);
            if (!work) return false;
            go({ view: 'werk', id: work.id });
            return true;
        },
    });
}

async function loadModel() {
    async function read(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Der geprüfte Datenstand ist nicht verfügbar (' + path + ').');
        return response.json();
    }
    const payload = await Promise.all([
        // The working application has no release projection; its works come from the
        // landscape records and the Assertion evidence.
        host ? null : read('data/public_release.json'), read('data/assertion_index.json'), read('data/category_schema.json'),
        read('data/analysis_fields.json'), read('data/literature_landscape.json'),
    ]);
    model = EC.createModel({
        release: payload[0], assertions: payload[1], schema: payload[2], fields: payload[3], landscape: payload[4],
    });
    EC.model = model;
    return model;
}

function initViews(names) {
    names.forEach(function (name) { if (views[name] && views[name].init) views[name].init(model); });
}

if (host) {
    EC.release = {
        // Loads the model and initialises only the named views, whose containers the host provides.
        start: function (names) { return loadModel().then(function () { initViews(names); }); },
        // ctx carries root (the view container), changed, external and focusHeading.
        render: function (name, params, ctx) {
            views[name].render(params, ctx);
            settleFocus(ctx.root, ctx);
        },
    };
} else {
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            await loadModel();
            initViews(Object.keys(views));
            window.addEventListener('hashchange', render);
            render();
            booted = true;
        } catch (error) {
            const node = document.getElementById('release-error');
            node.textContent = error.message;
            node.hidden = false;
        }
    });
}
})();
