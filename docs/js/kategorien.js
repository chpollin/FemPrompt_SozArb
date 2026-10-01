// Kategorien view: the Landkarte of the expert assessment over Gegenstand x Perspektive,
// then each of the 10 categories as an entry point into the round-one divergence data
// (rates, divergent papers, linked concepts).

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

window.initializeKategorien = function() {
    if (initialized) return;
    initialized = true;

    // The Landkarte reads only the consolidated expert assessment, so it stands even
    // without the round-one comparison data below it.
    initLandkarte();

    if (!EC.getKappas()) { console.warn('[Kategorien] no data'); return; }

    renderSpektrum();

    // One delegated listener per stable container instead of rebinding on every
    // detail render.
    document.getElementById('kategorie-spektrum').addEventListener('click', function(e) {
        const chip = e.target.closest('.category-chip');
        if (chip) selectCategory(chip.dataset.cat);
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

// Landkarte: Gegenstand rows against Perspektive columns. A cell holds the works whose
// consolidated expert assessment carries both categories; it states joint coding in
// the same work, never a relation. Works without that assessment carry no categories.
const DECISIONS = [
    { key: 'include', label: 'Include' },
    { key: 'exclude', label: 'Exclude' },
    { key: 'unclear', label: 'Unclear' },
];
let landkarte = null; // { rows, cols, cells: {row: {col: [paper]}}, max }
let selectedCell = null; // 'row|col'
let cellTip = null;

function decisionKey(paper) {
    const d = paper.human.decision;
    return d === 'Include' ? 'include' : d === 'Exclude' ? 'exclude' : 'unclear';
}

function buildLandkarte() {
    const groups = EC.categoryGroups();
    const rows = (groups.object || []).slice();
    const cols = (groups.perspective || []).slice();
    const cells = {};
    rows.forEach(function(row) {
        cells[row] = {};
        cols.forEach(function(col) { cells[row][col] = []; });
    });
    let assessed = 0;
    EC.getAllPapers().forEach(function(paper) {
        const human = paper.human;
        if (!human || !human.decision) return;
        assessed++;
        const cats = human.all_categories || {};
        rows.forEach(function(row) {
            if (cats[row] !== 1) return;
            cols.forEach(function(col) { if (cats[col] === 1) cells[row][col].push(paper); });
        });
    });
    let max = 0;
    rows.forEach(function(row) { cols.forEach(function(col) { max = Math.max(max, cells[row][col].length); }); });
    return { rows: rows, cols: cols, cells: cells, max: max, assessed: assessed, total: EC.getAllPapers().length };
}

function tally(papers) {
    const counts = { include: 0, exclude: 0, unclear: 0 };
    papers.forEach(function(paper) { counts[decisionKey(paper)]++; });
    return counts;
}

function tallyText(papers) {
    const counts = tally(papers);
    return DECISIONS.filter(function(d) { return counts[d.key] || d.key !== 'unclear'; })
        .map(function(d) { return counts[d.key] + ' ' + d.label; }).join(', ');
}

function chipFor(cat) {
    return EC.categoryChip({ key: cat, label: label(cat), color: EC.CAT_COLORS[cat] }, { small: true });
}

function cellLabel(row, col, papers) {
    return label(row) + ' und ' + label(col) + ', gemeinsam codiert in ' + EC.workCount(papers.length) +
        (papers.length ? ', ' + tallyText(papers) : '');
}

// One scale for the whole matrix: the bar track is the largest cell.
function cellHtml(row, col) {
    const papers = landkarte.cells[row][col];
    if (!papers.length) {
        return '<td><span class="lk-cell lk-cell--empty" aria-label="' + EC.escapeHtml(cellLabel(row, col, papers)) + '">0</span></td>';
    }
    const counts = tally(papers);
    const width = (papers.length / landkarte.max * 100).toFixed(1);
    const segments = DECISIONS.filter(function(d) { return counts[d.key]; }).map(function(d) {
        return '<span class="lk-seg lk-seg--' + d.key + '" style="flex-grow:' + counts[d.key] + '"></span>';
    }).join('');
    const key = row + '|' + col;
    return '<td><button type="button" class="lk-cell" data-row="' + EC.escapeHtml(row) + '" data-col="' + EC.escapeHtml(col) +
        '" data-count="' + papers.length + '" aria-pressed="' + (selectedCell === key) + '" aria-label="' +
        EC.escapeHtml(cellLabel(row, col, papers)) + '">' +
        '<span class="lk-count" aria-hidden="true">' + papers.length + '</span>' +
        '<span class="lk-track" aria-hidden="true"><span class="lk-bar" style="width:' + width + '%">' + segments + '</span></span>' +
        '</button></td>';
}

function swatch(key) { return '<span class="lk-swatch lk-seg--' + key + '" aria-hidden="true"></span>'; }

function renderLandkarte() {
    const root = document.getElementById('landkarte');
    if (!root) return;
    const lk = landkarte;
    const unclear = lk.rows.some(function(row) {
        return lk.cols.some(function(col) { return tally(lk.cells[row][col]).unclear > 0; });
    });
    let html = '<p class="lk-caption" id="landkarte-caption">Gemeinsam codiert in denselben Werken, Einschätzung der Expert:innen, ' +
        lk.assessed + ' von ' + lk.total + ' Werken eingeschätzt</p>';
    html += '<div class="lk-layout"><div class="lk-main">';
    html += '<div class="lk-wrap" role="region" tabindex="0" aria-label="Landkarte, horizontal verschiebbar">';
    html += '<table class="lk-table" aria-labelledby="landkarte-caption"><thead><tr>' +
        '<th scope="col" class="lk-corner"><span>Gegenstand</span> <span aria-hidden="true">×</span> <span>Perspektive</span></th>';
    lk.cols.forEach(function(col) { html += '<th scope="col" class="lk-col">' + chipFor(col) + '</th>'; });
    html += '</tr></thead><tbody>';
    lk.rows.forEach(function(row) {
        html += '<tr><th scope="row" class="lk-row">' + chipFor(row) + '</th>';
        lk.cols.forEach(function(col) { html += cellHtml(row, col); });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<p class="lk-legend">' + DECISIONS.filter(function(d) { return d.key !== 'unclear' || unclear; }).map(function(d) {
        return '<span class="lk-legend-item">' + swatch(d.key) + d.label + '</span>';
    }).join('') + '<span class="lk-legend-item">Balkenlänge 0 bis ' + lk.max + ' Werke</span></p>';
    html += '</div><section class="lk-works" id="landkarte-works" aria-labelledby="landkarte-works-title" hidden></section></div>';
    root.innerHTML = html;
}

function decisionLabel(paper) {
    const key = decisionKey(paper);
    return DECISIONS.filter(function(d) { return d.key === key; })[0].label;
}

function renderWorks() {
    const box = document.getElementById('landkarte-works');
    if (!box) return;
    if (!selectedCell) { box.hidden = true; box.innerHTML = ''; return; }
    const parts = selectedCell.split('|');
    const order = { include: 0, exclude: 1, unclear: 2 };
    const papers = landkarte.cells[parts[0]][parts[1]].slice().sort(function(a, b) {
        return order[decisionKey(a)] - order[decisionKey(b)] || (b.year || 0) - (a.year || 0) ||
            String(a.author_year || '').localeCompare(String(b.author_year || ''), 'de');
    });
    // The Korpus detail is the work view for every record of the working data; the
    // release Werk view covers released works only.
    box.innerHTML = '<h3 class="lk-works-title" id="landkarte-works-title" tabindex="-1">' + chipFor(parts[0]) +
        ' <span class="lk-and">und</span> ' + chipFor(parts[1]) + '</h3>' +
        '<p class="lk-works-count">' + EC.escapeHtml(EC.workCount(papers.length) + ', ' + tallyText(papers)) + '</p>' +
        '<ol class="lk-list" role="list">' + papers.map(function(paper) {
            return '<li class="lk-item" data-decision="' + decisionKey(paper) + '">' + swatch(decisionKey(paper)) +
                '<a class="lk-item-title" href="#view=korpus&amp;paper=' + encodeURIComponent(paper.id) + '">' + EC.escapeHtml(paper.title) + '</a>' +
                '<span class="lk-item-meta"><span class="lk-dec">' + decisionLabel(paper) + '</span>' +
                (paper.author_year ? ', ' + EC.escapeHtml(paper.author_year) : '') + '</span></li>';
        }).join('') + '</ol>';
    box.hidden = false;
}

function selectCell(key, focusList) {
    selectedCell = selectedCell === key ? null : key;
    document.querySelectorAll('#landkarte .lk-cell[aria-pressed]').forEach(function(btn) {
        btn.setAttribute('aria-pressed', String(btn.dataset.row + '|' + btn.dataset.col === selectedCell));
    });
    renderWorks();
    if (selectedCell && focusList) {
        const title = document.getElementById('landkarte-works-title');
        // On narrow screens the list stands below the matrix and would be out of view.
        if (title && title.getBoundingClientRect().top > window.innerHeight) title.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}

// Reuses the look of the navigation tooltips (.rich-tooltip). The cell's aria-label
// already carries the same text, so the tooltip is hidden from assistive technology.
function showTip(cell) {
    if (!cellTip) {
        cellTip = document.createElement('div');
        cellTip.className = 'rich-tooltip lk-tip';
        cellTip.setAttribute('aria-hidden', 'true');
        cellTip.innerHTML = '<div class="tip-text"></div>';
        document.body.appendChild(cellTip);
    }
    const papers = landkarte.cells[cell.dataset.row][cell.dataset.col];
    cellTip.firstChild.innerHTML = '<strong>' + EC.escapeHtml(label(cell.dataset.row) + ' und ' + label(cell.dataset.col)) + '</strong><br>' +
        EC.escapeHtml(EC.workCount(papers.length) + ', ' + tallyText(papers));
    cellTip.hidden = false;
    const rect = cell.getBoundingClientRect();
    const box = cellTip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - box.width / 2;
    let top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + box.width > window.innerWidth - 8) left = window.innerWidth - box.width - 8;
    if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 8;
    cellTip.style.left = left + window.scrollX + 'px';
    cellTip.style.top = top + window.scrollY + 'px';
}

function hideTip() { if (cellTip) cellTip.hidden = true; }

function initLandkarte() {
    const root = document.getElementById('landkarte');
    if (!root) return;
    landkarte = buildLandkarte();
    renderLandkarte();
    root.addEventListener('click', function(e) {
        const cell = e.target.closest('button.lk-cell');
        if (cell) { hideTip(); selectCell(cell.dataset.row + '|' + cell.dataset.col, true); }
    });
    root.addEventListener('mouseover', function(e) {
        const cell = e.target.closest('button.lk-cell');
        if (cell) showTip(cell);
    });
    root.addEventListener('mouseout', function(e) {
        const cell = e.target.closest('button.lk-cell');
        if (cell && !cell.contains(e.relatedTarget) && document.activeElement !== cell) hideTip();
    });
    root.addEventListener('focusin', function(e) {
        const cell = e.target.closest('button.lk-cell');
        if (cell && cell.matches(':focus-visible')) showTip(cell); else hideTip();
    });
    root.addEventListener('focusout', hideTip);
    root.addEventListener('scroll', hideTip, true);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hideTip(); });
}

function renderSpektrum() {
    const container = document.getElementById('kategorie-spektrum');
    if (!container) return;

    const kappas = EC.getKappas();
    // One single-select chip per category, grouped Gegenstand | Perspektive like the
    // Korpus filter, each with its rate difference between LLM and Expert:innen.
    const keys = EC.CATEGORIES.filter(function(cat) { return kappas[cat]; });
    const html = '<p class="category-chips">' + EC.categoryChipRow(keys.map(function(cat) {
        const d = kappas[cat];
        const diff = d.agent_yes_rate - d.human_yes_rate;
        const direction = Math.abs(diff) < 5 ? 'neutral' : diff > 0 ? 'llm-more' : 'human-more';
        return {
            category: { key: cat, label: label(cat), color: EC.CAT_COLORS[cat] },
            options: { pressed: cat === activeCategory, extra: ' <span class="kcard-diff ' + direction + '">' + (diff > 0 ? '+' : '') + Math.round(diff) + 'pp</span>' },
        };
    }), EC.categoryGroups()) + '</p>';

    container.innerHTML = html;
}

function selectCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('#kategorie-spektrum .category-chip').forEach(function(btn) {
        btn.setAttribute('aria-pressed', String(btn.dataset.cat === cat));
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
            const catComp = cc[cat] || {};
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
