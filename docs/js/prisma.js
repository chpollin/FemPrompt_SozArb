// PRISMA Screening Tool (PRISM) -- standalone evidence-grounded screening instrument.
// The screening view is built around reading and searching the paper's original full text
// (the Volltext layer; the AI distillation is a separate KI-Extraktion layer) and pinning
// found passages as Belege (evidence) on categories. AI is reduced to an optional
// collapsed suggestion; human and AI assessment are brought together, not scored against
// each other -- the human-AI comparison surface (matrix, kappa, divergence) was removed
// (knowledge/specification.md ADR-014), and with ADR-017 its last vestige is gone too:
// the in-tool kappa and confusion matrix of the AI-disclosure line. AI-human agreement
// is evaluated outside the tool on the benchmark corpus (PRISMA-trAIce M9/R2 by reference).
//
// One screening workspace (ADR-020); the report and data functions remain in code as
// on-demand panels, not surfaced in the toolbar.
// Human decision is binding (RAISE); the AI proposal is advisory and stored separately
// so the flow diagram splits AI from human decisions (PRISMA-trAIce R1).
// Persistence: File System Access writes one JSON per reviewer (schema 0.2, with an
// evidence map) into docs/data/screening/<reviewer>.json; versioning happens outside the
// tool (GitHub Desktop), export/import fallback. Runs on prisma.html via the window.EC
// shim from prisma-data.js.
// See knowledge/specification.md (requirements, ADRs, design system), knowledge/data.md.

(function() {
'use strict';

let EC = window.EC;
let initialized = false;
const FS_SUPPORTED = typeof window.showDirectoryPicker === 'function';

// Constants

const TECH_CATS = ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige'];
const SOCIAL_CATS = ['Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'];
const ALL_CATS = TECH_CATS.concat(SOCIAL_CATS);

const CAT_LABELS = {
    'AI_Literacies': 'AI Literacies', 'Generative_KI': 'Generative KI',
    'Prompting': 'Prompting', 'KI_Sonstige': 'KI Sonstige',
    'Soziale_Arbeit': 'Soziale Arbeit', 'Bias_Ungleichheit': 'Bias & Ungleichheit',
    'Gender': 'Gender', 'Diversitaet': 'Diversität',
    'Feministisch': 'Feministisch', 'Fairness': 'Fairness'
};

// Category definitions (hover tooltips on the chips), ported from the design seed.
const CAT_DEFS = {
    'AI_Literacies': 'Kompetenzen, um KI-Systeme zu verstehen, zu nutzen und kritisch zu reflektieren.',
    'Generative_KI': 'Generative KI / LLMs, die Text, Bild oder Code erzeugen (ChatGPT, Claude, Gemini).',
    'Prompting': 'Gestaltung, Engineering oder Untersuchung von Prompts als Schnittstelle zu generativen Modellen.',
    'KI_Sonstige': 'Andere KI/ML-Verfahren: Klassifikatoren, Empfehlungssysteme, Computer Vision.',
    'Soziale_Arbeit': 'Soziale Arbeit als Profession, Praxis, Ausbildung oder Institution.',
    'Bias_Ungleichheit': 'Bias, Ungleichheit oder Diskriminierung, durch soziotechnische Systeme erzeugt oder verstärkt.',
    'Gender': 'Gender als analytische Kategorie: geschlechtsbezogene Effekte, Repräsentation, Identität.',
    'Diversitaet': 'Diversität jenseits von Gender: Race, Klasse, Behinderung, Migration.',
    'Feministisch': 'Explizit feministische Theorie, Epistemologie oder Methodologie.',
    'Fairness': 'Fairness, Gerechtigkeit oder Equity als normatives Kriterium für Systeme.'
};

const EXCLUSION_REASONS = ['Duplicate', 'Not_relevant_topic', 'Wrong_publication_type', 'No_full_text', 'Language'];

const MODEL_DEFAULT = {
    name: 'Claude Haiku 4.5', id: 'claude-haiku-4-5', date: '2026-03-15',
    prompt: 'v2.1', temperature: '0.0', maxTokens: '1024', threshold: '0.5'
};

// PRISMA-trAIce 17 items (Holst et al. 2025, JMIR AI; abridged verbatim). 14 non-optional, 3 optional.
const TRAICE = [
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

const LS_KEY = 'femprompt-prisma-state/0.2';
const REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.2'; // bumped for the evidence map (FR-13)
const SEED = 'seed'; // built-in reviewer = the existing expert assessment (paper.human)

// State

const state = {
    surface: 'screening',
    reviewer: 'reviewer1', // who is editing; drives the per-reviewer file name
    perspective: SEED,     // whose decisions drive Flow/Agreement (default: seed = benchmark)
    index: 0,
    readMode: 'full',      // reading column layer: 'full' (paper text) or 'ai' (machine extraction)
    reviewers: {},         // reviewerKey -> { paperId -> decision }
    checklist: {},
    disclosure: {}
};

let papers = [];
let dirHandle = null;          // connected File System Access directory handle
let corpusIndex = null;        // id -> { t, ay, kd, src, n, x } for corpus full-text search
let corpusIndexPromise = null;
let corpusQuery = '';          // current corpus-wide search (left pane)
const textCache = {};            // paperId -> raw knowledge-doc markdown (or null)
const fullTextCache = {};        // paperId -> cleaned Docling full text (or null)
let fulltextManifest = null;     // id -> { src, chars }; null until loaded, {} if absent
// Analysis coding vocabulary (FR-14, ADR-026): the frozen categories.yaml v1.3
// analysis_fields block, served as docs/data/analysis_fields.json (built by
// src/publish/build_analysis_fields.py). anFields is the single source the panel's
// closed selections read from; there is no hand-kept second list in this file.
let anFields = [];               // [ { name, multi, values[, optional, binding_when, free_text] } ]
let anStudyTypes = [];
let anVocabVersion = '';
let docHtmlCurrent = '';       // rendered HTML of the active layer (for re-highlight)
let docHtmlPaper = '';         // rendered paper layer (verbatim text)
let docHtmlAi = '';            // rendered AI-extraction layer (machine knowledge doc), '' when absent
let docMarks = [], docMarkIdx = 0;
let pendingInText = null;      // in-text query to apply once the document has loaded
let pinTerm = '', pinSnippet = '', pinOrigin = 'human'; // pinOrigin = source layer of the staged snippet
let pinReturnFocus = null, pinKeyHandler = null; // pin-menu dialog focus restore + keydown trap
let focusReadingOnRender = false; // move focus to the paper heading after a paper switch (a11y)
let editingPid = null; // a committed paper reopened for editing; its record stays until re-commit

// the in-progress (pre-commit) decision for the open paper
let work = { pid: null, cats: {}, override: false, reason: null, overrideReason: null, evidence: {} };

function curDec() {
    if (!state.reviewers[state.reviewer]) state.reviewers[state.reviewer] = {};
    return state.reviewers[state.reviewer];
}

function resetWork(p) { work = { pid: p.id, cats: {}, override: false, reason: null, overrideReason: null, evidence: {} }; }

// Persistence: localStorage cache + File System Access (repo files)

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
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return;
        const o = JSON.parse(raw);
        if (o.config) {
            if (o.config.reviewer) state.reviewer = o.config.reviewer;
            if (o.config.perspective) state.perspective = o.config.perspective;
            if (o.config.disclosure) state.disclosure = o.config.disclosure;
        }
        state.reviewers = o.reviewers || {};
        state.checklist = o.checklist || {};
    } catch (e) { console.warn('[PRISMA] local load failed:', e.message); }
}

let writeChain = Promise.resolve();
function save() {
    saveLocal();
    // serialize repo writes so rapid screening cannot overlap createWritable on the same file
    if (dirHandle) writeChain = writeChain.then(writeCurrentReviewer).catch(function(e) { console.warn('[PRISMA] repo write failed:', e); });
}

function reviewerPayload(key) {
    return { schema: REVIEWER_SCHEMA, reviewer: key,
             updated: new Date().toISOString(), decisions: state.reviewers[key] || {} };
}

// Deterministic on-disk form of a reviewer file: decisions sorted by paper id so a
// git diff shows exactly which decisions changed and git blame attributes each to
// its commit (the Git-provenance model, ADR-021). The in-memory shape is untouched;
// only the serialized file is ordered.
function sortedDecisions(d) {
    const out = {};
    Object.keys(d || {}).sort().forEach(function(k) { out[k] = d[k]; });
    return out;
}
function reviewerFileText(key) {
    const pl = reviewerPayload(key);
    pl.decisions = sortedDecisions(pl.decisions);
    return JSON.stringify(pl, null, 2);
}

// A paste-ready commit message summarizing the current session, so the reviewer's
// commit documents the work and the commit author carries the provenance (ADR-021).
function commitMessage() {
    const d = curDec();
    const ids = Object.keys(d);
    let incl = 0, excl = 0;
    const reasons = {};
    ids.forEach(function(id) {
        if (d[id].decision === 'Include') incl++; else excl++;
        const r = d[id].reason;
        if (r) reasons[r] = (reasons[r] || 0) + 1;
    });
    const lines = ['screening: ' + ids.length + ' Paper bewertet (' + incl + ' Include, ' + excl + ' Exclude)', ''];
    lines.push('Reviewer-Datei: ' + state.reviewer + '.json');
    const rk = Object.keys(reasons).sort();
    if (rk.length) lines.push('Ausschlussgründe: ' + rk.map(function(r) { return r.replace(/_/g, ' ') + ' ' + reasons[r]; }).join(', '));
    return lines.join('\n');
}

// --- IndexedDB: persist the directory handle so reconnect is one click ---
function idb() {
    return new Promise(function(res, rej) {
        let r = indexedDB.open('femprompt-prisma', 1);
        r.onupgradeneeded = function() { r.result.createObjectStore('handles'); };
        r.onsuccess = function() { res(r.result); };
        r.onerror = function() { rej(r.error); };
    });
}
function idbSet(k, v) {
    return idb().then(function(db) { return new Promise(function(res, rej) {
        let t = db.transaction('handles', 'readwrite'); t.objectStore('handles').put(v, k);
        t.oncomplete = function() { res(); }; t.onerror = function() { rej(t.error); };
    }); });
}
function idbGet(k) {
    return idb().then(function(db) { return new Promise(function(res, rej) {
        let t = db.transaction('handles', 'readonly'); const rq = t.objectStore('handles').get(k);
        rq.onsuccess = function() { res(rq.result); }; rq.onerror = function() { rej(rq.error); };
    }); });
}

async function connectRepo() {
    if (!FS_SUPPORTED) { alert('Dieser Browser schreibt nicht direkt auf die Platte. Nutze Export/Import (Firefox/Safari).'); return; }
    try {
        let handle = await window.showDirectoryPicker({ mode: 'readwrite' });
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
        let handle = await idbGet('dir');
        if (!handle) { alert('Kein gespeicherter Ordner. Erst "Mit Repo-Ordner verbinden".'); return; }
        const perm = await handle.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') { alert('Schreibrecht nicht erteilt.'); return; }
        dirHandle = handle;
        await loadAllReviewers();
        updateConnStatus();
        showSurface(state.surface);
    } catch (e) { console.warn('[PRISMA] reconnect failed:', e); }
}

async function loadAllReviewers() {
    if (!dirHandle) return;
    const found = {};
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && /\.json$/.test(entry.name)) {
            try {
                let f = await entry.getFile();
                let obj = JSON.parse(await f.text());
                let key = obj.reviewer || entry.name.replace(/\.json$/, '');
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
    const fh = await dirHandle.getFileHandle(state.reviewer + '.json', { create: true });
    const w = await fh.createWritable();
    await w.write(reviewerFileText(state.reviewer));
    await w.close();
    return true;
}

function updateConnStatus() {
    let el = document.getElementById('pt-conn-status');
    if (!el) return;
    if (dirHandle) { el.textContent = 'verbunden, schreibt ' + state.reviewer + '.json'; el.classList.add('connected'); }
    else { el.textContent = FS_SUPPORTED ? '' : 'Browser ohne Direktschreiben (Export nutzen)'; el.classList.remove('connected'); }
}

// Corpus full-text index (FR-12 corpus search) + document fetch (FR-11)

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

// The Docling full texts live in docs/data/fulltext/ (gitignored, local clone only, mostly
// copyrighted). The manifest says which papers have one, so abstract-only papers show that
// state and no 404 is fired for them.
function loadFulltextManifest() {
    if (fulltextManifest !== null) return Promise.resolve(fulltextManifest);
    return fetch('data/fulltext_manifest.json')
        .then(function(r) { return r.ok ? r.json() : {}; })
        .then(function(d) { fulltextManifest = d || {}; return fulltextManifest; })
        .catch(function() { fulltextManifest = {}; return fulltextManifest; });
}

function hasFullText(p) {
    return !!(fulltextManifest && fulltextManifest[p.id] && fulltextManifest[p.id].src !== 'none');
}

function fetchFullText(p) {
    if (fullTextCache[p.id] !== undefined) return Promise.resolve(fullTextCache[p.id]);
    if (fulltextManifest && !hasFullText(p)) { fullTextCache[p.id] = null; return Promise.resolve(null); }
    return fetch('data/fulltext/' + encodeURIComponent(p.id) + '.md')
        .then(function(r) { return r.ok ? r.text() : null; })
        .then(function(t) { fullTextCache[p.id] = t; return t; })
        .catch(function() { fullTextCache[p.id] = null; return null; });
}

function countOcc(hay, needle) {
    if (!needle) return 0;
    let n = 0, pos = 0, idx;
    while ((idx = hay.indexOf(needle, pos)) !== -1) { n++; pos = idx + needle.length; }
    return n;
}

// Analysis coding vocabulary (FR-14, ADR-026) --------------------------------
// The static app cannot read the YAML, so a committed build step emits it as JSON
// (the single-source rule of ADR-026). Loaded once at init like the full-text
// manifest; the headless harness injects window.__ANALYSIS_FIELDS__ instead.
function applyAnalysisVocab(d) {
    if (!d) return;
    anFields = Array.isArray(d.fields) ? d.fields : [];
    anStudyTypes = Array.isArray(d.study_types) ? d.study_types : [];
    anVocabVersion = d.version || '';
}
function loadAnalysisFields() {
    if (window.__ANALYSIS_FIELDS__) { applyAnalysisVocab(window.__ANALYSIS_FIELDS__); return Promise.resolve(anFields); }
    if (anFields.length) return Promise.resolve(anFields);
    return fetch('data/analysis_fields.json')
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(d) { applyAnalysisVocab(d); return anFields; })
        .catch(function(e) { console.warn('[PRISMA] analysis fields load failed:', e.message); return anFields; });
}
function anField(name) { for (let i = 0; i < anFields.length; i++) if (anFields[i].name === name) return anFields[i]; return null; }
function anVocab(name) { const f = anField(name); return (f && f.values) || []; }
function anCodedFields() { return anFields.filter(function(f) { return !f.free_text; }); }

// The AN_ fields the coder fills, in capture order (AN_Prompting_Role first,
// coding-concept sec. 3): that is already the order of the frozen block.
function anFieldNames() { return anFields.map(function(f) { return f.name; }); }

// Read the analysis sub-object off a decision record, tolerating a legacy record
// with no analysis part (backward compatible): missing reads as empty.
function readAnalysis(dec) {
    const a = (dec && dec.analysis) || {};
    return { fields: a.fields || {}, undecidable: a.undecidable || {} };
}

// Keep only values in the frozen vocabulary; a multi field becomes a sorted,
// de-duplicated array, a single field a single valid string, free text verbatim.
// This is the enforcement point: no value outside categories.yaml v1.3 survives,
// on capture, import, or export. Unknown fields and undecidable toggles on
// unknown fields are dropped.
function sanitizeAnalysis(raw) {
    raw = raw || {};
    const inF = raw.fields || {}, inU = raw.undecidable || {};
    const outF = {}, outU = {};
    anFields.forEach(function(f) {
        const v = inF[f.name];
        if (f.free_text) {
            if (v != null && String(v).trim() !== '') outF[f.name] = String(v);
            return;
        }
        const vocab = f.values || [];
        if (f.multi) {
            const arr = (Array.isArray(v) ? v : (v != null ? [v] : []))
                .filter(function(x) { return vocab.indexOf(x) !== -1; });
            const uniq = arr.filter(function(x, i) { return arr.indexOf(x) === i; }).sort();
            if (uniq.length) outF[f.name] = uniq;
        } else {
            if (vocab.indexOf(v) !== -1) outF[f.name] = v;
        }
        if (inU[f.name]) outU[f.name] = true;
    });
    // Studientyp travels with the analysis capture (required for Include,
    // update-protocol D); its closed list is study_types from the same YAML source.
    // Same strictness as the AN_ fields; no undecidable toggle, its vocabulary
    // carries Unclear itself.
    if (anStudyTypes.indexOf(inF.Studientyp) !== -1) outF.Studientyp = inF.Studientyp;
    return { fields: outF, undecidable: outU };
}

// Store the coder's analysis on the committed Include record, sanitized. This is
// the only writer of the analysis sub-object; it never touches the binding
// screening fields (categories, decision, override, reason, evidence), so the
// screening record stays byte-identical (the HARD boundary of FR-14).
function setAnalysis(pid, raw) {
    const rec = curDec()[pid];
    if (!rec || rec.decision !== 'Include') return;
    rec.analysis = sanitizeAnalysis(raw);
    save();
}

// The AN_Notes export value: the free note plus one machine-countable line per
// nicht-entscheidbar field, "Feldname: nicht entscheidbar aus <Basis>"
// (update-protocol C). No new vocabulary code is introduced; the frozen schema
// stays untouched.
function analysisNotes(analysis) {
    const a = analysis || {}, f = a.fields || {}, u = a.undecidable || {};
    const basis = f.AN_Coding_Basis || 'unbekannt';
    const lines = [];
    const note = (f.AN_Notes || '').trim();
    if (note) lines.push(note);
    anCodedFields().forEach(function(fd) {
        if (u[fd.name]) lines.push(fd.name + ': nicht entscheidbar aus ' + basis);
    });
    return lines.join('\n');
}

// AN_Harm_Types is optional and only binding where the basis is Fulltext
// (B.1 point 3). This is a soft hint, never a hard gate: an Include with an empty
// Harm_Types is never blocked.
function harmTypesHint(analysis) {
    const f = (analysis && analysis.fields) || {};
    if (f.AN_Coding_Basis !== 'Fulltext') return '';
    if ((f.AN_Harm_Types || []).length) return '';
    return 'Bei Volltext-Basis ist AN_Harm_Types erwartet (B.1 Punkt 3). Leer lassen nur, wenn kein Harm-Mechanismus benannt ist, oder als nicht entscheidbar markieren.';
}

// Split a served knowledge document into its two epistemic layers (M3, ADR-016).
// Every served doc concatenates a paper layer (Abstract, Key Concepts, Full Text)
// and a machine-extraction layer that starts at "## Kernbefund" (Forschungsfrage,
// Methodik, Kategorie-Evidenz, ...). The boundary is the first Kernbefund heading,
// pulled up over a repeated H1 title that heads the extraction. A doc without that
// heading (abstract-only fallback) has no AI layer.
function splitDocLayers(md) {
    let lines = (md || '').split(/\r?\n/);
    let b = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^##\s+Kernbefund\b/.test(lines[i])) { b = i; break; }
    }
    if (b === -1) return { paper: md || '', ai: '' };
    let s = b, k = b - 1;
    while (k >= 0 && /^\s*$/.test(lines[k])) k--;
    if (k >= 0 && /^#\s+/.test(lines[k])) s = k;
    return { paper: lines.slice(0, s).join('\n'), ai: lines.slice(s).join('\n') };
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
    let lines = md.split(/\r?\n/);
    let out = [], i = 0, inList = false;
    function closeList() { if (inList) { out.push('</ul>'); inList = false; } }
    while (i < lines.length) {
        const ln = lines[i];
        if (/^---\s*$/.test(ln)) {
            // skip an embedded yaml block (the note repeats a frontmatter inside "## Full Text")
            let k = i + 1;
            while (k < lines.length && !/^---\s*$/.test(lines[k])) k++;
            if (k < lines.length && k > i + 1) {
                const block = lines.slice(i + 1, k);
                const yamlish = block.every(function(b) {
                    return b.trim() === '' || /^[A-Za-z_][\w "'().\/:-]*:/.test(b) || /^-\s/.test(b);
                });
                if (yamlish) { i = k + 1; continue; }
            }
            closeList(); out.push('<hr class="pt-doc-hr">'); i++; continue;
        }
        if (/^\s*$/.test(ln)) { closeList(); i++; continue; }
        const hm = ln.match(/^(#{1,6})\s+(.*)$/);
        if (hm) { closeList(); const lvl = Math.min(hm[1].length, 4); out.push('<h' + lvl + ' class="pt-doc-h' + lvl + '">' + inlineMd(hm[2]) + '</h' + lvl + '>'); i++; continue; }
        const lm = ln.match(/^\s*[-*]\s+(.*)$/);
        if (lm) { if (!inList) { out.push('<ul class="pt-doc-ul">'); inList = true; } out.push('<li>' + inlineMd(lm[1]) + '</li>'); i++; continue; }
        const bm = ln.match(/^>\s?(.*)$/);
        if (bm) { closeList(); out.push('<blockquote class="pt-doc-q">' + inlineMd(bm[1]) + '</blockquote>'); i++; continue; }
        closeList();
        const para = [ln]; i++;
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
               !/^\s*[-*]\s/.test(lines[i]) && !/^---\s*$/.test(lines[i]) && !/^>\s?/.test(lines[i])) { para.push(lines[i]); i++; }
        out.push('<p class="pt-doc-p">' + inlineMd(para.join(' ')) + '</p>');
    }
    closeList();
    return out.join('');
}

// Init

window.initializePrisma = function() {
    if (initialized) return;
    initialized = true;
    EC = window.EC;
    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    loadLocal();
    normalizeSurface();
    state.index = firstEntryIndex(); // O4: open on a screenable paper, not on boilerplate
    loadCorpusIndex(); // background: ready by the time the user runs a corpus search
    loadFulltextManifest(); // background: full-text availability for the reading pane
    loadAnalysisFields().then(function() { // background: the frozen AN_ vocabulary for the Include analysis panel (FR-14)
        if (initialized && state.surface === 'screening') refreshAssess();
    });
    renderShell();
    showSurface(state.surface || 'screening');
    updateConnStatus();
    console.log('[PRISMA] initialized, ' + papers.length + ' papers, FS ' + (FS_SUPPORTED ? 'supported' : 'fallback'));
};

// The tool is one workspace; the record and data functions open as panels, never
// as a persisted surface, so load always lands on screening (ADR-020).
function normalizeSurface() {
    state.surface = 'screening';
}

// Shell + sub-navigation

function renderShell() {
    const root = document.getElementById('prisma-root');
    if (!root) return;
    let html = '<div class="pt-wsbar-top"><span class="pt-wsbar-title">Screening</span></div>';
    html += '<div class="pt-surface" id="pt-surface"></div>';
    html += '<div class="pt-overlay" id="pt-overlay" hidden>' +
        '<div class="pt-overlay-backdrop"></div>' +
        '<div class="pt-overlay-panel" role="dialog" aria-modal="true" aria-labelledby="pt-overlay-title" tabindex="-1">' +
        '<div class="pt-overlay-head"><span class="pt-overlay-title" id="pt-overlay-title"></span>' +
        '<button class="pt-overlay-x" id="pt-overlay-x" type="button" aria-label="Schließen">&times;</button></div>' +
        '<div class="pt-overlay-body" id="pt-overlay-body"></div></div></div>';
    root.innerHTML = html;
    root.querySelector('.pt-overlay-backdrop').addEventListener('click', closePanel);
    root.querySelector('#pt-overlay-x').addEventListener('click', closePanel);
    document.addEventListener('keydown', function(e) {
        const ov = document.getElementById('pt-overlay');
        if (e.key === 'Escape' && ov && !ov.hidden) closePanel();
    });
}

// One workspace: 'screening' is the permanent surface; 'report' and 'data' open as
// on-demand panels (the record is a generated output, the data functions an edge
// affordance), ADR-020. showSurface keeps its name for the test hook and browser
// traces, and routes the two panel ids to the overlay.
function showSurface(name) {
    if (name === 'report' || name === 'data') { openPanel(name); return; }
    state.surface = 'screening'; saveLocal();
    renderScreening();
}

function surfaceEl() { return document.getElementById('pt-surface'); }

// --- on-demand panels (report, data) over the screening workspace (ADR-020) ---
let panelKind = null;
let panelReturnFocus = null;

function openPanel(kind) {
    const ov = document.getElementById('pt-overlay'); if (!ov) return;
    panelKind = kind;
    panelReturnFocus = document.activeElement;
    const title = document.getElementById('pt-overlay-title');
    if (title) title.textContent = kind === 'report' ? 'PRISMA-Record' : 'Daten & Sync';
    renderPanel();
    ov.hidden = false;
    const panel = ov.querySelector('.pt-overlay-panel');
    if (panel && typeof panel.focus === 'function') panel.focus();
}

function renderPanel() {
    const body = document.getElementById('pt-overlay-body'); if (!body) return;
    if (panelKind === 'report') renderReportSurface(body);
    else if (panelKind === 'data') renderData(body);
}

function closePanel() {
    const ov = document.getElementById('pt-overlay'); if (ov) ov.hidden = true;
    panelKind = null;
    if (panelReturnFocus && typeof panelReturnFocus.focus === 'function') panelReturnFocus.focus();
    panelReturnFocus = null;
}

// Decision helpers

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
    let d = state.reviewers[persp] && state.reviewers[persp][paper.id];
    return d ? { decision: d.decision, categories: d.categories || {}, reason: d.reason, source: persp } : null;
}

function seedDecision(paper) {
    if (paper.human && paper.human.decision)
        return { decision: paper.human.decision, categories: paper.human.all_categories || {} };
    return null;
}

// Categories are three-level (nein/teilweise/ja = 0/1/2). Legacy boolean and a pinned
// human Beleg coerce to ja; anything falsy is nein.
const CAT_STATE = ['nein', 'teilweise', 'ja'];
function catLevel(v) { return v === true || v === 2 ? 2 : (v === 1 ? 1 : 0); }
function dimLevel(keys, cats) {
    return keys.reduce(function(m, c) { const l = catLevel(cats[c]); return l > m ? l : m; }, 0);
}
function decCls(d) { return d === 'Include' ? 'include' : (d === 'Unclear' ? 'unclear' : 'exclude'); }

// The three levels map to a three-way derived decision: both dimensions with a "ja" ->
// Include; both at least "teilweise" but not both "ja" -> Unclear; any dimension entirely
// "nein" -> Exclude (ADR: three-level screening).
function deriveDecision(cats) {
    const tech = dimLevel(TECH_CATS, cats);
    const soc = dimLevel(SOCIAL_CATS, cats);
    if (Math.min(tech, soc) === 0) return 'Exclude';
    if (tech === 2 && soc === 2) return 'Include';
    return 'Unclear';
}

// The human decision is binding (RAISE P1/P2); the AND-rule only derives a default.
// override flips the derived decision either way: Include->Exclude, or Exclude->Include,
// the latter requiring a recorded justification at commit (RAISE P3, ADR-023).
function finalDecisionOf(cats, override) {
    const derived = deriveDecision(cats);
    return override ? (derived === 'Include' ? 'Exclude' : 'Include') : derived;
}

function divergent(h, a) { return h && a && h.decision !== a.decision; }

function abstractQuality(p) {
    let a = (p.abstract || '').trim();
    if (!a) return { ok: false, note: 'Kein Abstract vorhanden, bitte Volltext (Wissensdokument) oder Quelle prüfen.' };
    if (/National Bureau of Economic Research|Founded in 1920, the NBER|private, non-profit, non-partisan organization/i.test(a))
        return { ok: false, note: 'Wirkt wie Verlags-Boilerplate (NBER), nicht das Paper-Abstract.' };
    if (a.length < 120) return { ok: false, note: 'Sehr kurzes Abstract, evtl. unvollständig.' };
    return { ok: true };
}

// A paper is screenable when there is substantive text to ground a decision on:
// a served knowledge document, or an abstract that is not boilerplate. The tool
// opens on the first such (unscreened) paper rather than on the corpus's first
// record when that is publisher boilerplate (browser-agent O4 finding: default
// entry landed on paper 1, an NBER boilerplate with no usable text).
function isScreenable(p) {
    return !!(p && (p.knowledge_doc || abstractQuality(p).ok));
}

function firstEntryIndex() {
    const d = curDec();
    for (let i = 0; i < papers.length; i++) { if (!d[papers[i].id] && isScreenable(papers[i])) return i; }
    for (let i = 0; i < papers.length; i++) { if (isScreenable(papers[i])) return i; }
    return 0;
}

// Counts human Belege only; AI-origin evidence (pinned from the KI-Extraktion
// reading layer, ADR-016) is advisory and excluded from the count.
function evidenceCount(rec) {
    if (!rec || !rec.evidence) return 0;
    return ALL_CATS.reduce(function(s, c) {
        return s + (rec.evidence[c] || []).filter(function(ev) { return (ev.origin || 'human') !== 'ai'; }).length;
    }, 0);
}

// Aggregation (computed quietly for the report layer)

// The human-AI agreement metrics (computeMatrix, cohenKappa, kappaLabel) were
// removed with ADR-017: the tool computed kappa over its own loaded corpus, a
// different set from the benchmark CSVs, so an in-tool number could only diverge
// from the data. Agreement lives in the benchmark data and the Evidence Companion,
// not in this tool. The disclosure keeps M9/R2 by reference. computeFlow stays:
// the flow diagram needs the per-track counts.

function computeFlow(persp) {
    let f = { total: papers.length, aiScreened: 0, aiIncl: 0, aiExcl: 0,
              humanScreened: 0, humanIncl: 0, humanExcl: 0, humanReasons: {} };
    papers.forEach(function(p) {
        let a = aiProposal(p), h = humanDecision(p, persp);
        if (a) { f.aiScreened++; if (a.decision === 'Include') f.aiIncl++; else f.aiExcl++; }
        if (h) {
            f.humanScreened++;
            if (h.decision === 'Include') f.humanIncl++; else f.humanExcl++;
            if (h.decision === 'Exclude' && h.reason) f.humanReasons[h.reason] = (f.humanReasons[h.reason] || 0) + 1;
        }
    });
    return f;
}

function reviewerLabel(k) { return k === SEED ? 'Seed (Expert:innen)' : k; }

// Surface: Screening (read + search + pin evidence)

function renderScreening() {
    let el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper geladen.</p>'; return; }
    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;

    let p = papers[state.index];
    if (editingPid && editingPid !== p.id) editingPid = null; // navigating away abandons the edit; the record stays
    const dec = editingPid === p.id ? null : curDec()[p.id]; // while editing, render the form, not the locked record
    if (!dec && work.pid !== p.id) resetWork(p);

    const screened = Object.keys(curDec()).length;
    const pct = papers.length ? Math.round(screened / papers.length * 100) : 0;

    let html = '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos">Paper ' + (state.index + 1) + ' / ' + papers.length + '</span>';
    html += '<span class="pt-ws-progressbar"><span class="pt-ws-progressfill" style="width:' + pct + '%"></span></span>';
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

    // keyboard flow: after a paper switch (corpus pick, next-open), move focus to the
    // paper heading so the reader does not lose its place to document body (a11y).
    if (focusReadingOnRender) {
        focusReadingOnRender = false;
        const title = document.getElementById('pt-paper-title');
        if (title && typeof title.focus === 'function') title.focus();
    }
}

// ---- left: corpus navigator with full-text search ----
function corpusHtml() {
    let d = curDec();
    let h = '<aside class="pt-nav"><div class="pt-nav-head"><span class="pt-nav-title-main">Korpus</span>' +
        '<span class="pt-tag-mono">' + Object.keys(d).length + ' / ' + papers.length + '</span></div>';
    h += '<div class="pt-corpus-search"><input id="pt-corpus-q" aria-label="Volltext-Suche über alle Paper" placeholder="Volltext-Suche über alle Paper" value="' + EC.escapeHtml(corpusQuery) + '">' +
        '<span class="pt-corpus-hint" id="pt-corpus-hint"></span></div>';
    h += '<div class="pt-nav-list" id="pt-corpus-list">' + corpusListHtml() + '</div></aside>';
    return h;
}

// Text equivalent for the colour-only status dot in the corpus list (a screen reader
// otherwise hears nothing for the decision state), browser-agent a11y finding.
function statusLabel(st) {
    return st === 'include' ? 'eingeschlossen' : st === 'exclude' ? 'ausgeschlossen' : st === 'unclear' ? 'unklar' : 'offen';
}

function corpusListHtml() {
    let d = curDec();
    let q = corpusQuery.trim().toLowerCase();
    let rows = papers, match = null;
    if (q) {
        if (!corpusIndex) return '<p class="pt-muted pt-corpus-empty">Such-Index lädt…</p>';
        match = {};
        rows = papers.filter(function(p) {
            let e = corpusIndex[p.id]; if (!e || !e.x) return false;
            let c = countOcc(e.x, q); if (c) { match[p.id] = c; return true; } return false;
        });
        if (!rows.length) return '<p class="pt-muted pt-corpus-empty">Keine Treffer für &bdquo;' + EC.escapeHtml(corpusQuery) + '&ldquo;.</p>';
    }
    return rows.map(function(p) {
        let i = papers.indexOf(p);
        let rec = d[p.id];
        let st = rec ? rec.decision.toLowerCase() : 'none';
        const badge = match ? '<span class="pt-hit-badge mono">' + match[p.id] + '</span>' : '';
        return '<button class="pt-nav-item' + (i === state.index ? ' active' : '') + '" data-i="' + i + '">' +
            '<span class="pt-nav-dot pt-dot-' + st + '" aria-hidden="true"></span>' +
            '<span class="pt-sr-only">' + statusLabel(st) + '</span>' +
            '<span class="pt-nav-text"><span class="pt-nav-t">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</span>' +
            '<span class="pt-nav-m mono">' + EC.escapeHtml(p.author_year || p.id) + '</span></span>' + badge + '</button>';
    }).join('');
}

function refreshCorpusList() {
    let list = document.getElementById('pt-corpus-list');
    if (list) { list.innerHTML = corpusListHtml(); bindCorpusItems(); }
    let hint = document.getElementById('pt-corpus-hint');
    if (hint) {
        let q = corpusQuery.trim();
        if (!q) hint.textContent = '';
        else if (!corpusIndex) hint.textContent = '';
        else hint.textContent = papers.filter(function(p) { const e = corpusIndex[p.id]; return e && e.x && e.x.indexOf(q.toLowerCase()) !== -1; }).length + ' Paper';
    }
}

function bindCorpusItems() {
    let list = document.getElementById('pt-corpus-list'); if (!list) return;
    list.querySelectorAll('.pt-nav-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.index = parseInt(btn.dataset.i, 10);
            if (corpusQuery.trim()) pendingInText = corpusQuery.trim(); // carry the term into the open paper
            focusReadingOnRender = true;
            renderScreening();
        });
    });
}

// ---- center: reading column (full text + in-text search) ----
function readingShellHtml(p, dec) {
    const aq = abstractQuality(p);
    let h = '<div class="pt-read pt-read-screen"><div class="pt-read-inner">';
    h += '<div class="pt-read-meta">';
    if (hasFullText(p)) h += '<span class="pt-pill pt-pill-ghost">Volltext</span>';
    else if (p.knowledge_doc) h += '<span class="pt-pill pt-pill-warn">nur Destillat</span>';
    else h += '<span class="pt-pill pt-pill-warn">nur Abstract</span>';
    if (dec) h += '<span class="pt-pill pt-pill-human pt-pill-right">erfasst</span>';
    h += '</div>';
    h += '<h1 class="pt-paper-title" id="pt-paper-title" tabindex="-1">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h1>';
    h += '<div class="pt-paper-authors">' + EC.escapeHtml(p.author_year || p.authors || '') +
        (p.journal ? ' &middot; <span class="pt-muted">' + EC.escapeHtml(p.journal) + '</span>' : '') + '</div>';
    if (!aq.ok && !p.knowledge_doc) h += '<div class="pt-aq-warn">Achtung: ' + EC.escapeHtml(aq.note) + '</div>';

    h += '<div class="pt-layer-toggle" id="pt-layer-toggle" hidden>' +
        '<button class="pt-layer-btn active" data-mode="full">Volltext</button>' +
        '<button class="pt-layer-btn" data-mode="ai">KI-Extraktion</button>' +
        '</div>';
    h += '<div class="pt-intext-bar">' +
        '<input id="pt-intext" aria-label="Im Text suchen" placeholder="Im Text suchen (Enter = nächster Treffer)">' +
        '<span class="pt-tag-mono" id="pt-intext-count"></span>' +
        '<button class="pt-intext-nav" id="pt-intext-prev" title="vorheriger Treffer">&lsaquo;</button>' +
        '<button class="pt-intext-nav" id="pt-intext-next" title="nächster Treffer">&rsaquo;</button>' +
        '<button class="pt-btn pt-pin-hit" id="pt-pin-hit" disabled title="Aktuellen Treffer als Beleg anheften">Treffer anheften</button>' +
        '</div>';
    h += '<p class="pt-read-help">Text markieren und als Beleg an eine Kategorie anheften, oder einen Treffer der Suche anheften.</p>';
    h += '<div class="pt-layer-band" id="pt-layer-band" hidden>KI-Extraktion, nicht der Originaltext. Belege von hier gelten als KI und gehen nicht in den bindenden Record ein.</div>';
    h += '<div class="pt-doc" id="pt-doc"><p class="pt-muted">Volltext lädt…</p></div>';
    h += '</div></div>';
    return h;
}

// Two epistemic layers by source (M3, ADR-016): the human "Volltext" layer is the original
// Docling full text; the "KI-Extraktion" layer is the distillation from the knowledge doc.
function loadReadingInto(p) {
    let doc = document.getElementById('pt-doc'); if (!doc) return;
    Promise.all([fetchFullText(p), fetchPaperText(p)]).then(function(res) {
        const full = res[0], kdmd = res[1];
        docHtmlAi = kdmd ? renderMarkdown(splitDocLayers(kdmd).ai || '') : '';
        if (full && full.trim()) {
            docHtmlPaper = renderMarkdown(full);
        } else if (p.abstract && p.abstract.trim()) {
            docHtmlPaper = '<p class="pt-doc-p">' + inlineMd(p.abstract) + '</p>';
        } else {
            docHtmlPaper = '';
        }
        if (state.readMode === 'ai' && !docHtmlAi) state.readMode = 'full';
        updateLayerToggle();
        paintActiveLayer();
        docMarks = []; docMarkIdx = 0;
        if (pendingInText) {
            let box = document.getElementById('pt-intext');
            if (box) box.value = pendingInText;
            applyInText(pendingInText);
            pendingInText = null;
        }
    });
}

function activeLayerHtml() { return state.readMode === 'ai' ? docHtmlAi : docHtmlPaper; }

function paintActiveLayer() {
    let d = document.getElementById('pt-doc'); if (!d) return;
    docHtmlCurrent = activeLayerHtml();
    d.innerHTML = docHtmlCurrent || '<div class="pt-notext"><strong>Kein lesbarer Text.</strong> ' +
        'Für dieses Paper liegt weder Volltext noch Abstract vor. Eine am Text belegbare Bewertung ist hier nicht möglich; ' +
        'Quelle prüfen oder als No full text ausschließen.</div>';
    const band = document.getElementById('pt-layer-band');
    if (band) band.hidden = !(state.readMode === 'ai' && docHtmlAi);
}

function updateLayerToggle() {
    const tg = document.getElementById('pt-layer-toggle');
    if (tg) tg.hidden = !docHtmlAi; // the toggle only appears when a paper has an AI layer
    document.querySelectorAll('.pt-layer-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.mode === state.readMode);
    });
}

function setReadMode(mode) {
    if (mode === 'ai' && !docHtmlAi) return;
    if (mode !== 'ai') mode = 'full';
    state.readMode = mode; saveLocal();
    updateLayerToggle();
    paintActiveLayer();
    docMarks = []; docMarkIdx = 0;
    let box = document.getElementById('pt-intext');
    let cnt = document.getElementById('pt-intext-count');
    if (box && box.value.trim()) applyInText(box.value);
    else if (cnt) cnt.textContent = '';
    let pinBtn = document.getElementById('pt-pin-hit');
    if (pinBtn && (!box || !box.value.trim())) pinBtn.disabled = true;
}

function applyInText(q) {
    let doc = document.getElementById('pt-doc'); if (!doc) return;
    doc.innerHTML = docHtmlCurrent || '<p class="pt-muted">Kein Text.</p>';
    docMarks = []; docMarkIdx = 0;
    let cnt = document.getElementById('pt-intext-count');
    let pinBtn = document.getElementById('pt-pin-hit');
    q = (q || '').trim();
    if (q.length < 2) { if (cnt) cnt.textContent = ''; if (pinBtn) pinBtn.disabled = true; return; }
    const ql = q.toLowerCase();
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null);
    let nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function(node) {
        let text = node.nodeValue, lower = text.toLowerCase();
        if (lower.indexOf(ql) === -1) return;
        let frag = document.createDocumentFragment(), pos = 0, idx;
        while ((idx = lower.indexOf(ql, pos)) !== -1) {
            if (idx > pos) frag.appendChild(document.createTextNode(text.slice(pos, idx)));
            const mk = document.createElement('mark'); mk.className = 'pt-hit'; mk.textContent = text.slice(idx, idx + ql.length);
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
    let m = docMarks[docMarkIdx];
    m.classList.add('active');
    if (typeof m.scrollIntoView === 'function') m.scrollIntoView({ block: 'center' });
    let cnt = document.getElementById('pt-intext-count');
    if (cnt) cnt.textContent = (docMarkIdx + 1) + '/' + docMarks.length;
}

function snippetAround(el, term) {
    const ctx = el && el.parentNode ? (el.parentNode.textContent || '') : term;
    let i = ctx.toLowerCase().indexOf(term.toLowerCase());
    if (i === -1) return term;
    let start = Math.max(0, i - 90), end = Math.min(ctx.length, i + term.length + 90);
    return (start > 0 ? '…' : '') + ctx.slice(start, end).trim() + (end < ctx.length ? '…' : '');
}

// ---- evidence pinning (FR-13) ----
// Each Beleg records the source layer it came from (origin: 'human' or 'ai',
// M3/ADR-016). A snippet taken from the verbatim paper layer is 'human' and
// sets the binding category; a snippet taken from the AI-extraction layer is
// 'ai', is shown marked KI, and never sets work.cats, so AI-sourced text can
// never flip the binding human decision. origin defaults to 'human' for legacy
// and three-argument calls.
function pinEvidence(cat, term, snippet, origin) {
    origin = origin === 'ai' ? 'ai' : 'human';
    term = (term || '').trim().slice(0, 80);
    snippet = (snippet || term).trim().slice(0, 260);
    if (!term) return;
    if (!work.evidence[cat]) work.evidence[cat] = [];
    work.evidence[cat].push({ term: term, snippet: snippet, ts: new Date().toISOString(), origin: origin });
    if (origin === 'human') work.cats[cat] = true; // only a paper-sourced Beleg enters the binding record
    refreshAssess();
}

function unpinEvidence(cat, idx) {
    if (work.evidence[cat]) {
        work.evidence[cat].splice(idx, 1);
        if (!work.evidence[cat].length) delete work.evidence[cat];
    }
    refreshAssess();
}

// The existing annotations on a paper, shown as reference (never binding): the expert seed
// decision with its set categories, and a Mensch/KI divergence badge from the benchmark.
// These are the binary track (human all_categories, benchmark.agreement); the reviewer's own
// three-level input is separate.
function seedRefHtml(p) {
    const seed = seedDecision(p);
    if (!seed) return '';
    const setCats = ALL_CATS.filter(function(c) { return seed.categories[c]; });
    let h = '<div class="pt-seed-ref">Seed-Bewertung (Expert:innen): <strong class="pt-dec-' +
        seed.decision.toLowerCase() + '">' + seed.decision + '</strong>. Du entscheidest unabhängig.';
    if (setCats.length) h += '<div class="pt-seed-cats">' + setCats.map(function(c) {
        return '<span class="pt-pill pt-pill-human">' + EC.escapeHtml(CAT_LABELS[c]) + '</span>';
    }).join('') + '</div>';
    const bm = p.benchmark;
    if (bm && bm.agreement === 'disagree') {
        const aff = (bm.affected_categories || []).map(function(c) { return CAT_LABELS[c] || c; });
        h += '<div class="pt-diverg"><span class="pt-pill pt-pill-warn">Divergenz Mensch/KI</span>' +
            (aff.length ? '<span class="pt-muted">' + EC.escapeHtml(aff.join(', ')) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
}

// ---- right: assessment (categories + evidence + derived decision + collapsed AI) ----
function assessInnerHtml(p, dec) {
    if (dec) return assessLockedHtml(p, dec);
    let cats = work.cats;
    let h = '<div class="pt-rail-head"><span class="pt-rail-title">Deine Bewertung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-human">bindend</span></div>';
    h += '<div class="pt-rail-body">';
    h += seedRefHtml(p);
    h += dimHtml('Gegenstand', TECH_CATS, cats, false);
    h += dimHtml('Perspektive', SOCIAL_CATS, cats, false);
    h += evidenceListHtml(work.evidence, false);
    h += '<div class="pt-logic" id="pt-logic">' + logicInner(cats, work.override) + '</div>';
    const showReason = finalDecisionOf(cats, work.override) === 'Exclude';
    h += '<div class="pt-reason-block" id="pt-reason-block" style="display:' + (showReason ? 'block' : 'none') + ';">';
    h += '<div class="pt-tag-mono pt-reason-label">Ausschlussgrund &middot; erforderlich</div><div class="pt-reason-chips">';
    EXCLUSION_REASONS.forEach(function(r) {
        h += '<button class="pt-reason-chip' + (work.reason === r ? ' sel' : '') + '" data-reason="' + r + '"' +
            ' aria-pressed="' + (work.reason === r ? 'true' : 'false') + '">' + r.replace(/_/g, ' ') + '</button>';
    });
    h += '</div></div>';
    const showOverrideJust = work.override && finalDecisionOf(cats, work.override) === 'Include';
    h += '<div class="pt-override-block" id="pt-override-block" style="display:' + (showOverrideJust ? 'block' : 'none') + ';">';
    h += '<div class="pt-tag-mono pt-override-label">Begruendung Override zu Include &middot; erforderlich</div>';
    h += '<textarea id="pt-override-reason" class="pt-override-input" rows="2" placeholder="Warum einschliessen, obwohl die Regel auf Exclude steht? Wird im Record dokumentiert.">' + EC.escapeHtml(work.overrideReason || '') + '</textarea>';
    h += '</div>';
    h += '<div class="pt-actions">';
    h += '<button class="pt-record-btn" id="pt-record">Entscheidung erfassen (bindend)</button>';
    h += '<span class="pt-actions-hint" id="pt-actions-hint"></span>';
    h += '</div>';
    h += aiCollapsedHtml(p);
    h += '</div>';
    return h;
}

function assessLockedHtml(p, dec) {
    let cats = dec.categories || {};
    let h = '<div class="pt-rail-head"><span class="pt-rail-title">Deine Bewertung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-' + decCls(dec.decision) + ' pt-pill-lg">' + dec.decision + '</span></div>';
    h += '<div class="pt-rail-body">';
    if (dec.decision === 'Exclude' && dec.reason) h += '<div class="pt-seed-ref">Ausschlussgrund: <strong>' + EC.escapeHtml(dec.reason.replace(/_/g, ' ')) + '</strong></div>';
    if (dec.decision === 'Include' && dec.override && dec.override_reason) h += '<div class="pt-seed-ref">Override zu Include &middot; Begruendung: <strong>' + EC.escapeHtml(dec.override_reason) + '</strong></div>';
    h += dimHtml('Gegenstand', TECH_CATS, cats, true);
    h += dimHtml('Perspektive', SOCIAL_CATS, cats, true);
    h += evidenceListHtml(dec.evidence || {}, true);
    h += analysisPanelHtml(dec); // FR-14: analysis coding, inline, only on Include
    h += '<div class="pt-actions">';
    h += '<button class="pt-revise-btn" id="pt-revise">Überarbeiten</button><span class="pt-spacer"></span>';
    h += '<button class="pt-next-btn" id="pt-next">' + (state.index < papers.length - 1 ? 'Nächstes offen' : 'Zum ersten offenen') + ' &rarr;</button>';
    h += '</div>';
    h += aiCollapsedHtml(p);
    h += '</div>';
    return h;
}

function dimHtml(label, keys, cats, locked) {
    const lvl = dimLevel(keys, cats);
    const pillCls = lvl === 2 ? 'pt-pill-include' : (lvl === 1 ? 'pt-pill-warn' : 'pt-pill-ghost');
    let h = '<div class="pt-dim"><div class="pt-dim-head"><span class="pt-tag-mono">' + label + '</span>' +
        '<span class="pt-dim-rule"></span><span class="pt-pill pt-dim-pill ' + pillCls + '">' +
        (lvl ? CAT_STATE[lvl] : 'keine') + '</span></div><div class="pt-chips">';
    keys.forEach(function(c) { h += chipHtml(c, cats[c], locked); });
    h += '</div></div>';
    return h;
}

// A three-state cycling chip (nein -> teilweise -> ja -> nein). The accessible name is the
// visible label plus the current state ("AI Literacies, teilweise"); the slug and definition
// stay decorative in the hover tip. The native title is gone (it doubled the styled tip);
// the definition reaches assistive tech via aria-describedby to the tip.
function chipHtml(cat, level, locked) {
    const lvl = catLevel(level);
    const stateCls = lvl === 2 ? ' on' : (lvl === 1 ? ' partial' : '');
    const tipId = 'pt-chip-tip-' + cat;
    return '<button class="pt-chip' + stateCls + '" data-cat="' + cat + '" data-level="' + lvl + '"' +
        ' aria-label="' + EC.escapeHtml(CAT_LABELS[cat]) + ', ' + CAT_STATE[lvl] + '"' +
        ' aria-describedby="' + tipId + '"' + (locked ? ' disabled' : '') + '>' +
        '<span class="pt-chip-box" aria-hidden="true"></span>' + EC.escapeHtml(CAT_LABELS[cat]) +
        (lvl ? '<span class="pt-chip-state" aria-hidden="true">' + CAT_STATE[lvl] + '</span>' : '') +
        '<span class="pt-chip-tip" id="' + tipId + '"><b class="mono">' + cat + '</b><span>' + EC.escapeHtml(CAT_DEFS[cat] || '') + '</span></span></button>';
}

function evidenceListHtml(evidence, locked) {
    let cats = ALL_CATS.filter(function(c) { return (evidence[c] || []).length; });
    if (!cats.length) {
        return locked ? '' : '<div class="pt-evid pt-evid-empty"><span class="pt-tag-mono">Belege</span>' +
            '<p class="pt-muted">Noch keine Belege angeheftet. Markiere im Text die Stelle, die eine Kategorie trägt.</p></div>';
    }
    let h = '<div class="pt-evid"><span class="pt-tag-mono">Belege</span>';
    cats.forEach(function(c) {
        h += '<div class="pt-evid-cat"><div class="pt-evid-cat-h"><span class="pt-evid-dot" style="background:' +
            ((EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--pt-human)') + '"></span>' + EC.escapeHtml(CAT_LABELS[c]) + '</div>';
        (evidence[c] || []).forEach(function(ev, i) {
            let origin = ev.origin === 'ai' ? 'ai' : 'human'; // legacy Belege without origin are human pins
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

// ---- analysis coding panel (FR-14, ADR-026) ----
// Inline in the assessment column, beneath the decision block, and ONLY on a
// binding Include (including an override to Include). Human capture only; every
// value is a closed selection from the frozen vocabulary (anFields). The
// vocabulary pins evidence keep their Fundstelle in the evidence list above; this
// panel adds the descriptive analysis codes for the coding phase.
function analysisPanelHtml(dec) {
    if (!dec || dec.decision !== 'Include') return '';
    if (!anFields.length) {
        return '<div class="pt-anpanel"><div class="pt-anpanel-head"><span class="pt-tag-mono">Analyse-Codierung</span></div>' +
            '<p class="pt-muted">Analysefeld-Vokabular nicht geladen (docs/data/analysis_fields.json). ' +
            'Build ausführen: python src/publish/build_analysis_fields.py</p></div>';
    }
    const a = readAnalysis(dec), fv = a.fields, uv = a.undecidable;
    let h = '<div class="pt-anpanel"><div class="pt-anpanel-head">' +
        '<span class="pt-tag-mono">Analyse-Codierung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-human">nur Include</span></div>';
    h += '<p class="pt-anpanel-lead pt-muted">Geschlossene Auswahl aus categories.yaml v' + EC.escapeHtml(anVocabVersion) +
        '. Menschliche Erfassung, KI bleibt Vorschlag.</p>';

    // Studientyp is required for an Include (update-protocol D) and captured here as a
    // closed single select from study_types; no nicht-entscheidbar toggle, because its
    // vocabulary carries Unclear itself.
    h += anFieldHtml({ name: 'Studientyp', multi: false, values: anStudyTypes, no_undec: true }, fv.Studientyp, false);

    anFields.forEach(function(f) {
        h += anFieldHtml(f, fv[f.name], !!uv[f.name]);
    });

    const hint = harmTypesHint(a);
    if (hint) h += '<div class="pt-an-hint">' + EC.escapeHtml(hint) + '</div>';
    h += '</div>';
    return h;
}

function anFieldHtml(f, value, undecidable) {
    let h = '<div class="pt-an-field" data-an-field="' + f.name + '">';
    h += '<div class="pt-an-field-head"><span class="pt-an-label">' + EC.escapeHtml(f.name) + '</span>';
    if (f.optional) h += '<span class="pt-tag-mono pt-an-opt">optional</span>';
    h += '<span class="pt-spacer"></span>';
    if (!f.free_text && !f.no_undec) {
        h += '<label class="pt-an-undec"><input type="checkbox" data-an-undec="' + f.name + '"' +
            (undecidable ? ' checked' : '') + '> nicht entscheidbar</label>';
    }
    h += '</div>';

    if (f.free_text) {
        h += '<textarea class="pt-an-notes" data-an-free="' + f.name + '" rows="2" ' +
            'placeholder="Begründungen, Verbatim-Strategien; Nicht-Entscheidbarkeit wird beim Export angehängt.">' +
            EC.escapeHtml(value || '') + '</textarea>';
        h += '</div>';
        return h;
    }

    const sel = f.multi ? (Array.isArray(value) ? value : []) : (value ? [value] : []);
    h += '<div class="pt-an-opts' + (undecidable ? ' pt-an-dimmed' : '') + '">';
    (f.values || []).forEach(function(v) {
        const on = sel.indexOf(v) !== -1;
        h += '<button type="button" class="pt-an-opt' + (on ? ' sel' : '') + '"' +
            ' data-an-field="' + f.name + '" data-an-value="' + v + '"' +
            ' data-an-multi="' + (f.multi ? '1' : '0') + '"' +
            ' aria-pressed="' + (on ? 'true' : 'false') + '">' + EC.escapeHtml(v.replace(/_/g, ' ')) + '</button>';
    });
    h += '</div></div>';
    return h;
}

function logicInner(cats, override) {
    let tech = TECH_CATS.some(function(c) { return cats[c]; });
    let soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    const derived = deriveDecision(cats);
    let h = '<div class="pt-logic-row">';
    h += '<span class="pt-logic-term' + (tech ? ' on' : '') + '">&ge;1 Gegenstand</span>';
    h += '<span class="pt-logic-and mono">UND</span>';
    h += '<span class="pt-logic-term' + (soc ? ' on' : '') + '">&ge;1 Perspektive</span>';
    h += '<span class="pt-logic-arrow">&rarr;</span>';
    h += '<span class="pt-tag-mono">abgeleitet</span>';
    h += '<span class="pt-pill pt-pill-' + decCls(derived) + '">' + derived + '</span>';
    h += '<span class="pt-spacer"></span>';
    h += '<label class="pt-override"><span class="pt-switch"><input type="checkbox" id="pt-override"' +
        (override ? ' checked' : '') + '><span class="pt-switch-track"></span></span> ' +
        (derived === 'Include' ? 'Override zu Exclude' : 'Override zu Include') + '</label>';
    h += '</div>';
    return h;
}

function aiCollapsedHtml(p) {
    let a = aiProposal(p);
    if (!a) return '';
    const on = ALL_CATS.filter(function(c) { return a.categories[c]; });
    let h = '<details class="pt-ai-collapse"><summary><span class="pt-tag-mono">KI-Vorschlag</span>' +
        '<span class="pt-pill pt-pill-ai">advisory</span><span class="pt-spacer"></span>' +
        '<span class="pt-dec-' + (a.decision === 'Include' ? 'include' : 'exclude') + '">' + a.decision + '</span></summary>';
    h += '<div class="pt-ai-collapse-body">';
    h += '<div class="pt-tag-mono">KI-Kategorien</div><div class="pt-chips-static">';
    h += on.length ? on.map(function(c) { return '<span class="pt-pill pt-pill-ai">' + CAT_LABELS[c] + '</span>'; }).join('') : '<span class="pt-muted">keine</span>';
    h += '</div>';
    if (a.reasoning) h += '<p class="pt-ai-reason">' + EC.escapeHtml(a.reasoning) + '</p>';
    h += '<p class="pt-ai-foot pt-tag-mono">diagnostisch, konfabulationsanfällig.</p>';
    h += '</div></details>';
    return h;
}

function refreshAssess() {
    let col = document.getElementById('pt-assess-col');
    if (!col) return;
    let p = papers[state.index];
    col.innerHTML = assessInnerHtml(p, curDec()[p.id]);
    bindAssess(p, curDec()[p.id]);
}

// Wire the analysis coding panel of a locked Include record (FR-14). Each edit
// mutates a working copy of the record's analysis, sanitizes, and persists via
// setAnalysis; the binding screening fields are never touched. Option and toggle
// changes re-render the panel in place; the free-text note updates without a
// re-render so the caret is kept.
function attachAnalysisPanel(p, dec, col) {
    if (!dec || dec.decision !== 'Include' || !anFields.length) return;
    const panel = col.querySelector('.pt-anpanel');
    if (!panel) return;

    function cur() {
        const a = readAnalysis(curDec()[p.id]);
        return { fields: JSON.parse(JSON.stringify(a.fields)), undecidable: JSON.parse(JSON.stringify(a.undecidable)) };
    }
    function persist(next) { setAnalysis(p.id, next); }
    function rerender() { refreshAssess(); }

    panel.querySelectorAll('.pt-an-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const name = btn.dataset.anField, val = btn.dataset.anValue, multi = btn.dataset.anMulti === '1';
            const st = cur();
            if (multi) {
                const arr = Array.isArray(st.fields[name]) ? st.fields[name] : [];
                const at = arr.indexOf(val);
                if (at === -1) arr.push(val); else arr.splice(at, 1);
                st.fields[name] = arr;
            } else {
                st.fields[name] = st.fields[name] === val ? undefined : val; // single-select toggles off on re-click
            }
            persist(st); rerender();
        });
    });
    panel.querySelectorAll('[data-an-undec]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            const name = cb.dataset.anUndec;
            const st = cur();
            if (cb.checked) st.undecidable[name] = true; else delete st.undecidable[name];
            persist(st); rerender();
        });
    });
    const notes = panel.querySelector('[data-an-free]');
    if (notes) notes.addEventListener('input', function() {
        const st = cur();
        st.fields[notes.dataset.anFree] = notes.value;
        persist(st); // no re-render: keep the caret in the textarea
    });
}

// ---- handlers ----
function attachScreening(p, dec) {
    let el = surfaceEl(); if (!el) return;

    bindCorpusItems();

    // reading-column layer toggle (Volltext / KI-Extraktion)
    el.querySelectorAll('.pt-layer-btn').forEach(function(b) {
        b.addEventListener('click', function() { setReadMode(b.dataset.mode); });
    });

    // debounce the two searches: each keystroke otherwise re-scans the full corpus index
    // or rebuilds the whole reading document, which janks on long full texts.
    const debounce = function(fn, ms) {
        let t;
        return function() { clearTimeout(t); t = setTimeout(fn, ms); };
    };

    const cq = document.getElementById('pt-corpus-q');
    if (cq) {
        const runCorpus = debounce(function() {
            if (corpusQuery.trim() && !corpusIndex) loadCorpusIndex().then(refreshCorpusList);
            else refreshCorpusList();
        }, 150);
        cq.addEventListener('input', function() { corpusQuery = cq.value; runCorpus(); });
    }
    refreshCorpusList();

    // in-text search
    const intext = document.getElementById('pt-intext');
    if (intext) {
        const runIntext = debounce(function() { applyInText(intext.value); }, 120);
        intext.addEventListener('input', runIntext);
        intext.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); if (docMarks.length) setActiveMark(docMarkIdx + 1); }
        });
    }
    const prev = document.getElementById('pt-intext-prev');
    if (prev) prev.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx - 1); });
    const next = document.getElementById('pt-intext-next');
    if (next) next.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx + 1); });
    const pinHit = document.getElementById('pt-pin-hit');
    if (pinHit) pinHit.addEventListener('click', function() {
        if (!docMarks.length || dec) return;
        let m = docMarks[docMarkIdx];
        let term = (intext && intext.value || '').trim();
        openPinMenu(term, snippetAround(m, term));
    });

    // text-selection pinning in the reading column
    let doc = document.getElementById('pt-doc');
    if (doc && !dec) {
        doc.addEventListener('mouseup', function() {
            let sel = window.getSelection ? window.getSelection() : null;
            if (!sel || sel.isCollapsed) return;
            let text = (sel.toString() || '').trim();
            if (text.length < 2 || text.length > 400) return;
            openPinMenu(text.slice(0, 80), text);
        });
    }

    bindAssess(p, dec);
}

function bindAssess(p, dec) {
    let col = document.getElementById('pt-assess-col'); if (!col) return;

    if (dec) {
        const rev = col.querySelector('#pt-revise');
        if (rev) rev.addEventListener('click', function() { editRecord(p); });
        let nx = col.querySelector('#pt-next');
        if (nx) nx.addEventListener('click', gotoNextOpen);
        attachAnalysisPanel(p, dec, col);
        return;
    }

    col.querySelectorAll('.pt-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            let c = btn.dataset.cat;
            const before = deriveDecision(work.cats);
            work.cats[c] = (catLevel(work.cats[c]) + 1) % 3; // cycle nein -> teilweise -> ja
            // an override opposes the current derivation; if a step flips the derived
            // decision, the override and its justification no longer apply
            if (deriveDecision(work.cats) !== before) { work.override = false; work.overrideReason = null; }
            refreshAssess();
        });
    });
    col.querySelectorAll('.pt-evid-x').forEach(function(btn) {
        btn.addEventListener('click', function() { unpinEvidence(btn.dataset.cat, parseInt(btn.dataset.i, 10)); });
    });
    col.querySelectorAll('.pt-reason-chip').forEach(function(btn) {
        btn.addEventListener('click', function() { work.reason = btn.dataset.reason; refreshAssess(); });
    });
    const ov = col.querySelector('#pt-override');
    if (ov) ov.addEventListener('change', function() { work.override = ov.checked; if (!ov.checked) work.overrideReason = null; refreshAssess(); });

    let rec = col.querySelector('#pt-record');
    let hint = col.querySelector('#pt-actions-hint');
    // A derived Exclude needs an exclusion reason; an override to Include needs a recorded
    // justification (RAISE P3). The justification textarea updates without re-rendering so
    // the cursor is not lost, so the commit gate is re-checked on each keystroke.
    function syncRecord() {
        const fin = finalDecisionOf(work.cats, work.override);
        const needExcl = fin === 'Exclude';
        const needJust = work.override && fin === 'Include';
        const can = (!needExcl || !!work.reason) &&
            (!needJust || !!(work.overrideReason && work.overrideReason.trim()));
        if (rec) rec.disabled = !can;
        if (hint) hint.textContent = can ? 'Deine Entscheidung ist verbindlich. KI bleibt nur als Vorschlag.'
            : (needExcl ? 'Bitte einen Ausschlussgrund wählen.' : 'Bitte den Override zu Include begründen.');
    }
    const ovr = col.querySelector('#pt-override-reason');
    if (ovr) ovr.addEventListener('input', function() { work.overrideReason = ovr.value; syncRecord(); });
    syncRecord();
    if (rec) rec.addEventListener('click', commit);
}

function commit() {
    let p = papers[state.index];
    let fin = finalDecisionOf(work.cats, work.override);
    if (fin === 'Exclude' && !work.reason) { refreshAssess(); return; }
    if (work.override && fin === 'Include' && !(work.overrideReason && work.overrideReason.trim())) { refreshAssess(); return; }
    // the persisted record holds only human Belege; AI-origin evidence stays
    // advisory and session-only, never written to the reviewer file (ADR-016)
    const humanEvidence = {};
    ALL_CATS.forEach(function(c) {
        const items = (work.evidence[c] || []).filter(function(ev) { return (ev.origin || 'human') !== 'ai'; });
        if (items.length) humanEvidence[c] = items;
    });
    curDec()[p.id] = {
        categories: work.cats, decision: fin, override: !!work.override,
        reason: fin === 'Exclude' ? work.reason : null,
        override_reason: (work.override && fin === 'Include') ? work.overrideReason.trim() : null,
        evidence: humanEvidence, ts: new Date().toISOString(), reviewer: state.reviewer
    };
    // FR-14: an edited Include record keeps its analysis codes across the re-commit;
    // a decision that leaves Include drops them (coding rule 1, excluded papers carry
    // no AN codes). A record that never had an analysis part gets no key, so a session
    // that touches no analysis field still serializes the pre-FR-14 file body.
    if (fin === 'Include' && work.analysis) curDec()[p.id].analysis = work.analysis;
    editingPid = null; // the edit (if any) is now re-committed
    save();
    gotoNextOpen();
}

// "Ueberarbeiten" reopens a committed decision for editing. It rehydrates the saved
// categories, evidence, reason, and override into the working state and marks the paper
// as being edited; the committed record stays in curDec untouched until re-commit, so
// abandoning the edit (navigating away) loses nothing. Only human Belege were persisted,
// so AI-origin evidence is not restored. (Browser-agent finding: revise was data loss.)
function editRecord(p) {
    const dec = curDec()[p.id];
    if (!dec) return;
    work = {
        pid: p.id,
        cats: JSON.parse(JSON.stringify(dec.categories || {})),
        override: !!dec.override,
        reason: dec.reason || null,
        overrideReason: dec.override_reason || null,
        evidence: JSON.parse(JSON.stringify(dec.evidence || {})),
        // FR-14: carry the analysis codes through the edit so a re-commit as Include
        // keeps them; a record without an analysis part stays without (no key introduced)
        analysis: dec.analysis ? JSON.parse(JSON.stringify(dec.analysis)) : undefined
    };
    editingPid = p.id;
    renderScreening();
}

function gotoNextOpen() {
    focusReadingOnRender = true;
    let d = curDec();
    // Visit every undecided paper, including textless ones (unlike firstEntryIndex, which
    // only avoids opening *on* boilerplate): a paper without usable text must still be
    // reachable so the reviewer can exclude it as No full text. Skipping it here would
    // leave it permanently unscreened.
    for (let i = 0; i < papers.length; i++) {
        const j = (state.index + 1 + i) % papers.length;
        if (!d[papers[j].id]) { state.index = j; renderScreening(); return; }
    }
    if (state.index < papers.length - 1) state.index++;
    renderScreening();
}

// ---- pin menu (category picker for a selected passage / search hit) ----
// The pin menu is a modal dialog: it takes focus on open, traps Tab inside, closes
// on Escape, and restores focus to the trigger on close (browser-agent a11y finding).
function openPinMenu(term, snippet) {
    pinTerm = term; pinSnippet = snippet;
    pinOrigin = state.readMode === 'ai' ? 'ai' : 'human'; // bind the Beleg to the layer the snippet was taken from
    let menu = document.getElementById('pt-pinmenu'); if (!menu) return;
    pinReturnFocus = document.activeElement;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Beleg an eine Kategorie anheften');
    menu.setAttribute('tabindex', '-1');
    let h = '<div class="pt-pinmenu-head"><span class="pt-tag-mono">Als Beleg anheften an</span>' +
        '<button class="pt-pinmenu-x" id="pt-pinmenu-x" aria-label="Schließen">&times;</button></div>';
    if (pinOrigin === 'ai') h += '<div class="pt-pinmenu-ai">Dieser Beleg stammt aus der KI-Extraktion. Er wird als KI markiert und bindet die Entscheidung nicht.</div>';
    h += '<div class="pt-pinmenu-snip">' + EC.escapeHtml((snippet || term).slice(0, 160)) + '</div>';
    h += '<div class="pt-pinmenu-cats">';
    ALL_CATS.forEach(function(c) {
        h += '<button class="pt-pinmenu-cat" data-cat="' + c + '"><span class="pt-evid-dot" aria-hidden="true" style="background:' +
            ((EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--pt-human)') + '"></span>' + EC.escapeHtml(CAT_LABELS[c]) + '</button>';
    });
    h += '</div>';
    menu.innerHTML = h;
    menu.hidden = false;
    menu.querySelector('#pt-pinmenu-x').addEventListener('click', closePinMenu);
    menu.querySelectorAll('.pt-pinmenu-cat').forEach(function(btn) {
        btn.addEventListener('click', function() { pinEvidence(btn.dataset.cat, pinTerm, pinSnippet, pinOrigin); closePinMenu(); });
    });
    pinKeyHandler = function(e) {
        if (e.key === 'Escape') { e.preventDefault(); closePinMenu(); return; }
        if (e.key !== 'Tab') return;
        const f = menu.querySelectorAll('button');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    menu.addEventListener('keydown', pinKeyHandler);
    const firstCat = menu.querySelector('.pt-pinmenu-cat');
    if (firstCat && typeof firstCat.focus === 'function') firstCat.focus();
    else if (typeof menu.focus === 'function') menu.focus();
}

function closePinMenu() {
    let menu = document.getElementById('pt-pinmenu');
    if (menu) {
        if (pinKeyHandler) { menu.removeEventListener('keydown', pinKeyHandler); pinKeyHandler = null; }
        menu.hidden = true; menu.innerHTML = '';
        ['role', 'aria-modal', 'aria-label', 'tabindex'].forEach(function(a) { menu.removeAttribute(a); });
    }
    if (pinReturnFocus && typeof pinReturnFocus.focus === 'function') pinReturnFocus.focus();
    pinReturnFocus = null;
}

// Report panel (flow + checklist + disclosure), rendered on demand, not in the toolbar

function renderReportSurface(targetEl) {
    let el = targetEl || surfaceEl(); if (!el) return;
    let html = '<p class="pt-muted pt-panel-lead">Aus dem Screening erzeugt: Fluss, Checkliste und Disclosure für den Methodenteil.</p>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">PRISMA-2020-Fluss (trAIce R1)</h3><div id="pt-sec-flow"></div></section>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">PRISMA-trAIce Checkliste</h3><div id="pt-sec-check"></div></section>';
    html += '<section class="pt-rsec"><h3 class="pt-rsec-h">AI-Disclosure</h3><div id="pt-sec-report"></div></section>';
    el.innerHTML = html;
    renderFlowInto(document.getElementById('pt-sec-flow'));
    renderChecklistInto(document.getElementById('pt-sec-check'));
    renderReportInto(document.getElementById('pt-sec-report'));
}

function renderFlowInto(el) {
    if (!el) return;
    let f = computeFlow();
    let html = '<div class="pt-flow">';
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
    html += '<p class="pt-flow-caption">KI- und Mensch-Entscheidungen getrennt (PRISMA-trAIce R1).</p>';
    el.innerHTML = html;
}


function renderChecklistInto(el) {
    if (!el) return;
    let html = '<p class="pt-check-intro">PRISMA-trAIce (Holst et al. 2025), 17 Items. Auto-markierte erfüllt das Dual-Assessment-Setup bereits.</p>';
    let lastSec = '';
    TRAICE.forEach(function(it) {
        if (it.sec !== lastSec) { html += '<div class="pt-check-sec">' + it.sec + '</div>'; lastSec = it.sec; }
        let st = state.checklist[it.id] || {};
        let status = st.status || (it.auto ? 'satisfied' : 'open');
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
            let id = btn.dataset.id;
            const it = TRAICE.filter(function(t) { return t.id === id; })[0];
            const cur = (state.checklist[id] && state.checklist[id].status) || (it.auto ? 'satisfied' : 'open');
            let nx = cur === 'open' ? 'satisfied' : cur === 'satisfied' ? 'na' : 'open';
            state.checklist[id] = state.checklist[id] || {}; state.checklist[id].status = nx;
            save(); renderChecklistInto(el);
        });
    });
    el.querySelectorAll('.pt-check-note').forEach(function(inp) {
        inp.addEventListener('change', function() {
            let id = inp.dataset.id; state.checklist[id] = state.checklist[id] || {}; state.checklist[id].note = inp.value; save();
        });
    });
    const exp = el.querySelector('.pt-check-export');
    if (exp) exp.addEventListener('click', exportChecklist);
}

function exportChecklist() {
    let lines = ['# PRISMA-trAIce checklist', ''];
    TRAICE.forEach(function(it) {
        let st = state.checklist[it.id] || {};
        let status = st.status || (it.auto ? 'satisfied' : 'open');
        lines.push('- [' + (status === 'satisfied' ? 'x' : ' ') + '] ' + it.id + ' (' + it.lvl + '): ' + it.text + (st.note ? ' -- ' + st.note : ''));
    });
    download('prisma-traice-checklist.md', lines.join('\n'), 'text/markdown');
}

function disc(f) { return (state.disclosure[f] != null) ? state.disclosure[f] : (MODEL_DEFAULT[f] || ''); }

function renderReportInto(el) {
    if (!el) return;
    if (state.disclosure.stage == null) state.disclosure.stage = 'Screening';
    if (state.disclosure.conflicts == null) state.disclosure.conflicts = 'none';
    const fields = [['name', 'Modell'], ['date', 'Datum'], ['prompt', 'Prompt-Version'], ['temperature', 'Temperature'],
                  ['threshold', 'Confidence-Schwelle'], ['stage', 'Stage'], ['conflicts', 'Conflicts of Interest'], ['limitations', 'Limitationen']];
    let html = '<div class="pt-report"><div class="pt-report-form">';
    fields.forEach(function(f) {
        const big = f[0] === 'limitations';
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

function updatePreview() { const pre = document.getElementById('pt-prev'); if (pre) pre.textContent = disclosureMarkdown(); }

function disclosureMarkdown() {
    let n = papers.filter(function(p) { return aiProposal(p); }).length;
    const L = [];
    L.push('## AI use disclosure (PRISMA-trAIce / RAISE)', '');
    L.push('Screening of ' + n + ' records used ' + disc('name') + ' (prompt ' + disc('prompt') + ', temperature ' + disc('temperature') + '), date ' + disc('date') + '.');
    L.push('Stage: ' + disc('stage') + '. The AI proposal is advisory; every record was screened independently by a human reviewer, whose decision is binding (RAISE).');
    L.push('Performance evaluation (PRISMA-trAIce M9/R2): AI-human agreement is evaluated outside this tool, on the benchmark corpus in the repository (generated/benchmark-results/, replay self-test), not recomputed here over the loaded corpus.');
    L.push('Confidence threshold: ' + disc('threshold') + '. Conflicts of interest: ' + disc('conflicts') + '.');
    if (disc('limitations')) L.push('Limitations: ' + disc('limitations'));
    L.push('', 'Flow diagram distinguishes AI from human decisions (PRISMA-trAIce R1). Tool identity, prompt, and parameters disclosed per M2/M6.');
    return L.join('\n');
}

// Data panel (sync: connect, per-reviewer files, export/import), rendered on demand

function renderData(targetEl) {
    let el = targetEl || surfaceEl(); if (!el) return;
    let html = '<div class="pt-data">';

    html += '<div class="pt-data-block"><p class="pt-muted pt-panel-lead">Provenienz über Git. Deine Entscheidungen liegen als eine Datei pro Reviewer:in in docs/data/screening/; wer was entschieden hat, trägt der Commit-Autor, kein Feld im Tool.</p></div>';

    html += '<div class="pt-data-block"><h4>In den Projektordner speichern</h4>';
    if (FS_SUPPORTED) {
        html += '<p class="pt-muted">Ordner docs/data/screening/ im lokalen Klon verbinden. Das Tool liest alle Reviewer-Dateien und schreibt deine bei jeder Entscheidung diff-stabil hinein (Schema 0.2, nach Paper-ID sortiert). Danach committest du sie mit deinem üblichen Werkzeug.</p>';
        html += '<div class="pt-data-actions">' +
            '<button class="pt-btn pt-connect">Mit Projektordner verbinden</button>' +
            '<button class="pt-btn pt-reconnect">Erneut verbinden</button>' +
            '<button class="pt-btn pt-reload">Reviewer-Dateien neu laden</button></div>';
    } else {
        html += '<p class="pt-aq-warn">Dieser Browser (Firefox/Safari) kann nicht direkt schreiben. Nutze Export/Import unten und lege die Datei manuell ab.</p>';
    }
    html += '</div>';

    html += '<div class="pt-data-block"><h4>Commit vorbereiten</h4>' +
        '<p class="pt-muted">Eine fertige Commit-Nachricht, die deine Session dokumentiert. Übernimm sie in deinen Commit.</p>' +
        '<div class="pt-data-actions"><button class="pt-btn pt-commitmsg">Commit-Nachricht erzeugen</button>' +
        '<button class="pt-btn pt-commitmsg-copy" hidden>Kopieren</button></div>' +
        '<pre class="pt-commitmsg-out" id="pt-commitmsg-out" hidden></pre></div>';

    html += '<div class="pt-data-block"><h4>Export / Import (Fallback, alle Browser)</h4><div class="pt-data-actions">' +
        '<button class="pt-btn pt-exp-rev">Eigene Datei exportieren (' + EC.escapeHtml(state.reviewer) + '.json)</button>' +
        '<label class="pt-btn pt-imp-label">Reviewer-Datei importieren<input type="file" accept=".json" class="pt-imp" hidden></label>' +
        '<button class="pt-btn pt-exp-csv">Decision-Log (.csv)</button>' +
        '<button class="pt-btn pt-exp-analysis">Analyse-Export (human_assessment.csv-Schema)</button>' +
        '<button class="pt-btn pt-clear">Eigene Session leeren</button></div></div>';

    html += '</div>';
    el.innerHTML = html;

    const conn = el.querySelector('.pt-connect'); if (conn) conn.addEventListener('click', connectRepo);
    const recon = el.querySelector('.pt-reconnect'); if (recon) recon.addEventListener('click', reconnectRepo);
    const reload = el.querySelector('.pt-reload'); if (reload) reload.addEventListener('click', function() { loadAllReviewers().then(function() { renderPanel(); }); });

    const cm = el.querySelector('.pt-commitmsg');
    const cmOut = el.querySelector('#pt-commitmsg-out');
    const cmCopy = el.querySelector('.pt-commitmsg-copy');
    if (cm) cm.addEventListener('click', function() {
        cmOut.textContent = commitMessage();
        cmOut.hidden = false;
        if (cmCopy) cmCopy.hidden = false;
    });
    if (cmCopy) cmCopy.addEventListener('click', function() { if (navigator.clipboard) navigator.clipboard.writeText(cmOut.textContent); });

    el.querySelector('.pt-exp-rev').addEventListener('click', function() { download(state.reviewer + '.json', reviewerFileText(state.reviewer), 'application/json'); });
    el.querySelector('.pt-exp-csv').addEventListener('click', exportCsv);
    el.querySelector('.pt-exp-analysis').addEventListener('click', function() {
        download('prisma-analysis-' + state.reviewer + '.csv', analysisCsv(state.reviewer), 'text/csv');
    });
    el.querySelector('.pt-clear').addEventListener('click', function() {
        if (!confirm('Eigene Entscheidungen (' + state.reviewer + ') verwerfen?')) return;
        state.reviewers[state.reviewer] = {}; state.index = 0; save(); closePanel(); renderScreening();
    });
    el.querySelector('.pt-imp').addEventListener('change', function(e) {
        const file = e.target.files[0]; if (!file) return;
        let r = new FileReader();
        r.onload = function() {
            let obj;
            try { obj = JSON.parse(r.result); }
            catch (err) { alert('Import fehlgeschlagen: ' + err.message); return; }
            // A foreign or corrupt file must not poison the persistent state.
            if (!obj || typeof obj !== 'object' || !obj.decisions || typeof obj.decisions !== 'object') {
                alert('Import fehlgeschlagen: keine gültige Reviewer-Datei (Feld "decisions" fehlt).');
                return;
            }
            const rawKey = obj.reviewer || file.name.replace(/\.json$/, '');
            let key = String(rawKey).trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'import';
            state.reviewers[key] = obj.decisions;
            save(); renderPanel();
        };
        r.readAsText(file);
    });
}

// Quote a CSV cell only when it carries a comma, quote, or newline; any of those
// in reason/source/title would otherwise shift the columns.
function csvCell(v) {
    let s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function exportCsv() {
    let rows = [['id', 'title', 'human_decision', 'human_source', 'ai_decision', 'divergent', 'reason', 'evidence_count']];
    papers.forEach(function(p) {
        let h = humanDecision(p), a = aiProposal(p);
        let rec = (state.reviewers[state.perspective] && state.reviewers[state.perspective][p.id]) || curDec()[p.id];
        rows.push([p.id, p.title || '', h ? h.decision : '', h ? h.source : '',
            a ? a.decision : '', divergent(h, a) ? 'yes' : 'no', (h && h.reason) ? h.reason : '', evidenceCount(rec)]);
    });
    download('prisma-decision-log.csv', rows.map(function(r) { return r.map(csvCell).join(','); }).join('\n'), 'text/csv');
}

// Analysis export (FR-14): the human_assessment.csv column schema, extended by the
// AN_ columns after Notes in the update-protocol D order (AN_Prompting_Role after
// AN_Population, B.1 point 7). Multi-select values are semicolon-separated; the
// nicht-entscheidbar toggles fold into AN_Notes as machine-countable lines. Only
// Include papers carry analysis codes (coding rule 1). This is a separate export
// from the decision-log CSV, which is unchanged.

// established human_assessment.csv prefix, verbatim up to Notes
const HA_PREFIX_COLS = ['ID', 'Zotero_Key', 'Author_Year', 'Title', 'DOI', 'Item_Type',
    'Publication_Year', 'Language', 'Source_Tool', 'Abstract', 'URL',
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet / Intersektionalität',
    'Feministisch', 'Fairness', 'Studientyp', 'Decision', 'Exclusion_Reason', 'Notes'];
// AN column order after Notes, derived from the loaded vocabulary so a field added
// to categories.yaml reaches panel AND export from the one source (no second
// hardcoded list to drift). The only reordering rule is update-protocol D with
// B.1 point 7: capture order, but AN_Prompting_Role moves to directly after
// AN_Population. That reproduces exactly: Techniques, Bias_Axes, Harm_Types,
// Mitigation_Stage, Mitigation_Status, Population, Prompting_Role, Coding_Basis, Notes.
function anExportOrder() {
    const names = anFieldNames().filter(function(n) { return n !== 'AN_Prompting_Role'; });
    const at = names.indexOf('AN_Population');
    names.splice(at === -1 ? names.length : at + 1, 0, 'AN_Prompting_Role');
    return names;
}

function analysisCsvHeader() { return HA_PREFIX_COLS.concat(anExportOrder()).join(','); }

// map a category slug to its Ja/Nein export cell from a three-level record
function catCell(cats, c) { return catLevel((cats || {})[c]) === 2 ? 'Ja' : 'Nein'; }

function analysisCsv(reviewerKey) {
    const rows = [analysisCsvHeader()];
    const dec = state.reviewers[reviewerKey] || {};
    let idn = 0;
    papers.forEach(function(p) {
        const rec = dec[p.id];
        if (!rec || rec.decision !== 'Include') return; // only Include papers carry AN codes
        idn++;
        const a = readAnalysis(rec), f = a.fields;
        const anVal = function(name) {
            if (name === 'AN_Notes') return analysisNotes(a);
            const fld = anField(name), v = f[name];
            if (fld && fld.multi) return (Array.isArray(v) ? v : []).slice().sort().join(';');
            return v || '';
        };
        const cells = [
            idn, p.zotero_key || p.id, p.author_year || '', p.title || '', p.doi || '',
            p.item_type || '', p.publication_year || '', p.language || '', p.source_tool || '',
            p.abstract || '', p.url || '',
            catCell(rec.categories, 'AI_Literacies'), catCell(rec.categories, 'Generative_KI'),
            catCell(rec.categories, 'Prompting'), catCell(rec.categories, 'KI_Sonstige'),
            catCell(rec.categories, 'Soziale_Arbeit'), catCell(rec.categories, 'Bias_Ungleichheit'),
            catCell(rec.categories, 'Gender'), catCell(rec.categories, 'Diversitaet'),
            catCell(rec.categories, 'Feministisch'), catCell(rec.categories, 'Fairness'),
            (f.Studientyp || ''), rec.decision, '', ''
        ];
        anExportOrder().forEach(function(name) { cells.push(anVal(name)); });
        rows.push(cells.map(csvCell).join(','));
    });
    return rows.join('\n');
}

// Utilities

function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain' });
    const url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// Test hook (P1). One definition exposed under two names, no line above is
// changed and no runtime behaviour changes:
//   window.EC._test        headless harness. run-tests.html loads prisma-data.js
//                          first, so window.EC exists here; tests.js reads this.
//   window.__PRISMA_TEST__  survives on the production page prisma.html, where
//                          prisma.js loads before prisma-data.js and the data
//                          layer then replaces window.EC (dropping EC._test).
//                          Browser-agent traces use this name.
// Both point at the same object, so a trace on the real page can also drive the
// surfaces (showSurface) and the M3 reading layers (setReadMode, splitDocLayers).
// state and work are getters, never stale direct references (work is reassigned
// by resetWork, so a captured reference would go dead after a paper change).
const TEST_HOOK = {
    // constants
    TECH_CATS: TECH_CATS, SOCIAL_CATS: SOCIAL_CATS, ALL_CATS: ALL_CATS,
    EXCLUSION_REASONS: EXCLUSION_REASONS, SEED: SEED, REVIEWER_SCHEMA: REVIEWER_SCHEMA,
    // decision logic
    deriveDecision: deriveDecision, finalDecisionOf: finalDecisionOf, divergent: divergent,
    abstractQuality: abstractQuality, evidenceCount: evidenceCount,
    aiProposal: aiProposal, humanDecision: humanDecision, seedDecision: seedDecision,
    // aggregation
    computeFlow: computeFlow,
    // parsing and rendering helpers
    countOcc: countOcc, stripFrontmatter: stripFrontmatter, inlineMd: inlineMd,
    renderMarkdown: renderMarkdown, splitDocLayers: splitDocLayers,
    // generated report text and persistence payload
    disclosureMarkdown: disclosureMarkdown, reviewerPayload: reviewerPayload,
    reviewerFileText: reviewerFileText, sortedDecisions: sortedDecisions, commitMessage: commitMessage,
    // stateful seams for inline fixtures
    setPapers: function(p) { papers = p; },
    getState: function() { return state; },
    getWork: function() { return work; },
    curDec: curDec, resetWork: resetWork, refreshAssess: refreshAssess,
    pinEvidence: pinEvidence, unpinEvidence: unpinEvidence, commit: commit, editRecord: editRecord,
    evidenceListHtml: evidenceListHtml, chipHtml: chipHtml, statusLabel: statusLabel,
    corpusListHtml: corpusListHtml, isScreenable: isScreenable, firstEntryIndex: firstEntryIndex,
    // analysis coding panel (FR-14, ADR-026)
    setAnalysisFields: function(d) { applyAnalysisVocab(d); },
    anVersion: function() { return anVocabVersion; },
    anFieldNames: anFieldNames, anField: anField, anVocab: anVocab,
    anStudyTypes: function() { return anStudyTypes; }, anExportOrder: anExportOrder,
    readAnalysis: readAnalysis, sanitizeAnalysis: sanitizeAnalysis, setAnalysis: setAnalysis,
    analysisNotes: analysisNotes, harmTypesHint: harmTypesHint, analysisPanelHtml: analysisPanelHtml,
    analysisCsvHeader: analysisCsvHeader, analysisCsv: analysisCsv,
    // surface + reading-layer drivers (browser-agent traces on the real page)
    showSurface: function(s) { showSurface(s); },
    setReadMode: function(m) { setReadMode(m); },
    activeLayerHtml: activeLayerHtml
};
window.EC = window.EC || {};
window.EC._test = TEST_HOOK;
window.__PRISMA_TEST__ = TEST_HOOK;

})();
