// PRISMA Screening Tool (PRISM) -- standalone evidence-grounded screening instrument.
// The screening view is built around reading and searching the knowledge document and
// pinning found passages as Belege (evidence) on categories. AI is reduced to an optional
// collapsed suggestion; human and AI assessment are brought together, not scored against
// each other -- the human-AI comparison surface (matrix, kappa, divergence) was removed
// (knowledge/specification.md ADR-014). Cohen kappa and the confusion matrix are still
// computed for the AI-disclosure line only (PRISMA-trAIce M9/R2).
//
// Three surfaces: Screening | PRISMA & Report | Daten & Repo.
// Human decision is binding (RAISE); the AI proposal is advisory and stored separately
// so the flow diagram splits AI from human decisions (PRISMA-trAIce R1).
// Persistence: File System Access writes one JSON per reviewer (schema 0.2, with an
// evidence map) into docs/data/screening/<reviewer>.json; versioning happens outside the
// tool (GitHub Desktop), export/import fallback. Runs on prisma.html via the window.EC
// shim from prisma-data.js.
// See knowledge/design.md, knowledge/data.md, knowledge/specification.md.

(function() {
'use strict';

var EC = window.EC;
var initialized = false;
var FS_SUPPORTED = typeof window.showDirectoryPicker === 'function';

// ============================================================
// Constants
// ============================================================

var TECH_CATS = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige'];
var SOCIAL_CATS = ['Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];
var ALL_CATS = TECH_CATS.concat(SOCIAL_CATS);

var CAT_LABELS = {
    'AI_Literacies': 'AI Literacies', 'Generative_KI': 'Generative KI',
    'Prompting': 'Prompting', 'KI_Sonstige': 'KI Sonstige',
    'Soziale_Arbeit': 'Soziale Arbeit', 'Bias_Ungleichheit': 'Bias & Ungleichheit',
    'Gender': 'Gender', 'Diversitaet': 'Diversität',
    'Feministisch': 'Feministisch', 'Fairness': 'Fairness'
};

// Category definitions (hover tooltips on the chips), ported from the design seed.
var CAT_DEFS = {
    'AI_Literacies': 'Kompetenzen, um KI-Systeme zu verstehen, zu nutzen und kritisch zu reflektieren.',
    'Generative_KI': 'Generative KI / LLMs, die Text, Bild oder Code erzeugen (ChatGPT, Claude, Gemini).',
    'Prompting': 'Gestaltung, Engineering oder Untersuchung von Prompts als Schnittstelle zu generativen Modellen.',
    'KI_Sonstige': 'Andere KI/ML-Verfahren: Klassifikatoren, Empfehlungssysteme, Computer Vision.',
    'Soziale_Arbeit': 'Soziale Arbeit als Profession, Praxis, Ausbildung oder Institution.',
    'Bias_Ungleichheit': 'Bias, Ungleichheit oder Diskriminierung, durch soziotechnische Systeme erzeugt oder verstaerkt.',
    'Gender': 'Gender als analytische Kategorie: geschlechtsbezogene Effekte, Repraesentation, Identitaet.',
    'Diversitaet': 'Diversitaet jenseits von Gender: Race, Klasse, Behinderung, Migration.',
    'Feministisch': 'Explizit feministische Theorie, Epistemologie oder Methodologie.',
    'Fairness': 'Fairness, Gerechtigkeit oder Equity als normatives Kriterium fuer Systeme.'
};

var EXCLUSION_REASONS = ['Duplicate', 'Not_relevant_topic', 'Wrong_publication_type', 'No_full_text', 'Language'];

var MODEL_DEFAULT = {
    name: 'Claude Haiku 4.5', id: 'claude-haiku-4-5', date: '2026-03-15',
    prompt: 'v2.1', temperature: '0.0', maxTokens: '1024', threshold: '0.5'
};

// PRISMA-trAIce 14 items (Holst et al. 2025, JMIR AI; abridged verbatim).
var TRAICE = [
    { id: 'T1', sec: 'Title', lvl: 'optional', auto: false, text: 'Indicate AI assistance in the title/subtitle if AI played a substantial role (e.g. primary screening, data extraction).' },
    { id: 'A1', sec: 'Abstract', lvl: 'optional', auto: false, text: 'Summarise the AI tool(s) used, the SLR stage(s) applied, and their primary role.' },
    { id: 'I1', sec: 'Introduction', lvl: 'recommended', auto: false, text: 'State the rationale for using AI tools for specific tasks (volume, efficiency, novel methods).' },
    { id: 'M1', sec: 'Methods', lvl: 'mandatory', auto: false, text: 'State whether AI use was pre-specified in the protocol and where it can be accessed; report deviations.' },
    { id: 'M2', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'For each tool: name, version, developer/provider; how to access; for custom tools, how to replicate.' },
    { id: 'M3', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'The specific SLR stage(s) and the precise task(s) the AI performed at each stage.' },
    { id: 'M4', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Input data provided to the tool (search results, abstracts, full texts; training/calibration data).' },
    { id: 'M5', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Output data: format (e.g. structured JSON, labels with confidence) and any automated post-processing.' },
    { id: 'M6', sec: 'Methods', lvl: 'mandatory', auto: false, text: 'Prompt engineering: full prompts, key parameters (temperature, max tokens, top-p), iterative refinement.' },
    { id: 'M7', sec: 'Methods', lvl: 'highly recommended', auto: false, text: 'For non-LLM tools: algorithms/models; settings (e.g. classification thresholds, active-learning parameters).' },
    { id: 'M8', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Human-AI interaction and oversight: reviewers validating AI outputs, independence, proportion verified, discrepancy resolution.' },
    { id: 'M9', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Methods to evaluate AI performance: reference standard (consensus human decisions); metrics (accuracy, kappa); bias analyses.' },
    { id: 'M10', sec: 'Methods', lvl: 'recommended', auto: true, text: 'Data governance: how input/output/intermediate data was managed and stored; privacy, copyright/ToS compliance.' },
    { id: 'R1', sec: 'Results', lvl: 'mandatory', auto: true, text: 'Flow diagram and text distinguish records included/excluded by AI vs human at each screening stage; report numbers processed by AI.' },
    { id: 'R2', sec: 'Results', lvl: 'mandatory', auto: true, text: 'Report AI performance evaluation results (from M9): quantitative results and AI-human agreement.' },
    { id: 'D1', sec: 'Discussion', lvl: 'recommended', auto: false, text: 'Limitations of AI use (technical issues, biases, hallucinations) and how they may have influenced the review.' },
    { id: 'D2', sec: 'Discussion', lvl: 'optional', auto: false, text: 'The experience of using AI: benefits, challenges, usability, implications for future reviews.' }
];

var LS_KEY = 'femprompt-prisma-state/0.2';
var REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.2'; // bumped for the evidence map (FR-13)
var SEED = 'seed'; // built-in reviewer = the existing expert assessment (paper.human)

var SURFACES = [
    { id: 'screening', label: 'Screening', intro: 'Volltext lesen und durchsuchen, Belege an Kategorien anheften, Include/Exclude entscheiden.' },
    { id: 'report', label: 'PRISMA & Report', intro: 'PRISMA-2020-Fluss, Checkliste und Disclosure, aus dem Screening erzeugt.' },
    { id: 'data', label: 'Daten & Repo', intro: 'Mit dem Projektordner verbinden, eine Datei pro Reviewer:in, Export und Import.' }
];

// ============================================================
// State
// ============================================================

var state = {
    surface: 'screening',
    reviewer: 'reviewer1', // who is editing; drives the per-reviewer file name
    perspective: SEED,     // whose decisions drive Flow/Agreement (default: seed = benchmark)
    index: 0,
    reviewers: {},         // reviewerKey -> { paperId -> decision }
    checklist: {},
    disclosure: {}
};

var papers = [];
var dirHandle = null;          // connected File System Access directory handle
var corpusIndex = null;        // id -> { t, ay, kd, src, n, x } for corpus full-text search
var corpusIndexPromise = null;
var corpusQuery = '';          // current corpus-wide search (left pane)
var textCache = {};            // paperId -> raw knowledge-doc markdown (or null)
var docHtmlCurrent = '';       // rendered HTML of the open document (for re-highlight)
var docMarks = [], docMarkIdx = 0;
var pendingInText = null;      // in-text query to apply once the document has loaded
var pinTerm = '', pinSnippet = '';

// the in-progress (pre-commit) decision for the open paper
var work = { pid: null, cats: {}, override: false, reason: null, evidence: {} };

function curDec() {
    if (!state.reviewers[state.reviewer]) state.reviewers[state.reviewer] = {};
    return state.reviewers[state.reviewer];
}

function resetWork(p) { work = { pid: p.id, cats: {}, override: false, reason: null, evidence: {} }; }

// ============================================================
// Persistence: localStorage cache + File System Access (repo files)
// ============================================================

function serializeAll() {
    return {
        schema: LS_KEY,
        config: { reviewer: state.reviewer, perspective: state.perspective, disclosure: state.disclosure },
        reviewers: state.reviewers,
        checklist: state.checklist
    };
}

function saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(serializeAll())); }
    catch (e) { console.warn('[PRISMA] local save failed:', e.message); }
}

function loadLocal() {
    try {
        var raw = localStorage.getItem(LS_KEY);
        if (!raw) return;
        var o = JSON.parse(raw);
        if (o.config) {
            if (o.config.reviewer) state.reviewer = o.config.reviewer;
            if (o.config.perspective) state.perspective = o.config.perspective;
            if (o.config.disclosure) state.disclosure = o.config.disclosure;
        }
        state.reviewers = o.reviewers || {};
        state.checklist = o.checklist || {};
    } catch (e) { console.warn('[PRISMA] local load failed:', e.message); }
}

var writeChain = Promise.resolve();
function save() {
    saveLocal();
    // serialize repo writes so rapid screening cannot overlap createWritable on the same file
    if (dirHandle) writeChain = writeChain.then(writeCurrentReviewer).catch(function(e) { console.warn('[PRISMA] repo write failed:', e); });
}

function reviewerPayload(key) {
    return { schema: REVIEWER_SCHEMA, reviewer: key,
             updated: new Date().toISOString(), decisions: state.reviewers[key] || {} };
}

// --- IndexedDB: persist the directory handle so reconnect is one click ---
function idb() {
    return new Promise(function(res, rej) {
        var r = indexedDB.open('femprompt-prisma', 1);
        r.onupgradeneeded = function() { r.result.createObjectStore('handles'); };
        r.onsuccess = function() { res(r.result); };
        r.onerror = function() { rej(r.error); };
    });
}
function idbSet(k, v) {
    return idb().then(function(db) { return new Promise(function(res, rej) {
        var t = db.transaction('handles', 'readwrite'); t.objectStore('handles').put(v, k);
        t.oncomplete = function() { res(); }; t.onerror = function() { rej(t.error); };
    }); });
}
function idbGet(k) {
    return idb().then(function(db) { return new Promise(function(res, rej) {
        var t = db.transaction('handles', 'readonly'); var rq = t.objectStore('handles').get(k);
        rq.onsuccess = function() { res(rq.result); }; rq.onerror = function() { rej(rq.error); };
    }); });
}

async function connectRepo() {
    if (!FS_SUPPORTED) { alert('Dieser Browser schreibt nicht direkt auf die Platte. Nutze Export/Import (Firefox/Safari).'); return; }
    try {
        var handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        dirHandle = handle;
        await idbSet('dir', handle);
        await loadAllReviewers();
        updateConnStatus();
        showSurface(state.surface);
    } catch (e) { if (e.name !== 'AbortError') console.warn('[PRISMA] connect failed:', e); }
}

async function reconnectRepo() {
    if (!FS_SUPPORTED) return;
    try {
        var handle = await idbGet('dir');
        if (!handle) { alert('Kein gespeicherter Ordner. Erst "Mit Repo-Ordner verbinden".'); return; }
        var perm = await handle.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') { alert('Schreibrecht nicht erteilt.'); return; }
        dirHandle = handle;
        await loadAllReviewers();
        updateConnStatus();
        showSurface(state.surface);
    } catch (e) { console.warn('[PRISMA] reconnect failed:', e); }
}

async function loadAllReviewers() {
    if (!dirHandle) return;
    var found = {};
    for await (var entry of dirHandle.values()) {
        if (entry.kind === 'file' && /\.json$/.test(entry.name)) {
            try {
                var f = await entry.getFile();
                var obj = JSON.parse(await f.text());
                var key = obj.reviewer || entry.name.replace(/\.json$/, '');
                found[key] = obj.decisions || {}; // 0.1 records simply lack `evidence`
            } catch (e) { console.warn('[PRISMA] could not read', entry.name, e); }
        }
    }
    // merge file state over local (files are the committed source of truth)
    Object.keys(found).forEach(function(k) { state.reviewers[k] = found[k]; });
    saveLocal();
}

async function writeCurrentReviewer() {
    if (!dirHandle) return false;
    var fh = await dirHandle.getFileHandle(state.reviewer + '.json', { create: true });
    var w = await fh.createWritable();
    await w.write(JSON.stringify(reviewerPayload(state.reviewer), null, 2));
    await w.close();
    return true;
}

function updateConnStatus() {
    var el = document.getElementById('pt-conn-status');
    if (!el) return;
    if (dirHandle) { el.textContent = 'verbunden, schreibt ' + state.reviewer + '.json'; el.classList.add('connected'); }
    else { el.textContent = FS_SUPPORTED ? 'nicht mit Repo verbunden' : 'Browser ohne Direktschreiben (Export nutzen)'; el.classList.remove('connected'); }
}

// ============================================================
// Corpus full-text index (FR-12 corpus search) + document fetch (FR-11)
// ============================================================

function loadCorpusIndex() {
    if (corpusIndexPromise) return corpusIndexPromise;
    corpusIndexPromise = fetch('data/fulltext_index.json')
        .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(d) { corpusIndex = d.papers || {}; return corpusIndex; })
        .catch(function(e) { console.warn('[PRISMA] corpus index load failed:', e.message); corpusIndex = {}; return corpusIndex; });
    return corpusIndexPromise;
}

// Fetch the served knowledge document for a paper (FR-11). Single pluggable seam:
// swapping in raw local full text (copyright-gated) only changes this function.
function fetchPaperText(p) {
    if (!p.knowledge_doc) return Promise.resolve(null);
    if (textCache[p.id] !== undefined) return Promise.resolve(textCache[p.id]);
    return fetch(encodeURI(p.knowledge_doc))
        .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(function(t) { textCache[p.id] = t; return t; })
        .catch(function() { textCache[p.id] = null; return null; });
}

function countOcc(hay, needle) {
    if (!needle) return 0;
    var n = 0, pos = 0, idx;
    while ((idx = hay.indexOf(needle, pos)) !== -1) { n++; pos = idx + needle.length; }
    return n;
}

// ---- minimal Markdown renderer (no dependency, NFR-01/architecture rule) ----
function stripFrontmatter(md) { return md.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, ''); }

function inlineMd(s) {
    s = EC.escapeHtml(s);
    s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
}

function renderMarkdown(md) {
    md = stripFrontmatter(md);
    var lines = md.split(/\r?\n/);
    var out = [], i = 0, inList = false;
    function closeList() { if (inList) { out.push('</ul>'); inList = false; } }
    while (i < lines.length) {
        var ln = lines[i];
        if (/^---\s*$/.test(ln)) {
            // skip an embedded yaml block (the note repeats a frontmatter inside "## Full Text")
            var k = i + 1;
            while (k < lines.length && !/^---\s*$/.test(lines[k])) k++;
            if (k < lines.length && k > i + 1) {
                var block = lines.slice(i + 1, k);
                var yamlish = block.every(function(b) {
                    return b.trim() === '' || /^[A-Za-z_][\w "'().\/:-]*:/.test(b) || /^-\s/.test(b);
                });
                if (yamlish) { i = k + 1; continue; }
            }
            closeList(); out.push('<hr class="pt-doc-hr">'); i++; continue;
        }
        if (/^\s*$/.test(ln)) { closeList(); i++; continue; }
        var hm = ln.match(/^(#{1,6})\s+(.*)$/);
        if (hm) { closeList(); var lvl = Math.min(hm[1].length, 4); out.push('<h' + lvl + ' class="pt-doc-h' + lvl + '">' + inlineMd(hm[2]) + '</h' + lvl + '>'); i++; continue; }
        var lm = ln.match(/^\s*[-*]\s+(.*)$/);
        if (lm) { if (!inList) { out.push('<ul class="pt-doc-ul">'); inList = true; } out.push('<li>' + inlineMd(lm[1]) + '</li>'); i++; continue; }
        var bm = ln.match(/^>\s?(.*)$/);
        if (bm) { closeList(); out.push('<blockquote class="pt-doc-q">' + inlineMd(bm[1]) + '</blockquote>'); i++; continue; }
        closeList();
        var para = [ln]; i++;
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
               !/^\s*[-*]\s/.test(lines[i]) && !/^---\s*$/.test(lines[i]) && !/^>\s?/.test(lines[i])) { para.push(lines[i]); i++; }
        out.push('<p class="pt-doc-p">' + inlineMd(para.join(' ')) + '</p>');
    }
    closeList();
    return out.join('');
}

// ============================================================
// Init
// ============================================================

window.initializePrisma = function() {
    if (initialized) return;
    initialized = true;
    EC = window.EC;
    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    loadLocal();
    normalizeSurface();
    loadCorpusIndex(); // background: ready by the time the user runs a corpus search
    renderShell();
    showSurface(state.surface || 'screening');
    updateConnStatus();
    console.log('[PRISMA] initialized, ' + papers.length + ' papers, FS ' + (FS_SUPPORTED ? 'supported' : 'fallback'));
};

// map any persisted v3 surface id onto the three v4 surfaces
function normalizeSurface() {
    var map = { workspace: 'screening', flow: 'report', agreement: 'report', reviewers: 'data', checklist: 'report', report: 'report', data: 'data' };
    if (map[state.surface]) state.surface = map[state.surface];
    if (['screening', 'report', 'data'].indexOf(state.surface) === -1) state.surface = 'screening';
}

// ============================================================
// Shell + sub-navigation
// ============================================================

function renderShell() {
    var root = document.getElementById('prisma-root');
    if (!root) return;
    var html = '<div class="pt-subnav">';
    SURFACES.forEach(function(s) {
        html += '<button class="pt-subnav-btn' + (s.id === state.surface ? ' active' : '') +
            '" data-surface="' + s.id + '">' + s.label + '</button>';
    });
    html += '</div>';
    html += '<div class="pt-surface-intro" id="pt-surface-intro"></div>';
    html += '<div class="pt-surface" id="pt-surface"></div>';
    root.innerHTML = html;
    root.querySelectorAll('.pt-subnav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { showSurface(btn.dataset.surface); });
    });
}

function showSurface(name) {
    state.surface = name; saveLocal();
    document.querySelectorAll('.pt-subnav-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.surface === name); });
    var intro = document.getElementById('pt-surface-intro');
    var meta = SURFACES.filter(function(s) { return s.id === name; })[0];
    if (intro && meta) intro.textContent = meta.intro;
    var fn = { screening: renderScreening, report: renderReportSurface, data: renderData }[name];
    if (fn) fn();
}

function surfaceEl() { return document.getElementById('pt-surface'); }

// ============================================================
// Decision helpers
// ============================================================

function aiProposal(paper) {
    if (!paper || !paper.llm || !paper.llm.decision) return null;
    return { decision: paper.llm.decision, categories: paper.llm.all_categories || {}, reasoning: paper.llm.reasoning || '' };
}

function humanDecision(paper, persp) {
    persp = persp || state.perspective;
    if (persp === SEED) {
        if (paper.human && paper.human.decision)
            return { decision: paper.human.decision, categories: paper.human.all_categories || {}, source: SEED };
        return null;
    }
    var d = state.reviewers[persp] && state.reviewers[persp][paper.id];
    return d ? { decision: d.decision, categories: d.categories || {}, reason: d.reason, source: persp } : null;
}

function seedDecision(paper) {
    if (paper.human && paper.human.decision)
        return { decision: paper.human.decision, categories: paper.human.all_categories || {} };
    return null;
}

function deriveDecision(cats) {
    var tech = TECH_CATS.some(function(c) { return cats[c]; });
    var soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    return (tech && soc) ? 'Include' : 'Exclude';
}

function finalDecisionOf(cats, override) {
    if (deriveDecision(cats) === 'Exclude') return 'Exclude';
    return override ? 'Exclude' : 'Include';
}

function divergent(h, a) { return h && a && h.decision !== a.decision; }

function abstractQuality(p) {
    var a = (p.abstract || '').trim();
    if (!a) return { ok: false, note: 'Kein Abstract vorhanden, bitte Volltext (Wissensdokument) oder Quelle pruefen.' };
    if (/National Bureau of Economic Research|Founded in 1920, the NBER|private, non-profit, non-partisan organization/i.test(a))
        return { ok: false, note: 'Wirkt wie Verlags-Boilerplate (NBER), nicht das Paper-Abstract.' };
    if (a.length < 120) return { ok: false, note: 'Sehr kurzes Abstract, evtl. unvollstaendig.' };
    return { ok: true };
}

function evidenceCount(rec) {
    if (!rec || !rec.evidence) return 0;
    return ALL_CATS.reduce(function(s, c) { return s + ((rec.evidence[c] || []).length); }, 0);
}

// ============================================================
// Aggregation (computed quietly for the report layer)
// ============================================================

function computeMatrix(persp) {
    var m = { II: 0, IE: 0, EI: 0, EE: 0, n: 0 };
    papers.forEach(function(p) {
        var h = humanDecision(p, persp), a = aiProposal(p);
        if (!h || !a) return;
        m.n++;
        if (h.decision === 'Include' && a.decision === 'Include') m.II++;
        else if (h.decision === 'Include' && a.decision === 'Exclude') m.IE++;
        else if (h.decision === 'Exclude' && a.decision === 'Include') m.EI++;
        else m.EE++;
    });
    return m;
}

function cohenKappa(m) {
    var n = m.n; if (!n) return 0;
    var po = (m.II + m.EE) / n;
    var ph = (m.II + m.IE) / n, pa = (m.II + m.EI) / n;
    var pe = ph * pa + (1 - ph) * (1 - pa);
    return pe === 1 ? 1 : (po - pe) / (1 - pe);
}

function kappaLabel(k) {
    if (k < 0) return 'poor'; if (k <= 0.20) return 'slight'; if (k <= 0.40) return 'fair';
    if (k <= 0.60) return 'moderate'; if (k <= 0.80) return 'substantial'; return 'almost perfect';
}

function computeFlow(persp) {
    var f = { total: papers.length, aiScreened: 0, aiIncl: 0, aiExcl: 0,
              humanScreened: 0, humanIncl: 0, humanExcl: 0, humanReasons: {} };
    papers.forEach(function(p) {
        var a = aiProposal(p), h = humanDecision(p, persp);
        if (a) { f.aiScreened++; if (a.decision === 'Include') f.aiIncl++; else f.aiExcl++; }
        if (h) {
            f.humanScreened++;
            if (h.decision === 'Include') f.humanIncl++; else f.humanExcl++;
            if (h.decision === 'Exclude' && h.reason) f.humanReasons[h.reason] = (f.humanReasons[h.reason] || 0) + 1;
        }
    });
    return f;
}

function reviewerKeys() {
    var keys = [SEED];
    Object.keys(state.reviewers).forEach(function(k) {
        if (Object.keys(state.reviewers[k] || {}).length) keys.push(k);
    });
    return keys;
}

function reviewerLabel(k) { return k === SEED ? 'Seed (Expert:innen)' : k; }

function perspectiveBar() {
    var keys = reviewerKeys();
    var html = '<div class="pt-persp">Perspektive Mensch: <select class="pt-persp-sel">';
    keys.forEach(function(k) {
        html += '<option value="' + k + '"' + (k === state.perspective ? ' selected' : '') + '>' + EC.escapeHtml(reviewerLabel(k)) + '</option>';
    });
    html += '</select></div>';
    return html;
}

function attachPerspective(el, rerender) {
    var sel = el.querySelector('.pt-persp-sel');
    if (sel) sel.addEventListener('change', function() { state.perspective = sel.value; saveLocal(); rerender(); });
}

// ============================================================
// Surface: Screening (read + search + pin evidence)
// ============================================================

function renderScreening() {
    var el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper geladen.</p>'; return; }
    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;

    var p = papers[state.index];
    var dec = curDec()[p.id];
    if (!dec && work.pid !== p.id) resetWork(p);

    var screened = Object.keys(curDec()).length;
    var pct = papers.length ? Math.round(screened / papers.length * 100) : 0;

    var html = '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos">Paper ' + (state.index + 1) + ' / ' + papers.length + '</span>';
    html += '<span class="pt-ws-progressbar"><span class="pt-ws-progressfill" style="width:' + pct + '%"></span></span>';
    html += '<span class="pt-ws-prog mono">' + screened + ' / ' + papers.length + ' &middot; ' + EC.escapeHtml(state.reviewer) + '</span>';
    html += '</div>';

    html += '<div class="pt-ws pt-ws-screen">';
    html += corpusHtml();
    html += readingShellHtml(p, dec);
    html += '<aside class="pt-rail" id="pt-assess-col">' + assessInnerHtml(p, dec) + '</aside>';
    html += '<div class="pt-pinmenu" id="pt-pinmenu" hidden></div>';
    html += '</div>';

    el.innerHTML = html;
    attachScreening(p, dec);
    loadReadingInto(p);
}

// ---- left: corpus navigator with full-text search ----
function corpusHtml() {
    var d = curDec();
    var h = '<aside class="pt-nav"><div class="pt-nav-head"><span class="pt-nav-title-main">Korpus</span>' +
        '<span class="pt-tag-mono">' + Object.keys(d).length + ' / ' + papers.length + '</span></div>';
    h += '<div class="pt-corpus-search"><input id="pt-corpus-q" placeholder="Volltext-Suche ueber alle Paper" value="' + EC.escapeHtml(corpusQuery) + '">' +
        '<span class="pt-corpus-hint" id="pt-corpus-hint"></span></div>';
    h += '<div class="pt-nav-list" id="pt-corpus-list">' + corpusListHtml() + '</div></aside>';
    return h;
}

function corpusListHtml() {
    var d = curDec();
    var q = corpusQuery.trim().toLowerCase();
    var rows = papers, match = null;
    if (q) {
        if (!corpusIndex) return '<p class="pt-muted pt-corpus-empty">Such-Index laedt…</p>';
        match = {};
        rows = papers.filter(function(p) {
            var e = corpusIndex[p.id]; if (!e || !e.x) return false;
            var c = countOcc(e.x, q); if (c) { match[p.id] = c; return true; } return false;
        });
        if (!rows.length) return '<p class="pt-muted pt-corpus-empty">Keine Treffer fuer &bdquo;' + EC.escapeHtml(corpusQuery) + '&ldquo;.</p>';
    }
    return rows.map(function(p) {
        var i = papers.indexOf(p);
        var rec = d[p.id];
        var st = rec ? rec.decision.toLowerCase() : 'none';
        var badge = match ? '<span class="pt-hit-badge mono">' + match[p.id] + '</span>' : '';
        return '<button class="pt-nav-item' + (i === state.index ? ' active' : '') + '" data-i="' + i + '">' +
            '<span class="pt-nav-dot pt-dot-' + st + '"></span>' +
            '<span class="pt-nav-text"><span class="pt-nav-t">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</span>' +
            '<span class="pt-nav-m mono">' + EC.escapeHtml(p.author_year || p.id) + '</span></span>' + badge + '</button>';
    }).join('');
}

function refreshCorpusList() {
    var list = document.getElementById('pt-corpus-list');
    if (list) { list.innerHTML = corpusListHtml(); bindCorpusItems(); }
    var hint = document.getElementById('pt-corpus-hint');
    if (hint) {
        var q = corpusQuery.trim();
        if (!q) hint.textContent = '';
        else if (!corpusIndex) hint.textContent = '';
        else hint.textContent = papers.filter(function(p) { var e = corpusIndex[p.id]; return e && e.x && e.x.indexOf(q.toLowerCase()) !== -1; }).length + ' Paper';
    }
}

function bindCorpusItems() {
    var list = document.getElementById('pt-corpus-list'); if (!list) return;
    list.querySelectorAll('.pt-nav-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.index = parseInt(btn.dataset.i, 10);
            if (corpusQuery.trim()) pendingInText = corpusQuery.trim(); // carry the term into the open paper
            renderScreening();
        });
    });
}

// ---- center: reading column (full text + in-text search) ----
function readingShellHtml(p, dec) {
    var aq = abstractQuality(p);
    var h = '<div class="pt-read pt-read-screen"><div class="pt-read-inner">';
    h += '<div class="pt-read-meta">';
    h += '<span class="pt-pill pt-pill-ghost mono">' + EC.escapeHtml(p.id) + '</span>';
    if (p.item_type) h += '<span class="pt-tag-mono">' + EC.escapeHtml(p.item_type) + '</span>';
    if (p.knowledge_doc) h += '<span class="pt-pill pt-pill-ghost">Wissensdokument</span>';
    else h += '<span class="pt-pill pt-pill-warn">nur Abstract</span>';
    if (dec) h += '<span class="pt-pill pt-pill-human pt-pill-right">erfasst</span>';
    h += '</div>';
    h += '<h1 class="pt-paper-title">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h1>';
    h += '<div class="pt-paper-authors">' + EC.escapeHtml(p.author_year || p.authors || '') +
        (p.journal ? ' &middot; <span class="pt-muted">' + EC.escapeHtml(p.journal) + '</span>' : '') + '</div>';
    if (!aq.ok && !p.knowledge_doc) h += '<div class="pt-aq-warn">Achtung: ' + EC.escapeHtml(aq.note) + '</div>';

    h += '<div class="pt-intext-bar">' +
        '<input id="pt-intext" placeholder="Im Text suchen (Enter = naechster Treffer)">' +
        '<span class="pt-tag-mono" id="pt-intext-count"></span>' +
        '<button class="pt-intext-nav" id="pt-intext-prev" title="vorheriger Treffer">&lsaquo;</button>' +
        '<button class="pt-intext-nav" id="pt-intext-next" title="naechster Treffer">&rsaquo;</button>' +
        '<button class="pt-btn pt-pin-hit" id="pt-pin-hit" disabled title="Aktuellen Treffer als Beleg anheften">Treffer anheften</button>' +
        '</div>';
    h += '<p class="pt-read-help">Text markieren und als Beleg an eine Kategorie anheften, oder einen Treffer der Suche anheften.</p>';
    h += '<div class="pt-doc" id="pt-doc"><p class="pt-muted">Volltext laedt…</p></div>';
    h += '</div></div>';
    return h;
}

function loadReadingInto(p) {
    var doc = document.getElementById('pt-doc'); if (!doc) return;
    fetchPaperText(p).then(function(md) {
        if (md) docHtmlCurrent = renderMarkdown(md);
        else if (p.abstract && p.abstract.trim()) docHtmlCurrent = '<p class="pt-doc-p">' + inlineMd(p.abstract) + '</p>';
        else docHtmlCurrent = '';
        var d2 = document.getElementById('pt-doc');
        if (!d2) return;
        d2.innerHTML = docHtmlCurrent || '<p class="pt-muted">Kein Volltext und kein Abstract vorhanden. Quelle pruefen.</p>';
        docMarks = []; docMarkIdx = 0;
        if (pendingInText) {
            var box = document.getElementById('pt-intext');
            if (box) box.value = pendingInText;
            applyInText(pendingInText);
            pendingInText = null;
        }
    });
}

function applyInText(q) {
    var doc = document.getElementById('pt-doc'); if (!doc) return;
    doc.innerHTML = docHtmlCurrent || '<p class="pt-muted">Kein Text.</p>';
    docMarks = []; docMarkIdx = 0;
    var cnt = document.getElementById('pt-intext-count');
    var pinBtn = document.getElementById('pt-pin-hit');
    q = (q || '').trim();
    if (q.length < 2) { if (cnt) cnt.textContent = ''; if (pinBtn) pinBtn.disabled = true; return; }
    var ql = q.toLowerCase();
    var walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function(node) {
        var text = node.nodeValue, lower = text.toLowerCase();
        if (lower.indexOf(ql) === -1) return;
        var frag = document.createDocumentFragment(), pos = 0, idx;
        while ((idx = lower.indexOf(ql, pos)) !== -1) {
            if (idx > pos) frag.appendChild(document.createTextNode(text.slice(pos, idx)));
            var mk = document.createElement('mark'); mk.className = 'pt-hit'; mk.textContent = text.slice(idx, idx + ql.length);
            frag.appendChild(mk); docMarks.push(mk); pos = idx + ql.length;
        }
        if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
        node.parentNode.replaceChild(frag, node);
    });
    if (pinBtn) pinBtn.disabled = docMarks.length === 0;
    if (docMarks.length) setActiveMark(0);
    else if (cnt) cnt.textContent = '0 Treffer';
}

function setActiveMark(i) {
    if (!docMarks.length) return;
    docMarks.forEach(function(m) { m.classList.remove('active'); });
    docMarkIdx = (i + docMarks.length) % docMarks.length;
    var m = docMarks[docMarkIdx];
    m.classList.add('active');
    if (typeof m.scrollIntoView === 'function') m.scrollIntoView({ block: 'center' });
    var cnt = document.getElementById('pt-intext-count');
    if (cnt) cnt.textContent = (docMarkIdx + 1) + '/' + docMarks.length;
}

function snippetAround(el, term) {
    var ctx = el && el.parentNode ? (el.parentNode.textContent || '') : term;
    var i = ctx.toLowerCase().indexOf(term.toLowerCase());
    if (i === -1) return term;
    var start = Math.max(0, i - 90), end = Math.min(ctx.length, i + term.length + 90);
    return (start > 0 ? '…' : '') + ctx.slice(start, end).trim() + (end < ctx.length ? '…' : '');
}

// ---- evidence pinning (FR-13) ----
// Each Beleg records its provenance (origin: 'human' or 'ai') so human and AI
// evidence stay distinguishable when brought together, neutrally, without
// valuation (KI-Kennzeichnung). A reviewer pin is always human; machine or AI
// Belege carry origin 'ai' wherever they are constructed.
function pinEvidence(cat, term, snippet) {
    term = (term || '').trim().slice(0, 80);
    snippet = (snippet || term).trim().slice(0, 260);
    if (!term) return;
    if (!work.evidence[cat]) work.evidence[cat] = [];
    work.evidence[cat].push({ term: term, snippet: snippet, ts: new Date().toISOString(), origin: 'human' });
    work.cats[cat] = true; // pinning a Beleg sets the category (decision: evidence implies the category)
    refreshAssess();
}

function unpinEvidence(cat, idx) {
    if (work.evidence[cat]) {
        work.evidence[cat].splice(idx, 1);
        if (!work.evidence[cat].length) delete work.evidence[cat];
    }
    refreshAssess();
}

// ---- right: assessment (categories + evidence + derived decision + collapsed AI) ----
function assessInnerHtml(p, dec) {
    if (dec) return assessLockedHtml(p, dec);
    var cats = work.cats;
    var h = '<div class="pt-rail-head"><span class="pt-rail-title">Deine Bewertung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-human">bindend</span></div>';
    h += '<div class="pt-rail-body">';
    h += '<p class="pt-assess-hint">Markiere jede Kategorie, die du am Text belegen kannst, oder hefte einen Beleg aus dem Text an.</p>';
    var seed = seedDecision(p);
    if (seed) h += '<div class="pt-seed-ref">Seed-Bewertung (Expert:innen): <strong class="pt-dec-' +
        seed.decision.toLowerCase() + '">' + seed.decision + '</strong>. Du entscheidest unabhaengig.</div>';
    h += dimHtml('Technik', TECH_CATS, cats, false);
    h += dimHtml('Sozial', SOCIAL_CATS, cats, false);
    h += evidenceListHtml(work.evidence, false);
    h += '<div class="pt-logic" id="pt-logic">' + logicInner(cats, work.override) + '</div>';
    var showReason = finalDecisionOf(cats, work.override) === 'Exclude';
    h += '<div class="pt-reason-block" id="pt-reason-block" style="display:' + (showReason ? 'block' : 'none') + ';">';
    h += '<div class="pt-tag-mono pt-reason-label">Ausschlussgrund &middot; erforderlich</div><div class="pt-reason-chips">';
    EXCLUSION_REASONS.forEach(function(r) {
        h += '<button class="pt-reason-chip' + (work.reason === r ? ' sel' : '') + '" data-reason="' + r + '">' + r.replace(/_/g, ' ') + '</button>';
    });
    h += '</div></div>';
    h += '<div class="pt-actions">';
    h += '<button class="pt-record-btn" id="pt-record">Entscheidung erfassen (bindend)</button>';
    h += '<span class="pt-actions-hint" id="pt-actions-hint"></span>';
    h += '</div>';
    h += aiCollapsedHtml(p);
    h += '</div>';
    return h;
}

function assessLockedHtml(p, dec) {
    var cats = dec.categories || {};
    var h = '<div class="pt-rail-head"><span class="pt-rail-title">Deine Bewertung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-' + (dec.decision === 'Include' ? 'include' : 'exclude') + ' pt-pill-lg">' + dec.decision + '</span></div>';
    h += '<div class="pt-rail-body">';
    if (dec.decision === 'Exclude' && dec.reason) h += '<div class="pt-seed-ref">Ausschlussgrund: <strong>' + EC.escapeHtml(dec.reason.replace(/_/g, ' ')) + '</strong></div>';
    h += dimHtml('Technik', TECH_CATS, cats, true);
    h += dimHtml('Sozial', SOCIAL_CATS, cats, true);
    h += evidenceListHtml(dec.evidence || {}, true);
    h += '<div class="pt-actions">';
    h += '<button class="pt-revise-btn" id="pt-revise">Ueberarbeiten</button><span class="pt-spacer"></span>';
    h += '<button class="pt-next-btn" id="pt-next">' + (state.index < papers.length - 1 ? 'Naechstes offen' : 'Zum ersten offenen') + ' &rarr;</button>';
    h += '</div>';
    h += aiCollapsedHtml(p);
    h += '</div>';
    return h;
}

function dimHtml(label, keys, cats, locked) {
    var anyOn = keys.some(function(c) { return cats[c]; });
    var h = '<div class="pt-dim"><div class="pt-dim-head"><span class="pt-tag-mono">' + label + '</span>' +
        '<span class="pt-dim-rule"></span><span class="pt-pill pt-dim-pill ' + (anyOn ? 'pt-pill-include' : 'pt-pill-ghost') + '">' +
        (anyOn ? '&ge;1 gesetzt' : 'keine') + '</span></div><div class="pt-chips">';
    keys.forEach(function(c) { h += chipHtml(c, cats[c], locked); });
    h += '</div></div>';
    return h;
}

function chipHtml(cat, on, locked) {
    return '<button class="pt-chip' + (on ? ' on' : '') + '" data-cat="' + cat + '"' + (locked ? ' disabled' : '') + '>' +
        '<span class="pt-chip-box"></span>' + EC.escapeHtml(CAT_LABELS[cat]) +
        '<span class="pt-chip-tip"><b class="mono">' + cat + '</b><span>' + EC.escapeHtml(CAT_DEFS[cat] || '') + '</span></span></button>';
}

function evidenceListHtml(evidence, locked) {
    var cats = ALL_CATS.filter(function(c) { return (evidence[c] || []).length; });
    if (!cats.length) {
        return locked ? '' : '<div class="pt-evid pt-evid-empty"><span class="pt-tag-mono">Belege</span>' +
            '<p class="pt-muted">Noch keine Belege angeheftet. Markiere im Text die Stelle, die eine Kategorie traegt.</p></div>';
    }
    var h = '<div class="pt-evid"><span class="pt-tag-mono">Belege</span>';
    cats.forEach(function(c) {
        h += '<div class="pt-evid-cat"><div class="pt-evid-cat-h"><span class="pt-evid-dot" style="background:' +
            ((EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--pt-human)') + '"></span>' + EC.escapeHtml(CAT_LABELS[c]) + '</div>';
        (evidence[c] || []).forEach(function(ev, i) {
            var origin = ev.origin === 'ai' ? 'ai' : 'human'; // legacy Belege without origin are human pins
            h += '<div class="pt-evid-item">' +
                '<span class="pt-evid-origin pt-evid-origin-' + origin + '">' + (origin === 'ai' ? 'KI' : 'Mensch') + '</span>' +
                '<span class="pt-evid-snip">' + EC.escapeHtml(ev.snippet || ev.term) + '</span>' +
                (locked ? '' : '<button class="pt-evid-x" data-cat="' + c + '" data-i="' + i + '" title="Beleg entfernen">&times;</button>') + '</div>';
        });
        h += '</div>';
    });
    h += '</div>';
    return h;
}

function logicInner(cats, override) {
    var tech = TECH_CATS.some(function(c) { return cats[c]; });
    var soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    var derived = deriveDecision(cats);
    var h = '<div class="pt-logic-row">';
    h += '<span class="pt-logic-term' + (tech ? ' on' : '') + '">&ge;1 Technik</span>';
    h += '<span class="pt-logic-and mono">UND</span>';
    h += '<span class="pt-logic-term' + (soc ? ' on' : '') + '">&ge;1 Sozial</span>';
    h += '<span class="pt-logic-arrow">&rarr;</span>';
    h += '<span class="pt-tag-mono">abgeleitet</span>';
    h += '<span class="pt-pill pt-pill-' + (derived === 'Include' ? 'include' : 'exclude') + '">' + derived + '</span>';
    if (derived === 'Include') {
        h += '<span class="pt-spacer"></span>';
        h += '<label class="pt-override"><span class="pt-switch"><input type="checkbox" id="pt-override"' +
            (override ? ' checked' : '') + '><span class="pt-switch-track"></span></span> Override zu Exclude</label>';
    }
    h += '</div>';
    return h;
}

function aiCollapsedHtml(p) {
    var a = aiProposal(p);
    if (!a) return '';
    var on = ALL_CATS.filter(function(c) { return a.categories[c]; });
    var h = '<details class="pt-ai-collapse"><summary><span class="pt-tag-mono">KI-Vorschlag</span>' +
        '<span class="pt-pill pt-pill-ai">advisory</span><span class="pt-spacer"></span>' +
        '<span class="pt-dec-' + (a.decision === 'Include' ? 'include' : 'exclude') + '">' + a.decision + '</span></summary>';
    h += '<div class="pt-ai-collapse-body">';
    h += '<div class="pt-tag-mono">KI-Kategorien</div><div class="pt-chips-static">';
    h += on.length ? on.map(function(c) { return '<span class="pt-pill pt-pill-ai">' + CAT_LABELS[c] + '</span>'; }).join('') : '<span class="pt-muted">keine</span>';
    h += '</div>';
    if (a.reasoning) h += '<p class="pt-ai-reason">' + EC.escapeHtml(a.reasoning) + '</p>';
    h += '<p class="pt-ai-foot pt-tag-mono">diagnostisch, konfabulationsanfaellig.</p>';
    h += '</div></details>';
    return h;
}

function refreshAssess() {
    var col = document.getElementById('pt-assess-col');
    if (!col) return;
    var p = papers[state.index];
    col.innerHTML = assessInnerHtml(p, curDec()[p.id]);
    bindAssess(p, curDec()[p.id]);
}

// ---- handlers ----
function attachScreening(p, dec) {
    var el = surfaceEl(); if (!el) return;

    bindCorpusItems();
    var cq = document.getElementById('pt-corpus-q');
    if (cq) {
        cq.addEventListener('input', function() {
            corpusQuery = cq.value;
            if (corpusQuery.trim() && !corpusIndex) loadCorpusIndex().then(refreshCorpusList);
            else refreshCorpusList();
        });
    }
    refreshCorpusList();

    // in-text search
    var intext = document.getElementById('pt-intext');
    if (intext) {
        intext.addEventListener('input', function() { applyInText(intext.value); });
        intext.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); if (docMarks.length) setActiveMark(docMarkIdx + 1); }
        });
    }
    var prev = document.getElementById('pt-intext-prev');
    if (prev) prev.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx - 1); });
    var next = document.getElementById('pt-intext-next');
    if (next) next.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx + 1); });
    var pinHit = document.getElementById('pt-pin-hit');
    if (pinHit) pinHit.addEventListener('click', function() {
        if (!docMarks.length || dec) return;
        var m = docMarks[docMarkIdx];
        var term = (intext && intext.value || '').trim();
        openPinMenu(term, snippetAround(m, term));
    });

    // text-selection pinning in the reading column
    var doc = document.getElementById('pt-doc');
    if (doc && !dec) {
        doc.addEventListener('mouseup', function() {
            var sel = window.getSelection ? window.getSelection() : null;
            if (!sel || sel.isCollapsed) return;
            var text = (sel.toString() || '').trim();
            if (text.length < 2 || text.length > 400) return;
            openPinMenu(text.slice(0, 80), text);
        });
    }

    bindAssess(p, dec);
}

function bindAssess(p, dec) {
    var col = document.getElementById('pt-assess-col'); if (!col) return;

    if (dec) {
        var rev = col.querySelector('#pt-revise');
        if (rev) rev.addEventListener('click', function() { editRecord(p); });
        var nx = col.querySelector('#pt-next');
        if (nx) nx.addEventListener('click', gotoNextOpen);
        return;
    }

    col.querySelectorAll('.pt-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var c = btn.dataset.cat;
            work.cats[c] = !work.cats[c];
            if (deriveDecision(work.cats) === 'Exclude') work.override = false;
            refreshAssess();
        });
    });
    col.querySelectorAll('.pt-evid-x').forEach(function(btn) {
        btn.addEventListener('click', function() { unpinEvidence(btn.dataset.cat, parseInt(btn.dataset.i, 10)); });
    });
    col.querySelectorAll('.pt-reason-chip').forEach(function(btn) {
        btn.addEventListener('click', function() { work.reason = btn.dataset.reason; refreshAssess(); });
    });
    var ov = col.querySelector('#pt-override');
    if (ov) ov.addEventListener('change', function() { work.override = ov.checked; refreshAssess(); });

    var rec = col.querySelector('#pt-record');
    var hint = col.querySelector('#pt-actions-hint');
    var fin = finalDecisionOf(work.cats, work.override);
    var can = fin !== 'Exclude' || !!work.reason;
    if (rec) rec.disabled = !can;
    if (hint) hint.textContent = can ? 'Deine Entscheidung ist verbindlich. KI bleibt nur als Vorschlag.' : 'Bitte einen Ausschlussgrund waehlen.';
    if (rec) rec.addEventListener('click', commit);
}

function commit() {
    var p = papers[state.index];
    var fin = finalDecisionOf(work.cats, work.override);
    if (fin === 'Exclude' && !work.reason) { refreshAssess(); return; }
    curDec()[p.id] = {
        categories: work.cats, decision: fin, override: !!work.override,
        reason: fin === 'Exclude' ? work.reason : null,
        evidence: work.evidence, ts: new Date().toISOString(), reviewer: state.reviewer
    };
    save();
    gotoNextOpen();
}

function editRecord(p) {
    if (!curDec()[p.id]) return;
    delete curDec()[p.id];
    resetWork(p);
    save();
    renderScreening();
}

function gotoNextOpen() {
    var d = curDec();
    for (var i = 0; i < papers.length; i++) {
        var j = (state.index + 1 + i) % papers.length;
        if (!d[papers[j].id]) { state.index = j; renderScreening(); return; }
    }
    if (state.index < papers.length - 1) state.index++;
    renderScreening();
}

// ---- pin menu (category picker for a selected passage / search hit) ----
function openPinMenu(term, snippet) {
    pinTerm = term; pinSnippet = snippet;
    var menu = document.getElementById('pt-pinmenu'); if (!menu) return;
    var h = '<div class="pt-pinmenu-head"><span class="pt-tag-mono">Als Beleg anheften an</span>' +
        '<button class="pt-pinmenu-x" id="pt-pinmenu-x">&times;</button></div>';
    h += '<div class="pt-pinmenu-snip">' + EC.escapeHtml((snippet || term).slice(0, 160)) + '</div>';
    h += '<div class="pt-pinmenu-cats">';
    ALL_CATS.forEach(function(c) {
        h += '<button class="pt-pinmenu-cat" data-cat="' + c + '"><span class="pt-evid-dot" style="background:' +
            ((EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--pt-human)') + '"></span>' + EC.escapeHtml(CAT_LABELS[c]) + '</button>';
    });
    h += '</div>';
    menu.innerHTML = h;
    menu.hidden = false;
    menu.querySelector('#pt-pinmenu-x').addEventListener('click', closePinMenu);
    menu.querySelectorAll('.pt-pinmenu-cat').forEach(function(btn) {
        btn.addEventListener('click', function() { pinEvidence(btn.dataset.cat, pinTerm, pinSnippet); closePinMenu(); });
    });
}

function closePinMenu() {
    var menu = document.getElementById('pt-pinmenu');
    if (menu) { menu.hidden = true; menu.innerHTML = ''; }
}

// ============================================================
// Surface: PRISMA & Report (flow + checklist + disclosure)
// ============================================================

function renderReportSurface() {
    var el = surfaceEl(); if (!el) return;
    var html = '';
    html += '<div class="pt-report-top">' + perspectiveBar() +
        '<p class="pt-muted">Diese Ansicht wird aus dem Screening berechnet.</p></div>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">PRISMA-2020-Fluss (trAIce R1)</h3><div id="pt-sec-flow"></div></section>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">PRISMA-trAIce Checkliste</h3><div id="pt-sec-check"></div></section>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">AI-Disclosure</h3><div id="pt-sec-report"></div></section>';
    el.innerHTML = html;
    attachPerspective(el, renderReportSurface);
    renderFlowInto(document.getElementById('pt-sec-flow'));
    renderChecklistInto(document.getElementById('pt-sec-check'));
    renderReportInto(document.getElementById('pt-sec-report'));
}

function renderFlowInto(el) {
    if (!el) return;
    var f = computeFlow();
    var html = '<div class="pt-flow">';
    html += '<div class="pt-flow-box pt-flow-id"><div class="pt-flow-h">Identification</div>' +
        '<div class="pt-flow-n">Records identified&nbsp; n = ' + f.total + '</div>' +
        '<div class="pt-flow-sub">Seed-Korpus (Deep Research + manuell + Zotero)</div></div>';
    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-h pt-flow-stage">Screening</div>';
    html += '<div class="pt-flow-split">';
    html += '<div class="pt-flow-lane pt-lane-ai"><div class="pt-lane-h">KI-Tool (evaluativ)</div>' +
        '<div class="pt-lane-n">gescreent ' + f.aiScreened + '</div><div class="pt-lane-r">Include ' + f.aiIncl + ' &middot; Exclude ' + f.aiExcl + '</div><div class="pt-lane-note">advisory</div></div>';
    html += '<div class="pt-flow-lane pt-lane-human"><div class="pt-lane-h">Mensch (' + EC.escapeHtml(reviewerLabel(state.perspective)) + ')</div>' +
        '<div class="pt-lane-n">gescreent ' + f.humanScreened + '</div><div class="pt-lane-r">Include ' + f.humanIncl + ' &middot; Exclude ' + f.humanExcl + '</div><div class="pt-lane-note">bindend</div></div>';
    html += '</div>';
    if (Object.keys(f.humanReasons).length) {
        html += '<div class="pt-flow-reasons"><strong>Ausschlussgruende (Mensch):</strong> ' +
            Object.keys(f.humanReasons).map(function(r) { return r.replace(/_/g, ' ') + ' ' + f.humanReasons[r]; }).join(' &middot; ') + '</div>';
    }
    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-box pt-flow-incl"><div class="pt-flow-h">Included</div>' +
        '<div class="pt-flow-n">Mensch (bindend) ' + f.humanIncl + '</div><div class="pt-flow-sub">KI (advisory) ' + f.aiIncl + '</div></div>';
    html += '</div>';
    html += '<p class="pt-flow-caption">KI- und Mensch-Entscheidungen getrennt (PRISMA-trAIce R1). Perspektive Mensch oben waehlbar.</p>';
    el.innerHTML = html;
}


function renderChecklistInto(el) {
    if (!el) return;
    var html = '<p class="pt-check-intro">PRISMA-trAIce (Holst et al. 2025), 14 Items. Auto-markierte erfuellt das Dual-Assessment-Setup bereits.</p>';
    var lastSec = '';
    TRAICE.forEach(function(it) {
        if (it.sec !== lastSec) { html += '<div class="pt-check-sec">' + it.sec + '</div>'; lastSec = it.sec; }
        var st = state.checklist[it.id] || {};
        var status = st.status || (it.auto ? 'satisfied' : 'open');
        html += '<div class="pt-check-item"><div class="pt-check-row">' +
            '<button class="pt-check-status pt-st-' + status + '" data-id="' + it.id + '">' + status + '</button>' +
            '<span class="pt-check-id">' + it.id + '</span>' +
            '<span class="pt-check-lvl pt-lvl-' + it.lvl.split(' ')[0] + '">' + it.lvl + '</span>' +
            (it.auto ? '<span class="pt-check-auto">auto</span>' : '') + '</div>' +
            '<p class="pt-check-text">' + EC.escapeHtml(it.text) + '</p>' +
            '<input class="pt-check-note" data-id="' + it.id + '" placeholder="Notiz" value="' + EC.escapeHtml(st.note || '') + '"></div>';
    });
    html += '<button class="pt-btn pt-check-export">Checkliste exportieren (.md)</button>';
    el.innerHTML = html;
    el.querySelectorAll('.pt-check-status').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.dataset.id;
            var it = TRAICE.filter(function(t) { return t.id === id; })[0];
            var cur = (state.checklist[id] && state.checklist[id].status) || (it.auto ? 'satisfied' : 'open');
            var nx = cur === 'open' ? 'satisfied' : cur === 'satisfied' ? 'na' : 'open';
            state.checklist[id] = state.checklist[id] || {}; state.checklist[id].status = nx;
            save(); renderChecklistInto(el);
        });
    });
    el.querySelectorAll('.pt-check-note').forEach(function(inp) {
        inp.addEventListener('change', function() {
            var id = inp.dataset.id; state.checklist[id] = state.checklist[id] || {}; state.checklist[id].note = inp.value; save();
        });
    });
    var exp = el.querySelector('.pt-check-export');
    if (exp) exp.addEventListener('click', exportChecklist);
}

function exportChecklist() {
    var lines = ['# PRISMA-trAIce checklist', ''];
    TRAICE.forEach(function(it) {
        var st = state.checklist[it.id] || {};
        var status = st.status || (it.auto ? 'satisfied' : 'open');
        lines.push('- [' + (status === 'satisfied' ? 'x' : ' ') + '] ' + it.id + ' (' + it.lvl + '): ' + it.text + (st.note ? ' -- ' + st.note : ''));
    });
    download('prisma-traice-checklist.md', lines.join('\n'), 'text/markdown');
}

function disc(f) { return (state.disclosure[f] != null) ? state.disclosure[f] : (MODEL_DEFAULT[f] || ''); }

function renderReportInto(el) {
    if (!el) return;
    if (state.disclosure.stage == null) state.disclosure.stage = 'Screening';
    if (state.disclosure.conflicts == null) state.disclosure.conflicts = 'none';
    var fields = [['name', 'Modell'], ['date', 'Datum'], ['prompt', 'Prompt-Version'], ['temperature', 'Temperature'],
                  ['threshold', 'Confidence-Schwelle'], ['stage', 'Stage'], ['conflicts', 'Conflicts of Interest'], ['limitations', 'Limitationen']];
    var html = '<div class="pt-report"><div class="pt-report-form">';
    fields.forEach(function(f) {
        var big = f[0] === 'limitations';
        html += '<label class="pt-field"><span>' + f[1] + '</span>' +
            (big ? '<textarea class="pt-rin" data-f="' + f[0] + '" rows="2">' + EC.escapeHtml(disc(f[0])) + '</textarea>'
                 : '<input class="pt-rin" data-f="' + f[0] + '" value="' + EC.escapeHtml(disc(f[0])) + '">') + '</label>';
    });
    html += '</div><div class="pt-report-preview"><div class="pt-prev-head">Vorschau (Markdown)</div><pre class="pt-prev" id="pt-prev"></pre>' +
        '<div class="pt-report-actions"><button class="pt-btn pt-copy">Kopieren</button><button class="pt-btn pt-exp-md">Export .md</button></div></div></div>';
    el.innerHTML = html;
    el.querySelectorAll('.pt-rin').forEach(function(inp) { inp.addEventListener('input', function() { state.disclosure[inp.dataset.f] = inp.value; save(); updatePreview(); }); });
    el.querySelector('.pt-copy').addEventListener('click', function() { if (navigator.clipboard) navigator.clipboard.writeText(disclosureMarkdown()); });
    el.querySelector('.pt-exp-md').addEventListener('click', function() { download('ai-use-disclosure.md', disclosureMarkdown(), 'text/markdown'); });
    updatePreview();
}

function updatePreview() { var pre = document.getElementById('pt-prev'); if (pre) pre.textContent = disclosureMarkdown(); }

function disclosureMarkdown() {
    var m = computeMatrix(); var k = cohenKappa(m);
    var L = [];
    L.push('## AI use disclosure (PRISMA-trAIce / RAISE)', '');
    L.push('Screening of ' + m.n + ' records used ' + disc('name') + ' (prompt ' + disc('prompt') + ', temperature ' + disc('temperature') + '), date ' + disc('date') + '.');
    L.push('Stage: ' + disc('stage') + '. The AI proposal is advisory; every record was screened independently by a human reviewer, whose decision is binding (RAISE).');
    L.push('Performance evaluation against the human reference standard (PRISMA-trAIce M9/R2): Cohen kappa ' + k.toFixed(3) + ' (' + kappaLabel(k) + '); confusion matrix ' + m.II + '/' + m.IE + '/' + m.EI + '/' + m.EE + ' (H-Incl/AI-Incl, H-Incl/AI-Excl, H-Excl/AI-Incl, both-Exclude).');
    L.push('Confidence threshold: ' + disc('threshold') + '. Conflicts of interest: ' + disc('conflicts') + '.');
    if (disc('limitations')) L.push('Limitations: ' + disc('limitations'));
    L.push('', 'Flow diagram distinguishes AI from human decisions (PRISMA-trAIce R1). Tool identity, prompt, and parameters disclosed per M2/M6.');
    return L.join('\n');
}

// ============================================================
// Surface: Daten & Repo (sync: connect, per-reviewer files, export/import)
// ============================================================

function renderData() {
    var el = surfaceEl(); if (!el) return;
    var html = '<div class="pt-data">';

    html += '<div class="pt-data-block"><h4>Reviewer-Identitaet</h4>' +
        '<label class="pt-field"><span>Dein Kuerzel (Dateiname &lt;kuerzel&gt;.json)</span>' +
        '<input class="pt-rev-id" value="' + EC.escapeHtml(state.reviewer) + '"></label></div>';

    html += '<div class="pt-data-block"><h4>Direkt in den Projektordner speichern</h4>';
    if (FS_SUPPORTED) {
        html += '<p class="pt-muted">Ordner docs/data/screening/ im lokalen Projektordner verbinden. Das Tool liest alle Reviewer-Dateien und schreibt deine bei jeder Entscheidung direkt hinein (Schema 0.2 mit Belegen). Die geschriebene Datei sicherst du danach mit deinem ueblichen Werkzeug.</p>';
        html += '<div class="pt-data-actions">' +
            '<button class="pt-btn pt-connect">Mit Projektordner verbinden</button>' +
            '<button class="pt-btn pt-reconnect">Erneut verbinden</button>' +
            '<button class="pt-btn pt-reload">Reviewer-Dateien neu laden</button></div>';
    } else {
        html += '<p class="pt-aq-warn">Dieser Browser (Firefox/Safari) kann nicht direkt schreiben. Nutze Export/Import unten und lege die Datei manuell ab.</p>';
    }
    html += '</div>';

    html += '<div class="pt-data-block"><h4>Export / Import (Fallback, alle Browser)</h4><div class="pt-data-actions">' +
        '<button class="pt-btn pt-exp-rev">Eigene Datei exportieren (' + EC.escapeHtml(state.reviewer) + '.json)</button>' +
        '<label class="pt-btn pt-imp-label">Reviewer-Datei importieren<input type="file" accept=".json" class="pt-imp" hidden></label>' +
        '<button class="pt-btn pt-exp-csv">Decision-Log (.csv)</button>' +
        '<button class="pt-btn pt-clear">Eigene Session leeren</button></div></div>';

    html += '</div>';
    el.innerHTML = html;

    var rid = el.querySelector('.pt-rev-id');
    if (rid) rid.addEventListener('change', function() {
        var v = (rid.value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'reviewer1';
        state.reviewer = v; save(); updateConnStatus(); renderData();
    });
    var conn = el.querySelector('.pt-connect'); if (conn) conn.addEventListener('click', connectRepo);
    var recon = el.querySelector('.pt-reconnect'); if (recon) recon.addEventListener('click', reconnectRepo);
    var reload = el.querySelector('.pt-reload'); if (reload) reload.addEventListener('click', function() { loadAllReviewers().then(function() { renderData(); }); });
    el.querySelector('.pt-exp-rev').addEventListener('click', function() { download(state.reviewer + '.json', JSON.stringify(reviewerPayload(state.reviewer), null, 2), 'application/json'); });
    el.querySelector('.pt-exp-csv').addEventListener('click', exportCsv);
    el.querySelector('.pt-clear').addEventListener('click', function() {
        if (!confirm('Eigene Entscheidungen (' + state.reviewer + ') verwerfen?')) return;
        state.reviewers[state.reviewer] = {}; state.index = 0; save(); showSurface('screening');
    });
    el.querySelector('.pt-imp').addEventListener('change', function(e) {
        var file = e.target.files[0]; if (!file) return;
        var r = new FileReader();
        r.onload = function() {
            try { var obj = JSON.parse(r.result); var key = obj.reviewer || file.name.replace(/\.json$/, ''); state.reviewers[key] = obj.decisions || {}; save(); renderData(); }
            catch (err) { alert('Import fehlgeschlagen: ' + err.message); }
        };
        r.readAsText(file);
    });
}

function exportCsv() {
    var rows = [['id', 'title', 'human_decision', 'human_source', 'ai_decision', 'divergent', 'reason', 'evidence_count']];
    papers.forEach(function(p) {
        var h = humanDecision(p), a = aiProposal(p);
        var rec = (state.reviewers[state.perspective] && state.reviewers[state.perspective][p.id]) || curDec()[p.id];
        rows.push([p.id, '"' + (p.title || '').replace(/"/g, '""') + '"', h ? h.decision : '', h ? h.source : '',
            a ? a.decision : '', divergent(h, a) ? 'yes' : 'no', (h && h.reason) ? h.reason : '', evidenceCount(rec)]);
    });
    download('prisma-decision-log.csv', rows.map(function(r) { return r.join(','); }).join('\n'), 'text/csv');
}

// ============================================================
// Utilities
// ============================================================

function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// test hook (headless harness); no effect in the browser beyond exposing internals
window.__PRISMA_TEST__ = {
    setPapers: function(p) { papers = p; },
    state: state, work: work,
    resetWork: resetWork, pinEvidence: pinEvidence, unpinEvidence: unpinEvidence,
    deriveDecision: deriveDecision, finalDecisionOf: finalDecisionOf, commit: commit,
    renderMarkdown: renderMarkdown, computeMatrix: computeMatrix, cohenKappa: cohenKappa,
    curDec: curDec, getWork: function() { return work; }, reviewerPayload: reviewerPayload,
    showSurface: function(s) { showSurface(s); }
};

// ============================================================
// Test exposure (P1). Appended block: no existing line above is changed
// and no runtime behaviour changes. tests/run-tests.html loads
// js/prisma-data.js first (so window.EC exists here), then this file, and
// reads the closure-scoped pure functions through window.EC._test.
// In prisma.html (prisma.js before prisma-data.js) the data layer replaces
// window.EC afterwards, so this hook is absent on the production page.
// ============================================================
window.EC = window.EC || {};
window.EC._test = {
    // constants
    TECH_CATS: TECH_CATS, SOCIAL_CATS: SOCIAL_CATS, ALL_CATS: ALL_CATS,
    EXCLUSION_REASONS: EXCLUSION_REASONS, SEED: SEED, REVIEWER_SCHEMA: REVIEWER_SCHEMA,
    // decision logic
    deriveDecision: deriveDecision, finalDecisionOf: finalDecisionOf, divergent: divergent,
    abstractQuality: abstractQuality, evidenceCount: evidenceCount,
    aiProposal: aiProposal, humanDecision: humanDecision, seedDecision: seedDecision,
    // aggregation
    computeMatrix: computeMatrix, cohenKappa: cohenKappa, kappaLabel: kappaLabel,
    computeFlow: computeFlow,
    // parsing and rendering helpers
    countOcc: countOcc, stripFrontmatter: stripFrontmatter, inlineMd: inlineMd,
    renderMarkdown: renderMarkdown,
    // generated report text and persistence payload
    disclosureMarkdown: disclosureMarkdown, reviewerPayload: reviewerPayload,
    // stateful seams for inline fixtures
    setPapers: function(p) { papers = p; },
    getState: function() { return state; },
    getWork: function() { return work; },
    curDec: curDec, resetWork: resetWork,
    pinEvidence: pinEvidence, unpinEvidence: unpinEvidence, commit: commit,
    evidenceListHtml: evidenceListHtml
};

})();
