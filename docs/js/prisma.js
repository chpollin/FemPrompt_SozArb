// PRISMA Screening Tool -- fifth view of the Evidence Companion
// Prospective, PRISMA-2020 / PRISMA-trAIce screening on the dual-assessment corpus.
// Human decision is binding (RAISE); the AI proposal is advisory and recorded separately
// so the flow diagram can split AI from human decisions (PRISMA-trAIce R1).
// See knowledge/design.md, knowledge/data.md, knowledge/ai-assisted-review-standards.md.

(function() {
'use strict';

var EC = window.EC;
var initialized = false;

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
    'Gender': 'Gender', 'Diversitaet': 'Diversitaet',
    'Feministisch': 'Feministisch', 'Fairness': 'Fairness'
};

var EXCLUSION_REASONS = ['Duplicate', 'Not_relevant_topic', 'Wrong_publication_type', 'No_full_text', 'Language'];

// Default AI-tool provenance for the seeded 10K assessment (PRISMA-trAIce M2/M6).
var MODEL_DEFAULT = {
    name: 'Claude Haiku 4.5', id: 'claude-haiku-4-5', date: '2026-03-15',
    prompt: 'v2.1', temperature: '0.0', maxTokens: '1024', threshold: '0.5'
};

// PRISMA-trAIce 14 items (Holst et al. 2025, JMIR AI; abridged verbatim).
// auto = item that the project's dual-assessment setup already satisfies.
var TRAICE = [
    { id: 'T1', sec: 'Title', lvl: 'optional', auto: false, text: 'Indicate AI assistance in the title/subtitle if AI played a substantial role (e.g. primary screening, data extraction).' },
    { id: 'A1', sec: 'Abstract', lvl: 'optional', auto: false, text: 'Summarise the AI tool(s) used, the SLR stage(s) applied, and their primary role.' },
    { id: 'I1', sec: 'Introduction', lvl: 'recommended', auto: false, text: 'State the rationale for using AI tools for specific tasks (volume, efficiency, novel methods).' },
    { id: 'M1', sec: 'Methods', lvl: 'mandatory', auto: false, text: 'State whether AI use was pre-specified in the protocol and where it can be accessed; report deviations.' },
    { id: 'M2', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'For each tool: name, version, developer/provider; how to access; for custom tools, how to replicate.' },
    { id: 'M3', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'The specific SLR stage(s) and the precise task(s) the AI performed at each stage.' },
    { id: 'M4', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Input data provided to the tool (search results, abstracts, full texts; training/calibration data).' },
    { id: 'M5', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Output data: format (e.g. structured JSON, labels with confidence) and any automated post-processing.' },
    { id: 'M6', sec: 'Methods', lvl: 'mandatory', auto: false, text: 'Prompt engineering: full prompts (or structure + few-shot), key parameters (temperature, max tokens, top-p), iterative refinement.' },
    { id: 'M7', sec: 'Methods', lvl: 'highly recommended', auto: false, text: 'For non-LLM tools: algorithms/models; settings (e.g. classification thresholds, active-learning parameters).' },
    { id: 'M8', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Human-AI interaction and oversight: reviewers validating AI outputs, independence, proportion verified, discrepancy resolution.' },
    { id: 'M9', sec: 'Methods', lvl: 'mandatory', auto: true, text: 'Methods to evaluate AI performance: reference standard (consensus human decisions); metrics (accuracy, kappa); bias analyses.' },
    { id: 'M10', sec: 'Methods', lvl: 'recommended', auto: true, text: 'Data governance: how input/output/intermediate data was managed and stored; privacy, copyright/ToS compliance.' },
    { id: 'R1', sec: 'Results', lvl: 'mandatory', auto: true, text: 'Flow diagram and text distinguish records included/excluded by AI vs human at each screening stage; report numbers processed by AI.' },
    { id: 'R2', sec: 'Results', lvl: 'mandatory', auto: true, text: 'Report AI performance evaluation results (from M9): quantitative results and AI-human agreement.' },
    { id: 'D1', sec: 'Discussion', lvl: 'recommended', auto: false, text: 'Limitations of AI use (technical issues, biases, hallucinations) and how they may have influenced the review.' },
    { id: 'D2', sec: 'Discussion', lvl: 'optional', auto: false, text: 'The experience of using AI: benefits, challenges, usability, implications for future reviews.' }
];

var LS_KEY = 'femprompt-prisma-session/0.1';

// ============================================================
// State
// ============================================================

var state = {
    surface: 'workspace',
    blind: true,
    reviewer: 'CP',
    index: 0,
    decisions: {},   // paperId -> { categories:{}, decision, reason, ts, reviewer }
    checklist: {},   // itemId -> { status: 'open'|'satisfied'|'na', note }
    disclosure: {}   // overrides of MODEL_DEFAULT + { stage, conflicts, limitations }
};

var papers = [];

// ============================================================
// Persistence
// ============================================================

function serialize() {
    return {
        schema: LS_KEY,
        config: { blind: state.blind, reviewer: state.reviewer,
                  disclosure: state.disclosure },
        decisions: state.decisions,
        checklist: state.checklist
    };
}

function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(serialize())); }
    catch (e) { console.warn('[PRISMA] save failed:', e.message); }
}

function loadSession(obj) {
    if (!obj) return;
    if (obj.config) {
        if (typeof obj.config.blind === 'boolean') state.blind = obj.config.blind;
        if (obj.config.reviewer) state.reviewer = obj.config.reviewer;
        if (obj.config.disclosure) state.disclosure = obj.config.disclosure;
    }
    state.decisions = obj.decisions || {};
    state.checklist = obj.checklist || {};
}

function loadFromStorage() {
    try {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) loadSession(JSON.parse(raw));
    } catch (e) { console.warn('[PRISMA] load failed:', e.message); }
}

// ============================================================
// Init
// ============================================================

window.initializePrisma = function() {
    if (initialized) return;
    initialized = true;

    papers = (EC && EC.getAllPapers) ? (EC.getAllPapers() || []) : [];
    loadFromStorage();

    renderShell();
    showSurface(state.surface || 'workspace');

    console.log('[PRISMA] initialized, ' + papers.length + ' papers in seed corpus');
};

// ============================================================
// Shell + sub-navigation
// ============================================================

var SURFACES = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'flow', label: 'Flow' },
    { id: 'agreement', label: 'Agreement' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'report', label: 'Report' },
    { id: 'data', label: 'Data' }
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
    html += '<label class="pt-blind-toggle" title="KI-Vorschlag erst nach eigener Entscheidung zeigen (Anti-Anchoring)">' +
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
    state.surface = name;
    document.querySelectorAll('.pt-subnav-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.surface === name);
    });
    if (name === 'workspace') renderWorkspace();
    else if (name === 'flow') renderFlow();
    else if (name === 'agreement') renderAgreement();
    else if (name === 'checklist') renderChecklist();
    else if (name === 'report') renderReport();
    else if (name === 'data') renderData();
}

function surfaceEl() { return document.getElementById('pt-surface'); }

// ============================================================
// Decision helpers
// ============================================================

function aiProposal(paper) {
    if (!paper || !paper.llm || !paper.llm.decision) return null;
    return { decision: paper.llm.decision, categories: paper.llm.all_categories || {} };
}

// The effective binding human decision: a session decision overrides the seed.
function humanDecision(paper) {
    var d = state.decisions[paper.id];
    if (d) return { decision: d.decision, categories: d.categories || {}, reason: d.reason, source: 'session' };
    if (paper.human && paper.human.decision)
        return { decision: paper.human.decision, categories: paper.human.all_categories || {}, source: 'seed' };
    return null;
}

function deriveDecision(cats) {
    var tech = TECH_CATS.some(function(c) { return cats[c]; });
    var soc = SOCIAL_CATS.some(function(c) { return cats[c]; });
    return (tech && soc) ? 'Include' : 'Exclude';
}

function divergent(h, a) {
    return h && a && h.decision !== a.decision;
}

// ============================================================
// Aggregation: FlowModel, confusion matrix, kappa
// ============================================================

function computeMatrix() {
    var m = { II: 0, IE: 0, EI: 0, EE: 0, n: 0 };
    papers.forEach(function(p) {
        var h = humanDecision(p), a = aiProposal(p);
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
    var pHumanInc = (m.II + m.IE) / n;
    var pAiInc = (m.II + m.EI) / n;
    var pe = pHumanInc * pAiInc + (1 - pHumanInc) * (1 - pAiInc);
    if (pe === 1) return 1;
    return (po - pe) / (1 - pe);
}

function kappaLabel(k) {
    if (k < 0) return 'poor'; if (k <= 0.20) return 'slight';
    if (k <= 0.40) return 'fair'; if (k <= 0.60) return 'moderate';
    if (k <= 0.80) return 'substantial'; return 'almost perfect';
}

function computeFlow() {
    var f = {
        total: papers.length,
        aiScreened: 0, aiIncl: 0, aiExcl: 0,
        humanScreened: 0, humanIncl: 0, humanExcl: 0,
        humanReasons: {}
    };
    papers.forEach(function(p) {
        var a = aiProposal(p), h = humanDecision(p);
        if (a) { f.aiScreened++; if (a.decision === 'Include') f.aiIncl++; else f.aiExcl++; }
        if (h) {
            f.humanScreened++;
            if (h.decision === 'Include') f.humanIncl++; else f.humanExcl++;
            if (h.decision === 'Exclude' && h.reason)
                f.humanReasons[h.reason] = (f.humanReasons[h.reason] || 0) + 1;
        }
    });
    return f;
}

// ============================================================
// Surface: Screening Workspace
// ============================================================

function renderWorkspace() {
    var el = surfaceEl(); if (!el) return;
    if (!papers.length) { el.innerHTML = '<p class="pt-empty">Keine Paper im Korpus geladen.</p>'; return; }

    if (state.index < 0) state.index = 0;
    if (state.index >= papers.length) state.index = papers.length - 1;
    var p = papers[state.index];

    var sessionDecided = !!state.decisions[p.id];
    var screenedCount = Object.keys(state.decisions).length;
    var h = humanDecision(p);
    var a = aiProposal(p);
    var cats = (h && h.source === 'session') ? h.categories : {};
    var showAi = a && (!state.blind || sessionDecided);

    var html = '';
    html += '<div class="pt-ws-bar">';
    html += '<span class="pt-ws-pos">Paper ' + (state.index + 1) + ' / ' + papers.length + '</span>';
    html += '<span class="pt-ws-prog">' + screenedCount + ' in dieser Session gescreent</span>';
    html += '<span class="pt-ws-rev">Reviewer ' + EC.escapeHtml(state.reviewer) + '</span>';
    html += '<span class="pt-spacer"></span>';
    html += '<button class="pt-btn pt-nav-prev"' + (state.index === 0 ? ' disabled' : '') + '>&larr;</button>';
    html += '<button class="pt-btn pt-nav-next"' + (state.index === papers.length - 1 ? ' disabled' : '') + '>&rarr;</button>';
    html += '<button class="pt-btn pt-nav-skip" title="Naechstes ungescreentes">naechstes offen</button>';
    html += '</div>';

    html += '<div class="pt-ws">';

    // Left: the paper
    html += '<div class="pt-ws-paper">';
    html += '<h3 class="pt-paper-title">' + EC.escapeHtml(p.title || '(ohne Titel)') + '</h3>';
    html += '<p class="pt-paper-meta">' + EC.escapeHtml(p.author_year || '') +
        (p.source_tool ? ' &middot; ' + EC.escapeHtml(p.source_tool) : '') + '</p>';
    if (p.abstract && p.abstract.trim()) {
        html += '<div class="pt-paper-abstract"><h4>Abstract</h4><p>' + EC.escapeHtml(p.abstract) + '</p></div>';
    } else {
        html += '<p class="pt-muted">Kein Abstract vorhanden.</p>';
    }
    if (p.knowledge && p.knowledge.summary) {
        html += '<div class="pt-paper-kd"><h4>Wissensdokument</h4><p>' + EC.escapeHtml(p.knowledge.summary) + '</p></div>';
    }
    html += '</div>';

    // Right: the decision
    html += '<div class="pt-ws-decide">';
    html += '<div class="pt-decide-head">Deine Entscheidung <span class="pt-binding">bindend</span></div>';

    html += '<div class="pt-cat-group"><span class="pt-cat-dim">Technik</span><div class="pt-cats">';
    TECH_CATS.forEach(function(c) { html += catToggle(c, cats[c]); });
    html += '</div></div>';
    html += '<div class="pt-cat-group"><span class="pt-cat-dim">Sozial</span><div class="pt-cats">';
    SOCIAL_CATS.forEach(function(c) { html += catToggle(c, cats[c]); });
    html += '</div></div>';

    var derived = deriveDecision(cats);
    html += '<div class="pt-derived">Abgeleitet: <strong class="pt-dec-' + derived.toLowerCase() + '">' + derived + '</strong> ' +
        '<span class="pt-muted">(&ge;1 Technik UND &ge;1 Sozial)</span></div>';

    html += '<div class="pt-decide-actions">';
    html += '<button class="pt-decide-btn pt-incl" data-dec="Include">Include</button>';
    html += '<button class="pt-decide-btn pt-excl" data-dec="Exclude">Exclude</button>';
    html += '</div>';
    html += '<div class="pt-reason-row" style="display:none;"><label>Ausschlussgrund</label><select class="pt-reason">';
    EXCLUSION_REASONS.forEach(function(r) { html += '<option value="' + r + '">' + r.replace(/_/g, ' ') + '</option>'; });
    html += '</select></div>';
    html += '<button class="pt-save-btn">Speichern &amp; weiter &nbsp;&crarr;</button>';

    if (sessionDecided) {
        html += '<p class="pt-saved-note">Gespeichert: <strong class="pt-dec-' + state.decisions[p.id].decision.toLowerCase() + '">' +
            state.decisions[p.id].decision + '</strong>' +
            (state.decisions[p.id].reason ? ' (' + state.decisions[p.id].reason.replace(/_/g, ' ') + ')' : '') + '</p>';
    }

    // AI reveal
    html += '<div class="pt-ai-reveal">';
    if (!a) {
        html += '<p class="pt-muted">Kein KI-Vorschlag fuer dieses Paper.</p>';
    } else if (!showAi) {
        html += '<p class="pt-ai-hidden">KI-Vorschlag verborgen (Blind-Modus) &mdash; erst nach deiner Entscheidung.</p>';
    } else {
        var dv = h && divergent(h, a);
        html += '<div class="pt-ai-head">KI &middot; ' + EC.escapeHtml(MODEL_DEFAULT.name) +
            ' &middot; Prompt ' + MODEL_DEFAULT.prompt + ' &rarr; <strong class="pt-dec-' + a.decision.toLowerCase() + '">' +
            a.decision + '</strong> <span class="pt-advisory">advisory</span></div>';
        if (dv) {
            html += '<div class="pt-divergence">Divergenz (Entscheidung): du ' +
                (h.decision) + ' &middot; KI ' + a.decision + '</div>';
        }
        var catDiffs = ALL_CATS.filter(function(c) {
            return !!(cats[c]) !== !!(a.categories[c]) && (h && h.source === 'session');
        });
        if (catDiffs.length) {
            html += '<div class="pt-divergence pt-cat-div">Kategorie-Divergenz: ' +
                catDiffs.map(function(c) { return CAT_LABELS[c] + ' (du ' + (cats[c] ? 'Ja' : 'Nein') +
                    ', KI ' + (a.categories[c] ? 'Ja' : 'Nein') + ')'; }).join(', ') + '</div>';
        }
    }
    html += '</div>';

    html += '</div>';  // pt-ws-decide
    html += '</div>';  // pt-ws

    el.innerHTML = html;
    attachWorkspace(p, derived);
}

function catToggle(cat, on) {
    var color = (EC.CAT_COLORS && EC.CAT_COLORS[cat]) || 'var(--gray-400)';
    return '<button class="pt-cat-toggle' + (on ? ' on' : '') + '" data-cat="' + cat +
        '" style="--c:' + color + ';">' + EC.escapeHtml(CAT_LABELS[cat]) + '</button>';
}

function attachWorkspace(p, derived) {
    var el = surfaceEl(); if (!el) return;

    // working copy of categories for live derive
    var working = {};
    var h = humanDecision(p);
    if (h && h.source === 'session') ALL_CATS.forEach(function(c) { working[c] = !!h.categories[c]; });

    el.querySelectorAll('.pt-cat-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var c = btn.dataset.cat;
            working[c] = !working[c];
            btn.classList.toggle('on', working[c]);
            var d = deriveDecision(working);
            var dEl = el.querySelector('.pt-derived strong');
            if (dEl) { dEl.textContent = d; dEl.className = 'pt-dec-' + d.toLowerCase(); }
        });
    });

    var reasonRow = el.querySelector('.pt-reason-row');
    el.querySelectorAll('.pt-decide-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            el.querySelectorAll('.pt-decide-btn').forEach(function(b) { b.classList.remove('chosen'); });
            btn.classList.add('chosen');
            if (reasonRow) reasonRow.style.display = btn.dataset.dec === 'Exclude' ? '' : 'none';
        });
    });

    function commit() {
        var chosen = el.querySelector('.pt-decide-btn.chosen');
        var decision = chosen ? chosen.dataset.dec : deriveDecision(working);
        var reason = null;
        if (decision === 'Exclude') {
            var rs = el.querySelector('.pt-reason');
            reason = rs ? rs.value : EXCLUSION_REASONS[1];
        }
        state.decisions[p.id] = {
            categories: working, decision: decision, reason: reason,
            ts: new Date().toISOString(), reviewer: state.reviewer
        };
        save();
        if (state.index < papers.length - 1) state.index++;
        renderWorkspace();
    }

    var saveBtn = el.querySelector('.pt-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', commit);

    el.querySelector('.pt-nav-prev').addEventListener('click', function() { if (state.index > 0) { state.index--; renderWorkspace(); } });
    el.querySelector('.pt-nav-next').addEventListener('click', function() { if (state.index < papers.length - 1) { state.index++; renderWorkspace(); } });
    el.querySelector('.pt-nav-skip').addEventListener('click', function() {
        for (var i = state.index + 1; i < papers.length; i++) {
            if (!state.decisions[papers[i].id]) { state.index = i; renderWorkspace(); return; }
        }
        for (var j = 0; j < papers.length; j++) {
            if (!state.decisions[papers[j].id]) { state.index = j; renderWorkspace(); return; }
        }
    });

    // keyboard: Enter saves
    el.onkeydown = function(e) {
        if (e.key === 'Enter' && (e.target.tagName !== 'SELECT')) { e.preventDefault(); commit(); }
    };
}

// ============================================================
// Surface: PRISMA Flow Diagram (PRISMA-trAIce R1 split)
// ============================================================

function renderFlow() {
    var el = surfaceEl(); if (!el) return;
    var f = computeFlow();

    var html = '<div class="pt-flow">';
    html += '<div class="pt-flow-box pt-flow-id"><div class="pt-flow-h">Identification</div>' +
        '<div class="pt-flow-n">Records identified&nbsp; n = ' + f.total + '</div>' +
        '<div class="pt-flow-sub">Seed corpus (Deep Research + manual + Zotero)</div></div>';
    html += '<div class="pt-flow-arrow">&darr;</div>';

    html += '<div class="pt-flow-h pt-flow-stage">Screening</div>';
    html += '<div class="pt-flow-split">';
    html += '<div class="pt-flow-lane pt-lane-ai"><div class="pt-lane-h">KI-Tool (evaluativ)</div>' +
        '<div class="pt-lane-n">gescreent ' + f.aiScreened + '</div>' +
        '<div class="pt-lane-r">Include ' + f.aiIncl + ' &middot; Exclude ' + f.aiExcl + '</div>' +
        '<div class="pt-lane-note">advisory</div></div>';
    html += '<div class="pt-flow-lane pt-lane-human"><div class="pt-lane-h">Mensch (Reviewer)</div>' +
        '<div class="pt-lane-n">gescreent ' + f.humanScreened + '</div>' +
        '<div class="pt-lane-r">Include ' + f.humanIncl + ' &middot; Exclude ' + f.humanExcl + '</div>' +
        '<div class="pt-lane-note">bindend</div></div>';
    html += '</div>';

    if (Object.keys(f.humanReasons).length) {
        html += '<div class="pt-flow-reasons"><strong>Ausschlussgruende (Session, Mensch):</strong> ';
        html += Object.keys(f.humanReasons).map(function(r) {
            return r.replace(/_/g, ' ') + ' ' + f.humanReasons[r];
        }).join(' &middot; ');
        html += '</div>';
    }

    html += '<div class="pt-flow-arrow">&darr;</div>';
    html += '<div class="pt-flow-box pt-flow-incl"><div class="pt-flow-h">Included</div>' +
        '<div class="pt-flow-n">Mensch (bindend) ' + f.humanIncl + '</div>' +
        '<div class="pt-flow-sub">KI (advisory) ' + f.aiIncl + '</div></div>';
    html += '</div>';

    html += '<p class="pt-flow-caption">PRISMA-2020-Fluss mit PRISMA-trAIce-R1-Split: KI- und Mensch-Entscheidungen getrennt ausgewiesen. ' +
        'Aus dem Seed-Korpus reproduziert; eigene Screening-Entscheidungen ueberschreiben die Mensch-Spalte live.</p>';
    el.innerHTML = html;
}

// ============================================================
// Surface: Agreement Panel
// ============================================================

function renderAgreement() {
    var el = surfaceEl(); if (!el) return;
    var m = computeMatrix();
    var k = cohenKappa(m);
    var kappas = (EC && EC.getKappas) ? EC.getKappas() : {};

    var humanInclRate = m.n ? Math.round((m.II + m.IE) / m.n * 1000) / 10 : 0;
    var aiInclRate = m.n ? Math.round((m.II + m.EI) / m.n * 1000) / 10 : 0;

    var html = '<div class="pt-agree">';
    html += '<div class="pt-matrix-wrap">';
    html += '<div class="pt-matrix-title">Konfusionsmatrix &middot; <span class="pt-kappa">&kappa; = ' +
        k.toFixed(3) + ' &ldquo;' + kappaLabel(k) + '&rdquo;</span> &middot; n = ' + m.n + '</div>';
    html += '<table class="pt-matrix"><thead><tr><th></th><th>KI Include</th><th>KI Exclude</th></tr></thead><tbody>';
    html += '<tr><th>Mensch Include</th><td class="pt-cell" data-cell="II">' + m.II + '</td><td class="pt-cell" data-cell="IE">' + m.IE + '</td></tr>';
    html += '<tr><th>Mensch Exclude</th><td class="pt-cell" data-cell="EI">' + m.EI + '</td><td class="pt-cell" data-cell="EE">' + m.EE + '</td></tr>';
    html += '</tbody></table>';
    html += '<div class="pt-rates">Mensch Include-Rate <strong>' + humanInclRate + '%</strong> &middot; ' +
        'KI Include-Rate <strong>' + aiInclRate + '%</strong></div>';
    html += '<p class="pt-muted">Eine Zelle anklicken filtert den Workspace auf diese Paper.</p>';
    html += '</div>';

    html += '<div class="pt-catkappa"><h4>Kategorie-Kappas (Korpus-Benchmark)</h4>';
    ALL_CATS.forEach(function(c) {
        var d = kappas[c]; if (!d) return;
        var kv = (d.kappa != null) ? d.kappa : 0;
        var color = (EC.CAT_COLORS && EC.CAT_COLORS[c]) || 'var(--primary)';
        html += '<div class="pt-kbar-row"><span class="pt-kbar-label">' + CAT_LABELS[c] + '</span>' +
            '<span class="pt-kbar-track"><span class="pt-kbar-fill" style="width:' + Math.max(0, kv * 100) + '%;background:' + color + ';"></span></span>' +
            '<span class="pt-kbar-val">' + kv.toFixed(2) + '</span></div>';
    });
    html += '</div>';
    html += '</div>';
    el.innerHTML = html;

    el.querySelectorAll('.pt-cell').forEach(function(td) {
        td.addEventListener('click', function() { filterWorkspaceByCell(td.dataset.cell); });
    });
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
// Surface: Checklist Tracker (PRISMA-trAIce)
// ============================================================

function renderChecklist() {
    var el = surfaceEl(); if (!el) return;
    var html = '<div class="pt-check">';
    html += '<p class="pt-check-intro">PRISMA-trAIce (Holst et al. 2025), 14 Items. Auto-markierte Items erfuellt das Dual-Assessment-Setup bereits. ' +
        'PRISMA-2020-Vollcheckliste (27 Items): siehe offizielle Vorlage.</p>';
    var lastSec = '';
    TRAICE.forEach(function(it) {
        if (it.sec !== lastSec) { html += '<div class="pt-check-sec">' + it.sec + '</div>'; lastSec = it.sec; }
        var st = state.checklist[it.id] || {};
        var status = st.status || (it.auto ? 'satisfied' : 'open');
        html += '<div class="pt-check-item" data-id="' + it.id + '">';
        html += '<div class="pt-check-row">';
        html += '<button class="pt-check-status pt-st-' + status + '" data-id="' + it.id + '">' + status + '</button>';
        html += '<span class="pt-check-id">' + it.id + '</span>';
        html += '<span class="pt-check-lvl pt-lvl-' + it.lvl.split(' ')[0] + '">' + it.lvl + '</span>';
        if (it.auto) html += '<span class="pt-check-auto">auto</span>';
        html += '</div>';
        html += '<p class="pt-check-text">' + EC.escapeHtml(it.text) + '</p>';
        html += '<input class="pt-check-note" data-id="' + it.id + '" placeholder="Notiz" value="' +
            EC.escapeHtml(st.note || '') + '">';
        html += '</div>';
    });
    html += '<button class="pt-btn pt-check-export">Checkliste exportieren (.md)</button>';
    html += '</div>';
    el.innerHTML = html;

    el.querySelectorAll('.pt-check-status').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.dataset.id;
            var cur = (state.checklist[id] && state.checklist[id].status) ||
                (TRAICE.find(function(t) { return t.id === id; }).auto ? 'satisfied' : 'open');
            var next = cur === 'open' ? 'satisfied' : cur === 'satisfied' ? 'na' : 'open';
            state.checklist[id] = state.checklist[id] || {};
            state.checklist[id].status = next;
            save(); renderChecklist();
        });
    });
    el.querySelectorAll('.pt-check-note').forEach(function(inp) {
        inp.addEventListener('change', function() {
            var id = inp.dataset.id;
            state.checklist[id] = state.checklist[id] || {};
            state.checklist[id].note = inp.value;
            save();
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
        lines.push('- [' + (status === 'satisfied' ? 'x' : ' ') + '] ' + it.id + ' (' + it.lvl + '): ' +
            it.text + (st.note ? ' -- ' + st.note : ''));
    });
    download('prisma-traice-checklist.md', lines.join('\n'), 'text/markdown');
}

// ============================================================
// Surface: Disclosure / Report Generator
// ============================================================

function disc(field) {
    return (state.disclosure[field] != null) ? state.disclosure[field] : (MODEL_DEFAULT[field] || '');
}

function renderReport() {
    var el = surfaceEl(); if (!el) return;
    var fields = [
        ['name', 'Modell'], ['date', 'Datum'], ['prompt', 'Prompt-Version'],
        ['temperature', 'Temperature'], ['threshold', 'Confidence-Schwelle'],
        ['stage', 'Stage'], ['conflicts', 'Conflicts of Interest'], ['limitations', 'Limitationen']
    ];
    if (state.disclosure.stage == null) state.disclosure.stage = 'Screening';
    if (state.disclosure.conflicts == null) state.disclosure.conflicts = 'none';

    var html = '<div class="pt-report">';
    html += '<div class="pt-report-form">';
    fields.forEach(function(f) {
        var big = (f[0] === 'limitations');
        html += '<label class="pt-field"><span>' + f[1] + '</span>' +
            (big ? '<textarea class="pt-rin" data-f="' + f[0] + '" rows="2">' + EC.escapeHtml(disc(f[0])) + '</textarea>'
                 : '<input class="pt-rin" data-f="' + f[0] + '" value="' + EC.escapeHtml(disc(f[0])) + '">') +
            '</label>';
    });
    html += '</div>';
    html += '<div class="pt-report-preview"><div class="pt-prev-head">Vorschau (Markdown)</div>' +
        '<pre class="pt-prev" id="pt-prev"></pre>' +
        '<div class="pt-report-actions">' +
        '<button class="pt-btn pt-copy">Kopieren</button>' +
        '<button class="pt-btn pt-exp-md">Export .md</button></div></div>';
    html += '</div>';
    el.innerHTML = html;

    el.querySelectorAll('.pt-rin').forEach(function(inp) {
        inp.addEventListener('input', function() {
            state.disclosure[inp.dataset.f] = inp.value; save(); updatePreview();
        });
    });
    el.querySelector('.pt-copy').addEventListener('click', function() {
        navigator.clipboard && navigator.clipboard.writeText(disclosureMarkdown());
    });
    el.querySelector('.pt-exp-md').addEventListener('click', function() {
        download('ai-use-disclosure.md', disclosureMarkdown(), 'text/markdown');
    });
    updatePreview();
}

function updatePreview() {
    var pre = document.getElementById('pt-prev');
    if (pre) pre.textContent = disclosureMarkdown();
}

function disclosureMarkdown() {
    var m = computeMatrix();
    var k = cohenKappa(m);
    var lines = [];
    lines.push('## AI use disclosure (PRISMA-trAIce / RAISE)');
    lines.push('');
    lines.push('Screening of ' + m.n + ' records used ' + disc('name') + ' (prompt ' + disc('prompt') +
        ', temperature ' + disc('temperature') + '), date ' + disc('date') + '.');
    lines.push('Stage: ' + disc('stage') + '. The AI proposal is advisory; every record was screened ' +
        'independently by a human reviewer, whose decision is binding (RAISE).');
    lines.push('Performance evaluation against the human reference standard (PRISMA-trAIce M9/R2): ' +
        "Cohen's kappa " + k.toFixed(3) + ' (' + kappaLabel(k) + '); confusion matrix ' +
        m.II + '/' + m.IE + '/' + m.EI + '/' + m.EE + ' (Human-Include/AI-Include, H-Incl/AI-Excl, H-Excl/AI-Incl, both-Exclude).');
    lines.push('Confidence threshold: ' + disc('threshold') + '. Conflicts of interest: ' + disc('conflicts') + '.');
    if (disc('limitations')) lines.push('Limitations: ' + disc('limitations'));
    lines.push('');
    lines.push('Flow diagram distinguishes AI from human decisions (PRISMA-trAIce R1). Tool identity, prompt, ' +
        'and parameters disclosed per M2/M6.');
    return lines.join('\n');
}

// ============================================================
// Surface: Data I/O
// ============================================================

function renderData() {
    var el = surfaceEl(); if (!el) return;
    var n = Object.keys(state.decisions).length;
    var html = '<div class="pt-data">';
    html += '<div class="pt-data-row"><strong>Session</strong><span class="pt-muted">' + n +
        ' eigene Entscheidungen, autosave aktiv</span></div>';
    html += '<div class="pt-data-actions">';
    html += '<button class="pt-btn pt-exp-session">Session exportieren (.json)</button>';
    html += '<button class="pt-btn pt-exp-csv">Decision-Log (.csv)</button>';
    html += '<label class="pt-btn pt-imp-label">Session importieren<input type="file" accept=".json" class="pt-imp" hidden></label>';
    html += '<button class="pt-btn pt-load-seed">Seed-Korpus laden</button>';
    html += '<button class="pt-btn pt-clear">Session leeren</button>';
    html += '</div>';
    html += '<p class="pt-muted">Seed-Korpus = ' + papers.length + ' Paper aus dem bestehenden Dual-Assessment. ' +
        'Eigene Entscheidungen ueberschreiben die Mensch-Spalte; ohne eigene Entscheidung gilt die Seed-Bewertung.</p>';
    html += '</div>';
    el.innerHTML = html;

    el.querySelector('.pt-exp-session').addEventListener('click', function() {
        download('prisma-session.json', JSON.stringify(serialize(), null, 2), 'application/json');
    });
    el.querySelector('.pt-exp-csv').addEventListener('click', exportCsv);
    el.querySelector('.pt-load-seed').addEventListener('click', function() { showSurface('workspace'); });
    el.querySelector('.pt-clear').addEventListener('click', function() {
        if (!confirm('Eigene Session-Entscheidungen verwerfen?')) return;
        state.decisions = {}; state.index = 0; save(); showSurface('workspace');
    });
    el.querySelector('.pt-imp').addEventListener('change', function(e) {
        var file = e.target.files[0]; if (!file) return;
        var r = new FileReader();
        r.onload = function() {
            try { loadSession(JSON.parse(r.result)); save(); renderShell(); showSurface('data'); }
            catch (err) { alert('Import fehlgeschlagen: ' + err.message); }
        };
        r.readAsText(file);
    });
}

function exportCsv() {
    var rows = [['id', 'title', 'human_decision', 'human_source', 'ai_decision', 'divergent', 'reason']];
    papers.forEach(function(p) {
        var h = humanDecision(p), a = aiProposal(p);
        rows.push([
            p.id, '"' + (p.title || '').replace(/"/g, '""') + '"',
            h ? h.decision : '', h ? h.source : '',
            a ? a.decision : '', (divergent(h, a) ? 'yes' : 'no'),
            (h && h.reason) ? h.reason : ''
        ]);
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
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

})();
