// Evidence Companion - Feministische AI Literacies
// Systematischer Review -- Interaktive Evidenz

const CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender',
    'Diversitaet', 'Feministisch', 'Fairness'
];

// Global state
let allPapers = [];
let filteredPapers = [];
let vaultMeta = {};
let kappas = {};
let fuse = null;
let activeCategories = new Set();
let benchmarkInitialized = false;
let wissensnetzInitialized = false;
let conceptData = null; // from promptotyping_v2.json
let currentPage = 1;
let currentSort = 'relevance'; // default: Include first, then year
const PAGE_SIZE = 50;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        initializeUI();
        renderIntroNumbers();
        renderCategoryChips();
        applyFilters(); // applies default sort + renders
        _logInit();
    } catch (error) {
        console.error('[Evidence] init failed:', error);
        document.getElementById('papers-grid').innerHTML =
            '<p style="padding:2rem;color:var(--danger);">' + escapeHtml(error.message) + '</p>';
    }
});

function _logInit() {
    const withDecision = allPapers.filter(p => p.benchmark.has_human && p.human && p.human.decision).length;
    const disagreements = allPapers.filter(p => p.benchmark.agreement === false).length;
    const kappa = (vaultMeta.kappa_overall || 0).toFixed(3);
    console.log('[Evidence] ' + allPapers.length + ' papers | ' + withDecision + ' human decisions | ' + disagreements + ' divergences | kappa=' + kappa);
}

// Load data
async function loadData() {
    const res = await fetch('data/research_vault_v2.json');
    if (!res.ok) throw new Error('Daten konnten nicht geladen werden');
    const data = await res.json();
    allPapers = data.papers;
    vaultMeta = data.meta;
    kappas = data.kappa_by_category;
    filteredPapers = [...allPapers];

    fuse = new Fuse(allPapers, {
        keys: ['title', 'author_year', 'abstract'],
        threshold: 0.3,
        includeScore: true
    });

    // Load concept data for Wissensnetz
    try {
        var ptRes = await fetch('data/promptotyping_v2.json');
        if (ptRes.ok) {
            var ptData = await ptRes.json();
            conceptData = {
                nodes: ptData.concepts.nodes,
                edges: ptData.concepts.edges,
                papers: ptData.papers
            };
        }
    } catch (e) {
        console.warn('[Evidence] Concept data not available:', e.message);
    }
}

// Initialize UI
function initializeUI() {
    document.getElementById('search-box').addEventListener('input', handleSearch);
    document.getElementById('filter-decision').addEventListener('change', applyFilters);
    document.getElementById('filter-human').addEventListener('change', applyFilters);
    document.getElementById('filter-year').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', function() {
        currentSort = this.value;
        applyFilters();
    });

    // View navigation (Korpus / Bewertungsvergleich)
    document.querySelectorAll('.view-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var viewId = tab.dataset.view;
            document.querySelectorAll('.view-tab').forEach(function(t) {
                t.classList.toggle('active', t.dataset.view === viewId);
            });
            document.querySelectorAll('.view-content').forEach(function(v) {
                v.classList.toggle('active', v.id === 'view-' + viewId);
                v.style.display = v.id === 'view-' + viewId ? '' : 'none';
            });
            // Lazy-init on first visit
            if (viewId === 'vergleich' && !benchmarkInitialized) {
                initializeBenchmark();
                benchmarkInitialized = true;
            }
            if (viewId === 'wissensnetz' && !wissensnetzInitialized && conceptData) {
                wissensnetzInitialized = true;
                if (window.initWissensnetz) {
                    window.initWissensnetz(conceptData.nodes, conceptData.edges, conceptData.papers);
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePaperModal();
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }
    });
}

// Intro numbers
function renderIntroNumbers() {
    // Count papers where human actually made a decision (Include/Exclude)
    var withDecision = allPapers.filter(function(p) {
        return p.human && p.human.decision && (p.human.decision === 'Include' || p.human.decision === 'Exclude');
    }).length;
    var el = function(id) { return document.getElementById(id); };
    if (el('total-count-intro')) el('total-count-intro').textContent = allPapers.length;
    if (el('human-count-intro')) el('human-count-intro').textContent = withDecision;
    if (el('llm-count-intro')) el('llm-count-intro').textContent = allPapers.length;
}

// Category chips
function renderCategoryChips() {
    var container = document.getElementById('category-chips');
    var technik = CATEGORIES.slice(0, 4);
    var sozial = CATEGORIES.slice(4);

    function chipHtml(cat) {
        var label = cat.replace(/_/g, ' ');
        var color = CAT_COLORS[cat];
        return '<button class="category-chip" data-cat="' + cat + '">' +
            '<span class="chip-dot" style="background:' + color + '"></span>' + label +
        '</button>';
    }

    container.innerHTML =
        '<span class="chip-group-label">Gegenstand</span>' +
        technik.map(chipHtml).join('') +
        '<span class="chip-group-sep"></span>' +
        '<span class="chip-group-label">Perspektive</span>' +
        sozial.map(chipHtml).join('');

    container.addEventListener('click', function(e) {
        var chip = e.target.closest('.category-chip');
        if (!chip) return;
        var cat = chip.dataset.cat;
        if (activeCategories.has(cat)) {
            activeCategories.delete(cat);
        } else {
            activeCategories.add(cat);
        }
        container.querySelectorAll('.category-chip').forEach(function(c) {
            c.classList.toggle('active', activeCategories.has(c.dataset.cat));
        });
        applyFilters();
    });
}

// Search
function handleSearch(e) {
    var query = e.target.value.trim();
    if (query.length === 0) {
        filteredPapers = allPapers.slice();
    } else {
        filteredPapers = fuse.search(query).map(function(r) { return r.item; });
    }
    applyFilters();
}

// Sort helper
function sortPapers(papers, sortBy) {
    var sorted = papers.slice();
    switch (sortBy) {
        case 'relevance':
            // Include first, then by year descending
            sorted.sort(function(a, b) {
                var aInc = a.llm.decision === 'Include' ? 0 : 1;
                var bInc = b.llm.decision === 'Include' ? 0 : 1;
                if (aInc !== bInc) return aInc - bInc;
                return (b.year || 0) - (a.year || 0);
            });
            break;
        case 'year':
            sorted.sort(function(a, b) { return (b.year || 0) - (a.year || 0); });
            break;
        case 'author':
            sorted.sort(function(a, b) { return (a.author_year || '').localeCompare(b.author_year || ''); });
            break;
        case 'title':
            sorted.sort(function(a, b) { return (a.title || '').localeCompare(b.title || ''); });
            break;
        case 'llm':
            sorted.sort(function(a, b) {
                var aInc = a.llm.decision === 'Include' ? 0 : 1;
                var bInc = b.llm.decision === 'Include' ? 0 : 1;
                return aInc - bInc;
            });
            break;
        case 'human':
            sorted.sort(function(a, b) {
                var aVal = !a.human || !a.human.decision ? 2 : (a.human.decision === 'Include' ? 0 : 1);
                var bVal = !b.human || !b.human.decision ? 2 : (b.human.decision === 'Include' ? 0 : 1);
                return aVal - bVal;
            });
            break;
        case 'status':
            sorted.sort(function(a, b) {
                var order = { 'false': 0, 'true': 1, 'null': 2 };
                var aVal = order[String(a.benchmark.agreement)] || 2;
                var bVal = order[String(b.benchmark.agreement)] || 2;
                return aVal - bVal;
            });
            break;
    }
    return sorted;
}

// Filters
function applyFilters() {
    var decision = document.getElementById('filter-decision').value;
    var humanStatus = document.getElementById('filter-human').value;
    var year = document.getElementById('filter-year').value;

    var filtered = filteredPapers.slice();

    if (decision !== 'all') {
        filtered = filtered.filter(function(p) { return p.llm.decision === decision; });
    }

    if (humanStatus === 'has_human') {
        filtered = filtered.filter(function(p) { return p.benchmark.has_human; });
    } else if (humanStatus === 'agreement') {
        filtered = filtered.filter(function(p) { return p.benchmark.has_human && p.benchmark.agreement === true; });
    } else if (humanStatus === 'disagreement') {
        filtered = filtered.filter(function(p) { return p.benchmark.has_human && p.benchmark.agreement === false; });
    } else if (humanStatus === 'no_human') {
        filtered = filtered.filter(function(p) { return !p.benchmark.has_human; });
    }

    if (year !== 'all') {
        if (year === '2021') {
            filtered = filtered.filter(function(p) { return p.year && p.year <= 2021; });
        } else {
            filtered = filtered.filter(function(p) { return p.year == parseInt(year); });
        }
    }

    if (activeCategories.size > 0) {
        filtered = filtered.filter(function(p) {
            return Array.from(activeCategories).every(function(cat) { return p.llm.all_categories[cat] === 1; });
        });
    }

    // Sort
    filtered = sortPapers(filtered, currentSort);

    currentPage = 1;
    renderPapers(filtered);
}

// ============================================================
// Table Rendering
// ============================================================

function renderPapers(papers) {
    if (!papers) papers = filteredPapers;
    var container = document.getElementById('papers-grid');
    var resultsCount = document.getElementById('results-count');
    var totalCount = document.getElementById('total-count');
    if (resultsCount) resultsCount.textContent = papers.length;
    if (totalCount) totalCount.textContent = allPapers.length;

    if (papers.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Papers gefunden.</p>';
        return;
    }

    // Pagination
    var totalPages = Math.ceil(papers.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = 1;
    var start = (currentPage - 1) * PAGE_SIZE;
    var pageItems = papers.slice(start, start + PAGE_SIZE);

    var rows = pageItems.map(function(p, i) {
        var idx = start + i;
        var titleShort = p.title.length > 80 ? p.title.substring(0, 77) + '...' : p.title;
        var authorShort = (p.author_year || '').length > 22 ? (p.author_year || '').substring(0, 20) + '...' : (p.author_year || '');
        var divergeClass = p.benchmark.agreement === false ? ' row--diverge' : '';

        return '<tr class="paper-row' + divergeClass + '" data-idx="' + idx + '">' +
            '<td class="col-title" title="' + escapeHtml(p.title) + '">' + escapeHtml(titleShort) + '</td>' +
            '<td class="col-author">' + escapeHtml(authorShort) + '</td>' +
            '<td class="col-year">' + (p.year || '') + '</td>' +
            '<td class="col-dec">' + decBadge(p.llm.decision) + '</td>' +
            '<td class="col-dec">' + decBadge(p.human ? p.human.decision : null) + '</td>' +
            '<td class="col-status">' + statusBadge(p) + '</td>' +
            '<td class="col-cats"><div class="cat-labels">' + catLabels(p) + '</div></td>' +
        '</tr>';
    }).join('');

    // Sort indicator
    function sortArrow(col) {
        return currentSort === col ? ' <span class="sort-arrow">&#9660;</span>' : '';
    }

    var html = '<table class="papers-table">' +
        '<thead><tr>' +
            '<th class="col-title sortable" data-sort="title">Titel' + sortArrow('title') + '</th>' +
            '<th class="col-author sortable" data-sort="author">Autor' + sortArrow('author') + '</th>' +
            '<th class="col-year sortable" data-sort="year">Jahr' + sortArrow('year') + '</th>' +
            '<th class="col-dec sortable" data-sort="llm">LLM' + sortArrow('llm') + '</th>' +
            '<th class="col-dec sortable" data-sort="human">Human' + sortArrow('human') + '</th>' +
            '<th class="col-status sortable" data-sort="status">Status' + sortArrow('status') + '</th>' +
            '<th class="col-cats">Kategorien</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';

    // Pagination
    if (totalPages > 1) {
        html += '<div class="pagination">';
        if (currentPage > 1) html += '<button class="page-btn" data-page="' + (currentPage - 1) + '">&laquo;</button>';
        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
            } else if (i === 2 || i === totalPages - 1) {
                html += '<span class="page-ellipsis">&hellip;</span>';
            }
        }
        if (currentPage < totalPages) html += '<button class="page-btn" data-page="' + (currentPage + 1) + '">&raquo;</button>';
        html += '</div>';
    }

    container.innerHTML = html;

    // Event: row click
    container.querySelectorAll('tr[data-idx]').forEach(function(row) {
        row.addEventListener('click', function() {
            showPaperDetail(papers[parseInt(row.dataset.idx)], papers);
        });
    });

    // Event: pagination
    container.querySelectorAll('.page-btn[data-page]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentPage = parseInt(btn.dataset.page);
            renderPapers(papers);
            document.getElementById('papers-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Event: column sort
    container.querySelectorAll('.sortable').forEach(function(th) {
        th.addEventListener('click', function() {
            currentSort = th.dataset.sort;
            // Update the select to match (if applicable)
            var sel = document.getElementById('sort-by');
            if (sel.querySelector('option[value="' + currentSort + '"]')) {
                sel.value = currentSort;
            }
            applyFilters();
        });
    });
}

// Table cell helpers
function decBadge(decision) {
    if (!decision) return '<span class="dec-cell dec-cell--none">&mdash;</span>';
    if (decision === 'Include') return '<span class="dec-cell dec-cell--include">Incl</span>';
    return '<span class="dec-cell dec-cell--exclude">Excl</span>';
}

function statusBadge(paper) {
    if (!paper.benchmark.has_human || !paper.human || !paper.human.decision) {
        return '<span class="status-pill status-pill--llmonly">nur LLM</span>';
    }
    if (paper.benchmark.agreement === true) {
        return '<span class="status-pill status-pill--agree">Konsens</span>';
    }
    return '<span class="status-pill status-pill--diverge">Divergenz</span>';
}

// Category colors: 10 distinct hues across a spectrum (Gegenstand → Perspektive)
// No gendered color coding. Perceptually distinct, works for colorblind users.
var CAT_COLORS = {
    // Gegenstand (4 categories)
    'AI_Literacies':    '#5b8c5a', // sage green
    'Generative_KI':    '#3a7d7e', // teal
    'Prompting':        '#4b7bab', // steel blue
    'KI_Sonstige':      '#7c6fae', // soft purple
    // Perspektive (6 categories)
    'Soziale_Arbeit':   '#b0546e', // dusty rose
    'Bias_Ungleichheit':'#c2694e', // terracotta
    'Gender':           '#d4943a', // amber
    'Diversitaet':      '#8a7542', // olive gold
    'Feministisch':     '#a24b7a', // plum
    'Fairness':         '#6a8e4e', // moss green
};

function catLabels(paper) {
    var html = '';
    CATEGORIES.forEach(function(cat, i) {
        // Visual separator between Technik (0-3) and Sozial (4-9)
        if (i === 4) html += '<span class="cat-dot-sep"></span>';
        var active = paper.llm.all_categories[cat] === 1;
        var color = active ? CAT_COLORS[cat] : '#e0ddd9';
        html += '<span class="cat-dot-color" style="background:' + color + '" title="' + cat.replace(/_/g, ' ') + (active ? ': Ja' : ': Nein') + '"></span>';
    });
    return html;
}

// ============================================================
// Paper Detail Panel
// ============================================================

var currentDetailPaper = null;
var currentDetailList = null;

function showPaperDetail(paper, paperList) {
    currentDetailPaper = paper;
    if (paperList) currentDetailList = paperList;
    var modal = document.getElementById('paper-modal');
    document.getElementById('modal-title').textContent = paper.title;
    document.getElementById('modal-author').textContent =
        (paper.author_year || '') + (paper.year ? ' | ' + paper.year : '') + (paper.item_type ? ' | ' + paper.item_type : '');

    var bodyHtml = buildDetailContent(paper);

    // Prev/Next navigation
    if (currentDetailList && currentDetailList.length > 1) {
        var idx = currentDetailList.indexOf(paper);
        bodyHtml += '<div class="detail-nav">';
        if (idx > 0) {
            bodyHtml += '<button class="detail-nav-btn" id="detail-prev"><i class="fas fa-arrow-left"></i> Vorheriges</button>';
        }
        if (idx < currentDetailList.length - 1) {
            bodyHtml += '<button class="detail-nav-btn" id="detail-next" style="margin-left:auto;">Naechstes <i class="fas fa-arrow-right"></i></button>';
        }
        bodyHtml += '</div>';
    }

    document.getElementById('modal-body').innerHTML = bodyHtml;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll panel to top
    modal.querySelector('.modal-content').scrollTop = 0;

    // Nav button handlers
    var prevBtn = document.getElementById('detail-prev');
    var nextBtn = document.getElementById('detail-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            var idx = currentDetailList.indexOf(currentDetailPaper);
            if (idx > 0) showPaperDetail(currentDetailList[idx - 1]);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            var idx = currentDetailList.indexOf(currentDetailPaper);
            if (idx < currentDetailList.length - 1) showPaperDetail(currentDetailList[idx + 1]);
        });
    }
}

function closePaperModal() {
    document.getElementById('paper-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function buildDetailContent(paper) {
    var html = '';

    // Abstract
    if (paper.abstract && paper.abstract.trim()) {
        html += '<div class="detail-section">' +
            '<h3>Abstract</h3>' +
            '<p class="detail-text">' + escapeHtml(paper.abstract) + '</p>' +
        '</div>';
    }

    // Links
    var links = [];
    if (paper.doi && paper.doi !== 'nan') {
        links.push('<a href="https://doi.org/' + escapeHtml(paper.doi) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-external-link-alt"></i> DOI: ' + escapeHtml(paper.doi) + '</a>');
    }
    if (paper.url && paper.url !== 'nan' && paper.url !== '') {
        links.push('<a href="' + escapeHtml(paper.url) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-globe"></i> Quelle</a>');
    }
    if (paper.knowledge_doc) {
        links.push('<a href="#" onclick="downloadKnowledgeDoc(\'' + escapeHtml(paper.knowledge_doc) + '\', \'' + escapeHtml(paper.title).replace(/'/g, "\\'") + '\'); return false;" class="detail-link"><i class="fas fa-download"></i> Wissensdokument</a>');
    }
    if (links.length) {
        html += '<div class="detail-links">' + links.join('') + '</div>';
    }

    // Assessment comparison
    html += '<div class="detail-section"><h3>Bewertung</h3><div class="assessment-grid">';

    // LLM panel
    var llmDecColor = paper.llm.decision === 'Include' ? 'var(--success)' : 'var(--gray-500)';
    html += '<div class="assessment-panel">' +
        '<div class="panel-header">LLM (Claude Haiku 4.5)</div>' +
        '<div class="assessment-decision" style="color:' + llmDecColor + '">' + paper.llm.decision + '</div>' +
        '
        catGridColored(paper.llm.all_categories);
    if (paper.llm.reasoning) {
        html += '<div class="reasoning-section"><span class="reasoning-label">Begruendung</span>' +
            '<p class="reasoning-text">' + escapeHtml(paper.llm.reasoning) + '</p></div>';
    }
    html += '</div>';

    // Human panel
    if (paper.benchmark.has_human && paper.human && paper.human.decision) {
        var hDecColor = paper.human.decision === 'Include' ? 'var(--success)' : 'var(--gray-500)';
        html += '<div class="assessment-panel">' +
            '<div class="panel-header">Expert:innen</div>' +
            '<div class="assessment-decision" style="color:' + hDecColor + '">' + paper.human.decision + '</div>' +
            catGridColored(paper.human.all_categories) +
        '</div>';
    } else {
        html += '<div class="assessment-panel assessment-panel--empty">' +
            '<div class="panel-header">Expert:innen</div>' +
            '<p class="empty-note">Nicht bewertet. Human Assessment deckt 210 von 326 Papers ab.</p>' +
        '</div>';
    }

    html += '</div>'; // close assessment-grid

    // Status panel
    if (paper.benchmark.has_human && paper.human && paper.human.decision) {
        if (paper.benchmark.agreement === false) {
            var affectedCats = paper.benchmark.affected_categories || [];
            html += '<div class="divergence-panel">' +
                '<strong>Divergenz</strong>';
            if (paper.benchmark.disagreement_type) {
                html += ' &mdash; ' + paper.benchmark.disagreement_type.replace(/_/g, ' ');
            }
            if (paper.benchmark.severity) {
                html += ' <span class="severity-badge severity-' + paper.benchmark.severity + '">' + paper.benchmark.severity + '</span>';
            }
            if (affectedCats.length) {
                html += '<p class="affected-cats">Betroffene Kategorien: ' + affectedCats.map(function(c) {
                    var color = CAT_COLORS[c] || 'var(--gray-400)';
                    return '<span style="color:' + color + ';font-weight:600;">' + c.replace(/_/g, ' ') + '</span>';
                }).join(', ') + '</p>';
            }
            html += '</div>';
        } else {
            html += '<div class="agreement-panel"><strong>Konsens</strong> &mdash; Beide Bewertungspfade kommen zum selben Ergebnis.</div>';
        }
    }

    html += '</div>'; // close detail-section

    return html;
}

// Category grid with spectrum colors (for detail panel)
function catGridColored(allCategories) {
    var html = '<div class="category-grid-10">';
    CATEGORIES.forEach(function(cat, i) {
        var active = allCategories[cat] === 1;
        var color = active ? CAT_COLORS[cat] : 'var(--gray-300)';
        var textColor = active ? 'var(--gray-800)' : 'var(--gray-400)';
        var fontWeight = active ? '600' : '400';
        html += '<div class="cat-grid-item" style="color:' + textColor + ';font-weight:' + fontWeight + '">' +
            '<span class="cat-dot" style="background:' + color + '"></span>' +
            '<span>' + cat.replace(/_/g, ' ') + '</span>' +
        '</div>';
    });
    html += '</div>';
    return html;
}

// ============================================================
// Utilities
// ============================================================

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function exportFilteredPapers() {
    var papers = filteredPapers.length > 0 ? filteredPapers : allPapers;
    var headers = ['ID', 'Title', 'Author_Year', 'Year', 'Item_Type', 'DOI',
        'LLM_Decision', 'LLM_Categories',
        'Human_Decision', 'Has_Human', 'Agreement'];
    var rows = papers.map(function(p) {
        return [p.id, p.title, p.author_year, p.year, p.item_type, p.doi,
            p.llm.decision, p.llm.categories.join(';'),
            p.human ? p.human.decision : '', p.benchmark.has_human,
            p.benchmark.agreement === null ? '' : p.benchmark.agreement];
    });
    var csv = [headers].concat(rows).map(function(r) {
        return r.map(function(v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'fem_prompt_papers.csv'; a.click();
    URL.revokeObjectURL(url);
}

async function downloadKnowledgeDoc(docPath, title) {
    try {
        var response = await fetch(docPath);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var blob = await response.blob();
        var safeName = title.replace(/[<>:"/\\|?*]/g, '-').substring(0, 100) + '.md';
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = safeName; a.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('[Download]', err);
    }
}

function downloadVaultZip() {
    var a = document.createElement('a');
    a.href = 'downloads/vault.zip';
    a.download = 'FemPrompt_Research_Vault.zip';
    a.click();
}

window.closePaperModal = closePaperModal;
window.showPaperDetail = showPaperDetail;
window.exportFilteredPapers = exportFilteredPapers;
window.downloadKnowledgeDoc = downloadKnowledgeDoc;
window.downloadVaultZip = downloadVaultZip;
// Expose for wissensnetz.js cross-view navigation
Object.defineProperty(window, 'allPapers', { get: function() { return allPapers; } });
