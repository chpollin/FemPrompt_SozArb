// Evidence Companion - Feministische AI Literacies
// Systematischer Review -- Interaktive Evidenz

(function() {
'use strict';

// ============================================================
// Shared Constants & Utilities (exposed via window.EC)
// ============================================================

var CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender',
    'Diversitaet', 'Feministisch', 'Fairness'
];

// Category colors: 10 distinct hues across a spectrum (Gegenstand -> Perspektive)
// No gendered color coding. Perceptually distinct, works for colorblind users.
var CAT_COLORS = {
    'AI_Literacies':    '#5b8c5a', // sage green
    'Generative_KI':    '#3a7d7e', // teal
    'Prompting':        '#4b7bab', // steel blue
    'KI_Sonstige':      '#7c6fae', // soft purple
    'Soziale_Arbeit':   '#b0546e', // dusty rose
    'Bias_Ungleichheit':'#c2694e', // terracotta
    'Gender':           '#d4943a', // amber
    'Diversitaet':      '#8a7542', // olive gold
    'Feministisch':     '#a24b7a', // plum
    'Fairness':         '#6a8e4e', // moss green
};

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// ============================================================
// Application State (private)
// ============================================================

var allPapers = [];
var filteredPapers = [];
var vaultMeta = {};
var kappas = {};
var fuse = null;
var activeCategories = new Set();
var benchmarkInitialized = false;
var wissensnetzInitialized = false;
var chatInitialized = true; // chat is default tab, initialized on load
var conceptData = null;
var divergencePatterns = null;
var divergencesList = [];
var currentPage = 1;
var currentSort = 'relevance';
var PAGE_SIZE = 50;
var currentDetailPaper = null;
var currentDetailList = null;

// ============================================================
// Public API (window.EC)
// ============================================================

window.EC = {
    // Shared utilities
    escapeHtml: escapeHtml,
    CAT_COLORS: CAT_COLORS,
    CATEGORIES: CATEGORIES,
    // State getters
    getAllPapers: function() { return allPapers; },
    getFilteredPapers: function() { return filteredPapers; },
    getMeta: function() { return vaultMeta; },
    getKappas: function() { return kappas; },
    getActiveCategories: function() { return activeCategories; },
    getConceptData: function() { return conceptData; },
    getDivergencePatterns: function() { return divergencePatterns; },
    getDivergences: function() { return divergencesList; },
    // Actions
    setFilteredPapers: function(p) { filteredPapers = p; },
    renderPapers: function(p) { renderPapers(p); },
    showPaperDetail: function(p, list) { showPaperDetail(p, list); },
    closePaperModal: function() { closePaperModal(); },
    applyFilters: function() { applyFilters(); },
    // Category divergences: papers where a specific category is divergent
    getCategoryDivergences: function(cat) {
        return divergencesList.filter(function(p) {
            return p.divergence && p.divergence.category_comparison &&
                p.divergence.category_comparison[cat] &&
                p.divergence.category_comparison[cat].divergent;
        });
    },
    // Cross-view navigation
    focusConcept: function(id) { if (window.focusWissensnetzConcept) window.focusWissensnetzConcept(id); },
    filterDivergencePattern: function(pat) { if (window.filterDivergencePattern) window.filterDivergencePattern(pat); },
};

// HTML onclick aliases
window.closePaperModal = function() { closePaperModal(); };
window.exportFilteredPapers = function() { exportFilteredPapers(); };
window.downloadKnowledgeDoc = function(p, t) { downloadKnowledgeDoc(p, t); };
window.downloadVaultZip = function() { downloadVaultZip(); };
window.exportFilteredMarkdown = function() { exportFilteredMarkdown(); };
window.showPaperDetail = function(p, l) { showPaperDetail(p, l); };

// ============================================================
// Initialize
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    loadData().then(function() {
        initializeUI();
        renderIntroNumbers();
        renderCategoryChips();
        applyFilters();
        logInit();
        initRichTooltips();
        // Always initialize chat (default tab)
        if (window.initWissensChat) window.initWissensChat();

        // Handle hash-based navigation (from about/help links)
        var hash = window.location.hash.replace('#', '');
        if (hash && ['chat', 'wissensnetz', 'vergleich', 'korpus'].indexOf(hash) >= 0) {
            switchView(hash);
        }
    }).catch(function(error) {
        console.error('[Evidence] init failed:', error);
        document.getElementById('papers-grid').innerHTML =
            '<p style="padding:2rem;color:var(--danger);">' + escapeHtml(error.message) + '</p>';
    });
});

function logInit() {
    var withDecision = allPapers.filter(function(p) {
        return p.benchmark.has_human && p.human && p.human.decision;
    }).length;
    var disagreements = allPapers.filter(function(p) {
        return p.benchmark.agreement === false;
    }).length;
    var kappa = (vaultMeta.kappa_overall || 0).toFixed(3);
    console.log('[Evidence] ' + allPapers.length + ' papers | ' + withDecision +
        ' human decisions | ' + disagreements + ' divergences | kappa=' + kappa);
}

// ============================================================
// Data Loading
// ============================================================

function loadData() {
    return fetch('data/research_vault_v2.json').then(function(res) {
        if (!res.ok) throw new Error('Daten konnten nicht geladen werden');
        return res.json();
    }).then(function(data) {
        allPapers = data.papers;
        vaultMeta = data.meta;
        kappas = data.kappa_by_category;
        filteredPapers = allPapers.slice();

        fuse = new Fuse(allPapers, {
            keys: ['title', 'author_year', 'abstract'],
            threshold: 0.3,
            includeScore: true
        });

        // Load concept data + divergence patterns in parallel
        var cgFetch = fetch('data/concept_graph.json').then(function(cgRes) {
            if (!cgRes.ok) return;
            return cgRes.json().then(function(cgData) {
                var conceptPapers = allPapers.map(function(p) {
                    var concepts = cgData.paper_concepts[p.id] || [];
                    return {
                        id: p.id,
                        title: p.title,
                        author_year: p.author_year,
                        concepts: concepts,
                        stages: cgData.paper_divergence[p.id]
                            ? { assessment: { agreement: 'disagree' } }
                            : { assessment: { agreement: 'agree' } }
                    };
                });
                conceptData = {
                    nodes: cgData.nodes,
                    edges: cgData.edges,
                    papers: conceptPapers
                };
            });
        }).catch(function(e) {
            console.warn('[Evidence] Concept data not available:', e.message);
        });

        var divFetch = fetch('data/promptotyping_v2.json').then(function(ptRes) {
            if (!ptRes.ok) return;
            return ptRes.json().then(function(ptData) {
                var ptMeta = ptData.meta || {};
                divergencePatterns = {
                    pattern_distribution: ptMeta.pattern_distribution || {},
                    asymmetry: ptMeta.asymmetry || {}
                };

                // Match divergences to allPapers by normalized title
                var titleMap = {};
                allPapers.forEach(function(p) {
                    var key = (p.title || '').toLowerCase().substring(0, 80).trim();
                    if (key) titleMap[key] = p;
                });

                var matched = 0;
                (ptData.divergences || []).forEach(function(div) {
                    var key = (div.title || '').toLowerCase().substring(0, 80).trim();
                    var paper = titleMap[key];
                    if (!paper && div.author_year) {
                        paper = allPapers.find(function(p) {
                            return p.author_year === div.author_year;
                        });
                    }
                    if (paper) {
                        paper.divergence = {
                            pattern: div.pattern,
                            justification: div.justification,
                            severity: div.severity,
                            category_comparison: div.category_comparison,
                            llm_reasoning: div.llm_reasoning,
                            disagreement_type: div.disagreement_type,
                            affected_categories: div.affected_categories,
                            n_affected: div.n_affected
                        };
                        divergencesList.push(paper);
                        matched++;
                    }
                });
                console.log('[Evidence] Divergence patterns: ' + matched + '/' +
                    (ptData.divergences || []).length + ' matched');

                // Enrich papers with knowledge sections
                var kMatched = 0;
                (ptData.papers || []).forEach(function(ptPaper) {
                    if (!ptPaper.knowledge_sections && !ptPaper.knowledge_summary) return;
                    var key = (ptPaper.title || '').toLowerCase().substring(0, 80).trim();
                    var paper = titleMap[key];
                    if (!paper && ptPaper.author_year) {
                        paper = allPapers.find(function(p) { return p.author_year === ptPaper.author_year; });
                    }
                    if (paper) {
                        paper.knowledge = {
                            summary: ptPaper.knowledge_summary || '',
                            sections: ptPaper.knowledge_sections || {}
                        };
                        kMatched++;
                    }
                });
                console.log('[Evidence] Knowledge sections: ' + kMatched + ' papers enriched');
            });
        }).catch(function(e) {
            console.warn('[Evidence] Divergence patterns not available:', e.message);
        });

        return Promise.all([cgFetch, divFetch]);
    });
}

// ============================================================
// UI Initialization
// ============================================================

function initializeUI() {
    document.getElementById('search-box').addEventListener('input', handleSearch);
    document.getElementById('filter-decision').addEventListener('change', function() { applyFilters(); });
    document.getElementById('filter-human').addEventListener('change', function() { applyFilters(); });
    document.getElementById('filter-year').addEventListener('change', function() { applyFilters(); });
    document.getElementById('sort-by').addEventListener('change', function() {
        currentSort = this.value;
        applyFilters();
    });

    // Dropdown navigation
    setupDropdownNav();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePaperModal();
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }
        // Arrow keys for detail panel navigation
        if (document.getElementById('paper-modal').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                var prev = document.getElementById('detail-prev');
                if (prev) prev.click();
            }
            if (e.key === 'ArrowRight') {
                var next = document.getElementById('detail-next');
                if (next) next.click();
            }
        }
    });
}

// ============================================================
// Intro Numbers
// ============================================================

function renderIntroNumbers() {
    var withDecision = allPapers.filter(function(p) {
        return p.human && p.human.decision && (p.human.decision === 'Include' || p.human.decision === 'Exclude');
    }).length;
    var el = function(id) { return document.getElementById(id); };
    if (el('total-count-intro')) el('total-count-intro').textContent = allPapers.length;
    if (el('human-count-intro')) el('human-count-intro').textContent = withDecision;
    if (el('llm-count-intro')) el('llm-count-intro').textContent = allPapers.length;
    if (el('kd-count-intro')) {
        var kdCount = allPapers.filter(function(p) { return p.knowledge_doc; }).length;
        el('kd-count-intro').textContent = kdCount;
    }
}

// ============================================================
// Category Chips
// ============================================================

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

// ============================================================
// Search & Filter
// ============================================================

function handleSearch(e) {
    var query = e.target.value.trim();
    if (query.length === 0) {
        filteredPapers = allPapers.slice();
    } else {
        filteredPapers = fuse.search(query).map(function(r) { return r.item; });
    }
    applyFilters();
}

function sortPapers(papers, sortBy) {
    var sorted = papers.slice();
    switch (sortBy) {
        case 'relevance':
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

    container.querySelectorAll('tr[data-idx]').forEach(function(row) {
        row.addEventListener('click', function() {
            showPaperDetail(papers[parseInt(row.dataset.idx)], papers);
        });
    });

    container.querySelectorAll('.page-btn[data-page]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentPage = parseInt(btn.dataset.page);
            renderPapers(papers);
            document.getElementById('view-korpus').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    container.querySelectorAll('.sortable').forEach(function(th) {
        th.addEventListener('click', function() {
            currentSort = th.dataset.sort;
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

function catLabels(paper) {
    var html = '';
    CATEGORIES.forEach(function(cat, i) {
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

function showPaperDetail(paper, paperList) {
    currentDetailPaper = paper;
    if (paperList) currentDetailList = paperList;
    var modal = document.getElementById('paper-modal');
    document.getElementById('modal-title').textContent = paper.title;
    document.getElementById('modal-author').textContent =
        (paper.author_year || '') + (paper.year ? ' | ' + paper.year : '') + (paper.item_type ? ' | ' + paper.item_type : '');

    var bodyHtml = buildDetailContent(paper);

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
    document.body.classList.add('panel-open');
    modal.querySelector('.modal-content').scrollTop = 0;
    highlightActiveRow(paper);

    // Detail tab switching
    document.querySelectorAll('.detail-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var target = tab.dataset.detailTab;
            document.querySelectorAll('.detail-tab').forEach(function(t) { t.classList.toggle('active', t === tab); });
            document.querySelectorAll('.detail-tab-content').forEach(function(c) {
                c.style.display = c.id === 'dtab-' + target ? '' : 'none';
                c.classList.toggle('active', c.id === 'dtab-' + target);
            });
        });
    });

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

// ============================================================
// Dropdown Navigation
// ============================================================

function setupDropdownNav() {
    // Direct view buttons in header nav
    document.querySelectorAll('.nav-view-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchView(btn.dataset.view);
        });
    });
}

// Exposed globally for cross-view navigation (from chat, wissensnetz, etc.)
// ============================================================
// Rich Tooltips (data-driven, HTML content)
// ============================================================

function initRichTooltips() {
    // Create tooltip container
    var tip = document.createElement('div');
    tip.className = 'rich-tooltip';
    tip.style.display = 'none';
    document.body.appendChild(tip);

    // Build tooltip content from real data
    var tipContent = buildTooltipContent();

    // Attach to all .has-tip elements
    document.querySelectorAll('.has-tip').forEach(function(el) {
        var key = el.dataset.tipKey;
        if (!key) return;

        el.addEventListener('mouseenter', function(e) {
            var html = tipContent[key];
            if (!html) return;
            tip.innerHTML = html;
            tip.style.display = 'block';
            positionTooltip(tip, el);
        });

        el.addEventListener('mouseleave', function() {
            tip.style.display = 'none';
        });
    });
}

function positionTooltip(tip, anchor) {
    var rect = anchor.getBoundingClientRect();
    var tipRect = tip.getBoundingClientRect();
    var left = rect.left + rect.width / 2 - tipRect.width / 2;
    var top = rect.bottom + 10;

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
    if (top + tipRect.height > window.innerHeight - 8) top = rect.top - tipRect.height - 10;

    tip.style.left = left + 'px';
    tip.style.top = top + window.scrollY + 'px';
}

function buildTooltipContent() {
    var papers = allPapers;
    var meta = vaultMeta;
    var cats = kappas;

    // --- Papers ---
    var yearCounts = {};
    papers.forEach(function(p) { if (p.year) yearCounts[p.year] = (yearCounts[p.year] || 0) + 1; });
    var topYears = Object.keys(yearCounts).sort(function(a, b) { return yearCounts[b] - yearCounts[a]; }).slice(0, 5);
    var yearBars = topYears.map(function(y) {
        var pct = Math.round(yearCounts[y] / papers.length * 100);
        return '<div class="tip-bar-row"><span class="tip-bar-label">' + y + '</span>' +
            '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%"></div></div>' +
            '<span class="tip-bar-val">' + yearCounts[y] + '</span></div>';
    }).join('');

    var tipPapers = '<div class="tip-title">Korpus-Zusammensetzung</div>' +
        '<div class="tip-text">Identifiziert via Deep Research (4 KI-Provider) + manuelle Ergaenzung.</div>' +
        '<div class="tip-section">Jahrgaenge</div>' + yearBars;

    // --- Wissensdokumente ---
    var kdCount = papers.filter(function(p) { return p.knowledge_doc; }).length;
    var pdfRate = Math.round(257 / 326 * 100);
    var kdRate = Math.round(kdCount / 326 * 100);

    var tipWD = '<div class="tip-title">LLM-Pipeline</div>' +
        '<div class="tip-pipeline">' +
            '<span class="tip-step">326 Papers</span> <i class="fas fa-arrow-right tip-arrow"></i> ' +
            '<span class="tip-step">257 PDFs <small>(' + pdfRate + '%)</small></span> <i class="fas fa-arrow-right tip-arrow"></i> ' +
            '<span class="tip-step">252 Markdown</span> <i class="fas fa-arrow-right tip-arrow"></i> ' +
            '<span class="tip-step tip-step-hl">' + kdCount + ' Wissensdok.</span>' +
        '</div>' +
        '<div class="tip-text">Jedes Wissensdokument: Kernbefund, Forschungsfrage, Methodik, Kategorie-Evidenz. Qualitaet: 97.2% verifiziert.</div>';

    // --- Expert:innen-Bewertungen ---
    var withDecision = papers.filter(function(p) {
        return p.human && p.human.decision;
    }).length;
    var humanInclude = papers.filter(function(p) {
        return p.human && p.human.decision === 'Include';
    }).length;
    var humanExclude = withDecision - humanInclude;
    var divergences = papers.filter(function(p) {
        return p.benchmark.agreement === false;
    }).length;
    var inclPct = withDecision ? Math.round(humanInclude / withDecision * 100) : 0;

    var tipHuman = '<div class="tip-title">Duale Bewertung</div>' +
        '<div class="tip-grid">' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--success)">' + humanInclude + '</span><span class="tip-stat-lbl">Include (' + inclPct + '%)</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--gray-500)">' + humanExclude + '</span><span class="tip-stat-lbl">Exclude</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--danger)">' + divergences + '</span><span class="tip-stat-lbl">Divergenzen</span></div>' +
        '</div>' +
        '<div class="tip-text">Fachwissenschaftler:innen (Sackl-Sharif, Klinger) bewerten nach identischem 10-Kategorien-Schema wie das LLM.</div>';

    // --- 10 Kategorien ---
    var catNames = CATEGORIES;
    var catBars = catNames.map(function(cat, i) {
        var count = papers.filter(function(p) { return p.llm.all_categories[cat] === 1; }).length;
        var pct = Math.round(count / papers.length * 100);
        var color = CAT_COLORS[cat];
        var groupLabel = i < 4 ? '' : (i === 4 ? '<div class="tip-section" style="margin-top:0.375rem;">Perspektive</div>' : '');
        return groupLabel + '<div class="tip-bar-row"><span class="tip-bar-label">' + cat.replace(/_/g, ' ') + '</span>' +
            '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<span class="tip-bar-val">' + pct + '%</span></div>';
    }).join('');

    var tipCats = '<div class="tip-title">10 Bewertungskategorien</div>' +
        '<div class="tip-section">Gegenstand</div>' + catBars;

    // --- Nav buttons ---
    var llmInclude = papers.filter(function(p) { return p.llm.decision === 'Include'; }).length;
    var conceptCount = (conceptData && conceptData.nodes) ? conceptData.nodes.length : 136;
    var topConcepts = (conceptData && conceptData.nodes)
        ? conceptData.nodes.slice().sort(function(a, b) { return b.frequency - a.frequency; }).slice(0, 5)
        : [];

    var tipChat = '<div class="tip-title">Wissens-Chat</div>' +
        '<div class="tip-text">Fragen Sie das synthetisierte Wissen. Ein LLM (Gemini 3 Flash) antwortet mit Inline-Zitationen, die direkt zum Korpus verlinken.</div>' +
        '<div class="tip-text tip-muted">Zweifach LLM-vermittelt: Wissensextraktion + Antwortgenerierung.</div>';

    var tipNetz = '<div class="tip-title">Wissensnetz</div>' +
        '<div class="tip-text">' + conceptCount + ' Konzepte aus ' + kdCount + ' Wissensdokumenten.</div>';
    if (topConcepts.length > 0) {
        tipNetz += '<div class="tip-section">Haeufigste Konzepte</div>';
        topConcepts.forEach(function(c) {
            var pct = Math.round(c.frequency / papers.length * 100);
            tipNetz += '<div class="tip-bar-row"><span class="tip-bar-label">' + escapeHtml(c.label) + '</span>' +
                '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%;background:var(--primary)"></div></div>' +
                '<span class="tip-bar-val">' + c.frequency + '</span></div>';
        });
    }

    var tipVergleich = '<div class="tip-title">Kategorien-Explorer</div>' +
        '<div class="tip-text">10 Kategorien als interaktives Spektrum. Waehlen Sie eine Kategorie, um Human- und LLM-Raten, Divergenz-Papers und Konzepte zu explorieren.</div>' +
        '<div class="tip-grid">' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--warning)">Gender</span><span class="tip-stat-lbl">-27pp</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--info)">Fairness</span><span class="tip-stat-lbl">+21pp</span></div>' +
        '</div>';

    var tipKorpus = '<div class="tip-title">Korpus</div>' +
        '<div class="tip-grid">' +
            '<div class="tip-stat"><span class="tip-stat-val">' + papers.length + '</span><span class="tip-stat-lbl">Papers</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--success)">' + llmInclude + '</span><span class="tip-stat-lbl">LLM Include</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val">' + withDecision + '</span><span class="tip-stat-lbl">Human bewertet</span></div>' +
        '</div>' +
        '<div class="tip-text">Durchsuchbar, filterbar, sortierbar. Detail-Panel mit Assessment-Vergleich.</div>';

    return {
        papers: tipPapers,
        wissensdok: tipWD,
        human: tipHuman,
        kategorien: tipCats,
        chat: tipChat,
        wissensnetz: tipNetz,
        vergleich: tipVergleich,
        korpus: tipKorpus
    };
}

window.switchView = function(viewId) { switchView(viewId); };

function switchView(viewId) {
    // Update nav button active state
    document.querySelectorAll('.nav-view-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Show/hide view sections
    document.querySelectorAll('.view-content').forEach(function(v) {
        var isActive = v.id === 'view-' + viewId;
        v.classList.toggle('active', isActive);
        v.style.display = isActive ? '' : 'none';
    });

    // Lazy-init on first visit
    if (viewId === 'vergleich' && !benchmarkInitialized) {
        if (window.initializeKategorien) window.initializeKategorien();
        benchmarkInitialized = true;
    }
    if (viewId === 'wissensnetz' && !wissensnetzInitialized && conceptData) {
        wissensnetzInitialized = true;
        if (window.initWissensnetz) window.initWissensnetz(conceptData.nodes, conceptData.edges, conceptData.papers);
    }
    if (viewId === 'chat' && !chatInitialized) {
        chatInitialized = true;
        if (window.initWissensChat) window.initWissensChat();
    }
}

function closePaperModal() {
    document.getElementById('paper-modal').classList.remove('active');
    document.body.classList.remove('panel-open');
    highlightActiveRow(null);
}

function highlightActiveRow(paper) {
    document.querySelectorAll('.papers-table tbody tr.row--active').forEach(function(r) {
        r.classList.remove('row--active');
    });
    if (!paper || !currentDetailList) return;
    var idx = currentDetailList.indexOf(paper);
    if (idx >= 0) {
        var row = document.querySelector('tr[data-idx="' + idx + '"]');
        if (row) row.classList.add('row--active');
    }
}

function buildDetailContent(paper) {
    var hasKnowledge = paper.knowledge && paper.knowledge.sections &&
        Object.keys(paper.knowledge.sections).length > 0;

    var html = '';

    // Tabs
    html += '<div class="detail-tabs">';
    html += '<button class="detail-tab active" data-detail-tab="bewertung">Bewertung</button>';
    html += '<button class="detail-tab" data-detail-tab="wissen">' + (hasKnowledge ? 'Wissensdokument' : 'Wissen') + '</button>';
    html += '</div>';

    // Tab: Bewertung
    html += '<div class="detail-tab-content active" id="dtab-bewertung">';

    if (paper.abstract && paper.abstract.trim()) {
        html += '<div class="detail-section">' +
            '<h3>Abstract</h3>' +
            '<p class="detail-text">' + escapeHtml(paper.abstract) + '</p>' +
        '</div>';
    }

    var links = [];
    if (paper.doi && paper.doi !== 'nan') {
        links.push('<a href="https://doi.org/' + escapeHtml(paper.doi) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-external-link-alt"></i> DOI</a>');
    }
    if (paper.url && paper.url !== 'nan' && paper.url !== '') {
        links.push('<a href="' + escapeHtml(paper.url) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-globe"></i> Quelle</a>');
    }
    if (paper.knowledge_doc) {
        links.push('<a href="#" onclick="downloadKnowledgeDoc(\'' + escapeHtml(paper.knowledge_doc) + '\', \'' + escapeHtml(paper.title).replace(/'/g, "\\'") + '\'); return false;" class="detail-link"><i class="fas fa-download"></i> .md</a>');
    }
    if (links.length) {
        html += '<div class="detail-links">' + links.join('') + '</div>';
    }

    html += '<div class="detail-section"><h3>Bewertung</h3><div class="assessment-grid">';

    var llmDecColor = paper.llm.decision === 'Include' ? 'var(--success)' : 'var(--gray-500)';
    html += '<div class="assessment-panel">' +
        '<div class="panel-header">LLM (Claude Haiku 4.5)</div>' +
        '<div class="assessment-decision" style="color:' + llmDecColor + '">' + paper.llm.decision + '</div>' +
        catGridColored(paper.llm.all_categories);
    if (paper.llm.reasoning) {
        html += '<div class="reasoning-section"><span class="reasoning-label">Begruendung</span>' +
            '<p class="reasoning-text">' + escapeHtml(paper.llm.reasoning) + '</p></div>';
    }
    html += '</div>';

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
    html += '</div>'; // close dtab-bewertung

    // Tab: Wissensdokument
    html += '<div class="detail-tab-content" id="dtab-wissen" style="display:none;">';
    if (hasKnowledge) {
        var ks = paper.knowledge.sections;
        if (ks.kernbefund) {
            html += '<div class="kd-section kd-kernbefund">';
            html += '<h4>Kernbefund</h4>';
            html += '<p>' + escapeHtml(ks.kernbefund) + '</p>';
            html += '</div>';
        }
        if (ks.forschungsfrage) {
            html += '<div class="kd-section">';
            html += '<h4>Forschungsfrage</h4>';
            html += '<p>' + escapeHtml(ks.forschungsfrage) + '</p>';
            html += '</div>';
        }
        if (ks.methodik) {
            html += '<div class="kd-section">';
            html += '<h4>Methodik</h4>';
            html += '<p>' + escapeHtml(ks.methodik) + '</p>';
            html += '</div>';
        }
        if (ks.hauptargumente) {
            html += '<div class="kd-section">';
            html += '<h4>Hauptargumente</h4>';
            html += '<p>' + escapeHtml(ks.hauptargumente).replace(/\n- /g, '<br>- ') + '</p>';
            html += '</div>';
        }
        if (paper.knowledge_doc) {
            html += '<div style="margin-top:1rem;">';
            html += '<a href="#" onclick="downloadKnowledgeDoc(\'' + escapeHtml(paper.knowledge_doc) + '\', \'' + escapeHtml(paper.title).replace(/'/g, "\\'") + '\'); return false;" class="export-button"><i class="fas fa-download"></i> Vollstaendiges Wissensdokument (.md)</a>';
            html += '</div>';
        }
    } else {
        html += '<div class="kd-empty">';
        html += '<p><i class="fas fa-file-alt" style="font-size:1.5rem;color:var(--gray-300);"></i></p>';
        html += '<p>Kein Wissensdokument verfuegbar.</p>';
        html += '<p style="font-size:var(--text-xs);color:var(--gray-400);">Fuer dieses Paper konnte kein PDF akquiriert werden (77 von 326 Papers betroffen).</p>';
        html += '</div>';
    }
    html += '</div>'; // close dtab-wissen

    return html;
}

function catGridColored(allCategories) {
    var html = '<div class="category-grid-10">';
    CATEGORIES.forEach(function(cat) {
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
// Export & Download
// ============================================================

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

function downloadKnowledgeDoc(docPath, title) {
    fetch(docPath).then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.blob();
    }).then(function(blob) {
        var safeName = title.replace(/[<>:"/\\|?*]/g, '-').substring(0, 100) + '.md';
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = safeName; a.click();
        URL.revokeObjectURL(url);
    }).catch(function(err) {
        console.error('[Download]', err);
    });
}

function downloadVaultZip() {
    var a = document.createElement('a');
    a.href = 'downloads/vault.zip';
    a.download = 'FemPrompt_Research_Vault.zip';
    a.click();
}

function exportFilteredMarkdown() {
    if (typeof JSZip === 'undefined') {
        alert('JSZip wird geladen, bitte erneut versuchen.');
        return;
    }

    var papers = filteredPapers.length ? filteredPapers : allPapers;
    var withDocs = papers.filter(function(p) { return p.knowledge_doc; });

    if (withDocs.length === 0) {
        alert('Keine Wissensdokumente fuer die aktuelle Auswahl verfuegbar.');
        return;
    }

    var zip = new JSZip();
    var fetches = [];

    withDocs.forEach(function(p) {
        var promise = fetch(p.knowledge_doc)
            .then(function(res) { return res.ok ? res.text() : null; })
            .then(function(text) {
                if (text) {
                    var safeName = (p.author_year || p.id).replace(/[<>:"/\\|?*]/g, '-').substring(0, 80) + '.md';
                    zip.file(safeName, text);
                }
            })
            .catch(function() {});
        fetches.push(promise);
    });

    Promise.all(fetches).then(function() {
        // Generate README with system prompt
        var readme = '# Forschungskorpus-Auswahl (' + withDocs.length + ' Wissensdokumente)\n\n';
        readme += 'Exportiert aus: Feministische AI Literacies -- Evidence Companion\n';
        readme += 'Datum: ' + new Date().toISOString().split('T')[0] + '\n';
        readme += 'Quelle: https://chpollin.github.io/FemPrompt_SozArb/\n\n';

        readme += '## Enthaltene Papers\n\n';
        withDocs.forEach(function(p, i) {
            readme += (i + 1) + '. ' + (p.author_year || '') + ': ' + p.title + '\n';
        });

        readme += '\n## Nachnutzung als LLM-Kontext\n\n';
        readme += 'Laden Sie diesen Ordner als Kontext in ein LLM Ihrer Wahl.\n';
        readme += 'Verwenden Sie folgenden System-Prompt:\n\n';
        readme += '---\n\n';
        readme += 'Du bist ein Forschungsassistent fuer einen systematischen Literature Review\n';
        readme += 'zu feministischen AI Literacies in der Sozialen Arbeit. Dir liegen ' + withDocs.length + '\n';
        readme += 'Wissensdokumente vor, die aus wissenschaftlichen Papers extrahiert wurden.\n';
        readme += 'Jedes Dokument enthaelt: Kernbefund, Forschungsfrage, Methodik und\n';
        readme += 'Hauptargumente. Beantworte Fragen auf Basis dieser Dokumente. Zitiere\n';
        readme += 'immer die Quelle (Autor, Jahr). Wenn eine Information nicht in den\n';
        readme += 'Dokumenten steht, sage das explizit.\n\n';
        readme += '---\n\n';
        readme += '### Wege zur Nachnutzung\n\n';
        readme += '- **Claude Code:** `claude` im Exportordner starten, System-Prompt verwenden\n';
        readme += '- **NotebookLM:** Dateien als Quellen hochladen\n';
        readme += '- **ChatGPT/Gemini:** Dateien hochladen, System-Prompt in Custom Instructions\n';
        readme += '- **Obsidian:** Ordner als Vault oeffnen (volles Vault: https://chpollin.github.io/FemPrompt_SozArb/downloads/vault.zip)\n';

        zip.file('README.md', readme);

        return zip.generateAsync({ type: 'blob' });
    }).then(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'fem_prompt_auswahl_' + withDocs.length + '_papers.zip';
        a.click();
        URL.revokeObjectURL(url);
    });
}

})();
