// PRISMA Screening Tool -- standalone, Git-based screening instrument.
// Human decision is binding (RAISE); the AI proposal is advisory and stored separately
// so the flow diagram splits AI from human decisions (PRISMA-trAIce R1).
// Persistence: File System Access API writes one JSON per reviewer into the repo
// (docs/data/screening/<reviewer>.json), committed with Git; export/import fallback.
// Runs on prisma.html via the window.EC shim from prisma-data.js.
// See knowledge/design.md, knowledge/data.md, knowledge/ai-assisted-review-standards.md.

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
var SEED = 'seed'; // built-in reviewer = the existing expert assessment (paper.human)

// ============================================================
// State
// ============================================================

var state = {
    surface: 'workspace',
    blind: false,          // off by default: the tool opens on the seed case study (fix A2)
    reviewer: 'reviewer1', // who is editing; drives the per-reviewer file name
    perspective: SEED,     // whose decisions drive Flow/Agreement (default: seed = benchmark)
    index: 0,
    reviewers: {},         // reviewerKey -> { paperId -> decision }
    checklist: {},
    disclosure: {}
};

var papers = [];
var dirHandle = null;      // connected File System Access directory handle

function curDec() {
    if (!state.reviewers[state.reviewer]) state.reviewers[state.reviewer] = {};
    return state.reviewers[state.reviewer];
}

// ============================================================
// Persistence: localStorage cache + File System Access (repo files)
// ============================================================

function serializeAll() {
    return {
        schema: LS_KEY,
        config: { blind: state.blind, reviewer: state.reviewer, perspective: state.perspective, disclosure: state.disclosure },
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
            if (typeof o.config.blind === 'boolean') state.blind = o.config.blind;
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
    return { schema: 'femprompt-prisma-reviewer/0.1', reviewer: key,
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
                found[key] = obj.decisions || {};
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
// Init
// ============================================================

window.initializePrisma = function() {
    if (initialized) return;
    initialized = true;
    EC = window.EC; // bind now: prisma-data.js (or the companion) has defined the shim by call time
    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    loadLocal();
    renderShell();
    showSurface(state.surface || 'workspace');
    updateConnStatus();
    console.log('[PRISMA] initialized, ' + papers.length + ' papers, FS ' + (FS_SUPPORTED ? 'supported' : 'fallback'));
};

// ============================================================
// Shell + sub-navigation
// ============================================================

var SURFACES = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'flow', label: 'Flow' },
    { id: 'agreement', label: 'Agreement' },
    { id: 'reviewers', label: 'Reviewers' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'report', label: 'Report' },
    { id: 'data', label: 'Daten & Repo' }
];

function renderShell() {
    var root = document.getElementById('prisma-root');
    if (!root) return;
    var html = '<div class="pt-subnav">';
    SURFACES.forEach(function(s) {
        html += '<button class="pt-subnav-btn' + (s.id === state.surface ? ' active' : '') +
            '" data-surface="' + s.id + '">' + s.label + '</button>';
    });
    html += '<span class="pt-subnav-spacer"></span>';
    html += '<label class="pt-blind-toggle" title="KI-Vorschlag erst nach eigener Entscheidung zeigen (Anti-Anchoring). Für unabhängiges Screening einschalten.">' +
        '<input type="checkbox" id="pt-blind"' + (state.blind ? ' checked' : '') + '> Blind-Modus</label>';
    html += '</div>';
    html += '<div class="pt-surface" id="pt-surface"></div>';
    root.innerHTML = html;

    root.querySelectorAll('.pt-subnav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { showSurface(btn.dataset.surface); });
    });
    var blind = document.getElementById('pt-blind');
    if (blind) blind.addEventListener('change', function() {
        state.blind = blind.checked; save();
        if (state.surface === 'workspace') renderWorkspace();
    });
}

function showSurface(name) {
    state.surface = name; saveLocal();
    document.querySelectorAll('.pt-subnav-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.surface === name); });
    var fn = { workspace: renderWorkspace, flow: renderFlow, agreement: renderAgreement,
              reviewers: renderReviewers, checklist: renderChecklist, report: renderReport, data: renderData }[name];
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

// human decision under a perspective: SEED = paper.human, otherwise a reviewer file
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

function divergent(h, a) { return h && a && h.decision !== a.decision; }

// Heuristic flag for low-quality / boilerplate abstracts (fix A1)
function abstractQuality(p) {
    var a = (p.abstract || '').trim();
    if (!a) return { ok: false, note: 'Kein Abstract vorhanden, bitte Quelle oder Wissensdokument prüfen.' };
    if (/National Bureau of Economic Research|Founded in 1920, the NBER|private, non-profit, non-partisan organization/i.test(a))
        return { ok: false, note: 'Wirkt wie Verlags-Boilerplate (NBER), nicht das Paper-Abstract. Quelle oder Wissensdokument prüfen.' };
    if (a.length < 120) return { ok: false, note: 'Sehr kurzes Abstract, evtl. unvollständig.' };
    return { ok: true };
}

// ============================================================
// Aggregation
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

// ============================================================
// Perspective selector (shared by Flow / Agreement)
// ============================================================

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
// Surface: Screening Workspace
// ============================================================

function renderWorkspace() {
    var el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper geladen.</p>'; return; }
    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;

    var p = papers[state.index];
    var dec = curDec()[p.id];
    var screened = Object.keys(curDec()).length;
    var pct = papers.length ? Math.round(screened / papers.length * 100) : 0;

    var html = '';
    html += '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos">Paper ' + (state.index + 1) + ' / ' + papers.length + '</span>';
    html += '<span class="pt-ws-progressbar"><span class="pt-ws-progressfill" style="width:' + pct + '%"></span></span>';
    html += '<span class="pt-ws-prog mono">' + screened + ' / ' + papers.length + ' &middot; ' + EC.escapeHtml(state.reviewer) + '</span>';
    html += '</div>';

    html += '<div class="pt-ws">';
    html += navigatorHtml();
    html += readingHtml(p, dec);
    html += railHtml(p, dec);
    html += '</div>';

    el.innerHTML = html;
    attachWorkspace(p);
}

// ---- decision model helpers (derived rule + explicit override) ----
function finalDecisionOf(cats, dec, override) {
    if (deriveDecision(cats) === 'Exclude') return 'Exclude';
    var ov = (override != null) ? override : (dec ? !!dec.override : false);
    return ov ? 'Exclude' : 'Include';
}

// ---- left: paper navigator ----
function navigatorHtml() {
    var d = curDec();
    var h = '<aside class="pt-nav"><div class="pt-nav-head"><span class="pt-nav-title-main">Batch</span>' +
        '<span class="pt-tag-mono">' + Object.keys(d).length + ' / ' + papers.length + '</span></div><div class="pt-nav-list">';
    papers.forEach(function(p, i) {
        var rec = d[p.id];
        var st = rec ? rec.decision.toLowerCase() : 'none';
        h += '<button class="pt-nav-item' + (i === state.index ? ' active' : '') + '" data-i="' + i + '">' +
            '<span class="pt-nav-dot pt-dot-' + st + '"></span>' +
            '<span class="pt-nav-text"><span class="pt-nav-t">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</span>' +
            '<span class="pt-nav-m mono">' + EC.escapeHtml(p.author_year || p.id) + '</span></span></button>';
    });
    h += '</div></aside>';
    return h;
}

// ---- center: reading column + assessment ----
function readingHtml(p, dec) {
    var aq = abstractQuality(p);
    var locked = !!dec;
    var h = '<div class="pt-read"><div class="pt-read-inner">';

    h += '<div class="pt-read-meta">';
    h += '<span class="pt-pill pt-pill-ghost mono">' + EC.escapeHtml(p.id) + '</span>';
    if (p.item_type) h += '<span class="pt-tag-mono">' + EC.escapeHtml(p.item_type) + '</span>';
    if (p.knowledge_doc) h += '<span class="pt-pill pt-pill-ghost" title="' + EC.escapeHtml(p.knowledge_doc) + '">Wissensdokument</span>';
    if (locked) h += '<span class="pt-pill pt-pill-human pt-pill-right">erfasst</span>';
    h += '</div>';

    h += '<h1 class="pt-paper-title">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h1>';
    h += '<div class="pt-paper-authors">' + EC.escapeHtml(p.author_year || p.authors || '') +
        (p.journal ? ' &middot; <span class="pt-muted">' + EC.escapeHtml(p.journal) + '</span>' : '') + '</div>';
    if (!aq.ok) h += '<div class="pt-aq-warn">Achtung: ' + EC.escapeHtml(aq.note) + '</div>';
    if (p.abstract && p.abstract.trim()) h += '<p class="pt-paper-abstract">' + EC.escapeHtml(p.abstract) + '</p>';
    else h += '<p class="pt-muted">Kein Abstract vorhanden, bitte Wissensdokument oder Quelle pruefen.</p>';

    h += '<hr class="pt-divider">';
    h += assessmentHtml(p, dec);
    h += '</div></div>';
    return h;
}

function assessmentHtml(p, dec) {
    var locked = !!dec;
    var cats = dec ? (dec.categories || {}) : {};
    var seed = seedDecision(p);
    var h = '<div class="pt-assess">';
    h += '<div class="pt-assess-head"><span class="pt-assess-title">Deine Bewertung</span><span class="pt-pill pt-pill-human">bindend</span>';
    if (state.blind && !locked) h += '<span class="pt-pill pt-pill-warn">blind</span>';
    h += '</div>';
    h += '<p class="pt-assess-hint">Markiere jede Kategorie, die du am Text belegen kannst. Hover zeigt die Definition.</p>';

    if (seed && !locked) h += '<div class="pt-seed-ref">Seed-Bewertung (Expert:innen): <strong class="pt-dec-' +
        seed.decision.toLowerCase() + '">' + seed.decision + '</strong>. Du entscheidest unabhaengig.</div>';

    h += dimHtml('Technik', TECH_CATS, cats, locked);
    h += dimHtml('Sozial', SOCIAL_CATS, cats, locked);

    h += '<div class="pt-logic" id="pt-logic">' + logicInner(cats, dec) + '</div>';

    var showReason = finalDecisionOf(cats, dec) === 'Exclude';
    h += '<div class="pt-reason-block" id="pt-reason-block" style="display:' + (showReason ? 'block' : 'none') + ';">';
    h += '<div class="pt-tag-mono pt-reason-label">Ausschlussgrund &middot; erforderlich</div><div class="pt-reason-chips">';
    EXCLUSION_REASONS.forEach(function(r) {
        var sel = dec ? dec.reason === r : false;
        h += '<button class="pt-reason-chip' + (sel ? ' sel' : '') + '" data-reason="' + r + '"' + (locked ? ' disabled' : '') + '>' +
            r.replace(/_/g, ' ') + '</button>';
    });
    h += '</div></div>';

    h += '<div class="pt-actions">';
    if (!locked) {
        h += '<button class="pt-record-btn" id="pt-record">Entscheidung erfassen (bindend)</button>';
        h += '<span class="pt-actions-hint" id="pt-actions-hint"></span>';
    } else {
        h += '<span class="pt-pill pt-pill-' + (dec.decision === 'Include' ? 'include' : 'exclude') + ' pt-pill-lg">' + dec.decision + '</span>';
        if (dec.decision === 'Exclude' && dec.reason) h += '<span class="pt-pill pt-pill-ghost mono">' + dec.reason.replace(/_/g, ' ') + '</span>';
        h += '<button class="pt-revise-btn" id="pt-revise">Ueberarbeiten</button>';
        h += '<span class="pt-spacer"></span>';
        h += '<button class="pt-next-btn" id="pt-next">' + (state.index < papers.length - 1 ? 'Naechstes offen' : 'Zum ersten offenen') + ' &rarr;</button>';
    }
    h += '</div></div>';
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

function logicInner(cats, dec, override) {
    var tech = TECH_CATS.some(function(c) { return cats[c]; });
    var soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    var derived = deriveDecision(cats);
    var locked = !!dec;
    var ov = (override != null) ? override : (dec ? !!dec.override : false);
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
            (ov ? ' checked' : '') + (locked ? ' disabled' : '') + '><span class="pt-switch-track"></span></span> Override zu Exclude</label>';
    }
    h += '</div>';
    return h;
}

// ---- right: agreement rail (blind / preview / revealed) ----
function railHtml(p, dec) {
    var a = aiProposal(p);
    var mode = dec ? 'revealed' : (state.blind ? 'blind' : 'preview');
    var h = '<aside class="pt-rail"><div class="pt-rail-head"><span class="pt-rail-title">Agreement</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-ai">advisory</span></div>';
    if (!a) {
        h += '<div class="pt-rail-body"><p class="pt-muted">Kein KI-Vorschlag fuer dieses Paper.</p></div>';
    } else if (mode === 'blind') {
        h += '<div class="pt-rail-body pt-blind-state">' +
            '<div class="pt-blind-lock">' + lockSvg() + '</div>' +
            '<div class="pt-blind-title">KI-Vorschlag verborgen</div>' +
            '<p class="pt-blind-text">Erfasse zuerst deine eigene Entscheidung, damit dein Urteil unabhaengig bleibt und der Mensch-KI-Vergleich aussagekraeftig ist.</p>' +
            '<span class="pt-tag-mono">RAISE &middot; menschliche Aufsicht (FR-02)</span></div>';
    } else if (mode === 'preview') {
        h += '<div class="pt-rail-body pt-fade">' +
            '<div class="pt-preview-note">Blind-Modus aus, KI vor deiner Entscheidung sichtbar.</div>' +
            decisionCardHtml('KI', 'advisory', 'ai', a.decision) + aiCatsHtml(a) + provHtml(a) + '</div>';
    } else {
        h += '<div class="pt-rail-body pt-rise">' + revealHtml(p, dec, a) + '</div>';
    }
    h += '</aside>';
    return h;
}

function revealHtml(p, dec, a) {
    var human = { decision: dec.decision, categories: dec.categories || {} };
    var decDiv = human.decision !== a.decision;
    var catDiffs = ALL_CATS.filter(function(c) { return !!human.categories[c] !== !!a.categories[c]; });
    var isDiv = decDiv || catDiffs.length > 0;
    var h = '';
    if (isDiv) {
        h += '<div class="pt-verdict pt-verdict-diverge"><div class="pt-verdict-head">Divergenz' +
            '<span class="pt-pill pt-pill-warn">' + (decDiv ? 'Entscheidung' : 'Kategorie') + '</span></div>';
        var pat = p.benchmark && p.benchmark.disagreement_type;
        if (pat) h += '<div class="pt-verdict-pat mono">Referenzmuster (Seed vs KI): ' + EC.escapeHtml(pat) + '</div>';
        h += '</div>';
    } else {
        h += '<div class="pt-verdict pt-verdict-agree"><div class="pt-verdict-head">Volle Uebereinstimmung</div></div>';
    }

    h += '<div class="pt-decision-cards">' +
        decisionCardHtml('Mensch', 'bindend', 'human', human.decision) +
        decisionCardHtml('KI', 'advisory', 'ai', a.decision) + '</div>';

    var union = ALL_CATS.filter(function(c) { return human.categories[c] || a.categories[c]; });
    h += '<div class="pt-compare-head"><span class="pt-tag-mono">Kategorie-Vergleich</span><span class="pt-spacer"></span>' +
        '<span class="pt-tag-mono"><span class="pt-legend pt-legend-h"></span>du<span class="pt-legend pt-legend-a"></span>KI</span></div>';
    if (!union.length) h += '<p class="pt-muted">Keine Kategorie gesetzt.</p>';
    union.forEach(function(c) {
        var hh = !!human.categories[c], aa = !!a.categories[c], diff = hh !== aa;
        h += '<div class="pt-compare-row' + (diff ? ' diff' : '') + '"><span class="pt-compare-label">' + CAT_LABELS[c] + '</span>' +
            '<span class="pt-mark' + (hh ? ' on pt-mark-h' : '') + '"></span>' +
            '<span class="pt-mark' + (aa ? ' on pt-mark-a' : '') + '"></span></div>';
    });

    if (a.reasoning) {
        h += '<details class="pt-reasoning"><summary>KI-Begruendung <span class="pt-tag-mono">diagnostisch, konfabulationsanfaellig</span></summary>' +
            '<p>' + EC.escapeHtml(a.reasoning) + '</p></details>';
    }
    h += provHtml(a);
    return h;
}

function decisionCardHtml(who, sub, kind, decision) {
    var inc = decision === 'Include';
    return '<div class="pt-decision-card pt-card-' + kind + '"><div class="pt-card-top">' +
        '<span class="pt-card-who">' + who + '</span><span class="pt-tag-mono">' + sub + '</span></div>' +
        '<div class="pt-card-dec"><span class="pt-dot-' + (inc ? 'include' : 'exclude') + '"></span>' +
        '<span class="pt-dec-' + (inc ? 'include' : 'exclude') + '">' + decision + '</span></div></div>';
}

function aiCatsHtml(a) {
    var on = ALL_CATS.filter(function(c) { return a.categories[c]; });
    var h = '<div class="pt-ai-cats"><span class="pt-tag-mono">KI-Kategorien</span><div class="pt-chips-static">';
    if (!on.length) h += '<span class="pt-muted">keine</span>';
    on.forEach(function(c) { h += '<span class="pt-pill pt-pill-ai">' + CAT_LABELS[c] + '</span>'; });
    h += '</div></div>';
    return h;
}

function provHtml(a) {
    var M = MODEL_DEFAULT;
    return '<div class="pt-prov"><span class="pt-tag-mono pt-prov-title">KI-Provenienz</span>' +
        provRow('Modell', M.name) + provRow('Prompt', M.prompt) +
        provRow('Parameter', 'temp ' + M.temperature + ' &middot; ' + M.maxTokens + ' tok') +
        provRow('Datum', M.date) + '</div>';
}

function provRow(k, v) {
    return '<div class="pt-prov-row"><span class="pt-tag-mono">' + k + '</span><span class="mono pt-prov-v">' + v + '</span></div>';
}

function lockSvg() {
    return '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
        'stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"></rect>' +
        '<path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>';
}

// ---- handlers ----
function attachWorkspace(p) {
    var el = surfaceEl(); if (!el) return;
    var dec = curDec()[p.id];

    el.querySelectorAll('.pt-nav-item').forEach(function(btn) {
        btn.addEventListener('click', function() { state.index = parseInt(btn.dataset.i, 10); renderWorkspace(); });
    });

    if (dec) {
        var rev = el.querySelector('#pt-revise');
        if (rev) rev.addEventListener('click', function() { editRecord(p); });
        var nx = el.querySelector('#pt-next');
        if (nx) nx.addEventListener('click', gotoNextOpen);
        return;
    }

    var working = {};
    var override = false;
    var reason = null;

    function refreshDimPills() {
        var dims = el.querySelectorAll('.pt-dim');
        updateDimPill(dims[0], TECH_CATS);
        updateDimPill(dims[1], SOCIAL_CATS);
    }
    function updateDimPill(dimEl, keys) {
        if (!dimEl) return;
        var pill = dimEl.querySelector('.pt-dim-pill'); if (!pill) return;
        var anyOn = keys.some(function(c) { return working[c]; });
        pill.className = 'pt-pill pt-dim-pill ' + (anyOn ? 'pt-pill-include' : 'pt-pill-ghost');
        pill.innerHTML = anyOn ? '&ge;1 gesetzt' : 'keine';
    }
    function bindOverride() {
        var ov = el.querySelector('#pt-override');
        if (ov) ov.addEventListener('change', function() { override = ov.checked; refreshLogic(); });
    }
    function refreshLogic() {
        var logic = el.querySelector('#pt-logic');
        if (logic) logic.innerHTML = logicInner(working, null, override);
        bindOverride();
        var fin = finalDecisionOf(working, null, override);
        var rb = el.querySelector('#pt-reason-block');
        if (rb) rb.style.display = fin === 'Exclude' ? 'block' : 'none';
        refreshRecordHint();
    }
    function refreshRecordHint() {
        var fin = finalDecisionOf(working, null, override);
        var can = fin !== 'Exclude' || !!reason;
        var rec = el.querySelector('#pt-record');
        var hint = el.querySelector('#pt-actions-hint');
        if (rec) rec.disabled = !can;
        if (hint) hint.textContent = can ? 'Deine Entscheidung ist verbindlich, KI erscheint danach.' : 'Bitte einen Ausschlussgrund waehlen.';
    }

    el.querySelectorAll('.pt-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var c = btn.dataset.cat; working[c] = !working[c]; btn.classList.toggle('on', working[c]);
            if (deriveDecision(working) === 'Exclude') override = false;
            refreshDimPills();
            refreshLogic();
        });
    });
    el.querySelectorAll('.pt-reason-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            reason = btn.dataset.reason;
            el.querySelectorAll('.pt-reason-chip').forEach(function(b) { b.classList.remove('sel'); });
            btn.classList.add('sel');
            refreshRecordHint();
        });
    });

    bindOverride();
    refreshRecordHint();

    function commit() {
        var fin = finalDecisionOf(working, null, override);
        if (fin === 'Exclude' && !reason) {
            var rb = el.querySelector('#pt-reason-block'); if (rb) rb.style.display = 'block';
            refreshRecordHint();
            return;
        }
        curDec()[p.id] = { categories: working, decision: fin, override: !!override,
            reason: fin === 'Exclude' ? reason : null, ts: new Date().toISOString(), reviewer: state.reviewer };
        save();
        gotoNextOpen();
    }

    var recBtn = el.querySelector('#pt-record');
    if (recBtn) recBtn.addEventListener('click', commit);
    el.onkeydown = function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
            e.preventDefault(); if (recBtn && !recBtn.disabled) commit();
        }
    };
}

function editRecord(p) {
    if (!curDec()[p.id]) return;
    delete curDec()[p.id];
    save();
    renderWorkspace();
}

function gotoNextOpen() {
    var d = curDec();
    for (var i = 0; i < papers.length; i++) {
        var j = (state.index + 1 + i) % papers.length;
        if (!d[papers[j].id]) { state.index = j; renderWorkspace(); return; }
    }
    if (state.index < papers.length - 1) state.index++;
    renderWorkspace();
}

// ============================================================
// Surface: Flow
// ============================================================

function renderFlow() {
    var el = surfaceEl(); if (!el) return;
    var f = computeFlow();
    var html = perspectiveBar();
    html += '<div class="pt-flow">';
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
        html += '<div class="pt-flow-reasons"><strong>Ausschlussgründe (Mensch):</strong> ' +
            Object.keys(f.humanReasons).map(function(r) { return r.replace(/_/g, ' ') + ' ' + f.humanReasons[r]; }).join(' &middot; ') + '</div>';
    }
    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-box pt-flow-incl"><div class="pt-flow-h">Included</div>' +
        '<div class="pt-flow-n">Mensch (bindend) ' + f.humanIncl + '</div><div class="pt-flow-sub">KI (advisory) ' + f.aiIncl + '</div></div>';
    html += '</div>';
    html += '<p class="pt-flow-caption">PRISMA-2020-Fluss mit PRISMA-trAIce-R1-Split: KI- und Mensch-Entscheidungen getrennt. Perspektive Mensch oben wählbar.</p>';
    el.innerHTML = html;
    attachPerspective(el, renderFlow);
}

// ============================================================
// Surface: Agreement
// ============================================================

function renderAgreement() {
    var el = surfaceEl(); if (!el) return;
    var m = computeMatrix();
    var k = cohenKappa(m);
    var kappas = (EC && EC.getKappas) ? EC.getKappas() : {};
    var hRate = m.n ? Math.round((m.II + m.IE) / m.n * 1000) / 10 : 0;
    var aRate = m.n ? Math.round((m.II + m.EI) / m.n * 1000) / 10 : 0;

    var html = perspectiveBar();
    html += '<div class="pt-agree">';
    html += '<div class="pt-matrix-wrap">';
    html += '<div class="pt-matrix-title">Konfusionsmatrix &middot; <span class="pt-kappa">&kappa; = ' + k.toFixed(3) + ' &ldquo;' + kappaLabel(k) + '&rdquo;</span> &middot; n = ' + m.n + '</div>';
    html += '<table class="pt-matrix"><thead><tr><th></th><th>KI Include</th><th>KI Exclude</th></tr></thead><tbody>';
    html += '<tr><th>Mensch Include</th><td class="pt-cell" data-cell="II">' + m.II + '</td><td class="pt-cell" data-cell="IE">' + m.IE + '</td></tr>';
    html += '<tr><th>Mensch Exclude</th><td class="pt-cell" data-cell="EI">' + m.EI + '</td><td class="pt-cell" data-cell="EE">' + m.EE + '</td></tr>';
    html += '</tbody></table>';
    html += '<div class="pt-rates">Mensch Include-Rate <strong>' + hRate + '%</strong> &middot; KI Include-Rate <strong>' + aRate + '%</strong></div>';
    html += '<p class="pt-muted">Zelle anklicken filtert den Workspace.</p>';
    html += '</div>';
    html += '<div class="pt-catkappa"><h4>Kategorie-Kappas (Korpus-Benchmark, Seed gegen KI)</h4>';
    ALL_CATS.forEach(function(c) {
        var d = kappas[c]; if (!d) return;
        var kv = (d.kappa != null) ? d.kappa : 0;
        var color = (EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--primary)';
        html += '<div class="pt-kbar-row"><span class="pt-kbar-label">' + CAT_LABELS[c] + '</span>' +
            '<span class="pt-kbar-track"><span class="pt-kbar-fill" style="width:' + Math.max(0, kv * 100) + '%;background:' + color + ';"></span></span>' +
            '<span class="pt-kbar-val">' + kv.toFixed(2) + '</span></div>';
    });
    html += '</div></div>';
    el.innerHTML = html;
    attachPerspective(el, renderAgreement);
    el.querySelectorAll('.pt-cell').forEach(function(td) { td.addEventListener('click', function() { filterWorkspaceByCell(td.dataset.cell); }); });
}

function filterWorkspaceByCell(cell) {
    for (var i = 0; i < papers.length; i++) {
        var h = humanDecision(papers[i]), a = aiProposal(papers[i]);
        if (!h || !a) continue;
        var key = (h.decision === 'Include' ? 'I' : 'E') + (a.decision === 'Include' ? 'I' : 'E');
        if (key === cell) { state.index = i; showSurface('workspace'); return; }
    }
}

// ============================================================
// Surface: Reviewers (reconciliation)
// ============================================================

function renderReviewers() {
    var el = surfaceEl(); if (!el) return;
    var keys = reviewerKeys();
    var html = '<div class="pt-rev"><p class="pt-check-intro">Jede:r Reviewer:in screent unabhängig in eine eigene Datei. ' +
        'Hier der Vergleich aller geladenen Reviewer:innen plus Seed gegen die KI (PRISMA-trAIce M8/M9).</p>';
    html += '<table class="pt-matrix pt-rev-table"><thead><tr><th>Reviewer</th><th>gescreent</th><th>Include</th><th>Exclude</th><th>&kappa; vs KI</th></tr></thead><tbody>';
    keys.forEach(function(k) {
        var m = computeMatrix(k);
        var incl = m.II + m.IE, excl = m.EI + m.EE;
        html += '<tr><th>' + EC.escapeHtml(reviewerLabel(k)) + '</th><td>' + m.n + '</td><td>' + incl + '</td><td>' + excl + '</td><td>' + cohenKappa(m).toFixed(3) + '</td></tr>';
    });
    html += '</tbody></table>';
    if (keys.length <= 1) html += '<p class="pt-muted">Noch keine eigenen Reviewer-Dateien geladen. Verbinde im Tab "Daten & Repo" den Ordner docs/data/screening/ oder importiere eine Datei.</p>';
    html += '</div>';
    el.innerHTML = html;
}

// ============================================================
// Surface: Checklist
// ============================================================

function renderChecklist() {
    var el = surfaceEl(); if (!el) return;
    var html = '<div class="pt-check"><p class="pt-check-intro">PRISMA-trAIce (Holst et al. 2025), 14 Items. Auto-markierte erfüllt das Dual-Assessment-Setup bereits. PRISMA-2020-Vollcheckliste (27 Items): offizielle Vorlage.</p>';
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
    html += '<button class="pt-btn pt-check-export">Checkliste exportieren (.md)</button></div>';
    el.innerHTML = html;

    el.querySelectorAll('.pt-check-status').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.dataset.id;
            var it = TRAICE.find(function(t) { return t.id === id; });
            var cur = (state.checklist[id] && state.checklist[id].status) || (it.auto ? 'satisfied' : 'open');
            var next = cur === 'open' ? 'satisfied' : cur === 'satisfied' ? 'na' : 'open';
            state.checklist[id] = state.checklist[id] || {}; state.checklist[id].status = next;
            save(); renderChecklist();
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

// ============================================================
// Surface: Report
// ============================================================

function disc(f) { return (state.disclosure[f] != null) ? state.disclosure[f] : (MODEL_DEFAULT[f] || ''); }

function renderReport() {
    var el = surfaceEl(); if (!el) return;
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
// Surface: Daten & Repo
// ============================================================

function renderData() {
    var el = surfaceEl(); if (!el) return;
    var n = Object.keys(curDec()).length;
    var html = '<div class="pt-data">';

    html += '<div class="pt-data-block"><h4>Reviewer-Identität</h4>' +
        '<label class="pt-field"><span>Dein Kürzel (Dateiname &lt;kürzel&gt;.json)</span>' +
        '<input class="pt-rev-id" value="' + EC.escapeHtml(state.reviewer) + '"></label></div>';

    html += '<div class="pt-data-block"><h4>Git-Workflow (File System Access)</h4>';
    if (FS_SUPPORTED) {
        html += '<p class="pt-muted">Ordner docs/data/screening/ im lokalen Klon verbinden. Das Tool liest alle Reviewer-Dateien und schreibt deine bei jeder Entscheidung direkt hinein. Danach committest du selbst.</p>';
        html += '<div class="pt-data-actions">' +
            '<button class="pt-btn pt-connect">Mit Repo-Ordner verbinden</button>' +
            '<button class="pt-btn pt-reconnect">Erneut verbinden</button>' +
            '<button class="pt-btn pt-reload">Reviewer-Dateien neu laden</button></div>';
        html += '<pre class="pt-git-hint">git add docs/data/screening/' + EC.escapeHtml(state.reviewer) + '.json\ngit commit -m "screening: ' + n + ' Paper (' + EC.escapeHtml(state.reviewer) + ')"\ngit push</pre>';
    } else {
        html += '<p class="pt-aq-warn">Dieser Browser (Firefox/Safari) kann nicht direkt schreiben. Nutze Export/Import unten und committe die Datei manuell.</p>';
    }
    html += '</div>';

    html += '<div class="pt-data-block"><h4>Export / Import (Fallback, alle Browser)</h4><div class="pt-data-actions">' +
        '<button class="pt-btn pt-exp-rev">Eigene Datei exportieren (' + EC.escapeHtml(state.reviewer) + '.json)</button>' +
        '<label class="pt-btn pt-imp-label">Reviewer-Datei importieren<input type="file" accept=".json" class="pt-imp" hidden></label>' +
        '<button class="pt-btn pt-exp-csv">Decision-Log (.csv)</button>' +
        '<button class="pt-btn pt-clear">Eigene Session leeren</button></div></div>';

    var keys = reviewerKeys();
    html += '<div class="pt-data-block"><h4>Geladene Reviewer:innen</h4><p class="pt-muted">' +
        keys.map(function(k) { return EC.escapeHtml(reviewerLabel(k)) + ' (' + (k === SEED ? '291 Seed' : Object.keys(state.reviewers[k] || {}).length) + ')'; }).join(' &middot; ') + '</p></div>';

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
        state.reviewers[state.reviewer] = {}; state.index = 0; save(); showSurface('workspace');
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
    var rows = [['id', 'title', 'human_decision', 'human_source', 'ai_decision', 'divergent', 'reason']];
    papers.forEach(function(p) {
        var h = humanDecision(p), a = aiProposal(p);
        rows.push([p.id, '"' + (p.title || '').replace(/"/g, '""') + '"', h ? h.decision : '', h ? h.source : '', a ? a.decision : '', divergent(h, a) ? 'yes' : 'no', (h && h.reason) ? h.reason : '']);
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

})();
