// Review stages of the Korpus view: per work whether a full text exists, the expert
// screening decision, analysis coding and use in Assertions, as a stage filter, work
// lists of the gaps and a compact stage track per table row. research-app.js owns the
// filter pipeline and the URL; this module owns the stage data and its markup.
(function () {
'use strict';

// The productive agent track, the one file with analysis coding (as PRISM's
// SERVED_AGENT_TRACKS); human reviewer files carry no analysis part (ADR-045).
const AGENT_TRACKS = ['ar2'];

const STAGES = [
    { key: 'all', label: 'Identifiziert' },
    { key: 'text', label: 'mit Text', needsText: true },
    { key: 'bewertet', label: 'bewertet' },
    { key: 'eingeschlossen', label: 'eingeschlossen' },
    { key: 'kodiert', label: 'kodiert' },
    { key: 'aussagen', label: 'in Aussagen' },
];

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
    papers.forEach(function (p) { if (p.work_id) workOfRecord[p.id] = p.work_id; });
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
    });
    return Promise.all([agent, claims, text, assignment]);
}

function addAssertion(id, works) {
    works.forEach(function (work) {
        if (!work) return;
        (assertionsByWork[work] = assertionsByWork[work] || new Set()).add(id);
    });
}

// The consolidated expert decision, as the former Human column showed it. PRISM's
// isDone counts it as done as well; open means no such decision.
function decision(paper) {
    if (!paper.benchmark || !paper.benchmark.has_human || !paper.human) return 'open';
    if (paper.human.decision === 'Include') return 'include';
    if (paper.human.decision === 'Exclude') return 'exclude';
    return 'open';
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
    const all = STAGES.concat(GAPS).filter(function (s) { return !s.needsText || textKnown(); }).map(function (s) { return s.key; });
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
    const on = selected === key;
    // A selected empty list stays enabled so that it can be cleared.
    return '<button type="button" class="' + cls + '" data-stage="' + esc(key) + '" aria-pressed="' + on + '"' +
        (n === 0 && !on ? ' disabled' : '') + ' aria-label="' + esc(label + ', ' + werke(n)) + '">' +
        '<span class="stage-label">' + esc(label) + '</span> <span class="stage-n">' + n + '</span></button>';
}

// The funnel over the table. Identifiziert is the unfiltered state, so it is pressed
// while no stage or work list applies.
function barHtml(c, selected) {
    return STAGES.filter(function (s) { return !s.needsText || textKnown(); }).map(function (s) {
        return '<li>' + button('stage-btn', s.key, s.label, c[s.key], selected) + '</li>';
    }).join('');
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

const DECISION_LABEL = { include: 'eingeschlossen', exclude: 'ausgeschlossen', open: 'nicht bewertet' };

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
        '</span>';
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
        Expert_Decision: dec2csv(decision(p)),
        Coded: isCoded(p) ? 'yes' : 'no',
        Assertions: assertionCount(p),
        Assignee: assigneeOf[p.id] || '',
    };
}

function dec2csv(dec) { return dec === 'open' ? '' : dec === 'include' ? 'Include' : 'Exclude'; }

function labelOf(key) {
    const item = STAGES.concat(GAPS).find(function (s) { return s.key === key; });
    if (item) return item.label;
    const r = reviewers.find(function (x) { return offenKey(x) === key; });
    return r ? 'offen, ' + r.label : key;
}

window.EC.korpusStages = {
    load: load, decision: decision, keys: keys, parse: parse, match: match, counts: counts,
    barHtml: barHtml, gapsHtml: gapsHtml, trackHtml: trackHtml, depth: depth, csvFields: csvFields,
    labelOf: labelOf,
    assertionSource: function () { return assertionSource; },
};
})();
