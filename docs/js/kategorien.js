// Kategorien-Explorer -- each of the 10 categories is an entry point into the
// review's divergence data: rates, divergent papers, and linked concepts.

(function() {
'use strict';

const EC = window.EC;
let initialized = false;
let activeCategory = null;
let nodeLabelMap = null; // conceptId -> label, built once on first detail render

// catLabel turns Bias_Ungleichheit into "Bias Ungleichheit"; only the ampersand
// form is a genuine override, the rest match the underscore-to-space default.
const LABEL_OVERRIDE = { Bias_Ungleichheit: 'Bias & Ungleichheit' };
function label(cat) { return LABEL_OVERRIDE[cat] || EC.catLabel(cat); }
function isTechnik(cat) { return EC.CATEGORIES.indexOf(cat) < 4; }

window.initializeKategorien = function() {
    if (initialized) return;
    initialized = true;

    if (!EC.getKappas()) { console.warn('[Kategorien] no data'); return; }

    renderSpektrum();

    // One delegated listener per stable container instead of rebinding on every
    // detail render.
    document.getElementById('kategorie-spektrum').addEventListener('click', function(e) {
        const card = e.target.closest('.kategorie-card');
        if (card) selectCategory(card.dataset.cat);
    });
    document.getElementById('kategorie-detail').addEventListener('click', function(e) {
        const paper = e.target.closest('.kdetail-paper');
        if (paper) { EC.navigateToPaper(paper.dataset.paperId); return; }
        const concept = e.target.closest('.kdetail-concept');
        if (concept) { EC.focusConcept(concept.dataset.concept); return; }
        const expand = e.target.closest('#kdetail-expand');
        if (expand) {
            document.getElementById('kategorie-detail')
                .querySelectorAll('[data-expandable]').forEach(function(el) { el.style.display = ''; });
            expand.style.display = 'none';
        }
    });

    selectCategory('Gender');
    console.log('[Kategorien] initialized, 10 categories');
};

function renderSpektrum() {
    const container = document.getElementById('kategorie-spektrum');
    if (!container) return;

    const kappas = EC.getKappas();
    let html = '<p class="spektrum-intro">10 Kategorien, zwei Perspektiven -- waehlen Sie eine Kategorie, um die Divergenz zwischen LLM und Expert:innen zu explorieren.</p>';

    html += '<div class="spektrum-groups">';
    html += '<span class="spektrum-group-label">Gegenstand</span>';
    html += '<span class="spektrum-group-label" style="text-align:right;">Perspektive</span>';
    html += '</div>';

    html += '<div class="spektrum-cards">';
    EC.CATEGORIES.forEach(function(cat) {
        const d = kappas[cat];
        if (!d) return;
        const color = EC.CAT_COLORS[cat] || '#999';
        const diff = d.agent_yes_rate - d.human_yes_rate;
        const diffLabel = (diff > 0 ? '+' : '') + Math.round(diff) + 'pp';
        const direction = Math.abs(diff) < 5 ? 'neutral' : diff > 0 ? 'llm-more' : 'human-more';

        html += '<button class="kategorie-card" data-cat="' + cat + '" style="--cat-color:' + color + ';">';
        html += '<span class="kcard-color" style="background:' + color + ';"></span>';
        html += '<span class="kcard-name">' + label(cat) + '</span>';
        html += '<span class="kcard-diff ' + direction + '">' + diffLabel + '</span>';
        html += '</button>';
    });
    html += '</div>';

    container.innerHTML = html;
}

function selectCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.kategorie-card').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    renderDetail(cat);
}

function renderDetail(cat) {
    const container = document.getElementById('kategorie-detail');
    if (!container) return;

    const d = EC.getKappas()[cat];
    if (!d) return;

    const color = EC.CAT_COLORS[cat] || '#999';
    const diff = d.agent_yes_rate - d.human_yes_rate;
    const absDiff = Math.abs(diff);
    let direction = diff > 0 ? 'LLM sieht mehr' : 'Expert:innen sehen mehr';
    if (absDiff < 5) direction = 'Aehnliche Raten';

    const catDivergences = EC.getCategoryDivergences(cat);
    const catConcepts = getCategoryConceptCounts(cat);

    let html = '<div class="kdetail-header" style="border-left-color:' + color + ';">';
    html += '<h3 style="color:' + color + ';">' + label(cat) + '</h3>';
    html += '<p class="kdetail-group">' + (isTechnik(cat) ? 'Gegenstandsdimension' : 'Perspektivendimension') + '</p>';
    html += '</div>';

    html += '<div class="kdetail-rates">';
    html += renderRateBar('Expert:innen', d.human_yes_rate, '#d4943a');
    html += renderRateBar('LLM', d.agent_yes_rate, '#4b7bab');
    html += '<div class="kdetail-diff-label">';
    if (absDiff >= 5) {
        html += '<span style="color:' + (diff > 0 ? '#4b7bab' : '#d4943a') + ';font-weight:600;">' +
            (diff > 0 ? '+' : '') + Math.round(diff) + ' Prozentpunkte</span> &middot; ' + direction;
    } else {
        html += '<span style="color:var(--gray-500);">Geringe Differenz (' + Math.round(absDiff) + 'pp)</span>';
    }
    html += ' &middot; n=' + d.n;
    html += '</div>';
    html += '</div>';

    // Concepts before papers: more compact and immediately visible.
    if (catConcepts.length > 0) {
        html += '<div class="kdetail-section">';
        html += '<h4>Haeufige Konzepte</h4>';
        html += '<div class="kdetail-concepts">';
        catConcepts.slice(0, 10).forEach(function(c) {
            html += '<span class="kdetail-concept" data-concept="' + EC.escapeHtml(c.id) + '">' +
                EC.escapeHtml(c.label) + ' <span class="kdetail-concept-count">' + c.count + '</span></span>';
        });
        html += '</div>';
        html += '</div>';
    }

    catDivergences.sort(function(a, b) {
        return (b.divergence.severity || 0) - (a.divergence.severity || 0);
    });
    const INITIAL_SHOW = 8;

    if (catDivergences.length > 0) {
        html += '<div class="kdetail-section">';
        html += '<h4>Divergenz in dieser Kategorie <span class="kdetail-count">' + catDivergences.length + '</span></h4>';
        html += '<div class="kdetail-papers" id="kdetail-papers-list">';
        catDivergences.forEach(function(p, idx) {
            const cc = p.divergence.category_comparison || {};
            const catComp = cc[cat] || cc[cat.replace(/_/g, ' ')] || {};
            const humanVal = catComp.human === 'Ja' ? 'Ja' : catComp.human === 'Nein' ? 'Nein' : '–';
            const llmVal = catComp.llm === 'Ja' ? 'Ja' : catComp.llm === 'Nein' ? 'Nein' : '–';
            const pattern = p.divergence.pattern || '';
            const patClass = pattern === 'Semantische Expansion' ? 'pattern-badge-semantic'
                         : pattern === 'Keyword-Inklusion' ? 'pattern-badge-keyword'
                         : 'pattern-badge-implicit';

            const hidden = idx >= INITIAL_SHOW ? ' style="display:none;" data-expandable' : '';

            html += '<div class="kdetail-paper" data-paper-id="' + EC.escapeHtml(p.id) + '"' + hidden + '>';
            html += '<div class="kdetail-paper-title">' + EC.escapeHtml(p.title.substring(0, 70)) + (p.title.length > 70 ? '...' : '') + '</div>';
            html += '<div class="kdetail-paper-meta">';
            html += '<span class="kdetail-paper-author">' + EC.escapeHtml(p.author_year || '') + '</span>';
            html += '<span class="kdetail-verdict">';
            html += '<span style="color:#d4943a;">H:' + humanVal + '</span>';
            html += ' <span style="color:var(--gray-300);">/</span> ';
            html += '<span style="color:#4b7bab;">L:' + llmVal + '</span>';
            html += '</span>';
            if (pattern) {
                html += '<span class="pattern-badge ' + patClass + '">' + EC.escapeHtml(pattern) + '</span>';
            }
            html += '</div>';

            if (p.divergence.llm_reasoning) {
                html += '<p class="kdetail-reasoning">' +
                    EC.escapeHtml(p.divergence.llm_reasoning.substring(0, 250)) +
                    (p.divergence.llm_reasoning.length > 250 ? '...' : '') + '</p>';
            }

            html += '</div>';
        });

        if (catDivergences.length > INITIAL_SHOW) {
            html += '<button class="kdetail-expand-btn" id="kdetail-expand">Alle ' +
                catDivergences.length + ' anzeigen</button>';
        }
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}

function renderRateBar(rowLabel, rate, color) {
    return '<div class="kdetail-rate-row">' +
        '<span class="kdetail-rate-label">' + rowLabel + '</span>' +
        '<div class="kdetail-rate-track">' +
            '<div class="kdetail-rate-fill" style="width:' + rate + '%;background:' + color + ';"></div>' +
        '</div>' +
        '<span class="kdetail-rate-value" style="color:' + color + ';">' + Math.round(rate) + '%</span>' +
    '</div>';
}

function getCategoryConceptCounts(cat) {
    const conceptData = EC.getConceptData();
    if (!conceptData || !conceptData.papers) return [];

    if (!nodeLabelMap) {
        nodeLabelMap = {};
        (conceptData.nodes || []).forEach(function(n) { nodeLabelMap[n.id] = n.label; });
    }

    const catPaperIds = new Set();
    EC.getAllPapers().forEach(function(p) {
        const llmYes = p.llm && p.llm.all_categories && p.llm.all_categories[cat];
        const humanYes = p.human && p.human.all_categories && p.human.all_categories[cat];
        if (llmYes || humanYes) catPaperIds.add(p.id);
    });

    const counts = {};
    conceptData.papers.forEach(function(p) {
        if (!catPaperIds.has(p.id)) return;
        (p.concepts || []).forEach(function(c) { counts[c] = (counts[c] || 0) + 1; });
    });

    return Object.keys(counts).map(function(c) {
        return { id: c, label: nodeLabelMap[c] || c, count: counts[c] };
    }).sort(function(a, b) { return b.count - a.count; });
}

})();
