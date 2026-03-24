// Kategorien-Explorer -- Category-based exploration of the review's analytical framework
// Each of the 10 categories becomes an interactive entry point into the data

(function() {
'use strict';

var EC = window.EC;
var initialized = false;
var activeCategory = null;

// Category order: Gegenstand -> Perspektive (matching the spectrum)
var CAT_ORDER = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender',
    'Diversitaet', 'Feministisch', 'Fairness'
];

var CAT_LABELS = {
    'AI_Literacies': 'AI Literacies',
    'Generative_KI': 'Generative KI',
    'Prompting': 'Prompting',
    'KI_Sonstige': 'KI Sonstige',
    'Soziale_Arbeit': 'Soziale Arbeit',
    'Bias_Ungleichheit': 'Bias & Ungleichheit',
    'Gender': 'Gender',
    'Diversitaet': 'Diversitaet',
    'Feministisch': 'Feministisch',
    'Fairness': 'Fairness'
};

var CAT_GROUP = {
    'AI_Literacies': 'technik', 'Generative_KI': 'technik',
    'Prompting': 'technik', 'KI_Sonstige': 'technik',
    'Soziale_Arbeit': 'sozial', 'Bias_Ungleichheit': 'sozial',
    'Gender': 'sozial', 'Diversitaet': 'sozial',
    'Feministisch': 'sozial', 'Fairness': 'sozial'
};

// ============================================================
// Init
// ============================================================

window.initializeKategorien = function() {
    if (initialized) return;
    initialized = true;

    var kappas = EC.getKappas();
    if (!kappas) { console.warn('[Kategorien] no data'); return; }

    renderSpektrum();
    // Open the most interesting category by default
    selectCategory('Gender');

    console.log('[Kategorien] initialized, 10 categories');
};

// ============================================================
// Spektrum Rendering
// ============================================================

function renderSpektrum() {
    var container = document.getElementById('kategorie-spektrum');
    if (!container) return;

    var kappas = EC.getKappas();
    var html = '';

    // Bug 6 fix: context line
    html += '<p class="spektrum-intro">10 Kategorien, zwei Perspektiven -- waehlen Sie eine Kategorie, um die Divergenz zwischen LLM und Expert:innen zu explorieren.</p>';

    // Group labels
    html += '<div class="spektrum-groups">';
    html += '<span class="spektrum-group-label">Gegenstand</span>';
    html += '<span class="spektrum-group-label" style="text-align:right;">Perspektive</span>';
    html += '</div>';

    // Bug 5 fix: connected spectrum with gradient border
    html += '<div class="spektrum-cards">';
    CAT_ORDER.forEach(function(cat) {
        var d = kappas[cat];
        if (!d) return;
        var color = EC.CAT_COLORS[cat] || '#999';
        var diff = d.agent_yes_rate - d.human_yes_rate;
        var diffLabel = (diff > 0 ? '+' : '') + Math.round(diff) + 'pp';
        var direction = Math.abs(diff) < 5 ? 'neutral' : diff > 0 ? 'llm-more' : 'human-more';

        html += '<button class="kategorie-card" data-cat="' + cat + '" style="--cat-color:' + color + ';">';
        html += '<span class="kcard-color" style="background:' + color + ';"></span>';
        html += '<span class="kcard-name">' + CAT_LABELS[cat] + '</span>';
        html += '<span class="kcard-diff ' + direction + '">' + diffLabel + '</span>';
        html += '</button>';
    });
    html += '</div>';

    container.innerHTML = html;

    // Click handlers
    container.querySelectorAll('.kategorie-card').forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectCategory(btn.dataset.cat);
        });
    });
}

function selectCategory(cat) {
    activeCategory = cat;

    // Update active state
    document.querySelectorAll('.kategorie-card').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.cat === cat);
    });

    renderDetail(cat);
}

// ============================================================
// Detail Rendering
// ============================================================

function renderDetail(cat) {
    var container = document.getElementById('kategorie-detail');
    if (!container) return;

    var kappas = EC.getKappas();
    var d = kappas[cat];
    if (!d) return;

    var color = EC.CAT_COLORS[cat] || '#999';
    var diff = d.agent_yes_rate - d.human_yes_rate;
    var absDiff = Math.abs(diff);
    var direction = diff > 0 ? 'LLM sieht mehr' : 'Expert:innen sehen mehr';
    if (absDiff < 5) direction = 'Aehnliche Raten';

    // Get divergent papers for this category
    var catDivergences = EC.getCategoryDivergences(cat);

    // Get concepts linked to papers in this category
    var catConcepts = getCategoryConceptCounts(cat);

    var html = '';

    // Header with rates
    html += '<div class="kdetail-header" style="border-left-color:' + color + ';">';
    html += '<h3 style="color:' + color + ';">' + CAT_LABELS[cat] + '</h3>';
    html += '<p class="kdetail-group">' + (CAT_GROUP[cat] === 'technik' ? 'Gegenstandsdimension' : 'Perspektivendimension') + '</p>';
    html += '</div>';

    // Rate comparison
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

    // Bug 4 fix: Concepts BEFORE papers (more compact, immediately visible)
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

    // Bug 2 fix: Sort by severity, limit to 8, expandable
    catDivergences.sort(function(a, b) {
        return (b.divergence.severity || 0) - (a.divergence.severity || 0);
    });
    var INITIAL_SHOW = 8;

    if (catDivergences.length > 0) {
        html += '<div class="kdetail-section">';
        html += '<h4>Divergenz in dieser Kategorie <span class="kdetail-count">' + catDivergences.length + '</span></h4>';
        html += '<div class="kdetail-papers" id="kdetail-papers-list">';
        catDivergences.forEach(function(p, idx) {
            var catComp = p.divergence.category_comparison[cat] || {};
            // Bug 1 fix: Fallback for missing values
            var humanVal = catComp.human || '\u2013';
            var llmVal = catComp.llm || '\u2013';
            var pattern = p.divergence.pattern || '';
            var patClass = pattern === 'Semantische Expansion' ? 'pattern-badge-semantic'
                         : pattern === 'Keyword-Inklusion' ? 'pattern-badge-keyword'
                         : 'pattern-badge-implicit';

            var hidden = idx >= INITIAL_SHOW ? ' style="display:none;" data-expandable' : '';

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

            // Bug 3 fix: Better readable reasoning (250 chars, darker, not italic)
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

    // Click handlers: papers -> korpus detail
    container.querySelectorAll('.kdetail-paper').forEach(function(el) {
        el.addEventListener('click', function() {
            var paperId = el.dataset.paperId;
            var paper = EC.getAllPapers().find(function(p) { return p.id === paperId; });
            if (paper) {
                if (window.switchView) window.switchView('korpus');
                EC.showPaperDetail(paper);
            }
        });
    });

    // Click handlers: concepts -> wissensnetz
    container.querySelectorAll('.kdetail-concept').forEach(function(el) {
        el.addEventListener('click', function() {
            var conceptId = el.dataset.concept;
            EC.focusConcept(conceptId);
        });
    });

    // Expand button handler
    var expandBtn = document.getElementById('kdetail-expand');
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            container.querySelectorAll('[data-expandable]').forEach(function(el) {
                el.style.display = '';
            });
            expandBtn.style.display = 'none';
        });
    }
}

function renderRateBar(label, rate, color) {
    return '<div class="kdetail-rate-row">' +
        '<span class="kdetail-rate-label">' + label + '</span>' +
        '<div class="kdetail-rate-track">' +
            '<div class="kdetail-rate-fill" style="width:' + rate + '%;background:' + color + ';"></div>' +
        '</div>' +
        '<span class="kdetail-rate-value" style="color:' + color + ';">' + Math.round(rate) + '%</span>' +
    '</div>';
}

// ============================================================
// Helpers
// ============================================================

function getCategoryConceptCounts(cat) {
    var conceptData = EC.getConceptData();
    if (!conceptData || !conceptData.papers) return [];

    // Find papers where this category is true (from LLM or human)
    var catPaperIds = new Set();
    EC.getAllPapers().forEach(function(p) {
        var llmYes = p.llm && p.llm.all_categories && p.llm.all_categories[cat];
        var humanYes = p.human && p.human.all_categories && p.human.all_categories[cat];
        if (llmYes || humanYes) catPaperIds.add(p.id);
    });

    // Count concepts in those papers
    var counts = {};
    conceptData.papers.forEach(function(p) {
        if (!catPaperIds.has(p.id)) return;
        (p.concepts || []).forEach(function(c) {
            counts[c] = (counts[c] || 0) + 1;
        });
    });

    // Sort by count
    return Object.keys(counts).map(function(c) {
        var node = conceptData.nodes ? conceptData.nodes.find(function(n) { return n.id === c; }) : null;
        return { id: c, label: node ? node.label : c, count: counts[c] };
    }).sort(function(a, b) { return b.count - a.count; });
}

})();
