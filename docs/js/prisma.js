// PRISMA Screening Tool (PRISM) -- standalone evidence-grounded screening instrument.
// The screening view is built around reading and searching the paper's original full text
// (the full-text layer; the generated knowledge distillate is a separate reference layer) and pinning
// found passages as Belege (evidence) on categories. AI is reduced to an optional
// collapsed suggestion; human and AI assessment are brought together, not scored against
// each other -- the human-AI comparison surface (matrix, kappa, divergence) was removed
// (knowledge/specification.md ADR-014), and with ADR-017 its last vestige is gone too:
// the in-tool kappa and confusion matrix of the AI-disclosure line. AI-human agreement
// is evaluated outside the tool on the benchmark corpus (PRISMA-trAIce M9/R2 by reference).
//
// One screening workspace (ADR-020/028). Editors set a short reviewer key and
// connect the local repository once; the daily workflow has one save action.
// Human decision is binding (RAISE); the AI proposal is advisory and stored separately
// so the flow diagram splits AI from human decisions (PRISMA-trAIce R1).
// Persistence: after an explicit reviewer key, File System Access writes
// one JSON per reviewer (schema 0.4) into docs/data/screening/<reviewer>.json.
// Runs on prisma.html via the window.EC shim from prisma-data.js.
// See knowledge/specification.md (requirements, ADRs, design system), knowledge/data.md.

(function() {
'use strict';

let EC = window.EC;
let initialized = false;
let acceptanceMode = null;
let trialMode = false;
let runActor = 'human';
let verificationMode = false;
let editMode = false; // session-only opt-in; a normal reload always starts with reading
const FS_SUPPORTED = typeof window.showDirectoryPicker === 'function';

// Constants

// Populated once from docs/data/category_schema.json. The arrays and maps retain
// their identity so the production UI and the exposed test surface share one schema.
const TECH_CATS = [];
const SOCIAL_CATS = [];
const ALL_CATS = [];
const CAT_LABELS = {};
const CAT_DEFS = {};
const EXCLUSION_REASONS = [];

function applyCategorySchema() {
    const schema = window.__CATEGORY_SCHEMA__ ||
        (EC && EC.getCategorySchema ? EC.getCategorySchema() : null);
    const categories = schema && Array.isArray(schema.categories) ? schema.categories : [];
    const groups = schema && schema.groups ? schema.groups : {};
    if (!categories.length || !Array.isArray(groups.object) || !Array.isArray(groups.perspective) ||
            !Array.isArray(schema.exclusion_reasons)) {
        throw new Error('Kategorieschema nicht geladen (docs/data/category_schema.json).');
    }
    TECH_CATS.splice(0, TECH_CATS.length, ...groups.object);
    SOCIAL_CATS.splice(0, SOCIAL_CATS.length, ...groups.perspective);
    ALL_CATS.splice(0, ALL_CATS.length, ...TECH_CATS, ...SOCIAL_CATS);
    EXCLUSION_REASONS.splice(0, EXCLUSION_REASONS.length, ...schema.exclusion_reasons);
    Object.keys(CAT_LABELS).forEach(function(key) { delete CAT_LABELS[key]; });
    Object.keys(CAT_DEFS).forEach(function(key) { delete CAT_DEFS[key]; });
    categories.forEach(function(category) {
        CAT_LABELS[category.key] = category.label;
        CAT_DEFS[category.key] = category.definition;
    });
}

// The headless harness injects the built schema before evaluating this file and
// exercises pure functions without starting the full application.
if (window.__CATEGORY_SCHEMA__) applyCategorySchema();

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
const TRIAL_LS_KEY = 'femprompt-prisma-trial-state/0.1';
const REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.4'; // 0.4 binds decisions and paper evidence to an exact work version.
const SEED = 'seed'; // built-in reviewer = the existing expert assessment (paper.human)
const REVIEWER_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{1,11}$/;
const LIFECYCLE_STATES = [];
const LIFECYCLE_NEXT = {};
const LIFECYCLE_TRANSITIONS = {};
const VERIFICATION_RESULTS = [];
const VERSION_LABELS = {};
const PEER_REVIEW_LABELS = {
    peer_reviewed: 'Peer-Review abgeschlossen',
    under_review: 'im Peer-Review',
    not_peer_reviewed: 'kein Peer-Review',
    not_established: 'Peer-Review nicht belegt'
};

function applyWorkVersionContract() {
    const contract = EC && EC.getWorkVersionContract ? EC.getWorkVersionContract() : null;
    const types = contract && Array.isArray(contract.version_types) ? contract.version_types : [];
    Object.keys(VERSION_LABELS).forEach(function(key) { delete VERSION_LABELS[key]; });
    types.forEach(function(item) { VERSION_LABELS[item.key] = item.label_de || item.key; });
}

function versionLabel(value) { return VERSION_LABELS[value] || value || 'Version ungeklärt'; }
function peerReviewLabel(value) { return PEER_REVIEW_LABELS[value] || 'Peer-Review nicht belegt'; }

function bindRecordIdentity(record, paper) {
    if (!paper.work_id || !paper.version_id) return record;
    record.work_id = paper.work_id || null;
    record.version_id = paper.version_id || null;
    record.version_type = paper.version_type || 'unknown';
    record.preferred_version_id = paper.preferred_version_id || paper.version_id || null;
    record.selected_version_is_preferred = !!paper.is_preferred_version;
    Object.keys(record.evidence || {}).forEach(function(category) {
        (record.evidence[category] || []).forEach(function(item) {
            item.paper_id = paper.id;
            item.work_id = paper.work_id || null;
            item.version_id = paper.version_id || null;
        });
    });
    return record;
}

function applyLifecycleContract() {
    const contract = window.__LIFECYCLE_CONTRACT__ ||
        (EC && EC.getLifecycleContract ? EC.getLifecycleContract() : null);
    if (!contract || contract.record_schema !== 'femprompt-prisma-reviewer/0.5' ||
            !Array.isArray(contract.states) || !Array.isArray(contract.transitions) ||
            !Array.isArray(contract.verification_results)) {
        throw new Error('Lifecycle-Vertrag nicht geladen (docs/data/screening_lifecycle_contract.json).');
    }
    LIFECYCLE_STATES.splice(0, LIFECYCLE_STATES.length, ...contract.states);
    VERIFICATION_RESULTS.splice(0, VERIFICATION_RESULTS.length, ...contract.verification_results);
    Object.keys(LIFECYCLE_NEXT).forEach(function(key) { delete LIFECYCLE_NEXT[key]; });
    Object.keys(LIFECYCLE_TRANSITIONS).forEach(function(key) { delete LIFECYCLE_TRANSITIONS[key]; });
    contract.transitions.forEach(function(transition) {
        LIFECYCLE_TRANSITIONS[transition.from + '→' + transition.to] = transition;
        if (transition.from === 'ai-agent-reviewed' || transition.from === 'verified')
            LIFECYCLE_NEXT[transition.from] = transition.to;
    });
}

if (window.__LIFECYCLE_CONTRACT__) applyLifecycleContract();

// State

const state = {
    surface: 'screening',
    reviewer: null,        // explicit filename-safe reviewer key; drives the data file
    perspective: null,     // current reviewer source for project records; never silently falls back to seed
    index: 0,
    readMode: 'full',      // reading layer: 'full' (paper text) or 'ai' (LLM knowledge distillate)
    reviewers: {},         // reviewerKey -> { paperId -> decision }
    checklist: {},
    disclosure: {}
};

let papers = [];
let dirHandle = null;          // connected File System Access directory handle (what the picker returned)
let screeningHandle = null;    // docs/data/screening within it: where reviewer files are read and written
let connectScope = 'screening'; // 'root' when the picked folder is the repo root, else 'screening'
let storedHandleAvailable = false;
let reviewerFileErrors = {};   // reviewerKey -> blocking read/validation error for an existing file
let reviewerRecoveryPending = {}; // reviewerKey -> browser records newer than the connected file
const reviewerEnvelopes = {};  // reviewerKey -> loaded top-level JSON, preserved across decision writes
let corpusIndex = null;        // id -> { t, ay, kd, src, n, x } for corpus full-text search
let corpusIndexPromise = null;
let corpusQuery = '';          // current corpus-wide search (left pane)
const textCache = {};            // paperId -> raw knowledge-doc markdown (or null)
const fullTextCache = {};        // paperId -> cleaned Docling full text (or null)
let fulltextManifest = null;     // id -> { src, chars, work_id, version_id }; null until loaded, {} if absent
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
let appliedInTextQuery = '';
let pendingInText = null;      // in-text query to apply once the document has loaded
let pinTerm = '', pinSnippet = '', pinOrigin = 'human'; // pinOrigin = source layer of the staged snippet
let pinReturnFocus = null, pinKeyHandler = null; // pin-menu dialog focus restore + keydown trap
let focusReadingOnRender = false; // move focus to the paper heading after a paper switch (a11y)
let editingPid = null; // a committed paper reopened for editing; its record stays until re-commit
let renderedPaperId = null;
let readToken = 0;             // monotonic load token; a reading response for a stale token is dropped
let readingPending = false;    // true between a reading load and its applied response; commit waits for it
let currentTextSource = 'none'; // paper-layer text actually shown: 'raw' | 'abstract' | 'none' (ADR-027)
let saveStatus = { kind: 'needs-reviewer', message: 'Einmal Reviewer:innen-Kürzel festlegen.' };
let openInfoTrigger = null;
let infoGlobalBound = false;
let verificationNotice = '';

// the in-progress (pre-commit) decision for the open paper
let work = { pid: null, cats: {}, override: false, reason: null, overrideReason: null, evidence: {} };

function curDec() {
    if (!state.reviewer) return {};
    if (!state.reviewers[state.reviewer]) {
        if (!canEdit()) return {};
        state.reviewers[state.reviewer] = {};
    }
    return state.reviewers[state.reviewer];
}

function resetWork(p) { work = { pid: p.id, cats: {}, override: false, reason: null, overrideReason: null, evidence: {} }; }

function canEdit() { return editMode && !acceptanceMode; }

function setEditMode(enabled) {
    if (acceptanceMode) return false;
    editMode = !!enabled;
    closePinMenu();
    closeInfoPopover(false);
    // The draft stays in memory; leaving edit mode never commits it. A saved record
    // remains the reading projection until the user explicitly reopens the draft.
    if (initialized) {
        renderShell();
        renderScreening();
        if (canEdit()) {
            focusDataInline();
            if (!trialMode && !screeningHandle) restoreRepoConnection();
        } else {
            const toggle = document.getElementById('pt-edit-mode');
            if (toggle) toggle.focus();
        }
    }
    return canEdit();
}

// Persistence: localStorage cache + File System Access (repo files)

function serializeAll() {
    return {
        schema: storageKey(),
        config: { reviewer: state.reviewer, reviewerSelected: !!state.reviewer,
                  perspective: state.perspective, disclosure: state.disclosure },
        reviewers: state.reviewers,
        checklist: state.checklist
    };
}

function storageKey() { return trialMode ? TRIAL_LS_KEY : LS_KEY; }

function saveLocal() {
    if (!canEdit()) return;
    try { localStorage.setItem(storageKey(), JSON.stringify(serializeAll())); }
    catch (e) { console.warn('[PRISMA] local save failed:', e.message); }
}

function loadLocal() {
    try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) return;
        const o = JSON.parse(raw);
        if (o.config) {
            // Older builds silently defaulted everyone to reviewer1. Only an explicit
            // selection marker and a filename-safe key are trusted during migration.
            if (o.config.reviewerSelected && isReviewerId(o.config.reviewer))
                state.reviewer = o.config.reviewer;
            if (o.config.perspective) state.perspective = o.config.perspective;
            if (o.config.disclosure) state.disclosure = o.config.disclosure;
        }
        state.reviewers = o.reviewers || {};
        state.checklist = o.checklist || {};
        if (state.reviewer) saveStatus = trialMode ? {
            kind: 'ready',
            message: 'Isolierter Testlauf aus diesem Browser geladen.'
        } : {
            kind: 'dirty',
            message: 'Zwischenstand aus dem Browser geladen; Datendatei nach dem Verbinden abgleichen.'
        };
    } catch (e) { console.warn('[PRISMA] local load failed:', e.message); }
}

let writeChain = Promise.resolve();
let writeVersion = 0;
function save() {
    if (!canEdit()) return;
    saveLocal();
    if (!state.reviewer) {
        setSaveStatus('needs-reviewer', 'Reviewer:innen-Kürzel festlegen, bevor die erste Entscheidung gespeichert wird.');
        return;
    }
    if (trialMode) {
        setSaveStatus('saved', 'Testlauf im Browser gespeichert. Forschungsdaten bleiben unverändert.');
        renderData(document.getElementById('pt-data-inline'));
        return;
    }
    const key = state.reviewer;
    if (reviewerFileErrors[key]) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(key) + ' ist nicht lesbar und wird nicht überschrieben.');
        renderData(document.getElementById('pt-data-inline'));
        return;
    }
    setSaveStatus('dirty', screeningHandle
        ? 'Änderungen vorhanden; Speicherung wird vorbereitet.'
        : 'Nur im Browser gespeichert; die Datendatei ist noch nicht aktualisiert.');
    // serialize repo writes so rapid screening cannot overlap createWritable on the same file
    if (screeningHandle) {
        const targetHandle = screeningHandle;
        const text = reviewerFileText(key);
        const version = ++writeVersion;
        setSaveStatus('saving', 'Speichert in ' + reviewerPath(key) + ' …');
        writeChain = writeChain.then(function() { return writeReviewerText(targetHandle, key, text); }).then(function() {
            reviewerRecoveryPending[key] = false;
            if (state.reviewer === key && version === writeVersion && screeningHandle === targetHandle)
                setSaveStatus('saved', 'Gespeichert in ' + reviewerPath(key) + '.');
        }).catch(function(e) {
            if (state.reviewer === key && version === writeVersion)
                setSaveStatus('error', 'Speichern fehlgeschlagen: ' + (e.message || e));
            console.warn('[PRISMA] file write failed:', e);
        });
    }
}

function reviewerPayload(key) {
    const loaded = reviewerEnvelopes[key];
    const payload = loaded ? JSON.parse(JSON.stringify(loaded)) : {
        schema: REVIEWER_SCHEMA, reviewer: key, actor: runActor
    };
    if (/^femprompt-prisma-reviewer\/0\.[1234]$/.test(payload.schema || ''))
        payload.schema = REVIEWER_SCHEMA;
    payload.updated = new Date().toISOString();
    payload.decisions = {};
    Object.keys(state.reviewers[key] || {}).forEach(function(paperId) {
        const record = JSON.parse(JSON.stringify(state.reviewers[key][paperId]));
        const paper = papers.find(function(item) { return item.id === paperId; });
        if (paper) bindRecordIdentity(record, paper);
        payload.decisions[paperId] = record;
    });
    return payload;
}

// Deterministic on-disk form: decisions are sorted by paper id. The in-memory shape
// is untouched; only the serialized file is ordered.
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

function normalizedReviewerKey(key) {
    const normalized = String(key || '').trim().toLowerCase();
    return REVIEWER_KEY_PATTERN.test(normalized) ? normalized : null;
}

function isReviewerId(key) { return normalizedReviewerKey(key) !== null; }

function reviewerPath(key) {
    if (!key) return 'Kürzel festlegen';
    return trialMode ? 'isolierter Testlauf/' + key + '.json' : 'docs/data/screening/' + key + '.json';
}

function selectedFolderLabel() {
    if (!screeningHandle) return 'nicht verbunden';
    if (connectScope === 'root') return (dirHandle && dirHandle.name ? dirHandle.name + '/' : '') + 'docs/data/screening';
    return (dirHandle && dirHandle.name) || 'gewählter Screening-Ordner';
}

function setSaveStatus(kind, message) {
    saveStatus = { kind: kind, message: message };
    const status = document.getElementById('pt-save-status');
    if (status) {
        status.className = 'pt-save-status pt-save-' + kind;
        status.textContent = message;
    }
}

function selectReviewer(key) {
    if (!canEdit()) return false;
    const normalized = normalizedReviewerKey(key);
    if (!normalized) return false;
    state.reviewer = normalized;
    if (!state.reviewers[normalized]) state.reviewers[normalized] = {};
    state.perspective = normalized;
    saveLocal();
    const fileError = reviewerFileErrors[normalized];
    const recovery = reviewerRecoveryPending[normalized];
    setSaveStatus(fileError ? 'error' : (recovery ? 'dirty' : (trialMode ? 'ready' : (screeningHandle ? 'ready' : 'local'))), fileError
        ? 'Bestehende Datei ' + reviewerPath(normalized) + ' ist nicht lesbar: ' + fileError + ' Sie wird nicht verändert.'
        : (recovery
            ? 'Neuere Browser-Änderungen wurden wiederhergestellt. Mit der Diskette in die Reviewer-Datei schreiben.'
        : (trialMode
            ? 'Isolierter Testlauf bereit. Ergebnisse bleiben in diesem Browser-Ursprung.'
            : (screeningHandle
                ? 'Bereit: ' + reviewerPath(normalized) + ' ist verbunden.'
                : 'Kürzel gespeichert. Jetzt einmal den lokalen Arbeitsordner wählen.'))));
    return true;
}

function normalizedReviewerDecisions(decisions, key) {
    const copy = JSON.parse(JSON.stringify(decisions || {}));
    Object.keys(copy).forEach(function(pid) {
        if (copy[pid] && typeof copy[pid] === 'object') copy[pid].reviewer = key;
    });
    return copy;
}

function recordTimestamp(record) {
    const value = Date.parse(record && record.ts);
    return Number.isFinite(value) ? value : null;
}

// The repository file and the browser recovery copy can diverge after a failed
// physical write. Merge by paper and keep the newer timestamp. A same-paper
// conflict without comparable timestamps is blocked instead of guessed.
function mergeReviewerDecisions(fileDecisions, localDecisions) {
    const disk = JSON.parse(JSON.stringify(fileDecisions || {}));
    const local = JSON.parse(JSON.stringify(localDecisions || {}));
    const merged = disk;
    let recovered = false;
    let conflict = null;
    Object.keys(local).forEach(function(pid) {
        if (!disk[pid]) {
            merged[pid] = local[pid];
            recovered = true;
            return;
        }
        if (JSON.stringify(disk[pid]) === JSON.stringify(local[pid])) return;
        const diskTs = recordTimestamp(disk[pid]);
        const localTs = recordTimestamp(local[pid]);
        if (diskTs !== null && localTs !== null && diskTs !== localTs) {
            if (localTs > diskTs) { merged[pid] = local[pid]; recovered = true; }
            return;
        }
        // Keep the browser recovery in memory while the conflicting file remains
        // untouched on disk. The blocking error prevents either version overwriting
        // the other until the operator resolves the record explicitly.
        merged[pid] = local[pid];
        conflict = 'Browser- und Dateistand widersprechen sich bei Paper ' + pid +
            (diskTs !== null && localTs !== null
                ? ' trotz identischem Zeitstempel.'
                : ' ohne vergleichbare Zeitstempel.');
    });
    return { decisions: merged, recovered: recovered, conflict: conflict };
}

// Backup imports always target the explicitly selected reviewer. The file name and an
// outdated embedded reviewer value therefore cannot overwrite the other reviewer's track.
function importReviewerPayload(obj, target, overwrite) {
    if (!canEdit()) return { ok: false, reason: 'read-only' };
    if (!isReviewerId(target)) return { ok: false, reason: 'reviewer-required' };
    if (!obj || typeof obj !== 'object' || !obj.decisions || typeof obj.decisions !== 'object')
        return { ok: false, reason: 'invalid' };
    if (!overwrite && Object.keys(state.reviewers[target] || {}).length)
        return { ok: false, reason: 'occupied' };
    state.reviewers[target] = normalizedReviewerDecisions(obj.decisions, target);
    reviewerEnvelopes[target] = JSON.parse(JSON.stringify(obj));
    save();
    return { ok: true, reviewer: target, count: Object.keys(obj.decisions).length };
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

// The picker may be pointed at the repo root of the local clone; the reviewer folder is
// then resolved as docs/data/screening below it, which is one step for the reviewer and
// keeps the connection target stable. A picked folder without a docs child is treated as
// the reviewer folder itself, which is the pre-existing behaviour.
async function resolveScopes(picked) {
    if (!canEdit()) throw new Error('Zum Verbinden zuerst Bearbeiten aktivieren.');
    // drop the previous connection first: a failed resolution must not leave writes
    // pointing at the folder of an earlier session
    screeningHandle = null;
    connectScope = 'screening';
    let docs = null;
    try { docs = await picked.getDirectoryHandle('docs'); } catch (e) { docs = null; }
    if (docs) {
        // the two levels are created when absent, so a clone that has never been screened
        // in connects as readily as one that has
        const data = await docs.getDirectoryHandle('data', { create: true });
        screeningHandle = await data.getDirectoryHandle('screening', { create: true });
        connectScope = 'root';
    } else {
        screeningHandle = picked;
    }
}

function setConnectedSaveStatus() {
    const fileError = state.reviewer && reviewerFileErrors[state.reviewer];
    if (fileError) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(state.reviewer) +
            ' ist nicht lesbar: ' + fileError + ' Sie wird nicht verändert.');
        return;
    }
    if (state.reviewer && reviewerRecoveryPending[state.reviewer]) {
        setSaveStatus('dirty', 'Neuere Browser-Änderungen wurden wiederhergestellt. Mit der Diskette in ' +
            reviewerPath(state.reviewer) + ' schreiben.');
        return;
    }
    setSaveStatus(state.reviewer ? 'ready' : 'needs-reviewer', state.reviewer
        ? 'Arbeitsordner verbunden. Ziel: ' + reviewerPath(state.reviewer) + '.'
        : 'Arbeitsordner verbunden. Vor dem Speichern Kürzel festlegen.');
}

async function connectRepo() {
    if (!canEdit()) return;
    if (!FS_SUPPORTED) { alert('Dieser Browser kann den lokalen Arbeitsordner nicht direkt beschreiben. Öffne PRISM in einem Chromium-basierten Browser.'); return; }
    try {
        let handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        if (!canEdit()) return;
        dirHandle = handle;
        await idbSet('dir', handle);
        storedHandleAvailable = true;
        await resolveScopes(handle);
        await loadAllReviewers();
        setConnectedSaveStatus();
        renderData(document.getElementById('pt-data-inline'));
        showSurface(state.surface);
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.warn('[PRISMA] connect failed:', e);
            setSaveStatus('error', 'Verbindung fehlgeschlagen: ' + (e.message || e.name) + '. Browser-Zwischenstand bleibt erhalten.');
            alert('Verbindung fehlgeschlagen: ' + (e.message || e.name) + '.');
        }
    }
}

async function reconnectRepo() {
    if (!canEdit() || !FS_SUPPORTED) return;
    try {
        let handle = await idbGet('dir');
        if (!canEdit()) return;
        if (!handle) { storedHandleAvailable = false; renderData(document.getElementById('pt-data-inline')); return; }
        storedHandleAvailable = true;
        const perm = await handle.requestPermission({ mode: 'readwrite' });
        if (!canEdit()) return;
        if (perm !== 'granted') {
            setSaveStatus('error', 'Schreibrecht nicht erteilt. Browser-Zwischenstand bleibt erhalten.');
            alert('Schreibrecht nicht erteilt.'); return;
        }
        dirHandle = handle;
        await resolveScopes(handle);
        await loadAllReviewers();
        setConnectedSaveStatus();
        renderData(document.getElementById('pt-data-inline'));
        showSurface(state.surface);
    } catch (e) {
        console.warn('[PRISMA] reconnect failed:', e);
        setSaveStatus('error', 'Erneutes Verbinden fehlgeschlagen: ' + (e.message || e.name) + '.');
        alert('Erneutes Verbinden fehlgeschlagen: ' + (e.message || e.name) + '.');
    }
}

async function restoreRepoConnection() {
    if (!canEdit() || !FS_SUPPORTED) return;
    try {
        const handle = await idbGet('dir');
        if (!handle || !canEdit()) return;
        storedHandleAvailable = true;
        dirHandle = handle;
        const permission = handle.queryPermission ? await handle.queryPermission({ mode: 'readwrite' }) : 'prompt';
        if (!canEdit()) return;
        if (permission !== 'granted') {
            setSaveStatus('local', 'Arbeitsordner einmal freigeben, danach kann direkt gespeichert werden.');
            renderData(document.getElementById('pt-data-inline'));
            return;
        }
        await resolveScopes(handle);
        await loadAllReviewers();
        setConnectedSaveStatus();
        renderData(document.getElementById('pt-data-inline'));
        renderScreening();
    } catch (e) {
        console.warn('[PRISMA] saved folder restore failed:', e);
        setSaveStatus('error', 'Gespeicherter Arbeitsordner konnte nicht verbunden werden.');
        renderData(document.getElementById('pt-data-inline'));
    }
}

async function loadAllReviewers() {
    if (!canEdit() || !screeningHandle) return;
    const found = {};
    const errors = {};
    const recoveries = {};
    for await (const entry of screeningHandle.values()) {
        if (entry.kind === 'file' && /\.json$/.test(entry.name)) {
            const fileKey = entry.name.replace(/\.json$/, '');
            const key = normalizedReviewerKey(fileKey);
            if (!key) continue;
            if (key !== fileKey) {
                errors[key] = 'Der Dateiname muss in kanonischer Kleinschreibung vorliegen.';
                continue;
            }
            try {
                let f = await entry.getFile();
                let obj = JSON.parse(await f.text());
                const check = validateReviewerPayload(obj);
                if (!check.ok) throw new Error(check.message);
                // The canonical filename owns the reviewer role. This repairs the
                // historical case where reviewer2.json still embedded reviewer1 and
                // prevents the two files from collapsing into one in-memory track.
                const disk = normalizedReviewerDecisions(obj.decisions || {}, key);
                const local = normalizedReviewerDecisions(state.reviewers[key] || {}, key);
                const merged = mergeReviewerDecisions(disk, local);
                found[key] = merged.decisions;
                reviewerEnvelopes[key] = JSON.parse(JSON.stringify(obj));
                if (merged.recovered) recoveries[key] = true;
                if (merged.conflict) errors[key] = merged.conflict;
            } catch (e) {
                errors[key] = e && e.message ? e.message : String(e);
                console.warn('[PRISMA] could not read', entry.name, e);
            }
        }
    }
    if (!canEdit()) return;
    reviewerFileErrors = errors;
    reviewerRecoveryPending = recoveries;
    // Apply resolved records. On a blocked conflict, the file stays untouched on disk
    // while the browser recovery remains in memory and localStorage.
    Object.keys(found).forEach(function(k) { state.reviewers[k] = found[k]; });
    saveLocal();
}

async function writeReviewerText(targetHandle, key, text) {
    if (!targetHandle || !isReviewerId(key)) return false;
    const fh = await targetHandle.getFileHandle(key + '.json', { create: true });
    const w = await fh.createWritable();
    await w.write(text);
    await w.close();
    return true;
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
    const source = fulltextManifest && fulltextManifest[p.id];
    if (!source || source.src === 'none') return false;
    return !(source.version_id && p.version_id && source.version_id !== p.version_id);
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

function normalizeSearchText(value) {
    return String(value || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/\s+/g, ' ').trim();
}

function corpusSearchResults(query) {
    const q = normalizeSearchText(query);
    if (!q || !corpusIndex) return [];
    return papers.map(function(p, index) {
        const entry = corpusIndex[p.id] || {};
        const title = normalizeSearchText(p.title || entry.t);
        const author = normalizeSearchText([p.authors, p.author_year, entry.ay].filter(Boolean).join(' '));
        const doi = normalizeSearchText(p.doi);
        const id = normalizeSearchText(p.id);
        const body = normalizeSearchText(entry.x);
        let rank = 99, kind = '', count = 0;
        if (title === q) { rank = 0; kind = 'Exakter Titel'; count = 1; }
        else if (title.indexOf(q) !== -1) { rank = 1; kind = 'Titel'; count = countOcc(title, q); }
        else if (author.indexOf(q) !== -1) { rank = 2; kind = 'Autor:in/Jahr'; count = countOcc(author, q); }
        else if (doi && doi.indexOf(q) !== -1) { rank = 3; kind = 'DOI'; count = countOcc(doi, q); }
        else if (id && id.indexOf(q) !== -1) { rank = 4; kind = 'Paper-ID'; count = countOcc(id, q); }
        else if (body.indexOf(q) !== -1) { rank = 5; kind = 'Text'; count = countOcc(body, q); }
        return { paper: p, index: index, rank: rank, kind: kind, count: count };
    }).filter(function(x) { return x.rank < 99; }).sort(function(a, b) {
        return a.rank - b.rank || a.index - b.index;
    });
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
function expectedCodingBasis(textSource) {
    return textSource === 'raw' ? 'Fulltext'
        : (textSource === 'abstract' ? 'Abstract'
            : (textSource === 'knowledge_doc' ? 'Knowledge_Doc' : null));
}

function sanitizeAnalysis(raw, textSource) {
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
        if (inU[f.name]) {
            outU[f.name] = true;
            return;
        }
        if (f.multi) {
            const arr = (Array.isArray(v) ? v : (v != null ? [v] : []))
                .filter(function(x) { return vocab.indexOf(x) !== -1; });
            let uniq = arr.filter(function(x, i) { return arr.indexOf(x) === i; });
            // `None` denotes the absence of a substantive code. Imported legacy
            // combinations therefore keep the substantive codes and drop `None`.
            if (uniq.length > 1 && uniq.indexOf('None') !== -1)
                uniq = uniq.filter(function(x) { return x !== 'None'; });
            uniq.sort();
            if (uniq.length) outF[f.name] = uniq;
        } else {
            if (vocab.indexOf(v) !== -1) outF[f.name] = v;
        }
    });
    // Studientyp travels with the analysis capture (required for Include,
    // update-protocol D); its closed list is study_types from the same YAML source.
    // Same strictness as the AN_ fields; no undecidable toggle, its vocabulary
    // carries Unclear itself.
    if (anStudyTypes.indexOf(inF.Studientyp) !== -1) outF.Studientyp = inF.Studientyp;
    const expected = expectedCodingBasis(textSource);
    if (expected) {
        outF.AN_Coding_Basis = expected;
        delete outU.AN_Coding_Basis;
    }
    return { fields: outF, undecidable: outU };
}

// Store the coder's analysis on the committed Include record, sanitized. This is
// the only writer of the analysis sub-object; it never touches the binding
// screening fields (categories, decision, override, reason, evidence), so the
// screening record stays byte-identical (the HARD boundary of FR-14).
function setAnalysis(pid, raw) {
    if (!canEdit()) return;
    const rec = curDec()[pid];
    if (!rec || rec.decision !== 'Include') return;
    rec.analysis = sanitizeAnalysis(raw, rec.text_source);
    save();
    refreshCorpusList();
}

function analysisRequirements(dec) {
    if (!dec || dec.decision !== 'Include') return { ok: true, missing: [] };
    const raw = readAnalysis(dec);
    const a = sanitizeAnalysis(raw, dec.text_source);
    const f = a.fields, u = a.undecidable;
    const missing = [];
    if (!f.Studientyp) missing.push('Studientyp');
    const expected = expectedCodingBasis(dec.text_source);
    if (!expected) missing.push('lesbare Textquelle');
    else if (raw.fields.AN_Coding_Basis !== expected) missing.push('AN_Coding_Basis = ' + expected);
    anFields.forEach(function(fd) {
        if (fd.free_text || fd.name === 'AN_Coding_Basis') return;
        const binding = !fd.optional || (fd.name === 'AN_Harm_Types' && expected === 'Fulltext');
        if (!binding) return;
        const v = f[fd.name];
        const filled = fd.multi ? Array.isArray(v) && v.length > 0 : !!v;
        if (!filled && !u[fd.name]) missing.push(fd.name);
    });
    return { ok: missing.length === 0, missing: missing };
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

// AN_Harm_Types is optional outside full-text coding and required for Fulltext.
function harmTypesHint(analysis) {
    const f = (analysis && analysis.fields) || {}, u = (analysis && analysis.undecidable) || {};
    if (f.AN_Coding_Basis !== 'Fulltext') return '';
    if (u.AN_Harm_Types) return '';
    if ((f.AN_Harm_Types || []).length) return '';
    return 'Bei Volltext-Basis ist AN_Harm_Types erforderlich. Wähle einen Code einschließlich None oder markiere das Feld als nicht entscheidbar.';
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

function normalizedLine(s) {
    return String(s || '').replace(/^#{1,6}\s+/, '').replace(/[\s\p{P}]+/gu, ' ').trim().toLowerCase();
}

function normalizedSourceUrl(raw) {
    const value = String(raw || '').trim();
    if (!value) return '';
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : '';
    } catch (e) { return ''; }
}

function urlOnlyLine(line) {
    const value = String(line || '').trim();
    const raw = value.replace(/^<(.+)>$/, '$1');
    const markdown = raw.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i);
    if (markdown && markdown[1] === markdown[2]) return normalizedSourceUrl(markdown[2]);
    return /^https?:\/\/\S+$/i.test(raw) ? normalizedSourceUrl(raw) : '';
}

function sameSourceUrl(candidate, canonical) {
    const a = normalizedSourceUrl(candidate), b = normalizedSourceUrl(canonical);
    if (!a || !b) return false;
    try {
        const left = new URL(a), right = new URL(b);
        const pathKey = function(url) { return url.pathname.toLowerCase().replace(/[^a-z0-9]/g, ''); };
        return left.hostname.toLowerCase() === right.hostname.toLowerCase() && pathKey(left) === pathKey(right);
    } catch (e) { return false; }
}

function authorDisplay(paper) {
    if (paper && String(paper.authors || '').trim()) return String(paper.authors).trim();
    return String((paper && paper.author_year) || '').trim()
        .replace(/\s*\(?(?:18|19|20)\d{2}[a-z]?\)?\s*$/i, '')
        .replace(/[\s,;]+$/, '') || 'nicht angegeben';
}

// Full-text sources vary between publisher Markdown and Docling output. Prefer an
// explicit Abstract/Zusammenfassung heading near the document start. Otherwise only
// remove a leading title and metadata lines that match the structured corpus record;
// no unknown prose is discarded.
function paperBodyMarkdown(md, paper) {
    const clean = stripFrontmatter(md || '');
    let lines = clean.split(/\r?\n/);
    const sourceUrl = normalizedSourceUrl(paper && paper.url);
    if (sourceUrl) lines = lines.filter(function(line) {
        const candidate = urlOnlyLine(line);
        return !candidate || !sameSourceUrl(candidate, sourceUrl);
    });
    const abstractAt = lines.findIndex(function(line, i) {
        return i < 100 && /^#{1,6}\s+(abstract|zusammenfassung|kurzfassung)\s*$/i.test(line.trim());
    });
    if (abstractAt !== -1) return lines.slice(abstractAt).join('\n').trim();

    while (lines.length && !lines[0].trim()) lines.shift();
    const title = normalizedLine(paper && paper.title);
    if (lines.length && title && normalizedLine(lines[0]) === title) lines.shift();
    while (lines.length && !lines[0].trim()) lines.shift();
    const known = [paper && paper.authors, paper && paper.author_year, paper && paper.journal]
        .map(normalizedLine).filter(Boolean);
    while (lines.length && (known.indexOf(normalizedLine(lines[0])) !== -1 || urlOnlyLine(lines[0]))) {
        lines.shift();
        while (lines.length && !lines[0].trim()) lines.shift();
    }
    return lines.join('\n').trim();
}

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
    EC = window.EC;
    applyCategorySchema();
    applyLifecycleContract();
    applyWorkVersionContract();
    initialized = true;
    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    const query = new URLSearchParams(window.location.search);
    trialMode = query.get('trial') === '1';
    verificationMode = query.get('verify') === '1';
    const requestedActor = query.get('actor');
    runActor = requestedActor === 'agent' ? 'agent' : 'human';
    if (trialMode && !requestedActor) runActor = 'agent';
    // These URLs explicitly select an authoring workflow. Ordinary links, including
    // paper deep links and cached reviewer profiles, confer no editing permission.
    editMode = !query.get('review') && (trialMode || verificationMode || requestedActor === 'agent');
    loadLocal();
    const requestedReviewer = normalizedReviewerKey(query.get('reviewer'));
    if (trialMode && requestedReviewer) selectReviewer(requestedReviewer);
    normalizeSurface();
    const requestedPaper = query.get('paper');
    const requestedReview = query.get('review');
    state.index = startIndexForPaper(requestedPaper); // O4 plus a read-only direct-paper link
    loadCorpusIndex(); // background: ready by the time the user runs a corpus search
    loadFulltextManifest().then(function() { if (initialized) refreshSourcePill(); }); // background: full-text availability for the reading pane
    loadAnalysisFields().then(function() { // background: the frozen AN_ vocabulary for the Include analysis panel (FR-14)
        if (initialized && state.surface === 'screening') {
            refreshAssess();
            refreshCorpusList();
        }
    });
    if (requestedReview) {
        const root = document.getElementById('prisma-root');
        if (root) root.innerHTML = '<section class="pt-shell"><h2>Screening</h2>' +
            '<div class="pt-acceptance-status" role="status">Abnahmeansicht wird geladen&hellip;</div></section>';
        loadAcceptanceReview(requestedReview, requestedPaper);
    } else {
        renderShell();
        showSurface(state.surface || 'screening');
        if (canEdit() && !trialMode) restoreRepoConnection();
    }
    console.log('[PRISMA] initialized, ' + papers.length + ' papers, FS ' + (FS_SUPPORTED ? 'supported' : 'fallback'));
};

function loadAcceptanceReview(slug, requestedPaper) {
    if (!/^[a-z0-9-]+$/.test(slug || '')) {
        renderShell();
        showSurface('screening');
        setSaveStatus('error', 'Ungültiger Abnahmefall.');
        renderData(document.getElementById('pt-data-inline'));
        return;
    }
    fetch('data/review-cases/' + slug + '.json').then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    }).then(function(payload) {
        const check = validateReviewerPayload(payload);
        if (!check.ok) throw new Error(check.message);
        acceptanceMode = slug;
        state.reviewer = 'acceptance';
        state.reviewers.acceptance = normalizedReviewerDecisions(payload.decisions, 'acceptance');
        state.index = startIndexForPaper(requestedPaper);
        if (!state.reviewers.acceptance[papers[state.index] && papers[state.index].id])
            state.index = papers.findIndex(function(paper) { return !!state.reviewers.acceptance[paper.id]; });
        if (state.index < 0) throw new Error('keine bekannten Paper im Abnahmefall');
        renderShell();
        showSurface('screening');
    }).catch(function(error) {
        acceptanceMode = null;
        renderShell();
        showSurface('screening');
        setSaveStatus('error', 'Abnahmefall konnte nicht geladen werden: ' + (error.message || error));
        renderData(document.getElementById('pt-data-inline'));
    });
}

// The editor always lands on screening; report generation remains an internal helper.
function normalizeSurface() {
    state.surface = 'screening';
}

// Shell + sub-navigation

function renderShell() {
    const root = document.getElementById('prisma-root');
    if (!root) return;
    let html = '<div class="pt-wsbar-top"><span class="pt-wsbar-title">' + (verificationMode ? 'PRISM-Verifikation' : 'Screening') + '</span>';
    if (!acceptanceMode && !trialMode && !verificationMode && runActor !== 'agent') {
        html += '<span class="pt-workspace-mode" id="pt-workspace-mode" role="status">' + (canEdit() ? 'Bearbeitungsmodus' : 'Lesemodus') + '</span>' +
            '<button class="pt-btn pt-edit-mode" id="pt-edit-mode" type="button" aria-pressed="' + canEdit() +
            '" aria-describedby="pt-workspace-mode" title="' + (canEdit() ? 'Zum Lesemodus wechseln' : 'Bewertungen bearbeiten') + '">Bearbeiten</button>';
    }
    html +=
        '<a class="pt-mode-switch' + (verificationMode ? ' is-active' : '') + '" href="' + EC.escapeHtml(modeHref(!verificationMode)) + '">' +
        (verificationMode ? 'Zum Screening' : 'Verifikationsmodus') + '</a></div>';
    html += '<section class="pt-sync-inline" id="pt-data-inline" aria-label="Reviewer und Datenspeicherung"></section>';
    html += '<div class="pt-surface" id="pt-surface"></div>';
    root.innerHTML = html;
    const toggle = root.querySelector('#pt-edit-mode');
    if (toggle) toggle.addEventListener('click', function() { setEditMode(!canEdit()); });
    renderData(root.querySelector('#pt-data-inline'));
}

// showSurface keeps its name for the test hook and browser traces.
function showSurface() {
    state.surface = 'screening'; saveLocal();
    renderScreening();
}

function focusDataInline() {
    const inline = document.getElementById('pt-data-inline');
    const first = inline && inline.querySelector('#pt-reviewer-key, .pt-folder-action, .pt-change-folder');
    if (first && typeof first.focus === 'function') first.focus();
}

function surfaceEl() { return document.getElementById('pt-surface'); }

function modeHref(wantVerification) {
    const url = new URL(window.location.href);
    if (wantVerification) url.searchParams.set('verify', '1');
    else url.searchParams.delete('verify');
    const paper = papers[state.index];
    if (paper && paper.id) url.searchParams.set('paper', paper.id);
    return url.pathname.split('/').pop() + (url.search || '');
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
    if (!a) return { ok: false, note: 'Kein Abstract vorhanden; bitte die Volltextquelle prüfen.' };
    if (/National Bureau of Economic Research|Founded in 1920, the NBER|private, non-profit, non-partisan organization/i.test(a))
        return { ok: false, note: 'Wirkt wie Verlags-Boilerplate (NBER), nicht das Paper-Abstract.' };
    if (a.length < 120) return { ok: false, note: 'Sehr kurzes Abstract, evtl. unvollständig.' };
    return { ok: true };
}

// The initial paper is screenable when the currently known paper layer contains
// substantive text: a manifest-backed full text or a non-boilerplate abstract.
// A knowledge document is only the LLM reference layer and never qualifies here.
function isScreenable(p) {
    return !!(p && (hasFullText(p) || abstractQuality(p).ok));
}

function firstEntryIndex() {
    const d = curDec();
    for (let i = 0; i < papers.length; i++) {
        const rec = d[papers[i].id];
        if ((!rec || !recordRequirements(rec).ok) && isScreenable(papers[i])) return i;
    }
    for (let i = 0; i < papers.length; i++) { if (isScreenable(papers[i])) return i; }
    return 0;
}

function startIndexForPaper(requestedPaper) {
    const requestedIndex = requestedPaper
        ? papers.findIndex(function(p) { return p.id === requestedPaper; })
        : -1;
    return requestedIndex === -1 ? firstEntryIndex() : requestedIndex;
}

function evidenceLayer(ev) {
    if (ev && ev.source_layer) return ev.source_layer;
    return ev && ev.origin === 'ai' ? 'llm_distillate' : 'paper';
}

function isPaperEvidence(ev) { return evidenceLayer(ev) === 'paper'; }

// Counts evidence from the verified paper layer only. Generated knowledge-distillate
// evidence is advisory and excluded from the binding count.
function evidenceCount(rec) {
    if (!rec || !rec.evidence) return 0;
    return ALL_CATS.reduce(function(s, c) {
        return s + (rec.evidence[c] || []).filter(isPaperEvidence).length;
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
    let f = { total: papers.length, aiScreened: 0, aiIncl: 0, aiUnclear: 0, aiExcl: 0,
              humanScreened: 0, humanIncl: 0, humanUnclear: 0, humanExcl: 0, humanReasons: {} };
    papers.forEach(function(p) {
        let a = aiProposal(p), h = persp ? humanDecision(p, persp) : null;
        if (a) {
            f.aiScreened++;
            if (a.decision === 'Include') f.aiIncl++;
            else if (a.decision === 'Unclear') f.aiUnclear++;
            else f.aiExcl++;
        }
        if (h && persp !== SEED) {
            const rec = state.reviewers[persp] && state.reviewers[persp][p.id];
            if (!recordRequirements(rec).ok) h = null;
        }
        if (h) {
            f.humanScreened++;
            if (h.decision === 'Include') f.humanIncl++;
            else if (h.decision === 'Unclear') f.humanUnclear++;
            else f.humanExcl++;
            if (h.decision === 'Exclude' && h.reason) f.humanReasons[h.reason] = (f.humanReasons[h.reason] || 0) + 1;
        }
    });
    return f;
}

function reviewerLabel(k) { return k === SEED ? 'Frühere Expert:innen-Referenz' : k; }

// Surface: Screening (read + search + pin evidence)

function renderScreening() {
    let el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper geladen.</p>'; return; }
    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;

    let p = papers[state.index];
    if (renderedPaperId !== p.id) {
        state.readMode = 'full';
        renderedPaperId = p.id;
    }
    if (editingPid && editingPid !== p.id) editingPid = null; // navigating away abandons the edit; the record stays
    const dec = canEdit() && editingPid === p.id ? null : curDec()[p.id]; // saved records stay visible in read mode
    if (!dec && work.pid !== p.id) resetWork(p);

    const screened = Object.keys(curDec()).length;
    const pct = papers.length ? Math.round(screened / papers.length * 100) : 0;

    let html = '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos">Paper ' + (state.index + 1) + ' / ' + papers.length + '</span>';
    html += '<span class="pt-ws-progressbar"><span class="pt-ws-progressfill" style="width:' + pct + '%"></span></span>';
    if (canEdit()) {
        html += '<button class="pt-save-icon" id="pt-record" type="button" aria-label="Entscheidung speichern" title="Entscheidung speichern"' +
            ((dec || !state.reviewer || (!screeningHandle && !trialMode)) ? ' disabled' : '') + '>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 3h12l2 2v16H5V3Zm2 2v5h9V5H7Zm1 9v5h8v-5H8Z"></path></svg>' +
            '<span class="pt-sr-only">Entscheidung speichern</span></button>';
    }
    html += '<span class="pt-spacer"></span>';
    html += '</div>';

    html += '<div class="pt-ws pt-ws-screen">';
    html += corpusHtml();
    html += readingShellHtml(p, dec);
    html += '<aside class="pt-rail" id="pt-assess-col">' + assessInnerHtml(p, dec) + '</aside>';
    html += '<div class="pt-pinmenu" id="pt-pinmenu" hidden></div>';
    html += '</div>';

    el.innerHTML = html;
    // the load starts first: it raises readingPending synchronously, so the commit gate
    // that attachScreening evaluates sees this paper's load rather than the previous one
    loadReadingInto(p);
    attachScreening(p, dec);

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
    const total = acceptanceMode ? Object.keys(d).length : papers.length;
    let h = '<aside class="pt-nav"><div class="pt-nav-head"><span class="pt-nav-title-main">Korpus</span>' +
        '<span class="pt-tag-mono">' + Object.keys(d).length + ' / ' + total + '</span></div>';
    h += '<div class="pt-corpus-search"><input id="pt-corpus-q" aria-label="Korpus durchsuchen: Metadaten und Wissensindex" placeholder="Korpus durchsuchen" value="' + EC.escapeHtml(corpusQuery) + '">' +
        '<span class="pt-corpus-hint" id="pt-corpus-hint"></span></div>';
    h += '<div class="pt-nav-list' + (corpusQuery.trim() ? ' is-searching' : '') + '" id="pt-corpus-list">' + corpusListHtml() + '</div></aside>';
    return h;
}

// Text equivalent for the colour-only status dot in the corpus list (a screen reader
// otherwise hears nothing for the decision state), browser-agent a11y finding.
function statusLabel(st) {
    return st === 'include' ? 'eingeschlossen' : st === 'exclude' ? 'ausgeschlossen'
        : st === 'unclear' ? 'unklar' : st === 'incomplete' ? 'unvollständig' : 'offen';
}

function corpusListHtml() {
    let d = curDec();
    let q = corpusQuery.trim();
    let rows = papers.map(function(p, index) { return { paper: p, index: index, kind: '', count: 0 }; });
    if (acceptanceMode) rows = rows.filter(function(result) { return !!d[result.paper.id]; });
    if (q) {
        if (!corpusIndex) return '<p class="pt-muted pt-corpus-empty">Such-Index lädt…</p>';
        rows = corpusSearchResults(q);
        if (acceptanceMode) rows = rows.filter(function(result) { return !!d[result.paper.id]; });
        if (!rows.length) return '<p class="pt-muted pt-corpus-empty">Keine Treffer für &bdquo;' + EC.escapeHtml(corpusQuery) + '&ldquo;.</p>';
    }
    return rows.map(function(result) {
        const p = result.paper, i = result.index;
        let rec = d[p.id];
        let st = rec ? (recordRequirements(rec).ok ? rec.decision.toLowerCase() : 'incomplete') : 'none';
        const badge = q ? '<span class="pt-hit-badge">' + EC.escapeHtml(result.kind === 'Text'
            ? result.count + ' Texttreffer' : result.kind) + '</span>' : '';
        const idLabel = result.kind === 'Paper-ID' || !p.doi ? 'ID ' + p.id : 'DOI ' + p.doi;
        return '<button class="pt-nav-item' + (i === state.index ? ' active' : '') + '" data-i="' + i +
            '" data-match-kind="' + EC.escapeHtml(result.kind || '') + '">' +
            '<span class="pt-nav-dot pt-dot-' + st + '" aria-hidden="true"></span>' +
            '<span class="pt-sr-only">' + statusLabel(st) + '</span>' +
            '<span class="pt-nav-text"><span class="pt-nav-t">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</span>' +
            '<span class="pt-nav-m">' + EC.escapeHtml(p.author_year || p.authors || 'Autor:in/Jahr unbekannt') + '</span>' +
            (q ? '<span class="pt-nav-id mono">' + EC.escapeHtml(idLabel) + '</span>' : '') + '</span>' + badge + '</button>';
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
        else {
            let results = corpusSearchResults(q);
            if (acceptanceMode) results = results.filter(function(result) { return !!curDec()[result.paper.id]; });
            hint.textContent = results.length + ' Ergebnisse';
        }
    }
    if (list) list.classList.toggle('is-searching', !!corpusQuery.trim());
}

function bindCorpusItems() {
    let list = document.getElementById('pt-corpus-list'); if (!list) return;
    list.querySelectorAll('.pt-nav-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.index = parseInt(btn.dataset.i, 10);
            pendingInText = corpusQuery.trim() && btn.dataset.matchKind === 'Text' ? corpusQuery.trim() : null;
            focusReadingOnRender = true;
            renderScreening();
        });
    });
}

// ---- center: reading column (full text + in-text search) ----
function sourcePillHtml(p) {
    if (hasFullText(p)) return '<span class="pt-pill pt-source-pill pt-pill-ghost">Volltext</span>';
    if (p.abstract && p.abstract.trim()) return '<span class="pt-pill pt-source-pill pt-pill-warn">Metadaten-Abstract</span>';
    return '<span class="pt-pill pt-source-pill pt-pill-warn">kein Papertext</span>';
}

// The first paint can precede the full-text manifest; once it resolves, the pill of the
// open paper is corrected in place (no re-render, so typed search text is kept).
function refreshSourcePill() {
    const pill = document.querySelector('.pt-read-meta .pt-source-pill');
    if (!pill || !papers.length) return;
    pill.outerHTML = sourcePillHtml(papers[state.index]);
}

function normalizedDoi(raw) {
    return String(raw || '').trim()
        .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
        .replace(/^doi:\s*/i, '');
}

function doiHref(raw) {
    const doi = normalizedDoi(raw);
    return doi ? 'https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/') : '';
}

function readingShellHtml(p, dec) {
    const aq = abstractQuality(p);
    let h = '<div class="pt-read pt-read-screen"><div class="pt-read-inner">';
    h += '<div class="pt-paper-head"><div class="pt-read-meta">';
    h += sourcePillHtml(p);
    h += '<span class="pt-pill pt-pill-ghost">' + EC.escapeHtml(versionLabel(p.version_type)) + '</span>';
    if (dec) h += '<span class="pt-pill pt-pill-human pt-pill-right">erfasst</span>';
    h += '</div>';
    h += '<h1 class="pt-paper-title" id="pt-paper-title" tabindex="-1">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h1>';
    const doi = normalizedDoi(p.doi);
    const sourceUrl = normalizedSourceUrl(p.url);
    h += '<dl class="pt-paper-metadata">' +
        '<div><dt>Autor:innen</dt><dd>' + EC.escapeHtml(authorDisplay(p)) + '</dd></div>' +
        '<div><dt>Jahr</dt><dd>' + EC.escapeHtml(p.publication_year || p.year || 'nicht angegeben') + '</dd></div>' +
        (p.journal ? '<div><dt>Publikation</dt><dd>' + EC.escapeHtml(p.journal) + '</dd></div>' : '') +
        '<div><dt>Fassung</dt><dd>' + EC.escapeHtml(versionLabel(p.version_type)) +
            (p.is_preferred_version ? ' · bevorzugte Fassung' : '') + '</dd></div>' +
        '<div><dt>Begutachtung</dt><dd>' + EC.escapeHtml(peerReviewLabel(p.peer_review_status)) + '</dd></div>' +
        (doi ? '<div><dt>DOI</dt><dd class="mono"><a class="pt-doi-link" href="' + EC.escapeHtml(doiHref(doi)) +
            '" target="_blank" rel="noopener noreferrer" title="DOI ' + EC.escapeHtml(doi) + ' öffnen">' + EC.escapeHtml(doi) + '</a></dd></div>' : '') +
        '<div><dt>Paper-ID</dt><dd class="mono">' + EC.escapeHtml(p.id) + '</dd></div>' +
        (p.work_id ? '<div><dt>Werk-ID</dt><dd class="mono">' + EC.escapeHtml(p.work_id) + '</dd></div>' : '') +
        (p.version_id ? '<div><dt>Fassungs-ID</dt><dd class="mono">' + EC.escapeHtml(p.version_id) + '</dd></div>' : '') +
        ((p.work_versions || []).length > 1 ? '<div><dt>Bekannte Fassungen</dt><dd>' +
            EC.escapeHtml(p.work_versions.map(function(item) { return versionLabel(item.version_type); }).join(' · ')) +
            '</dd></div>' : '') +
        (sourceUrl ? '<div><dt>Quelle</dt><dd><a class="pt-source-link" href="' + EC.escapeHtml(sourceUrl) +
            '" target="_blank" rel="noopener noreferrer">Webseite öffnen</a></dd></div>' : '') + '</dl></div>';
    if (!aq.ok && !p.knowledge_doc) h += '<div class="pt-aq-warn">Achtung: ' + EC.escapeHtml(aq.note) + '</div>';

    h += '<article class="pt-reading-surface" aria-label="Papertext">';
    h += '<div class="pt-layer-toggle" id="pt-layer-toggle" hidden>' +
        '<button type="button" class="pt-layer-btn active" data-mode="full" aria-pressed="true">Volltext</button>' +
        '<button type="button" class="pt-layer-btn" data-mode="ai" aria-pressed="false">LLM-Wissensdestillat</button>' +
        '</div>';
    h += '<div class="pt-intext-bar">' +
        '<input id="pt-intext" aria-label="Im Text suchen" placeholder="Im Text suchen (Enter = nächster Treffer)">' +
        '<span class="pt-tag-mono" id="pt-intext-count"></span>' +
        '<button class="pt-intext-nav" id="pt-intext-prev" title="vorheriger Treffer">&lsaquo;</button>' +
        '<button class="pt-intext-nav" id="pt-intext-next" title="nächster Treffer">&rsaquo;</button>' +
        (canEdit() ? '<button class="pt-btn pt-pin-hit" id="pt-pin-hit" disabled title="Aktuellen Treffer als Beleg anheften">Treffer anheften</button>' : '') +
        '</div>';
    h += '<div class="pt-search-key" id="pt-search-key" hidden><span aria-hidden="true"></span>Aktueller Suchtreffer im Lesetext</div>';
    h += '<div class="pt-layer-band" id="pt-layer-band" hidden>LLM-Wissensdestillat aus dem Wissensdokument. Diese automatisch erzeugte Referenz ist vom Originaltext getrennt; Belege daraus erfüllen das Paper-Beleg-Gate nicht.</div>';
    h += '<div class="pt-doc" id="pt-doc"><p class="pt-muted">Volltext lädt…</p></div>';
    h += '</article></div></div>';
    return h;
}

// Two epistemic layers by source (M3, ADR-016): the human "Volltext" layer is the original
// Docling full text; the LLM knowledge distillate is generated from the knowledge document.
function loadReadingInto(p) {
    const my = ++readToken;
    readingPending = true;
    currentTextSource = 'none'; // nothing of this paper is shown until its response is applied
    // both fetch helpers swallow their own errors, so the rejection arm is unreachable
    // today; it stays because without it one throwing helper would leave readingPending
    // raised and block every commit for the rest of the session
    Promise.all([fetchFullText(p), fetchPaperText(p)]).then(
        function(res) { applyReading(my, p, res[0], res[1]); },
        function() { applyReading(my, p, null, null); }
    );
}

// Apply a reading response. A response whose token is no longer current belongs to a
// paper the reviewer has already left; it is dropped so a slow load can never paint
// over the paper opened later (out-of-order regression, pilot). Returns whether applied.
function applyReading(token, p, full, kdmd) {
    if (token !== readToken) return false;
    readingPending = false;
    docHtmlAi = kdmd ? renderMarkdown(splitDocLayers(kdmd).ai || '') : '';
    if (full && full.trim()) {
        docHtmlPaper = renderMarkdown(paperBodyMarkdown(full, p));
        currentTextSource = 'raw';
    } else if (p.abstract && p.abstract.trim()) {
        docHtmlPaper = '<p class="pt-doc-p">' + inlineMd(p.abstract) + '</p>';
        currentTextSource = 'abstract';
    } else {
        docHtmlPaper = '';
        currentTextSource = 'none';
    }
    if (state.readMode === 'ai' && !referenceLayerAvailable()) state.readMode = 'full';
    updateLayerToggle();
    paintActiveLayer();
    docMarks = []; docMarkIdx = 0; appliedInTextQuery = '';
    if (pendingInText) {
        let box = document.getElementById('pt-intext');
        if (box) box.value = pendingInText;
        applyInText(pendingInText);
        pendingInText = null;
    }
    // re-evaluate the commit gate; #pt-record exists only in the unlocked form, which is
    // also what an edit renders, so a paper reopened for editing is covered too
    if (document.getElementById('pt-record')) refreshAssess();
    return true;
}

function referenceLayerAvailable() {
    const paper = papers[state.index];
    return !!(docHtmlAi && paper && (acceptanceMode || (runActor !== 'agent' && curDec()[paper.id])));
}

function activeLayerHtml() { return state.readMode === 'ai' && referenceLayerAvailable() ? docHtmlAi : docHtmlPaper; }

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
    if (tg) tg.hidden = !referenceLayerAvailable();
    document.querySelectorAll('.pt-layer-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.mode === state.readMode);
        b.setAttribute('aria-pressed', b.dataset.mode === state.readMode ? 'true' : 'false');
    });
}

function setReadMode(mode) {
    if (mode === 'ai' && !referenceLayerAvailable()) return;
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
    let key = document.getElementById('pt-search-key');
    q = (q || '').trim();
    appliedInTextQuery = q;
    if (q.length < 2) { if (cnt) cnt.textContent = ''; if (pinBtn) pinBtn.disabled = true; if (key) key.hidden = true; return; }
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
    if (key) key.hidden = docMarks.length === 0;
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
    if (cnt) cnt.textContent = 'Treffer ' + (docMarkIdx + 1) + ' von ' + docMarks.length;
}

function snippetAround(el, term) {
    const ctx = el && el.parentNode ? (el.parentNode.textContent || '') : term;
    let i = ctx.toLowerCase().indexOf(term.toLowerCase());
    if (i === -1) return term;
    let start = Math.max(0, i - 90), end = Math.min(ctx.length, i + term.length + 90);
    return (start > 0 ? '…' : '') + ctx.slice(start, end).trim() + (end < ctx.length ? '…' : '');
}

// ---- evidence pinning (FR-13) ----
// Source layer and acting reviewer are separate provenance dimensions. The legacy
// origin field is retained for existing files; source_layer is authoritative for
// new evidence. A paper pin starts an empty category at level 1 so evidence capture
// cannot silently assert that the category is central.
function pinEvidence(cat, term, snippet, origin) {
    if (!canEdit()) return;
    origin = origin === 'ai' ? 'ai' : 'human';
    const sourceLayer = origin === 'ai' ? 'llm_distillate' : 'paper';
    term = (term || '').trim().slice(0, 80);
    snippet = (snippet || term).trim().slice(0, 260);
    if (!term) return;
    if (!work.evidence[cat]) work.evidence[cat] = [];
    work.evidence[cat].push({
        term: term, snippet: snippet, ts: new Date().toISOString(), origin: origin,
        source_layer: sourceLayer, actor: runActor,
        paper_id: papers[state.index] && papers[state.index].id,
        work_id: papers[state.index] && papers[state.index].work_id,
        version_id: papers[state.index] && papers[state.index].version_id
    });
    if (sourceLayer === 'paper' && catLevel(work.cats[cat]) === 0) work.cats[cat] = 1;
    refreshAssess();
}

function unpinEvidence(cat, idx) {
    if (!canEdit()) return;
    if (work.evidence[cat]) {
        work.evidence[cat].splice(idx, 1);
        if (!work.evidence[cat].length) delete work.evidence[cat];
    }
    refreshAssess();
}

// Existing annotations are revealed only after the reviewer has saved a decision.
function seedRefHtml(p) {
    const seed = seedDecision(p);
    if (!seed) return '';
    const setCats = ALL_CATS.filter(function(c) { return seed.categories[c]; });
    let h = '<div class="pt-reference-card"><span class="pt-tag-mono">Frühere Expert:innen-Referenz</span>' +
        '<strong class="pt-dec-' + seed.decision.toLowerCase() + '">' + seed.decision + '</strong>';
    if (setCats.length) h += '<div class="pt-seed-cats">' + setCats.map(function(c) {
        return '<span class="pt-pill pt-pill-human">' + EC.escapeHtml(CAT_LABELS[c]) + '</span>';
    }).join('') + '</div>';
    const bm = p.benchmark;
    if (bm && bm.agreement === 'disagree') {
        const aff = (bm.affected_categories || []).map(function(c) { return CAT_LABELS[c] || c; });
        h += '<div class="pt-diverg"><span class="pt-pill pt-pill-warn">Frühere Abweichung</span>' +
            (aff.length ? '<span class="pt-muted">' + EC.escapeHtml(aff.join(', ')) + '</span>' : '') + '</div>';
    }
    return h + '</div>';
}

function paperEvidenceMissing(cats, evidence) {
    return ALL_CATS.filter(function(c) {
        if (catLevel((cats || {})[c]) === 0) return false;
        return !((evidence && evidence[c]) || []).some(isPaperEvidence);
    });
}

// Backward-compatible test and integration seam.
function humanEvidenceMissing(cats, evidence) { return paperEvidenceMissing(cats, evidence); }

function recordRequirements(dec) {
    if (!dec) return { ok: false, missing: ['Entscheidung'] };
    const missing = paperEvidenceMissing(dec.categories || {}, dec.evidence || {})
        .map(function(c) { return 'Paper-Beleg: ' + CAT_LABELS[c]; });
    if (dec.decision === 'Include')
        analysisRequirements(dec).missing.forEach(function(x) { missing.push(x); });
    return { ok: missing.length === 0, missing: missing };
}

// PRISM verification is an explicit, append-only layer on top of the binding
// screening decision. A legacy capture remains below AI-agent review until the
// governed projection records that activity. Ordinary screening never creates a
// lifecycle or scholarly authority by accident.
function isLifecycleState(value) { return LIFECYCLE_STATES.indexOf(value) !== -1; }

function recordSourceSummary(record) {
    const evidence = record && record.evidence ? record.evidence : {};
    const categories = Object.keys(evidence).filter(function(key) { return (evidence[key] || []).length; });
    const source = record && record.text_source ? record.text_source : 'unrecorded';
    return [{ source_id: source, categories: categories }];
}

function legacyProvenance(record) {
    const actorId = record && record.reviewer ? record.reviewer : null;
    const actorType = record && record.actor === 'agent' ? 'ai_agent' : 'person';
    const actors = actorId ? [{ id: actorId, type: actorType, roles: ['screening'] }] : [];
    return {
        annotation_id: null,
        annotation_type: 'legacy-migrated',
        activities: [{
            id: 'legacy-migration', type: 'legacy_migration', run_id: null,
            method: null, prompt: null, model: null,
            associated_actor_ids: actorId ? [actorId] : []
        }],
        actors: actors,
        used_sources: recordSourceSummary(record),
        derived_from: [],
        legacy_gap: 'Lauf, Prompt und Modell wurden für diesen vorbestehenden Record nicht vollständig überliefert.'
    };
}

function normalizeProvenance(record) {
    const fallback = legacyProvenance(record);
    const hasProvenance = !!(record && record.provenance && typeof record.provenance === 'object');
    const source = hasProvenance ? record.provenance : {};
    const rawActivities = Array.isArray(source.activities) ? source.activities : (source.activity ? [source.activity] : (hasProvenance ? [] : fallback.activities));
    const rawActors = Array.isArray(source.actors) ? source.actors : (hasProvenance ? [] : fallback.actors);
    return {
        annotation_id: Object.prototype.hasOwnProperty.call(source, 'annotation_id') ? source.annotation_id : fallback.annotation_id,
        annotation_type: source.annotation_type || fallback.annotation_type,
        activities: rawActivities.map(function(activity, index) {
            activity = activity || {};
            return {
                id: activity.id || ('legacy-activity-' + (index + 1)), type: activity.type || 'unspecified',
                run_id: activity.run_id || null, method: activity.method || null,
                prompt: activity.prompt || null, model: activity.model || null,
                associated_actor_ids: actorIds(activity.associated_actor_ids)
            };
        }),
        actors: rawActors.map(function(actor) {
            actor = actor || {};
            const type = ['person', 'ai_agent', 'software_agent'].indexOf(actor.type) !== -1 ? actor.type : 'person';
            return { id: String(actor.id || ''), type: type, roles: actorIds(actor.roles) };
        }).filter(function(actor) { return !!actor.id; }),
        used_sources: Array.isArray(source.used_sources) ? source.used_sources : (hasProvenance ? [] : fallback.used_sources),
        derived_from: Array.isArray(source.derived_from) ? source.derived_from : (hasProvenance ? [] : fallback.derived_from),
        legacy_gap: source.legacy_gap || (source.activity && source.activity.legacy_gap) || (!hasProvenance ? fallback.legacy_gap : null)
    };
}

function legacyBaseline(record) {
    return {
        state: record && record.actor === 'agent' ? 'agent-annotated' : 'curated',
        basis: 'legacy_capture',
        at: record && record.ts ? record.ts : null,
        actor_ids: actorIds(record && record.reviewer)
    };
}

function normalizeBaseline(value, record) {
    const fallback = legacyBaseline(record);
    if (typeof value === 'string' && isLifecycleState(value)) {
        fallback.state = value;
        return fallback;
    }
    if (!value || typeof value !== 'object') return fallback;
    return {
        state: isLifecycleState(value.state) ? value.state : fallback.state,
        basis: value.basis || fallback.basis,
        at: value.at || fallback.at,
        actor_ids: actorIds(value.actor_ids)
    };
}

function verificationView(record) {
    const source = record && typeof record === 'object' ? record : {};
    const lifecycle = source.lifecycle && typeof source.lifecycle === 'object' ? source.lifecycle : null;
    const baseline = normalizeBaseline(lifecycle && lifecycle.baseline, source);
    const stateValue = lifecycle && isLifecycleState(lifecycle.state) ? lifecycle.state : baseline.state;
    return {
        lifecycle: {
            baseline: baseline,
            state: stateValue,
            events: lifecycle && Array.isArray(lifecycle.events) ? lifecycle.events.slice() : []
        },
        provenance: normalizeProvenance(source),
        annotations: Array.isArray(source.annotations) ? source.annotations.slice() : [],
        active_annotation_id: source.active_annotation_id || null,
        checks: Array.isArray(source.checks) ? source.checks.slice() : [],
        legacy: !lifecycle || !source.provenance
    };
}

function ensureVerificationContract(record) {
    const view = verificationView(record);
    record.lifecycle = view.lifecycle;
    record.provenance = view.provenance;
    if (!Array.isArray(record.annotations) || !record.annotations.length) {
        const annotationId = record.provenance.annotation_id || verificationEventId();
        const screeningActors = record.provenance.actors.filter(function(actor) {
            return actor.roles.indexOf('screening') !== -1;
        }).map(function(actor) { return actor.id; });
        record.annotations = [{
            annotation_id: annotationId,
            annotation_type: 'screening_decision',
            at: record.ts || new Date().toISOString(),
            actor_ids: screeningActors.length ? screeningActors : actorIds(record.reviewer),
            body: annotationBody(record)
        }];
        record.active_annotation_id = annotationId;
    }
    if (!Array.isArray(record.checks)) record.checks = [];
    return record;
}

function actorIds(value) {
    const raw = Array.isArray(value) ? value : String(value || '').split(/[;,\s]+/);
    return raw.map(function(id) { return String(id || '').trim(); }).filter(function(id, index, all) {
        return !!id && all.indexOf(id) === index;
    });
}

function verificationEventId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return 'prism-' + window.crypto.randomUUID();
    return 'prism-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

const ANNOTATION_BODY_FIELDS = ['categories', 'decision', 'override', 'reason', 'override_reason', 'evidence', 'analysis', 'text_source', 'ts', 'reviewer', 'actor'];

function annotationBody(record) {
    const body = {};
    ANNOTATION_BODY_FIELDS.forEach(function(field) {
        if (Object.prototype.hasOwnProperty.call(record || {}, field))
            body[field] = JSON.parse(JSON.stringify(record[field]));
    });
    return body;
}

function applyAnnotationBody(record, body) {
    ANNOTATION_BODY_FIELDS.forEach(function(field) {
        if (Object.prototype.hasOwnProperty.call(body, field))
            record[field] = JSON.parse(JSON.stringify(body[field]));
        else
            delete record[field];
    });
}

function annotationDiff(before, after, path) {
    path = path || '';
    if (JSON.stringify(before) === JSON.stringify(after)) return [];
    const beforeObject = before && typeof before === 'object' && !Array.isArray(before);
    const afterObject = after && typeof after === 'object' && !Array.isArray(after);
    if (beforeObject && afterObject) {
        const keys = Object.keys(Object.assign({}, before, after)).sort();
        return keys.reduce(function(changes, key) {
            const escaped = key.replace(/~/g, '~0').replace(/\//g, '~1');
            return changes.concat(annotationDiff(before[key], after[key], path + '/' + escaped));
        }, []);
    }
    return [{
        path: path || '/',
        before: before === undefined ? { status: 'absent' } : JSON.parse(JSON.stringify(before)),
        after: after === undefined ? { status: 'absent' } : JSON.parse(JSON.stringify(after))
    }];
}

function correctedAnnotationBody(record, value) {
    let body;
    try {
        body = typeof value === 'string' ? JSON.parse(value) : JSON.parse(JSON.stringify(value || {}));
    } catch (error) {
        return { ok: false, message: 'Die korrigierte Annotation ist kein gültiges JSON.' };
    }
    if (!body || typeof body !== 'object' || Array.isArray(body))
        return { ok: false, message: 'Die korrigierte Annotation muss ein JSON-Objekt sein.' };
    const current = annotationBody(record);
    ['ts', 'reviewer', 'actor'].forEach(function(field) {
        if (!Object.prototype.hasOwnProperty.call(body, field) && Object.prototype.hasOwnProperty.call(current, field))
            body[field] = current[field];
    });
    if (body.decision !== finalDecisionOf(body.categories || {}, !!body.override))
        return { ok: false, message: 'Decision, Kategorien und Override sind nicht konsistent.' };
    if (body.decision === 'Exclude' && !body.reason)
        return { ok: false, message: 'Eine korrigierte Exclude-Entscheidung braucht einen Ausschlussgrund.' };
    if (body.override && body.decision === 'Include' && !String(body.override_reason || '').trim())
        return { ok: false, message: 'Ein korrigierter Include-Override braucht eine Begründung.' };
    const requirements = recordRequirements(body);
    if (!requirements.ok)
        return { ok: false, message: 'Die korrigierte Annotation ist unvollständig: ' + requirements.missing.join(', ') + '.' };
    const changes = annotationDiff(current, body);
    if (!changes.length)
        return { ok: false, message: 'Für corrected_and_accepted ist mindestens eine fachliche Änderung erforderlich.' };
    return { ok: true, body: body, changes: changes };
}

function advanceVerification(record, target, details) {
    if (!canEdit()) return { ok: false, message: 'Zum Ändern zuerst Bearbeiten aktivieren.' };
    if (!record || typeof record !== 'object') return { ok: false, message: 'Kein Decision Record geladen.' };
    if (!isLifecycleState(target)) return { ok: false, message: 'Unzulässiger Zielstatus.' };
    const reviewer = String(details && details.reviewer_id || '').trim();
    const activity = String(details && details.activity_id || '').trim();
    const actors = actorIds(details && details.actor_ids);
    const note = String(details && details.note || '').trim();
    if (!reviewer) return { ok: false, message: 'Reviewer-ID ist erforderlich.' };
    if (!activity) return { ok: false, message: 'Activity-ID ist erforderlich.' };
    if (!actors.length) return { ok: false, message: 'Mindestens eine Actor-ID ist erforderlich.' };
    if (!note) return { ok: false, message: 'Eine fachliche Begründung ist erforderlich.' };
    if (actors.indexOf(reviewer) === -1) actors.unshift(reviewer);

    const from = verificationView(record).lifecycle.state;
    if (LIFECYCLE_NEXT[from] !== target)
        return { ok: false, message: 'Statuswechsel ' + from + ' → ' + target + ' ist nicht zulässig.' };
    ensureVerificationContract(record);

    const isVerification = from === 'ai-agent-reviewed';
    const result = String(details && details.result || (isVerification ? 'accepted' : 'approved'));
    const allowed = isVerification
        ? ['accepted', 'corrected_and_accepted', 'changes_requested', 'rejected']
        : ['approved'];
    if (allowed.indexOf(result) === -1)
        return { ok: false, message: 'Unzulässiges Prüfergebnis.' };

    let correction = null;
    if (result === 'corrected_and_accepted') {
        correction = correctedAnnotationBody(record, details && details.corrected_annotation);
        if (!correction.ok) return correction;
    }
    const advances = ['accepted', 'corrected_and_accepted', 'approved'].indexOf(result) !== -1;
    const actualTarget = advances ? target : from;
    const at = new Date().toISOString();

    const event = {
        event_id: verificationEventId(), event_type: isVerification ? 'domain_expert_verification' : 'publication_approval',
        from: from, to: actualTarget, result: result, note: note,
        at: at, activity_id: activity, actor_ids: actors,
        annotation_id: record.active_annotation_id
    };
    const role = isVerification ? 'domain_expert' : 'publication_approval';
    const provenanceActors = record.provenance.actors = record.provenance.actors || [];
    actors.forEach(function(id) {
        let actor = provenanceActors.find(function(item) { return item.id === id; });
        if (!actor) { actor = { id: id, type: 'person', roles: [] }; provenanceActors.push(actor); }
        actor.type = 'person';
        actor.roles = actorIds(actor.roles);
        if (actor.roles.indexOf(role) === -1) actor.roles.push(role);
    });
    let namedReviewer = provenanceActors.find(function(item) { return item.id === reviewer; });
    if (!namedReviewer) { namedReviewer = { id: reviewer, type: 'person', roles: [] }; provenanceActors.push(namedReviewer); }
    namedReviewer.type = 'person';
    namedReviewer.roles = actorIds(namedReviewer.roles);
    if (namedReviewer.roles.indexOf(role) === -1) namedReviewer.roles.push(role);
    let activityRecord = record.provenance.activities.find(function(item) { return item.id === activity; });
    if (!activityRecord) {
        activityRecord = {
            id: activity,
            type: event.event_type,
            run_id: activity,
            method: isVerification
                ? 'prism_domain_expert_verification'
                : 'prism_publication_approval',
            prompt: {
                status: 'recorded',
                reference: 'knowledge/update-protocol.md#1.1-agent-assisted-completion-and-deferred-verification'
            },
            model: { status: 'not_applicable', value: 'not_applicable' },
            associated_actor_ids: []
        };
        record.provenance.activities.push(activityRecord);
    }
    activityRecord.associated_actor_ids = actorIds(activityRecord.associated_actor_ids);
    actors.forEach(function(id) { if (activityRecord.associated_actor_ids.indexOf(id) === -1) activityRecord.associated_actor_ids.push(id); });
    if (correction) {
        const correctionId = verificationEventId();
        record.annotations.push({
            annotation_id: correctionId,
            annotation_type: 'domain_expert_correction',
            supersedes: record.active_annotation_id,
            at: at,
            actor_ids: actors,
            reason: note,
            changes: correction.changes,
            body: correction.body
        });
        record.active_annotation_id = correctionId;
        event.annotation_id = correctionId;
        applyAnnotationBody(record, correction.body);
    }
    record.lifecycle.events.push(event);
    record.lifecycle.state = actualTarget;
    return { ok: true, event: event, record: record };
}

function verificationValue(value, empty) {
    if (value === null || value === undefined || value === '') return '<span class="pt-verify-empty">' + EC.escapeHtml(empty || 'Nicht überliefert') + '</span>';
    if (Array.isArray(value)) return value.length ? EC.escapeHtml(value.join(', ')) : '<span class="pt-verify-empty">' + EC.escapeHtml(empty || 'Keine Angabe') + '</span>';
    if (typeof value === 'object') return EC.escapeHtml(JSON.stringify(value));
    return EC.escapeHtml(String(value));
}

function verificationPanelHtml(record) {
    const view = verificationView(record);
    const lifecycle = view.lifecycle, provenance = view.provenance || {}, activities = provenance.activities || [], actors = provenance.actors || [];
    const canAdvance = ['ai-agent-reviewed', 'verified'].indexOf(lifecycle.state) !== -1 &&
        !!LIFECYCLE_NEXT[lifecycle.state] && canEdit() && runActor === 'human';
    const target = LIFECYCLE_NEXT[lifecycle.state];
    let h = '<section class="pt-verification" aria-labelledby="pt-verification-title">';
    h += '<div class="pt-verification-head"><div><span class="pt-tag-mono">PRISM-Verifikation</span><h3 id="pt-verification-title">Nachweis- und Freigabestatus</h3></div>' +
        '<span class="pt-lifecycle-state pt-lifecycle-' + EC.escapeHtml(lifecycle.state) + '">' + EC.escapeHtml(lifecycle.state) + '</span></div>';
    h += '<p class="pt-verification-lead">Fachliche Verifikation und öffentliche Freigabe sind getrennte, dauerhaft protokollierte Schritte.</p>';
    h += '<dl class="pt-verification-grid"><div><dt>Baseline</dt><dd>' + verificationValue(lifecycle.baseline.state) + '</dd></div><div><dt>Baseline-Basis</dt><dd>' + verificationValue(lifecycle.baseline.basis) + '</dd></div><div><dt>Baseline-Actors</dt><dd>' + verificationValue(lifecycle.baseline.actor_ids) + '</dd></div><div><dt>Baseline-Zeit</dt><dd>' + verificationValue(lifecycle.baseline.at) + '</dd></div><div><dt>Aktueller Status</dt><dd>' + verificationValue(lifecycle.state) + '</dd></div>' +
        '<div><dt>Annotation</dt><dd>' + verificationValue(provenance.annotation_id) + ' · ' + verificationValue(provenance.annotation_type) + '</dd></div>' +
        '<div><dt>Actors</dt><dd>' + verificationValue(actors.map(function(actor) { return actor.id + ' (' + actor.type + '; ' + actor.roles.join(', ') + ')'; })) + '</dd></div></dl>';
    h += '<div class="pt-verification-provenance"><h4>Ausführungsprovenienz</h4>' + (activities.length ? activities.map(function(activity) {
        return '<div class="pt-verification-activity"><p><strong>' + EC.escapeHtml(activity.id) + '</strong> · ' + EC.escapeHtml(activity.type) + '</p><dl class="pt-verification-grid"><div><dt>Run</dt><dd>' + verificationValue(activity.run_id) + '</dd></div><div><dt>Methode</dt><dd>' + verificationValue(activity.method) + '</dd></div><div><dt>Prompt</dt><dd>' + verificationValue(activity.prompt) + '</dd></div><div><dt>Modell</dt><dd>' + verificationValue(activity.model) + '</dd></div><div><dt>Actors</dt><dd>' + verificationValue(activity.associated_actor_ids) + '</dd></div></dl></div>';
    }).join('') : '<p class="pt-muted">Keine Aktivitätsprovenienz.</p>');
    if (provenance.legacy_gap) h += '<p class="pt-legacy-gap"><strong>legacy_gap:</strong> ' + EC.escapeHtml(String(provenance.legacy_gap)) + '</p>';
    h += '</div>';
    h += '<div class="pt-verification-tracks"><h4>Quellen und abgeleitete Artefakte</h4><p><strong>Quellen:</strong> ' + verificationValue(provenance.used_sources, 'Keine Quellenprovenienz') + '</p><p><strong>Abgeleitet aus:</strong> ' + verificationValue(provenance.derived_from, 'Keine abgeleiteten Artefakte') + '</p></div>';
    h += '<div class="pt-verification-annotations"><h4>Annotationen</h4>' + (view.annotations.length ? '<ol>' + view.annotations.map(function(annotation) {
        const active = annotation.annotation_id === view.active_annotation_id ? ' · aktiv' : '';
        const supersedes = annotation.supersedes ? ' · ersetzt ' + annotation.supersedes : '';
        return '<li><strong>' + verificationValue(annotation.annotation_id) + '</strong><span>' + verificationValue(annotation.annotation_type) + active + supersedes + ' · ' + verificationValue(annotation.at) + '</span></li>';
    }).join('') + '</ol>' : '<p class="pt-muted">Keine Annotationen dokumentiert.</p>') + '</div>';
    h += '<div class="pt-verification-checks"><h4>Deterministische Validierungen</h4>' + (view.checks.length ? '<ol>' + view.checks.map(function(check) {
        return '<li><strong>' + verificationValue(check.check_type) + ': ' + verificationValue(check.status) + '</strong><span>' + verificationValue(check.at) + ' · ' + verificationValue(check.actor_id) + '</span></li>';
    }).join('') + '</ol>' : '<p class="pt-muted">Keine persistierte Validierungsquittung. Die fachliche Verifikation ersetzt diesen Check nicht.</p>') + '</div>';
    h += '<div class="pt-verification-events"><h4>Eventverlauf</h4>' + (lifecycle.events.length ? '<ol>' + lifecycle.events.map(function(event) {
        return '<li><strong>' + EC.escapeHtml(event.from || '?') + ' → ' + EC.escapeHtml(event.to || '?') + '</strong><span>' + verificationValue(event.event_type) + ' · ' + verificationValue(event.result) + ' · ' + verificationValue(event.at) + ' · ' + verificationValue(event.actor_ids) + '</span>' + (event.note ? '<p>' + EC.escapeHtml(event.note) + '</p>' : '') + '</li>';
    }).join('') + '</ol>' : '<p class="pt-muted">Noch kein Verifikationsereignis dokumentiert.</p>') + '</div>';
    if (canAdvance) {
        const isVerification = target === 'verified';
        const action = isVerification ? 'Fachliches Ergebnis protokollieren' : 'Öffentliche Freigabe bestätigen';
        h += '<form class="pt-verification-action" id="pt-verification-action"><h4>' + (isVerification ? 'Fachliche Verifikation' : 'Öffentliche Freigabe') + '</h4>' +
            '<label>Reviewer-ID<input name="reviewer_id" required autocomplete="off"></label><label>Actor-ID(s)<input name="actor_ids" required autocomplete="off" aria-describedby="pt-verification-actors"></label><span id="pt-verification-actors" class="pt-field-help">Mehrere IDs mit Leerzeichen oder Komma trennen.</span><label>Activity-ID<input name="activity_id" required autocomplete="off"></label>' +
            (isVerification ? '<label>Prüfergebnis<select name="result"><option value="accepted">Akzeptiert</option><option value="corrected_and_accepted">Korrigiert und akzeptiert</option><option value="changes_requested">Änderungen erforderlich</option><option value="rejected">Abgelehnt</option></select></label><label class="pt-correction-editor" hidden>Korrigierte Annotation als JSON<textarea name="corrected_annotation" rows="14">' + EC.escapeHtml(JSON.stringify(annotationBody(record), null, 2)) + '</textarea><span class="pt-field-help">Die vollständige Annotation wird als neue Version gespeichert. Das Original bleibt erhalten.</span></label>' : '') +
            '<label>Begründung<textarea name="note" rows="3" required></textarea></label>' +
            '<button class="pt-btn pt-verification-submit" type="submit">' + action + '</button></form>';
    } else if (lifecycle.state === 'publication-approved') {
        h += '<p class="pt-publication-approved">Öffentliche Freigabe ist dokumentiert.</p>';
    } else if (view.legacy) {
        h += '<p class="pt-legacy-gap">Dieser ältere Record besitzt keinen gouvernierten AI-Agent-Review-Status. Er muss zuerst durch den aktuellen Projektionsworkflow in Schema 0.5 überführt werden.</p>';
    } else if (runActor !== 'human') {
        h += '<p class="pt-legacy-gap">Eine Domänenexpertin oder ein Domänenexperte muss diesen Statuswechsel im fachlichen Verifikationsmodus dokumentieren.</p>';
    }
    h += '<p class="pt-verification-status" id="pt-verification-status" role="status" aria-live="polite">' + EC.escapeHtml(verificationNotice) + '</p></section>';
    return h;
}

function workingDecisionRecord() {
    const decision = finalDecisionOf(work.cats, work.override);
    if (decision === 'Include') work.analysis = sanitizeAnalysis(work.analysis || {}, currentTextSource);
    return {
        categories: work.cats,
        decision: decision,
        override: !!work.override,
        evidence: work.evidence,
        analysis: work.analysis,
        text_source: currentTextSource
    };
}

// ---- right: assessment (categories + evidence + derived decision + collapsed AI) ----
function assessInnerHtml(p, dec) {
    if (dec) return assessLockedHtml(p, dec);
    if (!canEdit()) return '<div class="pt-rail-head"><span class="pt-rail-title">Bewertung</span></div>' +
        '<div class="pt-rail-body"><p class="pt-muted pt-read-only-note">Für dieses Paper ist in diesem Browser keine eigene Bewertung geladen. Mit „Bearbeiten“ kannst du eine Bewertung erfassen oder deinen Arbeitsordner verbinden.</p></div>';
    let cats = work.cats;
    let h = '<div class="pt-rail-head"><span class="pt-rail-title">Deine Bewertung</span></div>';
    h += '<div class="pt-rail-body"><div class="pt-rail-scroll">';
    h += dimHtml('Gegenstand', TECH_CATS, cats, false);
    h += dimHtml('Perspektive', SOCIAL_CATS, cats, false);
    h += evidenceListHtml(work.evidence, false);
    const draft = workingDecisionRecord();
    if (draft.decision === 'Include') h += analysisPanelHtml(draft, false);
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
    h += '</div><div class="pt-action-dock">';
    h += '<div class="pt-logic" id="pt-logic">' + logicInner(cats, work.override) + '</div>';
    h += '<span class="pt-actions-hint" id="pt-actions-hint" role="status" aria-live="polite"></span>';
    h += '</div></div>';
    return h;
}

function assessLockedHtml(p, dec) {
    let cats = dec.categories || {};
    const req = recordRequirements(dec);
    let h = '<div class="pt-rail-head"><span class="pt-rail-title">' + (canEdit() ? 'Deine Bewertung' : 'Gespeicherte Bewertung') + '</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-' + decCls(dec.decision) + ' pt-pill-lg">' + dec.decision + '</span></div>';
    h += '<div class="pt-rail-body"><div class="pt-rail-scroll">';
    if (dec.decision === 'Exclude' && dec.reason) h += '<div class="pt-seed-ref">Ausschlussgrund: <strong>' + EC.escapeHtml(dec.reason.replace(/_/g, ' ')) + '</strong></div>';
    if (dec.decision === 'Include' && dec.override && dec.override_reason) h += '<div class="pt-seed-ref">Override zu Include &middot; Begruendung: <strong>' + EC.escapeHtml(dec.override_reason) + '</strong></div>';
    h += dimHtml('Gegenstand', TECH_CATS, cats, true);
    h += dimHtml('Perspektive', SOCIAL_CATS, cats, true);
    h += evidenceListHtml(dec.evidence || {}, true);
    h += analysisPanelHtml(dec, true);
    h += referenceComparisonHtml(p);
    if (verificationMode) h += verificationPanelHtml(dec);
    h += '</div><div class="pt-action-dock pt-action-dock-locked">' +
        '<div class="pt-record-summary"><span class="pt-tag-mono">Gespeicherte Entscheidung</span>' +
        '<span class="pt-pill pt-pill-' + decCls(dec.decision) + '">' + dec.decision + '</span></div>' +
        '<span class="pt-actions-hint ' + (req.ok ? 'is-complete' : 'is-required') + '" role="status">' +
        (req.ok ? 'Vollständig erfasst.' : 'Noch erforderlich: ' + EC.escapeHtml(req.missing.join(', '))) + '</span>' +
        '<div class="pt-actions">' + (canEdit() ? '<button class="pt-revise-btn" id="pt-revise">Überarbeiten</button>' : '') + '<span class="pt-spacer"></span>' +
        '<button class="pt-next-btn" id="pt-next"' + (canEdit() && !req.ok ? ' disabled' : '') + '>' +
        (acceptanceMode ? 'Anderer Abnahmefall' : (state.index < papers.length - 1 ? 'Nächstes offen' : 'Zum ersten offenen')) + ' &rarr;</button></div>' +
        '</div></div>';
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

// The category action and its definition are separate keyboard targets. The definition
// opens in a rail- and viewport-clamped popover instead of covering adjacent controls.
function chipHtml(cat, level, locked) {
    const lvl = catLevel(level);
    const stateCls = lvl === 2 ? ' on' : (lvl === 1 ? ' partial' : '');
    const tipId = 'pt-chip-tip-' + cat;
    return '<span class="pt-chip-wrap"><button class="pt-chip' + stateCls + '" data-cat="' + cat + '" data-level="' + lvl + '"' +
        ' aria-label="' + EC.escapeHtml(CAT_LABELS[cat]) + ', ' + CAT_STATE[lvl] + '"' +
        (locked ? ' disabled' : '') + '>' +
        '<span class="pt-chip-box" aria-hidden="true"></span>' + EC.escapeHtml(CAT_LABELS[cat]) +
        (lvl ? '<span class="pt-chip-state" aria-hidden="true">' + CAT_STATE[lvl] + '</span>' : '') +
        '</button><button type="button" class="pt-info-btn pt-chip-info" aria-label="Definition zu ' +
        EC.escapeHtml(CAT_LABELS[cat]) + ' anzeigen" aria-expanded="false" aria-controls="' + tipId +
        '" aria-describedby="' + tipId + '" data-info-target="' + tipId + '">i</button><span class="pt-info-popover pt-chip-tip" role="tooltip" id="' + tipId +
        '" hidden><b class="mono">' + cat + '</b><span>' + EC.escapeHtml(CAT_DEFS[cat] || '') + '</span></span></span>';
}

function evidenceHeaderHtml() {
    return '<div class="pt-evid-head"><span class="pt-tag-mono">Belege</span>' +
        '<button type="button" class="pt-info-btn" aria-label="Hinweise zum Anheften von Belegen anzeigen" ' +
        'aria-expanded="false" aria-controls="pt-evid-help" aria-describedby="pt-evid-help" data-info-target="pt-evid-help">i</button>' +
        '<span class="pt-info-popover" role="tooltip" id="pt-evid-help" hidden>Markiere eine Textstelle oder suche im Papertext. ' +
        'Hefte sie an die passende Kategorie. Ein Paper-Beleg setzt eine leere Kategorie zunächst auf teilweise; ja wählst du ausdrücklich.</span></div>';
}

function evidenceListHtml(evidence, locked) {
    let cats = ALL_CATS.filter(function(c) { return (evidence[c] || []).length; });
    if (!cats.length) {
        return locked ? '' : '<div class="pt-evid pt-evid-empty">' + evidenceHeaderHtml() +
            '<p class="pt-muted">Noch keine Belege angeheftet.</p></div>';
    }
    let h = '<div class="pt-evid">' + evidenceHeaderHtml();
    cats.forEach(function(c) {
        h += '<div class="pt-evid-cat"><div class="pt-evid-cat-h"><span class="pt-evid-dot" style="background:' +
            ((EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--pt-human)') + '"></span>' + EC.escapeHtml(CAT_LABELS[c]) + '</div>';
        (evidence[c] || []).forEach(function(ev, i) {
            let origin = evidenceLayer(ev) === 'llm_distillate' ? 'ai' : 'human';
            h += '<div class="pt-evid-item">' +
                '<span class="pt-evid-origin pt-evid-origin-' + origin + '">' + (origin === 'ai' ? 'LLM' : 'Paper') + '</span>' +
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
function analysisPanelHtml(dec, readOnly) {
    if (!dec || dec.decision !== 'Include') return '';
    if (!anFields.length) {
        return '<div class="pt-anpanel"><div class="pt-anpanel-head"><span class="pt-tag-mono">Analyse-Codierung</span></div>' +
            '<p class="pt-muted">Analysefeld-Vokabular nicht geladen (docs/data/analysis_fields.json). ' +
            'Build ausführen: python src/publish/build_analysis_fields.py</p></div>';
    }
    const rawAnalysis = readAnalysis(dec);
    const a = sanitizeAnalysis(rawAnalysis, dec.text_source), fv = a.fields, uv = a.undecidable;
    const req = analysisRequirements(dec);
    let h = '<div class="pt-anpanel"><div class="pt-anpanel-head">' +
        '<span class="pt-tag-mono">Analyse-Codierung</span>' +
        '<span class="pt-spacer"></span><span class="pt-pill pt-pill-human">nur Include</span></div>';
    h += '<p class="pt-anpanel-lead pt-muted">Geschlossene Auswahl aus categories.yaml v' + EC.escapeHtml(anVocabVersion) +
        '. Studientyp und alle erforderlichen Felder schließen den Include-Record ab.</p>';

    // Studientyp is required for an Include (update-protocol D) and captured here as a
    // closed single select from study_types; no nicht-entscheidbar toggle, because its
    // vocabulary carries Unclear itself.
    h += anFieldHtml({ name: 'Studientyp', multi: false, values: anStudyTypes, no_undec: true }, fv.Studientyp, false, !!readOnly);

    anFields.forEach(function(f) {
        const fixed = f.name === 'AN_Coding_Basis';
        const effective = f.name === 'AN_Harm_Types' && fv.AN_Coding_Basis === 'Fulltext'
            ? Object.assign({}, f, { optional: false }) : f;
        h += anFieldHtml(effective, fv[f.name], !!uv[f.name], fixed || !!readOnly, !!readOnly);
    });

    const hint = harmTypesHint(a);
    if (hint) h += '<div class="pt-an-hint">' + EC.escapeHtml(hint) + '</div>';
    const expectedBasis = expectedCodingBasis(dec.text_source);
    if (!readOnly && expectedBasis && rawAnalysis.fields.AN_Coding_Basis !== expectedBasis)
        h += '<button type="button" class="pt-btn pt-an-fix-basis">Codierbasis aus Textquelle übernehmen: ' + EC.escapeHtml(expectedBasis) + '</button>';
    h += '<p class="pt-an-status ' + (req.ok ? 'is-complete' : 'is-required') + '" role="status">' +
        (req.ok ? 'Analyse-Codierung vollständig.' : 'Noch erforderlich: ' + EC.escapeHtml(req.missing.join(', '))) + '</p>';
    h += '</div>';
    return h;
}

function anFieldHtml(f, value, undecidable, fixed, readOnly) {
    let h = '<div class="pt-an-field" data-an-field="' + f.name + '">';
    h += '<div class="pt-an-field-head"><span class="pt-an-label">' + EC.escapeHtml(f.name) + '</span>';
    if (f.optional) h += '<span class="pt-tag-mono pt-an-opt">optional</span>';
    else if (!f.free_text) h += '<span class="pt-tag-mono pt-an-required">erforderlich</span>';
    h += '<span class="pt-spacer"></span>';
    if (!f.free_text && !f.no_undec && !fixed) {
        h += '<label class="pt-an-undec"><input type="checkbox" data-an-undec="' + f.name + '"' +
            (undecidable ? ' checked' : '') + (readOnly ? ' disabled' : '') + '> nicht entscheidbar</label>';
    }
    h += '</div>';

    if (f.free_text) {
        h += '<textarea class="pt-an-notes" data-an-free="' + f.name + '" rows="2" ' + (readOnly ? 'readonly ' : '') +
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
            ' aria-pressed="' + (on ? 'true' : 'false') + '"' + (fixed ? ' disabled' : '') + '>' + EC.escapeHtml(v.replace(/_/g, ' ')) + '</button>';
    });
    h += '</div></div>';
    return h;
}

function logicInner(cats, override) {
    const derived = deriveDecision(cats);
    let h = '<div class="pt-logic-row">';
    h += '<span class="pt-tag-mono">Ergebnis</span>';
    h += '<span class="pt-pill pt-pill-' + decCls(derived) + '">' + derived + '</span>';
    h += '<button type="button" class="pt-info-btn pt-logic-info" aria-label="Ableitungsregel anzeigen" aria-expanded="false" ' +
        'aria-controls="pt-logic-help" aria-describedby="pt-logic-help" data-info-target="pt-logic-help">i</button>' +
        '<span class="pt-info-popover" role="tooltip" id="pt-logic-help" hidden>' +
        '<b class="mono">Ableitungsregel</b><span>Include: mindestens eine mit ja bewertete Kategorie in Gegenstand und Perspektive. ' +
        'Unclear: beide Dimensionen sind mindestens teilweise belegt. Andernfalls Exclude.</span></span>';
    h += '<span class="pt-spacer"></span>';
    h += '<label class="pt-override"><span class="pt-switch"><input type="checkbox" id="pt-override"' +
        (override ? ' checked' : '') + '><span class="pt-switch-track"></span></span> ' +
        (derived === 'Include' ? 'Override zu Exclude' : 'Override zu Include') + '</label>';
    h += '</div>';
    return h;
}

function automaticReferenceHtml(p) {
    let a = aiProposal(p);
    if (!a) return '';
    const on = ALL_CATS.filter(function(c) { return a.categories[c]; });
    let h = '<div class="pt-reference-card"><span class="pt-tag-mono">Frühere automatische Klassifikation</span>' +
        '<strong class="pt-dec-' + decCls(a.decision) + '">' + a.decision + '</strong>' +
        '<div class="pt-tag-mono">Automatisch zugeordnete Kategorien</div><div class="pt-chips-static">';
    h += on.length ? on.map(function(c) { return '<span class="pt-pill pt-pill-ai">' + CAT_LABELS[c] + '</span>'; }).join('') : '<span class="pt-muted">keine</span>';
    h += '</div>';
    if (a.reasoning) h += '<p class="pt-ai-reason">' + EC.escapeHtml(a.reasoning) + '</p>';
    h += '<p class="pt-ai-foot">Historische automatische Referenz; sie war vor dem Speichern der eigenen Entscheidung ausgeblendet.</p></div>';
    return h;
}

function referenceComparisonHtml(p) {
    if (runActor === 'agent') return '';
    const hasSeed = !!seedDecision(p), hasAutomatic = !!aiProposal(p);
    if (!hasSeed && !hasAutomatic) return '';
    return '<details class="pt-reference-comparison"><summary>Frühere Referenzen vergleichen</summary>' +
        '<p class="pt-muted">Dieser Bereich wird erst nach der gespeicherten eigenen Entscheidung angeboten.</p>' +
        '<div class="pt-reference-content"></div></details>';
}

function bindReferenceComparison(p, col) {
    const comparison = col.querySelector('.pt-reference-comparison');
    if (!comparison) return;
    comparison.addEventListener('toggle', function() {
        if (!comparison.open || comparison.dataset.loaded === 'true') return;
        const content = comparison.querySelector('.pt-reference-content');
        if (!content) return;
        content.innerHTML = seedRefHtml(p) + automaticReferenceHtml(p);
        comparison.dataset.loaded = 'true';
    });
}

function refreshAssess() {
    let col = document.getElementById('pt-assess-col');
    if (!col) return;
    closeInfoPopover(false);
    let p = papers[state.index];
    const dec = canEdit() && editingPid === p.id ? null : curDec()[p.id];
    col.innerHTML = assessInnerHtml(p, dec);
    bindAssess(p, dec);
}

function closeInfoPopover(restoreFocus) {
    if (!openInfoTrigger) return;
    const pop = document.getElementById(openInfoTrigger.dataset.infoTarget);
    openInfoTrigger.setAttribute('aria-expanded', 'false');
    if (pop) pop.hidden = true;
    const trigger = openInfoTrigger;
    openInfoTrigger = null;
    if (restoreFocus && typeof trigger.focus === 'function') trigger.focus();
}

function openInfoPopover(trigger) {
    if (!trigger) return;
    if (openInfoTrigger && openInfoTrigger !== trigger) closeInfoPopover(false);
    const pop = document.getElementById(trigger.dataset.infoTarget);
    if (!pop) return;
    openInfoTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    pop.hidden = false;
    pop.style.visibility = 'hidden';
    const t = trigger.getBoundingClientRect();
    const rail = trigger.closest('.pt-rail');
    const bounds = rail ? rail.getBoundingClientRect() : { left: 8, right: window.innerWidth - 8 };
    const width = pop.offsetWidth;
    const left = Math.max(bounds.left + 8, Math.min(t.left, bounds.right - width - 8));
    const below = t.bottom + 8;
    const top = below + pop.offsetHeight <= window.innerHeight - 8
        ? below : Math.max(8, t.top - pop.offsetHeight - 8);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.style.visibility = 'visible';
}

function bindInfoPopovers(root) {
    root.querySelectorAll('[data-info-target]').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (openInfoTrigger === trigger) closeInfoPopover(false); else openInfoPopover(trigger);
        });
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { e.preventDefault(); closeInfoPopover(true); }
        });
    });
    if (!infoGlobalBound) {
        infoGlobalBound = true;
        document.addEventListener('pointerdown', function(e) {
            if (!openInfoTrigger) return;
            const pop = document.getElementById(openInfoTrigger.dataset.infoTarget);
            if (e.target !== openInfoTrigger && !(pop && pop.contains(e.target))) closeInfoPopover(false);
        });
        document.addEventListener('focusin', function(e) {
            if (!openInfoTrigger) return;
            const pop = document.getElementById(openInfoTrigger.dataset.infoTarget);
            if (e.target !== openInfoTrigger && !(pop && pop.contains(e.target))) closeInfoPopover(false);
        });
    }
}

// Wire the analysis panel into the unsaved Include draft. The analysis remains in
// work until the single disk action writes the complete record.
function attachAnalysisPanel(dec, col) {
    if (!canEdit() || !dec || dec.decision !== 'Include' || !anFields.length) return;
    const panel = col.querySelector('.pt-anpanel');
    if (!panel) return;

    function cur() {
        const a = readAnalysis({ analysis: work.analysis });
        return { fields: JSON.parse(JSON.stringify(a.fields)), undecidable: JSON.parse(JSON.stringify(a.undecidable)) };
    }
    function persist(next) { if (canEdit()) work.analysis = sanitizeAnalysis(next, currentTextSource); }
    function rerender() { refreshAssess(); }

    panel.querySelectorAll('.pt-an-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const name = btn.dataset.anField, val = btn.dataset.anValue, multi = btn.dataset.anMulti === '1';
            const st = cur();
            delete st.undecidable[name];
            if (multi) {
                const arr = Array.isArray(st.fields[name]) ? st.fields[name] : [];
                if (val === 'None') st.fields[name] = arr.length === 1 && arr[0] === 'None' ? [] : ['None'];
                else {
                    const withoutNone = arr.filter(function(x) { return x !== 'None'; });
                    const at = withoutNone.indexOf(val);
                    if (at === -1) withoutNone.push(val); else withoutNone.splice(at, 1);
                    st.fields[name] = withoutNone;
                }
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
            if (cb.checked) {
                st.undecidable[name] = true;
                delete st.fields[name];
            } else delete st.undecidable[name];
            persist(st); rerender();
        });
    });
    const fixBasis = panel.querySelector('.pt-an-fix-basis');
    if (fixBasis) fixBasis.addEventListener('click', function() { persist(cur()); rerender(); });
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
    const recordButton = document.getElementById('pt-record');
    if (recordButton && !dec) recordButton.addEventListener('click', commit);

    // Reading-column layer toggle (full text / knowledge distillate).
    el.querySelectorAll('.pt-layer-btn').forEach(function(b) {
        b.addEventListener('click', function() { setReadMode(b.dataset.mode); });
    });

    // debounce the two searches: each keystroke otherwise re-scans the full corpus index
    // or rebuilds the whole reading document, which janks on long full texts.
    const debounce = function(fn, ms) {
        let t;
        const wrapped = function() { clearTimeout(t); t = setTimeout(fn, ms); };
        wrapped.cancel = function() { clearTimeout(t); };
        return wrapped;
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
            if (e.key !== 'Enter') return;
            e.preventDefault();
            const query = intext.value.trim();
            if (query !== appliedInTextQuery) {
                runIntext.cancel();
                applyInText(query);
            } else if (docMarks.length) setActiveMark(docMarkIdx + 1);
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
    if (canEdit() && doc && !dec) {
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
    bindInfoPopovers(col);

    if (dec) {
        bindReferenceComparison(p, col);
        bindVerificationPanel(p, dec, col);
        const rev = col.querySelector('#pt-revise');
        if (rev) rev.addEventListener('click', function() { editRecord(p); });
        let nx = col.querySelector('#pt-next');
        if (nx) nx.addEventListener('click', gotoNextOpen);
        return;
    }

    if (!canEdit()) return;

    col.querySelectorAll('.pt-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (!canEdit()) return;
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
        btn.addEventListener('click', function() { if (!canEdit()) return; work.reason = btn.dataset.reason; refreshAssess(); });
    });
    const ov = col.querySelector('#pt-override');
    if (ov) ov.addEventListener('change', function() { if (!canEdit()) return; work.override = ov.checked; if (!ov.checked) work.overrideReason = null; refreshAssess(); });
    attachAnalysisPanel(workingDecisionRecord(), col);

    let rec = document.getElementById('pt-record');
    let hint = col.querySelector('#pt-actions-hint');
    // A derived Exclude needs an exclusion reason; an override to Include needs a recorded
    // justification (RAISE P3). The justification textarea updates without re-rendering so
    // the cursor is not lost, so the commit gate is re-checked on each keystroke.
    function syncRecord() {
        const fin = finalDecisionOf(work.cats, work.override);
        const needExcl = fin === 'Exclude';
        const needJust = work.override && fin === 'Include';
        const missingEvidence = paperEvidenceMissing(work.cats, work.evidence);
        const missingAnalysis = fin === 'Include' ? analysisRequirements(workingDecisionRecord()).missing : [];
        const fileError = reviewerFileErrors[state.reviewer];
        const storageReady = (!!screeningHandle || trialMode) && !fileError;
        const can = !!state.reviewer && storageReady && !readingPending && (!needExcl || !!work.reason) &&
            (!needJust || !!(work.overrideReason && work.overrideReason.trim())) && !missingEvidence.length && !missingAnalysis.length;
        if (rec) rec.disabled = !can;
        if (hint) hint.textContent = can ? 'Bereit zum Speichern.'
            : (!state.reviewer ? 'Vor dem Speichern Reviewer:innen-Kürzel festlegen.'
                : (fileError ? 'Bestehende Reviewer-Datei ist nicht lesbar und wird nicht überschrieben.'
                : (!storageReady ? 'Vor dem Speichern den lokalen Arbeitsordner verbinden.'
                : (readingPending ? 'Der Text wird noch geladen.'
                    : (missingEvidence.length ? 'Paper-Beleg fehlt: ' + missingEvidence.map(function(c) { return CAT_LABELS[c]; }).join(', ') + '.'
                        : (missingAnalysis.length ? 'Analyse-Codierung unvollständig.'
                        : (needExcl && !work.reason ? 'Bitte einen Ausschlussgrund wählen.'
                            : (needJust && !(work.overrideReason && work.overrideReason.trim())
                                ? 'Bitte den Override zu Include begründen.' : 'Speichern ist noch nicht möglich.'))))))));
    }
    const ovr = col.querySelector('#pt-override-reason');
    if (ovr) ovr.addEventListener('input', function() { if (!canEdit()) return; work.overrideReason = ovr.value; syncRecord(); });
    syncRecord();
}

function bindVerificationPanel(p, dec, col) {
    if (!canEdit() || !verificationMode) return;
    const form = col.querySelector('#pt-verification-action');
    if (!form) return;
    const resultSelect = form.elements.result;
    const correctionEditor = form.querySelector('.pt-correction-editor');
    function syncCorrectionEditor() {
        if (correctionEditor)
            correctionEditor.hidden = !resultSelect || resultSelect.value !== 'corrected_and_accepted';
    }
    if (resultSelect) resultSelect.addEventListener('change', syncCorrectionEditor);
    syncCorrectionEditor();
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!canEdit() || runActor !== 'human') return;
        const target = LIFECYCLE_NEXT[verificationView(dec).lifecycle.state];
        const result = advanceVerification(dec, target, {
            reviewer_id: form.elements.reviewer_id && form.elements.reviewer_id.value,
            actor_ids: form.elements.actor_ids && form.elements.actor_ids.value,
            activity_id: form.elements.activity_id && form.elements.activity_id.value,
            result: resultSelect && resultSelect.value,
            note: form.elements.note && form.elements.note.value,
            corrected_annotation: form.elements.corrected_annotation && form.elements.corrected_annotation.value
        });
        const status = col.querySelector('#pt-verification-status');
        if (!result.ok) {
            if (status) status.textContent = result.message;
            return;
        }
        verificationNotice = target === 'verified'
            ? (result.event.to === 'verified'
                ? 'Fachliche Verifikation wurde protokolliert.'
                : 'Das fachliche Prüfergebnis wurde ohne Statusfreigabe protokolliert.')
            : 'Öffentliche Freigabe wurde protokolliert.';
        save();
        renderScreening();
    });
}

function commit() {
    if (!canEdit()) return;
    let p = papers[state.index];
    if (!state.reviewer) {
        setSaveStatus('needs-reviewer', 'Reviewer:innen-Kürzel festlegen, bevor die erste Entscheidung gespeichert wird.');
        focusDataInline(); return;
    }
    if (!screeningHandle && !trialMode) {
        setSaveStatus('local', 'Lokalen Arbeitsordner verbinden, bevor die erste Entscheidung gespeichert wird.');
        focusDataInline(); return;
    }
    if (!trialMode && reviewerFileErrors[state.reviewer]) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(state.reviewer) + ' ist nicht lesbar und wird nicht überschrieben.');
        renderData(document.getElementById('pt-data-inline'));
        return;
    }
    // the record names the text it was taken on; a commit before the reading has been
    // applied would write text_source none for a paper that has a full text
    if (readingPending) { refreshAssess(); return; }
    let fin = finalDecisionOf(work.cats, work.override);
    if (fin === 'Exclude' && !work.reason) { refreshAssess(); return; }
    if (work.override && fin === 'Include' && !(work.overrideReason && work.overrideReason.trim())) { refreshAssess(); return; }
    if (paperEvidenceMissing(work.cats, work.evidence).length) { refreshAssess(); return; }
    // The persisted record holds only paper-layer evidence. Knowledge-distillate
    // evidence stays advisory and session-only.
    const paperEvidence = {};
    ALL_CATS.forEach(function(c) {
        const items = (work.evidence[c] || []).filter(isPaperEvidence);
        if (items.length) paperEvidence[c] = items;
    });
    const nextRecord = {
        categories: work.cats, decision: fin, override: !!work.override,
        reason: fin === 'Exclude' ? work.reason : null,
        override_reason: (work.override && fin === 'Include') ? work.overrideReason.trim() : null,
        evidence: paperEvidence, ts: new Date().toISOString(), reviewer: state.reviewer, actor: runActor,
        text_source: currentTextSource // the paper-layer text the decision was taken on (ADR-027, trAIce M4)
    };
    bindRecordIdentity(nextRecord, p);
    // FR-14: an edited Include record keeps its analysis codes across the re-commit;
    // a decision that leaves Include drops them (coding rule 1, excluded papers carry
    // no AN codes). A record that never had an analysis part gets no key, so a session
    // that touches no analysis field still serializes the pre-FR-14 file body.
    if (fin === 'Include') nextRecord.analysis = sanitizeAnalysis(work.analysis || {}, currentTextSource);
    if (!recordRequirements(nextRecord).ok) { refreshAssess(); return; }
    curDec()[p.id] = nextRecord;
    editingPid = null; // the edit (if any) is now re-committed
    save();
    if (recordRequirements(nextRecord).ok) { corpusQuery = ''; gotoNextOpen(); }
    else renderScreening();
}

// "Ueberarbeiten" reopens a committed decision for editing. It rehydrates the saved
// categories, evidence, reason, and override into the working state and marks the paper
// as being edited; the committed record stays in curDec untouched until re-commit, so
// abandoning the edit (navigating away) loses nothing. Only human Belege were persisted,
// so AI-origin evidence is not restored. (Browser-agent finding: revise was data loss.)
function editRecord(p) {
    if (!canEdit()) return;
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
    if (acceptanceMode) {
        const cases = papers.map(function(p, index) { return d[p.id] ? index : -1; }).filter(function(index) { return index >= 0; });
        const current = cases.indexOf(state.index);
        if (cases.length) state.index = cases[(current + 1 + cases.length) % cases.length];
        renderScreening();
        return;
    }
    // Visit every undecided paper, including textless ones (unlike firstEntryIndex, which
    // only avoids opening *on* boilerplate): a paper without usable text must still be
    // reachable so the reviewer can exclude it as No full text. Skipping it here would
    // leave it permanently unscreened.
    for (let i = 0; i < papers.length; i++) {
        const j = (state.index + 1 + i) % papers.length;
        if (!d[papers[j].id] || !recordRequirements(d[papers[j].id]).ok) { state.index = j; renderScreening(); return; }
    }
    if (state.index < papers.length - 1) state.index++;
    renderScreening();
}

// ---- pin menu (category picker for a selected passage / search hit) ----
// The pin menu is a modal dialog: it takes focus on open, traps Tab inside, closes
// on Escape, and restores focus to the trigger on close (browser-agent a11y finding).
function openPinMenu(term, snippet) {
    if (!canEdit()) return;
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
    if (pinOrigin === 'ai') h += '<div class="pt-pinmenu-ai">Dieser Beleg stammt aus dem LLM-Wissensdestillat und wird als automatisch erzeugte Referenz markiert. Er erfüllt das Paper-Beleg-Gate nicht.</div>';
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
    const source = state.reviewer;
    let f = computeFlow(source);
    let html = '<div class="pt-flow">';
    html += '<p class="pt-flow-source"><strong>Reviewerquelle:</strong> ' + EC.escapeHtml(source || 'keine ausgewählt') +
        '. Ein Konsensdatensatz ist in PRISM derzeit nicht definiert; die Zahlen zeigen ausschließlich diese Reviewerdatei.</p>';
    html += '<div class="pt-flow-box pt-flow-id"><div class="pt-flow-h">Identification</div>' +
        '<div class="pt-flow-n">Records identified&nbsp; n = ' + f.total + '</div>' +
        '<div class="pt-flow-sub">Seed-Korpus (Deep Research + manuell + Zotero)</div></div>';
    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-h pt-flow-stage">Screening</div>';
    html += '<div class="pt-flow-split">';
    html += '<div class="pt-flow-lane pt-lane-ai"><div class="pt-lane-h">KI-Tool (evaluativ)</div>' +
        '<div class="pt-lane-n">gescreent ' + f.aiScreened + '</div><div class="pt-lane-r">Include ' + f.aiIncl +
        ' &middot; Unclear ' + f.aiUnclear + ' &middot; Exclude ' + f.aiExcl + '</div><div class="pt-lane-note">advisory</div></div>';
    html += '<div class="pt-flow-lane pt-lane-human"><div class="pt-lane-h">Reviewerdatei (' + EC.escapeHtml(reviewerLabel(source)) + ')</div>' +
        '<div class="pt-lane-n">gescreent ' + f.humanScreened + '</div><div class="pt-lane-r">Include ' + f.humanIncl +
        ' &middot; Unclear ' + f.humanUnclear + ' &middot; Exclude ' + f.humanExcl + '</div><div class="pt-lane-note">gewählte Quelle</div></div>';
    html += '</div>';
    if (Object.keys(f.humanReasons).length) {
        html += '<div class="pt-flow-reasons"><strong>Ausschlussgründe (Mensch):</strong> ' +
            Object.keys(f.humanReasons).map(function(r) { return r.replace(/_/g, ' ') + ' ' + f.humanReasons[r]; }).join(' &middot; ') + '</div>';
    }
    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-box pt-flow-incl"><div class="pt-flow-h">Included</div>' +
        '<div class="pt-flow-n">Reviewerdatei ' + f.humanIncl + '</div><div class="pt-flow-sub">frühere automatische Klassifikation ' + f.aiIncl + '</div></div>';
    html += '</div>';
    html += '<p class="pt-flow-caption">KI- und Mensch-Entscheidungen getrennt (PRISMA-trAIce R1).</p>';
    el.innerHTML = html;
}


function renderChecklistInto(el) {
    if (!el) return;
    let html = '<p class="pt-check-intro">PRISMA-trAIce (Holst et al. 2025), 17 Items. Der Status wird projektspezifisch belegt; Werkzeugfunktionen erfüllen kein Item pauschal.</p>';
    let lastSec = '';
    TRAICE.forEach(function(it) {
        if (it.sec !== lastSec) { html += '<div class="pt-check-sec">' + it.sec + '</div>'; lastSec = it.sec; }
        let st = state.checklist[it.id] || {};
        let status = st.status || 'open';
        html += '<div class="pt-check-item"><div class="pt-check-row">' +
            '<button class="pt-check-status pt-st-' + status + '" data-id="' + it.id + '">' + status + '</button>' +
            '<span class="pt-check-id">' + it.id + '</span>' +
            '<span class="pt-check-lvl pt-lvl-' + it.lvl.split(' ')[0] + '">' + it.lvl + '</span>' +
            (it.auto ? '<span class="pt-check-auto">Werkzeugbezug</span>' : '') + '</div>' +
            '<p class="pt-check-text">' + EC.escapeHtml(it.text) + '</p>' +
            '<input class="pt-check-note" data-id="' + it.id + '" placeholder="Notiz" value="' + EC.escapeHtml(st.note || '') + '"></div>';
    });
    html += '<button class="pt-btn pt-check-export">Checkliste exportieren (.md)</button>';
    el.innerHTML = html;
    el.querySelectorAll('.pt-check-status').forEach(function(btn) {
        btn.addEventListener('click', function() {
            let id = btn.dataset.id;
            const it = TRAICE.filter(function(t) { return t.id === id; })[0];
            const cur = (state.checklist[id] && state.checklist[id].status) || 'open';
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
        let status = st.status || 'open';
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
    L.push('Stage: ' + disc('stage') + '. Reviewer source: ' + (state.reviewer || 'not selected') + '. The application does not infer a two-reviewer consensus.');
    L.push('Performance evaluation (PRISMA-trAIce M9/R2): AI-human agreement is evaluated outside this tool, on the benchmark corpus in the repository (generated/benchmark-results/, replay self-test), not recomputed here over the loaded corpus.');
    L.push('Confidence threshold: ' + disc('threshold') + '. Conflicts of interest: ' + disc('conflicts') + '.');
    const ts = textSourceCounts(curDec());
    L.push('Text sources read by the human reviewer (PRISMA-trAIce M4): raw full text ' + ts.raw + ', abstract ' + ts.abstract +
        (ts.knowledge_doc ? ', knowledge document ' + ts.knowledge_doc : '') + ', no text ' + ts.none + ', unrecorded ' + ts.unrecorded + '.');
    if (disc('limitations')) L.push('Limitations: ' + disc('limitations'));
    L.push('', 'Flow diagram distinguishes AI from human decisions (PRISMA-trAIce R1). Tool identity, prompt, and parameters disclosed per M2/M6.');
    return L.join('\n');
}

// One-time editor setup: reviewer key and local repository folder.

function renderData(targetEl) {
    const el = targetEl || document.getElementById('pt-data-inline'); if (!el) return;
    if (acceptanceMode) {
        el.innerHTML = '<div class="pt-acceptance-status"><strong>Abnahmeansicht</strong>' +
            '<span>Vorgeschlagene Testurteile. Diese Ansicht schreibt keine Forschungsdaten.</span></div>';
        return;
    }
    if (!canEdit()) {
        el.innerHTML = '<p class="pt-read-only-status">Papers lesen und durchsuchen. „Bearbeiten“ aktiviert Bewertungen und die Einrichtung des Arbeitsordners.</p>';
        return;
    }
    if (!state.reviewer) {
        el.innerHTML = '<form class="pt-reviewer-setup" id="pt-reviewer-setup" novalidate>' +
            '<label for="pt-reviewer-key"><span>Reviewer:innen-Kürzel</span>' +
            '<input id="pt-reviewer-key" name="reviewer" type="text" required minlength="2" maxlength="12" ' +
            'pattern="[A-Za-z][A-Za-z0-9_-]{1,11}" autocomplete="off" spellcheck="false" ' +
            'aria-describedby="pt-reviewer-help pt-reviewer-error" placeholder="z. B. cp"></label>' +
            '<button class="pt-btn pt-reviewer-set" type="submit">Kürzel festlegen</button>' +
            '<span class="pt-reviewer-help" id="pt-reviewer-help">2–12 Zeichen: Buchstaben, Ziffern, _ oder -; Beginn mit Buchstabe.</span>' +
            '<span class="pt-reviewer-error" id="pt-reviewer-error" role="status" aria-live="polite"></span></form>' +
            '<p class="pt-save-status pt-save-' + saveStatus.kind + '" id="pt-save-status" role="status" aria-live="polite">' +
            EC.escapeHtml(saveStatus.message) + '</p>';
        const form = el.querySelector('#pt-reviewer-setup');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = el.querySelector('#pt-reviewer-key');
            if (!selectReviewer(input.value)) {
                input.setAttribute('aria-invalid', 'true');
                el.querySelector('#pt-reviewer-error').textContent = 'Ungültiges Kürzel. Verwende 2–12 erlaubte Zeichen.';
                input.focus();
                return;
            }
            renderData(el);
            renderScreening();
        });
        return;
    }

    const identity = '<span class="pt-sync-identity"><strong>' + EC.escapeHtml(state.reviewer) + '</strong>' +
        '<code>' + EC.escapeHtml(reviewerPath(state.reviewer)) + '</code></span>';
    if (trialMode) {
        el.innerHTML = '<div class="pt-sync-ready pt-trial-ready">' + identity +
            '<span class="pt-folder-status">Agentischer Testlauf · isolierter Browser-Zwischenstand</span>' +
            '<p class="pt-save-status pt-save-' + saveStatus.kind + '" id="pt-save-status" role="status" aria-live="polite">' +
            EC.escapeHtml(saveStatus.message) + '</p>' +
            '<button class="pt-btn pt-trial-export" type="button">Testdaten exportieren</button>' +
            '<span class="pt-trial-note">Keine Forschungsdaten werden geschrieben.</span></div>';
        el.querySelector('.pt-trial-export').addEventListener('click', function() {
            download(state.reviewer + '.json', reviewerFileText(state.reviewer), 'application/json');
            setSaveStatus('saved', 'Testdaten als ' + state.reviewer + '.json exportiert.');
        });
        return;
    }
    if (screeningHandle) {
        el.innerHTML = '<div class="pt-sync-ready">' + identity +
            '<span class="pt-folder-status">Arbeitsordner: ' + EC.escapeHtml(selectedFolderLabel()) + '</span>' +
            '<p class="pt-save-status pt-save-' + saveStatus.kind + '" id="pt-save-status" role="status" aria-live="polite">' +
            EC.escapeHtml(saveStatus.message) + '</p>' +
            '<button class="pt-change-folder" type="button">Ordner ändern</button></div>';
        el.querySelector('.pt-change-folder').addEventListener('click', connectRepo);
        return;
    }

    const actionLabel = storedHandleAvailable ? 'Arbeitsordner freigeben' : 'Arbeitsordner wählen';
    el.innerHTML = '<div class="pt-folder-setup">' + identity +
        '<span class="pt-folder-status">Arbeitsordner: nicht verbunden</span>' +
        (FS_SUPPORTED ? '<button class="pt-btn pt-folder-action" type="button">' + actionLabel + '</button>' :
            '<span class="pt-sync-browser-note">Lokales Speichern benötigt einen Chromium-basierten Browser.</span>') +
        '<p class="pt-save-status pt-save-' + saveStatus.kind + '" id="pt-save-status" role="status" aria-live="polite">' +
        EC.escapeHtml(saveStatus.message) + '</p></div>';
    const folderAction = el.querySelector('.pt-folder-action');
    if (folderAction) folderAction.addEventListener('click', storedHandleAvailable ? reconnectRepo : connectRepo);
}

function validateReviewerPayload(obj) {
    if (!obj || typeof obj !== 'object') return { ok: false, message: 'Datei enthält kein JSON-Objekt.' };
    if (!/^femprompt-prisma-reviewer\/0\.[12345]$/.test(obj.schema || ''))
        return { ok: false, message: 'unbekanntes oder fehlendes Reviewer-Schema.' };
    if (!obj.decisions || typeof obj.decisions !== 'object' || Array.isArray(obj.decisions))
        return { ok: false, message: 'Feld "decisions" fehlt oder ist ungültig.' };
    const known = {};
    papers.forEach(function(p) { known[p.id] = true; });
    const badIds = Object.keys(obj.decisions).filter(function(id) { return papers.length && !known[id]; });
    if (badIds.length) return { ok: false, message: 'unbekannte Paper-IDs: ' + badIds.slice(0, 5).join(', ') + (badIds.length > 5 ? ' …' : '') };
    const badDecision = Object.keys(obj.decisions).find(function(id) {
        const d = obj.decisions[id];
        return !d || ['Include', 'Exclude', 'Unclear'].indexOf(d.decision) === -1;
    });
    if (badDecision) return { ok: false, message: 'ungültige Decision bei Paper ' + badDecision + '.' };
    if (obj.schema === REVIEWER_SCHEMA) {
        const badVersion = Object.keys(obj.decisions).find(function(id) {
            const decision = obj.decisions[id], paper = papers.find(function(item) { return item.id === id; });
            return !decision.work_id || !decision.version_id || !decision.version_type ||
                (paper && (decision.work_id !== paper.work_id || decision.version_id !== paper.version_id));
        });
        if (badVersion) return { ok: false, message: 'Werk- oder Fassungsbindung fehlt bei Paper ' + badVersion + '.' };
    }
    return { ok: true };
}

// Quote a CSV cell only when it carries a comma, quote, or newline; any of those
// in reason/source/title would otherwise shift the columns.
function csvCell(v) {
    let s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function decisionLogCsv() {
    let rows = [['id', 'title', 'human_decision', 'human_source', 'ai_decision', 'divergent', 'reason', 'evidence_count', 'text_source']];
    // the log documents the current reviewer's session; the seed perspective has no
    // UI since ADR-021 and would otherwise replace the reviewer's decisions here
    papers.forEach(function(p) {
        let h = humanDecision(p, state.reviewer), a = aiProposal(p);
        let rec = curDec()[p.id];
        rows.push([p.id, p.title || '', h ? h.decision : '', h ? h.source : '',
            a ? a.decision : '', divergent(h, a) ? 'yes' : 'no', (h && h.reason) ? h.reason : '', evidenceCount(rec),
            (rec && rec.text_source) || '']);
    });
    return rows.map(function(r) { return r.map(csvCell).join(','); }).join('\n');
}

function exportCsv() { download('prisma-decision-log.csv', decisionLogCsv(), 'text/csv'); }

// Per-source counts of the current reviewer's records (trAIce M4, input data). A record
// written before schema 0.3 carries no text_source and counts as 'unrecorded'.
// knowledge_doc is a historical value: the superseded raw-from-clone build wrote it for a
// decision taken on the served distillate. It is counted as itself rather than as
// unrecorded, so a migrated file keeps saying what its reviewer actually read.
function textSourceCounts(decisions) {
    const out = { raw: 0, abstract: 0, knowledge_doc: 0, none: 0, unrecorded: 0 };
    Object.keys(decisions || {}).forEach(function(pid) {
        const s = decisions[pid] && decisions[pid].text_source;
        if (s === 'raw' || s === 'abstract' || s === 'knowledge_doc' || s === 'none') out[s]++; else out.unrecorded++;
    });
    return out;
}

// Deterministic reconciliation record over reviewer payloads (plan B3, trAIce M8). Pure:
// the payloads are read and copied, never mutated; the output is independent of input
// order (reviewers and papers sorted) and carries both source records verbatim plus an
// empty consensus slot, which the human consensus session fills outside this function.
function reconcileReviewers(payloads) {
    const byRev = {};
    (payloads || []).forEach(function(pl) {
        if (!pl || typeof pl !== 'object' || !pl.decisions) return;
        const key = String(pl.reviewer || '').trim();
        if (!key || key === SEED) return;
        if (byRev[key]) throw new Error('duplicate reviewer key: ' + key); // last-wins would make the result order-dependent
        byRev[key] = pl.decisions;
    });
    const reviewers = Object.keys(byRev).sort();
    const seen = {};
    reviewers.forEach(function(r) { Object.keys(byRev[r]).forEach(function(pid) { seen[pid] = true; }); });
    const out = {}, summary = { agree: 0, divergent: 0, single: 0 };
    Object.keys(seen).sort().forEach(function(pid) {
        const records = {}, decisions = [];
        reviewers.forEach(function(r) {
            const d = byRev[r][pid];
            if (!d) return;
            records[r] = JSON.parse(JSON.stringify(d));
            decisions.push(d.decision);
        });
        const status = decisions.length < 2 ? 'single'
            : (decisions.every(function(x) { return x === decisions[0]; }) ? 'agree' : 'divergent');
        summary[status]++;
        out[pid] = { status: status, records: records, consensus: null };
    });
    return { schema: 'femprompt-prisma-reconciliation/0.1', reviewers: reviewers, summary: summary, papers: out };
}

function reconciliationText(payloads) { return JSON.stringify(reconcileReviewers(payloads), null, 2); }

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
        if (!rec || rec.decision !== 'Include' || !recordRequirements(rec).ok) return;
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
    renderMarkdown: renderMarkdown, splitDocLayers: splitDocLayers, paperBodyMarkdown: paperBodyMarkdown,
    readingShellHtml: readingShellHtml, normalizedDoi: normalizedDoi, doiHref: doiHref,
    normalizedSourceUrl: normalizedSourceUrl, urlOnlyLine: urlOnlyLine, sameSourceUrl: sameSourceUrl, authorDisplay: authorDisplay,
    // generated report text and persistence payload
    disclosureMarkdown: disclosureMarkdown, reviewerPayload: reviewerPayload,
    reviewerFileText: reviewerFileText, sortedDecisions: sortedDecisions,
    isReviewerId: isReviewerId, normalizedReviewerKey: normalizedReviewerKey, reviewerPath: reviewerPath,
    selectReviewer: selectReviewer, importReviewerPayload: importReviewerPayload,
    canEdit: canEdit, setEditMode: setEditMode,
    reviewerEnvelope: function(key) { return reviewerEnvelopes[key] ? JSON.parse(JSON.stringify(reviewerEnvelopes[key])) : null; },
    setReviewerEnvelope: function(key, payload) { reviewerEnvelopes[key] = JSON.parse(JSON.stringify(payload)); },
    validateReviewerPayload: validateReviewerPayload, save: save, saveStatus: function() { return saveStatus; },
    loadAllReviewers: loadAllReviewers,
    reviewerFileErrors: function() { return JSON.parse(JSON.stringify(reviewerFileErrors)); },
    reviewerRecoveryPending: function() { return JSON.parse(JSON.stringify(reviewerRecoveryPending)); },
    mergeReviewerDecisions: mergeReviewerDecisions,
    // stateful seams for inline fixtures
    setPapers: function(p) { papers = p; }, renderData: renderData,
    getState: function() { return state; },
    getWork: function() { return work; },
    curDec: curDec, resetWork: resetWork, refreshAssess: refreshAssess,
    pinEvidence: pinEvidence, unpinEvidence: unpinEvidence, commit: commit, editRecord: editRecord,
    evidenceListHtml: evidenceListHtml, chipHtml: chipHtml, statusLabel: statusLabel,
    corpusListHtml: corpusListHtml, corpusSearchResults: corpusSearchResults,
    setCorpusQuery: function(x) { corpusQuery = String(x || ''); },
    setCorpusIndex: function(x) { corpusIndex = x; }, isScreenable: isScreenable, firstEntryIndex: firstEntryIndex,
    startIndexForPaper: startIndexForPaper,
    evidenceLayer: evidenceLayer, isPaperEvidence: isPaperEvidence,
    paperEvidenceMissing: paperEvidenceMissing, humanEvidenceMissing: humanEvidenceMissing,
    recordRequirements: recordRequirements, workingDecisionRecord: workingDecisionRecord,
    // PRISM lifecycle verification (kept separate from ordinary screening commits)
    LIFECYCLE_STATES: LIFECYCLE_STATES, verificationView: verificationView, legacyBaseline: legacyBaseline,
    ensureVerificationContract: ensureVerificationContract, advanceVerification: advanceVerification,
    verificationPanelHtml: verificationPanelHtml, actorIds: actorIds,
    annotationBody: annotationBody, annotationDiff: annotationDiff,
    correctedAnnotationBody: correctedAnnotationBody, VERIFICATION_RESULTS: VERIFICATION_RESULTS,
    // analysis coding panel (FR-14, ADR-026)
    setAnalysisFields: function(d) { applyAnalysisVocab(d); },
    anVersion: function() { return anVocabVersion; },
    anFieldNames: anFieldNames, anField: anField, anVocab: anVocab,
    anStudyTypes: function() { return anStudyTypes; }, anExportOrder: anExportOrder,
    readAnalysis: readAnalysis, sanitizeAnalysis: sanitizeAnalysis, setAnalysis: setAnalysis,
    expectedCodingBasis: expectedCodingBasis, analysisRequirements: analysisRequirements,
    analysisNotes: analysisNotes, harmTypesHint: harmTypesHint, analysisPanelHtml: analysisPanelHtml,
    analysisCsvHeader: analysisCsvHeader, analysisCsv: analysisCsv,
    // surface + reading-layer drivers (browser-agent traces on the real page)
    showSurface: function(s) { showSurface(s); },
    setReadMode: function(m) { setReadMode(m); },
    activeLayerHtml: activeLayerHtml,
    // text-source provenance, load-token guard, decision log, reconciliation (ADR-027, pilot)
    loadReadingInto: loadReadingInto, applyReading: applyReading,
    readToken: function() { return readToken; }, textSource: function() { return currentTextSource; },
    setTextSource: function(source) { currentTextSource = source; },
    readingPending: function() { return readingPending; },
    textSourceCounts: textSourceCounts, decisionLogCsv: decisionLogCsv,
    reconcileReviewers: reconcileReviewers, reconciliationText: reconciliationText,
    renderReportSurface: renderReportSurface,
    // repo-root connect (ported from the paper lane's ADR-024 by operator decision)
    resolveScopes: resolveScopes, connectScope: function() { return connectScope; },
    screeningHandle: function() { return screeningHandle; },
    setScreeningHandle: function(handle) { screeningHandle = handle; }
};
window.EC = window.EC || {};
window.EC._test = TEST_HOOK;
window.__PRISMA_TEST__ = TEST_HOOK;

})();
