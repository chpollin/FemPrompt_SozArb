// PRISMA tool standalone data layer.
// Provides the minimal window.EC surface that prisma.js expects, by loading
// research_vault_v2.json directly -- so the tool runs as its own page (prisma.html)
// without the full Evidence Companion app.

(function() {
'use strict';

const CAT_COLORS = {
    'AI_Literacies': '#5b8c5a', 'Generative_KI': '#3a7d7e', 'Prompting': '#4b7bab',
    'KI_Sonstige': '#7c6fae', 'Soziale_Arbeit': '#b0546e', 'Bias_Ungleichheit': '#c2694e',
    'Gender': '#d4943a', 'Diversitaet': '#8a7542', 'Feministisch': '#a24b7a', 'Fairness': '#6a8e4e'
};

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
    getAllPapers: function() { return papers; }
};

fetch('data/research_vault_v2.json')
    .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function(d) {
        papers = d.papers || [];
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
