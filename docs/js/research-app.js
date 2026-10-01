// Evidence Companion - Feministische AI Literacies
// Systematischer Review -- Interaktive Evidenz

(function() {
'use strict';

// Shared Constants & Utilities (exposed via window.EC)

const CATEGORIES = [];
const CAT_COLORS = {};
const CATEGORY_LABELS = {};
let categoryGroups = {}; // schema group map, the order of the Gegenstand and Perspektive chip groups

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// Human-readable category label from the underscore key.
function catLabel(cat) {
    return CATEGORY_LABELS[cat] || String(cat || '').replace(/_/g, ' ');
}

// The shared category chip row (EC.categoryChipRow from public-release.js) over the
// given keys; options(key) returns the chip options of one key.
function categoryChips(keys, options) {
    return window.EC.categoryChipRow(keys.map(function(key) {
        return { category: { key: key, label: catLabel(key), color: CAT_COLORS[key] }, options: options ? options(key) : {} };
    }), categoryGroups);
}

function normalizeSearch(text) {
    return String(text || '')
        .toLocaleLowerCase('de')
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
const activeCategories = new Set();
let benchmarkInitialized = false;
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
let korpusResult = []; // the fully filtered corpus selection, which the exports write
let stageSel = 'all'; // a review stage or work list of EC.korpusStages, 'all' for none
let currentView = 'start';
let applyingFromUrl = false; // suppresses UI->store sync while a URL is being applied

// Views rendered by the release modules (release-*.js), mapped to the names those
// modules use. Literaturbild hosts the matrix and Wissensnetz the network; Frage and
// Werk have no navigation button and are reached through links.
const RELEASE_VIEWS = { literaturbild: 'matrix', wissensnetz: 'netz', frage: 'frage', werk: 'werk' };
const VIEW_OF_RELEASE = { matrix: 'literaturbild', netz: 'wissensnetz', frage: 'frage', werk: 'werk' };
// 'loading', 'ready', or the message of a failed model load.
let releaseState = 'loading';
let releaseParams = {}; // parameters of the release view on screen
const lastReleaseParams = {}; // per navigation tab, restored when the tab is chosen again

// Central store for the navigational state the URL serializes: active view, corpus
// filters, selected paper and the parameters of a release view. Views write it through
// syncUrl or releaseGo and read it through applyStateToUI; one subscriber mirrors it
// into the location hash, so any view is a shareable, citable link. subscribe/set are
// the Observer pattern the DH-interface standard prescribes for coordinated
// framework-free views. This store is the only router of the page: the release
// modules navigate through EC.host and never listen to the hash themselves.
const DEFAULT_STATE = {
    view: 'start', q: '', dec: 'all', hum: 'all', year: 'all', stage: 'all', sort: 'relevance', cat: [], paper: null, rp: {}, vp: {},
};

// A working view with parameters of its own (kategorien.js) registers a codec
// { keys, get, apply } here; the router serializes them as vp and stays the only writer
// of the hash.
const VIEW_PARAMS = {};

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
    categoryGroups: function() { return categoryGroups; },
    CATEGORIES: CATEGORIES,
    // Central store (subscribe/set/get) holding the URL-serialized view state
    store: store,
    // Router for the release modules loaded after this file (public-release.js reads it)
    host: { go: releaseGo, href: releaseHref, parseHash: releaseParseHash },
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
    viewParams: {
        register: function(view, codec) { VIEW_PARAMS[view] = codec; },
        // A changed view parameter is a navigation step, so Back restores the previous one.
        changed: function() {
            navMode = 'push';
            try { syncUrl(); } finally { navMode = null; }
        },
    },
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
    // The release model loads beside the working data; its failure leaves the other
    // views usable and is shown on the release views only.
    const release = window.EC.release
        ? window.EC.release.start(Object.keys(VIEW_OF_RELEASE)).then(function() { releaseState = 'ready'; }, function(error) {
            console.error('[Evidence] release views unavailable:', error);
            releaseState = error.message;
        })
        : Promise.resolve().then(function() { releaseState = 'Diese Ansicht ist auf dieser Seite nicht geladen.'; });
    // The stage data are optional files; a missing one leaves its stage out, never the view.
    const stages = loadData().then(function() { return window.EC.korpusStages.load(allPapers); });
    Promise.all([stages, release]).then(function() {
        initializeUI();
        renderCategoryChips();
        logInit();
        // Chat is the default tab; initialize it up front.
        if (window.initWissensChat) window.initWissensChat();
        if (releaseState === 'ready' && window.EC.renderStart) window.EC.renderStart(window.EC.model);
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
    function loadJson(path) {
        return fetch(path).then(function(response) {
            if (!response.ok) throw new Error(path + ' konnte nicht geladen werden');
            return response.json();
        });
    }
    return Promise.all([
        loadJson('data/research_vault_v2.json'),
        loadJson('data/category_schema.json')
    ]).then(function(payloads) {
        const data = payloads[0];
        const categorySchema = payloads[1];
        categorySchema.categories.forEach(function(category) {
            CATEGORIES.push(category.key);
            CAT_COLORS[category.key] = category.color;
            CATEGORY_LABELS[category.key] = category.label;
        });
        categoryGroups = categorySchema.groups || {};
        allPapers = data.papers;
        vaultMeta = data.meta;
        kappas = data.kappa_by_category;
        allPapers.forEach(function(paper) {
            paper._searchText = normalizeSearch([
                paper.title, paper.author_year, paper.authors, paper.abstract, paper.doi
            ].join(' '));
        });
        filteredPapers = allPapers.slice();

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
                const idMap = {};
                allPapers.forEach(function(p) {
                    let key = (p.title || '').toLowerCase().substring(0, 80).trim();
                    if (key) titleMap[key] = p;
                    if (p.id) idMap[p.id] = p;
                });

                let matched = 0;
                (ptData.divergences || []).forEach(function(div) {
                    let key = (div.title || '').toLowerCase().substring(0, 80).trim();
                    // Match on the stable Zotero-key id first. The title/author_year cascade is a
                    // fallback only: distinct papers can share an author_year (several "Reamer (2023)"),
                    // and last-write-wins on that key collapsed them onto one object and duplicated cards.
                    let paper = (div.paper_id && idMap[div.paper_id]) || titleMap[key];
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
                    let paper = (ptPaper.id && idMap[ptPaper.id]) || titleMap[key];
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
    document.getElementById('sort-by').addEventListener('change', function() {
        currentSort = this.value;
        applyFilters();
    });

    initYearHistogram();

    // Stage bar and work lists share one filter value; pressing the active one clears it.
    ['stage-bar', 'gap-list'].forEach(function(id) {
        document.getElementById(id).addEventListener('click', function(e) {
            const btn = e.target.closest('button[data-stage]');
            if (!btn) return;
            stageSel = btn.dataset.stage === stageSel ? 'all' : btn.dataset.stage;
            applyFilters();
        });
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

// Category Chips

function renderCategoryChips() {
    let container = document.getElementById('category-chips');
    container.innerHTML = categoryChips(CATEGORIES, function(cat) { return { pressed: activeCategories.has(cat) }; });

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
            c.setAttribute('aria-pressed', String(activeCategories.has(c.dataset.cat)));
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
        const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
        filteredPapers = allPapers.filter(function(paper) {
            return terms.every(function(term) {
                return paper._searchText.indexOf(term) >= 0;
            });
        });
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
        case 'stage':
            sorted.sort(function(a, b) {
                return window.EC.korpusStages.depth(b) - window.EC.korpusStages.depth(a) || (b.year || 0) - (a.year || 0);
            });
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
                // explicit lookup: order['false'] is 0, and `0 || 2` would push divergences
                // (the rows this sort exists to surface) to the bottom instead of the top
                const rank = function(v) { let k = String(v); return order.hasOwnProperty(k) ? order[k] : 2; };
                let aVal = rank(a.benchmark.agreement);
                let bVal = rank(b.benchmark.agreement);
                return aVal - bVal;
            });
            break;
    }
    return sorted;
}

function applyFilters() {
    const decision = document.getElementById('filter-decision').value;
    const humanStatus = document.getElementById('filter-human').value;

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

    if (activeCategories.size > 0) {
        filtered = filtered.filter(function(p) {
            return Array.from(activeCategories).every(function(cat) { return p.llm.all_categories[cat] === 1; });
        });
    }

    // Year histogram and stage bar each count the selection of every other filter but
    // their own, so they show how the selection spreads and every value stays choosable.
    const stages = window.EC.korpusStages;
    const byYear = yearSel === 'all' ? filtered : filtered.filter(function(p) { return yearSelected(yearKey(p)); });
    const byStage = stageSel === 'all' ? filtered : filtered.filter(function(p) { return stages.match(stageSel, p); });
    renderYearHistogram(byStage);
    renderStages(byYear);
    filtered = byYear.filter(function(p) { return stageSel === 'all' || stages.match(stageSel, p); });

    filtered = sortPapers(filtered, currentSort);
    korpusResult = filtered;
    currentPage = 1;
    renderPapers(filtered);
    syncUrl();
}

function renderStages(papers) {
    const stages = window.EC.korpusStages;
    const counts = stages.counts(papers);
    // The buttons are rebuilt, so a keyboard user keeps focus on the stage just chosen.
    const active = document.activeElement;
    const focused = active && active.closest && active.closest('#view-korpus button[data-stage]');
    const bar = document.getElementById('stage-bar');
    const gaps = document.getElementById('gap-list');
    const home = focused && (bar.contains(focused) ? bar : gaps);
    bar.innerHTML = stages.barHtml(counts, stageSel);
    gaps.innerHTML = stages.gapsHtml(counts, stageSel);
    if (home) {
        const again = home.querySelector('button[data-stage="' + focused.dataset.stage + '"]');
        if (again) again.focus();
    }
}

// Publication-year histogram, the year filter of the corpus

const NO_YEAR = 'oj'; // the URL value of the column for works without a year
// Top-down order of the stacked segments; the legend and the tooltip list them alike,
// so a status is identified by position as well as by colour.
const YEAR_STATUS = [
    { key: 'open', label: 'offen' },
    { key: 'exclude', label: 'ausgeschlossen' },
    { key: 'include', label: 'eingeschlossen' },
];
const YEAR_LABEL_MIN_PX = 36; // the width an axis label needs before neighbours collide
let yearColumns = [];
let yearCounts = {};
let yearSel = 'all'; // 'all', 'YYYY', 'YYYY-YYYY' or NO_YEAR
let yearAnchor = null; // the year a shift+click extends a range from

function yearKey(paper) {
    const year = parseInt(paper.year, 10);
    return isFinite(year) ? String(year) : NO_YEAR;
}

function yearName(key) {
    return key === NO_YEAR ? 'o. J.' : key;
}

function workCount(n) {
    return n === 1 ? '1 Werk' : n + ' Werke';
}

// The expert decision, the screening mark of the stage track; no decision is open.
function yearStatus(paper) {
    return window.EC.korpusStages.decision(paper);
}

// Normalizes a year selection from the URL, a trust boundary; anything else is no filter.
function parseYearSel(value) {
    const v = String(value || '');
    if (v === NO_YEAR || /^\d{4}$/.test(v)) return v;
    const range = /^(\d{4})-(\d{4})$/.exec(v);
    if (!range) return 'all';
    const from = Math.min(+range[1], +range[2]);
    const to = Math.max(+range[1], +range[2]);
    return from === to ? String(from) : from + '-' + to;
}

function yearSelected(key) {
    if (yearSel === 'all') return false;
    if (yearSel === NO_YEAR || key === NO_YEAR) return yearSel === key;
    const bounds = yearSel.split('-');
    const year = Number(key);
    return year >= Number(bounds[0]) && year <= Number(bounds[bounds.length - 1]);
}

function selectYear(key, extend) {
    if (extend && key !== NO_YEAR && yearAnchor !== null && yearAnchor !== key) {
        const a = Number(yearAnchor), b = Number(key);
        yearSel = Math.min(a, b) + '-' + Math.max(a, b);
    } else if (yearSel === key) {
        yearSel = 'all';
        yearAnchor = null;
    } else {
        yearSel = key;
        yearAnchor = key === NO_YEAR ? null : key;
    }
    applyFilters();
}

function yearSwatch(key) {
    return '<span class="year-swatch year-seg--' + key + '" aria-hidden="true"></span>';
}

// The columns are fixed by the whole corpus, a continuous year range so that gaps show
// as empty columns, and keep their place while the other filters change the heights.
function initYearHistogram() {
    const box = document.getElementById('year-hist');
    if (!box) return;
    const years = allPapers.map(yearKey).filter(function(k) { return k !== NO_YEAR; }).map(Number);
    yearColumns = [];
    if (years.length) {
        const last = Math.max.apply(null, years);
        for (let y = Math.min.apply(null, years); y <= last; y++) yearColumns.push(String(y));
    }
    if (allPapers.some(function(p) { return yearKey(p) === NO_YEAR; })) yearColumns.push(NO_YEAR);

    box.innerHTML = '<div class="year-hist-scroll"><div class="year-hist-cols">' +
        yearColumns.map(function(key) {
            return '<button type="button" class="year-col' + (key === NO_YEAR ? ' year-col--none' : '') +
                '" data-year="' + escapeHtml(key) + '" aria-pressed="false" aria-describedby="year-tip">' +
                '<span class="year-bar">' + YEAR_STATUS.map(function(s) {
                    return '<span class="year-seg year-seg--' + s.key + '"></span>';
                }).join('') + '</span>' +
                '<span class="year-label">' + escapeHtml(yearName(key)) + '</span></button>';
        }).join('') + '</div></div>' +
        '<ul class="year-hist-legend" aria-hidden="true">' + YEAR_STATUS.map(function(s) {
            return '<li>' + yearSwatch(s.key) + s.label + '</li>';
        }).join('') + '</ul>';

    const tip = document.createElement('div');
    tip.id = 'year-tip';
    tip.className = 'rich-tooltip year-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);

    function show(btn) {
        const key = btn.dataset.year;
        const c = yearCounts[key];
        if (!c) return;
        tip.innerHTML = '<div class="year-tip-title">' + escapeHtml(yearName(key)) + ', ' + escapeHtml(workCount(c.total)) + '</div>' +
            '<ul class="year-tip-list">' + YEAR_STATUS.map(function(s) {
                return '<li>' + yearSwatch(s.key) + '<span>' + s.label + '</span><span class="year-tip-n">' + c[s.key] + '</span></li>';
            }).join('') + '</ul>';
        tip.hidden = false;
        positionTip(tip, btn);
    }
    function hide() { tip.hidden = true; }

    box.addEventListener('click', function(e) {
        const btn = e.target.closest('.year-col');
        if (!btn) return;
        selectYear(btn.dataset.year, e.shiftKey);
        show(btn);
    });
    box.addEventListener('mouseover', function(e) {
        const btn = e.target.closest('.year-col');
        if (btn) show(btn);
    });
    box.addEventListener('mouseleave', function() {
        if (!box.contains(document.activeElement)) hide();
    });
    box.addEventListener('focusin', function(e) {
        const btn = e.target.closest('.year-col');
        if (btn) show(btn);
    });
    box.addEventListener('focusout', function(e) {
        if (!e.relatedTarget || !box.contains(e.relatedTarget)) hide();
    });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') hide(); });
    window.addEventListener('resize', thinYearLabels);
}

// Placement as in the navigation tooltips (nav-tips.js), below the anchor and inside the viewport.
function positionTip(tip, anchor) {
    const rect = anchor.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - box.width / 2;
    let top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + box.width > window.innerWidth - 8) left = window.innerWidth - box.width - 8;
    if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 8;
    tip.style.left = left + window.scrollX + 'px';
    tip.style.top = top + window.scrollY + 'px';
}

function renderYearHistogram(papers) {
    const box = document.getElementById('year-hist');
    if (!box || !yearColumns.length) return;
    yearCounts = {};
    yearColumns.forEach(function(key) { yearCounts[key] = { include: 0, exclude: 0, open: 0, total: 0 }; });
    papers.forEach(function(p) {
        const c = yearCounts[yearKey(p)];
        c[yearStatus(p)]++;
        c.total++;
    });
    // One linear scale for all columns, fitted to the current selection.
    const max = Math.max(1, Math.max.apply(null, yearColumns.map(function(key) { return yearCounts[key].total; })));
    box.classList.toggle('has-selection', yearSel !== 'all');
    box.querySelectorAll('.year-col').forEach(function(btn) {
        const key = btn.dataset.year;
        const c = yearCounts[key];
        const on = yearSelected(key);
        btn.setAttribute('aria-pressed', String(on));
        btn.setAttribute('aria-label', yearName(key) + ', ' + workCount(c.total));
        // A selected empty year stays enabled so that it can be cleared.
        btn.disabled = c.total === 0 && !on;
        btn.querySelectorAll('.year-seg').forEach(function(seg, i) {
            seg.style.height = (c[YEAR_STATUS[i].key] / max * 100) + '%';
        });
    });
    thinYearLabels();
}

// Labels every year while the columns are wide enough, else every second, fifth or tenth
// year counted back from the newest, the year most often looked for.
function thinYearLabels() {
    const cols = document.querySelector('#year-hist .year-hist-cols');
    if (!cols) return;
    const width = cols.clientWidth / yearColumns.length;
    let step = 1;
    [1, 2, 5, 10].some(function(s) { step = s; return !width || width * s >= YEAR_LABEL_MIN_PX; });
    const labels = cols.querySelectorAll('.year-col:not(.year-col--none) .year-label');
    labels.forEach(function(label, i) {
        label.classList.toggle('is-thinned', (labels.length - 1 - i) % step !== 0);
    });
}

// Table Rendering

function renderPapers(papers) {
    if (!papers) papers = filteredPapers;
    renderedPapers = papers;
    let container = document.getElementById('papers-grid');
    const resultsCount = document.getElementById('results-count');
    const resultsLabel = document.getElementById('results-label');
    if (resultsCount) resultsCount.textContent = papers.length;
    if (resultsLabel) resultsLabel.textContent = papers.length === 1 ? 'Werk' : 'Werke';

    if (papers.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Werke in dieser Auswahl.</p>';
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

        // The title is a button so that the row detail opens by keyboard as well.
        return '<tr class="paper-row" data-idx="' + idx + '" data-id="' + escapeHtml(p.id) + '">' +
            '<td class="col-title" title="' + escapeHtml(p.title) + '"><button type="button" class="row-open">' + escapeHtml(titleShort) + '</button></td>' +
            '<td class="col-author">' + escapeHtml(authorShort) + '</td>' +
            '<td class="col-year">' + escapeHtml(p.year || '') + '</td>' +
            '<td class="col-stage">' + window.EC.korpusStages.trackHtml(p) + '</td>' +
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
            '<th class="col-stage sortable" data-sort="stage" title="Volltext, Screening, Kodierung, Aussagen">Stand' + sortArrow('stage') + '</th>' +
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

window.switchView = function(viewId) { switchView(viewId); };

// params and ctx come from the router (applyStateToUI); a navigation button passes
// neither, so a release view reopens with the parameters it last showed.
function switchView(viewId, params, ctx) {
    const changed = viewId !== currentView;
    currentView = viewId;
    // Update nav button active state
    document.querySelectorAll('.nav-view-btn').forEach(function(btn) {
        const on = btn.dataset.view === viewId;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
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
    // A hidden histogram has no width, so its labels are thinned once it shows.
    if (viewId === 'korpus') thinYearLabels();
    if (viewId === 'chat' && !chatInitialized) {
        chatInitialized = true;
        if (window.initWissensChat) window.initWissensChat();
    }

    const failed = RELEASE_VIEWS[viewId] && releaseState !== 'ready' && releaseState !== 'loading';
    const error = document.getElementById('release-error');
    if (error) {
        error.textContent = failed ? releaseState : '';
        error.hidden = !failed;
    }
    if (RELEASE_VIEWS[viewId]) {
        releaseParams = params || (changed ? lastReleaseParams[viewId] : releaseParams) || {};
        renderReleaseView(viewId, Object.assign({ changed: changed, external: false }, ctx));
    } else {
        releaseParams = {};
    }
    syncUrl();
}

function hasNavButton(viewId) {
    return Boolean(document.querySelector('.nav-view-btn[data-view="' + viewId + '"]'));
}

function renderReleaseView(viewId, ctx) {
    if (releaseState !== 'ready') return;
    if (hasNavButton(viewId)) lastReleaseParams[viewId] = releaseParams;
    const name = RELEASE_VIEWS[viewId];
    window.EC.release.render(name, Object.assign({}, releaseParams, { view: name }), {
        root: document.getElementById('view-' + viewId),
        changed: ctx.changed,
        external: ctx.external,
        // A view without a navigation button is a page of its own, so focus moves to its
        // heading; on a tab view it stays on the tab.
        focusHeading: urlReady && !hasNavButton(viewId),
    });
}

// The release modules' parameters without their view name and without empty values.
function releaseParamsOf(params) {
    const rp = {};
    Object.keys(params || {}).forEach(function(key) {
        const value = params[key];
        if (key !== 'view' && value != null && value !== '' && value !== 'all') rp[key] = String(value);
    });
    return rp;
}

// EC.host: the release modules navigate with their own view names (matrix, netz, frage,
// werk); the router translates them to the views of this page.
function releaseParseHash() {
    const s = deserializeState(window.location.hash);
    return Object.assign({}, s.rp, { view: RELEASE_VIEWS[s.view] || s.view });
}

function releaseHref(params) {
    const view = VIEW_OF_RELEASE[params.view];
    return view ? serializeState({ view: view, rp: releaseParamsOf(params) }) : '#view=start';
}

// Control changes push a history entry; options.replace (typing) updates the current one.
function releaseGo(params, options) {
    const view = VIEW_OF_RELEASE[params.view];
    if (!view) return;
    const next = Object.assign({}, store.get(), { view: view, rp: releaseParamsOf(params), paper: null });
    applyStateToUI(next, { external: false });
    navMode = options && options.replace ? 'replace' : 'push';
    try { store.set(Object.assign({}, next, stateFromUI())); } finally { navMode = null; }
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

const URL_VIEWS = ['start', 'chat', 'wissensnetz', 'literaturbild', 'vergleich', 'korpus', 'frage', 'werk'];

// The navigational state read from the current DOM, categories, view, modal and release view.
function stateFromUI() {
    return {
        view: currentView,
        q: document.getElementById('search-box').value.trim(),
        dec: document.getElementById('filter-decision').value,
        hum: document.getElementById('filter-human').value,
        year: yearSel,
        stage: stageSel,
        sort: currentSort,
        cat: Array.from(activeCategories),
        paper: currentDetailPaper ? currentDetailPaper.id : null,
        rp: releaseParams,
        vp: VIEW_PARAMS[currentView] ? VIEW_PARAMS[currentView].get() : {},
    };
}

// Push the current UI into the store (and thus the URL). A no-op while a URL is
// being applied, so restoring a link does not immediately rewrite it.
function syncUrl() {
    if (applyingFromUrl) return;
    store.set(stateFromUI());
}

// Apply a full state object to the DOM, categories, view and modal, then re-render.
// ctx.external marks a deep link, Back or Forward, as opposed to a control change.
function applyStateToUI(s, ctx) {
    applyingFromUrl = true;
    try {
        const release = Boolean(RELEASE_VIEWS[s.view]);
        // The hash of a release view carries no corpus filters, so the corpus keeps its state.
        if (!release) {
            document.getElementById('search-box').value = s.q || '';
            document.getElementById('filter-decision').value = s.dec || 'all';
            document.getElementById('filter-human').value = s.hum || 'all';
            yearSel = parseYearSel(s.year);
            const anchor = /^\d{4}/.exec(yearSel);
            yearAnchor = anchor ? anchor[0] : null;
            stageSel = window.EC.korpusStages.parse(s.stage);
            currentSort = s.sort || 'relevance';
            // A select silently ignores an unknown value, so assign directly rather than
            // probe with querySelector (a crafted sort= would otherwise be an invalid selector).
            const sortSel = document.getElementById('sort-by');
            if (sortSel) sortSel.value = currentSort;

            activeCategories.clear();
            (s.cat || []).forEach(function(c) { activeCategories.add(c); });
            const chipBox = document.getElementById('category-chips');
            if (chipBox) chipBox.querySelectorAll('.category-chip').forEach(function(c) {
                c.setAttribute('aria-pressed', String(activeCategories.has(c.dataset.cat)));
            });

            // Reproduce the search base the same way handleSearch does.
            const q = s.q || '';
            if (q.length === 0) {
                filteredPapers = allPapers.slice();
            } else {
                const terms = normalizeSearch(q).split(/\s+/).filter(Boolean);
                filteredPapers = allPapers.filter(function(paper) {
                    return terms.every(function(term) { return paper._searchText.indexOf(term) >= 0; });
                });
            }
        }

        switchView(s.view || 'start', release ? (s.rp || {}) : null, ctx);
        if (VIEW_PARAMS[s.view]) VIEW_PARAMS[s.view].apply(s.vp || {});
        if (!release) applyFilters();

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

// Only the keys that differ from the defaults reach the hash, so a clean view stays a
// clean URL. A release view carries its own parameters and no corpus filters.
function serializeState(s) {
    const p = new URLSearchParams();
    if (s.view && s.view !== 'start') p.set('view', s.view);
    if (RELEASE_VIEWS[s.view]) {
        Object.keys(s.rp || {}).sort().forEach(function(key) { p.set(key, s.rp[key]); });
        return '#' + p.toString();
    }
    if (s.q) p.set('q', s.q);
    if (s.dec && s.dec !== 'all') p.set('dec', s.dec);
    if (s.hum && s.hum !== 'all') p.set('hum', s.hum);
    if (s.year && s.year !== 'all') p.set('year', s.year);
    if (s.stage && s.stage !== 'all') p.set('stage', s.stage);
    if (s.sort && s.sort !== 'relevance') p.set('sort', s.sort);
    if (s.cat && s.cat.length) p.set('cat', s.cat.join(','));
    if (VIEW_PARAMS[s.view]) VIEW_PARAMS[s.view].keys.forEach(function(key) { if (s.vp && s.vp[key]) p.set(key, s.vp[key]); });
    if (s.paper) p.set('paper', s.paper);
    const qs = p.toString();
    return qs ? '#' + qs : '';
}

function deserializeState(hashStr) {
    let h = String(hashStr || '').replace(/^#/, '');
    if (h && h.indexOf('=') < 0) {
        // Back-compat: a bare view hash like #korpus from about/help links.
        return Object.assign({}, DEFAULT_STATE, { view: URL_VIEWS.indexOf(h) >= 0 ? h : 'start', cat: [], rp: {} });
    }
    const p = new URLSearchParams(h);
    const view = URL_VIEWS.indexOf(p.get('view')) >= 0 ? p.get('view') : 'start';
    if (RELEASE_VIEWS[view]) {
        // The release modules validate their own parameters against the model.
        const rp = {};
        p.forEach(function(value, key) { if (key !== 'view') rp[key] = value; });
        return Object.assign({}, DEFAULT_STATE, { view: view, cat: [], rp: releaseParamsOf(rp) });
    }
    return {
        view: view,
        q: p.get('q') || '',
        dec: p.get('dec') || 'all',
        hum: p.get('hum') || 'all',
        year: parseYearSel(p.get('year')),
        stage: window.EC.korpusStages.parse(p.get('stage')),
        sort: p.get('sort') || 'relevance',
        // Drop unknown category keys at this trust boundary; otherwise an every()
        // over a non-existent column would silently empty the corpus.
        cat: p.get('cat') ? p.get('cat').split(',').filter(function(c) { return CATEGORIES.indexOf(c) >= 0; }) : [],
        paper: p.get('paper') || null,
        rp: {},
        // The registered view validates its own values in apply.
        vp: VIEW_PARAMS[view] ? Object.fromEntries(VIEW_PARAMS[view].keys.map(function(key) { return [key, p.get(key) || '']; })) : {},
    };
}

// The store's one subscriber: mirror state into the location hash. A view or paper
// change is a navigation step (pushState, so Back undoes it); filter churn updates the
// current entry in place (replaceState, so typing never floods the history). A release
// control sets navMode explicitly, since its changes are navigation steps within a view.
let lastView = null, lastPaper = null, urlReady = false, navMode = null, handledHash = null;
function writeUrl(s) {
    const hash = serializeState(s);
    const url = window.location.pathname + window.location.search + hash;
    if (url === window.location.pathname + window.location.search + window.location.hash) {
        lastView = s.view; lastPaper = s.paper || null; urlReady = true;
        handledHash = window.location.hash;
        return; // already current; also avoids appending a bare '#' to a clean URL
    }
    // Opening a paper or switching view is a navigation step (pushState, so Back
    // undoes it); clearing the paper or filter churn replaces the entry in place.
    const navStep = urlReady && (navMode ? navMode === 'push' : (s.view !== lastView || (s.paper && s.paper !== lastPaper)));
    try {
        if (navStep) window.history.pushState(null, '', url);
        else window.history.replaceState(null, '', url);
    } catch (e) {
        // file:// or a sandboxed origin rejects history writes; URL state is a nicety.
    }
    lastView = s.view; lastPaper = s.paper || null; urlReady = true;
    handledHash = window.location.hash;
}

function restoreFromUrl() {
    // A traversal can report itself through both popstate and hashchange; the second
    // report finds its hash already applied.
    if (urlReady && window.location.hash === handledHash) return;
    const decoded = deserializeState(window.location.hash);
    applyStateToUI(decoded, { external: true });
    // Mirror what actually got applied, not the raw hash: an unknown paper closed the
    // modal and unknown categories dropped out. Presetting lastView/lastPaper makes the
    // store write a replaceState, correcting a stale hash in place without a new entry.
    const applied = Object.assign({}, decoded, stateFromUI());
    lastView = applied.view; lastPaper = applied.paper || null; urlReady = true;
    store.set(applied);
    handledHash = window.location.hash;
}

function initUrlState() {
    // The corpus table renders once up front, since a link can open a release view
    // first, which leaves the corpus filters untouched.
    applyFilters();
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
                html += '<p class="affected-cats">Betroffene Kategorien ' + categoryChips(affectedCats, function() { return { small: true }; }) + '</p>';
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

// The categories an assessment assigns, as grouped category chips.
function catGridColored(allCategories) {
    const assigned = CATEGORIES.filter(function(cat) { return allCategories[cat] === 1; });
    return '<p class="category-chips assessment-categories">' +
        (assigned.length ? categoryChips(assigned, function() { return { small: true }; }) : 'keine Kategorie') + '</p>';
}

// Export & Download

// The exports write the selection on screen, so a stage or work list yields a work
// package; the file name carries the stage.
function exportName(ext) {
    return 'fem_prompt_korpus' + (stageSel === 'all' ? '' : '_' + stageSel) + '.' + ext;
}

const STAGE_COLUMNS = ['Fulltext', 'Expert_Decision', 'Coded', 'Assertions', 'Assignee'];

function exportFilteredPapers() {
    const papers = korpusResult;
    const headers = ['ID', 'Work_ID', 'Title', 'Author_Year', 'Year', 'Item_Type', 'DOI', 'URL']
        .concat(STAGE_COLUMNS, ['LLM_Decision', 'LLM_Categories', 'Agreement']);
    const rows = papers.map(function(p) {
        const stage = window.EC.korpusStages.csvFields(p);
        return [p.id, p.work_id, p.title, p.author_year, p.year, p.item_type, p.doi, p.url]
            .concat(STAGE_COLUMNS.map(function(key) { return stage[key]; }),
                [p.llm.decision, p.llm.categories.join(';'), p.benchmark.agreement === null ? '' : p.benchmark.agreement]);
    });
    const csv = [headers].concat(rows).map(function(r) {
        return r.map(function(v) { return '"' + String(v == null || v === 'nan' ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    download(exportName('csv'), csv, 'text/csv;charset=utf-8;');
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

// The whole corpus downloads the prebuilt archive; a selection is packed here from the
// same knowledge documents, with the record index restricted to it.
function downloadVaultZip() {
    if (korpusResult.length === allPapers.length) {
        download('FemPrompt_Paper_Wissenssammlung.zip', 'downloads/vault.zip');
        return;
    }
    const withDocs = korpusResult.filter(function(p) { return p.knowledge_doc; });
    if (withDocs.length === 0) {
        alert('Keine Wissensdokumente für die aktuelle Auswahl verfügbar.');
        return;
    }
    const docs = {};
    withDocs.forEach(function(p) { docs[p.knowledge_doc] = true; });
    Promise.all(Object.keys(docs).map(function(path) {
        return fetch(path).then(function(response) {
            if (!response.ok) throw new Error(path + ': HTTP ' + response.status);
            return response.arrayBuffer();
        }).then(function(body) { return { name: 'Papers/' + path.split('/').pop(), body: new Uint8Array(body) }; });
    })).then(function(files) {
        const index = withDocs.map(function(p) {
            return { record_id: p.id, work_id: p.work_id, version_id: p.version_id, knowledge_doc: 'Papers/' + p.knowledge_doc.split('/').pop() };
        });
        const encoder = new TextEncoder();
        files.push({ name: 'record-index.json', body: encoder.encode(JSON.stringify(index, null, 2) + '\n') });
        download(exportName('zip'), zipStored(files));
    }).catch(function(error) {
        console.error('[Vault export]', error);
        alert('Das Archiv der Auswahl konnte nicht vollständig erstellt werden.');
    });
}

// A ZIP archive without compression; a few lines spare a vendored library for text files.
let crcTable = null;
function crc32(bytes) {
    if (!crcTable) {
        crcTable = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            crcTable[n] = c >>> 0;
        }
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function zipStored(files) {
    const encoder = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    files.forEach(function(file) {
        const name = encoder.encode(file.name);
        const crc = crc32(file.body);
        const local = new DataView(new ArrayBuffer(30));
        // Signature, version 2.0, UTF-8 name flag, stored, DOS date 1980-01-01 as the prebuilt archive.
        local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true);
        local.setUint16(12, 0x21, true); local.setUint32(14, crc, true);
        local.setUint32(18, file.body.length, true); local.setUint32(22, file.body.length, true);
        local.setUint16(26, name.length, true);
        const entry = new DataView(new ArrayBuffer(46));
        entry.setUint32(0, 0x02014b50, true); entry.setUint16(4, 20, true); entry.setUint16(6, 20, true);
        entry.setUint16(8, 0x0800, true); entry.setUint16(14, 0x21, true); entry.setUint32(16, crc, true);
        entry.setUint32(20, file.body.length, true); entry.setUint32(24, file.body.length, true);
        entry.setUint16(28, name.length, true); entry.setUint32(42, offset, true);
        parts.push(local, name, file.body);
        central.push(entry, name);
        offset += 30 + name.length + file.body.length;
    });
    const size = central.reduce(function(sum, part) { return sum + part.byteLength; }, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, size, true); end.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [end]), { type: 'application/zip' });
}

function exportFilteredMarkdown() {
    const withDocs = korpusResult.filter(function(p) { return p.knowledge_doc; });

    if (withDocs.length === 0) {
        alert('Keine Wissensdokumente fuer die aktuelle Auswahl verfuegbar.');
        return;
    }

    Promise.all(withDocs.map(function(paper) {
        return fetch(paper.knowledge_doc).then(function(response) {
            if (!response.ok) throw new Error(paper.id + ': HTTP ' + response.status);
            return response.text();
        }).then(function(text) {
            return '# ' + paper.title + '\n\n' +
                '**Record:** ' + paper.id + '  \n' +
                '**Werk:** ' + paper.work_id + '\n\n' + text.trim();
        });
    })).then(function(documents) {
        const header = '# Forschungskorpus-Auswahl\n\n' +
            withDocs.length + ' Wissensdokumente aus dem Evidence Companion.\n\n';
        const body = header + documents.join('\n\n---\n\n') + '\n';
        download(
            exportName('md'),
            body,
            'text/markdown;charset=utf-8;'
        );
    }).catch(function(error) {
        console.error('[Markdown export]', error);
        alert('Der Markdown-Export konnte nicht vollständig erstellt werden.');
    });
}

})();
