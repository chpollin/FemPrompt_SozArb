// Review stages of the Korpus view: per work whether a full text exists, the human
// screening decision, analysis coding and use in Assertions, as two stage bars, work
// lists of the gaps, a stage track with the reached stage and the next step per row. research-app.js owns the
// filter pipeline and the URL; this module owns the stage data and its markup.
(function () {
'use strict';

// The productive agent track, the one file with analysis coding (as PRISM's
// SERVED_AGENT_TRACKS); human reviewer files carry no analysis part (ADR-045).
const AGENT_TRACKS = ['ar2'];

// Two bars, because the stages are not nested: the agent coded and the Assertions cite
// works of round two that no human screened, so one funnel would overstate how many
// coded works passed the screening. Each Auswertung stage therefore carries the subset
// with a human Include as a subordinate filter of its own.
const SCREENING = [
    { key: 'all', label: 'Identifiziert' },
    { key: 'text', label: 'mit Text', needsText: true },
    { key: 'bewertet', label: 'bewertet' },
    { key: 'eingeschlossen', label: 'eingeschlossen' },
];
const AUSWERTUNG = [
    { key: 'kodiert', label: 'kodiert' },
    { key: 'aussagen', label: 'in Aussagen' },
];
const INCLUDED_SUFFIX = '-eingeschlossen';
const STAGES = SCREENING.concat(AUSWERTUNG);
const SUBS = AUSWERTUNG.map(function (s) {
    return { key: s.key + INCLUDED_SUFFIX, parent: s.key, label: s.label + ', davon eingeschlossen' };
});

const GAPS = [
    { key: 'ohne-text', label: 'ohne Volltext', needsText: true },
    { key: 'offen', label: 'offen' },
    { key: 'nicht-kodiert', label: 'eingeschlossen, nicht kodiert' },
    { key: 'ohne-aussage', label: 'eingeschlossen, ohne Aussage' },
];

// null while the git-ignored reading-layer manifest is absent (Pages, a clone before
// npm run build): the text stage is then unknown, never "ohne Volltext".
let manifest = null;
const codedWorks = new Set();
const assertionsByWork = {};
let assertionSource = null; // 'working', 'released' or null
let reviewers = []; // [{ key, label }] from the assignment
const assigneeOf = {};
const workOfRecord = {};
const corpusRecord = {};
// paper id -> { decision, categories, ts, reviewer } of the newest saved human reviewer record
const humanRecord = {};

function fetchJson(url) {
    return fetch(url)
        .then(function (response) { return response.ok ? response.json() : null; })
        .catch(function () { return null; });
}

function esc(text) { return window.EC.escapeHtml(text); }

// Coding and Assertions are outcomes of a Work, so they reach every corpus record of
// that Work; the corpus work_id decides, since agent records may carry an older one.
function workOf(recordId, fallback) {
    return workOfRecord[recordId] || fallback || null;
}

function load(papers) {
    papers.forEach(function (p) {
        corpusRecord[p.id] = p;
        if (p.work_id) workOfRecord[p.id] = p.work_id;
    });
    const agent = Promise.all(AGENT_TRACKS.map(function (key) {
        return fetchJson('data/screening/' + key + '.json');
    })).then(function (tracks) {
        tracks.forEach(function (track) {
            const decisions = track && track.decisions;
            if (!decisions || typeof decisions !== 'object') return;
            Object.keys(decisions).forEach(function (pid) {
                const fields = decisions[pid] && decisions[pid].analysis && decisions[pid].analysis.fields;
                if (fields && typeof fields === 'object' && Object.keys(fields).length) {
                    const work = workOf(pid, decisions[pid].work_id);
                    if (work) codedWorks.add(work);
                }
            });
        });
    });
    // The local working file holds drafts as well; the released index stands in where it is absent.
    const claims = fetchJson('data/assertions_working.json').then(function (working) {
        if (working && Array.isArray(working.assertions)) {
            assertionSource = 'working';
            working.assertions.forEach(function (a) {
                addAssertion(a.id, (a.works || []).map(function (w) { return workOf(w.record_id, w.work_id); }));
            });
            return;
        }
        return fetchJson('data/assertion_index.json').then(function (index) {
            if (!index || !Array.isArray(index.assertions)) return;
            assertionSource = 'released';
            index.assertions.forEach(function (a) {
                addAssertion(a.id, (a.evidence || []).map(function (e) { return workOf(e.record_id, e.work_id); }));
            });
        });
    });
    const text = fetchJson('data/fulltext_manifest.json').then(function (m) {
        manifest = m && typeof m === 'object' && !Array.isArray(m) ? m : null;
    });
    const assignment = fetchJson('data/screening/assignment.json').then(function (a) {
        if (!a || !Array.isArray(a.reviewers) || !a.assignments || typeof a.assignments !== 'object') return;
        reviewers = a.reviewers.filter(function (r) {
            return r && /^[a-z0-9_-]+$/i.test(String(r.key || ''));
        }).map(function (r) { return { key: String(r.key), label: String(r.label || r.key) }; });
        Object.keys(a.assignments).forEach(function (pid) {
            const key = a.assignments[pid];
            if (reviewers.some(function (r) { return r.key === key; })) assigneeOf[pid] = key;
        });
    }).then(function () {
        // PRISM writes reviewer keys in lower case; an agent track never counts as human screening.
        return Promise.all(reviewers.map(function (r) {
            const key = r.key.toLowerCase();
            if (AGENT_TRACKS.indexOf(key) >= 0) return null;
            return fetchJson('data/screening/' + key + '.json').then(function (file) { addReviewerFile(key, file); });
        }));
    });
    return Promise.all([agent, claims, text, assignment]);
}

// A saved reviewer file, read with the checks PRISM applies before it loads one
// (validateReviewerEnvelope, isAgentTrackPayload, recordProblem): an unusable file or
// record is skipped, never guessed at. The file is a trust boundary like the URL.
function addReviewerFile(key, file) {
    if (!file || typeof file !== 'object' || Array.isArray(file)) return;
    if (!/^femprompt-prisma-reviewer\/0\.[12345]$/.test(String(file.schema || ''))) return;
    if (file.actor === 'agent') return;
    const decisions = file.decisions;
    if (!decisions || typeof decisions !== 'object' || Array.isArray(decisions)) return;
    Object.keys(decisions).forEach(function (pid) {
        const rec = decisions[pid];
        const paper = corpusRecord[pid];
        if (!paper || !rec || typeof rec !== 'object' || Array.isArray(rec)) return;
        if (rec.actor === 'agent') return;
        if (['Include', 'Exclude', 'Unclear'].indexOf(rec.decision) === -1) return;
        if (rec.work_id && rec.version_id && paper.work_id && paper.version_id &&
            (rec.work_id !== paper.work_id || rec.version_id !== paper.version_id)) return;
        const ts = String(rec.ts || file.updated || '');
        const known = humanRecord[pid];
        // Two reviewers on one paper: the later record is the current assessment.
        if (known && known.ts >= ts) return;
        // categories set on a formal exclusion were not judged on the content (ADR-048)
        const basis = rec.evidence_basis || {};
        const judged = assignedCategories(rec.categories).filter(function (cat) { return basis[cat] !== 'formal_exclusion'; });
        humanRecord[pid] = { decision: rec.decision, categories: judged, ts: ts, reviewer: key };
    });
}

// The categories a reviewer record assigns, at teilweise or ja, as PRISM's catLevel reads
// them (a legacy boolean and the numeric strings coerce like their numbers).
function assignedCategories(cats) {
    if (!cats || typeof cats !== 'object' || Array.isArray(cats)) return [];
    return Object.keys(cats).filter(function (cat) {
        const v = cats[cat];
        return v === true || v === 1 || v === 2 || v === '1' || v === '2';
    });
}

function addAssertion(id, works) {
    works.forEach(function (work) {
        if (!work) return;
        (assertionsByWork[work] = assertionsByWork[work] || new Set()).add(id);
    });
}

// The current human screening decision in the order of PRISM's paperSubject: a saved
// reviewer record first, since it is always the later assessment (it confirms or
// corrects the round-one decision it was seeded from, ADR-042), else the consolidated
// expert decision of round one. PRISM's isDone counts both as done; open means neither.
function decision(paper) {
    const own = humanRecord[paper.id];
    if (own) return own.decision === 'Include' ? 'include' : own.decision === 'Exclude' ? 'exclude' : 'unclear';
    if (!paper.benchmark || !paper.benchmark.has_human || !paper.human) return 'open';
    if (paper.human.decision === 'Include') return 'include';
    if (paper.human.decision === 'Exclude') return 'exclude';
    return 'open';
}

// The categories of the human decision that decision() reads: the saved reviewer record,
// else the consolidated expert decision. An open work has none, so null; the round-one
// LLM categories never stand in for them (ADR-044).
function humanCategories(paper) {
    const own = humanRecord[paper.id];
    if (own) return own.categories.slice();
    if (decision(paper) === 'open') return null;
    const cats = paper.human.all_categories || {};
    return Object.keys(cats).filter(function (cat) { return cats[cat] === 1; });
}

// The reviewer key of a saved record, 'expert' for the round-one decision, '' when open.
function decisionSource(paper) {
    if (humanRecord[paper.id]) return humanRecord[paper.id].reviewer;
    return decision(paper) === 'open' ? '' : 'expert';
}

function hasUnclear() {
    return Object.keys(humanRecord).some(function (pid) { return humanRecord[pid].decision === 'Unclear'; });
}

function hasText(paper) {
    if (!manifest) return null;
    const entry = manifest[paper.id];
    return Boolean(entry && entry.src && entry.src !== 'none');
}

function isCoded(paper) { return codedWorks.has(paper.work_id); }

function assertionCount(paper) {
    const set = assertionsByWork[paper.work_id];
    return set ? set.size : 0;
}

function textKnown() { return manifest !== null; }

function offenKey(reviewer) { return 'offen-' + reviewer.key; }

function keys() {
    const all = STAGES.concat(SUBS, GAPS).filter(function (s) { return !s.needsText || textKnown(); }).map(function (s) { return s.key; });
    return all.concat(reviewers.map(offenKey));
}

// Normalizes a stage from the URL, a trust boundary; anything else is no filter.
function parse(value) {
    const v = String(value || '');
    return keys().indexOf(v) >= 0 ? v : 'all';
}

function match(key, p) {
    switch (key) {
        case 'text': return hasText(p) === true;
        case 'bewertet': return decision(p) !== 'open';
        case 'eingeschlossen': return decision(p) === 'include';
        case 'kodiert': return isCoded(p);
        case 'aussagen': return assertionCount(p) > 0;
        case 'kodiert' + INCLUDED_SUFFIX: return isCoded(p) && decision(p) === 'include';
        case 'aussagen' + INCLUDED_SUFFIX: return assertionCount(p) > 0 && decision(p) === 'include';
        case 'ohne-text': return hasText(p) === false;
        case 'offen': return decision(p) === 'open';
        case 'nicht-kodiert': return decision(p) === 'include' && !isCoded(p);
        case 'ohne-aussage': return decision(p) === 'include' && assertionCount(p) === 0;
        default:
            if (key.indexOf('offen-') === 0) return decision(p) === 'open' && assigneeOf[p.id] === key.slice(6);
            return true;
    }
}

function counts(papers) {
    const c = {};
    keys().forEach(function (key) {
        c[key] = papers.filter(function (p) { return match(key, p); }).length;
    });
    return c;
}

function werke(n) { return n === 1 ? '1 Werk' : n + ' Werke'; }

function button(cls, key, label, n, selected) {
    // Identifiziert is the whole corpus, so it clears a stage but is never itself pressed.
    const on = selected === key && key !== 'all';
    // A selected empty list stays enabled so that it can be cleared.
    return '<button type="button" class="' + cls + '" data-stage="' + esc(key) + '" aria-pressed="' + on + '"' +
        (n === 0 && !on ? ' disabled' : '') + ' aria-label="' + esc(label + ', ' + werke(n)) + '">' +
        '<span class="stage-label">' + esc(label) + '</span> <span class="stage-n">' + n + '</span></button>';
}

// The subordinate filter of an Auswertung stage: smaller and introduced by "davon", so
// its rank shows in size and wording, not in colour.
function subButton(sub, n, selected) {
    const on = selected === sub.key;
    return '<button type="button" class="stage-sub" data-stage="' + esc(sub.key) + '" aria-pressed="' + on + '"' +
        (n === 0 && !on ? ' disabled' : '') + ' aria-label="' + esc(sub.label + ', ' + werke(n)) + '">' +
        '<span class="stage-label">davon</span> <span class="stage-n">' + n + '</span> eingeschlossen</button>';
}

function group(id, label, items) {
    return '<div class="stage-group" role="group" aria-labelledby="' + id + '">' +
        '<span class="stage-group-h" id="' + id + '">' + esc(label) + '</span>' +
        '<ul class="stage-list">' + items + '</ul></div>';
}

// Two bars over the table. No stage is pressed while no stage or work list applies.
function barHtml(c, selected) {
    const screening = SCREENING.filter(function (s) { return !s.needsText || textKnown(); }).map(function (s) {
        return '<li>' + button('stage-btn', s.key, s.label, c[s.key], selected) + '</li>';
    }).join('');
    const auswertung = AUSWERTUNG.map(function (s) {
        const sub = SUBS.find(function (x) { return x.parent === s.key; });
        return '<li class="stage-item">' + button('stage-btn', s.key, s.label, c[s.key], selected) +
            subButton(sub, c[sub.key], selected) + '</li>';
    }).join('');
    return group('stage-h-screening', 'Screening', screening) + group('stage-h-auswertung', 'Auswertung', auswertung);
}

function gapsHtml(c, selected) {
    return GAPS.filter(function (g) { return !g.needsText || textKnown(); }).map(function (g) {
        let html = '<li>' + button('gap-btn', g.key, g.label, c[g.key], selected);
        if (g.key === 'offen' && reviewers.length) {
            html += '<ul class="gap-sub">' + reviewers.map(function (r) {
                return '<li>' + button('gap-btn', offenKey(r), 'offen, ' + r.label, c[offenKey(r)], selected) + '</li>';
            }).join('') + '</ul>';
        }
        return html + '</li>';
    }).join('');
}

const DECISION_LABEL = { include: 'eingeschlossen', exclude: 'ausgeschlossen', unclear: 'unklar', open: 'nicht bewertet' };

function mark(kind, state, label) {
    return '<span class="st-mark st-mark--' + kind + ' is-' + state + '" role="img" aria-label="' +
        esc(label) + '" title="' + esc(label) + '"></span>';
}

// Four marks in a fixed order; on and off differ in fill, the decision in its glyph,
// so no state rests on colour alone.
function trackHtml(p) {
    const text = hasText(p);
    const dec = decision(p);
    const n = assertionCount(p);
    return '<span class="stage-track">' +
        mark('text', text === null ? 'unknown' : (text ? 'on' : 'off'),
            text === null ? 'Volltext unbekannt' : (text ? 'Volltext vorhanden' : 'kein Volltext')) +
        mark('dec', dec, 'Screening: ' + DECISION_LABEL[dec]) +
        mark('code', isCoded(p) ? 'on' : 'off', isCoded(p) ? 'kodiert' : 'nicht kodiert') +
        mark('claim', n ? 'on' : 'off', n ? 'in ' + (n === 1 ? '1 Aussage' : n + ' Aussagen') : 'in keiner Aussage') +
        '</span><span class="st-reached">' + esc(reached(p)) + '</span>';
}

// The furthest stage a work has reached, in the order of the two bars.
function reached(p) {
    const dec = decision(p);
    if (assertionCount(p)) return 'in Aussagen';
    if (isCoded(p)) return 'kodiert';
    if (dec !== 'open') return DECISION_LABEL[dec];
    if (hasText(p)) return 'mit Text';
    return 'identifiziert';
}

// The first open step in the order of the stages, read from the same data as the work
// lists: an excluded work has none, an Unclear record still awaits a decision.
const NEXT = {
    text: 'Volltext beschaffen', screen: 'bewerten', decide: 'entscheiden',
    code: 'kodieren', claim: 'Aussage bilden',
};

function nextStep(p) {
    const dec = decision(p);
    if (dec === 'exclude') return null;
    if (hasText(p) === false) return { key: 'text', label: NEXT.text };
    if (dec === 'open') return { key: 'screen', label: NEXT.screen };
    if (dec === 'unclear') return { key: 'decide', label: NEXT.decide };
    if (!isCoded(p)) return { key: 'code', label: NEXT.code };
    if (!assertionCount(p)) return { key: 'claim', label: NEXT.claim };
    return null;
}

function nextHtml(p) {
    const next = nextStep(p);
    return next ? '<span class="st-next st-next--' + next.key + '">' + esc(next.label) + '</span>' : '';
}

// The four marks in text, for the detail panel.
function stateItems(p) {
    const text = hasText(p);
    const dec = decision(p);
    const source = decisionSource(p);
    const reviewer = reviewers.find(function (r) { return r.key.toLowerCase() === source; });
    const n = assertionCount(p);
    const items = [];
    if (text !== null) items.push(['Volltext', text ? 'vorhanden' : 'fehlt']);
    items.push(['Screening', DECISION_LABEL[dec] + (source === 'expert' ? ', Expert:innen Runde 1' : reviewer ? ', ' + reviewer.label : '')]);
    if (dec === 'open' && assigneeOf[p.id]) {
        const assignee = reviewers.find(function (r) { return r.key === assigneeOf[p.id]; });
        if (assignee) items.push(['Zugeteilt', assignee.label]);
    }
    items.push(['Kodierung', isCoded(p) ? 'kodiert' : 'nicht kodiert']);
    items.push(['Aussagen', n ? (n === 1 ? '1 Aussage' : n + ' Aussagen') : 'keine']);
    const next = nextStep(p);
    items.push(['Nächster Schritt', next ? next.label : 'keiner']);
    return items;
}

// How far a work has come, for the sort by stage.
function depth(p) {
    const dec = decision(p);
    return (hasText(p) ? 1 : 0) + (dec !== 'open' ? 1 : 0) + (dec === 'include' ? 1 : 0) +
        (isCoded(p) ? 1 : 0) + (assertionCount(p) ? 1 : 0);
}

function csvFields(p) {
    const text = hasText(p);
    return {
        Fulltext: text === null ? '' : (text ? 'yes' : 'no'),
        Screening_Decision: dec2csv(decision(p)),
        Screening_Source: decisionSource(p),
        Coded: isCoded(p) ? 'yes' : 'no',
        Assertions: assertionCount(p),
        Assignee: assigneeOf[p.id] || '',
    };
}

function dec2csv(dec) { return { include: 'Include', exclude: 'Exclude', unclear: 'Unclear' }[dec] || ''; }

function labelOf(key) {
    const item = STAGES.concat(SUBS, GAPS).find(function (s) { return s.key === key; });
    if (item) return item.label;
    const r = reviewers.find(function (x) { return offenKey(x) === key; });
    return r ? 'offen, ' + r.label : key;
}

window.EC.korpusStages = {
    load: load, decision: decision, decisionSource: decisionSource, humanCategories: humanCategories, hasUnclear: hasUnclear,
    keys: keys, parse: parse, match: match, counts: counts,
    barHtml: barHtml, gapsHtml: gapsHtml, trackHtml: trackHtml, depth: depth, csvFields: csvFields,
    labelOf: labelOf, reached: reached, nextStep: nextStep, nextHtml: nextHtml, stateItems: stateItems, hasText: hasText,
    assertionSource: function () { return assertionSource; },
};
})();
