// PRISMA Screening Tool (PRISM) -- standalone evidence-grounded screening instrument.
// The screening view is built around reading and searching the paper's original full text
// (the Paper layer; the generated knowledge distillate is a separate reference layer) and
// pinning found passages as Belege (evidence) on categories. Agreement metrics live outside
// the tool (ADR-014/017, PRISMA-trAIce M9/R2 by reference).
//
// One workspace with two modes, Lesen and Bearbeiten (ADR-042). Each paper shows its
// current annotation, resolved as own saved record > productive agent record > consolidated
// expert decision as prefilled draft > empty draft. The LLM assessment is a labelled
// reference and never seeds a draft. Saving an own draft writes the reviewer's decision
// record; saving over an agent record writes a verification entry into the reviewer's own
// file and never touches the agent file (ADR-040).
// Persistence: after an explicit reviewer key, File System Access writes one JSON per
// reviewer into docs/data/screening/<reviewer>.json.
// Runs on prisma.html via the window.EC shim from prisma-data.js.
// See knowledge/specification.md (requirements, ADRs, design system), knowledge/data.md.

(function() {
'use strict';

let EC = window.EC;
let initialized = false;
let acceptanceMode = null;
let trialMode = false;
let runActor = 'human';
let editMode = false; // session-only opt-in; a normal reload always starts with reading
const FS_NATIVE = typeof window.showDirectoryPicker === 'function';
let fsOverride = null; // test seam for the capability branches
function fsSupported() { return fsOverride === null ? FS_NATIVE : fsOverride; }

// Constants

// Populated once from docs/data/category_schema.json. The arrays and maps retain
// their identity so the production UI and the exposed test surface share one schema.
const TECH_CATS = [];
const SOCIAL_CATS = [];
const ALL_CATS = [];
const CAT_LABELS = {};
const CAT_DEFS = {};
const CAT_COLOR = {};
const EXCLUSION_REASONS = [];
const EXCLUSION_LABELS = {};

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
    [CAT_LABELS, CAT_DEFS, CAT_COLOR, EXCLUSION_LABELS].forEach(function(map) {
        Object.keys(map).forEach(function(key) { delete map[key]; });
    });
    categories.forEach(function(category) {
        CAT_LABELS[category.key] = category.label;
        CAT_DEFS[category.key] = category.definition;
        CAT_COLOR[category.key] = category.color;
    });
    const labels = schema.exclusion_reason_labels || {};
    schema.exclusion_reasons.forEach(function(code) { EXCLUSION_LABELS[code] = labels[code] || code.replace(/_/g, ' '); });
}

function reasonLabel(code) { return EXCLUSION_LABELS[code] || String(code || '').replace(/_/g, ' '); }

// The confirmation reason for a consolidated expert Exclude (ADR-042). It lets an
// expert exclusion be confirmed without inventing a substantive reason.
const EXPERT_EXCLUSION_REASON = 'Consolidated_expert_exclusion';

// The headless harness injects the built schema before evaluating this file and
// exercises pure functions without starting the full application.
if (window.__CATEGORY_SCHEMA__) applyCategorySchema();

// Disclosure defaults of the round-one LLM assessment, read by disclosureMarkdown.
const MODEL_DEFAULT = {
    name: 'Claude Haiku 4.5', id: 'claude-haiku-4-5', date: '2026-03-15',
    prompt: 'v2.1', temperature: '0.0', maxTokens: '1024', threshold: '0.5',
    stage: 'Screening', conflicts: 'none'
};

const LS_KEY = 'femprompt-prisma-state/0.2';
const TRIAL_LS_KEY = 'femprompt-prisma-trial-state/0.1';
// 0.4 is the isolated capture shape of agent trial runs and historical files. A file
// whose records all carry the embedded provenance and lifecycle contract is written as
// 0.5, which is what new human records from PRISM satisfy (ADR-042).
const REVIEWER_SCHEMA = 'femprompt-prisma-reviewer/0.4';
const GOVERNED_SCHEMA = 'femprompt-prisma-reviewer/0.5';
// Additive envelope extension (ADR-040). The reviewer schema is untouched, so an
// existing 0.5 record stays valid and an older reader ignores the extra block.
const VERIFICATION_SCHEMA = 'femprompt-prisma-verification/0.1';
const SEED = 'seed'; // built-in reviewer = the existing expert assessment (paper.human)
const REVIEWER_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{1,11}$/;
// The split of open papers between reviewers lives beside the reviewer files as
// docs/data/screening/assignment.json; it is read, never written by PRISM.
const ASSIGNMENT_KEY = 'assignment';
const ASSIGNMENT_SCHEMA = 'femprompt-prisma-assignment/1.0';
// Keys that name built-in tracks or files. 'seed' collides with the expert reference,
// 'acceptance' with the read-only review fixture and 'assignment' with the split.
const RESERVED_KEYS = [SEED, 'acceptance', ASSIGNMENT_KEY];
// Productive agent tracks served with the working application. Read mode loads them
// over HTTP so the corpus list can show agent records without a connected folder; a
// connected folder supersedes them. They are never written by PRISM.
const SERVED_AGENT_TRACKS = ['ar2'];
const LIFECYCLE_LABELS = {
    identified: 'identifiziert',
    curated: 'kuratiert',
    'agent-annotated': 'agentisch kodiert',
    'ai-agent-reviewed': 'KI-geprüft',
    verified: 'fachlich verifiziert',
    'publication-approved': 'zur Veröffentlichung freigegeben'
};
const RESULT_LABELS = {
    accepted: 'bestätigt',
    corrected_and_accepted: 'korrigiert und bestätigt',
    changes_requested: 'Änderungen angefordert',
    rejected: 'abgelehnt',
    approved: 'freigegeben'
};
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

// Binds a record that carries no Work-Version identity yet. An existing binding is
// provenance of what was read and is never rebound to the current corpus version;
// validateReviewerPayload reports a mismatch instead.
function bindRecordIdentity(record, paper) {
    if (!paper.work_id || !paper.version_id) return record;
    if (!record.work_id || !record.version_id) {
        record.work_id = paper.work_id;
        record.version_id = paper.version_id;
        record.version_type = paper.version_type || 'unknown';
        record.preferred_version_id = paper.preferred_version_id || paper.version_id;
        record.selected_version_is_preferred = !!paper.is_preferred_version;
    }
    Object.keys(record.evidence || {}).forEach(function(category) {
        (record.evidence[category] || []).forEach(function(item) {
            if (item.work_id && item.version_id) return;
            item.paper_id = paper.id;
            item.work_id = record.work_id;
            item.version_id = record.version_id;
        });
    });
    return record;
}

function paperIdentityReady(paper) {
    return !!(paper && paper.work_id && paper.version_id);
}

function paperIdentityRequired(paper) {
    return !!(paper && Object.prototype.hasOwnProperty.call(paper, 'identity_basis'));
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
    reviewer: null,        // explicit filename-safe reviewer key; drives the data file
    index: 0,
    readMode: 'full',      // reading layer: 'full' (paper text) or 'ai' (LLM knowledge distillate)
    reviewers: {},         // reviewerKey -> { paperId -> decision }
    disclosure: {},        // in-memory disclosure parameters for disclosureMarkdown (operator utility)
    statusFilter: 'alle',  // corpus list: 'alle' | 'offen' | 'erfasst'
    assigneeFilter: 'alle', // corpus list: 'alle' | an assignee key of the assignment file
    catFilter: []          // corpus list: categories the current annotation must carry (AND)
};

let papers = [];
let dirHandle = null;          // connected File System Access directory handle (what the picker returned)
let screeningHandle = null;    // docs/data/screening within it: where reviewer files are read and written
let connectScope = 'screening'; // 'root' when the picked folder is the repo root, else 'screening'
let storedHandleAvailable = false;
// A connection resolves the folder and merges its files before PRISM may write. Without
// this guard a save between the two steps would replace the file with the browser state.
let connecting = false;
let folderIdentity = null;     // name of the connected folder; the browser snapshot belongs to it
let reviewerFileErrors = {};   // reviewerKey -> blocking read/validation error for an existing file
let reviewerConflicts = {};    // reviewerKey -> { pid, disk, local } awaiting an explicit choice
let reviewerRecoveryPending = {}; // reviewerKey -> browser records newer than the connected file
const reviewerEnvelopes = {};  // reviewerKey -> loaded top-level JSON, preserved across decision writes
const quarantinedRecords = {}; // reviewerKey -> { paperId -> record } kept verbatim on write, not loaded
const lastDiskText = {};       // reviewerKey -> file text last read or written in this session
// The reviewer verifies the productive agent track, so the subject record and the file
// that receives the verification event are different files. agentTrack holds a deep
// copy: a display projection can never reach a track a save would serialize.
let agentTrack = { reviewer: null, records: {} };
let servedAgentEnvelope = null; // HTTP-served agent track, used while no folder supplies one
let assignment = null;          // { reviewers: [{ key, label }], byPaper: { paperId -> key } } or null
const verificationRecords = {}; // reviewerKey -> verification events this reviewer recorded
// Unsaved drafts per paper. A draft starts as a copy of the current annotation and is
// kept (and persisted in the browser) only once the reviewer changes something.
const drafts = {};
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
let anFields = [];               // [ { name, multi, values[, optional, binding_when, free_text, label, value_labels] } ]
let anStudyTypes = [];
let anStudyTypeLabels = {};
let anVocabVersion = '';
let docHtmlCurrent = '';       // rendered HTML of the active layer (for re-highlight)
let docHtmlPaper = '';         // rendered paper layer (verbatim text)
let docHtmlAi = '';            // rendered AI-extraction layer (machine knowledge doc), '' when absent
let docMarks = [], docMarkIdx = 0;
let appliedInTextQuery = '';
let pendingInText = null;      // in-text query to apply once the document has loaded
let pinTerm = '', pinSnippet = '', pinOrigin = 'human'; // pinOrigin = source layer of the staged snippet
let pinReturnFocus = null, pinKeyHandler = null, pinOutsideHandler = null;
let focusReadingOnRender = false; // move focus to the paper heading after a paper switch (a11y)
let renderedPaperId = null;
let pageListenersBound = false;      // the page-wide Ctrl+S and history listeners are attached once
let railStep = 'assess';       // 'assess' | 'analysis': the Include analysis coding is its own step
let readToken = 0;             // monotonic load token; a reading response for a stale token is dropped
let readingPending = false;    // true between a reading load and its applied response; commit waits for it
let currentTextSource = 'none'; // paper-layer text actually shown: 'raw' | 'abstract' | 'none' (ADR-027)
let saveStatus = { kind: 'needs-reviewer', message: 'Kürzel festlegen.' };
let sessionActivity = null;    // one activity id per editing session for verification events
let editChannel = null;        // BroadcastChannel that detects a second editing tab
let secondTabNotice = '';

// the in-progress (pre-commit) decision for the open paper
let work = emptyWork(null);

function emptyWork(pid) {
    return { pid: pid, cats: {}, override: false, reason: null, overrideReason: null, evidence: {},
        analysis: undefined, seed: null, expertBasis: null, derivedFromExpert: false, dirty: false };
}

function curDec() {
    if (!state.reviewer) return {};
    if (!state.reviewers[state.reviewer]) {
        if (!canEdit()) return {};
        state.reviewers[state.reviewer] = {};
    }
    return state.reviewers[state.reviewer];
}

// Test and integration seam: an empty draft for a paper, replacing any stored one.
function resetWork(p) {
    work = emptyWork(p.id);
    if (p && p.id) delete drafts[p.id];
    return work;
}

function canEdit() { return editMode && !acceptanceMode; }

function setEditMode(enabled) {
    if (acceptanceMode) return false;
    editMode = !!enabled;
    closePinMenu();
    railStep = 'assess';
    // The draft stays in memory; leaving edit mode never commits it.
    if (canEdit()) announceEditing();
    if (initialized) {
        renderShell();
        renderScreening();
        if (canEdit()) {
            focusDataInline();
            if (!trialMode && !screeningHandle) restoreRepoConnection();
        } else {
            const reader = document.getElementById('pt-read-mode') || document.getElementById('pt-edit-mode');
            if (reader) reader.focus();
        }
    }
    return canEdit();
}

function sessionActivityId() {
    if (!sessionActivity) sessionActivity = 'prism-session-' + verificationEventId().replace(/^prism-/, '');
    return sessionActivity;
}

// Two tabs editing with the same key would overwrite each other's file. The channel
// only warns; the re-read before every write is what prevents the loss.
function announceEditing() {
    if (trialMode || typeof window.BroadcastChannel !== 'function') return;
    try {
        if (!editChannel) {
            editChannel = new window.BroadcastChannel('femprompt-prisma-editing');
            editChannel.onmessage = function(event) {
                const data = event && event.data;
                if (!data || !canEdit()) return;
                if (data.type === 'editing' && data.reviewer && data.reviewer === state.reviewer) {
                    secondTabNotice = 'PRISM ist mit diesem Kürzel in einem zweiten Tab zum Bearbeiten geöffnet.';
                    editChannel.postMessage({ type: 'present', reviewer: state.reviewer });
                    renderData(document.getElementById('pt-data-inline'));
                } else if (data.type === 'present' && data.reviewer === state.reviewer) {
                    secondTabNotice = 'PRISM ist mit diesem Kürzel in einem zweiten Tab zum Bearbeiten geöffnet.';
                    renderData(document.getElementById('pt-data-inline'));
                }
            };
        }
        if (state.reviewer) editChannel.postMessage({ type: 'editing', reviewer: state.reviewer });
    } catch (e) { editChannel = null; }
}

// Persistence: localStorage cache + File System Access (repo files)

// The browser snapshot holds the reviewer's own work: human tracks, own verification
// events and changed drafts. Loaded agent tracks stay out, they live in their files.
function serializeAll() {
    const reviewers = {};
    Object.keys(state.reviewers).forEach(function(key) {
        if (isAgentTrackPayload(reviewerEnvelopes[key])) return;
        reviewers[key] = state.reviewers[key];
    });
    const changed = {};
    Object.keys(drafts).forEach(function(pid) { if (drafts[pid] && drafts[pid].dirty) changed[pid] = drafts[pid]; });
    const verifications = {};
    Object.keys(verificationRecords).forEach(function(key) {
        if (reviewers[key] || key === state.reviewer) verifications[key] = verificationRecords[key];
    });
    return {
        schema: storageKey(),
        config: { reviewer: state.reviewer, reviewerSelected: !!state.reviewer, folder: folderIdentity },
        reviewers: reviewers,
        verifications: verifications,
        drafts: changed
    };
}

function storageKey() { return trialMode ? TRIAL_LS_KEY : LS_KEY; }

function saveLocal() {
    if (!canEdit()) return false;
    try {
        localStorage.setItem(storageKey(), JSON.stringify(serializeAll()));
        return true;
    } catch (e) {
        console.warn('[PRISMA] local save failed:', e.message);
        return false;
    }
}

function validLocalRecord(record) {
    return !!(record && typeof record === 'object' && !Array.isArray(record) &&
        ['Include', 'Exclude', 'Unclear'].indexOf(record.decision) !== -1);
}

function loadLocal() {
    try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) return;
        const o = JSON.parse(raw);
        if (o.config) {
            // Older builds silently defaulted everyone to reviewer1. Only an explicit
            // selection marker and a filename-safe key are trusted during migration.
            if (o.config.reviewerSelected && isReviewerId(o.config.reviewer) && !reservedKey(o.config.reviewer))
                state.reviewer = normalizedReviewerKey(o.config.reviewer);
            if (typeof o.config.folder === 'string') folderIdentity = o.config.folder;
        }
        const reviewers = o.reviewers && typeof o.reviewers === 'object' ? o.reviewers : {};
        state.reviewers = {};
        Object.keys(reviewers).forEach(function(key) {
            if (!isReviewerId(key) || !reviewers[key] || typeof reviewers[key] !== 'object') return;
            const track = {};
            Object.keys(reviewers[key]).forEach(function(pid) {
                if (validLocalRecord(reviewers[key][pid])) track[pid] = reviewers[key][pid];
            });
            state.reviewers[key] = track;
        });
        if (o.verifications && typeof o.verifications === 'object')
            Object.keys(o.verifications).forEach(function(key) {
                if (Array.isArray(o.verifications[key])) verificationRecords[key] = o.verifications[key];
            });
        if (o.drafts && typeof o.drafts === 'object')
            Object.keys(o.drafts).forEach(function(pid) {
                const draft = o.drafts[pid];
                // a draft an older build seeded from an agent record carries the agent's
                // codes and is dropped, so no AI pre-assessment reaches a human session (ADR-044)
                if (draft && typeof draft === 'object' && draft.pid === pid && draft.cats && typeof draft.cats === 'object' && draft.seed !== 'agent')
                    drafts[pid] = Object.assign(emptyWork(pid), draft, { dirty: true });
            });
        if (state.reviewer) saveStatus = trialMode ? {
            kind: 'ready',
            message: 'Isolierter Testlauf aus diesem Browser geladen.'
        } : {
            kind: 'dirty',
            message: 'Zwischenstand aus dem Browser geladen. Mit dem Arbeitsordner verbinden, um ihn abzugleichen.'
        };
    } catch (e) { console.warn('[PRISMA] local load failed:', e.message); }
}

let writeChain = Promise.resolve();
let writeVersion = 0;
// Returns a promise that resolves true once the file holds the current state.
function save() {
    if (!canEdit()) return Promise.resolve(false);
    const localOk = saveLocal();
    if (!state.reviewer) {
        setSaveStatus('needs-reviewer', 'Kürzel festlegen, bevor gespeichert wird.');
        return Promise.resolve(false);
    }
    if (trialMode) {
        setSaveStatus(localOk ? 'saved' : 'error', localOk
            ? 'Testlauf im Browser gespeichert. Forschungsdaten bleiben unverändert.'
            : 'Testlauf konnte im Browser nicht gespeichert werden.');
        renderData(document.getElementById('pt-data-inline'));
        return Promise.resolve(localOk);
    }
    const key = state.reviewer;
    if (reviewerFileErrors[key]) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(key) + ' wird nicht überschrieben: ' + reviewerFileErrors[key]);
        renderData(document.getElementById('pt-data-inline'));
        return Promise.resolve(false);
    }
    if (connecting) {
        setSaveStatus('dirty', 'Der Arbeitsordner wird noch abgeglichen. Danach erneut speichern.');
        return Promise.resolve(false);
    }
    if (!screeningHandle) {
        setSaveStatus(localOk ? 'dirty' : 'error', localOk
            ? 'Nur im Browser gespeichert. Die Datei ist noch nicht aktualisiert.'
            : 'Nicht gespeichert. Der Browser-Zwischenspeicher ist voll oder gesperrt.');
        return Promise.resolve(false);
    }
    if (!localOk) setSaveStatus('error', 'Browser-Zwischenspeicher voll oder gesperrt. Die Datei wird trotzdem geschrieben.');
    // writes are serialized so rapid screening cannot overlap createWritable on one file;
    // each job keeps the handle, key and state it was queued with
    const targetHandle = screeningHandle;
    const text = reviewerFileText(key);
    const version = ++writeVersion;
    setSaveStatus('saving', 'Speichert in ' + reviewerPath(key) + ' …');
    const job = writeChain.then(function() {
        return writeReviewerFile(targetHandle, key, text);
    }).then(function() {
        reviewerRecoveryPending[key] = false;
        if (state.reviewer === key && version === writeVersion && screeningHandle === targetHandle)
            setSaveStatus('saved', 'Gespeichert in ' + reviewerPath(key) + '.');
        return true;
    }).catch(function(e) {
        // the browser now holds records the file lacks; the disk action stays available
        // to write them once the cause is resolved
        reviewerRecoveryPending[key] = true;
        if (state.reviewer === key && version === writeVersion)
            setSaveStatus('error', 'Speichern fehlgeschlagen: ' + (e.message || e));
        console.warn('[PRISMA] file write failed:', e);
        renderData(document.getElementById('pt-data-inline'));
        return false;
    });
    writeChain = job;
    return job;
}

async function readReviewerText(targetHandle, key) {
    let fh;
    try { fh = await targetHandle.getFileHandle(key + '.json'); } catch (e) { return null; }
    if (!fh || typeof fh.getFile !== 'function') return null;
    const file = await fh.getFile();
    const text = await file.text();
    // a write that failed after the file was created leaves it empty; that counts as absent
    return text && text.trim() ? text : null;
}

// Re-read before every write. A file changed outside this session (a second tab, a
// git pull) is merged per paper by timestamp; a divergence that cannot be ordered
// blocks the write and offers an explicit choice instead of overwriting either side.
async function writeReviewerFile(targetHandle, key, text) {
    const current = await readReviewerText(targetHandle, key);
    if (current !== null && current !== lastDiskText[key]) {
        let obj;
        try { obj = JSON.parse(current); } catch (e) { obj = null; }
        const check = obj ? validateReviewerEnvelope(obj) : { ok: false, message: 'kein gültiges JSON' };
        if (!check.ok) {
            reviewerFileErrors[key] = 'Die Datei wurde außerhalb von PRISM verändert und ist nicht lesbar (' + check.message + ').';
            throw new Error(reviewerFileErrors[key]);
        }
        const usable = {}, held = {};
        Object.keys(obj.decisions).forEach(function(pid) {
            if (recordProblem(pid, obj.decisions[pid], obj.schema)) held[pid] = obj.decisions[pid];
            else usable[pid] = obj.decisions[pid];
        });
        const merged = mergeReviewerDecisions(normalizedReviewerDecisions(usable, key), state.reviewers[key] || {});
        if (merged.conflict) {
            reviewerFileErrors[key] = merged.conflict;
            reviewerConflicts[key] = merged.conflictDetail;
            throw new Error(merged.conflict);
        }
        state.reviewers[key] = merged.decisions;
        quarantinedRecords[key] = held;
        reviewerEnvelopes[key] = JSON.parse(JSON.stringify(obj));
        adoptVerifications(key, obj);
        adoptAgentTrack();
        text = reviewerFileText(key);
    }
    const fh = await targetHandle.getFileHandle(key + '.json', { create: true });
    const w = await fh.createWritable();
    await w.write(text);
    await w.close();
    lastDiskText[key] = text;
    return true;
}

function isGovernedRecord(record) {
    return !!(record && record.provenance && typeof record.provenance === 'object' &&
        Array.isArray(record.annotations) && record.annotations.length && record.active_annotation_id &&
        Array.isArray(record.checks) && record.lifecycle && record.lifecycle.baseline);
}

function reviewerPayload(key) {
    const loaded = reviewerEnvelopes[key];
    const payload = loaded ? JSON.parse(JSON.stringify(loaded)) : {
        schema: REVIEWER_SCHEMA, reviewer: key, actor: runActor
    };
    // the file name owns the reviewer role; a stale embedded value is corrected
    payload.reviewer = key;
    payload.updated = new Date().toISOString();
    payload.decisions = {};
    const quarantined = quarantinedRecords[key] || {};
    Object.keys(quarantined).forEach(function(paperId) {
        payload.decisions[paperId] = JSON.parse(JSON.stringify(quarantined[paperId]));
    });
    Object.keys(state.reviewers[key] || {}).forEach(function(paperId) {
        const record = JSON.parse(JSON.stringify(state.reviewers[key][paperId]));
        const paper = papers.find(function(item) { return item.id === paperId; });
        if (paper) bindRecordIdentity(record, paper);
        payload.decisions[paperId] = record;
    });
    const ids = Object.keys(payload.decisions);
    if (/^femprompt-prisma-reviewer\/0\.[1234]$/.test(payload.schema || ''))
        payload.schema = ids.length && ids.every(function(id) { return isGovernedRecord(payload.decisions[id]); })
            ? GOVERNED_SCHEMA : REVIEWER_SCHEMA;
    const verifications = verificationRecords[key];
    if (Array.isArray(verifications) && verifications.length) {
        payload.verification_schema = VERIFICATION_SCHEMA;
        payload.verifications = JSON.parse(JSON.stringify(verifications));
    }
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

function reservedKey(key) {
    const normalized = normalizedReviewerKey(key);
    if (!normalized) return false;
    if (RESERVED_KEYS.indexOf(normalized) !== -1) return true;
    // a human key must never address an agent track file
    if (runActor === 'human' && SERVED_AGENT_TRACKS.indexOf(normalized) !== -1) return true;
    if (runActor === 'human' && isAgentTrackPayload(reviewerEnvelopes[normalized])) return true;
    return agentTrack.reviewer === normalized && runActor === 'human';
}

function reviewerPath(key) {
    if (!key) return 'Kürzel festlegen';
    return trialMode ? 'isolierter Testlauf/' + key + '.json' : 'docs/data/screening/' + key + '.json';
}

// The target path already names docs/data/screening; beside it only the clone or the
// picked folder itself identifies where the file is written.
function folderNameLabel() {
    if (!screeningHandle) return '';
    if (connectScope === 'root') return dirHandle && dirHandle.name ? dirHandle.name : '';
    return selectedFolderLabel();
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
        status.hidden = !saveStatusShown(kind);
    }
    if (kind === 'error' || kind === 'saved') announce(message);
}

function selectReviewer(key) {
    if (!canEdit()) return false;
    const normalized = normalizedReviewerKey(key);
    if (!normalized || reservedKey(normalized)) return false;
    state.reviewer = normalized;
    if (!state.reviewers[normalized]) state.reviewers[normalized] = {};
    saveLocal();
    announceEditing();
    const fileError = reviewerFileErrors[normalized];
    const recovery = reviewerRecoveryPending[normalized];
    setSaveStatus(fileError ? 'error' : (recovery ? 'dirty' : (trialMode ? 'ready' : (screeningHandle ? 'ready' : 'local'))), fileError
        ? 'Bestehende Datei ' + reviewerPath(normalized) + ' wird nicht verändert: ' + fileError
        : (recovery
            ? 'Neuere Browser-Änderungen wurden wiederhergestellt. Mit der Diskette in die Datei schreiben.'
        : (trialMode
            ? 'Isolierter Testlauf bereit. Ergebnisse bleiben in diesem Browser-Ursprung.'
            : (screeningHandle
                ? 'Bereit: ' + reviewerPath(normalized) + ' ist verbunden.'
                : 'Arbeitsordner wählen.'))));
    return true;
}

function normalizedReviewerDecisions(decisions, key) {
    const copy = JSON.parse(JSON.stringify(decisions || {}));
    Object.keys(copy).forEach(function(pid) {
        if (copy[pid] && typeof copy[pid] === 'object') copy[pid].reviewer = key;
    });
    return copy;
}

// A paper named in a message: its short title, the identifier only for a paper the
// corpus does not know.
function paperLabel(pid) {
    const paper = papers.find(function(p) { return p.id === pid; });
    if (!paper || !paper.title) return 'Paper ' + pid;
    const title = paper.title.length > 60 ? paper.title.slice(0, 57).replace(/\s+\S*$/, '') + ' …' : paper.title;
    return '„' + title + '“';
}

function recordTimestamp(record) {
    const value = Date.parse(record && record.ts);
    return Number.isFinite(value) ? value : null;
}

// The repository file and the browser recovery copy can diverge after a failed
// physical write. Merge by paper and keep the newer timestamp. A same-paper
// conflict without comparable timestamps is blocked instead of guessed; the detail
// lets the reviewer choose one side explicitly (resolveReviewerConflict).
function mergeReviewerDecisions(fileDecisions, localDecisions) {
    const disk = JSON.parse(JSON.stringify(fileDecisions || {}));
    const local = JSON.parse(JSON.stringify(localDecisions || {}));
    const merged = disk;
    let recovered = false;
    let conflict = null;
    let conflictDetail = null;
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
        // the other until the reviewer chooses one side.
        conflictDetail = { pid: pid, disk: disk[pid], local: local[pid] };
        merged[pid] = local[pid];
        conflict = 'Browser- und Dateistand widersprechen sich bei ' + paperLabel(pid) +
            (diskTs !== null && localTs !== null
                ? ' trotz identischem Zeitstempel.'
                : ' ohne vergleichbare Zeitstempel.');
    });
    return { decisions: merged, recovered: recovered, conflict: conflict, conflictDetail: conflictDetail };
}

// The reviewer resolves a blocked same-paper divergence by keeping either the file or
// the browser version. The other version is dropped deliberately, never by a guess.
function resolveReviewerConflict(key, keep) {
    const detail = reviewerConflicts[key];
    if (!canEdit() || !detail || (keep !== 'disk' && keep !== 'local')) return false;
    if (!state.reviewers[key]) state.reviewers[key] = {};
    state.reviewers[key][detail.pid] = JSON.parse(JSON.stringify(keep === 'disk' ? detail.disk : detail.local));
    delete reviewerConflicts[key];
    delete reviewerFileErrors[key];
    reviewerRecoveryPending[key] = keep === 'local';
    saveLocal();
    setSaveStatus(keep === 'disk' ? 'ready' : 'dirty', keep === 'disk'
        ? 'Dateistand übernommen.'
        : 'Browserstand übernommen. Mit der Diskette in die Datei schreiben.');
    return true;
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
    adoptVerifications(target, obj);
    adoptAgentTrack();
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

// The browser snapshot and the in-memory tracks belong to one working folder. Another
// folder starts clean, so records of one clone never reach the file of another.
async function bindFolder(handle) {
    let other = false;
    if (dirHandle && dirHandle !== handle && typeof handle.isSameEntry === 'function') {
        try { other = !(await handle.isSameEntry(dirHandle)); } catch (e) { other = true; }
    } else if (!dirHandle && folderIdentity && handle && handle.name && folderIdentity !== handle.name) {
        other = true;
    }
    if (other) {
        state.reviewers = {};
        [reviewerEnvelopes, quarantinedRecords, lastDiskText, verificationRecords, drafts].forEach(function(map) {
            Object.keys(map).forEach(function(key) { delete map[key]; });
        });
        reviewerFileErrors = {};
        reviewerConflicts = {};
        reviewerRecoveryPending = {};
        agentTrack = { reviewer: null, records: {} };
        work = emptyWork(null);
    }
    folderIdentity = handle && handle.name ? handle.name : null;
    return other;
}

async function connectHandle(handle) {
    connecting = true;
    try {
        await bindFolder(handle);
        dirHandle = handle;
        await resolveScopes(handle);
        await loadAllReviewers();
    } finally {
        connecting = false;
    }
    setConnectedSaveStatus();
    renderData(document.getElementById('pt-data-inline'));
    renderScreening();
}

function setConnectedSaveStatus() {
    const fileError = state.reviewer && reviewerFileErrors[state.reviewer];
    if (fileError) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(state.reviewer) +
            ' wird nicht verändert: ' + fileError);
        return;
    }
    if (state.reviewer && reviewerRecoveryPending[state.reviewer]) {
        setSaveStatus('dirty', 'Neuere Browser-Änderungen wurden wiederhergestellt. Mit der Diskette in ' +
            reviewerPath(state.reviewer) + ' schreiben.');
        return;
    }
    setSaveStatus(state.reviewer ? 'ready' : 'needs-reviewer', state.reviewer
        ? 'Arbeitsordner verbunden.'
        : 'Arbeitsordner verbunden. Kürzel festlegen.');
}

async function connectRepo() {
    if (!canEdit()) return;
    if (!fsSupported()) { setSaveStatus('error', 'Lokales Speichern braucht einen Chromium-basierten Browser.'); return; }
    try {
        const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        if (!canEdit()) return;
        await idbSet('dir', handle);
        storedHandleAvailable = true;
        await connectHandle(handle);
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.warn('[PRISMA] connect failed:', e);
            setSaveStatus('error', 'Verbindung fehlgeschlagen: ' + (e.message || e.name) + '. Browser-Zwischenstand bleibt erhalten.');
            renderData(document.getElementById('pt-data-inline'));
        }
    }
}

async function reconnectRepo() {
    if (!canEdit() || !fsSupported()) return;
    try {
        const handle = await idbGet('dir');
        if (!canEdit()) return;
        if (!handle) { storedHandleAvailable = false; renderData(document.getElementById('pt-data-inline')); return; }
        storedHandleAvailable = true;
        const perm = await handle.requestPermission({ mode: 'readwrite' });
        if (!canEdit()) return;
        if (perm !== 'granted') {
            setSaveStatus('error', 'Schreibrecht nicht erteilt. Browser-Zwischenstand bleibt erhalten.');
            renderData(document.getElementById('pt-data-inline'));
            return;
        }
        await connectHandle(handle);
    } catch (e) {
        console.warn('[PRISMA] reconnect failed:', e);
        setSaveStatus('error', 'Erneutes Verbinden fehlgeschlagen: ' + (e.message || e.name) + '.');
        renderData(document.getElementById('pt-data-inline'));
    }
}

async function restoreRepoConnection() {
    if (!canEdit() || !fsSupported()) return;
    try {
        const handle = await idbGet('dir');
        if (!handle || !canEdit()) return;
        storedHandleAvailable = true;
        const permission = handle.queryPermission ? await handle.queryPermission({ mode: 'readwrite' }) : 'prompt';
        if (!canEdit()) return;
        if (permission !== 'granted') {
            setSaveStatus('local', 'Arbeitsordner einmal freigeben.');
            renderData(document.getElementById('pt-data-inline'));
            return;
        }
        await connectHandle(handle);
    } catch (e) {
        console.warn('[PRISMA] saved folder restore failed:', e);
        setSaveStatus('error', 'Gespeicherter Arbeitsordner konnte nicht verbunden werden.');
        renderData(document.getElementById('pt-data-inline'));
    }
}

// One record of a reviewer file that cannot be used: an unknown paper, an invalid
// decision value, or a human record bound to a different Work-Version than the corpus.
function recordProblem(id, record, schema) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return 'kein Record-Objekt';
    if (papers.length && !papers.some(function(p) { return p.id === id; })) return 'unbekannte Paper-ID';
    if (['Include', 'Exclude', 'Unclear'].indexOf(record.decision) === -1) return 'ungültige Decision';
    if (record.reason !== undefined && record.reason !== null && typeof record.reason !== 'string') return 'ungültiger Ausschlussgrund';
    if (record.reason && EXCLUSION_REASONS.length && EXCLUSION_REASONS.indexOf(record.reason) === -1) return 'unbekannter Ausschlussgrund';
    const paper = papers.find(function(item) { return item.id === id; });
    if (schema === REVIEWER_SCHEMA && paperIdentityReady(paper) && (!record.work_id || !record.version_id || !record.version_type))
        return 'Werk- oder Fassungsbindung fehlt';
    // agent tracks carry legacy Work aliases; only PRISM's own human captures are held
    // to the exact binding of the current corpus
    if (paper && record.actor !== 'agent' && (schema === REVIEWER_SCHEMA || schema === GOVERNED_SCHEMA) &&
            record.work_id && record.version_id && paper.work_id && paper.version_id &&
            (record.work_id !== paper.work_id || record.version_id !== paper.version_id))
        return 'Werk- oder Fassungsbindung weicht vom Korpus ab';
    return null;
}

async function loadAllReviewers() {
    if (!canEdit() || !screeningHandle) return;
    const found = {};
    const errors = {};
    const conflicts = {};
    const recoveries = {};
    const texts = {};
    for await (const entry of screeningHandle.values()) {
        if (entry.kind !== 'file' || !/\.json$/.test(entry.name)) continue;
        const fileKey = entry.name.replace(/\.json$/, '');
        const key = normalizedReviewerKey(fileKey);
        if (!key || key === ASSIGNMENT_KEY) continue;
        if (key !== fileKey) {
            errors[key] = 'Der Dateiname muss in kanonischer Kleinschreibung vorliegen.';
            continue;
        }
        try {
            const f = await entry.getFile();
            const text = await f.text();
            if (!text.trim()) continue; // an interrupted first write leaves an empty file
            const obj = JSON.parse(text);
            const check = validateReviewerEnvelope(obj);
            if (!check.ok) throw new Error(check.message);
            if (key === state.reviewer && runActor === 'human' && isAgentTrackPayload(obj))
                throw new Error('Das Kürzel gehört zu einer Agentenspur.');
            // Single unusable records are kept verbatim for the next write but not
            // loaded, so one damaged record cannot lock the whole file.
            const usable = {};
            const held = {};
            Object.keys(obj.decisions).forEach(function(pid) {
                if (recordProblem(pid, obj.decisions[pid], obj.schema)) held[pid] = obj.decisions[pid];
                else usable[pid] = obj.decisions[pid];
            });
            quarantinedRecords[key] = held;
            // The canonical filename owns the reviewer role. This repairs the
            // historical case where reviewer2.json still embedded reviewer1 and
            // prevents the two files from collapsing into one in-memory track.
            const disk = normalizedReviewerDecisions(usable, key);
            const local = normalizedReviewerDecisions(state.reviewers[key] || {}, key);
            const merged = mergeReviewerDecisions(disk, local);
            found[key] = merged.decisions;
            reviewerEnvelopes[key] = JSON.parse(JSON.stringify(obj));
            texts[key] = text;
            if (adoptVerifications(key, obj)) recoveries[key] = true;
            if (merged.recovered) recoveries[key] = true;
            if (merged.conflict) { errors[key] = merged.conflict; conflicts[key] = merged.conflictDetail; }
        } catch (e) {
            errors[key] = e && e.message ? e.message : String(e);
            console.warn('[PRISMA] could not read', entry.name, e);
        }
    }
    if (!canEdit()) return;
    reviewerFileErrors = errors;
    reviewerConflicts = conflicts;
    reviewerRecoveryPending = recoveries;
    Object.keys(texts).forEach(function(k) { lastDiskText[k] = texts[k]; });
    // Apply resolved records. On a blocked conflict, the file stays untouched on disk
    // while the browser recovery remains in memory and localStorage.
    Object.keys(found).forEach(function(k) { state.reviewers[k] = found[k]; });
    adoptAgentTrack();
    saveLocal();
}

// --- productive agent track and its expert verification layer ---

// The operative criterion is the record state, not the envelope label: the agent
// track is the connected file whose decisions were carried to ai-agent-reviewed.
function isAgentTrackPayload(obj) {
    if (!obj || obj.actor !== 'agent' || !obj.decisions || typeof obj.decisions !== 'object') return false;
    return Object.keys(obj.decisions).some(function(id) {
        const record = obj.decisions[id];
        return !!(record && record.lifecycle && record.lifecycle.state === 'ai-agent-reviewed');
    });
}

// Union by event id: an event recorded in the browser but not yet written to the file
// survives the connection and marks the track for recovery. Returns that marker.
function adoptVerifications(key, payload) {
    const disk = payload && Array.isArray(payload.verifications) ? payload.verifications : [];
    const local = Array.isArray(verificationRecords[key]) ? verificationRecords[key] : [];
    const seen = {};
    const out = [];
    let localOnly = false;
    disk.concat(local).forEach(function(entry, index) {
        const id = entry && entry.event && entry.event.event_id;
        if (!id || seen[id]) return;
        seen[id] = true;
        if (index >= disk.length) localOnly = true;
        out.push(JSON.parse(JSON.stringify(entry)));
    });
    verificationRecords[key] = out;
    return localOnly;
}

function adoptAgentTrack() {
    let chosen = null;
    Object.keys(reviewerEnvelopes).sort().forEach(function(key) {
        if (!isAgentTrackPayload(reviewerEnvelopes[key])) return;
        if (!chosen || String(reviewerEnvelopes[key].updated || '') > String(reviewerEnvelopes[chosen].updated || ''))
            chosen = key;
    });
    const source = chosen ? reviewerEnvelopes[chosen] : servedAgentEnvelope;
    agentTrack = source
        ? { reviewer: chosen || normalizedReviewerKey(source.reviewer), records: JSON.parse(JSON.stringify(source.decisions || {})) }
        : { reviewer: null, records: {} };
    projectExpertVerifications();
}

// The served agent track is read for comparison and diagnostics only; human sessions
// never display it (ADR-044). It is validated like a file and never written.
function loadServedAgentTracks() {
    if (runActor !== 'human' || trialMode || acceptanceMode || typeof fetch !== 'function') return Promise.resolve(null);
    return Promise.all(SERVED_AGENT_TRACKS.map(function(key) {
        return fetch('data/screening/' + key + '.json')
            .then(function(r) { return r.ok ? r.json() : null; })
            .catch(function() { return null; });
    })).then(function(payloads) {
        const usable = payloads.filter(function(obj) {
            return obj && validateReviewerEnvelope(obj).ok && isAgentTrackPayload(obj);
        });
        servedAgentEnvelope = usable.length ? usable[0] : null;
        if (servedAgentEnvelope) {
            const decisions = {};
            Object.keys(servedAgentEnvelope.decisions).forEach(function(pid) {
                if (!recordProblem(pid, servedAgentEnvelope.decisions[pid], servedAgentEnvelope.schema))
                    decisions[pid] = servedAgentEnvelope.decisions[pid];
            });
            servedAgentEnvelope = Object.assign({}, servedAgentEnvelope, { decisions: decisions });
        }
        adoptAgentTrack();
        return servedAgentEnvelope;
    });
}

// The assignment file is optional: a missing or malformed file leaves the feature out.
// Only entries naming a declared reviewer are kept.
function normalizeAssignment(obj) {
    if (!obj || obj.schema !== ASSIGNMENT_SCHEMA || !Array.isArray(obj.reviewers) ||
            !obj.assignments || typeof obj.assignments !== 'object' || Array.isArray(obj.assignments)) return null;
    const reviewers = [];
    obj.reviewers.forEach(function(r) {
        const key = r && normalizedReviewerKey(r.key);
        if (key && key === r.key && !reviewers.some(function(x) { return x.key === key; }))
            reviewers.push({ key: key, label: String(r.label || key) });
    });
    if (!reviewers.length) return null;
    const byPaper = {};
    Object.keys(obj.assignments).forEach(function(pid) {
        if (reviewers.some(function(r) { return r.key === obj.assignments[pid]; })) byPaper[pid] = obj.assignments[pid];
    });
    return { reviewers: reviewers, byPaper: byPaper };
}

function loadAssignment() {
    if (acceptanceMode || typeof fetch !== 'function') return Promise.resolve(null);
    return fetch('data/screening/' + ASSIGNMENT_KEY + '.json')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; })
        .then(function(obj) { assignment = normalizeAssignment(obj); return assignment; });
}

// Expert verification lives in the expert's own file. The agent record shown is the
// projection of that file onto the untouched agent track, rebuilt at load time rather
// than written back into the agent's file.
function projectExpertVerifications() {
    if (!agentTrack.reviewer) return;
    Object.keys(verificationRecords).forEach(function(key) {
        (verificationRecords[key] || []).forEach(function(entry) {
            if (!entry || entry.paper_id === undefined) return;
            if (entry.subject && entry.subject.reviewer && entry.subject.reviewer !== agentTrack.reviewer) return;
            const record = agentTrack.records[entry.paper_id];
            if (record) projectVerification(record, entry);
        });
    });
}

function projectVerification(record, entry) {
    if (!record || !entry || !entry.event || !entry.event.event_id) return record;
    ensureVerificationContract(record);
    const known = record.lifecycle.events.some(function(event) { return event.event_id === entry.event.event_id; });
    if (known) return record;
    applyVerificationProvenance(record, entry.reviewer_id, actorIds(entry.actor_ids), entry.activity_id,
        entry.event.event_type !== 'publication_approval');
    if (entry.annotation && entry.annotation.body) {
        record.annotations.push(JSON.parse(JSON.stringify(entry.annotation)));
        record.active_annotation_id = entry.annotation.annotation_id;
        applyAnnotationBody(record, entry.annotation.body);
    }
    record.lifecycle.events.push(JSON.parse(JSON.stringify(entry.event)));
    if (isLifecycleState(entry.event.to)) record.lifecycle.state = entry.event.to;
    return record;
}

// A paper is in the review queue while its agent record carries an AI Agent Review
// and no domain-expert verification has advanced it.
function awaitsVerification(paperId) {
    const record = agentTrack.records[paperId];
    return !!record && verificationView(record).lifecycle.state === 'ai-agent-reviewed';
}

// The hash the deterministic validator recorded over the exact annotation. PRISM
// computes no hash of its own, so an agent record without a check receipt is bound
// by annotation id alone and says so instead of carrying an invented value.
function subjectRecordHash(record, annotationId) {
    const checks = (record && Array.isArray(record.checks)) ? record.checks : [];
    let hash = null;
    checks.forEach(function(check) {
        const subject = check && check.subject;
        if (!subject || !subject.sha256) return;
        if (annotationId && subject.annotation_id && subject.annotation_id !== annotationId) return;
        hash = subject.sha256;
    });
    return hash;
}

function verificationEntry(paperId, subject, annotationId, event, reviewerId, correction) {
    const hash = subjectRecordHash(subject.record, annotationId);
    const entry = {
        verification_id: verificationEventId(),
        paper_id: paperId,
        subject: {
            reviewer: subject.reviewer || null,
            annotation_id: annotationId || null,
            record_sha256: hash || null,
            hash_status: hash ? 'deterministic_check_receipt' : 'not_recorded'
        },
        reviewer_id: String(reviewerId || '').trim(),
        actor_ids: actorIds(event.actor_ids),
        activity_id: event.activity_id,
        result: event.result,
        at: event.at,
        event: JSON.parse(JSON.stringify(event))
    };
    if (event.note) entry.note = event.note;
    if (correction) entry.annotation = JSON.parse(JSON.stringify(correction));
    return entry;
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

// The served knowledge document of a paper, which carries the LLM-Wissensdestillat layer.
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
// The manifest is excluded from version control and never published, so its presence
// also tells PRISM that it runs from a local project copy, the precondition for
// editing (ADR-042).
let manifestReachable = false;
function loadFulltextManifest() {
    if (fulltextManifest !== null) return Promise.resolve(fulltextManifest);
    return fetch('data/fulltext_manifest.json')
        .then(function(r) { manifestReachable = !!r.ok; return r.ok ? r.json() : {}; })
        .then(function(d) { fulltextManifest = d || {}; return fulltextManifest; })
        .catch(function() { manifestReachable = false; fulltextManifest = {}; return fulltextManifest; });
}

// Editing writes into a local clone through File System Access. The published copy
// has neither, so it renders read-only without a mode switch.
function localEditingAvailable() {
    return fsSupported() && manifestReachable;
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
    return replaceGlyphNames(String(value || '')).normalize('NFKC').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
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
    anStudyTypeLabels = (d.study_type && d.study_type.value_labels) || {};
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

// The AN_ analysis fields are coded only by AI agents (ADR-045). A human record needs
// none and a human session offers no analysis step; an analysis part a human record
// already carries is loaded and written back as it stands.
function analysisRequired(dec) { return !!dec && dec.decision === 'Include' && dec.actor === 'agent'; }
function analysisStepOffered() { return runActor === 'agent' || acceptanceMode; }

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
    return 'Bei Volltext-Basis erforderlich.';
}

// Split a served knowledge document into its two epistemic layers (M3, ADR-016).
// Historical served docs concatenate a paper layer (Abstract, Key Concepts, Full Text)
// and a machine-extraction layer that starts at "## Kernbefund". Current source-bound
// preparation docs are distillates throughout, so their frontmatter and title also stay
// in the AI layer rather than being exposed as original paper text.
function splitDocLayers(md) {
    let lines = (md || '').split(/\r?\n/);
    let b = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^##\s+Core statements\b/i.test(lines[i])) return { paper: '', ai: md || '' };
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
    // Docling often sets the title as a heading below the journal line; the structured
    // title above the text already carries it
    const titleHeading = title ? lines.findIndex(function(line, i) {
        return i < 40 && /^#{1,6}\s/.test(line.trim()) && normalizedLine(line.trim().replace(/^#{1,6}\s+/, '')) === title;
    }) : -1;
    if (titleHeading !== -1) lines.splice(titleHeading, 1);
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

// Docling writes PDF glyphs without a Unicode mapping as /uniXXXX. Exactly four hex
// digits are read, because a longer match would swallow following letters
// ("/uniFB01eld" is "field", not U+FB01E). Ligatures resolve to their letters so that
// search and pins see ordinary text.
function replaceGlyphNames(value) {
    return String(value || '').replace(/\/uni([0-9A-Fa-f]{4})/g, function(match, hex) {
        const cp = parseInt(hex, 16);
        if (cp >= 0xD800 && cp <= 0xDFFF) return match;
        const ch = String.fromCodePoint(cp);
        return cp >= 0xFB00 && cp <= 0xFB06 ? ch.normalize('NFKC') : ch;
    });
}

function isTableSeparator(line) {
    const value = String(line || '');
    return value.indexOf('|') !== -1 && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(value);
}

function isTableStart(lines, i) {
    return /^\s*\|/.test(lines[i] || '') && isTableSeparator(lines[i + 1]);
}

function tableCells(line) {
    let s = String(line || '').trim();
    if (s.charAt(0) === '|') s = s.slice(1);
    if (s.charAt(s.length - 1) === '|') s = s.slice(0, -1);
    return s.split('|').map(function(cell) { return cell.trim(); });
}

// GFM pipe table: the header row precedes the |---| separator. Cells pass through the
// same escaping as paragraphs. The wrapper scrolls horizontally so the reading pane
// itself never does.
function renderTable(lines, i) {
    const head = tableCells(lines[i]);
    let k = i + 2;
    const rows = [];
    while (k < lines.length && /^\s*\|/.test(lines[k])) { rows.push(tableCells(lines[k])); k++; }
    const width = Math.max(head.length, rows.reduce(function(m, r) { return Math.max(m, r.length); }, 0));
    const cells = function(row, tag) {
        let out = '';
        for (let c = 0; c < width; c++) out += '<' + tag + '>' + inlineMd(row[c] || '') + '</' + tag + '>';
        return out;
    };
    // a wide table scrolls on its own and Chromium makes it a tab stop, so it gets a name
    const html = '<div class="pt-doc-table" role="region" aria-label="Tabelle"><table><thead><tr>' + cells(head, 'th') + '</tr></thead><tbody>' +
        rows.map(function(row) { return '<tr>' + cells(row, 'td') + '</tr>'; }).join('') + '</tbody></table></div>';
    return { html: html, next: k };
}

const GLOSSARY_HEADING = /acronyms|abbreviations|glossary|abk(ü|ue)rzungen|akronyme/i;

// Under an acronym heading, alternating one-line paragraphs of a short term and its
// expansion become a definition list. The pattern is read conservatively and stops at
// the first block that breaks it, so ordinary prose is never reshaped.
function glossaryPairs(lines, start) {
    const pairs = [];
    let k = start;
    const blank = function(n) { return n >= lines.length || !lines[n].trim(); };
    for (;;) {
        let a = k;
        while (a < lines.length && !lines[a].trim()) a++;
        if (a >= lines.length || /^#{1,6}\s/.test(lines[a]) || !blank(a + 1)) break;
        let b = a + 1;
        while (b < lines.length && !lines[b].trim()) b++;
        if (b >= lines.length || /^#{1,6}\s/.test(lines[b]) || !blank(b + 1)) break;
        const term = lines[a].trim(), definition = lines[b].trim();
        if (term.length > 15 || /[.!?;:,]/.test(term) || /^[-*>|]/.test(term) || /^[-*>|]/.test(definition)) break;
        pairs.push([term, definition]);
        k = b + 1;
    }
    return { pairs: pairs, next: k };
}

function renderMarkdown(md) {
    md = replaceGlyphNames(stripFrontmatter(md));
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
        if (hm) {
            closeList();
            const lvl = Math.min(hm[1].length, 4);
            out.push('<h' + lvl + ' class="pt-doc-h' + lvl + '">' + inlineMd(hm[2]) + '</h' + lvl + '>');
            i++;
            if (GLOSSARY_HEADING.test(hm[2])) {
                const glossary = glossaryPairs(lines, i);
                if (glossary.pairs.length >= 2) {
                    out.push('<dl class="pt-doc-dl">' + glossary.pairs.map(function(pair) {
                        return '<div><dt>' + inlineMd(pair[0]) + '</dt><dd>' + inlineMd(pair[1]) + '</dd></div>';
                    }).join('') + '</dl>');
                    i = glossary.next;
                }
            }
            continue;
        }
        if (isTableStart(lines, i)) {
            closeList();
            const table = renderTable(lines, i);
            out.push(table.html);
            i = table.next;
            continue;
        }
        const lm = ln.match(/^\s*[-*]\s+(.*)$/);
        if (lm) { if (!inList) { out.push('<ul class="pt-doc-ul">'); inList = true; } out.push('<li>' + inlineMd(lm[1]) + '</li>'); i++; continue; }
        const bm = ln.match(/^>\s?(.*)$/);
        if (bm) { closeList(); out.push('<blockquote class="pt-doc-q">' + inlineMd(bm[1]) + '</blockquote>'); i++; continue; }
        closeList();
        const para = [ln]; i++;
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
               !/^\s*[-*]\s/.test(lines[i]) && !/^---\s*$/.test(lines[i]) && !/^>\s?/.test(lines[i]) &&
               !isTableStart(lines, i)) { para.push(lines[i]); i++; }
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
    // Ctrl+S (Cmd+S) saves in Bearbeiten: the disk action sits above the list, far from
    // the assessment in the tab order, and the browser's own page save is never wanted here
    if (!pageListenersBound) {
        pageListenersBound = true;
        window.addEventListener('popstate', restoreFromUrl);
        document.addEventListener('keydown', function(e) {
            if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey || String(e.key).toLowerCase() !== 's' || !canEdit()) return;
            e.preventDefault();
            saveCurrent();
        });
    }
    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    const query = new URLSearchParams(window.location.search);
    trialMode = query.get('trial') === '1';
    const requestedActor = query.get('actor');
    runActor = requestedActor === 'agent' ? 'agent' : 'human';
    if (trialMode && !requestedActor) runActor = 'agent';
    readFilterQuery(query);
    loadLocal();
    const requestedReviewer = normalizedReviewerKey(query.get('reviewer'));
    const requestedPaper = query.get('paper');
    const requestedReview = query.get('review');
    loadCorpusIndex(); // background: ready by the time the user runs a corpus search
    loadAnalysisFields().then(function() { // background: the frozen AN_ vocabulary for the analysis step (FR-14)
        if (initialized) { refreshAssess(); refreshCorpusList(); }
    });
    if (requestedReview) {
        const root = document.getElementById('prisma-root');
        if (root) root.innerHTML = '<section class="pt-shell"><h2>Screening</h2>' +
            '<div class="pt-acceptance-status" role="status">Abnahmeansicht wird geladen&hellip;</div></section>';
        loadFulltextManifest().then(function() { if (initialized) refreshSourcePill(); });
        loadAcceptanceReview(requestedReview, requestedPaper);
        return;
    }
    // The first paint waits for the manifest and the served agent track: the manifest
    // decides whether editing is offered, the track which annotation a paper shows.
    Promise.all([loadFulltextManifest(), loadServedAgentTracks(), loadAssignment()]).then(function() {
        // Trial and agent URLs explicitly select an authoring workflow. ?verify=1 is the
        // former verification entry and opens Bearbeiten where editing is available.
        // Ordinary links, including paper deep links and cached reviewer profiles,
        // confer no editing permission.
        editMode = trialMode || requestedActor === 'agent' ||
            (query.get('verify') === '1' && localEditingAvailable());
        if (trialMode && requestedReviewer) selectReviewer(requestedReviewer);
        state.index = startIndexForPaper(requestedPaper);
        if (canEdit()) announceEditing();
        renderShell();
        renderScreening();
        if (canEdit() && !trialMode) restoreRepoConnection();
        console.log('[PRISMA] initialized, ' + papers.length + ' papers, local editing ' + (localEditingAvailable() ? 'available' : 'unavailable'));
    });
};

function loadAcceptanceReview(slug, requestedPaper) {
    if (!/^[a-z0-9-]+$/.test(slug || '')) {
        renderShell();
        renderScreening();
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
        renderScreening();
    }).catch(function(error) {
        acceptanceMode = null;
        renderShell();
        renderScreening();
        setSaveStatus('error', 'Abnahmefall konnte nicht geladen werden: ' + (error.message || error));
        renderData(document.getElementById('pt-data-inline'));
    });
}

// Shell

// The live region sits outside every re-rendered container, so status changes are
// announced once instead of being lost with the replaced markup.
function renderShell() {
    const root = document.getElementById('prisma-root');
    if (!root) return;
    root.innerHTML = '<div class="pt-surface" id="pt-surface"></div>' +
        '<div class="pt-sr-only" id="pt-live" role="status" aria-live="polite"></div>';
}

let announceTimer = null;
function announce(message) {
    const live = document.getElementById('pt-live');
    if (!live || !message) return;
    live.textContent = '';
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function() { live.textContent = message; }, 30);
}

function modeSwitchAvailable() {
    return !acceptanceMode && !trialMode && runActor !== 'agent' && localEditingAvailable();
}

// Workspace controls live at the top of the corpus column so the reading and
// assessment panes start directly below the site header. The published copy cannot
// edit, so it renders no switch at all.
function workspaceBarHtml() {
    let html = '';
    if (modeSwitchAvailable()) {
        html += '<div class="pt-wsbar-top"><div class="pt-mode-seg" role="group" aria-label="Arbeitsmodus">' +
            '<button class="pt-seg-btn pt-read-mode" id="pt-read-mode" type="button" aria-pressed="' + !canEdit() + '">Lesen</button>' +
            '<button class="pt-seg-btn pt-edit-mode" id="pt-edit-mode" type="button" aria-pressed="' + canEdit() +
            '" title="Kürzel, Arbeitsordner, Bewertungen und Speichern. Ein ungespeicherter Entwurf bleibt beim Wechsel erhalten.">Bearbeiten</button>' +
            '</div></div>';
    }
    html += '<section class="pt-sync-inline" id="pt-data-inline" aria-label="Kürzel und Arbeitsordner"></section>';
    return html;
}

function bindWorkspaceBar(container) {
    const toggle = container.querySelector('#pt-edit-mode');
    if (toggle) toggle.addEventListener('click', function() { if (!canEdit()) setEditMode(true); });
    const reader = container.querySelector('#pt-read-mode');
    if (reader) reader.addEventListener('click', function() { if (canEdit()) setEditMode(false); });
    renderData(container.querySelector('#pt-data-inline'));
}

// Kept for the test hook and browser traces; PRISM has one surface.
function showSurface() {
    saveLocal();
    renderScreening();
}

function focusDataInline() {
    const inline = document.getElementById('pt-data-inline');
    const first = inline && inline.querySelector('#pt-reviewer-key, .pt-folder-action, .pt-change-folder');
    if (first && typeof first.focus === 'function') first.focus();
}

function surfaceEl() { return document.getElementById('pt-surface'); }

// URL state: the open paper and the list filters, so a reload or a shared link
// restores the same view. Other parameters (trial, actor, reviewer, review) stay.
function readFilterQuery(query) {
    const status = query.get('status');
    state.statusFilter = status === 'offen' || status === 'erfasst' ? status : 'alle';
    const cats = String(query.get('cats') || '').split(',').filter(function(c) { return ALL_CATS.indexOf(c) !== -1; });
    state.catFilter = cats.filter(function(c, i) { return cats.indexOf(c) === i; });
    // checked against the assignment file when the filter is applied, which loads later
    state.assigneeFilter = normalizedReviewerKey(query.get('assignee')) || 'alle';
}

function syncUrl() {
    if (!window.history || typeof window.history.replaceState !== 'function') return;
    let url;
    try { url = new URL(window.location.href); } catch (e) { return; }
    const paper = papers[state.index];
    if (paper && paper.id) url.searchParams.set('paper', paper.id);
    if (state.statusFilter !== 'alle' && statusFilterAvailable()) url.searchParams.set('status', state.statusFilter);
    else url.searchParams.delete('status');
    if (state.catFilter.length) url.searchParams.set('cats', state.catFilter.join(','));
    else url.searchParams.delete('cats');
    if (activeAssignee() !== 'alle') url.searchParams.set('assignee', activeAssignee());
    else url.searchParams.delete('assignee');
    const next = url.pathname + url.search + url.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
        // another paper is a new history entry, so the browser's back button returns to
        // the previous one; a filter change replaces the current entry
        const shown = new URLSearchParams(window.location.search).get('paper');
        const push = !!(shown && paper && shown !== paper.id && typeof window.history.pushState === 'function');
        try { window.history[push ? 'pushState' : 'replaceState'](null, '', next); } catch (e) { /* sandboxed frames refuse it */ }
    }
}

function restoreFromUrl() {
    if (!initialized || acceptanceMode || !papers.length) return;
    const query = new URLSearchParams(window.location.search);
    readFilterQuery(query);
    const wanted = query.get('paper');
    const index = wanted ? papers.findIndex(function(p) { return p.id === wanted; }) : -1;
    if (index !== -1) state.index = index;
    closePinMenu();
    focusReadingOnRender = true;
    renderScreening();
}

// Decision helpers

function aiProposal(paper) {
    if (!paper || !paper.llm || !paper.llm.decision) return null;
    return { decision: paper.llm.decision, categories: paper.llm.all_categories || {}, reasoning: paper.llm.reasoning || '' };
}

function humanDecision(paper, persp) {
    persp = persp || state.reviewer;
    if (persp === SEED) {
        if (paper.human && paper.human.decision)
            return { decision: paper.human.decision, categories: paper.human.all_categories || {}, source: SEED };
        return null;
    }
    let d = state.reviewers[persp] && state.reviewers[persp][paper.id];
    return d ? { decision: d.decision, categories: d.categories || {}, reason: d.reason, source: persp } : null;
}

// Categories are three-level (nein/teilweise/ja = 0/1/2). A legacy boolean and the
// historical import strings coerce like their numbers; anything else is nein.
const CAT_STATE = ['nein', 'teilweise', 'ja'];
function catLevel(v) { return v === true || v === 2 || v === '2' ? 2 : (v === 1 || v === '1' ? 1 : 0); }
function dimLevel(keys, cats) {
    return keys.reduce(function(m, c) { const l = catLevel(cats[c]); return l > m ? l : m; }, 0);
}
function decCls(d) { return d === 'Include' ? 'include' : (d === 'Unclear' ? 'unclear' : 'exclude'); }

// The three levels map to a three-way derived decision: both dimensions with a "ja" ->
// Include; both at least "teilweise" but not both "ja" -> Unclear; any dimension entirely
// "nein" -> Exclude (ADR-024).
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

// The consolidated round-one expert decision as a prefill (ADR-042). The binary
// categories map 1 to ja, 0 and null to nein. The decision is an independent fact and
// is taken over as it stands: where the derivation rule disagrees (expert Excludes
// with both groups set), the override records the deliberate deviation.
const EXPERT_OVERRIDE_REASON = 'Expert:innen-Entscheidung übernommen';
function expertAssessment(paper) {
    const h = paper && paper.human;
    if (!h || (h.decision !== 'Include' && h.decision !== 'Exclude')) return null;
    const cats = {};
    ALL_CATS.forEach(function(c) {
        const v = (h.all_categories || {})[c];
        if (v === 1 || v === true || v === '1') cats[c] = 2;
    });
    const override = finalDecisionOf(cats, false) !== h.decision;
    if (finalDecisionOf(cats, override) !== h.decision) return null;
    const basis = {};
    Object.keys(cats).forEach(function(c) { basis[c] = 'expert_assessment'; });
    return {
        categories: cats,
        decision: h.decision,
        override: override,
        reason: h.decision === 'Exclude' ? EXPERT_EXCLUSION_REASON : null,
        override_reason: override && h.decision === 'Include' ? EXPERT_OVERRIDE_REASON : null,
        evidence: {},
        evidence_basis: basis
    };
}

function abstractQuality(p) {
    let a = (p.abstract || '').trim();
    if (!a) return { ok: false, usable: false, note: 'Kein Abstract vorhanden; bitte die Volltextquelle prüfen.' };
    if (/National Bureau of Economic Research|Founded in 1920, the NBER|private, non-profit, non-partisan organization/i.test(a))
        return { ok: false, usable: false, note: 'Wirkt wie Verlags-Boilerplate (NBER), nicht das Paper-Abstract.' };
    if (a.length < 120) return { ok: false, usable: true, note: 'Sehr kurzes Abstract, evtl. unvollständig.' };
    return { ok: true, usable: true };
}

function abstractUsableForReading(p) {
    return !!(p && abstractQuality(p).usable);
}

// The initial paper is screenable when the currently known paper layer contains
// substantive text: a manifest-backed full text or a non-boilerplate abstract.
// A knowledge document is only the LLM reference layer and never qualifies here.
function isScreenable(p) {
    return !!(p && (hasFullText(p) || abstractQuality(p).ok));
}

// A link with list filters (an assignee's own link) opens on the first open paper of
// that list; without one in the list the whole corpus is searched.
function firstEntryIndex() {
    const listed = visibleRows().find(function(row) { return !isDone(row.paper) && isScreenable(row.paper); });
    if (listed) return listed.index;
    for (let i = 0; i < papers.length; i++) {
        if (!isDone(papers[i]) && isScreenable(papers[i])) return i;
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

// Aggregation for the operator utilities. Agreement metrics were removed with
// ADR-017; computeFlow stays because the flow diagram needs the per-track counts.
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

// Subject of a paper (ADR-042, ADR-044): the annotation a paper currently carries, in the
// order own saved record > consolidated expert decision > none. Human reviewers see no AI
// pre-assessment, so neither the productive agent record nor the LLM assessment becomes a
// subject; the agent track stays loaded for comparison and diagnostics only. Agent runs
// and acceptance views see only their own track.

function referencesAllowed() { return runActor === 'human' && !trialMode && !acceptanceMode; }

function ownRecord(p) {
    if (!p || !state.reviewer || !state.reviewers[state.reviewer]) return null;
    return state.reviewers[state.reviewer][p.id] || null;
}

function paperSubject(p) {
    if (!p) return { kind: 'empty', record: null };
    const own = ownRecord(p);
    if (own) return { kind: 'own', record: own };
    if (referencesAllowed()) {
        const expert = expertAssessment(p);
        if (expert) return { kind: 'expert', record: expert };
    }
    return { kind: 'empty', record: null };
}

// Own work: an own saved record. Verification entries of earlier builds still load and
// project onto the agent track, but no longer count as screening (ADR-044).
function isCaptured(p) {
    return !!ownRecord(p);
}

// "Erfasst" in list, filter and counter: own work, or a decision of the consolidated
// expert assessment (the earlier Excel workflow), which the operator counts as done.
// Papers with only an agent record or no assessment stay open.
function isDone(p) {
    return isCaptured(p) || !!expertAssessment(p);
}

function listState(p) {
    if (isCaptured(p)) return 'erfasst';
    return paperSubject(p).kind === 'expert' ? 'expert' : 'none';
}

const LIST_STATE_LABELS = {
    erfasst: 'erfasst',
    expert: 'erfasst, Expert:innen-Entscheidung',
    none: 'offen'
};

function statusLabel(st) { return LIST_STATE_LABELS[st] || 'offen'; }

function currentCategories(p) {
    const subject = paperSubject(p);
    return subject.record ? (subject.record.categories || {}) : {};
}

// The status filter separates done (own work or an expert decision) from open papers,
// which is meaningful in the read-only published copy as well.
function statusFilterAvailable() {
    return !acceptanceMode;
}

function matchesCategoryFilter(p) {
    if (!state.catFilter.length) return true;
    const cats = currentCategories(p);
    return state.catFilter.every(function(c) { return catLevel(cats[c]) > 0; });
}

function matchesStatusFilter(p, status) {
    if (status === 'erfasst') return isDone(p);
    if (status === 'offen') return !isDone(p);
    return true;
}

// Rows before the status filter: the corpus search (if any) and the category filter.
function baseRows() {
    let rows = papers.map(function(p, index) { return { paper: p, index: index, kind: '', count: 0 }; });
    if (acceptanceMode) rows = rows.filter(function(row) { return !!curDec()[row.paper.id]; });
    if (corpusQuery.trim() && corpusIndex) {
        rows = corpusSearchResults(corpusQuery);
        if (acceptanceMode) rows = rows.filter(function(row) { return !!curDec()[row.paper.id]; });
    }
    return rows.filter(function(row) { return matchesCategoryFilter(row.paper); });
}

// The assignee filter exists where the status filter does and an assignment file
// was loaded. A requested key the file does not declare falls back to all papers.
function assigneeFilterAvailable() {
    return statusFilterAvailable() && !!assignment;
}

function activeAssignee() {
    if (!assigneeFilterAvailable()) return 'alle';
    const key = state.assigneeFilter;
    return assignment.reviewers.some(function(r) { return r.key === key; }) ? key : 'alle';
}

function assigneeOf(p) {
    return assignment && p ? (assignment.byPaper[p.id] || null) : null;
}

function assigneeLabel(key) {
    const r = assignment && assignment.reviewers.find(function(x) { return x.key === key; });
    return r ? r.label : '';
}

function matchesAssigneeFilter(p, key) {
    return key === 'alle' || assigneeOf(p) === key;
}

function visibleRows() {
    const status = statusFilterAvailable() ? state.statusFilter : 'alle';
    const assignee = activeAssignee();
    return baseRows().filter(function(row) {
        return matchesStatusFilter(row.paper, status) && matchesAssigneeFilter(row.paper, assignee);
    });
}

// Surface: Screening (read + search + pin evidence)

function renderScreening() {
    let el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper geladen.</p>'; return; }
    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;

    const p = papers[state.index];
    const paperChanged = renderedPaperId !== p.id;
    if (paperChanged) {
        state.readMode = 'full';
        renderedPaperId = p.id;
        railStep = 'assess';
    }
    if (canEdit()) work = draftFor(p);
    const oldList = document.getElementById('pt-corpus-list');
    const listScroll = oldList ? oldList.scrollTop : null;

    let html = '<div class="pt-ws pt-ws-screen">';
    html += corpusHtml();
    html += readingShellHtml(p);
    html += '<aside class="pt-rail" id="pt-assess-col" aria-label="Bewertung">' + railHtml(p) + '</aside>';
    html += '<div class="pt-pinmenu" id="pt-pinmenu" hidden></div>';
    html += '</div>';

    el.innerHTML = html;
    bindWorkspaceBar(el);
    // the load starts first: it raises readingPending synchronously, so the save gate
    // that attachScreening evaluates sees this paper's load rather than the previous one
    loadReadingInto(p);
    attachScreening(p);
    const list = document.getElementById('pt-corpus-list');
    if (list) {
        if (listScroll !== null) list.scrollTop = listScroll;
        const active = list.querySelector('.pt-nav-item.active');
        if (active && typeof active.scrollIntoView === 'function') active.scrollIntoView({ block: paperChanged ? 'center' : 'nearest' });
    }
    syncUrl();

    // keyboard flow: after a paper switch (corpus pick, next-open), move focus to the
    // paper heading so the reader does not lose its place to document body (a11y).
    if (focusReadingOnRender) {
        focusReadingOnRender = false;
        const title = document.getElementById('pt-paper-title');
        if (title && typeof title.focus === 'function') title.focus({ preventScroll: true });
    }
}

// ---- left: corpus navigator with filters and full-text search ----

function capturedCount() {
    if (acceptanceMode) return 0;
    return papers.reduce(function(n, p) { return n + (isDone(p) ? 1 : 0); }, 0);
}

function positionBarHtml() {
    const rows = visibleRows();
    const at = rows.findIndex(function(row) { return row.index === state.index; });
    let html = '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos" aria-label="Position in der Liste">' + (at === -1 ? '–' : (at + 1)) + ' / ' + rows.length + '</span>';
    if (canEdit() && !acceptanceMode) {
        const gate = saveGate(papers[state.index]);
        html += '<span class="pt-ws-done">' + capturedCount() + ' von ' + papers.length + ' erfasst</span>';
        html += '<span class="pt-spacer"></span>';
        if (gate.storage) html += '<span class="pt-save-hint" id="pt-save-hint">' + EC.escapeHtml(gate.storage) + '</span>';
        const label = gate.ok ? gate.label : 'Speichern nicht möglich: ' + (gate.storage || gate.reasons[0] || gate.label);
        html += '<button class="pt-save-icon" id="pt-record" type="button" aria-keyshortcuts="Control+S" aria-label="' + EC.escapeHtml(label) +
            '" title="' + EC.escapeHtml(label) + '"' + (gate.ok ? '' : ' disabled') + '>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 3h12l2 2v16H5V3Zm2 2v5h9V5H7Zm1 9v5h8v-5H8Z"></path></svg></button>';
    }
    html += '</div>';
    return html;
}

function filtersHtml() {
    let h = '<div class="pt-list-filters">';
    if (statusFilterAvailable()) {
        // Each segment counts the base rows as narrowed by the other segment, so the
        // numbers of a combined selection add up.
        const base = baseRows();
        const assignee = activeAssignee();
        const counts = { alle: 0, offen: 0, erfasst: 0 };
        base.forEach(function(row) {
            if (!matchesAssigneeFilter(row.paper, assignee)) return;
            counts.alle++;
            if (isDone(row.paper)) counts.erfasst++; else counts.offen++;
        });
        h += '<div class="pt-seg-row"><div class="pt-status-seg" role="group" aria-label="Status">';
        [['alle', 'Alle'], ['offen', 'Offen'], ['erfasst', 'Erfasst']].forEach(function(item) {
            h += '<button type="button" class="pt-seg-btn" data-status="' + item[0] + '" aria-pressed="' + (state.statusFilter === item[0]) + '">' +
                item[1] + ' <span class="pt-seg-count">' + counts[item[0]] + '</span></button>';
        });
        h += '</div>';
        if (assigneeFilterAvailable()) {
            const statusRows = base.filter(function(row) { return matchesStatusFilter(row.paper, state.statusFilter); });
            h += '<div class="pt-assignee-seg" role="group" aria-label="Zuteilung">';
            h += '<button type="button" class="pt-seg-btn" data-assignee="alle" aria-pressed="' + (assignee === 'alle') + '">Alle</button>';
            assignment.reviewers.forEach(function(r) {
                const n = statusRows.filter(function(row) { return assigneeOf(row.paper) === r.key; }).length;
                h += '<button type="button" class="pt-seg-btn" data-assignee="' + EC.escapeHtml(r.key) + '" aria-pressed="' + (assignee === r.key) + '">' +
                    EC.escapeHtml(r.label) + ' <span class="pt-seg-count">' + n + '</span></button>';
            });
            h += '</div>';
        }
        h += '</div>';
    }
    h += '<div class="category-chips pt-cat-filter" role="group" aria-label="Nach Kategorien der aktuellen Annotation filtern">';
    [['Gegenstand', TECH_CATS], ['Perspektive', SOCIAL_CATS]].forEach(function(group, index) {
        if (index) h += '<span class="chip-group-sep" aria-hidden="true"></span>';
        h += '<span class="chip-group-label">' + group[0] + '</span>';
        group[1].forEach(function(c) {
            h += categoryChipHtml(c, state.catFilter.indexOf(c) !== -1 ? 2 : 0, { compact: true, filter: true });
        });
    });
    h += '</div></div>';
    return h;
}

function corpusHtml() {
    let h = '<aside class="pt-nav" aria-label="Dokumente"><div class="pt-nav-tools">' + workspaceBarHtml() + positionBarHtml() + '</div>';
    h += filtersHtml();
    h += '<div class="pt-corpus-search"><input id="pt-corpus-q" type="search" aria-label="Korpus durchsuchen" placeholder="Korpus durchsuchen" value="' +
        EC.escapeHtml(corpusQuery) + '"></div>';
    h += '<div class="pt-nav-list' + (corpusQuery.trim() ? ' is-searching' : '') + '" id="pt-corpus-list">' + corpusListHtml() + '</div></aside>';
    return h;
}

function categoryDotsHtml(cats) {
    const set = ALL_CATS.filter(function(c) { return catLevel(cats[c]) > 0; });
    if (!set.length) return '';
    return '<span class="pt-nav-cats" aria-hidden="true">' + set.map(function(c) {
        return '<span class="chip-dot' + (catLevel(cats[c]) === 1 ? ' is-partial' : '') + '" style="--chip-color:' +
            EC.escapeHtml(CAT_COLOR[c] || '') + '"></span>';
    }).join('') + '</span>';
}

function corpusListHtml() {
    const q = corpusQuery.trim();
    if (q && !corpusIndex) return '<p class="pt-muted pt-corpus-empty">Such-Index lädt…</p>';
    const rows = visibleRows();
    if (!rows.length) return '<p class="pt-muted pt-corpus-empty">' + (q
        ? 'Keine Treffer für &bdquo;' + EC.escapeHtml(corpusQuery) + '&ldquo;.'
        : 'Keine Dokumente in dieser Auswahl.') + '</p>';
    // the assignee shows only while the list is not narrowed to one of them
    const showAssignee = assigneeFilterAvailable() && activeAssignee() === 'alle';
    return rows.map(function(result, n) {
        const p = result.paper, i = result.index;
        const st = listState(p);
        const who = showAssignee ? assigneeLabel(assigneeOf(p)) : '';
        const cats = currentCategories(p);
        const catNames = ALL_CATS.filter(function(c) { return catLevel(cats[c]) > 0; }).map(function(c) { return CAT_LABELS[c]; });
        const badge = q ? '<span class="pt-hit-badge">' + EC.escapeHtml(result.kind === 'Text'
            ? result.count + ' Texttreffer' : result.kind) + '</span>' : '';
        const active = i === state.index;
        // one tab stop for the whole list: the open paper, else the first row; the arrow
        // keys move within the list (bindCorpusItems)
        const tabStop = active || (n === 0 && !rows.some(function(row) { return row.index === state.index; }));
        return '<button type="button" class="pt-nav-item' + (active ? ' active' : '') + '" data-i="' + i + '"' +
            (tabStop ? '' : ' tabindex="-1"') +
            (active ? ' aria-current="true"' : '') + ' data-state="' + st + '" data-match-kind="' + EC.escapeHtml(result.kind || '') + '">' +
            '<span class="pt-nav-mark pt-mark-' + st + '" aria-hidden="true"></span>' +
            '<span class="pt-nav-text"><span class="pt-nav-t">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</span>' +
            '<span class="pt-nav-m">' + EC.escapeHtml(p.author_year || p.authors || 'Autor:in/Jahr unbekannt') +
            (who ? '<span class="pt-nav-assignee"> &middot; ' + EC.escapeHtml(who) + '</span>' : '') + '</span>' +
            (q && result.kind === 'DOI' && p.doi ? '<span class="pt-nav-id">DOI ' + EC.escapeHtml(p.doi) + '</span>' : '') +
            '</span>' + categoryDotsHtml(cats) + badge +
            '<span class="pt-sr-only">, ' + statusLabel(st) + (who ? ', zugeteilt: ' + EC.escapeHtml(who) : '') + (catNames.length ? ', ' + EC.escapeHtml(catNames.join(', ')) : '') + '</span>' +
            '</button>';
    }).join('');
}

function refreshCorpusList() {
    const list = document.getElementById('pt-corpus-list');
    if (list) {
        const scroll = list.scrollTop;
        list.innerHTML = corpusListHtml();
        list.scrollTop = scroll;
        bindCorpusItems();
        list.classList.toggle('is-searching', !!corpusQuery.trim());
    }
    const nav = document.querySelector('.pt-nav-tools .pt-ws-bar');
    if (nav) nav.outerHTML = positionBarHtml();
    const bar = document.querySelector('.pt-nav-tools .pt-ws-bar');
    const record = bar && bar.querySelector('#pt-record');
    if (record) record.addEventListener('click', saveCurrent);
    const filters = document.querySelector('.pt-nav .pt-list-filters');
    if (filters) { filters.outerHTML = filtersHtml(); bindFilters(); }
}

function openPaper(index) {
    state.index = index;
    focusReadingOnRender = true;
    renderScreening();
}

function bindCorpusItems() {
    const list = document.getElementById('pt-corpus-list'); if (!list) return;
    list.onkeydown = function(e) {
        const items = Array.prototype.slice.call(list.querySelectorAll('.pt-nav-item'));
        const at = items.indexOf(document.activeElement);
        if (at === -1) return;
        const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        const next = items[Math.max(0, Math.min(items.length - 1, to))];
        items.forEach(function(item) { item.tabIndex = item === next ? 0 : -1; });
        next.focus();
    };
    list.querySelectorAll('.pt-nav-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            pendingInText = corpusQuery.trim() && btn.dataset.matchKind === 'Text' ? corpusQuery.trim() : null;
            openPaper(parseInt(btn.dataset.i, 10));
        });
    });
}

function bindFilters() {
    const filters = document.querySelector('.pt-nav .pt-list-filters'); if (!filters) return;
    filters.querySelectorAll('[data-status]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.statusFilter = btn.dataset.status;
            refreshCorpusList();
            syncUrl();
            const again = document.querySelector('.pt-nav [data-status="' + state.statusFilter + '"]');
            if (again) again.focus();
        });
    });
    filters.querySelectorAll('[data-assignee]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            state.assigneeFilter = btn.dataset.assignee;
            refreshCorpusList();
            syncUrl();
            const again = document.querySelector('.pt-nav [data-assignee="' + state.assigneeFilter + '"]');
            if (again) again.focus();
        });
    });
    filters.querySelectorAll('.category-chip[data-cat]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const c = btn.dataset.cat;
            const at = state.catFilter.indexOf(c);
            if (at === -1) state.catFilter.push(c); else state.catFilter.splice(at, 1);
            refreshCorpusList();
            syncUrl();
            const again = document.querySelector('.pt-nav .pt-cat-filter [data-cat="' + c + '"]');
            if (again) again.focus();
        });
    });
}

// ---- center: reading column (full text + in-text search) ----

// The source mark appears only when the Paper layer is not a full text.
function sourceMarkHtml(p) {
    if (hasFullText(p)) return '';
    return '<div class="pt-source-mark"><dt>Textbasis</dt><dd>' +
        (abstractUsableForReading(p) ? 'Metadaten-Abstract' : 'kein Papertext') + '</dd></div>';
}

// Kept as the test seam for the source state: an empty string means full text.
function sourcePillHtml(p) {
    const mark = sourceMarkHtml(p);
    return mark ? '<span class="pt-source-state">' + (abstractUsableForReading(p) ? 'Metadaten-Abstract' : 'kein Papertext') + '</span>' : '';
}

// The first paint can precede the full-text manifest in the acceptance view; once it
// resolves, the mark of the open paper is corrected in place.
function refreshSourcePill() {
    const meta = document.querySelector('.pt-paper-metadata');
    if (!meta || !papers.length) return;
    const old = meta.querySelector('.pt-source-mark');
    if (old) old.remove();
    const mark = sourceMarkHtml(papers[state.index]);
    if (mark) meta.insertAdjacentHTML('beforeend', mark);
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

// Publication version and peer review appear only where they change how the text is
// read: a non-preferred version and a missing or pending review are flagged.
function versionMetaHtml(p) {
    let h = '';
    if (p.version_type && p.version_type !== 'unknown' && p.version_type !== 'version_of_record')
        h += '<div><dt>Fassung</dt><dd>' + EC.escapeHtml(versionLabel(p.version_type)) + '</dd></div>';
    if (p.preferred_version_id && p.is_preferred_version === false)
        h += '<div class="pt-meta-warn"><dt>Hinweis</dt><dd>nicht die bevorzugte Fassung</dd></div>';
    if (p.peer_review_status === 'peer_reviewed')
        h += '<div><dt>Begutachtung</dt><dd>' + EC.escapeHtml(peerReviewLabel(p.peer_review_status)) + '</dd></div>';
    else if (p.peer_review_status === 'under_review' || p.peer_review_status === 'not_peer_reviewed')
        h += '<div class="pt-meta-warn"><dt>Begutachtung</dt><dd>' + EC.escapeHtml(peerReviewLabel(p.peer_review_status)) + '</dd></div>';
    return h;
}

function readingShellHtml(p) {
    const authority = p.knowledge_authority || {};
    const layerNote = authority.status === 'preparation'
        ? 'LLM-Ausarbeitung, noch nicht geprüft, nicht der Papertext. Belege von hier zählen nicht als Paper-Beleg.'
        : 'LLM-Wissensdestillat, nicht der Papertext. Belege von hier zählen nicht als Paper-Beleg.';
    let h = '<div class="pt-read pt-read-screen">';
    h += '<div class="pt-paper-head">';
    h += '<h1 class="pt-paper-title" id="pt-paper-title" tabindex="-1">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h1>';
    const doi = normalizedDoi(p.doi);
    const sourceUrl = normalizedSourceUrl(p.url);
    h += '<dl class="pt-paper-metadata">' +
        '<div><dt>Autor:innen</dt><dd>' + EC.escapeHtml(authorDisplay(p)) + '</dd></div>' +
        '<div><dt>Jahr</dt><dd>' + EC.escapeHtml(p.publication_year || p.year || 'nicht angegeben') + '</dd></div>' +
        (p.journal ? '<div><dt>Publikation</dt><dd>' + EC.escapeHtml(p.journal) + '</dd></div>' : '') +
        (doi ? '<div><dt>DOI</dt><dd class="mono"><a class="pt-doi-link" href="' + EC.escapeHtml(doiHref(doi)) +
            '" target="_blank" rel="noopener noreferrer" title="DOI ' + EC.escapeHtml(doi) + ' öffnen">' + EC.escapeHtml(doi) + '</a></dd></div>' : '') +
        (sourceUrl ? '<div><dt>Quelle</dt><dd><a class="pt-source-link" href="' + EC.escapeHtml(sourceUrl) +
            '" target="_blank" rel="noopener noreferrer">Webseite öffnen</a></dd></div>' : '') +
        versionMetaHtml(p) + sourceMarkHtml(p) + '</dl>';
    h += '<div class="pt-layer-toggle" id="pt-layer-toggle" hidden>' +
        '<button type="button" class="pt-layer-btn active" data-mode="full" aria-pressed="true">Papertext</button>' +
        '<button type="button" class="pt-layer-btn" data-mode="ai" aria-pressed="false">LLM-Wissensdestillat</button>' +
        '</div></div>';
    h += '<article class="pt-reading-surface" id="pt-reading-surface" aria-label="Papertext"><div class="pt-read-inner">';
    h += '<div class="pt-intext-bar" id="pt-intext-bar" hidden>' +
        '<input id="pt-intext" type="search" aria-label="Im Text suchen" aria-keyshortcuts="Enter Shift+Enter" placeholder="Im Text suchen">' +
        '<span class="pt-intext-count" id="pt-intext-count" aria-hidden="true"></span>' +
        '<button type="button" class="pt-intext-nav" id="pt-intext-prev" aria-label="Vorheriger Treffer" disabled>&lsaquo;</button>' +
        '<button type="button" class="pt-intext-nav" id="pt-intext-next" aria-label="Nächster Treffer" disabled>&rsaquo;</button>' +
        (canEdit() ? '<button type="button" class="pt-btn pt-pin-hit" id="pt-pin-hit" disabled aria-describedby="pt-pin-help">Treffer anheften</button>' +
            '<span class="pt-sr-only" id="pt-pin-help">Heftet den aktuellen Treffer als Beleg an eine Kategorie. Eine markierte Textstelle lässt sich ebenso anheften. ' +
            'Ein Paper-Beleg setzt eine leere Kategorie auf teilweise.</span>' : '') +
        '</div>';
    h += '<div class="pt-layer-band" id="pt-layer-band" hidden>' + EC.escapeHtml(layerNote) + '</div>';
    h += '<div class="pt-doc" id="pt-doc"><p class="pt-muted">Text lädt…</p></div>';
    h += '</div></article></div>';
    return h;
}

// Two epistemic layers by source (M3, ADR-016): the Paper layer is the original Docling
// full text or the abstract; the LLM knowledge distillate comes from the knowledge document.
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
    } else if (abstractUsableForReading(p)) {
        docHtmlPaper = '<p class="pt-doc-p">' + inlineMd(replaceGlyphNames(p.abstract)) + '</p>';
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
    // the assessment and its save gate depend on the text source, so both are
    // re-evaluated once the text lands
    if (canEdit()) refreshAssess(); else refreshSaveGate();
    return true;
}

function referenceLayerAvailable() {
    const paper = papers[state.index];
    return !!(docHtmlAi && paper && (acceptanceMode || (runActor !== 'agent' && curDec()[paper.id])));
}

// Converted full texts often start with publisher front matter; the reading surface
// opens at the first heading (preferably the abstract). Only the text scrolls, so the
// title and metadata stay in view.
function jumpToFirstHeading(doc) {
    const surface = doc.closest('.pt-reading-surface');
    if (!surface) return;
    window.setTimeout(function() {
        const headings = doc.querySelectorAll('h1, h2, h3');
        let target = null;
        headings.forEach(function(h) { if (!target && /abstract|zusammenfassung|summary/i.test(h.textContent)) target = h; });
        if (!target) target = headings[0];
        if (!target) return;
        const offset = target.getBoundingClientRect().top - surface.getBoundingClientRect().top + surface.scrollTop;
        // short front matter stays in view; only a preamble longer than the pane is skipped
        if (offset < surface.clientHeight * 0.8) return;
        const bar = surface.querySelector('.pt-intext-bar');
        surface.scrollTop = Math.max(0, offset - (bar ? bar.getBoundingClientRect().height + 12 : 12));
    }, 0);
}

function activeLayerHtml() { return state.readMode === 'ai' && referenceLayerAvailable() ? docHtmlAi : docHtmlPaper; }

function paintActiveLayer() {
    let d = document.getElementById('pt-doc'); if (!d) return;
    docHtmlCurrent = activeLayerHtml();
    if (state.readMode === 'full') jumpToFirstHeading(d);
    const paper = papers[state.index];
    d.innerHTML = docHtmlCurrent || '<p class="pt-notext">Kein Papertext geladen.' +
        (paper && normalizedSourceUrl(paper.url) ? ' Quelle über „Webseite öffnen“ prüfen.' : '') + '</p>';
    // search and pinning exist only where there is text to search
    const bar = document.getElementById('pt-intext-bar');
    if (bar) bar.hidden = !docHtmlCurrent;
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
    let doc = document.getElementById('pt-doc'); if (!doc || !docHtmlCurrent) return;
    doc.innerHTML = docHtmlCurrent;
    docMarks = []; docMarkIdx = 0;
    let cnt = document.getElementById('pt-intext-count');
    let pinBtn = document.getElementById('pt-pin-hit');
    const stepBtns = ['pt-intext-prev', 'pt-intext-next'].map(function(id) { return document.getElementById(id); }).filter(Boolean);
    const setStepping = function(on) { stepBtns.forEach(function(b) { b.disabled = !on; }); };
    q = (q || '').trim();
    appliedInTextQuery = q;
    if (q.length < 2) { if (cnt) cnt.textContent = ''; if (pinBtn) pinBtn.disabled = true; setStepping(false); return; }
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
    setStepping(docMarks.length > 1);
    if (docMarks.length) setActiveMark(0);
    else {
        if (cnt) cnt.textContent = '0 Treffer';
        announce('0 Treffer');
    }
}

function setActiveMark(i) {
    if (!docMarks.length) return;
    docMarks.forEach(function(m) { m.classList.remove('active'); });
    docMarkIdx = (i + docMarks.length) % docMarks.length;
    let m = docMarks[docMarkIdx];
    m.classList.add('active');
    if (typeof m.scrollIntoView === 'function') m.scrollIntoView({ block: 'center' });
    const text = (docMarkIdx + 1) + ' von ' + docMarks.length;
    let cnt = document.getElementById('pt-intext-count');
    if (cnt) cnt.textContent = text;
    announce('Treffer ' + text);
}

// The snippet around a search hit is taken at the position of that hit. Looking the
// term up again would return its first occurrence in the paragraph instead.
function snippetAround(el, term) {
    const block = el && el.parentNode ? el.parentNode : null;
    if (!block) return term;
    const ctx = block.textContent || '';
    let at = -1;
    if (typeof document.createRange === 'function') {
        try {
            const range = document.createRange();
            range.setStart(block, 0);
            range.setEndBefore(el);
            at = range.toString().length;
        } catch (e) { at = -1; }
    }
    if (at < 0) at = ctx.toLowerCase().indexOf(String(term || '').toLowerCase());
    if (at < 0) return term;
    const hit = el.textContent || term;
    let start = Math.max(0, at - 90), end = Math.min(ctx.length, at + hit.length + 90);
    return (start > 0 ? '…' : '') + ctx.slice(start, end).trim() + (end < ctx.length ? '…' : '');
}

// ---- evidence pinning (FR-13) ----
// Source layer and acting reviewer are separate provenance dimensions. The legacy
// origin field is retained for existing files; source_layer is authoritative for
// new evidence. A paper pin starts an empty category at level 1 so evidence capture
// cannot silently assert that the category is central.
function pinEvidence(cat, term, snippet, origin) {
    if (!canEdit() || ALL_CATS.indexOf(cat) === -1) return;
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
    markDirty();
    refreshAssess();
}

function unpinEvidence(cat, idx) {
    if (!canEdit()) return;
    if (work.evidence[cat]) {
        work.evidence[cat].splice(idx, 1);
        if (!work.evidence[cat].length) delete work.evidence[cat];
    }
    markDirty();
    refreshAssess();
}

// A category set at teilweise or ja needs a Paper Beleg. The one exception is a level
// taken over unchanged from the consolidated expert decision, recorded per category
// as evidence_basis expert_assessment (ADR-042).
function paperEvidenceMissing(cats, evidence, basis) {
    return ALL_CATS.filter(function(c) {
        if (catLevel((cats || {})[c]) === 0) return false;
        if (basis && basis[c] === 'expert_assessment') return false;
        return !((evidence && evidence[c]) || []).some(isPaperEvidence);
    });
}

function recordRequirements(dec) {
    if (!dec) return { ok: false, missing: ['Entscheidung'] };
    const missing = paperEvidenceMissing(dec.categories || {}, dec.evidence || {}, dec.evidence_basis)
        .map(function(c) { return 'Paper-Beleg: ' + CAT_LABELS[c]; });
    if (dec.decision !== finalDecisionOf(dec.categories || {}, !!dec.override))
        missing.push('Entscheidung passt nicht zu Kategorien und Abweichung');
    if (dec.decision === 'Exclude' && !dec.reason) missing.push('Ausschlussgrund');
    if (dec.decision === 'Include' && dec.override && !String(dec.override_reason || '').trim())
        missing.push('Begründung der Abweichung');
    if (analysisRequired(dec))
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

const ANNOTATION_BODY_FIELDS = ['categories', 'decision', 'override', 'reason', 'override_reason', 'evidence', 'evidence_basis', 'analysis', 'text_source', 'ts', 'reviewer', 'actor'];

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
    if (body.decision !== 'Include' && body.analysis !== undefined && body.analysis !== null)
        return { ok: false, message: 'Analysekodierung gehört nur zu einer Include-Entscheidung.' };
    const requirements = recordRequirements(body);
    if (!requirements.ok)
        return { ok: false, message: 'Die korrigierte Annotation ist unvollständig: ' + requirements.missing.join(', ') + '.' };
    const changes = annotationDiff(current, body);
    if (!changes.length)
        return { ok: false, message: 'Für corrected_and_accepted ist mindestens eine fachliche Änderung erforderlich.' };
    return { ok: true, body: body, changes: changes };
}

// One path records the expert's actors and activity on a record, whether the event
// is taken here or projected from the expert's file onto the agent track at load.
function applyVerificationProvenance(record, reviewer, actors, activity, isVerification) {
    ensureVerificationContract(record);
    const role = isVerification ? 'domain_expert' : 'publication_approval';
    const named = actorIds([].concat(actors || [], reviewer ? [reviewer] : []));
    const provenanceActors = record.provenance.actors = record.provenance.actors || [];
    named.forEach(function(id) {
        let actor = provenanceActors.find(function(item) { return item.id === id; });
        if (!actor) { actor = { id: id, type: 'person', roles: [] }; provenanceActors.push(actor); }
        actor.type = 'person';
        actor.roles = actorIds(actor.roles);
        if (actor.roles.indexOf(role) === -1) actor.roles.push(role);
    });
    if (!activity) return record;
    let activityRecord = record.provenance.activities.find(function(item) { return item.id === activity; });
    if (!activityRecord) {
        activityRecord = {
            id: activity,
            type: isVerification ? 'domain_expert_verification' : 'publication_approval',
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
    named.forEach(function(id) {
        if (activityRecord.associated_actor_ids.indexOf(id) === -1) activityRecord.associated_actor_ids.push(id);
    });
    return record;
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
    // An outcome that does not accept the record must say why; acceptance and
    // correction speak through the record and its field-level changes (ADR-042).
    if ((result === 'changes_requested' || result === 'rejected') && !note)
        return { ok: false, message: 'Eine kurze Notiz ist für dieses Prüfergebnis erforderlich.' };

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
        from: from, to: actualTarget, result: result,
        at: at, activity_id: activity, actor_ids: actors,
        annotation_id: record.active_annotation_id
    };
    if (note) event.note = note;
    applyVerificationProvenance(record, reviewer, actors, activity, isVerification);
    if (correction) {
        const correctionId = verificationEventId();
        record.annotations.push({
            annotation_id: correctionId,
            annotation_type: 'domain_expert_correction',
            supersedes: record.active_annotation_id,
            at: at,
            actor_ids: actors,
            // the governed contract requires a reason; without a note it names the
            // changed fields, which is what the correction states
            reason: note || ('In PRISM korrigiert: ' + correction.changes.map(function(change) { return change.path; }).join(', ')),
            changes: correction.changes,
            body: correction.body
        });
        record.active_annotation_id = correctionId;
        event.annotation_id = correctionId;
        applyAnnotationBody(record, correction.body);
    }
    record.lifecycle.events.push(event);
    record.lifecycle.state = actualTarget;
    return {
        ok: true, event: event, record: record, reviewer_id: reviewer,
        annotation: correction ? record.annotations[record.annotations.length - 1] : null
    };
}

function verificationValue(value, empty) {
    if (value === null || value === undefined || value === '') return '<span class="pt-verify-empty">' + EC.escapeHtml(empty || 'Nicht überliefert') + '</span>';
    if (Array.isArray(value)) return value.length ? EC.escapeHtml(value.join(', ')) : '<span class="pt-verify-empty">' + EC.escapeHtml(empty || 'Keine Angabe') + '</span>';
    if (typeof value === 'object') return EC.escapeHtml(JSON.stringify(value));
    return EC.escapeHtml(String(value));
}

// Provenance carries structured references. Rendering them as raw JSON made the
// panel unreadable exactly where the expert has to judge the evidence basis, so
// each kind is resolved to the line a reader can act on.
function verificationEmpty(text) { return '<span class="pt-verify-empty">' + EC.escapeHtml(text) + '</span>'; }

function hashPrefix(value) {
    const hash = String(value || '').trim();
    return hash ? hash.slice(0, 12) : '';
}

function provenanceRefLabel(item) {
    if (item === null || item === undefined || item === '') return '';
    if (typeof item !== 'object') return String(item);
    const label = String(item.path || item.reference || item.id || item.name || '').trim();
    const hash = hashPrefix(item.sha256 || item.hash);
    let text = item.type && label ? item.type + ': ' + label : (label || String(item.type || ''));
    if (!text) return '';
    if (hash) text += ' · ' + hash;
    return text;
}

function promptLabel(prompt) {
    if (!prompt) return null;
    if (typeof prompt !== 'object') return String(prompt);
    if (prompt.status === 'legacy_gap' || prompt.status === 'unrecorded') return null;
    const reference = String(prompt.reference || prompt.id || prompt.path || '').trim();
    const version = String(prompt.version || '').trim();
    if (!reference && !version) return null;
    return version ? (reference ? reference + ' · v' + version : 'v' + version) : reference;
}

function modelLabel(model) {
    if (!model) return null;
    if (typeof model !== 'object') return String(model);
    if (model.status === 'not_applicable') return 'nicht zutreffend';
    if (model.status === 'legacy_gap') return null;
    const id = String(model.id || model.value || model.reference || model.name || '').trim();
    return id && id !== 'unrecorded' ? id : null;
}

function verificationLabelValue(text, empty) {
    return text ? EC.escapeHtml(text) : verificationEmpty(empty || 'nicht überliefert');
}

function verificationRefList(items, empty) {
    const labels = (Array.isArray(items) ? items : []).map(provenanceRefLabel).filter(function(label) { return !!label; });
    if (!labels.length) return verificationEmpty(empty);
    return '<ul class="pt-verify-refs">' + labels.map(function(label) {
        return '<li>' + EC.escapeHtml(label) + '</li>';
    }).join('') + '</ul>';
}

function lifecycleLabel(value) { return LIFECYCLE_LABELS[value] || String(value || ''); }

function dateLabel(value) {
    const time = Date.parse(value || '');
    if (!Number.isFinite(time)) return '';
    const d = new Date(time);
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
}

// Provenance of a governed record, collapsed below the assessment: activities with
// prompt and model, sources, derivations, annotations and deterministic checks.
function provenanceHtml(record) {
    const view = verificationView(record);
    const provenance = view.provenance || {};
    const activities = provenance.activities || [];
    let h = '<details class="pt-provenance-details"><summary>Provenienz</summary><div class="pt-provenance-body">';
    h += '<dl class="pt-verification-grid">' +
        '<div><dt>Annotation</dt><dd>' + verificationValue(provenance.annotation_id) + '</dd></div>' +
        '<div><dt>Ausgangsstand</dt><dd>' + EC.escapeHtml(lifecycleLabel(view.lifecycle.baseline.state)) +
            (view.lifecycle.baseline.basis ? ' · ' + EC.escapeHtml(view.lifecycle.baseline.basis) : '') + '</dd></div></dl>';
    activities.forEach(function(activity) {
        h += '<div class="pt-verification-activity"><p>' + EC.escapeHtml(activity.type) + ' · ' + verificationValue(activity.run_id) + '</p>' +
            '<dl class="pt-verification-grid"><div><dt>Prompt</dt><dd>' + verificationLabelValue(promptLabel(activity.prompt)) + '</dd></div>' +
            '<div><dt>Modell</dt><dd>' + verificationLabelValue(modelLabel(activity.model)) + '</dd></div></dl></div>';
    });
    if (provenance.legacy_gap) h += '<p class="pt-legacy-gap">' + EC.escapeHtml(String(provenance.legacy_gap)) + '</p>';
    h += '<p class="pt-provenance-label">Quellen</p>' + verificationRefList(provenance.used_sources, 'Keine Quellenprovenienz');
    h += '<p class="pt-provenance-label">Abgeleitet aus</p>' + verificationRefList(provenance.derived_from, 'Keine abgeleiteten Artefakte');
    h += '<p class="pt-provenance-label">Annotationen</p><ol class="pt-verify-refs">' + view.annotations.map(function(annotation) {
        return '<li>' + verificationValue(annotation.annotation_id) + (annotation.supersedes ? ' · ersetzt ' + EC.escapeHtml(annotation.supersedes) : '') +
            (annotation.annotation_id === view.active_annotation_id ? ' · aktiv' : '') + '</li>';
    }).join('') + '</ol>';
    h += '<p class="pt-provenance-label">Validierungen</p>' + (view.checks.length ? '<ol class="pt-verify-refs">' + view.checks.map(function(check) {
        return '<li>' + verificationValue(check.check_type) + ': ' + verificationValue(check.status) + ' · ' + EC.escapeHtml(dateLabel(check.at)) + '</li>';
    }).join('') + '</ol>' : verificationEmpty('Keine Validierungsquittung'));
    return h + '</div></details>';
}

// The event history in one line, oldest first.
function historyHtml(record) {
    const events = verificationView(record).lifecycle.events;
    if (!events.length) return '';
    return '<p class="pt-history">Verlauf: ' + events.map(function(event) {
        const result = event.result && RESULT_LABELS[event.result] && event.to === event.from
            ? RESULT_LABELS[event.result] : lifecycleLabel(event.to);
        return EC.escapeHtml(result) + (event.at ? ' ' + EC.escapeHtml(dateLabel(event.at)) : '');
    }).join(' → ') + '</p>';
}

// ---- drafts: the editable copy of the current annotation ----

function cleanLevels(categories) {
    const out = {};
    ALL_CATS.forEach(function(c) { const level = catLevel((categories || {})[c]); if (level) out[c] = level; });
    return out;
}

function derivedFromExpert(record) {
    const items = record && record.provenance && Array.isArray(record.provenance.derived_from) ? record.provenance.derived_from : [];
    return items.some(function(item) { return item && item.type === 'consolidated_expert_assessment'; });
}

function seedDraft(p, subject) {
    const w = emptyWork(p.id);
    w.seed = subject.kind;
    const r = subject.record;
    if (!r) return w;
    w.cats = cleanLevels(r.categories);
    w.override = !!r.override;
    w.reason = r.reason || null;
    w.overrideReason = r.override_reason || null;
    w.evidence = JSON.parse(JSON.stringify(r.evidence || {}));
    w.analysis = r.analysis ? JSON.parse(JSON.stringify(r.analysis)) : undefined;
    if (subject.kind === 'expert') {
        w.expertBasis = JSON.parse(JSON.stringify(w.cats));
        w.derivedFromExpert = true;
    } else if (subject.kind === 'own') {
        const basis = r.evidence_basis || {};
        const expertBasis = {};
        Object.keys(basis).forEach(function(c) {
            if (basis[c] === 'expert_assessment' && catLevel((r.categories || {})[c])) expertBasis[c] = catLevel(r.categories[c]);
        });
        if (Object.keys(expertBasis).length) w.expertBasis = expertBasis;
        w.derivedFromExpert = derivedFromExpert(r);
    }
    return w;
}

// A stored draft wins only once the reviewer changed it; otherwise the draft is seeded
// afresh, so it follows the current annotation when a folder or track loads later.
function draftFor(p) {
    const stored = drafts[p.id];
    if (stored && stored.dirty) return stored;
    const fresh = seedDraft(p, paperSubject(p));
    drafts[p.id] = fresh;
    return fresh;
}

function markDirty() {
    if (!work || !work.pid) return;
    work.dirty = true;
    drafts[work.pid] = work;
    saveLocal();
}

function discardDraft(p) {
    delete drafts[p.id];
    work = draftFor(p);
    saveLocal();
    refreshAssess();
}

// Categories taken over unchanged from the expert decision and without a Paper pin.
function draftEvidenceBasis(w) {
    const basis = {};
    if (!w || !w.expertBasis) return basis;
    ALL_CATS.forEach(function(c) {
        const level = catLevel(w.cats[c]);
        if (level && w.expertBasis[c] === level && !((w.evidence[c] || []).some(isPaperEvidence))) basis[c] = 'expert_assessment';
    });
    return basis;
}

function workingTextSource() {
    return currentTextSource;
}

function workingDecisionRecord() {
    const decision = finalDecisionOf(work.cats, work.override);
    const textSource = workingTextSource();
    if (decision === 'Include' && runActor === 'agent') work.analysis = sanitizeAnalysis(work.analysis || {}, textSource);
    const record = {
        categories: work.cats,
        decision: decision,
        override: !!work.override,
        reason: decision === 'Exclude' ? (work.reason || null) : null,
        override_reason: work.override && decision === 'Include' ? (String(work.overrideReason || '').trim() || null) : null,
        evidence: work.evidence,
        analysis: decision === 'Include' ? work.analysis : undefined,
        text_source: textSource,
        actor: runActor
    };
    const basis = draftEvidenceBasis(work);
    if (Object.keys(basis).length) record.evidence_basis = basis;
    return record;
}

function paperEvidenceOnly(evidence) {
    const out = {};
    ALL_CATS.forEach(function(c) {
        const items = ((evidence || {})[c] || []).filter(isPaperEvidence);
        if (items.length) out[c] = items;
    });
    return out;
}

// The substantive content of a record, for deciding whether a draft changed it.
function substanceOf(record) {
    const decision = record.decision;
    return JSON.stringify({
        categories: cleanLevels(record.categories),
        decision: decision,
        override: !!record.override,
        reason: decision === 'Exclude' ? (record.reason || null) : null,
        override_reason: decision === 'Include' && record.override ? (String(record.override_reason || '').trim() || null) : null,
        evidence: paperEvidenceOnly(record.evidence),
        analysis: decision === 'Include' ? sanitizeAnalysis(record.analysis || {}, record.text_source) : null
    });
}

// What the single save action does for the open paper.
function saveMode(p, subject) {
    if (!canEdit() || !p) return 'none';
    if (subject.kind === 'own' && substanceOf(workingDecisionRecord()) === substanceOf(subject.record)) return 'none';
    return 'record';
}

function draftReasons(p, subject, mode) {
    if (mode === 'none') return [];
    if (paperIdentityRequired(p) && !paperIdentityReady(p)) return ['Werk- oder Fassungsbindung fehlt'];
    const reasons = [];
    const record = workingDecisionRecord();
    const missing = paperEvidenceMissing(record.categories, record.evidence, record.evidence_basis);
    if (missing.length) reasons.push('Paper-Beleg fehlt: ' + missing.map(function(c) { return CAT_LABELS[c]; }).join(', '));
    if (record.decision === 'Exclude' && !record.reason) reasons.push('Ausschlussgrund wählen');
    if (record.decision === 'Include' && record.override && !record.override_reason) reasons.push('Abweichung begründen');
    if (analysisRequired(record) && !analysisRequirements(record).ok) reasons.push('Analysekodierung unvollständig');
    return reasons;
}

function storageReason() {
    if (!state.reviewer) return 'Kürzel festlegen';
    if (reviewerFileErrors[state.reviewer]) return 'Datei gesperrt';
    if (!trialMode && connecting) return 'Ordner wird abgeglichen';
    if (!trialMode && !screeningHandle) return 'Arbeitsordner verbinden';
    if (readingPending) return 'Text lädt';
    return '';
}

function saveGate(p) {
    const subject = paperSubject(p);
    const mode = saveMode(p, subject);
    const reasons = draftReasons(p, subject, mode);
    // records held only in the browser (a restored recovery, a failed write) are written
    // by the same disk action even when the open paper is unchanged
    if (mode === 'none' && canEdit() && !trialMode && state.reviewer && reviewerRecoveryPending[state.reviewer]) {
        const pending = storageReason();
        return { ok: !pending, mode: 'file', storage: pending, reasons: [], label: 'Ausstehende Änderungen in die Datei schreiben' };
    }
    const storage = mode === 'none' ? '' : storageReason();
    const label = mode === 'none' ? 'Gespeichert, keine Änderung' : 'Bewertung speichern';
    return { ok: mode !== 'none' && !storage && !reasons.length, mode: mode, storage: storage, reasons: reasons, label: label };
}

// ---- right: assessment rail ----

// Shared category chip (docs/css/research.css, "Category chip (shared)"). level 0 is
// off, 1 teilweise (aria-pressed mixed), 2 ja. The colour comes from the schema.
function categoryChipHtml(cat, level, opts) {
    opts = opts || {};
    const lvl = catLevel(level);
    const pressed = lvl === 2 ? 'true' : (lvl === 1 ? 'mixed' : 'false');
    const description = [CAT_DEFS[cat] || ''];
    if (opts.expertBasis) description.push('Expert:innen-Urteil, ohne Textbeleg.');
    return '<button type="button" class="category-chip' + (opts.compact ? ' category-chip--compact' : '') +
        (opts.expertBasis ? ' pt-chip-expert' : '') + '" data-cat="' + EC.escapeHtml(cat) + '" data-level="' +
        (lvl === 1 ? 'teilweise' : (lvl === 2 ? 'ja' : 'nein')) + '" aria-pressed="' + pressed + '" style="--chip-color:' +
        EC.escapeHtml(CAT_COLOR[cat] || '') + '" title="' + EC.escapeHtml(description.join(' ').trim()) + '"' +
        (opts.disabled ? ' disabled' : '') + '>' +
        '<span class="chip-dot" aria-hidden="true"></span><span class="chip-label">' + EC.escapeHtml(CAT_LABELS[cat] || cat) + '</span>' +
        (lvl === 1 && !opts.filter ? '<span class="pt-sr-only">, teilweise</span>' : '') +
        '</button>';
}

// Test seam kept under its former name: the panel toggle for one category.
function chipHtml(cat, level, locked) { return categoryChipHtml(cat, level, { disabled: !!locked }); }

function railEditable(p, subject) {
    if (!canEdit() || !p) return false;
    return !(paperIdentityRequired(p) && !paperIdentityReady(p));
}

function provenanceLine(p, subject) {
    if (subject.kind === 'own') {
        const r = subject.record;
        let text = acceptanceMode ? 'Vorgeschlagenes Testurteil' : 'Deine Bewertung' + (r.ts ? ', gespeichert ' + dateLabel(r.ts) : '');
        if (derivedFromExpert(r)) text += ' · aus der Expert:innen-Entscheidung';
        return text;
    }
    if (subject.kind === 'expert') {
        return 'Vorbelegt: Expert:innen-Entscheidung';
    }
    return 'Noch keine Bewertung';
}

function decisionBadgeHtml(record, colored) {
    const derived = deriveDecision(record.categories || {});
    return '<span class="pt-decision ' + (colored ? 'pt-decision-' + decCls(record.decision) : 'pt-decision-neutral') +
        '" id="pt-decision">' + EC.escapeHtml(record.decision) + '</span>' +
        (record.override ? '<span class="pt-derived">abgeleitet: ' + EC.escapeHtml(derived) + '</span>' : '');
}

// One row per pin; categories without a pin are summarised in one line each for the
// expert judgement taken over without a passage and for a missing Paper Beleg.
function evidenceRowsHtml(record, editable) {
    const evidence = record.evidence || {};
    const basis = record.evidence_basis || {};
    const rows = [];
    const expertOnly = [], missing = [];
    const dotOf = function(c) {
        return '<span class="chip-dot" aria-hidden="true" style="--chip-color:' + EC.escapeHtml(CAT_COLOR[c] || '') + '"></span>';
    };
    ALL_CATS.forEach(function(c) {
        const pins = evidence[c] || [];
        const level = catLevel((record.categories || {})[c]);
        if (!pins.length && !level) return;
        const dot = dotOf(c);
        const label = '<span class="pt-evid-cat">' + EC.escapeHtml(CAT_LABELS[c]) + '</span>';
        if (!pins.length) {
            (basis[c] === 'expert_assessment' ? expertOnly : missing).push(c);
            return;
        }
        pins.forEach(function(ev, i) {
            const llm = evidenceLayer(ev) === 'llm_distillate';
            // only deviations are marked: an LLM layer pin and a pin set by an agent
            const mark = llm ? '<span class="pt-evid-origin">LLM</span>' : (ev && ev.actor === 'agent' ? '<span class="pt-evid-origin">Agent</span>' : '');
            rows.push('<li class="pt-evid-row">' + dot + label + mark +
                '<span class="pt-evid-snip" title="' + EC.escapeHtml(ev.snippet || ev.term || '') + '">' + EC.escapeHtml(ev.snippet || ev.term || '') + '</span>' +
                (editable ? '<button type="button" class="pt-evid-x" data-cat="' + EC.escapeHtml(c) + '" data-i="' + i +
                    '" aria-label="Beleg zu ' + EC.escapeHtml(CAT_LABELS[c]) + ' entfernen">&times;</button>' : '') + '</li>');
        });
    });
    const summary = function(cats, cls, text) {
        if (!cats.length) return;
        rows.push('<li class="pt-evid-row pt-evid-summary ' + cls + '"><span class="pt-evid-snip">' + text + ' ' +
            cats.map(function(c) { return '<span class="pt-evid-named">' + dotOf(c) + EC.escapeHtml(CAT_LABELS[c]) + '</span>'; }).join(' ') +
            '</span></li>');
    };
    summary(expertOnly, 'is-basis', 'Expert:innen-Urteil, ohne Textbeleg:');
    summary(missing, 'is-missing', 'Paper-Beleg fehlt:');
    if (!rows.length) return '';
    return '<section class="pt-evid" aria-labelledby="pt-evid-title"><h3 class="pt-sub-head" id="pt-evid-title">Belege</h3><ul class="pt-evid-list">' + rows.join('') + '</ul></section>';
}

// Test seam kept under its former name.
function evidenceListHtml(evidence, locked) {
    return evidenceRowsHtml({ categories: {}, evidence: evidence }, !locked);
}

// The one reference for human reviewers (ADR-042, ADR-044): the consolidated expert
// decision where it is not the subject, which is a human judgement. Neither the LLM
// assessment nor the agent record is shown before or beside the human decision.
function referenceProposalsHtml(p, subject) {
    if (!referencesAllowed()) return '';
    subject = subject || paperSubject(p);
    const expert = subject.kind !== 'expert' ? expertAssessment(p) : null;
    if (!expert) return '';
    const dots = function(cats) {
        const set = ALL_CATS.filter(function(c) { return catLevel(cats[c]) > 0; });
        return set.length ? '<span class="pt-ref-cats" aria-hidden="true">' + set.map(function(c) {
            return '<span class="chip-dot" style="--chip-color:' + EC.escapeHtml(CAT_COLOR[c] || '') + '"></span>';
        }).join('') + '</span><span class="pt-sr-only">: ' + EC.escapeHtml(set.map(function(c) { return CAT_LABELS[c]; }).join(', ')) + '</span>' : '';
    };
    let h = '<section class="pt-references" id="pt-references" aria-label="Referenzen">';
    h += '<p class="pt-ref pt-ref-expert"><span class="pt-ref-label">Expert:innen-Entscheidung</span> <strong class="pt-dec-' +
        decCls(expert.decision) + '">' + EC.escapeHtml(expert.decision) + '</strong>' + dots(expert.categories) + '</p>';
    return h + '</section>';
}

function dimHtml(label, keys, cats, editable, basis) {
    const headId = 'pt-dim-' + label.toLowerCase();
    return '<div class="pt-dim"><h3 class="pt-sub-head" id="' + headId + '">' + label + '</h3><div class="category-chips" role="group" aria-labelledby="' + headId + '">' +
        keys.map(function(c) { return categoryChipHtml(c, cats[c], { disabled: !editable, expertBasis: !!(basis && basis[c]) }); }).join('') +
        '</div></div>';
}

function reasonChipsHtml(record, editable) {
    const offerExpert = work && (work.derivedFromExpert || work.seed === 'expert');
    const reasons = EXCLUSION_REASONS.filter(function(r) {
        return r !== EXPERT_EXCLUSION_REASON || offerExpert || record.reason === r;
    });
    return '<div class="pt-reason-block" id="pt-reason-block"><h3 class="pt-sub-head" id="pt-reason-title">Ausschlussgrund</h3>' +
        '<div class="pt-reason-chips" role="group" aria-labelledby="pt-reason-title">' + reasons.filter(function(r) {
            return editable || record.reason === r;
        }).map(function(r) {
            const on = record.reason === r;
            return '<button type="button" class="pt-reason-chip' + (on ? ' sel' : '') + '" data-reason="' + EC.escapeHtml(r) + '" aria-pressed="' + on + '"' +
                (editable ? '' : ' disabled') + '>' + EC.escapeHtml(reasonLabel(r)) + '</button>';
        }).join('') + '</div></div>';
}

function overrideHtml(record, editable) {
    if (!editable && !record.override) return '';
    const derived = deriveDecision(record.categories || {});
    let h = '<div class="pt-override-row"><label class="pt-override"><span class="pt-switch"><input type="checkbox" id="pt-override"' +
        (record.override ? ' checked' : '') + (editable ? '' : ' disabled') + '><span class="pt-switch-track"></span></span> ' +
        (derived === 'Include' ? 'Abweichend ausschließen' : 'Abweichend einschließen') + '</label></div>';
    if (record.override && record.decision === 'Include') {
        h += '<label class="pt-override-block" for="pt-override-reason"><span class="pt-sub-head">Begründung</span>' +
            '<textarea id="pt-override-reason" class="pt-override-input" rows="2" placeholder="Warum abweichend?"' + (editable ? '' : ' readonly') + '>' +
            EC.escapeHtml((editable ? work.overrideReason : record.override_reason) || '') + '</textarea></label>';
    }
    return h;
}

function analysisEntryHtml(record, editable) {
    if (!analysisStepOffered() || record.decision !== 'Include' || !anFields.length) return '';
    const req = analysisRequirements(record);
    return '<div class="pt-analysis-entry"><span class="pt-sub-head">Analysekodierung</span>' +
        '<span class="pt-analysis-state ' + (req.ok ? 'is-complete' : 'is-open') + '">' + (req.ok ? 'vollständig' : 'unvollständig') + '</span>' +
        '<button type="button" class="pt-btn pt-btn-sm" id="pt-open-analysis">' + (editable ? 'Kodieren' : 'Ansehen') + '</button></div>';
}

function railHtml(p) {
    const subject = paperSubject(p);
    if (canEdit() && paperIdentityRequired(p) && !paperIdentityReady(p))
        return '<div class="pt-rail-head"><h2 class="pt-rail-title">Bewertung</h2></div>' +
            '<p class="pt-muted pt-read-only-note">Dieses Paper ist noch nicht an ein Werk und eine genaue Fassung gebunden. Bewerten ist erst nach der bibliografischen Zuordnung möglich.</p>';
    if (railStep === 'analysis' && analysisStepOffered()) return analysisStepHtml(p, subject);
    const editable = railEditable(p, subject);
    const record = editable ? workingDecisionRecord() : (subject.record || null);
    let h = '<div class="pt-rail-head"><h2 class="pt-rail-title">Bewertung</h2>';
    // an untouched empty draft has no decision yet, only the provenance line says so
    if (record && !(subject.kind === 'empty' && !work.dirty)) h += decisionBadgeHtml(record, subject.kind === 'own' || (editable && work.dirty));
    h += '</div><p class="pt-provenance" id="pt-provenance">' + EC.escapeHtml(provenanceLine(p, subject)) +
        (editable && work.dirty && subject.kind !== 'empty' ? ' · geändert' : '') + '</p>';
    h += '<div class="pt-rail-body">';
    const cats = record ? (record.categories || {}) : {};
    const basis = record ? (record.evidence_basis || {}) : {};
    h += dimHtml('Gegenstand', TECH_CATS, cats, editable, basis);
    h += dimHtml('Perspektive', SOCIAL_CATS, cats, editable, basis);
    if (record) {
        h += overrideHtml(record, editable);
        if (record.decision === 'Exclude') h += reasonChipsHtml(record, editable);
        h += evidenceRowsHtml(record, editable);
        h += analysisEntryHtml(record, editable);
    }
    h += referenceProposalsHtml(p, subject);
    if (subject.kind === 'own' && isGovernedRecord(subject.record)) h += provenanceHtml(subject.record);
    h += '</div>';
    h += dockHtml(p, subject, editable);
    return h;
}

function dockHtml(p, subject, editable) {
    let h = '<div class="pt-action-dock">';
    if (editable) {
        const gate = saveGate(p);
        h += '<p class="pt-actions-hint" id="pt-actions-hint">' + EC.escapeHtml(gate.reasons.join(' · ')) + '</p>';
    }
    h += '<div class="pt-actions">';
    if (editable && work.dirty) h += '<button type="button" class="pt-link-btn" id="pt-discard">Änderungen verwerfen</button>';
    h += '<span class="pt-spacer"></span>';
    h += '<button type="button" class="pt-next-btn" id="pt-next">' + (acceptanceMode ? 'Anderer Abnahmefall' : 'Nächstes offen') + ' &rarr;</button></div>';
    return h + '</div>';
}

// ---- analysis coding step (FR-14, ADR-026) ----
// The Include analysis coding is its own step of the rail, so the assessment itself
// fits one screen. Every value is a closed selection from the frozen vocabulary; labels
// come from docs/data/analysis_fields.json and stored values stay the controlled codes.

function anValueLabel(f, value) {
    if (f.name === 'Studientyp') return anStudyTypeLabels[value] || value;
    return (f.value_labels && f.value_labels[value]) || value;
}

function analysisStepHtml(p, subject) {
    const editable = railEditable(p, subject);
    const record = editable ? workingDecisionRecord() : subject.record;
    let h = '<div class="pt-rail-head"><h2 class="pt-rail-title">Analysekodierung</h2>' +
        '<button type="button" class="pt-link-btn" id="pt-close-analysis">Zurück zur Bewertung</button></div>';
    h += '<div class="pt-rail-body pt-rail-scrollable">' + analysisPanelHtml(record, !editable) + '</div>';
    h += dockHtml(p, subject, editable);
    return h;
}

function analysisPanelHtml(dec, readOnly) {
    if (!dec || dec.decision !== 'Include') return '';
    if (!anFields.length) return '<p class="pt-muted">Analysefeld-Vokabular nicht geladen.</p>';
    const rawAnalysis = readAnalysis(dec);
    const a = sanitizeAnalysis(rawAnalysis, dec.text_source), fv = a.fields, uv = a.undecidable;
    const req = analysisRequirements(dec);
    let h = '<div class="pt-anpanel">';
    h += anFieldHtml({ name: 'Studientyp', label: 'Studientyp', multi: false, values: anStudyTypes, no_undec: true }, fv.Studientyp, false, !!readOnly);
    anFields.forEach(function(f) {
        if (f.name === 'AN_Coding_Basis') {
            h += '<div class="pt-an-field" data-an-field="AN_Coding_Basis"><span class="pt-an-label">' + EC.escapeHtml(f.label || f.name) +
                '</span> <span class="pt-an-fixed">' + EC.escapeHtml(anValueLabel(f, fv.AN_Coding_Basis) || 'keine lesbare Textquelle') + '</span></div>';
            return;
        }
        const effective = f.name === 'AN_Harm_Types' && fv.AN_Coding_Basis === 'Fulltext'
            ? Object.assign({}, f, { optional: false, hint: harmTypesHint(a) }) : f;
        h += anFieldHtml(effective, fv[f.name], !!uv[f.name], !!readOnly);
    });
    const expectedBasis = expectedCodingBasis(dec.text_source);
    if (!readOnly && expectedBasis && rawAnalysis.fields.AN_Coding_Basis !== expectedBasis)
        h += '<button type="button" class="pt-btn pt-btn-sm pt-an-fix-basis">Kodierbasis aus Textquelle übernehmen</button>';
    if (!req.ok) h += '<p class="pt-an-status">Offen: ' + EC.escapeHtml(req.missing.map(function(name) {
        const f = anField(name);
        return f ? (f.label || name) : name;
    }).join(', ')) + '</p>';
    return h + '</div>';
}

function anFieldHtml(f, value, undecidable, readOnly) {
    let h = '<div class="pt-an-field" data-an-field="' + EC.escapeHtml(f.name) + '">';
    h += '<div class="pt-an-field-head"><span class="pt-an-label" id="pt-an-label-' + EC.escapeHtml(f.name) + '">' + EC.escapeHtml(f.label || f.name) + '</span>';
    if (f.optional) h += '<span class="pt-an-optional">optional</span>';
    if (f.hint) h += '<span class="pt-an-hint">' + EC.escapeHtml(f.hint) + '</span>';
    h += '</div>';
    if (f.free_text) {
        h += '<textarea class="pt-an-notes" data-an-free="' + EC.escapeHtml(f.name) + '" rows="2" aria-labelledby="pt-an-label-' + EC.escapeHtml(f.name) + '" ' +
            (readOnly ? 'readonly ' : '') + 'placeholder="Notizen">' + EC.escapeHtml(value || '') + '</textarea></div>';
        return h;
    }
    const sel = f.multi ? (Array.isArray(value) ? value : []) : (value ? [value] : []);
    h += '<div class="pt-an-opts" role="group" aria-labelledby="pt-an-label-' + EC.escapeHtml(f.name) + '">';
    (f.values || []).forEach(function(v) {
        const on = sel.indexOf(v) !== -1;
        const definition = f.value_definitions && f.value_definitions[v];
        h += '<button type="button" class="pt-an-opt' + (on ? ' sel' : '') + '"' +
            ' data-an-field="' + EC.escapeHtml(f.name) + '" data-an-value="' + EC.escapeHtml(v) + '"' +
            ' data-an-multi="' + (f.multi ? '1' : '0') + '"' + (definition ? ' title="' + EC.escapeHtml(definition) + '"' : '') +
            ' aria-pressed="' + (on ? 'true' : 'false') + '"' + (readOnly ? ' disabled' : '') + '>' + EC.escapeHtml(anValueLabel(f, v)) + '</button>';
    });
    if (!f.no_undec)
        h += '<button type="button" class="pt-an-opt pt-an-undec' + (undecidable ? ' sel' : '') + '" data-an-undec="' + EC.escapeHtml(f.name) +
            '" aria-pressed="' + (undecidable ? 'true' : 'false') + '"' + (readOnly ? ' disabled' : '') + '>nicht entscheidbar</button>';
    h += '</div></div>';
    return h;
}

// Focus survives the re-render of the rail: the element is found again by a stable key.
function focusKey(el) {
    if (!el || !el.closest || !el.closest('#pt-assess-col')) return null;
    if (el.id) return '#' + el.id;
    if (el.dataset.anUndec) return '[data-an-undec="' + el.dataset.anUndec + '"]';
    if (el.dataset.anField && el.dataset.anValue) return '[data-an-field="' + el.dataset.anField + '"][data-an-value="' + el.dataset.anValue + '"]';
    if (el.dataset.reason) return '[data-reason="' + el.dataset.reason + '"]';
    if (el.dataset.cat && el.classList.contains('category-chip')) return '.category-chip[data-cat="' + el.dataset.cat + '"]';
    return null;
}

function refreshAssess() {
    const col = document.getElementById('pt-assess-col');
    if (!col) return;
    const key = focusKey(document.activeElement);
    const p = papers[state.index];
    col.innerHTML = railHtml(p);
    bindAssess(p);
    refreshSaveGate();
    if (key) {
        const again = col.querySelector(key);
        if (again && typeof again.focus === 'function') again.focus();
    }
}

// The position bar carries the save action; it is refreshed without re-rendering the list.
function refreshSaveGate() {
    const bar = document.querySelector('.pt-nav-tools .pt-ws-bar');
    if (!bar) return;
    const hadFocus = document.activeElement && document.activeElement.id === 'pt-record';
    bar.outerHTML = positionBarHtml();
    const record = document.getElementById('pt-record');
    if (record) {
        record.addEventListener('click', saveCurrent);
        if (hadFocus) record.focus();
    }
}

function attachAnalysisStep(col) {
    if (!canEdit()) return;
    const panel = col.querySelector('.pt-anpanel');
    if (!panel) return;
    function cur() {
        const a = readAnalysis({ analysis: work.analysis });
        return { fields: JSON.parse(JSON.stringify(a.fields)), undecidable: JSON.parse(JSON.stringify(a.undecidable)) };
    }
    function persist(next) { work.analysis = sanitizeAnalysis(next, workingTextSource()); markDirty(); }
    panel.querySelectorAll('.pt-an-opt[data-an-value]').forEach(function(btn) {
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
            persist(st); refreshAssess();
        });
    });
    panel.querySelectorAll('[data-an-undec]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const name = btn.dataset.anUndec;
            const st = cur();
            if (st.undecidable[name]) delete st.undecidable[name];
            else { st.undecidable[name] = true; delete st.fields[name]; }
            persist(st); refreshAssess();
        });
    });
    const fixBasis = panel.querySelector('.pt-an-fix-basis');
    if (fixBasis) fixBasis.addEventListener('click', function() { persist(cur()); refreshAssess(); });
    const notes = panel.querySelector('[data-an-free]');
    if (notes) notes.addEventListener('input', function() {
        const st = cur();
        st.fields[notes.dataset.anFree] = notes.value;
        persist(st); // no re-render: keep the caret in the textarea
        refreshSaveGate();
    });
}

// ---- handlers ----
function attachScreening(p) {
    let el = surfaceEl(); if (!el) return;

    bindCorpusItems();
    bindFilters();
    const recordButton = document.getElementById('pt-record');
    if (recordButton) recordButton.addEventListener('click', saveCurrent);

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
            if (corpusQuery.trim() && corpusIndex) announce(visibleRows().length + ' Ergebnisse');
        }, 150);
        cq.addEventListener('input', function() { corpusQuery = cq.value; runCorpus(); });
    }

    // in-text search: Enter steps forward, Shift+Enter back
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
            } else if (docMarks.length) setActiveMark(docMarkIdx + (e.shiftKey ? -1 : 1));
        });
    }
    const prev = document.getElementById('pt-intext-prev');
    if (prev) prev.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx - 1); });
    const next = document.getElementById('pt-intext-next');
    if (next) next.addEventListener('click', function() { if (docMarks.length) setActiveMark(docMarkIdx + 1); });
    const pinHit = document.getElementById('pt-pin-hit');
    if (pinHit) pinHit.addEventListener('click', function() {
        if (!docMarks.length || !railEditable(p, paperSubject(p))) return;
        const m = docMarks[docMarkIdx];
        openPinMenu(m.textContent, snippetAround(m, m.textContent), m);
    });

    // text-selection pinning in the reading column
    const doc = document.getElementById('pt-doc');
    if (canEdit() && doc) {
        doc.addEventListener('mouseup', function() {
            if (!railEditable(p, paperSubject(p))) return;
            const sel = window.getSelection ? window.getSelection() : null;
            if (!sel || sel.isCollapsed) return;
            const text = (sel.toString() || '').trim();
            if (text.length < 2 || text.length > 400) return;
            const range = sel.rangeCount ? sel.getRangeAt(0) : null;
            openPinMenu(text.slice(0, 80), text, range);
        });
    }

    bindAssess(p);
}

function bindAssess(p) {
    const col = document.getElementById('pt-assess-col'); if (!col) return;
    const subject = paperSubject(p);
    const editable = railEditable(p, subject);
    const nx = col.querySelector('#pt-next');
    if (nx) nx.addEventListener('click', gotoNextOpen);
    const openAnalysis = col.querySelector('#pt-open-analysis');
    if (openAnalysis) openAnalysis.addEventListener('click', function() {
        railStep = 'analysis'; refreshAssess();
        const back = document.getElementById('pt-close-analysis'); if (back) back.focus();
    });
    const closeAnalysis = col.querySelector('#pt-close-analysis');
    if (closeAnalysis) closeAnalysis.addEventListener('click', function() {
        railStep = 'assess'; refreshAssess();
        const entry = document.getElementById('pt-open-analysis'); if (entry) entry.focus();
    });
    if (!editable) return;
    attachAnalysisStep(col);
    const discard = col.querySelector('#pt-discard');
    if (discard) discard.addEventListener('click', function() { discardDraft(p); announce('Änderungen verworfen.'); });

    col.querySelectorAll('.pt-dim .category-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const c = btn.dataset.cat;
            const before = deriveDecision(work.cats);
            // on and off; a teilweise set by a pin is raised to ja
            const next = catLevel(work.cats[c]) === 2 ? 0 : 2;
            if (next) work.cats[c] = next; else delete work.cats[c];
            // an override opposes the current derivation; if a step flips the derived
            // decision, the override and its justification no longer apply
            if (deriveDecision(work.cats) !== before) { work.override = false; work.overrideReason = null; }
            markDirty();
            refreshAssess();
        });
    });
    col.querySelectorAll('.pt-evid-x').forEach(function(btn) {
        btn.addEventListener('click', function() { unpinEvidence(btn.dataset.cat, parseInt(btn.dataset.i, 10)); });
    });
    col.querySelectorAll('.pt-reason-chip').forEach(function(btn) {
        btn.addEventListener('click', function() { work.reason = btn.dataset.reason; markDirty(); refreshAssess(); });
    });
    const ov = col.querySelector('#pt-override');
    if (ov) ov.addEventListener('change', function() {
        work.override = ov.checked;
        if (!ov.checked) work.overrideReason = null;
        markDirty();
        refreshAssess();
    });
    const ovr = col.querySelector('#pt-override-reason');
    if (ovr) ovr.addEventListener('input', function() { work.overrideReason = ovr.value; markDirty(); syncDockHint(p); });
}

// Typing keeps the caret: only the hint and the save gate are refreshed.
function syncDockHint(p) {
    const hint = document.getElementById('pt-actions-hint');
    if (hint) hint.textContent = saveGate(p).reasons.join(' · ');
    refreshSaveGate();
}

// The one save action: a draft over no record, an expert prefill or an own record
// writes the reviewer's decision record.
function saveCurrent() {
    const p = papers[state.index];
    if (!p || !canEdit()) return Promise.resolve(false);
    const gate = saveGate(p);
    if (!gate.ok) { syncDockHint(p); announce(gate.storage || gate.reasons[0] || gate.label); return Promise.resolve(false); }
    if (gate.mode === 'file') return save().then(function(ok) { refreshSaveGate(); return ok; });
    return Promise.resolve(commit());
}

function expertDerivation(p) {
    const item = {
        id: 'expert:' + p.id,
        type: 'consolidated_expert_assessment',
        reference: 'docs/data/research_vault_v2.json#' + p.id + '.human',
        mapping: '1=ja'
    };
    const fingerprint = EC && EC.getCorpusFingerprint ? EC.getCorpusFingerprint() : null;
    const hex = String(fingerprint || '').replace(/^sha256:/, '');
    if (/^[0-9a-f]{64}$/i.test(hex)) item.sha256 = hex;
    return item;
}

const WORK_ID_PATTERN = /^work:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const VERSION_ID_PATTERN = /^version:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// A human record written by PRISM carries the embedded contract of schema 0.5: who
// screened, on which paper, derived from what, and a curated baseline without events.
// A record seeded from the expert decision is a legacy import, never a verification.
function attachHumanContract(record, p, seededFromExpert) {
    const key = record.reviewer;
    const annotationId = key + ':' + p.id;
    const source = { id: 'paper:' + p.id, type: 'paper', reference: p.id };
    if (WORK_ID_PATTERN.test(record.work_id || '')) source.work_id = record.work_id;
    if (VERSION_ID_PATTERN.test(record.version_id || '')) source.version_id = record.version_id;
    if (record.version_type) source.version_type = record.version_type;
    record.provenance = {
        annotation_id: annotationId,
        annotation_type: 'screening_decision',
        actors: [{ id: key, type: 'person', roles: ['screening'] }],
        activities: [{
            id: p.id + ':prism-screening', type: 'screening', run_id: sessionActivityId(),
            method: seededFromExpert ? 'prism_confirmation_of_consolidated_expert_assessment' : 'prism_human_screening',
            prompt: { status: 'not_applicable', value: 'not_applicable' },
            model: { status: 'not_applicable', value: 'not_applicable' },
            associated_actor_ids: [key]
        }],
        used_sources: [source],
        derived_from: seededFromExpert ? [expertDerivation(p)] : []
    };
    record.annotations = [{
        annotation_id: annotationId, annotation_type: 'screening_decision', at: record.ts,
        actor_ids: [key], body: annotationBody(record)
    }];
    record.active_annotation_id = annotationId;
    record.checks = [];
    record.lifecycle = {
        baseline: { state: 'curated', basis: seededFromExpert ? 'legacy_import' : 'recorded', at: record.ts, actor_ids: [key] },
        state: 'curated',
        events: []
    };
    return record;
}

function commit() {
    if (!canEdit()) return false;
    const p = papers[state.index];
    if (!p) return false;
    if (paperIdentityRequired(p) && !paperIdentityReady(p)) {
        setSaveStatus('error', 'Bewertung nicht gespeichert: Werk- oder Fassungsbindung fehlt.');
        renderData(document.getElementById('pt-data-inline'));
        return false;
    }
    if (!state.reviewer) {
        setSaveStatus('needs-reviewer', 'Kürzel festlegen, bevor gespeichert wird.');
        focusDataInline(); return false;
    }
    if (!screeningHandle && !trialMode) {
        setSaveStatus('local', 'Arbeitsordner verbinden, bevor gespeichert wird.');
        focusDataInline(); return false;
    }
    if (!trialMode && reviewerFileErrors[state.reviewer]) {
        setSaveStatus('error', 'Bestehende Datei ' + reviewerPath(state.reviewer) + ' wird nicht überschrieben.');
        renderData(document.getElementById('pt-data-inline'));
        return false;
    }
    // the record names the text it was taken on; a commit before the reading has been
    // applied would write text_source none for a paper that has a full text
    if (readingPending) { refreshAssess(); return false; }
    const draft = workingDecisionRecord();
    // The persisted record holds only paper-layer evidence. Knowledge-distillate
    // evidence stays advisory and session-only.
    const nextRecord = {
        categories: work.cats, decision: draft.decision, override: !!work.override,
        reason: draft.reason,
        override_reason: draft.override_reason,
        evidence: paperEvidenceOnly(work.evidence), ts: new Date().toISOString(), reviewer: state.reviewer, actor: runActor,
        text_source: currentTextSource // the paper-layer text the decision was taken on (ADR-027, trAIce M4)
    };
    if (draft.evidence_basis) nextRecord.evidence_basis = draft.evidence_basis;
    bindRecordIdentity(nextRecord, p);
    // An agent Include carries its analysis codes (FR-14, ADR-045); a human Include keeps
    // an analysis part it already had unchanged. A decision that leaves Include drops
    // them (coding rule 1, excluded papers carry no AN codes).
    if (draft.decision === 'Include' && runActor === 'agent') nextRecord.analysis = sanitizeAnalysis(work.analysis || {}, currentTextSource);
    else if (draft.decision === 'Include' && work.analysis !== undefined) nextRecord.analysis = JSON.parse(JSON.stringify(work.analysis));
    if (!recordRequirements(nextRecord).ok) { refreshAssess(); return false; }
    if (runActor === 'human' && !trialMode && !acceptanceMode)
        attachHumanContract(nextRecord, p, !!work.derivedFromExpert);
    curDec()[p.id] = nextRecord;
    delete drafts[p.id];
    save();
    corpusQuery = '';
    gotoNextOpen();
    return true;
}

// "Nächstes offen" follows the visible list: the next paper after the current one
// that is not yet captured, wrapping around once. With nothing open it stays.
function gotoNextOpen() {
    focusReadingOnRender = true;
    const rows = visibleRows();
    if (acceptanceMode) {
        const cases = rows.map(function(row) { return row.index; });
        const current = cases.indexOf(state.index);
        if (cases.length) state.index = cases[(current + 1 + cases.length) % cases.length];
        renderScreening();
        return;
    }
    let at = rows.findIndex(function(row) { return row.index === state.index; });
    // a paper that just left the list (saved under Offen) keeps its place: the search
    // continues after it in corpus order instead of restarting at the top
    if (at === -1 && !corpusQuery.trim()) {
        const after = rows.findIndex(function(row) { return row.index > state.index; });
        at = (after === -1 ? rows.length : after) - 1;
    }
    for (let k = 1; k <= rows.length; k++) {
        const row = rows[(at + k + rows.length) % rows.length];
        if (row && row.index !== state.index && !isDone(row.paper)) {
            state.index = row.index;
            renderScreening();
            return;
        }
    }
    renderScreening();
    announce('Keine offenen Dokumente in dieser Auswahl.');
}

// ---- pin menu (category picker for a selected passage / search hit) ----
// The pin menu is a dialog near the passage: it takes focus on open, traps Tab inside,
// closes on Escape and on a click outside, and restores focus to the trigger on close.
function placePinMenu(menu, anchor) {
    const rect = anchor && typeof anchor.getBoundingClientRect === 'function' ? anchor.getBoundingClientRect() : null;
    menu.style.left = ''; menu.style.top = ''; menu.style.transform = '';
    if (!rect || (!rect.width && !rect.height)) return;
    const width = menu.offsetWidth, height = menu.offsetHeight;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    // below the passage when it fits, above it otherwise, never covering it
    const below = rect.bottom + 8;
    const top = below + height <= window.innerHeight - 8 ? below : Math.max(8, rect.top - height - 8);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.transform = 'none';
}

function openPinMenu(term, snippet, anchor) {
    if (!canEdit()) return;
    pinTerm = term; pinSnippet = snippet;
    pinOrigin = state.readMode === 'ai' ? 'ai' : 'human'; // bind the Beleg to the layer the snippet was taken from
    let menu = document.getElementById('pt-pinmenu'); if (!menu) return;
    pinReturnFocus = document.activeElement;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Beleg an eine Kategorie anheften');
    menu.setAttribute('tabindex', '-1');
    let h = '<div class="pt-pinmenu-head"><span class="pt-sub-head">Anheften an</span>' +
        '<button type="button" class="pt-pinmenu-x" id="pt-pinmenu-x" aria-label="Schließen">&times;</button></div>';
    if (pinOrigin === 'ai') h += '<p class="pt-pinmenu-ai">Aus dem LLM-Wissensdestillat. Zählt nicht als Paper-Beleg.</p>';
    h += '<div class="pt-pinmenu-snip">' + EC.escapeHtml((snippet || term).slice(0, 160)) + '</div>';
    h += '<div class="category-chips pt-pinmenu-cats">';
    ALL_CATS.forEach(function(c) { h += categoryChipHtml(c, 0, { compact: true, filter: true }); });
    h += '</div>';
    menu.innerHTML = h;
    menu.hidden = false;
    placePinMenu(menu, anchor);
    menu.querySelector('#pt-pinmenu-x').addEventListener('click', closePinMenu);
    menu.querySelectorAll('.category-chip').forEach(function(btn) {
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
    pinOutsideHandler = function(e) { if (!menu.contains(e.target)) closePinMenu(); };
    // registered after the opening event has finished, so the selecting mouseup does not close it
    setTimeout(function() { if (pinOutsideHandler) document.addEventListener('pointerdown', pinOutsideHandler); }, 0);
    const firstCat = menu.querySelector('.category-chip');
    if (firstCat && typeof firstCat.focus === 'function') firstCat.focus();
    else if (typeof menu.focus === 'function') menu.focus();
}

function closePinMenu() {
    let menu = document.getElementById('pt-pinmenu');
    if (pinOutsideHandler) { document.removeEventListener('pointerdown', pinOutsideHandler); pinOutsideHandler = null; }
    if (menu) {
        if (pinKeyHandler) { menu.removeEventListener('keydown', pinKeyHandler); pinKeyHandler = null; }
        menu.hidden = true; menu.innerHTML = '';
        ['role', 'aria-modal', 'aria-label', 'tabindex'].forEach(function(a) { menu.removeAttribute(a); });
    }
    if (pinReturnFocus && typeof pinReturnFocus.focus === 'function' && document.contains(pinReturnFocus)) pinReturnFocus.focus();
    pinReturnFocus = null;
}

// Disclosure text for the report utilities (operator function, no editor surface).
function disc(f) { return (state.disclosure[f] != null) ? state.disclosure[f] : (MODEL_DEFAULT[f] || ''); }

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

function reviewerKeyFormHtml(value) {
    const rule = '2 bis 12 Zeichen, Buchstaben, Ziffern, _ oder -, Beginn mit Buchstabe.';
    return '<form class="pt-reviewer-setup" id="pt-reviewer-setup" novalidate>' +
        '<label for="pt-reviewer-key"><span class="pt-sr-only">Kürzel</span>' +
        '<input id="pt-reviewer-key" name="reviewer" type="text" required minlength="2" maxlength="12" ' +
        'pattern="[A-Za-z][A-Za-z0-9_-]{1,11}" autocomplete="off" spellcheck="false" title="' + rule + '" ' +
        'aria-describedby="pt-reviewer-help pt-reviewer-error" placeholder="Kürzel" value="' + EC.escapeHtml(value || '') + '"></label>' +
        '<button class="pt-btn pt-reviewer-set" type="submit">Festlegen</button>' +
        '<span class="pt-sr-only" id="pt-reviewer-help">' + rule + '</span>' +
        '<span class="pt-reviewer-error" id="pt-reviewer-error" role="status"></span></form>';
}

// ready states need no standing line; dirty, error, saving and saved states do
function saveStatusShown(kind) { return ['dirty', 'error', 'saving', 'saved'].indexOf(kind) !== -1; }

function statusLineHtml() {
    const show = saveStatusShown(saveStatus.kind);
    return '<p class="pt-save-status pt-save-' + saveStatus.kind + '" id="pt-save-status"' + (show ? '' : ' hidden') + '>' +
        EC.escapeHtml(saveStatus.message) + '</p>';
}

let changingKey = false;

// What each side of a conflict holds, so the choice is not taken blind.
function conflictSideLabel(record) {
    if (!record || !record.decision) return '';
    const parts = [record.decision];
    if (record.decision === 'Exclude' && record.reason) parts.push(reasonLabel(record.reason));
    return ': ' + EC.escapeHtml(parts.join(', '));
}

function renderData(targetEl) {
    const el = targetEl || document.getElementById('pt-data-inline'); if (!el) return;
    if (acceptanceMode) {
        el.hidden = false;
        el.innerHTML = '<div class="pt-acceptance-status"><strong>Abnahmeansicht</strong>' +
            '<span>Vorgeschlagene Testurteile. Diese Ansicht schreibt keine Forschungsdaten.</span></div>';
        return;
    }
    if (!canEdit()) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    if (!state.reviewer || changingKey) {
        el.innerHTML = reviewerKeyFormHtml(changingKey ? state.reviewer : '') + statusLineHtml();
        const form = el.querySelector('#pt-reviewer-setup');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = el.querySelector('#pt-reviewer-key');
            const wanted = normalizedReviewerKey(input.value);
            if (!wanted || reservedKey(wanted) || !selectReviewer(wanted)) {
                input.setAttribute('aria-invalid', 'true');
                el.querySelector('#pt-reviewer-error').textContent = wanted && reservedKey(wanted)
                    ? 'Dieses Kürzel ist vergeben.' : 'Ungültiges Kürzel.';
                input.focus();
                return;
            }
            changingKey = false;
            renderData(el);
            renderScreening();
        });
        return;
    }

    const identity = '<span class="pt-sync-identity"><strong>' + EC.escapeHtml(state.reviewer) + '</strong>' +
        '<code>' + EC.escapeHtml(reviewerPath(state.reviewer)) + '</code></span>' +
        (trialMode ? '' : '<button type="button" class="pt-link-btn pt-change-key">Kürzel ändern</button>');
    let h;
    if (trialMode) {
        h = '<div class="pt-sync-ready pt-trial-ready">' + identity +
            '<span class="pt-folder-status">Agentischer Testlauf · isolierter Browser-Zwischenstand</span>' + statusLineHtml() +
            '<button class="pt-btn pt-trial-export" type="button">Testdaten exportieren</button>' +
            '<span class="pt-trial-note">Keine Forschungsdaten werden geschrieben.</span></div>';
    } else if (screeningHandle) {
        h = '<div class="pt-sync-ready">' + identity +
            '<span class="pt-folder-status">' + EC.escapeHtml(folderNameLabel()) +
            '<button class="pt-change-folder pt-link-btn" type="button">Ordner ändern</button></span>' + statusLineHtml() + '</div>';
    } else {
        const actionLabel = storedHandleAvailable ? 'Arbeitsordner freigeben' : 'Arbeitsordner wählen';
        h = '<div class="pt-folder-setup">' + identity +
            (fsSupported() ? '<button class="pt-btn pt-folder-action" type="button">' + actionLabel + '</button>' :
                '<span class="pt-sync-browser-note">Speichern braucht einen Chromium-basierten Browser.</span>') +
            statusLineHtml() + '</div>';
    }
    const conflict = reviewerConflicts[state.reviewer];
    if (conflict && !trialMode)
        h += '<div class="pt-conflict" role="group" aria-label="Widerspruch auflösen">' +
            '<button type="button" class="pt-btn pt-btn-sm" data-keep="disk">Dateistand übernehmen' + conflictSideLabel(conflict.disk) + '</button>' +
            '<button type="button" class="pt-btn pt-btn-sm" data-keep="local">Browserstand übernehmen' + conflictSideLabel(conflict.local) + '</button></div>';
    if (secondTabNotice && !trialMode) h += '<p class="pt-save-status pt-save-dirty">' + EC.escapeHtml(secondTabNotice) + '</p>';
    el.innerHTML = h;
    const exportBtn = el.querySelector('.pt-trial-export');
    if (exportBtn) exportBtn.addEventListener('click', function() {
        download(state.reviewer + '.json', reviewerFileText(state.reviewer), 'application/json');
        setSaveStatus('saved', 'Testdaten als ' + state.reviewer + '.json exportiert.');
    });
    const change = el.querySelector('.pt-change-folder');
    if (change) change.addEventListener('click', connectRepo);
    const folderAction = el.querySelector('.pt-folder-action');
    if (folderAction) folderAction.addEventListener('click', storedHandleAvailable ? reconnectRepo : connectRepo);
    const changeKey = el.querySelector('.pt-change-key');
    if (changeKey) changeKey.addEventListener('click', function() {
        changingKey = true;
        renderData(el);
        const input = el.querySelector('#pt-reviewer-key');
        if (input) { input.focus(); input.select(); }
    });
    el.querySelectorAll('[data-keep]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            // the choice is the decision; writing it at once leaves no state that only
            // the browser holds
            if (resolveReviewerConflict(state.reviewer, btn.dataset.keep)) {
                renderData(el); renderScreening();
                save().then(function() { renderData(el); refreshSaveGate(); });
            }
        });
    });
}

// The file-level contract: a known reviewer schema and a decisions object. Single
// records are checked by recordProblem.
function validateReviewerEnvelope(obj) {
    if (!obj || typeof obj !== 'object') return { ok: false, message: 'Datei enthält kein JSON-Objekt.' };
    if (!/^femprompt-prisma-reviewer\/0\.[12345]$/.test(obj.schema || ''))
        return { ok: false, message: 'unbekanntes oder fehlendes Reviewer-Schema.' };
    if (!obj.decisions || typeof obj.decisions !== 'object' || Array.isArray(obj.decisions))
        return { ok: false, message: 'Feld "decisions" fehlt oder ist ungültig.' };
    // Additive verification layer (ADR-040): absent in every historical file, and
    // structurally checked where present so a damaged block cannot be silently kept.
    if (Object.prototype.hasOwnProperty.call(obj, 'verifications')) {
        if (!Array.isArray(obj.verifications))
            return { ok: false, message: 'Feld "verifications" ist ungültig.' };
        const badVerification = obj.verifications.find(function(entry) {
            return !entry || typeof entry !== 'object' || !entry.paper_id || !entry.result ||
                !entry.event || typeof entry.event !== 'object' || !entry.event.event_id;
        });
        if (badVerification) return { ok: false, message: 'unvollständiger Verifikationseintrag im Feld "verifications".' };
    }
    return { ok: true };
}

// Strict form for imports and acceptance fixtures: every record must be usable.
function validateReviewerPayload(obj) {
    const envelope = validateReviewerEnvelope(obj);
    if (!envelope.ok) return envelope;
    const ids = Object.keys(obj.decisions);
    const unknown = ids.filter(function(id) { return recordProblem(id, obj.decisions[id], obj.schema) === 'unbekannte Paper-ID'; });
    if (unknown.length) return { ok: false, message: 'unbekannte Paper-IDs: ' + unknown.slice(0, 5).join(', ') + (unknown.length > 5 ? ' …' : '') };
    for (let i = 0; i < ids.length; i++) {
        const problem = recordProblem(ids[i], obj.decisions[ids[i]], obj.schema);
        if (problem) return { ok: false, message: problem + ' bei Paper ' + ids[i] + '.' };
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
    aiProposal: aiProposal, humanDecision: humanDecision, expertAssessment: expertAssessment,
    // aggregation
    computeFlow: computeFlow,
    // parsing and rendering helpers
    countOcc: countOcc, stripFrontmatter: stripFrontmatter, inlineMd: inlineMd,
    renderMarkdown: renderMarkdown, splitDocLayers: splitDocLayers, paperBodyMarkdown: paperBodyMarkdown,
    readingShellHtml: readingShellHtml, normalizedDoi: normalizedDoi, doiHref: doiHref,
    normalizedSourceUrl: normalizedSourceUrl, urlOnlyLine: urlOnlyLine, sameSourceUrl: sameSourceUrl, authorDisplay: authorDisplay,
    sourcePillHtml: sourcePillHtml, paperIdentityReady: paperIdentityReady,
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
    pinEvidence: pinEvidence, unpinEvidence: unpinEvidence, commit: commit, saveCurrent: saveCurrent,
    railHtml: railHtml, referenceProposalsHtml: referenceProposalsHtml, evidenceListHtml: evidenceListHtml, chipHtml: chipHtml, categoryChipHtml: categoryChipHtml,
    statusLabel: statusLabel, listState: listState, isCaptured: isCaptured, isDone: isDone, paperSubject: paperSubject,
    draftFor: draftFor, saveGate: saveGate, saveMode: saveMode, workDirty: function() { return !!work.dirty; },
    setWork: function(w) { work = w; }, markDirty: markDirty, drafts: function() { return JSON.parse(JSON.stringify(drafts)); },
    capturedCount: capturedCount, visibleRows: visibleRows, filtersHtml: filtersHtml, readFilterQuery: readFilterQuery,
    normalizeAssignment: normalizeAssignment, loadAssignment: loadAssignment, activeAssignee: activeAssignee,
    assigneeFilterAvailable: assigneeFilterAvailable,
    setAssignment: function(obj) { assignment = normalizeAssignment(obj); },
    syncUrl: syncUrl, gotoNextOpen: gotoNextOpen, renderScreening: renderScreening, workspaceBarHtml: workspaceBarHtml,
    modeSwitchAvailable: modeSwitchAvailable, localEditingAvailable: localEditingAvailable,
    setManifestReachable: function(value) { manifestReachable = !!value; },
    setFsSupported: function(value) { fsOverride = value === undefined ? null : !!value; },
    serializeAll: serializeAll, loadLocal: loadLocal, attachHumanContract: attachHumanContract,
    resolveReviewerConflict: resolveReviewerConflict, reviewerConflicts: function() { return JSON.parse(JSON.stringify(reviewerConflicts)); },
    adoptVerifications: adoptVerifications, writeReviewerFile: writeReviewerFile, recordProblem: recordProblem,
    quarantinedRecords: function() { return JSON.parse(JSON.stringify(quarantinedRecords)); },
    bindFolder: bindFolder, reservedKey: reservedKey, replaceGlyphNames: replaceGlyphNames, snippetAround: snippetAround,
    normalizeSearchText: normalizeSearchText, setServedAgentEnvelope: function(obj) { servedAgentEnvelope = obj; adoptAgentTrack(); },
    sourceMarkHtml: sourceMarkHtml, versionMetaHtml: versionMetaHtml, EXPERT_EXCLUSION_REASON: EXPERT_EXCLUSION_REASON,
    corpusListHtml: corpusListHtml, corpusSearchResults: corpusSearchResults,
    setCorpusQuery: function(x) { corpusQuery = String(x || ''); },
    setCorpusIndex: function(x) { corpusIndex = x; }, isScreenable: isScreenable, firstEntryIndex: firstEntryIndex,
    startIndexForPaper: startIndexForPaper,
    evidenceLayer: evidenceLayer, isPaperEvidence: isPaperEvidence,
    paperEvidenceMissing: paperEvidenceMissing,
    recordRequirements: recordRequirements, workingDecisionRecord: workingDecisionRecord,
    // PRISM lifecycle verification (kept separate from ordinary screening commits)
    LIFECYCLE_STATES: LIFECYCLE_STATES, verificationView: verificationView, legacyBaseline: legacyBaseline,
    ensureVerificationContract: ensureVerificationContract, advanceVerification: advanceVerification,
    provenanceHtml: provenanceHtml, historyHtml: historyHtml, actorIds: actorIds,
    annotationBody: annotationBody, annotationDiff: annotationDiff,
    correctedAnnotationBody: correctedAnnotationBody, VERIFICATION_RESULTS: VERIFICATION_RESULTS,
    // verification subject, expert-file record and its load-time projection (ADR-040)
    VERIFICATION_SCHEMA: VERIFICATION_SCHEMA, isAgentTrackPayload: isAgentTrackPayload,
    awaitsVerification: awaitsVerification, subjectRecordHash: subjectRecordHash,
    verificationEntry: verificationEntry, projectVerification: projectVerification,
    agentTrack: function() { return JSON.parse(JSON.stringify(agentTrack)); },
    setAgentTrack: function(reviewer, records) { agentTrack = { reviewer: reviewer, records: JSON.parse(JSON.stringify(records || {})) }; },
    verifications: function(key) { return JSON.parse(JSON.stringify(verificationRecords[key] || [])); },
    setVerifications: function(key, entries) { verificationRecords[key] = JSON.parse(JSON.stringify(entries || [])); },
    provenanceRefLabel: provenanceRefLabel, promptLabel: promptLabel, modelLabel: modelLabel,
    verificationRefList: verificationRefList,
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
    // repo-root connect (ported from the paper lane's ADR-024 by operator decision)
    resolveScopes: resolveScopes, connectScope: function() { return connectScope; },
    screeningHandle: function() { return screeningHandle; },
    setScreeningHandle: function(handle) { screeningHandle = handle; }
};
window.EC = window.EC || {};
window.EC._test = TEST_HOOK;
window.__PRISMA_TEST__ = TEST_HOOK;

})();
