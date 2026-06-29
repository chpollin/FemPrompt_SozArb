// Evidence Companion - Feministische AI Literacies
// Systematischer Review -- Interaktive Evidenz

(function() {
'use strict';

// Shared Constants & Utilities (exposed via window.EC)

const CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender',
    'Diversitaet', 'Feministisch', 'Fairness'
];

// Category colors: 10 distinct hues across a spectrum (Gegenstand -> Perspektive)
// No gendered color coding. Perceptually distinct, works for colorblind users.
const CAT_COLORS = {
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
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// Human-readable category label from the underscore key.
function catLabel(cat) {
    return String(cat || '').replace(/_/g, ' ');
}

// Only http(s) links are safe to emit into an href; blocks javascript: and data:.
function isHttpUrl(u) {
    return /^https?:\/\//i.test(String(u || '').trim());
}

// Single download helper: builds a blob (or uses a ready URL), clicks, revokes.
function download(filename, content, mime) {
    let url, revoke = false;
    if (content instanceof Blob) {
        url = URL.createObjectURL(content); revoke = true;
    } else if (mime) {
        url = URL.createObjectURL(new Blob([content], { type: mime })); revoke = true;
    } else {
        url = content; // already a URL (e.g. a static asset path)
    }
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    if (revoke) URL.revokeObjectURL(url);
}

// Agreement status of a paper as a {cls, label} pair, shared across views.
function paperStatus(paper) {
    if (!paper.benchmark || !paper.benchmark.has_human || !paper.human || !paper.human.decision) {
        return { cls: 'llmonly', label: 'nur LLM' };
    }
    if (paper.benchmark.agreement === true) return { cls: 'agree', label: 'Konsens' };
    return { cls: 'diverge', label: 'Divergenz' };
}

// Application State (private)

let allPapers = [];
let filteredPapers = [];
let vaultMeta = {};
let kappas = {};
let fuse = null;
const activeCategories = new Set();
let benchmarkInitialized = false;
let wissensnetzInitialized = false;
let chatInitialized = true; // chat is default tab, initialized on load
let conceptData = null;
let divergencePatterns = null;
const divergencesList = [];
let currentPage = 1;
let currentSort = 'relevance';
const PAGE_SIZE = 50;
let currentDetailPaper = null;
let currentDetailList = null;
let renderedPapers = []; // the list currently shown in the table (for delegated clicks)
let currentView = 'chat';
let applyingFromUrl = false; // suppresses UI->store sync while a URL is being applied

// Central store for the navigational state the URL serializes: active view, corpus
// filters, selected paper. Views write it through syncUrl and read it through
// applyStateToUI; one subscriber mirrors it into the location hash, so any view is a
// shareable, citable link. subscribe/set are the Observer pattern the DH-interface
// standard prescribes for coordinated framework-free views.
const DEFAULT_STATE = { view: 'chat', q: '', dec: 'all', hum: 'all', year: 'all', sort: 'relevance', cat: [], paper: null };

function createStore(initial) {
    let state = initial;
    const subs = new Set();
    return {
        get: function() { return state; },
        set: function(patch) {
            state = Object.assign({}, state, patch);
            subs.forEach(function(fn) { fn(state); });
        },
        subscribe: function(fn) { subs.add(fn); return function() { subs.delete(fn); }; },
    };
}

const store = createStore(DEFAULT_STATE);

// Public API (window.EC)

window.EC = {
    // Shared utilities
    escapeHtml: escapeHtml,
    catLabel: catLabel,
    download: download,
    paperStatus: paperStatus,
    CAT_COLORS: CAT_COLORS,
    CATEGORIES: CATEGORIES,
    // Central store (subscribe/set/get) holding the URL-serialized view state
    store: store,
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
    navigateToPaper: function(id) {
        let paper = allPapers.find(function(p) { return p.id === id; });
        if (!paper) return false;
        // Suppress the intermediate URL writes so one cross-view navigation is one
        // history entry, and pass the rendered list so row highlight and prev/next
        // share the table's index space.
        applyingFromUrl = true;
        try { switchView('korpus'); showPaperDetail(paper, renderedPapers); }
        finally { applyingFromUrl = false; }
        syncUrl();
        return true;
    },
};

// HTML onclick aliases (static export/close buttons in index.html)
window.closePaperModal = function() { closePaperModal(); };
window.exportFilteredPapers = function() { exportFilteredPapers(); };
window.downloadVaultZip = function() { downloadVaultZip(); };
window.exportFilteredMarkdown = function() { exportFilteredMarkdown(); };

// Initialize

document.addEventListener('DOMContentLoaded', function() {
    loadData().then(function() {
        initializeUI();
        renderIntroNumbers();
        renderCategoryChips();
        logInit();
        initRichTooltips();
        // Chat is the default tab; initialize it up front.
        if (window.initWissensChat) window.initWissensChat();
        // The hash carries view, corpus filters and selected paper. Restoring it
        // renders the table, so the standalone applyFilters is folded into this.
        initUrlState();
    }).catch(function(error) {
        console.error('[Evidence] init failed:', error);
        document.getElementById('papers-grid').innerHTML =
            '<p style="padding:2rem;color:var(--danger);">' + escapeHtml(error.message) + '</p>';
    });
});

function logInit() {
    let withDecision = allPapers.filter(function(p) {
        return p.benchmark.has_human && p.human && p.human.decision;
    }).length;
    const disagreements = allPapers.filter(function(p) {
        return p.benchmark.agreement === false;
    }).length;
    let kappa = (vaultMeta.kappa_overall || 0).toFixed(3);
    console.log('[Evidence] ' + allPapers.length + ' papers | ' + withDecision +
        ' human decisions | ' + disagreements + ' divergences | kappa=' + kappa);
}

// Data Loading

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
        const cgFetch = fetch('data/concept_graph.json').then(function(cgRes) {
            if (!cgRes.ok) return;
            return cgRes.json().then(function(cgData) {
                const conceptPapers = allPapers.map(function(p) {
                    const concepts = cgData.paper_concepts[p.id] || [];
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

        const divFetch = fetch('data/promptotyping_v2.json').then(function(ptRes) {
            if (!ptRes.ok) return;
            return ptRes.json().then(function(ptData) {
                const ptMeta = ptData.meta || {};
                divergencePatterns = {
                    pattern_distribution: ptMeta.pattern_distribution || {},
                    asymmetry: ptMeta.asymmetry || {}
                };

                // Match divergences to allPapers by normalized title
                const titleMap = {};
                allPapers.forEach(function(p) {
                    let key = (p.title || '').toLowerCase().substring(0, 80).trim();
                    if (key) titleMap[key] = p;
                });

                let matched = 0;
                (ptData.divergences || []).forEach(function(div) {
                    let key = (div.title || '').toLowerCase().substring(0, 80).trim();
                    let paper = titleMap[key];
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
                let kMatched = 0;
                (ptData.papers || []).forEach(function(ptPaper) {
                    if (!ptPaper.knowledge_sections && !ptPaper.knowledge_summary) return;
                    let key = (ptPaper.title || '').toLowerCase().substring(0, 80).trim();
                    let paper = titleMap[key];
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

// UI Initialization

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

    // Delegated clicks for the corpus table (rows, pagination, sortable headers),
    // attached once on the stable container instead of rebound on every render.
    document.getElementById('papers-grid').addEventListener('click', function(e) {
        const pageBtn = e.target.closest('.page-btn[data-page]');
        if (pageBtn) {
            e.stopPropagation();
            currentPage = parseInt(pageBtn.dataset.page, 10);
            renderPapers(renderedPapers);
            document.getElementById('view-korpus').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const th = e.target.closest('.sortable');
        if (th) {
            currentSort = th.dataset.sort;
            const sel = document.getElementById('sort-by');
            if (sel.querySelector('option[value="' + currentSort + '"]')) sel.value = currentSort;
            applyFilters();
            return;
        }
        let row = e.target.closest('tr[data-idx]');
        if (row) showPaperDetail(renderedPapers[parseInt(row.dataset.idx, 10)], renderedPapers);
    });

    // Delegated download from the detail panel (.md link), reads the current paper.
    document.getElementById('modal-body').addEventListener('click', function(e) {
        const dl = e.target.closest('[data-action="download-doc"]');
        if (dl && currentDetailPaper) {
            e.preventDefault();
            downloadKnowledgeDoc(currentDetailPaper.knowledge_doc, currentDetailPaper.title);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePaperModal();
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('search-box').focus();
        }
        // Arrow keys for detail panel navigation
        if (document.getElementById('paper-modal').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                const prev = document.getElementById('detail-prev');
                if (prev) prev.click();
            }
            if (e.key === 'ArrowRight') {
                const next = document.getElementById('detail-next');
                if (next) next.click();
            }
        }
    });
}

// Intro Numbers

function renderIntroNumbers() {
    let withDecision = allPapers.filter(function(p) {
        return p.human && p.human.decision && (p.human.decision === 'Include' || p.human.decision === 'Exclude');
    }).length;
    const el = function(id) { return document.getElementById(id); };
    if (el('total-count-intro')) el('total-count-intro').textContent = allPapers.length;
    if (el('human-count-intro')) el('human-count-intro').textContent = withDecision;
    if (el('llm-count-intro')) el('llm-count-intro').textContent = allPapers.length;
    if (el('kd-count-intro')) {
        let kdCount = allPapers.filter(function(p) { return p.knowledge_doc; }).length;
        el('kd-count-intro').textContent = kdCount;
    }
}

// Category Chips

function renderCategoryChips() {
    let container = document.getElementById('category-chips');
    const technik = CATEGORIES.slice(0, 4);
    const sozial = CATEGORIES.slice(4);

    function chipHtml(cat) {
        const label = catLabel(cat);
        let color = CAT_COLORS[cat];
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
        const chip = e.target.closest('.category-chip');
        if (!chip) return;
        let cat = chip.dataset.cat;
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

// Search & Filter

function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length === 0) {
        filteredPapers = allPapers.slice();
    } else {
        filteredPapers = fuse.search(query).map(function(r) { return r.item; });
    }
    applyFilters();
}

function sortPapers(papers, sortBy) {
    const sorted = papers.slice();
    switch (sortBy) {
        case 'relevance':
            sorted.sort(function(a, b) {
                let aInc = a.llm.decision === 'Include' ? 0 : 1;
                let bInc = b.llm.decision === 'Include' ? 0 : 1;
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
                let aInc = a.llm.decision === 'Include' ? 0 : 1;
                let bInc = b.llm.decision === 'Include' ? 0 : 1;
                return aInc - bInc;
            });
            break;
        case 'human':
            sorted.sort(function(a, b) {
                let aVal = !a.human || !a.human.decision ? 2 : (a.human.decision === 'Include' ? 0 : 1);
                let bVal = !b.human || !b.human.decision ? 2 : (b.human.decision === 'Include' ? 0 : 1);
                return aVal - bVal;
            });
            break;
        case 'status':
            sorted.sort(function(a, b) {
                const order = { 'false': 0, 'true': 1, 'null': 2 };
                let aVal = order[String(a.benchmark.agreement)] || 2;
                let bVal = order[String(b.benchmark.agreement)] || 2;
                return aVal - bVal;
            });
            break;
    }
    return sorted;
}

function applyFilters() {
    const decision = document.getElementById('filter-decision').value;
    const humanStatus = document.getElementById('filter-human').value;
    const year = document.getElementById('filter-year').value;

    let filtered = filteredPapers.slice();

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
    syncUrl();
}

// Table Rendering

function renderPapers(papers) {
    if (!papers) papers = filteredPapers;
    renderedPapers = papers;
    let container = document.getElementById('papers-grid');
    const resultsCount = document.getElementById('results-count');
    const totalCount = document.getElementById('total-count');
    if (resultsCount) resultsCount.textContent = papers.length;
    if (totalCount) totalCount.textContent = allPapers.length;

    if (papers.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Papers gefunden.</p>';
        return;
    }

    const totalPages = Math.ceil(papers.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = papers.slice(start, start + PAGE_SIZE);

    let rows = pageItems.map(function(p, i) {
        let idx = start + i;
        const titleShort = p.title.length > 80 ? p.title.substring(0, 77) + '...' : p.title;
        const authorShort = (p.author_year || '').length > 22 ? (p.author_year || '').substring(0, 20) + '...' : (p.author_year || '');
        const divergeClass = p.benchmark.agreement === false ? ' row--diverge' : '';

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

    let html = '<table class="papers-table">' +
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
        for (let i = 1; i <= totalPages; i++) {
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
    // Row, pagination, and sort clicks are handled by one delegated listener
    // attached to #papers-grid in initializeUI.
}

// Table cell helpers
function decBadge(decision) {
    if (!decision) return '<span class="dec-cell dec-cell--none">&mdash;</span>';
    if (decision === 'Include') return '<span class="dec-cell dec-cell--include">Incl</span>';
    return '<span class="dec-cell dec-cell--exclude">Excl</span>';
}

function statusBadge(paper) {
    const s = paperStatus(paper);
    return '<span class="status-pill status-pill--' + s.cls + '">' + s.label + '</span>';
}

function catLabels(paper) {
    let html = '';
    CATEGORIES.forEach(function(cat, i) {
        if (i === 4) html += '<span class="cat-dot-sep"></span>';
        let active = paper.llm.all_categories[cat] === 1;
        let color = active ? CAT_COLORS[cat] : '#e0ddd9';
        html += '<span class="cat-dot-color" style="background:' + color + '" title="' + catLabel(cat) + (active ? ': Ja' : ': Nein') + '"></span>';
    });
    return html;
}

// Paper Detail Panel

function showPaperDetail(paper, paperList) {
    currentDetailPaper = paper;
    if (paperList) currentDetailList = paperList;
    const modal = document.getElementById('paper-modal');
    document.getElementById('modal-title').textContent = paper.title;
    document.getElementById('modal-author').textContent =
        (paper.author_year || '') + (paper.year ? ' | ' + paper.year : '') + (paper.item_type ? ' | ' + paper.item_type : '');

    let bodyHtml = buildDetailContent(paper);

    if (currentDetailList && currentDetailList.length > 1) {
        let idx = currentDetailList.indexOf(paper);
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
            let target = tab.dataset.detailTab;
            document.querySelectorAll('.detail-tab').forEach(function(t) { t.classList.toggle('active', t === tab); });
            document.querySelectorAll('.detail-tab-content').forEach(function(c) {
                c.style.display = c.id === 'dtab-' + target ? '' : 'none';
                c.classList.toggle('active', c.id === 'dtab-' + target);
            });
        });
    });

    const prevBtn = document.getElementById('detail-prev');
    const nextBtn = document.getElementById('detail-next');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            let idx = currentDetailList.indexOf(currentDetailPaper);
            if (idx > 0) showPaperDetail(currentDetailList[idx - 1]);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            let idx = currentDetailList.indexOf(currentDetailPaper);
            if (idx < currentDetailList.length - 1) showPaperDetail(currentDetailList[idx + 1]);
        });
    }
    syncUrl();
}

// Dropdown Navigation

function setupDropdownNav() {
    // Direct view buttons in header nav
    document.querySelectorAll('.nav-view-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchView(btn.dataset.view);
        });
    });
}

// Rich Tooltips (data-driven, HTML content)

function initRichTooltips() {
    // Create tooltip container
    const tip = document.createElement('div');
    tip.className = 'rich-tooltip';
    tip.style.display = 'none';
    document.body.appendChild(tip);

    // Build tooltip content from real data
    const tipContent = buildTooltipContent();

    // Attach to all .has-tip elements
    document.querySelectorAll('.has-tip').forEach(function(el) {
        let key = el.dataset.tipKey;
        if (!key) return;

        el.addEventListener('mouseenter', function(e) {
            let html = tipContent[key];
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
    const rect = anchor.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.bottom + 10;

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
    if (top + tipRect.height > window.innerHeight - 8) top = rect.top - tipRect.height - 10;

    tip.style.left = left + 'px';
    tip.style.top = top + window.scrollY + 'px';
}

function buildTooltipContent() {
    let papers = allPapers;

    // Single pass over the corpus for every aggregate the tooltips need.
    let total = papers.length;
    let yearCounts = {}, catCounts = {};
    let kdCount = 0, withDecision = 0, humanInclude = 0, divergences = 0, llmInclude = 0;
    CATEGORIES.forEach(function(c) { catCounts[c] = 0; });
    papers.forEach(function(p) {
        if (p.year) yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
        if (p.knowledge_doc) kdCount++;
        if (p.llm && p.llm.decision === 'Include') llmInclude++;
        if (p.llm && p.llm.all_categories) {
            CATEGORIES.forEach(function(c) { if (p.llm.all_categories[c] === 1) catCounts[c]++; });
        }
        if (p.human && p.human.decision) { withDecision++; if (p.human.decision === 'Include') humanInclude++; }
        if (p.benchmark && p.benchmark.agreement === false) divergences++;
    });
    const humanExclude = withDecision - humanInclude;
    const inclPct = withDecision ? Math.round(humanInclude / withDecision * 100) : 0;

    // --- Papers ---
    const topYears = Object.keys(yearCounts).sort(function(a, b) { return yearCounts[b] - yearCounts[a]; }).slice(0, 5);
    const yearBars = topYears.map(function(y) {
        let pct = Math.round(yearCounts[y] / total * 100);
        return '<div class="tip-bar-row"><span class="tip-bar-label">' + y + '</span>' +
            '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%"></div></div>' +
            '<span class="tip-bar-val">' + yearCounts[y] + '</span></div>';
    }).join('');

    const tipPapers = '<div class="tip-title">Korpus-Zusammensetzung</div>' +
        '<div class="tip-text">Identifiziert via Deep Research (4 KI-Provider) + manuelle Ergaenzung.</div>' +
        '<div class="tip-section">Jahrgaenge</div>' + yearBars;

    // --- Wissensdokumente ---
    const tipWD = '<div class="tip-title">Destillationspipeline</div>' +
        '<div class="tip-pipeline">' +
            '<span class="tip-step">' + total + ' Papers</span> <i class="fas fa-arrow-right tip-arrow"></i> ' +
            '<span class="tip-step tip-step-hl">' + kdCount + ' Wissensdok.</span>' +
        '</div>' +
        '<div class="tip-text">Dreistufige Extraktion je Volltext: LLM-Extraktion und Klassifikation, deterministische Formatierung, LLM-Verifikation gegen das Original. Jedes Wissensdokument enthaelt Kernbefund, Forschungsfrage, Methodik und Kategorie-Evidenz.</div>';

    const tipHuman = '<div class="tip-title">Duale Bewertung</div>' +
        '<div class="tip-grid">' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--success)">' + humanInclude + '</span><span class="tip-stat-lbl">Include (' + inclPct + '%)</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--gray-500)">' + humanExclude + '</span><span class="tip-stat-lbl">Exclude</span></div>' +
            '<div class="tip-stat"><span class="tip-stat-val" style="color:var(--danger)">' + divergences + '</span><span class="tip-stat-lbl">Divergenzen</span></div>' +
        '</div>' +
        '<div class="tip-text">Fachwissenschaftler:innen (Sackl-Sharif, Klinger) bewerten nach identischem 10-Kategorien-Schema wie das LLM.</div>';

    // --- 10 Kategorien ---
    const catBars = CATEGORIES.map(function(cat, i) {
        let pct = Math.round(catCounts[cat] / total * 100);
        let color = CAT_COLORS[cat];
        const groupLabel = i < 4 ? '' : (i === 4 ? '<div class="tip-section" style="margin-top:0.375rem;">Perspektive</div>' : '');
        return groupLabel + '<div class="tip-bar-row"><span class="tip-bar-label">' + catLabel(cat) + '</span>' +
            '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<span class="tip-bar-val">' + pct + '%</span></div>';
    }).join('');

    const tipCats = '<div class="tip-title">10 Bewertungskategorien</div>' +
        '<div class="tip-section">Gegenstand</div>' + catBars;

    // --- Nav buttons ---
    const conceptCount = (conceptData && conceptData.nodes) ? conceptData.nodes.length : null;
    const topConcepts = (conceptData && conceptData.nodes)
        ? conceptData.nodes.slice().sort(function(a, b) { return b.frequency - a.frequency; }).slice(0, 5)
        : [];

    const tipChat = '<div class="tip-title">Wissens-Chat</div>' +
        '<div class="tip-text">Fragen Sie das synthetisierte Wissen. Ein LLM (Gemini 3 Flash) antwortet mit Inline-Zitationen, die direkt zum Korpus verlinken.</div>' +
        '<div class="tip-text tip-muted">Zweifach LLM-vermittelt: Wissensextraktion + Antwortgenerierung.</div>';

    let tipNetz = '<div class="tip-title">Wissensnetz</div>' +
        '<div class="tip-text">' + (conceptCount != null ? conceptCount + ' Konzepte' : 'Konzepte') +
        ' aus ' + kdCount + ' Wissensdokumenten.</div>';
    if (topConcepts.length > 0) {
        tipNetz += '<div class="tip-section">Haeufigste Konzepte</div>';
        topConcepts.forEach(function(c) {
            let pct = Math.round(c.frequency / papers.length * 100);
            tipNetz += '<div class="tip-bar-row"><span class="tip-bar-label">' + escapeHtml(c.label) + '</span>' +
                '<div class="tip-bar"><div class="tip-bar-fill" style="width:' + pct + '%;background:var(--primary)"></div></div>' +
                '<span class="tip-bar-val">' + c.frequency + '</span></div>';
        });
    }

    const tipVergleich = '<div class="tip-title">Kategorien-Explorer</div>' +
        '<div class="tip-text">10 Kategorien als interaktives Spektrum. Waehlen Sie eine Kategorie, um Human- und LLM-Raten, Divergenz-Papers und Konzepte zu explorieren.</div>' +
        '<div class="tip-text tip-muted">Die Raten je Kategorie weichen unterschiedlich stark ab; die Auswahl zeigt Richtung und Ausmass pro Kategorie.</div>';

    const tipKorpus = '<div class="tip-title">Korpus</div>' +
        '<div class="tip-grid">' +
            '<div class="tip-stat"><span class="tip-stat-val">' + total + '</span><span class="tip-stat-lbl">Papers</span></div>' +
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
    currentView = viewId;
    // Update nav button active state
    document.querySelectorAll('.nav-view-btn').forEach(function(btn) {
        const on = btn.dataset.view === viewId;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    // Show/hide view sections
    document.querySelectorAll('.view-content').forEach(function(v) {
        const isActive = v.id === 'view-' + viewId;
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
    syncUrl();
}

function closePaperModal() {
    document.getElementById('paper-modal').classList.remove('active');
    document.body.classList.remove('panel-open');
    highlightActiveRow(null);
    currentDetailPaper = null;
    syncUrl();
}

function highlightActiveRow(paper) {
    document.querySelectorAll('.papers-table tbody tr.row--active').forEach(function(r) {
        r.classList.remove('row--active');
    });
    if (!paper || !currentDetailList) return;
    let idx = currentDetailList.indexOf(paper);
    if (idx >= 0) {
        let row = document.querySelector('tr[data-idx="' + idx + '"]');
        if (row) row.classList.add('row--active');
    }
}

// URL State (shareable, citable views)

const URL_VIEWS = ['chat', 'wissensnetz', 'vergleich', 'korpus'];

// The navigational state read from the current DOM, categories, view and modal.
function stateFromUI() {
    return {
        view: currentView,
        q: document.getElementById('search-box').value.trim(),
        dec: document.getElementById('filter-decision').value,
        hum: document.getElementById('filter-human').value,
        year: document.getElementById('filter-year').value,
        sort: currentSort,
        cat: Array.from(activeCategories),
        paper: currentDetailPaper ? currentDetailPaper.id : null,
    };
}

// Push the current UI into the store (and thus the URL). A no-op while a URL is
// being applied, so restoring a link does not immediately rewrite it.
function syncUrl() {
    if (applyingFromUrl) return;
    store.set(stateFromUI());
}

// Apply a full state object to the DOM, categories, view and modal, then re-render.
function applyStateToUI(s) {
    applyingFromUrl = true;
    try {
        document.getElementById('search-box').value = s.q || '';
        document.getElementById('filter-decision').value = s.dec || 'all';
        document.getElementById('filter-human').value = s.hum || 'all';
        document.getElementById('filter-year').value = s.year || 'all';
        currentSort = s.sort || 'relevance';
        // A select silently ignores an unknown value, so assign directly rather than
        // probe with querySelector (a crafted sort= would otherwise be an invalid selector).
        const sortSel = document.getElementById('sort-by');
        if (sortSel) sortSel.value = currentSort;

        activeCategories.clear();
        (s.cat || []).forEach(function(c) { activeCategories.add(c); });
        const chipBox = document.getElementById('category-chips');
        if (chipBox) chipBox.querySelectorAll('.category-chip').forEach(function(c) {
            c.classList.toggle('active', activeCategories.has(c.dataset.cat));
        });

        // Reproduce the search base the same way handleSearch does.
        const q = s.q || '';
        filteredPapers = (q.length === 0 || !fuse) ? allPapers.slice() : fuse.search(q).map(function(r) { return r.item; });

        switchView(s.view || 'chat');
        applyFilters();

        if (s.paper) {
            const paper = allPapers.find(function(p) { return p.id === s.paper; });
            if (paper) showPaperDetail(paper, renderedPapers);
            else closePaperModal();
        } else {
            closePaperModal();
        }
    } finally {
        applyingFromUrl = false;
    }
}

// Only the keys that differ from the defaults reach the hash, so a clean view stays a clean URL.
function serializeState(s) {
    const p = new URLSearchParams();
    if (s.view && s.view !== 'chat') p.set('view', s.view);
    if (s.q) p.set('q', s.q);
    if (s.dec && s.dec !== 'all') p.set('dec', s.dec);
    if (s.hum && s.hum !== 'all') p.set('hum', s.hum);
    if (s.year && s.year !== 'all') p.set('year', s.year);
    if (s.sort && s.sort !== 'relevance') p.set('sort', s.sort);
    if (s.cat && s.cat.length) p.set('cat', s.cat.join(','));
    if (s.paper) p.set('paper', s.paper);
    const qs = p.toString();
    return qs ? '#' + qs : '';
}

function deserializeState(hashStr) {
    let h = String(hashStr || '').replace(/^#/, '');
    if (h && h.indexOf('=') < 0) {
        // Back-compat: a bare view hash like #korpus from about/help links.
        return Object.assign({}, DEFAULT_STATE, { view: URL_VIEWS.indexOf(h) >= 0 ? h : 'chat', cat: [] });
    }
    const p = new URLSearchParams(h);
    const view = p.get('view');
    return {
        view: URL_VIEWS.indexOf(view) >= 0 ? view : 'chat',
        q: p.get('q') || '',
        dec: p.get('dec') || 'all',
        hum: p.get('hum') || 'all',
        year: p.get('year') || 'all',
        sort: p.get('sort') || 'relevance',
        // Drop unknown category keys at this trust boundary; otherwise an every()
        // over a non-existent column would silently empty the corpus.
        cat: p.get('cat') ? p.get('cat').split(',').filter(function(c) { return CATEGORIES.indexOf(c) >= 0; }) : [],
        paper: p.get('paper') || null,
    };
}

// The store's one subscriber: mirror state into the location hash. A view or paper
// change is a navigation step (pushState, so Back undoes it); filter churn updates the
// current entry in place (replaceState, so typing never floods the history).
let lastView = null, lastPaper = null, urlReady = false;
function writeUrl(s) {
    const hash = serializeState(s);
    const url = window.location.pathname + window.location.search + hash;
    if (url === window.location.pathname + window.location.search + window.location.hash) {
        lastView = s.view; lastPaper = s.paper || null; urlReady = true;
        return; // already current; also avoids appending a bare '#' to a clean URL
    }
    // Opening a paper or switching view is a navigation step (pushState, so Back
    // undoes it); clearing the paper or filter churn replaces the entry in place.
    const navStep = urlReady && (s.view !== lastView || (s.paper && s.paper !== lastPaper));
    try {
        if (navStep) window.history.pushState(null, '', url);
        else window.history.replaceState(null, '', url);
    } catch (e) {
        // file:// or a sandboxed origin rejects history writes; URL state is a nicety.
    }
    lastView = s.view; lastPaper = s.paper || null; urlReady = true;
}

function restoreFromUrl() {
    applyStateToUI(deserializeState(window.location.hash));
    // Mirror what actually got applied, not the raw hash: an unknown paper closed the
    // modal and unknown categories dropped out. Presetting lastView/lastPaper makes the
    // store write a replaceState, correcting a stale hash in place without a new entry.
    const applied = stateFromUI();
    lastView = applied.view; lastPaper = applied.paper || null; urlReady = true;
    store.set(applied);
}

function initUrlState() {
    store.subscribe(writeUrl);
    window.addEventListener('popstate', restoreFromUrl);
    window.addEventListener('hashchange', restoreFromUrl);
    restoreFromUrl();
}

function buildDetailContent(paper) {
    const hasKnowledge = paper.knowledge && paper.knowledge.sections &&
        Object.keys(paper.knowledge.sections).length > 0;

    let html = '';

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

    const links = [];
    if (paper.doi && paper.doi !== 'nan') {
        links.push('<a href="https://doi.org/' + escapeHtml(paper.doi) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-external-link-alt"></i> DOI</a>');
    }
    if (paper.url && paper.url !== 'nan' && paper.url !== '' && isHttpUrl(paper.url)) {
        links.push('<a href="' + escapeHtml(paper.url) + '" target="_blank" rel="noopener" class="detail-link"><i class="fas fa-globe"></i> Quelle</a>');
    }
    if (paper.knowledge_doc) {
        links.push('<a href="#" data-action="download-doc" class="detail-link"><i class="fas fa-download"></i> .md</a>');
    }
    if (links.length) {
        html += '<div class="detail-links">' + links.join('') + '</div>';
    }

    html += '<div class="detail-section"><h3>Bewertung</h3><div class="assessment-grid">';

    const llmDecColor = paper.llm.decision === 'Include' ? 'var(--success)' : 'var(--gray-500)';
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
        const hDecColor = paper.human.decision === 'Include' ? 'var(--success)' : 'var(--gray-500)';
        html += '<div class="assessment-panel">' +
            '<div class="panel-header">Expert:innen</div>' +
            '<div class="assessment-decision" style="color:' + hDecColor + '">' + paper.human.decision + '</div>' +
            catGridColored(paper.human.all_categories) +
        '</div>';
    } else {
        let total = vaultMeta.total_papers || allPapers.length;
        const withHuman = vaultMeta.papers_with_human != null ? vaultMeta.papers_with_human : '';
        html += '<div class="assessment-panel assessment-panel--empty">' +
            '<div class="panel-header">Expert:innen</div>' +
            '<p class="empty-note">Nicht bewertet. Human Assessment deckt ' + withHuman + ' von ' + total + ' Papers ab.</p>' +
        '</div>';
    }

    html += '</div>'; // close assessment-grid

    if (paper.benchmark.has_human && paper.human && paper.human.decision) {
        if (paper.benchmark.agreement === false) {
            const affectedCats = paper.benchmark.affected_categories || [];
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
                    let color = CAT_COLORS[c] || 'var(--gray-400)';
                    return '<span style="color:' + color + ';font-weight:600;">' + catLabel(c) + '</span>';
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
        const ks = paper.knowledge.sections;
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
            html += '<a href="#" data-action="download-doc" class="export-button"><i class="fas fa-download"></i> Vollstaendiges Wissensdokument (.md)</a>';
            html += '</div>';
        }
    } else {
        const totalKd = vaultMeta.total_papers || allPapers.length;
        const withoutKd = totalKd - allPapers.filter(function(p) { return p.knowledge_doc; }).length;
        html += '<div class="kd-empty">';
        html += '<p><i class="fas fa-file-alt" style="font-size:1.5rem;color:var(--gray-300);"></i></p>';
        html += '<p>Kein Wissensdokument verfuegbar.</p>';
        html += '<p style="font-size:var(--text-xs);color:var(--gray-400);">Fuer dieses Paper konnte kein PDF akquiriert werden (' + withoutKd + ' von ' + totalKd + ' Papers betroffen).</p>';
        html += '</div>';
    }
    html += '</div>'; // close dtab-wissen

    return html;
}

function catGridColored(allCategories) {
    let html = '<div class="category-grid-10">';
    CATEGORIES.forEach(function(cat) {
        let active = allCategories[cat] === 1;
        let color = active ? CAT_COLORS[cat] : 'var(--gray-300)';
        const textColor = active ? 'var(--gray-800)' : 'var(--gray-400)';
        const fontWeight = active ? '600' : '400';
        html += '<div class="cat-grid-item" style="color:' + textColor + ';font-weight:' + fontWeight + '">' +
            '<span class="cat-dot" style="background:' + color + '"></span>' +
            '<span>' + catLabel(cat) + '</span>' +
        '</div>';
    });
    html += '</div>';
    return html;
}

// Export & Download

function exportFilteredPapers() {
    let papers = filteredPapers.length > 0 ? filteredPapers : allPapers;
    const headers = ['ID', 'Title', 'Author_Year', 'Year', 'Item_Type', 'DOI',
        'LLM_Decision', 'LLM_Categories',
        'Human_Decision', 'Has_Human', 'Agreement'];
    let rows = papers.map(function(p) {
        return [p.id, p.title, p.author_year, p.year, p.item_type, p.doi,
            p.llm.decision, p.llm.categories.join(';'),
            p.human ? p.human.decision : '', p.benchmark.has_human,
            p.benchmark.agreement === null ? '' : p.benchmark.agreement];
    });
    const csv = [headers].concat(rows).map(function(r) {
        return r.map(function(v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    download('fem_prompt_papers.csv', csv, 'text/csv;charset=utf-8;');
}

function downloadKnowledgeDoc(docPath, title) {
    fetch(docPath).then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.blob();
    }).then(function(blob) {
        let safeName = title.replace(/[<>:"/\\|?*]/g, '-').substring(0, 100) + '.md';
        download(safeName, blob);
    }).catch(function(err) {
        console.error('[Download]', err);
    });
}

function downloadVaultZip() {
    download('FemPrompt_Research_Vault.zip', 'downloads/vault.zip');
}

function exportFilteredMarkdown() {
    if (typeof JSZip === 'undefined') {
        alert('JSZip wird geladen, bitte erneut versuchen.');
        return;
    }

    let papers = filteredPapers.length ? filteredPapers : allPapers;
    const withDocs = papers.filter(function(p) { return p.knowledge_doc; });

    if (withDocs.length === 0) {
        alert('Keine Wissensdokumente fuer die aktuelle Auswahl verfuegbar.');
        return;
    }

    const zip = new JSZip();
    const fetches = [];

    withDocs.forEach(function(p) {
        const promise = fetch(p.knowledge_doc)
            .then(function(res) { return res.ok ? res.text() : null; })
            .then(function(text) {
                if (text) {
                    let safeName = (p.author_year || p.id).replace(/[<>:"/\\|?*]/g, '-').substring(0, 80) + '.md';
                    zip.file(safeName, text);
                }
            })
            .catch(function() {});
        fetches.push(promise);
    });

    Promise.all(fetches).then(function() {
        // Generate README with system prompt
        let readme = '# Forschungskorpus-Auswahl (' + withDocs.length + ' Wissensdokumente)\n\n';
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
        download('fem_prompt_auswahl_' + withDocs.length + '_papers.zip', blob);
    });
}

})();
