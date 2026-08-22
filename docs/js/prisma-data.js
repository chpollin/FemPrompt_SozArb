// PRISMA tool standalone data layer.
// Provides the minimal window.EC surface that prisma.js expects, by loading
// research_vault_v2.json directly -- so the tool runs as its own page (prisma.html)
// without the full Evidence Companion app.

(function() {
'use strict';

const CAT_COLORS = {};
const CATEGORY_SCHEMA = { categories: [], groups: { object: [], perspective: [] } };

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

let papers = [];

// prisma.js reads only getAllPapers, escapeHtml, and CAT_COLORS; the kappa/meta
// surface this shim used to carry was never read on prisma.html (getKappas/getMeta
// belong to the Companion data layer for wissenschat.js and kategorien.js).
window.EC = {
    escapeHtml: escapeHtml,
    CAT_COLORS: CAT_COLORS,
    getCategorySchema: function() { return CATEGORY_SCHEMA; },
    getAllPapers: function() { return papers; }
};

const scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
const dataBase = new URL('../data/', scriptUrl);

Promise.all(['research_vault_v2.json', 'category_schema.json'].map(function(filename) {
    const url = new URL(filename, dataBase);
    return fetch(url).then(function(response) {
        if (!response.ok) throw new Error(filename + ': HTTP ' + response.status);
        return response.json();
    });
}))
    .then(function(payloads) {
        papers = payloads[0].papers || [];
        Object.assign(CATEGORY_SCHEMA, payloads[1]);
        CATEGORY_SCHEMA.categories.forEach(function(category) {
            CAT_COLORS[category.key] = category.color;
        });
        console.log('[PRISMA data] ' + papers.length + ' papers loaded');
        if (window.initializePrisma) window.initializePrisma();
    })
    .catch(function(e) {
        const root = document.getElementById('prisma-root');
        if (root) root.innerHTML = '<p class="pt-empty" style="padding:2rem">Daten konnten nicht geladen werden (' +
            escapeHtml(e.message) + '). Das Tool braucht einen lokalen Server (z. B. python -m http.server) oder GitHub Pages, nicht file://.</p>';
        console.error('[PRISMA data] load failed:', e);
    });

})();
